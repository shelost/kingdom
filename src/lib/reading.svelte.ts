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
	/** person id of the dialogue currently in the reading band (immersive) */
	speaker: null as string | null,
	/** plain-text lines for the featured Pokémon-style dialogue box */
	linesKo: [] as string[],
	linesEn: [] as string[],
	lang: 'both' as Lang,
	mode: 'chronicle' as ReadMode
});

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
		const top = window.innerHeight * 0.18;
		const bottom = window.innerHeight * 0.62;
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

		// Immersive: whoever's dialogue sits in the band is "on stage".
		// Between lines we keep the last speaker so the plate doesn't flicker
		// through narration — it only clears when the entry itself changes.
		const dialogue = nearestInBand<HTMLElement>('[data-speaker]');
		const entry = nearestInBand<HTMLElement>('article.entry');
		const entryKey = entry?.id ?? null;
		const nextSpeaker = dialogue?.dataset.speaker || null;

		const readLines = (el: HTMLElement | null, sel: string) =>
			el
				? [...el.querySelectorAll<HTMLElement>(sel)]
						.map((n) => (n.textContent ?? '').trim())
						.filter(Boolean)
				: [];

		if (reading.flash !== flash) reading.flash = flash;
		if (reading.music !== music) reading.music = music;
		if (reading.place !== place) reading.place = place;

		const applyUtterance = (el: HTMLElement | null, speaker: string | null) => {
			reading.speaker = speaker;
			reading.linesKo = readLines(el, '.line.ko');
			reading.linesEn = readLines(el, '.line.en');
		};

		// stash entry key on the state object via a module var
		if (entryKey !== lastEntry) {
			lastEntry = entryKey;
			applyUtterance(dialogue, nextSpeaker);
		} else if (nextSpeaker) {
			const ko = readLines(dialogue, '.line.ko');
			const en = readLines(dialogue, '.line.en');
			const sameLines =
				ko.join('\0') === reading.linesKo.join('\0') &&
				en.join('\0') === reading.linesEn.join('\0');
			if (reading.speaker !== nextSpeaker || !sameLines) {
				applyUtterance(dialogue, nextSpeaker);
			}
		}

		// mark the live dialogue for styling
		for (const el of document.querySelectorAll<HTMLElement>('[data-speaker].is-speaking')) {
			el.classList.remove('is-speaking');
		}
		if (reading.mode === 'immersive' && dialogue) {
			dialogue.classList.add('is-speaking');
		}

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

	return () => {
		clearTimeout(first);
		clearTimeout(timer);
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
		document.documentElement.classList.remove('is-flash');
		document.documentElement.classList.remove('is-immersive');
	};
}

/** entry id last seen by the speaker tracker — module-scoped so measure can close over it */
let lastEntry: string | null = null;

/** Does this string carry Hangul or Han characters? */
const KO_RE = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF\u3400-\u4DBF]/;

export function isKorean(s: string) {
	return KO_RE.test(s);
}
