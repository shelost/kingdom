<script lang="ts">
	/**
	 * A ring laid on the ground (a council table's edge, a court's orbit, a
	 * frontier). It widens out from its centre when the figure plays.
	 */
	import { T } from '@threlte/core';
	import { getKit, toneColor, useFollow, useReveal, type Tone, type Vec3 } from './kit.svelte';
	import { ringGeometry } from './geometry';

	let {
		at = [0, 0, 0],
		radius,
		tube = 0.03,
		tone = 'base',
		color,
		delay = 0,
		show = true
	}: {
		at?: Vec3;
		radius: number;
		tube?: number;
		tone?: Tone;
		color?: string;
		delay?: number;
		show?: boolean;
	} = $props();

	const kit = getKit();
	const grow = useReveal(() => ({ delay, show }), 900);
	const pos = useFollow(() => at);
	const fill = $derived(toneColor(kit.palette, tone, color));
	const s = $derived(0.4 + 0.6 * grow.current);
</script>

{#if grow.current > 0.002}
	<T.Mesh
		geometry={ringGeometry(radius, tube)}
		dispose={false}
		position={pos.current}
		scale={[s, Math.max(0.001, grow.current), s]}
		receiveShadow
	>
		<T.MeshStandardMaterial color={fill} roughness={0.6} transparent opacity={grow.current} />
	</T.Mesh>
{/if}
