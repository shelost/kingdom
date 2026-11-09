import * as THREE from 'three';
import { TEN_HELLS } from '$lib/cosmos';
import { rect, noise, chaikin, resample, type P2 } from './geo';
import { at, box, cylinder, hall, flat, fence, gate, ribbon, stoneLantern, stonePagoda, storeyed, painted, cloister, pavedCourt, type Builder, type HallSpec, type Mat, type Paint } from './kit';
import { pick } from './common';
import { cloudSea } from './fortress';
import { buildRecipe, type RecipeCtx } from './recipe';
import { Folk, type Role } from './people';
import { Fleet } from './boats';
import type { BuildOptions, SiteBuild } from './types';

/*
 * The myth realms. Their skies are painted (`realm`), not the hour's: the Three Realms Pavilion
 * on its islet where three coloured waters meet, Hallakgungi's ten flower plots on their oval
 * island in the Ocean of Life, the Gateway (명부) where the Ten Kings stand over the road to Big
 * Star's court past the River of Three Crossings, and the gods' isles of the Sky Palace
 * joined by bridges above a sea of cloud. Everything is still built from the same Korean timber, stone and tile.
 */

/** A village guardian post (장승): a carved pole with a grim painted face under a black hat. */
export function jangseung(b: Builder, x: number, y: number, z: number, rot: number, s = 1): void {
	const m = at(x, y, z, rot, s);
	box(b, 'wood', m, 0, 1.7, 0, 0.7, 3.4, 0.6);
	box(b, 'wood', m, 0, 3.9, 0, 0.95, 1.3, 0.8, { bevel: 0.08 });
	box(b, 'dark', m, 0, 4.25, 0.41, 0.7, 0.12, 0.05);
	for (const side of [1, -1]) box(b, 'white', m, side * 0.2, 4, 0.41, 0.18, 0.18, 0.04);
	box(b, 'wallRed', m, 0, 3.5, 0.41, 0.42, 0.1, 0.04);
	cylinder(b, 'dark', m, 0, 4.6, 0, 0.8, 0.8, 0.08, 14);
	cylinder(b, 'dark', m, 0, 4.92, 0, 0.32, 0.36, 0.56, 12);
}

/** A red arrow gate (홍살문): two posts, a beam crowned with a row of spikes, a roundel in the middle. */
export function hongsalmun(b: Builder, x: number, y: number, z: number, rot: number, w = 8, h = 8, mat: Mat = 'wallRed'): void {
	const m = at(x, y, z, rot);
	for (const side of [1, -1]) box(b, mat, m, (side * w) / 2, h / 2, 0, 0.45, h, 0.45);
	box(b, mat, m, 0, h - 1.4, 0, w + 1.4, 0.42, 0.42);
	box(b, mat, m, 0, h - 2.6, 0, w, 0.3, 0.3);
	for (let u = -w / 2 + 0.4; u <= w / 2 - 0.4; u += 0.55) box(b, mat, m, u, h - 0.5, 0, 0.1, 1.6, 0.1);
	b.push('gold', new THREE.CylinderGeometry(0.75, 0.75, 0.12, 22).rotateX(Math.PI / 2), m.clone().multiply(at(0, h + 0.5, 0)));
}

