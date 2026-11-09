<script lang="ts">
	/**
	 * One frame of the maps-page cosmos, with Kangrim's cord drawn to this stop.
	 * `step` is a stop id in `kangrimRoad`. Drag turns it. The wheel still scrolls.
	 */
	import { setFishEye } from '$lib/cosmos';
	import { kangrimPoints, kangrimStop } from '$lib/kangrimRoad';
	import { reading } from '$lib/reading.svelte';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import KitStage from './three/KitStage.svelte';
	import { MAP_SCENE } from './three/scenes';

	let {
		step = 'samhan',
		active = false,
		flat = false,
		year = null,
		realm: _realm = undefined,
		cast: _cast = undefined,
		diagram: _diagram = undefined
	}: {
		step?: string;
		active?: boolean;
		flat?: boolean;
		year?: number | null;
		realm?: string;
		cast?: Record<string, string>;
		diagram?: string;
	} = $props();

	let mapYear = $derived(typeof year === 'number' ? year : 642);

	let stop = $derived(kangrimStop(step) ?? kangrimStop('samhan'));
	let ko = $derived(reading.lang === 'ko');
	let road = $derived.by(() => {
		setFishEye('mid');
		const frame = kangrimPoints(stop?.id ?? 'samhan');
		return { here: frame.here, points: frame.points };
	});
</script>

<div class="road" aria-label={ko ? (stop?.ko ?? '강림의 길') : (stop?.en ?? "Kangrim's road")}>
	<KitStage
		scene={MAP_SCENE}
		{active}
		{flat}
		turnable
		keepFallback={false}
		aspect={1.7}
		narrowAspect={1.15}
		reframe={stop?.id}
		sceneProps={{
			year: mapYear,
			ko,
			scope: stop?.scope ?? 'world',
			layout: 'circles',
			fish: 'mid',
			terrain: true,
			labels: true,
			rivers: false,
			kinds: [],
			road
		}}
	>
		{#snippet fallback()}
			<CosmosFlat
				year={mapYear}
				{ko}
				scope={stop?.scope ?? 'world'}
				layout="circles"
				fish="mid"
				terrain
				labels
				rivers={false}
				kinds={[]}
				{road}
			/>
		{/snippet}
	</KitStage>
</div>

<style>
	.road {
		width: 100%;
	}
</style>
