<script lang="ts">
	/**
	 * One seat of power: a rounded slab, a disc, or a tall pillar (a slab with
	 * a small footprint). Height encodes rank. It rises from the ground when the
	 * figure plays, and glides to new positions, heights and tones as the
	 * story's step changes.
	 */
	import { T } from '@threlte/core';
	import {
		getKit,
		hex,
		rgbOf,
		toneColor,
		useFollow,
		useReveal,
		type Tone,
		type Vec3
	} from './kit.svelte';
	import { discGeometry, slabGeometry } from './geometry';

	let {
		at = [0, 0, 0],
		shape = 'slab',
		size = [1, 1],
		height = 0.5,
		tone = 'base',
		color,
		delay = 0,
		show = true,
		rotation = [0, 0, 0],
		corner = 0.08,
		glow = 0,
		moveDelay
	}: {
		/** Centre of the footprint; y is the base elevation. */
		at?: Vec3;
		shape?: 'slab' | 'disc';
		/** [width, depth] for slabs; [radius] for discs. */
		size?: [number, number] | [number];
		height?: number;
		tone?: Tone;
		/** The accent (kingdom colour) used by 'accent' / 'hot' / 'dim'. */
		color?: string;
		delay?: number;
		show?: boolean;
		rotation?: Vec3;
		corner?: number;
		/** Emissive lift (0–1) for the one thing the step is about. */
		glow?: number;
		/** When a step change starts moving / recolouring this node (ms after play). */
		moveDelay?: number;
	} = $props();

	const kit = getKit();

	const rise = useReveal(() => ({ delay, show }));
	const later = () => moveDelay ?? delay * 0.3;
	const pos = useFollow(() => at, later);
	const h = useFollow(() => height, later);
	const rot = useFollow(() => rotation, later);
	const target = $derived(toneColor(kit.palette, tone, color));
	const rgb = useFollow(() => rgbOf(target), later, 700);
	const lit = useFollow(() => glow, later, 700);

	const geometry = $derived(
		shape === 'disc' ? discGeometry(size[0]) : slabGeometry(size[0], size[1] ?? size[0], corner)
	);
	const fill = $derived(hex(rgb.current));
</script>

{#if rise.current > 0.002}
	<T.Group position={pos.current} rotation={rot.current}>
		<T.Mesh
			{geometry}
			dispose={false}
			scale={[1, Math.max(0.001, h.current * rise.current), 1]}
			castShadow
			receiveShadow
		>
			<T.MeshStandardMaterial
				color={fill}
				emissive={fill}
				emissiveIntensity={lit.current * 0.45}
				roughness={0.62}
				metalness={0.04}
			/>
		</T.Mesh>
	</T.Group>
{/if}
