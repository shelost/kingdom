/**
 * Ground meshes for the 3D battle maps: the relief as a vertex-tinted slab with a
 * diorama skirt (square, or a round table when `round` is set), draped ribbons for
 * rivers and roads, and arcing arrow tubes.
 */
import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, TubeGeometry, Vector3 } from 'three';
import { BATTLE_GRID, groundAt, toWorld, type Relief, type TerrainGrid, type groundPalette } from '$lib/battleTerrain';
import { FIELD } from '$lib/battles';
import type { Pt } from '$lib/mapPaths';

type Palette = ReturnType<typeof groundPalette>;
const SKIRT = -0.22;
/** Water deeper than this darkens toward the abyss (battle water never reaches it). */
const SHELF = -0.1;
/** Segments round a round table's rim. */
const RIM = 256;

/** Height on the grid at a world point (bilinear over the vertex heights). */
function heightAt(r: Relief, { nx, ny, w, d }: TerrainGrid, x: number, z: number): number {
	const gx = Math.max(0, Math.min(nx - 1.001, (x / w + 0.5) * (nx - 1)));
	const gy = Math.max(0, Math.min(ny - 1.001, (z / d + 0.5) * (ny - 1)));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const at = (a: number, c: number) => r.h[c * nx + a];
	return (at(i, j) * (1 - fx) + at(i + 1, j) * fx) * (1 - fy) + (at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx) * fy;
}

/**
 * Grid vertex `(i, j)` in world x/z. On a round table a vertex past the rim is pulled in
 * onto it, so the surface ends in a clean circle and the cells beyond fold flat into it.
 */
function gridXZ({ nx, ny, w, d }: TerrainGrid, i: number, j: number, round: number): [number, number, boolean] {
	const x = (i / (nx - 1) - 0.5) * w;
	const z = (j / (ny - 1) - 0.5) * d;
	if (!round) return [x, z, false];
	const len = Math.hypot(x, z);
	return len > round ? [(x / len) * round, (z / len) * round, true] : [x, z, false];
}

/**
 * The relief as a slab with a skirt, UV-mapped to the sheet. `tinted` colours the top by
 * height and cover; untinted leaves it white for a painted texture to supply the colour.
 * `round` (a world radius) cuts it to a disc with a round skirt.
 */
export function terrainGeometry(
	r: Relief,
	pal: Palette,
	grid: TerrainGrid = BATTLE_GRID,
	skirt = SKIRT,
	tinted = true,
	round = 0
): BufferGeometry {
	const { nx, ny, w, d } = grid;
	const pos: number[] = [];
	const col: number[] = [];
	const uv: number[] = [];
	const idx: number[] = [];
	const c = new Color();
	const tint = (i: number) => {
		if (!tinted) return c.setRGB(1, 1, 1);
		const h = r.h[i];
		const cover = r.cover[i];
		if (cover === 1) return c.set(pal.bed).multiplyScalar(1 - 0.5 * Math.min(1, Math.max(0, (SHELF - h) / 0.15)));
		const t = Math.min(1, Math.max(0, h / Math.max(0.3, r.maxY)));
		c.set(pal.low);
		if (t < 0.45) c.lerp(new Color(pal.mid), t / 0.45);
		else if (t < 0.8) c.set(pal.mid).lerp(new Color(pal.high), (t - 0.45) / 0.35);
		else c.set(pal.high).lerp(new Color(pal.peak), (t - 0.8) / 0.2);
		if (cover === 2) c.lerp(new Color(pal.marsh), 0.4);
		else if (cover === 3) c.lerp(new Color(pal.forest), 0.38);
		else if (cover === 4) c.lerp(new Color(pal.plain), 0.32);
		else if (cover === 5) c.lerp(new Color(pal.town), 0.4);
		return c;
	};
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const k = j * nx + i;
			const [x, z, pulled] = gridXZ(grid, i, j, round);
			pos.push(x, pulled ? heightAt(r, grid, x, z) : r.h[k], z);
			uv.push(x / w + 0.5, 0.5 - z / d);
			const t = tint(k);
			col.push(t.r, t.g, t.b);
		}
	}
	for (let j = 0; j < ny - 1; j++) {
		for (let i = 0; i < nx - 1; i++) {
			const a = j * nx + i;
			idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
		}
	}
	c.set(pal.skirt);
	if (round) roundSkirt(r, grid, round, skirt, c, pos, col, uv, idx);
	else squareSkirt(nx, ny, skirt, c, pos, col, uv, idx);

	const g = new BufferGeometry();
	g.setAttribute('position', new Float32BufferAttribute(pos, 3));
	g.setAttribute('color', new Float32BufferAttribute(col, 3));
	g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}

