/**
 * Shared reading state: which "mood" the page is in as you scroll, and the
 * reader's language / presentation preference.
 *
 * The watcher is scroll-driven rather than IntersectionObserver-driven, because
 * the page background has to change *continuously* with the reading position —
 * and a missed observer callback would strand the page in the wrong mood.
 */

import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { chapters, chapterIdFromPartId, entryId } from '$lib/story';
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

export type EpisodeRef = {
	chapterId: string;
	chapterIndex: number;
	entryIndex: number;
	id: string;
};

/**
 * Out-of-range leftover `chapterId-index` hashes from before episode merges.
 * In-range numeric hashes (`iron-will-0` …) still mean the current entry at
 * that index; TOC rows use title slugs so they always name the right episode.
 */
const EPISODE_HASH_ALIASES: Record<string, string> = {
	'iron-will-5': 'iron-will-yeons-massacre',
	'iron-will-6': 'iron-will-yeons-massacre',
	'iron-will-7': 'iron-will-chunchu-gesomun',
	'iron-will-8': 'iron-will-euija-gesomun',
	'iron-will-9': 'iron-will-kim-yushin',
	'chunchu-era-11': 'chunchu-era-hyukgose',
	'final-stand-7': 'final-stand-the-final-stand',
	'silla-tang-war-8': 'silla-tang-war-the-king-for-all'
};

