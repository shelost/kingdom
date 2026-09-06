/**
 * Chronicle still → people.ts ids. Source of truth is the sidecar JSON
 * (`scripts/build-image-people.mjs`). Gallery membership does not guess.
 */

import raw from '$lib/data/image-people.json';

export const IMAGE_PEOPLE = raw as Record<string, readonly string[]>;

export function peopleOfSlot(slotId: string, extra?: readonly string[]): string[] {
	const tagged = new Set<string>(IMAGE_PEOPLE[slotId] ?? []);
	if (extra) {
		for (const id of extra) {
			if (id) tagged.add(id);
		}
	}
	return [...tagged];
}
