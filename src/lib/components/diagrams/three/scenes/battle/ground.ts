/**
 * Ground meshes for the 3D battle maps: the relief as a vertex-tinted slab with a
 * diorama skirt, draped ribbons for rivers and roads, and arcing arrow tubes.
 */
import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, TubeGeometry, Vector3 } from 'three';
import { GRID, WORLD, groundAt, toWorld, type Relief, type groundPalette } from '$lib/battleTerrain';
import { FIELD } from '$lib/battles';
import type { Pt } from '$lib/mapPaths';

type Palette = ReturnType<typeof groundPalette>;
const SKIRT = -0.22;

export function terrainGeometry(r: Relief, pal: Palette): BufferGeometry {
	const { nx, ny } = GRID;
	const pos: number[] = [];
	const col: number[] = [];
	const idx: number[] = [];
	const c = new Color();
	const tint = (i: number) => {
		const h = r.h[i];
		const cover = r.cover[i];
		if (cover === 1) return c.set(pal.bed);
		const t = Math.min(1, Math.max(0, h / Math.max(0.3, r.maxY)));
		c.set(pal.low);
		if (t < 0.45) c.lerp(new Color(pal.mid), t / 0.45);
		else if (t < 0.8) c.set(pal.mid).lerp(new Color(pal.high), (t - 0.45) / 0.35);
		else c.set(pal.high).lerp(new Color(pal.peak), (t - 0.8) / 0.2);
		if (cover === 2) c.lerp(new Color(pal.marsh), 0.75);
		else if (cover === 3) c.lerp(new Color(pal.forest), 0.8);
		else if (cover === 4) c.lerp(new Color(pal.plain), 0.6);
		else if (cover === 5) c.lerp(new Color(pal.town), 0.75);
		return c;
	};
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const k = j * nx + i;
			pos.push((i / (nx - 1) - 0.5) * WORLD.w, r.h[k], (j / (ny - 1) - 0.5) * WORLD.d);
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
	// The skirt: each edge vertex drops to a flat base, so the field reads as a diorama tile.
	c.set(pal.skirt);
	const edge = (list: number[], flip: boolean) => {
		for (let s = 1; s < list.length; s++) {
			const a = list[s - 1];
			const b = list[s];
			const base = pos.length / 3;
			for (const v of [a, b]) {
				pos.push(pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]);
				col.push(c.r, c.g, c.b);
				pos.push(pos[v * 3], SKIRT, pos[v * 3 + 2]);
				col.push(c.r * 0.8, c.g * 0.8, c.b * 0.8);
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

	const g = new BufferGeometry();
	g.setAttribute('position', new Float32BufferAttribute(pos, 3));
	g.setAttribute('color', new Float32BufferAttribute(col, 3));
	g.setIndex(idx);
	g.computeVertexNormals();
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

/** Dash pattern in sheet units, by arrow kind. */
const DASH: Record<string, [number, number] | undefined> = { retreat: [26, 16], pursuit: [10, 14], feint: [6, 16] };

/** An arrow lifted off the ground in a shallow arc: tube pieces (dashed kinds split) + head pose. */
export function arrowGeometry(r: Relief, path: Pt[], kind: string, radius: number) {
	const total = path.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]) : 0), 0);
	const arch = Math.min(0.32, (total / 100) * 0.06);
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
