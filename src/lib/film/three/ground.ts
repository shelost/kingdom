/**
 * The film's peninsula in three.js: one close window of real relief, the
 * border sites baked into a cell texture, and a shader that lights the ground
 * like a night map and lays each kingdom's colour only on the land, with its
 * frontier glowing. The cells' colours come in every frame as a small texture
 * (mapPlan.paintCells), so the founding blooms and the rise of the three are
 * one uniform upload, not a repaint.
 */
import * as THREE from 'three';
import { BORDER_SITES } from '$lib/borders';
import { fishEyeOf, setFishEye, type SheetBox } from '$lib/cosmos';
import { loadCosmos } from '$lib/cosmosLayer';
import { fieldGeometry } from '$lib/components/diagrams/three/scenes/map/reliefMesh';
import { toMapWorld } from '$lib/mapTerrain';
import { heightAt, loadWorldDem, metresWindow, type ReliefField } from '$lib/worldRelief';
import { arrowPoint, arrowReach, ARROWS, type MapShow } from '../mapPlan';

/** The sheet window the film flies over: the peninsula, Manchuria's edge and the straits. */
export const FILM_BOX: SheetBox = { x: 0, y: 100, w: 720, h: 720 };
/** Samples along each side of the window. */
const LONG = 1200;
/** Texels along each side of the cell texture. */
const CELLS = 1024;
/** World units per metre before the shot's own lift (about nine times true). */
export const METRE = 9e-5;
/** The sea floor sinks at this share of the land's scale. */
const SEA = 0.25;

export type Ground = {
	field: ReliefField;
	geometry: THREE.BufferGeometry;
	height: THREE.DataTexture;
	cells: THREE.DataTexture;
	sites: THREE.DataTexture;
	count: number;
	/** Ground height in world units (before lift) under a sheet point. */
	at(x: number, y: number): number;
	/** World position of a sheet point, at the ground and lifted by `lift`. */
	world(x: number, y: number, lift: number, above?: number): THREE.Vector3;
};

let pending: Promise<Ground> | null = null;

/** The ground, built once per page; the film warms it when it opens. */
export function loadGround(): Promise<Ground> {
	pending ??= Promise.all([loadCosmos(), loadWorldDem()]).then(([data, dem]) => {
		const was = fishEyeOf();
		setFishEye('off');
		try {
			return build(metresWindow(data, dem, FILM_BOX, LONG));
		} finally {
			setFishEye(was);
		}
	});
	pending.catch(() => (pending = null));
	return pending;
}

function build({ nx, ny, m }: { nx: number; ny: number; m: Float32Array }): Ground {
	const n = nx * ny;
	const h = new Float32Array(n);
	let minH = 0;
	let maxH = 0;
	for (let p = 0; p < n; p++) {
		h[p] = m[p] >= 0 ? m[p] * METRE : Math.max(m[p], -6000) * METRE * SEA;
		minH = Math.min(minH, h[p]);
		maxH = Math.max(maxH, h[p]);
	}
	const field: ReliefField = { key: 'film', scope: 'samhan', box: FILM_BOX, nx, ny, m, h, inside: null, abyss: null, minH, maxH };
	const geometry = fieldGeometry(field, 'circles', 2);

	// rows run south to north so texture v matches the mesh's uv (north is v = 1)
	const flipped = new Float32Array(n);
	for (let j = 0; j < ny; j++) flipped.set(m.subarray(j * nx, (j + 1) * nx), (ny - 1 - j) * nx);
	const height = new THREE.DataTexture(halfs(flipped), nx, ny, THREE.RedFormat, THREE.HalfFloatType);
	height.magFilter = THREE.LinearFilter;
	height.minFilter = THREE.LinearFilter;
	height.wrapS = height.wrapT = THREE.ClampToEdgeWrapping;
	height.needsUpdate = true;

	const cells = new THREE.DataTexture(cellIds(CELLS), CELLS, CELLS, THREE.RGFormat, THREE.UnsignedByteType);
	cells.magFilter = THREE.NearestFilter;
	cells.minFilter = THREE.NearestFilter;
	cells.needsUpdate = true;

	const count = BORDER_SITES.length;
	const s = new Float32Array(count * 4);
	BORDER_SITES.forEach((site, i) => s.set([site.x, site.y, site.r, 0], i * 4));
	const sites = new THREE.DataTexture(s, count, 1, THREE.RGBAFormat, THREE.FloatType);
	sites.magFilter = THREE.NearestFilter;
	sites.minFilter = THREE.NearestFilter;
	sites.needsUpdate = true;

	const at = (x: number, y: number) => heightAt(field, x, y);
	const world = (x: number, y: number, lift: number, above = 0) => {
		const [wx, wz] = toMapWorld(x, y);
		return new THREE.Vector3(wx, Math.max(0, at(x, y)) * lift + above, wz);
	};
	return { field, geometry, height, cells, sites, count, at, world };
}

