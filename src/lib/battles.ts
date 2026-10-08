/**
 * Battle maps: one JSON file per battle in `data/battles/`, drawn by BattleMap.
 * The field is a local 1000 × 560 sheet (x east, y south). Troops are dots at one
 * fixed rate for the whole book, so the odds read at a glance from battle to battle.
 */
import { KINGDOMS } from '$lib/people';
import type { Pt } from '$lib/mapPaths';

/** Men per dot, everywhere. */
export const MEN_PER_DOT = 1000;
export const FIELD = { w: 1000, h: 560 };

/**
 * Who holds a feature: `side` at the start, then `hold` by phase id as it changes hands
 * (a phase not listed keeps the last holder). Its flag flies that side's banner.
 */
type Held = { side?: string; hold?: Record<string, string> };

/** `labelAt` moves a feature's name off the spot where the action happens. */
export type Terrain = { labelAt?: Pt } & (
	| { kind: 'sea' | 'lake' | 'marsh' | 'forest' | 'plain'; points: Pt[]; label?: string; ko?: string }
	/** A walled town's ground; with a holder it flies a flag at its centre. */
	| ({ kind: 'town'; points: Pt[]; label?: string; ko?: string } & Held)
	| { kind: 'river' | 'road' | 'ridge' | 'wall'; points: Pt[]; width?: number; label?: string; ko?: string }
	| { kind: 'hill' | 'mountain'; at: Pt; r?: number; label?: string; ko?: string }
	| ({ kind: 'fort' | 'city' | 'camp' | 'gate' | 'shrine'; at: Pt; label?: string; ko?: string } & Held)
	| { kind: 'label'; at: Pt; label: string; ko?: string }
	| ({
			/** Built earthworks that change between phases (Ansi's earthen mountain). */
			kind: 'mound';
			at: Pt;
			r?: number;
			/** Height by phase id, 0 (not yet raised) to 1 (full); a phase not listed keeps the last value. */
			rise: Record<string, number>;
			label?: string;
			ko?: string;
	  } & Held)
);

/** The side holding a feature at phase `index`. */
export function heldBy(b: Battle, t: Terrain, index: number): string | undefined {
	let side = 'side' in t ? t.side : undefined;
	const hold = 'hold' in t ? t.hold : undefined;
	if (hold) for (const p of b.phases.slice(0, index + 1)) if (p.id in hold) side = hold[p.id];
	return side;
}

/** A mound's height and holder at phase `index` (the last listed phase at or before it wins). */
export function moundAt(b: Battle, t: Extract<Terrain, { kind: 'mound' }>, index: number): { rise: number; hold?: string } {
	let rise = 0;
	b.phases.slice(0, index + 1).forEach((p) => {
		if (p.id in t.rise) rise = t.rise[p.id];
	});
	return { rise, hold: heldBy(b, t, index) };
}

/** Kinds that fly a flag once someone holds them; the mound flies its own from its summit. */
const FLAGGED = new Set<Terrain['kind']>(['fort', 'city', 'camp', 'gate', 'town']);

/** Every feature that flies a flag, with the field point it stands on (a town's flag stands at its centre). */
export function flagSites(b: Battle): { i: number; t: Terrain; at: Pt }[] {
	return b.terrain.flatMap((t, i) => {
		const held = t as Held;
		if (!FLAGGED.has(t.kind) || !(held.side || held.hold)) return [];
		const at: Pt =
			'at' in t
				? t.at
				: [t.points.reduce((s, p) => s + p[0], 0) / t.points.length, t.points.reduce((s, p) => s + p[1], 0) / t.points.length];
		return [{ i, t, at }];
	});
}

export type BattleSide = {
	id: string;
	name: string;
	ko: string;
	/** A KINGDOMS key: takes its colour unless `color` is set. */
	kingdom?: string;
	color?: string;
};

/**
 * `unrecorded`: no record gives this force's size. Its `men` only sets how many dots
 * stand in for it; they draw hollow, the label says so, and the tallies leave it out.
 */
export type BattleUnit = {
	id: string;
	side: string;
	label: string;
	ko?: string;
	unrecorded?: boolean;
	/** A `people` id: the unit is led by (or is) a named character, drawn with their face. */
	hero?: string;
};

export type Shape = 'block' | 'line' | 'column' | 'wedge' | 'ring' | 'scatter' | 'fleet';

export type UnitState = {
	at: Pt;
	men: number;
	shape?: Shape;
	/** Degrees the front faces: 0 east, 90 south, 180 west, 270 north. */
	facing?: number;
	/** `ring`: radius; other shapes: dot spacing multiplier. */
	r?: number;
	/** `ring`: the arc drawn, in degrees [from, to]. */
	arc?: [number, number];
	/** Fleeing or broken: dots loosen and dim. */
	routed?: boolean;
};

export type ArrowKind = 'advance' | 'charge' | 'retreat' | 'feint' | 'flank' | 'naval' | 'pursuit';

export type BattleArrow = { side: string; kind: ArrowKind; points: Pt[]; label?: string; ko?: string };

