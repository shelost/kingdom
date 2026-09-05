<script lang="ts">
	import { nsfwUi, toggleShowIntimate } from '$lib/nsfwUi.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	let label = $derived(nsfwUi.showIntimate ? 'Intimate scenes on' : 'Intimate scenes off');
	let hint = $derived(
		nsfwUi.showIntimate
			? 'Intimate scenes shown — click to hide'
			: 'Intimate scenes hidden — click to show'
	);
</script>

<button
	type="button"
	class="nsfw-toggle"
	class:compact
	class:on={nsfwUi.showIntimate}
	aria-pressed={nsfwUi.showIntimate}
	aria-label={label}
	title={hint}
	onclick={toggleShowIntimate}
>
	{#if compact}
		<span class="wide">Intimate</span>
		<span class="narrow">NSFW</span>
	{:else}
		{label}
	{/if}
</button>

<style>
	.nsfw-toggle {
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0.28rem 0.85rem;
		cursor: pointer;
		backdrop-filter: blur(14px);
		white-space: nowrap;
		transition:
			background 0.25s var(--ease),
			color 0.25s var(--ease),
			border-color 0.25s var(--ease);
	}

	.nsfw-toggle:hover {
		color: var(--fg);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.nsfw-toggle.on {
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.nsfw-toggle.compact {
		font-size: 0.7rem;
		letter-spacing: 0.03em;
		padding: 0.22rem 0.6rem;
	}

	.narrow {
		display: none;
	}

	@media (max-width: 1100px) {
		.nsfw-toggle.compact {
			padding: 0.22rem 0.45rem;
			font-size: 0.65rem;
		}

		.nsfw-toggle.compact .wide {
			display: none;
		}

		.nsfw-toggle.compact .narrow {
			display: inline;
		}
	}
</style>
