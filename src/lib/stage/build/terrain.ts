import * as THREE from 'three';
import { smoothstep, type Bounds } from './geo';
import type { Palette } from './kit';

export type Ground = {
	height(x: number, z: number): number;
	/** sRGB hex for a spot; `slope` is 0 on the flat, 1 on a cliff. */
	color(x: number, z: number, y: number, slope: number): string;
	/** 0..1 forest canopy, drawn as clumped crowns by the ground shader. */
	cover?(x: number, z: number, y: number, slope: number): number;
};

const colorCache = new Map<string, THREE.Color>();
function linear(hex: string): THREE.Color {
	let c = colorCache.get(hex);
	if (!c) {
		c = new THREE.Color(hex);
		colorCache.set(hex, c);
	}
	return c;
}

/** Box-blur a per-vertex grid attribute in place, so field, path and forest colours melt into each other. */
function soften(a: Float32Array, cols: number, rows: number, size: number, passes: number): void {
	const tmp = new Float32Array(a.length);
	for (let p = 0; p < passes; p++) {
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < cols; i++) {
				for (let c = 0; c < size; c++) {
					let s = 0;
					let n = 0;
					for (let dj = -1; dj <= 1; dj++) {
						const jj = j + dj;
						if (jj < 0 || jj >= rows) continue;
						for (let di = -1; di <= 1; di++) {
							const ii = i + di;
							if (ii < 0 || ii >= cols) continue;
							s += a[(jj * cols + ii) * size + c];
							n++;
						}
					}
					tmp[(j * cols + i) * size + c] = s / n;
				}
			}
		}
		a.set(tmp);
	}
}

export type Sampler = (x: number, z: number) => number;
type Lift = (x: number, z: number) => number;

/**
 * Bilinear lookup into a built ground tile's own vertex heights (no extra height calls), falling
 * back to the exact function outside the tile. For per-vertex work like the Builder's contact shadows.
 */
function tileSampler(pos: Float32Array, minX: number, minZ: number, cx: number, cz: number, nx: number, nz: number, fallback: Sampler): Sampler {
	return (x, z) => {
		const fx = (x - minX) / cx;
		const fz = (z - minZ) / cz;
		if (fx < 0 || fz < 0 || fx >= nx || fz >= nz) return fallback(x, z);
		const i = Math.floor(fx);
		const j = Math.floor(fz);
		const tx = fx - i;
		const tz = fz - j;
		const k = j * (nx + 1) + i;
		const y = (n: number) => pos[n * 3 + 1];
		const a = y(k) + (y(k + 1) - y(k)) * tx;
		const c = y(k + nx + 1) + (y(k + nx + 2) - y(k + nx + 1)) * tx;
		return a + (c - a) * tz;
	};
}

/* ------------------------------------------------------------------ the ground grid, in row bands */

/** A ground tile's lattice: `nx` × `nz` cells of `w / nx` by `d / nz` metres from (minX, minZ). */
export type GridSpec = { minX: number; minZ: number; w: number; d: number; nx: number; nz: number };

/** Rows `j0..j1` of a tile, before the colour blur: lifted heights, normals, raw colour and cover. */
export type GridBand = { j0: number; j1: number; y: Float32Array; normal: Float32Array; color: Float32Array; cover: Float32Array };

/** A whole tile's sampled lattice, ready to become geometry. */
export type GridData = { spec: GridSpec; y: Float32Array; normal: Float32Array; color: Float32Array; cover: Float32Array };

export function gridSpec(minX: number, minZ: number, w: number, d: number, cell: number): GridSpec {
	return { minX, minZ, w, d, nx: Math.max(2, Math.round(w / cell)), nz: Math.max(2, Math.round(d / cell)) };
}

function sameSpec(a: GridSpec, b: GridSpec): boolean {
	return a.minX === b.minX && a.minZ === b.minZ && a.w === b.w && a.d === b.d && a.nx === b.nx && a.nz === b.nz;
}

/** Part `part` of `parts` equal row bands. */
export function bandRows(spec: GridSpec, part: number, parts: number): [number, number] {
	const rows = spec.nz + 1;
	const j0 = Math.floor((rows * part) / parts);
	const j1 = Math.floor((rows * (part + 1)) / parts) - 1;
	return [j0, j1];
}