function halfs(src: Float32Array): Uint16Array {
	const out = new Uint16Array(src.length);
	for (let i = 0; i < src.length; i++) out[i] = THREE.DataUtils.toHalfFloat(src[i]);
	return out;
}

/**
 * The nearest and second-nearest border site at every texel (1-based, 0 for
 * none): the shader settles the exact frontier between the two per pixel.
 */
function cellIds(size: number): Uint8Array {
	const out = new Uint8Array(size * size * 2);
	const B = 28;
	const buckets = new Map<string, number[]>();
	BORDER_SITES.forEach((s, i) => {
		const key = `${Math.floor(s.x / B)},${Math.floor(s.y / B)}`;
		const list = buckets.get(key);
		if (list) list.push(i);
		else buckets.set(key, [i]);
	});
	for (let r = 0; r < size; r++) {
		const y = FILM_BOX.y + (1 - (r + 0.5) / size) * FILM_BOX.h;
		const by = Math.floor(y / B);
		for (let c = 0; c < size; c++) {
			const x = FILM_BOX.x + ((c + 0.5) / size) * FILM_BOX.w;
			const bx = Math.floor(x / B);
			let a = -1;
			let b = -1;
			let da = Infinity;
			let db = Infinity;
			for (let ring = 0; ring < 9; ring++) {
				if (b >= 0 && (ring - 1) * B > db) break;
				for (let gy = by - ring; gy <= by + ring; gy++) {
					for (let gx = bx - ring; gx <= bx + ring; gx++) {
						if (Math.max(Math.abs(gx - bx), Math.abs(gy - by)) !== ring) continue;
						for (const i of buckets.get(`${gx},${gy}`) ?? []) {
							const s = BORDER_SITES[i];
							const d = Math.hypot(s.x - x, s.y - y);
							if (d < da) {
								b = a;
								db = da;
								a = i;
								da = d;
							} else if (d < db) {
								b = i;
								db = d;
							}
						}
					}
				}
			}
			// the shader clips each cell to its reach and settles the frontier per pixel
			const p = (r * size + c) * 2;
			out[p] = a + 1;
			out[p + 1] = b + 1;
		}
	}
	return out;
}

/* ── the ground shader ─────────────────────────────────────────── */

