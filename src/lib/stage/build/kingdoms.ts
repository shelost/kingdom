import * as THREE from 'three';
import { blob, type P2 } from './geo';
import { at, box, hall, tower, stoneLantern, type Builder } from './kit';
import { contourRing } from './common';
import { buildRecipe } from './recipe';
import { reach } from './life';
import { Folk } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The old kingdoms the chronicle visits before (or beside) the three: Golden Gaya by its bay,
 * Buyeo on its rock, Jolbon on Onyeosan's mesa, and the Han commandery of Nakrang with the drum
 * that beats by itself.
 */

/* ------------------------------------------------------------------ Golden Gaya */

const GY = { plain: 8, sea: 2, floor: -12 };
/** The old bay came far inland: its shore line, south of the palace. */
const gayaShore = (x: number) => 320 + 140 * Math.sin(x / 640) + 60 * Math.sin(x / 210 + 1.3);
const HAEBAN: P2[] = [
	[-380, -1700],
	[-300, -900],
	[-240, -300],
	[-200, 200],
	[-160, 600]
];
const GY_PALACE = { x: 120, z: 40 };

export function buildGeumgwan(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'geumgwan',
		seed: 42,
		near: { minX: -1800, maxX: 1800, minZ: -1800, maxZ: 1400 },
		cell: 7,
		plain: GY.plain,
		mountains: [
			{ x: -1800, z: -2600, rx: 1800, rz: 1300, h: 560, seed: 1.1 },
			{ x: 2200, z: -2200, rx: 1600, rz: 1400, h: 480, seed: 2.4 },
			{ x: 4200, z: 1200, rx: 1800, rz: 1600, h: 420, seed: 3.2 },
			{ x: -4200, z: 900, rx: 2000, rz: 1700, h: 380, seed: 4.1 }
		],
		hills: [
			// Gujibong, where the golden box came down, and Bunsan with its fort to the north-east
			{ x: -60, z: -620, rx: 220, rz: 180, h: 58, seed: 5.5, power: 1 },
			{ x: 900, z: -560, rx: 320, rz: 280, h: 170, seed: 6.3 }
		],
		rivers: [{ path: HAEBAN, half: 26, water: GY.sea + 1.4, bed: GY.sea - 3 }],
		sea: {
			level: GY.sea,
			floor: GY.floor,
			mask: (x, z) => (z - gayaShore(x)) / 160,
			box: { minX: -9000, maxX: 9000, minZ: 120, maxZ: 9000 }
		},
		look: {
			fields: ['#8fb15b', '#9bb863', '#86a956', '#a6bd6c'],
			forest: ['#4b6c3b', '#567641', '#45663a'],
			rock: '#857f72',
			bed: '#7e7a63',
			bank: '#d4caa5',
			sand: '#ddd1aa'
		},
		walls: () => [
			{
				ring: blob(GY_PALACE.x, GY_PALACE.z, 260, 42, 20, 0.12),
				kind: 'earth',
				h: 6,
				cloth: 'purple',
				every: 34,
				gates: [{ near: [GY_PALACE.x, GY_PALACE.z + 260], munru: { block: { w: 18, d: 9, h: 5.6, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4 } }]
			}
		],
		courts: [
			{
				...GY_PALACE,
				w: 180,
				d: 150,
				pave: 'gravel',
				main: { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 5, base: 1.6, steps: ['s'], roof: { chimi: true } },
				wings: { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.7 },
				label: { id: 'palace', en: 'Suro’s palace', ko: '수로왕궁', status: 'fictional', note: 'Walled courts and corner towers after the board' }
			}
		],
		hamlets: [
			{ x: -700, z: 0, r: 220, n: 18, thatch: 0.7 },
			{ x: 700, z: 120, r: 200, n: 14, thatch: 0.7 }
		],
		trees: { n: 8000, kinds: ['pine', 'broad', 'broad'], min: 12 },
		grass: { n: 9000, box: { minX: -400, maxX: 600, minZ: -400, maxZ: 400 } },
		extra: (c) => {
			// corner towers on the palace court, as on the board
			for (const sx of [-1, 1]) {
				for (const sz of [-1, 1]) {
					const x = GY_PALACE.x + sx * 90;
					const z = GY_PALACE.z + sz * 75;
					const y = c.g.height(x, z);
					tower(c.b, at(x, y, z), { bays: [3.2, 3.2], depth: [3.2, 3.2], colH: 3.6, base: 1, front: 'wall', back: 'wall', sides: 'wall' }, { bays: [2.8, 2.8], depth: [2.8, 2.8], colH: 2.8, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 2.6 } });
				}
			}
			// the landing where the red sail came in
			const lx = GY_PALACE.x + 40;
			const lz = gayaShore(lx) + 10;
			box(c.b, 'wood', at(lx, GY.sea + 0.8, lz + 30), 0, 0, 0, 6, 0.4, 70);
			c.labels.push({ id: 'gujibong', en: 'Gujibong', ko: '구지봉', at: [-60, GY.plain + 80, -620], status: 'recorded', note: 'Where Suro came down in a golden box' });
			c.labels.push({ id: 'bay', en: 'The old bay', ko: '옛 김해만', at: [lx, GY.sea + 20, lz + 160], status: 'survey', note: 'The sea reached far inland then; Heo Hwang-ok lands here under a red sail' });
		},
		views: () => [
			{ id: 'bay', en: 'From the bay', ko: '바다에서', pos: [GY_PALACE.x + 80, GY.sea + 22, gayaShore(GY_PALACE.x) + 420], target: [GY_PALACE.x, GY.plain + 10, GY_PALACE.z], fov: 42 },
			{ id: 'palace', en: 'Palace court', ko: '궁궐 마당', pos: [GY_PALACE.x + 70, GY.plain + 40, GY_PALACE.z + 140], target: [GY_PALACE.x, GY.plain + 6, GY_PALACE.z - 20], fov: 46 },
			{ id: 'gujibong', en: 'From Gujibong', ko: '구지봉에서', pos: [-60, GY.plain + 70, -600], target: [GY_PALACE.x, GY.plain, 200], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3000, 600], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: GY.sea + 1.2, opacity: 0.34 },
			{ y: GY.plain + 8, opacity: 0.12 }
		],
		center: [0, 0],
		radius: 1200,
		haze: '#cdd8dc',
		water: { color: '#3f6470', roughness: 0.22, metalness: 0.03 },
		life: (c) => {
			const folk = new Folk('gaya', c.g.height, 42);
			folk.audience(GY_PALACE.x, GY_PALACE.z - 22, 0, { near: 12, far: 40, n: 5 });
			const fleet = new Fleet(GY.sea + 0.05, 'gaya', 42);
			fleet.moor('ayuta', GY_PALACE.x + 52, gayaShore(GY_PALACE.x + 40) + 70, Math.PI / 2);
			fleet.moor('skiff', GY_PALACE.x - 30, gayaShore(GY_PALACE.x - 30) + 40, 0.4);
			fleet.moor('ferry', GY_PALACE.x + 140, gayaShore(GY_PALACE.x + 140) + 60, 2.1);
			return {
				kingdom: 'gaya',
				walk: [
					[GY_PALACE.x, GY_PALACE.z + 250],
					[GY_PALACE.x, GY_PALACE.z + 100],
					[GY_PALACE.x, GY_PALACE.z + 40]
				],
				door: [GY_PALACE.x, GY_PALACE.z - 22],
				height: c.g.height,
				seed: 42,
				people: 22,
				folk,
				fleet
			};
		}
	});
}

