/**
 * The contract shared by the TTS route and the browser player.
 *
 * Import-free on purpose: `/api/tts` pulls this module in, and validating a
 * voice name must not drag the cast (and its chart / d3 imports) into the
 * server bundle.
 */

/** Built-in OpenAI voices. */
export const VOICES = [
	'alloy',
	'ash',
	'ballad',
	'cedar',
	'coral',
	'echo',
	'fable',
	'marin',
	'nova',
	'onyx',
	'sage',
	'shimmer',
	'verse'
] as const;

export type Voice = (typeof VOICES)[number];

/** The languages a line is ever spoken in — whichever one is on screen. */
export type VoiceLang = 'ko' | 'en';

/** One dialogue block is one clip; the longest in the chronicle is ~630 chars. */
export const SPEECH_MAX_CHARS = 1000;

/** Style directions ride in the URL, so they stay short. */
export const SPEECH_MAX_INSTRUCTIONS = 400;

/**
 * Cache generation. Clips are cached by URL and never revalidated, so bumping
 * this is how a new model or a new house style retires the old audio — no
 * cache-busting gymnastics in the browser.
 */
export const SPEECH_VERSION = '1';

const VOICE_SET: ReadonlySet<string> = new Set(VOICES);

export function isVoice(v: string | null | undefined): v is Voice {
	return !!v && VOICE_SET.has(v);
}

export function isVoiceLang(v: string | null | undefined): v is VoiceLang {
	return v === 'ko' || v === 'en';
}

const ENTITY: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: ' ',
	hellip: '…',
	mdash: '—',
	ndash: '–',
	lsquo: '‘',
	rsquo: '’',
	ldquo: '“',
	rdquo: '”'
};

function entity(ref: string): string {
	if (ref[0] === '#') {
		const code =
			ref[1] === 'x' || ref[1] === 'X'
				? Number.parseInt(ref.slice(2), 16)
				: Number.parseInt(ref.slice(1), 10);
		return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : '';
	}
	return ENTITY[ref.toLowerCase()] ?? '';
}

/** Whitespace-normalised single line. */
export function collapse(s: string): string {
	return s.replace(/\s+/g, ' ').trim();
}

/**
 * What the reader actually sees, from the HTML a line is authored in.
 *
 * Tags are dropped rather than unwrapped, which is what the browser does with
 * them too: `<i>여인</i>` keeps its text, while `<계백>` — a quotation mark in
 * this story rather than markup — parses as an empty unknown element and never
 * reaches the page. The voice has to say what the page says.
 */
export function plainText(html: string): string {
	return collapse(
		html
			.replace(/<[^>]*>/g, '')
			.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (_, ref: string) => entity(ref))
	);
}

/** Is there anything here a voice could say? (rules out “…” and lone dashes) */
export function speakable(s: string): boolean {
	return /[\p{L}\p{N}]/u.test(s);
}

/**
 * The query half of a clip's URL. Insertion order is fixed so the same line
 * always resolves to the same URL — that URL *is* the cache key, in the
 * browser and in the route's own memory.
 */
export function speechQuery(p: {
	text: string;
	lang: VoiceLang;
	voice: Voice;
	instructions?: string;
}): string {
	const q = new URLSearchParams();
	q.set('v', SPEECH_VERSION);
	q.set('lang', p.lang);
	q.set('voice', p.voice);
	if (p.instructions) q.set('i', p.instructions.slice(0, SPEECH_MAX_INSTRUCTIONS));
	q.set('text', p.text);
	return q.toString();
}
