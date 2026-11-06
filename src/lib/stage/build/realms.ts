import { rect, type P2 } from './geo';
import { at, box, hall, tower, flat, fence, gate, stoneLantern, type Builder, type HallSpec } from './kit';
import { pick } from './common';
import { cloudSea } from './fortress';
import { buildRecipe } from './recipe';
import { Folk, type Role } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The myth realms. Their skies are painted (`realm`), not the hour's: the Three Realms Pavilion
 * on its islet where three coloured waters meet, Hallakgungi's flower rows to the edge of the
 * world, Big Star's dark palace over a glowing lake, and Little Star's halls on rock above a
 * sea of cloud. Everything is still built from the same Korean timber, stone and tile.
 */

/** A plank bridge from a to b at deck height y, with rails and posts down to `foot`. */
function plankBridge(b: Builder, a: P2, c: P2, y: number, w = 4, foot?: number): void {
	const dx = c[0] - a[0];
	const dz = c[1] - a[1];
	const len = Math.hypot(dx, dz);
	const rot = Math.atan2(dx, dz);
	const m = at((a[0] + c[0]) / 2, y, (a[1] + c[1]) / 2, rot);
	box(b, 'wood', m, 0, 0, 0, w, 0.45, len);
	for (const s of [1, -1]) {
		box(b, 'vermilion', m, s * (w / 2 - 0.15), 1, 0, 0.18, 0.18, len);
		for (let d = -len / 2; d <= len / 2; d += 4) box(b, 'vermilion', m, s * (w / 2 - 0.15), 0.5, d, 0.16, 1, 0.16);
	}
	if (foot !== undefined) {
		for (let d = -len / 2 + 6; d < len / 2 - 4; d += 12) {
			for (const s of [1, -1]) box(b, 'wood', m, s * (w / 2 - 0.3), (foot - y) / 2, d, 0.4, y - foot, 0.4);
		}
	}
}

/* ------------------------------------------------------------------ Three Realms Pavilion */

const TR = { plain: 10, water: 4, bed: -5 };
/**
 * The three waters, each running into the pool: the living (east), the dead (north-west), the flower
 * field (south-west). They stop at the pool's edge: a river carves its bed ~135 m around its path,
 * and running them to the centre would sink the islet.
 */
const LIVING: P2[] = [
	[2600, -300],
	[1400, 120],
	[700, 40],
	[250, 10]
];
const DEAD: P2[] = [
	[-1800, -2200],
	[-1000, -1100],
	[-420, -420],
	[-178, -178]
];
const FLOWERS: P2[] = [
	[-2400, 1600],
	[-1300, 900],
	[-500, 320],
	[-212, 136]
];
const POOL_R = 280;

