/**
 * Korean timber-architecture kit for /stage. Everything is generated geometry,
 * merged per material so a whole palace is a few dozen draw calls.
 *
 * Conventions: metres; +y up; plan +x east, +z south; buildings face +z (south).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { chaikin, frames, resample, rng, type P2 } from './geo';
import { patchGround, patchSway, patchWater, patchSnow, tuftTexture, mistTexture, type CoverMaterials, type TimeUniform } from './nature';

/* ------------------------------------------------------------------ textures */

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return [c, c.getContext('2d') as CanvasRenderingContext2D];
}

function texture(c: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
	const t = new THREE.CanvasTexture(c);
	t.wrapS = t.wrapT = THREE.RepeatWrapping;
	t.anisotropy = 8;
	if (srgb) t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

/** One tile row per repeat: convex cover tile, then the trough. Course lines every repeat in v. */
function tileTexture(light: string, mid: string, dark: string): THREE.CanvasTexture {
	const [c, g] = canvas(64, 64);
	const grad = g.createLinearGradient(0, 0, 64, 0);
	grad.addColorStop(0, dark);
	grad.addColorStop(0.08, mid);
	grad.addColorStop(0.22, light);
	grad.addColorStop(0.36, mid);
	grad.addColorStop(0.44, dark);
	grad.addColorStop(0.62, mid);
	grad.addColorStop(1, dark);
	g.fillStyle = grad;
	g.fillRect(0, 0, 64, 64);
	g.fillStyle = 'rgba(0,0,0,0.18)';
	g.fillRect(0, 0, 64, 3);
	g.fillStyle = 'rgba(255,255,255,0.05)';
	g.fillRect(0, 3, 64, 2);
	return texture(c);
}

/** Dancheong bracket band: green ground, clustered bracket blocks with red and white edging. */
function bracketTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(128, 64);
	g.fillStyle = '#2f6e5f';
	g.fillRect(0, 0, 128, 64);
	for (const x0 of [8, 72]) {
		g.fillStyle = '#244f45';
		g.fillRect(x0, 10, 48, 44);
		g.fillStyle = '#3e8a76';
		g.fillRect(x0 + 4, 14, 40, 10);
		g.fillRect(x0 + 10, 28, 28, 10);
		g.fillRect(x0 + 16, 42, 16, 10);
		g.fillStyle = '#b2392c';
		g.fillRect(x0 + 4, 24, 40, 3);
		g.fillRect(x0 + 10, 38, 28, 3);
		g.fillStyle = '#e9e1cf';
		g.fillRect(x0 + 4, 13, 40, 1);
		g.fillRect(x0 + 10, 27, 28, 1);
	}
	g.fillStyle = '#b2392c';
	g.fillRect(0, 60, 128, 4);
	g.fillStyle = '#1f3f38';
	g.fillRect(0, 0, 128, 3);
	return texture(c);
}

/** One double door leaf per panel: red frame, light lattice above, solid panel below. */
function doorTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(128, 192);
	g.fillStyle = '#8f2f25';
	g.fillRect(0, 0, 128, 192);
	for (const x0 of [6, 66]) {
		g.fillStyle = '#d8cdb4';
		g.fillRect(x0, 8, 56, 128);
		g.strokeStyle = '#7c2a21';
		g.lineWidth = 3;
		for (let x = x0; x <= x0 + 56; x += 9.33) {
			g.beginPath();
			g.moveTo(x, 8);
			g.lineTo(x, 136);
			g.stroke();
		}
		for (let y = 8; y <= 136; y += 10.66) {
			g.beginPath();
			g.moveTo(x0, y);
			g.lineTo(x0 + 56, y);
			g.stroke();
		}
		g.fillStyle = '#7a271f';
		g.fillRect(x0, 144, 56, 40);
		g.fillStyle = '#9c372b';
		g.fillRect(x0 + 6, 150, 44, 28);
	}
	return texture(c);
}

/** Dressed stone courses, staggered joints. Used for stylobates, revetments and fortress walls. */
function courseTexture(base: string, joint: string, seed: number): THREE.CanvasTexture {
	const [c, g] = canvas(128, 128);
	const rand = rng(seed);
	g.fillStyle = base;
	g.fillRect(0, 0, 128, 128);
	const rows = 4;
	for (let r = 0; r < rows; r++) {
		const y = (r * 128) / rows;
		let x = r % 2 ? -24 : 0;
		while (x < 128) {
			const w = 30 + rand() * 26;
			const shade = Math.floor(rand() * 26) - 13;
			g.fillStyle = `rgba(${shade > 0 ? 255 : 0},${shade > 0 ? 255 : 0},${shade > 0 ? 255 : 0},${Math.abs(shade) / 140})`;
			g.fillRect(x + 1, y + 1, w - 2, 128 / rows - 2);
			g.fillStyle = joint;
			g.fillRect(x, y, 2, 128 / rows);
			x += w;
		}
		g.fillStyle = joint;
		g.fillRect(0, y, 128, 2);
	}
	return texture(c);
}

/** Irregular flagstones for courtyards (박석). */
function pavingTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(256, 256);
	const rand = rng(7);
	g.fillStyle = '#b7b0a2';
	g.fillRect(0, 0, 256, 256);
	const step = 32;
	for (let y = 0; y < 256; y += step) {
		for (let x = 0; x < 256; x += step) {
			const v = 205 + Math.floor(rand() * 30);
			g.fillStyle = `rgb(${v},${v - 4},${v - 12})`;
			const jx = rand() * 5;
			const jy = rand() * 5;
			g.fillRect(x + 2 + jx, y + 2 + jy, step - 6 - jx, step - 6 - jy);
		}
	}
	return texture(c);
}

/** Painted rafter ends under the eaves. */
function soffitTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(64, 64);
	g.fillStyle = '#1f3d37';
	g.fillRect(0, 0, 64, 64);
	for (let x = 0; x < 64; x += 16) {
		g.fillStyle = '#3f8471';
		g.fillRect(x + 3, 0, 10, 64);
		g.fillStyle = '#b2392c';
		g.fillRect(x + 3, 0, 10, 6);
	}
	return texture(c);
}

/** Neutral grain multiplied over vertex-coloured ground. */
function grainTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(256, 256);
	const img = g.createImageData(256, 256);
	const rand = rng(11);
	for (let i = 0; i < img.data.length; i += 4) {
		const v = 214 + Math.floor(rand() * 41);
		img.data[i] = v;
		img.data[i + 1] = v;
		img.data[i + 2] = v;
		img.data[i + 3] = 255;
	}
	g.putImageData(img, 0, 0);
	return texture(c);
}

/** Gentle ripple normals for water. */
function rippleTexture(): THREE.CanvasTexture {
	const size = 256;
	const [c, g] = canvas(size, size);
	const img = g.createImageData(size, size);
	const h = (x: number, y: number) =>
		Math.sin((x / size) * Math.PI * 8 + Math.sin((y / size) * Math.PI * 4) * 1.4) * 0.5 +
		Math.sin((y / size) * Math.PI * 10 + Math.cos((x / size) * Math.PI * 6)) * 0.5;
	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const dx = h(x + 1, y) - h(x - 1, y);
			const dy = h(x, y + 1) - h(x, y - 1);
			const i = (y * size + x) * 4;
			img.data[i] = Math.floor((dx * 0.5 + 0.5) * 255);
			img.data[i + 1] = Math.floor((dy * 0.5 + 0.5) * 255);
			img.data[i + 2] = 255;
			img.data[i + 3] = 255;
		}
	}
	g.putImageData(img, 0, 0);
	return texture(c, false);
}

/* ------------------------------------------------------------------ palette */

export type Mat =
	| 'tile'
	| 'tileRed'
	| 'thatch'
	| 'bark'
	| 'ridge'
	| 'timber'
	| 'green'
	| 'bracket'
	| 'plaster'
	| 'wallRed'
	| 'door'
	| 'stone'
	| 'wallStone'
	| 'courses'
	| 'paving'
	| 'path'
	| 'lawn'
	| 'rampart'
	| 'earth'
	| 'wood'
	| 'soffit'
	| 'water'
	| 'brick'
	| 'rock'
	| 'gold'
	| 'dark'
	| 'cloud'
	| 'blue'
	| 'yellow'
	| 'orange'
	| 'vermilion';

export type Palette = {
	mats: Record<Mat, THREE.Material>;
	ground: THREE.MeshStandardMaterial;
	foliage: THREE.MeshStandardMaterial;
	bark: THREE.MeshStandardMaterial;
	houses: THREE.MeshStandardMaterial;
	ripple: THREE.Texture;
	/** Clock shared by the swaying and rippling materials. */
	time: TimeUniform;
	cover: CoverMaterials;
	lantern: THREE.MeshStandardMaterial;
	mist: THREE.Texture;
	/** Lamplight behind the door lattice (night). */
	lit(on: boolean): void;
	/** The sky the water should mirror. */
	setEnv(tex: THREE.Texture | null): void;
	dispose(): void;
};

export type PaletteOptions = {
	/** Goguryeo red-brown roof tiles instead of grey. */
	redTiles?: boolean;
	/** Warm light behind lattice at night. */
	lit?: boolean;
	/** 0..1 snow on every upward face (roofs, crowns, rock). */
	snow?: number;
};

