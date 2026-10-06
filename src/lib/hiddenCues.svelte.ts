/**
 * Hidden cues — kept in story.json and on disk, left out of the chronicle.
 * Edit mode hides from the image menu and reinstates from the episode's
 * "hidden stills" window; both write through /api/hide.
 */
import { resolve } from '$app/paths';
import type { Entry, ImageSlot } from '$lib/story';
import { busyEdit, editUi, isHiddenCue } from '$lib/editUi.svelte';

/** This episode's hidden cues, in story order. */
export function hiddenCuesOf(entry: Entry): ImageSlot[] {
	return (entry.images ?? []).filter(
		(slot) => !editUi.removedCueIds.has(slot.id) && isHiddenCue(slot)
	);
}

/** Hide or reinstate one cue. Returns true once story.json has it. */
export async function setCueHidden(slotId: string, hidden: boolean): Promise<boolean> {
	const saved = await busyEdit(
		slotId,
		resolve('/api/hide'),
		{ slotId, hidden },
		hidden ? 'Hide failed' : 'Reinstate failed'
	);
	if (!saved) return false;
	editUi.hiddenOverrides.set(slotId, hidden);
	return true;
}
