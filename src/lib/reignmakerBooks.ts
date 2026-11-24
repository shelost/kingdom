/**
 * Reignmaker on the /books shelf. Leaves link to the outline, not to /read.
 * One volume per part, in the same pose math as King for All.
 */
import { husam } from '$lib/outlines/husam';
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

function slug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

const SPINE: Record<string, string> = {
	fall: '#8a7048',
	rise: '#2f8f83'
};

export type ReignLeaf = {
	id: string;
	title: string;
	ko: string;
	year: string;
	number: string;
	/** Opening line. The shelf blurb until a Korean line exists. */
	hook: string;
	/** First still for this episode, when the outline has one. */
	thumb?: string;
	flashback?: boolean;
	href: string;
};

const thumbByTitle = new Map<string, string>();
for (const img of husam.images) {
	if (!img.episode || img.nsfw || thumbByTitle.has(img.episode)) continue;
	thumbByTitle.set(img.episode, img.src);
}

export type ReignPart = {
	id: string;
	title: string;
	ko: string;
	years: string;
	summary: string;
	leaves: ReignLeaf[];
};

let running = 0;
export const REIGNMAKER_PARTS: ReignPart[] = husam.parts.map((part) => ({
	id: part.id,
	title: part.title,
	ko: part.ko,
	years: part.years,
	summary: part.summary,
	leaves: part.episodes.map((ep) => {
		running += 1;
		const id = slug(ep.title);
		return {
			id,
			title: ep.title,
			ko: ep.ko,
			year: ep.year,
			number: String(running).padStart(2, '0'),
			hook: ep.hook,
			thumb: thumbByTitle.get(ep.title),
			flashback: ep.flashback,
			href: `/stories/husam#ep-${id}`
		};
	})
}));

function leafEpisode(leaf: ReignLeaf): BookEpisode {
	return {
		id: leaf.id,
		queryId: leaf.href,
		number: leaf.number,
		title: leaf.title,
		ko: leaf.ko,
		year: leaf.year,
		words: 0,
		minutes: 0
	};
}

export const REIGNMAKER_VOLUMES: BookVolume[] = REIGNMAKER_PARTS.map((part, i) => {
	const chapters = part.leaves.map(leafEpisode);
	const first = chapters[0];
	const spine = SPINE[part.id] ?? '#3a2a1c';
	const words = Math.max(part.leaves.length, 1) * 2800;
	return {
		id: `rm-${part.id}`,
		number: i + 1,
		title: part.title,
		ko: part.ko,
		part: 'Reignmaker',
		partTitle: 'Reignmaker',
		partKorean: '후삼제왕',
		arc: part.title,
		spine,
		episodes: chapters.length,
		words,
		minutes: 0,
		range: part.years,
		queryId: first?.queryId ?? `/stories/husam`,
		slot: i,
		partIndex: i,
		inPart: 0,
		chapters,
		blurb: { en: part.summary, ko: part.summary },
		w: BOOK_W,
		h: BOOK_H,
		d: spineDepth(words, 14000),
		spineInk: spineInk(spine)
	};
});

export const REIGNMAKER_ROWS: ShelfRow[] = REIGNMAKER_VOLUMES.map((volume) => ({
	part: volume.title,
	title: volume.title,
	korean: volume.ko,
	volumes: [volume]
}));

mountShelf('reignmaker', REIGNMAKER_ROWS);
