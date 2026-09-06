<script lang="ts">
	/**
	 * Wiki encyclopedia org-charts. List mode takes `entryId` and renders one
	 * figure per chart; figure mode takes `chart` (self-import) so each instance
	 * owns its own scroll-triggered `active` state — same play-on-scroll pattern
	 * as DiagramBlock.
	 */
	import { DIAGRAMS } from './registry';
	import { chartsForWikiEntry, type WikiChartSpec } from './wikiCharts';
	import WikiChartFigure from './WikiOrgCharts.svelte';

	let { entryId, chart }: { entryId?: string; chart?: WikiChartSpec } = $props();

	const charts = $derived(entryId ? chartsForWikiEntry(entryId) : []);

	const Diagram = $derived(chart ? DIAGRAMS[chart.diagram] : undefined);

	let active = $state(false);

	// Scroll trigger: play once on first viewport entry. Reduced motion / no IO
	// → activate before paint so the diagram lands in its final state.
	function play(node: HTMLElement) {
		const reduced =
			typeof matchMedia !== 'undefined' &&
			matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced || typeof IntersectionObserver === 'undefined') {
			active = true;
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					active = true;
					io.disconnect();
				}
			},
			{ rootMargin: '0px 0px -14% 0px', threshold: 0.25 }
		);
		io.observe(node);
		return () => io.disconnect();
	}

	function figureKey(c: WikiChartSpec, i: number) {
		return `${c.diagram}:${c.step ?? ''}:${c.realm ?? ''}:${i}`;
	}
</script>

{#if chart}
	{#if Diagram}
		<figure class="diagram" {@attach play}>
			{#if chart.title}<figcaption class="dg-title">{chart.title}</figcaption>{/if}
			<div class="dg-canvas">
				<Diagram step={chart.step} realm={chart.realm} {active} />
			</div>
			{#if chart.ko || chart.caption}
				<p class="dg-caption">
					{#if chart.ko}<span class="ko">{chart.ko}</span>{/if}
					{#if chart.caption}<span class="en">{chart.caption}</span>{/if}
				</p>
			{/if}
		</figure>
	{/if}
{:else if charts.length}
	{#each charts as c, i (figureKey(c, i))}
		<WikiChartFigure chart={c} />
	{/each}
{/if}

<style>
	.diagram {
		margin: 1.6rem 0;
		padding: 1rem 1rem 0.85rem;
		border: 1px solid color-mix(in srgb, var(--gold) 35%, var(--hairline));
		border-radius: var(--radius);
		background:
			radial-gradient(ellipse 90% 70% at 50% 0%, color-mix(in srgb, var(--gold) 14%, transparent), transparent 65%),
			color-mix(in srgb, var(--k, var(--gold)) 8%, rgba(255, 255, 255, 0.02));
	}

	.diagram:first-child {
		margin-top: 0;
	}

	.dg-title {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
		margin-bottom: 0.55rem;
	}

	.dg-canvas {
		max-width: 30rem;
		margin: 0 auto;
	}

	.dg-canvas :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	.dg-caption {
		margin: 0.65rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
		font-size: 0.76rem;
		line-height: 1.55;
		color: var(--fg-faint);
	}

	.dg-caption .ko {
		font-family: 'Noto Serif KR', var(--serif);
		color: var(--fg-dim);
	}

	.dg-caption .en {
		font-style: italic;
	}
</style>
