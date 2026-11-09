import { blob, chaikin, nearestOnPath, resample, type P2 } from './geo';
import { at, box, hall, tower, cylinder, rampart, type Builder } from './kit';
import { contourRing, Footprints, townBlock } from './common';
import { buildRecipe, type RecipeCtx } from './recipe';
import { RED_HALL, RED_WING } from './corners';
import { bastions, hamlet, outwardOf } from './fortress';
import { reach } from './life';
import { Folk } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The old kingdoms the chronicle visits before (or beside) the three: Golden Gaya by its bay,
 * Buyeo on its rock, and Jolbon on Onyeosan's mesa. Nakrang is an era of the Pyongyang ground.
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
const GY_FORGE = { x: -330, z: 70 };

/** Gaya's iron: clay shaft furnaces, an open bellows shed, and ingots (덩이쇠) stacked for the ships. */
/** Raised post houses (고상가옥) along a bank. The storehouse shape, scaled up into a dwelling. */
function stiltRow(c: RecipeCtx, path: P2[], inland: number): void {
	const line = resample(chaikin(path, 1, false), 16, false);
	for (let i = 1; i < line.length - 1; i++) {
		const [x, z] = line[i];
		const [px, pz] = line[i - 1];
		const dx = line[i + 1][0] - px;
		const dz = line[i + 1][1] - pz;
		const len = Math.hypot(dx, dz) || 1;
		const nx = -dz / len;
		const nz = dx / len;
		const s = i % 2 === 0 ? 1 : -1;
		const hx = x + nx * s * inland;
		const hz = z + nz * s * inland;
		if (c.g.height(hx, hz) < GY.sea + 0.6) continue;
		if (!c.clear(hx, hz, 6)) continue;
		const rot = Math.atan2(dx, dz);
		c.town.put('store', hx, c.g.height(hx, hz), hz, rot, 7.4, 5.8, 8.4);
		const bx = hx + nx * s * 16;
		const bz = hz + nz * s * 16;
		if (c.clear(bx, bz, 5)) c.town.put('thatch', bx, c.g.height(bx, bz), bz, rot + 0.3, 8.2, 5.6, 4.2);
		c.taken.add(hx, hz, 12, 10);
	}
}

