<script lang="ts">
	/**
	 * Three Departments and Six Ministries in 3D: the Emperor's dais at the
	 * back, three department pillars before it, and the six boards in a row
	 * under the Shangshu. In 'flow' the departments light one by one and a
	 * document travels draft → review → execute, then out to the boards.
	 */
	import KitNode from '../KitNode.svelte';
	import KitLink from '../KitLink.svelte';
	import KitLabel from '../KitLabel.svelte';
	import { HUE, box, getKit, spread, type Vec3 } from '../kit.svelte';
	import { DEPTS, MINISTRIES } from '../../TangDepartments.svelte';

	let { step = 'machine' }: { step?: string } = $props();

	const kit = getKit();
	$effect(() => kit.fit(box(-4.7, 4.7, -4.3, 3.1, 2.6)));

	const flow = $derived(step === 'flow');
	const ROLES = [
		{ ko: '기안', en: 'draft' },
		{ ko: '심사', en: 'review' },
		{ ko: '집행', en: 'execute' }
	];

	const DEPT_Z = -0.9;
	const DEPT_H = 1.5;
	const depts = DEPTS.map((d, i) => ({ ...d, i, x: (i - 1) * 3 }));
	const MIN_Z = 2.0;
	const minXs = spread(MINISTRIES.length, -3.9, 3.9);
	const exec = depts[2];

	const topOf = (x: number): Vec3 => [x, DEPT_H + 0.05, DEPT_Z];
</script>

<!-- the Emperor -->
<KitNode at={[0, 0, -3.3]} size={[2.4, 1.3]} height={0.45} tone="accent" color={HUE.tang} />
<KitNode
	at={[0, 0.45, -3.3]}
	shape="disc"
	size={[0.42]}
	height={0.95}
	tone="hot"
	color={HUE.tang}
	glow={0.35}
	delay={100}
/>
<KitLabel at={[0, 1.75, -3.3]} ko="황제" han="皇帝" en="Emperor" tone="strong" delay={150} />

<!-- emperor → three departments -->
{#each depts as d (d.en)}
	<KitLink
		points={[
			[0, 0.03, -2.6],
			[0, 0.03, -1.9],
			[d.x, 0.03, -1.9],
			[d.x, 0.03, DEPT_Z - 0.55]
		]}
		tone="accent"
		color={HUE.tang}
		delay={200 + d.i * 80}
	/>
{/each}

{#each depts as d (d.en)}
	<KitNode
		at={[d.x, 0, DEPT_Z]}
		size={[1.35, 1.0]}
		height={DEPT_H}
		tone={flow && !kit.active ? 'base' : 'accent'}
		color={HUE.tang}
		glow={flow && kit.active ? 0.45 : 0}
		delay={480 + d.i * 140}
		moveDelay={1600 + d.i * 500}
	/>
	<KitLabel
		at={[d.x, 0.75, DEPT_Z + 0.52]}
		ko={d.ko}
		han={d.han}
		en={d.en}
		size="sm"
		delay={600 + d.i * 140}
	/>
	<KitLabel
		at={[d.x, DEPT_H + 0.38, DEPT_Z]}
		ko={ROLES[d.i].ko}
		en={ROLES[d.i].en}
		size="xs"
		tone="accent"
		accent={HUE.tang}
		show={flow}
		delay={1600 + d.i * 500}
	/>
{/each}

<!-- the document's path over the department roofs -->
<KitLink
	points={[topOf(depts[0].x), [-1.5, DEPT_H + 0.55, DEPT_Z], topOf(depts[1].x)]}
	tone="hot"
	color={HUE.tang}
	radius={0.04}
	show={flow}
	pulse
	delay={1700}
/>
<KitLink
	points={[topOf(depts[1].x), [1.5, DEPT_H + 0.55, DEPT_Z], topOf(depts[2].x)]}
	tone="hot"
	color={HUE.tang}
	radius={0.04}
	show={flow}
	pulse
	phase={0.5}
	delay={2200}
/>

<!-- Shangshu → the six boards -->
<KitLink
	points={[
		[exec.x, 0.03, DEPT_Z + 0.5],
		[exec.x, 0.03, 1.1],
		[minXs[0], 0.03, 1.1]
	]}
	tone="accent"
	color={HUE.tang}
	delay={1120}
	pulse={flow}
	phase={0.2}
/>
{#each MINISTRIES as m, i (m.en)}
	<KitLink
		points={[
			[minXs[i], 0.03, 1.1],
			[minXs[i], 0.03, MIN_Z - 0.35]
		]}
		tone="accent"
		color={HUE.tang}
		delay={1240 + i * 60}
	/>
	<KitNode
		at={[minXs[i], 0, MIN_Z]}
		size={[0.95, 0.7]}
		height={0.7}
		tone={flow && kit.active ? 'hot' : 'base'}
		color={HUE.tang}
		delay={1320 + i * 80}
		moveDelay={3000 + i * 90}
	/>
	<KitLabel
		at={[minXs[i], 0.35, MIN_Z + 0.36]}
		ko={m.ko}
		han={m.han}
		en={m.en}
		size="xs"
		delay={1400 + i * 80}
	/>
{/each}

<KitLabel at={[2.35, 0.1, 1.1]} ko="상서육부" han="尚書六部" en="Six Ministries" size="xs" tone="note" minor delay={1240} />
<KitLabel
	at={[0, 0.05, 2.95]}
	ko="기안 · 심사 · 집행"
	en="one machine"
	size="xs"
	tone="note"
	accent={HUE.tang}
	delay={2000}
/>
