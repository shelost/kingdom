<script module lang="ts">
	export type Quarter = {
		ko: string;
		en: string;
		han: string;
		who: string;
		whoEn: string;
		fill: string;
		/** Glows and gets a ring: the one man on both rosters. */
		hot?: boolean;
		/** Tipped over and greyed. */
		fallen?: boolean;
		note?: { ko?: string; en: string };
	};
</script>

<script lang="ts">
	/**
	 * Four colour plinths at the compass points round an emperor's dais —
	 * white west, red south, blue east, black north. Shared by the Four
	 * Dragons and the Four Beasts.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, type Vec3 } from '../kit.svelte';

	let {
		emperor,
		quarters,
		heir,
		foot
	}: {
		emperor: { ko: string; en: string };
		/** White, Red, Blue, Black — in that order. */
		quarters: readonly Quarter[];
		/** A successor plinth set behind the fallen quarter. */
		heir?: { ko: string; en: string };
		foot: { ko?: string; en: string };
	} = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-5.0, 5.0, -4.4, 4.7, 2.4)));

	const D = 2.9;
	const AT: Vec3[] = [
		[-D, 0, 0],
		[0, 0, D * 0.8],
		[D, 0, 0],
		[0, 0, -D * 0.8]
	];
	const fallenAt = $derived(quarters.findIndex((q) => q.fallen));
</script>

<KitNode shape="disc" size={[0.95]} height={0.5} tone="accent" color={HUE.tang} />
<KitLabel at={[0, 1.05, 0]} ko={emperor.ko} en={emperor.en} tone="strong" accent={HUE.tang} delay={150} />

{#each quarters as q, i (q.en)}
	{@const [x, , z] = AT[i]}
	{@const h = q.hot ? 1.4 : 0.9}
	<KitLink
		points={[
			[x * 0.32, 0.03, z * 0.32],
			[x * 0.8, 0.03, z * 0.8]
		]}
		tone={q.fallen ? 'ghost' : 'accent'}
		color={q.fallen ? undefined : q.fill}
		delay={300 + i * 110}
	/>
	{#if q.hot}
		<KitRing at={[x, 0, z]} radius={0.85} tone="hot" color={q.fill} delay={1000} />
	{/if}
	<KitNode
		at={q.fallen ? [x, 0.36, z] : [x, 0, z]}
		size={[1.05, 0.72]}
		height={h}
		tone={q.fallen ? 'ghost' : 'accent'}
		color={q.fill}
		glow={q.hot ? 0.3 : 0}
		rotation={q.fallen ? [0, 0.3, Math.PI / 2] : [0, 0, 0]}
		delay={450 + i * 120}
	/>
	<KitLabel
		at={[x, q.fallen ? 1.05 : h + 0.45, z]}
		ko={q.ko}
		han={q.han}
		en={q.en}
		size="sm"
		tone={q.fallen ? 'muted' : 'accent'}
		accent={q.fill}
		struck={q.fallen}
		delay={600 + i * 120}
	/>
	<KitLabel
		at={z === 0 ? [x * 1.38, 0.05, 0.62] : [z > 0 ? 1.35 : -1.35, 0.05, z + 0.3]}
		ko={q.who}
		en={q.whoEn}
		size="xs"
		tone="note"
		accent={q.fill}
		struck={q.fallen}
		delay={760 + i * 120}
	/>
	{#if q.note}
		<KitLabel
			at={z === 0 ? [x * 1.38, 0.05, 1.3] : [z > 0 ? 1.35 : -1.35, 0.05, z + 0.95]}
			ko={q.note.ko}
			en={q.note.en}
			size="xs"
			tone="note"
			accent={q.fill}
			minor
			delay={1200}
		/>
	{/if}
{/each}

{#if heir && fallenAt >= 0}
	{@const [x, , z] = AT[fallenAt]}
	<KitLink
		points={[
			[x, 0.03, z],
			[x - 0.2, 0.03, z - 1.6]
		]}
		tone="accent"
		color={quarters[fallenAt].fill}
		delay={1300}
	/>
	<KitNode
		at={[x - 0.2, 0, z - 1.75]}
		size={[0.85, 0.6]}
		height={0.9}
		tone="accent"
		color={quarters[fallenAt].fill}
		delay={1400}
	/>
	<KitLabel
		at={[x - 0.2, 1.35, z - 1.75]}
		ko={heir.ko}
		en={heir.en}
		size="xs"
		tone="accent"
		accent={quarters[fallenAt].fill}
		delay={1500}
	/>
{/if}

<KitLabel at={[0, 0.05, 4.25]} ko={foot.ko} en={foot.en} size="xs" tone="note" accent={HUE.tang} delay={1600} />
