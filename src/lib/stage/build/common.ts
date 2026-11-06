import * as THREE from 'three';
import { ridgedMF, fbm, smoothstep, chaikin, resample, frames, rng, type Bounds, type P2 } from './geo';
import { nearGround, farGround, type Ground } from './terrain';
import { ribbon, palette, Builder, Forest, Town, type Palette, type PaletteOptions } from './kit';
import { lanterns, mistSheets, Cover, type MistLayer } from './nature';
import { buildLife, type LifeSpec } from './life';
import { wardrobe, type WardrobeSpec } from './wardrobe';
import { blend, blendColor, weight, type Label, type Layers, type LightMix, type LightPreset, type Realm, type SiteBuild, type View, type Weather } from './types';

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

export type RangeOpts = {
	/** Ridge spacing in metres. */
	scale?: number;
	/** Ranges that rise beyond radius `r` of (x, z) and run on to the horizon, `h` metres high. */
	horizon?: { x: number; z: number; r: number; h: number };
	seed?: number;
};

/**
 * Mountain ranges. Each listed massif is an envelope (where the mountains are and how high); the
 * relief inside it is one shared domain-warped ridged multifractal, so ridgelines, spurs and
 * V-valleys run continuously across the massifs instead of each being a roughened dome. The
 * optional horizon term keeps ranges going to the edge of the world for atmospheric layering.
 */
export function mountainField(list: Mountain[], o: RangeOpts = {}): (x: number, z: number) => number {
	const s = o.scale ?? 1000;
	const seed = o.seed ?? (list[0]?.seed ?? 1) * 7.3;
	const hz = o.horizon;
	return (x, z) => {
		let env = 0;
		for (const m of list) {
			const dx = (x - m.x) / m.rx;
			const dz = (z - m.z) / m.rz;
			const d2 = dx * dx + dz * dz;
			if (d2 >= 1) continue;
			const f = 1 - Math.sqrt(d2);
			env += m.h * Math.pow(f * f * (3 - 2 * f), 0.7);
		}
		if (hz) env += hz.h * smoothstep(hz.r, hz.r * 1.8, Math.hypot(x - hz.x, z - hz.z));
		if (env <= 0) return 0;
		const u = x / s + seed;
		const v = z / s - seed;
		const wu = u + 0.55 * fbm(u * 0.6 + 3.1, v * 0.6 - 1.3, 3);
		const wv = v + 0.55 * fbm(u * 0.6 - 4.7, v * 0.6 + 2.9, 3);
		const r = ridgedMF(wu, wv, 5);
		return env * (0.32 + 1.05 * Math.pow(r, 1.2));
	};
}

/** Dispose every geometry under a root (materials belong to the palette). */
export function disposeTree(root: THREE.Object3D): void {
	const owned = new Set<THREE.Material>();
	root.traverse((o) => {
		const mesh = o as THREE.Mesh;
		if (mesh.geometry) mesh.geometry.dispose();
		const mats = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
		for (const m of mats) if (m.userData?.owned) owned.add(m);
	});
	for (const m of owned) m.dispose();
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
	// trees grow in clumps that follow the slope: dense in the hollows, thin on steep faces, none on
	// cliffs, shorter toward the crests; fewer, fuller trees instead of an even carpet
	const tries = Math.round(n * 0.6);
	for (let k = 0; k < tries; k++) {
		const x = box.minX + rand() * (box.maxX - box.minX);
		const z = box.minZ + rand() * (box.maxZ - box.minZ);
		const clump = 0.5 + 0.5 * fbm(x / 140 + 11.3, z / 140 - 7.1, 2);
		if (rand() > 0.35 + clump * 0.9) continue;
		if (!ok(x, z)) continue;
		const y = g.height(x, z);
		const slope = Math.hypot(g.height(x + 3, z) - y, g.height(x, z + 3) - y) / 3;
		if (slope > 1.1 || (slope > 0.6 && rand() < 0.65)) continue;
		const k0 = kind(rand());
		const tall = 1 - Math.min(0.35, slope * 0.3);
		forest.add(k0, x, y - 0.3, z, (h[0] + rand() * (h[1] - h[0])) * tall * 1.08);
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
	const near = nearGround(p, g, o.near, o.cell);
	root.add(near);
	root.add(farGround(p, g, o.near, o.far, o.farCell, o.center[0], o.center[1]));
	const b = new Builder();
	b.ground = near.userData.sample;
	return { p, root, b, forest: new Forest(), town: new Town(), cover: new Cover(), labels: [], rand: rng(o.seed) };
}

/* ------------------------------------------------------------------ assembling a site */

const MIST: Record<LightPreset, { k: number; color: string }> = {
	dawn: { k: 1.35, color: '#f3dde2' },
	day: { k: 0.3, color: '#ffffff' },
	golden: { k: 1.05, color: '#ffd8ad' },
	night: { k: 0.75, color: '#6f80a6' }
};

const LAMP_GLOW: Record<LightPreset, number> = { dawn: 0.6, day: 0, golden: 2.6, night: 3.4 };

/** Cloud tint per preset: sunlit tops, and how solid the sea reads. */
const CLOUD: Record<LightPreset, { color: string; opacity: number }> = {
	dawn: { color: '#fbe3e0', opacity: 0.92 },
	day: { color: '#ffffff', opacity: 0.95 },
	golden: { color: '#ffdcb6', opacity: 0.93 },
	night: { color: '#5d6d94', opacity: 0.75 }
};

/** Which named layers each switch shows. */
const LAYER_OF: Record<string, keyof Layers> = { forest: 'nature', cover: 'nature', mist: 'mist', lanterns: 'lamps' };

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
	/** Chronicle water colour. Cloned off the shared teal so one river can be pale and another dark. */
	water?: {
		color: string;
		roughness?: number;
		metalness?: number;
		minSpan?: number;
		/** Water that lights itself (the underworld lake). */
		glow?: { color: string; k: number };
		/** Each river keeps the colour it was pushed with (`Builder.pushColored`). */
		painted?: boolean;
	};
	life?: LifeSpec;
	/** A costume lineup of the kingdom's figures, with its own camera. */
	wardrobe?: WardrobeSpec;
	/** Otherworld sites paint their own sky. */
	realm?: Realm;
	weather?: Weather;
};

