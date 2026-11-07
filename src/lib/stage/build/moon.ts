import * as THREE from 'three';
import planJson from '../data/wolseong.json';
import { reach } from './life';
import { Folk } from './people';
import { Fleet } from './boats';
import { Region, rng, fbm, noise, smoothstep, distanceToPath, chaikin, resample, frames, nearestOnPath, blob, boundsOf, centroid, type P2, type Bounds } from './geo';
import {
	Builder,
	palette,
	at,
	box,
	hall,
	gate,
	tower,
	corridor,
	cloister,
	court,
	cheomseongdae,
	pavedCourt,
	woodPagoda,
	stonePagoda,
	stoneWall,
	flat,
	skirt,
	ribbon,
	Forest,
	Town,
	type Palette,
	type RoofTile
} from './kit';
import { nearGround, farGround, bump, type Ground } from './terrain';
import { Footprints, lerp, mountainField, pick, assemble, bankCover, contourRing, scatterTrees, scatterCover } from './common';
import { munru, archBridge, wallTorches, bastions, outwardOf, banners } from './fortress';
import { Cover } from './nature';
import type { BuildOptions, Label, SiteBuild, View } from './types';

type Tomb = { name: string | null; at: P2; rx: number; rz: number; angle: number; outline: P2[] };
type WolseongPlan = {
	interior: P2[];
	crest: P2[];
	zones: P2[][];
	moats: P2[][];
	stoneMoat: P2[];
	wolji: { outer: P2[]; islands: P2[][]; largeIsland: { at: P2; area: number } };
	donggung: P2[];
	gyerim: P2[];
	cheomseongdae: P2;
	woljeonggyo: { at: P2; length: number; width: number; angle: number };
	namcheon: P2[];
	hwangnyongsa: { site: P2[]; at: P2 };
	bunhwangsa: P2;
	tombs: Tomb[];
};

const plan = planJson as unknown as WolseongPlan;

/* ------------------------------------------------------------------ levels (metres) */

const INNER = 6.5;
const CREST = 11;
const RIVER_BED = -3.4;
const RIVER_WATER = -2.2;
const POND_BED = -2.8;
const POND_WATER = -1.3;
const DECK = 3.4;

/* ------------------------------------------------------------------ fixed plan pieces */

const crest = new Region(plan.crest);
const interior = new Region(plan.interior);
const river = plan.namcheon;
const riverBox = boundsOf(river);
const moats = plan.moats.map((m) => new Region(m));
const stoneMoat = new Region(plan.stoneMoat);
const wolji = new Region(plan.wolji.outer);
const largeIsland = blob(plan.wolji.largeIsland.at[0], plan.wolji.largeIsland.at[1], Math.sqrt(plan.wolji.largeIsland.area / Math.PI), 77, 16, 0.28);
const islands = [...plan.wolji.islands, largeIsland].map((p) => new Region(p));
const donggung = new Region(plan.donggung);
const gyerim = new Region(plan.gyerim);
const tombs = plan.tombs.map((t) => {
	const r = Math.max(t.rx, t.rz);
	const dia = 2 * Math.min(t.rx, t.rz);
	return { ...t, r, h: Math.min(23, Math.max(2.2, dia * 0.27)) };
});
const crestRing: P2[] = [...plan.crest, plan.crest[0]];
const nearestCrest = (x: number, z: number) => nearestOnPath(crestRing, x, z).p;

const bridge = (() => {
	const w = plan.woljeonggyo;
	const u: P2 = [Math.cos(w.angle), Math.sin(w.angle)];
	const half = w.length / 2;
	const north: P2 = [w.at[0] + u[0] * half, w.at[1] + u[1] * half];
	const south: P2 = [w.at[0] - u[0] * half, w.at[1] - u[1] * half];
	return { at: w.at, u, half, north, south, angle: w.angle };
})();

const iljeong = (() => {
	const n = nearestOnPath(river, 300, 128);
	return { at: n.p, angle: n.angle + Math.PI / 2, half: 30 };
})();

const GATES = [
	{ id: 'west', at: nearestCrest(-445, 128) },
	{ id: 'south', at: nearestCrest(bridge.north[0], bridge.north[1]) },
	{ id: 'east', at: nearestCrest(300, -200) }
];

const mountains = mountainField([
	{ x: 700, z: 4300, rx: 2300, rz: 3100, h: 430, seed: 1.3 },
	{ x: -3400, z: 300, rx: 1100, rz: 1300, h: 360, seed: 2.7 },
	{ x: -300, z: -3700, rx: 900, rz: 700, h: 150, seed: 4.1 },
	{ x: 3500, z: -500, rx: 1200, rz: 1500, h: 250, seed: 5.9 },
	{ x: 8200, z: 1400, rx: 3200, rz: 4200, h: 720, seed: 7.2 },
	{ x: -7600, z: -1200, rx: 2600, rz: 3600, h: 560, seed: 8.8 },
	{ x: 1200, z: -7400, rx: 4200, rz: 2200, h: 420, seed: 9.4 }
]);

/* ------------------------------------------------------------------ era */

/* ------------------------------------------------------------------ ground */

/** The wooded mounds heaped up east and north of Wolji from the spoil of the pond (0..~1). */
function woljiHills(x: number, z: number): number {
	return Math.min(
		1.2,
		bump(x, z, 488, -400, 40, 78) * 0.8 + bump(x, z, 470, -500, 62, 34) + bump(x, z, 392, -505, 70, 26) * 0.75 + bump(x, z, 318, -500, 34, 22) * 0.5
	);
}

function tombLift(x: number, z: number): number {
	let y = 0;
	for (const t of tombs) {
		if (Math.abs(x - t.at[0]) > t.r || Math.abs(z - t.at[1]) > t.r) continue;
		const dx = x - t.at[0];
		const dz = z - t.at[1];
		const c = Math.cos(t.angle);
		const s = Math.sin(t.angle);
		const u = (dx * c + dz * s) / t.rx;
		const v = (-dx * s + dz * c) / t.rz;
		const q = u * u + v * v;
		if (q < 1) y = Math.max(y, t.h * Math.pow(1 - q, 0.62));
	}
	return y;
}

function riverDistance(x: number, z: number): number {
	if (x < riverBox.minX - 90 || x > riverBox.maxX + 90 || z < riverBox.minZ - 90 || z > riverBox.maxZ + 90) return Infinity;
	return distanceToPath(river, x, z);
}

/** Bridge-local coordinates: u along the deck (north +), v across. */
function bridgeLocal(x: number, z: number, at: P2, angle: number): [number, number] {
	const dx = x - at[0];
	const dz = z - at[1];
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	return [dx * c + dz * s, -dx * s + dz * c];
}

/** Ground for every era at once: Wolji's spoil-heaps stay so the land never rebuilds with the year. */
function makeGround(): Ground & { plain(x: number, z: number): number } {
	const plain = (x: number, z: number) => fbm(x / 380 + 3.1, z / 380 - 1.7) * 1.1 + fbm(x / 90, z / 90, 2) * 0.18 + mountains(x, z);

	const height = (x: number, z: number) => {
		let y = plain(x, z) + tombLift(x, z) + woljiHills(x, z) * 10;

		if (crest.near(x, z, 40)) {
			const sd = crest.signed(x, z);
			if (sd > -36) {
				const outside = y;
				const plateau = INNER + fbm(x / 60, z / 60, 2) * 0.35;
				const wall = sd >= 14 ? plateau : sd >= 0 ? lerp(CREST, plateau, smoothstep(0, 14, sd)) : lerp(CREST, outside, smoothstep(0, 32, -sd));
				let g = 0;
				for (const gt of GATES) {
					const dd = Math.hypot(x - gt.at[0], z - gt.at[1]);
					if (dd < 24) g = Math.max(g, 1 - smoothstep(7, 17, dd));
				}
				const pass = sd >= 0 ? plateau : lerp(plateau, outside, smoothstep(0, 32, -sd));
				y = lerp(wall, pass, g);
			}
		}

		// pit moats and the later stone moat share the hollow; the water mesh picks the year
		for (const m of moats) {
			if (!m.near(x, z, 1) || !m.contains(x, z)) continue;
			const edge = smoothstep(0, 5, m.edgeDistance(x, z));
			y = lerp(y, -1.9, edge);
		}
		if (stoneMoat.near(x, z, 1) && stoneMoat.contains(x, z)) y = -2.3;

		const dr = riverDistance(x, z);
		if (dr < 70) y = Math.min(y, lerp(RIVER_BED, 14, smoothstep(20, 62, dr)));

		if (wolji.near(x, z, 1) && wolji.contains(x, z)) {
			y = POND_BED;
			for (const isl of islands) {
				if (isl.near(x, z, 1) && isl.contains(x, z)) y = 0.7 + Math.min(4, isl.edgeDistance(x, z) * 0.35);
			}
		}

		for (const end of [1, -1]) {
			const [u, v] = bridgeLocal(x, z, bridge.at, bridge.angle);
			const du = Math.abs(u - end * (bridge.half + 2));
			const f = (1 - smoothstep(7, 15, Math.abs(v))) * (1 - smoothstep(8, 18, du));
			if (f > 0) y = lerp(y, DECK - 0.4, f);
		}
		return y;
	};

	const tombHere = (x: number, z: number) => tombLift(x, z) > 0.4;
	const fields = ['#8fb05a', '#97b55f', '#8aac56', '#9db962', '#a3b968'];

	const color = (x: number, z: number, y: number, slope: number): string => {
		const n = noise(x / 37, z / 37);
		const mtn = mountains(x, z);
		if (mtn > 6) {
			if (slope > 0.5) return '#7f7b69';
			return mtn > 160 ? pick(['#4b6a3b', '#567644', '#3f5f35'], (n + 1) / 2) : pick(['#56773f', '#4f703c', '#61814a'], (n + 1) / 2);
		}
		const dr = riverDistance(x, z);
		if (dr < 34 && y < -0.6) return y < RIVER_WATER ? '#8f876c' : '#c9bf9a';
		if (wolji.near(x, z, 1) && wolji.contains(x, z) && y < 0) return '#56645a';
		if (crest.near(x, z, 40)) {
			const sd = crest.signed(x, z);
			if (sd > -34) {
				if (slope > 0.1) return n > 0 ? '#76964a' : '#6f8f45';
				return n > 0.2 ? '#93b65d' : '#8aaf57';
			}
		}
		for (const m of moats) if (m.near(x, z, 1) && m.contains(x, z)) return '#55654f';
		if (tombHere(x, z)) return n > 0 ? '#91b05c' : '#89a956';
		if (gyerim.near(x, z, 2) && gyerim.contains(x, z)) return '#5f7d45';
		if (cityAt(x, z) && !reserved(x, z, 0)) {
			if (roadAt(x, z)) return '#c8b68e';
			return n > 0.3 ? '#a3a676' : '#97a86a';
		}
		if (dr < 70) return '#7fa253';
		if (slope < 0.06 && y < 3 && Math.hypot(x - 60, z + 40) > 760) {
			const cx = Math.floor((x + 13) / 52);
			const cz = Math.floor((z - 7) / 34);
			const h = Math.abs(Math.sin(cx * 12.9898 + cz * 78.233) * 43758.5453) % 1;
			return pick(fields, h);
		}
		return n > 0 ? '#86a858' : '#7c9f51';
	};

	const cover = (x: number, z: number, _y: number, slope: number): number => {
		const mtn = mountains(x, z);
		if (mtn > 6) return slope > 0.55 ? 0.2 : smoothstep(6, 40, mtn);
		if (gyerim.near(x, z, 2) && gyerim.contains(x, z)) return 0.8;
		return 0;
	};

	return { height, color, cover, plain };
}

