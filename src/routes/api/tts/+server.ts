/**
 * Text to speech for dialogue.
 *
 * A GET route rather than a POST one, because the whole point is that a line
 * has a *URL*: the browser's HTTP cache then holds every clip a reader has
 * already heard, and re-reading a scene costs nothing. The query string is the
 * cache key end to end — browser, any CDN in front of us, and the small LRU
 * below, which keeps a warm server instance from paying twice for the same
 * line when two readers (or two tabs) land on it.
 */

import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import {
	SPEECH_MAX_CHARS,
	SPEECH_MAX_INSTRUCTIONS,
	collapse,
	isVoice,
	isVoiceLang,
	plainText,
	speakable,
	type VoiceLang
} from '$lib/speech';
import type { RequestHandler } from './$types';

/** Overridable so an OpenAI-compatible gateway (or a test stub) can stand in. */
const ENDPOINT = env.OPENAI_TTS_ENDPOINT?.trim() || 'https://api.openai.com/v1/audio/speech';

/** mp3 is the widest-playing format and small enough to cache aggressively. */
const FORMAT = 'mp3';
const MIME = 'audio/mpeg';

const YEAR_S = 60 * 60 * 24 * 365;

/** Upstream can be slow on a cold model; give up before the platform does. */
const UPSTREAM_TIMEOUT_MS = 30_000;

/* ————— in-process clip cache ————— */

type Clip = { bytes: ArrayBuffer; etag: string };

const MEM_MAX_BYTES = 32 * 1024 * 1024;
const mem = new Map<string, Clip>();
let memBytes = 0;

/** Requests for a line already being synthesised wait on the same call. */
const inflight = new Map<string, Promise<Clip>>();

/** Map hit doubles as an LRU touch — re-inserting moves the key to the end. */
function recall(key: string): Clip | undefined {
	const clip = mem.get(key);
	if (!clip) return undefined;
	mem.delete(key);
	mem.set(key, clip);
	return clip;
}

function remember(key: string, clip: Clip) {
	if (clip.bytes.byteLength > MEM_MAX_BYTES) return;
	mem.set(key, clip);
	memBytes += clip.bytes.byteLength;
	for (const [k, v] of mem) {
		if (memBytes <= MEM_MAX_BYTES) break;
		if (k === key) continue;
		mem.delete(k);
		memBytes -= v.bytes.byteLength;
	}
}

/* ————— a floor under the bill ————— */

/**
 * Cache misses only: a reader re-hearing a scene is free, but nobody gets to
 * drive our key as an open synthesis proxy either.
 */
const FRESH_PER_WINDOW = 60;
const WINDOW_MS = 60_000;
const spent = new Map<string, { n: number; until: number }>();

function overspending(who: string): boolean {
	const now = Date.now();
	const seen = spent.get(who);
	if (!seen || now > seen.until) {
		spent.set(who, { n: 1, until: now + WINDOW_MS });
		if (spent.size > 5000) {
			for (const [k, v] of spent) if (now > v.until) spent.delete(k);
		}
		return false;
	}
	seen.n += 1;
	return seen.n > FRESH_PER_WINDOW;
}

/* ————— synthesis ————— */

async function etagOf(key: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
	const hex = [...new Uint8Array(digest)]
		.slice(0, 16)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return `"${hex}"`;
}

/** Style direction when the caller sent none — language is carried here too. */
function houseStyle(lang: VoiceLang): string {
	return lang === 'ko'
		? 'Read only this line, in natural Korean, as a character in a 7th-century Korean court drama.'
		: 'Read only this line, unhurried, as a character in a 7th-century Korean court drama.';
}

