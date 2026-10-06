import { chapters, entryId, episodeNumber, type Chapter, type Entry } from '$lib/story';
import { episodeKindsOf, type EpisodeKind } from '$lib/episodeKinds';

/** A named spine row and the episodes it holds, in story order. The first title anchors the row. */
export type TocGroup = { label: string; ko: string; titles: string[] };

const group = (label: string, ko: string, ...titles: string[]): TocGroup => ({ label, ko, titles });

/**
 * Chapter spines: each chapter lists its groups, so the TOC reads as a few named arcs
 * instead of a flat run of episodes. Ungrouped episodes stay on the spine by themselves.
 */
export const CHAPTER_GROUPS: Record<string, TocGroup[]> = {
	samhan: [
		group('Silla', '신라', 'Queen Sunduk', 'Harmony Council', 'Jinheung, the Cloud'),
		group('Baekje', '백제', 'Prince Euija', 'Eight Great Clans', 'Gunchogo, the 13th'),
		group('Goguryeo', '고구려', 'Commander Yeon', 'High Summit', 'Gwanggaeto, the Great King')
	],
	'five-principles': [
		group('Two Treasures', '두 보물', 'Bupmin', 'Gotaso', 'Pumsuk', 'Chunchu & Munhee'),
		group('Three Sons', '세 아들', 'Grand Academy', 'Stele', 'Dosuryu'),
		group('Five Princes', '다섯 왕자', 'King Euija', 'Yunchung', 'The Severing')
	],
	'iron-will': [
		group('Daeya', '대야성', 'Gumil', 'Maehwa', 'Siege of Daeya'),
		group('Yeon’s Massacre', '연개소문의 정변', 'Supreme Commander', 'Chunchu & Yeon', 'Euija & Yeon'),
		group('Kim Yushin', '김유신', 'Nangbi', 'Forty Fortresses', 'The Eastern Star')
	],
	'seventh-invasion': [
		group('Emperor 황제', '황제', 'Four Dragons', 'Yodong', 'Boiling River'),
		group('Guardian 성주', '성주', 'Stallion Mountain', 'Colossal River', 'Ansi'),
		group('Jumong', '주몽', 'Haemosu', 'Buyeo', 'Jolbon')
	],
	'chunchu-era': [
		group('Bidam', '비담', '기 (起)', 'Suro', '승 (承)', 'Muryuk', '전 (轉)', 'Seohyun', '결 (結)'),
		group('Seungman', '승만', 'Queen Jinduk', 'Huangdi (皇帝)', 'Royal Secretariat', 'Jiabeng (駕崩)'),
		group('Chunchu', '춘추', 'King Muyeol', 'Jahee'),
		group('Hyukgose', '혁거세', 'Hyukgose', 'Talhae', 'Alji')
	],
	'fall-of-euija': [
		group(
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
		group('Euija', '의자', 'Coup', 'Descent', 'Nine Omens', 'Onjo'),
		group('Three Loyalists', '삼충신', 'Sungchung', 'Heungsu', 'Gyebek')
	],
	'fall-of-baekje': [
		group('Fall of Baekje', '백제 멸망', 'Yellow Mountain', 'Sabi', 'Buyeo Euija†', 'Kim Chunchu†'),
		group('Baekje Restoration Army (BRA)', '백제 부흥군', 'Ungjin Commandery', 'King Pungjang')
	],
	'final-stand': [
		group('Four Beasts', '사신', 'Pyongyang I', 'Snake River', 'Tamla Surrenders'),
		group('Kudara', '구다라', 'Rebellion', 'Betrayal', 'White River'),
		group('Brothers', '형제', 'Yeon Gesomun†', 'Brothers’ Coup', 'Pyongyang II')
	],
	'silla-tang-war': [
		group(
			'Protectorate-General',
			'안동도호부',
			'Mount Gain',
			'Dangun & Old Joseon',
			'Anseung',
			'Letters',
			'Stone Gate',
			'Wonsul'
		),
		group(
			'Supreme Marshal',
			'태대각간',
			'Kim Yushin†',
			"The Wanggeom's Guest",
			'Inmun',
			'Maeso',
			'Final Ford',
			'The King for All'
		)
	]
};

export type TocEpisode = {
	id: string;
	/** `chapter.episode` in story order — `7.13`. */
	num: string;
	title: string;
	/** Korean title (`entry.subtitle`), shown when the reader picks Korean. */
	ko?: string;
	/** Material Symbol categories after the title — only episodes that fit (love, battle, myth…). */
	kinds: EpisodeKind[];
};

function groupOf(chapterId: string, title: string): TocGroup | undefined {
	return CHAPTER_GROUPS[chapterId]?.find((g) => g.titles.includes(title));
}

/** The group a spine row heads, if this entry opens one. */
function groupHeadedBy(chapterId: string, title: string): TocGroup | undefined {
	return CHAPTER_GROUPS[chapterId]?.find((g) => g.titles[0] === title);
}

export function spineLabel(ch: Chapter, en: Entry, ko = false): string {
	const g = groupHeadedBy(ch.id, en.title);
	if (ko) return g?.ko ?? en.subtitle ?? en.title;
	return g?.label ?? en.title;
}

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };

/** `Part II` → `제2부`. */
export function partLabel(part: string, ko = false): string {
	if (!ko) return part;
	const n = ROMAN[part.replace(/^Part\s+/i, '').trim()];
	return n ? `제${n}부` : part;
}

/** Spine rows: group heads plus ungrouped episodes. */
export function spineEntries(ch: Chapter): Entry[] {
	return ch.entries.filter((en) => {
		const g = groupOf(ch.id, en.title);
		return !g || g.titles[0] === en.title;
	});
}

/** One numbered TOC episode row. */
export function tocEpisode(ch: Chapter, en: Entry): TocEpisode {
	return {
		id: entryId(ch.id, en.title),
		num: episodeNumber(chapters.indexOf(ch), ch.entries.indexOf(en)),
		title: en.title,
		ko: en.subtitle,
		kinds: episodeKindsOf(en)
	};
}

/** Every episode under a group's spine row, head included, in story order; empty for an ungrouped row. */
export function groupEpisodes(ch: Chapter, en: Entry): TocEpisode[] {
	const g = groupHeadedBy(ch.id, en.title);
	if (!g) return [];
	return ch.entries.filter((e) => g.titles.includes(e.title)).map((e) => tocEpisode(ch, e));
}

/** Dev check: every grouped title exists on its chapter, sits in one group, and groups are contiguous. */
export function assertTocNests(): string[] {
	const problems: string[] = [];
	const byId = new Map(chapters.map((c) => [c.id, c]));
	for (const [chapterId, groups] of Object.entries(CHAPTER_GROUPS)) {
		const ch = byId.get(chapterId);
		if (!ch) {
			problems.push(`chapter ${chapterId}`);
			continue;
		}
		const order = ch.entries.map((e) => e.title);
		const seen = new Set<string>();
		for (const g of groups) {
			const idx = g.titles.map((t) => order.indexOf(t));
			g.titles.forEach((t, i) => {
				if (idx[i] < 0) problems.push(`${chapterId} / ${g.label} / missing ${t}`);
				if (seen.has(t)) problems.push(`${chapterId} / ${t} in two groups`);
				seen.add(t);
			});
			if (idx.some((n, i) => i > 0 && n !== idx[i - 1] + 1)) problems.push(`${chapterId} / ${g.label} not contiguous`);
		}
	}
	return problems;
}