/** Flat episode list — slug ids match TOC / URL hashes (`chapterId-title-slug`). */
export const episodes: EpisodeRef[] = chapters.flatMap((ch, chapterIndex) =>
	ch.entries.map((entry, entryIndex) => ({
		chapterId: ch.id,
		chapterIndex,
		entryIndex,
		id: entryId(ch.id, entry.title)
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
	/** id of the entry in the reading band ("chapterId-slug") — drives episode packaging */
	entryId: null as string | null,
	/** DOM id of the scene header in the reading band, when the entry has scenes */
	sceneId: null as string | null,
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
	/** Script from first paint. Switching mid-session still persists. */
	mode: 'script' as ReadMode,
	/** Continuous scroll by default; loadViewScope() restores episodes if saved. */
	viewScope: 'full' as ViewScope,
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

/** Modes that put the live line on a stage — immersion's plate, cinema's strip. */
export function isStageMode(m: ReadMode = reading.mode) {
	return m !== 'script';
}

/**
 * Where the art goes, decided by the mode rather than by a setting: the script
 * is a manuscript, so pictures sit in the flow of it; every stage mode keeps
 * its sticky column beside the text.
 */
export function isInlineArt(m: ReadMode = reading.mode) {
	return m === 'script';
}

/**
 * Which language leads a multilingual line. The reader's own toggle decides
 * it; 'both' leads with Korean because that is the language the dialogue is
 * written in. Every other layer follows underneath it, quieter.
 */
export function leadLang(l: Lang = reading.lang): 'ko' | 'en' {
	return l === 'en' ? 'en' : 'ko';
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
	const prev = reading.mode;
	reading.mode = m;
	releaseDialogue();
	persistMode(m);
	applyModeClasses(m);
	/* Script view starts with the TOC open. Shared `tocUi.open` means cinema /
	   immersion keep whatever the reader last chose; entering script still opens. */
	if (m === 'script' && prev !== 'script') tocUi.open = true;
	// refresh speaker / speaking highlight for the new mode
	window.dispatchEvent(new Event('scroll'));
	/* The mode also decides where the art goes — sticky runway or inline
	   figures — so the column's height only settles a frame later. */
	requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
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
	applyModeClasses(reading.mode);
}

export function loadViewScope() {
	try {
		const v = localStorage.getItem('kingdom:view');
		if (v === 'full' || v === 'episodes') reading.viewScope = v;
	} catch {
		/* ignore */
	}
}

/**
 * Capture which entry the reader is on from the reading-band Y, not the URL.
 * Used when switching into episodes mode mid-story.
 */
function captureCurrentEpisode() {
	if (typeof document === 'undefined') return;

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
	const storyId = best?.dataset.storyId;
	if (storyId) {
		const idx = resolveEpisodeIndex(storyId);
		if (idx >= 0) reading.episodeIndex = idx;
	}
}

export function setViewScope(s: ViewScope) {
	reading.viewScope = s;
	persistViewScope(s);
	releaseDialogue();

	if (s === 'episodes') {
		captureCurrentEpisode();
		stripStoryHash();
	}

	const after = () => {
		const ep = episodes[reading.episodeIndex];
		if (!ep) {
			window.dispatchEvent(new Event('scroll'));
			return;
		}
		/* Only jump when already past cover/blurb — don't yank readers off the title. */
		const el = findStoryHeading(ep.id);
		if (el && scriptUi.inScript) scrollToStoryHeading(el, 'auto');
		window.dispatchEvent(new Event('scroll'));
	};

	/* Episodes → full needs a frame for every entry to mount; full → episodes too. */
	requestAnimationFrame(() => requestAnimationFrame(after));
}

/** Resolve a chapter, slug, leftover, or `chapterId-index` hash to a flat episode index, or -1. */
export function resolveEpisodeIndex(id: string): number {
	return resolveStoryTarget(id)?.episodeIndex ?? -1;
}

/** Hash destination: which episode to show, and which DOM id to scroll to. */
export type StoryTarget = { episodeIndex: number; hashId: string };

/**
 * Resolve a chapter, episode, leftover, or `#chapter-episode-scene` hash.
 * Scene ids are `episodeId-scene-slug` (longest matching episode prefix).
 */
export function resolveStoryTarget(id: string): StoryTarget | null {
	if (!id) return null;

	const exact = episodes.findIndex((e) => e.id === id);
	if (exact >= 0) return { episodeIndex: exact, hashId: id };

	if (chapters.some((ch) => ch.id === id)) {
		const idx = episodes.findIndex((e) => e.chapterId === id);
		return idx >= 0 ? { episodeIndex: idx, hashId: id } : null;
	}

	const partChapter = chapterIdFromPartId(id);
	if (partChapter && chapters.some((ch) => ch.id === partChapter && ch.part)) {
		const idx = episodes.findIndex((e) => e.chapterId === partChapter);
		return idx >= 0 ? { episodeIndex: idx, hashId: id } : null;
	}

	let best = -1;
	let bestLen = -1;
	for (let i = 0; i < episodes.length; i++) {
		const eid = episodes[i].id;
		if (id.startsWith(`${eid}-`) && eid.length > bestLen) {
			best = i;
			bestLen = eid.length;
		}
	}
	if (best >= 0) return { episodeIndex: best, hashId: id };

	const indexMatch = /^(.*)-(\d+)$/.exec(id);
	if (indexMatch) {
		const chapterId = indexMatch[1];
		const entryIndex = Number(indexMatch[2]);
		const byIndex = episodes.findIndex(
			(e) => e.chapterId === chapterId && e.entryIndex === entryIndex
		);
		if (byIndex >= 0) return { episodeIndex: byIndex, hashId: episodes[byIndex].id };
	}
	const aliased = EPISODE_HASH_ALIASES[id];
	if (aliased) {
		const fromAlias = episodes.findIndex((e) => e.id === aliased);
		if (fromAlias >= 0) return { episodeIndex: fromAlias, hashId: episodes[fromAlias].id };
	}
	return null;
}

/** Canonical episode, chapter, or scene id for hashes / getElementById. */
export function canonicalHashId(id: string): string {
	return resolveStoryTarget(id)?.hashId ?? id;
}

function isPainted(el: HTMLElement) {
	return el.getClientRects().length > 0;
}

function firstPainted(root: ParentNode, selectors: string[]): HTMLElement | null {
	for (const sel of selectors) {
		const el = root.querySelector<HTMLElement>(sel);
		if (el && isPainted(el)) return el;
	}
	return null;
}

/**
 * The visible title a TOC row should land on (h1/h2 / scene label), not the
 * article wrapper or the mobile art card stacked above it.
 */
export function storyTitleElement(el: HTMLElement): HTMLElement {
	if (el.matches('h1, h2, .day-label, .mini-title, .part-eyebrow')) return el;

	if (el.matches('article.entry, .entry-head, .entry-head-sticky')) {
		const h2 = firstPainted(el, ['.episode h2', '.entry-head h2', 'h2']);
		const head = firstPainted(el, ['.entry-head-sticky', '.entry-head']);
		/* Desktop: the year + title bar is sticky. Landing on the inner h2
		   fights that pin (chrome above the h2 is pulled back). Mobile: the
		   same bar is static and art sits above it — land on the h2. */
		if (h2 && head) {
			const sticky = h2.closest<HTMLElement>('.entry-head-sticky');
			if (sticky && getComputedStyle(sticky).position === 'sticky') return head;
			return h2;
		}
		return h2 ?? head ?? el;
	}
	if (el.matches('section.chapter, .chapter-head')) {
		return firstPainted(el, ['.chapter-title h1', 'h1']) ?? el;
	}
	if (el.matches('.part-page')) {
		return firstPainted(el, ['.part-title', '.part-eyebrow']) ?? el;
	}
	if (el.matches('[data-scene], .day, .mini')) {
		return firstPainted(el, ['.day-label', '.mini-title', 'h1', 'h2']) ?? el;
	}
	return firstPainted(el, ['h1', 'h2']) ?? el;
}

/** The chronicle document — class `.script`, never `id="script"` (that was a `:target`). */
export function storyRoot(): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	return document.querySelector<HTMLElement>('[data-story-root]');
}

/**
 * Story nodes use `data-story-id`, never `id="…"`. Matching `#id` let the
 * browser `:target` / hash-restore the reader after they had already scrolled.
 */
export function storyElement(id: string): HTMLElement | null {
	if (!id || typeof document === 'undefined') return null;
	const script = storyRoot();
	const root: ParentNode = script ?? document;
	try {
		const el = root.querySelector<HTMLElement>(`[data-story-id="${CSS.escape(id)}"]`);
		if (el) return el;
	} catch {
		/* invalid selector */
	}
	try {
		return root.querySelector<HTMLElement>(`[data-scene="${CSS.escape(id)}"]`);
	} catch {
		return null;
	}
}

/**
 * Locate a part / chapter / episode / scene node. Lookup is `data-story-id` —
 * scrolling uses measured Y via `scrollToStoryHeading`.
 */
export function findStoryHeading(id: string): HTMLElement | null {
	const el = storyElement(canonicalHashId(id));
	if (!el) return null;
	return storyTitleElement(el);
}

/** Window vs overflow: `.reading` only pads — the document is the story scroller. */
export function readingScroller(): Window | HTMLElement {
	if (typeof document === 'undefined') return window;
	const candidates = [
		document.querySelector<HTMLElement>('.reading'),
		document.querySelector<HTMLElement>('.reading-clip'),
		storyRoot()
	];
	for (const el of candidates) {
		if (!el) continue;
		const { overflowY } = getComputedStyle(el);
		if (overflowY !== 'auto' && overflowY !== 'scroll' && overflowY !== 'overlay') continue;
		if (el.scrollHeight > el.clientHeight + 1) return el;
	}
	return window;
}

function isWindowScroller(scroller: Window | HTMLElement): scroller is Window {
	return typeof Window !== 'undefined' && scroller instanceof Window;
}

function scrollerScrollTop(scroller: Window | HTMLElement): number {
	return isWindowScroller(scroller) ? scroller.scrollY : scroller.scrollTop;
}

function scrollerClientTop(scroller: Window | HTMLElement): number {
	return isWindowScroller(scroller) ? 0 : scroller.getBoundingClientRect().top;
}

function yInScroller(el: HTMLElement, scroller: Window | HTMLElement): number {
	const top = el.getBoundingClientRect().top;
	if (isWindowScroller(scroller)) return top + scroller.scrollY;
	return top - scroller.getBoundingClientRect().top + scroller.scrollTop;
}

function scrollScrollerTo(scroller: Window | HTMLElement, top: number, behavior: ScrollBehavior) {
	scroller.scrollTo({ top: Math.max(0, top), behavior });
}

/**
 * How far below the scroller's top a title must sit so HUD / stuck episode
 * chrome does not cover it. Measured from live boxes, not CSS scroll-margin.
 */
export function storyStickyOffset(title?: HTMLElement | null): number {
	const pad = 10;
	const min = 16;
	let chrome = 0;
	const x0 = title?.getBoundingClientRect().left ?? 0;
	const x1 = title?.getBoundingClientRect().right ?? (typeof window !== 'undefined' ? window.innerWidth : 0);

	const overlapsX = (r: DOMRect) => r.left < x1 && r.right > x0;

	const hud = document.querySelector<HTMLElement>('.hud.in');
	if (hud && isPainted(hud)) {
		const r = hud.getBoundingClientRect();
		if (r.bottom > 0 && overlapsX(r)) chrome = Math.max(chrome, r.bottom);
	}

	for (const sticky of document.querySelectorAll<HTMLElement>('.entry-head-sticky')) {
		if (!isPainted(sticky)) continue;
		if (title && sticky.contains(title)) continue;
		const style = getComputedStyle(sticky);
		if (style.position !== 'sticky' && style.position !== 'fixed') continue;
		const r = sticky.getBoundingClientRect();
		const stickTop = Number.parseFloat(style.top) || 0;
		if (r.top <= stickTop + 2 && r.bottom > 0 && overlapsX(r)) {
			chrome = Math.max(chrome, r.bottom);
		}
	}

	return Math.max(chrome, min) + pad;
}

let storyJumpGen = 0;

/**
 * Scroll the reading scroller so `el`'s title sits at measured Y minus sticky
 * chrome. Re-measures at call time and again after layout/images settle.
 * Does not use `scrollIntoView` or hash targeting.
 */
export function scrollToStoryHeading(el: HTMLElement, behavior: ScrollBehavior = 'auto') {
	const gen = ++storyJumpGen;
	const live = () => (el.isConnected ? storyTitleElement(el) : null);

	const apply = (how: ScrollBehavior) => {
		if (gen !== storyJumpGen) return;
		const title = live();
		if (!title) return;
		const scroller = readingScroller();
		const sticky = storyStickyOffset(title);
		scrollScrollerTo(scroller, yInScroller(title, scroller) - sticky, how);
	};

	const verify = () => {
		if (gen !== storyJumpGen) return;
		const title = live();
		if (!title) return;
		const scroller = readingScroller();
		const sticky = storyStickyOffset(title);
		const expected = scrollerClientTop(scroller) + sticky;
		const drift = title.getBoundingClientRect().top - expected;
		if (Math.abs(drift) <= 6) return;
		scrollScrollerTo(scroller, scrollerScrollTop(scroller) + drift, 'auto');
	};

	/* Image-load / settle verify used to yank the reader back after they
	   already kept scrolling — that was the section loop. First wheel /
	   touch / key cancels this jump's follow-up scrolls. */
	const release = () => {
		if (gen === storyJumpGen) storyJumpGen += 1;
	};
	window.addEventListener('wheel', release, { once: true, passive: true });
	window.addEventListener('touchstart', release, { once: true, passive: true });
	window.addEventListener('keydown', release, { once: true });

	apply(behavior);
	requestAnimationFrame(() => {
		if (gen !== storyJumpGen) return;
		if (behavior === 'smooth') apply('smooth');
		else verify();
	});
}

/** Reading position is Y-only. Never write `#id` — it trapped scroll in one entry. */
function clearHash() {
	try {
		if (typeof location === 'undefined' || !location.hash) return;
		const next = `${location.pathname}${location.search}`;
		try {
			replaceState(next, {});
		} catch {
			history.replaceState(null, '', next);
		}
	} catch {
		/* ignore */
	}
}

/**
 * Strip `#id` after a Y-land. No delayed timers — those used to fire later
 * and delete a fresh leftover hash before it could land.
 */
export function stripStoryHash() {
	clearHash();
	if (typeof requestAnimationFrame === 'function') requestAnimationFrame(clearHash);
}

const PENDING_JUMP_KEY = 'kingdom:story-jump';

/** Wiki / lightbox: land on an episode by Y after navigating home — never `#id`. */
export function requestStoryJump(id: string) {
	if (!id || typeof sessionStorage === 'undefined') return;
	try {
		sessionStorage.setItem(PENDING_JUMP_KEY, id);
	} catch {
		/* private mode */
	}
}

/** Consume a pending Y-jump from another route. True when a jump is queued. */
export function consumePendingStoryJump(): boolean {
	if (typeof sessionStorage === 'undefined') return false;
	let id = '';
	try {
		id = sessionStorage.getItem(PENDING_JUMP_KEY) ?? '';
		if (id) sessionStorage.removeItem(PENDING_JUMP_KEY);
	} catch {
		return false;
	}
	if (!id) return false;
	const dest = id;
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			const el = findStoryHeading(canonicalHashId(dest));
			if (el) scrollToStoryHeading(el, 'auto');
			stripStoryHash();
		});
	});
	return true;
}

