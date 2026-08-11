/**
 * The voice of the dialogue.
 *
 * One `<audio>` element for the whole chronicle, because only one line is ever
 * spoken at a time: advancing to the next line has to cut the last one off
 * mid-word, the way a scene change does. Clips are addressed by URL and cached
 * by the browser, so a re-read of a scene is silent on the network and free on
 * the bill (see `/api/tts`).
 *
 * The line spoken is always the line on screen: Korean while Korean is shown,
 * English otherwise, and never both — a bilingual reader would rather hear the
 * original than sit through a translation of what they just heard.
 */

import { browser } from '$app/environment';
import { reading } from '$lib/reading.svelte';
import { collapse, plainText, speakable, speechQuery, type Voice, type VoiceLang } from '$lib/speech';
import { instructionsFor, voiceFor } from '$lib/voices';

/** One dialogue block, in both languages, as it appears on the page. */
export type Utterance = {
	ko: string;
	en: string;
	person: string | null;
};

export const speech = $state({
	/** Speak the live line as the reader arrives at it. */
	auto: false,
	/** Key of the line loaded in the element, or null when nothing is cued. */
	key: null as string | null,
	/** Waiting on the network — first hearing of a line takes a second or two. */
	loading: false,
	playing: false,
	error: null as string | null
});

/* ————— what to say ————— */

type Cue = { key: string; url: string; text: string; lang: VoiceLang; voice: Voice };

/** Join the lines of one block into a single spoken paragraph. */
function paragraph(lines: readonly string[] | undefined, authored: boolean): string {
	if (!lines?.length) return '';
	return collapse(lines.map((l) => (authored ? plainText(l) : collapse(l))).join(' '));
}

/**
 * Build an utterance from authored block data (`lines` / `en` carry markup) —
 * `plainText` resolves it to exactly what the browser puts on screen.
 */
export function utteranceOf(
	lines: readonly string[] | undefined,
	en: readonly string[] | undefined,
	person: string | null
): Utterance {
	return { ko: paragraph(lines, true), en: paragraph(en, true), person };
}

/** The line under the reading band — already plain text, read from the page. */
export function activeUtterance(): Utterance {
	return {
		ko: paragraph(reading.linesKo, false),
		en: paragraph(reading.linesEn, false),
		person: reading.speaker
	};
}

/**
 * Resolve an utterance against the reader's language to the one clip that
 * should sound, or null when there is nothing sayable in it.
 */
function cue(u: Utterance | null): Cue | null {
	if (!u) return null;

	let text: string;
	let lang: VoiceLang;
	if (reading.lang !== 'en' && u.ko) {
		text = u.ko;
		lang = 'ko';
	} else if (u.en) {
		text = u.en;
		lang = 'en';
	} else if (u.ko) {
		/* English-only reader, untranslated line — the Korean is what is shown. */
		text = u.ko;
		lang = 'ko';
	} else {
		return null;
	}

	if (!speakable(text)) return null;

	const voice = voiceFor(u.person);
	const instructions = instructionsFor(u.person, lang);
	return {
		key: `${lang}\u0000${voice}\u0000${text}`,
		url: `/api/tts?${speechQuery({ text, lang, voice, instructions })}`,
		text,
		lang,
		voice
	};
}

/** Identity of the clip this utterance would play, for “is this one live?”. */
export function speechKeyOf(u: Utterance | null): string | null {
	return cue(u)?.key ?? null;
}

/* ————— the element ————— */

let el: HTMLAudioElement | undefined;
let cued: string | null = null;

function fail(message: string) {
	speech.loading = false;
	speech.playing = false;
	speech.error = message;
}

/**
 * A failed `<audio>` load reports nothing useful, so ask the route the same
 * question over fetch — it answers with a real message (no key, rate limited,
 * provider refused), and a hit costs nothing but a cache read.
 */
async function explain(url: string) {
	try {
		const res = await fetch(url);
		if (res.ok) {
			fail('That clip arrived but would not play');
			return;
		}
		const body = await res.json().catch(() => null);
		fail(typeof body?.message === 'string' ? body.message : `Voice unavailable (${res.status})`);
	} catch {
		fail('Voice unavailable — the request never landed');
	}
}

