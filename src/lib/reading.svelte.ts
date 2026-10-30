/**
 * Shared reading state: which "mood" the page is in as you scroll, and the
 * reader's language / presentation preference.
 *
 * The watcher is scroll-driven rather than IntersectionObserver-driven, because
 * the page background has to change *continuously* with the reading position —
 * and a missed observer callback would strand the page in the wrong mood.
 */

import { browser } from '$app/environment';
import { goto, replaceState } from '$app/navigation';
import { arcPageId, chapters, entryId, episodeNumber, isPrologue, partId } from '$lib/story';
import { isLoveEpisode } from '$lib/loveEpisodes';
import { arcLabelAt, chapterHeadedBy, chapterLabel, chapterNumberOf, partLabel, tocAnchor } from '$lib/tocTree';
import { scriptUi } from '$lib/scriptUi.svelte';
import { autoOpenToc, tocUi } from '$lib/tocUi.svelte';

const KEEP_SCROLL_KEY = 'kingdom:keep-scroll';

type KeptScroll = { href: string; y: number; t: number };

/** Persist Y so a Vite remount after cue-delete does not jump to the episode head. */
export function rememberReadingScroll() {
	if (!browser) return;
	try {
		const kept: KeptScroll = {
			href: `${location.pathname}${location.search}`,
			y: window.scrollY,
			t: Date.now()
		};
		sessionStorage.setItem(KEEP_SCROLL_KEY, JSON.stringify(kept));
	} catch {
		/* private mode */
	}
}

function readKeptScroll(): KeptScroll | null {
	if (!browser) return null;
	try {
		const raw = sessionStorage.getItem(KEEP_SCROLL_KEY);
		if (!raw) return null;
		const kept = JSON.parse(raw) as KeptScroll;
		if (!kept || typeof kept.y !== 'number' || typeof kept.href !== 'string') return null;
		if (Date.now() - kept.t > 15_000) return null;
		if (kept.href !== `${location.pathname}${location.search}`) return null;
		return kept;
	} catch {
		return null;
	}
}

/** Restore a remembered Y. Returns true when applied. */
export function restoreKeptReadingScroll(): boolean {
	const kept = readKeptScroll();
	if (!kept) return false;
	try {
		sessionStorage.removeItem(KEEP_SCROLL_KEY);
	} catch {
		/* ignore */
	}
	window.scrollTo(0, kept.y);
	window.dispatchEvent(new Event('scroll'));
	return true;
}

/**
 * Where the reader is, as "this entry, this far into it" — a raw Y lands wrong
 * after a refresh because the chronicle above has not laid out yet. Per tab
 * (sessionStorage); app.html reads the same key to show the loader before paint.
 */
const SPOT_KEY = 'kingdom:reading-spot';
type ReadingSpot = { href: string; id: string; offset: number; t: number };
const RESTORING_CLASS = 'is-restoring';
let spotRestored = false;

const currentHref = () => `${location.pathname}${location.search}`;

function saveReadingSpot(entry: HTMLElement | null) {
	const id = entry?.dataset.storyId;
	if (!browser || !entry || !id) return;
	if (document.documentElement.classList.contains(RESTORING_CLASS)) return;
	try {
		const spot: ReadingSpot = {
			href: currentHref(),
			id,
			offset: Math.round(-entry.getBoundingClientRect().top),
			t: Date.now()
		};
		sessionStorage.setItem(SPOT_KEY, JSON.stringify(spot));
	} catch {
		/* private mode */
	}
}

/** The saved spot, only on a refresh (or a full-page back/forward) of the same address. */
function reloadedSpot(): ReadingSpot | null {
	if (!browser) return null;
	try {
		const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
		if (nav?.type !== 'reload' && nav?.type !== 'back_forward') return null;
		const spot = JSON.parse(sessionStorage.getItem(SPOT_KEY) ?? 'null') as ReadingSpot | null;
		if (!spot || typeof spot.id !== 'string' || typeof spot.offset !== 'number') return null;
		return spot.href === currentHref() ? spot : null;
	} catch {
		return null;
	}
}

function endRestoring() {
	document.documentElement.classList.remove(RESTORING_CLASS);
}

/**
 * After a refresh, put the reader back on the entry they left, as deep into it
 * as they were, re-landing while images and lazy art grow the page; the loader
 * lifts once the layout has been still for a moment, after 2.5 s at most, or
 * at the reader's first wheel / touch / key. Returns true once the spot owns
 * the scroll, so heading jumps scheduled by the URL appliers stand down.
 */
export function restoreReadingSpot(): boolean {
	if (!browser) return false;
	if (spotRestored) return true;
	const spot = reloadedSpot();
	const entry = spot
		? document.querySelector<HTMLElement>(`article.entry[data-story-id="${CSS.escape(spot.id)}"]`)
		: null;
	if (!spot || !entry) {
		endRestoring();
		return false;
	}
	spotRestored = true;
	let done = false;
	let quiet: ReturnType<typeof setTimeout> | undefined;
	const land = () => {
		if (done || !entry.isConnected) return;
		const y = entry.getBoundingClientRect().top + window.scrollY + spot.offset;
		window.scrollTo(0, Math.max(0, y));
	};
	const settle = () => {
		clearTimeout(quiet);
		quiet = setTimeout(finish, 300);
	};
	const observer = new ResizeObserver(() => {
		land();
		settle();
	});
	const cap = setTimeout(() => finish(), 2500);
	function finish() {
		if (done) return;
		done = true;
		observer.disconnect();
		clearTimeout(quiet);
		clearTimeout(cap);
		window.removeEventListener('wheel', finish);
		window.removeEventListener('touchstart', finish);
		window.removeEventListener('keydown', finish);
		endRestoring();
		window.dispatchEvent(new Event('scroll'));
	}
	observer.observe(storyRoot() ?? document.body);
	window.addEventListener('wheel', finish, { passive: true });
	window.addEventListener('touchstart', finish, { passive: true });
	window.addEventListener('keydown', finish);
	land();
	settle();
	return true;
}

