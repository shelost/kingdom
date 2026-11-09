/**
 * Client cache of the cards Momal's widgets draw (people, episodes, stills).
 * Each answer's trace fills it; ids the model named outside the trace are
 * fetched in one batch from `/api/momal/refs`.
 */

import { SvelteSet } from 'svelte/reactivity';
import {
	kinKey,
	type MomalEpisodeRef,
	type MomalFamily,
	type MomalKin,
	type MomalPersonRef,
	type MomalRefs,
	type MomalStill
} from '$lib/momalTypes';

const cache = $state<MomalRefs>({ people: {}, episodes: {}, stills: {}, kin: {}, family: {} });
/** Kin pairs requested (dedupe), and those the server has answered, tie or not. */
const kinAsked = new Set<string>();
const kinDone = new SvelteSet<string>();
const familyDone = new SvelteSet<string>();
const asked = new Set<string>();
let queued: { people: Set<string>; episodes: Set<string> } | null = null;

function absorb(refs: Partial<MomalRefs> | undefined) {
	if (!refs) return;
	for (const [id, p] of Object.entries(refs.people ?? {})) if (!cache.people[id]) cache.people[id] = p;
	for (const [id, e] of Object.entries(refs.episodes ?? {})) if (!cache.episodes[id]) cache.episodes[id] = e;
	for (const [id, s] of Object.entries(refs.stills ?? {})) if (!cache.stills[id]) cache.stills[id] = s;
	for (const [key, k] of Object.entries(refs.kin ?? {})) if (!cache.kin[key]) cache.kin[key] = k;
	for (const [id, f] of Object.entries(refs.family ?? {})) if (!cache.family[id]) cache.family[id] = f;
}

async function flush() {
	const batch = queued;
	queued = null;
	if (!batch || (!batch.people.size && !batch.episodes.size)) return;
	const q = new URLSearchParams();
	if (batch.people.size) q.set('people', [...batch.people].join(','));
	if (batch.episodes.size) q.set('episodes', [...batch.episodes].join(','));
	try {
		const res = await fetch(`/api/momal/refs?${q}`);
		if (res.ok) absorb((await res.json()) as MomalRefs);
	} catch {
		/* widgets fall back to the bare id */
	}
}

export const momalRefs = {
	absorb,
	person(id: string): MomalPersonRef | undefined {
		return cache.people[id];
	},
	episode(id: string): MomalEpisodeRef | undefined {
		return cache.episodes[id];
	},
	stills(id: string): MomalStill[] | undefined {
		return cache.stills[id];
	},
	kin(a: string, b: string): MomalKin | undefined {
		return cache.kin[kinKey(a, b)];
	},
	/** True once the server has answered for this pair (with or without a tie). */
	kinKnown(a: string, b: string): boolean {
		return !!cache.kin[kinKey(a, b)] || kinDone.has(kinKey(a, b));
	},
	family(id: string): MomalFamily | undefined {
		return cache.family[id];
	},
	/** Ask for the tie between two people (their cards come with it). */
	wantKin(a: string, b: string) {
		const key = kinKey(a, b);
		if (cache.kin[key] || kinAsked.has(key)) return;
		kinAsked.add(key);
		void fetch(`/api/momal/refs?people=${encodeURIComponent(a)},${encodeURIComponent(b)}`)
			.then((res) => (res.ok ? (res.json() as Promise<MomalRefs>) : null))
			.then((refs) => absorb(refs ?? undefined))
			.catch(() => {})
			.finally(() => kinDone.add(key));
	},
	/** True once the server has answered for this person's family (with or without one). */
	familyKnown(id: string): boolean {
		return !!cache.family[id] || familyDone.has(id);
	},
	/** Ask for one person's family, even when their card is already cached. */
	wantFamily(id: string) {
		if (cache.family[id] || asked.has(`f:${id}`)) return;
		asked.add(`f:${id}`);
		void fetch(`/api/momal/refs?people=${encodeURIComponent(id)}`)
			.then((res) => (res.ok ? (res.json() as Promise<MomalRefs>) : null))
			.then((refs) => absorb(refs ?? undefined))
			.catch(() => {})
			.finally(() => familyDone.add(id));
	},
	/** Make sure these ids are (or will be) in the cache. Safe to call from an effect. */
	want(people: string[] = [], episodes: string[] = []) {
		const p = people.filter((id) => !cache.people[id] && !asked.has(`p:${id}`));
		const e = episodes.filter((id) => !cache.episodes[id] && !asked.has(`e:${id}`));
		if (!p.length && !e.length) return;
		if (!queued) {
			queued = { people: new Set(), episodes: new Set() };
			queueMicrotask(flush);
		}
		for (const id of p) {
			asked.add(`p:${id}`);
			queued.people.add(id);
		}
		for (const id of e) {
			asked.add(`e:${id}`);
			queued.episodes.add(id);
		}
	}
};
