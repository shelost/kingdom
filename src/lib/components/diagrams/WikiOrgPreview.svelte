<script lang="ts">
	/**
	 * Square wiki-card thumbnail: prefer the entry’s registered org-chart
	 * diagram; fall back to a compact `orgChart` tree when no diagram exists.
	 * `inset` floats it as a smoked-glass tile over a group still.
	 */
	import { DIAGRAMS } from './registry';
	import { chartsForWikiEntry } from './wikiCharts';
	import OrgChart from './OrgChart.svelte';
	import type { Person } from '$lib/people';

	/** Small charts never grow past the old fixed thumbnail scale. */
	const MAX_FIT = 0.42;
	const PAD = 5;

	let { entry, inset = false }: { entry: Person; inset?: boolean } = $props();

	let chart = $derived(chartsForWikiEntry(entry.id)[0]);
	let Diagram = $derived(chart ? DIAGRAMS[chart.diagram] : undefined);
	let nodes = $derived(entry.orgChart ?? []);
	let hasPreview = $derived(!!Diagram || nodes.length > 0);
	let fit = $state(MAX_FIT);

	/** Lay the tree out unwrapped at its natural size, then scale the whole of it into the square. */
	function fitTree(tree: HTMLElement) {
		const box = tree.parentElement;
		if (!box) return;
		const measure = () => {
			const w = tree.scrollWidth;
			const h = tree.scrollHeight;
			if (!w || !h) return;
			fit = Math.min(MAX_FIT, (box.clientWidth - PAD * 2) / w, (box.clientHeight - PAD * 2) / h);
		};
		const ro = new ResizeObserver(measure);
		ro.observe(tree);
		ro.observe(box);
		measure();
		return () => ro.disconnect();
	}
</script>

{#if hasPreview}
	<span class="org-preview" class:inset aria-hidden="true" inert>
		{#if Diagram && chart}
			<span class="org-preview-diagram">
				<Diagram step={chart.step} realm={chart.realm} active={true} flat />
			</span>
		{:else}
			<span class="org-preview-tree" style:--fit={fit} {@attach fitTree}>
				<OrgChart {nodes} flat />
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
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background:
			radial-gradient(ellipse 80% 60% at 50% 20%, rgba(216, 178, 106, 0.1), transparent 70%),
			var(--panel-sunken);
		pointer-events: none;
	}

	.org-preview.inset {
		position: absolute;
		right: 0.55rem;
		bottom: 0.55rem;
		z-index: 2;
		zoom: 0.8;
		border-color: rgba(255, 255, 255, 0.16);
		background:
			radial-gradient(ellipse 80% 60% at 50% 20%, rgba(216, 178, 106, 0.14), transparent 70%),
			rgba(10, 8, 6, 0.66);
		backdrop-filter: blur(6px) saturate(0.8);
		box-shadow: 0 8px 22px -10px rgba(0, 0, 0, 0.8);
	}

	/* Scale the live diagram into the square without fighting its intrinsic layout. */
	.org-preview-diagram {
		display: block;
		position: absolute;
		inset: 0;
		transform-origin: top left;
		width: 240%;
		height: 240%;
		transform: scale(0.42);
	}

	.org-preview-tree {
		display: block;
		position: absolute;
		left: 50%;
		top: 50%;
		width: max-content;
		transform-origin: center;
		transform: translate(-50%, -50%) scale(var(--fit, 0.42));
	}

	.org-preview-tree :global(.org-chart) {
		overflow: visible !important;
	}

	.org-preview-tree :global(.tier) {
		flex-wrap: nowrap;
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
