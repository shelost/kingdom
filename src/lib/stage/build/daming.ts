import * as THREE from 'three';
import { Region, fbm, noise, smoothstep, blob, rect, resample, centroid, type P2, type Bounds } from './geo';
import { at, facing, box, hall, tower, corridor, cloister, fence, gate, flat, skirt, stoneWall, type Builder, type Mat } from './kit';
import { bump, type Ground } from './terrain';
import { lerp, mountainField, pick, gridTown, startSite, assemble, scatterTrees, scatterCover } from './common';
import { gateBlock, munru, banners } from './fortress';
import type { BuildOptions, Label, SiteBuild, View } from './types';

/*
 * Daming Palace (大明宮), Chang'an: the Tang court from Gaozong's reign on. Origin at Hanyuan
 * Hall. The palace sits on Longshou plateau at the north-east edge of the city: its south wall
 * is the city's north wall, Danfeng Gate stands 610 m south of Hanyuan, Xuanzheng and Zichen
 * halls follow on the axis, and Taiye Pond with Penglai island fills the rear court. Hall
 * platforms and wall lines follow the excavation reports in round numbers; the canon look is
 * red rammed-earth terraces, white balustrades, grey tile with owl-tail ridges, never yellow
 * glaze.
 */

const PLAIN = 10;
/** Longshou plateau: the ground behind Hanyuan stands this much above the plaza. */
const RISE = 10;
const UP = PLAIN + RISE;
const DANFENG = 610;

/** The palace wall: long west wall, short north wall, the east wall slanting in. */
const OUTLINE: P2[] = [
	[-800, DANFENG],
	[870, DANFENG],
	[730, -300],
	[335, -1650],
	[-800, -1650]
];

const TAIYE = { x: 120, z: -1130 };
const taiyeOutline = blob(TAIYE.x, TAIYE.z, 160, 21, 26, 0.14).map(([x, z]) => [TAIYE.x + (x - TAIYE.x) * 1.5, z] as P2);
const taiye = new Region(taiyeOutline);
const penglaiOutline = blob(TAIYE.x + 60, TAIYE.z + 10, 46, 5, 16, 0.18);
const penglai = new Region(penglaiOutline);
const WATER = UP - 2.6;

const LINDE = { x: -520, z: -1020 };

const mountains = mountainField([
	{ x: 2000, z: 15000, rx: 32000, rz: 3600, h: 1700, seed: 1.7 },
	{ x: -3000, z: -15000, rx: 16000, rz: 3000, h: 520, seed: 2.9 },
	{ x: 15000, z: 3000, rx: 3000, rz: 4000, h: 900, seed: 3.4 }
]);

/** Ground falls away north of the palace to the Wei plain. */
function plateau(z: number): number {
	return RISE * smoothstep(-20, -90, z) - 16 * smoothstep(-1720, -2300, z);
}

function eastX(z: number): number {
	for (let i = 1; i < 4; i++) {
		const a = OUTLINE[i];
		const c = OUTLINE[i + 1];
		if (z <= a[1] && z >= c[1]) return lerp(a[0], c[0], (a[1] - z) / (a[1] - c[1]));
	}
	return OUTLINE[1][0];
}

function insidePalace(x: number, z: number, pad = 0): boolean {
	return z < DANFENG - pad && z > -1650 + pad && x > -800 + pad && x < eastX(z) - pad;
}