export type EventKind = 'clash' | 'fire' | 'death' | 'gate' | 'flood' | 'surrender' | 'ambush';

export type BattleEvent = { kind: EventKind; at: Pt; label?: string; ko?: string };

export type BattlePhase = {
	id: string;
	label: string;
	ko: string;
	caption: string;
	captionKo: string;
	/** Units on the field this phase; a unit missing here is off the map. */
	units: Record<string, UnitState>;
	arrows?: BattleArrow[];
	events?: BattleEvent[];
};

export type Battle = {
	id: string;
	title: string;
	ko: string;
	hanja?: string;
	/** Display year (negative = BCE). */
	year: number;
	/** A `places` id: the corner locator centres on it. */
	place?: string;
	/** Real sheet centre, when the place marker is not it (the relief bake reads this). */
	geo?: { lat: number; lon: number };
	/** Field kilometres covered by `scale.px` field units, for the scale bar. */
	scale?: { km: number; px: number };
	terrain: Terrain[];
	sides: BattleSide[];
	units: BattleUnit[];
	phases: BattlePhase[];
	/** Short citations, e.g. "Samguk Sagi 47, Biography of Gyebek". */
	sources: string[];
	/** What the records leave uncertain, said plainly. */
	note?: string;
	noteKo?: string;
};

const files = import.meta.glob<Battle>('./data/battles/*.json', { eager: true, import: 'default' });

export const BATTLES: Record<string, Battle> = Object.fromEntries(Object.values(files).map((b) => [b.id, b]));

export function sideColor(side: BattleSide | undefined): string {
	return side?.color ?? (side?.kingdom ? KINGDOMS[side.kingdom as keyof typeof KINGDOMS]?.color : undefined) ?? '#8a8a94';
}

