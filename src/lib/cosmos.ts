/**
 * The known world as Samhan saw it, in the sheet's own units. Inside the sheet's
 * home the projection is the sheet's fit (`project`), so the relief, the outer land
 * and the world layer all line up; farther out it is an even lon/lat grid.
 *
 * Ten civilizations, not dynasties. Near Lands (옆나라) are Samhan, Wa, Hwa and
 * the Northern Nomads. Far Lands (먼나라) are Tibet, India, Persia, Daesik, Rome
 * and the Southern Seas. 이승 and 저승 are the living world and the underworld,
 * not that political split. Goguryeo, Baekje, Silla and Gaya are parts of Samhan.
 * Turks, Khitan and Jurchen are peoples of the Northern Nomads. India's accurate
 * heartland is modern India + Pakistan + Bangladesh. Each civilization has a
 * definite heartland and a softer reach; the reach grows fuzzier farther from Samhan.
 *
 * The map is two semi-attached discs: 이승 and 저승 overlap in a green lens, and
 * that lens is the Western Flower Fields. Washes are static envelopes (the year
 * does not move a civilization's edge). The gold line round Samhan is painted
 * from one fixed year so the slider does not walk it. Pure maths and tables,
 * no DOM: scripts/build-cosmos-layer.mjs imports it.
 */
import { project } from './borders.ts';
import { MAP_TERRAIN } from './mapTerrain.ts';

type Pt = [number, number];
type LonLat = [number, number];

/**
 * Near Korea the projection is the sheet's own quadratic fit (`project`), so the
 * relief, the borders and the gold line agree. Far from it that quadratic bends
 * (Europe tilts north, the Arctic tears), so it blends into the fit's linearisation
 * at Korea: an even lon/lat grid, the same scale and orientation as the sheet.
 * A fish-eye then enlarges home the way the old Korean world maps do: China, Korea
 * and Japan drawn large and true to shape, the lands shrinking and bending the
 * farther west they lie. The rim of 이승 stays put, so Europe and Africa still run
 * on into the biomes and the lens.
 */
const HOME_LL: LonLat = [127, 38];
/** Degrees from Korea where the blend starts and ends. */
const BLEND = [12, 30] as const;
/**
 * Fish-eye strengths: how many times the home core is enlarged. The core (China,
 * Korea, Japan) is only scaled, never bent; between it and the rim of 이승 the
 * scale eases down, so distortion grows the farther a land lies from home.
 */
export type FishEyeId = 'off' | 'soft' | 'mid' | 'hard';

export const FISH_EYES: readonly {
	id: FishEyeId;
	en: string;
	ko: string;
	/** 1 = flat; the core's enlargement. */
	m: number;
}[] = [
	{ id: 'off', en: 'Flat', ko: '평면', m: 1 },
	{ id: 'soft', en: 'Soft', ko: '약', m: 1.35 },
	/** Softer than before so Mid still leaves Rome readable on the west rim. */
	{ id: 'mid', en: 'Mid', ko: '중', m: 1.55 },
	{ id: 'hard', en: 'Hard', ko: '강', m: 2.15 }
];

/** Places the core must hold whole: the edges of China, Korea and Japan. */
const CORE_LL: readonly LonLat[] = [
	[103.8, 36],
	[104, 30.6],
	[102.7, 25],
	[108, 22],
	[110, 19],
	[113, 23],
	[121.5, 31],
	[116.4, 39.9],
	[126.6, 45.7],
	[131.9, 43.1],
	[143, 43.5],
	[141, 38],
	[130.5, 31],
	[126.5, 33.4]
];
/** Breathing room round the core, and how far toward the rim of 이승 the enlarged core may reach. */
const CORE_PAD = 1.06;
const CORE_REACH = 0.93;
/** Share of the ring's average squeeze kept right at the rim, so the far west never flattens to a line. */
const RIM_KEEP = 0.55;

const FISH_BY_ID = Object.fromEntries(FISH_EYES.map((f) => [f.id, f])) as Record<FishEyeId, (typeof FISH_EYES)[number]>;

let fishEyeKind: FishEyeId = 'mid';

/** The fish-eye currently shaping `cosmosProject`. */
export function fishEyeOf(): FishEyeId {
	return fishEyeKind;
}

/** Pick a fish-eye strength (map chrome calls this; paint caches key on `projectionVer`). */
export function setFishEye(id: FishEyeId) {
	if (FISH_BY_ID[id]) fishEyeKind = id;
}

export function isFishEye(id: string): id is FishEyeId {
	return id in FISH_BY_ID;
}

const D = 0.01;
const [J0x, J0y] = project(HOME_LL[0], HOME_LL[1]);
const JAC = (() => {
	const [ex, ey] = project(HOME_LL[0] + D, HOME_LL[1]);
	const [wx, wy] = project(HOME_LL[0] - D, HOME_LL[1]);
	const [nx, ny] = project(HOME_LL[0], HOME_LL[1] + D);
	const [sx, sy] = project(HOME_LL[0], HOME_LL[1] - D);
	return { xu: (ex - wx) / (2 * D), yu: (ey - wy) / (2 * D), xv: (nx - sx) / (2 * D), yv: (ny - sy) / (2 * D) };
})();

/** Base of the projection bake; the live fish-eye id is appended by `projectionVer`. */
const PROJECTION_BASE = 'grid-4-arabia-west';

/** Paint-cache key for the live projection (base + fish-eye). */
export function projectionVer(): string {
	return `${PROJECTION_BASE}+${fishEyeKind}`;
}

/** @deprecated Prefer `projectionVer()` — kept so older imports keep compiling. */
export const PROJECTION_VER = PROJECTION_BASE;

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * Geography disc the world DEM and fish-eye were built against. Keep fixed so
 * topography stays locked to the painted coasts; `LIVING_DISC` may grow east for myth.
 */
const LIVING_BAKE = { x: -2733, y: 700, r: 4234 };
/** Soft northward lift (sheet units) of the Southern Seas / Indonesia band. */
const INDO_LIFT = 240;

/** Distance from (ox, oy), inside the fish-eye disc, to its rim along the unit ray (ux, uy). */
function rimFrom(ox: number, oy: number, ux: number, uy: number): number {
	const d = LIVING_BAKE;
	const px = ox - d.x;
	const py = oy - d.y;
	const b = px * ux + py * uy;
	return -b + Math.sqrt(Math.max(0, b * b - (px * px + py * py) + d.r * d.r));
}

/** Flat-sheet lift that slides Indonesia / Namyang north so the Ten Peoples band reads flatter. */
function southSeasLift(x: number, y: number): Pt {
	const along = smooth((y - 1650) / 1000) * smooth((y - 3200) / -700 + 1);
	const across = smooth((x + 1100) / 500) * smooth((1200 - x) / 500);
	const t = along * across;
	return t > 0.001 ? [x, y - INDO_LIFT * t] : [x, y];
}

/**
 * Widen Arabia at the Red Sea's expense of NE Africa so Daesik reads as a real
 * peninsula under Mid fish-eye (not a thin spike). Applied in lon/lat before the grid.
 */
function nearEastWiden(lon: number, lat: number): LonLat {
	const band = smooth((lat - 11) / 3) * smooth((33 - lat) / 3);
	if (band < 0.01 || lon < 22 || lon > 62) return [lon, lat];
	/** Red Sea axis slides west into Africa; Arabia expands from the new seam. */
	const seam = 38 - 2.8 * band;
	if (lon >= 36) {
		const stretch = 1 + 0.42 * band;
		return [seam + (lon - 38) * stretch, lat];
	}
	/** Nile / Red Sea west shore compresses west a little. */
	const pull = 2.2 * band * smooth((lon - 22) / 14);
	return [lon - pull, lat];
}

/** Inverse of `southSeasLift` (a few Newton steps). */
function southSeasUnlift(x: number, y: number): Pt {
	let y0 = y;
	for (let i = 0; i < 5; i++) {
		const [, yw] = southSeasLift(x, y0);
		y0 += y - yw;
	}
	return [x, y0];
}

/**
 * The live fish-eye: the home core (centre c, radius r0, flat units) is scaled m
 * times about c and set down at q, slid toward the middle of 이승 just enough to
 * fit inside its rim.
 */
type Lens = { m: number; cx: number; cy: number; r0: number; qx: number; qy: number };

