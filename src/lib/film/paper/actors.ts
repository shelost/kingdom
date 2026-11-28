/**
 * The moving cut-outs. Each is a pure function of time, drawn in the sheet's
 * own colour on the canvas the renderer hands it, so a scrub lands exactly.
 */
import { blob, cloud, curve, disc, poly, rgba, rng, strand, wave, H, W, BLEED, type Pt } from './kit';

type Ctx = CanvasRenderingContext2D;

export type Who = {
	cap?: 'feather' | 'crown' | 'knot' | 'helm';
	/** 0 arms down, 1 arms raised to the sky. */
	lift?: number;
	/** Bow from the waist, 0…1. */
	bow?: number;
	/** Walk cycle phase in radians; absent, the figure stands. */
	walk?: number;
	pack?: boolean;
	spear?: boolean;
	torch?: boolean;
	/** Reach one hand forward, 0…1. */
	reach?: number;
	/** Hem and sleeve flutter in the wind. */
	wind?: number;
	dir?: 1 | -1;
	skirt?: boolean;
};

/** A standing or walking figure in hanbok, feet at (x, y), about 64 units tall at s = 1. */
export function person(ctx: Ctx, x: number, y: number, s: number, who: Who = {}): Pt {
	const d = who.dir ?? 1;
	const walking = who.walk !== undefined;
	const ph = who.walk ?? 0;
	const wind = who.wind ?? 0;
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s * d, s);
	ctx.translate(0, walking ? -Math.abs(Math.sin(ph)) * 2.4 : 0);
	ctx.beginPath();
	if (walking) {
		const a = Math.sin(ph) * 0.5;
		for (const sw of [a, -a]) {
			poly(ctx, [
				[-1.8, -22],
				[1.8, -22],
				[Math.sin(sw) * 20 + 1.8, -22 + Math.cos(sw) * 22],
				[Math.sin(sw) * 20 - 1.8, -22 + Math.cos(sw) * 22]
			]);
		}
	} else if (!who.skirt) {
		poly(ctx, [
			[-5, -18],
			[-1, -18],
			[-1.5, 0],
			[-5.5, 0]
		]);
		poly(ctx, [
			[1, -18],
			[5, -18],
			[5.5, 0],
			[1.5, 0]
		]);
	}
	const bow = who.bow ?? 0;
	ctx.save();
	ctx.translate(0, -24);
	ctx.rotate(bow * 0.9);
	const hem = who.skirt ? 24 : 10;
	const flap = wind * Math.sin(ph * 0.5 + x * 0.01);
	poly(ctx, [
		[-6.5, -20],
		[6.5, -20],
		[11 + flap * 3, hem],
		[-11 - (who.skirt ? 2 : 0) + flap * 4, hem]
	]);
	const lift = who.lift ?? 0;
	const reach = who.reach ?? 0;
	for (const side of [-1, 1]) {
		const up = side === 1 && who.torch ? 0.85 : lift;
		const fwd = side === 1 ? reach : 0;
		/* 0 hangs straight down, π points at the sky; positive swings outward on that side. */
		const ang = 0.25 + up * 2.35 + fwd * 1.2;
		const shoulder: Pt = [side * 5.5, -18];
		const len = 19;
		const hand: Pt = [shoulder[0] + Math.sin(ang) * len * side, shoulder[1] + Math.cos(ang) * len];
		strand(ctx, [shoulder, [(shoulder[0] + hand[0]) / 2 + side * 2, (shoulder[1] + hand[1]) / 2], hand], 7 + wind, 4);
		if (side === 1 && who.torch) {
			strand(ctx, [hand, [hand[0] + 2, hand[1] - 16]], 2.2, 2.6);
		}
		if (side === 1 && who.spear) {
			strand(ctx, [[hand[0], hand[1] + 14], [hand[0] + 4, hand[1] - 72]], 2, 1.6);
			poly(ctx, [
				[hand[0] + 1.5, hand[1] - 71],
				[hand[0] + 6.5, hand[1] - 71],
				[hand[0] + 4.5, hand[1] - 84]
			]);
		}
	}
	if (who.pack) disc(ctx, -9, -10, 7.5);
	disc(ctx, 0, -27, 6);
	const cap = who.cap ?? 'knot';
	if (cap === 'knot') disc(ctx, -1, -34, 2.6);
	if (cap === 'feather') {
		poly(ctx, [
			[-4.5, -31],
			[4.5, -31],
			[3.5, -37],
			[-3.5, -37]
		]);
		for (const sx of [-1, 1]) strand(ctx, curve([sx * 1.5, -36], [sx * 2 - 4, -43], [sx * 2 - 11 - wind * 2, -47 + Math.sin(ph + sx) * wind * 0.6], 6), 1.8, 0.5);
	}
	if (cap === 'crown') {
		poly(ctx, [
			[-6, -31],
			[6, -31],
			[6.5, -36],
			[-6.5, -36]
		]);
		for (const sx of [-5, 0, 5]) poly(ctx, [[sx - 1.6, -35], [sx + 1.6, -35], [sx, -45]]);
	}
	if (cap === 'helm') {
		poly(ctx, [
			[-7, -27],
			[7, -27],
			[3, -36],
			[0, -46],
			[-3, -36]
		]);
	}
	ctx.restore();
	ctx.fill();
	ctx.restore();
	return [x, y - 64 * s];
}

