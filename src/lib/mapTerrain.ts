/**
 * The Samhan frame shared by the 2D and 3D maps: the peninsula window of the sheet (whose real
 * elevation scripts/bake-map-terrain.mjs bakes), the sheet → world-unit transform the 3D map
 * uses, and the flat map's paper colours. Pure maths with no imports, so the bake scripts can
 * import it too.
 *
 * World units: 50 sheet units = 1, x east, z south, y up.
 */

/** The peninsula window of the sheet and its bake grid: one sample per 2 sheet units. */
export const MAP_TERRAIN = { x: 45, y: 150, w: 460, h: 620, nx: 231, ny: 311 } as const;

const UNIT = 50;

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

/** Sheet point → world x/z (origin at the peninsula window's centre). */
export const toMapWorld = (x: number, y: number): [number, number] => [
	(x - MAP_TERRAIN.x - MAP_TERRAIN.w / 2) / UNIT,
	(y - MAP_TERRAIN.y - MAP_TERRAIN.h / 2) / UNIT
];
