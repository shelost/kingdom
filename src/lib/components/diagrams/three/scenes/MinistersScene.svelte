<script lang="ts">
	/**
	 * The Ministers' Assembly (정사암회의) as a Commons chamber: the King at
	 * the head, the Prime Minister on the aisle, eight Senior Ministers on the
	 * inner benches (taller seats) and eight Junior Ministers against the
	 * walls. Seats are plain; each bench column carries its title once, at
	 * its head. The Rock of Politics (정사암) sits apart at the foot of the
	 * aisle. 'purged' turns every seat red (princes); 'clans' names the
	 * Eight Clans in front of the senior seats and lifts Satek and Yunbi.
	 * In a scene, the people holding the seats sit on them, faces up.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRock from '../KitRock.svelte';
	import KitSitter from '../KitSitter.svelte';
	import { HUE, box, getKit } from '../kit.svelte';
	import { sitter, type Cast } from '../../cast';
	import {
		ASSEMBLY,
		CLAN_EN,
		LEFT_CLANS,
		RIGHT_CLANS,
		ROCK,
		SEAT,
		TITLES,
		isLeadClan,
		titleLabel
	} from '../../MinistersAssembly.svelte';
	import { reading } from '$lib/reading.svelte';

	let {
		step = 'court',
		cast,
		year = null
	}: { step?: string; cast?: Cast; year?: number | null } = $props();

	const kit = getKit();
	/** A scene with faces looks down from higher and straighter, so the benches' sitters stand clear of each other. */
	$effect(() => kit.fit(box(-4.7, 4.7, -6, 6.7, 2.6), cast ? { az: 0.12, el: 1.02 } : undefined));

	const purged = $derived(step === 'purged');
	const clans = $derived(step === 'clans');

	const ROWS = [-2.4, -0.8, 0.8, 2.4];
	const SENIOR_X = 1.6;
	const JUNIOR_X = 3.6;
	const BENCH_Y = 0.18;
	/** Each column's single title tag heads it, at the King's end, clear of the rock; with faces on the front seats it moves to the rock's end. */
	const TAG_Z = $derived(cast ? ROWS[3] + 0.95 : ROWS[0] - 0.85);

	const seniors = [
		...ROWS.map((z, i) => ({ x: -SENIOR_X, z, i, clan: LEFT_CLANS[i] as string })),
		...ROWS.map((z, i) => ({ x: SENIOR_X, z, i: i + 4, clan: RIGHT_CLANS[i] as string }))
	];
	const juniors = [
		...ROWS.map((z, i) => ({ x: -JUNIOR_X, z, i })),
		...ROWS.map((z, i) => ({ x: JUNIOR_X, z, i: i + 4 }))
	];
	const columns = [
		{ x: -JUNIOR_X, t: TITLES.junior, d: 1000 },
		{ x: -SENIOR_X, t: TITLES.senior, d: 700 },
		{ x: SENIOR_X, t: TITLES.senior, d: 700 },
		{ x: JUNIOR_X, t: TITLES.junior, d: 1000 }
	];

	const who = (seat: string) => sitter(cast, seat, year);
	const king = $derived(who(SEAT.king));
	const premier = $derived(who(SEAT.premier));
	const seniorSitters = $derived(seniors.map((s) => who(SEAT.senior(s.i))));
	const juniorSitters = $derived(juniors.map((j) => who(SEAT.junior(j.i))));
	/** A purged seat's sitter is a prince: his ring goes the colour of the purge. */
	const ringOf = $derived(purged ? kit.palette.red : HUE.baekje);

	const bright = (clan: string) => clans && isLeadClan(clan);
	/** Satek and Yunbi sit higher; with faces on top, only a little, so the Premier behind them stays in view. */
	const seniorH = (clan: string) => (bright(clan) ? (cast ? 1.2 : 1.45) : 0.95);
	const plural = (en: string) => (purged ? `${en}s · princes` : `${en}s`);
	const foot = $derived(
		titleLabel(
			ASSEMBLY,
			purged
				? 'hollow majority · every seat a prince'
				: clans
					? 'the Eight Clans on the senior seats'
					: ASSEMBLY.en
		)
	);
</script>

<!-- chamber floor, aisle, benches -->
<KitNode at={[0, 0, 0]} size={[0.8, 6.6]} height={0.03} tone="ghost" delay={60} />
<KitNode at={[-2.6, 0, 0]} size={[3.4, 6.4]} height={BENCH_Y} tone="dim" color={HUE.baekje} delay={100} />
<KitNode at={[2.6, 0, 0]} size={[3.4, 6.4]} height={BENCH_Y} tone="dim" color={HUE.baekje} delay={100} />