const CORE = (() => {
	let core: { cx: number; cy: number; r0: number } | null = null;
	return () => {
		if (core) return core;
		const pts = CORE_LL.map(([lon, lat]) => cosmosBase(lon, lat));
		/** Bădoiu–Clarkson: step toward the farthest point; converges on the smallest enclosing circle. */
		let [cx, cy] = pts[0];
		for (let i = 1; i < 2000; i++) {
			let far = pts[0];
			let fd = -1;
			for (const p of pts) {
				const d = Math.hypot(p[0] - cx, p[1] - cy);
				if (d > fd) {
					fd = d;
					far = p;
				}
			}
			cx += (far[0] - cx) / (i + 1);
			cy += (far[1] - cy) / (i + 1);
		}
		const r0 = CORE_PAD * Math.max(...pts.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
		core = { cx, cy, r0 };
		return core;
	};
})();

const lenses = new Map<FishEyeId, Lens | null>();

function lensOf(): Lens | null {
	if (lenses.has(fishEyeKind)) return lenses.get(fishEyeKind)!;
	const { m } = FISH_BY_ID[fishEyeKind];
	let lens: Lens | null = null;
	if (m > 1) {
		const { cx, cy, r0 } = CORE();
		const d = LIVING_BAKE;
		const ox = cx - d.x;
		const oy = cy - d.y;
		const off = Math.hypot(ox, oy);
		const room = Math.max(0, d.r * CORE_REACH - m * r0);
		const s = off > room ? room / off : 1;
		lens = { m, cx, cy, r0, qx: d.x + ox * s, qy: d.y + oy * s };
	}
	lenses.set(fishEyeKind, lens);
	return lens;
}

/**
 * The ring's ease from the core's edge (v = 0) to the rim (v = 1): leaves the core
 * at slope k, so the scale is continuous there, and still keeps slope ≥ λ at the rim.
 */
function ringEase(k: number): { lam: number; p: number } {
	const lam = Math.min(RIM_KEEP, k / 2);
	return { lam, p: (k - lam) / (1 - lam) };
}
const ease = (v: number, { lam, p }: { lam: number; p: number }) => lam * v + (1 - lam) * (1 - (1 - v) ** p);

/** One ray of the ring, from the core's centre along angle θ: the enlarged core's edge B, the rim point E, the flat run. */
function ray(L: Lens, th: number) {
	const ux = Math.cos(th);
	const uy = Math.sin(th);
	const R = rimFrom(L.cx, L.cy, ux, uy);
	const bx = L.qx + L.m * L.r0 * ux;
	const by = L.qy + L.m * L.r0 * uy;
	const ex = L.cx + R * ux;
	const ey = L.cy + R * uy;
	const len = Math.hypot(ex - bx, ey - by);
	return { ux, uy, R, bx, by, ex, ey, len, shape: ringEase((L.m * (R - L.r0)) / len) };
}

/**
 * Flat sheet point → the fish-eyed sheet. Inside the core: a pure enlargement, so
 * China, Korea and Japan keep their shapes. Outside: each ray from the core's centre
 * runs from the enlarged core's edge to the fixed rim of 이승, squeezing more toward it.
 * Indonesia is soft-lifted north first so the Ten Peoples band sits more horizontally.
 */
export function fishEye(x: number, y: number): Pt {
	[x, y] = southSeasLift(x, y);
	const L = lensOf();
	if (!L) return [x, y];
	const dx = x - L.cx;
	const dy = y - L.cy;
	const r = Math.hypot(dx, dy);
	if (r <= L.r0) return [L.qx + L.m * dx, L.qy + L.m * dy];
	const a = ray(L, Math.atan2(dy, dx));
	if (r >= a.R) return [x, y];
	const s = ease((r - L.r0) / (a.R - L.r0), a.shape);
	return [a.bx + (a.ex - a.bx) * s, a.by + (a.ey - a.by) * s];
}

/** Fish-eyed sheet point → the flat sheet (to read flat data, such as the peninsula's relief). */
export function unfishEye(x: number, y: number): Pt {
	const L = lensOf();
	if (!L) return southSeasUnlift(x, y);
	const qx = x - L.qx;
	const qy = y - L.qy;
	if (Math.hypot(qx, qy) <= L.m * L.r0) return southSeasUnlift(L.cx + qx / L.m, L.cy + qy / L.m);
	if (Math.hypot(x - LIVING_BAKE.x, y - LIVING_BAKE.y) >= LIVING_BAKE.r) return southSeasUnlift(x, y);
	/** Which ray's segment holds the point: the sign of its cross product flips across it. */
	const side = (th: number) => {
		const a = ray(L, th);
		return (a.ex - a.bx) * (y - a.by) - (a.ey - a.by) * (x - a.bx);
	};
	/** Walk the rays round from the core's centre until one segment brackets the point. */
	const along = (th: number) => {
		const a = ray(L, th);
		return ((x - a.bx) * (a.ex - a.bx) + (y - a.by) * (a.ey - a.by)) / (a.len * a.len);
	};
	const STEPS = 48;
	let lo = NaN;
	let hi = NaN;
	let flo = 0;
	let prev = side(0);
	for (let i = 1; i <= STEPS; i++) {
		const th = (i / STEPS) * Math.PI * 2;
		const f = side(th);
		if (prev * f <= 0) {
			const t = along(th - Math.PI / STEPS);
			if (t > -0.25 && t < 1.25) {
				lo = th - (Math.PI * 2) / STEPS;
				hi = th;
				flo = prev;
				break;
			}
		}
		prev = f;
	}
	if (Number.isNaN(lo)) return southSeasUnlift(x, y);
	for (let i = 0; i < 28; i++) {
		const mid = (lo + hi) / 2;
		const fm = side(mid);
		if (fm * flo <= 0) hi = mid;
		else {
			lo = mid;
			flo = fm;
		}
	}
	const a = ray(L, (lo + hi) / 2);
	const s = Math.min(1, Math.max(0, ((x - a.bx) * (a.ex - a.bx) + (y - a.by) * (a.ey - a.by)) / (a.len * a.len)));
	/** The ease is monotone, so bisect it too. */
	let v0 = 0;
	let v1 = 1;
	for (let i = 0; i < 24; i++) {
		const v = (v0 + v1) / 2;
		if (ease(v, a.shape) < s) v0 = v;
		else v1 = v;
	}
	const r = L.r0 + ((v0 + v1) / 2) * (a.R - L.r0);
	return southSeasUnlift(L.cx + r * a.ux, L.cy + r * a.uy);
}

/** Samples per side of the cached `unfishEye` grid over the bake disc's square. */
const UNFISH_N = 129;
const unfishGrids = new Map<FishEyeId, Float32Array>();

function unfishGrid(): Float32Array {
	let g = unfishGrids.get(fishEyeKind);
	if (g) return g;
	g = new Float32Array(UNFISH_N * UNFISH_N * 2);
	const x0 = LIVING_BAKE.x - LIVING_BAKE.r;
	const y0 = LIVING_BAKE.y - LIVING_BAKE.r;
	const step = (2 * LIVING_BAKE.r) / (UNFISH_N - 1);
	for (let j = 0; j < UNFISH_N; j++) {
		for (let i = 0; i < UNFISH_N; i++) {
			const [fx, fy] = unfishEye(x0 + i * step, y0 + j * step);
			g[(j * UNFISH_N + i) * 2] = fx;
			g[(j * UNFISH_N + i) * 2 + 1] = fy;
		}
	}
	unfishGrids.set(fishEyeKind, g);
	return g;
}

/**
 * `unfishEye` for whole rasters: exact inside the core and past the rim of 이승,
 * bilinear on a cached grid in the ring between, where the warp is smooth.
 */
export function unfishFast(x: number, y: number): Pt {
	const L = lensOf();
	if (!L) return southSeasUnlift(x, y);
	const qx = x - L.qx;
	const qy = y - L.qy;
	if (qx * qx + qy * qy <= (L.m * L.r0) ** 2) return southSeasUnlift(L.cx + qx / L.m, L.cy + qy / L.m);
	if (Math.hypot(x - LIVING_BAKE.x, y - LIVING_BAKE.y) >= LIVING_BAKE.r) return southSeasUnlift(x, y);
	const g = unfishGrid();
	const step = (2 * LIVING_BAKE.r) / (UNFISH_N - 1);
	const gx = Math.max(0, Math.min(UNFISH_N - 1.0001, (x - LIVING_BAKE.x + LIVING_BAKE.r) / step));
	const gy = Math.max(0, Math.min(UNFISH_N - 1.0001, (y - LIVING_BAKE.y + LIVING_BAKE.r) / step));
	const i = Math.floor(gx);
	const j = Math.floor(gy);
	const fx = gx - i;
	const fy = gy - j;
	const at = (a: number, b: number, k: number) => g[(b * UNFISH_N + a) * 2 + k];
	const lerp = (k: number) =>
		(at(i, j, k) * (1 - fx) + at(i + 1, j, k) * fx) * (1 - fy) + (at(i, j + 1, k) * (1 - fx) + at(i + 1, j + 1, k) * fx) * fy;
	return [lerp(0), lerp(1)];
}

/** Where Korea lands under the live fish-eye. */
export const homePoint = (): Pt => fishEye(J0x, J0y);

/** How many times the live fish-eye enlarges the home core (and Korea in it). */
export function fishScale(): number {
	return lensOf()?.m ?? 1;
}

/** Longest straight run, in flat sheet units, before a warped path is split so it can bend. */
const FISH_STEP = 40;

/**
 * An SVG path in flat sheet units (absolute or relative M/L/Z, as the bake and the
 * Samhan sheet write them) → the same outline in fish-eyed sheet units.
 */
export function fishPathData(d: string): string {
	if (!lensOf()) return d;
	const out: string[] = [];
	let x = 0;
	let y = 0;
	let sx = 0;
	let sy = 0;
	const put = (op: string, px: number, py: number) => {
		const [fx, fy] = fishEye(px, py);
		out.push(`${op}${Math.round(fx * 10) / 10},${Math.round(fy * 10) / 10}`);
	};
	for (const seg of d.match(/[MmLlZz][^MmLlZz]*/g) ?? []) {
		const op = seg[0];
		if (op === 'Z' || op === 'z') {
			out.push('Z');
			x = sx;
			y = sy;
			continue;
		}
		const n = (seg.slice(1).match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number);
		const rel = op === 'm' || op === 'l';
		for (let i = 0; i + 1 < n.length; i += 2) {
			const nx = rel ? x + n[i] : n[i];
			const ny = rel ? y + n[i + 1] : n[i + 1];
			if (i === 0 && (op === 'M' || op === 'm')) {
				put('M', nx, ny);
				sx = nx;
				sy = ny;
			} else {
				const steps = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y) / FISH_STEP));
				for (let k = 1; k <= steps; k++) put('L', x + ((nx - x) * k) / steps, y + ((ny - y) * k) / steps);
			}
			x = nx;
			y = ny;
		}
	}
	return out.join('');
}

/** Real (or virtual) lon/lat → flat sheet units, before the fish-eye. The bake stores these. */
export function cosmosBase(lon: number, lat: number): Pt {
	[lon, lat] = nearEastWiden(lon, lat);
	const u = lon - HOME_LL[0];
	const v = lat - HOME_LL[1];
	const gx = J0x + JAC.xu * u + JAC.xv * v;
	const gy = J0y + JAC.yu * u + JAC.yv * v;
	const w = 1 - smooth((Math.hypot(u, v) - BLEND[0]) / (BLEND[1] - BLEND[0]));
	let x = gx;
	let y = gy;
	if (w > 0) {
		const [px, py] = project(lon, lat);
		x = px * w + gx * (1 - w);
		y = py * w + gy * (1 - w);
	}
	return [x, y];
}

/** Real (or virtual) lon/lat → sheet units, through the live fish-eye. */
export function cosmosProject(lon: number, lat: number): Pt {
	return fishEye(...cosmosBase(lon, lat));
}

/** Flat sheet units → lon/lat: `cosmosBase` inverted by Newton, from the even grid's exact inverse. */
export function cosmosUnbase(x: number, y: number): LonLat {
	const det = JAC.xu * JAC.yv - JAC.xv * JAC.yu;
	const dx = x - J0x;
	const dy = y - J0y;
	let lon = HOME_LL[0] + (JAC.yv * dx - JAC.xv * dy) / det;
	let lat = HOME_LL[1] + (-JAC.yu * dx + JAC.xu * dy) / det;
	const e = 1e-3;
	for (let k = 0; k < 16; k++) {
		const [px, py] = cosmosBase(lon, lat);
		const ex = x - px;
		const ey = y - py;
		if (Math.abs(ex) + Math.abs(ey) < 1e-4) break;
		const [ax, ay] = cosmosBase(lon + e, lat);
		const [bx, by] = cosmosBase(lon, lat + e);
		const j0 = (ax - px) / e;
		const j1 = (bx - px) / e;
		const j2 = (ay - py) / e;
		const j3 = (by - py) / e;
		const d = j0 * j3 - j1 * j2;
		lon += (j3 * ex - j1 * ey) / d;
		lat += (-j2 * ex + j0 * ey) / d;
	}
	return [lon, lat];
}

/* —————————————— the two worlds —————————————— */

/** Sheet-space disc. `x` east, `y` south, same units as `cosmosProject`. */
export type Disc = { x: number; y: number; r: number };

/** Axis-aligned sheet box (paint frame, camera frame). */
export type SheetBox = { x: number; y: number; w: number; h: number };

/**
 * 이승: Iberia to Japan on the even grid. The west rim stops about one Atlantic past
 * Iberia, so the mythic western land and the three rivers fit before the lens.
 * North is endless snow, south is open sea; Australia is cut.
 * East pad: room past Japan for the mist arc and the five myth-countries (west rim fixed).
 * Fish-eye + DEM stay on `LIVING_BAKE` so topography does not slide with this pad.
 */
const LIVING_EAST_PAD = 800;
export const LIVING_DISC: Disc = { x: LIVING_BAKE.x + LIVING_EAST_PAD / 2, y: LIVING_BAKE.y, r: LIVING_BAKE.r + LIVING_EAST_PAD / 2 };

/**
 * The world elevation bake (scripts/bake-world-terrain.mjs → static/map-world-terrain.bin):
 * Int16 metres, land and sea floor, over the bake disc's square in flat sheet units.
 * Pinned to `LIVING_BAKE` — never the padded living disc — so hills stay under coasts.
 */
export const WORLD_DEM = {
	x: LIVING_BAKE.x - LIVING_BAKE.r,
	y: LIVING_BAKE.y - LIVING_BAKE.r,
	w: LIVING_BAKE.r * 2,
	h: LIVING_BAKE.r * 2,
	n: 1024
} as const;

/** How far the two worlds overlap: the width of the Western Heavens. */
const LENS_WIDTH = 760;

/**
 * 저승: the same size as 이승, its mirror across the lens. They overlap by the
 * Western Heavens.
 */
export const DEAD_DISC: Disc = { x: LIVING_DISC.x - (2 * LIVING_DISC.r - LENS_WIDTH), y: LIVING_DISC.y, r: LIVING_DISC.r };

/**
 * One circle split on that lens. West of the seam is 저승, east is 이승.
 */
export const HALF_DISC: Disc = {
	x: (LIVING_DISC.x + DEAD_DISC.x) / 2,
	y: 700,
	r: LIVING_DISC.r + (LIVING_DISC.x - DEAD_DISC.x) / 2
};

export type CosmosLayout = 'circles' | 'halves';

export const COSMOS_LAYOUTS: { id: CosmosLayout; en: string; ko: string }[] = [
	{ id: 'circles', en: 'Two circles', ko: '두 원' },
	{ id: 'halves', en: 'Halves', ko: '반원' }
];

export type MythSpot =
	| 'road'
	| 'pavilion'
	| 'heavens'
	| 'flowers'
	| 'yaksu'
	| 'court'
	| 'springs'
	| 'living'
	| 'dead'
	| 'samdo'
	| 'hells'
	| 'baek'
	| 'hwang'
	| 'jeok'
	| 'threefold'
	| 'seventyEight'
	| 'passes'
	| 'coloredRivers'
	| 'bliss'
	| 'hellGate'
	| 'gateway'
	| 'peoples'
	| 'ten';

