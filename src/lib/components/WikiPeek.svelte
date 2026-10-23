<script lang="ts">
	/**
	 * Notion-style wiki side preview. Same overlay the wiki index uses —
	 * scrim, peek panel, WikiDetail — so /tree and /wiki open a person the same way.
	 */
	import { resolve } from '$app/paths';
	import { byId, colorOf } from '$lib/people';
	import { profileNameOf } from '$lib/givenNames';
	import WikiDetail from '$lib/components/WikiDetail.svelte';

	let {
		selectedId,
		expanded = false,
		onBack,
		onOpen,
		onExpand,
		onCollapse,
		onScrollEl
	}: {
		selectedId: string | null;
		expanded?: boolean;
		onBack: () => void;
		onOpen: (id: string) => void;
		onExpand: () => void;
		onCollapse: () => void;
		onScrollEl?: (el: HTMLElement | null | undefined) => void;
	} = $props();

	const selected = $derived(selectedId ? (byId.get(selectedId) ?? null) : null);
	const missing = $derived(!!selectedId && !selected);
</script>

{#if selected}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" class:full={expanded} onclick={onBack}></div>
	<div
		class="peek"
		class:full={expanded}
		style:--k={colorOf(selected)}
		role="dialog"
		aria-modal="true"
		aria-label="{profileNameOf(selected)} wiki entry"
	>
		<WikiDetail
			entry={selected}
			{expanded}
			{onBack}
			{onOpen}
			{onExpand}
			{onCollapse}
			onScrollEl={(el) => onScrollEl?.(el ?? undefined)}
		/>
	</div>
{:else if missing}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={onBack}></div>
	<div class="peek missing" role="dialog" aria-modal="true" aria-label="Entry not found">
		<header class="missing-head">
			<button type="button" class="missing-close" onclick={onBack} aria-label="Close">✕</button>
			<a href={resolve('/read')}>Chronicle</a>
		</header>
		<div class="missing-body">
			<h1>Not found</h1>
			<p>No entry matches <code>{selectedId}</code> in the chronicle’s records.</p>
		</div>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
		animation: fade-in 0.3s ease;
		transition: background 0.45s var(--ease);
	}

	.scrim.full {
		background: rgba(0, 0, 0, 0.72);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	.peek {
		position: fixed;
		top: 0.85rem;
		right: 0.85rem;
		bottom: 0.85rem;
		z-index: 115;
		width: min(36rem, calc(100vw - 1.7rem));
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		border-radius: 18px;
		box-shadow:
			0 28px 70px rgba(0, 0, 0, 0.55),
			0 8px 24px rgba(0, 0, 0, 0.35);
		animation: slide-in 0.42s cubic-bezier(0.22, 0.61, 0.36, 1);
		transition:
			top 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			right 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			bottom 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			left 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			width 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			border-radius 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			box-shadow 0.48s var(--ease);
	}

	.peek.full {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 0;
		border-color: transparent;
		box-shadow: none;
		animation: none;
	}

	.peek :global(.detail) {
		height: 100%;
	}

	@keyframes slide-in {
		from {
			opacity: 0.85;
			transform: translateX(calc(100% + 1rem));
		}
	}

	.missing-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.missing-close {
		width: 2.4rem;
		height: 2.4rem;
		display: grid;
		place-items: center;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.missing-head a {
		margin-left: auto;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
		text-decoration: none;
	}

	.missing-body {
		padding: 2rem 1.5rem;
	}

	.missing-body h1 {
		margin: 0 0 0.6rem;
		font-family: var(--serif);
		color: var(--fg-strong);
	}

	.missing-body code {
		color: var(--fg);
		font-family: var(--ui);
	}

	@media (max-width: 960px) {
		.peek {
			top: max(0.25rem, env(safe-area-inset-top, 0px));
			right: max(0.25rem, env(safe-area-inset-right, 0px));
			bottom: max(0.25rem, env(safe-area-inset-bottom, 0px));
			left: max(0.25rem, env(safe-area-inset-left, 0px));
			width: auto;
			border-radius: 14px;
		}

		.peek.full {
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			border-radius: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scrim,
		.peek {
			animation: none;
			transition: none;
		}
	}
</style>
