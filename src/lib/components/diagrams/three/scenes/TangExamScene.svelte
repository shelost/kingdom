<script lang="ts">
	/**
	 * The Tang ladder as an actual stair: nine steps climbing away from the
	 * viewer, rank nine at the front. Five clan pillars on the left with a
	 * beam that lands them on the seventh step; a field of candidates in
	 * front, two exam gates, and beams that land on the ninth.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { HUE, box, getKit, spread, stepIndex, type Tone, type Vec3 } from '../kit.svelte';
	import { CLAN, CLANS, EXAM, GATES, GATE_RANK, NINE, RANKS, SHADOW, STEPS } from '../../TangExam.svelte';

	let { step }: { step?: string } = $props();

	const kit = getKit();
	const level = $derived(stepIndex(STEPS, step));
	$effect(() => kit.fit(box(-4.3, 4.1, -2.8, 4.1, 2.4), { az: 0.5, el: 0.55 }));

	const tone = (layer: number): Tone => (layer === level ? 'accent' : 'base');

	const SX = 1.5;
	const SW = 2.6;
	const SD = 0.55;
	const stair = RANKS.map((r) => ({ ...r, z: 2.2 - (9 - r.k) * SD, h: 0.22 * (10 - r.k) }));
	/** Where a path steps onto rank k: the left lip of that stair. */
	const lip = (k: number): Vec3 => [SX - SW / 2 + 0.15, stair[k - 1].h + 0.03, stair[k - 1].z];

	const clanZ = spread(CLANS.length, -2.0, 0.4);
	const CLAN_X = -3.2;
	const CLAN_H = 1.7;

	const GATE_X = -1.0;
	const gateZ = [2.0, 3.3];
	const candidates = Array.from({ length: 15 }, (_, i) => ({
		i,
		at: [-3.7 + (i % 5) * 0.32, 0, 2.45 + Math.floor(i / 5) * 0.42] as Vec3
	}));
</script>

<!-- the stair -->
{#each stair as s (s.k)}
	<KitNode
		at={[SX, 0, s.z]}
		size={[SW, SD]}
		height={s.h}
		corner={0.03}
		tone={level === 2 && s.k === 1 ? 'hot' : tone(2)}
		color={HUE.tang}
		delay={(9 - s.k) * 90}
	/>
	<KitLabel
		at={[SX + SW / 2 + 0.45, s.h, s.z]}
		ko={s.ko}
		han={s.han}
		size="xs"
		tone={level === 2 ? 'plain' : 'muted'}
		minor={![1, SHADOW.rank, GATE_RANK].includes(s.k)}
		delay={200 + (9 - s.k) * 90}
	/>
{/each}
<KitLabel
	at={[SX, stair[0].h + 0.55, stair[0].z]}
	ko={NINE.ko}
	han={NINE.han}
	en={NINE.en}
	size="sm"
	tone={level === 2 ? 'accent' : 'muted'}
	accent={HUE.tang}
	delay={1000}
/>

<!-- the great clans and their shortcut -->
{#each CLANS as c, i (c.han)}
	<KitNode
		at={[CLAN_X, 0, clanZ[i]]}
		shape="disc"
		size={[0.26]}
		height={CLAN_H}
		tone={tone(0)}
		color={HUE.tang}
		delay={400 + i * 90}
	/>
	<KitLabel at={[CLAN_X, CLAN_H + 0.3, clanZ[i]]} ko={c.ko} han={c.han} size="xs" minor delay={550 + i * 90} />
{/each}
<KitLabel
	at={[CLAN_X - 0.9, 0.05, -0.8]}
	ko={CLAN.ko}
	han={CLAN.han}
	en={CLAN.en}
	size="xs"
	tone={level === 0 ? 'accent' : 'muted'}
	accent={HUE.tang}
	delay={900}
/>
<KitLink
	points={[
		[CLAN_X + 0.2, CLAN_H * 0.8, -0.8],
		[-1.2, 2.1, 0.2],
		lip(SHADOW.rank)
	]}
	radius={0.04}
	tone={level === 0 ? 'hot' : 'accent'}
	color={HUE.tang}
	pulse={level === 0}
	delay={1000}
/>
<KitLabel
	at={[-1.2, 2.45, 0.2]}
	ko={SHADOW.ko}
	han={SHADOW.han}
	en={SHADOW.en}
	size="xs"
	tone="note"
	accent={HUE.tang}
	delay={1200}
/>

<!-- the examinations -->
{#each candidates as c (c.i)}
	<KitNode
		at={c.at}
		shape="disc"
		size={[0.09]}
		height={0.28}
		tone={tone(1)}
		color={HUE.tang}
		show={level >= 1}
		delay={500 + c.i * 25}
	/>
{/each}
{#each GATES as g, i (g.han)}
	{@const z = gateZ[i]}
	{#each [-0.3, 0.3] as dz (dz)}
		<KitNode
			at={[GATE_X, 0, z + dz]}
			size={[0.16, 0.16]}
			height={0.85}
			tone={tone(1)}
			color={HUE.tang}
			show={level >= 1}
			delay={800 + i * 150}
		/>
	{/each}
	<KitNode
		at={[GATE_X, 0.85, z]}
		size={[0.3, 0.9]}
		height={0.1}
		tone={level === 1 ? 'hot' : 'base'}
		color={HUE.tang}
		show={level >= 1}
		delay={950 + i * 150}
	/>
	<KitLabel
		at={[GATE_X, 1.3, z]}
		ko={g.ko}
		han={g.han}
		en={g.en}
		size="xs"
		tone={level === 1 ? 'accent' : 'muted'}
		accent={HUE.tang}
		show={level >= 1}
		delay={1050 + i * 150}
	/>
	<KitLink
		points={[
			[-2.4, 0.15, z],
			[GATE_X, 0.15, z],
			[(GATE_X + lip(GATE_RANK)[0]) / 2, 0.5, (z + lip(GATE_RANK)[2]) / 2],
			lip(GATE_RANK)
		]}
		radius={0.03}
		tone="accent"
		color={HUE.tang}
		pulse={level === 1}
		phase={i / 2}
		show={level >= 1}
		delay={1100 + i * 150}
	/>
{/each}
<KitLabel
	at={[-3.05, 0.05, 3.85]}
	ko={EXAM.ko}
	han={EXAM.han}
	en={EXAM.en}
	size="xs"
	tone="note"
	accent={HUE.tang}
	show={level >= 1}
	delay={1300}
/>
