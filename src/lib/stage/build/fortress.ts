import * as THREE from 'three';
import { ridged, chaikin, resample, frames, centroid, type P2 } from './geo';
import { at, box, hall, tower, cloudBank, stoneWall, type Builder, type Mat, type Palette, type RoofTile, type HallSpec, type Forest, type Town, type TreeKind, type Tent } from './kit';
import { cloudSheets } from './nature';
import type { Ground } from './terrain';
import { Footprints, pick } from './common';

/*
 * The fortress kit shared by the walled sites (Daeya, the Yeon fortress, Ansi, Pyongyang, Wirye,
 * Mugun): stone gate blocks with a round arch, gate pavilions (문루) on them, wall-top banners,
 * bastions, rock peaks, cloud seas and villages. Same conventions as kit.ts: metres, +z south,
 * local +z is the front.
 */

/* ------------------------------------------------------------------ gates */

export type GateBlock = {
	w: number;
	d: number;
	h: number;
	/** Width of the arched passage (홍예). */
	arch?: number;
	stone?: Mat;
	/** The closed leaves inside the arch. */
	doors?: Mat;
	/** Merlons along the front and back edges of the top. */
	crenel?: boolean;
};

/** A row of merlons along local x at depth z, standing on height y. */
export function crenels(b: Builder, m: THREE.Matrix4, mat: Mat, x0: number, x1: number, z: number, y: number, every = 2.4): void {
	const L = x1 - x0;
	box(b, mat, m, (x0 + x1) / 2, y + 0.5, z, L, 1, 0.9, { bevel: 0.1 });
	const n = Math.max(1, Math.round(L / every));
	for (let i = 0; i < n; i++) box(b, mat, m, x0 + (i + 0.5) * (L / n), y + 1.4, z, (L / n) * 0.55, 0.95, 0.9, { bevel: 0.12 });
}

/** The round head of an arch (홍예): stepped fill in the two springing corners of an opening `a` wide centred on local x = cx. */
function archHead(b: Builder, m: THREE.Matrix4, mat: Mat, cx: number, spring: number, a: number, depth: number): void {
	const r = a / 2;
	const steps = Math.max(6, Math.ceil(r * 2.4));
	for (let j = 0; j < steps; j++) {
		const dy = ((j + 0.5) / steps) * r;
		const fill = r - Math.sqrt(r * r - dy * dy);
		for (const sx of [1, -1]) box(b, mat, m, cx + sx * (r - fill / 2), spring + dy, 0, fill, r / steps + 0.02, depth);
	}
}

/** A dressed-stone gate block with a round-arched passage through it. Returns its height. */
export function gateBlock(b: Builder, m: THREE.Matrix4, o: GateBlock): number {
	const stone = o.stone ?? 'courses';
	const a = o.arch ?? Math.min(o.w * 0.34, 5);
	const r = a / 2;
	const top = Math.min(o.h - 1.6, Math.max(r + 2.4, o.h * 0.62));
	const spring = top - r;
	const pier = (o.w - a) / 2;
	// the piers run 1.5 m below grade so the block sits into a slope instead of on it
	for (const sx of [1, -1]) box(b, stone, m, sx * (a / 2 + pier / 2), (o.h - 1.5) / 2, 0, pier, o.h + 1.5, o.d, { bevel: 0.22 });
	box(b, stone, m, 0, (top + o.h) / 2, 0, a, o.h - top, o.d);
	archHead(b, m, stone, 0, spring, a, o.d);
	box(b, 'paving', m, 0, 0.05, 0, a, 0.1, o.d + 0.6);
	box(b, o.doors ?? 'door', m, 0, (spring + r * 0.9) / 2, o.d / 2 - 1.1, a, spring + r * 0.9, 0.25, { metric: false });
	if (o.crenel !== false) for (const sz of [1, -1]) crenels(b, m, stone, -o.w / 2, o.w / 2, sz * (o.d / 2 - 0.35), o.h);
	return o.h;
}

