import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng, fbm, smoothstep, type Bounds } from './geo';

/** Shared clock for every animated material on a site. */
export type TimeUniform = { value: number };

const NOISE = /* glsl */ `
float stHash(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}
float stNoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float a = stHash(i);
	float b = stHash(i + vec2(1.0, 0.0));
	float c = stHash(i + vec2(0.0, 1.0));
	float d = stHash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
`;

/* ------------------------------------------------------------------ material patches */

/**
 * Wind sway and painterly shading for instanced plants. Geometry is a unit plant with y in 0..1;
 * `amp` is the tip sway as a share of plant height.
 */
export function patchSway(mat: THREE.MeshStandardMaterial, time: TimeUniform, key: string, amp = 0.03, shade = true): void {
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = time;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nuniform float uTime;\nvarying float vPlantH;\nvarying vec3 vPlantW;`)
			.replace(
				'#include <begin_vertex>',
				`#include <begin_vertex>
				vPlantH = position.y;
				vec3 ip = vec3(0.0);
				#ifdef USE_INSTANCING
					ip = instanceMatrix[3].xyz;
				#endif
				float ph = uTime * 1.25 + ip.x * 0.043 + ip.z * 0.061;
				float k = max(position.y - 0.2, 0.0);
				transformed.x += (sin(ph) * ${amp.toFixed(4)} + sin(ph * 2.9 + position.z * 7.0) * ${(amp * 0.28).toFixed(4)}) * k;
				transformed.z += (cos(ph * 0.83) * ${(amp * 0.7).toFixed(4)} + cos(ph * 3.3 + position.x * 6.0) * ${(amp * 0.2).toFixed(4)}) * k;
				vPlantW = ip + position * 4.0;`
			);
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nvarying float vPlantH;\nvarying vec3 vPlantW;\n${NOISE}`)
			.replace(
				'#include <color_fragment>',
				shade
					? `#include <color_fragment>
					diffuseColor.rgb *= mix(0.56, 1.12, smoothstep(0.15, 1.0, vPlantH));
					float leaf = stNoise(vPlantW.xz * 2.4 + vPlantW.y * 1.7) * 0.6 + stNoise(vPlantW.xy * 7.0 + vPlantW.z * 5.0) * 0.4;
					diffuseColor.rgb *= 0.72 + 0.46 * smoothstep(0.2, 0.85, leaf);`
					: `#include <color_fragment>
					diffuseColor.rgb *= mix(0.7, 1.08, vPlantH);`
			);
	};
	mat.customProgramCacheKey = () => `stage-sway-${key}`;
}

/** Ground: multi-scale colour breakup, and a crown texture wherever the `cover` attribute says forest. */
export function patchGround(mat: THREE.MeshStandardMaterial): void {
	mat.onBeforeCompile = (sh) => {
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nattribute float cover;\nvarying float vCover;\nvarying vec3 vGW;`)
			.replace('#include <begin_vertex>', `#include <begin_vertex>\nvCover = cover;\nvGW = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nvarying float vCover;\nvarying vec3 vGW;\n${NOISE}`)
			.replace(
				'#include <color_fragment>',
				`#include <color_fragment>
				float gn = stNoise(vGW.xz * 0.045) * 0.16 + stNoise(vGW.xz * 0.23) * 0.1 + stNoise(vGW.xz * 1.4) * 0.07;
				diffuseColor.rgb *= 0.87 + gn;
				float crowns = smoothstep(0.32, 0.78, stNoise(vGW.xz * 0.085) * 0.55 + stNoise(vGW.xz * 0.29) * 0.45);
				diffuseColor.rgb *= mix(1.0, mix(0.48, 1.14, crowns), vCover);`
			);
	};
	mat.customProgramCacheKey = () => 'stage-ground';
}

/**
 * Snow settles on whatever faces up. Chains onto any patch already on the material, so it works
 * on swaying foliage as well as merged roofs.
 */
