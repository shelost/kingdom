/**
 * Unanchored stills the reader has put back at the opening of an entry.
 * The set is this session's override (story.json is the copy that sticks).
 */
import { resolve } from '$app/paths';
import { SvelteSet } from 'svelte/reactivity';
import { busyEdit } from '$lib/editUi.svelte';
import { chapters } from '$lib/story';

export const restoredIds = new SvelteSet<string>();

function stamp(ids: string[]) {
	const want = new Set(ids);
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			for (const slot of entry.images ?? []) {
				if (want.has(slot.id)) slot.restored = true;
			}
		}
	}
}

/** Write `restored` on these cues and show them at the opening immediately. */
export async function restoreOrphans(slotIds: string[]): Promise<boolean> {
	const ids = [...new Set(slotIds.map((id) => id.trim()).filter(Boolean))];
	if (!ids.length) return false;
	const saved = await busyEdit(ids[0], resolve('/api/restore-cues'), { slotIds: ids }, 'Restore failed');
	if (!saved) return false;
	for (const id of ids) restoredIds.add(id);
	stamp(ids);
	return true;
}
