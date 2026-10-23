/**
 * Per-volume spine cloth. Defaults live in books.ts; edit mode on /books
 * writes overrides to spine-picks.json (dev API).
 */
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { defaultSpine, normalizeHex, spineInk } from '$lib/books';
import { postEdit } from '$lib/editUi.svelte';
import savedFile from '$lib/data/spine-picks.json';

const saved = savedFile as Record<string, string>;
const session = $state<Record<string, string>>({});
let tick = $state(0);
const pending = new Map<string, ReturnType<typeof setTimeout>>();

export function spineColor(id: string): string {
	void tick;
	return normalizeHex(session[id] ?? saved[id] ?? defaultSpine(id)) ?? defaultSpine(id);
}

export function spineInkOf(id: string): string {
	return spineInk(spineColor(id));
}

/** Live preview, then a debounced write so dragging the picker does not stamp every frame. */
export function setSpine(id: string, hex: string) {
	const next = normalizeHex(hex);
	if (!next) return;
	session[id] = next;
	tick += 1;
	if (!browser) return;
	const prev = pending.get(id);
	if (prev) clearTimeout(prev);
	pending.set(
		id,
		setTimeout(() => {
			pending.delete(id);
			void persist(id, next);
		}, 280)
	);
}

async function persist(id: string, hex: string) {
	const result = await postEdit<{ ok: true }>(resolve('/api/spine'), { id, hex }, 'Spine failed');
	if (!result.ok) window.alert(result.message);
}
