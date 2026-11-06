/** Plan-space helpers for the stage builders. Plan points are [x, z] in metres, +z = south. */

export type P2 = [number, number];
export type P3 = [number, number, number];

export function rng(seed: number): () => number {
	let s = seed >>> 0 || 1;
	return () => {
		s ^= s << 13;
		s ^= s >>> 17;
		s ^= s << 5;
		return ((s >>> 0) % 1_000_000) / 1_000_000;
	};
}

function hash(x: number, z: number): number {
	const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
	return s - Math.floor(s);
}

function smooth(t: number): number {
	return t * t * (3 - 2 * t);
}

/** Value noise in [-1, 1]. */
export function noise(x: number, z: number): number {
	const xi = Math.floor(x);
	const zi = Math.floor(z);
	const tx = smooth(x - xi);
	const tz = smooth(z - zi);
	const a = hash(xi, zi);
	const b = hash(xi + 1, zi);
	const c = hash(xi, zi + 1);
	const d = hash(xi + 1, zi + 1);
	return (a + (b - a) * tx + (c - a) * tz + (a - b - c + d) * tx * tz) * 2 - 1;
}

export function fbm(x: number, z: number, octaves = 4): number {
	let sum = 0;
	let amp = 0.5;
	let f = 1;
	for (let i = 0; i < octaves; i++) {
		sum += amp * noise(x * f, z * f);
		f *= 2.03;
		amp *= 0.5;
	}
	return sum;
}

/** Ridged noise in [0, 1], for mountain crests. */
export function ridged(x: number, z: number, octaves = 4): number {
	let sum = 0;
	let amp = 0.5;
	let f = 1;
	for (let i = 0; i < octaves; i++) {
		const n = 1 - Math.abs(noise(x * f, z * f));
		sum += amp * n * n;
		f *= 2.1;
		amp *= 0.5;
	}
	return sum;
}

/**
 * Ridged multifractal (Musgrave) in about [0, 1]: each octave is weighted by the one before, so
 * crests stay sharp and continuous while valley floors stay smooth, like eroded ranges.
 */
export function ridgedMF(x: number, z: number, octaves = 5): number {
	let sum = 0;
	let amp = 0.5;
	let f = 1;
	let weight = 1;
	for (let i = 0; i < octaves; i++) {
		let n = 1 - Math.abs(noise(x * f, z * f));
		n *= n * weight;
		weight = Math.min(1, Math.max(0, n * 2));
		sum += n * amp;
		f *= 2.07;
		amp *= 0.5;
	}
	return sum * 1.1;
}

export function smoothstep(a: number, b: number, x: number): number {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
}

export type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };

export function boundsOf(pts: P2[]): Bounds {
	let minX = Infinity;
	let maxX = -Infinity;
	let minZ = Infinity;
	let maxZ = -Infinity;
	for (const [x, z] of pts) {
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (z < minZ) minZ = z;
		if (z > maxZ) maxZ = z;
	}
	return { minX, maxX, minZ, maxZ };
}

export function centroid(pts: P2[]): P2 {
	let a = 0;
	let cx = 0;
	let cz = 0;
	for (let i = 0; i < pts.length; i++) {
		const [x0, z0] = pts[i];
		const [x1, z1] = pts[(i + 1) % pts.length];
		const f = x0 * z1 - x1 * z0;
		a += f;
		cx += (x0 + x1) * f;
		cz += (z0 + z1) * f;
	}
	if (Math.abs(a) < 1e-6) {
		const b = boundsOf(pts);
		return [(b.minX + b.maxX) / 2, (b.minZ + b.maxZ) / 2];
	}
	return [cx / (3 * a), cz / (3 * a)];
}

/** Signed area; positive when the ring runs clockwise on screen (x right, z down). */
export function signedArea(pts: P2[]): number {
	let a = 0;
	for (let i = 0; i < pts.length; i++) {
		const [x0, z0] = pts[i];
		const [x1, z1] = pts[(i + 1) % pts.length];
		a += x0 * z1 - x1 * z0;
	}
	return a / 2;
}

/** A polygon with a bounding box, for fast repeated containment tests. */
export class Region {
	readonly pts: P2[];
	readonly box: Bounds;

	constructor(pts: P2[]) {
		this.pts = pts;
		this.box = boundsOf(pts);
	}

	contains(x: number, z: number): boolean {
		const b = this.box;
		if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) return false;
		let inside = false;
		const p = this.pts;
		for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
			const [xi, zi] = p[i];
			const [xj, zj] = p[j];
			if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
		}
		return inside;
	}

	/** Distance to the outline (unsigned). */
	edgeDistance(x: number, z: number): number {
		return distanceToPath(this.pts, x, z, true);
	}

	/** Positive inside, negative outside. */
	signed(x: number, z: number): number {
		const d = this.edgeDistance(x, z);
		return this.contains(x, z) ? d : -d;
	}

	/** Cheap reject before an exact test: is (x, z) within `pad` of the box? */
	near(x: number, z: number, pad: number): boolean {
		const b = this.box;
		return x > b.minX - pad && x < b.maxX + pad && z > b.minZ - pad && z < b.maxZ + pad;
	}
}