export type MunruSpec = {
	block?: GateBlock;
	storeys?: 1 | 2;
	bays: number[];
	depth: number[];
	colH: number;
	/** Red plastered walls (the Goguryeo boards); otherwise an open pavilion with a rail. */
	red?: boolean;
	/** White walls with lattice windows that glow at night (the Radiance board). */
	lattice?: boolean;
	tile?: RoofTile;
};

/** A gate pavilion (문루), one or two storeys, on an optional arched gate block. */
export function munru(b: Builder, m: THREE.Matrix4, o: MunruSpec): { base: number; ridge: number } {
	const base = o.block ? gateBlock(b, m, o.block) : 0;
	const pm = m.clone().multiply(at(0, base, 0));
	const roof = { chimi: true, tile: o.tile };
	const closed = o.red || o.lattice;
	const sides = o.red ? 'red' : o.lattice ? 'wall' : 'open';
	const face = o.red ? 'red' : o.lattice ? 'windows' : 'open';
	const low: HallSpec = { bays: o.bays, depth: o.depth, colH: o.colH, base: 0.5, front: face, back: face, sides, rail: !closed, roof };
	if ((o.storeys ?? 1) === 1) return { base, ridge: base + hall(b, pm, low).ridge };
	const up = tower(b, pm, low, {
		bays: o.bays.map((w) => w * 0.86),
		depth: o.depth.map((d) => d * 0.8),
		colH: o.colH * 0.8,
		front: closed ? 'doors' : 'open',
		back: closed ? 'doors' : 'open',
		sides,
		roof
	});
	return { base, ridge: base + up.ridge };
}

/**
 * The Goguryeo boards' summit: a red two-storey command hall on a dressed-stone platform, with
 * red side halls at offsets [x, z, rot] from it. Returns the keep's ridge height above y.
 */
export function redKeep(b: Builder, x: number, y: number, z: number, side: [number, number, number][]): number {
	box(b, 'courses', at(x, y, z), 0, 1.1, 0, 36, 2.2, 26);
	const keep = tower(
		b,
		at(x, y + 2.2, z),
		{ bays: [4, 4.6, 5, 4.6, 4], depth: [4, 4.4, 4], colH: 5.4, base: 0.6, front: 'red', back: 'red', sides: 'red', steps: ['s'] },
		{ bays: [3.6, 4.2, 4.2, 3.6], depth: [3.6, 3.6], colH: 4.2, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } }
	);
	for (const [dx, dz, r] of side) {
		hall(b, at(x + dx, y, z + dz, r), { bays: [3.2, 3.6, 3.2], depth: [3, 3], colH: 3.4, base: 0.7, front: 'doors', back: 'red', sides: 'red', roof: { chimi: true } });
	}
	b.lampPost(x - 12, y + 2.2, z + 16);
	b.lampPost(x + 12, y + 2.2, z + 16);
	return 2.2 + keep.ridge;
}

/* ------------------------------------------------------------------ walls */

/** +1 when a closed ring's path normals point away from its centre. */
export function outwardOf(path: P2[]): 1 | -1 {
	const c = centroid(path);
	const fr = frames(path, true);
	let s = 0;
	path.forEach(([x, z], i) => (s += fr[i].n[0] * (x - c[0]) + fr[i].n[1] * (z - c[1])));
	return s >= 0 ? 1 : -1;
}

const CLOTH = new THREE.PlaneGeometry(1.15, 2.9, 6, 8).translate(0.65, -1.45, 0);
const CLOTH_POS = new THREE.Matrix4();

