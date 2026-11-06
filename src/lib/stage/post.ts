import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';

/** Colour grade applied after tone mapping, in display space. */
export type Look = {
	bloom: number;
	bloomRadius: number;
	/** Display-space luma (0–1) where bloom begins; the sky sits just under it so only lamps and glints glow. */
	threshold: number;
	saturation: number;
	contrast: number;
	/** Multipliers for the darks and the lights (split toning). */
	shadows: string;
	highlights: string;
	vignette: number;
	/** Posterize bands. 0 leaves the grade continuous. */
	steps?: number;
	/** Ink edge strength. 0 leaves silhouettes unlined. */
	ink?: number;
	/** Luma-gradient where ink begins (higher = fewer fine strokes). */
	inkLo?: number;
	/** Luma-gradient where ink is full. */
	inkHi?: number;
	/** Lift the darks toward the shadow colour. 0 leaves the contrast alone. */
	wrap?: number;
	/** Ambient occlusion in the creases: eaves, tree feet, wall bases. 0 skips the pass. */
	ao?: number;
	/** Film grain. */
	grain?: number;
	/** Watercolour paper: grain, wobble and pigment pooling at edges. */
	paper?: number;
	/** Ink-wash monochrome: 1 paints the frame in sumi tones on paper. */
	mono?: number;
	/** Tilt-shift: the top and bottom of the frame fall out of focus, like a model. */
	tilt?: number;
};

export type StageStyle = 'natural' | 'pixar' | 'film' | 'watercolor' | 'manga' | 'ink' | 'diorama';

export const STAGE_LOOKS: { id: StageStyle; en: string; ko: string; icon: string }[] = [
	{ id: 'natural', en: 'Natural', ko: '자연광', icon: 'wb_sunny' },
	{ id: 'pixar', en: 'Pixar', ko: '픽사', icon: 'animation' },
	{ id: 'film', en: 'Film', ko: '영화', icon: 'movie' },
	{ id: 'watercolor', en: 'Watercolor', ko: '수채화', icon: 'brush' },
	{ id: 'manga', en: 'Manga', ko: '만화', icon: 'draw' },
	{ id: 'ink', en: 'Ink wash', ko: '수묵', icon: 'ink_pen' },
	{ id: 'diorama', en: 'Diorama', ko: '미니어처', icon: 'center_focus_strong' }
];

const PLAIN = { steps: 0, ink: 0, wrap: 0, ao: 0, grain: 0, paper: 0, mono: 0, tilt: 0 };

/** Every look restyles the time-of-day grade without rebuilding the site. */
export function composeLook(base: Look, style: StageStyle): Look {
	const b = { ...base, ...PLAIN };
	switch (style) {
		case 'natural':
			return { ...b, saturation: base.saturation * 1.04, wrap: 0.08, ao: 1, grain: 0.012 };
		case 'pixar':
			return {
				...b,
				bloom: base.bloom + 0.1,
				bloomRadius: 0.5,
				saturation: base.saturation * 1.12,
				contrast: 1.05,
				shadows: '#ffd9b8',
				highlights: '#fff6ea',
				vignette: 0.1,
				wrap: 0.26,
				ao: 1.25
			};
		case 'film':
			return {
				...b,
				saturation: base.saturation * 0.9,
				contrast: base.contrast * 1.1,
				shadows: '#c9dcec',
				highlights: '#ffe4c4',
				vignette: Math.max(base.vignette, 0.32),
				wrap: 0.1,
				ao: 0.85,
				grain: 0.055
			};
		case 'watercolor':
			return {
				...b,
				bloom: 0,
				saturation: base.saturation * 0.8,
				contrast: 0.94,
				shadows: '#d6dcea',
				highlights: '#fffaf0',
				vignette: 0.1,
				steps: 8,
				ink: 0.22,
				inkLo: 0.07,
				inkHi: 0.3,
				wrap: 0.16,
				ao: 0.7,
				paper: 1
			};
		case 'manga':
			return {
				...b,
				bloom: Math.min(base.bloom, 0.1),
				bloomRadius: 0.22,
				saturation: 0.62,
				contrast: Math.max(base.contrast, 1.22),
				shadows: '#1c2433',
				highlights: '#f6f1e4',
				vignette: Math.max(base.vignette * 0.85, 0.22),
				steps: 4,
				ink: 0.42,
				inkLo: 0.08,
				inkHi: 0.24,
				ao: 0.9
			};
		case 'ink':
			return {
				...b,
				bloom: 0,
				saturation: 0,
				contrast: 1.2,
				shadows: '#ffffff',
				highlights: '#ffffff',
				vignette: 0.24,
				steps: 5,
				ink: 0.7,
				inkLo: 0.05,
				inkHi: 0.2,
				ao: 1.1,
				paper: 0.75,
				mono: 1
			};
		case 'diorama':
			return { ...b, saturation: base.saturation * 1.26, contrast: base.contrast * 1.08, vignette: 0.22, ao: 1.15, tilt: 1 };
	}
}

