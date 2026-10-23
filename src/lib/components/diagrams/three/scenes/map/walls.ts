/**
 * Realm borders on the 3D map as low walls: wherever a site's holder differs from the
 * site across the edge (the same rule as borderLinesAt), a vertical ribbon in the
 * realm's own tint rises off the relief. Each realm's wall stands a hair inside its own
 * land, so a shared border shows both neighbours' colours side by side. Land only.
 */
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { BORDER_SITES, holdingsAt, mapColor, siteColor } from '$lib/borders';
import type { Relief } from '$lib/battleTerrain';
import { mapGroundAt, onMapLand, toMapWorld, type MapPalette } from '$lib/mapTerrain';
import type { Pt } from '$lib/mapPaths';
import { mix } from '../../kit.svelte';

/** Wall height in world units (the tallest land is ~0.7). */
const WALL = 0.07;
/** Sheet units each realm's wall sits inside its own land. */
const INSET = 0.6;
/** Sample spacing along a wall, in sheet units, so it follows the ground. */
const STEP = 2;

const parse = (seg: string): Pt[] =>
	seg
		.split(/[ML]/)
		.filter(Boolean)
		.map((p) => p.split(',').map(Number) as Pt);

export function borderWalls(year: number, relief: Relief, pal: MapPalette, detail = true): BufferGeometry {
	const holdings = holdingsAt(year);
	/** A realm: the polity, or (with detail) each commandery of the Han frontier on its own; Gaya statelets are one realm. */
	const realm = (i: number) => {
		const hold = holdings[i];
		if (!hold.polity) return null;
		if (!detail) return hold.polity;
		return hold.polity === 'gaya' ? 'gaya' : siteColor(BORDER_SITES[i], hold, year);
	};
	const pos: number[] = [];
	const col: number[] = [];
	const c = new Color();

	BORDER_SITES.forEach((site, i) => {
		const own = realm(i);
		if (!own) return;
		const hold = holdings[i];
		const base = hold.polity === 'gaya' ? mapColor('gaya') : siteColor(site, hold, year, detail);
		c.set(mix(base, pal.ink, 0.28));
		for (const { seg, across } of site.edges) {
			if (across >= 0 && realm(across) === own) continue;
			const line = parse(seg);
			for (let s = 1; s < line.length; s++) {
				const [ax, ay] = line[s - 1];
				const [bx, by] = line[s];
				const len = Math.hypot(bx - ax, by - ay);
				if (len < 1e-3) continue;
				// Inward: the side of the segment the site stands on.
				let nx = -(by - ay) / len;
				let ny = (bx - ax) / len;
				if (nx * (site.x - ax) + ny * (site.y - ay) < 0) {
					nx = -nx;
					ny = -ny;
				}
				const m = Math.max(1, Math.ceil(len / STEP));
				let prev: [number, number, number] | null = null;
				for (let t = 0; t <= m; t++) {
					const x = ax + ((bx - ax) * t) / m + nx * INSET;
					const y = ay + ((by - ay) * t) / m + ny * INSET;
					if (!onMapLand(relief, x, y)) {
						prev = null;
						continue;
					}
					const [wx, wz] = toMapWorld(x, y);
					const g = mapGroundAt(relief, x, y);
					if (prev) {
						const [px, pz, pg] = prev;
						pos.push(px, pg - 0.004, pz, wx, g - 0.004, wz, wx, g + WALL, wz);
						pos.push(px, pg - 0.004, pz, wx, g + WALL, wz, px, pg + WALL, pz);
						for (let v = 0; v < 6; v++) col.push(c.r, c.g, c.b);
					}
					prev = [wx, wz, g];
				}
			}
		}
	});

	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('color', new Float32BufferAttribute(col, 3));
	return geo;
}
