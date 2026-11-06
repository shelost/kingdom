import * as THREE from 'three';
import { Region, rng, fbm, noise, smoothstep, distanceToPath, chaikin, resample, blob, centroid, type P2, type Bounds } from './geo';
import {
	Builder,
	palette,
	at,
	facing,
	box,
	hall,
	gate,
	tower,
	corridor,
	cloister,
	court,
	fence,
	stonePagoda,
	flat,
	skirt,
	ribbon,
	rampart,
	pavedCourt,
	gardenPond,
	stoneLantern,
	Forest,
	Town,
	type Palette
} from './kit';
import { nearGround, farGround, bump, type Ground } from './terrain';
import { lerp, mountainField, pick, contourRing, riverStrip, gridTown, assemble, bankCover } from './common';
import { Cover } from './nature';
import { reach } from './life';
import type { BuildOptions, Label, SiteBuild, View } from './types';

/*
 * Sabi (Buyeo), Baekje's last capital (538–660). Origin at the Gwanbuk-ri palace site.
 * Busosan rises north of it; the Baengma (Geum) wraps the hill's north side and runs down the
 * west of the city; Naseong, the earthen outer wall, follows the hills on the east.
 * Distances come from the modern map, rounded; the halls on the palace site are placed.
 */

const PLAIN = 4;
const WATER = 0;
const BED = -4;

const RIVER: P2[] = [
	[2600, -2100],
	[1800, -1500],
	[1100, -1150],
	[500, -1010],
	[-100, -960],
	[-560, -820],
	[-900, -520],
	[-1080, -60],
	[-1120, 520],
	[-960, 1120],
	[-640, 1680],
	[-140, 2140],
	[560, 2460],
	[1500, 2650],
	[2600, 2700]
];
const RIVER_HALF = 140;

const NASEONG: P2[] = [
	[700, -560],
	[860, -380],
	[1040, -110],
	[1180, 250],
	[1250, 700],
	[1250, 1200],
	[1160, 1700],
	[1060, 2150]
];

const PALACE = { x: 0, z: 0, w: 400, d: 300 };
const FRONT = PALACE.z + PALACE.d / 2 - 40;
const JEONGNIM = { x: -40, z: 960 };
const GUNGNAM = { x: -260, z: 1900 };

const mountains = mountainField([
	{ x: 1900, z: 500, rx: 800, rz: 1700, h: 150, seed: 1.1 },
	{ x: -2600, z: 300, rx: 900, rz: 1500, h: 190, seed: 2.2 },
	{ x: 400, z: -2900, rx: 1600, rz: 800, h: 170, seed: 3.3 },
	{ x: 3600, z: -1400, rx: 1800, rz: 1800, h: 330, seed: 4.4 },
	{ x: -5200, z: -2600, rx: 2600, rz: 2200, h: 420, seed: 5.5 },
	{ x: 900, z: 5600, rx: 3800, rz: 1800, h: 360, seed: 6.6 },
	{ x: 6800, z: 2400, rx: 2400, rz: 3000, h: 520, seed: 7.7 },
	{ x: -2200, z: -5600, rx: 2600, rz: 1500, h: 560, seed: 8.1 },
	{ x: 2600, z: -6400, rx: 3000, rz: 1700, h: 640, seed: 9.2 },
	{ x: 200, z: -9800, rx: 4200, rz: 2000, h: 820, seed: 10.4 }
]);

/** Busosan: a long hill with two summits, cut off steeply by the river on the north (Nakhwaam). */
function buso(x: number, z: number): number {
	const main = bump(x, z, 160, -560, 560, 300) * 84 + bump(x, z, -140, -650, 240, 190) * 26 + bump(x, z, 420, -600, 230, 180) * 18;
	return main * (0.85 + 0.3 * fbm(x / 140, z / 140, 3));
}

function naseongHills(x: number, z: number): number {
	if (x < 500) return 0;
	const d = distanceToPath(NASEONG, x, z);
	if (d > 260) return 0;
	const f = 1 - d / 260;
	return (34 + 26 * noise(x / 300, z / 300)) * f * f * (1 + 0.15 * fbm(x / 80, z / 80, 2));
}

function riverDistance(x: number, z: number): number {
	return distanceToPath(RIVER, x, z);
}

