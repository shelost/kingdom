/**
 * Topographic mesh for the world view. The peninsula uses the baked elevation
 * where it overlaps the sheet; everywhere else is a height field from the
 * coastline plus the great ranges. 이승 carries that relief. 저승 is a low basin.
 * The flower-field join is a gentle rise. No three.js in the paint module.
 */
import { BufferGeometry, Float32BufferAttribute } from 'three';
import type { Relief } from '$lib/battleTerrain';
import {
	COSMOS_FRAME,
	DEAD_DISC,
	HALF_DISC,
	LAND_ADDS,
	LIVING_DISC,
	WATER_CUTS,
	cosmosProject,
	lensPoint,
	sheetRing,
	viewDiscs,
	type CosmosLayout,
	type Disc,
	type SheetBox
} from '$lib/cosmos';
import { MAP_TERRAIN, mapGroundAt, toMapWorld } from '$lib/mapTerrain';

const NX = 220;

export type CosmosRelief = {
	nx: number;
	ny: number;
	h: Float32Array;
	maxY: number;
};

let active: CosmosRelief | null = null;

/** Land height under a sheet point, in world units. 0 before the mesh is built. */
export function cosmosHeight(x: number, y: number): number {
	const g = active;
	if (!g) return 0;
	const F = COSMOS_FRAME;
	const gx = Math.max(0, Math.min(g.nx - 1.001, ((x - F.x) / F.w) * (g.nx - 1)));
	const gy = Math.max(0, Math.min(g.ny - 1.001, ((y - F.y) / F.h) * (g.ny - 1)));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const at = (a: number, c: number) => g.h[c * g.nx + a];
	return (at(i, j) * (1 - fx) + at(i + 1, j) * fx) * (1 - fy) + (at(i, j + 1) * (1 - fx) + at(i + 1, j + 1) * fx) * fy;
}

const inDisc = (x: number, y: number, d: Disc) => {
	const dx = x - d.x;
	const dy = y - d.y;
	return dx * dx + dy * dy <= d.r * d.r;
};

/** Great ranges besides the roof of the world. Sigma is sheet units, z is relative height. */
const RANGES = (
	[
		[76, 42, 240, 1.45],
		[102, 36, 200, 1.15],
		[110, 34, 170, 0.7],
		[138, 36.4, 150, 1.35],
		[128, 37, 80, 0.55],
		[8, 46.2, 190, 1.7],
		[22, 43, 150, 1.05],
		[33, 39, 170, 1.25],
		[48, 33.5, 230, 1.55],
		[54, 32, 200, 1.15],
		[20, 32, 210, 0.45],
		[77, 20, 260, 0.75],
		[100, 23, 150, 0.85]
	] as [number, number, number, number][]
).map(([lon, lat, s, z]) => ({ s, z, p: cosmosProject(lon, lat) }));

/** The Tibetan tableland: one flat lift, so its broad bumps cannot stack into a spike. */
const PLATEAU: [number, number][] = [
	[75, 35.5], [79, 35.8], [84, 35.6], [90, 36.2], [95, 36], [99, 35], [101, 33], [100, 30],
	[97, 29], [93, 29], [89, 28.6], [85, 29], [81, 30.3], [78, 32]
];
const PLATEAU_LIFT = 4.2;

/** The Himalayan crest along the plateau's southern wall: a ridge by distance to this line. */
const CREST = ([[74, 35.5], [78, 32.5], [81, 30], [84, 28.6], [87, 28], [90, 28], [93, 28.4], [95, 29]] as [number, number][]).map(
	([lon, lat]) => cosmosProject(lon, lat)
);
const CREST_LIFT = 3;
const CREST_SIGMA = 70;

/** Distance from a sheet point to a polyline. */
function lineDistance(x: number, y: number, line: [number, number][]): number {
	let best = Infinity;
	for (let i = 1; i < line.length; i++) {
		const [ax, ay] = line[i - 1];
		const [bx, by] = line[i];
		const dx = bx - ax;
		const dy = by - ay;
		const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1)));
		best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
	}
	return best;
}