export type Lang = 'both' | 'en' | 'ko';

/** One language control, on every page. */
export const LANGS: { id: Lang; label: string; hint: string }[] = [
	{ id: 'both', label: 'A/한', hint: 'Show everything' },
	{ id: 'en', label: 'EN', hint: 'English' },
	{ id: 'ko', label: '한', hint: 'Korean' }
];

/**
 * script     = scroll layout without speaker plate
 * immersion  = VN/game speaker plate over the reading column
 * cinema     = viewport grid: letterboxed scene, script rail, character, dialogue
 * screenplay = print-ready courier script, text only
 * storyboard = numbered animation boards: still, description, dialogue
 */
export type ReadMode = 'script' | 'immersion' | 'cinema' | 'screenplay' | 'storyboard';

/** full = continuous story; episodes = one entry at a time (default) */
export type ViewScope = 'full' | 'episodes';

/** URL: `?ep=jumong` (title slug). Legacy `?view=episodes` still accepted. */
export const VIEW_QUERY = 'view';
export const EP_QUERY = 'ep';

/** `prologue` is Heewon's note before the story, `part` / `arc` / `chapter` are title pages, `entry` a story episode. */
export type EpisodeKind = 'prologue' | 'part' | 'arc' | 'chapter' | 'entry';

export type EpisodeRef = {
	kind: EpisodeKind;
	chapterId: string;
	chapterIndex: number;
	/** -1 on the prologue and Part pages. */
	entryIndex: number;
	id: string;
};

/**
 * Retired episode ids (and the bare `?ep=jumong`) → the episode that now holds their opening.
 * Old scene hashes (`retired-id-scene-…`) follow by prefix when no live episode claims them.
 */
