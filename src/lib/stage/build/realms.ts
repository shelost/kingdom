import * as THREE from 'three';
import { rect, type P2 } from './geo';
import { at, box, cylinder, hall, tower, flat, fence, gate, stoneLantern, stonePagoda, type Builder, type HallSpec, type Mat } from './kit';
import { pick } from './common';
import { cloudSea } from './fortress';
import { buildRecipe, type CourtSpec } from './recipe';
import { Folk, type Role } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The myth realms. Their skies are painted (`realm`), not the hour's: the Three Realms Pavilion
 * on its islet where three coloured waters meet, Hallakgungi's ten walled flower plots, Big
 * Star's temple-palace past the River of Three Crossings, and the gods' isles of the Sky Palace
 * joined by bridges above a sea of cloud. Everything is still built from the same Korean timber, stone and tile.
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

const FF = { plain: 20, water: 16, bed: 11, gate: 420 };
const FF_STREAM: P2[] = [
	[2400, 900],
	[1200, 760],
	[400, 640],
	[-800, 700],
	[-2400, 560],
	[-4400, 700]
];

type Bloom = 'spire' | 'globe' | 'cup' | 'puff' | 'bell' | 'disc' | 'star' | 'droop' | 'thorn' | 'lotus';

/** Hallakgungi's ten flowers (이공본풀이), one walled plot each: the five that raise the dead in the north row, the five that move the living in the south. */
const BLOOMS: { id: string; en: string; ko: string; bloom: Bloom; color: string; heart?: string; stem?: string; note: string }[] = [
	{ id: 'bone', en: 'Bone flower', ko: '뼈살이꽃', bloom: 'spire', color: '#f4efe2', note: 'Laid on the bones first' },
	{ id: 'flesh', en: 'Flesh flower', ko: '살살이꽃', bloom: 'globe', color: '#f2a99c', note: 'Then on the flesh' },
	{ id: 'blood', en: 'Blood flower', ko: '피살이꽃', bloom: 'cup', color: '#c8172f', heart: '#ffd76a', note: 'Then the blood runs again' },
	{ id: 'breath', en: 'Breath flower', ko: '숨살이꽃', bloom: 'puff', color: '#c6e6f6', note: 'Then the breath comes back' },
	{ id: 'soul', en: 'Soul flower', ko: '혼살이꽃', bloom: 'bell', color: '#a27ae6', heart: '#f4e2ff', note: 'And last of all the soul' },
	{ id: 'laugh', en: 'Laughing flower', ko: '웃음웃을꽃', bloom: 'disc', color: '#f6d03c', heart: '#7a4a1c', note: 'Scatter it and a crowd cannot stop laughing' },
	{ id: 'fight', en: 'Quarrel flower', ko: '싸움싸울꽃', bloom: 'star', color: '#f07a2a', heart: '#b8231a', note: 'Scatter it and they fight' },
	{ id: 'weep', en: 'Weeping flower', ko: '울음울꽃', bloom: 'droop', color: '#4f7cd0', heart: '#cfe8ff', note: 'Scatter it and they weep' },
	{ id: 'ruin', en: 'Ruin flower', ko: '수레멸망악심꽃', bloom: 'thorn', color: '#3b1a3c', heart: '#d0142c', stem: '#2a3424', note: 'The one that ends a family, grown in the same field as the rest' },
	{ id: 'birth', en: 'Birth flower', ko: '생불꽃', bloom: 'lotus', color: '#ffd2e2', heart: '#f2c24a', note: 'Samsin plants a child with it' }
];

const PLOT = { w: 140, d: 150, gap: 16 };
const plotAt = (i: number) => ({ x: FF.gate - 170 - (i % 5) * (PLOT.w + PLOT.gap), z: (i < 5 ? -1 : 1) * (PLOT.d / 2 + PLOT.gap / 2) });
const FIELD = { minX: plotAt(4).x - PLOT.w / 2 - 14, maxX: FF.gate - 10, half: PLOT.d + PLOT.gap / 2 + 14 };
const SPRING = { x: FF.gate - 50, z: 0, r: 13 };
const inField = (x: number, z: number) => x > FIELD.minX && x < FIELD.maxX && Math.abs(z) < FIELD.half;
const PLOT_GROUND = BLOOMS.map((f) => `#${new THREE.Color('#5e8a48').lerp(new THREE.Color(f.color), 0.24).getHexString()}`);

function plotOf(x: number, z: number): number {
	for (let i = 0; i < BLOOMS.length; i++) {
		const p = plotAt(i);
		if (Math.abs(x - p.x) < PLOT.w / 2 && Math.abs(z - p.z) < PLOT.d / 2) return i;
	}
	return -1;
}

type Part = { geo: THREE.BufferGeometry; tone: 'petal' | 'stem' | 'heart' };

