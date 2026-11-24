/**
 * One shelf for a later story. A part is a row. The same packer as King for All
 * writes the poses the Threlte scene reads.
 */
import {
	BOOK_H,
	BOOK_W,
	mountShelf,
	spineDepth,
	spineInk,
	type BookEpisode,
	type BookVolume,
	type ShelfRow
} from '$lib/books';

export type StoryLeaf = {
	id: string;
	number: number;
	title: string;
	ko: string;
	year: string;
	hook: string;
	href: string;
	flashback?: boolean;
};

export type StoryVolume = {
	id: string;
	title: string;
	ko: string;
	leaves: StoryLeaf[];
};

export type StoryArc = {
	id: string;
	title: string;
	ko: string;
	volumes: StoryVolume[];
};

export type StoryPart = {
	id: string;
	title: string;
	ko: string;
	years: string;
	arcs: StoryArc[];
};

export type StoryEpisode = {
	title: string;
	ko: string;
	year: string;
	hook: string;
	/** Outline episode this leaf opens, when the title on the shelf is not the outline title. */
	outline?: string;
	flashback?: boolean;
};

export type StoryVol = {
	id: string;
	title: string;
	ko: string;
	spine: string;
	blurb: { en: string; ko: string };
	episodes: StoryEpisode[];
};

export type StoryArcSrc = { id: string; title: string; ko: string; volumes: StoryVol[] };

export type StoryPartSrc = { id: string; title: string; ko: string; years: string; arcs: StoryArcSrc[] };

function slug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function buildStoryShelf(opts: {
	shelf: string;
	/** Outline path, without a hash. Leaves that exist there deep-link. */
	story: string;
	known: Set<string>;
	parts: StoryPartSrc[];
}): { parts: StoryPart[]; volumes: BookVolume[]; rows: ShelfRow[] } {
	const { shelf, story, known, parts: src } = opts;

	function hrefOf(ep: StoryEpisode): string {
		const title = ep.outline ?? ep.title;
		if (!ep.outline && !known.has(ep.title)) return story;
		return `${story}#ep-${slug(title)}`;
	}

	function leaf(ep: StoryEpisode, number: number): StoryLeaf {
		const linked = known.has(ep.title) || !!ep.outline;
		return {
			id: slug(ep.title),
			number,
			title: ep.title,
			ko: ep.ko,
			year: ep.year,
			hook: ep.hook,
			href: linked ? hrefOf(ep) : story,
			flashback: ep.flashback
		};
	}

	let running = 0;
	const parts: StoryPart[] = src.map((part) => ({
		id: part.id,
		title: part.title,
		ko: part.ko,
		years: part.years,
		arcs: part.arcs.map((arc) => ({
			id: arc.id,
			title: arc.title,
			ko: arc.ko,
			volumes: arc.volumes.map((vol) => ({
				id: vol.id,
				title: vol.title,
				ko: vol.ko,
				leaves: vol.episodes.map((ep) => leaf(ep, ++running))
			}))
		}))
	}));

	const flat: { part: StoryPartSrc; arc: StoryArcSrc; vol: StoryVol; partIndex: number; inPart: number }[] = [];
	src.forEach((part, partIndex) => {
		let inPart = 0;
		for (const arc of part.arcs) {
			for (const vol of arc.volumes) {
				flat.push({ part, arc, vol, partIndex, inPart });
				inPart += 1;
			}
		}
	});

	const wordsEach = flat.map((row) => row.vol.episodes.length * 2800);
	const typical = wordsEach.slice().sort((a, b) => a - b)[Math.floor(wordsEach.length / 2)] ?? 14000;

	const volumes: BookVolume[] = flat.map((row, slot) => {
		const words = row.vol.episodes.length * 2800;
		const first = row.vol.episodes[0];
		const last = row.vol.episodes[row.vol.episodes.length - 1] ?? first;
		const chapters: BookEpisode[] = row.vol.episodes.map((ep, i) => ({
			id: `${row.vol.id}-${slug(ep.title)}`,
			queryId: known.has(ep.title) || ep.outline ? hrefOf(ep) : story,
			number: String(i + 1),
			title: ep.title,
			ko: ep.ko,
			year: ep.year,
			words: 2800,
			minutes: 12
		}));
		return {
			id: row.vol.id,
			number: slot + 1,
			title: row.vol.title,
			ko: row.vol.ko,
			part: row.part.title,
			partTitle: row.part.title,
			partKorean: row.part.ko,
			arc: row.arc.title,
			spine: row.vol.spine,
			episodes: row.vol.episodes.length,
			words,
			minutes: row.vol.episodes.length * 12,
			range: first && last && first.year !== last.year ? `${first.year}–${last.year}` : (first?.year ?? ''),
			queryId: story,
			slot,
			partIndex: row.partIndex,
			inPart: row.inPart,
			chapters,
			blurb: row.vol.blurb,
			w: BOOK_W,
			h: BOOK_H,
			d: spineDepth(words, typical),
			spineInk: spineInk(row.vol.spine)
		};
	});

	const rows: ShelfRow[] = src.map((part, partIndex) => ({
		part: String(partIndex + 1).padStart(2, '0'),
		title: part.title,
		korean: part.ko,
		volumes: volumes.filter((v) => v.partIndex === partIndex)
	}));

	mountShelf(shelf, rows);
	return { parts, volumes, rows };
}
