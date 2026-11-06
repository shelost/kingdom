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
export function patchSway(mat: THREE.MeshStandardMaterial, time: TimeUniform, wind: TimeUniform, key: string, amp = 0.03, shade = true): void {
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = time;
		sh.uniforms.uWind = wind;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nuniform float uTime;\nuniform float uWind;\nvarying float vPlantH;\nvarying vec3 vPlantW;`)
			.replace(
				'#include <begin_vertex>',
				`#include <begin_vertex>
				vPlantH = position.y;
				vec3 ip = vec3(0.0);
				#ifdef USE_INSTANCING
					ip = instanceMatrix[3].xyz;
				#endif
				float ph = uTime * 1.25 + ip.x * 0.043 + ip.z * 0.061;
				float k = max(position.y - 0.2, 0.0) * uWind;
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
					float hk = smoothstep(0.15, 1.0, vPlantH);
					diffuseColor.rgb *= mix(0.62, 1.1, hk);
					diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.12, 1.08, 0.86), hk * 0.5);
					float leaf = stNoise(vPlantW.xz * 1.6 + vPlantW.y * 1.2);
					diffuseColor.rgb *= 0.92 + 0.14 * leaf;`
					: `#include <color_fragment>
					diffuseColor.rgb *= mix(0.7, 1.08, vPlantH);`
			);
	};
	mat.customProgramCacheKey = () => `stage-sway-${key}`;
}

/** Ground: multi-scale colour breakup, and a crown texture wherever the `cover` attribute says forest. */
export function patchGround(mat: THREE.MeshStandardMaterial, canopy: TimeUniform): void {
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uCanopy = canopy;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nattribute float cover;\nvarying float vCover;\nvarying vec3 vGW;`)
			.replace('#include <begin_vertex>', `#include <begin_vertex>\nvCover = cover;\nvGW = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nuniform float uCanopy;\nvarying float vCover;\nvarying vec3 vGW;\n${NOISE}`)
			.replace(
				'#include <color_fragment>',
				`#include <color_fragment>
				float gn = stNoise(vGW.xz * 0.012) * 0.08 + stNoise(vGW.xz * 0.05) * 0.05;
				diffuseColor.rgb *= 0.95 + gn;
				float crowns = smoothstep(0.3, 0.72, stNoise(vGW.xz * 0.07) * 0.6 + stNoise(vGW.xz * 0.21) * 0.4);
				diffuseColor.rgb *= mix(1.0, mix(0.66, 1.08, crowns), vCover * uCanopy);`
			);
	};
	mat.customProgramCacheKey = () => 'stage-ground';
}

/** Instanced cards that always face the camera (cloud puffs); instance scale sets the card size. */
export function patchBillboard(mat: THREE.MeshBasicMaterial): void {
	mat.onBeforeCompile = (sh) => {
		sh.vertexShader = sh.vertexShader.replace(
			'#include <project_vertex>',
			`vec4 mvPosition = vec4(0.0, 0.0, 0.0, 1.0);
			vec2 bbScale = vec2(1.0);
			#ifdef USE_INSTANCING
				mvPosition = instanceMatrix * mvPosition;
				bbScale = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
			#endif
			mvPosition = modelViewMatrix * mvPosition;
			mvPosition.xy += position.xy * bbScale;
			gl_Position = projectionMatrix * mvPosition;`
		);
	};
	mat.customProgramCacheKey = () => 'stage-billboard';
}

/**
 * A sea-of-cloud sheet: soft fbm cloud tops drifting in world space, lit brighter where the
 * cloud thickens toward the sun and greyer in its folds. Vertex alpha (from the mesh) thins it
 * where peaks break through. One material per site; its colour is set per light preset.
 */
