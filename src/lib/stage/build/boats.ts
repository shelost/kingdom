import * as THREE from 'three';
import { rng, type P2 } from './geo';
import { bevelGeometry, surface } from './kit';
import { figureGeometry, course, along, type Course, type Dress, type Role } from './people';
import { PART, piece, merge, blob, lathe, rod, rigMaterial, contactMaterial, contactDisc, type Paint, type RigUniforms } from './rig';

/**
 * Stylized 7th-century ships for /stage, one per kingdom board (static/ship_*.png) at the canon's
 * real sizes (visual-canon.json → ships): flat-bottomed timber hulls with raked transom ends (never
 * a European keel), battened lug sails, oar galleries, stern castles and the kingdom banner. Plus
 * the river craft every capital had: ferries and fishing skiffs, and Jeju's log raft (teu).
 * Crews are baked into the hull at true size (a man is 1.65 m), so the scale reads at a glance.
 */

export type BoatKind = 'tangTower' | 'tang' | 'goguryeo' | 'silla' | 'baekje' | 'yamato' | 'tamla' | 'ayuta' | 'ferry' | 'skiff' | 'teu';

type Parts = THREE.BufferGeometry[];

const col = (hex: string) => new THREE.Color(hex);

type HullSpec = {
	L: number;
	B: number;
	/** Deck edge above the waterline, midships. */
	D: number;
	draft: number;
	sheerBow: number;
	sheerStern: number;
	/** Half-beam at the ends as a share of the midships half-beam. */
	bowW: number;
	sternW: number;
	/** How far the transoms lean out at the top. */
	bowRake: number;
	sternRake: number;
	/** Bulwark height above the deck. */
	bulwark: number;
	/** Hull colour by length fraction (0 stern, 1 bow) and height. */
	paint: (u: number, y: number) => THREE.Color;
	deck: string;
	rail: string;
};

/** Hull colour bands: dark wet bottom, strakes every `strake` metres, an optional top band. */
function strakes(base: string, dark: string, o: { strake?: number; band?: [string, number]; ports?: [number, number]; L: number; bottom?: string }): (u: number, y: number) => THREE.Color {
	const cb = col(base);
	const cd = col(dark);
	const bottom = col(o.bottom ?? '#2e2620');
	const band = o.band ? col(o.band[0]) : null;
	const out = new THREE.Color();
	const s = o.strake ?? 0.42;
	return (u, y) => {
		if (y < 0.05) return out.copy(bottom);
		if (band && o.band && y > o.band[1]) return out.copy(band);
		if (o.ports && Math.abs(y - o.ports[0]) < 0.13 && ((u * o.L) % o.ports[1]) < 0.36 && u > 0.12 && u < 0.86) return out.copy(cd).multiplyScalar(0.45);
		return out.copy(((y + 10) % s) / s < 0.16 ? cd : cb);
	};
}

function width(h: HullSpec, u: number): number {
	const st = THREE.MathUtils.smoothstep(u, 0, 0.42);
	const bw = 1 - THREE.MathUtils.smoothstep(u, 0.55, 1);
	return (h.sternW + (1 - h.sternW) * st) * (h.bowW + (1 - h.bowW) * bw);
}

function sheer(h: HullSpec, u: number): number {
	return h.D + h.sheerStern * Math.pow(1 - u, 2.5) + h.sheerBow * Math.pow(u, 2.5);
}

/** Close an open section polyline into a fan (the transom planks). */
function cap(pts: THREE.Vector3[]): THREE.BufferGeometry {
	const c = pts.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
	const pos: number[] = [c.x, c.y, c.z];
	for (const p of pts) pos.push(p.x, p.y, p.z);
	const idx: number[] = [];
	for (let j = 1; j < pts.length; j++) idx.push(0, j, j + 1);
	idx.push(0, pts.length, 1);
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}

