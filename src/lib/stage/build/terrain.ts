import * as THREE from 'three';
import { smoothstep, type Bounds } from './geo';
import type { Palette } from './kit';

export type Ground = {
	height(x: number, z: number): number;
	/** sRGB hex for a spot; `slope` is 0 on the flat, 1 on a cliff. */
	color(x: number, z: number, y: number, slope: number): string;
	/** 0..1 forest canopy, drawn as clumped crowns by the ground shader. */
	cover?(x: number, z: number, y: number, slope: number): number;
};

const colorCache = new Map<string, THREE.Color>();
function linear(hex: string): THREE.Color {
	let c = colorCache.get(hex);
	if (!c) {
		c = new THREE.Color(hex);
		colorCache.set(hex, c);
	}
	return c;
}

function grid(
	g: Ground,
	minX: number,
	minZ: number,
	w: number,
	d: number,
	cell: number,
	lift: (x: number, z: number) => number
): THREE.BufferGeometry {
	const nx = Math.max(2, Math.round(w / cell));
	const nz = Math.max(2, Math.round(d / cell));
	const count = (nx + 1) * (nz + 1);
	const pos = new Float32Array(count * 3);
	const uv = new Float32Array(count * 2);
	for (let j = 0; j <= nz; j++) {
		for (let i = 0; i <= nx; i++) {
			const k = j * (nx + 1) + i;
			const x = minX + (w * i) / nx;
			const z = minZ + (d * j) / nz;
			pos[k * 3] = x;
			pos[k * 3 + 1] = g.height(x, z) + lift(x, z);
			pos[k * 3 + 2] = z;
			uv[k * 2] = x;
			uv[k * 2 + 1] = z;
		}
	}
	const idx = new Uint32Array(nx * nz * 6);
	let t = 0;
	for (let j = 0; j < nz; j++) {
		for (let i = 0; i < nx; i++) {
			const a = j * (nx + 1) + i;
			const b = a + 1;
			const c = a + nx + 1;
			const e = c + 1;
			idx[t++] = a;
			idx[t++] = c;
			idx[t++] = b;
			idx[t++] = b;
			idx[t++] = c;
			idx[t++] = e;
		}
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
	geo.setIndex(new THREE.BufferAttribute(idx, 1));
	geo.computeVertexNormals();
	const nrm = geo.getAttribute('normal');
	const col = new Float32Array(count * 3);
	const cov = new Float32Array(count);
	for (let k = 0; k < count; k++) {
		const x = pos[k * 3];
		const y = pos[k * 3 + 1];
		const z = pos[k * 3 + 2];
		const slope = 1 - nrm.getY(k);
		const c = linear(g.color(x, z, y, slope));
		col[k * 3] = c.r;
		col[k * 3 + 1] = c.g;
		col[k * 3 + 2] = c.b;
		cov[k] = g.cover ? g.cover(x, z, y, slope) : 0;
	}
	geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
	geo.setAttribute('cover', new THREE.BufferAttribute(cov, 1));
	geo.computeBoundingSphere();
	return geo;
}

/** The detailed ground around the site. */
export function nearGround(p: Palette, g: Ground, box: Bounds, cell: number): THREE.Mesh {
	const geo = grid(g, box.minX, box.minZ, box.maxX - box.minX, box.maxZ - box.minZ, cell, () => 0);
	const mesh = new THREE.Mesh(geo, p.ground);
	mesh.receiveShadow = true;
	mesh.name = 'ground';
	return mesh;
}

/** Coarse ground out to the horizon; it sinks under the near tiles so they never fight. */
export function farGround(p: Palette, g: Ground, near: Bounds | Bounds[], size: number, cell: number, cx = 0, cz = 0): THREE.Mesh {
	const tiles = Array.isArray(near) ? near : [near];
	const sink = (x: number, z: number) => {
		let s = 0;
		for (const t of tiles) {
			if (x <= t.minX || x >= t.maxX || z <= t.minZ || z >= t.maxZ) continue;
			const inside = Math.min(x - t.minX, t.maxX - x, z - t.minZ, t.maxZ - z);
			s = Math.min(s, -6 * smoothstep(0, cell * 1.5, inside));
		}
		return s;
	};
	const geo = grid(g, cx - size / 2, cz - size / 2, size, size, cell, sink);
	const mesh = new THREE.Mesh(geo, p.ground);
	mesh.receiveShadow = true;
	mesh.name = 'far-ground';
	return mesh;
}

/** Compact bump: 1 at the centre, 0 at radius 1 (elliptical). */
export function bump(x: number, z: number, cx: number, cz: number, rx: number, rz = rx): number {
	const d = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
	if (d >= 1) return 0;
	const f = 1 - d;
	return f * f;
}
