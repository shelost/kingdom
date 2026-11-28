/**
 * Cut-paper kit: seeded noise, torn ridges and the static shapes a sheet is cut
 * into. Everything is in scene units, a 2000 × 1000 board with a bleed round it
 * so the camera can slide without finding an edge.
 */
export const W = 2000;
export const H = 1000;
export const BLEED = 280;

export type Pt = [number, number];
export type Rng = () => number;

export function rng(seed: number): Rng {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Smooth 1D value noise in −1…1. */
export function wave(seed: number): (x: number) => number {
	const r = rng(seed);
	const n = 256;
	const v = Array.from({ length: n }, () => r() * 2 - 1);
	return (x) => {
		const i = Math.floor(x);
		const f = x - i;
		const a = v[((i % n) + n) % n];
		const b = v[(((i + 1) % n) + n) % n];
		return a + (b - a) * f * f * (3 - 2 * f);
	};
}

export function fbm(seed: number): (x: number) => number {
	const a = wave(seed);
	const b = wave(seed + 101);
	const c = wave(seed + 202);
	return (x) => a(x) * 0.6 + b(x * 2.1) * 0.28 + c(x * 4.7) * 0.12;
}

export const ease = (k: number) => {
	const u = Math.min(1, Math.max(0, k));
	return u * u * (3 - 2 * u);
};

/** 0 before `a`, 1 after `b`, eased between. */
export const span = (k: number, a: number, b: number) => ease((k - a) / (b - a));

export function mix(a: string, b: string, t: number): string {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const x = p(a);
	const y = p(b);
	return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

export function rgba(hex: string, a: number): string {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}

/** A torn edge across the board. */
export function ridge(seed: number, y: number, amp: number, freq = 1, torn = 2.6, x0 = -BLEED, x1 = W + BLEED): Pt[] {
	const f = fbm(seed);
	const r = rng(seed + 7);
	const pts: Pt[] = [];
	for (let x = x0; x <= x1; x += 7) pts.push([x, y + f((x / W) * 6 * freq) * amp + (r() - 0.5) * torn]);
	return pts;
}

/** A torn edge lifted into mountains. `w` is the half-width of each peak. */
export function peaks(seed: number, base: number, list: { x: number; h: number; w: number }[], rough = 14, torn = 2.6): Pt[] {
	const f = fbm(seed);
	const crag = fbm(seed + 9);
	const r = rng(seed + 3);
	const pts: Pt[] = [];
	for (let x = -BLEED; x <= W + BLEED; x += 6) {
		let lift = 0;
		for (const p of list) lift = Math.max(lift, p.h * Math.exp(-Math.pow(Math.abs(x - p.x) / p.w, 1.35)));
		const rock = crag((x / W) * 38) * lift * 0.07;
		pts.push([x, base - lift + f((x / W) * 14) * rough * (0.4 + lift / 400) + rock + (r() - 0.5) * torn]);
	}
	return pts;
}

/** Roughen a hand-placed outline into torn rock: every edge split and nudged. */
export function jag(pts: Pt[], seed: number, amp = 10, step = 12): Pt[] {
	const f = fbm(seed);
	const out: Pt[] = [];
	let u = 0;
	for (let i = 0; i < pts.length - 1; i++) {
		const [x0, y0] = pts[i];
		const [x1, y1] = pts[i + 1];
		const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
		for (let j = 0; j < n; j++, u++) {
			const t = j / n;
			out.push([x0 + (x1 - x0) * t + f(u * 0.31) * amp, y0 + (y1 - y0) * t + f(u * 0.31 + 50) * amp]);
		}
	}
	out.push(pts[pts.length - 1]);
	return out;
}

/** Height of a ridge at `x`, so figures stand on the paper. */
export function yAt(pts: Pt[], x: number): number {
	if (x <= pts[0][0]) return pts[0][1];
	for (let i = 1; i < pts.length; i++) {
		if (pts[i][0] >= x) {
			const [x0, y0] = pts[i - 1];
			const [x1, y1] = pts[i];
			return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1);
		}
	}
	return pts[pts.length - 1][1];
}

/** A walking lane along a ridge from `x0` to `x1` (either way), lifted `up` off the edge. */
export function lane(pts: Pt[], x0: number, x1: number, up = 0): Pt[] {
	const lo = Math.min(x0, x1);
	const hi = Math.max(x0, x1);
	const out = pts.filter(([x], i) => x >= lo && x <= hi && i % 4 === 0).map(([x, y]) => [x, y - up] as Pt);
	return x0 > x1 ? out.reverse() : out;
}

/** Close a ridge down past the bottom of the board. */
export function fillTo(p: Path2D, pts: Pt[], bottom = H + BLEED): void {
	p.moveTo(pts[0][0], bottom);
	for (const [x, y] of pts) p.lineTo(x, y);
	p.lineTo(pts[pts.length - 1][0], bottom);
	p.closePath();
}

/** Close a ridge up past the top of the board (a ceiling of cloud, a cave mouth). */
export function fillUp(p: Path2D, pts: Pt[], top = -BLEED): void {
	p.moveTo(pts[0][0], top);
	for (const [x, y] of pts) p.lineTo(x, y);
	p.lineTo(pts[pts.length - 1][0], top);
	p.closePath();
}

/** Signed area; positive is clockwise on a y-down board. */
function area(pts: Pt[]): number {
	let s = 0;
	for (let i = 0; i < pts.length; i++) {
		const [x1, y1] = pts[i];
		const [x2, y2] = pts[(i + 1) % pts.length];
		s += x1 * y2 - x2 * y1;
	}
	return s;
}

type Pathy = Path2D | CanvasRenderingContext2D;

/** A polygon wound clockwise, so overlapping pieces of one sheet union instead of punching holes. */
export function poly(p: Pathy, pts: Pt[]): void {
	const list = area(pts) < 0 ? [...pts].reverse() : pts;
	p.moveTo(list[0][0], list[0][1]);
	for (let i = 1; i < list.length; i++) p.lineTo(list[i][0], list[i][1]);
	p.closePath();
}

export function disc(p: Pathy, x: number, y: number, r: number): void {
	p.moveTo(x + r, y);
	p.arc(x, y, r, 0, Math.PI * 2, false);
	p.closePath();
}

/** A tapering band along a centreline: tails, plumes, branches, ribbons, smoke. */
export function strand(p: Pathy, line: Pt[], w0: number, w1 = w0): void {
	if (line.length < 2) return;
	const left: Pt[] = [];
	const right: Pt[] = [];
	for (let i = 0; i < line.length; i++) {
		const a = line[Math.max(0, i - 1)];
		const b = line[Math.min(line.length - 1, i + 1)];
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const l = Math.hypot(dx, dy) || 1;
		const w = (w0 + (w1 - w0) * (i / (line.length - 1))) / 2;
		left.push([line[i][0] - (dy / l) * w, line[i][1] + (dx / l) * w]);
		right.push([line[i][0] + (dy / l) * w, line[i][1] - (dx / l) * w]);
	}
	poly(p, [...left, ...right.reverse()]);
}

/** Points along a quadratic curve. */
export function curve(a: Pt, c: Pt, b: Pt, n = 12): Pt[] {
	const out: Pt[] = [];
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const u = 1 - t;
		out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
	}
	return out;
}

