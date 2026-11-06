/**
 * Which wiki/map places have a 3D model on the Stage. The map badges, the wiki
 * preview and the nav all read this one table, so a place opens the same site
 * everywhere. Keys are `PLACES` ids from `$lib/places`; a few places share a
 * site because the model holds them (Wolji and the Ghost Bridge sit inside the
 * Moon Palace grounds).
 */

import { STAGE_SITES, type StageSite, type StageSiteId } from './sites';
import type { LightPreset } from './build/types';

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
