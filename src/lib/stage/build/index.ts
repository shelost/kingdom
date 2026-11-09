import type { StageSiteId } from '../sites';
import type { BuildOptions, SiteBuild } from './types';
import { buildMoon } from './moon';
import { buildSabi } from './sabi';
import { buildDaeya } from './daeya';
import { buildPyongyang } from './pyongyang';
import { buildAnsi } from './ansi';
import { buildChek } from './chek';
import { buildWirye } from './wirye';
import { buildMugun } from './mugun';
import { buildDaming } from './daming';
import { buildAsuka } from './asuka';
import { buildYodong } from './corners';
import { buildGeumgwan, buildBuyeo, buildJolbon } from './kingdoms';
import { buildThreeRealms, buildFlowerField, buildUnderworld, buildSkyPalace } from './realms';
import { buildThreefold } from './west';

const BUILDERS: Record<StageSiteId, (opts: BuildOptions) => SiteBuild> = {
	moon: buildMoon,
	sabi: buildSabi,
	daeya: buildDaeya,
	pyongyang: buildPyongyang,
	ansi: buildAnsi,
	chek: buildChek,
	wirye: buildWirye,
	mugun: buildMugun,
	daming: buildDaming,
	asuka: buildAsuka,
	yodong: buildYodong,
	geumgwan: buildGeumgwan,
	buyeo: buildBuyeo,
	jolbon: buildJolbon,
	threerealms: buildThreeRealms,
	flowerfield: buildFlowerField,
	underworld: buildUnderworld,
	skypalace: buildSkyPalace,
	threefold: buildThreefold
};

export function buildSite(id: StageSiteId, opts: BuildOptions): SiteBuild | null {
	const build = BUILDERS[id];
	return build ? build(opts) : null;
}

export type { SiteBuild, Label, View, LightPreset, LightMix, Realm, Weather, LabelStatus, StageApi, Layers } from './types';
export { DEFAULT_LAYERS, blend, weight, blendColor } from './types';