/* ------------------------------------------------------------------ city wards */

const GRID = { x0: 888 - 70, z0: -641 - 70, pitch: 140, road: 7 };

function cityAt(x: number, z: number): boolean {
	if (x > -1350 && x < 1300 && z > -1250 && z < -60) return true;
	if (x > -1350 && x < -470 && z > -60 && z < 170) return true;
	return false;
}

function roadAt(x: number, z: number): boolean {
	const fx = (((x - GRID.x0) % GRID.pitch) + GRID.pitch) % GRID.pitch;
	const fz = (((z - GRID.z0) % GRID.pitch) + GRID.pitch) % GRID.pitch;
	return fx < GRID.road || fx > GRID.pitch - GRID.road || fz < GRID.road || fz > GRID.pitch - GRID.road;
}

const TEMPLE = { x: plan.hwangnyongsa.at[0], z: plan.hwangnyongsa.at[1], w: 200, d: 190 };
const BUNHWANG = { x: plan.bunhwangsa[0], z: plan.bunhwangsa[1] };
/** The hwarang drill yard across the Southern Stream: placed, not excavated. */
const YARD = { x: -120, z: 470, w: 96, d: 64 };
const HWARANG_YEAR = 576;

function reserved(x: number, z: number, pad: number): boolean {
	if (crest.near(x, z, 70 + pad) && crest.signed(x, z) > -(58 + pad)) return true;
	if (donggung.near(x, z, pad + 12) && (donggung.contains(x, z) || donggung.edgeDistance(x, z) < pad + 12)) return true;
	if (gyerim.near(x, z, pad + 12) && (gyerim.contains(x, z) || gyerim.edgeDistance(x, z) < pad + 12)) return true;
	if (Math.hypot(x - plan.cheomseongdae[0], z - plan.cheomseongdae[1]) < 45 + pad) return true;
	if (Math.abs(x - TEMPLE.x) < TEMPLE.w / 2 + 25 + pad && Math.abs(z - TEMPLE.z) < TEMPLE.d / 2 + 40 + pad) return true;
	if (Math.abs(x - BUNHWANG.x) < 70 + pad && Math.abs(z - BUNHWANG.z) < 70 + pad) return true;
	if (Math.abs(x - YARD.x) < YARD.w / 2 + 16 + pad && Math.abs(z - YARD.z) < YARD.d / 2 + 16 + pad) return true;
	for (const t of tombs) {
		if (Math.abs(x - t.at[0]) < t.r + 14 + pad && Math.abs(z - t.at[1]) < t.r + 14 + pad) return true;
	}
	if (riverDistance(x, z) < 64 + pad) return true;
	return false;
}

/** Packed-earth drill yard: butts and targets at the north end, an archers' pavilion at the south, racks and silk banners down the sides. */
function hwarangYard(b: Builder, g: ReturnType<typeof makeGround>, labels: Label[]): number {
	const y = g.height(YARD.x, YARD.z) + 0.1;
	const hw = YARD.w / 2;
	const hd = YARD.d / 2;
	box(b, 'earth', at(YARD.x, y, YARD.z), 0, -0.7, 0, YARD.w, 1.6, YARD.d);
	box(b, 'path', at(YARD.x, y, YARD.z), 0, 0.03, 0, 3, 0.06, YARD.d - 10);
	// three butts with painted targets, facing south down the range
	for (const dx of [-24, 0, 24]) {
		const tz = YARD.z - hd + 6;
		box(b, 'earth', at(YARD.x + dx, y, tz - 2.2), 0, 1.2, 0, 7, 2.4, 3);
		for (const sx of [-1.4, 1.4]) box(b, 'wood', at(YARD.x + dx + sx, y, tz), 0, 1.1, 0, 0.16, 2.2, 0.16);
		box(b, 'plaster', at(YARD.x + dx, y + 1.5, tz), 0, 0, 0.04, 2.4, 1.6, 0.08);
		box(b, 'wallRed', at(YARD.x + dx, y + 1.5, tz), 0, 0, 0.1, 1.2, 0.8, 0.04);
		box(b, 'dark', at(YARD.x + dx, y + 1.5, tz), 0, 0, 0.13, 0.4, 0.3, 0.03);
	}
	const pav = hall(b, at(YARD.x, y, YARD.z + hd - 6), { bays: [3.2, 3.8, 3.2], depth: [3.4], colH: 3.4, base: 0.7, front: 'open', back: 'open', sides: 'open', steps: ['n'], roof: { kind: 'hip' } });
	// weapon racks with spears and bows, and silk banners in the hwarang colours down both long sides
	for (const sx of [1, -1]) {
		const rx = YARD.x + sx * (hw - 3);
		for (const rz of [YARD.z - 10, YARD.z + 10]) {
			for (const dz of [-1.6, 1.6]) box(b, 'wood', at(rx, y, rz + dz), 0, 0.8, 0, 0.14, 1.6, 0.14);
			box(b, 'wood', at(rx, y + 1.4, rz), 0, 0, 0, 0.12, 0.12, 3.4);
			for (let k = -1.2; k <= 1.21; k += 0.6) box(b, 'dark', at(rx + sx * 0.2, y, rz + k), 0, 1.3, 0, 0.05, 2.6, 0.05);
		}
		const cloths = ['blue', 'yellow', 'vermilion', 'purple', 'white'] as const;
		cloths.forEach((cloth, i) => {
			const bz = YARD.z - hd + 10 + (i * (YARD.d - 20)) / (cloths.length - 1);
			banners(b, [[YARD.x + sx * (hw + 2), y, bz]], cloth, 6.5, sx > 0 ? Math.PI : 0);
		});
	}
	b.lampPost(YARD.x - 8, y, YARD.z + hd + 3);
	b.lampPost(YARD.x + 8, y, YARD.z + hd + 3);
	labels.push({
		id: 'hwarang-yard',
		en: 'Hwarang yard',
		ko: '화랑 연무장',
		at: [YARD.x, y + pav.ridge + 6, YARD.z],
		status: 'fictional',
		note: 'Where the hwarang shot and drilled near the palace. The records keep the bows and the songs, not the yard',
		era: { from: HWARANG_YEAR }
	});
	return y;
}

/** Town wards stay put; density is the middle-era look so the street never rebuilds with the year. */
function city(g: ReturnType<typeof makeGround>, town: Town, forest: Forest): void {
	const rand = rng(680);
	const density = 0.82;
	const tileShare = 0.75;
	const plot = GRID.pitch / 3;
	for (let i = -16; i < 4; i++) {
		for (let j = -5; j < 6; j++) {
			const bx = GRID.x0 + i * GRID.pitch + GRID.pitch / 2;
			const bz = GRID.z0 + j * GRID.pitch + GRID.pitch / 2;
			for (let pi = -1; pi <= 1; pi++) {
				for (let pj = -1; pj <= 1; pj++) {
					const px = bx + pi * plot;
					const pz = bz + pj * plot;
					if (!cityAt(px, pz) || reserved(px, pz, 10)) continue;
					if (rand() > density) continue;
					const thatched = rand() > tileShare;
					const rot = 0;
					const mx = px + (rand() - 0.5) * 6;
					const mz = pz - 7;
					town.add(mx, g.height(mx, mz), mz, rot, 11 + rand() * 4, 6.4 + rand() * 1.6, 4.4 + rand() * 0.8, thatched);
					const sx = rand() > 0.5 ? 1 : -1;
					const ax = px + sx * 12;
					const az = pz + 7;
					town.add(ax, g.height(ax, az), az, rot + Math.PI / 2, 7 + rand() * 2, 4.4, 3.7, thatched || rand() > 0.7);
					if (rand() > 0.6) {
						const gx = px - sx * 8;
						const gz = pz + 15;
						town.add(gx, g.height(gx, gz), gz, rot, 6, 3.6, 3.3, thatched);
					}
					if (rand() > 0.68) {
						const tx = px - sx * 15;
						const tz = pz - 15;
						forest.add(rand() > 0.5 ? 'broad' : 'zelkova', tx, g.height(tx, tz), tz, 7 + rand() * 5);
					}
				}
			}
		}
	}
	// hamlets south of the river
	for (let k = 0; k < 260; k++) {
		const x = -950 + rand() * 1700;
		const z = 160 + rand() * 650;
		const y = g.height(x, z);
		if (y > 4 || riverDistance(x, z) < 80 || mountains(x, z) > 2) continue;
		if (noise(x / 160, z / 160) < 0.1) continue;
		town.add(x, y, z, (rand() - 0.5) * 0.4, 10 + rand() * 3, 6 + rand(), 4.2, rand() > tileShare * 0.7);
		if (rand() > 0.5) forest.add('broad', x + 10, g.height(x + 10, z - 8), z - 8, 8 + rand() * 4);
	}
}

