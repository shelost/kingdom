import { Region, rect, distanceToPath, type P2 } from './geo';
import { at, box, hall, rampart, tents, type HallSpec } from './kit';
import { contourRing, gridTown } from './common';
import { camp, outwardOf } from './fortress';
import { buildRecipe, type RecipeCtx } from './recipe';
import { reach } from './life';
import { Folk } from './people';
import type { BuildOptions, SiteBuild } from './types';

/*
 * Goguryeo's corner fortresses: Yodong faces west over the Liao, Buyeo Fortress keeps the north
 * steppe at the head of the thousand-li wall, and Hanseong on the Han is the southern seat that
 * Silla now holds. Chek (east) and Pyongyang (centre) have their own builders.
 */

const RED_HALL: HallSpec = { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 5, base: 1.4, steps: ['s'], roof: { chimi: true, tile: 'tileRed' } };
const RED_WING: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.7, front: 'doors', back: 'red', sides: 'red', roof: { tile: 'tileRed' } };

/** Guards along every wall walk and at every gate of a recipe site. */
function garrison(c: RecipeCtx, folk: Folk, top: number, every: number): void {
	for (const w of c.walls) {
		const out = outwardOf(w.ring);
		folk.wall(w.ring, w.kind === 'earth' ? w.h * 0.85 : top, every, { closed: true, outward: out, t: w.t ?? 4.6 });
	}
}

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

/* ------------------------------------------------------------------ Buyeo Fortress (north) */

const BF = { plain: 140, water: 134, bed: 128 };
/** A slow steppe river looping round the fortress rise, running south-west. */
const BF_RIVER: P2[] = [
	[3600, -3000],
	[2200, -1700],
	[1300, -1500],
	[900, -800],
	[1200, -100],
	[800, 600],
	[-200, 900],
	[-1100, 700],
	[-1700, 1400],
	[-2600, 2600],
	[-4600, 3400]
];
/** The thousand-li wall, heading south from the fortress to the sea. */
const LONG_WALL: P2[] = [
	[-140, 420],
	[-300, 1300],
	[-180, 2300],
	[-520, 3400],
	[-460, 4600],
	[-800, 6000]
];

