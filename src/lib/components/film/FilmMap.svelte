<script lang="ts">
	import FilmTerrain from './FilmTerrain.svelte';
	import KangrimRoad from '$lib/components/diagrams/KangrimRoad.svelte';
	import type { MapShow } from '$lib/film/mapPlan';

	let { map }: { map: MapShow } = $props();
</script>

<div class="map">
	{#if map.mode === 'road'}
		<KangrimRoad step={map.step ?? 'samhan'} year={map.year} active fill />
	{:else}
		<FilmTerrain {map} />
	{/if}
</div>

<style>
	.map {
		position: absolute;
		inset: 0;
		background: #05070d;
		pointer-events: none;
	}
	.map :global(.road) {
		width: 100%;
		height: 100%;
		border-radius: 0;
		background: #0c1014;
	}
</style>