/** Palace terraces step up toward the hill: front court, hall terrace, rear terrace. */
function terrace(z: number): number {
	return PLAIN + 3 + (z < -60 ? 2.4 : 0) + (z < -110 ? 2.4 : 0);
}

/** The open forecourt between the palace front and the town. */
const FORECOURT = { minX: -260, maxX: 260, minZ: FRONT + 10, maxZ: 460 };

const gungnamOutline = blob(GUNGNAM.x, GUNGNAM.z, 110, 11, 22, 0.16).map(([x, z]) => [GUNGNAM.x + (x - GUNGNAM.x) * 1.45, z] as P2);
const gungnam = new Region(gungnamOutline);
const gungnamIsland = blob(GUNGNAM.x + 10, GUNGNAM.z, 22, 4, 12, 0.1);
const island = new Region(gungnamIsland);

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 420, z / 420) * 1.6 + mountains(x, z) + buso(x, z) + naseongHills(x, z);
		const dr = riverDistance(x, z);
		if (dr < RIVER_HALF + 120) y = Math.min(y, lerp(BED, 40, smoothstep(RIVER_HALF - 30, RIVER_HALF + 110, dr)));
		if (gungnam.near(x, z, 1) && gungnam.contains(x, z)) {
			y = island.contains(x, z) ? PLAIN + 0.4 : lerp(y, PLAIN - 2.6, smoothstep(0, 10, gungnam.edgeDistance(x, z)));
		}
		const px = Math.abs(x - PALACE.x) - PALACE.w / 2;
		const pz = Math.abs(z - PALACE.z) - PALACE.d / 2;
		const out = Math.hypot(Math.max(px, 0), Math.max(pz, 0));
		if (out < 16) y = lerp(terrace(z), y, smoothstep(2, 16, out));
		return y;
	};

	const fields = ['#92b25c', '#9bb862', '#8aac55', '#a4bb69', '#b2bf72'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 41, z / 41);
		const dr = riverDistance(x, z);
		if (dr < RIVER_HALF + 20 && y < PLAIN - 1) return y < WATER ? '#8b8468' : '#cfc5a2';
		const hill = mountains(x, z) + buso(x, z) + naseongHills(x, z);
		if (hill > 6) {
			if (slope > 0.55) return '#8a8576';
			return pick(['#4d6e3c', '#58783f', '#45663a', '#61814a'], (n + 1) / 2);
		}
		if (gungnam.near(x, z, 1) && gungnam.contains(x, z)) return '#5d6a54';
		if (Math.abs(x - PALACE.x) < PALACE.w / 2 + 10 && Math.abs(z - PALACE.z) < PALACE.d / 2 + 10) return n > 0.2 ? '#ddd2b8' : '#d6cbb0';
		if (Math.abs(x) < 7 && z > FRONT && z < 1300) return '#c8b68e';
		if (x > FORECOURT.minX && x < FORECOURT.maxX && z > FORECOURT.minZ && z < FORECOURT.maxZ) return n > 0 ? '#8fb15a' : '#86a853';
		if (cityAt(x, z)) return n > 0.25 ? '#a3a676' : '#98a86b';
		if (slope < 0.06) {
			const cx = Math.floor((x + 11) / 56);
			const cz = Math.floor((z - 5) / 36);
			const h = Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1;
			return pick(fields, h);
		}
		return n > 0 ? '#86a858' : '#7c9f51';
	};
	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const hill = mountains(x, z) + buso(x, z) + naseongHills(x, z);
		if (hill < 6) return 0;
		return slope > 0.55 ? 0.2 : smoothstep(6, 36, hill);
	};
	return { height, color, cover };
}

function cityAt(x: number, z: number): boolean {
	if (z < 170 || z > 1650 || x < -820 || x > 980) return false;
	if (x > FORECOURT.minX && x < FORECOURT.maxX && z < FORECOURT.maxZ) return false;
	if (riverDistance(x, z) < RIVER_HALF + 90) return false;
	if (naseongHills(x, z) > 2) return false;
	return true;
}

function reserved(x: number, z: number, pad: number): boolean {
	if (Math.abs(x - PALACE.x) < PALACE.w / 2 + 30 + pad && Math.abs(z - PALACE.z) < PALACE.d / 2 + 30 + pad) return true;
	if (Math.abs(x - JEONGNIM.x) < 70 + pad && Math.abs(z - JEONGNIM.z) < 130 + pad) return true;
	if (Math.abs(x - PALACE.x) < 9 + pad && z > 0 && z < 1300) return true;
	if (gungnam.near(x, z, pad + 30) && (gungnam.contains(x, z) || gungnam.edgeDistance(x, z) < 30 + pad)) return true;
	return false;
}