export function buildBuyeoFort(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'buyeofort',
		seed: 631,
		near: { minX: -2200, maxX: 2400, minZ: -2000, maxZ: 2600 },
		cell: 9,
		plain: BF.plain,
		roll: 7,
		palette: { redTiles: true },
		mountains: [
			{ x: -6200, z: -3800, rx: 3600, rz: 3000, h: 420, seed: 2.6 },
			{ x: 6800, z: -5200, rx: 3800, rz: 2800, h: 360, seed: 3.3 }
		],
		range: { horizon: { x: 0, z: 0, r: 8000, h: 260 } },
		hills: [{ x: 0, z: 0, rx: 520, rz: 440, h: 38, seed: 5.1, power: 1.3, top: 30 }],
		rivers: [{ path: BF_RIVER, half: 70, water: BF.water, bed: BF.bed }],
		look: {
			fields: ['#a9ad6a', '#b9b674', '#9da35f', '#c4bb7f', '#b0a96c'],
			forest: ['#77834e', '#6b7a49'],
			rock: '#8b8270',
			bed: '#8d8668',
			bank: '#cfc49c',
			top: '#a39c72',
			canopy: 0.3
		},
		walls: (c) => [
			{
				ring: contourRing(c.g.height, 0, 0, BF.plain + 24, 640, 72),
				kind: 'earth',
				h: 7,
				t: 6,
				cloth: 'wallRed',
				every: 48,
				gates: [
					{ near: [-140, 420], munru: { block: { w: 22, d: 11, h: 7, arch: 5, stone: 'courses' }, red: true, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 } },
					{ near: [460, -40], munru: { block: { w: 20, d: 10, h: 6.4, arch: 4.6 }, red: true, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4 } }
				]
			}
		],
		courts: [
			{
				x: 0,
				z: -60,
				w: 170,
				d: 150,
				y: BF.plain + 30,
				pave: 'earth',
				main: RED_HALL,
				wings: RED_WING,
				label: { id: 'hall', en: 'Northern command', ko: '북부 사령', status: 'placed', note: 'The halls on the rise are placed' }
			}
		],
		hamlets: [
			{ x: 900, z: 300, r: 200, n: 16, thatch: 0.95 },
			{ x: -900, z: -500, r: 180, n: 12, thatch: 0.95 },
			{ x: -400, z: 1500, r: 160, n: 10, thatch: 0.95 }
		],
		trees: { n: 1200, kinds: ['broad', 'pine'], min: 20 },
		grass: { n: 26000, box: { minX: -1800, maxX: 1800, minZ: -1600, maxZ: 2200 } },
		extra: (c) => {
			// the long wall: an earthen bank with beacon towers every half kilometre
			rampart(
				c.b,
				LONG_WALL,
				[
					[-12, 0.2],
					[-3.5, 4.6],
					[0, 5.2],
					[3.5, 4.6],
					[12, 0.2]
				],
				c.g.height,
				{ closed: false, step: 8, slope: 'rampart', top: 'path' }
			);
			const beacon = (x: number, z: number) => {
				const y = c.g.height(x, z);
				box(c.b, 'courses', at(x, y, z), 0, 2.2, 0, 6, 4.4, 6, { bevel: 0.2 });
				hall(c.b, at(x, y + 4.4, z), { bays: [3.2], depth: [3.2], colH: 2.6, base: 0.2, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 2.2, tile: 'tileRed' } });
				c.b.lamps.push([x, y + 6.4, z]);
				c.taken.add(x, z, 10, 10);
			};
			for (let d = 600; d < 5600; d += 560) {
				let walked = 0;
				for (let i = 1; i < LONG_WALL.length; i++) {
					const [ax, az] = LONG_WALL[i - 1];
					const [bx, bz] = LONG_WALL[i];
					const seg = Math.hypot(bx - ax, bz - az);
					if (walked + seg >= d) {
						const t = (d - walked) / seg;
						beacon(ax + (bx - ax) * t + 14, az + (bz - az) * t);
						break;
					}
					walked += seg;
				}
			}
			c.labels.push({ id: 'longwall', en: 'The thousand-li wall', ko: '천리장성', at: [-300, BF.plain + 20, 1300], status: 'recorded', note: 'Begun 631, from Buyeo Fortress south to the sea; its line here is schematic' });
		},
		views: () => [
			{ id: 'steppe', en: 'Across the steppe', ko: '초원 너머', pos: [1300, BF.plain + 40, 1300], target: [0, BF.plain + 24, 0], fov: 42 },
			{ id: 'gate', en: 'South gate', ko: '남문', pos: [-80, BF.plain + 14, 700], target: [-140, BF.plain + 30, 420], fov: 46 },
			{ id: 'wall', en: 'Along the long wall', ko: '장성을 따라', pos: [-60, BF.plain + 30, 2600], target: [-200, BF.plain + 20, 600], fov: 44 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, BF.plain + 3800, 500], target: [0, 0, 300], fov: 40 }
		],
		mist: [
			{ y: BF.water + 1.4, opacity: 0.22 },
			{ y: BF.plain + 10, opacity: 0.08 }
		],
		center: [0, 300],
		radius: 1500,
		haze: '#d7d8cf',
		water: { color: '#4f6658', roughness: 0.3 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 631);
			garrison(c, folk, 6, 40);
			folk.knot(['rider', 'rider', 'guard'], 300, 760, 30, 9);
			folk.walk(['rider'], LONG_WALL.slice(0, 3), 6, { lane: 3, speed: 1.6 });
			return {
				kingdom: 'goguryeo',
				walk: [
					[-140, 420],
					[-60, 200],
					[0, 20]
				],
				door: [0, -70],
				river: reach(BF_RIVER, 0, 0, 1700),
				bank: 80,
				waterY: BF.water + 0.3,
				height: c.g.height,
				seed: 631,
				people: 22,
				boats: 2,
				boat: 0.5,
				folk
			};
		}
	});
}

/* ------------------------------------------------------------------ Hanseong (south, Silla's) */

const HS = { plain: 14, water: 4, bed: -4, top: 140 };
/** The Han, wide and slow, running west below the ridge. */
const HAN: P2[] = [
	[5600, -300],
	[3000, 300],
	[1100, 640],
	[-800, 700],
	[-2600, 520],
	[-4400, 820],
	[-6400, 1300]
];