export function cloudSheetMaterial(time: TimeUniform): THREE.MeshBasicMaterial {
	const mat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthWrite: false, vertexColors: true, fog: true, side: THREE.DoubleSide });
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = time;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', '#include <common>\nvarying vec3 vCW;')
			.replace('#include <begin_vertex>', '#include <begin_vertex>\nvCW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nuniform float uTime;\nvarying vec3 vCW;\n${NOISE}`)
			.replace(
				'#include <color_fragment>',
				`#include <color_fragment>
				vec2 cp = vCW.xz * 0.0024 + vec2(uTime * 0.004, uTime * 0.0016);
				float n = stNoise(cp) * 0.5 + stNoise(cp * 2.3 + 7.1) * 0.3 + stNoise(cp * 5.7 - 3.3) * 0.2;
				float n2 = stNoise(cp + vec2(0.06, 0.04)) * 0.5 + stNoise((cp + vec2(0.06, 0.04)) * 2.3 + 7.1) * 0.3 + stNoise((cp + vec2(0.06, 0.04)) * 5.7 - 3.3) * 0.2;
				float body = smoothstep(0.34, 0.66, n);
				float lit = clamp(0.82 + (n - n2) * 5.0, 0.62, 1.08);
				diffuseColor.rgb *= mix(vec3(0.74, 0.79, 0.88), vec3(1.0), smoothstep(0.35, 0.8, n)) * lit;
				diffuseColor.a *= body;`
			);
	};
	mat.customProgramCacheKey = () => 'stage-cloud-sheet';
	return mat;
}

/**
 * A sea of cloud as two stacked noise sheets over a disc round (cx, cz): thick between r0 and r1,
 * thinning where the ground rises through and fading softly at the outer rim.
 */
