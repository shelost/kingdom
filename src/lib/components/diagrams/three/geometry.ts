/**
 * Shared unit-height geometries for the kit. Every slab, disc and beam is
 * built once per shape and scaled per mesh, so a chart of forty seats costs
 * a handful of buffers. Meshes pass `dispose={false}`: these outlive any one
 * canvas (three re-uploads them to the next context on demand).
 */

import {
	CylinderGeometry,
	ExtrudeGeometry,
	IcosahedronGeometry,
	Shape,
	SphereGeometry,
	TorusGeometry,
	type BufferGeometry
} from 'three';

const cache = new Map<string, BufferGeometry>();

function cached(key: string, make: () => BufferGeometry): BufferGeometry {
	let g = cache.get(key);
	if (!g) {
		g = make();
		cache.set(key, g);
	}
	return g;
}

const q = (n: number) => Math.round(n * 1000) / 1000;

/** A rounded rectangle (w × d) extruded from y = 0 to y = 1. Corners round in plan only. */
export function slabGeometry(w: number, d: number, r = 0.08): BufferGeometry {
	return cached(`slab:${q(w)}:${q(d)}:${q(r)}`, () => {
		const rr = Math.max(0.001, Math.min(r, w / 2 - 0.001, d / 2 - 0.001));
		const x = -w / 2;
		const y = -d / 2;
		const s = new Shape();
		s.moveTo(x + rr, y);
		s.lineTo(x + w - rr, y);
		s.quadraticCurveTo(x + w, y, x + w, y + rr);
		s.lineTo(x + w, y + d - rr);
		s.quadraticCurveTo(x + w, y + d, x + w - rr, y + d);
		s.lineTo(x + rr, y + d);
		s.quadraticCurveTo(x, y + d, x, y + d - rr);
		s.lineTo(x, y + rr);
		s.quadraticCurveTo(x, y, x + rr, y);
		const g = new ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 5 });
		// Extrusion runs along +z; turn it so it rises along +y with the plan on the ground.
		g.rotateX(-Math.PI / 2);
		g.computeVertexNormals();
		return g;
	});
}

/** A disc / drum of radius r from y = 0 to y = 1. */
export function discGeometry(r: number, segments = 48): BufferGeometry {
	return cached(`disc:${q(r)}:${segments}`, () => {
		const g = new CylinderGeometry(r, r, 1, segments);
		g.translate(0, 0.5, 0);
		return g;
	});
}

/** Unit beam: radius 1, length 1 along +y, centred. Scaled per segment. */
export function beamGeometry(): BufferGeometry {
	return cached('beam', () => new CylinderGeometry(1, 1, 1, 10));
}

export function ballGeometry(): BufferGeometry {
	return cached('ball', () => new SphereGeometry(1, 16, 12));
}

/**
 * A boulder of radius 1 sitting on y = 0, height 1: a low-poly icosahedron
 * with a fixed jitter (the same rock every time), its bottom flattened.
 */
export function rockGeometry(): BufferGeometry {
	return cached('rock', () => {
		const g = new IcosahedronGeometry(1, 1);
		const p = g.attributes.position;
		for (let i = 0; i < p.count; i++) {
			const x = p.getX(i);
			const y = p.getY(i);
			const z = p.getZ(i);
			const j = 0.84 + 0.16 * Math.abs(Math.sin(x * 12.9898 + y * 78.233 + z * 37.719));
			p.setXYZ(i, x * j, Math.max(-0.35, y * j), z * j);
		}
		g.computeVertexNormals();
		g.computeBoundingBox();
		const min = g.boundingBox!.min.y;
		const max = g.boundingBox!.max.y;
		g.translate(0, -min, 0);
		g.scale(1, 1 / (max - min), 1);
		return g;
	});
}

/** A ring lying on the ground (radius r, tube t). */
export function ringGeometry(r: number, t: number): BufferGeometry {
	return cached(`ring:${q(r)}:${q(t)}`, () => {
		const g = new TorusGeometry(r, t, 8, 120);
		g.rotateX(-Math.PI / 2);
		return g;
	});
}