const EPISODE_HASH_ALIASES: Record<string, string> = {
	'samhan-queen-sunduk': 'three-kingdoms-queen-sunduk',
	'samhan-harmony-council': 'three-kingdoms-harmony-council',
	'samhan-jade-gate-valley': 'three-kingdoms-jade-gate-valley',
	'samhan-jinhung-the-cloud': 'three-kingdoms-king-jinheung',
	'samhan-prince-euija': 'three-kingdoms-prince-euija',
	'samhan-eight-great-clans': 'three-kingdoms-eight-great-clans',
	'samhan-deer-rock': 'three-kingdoms-deer-rock-council',
	'samhan-gunchogo-the-13th': 'three-kingdoms-king-geunchogo',
	'samhan-commander-yeon': 'three-kingdoms-commander-yeon',
	'samhan-five-tribes': 'three-kingdoms-five-tribes',
	'samhan-high-summit': 'three-kingdoms-high-summit',
	'samhan-gwanggeto-the-great-king': 'three-kingdoms-king-gwanggaeto',
	'five-principles-pumsuk': 'five-principles-gotaso',
	'five-principles-academy': 'five-principles-yeon-namseng',
	'five-principles-stele': 'five-principles-the-stele',
	'five-principles-dosuryu': 'five-principles-the-stele',
	'five-principles-gwansan': 'five-principles-king-seong',
	'iron-will-siege-of-daeya': 'iron-will-jukjuk',
	'iron-will-yeon-s-massacre': 'iron-will-the-revolt',
	'iron-will-chunchu-yeon': 'iron-will-the-cut',
	'iron-will-euija-yeon': 'iron-will-the-oath',
	'iron-will-yushin': 'iron-will-dragon-flower-order',
	'iron-will-yonghwa-hyangdo': 'iron-will-dragon-flower-order',
	'iron-will-the-eastern-star': 'iron-will-the-morning-star',
	'seventh-invasion-emperor': 'goguryeo-tang-war-emperor',
	'seventh-invasion-sima-yi': 'goguryeo-tang-war-king-dongcheon',
	'seventh-invasion-yodong': 'goguryeo-tang-war-yodong',
	'seventh-invasion-boiling-river': 'goguryeo-tang-war-king-dongcheon',
	'seventh-invasion-stallion-mountain': 'goguryeo-tang-war-stallion-mountain',
	'seventh-invasion-colossal-river': 'goguryeo-tang-war-eulji-mundeok',
	'seventh-invasion-ansi': 'goguryeo-tang-war-lord-of-ansi',
	'seventh-invasion-haemosu': 'goguryeo-tang-war-haemosu',
	'seventh-invasion-buyeo': 'goguryeo-tang-war-buyeo',
	'seventh-invasion-jolbon': 'goguryeo-tang-war-jolbon',
	'chunchu-era-huangdi': 'chunchu-era-li-shimin',
	'chunchu-era-bihyungnang': 'chunchu-era-bihyung',
	'chunchu-era-yongsu': 'chunchu-era-kim-yongsu',
	'chunchu-era-jiabeng': 'chunchu-era-li-shimin',
	'chunchu-era-hyukgose': 'silla-tang-war-park-hyukgose',
	'silla-tang-war-hyukgose': 'silla-tang-war-park-hyukgose',
	'chunchu-era-talhae': 'silla-tang-war-talhae',
	'chunchu-era-alji': 'silla-tang-war-alji',
	'fall-of-euija-exile': 'fall-of-baekje-yuri-dora',
	'fall-of-euija-heaven-earth-king': 'fall-of-baekje-heaven-earth-king',
	'fall-of-euija-sulmun': 'fall-of-baekje-three-princes',
	'fall-of-euija-three-princes': 'fall-of-baekje-three-princes',
	'fall-of-euija-stone-lady': 'fall-of-baekje-bonpuri',
	'fall-of-euija-gardener': 'fall-of-baekje-hallakgungi',
	'fall-of-euija-jachungbi': 'fall-of-baekje-bonpuri',
	'fall-of-euija-kangrim': 'fall-of-baekje-kangrim',
	'fall-of-euija-tribute': 'fall-of-baekje-bonpuri',
	'fall-of-euija-coup': 'haedong-jeungja-cheonbok',
	'fall-of-euija-descent': 'haedong-jeungja-lady-ungo',
	'fall-of-euija-nine-omens': 'haedong-jeungja-the-fall',
	'fall-of-euija-onjo': 'haedong-jeungja-onjo',
	'fall-of-euija-sunchung': 'haedong-jeungja-sunchung',
	'fall-of-euija-hungsu': 'haedong-jeungja-hungsu',
	'fall-of-euija-gyebek': 'haedong-jeungja-gyebek',
	'fall-of-baekje-yellow-mountain': 'fall-of-baekje-hwangsan-field',
	'fall-of-baekje-sabi': 'fall-of-baekje-buyeo-euija',
	'fall-of-baekje-ungjin-commandery': 'fall-of-baekje-echi',
	'final-stand-pyongyang-i': 'fall-of-baekje-pyongyang',
	'final-stand-snake-river': 'fall-of-baekje-snake-river',
	'final-stand-tamla-surrenders': 'fall-of-baekje-snake-river',
	'final-stand-rebellion': 'fall-of-goguryeo-kim-jinju',
	'final-stand-betrayal': 'fall-of-goguryeo-gwisil-boksin',
	'final-stand-white-river': 'fall-of-goguryeo-white-river',
	'final-stand-yeon-gesomun': 'fall-of-goguryeo-yeon-gesomun',
	'final-stand-brothers-coup': 'fall-of-goguryeo-yeon-namgun',
	'final-stand-pyongyang-ii': 'fall-of-goguryeo-yeon-namsan',
	'silla-tang-war-dangun-old-joseon': 'silla-tang-war-dangun',
	'silla-tang-war-prosperity-mountain': 'silla-tang-war-go-anseung',
	'silla-tang-war-ansung': 'silla-tang-war-go-anseung',
	'silla-tang-war-letters': 'silla-tang-war-xue-rengui',
	'silla-tang-war-final-ford': 'silla-tang-war-gibulpo',
	'silla-tang-war-wanggum': 'silla-tang-war-king-of-samhan',
	'iron-will-daeya-fortress': 'iron-will-gumil',
	'iron-will-supreme-commander': 'iron-will-the-revolt',
	'iron-will-yeons-massacre': 'iron-will-the-revolt',
	'five-principles-chunchu-munhee': 'five-principles-munhee',
	'silla-tang-war-park-jesang': 'five-principles-momal',
	'five-principles-park-jesang': 'five-principles-momal',
	'iron-will-chunchu-gesomun': 'iron-will-the-cut',
	'iron-will-euija-gesomun': 'iron-will-the-oath',
	'iron-will-kim-yushin': 'iron-will-dragon-flower-order',
	'iron-will-forty-fortresses': 'iron-will-dragon-flower-order',
	'five-principles-the-severing': 'five-principles-king-seong',
	'jumong-onjo': 'haedong-jeungja-onjo',
	'onjo-onjo': 'haedong-jeungja-onjo',
	'chunchu-era-the-flower-youth': 'five-principles-bupmin',
	'chunchu-era-silla-tang-alliance': 'chunchu-era-li-shimin',
	'chunchu-era-gaya-the-lost-nations': 'chunchu-era-suro',
	'chunchu-era-the-fall-of-gaya': 'chunchu-era-muryuk',
	'final-stand-pyongyang-fortress': 'fall-of-baekje-pyongyang',
	'epilogue-li-shimin-the-2nd-huangdi': 'epilogue-four-dragons',
	'li-shimin-the-2nd-huangdi': 'epilogue-four-dragons',
	'epilogue-emperor': 'epilogue-four-dragons',
	'final-stand-the-final-stand': 'fall-of-goguryeo-yeon-namsan',
	'silla-tang-war-goguryeo-revival-society': 'silla-tang-war-go-anseung',
	'samhan-jinheung-the-crescent-moon': 'three-kingdoms-king-jinheung',
	'samhan-jinheung-the-cloud-king': 'three-kingdoms-king-jinheung',
	'jinheung-the-cloud-king': 'three-kingdoms-king-jinheung',
	'samhan-the-eight-great-clans': 'three-kingdoms-prince-euija',
	'samhan-gunchogo-the-hurricane': 'three-kingdoms-king-geunchogo',
	'samhan-ocean-trade': 'three-kingdoms-king-geunchogo',
	'samhan-the-summit': 'three-kingdoms-commander-yeon',
	'samhan-birth-of-namseng': 'three-kingdoms-high-summit',
	'samhan-gwanggaeto-the-conqueror': 'three-kingdoms-king-gwanggaeto',
	'five-principles-gotasos-wedding': 'five-principles-gotaso',
	'five-principles-yeons-three-sons': 'five-principles-yeon-namseng',
	'five-principles-grand-academy': 'five-principles-yeon-namseng',
	'five-principles-king-euija-the-31st-eraha': 'five-principles-king-euija',
	'iron-will-not-even-human': 'iron-will-gumil',
	'jumong-jumong': 'goguryeo-tang-war-haemosu',
	'jumong-dongmyung': 'goguryeo-tang-war-jolbon',
	'seventh-invasion-emperor-of-the-west': 'goguryeo-tang-war-emperor',
	'seventh-invasion-four-dragons': 'goguryeo-tang-war-emperor',
	'seventh-invasion-great-river': 'goguryeo-tang-war-eulji-mundeok',
	'seventh-invasion-longmen-field': 'goguryeo-tang-war-emperor',
	'seventh-invasion-eastern-fortress': 'goguryeo-tang-war-yodong',
	'chunchu-era-the-hwarang': 'five-principles-bupmin',
	'chunchu-era-harbour-ledgers': 'chunchu-era-jahee',
	'chunchu-era-the-harmony-council': 'chunchu-era-gi',
	'chunchu-era-bidams-rebellion': 'chunchu-era-seung',
	'chunchu-era-chunchu-goes-to-the-east': 'chunchu-era-gi',
	'chunchu-era-the-emperor': 'chunchu-era-li-shimin',
	'chunchu-era-death-of-the-second-emperor': 'chunchu-era-li-shimin',
	'chunchu-era-the-royal-secretariat': 'chunchu-era-royal-secretariat',
	'fall-of-euija-gyebeks-exile': 'fall-of-baekje-yuri-dora',
	'fall-of-euija-euijas-coup': 'haedong-jeungja-cheonbok',
	'fall-of-euija-euijas-descent': 'haedong-jeungja-lady-ungo',
	'fall-of-euija-sulmun-and-the-three-princes': 'fall-of-baekje-three-princes',
	'fall-of-euija-sulmuns-apron': 'fall-of-baekje-three-princes',
	'fall-of-euija-black-rock': 'fall-of-baekje-yuri-dora',
	'fall-of-euija-gameunjang': 'fall-of-baekje-bonpuri',
	'fall-of-euija-jacheongbi': 'fall-of-baekje-bonpuri',
	'fall-of-euija-five-thousand': 'fall-of-baekje-yuri-dora',
	'fall-of-euija-baekjuto-and-socheon-guk': 'fall-of-baekje-three-princes',
	'fall-of-euija-sanbangduk': 'fall-of-baekje-bonpuri',
	'fall-of-euija-the-nine-plagues': 'haedong-jeungja-the-fall',
	'fall-of-euija-the-fifth-year': 'haedong-jeungja-gyebek',
	'fall-of-euija-the-tribute-of-oranges': 'fall-of-baekje-bonpuri',
	'fall-of-euija-the-three-loyalists': 'haedong-jeungja-sunchung',
	'fall-of-euija-sungchung': 'haedong-jeungja-sunchung',
	'epilogue-part-ii-annual-meeting-of-the-three-realms': 'epilogue-part-ii-three-realms',
	'fall-of-baekje-the-red-fowl': 'fall-of-baekje-hwangsan-field',
	'fall-of-baekje-yellow-mountain-fields': 'fall-of-baekje-hwangsan-field',
	'fall-of-baekje-sabi-palace': 'fall-of-baekje-buyeo-euija',
	'fall-of-baekje-the-death-of-buyeo-euija': 'fall-of-baekje-buyeo-euija',
	'fall-of-baekje-the-seven-branched-sword': 'fall-of-baekje-king-pungjang',
	'fall-of-baekje-the-death-of-kim-chunchu': 'fall-of-baekje-kim-chunchu',
	'fall-of-baekje-the-four-beasts': 'fall-of-baekje-echi',
	'fall-of-baekje-baekje-restoration-society': 'fall-of-baekje-king-pungjang',
	'fall-of-baekje-white-river': 'fall-of-goguryeo-white-river',
	'final-stand-pyongyang': 'fall-of-baekje-pyongyang',
	'final-stand-the-surrender-of-tamla': 'fall-of-baekje-snake-river',
	'final-stand-the-bear-ford-commandery': 'fall-of-baekje-echi',
	'final-stand-mount-gain': 'silla-tang-war-go-anseung',
	'silla-tang-war-mount-gain': 'silla-tang-war-go-anseung',
	'final-stand-the-death-of-yeon-gesomun': 'fall-of-goguryeo-yeon-gesomun',
	'final-stand-the-brothers-coup': 'fall-of-goguryeo-yeon-namgun',
	'final-stand-pyongyang-a': 'fall-of-goguryeo-yeon-namsan',
	'silla-tang-war-your-humble-servant': 'silla-tang-war-xue-rengui',
	'silla-tang-war-betrayal': 'silla-tang-war-xue-rengui',
	'silla-tang-war-the-death-of-kim-yushin': 'silla-tang-war-kim-yushin',
	'silla-tang-war-maeso-fortress': 'silla-tang-war-maeso',
	'silla-tang-war-inmun': 'silla-tang-war-maeso',
	'silla-tang-war-strike-harbor': 'silla-tang-war-gibulpo',
	'seventh-invasion-jumong': 'goguryeo-tang-war-haemosu',
	'silla-tang-war-the-protectorate': 'silla-tang-war-go-anseung',
	'samhan-jinheung-the-cloud': 'three-kingdoms-king-jinheung',
	'samhan-gwanggaeto-the-great-king': 'three-kingdoms-king-gwanggaeto',
	'iron-will-mehwa': 'iron-will-maehwa',
	'iron-will-siege-of-deya': 'iron-will-jukjuk',
	'chunchu-era-sung': 'chunchu-era-seung',
	'chunchu-era-jun': 'chunchu-era-jeon',
	'chunchu-era-jeon': 'chunchu-era-jeon',
	'chunchu-era-gyeol': 'chunchu-era-gyul',
	'chunchu-era-king-muyul': 'chunchu-era-king-muyeol',
	'chunchu-era-king-muyeol': 'chunchu-era-king-muyeol',
	'fall-of-euija-heungsu': 'haedong-jeungja-hungsu',
	'silla-tang-war-anseung': 'silla-tang-war-go-anseung',
	'silla-tang-war-the-wanggeoms-guest': 'silla-tang-war-munmu',
	'silla-tang-war-the-wanggums-guest': 'silla-tang-war-munmu',
	'silla-tang-war-the-king-for-all': 'silla-tang-war-king-of-samhan',
	'silla-tang-war-meso': 'silla-tang-war-maeso',
	jumong: 'goguryeo-tang-war-haemosu'
};

