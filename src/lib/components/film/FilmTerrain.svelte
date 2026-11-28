<script lang="ts">
	import * as THREE from 'three';
	import type { Attachment } from 'svelte/attachments';
	import { mapCamera, mapGlow, paintCells, filmCells, type MapShow } from '$lib/film/mapPlan';
	import { arrowLayer, groundMaterial, loadGround, setLook, type Ground } from '$lib/film/three/ground';
	import { buildDescent, type Descent } from '$lib/film/three/descent';
	import { toMapWorld } from '$lib/mapTerrain';

	let { map }: { map: MapShow } = $props();

	/** How far above the ground the wide shot hangs, in world units; a focus divides it by its zoom. */
	const HEIGHT = 15.5;
	/** Ground relief over the map and under the fall. */
	const LIFT = 1.7;

	type Rig = {
		renderer: THREE.WebGLRenderer;
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		material: THREE.ShaderMaterial;
		state: THREE.DataTexture;
		paint: Float32Array;
		arrows: ReturnType<typeof arrowLayer>;
		ground: Ground;
		descent: Descent | null;
	};

	let rig = $state.raw<Rig | null>(null);
	let w = $state(0);
	let h = $state(0);
	/** Rigs whose shaders have compiled; a waiting map draws once so its first real frame does not stall. */
	const warmed = new WeakSet<Rig>();

	const mount: Attachment<HTMLCanvasElement> = (canvas) => {
		let gone = false;
		let made: Rig | null = null;
		loadGround().then((ground) => {
			if (gone) return;
			const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
			renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.setClearColor(0x000000, 0);
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 80);
			const n = filmCells().length;
			const paint = new Float32Array(n * 2 * 4);
			const state = new THREE.DataTexture(paint, n, 2, THREE.RGBAFormat, THREE.FloatType);
			state.magFilter = THREE.NearestFilter;
			state.minFilter = THREE.NearestFilter;
			const material = groundMaterial(ground, state);
			material.uniforms.uLift.value = LIFT;
			const mesh = new THREE.Mesh(ground.geometry, material);
			mesh.frustumCulled = false;
			scene.add(mesh);
			const arrows = arrowLayer(ground);
			scene.add(arrows.mesh);
			made = { renderer, scene, camera, material, state, paint, arrows, ground, descent: null };
			rig = made;
		});
		return () => {
			gone = true;
			if (made) {
				made.descent?.dispose();
				made.material.dispose();
				made.state.dispose();
				made.arrows.mesh.geometry.dispose();
				(made.arrows.mesh.material as THREE.Material).dispose();
				made.renderer.dispose();
			}
			rig = null;
		};
	};

	const target = new THREE.Vector3();

	function poseMap(r: Rig, m: MapShow) {
		const c = mapCamera(m);
		const [x, z] = toMapWorld(c.x, c.y);
		const d = HEIGHT / c.zoom;
		target.set(x, 0.1, z);
		r.camera.position.set(x + Math.sin(c.turn) * Math.sin(c.tilt) * d, Math.cos(c.tilt) * d, z + Math.cos(c.turn) * Math.sin(c.tilt) * d);
		r.camera.up.set(0, 1, 0);
		r.camera.lookAt(target);
		r.camera.fov = 30;
		r.camera.near = 0.05;
		r.camera.far = 80;
		r.camera.updateProjectionMatrix();
	}

	$effect(() => {
		const r = rig;
		const m = map;
		if (!r || !w || !h) return;
		const pw = Math.round(w);
		const ph = Math.round(h);
		const size = r.renderer.getSize(new THREE.Vector2());
		if (size.x !== pw || size.y !== ph) r.renderer.setSize(pw, ph, false);
		r.camera.aspect = pw / ph;
		if (!m.active && warmed.has(r)) return;
		warmed.add(r);
		const u = r.material.uniforms;
		const falling = m.mode === 'descent';
		if (falling && !r.descent) {
			r.descent = buildDescent(r.ground, LIFT);
			r.scene.add(r.descent.group);
		}
		if (r.descent) r.descent.group.visible = falling;
		r.arrows.mesh.visible = !falling && !!m.arrows;
		setLook(r.material, falling ? 'dusk' : 'night');
		if (falling) {
			u.uPaint.value = 0;
			u.uGlow.value.w = 0;
			u.uFogRange.value.set(9, 30);
			u.uHole.value.copy(r.descent!.hole);
			r.descent!.update(r.camera, m.k, m.t, m.secs);
		} else {
			u.uHole.value.z = 0;
			paintCells(m, r.paint);
			r.state.needsUpdate = true;
			u.uPaint.value = m.paint === 'none' ? 0 : 1;
			const glow = mapGlow(m);
			u.uGlow.value.set(glow.x, glow.y, glow.r, glow.amount);
			u.uGlowColor.value.set(glow.color);
			u.uFogRange.value.set(17, 40);
			if (m.arrows) r.arrows.update(m, LIFT);
			poseMap(r, m);
		}
		u.uTime.value = m.t;
		r.renderer.render(r.scene, r.camera);
	});
</script>

<div class={['terrain', { ready: !!rig, sky: map.mode === 'descent' }]} bind:clientWidth={w} bind:clientHeight={h}>
	<canvas {@attach mount}></canvas>
</div>

<style>
	.terrain {
		position: absolute;
		inset: 0;
		background: radial-gradient(120% 90% at 50% 18%, #18213a 0%, #0a0e19 46%, #04060b 100%);
	}
	.terrain.sky {
		background: #f2b88c;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.ready canvas {
		opacity: 1;
	}
</style>
