<script lang="ts">
	/**
	 * Bone Rank as a tall ziggurat: commoners the broad base, the lowest head
	 * ranks fading yellow above them, Sacred Bone the last small platform,
	 * and the King's 王 laid in gold bars on the summit. Each riser carries
	 * its bone; each tread says how high that bone's office can climb. In
	 * 'chunchu' a fence closes round the summit and the True Bone pawn
	 * stands one step short of it.
	 */
	import KitNode from '../KitNode.svelte';
	import KitTier from '../KitTier.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import KitLink from '../KitLink.svelte';
	import { HUE, box, getKit, mix, stack, type Vec3 } from '../kit.svelte';
	import { KING, LAYERS, enFor } from '../../BoneRank.svelte';

	let { step = 'ranks' }: { step?: string } = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-6.3, 4.6, -4.4, 4.4, 8.6), { az: 0.42, el: 0.5 }));

	const H = 0.85;
	const APEX_W = 1.7;
	const STEP_W = 0.9;
	const chunchu = $derived(step === 'chunchu');

	// Bottom first for stacking; LAYERS lists the apex first.
	const levels = $derived(
		[...LAYERS].reverse().map((l, k) => {
			const w = APEX_W + (LAYERS.length - 1 - k) * STEP_W;
			const trueBone = l.en === 'True Bone';
			return {
				...l,
				w,
				d: w,
				h: H,
				tone: chunchu && !trueBone ? ('dim' as const) : ('accent' as const),
				color: l.a < 1 ? mix(l.c, kit.palette.bg, 1 - l.a) : l.c,
				glow: chunchu && trueBone ? 0.35 : 0
			};
		})
	);
	const placed = $derived(stack(levels));
	const apex = $derived(placed[placed.length - 1]);
	const trueBone = $derived(placed[placed.length - 2]);
	const wait = (k: number) => 150 + k * 140;

	/** 王 in plan: three bars across, one down, centred on the summit. */
	const STROKE = 0.17;
	const glyph = $derived.by(() => {
		const s = apex.w * 0.33;
		const bars: { at: Vec3; size: [number, number] }[] = [
			{ at: [0, apex.top, -s], size: [s * 1.7, STROKE] },
			{ at: [0, apex.top, 0], size: [s * 1.45, STROKE] },
			{ at: [0, apex.top, s], size: [s * 2.0, STROKE] },
			{ at: [0, apex.top, 0], size: [STROKE, s * 2 + STROKE] }
		];
		return bars;
	});
</script>

<KitTier {levels} delay={150} stagger={140} />

<!-- the King's 王, laid in gold on the summit -->
{#each glyph as b, i (i)}
	<KitNode at={b.at} size={b.size} height={0.09} corner={0.03} tone="accent" color={HUE.gold} glow={0.3} delay={1400 + i * 80} />
{/each}
<KitLabel
	at={[0, apex.top + 0.75, -apex.d / 2]}
	ko={KING.ko}
	han={KING.han}
	en={enFor(KING.en)}
	size="sm"
	tone="strong"
	delay={1500}
/>

{#each placed as l, k (l.ko)}
	<KitLabel
		at={[0, l.y + H / 2, l.d / 2 + 0.02]}
		ko={l.ko}
		en={enFor(l.en)}
		size="sm"
		tone="accent"
		accent={l.c}
		delay={wait(k) + 300}
	/>
	{#if l !== apex && l.capKo}
		<KitLabel
			at={[-l.w / 2 - 0.55, l.y + H / 2, l.d / 2]}
			ko={l.capKo}
			en={enFor(l.cap)}
			size="xs"
			tone="note"
			accent={l.c}
			minor
			delay={wait(k) + 900}
		/>
	{/if}
{/each}

<!-- Chunchu: True Bone, one step down, fenced off from the crown -->
<KitRing
	at={[0, apex.top + 0.02, 0]}
	radius={apex.w * 0.62}
	tube={0.04}
	tone="red"
	show={chunchu}
	delay={1600}
/>
<KitNode
	at={[-trueBone.w / 2 + 0.3, trueBone.top, trueBone.d / 2 - 0.3]}
	shape="disc"
	size={[0.18]}
	height={0.55}
	tone="accent"
	color={HUE.gold}
	glow={0.4}
	show={chunchu}
	delay={1700}
/>
<KitLink
	points={[
		[-trueBone.w / 2 + 0.3, trueBone.top + 0.6, trueBone.d / 2 - 0.3],
		[-apex.w * 0.55, apex.top + 0.35, apex.d * 0.4]
	]}
	tone="red"
	radius={0.025}
	show={chunchu}
	delay={1900}
/>
<KitLabel
	at={[-trueBone.w / 2 + 0.3, trueBone.top + 1.05, trueBone.d / 2 - 0.3]}
	ko="춘추 ✕"
	en={enFor('True Bone · barred')}
	size="sm"
	tone="accent"
	accent={kit.palette.red}
	show={chunchu}
	delay={1800}
/>