/* ------------------------------------------------------------------ palace interior */

type Slot = { id: string; x: number; z: number; w: number; d: number };

const SLOTS: Slot[] = [
	{ id: 'jowon', x: 372, z: -16, w: 124, d: 112 },
	{ id: 'naejeon', x: 262, z: -78, w: 84, d: 66 },
	{ id: 'gangmu', x: 56, z: -104, w: 74, d: 84 },
	{ id: 'sungnye', x: -300, z: 112, w: 66, d: 56 },
	{ id: 'office1', x: -180, z: 36, w: 54, d: 36 },
	{ id: 'office2', x: -58, z: -94, w: 48, d: 34 },
	{ id: 'store', x: 458, z: -14, w: 30, d: 28 },
	{ id: 'ongmun', x: -330, z: 176, w: 40, d: 28 }
];

function fits(s: { x: number; z: number; w: number; d: number }, inset: number): boolean {
	const pts: P2[] = [
		[s.x - s.w / 2, s.z - s.d / 2],
		[s.x + s.w / 2, s.z - s.d / 2],
		[s.x + s.w / 2, s.z + s.d / 2],
		[s.x - s.w / 2, s.z + s.d / 2],
		[s.x, s.z - s.d / 2],
		[s.x, s.z + s.d / 2],
		[s.x - s.w / 2, s.z],
		[s.x + s.w / 2, s.z]
	];
	return pts.every(([x, z]) => interior.signed(x, z) >= inset);
}

/** Height a court should sit at, and the lowest ground under it. */
function courtLevel(g: Ground, s: { x: number; z: number; w: number; d: number }): { y: number; low: number } {
	let hi = -Infinity;
	let lo = Infinity;
	for (let i = 0; i <= 4; i++) {
		for (let j = 0; j <= 4; j++) {
			const y = g.height(s.x - s.w / 2 + (s.w * i) / 4, s.z - s.d / 2 + (s.d * j) / 4);
			hi = Math.max(hi, y);
			lo = Math.min(lo, y);
		}
	}
	return { y: hi + 0.15, low: lo };
}

const bays = (n: number, w: number, mid = w) => Array.from({ length: n }, (_, i) => (i === Math.floor(n / 2) ? mid : w));

function officeCourt(b: Builder, g: Ground, s: Slot, tile: RoofTile, rand: () => number): void {
	const { y, low } = courtLevel(g, s);
	court(b, s.x, s.z, s.w, s.d, y, { plinth: low, tile, pave: rand() > 0.5 ? 'gravel' : 'paving' });
	const chimi = tile !== 'thatch';
	const mainBays = s.w > 50 ? bays(7, 3.2, 3.8) : bays(5, 3.2, 3.8);
	hall(b, at(s.x, y, s.z - s.d / 2 + 10), {
		bays: mainBays,
		depth: s.d > 36 ? [3, 3.4, 3] : [3, 3.2],
		colH: 3.7,
		base: 0.9,
		roof: { tile, chimi }
	});
	if (s.w > 38) {
		for (const sx of rand() > 0.45 ? [1, -1] : [rand() > 0.5 ? 1 : -1]) {
			hall(b, at(s.x + sx * (s.w / 2 - 6.5), y, s.z + 5, sx > 0 ? -Math.PI / 2 : Math.PI / 2), {
				bays: bays(s.d > 36 ? 5 : 4, 3),
				depth: [2.8, 2.6],
				colH: 3.1,
				base: 0.5,
				roof: { kind: rand() > 0.5 ? 'hip' : 'hipgable', tile, h: 2.6, chimi: false }
			});
		}
	}
	if (s.d > 40 && rand() > 0.3) {
		hall(b, at(s.x, y, s.z + s.d / 2 - 9), { bays: bays(3, 3), depth: [2.6, 2.6], colH: 3, base: 0.5, front: 'open', back: 'open', sides: 'wall', roof: { kind: 'hip', tile, h: 2.3 } });
	}
}

function palace(b: Builder, g: Ground, taken: Footprints, labels: Label[]): void {
	const rand = rng(680 * 3 + 7);
	const tile: RoofTile = 'tile';
	const slot = (id: string) => SLOTS.find((s) => s.id === id)!;
	for (const s of SLOTS) {
		if (!fits(s, 3)) console.warn('[stage] slot outside the rampart', s.id);
	}

	// Jowonjeon from 651; Namdang before it — both stay in the scene and rise or sink with the year
	{
		const s = slot('jowon');
		const { y, low } = courtLevel(g, s);
		taken.add(s.x, s.z, s.w, s.d);
		b.setEra(undefined, 651);
		court(b, s.x, s.z, s.w * 0.7, s.d * 0.7, y, { plinth: low, pave: 'gravel' });
		const nam = hall(b, at(s.x, y, s.z - 8), { bays: bays(7, 3.6, 4.2), depth: [3.4, 4, 3.4], colH: 4.6, base: 1, roof: { chimi: true } });
		labels.push({ id: 'namdang', en: 'Namdang', ko: '남당', at: [s.x, y + nam.ridge + 3, s.z - 8], status: 'placed', note: 'Council hall of the early kings; site unknown', era: { to: 651 } });
		b.setEra(651);
		box(b, 'courses', at(s.x, low - 0.6, s.z), 0, (y - low + 0.6) / 2, 0, s.w + 8, y - low + 0.6, s.d + 8);
		cloister(b, s.x, s.z, s.w, s.d, y, {
			gate: { bays: [3.8, 4.6, 3.8], depth: [3.2, 3.2], colH: 4.4, twoStorey: true },
			width: 5.4,
			colH: 3.6,
			northGate: true
		});
		const main = hall(b, at(s.x, y, s.z - s.d / 2 + 30), {
			bays: [4.2, 4.2, 4.5, 4.5, 5.4, 4.5, 4.5, 4.2, 4.2],
			depth: [4, 5, 5, 4],
			colH: 6,
			base: 2.2,
			tiers: 2,
			steps: ['s', 'e', 'w'],
			roof: { chimi: true }
		});
		for (const sx of [1, -1]) {
			hall(b, at(s.x + sx * 38, y, s.z + 14, sx > 0 ? -Math.PI / 2 : Math.PI / 2), {
				bays: bays(7, 3.6),
				depth: [3.4, 3.4],
				colH: 4.2,
				base: 0.9,
				roof: { chimi: true }
			});
		}
		pavedCourt(b, s.x, s.z + 22, 56, 56, y, { axis: 4, ranks: 5, lanterns: true });
		labels.push({ id: 'jowon', en: 'Jowonjeon', ko: '조원전', at: [s.x, y + main.ridge + 3, s.z - s.d / 2 + 30], status: 'placed', note: 'Main audience hall from 651; site not yet found', era: { from: 651 } });
		b.setEra();
	}

	// the inner palace
	{
		const s = slot('naejeon');
		const { y, low } = courtLevel(g, s);
		taken.add(s.x, s.z, s.w, s.d);
		court(b, s.x, s.z, s.w, s.d, y, { plinth: low, pave: 'gravel' });
		hall(b, at(s.x, y, s.z - s.d / 2 + 14), { bays: bays(7, 3.4, 3.8), depth: [3, 3.6, 3], colH: 4, base: 1.1, roof: { chimi: true } });
		hall(b, at(s.x - 4, y, s.z + 12), { bays: bays(5, 3.2), depth: [3, 3], colH: 3.6, base: 0.8, front: 'windows' });
		hall(b, at(s.x + s.w / 2 - 9, y, s.z + 6, -Math.PI / 2), { bays: bays(4, 3), depth: [2.8, 2.6], colH: 3.2, base: 0.6, roof: { kind: 'hip', h: 2.6 } });
		labels.push({ id: 'naejeon', en: 'Inner palace', ko: '내전', at: [s.x, y + 16, s.z], status: 'placed' });
	}

	// Gangmujeon from 677; an office court before it
	{
		const s = slot('gangmu');
		taken.add(s.x, s.z, s.w, s.d);
		b.setEra(undefined, 677);
		officeCourt(b, g, { ...s, w: 56, d: 40 }, tile, rand);
		b.setEra(677);
		const { y, low } = courtLevel(g, s);
		court(b, s.x, s.z, s.w, s.d, y, { plinth: low, pave: 'gravel', gateBays: [3, 3.8, 3] });
		const gm = hall(b, at(s.x, y, s.z - s.d / 2 + 12), { bays: bays(7, 3.6, 4), depth: [3.2, 3.8, 3.2], colH: 4.4, base: 1.4, roof: { chimi: true } });
		for (let k = 0; k < 3; k++) box(b, 'wood', at(s.x - 18 + k * 18, y, s.z + s.d / 2 - 10), 0, 1.1, 0, 2.4, 2.2, 0.3);
		labels.push({ id: 'gangmu', en: 'Gangmujeon', ko: '강무전', at: [s.x, y + gm.ridge + 3, s.z - s.d / 2 + 12], status: 'recorded', note: 'King Munmu watched archery at its south gate (677)', era: { from: 677 } });
		b.setEra();
	}

	// Sungnyejeon from 698; an office court before it
	{
		const s = slot('sungnye');
		taken.add(s.x, s.z, s.w, s.d);
		b.setEra(undefined, 698);
		officeCourt(b, g, s, tile, rand);
		b.setEra(698);
		const { y, low } = courtLevel(g, s);
		court(b, s.x, s.z, s.w, s.d, y, { plinth: low, pave: 'paving', gateBays: [3, 3.8, 3] });
		const sh = hall(b, at(s.x, y, s.z - s.d / 2 + 13), { bays: bays(7, 3.4, 4), depth: [3, 3.6, 3], colH: 4.4, base: 1.4, roof: { chimi: true } });
		for (const sx of [1, -1]) hall(b, at(s.x + sx * 24, y, s.z + 10, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: bays(4, 3.2), depth: [3, 2.8], colH: 3.4, base: 0.7 });
		labels.push({ id: 'sungnye', en: 'Sungnyejeon', ko: '숭례전', at: [s.x, y + sh.ridge + 3, s.z - s.d / 2 + 13], status: 'recorded', note: 'Envoys received here (698)', era: { from: 698 } });
		b.setEra();
	}

	for (const id of ['office1', 'office2']) {
		const s = slot(id);
		taken.add(s.x, s.z, s.w, s.d);
		officeCourt(b, g, s, tile, rand);
	}

	// Cheonjongo, the treasury storehouse (recorded 682)
	{
		const s = slot('store');
		taken.add(s.x, s.z, s.w, s.d);
		const { y, low } = courtLevel(g, s);
		court(b, s.x, s.z, s.w, s.d, y, { plinth: low, pave: 'gravel', gate: 'w', gateBays: [3] });
		const st = hall(b, at(s.x + 2, y, s.z), {
			bays: bays(5, 3),
			depth: [3, 3],
			colH: 3,
			base: 0.6,
			posts: 1.4,
			front: 'wall',
			roof: { kind: 'hip', h: 3.2, tile }
		});
		labels.push({ id: 'cheonjon', en: 'Cheonjongo', ko: '천존고', at: [s.x, y + st.ridge + 3, s.z], status: 'recorded', note: 'Treasury of the flute and the zither', era: { from: 680 } });
	}

	// Ongmunji, the pond where frogs croaked in winter (636)
	{
		const s = slot('ongmun');
		taken.add(s.x, s.z, s.w, s.d);
		const y = g.height(s.x, s.z);
		const pond = blob(s.x, s.z + 2, 12, 31, 14, 0.18).map(([x, z]) => [s.x + (x - s.x) * 1.35, z] as P2);
		b.push('courses', skirt(pond, y - 1.6, y + 0.25));
		b.push('water', flat(pond, y - 0.5));
		b.push('earth', flat(pond, y - 1.6));
		hall(b, at(s.x, y, s.z - s.d / 2 - 2), { bays: [2.8, 2.8, 2.8], depth: [2.6, 2.6], colH: 3, base: 0.6, front: 'open', back: 'wall', sides: 'open', rail: true, roof: { kind: 'hip', h: 2.4 } });
		labels.push({ id: 'ongmun', en: 'Ongmunji', ko: '옥문지', at: [s.x, y + 9, s.z], status: 'placed', note: 'Queen Seondeok heard frogs here in winter (636)', era: { from: 632 } });
	}

	// offices that fill the plateau (middle-era share, so the yard never rebuilds)
	const fill: Slot[] = [];
	const ib = interior.box;
	for (let pass = 0; pass < 2; pass++) {
		const step = pass === 0 ? 22 : 14;
		for (let z = ib.minZ + 16; z < ib.maxZ - 16; z += step) {
			for (let x = ib.minX + 16; x < ib.maxX - 16; x += step) {
				const big = pass === 0;
				const w = big ? 52 + Math.floor(rand() * 4) * 6 : 34 + Math.floor(rand() * 3) * 5;
				const d = big ? 38 + Math.floor(rand() * 3) * 6 : 26 + Math.floor(rand() * 2) * 5;
				const s = { id: 'fill', x: x + (rand() - 0.5) * 6, z: z + (rand() - 0.5) * 6, w, d };
				if (!fits(s, 6) || taken.hits(s.x, s.z, s.w, s.d, 9)) continue;
				if (spineDistance(s) < 7) continue;
				taken.add(s.x, s.z, s.w, s.d);
				if (rand() < 0.85) fill.push(s);
			}
		}
	}
	for (const s of fill) officeCourt(b, g, s, tile, rand);
}

