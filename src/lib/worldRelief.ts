/**
 * One elevation field per map scope, shared by the 2D shading and the 3D mesh, so
 * every frame stands on the same ground. Real elevation and sea floor come from two
 * bakes: the known world (static/map-world-terrain.bin over WORLD_DEM) and the finer
 * peninsula (static/map-terrain.bin over MAP_TERRAIN), blended at the sheet's edge.
 * The painted land mask decides land and sea, so the mythic west and the endless
 * north rise as hills and the cut seas sink. 저승 is 이승's relief in its mirror,
 * turned inside out (ranges become chasms); the Western Heavens lens is the Ocean
 * of Life with the flower fields rising out of it. No three.js here.
 */
import {
	DEAD_DISC,
	EAST_MYTH_LANDS,
	HALF_DISC,
	LIVING_DISC,
	PASSES_RANGE,
	WORLD_DEM,
	cosmosProject,
	fieldRivers,
	lensPoint,
	meadow,
	projectionVer,
	scopeFrame,
	unfishFast,
	type CosmosLayout,
	type CosmosScope,
	type SheetBox
} from '$lib/cosmos';
import { landRaster, type CosmosData, type ReliefLayers } from '$lib/cosmosLayer';
import { MAP_TERRAIN } from '$lib/mapTerrain';

export interface WorldDem {
	world: Int16Array;
	samhan: Int16Array | null;
}

let loading: Promise<WorldDem> | null = null;

const bin = (src: string) =>
	fetch(src)
		.then((r) => (r.ok ? r.arrayBuffer() : null))
		.then((b) => (b ? new Int16Array(b) : null))
		.catch(() => null);

/** Both elevation bakes, fetched once per page. */
export function loadWorldDem(): Promise<WorldDem> {
	loading ??= Promise.all([bin('/map-world-terrain.bin'), bin('/map-terrain.bin')]).then(([world, samhan]) => {
		if (!world || world.length !== WORLD_DEM.n * WORLD_DEM.n) throw new Error('map-world-terrain.bin missing');
		return { world, samhan: samhan && samhan.length === MAP_TERRAIN.nx * MAP_TERRAIN.ny ? samhan : null };
	});
	loading.catch(() => (loading = null));
	return loading;
}

export interface ReliefField {
	key: string;
	scope: CosmosScope;
	/** The painted frame the field covers, in sheet units (fish-eyed). */
	box: SheetBox;
	nx: number;
	ny: number;
	/** Metres: land above 0, sea floor below. */
	m: Float32Array;
	/** World units above sea level, as the mesh stands. */
	h: Float32Array;
	/** Cosmos only: 1 inside the discs. */
	inside: Uint8Array | null;
	minH: number;
	maxH: number;
}

/** World units per metre, per scope, times the fit's width in world units: a constant share of the frame. */
const VERT: Record<CosmosScope, number> = { samhan: 1.8e-5, sphere: 1.2e-5, world: 0.9e-5, cosmos: 0.7e-5 };
/** The sea floor stands at this share of the land's scale, and no deeper than DEEP. */
const SEA_SCALE = 0.35;
const DEEP = -6000;
/** 저승's chasms (이승's ranges turned down) sink at the land's own scale, to this depth. */
const CHASM = -8000;
/** 3×3 smoothing passes over the metres, so one-cell islands and peaks do not stand as needles. */
const SMOOTH_PASSES = 2;
/** Samples along the frame's long side. */
const LONG: Record<CosmosScope, number> = { samhan: 512, sphere: 512, world: 512, cosmos: 720 };
/** Sheet units over which the peninsula's finer bake fades into the world's. */
const SAMHAN_BLEND = 24;

/** Bilinear read of a row-major Int16 grid, clamped to its edge. */
function sample(g: Int16Array, nx: number, ny: number, gx: number, gy: number): number {
	const x = Math.max(0, Math.min(nx - 1.0001, gx));
	const y = Math.max(0, Math.min(ny - 1.0001, gy));
	const i = Math.floor(x);
	const j = Math.floor(y);
	const fx = x - i;
	const fy = y - j;
	const p = j * nx + i;
	return (g[p] * (1 - fx) + g[p + 1] * fx) * (1 - fy) + (g[p + nx] * (1 - fx) + g[p + nx + 1] * fx) * fy;
}

const worldAt = (dem: WorldDem, fx: number, fy: number) => {
	const cell = WORLD_DEM.w / (WORLD_DEM.n - 1);
	return sample(dem.world, WORLD_DEM.n, WORLD_DEM.n, (fx - WORLD_DEM.x) / cell, (fy - WORLD_DEM.y) / cell);
};