async function synthesise(
	key: string,
	body: Record<string, string>,
	apiKey: string
): Promise<Clip> {
	const pending = inflight.get(key);
	if (pending) return pending;

	const call = (async () => {
		let res: Response;
		try {
			res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: {
					authorization: `Bearer ${apiKey}`,
					'content-type': 'application/json'
				},
				body: JSON.stringify(body),
				signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
			});
		} catch (e) {
			/* Unreachable, DNS, or timed out — none of which reaches the block below,
			   and all of which would otherwise surface as a bare 500. */
			const timedOut = e instanceof DOMException && e.name === 'TimeoutError';
			console.error('[tts] could not reach the speech provider:', e);
			error(
				timedOut ? 504 : 502,
				timedOut
					? `Speech synthesis timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s`
					: 'Could not reach the speech provider'
			);
		}

		if (!res.ok) {
			const detail = collapse(await res.text().catch(() => '')).slice(0, 400);
			console.error(`[tts] ${res.status} from OpenAI: ${detail}`);
			error(
				res.status === 429 || res.status >= 500 ? 503 : 502,
				`Speech synthesis failed (${res.status}). ${detail || 'No detail from the provider.'}`
			);
		}

		const bytes = await res.arrayBuffer();
		if (!bytes.byteLength) error(502, 'Speech synthesis returned no audio');

		const clip: Clip = { bytes, etag: await etagOf(key) };
		remember(key, clip);
		return clip;
	})();

	inflight.set(key, call);
	try {
		return await call;
	} finally {
		inflight.delete(key);
	}
}

function respond(clip: Clip, fresh: boolean, ifNoneMatch: string | null): Response {
	const headers: Record<string, string> = {
		etag: clip.etag,
		/* The URL fully determines the audio, so it can never go stale. */
		'cache-control': `public, max-age=${YEAR_S}, immutable`,
		'x-tts-cache': fresh ? 'miss' : 'hit'
	};

	if (ifNoneMatch && ifNoneMatch.split(',').some((t) => t.trim() === clip.etag)) {
		return new Response(null, { status: 304, headers });
	}

	return new Response(clip.bytes, {
		headers: {
			...headers,
			'content-type': MIME,
			'content-length': String(clip.bytes.byteLength)
		}
	});
}

export const GET: RequestHandler = async ({ url, request, getClientAddress }) => {
	const apiKey = env.OPENAI_API_KEY?.trim();
	if (!apiKey) error(503, 'No OPENAI_API_KEY on the server — dialogue has no voice yet');

	const text = collapse(plainText(url.searchParams.get('text') ?? ''));
	if (!text || !speakable(text)) error(400, 'Nothing to say — `text` is empty');
	if (text.length > SPEECH_MAX_CHARS) {
		error(413, `That line is ${text.length} characters; the limit is ${SPEECH_MAX_CHARS}`);
	}

	const voice = url.searchParams.get('voice');
	if (voice !== null && !isVoice(voice)) error(400, `Unknown voice "${voice}"`);

	const langParam = url.searchParams.get('lang');
	if (langParam !== null && !isVoiceLang(langParam)) error(400, `Unknown language "${langParam}"`);
	const lang: VoiceLang = langParam ?? 'en';

	const model = env.OPENAI_TTS_MODEL?.trim() || 'gpt-4o-mini-tts';
	/* `tts-1` / `tts-1-hd` reject style directions; only the 4o voices take them. */
	const styleable = !model.startsWith('tts-1');
	const instructions = styleable
		? collapse(url.searchParams.get('i') ?? '').slice(0, SPEECH_MAX_INSTRUCTIONS) ||
			houseStyle(lang)
		: '';

	const body: Record<string, string> = {
		model,
		input: text,
		voice: voice ?? 'alloy',
		response_format: FORMAT
	};
	if (instructions) body.instructions = instructions;

	const key = `${model}\u0000${FORMAT}\u0000${body.voice}\u0000${lang}\u0000${instructions}\u0000${text}`;
	const ifNoneMatch = request.headers.get('if-none-match');

	const cached = recall(key);
	if (cached) return respond(cached, false, ifNoneMatch);

	if (overspending(getClientAddress())) {
		error(429, 'Too many new lines at once — give the voice a moment');
	}

	return respond(await synthesise(key, body, apiKey), true, ifNoneMatch);
};