/** One flower of each kind in unit space, stem foot at the origin. */
function bloomParts(kind: Bloom): Part[] {
	const stemH = kind === 'spire' ? 1.7 : kind === 'droop' ? 1.4 : 1.1;
	const parts: Part[] = [{ geo: new THREE.BoxGeometry(0.07, stemH, 0.07).translate(0, stemH / 2, 0), tone: 'stem' }];
	const add = (geo: THREE.BufferGeometry, tone: Part['tone'] = 'petal') => parts.push({ geo, tone });
	const top = stemH;
	switch (kind) {
		case 'spire':
			for (let k = 0; k < 9; k++) {
				const a = k * 2.4;
				const r = 0.2 - k * 0.015;
				add(new THREE.SphereGeometry(0.17 - k * 0.01, 6, 4).scale(1, 0.6, 1).translate(Math.cos(a) * r, top - 0.8 + k * 0.12, Math.sin(a) * r));
			}
			break;
		case 'globe':
			add(new THREE.SphereGeometry(0.42, 10, 7).translate(0, top + 0.3, 0));
			break;
		case 'cup':
			add(new THREE.CylinderGeometry(0.5, 0.12, 0.55, 8, 1, true).translate(0, top + 0.25, 0));
			add(new THREE.SphereGeometry(0.12, 6, 4).translate(0, top + 0.12, 0), 'heart');
			break;
		case 'puff':
			add(new THREE.IcosahedronGeometry(0.48, 1).translate(0, top + 0.42, 0));
			break;
		case 'bell':
			add(new THREE.ConeGeometry(0.36, 0.62, 8, 1, true).translate(0, top - 0.3, 0));
			add(new THREE.SphereGeometry(0.08, 6, 4).translate(0, top - 0.62, 0), 'heart');
			break;
		case 'disc':
			add(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 12).rotateX(1).translate(0, top + 0.2, 0));
			add(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 10).rotateX(1).translate(0, top + 0.23, 0.04), 'heart');
			break;
		case 'star':
			add(new THREE.OctahedronGeometry(0.5).scale(1, 0.45, 1).translate(0, top + 0.15, 0));
			add(new THREE.OctahedronGeometry(0.42).rotateY(Math.PI / 4).scale(1, 0.45, 1).translate(0, top + 0.2, 0), 'heart');
			break;
		case 'droop':
			add(new THREE.BoxGeometry(0.5, 0.06, 0.06).translate(0.22, top, 0), 'stem');
			add(new THREE.ConeGeometry(0.28, 0.7, 7, 1, true).translate(0.45, top - 0.35, 0));
			add(new THREE.SphereGeometry(0.07, 6, 4).translate(0.45, top - 0.85, 0), 'heart');
			break;
		case 'thorn':
			add(new THREE.OctahedronGeometry(0.45).scale(0.7, 1.3, 0.7).translate(0, top + 0.45, 0));
			add(new THREE.OctahedronGeometry(0.4).rotateY(Math.PI / 4).scale(1.3, 0.4, 1.3).translate(0, top + 0.3, 0));
			add(new THREE.SphereGeometry(0.14, 6, 4).translate(0, top + 0.5, 0.2), 'heart');
			break;
		case 'lotus':
			for (let k = 0; k < 8; k++) add(new THREE.ConeGeometry(0.16, 0.6, 4).rotateZ(-0.7).translate(0.22, 0.25, 0).rotateY((k * Math.PI) / 4).translate(0, top, 0));
			add(new THREE.CylinderGeometry(0.16, 0.12, 0.12, 8).translate(0, top + 0.12, 0), 'heart');
			break;
	}
	return parts;
}

type Tones = Record<Part['tone'], THREE.Color>;

const tonesOf = (f: (typeof BLOOMS)[number], color = f.color): Tones => ({
	petal: new THREE.Color(color),
	stem: new THREE.Color(f.stem ?? '#4f8a3c'),
	heart: new THREE.Color(f.heart ?? '#e9b93c')
});

function flower(b: Builder, parts: Part[], tones: Tones, x: number, y: number, z: number, s: number, rot: number): void {
	const m = at(x, y, z, rot, s);
	for (const p of parts) b.push('plaster', p.geo, m, false, tones[p.tone]);
}

/** Flowers of one kind scattered over a patch, each a little different in size and turn. */
function bloomPatch(b: Builder, f: (typeof BLOOMS)[number], height: (x: number, z: number) => number, rand: () => number, spots: P2[], size: [number, number], colors: string[] = [f.color]): void {
	const parts = bloomParts(f.bloom);
	const tones = colors.map((c) => tonesOf(f, c));
	spots.forEach(([x, z], k) => flower(b, parts, tones[k % tones.length], x, height(x, z) - 0.05, z, size[0] + rand() * (size[1] - size[0]), rand() * Math.PI * 2));
	for (const p of parts) p.geo.dispose();
}