/* ------------------------------------------------------------------ palace */

function palace(b: Builder, g: Ground, labels: Label[], forest: Forest, rand: () => number): void {
	const { x, z, w, d } = PALACE;
	const yf = terrace(FRONT);

	// dressed-stone retaining walls at each terrace step
	for (const zs of [-60, -110]) {
		const top = terrace(zs - 1);
		box(b, 'courses', at(x, 0, zs), 0, top / 2, 0, w, top, 2.4, { bevel: 0.2 });
	}

	// the long front (the board's façade): a two-storey gate, long halls on the front line,
	// galleries out to pavilions at both ends, all on a dressed-stone terrace
	const gateBays = [4.4, 5.2, 5.2, 5.2, 4.4];
	const gateRes = tower(
		b,
		at(x, yf, FRONT),
		{ bays: gateBays, depth: [4, 4], colH: 6, base: 1.6, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1 },
		{ bays: gateBays, depth: [4, 4], colH: 4.2, front: 'doors', back: 'doors', sides: 'wall', roof: { chimi: true } }
	);
	const gateHalf = gateRes.w / 2 + 1;
	const longBays = Array(13).fill(4.4);
	const longW = longBays.length * 4.4;
	const longC = gateHalf + 16 + longW / 2;
	const endX = w / 2 - 6;
	box(b, 'courses', at(x, PLAIN - 1, FRONT + 9), 0, (yf - PLAIN + 1) / 2, 0, w + 14, yf - PLAIN + 1, 2.4);
	box(b, 'stone', at(x, yf, FRONT + 9), 0, 0.1, 0, w + 14.4, 0.2, 2.8);
	for (let k = 0; k < 8; k++) {
		const t = (k + 0.5) / 8;
		box(b, 'stone', at(x, PLAIN - 0.5, FRONT + 10.5 + (1 - t) * 9), 0, (yf - PLAIN + 0.5) * t * 0.5, 0, 16, (yf - PLAIN + 0.5) * t, 9 / 8 + 0.05);
	}
	for (const sx of [1, -1]) {
		corridor(b, [x + sx * gateHalf, FRONT], [x + sx * (longC - longW / 2 - 1), FRONT], yf, { width: 6.4, colH: 4.2, wall: 1 });
		hall(b, at(x + sx * longC, yf, FRONT), { bays: longBays, depth: [4, 4.6, 4], colH: 5, base: 1.3, front: 'doors', back: 'open', steps: ['n'], roof: { chimi: true } });
		corridor(b, [x + sx * (longC + longW / 2 + 1), FRONT], [x + sx * (endX - 6), FRONT], yf, { width: 6.4, colH: 4.2, wall: 1 });
		hall(b, at(x + sx * endX, yf, FRONT), { bays: [3.6, 4, 3.6], depth: [3.6, 3.6], colH: 4.6, base: 1.3, front: 'open', sides: 'wall', roof: { chimi: true } });
		fence(b, [[x + (sx * w) / 2, FRONT], [x + (sx * w) / 2, -60], [x + (sx * w) / 2, -110], [x + (sx * w) / 2, z - d / 2]], (_x, zz) => terrace(zz) + 0.02, 2.6);
		// the two inner galleries leading from the gate to the hall terrace
		corridor(b, [x + sx * 32, FRONT - 6], [x + sx * 32, -44], yf, { width: 5, colH: 3.4, wall: 0 });
		court(b, x + sx * 140, -20, 84, 56, yf, { gate: sx > 0 ? 'w' : 'e', pave: 'gravel' });
		hall(b, at(x + sx * 140, yf, -34), { bays: Array(5).fill(3.4), depth: [3, 3.2], colH: 3.8, base: 0.9 });
	}
	fence(b, [[x - w / 2, z - d / 2], [x + w / 2, z - d / 2]], () => terrace(z - d / 2), 2.6);

	// the great hall on its two-tier platform, and the halls of the upper terraces
	const main = hall(b, at(x, yf, -30), { bays: [4.6, 4.8, 5, 5.6, 5, 4.8, 4.6], depth: [4.2, 5, 5, 4.2], colH: 5.8, base: 2, tiers: 2, steps: ['s', 'e', 'w'], roof: { chimi: true } });
	hall(b, at(x, terrace(-90), -88), { bays: Array(7).fill(3.8), depth: [3.4, 3.8, 3.4], colH: 4.4, base: 1.2, roof: { chimi: true } });
	hall(b, at(x, terrace(-130), -132), { bays: Array(9).fill(3.4), depth: [3.2, 3.2], colH: 3.8, base: 0.9 });
	for (const sx of [1, -1]) {
		hall(b, at(x + sx * 70, terrace(-90), -86, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: Array(5).fill(3.2), depth: [3, 3], colH: 3.6, base: 0.8 });
	}

	// the front court between the gate and the hall: granite flags, a raised royal way, rank stones
	pavedCourt(b, x, 45, 56, 112, yf, { axis: 4.2, ranks: 6, lanterns: true });
	// fine raked sand in the side yards, inside the inner galleries' outer line
	for (const sx of [1, -1]) box(b, 'gravel', at(x + sx * 65, yf, 26), 0, -0.25, 0, 60, 0.62, 150);

	// the lotus pond found on the site, set in a lawn garden with pines, maples and a lantern
	const pond = blob(x - 120, 52, 16, 9, 14, 0.14).map(([px, pz]) => [x - 120 + (px - (x - 120)) * 1.3, pz] as P2);
	box(b, 'lawn', at(x - 124, yf, 52), 0, -0.2, 0, 56, 0.56, 44);
	for (const sz of [1, -1]) box(b, 'stone', at(x - 124, yf, 52 + sz * 22), 0, 0.04, 0, 56.4, 0.36, 0.5, { bevel: 0.08 });
	for (const sx of [1, -1]) box(b, 'stone', at(x - 124 + sx * 28, yf, 52), 0, 0.04, 0, 0.5, 0.36, 44, { bevel: 0.08 });
	gardenPond(b, pond, yf, rand);
	stoneLantern(b, x - 96, yf, 66);
	stoneLantern(b, x - 146, yf, 38, 0.8);
	for (const [px, pz, kind, h] of [
		[x - 145, 62, 'pine', 8],
		[x - 140, 70, 'pine', 6.5],
		[x - 98, 40, 'maple', 6],
		[x - 92, 46, 'maple', 5],
		[x - 104, 70, 'pine', 7],
		[x - 132, 34, 'cherry', 5.5]
	] as [number, number, 'pine' | 'maple' | 'cherry', number][]) {
		forest.add(kind, px, yf, pz, h);
	}
	// the wooden storehouses found east of the hall, on a sand yard
	box(b, 'gravel', at(x + 142, yf, 50), 0, -0.2, 0, 80, 0.56, 30);
	for (let k = 0; k < 3; k++) {
		hall(b, at(x + 120 + k * 22, yf, 50), { bays: [3, 3, 3], depth: [2.8, 2.8], colH: 2.8, base: 0.4, posts: 1.6, front: 'wall', roof: { kind: 'hip', h: 2.8 } });
	}
	// a few shade trees along the inner walls, not a scatter across the yards
	for (const sx of [1, -1]) {
		for (let k = 0; k < 4; k++) forest.add('zelkova', x + sx * (w / 2 - 8), yf, -50 + k * 38 + rand() * 6, 10 + rand() * 3);
	}
	labels.push({ id: 'pond', en: 'Lotus pond', ko: '연지', at: [x - 120, yf + 10, 52], status: 'excavated', note: 'A square stone-lined lotus pond was dug up at Gwanbuk-ri; the garden round it is ours' });
	labels.push({ id: 'storehouses', en: 'Storehouses', ko: '목곽 창고', at: [x + 142, yf + 12, 50], status: 'excavated', note: 'Timber-lined storage pits held grain and fruit; the raised houses over them are placed' });

	labels.push({ id: 'palace', en: 'Gwanbuk-ri palace', ko: '관북리 왕궁지', at: [x, yf + main.ridge + 6, -30], status: 'excavated', note: 'Great hall platform, roads, pond and storehouses found; the layout is placed' });
	labels.push({ id: 'gate', en: 'Palace gate', ko: '왕궁 정문', at: [x, yf + gateRes.ridge + 4, FRONT], status: 'placed' });
}