function makeGround(): Ground {
	const height = (x: number, z: number) => {
		let y = PLAIN + fbm(x / 500, z / 500) * 1.2 + plateau(z) + mountains(x, z);
		if (taiye.near(x, z, 1) && taiye.contains(x, z)) {
			if (penglai.near(x, z, 1) && penglai.contains(x, z)) y = UP + 1 + bump(x, z, TAIYE.x + 60, TAIYE.z + 10, 46) * 12;
			else y = lerp(y, WATER - 2.5, smoothstep(0, 12, taiye.edgeDistance(x, z)));
		}
		return y;
	};
	const fields = ['#a9ad73', '#b3b37a', '#9ea66a', '#b9b483', '#a7a26c'];
	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		if (taiye.near(x, z, 1) && taiye.contains(x, z) && !penglai.contains(x, z)) return y < WATER ? '#6f6c58' : '#c7bc96';
		if (mountains(x, z) > 30) return slope > 0.5 ? '#8a8576' : pick(['#6c7f4a', '#768a52', '#61744a'], (n + 1) / 2);
		if (insidePalace(x, z)) {
			if (z > 120) return n > 0.2 ? '#bfae8a' : '#b6a682';
			return pick(['#7f9a52', '#86a159', '#789350'], (n + 1) / 2);
		}
		if (z > DANFENG) return n > 0.25 ? '#b8a88a' : '#b0a183';
		if (slope < 0.06) {
			const cx = Math.floor((x + 13) / 60);
			const cz = Math.floor((z - 7) / 40);
			return pick(fields, Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1);
		}
		return n > 0 ? '#9ca466' : '#939c60';
	};
	const cover = (x: number, z: number): number => (mountains(x, z) > 30 ? smoothstep(30, 300, mountains(x, z)) : 0);
	return { height, color, cover };
}

/* ------------------------------------------------------------------ terrace parts */

/** A sloped block between (za, ya) and (zb, yb), running along z, with its floor at `bottom`. */
function slope(b: Builder, mat: Mat, x: number, w: number, za: number, ya: number, zb: number, yb: number, bottom: number): void {
	const L = Math.abs(zb - za);
	const g = new THREE.BoxGeometry(w, 1, L);
	const pos = g.getAttribute('position');
	for (let i = 0; i < pos.count; i++) {
		const t = (pos.getZ(i) + L / 2) / L;
		const top = lerp(ya, yb, t);
		pos.setXYZ(i, x + pos.getX(i), pos.getY(i) > 0 ? top : bottom, lerp(za, zb, t));
	}
	g.computeVertexNormals();
	b.push(mat, g);
}

/** White stone balustrade (난간) along a path at height y; `open` leaves gaps for stairs. */
function balustrade(b: Builder, path: P2[], y: (x: number, z: number) => number, open: (x: number, z: number) => boolean = () => false): void {
	const line = resample(path, 2.2, false);
	for (let i = 0; i < line.length; i++) {
		const [x, z] = line[i];
		if (open(x, z)) continue;
		const yy = y(x, z);
		box(b, 'plaster', at(x, yy, z), 0, 0.6, 0, 0.3, 1.2, 0.3);
		const next = line[i + 1];
		if (!next || open(next[0], next[1])) continue;
		const L = Math.hypot(next[0] - x, next[1] - z);
		const m = at((x + next[0]) / 2, (yy + y(next[0], next[1])) / 2, (z + next[1]) / 2, facing(Math.atan2(next[1] - z, next[0] - x)));
		box(b, 'plaster', m, 0, 1.0, 0, L, 0.16, 0.2);
		box(b, 'plaster', m, 0, 0.3, 0, L, 0.12, 0.16);
	}
}

/** A red rammed-earth terrace block with a white balustrade round its top. */
function terrace(b: Builder, r: { x: number; z: number; w: number; d: number }, top: number, open: (x: number, z: number) => boolean): void {
	box(b, 'wallRed', at(r.x, PLAIN - 2, r.z), 0, (top - PLAIN + 2) / 2, 0, r.w, top - PLAIN + 2, r.d);
	box(b, 'stone', at(r.x, top, r.z), 0, 0.12, 0, r.w + 0.6, 0.24, r.d + 0.6);
	const edge = rect(r.x, r.z, r.w - 0.8, r.d - 0.8);
	balustrade(b, [...edge, edge[0]], () => top + 0.24, open);
}