function ironWorks(b: Builder, height: (x: number, z: number) => number, x: number, z: number): void {
	const y = height(x, z);
	box(b, 'earth', at(x, y, z), 0, 0.05, 0, 56, 0.1, 40);
	for (const [dx, dz] of [[-16, -8], [-4, -10], [8, -8]] as const) {
		const fy = height(x + dx, z + dz);
		cylinder(b, 'earth', at(x + dx, fy, z + dz), 0, 1.6, 0, 1.1, 1.6, 3.2, 10);
		cylinder(b, 'dark', at(x + dx, fy, z + dz), 0, 3.25, 0, 0.7, 0.9, 0.12, 10);
		box(b, 'dark', at(x + dx, fy, z + dz), 0, 0.5, 1.5, 0.8, 0.8, 0.4);
	}
	hall(b, at(x + 18, y, z - 6), { bays: [3.6, 3.6], depth: [3.4], colH: 2.8, base: 0.3, front: 'open', back: 'wall', sides: 'open', roof: { tile: 'thatch', kind: 'gable', chimi: false } });
	// ingots: flat axe-shaped bars, stacked crosswise in bundles
	for (let k = 0; k < 6; k++) {
		const ix = x - 14 + k * 5;
		const iz = z + 10;
		for (let layer = 0; layer < 4; layer++) {
			for (let j = 0; j < 3; j++) {
				const rot = layer % 2 ? Math.PI / 2 : 0;
				const off = (j - 1) * 0.42;
				box(b, 'dark', at(ix + (rot ? off : 0), height(ix, iz) + 0.08 + layer * 0.1, iz + (rot ? 0 : off), rot), 0, 0, 0, 1.3, 0.08, 0.32);
			}
		}
	}
}

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
			{ x: -700, z: 0, r: 240, n: 32, thatch: 0.65 },
			{ x: 700, z: 120, r: 220, n: 26, thatch: 0.65 },
			{ x: -80, z: 220, r: 200, n: 20, thatch: 0.7 },
			{ x: 420, z: -40, r: 160, n: 14, thatch: 0.55 }
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
			ironWorks(c.b, c.g.height, GY_FORGE.x, GY_FORGE.z);
			c.taken.add(GY_FORGE.x, GY_FORGE.z, 64, 48);
			stiltRow(c, HAEBAN, 52);
			const shore: P2[] = [];
			for (let x = -640; x <= 820; x += 70) shore.push([x, gayaShore(x) - 36]);
			stiltRow(c, shore, 28);
			c.road(
				[
					[GY_FORGE.x + 30, GY_FORGE.z],
					[GY_PALACE.x - 120, GY_PALACE.z + 200],
					[lx, lz - 20]
				],
				4
			);
			c.labels.push({ id: 'iron', en: 'Iron works', ko: '철 생산지', at: [GY_FORGE.x, c.g.height(GY_FORGE.x, GY_FORGE.z) + 12, GY_FORGE.z], status: 'excavated', note: 'Gaya smelted iron and shipped it as flat ingots to Nakrang, Wa and the other kingdoms; furnaces as at Yeocha-dong' });
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
			folk.stand('noble', GY_PALACE.x, GY_PALACE.z - 14, 0);
			folk.knot(['man', 'man', 'woman'], GY_FORGE.x, GY_FORGE.z, 18, 8, { face: [GY_FORGE.x - 4, GY_FORGE.z - 9] });
			folk.knot(['cavalry', 'cavalry', 'guard'], GY_PALACE.x - 40, GY_PALACE.z + 300, 18, 6);
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
				people: 36,
				folk,
				fleet
			};
		},
		wardrobe: (c) => ({
			dress: 'gaya',
			x: GY_PALACE.x - 70,
			z: GY_PALACE.z + 150,
			y: c.g.height(GY_PALACE.x - 70, GY_PALACE.z + 150),
			note: 'Gaya dress follows the Baekje–Gaya chart: white for commoners, purple for the house. Soldiers wear the tall riveted cone helm; the horse armour is after the Haman finds'
		})
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

/** Goguryeo's thousand-li wall, out of the east gate and south to the sea (schematic). */
const LONG_WALL: P2[] = [
	[560, 150],
	[1200, 320],
	[1700, 900],
	[2000, 2000],
	[1900, 3400],
	[2200, 5200]
];

/** An earthen bank along a line with a beacon tower every `every` metres. */
function longWall(c: RecipeCtx, line: P2[], every: number): void {
	rampart(
		c.b,
		line,
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
	const total = line.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - line[i][0], p[1] - line[i][1]), 0);
	for (let d = every; d < total - 100; d += every) {
		let walked = 0;
		for (let i = 1; i < line.length; i++) {
			const [ax, az] = line[i - 1];
			const [bx, bz] = line[i];
			const seg = Math.hypot(bx - ax, bz - az);
			if (walked + seg < d) {
				walked += seg;
				continue;
			}
			const t = (d - walked) / seg;
			const x = ax + (bx - ax) * t + 14;
			const z = az + (bz - az) * t;
			const y = c.g.height(x, z);
			box(c.b, 'courses', at(x, y, z), 0, 2.2, 0, 6, 4.4, 6, { bevel: 0.2 });
			hall(c.b, at(x, y + 4.4, z), { bays: [3.2], depth: [3.2], colH: 2.6, base: 0.2, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 2.2, tile: 'tileRed' } });
			c.b.lamps.push([x, y + 6.4, z]);
			c.taken.add(x, z, 10, 10);
			break;
		}
	}
}

/**
 * Buyeo on its rock in two eras. Both stand in the scene: Geumwa's white town sinks after 494,
 * Goguryeo's red fortress rises. The thousand-li wall joins from 631.
 */