export function buildThreeRealms(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'threerealms',
		seed: 3,
		near: { minX: -1600, maxX: 1600, minZ: -1600, maxZ: 1600 },
		cell: 6,
		plain: TR.plain,
		roll: 2,
		mountains: [
			{ x: -2800, z: -2600, rx: 1800, rz: 1600, h: 620, seed: 1.7 },
			{ x: 2800, z: -2400, rx: 1700, rz: 1500, h: 560, seed: 2.5 },
			{ x: -2600, z: 2800, rx: 1700, rz: 1500, h: 520, seed: 3.6 },
			{ x: 2800, z: 2800, rx: 1800, rz: 1600, h: 600, seed: 4.4 }
		],
		hills: [
			{ x: 0, z: 0, rx: POOL_R + 60, rz: POOL_R + 60, h: -19, seed: 5.2, power: 1.4 },
			{ x: 0, z: 0, rx: 70, rz: 62, h: 34, seed: 6.1, power: 0.7, top: 24 }
		],
		rivers: [
			{ path: LIVING, half: 34, water: TR.water, bed: TR.bed, color: '#3f9c86' },
			{ path: DEAD, half: 34, water: TR.water, bed: TR.bed, color: '#1d3a5c' },
			{ path: FLOWERS, half: 34, water: TR.water, bed: TR.bed, color: '#d07ea6' }
		],
		look: {
			fields: ['#8f9c7e', '#9aa585', '#86947a', '#a3a88c'],
			forest: ['#5d6f58', '#66775e', '#55665a'],
			rock: '#7a7486',
			bed: '#3c3a52',
			bank: '#b6aec2',
			top: '#c7bfa9',
			paint: (x, z, y) => (Math.hypot(x, z) < POOL_R + 10 && y < TR.water + 1 ? '#3c3a52' : null)
		},
		trees: { n: 5000, kinds: ['pine', 'maple', 'cherry'], min: 14 },
		grass: { n: 9000, box: { minX: -900, maxX: 900, minZ: -900, maxZ: 900 }, ok: (x, z) => Math.hypot(x, z) > POOL_R + 20 },
		extra: (c) => {
			// the pool where the three waters mix
			const ring: P2[] = [];
			for (let i = 0; i < 40; i++) ring.push([Math.cos((i / 40) * Math.PI * 2) * (POOL_R + 30), Math.sin((i / 40) * Math.PI * 2) * (POOL_R + 30)]);
			c.b.pushColored('water', flat(ring, TR.water), '#5b5f96');
			c.taken.add(0, 0, (POOL_R + 40) * 2, (POOL_R + 40) * 2);
			// the pavilion on the islet, lanterns at its corners, a bridge to the living bank
			const y = c.g.height(0, 0);
			const pav = hall(c.b, at(0, y, 0), {
				bays: [3.4, 4, 3.4],
				depth: [3.4, 4, 3.4],
				colH: 4.2,
				base: 1.2,
				front: 'open',
				back: 'open',
				sides: 'open',
				rail: true,
				steps: ['s', 'n', 'e', 'w'],
				roof: { kind: 'pyramid', h: 4.4, chimi: false }
			});
			for (const [dx, dz] of [
				[-12, -12],
				[12, -12],
				[-12, 12],
				[12, 12]
			])
				stoneLantern(c.b, dx, y, dz, 1.1);
			plankBridge(c.b, [44, 0], [POOL_R + 50, 0], TR.water + 2.2, 4, TR.bed);
			c.labels.push({ id: 'pavilion', en: 'Three Realms Pavilion', ko: '삼계정자', at: [0, y + pav.ridge + 6, 0], status: 'fictional', note: 'The gods meet here once a year' });
			c.labels.push({ id: 'living', en: 'Water of the living', ko: '이승의 물', at: [900, TR.water + 14, 80], status: 'fictional' });
			c.labels.push({ id: 'dead', en: 'Water of the dead', ko: '저승의 물', at: [-700, TR.water + 14, -700], status: 'fictional' });
			c.labels.push({ id: 'flowers', en: 'Water of the flower field', ko: '꽃밭의 물', at: [-800, TR.water + 14, 560], status: 'fictional' });
		},
		views: (c) => [
			{ id: 'pavilion', en: 'The islet', ko: '섬 정자', pos: [120, TR.water + 26, 160], target: [0, c.g.height(0, 0) + 4, 0], fov: 44 },
			{ id: 'bridge', en: 'From the living bank', ko: '이승 쪽 다리', pos: [POOL_R + 90, TR.water + 6, 14], target: [0, c.g.height(0, 0) + 5, 0], fov: 42 },
			{ id: 'waters', en: 'Where the waters meet', ko: '세 물이 만나는 곳', pos: [0, 640, 620], target: [0, 0, 0], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3000, 400], target: [0, 0, 0], fov: 40 }
		],
		mist: [
			{ y: TR.water + 1.4, opacity: 0.44 },
			{ y: TR.plain + 10, opacity: 0.16 }
		],
		center: [0, 0],
		radius: 900,
		haze: '#b9add2',
		water: { color: '#ffffff', roughness: 0.14, metalness: 0.05, painted: true },
		realm: { top: '#ffffff', bottom: '#ffffff', fog: '#ffffff', fogNear: 300, fogFar: 4800, motes: '#e8dcff', sun: '#fffaf4', sunI: 1.8, hemi: '#f4f2fb', light: 'day', bare: true },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 3);
			const y = c.g.height(0, 0) + 1.2;
			folk.knot(['lady', 'official', 'lady'], 0, 0, 5, 5, { y });
			folk.row('man', [POOL_R + 70, -3], [POOL_R + 110, -3], 4, -Math.PI / 2);
			const fleet = new Fleet(TR.water + 0.05, 'silla', 3);
			fleet.moor('skiff', -120, 160, 0.6);
			fleet.moor('skiff', -160, -110, 2.2);
			return { kingdom: 'silla', height: c.g.height, seed: 3, folk, fleet };
		}
	});
}