/** A plank bridge from a to b at deck height y, with rails and posts down to `foot`. */
export function plankBridge(b: Builder, a: P2, c: P2, y: number, w = 4, foot?: number): void {
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

type Upper = Omit<HallSpec, 'base'>;

/**
 * Dancheong schemes for the gods' palaces. Each keeps the Korean grammar (glazed tile, painted
 * columns, white or coloured walls, banded brackets) and lets one colour carry the house.
 */
export const PALACE_PAINT = {
	/** Little Star: celadon-jade tile over vermilion, the house colours of the world he rules. */
	star: { tile: '#3c9c84', timber: '#b3312a', wallRed: '#b3312a', plaster: '#f7f0e2', green: '#2f8a6c', bracket: '#3f8d98', soffit: '#2e6f7c', courses: '#e2d8c6' },
	/** Haemosu: gold tile on crimson, orange brackets, the sun's son. */
	haemosu: { tile: '#e8ad2c', timber: '#9e1b1b', wallRed: '#9e1b1b', plaster: '#fff0cc', green: '#d4651e', bracket: '#e0782a', soffit: '#8a2416', courses: '#e8d4a8' },
	/** Ibiga: indigo tile, slate-blue columns, cloud-white walls. */
	ibiga: { tile: '#2f4f9e', timber: '#46689a', wallRed: '#46689a', plaster: '#eef3fb', green: '#6f9ad6', bracket: '#8fb4e4', soffit: '#2c4478', courses: '#d6dde8' },
	/** Samsin: peach-pink tile, rose columns, jade-bud bands. */
	samsin: { tile: '#e892b2', timber: '#c45a7c', wallRed: '#c45a7c', plaster: '#fff4f6', green: '#86c49a', bracket: '#f2b6cb', soffit: '#a8486a', courses: '#f2e2e4' },
	/** The Sky Lord: white glaze, gilt columns, marble terraces. */
	hwanin: { tile: '#f2eee4', timber: '#c79f3a', wallRed: '#c79f3a', plaster: '#fffdf6', green: '#d9c37c', bracket: '#eadcac', soffit: '#a8862e', courses: '#f6f2ea', stone: '#f8f5ee' },
	/** The Gateway: black glaze and oxblood, lavender walls, dusk-violet bands. */
	gateway: { tile: '#2a2a38', timber: '#5c1622', wallRed: '#5c1622', plaster: '#d8d0e6', green: '#3c5c5c', bracket: '#4c3c6c', soffit: '#2c2440', courses: '#4a4658' }
} satisfies Record<string, Paint>;

/** A divine palace: a cloister with a two-storey gate, corner pavilions, a paved yard and a storeyed hall on a two-step terrace (월대). */
type Grand = {
	W: number;
	D: number;
	main: HallSpec;
	uppers?: Upper[];
	wings?: HallSpec;
	/** Two-storey pavilions on the front corners of the cloister. */
	towers?: boolean;
	terrace?: number;
	paint: Paint;
};

/** Builds a `Grand` palace facing south at (cx, y, cz); returns the main hall's ridge above y and its z. */
function grandPalace(b: Builder, cx: number, y: number, cz: number, o: Grand): { ridge: number; hz: number } {
	return painted(b, o.paint, () => {
		const t = o.terrace ?? 2.4;
		const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
		const mw = sum(o.main.bays) + 6;
		const md = sum(o.main.depth) + 6;
		const hz = cz - o.D * 0.16;
		cloister(b, cx, cz, o.W, o.D, y, { width: 6, corners: true, gate: { bays: [3.6, 4.2, 4.6, 4.2, 3.6], depth: [3.4, 3.4], colH: 4.2, twoStorey: true } });
		pavedCourt(b, cx, (hz + md / 2 + 8 + cz + o.D / 2 - 4) / 2, o.W - 16, cz + o.D / 2 - 4 - (hz + md / 2 + 8), y + 0.06, { axis: 4, lanterns: true });
		// the terrace in two steps, a stair up the front of each
		box(b, 'courses', at(cx, y, hz), 0, t / 4, 0, mw + 14, t / 2, md + 16, { bevel: 0.12 });
		box(b, 'courses', at(cx, y, hz), 0, (t * 3) / 4, 0, mw + 4, t / 2, md + 6, { bevel: 0.12 });
		for (let k = 0; k < 4; k++) box(b, 'stone', at(cx, y, hz + md / 2 + 3 + (4 - k) * 1.1), 0, ((k + 1) * t) / 8, 0, 9, ((k + 1) * t) / 4, 1.2);
		const hall0 = o.uppers?.length ? storeyed(b, at(cx, y + t, hz), o.main, o.uppers) : hall(b, at(cx, y + t, hz), o.main);
		if (o.wings) {
			for (const side of [-1, 1]) hall(b, at(cx + side * o.W * 0.34, y, cz + o.D * 0.1, side * (Math.PI / 2)), o.wings);
		}
		if (o.towers) {
			for (const side of [-1, 1]) {
				const tx = cx + side * (o.W / 2 - 2);
				const tz = cz + o.D / 2 - 2;
				box(b, 'courses', at(tx, y, tz), 0, 1.6, 0, 15, 3.2, 15, { bevel: 0.15 });
				storeyed(
					b,
					at(tx, y + 3.2, tz),
					{ bays: [3, 3.6, 3], depth: [3, 3.6, 3], colH: 3.8, base: 0.3, front: 'open', back: 'open', sides: 'open', rail: true },
					[{ bays: [2.8, 3.2, 2.8], depth: [2.8, 3.2, 2.8], colH: 3.2, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 4.6, finial: true } }]
				);
			}
		}
		// on the lower step's front corners, clear of the hall front so the lamp does not wash it white
		for (const side of [-1, 1]) b.lampPost(cx + side * (mw / 2 + 4), y + t / 2, hz + md / 2 + 6);
		return { ridge: t + hall0.ridge, hz };
	});
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

/** The Ocean of Life's weak cyan (약수), shared by every western realm on its shore. */
export const LIFE_WATER = '#bff0ff';
const FF = { plain: 20, sea: 16, floor: 2, gate: 420 };

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
/** The meadow is one long oval island in the Ocean of Life; > 0 is water. */
const ISLAND = { x: (FIELD.minX + FIELD.maxX) / 2 + 60, z: 0, rx: 760, rz: 430 };
const shore = (x: number, z: number) => (Math.hypot((x - ISLAND.x) / ISLAND.rx, (z - ISLAND.z) / ISLAND.rz) + noise(x / 260, z / 260) * 0.05 - 1) * 5;
const JETTY = { x0: ISLAND.x + ISLAND.rx - 70, x1: ISLAND.x + ISLAND.rx + 70 };
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
		near: { minX: ISLAND.x - ISLAND.rx - 500, maxX: ISLAND.x + ISLAND.rx + 500, minZ: -ISLAND.rz - 500, maxZ: ISLAND.rz + 500 },
		cell: 5,
		plain: FF.plain,
		roll: 0.8,
		mountains: [],
		sea: { level: FF.sea, floor: FF.floor, mask: shore, box: { minX: -9000, maxX: 9000, minZ: -9000, maxZ: 9000 }, color: LIFE_WATER },
		look: {
			fields: ['#9cb57a', '#a9bd86', '#93ae72', '#b2c08e'],
			forest: ['#6a8a62', '#76966c'],
			rock: '#9a8f9a',
			bed: '#9ad6e2',
			bank: '#d8d0e0',
			sand: '#f4ecdc',
			paint: (x, z, _y, _s, n) => {
				if (shore(x, z) > -0.4) return null;
				if (!inField(x, z)) return n > 0 ? '#cdb8d8' : '#b9c7a2';
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
					[JETTY.x0, 0],
					[FF.gate + 6, 0]
				],
				5
			);
			for (let x = FF.gate + 30; x < JETTY.x0 - 20; x += 24) {
				for (const s of [1, -1]) c.forest.add('cherry', x, c.g.height(x, s * 9), s * 9, 7 + c.rand() * 2);
			}
			// the landing: a plank jetty out into the weak water, where the ferry from the middle road ties up
			plankBridge(c.b, [JETTY.x0, 0], [JETTY.x1, 0], FF.sea + 1.2, 5, FF.floor);
			c.taken.add((JETTY.x0 + JETTY.x1) / 2, 0, JETTY.x1 - JETTY.x0, 12);
			c.labels.push({ id: 'gate', en: 'The Gardener’s gate', ko: '꽃밭 문', at: [FF.gate, gy + gt.ridge + 1.5, 0], status: 'fictional', note: 'Hallakgungi keeps it' });
			c.labels.push({ id: 'landing', en: 'The landing', ko: '나루', at: [JETTY.x1 - 20, FF.sea + 12, 0], status: 'fictional', note: 'Three thousand li of water from the spring, and this is where it ends' });
			c.labels.push({ id: 'yaksu', en: 'Ocean of Life', ko: '약수', at: [ISLAND.x, FF.sea + 30, ISLAND.rz + 260], status: 'fictional', note: 'Weak water that will not float a feather; the whole Western Heavens but this island' });
		},
		views: () => [
			{ id: 'island', en: 'The island', ko: '꽃섬', pos: [ISLAND.x + ISLAND.rx + 700, FF.plain + 420, ISLAND.rz + 700], target: [ISLAND.x, FF.plain, 0], fov: 44 },
			{ id: 'landing', en: 'From the landing', ko: '나루에서', pos: [JETTY.x1 + 6, FF.sea + 4, 6], target: [FF.gate, FF.plain + 3, 0], fov: 44 },
			{ id: 'gate', en: 'At the gate', ko: '문 앞', pos: [FF.gate + 62, FF.plain + 4.5, 0], target: [FF.gate - 200, FF.plain + 1, 0], fov: 46 },
			{ id: 'plots', en: 'Among the plots', ko: '꽃밭 사이', pos: [plotAt(0).x + PLOT.w / 2 + 6, FF.plain + 3.2, 4], target: [plotAt(3).x, FF.plain + 1, -30], fov: 50 },
			{ id: 'above', en: 'Over the field', ko: '꽃밭 위', pos: [FF.gate + 80, FF.plain + 150, 300], target: [plotAt(2).x, FF.plain, 0], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [ISLAND.x, 2600, 300], target: [ISLAND.x, 0, 0], fov: 40 }
		],
		mist: [
			{ y: FF.sea + 1.2, opacity: 0.3 },
			{ y: FF.plain + 4, opacity: 0.16 },
			{ y: FF.plain + 9, opacity: 0.08 }
		],
		center: [ISLAND.x, 0],
		radius: 900,
		haze: '#f0dcef',
		water: { color: '#ffffff', roughness: 0.12, metalness: 0.04, painted: true },
		realm: { top: '#7d8fe0', bottom: '#ffe0ef', fog: '#f1dcef', fogNear: 400, fogFar: 5200, motes: '#fff3b0', sun: '#fff1e6', sunI: 2, hemi: '#efe6ff', light: 'day' },
		weather: { petals: true, motes: '#fff3b0' },
		life: (c) => {
			const folk = new Folk('tamla', c.g.height, 7);
			folk.stand('man', FF.gate + 6, 4, -Math.PI / 2);
			const tenders: Role[] = ['woman', 'woman', 'man'];
			for (let i = 0; i < BLOOMS.length; i++) {
				const p = plotAt(i);
				folk.stand(pick(tenders, c.rand()), p.x + (c.rand() - 0.5) * 30, p.z - Math.sign(p.z) * (PLOT.d / 2 + 5), c.rand() * Math.PI * 2);
			}
			const fleet = new Fleet(FF.sea + 0.05, 'tamla', 7);
			fleet.moor('skiff', JETTY.x1 - 14, 9, Math.PI / 2);
			return { kingdom: 'tamla', walk: [[JETTY.x0, 2], [FF.gate + 10, 2]], height: c.g.height, seed: 7, people: 8, folk, fleet };
		}
	});
}