/** Flat episode list — slug ids match TOC / URL hashes (`chapterId-title-slug`).
 * Index 0 is the prologue (the default with no `?ep=`), its own episode before the first entry.
 * A Part title page opens the Part, then each Arc and each named Chapter has its own page
 * before the episodes inside it. */
export const PROLOGUE_EPISODE_ID = 'prologue';

export const episodes: EpisodeRef[] = [
	{ kind: 'prologue', chapterId: 'prologue', chapterIndex: -1, entryIndex: -1, id: PROLOGUE_EPISODE_ID },
	...chapters.flatMap((ch, chapterIndex): EpisodeRef[] => {
		const pages: EpisodeRef[] = [];
		if (ch.part) {
			pages.push({ kind: 'part', chapterId: ch.id, chapterIndex, entryIndex: -1, id: partId(ch.id) });
		}
		if (!isPrologue(ch)) {
			pages.push({ kind: 'arc', chapterId: ch.id, chapterIndex, entryIndex: -1, id: arcPageId(ch.id) });
		}
		for (const [entryIndex, entry] of ch.entries.entries()) {
			const head = chapterHeadedBy(ch.id, entry.title);
			if (head) {
				pages.push({
					kind: 'chapter',
					chapterId: ch.id,
					chapterIndex,
					entryIndex,
					id: tocAnchor(ch.id, head)
				});
			}
			pages.push({
				kind: 'entry',
				chapterId: ch.id,
				chapterIndex,
				entryIndex,
				id: entryId(ch.id, entry.title)
			});
		}
		return pages;
	})
];