export function buildFlowerField(_opts: BuildOptions): SiteBuild {
	return buildRecipe({
		name: 'flowerfield',
		seed: 7,
		near: { minX: -1600, maxX: 1400, minZ: -1200, maxZ: 1200 },
		cell: 5,
		plain: FF.plain,
		roll: 0.8,
		mountains: [
			{ x: 2400, z: -2600, rx: 1800, rz: 1400, h: 380, seed: 1.5 },
			{ x: 2600, z: 2600, rx: 1800, rz: 1400, h: 340, seed: 2.6 }
		],
		rivers: [{ path: FF_STREAM, half: 22, water: FF.water, bed: FF.bed }],
		look: {
			fields: ['#9cb57a', '#a9bd86', '#93ae72', '#b2c08e'],
			forest: ['#6a8a62', '#76966c'],
			rock: '#9a8f9a',
			bed: '#7e8a92',
			bank: '#d8d0e0',
			paint: (x, z, _y, _s, n) => {
				if (!inField(x, z)) return x < FF.gate - 10 ? (n > 0 ? '#cdb8d8' : '#b9c7a2') : null;
				if (Math.hypot(x - SPRING.x, z - SPRING.z) < SPRING.r + 4) return '#d9d2c4';
				const i = plotOf(x, z);
				if (i < 0) return n > 0.2 ? '#efe4cf' : '#e6d9c0';
				return PLOT_GROUND[i];
			}
		},
		trees: { n: 2400, kinds: ['pine', 'broad', 'cherry'], min: 20 },
		extra: (c) => {
			const y = (x: number, z: number) => c.g.height(x, z);
			BLOOMS.forEach((f, i) => {
				const p = plotAt(i);
				const spots: P2[] = [];
				for (let x = p.x - PLOT.w / 2 + 4; x < p.x + PLOT.w / 2 - 3; x += 6) {
					for (let z = p.z - PLOT.d / 2 + 4; z < p.z + PLOT.d / 2 - 3; z += 6) {
						if (c.rand() > 0.5) continue;
						spots.push([x + (c.rand() - 0.5) * 4, z + (c.rand() - 0.5) * 4]);
					}
				}
				bloomPatch(c.b, f, y, c.rand, spots, [1, 1.9]);
				for (const [x, z] of spots) if (c.rand() > 0.6) c.cover.add('flowers', x + 1.4, y(x, z) - 0.05, z, 1 + c.rand() * 0.5, f.color);
				// a low stone kerb round the plot and a marker stone on the path side
				const gy = y(p.x, p.z);
				for (const [dx, dz, w, d] of [
					[0, -PLOT.d / 2, PLOT.w, 0.6],
					[0, PLOT.d / 2, PLOT.w, 0.6],
					[-PLOT.w / 2, 0, 0.6, PLOT.d],
					[PLOT.w / 2, 0, 0.6, PLOT.d]
				] as const)
					box(c.b, 'stone', at(p.x + dx, gy, p.z + dz), 0, 0.2, 0, w, 0.7, d);
				const mz = p.z - Math.sign(p.z) * (PLOT.d / 2 + 3);
				box(c.b, 'stone', at(p.x, y(p.x, mz), mz), 0, 0.8, 0, 1, 1.6, 0.35);
				c.taken.add(p.x, p.z, PLOT.w + 4, PLOT.d + 4);
				c.labels.push({ id: `flower-${f.id}`, en: f.en, ko: f.ko, at: [p.x, gy + 9, p.z], status: 'fictional', note: f.note });
			});
			// the spring the rows are watered from
			const sy = y(SPRING.x, SPRING.z);
			for (let k = 0; k < 20; k++) {
				const a = (k / 20) * Math.PI * 2;
				box(c.b, 'stone', at(SPRING.x + Math.cos(a) * SPRING.r, sy, SPRING.z + Math.sin(a) * SPRING.r, -a), 0, 0.35, 0, 1.2, 0.9, 4.4);
			}
			c.b.push('water', new THREE.CylinderGeometry(SPRING.r - 0.4, SPRING.r - 0.4, 0.1, 28), at(SPRING.x, sy + 0.25, SPRING.z));
			c.taken.add(SPRING.x, SPRING.z, SPRING.r * 2 + 8, SPRING.r * 2 + 8);
			c.labels.push({ id: 'spring', en: 'The spring', ko: '꽃밭 샘', at: [SPRING.x, sy + 8, SPRING.z], status: 'fictional', note: 'Hallakgungi waters every plot from it' });
			// the fence round the field, the gate Hallakgungi keeps, his hut beside it
			fence(c.b, [[FF.gate, -FIELD.half], [FF.gate, -14]], y, 1.6, 0.4);
			fence(c.b, [[FF.gate, 14], [FF.gate, FIELD.half]], y, 1.6, 0.4);
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
		},
		views: () => [
			{ id: 'gate', en: 'At the gate', ko: '문 앞', pos: [FF.gate + 62, FF.plain + 4.5, 0], target: [FF.gate - 200, FF.plain + 1, 0], fov: 46 },
			{ id: 'plots', en: 'Among the plots', ko: '꽃밭 사이', pos: [plotAt(0).x + PLOT.w / 2 + 6, FF.plain + 3.2, 4], target: [plotAt(3).x, FF.plain + 1, -30], fov: 50 },
			{ id: 'above', en: 'Over the field', ko: '꽃밭 위', pos: [FF.gate + 80, FF.plain + 150, 300], target: [plotAt(2).x, FF.plain, 0], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [plotAt(2).x, 1500, 200], target: [plotAt(2).x, 0, 0], fov: 40 }
		],
		mist: [
			{ y: FF.plain + 1.4, opacity: 0.32 },
			{ y: FF.plain + 4, opacity: 0.18 },
			{ y: FF.plain + 9, opacity: 0.08 }
		],
		center: [plotAt(2).x, 0],
		radius: 700,
		haze: '#f0dcef',
		water: { color: '#7fc0d8', roughness: 0.16 },
		realm: { top: '#7d8fe0', bottom: '#ffe0ef', fog: '#f1dcef', fogNear: 300, fogFar: 3600, motes: '#fff3b0', sun: '#fff1e6', sunI: 2, hemi: '#efe6ff', light: 'day' },
		weather: { petals: true, motes: '#fff3b0' },
		life: (c) => {
			const folk = new Folk('tamla', c.g.height, 7);
			folk.stand('man', FF.gate + 6, 4, -Math.PI / 2);
			const tenders: Role[] = ['woman', 'woman', 'man'];
			for (let i = 0; i < BLOOMS.length; i++) {
				const p = plotAt(i);
				folk.stand(pick(tenders, c.rand()), p.x + (c.rand() - 0.5) * 30, p.z - Math.sign(p.z) * (PLOT.d / 2 + 5), c.rand() * Math.PI * 2);
			}
			return { kingdom: 'tamla', walk: [[1200, 2], [FF.gate + 10, 2]], height: c.g.height, seed: 7, people: 8, folk };
		}
	});
}

/* ------------------------------------------------------------------ The Underworld */

const UW = { plain: 10, sea: 3, floor: -14, terrace: 7 };
const UW_PAL = { x: 0, z: -240, w: 300, d: 380 };
const UW_GATE: P2 = [0, UW_PAL.z + UW_PAL.d / 2];
/** The River of Three Crossings (삼도천): the bridge for the good, the shallows for the middling, the deep water for the wicked. */
const lakeMask = (x: number, z: number) => (1 - Math.hypot(x / 760, (z - 560) / 440)) * 3;
const FORD_X = -260;
const DEEP_X = 300;

type Hold = 'lute' | 'sword' | 'dragon' | 'pagoda';

/** One of the Four Heavenly Kings (사천왕), painted and crowned, holding his attribute. */
function heavenlyKing(b: Builder, x: number, y: number, z: number, rot: number, robe: Mat, hold: Hold): void {
	const m = at(x, y, z, rot);
	box(b, 'stone', m, 0, 0.5, 0, 3.4, 1, 3);
	box(b, robe, m, 0, 3, 0, 2.6, 4, 1.8);
	box(b, robe, m, 0, 6.2, 0, 3.2, 2.6, 2);
	box(b, 'gold', m, 0, 6.6, 1.02, 1.6, 1.2, 0.08);
	box(b, 'plaster', m, 0, 8.2, 0, 1.3, 1.5, 1.3);
	box(b, 'gold', m, 0, 9.2, 0, 1.6, 0.5, 1.6);
	for (const s of [1, -1]) box(b, robe, m, s * 2, 6, 0.4, 0.8, 2.6, 0.8);
	if (hold === 'sword') box(b, 'stone', m, 2, 7.6, 0.9, 0.2, 5.2, 0.3);
	if (hold === 'lute') box(b, 'wood', m, 0, 6.4, 1.3, 1.2, 2.4, 0.3);
	if (hold === 'pagoda') stonePagoda(b, at(0, 7.4, 0.6).premultiply(m), 3, 0.9, 0.5, 'gold');
	if (hold === 'dragon') for (let k = 0; k < 6; k++) box(b, 'green', m, -2 + Math.sin(k) * 0.6, 4.6 + k * 0.7, 0.8, 0.5, 0.6, 0.5);
}

