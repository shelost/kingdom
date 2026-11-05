import * as THREE from 'three';
import { ridged, chaikin, resample, frames, rng, type Bounds, type P2 } from './geo';
import { bump, nearGround, farGround, type Ground } from './terrain';
import { ribbon, palette, Builder, Forest, Town, type Palette, type PaletteOptions } from './kit';
import { lanterns, mistSheets, Cover, type MistLayer } from './nature';
import type { Label, LightPreset, SiteBuild, View } from './types';

export function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/** Axis-aligned footprints already taken, so placed buildings never overlap. */
export class Footprints {
	readonly list: Bounds[] = [];

	add(cx: number, cz: number, w: number, d: number): void {
		this.list.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
	}

	hits(cx: number, cz: number, w: number, d: number, pad = 0): boolean {
		const a = { minX: cx - w / 2 - pad, maxX: cx + w / 2 + pad, minZ: cz - d / 2 - pad, maxZ: cz + d / 2 + pad };
		return this.list.some((b) => a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ);
	}

	inside(x: number, z: number, pad = 0): boolean {
		return this.list.some((b) => x > b.minX - pad && x < b.maxX + pad && z > b.minZ - pad && z < b.maxZ + pad);
	}
}

export type Mountain = { x: number; z: number; rx: number; rz: number; h: number; seed: number };

/** Sum of compact mountain bumps, each roughened with ridged noise. */
export function mountainField(list: Mountain[]): (x: number, z: number) => number {
	return (x, z) => {
		let h = 0;
		for (const m of list) {
			const f = bump(x, z, m.x, m.z, m.rx, m.rz);
			if (f <= 0) continue;
			const rough = 0.55 + 0.9 * ridged(x / 700 + m.seed, z / 700 - m.seed, 4);
			h += m.h * Math.pow(f, 0.85) * rough;
		}
		return h;
	};
}

/** Dispose every geometry under a root (materials belong to the palette). */
export function disposeTree(root: THREE.Object3D): void {
	root.traverse((o) => {
		const mesh = o as THREE.Mesh;
		if (mesh.geometry) mesh.geometry.dispose();
	});
}

/** Pick one of a list by a 0..1 value. */
export function pick<T>(list: T[], t: number): T {
	return list[Math.min(list.length - 1, Math.max(0, Math.floor(t * list.length)))];
}

/** The ring where the ground first drops below `level`, walking out from a hilltop. */
export function contourRing(height: (x: number, z: number) => number, cx: number, cz: number, level: number, maxR: number, n: number): P2[] {
	const ring: P2[] = [];
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2;
		const dx = Math.cos(a);
		const dz = Math.sin(a);
		let r = 4;
		while (r < maxR && height(cx + dx * r, cz + dz * r) >= level) r += 4;
		r -= 2;
		ring.push([cx + dx * r, cz + dz * r]);
	}
	return chaikin(ring, 2, true);
}

/** A river's water surface as one smoothed ribbon. */
export function riverStrip(b: Builder, path: P2[], width: number, y: number): void {
	b.push('water', ribbon(chaikin(path, 2, false), width, () => y));
}

/** Street blocks of `pitch` metres, each split into a 3×3 grid of house plots. */
export function gridTown(
	town: Town,
	height: (x: number, z: number) => number,
	rand: () => number,
	box: Bounds,
	pitch: number,
	ok: (x: number, z: number) => boolean,
	o: { density: number; thatch: number; road?: number }
): void {
	const road = o.road ?? 7;
	const plot = (pitch - road) / 3;
	for (let bz = box.minZ; bz < box.maxZ; bz += pitch) {
		for (let bx = box.minX; bx < box.maxX; bx += pitch) {
			for (let j = 0; j < 3; j++) {
				for (let i = 0; i < 3; i++) {
					if (rand() > o.density) continue;
					const x = bx + road / 2 + plot * (i + 0.5) + (rand() - 0.5) * plot * 0.2;
					const z = bz + road / 2 + plot * (j + 0.5) + (rand() - 0.5) * plot * 0.2;
					if (!ok(x, z)) continue;
					const w = Math.min(plot * 0.8, 9 + rand() * 4);
					town.add(x, height(x, z), z, (rand() - 0.5) * 0.08 + (rand() > 0.85 ? Math.PI / 2 : 0), w, 6 + rand() * 1.5, 4.2 + rand() * 0.8, rand() < o.thatch);
				}
			}
		}
	}
}

/* ------------------------------------------------------------------ ground cover */

/** Reeds at the waterline, stones on the bed and grass up the bank, both sides of a river. */
export function bankCover(
	cover: Cover,
	g: Ground,
	path: P2[],
	water: number,
	rand: () => number,
	o: { from: number; to: number; step?: number; skip?: (x: number, z: number) => boolean; grass?: (x: number, z: number) => boolean }
): void {
	const bank = resample(chaikin(path, 2, false), o.step ?? 3, false);
	const fr = frames(bank, false);
	bank.forEach(([x, z], i) => {
		for (const side of [1, -1]) {
			for (let k = 0; k < 3; k++) {
				const off = o.from + rand() * (o.to - o.from);
				const px = x + fr[i].n[0] * side * off + (rand() - 0.5) * 3;
				const pz = z + fr[i].n[1] * side * off + (rand() - 0.5) * 3;
				if (o.skip?.(px, pz)) continue;
				const y = g.height(px, pz);
				if (y < water - 0.6) {
					if (rand() > 0.8) cover.add('rock', px, y, pz, 0.6 + rand() * 1.4);
				} else if (y < water + 1.3) cover.add('reed', px, y - 0.1, pz, 1.4 + rand() * 0.9);
				else if (y < water + 7 && (o.grass?.(px, pz) ?? true)) cover.add(rand() > 0.86 ? 'flowers' : 'grass', px, y - 0.05, pz, 0.9 + rand() * 0.8);
			}
		}
	});
}