/* ------------------------------------------------------------------ Western Flower Field */

const FF = { plain: 20, water: 16, bed: 11, gate: 520 };
const ROW = 10;
const ROW_COLORS = ['#d9475c', '#f3efe6', '#e9c046', '#b765b0', '#5f97d6', '#ef8f5a'];
const FF_STREAM: P2[] = [
	[2400, 900],
	[1200, 760],
	[400, 640],
	[-800, 700],
	[-2400, 560],
	[-4400, 700]
];
const rowColor = (band: number) => ROW_COLORS[((band % ROW_COLORS.length) + ROW_COLORS.length) % ROW_COLORS.length];
/** Inside the gate the field is rows; the rows run west until the maps end. */
const inField = (x: number, z: number) => x < FF.gate - 10 && x > -2800 && Math.abs(z) < 560;

export function buildFlowerField(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'flowerfield',
		seed: 7,
		near: { minX: -2400, maxX: 1400, minZ: -1400, maxZ: 1400 },
		cell: 5,
		plain: FF.plain,
		roll: 0.8,
		mountains: [
			{ x: 2400, z: -2600, rx: 1800, rz: 1400, h: 380, seed: 1.5 },
			{ x: 2600, z: 2600, rx: 1800, rz: 1400, h: 340, seed: 2.6 }
		],
		rivers: [{ path: FF_STREAM, half: 22, water: FF.water, bed: FF.bed }],
		look: {
			fields: ['#88ab5e', '#93b365', '#7fa457', '#9cb86c'],
			forest: ['#5a7a48', '#64844e'],
			rock: '#8c8478',
			bed: '#7e8a72',
			bank: '#cfd3a8',
			paint: (x, z, _y, _s, n) => {
				if (!inField(x, z)) return x < FF.gate - 10 ? (n > 0 ? '#c3a9b8' : '#a9b78c') : null;
				const band = Math.floor(z / ROW);
				const f = z / ROW - band;
				if (Math.abs(f - 0.5) > 0.38) return '#5e8645';
				return rowColor(band);
			}
		},
		trees: { n: 3000, kinds: ['pine', 'broad'], min: 20 },
		extra: (c) => {
			// the rows themselves: blooms in each band's colour near the gate; past them the painted rows carry it
			for (let z = -540; z < 540; z += ROW) {
				const zc = z + ROW / 2;
				const tint = rowColor(Math.floor(zc / ROW));
				for (let x = -700; x < FF.gate - 14; x += 3) {
					if (c.rand() > (x > -150 ? 0.75 : 0.25)) continue;
					const px = x + (c.rand() - 0.5) * 1.4;
					const pz = zc + (c.rand() - 0.5) * ROW * 0.6;
					c.cover.add('fruit', px, c.g.height(px, pz) - 0.15, pz, 0.9 + c.rand() * 0.6, tint);
					if (c.rand() > 0.6) c.cover.add('flowers', px + 0.8, c.g.height(px, pz) - 0.05, pz, 1 + c.rand() * 0.6);
				}
			}
			// the fence round the field, the gate Hallakgungi keeps, his hut beside it
			const y = (x: number, z: number) => c.g.height(x, z);
			fence(c.b, [[FF.gate, -560], [FF.gate, -14]], y, 1.6, 0.4);
			fence(c.b, [[FF.gate, 14], [FF.gate, 560]], y, 1.6, 0.4);
			const gy = c.g.height(FF.gate, 0);
			const gt = gate(c.b, at(FF.gate, gy, 0, Math.PI / 2), [3, 3.8, 3], [2.8, 2.8], 3.4, { roof: { tile: 'thatch' } });
			hall(c.b, at(FF.gate + 40, c.g.height(FF.gate + 40, 60), 60, -Math.PI / 2), { bays: [3, 3.4, 3], depth: [2.8, 2.8], colH: 2.8, base: 0.5, roof: { tile: 'thatch' } });
			c.taken.add(FF.gate + 40, 60, 20, 16);
			c.taken.add(FF.gate, 0, 16, 16);
			c.road(
				[
					[1200, 0],
					[FF.gate + 6, 0]
				],
				5
			);
			for (let x = FF.gate + 30; x < 1200; x += 24) {
				for (const s of [1, -1]) c.forest.add('cherry', x, c.g.height(x, s * 9), s * 9, 7 + c.rand() * 2);
			}
			c.labels.push({ id: 'gate', en: 'The Gardener’s gate', ko: '꽃밭 문', at: [FF.gate, gy + gt.ridge + 1.5, 0], status: 'fictional', note: 'Hallakgungi keeps it' });
			c.labels.push({ id: 'rows', en: 'The rows', ko: '꽃밭 이랑', at: [-200, FF.plain + 12, 0], status: 'fictional', note: 'Flowers that raise the dead grow in the same rows as the flower that ends a family' });
		},
		views: () => [
			{ id: 'gate', en: 'At the gate', ko: '문 앞', pos: [FF.gate + 62, FF.plain + 4.5, 0], target: [FF.gate - 200, FF.plain + 1, 0], fov: 46 },
			{ id: 'rows', en: 'Down the rows', ko: '이랑을 따라', pos: [FF.gate - 30, FF.plain + 4, 5], target: [-1400, FF.plain, 5], fov: 40 },
			{ id: 'above', en: 'Over the field', ko: '꽃밭 위', pos: [200, FF.plain + 180, 420], target: [-500, FF.plain, 0], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [-400, 3000, 400], target: [-400, 0, 0], fov: 40 }
		],
		mist: [{ y: FF.plain + 3, opacity: 0.14 }],
		center: [-200, 0],
		radius: 1200,
		haze: '#f1dfe0',
		water: { color: '#6fb3c8', roughness: 0.2 },
		realm: { top: '#8fc3e8', bottom: '#fbe6d8', fog: '#f4dfe0', fogNear: 500, fogFar: 7000, motes: '#ffd6e8', sun: '#fff3e0', sunI: 2.2, hemi: '#e8eef8', light: 'day' },
		weather: { petals: true, motes: '#ffd6e8' },
		life: (c) => {
			const folk = new Folk('tamla', c.g.height, 7);
			folk.stand('man', FF.gate + 6, 4, -Math.PI / 2);
			const tenders: Role[] = ['woman', 'woman', 'man'];
			for (let i = 0; i < 10; i++) {
				const z = (Math.floor(c.rand() * 100) - 50) * ROW + ROW / 2;
				folk.stand(pick(tenders, c.rand()), -100 - c.rand() * 700, z, c.rand() * Math.PI * 2);
			}
			return { kingdom: 'tamla', walk: [[1200, 2], [FF.gate + 10, 2]], height: c.g.height, seed: 7, people: 8, folk };
		}
	});
}