/** Vertical war banners on poles, hung from a crossbar; local +z faces the viewer. The cloth waves with the wind. */
export function banners(b: Builder, pts: [number, number, number][], cloth: Mat, h = 6.5, rot = 0): void {
	for (const [x, y, z] of pts) {
		const m = at(x, y, z, rot);
		box(b, 'wood', m, 0, h / 2, 0, 0.14, h, 0.14);
		box(b, 'wood', m, 0.6, h - 0.1, 0, 1.3, 0.08, 0.08);
		b.pushFlag(cloth, CLOTH.clone(), CLOTH_POS.makeTranslation(0, h - 0.15, 0).premultiply(m));
	}
}

type WallLine = { h: number; closed?: boolean; outward?: 1 | -1; skip?: (x: number, z: number) => boolean };

/** Points every `every` metres along a wall, with the outward normal. */
export function wallStations(path: P2[], every: number, o: WallLine): { x: number; z: number; nx: number; nz: number }[] {
	const closed = o.closed ?? false;
	const pts = resample(chaikin(path, 1, closed), every, closed);
	const fr = frames(pts, closed);
	const sign = o.outward ?? 1;
	return pts.map(([x, z], i) => ({ x, z, nx: fr[i].n[0] * sign, nz: fr[i].n[1] * sign })).filter((s) => !o.skip?.(s.x, s.z));
}

/** Banners along a wall top, set back from the parapet and facing out. */
export function wallBanners(b: Builder, path: P2[], ground: (x: number, z: number) => number, cloth: Mat, every: number, o: WallLine & { pole?: number }): void {
	for (const s of wallStations(path, every, o)) {
		const px = s.x - s.nx * 1.4;
		const pz = s.z - s.nz * 1.4;
		banners(b, [[px, ground(s.x, s.z) + o.h - 0.6, pz]], cloth, o.pole ?? 6.5, Math.atan2(s.nx, s.nz));
	}
}

/** Torches on poles along a wall top, just inside the parapet; they glow with the lanterns at dusk and night. */
export function wallTorches(b: Builder, path: P2[], ground: (x: number, z: number) => number, every: number, o: WallLine & { t?: number }): void {
	const inset = (o.t ?? 5) / 2 - 1;
	for (const s of wallStations(path, every, o)) {
		const x = s.x + s.nx * inset;
		const z = s.z + s.nz * inset;
		const y = ground(s.x, s.z) + o.h - 0.3;
		box(b, 'wood', at(x, y, z), 0, 0.9, 0, 0.12, 1.8, 0.12);
		b.lamps.push([x, y + 2, z]);
	}
}

/** Square bastions (치) jutting out of a wall every `every` metres; some carry a small lookout. */
export function bastions(
	b: Builder,
	path: P2[],
	ground: (x: number, z: number) => number,
	every: number,
	o: WallLine & { size?: number; mat?: Mat; lookout?: number; tile?: RoofTile; t?: number }
): void {
	const size = o.size ?? 8;
	const mat = o.mat ?? 'wallStone';
	const t = o.t ?? 5;
	wallStations(path, every, o).forEach((s, k) => {
		const out = t / 2 + size / 2 - 0.5;
		const cx = s.x + s.nx * out;
		const cz = s.z + s.nz * out;
		const gy = Math.min(ground(cx, cz), ground(s.x, s.z), ground(cx + s.nx * size * 0.5, cz + s.nz * size * 0.5)) - 2;
		const top = ground(s.x, s.z) + o.h;
		const m = at(cx, gy, cz, Math.atan2(s.nx, s.nz));
		box(b, mat, m, 0, (top - gy) / 2, 0, size, top - gy, size, { bevel: 0.25 });
		crenels(b, m, mat, -size / 2, size / 2, size / 2 - 0.35, top - gy);
		if (o.lookout && k % o.lookout === 0) {
			hall(b, at(cx, top, cz, Math.atan2(s.nx, s.nz)), { bays: [size * 0.5], depth: [size * 0.5], colH: 2.6, base: 0.3, front: 'open', back: 'open', sides: 'open', roof: { kind: 'pyramid', h: 2.2, tile: o.tile } });
		}
	});
}

