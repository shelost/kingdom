/**
 * The film's peninsula, as numbers: where the camera hangs over each focus, which
 * cells are lit in what colour at a moment of a map shot, where the refugee
 * arrows run, and when the falling chariot strikes the mountain. Pure, so the
 * 3D scene only has to draw what these return and a scrub lands mid-move.
 */
import { BORDER_SITES, holderAt, type PolityId } from '$lib/borders';
import { easeInOut, progress, smooth } from './timeline';
import type { MapFocus, MapPaint, Realm } from './types';

/** One map shot as the screen needs it. `k` is 0…1 through the shot, `t` the film clock. */
export type MapShow = {
	mode: 'peninsula' | 'road' | 'descent';
	step?: string;
	year: number;
	paint: MapPaint;
	lit?: Realm;
	opacity: number;
	focus: MapFocus;
	from: MapFocus;
	arrows: 'draw' | 'hold' | false;
	k: number;
	t: number;
	/** Length of the shot in seconds. */
	secs: number;
	/** False while the map waits mounted under another picture: it holds its pose and skips drawing. */
	active: boolean;
};

export type Pt = [number, number];

/** Where the camera looks (sheet units), how close, and how far it tips from straight down. */
export type MapCamera = { x: number; y: number; zoom: number; tilt: number; turn: number };

const FOCUS: Record<MapFocus, { x: number; y: number; zoom: number }> = {
	wide: { x: 292, y: 462, zoom: 1 },
	north: { x: 262, y: 330, zoom: 2.25 },
	southeast: { x: 398, y: 612, zoom: 2.5 },
	southwest: { x: 298, y: 598, zoom: 2.4 }
};

/** Radians from straight down. Wide sits higher; a kingdom is seen lower, nearer the horizon. */
const TILT_WIDE = 0.72;
const TILT_NEAR = 0.95;

/** The camera over a map shot: eased from the last focus, out and back in when it crosses between two kingdoms. */
export function mapCamera(map: MapShow): MapCamera {
	const a = FOCUS[map.from];
	const b = FOCUS[map.focus];
	const u = easeInOut(map.k);
	const hop = map.from !== map.focus && map.from !== 'wide' && map.focus !== 'wide';
	const dip = hop ? 1 + 0.9 * Math.sin(Math.PI * u) : 1;
	const zoom = Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * u) / dip;
	const near = (z: number) => Math.min(1, Math.max(0, (z - 1) / 1.3));
	const tilt = TILT_WIDE + (TILT_NEAR - TILT_WIDE) * near(zoom);
	// a held shot still breathes: a slow push and a little turn
	const drift = map.from === map.focus ? map.k : 0;
	return {
		x: a.x + (b.x - a.x) * u,
		y: a.y + (b.y - a.y) * u,
		zoom: zoom * (1 + 0.06 * drift),
		tilt,
		turn: 0.07 * Math.sin(map.t * 0.03)
	};
}

/* ── cells ─────────────────────────────────────────────────────── */

/** Where the old kingdom fell, and the refugees left from. */
export const WANGGEOM: Pt = [248, 390];

/** The small kingdoms of the proto-Samhan years: anyone holding a cell who is not the empire or across the sea. */
const STATELET = new Set<PolityId>([
	'buyeo',
	'dongbuyeo',
	'jolbon',
	'galsa',
	'goguryeo',
	'okjeo',
	'dongye',
	'mahan',
	'jinhan',
	'byeonhan',
	'baekje',
	'silla',
	'gaya',
	'usan',
	'tamla'
]);

const REALMS: Realm[] = ['goguryeo', 'silla', 'baekje'];

/** The three, bright: the colour each brightens to when it rises. */
export const REALM_COLOR: Record<Realm, string> = { goguryeo: '#ff5040', silla: '#62a8ff', baekje: '#ffc93c' };
const EMPIRE = '#7a2a2a';

type Cell = {
	/** 0-based site index; also its row in the state texture. */
	i: number;
	x: number;
	y: number;
	statelet: boolean;
	/** Order the small kingdoms ink in: the year they appear, then outward from the fallen capital. */
	rank: number;
	color: [number, number, number];
	realm: Realm | null;
	/** The year the cell joins its realm. */
	joins: number;
	empire: boolean;
};