const VERT = /* glsl */ `
uniform float uLift;
varying vec2 vUv;
varying vec3 vWorld;
void main() {
	vUv = uv;
	vec3 p = position;
	p.y = max(p.y, 0.0) * uLift;
	vec4 w = modelMatrix * vec4(p, 1.0);
	vWorld = w.xyz;
	gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uH;
uniform sampler2D uCells;
uniform sampler2D uSites;
uniform sampler2D uState;
uniform vec4 uBox;
uniform float uTexel;
uniform float uMetre;
uniform float uLift;
uniform float uDay;
uniform vec3 uLight;
uniform vec3 uKey;
uniform vec3 uAmb;
uniform float uPaint;
uniform vec4 uGlow;
uniform vec3 uGlowColor;
uniform vec3 uFog;
uniform vec2 uFogRange;
uniform float uTime;
uniform vec3 uHole;
varying vec2 vUv;
varying vec3 vWorld;

float metres(vec2 uv) { return texture2D(uH, uv).r; }

void main() {
	vec2 sheet = uBox.xy + vec2(vUv.x, 1.0 - vUv.y) * uBox.zw;
	if (distance(sheet, uHole.xy) < uHole.z) discard;
	float m = metres(vUv);
	float e = uTexel;
	float span = 2.0 * e * uBox.z / 50.0;
	float k = uMetre * uLift * 2.6;
	float hx = max(metres(vUv + vec2(e, 0.0)), 0.0) - max(metres(vUv - vec2(e, 0.0)), 0.0);
	float hz = max(metres(vUv - vec2(0.0, e)), 0.0) - max(metres(vUv + vec2(0.0, e)), 0.0);
	vec3 n = normalize(vec3(-hx * k, span, -hz * k));
	float land = smoothstep(-6.0, 6.0, m);
	float diff = max(dot(n, uLight), 0.0);
	float alt = clamp(m / 2600.0, 0.0, 1.0);

	vec3 lowN = vec3(0.085, 0.11, 0.15);
	vec3 midN = vec3(0.15, 0.17, 0.21);
	vec3 highN = vec3(0.3, 0.31, 0.34);
	vec3 lowD = vec3(0.24, 0.33, 0.2);
	vec3 midD = vec3(0.42, 0.4, 0.29);
	vec3 highD = vec3(0.55, 0.5, 0.44);
	vec3 low = mix(lowN, lowD, uDay);
	vec3 mid = mix(midN, midD, uDay);
	vec3 high = mix(highN, highD, uDay);
	vec3 g = mix(low, mid, smoothstep(0.0, 0.3, alt));
	g = mix(g, high, smoothstep(0.3, 0.75, alt));
	float snow = smoothstep(1650.0, 2250.0, m + (n.y - 1.0) * 900.0);
	g = mix(g, mix(vec3(0.74, 0.8, 0.9), vec3(0.97, 0.97, 1.0), uDay), snow);
	vec3 lit = g * (uAmb + uKey * diff * 1.5);

	float depth = clamp(-m / 2600.0, 0.0, 1.0);
	vec3 seaN = mix(vec3(0.045, 0.085, 0.15), vec3(0.012, 0.025, 0.05), sqrt(depth));
	vec3 seaD = mix(vec3(0.16, 0.36, 0.5), vec3(0.05, 0.14, 0.28), sqrt(depth));
	vec3 sea = mix(seaN, seaD, uDay);
	vec3 col = mix(sea, lit, land);
	float coast = 1.0 - abs(land * 2.0 - 1.0);
	col += mix(vec3(0.3, 0.45, 0.66), vec3(0.9, 0.95, 1.0), uDay) * coast * 0.4;

	vec2 ids = texture2D(uCells, vUv).rg * 255.0;
	int a = int(ids.r + 0.5) - 1;
	int b = int(ids.g + 0.5) - 1;
	if (uPaint > 0.5 && (a >= 0 || b >= 0)) {
		if (a < 0) { a = b; b = -1; }
		vec4 sa = texelFetch(uSites, ivec2(a, 0), 0);
		vec4 sb = b >= 0 ? texelFetch(uSites, ivec2(b, 0), 0) : vec4(1e5, 1e5, 0.0, 0.0);
		float da = distance(sheet, sa.xy);
		float db = distance(sheet, sb.xy);
		int id = a;
		int other = b;
		vec4 me = sa;
		vec4 them = sb;
		float d = da;
		if (b >= 0 && db < da) { id = b; other = a; me = sb; them = sa; d = db; }
		vec2 dir = them.xy - me.xy;
		float L = max(length(dir), 1e-3);
		float bis = other >= 0 ? L * 0.5 - dot(sheet - me.xy, dir) / L : 1e5;
		float toReach = me.z - d;
		vec4 st = texelFetch(uState, ivec2(id, 0), 0);
		vec4 s2 = texelFetch(uState, ivec2(id, 1), 0);
		float og = other >= 0 ? texelFetch(uState, ivec2(other, 1), 0).z : -1.0;
		float oa = other >= 0 ? texelFetch(uState, ivec2(other, 0), 0).a : 0.0;
		bool seam = abs(og - s2.z) > 0.5 || oa < 0.04;
		float edge = min(toReach, seam ? bis : 1e5);
		float inside = smoothstep(-0.4, 0.4, toReach);
		float bloom = s2.x < 0.0 ? 1.0 : 1.0 - smoothstep(s2.x - 1.6, s2.x, d);
		float alpha = st.a * inside * bloom * land;
		float rim = 1.0 - smoothstep(0.0, 7.0, edge);
		float line = 1.0 - smoothstep(0.2, 0.9, edge);
		vec3 kc = st.rgb;
		vec3 tint = kc * (0.5 + 0.9 * diff);
		col = mix(col, tint, alpha * (0.5 + 0.35 * rim));
		col += kc * alpha * line * 0.85;
		float front = s2.x < 0.0 ? 0.0 : (1.0 - smoothstep(0.0, 3.0, abs(d - s2.x))) * s2.y;
		col += (kc * 0.8 + 0.25) * front * land * inside * st.a;
		col += kc * s2.y * 0.18 * alpha;
	}

	float gd = distance(sheet, uGlow.xy) / max(uGlow.z, 1.0);
	col += uGlowColor * uGlow.w * exp(-gd * gd * 2.4) * land * 0.42;

	float dist = distance(cameraPosition, vWorld);
	col = mix(col, uFog, smoothstep(uFogRange.x, uFogRange.y, dist));
	float frame = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
	col = mix(uFog, col, smoothstep(0.0, 0.07, frame));
	gl_FragColor = vec4(col, 1.0);
}`;

