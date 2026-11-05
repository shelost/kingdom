<script lang="ts">
	import * as THREE from 'three';
	import { untrack } from 'svelte';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import type { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';
	import type { StageSiteId } from '$lib/stage/sites';
	import { buildSite, type Label, type LightPreset, type Quality, type SiteBuild, type StageApi, type View } from '$lib/stage/build';
	import { Post, type Look } from '$lib/stage/post';
	import { Atmosphere } from '$lib/stage/atmosphere';

	let {
		site,
		year,
		light,
		quality,
		view,
		labels: showLabels,
		onbusy,
		onbuilt,
		onapi
	}: {
		site: StageSiteId;
		year: number;
		light: LightPreset;
		quality: Quality;
		view: string;
		labels: boolean;
		onbusy?: (busy: boolean) => void;
		onbuilt?: (info: { views: View[]; labels: Label[]; ms: number } | null) => void;
		onapi?: (api: StageApi) => void;
	} = $props();

	const { scene, renderer, camera, autoRender, renderStage, size, dpr } = useThrelte();

	let built = $state.raw<SiteBuild | null>(null);
	let controls = $state.raw<OrbitControlsImpl | undefined>();
	let post = $state.raw<Post | null>(null);

	/* ---------------------------------------------------------- sky and light */

	type Preset = {
		elevation: number;
		azimuth: number;
		sun: string;
		sunI: number;
		sky: string;
		ground: string;
		hemiI: number;
		fog: string;
		fogNear: number;
		fogFar: number;
		exposure: number;
		env: number;
		turbidity: number;
		rayleigh: number;
		background?: string;
		look: Look;
	};

	const PRESETS: Record<LightPreset, Preset> = {
		dawn: {
			elevation: 4,
			azimuth: 104,
			sun: '#ffc4a0',
			sunI: 1.7,
			sky: '#c7d0e6',
			ground: '#474b40',
			hemiI: 0.85,
			fog: '#d8d2dc',
			fogNear: 700,
			fogFar: 11000,
			exposure: 1.12,
			env: 0.08,
			turbidity: 4,
			rayleigh: 3,
			look: { bloom: 0.3, bloomRadius: 0.55, threshold: 1.6, saturation: 0.9, contrast: 1.04, shadows: '#e9edfb', highlights: '#fff3ea', vignette: 0.26 }
		},
		day: {
			elevation: 42,
			azimuth: 212,
			sun: '#fff0d8',
			sunI: 2.6,
			sky: '#cfe0f0',
			ground: '#5d6b3e',
			hemiI: 0.42,
			fog: '#c9d7df',
			fogNear: 2600,
			fogFar: 24000,
			exposure: 0.7,
			env: 0.08,
			turbidity: 3,
			rayleigh: 1.2,
			look: { bloom: 0.14, bloomRadius: 0.4, threshold: 2.4, saturation: 1.06, contrast: 1.06, shadows: '#f1f4fb', highlights: '#fffaf1', vignette: 0.18 }
		},
		golden: {
			elevation: 8,
			azimuth: 248,
			sun: '#ffb877',
			sunI: 2.4,
			sky: '#e8c9a8',
			ground: '#4d4530',
			hemiI: 0.42,
			fog: '#dcb991',
			fogNear: 1200,
			fogFar: 15000,
			exposure: 0.86,
			env: 0.06,
			turbidity: 6,
			rayleigh: 2.4,
			look: { bloom: 0.36, bloomRadius: 0.55, threshold: 1.5, saturation: 1.1, contrast: 1.08, shadows: '#e7e6f8', highlights: '#fff0dc', vignette: 0.28 }
		},
		night: {
			elevation: 34,
			azimuth: 150,
			sun: '#a9bfff',
			sunI: 0.45,
			sky: '#1c2b4a',
			ground: '#07090d',
			hemiI: 0.22,
			fog: '#0f1828',
			fogNear: 1200,
			fogFar: 9000,
			exposure: 1.1,
			env: 0.05,
			turbidity: 2,
			rayleigh: 0.4,
			background: '#0b1322',
			look: { bloom: 0.75, bloomRadius: 0.6, threshold: 0.8, saturation: 0.88, contrast: 1.1, shadows: '#e4eafb', highlights: '#fff0da', vignette: 0.36 }
		}
	};

	const sky = new Sky();
	sky.scale.setScalar(60000);
	const sunLight = new THREE.DirectionalLight('#ffffff', 3);
	sunLight.castShadow = true;
	sunLight.shadow.bias = -0.00035;
	sunLight.shadow.normalBias = 0.35;
	sunLight.shadow.camera.near = 10;
	sunLight.shadow.camera.far = 6000;
	sunLight.shadow.autoUpdate = false;
	sunLight.shadow.mapSize.set(2048, 2048);
	const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 0.8);
	const atmosphere = new Atmosphere();
	const sunDir = new THREE.Vector3();
	let pmrem: THREE.PMREMGenerator | null = null;
	let envTarget: THREE.WebGLRenderTarget | null = null;
	const skyScene = new THREE.Scene();
	skyScene.add(sky);
	const skyTarget = new THREE.WebGLCubeRenderTarget(1024, { type: THREE.HalfFloatType });
	const skyCamera = new THREE.CubeCamera(1, 200000, skyTarget);

	scene.add(sunLight, sunLight.target, hemi, atmosphere.group);
	if (import.meta.env.DEV) (globalThis as Record<string, unknown>).__stage = { renderer, scene, sunLight };

	function applyLight(preset: LightPreset) {
		const p = PRESETS[preset];
		const el = THREE.MathUtils.degToRad(p.elevation);
		const az = THREE.MathUtils.degToRad(p.azimuth);
		sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
		sunLight.color.set(p.sun);
		sunLight.intensity = p.sunI;
		hemi.color.set(p.sky);
		hemi.groundColor.set(p.ground);
		hemi.intensity = p.hemiI;
		renderer.toneMappingExposure = p.exposure;

		const u = sky.material.uniforms;
		u.turbidity.value = p.turbidity;
		u.rayleigh.value = p.rayleigh;
		u.mieCoefficient.value = 0.004;
		u.mieDirectionalG.value = 0.82;
		u.sunPosition.value.copy(sunDir);

		pmrem ??= new THREE.PMREMGenerator(renderer);
		envTarget?.dispose();
		if (p.background) {
			const flat = new THREE.Scene();
			flat.background = new THREE.Color(p.background);
			envTarget = pmrem.fromScene(flat, 0, 1, 10);
			scene.background = flat.background;
		} else {
			// the sky shader is expensive per pixel, so it is drawn once into a cube and reused
			skyCamera.update(renderer, skyScene);
			envTarget = pmrem.fromCubemap(skyTarget.texture);
			scene.background = skyTarget.texture;
		}
		scene.environment = envTarget.texture;
		scene.environmentIntensity = p.env;

		const haze = new THREE.Color(p.fog);
		if (built && preset === 'day') haze.set(built.haze);
		scene.fog = new THREE.Fog(haze, p.fogNear, p.fogFar);
		built?.setLight(preset);
		built?.setEnv(envTarget.texture);
		atmosphere.setLight(preset);
		post?.setLook(p.look);
		shadowKey = '';
	}

	$effect(() => {
		applyLight(light);
	});

	$effect(() => {
		return () => {
			scene.remove(sunLight, sunLight.target, hemi, atmosphere.group);
			sky.geometry.dispose();
			sky.material.dispose();
			skyTarget.dispose();
			atmosphere.dispose();
			envTarget?.dispose();
			pmrem?.dispose();
			scene.environment = null;
			scene.background = null;
			scene.fog = null;
		};
	});

	/* ---------------------------------------------------------- quality and the post chain */

	$effect(() => {
		const made = new Post(renderer, scene, camera.current, untrack(() => quality));
		made.setLook(PRESETS[untrack(() => light)].look);
		post = made;
		return () => {
			made.dispose();
			post = null;
		};
	});

	$effect(() => {
		const q = quality;
		const mapSize = q === 'cinematic' ? 4096 : 2048;
		if (sunLight.shadow.mapSize.x !== mapSize) {
			sunLight.shadow.mapSize.set(mapSize, mapSize);
			sunLight.shadow.map?.dispose();
			sunLight.shadow.map = null;
		}
		post?.setQuality(q);
		shadowKey = '';
	});

	$effect(() => {
		post?.setSize($size.width, $size.height, $dpr);
	});

	$effect(() => {
		autoRender.set(false);
		return () => autoRender.set(true);
	});

	useTask(
		(delta) => {
			if (!post) return;
			post.camera = camera.current;
			post.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);

	/* ---------------------------------------------------------- build the site */

	let firstView = true;

	$effect(() => {
		const id = site;
		const y = year;
		const preset = untrack(() => light);
		onbusy?.(true);
		let made: SiteBuild | null = null;
		const timer = setTimeout(() => {
			const t0 = performance.now();
			made = buildSite(id, { year: y, light: preset });
			const ms = Math.round(performance.now() - t0);
			if (made) {
				scene.add(made.root);
				made.setLight(preset);
				made.setEnv(envTarget?.texture ?? null);
				atmosphere.setSite(made.lamps, made.center);
			} else atmosphere.setSite([], [0, 0]);
			built = made;
			onbuilt?.(made ? { views: made.views, labels: made.labels, ms } : null);
			onbusy?.(false);
		}, 40);
		return () => {
			clearTimeout(timer);
			if (made) {
				scene.remove(made.root);
				made.dispose();
			}
		};
	});

	$effect(() => {
		void site;
		firstView = true;
	});

	/* ---------------------------------------------------------- camera views */

	type Tween = { from: THREE.Vector3; to: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3; fromFov: number; toFov: number; t: number };
	let tween: Tween | null = null;

	function goTo(v: View, jump: boolean) {
		const cam = camera.current as THREE.PerspectiveCamera;
		if (!controls) return;
		const to = new THREE.Vector3(...v.pos);
		const toT = new THREE.Vector3(...v.target);
		const toFov = v.fov ?? 40;
		if (jump) {
			cam.position.copy(to);
			controls.target.copy(toT);
			cam.fov = toFov;
			cam.updateProjectionMatrix();
			controls.update();
			tween = null;
			return;
		}
		tween = { from: cam.position.clone(), to, fromT: controls.target.clone(), toT, fromFov: cam.fov, toFov, t: 0 };
	}

	$effect(() => {
		const b = built;
		const id = view;
		if (!b || !controls) return;
		const v = b.views.find((x) => x.id === id) ?? b.views[0];
		goTo(v, firstView);
		firstView = false;
	});

	/* ---------------------------------------------------------- per frame */

	const focus = new THREE.Vector3();
	let shadowKey = '';
	let clock = 0;

	useTask((delta) => {
		const cam = camera.current as THREE.PerspectiveCamera;
		clock += delta;
		if (tween && controls) {
			tween.t = Math.min(1, tween.t + delta / 1.6);
			const k = tween.t < 0.5 ? 4 * tween.t ** 3 : 1 - (-2 * tween.t + 2) ** 3 / 2;
			cam.position.lerpVectors(tween.from, tween.to, k);
			controls.target.lerpVectors(tween.fromT, tween.toT, k);
			cam.fov = THREE.MathUtils.lerp(tween.fromFov, tween.toFov, k);
			cam.updateProjectionMatrix();
			controls.update();
			if (tween.t >= 1) tween = null;
		}

		if (!built) return;
		built.tick(clock);
		if (controls) focus.copy(controls.target);
		else focus.set(built.center[0], 0, built.center[1]);
		atmosphere.update(clock, delta, focus);

		const reach = THREE.MathUtils.clamp(cam.position.distanceTo(focus) * 0.75, 70, built.radius);
		const key = `${built.root.uuid}|${Math.round(focus.x / (reach * 0.08))}|${Math.round(focus.z / (reach * 0.08))}|${Math.round(Math.log(reach) * 12)}`;
		if (key === shadowKey) return;
		shadowKey = key;
		sunLight.shadow.needsUpdate = true;
		const sc = sunLight.shadow.camera;
		sc.left = -reach;
		sc.right = reach;
		sc.top = reach;
		sc.bottom = -reach;
		sc.updateProjectionMatrix();
		sunLight.position.copy(focus).addScaledVector(sunDir, 2500);
		sunLight.target.position.copy(focus);
		sunLight.target.updateMatrixWorld();
	});

	/* ---------------------------------------------------------- stills */

	function capture(width = 2400): string | null {
		if (!post) return null;
		const cam = camera.current as THREE.PerspectiveCamera;
		const prev = renderer.getSize(new THREE.Vector2());
		const ratio = renderer.getPixelRatio();
		const aspect = cam.aspect;
		const w = Math.round(width);
		const h = Math.round(width / 2);
		renderer.setPixelRatio(1);
		renderer.setSize(w, h, false);
		post.setSize(w, h, 1);
		cam.aspect = 2;
		cam.updateProjectionMatrix();
		post.camera = cam;
		post.render(0);
		const url = renderer.domElement.toDataURL('image/png');
		renderer.setPixelRatio(ratio);
		renderer.setSize(prev.x, prev.y, false);
		post.setSize(prev.x, prev.y, ratio);
		cam.aspect = aspect;
		cam.updateProjectionMatrix();
		return url;
	}

	$effect(() => {
		onapi?.({ capture });
	});

	const STATUS_KO: Record<Label['status'], string> = {
		survey: '측량',
		standing: '현존',
		excavated: '발굴',
		recorded: '기록',
		placed: '추정'
	};
</script>

<T.PerspectiveCamera makeDefault position={[-760, 250, 470]} fov={38} near={2} far={80000}>
	<OrbitControls
		bind:ref={controls}
		enableDamping
		dampingFactor={0.08}
		maxPolarAngle={Math.PI / 2.04}
		minDistance={6}
		maxDistance={9000}
		zoomSpeed={1.1}
	/>
</T.PerspectiveCamera>

{#if built && showLabels}
	{#each built.labels as l (l.id)}
		<HTML position={l.at} center pointerEvents="none" zIndexRange={[20, 0]}>
			<div class="tag {l.status}" title={l.note}>
				<b>{l.ko}</b>
				<span>{l.en}</span>
				<i>{STATUS_KO[l.status]}</i>
			</div>
		</HTML>
	{/each}
{/if}

<style>
	.tag {
		display: flex;
		align-items: baseline;
		gap: 0.3rem;
		white-space: nowrap;
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
		font-size: 0.68rem;
		line-height: 1.2;
		color: #2b241b;
		background: color-mix(in srgb, #f6efe1 88%, transparent);
		border: 1px solid color-mix(in srgb, #2b241b 18%, transparent);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.18);
		transform: translateY(-50%);
	}

	.tag b {
		font-weight: 600;
		font-size: 0.74rem;
	}

	.tag i {
		font-style: normal;
		font-size: 0.6rem;
		padding: 0 0.3rem;
		border-radius: 999px;
		background: #ddd2bd;
	}

	.tag.survey i,
	.tag.standing i {
		background: #bcd3a8;
	}

	.tag.excavated i {
		background: #e3c58f;
	}

	.tag.recorded i {
		background: #c9d3e6;
	}

	.tag.placed i {
		background: #e5c3bd;
	}
</style>