export function palette(opts: PaletteOptions = {}): Palette {
	const textures: THREE.Texture[] = [];
	const keep = <T extends THREE.Texture>(t: T, repeat?: [number, number]) => {
		if (repeat) t.repeat.set(repeat[0], repeat[1]);
		textures.push(t);
		return t;
	};
	const grey = keep(tileTexture('#8c97a2', '#646f7a', '#3a424b'));
	const red = keep(tileTexture('#9a6a58', '#74493c', '#452a22'));
	const bracket = keep(bracketTexture(), [0.5, 1]);
	const door = keep(doorTexture());
	const stone = keep(courseTexture('#cbc4b6', '#8f887b', 3), [0.5, 0.5]);
	const wallStone = keep(courseTexture('#a7a59d', '#6b6a64', 5), [0.25, 0.4]);
	const courses = keep(courseTexture('#c2b9a6', '#7d7564', 9), [1, 1]);
	const paving = keep(pavingTexture(), [0.12, 0.12]);
	const soffit = keep(soffitTexture(), [1.6, 1]);
	const grain = keep(grainTexture(), [0.08, 0.08]);
	const ripple = keep(rippleTexture(), [0.06, 0.06]);
	const brick = keep(courseTexture('#5d5852', '#3b3834', 13), [1.2, 1.2]);

	const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...p });

	const mats: Record<Mat, THREE.Material> = {
		tile: std({ map: grey, roughness: 0.72 }),
		tileRed: std({ map: red, roughness: 0.72 }),
		thatch: std({ color: '#a98d5c', map: grain, roughness: 1 }),
		bark: std({ color: '#6e4a35', map: grain, roughness: 0.95 }),
		ridge: std({ color: '#2f353c', roughness: 0.7 }),
		timber: std({ color: '#a3352a', roughness: 0.62 }),
		green: std({ color: '#2f6e5f', roughness: 0.7 }),
		bracket: std({ map: bracket, roughness: 0.75 }),
		plaster: std({ color: '#efe9dd', roughness: 0.92 }),
		wallRed: std({ color: '#9a2f26', roughness: 0.8 }),
		door: std({
			map: door,
			roughness: 0.8,
			emissive: new THREE.Color('#ffb257'),
			emissiveIntensity: opts.lit ? 0.55 : 0,
			emissiveMap: door
		}),
		stone: std({ map: stone, roughness: 0.9 }),
		wallStone: std({ map: wallStone, roughness: 0.95 }),
		courses: std({ map: courses, roughness: 0.92 }),
		paving: std({ map: paving, roughness: 0.95 }),
		path: std({ color: '#cbb791', map: grain, roughness: 1 }),
		lawn: std({ color: '#86a65a', map: grain, roughness: 1 }),
		rampart: std({ color: '#7f9c52', map: grain, roughness: 1 }),
		earth: std({ color: '#ad9470', map: grain, roughness: 1 }),
		wood: std({ color: '#6e3a27', roughness: 0.75 }),
		soffit: std({ map: soffit, roughness: 0.8 }),
		water: new THREE.MeshStandardMaterial({
			color: '#3a878c',
			roughness: 0.12,
			metalness: 0.02,
			normalMap: ripple,
			normalScale: new THREE.Vector2(0.25, 0.25),
			envMapIntensity: 1.25
		}),
		brick: std({ map: brick, roughness: 0.9 }),
		rock: std({ color: '#8b877d', roughness: 1, flatShading: true }),
		gold: std({ color: '#c99a3c', roughness: 0.35, metalness: 0.75 }),
		dark: std({ color: '#1d1a17', roughness: 1 }),
		cloud: std({ color: '#f4f2ee', roughness: 1 }),
		blue: std({ color: '#2d5fa8', roughness: 0.8, side: THREE.DoubleSide }),
		yellow: std({ color: '#d9b13a', roughness: 0.8, side: THREE.DoubleSide }),
		orange: std({ color: '#e07a2a', roughness: 0.8, side: THREE.DoubleSide }),
		vermilion: std({ color: '#d8452b', roughness: 0.8, side: THREE.DoubleSide })
	};
	(mats.tile as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.tileRed as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.thatch as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.bark as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.wallStone as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.courses as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.rampart as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
	(mats.water as THREE.MeshStandardMaterial).side = THREE.DoubleSide;

	const ground = new THREE.MeshStandardMaterial({ vertexColors: true, map: grain, roughness: 1, metalness: 0 });
	const foliage = new THREE.MeshStandardMaterial({ roughness: 0.92 });
	const bark = new THREE.MeshStandardMaterial({ color: '#6b4a34', roughness: 1 });
	const houses = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
	const time: TimeUniform = { value: 0 };
	patchGround(ground);
	patchSway(foliage, time, 'tree', 0.03);
	patchWater(mats.water as THREE.MeshStandardMaterial, time);

	const grassTex = keep(tuftTexture(false));
	const flowerTex = keep(tuftTexture(true));
	const mist = keep(mistTexture());
	const card = (map: THREE.Texture) =>
		new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1 });
	const cover: CoverMaterials = {
		grass: card(grassTex),
		flowers: card(flowerTex),
		shrub: new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }),
		reed: new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide }),
		rock: new THREE.MeshStandardMaterial({ color: '#9a958a', roughness: 1, flatShading: true }),
		fruit: new THREE.MeshStandardMaterial({ roughness: 0.45 })
	};
	patchSway(cover.grass, time, 'grass', 0.09, false);
	patchSway(cover.flowers, time, 'flowers', 0.09, false);
	patchSway(cover.shrub, time, 'shrub', 0.02);
	patchSway(cover.reed, time, 'reed', 0.12, false);
	if (opts.snow) {
		for (const m of [mats.tile, mats.tileRed, mats.rock, mats.earth, mats.wallStone, foliage, cover.shrub, cover.rock]) patchSnow(m, opts.snow);
	}
	const lantern = new THREE.MeshStandardMaterial({ color: '#efe2c4', roughness: 0.7, emissive: new THREE.Color('#ffae55'), emissiveIntensity: 0 });

	return {
		mats,
		ground,
		foliage,
		bark,
		houses,
		ripple,
		time,
		cover,
		lantern,
		mist,
		lit(on) {
			(mats.door as THREE.MeshStandardMaterial).emissiveIntensity = on ? 0.75 : 0;
		},
		setEnv(tex) {
			const w = mats.water as THREE.MeshStandardMaterial;
			w.envMap = tex;
			w.envMapIntensity = 0.32;
			w.needsUpdate = true;
		},
		dispose() {
			for (const m of Object.values(mats)) m.dispose();
			for (const m of Object.values(cover)) m.dispose();
			lantern.dispose();
			ground.dispose();
			foliage.dispose();
			bark.dispose();
			houses.dispose();
			for (const t of textures) t.dispose();
		}
	};
}

/* ------------------------------------------------------------------ builder */

const SOLID_EXCLUDE = new Set<Mat>(['water', 'cloud']);

const TILE = 250;

/**
 * Collects geometry per material, then merges each bucket into one mesh. Buckets are also split
 * into plan tiles so the camera can cull what is off screen.
 */
export class Builder {
	private parts = new Map<string, { mat: Mat; list: THREE.BufferGeometry[] }>();
	/** Lantern points collected while building (gates, bridges). */
	readonly lamps: [number, number, number][] = [];

	/** A stone lantern post with a paper lantern on top. */
	lampPost(x: number, y: number, z: number): void {
		box(this, 'stone', at(x, y, z), 0, 0.9, 0, 0.32, 1.8, 0.32);
		this.lamps.push([x, y + 2.15, z]);
	}

	push(mat: Mat, geo: THREE.BufferGeometry, m?: THREE.Matrix4): void {
		let g = geo.index ? geo.toNonIndexed() : geo;
		if (g === geo && m) g = geo.clone();
		if (m) g.applyMatrix4(m);
		if (!g.getAttribute('normal')) g.computeVertexNormals();
		if (!g.getAttribute('uv')) {
			const n = g.getAttribute('position').count;
			g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
		}
		for (const name of Object.keys(g.attributes)) {
			if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
		}
		g.morphAttributes = {};
		g.computeBoundingBox();
		const bb = g.boundingBox!;
		const big = bb.max.x - bb.min.x > TILE || bb.max.z - bb.min.z > TILE;
		const key = big ? `${mat}|all` : `${mat}|${Math.floor((bb.min.x + bb.max.x) / 2 / TILE)}|${Math.floor((bb.min.z + bb.max.z) / 2 / TILE)}`;
		const bucket = this.parts.get(key);
		if (bucket) bucket.list.push(g);
		else this.parts.set(key, { mat, list: [g] });
		if (g !== geo) geo.dispose();
	}

	build(p: Palette): THREE.Group {
		const group = new THREE.Group();
		for (const { mat, list } of this.parts.values()) {
			const merged = mergeGeometries(list, false);
			for (const g of list) g.dispose();
			if (!merged) continue;
			merged.computeBoundingSphere();
			const mesh = new THREE.Mesh(merged, p.mats[mat]);
			mesh.name = mat;
			mesh.castShadow = !SOLID_EXCLUDE.has(mat);
			mesh.receiveShadow = true;
			group.add(mesh);
		}
		this.parts.clear();
		return group;
	}
}

/* ------------------------------------------------------------------ transforms */

const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpS = new THREE.Vector3();
const tmpP = new THREE.Vector3();
const Y = new THREE.Vector3(0, 1, 0);

/** Placement matrix: plan position (x, z), height y, plan rotation `rot` (radians, about +y). */
export function at(x: number, y: number, z: number, rot = 0, scale = 1): THREE.Matrix4 {
	tmpE.set(0, rot, 0);
	tmpQ.setFromEuler(tmpE);
	tmpS.set(scale, scale, scale);
	tmpP.set(x, y, z);
	return new THREE.Matrix4().compose(tmpP, tmpQ, tmpS);
}

/** Plan angle (atan2(dz, dx)) → y rotation that points local +x along it. */
export function facing(angle: number): number {
	return -angle;
}

export function child(m: THREE.Matrix4, x: number, y: number, z: number, rot = 0): THREE.Matrix4 {
	return m.clone().multiply(at(x, y, z, rot));
}

/* ------------------------------------------------------------------ primitives */

/** A box with UVs in metres (so tiled textures keep their size), centred at (x, y, z) in `m`. */
export function box(
	b: Builder,
	mat: Mat,
	m: THREE.Matrix4,
	x: number,
	y: number,
	z: number,
	w: number,
	h: number,
	d: number,
	opts: { metric?: boolean; rot?: number } = {}
): void {
	const g = new THREE.BoxGeometry(w, h, d);
	if (opts.metric !== false) {
		const uv = g.getAttribute('uv') as THREE.BufferAttribute;
		const dims: [number, number][] = [
			[d, h],
			[d, h],
			[w, d],
			[w, d],
			[w, h],
			[w, h]
		];
		for (let f = 0; f < 6; f++) {
			for (let k = 0; k < 4; k++) {
				const i = f * 4 + k;
				uv.setXY(i, uv.getX(i) * dims[f][0], uv.getY(i) * dims[f][1]);
			}
		}
	}
	b.push(mat, g, m.clone().multiply(at(x, y, z, opts.rot ?? 0)));
}

export function cylinder(
	b: Builder,
	mat: Mat,
	m: THREE.Matrix4,
	x: number,
	y: number,
	z: number,
	rTop: number,
	rBot: number,
	h: number,
	seg = 10
): void {
	const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, 1);
	b.push(mat, g, m.clone().multiply(at(x, y, z)));
}

const vA = new THREE.Vector3();
const vB = new THREE.Vector3();

/** A square-section beam between two local points. */
export function beam(b: Builder, mat: Mat, m: THREE.Matrix4, a: THREE.Vector3Like, c: THREE.Vector3Like, w: number, h = w): void {
	vA.set(a.x, a.y, a.z);
	vB.set(c.x, c.y, c.z);
	const len = vA.distanceTo(vB);
	if (len < 1e-3) return;
	const g = new THREE.BoxGeometry(w, h, len);
	const look = new THREE.Matrix4().lookAt(vA, vB, Math.abs(vB.x - vA.x) + Math.abs(vB.z - vA.z) < 1e-4 ? new THREE.Vector3(1, 0, 0) : Y);
	const mid = vA.clone().add(vB).multiplyScalar(0.5);
	look.setPosition(mid);
	b.push(mat, g, m.clone().multiply(look));
}

/** Beams along a polyline. */
export function beamPath(b: Builder, mat: Mat, m: THREE.Matrix4, pts: THREE.Vector3[], w: number, h = w): void {
	for (let i = 0; i < pts.length - 1; i++) beam(b, mat, m, pts[i], pts[i + 1], w, h);
}