/** An irregular torn blob. */
export function blob(p: Pathy, cx: number, cy: number, rx: number, ry: number, seed: number, rough = 0.12): void {
	const f = wave(seed);
	const pts: Pt[] = [];
	for (let i = 0; i < 36; i++) {
		const a = (i / 36) * Math.PI * 2;
		const k = 1 + f(i * 0.7) * rough;
		pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
	}
	poly(p, pts);
}

/** A cumulus: torn puffs of uneven size sitting on a flat underside, tallest in the middle. */
export function cloud(p: Pathy, x: number, y: number, w: number, h: number, seed: number): void {
	const r = rng(seed);
	poly(p, [
		[x, y],
		[x + w * 0.05, y - h * 0.28],
		[x + w * 0.95, y - h * 0.3],
		[x + w, y]
	]);
	let cx = x + h * 0.35;
	let i = 0;
	while (cx < x + w - h * 0.3) {
		const t = (cx - x) / w;
		const rr = h * (0.22 + 0.42 * Math.sin(Math.PI * t)) * (0.75 + r() * 0.5);
		blob(p, cx, y - rr + 2, rr * (1.05 + r() * 0.25), rr, seed * 7 + i++, 0.07);
		cx += rr * (0.8 + r() * 0.7);
	}
	for (let j = 0; j < Math.max(1, Math.round(w / (h * 3.2))); j++) {
		const rr = h * (0.38 + r() * 0.24);
		blob(p, x + w * (0.28 + r() * 0.44), y - h * 0.62 - rr * 0.35, rr * 1.15, rr, seed * 13 + j, 0.07);
	}
}

/** A Korean pine: a leaning, twisting trunk with flat cushions of needles. */
export function pine(p: Pathy, x: number, y: number, h: number, seed: number, lean = 0.2): void {
	const r = rng(seed);
	const top: Pt = [x + h * lean, y - h];
	const trunk = curve([x, y], [x - h * lean * 0.8, y - h * 0.5], top, 10);
	strand(p, trunk, h * 0.07, h * 0.025);
	const tiers = 4;
	for (let i = 0; i < tiers; i++) {
		const at = trunk[Math.round(4 + (i / (tiers - 1)) * 6)];
		const side = i % 2 === 0 ? 1 : -1;
		const reach = h * (0.32 - i * 0.05) * (0.8 + r() * 0.4);
		const tip: Pt = [at[0] + side * reach, at[1] - h * 0.05];
		strand(p, [at, [at[0] + side * reach * 0.5, at[1] - h * 0.02], tip], h * 0.02, h * 0.01);
		blob(p, tip[0], tip[1] - h * 0.03, reach * 0.55, h * 0.07, seed + i * 13, 0.28);
	}
	blob(p, top[0], top[1], h * 0.16, h * 0.07, seed + 99, 0.28);
}