/* ------------------------------------------------------------------ bridges */

export type ArchBridge = {
	/** Clear width of each arch along the deck. */
	spans: number[];
	pier: number;
	width: number;
	/** Heights: river bed, the arches' springing line, the deck. */
	bed: number;
	spring: number;
	deck: number;
	/** Ground height at the -x and +x ends, where the steps come down. */
	ends: [number, number];
	stone?: Mat;
	abut?: number;
};

/** A dressed-stone bridge of round arches (홍예교) along local x, with a stone rail and steps down at both ends. Returns its half-length with the steps. */
export function archBridge(b: Builder, m: THREE.Matrix4, o: ArchBridge): number {
	const stone = o.stone ?? 'courses';
	const abut = o.abut ?? 6;
	const L = o.spans.reduce((s, a) => s + a, 0) + o.pier * (o.spans.length - 1) + abut * 2;
	const H = o.deck - o.bed;
	let x = -L / 2;
	box(b, stone, m, x + abut / 2, o.bed + H / 2, 0, abut, H, o.width);
	x += abut;
	o.spans.forEach((a, i) => {
		const crown = o.spring + a / 2;
		box(b, stone, m, x + a / 2, (crown + o.deck) / 2, 0, a, o.deck - crown, o.width);
		archHead(b, m, stone, x + a / 2, o.spring, a, o.width);
		x += a;
		if (i === o.spans.length - 1) return;
		box(b, stone, m, x + o.pier / 2, o.bed + H / 2, 0, o.pier, H, o.width);
		const cut = o.pier * 0.72;
		for (const sz of [1, -1]) box(b, stone, m, x + o.pier / 2, (o.bed + o.spring) / 2, sz * (o.width / 2), cut, o.spring - o.bed, cut, { rot: Math.PI / 4 });
		x += o.pier;
	});
	box(b, stone, m, x + abut / 2, o.bed + H / 2, 0, abut, H, o.width);
	box(b, 'paving', m, 0, o.deck + 0.12, 0, L, 0.24, o.width - 0.6);
	// the rail: curb, posts, top bar
	for (const sz of [1, -1]) {
		const z = sz * (o.width / 2 - 0.25);
		box(b, 'stone', m, 0, o.deck + 0.2, z, L, 0.4, 0.5);
		for (let px = -L / 2 + 0.6; px <= L / 2 - 0.5; px += 2.2) box(b, 'stone', m, px, o.deck + 0.65, z, 0.32, 1.1, 0.32);
		box(b, 'stone', m, 0, o.deck + 1.05, z, L, 0.16, 0.24);
	}
	// steps down to the banks
	const rise = 0.3;
	const tread = 0.42;
	let reach = L / 2;
	o.ends.forEach((gy, k) => {
		const dir = k === 0 ? -1 : 1;
		const n = Math.max(0, Math.ceil((o.deck - gy) / rise));
		for (let j = 0; j < n; j++) {
			const top = o.deck - (j + 1) * rise;
			box(b, stone, m, dir * (L / 2 + (j + 0.5) * tread), (top + gy - 0.6) / 2, 0, tread + 0.02, top - gy + 0.6, o.width - 0.6);
		}
		reach = Math.max(reach, L / 2 + n * tread);
	});
	return reach;
}

/* ------------------------------------------------------------------ ground */

