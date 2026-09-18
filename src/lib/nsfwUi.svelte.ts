/**
 * Intimate / NSFW cue art and script (`p` / `dialogue` / `monologue` with `nsfw`).
 * Off unless the URL has `?nsfw=true`. Not persisted. SSR always hides it
 * (shared module state must not follow a request).
 */
import { browser } from '$app/environment';
import { clearUtterance } from '$lib/reading.svelte';
import type { Block, Entry } from '$lib/story';

export const NSFW_QUERY = 'nsfw';

export const nsfwUi = $state({ showIntimate: false });

/** Anything this toggle can hide: a cue slot, or a script block carrying `nsfw`. */
type Nsfwable = { nsfw?: boolean | string };

export function nsfwQueryOn(url: URL): boolean {
	return url.searchParams.get(NSFW_QUERY) === 'true';
}

/** Keep `?nsfw=true` (and `?edit=true` when set) on an in-app href. */
export function hrefWithNsfw(href: string, current: URL): string {
	const next = new URL(href, current);
	let dirty = false;
	if (nsfwQueryOn(current)) {
		next.searchParams.set(NSFW_QUERY, 'true');
		dirty = true;
	}
	/* Lazy import avoided — edit flag lives beside nsfw in the address bar. */
	if (current.searchParams.get('edit') === 'true') {
		next.searchParams.set('edit', 'true');
		dirty = true;
	}
	if (!dirty) return href;
	return `${next.pathname}${next.search}${next.hash}`;
}

export function applyNsfwFromUrl(url: URL) {
	setShowIntimate(nsfwQueryOn(url));
}

export function isNsfwSlot(slot: Nsfwable): boolean {
	return Boolean(slot.nsfw);
}

export function nsfwAllowed(slot: Nsfwable): boolean {
	return nsfwUi.showIntimate || !isNsfwSlot(slot);
}

/**
 * `T` is only constrained to `object`: `Block` is a union whose members do not
 * all declare `nsfw`, which a `Nsfwable` constraint would reject as a weak type.
 */
export function filterNsfw<T extends object>(items: T[]): T[] {
	if (nsfwUi.showIntimate) return items;
	const kept = items.filter((item) => !isNsfwSlot(item as Nsfwable));
	/* Same array back when nothing was hidden — keyed lists and beat anchors
	   downstream compare by reference. */
	return kept.length === items.length ? items : kept;
}

/**
 * Drop nsfw script blocks (and nested flashback blocks) when Intimate is off.
 *
 * Hands back the very array it was given whenever nothing is hidden, so the
 * call is idempotent by reference. The script column, the cinema rail and
 * `sceneIdForBlock` all match blocks by identity — cloning an untouched
 * flashback would strand its scene anchor and re-render the beat on every read.
 */
export function filterScriptNsfw(blocks: Block[]): Block[] {
	if (nsfwUi.showIntimate) return blocks;
	const kept = filterNsfw(blocks);
	let changed = kept.length !== blocks.length;
	const out = kept.map((b) => {
		if (b.kind !== 'flashback') return b;
		const inner = filterScriptNsfw(b.blocks);
		if (inner === b.blocks) return b;
		changed = true;
		return { ...b, blocks: inner };
	});
	return changed ? out : blocks;
}

/**
 * Entry as the reader should see it under the current Intimate toggle.
 *
 * Beats, anchors and the cinema rail are all derived from whatever this
 * returns, so an entry with nothing to hide comes back untouched.
 */
export function entryForReading(entry: Entry): Entry {
	if (nsfwUi.showIntimate) return entry;
	const blocks = filterScriptNsfw(entry.blocks ?? []);
	const images = filterNsfw(entry.images ?? []);
	if (blocks === entry.blocks && images === entry.images) return entry;
	return { ...entry, blocks, images };
}

export function setShowIntimate(on: boolean) {
	if (nsfwUi.showIntimate === on) return;
	nsfwUi.showIntimate = on;
	if (!browser) return;
	/* The stage plate holds the last line until the reader scrolls again — drop
	   it, so a line this toggle just removed cannot stay on stage. */
	if (!on) clearUtterance();
}
