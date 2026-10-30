import { LIFE_ARCS, type LifeArcStep } from '$lib/lifeArcs';
import { byId, type Person } from '$lib/people';
import { episodeQueryId, episodes } from '$lib/reading.svelte';
import { chapters, entryId } from '$lib/story';
import { scenesForWikiEntry, type WikiScene } from '$lib/wikiScenes';

export type EpisodeTurn = {
	person: Person;
	from: string;
	to: string;
	turn: string;
};

export type ArcBeat = {
	step: LifeArcStep;
	scene: WikiScene | null;
};

const TITLE_TO_ID = (() => {
	const map = new Map<string, string>();
	for (const ch of chapters) {
		for (const en of ch.entries) {
			if (!map.has(en.title)) map.set(en.title, entryId(ch.id, en.title));
		}
	}
	return map;
})();

export function episodeIdForTitle(title: string | undefined): string | null {
	if (!title) return null;
	return TITLE_TO_ID.get(title) ?? null;
}

export function episodeQueryForTitle(title: string | undefined): string | null {
	const id = episodeIdForTitle(title);
	if (!id) return null;
	const ep = episodes.find((e) => e.id === id);
	return ep ? episodeQueryId(ep) : id;
}

export function wikiIdQuery(personId: string): string {
	return `id=${encodeURIComponent(personId)}`;
}

export function stillsForArc(personId: string, steps: LifeArcStep[]): ArcBeat[] {
	const scenes = scenesForWikiEntry(personId).filter((s) => s.art && !s.nsfw);
	const used = new Set<string>();

	const take = (pool: WikiScene[]): WikiScene | null => {
		const hit = pool.find((s) => !used.has(s.id));
		if (hit) used.add(hit.id);
		return hit ?? null;
	};

	return steps.map((step) => {
		if (step.still) {
			const pinned = scenes.find((s) => s.id === step.still);
			if (pinned) {
				used.add(pinned.id);
				return { step, scene: pinned };
			}
		}
		const epId = episodeIdForTitle(step.episode);
		const inEp = epId ? scenes.filter((s) => s.episodeId === epId) : [];
		return { step, scene: take(inEp) };
	});
}

export function turnsInEpisode(title: string): EpisodeTurn[] {
	const out: EpisodeTurn[] = [];
	for (const [id, def] of Object.entries(LIFE_ARCS)) {
		const person = byId.get(id);
		if (!person) continue;
		for (let i = 0; i < def.steps.length; i++) {
			const step = def.steps[i];
			const next = def.steps[i + 1];
			if (!step?.turn || step.episode !== title || !next) continue;
			out.push({ person, from: step.title, to: next.title, turn: step.turn });
		}
	}
	return out;
}