export function cloudSheets(
	mat: THREE.Material,
	height: (x: number, z: number) => number,
	o: { cx: number; cz: number; r0: number; r1: number; y: number; layers?: number; open?: (x: number, z: number) => number }
): THREE.Group {
	const group = new THREE.Group();
	group.name = 'cloud-sea';
	group.userData.layer = 'clouds';
	const layers = o.layers ?? 2;
	const R = o.r1;
	const rings = 48;
	const segs = 96;
	for (let l = 0; l < layers; l++) {
		const y = o.y + l * 9;
		const pos: number[] = [];
		const col: number[] = [];
		for (let i = 0; i <= rings; i++) {
			// rings packed toward the summit, where the detail shows
			const r = o.r0 * 0.6 + (R - o.r0 * 0.6) * Math.pow(i / rings, 1.8);
			for (let j = 0; j < segs; j++) {
				const a = (j / segs) * Math.PI * 2;
				const x = o.cx + Math.cos(a) * r;
				const z = o.cz + Math.sin(a) * r;
				const gap = y - height(x, z);
				let alpha = smoothstep(-2, 14, gap) * smoothstep(o.r0 * 0.6, o.r0, r) * (1 - smoothstep(R * 0.7, R, r));
				if (o.open) alpha *= 1 - o.open(x, z);
				pos.push(x, y + (l ? 0 : Math.sin(a * 3 + i) * 2), z);
				col.push(1, 1, 1, alpha * (l ? 0.7 : 1));
			}
		}
		const idx: number[] = [];
		for (let i = 0; i < rings; i++) {
			for (let j = 0; j < segs; j++) {
				const a = i * segs + j;
				const b2 = i * segs + ((j + 1) % segs);
				const c = a + segs;
				const d = b2 + segs;
				idx.push(a, c, b2, b2, c, d);
			}
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
		g.setIndex(idx);
		g.computeBoundingSphere();
		const mesh = new THREE.Mesh(g, mat);
		mesh.renderOrder = 2 + l;
		mesh.frustumCulled = false;
		group.add(mesh);
	}
	return group;
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

/**
 * Water that runs. River ribbons carry metres along the stream in uv.y and across it in uv.x, so the
 * ripples are carried downstream, faster mid-channel than at the banks, with long flow streaks and
 * glints on top. Ponds (uv 0) keep a slow two-layer drift. `time` is the water's own clock (it only
 * advances while the current runs); `flow` is the wind chop on top, 0..1.
 */
export function patchWater(mat: THREE.MeshStandardMaterial, time: TimeUniform, flow: TimeUniform = { value: 1 }): void {
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = time;
		sh.uniforms.uFlow = flow;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\nvarying vec2 vFlowUv;\nvarying vec3 vFlowW;`)
			.replace('#include <begin_vertex>', `#include <begin_vertex>\nvFlowUv = uv;\nvFlowW = (modelMatrix * vec4(transformed, 1.0)).xyz;`);
		sh.fragmentShader = sh.fragmentShader
			.replace('#include <common>', `#include <common>\nuniform float uTime;\nuniform float uFlow;\nvarying vec2 vFlowUv;\nvarying vec3 vFlowW;\n${NOISE}`)
			.replace(
				'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
				`float river = step(0.5, abs(vFlowUv.y) + abs(vFlowUv.x));
				float run = uTime * 1.6;
				vec2 down = river > 0.5 ? vec2(0.0, -run) * 0.06 : vec2(uTime * 0.009, uTime * 0.0055);
				vec2 baseUv = river > 0.5 ? vec2(vFlowUv.x, vFlowUv.y) * 0.06 : vNormalMapUv;
				vec3 mapN = normalize(
					(texture2D(normalMap, baseUv + down).xyz * 2.0 - 1.0) +
					(texture2D(normalMap, baseUv * 2.3 + down * 1.7 + vec2(0.31, 0.17)).xyz * 2.0 - 1.0) * 0.8 +
					(texture2D(normalMap, vFlowW.xz * 0.11 + vec2(-uTime * 0.03, uTime * 0.021)).xyz * 2.0 - 1.0) * (0.25 + 0.4 * uFlow)
				);`
			)
			.replace(
				'#include <color_fragment>',
				`#include <color_fragment>
				float riverF = step(0.5, abs(vFlowUv.y) + abs(vFlowUv.x));
				float flowRun = uTime * 1.6;
				float streak = stNoise(vec2(vFlowUv.x * 0.35, vFlowUv.y * 0.025 - flowRun * 0.025)) * stNoise(vec2(vFlowUv.x * 0.9 + 3.0, vFlowUv.y * 0.06 - flowRun * 0.06));
				float glint = smoothstep(0.62, 0.9, stNoise(vFlowW.xz * 0.35 + vec2(uTime * 0.4, -uTime * 0.25)));
				diffuseColor.rgb *= 0.92 + 0.16 * stNoise(vFlowW.xz * 0.008 + uTime * 0.002);
				diffuseColor.rgb += vec3(0.08, 0.1, 0.1) * smoothstep(0.35, 0.7, streak) * riverF + vec3(0.05) * glint;`
			);
	};
	mat.customProgramCacheKey = () => 'stage-water-flow';
}

/** World-space rise wave shared by every built material: the site grows up out of a flat plain. */
export type RiseUniforms = { uRise: TimeUniform; uRiseC: { value: THREE.Vector2 }; uRiseR: TimeUniform };

const RISE_GLSL = /* glsl */ `
uniform float uRise;
uniform vec2 uRiseC;
uniform float uRiseR;
float riseHash(vec2 p) { return fract(sin(dot(floor(p), vec2(12.9898, 78.233))) * 43758.5453); }
float riseK(vec2 xz) {
	float d = length(xz - uRiseC);
	float front = uRise * uRiseR * 1.25 / max(1.0 - uRise, 0.015);
	float band = uRiseR * 0.45 + front * 0.25;
	d += (riseHash(xz / 22.0) - 0.5) * band * 0.35;
	float k = clamp((front - d) / band, 0.0, 1.0);
	k = 1.0 - pow(1.0 - k, 3.0);
	return k + sin(k * 3.14159) * 0.06;
}
`;

/**
 * The build animation: everything rises out of the ground in a wave from the site's centre, walls
 * and halls segment by segment. Chains onto the material's own patch and replaces the projection.
 */
export function patchRise(mat: THREE.Material, rise: RiseUniforms): void {
	const prev = mat.onBeforeCompile;
	const prevKey = mat.customProgramCacheKey();
	mat.onBeforeCompile = (sh, r) => {
		prev.call(mat, sh, r);
		Object.assign(sh.uniforms, rise);
		sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\n${RISE_GLSL}`).replace(
			'#include <project_vertex>',
			`vec4 mvPosition = vec4( transformed, 1.0 );
			#ifdef USE_INSTANCING
				mvPosition = instanceMatrix * mvPosition;
			#endif
			mvPosition = modelMatrix * mvPosition;
			if (uRise < 1.0) mvPosition.y *= riseK(mvPosition.xz);
			mvPosition = viewMatrix * mvPosition;
			gl_Position = projectionMatrix * mvPosition;`
		);
	};
	mat.customProgramCacheKey = () => `${prevKey}|rise`;
}

/**
 * Trees and ground cover grow out of the ground when Nature turns on and sink back when it turns off:
 * each instance on its own beat, `delay` holding crowns back until their trunks are up.
 */
export function patchGrow(mat: THREE.Material, grow: TimeUniform, delay = 0, spread = 1): void {
	const prev = mat.onBeforeCompile;
	const prevKey = mat.customProgramCacheKey();
	mat.onBeforeCompile = (sh, r) => {
		prev.call(mat, sh, r);
		sh.uniforms.uGrow = grow;
		sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\nuniform float uGrow;`).replace(
			'#include <begin_vertex>',
			`#include <begin_vertex>
			vec3 gip = vec3(0.0);
			#ifdef USE_INSTANCING
				gip = instanceMatrix[3].xyz;
			#endif
			float gh = fract(sin(dot(gip.xz, vec2(12.9898, 78.233))) * 43758.5453);
			float gk = clamp((uGrow * 1.7 - gh * 0.55 - ${delay.toFixed(3)}) / 0.45, 0.0, 1.0);
			gk = 1.0 - pow(1.0 - gk, 3.0);
			float gs = gk + sin(gk * 3.14159) * 0.12;
			transformed.y *= gs;
			transformed.xz *= mix(${(1 - spread).toFixed(3)}, 1.0, gs);`
		);
	};
	mat.customProgramCacheKey = () => `${prevKey}|grow${delay.toFixed(2)}`;
}

