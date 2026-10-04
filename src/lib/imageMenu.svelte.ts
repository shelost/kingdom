/**
 * The one right-click menu on images in edit mode: Star and Remove.
 * Views that know more (cue id, sequence index, gallery cell) open it with
 * their own target; any other `storyImg` falls back to the window handler.
 * Reference boards (portraits, places, binyeo…) never get the menu.
 */
import { editUi, permanentlyDeleteImage } from '$lib/editUi.svelte';
import { isReferenceImage } from '$lib/imageStars';
import { cueSlotOf, starKey } from '$lib/imageStarsUi.svelte';

export type ImageMenuTarget = {
	/** Header line: slot id, file name, "Still 2 of 5". */
	label: string;
	/** Empty disables Star. */
	starKey: string;
	/** Omit to disable Remove; `removeHint` says why. */
	remove?: () => unknown;
	removeHint?: string;
};

export const imageMenu = $state({
	target: null as ImageMenuTarget | null,
	x: 0,
	y: 0
});

/** Open at the pointer. No-op outside edit mode, so the browser menu stays. */
export function openImageMenu(e: MouseEvent, target: ImageMenuTarget): boolean {
	if (!editUi.enabled) return false;
	e.preventDefault();
	e.stopPropagation();
	imageMenu.target = target;
	imageMenu.x = e.clientX;
	imageMenu.y = e.clientY;
	return true;
}

export function closeImageMenu() {
	imageMenu.target = null;
}

/** A chronicle cue: Remove deletes the slot and its art. */
export function cueMenuTarget(slotId: string): ImageMenuTarget {
	return {
		label: slotId,
		starKey: slotId,
		remove: () => permanentlyDeleteImage({ kind: 'cue', slotId })
	};
}

function fileLabel(src: string): string {
	return src.split('?')[0]?.split('/').pop() || src;
}

/** Any site path: the owning cue when there is one, else star-only. Null for references. */
export function srcMenuTarget(src: string): ImageMenuTarget | null {
	if (isReferenceImage(src)) return null;
	const slotId = cueSlotOf(src);
	if (slotId && !editUi.removedCueIds.has(slotId)) return cueMenuTarget(slotId);
	return {
		label: fileLabel(src),
		starKey: starKey(src),
		removeHint: 'Only chronicle cues can be removed here'
	};
}

function imageSrcAt(target: EventTarget | null): string {
	if (!(target instanceof Element)) return '';
	const img =
		target.closest('img[data-src]') ??
		target.closest('button, a, figure, li, [role="button"]')?.querySelector('img[data-src]');
	return img?.getAttribute('data-src') ?? '';
}

/**
 * Window-level fallback. Runs after component handlers, which already
 * `preventDefault`. Shift + right-click keeps the browser menu.
 */
export function onEditImageContextMenu(e: MouseEvent) {
	if (!editUi.enabled || e.defaultPrevented || e.shiftKey) return;
	const src = imageSrcAt(e.target);
	const target = src ? srcMenuTarget(src) : null;
	if (target) openImageMenu(e, target);
}
