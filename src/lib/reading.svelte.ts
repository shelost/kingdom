/**
 * Shared reading state: which "mood" the page is in as you scroll, and the
 * reader's language / presentation preference.
 *
 * The watcher is scroll-driven rather than IntersectionObserver-driven, because
 * the page background has to change *continuously* with the reading position —
 * and a missed observer callback would strand the page in the wrong mood.
 */

import { browser } from '$app/environment';
import { chapters } from '$lib/story';
import { scriptUi } from '$lib/scriptUi.svelte';
import { tocUi } from '$lib/tocUi.svelte';

export type Lang = 'both' | 'en' | 'ko';

/**
 * script    = scroll layout without speaker plate
 * immersion = VN/game speaker plate over the reading column
 * cinema    = viewport grid: letterboxed scene, script rail, character, dialogue
 */
export type ReadMode = 'script' | 'immersion' | 'cinema';

/** full = continuous story; episodes = one entry at a time */
export type ViewScope = 'full' | 'episodes';

/** side = sticky images column; inline = images in the reading flow by beat */
export type ImageLayout = 'side' | 'inline';

export type EpisodeRef = {
	chapterId: string;
	chapterIndex: number;
	entryIndex: number;
	id: string;
};

/** Flat episode list — chapterId-entryIndex ids match TOC / URL hashes. */
export const episodes: EpisodeRef[] = chapters.flatMap((ch, chapterIndex) =>
	ch.entries.map((_, entryIndex) => ({
		chapterId: ch.id,
		chapterIndex,
		entryIndex,
		id: `${ch.id}-${entryIndex}`
	}))
);

export const reading = $state({
	/** true while a flashback (whole entry or inline) is under the reading line */
	flash: false,
	/** track name of the entry being read, if it declares one */
	music: null as string | null,
	/** place id of the entry being read — drives the corner map */
	place: null as string | null,
	/** story year of the entry in the reading band — drives life-stage faces */
	year: null as number | null,
	/** id of the entry in the reading band ("chapterId-index") — drives episode packaging */
	entryId: null as string | null,
	/** 0…1 — how far the reading band has travelled through that entry */
	entryProgress: 0,
	/** person id of the dialogue currently in the reading band (immersion) */
	speaker: null as string | null,
	/** optional life-stage id pinned by the live dialogue block (`PersonStage.id`) */
	look: null as string | null,
	/** plain-text lines for the featured Pokémon-style dialogue box */
	linesKo: [] as string[],
	linesEn: [] as string[],
	/** Tang / Chinese native + pinyin (subtitle layers) */
	linesZh: [] as string[],
	linesZhLatn: [] as string[],
	/** Yamato / Japanese native + Hepburn romaji (subtitle layers) */
	linesJa: [] as string[],
	linesJaLatn: [] as string[],
	lang: 'both' as Lang,
	/** Immersion by default; loadMode() restores a saved script preference. */
	mode: 'immersion' as ReadMode,
	/** Continuous scroll by default; loadViewScope() restores episodes if saved. */
	viewScope: 'full' as ViewScope,
	/** Sticky side column by default; loadImageLayout() restores inline if saved. */
	imageLayout: 'side' as ImageLayout,
	/** Flat index into `episodes` when viewScope === 'episodes'. */
	episodeIndex: 0
});

/* The reading *band*: an element counts as "being read" while any part of it
   sits in the upper-middle of the viewport. Shared with activateDialogue so a
   clicked line lands exactly where the watcher would have picked it up. */
const BAND_TOP = 0.18;
const BAND_BOTTOM = 0.62;
const BAND_MID = (BAND_TOP + BAND_BOTTOM) / 2;

/** Hard cap on how long a clicked line may hold the stage while it travels. */
const PIN_MS = 2000;
/** How near the band's middle counts as "the glide has arrived", in viewports. */
const PIN_SETTLED = 0.06;

function persistMode(m: ReadMode) {
	try {
		localStorage.setItem('kingdom:mode', m);
	} catch {
		/* private mode */
	}
}

function persistViewScope(s: ViewScope) {
	try {
		localStorage.setItem('kingdom:view', s);
	} catch {
		/* private mode */
	}
}

function persistImageLayout(l: ImageLayout) {
	try {
		localStorage.setItem('kingdom:images', l);
	} catch {
		/* private mode */
	}
}