/* ------------------------------------------------------------------ The Underworld */

const UW = { plain: 10, sea: 3, floor: -14, terrace: 7 };
const UW_PAL = { x: 0, z: -240, w: 300, d: 380 };
const UW_GATE: P2 = [0, UW_PAL.z + UW_PAL.d / 2];
const lakeMask = (x: number, z: number) => (1 - Math.hypot(x / 760, (z - 560) / 440)) * 3;

export function buildUnderworld(_opts: BuildOptions): SiteBuild {
	const terraceY = UW.plain + UW.terrace;
	const dark: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3.2, 3.2], colH: 3.8, base: 0.9, roof: { chimi: true } };
	return buildRecipe({
		name: 'underworld',
		seed: 99,
		near: { minX: -1800, maxX: 1800, minZ: -1800, maxZ: 1800 },
		cell: 6,
		plain: UW.plain,
		roll: 1.6,
		mountains: [
			{ x: -1900, z: -1400, rx: 1500, rz: 1600, h: 820, seed: 1.9 },
			{ x: 1900, z: -1400, rx: 1500, rz: 1600, h: 860, seed: 2.8 },
			{ x: -2200, z: 1500, rx: 1400, rz: 1400, h: 640, seed: 3.3 },
			{ x: 2200, z: 1500, rx: 1400, rz: 1400, h: 680, seed: 4.7 },
			{ x: 0, z: -3200, rx: 2600, rz: 1400, h: 1100, seed: 5.5 }
		],
		hills: [{ x: UW_PAL.x, z: UW_PAL.z, rx: UW_PAL.w * 0.75, rz: UW_PAL.d * 0.72, h: 16, seed: 6.6, power: 0.3, top: UW.terrace }],
		sea: { level: UW.sea, floor: UW.floor, mask: lakeMask, box: { minX: -800, maxX: 800, minZ: 100, maxZ: 1020 } },
		look: {
			fields: ['#1b2534', '#1f2a3b', '#18212f', '#222d3f'],
			forest: ['#141c28', '#18212e', '#121a24'],
			rock: '#2a3240',
			bed: '#0d1824',
			bank: '#2b3a4a',
			top: '#3a4352',
			sand: '#25313f',
			canopy: 0.6
		},
		walls: () => [
			{
				ring: rect(UW_PAL.x, UW_PAL.z, UW_PAL.w, UW_PAL.d),
				h: 7,
				t: 4.4,
				cloth: 'blue',
				every: 30,
				torches: 22,
				gates: [{ near: UW_GATE, munru: { block: { w: 26, d: 12, h: 8, arch: 5 }, storeys: 2, bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.6, 3.8, 3.6], colH: 4.4, lattice: true } }]
			}
		],
		courts: [
			{
				x: 0,
				z: UW_PAL.z + 90,
				w: 200,
				d: 110,
				y: terraceY,
				pave: 'paving',
				main: { bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.4, 3.4], colH: 4.4, base: 0.8, front: 'open', back: 'open', sides: 'wall', gateLine: 1, steps: ['s', 'n'], roof: { chimi: true } },
				wings: dark
			},
			{
				x: 0,
				z: UW_PAL.z - 40,
				w: 230,
				d: 140,
				y: terraceY,
				pave: 'paving',
				main: { bays: [4.4, 5, 5.4, 5.8, 5.4, 5, 4.4], depth: [4.4, 5, 5, 4.4], colH: 6.2, base: 2.6, tiers: 2, steps: ['s'], front: 'windows', roof: { chimi: true } },
				upper: { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 4.6, front: 'windows', back: 'wall', sides: 'wall', roof: { chimi: true } },
				wings: dark,
				label: { id: 'judgment', en: 'Hall of Judgment', ko: '심판전', status: 'fictional', note: 'Big Star’s court; Yumla judges here' }
			},
			{
				x: 0,
				z: UW_PAL.z - 150,
				w: 170,
				d: 70,
				y: terraceY,
				pave: 'paving',
				main: { bays: Array(7).fill(3.6), depth: [3.2, 3.6, 3.2], colH: 4, base: 1, front: 'windows', roof: { chimi: true } },
				label: { id: 'ledger', en: 'Hall of the Ledger', ko: '명부전', status: 'fictional', note: 'Every name, and the day it is due' }
			}
		],
		trees: { n: 3000, kinds: ['pine'], h: [10, 16], min: 30 },
		extra: (c) => {
			// the causeway of souls across the glowing lake, lamps all the way
			const z0 = UW_GATE[1] + 8;
			const z1 = 1060;
			const deck = UW.sea + 1.3;
			box(c.b, 'paving', at(0, deck, (z0 + z1) / 2), 0, -0.4, 0, 9, 1.2, z1 - z0);
			for (let z = z0 + 10; z < z1; z += 26) {
				for (const s of [1, -1]) {
					box(c.b, 'stone', at(s * 4.8, deck, z), 0, 0.4, 0, 0.6, 0.8, 0.6);
					stoneLantern(c.b, s * 5.6, deck, z, 1.1);
				}
			}
			c.taken.add(0, (z0 + z1) / 2, 30, z1 - z0);
			c.labels.push({ id: 'causeway', en: 'The causeway of souls', ko: '망자의 길', at: [0, deck + 14, 560], status: 'fictional', note: 'The dead walk in from the far shore; Kangrim brings them' });
			c.labels.push({ id: 'lake', en: 'The lake that glows', ko: '빛나는 호수', at: [300, UW.sea + 10, 620], status: 'fictional' });
		},
		views: () => [
			{ id: 'causeway', en: 'Down the causeway', ko: '망자의 길', pos: [6, UW.sea + 6, 300], target: [0, terraceY + 9, UW_GATE[1]], fov: 40 },
			{ id: 'gate', en: 'The gate', ko: '저승 문', pos: [40, terraceY + 10, UW_GATE[1] + 80], target: [0, terraceY + 10, UW_GATE[1]], fov: 46 },
			{ id: 'court', en: 'Court of judgment', ko: '심판의 뜰', pos: [60, terraceY + 26, UW_PAL.z + 60], target: [0, terraceY + 8, UW_PAL.z - 50], fov: 48 },
			{ id: 'valley', en: 'The navy valley', ko: '남빛 골짜기', pos: [700, 220, 1300], target: [0, 10, -100], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3000, 500], target: [0, 0, 100], fov: 40 }
		],
		mist: [
			{ y: UW.sea + 1.2, opacity: 0.2 },
			{ y: UW.plain + 8, opacity: 0.12 }
		],
		center: [0, 200],
		radius: 1100,
		haze: '#0c2236',
		water: { color: '#0b2a3a', roughness: 0.12, metalness: 0.05, glow: { color: '#2eb8c4', k: 0.22 } },
		realm: { top: '#02040b', bottom: '#0a2a44', fog: '#081d2e', fogNear: 250, fogFar: 4200, motes: '#43d6ff', sun: '#7fc4ff', sunI: 0.45, hemi: '#123049', light: 'night' },
		weather: { motes: '#43d6ff', lamp: '#5fd0ff' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 99);
			folk.audience(0, UW_PAL.z - 60, 0, { y: terraceY, near: 16, far: 56, n: 7 });
			folk.gate(UW_GATE[0], UW_GATE[1], 0, { half: 6 });
			return {
				kingdom: 'silla',
				walk: [
					[0, 1050],
					[0, UW_GATE[1] + 12]
				],
				door: [0, 1050],
				height: (x, z) => (Math.abs(x) < 5 && z > UW_GATE[1] + 8 ? UW.sea + 1.3 : c.g.height(x, z)),
				seed: 99,
				people: 24,
				folk
			};
		}
	});
}

