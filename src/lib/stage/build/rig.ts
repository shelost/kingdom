import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { TimeUniform } from './nature';

/**
 * Shared toy-miniature rig for the stage's people and boats. Every figure or hull is one merged
 * geometry painted in vertex colour (a soft top-lit gradient per piece, the hand-painted look), and
 * each vertex knows which limb it belongs to and the joint it swings about. One vertex shader then
 * walks the legs, swings the arms, turns the heads, waves the banners and pulls the oars, driven by
 * one clock and a per-instance phase, so a whole crowd is a handful of draw calls.
 */

/** Which joint a vertex swings about. */
export const PART = { body: 0, legL: 1, legR: 2, armL: 3, armR: 4, head: 5, flag: 6, oar: 7, skirt: 8, oarR: 9 } as const;

export type V3 = [number, number, number];

/** Colour a vertex from its position (stripes, lamellae, borders). */
export type Paint = (x: number, y: number, z: number, out: THREE.Color) => void;

export type PieceOpts = {
	part?: number;
	pivot?: V3;
	/** How much darker the bottom of the piece is than its top (0 = flat colour). */
	grad?: number;
	/** 1: this cloth takes the per-instance colour (robe rank, coat, hull); a function picks per vertex. */
	tint?: number | ((x: number, y: number, z: number) => number);
};

const tmpC = new THREE.Color();
const baseC = new THREE.Color();

/** Paint a positioned primitive and tag it with its rig joint, ready to merge. */
export function piece(g: THREE.BufferGeometry, color: THREE.ColorRepresentation | Paint, o: PieceOpts = {}): THREE.BufferGeometry {
	for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
	if (!g.getAttribute('normal')) g.computeVertexNormals();
	const pos = g.getAttribute('position');
	const n = pos.count;
	if (!g.index) g.setIndex(Array.from({ length: n }, (_, i) => i));
	g.computeBoundingBox();
	const bb = g.boundingBox as THREE.Box3;
	const span = bb.max.y - bb.min.y || 1;
	const grad = o.grad ?? 0.22;
	const fn = typeof color === 'function' ? color : null;
	if (!fn) baseC.set(color as THREE.ColorRepresentation);
	const col = new Float32Array(n * 3);
	const rig = new Float32Array(n * 4);
	const tintFn = typeof o.tint === 'function' ? o.tint : null;
	const tint = new Float32Array(n).fill(typeof o.tint === 'number' ? o.tint : 0);
	const pv = o.pivot ?? [0, 0, 0];
	for (let i = 0; i < n; i++) {
		const x = pos.getX(i);
		const y = pos.getY(i);
		const z = pos.getZ(i);
		if (fn) fn(x, y, z, tmpC);
		else tmpC.copy(baseC);
		const k = 1 - grad + grad * 1.18 * ((y - bb.min.y) / span);
		col[i * 3] = tmpC.r * k;
		col[i * 3 + 1] = tmpC.g * k;
		col[i * 3 + 2] = tmpC.b * k;
		if (tintFn) tint[i] = tintFn(x, y, z);
		rig[i * 4] = o.part ?? PART.body;
		rig[i * 4 + 1] = pv[0];
		rig[i * 4 + 2] = pv[1];
		rig[i * 4 + 3] = pv[2];
	}
	g.setAttribute('color', new THREE.BufferAttribute(col, 3));
	g.setAttribute('aRig', new THREE.BufferAttribute(rig, 4));
	g.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));
	return g;
}

/** Merge painted pieces into one geometry and free the pieces. */
export function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
	const g = mergeGeometries(parts, false);
	for (const p of parts) p.dispose();
	if (!g) throw new Error('rig: pieces do not share attributes');
	g.computeBoundingSphere();
	return g;
}

/* ------------------------------------------------------------------ primitives (all rounded) */

/** An ellipsoid blob centred at (x, y, z). */
export function blob(rx: number, ry: number, rz: number, x: number, y: number, z: number, seg = 10): THREE.BufferGeometry {
	const g = new THREE.SphereGeometry(1, seg, Math.max(4, Math.round(seg * 0.7)));
	g.scale(rx, ry, rz);
	g.translate(x, y, z);
	return g;
}

/**
 * A turned profile of [radius, y] points (torsos, skirts, robes, caps, helms). `phi` 0 is the front
 * (+z); a partial sweep makes neck guards that leave the face open.
 */
export function lathe(profile: [number, number][], seg = 12, phiStart = 0, phiLength = Math.PI * 2): THREE.BufferGeometry {
	return new THREE.LatheGeometry(
		profile.map(([r, y]) => new THREE.Vector2(Math.max(0.0005, r), y)),
		seg,
		phiStart,
		phiLength
	);
}

