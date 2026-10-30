import {
	arcNumber,
	chapters as arcs,
	entryId,
	episodeNumber,
	isPrologue,
	type Chapter as Arc,
	type Entry
} from '$lib/story';
import { episodeKindsOf, type EpisodeKind } from '$lib/episodeKinds';

/**
 * Reading hierarchy: Part → Arc → Chapter → Episode.
 * An Arc is a top-level `story.json` record (its id keeps the old `chapterId` name in the data);
 * its Chapters are the named runs below; each entry is an Episode.
 */

/** A named Chapter inside an Arc and the episode titles it holds, in story order. The first title anchors the row. */
export type TocChapter = {
	label: string;
	ko: string;
	/** Official English title-card line (MCU subtitle). */
	subtitle: string;
	subtitleKo: string;
	titles: string[];
};

const chapter = (
	label: string,
	ko: string,
	subtitle: string,
	subtitleKo: string,
	...titles: string[]
): TocChapter => ({ label, ko, subtitle, subtitleKo, titles });

/** Each Arc lists its Chapters. Episodes outside every Chapter stay on the spine by themselves. */
export const ARC_CHAPTERS: Record<string, TocChapter[]> = {
	'three-kingdoms': [
		chapter('Silla', '신라', 'The First Crown', '첫 왕관', 'Queen Sunduk', 'Harmony Council', 'Jade Gate Valley', 'King Jinheung'),
		chapter('Baekje', '백제', 'Eight Houses', '여덟 집', 'Prince Euija', 'Eight Great Clans', 'Deer Rock Council', 'King Geunchogo'),
		chapter('Goguryeo', '고구려', 'The Eternal General', '영원대장군', 'Commander Yeon', 'Five Tribes', 'High Summit', 'King Gwanggaeto')
	],
	'five-principles': [
		chapter('Hwarang', '화랑', 'The First Yard', '첫 마당', 'Bupmin', 'Sadaham', 'Gotaso', 'Munhee', 'Park Jesang'),
		chapter('Master of the Classics', '오경박사', 'A Single Story', '이야기 하나', 'King Euija', 'King Seong', 'Yunchung'),
		chapter('Grand Academy', '태학', 'One Seal', '인장 하나', 'Yeon Namseng', 'The Stele', 'Ulbul')
	],
	'iron-will': [
		chapter('Daeya', '대야성', 'The Inner Gate', '안쪽 문', 'Gumil', 'Maehwa', 'Jukjuk'),
		chapter('Supreme Commander', '대막리지', 'The Banquet', '그 연회', 'The Revolt', 'The Cut', 'The Oath'),
		chapter('Marshal', '대장군', 'A Name That Strikes', '이름만으로', 'Nangbi', 'Dragon Flower Order', 'The Morning Star')
	],
	'goguryeo-tang-war': [
		chapter('Four Dragons', '사룡', 'Half the World', '세상의 반', 'Emperor', 'Yodong', 'King Dongcheon'),
		chapter('Ansi', '안시성', 'The Lazy Eye', '게으른 눈', 'Stallion Mountain', 'Lord of Ansi', 'Eulji Mundeok'),
		chapter('Jumong', '주몽', 'The Holy Bow', '성왕의 활', 'Haemosu', 'Buyeo', 'Jolbon', 'Hodong')
	],
	'chunchu-era': [
		chapter('Bidam', '비담', 'A Hundred and Eight', '백팔', 'Gi', 'Suro', 'Seung', 'Muryuk', 'Jeon', 'Seohyun', 'Gyul'),
		chapter('Sungman', '승만', 'Padded Temples', '솜 넣은 관', 'Queen Jinduk', 'Li Shimin', 'Royal Secretariat'),
		chapter('Chunchu', '춘추', 'The Other Name', '다른 이름', 'Bihyung', 'Kim Yongsu', 'King Muyeol', 'Jahee')
	],
	'haedong-jeungja': [
		chapter('Three Thousand Maids', '삼천궁녀', 'Forty-One Sons', '마흔한 아들', 'Cheonbok', 'Lady Ungo', 'The Fall'),
		chapter('Three Loyalists', '삼충신', 'The Last Word', '마지막 한마디', 'Onjo', 'Sunchung', 'Hungsu', 'Gyebek')
	],
	'fall-of-baekje': [
		chapter(
			'Tamla',
			'탐라',
			'Two Suns',
			'두 개의 해',
			'Yuri Dora',
			'Heaven–Earth King',
			'Three Princes',
			'Hallakgungi',
			'Kangrim',
			'Bonpuri'
		),
		chapter('Yellow Mountain', '황산벌', 'Five Thousand', '오천', 'Hwangsan Field', 'Buyeo Euija', 'Kim Chunchu', 'King Pungjang'),
		chapter('Four Beasts', '사수', 'The White Coat', '흰 옷', 'Echi', 'Pyongyang', 'Snake River')
	],
	'fall-of-goguryeo': [
		chapter('Kudara', '쿠다라', 'Except Baekje', '백제만 빼고', 'Kim Jinju', 'Gwisil Boksin', 'White River'),
		chapter('Grand Supreme Commander', '태대막리지', 'The Five Swords', '다섯 자루', 'Yeon Gesomun', 'Yeon Namgun', 'Yeon Namsan')
	],
	'silla-tang-war': [
		chapter('Hyukgosé', '혁거세', 'The White Horse', '백마', 'Park Hyukgosé', 'Talhae', 'Alji', 'Sound Kingdom'),
		chapter('Supreme Marshal', '태대각간', 'The Letter', '편지', 'Xue Rengui', 'Go Anseung', 'Stone Gate', 'Wonsul', 'Kim Yushin'),
		chapter('Unified Silla', '통일신라', 'The Open Hall', '열린 대청', 'Dangun', 'Munmu', 'Maeso', 'Gibulpo', 'King of Samhan')
	]
};

