<script lang="ts">
	/**
	 * The High Summit as an org: a round table, four command cylinders on its
	 * rim (faces on top), the Central command's chair standing taller at the
	 * head, and the king's seat just outside, tied to the chair by one thin
	 * gold line. In 'supreme' Yeon's face takes the chair and it towers, his
	 * East seat is left empty, the old High Commander stands struck beside
	 * the chair, the other three sink grey, the king hangs on strings, and
	 * the Chancellor stands at the table's centre.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, type Vec3 } from '../kit.svelte';
	import {
		CHANCELLOR,
		COMMANDS,
		CENTRAL,
		HEAD_DEG,
		chairOf,
		commandLabel,
		face,
		kingOf,
		seatLabel
	} from '../../HighSummit.svelte';
	import { reading } from '$lib/reading.svelte';

	let { step = 'council' }: { step?: string } = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-4.5, 4.5, -5.9, 4.3, 3.2)));

	const R = 3.0;
	const onRim = (deg: number, r = R): Vec3 => {
		const a = (deg * Math.PI) / 180;
		return [r * Math.cos(a), 0, r * Math.sin(a)];
	};

	const HEAD = onRim(HEAD_DEG);
	/** Off to the left as well as behind, so his label clears the chair's at the kit's camera angle. */
	const KING: Vec3 = [-3.4, 0, -R - 1.6];
	const MID: Vec3 = [0, 0, -0.9];

	const supreme = $derived(step === 'supreme');
	const chair = $derived(chairOf(supreme));
	const king = $derived(kingOf(supreme));
	const chairH = $derived(supreme ? 2.1 : 1.45);
	const kingH = 0.85;

	const seats = COMMANDS.map((c, i) => ({ ...c, i, at: onRim(c.deg) }));
	const fate = (id: string) => (!supreme ? 'sit' : id === 'gesomun' ? 'moved' : 'struck');
	/** The old High Commander, struck, beside the chair Yeon took from him. */
	const OUSTED: Vec3 = [HEAD[0] + 1.4, 0, HEAD[2] - 0.4];
	const seatH = (id: string) => ({ sit: 1.0, moved: 0.04, struck: 0.25 })[fate(id)];
</script>

<!-- the table: the org's edge -->
<KitNode shape="disc" size={[R - 0.45]} height={0.08} tone="dim" delay={0} />
<KitRing radius={R} tone="accent" color={HUE.goguryeo} delay={80} />

<!-- the king, outside, and his one line in -->
<KitNode
	at={KING}
	shape="disc"
	size={[0.4]}
	height={kingH}
	tone={supreme ? 'dim' : 'accent'}
	color={HUE.gold}
	delay={120}
/>
<KitLink
	points={[
		[KING[0], kingH * 0.5, KING[2]],
		[HEAD[0], 0.5, HEAD[2] - 0.35]
	]}
	radius={0.014}
	tone={supreme ? 'ghost' : 'accent'}
	color={HUE.gold}
	delay={260}
/>
{#each [-0.14, 0.14] as dx (dx)}
	<KitLink
		points={[
			[KING[0] + dx, kingH, KING[2]],
			[KING[0] + dx * 2, kingH + 1.6, KING[2]]
		]}
		radius={0.01}
		tone="base"
		show={supreme}
		delay={1750}
	/>
{/each}
<KitLabel
	at={[KING[0], kingH + 0.45, KING[2]]}
	{...seatLabel(king)}
	img={face(king.id, king.year)}
	accent={HUE.gold}
	size="xs"
	tone={supreme ? 'muted' : 'accent'}
	delay={supreme ? 1800 : 200}
/>

<!-- the chair at the head: the Central command's seat -->
<KitNode
	at={HEAD}
	shape="disc"
	size={[0.55]}
	height={chairH}
	tone="hot"
	color={HUE.goguryeo}
	glow={supreme ? 0.35 : 0.2}
	delay={180}
/>
<KitLabel
	at={[HEAD[0], chairH + 0.45, HEAD[2]]}
	{...seatLabel(chair)}
	img={face(chair.id, chair.year)}
	accent={HUE.goguryeo}
	size="sm"
	tone="accent"
	delay={supreme ? 1500 : 300}
/>
<KitNode at={OUSTED} shape="disc" size={[0.32]} height={0.25} tone="ghost" show={supreme} delay={1100} />
<KitLabel
	at={[OUSTED[0], 0.7, OUSTED[2]]}
	{...seatLabel(CENTRAL)}
	img={face(CENTRAL.id, CENTRAL.year)}
	accent={HUE.goguryeo}
	struck
	size="xs"
	tone="muted"
	show={supreme}
	delay={1200}
/>

<!-- the four other commands -->
{#each seats as s (s.id)}
	{@const f = fate(s.id)}
	<KitLink
		points={[
			[HEAD[0] + s.at[0] * 0.08, 0.1, HEAD[2] + 0.35],
			[s.at[0] * 0.86, 0.1, s.at[2] * 0.86]
		]}
		tone={f === 'sit' ? 'accent' : 'ghost'}
		color={HUE.goguryeo}
		delay={300 + s.i * 70}
	/>
	<KitNode
		at={s.at}
		shape="disc"
		size={[0.45]}
		height={seatH(s.id)}
		tone={f === 'sit' ? 'accent' : 'ghost'}
		color={HUE.goguryeo}
		delay={500 + s.i * 100}
	/>
	{#if f === 'moved'}
		<KitLabel
			at={[s.at[0], 0.35, s.at[2]]}
			ko="빈자리"
			en={reading.lang === 'ko' ? undefined : 'empty seat'}
			size="xs"
			tone="muted"
			delay={1400}
		/>
	{:else}
		<KitLabel
			at={[s.at[0], seatH(s.id) + 0.45, s.at[2]]}
			{...commandLabel(s)}
			img={face(s.id, s.year)}
			accent={HUE.goguryeo}
			struck={f === 'struck'}
			size="xs"
			tone={f === 'struck' ? 'muted' : 'plain'}
			delay={650 + s.i * 100}
		/>
	{/if}
{/each}

<!-- after the massacre: the Chancellor at the table's centre -->
<KitNode at={MID} shape="disc" size={[0.3]} height={0.6} tone="base" show={supreme} delay={1850} />
<KitLabel
	at={[MID[0], 1.05, MID[2]]}
	{...seatLabel(CHANCELLOR)}
	img={face(CHANCELLOR.id, CHANCELLOR.year)}
	size="xs"
	show={supreme}
	delay={1900}
/>

<KitLabel
	at={[0, 0.05, R + 1.15]}
	ko={supreme ? '大莫離支' : '諸加會議'}
	en={supreme ? 'one chair where five sat' : 'five commands, the first in the chair, the king outside'}
	size="xs"
	tone="note"
	accent={HUE.goguryeo}
	delay={1500}
/>