/** A quad-grid surface from rows of points, wound so its face points along `out`. */
export function surface(rows: THREE.Vector3[][], uvs: [number, number][][], out: THREE.Vector3): THREE.BufferGeometry {
	const R = rows.length;
	const C = rows[0].length;
	const pos = new Float32Array(R * C * 3);
	const uv = new Float32Array(R * C * 2);
	for (let i = 0; i < R; i++) {
		for (let j = 0; j < C; j++) {
			const k = i * C + j;
			pos[k * 3] = rows[i][j].x;
			pos[k * 3 + 1] = rows[i][j].y;
			pos[k * 3 + 2] = rows[i][j].z;
			uv[k * 2] = uvs[i][j][0];
			uv[k * 2 + 1] = uvs[i][j][1];
		}
	}
	let flip = false;
	const n = new THREE.Vector3();
	search: for (let i = 0; i < R - 1; i++) {
		for (let j = 0; j < C - 1; j++) {
			const a = rows[i][j];
			const bb = rows[i + 1][j];
			const c = rows[i][j + 1];
			n.subVectors(bb, a).cross(new THREE.Vector3().subVectors(c, a));
			if (n.lengthSq() > 1e-8) {
				flip = n.dot(out) < 0;
				break search;
			}
		}
	}
	const idx: number[] = [];
	for (let i = 0; i < R - 1; i++) {
		for (let j = 0; j < C - 1; j++) {
			const a = i * C + j;
			const bb = (i + 1) * C + j;
			const c = i * C + j + 1;
			const d = (i + 1) * C + j + 1;
			if (flip) idx.push(a, c, bb, bb, c, d);
			else idx.push(a, bb, c, bb, d, c);
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
	g.setIndex(idx);
	g.computeVertexNormals();
	return g;
}

/** A flat polygon (plan outline) at height y, facing up. UVs in metres. */
export function flat(pts: P2[], y: number): THREE.BufferGeometry {
	const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)));
	const g = new THREE.ShapeGeometry(shape, 2);
	g.rotateX(-Math.PI / 2);
	g.translate(0, y, 0);
	const pos = g.getAttribute('position');
	const uv = g.getAttribute('uv') as THREE.BufferAttribute;
	for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i), pos.getZ(i));
	return g;
}

/** A vertical skirt following a plan outline, from y0 up to y1 (revetments, pond walls). */
export function skirt(pts: P2[], y0: number | ((x: number, z: number) => number), y1: number | ((x: number, z: number) => number), closed = true): THREE.BufferGeometry {
	const ring = closed ? [...pts, pts[0]] : pts;
	const bottom: THREE.Vector3[] = [];
	const top: THREE.Vector3[] = [];
	const uvB: [number, number][] = [];
	const uvT: [number, number][] = [];
	let s = 0;
	for (let i = 0; i < ring.length; i++) {
		if (i) s += Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
		const [x, z] = ring[i];
		const lo = typeof y0 === 'number' ? y0 : y0(x, z);
		const hi = typeof y1 === 'number' ? y1 : y1(x, z);
		bottom.push(new THREE.Vector3(x, lo, z));
		top.push(new THREE.Vector3(x, hi, z));
		uvB.push([s, lo]);
		uvT.push([s, hi]);
	}
	return surface([bottom, top], [uvB, uvT], new THREE.Vector3(0, 0, 0));
}

/** A strip of constant width laid along a path (roads, paths, river water). `y` gets the path index too. */
export function ribbon(path: P2[], width: number, y: (x: number, z: number, i: number) => number, closed = false): THREE.BufferGeometry {
	const f = frames(path, closed);
	const left: THREE.Vector3[] = [];
	const right: THREE.Vector3[] = [];
	const uvL: [number, number][] = [];
	const uvR: [number, number][] = [];
	let s = 0;
	const ring = closed ? [...path, path[0]] : path;
	const fr = closed ? [...f, f[0]] : f;
	for (let i = 0; i < ring.length; i++) {
		if (i) s += Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]);
		const [x, z] = ring[i];
		const { n } = fr[i];
		const k = closed ? i % path.length : i;
		const lx = x + (n[0] * width) / 2;
		const lz = z + (n[1] * width) / 2;
		const rx = x - (n[0] * width) / 2;
		const rz = z - (n[1] * width) / 2;
		left.push(new THREE.Vector3(lx, y(lx, lz, k), lz));
		right.push(new THREE.Vector3(rx, y(rx, rz, k), rz));
		uvL.push([0, s]);
		uvR.push([width, s]);
	}
	return surface([left, right], [uvL, uvR], new THREE.Vector3(0, 1, 0));
}

/* ------------------------------------------------------------------ roofs */

export type RoofKind = 'hipgable' | 'hip' | 'gable' | 'pyramid' | 'skirt';

export type RoofSpec = {
	kind: RoofKind;
	/** Column-line footprint. */
	w: number;
	d: number;
	/** Eave overhang beyond the column line. */
	over: number;
	/** Wall-plate height (top of the bracket band). */
	y0: number;
	/** Ridge height above y0. */
	h: number;
	lift?: number;
	sweep?: number;
	/** Hip-and-gable: share of the half-depth taken by the hipped skirt. */
	hipShare?: number;
	/** Skirt (pent roof): the upper body it climbs to. */
	inner?: { w: number; d: number; y: number };
	chimi?: boolean;
	finial?: boolean;
	/** Gable roofs: build the triangular ends. */
	ends?: boolean;
	tile?: RoofTile;
};

/** `bark`: Japanese cypress-bark shingles (hiwadabuki), the Asuka palace roofs. */
export type RoofTile = 'tile' | 'tileRed' | 'thatch' | 'bark';

const TILE_PITCH = 0.36;

function chimi(b: Builder, m: THREE.Matrix4, x: number, y: number, s: number, outward: 1 | -1): void {
	const shape = new THREE.Shape();
	const pts: [number, number][] = [
		[-0.55, 0],
		[0.3, 0],
		[0.5, 0.35],
		[0.68, 0.85],
		[0.8, 1.35],
		[0.86, 1.62],
		[0.66, 1.52],
		[0.48, 1.3],
		[0.42, 1.12],
		[0.24, 1.04],
		[0.16, 0.86],
		[-0.04, 0.78],
		[-0.16, 0.58],
		[-0.38, 0.48],
		[-0.55, 0.28]
	];
	shape.moveTo(pts[0][0], pts[0][1]);
	for (const [px, py] of pts.slice(1)) shape.lineTo(px, py);
	shape.closePath();
	const g = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: false });
	g.translate(0, 0, -0.21);
	g.scale(s, s, s);
	b.push('ridge', g, m.clone().multiply(at(x, y, 0, outward === 1 ? 0 : Math.PI)));
}

function finial(b: Builder, m: THREE.Matrix4, y: number, s: number): void {
	cylinder(b, 'ridge', m, 0, y + 0.2 * s, 0, 0.45 * s, 0.55 * s, 0.4 * s, 10);
	const g = new THREE.SphereGeometry(0.42 * s, 12, 8);
	b.push('ridge', g, m.clone().multiply(at(0, y + 0.75 * s, 0)));
	cylinder(b, 'ridge', m, 0, y + 1.25 * s, 0, 0.12 * s, 0.2 * s, 0.6 * s, 8);
}