/* ------------------------------------------------------------------ Jeongnimsa */

function jeongnimsa(b: Builder, g: Ground, labels: Label[]): void {
	const { x, z } = JEONGNIM;
	const y = g.height(x, z) + 0.3;
	cloister(b, x, z, 64, 108, y, { gate: { bays: [3.2, 3.8, 3.2], depth: [3, 3], colH: 4 }, width: 5, colH: 3.4 });
	const top = stonePagoda(b, at(x, y, z + 18), 5, 2.6, 1.6, 'courses');
	hall(b, at(x, y, z - 16), { bays: [3.6, 4, 4.4, 4, 3.6], depth: [3.4, 3.8, 3.8, 3.4], colH: 4.8, base: 1.3, tiers: 2, roof: { chimi: true } });
	hall(b, at(x, y, z - 41), { bays: Array(7).fill(3.8), depth: [3.2, 3.2], colH: 4.2, base: 1 });
	gate(b, at(x, y, z + 92), [3.2, 3.8, 3.2], [3, 3], 3.8, { roof: { chimi: true } });
	for (const sx of [1, -1]) {
		const pond: P2[] = [
			[x + sx * 8, z + 62],
			[x + sx * 26, z + 62],
			[x + sx * 26, z + 80],
			[x + sx * 8, z + 80]
		];
		b.push('courses', skirt(pond, y - 1.6, y + 0.2));
		b.push('water', flat(pond, y - 0.5));
	}
	box(b, 'path', at(x, y, z + 73), 0, 0.05, 0, 6, 0.1, 34);
	labels.push({ id: 'jeongnimsa', en: 'Jeongnimsa pagoda', ko: '정림사지 오층석탑', at: [x, y + top + 5, z + 18], status: 'standing', note: 'Five-storey stone pagoda, 8.3 m; the temple around it is excavated' });
}

