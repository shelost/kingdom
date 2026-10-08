<script lang="ts">
	/**
	 * Harmony Council in 3D: six seats on a ring around one table. Each
	 * Councillor's vote is a piece that slides off his seat onto the table's
	 * yes half or no half — 3:3 hung, 6:0 passed, 5:1 vetoed. In rebellion
	 * Bidam's seat leaves the ring; once ornamental, the room goes grey.
	 * In a scene, each seat carries its sitter's face instead of its title.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import KitSitter from '../KitSitter.svelte';
	import { HUE, box, getKit, ring, type Vec3 } from '../kit.svelte';
	import { sitter, type Cast } from '../../cast';
	import {
		BIDAM,
		GATES,
		highSeat,
		isVoting,
		seatId,
		seatName,
		showsGates,
		verdictOf,
		voteOf
	} from '../../HarmonyCouncil.svelte';

	let {
		step = 'unanimous',
		cast,
		year = null
	}: { step?: string; cast?: Cast; year?: number | null } = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-4.7, 4.7, -4.3, 5.5, 1.8)));

	const R = 3.1;
	const TABLE = 1.35;
	const TABLE_H = 0.4;
	const seats = ring(6, R);

	const voting = $derived(isVoting(step));
	const gatesOn = $derived(showsGates(step));
	const rebel = $derived(step === 'rebellion');
	const hollow = $derived(step === 'ornamental');
	const verdict = $derived(verdictOf(step));
	const votes = $derived(seats.map((s) => voteOf(step, s.i)));
	const high = $derived(highSeat(cast, year));
	const seatH = (i: number) => (i === high ? 1.2 : 0.9);
	const sitters = $derived(seats.map((s) => sitter(cast, seatId(s.i), year)));

	/** Where seat i sits now: Bidam steps out of the ring in rebellion. */
	const seatAt = (i: number): Vec3 => {
		const s = seats[i];
		const r = rebel && i === BIDAM ? R + 1.25 : R;
		return [Math.cos(s.a) * r, 0, Math.sin(s.a) * r];
	};

	/** Slot k of a 2 × 3 grid on the yes (left) or no (right) half of the table. */
	const slot = (side: 'yes' | 'no', k: number): Vec3 => [
		(side === 'yes' ? -0.58 : 0.58) + ((k % 2) - 0.5) * 0.34,
		TABLE_H + 0.05,
		-0.42 + Math.floor(k / 2) * 0.42
	];

	const pieces = $derived.by(() => {
		let yes = 0;
		let no = 0;
		return seats.map((s, i) => {
			const v = votes[i];
			const home = seatAt(i);
			const onTable =
				v === 'yes' ? slot('yes', yes++) : v === 'no' ? slot('no', no++) : undefined;
			return {
				i,
				v,
				// Before play the piece waits on its seat; then it slides to the table.
				at: (kit.active && onTable ? onTable : [home[0], seatH(i) + 0.05, home[2]]) as Vec3
			};
		});
	});

	const tableTone = $derived(
		hollow || rebel ? 'ghost' : step === 'veto' ? 'red' : step === 'unanimous' ? 'accent' : 'base'
	);
</script>

<!-- the table, split into the yes half and the no half -->
<KitNode shape="disc" size={[TABLE]} height={TABLE_H} tone={tableTone} color={HUE.gold} moveDelay={2600} />
<KitNode
	at={[-0.6, TABLE_H, 0]}
	size={[1.02, 1.5]}
	height={0.04}
	tone={votes.includes('yes') ? 'accent' : 'dim'}
	color={HUE.gold}
	show={voting}
	delay={900}
/>
<KitNode
	at={[0.6, TABLE_H, 0]}
	size={[1.02, 1.5]}
	height={0.04}
	tone={votes.includes('no') ? 'red' : 'dim'}
	show={voting}
	delay={950}
/>
<KitRing radius={R} tone={hollow ? 'ghost' : 'base'} delay={60} />

<!-- spokes and seats -->
{#each seats as s (s.i)}
	{@const home = seatAt(s.i)}
	{@const breakaway = rebel && s.i === BIDAM}
	{@const h = seatH(s.i)}
	{@const who = sitters[s.i]}
	<KitLink
		points={[
			[Math.cos(s.a) * (TABLE + 0.1), 0.03, Math.sin(s.a) * (TABLE + 0.1)],
			[home[0] - Math.cos(s.a) * 0.55, 0.03, home[2] - Math.sin(s.a) * 0.55]
		]}
		tone={hollow ? 'ghost' : votes[s.i] === 'no' ? 'red' : 'accent'}
		color={HUE.silla}
		show={!breakaway}
		delay={150 + s.i * 110}
	/>
	<KitNode
		at={home}
		shape="disc"
		size={[0.42]}
		height={h}
		tone={breakaway ? 'red' : hollow ? 'dim' : votes[s.i] === 'no' ? 'red' : 'accent'}
		color={HUE.silla}
		delay={380 + s.i * 130}
		moveDelay={2000}
	/>
	{#if who}
		<KitSitter
			at={[home[0], h + 0.08, home[2]]}
			{who}
			accent={breakaway || votes[s.i] === 'no' ? kit.palette.red : HUE.silla}
			delay={600 + s.i * 130}
			moveDelay={2000}
		/>
	{:else}
		<KitLabel
			at={[home[0], h + 0.35, home[2]]}
			ko={seatName(s.i).ko}
			en={breakaway ? 'breaks away' : seatName(s.i).en}
			size="sm"
			tone={breakaway ? 'accent' : hollow ? 'muted' : 'plain'}
			accent={breakaway ? kit.palette.red : HUE.silla}
			delay={600 + s.i * 130}
			moveDelay={2000}
		/>
	{/if}
{/each}

<!-- the votes -->
{#each pieces as p (p.i)}
	<KitNode
		at={p.at}
		size={[0.26, 0.26]}
		height={0.22}
		corner={0.04}
		tone={p.v === 'no' ? 'red' : 'accent'}
		color={HUE.gold}
		glow={0.4}
		show={p.v !== 'none'}
		delay={1100 + p.i * 90}
		moveDelay={1450 + p.i * 160}
	/>
{/each}

<KitLabel
	at={[0, TABLE_H + 1.05, 0]}
	ko={verdict.ko}
	en={verdict.en}
	size="lg"
	tone="strong"
	delay={2500}
/>

<!-- the three gates of a session -->
{#each GATES as g, i (g.ko)}
	{@const x = (i - 1) * 2.6}
	{@const fails = step === 'veto' && i === 2}
	<KitNode
		at={[x, 0, 4.6]}
		shape="disc"
		size={[0.2]}
		height={0.16}
		tone={fails ? 'red' : 'accent'}
		color={HUE.gold}
		glow={0.3}
		show={gatesOn}
		delay={2100 + i * 350}
	/>
	{#if i < 2}
		<KitLink
			points={[
				[x + 0.3, 0.06, 4.6],
				[x + 2.3, 0.06, 4.6]
			]}
			radius={0.022}
			show={gatesOn}
			delay={2280 + i * 350}
		/>
	{/if}
	<KitLabel
		at={[x, 0.2, 5.15]}
		ko={g.ko}
		en={fails ? '✕ ' + g.en : g.en}
		size="xs"
		tone={fails ? 'accent' : 'plain'}
		accent={kit.palette.red}
		show={gatesOn}
		delay={2150 + i * 350}
	/>
{/each}
