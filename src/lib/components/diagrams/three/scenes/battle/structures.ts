/**
 * Cartoon Samhan architecture for the 3D battle maps, merged into one vertex-coloured
 * mesh per battle: stone sanseong rings, walled cities with two-tier gate pavilions,
 * munru gates, palisade camps, shrines, and Wolseong, the crescent-walled Moon Palace.
 * Roofs are hipped giwa with lifted eave corners; walls drape over the real ground,
 * chunky and capped like a strategy game's so every circuit reads from above.
 * Flags are not baked in: the builder says where each pole stands, and the scene
 * flies whoever holds the place in that phase.
 */
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import type { Battle, Terrain } from '$lib/battles';
import { groundAt, lineOf, toWorld, type Relief } from '$lib/battleTerrain';
import type { Pt } from '$lib/mapPaths';

export type V3 = [number, number, number];

const LOOK = {
	light: { stone: '#d3ccbd', stoneDark: '#9c9484', cap: '#f1ece1', roof: '#4b525c', pillar: '#b8372c', plaster: '#f3ede0', wood: '#86643f', rampart: '#a7b583', tent: '#efe8d6' },
	dark: { stone: '#a19a8c', stoneDark: '#686258', cap: '#cdc6b6', roof: '#30353d', pillar: '#9c2f26', plaster: '#d9d2c3', wood: '#6b5034', rampart: '#5d6b47', tent: '#cfc7b3' }
};

/** Triangles with flat per-face colour; normals come from computeVertexNormals on a non-indexed mesh, so faces read faceted. */
class Builder {
	pos: number[] = [];
	col: number[] = [];
	private c = new Color();

	tri(a: V3, b: V3, d: V3, color: string) {
		this.c.set(color);
		this.pos.push(...a, ...b, ...d);
		for (let i = 0; i < 3; i++) this.col.push(this.c.r, this.c.g, this.c.b);
	}

	quad(a: V3, b: V3, d: V3, e: V3, color: string) {
		this.tri(a, b, d, color);
		this.tri(a, d, e, color);
	}

	/** Box from its base centre, turned `yaw` radians about y. */
	box([x, y, z]: V3, [w, h, d]: V3, yaw: number, color: string, top = color) {
		const cs = Math.cos(yaw);
		const sn = Math.sin(yaw);
		const p = (u: number, v: number, k: number): V3 => [x + u * cs - k * sn, y + v, z + u * sn + k * cs];
		const [a, b, c, e] = [p(-w / 2, 0, -d / 2), p(w / 2, 0, -d / 2), p(w / 2, 0, d / 2), p(-w / 2, 0, d / 2)];
		const [a2, b2, c2, e2] = [p(-w / 2, h, -d / 2), p(w / 2, h, -d / 2), p(w / 2, h, d / 2), p(-w / 2, h, d / 2)];
		this.quad(a2, e2, c2, b2, top);
		this.quad(a, b, b2, a2, color);
		this.quad(b, c, c2, b2, color);
		this.quad(c, e, e2, c2, color);
		this.quad(e, a, a2, e2, color);
	}

	/** Hipped giwa roof with the eave corners lifted (cheoma), base centre at y. */
	roof([x, y, z]: V3, [w, h, d]: V3, yaw: number, color: string) {
		const cs = Math.cos(yaw);
		const sn = Math.sin(yaw);
		const p = (u: number, v: number, k: number): V3 => [x + u * cs - k * sn, y + v, z + u * sn + k * cs];
		const lift = h * 0.28;
		const ridge = Math.max(0, (w - d) / 2);
		const c1 = p(-w / 2, lift, -d / 2);
		const c2 = p(w / 2, lift, -d / 2);
		const c3 = p(w / 2, lift, d / 2);
		const c4 = p(-w / 2, lift, d / 2);
		const m1 = p(0, 0, -d / 2);
		const m2 = p(0, 0, d / 2);
		const r1 = p(-ridge, h, 0);
		const r2 = p(ridge, h, 0);
		this.tri(c1, r1, m1, color);
		this.tri(m1, r1, r2, color);
		this.tri(m1, r2, c2, color);
		this.tri(c3, r2, m2, color);
		this.tri(m2, r2, r1, color);
		this.tri(m2, r1, c4, color);
		this.tri(c2, r2, c3, color);
		this.tri(c4, r1, c1, color);
		this.quad(c1, m1, m2, c4, color);
		this.quad(m1, c2, c3, m2, color);
	}