/** A lofted flat-bottomed hull with raked transom bow and stern, its deck and its rails. */
function hull(p: Parts, h: HullSpec): void {
	const N = 16;
	const rows: THREE.Vector3[][] = [];
	const deckRows: THREE.Vector3[][] = [];
	for (let i = 0; i <= N; i++) {
		const u = i / N;
		const z0 = -h.L / 2 + h.L * u;
		const b = (h.B / 2) * width(h, u);
		const bb = b * 0.62;
		const yt = sheer(h, u);
		const yb = -h.draft * (1 - 0.75 * Math.pow(Math.abs(2 * u - 1), 3));
		const rake = Math.pow(Math.abs(2 * u - 1), 4) * (u < 0.5 ? -h.sternRake : h.bowRake);
		const sec: [number, number][] = [
			[b, yt],
			[b * 1.02, yt - (yt - yb) * 0.35],
			[b * 0.92, yt - (yt - yb) * 0.72],
			[bb, yb + (yt - yb) * 0.08],
			[bb * 0.45, yb],
			[-bb * 0.45, yb],
			[-bb, yb + (yt - yb) * 0.08],
			[-b * 0.92, yt - (yt - yb) * 0.72],
			[-b * 1.02, yt - (yt - yb) * 0.35],
			[-b, yt]
		];
		rows.push(sec.map(([x, y]) => new THREE.Vector3(x, y, z0 + rake * ((y - yb) / (yt - yb || 1)))));
		const yd = yt - h.bulwark;
		const kd = (yd - yb) / (yt - yb || 1);
		deckRows.push([new THREE.Vector3(b * 0.97, yd, z0 + rake * kd), new THREE.Vector3(-b * 0.97, yd, z0 + rake * kd)]);
	}
	const zero = (r: THREE.Vector3[][]) => r.map((row) => row.map(() => [0, 0] as [number, number]));
	const paint: Paint = (_x, y, z, out) => {
		out.copy(h.paint((z + h.L / 2) / h.L, y));
	};
	p.push(piece(surface(rows, zero(rows), new THREE.Vector3(1, 0, 0)), paint, { grad: 0.18 }));
	p.push(piece(cap(rows[0]), paint, { grad: 0.18 }));
	p.push(piece(cap(rows[N]), paint, { grad: 0.18 }));
	p.push(piece(surface(deckRows, zero(deckRows), new THREE.Vector3(0, 1, 0)), h.deck, { grad: 0 }));
	const r = Math.max(0.04, h.B * 0.012);
	for (const side of [0, 9]) {
		for (let i = 0; i < N; i++) p.push(piece(rod(r, rows[i][side].toArray() as [number, number, number], rows[i + 1][side].toArray() as [number, number, number], 5), h.rail, { grad: 0 }));
	}
}

/** Deck height (top of the deck planks) at a length fraction. */
function deckAt(h: HullSpec, u: number): number {
	return sheer(h, u) - h.bulwark;
}

/** A chunky bevelled block (cabin, castle storey). */
function block(p: Parts, w: number, ht: number, d: number, x: number, y: number, z: number, paint: string | Paint): void {
	const g = bevelGeometry(w, ht, d, Math.min(w, ht, d) * 0.12);
	g.translate(x, y + ht / 2, z);
	p.push(piece(g, paint, { grad: 0.2 }));
}

/** A curved hip roof (eaves swept up) over a w × d plan at height y. */
function roof(p: Parts, w: number, d: number, ht: number, x: number, y: number, z: number, color: string): void {
	const r = Math.SQRT1_2;
	const g = lathe([[r * 1.08, 0], [r * 0.98, ht * 0.08], [r * 0.7, ht * 0.32], [r * 0.3, ht * 0.8], [0, ht]], 4);
	g.rotateY(Math.PI / 4);
	g.scale(w, 1, d);
	g.translate(x, y, z);
	p.push(piece(g, color, { grad: 0.3 }));
}

/** Window rows painted on a storey: dark openings between posts. */
function windows(base: string, dark: string, y0: number, ht: number): Paint {
	const cb = col(base);
	const cd = col(dark);
	return (x, y, z, out) => {
		const v = (y - y0) / ht;
		const a = Math.abs(x) + Math.abs(z);
		out.copy(v > 0.35 && v < 0.75 && a % 1.1 < 0.6 ? cd : cb);
	};
}

type SailOpts = {
	x?: number;
	z: number;
	foot: number;
	height: number;
	width: number;
	/** Share of the sail forward of the mast. */
	fore?: number;
	color: string;
	batten?: string;
	battens: number;
	billow?: number;
	trim?: number;
	/** Extra height at the aft top corner (the junk lug's peak). */
	peak?: number;
	mast?: number;
};

/** A battened lug sail on its mast, with the battens as real slats. */
function sail(p: Parts, o: SailOpts): void {
	const x0 = o.x ?? 0;
	const fore = o.fore ?? 0.3;
	const R = o.battens * 2 + 1;
	const C = 5;
	const trim = o.trim ?? 0.3;
	const cs = Math.cos(trim);
	const sn = Math.sin(trim);
	const pt = (r: number, c: number) => {
		const t = r / (R - 1);
		const k = c / (C - 1);
		const y = o.foot + t * o.height + (o.peak ?? 0) * t * t * k;
		const lz = fore * o.width - k * o.width;
		const lx = (o.billow ?? o.width * 0.08) * Math.sin(Math.PI * k) * (0.4 + 0.6 * Math.sin(Math.PI * t));
		return new THREE.Vector3(x0 + lx * cs + lz * sn, y, o.z - lx * sn + lz * cs);
	};
	const rows: THREE.Vector3[][] = [];
	for (let r = 0; r < R; r++) {
		const row: THREE.Vector3[] = [];
		for (let c = 0; c < C; c++) row.push(pt(r, c));
		rows.push(row);
	}
	p.push(piece(surface(rows, rows.map((row) => row.map(() => [0, 0] as [number, number])), new THREE.Vector3(1, 0, 0)), o.color, { grad: 0.12 }));
	const bc = o.batten ?? '#3a2a1e';
	const br = Math.max(0.03, o.width * 0.008);
	for (let r = 0; r < R; r += 2) {
		for (let c = 0; c < C - 1; c++) {
			const a = pt(r, c);
			const b = pt(r, c + 1);
			p.push(piece(rod(br, [a.x, a.y, a.z], [b.x, b.y, b.z], 4), bc, { grad: 0 }));
		}
	}
	const top = o.foot + o.height + (o.peak ?? 0);
	const mr = o.mast ?? Math.max(0.06, o.width * 0.018);
	p.push(piece(rod(mr, [x0, o.foot - o.height * 0.12, o.z], [x0, top + o.height * 0.06, o.z], 6), '#5a3b26', { grad: 0.15 }));
}

