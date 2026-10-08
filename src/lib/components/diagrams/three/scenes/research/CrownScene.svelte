<script lang="ts">
	/**
	 * A Silla gold crown in the round: the headband, three 出-shaped tree
	 * uprights at the front, two antlers behind, comma jades and spangles on
	 * every arm, and long pendants falling at the temples.
	 */
	import { T } from '@threlte/core';
	import KitLabel from '../../KitLabel.svelte';
	import Part from './Part.svelte';
	import { box } from '../../kit.svelte';
	import { around, useOrbit } from './orbit.svelte';

	useOrbit(box(-1.9, 1.9, -1.5, 1.5, 3.7), [
		{ az: 0.38, el: 0.3 },
		{ az: -1.0, el: 0.36 },
		{ az: 2.4, el: 0.42 }
	]);

	const R = 1;
	const BAND = 1.6;
	const TREES = [-1.15, 0, 1.15];
	const ANTLERS = [-2.25, 2.25];
	const TIERS = [0, 1, 2].map((i) => ({ y: 0.35 + i * 0.4, w: 0.62 - i * 0.1 }));
	const SPANGLES = Array.from({ length: 28 }, (_, i) => (i / 28) * Math.PI * 2);
</script>

<!-- headband, with a row of spangles -->
<Part shape="cyl" args={[R, R, 0.32]} at={[0, BAND, 0]} mat="gold" open facets={64} delay={150} />
{#each SPANGLES as a (a)}
	<Part shape="ball" args={[0.04]} at={around(R + 0.03, a, BAND - 0.05)} mat="gold" delay={400} />
{/each}

<!-- 出-shaped trees -->
{#each TREES as a, k (a)}
	<T.Group position={around(R, a, BAND + 0.14)} rotation={[0, a, 0]}>
		<Part shape="box" args={[0.07, 1.55, 0.025]} at={[0, 0.78, 0]} mat="gold" delay={500 + k * 120} />
		{#each TIERS as t (t.y)}
			<Part shape="box" args={[t.w, 0.06, 0.025]} at={[0, t.y, 0]} mat="gold" delay={650 + k * 120} />
			{#each [-1, 1] as s (s)}
				<Part shape="box" args={[0.06, 0.3, 0.025]} at={[(s * t.w) / 2, t.y + 0.15, 0]} mat="gold" delay={700 + k * 120} />
				<Part shape="ball" args={[0.04]} at={[(s * t.w) / 2, t.y + 0.33, 0.03]} mat="gold" delay={900 + k * 120} />
			{/each}
			<Part shape="arc" args={[0.05, 0.028, Math.PI * 1.3]} at={[0.12, t.y - 0.1, 0.04]} rot={[0, 0, -0.6]} mat="jade" delay={1000 + k * 120} />
		{/each}
		<Part shape="ball" args={[0.07]} at={[0, 1.6, 0]} scale={[0.8, 1.2, 0.5]} mat="gold" delay={850 + k * 120} />
	</T.Group>
{/each}

<!-- antlers behind -->
{#each ANTLERS as a, k (a)}
	{@const s = a < 0 ? -1 : 1}
	<T.Group position={around(R, a, BAND + 0.14)} rotation={[0, a, 0]}>
		<Part shape="box" args={[0.07, 1.3, 0.025]} at={[0, 0.65, 0]} rot={[0, 0, s * 0.08]} mat="gold" delay={1000 + k * 120} />
		<Part shape="box" args={[0.05, 0.55, 0.025]} at={[s * 0.18, 0.75, 0]} rot={[0, 0, -s * 0.6]} mat="gold" delay={1100 + k * 120} />
		<Part shape="box" args={[0.05, 0.45, 0.025]} at={[s * 0.14, 1.12, 0]} rot={[0, 0, -s * 0.5]} mat="gold" delay={1150 + k * 120} />
		{#each [0.5, 0.95, 1.3] as y (y)}
			<Part shape="ball" args={[0.04]} at={[s * 0.05, y, 0.03]} mat="gold" delay={1250} />
		{/each}
	</T.Group>
{/each}

<!-- pendants at the temples -->
{#each [-Math.PI / 2, Math.PI / 2] as a (a)}
	<T.Group position={around(R + 0.02, a, BAND - 0.16)} rotation={[0, a, 0]}>
		{#each [0, 1, 2, 3] as i (i)}
			<Part shape="box" args={[0.025, 0.2, 0.025]} at={[0, -0.12 - i * 0.28, 0]} mat="gold" delay={1300 + i * 60} />
			<Part shape="ball" args={[0.07]} at={[0, -0.27 - i * 0.28, 0]} scale={[0.75, 1.1, 0.25]} mat="gold" delay={1340 + i * 60} />
		{/each}
		<Part shape="arc" args={[0.08, 0.04, Math.PI * 1.3]} at={[0.04, -1.32, 0]} rot={[0, 0, -0.6]} mat="jade" delay={1600} />
	</T.Group>
{/each}

<KitLabel at={[0, BAND - 0.05, R + 0.25]} ko="관테" en="headband" size="sm" tone="plain" delay={900} />
<KitLabel at={[0, BAND + 2.0, 0.9]} ko="出자 모양 세움장식" en="出-shaped tree uprights" size="xs" tone="note" delay={1300} />
<KitLabel at={around(1.25, 2.25, BAND + 1.1)} ko="사슴뿔 모양" en="antler uprights" size="xs" tone="note" minor delay={1450} />
<KitLabel at={[-R - 0.55, BAND - 0.9, 0]} ko="드리개" en="pendants" size="xs" tone="note" delay={1650} />
<KitLabel at={[R + 0.6, BAND + 0.65, 0.4]} ko="곱은옥 · 달개" en="comma jades · spangles" size="xs" tone="note" minor delay={1700} />
