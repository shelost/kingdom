/**
 * Episode thumbnails — the one representative still under each title.
 * `entry.thumbnail` names a cue (`thumbnailLayer: 'temp'` picks its stand-in over
 * the final); without it the first landscape still stands in.
 * Edit mode's "Set as thumbnail" writes story.json through /api/thumbnail.
 */
import { resolve } from '$app/paths';
import { chapters, entryId, type Entry, type ImageSlot } from '$lib/story';
import { tempLayerOf } from '$lib/cueArt';
import { busyEdit, filterVisibleCues } from '$lib/editUi.svelte';
import { filterNsfw } from '$lib/nsfwUi.svelte';
import { liveDisplayArt, liveScriptFrames } from '$lib/stillEditUi.svelte';
import { starUi, stars } from '$lib/imageStarsUi.svelte';
import { cleanStarStore } from '$lib/imageStars';
import starFile from '$lib/data/image-stars.json';
import type { DirectoryPart } from '$lib/episodeDirectory';

type ThumbPick = { slotId: string; layer?: 'temp' };

/** Picks made this session, by episode id. story.json already holds them; the import does not. */
const picked = $state<Record<string, ThumbPick>>({});

/** Landscape enough to read as a cover, not a portrait card. */
const COVER_RATIO = 1.5;

export type EpisodeThumbnail = { slot: ImageSlot; src: string };

function ownerOf(slotId: string): { entry: Entry; eid: string; slot: ImageSlot } | null {
	for (const ch of chapters) {
		for (const entry of ch.entries) {
			const slot = entry.images?.find((s) => s.id === slotId);
			if (slot) return { entry, eid: entryId(ch.id, entry.title), slot };
		}
	}
	return null;
}

function chosen(entry: Entry, eid: string): ThumbPick | undefined {
	if (picked[eid]) return picked[eid];
	return entry.thumbnail ? { slotId: entry.thumbnail, layer: entry.thumbnailLayer } : undefined;
}

function artFor(slot: ImageSlot, layer: ThumbPick['layer']): string | undefined {
	const temp = layer === 'temp' ? liveScriptFrames(slot).find((f) => f.layer === 'temp') : undefined;
	return temp?.src ?? liveDisplayArt(slot, 'reading');
}

/** Every visible still in the entry that has art, the chosen thumbnail on its chosen layer. */
function entryStills(entry: Entry, pick: ThumbPick | undefined): EpisodeThumbnail[] {
	const withArt: EpisodeThumbnail[] = [];
	for (const slot of filterVisibleCues(filterNsfw(entry.images ?? []))) {
		const src = artFor(slot, slot.id === pick?.slotId ? pick.layer : undefined);
		if (src) withArt.push({ slot, src });
	}
	return withArt;
}

function thumbnailOf(stills: EpisodeThumbnail[], pick: ThumbPick | undefined): EpisodeThumbnail | null {
	return (
		stills.find((t) => t.slot.id === pick?.slotId) ??
		stills.find((t) => (t.slot.ratio ?? 2) >= COVER_RATIO) ??
		stills[0] ??
		null
	);
}

/** The chosen still while it is visible, else the first landscape still, else the first with art. */
export function episodeThumbnail(entry: Entry, eid: string): EpisodeThumbnail | null {
	const pick = chosen(entry, eid);
	return thumbnailOf(entryStills(entry, pick), pick);
}

/** `count` items picked evenly across the list, in order. */
function spread<T>(list: T[], count: number): T[] {
	if (list.length <= count) return list;
	return Array.from({ length: count }, (_, i) => list[Math.floor((i * list.length) / count)]);
}

/** Stars as edit mode last loaded them, else as committed to image-stars.json. */
function starredKeys(): ReadonlySet<string> {
	return starUi.loaded ? stars : COMMITTED_STARS;
}

const COMMITTED_STARS: ReadonlySet<string> = new Set(cleanStarStore(starFile).stars);

/** Starred stills first (story order), then episode thumbnails spread evenly to fill `count`. */
function notableStills(episodes: { entry: Entry; id: string }[], count: number): EpisodeThumbnail[] {
	const starred = starredKeys();
	const lead: EpisodeThumbnail[] = [];
	const thumbs: EpisodeThumbnail[] = [];
	for (const { entry, id } of episodes) {
		const pick = chosen(entry, id);
		const stills = entryStills(entry, pick);
		lead.push(...stills.filter((t) => starred.has(t.slot.id)));
		const thumb = thumbnailOf(stills, pick);
		if (thumb && !starred.has(thumb.slot.id)) thumbs.push(thumb);
	}
	return [...lead.slice(0, count), ...spread(thumbs, Math.max(0, count - lead.length))];
}

/** Up to `count` notable stills from one Part. */
export function partStills(part: DirectoryPart, count: number): EpisodeThumbnail[] {
	return notableStills(
		part.arcs.flatMap((arc) => arc.episodes),
		count
	);
}

/** Up to `count` notable stills from the episodes set at one place (`entry.place`). */
export function placeStills(placeId: string, count: number): EpisodeThumbnail[] {
	return notableStills(
		chapters.flatMap((ch) =>
			ch.entries
				.filter((entry) => entry.place === placeId)
				.map((entry) => ({ entry, id: entryId(ch.id, entry.title) }))
		),
		count
	);
}

/** Up to `count` notable stills from the whole story, for the title page. */
export function storyStills(count: number): EpisodeThumbnail[] {
	return notableStills(
		chapters.flatMap((ch) => ch.entries.map((entry) => ({ entry, id: entryId(ch.id, entry.title) }))),
		count
	);
}

/** `src` is the picture right-clicked; omit it for the cue's reading art. */
export function isThumbnail(slotId: string, src?: string): boolean {
	const owner = ownerOf(slotId);
	const pick = owner && chosen(owner.entry, owner.eid);
	return !!pick && pick.slotId === slotId && pick.layer === tempLayerOf(owner.slot, src);
}

/** Make this picture of the cue its episode's thumbnail. Returns true once story.json has it. */
export async function setThumbnail(slotId: string, src?: string): Promise<boolean> {
	const owner = ownerOf(slotId);
	if (!owner) return false;
	const layer = tempLayerOf(owner.slot, src);
	const saved = await busyEdit(slotId, resolve('/api/thumbnail'), { slotId, layer }, 'Thumbnail failed');
	if (!saved) return false;
	picked[owner.eid] = { slotId, layer };
	owner.entry.thumbnail = slotId;
	owner.entry.thumbnailLayer = layer;
	return true;
}
