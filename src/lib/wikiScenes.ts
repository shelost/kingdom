/**
 * Chronicle cue stills for wiki character / god / animal pages.
 * People: membership is the sidecar `image-people.json` — a still appears iff
 * its tags include that profile’s person id. Animals: the still attaches the
 * animal's board in `refs` or names it in the slot id (see `buildAnimalSceneIndex`).
 */

import { byId, nameOf, type Person } from '$lib/people';
import { ANIMAL_INDEX } from '$lib/animals';
import { peopleOfSlot } from '$lib/imagePeople';
import { entryId } from '$lib/story';
import {
	artAttachmentKey,
	flattenStoryImages,
	humanizeCueId,
	type StoryCueImage
} from '$lib/storyImages';

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

function matchesPosterPath(scene: WikiScene, poster: string): boolean {
	const key = artAttachmentKey(poster);
	return artAttachmentKey(scene.id) === key || artAttachmentKey(scene.art) === key;
}

function pinPoster(person: Person, scenes: WikiScene[]): WikiScene[] {
	const list = [...scenes];
	const poster = person.poster;
	if (poster) {
		const idx = list.findIndex((s) => matchesPosterPath(s, poster));
		if (idx > 0) {
			const [hit] = list.splice(idx, 1);
			if (hit) list.unshift(hit);
		} else if (idx < 0) {
			const title = nameOf(person);
			list.unshift({
				id: artAttachmentKey(poster) || `poster_${person.id}`,
				title,
				alt: title,
				art: poster,
				episodeId: '',
				nsfw: false,
				caption: 'poster'
			});
		}
		return list;
	}
	const idx = list.findIndex(
		(s) =>
			s.id.startsWith('poster_') ||
			s.id.startsWith('poster-') ||
			s.id === 'yushin-sword-vertical' ||
			s.id === 'chunchu-strategist'
	);
	if (idx > 0) {
		const [hit] = list.splice(idx, 1);
		if (hit) list.unshift(hit);
	}
	return list;
}

/**
 * Stills for animal profiles: a still belongs to an animal when it attaches
 * that animal's board, or its slot id carries the name (`yushin-hangyul-…`).
 * Boards can be shared (Hanseul uses Hangyul's coat board), so when several
 * animals match, the ones named in the slot id, alt, or canon header
 * (`HANSEUL (한슬, …`) win; otherwise the first def keeps it.
 */
function buildAnimalSceneIndex(): Map<string, WikiScene[]> {
	const buckets = new Map<string, WikiScene[]>();
	for (const im of flattenStoryImages()) {
		const refs = im.slot.refs ?? [];
		const idWords = im.slot.id.toLowerCase().split(/[-_]/);
		const hits = ANIMAL_INDEX.filter(
			(a) =>
				a.boards.some((b) => refs.includes(b)) ||
				a.names.some((n) => idWords.includes(n.toLowerCase()))
		);
		if (!hits.length) continue;
		const scene = toWikiScene(im);
		if (!scene) continue;
		const label = `${im.slot.id} ${im.slot.alt ?? ''}`.toLowerCase();
		const prompt = im.slot.prompt ?? '';
		const named = hits.filter((a) =>
			a.names.some(
				(n) => label.includes(n.toLowerCase()) || prompt.includes(`${n.toUpperCase()} (`)
			)
		);
		for (const a of named.length ? named : hits.slice(0, 1)) {
			const list = buckets.get(a.profileId);
			if (list) list.push(scene);
			else buckets.set(a.profileId, [scene]);
		}
	}
	return buckets;
}

const SCENES_BY_ANIMAL = buildAnimalSceneIndex();

/** Stills tagged with both people of a relationship; the bond's `still` slot pins first. */
function scenesForBond(bond: Person): WikiScene[] {
	const [a, b] = bond.between ?? [];
	if (!a || !b) return [];
	const withB = new Set((SCENES_BY_PERSON.get(b) ?? []).map((s) => s.id));
	const list = (SCENES_BY_PERSON.get(a) ?? []).filter((s) => withB.has(s.id));
	const idx = bond.still ? list.findIndex((s) => s.id === bond.still) : -1;
	if (idx > 0) list.unshift(...list.splice(idx, 1));
	return list;
}

/** Tagged stills for a wiki character, god, animal, or relationship. Empty when none. Poster / cover stills pin first. */
export function scenesForWikiEntry(personId: string): WikiScene[] {
	const person = byId.get(personId);
	if (!person) return [];
	if (person.entity === 'relationship') return scenesForBond(person);
	if (person.entity === 'animal') {
		const list = [...(SCENES_BY_ANIMAL.get(personId) ?? [])];
		const cover = person.avatar ? artAttachmentKey(person.avatar) : '';
		const idx = cover ? list.findIndex((s) => artAttachmentKey(s.art) === cover) : -1;
		if (idx > 0) list.unshift(...list.splice(idx, 1));
		return list;
	}
	if (!isCharacter(person)) return [];
	return pinPoster(person, SCENES_BY_PERSON.get(personId) ?? []);
}