/**
 * Mirror the mode onto <html>.
 *
 * `is-stage` is worn by every mode that puts a live speaker on a stage
 * (immersion and cinema), so the shared dialogue behaviour — dimmed script
 * lines, a lit live line, clickable dialogue — is written once.
 */
function applyModeClasses(m: ReadMode) {
	const root = document.documentElement.classList;
	root.toggle('is-immersion', m === 'immersion');
	root.toggle('is-cinema', m === 'cinema');
	root.toggle('is-stage', m !== 'script');
	if (m !== 'cinema') root.remove('is-cinema-peek');
}

function normalizeMode(v: string | null): ReadMode | null {
	if (v === 'script' || v === 'immersion' || v === 'cinema') return v;
	if (v === 'chronicle') return 'script';
	if (v === 'immersive') return 'immersion';
	return null;
}

/** Modes that put the live line on a stage — immersion's plate, cinema's strip. */
export function isStageMode(m: ReadMode = reading.mode) {
	return m !== 'script';
}

export function setLang(l: Lang) {
	reading.lang = l;
	try {
		localStorage.setItem('kingdom:lang', l);
	} catch {
		/* private mode — preference just won't persist */
	}
	/* The plate's lines are read off the page, so a language it was not showing
	   a moment ago is simply absent from them. Re-measure once the new rendering
	   has landed, or the plate (and the voice) would keep the old language until
	   the reader happened to scroll. */
	requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}

export function setMode(m: ReadMode) {
	reading.mode = m;
	releaseDialogue();
	persistMode(m);
	applyModeClasses(m);
	// refresh speaker / speaking highlight for the new mode
	window.dispatchEvent(new Event('scroll'));
}

export function loadLang() {
	try {
		const v = localStorage.getItem('kingdom:lang');
		if (v === 'en' || v === 'ko' || v === 'both') reading.lang = v;
	} catch {
		/* ignore */
	}
}

export function loadMode() {
	try {
		const raw = localStorage.getItem('kingdom:mode');
		const next = normalizeMode(raw);
		if (next) {
			reading.mode = next;
			if (raw !== next) persistMode(next);
		}
	} catch {
		/* ignore */
	}
	applyModeClasses(reading.mode);
}

export function loadViewScope() {
	try {
		const v = localStorage.getItem('kingdom:view');
		if (v === 'full' || v === 'episodes') reading.viewScope = v;
	} catch {
		/* ignore */
	}
	if (reading.viewScope === 'episodes') syncEpisodeFromHash({ scroll: false });
}

export function setImageLayout(l: ImageLayout) {
	reading.imageLayout = l;
	persistImageLayout(l);
	/* Sticky runway / inline figures change layout height — re-measure the band. */
	requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}

export function loadImageLayout() {
	try {
		const v = localStorage.getItem('kingdom:images');
		if (v === 'side' || v === 'inline') reading.imageLayout = v;
	} catch {
		/* ignore */
	}
}

/**
 * Capture which entry the reader is on (hash → reading band → keep index).
 * Used when switching into episodes mode mid-story.
 */
function captureCurrentEpisode() {
	if (typeof document === 'undefined') return;
	const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
	const fromHash = hash ? resolveEpisodeIndex(hash) : -1;
	if (fromHash >= 0) {
		reading.episodeIndex = fromHash;
		return;
	}

	const top = window.innerHeight * BAND_TOP;
	const bottom = window.innerHeight * BAND_BOTTOM;
	const mid = (top + bottom) / 2;
	let best: HTMLElement | null = null;
	let bestD = Infinity;
	for (const el of scriptRoot().querySelectorAll<HTMLElement>('article.entry')) {
		const r = el.getBoundingClientRect();
		if (r.top > bottom || r.bottom < top) continue;
		const d = Math.abs((Math.max(r.top, top) + Math.min(r.bottom, bottom)) / 2 - mid);
		if (d < bestD) {
			bestD = d;
			best = el;
		}
	}
	if (best?.id) {
		const idx = resolveEpisodeIndex(best.id);
		if (idx >= 0) reading.episodeIndex = idx;
	}
}

