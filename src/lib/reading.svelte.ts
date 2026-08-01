/**
 * Shared reading state: which "mood" the page is in as you scroll, and the
 * reader's language preference.
 *
 * The watcher is scroll-driven rather than IntersectionObserver-driven, because
 * the page background has to change *continuously* with the reading position —
 * and a missed observer callback would strand the page in the wrong mood.
 */

export type Lang = 'both' | 'en' | 'ko';

export const reading = $state({
	/** true while a flashback (whole entry or inline) is under the reading line */
	flash: false,
	/** track name of the entry being read, if it declares one */
	music: null as string | null,
	lang: 'both' as Lang
});

export function setLang(l: Lang) {
	reading.lang = l;
	try {
		localStorage.setItem('kingdom:lang', l);
	} catch {
		/* private mode — preference just won't persist */
	}
}

export function loadLang() {
	try {
		const v = localStorage.getItem('kingdom:lang');
		if (v === 'en' || v === 'ko' || v === 'both') reading.lang = v;
	} catch {
		/* ignore */
	}
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

		let flash = false;
		for (const el of document.querySelectorAll('[data-flash]')) {
			if (inBand(el)) {
				flash = true;
				break;
			}
		}

		let music: string | null = null;
		for (const el of document.querySelectorAll<HTMLElement>('[data-music]')) {
			if (inBand(el)) {
				music = el.dataset.music ?? null;
				break;
			}
		}

		if (reading.flash !== flash) reading.flash = flash;
		if (reading.music !== music) reading.music = music;

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
	};
}

/** Does this string carry Hangul or Han characters? */
const KO_RE = /[ᄀ-ᇿ㄰-㆏가-힯一-鿿㐀-䶿]/;

export function isKorean(s: string) {
	return KO_RE.test(s);
}
