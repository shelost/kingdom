<script lang="ts">
	/**
	 * Camera, light and ground shared by every diagram scene, plus the kit
	 * context the primitives read. The orthographic camera frames whatever
	 * bounds the scene asks for (`kit.fit`), at the scene's view angle, and
	 * refits on resize. Soft key from the upper left, a weak fill, and a
	 * shadow-only ground so the page itself is the floor in either theme.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { onMount, untrack, type Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { DirectionalLight, OrthographicCamera, Vector3 } from 'three';
	import {
		DEFAULT_VIEW,
		NO_ZOOM,
		box,
		setKit,
		themePalette,
		type Bounds,
		type CanvasProps,
		type View
	} from './kit.svelte';

	let {
		active,
		instant,
		visible,
		reduced,
		zoom = NO_ZOOM,
		onready,
		layer,
		children
	}: Omit<CanvasProps, 'scene' | 'sceneProps'> & {
		layer: HTMLElement | undefined;
		children: Snippet;
	} = $props();

	/** Bumped after every camera update, so label positions re-project. */
	let cameraVersion = $state(0);
	const probe = new Vector3();

	const { size, invalidate } = useThrelte();

	const palette = $derived(themePalette());

	const flatten = ({ min, max }: Bounds, { az, el }: View) => [...min, ...max, az, el];
	/** Bounds + view as one array, so a step that widens the scene glides the camera. */
	const framing = new Tween(flatten(box(-4, 4, -3, 3), DEFAULT_VIEW), {
		duration: 900,
		easing: cubicInOut
	});
	let fitted = false;
	const frame = $derived.by(() => {
		const f = framing.current;
		return {
			bounds: { min: [f[0], f[1], f[2]], max: [f[3], f[4], f[5]] } as Bounds,
			view: { az: f[6], el: f[7] }
		};
	});

	setKit({
		get palette() {
			return palette;
		},
		get active() {
			return active;
		},
		get instant() {
			return instant;
		},
		get visible() {
			return visible;
		},
		get reduced() {
			return reduced;
		},
		get narrow() {
			return size.current.width < 440;
		},
		fit(bounds, view = DEFAULT_VIEW) {
			const snap = !fitted || instant || !visible;
			fitted = true;
			framing.set(flatten(bounds, view), snap ? { duration: 0 } : undefined);
		},
		get layer() {
			return layer;
		},
		project(at) {
			void cameraVersion;
			const cam = camera;
			const { width, height } = size.current;
			if (!cam) return { x: -9999, y: -9999, z: 0 };
			probe.set(at[0], at[1], at[2]).project(cam);
			return {
				x: ((probe.x + 1) / 2) * width,
				y: ((1 - probe.y) / 2) * height,
				z: Math.round((1 - probe.z) * 50)
			};
		}
	});

	let camera = $state.raw<OrthographicCamera>();
	let key = $state.raw<DirectionalLight>();

	const center = $derived(
		new Vector3(
			(frame.bounds.min[0] + frame.bounds.max[0]) / 2,
			(frame.bounds.min[1] + frame.bounds.max[1]) / 2,
			(frame.bounds.min[2] + frame.bounds.max[2]) / 2
		)
	);

	const corners = $derived.by(() => {
		const { min, max } = frame.bounds;
		const out: Vector3[] = [];
		for (const x of [min[0], max[0]])
			for (const y of [min[1], max[1]])
				for (const z of [min[2], max[2]]) out.push(new Vector3(x, y, z));
		return out;
	});

	// Orthographic fit: project the bounds into camera space, then size the
	// frustum to the canvas aspect with a little air around it.
	$effect(() => {
		const cam = camera;
		const { width, height } = size.current;
		if (!cam || !width || !height) return;
		const { az, el } = frame.view;
		const dir = new Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
		cam.position.copy(center).addScaledVector(dir, 60);
		cam.up.set(0, 1, 0);
		cam.lookAt(center);
		cam.updateMatrixWorld(true);

		let x0 = Infinity;
		let x1 = -Infinity;
		let y0 = Infinity;
		let y1 = -Infinity;
		const v = new Vector3();
		for (const c of corners) {
			v.copy(c).applyMatrix4(cam.matrixWorldInverse);
			x0 = Math.min(x0, v.x);
			x1 = Math.max(x1, v.x);
			y0 = Math.min(y0, v.y);
			y1 = Math.max(y1, v.y);
		}
		const pad = 1.04;
		let hw = ((x1 - x0) / 2) * pad;
		let hh = ((y1 - y0) / 2) * pad;
		const aspect = width / height;
		if (hw / hh > aspect) hh = hw / aspect;
		else hw = hh * aspect;
		const { k, x: px, y: py } = zoom;
		const cx = (x0 + x1) / 2 + px * hw;
		const cy = (y0 + y1) / 2 + py * hh;
		hw /= k;
		hh /= k;
		cam.left = cx - hw;
		cam.right = cx + hw;
		cam.top = cy + hh;
		cam.bottom = cy - hh;
		cam.near = 0.1;
		cam.far = 200;
		cam.zoom = 1;
		cam.updateProjectionMatrix();
		untrack(() => cameraVersion++);
		invalidate();
	});

	// The key light rides with the frame; its shadow box hugs the scene.
	$effect(() => {
		const k = key;
		if (!k) return;
		const { min, max } = frame.bounds;
		const half = Math.max(max[0] - min[0], max[2] - min[2], max[1] * 2) * 0.75 + 1;
		k.position.copy(center).add(new Vector3(-0.55, 1, 0.65).normalize().multiplyScalar(30));
		k.target.position.copy(center);
		k.target.updateMatrixWorld();
		const sc = k.shadow.camera;
		sc.left = -half;
		sc.right = half;
		sc.top = half;
		sc.bottom = -half;
		sc.near = 1;
		sc.far = 80;
		sc.updateProjectionMatrix();
		invalidate();
	});

	onMount(() => {
		onready?.(true);
		return () => onready?.(false);
	});
</script>

<T.OrthographicCamera makeDefault manual bind:ref={camera} />

<T.AmbientLight intensity={palette.ambient} />
<T.HemisphereLight color="#ffffff" groundColor={palette.bg} intensity={palette.hemi} />
<T.DirectionalLight
	bind:ref={key}
	castShadow
	intensity={palette.key}
	color={palette.light ? '#fffaf0' : '#fff3df'}
	shadow.mapSize={[1024, 1024]}
	shadow.radius={5}
	shadow.bias={-0.0006}
	shadow.normalBias={0.02}
/>
<T.DirectionalLight position={[6, 4, -3]} intensity={palette.fill} />

<T.Mesh rotation.x={-Math.PI / 2} position.y={-0.002} receiveShadow>
	<T.PlaneGeometry args={[80, 80]} />
	<T.ShadowMaterial
		color={palette.shadow}
		opacity={palette.shadowOpacity}
		transparent
		depthWrite={false}
	/>
</T.Mesh>

{@render children()}