/* ------------------------------------------------------------------ Buyeo (the kingdom) */

const BY = { plain: 120, water: 114, bed: 107, top: 74 };
/** The river winding round three sides of the rock. */
const BY_RIVER: P2[] = [
	[2400, -2600],
	[1100, -1300],
	[300, -760],
	[-500, -700],
	[-760, -100],
	[-540, 560],
	[200, 760],
	[900, 1300],
	[1300, 2400],
	[900, 3800]
];

export function buildBuyeo(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'buyeo',
		seed: 40,
		near: { minX: -2000, maxX: 2200, minZ: -2000, maxZ: 2200 },
		cell: 7,
		plain: BY.plain,
		roll: 5,
		mountains: [
			{ x: -3800, z: -2600, rx: 2400, rz: 2000, h: 420, seed: 1.6 },
			{ x: 3800, z: -1800, rx: 2200, rz: 2200, h: 360, seed: 2.9 },
			{ x: -2600, z: 3400, rx: 2600, rz: 1600, h: 300, seed: 3.7 }
		],
		range: { horizon: { x: 0, z: 0, r: 7000, h: 220 } },
		hills: [{ x: 0, z: 0, rx: 420, rz: 360, h: 170, seed: 7.7, power: 0.6, top: BY.top }],
		rivers: [{ path: BY_RIVER, half: 80, water: BY.water, bed: BY.bed }],
		look: {
			fields: ['#a2ad66', '#b1b671', '#97a35e', '#bcbb7c'],
			forest: ['#5a7243', '#64794a', '#50683e'],
			rock: '#7f786c',
			bed: '#8a8466',
			bank: '#cdc39d',
			top: '#a7a07a'
		},
		walls: (c) => [
			{
				ring: contourRing(c.g.height, 0, 0, BY.plain + BY.top - 4, 460, 72),
				h: 4.4,
				t: 3.6,
				cloth: 'white',
				every: 24,
				torches: 40,
				gates: [{ near: [260, 200], munru: { block: { w: 16, d: 8, h: 5, arch: 3.6 }, bays: [3, 3.6, 3], depth: [2.8, 2.8], colH: 3.2, tile: 'thatch' } }]
			}
		],
		courts: [
			{
				x: -30,
				z: -40,
				w: 150,
				d: 130,
				pave: 'earth',
				main: { bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.8, 4, 3.8], colH: 4.6, base: 1.2, steps: ['s'], roof: { chimi: true } },
				wings: { bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.2, base: 0.6, roof: { tile: 'thatch' } },
				label: { id: 'palace', en: 'Geumwa’s palace', ko: '금와왕궁', status: 'fictional', note: 'Tile hall with thatched wings on the rock, after the boards' }
			}
		],
		hamlets: [
			{ x: 120, z: 120, r: 120, n: 12, thatch: 0.85 },
			{ x: 640, z: 380, r: 220, n: 18, thatch: 0.95 },
			{ x: 520, z: -420, r: 200, n: 14, thatch: 0.95 }
		],
		trees: { n: 5000, kinds: ['broad', 'pine', 'broad'], min: 14 },
		grass: { n: 14000, box: { minX: -1200, maxX: 1400, minZ: -1200, maxZ: 1400 } },
		extra: (c) => {
			c.road(
				[
					[260, 205],
					[420, 300],
					[640, 380],
					[900, 560]
				],
				5
			);
			c.labels.push({ id: 'rock', en: 'The rock', ko: '바위 언덕', at: [0, BY.plain + BY.top + 30, 0], status: 'fictional', note: 'The town on the great rock follows the board' });
			c.labels.push({ id: 'river', en: 'Where Geumwa found Yuhwa', ko: '유화를 만난 강가', at: [-700, BY.water + 14, -100], status: 'fictional' });
		},
		views: () => [
			{ id: 'rock', en: 'The rock town', ko: '바위 마을', pos: [900, BY.plain + 50, 700], target: [0, BY.plain + BY.top, 0], fov: 42 },
			{ id: 'yard', en: 'Palace yard', ko: '궁 마당', pos: [30, BY.plain + BY.top + 22, 90], target: [-30, BY.plain + BY.top + 4, -60], fov: 48 },
			{ id: 'river', en: 'From the river', ko: '강에서', pos: [-820, BY.water + 10, 200], target: [0, BY.plain + BY.top, 0], fov: 44 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, BY.plain + 3200, 500], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: BY.water + 1.2, opacity: 0.3 },
			{ y: BY.plain + 10, opacity: 0.12 }
		],
		center: [0, 0],
		radius: 1200,
		haze: '#d3d6d2',
		water: { color: '#4f675c', roughness: 0.3 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 40);
			folk.audience(-30, -60, 0, { near: 12, far: 36, n: 4 });
			folk.knot(['woman', 'man', 'woman'], -720, -80, 26, 7, { face: [-760, -100] });
			return {
				kingdom: 'goguryeo',
				walk: [
					[900, 560],
					[640, 380],
					[260, 205],
					[-30, 10]
				],
				door: [-30, -60],
				river: reach(BY_RIVER, 0, 0, 1400),
				bank: 96,
				waterY: BY.water + 0.3,
				height: c.g.height,
				seed: 40,
				people: 20,
				boats: 2,
				boat: 0.5,
				folk
			};
		}
	});
}