/** A craggy peak: steep sides broken by ridged rock; `power` below 1 keeps the shoulders broad. */
export function crag(x: number, z: number, cx: number, cz: number, rx: number, rz: number, h: number, seed: number, power = 0.75): number {
	const d = Math.sqrt(((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2);
	if (d >= 1) return 0;
	const rough = 0.72 + 0.56 * ridged(x / 110 + seed, z / 110 - seed, 4);
	return h * Math.pow(1 - d, power) * (0.75 + 0.25 * rough);
}

/** A ring along a ridge crest: on each ray from the centre, the highest point between r0 and r1. */
export function crestRing(height: (x: number, z: number) => number, cx: number, cz: number, n: number, r0: number, r1: number): P2[] {
	const ring: P2[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		const dx = Math.cos(a);
		const dz = Math.sin(a);
		let best = r0;
		let hy = -Infinity;
		for (let r = r0; r <= r1; r += 6) {
			const y = height(cx + dx * r, cz + dz * r);
			if (y > hy) {
				hy = y;
				best = r;
			}
		}
		ring.push([cx + dx * best, cz + dz * best]);
	}
	return chaikin(ring, 2, true);
}

/** Snow country: white on the gentle faces, grey rock on the steep. */
export function snowColor(slope: number, n: number): string {
	if (slope > 0.6) return pick(['#6f6d69', '#7d7a75', '#5f5d5a'], (n + 1) / 2);
	if (slope > 0.4) return n > 0 ? '#c9ccd0' : '#a9adb2';
	return n > 0 ? '#eef1f4' : '#e0e4e9';
}

/* ------------------------------------------------------------------ clouds */

/**
 * A sea of cloud round a peak, as on the boards: two soft noise sheets at height `y` that thin
 * where the ground breaks through, with a ring of billowing puffs banked against the slopes near
 * the summit. `open` (0..1) clears the sea over ground that must stay visible.
 */
export function cloudSea(
	p: Palette,
	rand: () => number,
	o: { cx: number; cz: number; r0: number; r1: number; y: number; height: (x: number, z: number) => number; puffs?: number; open?: (x: number, z: number) => number }
): THREE.Group {
	const group = cloudSheets(p.cloudSheet, o.height, o);
	const puffs: { x: number; y: number; z: number; r: number }[] = [];
	const want = o.puffs ?? 120;
	for (let k = 0; k < want * 6 && puffs.length < want; k++) {
		const a = rand() * Math.PI * 2;
		const d = o.r0 * (0.7 + rand() * 1.6);
		const x = o.cx + Math.cos(a) * d;
		const z = o.cz + Math.sin(a) * d;
		const gy = o.height(x, z);
		// bank the puffs where the slope meets the sea: ground just above or below the cloud top
		if (Math.abs(gy - o.y) > 40 || (o.open && o.open(x, z) > 0.5)) continue;
		const r = 26 + rand() * 40;
		puffs.push({ x, y: o.y + r * 0.18 + rand() * 6, z, r });
	}
	if (puffs.length) group.add(cloudBank(p, puffs));
	return group;
}

/* ------------------------------------------------------------------ camps */

/**
 * A besieging army's camp: blocks of ridge tents in rows with lanes between them, the general's
 * pavilions in the middle block, banners at the block corners and a timber palisade round it all.
 * The camp is a rectangle `w` × `d` centred on (x, z), its long side turned by `rot`.
 */
export function camp(
	b: Builder,
	g: Ground,
	rand: () => number,
	o: { x: number; z: number; w: number; d: number; rot: number; cloth: Mat; ok?: (x: number, z: number) => boolean }
): Tent[] {
	const list: Tent[] = [];
	const c = Math.cos(o.rot);
	const s = Math.sin(o.rot);
	const place = (u: number, v: number): P2 => [o.x + u * c - v * s, o.z + u * s + v * c];
	const yaw = -o.rot;
	const BW = 44;
	const BD = 32;
	const lane = 12;
	const nu = Math.max(1, Math.floor(o.w / (BW + lane)));
	const nv = Math.max(1, Math.floor(o.d / (BD + lane)));
	const mid = [Math.floor(nu / 2), Math.floor(nv / 2)];
	for (let i = 0; i < nu; i++) {
		for (let j = 0; j < nv; j++) {
			const u0 = (i - (nu - 1) / 2) * (BW + lane);
			const v0 = (j - (nv - 1) / 2) * (BD + lane);
			const [cx, cz] = place(u0, v0);
			if (o.ok && !o.ok(cx, cz)) continue;
			if (i === mid[0] && j === mid[1]) {
				// the general's block: a ring of square pavilions round a banner yard
				for (let k = 0; k < 6; k++) {
					const a = (k / 6) * Math.PI * 2;
					const [x, z] = place(u0 + Math.cos(a) * 13, v0 + Math.sin(a) * 9);
					list.push({ x, y: g.height(x, z), z, r: 3.4, h: 3.4, rot: yaw, big: true });
				}
				banners(b, [-4, 0, 4].map((du) => {
					const [x, z] = place(u0 + du, v0);
					return [x, g.height(x, z), z] as [number, number, number];
				}), o.cloth, 10, yaw);
				continue;
			}
			for (let r = 0; r < 4; r++) {
				for (let t = 0; t < 6; t++) {
					if (rand() > 0.9) continue;
					const [x, z] = place(u0 - BW / 2 + 5 + t * 6.8 + (rand() - 0.5) * 0.8, v0 - BD / 2 + 5 + r * 7.4);
					list.push({ x, y: g.height(x, z), z, r: 1.6 + rand() * 0.25, h: 2.4 + rand() * 0.3, rot: yaw + (rand() - 0.5) * 0.06 });
				}
			}
			const [bx, bz] = place(u0 - BW / 2, v0 - BD / 2);
			banners(b, [[bx, g.height(bx, bz), bz]], o.cloth, 7, yaw);
		}
	}
	const hw = (nu * (BW + lane)) / 2 + 4;
	const hd = (nv * (BD + lane)) / 2 + 4;
	const ring: P2[] = [place(-hw, -hd), place(hw, -hd), place(hw, hd), place(-hw, hd)];
	stoneWall(b, ring, g.height, { h: 2.6, t: 0.7, closed: true, mat: 'wood', parapet: false, step: 4, gaps: [{ at: place(0, -hd), half: 7 }, { at: place(-hw, 0), half: 7 }] });
	return list;
}

/* ------------------------------------------------------------------ villages */

/** A loose cluster of houses round a centre, with a few trees between them. */
export function hamlet(
	town: Town,
	forest: Forest,
	g: Ground,
	rand: () => number,
	o: { x: number; z: number; r: number; n: number; thatch: number; ok?: (x: number, z: number) => boolean; trees?: TreeKind[]; taken?: Footprints }
): void {
	const taken = o.taken ?? new Footprints();
	const axis = rand() * Math.PI;
	let placed = 0;
	for (let tries = 0; placed < o.n && tries < o.n * 8; tries++) {
		const a = rand() * Math.PI * 2;
		const d = Math.sqrt(rand()) * o.r;
		const x = o.x + Math.cos(a) * d;
		const z = o.z + Math.sin(a) * d;
		const w = 8 + rand() * 4;
		if (o.ok && !o.ok(x, z)) continue;
		if (taken.hits(x, z, w, w, 2.5)) continue;
		taken.add(x, z, w, w);
		const rot = axis + (rand() > 0.5 ? Math.PI / 2 : 0) + (rand() - 0.5) * 0.3;
		town.add(x, g.height(x, z), z, rot, w, 5.5 + rand() * 1.5, 4 + rand() * 0.8, rand() < o.thatch);
		placed++;
	}
	const kinds = o.trees ?? ['broad', 'zelkova'];
	for (let k = 0; k < Math.ceil(o.n * 0.6); k++) {
		const a = rand() * Math.PI * 2;
		const d = o.r * (0.3 + rand() * 0.9);
		const x = o.x + Math.cos(a) * d;
		const z = o.z + Math.sin(a) * d;
		if ((o.ok && !o.ok(x, z)) || taken.inside(x, z, 3)) continue;
		forest.add(pick(kinds, rand()), x, g.height(x, z), z, 7 + rand() * 6);
	}
}