/** The Western Flower Fields: a meadow at the centre of the Western Heavens lens. */
export function meadow(): { x: number; y: number; rx: number; ry: number } {
	const [x, y] = lensPoint();
	const { north, south } = lensTips();
	const half = (south[1] - north[1]) / 2;
	return { x, y, rx: 210, ry: half * 0.2 };
}

/**
 * @deprecated The Life River is gone — the whole Western Heavens (bar the flower
 * fields) is the Ocean of Life. Kept as a thin helper for label height.
 */
export function riverOfLife(): { y: number; x0: number; x1: number } {
	const m = meadow();
	const y = m.y + m.ry * 0.85;
	const dy = y - LIVING_DISC.y;
	const run = Math.sqrt(Math.max(0, LIVING_DISC.r ** 2 - dy * dy));
	return { y, x0: LIVING_DISC.x - run, x1: DEAD_DISC.x + run };
}

/** Where the roads meet the waters: the lens's east lip at the fields' height. */
const lipX = (disc: Disc, side: 1 | -1, y: number) => disc.x + side * Math.sqrt(Math.max(0, disc.r ** 2 - (y - disc.y) ** 2));

/**
 * 세갈래길 — the living fork before the Western Heavens.
 * Right paradise, left hell, middle Seocheon. The three biomes of 이승 meet here.
 */
export function crossroads(): Pt {
	const y = meadow().y;
	return [lipX(DEAD_DISC, 1, y) + LIVING_WATERS[0].out + 680, y + 220];
}

/**
 * 일흔여덟갈래길 — the Bifrost mouth on the Western Heavens' dead lip.
 * One of seventy-eight ways is the underworld road; the rest open other realms.
 * Not deep inside 저승 past the Samdo.
 */
export function seventyEightAt(): Pt {
	const m = meadow();
	const [lx] = lensPoint();
	return [lipX(LIVING_DISC, -1, m.y) - 180, m.y];
}

/**
 * Centre of the lens where the two discs overlap (the radical axis on the line
 * of centres). The Western Flower Fields sit here.
 */
export function lensPoint(a: Disc = LIVING_DISC, b: Disc = DEAD_DISC): [number, number] {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dist = Math.hypot(dx, dy) || 1;
	const along = (dist * dist + b.r * b.r - a.r * a.r) / (2 * dist);
	return [b.x + (dx / dist) * along, b.y + (dy / dist) * along];
}

/**
 * The two tips of the flower-field lens, where the discs cross.
 * North is the smaller sheet y.
 */
export function lensTips(a: Disc = LIVING_DISC, b: Disc = DEAD_DISC): { north: [number, number]; south: [number, number] } {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const dist = Math.hypot(dx, dy) || 1;
	const ux = dx / dist;
	const uy = dy / dist;
	const along = (dist * dist + a.r * a.r - b.r * b.r) / (2 * dist);
	const h = Math.sqrt(Math.max(0, a.r * a.r - along * along));
	const mx = a.x + ux * along;
	const my = a.y + uy * along;
	const px = -uy;
	const py = ux;
	const north: [number, number] = [mx + px * h, my + py * h];
	const south: [number, number] = [mx - px * h, my - py * h];
	return north[1] <= south[1] ? { north, south } : { north: south, south: north };
}

/** One river bowed around the flower-field lens. Angles are canvas angles (y south). */
export type FieldRiver = {
	id: 'baek' | 'hwang' | 'jeok' | 'samdo';
	disc: Disc;
	r: number;
	a0: number;
	a1: number;
	ccw: boolean;
	/** Where the name stands, clear of the stroke. */
	at: [number, number];
};

const wrap = (a: number) => {
	const t = a % (Math.PI * 2);
	return t < 0 ? t + Math.PI * 2 : t;
};

/**
 * The short bow of `disc` between the lens tips, on `side` of the chord,
 * widened a little so the stroke wraps the tips of the fields.
 */
function fieldBow(disc: Disc, side: 'east' | 'west', widen: number): { a0: number; a1: number; ccw: boolean } {
	const { north, south } = lensTips();
	const aN = Math.atan2(north[1] - disc.y, north[0] - disc.x);
	const aS = Math.atan2(south[1] - disc.y, south[0] - disc.x);
	const sweeps = [
		{ ccw: false, sweep: wrap(aS - aN) },
		{ ccw: true, sweep: wrap(aN - aS) }
	];
	let pick = sweeps[0];
	let best = -Infinity;
	for (const s of sweeps) {
		const mid = s.ccw ? aN - s.sweep / 2 : aN + s.sweep / 2;
		const score = (side === 'east' ? 1 : -1) * Math.cos(mid);
		if (score > best) {
			best = score;
			pick = s;
		}
	}
	const dir = pick.ccw ? -1 : 1;
	return { a0: aN - dir * widen, a1: aN + dir * (pick.sweep + widen), ccw: pick.ccw };
}

/** Point on a bow, `t` from the north tip toward the south tip. */
function bowAt(disc: Disc, r: number, bow: { a0: number; a1: number; ccw: boolean }, t: number): [number, number] {
	const dir = bow.ccw ? -1 : 1;
	const span = dir * (bow.a1 - bow.a0);
	const a = bow.a0 + dir * span * t;
	return [disc.x + Math.cos(a) * r, disc.y + Math.sin(a) * r];
}

/**
 * Rivers around the Western Flower Fields.
 * From 이승, three waters approach the eastern lip of the lens, outermost first:
 * White, then Yellow, then Red against the fields. 황강 is that yellow water.
 * 황천, the Yellow Springs, stays a place deep in 저승 and is not this river.
 * From 저승, one Samdo bows along the western lip.
 */
/**
 * 삼색천, outermost first: three thin waters packed into about the Samdo's width.
 * Their ends fade out, so the names stand near the middle of the bow, stepped down
 * and clear of the crossroads.
 */
const LIVING_WATERS: { id: FieldRiver['id']; out: number; t: number }[] = [
	{ id: 'baek', out: 96, t: 0.3 },
	{ id: 'hwang', out: 80, t: 0.38 },
	{ id: 'jeok', out: 64, t: 0.46 }
];
const SAMDO_OUT = 110;

export function fieldRivers(): FieldRiver[] {
	/** Widen past the tips so the black pad reads tip-to-tip after blur. */
	const east = fieldBow(DEAD_DISC, 'east', 0.42);
	const west = fieldBow(LIVING_DISC, 'west', 0.42);
	const rows: FieldRiver[] = LIVING_WATERS.map((row) => {
		const r = DEAD_DISC.r + row.out;
		const [x, y] = bowAt(DEAD_DISC, r, east, row.t);
		return { id: row.id, disc: DEAD_DISC, r, ...east, at: [x + 140, y] };
	});
	const sr = LIVING_DISC.r + SAMDO_OUT;
	const [sx, sy] = bowAt(LIVING_DISC, sr, west, 0.34);
	rows.push({ id: 'samdo', disc: LIVING_DISC, r: sr, ...west, at: [sx - 200, sy] });
	return rows;
}

/** 삼색천's station: just outside the living bows, up from the fork. */
function coloredRiversAt(): Pt {
	const [x, y] = crossroads();
	return [x - 280, y - 420];
}

/** Where the cosmic names stand, in sheet units. The map only draws `circles`. */
export function layoutSpots(layout: CosmosLayout): Record<MythSpot, [number, number]> {
	const flower = lensPoint();
	const dead = DEAD_DISC;
	const river = Object.fromEntries(fieldRivers().map((r) => [r.id, r.at])) as Record<FieldRiver['id'], [number, number]>;
	const m = meadow();
	const shared = {
		/** The lens's name stands in the row of the two worlds' names, over the notch; the meadow's above the fields; the ocean's name below. */
		heavens: [flower[0], LIVING_DISC.y - LIVING_DISC.r - 160] as [number, number],
		flowers: [m.x, m.y - m.ry * 0.5] as [number, number],
		yaksu: [m.x, m.y + m.ry * 1.15] as [number, number],
		threefold: crossroads(),
		/** Bifrost mouth on the heavens' dead lip — not deep past the Samdo. */
		seventyEight: seventyEightAt(),
		/** 열두고개: Alpine–Balkan range before the three rivers, over the Roman west. */
		passes: cosmosProject(...PASSES_AT),
		/** 삼색천: the three living waters as one station, just outside their bows. */
		coloredRivers: coloredRiversAt(),
		bliss: flipToDead(...cosmosProject(...BLISS_AT)),
		hellGate: flipToDead(...cosmosProject(...HELL_GATE_AT)),
		gateway: flipToDead(...cosmosProject(...GATEWAY_AT)),
		peoples: cosmosProject(...PEOPLES_AT),
		ten: flipToDead(...cosmosProject(...PEOPLES_AT)),
		samdo: river.samdo,
		baek: river.baek,
		hwang: river.hwang,
		jeok: river.jeok,
		pavilion: [flower[0], flower[1] + 640] as [number, number],
		court: [dead.x + 180, dead.y] as [number, number]
	};
	if (layout === 'halves') {
		return {
			...shared,
			living: [300, -1700],
			dead: [dead.x - 700, dead.y + 800],
			hells: [dead.x - 40, dead.y + 80],
			road: [flower[0] - 980, flower[1]],
			springs: [dead.x - 1100, dead.y + 260]
		};
	}
	/** Flowers in the overlap; Samdo stands on the dead lip, the three waters on the living lip. */
	return {
		...shared,
		/** Each world's name stands well above its own circle, off-centre outward to leave the Western Heavens the middle. */
		living: [LIVING_DISC.x + 1400, LIVING_DISC.y - LIVING_DISC.r - 160],
		dead: [dead.x - 1400, dead.y - dead.r - 160],
		hells: [dead.x - 40, dead.y + 80],
		road: [lipX(LIVING_DISC, -1, m.y) - SAMDO_OUT - 320, m.y],
		springs: [dead.x, dead.y + dead.r * 0.6]
	};
}

/** 극락 stands on the mirror of the tundra, 지옥 on Africa's, 명부 on the desert's. */
const BLISS_AT: LonLat = [92, 72];
const HELL_GATE_AT: LonLat = [16, 7];
const GATEWAY_AT: LonLat = [12, 21];
/** The Ten Peoples' name sits just outside their border, north of the steppe. */
const PEOPLES_AT: LonLat = [96, 64];
/** Twelve Mountain Passes: middle of the chain on the western arc, just before the three rivers. */
export const PASSES_AT: LonLat = [-43, 35];

