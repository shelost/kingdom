/**
 * The map's ground as three.js geometry, built from one relief field (worldRelief.ts):
 * the raised sheet, its side wall down to the table, and a drape that follows it.
 * Samhan, Sphere and World are square sheets with a square wall; the Cosmos keeps
 * only its two discs, walled round. World units, absolute (toMapWorld).
 */
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { LIVING_DISC, cosmosSplitOf, viewDiscs, type CosmosLayout, type Disc, type SheetBox } from '$lib/cosmos';
import { toMapWorld } from '$lib/mapTerrain';
import { heightAt, type ReliefField } from '$lib/worldRelief';

/** Sample indices along one axis, every `stride`th and always the last. */
function steps(n: number, stride: number): number[] {
	const out: number[] = [];
	for (let i = 0; i < n - 1; i += stride) out.push(i);
	out.push(n - 1);
	return out;
}

const inDisc = (x: number, y: number, d: Disc, slack = 1) => (x - d.x) ** 2 + (y - d.y) ** 2 <= d.r * d.r * slack;

/** Sheet units of the cosmos disc's rounded lip. 50 sheet units = 1 world unit. */
const LIP = 88;
const LIP_W = LIP / 50;
const LIP_STEPS = 6;

/** How far a cosmos-disc sample sinks onto the quarter-round lip, in world units. */
function lipSink(x: number, y: number, discs: Disc[]): number {
	let sink = 0;
	for (const d of discs) {
		const dist = Math.hypot(x - d.x, y - d.y);
		if (dist < d.r - LIP || dist > d.r * 1.06) continue;
		if (discs.some((o) => o !== d && inDisc(x, y, o))) continue;
		const t = Math.min(1, (dist - (d.r - LIP)) / LIP);
		sink = Math.max(sink, LIP_W * (1 - Math.cos(t * Math.PI / 2)));
	}
	return sink;
}