/** Yuhwa’s house on the riverbank: a small tiled room, a thatched shed, a step and a lamp. Geumwa’s years only. */
function yuhwaHut(c: RecipeCtx, until: number): void {
	const x = -640;
	const z = 30;
	const y = c.g.height(x, z);
	c.b.setEra(undefined, until);
	box(c.b, 'wallStone', at(x, y, z + 5), 0, 0.15, 0, 3.2, 0.3, 1.4);
	box(c.b, 'wallStone', at(x, y, z + 6.6), 0, 0.45, 0, 2.4, 0.3, 1.2);
	hall(c.b, at(x, y, z), { bays: [3.4, 3.6], depth: [3.2], colH: 2.5, base: 0.35, front: 'doors', back: 'wall', sides: 'wall', roof: { tile: 'tile', kind: 'gable', chimi: false } });
	hall(c.b, at(x + 8, y, z - 2, 0.5), { bays: [2.6], depth: [2.4], colH: 2.1, base: 0.15, front: 'open', back: 'wall', sides: 'wall', roof: { tile: 'thatch', kind: 'gable', chimi: false } });
	c.b.lampPost(x + 5, y, z + 4);
	c.town.setEra(undefined, until);
	c.town.put('jars', x - 5, y, z + 2, 0.4, 2.4, 1.6, 1.1);
	c.town.setEra();
	c.b.setEra();
	c.taken.add(x, z, 16, 14);
}

