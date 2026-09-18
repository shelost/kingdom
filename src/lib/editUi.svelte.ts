/**
 * Chronicle edit mode — `?edit=true`.
 * Enables destructive cue tools (right-click delete). Dev API only honors deletes
 * locally; the flag itself is URL-driven and not persisted.
 */
import { browser } from '$app/environment';
import { SvelteSet } from 'svelte/reactivity';
import { resolve } from '$app/paths';
import { chapters } from '$lib/story';
import { rememberReadingScroll } from '$lib/reading.svelte';
import type { GalleryDeleteItem, GalleryDeleteResponse } from '$lib/galleryDelete';

export const EDIT_QUERY = 'edit';

export const editUi = $state({
	enabled: false,
	/** Cue slot ids removed this session (story.json already updated by the API). */
	removedCueIds: new SvelteSet<string>(),
	busyId: null as string | null
});

export function editQueryOn(url: URL): boolean {
	return url.searchParams.get(EDIT_QUERY) === 'true';
}

export function applyEditFromUrl(url: URL) {
	const on = editQueryOn(url);
	if (editUi.enabled !== on) editUi.enabled = on;
}

/** Keep `?edit=true` on an in-app href when the current URL already has it. */
export function hrefWithEdit(href: string, current: URL): string {
	if (!editQueryOn(current)) return href;
	const next = new URL(href, current);
	next.searchParams.set(EDIT_QUERY, 'true');
	return `${next.pathname}${next.search}${next.hash}`;
}

export function filterRemovedCues<T extends { id: string }>(items: T[]): T[] {
	if (!editUi.removedCueIds.size) return items;
	const kept = items.filter((item) => !editUi.removedCueIds.has(item.id));
	return kept.length === items.length ? items : kept;
}

function markCueRemoved(slotId: string) {
	editUi.removedCueIds.add(slotId);
	/* Best-effort mutate imported story so any non-filtered readers drop the slot. */
	for (const ch of chapters) {
		for (const entry of ch.entries ?? []) {
			const images = entry.images;
			if (!Array.isArray(images) || !images.length) continue;
			const next = images.filter((s) => s.id !== slotId);
			if (next.length !== images.length) entry.images = next;
		}
	}
}

/**
 * Permanently delete a chronicle cue (story.json + temp files via /api/images).
 * Returns true when the server accepted the delete.
 */
export async function permanentlyDeleteCue(slotId: string): Promise<boolean> {
	if (!browser || !slotId || editUi.busyId) return false;
	const ok = window.confirm(
		`Permanently delete “${slotId}”?\n\nRemoves the cue from story.json and deletes its art files on disk.`
	);
	if (!ok) return false;

	editUi.busyId = slotId;
	rememberReadingScroll();
	try {
		const items: GalleryDeleteItem[] = [{ kind: 'cue', slotId }];
		const res = await fetch(resolve('/api/images'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ items })
		});
		if (!res.ok) {
			let message = `Delete failed (${res.status})`;
			try {
				const body = (await res.json()) as { message?: string };
				if (body.message) message = body.message;
			} catch {
				/* keep status text */
			}
			window.alert(message);
			return false;
		}
		await res.json().catch(() => null as GalleryDeleteResponse | null);
		markCueRemoved(slotId);
		return true;
	} catch (err) {
		window.alert(err instanceof Error ? err.message : 'Delete failed');
		return false;
	} finally {
		editUi.busyId = null;
	}
}