/** The field as a height mesh, every `stride`th sample; the cosmos drops quads wholly outside its discs. */
export function fieldGeometry(f: ReliefField, layout: CosmosLayout, stride = 2): BufferGeometry {
	const is = steps(f.nx, stride);
	const js = steps(f.ny, stride);
	const discs = f.inside ? viewDiscs(layout, cosmosSplitOf()) : null;
	const pos: number[] = [];
	const uv: number[] = [];
	const keep: boolean[] = [];
	for (const j of js) {
		for (const i of is) {
			const x = f.box.x + (i / (f.nx - 1)) * f.box.w;
			const y = f.box.y + (j / (f.ny - 1)) * f.box.h;
			const [wx, wz] = toMapWorld(x, y);
			pos.push(wx, f.h[j * f.nx + i] - (discs ? lipSink(x, y, discs) : 0), wz);
			uv.push(i / (f.nx - 1), 1 - j / (f.ny - 1));
			keep.push(!discs || discs.some((d) => inDisc(x, y, d, 1.04)));
		}
	}
	const cols = is.length;
	const idx: number[] = [];
	for (let r = 0; r < js.length - 1; r++) {
		for (let c = 0; c < cols - 1; c++) {
			const a = r * cols + c;
			if (!keep[a] && !keep[a + 1] && !keep[a + cols] && !keep[a + cols + 1]) continue;
			idx.push(a, a + cols, a + 1, a + 1, a + cols, a + cols + 1);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}

/** One wall quad from (p → q) along the ground down to `base`, facing `n`. Optional matching rim colours. */
function wall(
	pos: number[],
	nrm: number[],
	col: number[] | null,
	p: [number, number, number],
	q: [number, number, number],
	base: number,
	n: [number, number],
	cp?: [number, number, number],
	cq?: [number, number, number]
) {
	pos.push(p[0], p[1], p[2], p[0], base, p[2], q[0], q[1], q[2]);
	pos.push(q[0], q[1], q[2], p[0], base, p[2], q[0], base, q[2]);
	for (let k = 0; k < 6; k++) nrm.push(n[0], 0, n[1]);
	if (col && cp && cq) {
		const push = (c: [number, number, number]) => col.push(c[0], c[1], c[2]);
		push(cp);
		push(cp);
		push(cq);
		push(cq);
		push(cp);
		push(cq);
	}
}

const RIM_SEGS = 256;
const EDGE_SEGS = 128;

/**
 * The side wall from the sheet's edge down to `base`, so the ground reads as a thick
 * table: a square wall round a square sheet, a round one under each disc of the
 * cosmos (none where the discs overlap). When `rimColor` is set, each rim sample
 * carries the paint colour of the surface it meets (sea blue, tundra white, …).
 */
export function wallGeometry(
	f: ReliefField,
	layout: CosmosLayout,
	base: number,
	rimColor?: (x: number, y: number) => [number, number, number]
): BufferGeometry {
	const pos: number[] = [];
	const nrm: number[] = [];
	const col = rimColor ? ([] as number[]) : null;
	const tint = (x: number, y: number): [number, number, number] => rimColor?.(x, y) ?? [0.45, 0.4, 0.34];
	const top = (x: number, y: number): [number, number, number] => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, heightAt(f, x, y), wz];
	};
	if (f.inside) {
		const discs = viewDiscs(layout, cosmosSplitOf());
		for (const d of discs) {
			const others = discs.filter((o) => o !== d);
			const lipAt = (a: number, phi: number): [number, number, number] => {
				const rad = d.r - LIP + LIP * Math.sin(phi);
				const [wx, wz] = toMapWorld(d.x + Math.cos(a) * rad, d.y + Math.sin(a) * rad);
				const y = heightAt(f, d.x + Math.cos(a) * (d.r - LIP), d.y + Math.sin(a) * (d.r - LIP));
				return [wx, y - LIP_W * (1 - Math.cos(phi)) + 0.01, wz];
			};
			const lipN = (a: number, phi: number): [number, number, number] => [
				Math.cos(a) * Math.sin(phi),
				Math.cos(phi),
				Math.sin(a) * Math.sin(phi)
			];
			const rimXY = (a: number): [number, number] => [d.x + Math.cos(a) * (d.r - LIP * 0.35), d.y + Math.sin(a) * (d.r - LIP * 0.35)];
			for (let s = 0; s < RIM_SEGS; s++) {
				const a0 = (s / RIM_SEGS) * Math.PI * 2;
				const a1 = ((s + 1) / RIM_SEGS) * Math.PI * 2;
				const am = (a0 + a1) / 2;
				if (others.some((o) => inDisc(d.x + Math.cos(am) * d.r, d.y + Math.sin(am) * d.r, o))) continue;
				const [x0, y0] = rimXY(a0);
				const [x1, y1] = rimXY(a1);
				const c0 = tint(x0, y0);
				const c1 = tint(x1, y1);
				for (let k = 0; k < LIP_STEPS; k++) {
					const p0 = (k / LIP_STEPS) * (Math.PI / 2);
					const p1 = ((k + 1) / LIP_STEPS) * (Math.PI / 2);
					const A = lipAt(a0, p0);
					const B = lipAt(a0, p1);
					const C = lipAt(a1, p0);
					const D = lipAt(a1, p1);
					const nA = lipN(a0, p0);
					const nB = lipN(a0, p1);
					const nC = lipN(a1, p0);
					const nD = lipN(a1, p1);
					pos.push(A[0], A[1], A[2], B[0], B[1], B[2], C[0], C[1], C[2]);
					pos.push(C[0], C[1], C[2], B[0], B[1], B[2], D[0], D[1], D[2]);
					nrm.push(nA[0], nA[1], nA[2], nB[0], nB[1], nB[2], nC[0], nC[1], nC[2]);
					nrm.push(nC[0], nC[1], nC[2], nB[0], nB[1], nB[2], nD[0], nD[1], nD[2]);
					if (col) {
						const push = (c: [number, number, number]) => col.push(c[0], c[1], c[2]);
						push(c0);
						push(c0);
						push(c1);
						push(c1);
						push(c0);
						push(c1);
					}
				}
				wall(pos, nrm, col, lipAt(a0, Math.PI / 2), lipAt(a1, Math.PI / 2), base, [Math.cos(am), Math.sin(am)], c0, c1);
			}
		}
	} else {
		const { x, y, w, h } = f.box;
		const sides: { from: [number, number]; to: [number, number]; n: [number, number] }[] = [
			{ from: [x, y], to: [x + w, y], n: [0, -1] },
			{ from: [x + w, y], to: [x + w, y + h], n: [1, 0] },
			{ from: [x + w, y + h], to: [x, y + h], n: [0, 1] },
			{ from: [x, y + h], to: [x, y], n: [-1, 0] }
		];
		for (const s of sides) {
			for (let k = 0; k < EDGE_SEGS; k++) {
				const t0 = k / EDGE_SEGS;
				const t1 = (k + 1) / EDGE_SEGS;
				const sx0 = s.from[0] + (s.to[0] - s.from[0]) * t0;
				const sy0 = s.from[1] + (s.to[1] - s.from[1]) * t0;
				const sx1 = s.from[0] + (s.to[0] - s.from[0]) * t1;
				const sy1 = s.from[1] + (s.to[1] - s.from[1]) * t1;
				wall(pos, nrm, col, top(sx0, sy0), top(sx1, sy1), base, s.n, tint(sx0, sy0), tint(sx1, sy1));
			}
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('normal', new Float32BufferAttribute(nrm, 3));
	if (col) geo.setAttribute('color', new Float32BufferAttribute(col, 3));
	return geo;
}

/**
 * The sea's surface: a flat sheet at sea level over the square frames, or over 이승's
 * disc (the Ocean of Life included) in the cosmos. 저승's chasms stay dry. Null for
 * the halves layout, which the map never draws.
 */
export function waterGeometry(f: ReliefField, layout: CosmosLayout): BufferGeometry | null {
	const pos: number[] = [];
	const at = (x: number, y: number) => {
		const [wx, wz] = toMapWorld(x, y);
		pos.push(wx, 0, wz);
	};
	if (!f.inside) {
		const { x, y, w, h } = f.box;
		at(x, y);
		at(x, y + h);
		at(x + w, y);
		at(x + w, y);
		at(x, y + h);
		at(x + w, y + h);
	} else if (layout === 'circles') {
		const d = LIVING_DISC;
		for (let s = 0; s < RIM_SEGS; s++) {
			const a0 = (s / RIM_SEGS) * Math.PI * 2;
			const a1 = ((s + 1) / RIM_SEGS) * Math.PI * 2;
			at(d.x, d.y);
			at(d.x + Math.cos(a1) * d.r, d.y + Math.sin(a1) * d.r);
			at(d.x + Math.cos(a0) * d.r, d.y + Math.sin(a0) * d.r);
		}
	} else return null;
	const nrm = pos.map((_, i) => (i % 3 === 1 ? 1 : 0));
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('normal', new Float32BufferAttribute(nrm, 3));
	return geo;
}

/** A patch of the same ground over `box`, `up` above it, for an overlay texture (the gold Samhan line). */
export function drapeGeometry(f: ReliefField, box: SheetBox, up: number): BufferGeometry {
	const nx = 64;
	const ny = Math.max(2, Math.round(((nx - 1) * box.h) / box.w) + 1);
	const pos: number[] = [];
	const uv: number[] = [];
	const idx: number[] = [];
	for (let j = 0; j < ny; j++) {
		for (let i = 0; i < nx; i++) {
			const x = box.x + (i / (nx - 1)) * box.w;
			const y = box.y + (j / (ny - 1)) * box.h;
			const [wx, wz] = toMapWorld(x, y);
			pos.push(wx, heightAt(f, x, y) + up, wz);
			uv.push(i / (nx - 1), 1 - j / (ny - 1));
		}
	}
	for (let j = 0; j < ny - 1; j++) {
		for (let i = 0; i < nx - 1; i++) {
			const a = j * nx + i;
			idx.push(a, a + nx, a + 1, a + 1, a + nx, a + nx + 1);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute('position', new Float32BufferAttribute(pos, 3));
	geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	return geo;
}
