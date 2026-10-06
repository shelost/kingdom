/**
 * Chronicle edit mode — `?edit=true`.
 * Enables the image right-click menu (star / remove). Dev APIs only write
 * locally; the flag itself is URL-driven and not persisted.
 */
import { browser } from '$app/environment';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { resolve } from '$app/paths';
import { chapters } from '$lib/story';
import { rememberReadingScroll } from '$lib/reading.svelte';
import type { GalleryDeleteItem, GalleryDeleteResponse } from '$lib/galleryDelete';

export const EDIT_QUERY = 'edit';

export const editUi = $state({
	enabled: false,
	/** Cue slot ids removed this session (story.json already updated by the API). */
	removedCueIds: new SvelteSet<string>(),
	/** Orphan temp ids removed this session (file already deleted by the API). */
	removedOrphanIds: new SvelteSet<string>(),
	/** Hide / reinstate this session, by cue id (story.json already updated by the API). */
	hiddenOverrides: new SvelteMap<string, boolean>(),
	busyId: null as string | null,
	/** After a Fal still edit, show this URL instead of locked `src` this session. */
	previewById: {} as Record<string, string>
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

/** `hidden` in story.json, unless this session already hid or reinstated it. */
export function isHiddenCue(slot: { id: string; hidden?: boolean }): boolean {
	return editUi.hiddenOverrides.get(slot.id) ?? !!slot.hidden;
}

/** Cues the chronicle shows: neither deleted this session nor hidden. */
export function isVisibleCue(slot: { id: string; hidden?: boolean }): boolean {
	return !editUi.removedCueIds.has(slot.id) && !isHiddenCue(slot);
}

export function filterVisibleCues<T extends { id: string; hidden?: boolean }>(items: T[]): T[] {
	const kept = items.filter(isVisibleCue);
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

export type EditPostResult<T> = { ok: true; data: T } | { ok: false; message: string };

/** POST JSON to a dev edit API; the server's `message` wins over the status text. */
export async function postEdit<T>(
	url: string,
	payload: unknown,
	failure: string
): Promise<EditPostResult<T>> {
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!res.ok) {
			let message = `${failure} (${res.status})`;
			try {
				const body = (await res.json()) as { message?: string };
				if (body.message) message = body.message;
			} catch {
				/* keep status text */
			}
			return { ok: false, message };
		}
		return { ok: true, data: (await res.json()) as T };
	} catch (err) {
		return { ok: false, message: err instanceof Error ? err.message : failure };
	}
}

/** One edit at a time: marks `busyId`, posts, alerts on failure. Null when skipped or failed. */
export async function busyEdit<T>(
	busyId: string,
	url: string,
	payload: unknown,
	failure: string
): Promise<T | null> {
	if (!browser || editUi.busyId) return null;
	editUi.busyId = busyId;
	try {
		const result = await postEdit<T>(url, payload, failure);
		if (result.ok) return result.data;
		window.alert(result.message);
		return null;
	} finally {
		editUi.busyId = null;
	}
}

export type GalleryDeleteResult =
	| { ok: true; deleted: GalleryDeleteItem[] }
	| { ok: false; message: string };

/**
 * POST /api/images: removes cues from story.json and deletes their art files.
 * Marks what the server confirmed as removed for this session.
 */
export async function deleteGalleryItems(items: GalleryDeleteItem[]): Promise<GalleryDeleteResult> {
	const result = await postEdit<GalleryDeleteResponse>(
		resolve('/api/images'),
		{ items },
		'Delete failed'
	);
	if (!result.ok) return result;
	for (const item of result.data.deleted) {
		if (item.kind === 'cue') markCueRemoved(item.slotId);
		else editUi.removedOrphanIds.add(item.id);
	}
	return { ok: true, deleted: result.data.deleted };
}

/**
 * Confirm, then permanently delete one cue or orphan still.
 * Returns true when the server accepted the delete.
 */
export async function permanentlyDeleteImage(item: GalleryDeleteItem): Promise<boolean> {
	const id = item.kind === 'cue' ? item.slotId : item.id;
	if (!browser || !id || editUi.busyId) return false;
	const what =
		item.kind === 'cue'
			? 'Removes the cue from story.json and deletes its art files on disk.'
			: 'Deletes this unattached file from disk.';
	if (!window.confirm(`Permanently delete “${id}”?\n\n${what}`)) return false;

	editUi.busyId = id;
	rememberReadingScroll();
	try {
		const result = await deleteGalleryItems([item]);
		if (!result.ok) window.alert(result.message);
		return result.ok;
	} finally {
		editUi.busyId = null;
	}
}
