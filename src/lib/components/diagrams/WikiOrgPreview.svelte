<script lang="ts">
	/**
	 * Square wiki-card thumbnail: prefer the entry’s registered org-chart
	 * diagram; fall back to a compact `orgChart` tree when no diagram exists.
	 */
	import { DIAGRAMS } from './registry';
	import { chartsForWikiEntry } from './wikiCharts';
	import OrgChart from './OrgChart.svelte';
	import type { Person } from '$lib/people';

	let { entry }: { entry: Person } = $props();

	let chart = $derived(chartsForWikiEntry(entry.id)[0]);
	let Diagram = $derived(chart ? DIAGRAMS[chart.diagram] : undefined);
	let nodes = $derived(entry.orgChart ?? []);
	let hasPreview = $derived(!!Diagram || nodes.length > 0);
</script>

{#if hasPreview}
	<span class="org-preview" aria-hidden="true" inert>
		{#if Diagram && chart}
			<span class="org-preview-diagram">
				<Diagram step={chart.step} realm={chart.realm} active={true} />
			</span>
		{:else}
			<span class="org-preview-tree">
				<OrgChart {nodes} />
			</span>
		{/if}
	</span>
{/if}

<style>
	.org-preview {
		display: block;
		position: relative;
		flex-shrink: 0;
		width: 5.75rem;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 10px;
		border: 1px solid var(--hairline);
		background:
			radial-gradient(ellipse 80% 60% at 50% 20%, rgba(216, 178, 106, 0.1), transparent 70%),
			var(--panel-sunken);
		pointer-events: none;
	}

	.org-preview-diagram,
	.org-preview-tree {
		display: block;
		position: absolute;
		inset: 0;
		transform-origin: top left;
	}

	/* Scale the live diagram into the square without fighting its intrinsic layout. */
	.org-preview-diagram {
		width: 240%;
		height: 240%;
		transform: scale(0.42);
	}

	.org-preview-tree {
		width: 240%;
		height: 240%;
		transform: scale(0.42);
		padding: 0.35rem;
	}

	.org-preview :global(.diagram),
	.org-preview :global(figure),
	.org-preview :global(.org-chart) {
		margin: 0 !important;
		padding: 0 !important;
		border: none !important;
		background: transparent !important;
		box-shadow: none !important;
	}

	.org-preview :global(.dg-title),
	.org-preview :global(.dg-caption),
	.org-preview :global(figcaption) {
		display: none !important;
	}
</style>
