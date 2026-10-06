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

/** The chosen still while it is visible, else the first landscape still, else the first with art. */
export function episodeThumbnail(entry: Entry, eid: string): EpisodeThumbnail | null {
	const pick = chosen(entry, eid);
	const withArt: EpisodeThumbnail[] = [];
	for (const slot of filterVisibleCues(filterNsfw(entry.images ?? []))) {
		const src = artFor(slot, slot.id === pick?.slotId ? pick.layer : undefined);
		if (src) withArt.push({ slot, src });
	}
	return (
		withArt.find((t) => t.slot.id === pick?.slotId) ??
		withArt.find((t) => (t.slot.ratio ?? 2) >= COVER_RATIO) ??
		withArt[0] ??
		null
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