/* ------------------------------------------------------------------ paths inside the walls */

let spineCache: P2[] | null = null;

/** A walk through the middle of the crescent, from the west gate to the east gate. */
function spine(): P2[] {
	if (spineCache) return spineCache;
	const pts: P2[] = [];
	const west = GATES[0].at;
	pts.push([west[0] + 22, west[1]]);
	for (let x = -400; x <= 500; x += 20) {
		let lo = Infinity;
		let hi = -Infinity;
		for (let z = -240; z <= 260; z += 3) {
			if (interior.signed(x, z) > 16) {
				lo = Math.min(lo, z);
				hi = Math.max(hi, z);
			}
		}
		if (lo < hi) pts.push([x, (lo + hi) / 2]);
	}
	spineCache = chaikin(pts, 3, false);
	return spineCache;
}

function spineDistance(s: { x: number; z: number; w: number; d: number }): number {
	const path = spine();
	let best = Infinity;
	for (const [px, pz] of [
		[s.x, s.z],
		[s.x - s.w / 2, s.z - s.d / 2],
		[s.x + s.w / 2, s.z - s.d / 2],
		[s.x + s.w / 2, s.z + s.d / 2],
		[s.x - s.w / 2, s.z + s.d / 2],
		[s.x, s.z - s.d / 2],
		[s.x, s.z + s.d / 2]
	] as P2[]) {
		best = Math.min(best, distanceToPath(path, px, pz));
	}
	for (const [x, z] of resample(path, 4, false)) {
		if (Math.abs(x - s.x) < s.w / 2 && Math.abs(z - s.z) < s.d / 2) return 0;
	}
	return best;
}

function paths(b: Builder, g: Ground, taken: Footprints): void {
	const lay = (path: P2[], width: number) => {
		const pts = resample(path, 3, false);
		let run: P2[] = [];
		const flush = () => {
			if (run.length > 1) b.push('path', ribbon(run, width, (x, z) => g.height(x, z) + 0.09));
			run = [];
		};
		for (const p of pts) {
			if (taken.inside(p[0], p[1], 1.5)) flush();
			else run.push(p);
		}
		flush();
	};
	const main = spine();
	const east = GATES[2].at;
	lay([GATES[0].at, ...main, [east[0], east[1] + 18], east], 7);
	const south = GATES[1].at;
	lay([south, nearestOnPath(main, south[0], south[1]).p], 6);
	for (const s of SLOTS) {
		const gateAt: P2 = s.id === 'store' ? [s.x - s.w / 2, s.z] : [s.x, s.z + s.d / 2 + 1];
		const n = nearestOnPath(main, gateAt[0], gateAt[1]);
		if (n.d > 4 && n.d < 90) lay([gateAt, n.p], 4.5);
	}
	// the walk along the crest
	lay(resample(chaikin(plan.crest, 2, true), 6, true), 2.6);
}

/* ------------------------------------------------------------------ gates in the rampart */

function rampartGates(b: Builder, g: Ground, labels: Label[]): void {
	const ring = resample(chaikin(plan.crest, 2, true), 4, true);
	const fr = frames(ring, true);
	const area = (() => {
		let a = 0;
		for (let i = 0; i < plan.crest.length; i++) {
			const [x0, z0] = plan.crest[i];
			const [x1, z1] = plan.crest[(i + 1) % plan.crest.length];
			a += x0 * z1 - x1 * z0;
		}
		return a;
	})();
	const out = area > 0 ? 1 : -1;
	for (const gt of GATES) {
		let k = 0;
		let best = Infinity;
		ring.forEach(([x, z], i) => {
			const d = Math.hypot(x - gt.at[0], z - gt.at[1]);
			if (d < best) {
				best = d;
				k = i;
			}
		});
		const n = fr[k].n;
		const nx = n[0] * out;
		const nz = n[1] * out;
		const [x, z] = ring[k];
		const y = g.height(x, z);
		const rot = Math.atan2(nx, nz);
		const res = gate(b, at(x, y, z, rot), gt.id === 'east' ? [4.2] : [3.4, 4.2, 3.4], [3, 3], 4, { base: 0.6, roof: { chimi: gt.id !== 'east' } });
		const labelText: Record<string, [string, string, Label['status'], string]> = {
			west: ['West gate', '서문지', 'excavated', 'Gate site found in the west wall'],
			south: ['River gate', '남문', 'placed', 'Where the bridge lands; gate placed'],
			east: ['East gate', '동문지', 'excavated', 'Found in 1979: one bay by two, the stone moat outside']
		};
		const [en, ko, status, note] = labelText[gt.id];
		labels.push({ id: `gate-${gt.id}`, en, ko, at: [x, y + res.ridge + 3, z], status, note });
	}
}

/* ------------------------------------------------------------------ moats */

function moatWork(b: Builder, labels: Label[]): void {
	b.setEra(undefined, 680);
	for (const m of plan.moats) b.push('water', flat(m, -0.9));
	const pit = centroid(plan.moats[3]);
	labels.push({ id: 'moats', en: 'Pond moats', ko: '해자', at: [pit[0], 6, pit[1]], status: 'excavated', note: 'Five pond-moats along the north wall', era: { to: 680 } });
	b.setEra(680);
	b.push('courses', skirt(plan.stoneMoat, -2.3, 0.35));
	b.push('water', flat(plan.stoneMoat, -1));
	const stone = centroid(plan.stoneMoat);
	labels.push({ id: 'stone-moat', en: 'Stone moat', ko: '석축해자', at: [stone[0], 7, stone[1]], status: 'excavated', note: 'Dressed-stone moat that replaced the ponds', era: { from: 680 } });
	b.setEra();
}

/* ------------------------------------------------------------------ river and bridges */

function riverWater(b: Builder): void {
	const path = resample(chaikin(river, 2, false), 8, false);
	b.push('water', ribbon(path, 36, () => RIVER_WATER));
}