/**
 * Sample rows `j0..j1`. Normals come from a one-row halo, accumulated over the same two triangles
 * per cell as the full mesh, so bands computed apart join without a seam.
 */
export function gridBand(g: Ground, spec: GridSpec, lift: Lift, j0: number, j1: number): GridBand {
	const { minX, minZ, w, d, nx, nz } = spec;
	const cols = nx + 1;
	const h0 = Math.max(0, j0 - 1);
	const h1 = Math.min(nz, j1 + 1);
	const hRows = h1 - h0 + 1;
	const hy = new Float32Array(hRows * cols);
	const xs = new Float32Array(cols);
	for (let i = 0; i <= nx; i++) xs[i] = minX + (w * i) / nx;
	for (let r = 0; r < hRows; r++) {
		const z = minZ + (d * (h0 + r)) / nz;
		for (let i = 0; i <= nx; i++) hy[r * cols + i] = g.height(xs[i], z) + lift(xs[i], z);
	}
	const hn = new Float32Array(hRows * cols * 3);
	const cx = w / nx;
	const cz = d / nz;
	const face = (a: number, b: number, c: number, ax: number, az: number, bx: number, bz: number, ccx: number, ccz: number) => {
		// three's computeVertexNormals: (C − B) × (A − B), added unnormalised to each corner
		const cbx = ccx - bx, cby = hy[c] - hy[b], cbz = ccz - bz;
		const abx = ax - bx, aby = hy[a] - hy[b], abz = az - bz;
		const nxv = cby * abz - cbz * aby;
		const nyv = cbz * abx - cbx * abz;
		const nzv = cbx * aby - cby * abx;
		for (const v of [a, b, c]) {
			hn[v * 3] += nxv;
			hn[v * 3 + 1] += nyv;
			hn[v * 3 + 2] += nzv;
		}
	};
	for (let r = 0; r < hRows - 1; r++) {
		for (let i = 0; i < nx; i++) {
			const a = r * cols + i;
			const b = a + 1;
			const c = a + cols;
			const e = c + 1;
			const x0 = i * cx, x1 = (i + 1) * cx, z0 = r * cz, z1 = (r + 1) * cz;
			face(a, c, b, x0, z0, x0, z1, x1, z0);
			face(b, c, e, x1, z0, x0, z1, x1, z1);
		}
	}
	const rows = j1 - j0 + 1;
	const count = rows * cols;
	const y = new Float32Array(count);
	const normal = new Float32Array(count * 3);
	const color = new Float32Array(count * 3);
	const cover = new Float32Array(count);
	for (let r = 0; r < rows; r++) {
		const src = (j0 + r - h0) * cols;
		const z = minZ + (d * (j0 + r)) / nz;
		for (let i = 0; i <= nx; i++) {
			const k = r * cols + i;
			const s = src + i;
			const len = Math.hypot(hn[s * 3], hn[s * 3 + 1], hn[s * 3 + 2]) || 1;
			normal[k * 3] = hn[s * 3] / len;
			normal[k * 3 + 1] = hn[s * 3 + 1] / len;
			normal[k * 3 + 2] = hn[s * 3 + 2] / len;
			const yy = hy[s];
			y[k] = yy;
			const slope = 1 - normal[k * 3 + 1];
			const c = linear(g.color(xs[i], z, yy, slope));
			color[k * 3] = c.r;
			color[k * 3 + 1] = c.g;
			color[k * 3 + 2] = c.b;
			cover[k] = g.cover ? g.cover(xs[i], z, yy, slope) : 0;
		}
	}
	return { j0, j1, y, normal, color, cover };
}

/** Stitch bands (in row order) back into one tile. */
export function joinBands(spec: GridSpec, bands: GridBand[]): GridData {
	const cols = spec.nx + 1;
	const count = cols * (spec.nz + 1);
	const out: GridData = { spec, y: new Float32Array(count), normal: new Float32Array(count * 3), color: new Float32Array(count * 3), cover: new Float32Array(count) };
	for (const b of bands) {
		const at = b.j0 * cols;
		out.y.set(b.y, at);
		out.normal.set(b.normal, at * 3);
		out.color.set(b.color, at * 3);
		out.cover.set(b.cover, at);
	}
	return out;
}

