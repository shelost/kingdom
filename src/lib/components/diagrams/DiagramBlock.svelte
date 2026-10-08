<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { DIAGRAMS } from './registry';
	import Material from '../Material.svelte';

	type DiagramBlockT = Extract<Block, { kind: 'diagram' }>;

	let { block, year = null }: { block: DiagramBlockT; year?: number | null } = $props();

	const Diagram = $derived(DIAGRAMS[block.diagram]);

	let active = $state(false);

	// Scroll trigger, same shape as the reveal action: play once, the first
	// time the figure enters the viewport. When motion is reduced (or IO is
	// unavailable) we activate before first paint, so the diagram renders in
	// its final state with no animation.
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

	// Caption follows the prose rule: KO when the reader chose Korean and a
	// translation exists; EN otherwise; both lines in 'both' mode.
	const showKo = $derived(reading.lang !== 'en' && !!block.ko);
	const showEn = $derived(!!block.caption && (reading.lang !== 'ko' || !block.ko));
</script>

{#if Diagram}
	<figure class="diagram" {@attach play}>
		<Material kind="paper" />
		{#if block.title}<figcaption class="comic-caption">{block.title}</figcaption>{/if}
		<div class="dg-canvas">
			<Diagram step={block.step} realm={block.realm} cast={block.cast} {year} {active} />
		</div>
		{#if showEn || showKo}
			<p class="dg-caption">
				{#if showKo}<span class="ko">{block.ko}</span>{/if}
				{#if showEn}<span class="en">{block.caption}</span>{/if}
			</p>
		{/if}
	</figure>
{/if}

<style>
	/* An explainer panel on the page's own ground; the depth lives in the chart. */
	.diagram {
		position: relative;
		isolation: isolate;
		margin: var(--widget-gap) 0;
		padding: 1.5rem 1.1rem 0.95rem;
		border: 1px solid color-mix(in srgb, var(--gold) 18%, var(--hairline));
		border-radius: var(--widget-radius);
		background:
			radial-gradient(90% 70% at 50% 0%, color-mix(in srgb, var(--gold) 7%, transparent), transparent 70%),
			var(--panel);
	}

	.comic-caption {
		max-width: calc(100% - 1.8rem);
	}

	.dg-canvas {
		max-width: 36rem;
		margin: 0 auto;
	}

	.dg-canvas :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	.dg-caption {
		margin: 0.75rem 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid color-mix(in srgb, var(--gold) 18%, transparent);
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
		font-size: 0.875rem;
		line-height: 1.55;
		color: var(--fg-dim);
	}

	.dg-caption .ko {
		font-family: 'Noto Serif KR', var(--serif);
		color: var(--fg);
	}

	.dg-caption .en {
		font-style: italic;
	}
</style>