/** The peninsula's own bake where the sheet covers the point, faded in from its edge. */
function realAt(dem: WorldDem, fx: number, fy: number): number {
	const world = worldAt(dem, fx, fy);
	if (!dem.samhan) return world;
	const t = MAP_TERRAIN;
	const edge = Math.min(fx - t.x, t.x + t.w - fx, fy - t.y, t.y + t.h - fy);
	if (edge <= 0) return world;
	const cell = t.w / (t.nx - 1);
	const near = sample(dem.samhan, t.nx, t.ny, (fx - t.x) / cell, (fy - t.y) / cell);
	const b = Math.min(1, edge / SAMHAN_BLEND);
	return world * (1 - b) + near * b;
}

const hash = (i: number, j: number) => {
	const s = Math.imul(i * 73856093 ^ j * 19349663, 1664525) + 1013904223;
	return (s >>> 0) / 4294967296;
};

/** Smooth value noise, 0…1. */
function noise(x: number, y: number): number {
	const i = Math.floor(x);
	const j = Math.floor(y);
	const fx = x - i;
	const fy = y - j;
	const u = fx * fx * (3 - 2 * fx);
	const v = fy * fy * (3 - 2 * fy);
	const a = hash(i, j);
	const b = hash(i + 1, j);
	const c = hash(i, j + 1);
	const d = hash(i + 1, j + 1);
	return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/** Four octaves of value noise, 0…1. */
function fbm(x: number, y: number): number {
	let s = 0;
	let amp = 0.5;
	let f = 1;
	for (let o = 0; o < 4; o++) {
		s += amp * noise(x * f, y * f);
		f *= 2.03;
		amp *= 0.5;
	}
	return s / 0.9375;
}

/**
 * 0 at Korea / the east, 1 toward the Western Heavens — topography softens and
 * simplifies as the known world fades into myth.
 */
function westEase(x: number): number {
	return smooth((LIVING_DISC.x + LIVING_DISC.r * 0.2 - x) / (LIVING_DISC.r * 0.95));
}

/**
 * Metres under a living-world point. The painted land wins: drawn land the real
 * world calls sea (the mythic west, the endless north) rises as rolling hills; drawn
 * sea the real world calls land (Australia, Madagascar) sinks to a shelf.
 * Westward the high-frequency DEM is damped so Europe and Africa read as soft rolls.
 */
function livingMetres(dem: WorldDem, x: number, y: number, land: boolean): number {
	const [fx, fy] = unfishFast(x, y);
	const real = land ? realAt(dem, fx, fy) : worldAt(dem, fx, fy);
	const w = westEase(x);
	const detail = 1 - 0.78 * w;
	if (land) {
		if (real > 0) {
			const base = 40 + 220 * w;
			return Math.max(15, base + (real - base) * detail);
		}
		return 80 + (120 + 700 * fbm(fx / 280, fy / 280) ** 1.5) * (1 - 0.55 * w);
	}
	if (real < 0) return Math.min(-30, real * (0.55 + 0.45 * detail));
	return -80 - 180 * fbm(fx / 220, fy / 220) * (1 - 0.5 * w);
}

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** The Western Heavens: the Ocean of Life's basin with ripples, the flower fields a hill out of it. */
function lensMetres(x: number, y: number, depth: number): number {
	const [lx, ly] = lensPoint();
	const r = Math.hypot(x - lx, y - ly);
	const ocean = -260 - 2400 * smooth(depth) + 140 * Math.sin(r / 46) * (0.4 + 0.6 * smooth(depth));
	const f = meadow();
	const e = ((x - f.x) / f.rx) ** 2 + ((y - f.y) / f.ry) ** 2;
	if (e >= 1.35) return ocean;
	const hill = 70 + 620 * Math.max(0, 1 - e) ** 1.4;
	return ocean + (hill - ocean) * smooth((1.35 - e) / 0.35);
}

type Zone = 'living' | 'dead' | 'lens' | 'out';

function zoneOf(x: number, y: number, layout: CosmosLayout): { zone: Zone; depth: number } {
	if (layout === 'halves') {
		const dx = x - HALF_DISC.x;
		if (Math.hypot(dx, y - HALF_DISC.y) > HALF_DISC.r) return { zone: 'out', depth: 0 };
		if (Math.abs(dx) < 180) return { zone: 'lens', depth: 1 - Math.abs(dx) / 180 };
		return { zone: dx < 0 ? 'dead' : 'living', depth: 0 };
	}
	const dl = LIVING_DISC.r - Math.hypot(x - LIVING_DISC.x, y - LIVING_DISC.y);
	const dd = DEAD_DISC.r - Math.hypot(x - DEAD_DISC.x, y - DEAD_DISC.y);
	if (dl >= 0 && dd >= 0) return { zone: 'lens', depth: Math.min(dl, dd) / 500 };
	if (dl >= 0) return { zone: 'living', depth: 0 };
	if (dd >= 0) return { zone: 'dead', depth: 1 - dd / DEAD_DISC.r };
	return { zone: 'out', depth: 0 };
}

/**
 * 저승 is 이승 turned inside out: its ranges are chasms (Tibet a crevice), its plains a
 * low floor, its seas a shallow basin, all in a bowl that deepens toward the middle.
 */
function deadMetres(living: number, depth: number): number {
	const bowl = -900 * (1 - depth * depth);
	return bowl + (living > 0 ? -0.8 * living : 0.12 * living);
}

/**
 * Box-blurs `m` in place over the cells `keep` allows, then puts every cell back on its
 * own side of sea level: a blurred coast neither floods nor rises out of the sea.
 */
function smoothMetres(m: Float32Array, nx: number, ny: number, keep: Uint8Array | null, passes: number) {
	const land = new Uint8Array(m.length);
	for (let p = 0; p < m.length; p++) land[p] = m[p] > 0 ? 1 : 0;
	const tmp = new Float32Array(m.length);
	for (let pass = 0; pass < passes; pass++) {
		for (let j = 0; j < ny; j++) {
			for (let i = 0; i < nx; i++) {
				const p = j * nx + i;
				if (keep && !keep[p]) continue;
				let s = 0;
				let w = 0;
				for (let dj = -1; dj <= 1; dj++) {
					const jj = j + dj;
					if (jj < 0 || jj >= ny) continue;
					for (let di = -1; di <= 1; di++) {
						const ii = i + di;
						if (ii < 0 || ii >= nx) continue;
						const q = jj * nx + ii;
						if (keep && !keep[q]) continue;
						s += m[q];
						w++;
					}
				}
				tmp[p] = s / w;
			}
		}
		for (let p = 0; p < m.length; p++) if (!keep || keep[p]) m[p] = tmp[p];
	}
	for (let p = 0; p < m.length; p++) m[p] = land[p] ? Math.max(5, m[p]) : Math.min(-5, m[p]);
}

const ang = (a: number) => {
	const t = a % (Math.PI * 2);
	return t < 0 ? t + Math.PI * 2 : t;
};

/**
 * The black pads under the field rivers are a flat shore: no ridges inside the
 * band, a short blend at the edge so the ground doesn't step.
 */
function flattenPads(m: Float32Array, nx: number, ny: number, box: SheetBox, land: Uint8Array) {
	const half: Record<string, number> = { baek: 170, hwang: 170, jeok: 170, samdo: 200 };
	const blend = 55;
	const sx = box.w / (nx - 1);
	const sy = box.h / (ny - 1);
	for (const river of fieldRivers()) {
		for (let j = 0; j < ny; j++) {
			for (let i = 0; i < nx; i++) {
				const x = box.x + i * sx;
				const y = box.y + j * sy;
				const dx = x - river.disc.x;
				const dy = y - river.disc.y;
				const span = river.ccw ? ang(river.a0 - river.a1) : ang(river.a1 - river.a0);
				const along = river.ccw ? ang(river.a0 - Math.atan2(dy, dx)) : ang(Math.atan2(dy, dx) - river.a0);
				if (along > span + 0.2) continue;
				const over = Math.abs(Math.hypot(dx, dy) - river.r) - half[river.id];
				if (over >= blend) continue;
				const p = j * nx + i;
				const t = over <= 0 ? 1 : 1 - over / blend;
				const target = land[p] ? 18 : -24;
				m[p] = m[p] * (1 - t) + target * t;
			}
		}
	}
}

const fields = new Map<string, ReliefField>();
const flats = new Map<string, ReliefField>();

/** Sheet-space point inside a lon/lat ring (ray cast). */
function inLonLatRing(ring: [number, number][], x: number, y: number): boolean {
	const pts = ring.map((ll) => cosmosProject(...ll));
	let inside = false;
	for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
		const [xi, yi] = pts[i];
		const [xj, yj] = pts[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

/**
 * Raise the Five Eastern Lands into misty mountains and the Twelve Passes into a
 * wall before the three rivers — after the DEM sample, before smoothing.
 */
function raiseMythPeaks(m: Float32Array, nx: number, ny: number, box: SheetBox, land: Uint8Array) {
	const sx = box.w / (nx - 1);
	const sy = box.h / (ny - 1);
	const mythRings = EAST_MYTH_LANDS.map((l) => l.ring);
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			const x = box.x + i * sx;
			const y = box.y + j * sy;
			if (mythRings.some((r) => inLonLatRing(r, x, y))) {
				land[p] = 1;
				const peak = 2200 + 1600 * fbm(x / 90, y / 90);
				m[p] = Math.max(m[p], peak);
			} else if (PASSES_RANGE.some((r) => inLonLatRing(r, x, y))) {
				land[p] = 1;
				const ridge = 2600 + 1600 * fbm(x / 70, y / 70);
				m[p] = Math.max(m[p], ridge);
			}
		}
	}
}

/** The same field laid flat at sea level (topography off): same frame, no heights. */
export function flatField(f: ReliefField): ReliefField {
	const hit = flats.get(f.key);
	if (hit) return hit;
	if (flats.size > 8) flats.clear();
	const flat: ReliefField = { ...f, key: `${f.key}|flat`, h: new Float32Array(f.h.length), minH: 0, maxH: 0 };
	flats.set(f.key, flat);
	return flat;
}

/**
 * The field for a scope under the live fish-eye (cached). Its box is that scope's
 * painted frame; heights are scaled to the scope's fit, so Tibet stands as tall
 * against Samhan's frame as it does against the world's.
 */
export function reliefFor(d: CosmosData, dem: WorldDem, scope: CosmosScope, layout: CosmosLayout = 'circles'): ReliefField {
	const key = `r9|${projectionVer()}|${scope}|${layout}|${d.land.length}`;
	const hit = fields.get(key);
	if (hit) return hit;
	if (fields.size > 8) fields.clear();
	const { fit, frame: box } = scopeFrame(scope);
	const long = LONG[scope];
	const nx = box.w >= box.h ? long : Math.max(2, Math.round((long * box.w) / box.h));
	const ny = box.h >= box.w ? long : Math.max(2, Math.round((long * box.h) / box.w));
	const land = landRaster(d, box, nx, ny);
	const n = nx * ny;
	const m = new Float32Array(n);
	const cosmos = scope === 'cosmos';
	const inside = cosmos ? new Uint8Array(n) : null;
	const dead = cosmos ? new Uint8Array(n) : null;
	const sx = box.w / (nx - 1);
	const sy = box.h / (ny - 1);
	const landAt = (x: number, y: number) => {
		const i = Math.round((x - box.x) / sx);
		const j = Math.round((y - box.y) / sy);
		return i >= 0 && j >= 0 && i < nx && j < ny && land[j * nx + i] === 1;
	};
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			const x = box.x + i * sx;
			const y = box.y + j * sy;
			if (!cosmos) {
				m[p] = livingMetres(dem, x, y, land[p] === 1);
				continue;
			}
			const { zone, depth } = zoneOf(x, y, layout);
			if (zone === 'out') continue;
			inside![p] = 1;
			if (zone === 'living') m[p] = livingMetres(dem, x, y, land[p] === 1);
			else if (zone === 'lens') m[p] = lensMetres(x, y, depth);
			else {
				const mx = LIVING_DISC.x - (x - DEAD_DISC.x);
				const my = LIVING_DISC.y + (y - DEAD_DISC.y);
				m[p] = deadMetres(livingMetres(dem, mx, my, landAt(mx, my)), depth);
				dead![p] = 1;
			}
		}
	}
	if (scope === 'world' || scope === 'cosmos') raiseMythPeaks(m, nx, ny, box, land);
	smoothMetres(m, nx, ny, inside, SMOOTH_PASSES);
	/** Extra western passes: the farther west, the softer the ground. */
	if (scope === 'world' || scope === 'cosmos') {
		smoothMetres(m, nx, ny, inside, 2);
		const sx = box.w / (nx - 1);
		for (let j = 0; j < ny; j++) {
			for (let i = 0; i < nx; i++) {
				const p = j * nx + i;
				if (inside && !inside[p]) continue;
				const x = box.x + i * sx;
				const w = westEase(x);
				if (w < 0.05 || !land[p] || m[p] <= 0) continue;
				/** Pull western peaks toward a low rolling mean. */
				m[p] = m[p] * (1 - 0.55 * w) + 180 * w;
			}
		}
		smoothMetres(m, nx, ny, inside, 1);
	}
	if (scope === 'world' || scope === 'cosmos') flattenPads(m, nx, ny, box, land);
	const vert = (VERT[scope] * fit.w) / 50;
	const h = new Float32Array(n);
	let minH = 0;
	let maxH = 0;
	for (let p = 0; p < n; p++) {
		const v =
			m[p] >= 0
				? m[p] * vert
				: dead?.[p]
					? Math.max(m[p], CHASM) * vert
					: Math.max(m[p], DEEP) * SEA_SCALE * vert;
		h[p] = v;
		if (inside && !inside[p]) continue;
		minH = Math.min(minH, v);
		maxH = Math.max(maxH, v);
	}
	const field: ReliefField = { key, scope, box, nx, ny, m, h, inside, minH, maxH };
	fields.set(key, field);
	return field;
}