/* ------------------------------------------------------------------ The Gateway (명부) */

const UW = { plain: 10, sea: 3, floor: -14, terrace: 7 };
const UW_PAL = { x: 0, z: -330, w: 300, d: 380 };
/** The avenue of the Ten Kings up to the gate: odd courts on the east, even on the west, Yumla the tallest. */
const KING_ROW = { x: 36, z0: 78, step: 40 };
const UW_GATE: P2 = [0, UW_PAL.z + UW_PAL.d / 2];
/** The River of Three Crossings (삼도천): the bridge for the good, the shallows for the middling, the deep water for the wicked. */
const lakeMask = (x: number, z: number) => (1 - Math.hypot(x / 760, (z - 560) / 440)) * 3;
const FORD_X = -260;
const DEEP_X = 300;

/**
 * One of the Ten Kings (시왕) as a colossus, about 28 m at s = 1: a judge in a wide-sleeved robe of
 * his court's colour, a gold-rimmed tablet held out, a black beard, and the flat crown with bead
 * curtains (면류관). A gold mandorla stands behind the head. A brazier burns on the plinth before him.
 */
function tenKing(b: Builder, x: number, y: number, z: number, rot: number, color: string, s: number): number {
	const m = at(x, y, z, rot, s);
	box(b, 'courses', m, 0, 0.5, 0, 12, 1, 12, { bevel: 0.2 });
	box(b, 'courses', m, 0, 1.35, 0, 10, 0.7, 10, { bevel: 0.16 });
	box(b, 'stone', m, 0, 2, 0, 8, 0.55, 8, { bevel: 0.1 });
	for (const sx of [1, -1]) {
		for (const sz of [1, -1]) {
			box(b, 'stone', m, sx * 4.4, 2.7, sz * 4.4, 0.7, 0.55, 1.4);
			box(b, 'stone', m, sx * 4.4, 3.25, sz * 4.4 + 0.45, 0.5, 0.45, 0.5);
		}
	}
	painted(b, { plaster: color }, () => {
		cylinder(b, 'plaster', m, 0, 6.4, 0, 3.8, 2.3, 8.4, 12);
		box(b, 'plaster', m, 0, 12.8, 0, 4.8, 6.4, 2.9, { bevel: 0.28 });
		for (const side of [1, -1]) {
			box(b, 'plaster', m, side * 3.6, 12.4, 0.35, 2.6, 5.6, 2.7, { bevel: 0.35 });
			box(b, 'plaster', m, side * 3.6, 9.3, 0.7, 1.7, 0.45, 1.7);
		}
	});
	for (let k = -2; k <= 2; k++) box(b, 'dark', m, k * 0.58, 6.5, 2.45, 0.1, 7.4, 0.08);
	box(b, 'gold', m, 0, 10.7, 0.2, 5, 0.55, 3.1);
	box(b, 'gold', m, 0, 13.4, 1.55, 1.3, 1.3, 0.12);
	box(b, 'white', m, 0, 11.4, 2.55, 1, 5, 0.22);
	box(b, 'gold', m, 0, 11.4, 2.7, 1.15, 5.2, 0.06);
	for (const side of [1, -1]) box(b, 'plaster', m, side * 0.75, 10.3, 2.2, 0.75, 0.55, 0.7);
	box(b, 'gold', m, 0, 15.4, 1.15, 2.4, 0.4, 0.55);
	box(b, 'plaster', m, 0, 17.4, 0.15, 2.4, 2.9, 2.3, { bevel: 0.32 });
	for (const side of [1, -1]) box(b, 'plaster', m, side * 1.3, 17.3, 0.15, 0.28, 0.75, 0.36);
	box(b, 'dark', m, 0, 16.2, 1.2, 1.35, 1.7, 0.38);
	box(b, 'dark', m, 0, 15.2, 1.3, 0.7, 1.15, 0.28);
	for (const side of [1, -1]) {
		box(b, 'white', m, side * 0.45, 17.7, 1.28, 0.34, 0.16, 0.08);
		box(b, 'dark', m, side * 0.45, 17.7, 1.34, 0.12, 0.12, 0.05);
	}
	box(b, 'dark', m, 0, 17.3, 1.32, 0.16, 0.42, 0.1);
	box(b, 'dark', m, 0, 18.3, 1.22, 1.6, 0.12, 0.08);
	box(b, 'dark', m, 0, 19.5, 0, 3.6, 0.38, 2.7);
	box(b, 'gold', m, 0, 19.75, 0, 3.8, 0.14, 2.9);
	box(b, 'gold', m, 0, 20.2, 0.2, 1.1, 0.7, 0.28);
	for (const zz of [1.4, -1.4]) for (let k = -5; k <= 5; k++) box(b, 'gold', m, k * 0.32, 18.6, zz, 0.05, 1.6, 0.05);
	for (const side of [1, -1]) for (let k = -2; k <= 2; k++) box(b, 'gold', m, side * 1.8, 18.6, k * 0.38, 0.05, 1.45, 0.05);
	b.push('gold', new THREE.CylinderGeometry(3.4, 3.4, 0.14, 32).rotateX(Math.PI / 2), m.clone().multiply(at(0, 17, -1.35)));
	b.push('gold', new THREE.TorusGeometry(2.6, 0.1, 8, 32).rotateX(Math.PI / 2), m.clone().multiply(at(0, 17, -1.2)));
	cylinder(b, 'stone', m, 0, 2.55, 5.6, 1.15, 0.85, 1.4, 12);
	cylinder(b, 'dark', m, 0, 3.45, 5.6, 0.75, 0.55, 0.45, 10);
	const fx = Math.sin(rot) * 5.6 * s;
	const fz = Math.cos(rot) * 5.6 * s;
	b.lamps.push([x + fx, y + 3.9 * s, z + fz]);
	return 22.5 * s;
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

const ROADS = 78;
/** The mouth of the seventy-eight roads, on the south bank. The fan opens south; Kangrim's road runs north to the bridge. */
const MOUTH = { x: 0, z: 1280, r: 82, reach: 820 };
const roadSpread = (i: number) => (i === ROADS - 1 ? Math.PI : ((-75 + (150 * i) / (ROADS - 2)) * Math.PI) / 180);
const roadDir = (i: number): P2 => [Math.sin(roadSpread(i)), Math.cos(roadSpread(i))];
const roadColor = (i: number) => `#${new THREE.Color().setHSL((i / (ROADS - 1)) * 0.82, 0.55, 0.62).getHexString()}`;
const NAMED_ROADS: [number, string, string][] = [
	[0, 'The road when heaven and earth were one', '하늘땅이 한 덩어리였던 길'],
	[1, 'The road when heaven and earth split', '하늘땅이 갈라진 길'],
	[19, 'The road of kings', '임금 가는 길'],
	[38, 'The road of money', '돈 가는 길'],
	[57, 'The road of the five dragons', '오룡 가는 길']
];

/** Seventy-eight coloured roads leaving a paved mouth. The last one, Kangrim's, turns back toward the dead. */
function divergingRoads(c: RecipeCtx): void {
	const y = (x: number, z: number) => c.g.height(x, z);
	const ring: P2[] = [];
	for (let k = 0; k < 48; k++) {
		const a = (k / 48) * Math.PI * 2;
		ring.push([MOUTH.x + Math.cos(a) * MOUTH.r, MOUTH.z + Math.sin(a) * MOUTH.r]);
	}
	c.b.push('paving', flat(ring, UW.plain + 0.25));
	box(c.b, 'stone', at(MOUTH.x, UW.plain, MOUTH.z), 0, 0.6, 0, 3.6, 1.2, 2.2, { bevel: 0.1 });
	c.forest.add('pine', MOUTH.x + 22, UW.plain, MOUTH.z - 16, 14);
	c.taken.add(MOUTH.x, MOUTH.z, MOUTH.r * 2.2, MOUTH.r * 2.2);
	for (let i = 0; i < ROADS; i++) {
		const [dx, dz] = roadDir(i);
		const [px, pz] = [-dz, dx];
		const pts: P2[] = [];
		const far = i === ROADS - 1 ? 210 : MOUTH.reach;
		for (let r = MOUTH.r + 8; r <= far; r += 55) {
			const wob = noise(i * 3.7, r / 480) * Math.min(1, r / 500) * 28;
			pts.push([MOUTH.x + dx * r + px * wob, MOUTH.z + dz * r + pz * wob]);
		}
		const line = resample(chaikin(pts, 2, false), 6, false);
		c.b.pushColored('cloud', ribbon(line, i === ROADS - 1 ? 5.2 : 3.2, (x, z) => y(x, z) + 0.16), i === ROADS - 1 ? '#4a3058' : roadColor(i));
		if (i < ROADS - 2) {
			const a = roadSpread(i) + (roadSpread(i + 1) - roadSpread(i)) / 2;
			const gx = MOUTH.x + Math.sin(a) * (MOUTH.r + 2);
			const gz = MOUTH.z + Math.cos(a) * (MOUTH.r + 2);
			jangseung(c.b, gx, y(gx, gz), gz, Math.atan2(MOUTH.x - gx, MOUTH.z - gz), 0.62);
		}
	}
	const [kx, kz] = roadDir(ROADS - 1);
	hongsalmun(c.b, MOUTH.x + kx * (MOUTH.r + 6), UW.plain, MOUTH.z + kz * (MOUTH.r + 6), Math.atan2(kx, kz), 8, 8);
	for (let r = MOUTH.r + 24; r < 170; r += 28) {
		for (const side of [1, -1]) {
			const lx = MOUTH.x + kx * r - kz * side * 5;
			const lz = MOUTH.z + kz * r + kx * side * 5;
			c.b.lampPost(lx, y(lx, lz), lz);
		}
	}
	for (const [i, en, ko] of NAMED_ROADS) {
		const [dx, dz] = roadDir(i);
		c.labels.push({ id: `road-${i}`, en, ko, at: [MOUTH.x + dx * 280, UW.plain + 16, MOUTH.z + dz * 280], status: 'fictional' });
	}
	c.labels.push({
		id: 'kangrim',
		en: 'Human Kangrim’s road',
		ko: '인간 강림이 길',
		at: [MOUTH.x + kx * 120, UW.plain + 18, MOUTH.z + kz * 120],
		status: 'fictional',
		note: 'The last mouth. It is the only road that turns back, through the arrow gate, and crosses to the dead'
	});
	c.labels.push({
		id: 'mouth',
		en: '78 Diverging Roads',
		ko: '일흔여덟갈래길',
		at: [MOUTH.x, UW.plain + 22, MOUTH.z],
		status: 'fictional',
		note: 'The south bank of the river. Munjeon names every road; only Kangrim’s continues to the Gateway'
	});
}

export function buildUnderworld(_opts: BuildOptions): SiteBuild {
	const terraceY = UW.plain + UW.terrace;
	const dark: HallSpec = { bays: [3.4, 3.8, 3.8, 3.4], depth: [3.2, 3.2], colH: 3.8, base: 0.9, roof: { chimi: true } };
	const courts = [
		{ z: UW_PAL.z + 90, w: 200, d: 110 },
		{ z: UW_PAL.z - 40, w: 230, d: 150 },
		{ z: UW_PAL.z - 150, w: 170, d: 70 }
	];
	return buildRecipe({
		name: 'underworld',
		seed: 99,
		near: { minX: -1800, maxX: 1800, minZ: -1800, maxZ: 2500 },
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
			fields: ['#8a84a4', '#948eae', '#7e7898', '#9c96b4'],
			forest: ['#3a4a5c', '#445668', '#344454'],
			rock: '#6a647c',
			bed: '#2a3c4c',
			bank: '#8a849c',
			top: '#9a94ac',
			sand: '#5a6c7c',
			canopy: 0.55
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
			// the way in: the one-pillar gate, then the avenue of the Ten Kings, five to a side, facing across the road
			const iy = Math.max(ground(0, 70), deck);
			const il = gate(c.b, at(0, iy, 70), [6.2], [1.4], 5.6, { front: 'open', back: 'open', sides: 'open', gateLine: undefined, base: 0.4, roof: { chimi: false } });
			for (const king of TEN_HELLS) {
				const east = king.court % 2 === 1;
				const s = king.yumla ? 1.55 : 1.2;
				const x = (east ? 1 : -1) * (KING_ROW.x + (s - 1) * 10);
				const z = KING_ROW.z0 - Math.floor((king.court - 1) / 2) * KING_ROW.step;
				const ky = ground(x, z);
				const top = tenKing(c.b, x, ky, z, east ? -Math.PI / 2 : Math.PI / 2, king.color, s);
				c.taken.add(x, z, 10 * s, 10 * s);
				c.labels.push({ id: `king-${king.court}`, en: king.judge.en, ko: king.judge.ko, at: [x, ky + top + 4, z], status: 'fictional', note: `Court ${king.court}: ${king.hell.en}` });
			}
			envoyTable(c.b, 8, Math.max(ground(8, UW_GATE[1] + 16), deck), UW_GATE[1] + 16, 0);
			const py = ground(-48, 40);
			stonePagoda(c.b, at(-48, py, 40), 5, 4.2, 2.4, 'courses');
			// Big Star's Hall of Judgment: three storeys in black glaze and oxblood on a high terrace
			const jc = courts[1];
			const judge = grandPalace(c.b, 0, terraceY, jc.z, {
				W: jc.w,
				D: jc.d,
				main: { bays: [4.4, 5, 5.4, 5.8, 5.4, 5, 4.4], depth: [4.4, 5, 5, 4.4], colH: 6.2, base: 1, tiers: 2, steps: ['s'], front: 'windows', roof: { chimi: true } },
				uppers: [
					{ bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 4.6, front: 'windows', back: 'wall', sides: 'wall', roof: { chimi: true } },
					{ bays: [3.6, 4.2, 3.6], depth: [3.6, 3.6], colH: 3.8, front: 'windows', back: 'wall', sides: 'wall', roof: { chimi: true } }
				],
				wings: dark,
				towers: true,
				terrace: 3.4,
				paint: PALACE_PAINT.gateway
			});
			c.taken.add(0, jc.z, jc.w + 8, jc.d + 8);
			c.labels.push({ id: 'judgment', en: 'Hall of Judgment', ko: '심판전', at: [0, terraceY + judge.ridge + 7, judge.hz], status: 'fictional', note: 'Big Star’s court; Yumla judges here' });
			// the mirror and the scales in front of the judgment hall, lamps in every court
			const jz = jc.z + jc.d / 2 - 26;
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
			c.labels.push({ id: 'avenue', en: 'Avenue of the Ten Kings', ko: '시왕의 길', at: [0, iy + 34, KING_ROW.z0 - KING_ROW.step * 2], status: 'fictional', note: 'Every soul walks under all ten before it reaches the gate; each king will hear it in his turn' });
			c.labels.push({ id: 'mirror', en: 'Karma mirror', ko: '업경대', at: [-22, terraceY + 9, jz], status: 'fictional', note: 'It shows the dead what they did. The scales beside it weigh it' });
			c.labels.push({ id: 'causeway', en: 'The bridge', ko: '다리', at: [0, deck + 14, 560], status: 'fictional', note: 'The good cross dry. Kangrim walks them in' });
			c.labels.push({ id: 'ford', en: 'The shallows', ko: '여울', at: [FORD_X, UW.sea + 10, 560], status: 'fictional', note: 'The middling wade' });
			c.labels.push({ id: 'deep', en: 'The deep water', ko: '깊은 물', at: [DEEP_X, UW.sea + 10, 560], status: 'fictional', note: 'The wicked go under. The ferry takes the rest, for a coin' });
			c.labels.push({ id: 'samdo', en: 'River of Three Crossings', ko: '삼도천', at: [-560, UW.sea + 16, 420], status: 'fictional', note: 'It glows from below' });
			divergingRoads(c);
		},
		views: () => [
			{ id: 'causeway', en: 'Down the bridge', ko: '다리를 따라', pos: [6, UW.sea + 6, 300], target: [0, terraceY + 9, UW_GATE[1]], fov: 40 },
			{ id: 'kings', en: 'Between the Ten Kings', ko: '시왕 사이', pos: [4, UW.plain + 6, 110], target: [0, terraceY + 16, -70], fov: 50 },
			{ id: 'yumla', en: 'Under Yumla', ko: '염라대왕 발아래', pos: [6, UW.plain + 2, KING_ROW.z0 - KING_ROW.step * 2 + 14], target: [KING_ROW.x + 2.5, UW.plain + 22, KING_ROW.z0 - KING_ROW.step * 2], fov: 52 },
			{ id: 'gate', en: 'The gate', ko: '명부 문', pos: [40, terraceY + 10, UW_GATE[1] + 80], target: [0, terraceY + 10, UW_GATE[1]], fov: 46 },
			{ id: 'court', en: 'Court of judgment', ko: '심판의 뜰', pos: [60, terraceY + 26, UW_PAL.z + 60], target: [0, terraceY + 8, UW_PAL.z - 50], fov: 48 },
			{ id: 'crossings', en: 'The three crossings', ko: '세 갈래 건너기', pos: [0, 160, 1300], target: [0, 0, 560], fov: 50 },
			{ id: 'roads', en: 'The seventy-eight roads', ko: '일흔여덟갈래길', pos: [40, UW.plain + 70, 1120], target: [0, UW.plain + 2, 1680], fov: 54 },
			{ id: 'kangrim', en: 'Kangrim’s road', ko: '강림의 길', pos: [36, UW.plain + 18, 1180], target: [0, UW.plain + 6, 900], fov: 42 },
			{ id: 'valley', en: 'The navy valley', ko: '남빛 골짜기', pos: [700, 220, 1300], target: [0, 10, -100], fov: 46 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3000, 500], target: [0, 0, 100], fov: 40 }
		],
		mist: [
			{ y: UW.sea + 1.2, opacity: 0.18 },
			{ y: UW.plain + 8, opacity: 0.1 }
		],
		center: [0, 200],
		radius: 1100,
		haze: '#8aa8c4',
		water: { color: '#1a5a72', roughness: 0.12, metalness: 0.05, glow: { color: '#2eb8c4', k: 0.2 } },
		realm: { top: '#243e6e', bottom: '#c5d8ea', fog: '#6a90b0', fogNear: 900, fogFar: 9000, motes: '#d7f4ff', sun: '#f4f7ff', sunI: 1.85, hemi: '#c5d6ea', light: 'night' },
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
	star: { x: 0, z: 0, r: 330, h: 400 },
	samsin: { x: 60, z: -820, r: 190, h: 390 },
	ibiga: { x: 670, z: -360, r: 195, h: 385 },
	tower: { x: 620, z: 520, r: 150, h: 375 },
	hwanin: { x: -300, z: 730, r: 215, h: 460, lift: 50 },
	haemosu: { x: -760, z: -60, r: 200, h: 390 }
} satisfies Record<string, Isle>;
/** A god's palace court; the Sky Lord's is larger. */
const GOD = { W: 116, D: 96 };
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
	const STAR = { W: 210, D: 180 };
	const starHz = -STAR.D * 0.16;
	const godMain: HallSpec = { bays: [3.4, 3.8, 4.2, 3.8, 3.4], depth: [3.4, 3.6, 3.4], colH: 4.2, base: 0.8, tiers: 2, front: 'doors', back: 'red', sides: 'red', steps: ['s'], roof: { chimi: true } };
	const godUpper: Upper = { bays: [3.2, 3.8, 3.2], depth: [3.2, 3.2], colH: 3.4, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } };
	const godWing: HallSpec = { bays: [3, 3.4, 3.4, 3], depth: [2.8, 2.8], colH: 3.2, base: 0.6, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } };
	/** The open ground in front of a god's gate, where each keeps the thing they are known by. */
	const yard = (id: IsleId, D = GOD.D) => ISLES[id].z - 12 + D / 2 + 30;
	const gods: { id: Exclude<IsleId, 'star' | 'tower'>; en: string; ko: string; note: string; big?: boolean }[] = [
		{ id: 'haemosu', en: 'Haemosu’s palace', ko: '해모수궁', note: 'Gold tile on crimson. The sun’s son keeps his chariot of five dragons at the gate' },
		{ id: 'ibiga', en: 'Ibiga’s palace', ko: '이비가궁', note: 'Indigo tile and cloud-white walls. The cloud goddess weaves the weather on the loom in her court' },
		{ id: 'samsin', en: 'Samsin’s palace', ko: '삼신궁', note: 'Peach-pink tile. Every child on earth begins as a flower in her garden' },
		{ id: 'hwanin', en: 'The Sky Lord’s palace', ko: '하늘님 궁', note: 'White glaze and gilt, highest of the isles. Three seals wait on the altar', big: true }
	];
	return buildRecipe({
		name: 'skypalace',
		seed: 11,
		near: { minX: -1350, maxX: 1300, minZ: -1350, maxZ: 1300 },
		cell: 6,
		plain: SK.plain,
		roll: 3,
		mountains: [
			{ x: -4400, z: -3600, rx: 1600, rz: 1400, h: 620, seed: 1.2 },
			{ x: 4800, z: -3000, rx: 1500, rz: 1400, h: 560, seed: 2.4 },
			{ x: -3400, z: 4400, rx: 1600, rz: 1400, h: 480, seed: 3.5 }
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
		trees: { n: 4200, kinds: ['pine', 'pine', 'cherry'], h: [6, 11], min: SK.cloud + 10 },
		extra: (c) => {
			// Little Star's palace: the largest court, a two-storey hall on a high terrace, corner pavilions
			const star = grandPalace(c.b, 0, deckY, 0, {
				W: STAR.W,
				D: STAR.D,
				main: { bays: [4.4, 5, 5.4, 6, 5.4, 5, 4.4], depth: [4.4, 5, 5, 4.4], colH: 6, base: 1, tiers: 2, front: 'doors', back: 'red', sides: 'red', steps: ['s'], roof: { chimi: true } },
				uppers: [{ bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 4.6, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } }],
				wings: { bays: [3.4, 3.8, 3.8, 3.8, 3.4], depth: [3.2, 3.2], colH: 3.8, base: 0.8, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } },
				towers: true,
				terrace: 3.2,
				paint: PALACE_PAINT.star
			});
			c.labels.push({ id: 'palace', en: 'Little Star’s palace', ko: '소별왕궁', at: [0, deckY + star.ridge + 8, star.hz], status: 'fictional', note: 'Celadon tile over vermilion on floating rock' });
			// a palace for each god, painted in the god's own colours
			for (const god of gods) {
				const isle = ISLES[god.id];
				const iy = isleY(isle);
				const p = grandPalace(c.b, isle.x, iy, isle.z - 12, {
					W: god.big ? 140 : GOD.W,
					D: god.big ? 116 : GOD.D,
					main: god.big ? { ...godMain, colH: 4.8 } : godMain,
					uppers: god.big ? [godUpper, { ...godUpper, bays: [3, 3.4, 3], depth: [3, 3], colH: 3 }] : [godUpper],
					wings: godWing,
					towers: god.big,
					terrace: god.big ? 3 : 2.2,
					paint: PALACE_PAINT[god.id]
				});
				c.labels.push({ id: god.id, en: god.en, ko: god.ko, at: [isle.x, iy + p.ridge + 7, p.hz], status: 'fictional', note: god.note });
			}
			// the star tower on its own isle: three storeys in Little Star's colours
			const tw = ISLES.tower;
			const twr = painted(c.b, PALACE_PAINT.star, () => {
				box(c.b, 'courses', at(tw.x, isleY(tw), tw.z), 0, 1.4, 0, 22, 2.8, 22, { bevel: 0.15 });
				return storeyed(
					c.b,
					at(tw.x, isleY(tw) + 2.8, tw.z),
					{ bays: [3.6, 4, 3.6], depth: [3.6, 4, 3.6], colH: 5, base: 0.6, front: 'red', back: 'red', sides: 'red', steps: ['s'] },
					[
						{ bays: [3.2, 3.6, 3.2], depth: [3.2, 3.6, 3.2], colH: 4, front: 'doors', back: 'red', sides: 'red' },
						{ bays: [2.8, 3.2, 2.8], depth: [2.8, 3.2, 2.8], colH: 3.6, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 5, finial: true } }
					]
				);
			});
			// Haemosu: the dragon chariot and the crow in the sun before his gate
			const hm = ISLES.haemosu;
			dragonChariot(c.b, hm.x, isleY(hm), yard('haemosu'));
			for (const s of [1, -1]) sunCrow(c.b, hm.x + s * 24, isleY(hm), yard('haemosu') - 6);
			// Ibiga: her loom, her rain jars, and a few clouds she keeps close
			const ib = ISLES.ibiga;
			const iy = isleY(ib);
			const lz = yard('ibiga');
			for (const s of [1, -1]) box(c.b, 'wood', at(ib.x + s * 2.4, iy, lz), 0, 1.6, 0, 0.2, 3.2, 0.2);
			box(c.b, 'wood', at(ib.x, iy, lz), 0, 3.1, 0, 5, 0.2, 0.2);
			box(c.b, 'white', at(ib.x, iy, lz), 0, 1.9, 0, 4.4, 2.2, 0.03);
			for (const k of [-1, 0, 1]) cylinder(c.b, 'brick', at(ib.x + 14 + k * 2.2, iy, lz - 4), 0, 0.7, 0, 0.75, 0.55, 1.4, 12);
			for (let k = 0; k < 18; k++) {
				const a = (k / 18) * Math.PI * 2;
				const r = 70 + c.rand() * 40;
				c.b.push('cloud', new THREE.IcosahedronGeometry(4 + c.rand() * 5, 1), at(ib.x + Math.cos(a) * r, iy + 14 + c.rand() * 18, ib.z - 12 + Math.sin(a) * r));
			}
			// Samsin: a ring of birth flowers round her court, and the white thread of long life between two posts
			const sm = ISLES.samsin;
			const sy = isleY(sm);
			const birth = BLOOMS.find((f) => f.id === 'birth') ?? BLOOMS[0];
			const ring: P2[] = [];
			for (let k = 0; k < 260; k++) {
				const a = (k / 260) * Math.PI * 2;
				const r = 78 + c.rand() * 14;
				ring.push([sm.x + Math.cos(a) * r, sm.z - 12 + Math.sin(a) * r * 0.86]);
			}
			bloomPatch(c.b, birth, () => sy, c.rand, ring, [1.4, 2.2], ['#ffd2e2', '#fff4f0', '#f7a8c4']);
			const tz = yard('samsin');
			for (const s of [1, -1]) box(c.b, 'wood', at(sm.x + s * 12, sy, tz), 0, 1.4, 0, 0.18, 2.8, 0.18);
			box(c.b, 'white', at(sm.x, sy, tz), 0, 2.6, 0, 24, 0.04, 0.04);
			// the Sky Lord: the altar of the three seals (sword, mirror, bell) and a tall sandalwood at the edge
			const hw = ISLES.hwanin;
			const hy = isleY(hw);
			const az = yard('hwanin', 116);
			box(c.b, 'stone', at(hw.x, hy, az), 0, 0.6, 0, 6, 1.2, 2.6);
			box(c.b, 'stone', at(hw.x - 1.8, hy + 1.2, az, 0.3), 0, 0.06, 0, 0.16, 0.12, 2.2);
			box(c.b, 'gold', at(hw.x - 1.8, hy + 1.2, az, 0.3), 0, 0.08, 1.1, 0.3, 0.16, 0.5);
			c.b.push('gold', new THREE.CylinderGeometry(0.55, 0.55, 0.08, 20).rotateX(Math.PI / 2.4), at(hw.x, hy + 1.75, az));
			cylinder(c.b, 'gold', at(hw.x + 1.9, hy + 1.2, az), 0, 0.45, 0, 0.3, 0.45, 0.9, 12);
			c.forest.add('broad', hw.x - 90, hy, hw.z + 60, 22);
			// the bridges: a ring round the gods' isles, and a spoke from each to Little Star's
			RING.forEach((id, k) => bridgeIsles(c.b, ISLES[id], ISLES[RING[(k + 1) % RING.length]]));
			for (const id of RING) bridgeIsles(c.b, ISLES.star, ISLES[id]);
			for (const [id, isle] of Object.entries(ISLES) as [IsleId, Isle][]) {
				c.taken.add(isle.x, isle.z, isle.r * 1.3, isle.r * 1.3);
				const lz = id === 'star' ? STAR.D / 2 + 14 : id === 'tower' ? 26 : (id === 'hwanin' ? 116 : GOD.D) / 2 + 2;
				for (const dx of [-16, 16]) stoneLantern(c.b, isle.x + dx, isleY(isle), isle.z + lz, 1.2);
			}
			c.root.add(cloudSea(c.p, c.rand, { cx: 0, cz: -40, r0: 330, r1: 9000, y: SK.cloud, height: c.g.height, puffs: 260 }));
			c.labels.push({ id: 'tower', en: 'Star tower', ko: '별 누각', at: [tw.x, isleY(tw) + 2.8 + twr.ridge + 6, tw.z], status: 'fictional' });
			c.labels.push({ id: 'chariot', en: 'Chariot of five dragons', ko: '오룡거', at: [hm.x, isleY(hm) + 14, yard('haemosu') + 8], status: 'fictional' });
			c.labels.push({ id: 'skybridge', en: 'Sky bridges', ko: '하늘다리', at: [(ISLES.star.x + ISLES.haemosu.x) / 2, deckY + 30, (ISLES.star.z + ISLES.haemosu.z) / 2], status: 'fictional', note: 'Every god’s isle is a bridge from every other' });
		},
		views: () => [
			{ id: 'isles', en: 'Above the clouds', ko: '구름 위', pos: [760, SK.top + 380, 1300], target: [0, SK.top - 10, -60], fov: 48 },
			{ id: 'gate', en: 'Before Little Star’s gate', ko: '소별왕궁 문 앞', pos: [0, deckY + 2.5, STAR.D / 2 + 60], target: [0, deckY + 16, starHz], fov: 50 },
			{ id: 'bridge', en: 'On a bridge', ko: '구름다리', pos: [363, deckY + 20, -195], target: [0, deckY + 12, 0], fov: 48 },
			{ id: 'court', en: 'Palace court', ko: '궁 마당', pos: [40, deckY + 16, 120], target: [0, deckY + 10, starHz], fov: 48 },
			{ id: 'chariot', en: 'Haemosu’s gate', ko: '해모수궁 앞', pos: [ISLES.haemosu.x + 46, deckY + 16, ISLES.haemosu.z + 150], target: [ISLES.haemosu.x, deckY + 6, ISLES.haemosu.z + 30], fov: 46 },
			{ id: 'highest', en: 'Up to the Sky Lord', ko: '하늘님 궁을 올려다보며', pos: [-120, deckY + 6, 330], target: [ISLES.hwanin.x, isleY(ISLES.hwanin) + 14, ISLES.hwanin.z], fov: 46 },
			{ id: 'below', en: 'From the cloud sea', ko: '구름 바다에서', pos: [-900, SK.cloud + 14, 700], target: [0, SK.top + 20, -60], fov: 42 },
			{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3200, 300], target: [0, 0, -40], fov: 40 }
		],
		mist: [
			{ y: SK.cloud - 4, opacity: 0.4 },
			{ y: SK.cloud + 16, opacity: 0.16 }
		],
		center: [0, -20],
		radius: 1100,
		haze: '#f3dcc4',
		realm: { top: '#3a6fb0', bottom: '#ffd9a0', fog: '#f6dcc0', fogNear: 900, fogFar: 9000, motes: '#fff2c4', sun: '#ffe2a8', sunI: 2.6, hemi: '#dfe8ff', light: 'golden' },
		weather: { motes: '#fff2c4' },
		life: (c) => {
			const folk = new Folk('silla', c.g.height, 11);
			folk.audience(0, starHz, 0, { y: deckY, near: 22, far: 60, n: 6, who: 'lady' });
			for (const id of RING) {
				const isle = ISLES[id];
				folk.knot(['lady', 'official'], isle.x, id === 'tower' ? isle.z + 30 : yard(id, id === 'hwanin' ? 116 : GOD.D) + 14, 8, 3, { y: isleY(isle) });
			}
			return {
				kingdom: 'silla',
				walk: [
					[-60, 70],
					[60, 70],
					[80, 42],
					[-80, 42],
					[-60, 70]
				],
				door: [0, starHz + 20],
				height: () => deckY,
				seed: 11,
				people: 12,
				folk
			};
		}
	});
}