function pier(b: Builder, x: number, z: number, rot: number, len: number, w: number, y0: number, y1: number): void {
	const shape = new THREE.Shape();
	const pts: P2[] = [
		[-len / 2, 0],
		[-len / 2 + w * 0.9, -w / 2],
		[len / 2 - w * 0.9, -w / 2],
		[len / 2, 0],
		[len / 2 - w * 0.9, w / 2],
		[-len / 2 + w * 0.9, w / 2]
	];
	shape.moveTo(pts[0][0], pts[0][1]);
	for (const [px, pz] of pts.slice(1)) shape.lineTo(px, pz);
	shape.closePath();
	const geo = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
	geo.rotateX(-Math.PI / 2);
	const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
	for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.5, uv.getY(i) * 0.5);
	b.push('courses', geo, at(x, y0, z, rot));
}

function woljeonggyo(b: Builder, labels: Label[]): void {
	const { at: c, angle, half } = bridge;
	const rot = -angle;
	const m = at(c[0], 0, c[1], rot);
	const L = half * 2 - 8;
	for (const u of [-21, -7, 7, 21]) {
		const px = c[0] + Math.cos(angle) * u;
		const pz = c[1] + Math.sin(angle) * u;
		pier(b, px, pz, rot + Math.PI / 2, 13, 2.6, RIVER_BED - 0.4, DECK - 0.9);
	}
	box(b, 'wood', m, 0, DECK - 0.55, 0, L, 0.7, 9.6);
	box(b, 'stone', m, 0, DECK - 0.12, 0, L, 0.24, 9);
	corridor(b, [c[0] - Math.cos(angle) * (L / 2), c[1] - Math.sin(angle) * (L / 2)], [c[0] + Math.cos(angle) * (L / 2), c[1] + Math.sin(angle) * (L / 2)], DECK, {
		width: 7.6,
		colH: 3.6,
		bay: 3.4,
		base: 0.2
	});
	for (const sz of [1, -1]) {
		box(b, 'timber', m, 0, DECK + 1.05, sz * 4.3, L, 0.14, 0.14);
		box(b, 'timber', m, 0, DECK + 0.5, sz * 4.3, L, 0.1, 0.1);
		for (let u = -L / 2 + 5; u < L / 2; u += 10.2) {
			const v = sz * 3.2;
			b.lamps.push([c[0] + Math.cos(angle) * u - Math.sin(angle) * v, DECK + 3, c[1] + Math.sin(angle) * u + Math.cos(angle) * v]);
		}
	}
	for (const end of [1, -1]) {
		const u = end * (half + 2);
		const px = c[0] + Math.cos(angle) * u;
		const pz = c[1] + Math.sin(angle) * u;
		const gm = at(px, DECK - 0.4, pz, rot + (end > 0 ? Math.PI / 2 : -Math.PI / 2));
		box(b, 'courses', gm, 0, -2.2, 0, 13, 4.6, 16);
		tower(
			b,
			gm,
			{ bays: [3.4, 4.2, 3.4], depth: [3, 3], colH: 4, base: 0.4, front: 'open', back: 'open', sides: 'wall', steps: [], gateLine: 1 },
			{ bays: [3.4, 4.2, 3.4], depth: [3, 3], colH: 2.9, front: 'windows', back: 'windows', sides: 'wall', roof: { chimi: true } }
		);
	}
	labels.push({ id: 'woljeonggyo', en: 'Woljeonggyo', ko: '월정교', at: [c[0], DECK + 18, c[1]], status: 'excavated', note: 'Covered bridge of 760; piers excavated, rebuilt 2018', era: { from: 760 } });
}

function iljeonggyo(b: Builder, labels: Label[]): void {
	const { at: c, angle, half } = iljeong;
	const rot = -angle;
	const m = at(c[0], 0, c[1], rot);
	const deck = 1.6;
	for (const u of [-18, -6, 6, 18]) {
		pier(b, c[0] + Math.cos(angle) * u, c[1] + Math.sin(angle) * u, rot + Math.PI / 2, 10, 2.2, RIVER_BED - 0.4, deck - 0.6);
	}
	box(b, 'wood', m, 0, deck - 0.3, 0, half * 2 + 10, 0.5, 6);
	for (const sz of [1, -1]) box(b, 'timber', m, 0, deck + 0.85, sz * 2.9, half * 2 + 10, 0.12, 0.12);
	labels.push({ id: 'iljeonggyo', en: 'Iljeonggyo', ko: '일정교', at: [c[0], 10, c[1]], status: 'excavated', note: 'Second bridge of 760; only the piers survive, deck drawn plain', era: { from: 760 } });
}

/* ------------------------------------------------------------------ the Ghost Bridge */

/** 귀교: Samguk Yusa puts it on the north ditch of Sinwonsa; drawn here on Namcheon west of the crescent. */
const GHOST = (() => {
	const n = nearestOnPath(river, -850, 330);
	return { at: n.p, angle: n.angle + Math.PI / 2 };
})();

function ghostBridge(b: Builder, g: Ground, forest: Forest, labels: Label[], rand: () => number): void {
	const { at: c, angle } = GHOST;
	const ux = Math.cos(angle);
	const uz = Math.sin(angle);
	const L = 11 + 13 + 11 + 3.6 * 2 + 7 * 2;
	const ground = (d: number) => g.height(c[0] + ux * d, c[1] + uz * d);
	const deck = 5.2;
	const reach = archBridge(b, at(c[0], 0, c[1], -angle), {
		spans: [11, 13, 11],
		pier: 3.6,
		width: 7.4,
		bed: RIVER_BED - 0.6,
		spring: RIVER_WATER - 0.2,
		deck,
		ends: [ground(-L / 2 - 3), ground(L / 2 + 3)],
		abut: 7
	});
	// the north end: a lamp at each side of the steps, and a two-storey pavilion on a stone platform beside them
	const north = uz < 0 ? 1 : -1;
	const [px, pz] = [-uz, ux];
	for (const side of [1, -1]) {
		const d = north * (reach + 2);
		b.lampPost(c[0] + ux * d + px * side * 5, ground(d), c[1] + uz * d + pz * side * 5);
	}
	const vx = c[0] + ux * north * (reach + 14) + px * 18;
	const vz = c[1] + uz * north * (reach + 14) + pz * 18;
	const vy = g.height(vx, vz);
	const face = Math.atan2(c[0] - vx, c[1] - vz);
	box(b, 'courses', at(vx, vy - 1, vz, face), 0, 2, 0, 15, 4, 13);
	const pav = tower(
		b,
		at(vx, vy + 3, vz, face),
		{ bays: [3, 3.6, 3], depth: [3, 3], colH: 3.2, base: 0.3, front: 'windows', back: 'wall', sides: 'wall' },
		{ bays: [3, 3.6, 3], depth: [3, 3], colH: 2.8, front: 'open', back: 'open', sides: 'open', rail: true, roof: { chimi: true } }
	);
	// red maples and pines on both banks
	for (let k = 0; k < 26; k++) {
		const end = rand() > 0.5 ? 1 : -1;
		const d = end * (reach + 6 + rand() * 40);
		const off = (rand() > 0.5 ? 1 : -1) * (9 + rand() * 34);
		const x = c[0] + ux * d + px * off;
		const z = c[1] + uz * d + pz * off;
		if (riverDistance(x, z) < 34 || Math.hypot(x - vx, z - vz) < 12) continue;
		forest.add(rand() > 0.35 ? 'maple' : 'pine', x, g.height(x, z), z, 6 + rand() * 5);
	}
	labels.push({
		id: 'ghost-bridge',
		en: 'Ghost Bridge',
		ko: '귀교',
		at: [c[0], deck + pav.ridge + 4, c[1]],
		status: 'recorded',
		note: 'Samguk Yusa: Bihyung’s goblins lay the stones in one night, in Jinpyeong’s reign; the spot is placed',
		era: { from: 612 }
	});
}

/* ------------------------------------------------------------------ Myeonghwalseong */

/** Radiance Fortress (명활성) on the hill east of the capital, facing Wolseong across the field. */
const MYEONGHWAL: P2 = [3500, -500];
const RADIANCE_TILE: Bounds = { minX: 2500, maxX: 4500, minZ: -1600, maxZ: 600 };
const RADIANCE_WALL = 6;