/** Title slug only — `jumong` from `jumong-jumong`. The title and Part pages keep their whole id. */
export function episodeTitleSlug(ep: EpisodeRef): string {
	if (ep.kind !== 'entry') return ep.id;
	return ep.id.slice(ep.chapterId.length + 1);
}

/** Title slugs that appear once — safe as bare `?ep=` values. */
const UNIQUE_TITLE_SLUGS = (() => {
	const counts = new Map<string, number>();
	for (const ep of episodes) {
		const slug = episodeTitleSlug(ep);
		counts.set(slug, (counts.get(slug) ?? 0) + 1);
	}
	const unique = new Set<string>();
	for (const [slug, n] of counts) {
		if (n === 1) unique.add(slug);
	}
	return unique;
})();

/**
 * Shortest stable query id for an episode: bare title slug when unique
 * (`jumong`), else the full `chapterId-slug` (`jumong-jumong`).
 */
export function episodeQueryId(ep: EpisodeRef): string {
	const slug = episodeTitleSlug(ep);
	return UNIQUE_TITLE_SLUGS.has(slug) ? slug : ep.id;
}

const LAST_EPISODE_KEY = 'kingdom:last-episode';

/** Remember the story episode open in the reader, for the hub's Continue. Title and Part pages are skipped. */
export function rememberLastEpisode(index: number) {
	const ep = episodes[index];
	if (!browser || ep?.kind !== 'entry') return;
	try {
		localStorage.setItem(LAST_EPISODE_KEY, ep.id);
	} catch {
		/* private mode */
	}
}

/** The story episode the reader last had open, if any. */
export function lastEpisode(): EpisodeRef | null {
	if (!browser) return null;
	try {
		const id = localStorage.getItem(LAST_EPISODE_KEY);
		return episodes.find((ep) => ep.kind === 'entry' && ep.id === id) ?? null;
	} catch {
		return null;
	}
}

/** Episode picker label: `7.13 · Hyukgosé` (Heewon's note is plain `Foreword`); Korean titles when the reader picks Korean. */
export function episodeNavLabel(ep: EpisodeRef): string {
	const ko = reading.lang === 'ko';
	if (ep.kind === 'prologue') return ko ? '서문' : 'Foreword';
	if (ep.kind === 'part') {
		const ch = chapters[ep.chapterIndex];
		const name = (ko ? ch.partKorean : ch.partTitle) ?? '';
		const label = partLabel(ch.part ?? '', ko);
		return name ? `${label} · ${name}` : label;
	}
	if (ep.kind === 'arc') {
		const ch = chapters[ep.chapterIndex];
		const name = (ko ? ch?.korean : ch?.title) ?? '';
		const label = arcLabelAt(ep.chapterIndex, ko);
		return name ? `${label} · ${name}` : label;
	}
	if (ep.kind === 'chapter') {
		const ch = chapters[ep.chapterIndex];
		const entry = ch?.entries[ep.entryIndex];
		const c = entry ? chapterHeadedBy(ch.id, entry.title) : undefined;
		const name = (ko ? c?.ko : c?.label) ?? '';
		const n = c ? chapterNumberOf(c) : null;
		const label = n ? chapterLabel(n, ko) : ko ? '장' : 'Chapter';
		return name ? `${label} · ${name}` : label;
	}
	const entry = chapters[ep.chapterIndex]?.entries[ep.entryIndex];
	const title =
		(ko ? entry?.subtitle?.trim() : undefined) || entry?.title?.trim() || episodeTitleSlug(ep);
	const num = episodeNumber(ep.chapterIndex, ep.entryIndex);
	const label = num ? `${num} · ${title}` : title;
	return isLoveEpisode(ep.id) ? `♡ ${label}` : label;
}

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
	/** Mohe speech in romanized Manchu (subtitle layer) */
	linesMnc: [] as string[],
	lang: 'en' as Lang,
	/** Script from first paint. Switching mid-session still persists. */
	mode: 'script' as ReadMode,
	/** Episodes by default — one entry mounted, far fewer cue fetches. */
	viewScope: 'episodes' as ViewScope,
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
	root.toggle('is-screenplay', m === 'screenplay');
	root.toggle('is-storyboard', m === 'storyboard');
	root.toggle('is-stage', m === 'immersion' || m === 'cinema');
	if (m !== 'cinema') root.remove('is-cinema-peek');
}

/** Modes that put the live line on a stage — immersion's plate, cinema's strip. */
export function isStageMode(m: ReadMode = reading.mode) {
	return m === 'immersion' || m === 'cinema';
}