/** A tapered grey-brick que pier with a pavilion on it. */
function que(b: Builder, x: number, y: number, z: number, base: number, topSide: number, h: number, storeys: 1 | 2): number {
	const g = new THREE.CylinderGeometry(topSide / Math.SQRT2, base / Math.SQRT2, h, 4, 1);
	g.rotateY(Math.PI / 4);
	b.push('wallStone', g, at(x, y + h / 2, z));
	box(b, 'stone', at(x, y + h, z), 0, 0.15, 0, topSide + 0.8, 0.3, topSide + 0.8);
	const bay = (topSide - 3) / 3;
	const res = munru(b, at(x, y + h + 0.3, z), { storeys, bays: [bay, bay * 1.1, bay], depth: [bay, bay], colH: storeys === 2 ? 3.8 : 3.4 });
	return y + h + 0.3 + res.ridge;
}

/* ------------------------------------------------------------------ Hanyuan */

function hanyuan(b: Builder, labels: Label[]): void {
	const yA = PLAIN + 5;
	const yB = UP;
	const lanes = [-15, 0, 15];
	const onLane = (x: number) => lanes.some((l) => Math.abs(x - l) < 4.6);
	// two red terraces: a broad lower one with wings carrying the que towers, the hall terrace on it
	terrace(b, { x: 0, z: 32, w: 150, d: 156 }, yA, (x, z) => z > 100 && onLane(x));
	for (const sx of [1, -1]) terrace(b, { x: sx * 122, z: 47, w: 94, d: 186 }, yA, (x) => Math.abs(x) < 76);
	terrace(b, { x: 0, z: -5, w: 104, d: 70 }, yB, (x, z) => z > 25 && onLane(x));
	// the Dragon Tail Way: three ramps, plaza to the lower terrace, a landing, then up to the hall
	for (const lx of lanes) {
		slope(b, 'wallRed', lx, 8.4, 110, yA, 190, PLAIN, PLAIN - 1);
		slope(b, 'stone', lx, 7.6, 110, yA + 0.25, 190, PLAIN + 0.25, PLAIN);
		slope(b, 'wallRed', lx, 8.4, 30, yB, 80, yA, yA - 1);
		slope(b, 'stone', lx, 7.6, 30, yB + 0.25, 80, yA + 0.25, yA);
		for (const sx of [1, -1]) {
			balustrade(b, [[lx + sx * 4.1, 110], [lx + sx * 4.1, 190]], (_x, z) => lerp(yA, PLAIN, (z - 110) / 80) + 0.25);
			balustrade(b, [[lx + sx * 4.1, 30], [lx + sx * 4.1, 80]], (_x, z) => lerp(yB, yA, (z - 30) / 50) + 0.25);
		}
	}

	// the hall: eleven bays by four, double-eaved hip roof with owl-tail ends
	const main = tower(
		b,
		at(0, yB + 0.24, -5),
		{ bays: Array(11).fill(5.4), depth: [6, 6, 6, 6], colH: 7.2, base: 2.2, tiers: 2, pad: 3, front: 'doors', back: 'wall', sides: 'wall', steps: ['s'] },
		{ bays: Array(11).fill(4.9), depth: [5.2, 5.2, 5.2, 5.2], colH: 2.6, front: 'wall', back: 'wall', sides: 'wall', rail: false, roof: { kind: 'hip', chimi: true } }
	);
	labels.push({ id: 'hanyuan', en: 'Hanyuan Hall', ko: '함원전', at: [0, yB + main.ridge + 8, -5], status: 'excavated', note: 'Platform about 76 × 42 m on the Longshou terraces; finished 663' });

	// galleries from the hall out to the que towers, then the towers in three steps
	for (const sx of [1, -1]) {
		corridor(b, [sx * 52, -5], [sx * 118, -5], yA + 0.24, { width: 6, colH: 3.6 });
		corridor(b, [sx * 118, -2], [sx * 118, 60], yA + 0.24, { width: 6, colH: 3.6 });
		que(b, sx * 118, yA + 0.24, 75, 24, 17, 14, 2);
		que(b, sx * 137, yA + 0.24, 96, 18, 13, 11, 1);
		que(b, sx * 153, yA + 0.24, 116, 13, 9.5, 8, 1);
	}
	labels.push({ id: 'que', en: 'Xiangluan and Qifeng towers', ko: '상란각 · 서봉각', at: [-118, yA + 40, 75], status: 'excavated', note: 'Three-stepped que on brick-faced piers, joined to the hall by galleries' });
	labels.push({ id: 'dragon-tail', en: 'Dragon Tail Way', ko: '용미도', at: [0, yA + 6, 150], status: 'excavated', note: 'Three ramps up from the plaza to the hall terrace' });
	for (const lx of [-40, 40]) b.lampPost(lx, yA + 0.24, 104);
	for (const lx of [-60, 60]) b.lampPost(lx, yB + 0.24, 24);
}

