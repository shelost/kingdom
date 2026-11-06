import { error } from '@sveltejs/kit';
import { INTROS, introById } from '$lib/intro/intros';
import { byId, nameOf, stageGalleryOf } from '$lib/people';
import { IMAGE_PEOPLE } from '$lib/imagePeople';
import { TEMP_ART_BY_ID } from '$lib/tempArtInventory';
import { rng } from '$lib/stage/build/geo';
import type { IntroPerson } from '$lib/intro/timeline';

/** Stills per person: enough to never repeat inside a fast run, few enough to preload. */
const STILLS = 14;
/** A still counts for someone only when they share it with at most this many people. */
const CROWD = 3;

function stillsByPerson(): Map<string, string[]> {
	const out = new Map<string, string[]>();
	for (const [slot, people] of Object.entries(IMAGE_PEOPLE)) {
		if (people.length > CROWD) continue;
		const src = TEMP_ART_BY_ID.get(slot);
		if (!src) continue;
		for (const id of people) {
			const list = out.get(id);
			if (list) list.push(src);
			else out.set(id, [src]);
		}
	}
	return out;
}

function sample<T>(list: T[], n: number, seed: number): T[] {
	if (list.length <= n) return list;
	const rand = rng(seed);
	const pool = [...list];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, n);
}

function seedOf(id: string): number {
	let h = 2166136261;
	for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
	return h >>> 0;
}

export function load({ params }) {
	const intro = introById.get(params.kingdom ?? 'goguryeo');
	if (!intro) error(404, 'No intro for that kingdom');

	const stills = stillsByPerson();
	const person = (id: string, weight = 1): IntroPerson | null => {
		const p = byId.get(id);
		if (!p) return null;
		const portraits = [
			...new Set(stageGalleryOf(p).map((s) => s.art).filter((a): a is string => !!a))
		];
		if (!portraits.length) return null;
		const own = (stills.get(id) ?? []).filter((s) => !portraits.includes(s));
		return { id, name: nameOf(p), weight, portraits, stills: sample(own, STILLS, seedOf(id)) };
	};
	const people = (ids: { id: string; weight?: number }[]) =>
		ids.map((c) => person(c.id, c.weight)).filter((p): p is IntroPerson => !!p);

	return {
		intro,
		kingdoms: INTROS.map((i) => ({ id: i.id, title: i.title, color: i.color })),
		opening: people(intro.opening.map((id) => ({ id }))),
		cast: people(intro.cast),
		finale: person(intro.finale)
	};
}