export type GroundLook = 'night' | 'dusk';

/** The ground's material. `state` is the per-cell paint texture the scene refreshes each frame. */
export function groundMaterial(g: Ground, state: THREE.DataTexture): THREE.ShaderMaterial {
	return new THREE.ShaderMaterial({
		vertexShader: VERT,
		fragmentShader: FRAG,
		uniforms: {
			uH: { value: g.height },
			uCells: { value: g.cells },
			uSites: { value: g.sites },
			uState: { value: state },
			uBox: { value: new THREE.Vector4(FILM_BOX.x, FILM_BOX.y, FILM_BOX.w, FILM_BOX.h) },
			uTexel: { value: 1 / (g.field.nx - 1) },
			uMetre: { value: METRE },
			uLift: { value: 1.7 },
			uDay: { value: 0 },
			uLight: { value: new THREE.Vector3(-0.55, 0.62, -0.56).normalize() },
			uKey: { value: new THREE.Color('#9fb6dc') },
			uAmb: { value: new THREE.Color('#2a3448') },
			uPaint: { value: 0 },
			uGlow: { value: new THREE.Vector4(0, 0, 1, 0) },
			uGlowColor: { value: new THREE.Color('#ffffff') },
			uFog: { value: new THREE.Color('#06080f') },
			uFogRange: { value: new THREE.Vector2(14, 34) },
			uTime: { value: 0 },
			uHole: { value: new THREE.Vector3(0, 0, 0) }
		}
	});
}

