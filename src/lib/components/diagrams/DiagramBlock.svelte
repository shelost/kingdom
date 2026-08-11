<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { DIAGRAMS } from './registry';

	type DiagramBlockT = Extract<Block, { kind: 'diagram' }>;

	let { block }: { block: DiagramBlockT } = $props();

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
		{#if block.title}<figcaption class="dg-title">{block.title}</figcaption>{/if}
		<div class="dg-canvas">
			<Diagram step={block.step} realm={block.realm} {active} />
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
	.diagram {
		margin: 1.6rem 0;
		padding: 1rem 1rem 0.85rem;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.015);
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