/** A round table's rim: a band from the ground's edge down to a flat base, lit a little brighter toward the key. */
function roundSkirt(r: Relief, grid: TerrainGrid, round: number, skirt: number, c: Color, pos: number[], col: number[], uv: number[], idx: number[]) {
	const { w, d } = grid;
	const base = pos.length / 3;
	for (let s = 0; s <= RIM; s++) {
		const a = (s / RIM) * Math.PI * 2;
		const x = Math.cos(a) * round;
		const z = Math.sin(a) * round;
		const top = Math.max(0, heightAt(r, grid, x, z));
		const shade = 0.82 + 0.18 * Math.max(0, Math.cos(a - Math.PI * 0.75));
		pos.push(x, top, z, x, skirt, z);
		col.push(c.r * shade, c.g * shade, c.b * shade, c.r * shade * 0.75, c.g * shade * 0.75, c.b * shade * 0.75);
		uv.push(x / w + 0.5, 0.5 - z / d, x / w + 0.5, 0.5 - z / d);
		if (s) {
			const p = base + (s - 1) * 2;
			idx.push(p, p + 2, p + 1, p + 2, p + 3, p + 1);
		}
	}
}

/** The square tile's skirt: each edge vertex drops to a flat base, so the field reads as a diorama tile. */
function squareSkirt(nx: number, ny: number, skirt: number, c: Color, pos: number[], col: number[], uv: number[], idx: number[]) {
	const edge = (list: number[], flip: boolean) => {
		for (let s = 1; s < list.length; s++) {
			const a = list[s - 1];
			const b = list[s];
			const base = pos.length / 3;
			for (const v of [a, b]) {
				pos.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]);
				col.push(c.r, c.g, c.b);
				pos.push(pos[v * 3], skirt, pos[v * 3 + 2]);
				col.push(c.r * 0.8, c.g * 0.8, c.b * 0.8);
				uv.push(uv[v * 2], uv[v * 2 + 1], uv[v * 2], uv[v * 2 + 1]);
			}
			if (flip) idx.push(base, base + 1, base + 2, base + 2, base + 1, base + 3);
			else idx.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
		}
	};
	const row = (j: number) => Array.from({ length: nx }, (_, i) => j * nx + i);
	const colm = (i: number) => Array.from({ length: ny }, (_, j) => j * nx + i);
	edge(row(0), true);
	edge(row(ny - 1), false);
	edge(colm(0), false);
	edge(colm(nx - 1), true);
}

/** The relief's top surface without the skirt, `lift` above land (or the water line), UV-mapped to the grid's square: an overlay to paint on. */
export function drapeGeometry(r: Relief, lift: number, grid: TerrainGrid = BATTLE_GRID, round = 0): BufferGeometry {
	const { nx, ny, w, d } = grid;
	const pos: number[] = [];
	const uv: number[] = [];
	const idx: number[] = [];
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const [x, z, pulled] = gridXZ(grid, i, j, round);
			pos.push(x, Math.max(0, pulled ? heightAt(r, grid, x, z) : r.h[j * nx + i]) + lift, z);
			uv.push(x / w + 0.5, 0.5 - z / d);
		}
	}
	for (let j = 0; j < ny - 1; j++) {
		for (let i = 0; i < nx - 1; i++) {
			const a = j * nx + i;
			idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
		}
	}
	const g = new BufferGeometry();
	g.setAttribute('position', new Float32BufferAttribute(pos, 3));
	g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	g.setIndex(idx);
	return g;
}