const insets = new Map<string, ReliefField>();

/**
 * A finer field over the peninsula, at the parent scope's vertical scale, so it
 * sits on that scope's sheet. The cosmos keeps its own coarse grid; this is the
 * ground that appears once the view comes in on Samhan.
 */
export function reliefInset(d: CosmosData, dem: WorldDem, parent: CosmosScope): ReliefField {
	const key = `inset|${projectionVer()}|${parent}|${d.land.length}`;
	const hit = insets.get(key);
	if (hit) return hit;
	if (insets.size > 4) insets.clear();
	const box = scopeFrame('samhan').frame;
	const long = 360;
	const nx = box.w >= box.h ? long : Math.max(2, Math.round((long * box.w) / box.h));
	const ny = box.h >= box.w ? long : Math.max(2, Math.round((long * box.h) / box.w));
	const land = landRaster(d, box, nx, ny);
	const n = nx * ny;
	const m = new Float32Array(n);
	const sx = box.w / (nx - 1);
	const sy = box.h / (ny - 1);
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			m[p] = livingMetres(dem, box.x + i * sx, box.y + j * sy, land[p] === 1);
		}
	}
	smoothMetres(m, nx, ny, null, 1);
	if (parent === 'world' || parent === 'cosmos') flattenPads(m, nx, ny, box, land);
	const { fit } = scopeFrame(parent);
	const vert = (VERT[parent] * fit.w) / 50;
	const h = new Float32Array(n);
	let minH = 0;
	let maxH = 0;
	for (let p = 0; p < n; p++) {
		const v = m[p] >= 0 ? m[p] * vert : Math.max(m[p], DEEP) * SEA_SCALE * vert;
		h[p] = v;
		minH = Math.min(minH, v);
		maxH = Math.max(maxH, v);
	}
	/** `samhan` so the hillshade reads the fine grid, not the parent's wide samples. */
	const field: ReliefField = { key, scope: 'samhan', box, nx, ny, m, h, inside: null, minH, maxH };
	insets.set(key, field);
	return field;
}