function zone(x: number, y: number, layout: CosmosLayout): 'dead' | 'seam' | 'live' {
	if (layout === 'halves') {
		const dx = x - HALF_DISC.x;
		if (dx < -180) return 'dead';
		if (dx < 180) return 'seam';
		return 'live';
	}
	const live = inDisc(x, y, LIVING_DISC);
	const dead = inDisc(x, y, DEAD_DISC);
	if (live && dead) return 'seam';
	if (dead) return 'dead';
	return 'live';
}

function edgeBlend(x: number, y: number): number {
	const m = MAP_TERRAIN;
	const dx = Math.min(x - m.x, m.x + m.w - x);
	const dy = Math.min(y - m.y, m.y + m.h - y);
	const edge = Math.min(dx, dy);
	if (edge <= 0) return 0;
	return Math.min(1, edge / 48);
}

function hash(i: number): number {
	const s = Math.imul(i, 1664525) + 1013904223;
	return (s >>> 0) / 4294967296;
}

/**
 * Rasterise the land path and lift it. `peninsula` is the Samhan sheet's real
 * elevation, blended in so the home mountains agree with the close relief.
 */
export function buildCosmosRelief(land: string, layout: CosmosLayout, peninsula: Relief | null): CosmosRelief {
	const F = COSMOS_FRAME;
	const nx = NX;
	const ny = Math.max(2, Math.round(((nx - 1) * F.h) / F.w) + 1);
	const c = document.createElement('canvas');
	c.width = nx;
	c.height = ny;
	const g = c.getContext('2d', { willReadFrequently: true })!;
	g.setTransform(nx / F.w, 0, 0, ny / F.h, (-F.x * nx) / F.w, (-F.y * ny) / F.h);
	g.fillStyle = '#fff';
	g.fill(new Path2D(land));
	const trace = (ring: [number, number][]) => {
		const pts = sheetRing(ring);
		pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
		g.closePath();
	};
	for (const ring of LAND_ADDS) {
		g.beginPath();
		trace(ring);
		g.fill();
	}
	g.globalCompositeOperation = 'destination-out';
	for (const ring of WATER_CUTS) {
		g.beginPath();
		trace(ring);
		g.fill();
	}
	g.globalCompositeOperation = 'source-over';
	const px = g.getImageData(0, 0, nx, ny).data;
	const landAt = new Uint8Array(nx * ny);
	for (let i = 0; i < landAt.length; i++) landAt[i] = px[i * 4 + 3] > 128 ? 1 : 0;

	g.setTransform(1, 0, 0, 1, 0, 0);
	g.clearRect(0, 0, nx, ny);
	g.filter = 'blur(1.5px)';
	g.setTransform(nx / F.w, 0, 0, ny / F.h, (-F.x * nx) / F.w, (-F.y * ny) / F.h);
	g.beginPath();
	trace(PLATEAU);
	g.fill();
	g.filter = 'none';
	const tableland = g.getImageData(0, 0, nx, ny).data;

	const INF = 1e6;
	const dist = new Float32Array(nx * ny);
	for (let i = 0; i < dist.length; i++) dist[i] = landAt[i] ? 0 : INF;
	const relax = (i: number, j: number, d: number) => {
		if (i < 0 || j < 0 || i >= nx || j >= ny) return;
		const p = j * nx + i;
		if (d < dist[p]) dist[p] = d;
	};
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			const d = dist[p];
			relax(i + 1, j, d + 1);
			relax(i, j + 1, d + 1);
			relax(i + 1, j + 1, d + 1.4);
			relax(i - 1, j + 1, d + 1.4);
		}
	}
	for (let j = ny - 1; j >= 0; j--) {
		for (let i = nx - 1; i >= 0; i--) {
			const p = j * nx + i;
			const d = dist[p];
			relax(i - 1, j, d + 1);
			relax(i, j - 1, d + 1);
			relax(i - 1, j - 1, d + 1.4);
			relax(i + 1, j - 1, d + 1.4);
		}
	}

	const cell = F.w / nx;
	const h = new Float32Array(nx * ny);
	const flower = lensPoint();
	let maxY = 0;
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			const x = F.x + ((i + 0.5) / nx) * F.w;
			const y = F.y + ((j + 0.5) / ny) * F.h;
			const where = zone(x, y, layout);
			const n = hash(p);
			let v = 0;
			if (where === 'dead') {
				const t = Math.min(1, Math.hypot(x - DEAD_DISC.x, y - DEAD_DISC.y) / DEAD_DISC.r);
				v = -8.4 * (1 - t) - 1.4 * t + (n - 0.5) * 0.35;
			} else if (where === 'seam') {
				const dx = x - flower[0];
				const dy = y - flower[1];
				v = 1.4 + 6.4 * Math.exp(-(dx * dx + dy * dy) / (2 * 420 * 420));
			} else if (!landAt[p]) v = 0.15;
			else {
				const inland = Math.min(4.6, (dist[p] * cell) / 520);
				v = 1.4 + inland + (n - 0.5) * 0.55 * (0.5 + inland);
				for (const m of RANGES) {
					const dx = x - m.p[0];
					const dy = y - m.p[1];
					v += m.z * 3.4 * Math.exp(-(dx * dx + dy * dy) / (2 * m.s * m.s));
				}
				v += PLATEAU_LIFT * (tableland[p * 4 + 3] / 255);
				const crest = lineDistance(x, y, CREST);
				v += CREST_LIFT * Math.exp(-(crest * crest) / (2 * CREST_SIGMA * CREST_SIGMA));
				if (peninsula && edgeBlend(x, y) > 0) {
					const b = edgeBlend(x, y);
					const real = Math.max(0.55, mapGroundAt(peninsula, x, y) * 7.2);
					v = v * (1 - b) + real * b;
				}
			}
			h[p] = v;
			maxY = Math.max(maxY, v);
		}
	}
	const smooth = new Float32Array(h);
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			let s = 0;
			let n = 0;
			for (let dj = -1; dj <= 1; dj++) {
				for (let di = -1; di <= 1; di++) {
					const a = i + di;
					const b = j + dj;
					if (a < 0 || b < 0 || a >= nx || b >= ny) continue;
					s += h[b * nx + a];
					n++;
				}
			}
			smooth[j * nx + i] = s / n;
		}
	}
	maxY = 0;
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const x = F.x + ((i + 0.5) / nx) * F.w;
			const y = F.y + ((j + 0.5) / ny) * F.h;
			let rim = 0;
			for (const d of viewDiscs(layout)) {
				const distC = Math.hypot(x - d.x, y - d.y);
				rim = Math.max(rim, Math.min(1, (d.r - distC) / (d.r * 0.06)));
			}
			/** Keep a firm lip at the rim so the wall meets land, not a sliver. */
			const v = smooth[j * nx + i] * (0.55 + 0.45 * rim);
			h[j * nx + i] = v;
			maxY = Math.max(maxY, v);
		}
	}
	active = { nx, ny, h, maxY };
	return active;
}