/** The karma mirror (업경대) before the judgment hall: a lion plinth, a post, a gold-rimmed disc. */
function karmaMirror(b: Builder, x: number, y: number, z: number): void {
	box(b, 'stone', at(x, y, z), 0, 0.4, 0, 2.6, 0.8, 1.6);
	box(b, 'stone', at(x, y, z), 0, 1.2, 0, 1.2, 0.8, 1);
	box(b, 'wood', at(x, y, z), 0, 2.6, 0, 0.3, 2.2, 0.3);
	b.push('gold', new THREE.CylinderGeometry(1.5, 1.5, 0.22, 28).rotateX(Math.PI / 2), at(x, y + 4.6, z));
	b.push('cloud', new THREE.CylinderGeometry(1.25, 1.25, 0.06, 28).rotateX(Math.PI / 2), at(x, y + 4.6, z + 0.13));
	box(b, 'gold', at(x, y, z), 0, 6.3, 0, 0.5, 0.6, 0.2);
}

/** The karma scales (업칭): a post, a beam, two pans on cords. */
function karmaScales(b: Builder, x: number, y: number, z: number): void {
	box(b, 'stone', at(x, y, z), 0, 0.3, 0, 1.6, 0.6, 1.6);
	box(b, 'wood', at(x, y, z), 0, 2.6, 0, 0.25, 4.4, 0.25);
	box(b, 'gold', at(x, y, z, 0.12), 0, 4.6, 0, 3.6, 0.15, 0.15);
	for (const s of [1, -1]) {
		const py = y + 3.2 - s * 0.22;
		box(b, 'gold', at(x + s * 1.75, py, z), 0, 0.7, 0, 0.04, 1.3, 0.04);
		b.push('gold', new THREE.CylinderGeometry(0.6, 0.4, 0.15, 12), at(x + s * 1.75, py, z));
	}
}

/** The envoys' table (사자상) left out at the gate: three bowls of rice and three pairs of straw shoes for the road. */
function envoyTable(b: Builder, x: number, y: number, z: number, rot: number): void {
	const m = at(x, y, z, rot);
	box(b, 'wood', m, 0, 0.45, 0, 2.4, 0.08, 0.9);
	for (const [sx, sz] of [
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1]
	])
		box(b, 'wood', m, sx * 1.1, 0.21, sz * 0.38, 0.08, 0.42, 0.08);
	for (const k of [-1, 0, 1]) {
		cylinder(b, 'plaster', m, k * 0.7, 0.57, 0, 0.2, 0.13, 0.16, 10);
		box(b, 'white', m, k * 0.7, 0.68, 0, 0.24, 0.1, 0.24);
		for (const s of [1, -1]) box(b, 'thatch', m, k * 0.7 + s * 0.1, 0.05, 0.85, 0.09, 0.08, 0.28);
	}
}

/** A lotus lantern (연등) afloat: eight pink petals round a paper lamp. */
function lotusLantern(b: Builder, x: number, y: number, z: number, turn: number): void {
	const pink = new THREE.Color('#f7a8c4');
	for (let k = 0; k < 8; k++) {
		const g = new THREE.ConeGeometry(0.22, 0.7, 4).rotateZ(-0.6).translate(0.25, 0.3, 0).rotateY(turn + (k * Math.PI) / 4);
		b.push('plaster', g, at(x, y, z), false, pink);
	}
	b.lamps.push([x, y + 0.45, z]);
}