/** Height (world units above sea level) under a fish-eyed sheet point, bilinear, clamped to the frame. */
export function heightAt(f: ReliefField, x: number, y: number): number {
	const gx = Math.max(0, Math.min(f.nx - 1.0001, ((x - f.box.x) / f.box.w) * (f.nx - 1)));
	const gy = Math.max(0, Math.min(f.ny - 1.0001, ((y - f.box.y) / f.box.h) * (f.ny - 1)));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const p = j * f.nx + i;
	const g = f.h;
	return (g[p] * (1 - fx) + g[p + 1] * fx) * (1 - fy) + (g[p + f.nx] * (1 - fx) + g[p + f.nx + 1] * fx) * fy;
}

/** Light from the north-west, high: the cartographer's hillshade. */
const SUN = (() => {
	const v = [-1, -1, 1.5];
	const l = Math.hypot(...v);
	return v.map((c) => c / l) as [number, number, number];
})();
/** Vertical exaggeration of the shading per scope: the farther out, the more a range must be pushed to read. */
const EXAG: Record<CosmosScope, number> = { samhan: 7, sphere: 14, world: 22, cosmos: 26 };
/** Kilometres per flat sheet unit near Korea. */
const KM_PER_UNIT = 2;

type Rgb = [number, number, number];
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/**
 * Hypsometric bands, metres → colour and strength over the painted land. Lowlands
 * stay clear so the washes read; the hills brown, the Tibetan tableland a dusty
 * steppe you can see from the cosmos, the summits snow.
 */
