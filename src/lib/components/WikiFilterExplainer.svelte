<script lang="ts">
	/**
	 * Collapsible rounded right panel for certain wiki Type filters.
	 * Gods → pantheon org chart + tier map. Other kinds can register later.
	 */
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import PantheonChart from '$lib/components/diagrams/PantheonChart.svelte';
	import { PANTHEON_SIDE_COLORS } from '$lib/wiki';
	import type { WikiKind } from '$lib/wiki';

	let { kind }: { kind: WikiKind | 'all' } = $props();

	const STORAGE_KEY = 'wiki:explainerOpen';

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

	const show = $derived(kind === 'god');

	const tiers = [
		{
			id: 'I',
			label: 'Tier I · Lords',
			body: 'Daebyul (Lord of Death), Sobyul (Lord of Life), Hallakgungi (The Gardener).'
		},
		{
			id: 'II',
			label: 'Tier II · Domains',
			body: 'Life — Haemosu (Sun), Ibiga (Sky), Samsin (Life). Death — Yumla (Judge), Bari (Guide), Gusamsin (Death).'
		},
		{
			id: 'III',
			label: 'Tier III · Roles',
			body: 'Kangrim, Haewonmek, Mujangsung (Gate Guardian of the Western Heavens), and other offices.'
		},
		{
			id: 'IV',
			label: 'Tier IV · Particulars',
			body: 'Gods of specific places — Lady of the Right View (Goddess of Gaya Mountain), river and island shrine gods.'
		}
	] as const;
</script>

{#if show}
	<aside class="explainer" class:open aria-label="Pantheon explainer">
		<header class="explainer-head">
			<button type="button" class="toggle" aria-expanded={open} onclick={toggle}>
				<span class="toggle-label">
					<span class="eyebrow">삼계</span>
					<span class="title">The Pantheon</span>
				</span>
				<span class="chev material-symbols-outlined" aria-hidden="true"
					>{open ? 'expand_more' : 'chevron_left'}</span
				>
			</button>
		</header>

		{#if open}
			<div class="explainer-body">
				<p class="lede">
					Hannim sits above. Below him three courts: living world (red), land of the dead (blue),
					western flower field (green). Heaven–Earth King once held living and dead together —
					his border wears all three.
				</p>

				<div class="swatches" aria-hidden="true">
					<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.life}>이승 · Life</span>
					<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.death}>저승 · Death</span>
					<span class="swatch" style:--c={PANTHEON_SIDE_COLORS.flower}>서천 · WH</span>
				</div>

				<div class="chart-wrap">
					<PantheonChart step="courts" active={true} flat />
				</div>

				<ol class="tiers">
					{#each tiers as t (t.id)}
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
		--panel-pad: 0.95rem 1.05rem;
		position: sticky;
		top: max(5.5rem, env(safe-area-inset-top, 0px) + 4.25rem);
		align-self: start;
		width: 17.5rem;
		flex-shrink: 0;
		border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
		border-radius: 1.35rem;
		background:
			radial-gradient(ellipse 90% 55% at 12% 0%, color-mix(in srgb, #c94040 10%, transparent), transparent 55%),
			radial-gradient(ellipse 80% 50% at 88% 8%, color-mix(in srgb, #3b6fbf 10%, transparent), transparent 50%),
			radial-gradient(ellipse 70% 45% at 50% 100%, color-mix(in srgb, #2f9b6a 9%, transparent), transparent 55%),
			var(--panel);
		box-shadow: var(--shadow-soft);
		overflow: hidden;
		z-index: 2;
		&:not(.open) {
			width: 3rem;
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
		padding: var(--panel-pad);
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
		gap: 0.12rem;
		min-width: 0;
		.explainer:not(.open) & {
			display: none;
		}
	}

	.eyebrow {
		font-family: var(--ui);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.title {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--fg-strong);
	}

	.chev {
		font-size: 1.25rem;
		color: var(--fg-muted);
		flex-shrink: 0;
	}

	.explainer-body {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 0 1.05rem 1.1rem;
		border-top: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
		padding-top: 0.85rem;
	}

	.lede {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.78rem;
		line-height: 1.45;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
	}

	.swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.swatch {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.18rem 0.5rem;
		border-radius: 999px;
		font-family: var(--ui);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--c) 72%, var(--fg-strong));
		background: color-mix(in srgb, var(--c) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--c) 28%, transparent);
		&::before {
			content: '';
			width: 0.45rem;
			height: 0.45rem;
			border-radius: 50%;
			background: var(--c);
		}
	}

	.chart-wrap {
		border-radius: 0.95rem;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		background: color-mix(in srgb, var(--panel-sunken) 88%, transparent);
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
		gap: 0.65rem;
		li {
			display: flex;
			flex-direction: column;
			gap: 0.18rem;
		}
		strong {
			font-family: var(--ui);
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--fg-strong);
		}
		span {
			font-family: var(--ui);
			font-size: 0.74rem;
			line-height: 1.4;
			color: var(--fg-dim);
		}
	}

	@media (max-width: 1100px) {
		.explainer {
			position: relative;
			top: auto;
			width: 100%;
			max-width: 36rem;
			margin: 0 0 1.25rem;
			&:not(.open) {
				width: 100%;
			}
		}
		.chev {
			transform: rotate(0deg);
		}
		.explainer:not(.open) .chev {
			transform: rotate(-90deg);
		}
	}
</style>