export function buildUnderworld(_opts: BuildOptions): SiteBuild {
	const terraceY = UW.plain + UW.terrace;
	const dark: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3.2, 3.2], colH: 3.8, base: 0.9, roof: { chimi: true } };
	const courts = [
		{ z: UW_PAL.z + 90, w: 200, d: 110 },
		{ z: UW_PAL.z - 40, w: 230, d: 140 },
		{ z: UW_PAL.z - 150, w: 170, d: 70 }
	];
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
			fields: ['#25344a', '#2a3a52', '#223146', '#2e3f58'],
			forest: ['#1a2636', '#1f2c3d', '#18232f'],
			rock: '#3a4558',
			bed: '#10202e',
			bank: '#36495c',
			top: '#4f5a6c',
			sand: '#2e3c4c',
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
				z: courts[0].z,
				w: courts[0].w,
				d: courts[0].d,
				y: terraceY,
				pave: 'paving',
				main: { bays: [3.8, 4.4, 4.8, 4.4, 3.8], depth: [3.4, 3.4], colH: 4.4, base: 0.8, front: 'open', back: 'open', sides: 'wall', gateLine: 1, steps: ['s', 'n'], roof: { chimi: true } },
				wings: dark,
				label: { id: 'tenkings', en: 'Halls of the Ten Kings', ko: '시왕전', status: 'fictional', note: 'Seven weeks, a hundred days, a year and three years: a king sits at each hearing' }
			},
			{
				x: 0,
				z: courts[1].z,
				w: courts[1].w,
				d: courts[1].d,
				y: terraceY,
				pave: 'paving',
				main: { bays: [4.4, 5, 5.4, 5.8, 5.4, 5, 4.4], depth: [4.4, 5, 5, 4.4], colH: 6.2, base: 2.6, tiers: 2, steps: ['s'], front: 'windows', roof: { chimi: true } },
				upper: { bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 4.6, front: 'windows', back: 'wall', sides: 'wall', roof: { chimi: true } },
				wings: dark,
				label: { id: 'judgment', en: 'Hall of Judgment', ko: '심판전', status: 'fictional', note: 'Big Star’s court; Yumla judges here' }
			},
			{
				x: 0,
				z: courts[2].z,
				w: courts[2].w,
				d: courts[2].d,
				y: terraceY,
				pave: 'paving',
				main: { bays: Array(7).fill(3.6), depth: [3.2, 3.6, 3.2], colH: 4, base: 1, front: 'windows', roof: { chimi: true } },
				label: { id: 'ledger', en: 'Hall of the Ledger', ko: '명부전', status: 'fictional', note: 'Jijang keeps the book here: every name, and the day it is due' }
			}
		],
		trees: { n: 3000, kinds: ['pine'], h: [10, 16], min: 30 },
		extra: (c) => {
			const ground = (x: number, z: number) => c.g.height(x, z);
			// the bridge for the good: a paved causeway across the river, lamps all the way
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
			// the shallows: stepping stones the middling wade between
			for (let z = 150; z < 975; z += 4.5) {
				const x = FORD_X + Math.sin(z / 37) * 6 + (c.rand() - 0.5) * 1.6;
				const bed = ground(x, z);
				const top = UW.sea + 0.35;
				if (bed > top - 0.2) continue;
				box(c.b, 'rock', at(x, bed, z, c.rand() * 3), 0, (top - bed) / 2, 0, 1.7, top - bed, 1.4);
			}
			// the deep water: jetties on both banks for the ferry
			plankBridge(c.b, [DEEP_X, 92], [DEEP_X, 175], UW.sea + 1, 4, UW.floor);
			plankBridge(c.b, [DEEP_X, 948], [DEEP_X, 1030], UW.sea + 1, 4, UW.floor);
			// the gate in: the one-pillar gate, then the Four Heavenly Kings, two to a side
			const iy = Math.max(ground(0, 70), deck);
			const il = gate(c.b, at(0, iy, 70), [6.2], [1.4], 5.6, { front: 'open', back: 'open', sides: 'open', gateLine: undefined, base: 0.4, roof: { chimi: false } });
			const kings: [Mat, Hold][] = [
				['blue', 'lute'],
				['wallRed', 'sword'],
				['white', 'dragon'],
				['dark', 'pagoda']
			];
			kings.forEach(([robe, hold], k) => {
				const s = k % 2 === 0 ? 1 : -1;
				const z = k < 2 ? 34 : 12;
				heavenlyKing(c.b, s * 13, Math.max(ground(s * 13, z), deck), z, s > 0 ? -Math.PI / 2 : Math.PI / 2, robe, hold);
			});
			envoyTable(c.b, 8, Math.max(ground(8, UW_GATE[1] + 16), deck), UW_GATE[1] + 16, 0);
			const py = ground(-48, 40);
			stonePagoda(c.b, at(-48, py, 40), 5, 4.2, 2.4, 'courses');
			// the mirror and the scales in front of the judgment hall, lamps in every court
			const jz = courts[1].z + courts[1].d / 2 - 26;
			karmaMirror(c.b, -22, terraceY, jz);
			karmaScales(c.b, 22, terraceY, jz);
			for (const ct of courts) for (const s of [1, -1]) c.b.lampPost(s * (ct.w / 4), terraceY, ct.z + ct.d / 2 - 12);
			// lotus lanterns drifting on the river
			for (let i = 0; i < 90; i++) {
				const x = (c.rand() - 0.5) * 1300;
				const z = 160 + c.rand() * 820;
				if (lakeMask(x, z) < 0.3 || Math.abs(x) < 14) continue;
				lotusLantern(c.b, x, UW.sea + 0.05, z, c.rand() * Math.PI);
			}
			// on the far bank, the tree where the dead hang up the clothes of the living
			const rx = 26;
			const rz = 1040;
			const ry = ground(rx, rz);
			c.forest.add('broad', rx, ry, rz, 12);
			const robes: Mat[] = ['white', 'white', 'burgundy', 'white', 'blue', 'white', 'yellow'];
			robes.forEach((robe, k) => {
				const a = (k / robes.length) * Math.PI * 2;
				box(c.b, robe, at(rx + Math.cos(a) * 2.6, ry, rz + Math.sin(a) * 2.6, -a), 0, 5.4 + (k % 3) * 0.5, 0, 0.9, 1.5, 0.05);
			});
			c.taken.add(rx, rz, 14, 14);
			c.labels.push({ id: 'iljumun', en: 'One-pillar gate', ko: '일주문', at: [0, iy + il.ridge + 4, 70], status: 'fictional', note: 'One row of pillars, one mind, going in' });
			c.labels.push({ id: 'kings', en: 'Four Heavenly Kings', ko: '사천왕', at: [0, iy + 14, 22], status: 'fictional', note: 'The lute, the sword, the dragon and the pagoda keep the way in' });
			c.labels.push({ id: 'mirror', en: 'Karma mirror', ko: '업경대', at: [-22, terraceY + 9, jz], status: 'fictional', note: 'It shows the dead what they did. The scales beside it weigh it' });
			c.labels.push({ id: 'causeway', en: 'The bridge', ko: '다리', at: [0, deck + 14, 560], status: 'fictional', note: 'The good cross dry. Kangrim walks them in' });
			c.labels.push({ id: 'ford', en: 'The shallows', ko: '여울', at: [FORD_X, UW.sea + 10, 560], status: 'fictional', note: 'The middling wade' });
			c.labels.push({ id: 'deep', en: 'The deep water', ko: '깊은 물', at: [DEEP_X, UW.sea + 10, 560], status: 'fictional', note: 'The wicked go under. The ferry takes the rest, for a coin' });
			c.labels.push({ id: 'samdo', en: 'River of Three Crossings', ko: '삼도천', at: [-560, UW.sea + 16, 420], status: 'fictional', note: 'It glows from below' });
		},
		views: () => [
			{ id: 'causeway', en: 'Down the bridge', ko: '다리를 따라', pos: [6, UW.sea + 6, 300], target: [0, terraceY + 9, UW_GATE[1]], fov: 40 },
			{ id: 'kings', en: 'Past the Four Kings', ko: '사천왕 사이', pos: [4, UW.plain + 9, 116], target: [0, terraceY + 4, 10], fov: 48 },
			{ id: 'gate', en: 'The gate', ko: '저승 문', pos: [40, terraceY + 10, UW_GATE[1] + 80], target: [0, terraceY + 10, UW_GATE[1]], fov: 46 },
			{ id: 'court', en: 'Court of judgment', ko: '심판의 뜰', pos: [60, terraceY + 26, UW_PAL.z + 60], target: [0, terraceY + 8, UW_PAL.z - 50], fov: 48 },
			{ id: 'crossings', en: 'The three crossings', ko: '세 갈래 건너기', pos: [0, 160, 1300], target: [0, 0, 560], fov: 50 },
			{ id: 'valley', en: 'The navy valley', ko: '남빛 골짜기', pos: [700, 220, 1300], target: [0, 10, -100], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3000, 500], target: [0, 0, 100], fov: 40 }
		],
		mist: [
			{ y: UW.sea + 1.2, opacity: 0.18 },
			{ y: UW.plain + 8, opacity: 0.1 }
		],
		center: [0, 200],
		radius: 1100,
		haze: '#163a58',
		water: { color: '#0d3346', roughness: 0.12, metalness: 0.05, glow: { color: '#2eb8c4', k: 0.2 } },
		realm: { top: '#06112a', bottom: '#1d4f7c', fog: '#123552', fogNear: 300, fogFar: 5200, motes: '#43d6ff', sun: '#9fd2ff', sunI: 0.9, hemi: '#33628c', light: 'night' },
		weather: { motes: '#43d6ff', lamp: '#5fd0ff' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 99);
			folk.audience(0, UW_PAL.z - 60, 0, { y: terraceY, near: 16, far: 56, n: 7 });
			folk.gate(UW_GATE[0], UW_GATE[1], 0, { half: 6 });
			folk.stand('woman', 31, 1036, -Math.PI / 2);
			const fleet = new Fleet(UW.sea + 0.05, 'silla', 99);
			fleet.moor('ferry', DEEP_X + 6, 560, 0);
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
				folk,
				fleet
			};
		}
	});
}

