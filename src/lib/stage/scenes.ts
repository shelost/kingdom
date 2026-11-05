/**
 * Battles a stage site can play. A site plays every battle whose place is that site,
 * plus a few that happen on the same water or hill but are filed under another place.
 */
import { BATTLES } from '$lib/battles';
import type { StageSiteId } from './sites';

export type StageScene = {
	id: string;
	en: string;
	ko: string;
	year: number;
	/** Why this battle is offered on a site it is not filed under. */
	note?: string;
};

/** Same ground, different place id. */
const ALSO: Partial<Record<StageSiteId, { id: string; note: string }[]>> = {
	sabi: [
		{
			id: 'baekgang-663',
			note: 'The White River is this river at its mouth. The palace stands upstream, on the Baengma.'
		}
	]
};

export function scenesFor(site: StageSiteId): StageScene[] {
	const linked = new Map((ALSO[site] ?? []).map((x) => [x.id, x.note]));
	return Object.values(BATTLES)
		.filter((b) => b.place === site || linked.has(b.id))
		.map((b) => ({ id: b.id, en: b.title, ko: b.ko, year: b.year, note: linked.get(b.id) }))
		.sort((a, b) => a.year - b.year);
}