function radiance(b: Builder, g: Ground, forest: Forest, cover: Cover, labels: Label[], rand: () => number): { gate: P2; rot: number; y: number; ridge: number } {
	let top: P2 = MYEONGHWAL;
	let hy = -Infinity;
	for (let x = MYEONGHWAL[0] - 600; x <= MYEONGHWAL[0] + 600; x += 20) {
		for (let z = MYEONGHWAL[1] - 700; z <= MYEONGHWAL[1] + 700; z += 20) {
			const y = g.height(x, z);
			if (y > hy) {
				hy = y;
				top = [x, z];
			}
		}
	}
	const ring = contourRing(g.height, top[0], top[1], hy - 42, 900, 120);
	const out = outwardOf(ring);
	const gate = ring.reduce((best, p) => (p[0] < best[0] ? p : best), ring[0]);
	const rot = Math.atan2(gate[0] - top[0], gate[1] - top[1]);
	const nearGate = (x: number, z: number, r: number) => Math.hypot(x - gate[0], z - gate[1]) < r;
	stoneWall(b, ring, g.height, { h: RADIANCE_WALL, t: 4.5, closed: true, outward: out, gaps: [{ at: gate, half: 11 }], step: 5 });
	bastions(b, ring, g.height, 130, { h: RADIANCE_WALL, closed: true, outward: out, t: 4.5, size: 7, lookout: 2, skip: (x, z) => nearGate(x, z, 30) });
	wallTorches(b, ring, g.height, 20, { h: RADIANCE_WALL, closed: true, outward: out, t: 4.5, skip: (x, z) => nearGate(x, z, 14) });

	const y = g.height(gate[0], gate[1]) - 0.5;
	const gm = at(gate[0], y, gate[1], rot);
	const res = munru(b, gm, {
		block: { w: 22, d: 10, h: RADIANCE_WALL + 1.2, arch: 4.6, stone: 'courses' },
		storeys: 2,
		lattice: true,
		bays: [3.2, 3.8, 4.2, 3.8, 3.2],
		depth: [3, 3],
		colH: 3.6
	});
	const [fx, fz] = [Math.sin(rot), Math.cos(rot)];
	const [rx, rz] = [Math.cos(rot), -Math.sin(rot)];
	for (const side of [1, -1]) {
		for (const depth of [4.2, -4.2]) b.lamps.push([gate[0] + rx * side * 10 + fx * depth, y + res.base + 2.2, gate[1] + rz * side * 10 + fz * depth]);
	}

	// barracks and a hall round the summit
	hall(b, at(top[0], hy - 0.4, top[1], rot), { bays: [3.4, 3.8, 4.2, 3.8, 3.4], depth: [3.2, 3.4, 3.2], colH: 3.8, base: 1, roof: { chimi: true } });
	for (let k = 0; k < 4; k++) {
		const a = rot + Math.PI / 2 + (k - 1.5) * 0.5;
		const x = top[0] + Math.sin(a) * 60;
		const z = top[1] + Math.cos(a) * 60;
		hall(b, at(x, g.height(x, z) - 0.3, z, a + Math.PI), { bays: Array(5).fill(3), depth: [3, 3], colH: 3, base: 0.6 });
	}

	// the road up from the field, a cleared slope below the gate, forest everywhere else
	const road = resample(
		chaikin(
			[
				[gate[0] + fx * 4, gate[1] + fz * 4],
				[gate[0] + fx * 120 + rx * 30, gate[1] + fz * 120 + rz * 30],
				[gate[0] + fx * 300 - rx * 40, gate[1] + fz * 300 - rz * 40],
				[gate[0] + fx * 700, gate[1] + fz * 700]
			],
			2,
			false
		),
		4,
		false
	);
	b.push('path', ribbon(road, 5, (x, z) => g.height(x, z) + 0.12));
	const glacis = (x: number, z: number) => {
		const dx = x - gate[0];
		const dz = z - gate[1];
		const along = dx * fx + dz * fz;
		return along > 0 && along < 170 && Math.abs(dx * rx + dz * rz) < 140;
	};
	const wallGap = (x: number, z: number) => distanceToPath(ring, x, z, true) > 12;
	scatterTrees(forest, g, RADIANCE_TILE, 9000, rand, (x, z) => mountains(x, z) > 8 && wallGap(x, z) && !glacis(x, z) && distanceToPath(road, x, z) > 6, (r) => (r > 0.45 ? 'pine' : 'broad'), [9, 16]);
	const coverBox: Bounds = { minX: gate[0] - 260, maxX: gate[0] + 260, minZ: gate[1] - 260, maxZ: gate[1] + 260 };
	scatterCover(cover, g, coverBox, 14000, rand, (x, z) => glacis(x, z) && wallGap(x, z) && distanceToPath(road, x, z) > 3, 1.1);
	for (let k = 0; k < 160; k++) {
		const x = coverBox.minX + rand() * 520;
		const z = coverBox.minZ + rand() * 520;
		if (!glacis(x, z) || !wallGap(x, z)) continue;
		cover.add(rand() > 0.6 ? 'shrub' : 'rock', x, g.height(x, z), z, 1 + rand() * 2.2);
	}

	labels.push({
		id: 'radiance',
		en: 'Radiance Fortress',
		ko: '명활성',
		at: [gate[0], y + res.ridge + 8, gate[1]],
		status: 'excavated',
		note: 'Mountain fortress east of the capital (405; stone wall of the 550s). Bidam’s camp in 647'
	});
	return { gate, rot, y, ridge: res.ridge };
}

/* ------------------------------------------------------------------ Wolji and the East Palace */

function woljiWorks(b: Builder, g: Ground, forest: Forest, labels: Label[], rand: () => number): void {
	const outer = plan.wolji.outer;
	b.push('courses', skirt(outer, POND_BED - 0.2, 0.45));
	b.push('water', flat(outer, POND_WATER));
	for (const isl of islands) {
		b.push('courses', skirt(isl.pts, POND_BED - 0.2, 0.75));
		const c = centroid(isl.pts);
		const r = Math.sqrt(Math.abs(isl.box.maxX - isl.box.minX) * Math.abs(isl.box.maxZ - isl.box.minZ)) / 2;
		const n = Math.max(2, Math.round(r / 3));
		for (let k = 0; k < n; k++) {
			const a = rand() * Math.PI * 2;
			const d = rand() * r * 0.55;
			const x = c[0] + Math.cos(a) * d;
			const z = c[1] + Math.sin(a) * d;
			if (isl.contains(x, z)) forest.add(rand() > 0.4 ? 'pine' : 'broad', x, g.height(x, z), z, 6 + rand() * 5);
		}
	}
	// shore stones along the east and north banks
	const shore = resample(outer, 5, true);
	const rock = new THREE.IcosahedronGeometry(1, 0);
	for (const [x, z] of shore) {
		if (x < 330 || rand() > 0.55) continue;
		const s = 0.6 + rand() * 1.1;
		b.push('rock', rock.clone(), at(x, 0.3, z, rand() * 6, s));
	}
	rock.dispose();

	// three waterside halls on the west bank (restored on excavated footings)
	const west = outer.filter(([x]) => x < 306);
	const zs = west.map(([, z]) => z);
	const z0 = Math.min(...zs);
	const z1 = Math.max(...zs);
	const shoreX = (z: number) => {
		let best = Infinity;
		for (let i = 0; i < outer.length; i++) {
			const a = outer[i];
			const c = outer[(i + 1) % outer.length];
			if ((a[1] - z) * (c[1] - z) > 0) continue;
			const t = c[1] === a[1] ? 0 : (z - a[1]) / (c[1] - a[1]);
			const x = a[0] + (c[0] - a[0]) * t;
			if (x < best) best = x;
		}
		return best;
	};
	const pavilions = [
		{ f: 0.22, bays: [3, 3.4, 3.4, 3.4, 3], depth: [2.8, 3, 2.8] },
		{ f: 0.5, bays: [3.2, 3.6, 3.8, 3.6, 3.2], depth: [3, 3.2, 3.2, 3] },
		{ f: 0.78, bays: [3, 3.4, 3], depth: [2.8, 2.8, 2.8] }
	];
	const palaceX = 228;
	const palaceZ = (z0 + z1) / 2 + 4;
	for (const p of pavilions) {
		const z = z0 + (z1 - z0) * p.f;
		const sx = shoreX(z);
		const x = sx + 2;
		box(b, 'courses', at(x, 0, z), 0, (POND_BED - 0.2 + 0.4) / 2, 0, 18, Math.abs(POND_BED - 0.2 - 0.4), 22);
		const res = hall(b, at(x, 0.4, z, Math.PI / 2), { bays: p.bays, depth: p.depth, colH: 3.8, base: 0.6, front: 'open', back: 'doors', sides: 'open', rail: true, steps: ['n'], roof: { chimi: true } });
		corridor(b, [palaceX + 47, z], [x - res.d / 2 - 2.5, z], 0.4, { width: 4.6, colH: 3.2, wall: 0 });
	}
	cloister(b, palaceX, palaceZ, 90, 84, 0.4, { gate: { bays: [3.4, 4.2, 3.4], depth: [3, 3], colH: 4 }, width: 5, colH: 3.4 });
	const main = hall(b, at(palaceX, 0.55, palaceZ - 14), { bays: bays(7, 3.8, 4.4), depth: [3.4, 4.2, 4.2, 3.4], colH: 5, base: 1.6, steps: ['s', 'e', 'w'], roof: { chimi: true } });
	hall(b, at(palaceX, 0.55, palaceZ + 20), { bays: bays(5, 3.4), depth: [3, 3], colH: 3.8, base: 0.8, front: 'open', back: 'open' });
	for (const [x, z] of [
		[330, -276],
		[396, -278]
	] as P2[]) {
		const y = 0.4;
		court(b, x, z, 52, 30, y, { gate: 's', pave: 'gravel' });
		hall(b, at(x, y, z - 4), { bays: bays(5, 3.2), depth: [3, 3], colH: 3.6, base: 0.8 });
	}
	labels.push({ id: 'wolji', en: 'Wolji', ko: '월지', at: [374, 8, -400], status: 'survey', note: 'Pond dug 674; three islands, hills to the east and north', era: { from: 680 } });
	labels.push({ id: 'donggung', en: 'Donggung', ko: '동궁', at: [palaceX, main.ridge + 4, palaceZ - 14], status: 'excavated', note: "The crown prince's palace, built 679", era: { from: 680 } });
	labels.push({ id: 'imhae', en: 'Imhaejeon', ko: '임해전', at: [shoreX(z0 + (z1 - z0) * 0.5) + 2, 16, z0 + (z1 - z0) * 0.5], status: 'recorded', note: 'Banquet hall on the shore', era: { from: 680 } });

	for (let k = 0; k < 900; k++) {
		const x = 300 + rand() * 240;
		const z = -570 + rand() * 280;
		if (wolji.contains(x, z) || wolji.edgeDistance(x, z) < 4) continue;
		if (woljiHills(x, z) < 0.08) continue;
		forest.add(rand() > 0.35 ? 'pine' : 'broad', x, g.height(x, z), z, 8 + rand() * 6);
	}
}

/* ------------------------------------------------------------------ temples and monuments */

