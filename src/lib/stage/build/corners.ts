import { Region, rect, distanceToPath, type P2 } from './geo';
import { at, box, tents, type HallSpec } from './kit';
import { gridTown } from './common';
import { camp } from './fortress';
import { buildRecipe, garrison } from './recipe';
import { reach } from './life';
import { Folk } from './people';
import type { BuildOptions, SiteBuild } from './types';

/*
 * Goguryeo's western corner fortress: Yodong faces west over the Liao. Buyeo Fortress is an era of
 * the Buyeo site, Hanseong an era of the Han Fortress; Chek (east) and Pyongyang (centre) have
 * their own builders.
 */

export const RED_HALL: HallSpec = { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 5, base: 1.4, steps: ['s'], roof: { chimi: true, tile: 'tileRed' } };
export const RED_WING: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.7, front: 'doors', back: 'red', sides: 'red', roof: { tile: 'tileRed' } };

/* ------------------------------------------------------------------ Yodong */

const YD = { plain: 20, water: 16, bed: 9, wallH: 9 };
const YD_RING = rect(0, -220, 1100, 820);
const YD_MOAT: P2[] = [...rect(0, -220, 1190, 910), rect(0, -220, 1190, 910)[0]];
/** The Taizi, braided: a main channel and a side channel round a long sandbar, both running west. */
const TAIZI: P2[] = [
	[5200, -900],
	[3200, -260],
	[1700, 330],
	[700, 520],
	[-500, 560],
	[-1800, 720],
	[-3400, 1150],
	[-5600, 1600]
];
const TAIZI_SIDE: P2[] = [
	[1900, 340],
	[1100, 760],
	[100, 860],
	[-900, 820],
	[-1900, 760]
];
const YD_PALACE = { x: 0, z: -470 };