/** A birch: tall pale trunk, thin branches, a loose crown. */
export function birch(p: Pathy, x: number, y: number, h: number, seed: number): void {
	const r = rng(seed);
	strand(p, curve([x, y], [x + h * 0.04, y - h * 0.5], [x - h * 0.02, y - h], 10), h * 0.045, h * 0.015);
	for (let i = 0; i < 7; i++) {
		const at = y - h * (0.45 + i * 0.075);
		const side = i % 2 === 0 ? 1 : -1;
		const reach = h * (0.24 - i * 0.02) * (0.8 + r() * 0.4);
		strand(p, curve([x, at], [x + side * reach * 0.5, at - h * 0.08], [x + side * reach, at - h * 0.14], 6), h * 0.012, h * 0.004);
		blob(p, x + side * reach, at - h * 0.17, reach * 0.42, h * 0.07, seed + i * 7, 0.3);
	}
	blob(p, x, y - h * 1.02, h * 0.18, h * 0.12, seed + 77, 0.3);
}

/** A tiled roof with upturned eaves, `y` at the eave line. */
export function roof(p: Pathy, cx: number, y: number, w: number, h: number): void {
	const lift = h * 0.38;
	const pts: Pt[] = [
		...curve([cx - w / 2, y - lift], [cx - w * 0.4, y + h * 0.02], [cx - w * 0.3, y], 6),
		...curve([cx + w * 0.3, y], [cx + w * 0.4, y + h * 0.02], [cx + w / 2, y - lift], 6),
		[cx + w * 0.3, y - h * 0.62],
		[cx + w * 0.26, y - h],
		[cx - w * 0.26, y - h],
		[cx - w * 0.3, y - h * 0.62]
	];
	poly(p, pts);
}

/** A hall: base, posts, and a roof. */
export function hall(p: Pathy, cx: number, y: number, w: number, h: number, tiers = 1): void {
	poly(p, [
		[cx - w * 0.42, y],
		[cx + w * 0.42, y],
		[cx + w * 0.42, y - h * 0.08],
		[cx - w * 0.42, y - h * 0.08]
	]);
	let base = y - h * 0.08;
	for (let i = 0; i < tiers; i++) {
		const tw = w * (1 - i * 0.22);
		const body = h * (i === 0 ? 0.36 : 0.22);
		poly(p, [
			[cx - tw * 0.32, base],
			[cx + tw * 0.32, base],
			[cx + tw * 0.32, base - body],
			[cx - tw * 0.32, base - body]
		]);
		roof(p, cx, base - body, tw, h * 0.34);
		base -= body + h * 0.2;
	}
}

/** A walled town: crenellated wall, a gate tower, roofs behind. */
export function town(p: Pathy, x: number, y: number, w: number, h: number, seed: number): void {
	const r = rng(seed);
	for (let i = 0; i < Math.round(w / 140); i++) {
		const cx = x + 60 + r() * (w - 120);
		hall(p, cx, y - h * 0.5, 90 + r() * 70, h * (0.5 + r() * 0.3));
	}
	const wall: Pt[] = [
		[x, y],
		[x + w, y]
	];
	const step = 22;
	for (let cx = x + w; cx >= x; cx -= step) {
		const up = Math.round((cx - x) / step) % 2 === 0;
		wall.push([cx, y - h * (up ? 0.56 : 0.5)]);
		wall.push([cx - step, y - h * (up ? 0.56 : 0.5)]);
	}
	poly(p, wall);
	hall(p, x + w * 0.5, y - h * 0.5, w * 0.22, h * 1.1, 2);
}

let grain: HTMLCanvasElement | null = null;

/** Paper fibre: light and dark specks and short hairs on a clear tile. */
export function fibres(): HTMLCanvasElement {
	if (grain) return grain;
	const c = document.createElement('canvas');
	c.width = c.height = 256;
	const g = c.getContext('2d')!;
	const r = rng(41);
	for (let i = 0; i < 1600; i++) {
		g.fillStyle = r() < 0.5 ? `rgba(255,255,255,${0.04 + r() * 0.08})` : `rgba(0,0,0,${0.04 + r() * 0.08})`;
		g.fillRect(r() * 256, r() * 256, 1 + r() * 1.5, 1 + r() * 1.5);
	}
	g.lineWidth = 0.7;
	for (let i = 0; i < 240; i++) {
		const x = r() * 256;
		const y = r() * 256;
		const a = r() * Math.PI * 2;
		const l = 4 + r() * 12;
		g.strokeStyle = `rgba(255,255,255,${0.05 + r() * 0.08})`;
		g.beginPath();
		g.moveTo(x, y);
		g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
		g.stroke();
	}
	grain = c;
	return c;
}