const GradeShader = {
	uniforms: {
		tDiffuse: { value: null as THREE.Texture | null },
		uSat: { value: 1 },
		uContrast: { value: 1 },
		uShadow: { value: new THREE.Color(1, 1, 1) },
		uHigh: { value: new THREE.Color(1, 1, 1) },
		uVignette: { value: 0.2 },
		uAspect: { value: 1 },
		uRes: { value: new THREE.Vector2(1, 1) },
		uTime: { value: 0 },
		uSteps: { value: 0 },
		uInk: { value: 0 },
		uInkLo: { value: 0.03 },
		uInkHi: { value: 0.16 },
		uWrap: { value: 0 },
		uGrain: { value: 0 },
		uPaper: { value: 0 },
		uMono: { value: 0 }
	},
	vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}`,
	fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
		uniform float uSat;
		uniform float uContrast;
		uniform vec3 uShadow;
		uniform vec3 uHigh;
		uniform float uVignette;
		uniform float uAspect;
		uniform vec2 uRes;
		uniform float uTime;
		uniform float uSteps;
		uniform float uInk;
		uniform float uInkLo;
		uniform float uInkHi;
		uniform float uWrap;
		uniform float uGrain;
		uniform float uPaper;
		uniform float uMono;
		varying vec2 vUv;

		float hash(vec2 p) {
			return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
		}
		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			f = f * f * (3.0 - 2.0 * f);
			return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
		}
		float fbm(vec2 p) {
			float v = 0.0;
			float a = 0.5;
			for (int i = 0; i < 4; i++) {
				v += a * noise(p);
				p *= 2.03;
				a *= 0.5;
			}
			return v;
		}

		void main() {
			vec2 px = vUv * uRes;
			// watercolour wobble: the image drifts a little on the paper fibres
			vec2 wob = (vec2(fbm(px / 70.0), fbm(px / 70.0 + 9.1)) - 0.5) * uPaper * 3.0 / uRes;
			vec4 c = texture2D(tDiffuse, vUv + wob);
			vec3 col = c.rgb;
			float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
			float edge = length(vec2(dFdx(l), dFdy(l)));
			col = mix(vec3(l), col, uSat);
			col = (col - 0.5) * uContrast + 0.5;
			col *= mix(uShadow, uHigh, smoothstep(0.05, 0.85, l));
			// sumi: luma becomes ink density on warm paper
			float lm = clamp((l - 0.5) * uContrast + 0.5, 0.0, 1.0);
			vec3 sumi = mix(vec3(0.07, 0.07, 0.08), vec3(0.95, 0.92, 0.85), smoothstep(0.0, 1.0, lm));
			col = mix(col, sumi, uMono);
			if (uSteps > 1.5) col = mix(col, floor(col * uSteps + 0.5) / uSteps, 1.0 - 0.45 * uPaper);
			col *= 1.0 - uInk * smoothstep(uInkLo, uInkHi, edge);
			float l1 = dot(col, vec3(0.2126, 0.7152, 0.0722));
			col = mix(col, col * 0.62 + uShadow * 0.38, uWrap * (1.0 - smoothstep(0.18, 0.72, l1)));
			// paper tooth and pigment pooling along the edges
			float tooth = fbm(px / 2.2) * 0.6 + fbm(px / 24.0) * 0.4;
			col *= mix(1.0, 0.9 + 0.12 * tooth, uPaper);
			col *= 1.0 - uPaper * 0.22 * smoothstep(0.015, 0.1, edge);
			vec2 d = (vUv - 0.5) * vec2(uAspect, 1.0);
			float v = smoothstep(0.35, 1.05, length(d) * 1.15);
			col *= 1.0 - uVignette * v;
			col += (hash(px + fract(uTime) * 917.0) - 0.5) * uGrain;
			gl_FragColor = vec4(clamp(col, 0.0, 1.0), c.a);
		}`
};

/** GTAO that skips see-through sheets (mist, clouds, sprites), so the creases come from the solid world. */
class StageAO extends GTAOPass {
	/** Replaces three's own pass, which hides only points and lines; `_restoreVisibility` shows them again. */
	_overrideVisibility(): void {
		const cache = (this as unknown as { _visibilityCache: THREE.Object3D[] })._visibilityCache;
		this.scene.traverseVisible((o) => {
			const any = o as THREE.Mesh & THREE.Points & THREE.Line & THREE.Sprite;
			const mat = any.material as THREE.Material | THREE.Material[] | undefined;
			const see = !!mat && (Array.isArray(mat) ? mat.some((m) => m.transparent) : mat.transparent);
			if (any.isPoints || any.isLine || any.isSprite || see) cache.push(o);
		});
		for (const o of cache) o.visible = false;
	}
}

