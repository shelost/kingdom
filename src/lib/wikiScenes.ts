/**
 * Chronicle cue stills for wiki character / god pages.
 * Membership is the sidecar `image-people.json` — a still appears iff its
 * tags include that profile’s person id. No title / alt / refs guessing.
 */

import { byId, type Person } from '$lib/people';
import { peopleOfSlot } from '$lib/imagePeople';
import { entryId } from '$lib/story';
import { flattenStoryImages, humanizeCueId, type StoryCueImage } from '$lib/storyImages';

export type WikiScene = {
	id: string;
	title: string;
	alt: string;
	art: string;
	/** Chronicle episode DOM id (`chapterId-slug`). */
	episodeId: string;
	nsfw: boolean;
	caption?: string;
};

function isCharacter(p: Person): boolean {
	return p.entity == null || p.entity === 'god';
}

function sceneLabel(im: StoryCueImage): string {
	const alt = im.slot.alt?.trim();
	if (alt) {
		const cut = (alt.split(/\s*[—–.]\s*|\s+-\s+/)[0] ?? alt).trim();
		if (cut) return cut.length > 48 ? `${cut.slice(0, 46).trim()}…` : cut;
	}
	return humanizeCueId(im.slot.id);
}

function toWikiScene(im: StoryCueImage): WikiScene | null {
	const art = im.displayArt;
	if (!art) return null;
	const title = sceneLabel(im);
	return {
		id: im.slot.id,
		title,
		alt: im.slot.alt?.trim() || title,
		art,
		episodeId: entryId(im.chapterId, im.entryTitle),
		nsfw: im.isNsfw,
		caption: im.slot.id
	};
}

function buildSceneIndex(): Map<string, WikiScene[]> {
	const buckets = new Map<string, WikiScene[]>();
	const seenByPerson = new Map<string, Set<string>>();

	for (const im of flattenStoryImages()) {
		const scene = toWikiScene(im);
		if (!scene) continue;
		const tagged = peopleOfSlot(im.slot.id, im.slot.people);
		for (const personId of tagged) {
			const person = byId.get(personId);
			if (!person || !isCharacter(person)) continue;
			let seen = seenByPerson.get(personId);
			if (!seen) {
				seen = new Set();
				seenByPerson.set(personId, seen);
			}
			if (seen.has(im.slot.id)) continue;
			seen.add(im.slot.id);
			const list = buckets.get(personId);
			if (list) list.push(scene);
			else buckets.set(personId, [scene]);
		}
	}
	return buckets;
}

const SCENES_BY_PERSON = buildSceneIndex();

/** Tagged stills for a wiki character or god. Empty when none. */
export function scenesForWikiEntry(personId: string): WikiScene[] {
	const person = byId.get(personId);
	if (!person || !isCharacter(person)) return [];
	return SCENES_BY_PERSON.get(personId) ?? [];
}