/* ------------------------------------------------------------------ the axis and the courts */

function axis(b: Builder, labels: Label[]): void {
	// the plaza, paved down the middle and lit both sides
	box(b, 'earth', at(0, PLAIN, 400), 0, 0.04, 0, 520, 0.08, 400);
	box(b, 'paving', at(0, PLAIN, 395), 0, 0.1, 0, 64, 0.12, 410);
	for (let z = 210; z < DANFENG - 20; z += 30) for (const sx of [1, -1]) b.lampPost(sx * 38, PLAIN + 0.1, z);
	for (const sx of [1, -1]) {
		const rot = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
		hall(b, at(sx * 160, PLAIN, 330, rot), { bays: Array(13).fill(4.6), depth: [4.6, 5, 4.6], colH: 5.2, base: 1.2, front: 'doors', back: 'wall', sides: 'wall', roof: { chimi: true } });
		tower(
			b,
			at(sx * 160, PLAIN, 205, rot),
			{ bays: [4.4, 4.8, 4.4], depth: [4.4, 4.8, 4.4], colH: 5, base: 1.6, front: 'open', back: 'open', sides: 'wall' },
			{ bays: [4, 4.4, 4], depth: [4, 4.4, 4], colH: 3.8, front: 'windows', back: 'windows', sides: 'windows', roof: { kind: 'hip', chimi: true } }
		);
	}
	labels.push({ id: 'chaotang', en: 'Court halls', ko: '조당', at: [-160, PLAIN + 18, 330], status: 'placed', note: 'East and west court halls before Hanyuan; the bell and drum towers stand at their north ends' });

	// Danfeng Gate: five passages through a rammed-earth gate block, a two-storey tower on top
	const gh = 10;
	for (let k = -2; k <= 2; k++) gateBlock(b, at(k * 13, PLAIN, DANFENG), { w: 13, d: 22, h: gh, arch: 6.4, stone: 'wallRed', crenel: false });
	box(b, 'stone', at(0, PLAIN + gh, DANFENG), 0, 0.15, 0, 66, 0.3, 23);
	const df = munru(b, at(0, PLAIN + gh + 0.3, DANFENG), { storeys: 2, bays: Array(11).fill(5), depth: [5, 5, 5], colH: 5.4 });
	banners(b, [-30, -24, 24, 30].map((x) => [x, PLAIN + gh + 0.3, DANFENG + 9] as [number, number, number]), 'wallRed', 7.5);
	labels.push({ id: 'danfeng', en: 'Danfeng Gate', ko: '단봉문', at: [0, PLAIN + gh + df.ridge + 8, DANFENG], status: 'excavated', note: 'Five passages; the largest gate of the city' });
	for (const gx of [-420, 420]) {
		gateBlock(b, at(gx, PLAIN, DANFENG), { w: 16, d: 14, h: gh, arch: 5.6, stone: 'wallRed', crenel: false });
		munru(b, at(gx, PLAIN + gh, DANFENG), { bays: [4, 4.6, 4], depth: [4, 4], colH: 3.8 });
	}

	// Xuanzheng and Zichen: a cloistered court on the plateau, split by the Zichen gate wall
	const cz = -330;
	cloister(b, 0, cz, 300, 300, UP, { gate: { bays: [4.4, 5, 5, 5, 4.4], depth: [4.4, 4.4], colH: 5, twoStorey: true }, width: 7, colH: 4.2, corners: true });
	const xz = hall(b, at(0, UP, -255), { bays: Array(11).fill(5), depth: [5.4, 5.4, 5.4, 5.4], colH: 6.6, base: 2, tiers: 2, steps: ['s', 'e', 'w'], front: 'doors', back: 'doors', sides: 'wall', roof: { kind: 'hip', chimi: true } });
	labels.push({ id: 'xuanzheng', en: 'Xuanzheng Hall', ko: '선정전', at: [0, UP + xz.ridge + 6, -255], status: 'excavated', note: 'The regular audience hall, 300 m behind Hanyuan' });
	fence(b, [[-150, -340], [-12, -340]], () => UP, 4.2);
	fence(b, [[12, -340], [150, -340]], () => UP, 4.2);
	gate(b, at(0, UP, -340), [3.8, 4.4, 3.8], [3.4, 3.4], 4.2, { roof: { chimi: true } });
	const zc = hall(b, at(0, UP, -405), { bays: Array(9).fill(4.8), depth: [5, 5, 5], colH: 6, base: 1.6, steps: ['s'], front: 'doors', back: 'wall', sides: 'wall', roof: { chimi: true } });
	labels.push({ id: 'zichen', en: 'Zichen Hall', ko: '자신전', at: [0, UP + zc.ridge + 6, -405], status: 'excavated', note: 'The inner audience hall; past this gate is the emperor’s household' });
	for (const sx of [1, -1]) {
		fence(b, [[sx * 153, -180], [sx > 0 ? eastX(-180) : -800, -180]], (_x, z) => PLAIN + plateau(z), 5);
		fence(b, [[sx * 153, -480], [sx > 0 ? eastX(-480) : -800, -480]], () => UP, 5);
	}
}