/** Tight box around the discs (padded). Two circles is wide; halves is square. */
export function discsBox(discs: Disc[], pad = 1.06): SheetBox {
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	for (const d of discs) {
		x0 = Math.min(x0, d.x - d.r);
		y0 = Math.min(y0, d.y - d.r);
		x1 = Math.max(x1, d.x + d.r);
		y1 = Math.max(y1, d.y + d.r);
	}
	const cx = (x0 + x1) / 2;
	const cy = (y0 + y1) / 2;
	const w = (x1 - x0) * pad;
	const h = (y1 - y0) * pad;
	return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/** The active silhouette: one disc (halves), or the two breasts (circles). */
export const viewDiscs = (layout: CosmosLayout): Disc[] => (layout === 'halves' ? [HALF_DISC] : [LIVING_DISC, DEAD_DISC]);

/** @deprecated Prefer `viewDiscs`; kept for call sites that want a single framing disc. */
export const viewDisc = (layout: CosmosLayout): Disc =>
	layout === 'halves' ? HALF_DISC : { x: (LIVING_DISC.x + DEAD_DISC.x) / 2, y: (LIVING_DISC.y + DEAD_DISC.y) / 2, r: (LIVING_DISC.r + DEAD_DISC.r) * 0.92 };

/** Heaven hangs over the mountain at the head of the peninsula. */
export const SKY_AT: LonLat = [128.08, 42.0];

/** Tamla (Jeju): the island's pin, and the orange beacon on the 3D cosmos map. */
export const TAMLA_AT: LonLat = [126.55, 33.38];

/** Off-sheet stage sites, at their real coordinates. */
export const ABROAD_AT: Record<string, LonLat> = {
	changan: [108.94, 34.27],
	asuka: [135.82, 34.47]
};

/* —————————————— regions —————————————— */

export type CosmosRegion = 'samhan' | 'hwa' | 'wa' | 'nomads' | 'tibet' | 'india' | 'persia' | 'arabia' | 'rome' | 'sea' | 'other';

/**
 * Nested frames of the same painted sheet, nearer to farther:
 * Samhan (peninsula) → Sphere (문화권) → World (이승) → Cosmos (이승+저승).
 */
export type CosmosScope = 'samhan' | 'sphere' | 'world' | 'cosmos';

/** Wash colours. China and Japan match the sheet's own frontier colours. */
export const REGION_COLOR: Record<CosmosRegion, string> = {
	/** Signature red from world scope on — the peninsula reads as one people. */
	samhan: '#C30000',
	hwa: '#b45309',
	wa: '#ec4899',
	nomads: '#5e5240',
	tibet: '#8a4a5c',
	india: '#c9a227',
	persia: '#2f8f83',
	arabia: '#141414',
	rome: '#7b4fa0',
	sea: '#3f7f9e',
	other: '#6f6354'
};

/**
 * Civilizations Samhan knew by one name whatever dynasty ruled them: one wash,
 * no inner borders. Nomads, Tibet, India, Persia, Daesik and Rome are each one.
 */
export const ONE_NAME: ReadonlySet<CosmosRegion> = new Set(['nomads', 'tibet', 'india', 'persia', 'arabia', 'rome']);

/** The baked world file still says `steppe` for the nomad band. */
export const regionOf = (r: string): CosmosRegion => (r === 'steppe' ? 'nomads' : (r as CosmosRegion));

export type CosmosLabel = {
	id: string;
	/** The region the label names (its colour; with `dynasty`, its largest standing polity's name). */
	region?: CosmosRegion;
	han: string;
	en: string;
	ko: string;
	/** Stable civilization id for the wiki. Defaults to `id` when the label does not switch with the year. */
	nation?: string;
	/** A second name, under the first. Korean reading, then hanja, then the English. */
	epithet?: { han?: string; ko?: string; en: string };
	/** A people of a civilization, drawn as a line under that civilization, never as its own nation. */
	people?: boolean;
	/** The Samhan label: the one civilization the three kingdoms belong to. */
	home?: boolean;
	/** Placed by `layoutSpots` rather than by longitude. */
	spot?: MythSpot;
	/** Where the label stands; a tagged label stands on its polity instead. */
	at?: LonLat;
	/** Seas read as water, not as a country. */
	sea?: boolean;
	/** Show the standing dynasty under the name (the courts change dynasties; Persia, India and Rome do not). */
	dynasty?: boolean;
	/** Stand on each standing polity the data tags with this, named by it. */
	tag?: string;
	/** Within reach of this label, ride on it as a line instead of standing apart. */
	host?: string;
	/** Years shown, both ends included. */
	years?: [number, number];
	/** A protectorate: the court's reach, not its land. */
	protectorate?: boolean;
	/**
	 * Which frames show this label. Default: world + cosmos for civilizations,
	 * sphere alone for tribes / dynasty-as-name, cosmos alone for myth stations.
	 */
	scopes?: CosmosScope[];
	/** One of the two worlds (이승, 저승): the faintest, widest names on the map. */
	realm?: boolean;
	/** A people inside a civilization: drawn, smaller than the parent name. */
	sub?: boolean;
	/** The name in that civilization's own script, set large above the name. */
	native?: string;
	/** Which family of name it is; each family has its own type, and its own colour per name. */
	kind?: CosmosLabelKind;
	/** The text colour of a biome, river or ocean name. */
	tint?: string;
};

export type CosmosLabelKind = 'biome' | 'river' | 'ocean';

/**
 * The names on the wide map. An attested name added here (with `years` when it only
 * held for a while) appears; a `tag` label follows its polity through the data.
 */
export const COSMOS_LABELS: CosmosLabel[] = [
	/**
	 * Sphere: the standing court (Tang, Wa) is the name. World/cosmos: the civilization,
	 * with its hanja as the native glyph.
	 */
	{
		id: 'hwa',
		nation: 'hwa',
		region: 'hwa',
		han: '華夏',
		ko: '화하',
		en: 'Huaxia',
		native: '華夏',
		at: [108, 32.5],
		scopes: ['world', 'cosmos']
	},
	{
		id: 'hwa-court',
		nation: 'hwa',
		region: 'hwa',
		han: '唐',
		ko: '당',
		en: 'Tang',
		dynasty: true,
		at: [108, 32.5],
		scopes: ['sphere']
	},
	/** 왜국 — Yamato / Waeguk. The civilization wash covers Hokkaido; the Yamato state does not yet. */
	{
		id: 'japan-wa',
		nation: 'wa',
		region: 'wa',
		han: '倭國',
		ko: '왜국',
		en: 'Yamato',
		native: '倭國',
		at: [138.5, 36.5],
		scopes: ['world', 'cosmos']
	},
	{
		id: 'wa-court',
		nation: 'wa',
		region: 'wa',
		han: '倭',
		ko: '왜',
		en: 'Wa',
		at: [138.5, 36.5],
		scopes: ['sphere']
	},
	{
		id: 'northern-nomads',
		nation: 'northern-nomads',
		region: 'nomads',
		han: '北狄',
		ko: '북적',
		en: 'Bukjeok',
		native: '𐱅𐰇𐰼𐰚',
		at: [112, 47.2],
		scopes: ['world', 'cosmos']
	},
	{ id: 'samhan', nation: 'samhan', region: 'samhan', han: '三韓', ko: '삼한', en: 'Samhan', at: [127.4, 36.6], home: true, scopes: ['sphere', 'world', 'cosmos'] },
	/** Plateau heart (Lhasa-ish); do not ride Cliopatria's tag — that pinned Tobun on the east rim. */
	{ id: 'tubo', nation: 'tubo', region: 'tibet', han: '吐蕃', ko: '토번', en: 'Tobun', native: 'བོད', at: [88, 31.5], scopes: ['world', 'cosmos'] },
	/** Sphere only: the tribes of the northern band, named as the annals name them. */
	{ id: 'turks', nation: 'northern-nomads', region: 'nomads', han: '突厥', ko: '돌궐', en: 'Turks', people: true, tag: 'turks', at: [95, 48], scopes: ['sphere'] },
	{ id: 'khitan', nation: 'northern-nomads', region: 'nomads', han: '契丹', ko: '거란', en: 'Khitan', people: true, at: [120, 44.5], scopes: ['sphere'] },
	{ id: 'mohe', nation: 'northern-nomads', region: 'nomads', han: '靺鞨', ko: '말갈', en: 'Mohe', people: true, at: [130, 45.5], scopes: ['sphere'] },
	{ id: 'sushen', nation: 'northern-nomads', region: 'nomads', han: '肅慎', ko: '숙신', en: 'Sushen', people: true, at: [133, 48], scopes: ['sphere'] },
	{ id: 'anbuk', region: 'hwa', han: '安北都護府', en: 'Anbuk Protectorate', ko: '안북도호부', at: [103.5, 46.5], years: [647, 686], protectorate: true, host: 'northern-nomads', scopes: ['sphere', 'world'] },
	{ id: 'seonu', region: 'hwa', han: '單于都護府', en: 'Seonu Protectorate', ko: '선우도호부', at: [111.5, 41.4], years: [663, 698], protectorate: true, host: 'northern-nomads', scopes: ['sphere', 'world'] },
	{ id: 'andong', region: 'hwa', han: '安東都護府', en: 'Andong Protectorate', ko: '안동도호부', at: [122.6, 42.2], years: [668, 756], protectorate: true, scopes: ['sphere', 'world'] },
	{ id: 'annam', region: 'hwa', han: '安南都護府', en: 'Annam Protectorate', ko: '안남도호부', at: [105.8, 21.2], years: [679, 866], protectorate: true, scopes: ['sphere', 'world'] },
	{ id: 'cheonchuk', nation: 'cheonchuk', region: 'india', han: '天竺', ko: '천축', en: 'Chunchuk', native: 'भारतम्', at: [78, 22], scopes: ['world', 'cosmos'] },
	/** Ērān in Inscriptional Pahlavi, the Sasanian script before the conquest. */
	{ id: 'persia', nation: 'persia', region: 'persia', han: '波斯', ko: '파사', en: 'Pasa', native: '𐭠𐭩𐭫𐭠𐭭', at: [57, 32], scopes: ['world', 'cosmos'] },
	{
		id: 'daesik',
		nation: 'daesik',
		region: 'arabia',
		han: '大食',
		ko: '대식',
		en: 'Daesik',
		native: 'العرب',
		at: [45, 23],
		scopes: ['world', 'cosmos']
	},
	/** Ῥώμη — western edge of the known world: Europe and North Africa. */
	{ id: 'bullim', nation: 'bullim', region: 'rome', han: '拂菻', ko: '불림', en: 'Bulim', native: 'Ῥώμη', at: [12, 42], scopes: ['world', 'cosmos'] },
	{ id: 'eastern-ocean', han: '', ko: '대동양', en: 'Eastern Ocean', at: [150, 22], sea: true, kind: 'ocean', tint: '#a9d4f2', scopes: ['world', 'cosmos'] },
	{ id: 'western-ocean', han: '', ko: '소서양', en: 'Western Ocean', at: [72, -6], sea: true, kind: 'ocean', tint: '#a9d4f2', scopes: ['world', 'cosmos'] },
	{
		id: 'southern-seas',
		nation: 'southern-seas',
		region: 'sea',
		han: '南洋',
		ko: '남양',
		en: 'Namyang',
		native: 'दक्षिणसागर',
		at: [112, 4],
		scopes: ['world', 'cosmos']
	},
	{ id: 'yizhou', region: 'sea', han: '', ko: '이주', en: 'Yizhou', native: 'इयु', at: [121.1, 23.7], sub: true, scopes: ['sphere'] },
	{ id: 'funan', region: 'sea', han: '', ko: '부남', en: 'Funan', native: 'फुनान', at: [105.4, 11], sub: true, scopes: ['sphere'] },
	{ id: 'champa', region: 'sea', han: '', ko: '임읍', en: 'Champa', native: 'चम्पा', at: [108.8, 14.4], sub: true, scopes: ['sphere'] },
	{ id: 'chenla', region: 'sea', han: '', ko: '진랍', en: 'Chenla', native: 'ចេនឡា', at: [104.2, 13], sub: true, scopes: ['sphere'] },
	{ id: 'langkasuka', region: 'sea', han: '', ko: '낭아수', en: 'Langkasuka', native: 'लङ्कासुका', at: [101, 6.6], sub: true, scopes: ['sphere'] },
	{ id: 'barus', region: 'sea', han: '', ko: '바루스', en: 'Barus', native: 'बरुस', at: [98.4, 2.1], sub: true, scopes: ['sphere'] },
	{ id: 'malayu', region: 'sea', han: '', ko: '말라유', en: 'Malayu', native: 'ملايو', at: [103.2, -1.6], sub: true, scopes: ['sphere'] },
	{ id: 'srivijaya', region: 'sea', han: '', ko: '실리불서', en: 'Srivijaya', native: 'श्रीविजय', at: [104.8, -3.1], sub: true, scopes: ['sphere'] },
	{ id: 'suvarna', region: 'sea', han: '', ko: '금주', en: 'Sumatra', native: 'सुवर्णद्वीप', at: [101.2, -0.6], sub: true, scopes: ['sphere'] },
	{ id: 'shepo', region: 'sea', han: '', ko: '사바', en: 'Java', native: 'यवद्वीप', at: [110.6, -7.5], sub: true, scopes: ['sphere'] },
	{ id: 'iseung', nation: 'iseung', han: '', ko: '이승', en: 'Life Realm', spot: 'living', realm: true, scopes: ['cosmos'] },
	{ id: 'jeoseung', nation: 'jeoseung', han: '', ko: '저승', en: 'Death Realm', spot: 'dead', realm: true, scopes: ['cosmos'] }
];

/** Stations on the road west. Placed by `layoutSpots`. Hidden when those places are markers. */
export const MYTH_LABELS: CosmosLabel[] = [
	{ id: 'western-heavens', nation: 'western-heavens', han: '西天', ko: '서천', en: 'Western Heavens', spot: 'heavens', realm: true, scopes: ['cosmos'] },
	{ id: 'flower-fields', nation: 'flower-fields', han: '西天花田', ko: '서천꽃밭', en: 'Western Flower Fields', spot: 'flowers', scopes: ['cosmos'] },
	/** The whole Western Heavens bar the flower fields — Bari's three thousand li of weak water. */
	{ id: 'yaksu', nation: 'yaksu', han: '弱水三千里', ko: '약수', en: 'Ocean of Life', spot: 'yaksu', kind: 'ocean', tint: '#bff0ff', scopes: ['cosmos'] },
	/** Living fork: paradise / hell / Seocheon. */
	{ id: 'threefold-path', nation: 'threefold_path', han: '三岐路', ko: '세갈래길', en: 'Three Way Path', spot: 'threefold', scopes: ['cosmos'] },
	/** Bifrost mouth on the heavens' dead lip — one way is the underworld road. */
	{ id: 'seventy-eight-path', nation: 'seventy_eight_paths', han: '七十八岐路', ko: '일흔여덟갈래길', en: '78 Diverging Roads', spot: 'seventyEight', scopes: ['cosmos'] },
	{ id: 'twelve-passes', nation: 'twelve_passes', han: '十二峠', ko: '열두고개', en: 'Twelve Mountain Passes', spot: 'passes', scopes: ['cosmos'] },
	{ id: 'three-colored-rivers', nation: 'three_colored_rivers', han: '三色川', ko: '삼색천', en: 'Three Colored Rivers', spot: 'coloredRivers', scopes: ['cosmos'] },
	{ id: 'tundra', nation: 'tundra', han: '', ko: '동토', en: 'Tundra', at: [70, 72], kind: 'biome', tint: '#d4e8ff', scopes: ['cosmos'] },
	{ id: 'desert', nation: 'desert', han: '', ko: '사막', en: 'Desert', at: [12, 21], kind: 'biome', tint: '#f3d58e', scopes: ['cosmos'] },
	{ id: 'ten-peoples', nation: 'ten-peoples', han: '', ko: '열 겨레', en: 'Ten Peoples', spot: 'peoples', scopes: ['cosmos'] },
	{ id: 'ten-hells', nation: 'ten-hells', han: '十大地獄', ko: '십대지옥', en: 'Ten Hells', spot: 'ten', scopes: ['cosmos'] },
	/** The biomes in the mirror: the tundra's is Bliss, Africa's Pain, the desert's the Gateway. */
	{ id: 'bliss', nation: 'bliss', han: '極樂', ko: '극락', en: 'Bliss', spot: 'bliss', kind: 'biome', tint: '#e6d6a6', scopes: ['cosmos'] },
	{ id: 'hell-gate', nation: 'hell-gate', han: '地獄', ko: '지옥', en: 'Pain', spot: 'hellGate', kind: 'biome', tint: '#ef8a72', scopes: ['cosmos'] },
	{ id: 'gateway', nation: 'gateway', han: '冥府', ko: '명부', en: 'Gateway', spot: 'gateway', kind: 'biome', tint: '#c7b4dc', scopes: ['cosmos'] },
	/** The three waters of the living approach, outermost first. 황강 is not the Yellow Springs. */
	{ id: 'baek', nation: 'baek', han: '白川', ko: '백천', en: 'White River', spot: 'baek', kind: 'river', tint: '#f2f7fd', scopes: ['cosmos'] },
	{ id: 'hwang-river', nation: 'hwang-river', han: '黃江', ko: '황강', en: 'Yellow River', spot: 'hwang', kind: 'river', tint: '#f2c14e', scopes: ['cosmos'] },
	{ id: 'jeok', nation: 'jeok', han: '赤川', ko: '적천', en: 'Red River', spot: 'jeok', kind: 'river', tint: '#f08080', scopes: ['cosmos'] },
	{ id: 'samdo', nation: 'samdo', han: '三途川', ko: '삼도천', en: 'Samdo River', spot: 'samdo', kind: 'river', tint: '#9fd4f0', scopes: ['cosmos'] },
	{ id: 'yellow-springs', nation: 'yellow-springs', han: '黃泉', ko: '황천', en: 'The Yellow Springs', spot: 'springs', scopes: ['cosmos'] },
	/**
	 * Classical eastern myth-countries past the Pacific mist (산해경 / 해동지도 style).
	 * Soft overlays only — not in LAND_ADDS — so real geography stays untouched.
	 */
	{ id: 'yugwiguk', han: '流鬼國', ko: '유귀국', en: 'Land of Drifting Ghosts', at: [158, 62], scopes: ['world', 'cosmos'] },
	{ id: 'moinguk', han: '毛人國', ko: '모인국', en: 'Land of Hairy Beasts', at: [160, 50], scopes: ['world', 'cosmos'] },
	{ id: 'janginguk', han: '長人國', ko: '장인국', en: 'Land of Giant Men', at: [162, 38], scopes: ['world', 'cosmos'] },
	{ id: 'sasoguk', han: '沙小國', ko: '사소국', en: 'Land of Sand Dwarves', at: [160, 25], scopes: ['world', 'cosmos'] },
	{ id: 'siiguk', han: '豕耳國', ko: '시이국', en: 'Land of Pig Ears', at: [156, 14], scopes: ['world', 'cosmos'] }
];

/** Persia's heartland: the plateau and Mesopotamia. Its year shapes are cut to it, conquest or not. */
export const PERSIA_LANDS: LonLat[] = [
	[42, 37], [46, 39.5], [52, 38.5], [58, 36.5], [63, 32], [63, 26], [58, 25], [52, 26.5], [46, 30], [43, 33], [42, 35.5]
];

/* —————————————— civilization spheres —————————————— */

/**
 * A civilization's sphere. Its generous `core` seeds it; every known land pixel
 * then belongs to the nearest core within `reach` degrees, so neighbours share a
 * border and nothing is left between them. Only land is painted, except for a
 * seafaring sphere, whose core's water is its own too.
 */
export type CivSphere = {
	/** The label id this sphere belongs to. */
	id: string;
	region: CosmosRegion;
	core: LonLat[];
	/** Degrees past the core's own land the sphere may spread over land. */
	reach: number;
	/** Seafaring: the core's water belongs to the sphere. */
	sea?: boolean;
	/** Holds its land against neighbours but is not washed (the gold line is Samhan's edge). */
	quiet?: boolean;
	/** Washed again over the terrain: a dark colour that sand would otherwise bury. */
	over?: boolean;
};

/** Goguryeo's Liaodong and the Buyeo plain down to Tamla: no neighbour's wash crosses it. */
export const SAMHAN_CORE: LonLat[] = [
	[121.8, 40.6], [122.3, 41.8], [123.5, 43.2], [125.5, 44.3], [127.5, 44.5], [129.5, 44], [131, 43],
	[130.8, 42.4], [130, 40], [129.6, 37], [129.5, 35], [128, 34.2], [126, 33], [124.5, 34], [124.5, 37.5],
	[124, 39.4], [122.5, 39], [121, 38.8]
];

/**
 * Japan civilization: Kyushu, Shikoku, Honshu and Hokkaido. Hokkaido is inside the
 * civilizational wash; the Yamato / Wa *state* of this story's years still stops
 * short of it (Cliopatria borders), so the Emishi north is wash without a state line.
 */
const WA_CORE: LonLat[] = [
	[129.5, 31], [129.6, 33.6], [131, 34.6], [133, 35.7], [136, 36.3], [137, 37.6], [139.5, 38.6],
	[140, 40.5], [141.4, 41.5], [141.8, 43.2], [145.2, 44.2], [145.5, 45.5], [143.2, 45.6],
	[141.2, 45.4], [140.2, 44.2], [139.6, 42.8], [140.2, 41.4], [142.2, 39.5], [141, 37],
	[140.9, 35.5], [139.9, 34.8], [138.5, 34.5], [136.8, 33.4], [135, 33.4], [132.8, 32.6],
	[131.5, 31], [130.5, 30.8]
];

/** China proper from the Gansu corridor to the coast, and Annam down to the Ngang pass. */
const HWA_CORE: LonLat[] = [
	[93.5, 39.8], [97, 40.5], [100, 41.2], [104, 41.6], [108, 41.2], [111, 41.5], [114, 41.3], [117, 41],
	[119.5, 41.2], [121.3, 40.9], [121.3, 39.6], [122.8, 38.5], [123, 35], [122.5, 30.5], [121, 26.5],
	[118, 23.5], [114.5, 21.3], [111, 20], [110.5, 18], [108.5, 18], [106.5, 18.3], [105.5, 19.5],
	[104, 21.5], [103, 22.6], [101.5, 22.6], [100, 24.3], [99, 26.5], [100.5, 28.5], [102, 30.5],
	[102.5, 32.5], [101.5, 34.5], [99.5, 36.5], [97, 38.5]
];

/** The plateau, Kham and the Himalayan wall. */
const TIBET_CORE: LonLat[] = [
	[72.5, 36.5], [75.5, 37.2], [79, 36.2], [84, 36.3], [89, 36.6], [94, 36.8], [98, 37.5], [101, 36.3],
	[102, 33.8], [101.5, 31], [100, 28.3], [98.8, 26.5], [97.5, 27.5], [95.5, 28.2], [92, 27.3], [89, 27.3],
	[86, 27.6], [83, 28.6], [80.5, 29.8], [78.5, 31.3], [76.5, 33], [74, 34.8]
];

/**
 * Greater India heartland ≈ modern India + Pakistan + Bangladesh (and the near
 * Himalayan wall). Sri Lanka stays in the civilizational reach via `reach`.
 */
const INDIA_CORE: LonLat[] = [
	[61.2, 25.1], [62.5, 28.2], [66.5, 30.2], [69.5, 31.5], [71.2, 33.8], [73.2, 36.2], [74.8, 37],
	[77.5, 35.5], [79.2, 32.8], [81, 30.5], [83.5, 29.2], [86.5, 28.2], [88.8, 27.8], [91.2, 27.2],
	[92.6, 26.5], [92.5, 24.8], [91.8, 22.8], [91.5, 21.2], [90.2, 21.8], [88.5, 21.6], [87, 20.8],
	[85, 19.5], [82.5, 16.5], [80.5, 13.2], [79.5, 10.5], [78.2, 8.2], [77.5, 8], [76.2, 10],
	[74.5, 13.5], [73.2, 16.5], [72.5, 19.5], [71.2, 21.2], [69.5, 22.8], [67.2, 24], [64.5, 24.8],
	[62.5, 24.6]
];

/** Southern Seas: mainland Southeast Asia south of Annam, the straits, the islands, Taiwan, and their seas. */
const NAMYANG_CORE: LonLat[] = [
	[93.5, 20], [96, 22], [99, 21.8], [101.8, 21.6], [103.5, 20.8], [105.4, 19.4], [106.8, 18.1],
	[108.2, 17], [110, 17.5], [113, 16], [117, 19], [120.5, 21.8], [121.5, 25.4], [123.2, 25.3],
	[124.5, 21], [126.5, 14], [130, 8], [135, 3], [141, -2.5], [141, -9.5], [132, -10.5], [124, -11.8],
	[115, -10.5], [105, -8], [98, -2], [94, 4], [92.5, 8], [93, 13], [94, 16]
];

/** Greater Iran: Armenia, Mesopotamia, the plateau, Khorasan, Afghanistan and Transoxiana. */
const PERSIA_CORE: LonLat[] = [
	[38, 41.5], [41.5, 43], [45, 43], [48, 42.5], [50.5, 40.5], [53, 41], [56, 42.5], [60, 43.8],
	[64, 43.5], [68, 42.5], [71.5, 41.5], [73.5, 39.5], [74.5, 37], [72, 35.3], [71, 33], [69.5, 30.5],
	[67.5, 28], [66.5, 25.5], [62, 25.2], [57.5, 25.6], [54, 26.5], [51, 27.8], [49, 29.8], [48, 30.5],
	[46.5, 30.5], [44.5, 31.5], [42, 33.5], [40, 35.5], [38.5, 37], [37.5, 38.5]
];

/** Daesik, Arabia in its own right: the whole peninsula, Sinai to Oman and Yemen. */
const ARABIA_CORE: LonLat[] = [
	[34.6, 29.6], [36.4, 31.6], [39, 32.6], [42, 31.6], [45, 30.6], [47.6, 30], [50.2, 27.4], [51.6, 24.6],
	[54.2, 24.1], [56.3, 26.4], [59.8, 22.6], [58.2, 18.9], [55.2, 17], [52.2, 15.7], [48.6, 14], [45, 12.6],
	[43.2, 12.7], [42.7, 15.6], [40.6, 19.6], [38.8, 22.4], [37, 25.8], [35.6, 27.6]
];

/**
 * Greater Rome as the western edge of the known world: Britain and the Rhine in the
 * north, Iberia to Anatolia, and the whole of North Africa down through the Sahara
 * to the Sahel. Arabia and the Horn stay out — the south edge turns west at Sinai.
 */
const ROME_CORE: LonLat[] = [
	[-8, 58.2], [-5, 58.6], [-2, 57.4], [0.5, 54], [1.2, 52.2], [2.5, 51.2], [4.5, 52.8], [7, 53.6],
	[9.5, 54.2], [12, 54.8], [14.5, 54.2], [17, 53], [19.5, 51.5], [22, 49.5], [25, 48], [28, 47],
	[30, 45.5], [32, 43.5], [35, 42.5], [38, 41.5], [39.5, 40.5], [39.5, 38.5], [38.5, 37], [37.2, 36.5],
	[36.6, 35], [35.5, 32], [34.2, 28], [33, 24], [32, 20], [30, 16.5],
	[24, 15.5], [16, 15.5], [8, 16], [0, 16.5], [-6, 17.5], [-10, 20],
	[-12, 26], [-12, 32], [-11, 37], [-9.5, 42], [-8, 44], [-6, 46], [-5, 48], [-5, 51], [-6, 54], [-7, 56.5]
];

/**
 * The Türk khaganate's steppe band at its height: the Black Sea steppe and the Volga,
 * the Kazakh grass, Dzungaria and the Tarim, the Altai, Mongolia up to Baikal, and
 * east to the Greater Khingan. Manchuria's forests stay outside it.
 */
const NOMAD_CORE: LonLat[] = [
	[28, 46.6], [30, 48.2], [33, 50.2], [38, 51.8], [44, 53.4], [50, 54.6], [56, 55], [62, 54.8],
	[68, 54.6], [74, 54.4], [80, 53.4], [85, 52.2], [89, 51.2], [94, 51.8], [99, 52.4], [104, 53.2],
	[109, 53.4], [113, 52.4], [117, 50.8], [120, 49.6], [122.2, 47.6], [122.4, 45.6], [121.2, 43.4],
	[118.5, 42.3], [114, 41.6], [108, 41.4], [101, 41.4], [96, 41.2], [92, 40.2], [88, 39], [84, 38.6],
	[80, 38], [76.5, 38.4], [74.5, 39.6], [72.5, 41.8], [68, 43.4], [64, 44.1], [60, 44.5], [56.5, 43.8],
	[53, 44.6], [50.5, 45.2], [47.5, 44.2], [45, 43.6], [42, 44.4], [39, 45.2], [36, 45.4], [33, 45.9],
	[30.5, 46.2]
];

/** First match wins where cores overlap, so the smaller, firmer cores come first. */
export const CIV_SPHERES: CivSphere[] = [
	{ id: 'samhan', region: 'samhan', core: SAMHAN_CORE, reach: 1, quiet: true },
	{ id: 'japan-wa', region: 'wa', core: WA_CORE, reach: 0.6 },
	{ id: 'hwa', region: 'hwa', core: HWA_CORE, reach: 4 },
	{ id: 'tubo', region: 'tibet', core: TIBET_CORE, reach: 5 },
	{ id: 'cheonchuk', region: 'india', core: INDIA_CORE, reach: 4 },
	{ id: 'southern-seas', region: 'sea', core: NAMYANG_CORE, reach: 3, sea: true },
	{ id: 'persia', region: 'persia', core: PERSIA_CORE, reach: 5 },
	{ id: 'daesik', region: 'arabia', core: ARABIA_CORE, reach: 1.5, over: true },
	{ id: 'bullim', region: 'rome', core: ROME_CORE, reach: 6, over: true },
	{ id: 'northern-nomads', region: 'nomads', core: NOMAD_CORE, reach: 2.5 }
];

/**
 * How far the mythic west runs, in degrees. Just past the life-disc rim, into the
 * flower-field lens — not a second continent across the underworld.
 */
const WEST_LON = -36;

/**
 * The mythic west: Koreans knew no Atlantic. Europe runs on as one land into the
 * Western Heavens — Britain in the north, the Maghreb sliding a short way west
 * with no Atlantic coast. Past that the south of the sheet is the western ocean.
 */
export const WEST_LANDS: LonLat[] = [
	[20, 72], [14, 70], [8, 68], [2, 66], [-2, 64], [-6, 62], [-8, 60], [-9, 58], [-8, 55], [-6, 53],
	[-4, 51], [-2, 49.5], [-1, 48], [-3, 46.5], [-5, 45], [-8, 43.5], [-9.5, 41], [-10, 38],
	/** Maghreb: a short run west into the flower fields, no Atlantic notch. */
	[-24, 34], [WEST_LON, 30], [WEST_LON, 160], [20, 160]
];

/**
 * From Nigeria south along the Gulf: that coast does not exist. The land continues
 * a short way west and joins the flower fields. The Cape stays ocean.
 */
export const GULF_LAND: LonLat[] = [
	[14, 17], [6, 15], [-4, 14], [-16, 16], [WEST_LON, 16], [WEST_LON, 0], [18, 0], [18, 6], [12, 12], [14, 17]
];

/**
 * Lands no civilization claims: Africa south of Bulim's Sahara, the
 * snowy north, and Australia. The Horn is ocean.
 */
export const UNKNOWN_LANDS: LonLat[][] = [
	[
		/** Africa past Bulim's Sahara, closed just west of the gulf — no Atlantic coast, no Horn. */
		[WEST_LON, 14], [-6, 14.2], [4, 14.6], [14, 14.8], [24, 14.4], [32, 13.6], [36, 12],
		[40, 10], [38, 6], [30, 3.5], [18, 2.2], [WEST_LON, 2]
	],
	[
		[-30, 55], [-5, 56.5], [5, 57.5], [12, 55.5], [22, 55.5], [32, 56], [45, 57], [60, 57.5], [75, 56],
		[90, 55.5], [105, 54.5], [120, 54], [135, 53], [145, 51], [160, 50], [200, 50], [200, 160], [-30, 160]
	],
	WEST_LANDS
];

/**
 * Desert, one of the three biomes of 이승: the Sahara from the Atlas down through the
 * Sahel to Lake Chad's latitude, and the Arabian sand. Its way leads to the flower fields.
 */
export const DESERT_LANDS: LonLat[][] = [
	[
		[WEST_LON, 18], [-8, 18.2], [2, 18.6], [12, 18.2], [22, 17.4], [30, 16.2], [34, 15],
		[36, 14], [33, 13.4], [27, 12.6],
		[21, 12.2], [15, 12.4], [9, 12.8], [3, 13.2], [-4, 13.4], [-11, 13.8], [-17.5, 14.2], [WEST_LON, 14.2]
	],
	[
		[34.8, 29.4], [37, 30.8], [40, 31.8], [43, 31], [46, 30], [48, 29.8], [50.5, 27], [56, 26.2],
		[59.8, 22.5], [57, 18], [52, 15.5], [45, 12.5], [43, 12.6], [42.5, 15], [39, 21], [36.5, 26], [34.8, 28]
	]
];

/**
 * @deprecated Forest biome removed — Africa south of the Sahara is ordinary land into the west.
 * Kept as an empty list so older imports compile.
 */
export const JUNGLE_LANDS: LonLat[][] = [];

/** Africa and the short run into the flower fields: mirrored, the way down into 지옥. No Atlantic west coast. */
export const AFRICA_LANDS: LonLat[] = [
	[WEST_LON, 32], [-12, 34], [-6, 35.8], [10, 37], [11, 33.4], [20, 31], [32, 31.4], [34.5, 28], [38, 21],
	[40, 14], [36, 8], [28, 4], [16, 2.2], [0, 2], [WEST_LON, 2]
];

/**
 * Twelve Mountain Passes: five differently shaped masses along the western rim of
 * the life disc, mirroring the five eastern lands. They cover the arc of the
 * Western Heavens just inside the three colored rivers.
 */
export const PASSES_RANGE: LonLat[][] = [
	/** Long low ridge, the northern gate of the arc. */
	[
		[-43.6, 55.4], [-36, 57.6], [-26, 56.8], [-20, 54.4], [-24, 52.2], [-36, 52], [-43.8, 53.6]
	],
	/** Tall narrow mass, leaning toward the rim. */
	[
		[-45.2, 49.2], [-34, 51], [-22, 48.4], [-18, 44.2], [-22, 41.6], [-36, 41.4], [-45.4, 44.6], [-45.2, 47.6]
	],
	/** Wedge, point toward the known world, fat side on the rim. */
	[
		[-18, 38.4], [-30, 40], [-45.2, 37.4], [-46.2, 34.2], [-44.6, 31.6], [-30, 31.2], [-20, 34.2]
	],
	/** Rounded triangle, point to the south. */
	[
		[-22, 29], [-32, 30.6], [-44.6, 28.2], [-45.2, 24.4], [-40, 20], [-26, 19.6], [-20, 23.4]
	],
	/** Crescent opening east, the last climb before the rivers. */
	[
		[-24, 16.8], [-34, 17.8], [-41.6, 16.2], [-42.2, 13.2], [-40, 9], [-28, 8], [-22, 11], [-22, 14.4]
	]
];

/**
 * Tundra, the first biome of 이승: Scandinavia and the far north of Europe and Siberia.
 * Its cold way leads to Bliss.
 */
export const SNOW_LANDS: LonLat[][] = [
	[
		[-12, 58], [-6, 56.8], [2, 57.2], [8, 57.6], [12, 56], [20, 56.2], [30, 56.8], [45, 57.6], [60, 57.2],
		[75, 56.2], [95, 55.2], [110, 54.4], [130, 54.2], [145, 52], [165, 55], [200, 60], [200, 160], [WEST_LON, 160],
		[WEST_LON, 58]
	]
];

/** Tibetan steppe / highland: the plateau itself (brown-grey grass, not jungle). */
export const STEPPE_LANDS: LonLat[][] = [
	[
		[73, 36], [78, 36.5], [84, 36.5], [90, 36.8], [96, 37], [100, 36], [102, 33.5], [101, 30.5],
		[98, 28], [94, 28], [88, 28.5], [82, 30], [77, 32], [74, 34]
	]
];

/**
 * @deprecated Green East-Asia canopy removed — the sheet stays sand under Samhan / Hwa.
 * Kept empty so older imports compile.
 */
export const EAST_FOREST_LANDS: LonLat[][] = [];

/**
 * The Yellow River and Huai floodplain: Taihang on the west, Yanshan on the north,
 * the Shandong hills on the east, the Huai on the south. A hole in the east-forest
 * canopy so the plain stays the sand of the sheet.
 */
export const NORTH_CHINA_PLAIN: LonLat[][] = [
	[
		[113.6, 40.2], [115.2, 40.4], [116.8, 40.15], [117.9, 39.5], [118.8, 38.6], [119.15, 37.4],
		[118.4, 36.4], [118.9, 35.2], [119.6, 34.2], [118.4, 33.15], [116.2, 32.7], [114.2, 32.55],
		[113.2, 33.4], [112.9, 35.2], [112.7, 37.4], [113.2, 39]
	]
];

/**
 * Himalayan wall: a thin band along Tobun's southern lip —
 * Clash-of-Clans-style peak piles, not a flat biome wash.
 */
export const HIMALAYA_LANDS: LonLat[][] = [
	[
		[74, 34.8], [76, 33.5], [78, 32.1], [80, 30.8], [82, 29.8], [84, 28.9], [86, 28.3], [88, 27.9],
		[90, 27.8], [92, 27.7], [94, 27.9], [96, 28.1], [98, 28.5], [98, 27.6], [96, 27.2], [94, 27],
		[92, 26.9], [90, 27], [88, 27.1], [86, 27.4], [84, 28], [82, 28.9], [80, 29.9], [78, 31.2],
		[76, 32.6], [74, 34]
	]
];

/** The gold Samhan outline is painted for this year only, so the slider leaves it alone. */
export const SAMHAN_GOLD_YEAR = 642;

/* —————————————— the ten hells (저승 as a mirrored mortal world) —————————————— */

export type HellCourt = {
	/** 1–10, Yeomra is the fifth. */
	court: number;
	id: string;
	judge: { han: string; ko: string; en: string };
	hell: { ko: string; en: string };
	/** Material Symbols name drawn bold instead of hanja. */
	icon: string;
	/** The living sphere mirrored into this court (`CIV_SPHERES` id). */
	sphere: string;
	color: string;
	/** Where its name stands, before the mirror. */
	at: LonLat;
	/** Yumla's court is the brightest pit. */
	yumla?: boolean;
};

/**
 * Ten courts ↔ ten peoples, one each.
 * Yeomra (Yumla, 5th) holds Samhan. Raging Winds (9th) holds the Southern Seas
 * (monsoon seafarers). Boiling Cauldrons (2nd) holds India. Blade Trees (4th) holds
 * Daesik, the Land of Metal.
 */
export const TEN_HELLS: HellCourt[] = [
	{
		court: 1,
		id: 'hell-jingwang',
		judge: { han: '秦廣大王', ko: '진광대왕', en: 'King Jingwang' },
		hell: { ko: '도산지옥', en: 'Mountain Knives' },
		icon: 'swords',
		sphere: 'japan-wa',
		color: '#c45a78',
		at: [140, 38.5]
	},
	{
		court: 2,
		id: 'hell-chogang',
		judge: { han: '初江大王', ko: '초강대왕', en: 'King Chogang' },
		hell: { ko: '화탕지옥', en: 'Boiling Cauldrons' },
		icon: 'skillet',
		sphere: 'cheonchuk',
		color: '#d06030',
		at: [78, 22]
	},
	{
		court: 3,
		id: 'hell-songje',
		judge: { han: '宋帝大王', ko: '송제대왕', en: 'King Songje' },
		hell: { ko: '한빙지옥', en: 'Freezing Ice' },
		icon: 'ac_unit',
		sphere: 'tubo',
		color: '#7a9ec8',
		at: [86, 32.5]
	},
	{
		court: 4,
		id: 'hell-ogwan',
		judge: { han: '五官大王', ko: '오관대왕', en: 'King Ogwan' },
		hell: { ko: '검수지옥', en: 'Blade Trees' },
		icon: 'forest',
		sphere: 'daesik',
		color: '#8d939c',
		at: [45, 23]
	},
	{
		court: 5,
		id: 'hell-yumla',
		judge: { han: '閻羅大王', ko: '염라대왕', en: 'King Yumla' },
		hell: { ko: '발설지옥', en: 'Tongue Plowing' },
		icon: 'record_voice_over',
		sphere: 'samhan',
		color: '#e8b24a',
		at: [127, 40],
		yumla: true
	},
	{
		court: 6,
		id: 'hell-byeonseong',
		judge: { han: '變成大王', ko: '변성대왕', en: 'King Byeonseong' },
		hell: { ko: '독사지옥', en: 'Venomous Snakes' },
		icon: 'pest_control',
		sphere: 'persia',
		color: '#2a8a78',
		at: [55, 32]
	},
	{
		court: 7,
		id: 'hell-taesan',
		judge: { han: '泰山大王', ko: '태산대왕', en: 'King Taesan' },
		hell: { ko: '거해지옥', en: 'Large Saws' },
		icon: 'carpenter',
		sphere: 'hwa',
		color: '#b45309',
		at: [103.5, 26]
	},
	{
		court: 8,
		id: 'hell-pyeongdeung',
		judge: { han: '平等大王', ko: '평등대왕', en: 'King Pyeongdeung' },
		hell: { ko: '철상지옥', en: 'Scorching Ironbeds' },
		icon: 'hotel',
		sphere: 'bullim',
		color: '#7b4fa0',
		at: [29, 39]
	},
	{
		court: 9,
		id: 'hell-dosi',
		judge: { han: '都市大王', ko: '도시대왕', en: 'King Dosi' },
		hell: { ko: '풍도지옥', en: 'Raging Winds' },
		icon: 'air',
		sphere: 'southern-seas',
		color: '#3f7f9e',
		at: [110, -1]
	},
	{
		court: 10,
		id: 'hell-odo',
		judge: { han: '五道轉輪大王', ko: '오도전륜대왕', en: 'King Odo Jeonryun' },
		hell: { ko: '흑암지옥', en: 'Pitch Darkness' },
		icon: 'dark_mode',
		sphere: 'northern-nomads',
		color: '#3a3430',
		at: [100, 47.5]
	}
];

/** Mirror of a living-world sheet point across the lens into 저승 (the discs are the same size). */
export function flipToDead(x: number, y: number): [number, number] {
	return [DEAD_DISC.x - (x - LIVING_DISC.x), DEAD_DISC.y + (y - LIVING_DISC.y)];
}

/** Where a court's name stands in 저승: the mirror of its own civilization. */
export const hellAt = (h: HellCourt): [number, number] => flipToDead(...cosmosProject(...h.at));

/* —————————————— coast corrections (painted over the baked land) —————————————— */

/** The north never ends: past the Arctic coast the snow runs on to the rim. */
export const NORTH_SNOW: LonLat[] = [
	[-40, 64], [-4, 63.2], [6, 64.4], [14, 67.4], [24, 69.6], [32, 64], [36, 63.2], [44, 63.6], [52, 66.4],
	[60, 66.2], [70, 64.8], [80, 65.4], [90, 68], [110, 69], [140, 68.2], [170, 64.8], [220, 64], [220, 160], [-40, 160]
];

/** Australia is past the known south; New Guinea and Timor stay. */
export const AUSTRALIA_WATER: LonLat[] = [
	[108, -13.2], [124, -13.8], [129, -11.6], [132, -11.2], [136.6, -11.6], [141.2, -10.9], [142.8, -10.9],
	[146.4, -13.6], [165, -20], [165, -60], [108, -60]
];

/** Sea of Okhotsk, between the mainland and Kamchatka. */
export const OKHOTSK_WATER: LonLat[] = [
	[142.4, 54.4], [145.2, 59.2], [150.4, 59.6], [155.2, 57.6], [157.4, 54.2],
	[156.2, 50.8], [152.4, 48.2], [147.6, 47.4], [144.6, 49.6], [142.8, 52.4]
];

/** Kamchatka, added so the peninsula stays land after the Okhotsk cut. */
export const KAMCHATKA_LAND: LonLat[] = [
	[156.2, 51.0], [158.4, 53.0], [159.8, 55.6], [162.0, 58.8], [163.6, 61.0],
	[162.0, 61.8], [159.6, 59.4], [158.0, 56.2], [156.4, 53.0], [155.6, 51.2]
];

/** Madagascar is past the known south. */
export const MADAGASCAR_WATER: LonLat[] = [
	[42.6, -11], [51.6, -11], [51.6, -26.6], [42.6, -26.6]
];

/**
 * No Baltic: the sea, its gulfs and Scandinavia (which the baked land drops) are one
 * land joined to the continent and the snowy north.
 */
export const BALTIC_LAND: LonLat[] = [
	[5, 53.4], [14, 53.4], [19, 54], [21.4, 55], [24, 56.4], [32, 58], [34, 64], [32, 70.5], [20, 71.4], [5, 66]
];

/** No North Sea, Channel or Biscay: Britain is joined to the continent and the mythic west. */
export const NORTH_SEA_LAND: LonLat[] = [
	[-12, 43], [-1.5, 43.3], [-1, 46], [-2, 47.5], [-4.5, 48.3], [1.5, 50], [3, 51.2], [4.5, 52.8], [8, 53.6],
	[9.5, 55], [8.8, 57.2], [10.5, 58.5], [11, 59.5], [6, 64], [-12, 64]
];

/** No west coast of Italy: Liguria, the Tyrrhenian, Sardinia and Corsica are one land. */
export const TYRRHENIAN_LAND: LonLat[] = [
	[4.2, 44.2], [5.8, 45.6], [8, 45.4], [10.2, 44.8], [12.8, 43.8], [15.2, 42.4], [17.2, 41],
	[18.2, 39.2], [17.8, 37.2], [16.2, 35.8], [13.2, 35.6], [10, 36.2], [7.6, 37.6], [5.8, 39.4],
	[4.8, 41.2], [4.4, 42.8]
];

/**
 * Fill the jagged Black Sea, then cut a smooth oval back so the coast reads as one
 * simple basin (no Crimean fjords, no Kerch clutter).
 */
export const BLACK_SEA_FILL: LonLat[] = [
	[26.8, 40.4], [29, 40], [32, 40.4], [35.5, 41], [39.5, 41.4], [42, 42.6], [42.2, 44.8],
	[40.2, 46.8], [36.5, 47.4], [32.5, 47.2], [29, 46.2], [27.2, 44.4], [26.6, 42.4]
];
export const BLACK_SEA_WATER: LonLat[] = [
	[28.6, 41.6], [31.5, 41.2], [35, 41.5], [38.2, 42.4], [40, 43.6], [40, 45], [37.6, 46.1],
	[34.2, 46.3], [30.8, 45.6], [28.8, 44.2], [28.4, 42.8]
];

/** Same treatment for the Caspian: fill the complex shore, punch a smooth oval. */
export const CASPIAN_FILL: LonLat[] = [
	[46.2, 36.4], [48.5, 36.2], [51.5, 36.8], [54.2, 38.2], [55.2, 40.5], [55, 43.5], [54, 46],
	[52, 47.2], [49.5, 47.4], [47.2, 46.2], [46, 43.5], [45.8, 40.2], [46, 37.8]
];
export const CASPIAN_WATER: LonLat[] = [
	[47.4, 37.4], [49.6, 37.2], [52.2, 38], [53.6, 39.6], [54, 42], [53.4, 44.6], [51.6, 46.2],
	[49.2, 46.4], [47.4, 45.2], [46.6, 42.6], [46.6, 39.6]
];

/**
 * Everything south of the Sahel is ocean, and the Horn is shaved off so Africa
 * ends in a blunt shore. Yemen and the Ethiopian highland stay. The gulf fill
 * (`GULF_LAND`) still runs west; this cut only takes its southern strip.
 */
export const SOUTH_AFRICA_WATER: LonLat[] = [
	[WEST_LON, 1.5], [12, 1.5], [22, 2], [32, 2.4], [40, 5], [46, 9], [51.5, 12.4], [58, 10], [58, -90], [WEST_LON, -90]
];

export const WATER_CUTS: LonLat[][] = [
	AUSTRALIA_WATER,
	OKHOTSK_WATER,
	MADAGASCAR_WATER,
	SOUTH_AFRICA_WATER,
	BLACK_SEA_WATER,
	CASPIAN_WATER
];
export const LAND_ADDS: LonLat[][] = [
	WEST_LANDS,
	GULF_LAND,
	NORTH_SNOW,
	KAMCHATKA_LAND,
	BALTIC_LAND,
	NORTH_SEA_LAND,
	TYRRHENIAN_LAND,
	BLACK_SEA_FILL,
	CASPIAN_FILL
];

/**
 * Mist curtain east of Japan — between the known Pacific and the myth lands.
 * Painted soft only; never punched into the land mask.
 */
export const EAST_MIST_ARC: LonLat[] = [
	[148, 68], [149.5, 62], [150.5, 56], [151.5, 50], [152, 44], [152.5, 38], [152, 32], [151, 26], [149.5, 20], [147.5, 14], [145, 8], [143, 2]
];

/**
 * Five mythical eastern countries past that mist, north → south. Soft islands only —
 * not in LAND_ADDS, so Samhan / Wa / Hwa geography and sphere washes stay as they are.
 * Stack centred on the Western Flower Fields' latitude (~disc mid-height).
 */
export const EAST_MYTH_LANDS: { id: string; ring: LonLat[]; fill: string }[] = [
	{
		/** Long low bar against the northern rim. */
		id: 'yugwiguk',
		fill: 'rgba(196, 210, 224, 0.55)',
		ring: [
			[160.5, 64.4], [164.5, 66.2], [168.5, 65.4], [170.6, 63.2], [169.2, 60.6], [165, 59.6], [161, 60.4], [159.4, 62.4]
		]
	},
	{
		/** Tall narrow kidney, leaning toward the rim. */
		id: 'moinguk',
		fill: 'rgba(186, 168, 148, 0.55)',
		ring: [
			[164.2, 58.2], [167.2, 57.4], [169.6, 54.2], [171.4, 50.4], [169.6, 47.2], [166.2, 46.4], [163.6, 48.6], [163.2, 53.2], [163.6, 56.4]
		]
	},
	{
		/** Wedge pointing back toward the known Pacific, fat face on the rim. */
		id: 'janginguk',
		fill: 'rgba(210, 188, 164, 0.55)',
		ring: [
			[161.2, 43.6], [165.5, 44.8], [169.5, 43.2], [172.4, 40.2], [171.2, 36.6], [167, 34.8], [162.8, 36.2], [160.2, 39.6]
		]
	},
	{
		/** Rounded triangle, point to the south. */
		id: 'sasoguk',
		fill: 'rgba(228, 210, 168, 0.55)',
		ring: [
			[158.5, 31.2], [163, 32.4], [167.5, 30.6], [170.2, 27.2], [168.4, 23.4], [163.5, 21.8], [159, 23.2], [157.2, 27]
		]
	},
	{
		/** Crescent opening west, toward Japan. */
		id: 'siiguk',
		fill: 'rgba(176, 198, 168, 0.55)',
		ring: [
			[154.2, 18.6], [158.5, 19.6], [162.8, 18], [165.8, 15.2], [164.6, 11.6], [160.5, 10.2], [156.2, 11.4], [153.4, 14.2], [153.2, 16.8]
		]
	}
];

/** How high the Sky Palace hangs over the mountain, per scope (world units). */
export const SKY_HEIGHT = { samhan: 1.5, sphere: 3.4, world: 6.2, cosmos: 7.5 } as const;

/* —————————————— scopes —————————————— */

/**
 * Nested frames of the same painted sheet, nearer to farther.
 * Switching a chip reframes; world and cosmos also change what the paint shows.
 */
export const COSMOS_SCOPES: { id: CosmosScope; en: string; ko: string; icon: string }[] = [
	{ id: 'samhan', en: 'Samhan', ko: '삼한', icon: 'landscape' },
	{ id: 'sphere', en: 'Sphere', ko: '문화권', icon: 'travel_explore' },
	{ id: 'world', en: 'World', ko: '이승', icon: 'public' },
	{ id: 'cosmos', en: 'Cosmos', ko: '천하', icon: 'nights_stay' }
];

/** The sheet box around a lon/lat window, sampled along its edges (the fold bends straight lines). */
function boxOf(lon0: number, lon1: number, lat0: number, lat1: number): SheetBox {
	let x0 = Infinity;
	let x1 = -Infinity;
	let y0 = Infinity;
	let y1 = -Infinity;
	for (let i = 0; i <= 24; i++) {
		const lon = lon0 + ((lon1 - lon0) * i) / 24;
		const lat = lat0 + ((lat1 - lat0) * i) / 24;
		for (const [x, y] of [cosmosProject(lon, lat0), cosmosProject(lon, lat1), cosmosProject(lon0, lat), cosmosProject(lon1, lat)]) {
			x0 = Math.min(x0, x);
			x1 = Math.max(x1, x);
			y0 = Math.min(y0, y);
			y1 = Math.max(y1, y);
		}
	}
	return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** The square the world camera frames. Both layouts are circular silhouettes. */
export const viewBox = (layout: CosmosLayout): SheetBox => discsBox(viewDiscs(layout), 1.1);

/** The painted plane: the two discs, with a little margin. Pixels outside them are cleared. */
export const COSMOS_FRAME: SheetBox = discsBox([LIVING_DISC, DEAD_DISC], 1.04);

/** The peninsula sheet's window (MAP_TERRAIN) under the live fish-eye. */
function samhanFit(): SheetBox {
	const { x, y, w, h } = MAP_TERRAIN;
	let x0 = Infinity;
	let y0 = Infinity;
	let x1 = -Infinity;
	let y1 = -Infinity;
	for (let i = 0; i <= 24; i++) {
		const t = i / 24;
		for (const [px, py] of [fishEye(x + w * t, y), fishEye(x + w * t, y + h), fishEye(x, y + h * t), fishEye(x + w, y + h * t)]) {
			x0 = Math.min(x0, px);
			y0 = Math.min(y0, py);
			x1 = Math.max(x1, px);
			y1 = Math.max(y1, py);
		}
	}
	return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** 이승 drawn alone is a square: the world frame and its painted sheet. */
export const WORLD_SQUARE: SheetBox = discsBox([LIVING_DISC], 1);

/** How much painted ground a near frame keeps around what it fits, so no viewport shape or pan shows an edge. */
const NEAR_MARGIN = 1.9;

/**
 * Every scope paints and raises one sheet: `fit` is what the camera frames, `frame`
 * the painted, raised square around it. Samhan and Sphere paint well past their fit
 * so the ground runs to every edge of the view; World is 이승's square; Cosmos is
 * both discs, the only round frame.
 */
export function scopeFrame(scope: CosmosScope): { fit: SheetBox; frame: SheetBox } {
	if (scope === 'world') return { fit: discsBox([LIVING_DISC], 1.04), frame: WORLD_SQUARE };
	if (scope === 'cosmos') return { fit: scopeBox('cosmos'), frame: COSMOS_FRAME };
	const fit = scope === 'samhan' ? samhanFit() : scopeBox('sphere');
	const side = Math.max(fit.w, fit.h) * NEAR_MARGIN;
	return { fit, frame: { x: fit.x + fit.w / 2 - side / 2, y: fit.y + fit.h / 2 - side / 2, w: side, h: side } };
}

/**
 * What each wide scope frames on the sheet, under the live fish-eye.
 */
export function scopeBox(scope: Exclude<CosmosScope, 'samhan'>): SheetBox {
	if (scope === 'sphere') {
		/**
		 * Tight on East Asia: Hua, Wa, the northern band — Korea large, not a
		 * postage stamp in empty ocean.
		 */
		const b = boxOf(112, 142, 20, 46);
		const [hx, hy] = homePoint();
		const x0 = Math.max(COSMOS_FRAME.x, Math.min(b.x, 2 * hx - (b.x + b.w)));
		const x1 = Math.min(COSMOS_FRAME.x + COSMOS_FRAME.w, Math.max(b.x + b.w, 2 * hx - b.x));
		const y0 = Math.max(COSMOS_FRAME.y, Math.min(b.y, 2 * hy - (b.y + b.h)));
		const y1 = Math.min(COSMOS_FRAME.y + COSMOS_FRAME.h, Math.max(b.y + b.h, 2 * hy - b.y));
		return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	}
	if (scope === 'world') return scopeFrame('world').fit;
	/** Both discs whole: neither world is ever cut by the frame. */
	return discsBox([LIVING_DISC, DEAD_DISC], 1.03);
}

/** The camera's tilt per scope: farther out → more from above. Keep sphere flatter than before so East Asia doesn't fish-eye. */
export const SCOPE_VIEW: Record<CosmosScope, { az: number; el: number }> = {
	samhan: { az: 0, el: 0.84 },
	sphere: { az: 0, el: 0.72 },
	/** Square-on: a turned box projects wider than the land and shrinks it in the frame. */
	world: { az: 0, el: 0.62 },
	cosmos: { az: 0, el: 0.6 }
};

/* —————————————— a court's land and its reach —————————————— */

/**
 * Tang proper: the Ten Circuits of the Zhenguan years, from the Liao's west bank to
 * Dunhuang and Hainan, a hand-drawn approximation. Seaward points stand off the
 * coast, since only the polity's own edge is cut by it. Everything Tang holds past
 * this line is a protectorate (Anbuk, Seonu, Anseo, Andong, Annam).
 */
const TANG_PROPER: LonLat[] = [
	[93.5, 40.7], [95.5, 40.9], [97.8, 40.2], [99.8, 39.8], [101.8, 39.0], [103.5, 39.6], [105.8, 39.4], [106.6, 40.4],
	[107.4, 41.2], [109.8, 40.9], [111.3, 40.2], [113.2, 40.6], [114.9, 41.0], [116.6, 40.9], [118.6, 40.8], [120.0, 42.0],
	[121.6, 41.6], [121.2, 40.7], [120.6, 39.6], [120.3, 38.2], [123.2, 37.6], [123.4, 34.5], [122.8, 30.5], [121.6, 27.3],
	[120.1, 24.8], [117.8, 22.6], [114.5, 21.4], [111.8, 20.6], [111.6, 18.0], [108.4, 17.8], [108.0, 21.4], [106.8, 22.3],
	[105.6, 23.2], [104.1, 24.4], [103.0, 26.0], [102.3, 27.8], [102.1, 29.6], [102.6, 31.3], [103.3, 32.8], [102.8, 34.5],
	[101.4, 35.9], [100.6, 37.0], [99.6, 38.4], [97.8, 39.2], [95.6, 39.6], [93.5, 39.9]
];

export type CosmosClip = {
	/** Which standing polities it cuts: by data name, or a whole region. */
	name?: RegExp;
	region?: CosmosRegion;
	ring: LonLat[];
	/** What lies past the ring: a hatched protectorate, or nothing. */
	outside: 'protectorate' | 'drop';
};

/**
 * Tang proper only — land past the ring (Anseo / the Western Regions) is dropped,
 * not hatched. Named northern and southern protectorates still paint via their own
 * polity shapes.
 */
export const COSMOS_CLIPS: CosmosClip[] = [{ name: /^(Tang|Zhou)$/, ring: TANG_PROPER, outside: 'drop' }];

/**
 * The year's shapes are the heartland, cut so they cannot wander out of that
 * civilization's reach. Persia's heartland is the plateau in every year (Daesik
 * is its own sphere); Rome's is the standing Roman or Byzantine border.
 */
export function clipsFor(_year: number): CosmosClip[] {
	return [
		...COSMOS_CLIPS,
		{ region: 'persia', ring: PERSIA_LANDS, outside: 'drop' },
		{ region: 'nomads', ring: NOMAD_CORE, outside: 'drop' },
		{ region: 'rome', ring: ROME_CORE, outside: 'drop' },
		{ region: 'india', ring: INDIA_CORE, outside: 'drop' },
		{ region: 'tibet', ring: TIBET_CORE, outside: 'drop' }
	];
}

/** Polities that are a court's reach and nothing more: hatched whole. */
export const PROTECTORATE_NAME = /Protectorate/;
/** Anseo (安西 / Protectorate of the Western Regions) — never drawn. */
export const ANSEO_NAME = /Western Regions|Anseo|安西|서역도호/;

/** A lon/lat ring in sheet units, its edges sampled about every degree (the fold bends them). */
export function sheetRing(ring: LonLat[]): Pt[] {
	return ring.flatMap(([lon, lat], i) => {
		const [nlon, nlat] = ring[(i + 1) % ring.length];
		const n = Math.max(1, Math.ceil(Math.hypot(nlon - lon, nlat - lat)));
		return Array.from({ length: n }, (_, k) => cosmosProject(lon + ((nlon - lon) * k) / n, lat + ((nlat - lat) * k) / n));
	});
}

/* —————————————— the gold line round Samhan —————————————— */

/** The sheet's polities that are Samhan (Balhae and the West's commanderies are not). */
export const SAMHAN_POLITIES: ReadonlySet<string> = new Set([
	'gojoseon', 'jin', 'buyeo', 'jolbon', 'dongbuyeo', 'galsa', 'goguryeo', 'baekje', 'silla', 'gaya',
	'mahan', 'jinhan', 'byeonhan', 'okjeo', 'dongye', 'tamla', 'usan'
]);

/** Islands always inside the line, whoever holds them that year; `r` is the least they draw as, in sheet units. */
export const SAMHAN_ISLES: { id: string; han: string; en: string; ko: string; at: LonLat; r: number }[] = [
	{ id: 'tamla', han: '耽羅', en: 'Tamla', ko: '탐라', at: TAMLA_AT, r: 3 },
	{ id: 'usan', han: '鬱陵島', en: 'Ulleungdo', ko: '울릉도', at: [130.87, 37.5], r: 1.6 },
	{ id: 'dokdo', han: '獨島', en: 'Dokdo', ko: '독도', at: [131.87, 37.24], r: 0.9 }
];

/** The line's gap off the coast and its width, in sheet units, per scope: wider the farther out. */
export const SAMHAN_LINE: Record<Exclude<CosmosScope, 'samhan'>, { gap: number; width: number }> = {
	sphere: { gap: 2.5, width: 4 },
	world: { gap: 4, width: 8 },
	cosmos: { gap: 5, width: 11 }
};
