<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { NSFW_QUERY, nsfwQueryOn, nsfwUi } from '$lib/nsfwUi.svelte';

	let { compact = false }: { compact?: boolean } = $props();

	let on = $derived(nsfwUi.showIntimate);
	let label = $derived(on ? 'Intimate scenes on' : 'Intimate scenes off');
	let hint = $derived(
		on
			? 'Intimate art and script shown — click to hide'
			: 'Intimate art and script hidden — click to show'
	);

	function toggle() {
		const next = new URL(page.url);
		if (nsfwQueryOn(next)) next.searchParams.delete(NSFW_QUERY);
		else next.searchParams.set(NSFW_QUERY, 'true');
		void goto(`${next.pathname}${next.search}${next.hash}`, {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
	}
</script>

<button
	type="button"
	class="nsfw-toggle"
	class:compact
	class:on
	aria-pressed={on}
	aria-label={label}
	title={hint}
	onclick={toggle}
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
