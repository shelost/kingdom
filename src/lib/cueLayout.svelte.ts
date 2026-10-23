/**
 * Edit mode: where a cue sits in the script and how it shows there.
 * Move it to another block (drag the figure, or "Move…" in the image menu then
 * click a block), stand it alone at full width, or drag its top / bottom edge to
 * a new shape. Every edit writes story.json through /api/cue-layout; the write
 * skips HMR, so this session keeps the overrides itself.
 */
import { browser } from '$app/environment';
import { resolve } from '$app/paths';
import { SvelteMap } from 'svelte/reactivity';
import type { Attachment } from 'svelte/attachments';
import { chapters, entryId, type Block, type Entry, type ImageSlot } from '$lib/story';
import { anchorFor, blockIndexOf } from '$lib/beats';
import { busyEdit, editUi } from '$lib/editUi.svelte';

type CueLayout = {
	at?: string;
	wide?: boolean;
	crop?: number | null;
	width?: number | null;
	focus?: { x: number; y: number } | null;
	say?: { en?: string; ko?: string; person?: string } | false | null;
};

/** This session's edits, by cue id. `crop: null` is "back to the picture's own shape". */
const overrides = new SvelteMap<string, CueLayout>();

/** The cue being moved by "Move…": the next block clicked receives it. */
export const cueMove = $state({ slotId: null as string | null });

function patched(slot: ImageSlot): ImageSlot {
	const o = overrides.get(slot.id);
	if (!o) return slot;
	const next = { ...slot };
	if (o.at !== undefined) next.at = o.at;
	if (o.wide !== undefined) {
		if (o.wide) next.wide = true;
		else delete next.wide;
	}
	if (o.crop !== undefined) {
		if (o.crop) next.crop = o.crop;
		else delete next.crop;
	}
	if (o.width !== undefined) {
		if (o.width) next.width = o.width;
		else delete next.width;
	}
	if (o.focus !== undefined) {
		if (o.focus) next.focus = o.focus;
		else delete next.focus;
	}
	if (o.say !== undefined) {
		if (o.say) next.say = o.say;
		else if (o.say === false) next.say = false;
		else delete next.say;
	}
	return next;
}

/** The entry with this session's moves, widths and shapes applied to its cues. */
export function withCueLayout(entry: Entry): Entry {
	const images = entry.images;
	if (!overrides.size || !images?.some((s) => overrides.has(s.id))) return entry;
	return { ...entry, images: images.map(patched) };
}

function rawSlot(slotId: string): ImageSlot | undefined {
	for (const ch of chapters)
		for (const entry of ch.entries ?? []) {
			const slot = entry.images?.find((s) => s.id === slotId);
			if (slot) return slot;
		}
	return undefined;
}

/** A cue as it shows now: story.json plus this session's edits. */
export function cueLayoutOf(slotId: string): {
	wide: boolean;
	crop?: number;
	width?: number;
	focus?: { x: number; y: number };
	say?: { en?: string; ko?: string; person?: string } | false;
} {
	const raw = rawSlot(slotId);
	const slot = raw ? patched(raw) : undefined;
	return { wide: !!slot?.wide, crop: slot?.crop, width: slot?.width, focus: slot?.focus, say: slot?.say };
}

function clampFocus(n: number): number {
	return Math.round(Math.max(0, Math.min(100, n)) * 10) / 10;
}

async function save(slotId: string, patch: CueLayout, failure: string): Promise<boolean> {
	const saved = await busyEdit(slotId, resolve('/api/cue-layout'), { slotId, ...patch }, failure);
	if (!saved) return false;
	overrides.set(slotId, { ...overrides.get(slotId), ...patch });
	return true;
}

export function setCueWide(slotId: string, wide: boolean): Promise<boolean> {
	return save(slotId, { wide }, 'Full width failed');
}

/** Show a dragged shape at once, before it is saved. */
export function previewCrop(slotId: string, crop: number) {
	overrides.set(slotId, { ...overrides.get(slotId), crop });
}

/** Save a shape (null: the picture's own); a failed save puts `before` back. */
export async function commitCrop(slotId: string, crop: number | null, before: number | undefined) {
	const ok = await save(slotId, { crop }, 'Resize failed');
	if (!ok) overrides.set(slotId, { ...overrides.get(slotId), crop: before ?? null });
}

/** Show a dragged column fraction at once, before it is saved. `null` clears it. */
export function previewWidth(slotId: string, width: number | null) {
	overrides.set(slotId, { ...overrides.get(slotId), width });
}

/** Save a column fraction (null: let the row decide again). */
export async function commitWidth(slotId: string, width: number | null, before: number | undefined) {
	const ok = await save(slotId, { width }, 'Resize failed');
	if (!ok) overrides.set(slotId, { ...overrides.get(slotId), width: before ?? null });
}

/** Show a dragged crop window at once, before it is saved. */
export function previewFocus(slotId: string, focus: { x: number; y: number }) {
	overrides.set(slotId, {
		...overrides.get(slotId),
		focus: { x: clampFocus(focus.x), y: clampFocus(focus.y) }
	});
}

