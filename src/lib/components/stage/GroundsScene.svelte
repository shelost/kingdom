<script lang="ts">
	import * as THREE from 'three';
	import { untrack } from 'svelte';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import type { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';
	import type { StageSiteId } from '$lib/stage/sites';
	import { buildSite, weight, DEFAULT_LAYERS, type Label, type Layers, type LightMix, type LightPreset, type SiteBuild, type StageApi, type View } from '$lib/stage/build';
	import { Post, composeLook, type Look, type StageStyle } from '$lib/stage/post';
	import { Atmosphere } from '$lib/stage/atmosphere';
	import { BATTLES } from '$lib/battles';
	import { stageBattle, type BattleFit, type BattleStage } from '$lib/stage/battle3d';

	let {
		site,
		year,
		hour,
		view,
		labels: showLabels,
		style = 'natural',
		people = true,
		boats = true,
		layers = DEFAULT_LAYERS,
		battle = null,
		phase = 0,
		fit,
		onbusy,
		onbuilt,
		onapi
	}: {
		site: StageSiteId;
		year: number;
		hour: number;
		view: string;
		labels: boolean;
		style?: StageStyle;
		people?: boolean;
		boats?: boolean;
		layers?: Layers;
		/** A battle id to play on the grounds, and the phase it stands at. */
		battle?: string | null;
		phase?: number;
		fit?: BattleFit;
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
			look: { bloom: 0.3, bloomRadius: 0.5, threshold: 0.9, saturation: 1.0, contrast: 1.04, shadows: '#e4eafb', highlights: '#fff0e4', vignette: 0.24 }
		},
		day: {
			elevation: 42,
			azimuth: 212,
			sun: '#ffe8c2',
			sunI: 2.5,
			sky: '#b9d3f2',
			ground: '#6b7a44',
			hemiI: 0.62,
			fog: '#c9d7df',
			fogNear: 2600,
			fogFar: 24000,
			exposure: 0.7,
			env: 0.08,
			turbidity: 3,
			rayleigh: 1.2,
			look: { bloom: 0.16, bloomRadius: 0.4, threshold: 0.96, saturation: 1.14, contrast: 1.05, shadows: '#e6edfc', highlights: '#fff5e4', vignette: 0.16 }
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
			look: { bloom: 0.36, bloomRadius: 0.5, threshold: 0.88, saturation: 1.16, contrast: 1.06, shadows: '#e2e4f8', highlights: '#ffeed6', vignette: 0.26 }
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
			look: { bloom: 0.75, bloomRadius: 0.6, threshold: 0.62, saturation: 0.88, contrast: 1.1, shadows: '#e4eafb', highlights: '#fff0da', vignette: 0.36 }
		}
	};

	// the sky is drawn live in the scene, so every hour on the slider repaints it in the same frame
	const sky = new Sky();
	sky.scale.setScalar(60000);
	sky.renderOrder = -10;
	sky.frustumCulled = false;
	// a gradient dome over the sky: the night sky fades in over the scattering, and otherworlds paint on it
	const domeMat = new THREE.ShaderMaterial({
		uniforms: { top: { value: new THREE.Color('#0a1426') }, bottom: { value: new THREE.Color('#1d2c4c') }, opacity: { value: 0 } },
		vertexShader: `varying vec3 vDir;
			void main() {
				vDir = normalize(position);
				vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				gl_Position = p.xyww;
			}`,
		fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform float opacity; varying vec3 vDir;
			void main() {
				float h = clamp(vDir.y * 1.6 + 0.08, 0.0, 1.0);
				gl_FragColor = vec4(mix(bottom, top, pow(h, 0.7)), opacity);
				#include <colorspace_fragment>
			}`,
		side: THREE.BackSide,
		transparent: true,
		depthWrite: false,
		fog: false
	});
	const domeGeo = new THREE.SphereGeometry(45000, 32, 16);
	const dome = new THREE.Mesh(domeGeo, domeMat);
	dome.renderOrder = -9;
	dome.frustumCulled = false;
	const sunLight = new THREE.DirectionalLight('#ffffff', 3);
	sunLight.castShadow = true;
	sunLight.shadow.bias = -0.00035;
	sunLight.shadow.normalBias = 0.35;
	sunLight.shadow.camera.near = 10;
	sunLight.shadow.camera.far = 6000;
	sunLight.shadow.autoUpdate = false;
	sunLight.shadow.mapSize.set(4096, 4096);
	const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 0.8);
	const atmosphere = new Atmosphere();
	const sunDir = new THREE.Vector3();
	let pmrem: THREE.PMREMGenerator | null = null;
	let envTarget: THREE.WebGLRenderTarget | null = null;
	// the reflection pass sees the same sky through twin meshes sharing its materials, on a small cube
	const skyScene = new THREE.Scene();
	const envSky = new THREE.Mesh(sky.geometry, sky.material);
	envSky.scale.copy(sky.scale);
	skyScene.add(envSky, new THREE.Mesh(domeGeo, domeMat));
	const skyTarget = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
	const skyCamera = new THREE.CubeCamera(1, 200000, skyTarget);
	const fog = new THREE.Fog('#c9d7df', 2600, 24000);
	scene.fog = fog;
	scene.background = null;

	scene.add(sky, dome, sunLight, sunLight.target, hemi, atmosphere.group);
	if (import.meta.env.DEV)
		(globalThis as Record<string, unknown>).__stage = {
			renderer,
			scene,
			sunLight,
			get post() {
				return post;
			}
		};

	const MARKS: { h: number; id: LightPreset }[] = [
		{ h: 0, id: 'night' },
		{ h: 5, id: 'dawn' },
		{ h: 9, id: 'day' },
		{ h: 16.5, id: 'golden' },
		{ h: 20, id: 'night' },
		{ h: 24, id: 'night' }
	];

	function mix(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	function mixHex(a: string, b: string, t: number) {
		const c = new THREE.Color(a);
		c.lerp(new THREE.Color(b), t);
		return '#' + c.getHexString();
	}

	function atHour(hourOfDay: number): { preset: Preset; bucket: LightPreset; mix: LightMix } {
		const h = ((hourOfDay % 24) + 24) % 24;
		let i = 0;
		while (i < MARKS.length - 2 && h > MARKS[i + 1].h) i++;
		const left = MARKS[i];
		const right = MARKS[i + 1];
		const t = Math.min(1, Math.max(0, (h - left.h) / (right.h - left.h || 1)));
		const a = PRESETS[left.id];
		const b = PRESETS[right.id];
		const look = {
			bloom: mix(a.look.bloom, b.look.bloom, t),
			bloomRadius: mix(a.look.bloomRadius, b.look.bloomRadius, t),
			threshold: mix(a.look.threshold, b.look.threshold, t),
			saturation: mix(a.look.saturation, b.look.saturation, t),
			contrast: mix(a.look.contrast, b.look.contrast, t),
			shadows: mixHex(a.look.shadows, b.look.shadows, t),
			highlights: mixHex(a.look.highlights, b.look.highlights, t),
			vignette: mix(a.look.vignette, b.look.vignette, t)
		};
		const bucket = t < 0.5 ? left.id : right.id;
		return {
			bucket,
			mix: { a: left.id, b: right.id, t },
			preset: {
				elevation: mix(a.elevation, b.elevation, t),
				azimuth: mix(a.azimuth, b.azimuth, t),
				sun: mixHex(a.sun, b.sun, t),
				sunI: mix(a.sunI, b.sunI, t),
				sky: mixHex(a.sky, b.sky, t),
				ground: mixHex(a.ground, b.ground, t),
				hemiI: mix(a.hemiI, b.hemiI, t),
				fog: mixHex(a.fog, b.fog, t),
				fogNear: mix(a.fogNear, b.fogNear, t),
				fogFar: mix(a.fogFar, b.fogFar, t),
				exposure: mix(a.exposure, b.exposure, t),
				env: mix(a.env, b.env, t),
				turbidity: mix(a.turbidity, b.turbidity, t),
				rayleigh: mix(a.rayleigh, b.rayleigh, t),
				look
			}
		};
	}

	/** Night dome colours per preset; its opacity is how far into night the hour is. */
	const NIGHT_TOP = '#0a1426';
	const NIGHT_LOW = '#1d2c4c';

	// the reflection cube is re-rendered at most this often while the hour moves (PMREM is the costly part)
	const ENV_EVERY = 0.25;
	let envDirty = true;
	let envAt = -1;
	let envIntensity = 0.08;

	function paintEnv() {
		pmrem ??= new THREE.PMREMGenerator(renderer);
		skyCamera.update(renderer, skyScene);
		const next = pmrem.fromCubemap(skyTarget.texture);
		envTarget?.dispose();
		envTarget = next;
		scene.environment = envTarget.texture;
		scene.environmentIntensity = envIntensity;
		built?.setEnv(envTarget.texture);
		envDirty = false;
		envAt = clock;
	}

	const haze = new THREE.Color();
	const siteHaze = new THREE.Color();

	function applyHour(hourOfDay: number) {
		const { preset: p, mix: lightMix } = atHour(hourOfDay);
		const realm = untrack(() => built)?.realm;
		const el = THREE.MathUtils.degToRad(p.elevation);
		const az = THREE.MathUtils.degToRad(p.azimuth);
		sunDir.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
		sunLight.color.set(realm?.sun ?? p.sun);
		sunLight.intensity = realm?.sunI ?? p.sunI;
		hemi.color.set(realm?.hemi ?? p.sky);
		hemi.groundColor.set(p.ground);
		hemi.intensity = p.hemiI;
		renderer.toneMappingExposure = p.exposure;

		const u = sky.material.uniforms;
		u.turbidity.value = p.turbidity;
		u.rayleigh.value = p.rayleigh;
		u.mieCoefficient.value = 0.004;
		u.mieDirectionalG.value = 0.82;
		u.sunPosition.value.copy(sunDir);

		// otherworlds keep their own painted sky; on Earth the night dome fades in over the scattering
		const du = domeMat.uniforms;
		if (realm) {
			sky.visible = envSky.visible = false;
			du.top.value.set(realm.top);
			du.bottom.value.set(realm.bottom);
			du.opacity.value = 1;
			haze.set(realm.fog);
			fog.near = realm.fogNear;
			fog.far = realm.fogFar;
		} else {
			sky.visible = envSky.visible = true;
			du.top.value.set(NIGHT_TOP);
			du.bottom.value.set(NIGHT_LOW);
			const night = weight(lightMix, 'night');
			du.opacity.value = THREE.MathUtils.smoothstep(night, 0.05, 0.85);
			haze.set(p.fog);
			const b = untrack(() => built);
			if (b) haze.lerp(siteHaze.set(b.haze), weight(lightMix, 'day'));
			fog.near = p.fogNear;
			fog.far = p.fogFar;
		}
		fog.color.copy(haze);
		envIntensity = p.env;
		scene.environmentIntensity = envIntensity;
		post?.setLook(composeLook(p.look, untrack(() => style)));
		untrack(() => built)?.setLight(lightMix);
		atmosphere.setLight(lightMix);
		shadowKey = '';
		envDirty = true;
	}

	$effect(() => {
		applyHour(hour);
	});

	$effect(() => {
		return () => {
			scene.remove(sky, dome, sunLight, sunLight.target, hemi, atmosphere.group);
			sky.geometry.dispose();
			sky.material.dispose();
			domeGeo.dispose();
			domeMat.dispose();
			skyTarget.dispose();
			atmosphere.dispose();
			envTarget?.dispose();
			pmrem?.dispose();
			scene.environment = null;
			scene.background = null;
			scene.fog = null;
		};
	});

	/* ---------------------------------------------------------- the post chain */

	$effect(() => {
		const made = new Post(renderer, scene, camera.current);
		made.setLook(composeLook(atHour(untrack(() => hour)).preset.look, untrack(() => style)));
		post = made;
		return () => {
			made.dispose();
			post = null;
		};
	});

	$effect(() => {
		const grade = style;
		const sampled = atHour(untrack(() => hour));
		post?.setLook(composeLook(sampled.preset.look, grade));
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
			post.paused = !!built?.rising;
			post.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);

	/* ---------------------------------------------------------- build the site */

	let firstView = true;

	$effect(() => {
		const id = site;
		const y = year;
		const preset = atHour(untrack(() => hour)).bucket;
		onbusy?.(true);
		let made: SiteBuild | null = null;
		const timer = setTimeout(() => {
			const t0 = performance.now();
			made = buildSite(id, { year: y, light: preset });
			const ms = Math.round(performance.now() - t0);
			if (made) {
				scene.add(made.root);
				made.setEnv(envTarget?.texture ?? null);
				made.setLayers(untrack(() => layers));
				atmosphere.setSite(made.lamps, made.center, made.weather);
				// the land and walls come up out of the plain; the shadow waits until they stand
				made.rise();
				sunLight.shadow.intensity = 0;
			} else atmosphere.setSite([], [0, 0]);
			built = made;
			applyHour(untrack(() => hour));
			made?.setLife({ people: untrack(() => people), boats: untrack(() => boats) });
			onbusy?.(false);
		}, 40);
		return () => {
			clearTimeout(timer);
			if (made) {
				scene.remove(made.root);
				made.dispose();
			}
			built = null;
		};
	});

	$effect(() => {
		void site;
		firstView = true;
	});

	/* ---------------------------------------------------------- a battle on the grounds */

	let fight = $state.raw<BattleStage | null>(null);

	$effect(() => {
		const b = built;
		const data = battle ? BATTLES[battle] : null;
		if (!b || !data) {
			fight = null;
			return;
		}
		const made = stageBattle(data, b, untrack(() => fit));
		made.setPhase(untrack(() => phase));
		b.root.add(made.group);
		fight = made;
		return () => {
			b.root.remove(made.group);
			made.dispose();
		};
	});

	$effect(() => {
		fight?.setPhase(phase);
	});

	// the page hears the site's views, plus the battle's when one is playing
	$effect(() => {
		const b = built;
		const f = fight;
		if (!b) {
			onbuilt?.(null);
			return;
		}
		untrack(() => onbuilt?.({ views: f ? [...f.views, ...b.views] : b.views, labels: b.labels, ms: 0 }));
	});

	$effect(() => {
		built?.setLife({ people, boats });
	});

	$effect(() => {
		const on = layers;
		built?.setLayers(on);
		atmosphere.setLayers(on);
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
		const extra = fight?.views ?? [];
		if (!b || !controls) return;
		const v = extra.find((x) => x.id === id) ?? b.views.find((x) => x.id === id) ?? b.views[0];
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

		// the sky's own clouds drift, faster in the wind
		sky.material.uniforms.time.value += delta * (layers.wind ? 2.5 : 0.6);
		if (envDirty && clock - envAt > ENV_EVERY) paintEnv();

		if (!built) return;
		const wasRising = built.rising;
		built.tick(clock, delta);
		fight?.tick(clock, delta);
		if (controls) focus.copy(controls.target);
		else focus.set(built.center[0], 0, built.center[1]);
		atmosphere.update(clock, delta, focus, cam.position);

		// shadows fade back in once the site stands (the shadow pass does not see the rise)
		if (built.rising) return;
		if (wasRising) shadowKey = '';
		if (sunLight.shadow.intensity < 1) sunLight.shadow.intensity = Math.min(1, sunLight.shadow.intensity + delta * 1.5);

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

	let shownLabels = $derived(built && showLabels ? built.labels.filter((l) => !l.view || l.view === view) : []);
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

{#each shownLabels as l (l.id)}
	<HTML position={l.at} center pointerEvents="none" zIndexRange={[20, 0]}>
		<div class="tag">
			<b>{l.ko}</b>
			<span>{l.en}</span>
		</div>
	</HTML>
{/each}

<style>
	.tag {
		display: flex;
		align-items: baseline;
		gap: 0.32rem;
		white-space: nowrap;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Apple SD Gothic Neo', 'Helvetica Neue', system-ui, sans-serif;
		font-size: 0.68rem;
		letter-spacing: -0.005em;
		line-height: 1.2;
		color: rgb(20 20 24 / 0.86);
		background: rgb(255 255 255 / 0.38);
		backdrop-filter: blur(14px) saturate(1.7);
		-webkit-backdrop-filter: blur(14px) saturate(1.7);
		box-shadow:
			inset 0 0 0 0.5px rgb(255 255 255 / 0.55),
			0 2px 10px rgb(0 0 0 / 0.12);
		transform: translateY(-50%);
	}

	.tag b {
		font-weight: 600;
		font-size: 0.74rem;
	}

	.tag span {
		color: rgb(20 20 24 / 0.62);
	}
</style>