	/** Cone (or pyramid, with few sides) from its base centre; `turn` rotates the base corners. */
	cone([x, y, z]: V3, r: number, h: number, sides: number, color: string, turn = 0) {
		const tip: V3 = [x, y + h, z];
		for (let i = 0; i < sides; i++) {
			const a0 = turn + (i / sides) * Math.PI * 2;
			const a1 = turn + ((i + 1) / sides) * Math.PI * 2;
			const p0: V3 = [x + Math.cos(a0) * r, y, z + Math.sin(a0) * r];
			const p1: V3 = [x + Math.cos(a1) * r, y, z + Math.sin(a1) * r];
			this.tri(p0, tip, p1, color);
		}
	}

	geometry(): BufferGeometry {
		const g = new BufferGeometry();
		g.setAttribute('position', new Float32BufferAttribute(this.pos, 3));
		g.setAttribute('color', new Float32BufferAttribute(this.col, 3));
		g.computeVertexNormals();
		return g;
	}
}

type Look = (typeof LOOK)['light'];

/** Wall heights and thicknesses in world units: tall and thick on purpose, so every fortress reads as a fortress from above. */
const WALL = { line: 0.24, fort: 0.22, city: 0.27, gate: 0.3, rampart: 0.15 };
const THICK = { fort: 0.066, city: 0.078, rampart: 0.11 };
/** Merlon spacing along a wall top, and post spacing along a long run (world units). */
const MERLON = 0.062;
const POST = 0.34;

/** A Korean hall: stone plinth, red-pillared body, giwa roof; `tiers` stacks a smaller storey. */
function pavilion(k: Builder, L: Look, at: V3, w: number, d: number, yaw: number, tiers = 1) {
	let y = at[1];
	k.box([at[0], y, at[2]], [w * 1.12, 0.022, d * 1.2], yaw, L.stoneDark, L.stone);
	y += 0.022;
	for (let t = 0; t < tiers; t++) {
		const s = 1 - t * 0.28;
		const bh = 0.05 * s;
		k.box([at[0], y, at[2]], [w * 0.82 * s, bh, d * 0.78 * s], yaw, L.pillar, L.plaster);
		y += bh;
		k.roof([at[0], y, at[2]], [w * 1.28 * s, 0.06 * s, d * 1.4 * s], yaw, L.roof);
		y += 0.03 * s;
	}
}

/** A square tower with a pyramid roof, base centre at `at`. */
function tower(k: Builder, L: Look, at: V3, w: number, h: number) {
	k.box([at[0], at[1] - 0.01, at[2]], [w * 1.15, h * 0.2, w * 1.15], 0, L.stoneDark, L.stoneDark);
	k.box(at, [w, h, w], 0, L.stone, L.cap);
	k.box([at[0], at[1] + h, at[2]], [w * 1.22, h * 0.1, w * 1.22], 0, L.stoneDark, L.cap);
	k.cone([at[0], at[1] + h * 1.1, at[2]], w * 0.86, w * 0.9, 4, L.roof, Math.PI / 4);
}

/**
 * A wall that follows a world-space path and drapes over the ground: a dark footing
 * course, a stone body with a light cap, merlons spaced along the top by distance (so a
 * curve gets them as well as a straight run) and, with `posts`, a capped pillar every
 * `posts` units. An earthen rampart passes `crenel: false` and stays a plain bank.
 */
