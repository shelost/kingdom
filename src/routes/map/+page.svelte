<script lang="ts">
	import StoryMap from '$lib/components/StoryMap.svelte';
	import MapPreview from '$lib/components/MapPreview.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import BorderTimeline from '$lib/components/BorderTimeline.svelte';
	import type { Place } from '$lib/places';
	import { MediaQuery } from 'svelte/reactivity';

	let hovered = $state<Place | null>(null);
	/** Opens on the year Daeya falls: the chronicle's centre of gravity. */
	let year = $state(642);
	let places = $state(true);
	/** The preview panel only shows on desktop, so only there does a click pin a place to it. */
	const wide = new MediaQuery('min-width: 1024px');
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
		<SiteNavSpace />
		<h1>Map</h1>
		<p class="lede">Samhan on one sheet — click a place for its wiki entry.</p>
	</header>
	<div class="split">
		<div class="atlas">
			<StoryMap pageMode pinnable={wide.current} {year} markers={places} bind:hovered />
			<div class="under"><BorderTimeline bind:year bind:places /></div>
		</div>
		<div class="side">
			<MapPreview place={places ? hovered : null} />
		</div>
	</div>
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

	/* Phones and tablets: the map alone; the profile opens on tap. */
	.side {
		display: none;
	}

	.atlas {
		display: flex;
		flex-direction: column;
		min-width: 0;
		/* room under the sheet for the timeline */
		--map-reserve: 13.6rem;
	}

	/* As wide as the sheet, never wider: the event line ellipsises instead of growing the column. */
	.under {
		width: 0;
		min-width: 100%;
	}

	/* Desktop: the map holds the left, the preview fills the right at the map's height. */
	@media (min-width: 1024px) {
		.map-page {
			height: 100dvh;
			min-height: 0;
			padding-bottom: 1.25rem;
		}

		.mast {
			display: none;
		}

		.split {
			flex: 1 1 auto;
			min-height: 0;
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			gap: 1.25rem;
			padding-top: 2.75rem;
		}

		.side {
			display: block;
			min-height: 0;
		}
	}
</style>