/** Soft pleats or lamellar ripple on a turned shape: radius wobbles `count` times round, fading toward `top`. */
export function pleat(g: THREE.BufferGeometry, count: number, amp: number, bottom: number, top: number): THREE.BufferGeometry {
	const pos = g.getAttribute('position');
	for (let i = 0; i < pos.count; i++) {
		const x = pos.getX(i);
		const y = pos.getY(i);
		const z = pos.getZ(i);
		const t = Math.min(1, Math.max(0, (y - bottom) / (top - bottom || 1)));
		const k = 1 + amp * Math.cos(Math.atan2(z, x) * count) * (1 - t);
		pos.setXYZ(i, x * k, y, z * k);
	}
	g.computeVertexNormals();
	return g;
}

/** A capsule (rounded limb) from point a to point b. */
export function limb(r: number, a: V3, b: V3, seg = 8, rb = r): THREE.BufferGeometry {
	const va = new THREE.Vector3(...a);
	const vb = new THREE.Vector3(...b);
	const len = va.distanceTo(vb);
	const g = rb === r ? new THREE.CapsuleGeometry(r, Math.max(0.001, len), 3, seg) : lathe(taper(r, rb, len), seg);
	if (rb !== r) g.translate(0, -len / 2, 0);
	const dir = vb.clone().sub(va).normalize();
	const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
	g.applyQuaternion(q);
	const mid = va.add(vb).multiplyScalar(0.5);
	g.translate(mid.x, mid.y, mid.z);
	return g;
}

/** A rounded tapering tube profile, top radius `r0`, bottom `r1`, `len` long (y 0..len). */
function taper(r0: number, r1: number, len: number): [number, number][] {
	return [
		[0, 0],
		[r0 * 0.7, 0.01],
		[r0, len * 0.08],
		[(r0 + r1) / 2, len * 0.5],
		[r1, len * 0.92],
		[r1 * 0.7, len - 0.01],
		[0, len]
	];
}

/** A straight cylinder from a to b (spears, masts, oars, yards). */
export function rod(r: number, a: V3, b: V3, seg = 6): THREE.BufferGeometry {
	const va = new THREE.Vector3(...a);
	const vb = new THREE.Vector3(...b);
	const g = new THREE.CylinderGeometry(r, r, Math.max(0.001, va.distanceTo(vb)), seg, 1);
	g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize()));
	const mid = va.add(vb).multiplyScalar(0.5);
	g.translate(mid.x, mid.y, mid.z);
	return g;
}

/* ------------------------------------------------------------------ material */

export type RigUniforms = {
	time: TimeUniform;
	/** 0..1: the group popping in (figures) when its switch turns on. */
	show: TimeUniform;
};

const RIG_GLSL = /* glsl */ `
attribute vec4 aRig;
attribute float aTint;
attribute vec4 aFolk;
attribute vec3 aCloth;
uniform float uTime;
uniform float uShow;
mat3 rigX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rigY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
`;

/**
 * Painted-toy material for a rig. Figures (`figure: true`) walk on `aFolk` = (phase, gait 0 idle..1 walk,
 * cadence rad/s, pop delay) and pop in with `show`; hulls only wave flags and pull oars (gait = rowing).
 */
export function rigMaterial(u: RigUniforms, key: string, o: { figure: boolean; side?: THREE.Side; rim?: number }): THREE.MeshStandardMaterial {
	const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0, side: o.side ?? THREE.FrontSide });
	mat.userData.owned = true;
	if (o.figure) mat.defines = { RIG_FIGURE: '' };
	const rim = (o.rim ?? 0.28).toFixed(3);
	mat.onBeforeCompile = (sh) => {
		sh.uniforms.uTime = u.time;
		sh.uniforms.uShow = u.show;
		sh.vertexShader = sh.vertexShader
			.replace('#include <common>', `#include <common>\n${RIG_GLSL}`)
			.replace('#include <color_vertex>', `#include <color_vertex>\nvColor.rgb *= mix(vec3(1.0), aCloth, aTint);`)
			.replace(
				'#include <beginnormal_vertex>',
				`#include <beginnormal_vertex>
				float rPart = aRig.x;
				vec3 rPiv = aRig.yzw;
				float rGait = aFolk.y;
				float rT = uTime * aFolk.z + aFolk.x;
				float rS = sin(rT);
				vec3 rN0 = objectNormal;
				mat3 rM = mat3(1.0);
				if (rPart > 0.5 && rPart < 2.5) {
					rM = rigX(rS * 0.6 * rGait * (rPart < 1.5 ? 1.0 : -1.0));
				} else if (rPart > 2.5 && rPart < 4.5) {
					float sg = rPart < 3.5 ? -1.0 : 1.0;
					rM = rigX(rS * 0.5 * rGait * sg + sin(uTime * 0.9 + aFolk.w * 7.0 + sg) * 0.05 * (1.0 - rGait));
				} else if (rPart > 4.5 && rPart < 5.5) {
					rM = rigY(sin(uTime * 0.31 + aFolk.w * 11.0) * 0.4 * (1.0 - rGait)) * rigX(sin(uTime * 0.23 + aFolk.w * 5.0) * 0.06);
				} else if (rPart > 6.5 && rPart < 7.5) {
					rM = rigY(rS * 0.38 * rGait);
				} else if (rPart > 7.5 && rPart < 8.5) {
					rM = rigX(rS * 0.06 * rGait);
				} else if (rPart > 8.5) {
					rM = rigY(-rS * 0.38 * rGait);
				}
				objectNormal = rM * objectNormal;`
			)
			.replace(
				'#include <begin_vertex>',
				`#include <begin_vertex>
				transformed = rM * (transformed - rPiv) + rPiv;
				if (rPart > 5.5 && rPart < 6.5) {
					float fd = length(position.xz - rPiv.xz);
					transformed += rN0 * (sin(uTime * 3.1 - fd * 3.2 + aFolk.x) * 0.16 + sin(uTime * 5.3 - fd * 6.0) * 0.05) * fd;
				}
				if ((rPart > 6.5 && rPart < 7.5) || rPart > 8.5) {
					transformed.y += cos(rT) * 0.08 * rGait * length(position.xz - rPiv.xz);
				}
				#ifdef RIG_FIGURE
					if (rPart < 6.5) {
						transformed.y += (1.0 - abs(rS)) * 0.045 * rGait;
						transformed.x += sin(uTime * 0.7 + aFolk.w * 9.0) * 0.012 * position.y * (1.0 - rGait);
						transformed.z += rGait * 0.05 * position.y;
					}
					float rK = clamp(uShow * 1.6 - aFolk.w * 0.6, 0.0, 1.0);
					rK = rK * rK * (3.0 - 2.0 * rK);
					transformed *= rK;
					transformed.y += sin(rK * 3.14159) * 0.35;
				#endif`
			);
		sh.fragmentShader = sh.fragmentShader.replace(
			'#include <emissivemap_fragment>',
			`#include <emissivemap_fragment>
			float rRim = 1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
			totalEmissiveRadiance += diffuseColor.rgb * pow(rRim, 3.0) * ${rim};`
		);
	};
	mat.customProgramCacheKey = () => `stage-rig-${key}-${o.figure ? 'f' : 'h'}`;
	return mat;
}