export function distanceToSegment(x: number, z: number, a: P2, b: P2): number {
	const dx = b[0] - a[0];
	const dz = b[1] - a[1];
	const len = dx * dx + dz * dz;
	let t = len ? ((x - a[0]) * dx + (z - a[1]) * dz) / len : 0;
	t = Math.max(0, Math.min(1, t));
	const px = a[0] + t * dx - x;
	const pz = a[1] + t * dz - z;
	return Math.sqrt(px * px + pz * pz);
}

export function distanceToPath(pts: P2[], x: number, z: number, closed = false): number {
	let best = Infinity;
	const n = closed ? pts.length : pts.length - 1;
	for (let i = 0; i < n; i++) {
		const d = distanceToSegment(x, z, pts[i], pts[(i + 1) % pts.length]);
		if (d < best) best = d;
	}
	return best;
}

/** Chaikin corner cutting. */
export function chaikin(pts: P2[], rounds = 2, closed = true): P2[] {
	let out = pts;
	for (let r = 0; r < rounds; r++) {
		const next: P2[] = [];
		const n = closed ? out.length : out.length - 1;
		if (!closed) next.push(out[0]);
		for (let i = 0; i < n; i++) {
			const a = out[i];
			const b = out[(i + 1) % out.length];
			next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
			next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
		}
		if (!closed) next.push(out[out.length - 1]);
		out = next;
	}
	return out;
}

/** Resample a path at an even spacing. */
export function resample(pts: P2[], step: number, closed = true): P2[] {
	const ring = closed ? [...pts, pts[0]] : pts;
	const out: P2[] = [];
	let carry = 0;
	for (let i = 0; i < ring.length - 1; i++) {
		const a = ring[i];
		const b = ring[i + 1];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
		let t = carry;
		while (t < len) {
			const f = t / len;
			out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
			t += step;
		}
		carry = t - len;
	}
	if (!closed) out.push(ring[ring.length - 1]);
	return out;
}

/** Unit tangent and left-hand normal at each point of a path. */
export function frames(pts: P2[], closed = true): { t: P2; n: P2 }[] {
	return pts.map((_, i) => {
		const prev = pts[closed ? (i - 1 + pts.length) % pts.length : Math.max(0, i - 1)];
		const next = pts[closed ? (i + 1) % pts.length : Math.min(pts.length - 1, i + 1)];
		let tx = next[0] - prev[0];
		let tz = next[1] - prev[1];
		const l = Math.hypot(tx, tz) || 1;
		tx /= l;
		tz /= l;
		return { t: [tx, tz] as P2, n: [tz, -tx] as P2 };
	});
}

/** Point and tangent angle at a distance along an open path. */
export function along(pts: P2[], dist: number): { p: P2; angle: number } {
	let left = dist;
	for (let i = 0; i < pts.length - 1; i++) {
		const a = pts[i];
		const b = pts[i + 1];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
		if (left <= len || i === pts.length - 2) {
			const f = len ? Math.min(1, left / len) : 0;
			return { p: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], angle: Math.atan2(b[1] - a[1], b[0] - a[0]) };
		}
		left -= len;
	}
	return { p: pts[0], angle: 0 };
}

export function nearestOnPath(pts: P2[], x: number, z: number): { p: P2; angle: number; d: number } {
	let best = { p: pts[0], angle: 0, d: Infinity };
	for (let i = 0; i < pts.length - 1; i++) {
		const a = pts[i];
		const b = pts[i + 1];
		const dx = b[0] - a[0];
		const dz = b[1] - a[1];
		const len = dx * dx + dz * dz;
		const t = len ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / len)) : 0;
		const p: P2 = [a[0] + t * dx, a[1] + t * dz];
		const d = Math.hypot(p[0] - x, p[1] - z);
		if (d < best.d) best = { p, angle: Math.atan2(dz, dx), d };
	}
	return best;
}

/** An irregular closed blob of roughly `r` radius. */
export function blob(cx: number, cz: number, r: number, seed: number, n = 18, wobble = 0.22): P2[] {
	const rand = rng(seed);
	const out: P2[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		const k = 1 + (rand() * 2 - 1) * wobble;
		out.push([cx + Math.cos(a) * r * k, cz + Math.sin(a) * r * k]);
	}
	return chaikin(out, 2);
}

/** Offset a rectangle centred on (x, z), rotated by `rot` (radians, plan), into world corners. */
export function rect(x: number, z: number, w: number, d: number, rot = 0): P2[] {
	const c = Math.cos(rot);
	const s = Math.sin(rot);
	return (
		[
			[-w / 2, -d / 2],
			[w / 2, -d / 2],
			[w / 2, d / 2],
			[-w / 2, d / 2]
		] as P2[]
	).map(([px, pz]) => [x + px * c - pz * s, z + px * s + pz * c] as P2);
}