<!-- King at the helm, Prime Minister on the aisle -->
<KitNode at={[0, 0, -5]} size={[2.4, 1.2]} height={0.4} tone="accent" color={HUE.baekje} />
<KitNode
	at={[0, 0.4, -5]}
	shape="disc"
	size={[0.36]}
	height={1.1}
	tone="hot"
	color={HUE.baekje}
	glow={0.3}
	delay={120}
/>
{#if king}
	<KitSitter at={[0, 1.58, -5]} who={king} accent={HUE.baekje} delay={200} />
{:else}
	<KitLabel at={[0, 1.95, -5]} {...titleLabel(TITLES.king)} tone="strong" delay={200} />
{/if}

<KitLink
	points={[
		[0, 0.03, -4.4],
		[0, 0.03, -3.85]
	]}
	tone="accent"
	color={HUE.baekje}
	delay={240}
/>
<KitNode
	at={[0, 0, -3.3]}
	shape="disc"
	size={[0.48]}
	height={0.85}
	tone={purged ? 'red' : 'accent'}
	color={HUE.baekje}
	delay={160}
	moveDelay={1200}
/>
{#if premier}
	<KitSitter at={[0, 1.4, -3.3]} who={premier} accent={HUE.baekje} delay={300} moveDelay={1200} />
	<KitLabel
		at={[0, 0.05, -2.55]}
		{...titleLabel(TITLES.premier)}
		size="xs"
		tone="note"
		accent={HUE.baekje}
		delay={360}
	/>
{:else}
	<KitLabel
		at={[0, 1.55, -3.3]}
		{...titleLabel(TITLES.premier, purged ? 'Prime Minister · prince' : TITLES.premier.en)}
		size="sm"
		delay={300}
	/>
{/if}

{#each seniors as s, k (s.i)}
	{@const holder = seniorSitters[k]}
	<KitNode
		at={[s.x, BENCH_Y, s.z]}
		shape="disc"
		size={[0.42]}
		height={seniorH(s.clan)}
		tone={purged ? 'red' : clans && !bright(s.clan) ? 'base' : 'accent'}
		color={HUE.baekje}
		glow={bright(s.clan) ? 0.35 : 0}
		delay={420 + s.i * 50}
		moveDelay={1200 + s.i * 60}
	/>
	{#if holder}
		<!-- nudged off the aisle, so the Premier's face behind the front row stays clear -->
		<KitSitter
			at={[s.x + Math.sign(s.x) * 0.4, BENCH_Y + seniorH(s.clan) + 0.06, s.z]}
			who={holder}
			accent={ringOf}
			size="xs"
			delay={700 + s.i * 50}
			moveDelay={1200 + s.i * 60}
		/>
	{:else}
		<KitLabel
			at={[s.x, BENCH_Y + seniorH(s.clan) + 0.22, s.z]}
			ko={s.clan}
			en={reading.lang === 'ko' ? undefined : CLAN_EN[s.clan]}
			size="xs"
			tone={bright(s.clan) ? 'accent' : 'note'}
			accent={HUE.baekje}
			show={clans}
			minor
			delay={700 + s.i * 50}
		/>
	{/if}
{/each}

{#each juniors as j, k (j.i)}
	{@const holder = juniorSitters[k]}
	<KitNode
		at={[j.x, BENCH_Y, j.z]}
		shape="disc"
		size={[0.34]}
		height={0.55}
		tone={purged ? 'red' : clans ? 'dim' : 'accent'}
		color={HUE.baekje}
		delay={820 + j.i * 40}
		moveDelay={1500 + j.i * 50}
	/>
	{#if holder}
		<KitSitter
			at={[j.x, BENCH_Y + 0.61, j.z]}
			who={holder}
			accent={ringOf}
			size="xs"
			delay={1000 + j.i * 40}
			moveDelay={1500 + j.i * 50}
		/>
	{/if}
{/each}

<!-- one title per bench column, at its head -->
{#each columns as c (c.x)}
	<KitLabel
		at={[c.x, BENCH_Y + 0.05, TAG_Z]}
		{...titleLabel(c.t, plural(c.t.en))}
		size="xs"
		tone={c.t === TITLES.senior ? 'accent' : 'plain'}
		accent={HUE.baekje}
		delay={c.d}
	/>
{/each}

<!-- the Rock of Politics: the thing the council is named after -->
<KitRock at={[0, 0, 4.55]} size={0.7} height={0.7} tone="base" turn={0.6} delay={1100} />
<KitLabel
	at={[1.35, 0.35, 4.55]}
	{...titleLabel(ROCK)}
	size="xs"
	tone="accent"
	accent={HUE.baekje}
	delay={1200}
/>

<KitLabel
	at={[0, 0.05, 6.3]}
	{...foot}
	size="xs"
	tone="note"
	accent={HUE.baekje}
	delay={1300}
/>