/* ------------------------------------------------------------------ Sky Palace */

const SK = { plain: 0, top: 240, cloud: 150 };
type Isle = { x: number; z: number; r: number; h: number; lift?: number };
/** Little Star's palace in the middle; round it, an isle for each god, and the Sky Lord's the highest. */
const ISLES = {
	star: { x: 0, z: 0, r: 210, h: 400 },
	samsin: { x: 40, z: -480, r: 120, h: 390 },
	ibiga: { x: 390, z: -210, r: 125, h: 385 },
	tower: { x: 360, z: 300, r: 105, h: 375 },
	hwanin: { x: -170, z: 420, r: 120, h: 450, lift: 40 },
	haemosu: { x: -440, z: -40, r: 130, h: 390 }
} satisfies Record<string, Isle>;
type IsleId = keyof typeof ISLES;
const RING: IsleId[] = ['samsin', 'ibiga', 'tower', 'hwanin', 'haemosu'];
const isleY = (s: Isle) => SK.plain + SK.top + (s.lift ?? 0) + 0.4;

/** An arched sky bridge (구름다리) from a to c, climbing from ya to yc, with vermilion rails. */
function skyBridge(b: Builder, a: P2, c: P2, ya: number, yc: number, w = 5): void {
	const len = Math.hypot(c[0] - a[0], c[1] - a[1]);
	const rise = Math.min(18, len * 0.05);
	const n = Math.max(8, Math.round(len / 6));
	const pt = (t: number) => new THREE.Vector3(a[0] + (c[0] - a[0]) * t, ya + (yc - ya) * t + Math.sin(Math.PI * t) * rise, a[1] + (c[1] - a[1]) * t);
	const yaw = Math.atan2(c[0] - a[0], c[1] - a[1]);
	for (let i = 0; i < n; i++) {
		const p0 = pt(i / n);
		const p1 = pt((i + 1) / n);
		const L = p0.distanceTo(p1);
		const pitch = -Math.atan2(p1.y - p0.y, Math.hypot(p1.x - p0.x, p1.z - p0.z));
		const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ')).setPosition(p0.clone().add(p1).multiplyScalar(0.5));
		box(b, 'wood', m, 0, 0, 0, w, 0.45, L + 0.1);
		for (const s of [1, -1]) {
			box(b, 'vermilion', m, s * (w / 2 - 0.15), 1, 0, 0.18, 0.18, L + 0.1);
			box(b, 'vermilion', m, s * (w / 2 - 0.15), 0.5, -L / 2, 0.16, 1, 0.16);
		}
	}
	b.lampPost(a[0], ya, a[1]);
	b.lampPost(c[0], yc, c[1]);
}

/** Rim to rim between two isles. */
function bridgeIsles(b: Builder, A: Isle, B: Isle): void {
	const d = Math.hypot(B.x - A.x, B.z - A.z);
	const ux = (B.x - A.x) / d;
	const uz = (B.z - A.z) / d;
	skyBridge(b, [A.x + ux * A.r * 0.48, A.z + uz * A.r * 0.48], [B.x - ux * B.r * 0.48, B.z - uz * B.r * 0.48], isleY(A) + 0.2, isleY(B) + 0.2);
}

/** Haemosu's chariot of five dragons (오룡거), gold, the five bodies rising out ahead of it. */
function dragonChariot(b: Builder, x: number, y: number, z: number): void {
	box(b, 'gold', at(x, y, z), 0, 1.7, 0, 3, 1.4, 2.4);
	box(b, 'vermilion', at(x, y, z), 0, 3.4, -0.4, 3.4, 0.12, 2.8);
	for (const s of [1, -1]) b.push('wood', new THREE.CylinderGeometry(1.2, 1.2, 0.22, 16).rotateZ(Math.PI / 2), at(x + s * 1.75, y + 1.2, z));
	box(b, 'wood', at(x, y, z), 0, 1.1, 3.6, 0.2, 0.2, 5);
	for (let d = 0; d < 5; d++) {
		const dx = (d - 2) * 2.2;
		const pt = (t: number) => [x + dx * (1 + t) + Math.sin(t * 9 + d) * 1.2, y + 1.6 + t * t * 16 + Math.sin(t * Math.PI * 3 + d) * 1.4, z + 6 + t * 12] as const;
		for (let k = 0; k < 56; k++) {
			const t = k / 55;
			b.push('gold', new THREE.SphereGeometry(0.8 - t * 0.3, 8, 6), at(...pt(t)));
		}
		const [hx, hy, hz] = pt(1);
		box(b, 'gold', at(hx, hy, hz), 0, 0.3, 0.9, 1, 0.8, 1.8);
		for (const s of [1, -1]) box(b, 'gold', at(hx, hy, hz, 0, 1), s * 0.4, 1, 0.2, 0.12, 1.2, 0.12);
	}
}