/** A kingdom banner hanging off a pole: the cloth waves in the shader. */
function banner(p: Parts, x: number, y: number, z: number, h: number, color: string, o: { w?: number; ht?: number } = {}): void {
	const w = o.w ?? h * 0.42;
	const ht = o.ht ?? h * 0.3;
	p.push(piece(rod(Math.max(0.025, h * 0.012), [x, y, z], [x, y + h, z], 5), '#4a3020', { grad: 0 }));
	const g = new THREE.PlaneGeometry(w, ht, 6, 2);
	g.rotateY(Math.PI / 2);
	g.translate(x, y + h - ht / 2 - h * 0.02, z - w / 2);
	p.push(piece(g, color, { part: PART.flag, pivot: [x, y, z], grad: 0.1 }));
}

/** A pennant streamer (narrow vertical sail) at a masthead. */
function pennant(p: Parts, x: number, y: number, z: number, len: number, color: string): void {
	const g = new THREE.PlaneGeometry(len, len * 0.18, 6, 1);
	g.rotateY(Math.PI / 2);
	g.translate(x, y, z - len / 2);
	p.push(piece(g, color, { part: PART.flag, pivot: [x, y, z], grad: 0 }));
}

/** Oars out of both sides; each sweeps about its oarlock in the shader. */
function oars(p: Parts, h: HullSpec, n: number, from: number, to: number, reach: number, y?: number): void {
	for (let i = 0; i < n; i++) {
		const u = from + ((to - from) * (i + 0.5)) / n;
		const z = -h.L / 2 + h.L * u;
		const b = (h.B / 2) * width(h, u);
		const yl = y ?? sheer(h, u) - h.bulwark * 0.3;
		for (const s of [1, -1]) {
			const g = rod(0.045, [s * b, yl, z], [s * (b + reach), -0.15, z - 0.4], 4);
			const blade = blob(0.03, 0.06, 0.32, s * (b + reach * 0.96), -0.1, z - 0.4, 5);
			p.push(piece(g, '#7a5236', { part: s > 0 ? PART.oar : PART.oarR, pivot: [s * b, yl, z], grad: 0 }));
			p.push(piece(blade, '#7a5236', { part: s > 0 ? PART.oar : PART.oarR, pivot: [s * b, yl, z], grad: 0 }));
		}
	}
}

/** Crew baked into the hull at true size (still figures). */
function crew(p: Parts, list: [Role, Dress, number, number, number, number?, string?][]): void {
	for (const [role, dress, x, y, z, yaw, cloth] of list) {
		const g = figureGeometry(role, dress, { still: true, cloth });
		g.rotateY(yaw ?? 0);
		g.translate(x, y, z);
		p.push(g);
	}
}

/** Shrouds from a masthead to both rails. */
function shrouds(p: Parts, z: number, top: number, b: number, deck: number): void {
	for (const s of [1, -1]) p.push(piece(rod(0.025, [0, top, z], [s * b, deck + 0.4, z - top * 0.12], 3), '#3a2a1e', { grad: 0 }));
}

/* ------------------------------------------------------------------ the boats */

type BoatDef = { parts: Parts; L: number; B: number; draft: number; bob: number };