/** The tile as geometry: positions, uvs, the blurred colour and cover, a fast height sampler. */
function finishGrid(data: GridData, fallback: Sampler): THREE.BufferGeometry {
	const { minX, minZ, w, d, nx, nz } = data.spec;
	const cols = nx + 1;
	const count = cols * (nz + 1);
	const pos = new Float32Array(count * 3);
	const uv = new Float32Array(count * 2);
	for (let j = 0; j <= nz; j++) {
		const z = minZ + (d * j) / nz;
		for (let i = 0; i <= nx; i++) {
			const k = j * cols + i;
			const x = minX + (w * i) / nx;
			pos[k * 3] = x;
			pos[k * 3 + 1] = data.y[k];
			pos[k * 3 + 2] = z;
			uv[k * 2] = x;
			uv[k * 2 + 1] = z;
		}
	}
	const col = data.color.slice();
	const cov = data.cover.slice();
	soften(col, cols, nz + 1, 3, 2);
	soften(cov, cols, nz + 1, 1, 1);
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	geo.setAttribute('normal', new THREE.BufferAttribute(data.normal.slice(), 3));
	geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
	geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
	geo.setAttribute('cover', new THREE.BufferAttribute(cov, 1));
	geo.setIndex(new THREE.BufferAttribute(cellIndex(nx, 0, nx, 0, nz, 1), 1));
	geo.computeBoundingSphere();
	geo.userData.sample = tileSampler(pos, minX, minZ, w / nx, d / nz, nx, nz, fallback);
	geo.userData.spec = data.spec;
	return geo;
}

/** Two triangles per cell over columns i0..i1 and rows j0..j1 of a lattice `nx` wide, every `step` vertices. */
function cellIndex(nx: number, i0: number, i1: number, j0: number, j1: number, step: number): Uint32Array {
	const is = ticks(i0, i1, step);
	const js = ticks(j0, j1, step);
	const cols = nx + 1;
	const idx = new Uint32Array((is.length - 1) * (js.length - 1) * 6);
	let t = 0;
	for (let q = 0; q < js.length - 1; q++) {
		for (let p = 0; p < is.length - 1; p++) {
			const a = js[q] * cols + is[p];
			const b = js[q] * cols + is[p + 1];
			const c = js[q + 1] * cols + is[p];
			const e = js[q + 1] * cols + is[p + 1];
			idx[t++] = a;
			idx[t++] = c;
			idx[t++] = b;
			idx[t++] = b;
			idx[t++] = c;
			idx[t++] = e;
		}
	}
	return idx;
}

/** from, from + step, …, always ending exactly on `to`. */
function ticks(from: number, to: number, step: number): number[] {
	const out: number[] = [];
	for (let v = from; v < to; v += step) out.push(v);
	out.push(to);
	return out;
}

/* ------------------------------------------------------------------ recording and replaying grids */

/** A grid the build asked for while recording: the worker samples it later. */
export type RecordedGrid = { spec: GridSpec; g: Ground; lift: Lift };

let recording: RecordedGrid[] | null = null;
let replay: { list: GridData[]; at: number } | null = null;

/**
 * Run a build without sampling any ground: each tile is recorded (with its height functions) and
 * stood in by a flat card whose sampler is the exact height. The build itself is thrown away.
 */
export function recordGrids(run: () => void): RecordedGrid[] {
	const out: RecordedGrid[] = [];
	recording = out;
	try {
		run();
	} finally {
		recording = null;
	}
	return out;
}

/** Run a build with its tiles already sampled, in the order the build asks for them. */
export function withGrids<T>(list: GridData[], run: () => T): T {
	replay = { list, at: 0 };
	try {
		return run();
	} finally {
		replay = null;
	}
}

