// Traces the sea (h ≤ 0) of a baked battle grid into sheet polygons for its "sea" terrain.
//   node scripts/.cache/trace-coast.mjs <battle-id> [minCells]
import fs from 'node:fs';

const [id, minArg] = process.argv.slice(2);
const NX = 161;
const NY = 91;
const W = 1000;
const H = 560;
const dem = new Int16Array(fs.readFileSync(`static/battles/terrain/${id}.bin`).buffer.slice(0));
const sea = (i, j) => i < 0 || j < 0 || i >= NX || j >= NY ? false : dem[j * NX + i] <= 0;

// Connected sea components that touch the frame edge.
const comp = new Int32Array(NX * NY).fill(-1);
const comps = [];
for (let j = 0; j < NY; j++)
	for (let i = 0; i < NX; i++) {
		if (!sea(i, j) || comp[j * NX + i] >= 0) continue;
		const c = comps.length;
		const stack = [[i, j]];
		let n = 0;
		let edge = false;
		comp[j * NX + i] = c;
		while (stack.length) {
			const [x, y] = stack.pop();
			n++;
			if (x === 0 || y === 0 || x === NX - 1 || y === NY - 1) edge = true;
			for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
				const u = x + dx;
				const v = y + dy;
				if (sea(u, v) && comp[v * NX + u] < 0) {
					comp[v * NX + u] = c;
					stack.push([u, v]);
				}
			}
		}
		comps.push({ n, edge });
	}
const keep = comps.map((c) => c.edge && c.n >= Number(minArg ?? 40));
const inSea = (i, j) => {
	if (i < -1 || j < -1 || i > NX || j > NY) return false;
	if (i < 0 || j < 0 || i >= NX || j >= NY) {
		const ci = Math.max(0, Math.min(NX - 1, i));
		const cj = Math.max(0, Math.min(NY - 1, j));
		const c = comp[cj * NX + ci];
		return c >= 0 && keep[c];
	}
	const c = comp[j * NX + i];
	return c >= 0 && keep[c];
};

// Boundary edges between cells (one ring per component), walked into loops on the cell-corner lattice.
const edges = new Map();
const add = (a, b) => {
	const k = a.join(',');
	if (!edges.has(k)) edges.set(k, []);
	edges.get(k).push(b);
};
for (let j = -1; j <= NY; j++)
	for (let i = -1; i <= NX; i++) {
		if (!inSea(i, j)) continue;
		if (!inSea(i, j - 1)) add([i, j], [i + 1, j]);
		if (!inSea(i + 1, j)) add([i + 1, j], [i + 1, j + 1]);
		if (!inSea(i, j + 1)) add([i + 1, j + 1], [i, j + 1]);
		if (!inSea(i - 1, j)) add([i, j + 1], [i, j]);
	}
const loops = [];
while (edges.size) {
	const [startKey] = edges.keys();
	const loop = [];
	let key = startKey;
	while (edges.has(key)) {
		const outs = edges.get(key);
		const next = outs.pop();
		if (!outs.length) edges.delete(key);
		loop.push(key.split(',').map(Number));
		key = next.join(',');
	}
	loops.push(loop);
}

// Corner lattice → sheet, clamped to the frame, smoothed, then simplified.
const toSheet = ([i, j]) => [Math.max(0, Math.min(W, ((i - 0.5) / (NX - 1)) * W)), Math.max(0, Math.min(H, ((j - 0.5) / (NY - 1)) * H))];
const smooth = (p) => p.map((q, k) => {
	const a = p[(k - 1 + p.length) % p.length];
	const b = p[(k + 1) % p.length];
	const onEdge = (v) => v[0] <= 0 || v[0] >= W || v[1] <= 0 || v[1] >= H;
	return onEdge(q) ? q : [(a[0] + 2 * q[0] + b[0]) / 4, (a[1] + 2 * q[1] + b[1]) / 4];
});
function simplify(p, eps) {
	if (p.length < 3) return p;
	let best = 0;
	let at = 0;
	const [a, b] = [p[0], p[p.length - 1]];
	for (let k = 1; k < p.length - 1; k++) {
		const [x, y] = p[k];
		const d = Math.abs((b[1] - a[1]) * x - (b[0] - a[0]) * y + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(b[1] - a[1], b[0] - a[0]) || 1);
		if (d > best) {
			best = d;
			at = k;
		}
	}
	return best > eps ? [...simplify(p.slice(0, at + 1), eps).slice(0, -1), ...simplify(p.slice(at), eps)] : [a, b];
}
const out = loops
	.map((l) => {
		const s = smooth(smooth(l.map(toSheet)));
		let far = 0;
		s.forEach((q, k) => {
			if (Math.hypot(q[0] - s[0][0], q[1] - s[0][1]) > Math.hypot(s[far][0] - s[0][0], s[far][1] - s[0][1])) far = k;
		});
		const half = [...simplify(s.slice(0, far + 1), 3).slice(0, -1), ...simplify([...s.slice(far), s[0]], 3).slice(0, -1)];
		return half.map(([x, y]) => [Math.round(x), Math.round(y)]);
	})
	.filter((p) => p.length >= 3);
console.log(JSON.stringify(out));