/* ------------------------------------------------------------------ Gungnamji */

function gungnamji(b: Builder, g: Ground, forest: Forest, labels: Label[], rand: () => number): void {
	b.push('water', flat(gungnamOutline, PLAIN - 1.1));
	b.push('courses', skirt(gungnamIsland, PLAIN - 2.8, PLAIN + 0.4));
	b.push('lawn', flat(gungnamIsland, PLAIN + 0.4));
	const c = centroid(gungnamIsland);
	hall(b, at(c[0], PLAIN + 0.4, c[1]), { bays: [3, 3, 3], depth: [3, 3, 3], colH: 3.2, base: 0.7, front: 'open', back: 'open', sides: 'open', rail: true, roof: { kind: 'pyramid', h: 3.4 } });
	const shore: P2 = [GUNGNAM.x + 10, GUNGNAM.z + 122];
	const ang = Math.atan2(shore[1] - c[1], shore[0] - c[0]);
	const span = Math.hypot(shore[0] - c[0], shore[1] - c[1]) - 18;
	const mid = 18 + span / 2;
	box(b, 'wood', at(c[0] + Math.cos(ang) * mid, PLAIN - 0.2, c[1] + Math.sin(ang) * mid, facing(ang)), 0, 0, 0, span + 4, 0.4, 2.6);
	for (const [x, z] of resample(gungnamOutline, 9, true)) {
		if (rand() > 0.7) continue;
		const dx = x - GUNGNAM.x;
		const dz = z - GUNGNAM.z;
		const l = Math.hypot(dx, dz) || 1;
		const px = x + (dx / l) * 6;
		const pz = z + (dz / l) * 6;
		forest.add('willow', px, g.height(px, pz), pz, 8 + rand() * 4);
	}
	labels.push({ id: 'gungnamji', en: 'Gungnamji', ko: '궁남지', at: [GUNGNAM.x, 14, GUNGNAM.z], status: 'recorded', note: 'King Mu dug a pond south of the palace (634) with an island in it' });
}

/* ------------------------------------------------------------------ Busosan fortress */

