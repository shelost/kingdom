/**
 * The 3D battle ground: real relief (baked by scripts/bake-battle-terrain.mjs) bent to
 * agree with the drawn sheet. Drawn sea, lakes and rivers become water, drawn hills,
 * mountains and ridges rise, plains and towns settle flat; whatever the sheet leaves
 * alone keeps the real land's shape. Pure maths, no three.js.
 *
 * World units: the 1000 × 560 sheet becomes 10 × 5.6 on the ground, x east, z south,
 * y up. Height is in the same units, exaggerated so every field shows its relief.
 *
 * The ground is a round table: a disc of DISC.r sheet units about the sheet centre, so it
 * reads the same from every side as it turns. Beyond the drawn sheet (the disc's north and
 * south caps) the real relief carries on, and drawn water and plains run on outward.
 */
import { FIELD, type Battle, type Terrain } from '$lib/battles';
import { curveThrough, type Pt } from '$lib/mapPaths';

/** The round table, in sheet units. */
export const DISC = { cx: FIELD.w / 2, cy: FIELD.h / 2, r: 470 } as const;
/** The mesh grid over the disc's square: coarse on purpose (a diorama reads as shape, not survey). */
export const GRID = { nx: 97, ny: 97 } as const;
const X0 = DISC.cx - DISC.r;
const Y0 = DISC.cy - DISC.r;
const CELL = (DISC.r * 2) / (GRID.nx - 1);

/**
 * Grids `scripts/bake-battle-terrain.mjs` writes, by sample count: the square bake covers
 * x 0…1000 and y −220…780 (the whole disc); older bakes cover the sheet alone.
 */
const BAKES = [
	{ nx: 161, ny: 161, y0: FIELD.h / 2 - FIELD.w / 2, h: FIELD.w },
	{ nx: 161, ny: 91, y0: 0, h: FIELD.h }
] as const;

/** Bilinear resample of the baked elevation onto the mesh grid (a sheet-only bake runs its edge rows outward). */
function resample(dem: Int16Array): Float32Array | null {
	const bake = BAKES.find((k) => k.nx * k.ny === dem.length);
	if (!bake) return null;
	const out = new Float32Array(GRID.nx * GRID.ny);
	for (let j = 0; j < GRID.ny; j++) {
		const gy = Math.max(0, Math.min(bake.ny - 1.001, ((Y0 + j * CELL - bake.y0) / bake.h) * (bake.ny - 1)));
		const y0 = Math.floor(gy);
		const fy = gy - y0;
		for (let i = 0; i < GRID.nx; i++) {
			const gx = Math.max(0, Math.min(bake.nx - 1.001, ((X0 + i * CELL) / FIELD.w) * (bake.nx - 1)));
			const x0 = Math.floor(gx);
			const fx = gx - x0;
			const at = (x: number, y: number) => dem[y * bake.nx + x];
			out[j * GRID.nx + i] =
				(at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
		}
	}
	return out;
}
const UNIT = 100;
export const WORLD = { w: FIELD.w / UNIT, d: FIELD.h / UNIT };
/** The disc's radius on the ground. */
export const DISC_WORLD = DISC.r / UNIT;
/** The disc's square in sheet units: the frame its ground textures are painted in. */
export const DISC_SHEET = { x: X0, y: Y0, w: DISC.r * 2, h: DISC.r * 2 } as const;

/** A relief's vertex grid and its world footprint: battles use BATTLE_GRID, the 3D map its own. */
export interface TerrainGrid {
	nx: number;
	ny: number;
	w: number;
	d: number;
}
export const BATTLE_GRID: TerrainGrid = { nx: GRID.nx, ny: GRID.ny, w: (DISC.r * 2) / UNIT, d: (DISC.r * 2) / UNIT };
/** Drawn water sits this far under the water plane; land never dips below LAND_FLOOR. */
const WATER_DEPTH = -0.07;
const LAND_FLOOR = 0.02;

export const toWorld = ([x, y]: Pt): [number, number] => [(x - FIELD.w / 2) / UNIT, (y - FIELD.h / 2) / UNIT];

export interface Relief {
	/** World height per grid vertex, row-major from the north-west corner. */
	h: Float32Array;
	/** 0 land · 1 water · 2 marsh · 3 forest · 4 plain · 5 town, per vertex. */
	cover: Uint8Array;
	/** The highest land, for camera bounds. */
	maxY: number;
}

const cellW = CELL;

function inside([x, y]: Pt, poly: Pt[]): boolean {
	let hit = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i];
		const [xj, yj] = poly[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
	}
	return hit;
}