/** One boat's merged parts; river craft carry folk in the site's own dress. */
function buildBoat(kind: BoatKind, dress: Dress): BoatDef {
	const p: Parts = [];
	if (kind === 'tangTower') {
		const h : HullSpec = { L: 35, B: 8.6, D: 3, draft: 1.8, sheerBow: 1.2, sheerStern: 2.6, bowW: 0.5, sternW: 0.7, bowRake: 2.2, sternRake: 1.6, bulwark: 1.1, deck: '#7a5a3e', rail: '#3a2618', paint: strakes('#5e3e28', '#3e2818', { L: 35, ports: [1.9, 1.6] }) };
		hull(p, h);
		const d = deckAt(h, 0.2);
		const castle = (lvl: number, w: number, dd: number, z: number) => {
			const y = d + lvl * 3.4;
			block(p, w, 3.0, dd, 0, y, z, windows('#7a4e30', '#2a1a10', y, 3.0));
			roof(p, w + 1.2, dd + 1.2, 1.1, 0, y + 3.0, z, '#3e4248');
		};
		castle(0, 7.6, 10, -11);
		castle(1, 6.6, 8.2, -11.5);
		castle(2, 5.2, 6, -12);
		block(p, 5, 2.2, 6, 0, deckAt(h, 0.78), 9, '#6e4a30');
		roof(p, 5.8, 6.8, 0.9, 0, deckAt(h, 0.78) + 2.2, 9, '#3e4248');
		sail(p, { z: 2, foot: deckAt(h, 0.55) + 1.5, height: 15, width: 10, color: '#a8321f', battens: 8, peak: 1.2, trim: 0.25 });
		sail(p, { z: 12, foot: deckAt(h, 0.85) + 1.4, height: 12, width: 8, color: '#a8321f', battens: 7, peak: 1, trim: 0.3 });
		sail(p, { z: -15, foot: d + 10.6, height: 6.5, width: 6, color: '#a8321f', battens: 5, peak: 0.6, trim: 0.35 });
		shrouds(p, 2, deckAt(h, 0.55) + 17.5, 4, deckAt(h, 0.55));
		banner(p, 2.6, d + 10.2, -16.5, 6, '#d8452b');
		banner(p, -2.6, d + 10.2, -16.5, 6, '#d8452b');
		banner(p, 0, deckAt(h, 0.95) + 0.5, 16.5, 4.5, '#d8452b');
		crew(p, [
			['guard', 'tang', 3.2, d + 3.4, -8, 1.57],
			['guard', 'tang', -3.2, d + 3.4, -8, -1.57],
			['archer', 'tang', 3, d + 6.8, -9.5, 1.57],
			['guard', 'tang', 3.6, deckAt(h, 0.5), 0, 1.57],
			['guard', 'tang', -3.6, deckAt(h, 0.55), 3, -1.57],
			['man', 'tang', 1, deckAt(h, 0.65), 6, 0.4],
			['guard', 'tang', 0, deckAt(h, 0.92), 14, 0],
			['official', 'tang', 0, d + 10.2, -12, 0]
		]);
		return { parts: p, L: 35, B: 8.6, draft: 1.8, bob: 0.05 };
	}
	if (kind === 'tang') {
		const h : HullSpec = { L: 24, B: 6, D: 2.6, draft: 1.4, sheerBow: 1, sheerStern: 1.8, bowW: 0.5, sternW: 0.7, bowRake: 1.6, sternRake: 1.2, bulwark: 1, deck: '#7a5a3e', rail: '#3a2618', paint: strakes('#5e3e28', '#3e2818', { L: 24 }) };
		hull(p, h);
		const d = deckAt(h, 0.15);
		block(p, 5, 2.6, 5.5, 0, d, -8, windows('#7a4e30', '#2a1a10', d, 2.6));
		roof(p, 5.8, 6.3, 1, 0, d + 2.6, -8, '#3e4248');
		sail(p, { z: 1.5, foot: deckAt(h, 0.56) + 1.3, height: 11, width: 7.5, color: '#a8321f', battens: 7, peak: 0.9 });
		sail(p, { z: 8.5, foot: deckAt(h, 0.85) + 1.2, height: 8, width: 5.6, color: '#a8321f', battens: 5, peak: 0.7, trim: 0.36 });
		shrouds(p, 1.5, deckAt(h, 0.56) + 13, 2.8, deckAt(h, 0.56));
		banner(p, 0, d + 3.6, -10.5, 5, '#d8452b');
		crew(p, [
			['guard', 'tang', 2.4, deckAt(h, 0.45), -1, 1.57],
			['guard', 'tang', -2.4, deckAt(h, 0.5), 0.5, -1.57],
			['archer', 'tang', 2.2, deckAt(h, 0.7), 5, 1.57],
			['man', 'tang', 0, deckAt(h, 0.92), 9.5, 0]
		]);
		return { parts: p, L: 24, B: 6, draft: 1.4, bob: 0.06 };
	}
	if (kind === 'goguryeo') {
		const h : HullSpec = { L: 25, B: 6, D: 2.5, draft: 1.3, sheerBow: 0.9, sheerStern: 1.6, bowW: 0.48, sternW: 0.72, bowRake: 1.8, sternRake: 1.1, bulwark: 0.95, deck: '#a07a52', rail: '#5a3820', paint: strakes('#9a643a', '#6a4024', { L: 25, ports: [1.35, 1.25] }) };
		hull(p, h);
		const d = deckAt(h, 0.14);
		block(p, 5.4, 2.4, 6, 0, d, -8.4, windows('#a0683e', '#3a2414', d, 2.4));
		roof(p, 6.2, 6.8, 0.9, 0, d + 2.4, -8.4, '#4a4440');
		block(p, 4.2, 2, 4.4, 0, d + 3.3, -8.8, windows('#a0683e', '#3a2414', d + 3.3, 2));
		roof(p, 5, 5.2, 0.8, 0, d + 5.3, -8.8, '#4a4440');
		oars(p, h, 10, 0.24, 0.82, 4.2);
		sail(p, { z: 0.5, foot: deckAt(h, 0.52) + 1.2, height: 10.5, width: 7, color: '#efe6d2', battens: 8, peak: 1 });
		sail(p, { z: 7.5, foot: deckAt(h, 0.8) + 1.1, height: 7.5, width: 5.2, color: '#efe6d2', battens: 6, peak: 0.7, trim: 0.36 });
		sail(p, { z: -4.6, foot: d + 2.6, height: 5.6, width: 3.6, color: '#efe6d2', battens: 4, peak: 0.6, trim: 0.5 });
		shrouds(p, 0.5, deckAt(h, 0.52) + 12.5, 2.8, deckAt(h, 0.52));
		banner(p, 1.6, d + 5.8, -11.4, 4.2, '#C30000');
		banner(p, -1.6, d + 5.8, -11.4, 3.6, '#C30000');
		crew(p, [
			['guard', 'goguryeo', 2.3, deckAt(h, 0.45), -1.5, 1.57],
			['guard', 'goguryeo', -2.3, deckAt(h, 0.5), 0, -1.57],
			['archer', 'goguryeo', 1.8, d + 3.3, -7.2, 0.4],
			['man', 'goguryeo', 0.6, deckAt(h, 0.7), 5, 0.3],
			['guard', 'goguryeo', 0, deckAt(h, 0.92), 9.6, 0]
		]);
		return { parts: p, L: 25, B: 6, draft: 1.3, bob: 0.06 };
	}
	if (kind === 'silla') {
		const h : HullSpec = { L: 20, B: 5, D: 2, draft: 1.1, sheerBow: 0.8, sheerStern: 1.1, bowW: 0.5, sternW: 0.72, bowRake: 1.3, sternRake: 0.9, bulwark: 0.8, deck: '#c9a476', rail: '#6a4a2c', paint: strakes('#bd8f5c', '#8a6238', { L: 20 }) };
		hull(p, h);
		block(p, 3.6, 1.6, 4.2, 0, deckAt(h, 0.36), -3, '#b08458');
		roof(p, 4.2, 4.8, 0.7, 0, deckAt(h, 0.36) + 1.6, -3, '#6c6a64');
		sail(p, { z: 2.2, foot: deckAt(h, 0.6) + 1, height: 8.6, width: 6.4, color: '#efe6d2', battens: 4, peak: 0.3, fore: 0.45 });
		sail(p, { z: -6.4, foot: deckAt(h, 0.2) + 1, height: 5.8, width: 4.2, color: '#efe6d2', battens: 3, peak: 0.3, fore: 0.45, trim: 0.4 });
		banner(p, 0, sheer(h, 0.02), -10.2, 3.4, '#2A5FB8');
		crew(p, [
			['man', 'silla', 1.6, deckAt(h, 0.55), 1, 1.57],
			['man', 'silla', -1.5, deckAt(h, 0.7), 4, -1.2],
			['guard', 'silla', 0, deckAt(h, 0.12), -7.5, 3.1],
			['man', 'silla', 0.4, deckAt(h, 0.9), 7.6, 0]
		]);
		return { parts: p, L: 20, B: 5, draft: 1.1, bob: 0.07 };
	}
	if (kind === 'baekje') {
		const h : HullSpec = { L: 18, B: 4, D: 1.8, draft: 1, sheerBow: 1.5, sheerStern: 1.1, bowW: 0.42, sternW: 0.7, bowRake: 2, sternRake: 0.8, bulwark: 0.75, deck: '#d2aa6a', rail: '#7a5428', paint: strakes('#c99a52', '#9a6e34', { L: 18 }) };
		hull(p, h);
		block(p, 2.8, 1.5, 3, 0, deckAt(h, 0.14), -6, '#c09050');
		roof(p, 3.4, 3.6, 0.7, 0, deckAt(h, 0.14) + 1.5, -6, '#6c6a64');
		block(p, 2.4, 0.5, 2.6, 0, deckAt(h, 0.93), 7.6, '#b88a48');
		sail(p, { z: 1, foot: deckAt(h, 0.55) + 1, height: 9, width: 6.6, color: '#efe6d2', battens: 7, peak: 0.8 });
		sail(p, { z: 7.2, foot: deckAt(h, 0.9) + 0.9, height: 4.4, width: 1.6, color: '#e2bd4e', battens: 2, fore: 0.1, trim: 0.1, billow: 0.1 });
		sail(p, { z: -7.4, foot: deckAt(h, 0.1) + 1.7, height: 4.2, width: 1.5, color: '#e2bd4e', battens: 2, fore: 0.1, trim: 0.1, billow: 0.1 });
		pennant(p, 0, deckAt(h, 0.55) + 10.6, 1, 3.6, '#e2bd4e');
		banner(p, 0, sheer(h, 0.03), -8.6, 3, '#d9b13a');
		crew(p, [
			['man', 'baekje', 1.2, deckAt(h, 0.5), 0, 1.57],
			['man', 'baekje', -1.1, deckAt(h, 0.68), 3, -1.4],
			['guard', 'baekje', 0, deckAt(h, 0.24), -4.2, 3.1],
			['man', 'baekje', 0.5, deckAt(h, 0.12), -6.8, 0.2]
		]);
		return { parts: p, L: 18, B: 4, draft: 1, bob: 0.08 };
	}
	if (kind === 'yamato') {
		const h : HullSpec = {
			L: 15,
			B: 3,
			D: 0.95,
			draft: 0.6,
			sheerBow: 0.8,
			sheerStern: 0.6,
			bowW: 0.38,
			sternW: 0.6,
			bowRake: 1.4,
			sternRake: 0.6,
			bulwark: 0.35,
			deck: '#c9a476',
			rail: '#b3262e',
			paint: strakes('#efe9de', '#d9d0c0', { L: 15, band: ['#b3262e', 0.9], strake: 0.5, bottom: '#3a2a22' })
		};
		hull(p, h);
		block(p, 2, 1.2, 2.2, 0, deckAt(h, 0.12), -5.3, '#8a5a3a');
		roof(p, 2.6, 2.8, 0.5, 0, deckAt(h, 0.12) + 1.2, -5.3, '#6a4a30');
		oars(p, h, 6, 0.3, 0.8, 2.4);
		sail(p, { z: 2.6, foot: deckAt(h, 0.67) + 0.9, height: 6.4, width: 4.6, color: '#ead79a', battens: 5, peak: 0.6, trim: 0.4 });
		p.push(piece(rod(0.07, [0, deckAt(h, 0.22), -3.6], [0, deckAt(h, 0.22) + 6, -3.6], 5), '#5a3b26'));
		banner(p, 0, deckAt(h, 0.05) + 1.2, -6.6, 2.6, '#c8322e');
		const rowers: [Role, Dress, number, number, number, number?, string?][] = [];
		for (let i = 0; i < 6; i++) {
			const u = 0.3 + (0.5 * (i + 0.5)) / 6;
			rowers.push(['man', 'yamato', (i % 2 ? -1 : 1) * 0.55, deckAt(h, u), -7.5 + 15 * u, i % 2 ? -1.57 : 1.57, '#efe9de']);
		}
		crew(p, rowers);
		return { parts: p, L: 15, B: 3, draft: 0.6, bob: 0.1 };
	}
	if (kind === 'tamla') {
		const h : HullSpec = { L: 10, B: 2.8, D: 1.1, draft: 0.7, sheerBow: 0.7, sheerStern: 0.5, bowW: 0.45, sternW: 0.72, bowRake: 0.9, sternRake: 0.5, bulwark: 0.55, deck: '#d2aa6a', rail: '#7a5428', paint: strakes('#c99a52', '#9a6e34', { L: 10, strake: 0.36 }) };
		hull(p, h);
		sail(p, { z: 0.8, foot: deckAt(h, 0.56) + 0.7, height: 5, width: 3.6, color: '#efe6d2', battens: 4, peak: 0.5, fore: 0.25 });
		banner(p, 0, sheer(h, 0.04), -4.7, 1.8, '#E07030');
		crew(p, [
			['man', 'tamla', 0.6, deckAt(h, 0.3), -2, 1.2],
			['man', 'tamla', -0.5, deckAt(h, 0.75), 2.4, -0.6],
			['man', 'tamla', 0, deckAt(h, 0.1), -4, 0]
		]);
		return { parts: p, L: 10, B: 2.8, draft: 0.7, bob: 0.11 };
	}
	if (kind === 'ayuta') {
		const h : HullSpec = { L: 18, B: 4.4, D: 1.9, draft: 1, sheerBow: 1.2, sheerStern: 1.4, bowW: 0.45, sternW: 0.7, bowRake: 1.6, sternRake: 1, bulwark: 0.8, deck: '#8a5a3a', rail: '#d4a640', paint: strakes('#a3231e', '#d4a640', { L: 18, strake: 0.6 }) };
		hull(p, h);
		block(p, 3.2, 1.8, 3.6, 0, deckAt(h, 0.15), -5.5, windows('#a3231e', '#d4a640', deckAt(h, 0.15), 1.8));
		roof(p, 3.8, 4.2, 0.8, 0, deckAt(h, 0.15) + 1.8, -5.5, '#7a1a16');
		sail(p, { z: 1.4, foot: deckAt(h, 0.58) + 1, height: 9.4, width: 7, color: '#b01e1e', battens: 7, peak: 0.9 });
		sail(p, { z: -7.6, foot: deckAt(h, 0.08) + 2, height: 3.6, width: 2.6, color: '#b01e1e', battens: 3, peak: 0.4, trim: 0.45 });
		return { parts: p, L: 18, B: 4.4, draft: 1, bob: 0.08 };
	}
	if (kind === 'ferry') {
		const h : HullSpec = { L: 8, B: 2.6, D: 0.6, draft: 0.35, sheerBow: 0.35, sheerStern: 0.3, bowW: 0.62, sternW: 0.72, bowRake: 0.7, sternRake: 0.5, bulwark: 0.32, deck: '#b8925e', rail: '#6a4a2c', paint: strakes('#9a7048', '#6e4c2e', { L: 8, strake: 0.3 }) };
		hull(p, h);
		const d = deckAt(h, 0.5);
		p.push(piece(rod(0.035, [0.3, d + 1.1, -3.6], [1.4, -0.6, -4.8], 4), '#7a5236', { grad: 0 }));
		crew(p, [
			['man', dress, 0.2, deckAt(h, 0.06), -3.5, 0.5, '#efe9db'],
			['woman', dress, 0.6, d, -0.5, 1.2, '#f1ece0'],
			['man', dress, -0.6, d, 0.6, -1.4, '#e9e2d0'],
			['woman', dress, 0.3, d, 2, 2.6, '#efe9db']
		]);
		return { parts: p, L: 8, B: 2.6, draft: 0.35, bob: 0.12 };
	}
	if (kind === 'skiff') {
		const h : HullSpec = { L: 5, B: 1.4, D: 0.45, draft: 0.25, sheerBow: 0.3, sheerStern: 0.18, bowW: 0.4, sternW: 0.62, bowRake: 0.5, sternRake: 0.3, bulwark: 0.28, deck: '#b8925e', rail: '#5a3c24', paint: strakes('#8e6640', '#6a4a2c', { L: 5, strake: 0.25 }) };
		hull(p, h);
		const d = deckAt(h, 0.4);
		p.push(piece(rod(0.025, [-0.2, d + 0.9, -1.3], [-1.6, 0.6, 1.8], 4), '#6b4a2c', { grad: 0 }));
		crew(p, [['man', dress, 0, d, -1.1, 0.3, '#e9e2d0']]);
		return { parts: p, L: 5, B: 1.4, draft: 0.25, bob: 0.13 };
	}
	// teu: Jeju log raft, nine logs lashed side by side, the bow ends sweeping up, a straw-mat sail
	const logs = 9;
	const r = 0.13;
	for (let i = 0; i < logs; i++) {
		const x = (i - (logs - 1) / 2) * r * 2;
		p.push(piece(rod(r, [x, 0.05, -2.4], [x, 0.05, 1.4], 7), i % 2 ? '#8a6a44' : '#9a7a50', { grad: 0.2 }));
		p.push(piece(rod(r * 0.92, [x, 0.05, 1.4], [x * 0.85, 0.5, 2.6], 7), i % 2 ? '#8a6a44' : '#9a7a50', { grad: 0.2 }));
	}
	for (const z of [-1.8, 0, 1.2]) p.push(piece(rod(0.04, [-1.25, 0.2, z], [1.25, 0.2, z], 4), '#5a3c24', { grad: 0 }));
	sail(p, { z: 0.4, foot: 1, height: 2.6, width: 1.8, color: '#c9ad74', batten: '#7a5a34', battens: 3, peak: 0.2, fore: 0.4, billow: 0.12 });
	crew(p, [
		['man', 'tamla', 0.4, 0.18, -1.6, 0.4, '#e8dfcb'],
		['man', 'tamla', -0.4, 0.18, 0.9, -2.2, '#ddd0b4']
	]);
	return { parts: p, L: 5, B: 2.4, draft: 0.2, bob: 0.14 };
}