/* ------------------------------------------------------------------ the rear court */

function rear(b: Builder, labels: Label[]): void {
	b.push('water', flat(taiyeOutline, WATER));
	b.push('courses', skirt(penglaiOutline, WATER - 2, UP + 1.2));
	const pc = centroid(penglaiOutline);
	const py = UP + 1 + 12;
	const pv = hall(b, at(pc[0], py - 0.6, pc[1]), { bays: [3.4, 3.8, 3.4], depth: [3.4, 3.8, 3.4], colH: 3.6, base: 0.8, front: 'open', back: 'open', sides: 'open', rail: true, roof: { kind: 'pyramid', h: 3.6 } });
	labels.push({ id: 'taiye', en: 'Taiye Pond', ko: '태액지', at: [TAIYE.x - 140, UP + 10, TAIYE.z], status: 'excavated', note: 'The palace lake; its west basin is about 480 × 310 m' });
	labels.push({ id: 'penglai', en: 'Penglai island', ko: '봉래도', at: [pc[0], py + pv.ridge + 5, pc[1]], status: 'excavated', note: 'An island hill for the immortals’ isle, with a pavilion on top' });

	// Linde Hall: three halls front to back on one platform, a tower each side of the middle hall
	const { x, z } = LINDE;
	const top = UP + 2.6;
	box(b, 'courses', at(x, UP - 1, z), 0, (top - UP + 1) / 2, 0, 74, top - UP + 1, 150);
	const front = hall(b, at(x, top, z + 45), { bays: Array(9).fill(5), depth: [5, 5, 5, 5], colH: 6, base: 1, steps: ['s'], front: 'doors', back: 'open', sides: 'wall', roof: { chimi: true } });
	hall(b, at(x, top, z), { bays: Array(9).fill(5), depth: [5, 5, 5, 5], colH: 6.4, base: 1, front: 'open', back: 'open', sides: 'wall', roof: { chimi: true } });
	hall(b, at(x, top, z - 45), { bays: Array(9).fill(5), depth: [5, 5, 5], colH: 5.8, base: 1, front: 'open', back: 'wall', sides: 'wall', roof: { chimi: true } });
	for (const sx of [1, -1]) {
		tower(
			b,
			at(x + sx * 31, top, z),
			{ bays: [3.6, 4, 3.6], depth: [3.6, 4, 3.6], colH: 4.4, base: 0.6, front: 'open', back: 'open', sides: 'wall' },
			{ bays: [3.4, 3.8, 3.4], depth: [3.4, 3.8, 3.4], colH: 3.6, front: 'windows', back: 'windows', sides: 'windows', roof: { kind: 'hip', chimi: true } }
		);
	}
	labels.push({ id: 'linde', en: 'Linde Hall', ko: '인덕전', at: [x, top + front.ridge + 10, z], status: 'excavated', note: 'Three halls joined front to back; the banquet hall for envoys' });
	for (let k = 0; k < 10; k++) b.lampPost(x + (k % 2 ? 40 : -40), top, z - 70 + Math.floor(k / 2) * 34);
}

