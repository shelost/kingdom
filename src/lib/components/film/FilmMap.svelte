<script lang="ts">
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import KangrimRoad from '$lib/components/diagrams/KangrimRoad.svelte';
	import type { MapShow } from '$lib/film/present';
	import { reading } from '$lib/reading.svelte';

	let { map }: { map: MapShow } = $props();
	let ko = $derived(reading.lang === 'ko');
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
			washes={true}
			labels={true}
			nations={true}
			cities={false}
			tribes={false}
			rivers={true}
			detail={true}
			fish="off"
			mythic={false}
			nature={false}
			peoples={false}
			kinds={[]}
		/>
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
</style>