export function setViewScope(s: ViewScope) {
	reading.viewScope = s;
	persistViewScope(s);
	releaseDialogue();

	if (s === 'episodes') {
		captureCurrentEpisode();
		const ep = episodes[reading.episodeIndex];
		if (ep) replaceHash(ep.id);
	}

	const after = () => {
		const ep = episodes[reading.episodeIndex];
		if (!ep) {
			window.dispatchEvent(new Event('scroll'));
			return;
		}
		/* Only jump when already past cover/blurb — don't yank readers off the title. */
		const el = document.getElementById(ep.id);
		if (el && scriptUi.inScript) {
			el.scrollIntoView({ behavior: 'auto', block: 'start' });
		}
		window.dispatchEvent(new Event('scroll'));
	};

	/* Episodes → full needs a frame for every entry to mount; full → episodes too. */
	requestAnimationFrame(() => requestAnimationFrame(after));
}

/** Resolve a chapter or entry id to a flat episode index, or -1. */
export function resolveEpisodeIndex(id: string): number {
	const exact = episodes.findIndex((e) => e.id === id);
	if (exact >= 0) return exact;
	const first = episodes.findIndex((e) => e.chapterId === id);
	return first;
}

function replaceHash(id: string) {
	try {
		history.replaceState(null, '', `#${encodeURIComponent(id)}`);
	} catch {
		/* ignore */
	}
}

export function syncEpisodeFromHash(opts: { scroll?: boolean } = {}) {
	if (typeof location === 'undefined') return false;
	const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
	if (!hash) return false;
	return goToEpisodeById(hash, { hash: false, scroll: opts.scroll ?? false, closeToc: false });
}

/**
 * Jump to an episode by flat index. Updates hash, closes TOC, scrolls into view.
 */
export function goToEpisode(index: number, opts: { hash?: boolean; scroll?: boolean; closeToc?: boolean } = {}) {
	if (!episodes.length) return;
	const next = Math.max(0, Math.min(episodes.length - 1, index));
	reading.episodeIndex = next;
	releaseDialogue();

	const ep = episodes[next];
	if (opts.hash !== false) replaceHash(ep.id);
	if (opts.closeToc !== false) tocUi.open = false;

	const scroll = opts.scroll !== false;
	const finish = () => {
		if (scroll) {
			const el = document.getElementById(ep.id);
			/* Auto after remount — smooth scroll has nothing to interpolate from. */
			if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
			else document.getElementById('script')?.scrollIntoView({ behavior: 'auto', block: 'start' });
		}
		window.dispatchEvent(new Event('scroll'));
	};

	requestAnimationFrame(() => requestAnimationFrame(finish));
}

export function goToEpisodeById(
	id: string,
	opts: { hash?: boolean; scroll?: boolean; closeToc?: boolean } = {}
): boolean {
	const idx = resolveEpisodeIndex(id);
	if (idx < 0) return false;
	goToEpisode(idx, opts);
	return true;
}

export function stepEpisode(delta: number) {
	goToEpisode(reading.episodeIndex + delta);
}

/** entry id last seen by the speaker tracker — module-scoped so measure can close over it */
let lastEntry: string | null = null;

/**
 * The reading document — the band watcher, the speaking marker and the episode
 * capture only ever look inside `#script`. The cinema stage mounts a second
 * copy of the same blocks in its script rail (fixed chrome, its own scroll),
 * which must never be mistaken for the page being read.
 */
function scriptRoot(): ParentNode {
	return document.getElementById('script') ?? document;
}

/** A clicked dialogue, held as the live one until the glide to it has settled. */
let pinned: HTMLElement | null = null;
let pinnedUntil = 0;

const reduceMotion = () =>
	typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The pinned dialogue, or null once it has expired / left the document.
 * The pin is dropped the moment the glide arrives: from then on the scroll
 * position picks this same block on its own.
 */
function pin(): HTMLElement | null {
	if (!pinned) return null;
	if (!pinned.isConnected || Date.now() > pinnedUntil) {
		pinned = null;
		return null;
	}
	const r = pinned.getBoundingClientRect();
	const arrived =
		Math.abs((r.top + r.bottom) / 2 - window.innerHeight * BAND_MID) <=
		window.innerHeight * PIN_SETTLED;
	if (!arrived) return pinned;
	const settled = pinned;
	pinned = null;
	return settled;
}

/** Hand control back to the scroll position (called when the reader scrolls). */
export function releaseDialogue() {
	pinned = null;
	pinnedUntil = 0;
}

/** The plain-text lines of one dialogue block, for the featured plate. */
function readLines(el: HTMLElement | null, sel: string) {
	return el
		? [...el.querySelectorAll<HTMLElement>(sel)]
				.map((n) => (n.textContent ?? '').trim())
				.filter(Boolean)
		: [];
}

