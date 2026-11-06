/**
 * Korean timber-architecture kit for /stage. Everything is generated geometry,
 * merged per material so a whole palace is a few dozen draw calls.
 *
 * Conventions: metres; +y up; plan +x east, +z south; buildings face +z (south).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { chaikin, frames, resample, rng, type P2 } from './geo';
import {
	patchGround,
	patchSway,
	patchWater,
	patchSnow,
	patchBillboard,
	patchRise,
	patchGrow,
	patchFlag,
	cloudSheetMaterial,
	tuftTexture,
	mistTexture,
	cloudTexture,
	type CoverMaterials,
	type RiseUniforms,
	type TimeUniform
} from './nature';

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
			const shade = Math.floor(rand() * 18) - 9;
			const sh = 128 / rows;
			// each stone a soft top-lit gradient, like a painted game block
			const grad = g.createLinearGradient(0, y, 0, y + sh);
			grad.addColorStop(0, `rgba(255,255,255,${0.16 + Math.max(0, shade) / 90})`);
			grad.addColorStop(0.55, 'rgba(255,255,255,0)');
			grad.addColorStop(1, `rgba(0,0,0,${0.12 + Math.max(0, -shade) / 90})`);
			g.fillStyle = grad;
			g.fillRect(x + 1.5, y + 1.5, w - 3, sh - 3);
			g.globalAlpha = 0.55;
			g.fillStyle = joint;
			g.fillRect(x, y, 2.5, sh);
			g.globalAlpha = 1;
			x += w;
		}
		g.globalAlpha = 0.55;
		g.fillStyle = joint;
		g.fillRect(0, y, 128, 2.5);
		g.globalAlpha = 1;
	}
	return texture(c);
}

/** Fine raked sand / gravel for palace yards (마사토): pale, nearly flat, a few soft specks. */
function gravelTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(128, 128);
	const rand = rng(29);
	g.fillStyle = '#e4dccb';
	g.fillRect(0, 0, 128, 128);
	for (let i = 0; i < 900; i++) {
		const v = rand() > 0.5 ? 255 : 150;
		g.fillStyle = `rgba(${v},${v - 6},${v - 18},${0.06 + rand() * 0.08})`;
		g.fillRect(rand() * 128, rand() * 128, 1 + rand() * 1.5, 1 + rand() * 1.5);
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

/** Neutral grain multiplied over vertex-coloured ground: faint, so the ground reads as painted gradients. */
function grainTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(256, 256);
	const img = g.createImageData(256, 256);
	const rand = rng(11);
	for (let i = 0; i < img.data.length; i += 4) {
		const v = 238 + Math.floor(rand() * 17);
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
	| 'gravel'
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
	| 'vermilion'
	| 'purple'
	| 'white'
	| 'burgundy';

/** Banner cloth that can wave: the kingdom silks. */
export type Cloth = 'wallRed' | 'blue' | 'yellow' | 'orange' | 'vermilion' | 'purple' | 'white' | 'burgundy';

export type Palette = {
	mats: Record<Mat, THREE.Material>;
	ground: THREE.MeshStandardMaterial;
	foliage: THREE.MeshStandardMaterial;
	bark: THREE.MeshStandardMaterial;
	houses: THREE.MeshStandardMaterial;
	ripple: THREE.Texture;
	/** Clock shared by the swaying and rippling materials. */
	time: TimeUniform;
	/** 0 stills every swaying plant, 1 lets the wind back in. */
	wind: TimeUniform;
	/** Clock for the water ripples alone, so they can be stopped without freezing the wind. */
	waterTime: TimeUniform;
	/** 0 hides the painted forest canopy on the ground with the trees. */
	canopy: TimeUniform;
	/** 0..1 wind chop on the water. */
	flow: TimeUniform;
	/** The build animation: 0 flat plain, 1 the site standing. */
	rise: RiseUniforms;
	/** Trees and cover: 0 under the ground, 1 grown. */
	grow: TimeUniform;
	/** A waving copy of a banner silk. */
	flag(cloth: Mat): THREE.Material;
	/** Soft clouds: camera-facing puffs and the noise sheets of a cloud sea, tinted per light preset. */
	puff: THREE.MeshBasicMaterial;
	cloudSheet: THREE.MeshBasicMaterial;
	cover: CoverMaterials;
	lantern: THREE.MeshStandardMaterial;
	mist: THREE.Texture;
	/** Lamplight behind the door lattice, 0 (day) to 1 (night). */
	lit(k: number): void;
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
	const grey = keep(tileTexture('#9aa6b2', '#6f7c89', '#46505b'));
	const red = keep(tileTexture('#b07a64', '#87543f', '#55332a'));
	const bracket = keep(bracketTexture(), [0.5, 1]);
	const door = keep(doorTexture());
	const stone = keep(courseTexture('#d8d0c0', '#a39a88', 3), [0.5, 0.5]);
	const wallStone = keep(courseTexture('#b9b5aa', '#857f73', 5), [0.25, 0.4]);
	const courses = keep(courseTexture('#d2c6ae', '#988b72', 9), [1, 1]);
	const paving = keep(pavingTexture(), [0.12, 0.12]);
	const gravel = keep(gravelTexture(), [0.25, 0.25]);
	const soffit = keep(soffitTexture(), [1.6, 1]);
	const grain = keep(grainTexture(), [0.08, 0.08]);
	const ripple = keep(rippleTexture(), [0.06, 0.06]);
	const brick = keep(courseTexture('#6a645d', '#4a4640', 13), [1.2, 1.2]);

	// vertex colours carry the Builder's contact shadows (darker at wall feet and under eaves)
	const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, vertexColors: true, ...p });

	const mats: Record<Mat, THREE.Material> = {
		tile: std({ map: grey, roughness: 0.66 }),
		tileRed: std({ map: red, roughness: 0.66 }),
		thatch: std({ color: '#c4a46a', map: grain, roughness: 1 }),
		bark: std({ color: '#7e5640', map: grain, roughness: 0.95 }),
		ridge: std({ color: '#39414a', roughness: 0.62 }),
		timber: std({ color: '#b5402e', roughness: 0.6 }),
		green: std({ color: '#35806c', roughness: 0.66 }),
		bracket: std({ map: bracket, roughness: 0.72 }),
		plaster: std({ color: '#f4eee1', roughness: 0.9 }),
		wallRed: std({ color: '#a8382b', roughness: 0.78 }),
		door: std({
			map: door,
			roughness: 0.8,
			emissive: new THREE.Color('#ffb257'),
			emissiveIntensity: opts.lit ? 0.55 : 0,
			emissiveMap: door
		}),
		stone: std({ map: stone, roughness: 0.88 }),
		wallStone: std({ map: wallStone, roughness: 0.92 }),
		courses: std({ map: courses, roughness: 0.9 }),
		paving: std({ map: paving, roughness: 0.92 }),
		gravel: std({ map: gravel, roughness: 1 }),
		path: std({ color: '#d8c49a', map: grain, roughness: 1 }),
		lawn: std({ color: '#8fb85a', map: grain, roughness: 1 }),
		rampart: std({ color: '#86a855', map: grain, roughness: 1 }),
		earth: std({ color: '#c0a47c', map: grain, roughness: 1 }),
		wood: std({ color: '#7a432c', roughness: 0.72 }),
		soffit: std({ map: soffit, roughness: 0.8 }),
		water: new THREE.MeshStandardMaterial({
			color: '#3f9497',
			roughness: 0.12,
			metalness: 0.02,
			normalMap: ripple,
			normalScale: new THREE.Vector2(0.25, 0.25),
			envMapIntensity: 1.25
		}),
		brick: std({ map: brick, roughness: 0.9 }),
		rock: std({ color: '#948f84', roughness: 1, flatShading: true }),
		gold: std({ color: '#d1a443', roughness: 0.35, metalness: 0.75 }),
		dark: std({ color: '#231f1b', roughness: 1 }),
		cloud: std({ color: '#f6f4ef', roughness: 1 }),
		blue: std({ color: '#2d5fa8', roughness: 0.8, side: THREE.DoubleSide }),
		yellow: std({ color: '#d9b13a', roughness: 0.8, side: THREE.DoubleSide }),
		orange: std({ color: '#e07a2a', roughness: 0.8, side: THREE.DoubleSide }),
		vermilion: std({ color: '#d8452b', roughness: 0.8, side: THREE.DoubleSide }),
		purple: std({ color: '#7b4bd6', roughness: 0.8, side: THREE.DoubleSide }),
		white: std({ color: '#f1ede3', roughness: 0.85, side: THREE.DoubleSide }),
		burgundy: std({ color: '#7a2430', roughness: 0.8, side: THREE.DoubleSide })
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
	const foliage = new THREE.MeshStandardMaterial({ roughness: 0.88 });
	const bark = new THREE.MeshStandardMaterial({ color: '#6f4d36', roughness: 1 });
	const houses = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
	const time: TimeUniform = { value: 0 };
	const wind: TimeUniform = { value: 1 };
	const waterTime: TimeUniform = { value: 0 };
	const canopy: TimeUniform = { value: 1 };
	const flow: TimeUniform = { value: 1 };
	const grow: TimeUniform = { value: 1 };
	const rise: RiseUniforms = { uRise: { value: 1 }, uRiseC: { value: new THREE.Vector2() }, uRiseR: { value: 800 } };
	patchGround(ground, canopy);
	patchSway(foliage, time, wind, 'tree', 0.03);
	patchWater(mats.water as THREE.MeshStandardMaterial, waterTime, flow);

	const grassTex = keep(tuftTexture(false));
	const flowerTex = keep(tuftTexture(true));
	const mist = keep(mistTexture());
	const puffTex = keep(cloudTexture(31));
	const card = (map: THREE.Texture) =>
		new THREE.MeshStandardMaterial({ map, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 1 });
	const cover: CoverMaterials = {
		grass: card(grassTex),
		flowers: card(flowerTex),
		shrub: new THREE.MeshStandardMaterial({ roughness: 0.92 }),
		reed: new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide }),
		rock: new THREE.MeshStandardMaterial({ color: '#a29d92', roughness: 1, flatShading: true }),
		fruit: new THREE.MeshStandardMaterial({ roughness: 0.45 })
	};
	patchSway(cover.grass, time, wind, 'grass', 0.09, false);
	patchSway(cover.flowers, time, wind, 'flowers', 0.09, false);
	patchSway(cover.shrub, time, wind, 'shrub', 0.02);
	patchSway(cover.reed, time, wind, 'reed', 0.12, false);
	if (opts.snow) {
		for (const m of [mats.tile, mats.tileRed, mats.rock, mats.earth, mats.wallStone, foliage, cover.shrub, cover.rock]) patchSnow(m, opts.snow);
	}
	const lantern = new THREE.MeshStandardMaterial({ color: '#efe2c4', roughness: 0.7, emissive: new THREE.Color('#ffae55'), emissiveIntensity: 0 });
	const puff = new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, fog: true });
	patchBillboard(puff);
	const cloudSheet = cloudSheetMaterial(time);

	// trunks come up first, then crowns and tufts spread out of them
	patchGrow(bark, grow, 0, 0.6);
	patchGrow(foliage, grow, 0.22, 1);
	for (const m of [cover.grass, cover.flowers, cover.shrub, cover.reed, cover.fruit]) patchGrow(m, grow, 0.1, 1);
	for (const m of [...Object.values(mats), ground, foliage, bark, houses, lantern, ...Object.values(cover)]) patchRise(m, rise);

	const flags = new Map<Mat, THREE.Material>();
	const flag = (cloth: Mat) => {
		let m = flags.get(cloth);
		if (!m) {
			m = mats[cloth].clone();
			(m as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
			m.onBeforeCompile = () => {};
			m.customProgramCacheKey = () => `stage-cloth-${cloth}`;
			patchFlag(m, time, wind);
			patchRise(m, rise);
			flags.set(cloth, m);
		}
		return m;
	};

	return {
		mats,
		ground,
		foliage,
		bark,
		houses,
		ripple,
		time,
		wind,
		waterTime,
		canopy,
		flow,
		rise,
		grow,
		flag,
		puff,
		cloudSheet,
		cover,
		lantern,
		mist,
		lit(k) {
			(mats.door as THREE.MeshStandardMaterial).emissiveIntensity = 0.75 * k;
		},
		setEnv(tex) {
			const w = mats.water as THREE.MeshStandardMaterial;
			w.envMap = tex;
			w.envMapIntensity = 0.32;
			w.needsUpdate = true;
		},
		dispose() {
			for (const m of Object.values(mats)) m.dispose();
			for (const m of flags.values()) m.dispose();
			for (const m of Object.values(cover)) m.dispose();
			lantern.dispose();
			puff.dispose();
			cloudSheet.dispose();
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
	private parts = new Map<string, { mat: Mat; list: THREE.BufferGeometry[]; flag?: boolean }>();
	/** Lantern points collected while building (gates, bridges). */
	readonly lamps: [number, number, number][] = [];
	/**
	 * Terrain height (a fast sampler). When set, every vertical face darkens toward the ground it
	 * stands on, so walls, columns and platforms read as grounded instead of pasted on.
	 */
	ground: ((x: number, z: number) => number) | null = null;

	/** A stone lantern post with a paper lantern on top. */
	lampPost(x: number, y: number, z: number): void {
		box(this, 'stone', at(x, y, z), 0, 0.9, 0, 0.32, 1.8, 0.32);
		this.lamps.push([x, y + 2.15, z]);
	}

	/** Banner cloth: a pole-pinned sheet (uv.x 0 at the pole, uv.y 1 at the crossbar) that waves in the wind. */
	pushFlag(cloth: Mat, geo: THREE.BufferGeometry, m?: THREE.Matrix4): void {
		this.push(cloth, geo, m, true);
	}

	/** Geometry painted one flat colour instead of the contact shadow (needs a material with vertex colours). */
	pushColored(mat: Mat, geo: THREE.BufferGeometry, color: string): void {
		this.push(mat, geo, undefined, false, new THREE.Color(color));
	}

	push(mat: Mat, geo: THREE.BufferGeometry, m?: THREE.Matrix4, flag = false, color?: THREE.Color): void {
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
		if (color) {
			const n = g.getAttribute('position').count;
			const c = new Float32Array(n * 3);
			for (let i = 0; i < n; i++) c.set([color.r, color.g, color.b], i * 3);
			g.setAttribute('color', new THREE.BufferAttribute(c, 3));
		} else g.setAttribute('color', this.occlusion(g, SOLID_EXCLUDE.has(mat)));
		g.morphAttributes = {};
		g.computeBoundingBox();
		const bb = g.boundingBox!;
		const big = bb.max.x - bb.min.x > TILE || bb.max.z - bb.min.z > TILE;
		const tag = flag ? `flag:${mat}` : mat;
		const key = big ? `${tag}|all` : `${tag}|${Math.floor((bb.min.x + bb.max.x) / 2 / TILE)}|${Math.floor((bb.min.z + bb.max.z) / 2 / TILE)}`;
		const bucket = this.parts.get(key);
		if (bucket) bucket.list.push(g);
		else this.parts.set(key, { mat, list: [g], flag });
		if (g !== geo) geo.dispose();
	}

	/** Baked contact shadow: vertical faces darken over their lowest metres, undersides stay dim. */
	private occlusion(g: THREE.BufferGeometry, plain: boolean): THREE.BufferAttribute {
		const pos = g.getAttribute('position');
		const nrm = g.getAttribute('normal');
		const col = new Float32Array(pos.count * 3);
		for (let i = 0; i < pos.count; i++) {
			let k = 1;
			if (!plain) {
				const ny = nrm.getY(i);
				if (ny < -0.45) k = 0.7;
				else if (ny < 0.5 && this.ground) {
					const t = Math.min(1, Math.max(0, (pos.getY(i) - this.ground(pos.getX(i), pos.getZ(i)) + 0.3) / 2.4));
					k = 0.58 + 0.42 * t * t * (3 - 2 * t);
				}
			}
			col[i * 3] = k;
			col[i * 3 + 1] = k;
			col[i * 3 + 2] = k * (k < 1 ? 1.04 : 1);
		}
		return new THREE.BufferAttribute(col, 3);
	}

	build(p: Palette): THREE.Group {
		const group = new THREE.Group();
		for (const { mat, list, flag } of this.parts.values()) {
			const merged = mergeGeometries(list, false);
			for (const g of list) g.dispose();
			if (!merged) continue;
			merged.computeBoundingSphere();
			const mesh = new THREE.Mesh(merged, flag ? p.flag(mat) : p.mats[mat]);
			mesh.name = flag ? 'flag' : mat;
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

/**
 * A box with chamfered edges and corners (44 triangles): the chunky, hand-made block that walls,
 * platforms, gate blocks and merlons are built from. UVs are box-projected in metres.
 */
export function bevelGeometry(w: number, h: number, d: number, bevel: number): THREE.BufferGeometry {
	const hw = w / 2;
	const hh = h / 2;
	const hd = d / 2;
	const r = Math.max(0.005, Math.min(bevel, hw * 0.45, hh * 0.45, hd * 0.45));
	const P = (sx: number, sy: number, sz: number, axis: 0 | 1 | 2) =>
		new THREE.Vector3(sx * (axis === 0 ? hw : hw - r), sy * (axis === 1 ? hh : hh - r), sz * (axis === 2 ? hd : hd - r));
	const pos: number[] = [];
	const uv: number[] = [];
	const e1 = new THREE.Vector3();
	const e2 = new THREE.Vector3();
	const n = new THREE.Vector3();
	const c = new THREE.Vector3();
	const tri = (a: THREE.Vector3, b0: THREE.Vector3, c0: THREE.Vector3) => {
		let bb = b0;
		let cc = c0;
		n.crossVectors(e1.subVectors(bb, a), e2.subVectors(cc, a));
		if (n.dot(c.copy(a).add(bb).add(cc)) < 0) {
			[bb, cc] = [cc, bb];
			n.negate();
		}
		const ax = Math.abs(n.x);
		const ay = Math.abs(n.y);
		const az = Math.abs(n.z);
		for (const p of [a, bb, cc]) {
			pos.push(p.x, p.y, p.z);
			if (ax >= ay && ax >= az) uv.push(p.z, p.y);
			else if (ay >= az) uv.push(p.x, p.z);
			else uv.push(p.x, p.y);
		}
	};
	const quad = (a: THREE.Vector3, b0: THREE.Vector3, c0: THREE.Vector3, d0: THREE.Vector3) => {
		tri(a, b0, c0);
		tri(a, c0, d0);
	};
	for (const s of [1, -1]) {
		quad(P(s, -1, -1, 0), P(s, 1, -1, 0), P(s, 1, 1, 0), P(s, -1, 1, 0));
		quad(P(-1, s, -1, 1), P(1, s, -1, 1), P(1, s, 1, 1), P(-1, s, 1, 1));
		quad(P(-1, -1, s, 2), P(1, -1, s, 2), P(1, 1, s, 2), P(-1, 1, s, 2));
		for (const t of [1, -1]) {
			quad(P(s, t, -1, 0), P(s, t, 1, 0), P(s, t, 1, 1), P(s, t, -1, 1));
			quad(P(s, -1, t, 0), P(s, 1, t, 0), P(s, 1, t, 2), P(s, -1, t, 2));
			quad(P(-1, s, t, 1), P(1, s, t, 1), P(1, s, t, 2), P(-1, s, t, 2));
			for (const u of [1, -1]) tri(P(s, t, u, 0), P(s, t, u, 1), P(s, t, u, 2));
		}
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
	g.computeVertexNormals();
	return g;
}

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
	opts: { metric?: boolean; rot?: number; bevel?: number } = {}
): void {
	if (opts.bevel) {
		b.push(mat, bevelGeometry(w, h, d, opts.bevel), m.clone().multiply(at(x, y, z, opts.rot ?? 0)));
		return;
	}
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

	const fasciaH = 0.3 + r.over * 0.08;
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

	const rs = Math.min(1, Math.max(0.3, r.h * 0.09));
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
	const fasciaH = 0.26 + r.over * 0.08;
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
	const rs = Math.min(0.7, Math.max(0.24, r.h * 0.09));
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
	const r = s.r ?? Math.min(0.5, Math.max(0.19, minBay * 0.088));
	const base = s.base ?? 1;
	const pad = s.pad ?? Math.max(1.1, r * 4);
	const tiers = s.tiers ?? 1;
	const posts = s.posts ?? 0;

	if (base > 0) {
		// chunky dressed-stone stylobate, sunk a little so it never floats on uneven ground
		const sink = 0.6;
		if (tiers === 2) {
			box(b, 'stone', m, 0, (base * 0.45 - sink) / 2, 0, W + 2 * pad + 1.6, base * 0.45 + sink, D + 2 * pad + 1.6, { bevel: 0.16 });
			box(b, 'stone', m, 0, base * 0.45 + (base * 0.55) / 2, 0, W + 2 * pad, base * 0.55, D + 2 * pad, { bevel: 0.14 });
		} else {
			box(b, 'stone', m, 0, (base - sink) / 2, 0, W + 2 * pad, base + sink, D + 2 * pad, { bevel: 0.16 });
		}
		box(b, 'stone', m, 0, base - 0.04, 0, W + 2 * pad + 0.24, 0.14, D + 2 * pad + 0.24, { bevel: 0.05 });
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
		const over = spec.over ?? Math.min(4.6, Math.max(1.3, D * 0.2 + 0.7));
		const h = spec.h ?? D * 0.4 + 1.3;
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
	box(b, 'stone', m, 0, (base - 0.5) / 2, 0, L + 0.6, base + 0.5, width + 1.1, { bevel: 0.12 });
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
	if (o.pave !== false) box(b, 'paving', at(cx, y, cz), 0, -0.2, 0, W - width, 0.6, D - width);
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
		box(b, 'stone', m, 0, 0.1, 0, L + t, 1, t + 0.2, { bevel: 0.1 });
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
	if (o.pave !== false) box(b, o.pave ?? 'gravel', at(cx, y, cz), 0, -0.2, 0, W - 0.8, 0.6, D - 0.8);
	if (o.plinth !== undefined && o.plinth < y - 0.05) {
		const h = y - o.plinth + 0.6;
		box(b, 'courses', at(cx, o.plinth - 0.6, cz), 0, h / 2, 0, W + 2.4, h, D + 2.4, { bevel: 0.25 });
	}
}

/* ------------------------------------------------------------------ palace yards and gardens */

/** A granite stone lantern (석등): square base, octagonal shaft, fire box and cap. Lit with the lanterns at dusk. */
export function stoneLantern(b: Builder, x: number, y: number, z: number, s = 1): void {
	const m = at(x, y, z, 0, s);
	box(b, 'stone', m, 0, 0.15, 0, 1.1, 0.4, 1.1, { bevel: 0.08 });
	cylinder(b, 'stone', m, 0, 0.8, 0, 0.17, 0.2, 1, 8);
	box(b, 'stone', m, 0, 1.36, 0, 0.82, 0.16, 0.82, { bevel: 0.05 });
	box(b, 'plaster', m, 0, 1.68, 0, 0.5, 0.48, 0.5, { bevel: 0.04 });
	const cap = new THREE.CylinderGeometry(0.12, 0.62, 0.36, 8, 1);
	b.push('stone', cap, m.clone().multiply(at(0, 2.08, 0)));
	cylinder(b, 'stone', m, 0, 2.36, 0, 0.06, 0.12, 0.22, 8);
	b.lamps.push([x, y + 1.68 * s, z]);
}

export type PavedCourt = {
	/** Width of the raised royal way (어도) down the middle, 0 for none. */
	axis?: number;
	/** Rows of rank stones (품계석) each side of the way. */
	ranks?: number;
	/** Stone lanterns at the corners of the way. */
	lanterns?: boolean;
	/** Field material: granite flags (박석) or fine raked sand. */
	field?: Mat;
};

/**
 * A palace yard: a field of granite flags or raked sand inside a dressed kerb, a raised stone way on
 * the axis running north–south, rank stones in two files and lanterns at its foot. Centred on (cx, cz).
 */
export function pavedCourt(b: Builder, cx: number, cz: number, W: number, D: number, y: number, o: PavedCourt = {}): void {
	box(b, o.field ?? 'paving', at(cx, y, cz), 0, -0.25, 0, W, 0.62, D);
	for (const sz of [1, -1]) box(b, 'stone', at(cx, y, cz + (sz * D) / 2), 0, 0.02, 0, W + 0.5, 0.32, 0.5, { bevel: 0.08 });
	for (const sx of [1, -1]) box(b, 'stone', at(cx + (sx * W) / 2, y, cz), 0, 0.02, 0, 0.5, 0.32, D, { bevel: 0.08 });
	const aw = o.axis ?? 4;
	if (aw > 0) {
		box(b, 'stone', at(cx, y, cz), 0, 0.12, 0, aw, 0.3, D - 1, { bevel: 0.08 });
		for (const sx of [1, -1]) box(b, 'paving', at(cx + sx * (aw / 2 + 1.6), y, cz), 0, 0.04, 0, 3, 0.14, D - 1);
	}
	const ranks = o.ranks ?? 0;
	for (let k = 0; k < ranks; k++) {
		const z = cz - D / 2 + 8 + ((D - 16) * (k + 0.5)) / ranks;
		for (const sx of [1, -1]) box(b, 'stone', at(cx + sx * (aw / 2 + 6), y, z), 0, 0.45, 0, 0.5, 0.9, 0.34, { bevel: 0.06 });
	}
	if (o.lanterns) for (const sx of [1, -1]) stoneLantern(b, cx + sx * (aw / 2 + 3.2), y, cz + D / 2 - 4);
}

/**
 * A palace garden pond: a stone-banked pool of any outline with rocks along the bank, sunk into a
 * lawn edged with stone. Trees and lanterns are left to the caller.
 */
export function gardenPond(b: Builder, outline: P2[], y: number, rand: () => number): void {
	b.push('courses', skirt(outline, y - 1.6, y + 0.3));
	b.push('earth', flat(outline, y - 1.6));
	b.push('water', flat(outline, y - 0.45));
	const rock = new THREE.IcosahedronGeometry(1, 1);
	for (const [x, z] of resample(outline, 3.2, true)) {
		if (rand() > 0.55) continue;
		const s = 0.45 + rand() * 0.6;
		b.push('rock', rock.clone(), at(x, y + 0.1, z, rand() * 6, s));
	}
	rock.dispose();
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

/** A point on a wall line with its left-hand normal. */
type WallSample = { x: number; z: number; nx: number; nz: number };

export type WallGap = { at: P2; half: number };

/**
 * Splits a wall line into the runs between gate gaps. Each run ends exactly on its gap's circle,
 * pulled in a little so the wall tucks into the gate block instead of stopping short of it, and a
 * closed ring never breaks at its seam.
 */
export function wallRuns(path: P2[], o: { closed: boolean; step: number; gaps?: WallGap[]; smooth?: number; extend?: number }): WallSample[][] {
	let line = chaikin(path, o.smooth ?? 1, o.closed);
	if (!o.closed && o.extend) {
		const ext = (a: P2, b: P2): P2 => {
			const l = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1;
			return [a[0] + ((a[0] - b[0]) / l) * o.extend!, a[1] + ((a[1] - b[1]) / l) * o.extend!];
		};
		line = [ext(line[0], line[1]), ...line, ext(line[line.length - 1], line[line.length - 2])];
	}
	const pts = resample(line, o.step, o.closed);
	const fr = frames(pts, o.closed);
	const gaps = o.gaps ?? [];
	const reach = (g: WallGap) => Math.max(0.4, g.half - Math.min(1.6, g.half * 0.22));
	const inGap = (x: number, z: number) => gaps.some((g) => Math.hypot(x - g.at[0], z - g.at[1]) < reach(g));
	const N = pts.length;
	const sample = (i: number): WallSample => ({ x: pts[i][0], z: pts[i][1], nx: fr[i].n[0], nz: fr[i].n[1] });
	// the point between an open station and a gapped one where the wall meets the gate
	const edge = (open: number, shut: number): WallSample => {
		let a = 0;
		let c = 1;
		const [x0, z0] = pts[open];
		const [x1, z1] = pts[shut];
		for (let k = 0; k < 14; k++) {
			const m = (a + c) / 2;
			if (inGap(x0 + (x1 - x0) * m, z0 + (z1 - z0) * m)) c = m;
			else a = m;
		}
		return { x: x0 + (x1 - x0) * a, z: z0 + (z1 - z0) * a, nx: fr[open].n[0], nz: fr[open].n[1] };
	};
	const shut = pts.map(([x, z]) => inGap(x, z));
	if (!shut.some(Boolean)) {
		const run = pts.map((_, i) => sample(i));
		if (o.closed) run.push(sample(0));
		return [run];
	}
	const runs: WallSample[][] = [];
	const start = o.closed ? shut.indexOf(true) : 0;
	let cur: WallSample[] = [];
	let last = -1;
	for (let k = 0; k < N; k++) {
		const i = o.closed ? (start + k) % N : k;
		if (shut[i]) {
			if (cur.length) {
				cur.push(edge(last, i));
				if (cur.length > 1) runs.push(cur);
				cur = [];
			}
			continue;
		}
		if (!cur.length) {
			const prev = o.closed ? (i - 1 + N) % N : i - 1;
			if (prev >= 0 && shut[prev]) cur.push(edge(i, prev));
		}
		cur.push(sample(i));
		last = i;
	}
	if (cur.length) {
		if (o.closed) cur.push(edge(last, start));
		if (cur.length > 1) runs.push(cur);
	}
	return runs;
}

/** Where a gate sits on a wall line: the nearest wall point, and the rotation that faces it outward square to the wall. */
export function gateOnWall(path: P2[], near: P2, o: { closed: boolean; outward?: 1 | -1 }): { at: P2; rot: number } {
	const pts = resample(chaikin(path, 1, o.closed), 2, o.closed);
	const fr = frames(pts, o.closed);
	let k = 0;
	let best = Infinity;
	pts.forEach(([x, z], i) => {
		const d = Math.hypot(x - near[0], z - near[1]);
		if (d < best) {
			best = d;
			k = i;
		}
	});
	const s = o.outward ?? 1;
	return { at: pts[k], rot: Math.atan2(fr[k].n[0] * s, fr[k].n[1] * s) };
}

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
	opts: { closed?: boolean; gaps?: WallGap[]; outward?: 1 | -1; step?: number; absolute?: boolean; slope?: Mat; top?: Mat } = {}
): void {
	const closed = opts.closed ?? true;
	const sign = opts.outward ?? 1;
	const gaps = opts.gaps ?? [];
	const runs = wallRuns(crest, { closed, step: opts.step ?? 5, gaps, smooth: 2 });
	const crestIdx = profile.reduce((best, p, i) => (Math.abs(p[0]) < Math.abs(profile[best][0]) ? i : best), 0);
	const point = (s: WallSample, k: number) => {
		const [off, hgt] = profile[k];
		const px = s.x + s.nx * off * sign;
		const pz = s.z + s.nz * off * sign;
		const y = opts.absolute ? hgt : ground(px, pz) + hgt;
		return new THREE.Vector3(px, y, pz);
	};

	for (const run of runs) {
		const slope: THREE.Vector3[][] = profile.map((_, k) => run.map((s) => point(s, k)));
		const uv: [number, number][][] = profile.map((_, k) => run.map((_s, j) => [j * 1.2, k * 3] as [number, number]));
		const inner = slope.slice(0, crestIdx + 1);
		const outer = slope.slice(crestIdx);
		b.push(opts.slope ?? 'rampart', surface(inner, uv.slice(0, crestIdx + 1), new THREE.Vector3(0, 1, 0)), undefined);
		b.push(opts.slope ?? 'rampart', surface(outer, uv.slice(crestIdx), new THREE.Vector3(0, 1, 0)), undefined);
		if (opts.top) {
			const crestRow = slope[crestIdx];
			const walk = crestRow.map((p) => [p.x, p.z] as P2);
			b.push(opts.top, ribbon(walk, 3, (_x, _z, i) => crestRow[i].y + 0.06), undefined);
		}
		if (gaps.length) {
			for (const end of [run[0], run[run.length - 1]]) {
				const ring = profile.map((_, k) => point(end, k));
				const base = ring.map((p) => new THREE.Vector3(p.x, Math.min(...ring.map((q) => q.y)) - 0.5, p.z));
				b.push('wallStone', surface([base, ring], [ring.map((_, k) => [k * 2, 0] as [number, number]), ring.map((p, k) => [k * 2, p.y] as [number, number])], new THREE.Vector3(0, 0, 0)), undefined);
			}
		}
	}
}

/**
 * A dressed-stone fortress wall (석성) that follows the ground along a path: battered faces, a level
 * walkway and a continuous parapet (여장) on the outer edge topped with chunky bevelled merlons.
 * The parapet is one lofted band, so the wall never steps apart on a slope. `extend` pushes the
 * ends of an open wall past its last point so it meets the wall it joins.
 */
export function stoneWall(
	b: Builder,
	path: P2[],
	ground: (x: number, z: number) => number,
	opts: {
		h?: number;
		t?: number;
		closed?: boolean;
		outward?: 1 | -1;
		gaps?: WallGap[];
		step?: number;
		mat?: Mat;
		parapet?: boolean;
		extend?: number;
	} = {}
): void {
	const closed = opts.closed ?? false;
	const mat = opts.mat ?? 'wallStone';
	const h = opts.h ?? 7;
	const t = opts.t ?? 5;
	const sign = opts.outward ?? 1;
	const parapet = opts.parapet !== false;
	const pH = parapet ? Math.min(1.2, 0.35 + h * 0.1) : 0;
	const pT = Math.min(1, t * 0.2);
	const batter = Math.min(1.2, h * 0.12);
	const runs = wallRuns(path, { closed, step: opts.step ?? 4, gaps: opts.gaps, extend: opts.extend });
	const merlonEvery = 2.8;

	for (const run of runs) {
		const outBot: THREE.Vector3[] = [];
		const outTop: THREE.Vector3[] = [];
		const parIn: THREE.Vector3[] = [];
		const parInTop: THREE.Vector3[] = [];
		const walkIn: THREE.Vector3[] = [];
		const inBot: THREE.Vector3[] = [];
		const uvA: [number, number][] = [];
		const uvB: [number, number][] = [];
		const along: number[] = [];
		let s = 0;
		run.forEach((p, j) => {
			if (j) s += Math.hypot(p.x - run[j - 1].x, p.z - run[j - 1].z);
			along.push(s);
			const nx = p.nx * sign;
			const nz = p.nz * sign;
			const ox = p.x + nx * (t / 2);
			const oz = p.z + nz * (t / 2);
			const ix = p.x - nx * (t / 2);
			const iz = p.z - nz * (t / 2);
			const gy = Math.min(ground(ox + nx * batter, oz + nz * batter), ground(ix, iz), ground(p.x, p.z)) - 1.6;
			const top = ground(p.x, p.z) + h;
			outBot.push(new THREE.Vector3(ox + nx * batter, gy, oz + nz * batter));
			outTop.push(new THREE.Vector3(ox, top + pH, oz));
			parInTop.push(new THREE.Vector3(ox - nx * pT, top + pH, oz - nz * pT));
			parIn.push(new THREE.Vector3(ox - nx * pT, top, oz - nz * pT));
			walkIn.push(new THREE.Vector3(ix, top, iz));
			inBot.push(new THREE.Vector3(ix - nx * batter * 0.4, gy, iz - nz * batter * 0.4));
			uvA.push([s, 0]);
			uvB.push([s, h + 2]);
		});
		const flatUv = (w: number) => [uvA.map(([u]) => [u, 0] as [number, number]), uvA.map(([u]) => [u, w] as [number, number])];
		b.push(mat, surface([outBot, outTop], [uvA, uvB], new THREE.Vector3(0, 0, 0)), undefined);
		b.push(mat, surface([inBot, walkIn], [uvA, uvB], new THREE.Vector3(0, 0, 0)), undefined);
		if (parapet) {
			b.push('earth', surface([walkIn, parIn], flatUv(t - pT), new THREE.Vector3(0, 1, 0)), undefined);
			b.push(mat, surface([parIn, parInTop], [uvA.map(([u]) => [u, 0] as [number, number]), uvA.map(([u]) => [u, pH] as [number, number])], new THREE.Vector3(0, 0, 0)), undefined);
			b.push(mat, surface([parInTop, outTop], flatUv(pT), new THREE.Vector3(0, 1, 0)), undefined);
		} else {
			b.push('earth', surface([walkIn, outTop], flatUv(t), new THREE.Vector3(0, 1, 0)), undefined);
		}
		// end caps, so an open wall end or a wall meeting a gate reads as solid stone
		for (const j of [0, run.length - 1]) {
			const bot = [inBot[j], outBot[j]];
			const top = [walkIn[j], outTop[j]];
			b.push(mat, surface([bot, top], [[[0, 0], [t, 0]], [[0, h], [t, h]]], new THREE.Vector3(0, 0, 0)), undefined);
		}
		// chunky merlons on the parapet, spaced evenly along the run
		if (!parapet || s < merlonEvery) continue;
		const n = Math.floor(s / merlonEvery);
		const pad = (s - n * merlonEvery) / 2;
		let seg = 0;
		for (let k = 0; k < n; k++) {
			const d = pad + (k + 0.5) * merlonEvery;
			while (seg < run.length - 2 && along[seg + 1] < d) seg++;
			const f = (d - along[seg]) / Math.max(1e-3, along[seg + 1] - along[seg]);
			const a = outTop[seg];
			const c = outTop[seg + 1];
			const pa = run[seg];
			const mx = a.x + (c.x - a.x) * f - pa.nx * sign * (pT / 2);
			const mz = a.z + (c.z - a.z) * f - pa.nz * sign * (pT / 2);
			const my = a.y + (c.y - a.y) * f;
			const ang = Math.atan2(c.z - a.z, c.x - a.x);
			box(b, mat, at(mx, my, mz, facing(ang)), 0, 0.42, 0, merlonEvery * 0.52, 0.95, pT + 0.08, { bevel: 0.12 });
		}
	}
}

/* ------------------------------------------------------------------ trees */

export type TreeKind = 'pine' | 'broad' | 'willow' | 'zelkova' | 'citrus' | 'cherry' | 'maple';

const TREE_COLORS: Record<TreeKind, string[]> = {
	pine: ['#3f7342', '#4a804a', '#386a3c', '#558a50'],
	broad: ['#6fa646', '#7db451', '#63993f', '#8bbb5a', '#74a84a'],
	willow: ['#9cc463', '#aacd6e', '#8fba5a'],
	zelkova: ['#5f9442', '#6ba049', '#578a3e'],
	citrus: ['#2f5e2c', '#386b32', '#2a5428'],
	cherry: ['#f2b8c6', '#eaa5b8', '#f6cbd5', '#e398ab'],
	maple: ['#d8343a', '#e4502f', '#c8282f', '#ee6a3a', '#b92a2a']
};

function crownGeometry(kind: TreeKind): THREE.BufferGeometry {
	const rand = rng(kind.length * 97);
	// puffy clustered crowns: a big central puff and smaller ones crowding round it, like a crafted game tree
	const lumps: [number, number, number, number][] =
		kind === 'pine'
			? [
					// Korean red pine: flat-topped cloud pads on a tall trunk
					[0, 0.86, 0, 0.36],
					[0.3, 0.76, 0.12, 0.26],
					[-0.28, 0.8, -0.14, 0.27],
					[0.06, 0.95, -0.22, 0.22],
					[-0.1, 0.7, 0.26, 0.2]
				]
			: kind === 'willow'
				? [
						[0, 0.58, 0, 0.44],
						[0.26, 0.42, 0.14, 0.34],
						[-0.26, 0.44, -0.12, 0.34],
						[0.04, 0.36, -0.3, 0.3],
						[-0.06, 0.4, 0.3, 0.3]
					]
				: kind === 'zelkova'
					? [
							[0, 0.68, 0, 0.44],
							[0.34, 0.6, 0.1, 0.32],
							[-0.32, 0.62, -0.14, 0.32],
							[0.06, 0.84, 0.18, 0.28],
							[-0.08, 0.8, -0.28, 0.27]
						]
					: [
							[0, 0.64, 0, 0.42],
							[0.26, 0.56, 0.16, 0.3],
							[-0.24, 0.58, -0.14, 0.3],
							[0.08, 0.8, -0.12, 0.28],
							[-0.06, 0.5, 0.28, 0.24]
						];
	const squash = kind === 'pine' ? 0.5 : kind === 'willow' ? 1.15 : 0.9;
	const top = lumps.reduce((a, l) => Math.max(a, l[1]), 0);
	const centre = new THREE.Vector3(0, top - 0.12, 0);
	const v = new THREE.Vector3();
	const n = new THREE.Vector3();
	const parts = lumps.map(([x, y, z, r], i) => {
		const g = new THREE.IcosahedronGeometry(r, i < 3 ? 1 : 0);
		const pos = g.getAttribute('position');
		for (let i = 0; i < pos.count; i++) {
			const k = 1 + (rand() - 0.5) * 0.1;
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

/** Bake a flat colour into a part, darkened toward its foot so houses sit in their own contact shadow. */
function paintPart(g: THREE.BufferGeometry, hex: string, ao = true): THREE.BufferGeometry {
	const flat = g.index ? g.toNonIndexed() : g;
	if (flat !== g) g.dispose();
	const c = new THREE.Color(hex);
	const pos = flat.getAttribute('position');
	const arr = new Float32Array(pos.count * 3);
	for (let i = 0; i < pos.count; i++) {
		const k = ao ? 0.62 + 0.38 * Math.min(1, Math.max(0, (pos.getY(i) + 0.05) / 0.45)) : 1;
		arr[i * 3] = c.r * k;
		arr[i * 3 + 1] = c.g * k;
		arr[i * 3 + 2] = c.b * k * (k < 1 ? 1.05 : 1);
	}
	flat.setAttribute('color', new THREE.BufferAttribute(arr, 3));
	return flat;
}

/**
 * A unit town house: a sunk stone footing, bevelled plastered body with a timber band, and either
 * a grey tiled roof with a plump eave or a soft rounded thatch (초가).
 */
function houseGeometry(roofColor: string, wallColor: string, thatched: boolean): THREE.BufferGeometry {
	const parts: THREE.BufferGeometry[] = [];
	const base = bevelGeometry(1.1, 0.5, 1.14, 0.05);
	base.translate(0, -0.13, 0);
	parts.push(paintPart(base, '#bdb4a2'));
	const body = bevelGeometry(1, 0.5, 1, 0.04);
	body.translate(0, 0.37, 0);
	parts.push(paintPart(body, wallColor));
	const frame = bevelGeometry(1.03, 0.08, 1.03, 0.02);
	frame.translate(0, 0.6, 0);
	parts.push(paintPart(frame, '#86412e', false));
	if (thatched) parts.push(thatchRoof(roofColor));
	else {
		for (const sz of [1, -1]) {
			const slope = bevelGeometry(1.34, 0.1, 0.8, 0.035);
			slope.rotateX(sz * 0.52);
			slope.translate(0, 0.82, sz * 0.32);
			parts.push(paintPart(slope, roofColor, false));
		}
		const ridge = bevelGeometry(1.38, 0.11, 0.14, 0.04);
		ridge.translate(0, 1.0, 0);
		parts.push(paintPart(ridge, '#3a424b', false));
	}
	const g = mergeGeometries(parts, false)!;
	for (const p of parts) p.dispose();
	return g;
}

/**
 * A rounded loaf of thatch over the unit house: a hemisphere pushed toward the footprint's rectangle,
 * low eaves that overhang the walls, a soft crown. Shaded lighter at the crown, weathered at the eaves.
 */
function thatchRoof(hex: string): THREE.BufferGeometry {
	const g = new THREE.SphereGeometry(1, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2);
	const pos = g.getAttribute('position');
	const sq = (v: number, e: number) => Math.sign(v) * Math.abs(v) ** e;
	for (let i = 0; i < pos.count; i++) {
		const x = pos.getX(i);
		const y = pos.getY(i);
		const z = pos.getZ(i);
		// the lower rings square off toward the walls; the crown stays round
		const e = 0.5 + 0.5 * y;
		pos.setXYZ(i, sq(x, e) * 0.66, y * 0.46 + 0.56, sq(z, e) * 0.64);
	}
	g.computeVertexNormals();
	const flat = g.toNonIndexed();
	g.dispose();
	const c = new THREE.Color(hex);
	const at = flat.getAttribute('position');
	const col = new Float32Array(at.count * 3);
	for (let i = 0; i < at.count; i++) {
		const k = 0.74 + 0.3 * ((at.getY(i) - 0.56) / 0.46);
		col[i * 3] = c.r * k;
		col[i * 3 + 1] = c.g * k;
		col[i * 3 + 2] = c.b * k * 0.96;
	}
	flat.setAttribute('color', new THREE.BufferAttribute(col, 3));
	return flat;
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
		const sets: [THREE.Matrix4[], string, string, boolean][] = [
			[this.tile, '#66727e', '#f0e9da', false],
			[this.thatch, '#c9a86c', '#e2d4b6', true]
		];
		for (const [list, roofC, wallC, thatched] of sets) {
			if (!list.length) continue;
			const mesh = new THREE.InstancedMesh(houseGeometry(roofC, wallC, thatched), p.houses, list.length);
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

/* ------------------------------------------------------------------ camps */

export type Tent = { x: number; y: number; z: number; r: number; h: number; rot: number; big?: boolean };

/**
 * A field camp: ridge tents of undyed canvas in rows, and square pavilion tents for the officers.
 * Instanced, two draw calls.
 */
export function tents(p: Palette, list: Tent[]): THREE.Group {
	const group = new THREE.Group();
	group.name = 'tents';
	const ridge = new THREE.CylinderGeometry(1, 1, 2.2, 3, 1);
	ridge.rotateX(-Math.PI / 2);
	ridge.translate(0, 0.5, 0);
	ridge.scale(1, 0.7, 1);
	const pavilion = new THREE.ConeGeometry(1.15, 1, 4, 1);
	pavilion.rotateY(Math.PI / 4);
	pavilion.translate(0, 1.2, 0);
	const wall = new THREE.CylinderGeometry(0.82, 0.82, 0.75, 4, 1);
	wall.rotateY(Math.PI / 4);
	wall.translate(0, 0.37, 0);
	const kinds: [THREE.BufferGeometry, Tent[]][] = [
		[paintPart(ridge, '#efe6d2'), list.filter((t) => !t.big)],
		[mergeGeometries([paintPart(wall, '#f2ead8'), paintPart(pavilion, '#c94a32', false)], false)!, list.filter((t) => t.big)]
	];
	const m = new THREE.Matrix4();
	for (const [geo, items] of kinds) {
		if (!items.length) {
			geo.dispose();
			continue;
		}
		const mesh = new THREE.InstancedMesh(geo, p.houses, items.length);
		items.forEach((t, i) => {
			m.compose(new THREE.Vector3(t.x, t.y - 0.1, t.z), new THREE.Quaternion().setFromAxisAngle(Y, t.rot), new THREE.Vector3(t.r, t.h, t.r));
			mesh.setMatrixAt(i, m);
		});
		mesh.instanceMatrix.needsUpdate = true;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.computeBoundingSphere();
		group.add(mesh);
	}
	return group;
}

/* ------------------------------------------------------------------ clouds */

/**
 * Soft cloud puffs: camera-facing cards with a painted cumulus texture (the Ansi and Chek boards
 * sit in a sea of cloud). One instanced draw; tinted per light preset through `p.puff`.
 */
export function cloudBank(p: Palette, puffs: { x: number; y: number; z: number; r: number }[]): THREE.InstancedMesh {
	const g = new THREE.PlaneGeometry(2.6, 1.3);
	const mesh = new THREE.InstancedMesh(g, p.puff, puffs.length);
	const m = new THREE.Matrix4();
	const q = new THREE.Quaternion();
	puffs.forEach((c, i) => {
		m.compose(new THREE.Vector3(c.x, c.y, c.z), q, new THREE.Vector3(c.r, c.r, c.r));
		mesh.setMatrixAt(i, m);
	});
	mesh.instanceMatrix.needsUpdate = true;
	mesh.computeBoundingSphere();
	if (mesh.boundingSphere) mesh.boundingSphere.radius += 400;
	mesh.renderOrder = 3;
	mesh.name = 'cloud-puffs';
	mesh.userData.layer = 'clouds';
	return mesh;
}
