#!/usr/bin/env node
/**
 * Bakes a real elevation grid under every battle sheet:
 * static/battles/terrain/{id}.bin = Int16 metres, GRID.nx × GRID.ny, row-major from the
 * north-west corner. Source: AWS Terrain Tiles (terrarium PNG; height = R·256 + G + B/256 − 32768).
 *
 * The sheet centre is `battle.geo` if set, else the battle's place, un-projected through
 * the same lon/lat → sheet fit the border map uses. Sheets are north-up, `scale` gives km.
 *
 *   node scripts/bake-battle-terrain.mjs [battle-id …]
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BATTLES = path.join(ROOT, 'src/lib/data/battles');
const OUT = path.join(ROOT, 'static/battles/terrain');
const CACHE = path.join(ROOT, 'scripts/.cache/dem');
const FIELD = { w: 1000, h: 560 };
const GRID = { nx: 161, ny: 91 };

/* —— the border map's lon/lat → sheet fit (src/lib/borders.ts), inverted by Newton —— */
const PX = [308.0639, 41.7308, 0.6657, -0.1233, -0.1548, 0.1738];
const PY = [507.4412, -0.6506, -51.5349, -0.1756, -0.0447, 0.1223];
const project = (lon, lat) => {
	const u = lon - 127;
	const v = lat - 38;
	const f = [1, u, v, u * u, u * v, v * v];
	return [f.reduce((s, t, i) => s + t * PX[i], 0), f.reduce((s, t, i) => s + t * PY[i], 0)];
};
function unproject(x, y) {
	let lon = 127 + (x - 308) / 41.7;
	let lat = 38 - (y - 507) / 51.5;
	for (let k = 0; k < 30; k++) {
		const [px, py] = project(lon, lat);
		const e = 1e-4;
		const [ax, ay] = project(lon + e, lat);
		const [bx, by] = project(lon, lat + e);
		const j = [(ax - px) / e, (bx - px) / e, (ay - py) / e, (by - py) / e];
		const det = j[0] * j[3] - j[1] * j[2];
		const dx = x - px;
		const dy = y - py;
		lon += (j[3] * dx - j[1] * dy) / det;
		lat += (-j[2] * dx + j[0] * dy) / det;
	}
	return { lon, lat };
}

function placeXY(id) {
	const src = fs.readFileSync(path.join(ROOT, 'src/lib/places.ts'), 'utf8');
	const m = new RegExp(`\\n\\t${id}: \\{[\\s\\S]*?\\n\\t\\tx: ([\\d.-]+),\\n\\t\\ty: ([\\d.-]+),`).exec(src);
	return m ? [Number(m[1]), Number(m[2])] : null;
}

/* —— a minimal PNG reader: 8-bit RGB / RGBA, non-interlaced (what terrarium serves) —— */
function decodePng(buf) {
	let p = 8;
	let w = 0;
	let h = 0;
	let channels = 3;
	const idat = [];
	while (p < buf.length) {
		const len = buf.readUInt32BE(p);
		const type = buf.toString('ascii', p + 4, p + 8);
		const data = buf.subarray(p + 8, p + 8 + len);
		if (type === 'IHDR') {
			w = data.readUInt32BE(0);
			h = data.readUInt32BE(4);
			if (data[8] !== 8 || data[12] !== 0) throw new Error('unsupported PNG');
			channels = data[9] === 6 ? 4 : data[9] === 2 ? 3 : 0;
			if (!channels) throw new Error('unsupported PNG colour type ' + data[9]);
		} else if (type === 'IDAT') idat.push(data);
		else if (type === 'IEND') break;
		p += 12 + len;
	}
	const raw = zlib.inflateSync(Buffer.concat(idat));
	const stride = w * channels;
	const out = Buffer.alloc(h * stride);
	for (let y = 0; y < h; y++) {
		const f = raw[y * (stride + 1)];
		const row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
		const o = y * stride;
		for (let x = 0; x < stride; x++) {
			const a = x >= channels ? out[o + x - channels] : 0;
			const b = y > 0 ? out[o - stride + x] : 0;
			const c = x >= channels && y > 0 ? out[o - stride + x - channels] : 0;
			let v = row[x];
			if (f === 1) v += a;
			else if (f === 2) v += b;
			else if (f === 3) v += (a + b) >> 1;
			else if (f === 4) {
				const pp = a + b - c;
				const pa = Math.abs(pp - a);
				const pb = Math.abs(pp - b);
				const pc = Math.abs(pp - c);
				v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
			}
			out[o + x] = v & 255;
		}
	}
	return { w, h, channels, px: out };
}

