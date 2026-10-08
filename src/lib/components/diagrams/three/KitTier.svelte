<script lang="ts">
	/**
	 * Stacked platforms, bottom first: a ziggurat of ranks. Each level is a
	 * KitNode sitting on the one below; they rise from the base up.
	 */
	import KitNode from './KitNode.svelte';
	import { stack, type Level, type Tone, type Vec3 } from './kit.svelte';

	type TierLevel = Level & { tone?: Tone; color?: string; glow?: number };

	let {
		levels,
		at = [0, 0, 0],
		delay = 0,
		stagger = 140
	}: {
		/** Bottom level first. */
		levels: TierLevel[];
		at?: Vec3;
		delay?: number;
		stagger?: number;
	} = $props();

	const placed = $derived(stack(levels, at[1]));
</script>

{#each placed as l, i (i)}
	<KitNode
		at={[at[0], l.y, at[2]]}
		size={[l.w, l.d]}
		height={l.h}
		tone={l.tone ?? 'base'}
		color={l.color}
		glow={l.glow ?? 0}
		corner={0.06}
		delay={delay + i * stagger}
	/>
{/each}