function distToPath([x, y]: Pt, path: Pt[]): number {
	let best = Infinity;
	for (let i = 1; i < path.length; i++) {
		const [ax, ay] = path[i - 1];
		const [bx, by] = path[i];
		const dx = bx - ax;
		const dy = by - ay;
		const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
		best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
	}
	return best;
}

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const vertexAt = (k: number): Pt => [X0 + (k % GRID.nx) * CELL, Y0 + Math.floor(k / GRID.nx) * CELL];
/** Off the drawn sheet, a vertex reads the drawing at the nearest sheet point, so drawn ground runs on outward. */
const onSheet = ([x, y]: Pt): Pt => [Math.max(0, Math.min(FIELD.w, x)), Math.max(0, Math.min(FIELD.h, y))];

/** Closed area outlines, smoothed the way the 2D sheet draws them. */
const outline = (pts: Pt[]) => curveThrough([...pts, pts[0]])?.samples ?? pts;
/** Open lines (rivers, ridges, roads, walls), smoothed the same way. */
export const lineOf = (pts: Pt[]) => curveThrough(pts)?.samples ?? pts;

export function buildRelief(b: Battle, dem: Int16Array | null): Relief {
	const n = GRID.nx * GRID.ny;
	const h = new Float32Array(n);
	const cover = new Uint8Array(n);
	const widthM = FIELD.w * ((b.scale?.km ?? 10) / (b.scale?.px ?? 100)) * 1000;

	// Real relief, lowest land at zero, exaggerated to a readable but honest height.
	const real = dem ? resample(dem) : null;
	if (real) {
		const land = [...real].filter((v) => v > -5).sort((a, c) => a - c);
		const lo = land[Math.floor(land.length * 0.02)] ?? 0;
		const hi = land[Math.floor(land.length * 0.985)] ?? lo + 1;
		const flat = ((hi - lo) / widthM) * WORLD.w;
		const exag = flat > 0 ? Math.max(1.2, Math.min(4.2, 0.38 / flat)) : 1;
		const k = (WORLD.w / widthM) * exag;
		for (let i = 0; i < n; i++) h[i] = Math.max(0, real[i] - lo) * k;
	}

	/** Areas and water read the drawing at the nearest sheet point; `real` hands over the true spot, for shapes that end where they are drawn. */
	const add = (fn: (p: Pt, i: number) => void, real = false) => {
		for (let i = 0; i < n; i++) fn(real ? vertexAt(i) : onSheet(vertexAt(i)), i);
	};
	const bump = (at: Pt, r: number, amp: number) =>
		add((p, i) => {
			const d = Math.hypot(p[0] - at[0], (p[1] - at[1]) * 1.15) / r;
			if (d < 2.6) h[i] += amp * Math.exp(-d * d * 1.6);
		}, true);

	for (const t of b.terrain) {
		if (t.kind === 'hill') bump(t.at, t.r ?? 40, 0.07 * ((t.r ?? 40) / 40) ** 0.6);
		else if (t.kind === 'mountain') bump(t.at, (t.r ?? 30) * 1.5, 0.2 * ((t.r ?? 30) / 30) ** 0.6);
		else if (t.kind === 'ridge') {
			const line = lineOf(t.points);
			add((p, i) => {
				const d = distToPath(p, line) / 34;
				if (d < 2.4) h[i] += 0.08 * Math.exp(-d * d * 1.4);
			}, true);
		}
	}

	const settle = (t: Terrain & { points: Pt[] }, code: number, pull: number) => {
		const poly = outline(t.points);
		const idx: number[] = [];
		add((p, i) => inside(p, poly) && idx.push(i));
		if (!idx.length) return;
		const mean = idx.reduce((s, i) => s + h[i], 0) / idx.length;
		for (const i of idx) {
			h[i] += (mean - h[i]) * pull;
			if (cover[i] === 0) cover[i] = code;
		}
	};
	for (const t of b.terrain) {
		if (t.kind === 'plain') settle(t, 4, 0.55);
		else if (t.kind === 'town') settle(t, 5, 0.7);
		else if (t.kind === 'forest') settle(t, 3, 0);
		else if (t.kind === 'marsh') settle(t, 2, 0.8);
	}

	for (let i = 0; i < n; i++) h[i] = Math.max(LAND_FLOOR, h[i]);

	// Water last: it wins over everything drawn on top of it.
	for (const t of b.terrain) {
		if (t.kind === 'sea' || t.kind === 'lake') {
			const poly = outline(t.points);
			add((p, i) => {
				if (inside(p, poly)) {
					h[i] = WATER_DEPTH;
					cover[i] = 1;
				}
			});
		} else if (t.kind === 'river') {
			const line = lineOf(t.points);
			const half = (t.width ?? 14) / 2 + cellW * 0.6;
			add((p, i) => {
				const d = distToPath(p, line);
				if (d < half) {
					h[i] = WATER_DEPTH;
					cover[i] = 1;
				} else if (d < half + cellW * 2.5) h[i] = Math.min(h[i], LAND_FLOOR + (h[i] - LAND_FLOOR) * smooth((d - half) / (cellW * 2.5)));
			});
		} else if (t.kind === 'marsh') {
			const poly = outline(t.points);
			add((p, i) => inside(p, poly) && (h[i] = Math.min(h[i], LAND_FLOOR * 1.5)));
		}
	}

	// A game board, not a relief model: hills stay, but low enough that troops read over them.
	for (let i = 0; i < n; i++) {
		if (h[i] <= WATER_DEPTH + 0.001) continue;
		h[i] = LAND_FLOOR + (h[i] - LAND_FLOOR) * 0.55;
	}
	let maxY = 0;
	for (let i = 0; i < n; i++) maxY = Math.max(maxY, h[i]);
	return { h, cover, maxY };
}