function busosanseong(b: Builder, g: Ground, labels: Label[], forest: Forest, rand: () => number): void {
	const ring = contourRing(g.height, 160, -580, PLAIN + 28, 760, 90);
	const south = ring.reduce((best, p) => (p[1] > best[1] ? p : best), ring[0]);
	const east = ring.reduce((best, p) => (p[0] > best[0] ? p : best), ring[0]);
	rampart(
		b,
		ring,
		[
			[-7, 0.3],
			[-2, 2.8],
			[0, 3.4],
			[2, 2.8],
			[9, 0.2]
		],
		g.height,
		{
			closed: true,
			gaps: [
				{ at: south, half: 8 },
				{ at: east, half: 8 }
			],
			step: 6
		}
	);
	for (const [gx, gz] of [south, east]) {
		gate(b, at(gx, g.height(gx, gz), gz, Math.atan2(gx - 160, gz + 580)), [3.4, 4, 3.4], [3, 3], 3.8, { base: 0.4, roof: { chimi: false } });
	}

	// a lookout on the highest point and the army granaries on the east summit
	let best: P2 = [160, -560];
	let hy = -Infinity;
	for (let x = -300; x < 650; x += 10) {
		for (let z = -820; z < -350; z += 10) {
			const yy = g.height(x, z);
			if (yy > hy) {
				hy = yy;
				best = [x, z];
			}
		}
	}
	const look = hall(b, at(best[0], hy - 0.3, best[1]), { bays: [3, 3.6, 3], depth: [3, 3], colH: 3.4, base: 0.8, front: 'open', back: 'open', sides: 'open', rail: true, roof: { chimi: true } });
	labels.push({ id: 'busosanseong', en: 'Busosanseong', ko: '부소산성', at: [best[0], hy + look.ridge + 8, best[1]], status: 'excavated', note: 'Earthen ring round the hill behind the palace; the lookout is placed' });
	const gx = 420;
	const gz = -600;
	const gy = g.height(gx, gz);
	for (let k = 0; k < 3; k++) {
		hall(b, at(gx - 30 + k * 30, gy, gz + (k % 2) * 6), { bays: Array(7).fill(3.2), depth: [3, 3], colH: 3, base: 0.6, posts: 1.4, front: 'wall', roof: { kind: 'hip', h: 3 } });
	}
	labels.push({ id: 'granary', en: 'Army granary', ko: '군창지', at: [gx, gy + 16, gz], status: 'excavated', note: 'Burnt grain was found in its pits' });

	for (let k = 0; k < 4200; k++) {
		const x = -500 + rand() * 1250;
		const z = -930 + rand() * 700;
		if (buso(x, z) < 6) continue;
		if (Math.hypot(x - best[0], z - best[1]) < 16) continue;
		if (Math.abs(x - gx) < 60 && Math.abs(z - gz) < 22) continue;
		if (riverDistance(x, z) < RIVER_HALF + 10) continue;
		forest.add(rand() > 0.35 ? 'pine' : 'broad', x, g.height(x, z), z, 9 + rand() * 7);
	}
	const nak = ring.reduce((n, p) => (p[1] < n[1] ? p : n), ring[0]);
	labels.push({ id: 'nakhwaam', en: 'Nakhwaam', ko: '낙화암', at: [nak[0], g.height(nak[0], nak[1]) + 22, nak[1] - 30], status: 'survey', note: 'The cliff above the river' });
}

/* ------------------------------------------------------------------ Naseong */

function naseong(b: Builder, g: Ground, labels: Label[]): void {
	const crest = NASEONG.map(([x, z]) => {
		let bx = x;
		let by = -Infinity;
		for (let dx = -60; dx <= 60; dx += 10) {
			const yy = g.height(x + dx, z);
			if (yy > by) {
				by = yy;
				bx = x + dx;
			}
		}
		return [bx, z] as P2;
	});
	rampart(
		b,
		chaikin(crest, 2, false),
		[
			[-9, 0.2],
			[-3, 3.2],
			[0, 4],
			[3, 3.2],
			[9, 0.2]
		],
		g.height,
		{ closed: false, step: 6 }
	);
	const mid = crest[3];
	labels.push({ id: 'naseong', en: 'Naseong', ko: '나성', at: [mid[0], g.height(mid[0], mid[1]) + 20, mid[1]], status: 'excavated', note: 'Earthen outer wall along the eastern hills' });
}

/* ------------------------------------------------------------------ trees */

