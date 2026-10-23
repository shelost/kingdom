/**
 * Real elevation for the bake scripts: AWS Terrain Tiles (terrarium PNG;
 * height = R·256 + G + B/256 − 32768), cached in scripts/.cache/dem, and the
 * border map's lon/lat → sheet fit (`project` in src/lib/borders.ts) with its inverse.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { project } from '../../src/lib/borders.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const CACHE = path.join(ROOT, 'scripts/.cache/dem');

export { project };

/** Sheet point → lon/lat: the fit inverted by Newton. */
export function unproject(x, y) {
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

/** One promise per tile, so a whole row asking at once shares a single download. */
const tiles = new Map();
function tile(z, x, y) {
	const key = `${z}_${x}_${y}`;
	let t = tiles.get(key);
	if (!t) {
		t = (async () => {
			fs.mkdirSync(CACHE, { recursive: true });
			const file = path.join(CACHE, key + '.png');
			if (!fs.existsSync(file)) {
				const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`);
				if (!res.ok) throw new Error(`tile ${key}: ${res.status}`);
				fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
			}
			return decodePng(fs.readFileSync(file));
		})();
		t.catch(() => tiles.delete(key));
		tiles.set(key, t);
	}
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

/** Metres above sea at lon/lat, bilinear over the zoom-`z` tile pixels. */
export async function elevation(lon, lat, z) {
	const n = 2 ** z;
	const r = (lat * Math.PI) / 180;
	const gx = ((lon + 180) / 360) * n * 256;
	const gy = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n * 256;
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
	return (a * (1 - fx) + c * fx) * (1 - fy) + (d * (1 - fx) + e * fx) * fy;
}
