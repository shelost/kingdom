<script lang="ts">
	/**
	 * The Tang army as a map of blocks: farmer garrisons scattered over the
	 * realm, a few always marching their turn to the palace; sixteen guard
	 * posts round it; a marshal raised in the east with beams pulling men
	 * to him; four protectorate towers on the rim.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import KitRing from '../KitRing.svelte';
	import { HUE, box, getKit, ring, stepIndex, type Tone, type Vec3 } from '../kit.svelte';
	import {
		CAPITAL,
		EXPEDITION,
		EXPEDITION_NOTE,
		FUBING,
		FUBING_NOTE,
		GARRISONS,
		GUARDS,
		PROTECTORATE,
		PROTECTORATES,
		STEPS
	} from '../../TangMilitary.svelte';

	let { step }: { step?: string } = $props();

	const kit = getKit();
	const level = $derived(stepIndex(STEPS, step));
	$effect(() => {
		const e = level === 3 ? 6.0 : 4.8;
		kit.fit(box(-e, e, -e, e + 1.4, 2.2));
	});

	const tone = (layer: number): Tone => (layer === level ? 'accent' : 'base');

	const R = 4.4;
	const polar = (r: number, deg: number): Vec3 => {
		const a = (deg * Math.PI) / 180;
		return [r * Math.cos(a), 0, r * Math.sin(a)];
	};
	const garrisons = GARRISONS.map((g) => ({ ...g, x: g.x * R, z: g.z * R }));
	const guards = ring(16, 1.15);
	const marshal = polar(R * 0.62, EXPEDITION.deg);
	/** The formation he leads, three files marching on toward the rim. */
	const column = Array.from({ length: 12 }, (_, i) => {
		const a = (EXPEDITION.deg * Math.PI) / 180;
		const along = 0.75 + Math.floor(i / 3) * 0.42;
		const side = ((i % 3) - 1) * 0.36;
		return {
			i,
			at: [
				marshal[0] + Math.cos(a) * along - Math.sin(a) * side,
				0,
				marshal[2] + Math.sin(a) * along + Math.cos(a) * side
			] as Vec3
		};
	});
	/** The men he draws: the nearest garrisons and the palace guard. */
	const levies = garrisons
		.map((g) => ({ g, d: Math.hypot(g.x - marshal[0], g.z - marshal[2]) }))
		.sort((p, q) => p.d - q.d)
		.slice(0, 4)
		.map((p) => p.g);
	const towers = PROTECTORATES.map((p) => ({ ...p, at: polar(R + 0.9, p.deg) }));
	const caption = $derived([FUBING, GUARDS, EXPEDITION, PROTECTORATE][level]);
	const note = $derived(level === 0 ? FUBING_NOTE : level === 2 ? EXPEDITION_NOTE : undefined);
</script>

<!-- the realm -->
<KitNode shape="disc" size={[R]} height={0.04} tone="ghost" />
<KitRing radius={R} tube={0.025} tone="dim" color={HUE.tang} delay={60} />

<!-- the palace -->
<KitNode size={[0.95, 0.65]} height={0.55} tone="hot" color={HUE.tang} delay={150} />
<KitLabel at={[0, 0.95, 0.15]} ko={CAPITAL.ko} han={CAPITAL.han} en={CAPITAL.en} size="xs" tone="strong" accent={HUE.tang} delay={250} />

<!-- farmer garrisons -->
{#each garrisons as g (g.i)}
	<KitNode
		at={[g.x, 0, g.z]}
		size={[0.28, 0.28]}
		height={0.24}
		tone={tone(0)}
		color={HUE.tang}
		delay={200 + g.i * 22}
	/>
	{#if g.turn}
		<KitLink
			points={[
				[g.x, 0.12, g.z],
				[g.x * 0.2, 0.12, g.z * 0.2]
			]}
			radius={0.02}
			tone={level === 0 ? 'dim' : 'ghost'}
			color={HUE.tang}
			pulse={level === 0}
			phase={g.i / 36}
			speed={0.3}
			delay={900 + g.i * 20}
		/>
	{/if}
{/each}

<!-- the Sixteen Guards -->
{#each guards as p (p.i)}
	<KitNode
		at={[p.x, 0, p.z]}
		shape="disc"
		size={[0.11]}
		height={0.5}
		tone={tone(1)}
		color={HUE.tang}
		show={level >= 1}
		delay={500 + p.i * 35}
	/>
{/each}

<!-- an expedition -->
<KitNode
	at={marshal}
	shape="disc"
	size={[0.3]}
	height={1.05}
	tone={level === 2 ? 'hot' : 'base'}
	color={HUE.tang}
	show={level >= 2}
	delay={700}
/>
<KitLabel
	at={[marshal[0], 1.5, marshal[2]]}
	ko={EXPEDITION.ko}
	han={EXPEDITION.han}
	en={level === 2 ? EXPEDITION.en : undefined}
	size="xs"
	tone={level === 2 ? 'accent' : 'muted'}
	accent={HUE.tang}
	show={level >= 2}
	delay={900}
/>
{#each column as c (c.i)}
	<KitNode
		at={c.at}
		size={[0.22, 0.22]}
		height={0.3}
		tone={tone(2)}
		color={HUE.tang}
		show={level >= 2}
		delay={1000 + c.i * 40}
	/>
{/each}
{#each [...levies, { i: -1, x: 0, z: 0 }] as g (g.i)}
	<KitLink
		points={[
			[g.x, 0.2, g.z],
			[marshal[0], 0.2, marshal[2]]
		]}
		radius={0.025}
		tone="accent"
		color={HUE.tang}
		pulse={level === 2}
		phase={(g.i + 1) / 9}
		show={level >= 2}
		delay={800}
	/>
{/each}

<!-- the protectorates -->
{#each towers as t, i (t.han)}
	<KitLink
		points={[
			[0, 0.04, 0],
			[t.at[0] * 0.92, 0.04, t.at[2] * 0.92]
		]}
		radius={0.02}
		tone="dim"
		color={HUE.tang}
		show={level >= 3}
		delay={900 + i * 100}
	/>
	<KitNode
		at={t.at}
		size={[0.55, 0.55]}
		height={1.3}
		tone="accent"
		color={HUE.tang}
		show={level >= 3}
		delay={1100 + i * 120}
	/>
	<KitLabel
		at={[t.at[0], 1.75, t.at[2]]}
		ko={t.ko}
		han={t.han}
		en={t.en}
		size="xs"
		tone="accent"
		accent={HUE.tang}
		show={level >= 3}
		delay={1250 + i * 120}
	/>
{/each}

<KitLabel
	at={[0, 0.05, R + (level === 3 ? 1.6 : 0.6)]}
	ko={caption.ko}
	han={caption.han}
	en={caption.en}
	size="sm"
	tone="accent"
	accent={HUE.tang}
	delay={1300}
	moveDelay={0}
/>
{#if note}
	<KitLabel
		at={[0, 0.05, R + (level === 3 ? 2.9 : 1.9)]}
		ko={note.ko}
		en={note.en}
		size="xs"
		tone="note"
		minor
		delay={1500}
	/>
{/if}