/* ------------------------------------------------------------------ Chang'an */

const WARDS: Bounds[] = [];
for (const [z0, z1] of [
	[760, 1260],
	[1340, 1840]
]) {
	for (const [x0, x1] of [
		[-1060, -620],
		[-540, -110],
		[110, 540],
		[620, 1060]
	]) {
		WARDS.push({ minX: x0, maxX: x1, minZ: z0, maxZ: z1 });
	}
}

function city(b: Builder, g: Ground, town: Parameters<typeof gridTown>[0], rand: () => number): void {
	for (const w of WARDS) {
		const ring = rect((w.minX + w.maxX) / 2, (w.minZ + w.maxZ) / 2, w.maxX - w.minX, w.maxZ - w.minZ);
		const cx = (w.minX + w.maxX) / 2;
		const midZ = (w.minZ + w.maxZ) / 2;
		stoneWall(b, ring, g.height, { h: 3, t: 2.4, closed: true, mat: 'earth', parapet: false, gaps: [{ at: [w.minX, midZ], half: 6 }, { at: [w.maxX, midZ], half: 6 }, { at: [cx, w.minZ], half: 6 }, { at: [cx, w.maxZ], half: 6 }], step: 10 });
		const inner: Bounds = { minX: w.minX + 8, maxX: w.maxX - 8, minZ: w.minZ + 8, maxZ: w.maxZ - 8 };
		gridTown(town, g.height, rand, inner, 72, (x, z) => Math.abs(x - cx) > 9 && Math.abs(z - midZ) > 9, { density: 0.55, thatch: 0.2, road: 6 });
	}
	box(b, 'path', at(0, PLAIN, 1300), 0, 0.06, 0, 150, 0.1, 1200);
}

/* ------------------------------------------------------------------ build */

const NEAR: Bounds = { minX: -1300, maxX: 1400, minZ: -2100, maxZ: 2000 };