/**
 * Banner cloth: free edge ripples in the wind, pinned at the pole (uv.x = 0) and the crossbar (uv.y = 1).
 * The wave runs along the cloth normal; with the wind off it only stirs.
 */
export function patchFlag(mat: THREE.Material, time: TimeUniform, wind: TimeUniform): void {
	const prev = mat.onBeforeCompile;
	const prevKey = mat.customProgramCacheKey();
	mat.onBeforeCompile = (sh, r) => {
		prev.call(mat, sh, r);
		sh.uniforms.uTime = time;
		sh.uniforms.uWind = wind;
		sh.vertexShader = sh.vertexShader.replace('#include <common>', `#include <common>\nuniform float uTime;\nuniform float uWind;`).replace(
			'#include <begin_vertex>',
			`#include <begin_vertex>
			vec3 fw = (modelMatrix * vec4(position, 1.0)).xyz;
			float pin = uv.x * (0.55 + 0.45 * (1.0 - uv.y));
			float fph = uTime * (1.6 + uWind * 3.4) - uv.x * 5.5 + fw.x * 0.09 + fw.z * 0.07;
			float amp = 0.06 + uWind * 0.32;
			transformed += objectNormal * (sin(fph) * amp + sin(fph * 2.3 + uv.y * 4.0) * amp * 0.3) * pin;
			transformed.y -= (1.0 - uWind) * 0.05 * uv.x;`
		);
	};
	mat.customProgramCacheKey = () => `${prevKey}|flag`;
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
	shrub: ['#64983f', '#73a648', '#5a8b3a', '#80b052', '#558238'],
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
		const g = new THREE.IcosahedronGeometry(r, 1);
		g.scale(1, 0.72, 1);
		g.translate(x, y, z);
		return g.index ? g.toNonIndexed() : g;
	});
	const g = mergeGeometries(parts, false)!;
	for (const p of parts) p.dispose();
	// rounded normals from the bush's centre, so it shades as one soft puff
	const pos = g.getAttribute('position');
	const nrm = new Float32Array(pos.count * 3);
	const v = new THREE.Vector3();
	for (let i = 0; i < pos.count; i++) {
		v.set(pos.getX(i), pos.getY(i) - 0.25, pos.getZ(i)).normalize();
		nrm.set([v.x, v.y, v.z], i * 3);
	}
	g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
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
	private tints: Record<CoverKind, (string | undefined)[]> = { grass: [], flowers: [], shrub: [], reed: [], rock: [], basalt: [], fruit: [] };
	private rand = rng(61);

	/** `tint` overrides the kind's palette for this one (a bloom-coloured shrub, a red rock). */
	add(kind: CoverKind, x: number, y: number, z: number, size: number, tint?: string): void {
		// tufts are thinned and grown: fewer, fuller clumps read softer and cost far less to draw
		if ((kind === 'grass' || kind === 'flowers') && this.rand() > 0.55) return;
		const s = kind === 'grass' || kind === 'flowers' ? size * 1.18 : size;
		this.items[kind].push(x, y, z, s, this.rand() * Math.PI * 2, this.rand());
		this.tints[kind].push(tint);
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
				color.set(this.tints[kind][i] ?? palette[Math.floor(c * palette.length) % palette.length]);
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