const hex = (h: string): [number, number, number] => {
	const n = parseInt(h.slice(1), 16);
	return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function hsl(h: number, s: number, l: number): [number, number, number] {
	const f = (n: number) => {
		const k = (n + h * 12) % 12;
		const a = s * Math.min(l, 1 - l);
		return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
	};
	return [f(0), f(8), f(4)];
}

let cells: Cell[] | null = null;

/** Every border site as a cell of the film's map, worked out once. */
export function filmCells(): Cell[] {
	if (cells) return cells;
	const born = BORDER_SITES.map((s) => {
		const row = s.h.find(([from, who]) => from <= 60 && who != null && STATELET.has(who));
		return row ? Math.max(-120, row[0]) : null;
	});
	const order = BORDER_SITES.map((s, i) => i)
		.filter((i) => born[i] != null)
		.sort((a, b) => {
			const sa = BORDER_SITES[a];
			const sb = BORDER_SITES[b];
			const da = Math.hypot(sa.x - WANGGEOM[0], sa.y - WANGGEOM[1]);
			const db = Math.hypot(sb.x - WANGGEOM[0], sb.y - WANGGEOM[1]);
			return born[a]! - born[b]! + (da - db) * 0.4;
		});
	const rankOf = new Map(order.map((i, r) => [i, r]));
	cells = BORDER_SITES.map((s, i) => {
		const at400 = holderAt(s, 400).polity;
		const realm = REALMS.find((r) => r === at400) ?? null;
		const joins = realm ? (s.h.find(([, who]) => who === realm)?.[0] ?? 400) : 9999;
		const rank = rankOf.get(i) ?? -1;
		// each small kingdom its own colour, walked round the wheel by the golden angle
		const hue = (rank * 0.381966 + 0.07) % 1;
		return {
			i,
			x: s.x,
			y: s.y,
			statelet: rank >= 0,
			rank,
			color: hsl(hue, 0.62, 0.6),
			realm,
			joins: Math.max(-57, joins),
			empire: holderAt(s, -100).polity === 'china'
		};
	});
	return cells;
}

/** How many small kingdoms ink in over a `found` shot. */
export function stateletCount(): number {
	return filmCells().filter((c) => c.statelet).length;
}

/** Brighter, more saturated: a kingdom that has arrived. */
const bright = (c: [number, number, number], k: number): [number, number, number] => c.map((v) => Math.min(1, v * (1 + 0.35 * k) + 0.06 * k)) as [number, number, number];

/**
 * The cells' paint at one moment, two texels per cell: row 0 is colour and
 * opacity; row 1 is the ink-bloom radius (sheet units, −1 when filled), the
 * flash of a cell just founded, and the group whose seams are not drawn.
 */
export function paintCells(map: Pick<MapShow, 'paint' | 'k' | 'year' | 'lit'>, out: Float32Array): void {
	const list = filmCells();
	const n = list.length;
	const set = (i: number, c: [number, number, number], a: number, r: number, pop: number, group: number) => {
		out[i * 4] = c[0];
		out[i * 4 + 1] = c[1];
		out[i * 4 + 2] = c[2];
		out[i * 4 + 3] = a;
		const j = (n + i) * 4;
		out[j] = r;
		out[j + 1] = pop;
		out[j + 2] = group;
		out[j + 3] = 0;
	};
	const N = Math.max(1, stateletCount() - 1);
	const reach = (c: Cell) => BORDER_SITES[c.i].r * 1.4;
	for (const c of list) {
		const own = 1000 + c.i;
		if (map.paint === 'none') {
			set(c.i, c.color, 0, -1, 0, own);
			continue;
		}
		if (map.paint === 'found' || map.paint === 'statelets') {
			if (c.empire) {
				set(c.i, hex(EMPIRE), 0.32 * (map.paint === 'found' ? smooth(progress(map.k, 0, 0.2)) : 1), -1, 0, 1);
				continue;
			}
			if (!c.statelet) {
				set(c.i, c.color, 0, -1, 0, own);
				continue;
			}
			const start = 0.08 + (0.72 * c.rank) / N;
			const p = map.paint === 'found' ? progress(map.k, start, start + 0.14) : 1;
			set(c.i, c.color, 0.78 * smooth(Math.min(1, p * 2.2)), p >= 1 ? -1 : reach(c) * smooth(p), Math.sin(Math.PI * p), own);
			continue;
		}
		if (map.paint === 'rise') {
			const year = -57 + 457 * easeInOut(map.k);
			if (c.realm) {
				const q = smooth(progress(year, c.joins, c.joins + 36));
				const to = bright(hex(REALM_COLOR[c.realm]), 1);
				const from = c.statelet ? c.color : to;
				const col: [number, number, number] = [0, 1, 2].map((k) => from[k] + (to[k] - from[k]) * q) as [number, number, number];
				const a = c.statelet ? 0.72 + 0.28 * q : q;
				set(c.i, col, a, -1, Math.sin(Math.PI * q) * 0.8, q > 0.5 ? REALMS.indexOf(c.realm) + 1 : own);
				continue;
			}
			const fade = 1 - 0.75 * smooth(map.k);
			if (c.empire) set(c.i, hex(EMPIRE), 0.32 * (1 - smooth(map.k)), -1, 0, 1);
			else if (c.statelet) set(c.i, c.color, 0.78 * fade, -1, 0, own);
			else set(c.i, c.color, 0, -1, 0, own);
			continue;
		}
		if (map.paint === 'realms') {
			if (c.realm) {
				const dim = map.lit && map.lit !== c.realm;
				set(c.i, bright(hex(REALM_COLOR[c.realm]), dim ? 0 : 1), dim ? 0.38 : 1, -1, 0, REALMS.indexOf(c.realm) + 1);
			} else set(c.i, c.color, c.statelet ? 0.16 : 0, -1, 0, own);
			continue;
		}
		const who = holderAt(BORDER_SITES[c.i], map.year).polity;
		const realm = REALMS.find((r) => r === who);
		if (realm) set(c.i, bright(hex(REALM_COLOR[realm]), 1), 1, -1, 0, REALMS.indexOf(realm) + 1);
		else if (who === 'china') set(c.i, hex(EMPIRE), 0.45, -1, 0, 4);
		else set(c.i, c.color, 0, -1, 0, own);
	}
}

/** A soft glow over the kingdom a shot is about, clipped to the land. */
export function mapGlow(map: MapShow): { x: number; y: number; r: number; color: string; amount: number } {
	if (map.lit) {
		const f = FOCUS[map.focus];
		return { x: f.x, y: f.y, r: 90, color: REALM_COLOR[map.lit], amount: 0.8 };
	}
	if (map.arrows) return { x: WANGGEOM[0], y: WANGGEOM[1], r: 70, color: '#ff9a4a', amount: 0.9 };
	return { x: 0, y: 0, r: 1, color: '#000000', amount: 0 };
}

/* ── refugee arrows ────────────────────────────────────────────── */

/** Out of the fallen capital in every direction, to where the small kingdoms will stand. */
export const ARROWS: { to: Pt; bend: number }[] = [
	{ to: [226, 238], bend: -0.22 },
	{ to: [350, 330], bend: 0.18 },
	{ to: [336, 430], bend: 0.12 },
	{ to: [262, 566], bend: -0.16 },
	{ to: [396, 596], bend: 0.2 },
	{ to: [346, 664], bend: 0.08 }
];

/** 0…1 drawn, per arrow. They leave one after another. */
export function arrowReach(map: Pick<MapShow, 'arrows' | 'k'>, i: number): number {
	if (!map.arrows) return 0;
	if (map.arrows === 'hold') return 1;
	const start = 0.04 + i * 0.07;
	return easeInOut(progress(map.k, start, start + 0.5));
}

/** A point along arrow `i`, `u` of the way out: a gentle arc off the straight line. */
export function arrowPoint(i: number, u: number): Pt {
	const { to, bend } = ARROWS[i];
	const [ax, ay] = WANGGEOM;
	const mx = (ax + to[0]) / 2 - (to[1] - ay) * bend;
	const my = (ay + to[1]) / 2 + (to[0] - ax) * bend;
	const a = (1 - u) * (1 - u);
	const b = 2 * u * (1 - u);
	const c = u * u;
	return [a * ax + b * mx + c * to[0], a * ay + b * my + c * to[1]];
}

/* ── the fall ──────────────────────────────────────────────────── */

/** The white mountain, in sheet units. */
export const PAEKTU: Pt = [358, 302];

/** Fraction of the descent shot at which the chariot hits the crater rim. */
export const IMPACT = 0.84;

type V3 = [number, number, number];

/** The fall in world units from the crater's centre: level out of heaven, then the dive onto the south rim. */
const FALL: V3[] = [
	[0.25, 9, 6.8],
	[0, 9.3, 3.2],
	[0, 4.2, 0.7],
	[0, 0.01, 0.034]
];

/** Heights above the crater of the three cloud decks the chariot punches through. */
export const CLOUD_DECKS = [6.6, 3.9, 1.9];

/** 0…1 along the fall, accelerating all the way down. */
export function fallS(k: number): number {
	return k >= IMPACT ? 1 : (k / IMPACT) ** 1.75;
}

/** A point of the fall (cubic Bézier), and its heading. */
export function fallAt(s: number): { pos: V3; dir: V3 } {
	const [a, b, c, d] = FALL;
	const u = 1 - s;
	const pos = [0, 1, 2].map((i) => u * u * u * a[i] + 3 * u * u * s * b[i] + 3 * u * s * s * c[i] + s * s * s * d[i]) as V3;
	const dir = [0, 1, 2].map((i) => 3 * u * u * (b[i] - a[i]) + 6 * u * s * (c[i] - b[i]) + 3 * s * s * (d[i] - c[i])) as V3;
	const l = Math.hypot(...dir) || 1;
	return { pos, dir: dir.map((v) => v / l) as V3 };
}

/** What the frame does around the crash: the white-outs in the clouds, the flash, the impact frame, the shake, the black-out. */
export function descentFx(k: number, t: number) {
	const after = k - IMPACT;
	const alt = fallAt(fallS(k)).pos[1];
	const white = k < IMPACT ? Math.max(...CLOUD_DECKS.map((a) => Math.exp(-(((alt - a) / 0.32) ** 2)))) * 0.92 : 0;
	const flash = Math.max(white, after >= 0 ? Math.max(0, 1 - after / 0.05) : 0);
	const impact = after >= 0.004 && after < 0.02;
	const amp = after >= 0 ? 34 * Math.exp(-after * 28) : k > 0.62 ? (k - 0.62) * 12 : 0;
	const n = (s: number) => Math.sin(t * 61 + s) * 0.6 + Math.sin(t * 37.3 + s * 2.1) * 0.4;
	return {
		flash,
		impact,
		shake: [n(0) * amp, n(4.2) * amp] as Pt,
		blur: smooth(progress(k, 0.9, 1)) * 12,
		black: smooth(progress(k, 0.92, 1))
	};
}