export function buildBuyeo(opts: BuildOptions): SiteBuild {
	const rockGate: P2 = [260, 200];
	const outerGate: P2 = [560, 150];
	const FORT = 494;
	const WALL = 631;
	/** The fortress ring sits partway up the massif, above the old city. */
	const RING = BY.plain + 78;
	const winter = opts.year >= FORT;
	const built = buildRecipe({
		name: 'buyeo',
		seed: 40,
		year: opts.year,
		near: { minX: -2000, maxX: 2200, minZ: -2000, maxZ: 2200 },
		cell: 7,
		plain: BY.plain,
		roll: 5,
		palette: { redTiles: true, snow: winter ? 0.85 : 0 },
		mountains: [
			{ x: -1500, z: -1900, rx: 1100, rz: 900, h: 520, seed: 1.6 },
			{ x: 1700, z: -1100, rx: 1000, rz: 1100, h: 460, seed: 2.9 },
			{ x: -1800, z: 1100, rx: 1200, rz: 800, h: 400, seed: 3.7 },
			{ x: 200, z: -2600, rx: 1600, rz: 700, h: 640, seed: 5.1 }
		],
		range: { horizon: { x: 0, z: 0, r: 7000, h: 280 } },
		hills: [
			{ x: -50, z: -70, rx: 480, rz: 400, h: 260, seed: 7.7, power: 0.85 },
			{ x: -300, z: -480, rx: 220, rz: 180, h: 420, seed: 8.1, power: 1.15 },
			{ x: 560, z: -260, rx: 180, rz: 200, h: 200, seed: 8.4, power: 0.95 },
			{ x: -500, z: 280, rx: 200, rz: 170, h: 180, seed: 8.8, power: 0.9 },
			{ x: 240, z: 500, rx: 190, rz: 150, h: 150, seed: 9.2, power: 0.85 }
		],
		rivers: [{ path: BY_RIVER, half: 80, water: BY.water, bed: BY.bed }],
		look: winter
			? {
					fields: ['#e7eef2', '#dce6eb', '#f4f7f8', '#cdd8de'],
					forest: ['#7e98a1', '#8aab93', '#6d8b94'],
					rock: '#9aa3a8',
					bed: '#8d969c',
					bank: '#d5dee4',
					top: '#f7fafb',
					canopy: 0.4
				}
			: {
					fields: ['#a2ad66', '#b1b671', '#97a35e', '#bcbb7c'],
					forest: ['#5a7243', '#64794a', '#50683e'],
					rock: '#7f786c',
					bed: '#8a8466',
					bank: '#cdc39d',
					top: '#a7a07a',
					canopy: 0.7
				},
		walls: (c) => {
			const crown = contourRing(c.g.height, -40, -50, RING, 520, 72);
			return [
				{
					ring: crown,
					h: 8,
					t: 5.2,
					cloth: 'wallRed',
					every: 28,
					torches: 36,
					era: { from: FORT },
					gates: [{ near: rockGate, munru: { block: { w: 18, d: 10, h: 7, arch: 4.2, stone: 'courses' }, red: true, bays: [3.2, 3.8, 3.2], depth: [3.2, 3.2], colH: 4 } }]
				},
				{
					ring: contourRing(c.g.height, 0, 0, BY.plain + 10, 760, 80),
					kind: 'earth',
					h: 7,
					t: 6,
					cloth: 'wallRed',
					every: 48,
					era: { from: FORT },
					gates: [{ near: outerGate, munru: { block: { w: 22, d: 11, h: 7, arch: 5, stone: 'courses' }, red: true, bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8 } }]
				}
			];
		},
		courts: [
			{
				x: -30,
				z: -40,
				w: 150,
				d: 130,
				pave: 'earth',
				era: { to: FORT },
				main: { bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.8, 4, 3.8], colH: 4.6, base: 1.2, steps: ['s'], roof: { chimi: true } },
				wings: { bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.2, base: 0.6, roof: { tile: 'thatch' } },
				label: { id: 'palace', en: 'Geumwa’s palace', ko: '금와왕궁', status: 'fictional', note: 'Tile hall with thatched wings on the rock, after the boards' }
			},
			{
				x: -30,
				z: -40,
				w: 170,
				d: 150,
				pave: 'earth',
				era: { from: FORT },
				main: RED_HALL,
				wings: RED_WING,
				label: { id: 'hall', en: 'Northern command', ko: '북부 사령', status: 'placed', note: 'Goguryeo’s command on the old Buyeo rock; the halls are placed' }
			}
		],
		hamlets: [
			{ x: -20, z: -10, r: 300, n: 54, thatch: 0.42, rise: 170, era: { to: FORT } },
			{ x: 170, z: 150, r: 190, n: 26, thatch: 0.55, rise: 150, era: { to: FORT } },
			{ x: -190, z: 90, r: 170, n: 20, thatch: 0.65, rise: 140, era: { to: FORT } },
			{ x: 820, z: 280, r: 180, n: 14, thatch: 0.85, era: { from: FORT } }
		],
		trees: { n: 3200, kinds: ['broad', 'pine', 'broad'], min: 20, skip: (x, z) => Math.hypot(x + 30, z) < 460 },
		grass: { n: 14000, box: { minX: -1200, maxX: 1400, minZ: -1200, maxZ: 1400 } },
		extra: (c) => {
			yuhwaHut(c, FORT);
			c.b.setEra(FORT);
			const crown = c.walls.find((w) => w.cloth === 'wallRed' && w.kind !== 'earth')?.ring;
			if (crown && crown.length > 8) bastions(c.b, crown, c.g.height, 70, { h: 9, closed: true, mat: 'wallStone', t: 5.2, outward: outwardOf(crown) });
			c.b.setEra();
			c.road(
				[
					[260, 205],
					[420, 190],
					outerGate,
					[900, 260]
				],
				5
			);
			c.labels.push({ id: 'rock-old', en: 'The rock', ko: '바위 언덕', at: [330, BY.plain + 90, 160], status: 'fictional', note: 'The town climbs the mountain, after the board', era: { to: FORT } });
			c.labels.push({ id: 'river', en: 'Where Geumwa found Yuhwa', ko: '유화를 만난 강가', at: [-640, BY.water + 14, 40], status: 'fictional', era: { to: FORT } });
			c.labels.push({ id: 'rock', en: 'Buyeo Fortress', ko: '부여성', at: [330, BY.plain + 160, 160], status: 'placed', note: 'Goguryeo walled the old mountain town and kept it through the snow', era: { from: FORT } });
			c.b.setEra(WALL);
			const outer = c.walls.find((w) => w.kind === 'earth')?.ring;
			if (outer) {
				const foot = nearestOnPath([...outer, outer[0]], LONG_WALL[0][0], LONG_WALL[0][1] + 180).p;
				longWall(c, [foot, ...LONG_WALL.slice(1)], 560);
			}
			c.labels.push({ id: 'longwall', en: 'The thousand-li wall', ko: '천리장성', at: [1700, BY.plain + 20, 900], status: 'recorded', note: 'Begun 631, from Buyeo Fortress south to the sea; its line here is schematic', era: { from: WALL } });
			c.b.setEra();
		},
		views: () => [
			{ id: 'rock', en: 'The rock town', ko: '바위 마을', pos: [1280, BY.plain + 260, 1180], target: [-80, BY.plain + 140, -160], fov: 40, era: { to: FORT } },
			{ id: 'fort', en: 'Buyeo Fortress', ko: '부여성', pos: [1280, BY.plain + 260, 1180], target: [-80, BY.plain + 140, -160], fov: 40, era: { from: FORT } },
			{ id: 'yard', en: 'Palace yard', ko: '궁 마당', pos: [90, BY.plain + 320, 200], target: [-30, BY.plain + 180, -40], fov: 46 },
			{ id: 'river', en: 'From the river', ko: '강에서', pos: [-1080, BY.water + 36, 260], target: [-200, BY.plain + 160, -200], fov: 42 },
			{ id: 'wall', en: 'Along the long wall', ko: '장성을 따라', pos: [2300, BY.plain + 40, 2200], target: [1500, BY.plain + 10, 700], fov: 44, era: { from: WALL } },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, BY.plain + 3200, 500], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: BY.water + 1.2, opacity: 0.3 },
			{ y: BY.plain + 10, opacity: 0.12 }
		],
		center: [0, 0],
		radius: 1500,
		haze: winter ? '#c9d3db' : '#d3d6d2',
		water: { color: '#4f675c', roughness: 0.3 },
		life: (c) => {
			const folk = new Folk('goguryeo', c.g.height, 40);
			folk.audience(-30, -60, 0, { near: 12, far: 36, n: 4 });
			folk.knot(['guard', 'guard', 'rider'], 260, 200, 14, 5);
			folk.knot(['cavalry', 'cavalry', 'rider', 'guard'], 820, 300, 30, 9);
			folk.walk(['rider'], LONG_WALL.slice(0, 3), 6, { lane: 3, speed: 1.6 });
			folk.stand('noble', -30, -50, 0);
			folk.knot(['woman', 'man', 'woman'], -640, 30, 16, 6, { face: [-700, -20] });
			return {
				kingdom: 'goguryeo',
				walk: [
					[900, 260],
					outerGate,
					[420, 190],
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
		},
		wardrobe: () => ({
			dress: 'goguryeo',
			x: 150,
			z: -150,
			note: 'Buyeo dressed like early Goguryeo in cut but preferred white: lords too wore white robes and trousers at home'
		})
	});
	built.snowFrom = FORT;
	if (opts.year >= FORT) built.weather = { ...built.weather, snow: true };
	return built;
}