function sheetOf(nx: number, ny: number, i: number, j: number, box: SheetBox): [number, number] {
	return [box.x + (i / (nx - 1)) * box.w, box.y + (j / (ny - 1)) * box.h];
}

/** Where the side wall stops, in world units: a disc about a fifth of its radius thick. */
const RIM_BASE = -10;
const RIM_SEGS = 192;

/** The world as a height mesh in the frame's own coordinates, centred on the frame. */
export function reliefGeometry(rel: CosmosRelief, layout: CosmosLayout): BufferGeometry {
	const F = COSMOS_FRAME;
	const { nx, ny } = rel;
	const [cx, cz] = toMapWorld(F.x + F.w / 2, F.y + F.h / 2);
	const pos: number[] = [];
	const uv: number[] = [];
	const idx: number[] = [];
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const [x, y] = sheetOf(nx, ny, i, j, F);
			const [wx, wz] = toMapWorld(x, y);
			pos.push(wx - cx, rel.h[j * nx + i], wz - cz);
			uv.push(i / (nx - 1), 1 - j / (ny - 1));
		}
	}
	const inside = (i: number, j: number) => {
		const [x, y] = sheetOf(nx, ny, i, j, F);
		return viewDiscs(layout).some((d) => {
			const dx = x - d.x;
			const dy = y - d.y;
			return dx * dx + dy * dy <= d.r * d.r * 1.04;
		});
	};
	for (let j = 0; j < ny - 1; j++) {
		for (let i = 0; i < nx - 1; i++) {
			if (!inside(i, j) && !inside(i + 1, j) && !inside(i, j + 1) && !inside(i + 1, j + 1)) continue;
			const a = j * nx + i;
			idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}

/**
 * The side wall under each disc, from the relief's edge down to `RIM_BASE`, so the
 * world reads as a thick table. Untextured; where the two discs overlap there is no wall.
 */
export function rimGeometry(layout: CosmosLayout): BufferGeometry {
	const F = COSMOS_FRAME;
	const [cx, cz] = toMapWorld(F.x + F.w / 2, F.y + F.h / 2);
	const discs = viewDiscs(layout);
	const pos: number[] = [];
	const nrm: number[] = [];
	for (const d of discs) {
		const others = discs.filter((o) => o !== d);
		for (let s = 0; s < RIM_SEGS; s++) {
			const a0 = (s / RIM_SEGS) * Math.PI * 2;
			const a1 = ((s + 1) / RIM_SEGS) * Math.PI * 2;
			const am = (a0 + a1) / 2;
			const mid: [number, number] = [d.x + Math.cos(am) * d.r, d.y + Math.sin(am) * d.r];
			if (others.some((o) => inDisc(mid[0], mid[1], o))) continue;
			const corner = (a: number) => {
				const sx = d.x + Math.cos(a) * d.r;
				const sy = d.y + Math.sin(a) * d.r;
				const [wx, wz] = toMapWorld(sx, sy);
				const top = cosmosHeight(d.x + Math.cos(a) * d.r * 0.995, d.y + Math.sin(a) * d.r * 0.995);
				return { x: wx - cx, z: wz - cz, top };
			};
			const p = corner(a0);
			const q = corner(a1);
			pos.push(p.x, p.top, p.z, p.x, RIM_BASE, p.z, q.x, q.top, q.z);
			pos.push(q.x, q.top, q.z, p.x, RIM_BASE, p.z, q.x, RIM_BASE, q.z);
			const [ox, oz] = toMapWorld(mid[0], mid[1]);
			const [dx0, dz0] = toMapWorld(d.x, d.y);
			const len = Math.hypot(ox - dx0, oz - dz0) || 1;
			for (let k = 0; k < 6; k++) nrm.push((ox - dx0) / len, 0, (oz - dz0) / len);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('normal', new Float32BufferAttribute(nrm, 3));
	return geo;
}

/** A patch of the same relief, for the gold Samhan line, sitting just above the ground. */
export function drapeGeometry(box: SheetBox): BufferGeometry | null {
	const rel = active;
	if (!rel) return null;
	const nx = 56;
	const ny = Math.max(2, Math.round(((nx - 1) * box.h) / box.w) + 1);
	const [cx, cz] = toMapWorld(box.x + box.w / 2, box.y + box.h / 2);
	const pos: number[] = [];
	const uv: number[] = [];
	const idx: number[] = [];
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const [x, y] = sheetOf(nx, ny, i, j, box);
			const [wx, wz] = toMapWorld(x, y);
			pos.push(wx - cx, cosmosHeight(x, y) + 0.08, wz - cz);
			uv.push(i / (nx - 1), 1 - j / (ny - 1));
		}
	}
	for (let j = 0; j < ny - 1; j++) {
		for (let i = 0; i < nx - 1; i++) {
			const a = j * nx + i;
			idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
