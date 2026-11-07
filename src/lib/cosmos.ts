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
const PROJECTION_BASE = 'grid-2';

/** Paint-cache key for the live projection (base + fish-eye). */
export function projectionVer(): string {
	return `${PROJECTION_BASE}+${fishEyeKind}`;
}

/** @deprecated Prefer `projectionVer()` — kept so older imports keep compiling. */
export const PROJECTION_VER = PROJECTION_BASE;

const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Distance from (ox, oy), inside 이승, to its rim along the unit ray (ux, uy). */
function rimFrom(ox: number, oy: number, ux: number, uy: number): number {
	const px = ox - LIVING_DISC.x;
	const py = oy - LIVING_DISC.y;
	const b = px * ux + py * uy;
	return -b + Math.sqrt(Math.max(0, b * b - (px * px + py * py) + LIVING_DISC.r * LIVING_DISC.r));
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
		const ox = cx - LIVING_DISC.x;
		const oy = cy - LIVING_DISC.y;
		const off = Math.hypot(ox, oy);
		const room = Math.max(0, LIVING_DISC.r * CORE_REACH - m * r0);
		const s = off > room ? room / off : 1;
		lens = { m, cx, cy, r0, qx: LIVING_DISC.x + ox * s, qy: LIVING_DISC.y + oy * s };
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
 */
export function fishEye(x: number, y: number): Pt {
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
	if (!L) return [x, y];
	const qx = x - L.qx;
	const qy = y - L.qy;
	if (Math.hypot(qx, qy) <= L.m * L.r0) return [L.cx + qx / L.m, L.cy + qy / L.m];
	if (Math.hypot(x - LIVING_DISC.x, y - LIVING_DISC.y) >= LIVING_DISC.r) return [x, y];
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
	if (Number.isNaN(lo)) return [x, y];
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
	return [L.cx + r * a.ux, L.cy + r * a.uy];
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

/* —————————————— the two worlds —————————————— */

/** Sheet-space disc. `x` east, `y` south, same units as `cosmosProject`. */
export type Disc = { x: number; y: number; r: number };

/** Axis-aligned sheet box (paint frame, camera frame). */
export type SheetBox = { x: number; y: number; w: number; h: number };

/**
 * 이승: Iberia to Japan on the even grid. The west rim stops about one Atlantic past
 * Iberia, so the mythic western land and the three rivers fit before the lens.
 * North is endless snow, south is open sea; Australia is cut.
 */
export const LIVING_DISC: Disc = { x: -2733, y: 700, r: 4234 };

/** How far the two worlds overlap: the width of the Western Heavens. */
const LENS_WIDTH = 1000;

/**
 * 저승: the same size as 이승, its mirror across the lens. They overlap by the
 * Western Heavens.
 */
export const DEAD_DISC: Disc = { x: LIVING_DISC.x - (2 * LIVING_DISC.r - LENS_WIDTH), y: LIVING_DISC.y, r: LIVING_DISC.r };

/**
 * One circle split on that lens. West of the seam is 저승, east is 이승.
 */
export const HALF_DISC: Disc = { x: (LIVING_DISC.x + DEAD_DISC.x) / 2, y: 700, r: 7400 };

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
	return { x, y, rx: 300, ry: half * 0.26 };
}

/** 약수삼천리, the Life River: runs east–west through the middle of the flower fields, lens tip to lens tip. */
export function riverOfLife(): { y: number; x0: number; x1: number } {
	const m = meadow();
	const y = m.y;
	const dy = y - LIVING_DISC.y;
	const run = Math.sqrt(Math.max(0, LIVING_DISC.r ** 2 - dy * dy));
	return { y, x0: LIVING_DISC.x - run, x1: DEAD_DISC.x + run };
}

/** Where the roads meet the waters: the lens's east lip at the fields' height. */
const lipX = (disc: Disc, side: 1 | -1, y: number) => disc.x + side * Math.sqrt(Math.max(0, disc.r ** 2 - (y - disc.y) ** 2));

/**
 * 세갈래길 and 일흔여덟갈래길 are one crossroads, just before the White River.
 * Its three ways are the three biomes of 이승, so no road is drawn.
 */
export function crossroads(): Pt {
	const y = meadow().y;
	return [lipX(DEAD_DISC, 1, y) + LIVING_WATERS[0].out + 620, y + 220];
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
 * The three waters close together, outermost first. Their ends fade out, so the
 * names stand near the middle of the bow, stepped down and clear of the crossroads.
 */
const LIVING_WATERS: { id: FieldRiver['id']; out: number; t: number }[] = [
	{ id: 'baek', out: 300, t: 0.3 },
	{ id: 'hwang', out: 230, t: 0.38 },
	{ id: 'jeok', out: 160, t: 0.46 }
];
const SAMDO_OUT = 230;

export function fieldRivers(): FieldRiver[] {
	const east = fieldBow(DEAD_DISC, 'east', 0.22);
	const west = fieldBow(LIVING_DISC, 'west', 0.22);
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

/** Where the cosmic names stand, in sheet units. The map only draws `circles`. */
export function layoutSpots(layout: CosmosLayout): Record<MythSpot, [number, number]> {
	const flower = lensPoint();
	const dead = DEAD_DISC;
	const river = Object.fromEntries(fieldRivers().map((r) => [r.id, r.at])) as Record<FieldRiver['id'], [number, number]>;
	const m = meadow();
	const shared = {
		/** The lens's name stands over its north tip, outside both discs; the meadow's name above the Life River, the river's below. */
		heavens: [flower[0], lensTips().north[1] - 300] as [number, number],
		flowers: [m.x, m.y - m.ry * 0.5] as [number, number],
		yaksu: [m.x, riverOfLife().y + 170] as [number, number],
		threefold: crossroads(),
		/** Mirror of the crossroads, just inside 저승 — the seventy-eight ways. */
		seventyEight: (() => {
			const [x, y] = crossroads();
			return flipToDead(x, y);
		})(),
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
		/** Each world's name stands well above its own circle, clear of the rim. */
		living: [LIVING_DISC.x + 420, LIVING_DISC.y - LIVING_DISC.r - 160],
		dead: [dead.x - 420, dead.y - dead.r - 160],
		hells: [dead.x - 40, dead.y + 80],
		road: [lipX(LIVING_DISC, -1, m.y) - SAMDO_OUT - 320, m.y],
		springs: [dead.x, dead.y + dead.r * 0.6]
	};
}

/** 극락 stands on the mirror of the tundra, 지옥 on the forest's, 명부 on the desert's. */
const BLISS_AT: LonLat = [92, 72];
const HELL_GATE_AT: LonLat = [16, 4];
const GATEWAY_AT: LonLat = [12, 21];
/** The Ten Peoples' name sits just outside their border, north of the steppe. */
const PEOPLES_AT: LonLat = [96, 64];

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
		en: 'Bukjuk',
		native: '𐱅𐰇𐰼𐰚',
		at: [112, 47.2],
		scopes: ['world', 'cosmos']
	},
	{ id: 'samhan', nation: 'samhan', region: 'samhan', han: '三韓', ko: '삼한', en: 'Samhan', at: [127.4, 36.6], home: true, scopes: ['sphere', 'world', 'cosmos'] },
	{ id: 'tubo', nation: 'tubo', region: 'tibet', han: '吐蕃', ko: '토번', en: 'Tubo', native: 'བོད', tag: 'tibet', scopes: ['world', 'cosmos'] },
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
	/** Ῥώμη — Rome, the name the east kept, not the later Byzantine coinage. */
	{ id: 'bullim', nation: 'bullim', region: 'rome', han: '拂菻', ko: '불림', en: 'Bulim', native: 'Ῥώμη', at: [28, 46], scopes: ['world', 'cosmos'] },
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
	/** Bari crosses it for the water that wakes the dead. It runs through the fields. */
	{ id: 'yaksu', nation: 'yaksu', han: '弱水三千里', ko: '약수삼천리', en: 'Life River', spot: 'yaksu', kind: 'river', tint: '#bff0ff', scopes: ['cosmos'] },
	/** Life side: three ways. Death side: seventy-eight. Marked with path dots, not drawn roads. */
	{ id: 'threefold-path', nation: 'threefold_path', han: '', ko: '세갈래길', en: 'Threefold Path', spot: 'threefold', scopes: ['cosmos'] },
	{ id: 'seventy-eight-path', nation: 'threefold_path', han: '', ko: '일흔여덟갈래길', en: 'Seventy-Eight Paths', spot: 'seventyEight', scopes: ['cosmos'] },
	{ id: 'tundra', nation: 'tundra', han: '', ko: '동토', en: 'Tundra', at: [70, 72], kind: 'biome', tint: '#d4e8ff', scopes: ['cosmos'] },
	{ id: 'desert', nation: 'desert', han: '', ko: '사막', en: 'Desert', at: [12, 21], kind: 'biome', tint: '#f3d58e', scopes: ['cosmos'] },
	{ id: 'forest', nation: 'forest', han: '', ko: '밀림', en: 'Forest', at: [22, -2], kind: 'biome', tint: '#a8dc84', scopes: ['cosmos'] },
	{ id: 'ten-peoples', nation: 'ten-peoples', han: '', ko: '열 겨레', en: 'Ten Peoples', spot: 'peoples', scopes: ['cosmos'] },
	{ id: 'ten-hells', nation: 'ten-hells', han: '十大地獄', ko: '십대지옥', en: 'Ten Hells', spot: 'ten', scopes: ['cosmos'] },
	/** The three biomes in the mirror: the tundra's is Bliss, the forest's Pain, the desert's the Gateway. */
	{ id: 'bliss', nation: 'bliss', han: '極樂', ko: '극락', en: 'Bliss', spot: 'bliss', kind: 'biome', tint: '#e6d6a6', scopes: ['cosmos'] },
	{ id: 'hell-gate', nation: 'hell-gate', han: '地獄', ko: '지옥', en: 'Pain', spot: 'hellGate', kind: 'biome', tint: '#ef8a72', scopes: ['cosmos'] },
	{ id: 'gateway', nation: 'gateway', han: '冥府', ko: '명부', en: 'Gateway', spot: 'gateway', kind: 'biome', tint: '#c7b4dc', scopes: ['cosmos'] },
	/** The three waters of the living approach, outermost first. 황강 is not the Yellow Springs. */
	{ id: 'baek', nation: 'baek', han: '白川', ko: '백천', en: 'White River', spot: 'baek', kind: 'river', tint: '#f2f7fd', scopes: ['cosmos'] },
	{ id: 'hwang-river', nation: 'hwang-river', han: '黃江', ko: '황강', en: 'Yellow River', spot: 'hwang', kind: 'river', tint: '#f2c14e', scopes: ['cosmos'] },
	{ id: 'jeok', nation: 'jeok', han: '赤川', ko: '적천', en: 'Red River', spot: 'jeok', kind: 'river', tint: '#f08080', scopes: ['cosmos'] },
	{ id: 'samdo', nation: 'samdo', han: '三途川', ko: '삼도천', en: 'Samdo River', spot: 'samdo', kind: 'river', tint: '#9fd4f0', scopes: ['cosmos'] },
	{ id: 'yellow-springs', nation: 'yellow-springs', han: '黃泉', ko: '황천', en: 'The Yellow Springs', spot: 'springs', scopes: ['cosmos'] }
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

/** Greater Rome: Iberia to Anatolia, the Levant and Egypt down the Nile. Arabia and the Horn stay out. */
const ROME_CORE: LonLat[] = [
	[-9.5, 36.5], [-9.5, 42], [-8, 43.8], [-2, 43.6], [1, 42.8], [3.2, 43.3], [6.5, 43.8], [7.5, 46],
	[10.5, 46.8], [13.8, 46.6], [16.5, 46.3], [19.5, 45.2], [22.5, 44.6], [27, 44.2], [28.6, 43],
	[29.5, 41.8], [32, 41.9], [35, 42.1], [38, 41.2], [39.5, 40.5], [39.5, 38.5], [38.5, 37], [37.2, 36.5],
	[36.6, 35], [35.8, 33.5], [35.5, 32], [34.9, 31], [34.5, 29.5], [33.5, 27.5], [35, 23.5], [32.5, 22],
	[31.5, 23.8], [30, 25.5], [29, 30], [25, 31.2], [20, 30.6], [15.5, 31.4], [11, 33], [10.2, 35.3],
	[8, 36.6], [3, 36.6], [-1, 35.4], [-5, 35.6], [-6, 35.5], [-8.5, 36.2]
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
	{ id: 'bullim', region: 'rome', core: ROME_CORE, reach: 6 },
	{ id: 'northern-nomads', region: 'nomads', core: NOMAD_CORE, reach: 2.5 }
];

/**
 * The mythic west: Koreans knew no Atlantic. Just off the real coast from Norway to
 * the Cape, Europe and Africa run on as one land to the Western Heavens.
 */
export const WEST_LANDS: LonLat[] = [
	[20, 70.5], [16, 68.5], [13.5, 66], [10.5, 63.8], [7, 61.8], [8.4, 58.3], [9, 55.6], [9, 54], [6.5, 53.1],
	[5, 52.3], [4, 51.2], [2.5, 50.9], [2, 50], [-0.5, 49.2], [-1, 48.6], [-3.5, 48.3], [-1.6, 47.2], [-0.8, 46],
	[-0.8, 43.6], [-8, 43.2], [-8, 37.2], [-6, 33.5], [-9, 29.5], [-13, 26], [-15.6, 21], [-15.6, 17], [-16.4, 14.6],
	[-16.2, 12], [-13.5, 10], [-8, 5.5], [2, 6.8], [5.5, 6], [8.5, 5.2], [10, 3], [10, -2], [13.4, -6], [14, -9],
	[14.2, -12], [13.4, -16], [14.6, -22], [15.4, -26.5], [16.6, -28.6], [18.4, -32], [19, -34.6], [19, -90],
	[-220, -90], [-220, 160], [20, 160]
];

/**
 * Lands no civilization claims: all of Africa past Egypt (the Horn too), the
 * snowy north, and Australia.
 */
export const UNKNOWN_LANDS: LonLat[][] = [
	[
		[-20, 27], [-8, 28], [0, 29], [10, 30], [19, 29.8], [25, 29], [28.5, 26], [31, 22], [36.5, 22],
		[38.5, 18], [41.5, 15], [43.6, 12.4], [52, 12], [56, -40], [-20, -40]
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
		[-220, 30], [-14, 29], [-8, 31.5], [-2, 33], [4, 33.6], [9, 33.2], [10.5, 31.8], [15, 31], [19, 30.6],
		[25, 30.4], [29, 30.2], [31, 27.5], [33.5, 24], [36, 21], [38.4, 17.5], [37, 14.6], [33, 13.4], [27, 12.6],
		[21, 12.2], [15, 12.4], [9, 12.8], [3, 13.2], [-4, 13.4], [-11, 13.8], [-17.5, 14.2], [-220, 14.2]
	],
	[
		[34.8, 29.4], [37, 30.8], [40, 31.8], [43, 31], [46, 30], [48, 29.8], [50.5, 27], [56, 26.2],
		[59.8, 22.5], [57, 18], [52, 15.5], [45, 12.5], [43, 12.6], [42.5, 15], [39, 21], [36.5, 26], [34.8, 28]
	]
];

/** Forest, the third biome of 이승: Africa south of the Sahara, down to the Cape. Its way leads to the gate of hell. */
export const JUNGLE_LANDS: LonLat[][] = [
	[
		[-220, 14.3], [-17.5, 14.3], [-11, 13.9], [-4, 13.5], [3, 13.3], [9, 12.9], [15, 12.5], [21, 12.3],
		[27, 12.7], [33, 13.5], [37, 14.7], [38.4, 17.5], [43, 12], [52, 12], [55, 0], [52, -10], [46, -18],
		[40, -26], [33, -31], [26, -34], [20, -34.8], [15, -33.8], [12, -28], [10, -16], [8, -4], [5, 6],
		[-4, 12], [-220, 12]
	]
];

/** Africa and the western land it runs into: mirrored, the way down into 지옥. South tip follows the Cape’s soft curve, not a vertical drop. */
export const AFRICA_LANDS: LonLat[] = [
	[-220, 31], [-6, 35.8], [10, 37], [11, 33.4], [20, 31], [32, 31.4], [34.5, 28], [38, 21], [43, 12.4],
	[51.2, 11.8], [46, 4], [43, -4], [41, -12], [39, -20], [36, -26], [32, -30.5], [27, -33.2], [22, -34.6],
	[17, -34.9], [13, -33.5], [11, -28], [10, -18], [9, -8], [7, 2], [4, 10], [-4, 14], [-12, 18], [-220, 20]
];

/**
 * Tundra, the first biome of 이승: Scandinavia and the far north of Europe and Siberia.
 * Its cold way leads to Bliss. The Himalaya is height, not paint.
 */
export const SNOW_LANDS: LonLat[][] = [
	[
		[-12, 58], [-6, 56.8], [2, 57.2], [8, 57.6], [12, 56], [20, 56.2], [30, 56.8], [45, 57.6], [60, 57.2],
		[75, 56.2], [95, 55.2], [110, 54.4], [130, 54.2], [145, 52], [165, 55], [200, 60], [200, 160], [-220, 160],
		[-220, 58]
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

export const WATER_CUTS: LonLat[][] = [AUSTRALIA_WATER, OKHOTSK_WATER, MADAGASCAR_WATER];
export const LAND_ADDS: LonLat[][] = [WEST_LANDS, NORTH_SNOW, KAMCHATKA_LAND, BALTIC_LAND];

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

/**
 * What each scope frames on the sheet, under the live fish-eye. Samhan keeps the
 * peninsula relief; the rest crop the paint.
 */
export function scopeBox(scope: Exclude<CosmosScope, 'samhan'>): SheetBox {
	if (scope === 'sphere') {
		/**
		 * Hua, Wa and the northern tribes, with Korea (the fish-eye's fixed point) as
		 * near the centre as the painted frame allows: past its edge there is no sea.
		 */
		const b = boxOf(95, 155, -8, 53);
		const [hx, hy] = homePoint();
		const x0 = Math.max(COSMOS_FRAME.x, Math.min(b.x, 2 * hx - (b.x + b.w)));
		const x1 = Math.min(COSMOS_FRAME.x + COSMOS_FRAME.w, Math.max(b.x + b.w, 2 * hx - b.x));
		const y0 = Math.max(COSMOS_FRAME.y, Math.min(b.y, 2 * hy - (b.y + b.h)));
		const y1 = Math.min(COSMOS_FRAME.y + COSMOS_FRAME.h, Math.max(b.y + b.h, 2 * hy - b.y));
		return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
	}
	if (scope === 'world') {
		/**
		 * The ten peoples on the living disc. A light east bias still centres Samhan,
		 * but leave enough west that about half of Rome stays in frame under Mid.
		 */
		const b = discsBox([LIVING_DISC], 1.02);
		return { x: b.x + b.w * 0.02, y: b.y, w: b.w * 0.98, h: b.h };
	}
	/** Both discs, cropped so the three rivers sit near the left with little void past them. */
	const b = viewBox('circles');
	const rivers = fieldRivers().find((r) => r.id === 'baek')!.at[0];
	const left = Math.max(b.x, rivers - b.w * 0.08);
	return { x: left, y: b.y, w: b.x + b.w - left, h: b.h };
}

/** The camera's tilt per scope: farther out → more from above. Keep sphere flatter than before so East Asia doesn't fish-eye. */
export const SCOPE_VIEW: Record<CosmosScope, { az: number; el: number }> = {
	samhan: { az: 0, el: 0.84 },
	sphere: { az: 0, el: 0.72 },
	world: { az: 0.35, el: 0.55 },
	/** Lower and more oblique so the thick disc skirt, the basin and the flower hill read. */
	cosmos: { az: 0.62, el: 0.32 }
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
	{ id: 'tamla', han: '耽羅', en: 'Tamla', ko: '탐라', at: [126.55, 33.38], r: 3 },
	{ id: 'usan', han: '鬱陵島', en: 'Ulleungdo', ko: '울릉도', at: [130.87, 37.5], r: 1.6 },
	{ id: 'dokdo', han: '獨島', en: 'Dokdo', ko: '독도', at: [131.87, 37.24], r: 0.9 }
];

/** The line's gap off the coast and its width, in sheet units, per scope: wider the farther out. */
export const SAMHAN_LINE: Record<Exclude<CosmosScope, 'samhan'>, { gap: number; width: number }> = {
	sphere: { gap: 2.5, width: 4 },
	world: { gap: 4, width: 8 },
	cosmos: { gap: 5, width: 11 }
};
