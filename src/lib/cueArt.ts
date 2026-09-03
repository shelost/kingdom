/**
 * Resolve display vs final art for a cue image slot.
 *
 * Reading (immersion / cinema): prefer locked-in final `src`, else temp stand-in.
 * Script (inline): final when present, plus a distinct temp stand-in beside it.
 * Gallery (/images): prefer temp for hover stacks, else final.
 *
 *   readingArt = src | tempImage | /temp/{id}
 *   scriptArt  = [src?, temp?] when distinct
 *   galleryArt = tempImage | /temp/{id} | src
 *   finalArt   = src when present
 */

import type { ImageSlot } from '$lib/story';
import { isSeedCopyTempId } from '$lib/seededTempArt';
import { tempArtPath } from '$lib/tempArtInventory';
import { staticAsset } from '$lib/staticAsset.svelte';

function normalizeArtPath(p: string): string {
	const t = p.trim();
	if (!t) return t;
	const path = t.startsWith('/') ? t : `/${t}`;
	return staticAsset(path) ?? path;
}

/** Explicit `tempImage`, else convention inventory (`static/temp/{slot.id}.*`). */
export function tempArtOf(slot: ImageSlot): string | undefined {
	const temp = slot.tempImage?.trim();
	if (temp) return normalizeArtPath(temp);
	const byId = tempArtPath(slot.id);
	return byId ? normalizeArtPath(byId) : undefined;
}

/** Locked-in final artwork from `src`, when present. */
export function finalArtOf(slot: ImageSlot): string | undefined {
	const src = slot.src?.trim();
	if (!src) return undefined;
	return normalizeArtPath(src);
}

export type ArtDisplayPrefer = 'reading' | 'gallery';

export type ScriptArtLayer = 'final' | 'temp';

export interface ScriptArtFrame {
	src: string;
	layer: ScriptArtLayer;
}

function artKey(p: string): string {
	const q = p.indexOf('?');
	return (q === -1 ? p : p.slice(0, q)).toLowerCase();
}

/**
 * Script-view plates for one cue: final when present, temp stand-in when
 * present. If both exist and are distinct paths, both are shown so the
 * manuscript keeps the reference visible (immersion still uses `displayArtOf`).
 */
export function scriptArtFramesOf(slot: ImageSlot): ScriptArtFrame[] {
	const final = finalArtOf(slot);
	const temp = tempArtOf(slot);
	const frames: ScriptArtFrame[] = [];
	if (final) frames.push({ src: final, layer: 'final' });
	if (temp && (!final || artKey(temp) !== artKey(final))) {
		frames.push({ src: temp, layer: 'temp' });
	}
	return frames;
}

/**
 * Preferred display art.
 * - `reading` (default): final `src` when present, else temp
 * - `gallery`: temp stand-in when available, else final `src`
 */
export function displayArtOf(
	slot: ImageSlot,
	prefer: ArtDisplayPrefer = 'reading'
): string | undefined {
	if (prefer === 'gallery') {
		return tempArtOf(slot) ?? finalArtOf(slot);
	}
	return finalArtOf(slot) ?? tempArtOf(slot);
}

/** @deprecated Prefer `displayArtOf` — kept as the reading-stack entry point. */
export function artOf(slot: ImageSlot): string | undefined {
	return displayArtOf(slot, 'reading');
}

/**
 * True when the on-disk temp is a trivial sips copy of the final (not a real
 * regeneration). Used to avoid labeling seed copies as “temp + refs”.
 */
export function isSeedCopyTemp(slot: ImageSlot): boolean {
	if (!tempArtOf(slot) || !finalArtOf(slot)) return false;
	return isSeedCopyTempId(slot.id);
}

/**
 * Temp / placeholder cue art — display is not (or not only) locked-in final:
 * - genuine temp stand-in in use (not a seed copy of the final)
 * - empty slot still showing a prompt card
 * - optional `isPlaceholder` if present on the slot
 * - final path that itself lives under `/temp/` or looks like a placeholder
 */
export function isTempCueImage(slot: ImageSlot): boolean {
	if (slot.isPlaceholder === true) return true;
	const temp = tempArtOf(slot);
	const final = finalArtOf(slot);
	if (temp && final && isSeedCopyTempId(slot.id)) {
		// Seeded jpeg-of-final: not a real temp stand-in for badge purposes.
		return false;
	}
	if (temp) return true;
	if (final) {
		return final.includes('/temp/') || final.includes('placeholder');
	}
	// No art at all — empty prompt card.
	return true;
}

/**
 * True when the slot has both a temp stand-in and a distinct final `src`,
 * and the temp is not a trivial seed copy of the final.
 */
export function hasArtStack(slot: ImageSlot): boolean {
	const temp = tempArtOf(slot);
	const final = finalArtOf(slot);
	if (!temp || !final || temp === final) return false;
	if (isSeedCopyTempId(slot.id)) return false;
	return true;
}

/** Refs are meaningful for generation only when temp is not a seed copy. */
export function hasGenuineTempRefs(slot: ImageSlot, hasRefs: boolean): boolean {
	if (!hasRefs) return false;
	if (!tempArtOf(slot)) return false;
	if (isSeedCopyTempId(slot.id)) return false;
	return true;
}
