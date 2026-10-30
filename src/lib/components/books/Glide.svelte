<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Euler, Group, Quaternion, Vector3 } from 'three';
	import type { Snippet } from 'svelte';
	import type { BookPose } from '$lib/books';

	let {
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		scale = 1,
		stiffness = 46,
		pose,
		children
	}: {
		position?: [number, number, number];
		rotation?: [number, number, number];
		scale?: number;
		stiffness?: number;
		pose?: () => BookPose;
		children?: Snippet;
	} = $props();

	const damping = $derived(2.35 * Math.sqrt(stiffness));
	const STEP = 1 / 120;
	const MAX = 8;
	const ROT_K = 9;

	const pos = new Vector3();
	const vel = new Vector3();
	const goal = new Vector3();
	const qNow = new Quaternion();
	const qGoal = new Quaternion();
	const euler = new Euler(0, 0, 0, 'YXZ');
	let sc = 1;
	let scVel = 0;
	let ready = false;
	let group = $state.raw<Group | undefined>(undefined);

	function spring(cur: number, v: number, g: number, k: number, c: number, dt: number): [number, number] {
		const f = -k * (cur - g) - c * v;
		const nv = v + f * dt;
		return [cur + nv * dt, nv];
	}

	function apply(next: BookPose) {
		goal.set(next.position[0], next.position[1], next.position[2]);
		euler.set(next.rotation[0], next.rotation[1], next.rotation[2]);
		qNow.setFromEuler(euler);
		sc = next.scale;
		pos.copy(goal);
		if (!group) return;
		group.position.copy(pos);
		group.quaternion.copy(qNow);
		group.scale.setScalar(sc);
	}

	function tick(dt: number) {
		if (!group) return;
		const next = pose?.() ?? { position, rotation, scale };
		goal.set(next.position[0], next.position[1], next.position[2]);
		const rot = next.rotation;
		const scGoal = next.scale;
		if (!ready) {
			apply(next);
			ready = true;
			return;
		}
		const k = stiffness;
		const c = damping;
		;[pos.x, vel.x] = spring(pos.x, vel.x, goal.x, k, c, dt);
		;[pos.y, vel.y] = spring(pos.y, vel.y, goal.y, k, c, dt);
		;[pos.z, vel.z] = spring(pos.z, vel.z, goal.z, k, c, dt);
		group.position.copy(pos);

		euler.set(rot[0], rot[1], rot[2]);
		qGoal.setFromEuler(euler);
		if (qNow.dot(qGoal) < 0) qGoal.set(-qGoal.x, -qGoal.y, -qGoal.z, -qGoal.w);
		qNow.slerp(qGoal, 1 - Math.exp(-ROT_K * dt));
		group.quaternion.copy(qNow);

		;[sc, scVel] = spring(sc, scVel, scGoal, k, c, dt);
		group.scale.setScalar(sc);
	}

	useTask(
		(delta) => {
			const steps = Math.min(MAX, Math.ceil(delta / STEP));
			const dt = Math.min(delta / steps, STEP * 2);
			for (let i = 0; i < steps; i++) tick(dt);
		},
		{ autoInvalidate: false }
	);
</script>

<T.Group
	oncreate={(ref) => {
		group = ref;
		apply(pose?.() ?? { position, rotation, scale });
		ready = true;
	}}
>
	{@render children?.()}
</T.Group>
