<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { reading, leadLang, watchSection } from '$lib/reading.svelte';
	import type { SceneSummary } from '$lib/sceneSummary';

	let { live = true }: { live?: boolean } = $props();

	let summaries = $state<Record<string, SceneSummary> | null>(null);
	let active = $state<{ key: string; title: string } | null>(null);

	let ko = $derived(leadLang() === 'ko');
	let current = $derived(active && summaries?.[active.key]);

	onMount(() => {
		import('$lib/data/scene-summaries.json').then((m) => (summaries = m.default));
		return watchSection((next) => {
			if (next?.key !== active?.key || next?.title !== active?.title) active = next;
		});
	});
</script>

{#if live && current && reading.mode === 'script'}
	<aside class="scene-summary" aria-live="polite" transition:fade={{ duration: 180 }}>
		<p class="label">
			<span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
			{ko ? 'AI 요약' : 'AI summary'}
		</p>
		{#key active?.key}
			<div class="body" in:fade={{ duration: 220 }}>
				{#if active?.title}<p class="title">{active.title}</p>{/if}
				<p class="text">{ko ? current.ko : current.en}</p>
			</div>
		{/key}
	</aside>
{/if}

<style>
	/* Right of the centred script column, on the same centring math as
	   `.script.images-inline` in read/+page.svelte. */
	.scene-summary {
		display: none;
	}

	@media (min-width: 1280px) {
		.scene-summary {
			--ss-left: calc(
				max(calc(var(--reading-inset) + 3rem), calc(50vw - var(--script-measure) / 2)) +
					var(--script-measure) + 2.5rem
			);
			position: fixed;
			z-index: 20;
			top: 5.5rem;
			left: var(--ss-left);
			display: block;
			width: min(16rem, calc(100vw - var(--ss-left) - 1.5rem));
			padding: 0.85rem 1rem 0.95rem;
			border: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
			border-radius: 8px;
			background: rgb(0 0 0 / 0.1);
			backdrop-filter: blur(10px);
			font-family: var(--ui);
			transition: left var(--toc-duration) var(--toc-ease);
		}
	}

	.label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0 0 0.55rem;
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.label .material-symbols-outlined {
		font-size: 0.9rem;
	}

	.title {
		margin: 0 0 0.3rem;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.text {
		margin: 0;
		font-size: 0.84rem;
		line-height: 1.5;
		color: var(--fg);
	}
</style>
