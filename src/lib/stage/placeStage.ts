/**
 * Which wiki/map places have a 3D model on the Stage. The map badges, the wiki
 * preview and the nav all read this one table, so a place opens the same site
 * everywhere. Keys are `PLACES` ids from `$lib/places`; a few places share a
 * site because the model holds them (Wolji and the Ghost Bridge sit inside the
 * Moon Palace grounds).
 */

import { STAGE_SITES, type StageSite, type StageSiteId } from './sites';
import type { LightPreset } from './build/types';
import { PLACES, mapLabel } from '$lib/places';
import { ABROAD_AT, SKY_AT, cosmosProject, layoutSpots, type CosmosLayout } from '$lib/cosmos';

export const PLACE_STAGE = {
	surabol: 'moon',
	moon_palace: 'moon',
	wolji: 'moon',
	radiance: 'moon',
	ghost_bridge: 'moon',
	sabi: 'sabi',
	pyongyang: 'pyongyang',
	ansi: 'ansi',
	daeya: 'daeya',
	chek_fort: 'chek',
	wirye: 'wirye',
	mugun: 'mugun',
	changan: 'daming',
	asuka: 'asuka',
	yodong: 'yodong',
	buyeo_fort: 'buyeo',
	geumgwan: 'geumgwan',
	buyeo_north: 'buyeo',
	jolbon: 'jolbon',
	nakrang: 'pyongyang',
	realms_pavilion: 'threerealms',
	western_flower_field: 'flowerfield',
	yaksu: 'flowerfield',
	underworld: 'underworld',
	samdo: 'underworld',
	threefold_path: 'threefold',
	twelve_passes: 'threefold',
	three_colored_rivers: 'threefold',
	baek: 'threefold',
	'hwang-river': 'threefold',
	jeok: 'threefold',
	mujangsung: 'threefold',
	seventy_eight_paths: 'underworld'
} as const satisfies Record<string, StageSiteId>;

export type StagedPlaceId = keyof typeof PLACE_STAGE;

const SITE_BY_ID = new Map(STAGE_SITES.map((s) => [s.id, s]));

/** The built 3D site for a place, if it has one. */
export function stageSiteOf(placeId: string | null | undefined): StageSite | undefined {
	if (!placeId || !(placeId in PLACE_STAGE)) return undefined;
	const site = SITE_BY_ID.get(PLACE_STAGE[placeId as StagedPlaceId]);
	return site?.ready ? site : undefined;
}

/**
 * Where a site stands on the map, in sheet units: on the sheet (its first place in
 * PLACE_STAGE), abroad (real lon/lat through the known-world fold), past Rome in the
 * myth band, or in the sky above the peninsula.
 */
export type StageAnchor = { site: StageSite; x: number; y: number; where: 'sheet' | 'abroad' | 'myth' | 'sky' };

/** Myth sites sit on the cosmology layout, not on a longitude. */
const MYTH_SPOT = {
	threerealms: 'pavilion',
	flowerfield: 'flowers',
	underworld: 'gateway',
	threefold: 'threefold'
} as const;

function anchorOf(site: StageSite, layout: CosmosLayout = 'circles'): StageAnchor | null {
	if (site.id === 'skypalace') {
		const [x, y] = cosmosProject(...SKY_AT);
		return { site, x, y, where: 'sky' };
	}
	if (site.id in MYTH_SPOT) {
		const [x, y] = layoutSpots(layout)[MYTH_SPOT[site.id as keyof typeof MYTH_SPOT]];
		return { site, x, y, where: 'myth' };
	}
	const placeId = Object.keys(PLACE_STAGE).find((p) => PLACE_STAGE[p as StagedPlaceId] === site.id);
	if (!placeId) return null;
	const abroad = ABROAD_AT[placeId];
	if (abroad) {
		const [x, y] = cosmosProject(...abroad);
		return { site, x, y, where: 'abroad' };
	}
	const place = PLACES[placeId];
	return place ? { site, x: place.x, y: place.y, where: 'sheet' } : null;
}

/** Every built site's anchor, in the Stage's own order. */
/** Built sites for one cosmology layout. Myth pins follow the flower fields and the underworld. */
export function anchorsFor(layout: CosmosLayout = 'circles'): StageAnchor[] {
	return STAGE_SITES.filter((s) => s.ready)
		.map((s) => anchorOf(s, layout))
		.filter((a): a is StageAnchor => a !== null);
}

export const STAGE_ANCHORS: StageAnchor[] = anchorsFor('circles');

export type StagePill = {
	site: StageSite;
	placeId: string;
	x: number;
	y: number;
	where: 'sheet' | 'abroad';
};

/**
 * One pill per built city: the first place that names the site. Myth stations
 * and the sky palace stay on their own labels. Sheet points are flat peninsula
 * coordinates; abroad points are already on the fish-eyed sheet.
 */
export function stagePills(): StagePill[] {
	const seen = new Set<StageSiteId>();
	const out: StagePill[] = [];
	for (const a of anchorsFor('circles')) {
		if (a.where !== 'sheet' && a.where !== 'abroad') continue;
		if (seen.has(a.site.id)) continue;
		const placeId = Object.entries(PLACE_STAGE).find(([, id]) => id === a.site.id)?.[0];
		if (!placeId) continue;
		seen.add(a.site.id);
		out.push({ site: a.site, placeId, x: a.x, y: a.y, where: a.where });
	}
	return out;
}

/** The name on a pill: the city's, unless that word is already on another pill. */
export function pillLabel(pills: StagePill[], ko: boolean): Map<string, string> {
	const used = new Set<string>();
	const out = new Map<string, string>();
	for (const p of pills) {
		const place = PLACES[p.placeId];
		const siteName = ko ? p.site.ko : p.site.en;
		let name = place ? (ko ? (place.korean ?? place.name) : mapLabel(place)) : siteName;
		if (used.has(name)) name = siteName;
		used.add(name);
		out.set(p.site.id, name);
	}
	return out;
}

/** The Stage route for a site, before base-path resolution. */
export function stagePath(site: StageSiteId): `/stage?site=${StageSiteId}` {
	return `/stage?site=${site}`;
}

/** Hour of day for each painted light, matching the Stage page's sun. */
export const LIGHT_HOUR: Record<LightPreset, number> = { dawn: 6, day: 11, golden: 17, night: 21 };

/** The year and hour a site opens on: its named default era (else the last), under the light it was painted in. */
/** A place that opens on one era of a shared site, rather than the site's default year. */
export function placeYear(placeId: string): number | undefined {
	if (placeId === 'nakrang') return 32;
	return undefined;
}

/** A place that should open on one camera of its site. */
export function placeView(placeId: string): string | undefined {
	if (placeId === 'seventy_eight_paths') return 'roads';
	return undefined;
}

export function stageOpening(site: StageSite): { year: number; hour: number } {
	return {
		year: site.defaultYear ?? site.eras[site.eras.length - 1].year,
		hour: LIGHT_HOUR[site.light ?? 'day']
	};
}