/** Hip-and-gable (팔작), hip (우진각), pyramid (사모) and pent skirts, with swept, lifted eaves. */
export function roof(b: Builder, m: THREE.Matrix4, r: RoofSpec): void {
	if (r.kind === 'gable') {
		gableRoof(b, m, r);
		return;
	}
	const tile = r.tile ?? 'tile';
	const ex = r.w / 2 + r.over;
	const ez = r.d / 2 + r.over;
	const lift = r.lift ?? Math.min(1.6, Math.max(0.2, Math.min(ex, ez) * 0.11));
	const sweep = r.sweep ?? r.over * 0.3;
	const yE = r.y0 - r.over * 0.42;
	const yR = r.y0 + r.h;
	let tx: number;
	let tz: number;
	let ty: number;
	if (r.kind === 'hipgable') {
		const i = ez * (r.hipShare ?? 0.52);
		tx = Math.max(0.4, ex - i);
		tz = Math.max(0.4, ez - i);
		ty = r.y0 + r.h * 0.6;
	} else if (r.kind === 'hip') {
		tz = 0.02;
		tx = Math.max(ex - ez, 0.4);
		ty = yR;
	} else if (r.kind === 'pyramid') {
		tx = 0.02;
		tz = 0.02;
		ty = yR;
	} else {
		const inner = r.inner ?? { w: r.w * 0.6, d: r.d * 0.6, y: r.y0 + r.h };
		tx = inner.w / 2;
		tz = inner.d / 2;
		ty = inner.y;
	}

	const M = Math.min(18, Math.max(6, Math.round(ex / 1.2)));
	const N = 7;
	const bend = (s: number) => sweep * (1 - Math.pow(Math.abs(s), 2.5));
	const rise = (s: number) => lift * Math.pow(Math.abs(s), 3);

	type Edge = { eave: (s: number) => P2; top: (s: number) => P2; wall: (s: number) => P2; out: THREE.Vector3; along: (s: number) => number };
	const edges: Edge[] = [
		{ eave: (s) => [s * ex, ez - bend(s)], top: (s) => [s * tx, tz], wall: (s) => [(s * r.w) / 2, r.d / 2], out: new THREE.Vector3(0, 1, 1), along: (s) => s * ex },
		{ eave: (s) => [-s * ex, -(ez - bend(s))], top: (s) => [-s * tx, -tz], wall: (s) => [(-s * r.w) / 2, -r.d / 2], out: new THREE.Vector3(0, 1, -1), along: (s) => s * ex },
		{ eave: (s) => [ex - bend(s), -s * ez], top: (s) => [tx, -s * tz], wall: (s) => [r.w / 2, (-s * r.d) / 2], out: new THREE.Vector3(1, 1, 0), along: (s) => s * ez },
		{ eave: (s) => [-(ex - bend(s)), s * ez], top: (s) => [-tx, s * tz], wall: (s) => [-r.w / 2, (s * r.d) / 2], out: new THREE.Vector3(-1, 1, 0), along: (s) => s * ez }
	];

	const fasciaH = 0.2 + r.over * 0.05;
	const hipLines: THREE.Vector3[][] = [[], [], [], []];

	edges.forEach((edge, e) => {
		const rows: THREE.Vector3[][] = [];
		const uvs: [number, number][][] = [];
		for (let i = 0; i <= N; i++) {
			const u = i / N;
			const row: THREE.Vector3[] = [];
			const uvRow: [number, number][] = [];
			for (let j = 0; j <= M; j++) {
				const s = -1 + (2 * j) / M;
				const [ax, az] = edge.eave(s);
				const [bx, bz] = edge.top(s);
				const ya = yE + rise(s);
				const x = ax + (bx - ax) * u;
				const z = az + (bz - az) * u;
				const y = ya + (ty - ya) * Math.pow(u, 1.5);
				row.push(new THREE.Vector3(x, y, z));
				uvRow.push([edge.along(s) * (1 - u * 0.25) / TILE_PITCH, u * Math.hypot(bx - ax, bz - az, ty - ya) / 0.45]);
			}
			rows.push(row);
			uvs.push(uvRow);
		}
		b.push(tile, surface(rows, uvs, edge.out), m);

		hipLines[e] = rows.map((row) => row[M].clone().add(new THREE.Vector3(0, 0.12, 0)));

		// fascia: the dark band of end tiles
		const lip: THREE.Vector3[] = [];
		const low: THREE.Vector3[] = [];
		const lipUv: [number, number][] = [];
		const lowUv: [number, number][] = [];
		for (let j = 0; j <= M; j++) {
			const p = rows[0][j];
			lip.push(p.clone());
			low.push(new THREE.Vector3(p.x, p.y - fasciaH, p.z));
			lipUv.push([j, 1]);
			lowUv.push([j, 0]);
		}
		const outFlat = edge.out.clone().setY(0);
		b.push('ridge', surface([low, lip], [lowUv, lipUv], outFlat), m);

		// soffit: rafters from the fascia back to the wall plate
		const soff: THREE.Vector3[][] = [low, []];
		const soffUv: [number, number][][] = [[], []];
		for (let j = 0; j <= M; j++) {
			const s = -1 + (2 * j) / M;
			const [wx, wz] = edge.wall(s);
			soff[1].push(new THREE.Vector3(wx, r.y0 - 0.05, wz));
			soffUv[0].push([edge.along(s) / 0.62, 0]);
			soffUv[1].push([edge.along(s) / 0.62 * (r.w / 2 / ex), 1]);
		}
		b.push('soffit', surface(soff, soffUv, new THREE.Vector3(0, -1, 0).add(outFlat.clone().multiplyScalar(0.3))), m);
	});

	const rs = Math.min(0.85, Math.max(0.22, r.h * 0.075));
	for (const line of hipLines) beamPath(b, 'ridge', m, line, rs * 0.7, rs * 0.55);

	if (r.kind === 'hipgable') {
		const rows: THREE.Vector3[][] = [];
		const rowsB: THREE.Vector3[][] = [];
		const uvs: [number, number][][] = [];
		const G = 4;
		const C = Math.max(2, Math.round(tx / 1.2));
		for (let i = 0; i <= G; i++) {
			const u = i / G;
			const row: THREE.Vector3[] = [];
			const rowB: THREE.Vector3[] = [];
			const uvRow: [number, number][] = [];
			for (let j = 0; j <= C; j++) {
				const x = -tx - 0.25 + ((2 * tx + 0.5) * j) / C;
				const z = tz * (1 - u);
				const y = ty + (yR - ty) * Math.pow(u, 1.25);
				row.push(new THREE.Vector3(x, y, z));
				rowB.push(new THREE.Vector3(x, y, -z));
				uvRow.push([x / TILE_PITCH, (u * Math.hypot(tz, yR - ty)) / 0.45]);
			}
			rows.push(row);
			rowsB.push(rowB);
			uvs.push(uvRow);
		}
		b.push(tile, surface(rows, uvs, new THREE.Vector3(0, 1, 1)), m);
		b.push(tile, surface(rowsB, uvs, new THREE.Vector3(0, 1, -1)), m);

		// gable boards (합각)
		for (const sx of [1, -1] as const) {
			const gx = sx * (tx - 0.15);
			const tri = new THREE.BufferGeometry();
			const v = new Float32Array([gx, ty, -tz, gx, ty, tz, gx, yR - 0.1, 0]);
			tri.setAttribute('position', new THREE.BufferAttribute(v, 3));
			tri.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0.5, 1]), 2));
			if (sx === -1) tri.setIndex([0, 2, 1]);
			else tri.setIndex([0, 1, 2]);
			tri.computeVertexNormals();
			b.push('wood', tri, m);
			// rake ridges
			beamPath(
				b,
				'ridge',
				m,
				rows.map((row) => new THREE.Vector3(sx * (tx + 0.25), row[0].y + 0.1, row[0].z)),
				rs * 0.6,
				rs * 0.5
			);
			beamPath(
				b,
				'ridge',
				m,
				rowsB.map((row) => new THREE.Vector3(sx * (tx + 0.25), row[0].y + 0.1, row[0].z)),
				rs * 0.6,
				rs * 0.5
			);
		}
		box(b, 'ridge', m, 0, yR + rs * 0.35, 0, 2 * tx + 0.6, rs * 1.1, rs * 0.9);
		if (r.chimi !== false && r.h > 2.2) {
			const cs = Math.min(2.1, Math.max(0.55, r.h * 0.2));
			chimi(b, m, tx + 0.2, yR + rs * 0.8, cs, 1);
			chimi(b, m, -tx - 0.2, yR + rs * 0.8, cs, -1);
		}
	} else if (r.kind === 'hip') {
		box(b, 'ridge', m, 0, yR + rs * 0.35, 0, 2 * tx + 0.4, rs * 1.1, rs * 0.9);
		if (r.chimi) {
			const cs = Math.min(1.8, Math.max(0.5, r.h * 0.2));
			chimi(b, m, tx + 0.1, yR + rs * 0.8, cs, 1);
			chimi(b, m, -tx - 0.1, yR + rs * 0.8, cs, -1);
		}
	} else if (r.kind === 'pyramid' && r.finial !== false) {
		finial(b, m, yR, Math.min(1.6, Math.max(0.5, r.h * 0.18)));
	}
}

/** Gable roof (맞배): corridors, gates of small compounds, houses, storehouses. */
function gableRoof(b: Builder, m: THREE.Matrix4, r: RoofSpec): void {
	const tile = r.tile ?? 'tile';
	const ex = r.w / 2 + (r.ends === false ? 0 : r.over * 0.55);
	const ez = r.d / 2 + r.over;
	const yE = r.y0 - r.over * 0.42;
	const yR = r.y0 + r.h;
	const C = 2;
	const N = 4;
	const fasciaH = 0.18 + r.over * 0.05;
	for (const sz of [1, -1] as const) {
		const rows: THREE.Vector3[][] = [];
		const uvs: [number, number][][] = [];
		for (let i = 0; i <= N; i++) {
			const u = i / N;
			const row: THREE.Vector3[] = [];
			const uvRow: [number, number][] = [];
			for (let j = 0; j <= C; j++) {
				const x = -ex + (2 * ex * j) / C;
				row.push(new THREE.Vector3(x, yE + (yR - yE) * Math.pow(u, 1.3), sz * ez * (1 - u)));
				uvRow.push([x / TILE_PITCH, (u * Math.hypot(ez, yR - yE)) / 0.45]);
			}
			rows.push(row);
			uvs.push(uvRow);
		}
		b.push(tile, surface(rows, uvs, new THREE.Vector3(0, 1, sz)), m);
		const lip = rows[0].map((p) => p.clone());
		const low = rows[0].map((p) => new THREE.Vector3(p.x, p.y - fasciaH, p.z));
		const uvA: [number, number][] = lip.map((_, j) => [j, 1]);
		const uvB: [number, number][] = lip.map((_, j) => [j, 0]);
		b.push('ridge', surface([low, lip], [uvB, uvA], new THREE.Vector3(0, 0, sz)), m);
		const wall = low.map((p) => new THREE.Vector3(p.x, r.y0 - 0.05, (sz * r.d) / 2));
		b.push(
			'soffit',
			surface(
				[low, wall],
				[low.map((p) => [p.x / 0.62, 0] as [number, number]), wall.map((p) => [p.x / 0.62, 1] as [number, number])],
				new THREE.Vector3(0, -1, sz * 0.3)
			),
			m
		);
	}
	const rs = Math.min(0.6, Math.max(0.18, r.h * 0.08));
	box(b, 'ridge', m, 0, yR + rs * 0.3, 0, 2 * ex + 0.2, rs, rs * 0.85);
	if (r.ends !== false) {
		for (const sx of [1, -1] as const) {
			const gx = (sx * r.w) / 2;
			const tri = new THREE.BufferGeometry();
			tri.setAttribute('position', new THREE.BufferAttribute(new Float32Array([gx, r.y0 - 0.05, -r.d / 2, gx, r.y0 - 0.05, r.d / 2, gx, yR - 0.15, 0]), 3));
			tri.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0.5, 1]), 2));
			tri.setIndex(sx === 1 ? [0, 2, 1] : [0, 1, 2]);
			tri.computeVertexNormals();
			b.push('wood', tri, m);
			beam(b, 'ridge', m, new THREE.Vector3(sx * ex, yE + 0.1, ez), new THREE.Vector3(sx * ex, yR + 0.1, 0), rs * 0.55, rs * 0.45);
			beam(b, 'ridge', m, new THREE.Vector3(sx * ex, yE + 0.1, -ez), new THREE.Vector3(sx * ex, yR + 0.1, 0), rs * 0.55, rs * 0.45);
		}
	}
}

/* ------------------------------------------------------------------ halls */

export type Face = 'doors' | 'wall' | 'open' | 'windows' | 'red';

export type HallSpec = {
	/** Bay widths along x (front), and along z (depth). */
	bays: number[];
	depth: number[];
	colH: number;
	r?: number;
	/** Stylobate height; 0 for none (upper storeys, buildings on decks). */
	base?: number;
	tiers?: 1 | 2;
	pad?: number;
	bracket?: number;
	front?: Face;
	back?: Face;
	sides?: Face;
	steps?: ('s' | 'n' | 'e' | 'w')[];
	rail?: boolean;
	/** Raise the floor on posts (storehouses, waterside pavilions). */
	posts?: number;
	roof?: Partial<Omit<RoofSpec, 'w' | 'd' | 'y0'>> | false;
	/** A wall across the middle column line with leaves in the centre bays (gates). */
	gateLine?: number;
};

export type HallResult = { w: number; d: number; floor: number; top: number; ridge: number };

function nodes(bays: number[]): number[] {
	const total = bays.reduce((a, c) => a + c, 0);
	const out = [-total / 2];
	for (const bay of bays) out.push(out[out.length - 1] + bay);
	return out;
}

function panel(b: Builder, m: THREE.Matrix4, face: Face, x: number, z: number, w: number, h: number, floor: number, rot: number): void {
	if (face === 'open') return;
	const pm = m.clone().multiply(at(x, 0, z, rot));
	if (face === 'doors') {
		box(b, 'door', pm, 0, floor + 0.25 + (h - 0.25) / 2, 0, w, h - 0.25, 0.12, { metric: false });
		box(b, 'timber', pm, 0, floor + 0.13, 0, w, 0.26, 0.2);
	} else if (face === 'windows') {
		box(b, 'plaster', pm, 0, floor + h * 0.28, 0, w, h * 0.56, 0.2);
		box(b, 'door', pm, 0, floor + h * 0.56 + (h * 0.44) / 2, 0, w * 0.86, h * 0.44, 0.12, { metric: false });
		box(b, 'timber', pm, 0, floor + h * 0.56, 0, w, 0.16, 0.24);
	} else {
		box(b, face === 'red' ? 'wallRed' : 'plaster', pm, 0, floor + h / 2, 0, w, h, 0.22);
		box(b, 'timber', pm, 0, floor + h * 0.42, 0, w, 0.18, 0.26);
		box(b, 'timber', pm, 0, floor + 0.12, 0, w, 0.24, 0.26);
	}
}

