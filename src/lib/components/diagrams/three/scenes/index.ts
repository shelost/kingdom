/**
 * Diagram id → lazy 3D scene + canvas aspect. Scenes load (with three.js)
 * only when their figure nears the viewport; nothing here imports them eagerly.
 */

import type { SceneEntry } from '../kit.svelte';

export const SCENES: Record<string, SceneEntry> = {
	'harmony-council': { load: () => import('./HarmonyScene.svelte'), aspect: 1.25, narrowAspect: 1 },
	'bone-rank': { load: () => import('./BoneRankScene.svelte'), aspect: 0.95, narrowAspect: 0.8 },
	'eight-clans': { load: () => import('./EightClansScene.svelte'), aspect: 1.2, narrowAspect: 0.95 },
	'royal-secretariat': {
		load: () => import('./RoyalSecretariatScene.svelte'),
		aspect: 1.35,
		narrowAspect: 1.05
	},
	'tang-departments': {
		load: () => import('./TangDepartmentsScene.svelte'),
		aspect: 1.35,
		narrowAspect: 1.3
	},
	pantheon: { load: () => import('./PantheonScene.svelte'), aspect: 1.3, narrowAspect: 1 },
	'high-summit': { load: () => import('./HighSummitScene.svelte'), aspect: 1.15, narrowAspect: 0.92 },
	'ministers-assembly': {
		load: () => import('./MinistersScene.svelte'),
		aspect: 1.1,
		narrowAspect: 0.9
	},
	'gaya-league': { load: () => import('./GayaScene.svelte'), aspect: 1.3, narrowAspect: 1.05 },
	'tamla-princes': { load: () => import('./TamlaScene.svelte'), aspect: 1.45, narrowAspect: 1.15 },
	'joseon-mandate': { load: () => import('./JoseonScene.svelte'), aspect: 1.3, narrowAspect: 1.05 },
	hwarang: { load: () => import('./HwarangScene.svelte'), aspect: 1.25, narrowAspect: 1 },
	'four-dragons': { load: () => import('./FourDragonsScene.svelte'), aspect: 1.2, narrowAspect: 0.95 },
	'four-beasts': { load: () => import('./FourBeastsScene.svelte'), aspect: 1.2, narrowAspect: 0.95 },
	'restoration-army': {
		load: () => import('./RestorationScene.svelte'),
		aspect: 1.5,
		narrowAspect: 1.2
	},
	'five-tribes': { load: () => import('./FiveTribesScene.svelte'), aspect: 1.2, narrowAspect: 0.95 },
	'tang-imperial': { load: () => import('./TangImperialScene.svelte'), aspect: 1.15, narrowAspect: 1.2 },
	'tang-military': { load: () => import('./TangMilitaryScene.svelte'), aspect: 1.15, narrowAspect: 1.3 },
	'tang-exam': { load: () => import('./TangExamScene.svelte'), aspect: 1.3, narrowAspect: 1.35 },
	'research-jougwan': { load: () => import('./research/JougwanScene.svelte'), aspect: 1.9, narrowAspect: 1.2 },
	'research-crown': { load: () => import('./research/CrownScene.svelte'), aspect: 1.5, narrowAspect: 1 },
	'research-layers': { load: () => import('./research/LayersScene.svelte'), aspect: 1.75, narrowAspect: 1.1 },
	'research-armor': { load: () => import('./research/ArmorScene.svelte'), aspect: 1.7, narrowAspect: 1.1 },
	'research-ranks': { load: () => import('./research/RanksScene.svelte'), aspect: 1.9, narrowAspect: 1.2 }
};

/** Every battle map: its real ground in 3D, the sheet's own 1000 × 560 frame. */
export const BATTLE_SCENE: SceneEntry = {
	load: () => import('./battle/BattleScene.svelte'),
	aspect: 1000 / 560
};

/** The wiki org-chart scene; each chart passes its own aspect from its layout. */
export const ORG_SCENE: SceneEntry = {
	load: () => import('./OrgScene.svelte'),
	aspect: 1.6
};