function applyUtterance(el: HTMLElement | null, speaker: string | null) {
	reading.speaker = speaker;
	reading.look = el?.dataset.look || null;
	reading.linesKo = readLines(el, '.line.ko');
	reading.linesEn = readLines(el, '.line.en');
	reading.linesZh = readLines(el, '.line.zh');
	reading.linesZhLatn = readLines(el, '.line.zh-latn');
	reading.linesJa = readLines(el, '.line.ja');
	reading.linesJaLatn = readLines(el, '.line.ja-latn');
}

/** Move the live-line marker onto `el` — only the stage modes wear it. */
function markSpeaking(el: HTMLElement | null) {
	for (const other of scriptRoot().querySelectorAll<HTMLElement>('[data-speaker].is-speaking')) {
		if (other !== el) other.classList.remove('is-speaking');
	}
	if (el && isStageMode()) el.classList.add('is-speaking');
}

/** Glide `el`'s middle onto the reading band's middle — where the watcher reads. */
export function scrollToBand(el: HTMLElement, smooth = true) {
	const r = el.getBoundingClientRect();
	const top = window.scrollY + r.top + r.height / 2 - window.innerHeight * BAND_MID;
	window.scrollTo({
		top: Math.max(0, top),
		behavior: smooth && !reduceMotion() ? 'smooth' : 'auto'
	});
}

/**
 * Make a clicked dialogue the live one and glide it into the reading band.
 *
 * The state is applied first so the plate answers the click immediately, and the
 * block is pinned for the length of the scroll — otherwise the watcher would
 * hand the stage to every line the viewport passes on the way there.
 */
export function activateDialogue(node: HTMLElement) {
	if (!isStageMode()) return;
	const el = node.closest<HTMLElement>('[data-speaker]');
	if (!el) return;

	pinned = el;
	pinnedUntil = Date.now() + PIN_MS;

	lastEntry = el.closest<HTMLElement>('article.entry')?.id ?? lastEntry;
	applyUtterance(el, el.dataset.speaker || null);
	markSpeaking(el);

	scrollToBand(el);
}

/**
 * Watch the document for the element crossing the reading line and mirror its
 * mood into `reading`. Returns a teardown.
 */
