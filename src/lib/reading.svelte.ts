/**
 * Shared reading state: which "mood" the page is in as you scroll, and the
 * reader's language / presentation preference.
 *
 * The watcher is scroll-driven rather than IntersectionObserver-driven, because
 * the page background has to change *continuously* with the reading position —
 * and a missed observer callback would strand the page in the wrong mood.
 */

export type Lang = 'both' | 'en' | 'ko';

/** chronicle = default scroll; immersive = VN/game speaker plate */
export type ReadMode = 'chronicle' | 'immersive';

export const reading = $state({
	/** true while a flashback (whole entry or inline) is under the reading line */
	flash: false,
	/** track name of the entry being read, if it declares one */
	music: null as string | null,
	/** place id of the entry being read — drives the corner map */
	place: null as string | null,
	/** story year of the entry in the reading band — drives life-stage faces */
	year: null as number | null,
	/** person id of the dialogue currently in the reading band (immersive) */
	speaker: null as string | null,
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
	/** Immersive by default; loadMode() restores a saved chronicle preference. */
	mode: 'immersive' as ReadMode
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

export function setLang(l: Lang) {
	reading.lang = l;
	try {
		localStorage.setItem('kingdom:lang', l);
	} catch {
		/* private mode — preference just won't persist */
	}
}

export function setMode(m: ReadMode) {
	reading.mode = m;
	releaseDialogue();
	try {
		localStorage.setItem('kingdom:mode', m);
	} catch {
		/* private mode */
	}
	document.documentElement.classList.toggle('is-immersive', m === 'immersive');
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
		const v = localStorage.getItem('kingdom:mode');
		if (v === 'chronicle' || v === 'immersive') reading.mode = v;
	} catch {
		/* ignore */
	}
	document.documentElement.classList.toggle('is-immersive', reading.mode === 'immersive');
}

/** entry id last seen by the speaker tracker — module-scoped so measure can close over it */
let lastEntry: string | null = null;

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
	reading.linesKo = readLines(el, '.line.ko');
	reading.linesEn = readLines(el, '.line.en');
	reading.linesZh = readLines(el, '.line.zh');
	reading.linesZhLatn = readLines(el, '.line.zh-latn');
	reading.linesJa = readLines(el, '.line.ja');
	reading.linesJaLatn = readLines(el, '.line.ja-latn');
}

/** Move the live-line marker onto `el` — only immersive mode wears it. */
function markSpeaking(el: HTMLElement | null) {
	for (const other of document.querySelectorAll<HTMLElement>('[data-speaker].is-speaking')) {
		if (other !== el) other.classList.remove('is-speaking');
	}
	if (el && reading.mode === 'immersive') el.classList.add('is-speaking');
}

/**
 * Make a clicked dialogue the live one and glide it into the reading band.
 *
 * The state is applied first so the plate answers the click immediately, and the
 * block is pinned for the length of the scroll — otherwise the watcher would
 * hand the stage to every line the viewport passes on the way there.
 */
export function activateDialogue(node: HTMLElement) {
	if (reading.mode !== 'immersive') return;
	const el = node.closest<HTMLElement>('[data-speaker]');
	if (!el) return;

	pinned = el;
	pinnedUntil = Date.now() + PIN_MS;

	lastEntry = el.closest<HTMLElement>('article.entry')?.id ?? lastEntry;
	applyUtterance(el, el.dataset.speaker || null);
	markSpeaking(el);

	const r = el.getBoundingClientRect();
	const top = window.scrollY + r.top + r.height / 2 - window.innerHeight * BAND_MID;
	window.scrollTo({
		top: Math.max(0, top),
		behavior: reduceMotion() ? 'auto' : 'smooth'
	});
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
		const nearestInBand = <T extends HTMLElement>(sel: string): T | null => {
			const mid = (top + bottom) / 2;
			let best: T | null = null;
			let bestD = Infinity;
			for (const el of document.querySelectorAll<T>(sel)) {
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
		for (const el of document.querySelectorAll('[data-flash]')) {
			if (inBand(el)) {
				flash = true;
				break;
			}
		}

		const music = nearestInBand<HTMLElement>('[data-music]')?.dataset.music ?? null;
		const place = nearestInBand<HTMLElement>('[data-place]')?.dataset.place ?? null;

		// Immersive: whoever's dialogue sits in the band is "on stage" — unless a
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

		if (reading.flash !== flash) reading.flash = flash;
		if (reading.music !== music) reading.music = music;
		if (reading.place !== place) reading.place = place;
		if (reading.year !== year) reading.year = year;

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
		document.documentElement.classList.remove('is-immersive');
	};
}

/** Does this string carry Hangul or Han characters? */
const KO_RE = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF\u3400-\u4DBF]/;

export function isKorean(s: string) {
	return KO_RE.test(s);
}