/** The three-legged crow (삼족오) in a gold sun on a pole. */
function sunCrow(b: Builder, x: number, y: number, z: number): void {
	box(b, 'wood', at(x, y, z), 0, 4, 0, 0.25, 8, 0.25);
	b.push('gold', new THREE.CylinderGeometry(1.8, 1.8, 0.2, 28).rotateX(Math.PI / 2), at(x, y + 9.4, z));
	box(b, 'dark', at(x, y + 9.4, z + 0.16), 0, 0.2, 0, 1.6, 0.7, 0.06);
	box(b, 'dark', at(x, y + 9.4, z + 0.16), 0.75, 0.55, 0, 0.45, 0.4, 0.06);
	for (const k of [-0.35, 0, 0.35]) box(b, 'dark', at(x, y + 9.4, z + 0.16), k, -0.5, 0, 0.08, 0.6, 0.06);
}

export function buildSkyPalace(_opts: BuildOptions): SiteBuild {
	const deckY = isleY(ISLES.star);
	const redHall: HallSpec = { bays: [3.6, 4.2, 4.6, 4.2, 3.6], depth: [3.6, 3.8, 3.6], colH: 4.4, base: 1.2, front: 'doors', back: 'red', sides: 'red', steps: ['s'], roof: { chimi: true } };
	const godHall = (tint: string, colH = 3.8): HallSpec => ({ ...redHall, bays: [3.2, 3.6, 4, 3.6, 3.2], depth: [3.2, 3.4, 3.2], colH, roof: { chimi: true, tint } });
	const godCourt = (id: IsleId, tint: string, label: NonNullable<CourtSpec['label']>, more: Partial<CourtSpec> = {}): CourtSpec => ({
		x: ISLES[id].x,
		z: ISLES[id].z - 12,
		w: 64,
		d: 52,
		y: isleY(ISLES[id]),
		pave: 'paving',
		main: godHall(tint),
		label,
		...more
	});
	return buildRecipe({
		name: 'skypalace',
		seed: 11,
		near: { minX: -1100, maxX: 1100, minZ: -1100, maxZ: 1000 },
		cell: 5,
		plain: SK.plain,
		roll: 3,
		mountains: [
			{ x: -3600, z: -3000, rx: 1600, rz: 1400, h: 620, seed: 1.2 },
			{ x: 4000, z: -2400, rx: 1500, rz: 1400, h: 560, seed: 2.4 },
			{ x: -2800, z: 3600, rx: 1600, rz: 1400, h: 480, seed: 3.5 }
		],
		hills: Object.values(ISLES).map((s: Isle, i) => ({ x: s.x, z: s.z, rx: s.r, rz: s.r * 0.86, h: s.h, seed: 7 + i, power: 0.55, top: SK.top + (s.lift ?? 0) })),
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
			godCourt('haemosu', '#f0b429', { id: 'haemosu', en: 'Haemosu’s hall', ko: '해모수궁', status: 'fictional', note: 'The sun’s son keeps his chariot of five dragons at the gate' }),
			godCourt('ibiga', '#1e4d9c', { id: 'ibiga', en: 'Ibiga’s hall', ko: '이비가궁', status: 'fictional', note: 'The cloud goddess weaves the weather on the loom in her court' }),
			godCourt('samsin', '#e8b4c8', { id: 'samsin', en: 'Samsin’s hall', ko: '삼신궁', status: 'fictional', note: 'Every child on earth begins as a flower in her garden' }),
			godCourt('hwanin', '#f4f1e8', { id: 'hwanin', en: 'The Sky Lord’s hall', ko: '하늘님 궁', status: 'fictional', note: 'Highest of the isles. Three seals wait on the altar' }, { w: 76, d: 60, main: godHall('#f4f1e8', 4.6), upper: { bays: [3.2, 3.8, 3.2], depth: [3.2, 3.2], colH: 3.6, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true, tint: '#f4f1e8' } } })
		],
		trees: { n: 3200, kinds: ['pine', 'pine', 'cherry'], h: [6, 11], min: SK.cloud + 10 },
		extra: (c) => {
			// the star tower on its own isle
			const tw = ISLES.tower;
			tower(c.b, at(tw.x, isleY(tw), tw.z), { bays: [3.6, 4, 3.6], depth: [3.6, 4, 3.6], colH: 5, base: 1.6, front: 'red', back: 'red', sides: 'red', steps: ['s'] }, { bays: [3.2, 3.6, 3.2], depth: [3.2, 3.6, 3.2], colH: 4, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 4, chimi: false } });
			// Haemosu: the dragon chariot and the crow in the sun before his gate
			const hm = ISLES.haemosu;
			dragonChariot(c.b, hm.x, isleY(hm), hm.z + 22);
			for (const s of [1, -1]) sunCrow(c.b, hm.x + s * 22, isleY(hm), hm.z + 18);
			// Ibiga: her loom, her rain jars, and a few clouds she keeps close
			const ib = ISLES.ibiga;
			const iy = isleY(ib);
			for (const s of [1, -1]) box(c.b, 'wood', at(ib.x + s * 2.4, iy, ib.z + 24), 0, 1.6, 0, 0.2, 3.2, 0.2);
			box(c.b, 'wood', at(ib.x, iy, ib.z + 24), 0, 3.1, 0, 5, 0.2, 0.2);
			box(c.b, 'white', at(ib.x, iy, ib.z + 24), 0, 1.9, 0, 4.4, 2.2, 0.03);
			for (const k of [-1, 0, 1]) cylinder(c.b, 'brick', at(ib.x + 14 + k * 2.2, iy, ib.z + 20), 0, 0.7, 0, 0.75, 0.55, 1.4, 12);
			for (let k = 0; k < 14; k++) {
				const a = (k / 14) * Math.PI * 2;
				const r = 30 + c.rand() * 25;
				c.b.push('cloud', new THREE.IcosahedronGeometry(3 + c.rand() * 4, 1), at(ib.x + Math.cos(a) * r, iy + 8 + c.rand() * 14, ib.z + Math.sin(a) * r));
			}
			// Samsin: a ring of birth flowers round her court, and the white thread of long life between two posts
			const sm = ISLES.samsin;
			const sy = isleY(sm);
			const birth = BLOOMS.find((f) => f.id === 'birth') ?? BLOOMS[0];
			const ring: P2[] = [];
			for (let k = 0; k < 160; k++) {
				const a = (k / 160) * Math.PI * 2;
				const r = 40 + c.rand() * 12;
				ring.push([sm.x + Math.cos(a) * r, sm.z - 12 + Math.sin(a) * r * 0.86]);
			}
			bloomPatch(c.b, birth, () => sy, c.rand, ring, [1.4, 2.2], ['#ffd2e2', '#fff4f0', '#f7a8c4']);
			for (const s of [1, -1]) box(c.b, 'wood', at(sm.x + s * 12, sy, sm.z + 22), 0, 1.4, 0, 0.18, 2.8, 0.18);
			box(c.b, 'white', at(sm.x, sy, sm.z + 22), 0, 2.6, 0, 24, 0.04, 0.04);
			// the Sky Lord: the altar of the three seals (sword, mirror, bell) and a tall sandalwood at the edge
			const hw = ISLES.hwanin;
			const hy = isleY(hw);
			const az = hw.z + 24;
			box(c.b, 'stone', at(hw.x, hy, az), 0, 0.6, 0, 6, 1.2, 2.6);
			box(c.b, 'stone', at(hw.x - 1.8, hy + 1.2, az, 0.3), 0, 0.06, 0, 0.16, 0.12, 2.2);
			box(c.b, 'gold', at(hw.x - 1.8, hy + 1.2, az, 0.3), 0, 0.08, 1.1, 0.3, 0.16, 0.5);
			c.b.push('gold', new THREE.CylinderGeometry(0.55, 0.55, 0.08, 20).rotateX(Math.PI / 2.4), at(hw.x, hy + 1.75, az));
			cylinder(c.b, 'gold', at(hw.x + 1.9, hy + 1.2, az), 0, 0.45, 0, 0.3, 0.45, 0.9, 12);
			c.forest.add('broad', hw.x - 40, hy, hw.z + 30, 20);
			// the bridges: a ring round the gods' isles, and a spoke from each to Little Star's
			RING.forEach((id, k) => bridgeIsles(c.b, ISLES[id], ISLES[RING[(k + 1) % RING.length]]));
			for (const id of RING) bridgeIsles(c.b, ISLES.star, ISLES[id]);
			for (const isle of Object.values(ISLES) as Isle[]) {
				c.taken.add(isle.x, isle.z, 130, 130);
				for (const dx of [-14, 14]) stoneLantern(c.b, isle.x + dx, isleY(isle), isle.z + 30, 1.1);
			}
			c.root.add(cloudSea(c.p, c.rand, { cx: 0, cz: -40, r0: 200, r1: 8000, y: SK.cloud, height: c.g.height, puffs: 200 }));
			c.labels.push({ id: 'tower', en: 'Star tower', ko: '별 누각', at: [tw.x, isleY(tw) + 30, tw.z], status: 'fictional' });
			c.labels.push({ id: 'chariot', en: 'Chariot of five dragons', ko: '오룡거', at: [hm.x, isleY(hm) + 12, hm.z + 30], status: 'fictional' });
			c.labels.push({ id: 'skybridge', en: 'Sky bridges', ko: '하늘다리', at: [(ISLES.star.x + ISLES.haemosu.x) / 2, deckY + 26, (ISLES.star.z + ISLES.haemosu.z) / 2], status: 'fictional', note: 'Every god’s isle is a bridge from every other' });
		},
		views: () => [
			{ id: 'isles', en: 'Above the clouds', ko: '구름 위', pos: [420, SK.top + 220, 760], target: [0, SK.top - 10, -40], fov: 48 },
			{ id: 'bridge', en: 'On a bridge', ko: '구름다리', pos: [234, deckY + 19, -126], target: [0, deckY + 8, 0], fov: 48 },
			{ id: 'court', en: 'Palace court', ko: '궁 마당', pos: [30, deckY + 14, 75], target: [0, deckY + 6, -20], fov: 48 },
			{ id: 'chariot', en: 'Haemosu’s gate', ko: '해모수궁 앞', pos: [ISLES.haemosu.x + 34, deckY + 16, ISLES.haemosu.z + 62], target: [ISLES.haemosu.x, deckY + 4, ISLES.haemosu.z + 10], fov: 46 },
			{ id: 'highest', en: 'Up to the Sky Lord', ko: '하늘님 궁을 올려다보며', pos: [-60, deckY + 4, 150], target: [ISLES.hwanin.x, isleY(ISLES.hwanin) + 12, ISLES.hwanin.z], fov: 46 },
			{ id: 'below', en: 'From the cloud sea', ko: '구름 바다에서', pos: [-560, SK.cloud + 14, 420], target: [0, SK.top + 20, -60], fov: 42 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 2200, 200], target: [0, 0, -40], fov: 40 }
		],
		mist: [
			{ y: SK.cloud - 4, opacity: 0.4 },
			{ y: SK.cloud + 16, opacity: 0.16 }
		],
		center: [0, -20],
		radius: 750,
		haze: '#f3dcc4',
		realm: { top: '#3a6fb0', bottom: '#ffd9a0', fog: '#f6dcc0', fogNear: 700, fogFar: 7000, motes: '#fff2c4', sun: '#ffe2a8', sunI: 2.6, hemi: '#dfe8ff', light: 'golden' },
		weather: { motes: '#fff2c4' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 11);
			folk.audience(0, -22, 0, { y: deckY, near: 12, far: 40, n: 5, who: 'lady' });
			for (const id of RING) {
				const isle = ISLES[id];
				folk.knot(['lady', 'official'], isle.x, isle.z + 30, 8, 3, { y: isleY(isle) });
			}
			return {
				kingdom: 'silla',
				walk: [
					[-40, 52],
					[40, 52],
					[60, 30],
					[-60, 30],
					[-40, 52]
				],
				door: [0, -22],
				height: () => deckY,
				seed: 11,
				people: 10,
				folk
			};
		}
	});
}