/** A timber hall on a stone stylobate: columns, doors, bracket band and roof. */
export function hall(b: Builder, m: THREE.Matrix4, s: HallSpec): HallResult {
	const xs = nodes(s.bays);
	const zs = nodes(s.depth);
	const W = xs[xs.length - 1] - xs[0];
	const D = zs[zs.length - 1] - zs[0];
	const minBay = Math.min(...s.bays, ...s.depth);
	const r = s.r ?? Math.min(0.42, Math.max(0.16, minBay * 0.075));
	const base = s.base ?? 1;
	const pad = s.pad ?? Math.max(1.1, r * 4);
	const tiers = s.tiers ?? 1;
	const posts = s.posts ?? 0;

	if (base > 0) {
		if (tiers === 2) {
			box(b, 'stone', m, 0, (base * 0.45) / 2, 0, W + 2 * pad + 1.6, base * 0.45, D + 2 * pad + 1.6);
			box(b, 'stone', m, 0, base * 0.45 + (base * 0.55) / 2, 0, W + 2 * pad, base * 0.55, D + 2 * pad);
		} else {
			box(b, 'stone', m, 0, base / 2, 0, W + 2 * pad, base, D + 2 * pad);
		}
		box(b, 'stone', m, 0, base - 0.05, 0, W + 2 * pad + 0.2, 0.12, D + 2 * pad + 0.2);
		const n = Math.max(2, Math.round(base / 0.2));
		const mid = Math.floor(s.bays.length / 2);
		const sw = Math.max(2.2, s.bays[mid] * 0.85);
		const mz = Math.floor(s.depth.length / 2);
		const swz = Math.max(2.2, s.depth[mz] * 0.85);
		for (const side of s.steps ?? ['s']) {
			const sm = m.clone().multiply(
				at(0, 0, 0, side === 's' ? 0 : side === 'n' ? Math.PI : side === 'e' ? Math.PI / 2 : -Math.PI / 2)
			);
			const edge = side === 's' || side === 'n' ? D / 2 + pad : W / 2 + pad;
			const width = side === 's' || side === 'n' ? sw : swz;
			for (let i = 0; i < n; i++) {
				const h = (base * (i + 1)) / n;
				box(b, 'stone', sm, 0, h / 2, edge + (n - i - 0.5) * 0.32, width, h, 0.32);
			}
			for (const sx of [-1, 1]) {
				const x = (sx * (width + 0.36)) / 2;
				const run = n * 0.32;
				beam(b, 'stone', sm, new THREE.Vector3(x, base - 0.05, edge), new THREE.Vector3(x, 0.15, edge + run), 0.36, 0.4);
			}
		}
	}

	const floor = base + posts;
	if (posts > 0) {
		for (const x of xs) for (const z of zs) cylinder(b, 'wood', m, x, base + posts / 2, z, r * 0.8, r * 0.9, posts, 8);
		box(b, 'wood', m, 0, floor - 0.15, 0, W + 0.6, 0.3, D + 0.6);
	}

	const cb = floor + 0.18;
	for (let i = 0; i < xs.length; i++) {
		for (let j = 0; j < zs.length; j++) {
			const edge = i === 0 || i === xs.length - 1 || j === 0 || j === zs.length - 1;
			const onGate = s.gateLine !== undefined && j === s.gateLine;
			if (!edge && !onGate) continue;
			cylinder(b, 'stone', m, xs[i], floor + 0.09, zs[j], r * 1.75, r * 1.95, 0.18, 8);
			cylinder(b, 'timber', m, xs[i], cb + s.colH / 2, zs[j], r * 0.86, r, s.colH, 8);
		}
	}

	const ph = s.colH - 0.1;
	const faces: [Face, number, number, boolean][] = [
		[s.front ?? 'doors', D / 2, 0, true],
		[s.back ?? 'wall', -D / 2, Math.PI, true],
		[s.sides ?? 'wall', W / 2, -Math.PI / 2, false],
		[s.sides ?? 'wall', -W / 2, Math.PI / 2, false]
	];
	for (const [face, line, rot, alongX] of faces) {
		const ns = alongX ? xs : zs;
		for (let k = 0; k < ns.length - 1; k++) {
			const c = (ns[k] + ns[k + 1]) / 2;
			const w = ns[k + 1] - ns[k] - r * 1.6;
			if (alongX) panel(b, m, face, c, line, w, ph, cb, rot);
			else panel(b, m, face, line, c, w, ph, cb, rot);
		}
	}
	if (s.gateLine !== undefined) {
		const gz = zs[s.gateLine];
		const mid = Math.floor(s.bays.length / 2);
		for (let k = 0; k < xs.length - 1; k++) {
			const c = (xs[k] + xs[k + 1]) / 2;
			const w = xs[k + 1] - xs[k] - r * 1.6;
			const central = Math.abs(k - mid) <= (s.bays.length >= 5 ? 1 : 0);
			if (central) {
				box(b, 'timber', m, c - w / 4 - 0.02, cb + ph * 0.42, gz, w / 2 - 0.04, ph * 0.84, 0.18);
				box(b, 'timber', m, c + w / 4 + 0.02, cb + ph * 0.42, gz, w / 2 - 0.04, ph * 0.84, 0.18);
				box(b, 'plaster', m, c, cb + ph * 0.92, gz, w, ph * 0.16, 0.2);
			} else {
				panel(b, m, 'wall', c, gz, w, ph, cb, 0);
			}
		}
	}

	if (s.rail) {
		const ry = floor + 0.85;
		const rw = W + 1.4;
		const rd = D + 1.4;
		for (const sz of [1, -1]) box(b, 'timber', m, 0, ry, (sz * rd) / 2, rw, 0.12, 0.12);
		for (const sx of [1, -1]) box(b, 'timber', m, (sx * rw) / 2, ry, 0, 0.12, 0.12, rd);
		for (const sz of [1, -1]) box(b, 'timber', m, 0, floor + 0.35, (sz * rd) / 2, rw, 0.08, 0.08);
		for (const sx of [1, -1]) box(b, 'timber', m, (sx * rw) / 2, floor + 0.35, 0, 0.08, 0.08, rd);
		box(b, 'wood', m, 0, floor - 0.08, 0, rw + 0.2, 0.16, rd + 0.2);
	}

	const lintel = cb + s.colH;
	box(b, 'timber', m, 0, lintel + 0.21, D / 2, W + r * 2, 0.42, r * 1.6);
	box(b, 'timber', m, 0, lintel + 0.21, -D / 2, W + r * 2, 0.42, r * 1.6);
	box(b, 'timber', m, W / 2, lintel + 0.21, 0, r * 1.6, 0.42, D + r * 2);
	box(b, 'timber', m, -W / 2, lintel + 0.21, 0, r * 1.6, 0.42, D + r * 2);
	const plate = lintel + 0.42;
	box(b, 'green', m, 0, plate + 0.11, 0, W + r * 3, 0.22, D + r * 3);
	const bk = s.bracket ?? Math.min(1.8, Math.max(0.55, s.colH * 0.2));
	const ring = (len: number, y: number, z: number, rot: number) => box(b, 'bracket', m, 0, y, z, len, bk, 0.7, { rot });
	ring(W + 1.0, plate + 0.22 + bk / 2, D / 2 + 0.15, 0);
	ring(W + 1.0, plate + 0.22 + bk / 2, -D / 2 - 0.15, 0);
	box(b, 'bracket', m, W / 2 + 0.15, plate + 0.22 + bk / 2, 0, 0.7, bk, D + 1.0);
	box(b, 'bracket', m, -W / 2 - 0.15, plate + 0.22 + bk / 2, 0, 0.7, bk, D + 1.0);
	box(b, 'dark', m, 0, plate + 0.22 + bk / 2, 0, W - 0.2, bk, D - 0.2);
	const y0 = plate + 0.22 + bk;

	let ridge = y0;
	if (s.roof !== false) {
		const spec = s.roof ?? {};
		const over = spec.over ?? Math.min(4.2, Math.max(1.1, D * 0.17 + 0.6));
		const h = spec.h ?? D * 0.36 + 1.2;
		roof(b, m, { kind: 'hipgable', ...spec, w: W, d: D, over, h, y0 } as RoofSpec);
		ridge = y0 + h;
	}
	return { w: W, d: D, floor, top: y0, ridge };
}

/** Two-storey hall or gate tower (중층): lower hall with a pent skirt, upper body on its plate. */
export function tower(
	b: Builder,
	m: THREE.Matrix4,
	lower: HallSpec,
	upper: Omit<HallSpec, 'base'> & { inset?: number }
): HallResult {
	const lowRes = hall(b, m, { ...lower, roof: false });
	const uw = upper.bays.reduce((a, c) => a + c, 0);
	const ud = upper.depth.reduce((a, c) => a + c, 0);
	const floorY = lowRes.top + 0.9;
	const lowSpec = typeof lower.roof === 'object' ? lower.roof : {};
	const over = lowSpec.over ?? Math.min(3.4, Math.max(1.1, lowRes.d * 0.15 + 0.4));
	roof(b, m, {
		kind: 'skirt',
		w: lowRes.w,
		d: lowRes.d,
		over,
		y0: lowRes.top,
		h: 1,
		inner: { w: uw + 0.5, d: ud + 0.5, y: floorY - 0.1 },
		tile: lowSpec.tile
	});
	box(b, 'wood', m, 0, floorY - 0.1, 0, uw + 0.6, 0.3, ud + 0.6);
	const up = hall(b, m.clone().multiply(at(0, floorY, 0)), { ...upper, base: 0, rail: upper.rail ?? true });
	return { w: lowRes.w, d: lowRes.d, floor: lowRes.floor, top: floorY + up.top, ridge: floorY + up.ridge };
}

/** A gate: open front and back, red leaves on the middle line. */
export function gate(b: Builder, m: THREE.Matrix4, bays: number[], depth: number[], colH: number, opts: Partial<HallSpec> = {}): HallResult {
	return hall(b, m, {
		bays,
		depth,
		colH,
		base: opts.base ?? 0.8,
		front: 'open',
		back: 'open',
		sides: 'wall',
		steps: ['s', 'n'],
		gateLine: Math.floor(depth.length / 2),
		...opts
	});
}

/* ------------------------------------------------------------------ corridors and courts */

export type CorridorOpts = { width?: number; colH?: number; bay?: number; base?: number; wall?: -1 | 0 | 1; tile?: RoofTile };

