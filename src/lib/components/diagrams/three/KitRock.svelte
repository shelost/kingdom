<script lang="ts">
	/**
	 * A boulder: for the places in a chart that are things, not seats (the
	 * Rock of Politics). Low-poly and flat-shaded; it rises like a node.
	 */
	import { T } from '@threlte/core';
	import { getKit, hex, rgbOf, toneColor, useReveal, type Tone, type Vec3 } from './kit.svelte';
	import { rockGeometry } from './geometry';

	let {
		at = [0, 0, 0],
		size = 1,
		height = 0.7,
		tone = 'dim',
		color,
		turn = 0,
		delay = 0,
		show = true
	}: {
		at?: Vec3;
		/** Radius in plan. */
		size?: number;
		height?: number;
		tone?: Tone;
		color?: string;
		/** Spin about y (radians), so two rocks in one scene don't match. */
		turn?: number;
		delay?: number;
		show?: boolean;
	} = $props();

	const kit = getKit();
	const rise = useReveal(() => ({ delay, show }));
	const fill = $derived(hex(rgbOf(toneColor(kit.palette, tone, color))));
</script>

{#if rise.current > 0.002}
	<T.Mesh
		geometry={rockGeometry()}
		dispose={false}
		position={at}
		rotation={[0, turn, 0]}
		scale={[size, Math.max(0.001, height * rise.current), size * 0.82]}
		castShadow
		receiveShadow
	>
		<T.MeshStandardMaterial color={fill} roughness={0.92} metalness={0} flatShading />
	</T.Mesh>
{/if}
