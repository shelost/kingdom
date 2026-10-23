/**
 * The 3D map's ground: the whole Samhan sheet as a real-elevation slab (baked by
 * scripts/bake-map-terrain.mjs), with the 2D map's own coastline deciding land and sea
 * so the border wash lands where it does on the flat sheet. Pure maths, no three.js;
 * only type imports, so the bake script can import the frame too.
 *
 * World units: 50 sheet units = 1, x east, z south, y up (heights exaggerated).
 */
import type { Relief, TerrainGrid } from '$lib/battleTerrain';

/** The sheet window the slab covers (the 2D map's MAP_VIEW) and its bake grid: one vertex per 2 sheet units. */
export const MAP_TERRAIN = { x: 45, y: 150, w: 460, h: 620, nx: 231, ny: 311 } as const;

const UNIT = 50;
export const MAP_GRID: TerrainGrid = {
	nx: MAP_TERRAIN.nx,
	ny: MAP_TERRAIN.ny,
	w: MAP_TERRAIN.w / UNIT,
	d: MAP_TERRAIN.h / UNIT
};

/** World height per metre of land: about 30× true, so the Gaema plateau stands ~0.6 tall. */
const VERT = 0.0003;
const LAND_FLOOR = 0.012;
/** The sea lies flat, as on the paper sheet. */
const SEA = -0.004;
/** The slab's skirt hangs here. */
export const MAP_SKIRT = -0.09;

/**
 * The flat map's own colours: its paper land and sea, as the 2D sheet shows them
 * (dark theme: the inverted sheet at its 0.72 opacity over the page).
 */
export function mapPalette(light: boolean) {
	return light
		? { sea: '#d6e0f2', land: '#f3eadc', skirt: '#cfc6b6', river: '#7fb0dc', wash: 0.5, ink: '#281e0f' }
		: { sea: '#10151f', land: '#24201d', skirt: '#141416', river: '#4f86b8', wash: 0.56, ink: '#fffdf8' };
}
export type MapPalette = ReturnType<typeof mapPalette>;

const cell = MAP_TERRAIN.w / (MAP_TERRAIN.nx - 1);

/** Sheet point → world x/z. */
export const toMapWorld = (x: number, y: number): [number, number] => [
	(x - MAP_TERRAIN.x - MAP_TERRAIN.w / 2) / UNIT,
	(y - MAP_TERRAIN.y - MAP_TERRAIN.h / 2) / UNIT
];

/**
 * Metres → world heights. `land` (1 per vertex, from the sheet's coastline) wins over the
 * elevation's own sea level: drawn land never sinks, drawn sea never rises.
 */
export function buildMapRelief(dem: Int16Array | null, land: Uint8Array | null): Relief {
	const n = MAP_TERRAIN.nx * MAP_TERRAIN.ny;
	const h = new Float32Array(n);
	const cover = new Uint8Array(n);
	const real = dem && dem.length === n ? dem : null;
	let maxY = 0;
	for (let i = 0; i < n; i++) {
		const m = real ? real[i] : 0;
		if (land ? land[i] === 1 : m > 0) {
			h[i] = Math.max(LAND_FLOOR, m * VERT);
			maxY = Math.max(maxY, h[i]);
		} else {
			h[i] = SEA;
			cover[i] = 1;
		}
	}
	return { h, cover, maxY };
}

/** Land height under a sheet point (bilinear; the sea reads as its surface, 0). */
export function mapGroundAt(r: Relief, x: number, y: number): number {
	const gx = Math.max(0, Math.min(MAP_TERRAIN.nx - 1.001, (x - MAP_TERRAIN.x) / cell));
	const gy = Math.max(0, Math.min(MAP_TERRAIN.ny - 1.001, (y - MAP_TERRAIN.y) / cell));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const at = (a: number, c: number) => Math.max(0, r.h[c * MAP_TERRAIN.nx + a]);
	return (at(i, j) * (1 - fx) + at(i + 1, j) * fx) * (1 - fy) + (at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx) * fy;
}

/** Whether a sheet point is on the sheet's land (nearest relief vertex). */
export function onMapLand(r: Relief, x: number, y: number): boolean {
	const i = Math.round((x - MAP_TERRAIN.x) / cell);
	const j = Math.round((y - MAP_TERRAIN.y) / cell);
	if (i < 0 || j < 0 || i >= MAP_TERRAIN.nx || j >= MAP_TERRAIN.ny) return false;
	return r.cover[j * MAP_TERRAIN.nx + i] === 0;
}