/** Save where the crop window sits (null: centred). */
export async function commitFocus(
	slotId: string,
	focus: { x: number; y: number } | null,
	before: { x: number; y: number } | undefined
) {
	const ok = await save(slotId, { focus }, 'Crop failed');
	if (!ok) overrides.set(slotId, { ...overrides.get(slotId), focus: before ?? null });
}

/** Letter a balloon, or `false` to keep this still quiet, or `null` to guess again. */
export function setCueSay(
	slotId: string,
	say: { en?: string; ko?: string; person?: string } | false | null
): Promise<boolean> {
	return save(slotId, { say }, 'Balloon failed');
}

/**
 * Anchor `slotId` to `block` in the episode `eid`: its art then opens the beat
 * that starts at that block. Cues move within their own episode.
 */
export async function moveCueTo(slotId: string, eid: string, block: Block): Promise<boolean> {
	cueMove.slotId = null;
	let owner: Entry | undefined;
	for (const ch of chapters)
		for (const entry of ch.entries ?? [])
			if (entryId(ch.id, entry.title) === eid) owner = entry;
	if (!owner?.images?.some((s) => s.id === slotId)) {
		window.alert(`“${slotId}” belongs to another episode. Images move within their own episode.`);
		return false;
	}
	const blocks = owner.blocks ?? [];
	const at = anchorFor(blocks, blockIndexOf(blocks, block));
	if (!at) {
		window.alert('That block repeats words from one above it, so it cannot hold an image. Try the next block.');
		return false;
	}
	return save(slotId, { at }, 'Move failed');
}

/* ————— Drop targets: script blocks register so a drop or a pick can find them. ————— */

const blockOf = new WeakMap<Element, Block>();

/** Mark a rendered block as a place a cue can move to. */
export const blockRef =
	(block: Block): Attachment<HTMLElement> =>
	(node) => {
		blockOf.set(node, block);
		return () => blockOf.delete(node);
	};

const CUE_MIME = 'application/x-kingdom-cue';
const DROP_ATTR = 'data-cue-drop';

/** The registered block element at or above `target`. */
function blockElementAt(target: EventTarget | null): HTMLElement | null {
	let el = target instanceof Element ? target : null;
	while (el && !blockOf.has(el)) el = el.parentElement;
	return el instanceof HTMLElement ? el : null;
}

/** Start dragging a figure to another place in the script. */
export function startCueDrag(e: DragEvent, slotId: string) {
	if (!editUi.enabled || !e.dataTransfer) return;
	e.dataTransfer.setData(CUE_MIME, slotId);
	e.dataTransfer.effectAllowed = 'move';
}

/**
 * On the script root: shows a line above the block under the pointer while a
 * figure is dragged (or a "Move…" is picking), and moves the cue there on drop / click.
 */
export const cueDropZone: Attachment<HTMLElement> = (root) => {
	if (!browser) return;
	let marked: HTMLElement | null = null;
	const mark = (el: HTMLElement | null) => {
		if (el === marked) return;
		marked?.removeAttribute(DROP_ATTR);
		marked = el;
		marked?.setAttribute(DROP_ATTR, '');
	};
	const episodeOf = (el: HTMLElement) => el.closest<HTMLElement>('article.entry')?.dataset.storyId;
	const land = (slotId: string, el: HTMLElement) => {
		const block = blockOf.get(el);
		const eid = episodeOf(el);
		mark(null);
		if (block && eid) void moveCueTo(slotId, eid, block);
	};

	const onDragOver = (e: DragEvent) => {
		if (!editUi.enabled || !e.dataTransfer?.types.includes(CUE_MIME)) return;
		const el = blockElementAt(e.target);
		mark(el);
		if (!el) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};
	const onDrop = (e: DragEvent) => {
		const slotId = e.dataTransfer?.getData(CUE_MIME);
		const el = blockElementAt(e.target);
		if (!slotId || !el) return mark(null);
		e.preventDefault();
		land(slotId, el);
	};
	const onDragLeave = (e: DragEvent) => {
		if (!root.contains(e.relatedTarget as Node | null)) mark(null);
	};
	const onDragEnd = () => mark(null);

	const onPointerMove = (e: PointerEvent) => {
		if (cueMove.slotId) mark(blockElementAt(e.target));
	};
	const onClick = (e: MouseEvent) => {
		const slotId = cueMove.slotId;
		if (!slotId) return;
		const el = blockElementAt(e.target);
		if (!el) return;
		e.preventDefault();
		e.stopPropagation();
		land(slotId, el);
	};
	const onKey = (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || !cueMove.slotId) return;
		cueMove.slotId = null;
		mark(null);
	};

	root.addEventListener('dragover', onDragOver);
	root.addEventListener('drop', onDrop);
	root.addEventListener('dragleave', onDragLeave);
	document.addEventListener('dragend', onDragEnd);
	root.addEventListener('pointermove', onPointerMove);
	root.addEventListener('click', onClick, true);
	window.addEventListener('keydown', onKey);
	return () => {
		mark(null);
		root.removeEventListener('dragover', onDragOver);
		root.removeEventListener('drop', onDrop);
		root.removeEventListener('dragleave', onDragLeave);
		document.removeEventListener('dragend', onDragEnd);
		root.removeEventListener('pointermove', onPointerMove);
		root.removeEventListener('click', onClick, true);
		window.removeEventListener('keydown', onKey);
	};
};