function grid(g: Ground, minX: number, minZ: number, w: number, d: number, cell: number, lift: Lift): THREE.BufferGeometry {
	const spec = gridSpec(minX, minZ, w, d, cell);
	if (recording) {
		recording.push({ spec, g, lift });
		const card = new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2).translate(minX + w / 2, 0, minZ + d / 2);
		card.userData.sample = (x: number, z: number) => g.height(x, z) + lift(x, z);
		return card;
	}
	if (replay) {
		const next = replay.list[replay.at++];
		if (next && sameSpec(next.spec, spec)) return finishGrid(next, g.height);
		replay = null;
	}
	return finishGrid(joinBands(spec, [gridBand(g, spec, lift, 0, spec.nz)]), g.height);
}

/* ------------------------------------------------------------------ distance detail on the near tile */

/** Chunks per side of the near tile, and the coarser lattices each chunk can fall back to. */
const CHUNKS = 6;
const STEPS = [1, 2, 4];
/** Metres a chunk's skirt hangs under its edge, so a coarse chunk beside a fine one shows no crack. */
const SKIRT = 8;

/** Set on objects that change their detail with the camera; `detail` scales the distances. */
export type DistanceDetail = (camera: THREE.Vector3, detail: number) => void;

/**
 * The near tile cut into chunks. Each chunk carries full, half and quarter lattices over the same
 * vertices plus a skirt, and picks one by its distance from the camera. Chunks also let the camera
 * and the shadow pass skip the ground they cannot see.
 */
function chunked(geo: THREE.BufferGeometry, mat: THREE.Material, cell: number): THREE.Group {
	const spec = geo.userData.spec as GridSpec;
	const { nx, nz } = spec;
	const cols = nx + 1;
	const group = new THREE.Group();
	group.name = 'ground';
	const src = {
		position: geo.getAttribute('position').array as Float32Array,
		normal: geo.getAttribute('normal').array as Float32Array,
		uv: geo.getAttribute('uv').array as Float32Array,
		color: geo.getAttribute('color').array as Float32Array,
		cover: geo.getAttribute('cover').array as Float32Array
	};
	const size = { position: 3, normal: 3, uv: 2, color: 3, cover: 1 } as const;
	const per = (n: number) => Math.max(4, Math.ceil(n / CHUNKS / 4) * 4);
	const ci = per(nx);
	const cj = per(nz);
	const chunks: { mesh: THREE.Mesh; box: THREE.Box3; levels: THREE.BufferAttribute[]; level: number }[] = [];

	for (let j0 = 0; j0 < nz; j0 += cj) {
		for (let i0 = 0; i0 < nx; i0 += ci) {
			const i1 = Math.min(nx, i0 + ci);
			const j1 = Math.min(nz, j0 + cj);
			const w = i1 - i0 + 1;
			const top = w * (j1 - j0 + 1);
			// the border ring, walked once round, gets a twin hung SKIRT metres lower
			const ring: [number, number][] = [];
			for (let i = i0; i < i1; i++) ring.push([i, j0]);
			for (let j = j0; j < j1; j++) ring.push([i1, j]);
			for (let i = i1; i > i0; i--) ring.push([i, j1]);
			for (let j = j1; j > j0; j--) ring.push([i0, j]);
			const n = top + ring.length;
			const attrs = Object.fromEntries(
				(Object.keys(size) as (keyof typeof size)[]).map((k) => [k, new Float32Array(n * size[k])])
			) as Record<keyof typeof size, Float32Array>;
			const copy = (to: number, from: number, drop: number) => {
				for (const k of Object.keys(size) as (keyof typeof size)[]) {
					const s = size[k];
					for (let c = 0; c < s; c++) attrs[k][to * s + c] = src[k][from * s + c];
				}
				attrs.position[to * 3 + 1] -= drop;
			};
			const local = (i: number, j: number) => (j - j0) * w + (i - i0);
			for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) copy(local(i, j), j * cols + i, 0);
			const skirtOf = new Map<number, number>();
			ring.forEach(([i, j], r) => {
				copy(top + r, j * cols + i, SKIRT);
				skirtOf.set(local(i, j), top + r);
			});

			const levels = STEPS.map((step) => {
				const body = cellIndex(w - 1, 0, i1 - i0, 0, j1 - j0, step);
				const is = ticks(0, i1 - i0, step);
				const js = ticks(0, j1 - j0, step);
				const edge: number[] = [];
				for (let p = 0; p < is.length - 1; p++) edge.push(js[0] * w + is[p]);
				for (let q = 0; q < js.length - 1; q++) edge.push(js[q] * w + is[is.length - 1]);
				for (let p = is.length - 1; p > 0; p--) edge.push(js[js.length - 1] * w + is[p]);
				for (let q = js.length - 1; q > 0; q--) edge.push(js[q] * w + is[0]);
				const skirt: number[] = [];
				edge.forEach((a, k) => {
					const b = edge[(k + 1) % edge.length];
					const sa = skirtOf.get(a)!;
					const sb = skirtOf.get(b)!;
					skirt.push(a, b, sa, b, sb, sa);
				});
				const all = new Uint32Array(body.length + skirt.length);
				all.set(body);
				all.set(skirt, body.length);
				return new THREE.BufferAttribute(all, 1);
			});

			const part = new THREE.BufferGeometry();
			for (const k of Object.keys(size) as (keyof typeof size)[]) part.setAttribute(k, new THREE.BufferAttribute(attrs[k], size[k]));
			part.setIndex(levels[0]);
			part.computeBoundingSphere();
			part.computeBoundingBox();
			const mesh = new THREE.Mesh(part, mat);
			mesh.receiveShadow = true;
			mesh.name = 'ground-chunk';
			mesh.matrixAutoUpdate = false;
			group.add(mesh);
			chunks.push({ mesh, box: part.boundingBox!.clone(), levels, level: 0 });
		}
	}
	geo.dispose();

	// a chunk drops to half detail past `far` metres and to a quarter past 2.5 × `far`
	const far = Math.max(260, cell * 55);
	const lod: DistanceDetail = (camera, detail) => {
		const d1 = far * detail;
		const d2 = d1 * 2.5;
		for (const c of chunks) {
			const dist = c.box.distanceToPoint(camera);
			const level = dist < d1 ? 0 : dist < d2 ? 1 : 2;
			if (level === c.level) continue;
			c.level = level;
			c.mesh.geometry.setIndex(c.levels[level]);
		}
	};
	group.userData.lod = lod;
	return group;
}