/** Night over the map; a gold dusk under the falling chariot. */
export function setLook(mat: THREE.ShaderMaterial, look: GroundLook): void {
	const u = mat.uniforms;
	if (look === 'night') {
		u.uDay.value = 0;
		u.uLight.value.set(-0.55, 0.62, -0.56).normalize();
		u.uKey.value.set('#9fb6dc');
		u.uAmb.value.set('#2a3448');
		u.uFog.value.set('#06080f');
	} else {
		u.uDay.value = 0.85;
		u.uLight.value.set(-0.75, 0.42, 0.3).normalize();
		u.uKey.value.set('#ffd6a0');
		u.uAmb.value.set('#55617e');
		u.uFog.value.set('#d9b7a4');
	}
}

/* ── refugee arrows ────────────────────────────────────────────── */

const ARROW_STEPS = 48;

/** The arrows out of the fallen capital as glowing ribbons laid over the ground, drawn as far as the shot says. */
export function arrowLayer(g: Ground) {
	const per = (ARROW_STEPS + 1) * 2 + 3;
	const pos = new Float32Array(ARROWS.length * per * 3);
	const col = new Float32Array(ARROWS.length * per * 3);
	const idx: number[] = [];
	for (let a = 0; a < ARROWS.length; a++) {
		const o = a * per;
		for (let s = 0; s < ARROW_STEPS; s++) {
			const p = o + s * 2;
			idx.push(p, p + 1, p + 2, p + 1, p + 3, p + 2);
		}
		const h = o + (ARROW_STEPS + 1) * 2;
		idx.push(h, h + 1, h + 2);
	}
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
	geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
	geo.setIndex(idx);
	const mesh = new THREE.Mesh(
		geo,
		new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
	);
	mesh.frustumCulled = false;
	mesh.renderOrder = 2;
	const warm = new THREE.Color('#ffd9a0');
	const put = (i: number, v: THREE.Vector3, glow: number) => {
		pos[i * 3] = v.x;
		pos[i * 3 + 1] = v.y;
		pos[i * 3 + 2] = v.z;
		col[i * 3] = warm.r * glow;
		col[i * 3 + 1] = warm.g * glow;
		col[i * 3 + 2] = warm.b * glow;
	};
	const side = new THREE.Vector3();
	return {
		mesh,
		update(map: MapShow, lift: number) {
			const width = 0.05;
			for (let a = 0; a < ARROWS.length; a++) {
				const reach = arrowReach(map, a);
				const o = a * per;
				const pts: THREE.Vector3[] = [];
				for (let s = 0; s <= ARROW_STEPS; s++) {
					const [x, y] = arrowPoint(a, (s / ARROW_STEPS) * reach * 0.94);
					pts.push(g.world(x, y, lift, 0.035));
				}
				for (let s = 0; s <= ARROW_STEPS; s++) {
					const p = pts[s];
					const q = pts[Math.min(ARROW_STEPS, s + 1)];
					const r = pts[Math.max(0, s - 1)];
					side.set(-(q.z - r.z), 0, q.x - r.x).normalize();
					const u = s / ARROW_STEPS;
					const w = reach > 0.001 ? width * (0.35 + 0.65 * u) : 0;
					const glow = reach > 0.001 ? 0.25 + 0.95 * u : 0;
					put(o + s * 2, p.clone().addScaledVector(side, w), glow);
					put(o + s * 2 + 1, p.clone().addScaledVector(side, -w), glow);
				}
				const [tx, ty] = arrowPoint(a, reach);
				const tip = g.world(tx, ty, lift, 0.035);
				const end = pts[ARROW_STEPS];
				const back = pts[ARROW_STEPS - 4];
				side.set(-(end.z - back.z), 0, end.x - back.x).normalize();
				const hw = reach > 0.001 ? width * 2.6 : 0;
				const h = o + (ARROW_STEPS + 1) * 2;
				put(h, end.clone().addScaledVector(side, hw), 1.3);
				put(h + 1, end.clone().addScaledVector(side, -hw), 1.3);
				put(h + 2, reach > 0.001 ? tip : end, 1.5);
			}
			geo.attributes.position.needsUpdate = true;
			geo.attributes.color.needsUpdate = true;
		}
	};
}
