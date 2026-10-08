<script lang="ts">
	/**
	 * The Eight Great Clans as a Commons chamber in 3D: Buyeo's throne at the
	 * head, two benches facing across the aisle, and each house a pillar as
	 * tall as its weight at court — Satek tallest, Yunbi facing it. In
	 * 'rivalry' the other six fall back and a red beam crosses the aisle.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { HUE, box, getKit, type Vec3 } from '../kit.svelte';
	import { LEFT, RIGHT } from '../../EightClans.svelte';

	let { step = 'court' }: { step?: string } = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-4, 4, -5.8, 3.6, 3.4)));

	/** Weight at court as the story tells it (Satek holds the queen and the PM). */
	const WEIGHT: Record<string, number> = {
		Satek: 2.6,
		Yunbi: 2.0,
		Jinmo: 1.35,
		Mokli: 1.3,
		Hae: 1.15,
		Ahn: 1.05,
		Baek: 1.0,
		Guk: 0.95
	};

	const ROWS = [-2.4, -0.8, 0.8, 2.4];
	const X = 2.6;

	const clans = [
		...LEFT.map((c, i) => ({ ...c, side: -1, i })),
		...RIGHT.map((c, i) => ({ ...c, side: 1, i: i + 4 }))
	].map((c) => ({
		...c,
		at: [c.side * X, 0.25, ROWS[c.i % 4]] as Vec3,
		h: WEIGHT[c.en] ?? 1,
		feud: c.en === 'Satek' || c.en === 'Yunbi'
	}));

	const rivalry = $derived(step === 'rivalry');
	const satek = clans[0];
	const yunbi = clans[4];
	const top = (c: (typeof clans)[number]): Vec3 => [c.at[0], c.at[1] + c.h, c.at[2]];
</script>

<!-- chamber: aisle and two benches -->
<KitNode at={[0, 0, -0.2]} size={[0.9, 7.2]} height={0.03} tone="ghost" delay={80} />
<KitNode at={[-X, 0, 0]} size={[1.6, 7.0]} height={0.25} tone="dim" color={HUE.baekje} delay={160} />
<KitNode at={[X, 0, 0]} size={[1.6, 7.0]} height={0.25} tone="dim" color={HUE.baekje} delay={160} />

<!-- the throne at the head of the chamber -->
<KitNode at={[0, 0, -4.7]} size={[2.6, 1.3]} height={0.45} tone="accent" color={HUE.baekje} />
<KitNode
	at={[0, 0.45, -4.7]}
	shape="disc"
	size={[0.42]}
	height={1.2}
	tone="hot"
	color={HUE.baekje}
	glow={0.3}
	delay={200}
/>
<KitLabel at={[0, 2.2, -4.7]} ko="부여" en="throne" size="md" tone="strong" delay={300} />

{#each clans as c (c.en)}
	<KitNode
		at={c.at}
		size={c.feud ? [0.95, 0.95] : [0.8, 0.8]}
		height={c.h}
		tone={rivalry ? (c.en === 'Yunbi' ? 'red' : c.feud ? 'hot' : 'dim') : c.en === 'Satek' ? 'hot' : 'accent'}
		color={HUE.baekje}
		glow={c.en === 'Satek' ? 0.3 : 0}
		delay={450 + c.i * 110}
		moveDelay={1900}
	/>
	<KitLabel
		at={[c.at[0], c.at[1] + c.h + 0.4, c.at[2]]}
		ko={c.ko}
		en={c.en}
		size="sm"
		tone={rivalry && !c.feud ? 'muted' : 'plain'}
		delay={600 + c.i * 110}
	/>
{/each}

<KitLabel
	at={[satek.at[0] - 1.25, satek.at[1] + satek.h - 0.2, satek.at[2]]}
	ko="왕비 · 재상"
	en="queen & PM"
	size="xs"
	tone="note"
	accent={HUE.baekje}
	minor
	delay={1650}
/>

<!-- the feud: four generations, straight across the aisle -->
<KitLink
	points={[top(satek), [0, satek.h + 0.9, satek.at[2]], top(yunbi)]}
	tone="red"
	radius={0.04}
	show={rivalry}
	pulse
	pulseTone="red"
	delay={1700}
	duration={1100}
/>