/** Figures strung along a path and walking it. `speed` is units per second along the path. */
export function procession(
	ctx: Ctx,
	path: Pt[],
	n: number,
	t: number,
	o: { s: number; s1?: number; speed: number; gap?: number; who?: (i: number) => Who; seed?: number }
): void {
	const lens: number[] = [0];
	for (let i = 1; i < path.length; i++) lens.push(lens[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
	const total = lens[lens.length - 1];
	const r = rng(o.seed ?? 5);
	const gap = o.gap ?? total / n;
	for (let i = 0; i < n; i++) {
		const jitter = r() * gap * 0.5;
		const dist = (((i * gap + jitter + o.speed * t) % total) + total) % total;
		let j = 1;
		while (j < lens.length - 1 && lens[j] < dist) j++;
		const f = (dist - lens[j - 1]) / (lens[j] - lens[j - 1] || 1);
		const a = path[j - 1];
		const b = path[j];
		const px = a[0] + (b[0] - a[0]) * f;
		const py = a[1] + (b[1] - a[1]) * f;
		const u = dist / total;
		const fade = Math.min(1, u / 0.06, (1 - u) / 0.06);
		const s = o.s + ((o.s1 ?? o.s) - o.s) * u;
		ctx.globalAlpha = fade;
		const who = o.who?.(i) ?? { pack: i % 3 === 0 };
		person(ctx, px, py, s, { ...who, walk: t * 5.2 + i * 1.7, dir: b[0] >= a[0] ? 1 : -1 });
	}
	ctx.globalAlpha = 1;
}

/**
 * A minhwa tiger lying on its belly, paws out, head up, a long pipe in its jaws:
 * an ochre coat with black stripes cut into it. Returns the pipe bowl, where the
 * smoke leaves.
 */
export function tiger(
	ctx: Ctx,
	x: number,
	y: number,
	s: number,
	t: number,
	paint: { coat: string; stripe: string; eye: string; grain: CanvasPattern | null }
): Pt {
	const { coat, stripe, eye, grain } = paint;
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	const breath = Math.sin(t * 1.4) * 1.6;
	const sway = Math.sin(t * 0.9);
	const hx = 128;
	const hy = -86 + breath * 0.4;
	const tail = curve([-136, -34], [-236, -14 + sway * 10], [-216, -132 + sway * 18], 16);
	const body = new Path2D();
	body.moveTo(-140, 0);
	body.bezierCurveTo(-152, -42, -122, -68, -70, -66 - breath);
	body.bezierCurveTo(-10, -64 - breath, 52, -78 - breath, 92, -70);
	body.bezierCurveTo(114, -62, 120, -30, 112, 0);
	body.closePath();
	blob(body, -100, -30, 52, 34, 5, 0.05);
	strand(body, [[70, -14], [130, -11], [180, -9]], 24, 19);
	disc(body, 180, -10, 10);
	blob(body, hx, hy, 35, 31, 9, 0.06);
	poly(body, [
		[hx - 26, hy + 2],
		[hx - 46, hy + 24],
		[hx - 16, hy + 26]
	]);
	poly(body, [
		[hx + 18, hy + 16],
		[hx + 34, hy + 34],
		[hx + 4, hy + 30]
	]);
	disc(body, hx - 18, hy - 27, 10);
	disc(body, hx + 16, hy - 29, 10);
	blob(body, hx + 30, hy + 9, 19, 15, 12, 0.05);
	strand(body, tail, 18, 9);
	ctx.fillStyle = coat;
	ctx.fill(body);
	ctx.save();
	ctx.clip(body);
	ctx.shadowColor = 'transparent';
	ctx.fillStyle = stripe;
	ctx.beginPath();
	for (const sx of [-124, -96, -66, -36, -6, 24, 54, 82]) strand(ctx, curve([sx, -86], [sx + 12, -54], [sx - 4, -26], 6), 11, 1.5);
	for (const sx of [-112, -84, -56]) strand(ctx, curve([sx, 4], [sx + 6, -12], [sx + 2, -22], 4), 8, 1);
	for (let i = 3; i < tail.length - 1; i += 3) {
		const [px, py] = tail[i];
		strand(ctx, [[px - 12, py - 4], [px + 12, py + 4]], 6, 4);
	}
	for (const sx of [-14, 0, 14]) strand(ctx, [[hx + sx, hy - 32], [hx + sx * 0.6, hy - 16]], 5, 1);
	strand(ctx, [[hx - 34, hy + 2], [hx - 16, hy + 6]], 4, 1);
	for (const sx of [110, 136, 160]) strand(ctx, [[sx, -22], [sx + 4, -4]], 5, 1);
	ctx.fill();
	const belly = ctx.createLinearGradient(0, -120, 0, 0);
	belly.addColorStop(0, 'rgba(0,0,0,0)');
	belly.addColorStop(1, 'rgba(0,0,0,0.42)');
	ctx.fillStyle = belly;
	ctx.fill(body);
	if (grain) {
		ctx.globalAlpha = 0.6;
		ctx.fillStyle = grain;
		ctx.fill(body);
		ctx.globalAlpha = 1;
	}
	ctx.restore();
	ctx.fillStyle = stripe;
	ctx.beginPath();
	disc(ctx, hx + 46, hy + 4, 4.5);
	const blink = t % 5.3 < 0.14 ? 0.15 : 1;
	ctx.fill();
	ctx.fillStyle = eye;
	ctx.beginPath();
	blob(ctx, hx + 8, hy - 6, 6, 4 * blink, 3, 0.02);
	ctx.fill();
	ctx.fillStyle = stripe;
	ctx.beginPath();
	poly(ctx, [
		[hx + 7, hy - 6 - 3.6 * blink],
		[hx + 9.5, hy - 6 - 3.6 * blink],
		[hx + 9.5, hy - 6 + 3.6 * blink],
		[hx + 7, hy - 6 + 3.6 * blink]
	]);
	const bowl: Pt = [340, -186];
	strand(ctx, [[hx + 44, hy + 16], [240, -130], [bowl[0] - 6, bowl[1] + 6]], 4.2, 3);
	poly(ctx, [
		[bowl[0] - 10, bowl[1] + 2],
		[bowl[0] + 10, bowl[1] - 6],
		[bowl[0] + 14, bowl[1] + 10],
		[bowl[0] - 4, bowl[1] + 14]
	]);
	ctx.fill();
	const ember = 0.55 + 0.45 * Math.sin(t * 2.2) ** 2;
	ctx.fillStyle = rgba('#ff9a3c', ember);
	ctx.shadowColor = '#ff7a20';
	ctx.shadowBlur = 18;
	ctx.beginPath();
	disc(ctx, bowl[0] + 2, bowl[1] - 1, 5);
	ctx.fill();
	ctx.restore();
	return [x + bowl[0] * s, y + bowl[1] * s];
}

/** Paper smoke curling up from a point and thinning out. */
export function smoke(ctx: Ctx, x: number, y: number, t: number, color: string, rise = 340, n = 9): void {
	const w = wave(17);
	ctx.save();
	ctx.shadowColor = 'rgba(0,0,0,0.25)';
	for (let i = 0; i < n; i++) {
		const age = (t * 0.16 + i / n) % 1;
		const px = x + w(i * 3 + age * 4) * 70 * age + age * 120;
		const py = y - age * rise;
		const r = 8 + age * 46;
		ctx.globalAlpha = Math.min(1, age * 6) * (1 - age) * 0.85;
		ctx.fillStyle = color;
		ctx.beginPath();
		blob(ctx, px, py, r * 1.4, r * 0.7, i * 31 + Math.floor(t * 0.16 + i / n), 0.25);
		ctx.fill();
	}
	ctx.restore();
}

/** The chariot on its five-colour cloud, wheel turning, ribbons streaming. */
export function chariot(ctx: Ctx, x: number, y: number, s: number, t: number, colors: string[]): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(s, s);
	colors.forEach((c, i) => {
		ctx.fillStyle = c;
		ctx.beginPath();
		cloud(ctx, -110 + i * 10, 40 + i * 9, 220 - i * 20, 46 - i * 4, 40 + i);
		ctx.fill();
	});
	ctx.fillStyle = '#1a1410';
	ctx.beginPath();
	poly(ctx, [
		[-46, 0],
		[46, 0],
		[40, -34],
		[-50, -34]
	]);
	const spin = t * 3;
	disc(ctx, 0, 10, 26);
	for (let i = 0; i < 8; i++) {
		const a = spin + (i / 8) * Math.PI * 2;
		strand(ctx, [[0, 10], [Math.cos(a) * 24, 10 + Math.sin(a) * 24]], 3);
	}
	ctx.fill();
	ctx.fillStyle = '#f6e7c4';
	ctx.beginPath();
	disc(ctx, 0, 10, 19);
	ctx.fill();
	ctx.fillStyle = '#1a1410';
	ctx.beginPath();
	for (let i = 0; i < 8; i++) {
		const a = spin + (i / 8) * Math.PI * 2;
		strand(ctx, [[0, 10], [Math.cos(a) * 20, 10 + Math.sin(a) * 20]], 2.4);
	}
	disc(ctx, 0, 10, 4);
	ctx.fill();
	person(ctx, -6, -30, 1.25, { cap: 'crown', lift: 0.2, wind: 2 });
	ctx.fillStyle = '#c8302c';
	ctx.beginPath();
	for (let i = 0; i < 2; i++) {
		const line: Pt[] = [];
		for (let j = 0; j <= 10; j++) line.push([-8 - j * 12, -72 - j * 9 + Math.sin(t * 5 + j * 0.6 + i) * (2 + j * 1.4) + i * 8]);
		strand(ctx, line, 5, 1.5);
	}
	ctx.fill();
	ctx.restore();
}

/** Paper flames. `grow` 0…1 lifts them. */
export function flames(ctx: Ctx, x: number, y: number, w: number, h: number, t: number, seed: number, grow = 1): void {
	const f = wave(seed);
	const n = Math.max(3, Math.round(w / 28));
	ctx.save();
	for (const [color, scale, glow] of [
		['#d8461f', 1, 28],
		['#ff9a3c', 0.68, 18],
		['#ffd77a', 0.38, 10]
	] as const) {
		ctx.fillStyle = color;
		ctx.shadowColor = color;
		ctx.shadowBlur = glow;
		ctx.beginPath();
		for (let i = 0; i < n; i++) {
			const cx = x + ((i + 0.5) / n) * w;
			const hh = h * grow * scale * (0.55 + 0.45 * (f(t * 2.6 + i * 1.9) * 0.5 + 0.5));
			const sway = f(t * 3.1 + i * 3.3) * 14 * scale;
			const bw = (w / n) * 0.95 * (0.6 + scale * 0.4);
			poly(ctx, [
				[cx - bw / 2, y],
				[cx + bw / 2, y],
				[cx + bw * 0.25 + sway * 0.4, y - hh * 0.5],
				[cx + sway, y - hh],
				[cx - bw * 0.3 + sway * 0.4, y - hh * 0.45]
			]);
		}
		ctx.fill();
	}
	ctx.restore();
}

/** Snow drifting down across the whole board. */
export function snow(ctx: Ctx, t: number, n: number, seed: number, size = 3, alpha = 0.85): void {
	const r = rng(seed);
	ctx.save();
	ctx.shadowColor = 'transparent';
	ctx.fillStyle = `rgba(240,244,250,${alpha})`;
	ctx.beginPath();
	const tall = H + BLEED * 2;
	for (let i = 0; i < n; i++) {
		const x0 = r() * (W + BLEED * 2) - BLEED;
		const y0 = r() * tall;
		const v = 26 + r() * 40;
		const y = ((y0 + t * v) % tall) - BLEED;
		const x = x0 + Math.sin(t * 0.7 + i) * 18 + t * 8;
		disc(ctx, ((x + BLEED) % (W + BLEED * 2)) - BLEED, y, size * (0.5 + r()));
	}
	ctx.fill();
	ctx.restore();
}

/** Leaves or petals spinning down. */
export function leaves(ctx: Ctx, t: number, n: number, seed: number, colors: string[], x0 = 0, x1 = W): void {
	const r = rng(seed);
	ctx.save();
	const tall = H + BLEED;
	for (let i = 0; i < n; i++) {
		const sx = x0 + r() * (x1 - x0);
		const v = 30 + r() * 30;
		const y = ((r() * tall + t * v) % tall) - BLEED * 0.5;
		const x = sx + Math.sin(t * 0.9 + i * 1.3) * 40;
		const a = t * (1 + r()) + i;
		ctx.fillStyle = colors[i % colors.length];
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(a);
		ctx.scale(1, Math.abs(Math.cos(a * 1.3)) * 0.8 + 0.2);
		ctx.beginPath();
		poly(ctx, [
			[-9, 0],
			[0, -5],
			[9, 0],
			[0, 5]
		]);
		ctx.fill();
		ctx.restore();
	}
	ctx.restore();
}

/** A banner on a pole, cloth waving. */
export function banner(ctx: Ctx, x: number, y: number, h: number, t: number, cloth: string, w = 70): void {
	ctx.beginPath();
	strand(ctx, [[x, y], [x, y - h]], 4, 3);
	ctx.fill();
	ctx.save();
	ctx.fillStyle = cloth;
	const n = 10;
	const top: Pt[] = [];
	const bottom: Pt[] = [];
	for (let i = 0; i <= n; i++) {
		const u = i / n;
		const dy = Math.sin(t * 4.2 - u * 5 + x * 0.01) * 9 * u;
		top.push([x + u * w, y - h + 4 + dy]);
		bottom.push([x + u * w, y - h + w * 0.55 + dy - u * 10]);
	}
	ctx.beginPath();
	poly(ctx, [...top, ...bottom.reverse()]);
	ctx.fill();
	ctx.restore();
}

/** A boat riding the swell. */
export function boat(ctx: Ctx, x: number, y: number, s: number, t: number, sail: string): void {
	const bob = Math.sin(t * 1.3 + x * 0.01) * 5;
	const tilt = Math.sin(t * 1.1 + x * 0.02) * 0.05;
	ctx.save();
	ctx.translate(x, y + bob);
	ctx.rotate(tilt);
	ctx.scale(s, s);
	ctx.beginPath();
	poly(ctx, [
		[-60, -12],
		[64, -14],
		[44, 8],
		[-46, 8]
	]);
	strand(ctx, [[0, -12], [0, -96]], 3.5, 2.5);
	ctx.fill();
	ctx.fillStyle = sail;
	ctx.beginPath();
	poly(ctx, [
		[4, -92],
		[44, -84],
		[48, -24],
		[4, -20]
	]);
	ctx.fill();
	ctx.restore();
}

/** Birds crossing the sky, wings beating. */
export function birds(ctx: Ctx, t: number, n: number, seed: number, y: number, speed = 50, s = 1): void {
	const r = rng(seed);
	ctx.beginPath();
	for (let i = 0; i < n; i++) {
		const span = W + BLEED * 2;
		const x = ((r() * span + t * speed * (0.8 + r() * 0.4)) % span) - BLEED;
		const yy = y + r() * 120 + Math.sin(t * 0.8 + i) * 12;
		const flap = Math.sin(t * 7 + i * 2) * 8;
		const k = s * (0.7 + r() * 0.6);
		strand(ctx, [[x - 14 * k, yy - flap * k], [x, yy], [x + 14 * k, yy - flap * k]], 3 * k, 1.2 * k);
	}
	ctx.fill();
}

/** A sun or star with slow-turning cut rays. */
export function sun(ctx: Ctx, x: number, y: number, r: number, t: number, body: string, rays: string, n = 16): void {
	ctx.save();
	ctx.fillStyle = rays;
	ctx.beginPath();
	for (let i = 0; i < n; i++) {
		const a = t * 0.05 + (i / n) * Math.PI * 2;
		const b = a + (Math.PI / n) * 0.45;
		const long = r * (i % 2 === 0 ? 2.6 : 1.9);
		poly(ctx, [
			[x + Math.cos(a) * r * 1.08, y + Math.sin(a) * r * 1.08],
			[x + Math.cos(b) * r * 1.08, y + Math.sin(b) * r * 1.08],
			[x + Math.cos((a + b) / 2) * long, y + Math.sin((a + b) / 2) * long]
		]);
	}
	ctx.fill();
	ctx.fillStyle = body;
	ctx.shadowColor = body;
	ctx.shadowBlur = r * 0.5;
	ctx.beginPath();
	disc(ctx, x, y, r);
	ctx.fill();
	ctx.restore();
}

/** Tiny four-point stars that twinkle. */
export function stars(ctx: Ctx, t: number, n: number, seed: number, y1 = H * 0.5): void {
	const r = rng(seed);
	ctx.save();
	ctx.fillStyle = '#f6f0dc';
	ctx.shadowColor = 'transparent';
	for (let i = 0; i < n; i++) {
		const x = r() * (W + BLEED) - BLEED / 2;
		const y = r() * (y1 + BLEED) - BLEED;
		const k = (2 + r() * 4) * (0.6 + 0.4 * Math.sin(t * (1 + r() * 2) + i));
		ctx.globalAlpha = 0.5 + r() * 0.5;
		ctx.beginPath();
		poly(ctx, [
			[x, y - k],
			[x + k * 0.3, y - k * 0.3],
			[x + k, y],
			[x + k * 0.3, y + k * 0.3],
			[x, y + k],
			[x - k * 0.3, y + k * 0.3],
			[x - k, y],
			[x - k * 0.3, y - k * 0.3]
		]);
		ctx.fill();
	}
	ctx.restore();
}

/** A scalloped swell rolling sideways, filled to the bottom of the board. */
export function swell(ctx: Ctx, y: number, t: number, color: string, amp = 10, len = 90, speed = 30): void {
	ctx.save();
	ctx.fillStyle = color;
	ctx.beginPath();
	const pts: Pt[] = [[W + BLEED, H + BLEED], [-BLEED, H + BLEED]];
	const shift = (t * speed) % len;
	for (let x = -BLEED - len; x <= W + BLEED + len; x += 8) {
		const u = ((x + shift) % len) / len;
		pts.push([x, y - Math.sin(u * Math.PI) * amp + Math.sin(x * 0.004 + t * 0.6) * amp * 0.6]);
	}
	poly(ctx, pts);
	ctx.fill();
	ctx.restore();
}

/** Reeds or grass leaning in the wind. */
export function reeds(ctx: Ctx, x0: number, x1: number, y: number, t: number, n: number, seed: number, h = 70): void {
	const r = rng(seed);
	ctx.beginPath();
	for (let i = 0; i < n; i++) {
		const x = x0 + r() * (x1 - x0);
		const hh = h * (0.5 + r() * 0.8);
		const lean = Math.sin(t * 1.2 + x * 0.01) * 12 + 10;
		strand(ctx, curve([x, y + 4], [x + lean * 0.3, y - hh * 0.5], [x + lean, y - hh], 6), 4, 0.8);
	}
	ctx.fill();
}
