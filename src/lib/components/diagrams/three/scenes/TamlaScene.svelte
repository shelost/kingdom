<script lang="ts">
	/**
	 * Tamla's three princes rising out of one hole in the ground: a dark
	 * well mouth, three beams climbing out of it, three pillars standing
	 * side by side on the island.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit } from '../kit.svelte';
	import { PRINCES } from '../../TamlaPrinces.svelte';

	const kit = getKit();
	$effect(() => kit.fit(box(-3.6, 3.6, -1.8, 2.6, 2.6)));

	const XS = [-2.3, 0, 2.3];
	const H = 1.25;
</script>

<!-- the island and the well -->
<KitNode at={[0, -0.06, 0.2]} shape="disc" size={[3.4]} height={0.06} tone="dim" color={HUE.tamla} />
<KitNode at={[0, 0, 1.4]} shape="disc" size={[0.55]} height={0.02} tone="ghost" delay={100} />
<KitRing at={[0, 0.02, 1.4]} radius={0.6} tube={0.06} tone="accent" color={HUE.tamla} delay={150} />
<KitLabel at={[0, 0.05, 2.25]} ko="삼성혈" en="the three holes" size="xs" tone="note" accent={HUE.tamla} delay={300} />

{#each PRINCES as p, i (p.en)}
	<KitLink
		points={[
			[0, 0.04, 1.4],
			[XS[i] * 0.5, 0.6, 0.7],
			[XS[i], H * 0.6, 0]
		]}
		tone="accent"
		color={HUE.tamla}
		pulse
		phase={i / 3}
		delay={400 + i * 140}
	/>
	<KitNode
		at={[XS[i], 0, 0]}
		shape="disc"
		size={[0.48]}
		height={H}
		tone={i === 1 ? 'hot' : 'accent'}
		color={HUE.tamla}
		delay={800 + i * 150}
	/>
	<KitLabel at={[XS[i], H + 0.45, 0]} ko={p.ko} en={p.en} size="sm" delay={950 + i * 150} />
{/each}
