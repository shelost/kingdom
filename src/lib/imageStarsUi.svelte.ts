/**
 * Edit-mode stars on every still except reference boards, toggled from the
 * image right-click menu. Same file + local fallback shape as `/api/grades`.
 */
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { SvelteSet } from 'svelte/reactivity';
import {
	cleanStarStore,
	readLocalStars,
	writeLocalStars,
	type ImageStarStore
} from '$lib/imageStars';
import { chapters } from '$lib/story';
import { artAttachmentKey } from '$lib/storyImages';

export const stars = new SvelteSet<string>();

export const starUi = $state({
	loaded: false,
	/** Last save could not reach `/api/stars` (prod / offline) — kept in this browser. */
	localOnly: false
});

let slotByFile: Map<string, string> | null = null;

/** File key → chronicle slot id, so a still starred anywhere lands on its cue. */
function slotIdForFile(fileKey: string): string | undefined {
	if (!slotByFile) {
		const map = new Map<string, string>();
		const slots = chapters.flatMap((ch) => ch.entries.flatMap((entry) => entry.images ?? []));
		for (const slot of slots) {
			const key = artAttachmentKey(slot.id);
			if (key && !map.has(key)) map.set(key, slot.id);
		}
		for (const slot of slots) {
			for (const art of [slot.src, slot.tempImage]) {
				const key = art ? artAttachmentKey(art) : '';
				if (key && !map.has(key)) map.set(key, slot.id);
			}
		}
		slotByFile = map;
	}
	return slotByFile.get(fileKey);
}

/** Chronicle slot id that owns this file, if any. */
export function cueSlotOf(src: string | null | undefined): string | undefined {
	const file = artAttachmentKey(src ?? '');
	return file ? slotIdForFile(file) : undefined;
}

/** Cue slot id when known, else the slot owning this file, else the file key. */
export function starKey(src?: string | null, slotId?: string | null): string {
	const id = slotId?.trim();
	if (id) return id;
	return cueSlotOf(src) ?? artAttachmentKey(src ?? '');
}

export function isStarred(key: string): boolean {
	return !!key && stars.has(key);
}

/** Toggles still in flight — a late load must not undo them. */
const pending = new Map<string, boolean>();

function replaceStars(list: readonly string[]) {
	stars.clear();
	for (const key of list) stars.add(key);
	for (const [key, on] of pending) {
		if (on) stars.add(key);
		else stars.delete(key);
	}
}

function snapshot(): ImageStarStore {
	return cleanStarStore({ updatedAt: new Date().toISOString(), stars: [...stars] });
}

let loading: Promise<void> | null = null;

export function ensureStars(): Promise<void> {
	if (!browser) return Promise.resolve();
	loading ??= (async () => {
		const local = readLocalStars();
		if (local) replaceStars(local.stars);
		try {
			const res = await fetch(resolve('/api/stars'));
			if (res.ok) {
				const remote = cleanStarStore(((await res.json()) as { store?: unknown }).store);
				if (remote.stars.length || !local?.stars.length) {
					replaceStars(remote.stars);
					writeLocalStars(remote);
				}
			}
		} catch {
			/* keep local */
		}
		starUi.loaded = true;
	})();
	return loading;
}

async function persistStar(key: string, starred: boolean) {
	await ensureStars();
	try {
		const res = await fetch(resolve('/api/stars'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ key, starred })
		});
		if (!res.ok) throw new Error(res.statusText);
		const store = cleanStarStore(((await res.json()) as { store?: unknown }).store);
		writeLocalStars(store);
		starUi.localOnly = false;
	} catch {
		writeLocalStars(snapshot());
		starUi.localOnly = true;
	} finally {
		if (pending.get(key) === starred) pending.delete(key);
	}
}

/** Flip a star now; the file catches up in the background. Returns the new state. */
export function toggleStar(key: string): boolean {
	if (!key) return false;
	const on = !stars.has(key);
	if (on) stars.add(key);
	else stars.delete(key);
	pending.set(key, on);
	void persistStar(key, on);
	return on;
}