/** The stage's post chain: MSAA scene render, ambient occlusion, tone mapping, bloom, tilt-shift, grade. */
export class Post {
	readonly composer: EffectComposer;
	private target: THREE.WebGLRenderTarget;
	private renderPass: RenderPass;
	private ao: StageAO;
	private bloom: UnrealBloomPass;
	private tiltH: ShaderPass;
	private tiltV: ShaderPass;
	private grade: ShaderPass;
	private tilt = 0;
	private aoK = 0;
	private clock = 0;
	/** Hold the occlusion while the land is still rising: its depth pass does not see the rise. */
	paused = false;

	constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
		const size = renderer.getDrawingBufferSize(new THREE.Vector2());
		this.target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4 });
		this.composer = new EffectComposer(renderer, this.target);
		this.renderPass = new RenderPass(scene, camera);
		this.ao = new StageAO(scene, camera, size.x / 2, size.y / 2);
		this.ao.updateGtaoMaterial({ radius: 5, distanceExponent: 1, thickness: 3, scale: 1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
		this.ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 12 });
		this.ao.enabled = false;
		this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.3, 0.6, 0.95);
		this.tiltH = new ShaderPass(HorizontalTiltShiftShader);
		this.tiltV = new ShaderPass(VerticalTiltShiftShader);
		this.tiltH.enabled = this.tiltV.enabled = false;
		this.grade = new ShaderPass(GradeShader);
		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.ao);
		this.composer.addPass(new OutputPass());
		this.composer.addPass(this.bloom);
		this.composer.addPass(this.tiltH);
		this.composer.addPass(this.tiltV);
		this.composer.addPass(this.grade);
	}

	set camera(cam: THREE.Camera) {
		this.renderPass.camera = cam;
		this.ao.camera = cam;
	}

	setSize(width: number, height: number, dpr: number): void {
		this.composer.setPixelRatio(dpr);
		this.composer.setSize(width, height);
		const w = Math.max(1, Math.round(width * dpr));
		const h = Math.max(1, Math.round(height * dpr));
		// occlusion is soft; half resolution keeps it cheap at a 2× pixel ratio
		this.ao.setSize(Math.ceil(w / 2), Math.ceil(h / 2));
		this.grade.uniforms.uAspect.value = width / Math.max(1, height);
		this.grade.uniforms.uRes.value.set(w, h);
		this.tiltH.uniforms.h.value = (this.tilt * 12) / w;
		this.tiltV.uniforms.v.value = (this.tilt * 12) / h;
	}

	setLook(look: Look): void {
		this.bloom.strength = look.bloom;
		this.bloom.radius = look.bloomRadius;
		this.bloom.threshold = look.threshold;
		this.bloom.enabled = look.bloom > 0.001;
		this.aoK = look.ao ?? 0;
		this.ao.blendIntensity = Math.min(1, this.aoK);
		this.ao.updateGtaoMaterial({ scale: Math.max(1, this.aoK) });
		this.tilt = look.tilt ?? 0;
		this.tiltH.enabled = this.tiltV.enabled = this.tilt > 0;
		const res = this.grade.uniforms.uRes.value;
		this.tiltH.uniforms.h.value = (this.tilt * 12) / res.x;
		this.tiltV.uniforms.v.value = (this.tilt * 12) / res.y;
		this.tiltH.uniforms.r.value = this.tiltV.uniforms.r.value = 0.45;
		const u = this.grade.uniforms;
		u.uSat.value = look.saturation;
		u.uContrast.value = look.contrast;
		u.uShadow.value.set(look.shadows);
		u.uHigh.value.set(look.highlights);
		u.uVignette.value = look.vignette;
		u.uSteps.value = look.steps ?? 0;
		u.uInk.value = look.ink ?? 0;
		u.uInkLo.value = look.inkLo ?? 0.03;
		u.uInkHi.value = look.inkHi ?? 0.16;
		u.uWrap.value = look.wrap ?? 0;
		u.uGrain.value = look.grain ?? 0;
		u.uPaper.value = look.paper ?? 0;
		u.uMono.value = look.mono ?? 0;
	}

	render(delta = 0): void {
		this.ao.enabled = this.aoK > 0 && !this.paused;
		this.clock += delta;
		this.grade.uniforms.uTime.value = this.clock;
		this.composer.render(delta);
	}

	dispose(): void {
		this.ao.dispose();
		this.bloom.dispose();
		this.tiltH.dispose();
		this.tiltV.dispose();
		this.grade.dispose();
		this.composer.dispose();
		this.target.dispose();
	}
}