let blobTex: THREE.CanvasTexture | null = null;

/** The soft round contact shadow under every figure and hull (one tiny texture, kept for the session). */
function contactTexture(): THREE.CanvasTexture {
	if (blobTex) return blobTex;
	const c = document.createElement('canvas');
	c.width = c.height = 64;
	const g = c.getContext('2d') as CanvasRenderingContext2D;
	const r = g.createRadialGradient(32, 32, 2, 32, 32, 31);
	r.addColorStop(0, 'rgba(0,0,0,1)');
	r.addColorStop(0.45, 'rgba(0,0,0,0.6)');
	r.addColorStop(1, 'rgba(0,0,0,0)');
	g.fillStyle = r;
	g.fillRect(0, 0, 64, 64);
	blobTex = new THREE.CanvasTexture(c);
	return blobTex;
}

/** Contact-shadow material; figures' discs pop with them. */
export function contactMaterial(u: RigUniforms, opacity: number, figure: boolean): THREE.MeshBasicMaterial {
	const mat = new THREE.MeshBasicMaterial({ map: contactTexture(), color: '#1d140c', transparent: true, opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
	mat.userData.owned = true;
	mat.userData.contact = true;
	if (figure) {
		mat.onBeforeCompile = (sh) => {
			sh.uniforms.uShow = u.show;
			sh.vertexShader = sh.vertexShader
				.replace('#include <common>', `#include <common>\nattribute vec4 aFolk;\nuniform float uShow;`)
				.replace('#include <begin_vertex>', `#include <begin_vertex>\ntransformed *= clamp(uShow * 1.6 - aFolk.w * 0.6, 0.0, 1.0);`);
		};
		mat.customProgramCacheKey = () => 'stage-rig-contact-f';
	}
	return mat;
}

/** A flat disc on the ground for the contact shadow, `rx` by `rz`. */
export function contactDisc(rx: number, rz: number, y = 0.03): THREE.BufferGeometry {
	const g = new THREE.PlaneGeometry(rx * 2, rz * 2);
	g.rotateX(-Math.PI / 2);
	g.translate(0, y, 0);
	return g;
}

/**
 * Finds the camera each frame without the scene handing it over: an empty mesh that is always
 * "drawn" and records where the camera stood. Used for distance culling of crowds and fleets.
 */
export function cameraProbe(): { mesh: THREE.Mesh; pos: THREE.Vector3; seen: () => boolean } {
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
	geo.setDrawRange(0, 0);
	const mat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
	mat.userData.owned = true;
	const mesh = new THREE.Mesh(geo, mat);
	mesh.frustumCulled = false;
	mesh.name = 'camera-probe';
	const pos = new THREE.Vector3(0, 1e6, 0);
	let seen = false;
	mesh.onBeforeRender = (_r, _s, camera) => {
		pos.setFromMatrixPosition(camera.matrixWorld);
		seen = true;
	};
	return { mesh, pos, seen: () => seen };
}
