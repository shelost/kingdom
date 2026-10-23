#!/usr/bin/env node
/**
 * Bakes a real elevation grid under every battle sheet:
 * static/battles/terrain/{id}.bin = Int16 metres, GRID.nx × GRID.ny, row-major from the
 * north-west corner. Source: AWS Terrain Tiles via scripts/lib/terrarium.mjs.
 *
 * The grid is square: the sheet's full width, and as far north and south of its centre
 * as east and west, so the round 3D table has real ground past the sheet's top and bottom.
 *
 * The sheet centre is `battle.geo` if set, else the battle's place, un-projected through
 * the same lon/lat → sheet fit the border map uses. Sheets are north-up, `scale` gives km.
 *
 *   node scripts/bake-battle-terrain.mjs [battle-id …]
 */
import fs from 'node:fs';
import path from 'node:path';
import { elevation, unproject } from './lib/terrarium.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BATTLES = path.join(ROOT, 'src/lib/data/battles');
const OUT = path.join(ROOT, 'static/battles/terrain');
const FIELD = { w: 1000, h: 560 };
const GRID = { nx: 161, ny: 161 };

function placeXY(id) {
	const src = fs.readFileSync(path.join(ROOT, 'src/lib/places.ts'), 'utf8');
	const m = new RegExp(`\\n\\t${id}: \\{[\\s\\S]*?\\n\\t\\tx: ([\\d.-]+),\\n\\t\\ty: ([\\d.-]+),`).exec(src);
	return m ? [Number(m[1]), Number(m[2])] : null;
}

async function bake(b) {
	const xy = b.geo ? null : b.place && placeXY(b.place);
	const geo = b.geo ?? (xy ? unproject(xy[0], xy[1]) : null);
	if (!geo || !b.scale) return console.log(`skip ${b.id}: no ${geo ? 'scale' : 'place/geo'}`);
	const kmPer = b.scale.km / b.scale.px;
	const widthM = FIELD.w * kmPer * 1000;
	const cell = widthM / (GRID.nx - 1);
	const cos = Math.cos((geo.lat * Math.PI) / 180);
	const z = Math.max(4, Math.min(12, Math.floor(Math.log2((156543.03 * cos) / (cell / 2)))));
	const out = new Int16Array(GRID.nx * GRID.ny);
	let lo = Infinity;
	let hi = -Infinity;
	for (let j = 0; j < GRID.ny; j++) {
		for (let i = 0; i < GRID.nx; i++) {
			const dx = ((i / (GRID.nx - 1)) * FIELD.w - FIELD.w / 2) * kmPer;
			const dy = ((j / (GRID.ny - 1)) * FIELD.w - FIELD.w / 2) * kmPer;
			const hgt = await elevation(geo.lon + dx / (111.32 * cos), geo.lat - dy / 110.574, z);
			out[j * GRID.nx + i] = Math.round(Math.max(-32000, Math.min(32000, hgt)));
			lo = Math.min(lo, hgt);
			hi = Math.max(hi, hgt);
		}
	}
	fs.writeFileSync(path.join(OUT, `${b.id}.bin`), Buffer.from(out.buffer));
	console.log(`${b.id}: ${geo.lat.toFixed(3)}N ${geo.lon.toFixed(3)}E  z${z}  ${(widthM / 1000).toFixed(1)} km wide  ${Math.round(lo)}…${Math.round(hi)} m`);
}

fs.mkdirSync(OUT, { recursive: true });
const only = new Set(process.argv.slice(2));
for (const f of fs.readdirSync(BATTLES).filter((f) => f.endsWith('.json'))) {
	const b = JSON.parse(fs.readFileSync(path.join(BATTLES, f), 'utf8'));
	if (only.size && !only.has(b.id)) continue;
	await bake(b);
}