/* ------------------------------------------------------------------ Jolbon (Onyeosan) */

const JB = { plain: 30, water: 24, bed: 17, top: 210 };
/** Jumong is voted king. Before this the ground is Tabal's: four thatched quarters and no palace. */
const FOUNDING = -37;
/**
 * The four ka, one quarter each, around the mesa. Wedges meet on the cardinals, so the south
 * road is a boundary and not a street through someone's yard. The crow is Tabal's, at the south foot.
 * Centres sit just outside the cliff (ellipse radius 1.28).
 */
const KA = [
	{ id: 'maga', en: 'The horse ka', ko: '마가', q: 0, note: 'First of the four: the heaviest roof and the most horses' },
	{ id: 'uga', en: 'The cow ka', ko: '우가', q: 1, note: 'The herds. He counts cattle the way the crow counts millet' },
	{ id: 'jeoga', en: 'The pig ka', ko: '저가', q: 2, note: 'Grain and meat. The pens are the winter' },
	{ id: 'guga', en: 'The dog ka', ko: '구가', q: 3, note: 'Oldest of the four. His dogs reach the gate before he does' }
] as const;

/** 0 north-east, then clockwise: south-east, south-west, north-west. */
function quarterOf(x: number, z: number): number {
	const a = Math.atan2(z + 200, x);
	if (a >= -Math.PI / 2 && a < 0) return 0;
	if (a >= 0 && a < Math.PI / 2) return 1;
	if (a >= Math.PI / 2) return 2;
	return 3;
}