export function buildYodong(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'yodong',
		seed: 404,
		near: { minX: -2200, maxX: 2400, minZ: -1600, maxZ: 1700 },
		cell: 8,
		plain: YD.plain,
		roll: 1.2,
		palette: { redTiles: true },
		mountains: [
			{ x: 4600, z: -2200, rx: 2400, rz: 2600, h: 520, seed: 1.4 },
			{ x: 3400, z: 2800, rx: 2000, rz: 1800, h: 360, seed: 2.2 },
			{ x: 7600, z: 300, rx: 3200, rz: 3400, h: 900, seed: 3.1 }
		],
		// the bluff the board's munru stands on, at the south-east corner over the river
		hills: [{ x: 520, z: 140, rx: 220, rz: 140, h: 22, seed: 4.4, power: 1.1 }],
		rivers: [
			{ path: TAIZI, half: 140, water: YD.water, bed: YD.bed },
			{ path: TAIZI_SIDE, half: 55, water: YD.water, bed: YD.bed + 2 },
			{ path: YD_MOAT, half: 7, water: YD.water + 0.6, bed: YD.bed + 4 }
		],
		look: {
			fields: ['#a3ae68', '#b2b874', '#98a660', '#bdbd7e', '#a9b06c'],
			forest: ['#5b7341', '#66794a', '#526a3d'],
			rock: '#857e6e',
			bed: '#8f8a6c',
			bank: '#d8cfab'
		},
		walls: () => [
			{
				ring: YD_RING,
				h: YD.wallH,
				t: 6,
				cloth: 'wallRed',
				every: 40,
				torches: 60,
				gates: [
					{ near: [200, 190], munru: { block: { w: 28, d: 13, h: YD.wallH + 3, arch: 5 }, storeys: 2, red: true, bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.6, 3.8, 3.6], colH: 4.4 } },
					{ near: [-550, -220], munru: { block: { w: 24, d: 12, h: YD.wallH + 1, arch: 5 }, red: true, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 } },
					{ near: [550, -320], munru: { block: { w: 24, d: 12, h: YD.wallH + 1, arch: 5 }, red: true, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 } }
				]
			}
		],
		courts: [
			{
				...YD_PALACE,
				w: 190,
				d: 170,
				pave: 'gravel',
				main: RED_HALL,
				upper: { bays: [3.6, 4.2, 4.2, 3.6], depth: [3.6, 3.6], colH: 4, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true, tile: 'tileRed' } },
				wings: RED_WING,
				label: { id: 'yamen', en: 'Commander’s hall', ko: '성주 관아', status: 'placed', note: 'The hall inside the walls is placed; the wall follows the plain-city outline at Liaoyang' }
			}
		],
		hamlets: [
			{ x: 1400, z: -700, r: 220, n: 18, thatch: 0.9 },
			{ x: -1300, z: 1300, r: 200, n: 14, thatch: 0.9 }
		],
		trees: { n: 6000, kinds: ['pine', 'broad', 'broad'], min: 18 },
		grass: { n: 14000, box: { minX: -1600, maxX: 1800, minZ: -1200, maxZ: 1200 } },
		extra: (c) => {
			const city = new Region(rect(0, -220, 1060, 780));
			const street = c.road([[200, 230], [120, 0], [40, -300], [YD_PALACE.x, YD_PALACE.z + 90]], 12);
			c.road([[-560, -220], [560, -320]], 9);
			gridTown(c.town, c.g.height, c.rand, { minX: -540, maxX: 540, minZ: -620, maxZ: 180 }, 92, (x, z) => city.contains(x, z) && c.clear(x, z, 6) && distanceToPath(street, x, z) > 10, { density: 0.72, thatch: 0.6 });
			// timber bridges over the moat at each gate
			for (const [x, z, rot] of [
				[200, 230, 0],
				[-597, -220, Math.PI / 2],
				[597, -320, Math.PI / 2]
			] as [number, number, number][]) {
				const y = YD.water + 1.6;
				box(c.b, 'wood', at(x, y, z, rot), 0, 0, 0, 9, 0.5, 34);
				for (const s of [1, -1]) box(c.b, 'wood', at(x, y, z, rot), s * 4.3, 0.7, 0, 0.25, 0.9, 34);
			}
			// Taizong's camp on the plain to the west, 645
			const list = camp(c.b, c.g, c.rand, { x: -1500, z: -260, w: 420, d: 300, rot: 0.08, cloth: 'vermilion', ok: (x, z) => c.clear(x, z, 4) });
			c.root.add(tents(c.p, list));
			c.labels.push({ id: 'camp', en: 'Tang camp', ko: '당군 진영', at: [-1500, YD.plain + 30, -260], status: 'recorded', note: 'Taizong fills the moat and fires the town in a south wind, 645' });
			c.labels.push({ id: 'taizi', en: 'The Taizi', ko: '태자하', at: [600, YD.water + 18, 640], status: 'survey', note: 'A braided river of channels and sandbars; the Liao crossing lies west' });
		},
		views: (c) => [
			{ id: 'board', en: 'Over the braided river', ko: '갈래 강 위에서', pos: [420, YD.water + 24, 600], target: [200, YD.plain + 12, 190], fov: 42 },
			{ id: 'city', en: 'Inside the walls', ko: '성안', pos: [260, YD.plain + 70, 60], target: [YD_PALACE.x, YD.plain, YD_PALACE.z], fov: 46 },
			{ id: 'camp', en: 'From the Tang camp', ko: '당군 진영에서', pos: [-1260, YD.plain + 24, -180], target: [-550, YD.plain + 10, -220], fov: 40 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3600, 600], target: [0, 0, 0], fov: 40 },
			{ id: 'east', en: 'From the eastern hills', ko: '동쪽 산에서', pos: [2600, c.g.height(2600, -400) + 60, -400], target: [0, YD.plain, -200], fov: 40 }
		],
		mist: [
			{ y: YD.water + 1.2, opacity: 0.26 },
			{ y: YD.plain + 6, opacity: 0.1 }
		],
		center: [0, 0],
		radius: 1500,
		haze: '#cfd6d8',
		water: { color: '#55705f', roughness: 0.3, metalness: 0.02 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 404);
			garrison(c, folk, YD.wallH - 1, 34);
			folk.audience(YD_PALACE.x, YD_PALACE.z - 24, 0, { near: 14, far: 44, n: 5 });
			return {
				kingdom: 'goguryeo',
				walk: [
					[200, 200],
					[120, 0],
					[40, -300],
					[YD_PALACE.x, YD_PALACE.z + 90]
				],
				door: [YD_PALACE.x, YD_PALACE.z - 10],
				river: reach(TAIZI, 0, 560, 1800),
				bank: 160,
				waterY: YD.water + 0.3,
				height: c.g.height,
				seed: 404,
				people: 30,
				boats: 4,
				boat: 1,
				folk
			};
		}
	});
}