function audio(): HTMLAudioElement | undefined {
	if (!browser) return undefined;
	if (el) return el;

	el = new Audio();
	el.preload = 'auto';

	el.addEventListener('playing', () => {
		speech.loading = false;
		speech.playing = true;
	});
	el.addEventListener('ended', () => {
		speech.loading = false;
		speech.playing = false;
		speech.key = null;
	});
	el.addEventListener('error', () => {
		/* A superseded src fires as it is torn down — nothing is cued then. */
		if (!cued || speech.key === null) return;
		void explain(cued);
	});

	return el;
}

export function stopSpeech() {
	speech.loading = false;
	speech.playing = false;
	speech.key = null;
	if (!el) return;
	el.pause();
	try {
		el.currentTime = 0;
	} catch {
		/* nothing loaded yet */
	}
}

/** Cut off whatever is sounding and speak this line instead. */
export function speak(u: Utterance | null) {
	const next = cue(u);
	if (!next) {
		stopSpeech();
		return;
	}

	const player = audio();
	if (!player) return;

	player.pause();
	speech.error = null;
	speech.playing = false;
	speech.loading = true;
	speech.key = next.key;

	if (cued === next.url) {
		player.currentTime = 0;
	} else {
		cued = next.url;
		player.src = next.url;
	}

	player.play().catch((e: unknown) => {
		if (e instanceof DOMException && e.name === 'NotAllowedError') {
			fail('Tap the page once to let it speak');
		} else if (e instanceof DOMException && e.name === 'AbortError') {
			/* superseded by the next line — not a failure */
		} else {
			void explain(next.url);
		}
	});
}

/** Play this line, or stop it if it is the one already sounding. */
export function toggleSpeech(u: Utterance | null) {
	const key = speechKeyOf(u);
	if (key && speech.key === key && (speech.playing || speech.loading)) {
		stopSpeech();
		return;
	}
	speak(u);
}

/* ————— following the reader ————— */

/** Key last handed to `syncSpeech`, so a re-run does not restart the line. */
let synced: string | null = null;

/** Browsers refuse to start audio before a gesture — see `initSpeech`. */
let armed = false;

/**
 * Called from an effect: when the live line changes, silence the old one and —
 * if the reader asked for a voice — speak the new one. Reading `reading.*`
 * through `activeUtterance` is what subscribes the effect to the reading band.
 */
export function syncSpeech(live: boolean) {
	const u = activeUtterance();
	const key = speechKeyOf(u);
	if (key === synced) return;
	synced = key;

	stopSpeech();
	if (live && armed && speech.auto && key) speak(u);
}

export function setAutoSpeech(on: boolean) {
	speech.auto = on;
	try {
		localStorage.setItem('kingdom:voice', on ? '1' : '0');
	} catch {
		/* private mode — the preference just won't persist */
	}
	/* The click that switched it on is itself the gesture audio was waiting for. */
	if (on) {
		armed = true;
		speak(activeUtterance());
	} else {
		stopSpeech();
	}
}

export function toggleAutoSpeech() {
	setAutoSpeech(!speech.auto);
}

/**
 * Restore the saved preference and wait for a first gesture before speaking on
 * its own, so a reader who left the voice on doesn't land on a blocked-audio
 * complaint they never asked for. Returns a teardown.
 */
export function initSpeech() {
	try {
		speech.auto = localStorage.getItem('kingdom:voice') === '1';
	} catch {
		/* default stays off */
	}

	const arm = () => {
		armed = true;
	};
	window.addEventListener('pointerdown', arm, { passive: true, once: true });
	window.addEventListener('keydown', arm, { passive: true, once: true });

	return () => {
		window.removeEventListener('pointerdown', arm);
		window.removeEventListener('keydown', arm);
		stopSpeech();
		el = undefined;
		cued = null;
		synced = null;
		armed = false;
	};
}
