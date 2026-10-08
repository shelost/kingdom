<script lang="ts">
	/**
	 * Three heads on plinths: the Goguryeo jeolpung with two pheasant
	 * feathers and chin cords, a Silla birch-bark cap with its gold wing
	 * ornament, and a Baekje black silk cap with a silver flower.
	 */
	import KitNode from '../../KitNode.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import Part from './Part.svelte';
	import { HUE, box } from '../../kit.svelte';
	import { useOrbit } from './orbit.svelte';

	useOrbit(box(-4.1, 4.1, -1.3, 1.3, 3.5), [
		{ az: 0.32, el: 0.26 },
		{ az: -0.42, el: 0.2 }
	]);

	const HEADS = [
		{ x: -2.8, hue: HUE.goguryeo, ko: '고구려 · 절풍과 새 깃', en: 'Goguryeo · jeolpung, two feathers' },
		{ x: 0, hue: HUE.silla, ko: '신라 · 금제 새 날개', en: 'Silla · gold wings' },
		{ x: 2.8, hue: HUE.baekje, ko: '백제 · 은제 꽃', en: 'Baekje · silver flower' }
	];
	const SKIN = '#cdb69a';
	const wait = (k: number) => 200 + k * 260;
</script>

{#each HEADS as h, k (h.x)}
	<KitNode at={[h.x, 0, 0]} size={[1.3, 1.3]} height={0.5} tone="accent" color={h.hue} delay={wait(k)} />
	<Part shape="cyl" args={[0.17, 0.2, 0.5]} at={[h.x, 0.75, 0]} mat={SKIN} delay={wait(k) + 100} />
	<Part shape="ball" args={[0.55]} at={[h.x, 1.5, 0]} scale={[0.92, 1, 0.95]} mat={SKIN} delay={wait(k) + 150} />
	<KitLabel at={[h.x, 0.25, 0.68]} ko={h.ko} en={h.en} size="sm" tone="accent" accent={h.hue} delay={wait(k) + 500} />
{/each}

<!-- Goguryeo: peaked cap, two barred feathers, cords under the chin -->
<Part shape="cone" args={[0.5, 0.6]} at={[-2.8, 2.28, -0.02]} mat="silk" delay={700} />
{#each [-1, 1] as side (side)}
	<Part shape="ball" args={[1]} at={[-2.8 + side * 0.5, 2.85, -0.02]} rot={[0, 0, -side * 0.38]} scale={[0.075, 0.8, 0.016]} mat="feather" delay={900} />
	{#each [0.25, 0.45, 0.65, 0.85] as f (f)}
		<Part
			shape="box"
			args={[0.13, 0.025, 0.03]}
			at={[-2.8 + side * (0.2 + f * 0.59), 2.11 + f * 1.49, -0.02]}
			rot={[0, 0, -side * 0.38]}
			mat="leather"
			delay={1000}
		/>
	{/each}
	<Part shape="cyl" args={[0.014, 0.014, 0.9]} at={[-2.8 + side * 0.4, 1.45, 0.32]} rot={[0, 0, side * 0.32]} mat="leather" delay={1050} />
{/each}
<KitLabel at={[-2.8 + 0.95, 3.15, 0]} ko="새 깃 둘" en="two feathers" size="xs" tone="note" minor delay={1300} />
<KitLabel at={[-2.8 - 0.8, 1.15, 0.4]} ko="갓끈" en="chin cords" size="xs" tone="note" minor delay={1350} />

<!-- Silla: birch-bark cap, gold wings slotted in at the front -->
<Part shape="cyl" args={[0.3, 0.42, 0.62]} at={[0, 2.18, 0]} mat="bark" delay={950} />
<Part shape="box" args={[0.05, 0.95, 0.02]} at={[0, 2.55, 0.42]} mat="gold" delay={1150} />
{#each [-1, 1] as side (side)}
	<Part shape="ball" args={[1]} at={[side * 0.36, 2.7, 0.4]} rot={[0, 0, -side * 0.75]} scale={[0.13, 0.48, 0.012]} mat="gold" delay={1200} />
	{#each [0.25, 0.55, 0.85] as f (f)}
		<Part shape="ball" args={[0.032]} at={[side * (0.08 + f * 0.58), 2.36 + f * 0.62, 0.43]} mat="gold" delay={1350} />
	{/each}
{/each}
<KitLabel at={[0.95, 3.25, 0.4]} ko="금 날개 장식" en="gold wing ornament" size="xs" tone="note" minor delay={1500} />
<KitLabel at={[-0.85, 2.05, 0.3]} ko="자작나무 껍질 관" en="birch-bark cap" size="xs" tone="note" minor delay={1550} />

<!-- Baekje: black silk cap, silver flower for the sixth rank and up -->
<Part shape="ball" args={[0.5]} at={[2.8, 1.97, 0]} scale={[1, 0.72, 1]} mat="silk" delay={1200} />
<Part shape="box" args={[0.04, 1.0, 0.02]} at={[2.8, 2.55, 0.4]} mat="silver" delay={1400} />
{#each [-1, 1] as side (side)}
	<Part shape="box" args={[0.03, 0.42, 0.02]} at={[2.8 + side * 0.14, 2.42, 0.4]} rot={[0, 0, -side * 0.7]} mat="silver" delay={1450} />
	<Part shape="box" args={[0.03, 0.34, 0.02]} at={[2.8 + side * 0.1, 2.76, 0.4]} rot={[0, 0, -side * 0.55]} mat="silver" delay={1480} />
	<Part shape="ball" args={[0.065]} at={[2.8 + side * 0.29, 2.58, 0.4]} scale={[0.8, 1.2, 0.6]} mat="silver" delay={1550} />
	<Part shape="ball" args={[0.06]} at={[2.8 + side * 0.21, 2.9, 0.4]} scale={[0.8, 1.2, 0.6]} mat="silver" delay={1580} />
{/each}
<Part shape="ball" args={[0.07]} at={[2.8, 3.08, 0.4]} scale={[0.8, 1.25, 0.6]} mat="silver" delay={1620} />
<KitLabel at={[2.8 + 0.85, 3.15, 0.4]} ko="은꽃" en="silver flower" size="xs" tone="note" minor delay={1700} />
<KitLabel at={[2.8 + 0.85, 1.85, 0.3]} ko="검은 비단 관" en="black silk cap" size="xs" tone="note" minor delay={1750} />