/** A flat strip along a sheet path, draped `lift` above the ground (or at the water line). */
export function ribbonGeometry(r: Relief, path: Pt[], width: number, lift: number, water = false): BufferGeometry {
	const pos: number[] = [];
	const idx: number[] = [];
	for (let i = 0; i < path.length; i++) {
		const a = path[Math.max(0, i - 1)];
		const b = path[Math.min(path.length - 1, i + 1)];
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const len = Math.hypot(dx, dy) || 1;
		const nx = (-dy / len) * width * 50;
		const ny = (dx / len) * width * 50;
		for (const s of [-1, 1]) {
			const p: Pt = [Math.max(0, Math.min(FIELD.w, path[i][0] + nx * s)), Math.max(0, Math.min(FIELD.h, path[i][1] + ny * s))];
			const [x, z] = toWorld(p);
			pos.push(x, water ? lift : groundAt(r, p) + lift, z);
		}
		if (i) {
			const k = i * 2;
			idx.push(k - 2, k, k - 1, k - 1, k, k + 1);
		}
	}
	const g = new BufferGeometry();
	g.setAttribute('position', new Float32BufferAttribute(pos, 3));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}

export type FlowSample = { x: number; y: number; z: number; yaw: number };

/** Even samples downstream, each aimed the way the water goes. */
export function riverFlow(path: Pt[], step = 26): FlowSample[] {
	const out: FlowSample[] = [];
	let run = 0;
	let next = step * 0.5;
	for (let i = 1; i < path.length; i++) {
		const a = path[i - 1];
		const b = path[i];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
		if (len < 1e-4) continue;
		while (next <= run + len) {
			const f = (next - run) / len;
			const p: Pt = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
			const ahead: Pt = [a[0] + (b[0] - a[0]) * Math.min(1, f + 0.15), a[1] + (b[1] - a[1]) * Math.min(1, f + 0.15)];
			const [x, z] = toWorld(p);
			const [ax, az] = toWorld(ahead);
			out.push({ x, y: 0.012, z, yaw: Math.atan2(-(az - z), ax - x) });
			next += step;
		}
		run += len;
	}
	return out;
}

/** Dash pattern in sheet units, by arrow kind. */
const DASH: Record<string, [number, number] | undefined> = { retreat: [26, 16], pursuit: [10, 14], feint: [6, 16] };

/** An arrow lifted off the ground in a shallow arc: tube pieces (dashed kinds split) + head pose. */
export function arrowGeometry(r: Relief, path: Pt[], kind: string, radius: number) {
	const total = path.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]) : 0), 0);
	const arch = Math.min(0.1, (total / 100) * 0.025);
	let run = 0;
	const pts = path.map((p, i) => {
		if (i) run += Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]);
		const t = total ? run / total : 0;
		const [x, z] = toWorld(p);
		return { v: new Vector3(x, groundAt(r, p) + 0.05 + Math.sin(Math.PI * t) * arch, z), d: run };
	});
	const dash = DASH[kind];
	const pieces: Vector3[][] = [];
	if (!dash) pieces.push(pts.map((p) => p.v));
	else {
		let cur: Vector3[] = [];
		for (const p of pts) {
			const on = p.d % (dash[0] + dash[1]) < dash[0];
			if (on) cur.push(p.v);
			else if (cur.length) {
				pieces.push(cur);
				cur = [];
			}
		}
		if (cur.length) pieces.push(cur);
	}
	const tubes = pieces
		.filter((p) => p.length > 1)
		.map((p) => new TubeGeometry(new CatmullRomCurve3(p), Math.max(4, p.length * 2), radius, 6, false));
	const end = pts[pts.length - 1].v;
	const prev = pts[Math.max(0, pts.length - 3)].v;
	const dir = end.clone().sub(prev).normalize();
	return { tubes, end, dir };
}