/* ------------------------------------------------------------------ the collector */

type BoatSlot = { kind: BoatKind; x: number; z: number; yaw: number; row: boolean; path?: Course; len: number; d: number; speed: number; dir: 1 | -1; closed: boolean; lane: number; phase: number; water: number };

/** Geometry and owned materials are freed with the site (`disposeTree`). */
export type FleetBuild = {
	group: THREE.Group;
	tick(t: number, dt: number, show: number, cam: THREE.Vector3 | null): void;
};

/** Metres beyond which a fleet is not drawn. */
const FAR = 2600;

const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler(0, 0, 0, 'YXZ');
const tmpP = new THREE.Vector3();
const ONE = new THREE.Vector3(1, 1, 1);

/**
 * Collects a site's boats, then makes one instanced mesh per boat type; hulls bob and drift on the
 * CPU. `dress` is who rides the ferries and skiffs.
 */
export class Fleet {
	private slots: BoatSlot[] = [];
	private rand: () => number;

	constructor(
		readonly water: number,
		readonly dress: Dress,
		seed = 1
	) {
		this.rand = rng(seed * 13 + 5);
	}

	get count(): number {
		return this.slots.length;
	}

	/** A boat riding at anchor (or tied at a pier); `row` keeps its oars working; `y` is its own water level. */
	moor(kind: BoatKind, x: number, z: number, yaw: number, o: { row?: boolean; y?: number } = {}): void {
		this.slots.push({ kind, x, z, yaw, row: !!o.row, len: 0, d: 0, speed: 0, dir: 1, closed: false, lane: 0, phase: this.rand() * Math.PI * 2, water: o.y ?? this.water });
	}

