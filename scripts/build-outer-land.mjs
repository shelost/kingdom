#!/usr/bin/env node
/**
 * Writes static/map-outer.svg: the land and sea around the Figma sheet, so a
 * map framed wider than static/map.svg keeps going instead of ending on a box.
 *
 * Land is Natural Earth 1:50m (world-atlas, the same source as the marble
 * repo), projected with the sheet's own lon/lat fit (`project` in
 * src/lib/borders.ts), so it meets the sheet's coast at its edges. Colours are
 * the sheet's paper and sea, so the CSS filters that recolour the sheet
 * recolour this too.
 *
 *   node scripts/build-outer-land.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { MAP_OUTER } from '../src/lib/places.ts';
import { project } from '../src/lib/borders.ts';

const PAPER = '#F6EDE1';
const SEA = '#D7E1F4';
/** lon/lat window: Chang'an to Hokkaido, the Yangtze to the Amur. */
const LON = [100, 150];
const LAT = [18, 58];
/** Drop points closer than this to the last kept one (sheet units). */
const STEP = 0.8;

const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'));
const land = feature(topo, topo.objects.land);

const inWindow = ([lon, lat]) => lon >= LON[0] - 5 && lon <= LON[1] + 5 && lat >= LAT[0] - 5 && lat <= LAT[1] + 5;
const fmt = (n) => (Math.round(n * 10) / 10).toString();

function ringPath(ring) {
	if (!ring.some(inWindow)) return '';
	/* Clamp to the window so the far-off rest of Eurasia folds onto its edge instead of the quadratic fit flinging it. */
	const pts = ring.map(([lon, lat]) =>
		project(Math.min(Math.max(lon, LON[0]), LON[1]), Math.min(Math.max(lat, LAT[0]), LAT[1]))
	);
	const kept = [pts[0]];
	for (const p of pts) {
		const q = kept[kept.length - 1];
		if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= STEP) kept.push(p);
	}
	if (kept.length < 3) return '';
	return `M${kept.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join('L')}Z`;
}

const polys = land.features.flatMap((f) =>
	f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
);
const d = polys.flatMap((rings) => rings.map(ringPath)).join('');

const { x, y, w, h } = MAP_OUTER;
writeFileSync(
	'static/map-outer.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none">` +
		`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SEA}"/>` +
		`<path fill-rule="evenodd" fill="${PAPER}" d="${d}"/></svg>\n`
);
console.log(`map-outer.svg: ${polys.length} polygons, ${(d.length / 1024).toFixed(0)} KB of path`);
