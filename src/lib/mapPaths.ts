/**
 * Curve geometry for map arrows, in whatever units the points come in
 * (MapExcerpt feeds it screen pixels).
 *
 * A route is a smooth Catmull-Rom curve through its points; a two-point route
 * bows gently to one side so a march never reads as a ruler line. The curve is
 * sampled into a polyline so labels, arrowheads and wave offsets can be found
 * without asking the DOM for path lengths.
 */

export type Pt = [number, number];

export interface Curve {
	/** SVG path data for the smooth curve */
	d: string;
	/** evenly spread samples along the curve, start → end */
	samples: Pt[];
	/** total length of the sampled polyline */
	length: number;
}

const STEPS = 18;
/** a two-point route bows out by this fraction of its length */
const BOW = 0.16;

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Pull an endpoint `by` units toward its neighbour (never past the midpoint). */
function inset(p: Pt, toward: Pt, by: number): Pt {
	const d = dist(p, toward);
	if (!d || !by) return p;
	const k = Math.min(by, d * 0.45) / d;
	return [p[0] + (toward[0] - p[0]) * k, p[1] + (toward[1] - p[1]) * k];
}

function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return [a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0], a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1]];
}

/** Cubic segments of a Catmull-Rom spline through `pts` (two points: one bowed arc). */
function segments(pts: Pt[], bend: number): [Pt, Pt, Pt, Pt][] {
	if (pts.length === 2) {
		const [a, b] = pts;
		const [dx, dy] = sub(b, a);
		const off = BOW * bend;
		const mid: Pt = [(a[0] + b[0]) / 2 - dy * off, (a[1] + b[1]) / 2 + dx * off];
		const c1: Pt = [a[0] + (mid[0] - a[0]) * (2 / 3), a[1] + (mid[1] - a[1]) * (2 / 3)];
		const c2: Pt = [b[0] + (mid[0] - b[0]) * (2 / 3), b[1] + (mid[1] - b[1]) * (2 / 3)];
		return [[a, c1, c2, b]];
	}
	const out: [Pt, Pt, Pt, Pt][] = [];
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[i - 1] ?? pts[i];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[i + 2] ?? p2;
		out.push([
			p1,
			[p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6],
			[p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6],
			p2
		]);
	}
	return out;
}

const n = (v: number) => Math.round(v * 10) / 10;

/**
 * The smooth curve through `points`, trimmed `startGap` / `endGap` units off
 * each end so it starts beside a marker and leaves room for an arrowhead.
 * `bend` (±1) picks which way a two-point route bows.
 */
export function curveThrough(points: Pt[], { startGap = 0, endGap = 0, bend = 1 } = {}): Curve | null {
	const pts = points.filter((p, i) => i === 0 || dist(p, points[i - 1]) > 0.5);
	if (pts.length < 2) return null;
	pts[0] = inset(pts[0], pts[1], startGap);
	pts[pts.length - 1] = inset(pts[pts.length - 1], pts[pts.length - 2], endGap);

	const segs = segments(pts, bend);
	const d = `M${n(segs[0][0][0])},${n(segs[0][0][1])}` + segs.map(([, c1, c2, p]) => `C${n(c1[0])},${n(c1[1])} ${n(c2[0])},${n(c2[1])} ${n(p[0])},${n(p[1])}`).join('');

	const samples: Pt[] = [segs[0][0]];
	for (const [p0, c1, c2, p1] of segs) {
		for (let s = 1; s <= STEPS; s++) samples.push(cubic(p0, c1, c2, p1, s / STEPS));
	}
	let length = 0;
	for (let i = 1; i < samples.length; i++) length += dist(samples[i], samples[i - 1]);
	return { d, samples, length };
}

/** Point and heading (radians) at fraction `t` of the way along the samples. */
export function pointAlong(samples: Pt[], t: number): { x: number; y: number; angle: number } {
	let total = 0;
	for (let i = 1; i < samples.length; i++) total += dist(samples[i], samples[i - 1]);
	let goal = Math.min(Math.max(t, 0), 1) * total;
	for (let i = 1; i < samples.length; i++) {
		const a = samples[i - 1];
		const b = samples[i];
		const step = dist(a, b);
		if (goal <= step || i === samples.length - 1) {
			const k = step ? Math.min(goal / step, 1) : 0;
			return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) };
		}
		goal -= step;
	}
	const [x, y] = samples[0];
	return { x, y, angle: 0 };
}

/** A filled arrowhead whose base sits on the curve's end, tip `size` units beyond it. */
export function arrowHead(samples: Pt[], size: number): string {
	const end = samples[samples.length - 1];
	const prev = samples[Math.max(samples.length - 3, 0)];
	const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	const at = (along: number, across: number): string =>
		`${n(end[0] + along * cos - across * sin)},${n(end[1] + along * sin + across * cos)}`;
	return `M${at(size, 0)}L${at(-size * 0.15, size * 0.62)}L${at(size * 0.12, 0)}L${at(-size * 0.15, -size * 0.62)}Z`;
}

/** The samples redrawn as a gentle sine wave across the curve (sea crossings). */
export function waveAlong(samples: Pt[], amplitude: number, wavelength: number): string {
	const out: Pt[] = [];
	let travelled = 0;
	for (let i = 0; i < samples.length; i++) {
		if (i) travelled += dist(samples[i], samples[i - 1]);
		const a = samples[Math.max(i - 1, 0)];
		const b = samples[Math.min(i + 1, samples.length - 1)];
		const len = dist(a, b) || 1;
		const nx = -(b[1] - a[1]) / len;
		const ny = (b[0] - a[0]) / len;
		const fade = Math.min(1, i / 3, (samples.length - 1 - i) / 3);
		const off = Math.sin((travelled / wavelength) * Math.PI * 2) * amplitude * fade;
		out.push([samples[i][0] + nx * off, samples[i][1] + ny * off]);
	}
	return out.map((p, i) => `${i ? 'L' : 'M'}${n(p[0])},${n(p[1])}`).join('');
}

/** Crossed swords as strokes (blade, guard, grip ×2), centred on 0,0 in a 2-unit box. */
export const CROSSED_SWORDS =
	'M-0.9,-0.9L0.5,0.5M0.25,0.75L0.75,0.25M0.55,0.55L0.9,0.9' +
	'M0.9,-0.9L-0.5,0.5M-0.25,0.75L-0.75,0.25M-0.55,0.55L-0.9,0.9';

/** The fortress glyph the main map draws for walled sites (12×12 box). */
export const FORT_GLYPH = 'M1 11V1.5h2.2v2h1.7v-2h2.2v2h1.7v-2H11V11H7.6V8.4a1.6 1.6 0 0 0-3.2 0V11Z';

/** The five-point star every map draws for royal capitals (12×12 box). */
export const STAR_GLYPH = 'M6 .6 7.6 4.1l3.8.4-2.9 2.6.8 3.8L6 9 2.7 10.9l.8-3.8L.6 4.5l3.8-.4Z';