function plant(g: Ground, forest: Forest, rand: () => number): void {
	// groves framing the forecourt, thickest toward the town side
	for (let k = 0; k < 260; k++) {
		const side = rand() > 0.5 ? 1 : -1;
		const x = side * (70 + rand() * 200);
		const z = FORECOURT.minZ + 60 + Math.sqrt(rand()) * (FORECOURT.maxZ - FORECOURT.minZ - 40);
		if (Math.abs(x) < 70 + (z - FORECOURT.minZ) * 0.25) continue;
		forest.add(rand() > 0.6 ? 'zelkova' : rand() > 0.3 ? 'broad' : 'pine', x, g.height(x, z), z, 10 + rand() * 7);
	}
	for (let k = 0; k < 18; k++) {
		const cx = (rand() - 0.5) * 380;
		const cz = FORECOURT.minZ + 40 + rand() * 200;
		if (Math.abs(cx) < 14) continue;
		for (let j = 0; j < 3; j++) {
			const x = cx + (rand() - 0.5) * 10;
			const z = cz + (rand() - 0.5) * 10;
			if (Math.abs(x) > 12) forest.add('broad', x, g.height(x, z), z, 4 + rand() * 3);
		}
	}
	for (const [x, z] of resample(chaikin(RIVER, 2, false), 18, false)) {
		for (const side of [1, -1]) {
			if (rand() > 0.45) continue;
			const px = x + side * (RIVER_HALF + 40 + rand() * 30);
			const pz = z + (rand() - 0.5) * 30;
			const yy = g.height(px, pz);
			if (yy < PLAIN - 1 || buso(px, pz) > 6 || riverDistance(px, pz) < RIVER_HALF + 30) continue;
			forest.add('willow', px, yy, pz, 8 + rand() * 4);
		}
	}
	for (let k = 0; k < 5200; k++) {
		const x = NEAR.minX + rand() * (NEAR.maxX - NEAR.minX);
		const z = NEAR.minZ + rand() * (NEAR.maxZ - NEAR.minZ);
		if (naseongHills(x, z) + mountains(x, z) < 6 || riverDistance(x, z) < RIVER_HALF + 20) continue;
		forest.add(rand() > 0.4 ? 'pine' : 'broad', x, g.height(x, z), z, 9 + rand() * 6);
	}
	for (let k = 0; k < 220; k++) {
		const x = -900 + rand() * 2000;
		const z = 150 + rand() * 2100;
		if (reserved(x, z, 10) || riverDistance(x, z) < RIVER_HALF + 60 || naseongHills(x, z) > 2) continue;
		const n = 2 + Math.floor(rand() * 4);
		for (let j = 0; j < n; j++) {
			const px = x + (rand() - 0.5) * 26;
			const pz = z + (rand() - 0.5) * 26;
			forest.add(rand() > 0.5 ? 'broad' : 'zelkova', px, g.height(px, pz), pz, 8 + rand() * 5);
		}
	}
}

/* ------------------------------------------------------------------ ground cover */

function meadow(g: Ground, cover: Cover, rand: () => number): void {
	const tuft = (x: number, z: number) => cover.add(rand() > 0.85 ? 'flowers' : 'grass', x, g.height(x, z) - 0.05, z, 0.9 + rand() * 0.7);

	// the forecourt lawn and the palace yards
	for (let k = 0; k < 16000; k++) {
		const x = FORECOURT.minX - 120 + rand() * (FORECOURT.maxX - FORECOURT.minX + 240);
		const z = -PALACE.d / 2 + rand() * (FORECOURT.maxZ + PALACE.d / 2 + 80);
		if (Math.abs(x) < 10) continue;
		const inPalace = Math.abs(x) < PALACE.w / 2 && z < FRONT + 12;
		if (inPalace) continue;
		tuft(x, z);
	}

	// reeds and stones along the Baengma
	bankCover(cover, g, RIVER, WATER, rand, { from: RIVER_HALF - 10, to: RIVER_HALF + 50, step: 4, grass: (x, z) => buso(x, z) < 6 });

	// Gungnamji: reeds round the margin, lawn on the banks
	const gb = gungnam.box;
	for (let k = 0; k < 5000; k++) {
		const x = gb.minX - 30 + rand() * (gb.maxX - gb.minX + 60);
		const z = gb.minZ - 30 + rand() * (gb.maxZ - gb.minZ + 60);
		if (gungnam.contains(x, z)) {
			if (island.contains(x, z)) tuft(x, z);
			else if (gungnam.edgeDistance(x, z) < 6) cover.add('reed', x, PLAIN - 1.5, z, 1.4 + rand() * 0.8);
		} else if (rand() > 0.3) tuft(x, z);
	}
}