/** Reader-facing Chapter numbers: one running count over every Chapter in reading order. */
const CHAPTER_NUMBERS: Map<TocChapter, number> = (() => {
	const map = new Map<TocChapter, number>();
	let n = 0;
	for (const arc of arcs) for (const c of ARC_CHAPTERS[arc.id] ?? []) map.set(c, ++n);
	return map;
})();

export function chapterNumberOf(c: TocChapter): number | null {
	return CHAPTER_NUMBERS.get(c) ?? null;
}

export type TocEpisode = {
	id: string;
	/** Running episode ordinal in reading order — `37`. */
	num: string;
	title: string;
	/** Korean title (`entry.subtitle`), shown when the reader picks Korean. */
	ko?: string;
	/** Material Symbol categories after the title — only episodes that fit (love, battle, myth…). */
	kinds: EpisodeKind[];
};

export function chapterOf(arcId: string, title: string): TocChapter | undefined {
	return ARC_CHAPTERS[arcId]?.find((c) => c.titles.includes(title));
}

/** Element id on /episodes for an Arc, or for one of its Chapters. */
export function tocAnchor(arcId: string, c?: TocChapter): string {
	if (!c) return `ch-${arcId}`;
	const slug = c.label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	return `ch-${arcId}--${slug}`;
}

/** The Chapter a spine row heads, if this episode opens one. */
export function chapterHeadedBy(arcId: string, title: string): TocChapter | undefined {
	return ARC_CHAPTERS[arcId]?.find((c) => c.titles[0] === title);
}

/** The Part this Arc sits in, walking back to the Arc that opened it. */
export function partContext(
	arcIndex: number
): { label: string; title: string; korean?: string } | undefined {
	for (let i = arcIndex; i >= 0; i--) {
		const arc = arcs[i];
		if (arc?.part && arc.partTitle) return { label: arc.part, title: arc.partTitle, korean: arc.partKorean };
	}
	return undefined;
}

export function spineLabel(arc: Arc, en: Entry, ko = false): string {
	const c = chapterHeadedBy(arc.id, en.title);
	if (ko) return c?.ko ?? en.subtitle ?? en.title;
	return c?.label ?? en.title;
}

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };

/** `Part II` → `제2부`. */
export function partLabel(part: string, ko = false): string {
	if (!ko) return part;
	const n = ROMAN[part.replace(/^Part\s+/i, '').trim()];
	return n ? `제${n}부` : part;
}

