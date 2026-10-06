/**
 * The /episodes directory: every episode grouped the way a series page groups
 * seasons. A Part is a season; its chapters are the sections inside it.
 */
import { chapters, episodeNumber, entryId, chapterNumber, type Block, type Entry } from '$lib/story';
import { episodeQueryId, episodes } from '$lib/reading.svelte';
import { entryTags, type EntryTag } from '$lib/entryHead';
import { groupOf, tocAnchor } from '$lib/tocTree';

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

/** A run of episodes inside a chapter: one TOC group, or ungrouped episodes (no label). */
export type DirectorySection = {
	/** Element id the breadcrumbs link to; absent on ungrouped runs. */
	anchor?: string;
	label?: string;
	ko?: string;
	episodes: DirectoryEpisode[];
};

export type DirectoryChapter = {
	id: string;
	/** Element id of the chapter heading. */
	anchor: string;
	number: number | null;
	title: string;
	korean?: string;
	range: string;
	episodes: DirectoryEpisode[];
	sections: DirectorySection[];
};

export type DirectorySeason = {
	id: string;
	/** "Part I" */
	label: string;
	title?: string;
	korean?: string;
	hanja?: string;
	range: string;
	chapters: DirectoryChapter[];
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

function directoryEpisode(chapterIndex: number, entryIndex: number): DirectoryEpisode {
	const ch = chapters[chapterIndex];
	const entry = ch.entries[entryIndex];
	const id = entryId(ch.id, entry.title);
	return {
		id,
		queryId: queryIds.get(id) ?? id,
		number: episodeNumber(chapterIndex, entryIndex),
		entry,
		title: entry.title,
		ko: entry.subtitle,
		year: entry.year,
		minutes: Math.max(1, Math.round(wordsIn(entry.blocks) / WORDS_PER_MINUTE)),
		synopsis: synopsisOf(entry.blocks),
		tags: entryTags(entry)
	};
}

function directoryChapter(chapterIndex: number): DirectoryChapter {
	const ch = chapters[chapterIndex];
	const episodes = ch.entries.map((_, entryIndex) => directoryEpisode(chapterIndex, entryIndex));
	const sections: DirectorySection[] = [];
	episodes.forEach((ep) => {
		const g = groupOf(ch.id, ep.title);
		const anchor = g && tocAnchor(ch.id, g);
		let section = sections[sections.length - 1];
		if (!section || section.anchor !== anchor) {
			section = { anchor, label: g?.label, ko: g?.ko, episodes: [] };
			sections.push(section);
		}
		section.episodes.push(ep);
	});
	return {
		id: ch.id,
		anchor: tocAnchor(ch.id),
		number: chapterNumber(chapterIndex),
		title: ch.title,
		korean: ch.korean,
		range: ch.range,
		episodes,
		sections
	};
}

/** Chapters without a `part` belong to the Part opened before them. */
export const SEASONS: DirectorySeason[] = (() => {
	const seasons: DirectorySeason[] = [];
	chapters.forEach((ch, i) => {
		if (ch.part || !seasons.length) {
			seasons.push({
				id: ch.id,
				label: ch.part ?? 'Part I',
				title: ch.partTitle,
				korean: ch.partKorean,
				hanja: ch.partHanja,
				range: '',
				chapters: [],
				count: 0
			});
		}
		const season = seasons[seasons.length - 1];
		const chapter = directoryChapter(i);
		season.chapters.push(chapter);
		season.count += chapter.episodes.length;
	});
	for (const s of seasons) s.range = rangeOf(s.chapters);
	return seasons;
})();

export const EPISODE_TOTAL = SEASONS.reduce((n, s) => n + s.count, 0);
export const STORY_RANGE = rangeOf(chapters);
