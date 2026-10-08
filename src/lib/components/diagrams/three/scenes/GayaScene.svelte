<script lang="ts">
	/**
	 * The Gaya league in 3D, laid out roughly as the land lies: six great courts,
	 * each its own purple, with the smaller states as low discs round them. In
	 * the middle, an empty circle where a throne would be. No single crown.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit } from '../kit.svelte';
	import { CX, CY, COURTS, STATES } from '../../GayaLeague.svelte';

	const kit = getKit();
	$effect(() => kit.fit(box(-4.4, 3.6, -3.8, 3.6, 2.2)));

	/** Chart units to scene units. */
	const SCALE = 32;
	const H = 1.2;
	const place = (p: { x: number; y: number }) => ({ x: (p.x - CX) / SCALE, z: (p.y - CY) / SCALE });
	const courts = COURTS.map((c) => ({ ...c, ...place(c) }));
	const states = STATES.map((s) => ({ ...s, ...place(s), size: s.r / SCALE, height: 0.25 + s.r / 40 }));
</script>

<!-- the empty centre -->
<KitRing radius={0.45} tube={0.03} tone="accent" color={HUE.gaya} delay={0} />
<KitLabel at={[0, 0.2, 0]} ko="가야" en="league" size="sm" tone="accent" accent={HUE.gaya} delay={200} />

{#each courts as c (c.i)}
	<KitLink
		points={[
			[c.x * 0.15, 0.03, c.z * 0.15],
			[c.x * 0.86, 0.03, c.z * 0.86]
		]}
		tone="dim"
		color={c.shade}
		delay={140 + c.i * 70}
	/>
	<KitNode
		at={[c.x, 0, c.z]}
		shape="disc"
		size={[0.5]}
		height={H}
		tone="accent"
		color={c.shade}
		delay={500 + c.i * 100}
	/>
	<KitLabel at={[c.x, H + 0.4, c.z]} ko={c.ko} en={c.en} size="sm" delay={650 + c.i * 100} />
{/each}

{#each states as s (s.i)}
	<KitNode
		at={[s.x, 0, s.z]}
		shape="disc"
		size={[s.size]}
		height={s.height}
		tone="dim"
		color={HUE.gaya}
		delay={1100 + s.i * 50}
	/>
	<KitLabel at={[s.x, s.height + 0.25, s.z]} ko={s.ko} en={s.en} size="xs" tone="muted" minor delay={1200 + s.i * 50} />
{/each}

<KitLabel
	at={[0, 0.05, 3.5]}
	ko="여섯 가야와 작은 나라들"
	en="no single crown"
	size="xs"
	tone="note"
	accent={HUE.gaya}
	delay={1800}
/>