/* ------------------------------------------------------------------ Jolbon (Onyeosan) */

const JB = { plain: 30, water: 24, bed: 17, top: 210 };
const HUN: P2[] = [
	[2600, -3000],
	[1500, -1500],
	[900, -200],
	[1150, 900],
	[300, 1700],
	[-1400, 2000],
	[-3600, 2700]
];

export function buildJolbon(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'jolbon',
		seed: 37,
		near: { minX: -1800, maxX: 2200, minZ: -2200, maxZ: 2400 },
		cell: 7,
		plain: JB.plain,
		roll: 3,
		mountains: [
			{ x: -2600, z: -1400, rx: 1600, rz: 1800, h: 640, seed: 1.3 },
			{ x: 3200, z: -2200, rx: 1500, rz: 1500, h: 700, seed: 2.6 },
			{ x: 3400, z: 1800, rx: 1600, rz: 1400, h: 560, seed: 3.4 },
			{ x: -2400, z: 3400, rx: 2000, rz: 1300, h: 520, seed: 4.8 }
		],
		range: { horizon: { x: 0, z: 0, r: 5000, h: 520 } },
		// the flat-topped mountain: cliffs all round, the plateau long north–south
		hills: [{ x: 0, z: -200, rx: 300, rz: 760, h: 520, seed: 8.2, power: 0.6, top: JB.top }],
		rivers: [{ path: HUN, half: 110, water: JB.water, bed: JB.bed }],
		look: {
			fields: ['#8fac58', '#9bb562', '#86a554', '#a4b96a'],
			forest: ['#466839', '#517341', '#3f6036', '#5a7a46'],
			rock: '#8a7f70',
			bed: '#827c62',
			bank: '#d2c7a0',
			top: '#8f9a5c'
		},
		walls: (c) => [
			{
				ring: contourRing(c.g.height, 0, -200, JB.plain + JB.top - 6, 820, 96),
				h: 4.6,
				t: 4,
				cloth: 'orange',
				every: 32,
				torches: 60,
				gates: [{ near: [0, 560], munru: { block: { w: 18, d: 9, h: 5.8, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4, tile: 'thatch' } }]
			}
		],
		courts: [
			{
				x: 0,
				z: -120,
				w: 140,
				d: 120,
				pave: 'earth',
				main: { bays: [3.6, 4.2, 4.6, 4.2, 3.6], depth: [3.6, 3.8, 3.6], colH: 4.2, base: 1, steps: ['s'], roof: { tile: 'thatch' } },
				wings: { bays: [3, 3.4, 3], depth: [2.8, 2.8], colH: 3, base: 0.5, roof: { tile: 'thatch' } },
				label: { id: 'hall', en: 'Jumong’s first hall', ko: '주몽의 첫 궁', status: 'placed', note: 'A thatched hall on the mesa; the rim wall is placed' }
			}
		],
		hamlets: [
			{ x: 700, z: 700, r: 220, n: 20, thatch: 0.95 },
			{ x: 300, z: 1200, r: 180, n: 14, thatch: 0.95 },
			{ x: 620, z: -600, r: 160, n: 10, thatch: 0.95 }
		],
		trees: { n: 12000, kinds: ['pine', 'broad', 'maple', 'pine'], min: 10 },
		grass: { n: 8000, box: { minX: -220, maxX: 220, minZ: -700, maxZ: 500 } },
		extra: (c) => {
			c.road(
				[
					[0, 565],
					[180, 760],
					[420, 860],
					[700, 700]
				],
				5
			);
			c.labels.push({ id: 'onyeo', en: 'Onyeosan', ko: '오녀산', at: [0, JB.plain + JB.top + 40, -400], status: 'survey', note: 'The cliff-ringed mesa above the Hun river at Huanren' });
			c.labels.push({ id: 'hun', en: 'The Hun', ko: '비류수', at: [1100, JB.water + 14, 700], status: 'survey' });
		},
		views: () => [
			{ id: 'mesa', en: 'Under the cliffs', ko: '절벽 아래', pos: [1400, JB.plain + 60, 900], target: [0, JB.plain + JB.top - 20, -200], fov: 42 },
			{ id: 'rim', en: 'From the rim', ko: '정상 끝에서', pos: [60, JB.plain + JB.top + 10, 520], target: [900, JB.water, 800], fov: 50 },
			{ id: 'yard', en: 'The first hall', ko: '첫 궁', pos: [40, JB.plain + JB.top + 18, -20], target: [0, JB.plain + JB.top + 4, -150], fov: 48 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3600, 600], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: JB.water + 2, opacity: 0.32 },
			{ y: JB.plain + 70, opacity: 0.12 }
		],
		center: [200, 200],
		radius: 1300,
		haze: '#cbd6d8',
		water: { color: '#4d6a5e', roughness: 0.3 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 37);
			folk.audience(0, -140, 0, { near: 12, far: 34, n: 4 });
			folk.knot(['archer', 'guard', 'man'], 40, 480, 24, 6);
			return {
				kingdom: 'goguryeo',
				walk: [
					[700, 700],
					[420, 860],
					[180, 760],
					[0, 565],
					[0, -40]
				],
				door: [0, -140],
				river: reach(HUN, 900, 400, 1500),
				bank: 120,
				waterY: JB.water + 0.3,
				height: c.g.height,
				seed: 37,
				people: 20,
				boats: 2,
				boat: 0.5,
				folk
			};
		}
	});
}

