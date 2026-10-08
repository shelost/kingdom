<script lang="ts">
	/**
	 * The mandate coming down: Hwanin's sky slab high at the back, Hwanung
	 * lower, Dangun standing on the ground, Asadal laid flat at the front.
	 * One gold beam carries it down, step by step.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { HUE, box, getKit, type Vec3 } from '../kit.svelte';
	import { NODES } from '../../JoseonMandate.svelte';

	const kit = getKit();
	$effect(() => kit.fit(box(-2.8, 2.8, -3.4, 3.2, 4.4), { az: 0.55, el: 0.42 }));

	/** Base of each node; heaven floats, earth sits. */
	const AT: Vec3[] = [
		[0, 3.3, -2.6],
		[0, 2.0, -1.0],
		[0, 0, 0.6],
		[0, 0, 2.2]
	];
	const SIZE: [number, number][] = [
		[2.4, 1.2],
		[1.8, 1.0],
		[0.9, 0.9],
		[3.2, 1.3]
	];
	const H = [0.22, 0.22, 1.3, 0.12];
	const TONE = ['hot', 'accent', 'accent', 'dim'] as const;
	const nodes = NODES.map((n, i) => ({ ...n, i, at: AT[i], size: SIZE[i], h: H[i], tone: TONE[i] }));
</script>

{#each nodes as n (n.en)}
	{@const next = nodes[n.i + 1]}
	{#if next}
		<KitLink
			points={[
				[0, n.at[1], n.at[2]],
				[0, next.at[1] + next.h, next.at[2]]
			]}
			radius={0.04}
			tone="accent"
			color={HUE.joseon}
			pulse
			phase={n.i / 3}
			delay={350 + n.i * 380}
		/>
	{/if}
	<KitNode
		at={n.at}
		size={n.size}
		height={n.h}
		tone={n.tone}
		color={HUE.joseon}
		glow={n.i === 0 ? 0.35 : 0}
		delay={n.i * 380}
	/>
	<KitLabel
		at={[n.size[0] / 2 + 0.75, n.at[1] + n.h * 0.6, n.at[2]]}
		ko={n.ko}
		en={n.en}
		size={n.i === 2 ? 'md' : 'sm'}
		tone={n.i === 2 ? 'accent' : 'plain'}
		accent={HUE.joseon}
		delay={150 + n.i * 380}
	/>
{/each}
