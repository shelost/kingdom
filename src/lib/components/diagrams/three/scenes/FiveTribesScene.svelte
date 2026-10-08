<script lang="ts">
	/**
	 * Jolbon's five animal roofs in 3D: five chief pillars (faces on top) on
	 * a ring round the Jolbon hearth. The Crow's roof stands tallest.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, ring } from '../kit.svelte';
	import { TRIBES_BASE, faceOf, jolbonHref } from '../../FiveTribes.svelte';

	const kit = getKit();
	$effect(() => kit.fit(box(-4.2, 4.2, -4.4, 4.3, 3.6)));

	const R = 3.0;
	const tribes = ring(5, R).map((p, i) => ({
		...p,
		...TRIBES_BASE[i],
		href: faceOf(TRIBES_BASE[i].id),
		h: i === 0 ? 1.9 : 1.1
	}));
	const hub = jolbonHref();
</script>

<KitRing radius={R} tone="accent" color={HUE.jolbon} delay={80} />
<KitNode shape="disc" size={[0.95]} height={0.28} tone="accent" color={HUE.jolbon} />
<KitLabel at={[0, 0.9, 0]} ko="졸본" en="five roofs" img={hub} accent={HUE.jolbon} tone="strong" delay={150} />

{#each tribes as t (t.id)}
	<KitLink
		points={[
			[t.x * 0.33, 0.03, t.z * 0.33],
			[t.x * 0.85, 0.03, t.z * 0.85]
		]}
		tone="accent"
		color={HUE.jolbon}
		delay={140 + t.i * 70}
	/>
	<KitNode
		at={[t.x, 0, t.z]}
		shape="disc"
		size={[0.48]}
		height={t.h}
		tone={t.i === 0 ? 'hot' : 'accent'}
		color={HUE.jolbon}
		glow={t.i === 0 ? 0.25 : 0}
		delay={500 + t.i * 100}
	/>
	<KitLabel
		at={[t.x, t.h + 0.55, t.z]}
		ko={t.ko}
		en={t.en}
		img={t.href}
		accent={HUE.jolbon}
		size="xs"
		delay={650 + t.i * 100}
	/>
{/each}

<KitLabel
	at={[0, 0.05, 3.95]}
	ko="오부족"
	en="later the five commanderies"
	size="xs"
	tone="note"
	accent={HUE.jolbon}
	delay={1300}
/>