/* ------------------------------------------------------------------ Nakrang */

const NK = { plain: 12, water: 5, bed: -2 };
/** The Daedong, north of the commandery city, running south-west. */
const NK_RIVER: P2[] = [
	[3600, -2600],
	[2000, -1300],
	[900, -640],
	[-300, -560],
	[-1600, -260],
	[-3400, 600],
	[-5400, 1400]
];
const NK_CITY = { x: 0, z: 120 };
const DRUM = { x: 0, z: 160 };

/** The drum that warns: a great barrel drum on its side in a red frame, on a raised platform under an open pavilion. */
function drumPavilion(b: Builder, x: number, y: number, z: number): number {
	box(b, 'courses', at(x, y, z), 0, 0.9, 0, 16, 1.8, 16, { bevel: 0.15 });
	const top = y + 1.8;
	const pav = hall(b, at(x, top, z), { bays: [3.8, 4.4, 3.8], depth: [3.8, 4.4, 3.8], colH: 5.4, base: 0.2, front: 'open', back: 'open', sides: 'open', rail: true, steps: ['s'], roof: { kind: 'pyramid', h: 4.2, chimi: false } });
	const drum = new THREE.CylinderGeometry(1.7, 1.7, 2.6, 24, 1);
	drum.rotateZ(Math.PI / 2);
	const barrel = new THREE.CylinderGeometry(1.86, 1.86, 2.0, 24, 1);
	barrel.rotateZ(Math.PI / 2);
	b.push('white', drum, at(x, top + 3.2, z));
	b.push('burgundy', barrel, at(x, top + 3.2, z));
	for (const sx of [-1, 1]) {
		box(b, 'vermilion', at(x, top, z), sx * 1.75, 2.2, 0, 0.28, 4.4, 0.28);
		box(b, 'vermilion', at(x, top, z), 0, 5.4, 0, 4.2, 0.24, 0.3);
	}
	return 1.8 + pav.ridge;
}

