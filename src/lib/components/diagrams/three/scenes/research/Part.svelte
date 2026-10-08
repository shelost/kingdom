<script lang="ts" module>
	export type Shape = 'box' | 'cyl' | 'cone' | 'ball' | 'torus' | 'arc';

	/**
	 * Material presets for dress and armour; any other string is a plain colour.
	 * The kit has no environment map, so metals keep metalness low or they render near black.
	 */
	export const MATS = {
		gold: { color: '#f0c24e', metalness: 0.45, roughness: 0.32 },
		silver: { color: '#e2e7ec', metalness: 0.4, roughness: 0.32 },
		bronze: { color: '#d4a548', metalness: 0.4, roughness: 0.38 },
		steel: { color: '#a3adb8', metalness: 0.4, roughness: 0.42 },
		iron: { color: '#767b84', metalness: 0.35, roughness: 0.55 },
		lacquer: { color: '#18181c', metalness: 0.2, roughness: 0.18 },
		silk: { color: '#1f1f25', metalness: 0.15, roughness: 0.32 },
		feather: { color: '#b98a4e', metalness: 0, roughness: 0.85 },
		bark: { color: '#c9a77a', metalness: 0, roughness: 0.8 },
		jade: { color: '#4f9a6a', metalness: 0.1, roughness: 0.25 },
		red: { color: '#b8303f', metalness: 0.05, roughness: 0.5 },
		hemp: { color: '#ece6da', metalness: 0, roughness: 0.75 },
		leather: { color: '#3a2a20', metalness: 0.05, roughness: 0.6 }
	} as const;

	export type Mat = keyof typeof MATS;
</script>

<script lang="ts">
	/**
	 * One solid of a dress or armour model: a primitive, a material preset and
	 * a grow-in reveal. `args` are the three.js constructor arguments of the
	 * shape (box w,h,d · cyl rTop,rBottom,h · cone r,h · ball r · torus R,r ·
	 * arc R,r,angle).
	 */
	import { T } from '@threlte/core';
	import { DoubleSide, FrontSide } from 'three';
	import { useReveal, type Vec3 } from '../../kit.svelte';

	let {
		shape,
		args,
		at = [0, 0, 0],
		rot = [0, 0, 0],
		scale = [1, 1, 1],
		mat = 'steel',
		delay = 0,
		show = true,
		open = false,
		facets,
		opacity = 1
	}: {
		shape: Shape;
		args: number[];
		at?: Vec3;
		rot?: Vec3;
		scale?: Vec3;
		/** A preset name or a hex colour (matte cloth). */
		mat?: Mat | string;
		delay?: number;
		show?: boolean;
		/** Open-ended cylinder, seen from both sides (crown bands). */
		open?: boolean;
		/** Radial segments; few + flat shading reads as pleats or lames. */
		facets?: number;
		opacity?: number;
	} = $props();

	const rise = useReveal(() => ({ delay, show }));
	const preset = $derived(
		mat in MATS ? MATS[mat as Mat] : { color: mat, metalness: 0.05, roughness: 0.55 }
	);
	const flat = $derived(facets !== undefined && facets < 20);
	const seg = $derived(facets ?? 32);
	const s = $derived(Math.max(0.001, rise.current));
	const shown = $derived(scale.map((v) => v * s) as Vec3);
</script>

{#if rise.current > 0.002}
	<T.Mesh position={at} rotation={rot} scale={shown} castShadow receiveShadow>
		{#if shape === 'box'}
			<T.BoxGeometry args={[args[0], args[1], args[2]]} />
		{:else if shape === 'cyl'}
			<T.CylinderGeometry args={[args[0], args[1], args[2], seg, 1, open]} />
		{:else if shape === 'cone'}
			<T.ConeGeometry args={[args[0], args[1], seg]} />
		{:else if shape === 'ball'}
			<T.SphereGeometry args={[args[0], 24, 16]} />
		{:else if shape === 'torus'}
			<T.TorusGeometry args={[args[0], args[1], 10, 48]} />
		{:else}
			<T.TorusGeometry args={[args[0], args[1], 8, 16, args[2]]} />
		{/if}
		<T.MeshStandardMaterial
			color={preset.color}
			metalness={preset.metalness}
			roughness={preset.roughness}
			flatShading={flat}
			side={open ? DoubleSide : FrontSide}
			transparent={opacity < 1}
			{opacity}
		/>
	</T.Mesh>
{/if}