export function buildDaming(_opts: BuildOptions): SiteBuild {
	const g = makeGround();
	const s = startSite('daming', g, { near: NEAR, cell: 8, far: 36000, farCell: 220, center: [0, 0], seed: 663 });
	const { b, forest, town, cover, labels, rand } = s;

	stoneWall(b, OUTLINE, g.height, {
		h: 10,
		t: 9,
		closed: true,
		mat: 'wallRed',
		parapet: false,
		step: 8,
		gaps: [
			{ at: [0, DANFENG], half: 33 },
			{ at: [-420, DANFENG], half: 8 },
			{ at: [420, DANFENG], half: 8 },
			{ at: [-230, -1650], half: 8 }
		]
	});
	gateBlock(b, at(-230, g.height(-230, -1650), -1650, Math.PI), { w: 16, d: 14, h: 10, arch: 5.6, stone: 'wallRed', crenel: false });
	munru(b, at(-230, g.height(-230, -1650) + 10, -1650, Math.PI), { bays: [4, 4.6, 4], depth: [4, 4], colH: 3.8 });
	labels.push({ id: 'xuanwu', en: 'Xuanwu Gate', ko: '현무문', at: [-230, UP + 30, -1650], status: 'excavated' });

	hanyuan(b, labels);
	axis(b, labels);
	rear(b, labels);
	city(b, g, town, rand);

	// willows round Taiye, groves through the rear court, trees down the city avenues
	for (const [x, z] of resample(taiyeOutline, 11, true)) {
		if (rand() > 0.75) continue;
		const c = centroid(taiyeOutline);
		const l = Math.hypot(x - c[0], z - c[1]) || 1;
		const px = x + ((x - c[0]) / l) * 8;
		const pz = z + ((z - c[1]) / l) * 8;
		forest.add('willow', px, g.height(px, pz), pz, 9 + rand() * 4);
	}
	const rearOk = (x: number, z: number) =>
		insidePalace(x, z, 14) && z < -500 && !(taiye.near(x, z, 20) && (taiye.contains(x, z) || taiye.edgeDistance(x, z) < 14)) && !(Math.abs(x - LINDE.x) < 60 && Math.abs(z - LINDE.z) < 95);
	scatterTrees(forest, g, { minX: -800, maxX: 800, minZ: -1650, maxZ: -500 }, 2600, rand, rearOk, (r) => (r > 0.55 ? 'broad' : r > 0.25 ? 'zelkova' : 'pine'), [9, 16]);
	const penglaiTop = (x: number, z: number) => penglai.contains(x, z) && Math.hypot(x - centroid(penglaiOutline)[0], z - centroid(penglaiOutline)[1]) > 10;
	scatterTrees(forest, g, penglai.box, 120, rand, penglaiTop, (r) => (r > 0.5 ? 'pine' : 'broad'), [7, 11]);
	for (let z = 720; z < 1900; z += 22) for (const x of [-70, 70, -100, 100]) forest.add('broad', x + (rand() - 0.5) * 3, g.height(x, z), z, 9 + rand() * 3);
	const sideOk = (x: number, z: number) => insidePalace(x, z, 14) && z > -470 && z < 560 && Math.abs(x) > 200 && !(z > -490 && z < -170 && Math.abs(x) < 170);
	scatterTrees(forest, g, { minX: -800, maxX: 870, minZ: -470, maxZ: 560 }, 1400, rand, sideOk, (r) => (r > 0.5 ? 'zelkova' : 'broad'), [9, 14]);

	scatterCover(cover, g, { minX: -800, maxX: 800, minZ: -1650, maxZ: -500 }, 26000, rand, rearOk, 1);
	for (const [x, z] of resample(taiyeOutline, 2.5, true)) if (rand() > 0.35) cover.add('reed', x, WATER - 0.2, z, 1.3 + rand() * 0.8);

	const views: View[] = [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [-60, PLAIN + 3, 330], target: [0, PLAIN + 16, 10], fov: 52 },
		{ id: 'ramp', en: 'Dragon Tail Way', ko: '용미도', pos: [26, PLAIN + 7, 210], target: [0, UP + 10, -5], fov: 44 },
		{ id: 'danfeng', en: 'Danfeng Gate', ko: '단봉문', pos: [70, PLAIN + 6, 800], target: [0, PLAIN + 14, DANFENG], fov: 46 },
		{ id: 'taiye', en: 'Taiye Pond', ko: '태액지', pos: [TAIYE.x - 320, UP + 14, TAIYE.z + 260], target: [TAIYE.x + 60, UP + 6, TAIYE.z], fov: 44 },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [0, 3600, 300], target: [0, 0, -300], fov: 40 }
	];

	return assemble({
		...s,
		mist: {
			height: g.height,
			box: { minX: -5000, maxX: 5000, minZ: -5000, maxZ: 5000 },
			layers: [
				{ y: WATER + 1, opacity: 0.22 },
				{ y: PLAIN + 3, opacity: 0.12 }
			]
		},
		views,
		wardrobe: { dress: 'tang', x: 90, z: 420, note: 'Futou caps and round-collar robes in rank colour; ladies after the Princess Yongtai mural' },
		center: [0, -200],
		radius: 1500,
		haze: '#d3c8b0'
	});
}
