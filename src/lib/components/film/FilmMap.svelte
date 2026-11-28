<script lang="ts">
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import KangrimRoad from '$lib/components/diagrams/KangrimRoad.svelte';
	import type { MapShow } from '$lib/film/present';
	import { smooth } from '$lib/film/timeline';
	import type { MapFocus } from '$lib/film/types';
	import { reading } from '$lib/reading.svelte';

	let { map }: { map: MapShow } = $props();
	let ko = $derived(reading.lang === 'ko');

	/** Sheet points. Wide is the peninsula window; the others are the capitals the line names. */
	const FOCUS: Record<MapFocus, { x: number; y: number; zoom: number; color: string }> = {
		wide: { x: 275, y: 460, zoom: 1, color: '#f4f1e8' },
		north: { x: 244, y: 341, zoom: 2.45, color: '#d0362f' },
		southeast: { x: 400, y: 618, zoom: 2.6, color: '#6fa8ff' },
		southwest: { x: 305, y: 596, zoom: 2.55, color: '#d9b13a' }
	};

	/** South out of the fallen kingdom, the way the refugees went. */
	const ARROWS: { from: [number, number]; to: [number, number] }[] = [
		{ from: [248, 390], to: [236, 500] },
		{ from: [248, 390], to: [310, 545] },
		{ from: [248, 390], to: [368, 608] },
		{ from: [248, 390], to: [292, 630] }
	];

	let u = $derived(smooth(map.k));
	let gaze = $derived.by(() => {
		if (map.mode !== 'peninsula') return null;
		const a = FOCUS[map.from];
		const b = FOCUS[map.focus];
		return {
			x: a.x + (b.x - a.x) * u,
			y: a.y + (b.y - a.y) * u,
			zoom: a.zoom + (b.zoom - a.zoom) * u
		};
	});
	let wash = $derived.by(() => {
		if (map.mode !== 'peninsula') return null;
		const b = FOCUS[map.focus];
		const here = map.focus === 'wide' ? { x: 248, y: 390, color: '#f7f4ee' } : b;
		return { x: here.x, y: here.y, color: here.color };
	});
	let arrowK = $derived(map.arrows === 'draw' ? u : map.arrows === 'hold' ? 1 : 0);
	let yearIn = $derived(map.mark ? Math.min(1, map.k * 2.4) : 0);
	let kingdoms = $derived(map.mode === 'samhan');
</script>

<div class="map">
	{#if map.mode === 'road'}
		<KangrimRoad step={map.step ?? 'samhan'} year={map.year} active fill />
	{:else}
		<CosmosFlat
			year={map.year}
			scope="samhan"
			{ko}
			terrain={true}
			washes={kingdoms}
			labels={kingdoms}
			nations={kingdoms}
			cities={false}
			tribes={false}
			rivers={kingdoms}
			detail={kingdoms}
			fish="off"
			mythic={false}
			nature={false}
			peoples={false}
			kinds={[]}
			night={true}
			dim={!kingdoms}
			{gaze}
			arrows={map.arrows ? ARROWS : []}
			{arrowK}
			{wash}
		/>
	{/if}
	{#if map.mark}
		<p class="year" style:opacity={yearIn} style:transform="translateY({(1 - yearIn) * 28}px)">{map.mark}</p>
	{/if}
</div>

<style>
	.map {
		position: absolute;
		inset: 0;
		background: #0c1014;
		pointer-events: none;
	}
	.map :global(.sheet),
	.map :global(.road) {
		width: 100%;
		height: 100%;
		border-radius: 0;
		background: #0c1014;
	}
	.year {
		position: absolute;
		top: 8%;
		left: 6%;
		margin: 0;
		font-size: clamp(6.5rem, 20vw, 14rem);
		font-weight: 560;
		letter-spacing: -0.05em;
		line-height: 0.82;
		color: #f7f4ee;
		text-shadow: 0 18px 50px rgba(0, 0, 0, 0.65);
		pointer-events: none;
	}
</style>
