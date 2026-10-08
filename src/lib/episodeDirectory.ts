/**
 * The /episodes directory: every episode in the reading hierarchy
 * Part → Arc → Chapter → Episode, the way a series page groups seasons.
 */
import {
	chapters,
	episodeNumber,
	entryId,
	arcNumber,
	EPISODE_COUNT,
	type Block,
	type Entry
} from '$lib/story';
import { episodeQueryId, episodes } from '$lib/reading.svelte';
import { widgetTexts } from '$lib/widgets';
import { entryTags, type EntryTag } from '$lib/entryHead';
import { chapterNumberOf, chapterOf, tocAnchor } from '$lib/tocTree';

export type DirectoryEpisode = {
	id: string;
	/** `?ep=` value the chronicle opens. */
	queryId: string;
	number: string;
	entry: Entry;
	title: string;
	ko?: string;
	year: string;
	minutes: number;
	synopsis: { en: string; ko: string };
	tags: EntryTag[];
};

/** A run of episodes inside an Arc: one named Chapter, or episodes outside every Chapter (no label). */
export type DirectoryChapter = {
	/** Element id the breadcrumbs link to; absent on unnamed runs. */
	anchor?: string;
	/** Running Chapter number; absent on unnamed runs. */
	number?: number;
	label?: string;
	ko?: string;
	episodes: DirectoryEpisode[];
};

export type DirectoryArc = {
	id: string;
	/** Element id of the Arc heading. */
	anchor: string;
	number: number | null;
	title: string;
	korean?: string;
	range: string;
	episodes: DirectoryEpisode[];
	chapters: DirectoryChapter[];
};

export type DirectoryPart = {
	id: string;
	/** "Part I" */
	label: string;
	title?: string;
	korean?: string;
	hanja?: string;
	range: string;
	arcs: DirectoryArc[];
	count: number;
};

const WORDS_PER_MINUTE = 230;
const ENTITIES: Record<string, string> = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': "'",
	'&nbsp;': ' '
};

function plain(html: string): string {
	return html
		.replace(/<[^>]+>/g, '')
		.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m)
		.replace(/\s+/g, ' ')
		.trim();
}

function wordsIn(blocks: Block[]): number {
	let n = 0;
	const count = (s: string | undefined) => (s ? plain(s).split(' ').filter(Boolean).length : 0);
	for (const b of blocks) {
		if (b.kind === 'p' || b.kind === 'quote' || b.kind === 'monologue' || b.kind === 'moral') {
			n += count(b.html);
		} else if (b.kind === 'dialogue') {
			for (const line of b.en ?? b.lines) n += count(line);
		} else if (b.kind === 'verse') {
			for (const line of b.en ?? b.lines) n += count(line);
		} else if (b.kind === 'flashback') {
			n += wordsIn(b.blocks);
		} else {
			for (const s of widgetTexts(b)?.en ?? []) n += count(s);
		}
	}
	return n;
}

/** The opening narration, safe for a card: the first paragraph that is not an intimate beat. */
function synopsisOf(blocks: Block[]): { en: string; ko: string } {
	for (const b of blocks) {
		if (b.kind === 'p' && !b.nsfw && b.html.trim()) {
			const en = plain(b.html);
			return { en, ko: b.ko ? plain(b.ko) : en };
		}
	}
	return { en: '', ko: '' };
}

function rangeOf(list: { range: string }[]): string {
	const years = list.flatMap((c) => c.range.match(/\d+/g) ?? []).map(Number);
	if (!years.length) return '';
	const lo = Math.min(...years);
	const hi = Math.max(...years);
	return lo === hi ? `${lo}` : `${lo}–${hi}`;
}

const queryIds = new Map(episodes.map((ep) => [ep.id, episodeQueryId(ep)]));

function directoryEpisode(arcIndex: number, entryIndex: number): DirectoryEpisode {
	const arc = chapters[arcIndex];
	const entry = arc.entries[entryIndex];
	const id = entryId(arc.id, entry.title);
	return {
		id,
		queryId: queryIds.get(id) ?? id,
		number: episodeNumber(arcIndex, entryIndex),
		entry,
		title: entry.title,
		ko: entry.subtitle,
		year: entry.year,
		minutes: Math.max(1, Math.round(wordsIn(entry.blocks) / WORDS_PER_MINUTE)),
		synopsis: entry.logline ?? synopsisOf(entry.blocks),
		tags: entryTags(entry)
	};
}

function directoryArc(arcIndex: number): DirectoryArc {
	const arc = chapters[arcIndex];
	const episodes = arc.entries.map((_, entryIndex) => directoryEpisode(arcIndex, entryIndex));
	const runs: DirectoryChapter[] = [];
	episodes.forEach((ep) => {
		const c = chapterOf(arc.id, ep.title);
		const anchor = c && tocAnchor(arc.id, c);
		let run = runs[runs.length - 1];
		if (!run || run.anchor !== anchor) {
			run = { anchor, number: (c && chapterNumberOf(c)) ?? undefined, label: c?.label, ko: c?.ko, episodes: [] };
			runs.push(run);
		}
		run.episodes.push(ep);
	});
	return {
		id: arc.id,
		anchor: tocAnchor(arc.id),
		number: arcNumber(arcIndex),
		title: arc.title,
		korean: arc.korean,
		range: arc.range,
		episodes,
		chapters: runs
	};
}

/** Arcs without a `part` belong to the Part opened before them. */
export const PARTS: DirectoryPart[] = (() => {
	const parts: DirectoryPart[] = [];
	chapters.forEach((arc, i) => {
		if (arc.part || !parts.length) {
			parts.push({
				id: arc.id,
				label: arc.part ?? 'Part I',
				title: arc.partTitle,
				korean: arc.partKorean,
				hanja: arc.partHanja,
				range: '',
				arcs: [],
				count: 0
			});
		}
		const part = parts[parts.length - 1];
		const entry = directoryArc(i);
		part.arcs.push(entry);
		part.count += entry.episodes.length;
	});
	for (const p of parts) p.range = rangeOf(p.arcs);
	return parts;
})();

export const EPISODE_TOTAL = EPISODE_COUNT;
export const STORY_RANGE = rangeOf(chapters);