/** Grass and wildflowers sprinkled over a box wherever `ok` allows. */
export function scatterCover(cover: Cover, g: Ground, box: Bounds, n: number, rand: () => number, ok: (x: number, z: number) => boolean, size = 1): void {
	for (let k = 0; k < n; k++) {
		const x = box.minX + rand() * (box.maxX - box.minX);
		const z = box.minZ + rand() * (box.maxZ - box.minZ);
		if (!ok(x, z)) continue;
		cover.add(rand() > 0.86 ? 'flowers' : 'grass', x, g.height(x, z) - 0.05, z, size * (0.9 + rand() * 0.8));
	}
}

/** Trees scattered over a box wherever `ok` allows; `kind` picks the species per tree. */
export function scatterTrees(
	forest: Forest,
	g: Ground,
	box: Bounds,
	n: number,
	rand: () => number,
	ok: (x: number, z: number) => boolean,
	kind: (r: number) => Parameters<Forest['add']>[0],
	h: [number, number] = [8, 15]
): void {
	for (let k = 0; k < n; k++) {
		const x = box.minX + rand() * (box.maxX - box.minX);
		const z = box.minZ + rand() * (box.maxZ - box.minZ);
		if (!ok(x, z)) continue;
		forest.add(kind(rand()), x, g.height(x, z), z, h[0] + rand() * (h[1] - h[0]));
	}
}

/* ------------------------------------------------------------------ starting a site */

export type SiteFrame = {
	p: Palette;
	root: THREE.Group;
	b: Builder;
	forest: Forest;
	town: Town;
	cover: Cover;
	labels: Label[];
	rand: () => number;
};

/** Everything a site builder starts with: palette, the two ground tiles and empty collectors. */
export function startSite(
	name: string,
	g: Ground,
	o: { near: Bounds; cell: number; far: number; farCell: number; center: [number, number]; seed: number; palette?: PaletteOptions }
): SiteFrame {
	const p = palette(o.palette);
	const root = new THREE.Group();
	root.name = name;
	root.add(nearGround(p, g, o.near, o.cell));
	root.add(farGround(p, g, o.near, o.far, o.farCell, o.center[0], o.center[1]));
	return { p, root, b: new Builder(), forest: new Forest(), town: new Town(), cover: new Cover(), labels: [], rand: rng(o.seed) };
}

/* ------------------------------------------------------------------ assembling a site */

const MIST: Record<LightPreset, { k: number; color: string }> = {
	dawn: { k: 1.35, color: '#f3dde2' },
	day: { k: 0.3, color: '#ffffff' },
	golden: { k: 1.05, color: '#ffd8ad' },
	night: { k: 0.75, color: '#6f80a6' }
};

const LAMP_GLOW: Record<LightPreset, number> = { dawn: 0.6, day: 0, golden: 2.6, night: 3.4 };

export type AssembleOpts = {
	p: Palette;
	root: THREE.Group;
	b: Builder;
	forest?: Forest;
	town?: Town;
	cover?: Cover;
	mist?: { box: Bounds; layers: MistLayer[]; height: (x: number, z: number) => number; tile?: number };
	labels: Label[];
	views: View[];
	center: [number, number];
	radius: number;
	haze: string;
};

/** Merge everything collected for a site into one root and give the scene its switches. */
export function assemble(o: AssembleOpts): SiteBuild {
	const { p, root } = o;
	const lamps = [...o.b.lamps];
	root.add(o.b.build(p));
	if (o.forest) root.add(o.forest.build(p));
	if (o.town) root.add(o.town.build(p));
	if (o.cover) root.add(o.cover.build(p.cover));
	const lan = lanterns(lamps, p.lantern);
	if (lan) root.add(lan);
	const mist = o.mist ? mistSheets(o.mist.box, o.mist.layers, p.mist, o.mist.height, o.mist.tile) : null;
	if (mist) root.add(mist.group);

	return {
		root,
		labels: o.labels,
		views: o.views,
		center: o.center,
		radius: o.radius,
		haze: o.haze,
		lamps,
		setLight(light) {
			p.lit(light === 'night');
			p.lantern.emissiveIntensity = LAMP_GLOW[light];
			if (mist) {
				mist.mats.forEach((m, i) => {
					m.opacity = Math.min(0.95, mist.base[i] * MIST[light].k);
					m.color.set(MIST[light].color);
				});
			}
		},
		setEnv(tex) {
			p.setEnv(tex);
		},
		tick(t) {
			p.time.value = t;
			if (mist) {
				mist.mats.forEach((m, i) => {
					if (m.map) m.map.offset.set(i * 0.37 + t * 0.0012 * (i + 1), i * 0.61 + t * 0.0007 * (i % 2 ? 1 : -1));
				});
			}
		},
		dispose() {
			disposeTree(root);
			if (mist) for (const m of mist.mats) m.map?.dispose(), m.dispose();
			p.dispose();
		}
	};
}
