/**
 * Which wiki/map places have a 3D model on the Stage. The map badges, the wiki
 * preview and the nav all read this one table, so a place opens the same site
 * everywhere. Keys are `PLACES` ids from `$lib/places`; a few places share a
 * site because the model holds them (Wolji and the Ghost Bridge sit inside the
 * Moon Palace grounds).
 */

import { STAGE_SITES, type StageSite, type StageSiteId } from './sites';
import type { LightPreset } from './build/types';
import { PLACES } from '$lib/places';
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
	nakrang: 'nakrang',
	realms_pavilion: 'threerealms',
	western_flower_field: 'flowerfield',
	underworld: 'underworld'
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
	underworld: 'springs'
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

/** The Stage route for a site, before base-path resolution. */
export function stagePath(site: StageSiteId): `/stage?site=${StageSiteId}` {
	return `/stage?site=${site}`;
}

/** Hour of day for each painted light, matching the Stage page's sun. */
export const LIGHT_HOUR: Record<LightPreset, number> = { dawn: 6, day: 11, golden: 17, night: 21 };

/** The year and hour a site opens on: its named default era (else the last), under the light it was painted in. */
export function stageOpening(site: StageSite): { year: number; hour: number } {
	return {
		year: site.defaultYear ?? site.eras[site.eras.length - 1].year,
		hour: LIGHT_HOUR[site.light ?? 'day']
	};
}