/** A roofed gallery (회랑) from a to c at ground height y. `wall` puts a plaster wall on that side. */
export function corridor(b: Builder, a: P2, c: P2, y: number, o: CorridorOpts = {}): void {
	const width = o.width ?? 5.2;
	const colH = o.colH ?? 3.3;
	const base = o.base ?? 0.45;
	const L = Math.hypot(c[0] - a[0], c[1] - a[1]);
	if (L < 1) return;
	const ang = Math.atan2(c[1] - a[1], c[0] - a[0]);
	const m = at((a[0] + c[0]) / 2, y, (a[1] + c[1]) / 2, facing(ang));
	box(b, 'stone', m, 0, base / 2, 0, L, base, width + 1.1);
	const n = Math.max(1, Math.round(L / (o.bay ?? 3.6)));
	const r = 0.17;
	for (let k = 0; k <= n; k++) {
		const x = -L / 2 + (L * k) / n;
		for (const sz of [-1, 1]) {
			cylinder(b, 'timber', m, x, base + colH / 2, (sz * width) / 2, r * 0.88, r, colH, 6);
		}
	}
	if (o.wall) {
		const z = (o.wall * width) / 2;
		for (let k = 0; k < n; k++) {
			const x = -L / 2 + (L * (k + 0.5)) / n;
			panel(b, m, k % 3 === 1 ? 'windows' : 'wall', x, z, L / n - r * 1.6, colH - 0.1, base, o.wall === 1 ? 0 : Math.PI);
		}
	}
	for (const sz of [-1, 1]) box(b, 'timber', m, 0, base + colH + 0.16, (sz * width) / 2, L, 0.32, 0.3);
	box(b, 'green', m, 0, base + colH + 0.42, 0, L, 0.2, width + 0.4);
	gableRoof(b, m, { kind: 'gable', w: L, d: width, over: 1.15, y0: base + colH + 0.52, h: width * 0.38, ends: false, tile: o.tile });
}

export type CloisterOpts = CorridorOpts & {
	gate?: { bays: number[]; depth: number[]; colH: number; twoStorey?: boolean };
	northGate?: boolean;
	pave?: boolean;
	corners?: boolean;
};

/** A walled court of corridors with a south gate, paved inside. Returns the gate's half-width. */
export function cloister(b: Builder, cx: number, cz: number, W: number, D: number, y: number, o: CloisterOpts = {}): void {
	const width = o.width ?? 5.2;
	const hw = width / 2;
	const nw: P2 = [cx - W / 2, cz - D / 2];
	const ne: P2 = [cx + W / 2, cz - D / 2];
	const se: P2 = [cx + W / 2, cz + D / 2];
	const sw: P2 = [cx - W / 2, cz + D / 2];
	const g = o.gate ?? { bays: [3.6, 4.2, 3.6], depth: [3, 3], colH: 4 };
	const gw = g.bays.reduce((a, c) => a + c, 0) / 2 + 0.8;
	const runs: [P2, P2, -1 | 1][] = [
		[[nw[0] - hw, nw[1]], [ne[0] + hw, ne[1]], -1],
		[[ne[0], ne[1] + hw], [se[0], se[1] - hw], -1],
		[[sw[0], sw[1] - hw], [nw[0], nw[1] + hw], -1],
		[[se[0] + hw, se[1]], [cx + gw, se[1]], -1],
		[[cx - gw, sw[1]], [sw[0] - hw, sw[1]], -1]
	];
	if (o.northGate) {
		runs[0] = [[nw[0] - hw, nw[1]], [cx - gw, nw[1]], -1];
		runs.push([[cx + gw, ne[1]], [ne[0] + hw, ne[1]], -1]);
	}
	for (const [a, c] of runs) {
		const ang = Math.atan2(c[1] - a[1], c[0] - a[0]);
		const nx = -Math.sin(ang);
		const nz = Math.cos(ang);
		const mx = (a[0] + c[0]) / 2 - cx;
		const mz = (a[1] + c[1]) / 2 - cz;
		const out: -1 | 1 = nx * mx + nz * mz > 0 ? 1 : -1;
		corridor(b, a, c, y, { ...o, wall: out });
	}
	const gm = at(cx, y, cz + D / 2, 0);
	if (g.twoStorey) {
		tower(
			b,
			gm,
			{ bays: g.bays, depth: g.depth, colH: g.colH, base: 1, front: 'open', back: 'open', sides: 'wall', steps: ['s', 'n'], gateLine: 1 },
			{ bays: g.bays, depth: g.depth, colH: g.colH * 0.72, front: 'doors', back: 'doors', sides: 'wall', roof: { chimi: true } }
		);
	} else {
		gate(b, gm, g.bays, g.depth, g.colH, { roof: { chimi: false } });
	}
	b.lampPost(cx - gw - 1.4, y, cz + D / 2 + 6);
	b.lampPost(cx + gw + 1.4, y, cz + D / 2 + 6);
	if (o.northGate) gate(b, at(cx, y, cz - D / 2, Math.PI), [3.4, 3.8, 3.4], [2.8, 2.8], 3.6, { roof: { chimi: false } });
	if (o.pave !== false) box(b, 'paving', at(cx, y, cz), 0, 0.06, 0, W - width, 0.12, D - width);
}

/** A low tiled wall (담장) along a path. */
export function fence(b: Builder, path: P2[], y: (x: number, z: number) => number, h = 2.3, t = 0.55, closed = false): void {
	const ring = closed ? [...path, path[0]] : path;
	for (let i = 0; i < ring.length - 1; i++) {
		const a = ring[i];
		const c = ring[i + 1];
		const L = Math.hypot(c[0] - a[0], c[1] - a[1]);
		if (L < 0.5) continue;
		const ang = Math.atan2(c[1] - a[1], c[0] - a[0]);
		const mx = (a[0] + c[0]) / 2;
		const mz = (a[1] + c[1]) / 2;
		const m = at(mx, y(mx, mz), mz, facing(ang));
		box(b, 'stone', m, 0, 0.3, 0, L + t, 0.6, t + 0.15);
		box(b, 'plaster', m, 0, 0.6 + (h - 0.6) / 2, 0, L + t, h - 0.6, t);
		gableRoof(b, m, { kind: 'gable', w: L + t, d: t, over: 0.35, y0: h, h: 0.42, ends: false });
	}
}

export type CourtOpts = {
	/** Side the gate opens on. */
	gate?: 's' | 'n' | 'e' | 'w';
	gateBays?: number[];
	wallH?: number;
	pave?: Mat | false;
	tile?: RoofTile;
	/** Height of the lowest ground under the court: a dressed-stone platform fills the gap. */
	plinth?: number;
};

/** A walled court (담장 + 문): tiled wall ring, a gate in one side, a yard, optional stone platform. */
export function court(b: Builder, cx: number, cz: number, W: number, D: number, y: number, o: CourtOpts = {}): void {
	const side = o.gate ?? 's';
	const bays = o.gateBays ?? [2.6, 3.4, 2.6];
	const gw = bays.reduce((a, c) => a + c, 0) / 2 + 0.6;
	const hw = W / 2;
	const hd = D / 2;
	const corners: Record<'nw' | 'ne' | 'se' | 'sw', P2> = {
		nw: [cx - hw, cz - hd],
		ne: [cx + hw, cz - hd],
		se: [cx + hw, cz + hd],
		sw: [cx - hw, cz + hd]
	};
	const sides: Record<'s' | 'n' | 'e' | 'w', [P2, P2, number]> = {
		n: [corners.nw, corners.ne, Math.PI],
		e: [corners.ne, corners.se, Math.PI / 2],
		s: [corners.se, corners.sw, 0],
		w: [corners.sw, corners.nw, -Math.PI / 2]
	};
	const flatY = () => y;
	for (const key of ['n', 'e', 's', 'w'] as const) {
		const [a, c] = sides[key];
		if (key !== side) {
			fence(b, [a, c], flatY, o.wallH ?? 2.4);
			continue;
		}
		const mx = (a[0] + c[0]) / 2;
		const mz = (a[1] + c[1]) / 2;
		const L = Math.hypot(c[0] - a[0], c[1] - a[1]);
		const ux = (c[0] - a[0]) / L;
		const uz = (c[1] - a[1]) / L;
		fence(b, [a, [mx - ux * gw, mz - uz * gw]], flatY, o.wallH ?? 2.4);
		fence(b, [[mx + ux * gw, mz + uz * gw], c], flatY, o.wallH ?? 2.4);
	}
	const [ga, gc, rot] = sides[side];
	const gx = (ga[0] + gc[0]) / 2;
	const gz = (ga[1] + gc[1]) / 2;
	gate(b, at(gx, y, gz, rot), bays, [2.4, 2.4], 3.1, {
		base: 0.5,
		roof: { chimi: false, tile: o.tile, h: 2.2 }
	});
	const ox = Math.sin(rot) * 4.2;
	const oz = Math.cos(rot) * 4.2;
	const ax = Math.cos(rot) * (gw + 0.8);
	const az = -Math.sin(rot) * (gw + 0.8);
	b.lampPost(gx + ox + ax, y, gz + oz + az);
	b.lampPost(gx + ox - ax, y, gz + oz - az);
	if (o.pave !== false) box(b, o.pave ?? 'earth', at(cx, y, cz), 0, 0.04, 0, W - 0.8, 0.08, D - 0.8);
	if (o.plinth !== undefined && o.plinth < y - 0.05) {
		const h = y - o.plinth + 0.6;
		box(b, 'courses', at(cx, o.plinth - 0.6, cz), 0, h / 2, 0, W + 2.4, h, D + 2.4);
	}
}

/* ------------------------------------------------------------------ monuments */

/** Cheomseongdae: 27 courses on a square base, south window, double well-frame on top. */
export function cheomseongdae(b: Builder, m: THREE.Matrix4): void {
	box(b, 'courses', m, 0, 0.2, 0, 5.7, 0.4, 5.7);
	box(b, 'courses', m, 0, 0.6, 0, 5.2, 0.4, 5.2);
	const profile = [
		[2.47, 0],
		[2.42, 0.9],
		[2.28, 1.9],
		[2.08, 2.9],
		[1.88, 3.9],
		[1.7, 4.9],
		[1.56, 5.9],
		[1.47, 6.8],
		[1.43, 7.6],
		[1.42, 8.0],
		[0.001, 8.0]
	].map(([r, y]) => new THREE.Vector2(r, y));
	const g = new THREE.LatheGeometry(profile, 28);
	const uv = g.getAttribute('uv') as THREE.BufferAttribute;
	for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 4.5, uv.getY(i) * 6.75);
	b.push('courses', g, m.clone().multiply(at(0, 0.8, 0)));
	box(b, 'dark', m, 0, 0.8 + 4.55, 1.86, 1.0, 1.0, 0.5);
	for (const lvl of [0, 0.32]) {
		const y = 8.8 + lvl + 0.16;
		for (const s of [1, -1]) {
			box(b, 'courses', m, 0, y, s * 1.38, 3.06, 0.32, 0.32);
			box(b, 'courses', m, s * 1.38, y, 0, 0.32, 0.32, 3.06);
		}
	}
}