const BANDS: { at: number; rgb: Rgb; a: number }[] = [
	{ at: 600, rgb: [150, 130, 96], a: 0 },
	{ at: 1800, rgb: [150, 122, 86], a: 0.22 },
	{ at: 3200, rgb: [168, 140, 98], a: 0.42 },
	{ at: 4200, rgb: [186, 160, 112], a: 0.6 },
	{ at: 5200, rgb: [196, 176, 138], a: 0.66 },
	{ at: 5900, rgb: [244, 248, 255], a: 0.9 }
];

function band(m: number): { rgb: Rgb; a: number } {
	if (m <= BANDS[0].at) return { rgb: BANDS[0].rgb, a: 0 };
	for (let k = 1; k < BANDS.length; k++) {
		const hi = BANDS[k];
		if (m <= hi.at) {
			const lo = BANDS[k - 1];
			const t = (m - lo.at) / (hi.at - lo.at);
			return { rgb: mix(lo.rgb, hi.rgb, t), a: lo.a + (hi.a - lo.a) * t };
		}
	}
	return BANDS[BANDS.length - 1];
}

const shades = new Map<string, ReliefLayers>();

/**
 * The field's rasters at its own resolution, drawn over its frame: `tint` is the
 * hypsometric colour over land and depth over the sea (under the borders); `shade`
 * the hillshade, black where a slope turns from the sun and white where it faces it.
 */