/** Print script and storyboard. Neither is a stage and neither uses the manuscript column. */
export function isDocumentMode(m: ReadMode = reading.mode) {
	return m === 'screenplay' || m === 'storyboard';
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

/** Versioned so the switch to an English default reaches readers who had saved 'both'. */
const LANG_KEY = 'kingdom:lang:v2';

function isLang(v: string | null): v is Lang {
	return v === 'en' || v === 'ko' || v === 'both';
}

/** Paint the choice onto the document so titles and every page share it. */
function paintLang(l: Lang) {
	reading.lang = l;
	if (!browser) return;
	document.documentElement.dataset.lang = l;
	document.documentElement.lang = l === 'en' ? 'en' : 'ko';
}

export function setLang(l: Lang) {
	paintLang(l);
	try {
		localStorage.setItem(LANG_KEY, l);
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
	if (m === 'script' && prev !== 'script') autoOpenToc();
	// refresh speaker / speaking highlight for the new mode
	window.dispatchEvent(new Event('scroll'));
	/* The mode also decides where the art goes — sticky runway or inline
	   figures — so the column's height only settles a frame later. */
	requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
}

export function loadLang() {
	try {
		const v = localStorage.getItem(LANG_KEY);
		paintLang(isLang(v) ? v : reading.lang);
	} catch {
		/* ignore */
	}
}

/** Other tabs write the same key. This tab follows. */
export function bindLangSync() {
	if (!browser) return () => {};
	const onStorage = (e: StorageEvent) => {
		if (e.key !== LANG_KEY || !isLang(e.newValue)) return;
		paintLang(e.newValue);
	};
	window.addEventListener('storage', onStorage);
	return () => window.removeEventListener('storage', onStorage);
}

export function loadMode() {
	applyModeClasses(reading.mode);
}

export function loadViewScope() {
	try {
		const urlHasView =
			browser &&
			(() => {
				const u = new URL(location.href);
				return u.searchParams.has(VIEW_QUERY) || u.searchParams.has(EP_QUERY);
			})();
		/* Address bar wins over the saved preference. */
		if (!urlHasView) {
			const v = localStorage.getItem('kingdom:view');
			if (v === 'full' || v === 'episodes') reading.viewScope = v;
		}
	} catch {
		/* ignore */
	}
	if (!browser) return;
	/* Hydrate index FROM the URL before writing — otherwise episodeIndex 0
	   (Queen Sunduk) overwrites a bookmarked `?ep=jumong` on every mount. */
	const epParam = new URL(location.href).searchParams.get(EP_QUERY);
	/* A refreshed bare `/read` reopens the episode the reader was on, not the foreword. */
	if (!epParam && reading.viewScope === 'episodes') {
		const spot = reloadedSpot();
		const idx = spot ? resolveEpisodeIndex(spot.id) : -1;
		if (idx >= 0) reading.episodeIndex = idx;
	}
	applyReadingFromUrl(new URL(location.href));
	if (reading.viewScope === 'episodes') {
		/* A bare visit (or the prologue) opens with the TOC shut. */
		if (epParam && episodes[reading.episodeIndex]?.kind !== 'prologue') autoOpenToc();
		scriptUi.inScript = true;
		syncReadingUrl();
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
		autoOpenToc();
		scriptUi.inScript = true;
	}

	syncReadingUrl();

	const after = () => {
		const ep = episodes[reading.episodeIndex];
		if (!ep) {
			window.dispatchEvent(new Event('scroll'));
			return;
		}
		if (ep.kind === 'prologue' || (s === 'episodes' && ep.kind !== 'entry')) {
			scrollStoryToTop();
			window.dispatchEvent(new Event('scroll'));
			return;
		}
		const el = findStoryHeading(ep.id);
		if (el) scrollToStoryHeading(el, 'auto');
		window.dispatchEvent(new Event('scroll'));
	};

	/* Episodes → full needs a frame for every entry to mount; full → episodes too. */
	requestAnimationFrame(() => requestAnimationFrame(after));
}

/** True while applying `?view` / `?ep` from the address bar (skip echo writes). */
let applyingReadingUrl = false;

/**
 * Write `ep` (or drop it in full scope) via SvelteKit `goto`.
 * Mutates the current URL so `nsfw`, `edit`, Intimate, and any other flags stay.
 */
export function syncReadingUrl() {
	if (!browser || applyingReadingUrl) return;
	try {
		const url = new URL(location.href);
		let dirty = false;
		if (reading.viewScope === 'episodes') {
			/* `?ep=jumong` alone implies episodes — drop legacy `view=episodes`. */
			if (url.searchParams.has(VIEW_QUERY)) {
				url.searchParams.delete(VIEW_QUERY);
				dirty = true;
			}
			const ep = episodes[reading.episodeIndex];
			const qid = ep ? episodeQueryId(ep) : null;
			if (qid && url.searchParams.get(EP_QUERY) !== qid) {
				url.searchParams.set(EP_QUERY, qid);
				dirty = true;
			}
		} else {
			if (url.searchParams.has(VIEW_QUERY)) {
				url.searchParams.delete(VIEW_QUERY);
				dirty = true;
			}
			if (url.searchParams.has(EP_QUERY)) {
				url.searchParams.delete(EP_QUERY);
				dirty = true;
			}
		}
		if (!dirty) return;
		const next = `${url.pathname}${url.search}${url.hash}`;
		void goto(next, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
			invalidateAll: false
		}).catch(() => {
			try {
				replaceState(next, {});
			} catch {
				history.replaceState(null, '', next);
			}
		});
	} catch {
		/* private / SSR */
	}
}

/**
 * Apply `?view=` / `?ep=` from the URL. No-ops when neither param is present so
 * localStorage / in-memory scope survive unrelated query edits (`nsfw`, `edit`).
 */
export function applyReadingFromUrl(url: URL) {
	if (!browser) return;
	const view = url.searchParams.get(VIEW_QUERY);
	const epParam = url.searchParams.get(EP_QUERY);
	if (view === null && epParam === null) return;

	applyingReadingUrl = true;
	try {
		if (view === 'full') {
			if (reading.viewScope !== 'full') {
				reading.viewScope = 'full';
				persistViewScope('full');
				releaseDialogue();
				requestAnimationFrame(() => window.dispatchEvent(new Event('scroll')));
			}
			return;
		}

		const wantEpisodes = view === 'episodes' || !!epParam;
		if (!wantEpisodes) return;

		let changed = false;
		if (reading.viewScope !== 'episodes') {
			reading.viewScope = 'episodes';
			persistViewScope('episodes');
			changed = true;
		}
		scriptUi.inScript = true;

		if (epParam) {
			const idx = resolveEpisodeIndex(epParam);
			if (idx >= 0 && reading.episodeIndex !== idx) {
				reading.episodeIndex = idx;
				releaseDialogue();
				changed = true;
			}
		}

		if (!changed && !readKeptScroll()) return;

		if (changed) stripStoryHash();
		const dest = epParam ? canonicalHashId(epParam) : episodes[reading.episodeIndex]?.id;
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				if (restoreKeptReadingScroll() || restoreReadingSpot()) return;
				if (!changed) {
					window.dispatchEvent(new Event('scroll'));
					return;
				}
				if (!dest) {
					window.dispatchEvent(new Event('scroll'));
					return;
				}
				const ep = episodes[reading.episodeIndex];
				if (ep && ep.kind !== 'entry') {
					window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
					window.dispatchEvent(new Event('scroll'));
					return;
				}
				const el = findStoryHeading(dest) ?? (ep ? findStoryHeading(ep.id) : null);
				if (el) scrollToStoryHeading(el, 'auto');
				window.dispatchEvent(new Event('scroll'));
			})
		);
	} finally {
		applyingReadingUrl = false;
	}
}