/** Ellipse radius of the mesa. Under 1 is the mountain; the cliff falls off in the last sliver. */
function mesaD(x: number, z: number): number {
	return Math.hypot(x / 300, (z + 200) / 760);
}

/** A point on a quarter's diagonal, `d` ellipse-radii out from the mesa centre. */
function quarterAt(q: number, d: number, side = 0): [number, number] {
	const mid = [-Math.PI / 4, Math.PI / 4, (3 * Math.PI) / 4, (-3 * Math.PI) / 4][q];
	const a = mid + side;
	return [Math.cos(a) * 300 * d, -200 + Math.sin(a) * 760 * d];
}

/** Inside one quarter's ring, off the cliff, the roads and the river. `climb` is how far up the foot a house may sit. */
function inQuarter(c: RecipeCtx, x: number, z: number, q: number, climb: number, inner: number, outer: number): boolean {
	const d = mesaD(x, z);
	if (d < inner || d > outer) return false;
	if (quarterOf(x, z) !== q) return false;
	if (c.g.height(x, z) > JB.plain + climb) return false;
	return c.clear(x, z, 2);
}

function quarterHouses(
	c: RecipeCtx,
	q: number,
	inner: number,
	outer: number,
	rings: number,
	per: number,
	r: number,
	thatch: number,
	climb: number,
	taken: Footprints,
	shade = true
): void {
	for (let i = 0; i < rings; i++) {
		const d = inner + ((outer - inner) * (i + 0.5)) / rings;
		for (const side of [-0.32, 0, 0.32]) {
			const [x, z] = quarterAt(q, d, side);
			hamlet(c.town, c.forest, c.g, c.rand, {
				x,
				z,
				r,
				n: per,
				thatch,
				taken,
				shade,
				ok: (px, pz) => inQuarter(c, px, pz, q, climb, inner - 0.03, outer + 0.05)
			});
		}
	}
}
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
				cloth: 'wallRed',
				every: 32,
				torches: 60,
				era: { from: FOUNDING },
				gates: [{ near: [0, 560], munru: { block: { w: 22, d: 11, h: 7.2, arch: 4.4 }, storeys: 2, bays: [3.4, 4, 3.4], depth: [3.2, 3.2], colH: 3.8, tile: 'tileRed' } }]
			}
		],
		courts: [
			{
				x: 160,
				z: 1040,
				w: 78,
				d: 62,
				pave: 'earth',
				era: { to: FOUNDING },
				main: { bays: [3.2, 3.8, 4.2, 3.8, 3.2], depth: [3.2, 3.4], colH: 3.6, base: 0.5, steps: ['s'], roof: { tile: 'thatch' } },
				wings: { bays: [2.8, 3.2, 2.8], depth: [2.6, 2.6], colH: 2.8, base: 0.3, roof: { tile: 'thatch' } },
				label: { id: 'tabal', en: 'Tabal’s hall', ko: '연타발의 집', status: 'fictional', note: 'A thatched hall on packed earth at the south foot. The crow is the largest roof; the four ka sit in quarters around the mountain' }
			},
			{
				x: 0,
				z: -160,
				w: 168,
				d: 150,
				pave: 'gravel',
				era: { from: FOUNDING },
				main: { bays: [3.6, 4.2, 4.8, 5.4, 4.8, 4.2, 3.6], depth: [4, 4.6, 4.6, 4], colH: 5.4, base: 1.6, tiers: 2, steps: ['s'], roof: { tile: 'tileRed', chimi: true } },
				upper: { bays: [3.2, 3.8, 4.4, 3.8, 3.2], depth: [3.4, 3.8, 3.4], colH: 3.8, roof: { kind: 'hip', h: 5.2, tile: 'tileRed', chimi: true, finial: true } },
				wings: { bays: [3.2, 3.6, 3.6, 3.2], depth: [3, 3], colH: 3.4, base: 0.6, roof: { tile: 'tileRed' } },
				label: { id: 'hall', en: 'Jumong’s palace', ko: '주몽의 궁', status: 'placed', note: 'On the mesa, after the five roofs vote him king. The rim wall is placed' }
			},
			{
				x: 0,
				z: 250,
				w: 132,
				d: 96,
				pave: 'gravel',
				era: { from: FOUNDING },
				main: { bays: [3.4, 4, 4.4, 4, 3.4], depth: [3.2, 3.4], colH: 4.2, base: 0.8, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1, roof: { tile: 'tileRed', chimi: true } },
				wings: { bays: [3, 3.4, 3], depth: [2.8, 2.8], colH: 3.2, base: 0.4, roof: { tile: 'tileRed' } },
				label: { id: 'approach', en: 'The south court', ko: '남쪽 뜰', status: 'placed', era: { from: FOUNDING }, note: 'The yard between the rim gate and the palace. The offices of the new kingdom face it' }
			}
		],
		trees: { n: 12000, kinds: ['pine', 'broad', 'maple', 'pine'], min: 10, skip: (x, z) => mesaD(x, z) < 0.8 },
		grass: { n: 8000, box: { minX: -220, maxX: 220, minZ: -700, maxZ: 500 } },
		extra: (c) => {
			c.road(
				[
					[0, 560],
					[0, 860],
					[160, 1040]
				],
				5
			);
			for (const k of KA) c.road([quarterAt(k.q, 1.28), [0, 900]], 4);
			// Tabal: four equal quarters of thatched huts on the flat against the cliff
			c.town.setEra(undefined, FOUNDING);
			const early = new Footprints();
			for (const k of KA) {
				quarterHouses(c, k.q, 1.05, 1.5, 3, 6, 80, 1, 18, early, false);
				const [x, z] = quarterAt(k.q, 1.28);
				c.labels.push({ id: k.id, en: k.en, ko: k.ko, at: [x, c.g.height(x, z) + 16, z], status: 'fictional', era: { to: FOUNDING }, note: k.note });
			}
			// Goguryeo: the same quarters take tile and spread, and a denser band sits under the cliff
			c.town.setEra(FOUNDING);
			const later = new Footprints();
			for (const k of KA) {
				quarterHouses(c, k.q, 1.03, 1.78, 4, 7, 88, 0.35, 40, later);
				const [x, z] = quarterAt(k.q, 1.22);
				c.labels.push({ id: `${k.id}-town`, en: k.en, ko: k.ko, at: [x, c.g.height(x, z) + 18, z], status: 'fictional', era: { from: FOUNDING }, note: `${k.note}. Under Jumong the quarter takes tile roofs and fills in against the cliff` });
			}
			for (let i = 0; i < 20; i++) {
				const a = (i / 20) * Math.PI * 2 + 0.08;
				const d = i % 2 === 0 ? 1.04 : 1.16;
				const x = Math.cos(a) * 300 * d;
				const z = -200 + Math.sin(a) * 760 * d;
				hamlet(c.town, c.forest, c.g, c.rand, {
					x,
					z,
					r: 70,
					n: 7,
					thatch: 0.22,
					trees: ['pine', 'zelkova'],
					taken: later,
					ok: (px, pz) => {
						const md = mesaD(px, pz);
						return md > 1.01 && md < 1.22 && c.g.height(px, pz) < JB.plain + 42 && c.clear(px, pz, 2);
					}
				});
			}
			c.town.setEra();
			// the city on the flat top: a street from the palace to the south court, and walled yards either side
			const onSummit = (x: number, z: number) => mesaD(x, z) < 0.74 && c.g.height(x, z) > JB.plain + JB.top - 24 && c.clear(x, z, 2);
			c.b.setEra(FOUNDING);
			c.road(
				[
					[0, -70],
					[0, 180]
				],
				7
			);
			c.road(
				[
					[0, 310],
					[0, 470]
				],
				7
			);
			for (const z of [-50, -14, 22, 58, 94, 130, 166, 320, 356, 392, 428]) {
				c.b.lampPost(9, c.g.height(9, z), z);
				c.b.lampPost(-9, c.g.height(-9, z), z);
			}
			c.b.setEra();
			c.town.setEra(FOUNDING);
			for (const [x, z, w, d] of [
				[150, -80, 70, 56],
				[-150, -80, 70, 56],
				[145, -250, 72, 58],
				[-145, -250, 72, 58],
				[110, -400, 68, 54],
				[-110, -400, 68, 54],
				[70, -540, 64, 52],
				[-70, -540, 64, 52],
				[0, -640, 60, 48],
				[120, 50, 68, 54],
				[-120, 50, 68, 54],
				[125, 145, 64, 50],
				[-125, 145, 64, 50],
				[70, 345, 58, 46],
				[-70, 345, 58, 46],
				[0, -310, 72, 52],
				[0, -470, 64, 48],
				[190, -160, 56, 48],
				[-190, -160, 56, 48],
				[175, -380, 56, 48],
				[-175, -380, 56, 48],
				[55, -30, 52, 44],
				[-55, -30, 52, 44],
				[58, 90, 50, 42],
				[-58, 90, 50, 42]
			] as [number, number, number, number][]) {
				townBlock(c.town, c.g.height, c.rand, x, z, w, d, 0, onSummit, { density: 0.92, thatch: 0.05, plot: [13, 22] });
			}
			c.town.setEra();
			c.labels.push({ id: 'onyeo', en: 'Onyeosan', ko: '오녀산', at: [330, JB.plain + JB.top * 0.55, 160], status: 'survey', note: 'The cliff-ringed mesa above the Hun river at Huanren' });
			c.labels.push({ id: 'hun', en: 'The Hun', ko: '비류수', at: [1100, JB.water + 14, 700], status: 'survey' });
		},
		views: () => [
			{ id: 'mesa', en: 'Under the cliffs', ko: '절벽 아래', pos: [1500, JB.plain + 70, 1100], target: [80, JB.plain + 40, -80], fov: 42 },
			{ id: 'quarters', en: 'The four ka', ko: '사가', pos: [1200, JB.plain + 90, 200], target: [0, JB.plain + 8, -200], fov: 48, era: { to: FOUNDING } },
			{ id: 'town', en: 'Around the mountain', ko: '산 아래 마을', pos: [780, JB.plain + 42, 920], target: [40, JB.plain + 12, 40], fov: 46, era: { from: FOUNDING } },
			{ id: 'tabal', en: 'Tabal’s yard', ko: '연타발의 마당', pos: [280, JB.plain + 18, 1180], target: [160, JB.plain + 4, 1020], fov: 46, era: { to: FOUNDING } },
			{ id: 'rim', en: 'From the rim', ko: '정상 끝에서', pos: [60, JB.plain + JB.top + 12, 500], target: [900, JB.water, 800], fov: 50, era: { from: FOUNDING } },
			{ id: 'yard', en: 'The palace', ko: '궁', pos: [50, JB.plain + JB.top + 22, 20], target: [0, JB.plain + JB.top + 6, -180], fov: 46, era: { from: FOUNDING } },
			{ id: 'city', en: 'The city on the mesa', ko: '산 위의 읍', pos: [70, JB.plain + JB.top + 36, 310], target: [0, JB.plain + JB.top + 6, -20], fov: 48, era: { from: FOUNDING } },
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
			const tabal = new Folk('goguryeo', c.g.height, 11);
			tabal.audience(160, 1020, 0, { near: 8, far: 22, n: 4 });
			tabal.knot(['man', 'woman', 'archer'], 200, 900, 16, 6);
			const court = new Folk('goguryeo', c.g.height, 37);
			court.audience(0, -180, 0, { y: JB.plain + JB.top + 0.2, near: 12, far: 34, n: 5 });
			court.knot(['archer', 'guard', 'man'], 40, 480, 24, 6);
			return {
				kingdom: 'goguryeo',
				walk: [quarterAt(0, 1.28), [0, 900], [0, 560]],
				river: reach(HUN, 900, 400, 1500),
				bank: 120,
				waterY: JB.water + 0.3,
				height: c.g.height,
				seed: 37,
				people: 14,
				boats: 2,
				boat: 0.5,
				bands: [
					{ era: { to: FOUNDING }, folk: tabal },
					{ era: { from: FOUNDING }, folk: court }
				]
			};
		}
	});
}