function tintWater(root: THREE.Object3D, tint: NonNullable<AssembleOpts['water']>): void {
	root.traverse((o) => {
		const mesh = o as THREE.Mesh;
		if (mesh.name !== 'water' || !mesh.material) return;
		if (tint.minSpan) {
			mesh.geometry.computeBoundingBox();
			const box = mesh.geometry.boundingBox;
			if (!box) return;
			const span = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
			if (span < tint.minSpan) return;
		}
		const src = mesh.material as THREE.MeshStandardMaterial;
		const m = src.clone();
		m.onBeforeCompile = src.onBeforeCompile;
		m.customProgramCacheKey = src.customProgramCacheKey;
		m.userData.owned = true;
		m.color.set(tint.color);
		if (tint.roughness != null) m.roughness = tint.roughness;
		if (tint.metalness != null) m.metalness = tint.metalness;
		if (tint.glow) {
			m.emissive.set(tint.glow.color);
			m.emissiveIntensity = tint.glow.k;
		}
		if (tint.painted) m.vertexColors = true;
		mesh.material = m;
	});
}

/** Merge everything collected for a site into one root and give the scene its switches. */
export function assemble(o: AssembleOpts): SiteBuild {
	const { p, root } = o;
	const lamps = [...o.b.lamps];
	const ground = o.b.ground ?? (() => 0);
	const dressed = o.wardrobe ? wardrobe(o.wardrobe, o.b, o.life?.height ?? ground) : null;
	const labels = dressed ? [...o.labels, ...dressed.labels] : o.labels;
	const views = dressed ? [...o.views, dressed.view] : o.views;
	root.add(o.b.build(p));
	if (dressed) root.add(dressed.group);
	if (o.forest) {
		const trees = o.forest.build(p);
		trees.name = 'forest';
		root.add(trees);
	}
	if (o.town) root.add(o.town.build(p));
	if (o.cover) root.add(o.cover.build(p.cover));
	const lan = lanterns(lamps, p.lantern);
	if (lan) root.add(lan);
	const mist = o.mist ? mistSheets(o.mist.box, o.mist.layers, p.mist, o.mist.height, o.mist.tile) : null;
	if (mist) root.add(mist.group);
	if (o.water) tintWater(root, o.water);
	const life = o.life ? buildLife(o.life) : null;
	if (life) root.add(life.group);

	// the objects each layer switch shows and hides, found once
	const layered: { obj: THREE.Object3D; layer: keyof Layers }[] = [];
	const waters: THREE.Mesh[] = [];
	root.traverse((obj) => {
		const layer = (obj.userData.layer as keyof Layers | undefined) ?? LAYER_OF[obj.name];
		if (layer && obj !== root) layered.push({ obj, layer });
		if (obj.name === 'water') waters.push(obj as THREE.Mesh);
	});

	// every switch fades: `to` is the switch, `at` eases toward it each tick
	const FADES = ['nature', 'wind', 'mist', 'lamps', 'water'] as const;
	type Fade = (typeof FADES)[number];
	const at: Record<Fade, number> = { nature: 1, wind: 1, mist: 1, lamps: 1, water: 1 };
	const to: Record<Fade, number> = { ...at };
	const RATE: Record<Fade, number> = { nature: 1 / 1.8, wind: 1 / 1.2, mist: 1 / 1.4, lamps: 1 / 0.8, water: 1 / 1.5 };
	let shown: Layers | null = null;
	let light: LightMix = { a: 'day', b: 'day', t: 0 };
	let mistClock = 0;
	let rising = 0;
	const RISE_S = 3.2;
	p.rise.uRiseC.value.set(o.center[0], o.center[1]);
	p.rise.uRiseR.value = o.radius;

	const fogColor = new THREE.Color();
	function paint() {
		const lamp = at.lamps;
		p.lit(weight(light, 'night') * lamp);
		p.lantern.emissiveIntensity = blend(light, (id) => LAMP_GLOW[id]) * lamp;
		for (const m of [p.puff, p.cloudSheet]) {
			blendColor(light, (id) => CLOUD[id].color, m.color);
			m.opacity = blend(light, (id) => CLOUD[id].opacity);
		}
		if (mist) {
			const k = blend(light, (id) => MIST[id].k) * at.mist;
			blendColor(light, (id) => MIST[id].color, fogColor);
			mist.mats.forEach((m, i) => {
				m.opacity = Math.min(0.95, mist.base[i] * k);
				m.color.copy(fogColor);
			});
		}
	}

	function fade(dt: number) {
		let moved = false;
		for (const f of FADES) {
			if (at[f] === to[f]) continue;
			const step = RATE[f] * dt;
			at[f] = to[f] > at[f] ? Math.min(to[f], at[f] + step) : Math.max(to[f], at[f] - step);
			moved = true;
		}
		if (!moved) return;
		p.grow.value = at.nature;
		p.canopy.value = at.nature;
		p.wind.value = at.wind;
		p.flow.value = at.wind;
		if (shown) {
			for (const { obj, layer } of layered) {
				if (layer === 'nature') obj.visible = shown.nature || at.nature > 0;
				else if (layer === 'mist') obj.visible = shown.mist || at.mist > 0;
				else if (layer === 'lamps') obj.visible = shown.lamps || at.lamps > 0;
			}
		}
		paint();
	}

	const ray = new THREE.Raycaster();
	const down = new THREE.Vector3(0, -1, 0);
	const from = new THREE.Vector3();
	function water(x: number, z: number): number | null {
		if (!waters.length) return null;
		from.set(x, 4000, z);
		ray.set(from, down);
		const hit = ray.intersectObjects(waters, false)[0];
		return hit ? hit.point.y : null;
	}

	return {
		root,
		labels,
		views,
		center: o.center,
		radius: o.radius,
		haze: o.haze,
		lamps,
		realm: o.realm,
		weather: o.weather ?? (o.realm?.motes ? { motes: o.realm.motes } : {}),
		height: ground,
		water,
		get rising() {
			return rising > 0;
		},
		rise() {
			rising = RISE_S;
			p.rise.uRise.value = 0;
			return RISE_S;
		},
		setLight(mix) {
			light = mix;
			paint();
		},
		setEnv(tex) {
			p.setEnv(tex);
			root.traverse((obj) => {
				const mesh = obj as THREE.Mesh;
				if (mesh.name !== 'water') return;
				const m = mesh.material as THREE.MeshStandardMaterial;
				m.envMap = tex;
				m.envMapIntensity = 0.32;
			});
		},
		setLife(flags) {
			life?.show(flags.people, flags.boats);
		},
		setLayers(on) {
			const first = !shown;
			shown = { ...on };
			for (const f of FADES) to[f] = on[f] ? 1 : 0;
			// a fresh build starts bare when nature is on so the trees grow in with the rise
			if (first) {
				for (const f of FADES) at[f] = to[f];
				if (on.nature) at.nature = 0;
			}
			for (const { obj, layer } of layered) {
				if (layer === 'nature' || layer === 'mist' || layer === 'lamps') {
					if (on[layer]) obj.visible = true;
				} else obj.visible = on[layer];
			}
			p.grow.value = at.nature;
			p.canopy.value = at.nature;
			p.wind.value = at.wind;
			p.flow.value = at.wind;
			paint();
		},
		tick(t, dt) {
			p.time.value = t;
			const d = Math.max(0, Math.min(0.1, dt));
			// the water clock slows to a stop instead of freezing
			p.waterTime.value += d * at.water;
			if (rising > 0) {
				rising = Math.max(0, rising - d);
				p.rise.uRise.value = rising > 0 ? 1 - rising / RISE_S : 1;
			}
			// trees wait for the land, then grow
			fade(rising > 0 && p.rise.uRise.value < 0.45 ? 0 : d);
			if (mist) {
				mistClock += d * (1 + at.wind * 1.6);
				mist.mats.forEach((m, i) => {
					if (m.map) m.map.offset.set(i * 0.37 + mistClock * 0.0012 * (i + 1), i * 0.61 + mistClock * 0.0007 * (i % 2 ? 1 : -1));
				});
			}
			life?.tick(t, d);
			dressed?.tick(t, d);
		},
		dispose() {
			disposeTree(root);
			if (mist) for (const m of mist.mats) m.map?.dispose(), m.dispose();
			p.dispose();
		}
	};
}
