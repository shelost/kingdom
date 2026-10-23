<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { MeshBasicMaterial, Vector3 } from 'three';
	import {
		VOLUMES,
		bookPose,
		cameraPose,
		cameraTarget,
		type BookMode,
		type PointerNdc
	} from '$lib/books';
	import { bookView } from '$lib/bookView.svelte';
	import Glide from './Glide.svelte';
	import VolumeBook from './VolumeBook.svelte';

	let {
		hovered,
		selected = null,
		reduced = false,
		narrow = false,
		covers,
		pointer,
		mode = 'shelf',
		ko = false,
		onhover,
		onopen,
		onback
	}: {
		hovered: string | null;
		selected?: string | null;
		reduced?: boolean;
		narrow?: boolean;
		covers: Record<string, string>;
		pointer: PointerNdc;
		mode?: BookMode;
		ko?: boolean;
		onhover: (id: string | null) => void;
		onopen: (id: string) => void;
		onback: () => void;
	} = $props();

	const { scene, camera, renderer, autoRenderTask } = useThrelte();
	$effect(() => {
		autoRenderTask.start();
	});
	interactivity({ filter: (hits) => hits.slice(0, 1) });

	const stiffness = $derived(reduced ? 1400 : 95);
	const missMat = new MeshBasicMaterial({
		transparent: true,
		opacity: 0,
		depthWrite: false,
		colorWrite: false
	});
	$effect(() => () => missMat.dispose());

	function miss(e: { stopPropagation?: () => void }) {
		e.stopPropagation?.();
		onback();
	}

	const camPos = new Vector3();
	const camVel = new Vector3();
	const look = new Vector3();
	const lookVel = new Vector3();
	const camGoal = new Vector3();
	const lookGoal = new Vector3();
	let camReady = false;

	function snapCamera(live: { position: Vector3; lookAt: (v: Vector3) => void }) {
		const pose = cameraPose(!!selected, narrow, bookView.mode);
		const target = cameraTarget(!!selected, narrow, bookView.mode);
		camGoal.set(pose.position[0], pose.position[1], pose.position[2]);
		lookGoal.set(target[0], target[1], target[2]);
		camPos.copy(camGoal);
		look.copy(lookGoal);
		camVel.set(0, 0, 0);
		lookVel.set(0, 0, 0);
		live.position.copy(camPos);
		live.lookAt(look);
		camReady = true;
	}

	function spring(cur: number, v: number, g: number, k: number, c: number, dt: number): [number, number] {
		const f = -k * (cur - g) - c * v;
		const nv = v + f * dt;
		return [cur + nv * dt, nv];
	}

	useTask((delta) => {
		const live = camera.current;
		if (!live) return;
		const pose = cameraPose(!!selected, narrow, bookView.mode);
		const target = cameraTarget(!!selected, narrow, bookView.mode);
		camGoal.set(pose.position[0], pose.position[1], pose.position[2]);
		lookGoal.set(target[0], target[1], target[2]);
		if (!camReady) {
			snapCamera(live);
			return;
		}
		const k = stiffness;
		const c = 2 * Math.sqrt(k);
		const dt = Math.min(delta, 1 / 30);
		;[camPos.x, camVel.x] = spring(camPos.x, camVel.x, camGoal.x, k, c, dt);
		;[camPos.y, camVel.y] = spring(camPos.y, camVel.y, camGoal.y, k, c, dt);
		;[camPos.z, camVel.z] = spring(camPos.z, camVel.z, camGoal.z, k, c, dt);
		;[look.x, lookVel.x] = spring(look.x, lookVel.x, lookGoal.x, k, c, dt);
		;[look.y, lookVel.y] = spring(look.y, lookVel.y, lookGoal.y, k, c, dt);
		;[look.z, lookVel.z] = spring(look.z, lookVel.z, lookGoal.z, k, c, dt);
		live.position.copy(camPos);
		live.lookAt(look);
		renderer.render(scene, live);
	});
</script>

<T.PerspectiveCamera
	makeDefault
	fov={38}
	near={0.08}
	far={24}
	position={cameraPose(false, narrow, mode).position}
	oncreate={(ref) => {
		snapCamera(ref);
	}}
/>

<T.HemisphereLight color="#f2ebe0" groundColor="#1a1410" intensity={selected ? 0.7 : 1} />
<T.DirectionalLight
	castShadow={!selected}
	position={[0.4, 2.2, 3.4]}
	intensity={selected ? 1.6 : 2.1}
	shadow.bias={-0.0004}
	shadow.mapSize={[1024, 1024]}
/>
<T.DirectionalLight position={[-1.8, 1.2, 1.6]} intensity={0.45} color="#c4d4ee" />
<T.AmbientLight intensity={0.32} />

{#if selected}
	<T.Mesh position={[0, 0, -1.2]} material={missMat} onclick={miss}>
		<T.PlaneGeometry args={[80, 80]} />
	</T.Mesh>
{/if}

{#each VOLUMES as volume (volume.id)}
	<Glide {stiffness} pose={() => bookPose(volume, selected, hovered, pointer, narrow, bookView.mode)}>
		<VolumeBook
			{volume}
			cover={covers[volume.id]}
			featured={selected === volume.id}
			dimmed={false}
			{ko}
			onhover={(id) => {
				if (!selected) onhover(id);
			}}
			onleave={(id) => {
				if (hovered === id) onhover(null);
			}}
			{onopen}
		/>
	</Glide>
{/each}