export function patchSnow(mat: THREE.Material, amount: number): void {
	const prev = mat.onBeforeCompile;
	const prevKey = mat.customProgramCacheKey();
	mat.onBeforeCompile = (sh, r) => {
		prev.call(mat, sh, r);
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nvarying float vSnowY;`)
			.replace(
				'#include <begin_vertex>',
				`#include <begin_vertex>
				vec3 snowN = objectNormal;
				#ifdef USE_INSTANCING
					snowN = mat3(instanceMatrix) * snowN;
				#endif
				vSnowY = normalize(mat3(modelMatrix) * snowN).y;`
			);
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nvarying float vSnowY;`)
			.replace(
				'#include <color_fragment>',
				`#include <color_fragment>
				diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9, 0.93, 0.96), smoothstep(0.3, 0.72, vSnowY) * ${amount.toFixed(3)});`
			);
	};
	mat.customProgramCacheKey = () => `${prevKey}|snow${amount.toFixed(2)}`;
}

/** Water: two ripple layers drifting against each other. */
export function patchWater(mat: THREE.MeshStandardMaterial, time: TimeUniform): void {
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = time;
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nuniform float uTime;`)
			.replace(
				'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
				`vec3 mapN = normalize(
					(texture2D(normalMap, vNormalMapUv + vec2(uTime * 0.009, uTime * 0.0055)).xyz * 2.0 - 1.0) +
					(texture2D(normalMap, vNormalMapUv * 2.7 + vec2(-uTime * 0.011, uTime * 0.008)).xyz * 2.0 - 1.0)
				);`
			);
	};
	mat.customProgramCacheKey = () => 'stage-water';
}

/* ------------------------------------------------------------------ textures */

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	return [c, c.getContext('2d')!];
}

/** A tuft of blades on a transparent card; `flowers` sprinkles blossoms on top. */
export function tuftTexture(flowers: boolean): THREE.CanvasTexture {
	const [c, g] = canvas(128, 128);
	const rand = rng(flowers ? 7 : 3);
	for (let i = 0; i < 46; i++) {
		const x = 10 + rand() * 108;
		const h = 50 + rand() * 74;
		const lean = (rand() - 0.5) * 34;
		const w = 2.4 + rand() * 3;
		const l = 34 + rand() * 22;
		g.fillStyle = `hsl(${88 + rand() * 26}, ${38 + rand() * 20}%, ${l}%)`;
		g.beginPath();
		g.moveTo(x - w, 128);
		g.quadraticCurveTo(x + lean * 0.3, 128 - h * 0.6, x + lean, 128 - h);
		g.quadraticCurveTo(x + lean * 0.3 + w * 0.4, 128 - h * 0.55, x + w, 128);
		g.closePath();
		g.fill();
	}
	if (flowers) {
		const hues = ['#f7f3ea', '#f5d76e', '#e9a3c0', '#b9a2e0', '#f2b36b'];
		for (let i = 0; i < 16; i++) {
			const x = 14 + rand() * 100;
			const y = 20 + rand() * 50;
			g.fillStyle = hues[Math.floor(rand() * hues.length)];
			g.beginPath();
			g.arc(x, y, 3 + rand() * 3, 0, Math.PI * 2);
			g.fill();
		}
	}
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

/** Soft, tileable wisps for mist layers. */
export function mistTexture(): THREE.CanvasTexture {
	const [c, g] = canvas(256, 256);
	const rand = rng(23);
	g.clearRect(0, 0, 256, 256);
	for (let i = 0; i < 70; i++) {
		const x = rand() * 256;
		const y = rand() * 256;
		const r = 24 + rand() * 60;
		for (const [dx, dy] of [
			[0, 0],
			[256, 0],
			[-256, 0],
			[0, 256],
			[0, -256]
		]) {
			const grad = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
			grad.addColorStop(0, `rgba(255,255,255,${0.16 + rand() * 0.12})`);
			grad.addColorStop(1, 'rgba(255,255,255,0)');
			g.fillStyle = grad;
			g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
		}
	}
	const t = new THREE.CanvasTexture(c);
	t.wrapS = t.wrapT = THREE.RepeatWrapping;
	return t;
}

/** A cumulus puff for sky sprites. */
export function cloudTexture(seed: number): THREE.CanvasTexture {
	const [c, g] = canvas(256, 128);
	const rand = rng(seed);
	for (let i = 0; i < 26; i++) {
		const x = 40 + rand() * 176;
		const y = 54 + rand() * 40 - Math.abs(x - 128) * 0.12;
		const r = 18 + rand() * 30;
		const grad = g.createRadialGradient(x, y - r * 0.2, 0, x, y, r);
		grad.addColorStop(0, 'rgba(255,255,255,0.95)');
		grad.addColorStop(0.6, 'rgba(246,246,250,0.7)');
		grad.addColorStop(1, 'rgba(230,234,242,0)');
		g.fillStyle = grad;
		g.beginPath();
		g.arc(x, y, r, 0, Math.PI * 2);
		g.fill();
	}
	const shade = g.createLinearGradient(0, 40, 0, 128);
	shade.addColorStop(0, 'rgba(0,0,0,0)');
	shade.addColorStop(1, 'rgba(70,80,100,0.35)');
	g.globalCompositeOperation = 'source-atop';
	g.fillStyle = shade;
	g.fillRect(0, 0, 256, 128);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	return t;
}

/* ------------------------------------------------------------------ ground cover */

export type CoverKind = 'grass' | 'flowers' | 'shrub' | 'reed' | 'rock' | 'basalt' | 'fruit';

export type CoverMaterials = {
	grass: THREE.MeshStandardMaterial;
	flowers: THREE.MeshStandardMaterial;
	shrub: THREE.MeshStandardMaterial;
	reed: THREE.MeshStandardMaterial;
	rock: THREE.Material;
	fruit: THREE.MeshStandardMaterial;
};

const COVER_COLORS: Record<CoverKind, string[]> = {
	grass: ['#ffffff', '#f1f6e4', '#e4edd0', '#fbf6e8'],
	flowers: ['#ffffff', '#f4f0e6'],
	shrub: ['#5f8a3f', '#6d9746', '#557d38', '#7aa04f', '#4f7535'],
	reed: ['#8ea25a', '#9fae66', '#a8a868', '#7f9950'],
	rock: ['#d8d4cc', '#c9c4b9', '#e3dfd6', '#bdb8ad'],
	basalt: ['#5a5856', '#4a4947', '#666360', '#3f3e3d'],
	fruit: ['#f39a2b', '#f7a93a', '#ea8a1f']
};

/** Which material each cover kind draws with. */
const COVER_MAT: Record<CoverKind, keyof CoverMaterials> = {
	grass: 'grass',
	flowers: 'flowers',
	shrub: 'shrub',
	reed: 'reed',
	rock: 'rock',
	basalt: 'rock',
	fruit: 'fruit'
};

function cardGeometry(): THREE.BufferGeometry {
	const a = new THREE.PlaneGeometry(1, 1);
	a.translate(0, 0.5, 0);
	const b = a.clone();
	b.rotateY(Math.PI / 2);
	const g = mergeGeometries([a, b], false)!;
	a.dispose();
	b.dispose();
	const n = g.getAttribute('normal');
	for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
	return g;
}

function shrubGeometry(): THREE.BufferGeometry {
	const parts = [
		[0, 0.42, 0, 0.5],
		[0.32, 0.32, 0.12, 0.34],
		[-0.28, 0.34, -0.14, 0.36]
	].map(([x, y, z, r]) => {
		const g = new THREE.IcosahedronGeometry(r, 0);
		g.scale(1, 0.72, 1);
		g.translate(x, y, z);
		return g.index ? g.toNonIndexed() : g;
	});
	const g = mergeGeometries(parts, false)!;
	for (const p of parts) p.dispose();
	g.computeVertexNormals();
	return g;
}

function reedGeometry(): THREE.BufferGeometry {
	const rand = rng(5);
	const pos: number[] = [];
	for (let i = 0; i < 7; i++) {
		const a = rand() * Math.PI * 2;
		const r = rand() * 0.25;
		const x = Math.cos(a) * r;
		const z = Math.sin(a) * r;
		const lx = x + (rand() - 0.5) * 0.4;
		const lz = z + (rand() - 0.5) * 0.4;
		const h = 0.7 + rand() * 0.3;
		const w = 0.035;
		const c = Math.cos(a + Math.PI / 2) * w;
		const s = Math.sin(a + Math.PI / 2) * w;
		pos.push(x - c, 0, z - s, x + c, 0, z + s, lx, h, lz);
	}
	const g = new THREE.BufferGeometry();
	g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
	g.computeVertexNormals();
	return g;
}

function rockGeometry(): THREE.BufferGeometry {
	const g = new THREE.IcosahedronGeometry(0.5, 0);
	const rand = rng(11);
	const p = g.getAttribute('position');
	for (let i = 0; i < p.count; i++) {
		const k = 0.75 + rand() * 0.5;
		p.setXYZ(i, p.getX(i) * k, Math.max(-0.1, p.getY(i) * k * 0.6), p.getZ(i) * k);
	}
	g.translate(0, 0.12, 0);
	g.computeVertexNormals();
	return g;
}

/** Instanced ground cover: grass and flower tufts, shrubs, reeds, stones. Sizes in metres. */
export class Cover {
	private items: Record<CoverKind, number[]> = { grass: [], flowers: [], shrub: [], reed: [], rock: [], basalt: [], fruit: [] };
	private rand = rng(61);

	add(kind: CoverKind, x: number, y: number, z: number, size: number): void {
		this.items[kind].push(x, y, z, size, this.rand() * Math.PI * 2, this.rand());
	}

	get count(): number {
		return Object.values(this.items).reduce((a, l) => a + l.length / 6, 0);
	}

	build(mats: CoverMaterials): THREE.Group {
		const group = new THREE.Group();
		group.name = 'cover';
		const geos: Record<CoverKind, () => THREE.BufferGeometry> = {
			grass: cardGeometry,
			flowers: cardGeometry,
			shrub: shrubGeometry,
			reed: reedGeometry,
			rock: rockGeometry,
			basalt: rockGeometry,
			fruit: () => new THREE.IcosahedronGeometry(0.5, 1)
		};
		const m = new THREE.Matrix4();
		const q = new THREE.Quaternion();
		const up = new THREE.Vector3(0, 1, 0);
		const v = new THREE.Vector3();
		const s = new THREE.Vector3();
		const color = new THREE.Color();
		for (const kind of Object.keys(this.items) as CoverKind[]) {
			const list = this.items[kind];
			const n = list.length / 6;
			if (!n) continue;
			const mesh = new THREE.InstancedMesh(geos[kind](), mats[COVER_MAT[kind]], n);
			const palette = COVER_COLORS[kind];
			for (let i = 0; i < n; i++) {
				const [x, y, z, size, rot, c] = list.slice(i * 6, i * 6 + 6);
				q.setFromAxisAngle(up, rot);
				const flat = kind === 'shrub' ? 1.25 : kind === 'rock' || kind === 'basalt' ? 1.3 : 1;
				m.compose(v.set(x, y, z), q, s.set(size * flat, size, size * flat));
				mesh.setMatrixAt(i, m);
				color.set(palette[Math.floor(c * palette.length) % palette.length]);
				mesh.setColorAt(i, color);
			}
			mesh.instanceMatrix.needsUpdate = true;
			if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
			mesh.computeBoundingSphere();
			mesh.castShadow = kind === 'shrub' || kind === 'rock' || kind === 'basalt';
			mesh.receiveShadow = true;
			mesh.name = `cover-${kind}`;
			group.add(mesh);
		}
		return group;
	}
}

/* ------------------------------------------------------------------ mist and lanterns */

export type MistLayer = { y: number; opacity: number };

/**
 * Low mist: stacked translucent sheets over a box, drifting slowly. Each sheet is a coarse grid whose
 * vertex alpha thins where the ground rises to meet it and breaks into patches, so it pools in
 * the low ground instead of slicing the hills with a hard line.
 */
export function mistSheets(
	box: Bounds,
	layers: MistLayer[],
	tex: THREE.Texture,
	height: (x: number, z: number) => number,
	tile = 900,
	cells = 140
): { group: THREE.Group; mats: THREE.MeshBasicMaterial[]; base: number[] } {
	const group = new THREE.Group();
	group.name = 'mist';
	const mats: THREE.MeshBasicMaterial[] = [];
	const base: number[] = [];
	const w = box.maxX - box.minX;
	const d = box.maxZ - box.minZ;
	const ground: number[] = [];
	const g0 = new THREE.PlaneGeometry(w, d, cells, cells);
	g0.rotateX(-Math.PI / 2);
	const cx = (box.minX + box.maxX) / 2;
	const cz = (box.minZ + box.maxZ) / 2;
	const pos = g0.getAttribute('position');
	for (let i = 0; i < pos.count; i++) ground.push(height(pos.getX(i) + cx, pos.getZ(i) + cz));
	layers.forEach((l, li) => {
		const t = tex.clone();
		t.needsUpdate = true;
		t.repeat.set(w / tile, d / tile);
		t.offset.set(li * 0.37, li * 0.61);
		const g = g0.clone();
		const col = new Float32Array(pos.count * 4);
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i) + cx;
			const z = pos.getZ(i) + cz;
			const gap = l.y - ground[i];
			const patch = smoothstep(-0.25, 0.45, fbm(x / 1400 + li * 3.1, z / 1400 - li * 1.7, 3));
			const a = smoothstep(0.4, 3.5, gap) * (1 - smoothstep(30, 90, gap) * 0.6) * patch;
			col.set([1, 1, 1, a], i * 4);
		}
		g.setAttribute('color', new THREE.BufferAttribute(col, 4));
		const mat = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: l.opacity, color: '#ffffff', vertexColors: true });
		mat.onBeforeCompile = (sh) => {
			sh.vertexShader = sh.vertexShader
				.replace('#include <common>', '#include <common>\nvarying float vMistDepth;')
				.replace('#include <project_vertex>', '#include <project_vertex>\nvMistDepth = -mvPosition.z;');
			sh.fragmentShader = sh.fragmentShader
				.replace('#include <common>', '#include <common>\nvarying float vMistDepth;')
				.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= smoothstep(90.0, 650.0, vMistDepth);');
		};
		mat.customProgramCacheKey = () => 'stage-mist';
		const mesh = new THREE.Mesh(g, mat);
		mesh.position.set(cx, l.y, cz);
		mesh.renderOrder = 2;
		group.add(mesh);
		mats.push(mat);
		base.push(l.opacity);
	});
	g0.dispose();
	return { group, mats, base };
}

/** Paper lanterns at the given points; their glow is switched by the light preset. */
export function lanterns(points: [number, number, number][], mat: THREE.MeshStandardMaterial): THREE.InstancedMesh | null {
	if (!points.length) return null;
	const body = new THREE.CylinderGeometry(0.26, 0.22, 0.6, 8);
	const cap = new THREE.CylinderGeometry(0.12, 0.3, 0.12, 8);
	cap.translate(0, 0.36, 0);
	const g = mergeGeometries([body.toNonIndexed(), cap.toNonIndexed()], false)!;
	body.dispose();
	cap.dispose();
	const mesh = new THREE.InstancedMesh(g, mat, points.length);
	const m = new THREE.Matrix4();
	points.forEach(([x, y, z], i) => {
		m.makeTranslation(x, y, z);
		mesh.setMatrixAt(i, m);
	});
	mesh.instanceMatrix.needsUpdate = true;
	mesh.computeBoundingSphere();
	mesh.name = 'lanterns';
	return mesh;
}
