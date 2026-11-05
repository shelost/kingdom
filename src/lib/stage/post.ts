import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import type { Quality } from './build/types';

/** Colour grade applied after tone mapping, in display space. */
export type Look = {
	bloom: number;
	bloomRadius: number;
	threshold: number;
	saturation: number;
	contrast: number;
	/** Multipliers for the darks and the lights (split toning). */
	shadows: string;
	highlights: string;
	vignette: number;
};

const GradeShader = {
	uniforms: {
		tDiffuse: { value: null as THREE.Texture | null },
		uSat: { value: 1 },
		uContrast: { value: 1 },
		uShadow: { value: new THREE.Color(1, 1, 1) },
		uHigh: { value: new THREE.Color(1, 1, 1) },
		uVignette: { value: 0.2 },
		uAspect: { value: 1 }
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
		varying vec2 vUv;
		void main() {
			vec4 c = texture2D(tDiffuse, vUv);
			vec3 col = c.rgb;
			float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
			col = mix(vec3(l), col, uSat);
			col = (col - 0.5) * uContrast + 0.5;
			col *= mix(uShadow, uHigh, smoothstep(0.05, 0.85, l));
			vec2 d = (vUv - 0.5) * vec2(uAspect, 1.0);
			float v = smoothstep(0.35, 1.05, length(d) * 1.15);
			col *= 1.0 - uVignette * v;
			gl_FragColor = vec4(clamp(col, 0.0, 1.0), c.a);
		}`
};

/** The stage's post chain: MSAA scene render, bloom, tone mapping, grade. */
export class Post {
	readonly composer: EffectComposer;
	private target: THREE.WebGLRenderTarget;
	private bloom: UnrealBloomPass;
	private grade: ShaderPass;
	private renderPass: RenderPass;

	constructor(
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: THREE.Camera,
		quality: Quality
	) {
		const size = renderer.getDrawingBufferSize(new THREE.Vector2());
		this.target = new THREE.WebGLRenderTarget(size.x, size.y, {
			type: THREE.HalfFloatType,
			samples: quality === 'cinematic' ? 4 : 2
		});
		this.composer = new EffectComposer(renderer, this.target);
		this.renderPass = new RenderPass(scene, camera);
		this.bloom = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.3, 0.6, 0.9);
		this.grade = new ShaderPass(GradeShader);
		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.bloom);
		this.composer.addPass(new OutputPass());
		this.composer.addPass(this.grade);
	}

	/** Anti-aliasing samples follow the quality; targets reallocate on the next frame. */
	setQuality(quality: Quality): void {
		const samples = quality === 'cinematic' ? 4 : 2;
		for (const t of [this.composer.renderTarget1, this.composer.renderTarget2]) {
			if (t.samples === samples) continue;
			t.samples = samples;
			t.dispose();
		}
	}

	set camera(cam: THREE.Camera) {
		this.renderPass.camera = cam;
	}

	setSize(width: number, height: number, dpr: number): void {
		this.composer.setPixelRatio(dpr);
		this.composer.setSize(width, height);
		this.grade.uniforms.uAspect.value = width / Math.max(1, height);
	}

	setLook(look: Look): void {
		this.bloom.strength = look.bloom;
		this.bloom.radius = look.bloomRadius;
		this.bloom.threshold = look.threshold;
		const u = this.grade.uniforms;
		u.uSat.value = look.saturation;
		u.uContrast.value = look.contrast;
		u.uShadow.value.set(look.shadows);
		u.uHigh.value.set(look.highlights);
		u.uVignette.value = look.vignette;
	}

	render(delta?: number): void {
		this.composer.render(delta);
	}

	dispose(): void {
		this.bloom.dispose();
		this.grade.dispose();
		this.composer.dispose();
		this.target.dispose();
	}
}