/** `Arc 3` / `제3편`; epilogues (no number) read `Epilogue` / `에필로그`. */
export function arcLabel(n: number | null, ko = false): string {
	if (n === null) return ko ? '에필로그' : 'Epilogue';
	return ko ? `제${n}편` : `Arc ${n}`;
}

/** `Arc 3` for the Arc at this index; `Prologue` / `Epilogue` for the unnumbered ones. */
export function arcLabelAt(arcIndex: number, ko = false): string {
	const arc = arcs[arcIndex];
	if (arc && isPrologue(arc)) return ko ? '프롤로그' : 'Prologue';
	return arcLabel(arcNumber(arcIndex), ko);
}

/** `Chapter 7` / `제7장`. */
export function chapterLabel(n: number, ko = false): string {
	return ko ? `제${n}장` : `Chapter ${n}`;
}

/** The Part an Arc sits in: its own, or the last one opened before it. */
function partOf(arcIndex: number): string | undefined {
	for (let i = arcIndex; i >= 0; i--) if (arcs[i]?.part) return arcs[i].part;
	return undefined;
}

/** One breadcrumb; `anchor` is its section id on /episodes when it links there. */
export type Crumb = { label: string; anchor?: string };

/** Breadcrumbs above an episode: Part, Arc, Chapter (when the episode sits in one), then the episode. */
export function episodeCrumbs(arcIndex: number, entryIndex: number, ko = false): Crumb[] {
	const arc = arcs[arcIndex];
	const en = arc?.entries[entryIndex];
	if (!en) return [];
	const part = partOf(arcIndex);
	const c = chapterOf(arc.id, en.title);
	const crumbs: Crumb[] = [];
	if (part) crumbs.push({ label: partLabel(part, ko) });
	crumbs.push({ label: (ko && arc.korean) || arc.title, anchor: tocAnchor(arc.id) });
	if (c) crumbs.push({ label: ko ? c.ko : c.label, anchor: tocAnchor(arc.id, c) });
	crumbs.push({ label: (ko && en.subtitle) || en.title });
	return crumbs;
}

/** Spine rows: Chapter heads plus episodes outside every Chapter. */
export function spineEntries(arc: Arc): Entry[] {
	return arc.entries.filter((en) => {
		const c = chapterOf(arc.id, en.title);
		return !c || c.titles[0] === en.title;
	});
}

/** One numbered TOC episode row. */
export function tocEpisode(arc: Arc, en: Entry): TocEpisode {
	return {
		id: entryId(arc.id, en.title),
		num: episodeNumber(arcs.indexOf(arc), arc.entries.indexOf(en)),
		title: en.title,
		ko: en.subtitle,
		kinds: episodeKindsOf(en)
	};
}

/** Every episode under a Chapter's spine row, head included, in story order; empty for an episode outside every Chapter. */
export function chapterEpisodes(arc: Arc, en: Entry): TocEpisode[] {
	const c = chapterHeadedBy(arc.id, en.title);
	if (!c) return [];
	return arc.entries.filter((e) => c.titles.includes(e.title)).map((e) => tocEpisode(arc, e));
}

/** Dev check: every Chapter title exists on its Arc, sits in one Chapter, and Chapters are contiguous. */
export function assertTocNests(): string[] {
	const problems: string[] = [];
	const byId = new Map(arcs.map((a) => [a.id, a]));
	for (const [arcId, list] of Object.entries(ARC_CHAPTERS)) {
		const arc = byId.get(arcId);
		if (!arc) {
			problems.push(`arc ${arcId}`);
			continue;
		}
		const order = arc.entries.map((e) => e.title);
		const seen = new Set<string>();
		for (const c of list) {
			const idx = c.titles.map((t) => order.indexOf(t));
			c.titles.forEach((t, i) => {
				if (idx[i] < 0) problems.push(`${arcId} / ${c.label} / missing ${t}`);
				if (seen.has(t)) problems.push(`${arcId} / ${t} in two chapters`);
				seen.add(t);
			});
			if (idx.some((n, i) => i > 0 && n !== idx[i - 1] + 1)) problems.push(`${arcId} / ${c.label} not contiguous`);
		}
	}
	return problems;
}