export function reliefPaint(f: ReliefField, light: boolean): ReliefLayers {
	const key = `${f.key}|${light}`;
	const hit = shades.get(key);
	if (hit) return hit;
	if (shades.size > 8) shades.clear();
	const { nx, ny, m } = f;
	const tint = document.createElement('canvas');
	const shade = document.createElement('canvas');
	tint.width = shade.width = nx;
	tint.height = shade.height = ny;
	const ti = tint.getContext('2d')!.createImageData(nx, ny);
	const si = shade.getContext('2d')!.createImageData(nx, ny);
	const metresPerCell = ((f.box.w / (nx - 1)) * KM_PER_UNIT * 1000) / EXAG[f.scope];
	const flat = SUN[2];
	const deep: Rgb = light ? [40, 84, 132] : [2, 22, 40];
	const shelf: Rgb = light ? [214, 234, 244] : [40, 120, 150];
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const p = j * nx + i;
			if (f.inside && !f.inside[p]) continue;
			const v = m[p];
			const o = p * 4;
			if (v > 0) {
				const b = band(v);
				ti.data[o] = b.rgb[0];
				ti.data[o + 1] = b.rgb[1];
				ti.data[o + 2] = b.rgb[2];
				ti.data[o + 3] = b.a * 255;
			} else {
				const t = smooth(-v / 5200);
				const rgb = mix(shelf, deep, t);
				ti.data[o] = rgb[0];
				ti.data[o + 1] = rgb[1];
				ti.data[o + 2] = rgb[2];
				ti.data[o + 3] = (v > -220 ? 0.22 : 0.08 + 0.46 * t) * 255;
			}
			const l = m[j * nx + Math.max(0, i - 1)];
			const r = m[j * nx + Math.min(nx - 1, i + 1)];
			const u = m[Math.max(0, j - 1) * nx + i];
			const dn = m[Math.min(ny - 1, j + 1) * nx + i];
			/** The sea floor shades at a third of the land's strength. */
			const k = v > 0 ? 1 : 0.35;
			const gx = (((r - l) / 2) * k) / metresPerCell;
			const gy = (((dn - u) / 2) * k) / metresPerCell;
			const len = Math.hypot(gx, gy, 1);
			const wx = f.box.x + i * (f.box.w / (nx - 1));
			const west = westEase(wx);
			const shadeAmp = 1 - 0.7 * west;
			const s = (-gx * SUN[0] - gy * SUN[1] + SUN[2]) / len - flat;
			if (s < 0) {
				si.data[o + 3] = Math.min(1, -s * 1.9) * (light ? 150 : 190) * shadeAmp;
			} else {
				si.data[o] = si.data[o + 1] = si.data[o + 2] = 255;
				si.data[o + 3] = Math.min(1, s * 2.2) * (light ? 120 : 70) * shadeAmp;
			}
			if (v > 0 && west > 0.05) {
				ti.data[o + 3] *= 1 - 0.45 * west;
			}
		}
	}
	tint.getContext('2d')!.putImageData(ti, 0, 0);
	shade.getContext('2d')!.putImageData(si, 0, 0);
	const out = { key, tint, shade };
	shades.set(key, out);
	return out;
}