/** Hash last landed on — same restored `:target` is stripped without scrolling again. */
let leftoverHashConsumed = '';

/**
 * Land once on a leftover `#id` (wiki / old bookmark), then strip so `:target`
 * cannot pin the reader. Safe to call from the story layout before the script
 * page finishes hydrating — headings exist in SSR HTML.
 */
export function consumeLeftoverStoryHash() {
	if (typeof location === 'undefined') return;
	const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
	if (!hash) return;
	if (hash !== leftoverHashConsumed) {
		leftoverHashConsumed = hash;
		const el = findStoryHeading(canonicalHashId(hash));
		if (el) scrollToStoryHeading(el, 'auto');
	}
	stripStoryHash();
}

/**
 * Jump to an episode by flat index. Scrolls by measured Y only — never writes `#id`.
 * Does not close the TOC unless `closeToc: true` (hamburger / Escape still do).
 * `destId` scrolls to a scene header (`episodeId-scene-slug`) when provided.
 */
export function goToEpisode(
	index: number,
	opts: { hash?: boolean; scroll?: boolean; closeToc?: boolean; destId?: string } = {}
) {
	if (!episodes.length) return;
	const next = Math.max(0, Math.min(episodes.length - 1, index));
	reading.episodeIndex = next;
	releaseDialogue();

	const ep = episodes[next];
	const destId = opts.destId ?? ep.id;
	stripStoryHash();
	if (opts.closeToc === true) tocUi.open = false;

	const scroll = opts.scroll !== false;
	const finish = () => {
		if (scroll) {
			const el = findStoryHeading(destId) ?? findStoryHeading(ep.id);
			if (el) scrollToStoryHeading(el, 'auto');
			else {
				const script = storyRoot();
				if (script) scrollToStoryHeading(script, 'auto');
			}
		}
		window.dispatchEvent(new Event('scroll'));
	};

	requestAnimationFrame(() => requestAnimationFrame(finish));
}

