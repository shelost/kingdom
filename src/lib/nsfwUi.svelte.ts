/**
 * Reader preference for intimate / NSFW cue art.
 * Default off. Persisted as localStorage `kingdom:nsfw` (`1` / `0`).
 */
import { browser } from '$app/environment';

const STORAGE_KEY = 'kingdom:nsfw';

export const nsfwUi = $state({ showIntimate: false });

export function isNsfwSlot(slot: { nsfw?: boolean | string }): boolean {
	return Boolean(slot.nsfw);
}

export function nsfwAllowed(slot: { nsfw?: boolean | string }): boolean {
	return nsfwUi.showIntimate || !isNsfwSlot(slot);
}

export function filterNsfw<T extends { nsfw?: boolean | string }>(images: T[]): T[] {
	if (nsfwUi.showIntimate) return images;
	return images.filter((im) => !isNsfwSlot(im));
}

export function setShowIntimate(on: boolean) {
	nsfwUi.showIntimate = on;
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
	} catch {
		/* private mode — preference just won't persist */
	}
}

export function toggleShowIntimate() {
	setShowIntimate(!nsfwUi.showIntimate);
}

/** Restore after hydrate so SSR stays hidden (default off). */
export function loadShowIntimate() {
	if (!browser) return;
	try {
		nsfwUi.showIntimate = localStorage.getItem(STORAGE_KEY) === '1';
	} catch {
		/* ignore */
	}
}
