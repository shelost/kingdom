<script lang="ts">
	import RelationChart from '$lib/components/RelationChart.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
	<title>Characters · King for All</title>
	<meta
		name="description"
		content="Relationship map of every charted face in the chronicle — force graph of bonds across Samhan."
	/>
</svelte:head>

<main class="characters-page">
	<header class="chrome">
		<SiteNav />
		<div class="titles">
			<h1>Characters</h1>
			<p class="lede">The relationship map — drag, filter, and open any face.</p>
		</div>
	</header>
	<RelationChart pageMode />
</main>

<PersonLayer />

<style>
	.characters-page {
		position: relative;
		min-height: 100dvh;
		height: 100dvh;
		overflow: hidden;
		padding: 0;
		background: var(--bg);
	}

	.chrome {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 5;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.75rem 1.25rem;
		padding: max(0.85rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) 0.5rem
			max(1rem, env(safe-area-inset-left));
		pointer-events: none;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg) 92%, transparent) 0%,
			transparent 100%
		);
	}

	.chrome :global(.site-nav),
	.chrome .titles {
		pointer-events: auto;
	}

	.titles {
		display: grid;
		gap: 0.2rem;
		max-width: 28rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.15rem, 2.4vw, 1.45rem);
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--fg);
		text-shadow: 0 1px 12px var(--bg);
	}

	.lede {
		margin: 0;
		color: var(--fg-faint);
		font-size: 0.78rem;
		line-height: 1.4;
	}
</style>