/** A multi-storey wooden pagoda (Hwangnyongsa type): square storeys, a skirt roof on each, a spire. */
export function woodPagoda(b: Builder, m: THREE.Matrix4, side: number, storeys: number, storeyH: number): number {
	box(b, 'stone', m, 0, 0.9, 0, side + 4, 1.8, side + 4);
	let y = 1.8;
	let s = side;
	for (let i = 0; i < storeys; i++) {
		const sm = m.clone().multiply(at(0, y, 0));
		const bays = [s / 3, s / 3, s / 3];
		const res = hall(b, sm, {
			bays,
			depth: bays,
			colH: storeyH * 0.52,
			base: 0,
			front: i === 0 ? 'doors' : 'windows',
			back: i === 0 ? 'doors' : 'windows',
			sides: i === 0 ? 'doors' : 'windows',
			bracket: storeyH * 0.16,
			roof: false
		});
		const next = s * (i < storeys - 1 ? 0.93 : 1);
		if (i < storeys - 1) {
			roof(b, sm, { kind: 'skirt', w: s, d: s, over: Math.max(1.6, s * 0.16), y0: res.top, h: 1, inner: { w: next, d: next, y: res.top + storeyH * 0.24 } });
			y += res.top + storeyH * 0.24;
		} else {
			roof(b, sm, { kind: 'pyramid', w: s, d: s, over: Math.max(1.6, s * 0.16), y0: res.top, h: s * 0.38, finial: false });
			y += res.top + s * 0.38;
		}
		s = next;
	}
	cylinder(b, 'gold', m, 0, y + 1, 0, 0.5, 0.9, 2, 10);
	for (let k = 0; k < 9; k++) cylinder(b, 'gold', m, 0, y + 2.4 + k * 1.05, 0, 1.15 - k * 0.07, 1.15 - k * 0.07, 0.16, 16);
	cylinder(b, 'gold', m, 0, y + 7, 0, 0.12, 0.2, 10, 8);
	return y + 12;
}

/** A stone pagoda (Jeongnimsa/Gameunsa type): stylobate, body stones and thin stepped roof stones. */
export function stonePagoda(b: Builder, m: THREE.Matrix4, storeys: number, w0: number, h0: number, mat: Mat = 'courses'): number {
	box(b, mat, m, 0, 0.35, 0, w0 * 2.3, 0.7, w0 * 2.3);
	box(b, mat, m, 0, 0.95, 0, w0 * 1.95, 0.5, w0 * 1.95);
	let y = 1.2;
	let w = w0;
	for (let i = 0; i < storeys; i++) {
		const bh = i === 0 ? h0 : h0 * 0.42;
		box(b, mat, m, 0, y + bh / 2, 0, w, bh, w);
		y += bh;
		const rw = w * 1.85;
		box(b, mat, m, 0, y + 0.12, 0, w * 1.05, 0.24, w * 1.05);
		box(b, mat, m, 0, y + 0.36, 0, rw, 0.22, rw);
		const g = new THREE.CylinderGeometry(w * 0.5, rw * 0.7, 0.35, 4, 1);
		g.rotateY(Math.PI / 4);
		b.push(mat, g, m.clone().multiply(at(0, y + 0.64, 0)));
		y += 0.82;
		w *= 0.86;
	}
	cylinder(b, mat, m, 0, y + 0.6, 0, 0.12, 0.25, 1.2, 8);
	return y + 1.2;
}

/* ------------------------------------------------------------------ earthworks and walls */

/** Cross-section of an earthwork: [offset outward from the crest line, height above ground]. */
export type Profile = [number, number][];

/**
 * An earthen rampart (토성) lofted along a closed or open crest line. Each profile point is
 * [outward offset, height]; heights are relative to `ground` at that spot unless `absolute`.
 * Gaps cut gate passages; their cut faces are stone-faced.
 */
export function rampart(
	b: Builder,
	crest: P2[],
	profile: Profile,
	ground: (x: number, z: number) => number,
	opts: { closed?: boolean; gaps?: { at: P2; half: number }[]; outward?: 1 | -1; step?: number; absolute?: boolean; slope?: Mat; top?: Mat } = {}
): void {
	const closed = opts.closed ?? true;
	const pts = resample(chaikin(crest, 2, closed), opts.step ?? 5, closed);
	const fr = frames(pts, closed);
	const sign = opts.outward ?? 1;
	const gaps = opts.gaps ?? [];
	const inGap = (p: P2) => gaps.some((g) => Math.hypot(p[0] - g.at[0], p[1] - g.at[1]) < g.half);

	const runs: number[][] = [];
	let cur: number[] = [];
	for (let i = 0; i < pts.length; i++) {
		if (inGap(pts[i])) {
			if (cur.length > 1) runs.push(cur);
			cur = [];
		} else cur.push(i);
	}
	if (cur.length > 1) runs.push(cur);
	if (closed && runs.length > 1 && runs[0][0] === 0 && runs[runs.length - 1][runs[runs.length - 1].length - 1] === pts.length - 1) {
		runs[0] = [...runs.pop()!, ...runs[0]];
	} else if (closed && runs.length === 1 && runs[0].length === pts.length) {
		runs[0] = [...runs[0], 0];
	}

	const crestIdx = profile.reduce((best, p, i) => (Math.abs(p[0]) < Math.abs(profile[best][0]) ? i : best), 0);
	const point = (i: number, k: number) => {
		const [x, z] = pts[i];
		const { n } = fr[i];
		const [off, hgt] = profile[k];
		const px = x + n[0] * off * sign;
		const pz = z + n[1] * off * sign;
		const y = opts.absolute ? hgt : ground(px, pz) + hgt;
		return new THREE.Vector3(px, y, pz);
	};

	for (const run of runs) {
		const slope: THREE.Vector3[][] = profile.map((_, k) => run.map((i) => point(i, k)));
		const uv: [number, number][][] = profile.map((p, k) => run.map((_, j) => [j * 1.2, k * 3] as [number, number]));
		const inner = slope.slice(0, crestIdx + 1);
		const outer = slope.slice(crestIdx);
		b.push(opts.slope ?? 'rampart', surface(inner, uv.slice(0, crestIdx + 1), new THREE.Vector3(0, 1, 0)), undefined);
		b.push(opts.slope ?? 'rampart', surface(outer, uv.slice(crestIdx), new THREE.Vector3(0, 1, 0)), undefined);
		if (opts.top) {
			const crestRow = slope[crestIdx];
			const walk = crestRow.map((p) => [p.x, p.z] as P2);
			b.push(opts.top, ribbon(walk, 3, (_x, _z, i) => crestRow[i].y + 0.06), undefined);
		}
		if (gaps.length && run.length) {
			for (const end of [run[0], run[run.length - 1]]) {
				const ring = profile.map((_, k) => point(end, k));
				const base = ring.map((p) => new THREE.Vector3(p.x, Math.min(...ring.map((q) => q.y)) - 0.5, p.z));
				b.push('wallStone', surface([base, ring], [ring.map((_, k) => [k * 2, 0] as [number, number]), ring.map((p, k) => [k * 2, p.y] as [number, number])], new THREE.Vector3(0, 0, 0)), undefined);
			}
		}
	}
}

/**
 * A dressed-stone fortress wall (석성) that follows the ground along a path, with a walkway and
 * crenellated parapet (여장) on the outer edge.
 */
export function stoneWall(
	b: Builder,
	path: P2[],
	ground: (x: number, z: number) => number,
	opts: { h?: number; t?: number; closed?: boolean; outward?: 1 | -1; gaps?: { at: P2; half: number }[]; step?: number; mat?: Mat; parapet?: boolean } = {}
): void {
	const closed = opts.closed ?? false;
	const mat = opts.mat ?? 'wallStone';
	const h = opts.h ?? 7;
	const t = opts.t ?? 5;
	const step = opts.step ?? 4;
	const pts = resample(chaikin(path, 1, closed), step, closed);
	const fr = frames(pts, closed);
	const sign = opts.outward ?? 1;
	const gaps = opts.gaps ?? [];
	const skip = (p: P2) => gaps.some((g) => Math.hypot(p[0] - g.at[0], p[1] - g.at[1]) < g.half);
	const runs: number[][] = [];
	let cur: number[] = [];
	for (let i = 0; i < pts.length; i++) {
		if (skip(pts[i])) {
			if (cur.length > 1) runs.push(cur);
			cur = [];
		} else cur.push(i);
	}
	if (cur.length > 1) runs.push(cur);
	if (closed && runs.length === 1 && runs[0].length === pts.length) runs[0].push(0);

	for (const run of runs) {
		const rowsOut: THREE.Vector3[] = [];
		const rowsOutTop: THREE.Vector3[] = [];
		const rowsIn: THREE.Vector3[] = [];
		const rowsInTop: THREE.Vector3[] = [];
		const uvA: [number, number][] = [];
		const uvB: [number, number][] = [];
		let s = 0;
		run.forEach((i, j) => {
			const [x, z] = pts[i];
			if (j) {
				const [px, pz] = pts[run[j - 1]];
				s += Math.hypot(x - px, z - pz);
			}
			const n = fr[i].n;
			const ox = x + n[0] * sign * (t / 2);
			const oz = z + n[1] * sign * (t / 2);
			const ix = x - n[0] * sign * (t / 2);
			const iz = z - n[1] * sign * (t / 2);
			const gy = Math.min(ground(ox, oz), ground(ix, iz), ground(x, z));
			const top = ground(x, z) + h;
			const bx = n[0] * sign * 0.6;
			const bz = n[1] * sign * 0.6;
			rowsOut.push(new THREE.Vector3(ox + bx, gy - 2, oz + bz));
			rowsOutTop.push(new THREE.Vector3(ox, top, oz));
			rowsIn.push(new THREE.Vector3(ix, gy - 2, iz));
			rowsInTop.push(new THREE.Vector3(ix, top - 0.6, iz));
			uvA.push([s, 0]);
			uvB.push([s, h + 2]);
		});
		b.push(mat, surface([rowsOut, rowsOutTop], [uvA, uvB], new THREE.Vector3(0, 0, 0)), undefined);
		b.push(mat, surface([rowsIn, rowsInTop], [uvA, uvB], new THREE.Vector3(0, 0, 0)), undefined);
		b.push(
			'earth',
			surface(
				[rowsInTop, rowsOutTop],
				[uvA.map(([u]) => [u, 0] as [number, number]), uvA.map(([u]) => [u, t] as [number, number])],
				new THREE.Vector3(0, 1, 0)
			),
			undefined
		);
		// parapet: a low wall with merlons on the outer edge
		if (opts.parapet === false) continue;
		for (let j = 0; j < run.length - 1; j++) {
			const a = rowsOutTop[j];
			const c = rowsOutTop[j + 1];
			const n = fr[run[j]].n;
			const mx = (a.x + c.x) / 2 - n[0] * sign * 0.35;
			const mz = (a.z + c.z) / 2 - n[1] * sign * 0.35;
			const L = Math.hypot(c.x - a.x, c.z - a.z);
			const ang = Math.atan2(c.z - a.z, c.x - a.x);
			const my = (a.y + c.y) / 2;
			const pm = at(mx, my, mz, facing(ang));
			box(b, mat, pm, 0, 0.5, 0, L + 0.05, 1.0, 0.7);
			box(b, mat, pm, -L * 0.22, 1.35, 0, L * 0.42, 0.7, 0.7);
		}
	}
}