/** Resolve a chapter, slug, leftover, or `chapterId-index` hash to a flat episode index, or -1. */
export function resolveEpisodeIndex(id: string): number {
	return resolveStoryTarget(id)?.episodeIndex ?? -1;
}

/** Hash destination: which episode to show, and which DOM id to scroll to. */
export type StoryTarget = { episodeIndex: number; hashId: string };

/**
 * Resolve a chapter, episode, leftover, short `?ep=` slug, or `#chapter-episode-scene` hash.
 * Scene ids are `episodeId-scene-slug` (longest matching episode prefix).
 * Short query ids (`jumong`) match a unique title slug.
 */
export function resolveStoryTarget(id: string): StoryTarget | null {
	if (!id) return null;

	const exact = episodes.findIndex((e) => e.id === id);
	if (exact >= 0) return { episodeIndex: exact, hashId: id };

	const aliased = EPISODE_HASH_ALIASES[id];
	if (aliased) return aliasTarget(aliased);

	/* Bare title slug from `?ep=jumong` (unique across the chronicle). */
	const byTitleSlug = episodes.findIndex((e) => episodeTitleSlug(e) === id);
	if (byTitleSlug >= 0 && UNIQUE_TITLE_SLUGS.has(id)) {
		return { episodeIndex: byTitleSlug, hashId: episodes[byTitleSlug].id };
	}

	if (chapters.some((ch) => ch.id === id)) {
		const arcIdx = episodes.findIndex((e) => e.kind === 'arc' && e.chapterId === id);
		if (arcIdx >= 0) return { episodeIndex: arcIdx, hashId: episodes[arcIdx].id };
		const idx = episodes.findIndex((e) => e.kind === 'entry' && e.chapterId === id);
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

	const retired = Object.keys(EPISODE_HASH_ALIASES)
		.filter((old) => id.startsWith(`${old}-`))
		.sort((a, b) => b.length - a.length)[0];
	return retired ? aliasTarget(EPISODE_HASH_ALIASES[retired]) : null;
}

function aliasTarget(episodeId: string): StoryTarget | null {
	const idx = episodes.findIndex((e) => e.id === episodeId);
	return idx >= 0 ? { episodeIndex: idx, hashId: episodeId } : null;
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

	if (el.matches('article.entry, .entry-head')) {
		/* The head scrolls with the page: land on its breadcrumb row so the
		   whole head shows below the fixed menu buttons. */
		const head = el.matches('.entry-head') ? el : firstPainted(el, ['.entry-head']);
		const crumbs = head ? firstPainted(head, ['.crumbs']) : null;
		return crumbs ?? firstPainted(el, ['.episode h2', 'h2']) ?? head ?? el;
	}
	if (el.matches('section.chapter, .chapter-head')) {
		return firstPainted(el, ['.chapter-title h1', 'h1']) ?? el;
	}
	if (el.matches('.part-page')) {
		return firstPainted(el, ['.part-title', '.part-eyebrow']) ?? el;
	}
	if (el.matches('[data-scene], .day, .story, .mini')) {
		return firstPainted(el, ['.story-label', '.day-label', '.mini-title', 'h1', 'h2']) ?? el;
	}
	return firstPainted(el, ['h1', 'h2']) ?? el;
}

/** The chronicle document — class `.script`, never `id="script"` (that was a `:target`). */
export function storyRoot(): HTMLElement | null {
	if (typeof document === 'undefined') return null;
	return document.querySelector<HTMLElement>('[data-story-root]');
}

/**
 * The header the reader is under at viewport Y `line`: the last `[data-scene]`
 * above it, keyed like `summarySections` (the episode id before the first one).
 * A titled flashback owns only its own box; past it, the outer scene resumes.
 */
export function sectionAt(line: number): { key: string; title: string } | null {
	const root = storyRoot();
	if (!root) return null;
	for (const article of root.querySelectorAll<HTMLElement>('article.entry')) {
		const r = article.getBoundingClientRect();
		if (r.top > line || r.bottom < line || !article.dataset.storyId) continue;
		let key = article.dataset.storyId;
		let title = '';
		for (const el of article.querySelectorAll<HTMLElement>('[data-scene]')) {
			const box = el.getBoundingClientRect();
			if (box.top > line) break;
			const flash = el.classList.contains('mini');
			if (flash && box.bottom < line) continue;
			key = el.dataset.scene ?? key;
			title =
				el.querySelector(flash ? '.mini-title' : '.day-label, .story-label')?.textContent?.trim() ?? '';
		}
		return { key, title };
	}
	return null;
}

/** Report the section under the reading line (40% down) on every scroll and resize. Returns the cleanup. */
export function watchSection(on: (section: { key: string; title: string } | null) => void): () => void {
	let raf = 0;
	const sync = () => {
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = 0;
			on(sectionAt(window.innerHeight * 0.4));
		});
	};
	sync();
	window.addEventListener('scroll', sync, { passive: true });
	window.addEventListener('resize', sync);
	return () => {
		if (raf) cancelAnimationFrame(raf);
		window.removeEventListener('scroll', sync);
		window.removeEventListener('resize', sync);
	};
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

	for (const fixed of document.querySelectorAll<HTMLElement>(
		'.hud.in, .toc-toggle.in, .title-pill.in'
	)) {
		if (!isPainted(fixed)) continue;
		const r = fixed.getBoundingClientRect();
		if (r.bottom > 0 && overlapsX(r)) chrome = Math.max(chrome, r.bottom);
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

/** Land on the very top of the document, cancelling any pending heading jump's follow-ups. */
export function scrollStoryToTop() {
	storyJumpGen += 1;
	scrollScrollerTo(readingScroller(), 0, 'auto');
	if (readingScroller() !== window) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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

/** Last episode change. `dir` is 1 forward and -1 back; `gen` ticks so the turn can replay. */
export const pageTurn = $state({ dir: 0 as -1 | 0 | 1, gen: 0 });

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
	if (next !== reading.episodeIndex) {
		pageTurn.dir = next > reading.episodeIndex ? 1 : -1;
		pageTurn.gen++;
	}
	reading.episodeIndex = next;
	reading.sceneId = opts.destId && opts.destId !== episodes[next]?.id ? opts.destId : null;
	releaseDialogue();
	/* Query first so the address bar matches the mounted entry even if scroll
	   waits a frame for the new article. */
	syncReadingUrl();

	const ep = episodes[next];
	const destId = opts.destId ?? ep.id;
	stripStoryHash();
	if (opts.closeToc === true) tocUi.open = false;

	const scroll = opts.scroll !== false;
	/* One mounted episode: its head is the top of the page, so episode, chapter
	   and part jumps start there; only a scene header lands mid-entry. */
	const isScene = (id: string) => !!storyElement(id)?.matches('[data-scene]');
	const finish = () => {
		if (scroll) {
			const toTop =
				ep.kind === 'prologue' ||
				(reading.viewScope === 'episodes' && (destId === ep.id || !isScene(destId)));
			if (toTop) {
				scrollStoryToTop();
			} else {
				const el = findStoryHeading(destId) ?? findStoryHeading(ep.id);
				if (el) scrollToStoryHeading(el, 'auto');
				else {
					const script = storyRoot();
					if (script) scrollToStoryHeading(script, 'auto');
				}
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
	reading.linesMnc = readLines(el, '.line.mnc');
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
 * Let go of the line currently on stage.
 *
 * The plate latches an utterance until the next scroll measurement, so anything
 * that can take that line out of the document — the Intimate toggle — has to
 * clear it, or a hidden line keeps speaking.
 */
export function clearUtterance() {
	releaseDialogue();
	applyUtterance(null, null);
	markSpeaking(null);
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

		/* A flashback episode, mounted alone, holds the whole page in the past. */
		let flash = reading.viewScope === 'episodes' && !!root.querySelector('article[data-flash]');
		for (const el of root.querySelectorAll('[data-flash]')) {
			if (flash) break;
			if (inBand(el)) flash = true;
		}

		const musicHeld = (() => {
			/* A cue starts when its paragraph reaches the reading line and holds
			   until a later cue does. The entry's own track is the floor. */
			const mid = (top + bottom) / 2;
			let best: HTMLElement | null = null;
			let bestTop = -Infinity;
			for (const el of root.querySelectorAll<HTMLElement>('[data-music]')) {
				const name = el.dataset.music;
				if (!name) continue;
				const r = el.getBoundingClientRect();
				if (r.top > mid) continue;
				if (r.top >= bestTop) {
					bestTop = r.top;
					best = el;
				}
			}
			return best?.dataset.music ?? null;
		})();
		const music = musicHeld;
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
		saveReadingSpot(entry);
		/* Full scope: scroll advances the episode index.
		   Episodes scope: URL / TOC / Prev-Next own the index — don't let the
		   band watcher fight a bookmarked `?ep=` (or snap back to index 0). */
		if (entryKey && reading.viewScope === 'full') {
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
			const mnc = readLines(dialogue, '.line.mnc');
			const sameLines =
				ko.join('\0') === reading.linesKo.join('\0') &&
				en.join('\0') === reading.linesEn.join('\0') &&
				zh.join('\0') === reading.linesZh.join('\0') &&
				zhLatn.join('\0') === reading.linesZhLatn.join('\0') &&
				ja.join('\0') === reading.linesJa.join('\0') &&
				jaLatn.join('\0') === reading.linesJaLatn.join('\0') &&
				mnc.join('\0') === reading.linesMnc.join('\0');
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
		document.documentElement.classList.remove('is-screenplay');
		document.documentElement.classList.remove('is-storyboard');
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
		if (reading.viewScope === 'episodes') scriptUi.inScript = true;
	} catch {
		/* private mode */
	}
	import.meta.hot?.on('vite:beforeFullReload', () => rememberReadingScroll());
}
