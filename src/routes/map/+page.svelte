<script lang="ts">
	import StoryMap from '$lib/components/StoryMap.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
</script>

<svelte:head>
	<title>Map · King for All</title>
	<meta
		name="description"
		content="Interactive map of Samhan — places named in the chronicle, open for their profiles."
	/>
</svelte:head>

<main class="map-page">
	<header class="mast">
		<SiteNav />
		<h1>Map</h1>
		<p class="lede">Samhan on one sheet — click a place for its encyclopedia entry.</p>
	</header>
	<StoryMap pageMode />
</main>

<PersonLayer />

<style>
	.map-page {
		min-height: 100vh;
		padding: max(1.25rem, env(safe-area-inset-top)) max(1.15rem, env(safe-area-inset-right))
			max(2rem, env(safe-area-inset-bottom)) max(1.15rem, env(safe-area-inset-left));
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		align-items: stretch;
	}

	.mast {
		display: grid;
		gap: 0.55rem;
		max-width: 42rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.lede {
		margin: 0;
		color: var(--fg-faint);
		font-size: 0.95rem;
		line-height: 1.45;
	}
</style>