const tiles = new Map();
async function tile(z, x, y) {
	const key = `${z}_${x}_${y}`;
	if (tiles.has(key)) return tiles.get(key);
	const file = path.join(CACHE, key + '.png');
	if (!fs.existsSync(file)) {
		const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`);
		if (!res.ok) throw new Error(`tile ${key}: ${res.status}`);
		fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
	}
	const t = decodePng(fs.readFileSync(file));
	tiles.set(key, t);
	return t;
}

async function heightAt(z, gx, gy) {
	const n = 2 ** z;
	const tx = Math.floor(gx / 256);
	const ty = Math.floor(gy / 256);
	const t = await tile(z, ((tx % n) + n) % n, Math.max(0, Math.min(n - 1, ty)));
	const x = Math.max(0, Math.min(255, Math.floor(gx - tx * 256)));
	const y = Math.max(0, Math.min(255, Math.floor(gy - ty * 256)));
	const i = (y * t.w + x) * t.channels;
	return t.px[i] * 256 + t.px[i + 1] + t.px[i + 2] / 256 - 32768;
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
	const n = 2 ** z;
	const out = new Int16Array(GRID.nx * GRID.ny);
	let lo = Infinity;
	let hi = -Infinity;
	for (let j = 0; j < GRID.ny; j++) {
		for (let i = 0; i < GRID.nx; i++) {
			const dx = ((i / (GRID.nx - 1)) * FIELD.w - FIELD.w / 2) * kmPer;
			const dy = ((j / (GRID.ny - 1)) * FIELD.h - FIELD.h / 2) * kmPer;
			const lat = geo.lat - dy / 110.574;
			const lon = geo.lon + dx / (111.32 * cos);
			const r = (lat * Math.PI) / 180;
			const gx = ((lon + 180) / 360) * n * 256;
			const gy = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n * 256;
			// bilinear over the four neighbouring pixels
			const x0 = Math.floor(gx - 0.5);
			const y0 = Math.floor(gy - 0.5);
			const fx = gx - 0.5 - x0;
			const fy = gy - 0.5 - y0;
			const [a, c, d, e] = await Promise.all([
				heightAt(z, x0, y0),
				heightAt(z, x0 + 1, y0),
				heightAt(z, x0, y0 + 1),
				heightAt(z, x0 + 1, y0 + 1)
			]);
			const hgt = (a * (1 - fx) + c * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
			out[j * GRID.nx + i] = Math.round(Math.max(-32000, Math.min(32000, hgt)));
			lo = Math.min(lo, hgt);
			hi = Math.max(hi, hgt);
		}
	}
	fs.writeFileSync(path.join(OUT, `${b.id}.bin`), Buffer.from(out.buffer));
	console.log(`${b.id}: ${geo.lat.toFixed(3)}N ${geo.lon.toFixed(3)}E  z${z}  ${(widthM / 1000).toFixed(1)} km wide  ${Math.round(lo)}…${Math.round(hi)} m`);
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });
const only = new Set(process.argv.slice(2));
for (const f of fs.readdirSync(BATTLES).filter((f) => f.endsWith('.json'))) {
	const b = JSON.parse(fs.readFileSync(path.join(BATTLES, f), 'utf8'));
	if (only.size && !only.has(b.id)) continue;
	await bake(b);
}
