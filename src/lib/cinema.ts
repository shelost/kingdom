/**
 * Cinema mode: the story as a broadcast season.
 *
 * A chapter is a season, an entry is an episode. Everything the cinema stage
 * needs that is *not* reactive lives here — where the episode sits in the run,
 * which art the scene panel should be showing, and what colour the light in
 * that place is.
 *
 * Nothing in this module knows about the DOM: `CinemaStage.svelte` feeds it the
 * reading position and renders what comes back.
 */

import { buildBeats } from '$lib/beats';
import { displayArtOf } from '$lib/cueArt';
import { PLACES } from '$lib/places';
import { episodes } from '$lib/reading.svelte';
import { chapters, type Chapter, type Entry } from '$lib/story';
import { staticAsset } from '$lib/staticAsset.svelte';

/* ————— where we are in the season ————— */

export interface EpisodeCue {
	/** entry id — "chapterId-index", the same key the TOC and hashes use */
	id: string;
	title: string;
	subtitle?: string;
}

export interface EpisodeContext {
	chapter: Chapter;
	/** 1-based season number */
	season: number;
	seasonCount: number;
	entry: Entry;
	/** 1-based episode number inside the season */
	episode: number;
	episodeCount: number;
	/** 1-based position in the whole run, for "episode 41 of 92" */
	overall: number;
	overallCount: number;
	/** the episode this one hands off to, or null at the end of the run */
	next: EpisodeCue | null;
}

function cueOf(chapter: Chapter, entryIndex: number): EpisodeCue | null {
	const entry = chapter.entries[entryIndex];
	if (!entry) return null;
	return { id: `${chapter.id}-${entryIndex}`, title: entry.title, subtitle: entry.subtitle };
}

/** The next episode in reading order — next entry, else the next chapter's first. */
function nextCue(chapterIndex: number, entryIndex: number): EpisodeCue | null {
	const chapter = chapters[chapterIndex];
	if (!chapter) return null;
	const sameSeason = cueOf(chapter, entryIndex + 1);
	if (sameSeason) return sameSeason;
	const following = chapters[chapterIndex + 1];
	return following ? cueOf(following, 0) : null;
}

/** Resolve an entry id ("chapterId-index") to its place in the season run. */
export function episodeContextOf(entryId: string | null): EpisodeContext | null {
	if (!entryId) return null;
	const flat = episodes.findIndex((e) => e.id === entryId);
	if (flat < 0) return null;

	const ref = episodes[flat];
	const chapter = chapters[ref.chapterIndex];
	const entry = chapter?.entries[ref.entryIndex];
	if (!chapter || !entry) return null;

	return {
		chapter,
		season: ref.chapterIndex + 1,
		seasonCount: chapters.length,
		entry,
		episode: ref.entryIndex + 1,
		episodeCount: chapter.entries.length,
		overall: flat + 1,
		overallCount: episodes.length,
		next: nextCue(ref.chapterIndex, ref.entryIndex)
	};
}

/* ————— what the panel is showing ————— */

export interface CinemaPanel {
	src: string;
	/**
	 * `art` is a drawn story panel — the camera pushes in on it.
	 * `place` is location art standing in for one — the camera pans across it.
	 */
	kind: 'art' | 'place';
	/** Slot alt text (art) or place name (place) — for the panel `<img>`. */
	alt?: string;
}

/** Location art for a place id, when it has any. */
export function placeArt(placeId: string | null): string | null {
	if (!placeId) return null;
	const avatar = PLACES[placeId]?.avatar;
	return avatar ? staticAsset(avatar) : null;
}

/**
 * The panels of one episode, in reading order.
 *
 * Beat order (not slot order) so the panel cuts land where the prose does.
 * An episode with no art of its own borrows its location art, which is why
 * every entry can be staged without touching the story JSON.
 */
export function panelsOf(entry: Entry, placeId: string | null): CinemaPanel[] {
	const seen = new Set<string>();
	const panels: CinemaPanel[] = [];

	for (const beat of buildBeats(entry)) {
		for (const slot of beat.images) {
			const src = displayArtOf(slot, 'reading');
			if (!src || seen.has(src)) continue;
			seen.add(src);
			panels.push({ src, kind: 'art', alt: slot.alt?.trim() || undefined });
		}
	}

	if (panels.length) return panels;

	const place = placeArt(placeId);
	if (!place) return [];
	return [{ src: place, kind: 'place', alt: placeId ? PLACES[placeId]?.name : undefined }];
}

