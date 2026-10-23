<script lang="ts">
	/**
	 * The King's 王 laid in gold bars on a summit: three across, one down, centred on
	 * the platform's top. Optionally the 왕 · King label floats behind it.
	 */
	import KitNode from './KitNode.svelte';
	import KitLabel from './KitLabel.svelte';
	import { HUE, type Vec3 } from './kit.svelte';
	import { KING, enFor } from '../BoneRank.svelte';

	let {
		at,
		w,
		d = w,
		label = true,
		delay = 0
	}: {
		/** Centre of the summit's top face. */
		at: Vec3;
		/** Summit width (the glyph scales to a third of it). */
		w: number;
		d?: number;
		label?: boolean;
		delay?: number;
	} = $props();

	const STROKE = 0.17;
	const bars = $derived.by(() => {
		const s = w * 0.33;
		const [x, y, z] = at;
		return [
			{ at: [x, y, z - s] as Vec3, size: [s * 1.7, STROKE] as [number, number] },
			{ at: [x, y, z] as Vec3, size: [s * 1.45, STROKE] as [number, number] },
			{ at: [x, y, z + s] as Vec3, size: [s * 2.0, STROKE] as [number, number] },
			{ at: [x, y, z] as Vec3, size: [STROKE, s * 2 + STROKE] as [number, number] }
		];
	});
</script>

{#each bars as b, i (i)}
	<KitNode at={b.at} size={b.size} height={0.09} corner={0.03} tone="accent" color={HUE.gold} glow={0.3} delay={delay + i * 80} />
{/each}
{#if label}
	<KitLabel
		at={[at[0], at[1] + 0.75, at[2] - d / 2]}
		ko={KING.ko}
		han={KING.han}
		en={enFor(KING.en)}
		size="sm"
		tone="strong"
		delay={delay + 100}
	/>
{/if}