function hwangnyongsa(b: Builder, g: Ground, labels: Label[]): void {
	const { x, z, w, d } = TEMPLE;
	const y = g.height(x, z) + 0.3;
	b.setEra(569);
	cloister(b, x, z, w, d, y, { gate: { bays: [3.6, 4.4, 4.4, 4.4, 3.6], depth: [3.4, 3.4], colH: 4.6, twoStorey: true }, width: 5.6, colH: 3.8 });
	const main = hall(b, at(x, y, z - 40), { bays: [4.4, 4.6, 4.6, 4.8, 5.4, 4.8, 4.6, 4.6, 4.4], depth: [4.2, 4.6, 4.6, 4.2], colH: 6.2, base: 1.9, tiers: 2, steps: ['s'], roof: { chimi: true } });
	for (const sx of [1, -1]) hall(b, at(x + sx * 52, y, z - 40), { bays: bays(7, 3.8, 4.2), depth: [3.6, 4, 3.6], colH: 5, base: 1.4, roof: { chimi: true } });
	hall(b, at(x, y, z - d / 2 + 14), { bays: bays(9, 4), depth: [3.6, 4, 3.6], colH: 4.8, base: 1.1 });
	gate(b, at(x, y, z + d / 2 + 34), [3.4, 4, 3.4], [3, 3], 4.2, { roof: { chimi: true } });
	labels.push({ id: 'hwangnyongsa', en: 'Hwangnyongsa', ko: '황룡사', at: [x, y + main.ridge + 6, z - 40], status: 'excavated', note: 'One pagoda, three golden halls', era: { from: 569 } });
	b.setEra(645);
	const top = woodPagoda(b, at(x, y, z + 18), 22, 9, 7);
	labels.push({ id: 'hwangnyong-pagoda', en: 'Nine-storey pagoda', ko: '구층목탑', at: [x, y + top + 6, z + 18], status: 'excavated', note: 'Raised 645 on a 22 m base, about 80 m tall', era: { from: 645 } });
	b.setEra();
}

function bunhwangsa(b: Builder, g: Ground, labels: Label[]): void {
	const { x, z } = BUNHWANG;
	const y = g.height(x, z) + 0.3;
	cloister(b, x, z - 8, 104, 96, y, { width: 4.8, colH: 3.4 });
	const top = stonePagoda(b, at(x, y, z + 6), 7, 6.4, 3.4, 'brick');
	hall(b, at(x, y, z - 34), { bays: bays(7, 3.6, 4), depth: [3.4, 3.8, 3.4], colH: 4.6, base: 1.2, roof: { chimi: true } });
	for (const sx of [1, -1]) hall(b, at(x + sx * 32, y, z - 22, sx > 0 ? -Math.PI / 2 : Math.PI / 2), { bays: bays(5, 3.4), depth: [3.2, 3.2], colH: 4, base: 1 });
	labels.push({ id: 'bunhwangsa', en: 'Bunhwangsa', ko: '분황사', at: [x, y + top + 6, z + 6], status: 'standing', note: 'Brick-cut stone pagoda of 634; three storeys stand, the rest is a guess', era: { from: 634 } });
}

/* ------------------------------------------------------------------ trees */

function plant(g: ReturnType<typeof makeGround>, forest: Forest, taken: Footprints): void {
	const rand = rng(91 + 680);

	// Gyerim, the sacred grove
	const gb = gyerim.box;
	for (let z = gb.minZ; z < gb.maxZ; z += 8) {
		for (let x = gb.minX; x < gb.maxX; x += 8) {
			const px = x + (rand() - 0.5) * 6;
			const pz = z + (rand() - 0.5) * 6;
			if (!gyerim.contains(px, pz)) continue;
			const edge = gyerim.edgeDistance(px, pz);
			const kind = edge < 10 && rand() > 0.6 ? 'willow' : rand() > 0.4 ? 'zelkova' : 'broad';
			forest.add(kind, px, g.height(px, pz), pz, 11 + rand() * 7);
		}
	}

	// the rampart's slopes
	const ring = resample(chaikin(plan.crest, 2, true), 11, true);
	const fr = frames(ring, true);
	const signArea = plan.crest.reduce((a, p, i) => {
		const q = plan.crest[(i + 1) % plan.crest.length];
		return a + p[0] * q[1] - q[0] * p[1];
	}, 0);
	const out = signArea > 0 ? 1 : -1;
	ring.forEach(([x, z], i) => {
		const n = fr[i].n;
		for (const off of [-9, 14, 22]) {
			if (rand() > (off < 0 ? 0.35 : 0.55)) continue;
			const px = x + n[0] * out * off + (rand() - 0.5) * 4;
			const pz = z + n[1] * out * off + (rand() - 0.5) * 4;
			if (GATES.some((gt) => Math.hypot(px - gt.at[0], pz - gt.at[1]) < 20)) continue;
			if (riverDistance(px, pz) < 26) continue;
			forest.add(rand() > 0.55 ? 'pine' : rand() > 0.5 ? 'zelkova' : 'broad', px, g.height(px, pz), pz, 8 + rand() * 7);
		}
	});

	// lawns inside the walls
	const ib = interior.box;
	const lane = spine();
	for (let k = 0; k < 2600; k++) {
		const x = ib.minX + rand() * (ib.maxX - ib.minX);
		const z = ib.minZ + rand() * (ib.maxZ - ib.minZ);
		if (interior.signed(x, z) < 6) continue;
		if (taken.inside(x, z, 6)) continue;
		if (distanceToPath(lane, x, z) < 7) continue;
		if (rand() > 0.42) continue;
		forest.add(rand() > 0.7 ? 'pine' : rand() > 0.4 ? 'broad' : 'zelkova', x, g.height(x, z), z, 7 + rand() * 7);
	}

	// willows on the river banks
	const bank = resample(chaikin(river, 2, false), 15, false);
	const bf = frames(bank, false);
	bank.forEach(([x, z], i) => {
		for (const side of [1, -1]) {
			if (rand() > 0.5) continue;
			const off = 34 + rand() * 10;
			const px = x + bf[i].n[0] * side * off;
			const pz = z + bf[i].n[1] * side * off;
			const y = g.height(px, pz);
			if (y < -0.4) continue;
			if (crest.near(px, pz, 4) && crest.signed(px, pz) > -20) continue;
			if (Math.hypot(px - bridge.at[0], pz - bridge.at[1]) < bridge.half + 14) continue;
			forest.add(rand() > 0.3 ? 'willow' : 'broad', px, y, pz, 8 + rand() * 4);
		}
	});

	// pines around the royal tombs
	for (const t of tombs) {
		const n = Math.round(t.r / 5);
		for (let k = 0; k < n; k++) {
			if (rand() > 0.35) continue;
			const a = rand() * Math.PI * 2;
			const r = t.r + 6 + rand() * 10;
			const x = t.at[0] + Math.cos(a) * r;
			const z = t.at[1] + Math.sin(a) * r;
			if (tombLift(x, z) > 0.3) continue;
			forest.add('pine', x, g.height(x, z), z, 9 + rand() * 6);
		}
	}

	// village groves out in the fields
	for (let k = 0; k < 180; k++) {
		const x = -1350 + rand() * 2750;
		const z = -1250 + rand() * 2100;
		if (reserved(x, z, 0) || mountains(x, z) > 3) continue;
		if (cityAt(x, z)) continue;
		const n = 3 + Math.floor(rand() * 6);
		for (let j = 0; j < n; j++) {
			const px = x + (rand() - 0.5) * 34;
			const pz = z + (rand() - 0.5) * 34;
			forest.add(rand() > 0.5 ? 'broad' : 'zelkova', px, g.height(px, pz), pz, 8 + rand() * 6);
		}
	}

	// the edges of the near tile get the lower slopes of the hills
	for (let k = 0; k < 2200; k++) {
		const x = -1400 + rand() * 2800;
		const z = -1300 + rand() * 2250;
		const m = mountains(x, z);
		if (m < 4) continue;
		forest.add(rand() > 0.45 ? 'pine' : 'broad', x, g.height(x, z), z, 9 + rand() * 6);
	}
}

/* ------------------------------------------------------------------ ground cover */

function meadow(g: ReturnType<typeof makeGround>, cover: Cover, taken: Footprints): void {
	const rand = rng(301 + 680);
	const lane = spine();
	const open = (x: number, z: number, pad: number) => !taken.inside(x, z, pad) && distanceToPath(lane, x, z) > 4.5;
	const tuft = (x: number, z: number, s: number) => {
		cover.add(rand() > 0.86 ? 'flowers' : 'grass', x, g.height(x, z) - 0.05, z, s * (0.9 + rand() * 0.8));
	};

	// lawns inside the walls, shrubs down the rampart
	const cb = crest.box;
	for (let k = 0; k < 48000; k++) {
		const x = cb.minX - 40 + rand() * (cb.maxX - cb.minX + 80);
		const z = cb.minZ - 40 + rand() * (cb.maxZ - cb.minZ + 80);
		const sd = crest.signed(x, z);
		if (sd < -30 || riverDistance(x, z) < 32 || !open(x, z, 1.5)) continue;
		if (sd < 14 && rand() > 0.88) cover.add('shrub', x, g.height(x, z) - 0.2, z, 1.2 + rand() * 1.4);
		else tuft(x, z, 1);
	}

	// reeds at the waterline, stones on the bed, grass up the banks
	bankCover(cover, g, river, RIVER_WATER, rand, {
		from: 22,
		to: 48,
		skip: (x, z) => Math.hypot(x - bridge.at[0], z - bridge.at[1]) < bridge.half + 10,
		grass: (x, z) => open(x, z, 1)
	});

	// Wolji banks and islands (the pond itself rises with the year)
	for (const [x, z] of resample(wolji.pts, 2.5, true)) {
		for (let k = 0; k < 3; k++) {
			const a = rand() * Math.PI * 2;
			const r = 2 + rand() * 24;
			const px = x + Math.cos(a) * r;
			const pz = z + Math.sin(a) * r;
			if (!wolji.contains(px, pz) && open(px, pz, 1)) tuft(px, pz, 1);
		}
	}
	const wb = wolji.box;
	for (let k = 0; k < 4000; k++) {
		const x = wb.minX + rand() * (wb.maxX - wb.minX);
		const z = wb.minZ + rand() * (wb.maxZ - wb.minZ);
		if (!wolji.contains(x, z)) continue;
		const isl = islands.find((r) => r.near(x, z, 1) && r.contains(x, z));
		if (isl) tuft(x, z, 0.9);
		else if (wolji.edgeDistance(x, z) < 3.5 && rand() > 0.4) cover.add('reed', x, POND_WATER - 0.4, z, 1.3 + rand() * 0.8);
	}

	// moats: reeds in the hollows (both eras share the cut)
	for (const m of moats) {
		const mb = m.box;
		for (let k = 0; k < 500; k++) {
			const x = mb.minX + rand() * (mb.maxX - mb.minX);
			const z = mb.minZ + rand() * (mb.maxZ - mb.minZ);
			if (!m.contains(x, z)) continue;
			cover.add('reed', x, g.height(x, z) - 0.1, z, 1.2 + rand() * 0.8);
		}
	}

	// the tumuli wear a thin lawn with a few wildflowers
	for (const t of tombs) {
		const n = Math.min(260, Math.round(t.r * t.r * 0.12));
		for (let k = 0; k < n; k++) {
			const a = rand() * Math.PI * 2;
			const r = Math.sqrt(rand()) * t.r * 1.1;
			tuft(t.at[0] + Math.cos(a) * r, t.at[1] + Math.sin(a) * r, 1.1);
		}
	}
}