/* ------------------------------------------------------------------ Sky Palace */

const SK = { plain: 0, top: 240, cloud: 150 };
const ISLES: { x: number; z: number; r: number; h: number }[] = [
	{ x: 0, z: 0, r: 210, h: 400 },
	{ x: -360, z: -80, r: 120, h: 380 },
	{ x: 340, z: -160, r: 115, h: 380 },
	{ x: 40, z: -400, r: 120, h: 390 },
	{ x: -190, z: 300, r: 105, h: 370 }
];

export function buildSkyPalace(_opts: BuildOptions): SiteBuild {
	const deckY = SK.plain + SK.top + 0.4;
	const redHall: HallSpec = { bays: [3.6, 4.2, 4.6, 4.2, 3.6], depth: [3.6, 3.8, 3.6], colH: 4.4, base: 1.2, front: 'doors', back: 'red', sides: 'red', steps: ['s'], roof: { chimi: true } };
	return buildRecipe({
		name: 'skypalace',
		seed: 11,
		near: { minX: -1100, maxX: 1100, minZ: -1100, maxZ: 900 },
		cell: 5,
		plain: SK.plain,
		roll: 3,
		mountains: [
			{ x: -3600, z: -3000, rx: 1600, rz: 1400, h: 620, seed: 1.2 },
			{ x: 4000, z: -2400, rx: 1500, rz: 1400, h: 560, seed: 2.4 },
			{ x: -2800, z: 3600, rx: 1600, rz: 1400, h: 480, seed: 3.5 }
		],
		hills: ISLES.map((s, i) => ({ x: s.x, z: s.z, rx: s.r, rz: s.r * 0.86, h: s.h, seed: 7 + i, power: 0.55, top: SK.top })),
		look: {
			fields: ['#8fa874', '#9ab07c'],
			forest: ['#5b7a52', '#668458', '#527049'],
			rock: '#a49a8c',
			bed: '#8d8a80',
			bank: '#b9b2a4',
			top: '#ddd7ca',
			paint: (_x, _z, y) => (y < SK.cloud - 12 ? '#efe4d6' : null)
		},
		courts: [
			{ x: 0, z: 0, w: 116, d: 96, y: deckY, pave: 'paving', main: redHall, upper: { bays: [3.4, 4, 4, 3.4], depth: [3.4, 3.4], colH: 3.8, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } }, wings: { ...redHall, bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.4, base: 0.7 }, label: { id: 'palace', en: 'Little Star’s palace', ko: '소별왕궁', status: 'fictional', note: 'White walls and red halls on floating rock' } },
			{ x: ISLES[1].x, z: ISLES[1].z, w: 56, d: 48, y: deckY, pave: 'paving', main: { ...redHall, bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.6 } },
			{ x: ISLES[2].x, z: ISLES[2].z, w: 56, d: 48, y: deckY, pave: 'paving', main: { ...redHall, bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.6 } }
		],
		trees: { n: 3200, kinds: ['pine', 'pine', 'cherry'], h: [6, 11], min: SK.cloud + 10 },
		extra: (c) => {
			// a star tower on the north isle, an open pavilion on the south one
			const n = ISLES[3];
			tower(c.b, at(n.x, deckY, n.z), { bays: [3.6, 4, 3.6], depth: [3.6, 4, 3.6], colH: 5, base: 1.6, front: 'red', back: 'red', sides: 'red', steps: ['s'] }, { bays: [3.2, 3.6, 3.2], depth: [3.2, 3.6, 3.2], colH: 4, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 4, chimi: false } });
			const s = ISLES[4];
			hall(c.b, at(s.x, deckY, s.z), { bays: [3.4, 3.8, 3.4], depth: [3.4, 3.8, 3.4], colH: 4, base: 1, front: 'open', back: 'open', sides: 'open', rail: true, roof: { kind: 'pyramid', h: 3.8 } });
			for (const isle of ISLES) c.taken.add(isle.x, isle.z, 50, 50);
			// bridges from the palace isle's rim to the rim of every other
			for (const isle of ISLES.slice(1)) {
				const d = Math.hypot(isle.x, isle.z);
				const ux = isle.x / d;
				const uz = isle.z / d;
				const r0 = ISLES[0].r * 0.5;
				const r1 = isle.r * 0.45;
				plankBridge(c.b, [ux * r0, uz * r0], [isle.x - ux * r1, isle.z - uz * r1], deckY + 0.2, 5);
			}
			for (const isle of ISLES) {
				for (const [dx, dz] of [
					[-14, 30],
					[14, 30]
				])
					stoneLantern(c.b, isle.x + dx, deckY, isle.z + dz, 1.1);
			}
			c.root.add(cloudSea(c.p, c.rand, { cx: 0, cz: -40, r0: 200, r1: 8000, y: SK.cloud, height: c.g.height, puffs: 200 }));
			c.labels.push({ id: 'tower', en: 'Star tower', ko: '별 누각', at: [n.x, deckY + 30, n.z], status: 'fictional' });
		},
		views: () => [
			{ id: 'isles', en: 'Above the clouds', ko: '구름 위', pos: [380, SK.top + 170, 500], target: [0, SK.top - 10, -60], fov: 44 },
			{ id: 'bridge', en: 'On a bridge', ko: '구름다리', pos: [250, deckY + 4, -117], target: [0, deckY + 8, 0], fov: 48 },
			{ id: 'court', en: 'Palace court', ko: '궁 마당', pos: [30, deckY + 14, 75], target: [0, deckY + 6, -20], fov: 48 },
			{ id: 'below', en: 'From the cloud sea', ko: '구름 바다에서', pos: [-560, SK.cloud + 14, 420], target: [0, SK.top + 20, -60], fov: 42 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 1800, 200], target: [0, 0, -40], fov: 40 }
		],
		mist: [
			{ y: SK.cloud - 4, opacity: 0.4 },
			{ y: SK.cloud + 16, opacity: 0.16 }
		],
		center: [0, -40],
		radius: 600,
		haze: '#f3dcc4',
		realm: { top: '#3a6fb0', bottom: '#ffd9a0', fog: '#f6dcc0', fogNear: 700, fogFar: 7000, motes: '#fff2c4', sun: '#ffe2a8', sunI: 2.6, hemi: '#dfe8ff', light: 'golden' },
		weather: { motes: '#fff2c4' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 11);
			folk.audience(0, -22, 0, { y: deckY, near: 12, far: 40, n: 5, who: 'lady' });
			for (const isle of ISLES.slice(1)) folk.knot(['lady', 'official'], isle.x, isle.z + 20, 8, 3, { y: deckY });
			return {
				kingdom: 'silla',
				walk: ISLES.slice(1, 3).flatMap((isle) => [[isle.x * 0.15, isle.z * 0.15] as P2, [isle.x * 0.9, isle.z * 0.9] as P2]),
				door: [0, -22],
				height: () => deckY,
				seed: 11,
				people: 10,
				folk
			};
		}
	});
}
