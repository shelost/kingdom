/**
 * Story-card groupings for /episodes (Stories view).
 * Narrative arcs are hand-authored reading paths; country uses the entry's first flag badge.
 */
import { flagOf, FLAG_LABEL, type FlagId } from '$lib/flags';
import type { DirectoryEpisode } from '$lib/episodeDirectory';

export type StoryGroupMode = 'default' | 'arc' | 'country';

export type StoryGroup = {
	id: string;
	/** English section title. */
	label: string;
	ko: string;
	episodes: DirectoryEpisode[];
};

/** Narrative arcs, in the order sections should appear. Titles match `DirectoryEpisode.title`. */
const ARC_DEFS: { id: string; label: string; ko: string; titles: string[] }[] = [
	{
		id: 'tamla',
		label: 'Tamla',
		ko: '탐라',
		titles: [
			'Yuri Dora',
			'Heaven–Earth King',
			'Three Princes',
			'Gardener',
			'Grim Reaper',
			'Goddess Supreme',
			'Bonpuri'
		]
	},
	{
		id: 'gaya',
		label: 'Gaya',
		ko: '가야',
		titles: ['Suro', 'Muryuk', 'Seohyun']
	},
	{
		id: 'jumong',
		label: 'Jumong',
		ko: '주몽',
		titles: ['Haemosu', 'Jumong', 'Onjo']
	},
	{
		id: 'silla',
		label: 'Silla',
		ko: '신라',
		titles: ['Park Hyukgosé', 'Talhae']
	},
	{
		id: 'bihyung',
		label: 'Bihyung',
		ko: '비형',
		titles: ['Bihyung', 'Bihyungnang', 'Kim Yongsu']
	}
];

const ARC_TITLE = new Map<string, string>();
for (const arc of ARC_DEFS) {
	for (const title of arc.titles) ARC_TITLE.set(title, arc.id);
}

/** Country section order on the Stories page. */
const COUNTRY_ORDER: { id: string; label: string; ko: string; flag?: FlagId }[] = [
	{ id: 'tamla', label: 'Tamla', ko: '탐라', flag: 'tamla' },
	{ id: 'goguryeo', label: 'Goguryeo', ko: '고구려', flag: 'goguryeo' },
	{ id: 'baekje', label: 'Baekje', ko: '백제', flag: 'baekje' },
	{ id: 'silla', label: 'Silla', ko: '신라', flag: 'silla' },
	{ id: 'gaya', label: 'Gaya', ko: '가야', flag: 'gaya' },
	{ id: 'tang', label: FLAG_LABEL.tang.label, ko: FLAG_LABEL.tang.ko, flag: 'tang' },
	{ id: 'wa', label: FLAG_LABEL.wa.label, ko: FLAG_LABEL.wa.ko, flag: 'wa' },
	{ id: 'other', label: 'Other', ko: '기타' }
];

/** First kingdom flag on the entry, if any. */
export function primaryFlag(ep: DirectoryEpisode): FlagId | null {
	for (const badge of ep.entry.badges ?? []) {
		const id = flagOf(badge);
		if (id) return id;
	}
	return null;
}

function byTitleOrder(episodes: DirectoryEpisode[], titles: string[]): DirectoryEpisode[] {
	const byTitle = new Map(episodes.map((ep) => [ep.title, ep]));
	const out: DirectoryEpisode[] = [];
	for (const title of titles) {
		const ep = byTitle.get(title);
		if (ep) out.push(ep);
	}
	return out;
}

/** Group titled stories into narrative arcs; leftovers become Standalone. */
export function groupStoriesByArc(episodes: DirectoryEpisode[]): StoryGroup[] {
	const remaining = new Set(episodes);
	const groups: StoryGroup[] = [];

	for (const def of ARC_DEFS) {
		const members = byTitleOrder(episodes, def.titles);
		if (!members.length) continue;
		for (const ep of members) remaining.delete(ep);
		groups.push({ id: def.id, label: def.label, ko: def.ko, episodes: members });
	}

	const standalone = episodes.filter((ep) => remaining.has(ep));
	if (standalone.length) {
		groups.push({
			id: 'standalone',
			label: 'Standalone',
			ko: '단편',
			episodes: standalone
		});
	}
	return groups;
}

/** Group titled stories by primary kingdom flag. */
export function groupStoriesByCountry(episodes: DirectoryEpisode[]): StoryGroup[] {
	const buckets = new Map<string, DirectoryEpisode[]>();
	for (const ep of episodes) {
		const flag = primaryFlag(ep);
		const id = flag ?? 'other';
		const list = buckets.get(id);
		if (list) list.push(ep);
		else buckets.set(id, [ep]);
	}

	const groups: StoryGroup[] = [];
	for (const def of COUNTRY_ORDER) {
		const members = buckets.get(def.id);
		if (!members?.length) continue;
		groups.push({ id: def.id, label: def.label, ko: def.ko, episodes: members });
		buckets.delete(def.id);
	}
	for (const [id, members] of buckets) {
		if (!members.length) continue;
		const known = id as FlagId;
		groups.push({
			id,
			label: FLAG_LABEL[known]?.label ?? id,
			ko: FLAG_LABEL[known]?.ko ?? id,
			episodes: members
		});
	}
	return groups;
}

export function arcIdOf(title: string): string | null {
	return ARC_TITLE.get(title) ?? null;
}
