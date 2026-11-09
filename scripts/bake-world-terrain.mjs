#!/usr/bin/env node
/**
 * Bakes the known world's elevation: static/map-world-terrain.bin = Int16 metres (land
 * and sea floor) over WORLD_DEM (src/lib/cosmos.ts), n × n, row-major from the
 * north-west corner, in flat sheet units. Each vertex is un-projected through
 * `cosmosUnbase`, so the relief sits under the same coastline every map scope paints.
 * Past the real poles the latitude clamps; the map's own land mask decides land there.
 *
 *   node scripts/bake-world-terrain.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { elevation } from './lib/terrarium.mjs';
import { WORLD_DEM, cosmosUnbase } from '../src/lib/cosmos.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'static/map-world-terrain.bin');
/** ~5 km pixels at the equator: finer than the ~20 km grid. */
const ZOOM = 5;
/** Each vertex samples a 3 × 3 block across its cell. */
const TAPS = [-1 / 3, 0, 1 / 3];
/** Half mean, half max of the block, so summits are not shaved flat. */
const PEAK = 0.5;
const LAT = 84;

const { x, y, w, h, n } = WORLD_DEM;
const cell = w / (n - 1);
const out = new Int16Array(n * n);
let lo = Infinity;
let hi = -Infinity;

async function vertex(sx, sy) {
	const taps = TAPS.flatMap((dy) =>
		TAPS.map((dx) => {
			const [lon, lat] = cosmosUnbase(sx + dx * cell, sy + dy * cell);
			return elevation(((((lon + 180) % 360) + 360) % 360) - 180, Math.max(-LAT, Math.min(LAT, lat)), ZOOM);
		})
	);
	const all = await Promise.all(taps);
	const mean = all.reduce((s, m) => s + m, 0) / all.length;
	const top = Math.max(...all);
	return mean > 0 ? mean + (top - mean) * PEAK : mean;
}

const t0 = Date.now();
for (let j = 0; j < n; j++) {
	const row = [];
	for (let i = 0; i < n; i++) row.push(vertex(x + i * cell, y + j * cell));
	(await Promise.all(row)).forEach((m, i) => {
		out[j * n + i] = Math.round(Math.max(-11000, Math.min(9000, m)));
		lo = Math.min(lo, m);
		hi = Math.max(hi, m);
	});
	if (j % 64 === 0) console.log(`row ${j}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
fs.writeFileSync(OUT, Buffer.from(out.buffer));
console.log(`map-world-terrain.bin: ${n}×${n}  z${ZOOM}  ${Math.round(lo)}…${Math.round(hi)} m  ${(out.byteLength / 1024).toFixed(0)} KB`);