/* ------------------------------------------------------------------ build */

const NEAR: Bounds = { minX: -1500, maxX: 1600, minZ: -1350, maxZ: 2300 };

function views(): View[] {
	return [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [0, 14, 470], target: [0, 24, -60], fov: 38 },
		{ id: 'palace', en: 'Palace', ko: '왕궁', pos: [-200, 70, 300], target: [0, 8, -20], fov: 42 },
		{ id: 'jeongnimsa', en: 'Jeongnimsa', ko: '정림사', pos: [JEONGNIM.x + 70, 26, JEONGNIM.z + 140], target: [JEONGNIM.x, 6, JEONGNIM.z], fov: 42 },
		{ id: 'river', en: 'From the White River', ko: '백강에서', pos: [-560, 30, -1180], target: [140, 40, -560], fov: 40 },
		{ id: 'gungnamji', en: 'Gungnamji', ko: '궁남지', pos: [GUNGNAM.x - 120, 40, GUNGNAM.z + 220], target: [GUNGNAM.x, 2, GUNGNAM.z], fov: 42 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 2600, 520], target: [0, 0, 500], fov: 40 }
	];
}

export function buildSabi(opts: BuildOptions): SiteBuild {
	const p: Palette = palette({ lit: opts.light === 'night' });
	const g = makeGround();
	const root = new THREE.Group();
	root.name = 'sabi';
	const labels: Label[] = [];
	const b = new Builder();
	const forest = new Forest();
	const town = new Town();
	const rand = rng(538);

	const near = nearGround(p, g, NEAR, 7);
	b.ground = near.userData.sample;
	root.add(near);
	root.add(farGround(p, g, NEAR, 22000, 120, 0, 500));

	riverStrip(b, RIVER, RIVER_HALF * 2 + 60, WATER);
	palace(b, g, labels, forest, rand);
	b.push('path', ribbon([[0, FRONT + 20], [0, 1300]], 12, (x, z) => g.height(x, z) + 0.1));
	jeongnimsa(b, g, labels);
	gungnamji(b, g, forest, labels, rand);
	busosanseong(b, g, labels, forest, rand);
	naseong(b, g, labels);
	gridTown(town, g.height, rand, { minX: -820, maxX: 980, minZ: 170, maxZ: 1650 }, 110, (x, z) => cityAt(x, z) && !reserved(x, z, 8), { density: 0.72, thatch: 0.45 });
	plant(g, forest, rand);

	labels.push({
		id: 'baengma',
		en: 'White River',
		ko: '백강',
		at: [-1000, 10, 200],
		status: 'survey',
		note: 'Pale at the mouth. Upstream, at the palace, this is the Baengma (Geum).'
	});

	const cover = new Cover();
	meadow(g, cover, rand);

	return assemble({
		p,
		root,
		b,
		forest,
		town,
		cover,
		mist: {
			height: g.height,
			box: { minX: -6000, maxX: 6000, minZ: -6000, maxZ: 6000 },
			layers: [
				{ y: WATER + 1.2, opacity: 0.3 },
				{ y: PLAIN + 2.5, opacity: 0.16 },
				{ y: PLAIN + 9, opacity: 0.08 }
			]
		},
		labels,
		views: views(),
		wardrobe: {
			dress: 'baekje',
			x: 0,
			z: 76,
			note: 'Commoners in white with dark trim; ladies in yellow, white or red pleated skirts; officials in rank silk'
		},
		center: [0, 300],
		radius: 1100,
		haze: '#c8d6e2',
		water: { color: '#d5dde2', roughness: 0.07, metalness: 0.06, minSpan: 400 },
		life: {
			kingdom: 'baekje',
			walk: [
				[-70, -90],
				[70, -90],
				[70, 40],
				[-70, 40],
				[-70, -90]
			],
			river: reach(RIVER, 0, -200, 900),
			bank: RIVER_HALF + 28,
			waterY: WATER + 0.3,
			height: (x, z) =>
				Math.abs(x - PALACE.x) < PALACE.w / 2 && z > PALACE.z - PALACE.d / 2 && z < FRONT + 4
					? terrace(z) + 0.2
					: g.height(x, z),
			seed: 538,
			people: 18,
			boats: 3,
			boat: 1
		}
	});
}