export function watchReading() {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let last = 0;

	const measure = () => {
		timer = undefined;
		last = Date.now();
		// A reading *band* rather than a single line: an element counts as
		// "being read" while any part of it sits in the upper-middle of the
		// viewport, which is forgiving of short blocks and jump-scrolls.
		const top = window.innerHeight * BAND_TOP;
		const bottom = window.innerHeight * BAND_BOTTOM;
		const inBand = (el: Element) => {
			const r = el.getBoundingClientRect();
			return r.top <= bottom && r.bottom >= top;
		};

		/* When several elements straddle the band — a short entry sitting inside a
		   taller neighbour's span — take the one whose middle is closest to it, so
		   brief entries are not shadowed by their neighbours. */
		const root = scriptRoot();
		const nearestInBand = <T extends HTMLElement>(sel: string): T | null => {
			const mid = (top + bottom) / 2;
			let best: T | null = null;
			let bestD = Infinity;
			for (const el of root.querySelectorAll<T>(sel)) {
				if (!inBand(el)) continue;
				const r = el.getBoundingClientRect();
				const d = Math.abs((Math.max(r.top, top) + Math.min(r.bottom, bottom)) / 2 - mid);
				if (d < bestD) {
					bestD = d;
					best = el;
				}
			}
			return best;
		};

		let flash = false;
		for (const el of root.querySelectorAll('[data-flash]')) {
			if (inBand(el)) {
				flash = true;
				break;
			}
		}

		const music = nearestInBand<HTMLElement>('[data-music]')?.dataset.music ?? null;
		const place = nearestInBand<HTMLElement>('[data-place]')?.dataset.place ?? null;

		// Immersion: whoever's dialogue sits in the band is "on stage" — unless a
		// click pinned one, which holds the stage until the glide to it settles.
		// Between lines we keep the last speaker so the plate doesn't flicker
		// through narration — it only clears when the entry itself changes.
		const dialogue = pin() ?? nearestInBand<HTMLElement>('[data-speaker]');
		const entry = nearestInBand<HTMLElement>('article.entry');
		const entryKey = entry?.id ?? null;
		const nextSpeaker = dialogue?.dataset.speaker || null;
		const yearRaw = entry?.dataset.year;
		const year =
			yearRaw != null && yearRaw !== '' && Number.isFinite(Number(yearRaw))
				? Number(yearRaw)
				: null;

		/* How far the band has travelled through the live entry: cinema reads it
		   for the episode progress line, the panel cuts and the end card. */
		let progress = 0;
		if (entry) {
			const r = entry.getBoundingClientRect();
			const mid = (top + bottom) / 2;
			progress = r.height > 0 ? (mid - r.top) / r.height : 0;
			progress = Math.max(0, Math.min(1, progress));
		}

		if (reading.flash !== flash) reading.flash = flash;
		if (reading.music !== music) reading.music = music;
		if (reading.place !== place) reading.place = place;
		if (reading.year !== year) reading.year = year;
		if (reading.entryId !== entryKey) reading.entryId = entryKey;
		/* Only publish meaningful movement — a pixel of scroll is not a beat. */
		if (Math.abs(reading.entryProgress - progress) > 0.004) reading.entryProgress = progress;

		if (entryKey !== lastEntry) {
			lastEntry = entryKey;
			applyUtterance(dialogue, nextSpeaker);
		} else if (nextSpeaker) {
			const ko = readLines(dialogue, '.line.ko');
			const en = readLines(dialogue, '.line.en');
			const zh = readLines(dialogue, '.line.zh');
			const zhLatn = readLines(dialogue, '.line.zh-latn');
			const ja = readLines(dialogue, '.line.ja');
			const jaLatn = readLines(dialogue, '.line.ja-latn');
			const sameLines =
				ko.join('\0') === reading.linesKo.join('\0') &&
				en.join('\0') === reading.linesEn.join('\0') &&
				zh.join('\0') === reading.linesZh.join('\0') &&
				zhLatn.join('\0') === reading.linesZhLatn.join('\0') &&
				ja.join('\0') === reading.linesJa.join('\0') &&
				jaLatn.join('\0') === reading.linesJaLatn.join('\0');
			if (reading.speaker !== nextSpeaker || !sameLines) {
				applyUtterance(dialogue, nextSpeaker);
			}
		}

		markSpeaking(dialogue);

		document.documentElement.classList.toggle('is-flash', flash);
	};

	/* Time-based throttle rather than requestAnimationFrame: rAF is suspended in
	   background tabs, which would latch the page in whatever mood it was last
	   in. A trailing timer always fires. */
	const onScroll = () => {
		if (timer !== undefined) return;
		const wait = Math.max(0, 90 - (Date.now() - last));
		timer = setTimeout(measure, wait);
	};

	// let layout settle before the first read
	const first = setTimeout(measure, 60);
	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	// any hand-driven scroll wins over a pinned line
	window.addEventListener('wheel', releaseDialogue, { passive: true });
	window.addEventListener('touchstart', releaseDialogue, { passive: true });
	window.addEventListener('keydown', releaseDialogue);

	return () => {
		clearTimeout(first);
		clearTimeout(timer);
		releaseDialogue();
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
		window.removeEventListener('wheel', releaseDialogue);
		window.removeEventListener('touchstart', releaseDialogue);
		window.removeEventListener('keydown', releaseDialogue);
		document.documentElement.classList.remove('is-flash');
		document.documentElement.classList.remove('is-immersion');
		document.documentElement.classList.remove('is-cinema');
		document.documentElement.classList.remove('is-stage');
		document.documentElement.classList.remove('is-cinema-peek');
	};
}

/** Does this string carry Hangul or Han characters? */
const KO_RE = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF\u3400-\u4DBF]/;

export function isKorean(s: string) {
	return KO_RE.test(s);
}

/* Hydrate mode / view / images from storage before any story chrome mounts, so
   Toc and the page see saved preferences on first paint. */
if (browser) {
	try {
		const mode = normalizeMode(localStorage.getItem('kingdom:mode'));
		if (mode) reading.mode = mode;
		const view = localStorage.getItem('kingdom:view');
		if (view === 'full' || view === 'episodes') reading.viewScope = view;
		const images = localStorage.getItem('kingdom:images');
		if (images === 'side' || images === 'inline') reading.imageLayout = images;
	} catch {
		/* private mode */
	}
	if (reading.viewScope === 'episodes') {
		const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
		const idx = hash ? resolveEpisodeIndex(hash) : -1;
		if (idx >= 0) reading.episodeIndex = idx;
	}
}