/** Ground height under a sheet point (bilinear). */
export function groundAt(r: Relief, [x, y]: Pt): number {
	const gx = Math.max(0, Math.min(GRID.nx - 1.001, (x - X0) / CELL));
	const gy = Math.max(0, Math.min(GRID.ny - 1.001, (y - Y0) / CELL));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const at = (a: number, c: number) => Math.max(0, r.h[c * GRID.nx + a]);
	return (at(i, j) * (1 - fx) + at(i + 1, j) * fx) * (1 - fy) + (at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx) * fy;
}

/** Soft map colours, Apple-Maps-like: pale lowland, sage hills, warm stone peaks. */
export function groundPalette(light: boolean) {
	return light
		? { low: '#e6ecd6', mid: '#cbdcae', high: '#b8b192', peak: '#ece6dc', water: '#a8cfe8', bed: '#7fb0d6', marsh: '#c6d9bf', forest: '#a7c78e', plain: '#eee8cf', town: '#e8dcc6', skirt: '#b9ad94', road: '#f6efd9', wall: '#cfc6b4', river: '#8fc0e2', mound: '#a07a4c' }
		: { low: '#3b4a3c', mid: '#4a5e40', high: '#6f6a52', peak: '#9a9384', water: '#24527a', bed: '#1b3f60', marsh: '#3f5546', forest: '#335a35', plain: '#545240', town: '#62574a', skirt: '#24231f', road: '#9a8f72', wall: '#8a8270', river: '#3a73a6', mound: '#8a6a40' };
}