export function buildNakrang(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'nakrang',
		seed: 32,
		near: { minX: -1800, maxX: 1800, minZ: -1900, maxZ: 1500 },
		cell: 7,
		plain: NK.plain,
		mountains: [
			{ x: 2400, z: -2600, rx: 1600, rz: 1300, h: 260, seed: 1.2 },
			{ x: -3600, z: 2800, rx: 2400, rz: 1800, h: 340, seed: 2.3 },
			{ x: 3400, z: 2400, rx: 2000, rz: 1600, h: 300, seed: 3.5 }
		],
		// Moranbong across the river, where Pyongyang will rise
		hills: [{ x: 700, z: -1400, rx: 460, rz: 360, h: 90, seed: 4.4, power: 1 }],
		rivers: [{ path: NK_RIVER, half: 190, water: NK.water, bed: NK.bed }],
		look: {
			fields: ['#8fac5a', '#99b361', '#86a556', '#a3b768'],
			forest: ['#4c6b3b', '#567441', '#466539'],
			rock: '#857f72',
			bed: '#7f7a62',
			bank: '#d1c7a1',
			// the city's packed yard and lanes
			paint: (x, z, _y, _s, n) => (Math.abs(x - NK_CITY.x) < 330 && Math.abs(z - NK_CITY.z) < 280 ? (n > 0 ? '#a69d79' : '#9c9472') : null)
		},
		walls: () => [
			{
				ring: blob(NK_CITY.x, NK_CITY.z, 380, 32, 16, 0.1),
				kind: 'earth',
				h: 8,
				cloth: 'vermilion',
				every: 36,
				torches: 40,
				gates: [
					{ near: [NK_CITY.x, NK_CITY.z + 380], munru: { block: { w: 20, d: 10, h: 7, arch: 4.6 }, bays: [3.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 } },
					{ near: [NK_CITY.x, NK_CITY.z - 380], munru: { block: { w: 18, d: 9, h: 6.6, arch: 4 }, bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 3.4 } }
				]
			}
		],
		courts: [
			{
				x: NK_CITY.x,
				z: NK_CITY.z - 90,
				w: 180,
				d: 120,
				pave: 'paving',
				main: { bays: [4.2, 4.8, 5.2, 4.8, 4.2], depth: [4.2, 4.6, 4.2], colH: 5.4, base: 1.8, tiers: 2, steps: ['s'], roof: { chimi: false } },
				wings: { bays: [3.4, 3.8, 3.8, 3.4], depth: [3, 3], colH: 3.6, base: 0.8 },
				label: { id: 'yamen', en: 'Commandery hall', ko: '낙랑 태수부', status: 'placed', note: 'Han-style hall on a two-step terrace; the walled city follows the south-bank excavation' }
			}
		],
		hamlets: [
			{ x: -180, z: 260, r: 140, n: 18, thatch: 0.2 },
			{ x: 200, z: 300, r: 120, n: 14, thatch: 0.2 },
			{ x: -900, z: 600, r: 200, n: 14, thatch: 0.9 }
		],
		trees: { n: 5000, kinds: ['pine', 'broad'], min: 14 },
		grass: { n: 7000, box: { minX: -1200, maxX: 1200, minZ: -500, maxZ: 1000 } },
		extra: (c) => {
			const y = c.g.height(DRUM.x, DRUM.z);
			const ridge = drumPavilion(c.b, DRUM.x, y, DRUM.z);
			for (const sx of [-1, 1]) stoneLantern(c.b, DRUM.x + sx * 11, y, DRUM.z + 10, 1.2);
			c.taken.add(DRUM.x, DRUM.z, 30, 30);
			c.road(
				[
					[NK_CITY.x, NK_CITY.z + 385],
					[NK_CITY.x, DRUM.z + 20]
				],
				8
			);
			c.labels.push({ id: 'drum', en: 'The drum that warns', ko: '자명고', at: [DRUM.x, y + ridge + 6, DRUM.z], status: 'fictional', note: 'It beats by itself when an enemy comes; the princess cuts it for Hodong' });
			c.labels.push({ id: 'daedong', en: 'The Daedong', ko: '대동강', at: [0, NK.water + 16, -560], status: 'survey', note: 'Pyongyang will rise on the far bank' });
		},
		views: () => [
			{ id: 'drum', en: 'The drum', ko: '자명고', pos: [DRUM.x + 22, NK.plain + 9, DRUM.z + 34], target: [DRUM.x, NK.plain + 5, DRUM.z], fov: 46 },
			{ id: 'gate', en: 'South gate', ko: '남문', pos: [NK_CITY.x + 60, NK.plain + 20, NK_CITY.z + 520], target: [NK_CITY.x, NK.plain + 8, NK_CITY.z + 380], fov: 44 },
			{ id: 'river', en: 'From the Daedong', ko: '대동강에서', pos: [-200, NK.water + 22, -640], target: [NK_CITY.x, NK.plain, NK_CITY.z], fov: 42 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 2800, 500], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: NK.water + 1.4, opacity: 0.34 },
			{ y: NK.plain + 5, opacity: 0.14 }
		],
		center: [0, 0],
		radius: 1100,
		haze: '#c3ccd4',
		water: { color: '#3c5560', roughness: 0.26 },
		life: (c) => {
			const folk = new Folk('tang', c.g.height, 32);
			folk.gate(DRUM.x, DRUM.z + 9, 0, { half: 5 });
			folk.audience(NK_CITY.x, NK_CITY.z - 112, 0, { near: 12, far: 40, n: 5 });
			return {
				kingdom: 'tang',
				walk: [
					[NK_CITY.x, NK_CITY.z + 370],
					[NK_CITY.x, DRUM.z + 24],
					[NK_CITY.x, NK_CITY.z - 40]
				],
				door: [NK_CITY.x, NK_CITY.z - 112],
				river: reach(NK_RIVER, 0, -560, 1500),
				bank: 210,
				waterY: NK.water + 0.3,
				height: c.g.height,
				seed: 32,
				people: 18,
				boats: 3,
				boat: 1,
				folk
			};
		}
	});
}