/* ------------------------------------------------------------------ views */

function views(): View[] {
	const jw = SLOTS[0];
	const ch = plan.cheomseongdae;
	const bc = bridge.at;
	return [
		{ id: 'board', en: 'Board view', ko: '그림 시점', pos: [-650, 150, 380], target: [140, 0, -50], fov: 42 },
		{ id: 'court', en: 'Audience court', ko: '조원전 뜰', pos: [jw.x - 30, INNER + 26, jw.z + 120], target: [jw.x, INNER + 6, jw.z - 20], fov: 42 },
		{ id: 'bridge', en: 'Woljeonggyo', ko: '월정교', pos: [bc[0] + 110, 18, bc[1] + 58], target: [bc[0], 4, bc[1]], fov: 40, era: { from: 760 } },
		{ id: 'wolji', en: 'Wolji', ko: '월지', pos: [236, 92, -236], target: [372, -1, -404], fov: 46, era: { from: 680 } },
		{ id: 'tower', en: 'Cheomseongdae', ko: '첨성대', pos: [ch[0] + 24, 3, ch[1] + 34], target: [ch[0], 7, ch[1]], fov: 45, era: { from: 647 } },
		{ id: 'temple', en: 'Hwangnyongsa', ko: '황룡사', pos: [TEMPLE.x - 260, 90, TEMPLE.z + 300], target: [TEMPLE.x, 30, TEMPLE.z], fov: 40, era: { from: 569 } },
		{ id: 'plan', en: 'Plan', ko: '평면', pos: [60, 1700, 80], target: [60, 0, 60], fov: 40 }
	];
}

/* ------------------------------------------------------------------ build */

const NEAR: Bounds = { minX: -1400, maxX: 1400, minZ: -1300, maxZ: 950 };

export function buildMoon(opts: BuildOptions): SiteBuild {
	const p: Palette = palette({ lit: opts.light === 'night' });
	const g = makeGround();
	const root = new THREE.Group();
	root.name = 'wolseong';
	const labels: Label[] = [];
	const b = new Builder();
	const forest = new Forest();
	const town = new Town();
	const taken = new Footprints();
	const rand = rng(17 + 680);

	const near = nearGround(p, g, NEAR, 6);
	b.ground = near.userData.sample;
	root.add(near);
	root.add(nearGround(p, g, RADIANCE_TILE, 8));
	root.add(farGround(p, g, [NEAR, RADIANCE_TILE], 20000, 110, 0, 600));
	const cover = new Cover();

	riverWater(b);
	palace(b, g, taken, labels);
	paths(b, g, taken);
	rampartGates(b, g, labels);
	moatWork(b, labels);

	b.setEra(760);
	woljeonggyo(b, labels);
	iljeonggyo(b, labels);
	b.setEra(680);
	woljiWorks(b, g, forest, labels, rand);
	b.setEra(647);
	{
		const [cx, cz] = plan.cheomseongdae;
		const y = g.height(cx, cz);
		box(b, 'path', at(cx, y, cz), 0, 0.05, 0, 22, 0.1, 22);
		cheomseongdae(b, at(cx, y + 0.05, cz));
		labels.push({ id: 'cheomseongdae', en: 'Cheomseongdae', ko: '첨성대', at: [cx, y + 15, cz], status: 'standing', note: '27 courses, 9.17 m, window to the south', era: { from: 647 } });
	}
	b.setEra(612);
	ghostBridge(b, g, forest, labels, rand);
	b.setEra();
	const fort = radiance(b, g, forest, cover, labels, rand);
	hwangnyongsa(b, g, labels);
	b.setEra(634);
	bunhwangsa(b, g, labels);
	b.setEra(HWARANG_YEAR);
	const yardY = hwarangYard(b, g, labels);
	b.setEra();
	city(g, town, forest);
	plant(g, forest, taken);

	const gc = centroid(plan.gyerim);
	labels.push({ id: 'gyerim', en: 'Gyerim', ko: '계림', at: [gc[0], 24, gc[1]], status: 'survey', note: 'The grove where the gold box was found' });
	labels.push({ id: 'wolseong', en: 'Wolseong', ko: '월성', at: [40, CREST + 26, -40], status: 'survey', note: 'Crescent rampart; outline from survey' });
	const rv = nearestOnPath(river, 150, 30).p;
	labels.push({
		id: 'namcheon',
		en: 'Southern Stream',
		ko: '남천',
		at: [rv[0], 6, rv[1]],
		status: 'survey',
		note: 'The south moat of the crescent. A stream, not a great river.'
	});
	const dt = tombs.find((t) => t.name?.includes('황남대총')) ?? tombs[0];
	labels.push({ id: 'tumuli', en: 'Royal tumuli', ko: '대릉원', at: [dt.at[0], dt.h + 10, dt.at[1]], status: 'survey', note: 'Mounded tombs of the 4th–6th centuries' });

	meadow(g, cover, taken);

	const [fx, fz] = [Math.sin(fort.rot), Math.cos(fort.rot)];
	const eye: P2 = [fort.gate[0] + fx * 120, fort.gate[1] + fz * 120];
	const gh = GHOST;
	const ux = Math.cos(gh.angle);
	const uz = Math.sin(gh.angle);
	const south = uz < 0 ? -1 : 1;
	const gx = gh.at[0] + ux * south * 40 - uz * 62;
	const gz = gh.at[1] + uz * south * 40 + ux * 62;
	const extra: View[] = [
		{ id: 'radiance', en: 'Radiance Fortress', ko: '명활성', pos: [eye[0], g.height(eye[0], eye[1]) + 3, eye[1]], target: [fort.gate[0], fort.y + fort.ridge * 0.6, fort.gate[1]], fov: 42 },
		{ id: 'ghost', en: 'Ghost Bridge', ko: '귀교', pos: [gx, g.height(gx, gz) + 3, gz], target: [gh.at[0] - ux * south * 20, 4.5, gh.at[1] - uz * south * 20], fov: 50, era: { from: 612 } },
		{ id: 'hwarang', en: 'Hwarang yard', ko: '화랑 연무장', pos: [YARD.x + 70, yardY + 22, YARD.z + 80], target: [YARD.x, yardY + 2, YARD.z - 6], fov: 44, era: { from: HWARANG_YEAR } }
	];

	const folk = new Folk('silla', g.height, 101);
	const jw = SLOTS[0];
	folk.audience(jw.x, jw.z - jw.d / 2 + 30, 0, { y: courtLevel(g, jw).y, near: 14, far: 50, n: 7 });
	for (const gt of GATES) folk.gate(gt.at[0], gt.at[1], Math.atan2(gt.at[0] - 40, gt.at[1] + 40));
	folk.circuit(TEMPLE.x, TEMPLE.z + 18, 20, 8, { y: g.height(TEMPLE.x, TEMPLE.z) + 0.3 });
	folk.circuit(BUNHWANG.x, BUNHWANG.z + 6, 9, 4, { y: g.height(BUNHWANG.x, BUNHWANG.z) + 0.3 });
	folk.knot(['hwarang', 'hwarang', 'archer', 'hwarang'], YARD.x, YARD.z + 12, 10, 6, { y: yardY, face: [YARD.x, YARD.z - YARD.d / 2] });
	folk.knot(['hwarang', 'guard', 'hwarang'], YARD.x - 26, YARD.z - 4, 8, 4, { y: yardY });
	const fleet = new Fleet(POND_WATER + 0.05, 'silla', 101);
	const [wx, wz] = centroid(plan.wolji.outer);
	fleet.moor('skiff', wx, wz, 0.7);

	return assemble({
		p,
		root,
		b,
		forest,
		town,
		cover,
		year: opts.year,
		mist: {
			height: g.height,
			box: { minX: -5000, maxX: 5000, minZ: -5000, maxZ: 5000 },
			layers: [
				{ y: 1.4, opacity: 0.22 },
				{ y: 4, opacity: 0.12 }
			]
		},
		labels,
		views: [...views(), ...extra],
		wardrobe: {
			dress: 'silla',
			x: plan.cheomseongdae[0] + 22,
			z: plan.cheomseongdae[1] + 6,
			note: 'Commoners in undyed white with a dark band at collar, cuffs and hem; rank in the official’s robe colour'
		},
		center: [0, -60],
		radius: 900,
		haze: '#cdd9de',
		water: { color: '#7eae98', roughness: 0.18, metalness: 0.03, minSpan: 500 },
		life: {
			kingdom: 'silla',
			walk: spine(),
			river: reach(river, 80, 40, 480),
			bank: 32,
			waterY: RIVER_WATER + 0.15,
			height: g.height,
			seed: 101,
			people: 22,
			boats: 3,
			boat: 0.48,
			folk,
			fleet
		}
	});
}