function wallAlong(
	k: Builder,
	L: Look,
	relief: Relief,
	path: Pt[],
	h: number,
	thick: number,
	{ color = L.stone, crenel = true, posts = 0 }: { color?: string; crenel?: boolean; posts?: number } = {}
) {
	const stone = color === L.stone;
	const side = stone ? L.stone : color;
	const top = stone ? L.cap : color;
	let sinceMerlon = MERLON / 2;
	let sincePost = posts;
	for (let i = 1; i < path.length; i++) {
		const a = path[i - 1];
		const b = path[i];
		const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
		if (len < 1e-4) continue;
		const mid: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
		const [x, z] = toWorld(mid);
		const y = groundAt(relief, mid) - 0.01;
		const yaw = Math.atan2(b[1] - a[1], b[0] - a[0]);
		const lw = len / 100;
		if (stone) k.box([x, y - 0.01, z], [lw + thick * 0.7, h * 0.24, thick * 1.32], yaw, L.stoneDark, L.stoneDark);
		k.box([x, y, z], [lw + thick * 0.5, h, thick], yaw, side, top);
		if (crenel) {
			for (let s = MERLON - sinceMerlon; s < lw; s += MERLON) {
				const f = s / lw;
				const [mx, mz] = toWorld([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
				k.box([mx, y + h, mz], [MERLON * 0.52, h * 0.3, thick * 0.92], yaw, side, top);
			}
			sinceMerlon = (sinceMerlon + lw) % MERLON;
		}
		if (posts) {
			for (let s = posts - sincePost; s < lw; s += posts) {
				const f = s / lw;
				const q: Pt = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
				const [px, pz] = toWorld(q);
				const py = groundAt(relief, q) - 0.01;
				k.box([px, py, pz], [thick * 1.5, h * 1.32, thick * 1.5], yaw, side, top);
				k.box([px, py + h * 1.32, pz], [thick * 1.78, h * 0.1, thick * 1.78], yaw, L.stoneDark, top);
			}
			sincePost = (sincePost + lw) % posts;
		}
	}
}

const ring = (c: Pt, r: number, n: number, jitter = 0, from = 0, to = Math.PI * 2): Pt[] =>
	Array.from({ length: n + 1 }, (_, i) => {
		const a = from + ((to - from) * i) / n;
		const rr = r * (1 + (jitter ? Math.sin(a * 3 + c[0]) * jitter : 0));
		return [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr];
	});

const base = (relief: Relief, at: Pt): V3 => {
	const [x, z] = toWorld(at);
	return [x, groundAt(relief, at), z];
};

const isMoonPalace = (t: Terrain) => /moon palace|wolseong|월성|반월/i.test(`${t.label ?? ''} ${t.ko ?? ''}`);

export interface Structures {
	geometry: BufferGeometry;
	/** Where each building's flagpole stands, by terrain index (walled towns have none: their pole stands in the open). */
	poles: Map<number, V3>;
}

export function buildStructures(b: Battle, relief: Relief, colors: Map<string, string>, light: boolean): Structures {
	const L = light ? LOOK.light : LOOK.dark;
	const k = new Builder();
	const poles = new Map<number, V3>();
	const sideCol = (side?: string) => (side && colors.get(side)) || L.stone;

	b.terrain.forEach((t, i) => {
		if (t.kind === 'wall') {
			wallAlong(k, L, relief, lineOf(t.points), WALL.line, Math.max(0.05, (t.width ?? 5) / 80), { posts: POST });
			return;
		}
		if (!('at' in t) || t.kind === 'hill' || t.kind === 'mountain' || t.kind === 'label') return;
		const at = t.at;
		const p = base(relief, at);
		const side = 'side' in t ? t.side : undefined;

		if (isMoonPalace(t)) {
			// Wolseong: a half-moon earthen rampart open to the south river, halls on a terrace inside.
			wallAlong(k, L, relief, ring(at, 46, 22, 0.06, Math.PI * 0.92, Math.PI * 2.08), WALL.rampart, THICK.rampart, { color: L.rampart, crenel: false });
			const y = Math.max(...[[-14, 0], [14, 0], [0, -12], [0, 10]].map(([dx, dy]) => groundAt(relief, [at[0] + dx, at[1] + dy])));
			k.box([p[0], y - 0.01, p[2]], [0.5, 0.03, 0.34], 0, L.stoneDark, L.stone);
			pavilion(k, L, [p[0], y + 0.02, p[2] - 0.04], 0.2, 0.11, 0, 2);
			pavilion(k, L, [p[0] - 0.17, y + 0.02, p[2] + 0.06], 0.1, 0.07, 0.15);
			pavilion(k, L, [p[0] + 0.17, y + 0.02, p[2] + 0.06], 0.1, 0.07, -0.15);
			k.box([p[0], y + 0.02, p[2] + 0.12], [0.34, 0.03, 0.03], 0, L.pillar, L.roof);
			poles.set(i, [p[0] + 0.24, y + 0.02, p[2] - 0.12]);
		} else if (t.kind === 'fort') {
			// Sanseong: an irregular stone ring hugging the hill, towers round it, one hall.
			const pts = ring(at, 26, 14, 0.14);
			wallAlong(k, L, relief, pts, WALL.fort, THICK.fort);
			pts.filter((_, n) => n % 4 === 0).forEach((q) => tower(k, L, base(relief, q), 0.085, WALL.fort * 1.45));
			pavilion(k, L, p, 0.13, 0.09, 0.2);
			poles.set(i, [p[0] + 0.12, p[1], p[2] - 0.1]);
		} else if (t.kind === 'city') {
			// Walled capital: square circuit, corner towers, a two-tier gate pavilion on the south, halls inside.
			const w = 48;
			const d = 34;
			const c: Pt[] = [
				[at[0] - w, at[1] - d],
				[at[0] + w, at[1] - d],
				[at[0] + w, at[1] + d],
				[at[0] - w, at[1] + d],
				[at[0] - w, at[1] - d]
			];
			const dense = c.flatMap((q, n) => (n ? Array.from({ length: 6 }, (_, s) => [c[n - 1][0] + ((q[0] - c[n - 1][0]) * (s + 1)) / 6, c[n - 1][1] + ((q[1] - c[n - 1][1]) * (s + 1)) / 6] as Pt) : [q]));
			wallAlong(k, L, relief, dense, WALL.city, THICK.city, { posts: POST });
			c.slice(0, 4).forEach((q) => tower(k, L, base(relief, q), 0.11, WALL.city * 1.4));
			const g = base(relief, [at[0], at[1] + d]);
			const gh = WALL.city * 1.18;
			k.box(g, [0.21, gh, 0.11], 0, L.stone, L.cap);
			k.box([g[0], g[1], g[2] + 0.056], [0.07, gh * 0.6, 0.004], 0, L.roof);
			pavilion(k, L, [g[0], g[1] + gh, g[2]], 0.17, 0.08, 0, 2);
			pavilion(k, L, [p[0], p[1], p[2] - 0.08], 0.2, 0.11, 0, 2);
			pavilion(k, L, base(relief, [at[0] - 26, at[1] + 6]), 0.11, 0.07, 0);
			pavilion(k, L, base(relief, [at[0] + 26, at[1] + 6]), 0.11, 0.07, 0);
			poles.set(i, [p[0] + 0.3, p[1], p[2] - 0.22]);
		} else if (t.kind === 'gate') {
			// Munru: stone gate block with a dark passage and a two-tier pavilion over it.
			k.box([p[0], p[1] - 0.01, p[2]], [0.29, WALL.gate * 0.22, 0.15], 0, L.stoneDark, L.stoneDark);
			k.box(p, [0.25, WALL.gate, 0.12], 0, L.stone, L.cap);
			k.box([p[0], p[1], p[2] + 0.061], [0.075, WALL.gate * 0.6, 0.004], 0, L.roof);
			pavilion(k, L, [p[0], p[1] + WALL.gate, p[2]], 0.19, 0.09, 0, 2);
			poles.set(i, [p[0] + 0.15, p[1] + WALL.gate, p[2]]);
		} else if (t.kind === 'camp') {
			// Palisade ring of posts, a few tents, the commander's tent in the colour of the side that pitched it.
			ring(at, 20, 18).slice(0, -1).forEach((q) => k.box(base(relief, q), [0.014, 0.065, 0.014], 0, L.wood));
			[[-8, -5], [8, -6], [-7, 7], [7, 6]].forEach(([dx, dy]) => k.cone(base(relief, [at[0] + dx, at[1] + dy]), 0.04, 0.06, 6, L.tent));
			k.cone(p, 0.055, 0.085, 8, sideCol(side));
			poles.set(i, [p[0] + 0.08, p[1], p[2] - 0.08]);
		} else if (t.kind === 'shrine') {
			// A small hall beside a three-storey stone pagoda.
			pavilion(k, L, [p[0] - 0.05, p[1], p[2]], 0.09, 0.07, 0);
			let y = p[1];
			for (let s = 0; s < 3; s++) {
				const r = 0.05 - s * 0.012;
				k.box([p[0] + 0.07, y, p[2]], [r, 0.03, r], 0, L.stoneDark, L.stone);
				y += 0.03;
				k.box([p[0] + 0.07, y, p[2]], [r * 1.6, 0.008, r * 1.6], 0, L.stoneDark, L.stone);
				y += 0.008;
			}
		}
	});
	return { geometry: k.geometry(), poles };
}
