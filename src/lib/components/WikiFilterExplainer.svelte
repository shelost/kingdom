<script lang="ts">
	/**
	 * Shelf notes for wiki kinds that need a map (gods, flowers, …). Slides in
	 * from the right and pushes the app. Kinds without a `wikiExplainers` entry
	 * show nothing.
	 */
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import PantheonChart from '$lib/components/diagrams/PantheonChart.svelte';
	import { PANTHEON_SIDE_COLORS } from '$lib/wiki';
	import { WIKI_EXPLAINERS } from '$lib/wikiExplainers';
	import type { WikiKind } from '$lib/wiki';

	let { kind }: { kind: WikiKind | 'all' } = $props();

	const STORAGE_KEY = 'wiki:explainerOpen';
	/** Full panel, and the tab left showing when it is shut. Keep these in step with the CSS. */
	const PANEL = 'min(22rem, calc(100vw - 4.5rem))';
	const TAB = '2.75rem';
	/** Centered page shell — panel hangs from this column’s right edge, not always the screen. */
	const SHELL = '96rem';

	let open = $state(true);

	onMount(() => {
		if (!browser) return;
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === '0') open = false;
		else if (raw === '1') open = true;
	});

	function toggle() {
		open = !open;
		if (browser) localStorage.setItem(STORAGE_KEY, open ? '1' : '0');
	}

	const entry = $derived(kind === 'all' ? undefined : WIKI_EXPLAINERS[kind]);
	const show = $derived(!!entry);

	$effect(() => {
		if (!browser) return;
		const root = document.documentElement;
		root.style.setProperty('--wiki-panel-w', PANEL);
		root.style.setProperty('--wiki-tab-w', TAB);
		root.style.setProperty('--wiki-shell', SHELL);
		root.style.setProperty('--app-push', show ? (open ? PANEL : TAB) : '0px');
		root.classList.toggle('app-pushed', show && open);
	});

	$effect(() => {
		if (!browser) return;
		return () => {
			const root = document.documentElement;
			root.style.removeProperty('--app-push');
			root.style.removeProperty('--wiki-panel-w');
			root.style.removeProperty('--wiki-tab-w');
			root.style.removeProperty('--wiki-shell');
			root.classList.remove('app-pushed');
		};
	});

</script>

{#if show && entry}
	<aside class="explainer" class:open aria-label="{entry.title} explainer">
		<header class="explainer-head">
			<button
				type="button"
				class="toggle"
				aria-expanded={open}
				aria-label={open ? `Close ${entry.title}` : `Open ${entry.title}`}
				onclick={toggle}
			>
				<span class="toggle-label">
					<span class="eyebrow">{entry.eyebrow}</span>
					<span class="title">{entry.title}</span>
				</span>
				<span class="chev material-symbols-outlined" aria-hidden="true"
					>{open ? 'chevron_right' : 'chevron_left'}</span
				>
			</button>
		</header>

		{#if open}
			<div class="explainer-body">
				<p class="lede">{entry.lede}</p>

				{#if entry.chart === 'pantheon'}
					<div class="swatches" aria-hidden="true">
						<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.life}>이승 · Life</span>
						<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.death}>저승 · Death</span>
						<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.flower}>서천 · WH</span>
					</div>

					<div class="chart-wrap">
						<PantheonChart step="courts" active={true} flat />
					</div>
				{/if}

				<ol class="tiers">
					{#each entry.shelves as t (t.id)}
						<li>
							<strong>{t.label}</strong>
							<span>{t.body}</span>
						</li>
					{/each}
				</ol>
			</div>
		{/if}
	</aside>
{/if}

<style lang="scss">
	.explainer {
		position: fixed;
		z-index: 40;
		top: 0;
		/* Sit on the right of the centered shell, not always the screen edge. */
		right: max(0px, calc((100vw - var(--wiki-shell, 96rem)) / 2));
		display: flex;
		flex-direction: column;
		width: var(--wiki-panel-w, min(22rem, calc(100vw - 4.5rem)));
		height: 100dvh;
		border: 0;
		border-radius: 0;
		background: var(--bg);
		box-shadow: none;
		overflow: hidden;
		color: var(--fg);
		transform: translateX(calc(100% - var(--wiki-tab-w, 2.75rem)));
		transition:
			transform 0.46s cubic-bezier(0.32, 0.72, 0, 1),
			right 0.46s cubic-bezier(0.32, 0.72, 0, 1);
		&.open {
			transform: translateX(0);
		}
	}

	.explainer-head {
		margin: 0;
	}

	.toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		width: 100%;
		padding: max(1.5rem, env(safe-area-inset-top, 0px)) 1.5rem 1rem;
		.explainer:not(.open) & {
			position: absolute;
			inset: 0 auto 0 0;
			width: var(--wiki-tab-w, 2.75rem);
			height: 100%;
			justify-content: center;
			padding: 0;
		}
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		cursor: pointer;
		text-align: left;
		&:focus-visible {
			outline: 2px solid var(--gold);
			outline-offset: -2px;
		}
	}

	.toggle-label {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		min-width: 0;
		.explainer:not(.open) & {
			display: none;
		}
	}

	.eyebrow {
		font-family: var(--ui);
		font-size: 0.58rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.title {
		font-family: var(--serif);
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--fg-strong);
	}

	.chev {
		font-size: 1.2rem;
		color: var(--fg-faint);
		flex-shrink: 0;
	}

	.explainer-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 1.25rem;
		min-height: 0;
		overflow: auto;
		padding: 0.25rem 1.5rem max(1.75rem, env(safe-area-inset-bottom, 0px));
	}

	.lede {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.88rem;
		line-height: 1.5;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
	}

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
	}

	.swatch {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0;
		border-radius: 0;
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-dim);
		background: none;
		border: 0;
		&::before {
			content: '';
			width: 0.4rem;
			height: 0.4rem;
			border-radius: 50%;
			background: var(--c);
		}
	}

	.chart-wrap {
		border-radius: 0;
		border: 0;
		background: none;
		overflow: hidden;
		aspect-ratio: 5 / 4;
		:global(.kit-stage),
		:global(svg.dg) {
			width: 100%;
			height: 100%;
			display: block;
		}
	}

	.tiers {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		li {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
		}
		strong {
			font-family: var(--ui);
			font-size: 0.65rem;
			font-weight: 650;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--fg-strong);
		}
		span {
			font-family: var(--ui);
			font-size: 0.84rem;
			line-height: 1.45;
			color: var(--fg-dim);
		}
	}
</style>
