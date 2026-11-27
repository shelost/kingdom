<script lang="ts">
	import StageCanvas from '$lib/components/stage/StageCanvas.svelte';
	import type { Label, StageDrive, View } from '$lib/stage/build';
	import type { StageStyle } from '$lib/stage/post';
	import type { StageSiteId } from '$lib/stage/sites';

	let {
		site,
		year,
		hour,
		look,
		people,
		drive,
		onbuilt
	}: {
		site: StageSiteId;
		year: number;
		hour: number;
		look: StageStyle;
		people: boolean;
		drive: StageDrive;
		onbuilt: (site: StageSiteId, info: { views: View[]; labels: Label[]; allViews?: View[]; allLabels?: Label[] } | null) => void;
	} = $props();
</script>

<div class="stage">
	<StageCanvas
		{site}
		{year}
		{hour}
		view="board"
		labels={false}
		style={look}
		{people}
		boats={false}
		quality="medium"
		{drive}
		onbuilt={(info) => onbuilt(site, info)}
	/>
</div>

<style>
	.stage {
		position: absolute;
		inset: 0;
	}
	.stage :global(.host) {
		width: 100%;
		height: 100%;
	}
</style>