type RGB = [number, number, number];
const toRgb = (hex: string): RGB => {
	const h = hex.replace('#', '');
	const f = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
	return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255) as RGB;
};
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
const luma = ([r, g, b]: RGB) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const gap = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function rotateHue([r, g, b]: RGB, deg: number): RGB {
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	if (!d) return [r, g, b];
	const s = d / (1 - Math.abs(2 * l - 1));
	let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	h = (((h * 60 + deg) % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
	return [r1 + m, g1 + m, b1 + m];
}

/**
 * One colour per side, readable on the map: a side too dark to see on a dark field is
 * lifted, and a side too close to one already taken turns round the colour wheel until
 * the two part. Kingdom colours survive untouched whenever they already read.
 */
export function sideColors(b: Battle): Map<string, string> {
	const out = new Map<string, string>();
	const taken: RGB[] = [];
	for (const s of b.sides) {
		let c = toRgb(sideColor(s));
		if (luma(c) < 0.14) c = c.map((v) => v + (0.62 - v) * 0.55) as RGB;
		for (let turn = 0; turn < 8 && taken.some((t) => gap(t, c) < 0.26); turn++) c = rotateHue(c, 45);
		taken.push(c);
		out.set(s.id, toHex(c));
	}
	return out;
}

export const dotsFor = (men: number) => (men > 0 ? Math.max(1, Math.round(men / MEN_PER_DOT)) : 0);

export type FieldDot = {
	key: string;
	unit: string;
	side: string;
	x: number;
	y: number;
	/** On the field this phase (otherwise parked where it last or next stands). */
	on: boolean;
	routed: boolean;
	unrecorded: boolean;
	delay: number;
};

/**
 * Every dot a unit ever fields, with its spot at phase `index`. A dot that is not in
 * that phase stays where it last stood (or first will stand), marked off.
 */
export function fieldDots(b: Battle, index: number): FieldDot[] {
	const out: FieldDot[] = [];
	b.units.forEach((u, ui) => {
		const per = b.phases.map((p) => {
			const s = p.units[u.id];
			return s ? { s, pts: layoutDots(u.id, dotsFor(s.men), s) } : null;
		});
		const max = Math.max(0, ...per.map((p) => p?.pts.length ?? 0));
		for (let i = 0; i < max; i++) {
			const here = per[index];
			let spot: Pt | undefined = here?.pts[i];
			const on = !!spot;
			if (!spot) {
				for (let k = index - 1; k >= 0 && !spot; k--) spot = per[k]?.pts[i];
				for (let k = index + 1; k < per.length && !spot; k++) spot = per[k]?.pts[i];
			}
			if (!spot) continue;
			out.push({
				key: `${u.id}:${i}`,
				unit: u.id,
				side: u.side,
				x: spot[0],
				y: spot[1],
				on,
				routed: !!here?.s.routed,
				unrecorded: !!u.unrecorded,
				delay: (ui % 4) * 0.08 + (i % 17) * 0.018
			});
		}
	});
	return out;
}

/** Each unit on the field at a phase: its dots' centre and their northern edge. */
export function unitSpots(b: Battle, phase: BattlePhase) {
	return b.units.flatMap((u) => {
		const s = phase.units[u.id];
		if (!s || s.men <= 0) return [];
		const pts = layoutDots(u.id, dotsFor(s.men), s);
		const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
		const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
		const top = Math.min(...pts.map((p) => p[1]));
		const reach = Math.max(...pts.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
		return [{ unit: u, state: s, cx, cy, top, reach }];
	});
}

/** Deterministic 0–1 noise per unit and dot, so a layout never jumps between renders. */
function noise(seed: string, i: number, salt = 0): number {
	let h = 2166136261 ^ salt;
	for (let k = 0; k < seed.length; k++) h = Math.imul(h ^ seed.charCodeAt(k), 16777619);
	h = Math.imul(h ^ (i + 1) * 374761393, 668265263);
	h ^= h >>> 13;
	return ((Math.imul(h, 1274126177) >>> 0) % 10000) / 10000;
}

/** Dot gap in field units. */
export const DOT_GAP = 11.5;

/**
 * Field positions for `count` dots of one unit. Index `i` keeps its slot in every
 * phase, so a dot glides from where it stood to where it stands next.
 */
export function layoutDots(id: string, count: number, s: UnitState): Pt[] {
	const gap = DOT_GAP * (s.shape === 'ring' ? 1 : (s.r ?? 1));
	const shape = s.shape ?? 'block';
	const face = ((s.facing ?? 0) * Math.PI) / 180;
	const out: Pt[] = [];
	// local frame: u runs along the front, v runs back from it
	const place = (u: number, v: number, jitter = 0.18) => {
		const ju = (noise(id, out.length, 1) - 0.5) * gap * jitter;
		const jv = (noise(id, out.length, 2) - 0.5) * gap * jitter;
		const uu = u + ju;
		const vv = v + jv;
		// front = (cos, sin) of `face`; u runs along (−sin, cos); v runs back, against the front
		out.push([s.at[0] - Math.sin(face) * uu - Math.cos(face) * vv, s.at[1] + Math.cos(face) * uu - Math.sin(face) * vv]);
	};
	if (shape === 'ring') {
		const r = s.r ?? 60;
		const [a0, a1] = s.arc ?? [0, 360];
		const full = Math.abs(a1 - a0) >= 359;
		const rows = Math.max(1, Math.ceil((count * gap) / (((Math.abs(a1 - a0) * Math.PI) / 180) * r * 1.0)));
		const perRow = Math.ceil(count / rows);
		for (let i = 0; i < count; i++) {
			const row = Math.floor(i / perRow);
			const k = i % perRow;
			const n = Math.min(perRow, count - row * perRow);
			const t = full ? k / n : n > 1 ? k / (n - 1) : 0.5;
			const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
			const rr = r + row * gap;
			out.push([s.at[0] + Math.cos(a) * rr + (noise(id, i, 3) - 0.5) * 2, s.at[1] + Math.sin(a) * rr + (noise(id, i, 4) - 0.5) * 2]);
		}
		return out;
	}
	if (shape === 'scatter' || s.routed) {
		const spread = Math.sqrt(count) * gap * 1.5 + gap * 2;
		for (let i = 0; i < count; i++) {
			const a = noise(id, i, 5) * Math.PI * 2;
			const d = Math.sqrt(noise(id, i, 6)) * spread;
			out.push([s.at[0] + Math.cos(a) * d * 1.3, s.at[1] + Math.sin(a) * d * 0.8]);
		}
		return out;
	}
	if (shape === 'wedge') {
		let row = 0;
		while (out.length < count) {
			const n = row * 2 + 1;
			for (let k = 0; k < n && out.length < count; k++) place((k - (n - 1) / 2) * gap, row * gap * 0.9 - gap * 2);
			row++;
		}
		return out;
	}
	const ratio = shape === 'line' ? 6 : shape === 'column' ? 0.22 : shape === 'fleet' ? 2.4 : 1.6;
	const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt(count * ratio))));
	const rows = Math.ceil(count / cols);
	const g = shape === 'fleet' ? gap * 1.35 : gap;
	for (let i = 0; i < count; i++) {
		const row = Math.floor(i / cols);
		const k = i % cols;
		const inRow = Math.min(cols, count - row * cols);
		const stagger = row % 2 ? g / 2 : 0;
		place((k - (inRow - 1) / 2) * g + stagger, (row - (rows - 1) / 2) * g * 0.9, shape === 'fleet' ? 0.5 : 0.18);
	}
	return out;
}

/** Recorded strength of every side at a phase, and whether forces of unrecorded size also stand on the field. */
export function strengths(b: Battle, phase: BattlePhase): Record<string, { men: number; unknown: boolean }> {
	const bySide: Record<string, { men: number; unknown: boolean }> = {};
	const unitOf = new Map(b.units.map((u) => [u.id, u]));
	for (const [id, s] of Object.entries(phase.units)) {
		const u = unitOf.get(id);
		if (!u) continue;
		const t = (bySide[u.side] ??= { men: 0, unknown: false });
		if (u.unrecorded) t.unknown ||= s.men > 0;
		else t.men += s.men;
	}
	return bySide;
}
