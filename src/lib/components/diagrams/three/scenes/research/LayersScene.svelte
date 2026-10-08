<script lang="ts">
	/**
	 * The shared northern riding dress on two figures: a man in a hip-length
	 * jacket crossed and belted, contrast trim at hem, collar and cuffs, wide
	 * trousers gathered at the ankle, boots, and a long coat over all (drawn
	 * as a glass shell); a woman in the same jacket over a pleated skirt.
	 */
	import KitLabel from '../../KitLabel.svelte';
	import Part from './Part.svelte';
	import { box } from '../../kit.svelte';
	import { useOrbit } from './orbit.svelte';

	useOrbit(box(-3.1, 3.1, -1.1, 1.1, 3.1), [
		{ az: 0.3, el: 0.16 },
		{ az: -0.55, el: 0.2 }
	]);

	const M = -1.6;
	const W = 1.6;
	const SKIN = '#cdb69a';
	const UP = Math.PI / 2;
	const SIDES = [-1, 1];
</script>

{#snippet jacket(x: number, cloth: string, hem: number, len: number, d: number)}
	<Part shape="cyl" args={[0.34, 0.48, len]} at={[x, hem + len / 2, 0]} mat={cloth} delay={d} />
	<Part shape="torus" args={[0.48, 0.035]} at={[x, hem + 0.02, 0]} rot={[UP, 0, 0]} mat="red" delay={d + 150} />
	<Part shape="box" args={[0.07, 0.62, 0.03]} at={[x + 0.06, hem + len - 0.25, 0.4]} rot={[0.2, 0, -0.55]} mat="red" delay={d + 180} />
	<Part shape="torus" args={[0.42, 0.045]} at={[x, hem + 0.24, 0]} rot={[UP, 0, 0]} mat="leather" delay={d + 220} />
	{#each SIDES as s (s)}
		<Part shape="cyl" args={[0.13, 0.16, 0.85]} at={[x + s * 0.55, hem + len - 0.32, 0]} rot={[0, 0, s * 0.35]} mat={cloth} delay={d + 100} />
		<Part shape="cyl" args={[0.165, 0.165, 0.07]} at={[x + s * 0.695, hem + len - 0.72, 0]} rot={[0, 0, s * 0.35]} mat="red" delay={d + 200} />
	{/each}
	<Part shape="cyl" args={[0.1, 0.11, 0.2]} at={[x, hem + len + 0.08, 0]} mat={SKIN} delay={d + 120} />
	<Part shape="ball" args={[0.26]} at={[x, hem + len + 0.38, 0]} mat={SKIN} delay={d + 160} />
{/snippet}

<!-- man -->
{#each SIDES as s (s)}
	<Part shape="box" args={[0.22, 0.22, 0.36]} at={[M + s * 0.17, 0.11, 0.05]} mat="leather" delay={150} />
	<Part shape="cyl" args={[0.21, 0.14, 1.1]} at={[M + s * 0.17, 0.77, 0]} mat="#d8ccb2" delay={250} />
	<Part shape="torus" args={[0.145, 0.03]} at={[M + s * 0.17, 0.27, 0]} rot={[UP, 0, 0]} mat="red" delay={400} />
{/each}
{@render jacket(M, '#e3d7c0', 1.27, 0.95, 450)}
<Part shape="ball" args={[0.1]} at={[M, 2.86, -0.04]} mat="silk" delay={700} />
<Part shape="cyl" args={[0.44, 0.78, 2.0]} at={[M, 1.28, 0]} mat="#6d4a86" opacity={0.22} delay={1300} />

<!-- woman -->
<Part shape="cyl" args={[0.34, 0.88, 1.5]} at={[W, 0.75, 0]} mat="#a8483c" facets={18} delay={600} />
<Part shape="torus" args={[0.88, 0.03]} at={[W, 0.04, 0]} rot={[UP, 0, 0]} mat="#e3d7c0" delay={800} />
{@render jacket(W, '#e8dcc4', 1.42, 0.78, 850)}
<Part shape="ball" args={[0.21]} at={[W, 2.86, -0.02]} scale={[1, 0.75, 1]} mat="silk" delay={1100} />

<KitLabel at={[M - 1.05, 1.95, 0]} ko="저고리(유), 엉덩이까지" en="jacket (yu) to the hip" size="xs" tone="note" delay={900} />
<KitLabel at={[M + 0.95, 1.2, 0.35]} ko="선(襈)" en="contrast trim" size="xs" tone="note" delay={1000} />
<KitLabel at={[M - 0.95, 0.8, 0]} ko="통 넓은 바지" en="wide trousers" size="xs" tone="note" delay={1050} />
<KitLabel at={[M + 0.7, 0.12, 0.35]} ko="가죽 장화" en="leather boots" size="xs" tone="note" minor delay={1100} />
<KitLabel at={[M - 0.95, 2.6, 0]} ko="그 위에 포" en="coat (po) over all" size="xs" tone="note" delay={1500} />
<KitLabel at={[W + 0.75, 2.95, 0]} ko="틀어 올린 머리" en="coiled hair" size="xs" tone="note" minor delay={1200} />
<KitLabel at={[W + 1.2, 0.6, 0]} ko="주름치마" en="pleated skirt" size="xs" tone="note" delay={1250} />
