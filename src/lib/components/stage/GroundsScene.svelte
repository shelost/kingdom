<script lang="ts">
	import * as THREE from 'three';
	import { untrack } from 'svelte';
	import { Sky } from 'three/addons/objects/Sky.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import type { OrbitControls as OrbitControlsImpl } from 'three/addons/controls/OrbitControls.js';
	import type { StageSiteId } from '$lib/stage/sites';
	import { buildSite, weight, DEFAULT_LAYERS, type Label, type Layers, type LightMix, type LightPreset, type SiteBuild, type StageApi, type View } from '$lib/stage/build';
	import { withGrids } from '$lib/stage/build/terrain';
	import { prepareGround } from '$lib/stage/build/groundPool';
	import { Post, composeLook, type Look, type StageStyle } from '$lib/stage/post';
	import { QUALITY, type StageQuality } from '$lib/stage/quality';
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
		quality = 'medium',
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
		quality?: StageQuality;
		/** A battle id to play on the grounds, and the phase it stands at. */
		battle?: string | null;
		phase?: number;
		fit?: BattleFit;
		onbusy?: (busy: boolean) => void;
		onbuilt?: (info: { views: View[]; labels: Label[]; ms: number } | null) => void;
		onapi?: (api: StageApi) => void;
	} = $props();

	const { scene, renderer, camera, autoRender, renderStage, size, dpr } = useThrelte();

	/** Pixel ratio stays put: resizing the post chain mid-drag flashes the frame white. */
	let fullDpr = 1;
	/** Scales the near/far switch distances on the ground and the trees. */
	let detail = 1;
	const SETTLE = 0.35;
	const LIGHT_SETTLE = 0.15;
	let lastMove = -Infinity;
	let lastLight = -Infinity;
	let shadowReady = false;
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
		uniforms: { top: { value: new THREE.Color('#0a1426') }, bottom: { value: new THREE.Color('#1d2c4c') }, opacity: { value: 0 }, gain: { value: 1 } },
		vertexShader: `varying vec3 vDir;
			void main() {
				vDir = normalize(position);
				vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				gl_Position = p.xyww;
			}`,
		fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform float opacity; uniform float gain; varying vec3 vDir;
			void main() {
				float h = clamp(vDir.y * 1.6 + 0.08, 0.0, 1.0);
				gl_FragColor = vec4(mix(bottom, top, pow(h, 0.7)) * gain, opacity);
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

	/** A bare realm's sky and fog sit this far past white, so the tone curve still lands them on white. */
	const BARE_GAIN = 8;

	/** The light at an hour. A realm keeps no hour: it stands in its own preset, and a bare one drops the vignette and the tint. */
	function lightAt(hourOfDay: number): ReturnType<typeof atHour> {
		const realm = untrack(() => built)?.realm;
		if (!realm) return atHour(hourOfDay);
		const id = realm.light ?? 'day';
		const preset = PRESETS[id];
		const look = realm.bare ? { ...preset.look, vignette: 0, shadows: '#ffffff', highlights: '#ffffff' } : preset.look;
		return { preset: { ...preset, look }, bucket: id, mix: { a: id, b: id, t: 0 } };
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
		// reflections see a bare realm's white at its true colour, or the coloured waters would wash out
		const gain = domeMat.uniforms.gain.value;
		domeMat.uniforms.gain.value = 1;
		skyCamera.update(renderer, skyScene);
		domeMat.uniforms.gain.value = gain;
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
		const { preset: p, mix: lightMix } = lightAt(hourOfDay);
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
			du.gain.value = realm.bare ? BARE_GAIN : 1;
			haze.set(realm.fog);
			fog.near = realm.fogNear;
			fog.far = realm.fogFar;
		} else {
			sky.visible = envSky.visible = true;
			du.top.value.set(NIGHT_TOP);
			du.bottom.value.set(NIGHT_LOW);
			du.gain.value = 1;
			const night = weight(lightMix, 'night');
			du.opacity.value = THREE.MathUtils.smoothstep(night, 0.05, 0.85);
			haze.set(p.fog);
			const b = untrack(() => built);
			if (b) haze.lerp(siteHaze.set(b.haze), weight(lightMix, 'day'));
			fog.near = p.fogNear;
			fog.far = p.fogFar;
		}
		fog.color.copy(haze);
		if (realm?.bare) fog.color.multiplyScalar(BARE_GAIN);
		envIntensity = p.env;
		scene.environmentIntensity = envIntensity;
		post?.setLook(composeLook(p.look, untrack(() => style)));
		untrack(() => built)?.setLight(lightMix);
		atmosphere.setLight(lightMix);
		shadowKey = '';
		lastLight = clock;
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
		made.setLook(composeLook(lightAt(untrack(() => hour)).preset.look, untrack(() => style)));
		post = made;
		return () => {
			made.dispose();
			post = null;
		};
	});

	$effect(() => {
		const grade = style;
		const sampled = lightAt(untrack(() => hour));
		post?.setLook(composeLook(sampled.preset.look, grade));
	});

	let postW = 0;
	let postH = 0;
	let postDpr = 0;
	$effect(() => {
		const w = $size.width;
		const h = $size.height;
		const r = $dpr;
		if (!post || (w === postW && h === postH && r === postDpr)) return;
		postW = w;
		postH = h;
		postDpr = r;
		post.setSize(w, h, r);
	});

	/* ---------------------------------------------------------- the quality switch */

	$effect(() => {
		const q = QUALITY[quality];
		fullDpr = Math.min(window.devicePixelRatio || 1, q.dpr);
		detail = q.detail;
		if (dpr.current !== fullDpr) dpr.set(fullDpr);
		if (sunLight.shadow.mapSize.x !== q.shadow) {
			sunLight.shadow.mapSize.set(q.shadow, q.shadow);
			sunLight.shadow.map?.dispose();
			sunLight.shadow.map = null;
			shadowKey = '';
			shadowReady = false;
		}
	});

	$effect(() => {
		const q = QUALITY[quality];
		post?.setQuality(q);
	});

	$effect(() => {
		autoRender.set(false);
		return () => autoRender.set(true);
	});

	// nothing to paint while the canvas is scrolled out of view
	let onScreen = true;
	$effect(() => {
		const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
		io.observe(renderer.domElement);
		return () => io.disconnect();
	});

	useTask(
		(delta) => {
			if (!post || !onScreen) return;
			post.camera = camera.current;
			// occlusion draws the whole scene a second time; the creases come back when the camera stops
			post.paused = !!built?.rising || clock - lastMove < SETTLE;
			post.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);

	/* ---------------------------------------------------------- build the site */

	let firstView = true;
	/** Longest wait on the ground workers before the main thread samples the ground itself. A late answer still fills their cache. */
	const GROUND_WAIT = 8000;

	$effect(() => {
		const id = site;
		// year only sets the opening era; later year changes rise or sink layers in place
		const y = untrack(() => year);
		const preset = atHour(untrack(() => hour)).bucket;
		onbusy?.(true);
		let made: SiteBuild | null = null;
		let gone = false;
		const opts = { year: y, light: preset };
		// the workers sample the ground off the main thread; the rest of the site builds here
		const ground = prepareGround(id, opts);
		const timer = setTimeout(async () => {
			const grids = await Promise.race([ground, new Promise<null>((r) => setTimeout(() => r(null), GROUND_WAIT))]);
			if (gone) return;
			try {
				made = grids ? withGrids(grids, () => buildSite(id, opts)) : buildSite(id, opts);
			} catch (err) {
				// a broken builder shows "still being rebuilt" instead of raising the walls forever
				console.error(`stage: ${id} failed to build`, err);
				made = null;
			}
			if (made) {
				scene.add(made.root);
				made.setEnv(envTarget?.texture ?? null);
				made.setLayers(untrack(() => layers));
				atmosphere.setSite(made.lamps, made.center, made.weather, !!made.realm?.bare);
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
			gone = true;
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

	// switch the year's features without tearing the scene down
	$effect(() => {
		const y = year;
		const b = built;
		if (!b) return;
		b.setYear(y);
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

	// the page hears the site's views for this year, plus the battle's when one is playing
	$effect(() => {
		const b = built;
		const f = fight;
		void year;
		if (!b) {
			onbuilt?.(null);
			return;
		}
		untrack(() => onbuilt?.({ views: f ? [...f.views, ...b.activeViews] : b.activeViews, labels: b.activeLabels, ms: 0 }));
	});

	$effect(() => {
		built?.setLife({ people, boats });
	});

	$effect(() => {
		const on = layers;
		built?.setLayers(on);
		atmosphere.setLayers(on);
	});

	/* ---------------------------------------------------------- space + drag pans */

	$effect(() => {
		const c = controls;
		if (!c) return;
		const typing = (el: EventTarget | null) => {
			if (!(el instanceof HTMLElement)) return false;
			const tag = el.tagName;
			return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
		};
		const setPan = (on: boolean) => {
			c.mouseButtons.LEFT = on ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
			renderer.domElement.style.cursor = on ? 'grab' : '';
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.code !== 'Space' || e.repeat) return;
			if (typing(e.target)) return;
			if (e.type === 'keydown') {
				e.preventDefault();
				setPan(true);
			} else setPan(false);
		};
		const onBlur = () => setPan(false);
		window.addEventListener('keydown', onKey);
		window.addEventListener('keyup', onKey);
		window.addEventListener('blur', onBlur);
		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('keyup', onKey);
			window.removeEventListener('blur', onBlur);
			setPan(false);
		};
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

	/** Pull in on a labelled feature, keeping the current orbit angle. */
	function focusLabel(l: Label) {
		if (!controls || !built) return;
		const cam = camera.current as THREE.PerspectiveCamera;
		const aim = new THREE.Vector3(l.at[0], l.at[1] - 3, l.at[2]);
		const offset = cam.position.clone().sub(controls.target);
		if (offset.lengthSq() < 1e-4) offset.set(0.55, 0.4, 0.85);
		const dist = THREE.MathUtils.clamp(offset.length() * 0.32, 24, 180);
		offset.setLength(dist);
		if (Math.abs(offset.y) < dist * 0.14) offset.y = dist * 0.3;
		goTo(
			{
				id: l.id,
				en: l.en,
				ko: l.ko,
				pos: [aim.x + offset.x, aim.y + offset.y, aim.z + offset.z],
				target: [aim.x, aim.y, aim.z],
				fov: 42
			},
			false
		);
	}

	const lastPos = new THREE.Vector3();
	const lastQuat = new THREE.Quaternion();

	/** Visible camera motion only: the orbit damping's long sub-pixel tail does not count. */
	function noteMotion(cam: THREE.PerspectiveCamera, target: THREE.Vector3) {
		const step = cam.position.distanceTo(target) * 0.0005;
		if (cam.position.distanceToSquared(lastPos) > step * step || 1 - Math.abs(cam.quaternion.dot(lastQuat)) > 2e-8) lastMove = clock;
		lastPos.copy(cam.position);
		lastQuat.copy(cam.quaternion);
	}

	$effect(() => {
		const b = built;
		const id = view;
		const extra = fight?.views ?? [];
		if (!b || !controls) return;
		const list = b.activeViews;
		const v = extra.find((x) => x.id === id) ?? list.find((x) => x.id === id) ?? list[0];
		if (!v) return;
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
		noteMotion(cam, controls?.target ?? focus);
		const moving = clock - lastMove < SETTLE;
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
		built.view?.(cam.position, detail);
		fight?.tick(clock, delta);
		if (controls) focus.copy(controls.target);
		else focus.set(built.center[0], 0, built.center[1]);
		atmosphere.update(clock, delta, focus, cam.position);

		// shadows fade back in once the site stands (the shadow pass does not see the rise)
		if (built.rising) return;
		if (wasRising) {
			shadowKey = '';
			shadowReady = false;
		}
		if (sunLight.shadow.intensity < 1) sunLight.shadow.intensity = Math.min(1, sunLight.shadow.intensity + delta * 1.5);
		// redrawing the shadow map costs a frame or more; keep the last one until the camera and sun hold still
		if (shadowReady && (moving || clock - lastLight < LIGHT_SETTLE)) return;

		const reach = THREE.MathUtils.clamp(cam.position.distanceTo(focus) * 0.75, 70, built.radius);
		const key = `${built.root.uuid}|${Math.round(focus.x / (reach * 0.08))}|${Math.round(focus.z / (reach * 0.08))}|${Math.round(Math.log(reach) * 12)}`;
		if (key === shadowKey) return;
		shadowKey = key;
		shadowReady = true;
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

	// a view with labels of its own (the dress lineup) shows only those
	let shownLabels = $derived.by(() => {
		if (!built || !showLabels) return [];
		void year;
		const list = built.activeLabels;
		const own = list.filter((l) => l.view === view);
		return own.length ? own : list.filter((l) => !l.view);
	});
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
		screenSpacePanning
	/>
</T.PerspectiveCamera>

{#each shownLabels as l (l.id)}
	<HTML position={l.at} center pointerEvents="auto" zIndexRange={[20, 0]}>
		<button
			type="button"
			class="tag"
			title="{l.en} — zoom in"
			onpointerdown={(e) => e.stopPropagation()}
			onclick={(e) => {
				e.stopPropagation();
				focusLabel(l);
			}}
		>
			<b>{l.ko}</b>
			<span>{l.en}</span>
		</button>
	</HTML>
{/each}

<style lang="scss">
	.tag {
		display: flex;
		align-items: baseline;
		gap: 0.32rem;
		white-space: nowrap;
		padding: 0.2rem 0.6rem;
		border: 0;
		border-radius: 999px;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Apple SD Gothic Neo', 'Helvetica Neue', system-ui, sans-serif;
		font-size: 0.68rem;
		letter-spacing: -0.005em;
		line-height: 1.2;
		color: rgb(20 20 24 / 0.86);
		background: rgb(255 255 255 / 0.52);
		backdrop-filter: blur(16px) saturate(1.8);
		-webkit-backdrop-filter: blur(16px) saturate(1.8);
		box-shadow: inset 0 0 0 0.5px rgb(255 255 255 / 0.55), 0 2px 10px rgb(0 0 0 / 0.12);
		transform: translateY(-50%);
		cursor: pointer;
		&:hover {
			background: rgb(255 255 255 / 0.72);
		}
		&:focus-visible {
			outline: 2px solid rgb(40 90 200 / 0.55);
			outline-offset: 2px;
		}
		& b {
			color: rgb(20 20 24 / 0.9);
			font-weight: 600;
			font-size: 0.74rem;
		}
		& span {
			color: rgb(20 20 24 / 0.7);
		}
	}
</style>