/** The detailed ground around the site. `userData.sample` is a fast height lookup over it. */
export function nearGround(p: Palette, g: Ground, box: Bounds, cell: number): THREE.Object3D {
	const geo = grid(g, box.minX, box.minZ, box.maxX - box.minX, box.maxZ - box.minZ, cell, () => 0);
	const sample = geo.userData.sample as Sampler;
	if (recording) {
		const card = new THREE.Mesh(geo, p.ground);
		card.userData.sample = sample;
		return card;
	}
	const ground = chunked(geo, p.ground, cell);
	ground.userData.sample = sample;
	return ground;
}

/** Coarse ground out to the horizon; it sinks under the near tiles so they never fight. */
export function farGround(p: Palette, g: Ground, near: Bounds | Bounds[], size: number, cell: number, cx = 0, cz = 0): THREE.Mesh {
	const tiles = Array.isArray(near) ? near : [near];
	const sink = (x: number, z: number) => {
		let s = 0;
		for (const t of tiles) {
			if (x <= t.minX || x >= t.maxX || z <= t.minZ || z >= t.maxZ) continue;
			const inside = Math.min(x - t.minX, t.maxX - x, z - t.minZ, t.maxZ - z);
			s = Math.min(s, -6 * smoothstep(0, cell * 1.5, inside));
		}
		return s;
	};
	const geo = grid(g, cx - size / 2, cz - size / 2, size, size, cell, sink);
	const mesh = new THREE.Mesh(geo, p.ground);
	mesh.receiveShadow = true;
	mesh.name = 'far-ground';
	return mesh;
}

/** Compact bump: 1 at the centre, 0 at radius 1 (elliptical). */
export function bump(x: number, z: number, cx: number, cz: number, rx: number, rz = rx): number {
	const d = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
	if (d >= 1) return 0;
	const f = 1 - d;
	return f * f;
}