/* ------------------------------------------------------------------ trees */

export type TreeKind = 'pine' | 'broad' | 'willow' | 'zelkova' | 'citrus' | 'cherry' | 'maple';

const TREE_COLORS: Record<TreeKind, string[]> = {
	pine: ['#3f6a3d', '#4a7646', '#355f37', '#527d4b'],
	broad: ['#6c9a46', '#7aa752', '#5f8d3f', '#86ae5c', '#6f9a4a'],
	willow: ['#93b562', '#a2be6c', '#86ab58'],
	zelkova: ['#5f8b42', '#6b9649', '#557f3c'],
	citrus: ['#2f5e2c', '#386b32', '#2a5428'],
	cherry: ['#f2b8c6', '#eaa5b8', '#f6cbd5', '#e398ab'],
	maple: ['#d8343a', '#e4502f', '#c8282f', '#ee6a3a', '#b92a2a']
};

function crownGeometry(kind: TreeKind): THREE.BufferGeometry {
	const rand = rng(kind.length * 97);
	const lumps: [number, number, number, number][] =
		kind === 'pine'
			? [
					[0, 0.82, 0, 0.42],
					[0.28, 0.74, 0.1, 0.3],
					[-0.26, 0.78, -0.12, 0.3],
					[0.05, 0.92, -0.2, 0.26]
				]
			: kind === 'willow'
				? [
						[0, 0.55, 0, 0.5],
						[0.22, 0.4, 0.12, 0.36],
						[-0.24, 0.42, -0.1, 0.36]
					]
				: kind === 'zelkova'
					? [
							[0, 0.66, 0, 0.5],
							[0.32, 0.58, 0.1, 0.34],
							[-0.3, 0.6, -0.14, 0.34],
							[0.06, 0.82, 0.18, 0.3]
						]
					: [
							[0, 0.62, 0, 0.46],
							[0.24, 0.56, 0.16, 0.3],
							[-0.22, 0.58, -0.14, 0.3]
						];
	const squash = kind === 'pine' ? 0.55 : kind === 'willow' ? 1.25 : 0.86;
	const top = lumps.reduce((a, l) => Math.max(a, l[1]), 0);
	const centre = new THREE.Vector3(0, top - 0.12, 0);
	const v = new THREE.Vector3();
	const n = new THREE.Vector3();
	const parts = lumps.map(([x, y, z, r], i) => {
		const g = new THREE.IcosahedronGeometry(r, i === 0 ? 1 : 0);
		const pos = g.getAttribute('position');
		for (let i = 0; i < pos.count; i++) {
			const k = 1 + (rand() - 0.5) * 0.22;
			pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * k * squash, pos.getZ(i) * k);
		}
		g.translate(x, y, z);
		const flat = g.index ? g.toNonIndexed() : g;
		// foliage normals: half from the lump, half from the whole crown, so leaves shade as one soft mass
		const fp = flat.getAttribute('position');
		const nrm = new Float32Array(fp.count * 3);
		for (let j = 0; j < fp.count; j++) {
			v.fromBufferAttribute(fp, j);
			n.set(v.x - x, (v.y - y) / squash, v.z - z).normalize().multiplyScalar(0.5);
			n.add(v.clone().sub(centre).normalize().multiplyScalar(0.5)).normalize();
			nrm.set([n.x, n.y, n.z], j * 3);
		}
		flat.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
		return flat;
	});
	const merged = mergeGeometries(parts, false)!;
	for (const p of parts) p.dispose();
	return merged;
}

/** Instanced trees. Heights in metres; crowns scale with height. */
export class Forest {
	private items: Record<TreeKind, { x: number; y: number; z: number; h: number; rot: number; c: number }[]> = {
		pine: [],
		broad: [],
		willow: [],
		zelkova: [],
		citrus: [],
		cherry: [],
		maple: []
	};
	private rand = rng(41);

	add(kind: TreeKind, x: number, y: number, z: number, h: number): void {
		this.items[kind].push({ x, y, z, h, rot: this.rand() * Math.PI * 2, c: Math.floor(this.rand() * 10) });
	}

	get count(): number {
		return Object.values(this.items).reduce((a, l) => a + l.length, 0);
	}

	build(p: Palette): THREE.Group {
		const group = new THREE.Group();
		const m = new THREE.Matrix4();
		const color = new THREE.Color();
		const trunk = new THREE.CylinderGeometry(0.035, 0.06, 1, 6);
		trunk.translate(0, 0.5, 0);
		for (const kind of Object.keys(this.items) as TreeKind[]) {
			const list = this.items[kind];
			if (!list.length) continue;
			const crown = new THREE.InstancedMesh(crownGeometry(kind), p.foliage, list.length);
			const stem = new THREE.InstancedMesh(trunk.clone(), p.bark, list.length);
			const trunkShare = kind === 'pine' ? 0.72 : kind === 'willow' ? 0.4 : 0.48;
			list.forEach((t, i) => {
				const w = kind === 'pine' ? t.h * 0.85 : kind === 'zelkova' ? t.h * 1.15 : t.h * 0.9;
				m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion().setFromAxisAngle(Y, t.rot), new THREE.Vector3(w, t.h, w));
				crown.setMatrixAt(i, m);
				const palette = TREE_COLORS[kind];
				color.set(palette[t.c % palette.length]);
				crown.setColorAt(i, color);
				m.compose(new THREE.Vector3(t.x, t.y - 0.3, t.z), new THREE.Quaternion().setFromAxisAngle(Y, t.rot), new THREE.Vector3(t.h * 0.9, t.h * trunkShare + 0.3, t.h * 0.9));
				stem.setMatrixAt(i, m);
			});
			crown.castShadow = true;
			crown.receiveShadow = true;
			stem.castShadow = true;
			crown.instanceMatrix.needsUpdate = true;
			if (crown.instanceColor) crown.instanceColor.needsUpdate = true;
			crown.computeBoundingSphere();
			stem.computeBoundingSphere();
			group.add(crown, stem);
		}
		trunk.dispose();
		return group;
	}
}

/* ------------------------------------------------------------------ town houses */

function houseGeometry(roofColor: string, wallColor: string): THREE.BufferGeometry {
	const parts: THREE.BufferGeometry[] = [];
	const paint = (g: THREE.BufferGeometry, hex: string) => {
		const c = new THREE.Color(hex);
		const n = g.getAttribute('position').count;
		const arr = new Float32Array(n * 3);
		for (let i = 0; i < n; i++) {
			arr[i * 3] = c.r;
			arr[i * 3 + 1] = c.g;
			arr[i * 3 + 2] = c.b;
		}
		g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
		return g.index ? g.toNonIndexed() : g;
	};
	const base = new THREE.BoxGeometry(1.08, 0.12, 1.12);
	base.translate(0, 0.06, 0);
	parts.push(paint(base, '#b9b2a3'));
	const body = new THREE.BoxGeometry(1, 0.5, 1);
	body.translate(0, 0.37, 0);
	parts.push(paint(body, wallColor));
	const frame = new THREE.BoxGeometry(1.02, 0.08, 1.02);
	frame.translate(0, 0.6, 0);
	parts.push(paint(frame, '#7c3a2a'));
	for (const sz of [1, -1]) {
		const slope = new THREE.BoxGeometry(1.3, 0.07, 0.78);
		slope.rotateX(sz * 0.5);
		slope.translate(0, 0.83, sz * 0.31);
		parts.push(paint(slope, roofColor));
	}
	const ridge = new THREE.BoxGeometry(1.32, 0.08, 0.1);
	ridge.translate(0, 1.0, 0);
	parts.push(paint(ridge, '#2f353c'));
	const g = mergeGeometries(parts, false)!;
	for (const p of parts) p.dispose();
	g.computeVertexNormals();
	return g;
}

/** Instanced town houses: tile-roofed (grey) and thatched. Size is [width, height, depth] in metres. */
export class Town {
	private tile: THREE.Matrix4[] = [];
	private thatch: THREE.Matrix4[] = [];

	add(x: number, y: number, z: number, rot: number, w: number, d: number, h: number, thatched = false): void {
		const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromAxisAngle(Y, rot), new THREE.Vector3(w, h, d));
		(thatched ? this.thatch : this.tile).push(m);
	}

	get count(): number {
		return this.tile.length + this.thatch.length;
	}

	build(p: Palette): THREE.Group {
		const group = new THREE.Group();
		const sets: [THREE.Matrix4[], string, string][] = [
			[this.tile, '#5b6570', '#ebe5d8'],
			[this.thatch, '#b49763', '#d8cbb0']
		];
		for (const [list, roofC, wallC] of sets) {
			if (!list.length) continue;
			const mesh = new THREE.InstancedMesh(houseGeometry(roofC, wallC), p.houses, list.length);
			list.forEach((m, i) => mesh.setMatrixAt(i, m));
			mesh.instanceMatrix.needsUpdate = true;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.computeBoundingSphere();
			group.add(mesh);
		}
		return group;
	}
}

/* ------------------------------------------------------------------ clouds */

/** Instanced square field tents (a besieging camp). */
export function tents(p: Palette, list: { x: number; y: number; z: number; r: number; h: number; rot: number }[]): THREE.InstancedMesh {
	const g = new THREE.ConeGeometry(1, 1, 4, 1);
	g.translate(0, 0.5, 0);
	const mesh = new THREE.InstancedMesh(g, p.mats.plaster, list.length);
	const m = new THREE.Matrix4();
	list.forEach((t, i) => {
		m.compose(new THREE.Vector3(t.x, t.y, t.z), new THREE.Quaternion().setFromAxisAngle(Y, t.rot + Math.PI / 4), new THREE.Vector3(t.r, t.h, t.r));
		mesh.setMatrixAt(i, m);
	});
	mesh.instanceMatrix.needsUpdate = true;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.computeBoundingSphere();
	return mesh;
}

/** Instanced cloud puffs (the Ansi and Pyongyang boards sit in a sea of cloud). */
export function cloudBank(p: Palette, puffs: { x: number; y: number; z: number; r: number }[]): THREE.InstancedMesh {
	const g = new THREE.IcosahedronGeometry(1, 2);
	const mesh = new THREE.InstancedMesh(g, p.mats.cloud, puffs.length);
	const m = new THREE.Matrix4();
	puffs.forEach((c, i) => {
		m.compose(new THREE.Vector3(c.x, c.y, c.z), new THREE.Quaternion(), new THREE.Vector3(c.r, c.r * 0.62, c.r));
		mesh.setMatrixAt(i, m);
	});
	mesh.instanceMatrix.needsUpdate = true;
	mesh.computeBoundingSphere();
	return mesh;
}