export function goToEpisodeById(
	id: string,
	opts: { hash?: boolean; scroll?: boolean; closeToc?: boolean; destId?: string } = {}
): boolean {
	const target = resolveStoryTarget(id);
	if (!target) return false;
	goToEpisode(target.episodeIndex, { ...opts, destId: opts.destId ?? target.hashId });
	return true;
}

/**
 * Jump to a scene header inside the current (or dest) episode.
 * Does not close the TOC — same as TOC episode clicks.
 */
export function goToScene(
	sceneId: string,
	opts: { hash?: boolean; scroll?: boolean } = {}
): boolean {
	return goToEpisodeById(sceneId, { ...opts, closeToc: false });
}

export function stepEpisode(delta: number) {
	goToEpisode(reading.episodeIndex + delta);
}

/** entry id last seen by the speaker tracker — module-scoped so measure can close over it */
let lastEntry: string | null = null;

/**
 * The reading document — the band watcher, the speaking marker and the episode
 * capture only ever look inside `[data-story-root]`. The cinema stage mounts a second
 * copy of the same blocks in its script rail (fixed chrome, its own scroll),
 * which must never be mistaken for the page being read.
 */
function scriptRoot(): ParentNode {
	return storyRoot() ?? document;
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

	lastEntry = el.closest<HTMLElement>('article.entry')?.dataset.storyId ?? lastEntry;
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
		const entryKey = entry?.dataset.storyId ?? null;
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

		const sceneEl = (() => {
			if (!entry) return null;
			const mid = (top + bottom) / 2;
			let best: HTMLElement | null = null;
			let bestD = Infinity;
			for (const el of entry.querySelectorAll<HTMLElement>('[data-scene]')) {
				if (!inBand(el)) continue;
				const r = el.getBoundingClientRect();
				const d = Math.abs((Math.max(r.top, top) + Math.min(r.bottom, bottom)) / 2 - mid);
				if (d < bestD) {
					bestD = d;
					best = el;
				}
			}
			return best;
		})();
		const sceneKey = sceneEl?.dataset.storyId || sceneEl?.dataset.scene || null;

		if (reading.flash !== flash) reading.flash = flash;
		if (reading.music !== music) reading.music = music;
		if (reading.place !== place) reading.place = place;
		if (reading.year !== year) reading.year = year;
		if (reading.entryId !== entryKey) reading.entryId = entryKey;
		/* Episodes HUD tracks the band — the full document stays mounted, so
		   scrolling past an entry advances without remounting. */
		if (entryKey) {
			const idx = resolveEpisodeIndex(entryKey);
			if (idx >= 0 && reading.episodeIndex !== idx) reading.episodeIndex = idx;
		}
		if (entryKey !== lastEntry) {
			if (reading.sceneId !== sceneKey) reading.sceneId = sceneKey;
		} else if (sceneKey && reading.sceneId !== sceneKey) {
			reading.sceneId = sceneKey;
		}
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
	/* Leftover `#id` lands once here (and from the story layout). No hashchange
	   listener — replaceState(strip) used to fire hashchange and snap back. */
	if (location.hash) consumeLeftoverStoryHash();
	window.addEventListener('load', stripStoryHash);

	return () => {
		clearTimeout(first);
		clearTimeout(timer);
		releaseDialogue();
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
		window.removeEventListener('wheel', releaseDialogue);
		window.removeEventListener('touchstart', releaseDialogue);
		window.removeEventListener('keydown', releaseDialogue);
		window.removeEventListener('load', stripStoryHash);
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

/* Hydrate view from storage before story chrome mounts. Mode is always
   script on load — persist that so leftover stage prefs cannot flip later. */
if (browser) {
	try {
		persistMode('script');
		applyModeClasses('script');
		const view = localStorage.getItem('kingdom:view');
		if (view === 'full' || view === 'episodes') reading.viewScope = view;
	} catch {
		/* private mode */
	}
}
