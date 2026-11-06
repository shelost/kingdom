/**
 * Battles a stage site can play. A site plays every battle whose place is that site,
 * plus a few that happen on the same water or hill but are filed under another place.
 */
import { BATTLES } from '$lib/battles';
import type { BattleFit } from './battle3d';
import type { StageSiteId } from './sites';

export type StageScene = {
	id: string;
	en: string;
	ko: string;
	year: number;
	/** Why this battle is offered on a site it is not filed under. */
	note?: string;
	/** Where the battle sheet lies on the grounds. */
	fit?: BattleFit;
};

type Link = { id: string; note?: string; fit?: BattleFit };

/** Same ground, different place id. */
const ALSO: Partial<Record<StageSiteId, Link[]>> = {
	sabi: [
		{
			id: 'baekgang-663',
			note: 'The stage river is the White River (백강), green-grey and silted at the mouth. The palace stands upstream, where it is still called the Baengma.'
		}
	],
	moon: [
		{ id: 'gwanggaeto-400', note: 'Goguryeo horse relieve Silla at its own capital: the field is laid over the Seorabeol plain.' },
		{ id: 'bidam-647', note: 'Bidam’s rising at Myeonghwal and the queen’s men at Wolseong, on the same valley floor.' }
	],
	ansi: [{ id: 'jupilsan-645', note: 'The relief army breaks on the hills before Ansi; the field is laid beside the fortress.' }]
};

export function scenesFor(site: StageSiteId): StageScene[] {
	const linked = new Map((ALSO[site] ?? []).map((x) => [x.id, x]));
	return Object.values(BATTLES)
		.filter((b) => b.place === site || linked.has(b.id))
		.map((b) => ({ id: b.id, en: b.title, ko: b.ko, year: b.year, note: linked.get(b.id)?.note, fit: linked.get(b.id)?.fit }))
		.sort((a, b) => a.year - b.year);
}