/** Which panel a 0…1 position through the episode is on. */
export function panelIndexAt(count: number, progress: number): number {
	if (count <= 1) return 0;
	const i = Math.floor(Math.max(0, Math.min(0.999, progress)) * count);
	return Math.max(0, Math.min(count - 1, i));
}

/* ————— the light in the room ————— */

/**
 * A location grade: the tint the panel is washed with, how much of it there is,
 * and what the camera does to the colour underneath. Cool blue in the steam
 * cavern, warm lamps in Surabol, the colour drained out of a battlefield.
 */
export interface Grade {
	tint: string;
	/** 0…1 — how heavily the tint sits over the art */
	wash: number;
	saturate: number;
	contrast: number;
	brightness: number;
}

const COURT: Grade = { tint: '#c08a44', wash: 0.34, saturate: 1.04, contrast: 1.04, brightness: 0.94 };
const CAVERN: Grade = { tint: '#3f7ea8', wash: 0.44, saturate: 0.88, contrast: 1.1, brightness: 0.78 };
const BATTLE: Grade = { tint: '#6d7076', wash: 0.42, saturate: 0.52, contrast: 1.12, brightness: 0.8 };
const IMPERIAL: Grade = { tint: '#c8a53f', wash: 0.36, saturate: 1.06, contrast: 1.06, brightness: 0.9 };
const REDSUN: Grade = { tint: '#9c4038', wash: 0.4, saturate: 0.94, contrast: 1.08, brightness: 0.84 };
const ISLAND: Grade = { tint: '#3b9c88', wash: 0.34, saturate: 1.06, contrast: 1.02, brightness: 0.92 };
const MYTH: Grade = { tint: '#7b6ea6', wash: 0.42, saturate: 0.9, contrast: 1.06, brightness: 0.82 };
const RIVER: Grade = { tint: '#4a6f86', wash: 0.4, saturate: 0.78, contrast: 1.08, brightness: 0.84 };
const NEUTRAL: Grade = { tint: '#5c5f6b', wash: 0.38, saturate: 0.94, contrast: 1.05, brightness: 0.88 };

/** Grades keyed by place id — the recurring rooms of the story. */
const PLACE_GRADE: Record<string, Grade> = {
	steam_cavern: CAVERN,
	surabol: COURT,
	sabi: COURT,
	changan: IMPERIAL,
	pyongyang: REDSUN,
	mugun: ISLAND,
	asadal: MYTH,
	jolbon: MYTH,
	gungnae: MYTH,
	buyeo_north: MYTH,
	geumgwan: MYTH,
	daegaya: MYTH,
	asuka: ISLAND,
	hwangsan: BATTLE,
	ansi: BATTLE,
	yodong: BATTLE,
	jupil: BATTLE,
	daeya: BATTLE,
	maeso: BATTLE,
	imjon: BATTLE,
	juryu: BATTLE,
	gwansan: BATTLE,
	ungjin: BATTLE,
	michuhol: RIVER,
	baekgang: RIVER,
	salsu: RIVER,
	sasu: RIVER,
	seokmun: RIVER,
	gibeolpo: RIVER,
	danghang: RIVER,
	wirye: BATTLE,
	central: REDSUN,
	manchuria: BATTLE,
	paektu: MYTH,
	realms_pavilion: MYTH,
	flower_cliff: MYTH,
	underworld: MYTH,
	heaven: MYTH,
	living_world: MYTH,
	western_flower_field: MYTH
};

/** Fall back on the kind of place it is when the id has no grade of its own. */
const KIND_GRADE: Record<string, Grade> = {
	cave: CAVERN,
	mountain: BATTLE,
	river: RIVER,
	harbor: RIVER,
	city: COURT,
	realm: MYTH
};

/** A flashback drains the grade toward memory, whatever room it happens in. */
function remembered(g: Grade): Grade {
	return {
		tint: '#8a8a94',
		wash: Math.min(0.72, g.wash + 0.2),
		saturate: g.saturate * 0.45,
		contrast: g.contrast * 1.04,
		brightness: g.brightness * 0.82
	};
}

export function gradeFor(placeId: string | null, flash = false): Grade {
	const place = placeId ? PLACES[placeId] : null;
	const base = (placeId ? PLACE_GRADE[placeId] : null) ?? (place ? KIND_GRADE[place.kind] : null) ?? NEUTRAL;
	return flash ? remembered(base) : base;
}

/** `filter` string for the panel image — the camera's own colour response. */
export function gradeFilter(g: Grade): string {
	return `saturate(${g.saturate}) contrast(${g.contrast}) brightness(${g.brightness})`;
}
