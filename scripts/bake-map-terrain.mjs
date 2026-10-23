#!/usr/bin/env node
/**
 * Bakes the 3D map's elevation: static/map-terrain.bin = Int16 metres over the sheet
 * window MAP_TERRAIN (src/lib/mapTerrain.ts), nx × ny, row-major from the north-west
 * corner. Each vertex is un-projected through the border map's lon/lat fit, so the
 * relief sits under the same coastline and borders the flat map draws.
 *
 *   node scripts/bake-map-terrain.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { elevation, unproject } from './lib/terrarium.mjs';
import { MAP_TERRAIN } from '../src/lib/mapTerrain.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'static/map-terrain.bin');
/** ~600 m pixels: much finer than the 4 km grid. */
const ZOOM = 8;
/** Each vertex samples a 4 × 4 block across its cell. */
const TAPS = [-3 / 8, -1 / 8, 1 / 8, 3 / 8];
/**
 * Half mean, half max of the block: a plain mean shaves 25–35% off the summits,
 * a single sample aliases them into needles.
 */
const PEAK = 0.5;

const { x, y, w, h, nx, ny } = MAP_TERRAIN;
const cell = w / (nx - 1);
const out = new Int16Array(nx * ny);
let lo = Infinity;
let hi = -Infinity;
async function vertex(sx, sy) {
	const taps = TAPS.flatMap((dy) =>
		TAPS.map((dx) => {
			const geo = unproject(sx + dx * cell, sy + dy * cell);
			return elevation(geo.lon, geo.lat, ZOOM);
		})
	);
	const all = await Promise.all(taps);
	const mean = all.reduce((s, m) => s + m, 0) / all.length;
	return mean + (Math.max(...all) - mean) * PEAK;
}
for (let j = 0; j < ny; j++) {
	const row = [];
	for (let i = 0; i < nx; i++) row.push(vertex(x + (i / (nx - 1)) * w, y + (j / (ny - 1)) * h));
	(await Promise.all(row)).forEach((m, i) => {
		out[j * nx + i] = Math.round(Math.max(-32000, Math.min(32000, m)));
		lo = Math.min(lo, m);
		hi = Math.max(hi, m);
	});
	if (j % 50 === 0) console.log(`row ${j}/${ny}`);
}
fs.writeFileSync(OUT, Buffer.from(out.buffer));
console.log(`map-terrain.bin: ${nx}×${ny}  z${ZOOM}  ${Math.round(lo)}…${Math.round(hi)} m  ${(out.byteLength / 1024).toFixed(0)} KB`);
