<script lang="ts">
	/**
	 * The Hwarang order as rings: the marshal at the centre, six hwarang
	 * round him, each with four disciples fanned out behind.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, ring } from '../kit.svelte';
	import { MARSHAL } from '../../Hwarang.svelte';

	const kit = getKit();
	$effect(() => kit.fit(box(-4.3, 4.3, -4.2, 4.6, 2.4)));

	const R1 = 2.1;
	const R2 = 3.7;
	const hwarang = ring(6, R1);
	const disciples = hwarang.flatMap((h) =>
		[-1.5, -0.5, 0.5, 1.5].map((k, j) => {
			const a = h.a + (k * 11 * Math.PI) / 180;
			return { key: `${h.i}-${j}`, h, j, x: R2 * Math.cos(a), z: R2 * Math.sin(a) };
		})
	);
</script>

<KitRing radius={R1} tone="dim" color={HUE.silla} delay={80} />
<KitNode shape="disc" size={[0.7]} height={1.3} tone="accent" color={HUE.gold} glow={0.2} />
<KitLabel at={[0, 1.8, 0]} ko={MARSHAL.ko} en={MARSHAL.en} tone="strong" accent={HUE.gold} delay={200} />

{#each hwarang as h (h.i)}
	<KitLink
		points={[
			[h.x * 0.33, 0.03, h.z * 0.33],
			[h.x * 0.86, 0.03, h.z * 0.86]
		]}
		tone="accent"
		color={HUE.silla}
		delay={300 + h.i * 90}
	/>
	<KitNode
		at={[h.x, 0, h.z]}
		size={[0.62, 0.62]}
		height={0.8}
		tone="accent"
		color={HUE.silla}
		rotation={[0, -h.a, 0]}
		delay={420 + h.i * 90}
	/>
	<KitLabel at={[h.x, 1.25, h.z]} ko="화랑" en="Hwarang" size="xs" delay={560 + h.i * 90} />
{/each}

{#each disciples as d (d.key)}
	{#if d.j === 0}
		<KitLink
			points={[
				[d.h.x * 1.18, 0.03, d.h.z * 1.18],
				[d.h.x * 1.6, 0.03, d.h.z * 1.6]
			]}
			tone="dim"
			color={HUE.silla}
			delay={800 + d.h.i * 90}
		/>
	{/if}
	<KitNode
		at={[d.x, 0, d.z]}
		shape="disc"
		size={[0.2]}
		height={0.32}
		tone="dim"
		color={HUE.silla}
		delay={900 + d.h.i * 90 + d.j * 40}
	/>
{/each}

<KitLabel
	at={[0, 0.05, 4.35]}
	ko="6 화랑 · 24 낭도"
	en="each hwarang, four disciples"
	size="xs"
	tone="note"
	accent={HUE.silla}
	delay={1500}
/>