	/** `n` boats under way along a river or a sea lane: they go up and back on an open path, round a closed one. */
	drift(kind: BoatKind, path: P2[], n = 1, o: { speed?: number; lane?: number; row?: boolean; y?: number } = {}): void {
		if (path.length < 2) return;
		const c = course(path);
		const len = c.cum[c.cum.length - 1] || 1;
		const closed = Math.hypot(path[0][0] - path[path.length - 1][0], path[0][1] - path[path.length - 1][1]) < 1;
		for (let i = 0; i < n; i++) {
			this.slots.push({
				kind,
				x: 0,
				z: 0,
				yaw: 0,
				row: o.row ?? (kind === 'goguryeo' || kind === 'yamato'),
				path: c,
				len,
				d: ((i + this.rand() * 0.6) / n) * len,
				speed: (o.speed ?? (kind === 'ferry' || kind === 'skiff' || kind === 'teu' ? 0.7 : 1.1)) * (0.8 + this.rand() * 0.4),
				dir: this.rand() > 0.5 ? 1 : -1,
				closed,
				lane: (this.rand() - 0.5) * 2 * (o.lane ?? 6),
				phase: this.rand() * Math.PI * 2,
				water: o.y ?? this.water
			});
		}
	}

	build(u: RigUniforms): FleetBuild {
		const group = new THREE.Group();
		group.name = 'fleet';
		const mat = rigMaterial(u, 'fleet', { figure: false, side: THREE.DoubleSide, rim: 0.18 });
		const shadowMat = contactMaterial(u, 0.28, false);
		const kinds = new Map<BoatKind, BoatSlot[]>();
		for (const s of this.slots) {
			const list = kinds.get(s.kind);
			if (list) list.push(s);
			else kinds.set(s.kind, [s]);
		}
		const meshes: { mesh: THREE.InstancedMesh; shadow: THREE.InstancedMesh; list: BoatSlot[]; def: Omit<BoatDef, 'parts'> }[] = [];
		for (const [kind, list] of kinds) {
			const def = buildBoat(kind, this.dress);
			const geo = merge(def.parts);
			const n = list.length;
			const folk = new Float32Array(n * 4);
			const cloth = new Float32Array(n * 3).fill(1);
			list.forEach((s, i) => folk.set([s.phase, s.row ? 1 : 0, 1.7, 0], i * 4));
			geo.setAttribute('aFolk', new THREE.InstancedBufferAttribute(folk, 4));
			geo.setAttribute('aCloth', new THREE.InstancedBufferAttribute(cloth, 3));
			const mesh = new THREE.InstancedMesh(geo, mat, n);
			mesh.name = `fleet-${kind}`;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.frustumCulled = false;
			const shadow = new THREE.InstancedMesh(contactDisc(def.B * 0.85, def.L * 0.58, 0.04), shadowMat, n);
			shadow.instanceMatrix = mesh.instanceMatrix;
			shadow.frustumCulled = false;
			shadow.renderOrder = -1;
			group.add(mesh, shadow);
			meshes.push({ mesh, shadow, list, def: { L: def.L, B: def.B, draft: def.draft, bob: def.bob } });
		}

		const m = new THREE.Matrix4();
		const ease = (k: number) => k * k * (3 - 2 * k);
		const center = new THREE.Vector3();

		function steer(t: number, dt: number, show: number, cam: THREE.Vector3 | null) {
			for (const { mesh, list, def } of meshes) {
				let near = false;
				list.forEach((s, i) => {
					let x = s.x;
					let z = s.z;
					let yaw = s.yaw;
					if (s.path) {
						s.d += s.speed * dt * s.dir;
						if (s.closed) s.d = ((s.d % s.len) + s.len) % s.len;
						else if (s.d > s.len) {
							s.d = s.len - (s.d - s.len);
							s.dir = -1;
						} else if (s.d < 0) {
							s.d = -s.d;
							s.dir = 1;
						}
						const p = along(s.path, s.d / s.len);
						x = p.x + Math.cos(p.yaw) * s.lane;
						z = p.z - Math.sin(p.yaw) * s.lane;
						yaw = p.yaw + (s.dir < 0 ? Math.PI : 0);
					}
					if (cam && cam.distanceTo(center.set(x, s.water, z)) < FAR + def.L) near = true;
					const k = ease(Math.min(1, Math.max(0, show * 1.5 - (i / Math.max(1, list.length)) * 0.5)));
					const sink = (1 - k) * (def.draft + 6);
					const y = s.water + Math.sin(t * 0.8 + s.phase) * def.bob - sink;
					tmpE.set(Math.sin(t * 0.6 + s.phase) * def.bob * 0.25, yaw, Math.sin(t * 0.7 + s.phase * 1.3) * def.bob * 0.4);
					m.compose(tmpP.set(x, y, z), tmpQ.setFromEuler(tmpE), ONE);
					mesh.setMatrixAt(i, m);
				});
				mesh.instanceMatrix.needsUpdate = true;
				mesh.visible = !cam || near;
			}
		}

		return {
			group,
			tick(t, dt, show, cam) {
				steer(t, dt, show, cam);
				for (const c of meshes) c.shadow.visible = c.mesh.visible;
			}
		};
	}
}