export function buildHansung(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'hansung',
		seed: 553,
		near: { minX: -2400, maxX: 2400, minZ: -2400, maxZ: 1800 },
		cell: 7,
		plain: HS.plain,
		mountains: [
			// Bukhansan's granite peaks to the north-west, ranges behind
			{ x: -2600, z: -3200, rx: 1800, rz: 1500, h: 760, seed: 1.9 },
			{ x: 600, z: -3600, rx: 2000, rz: 1300, h: 520, seed: 2.7 },
			{ x: 3600, z: -2600, rx: 1800, rz: 1600, h: 460, seed: 3.5 },
			{ x: -1200, z: 3600, rx: 2600, rz: 1500, h: 380, seed: 4.6 },
			{ x: 3200, z: 3400, rx: 2000, rz: 1600, h: 340, seed: 5.2 }
		],
		hills: [{ x: 0, z: -80, rx: 420, rz: 240, h: 230, seed: 6.1, power: 0.75, top: HS.top }],
		rivers: [{ path: HAN, half: 360, water: HS.water, bed: HS.bed }],
		look: {
			fields: ['#8fae5a', '#9cb662', '#87a855', '#a7bb6a'],
			forest: ['#4a6b3a', '#557540', '#44653a', '#5e7f48'],
			rock: '#8c8a84',
			bed: '#7d7a64',
			bank: '#d6cca8',
			top: '#a49d7c'
		},
		walls: (c) => [
			{
				ring: contourRing(c.g.height, 0, -80, HS.plain + HS.top - 10, 480, 80),
				h: 5.5,
				t: 4.4,
				cloth: 'blue',
				every: 26,
				torches: 50,
				gates: [{ near: [0, 120], munru: { block: { w: 18, d: 9, h: 6.4, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4 } }]
			}
		],
		courts: [
			{
				x: 0,
				z: -90,
				w: 120,
				d: 100,
				pave: 'earth',
				main: { bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.8, 4, 3.8], colH: 4.6, base: 1.2, steps: ['s'], roof: { chimi: true } },
				wings: { bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.4, base: 0.6 },
				label: { id: 'hall', en: 'Garrison hall', ko: '수비 관아', status: 'placed', note: 'A Silla hall where Goguryeo’s stood; placed' }
			}
		],
		hamlets: [
			{ x: 900, z: 260, r: 200, n: 18, thatch: 0.85 },
			{ x: -1100, z: 200, r: 220, n: 16, thatch: 0.85 }
		],
		trees: { n: 9000, kinds: ['pine', 'pine', 'broad', 'maple'], min: 10 },
		grass: { n: 10000, box: { minX: -700, maxX: 700, minZ: -500, maxZ: 500 } },
		extra: (c) => {
			c.road(
				[
					[0, 125],
					[60, 260],
					[200, 420]
				],
				6
			);
			c.labels.push({ id: 'han', en: 'The Han', ko: '한강', at: [0, HS.water + 20, 760], status: 'survey', note: 'Goguryeo’s from 475; Silla’s from 553' });
			c.labels.push({ id: 'bukhan', en: 'Bukhansan', ko: '북한산', at: [-2600, 820, -3200], status: 'survey', note: 'The granite peaks behind the river' });
		},
		views: () => [
			{ id: 'river', en: 'From the Han', ko: '한강에서', pos: [300, HS.water + 18, 760], target: [0, HS.plain + HS.top, -40], fov: 42 },
			{ id: 'gate', en: 'The gate', ko: '성문', pos: [60, HS.plain + HS.top - 30, 260], target: [0, HS.plain + HS.top, 110], fov: 46 },
			{ id: 'north', en: 'Towards Bukhansan', ko: '북한산 쪽', pos: [200, HS.plain + HS.top + 30, 60], target: [-2600, 500, -3200], fov: 44 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3400, 600], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: HS.water + 1.4, opacity: 0.3 },
			{ y: HS.plain + 30, opacity: 0.1 }
		],
		center: [0, 100],
		radius: 1200,
		haze: '#ccd8de',
		water: { color: '#4b6a64', roughness: 0.28 },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 553);
			garrison(c, folk, 4.5, 26);
			return {
				kingdom: 'silla',
				walk: [
					[0, 110],
					[0, -20],
					[0, -60]
				],
				door: [0, -100],
				river: reach(HAN, 0, 700, 1800),
				bank: 380,
				waterY: HS.water + 0.3,
				height: c.g.height,
				seed: 553,
				people: 16,
				boats: 4,
				boat: 1,
				folk
			};
		}
	});
}
