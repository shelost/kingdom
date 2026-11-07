import * as THREE from 'three';
import { rect, resample, type P2 } from './geo';
import { at, facing, box, type Builder, type Mat } from './kit';
import { lerp } from './common';
import { munru } from './fortress';

/*
 * Tang palace parts shared by Daming and the Tang halls built abroad: red rammed-earth terraces
 * with white stone balustrades, ramps, and que piers of grey brick.
 */

/** A sloped block between (za, ya) and (zb, yb), running along z, with its floor at `bottom`. */
export function slope(b: Builder, mat: Mat, x: number, w: number, za: number, ya: number, zb: number, yb: number, bottom: number): void {
	const L = Math.abs(zb - za);
	const g = new THREE.BoxGeometry(w, 1, L);
	const pos = g.getAttribute('position');
	for (let i = 0; i < pos.count; i++) {
		const t = (pos.getZ(i) + L / 2) / L;
		const top = lerp(ya, yb, t);
		pos.setXYZ(i, x + pos.getX(i), pos.getY(i) > 0 ? top : bottom, lerp(za, zb, t));
	}
	g.computeVertexNormals();
	b.push(mat, g);
}

/** White stone balustrade (난간) along a path at height y; `open` leaves gaps for stairs. */
export function balustrade(b: Builder, path: P2[], y: (x: number, z: number) => number, open: (x: number, z: number) => boolean = () => false): void {
	const line = resample(path, 2.2, false);
	for (let i = 0; i < line.length; i++) {
		const [x, z] = line[i];
		if (open(x, z)) continue;
		const yy = y(x, z);
		box(b, 'plaster', at(x, yy, z), 0, 0.6, 0, 0.3, 1.2, 0.3);
		const next = line[i + 1];
		if (!next || open(next[0], next[1])) continue;
		const L = Math.hypot(next[0] - x, next[1] - z);
		const m = at((x + next[0]) / 2, (yy + y(next[0], next[1])) / 2, (z + next[1]) / 2, facing(Math.atan2(next[1] - z, next[0] - x)));
		box(b, 'plaster', m, 0, 1.0, 0, L, 0.16, 0.2);
		box(b, 'plaster', m, 0, 0.3, 0, L, 0.12, 0.16);
	}
}

/** A red rammed-earth terrace block standing on `bottom`, with a white balustrade round its top. */
export function terrace(b: Builder, r: { x: number; z: number; w: number; d: number }, top: number, open: (x: number, z: number) => boolean, bottom: number): void {
	box(b, 'wallRed', at(r.x, bottom - 2, r.z), 0, (top - bottom + 2) / 2, 0, r.w, top - bottom + 2, r.d);
	box(b, 'stone', at(r.x, top, r.z), 0, 0.12, 0, r.w + 0.6, 0.24, r.d + 0.6);
	const edge = rect(r.x, r.z, r.w - 0.8, r.d - 0.8);
	balustrade(b, [...edge, edge[0]], () => top + 0.24, open);
}

/** A tapered grey-brick que pier with a pavilion on it; returns the pavilion's ridge height. */
export function que(b: Builder, x: number, y: number, z: number, base: number, topSide: number, h: number, storeys: 1 | 2): number {
	const g = new THREE.CylinderGeometry(topSide / Math.SQRT2, base / Math.SQRT2, h, 4, 1);
	g.rotateY(Math.PI / 4);
	b.push('wallStone', g, at(x, y + h / 2, z));
	box(b, 'stone', at(x, y + h, z), 0, 0.15, 0, topSide + 0.8, 0.3, topSide + 0.8);
	const bay = (topSide - 3) / 3;
	const res = munru(b, at(x, y + h + 0.3, z), { storeys, bays: [bay, bay * 1.1, bay], depth: [bay, bay], colH: storeys === 2 ? 3.8 : 3.4 });
	return y + h + 0.3 + res.ridge;
}
