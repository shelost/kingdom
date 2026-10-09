import { chapters as arcs, entryId, episodeNumber, type Chapter as Arc, type Entry } from '$lib/story';
import { episodeKindsOf, type EpisodeKind } from '$lib/episodeKinds';

/**
 * Reading hierarchy: Part → Arc → Chapter → Episode.
 * An Arc is a top-level `story.json` record (its id keeps the old `chapterId` name in the data);
 * its Chapters are the named runs below; each entry is an Episode.
 */

/** A named Chapter inside an Arc and the episode titles it holds, in story order. The first title anchors the row. */
export type TocChapter = { label: string; ko: string; titles: string[] };

const chapter = (label: string, ko: string, ...titles: string[]): TocChapter => ({ label, ko, titles });

/** Each Arc lists its Chapters. Episodes outside every Chapter stay on the spine by themselves. */
export const ARC_CHAPTERS: Record<string, TocChapter[]> = {
	samhan: [
		chapter('Silla', '신라', 'Queen Sunduk', 'Harmony Council', 'Jinheung, the Cloud'),
		chapter('Baekje', '백제', 'Prince Euija', 'Eight Great Clans', 'Gunchogo, the 13th'),
		chapter('Goguryeo', '고구려', 'Commander Yeon', 'High Summit', 'Gwanggaeto, the Great King')
	],
	'five-principles': [
		chapter('Two Treasures', '두 보물', 'Bupmin', 'Sadaham', 'Gotaso', 'Pumsuk', 'Munhee'),
		chapter('Three Sons', '세 아들', 'Academy', 'Stele', 'Dosuryu'),
		chapter('Five Princes', '다섯 왕자', 'King Euija', 'Yunchung', 'The Severing')
	],
	'iron-will': [
		chapter('Daeya', '대야성', 'Gumil', 'Maehwa', 'Siege of Daeya'),
		chapter('Supreme Commander', '대막리지', 'Yeon’s Massacre', 'Chunchu & Yeon', 'Euija & Yeon'),
		chapter('Kim Yushin', '김유신', 'Nangbi', 'Forty Fortresses', 'The Eastern Star')
	],
	'seventh-invasion': [
		chapter('Emperor 황제', '황제', 'Four Dragons', 'Sima Yi', 'Yodong', 'Boiling River'),
		chapter('Guardian 성주', '성주', 'Stallion Mountain', 'Colossal River', 'Ansi'),
		chapter('Jumong', '주몽', 'Haemosu', 'Buyeo', 'Jolbon')
	],
	'chunchu-era': [
		chapter('Bidam', '비담', 'Gi (起)', 'Suro', 'Seung (承)', 'Muryuk', 'Jeon (轉)', 'Seohyun', 'Gyeol (結)'),
		chapter('Seungman', '승만', 'Queen Jinduk', 'Huangdi (皇帝)', 'Jiabeng (駕崩)', 'Royal Secretariat'),
		chapter('Chunchu', '춘추', 'King Muyeol', 'Jahee'),
		chapter('Hyukgose', '혁거세', 'Hyukgose', 'Talhae', 'Alji')
	],
	'fall-of-euija': [
		chapter(
			'Tamla',
			'탐라',
			'Exile',
			'Heaven–Earth King',
			'Sulmun',
			'Three Princes',
			'Stone Lady',
			'Gardener',
			'Kangrim',
			'Tribute'
		),
		chapter('Euija', '의자', 'Coup', 'Descent', 'Nine Omens', 'Onjo'),
		chapter('Three Loyalists', '삼충신', 'Sungchung', 'Heungsu', 'Gyebek')
	],
	'fall-of-baekje': [
		chapter('Fall of Baekje', '백제 멸망', 'Yellow Mountain', 'Sabi', 'Buyeo Euija†', 'Kim Chunchu†'),
		chapter('Baekje Restoration Army (BRA)', '백제 부흥군', 'Ungjin Commandery', 'King Pungjang')
	],
	'final-stand': [
		chapter('Four Beasts', '사신', 'Pyongyang I', 'Snake River', 'Tamla Surrenders'),
		chapter('Kudara', '구다라', 'Rebellion', 'Betrayal', 'White River'),
		chapter('Brothers', '형제', 'Yeon Gesomun†', 'Brothers’ Coup', 'Pyongyang II')
	],
	'silla-tang-war': [
		chapter(
			'Protectorate-General',
			'안동도호부',
			'Mount Gain',
			'Dangun & Old Joseon',
			'Anseung',
			'Letters',
			'Stone Gate',
			'Wonsul'
		),
		chapter(
			'Supreme Marshal',
			'태대각간',
			'Kim Yushin†',
			"The Wanggeom's Guest",
			'Maeso',
			'Final Ford',
			'The King for All'
		)
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
function chapterHeadedBy(arcId: string, title: string): TocChapter | undefined {
	return ARC_CHAPTERS[arcId]?.find((c) => c.titles[0] === title);
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
