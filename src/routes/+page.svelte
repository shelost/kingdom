<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import TitleCover, { type CoverRead } from '$lib/components/TitleCover.svelte';
	import MapTimelapse from '$lib/components/MapTimelapse.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import {
		episodeNavLabel,
		episodeQueryId,
		episodes,
		lastEpisode,
		reading,
		type EpisodeRef
	} from '$lib/reading.svelte';

	let ko = $derived(reading.lang === 'ko');

	/** A first visit starts at the prologue. */
	const FIRST_EPISODE = episodes[0];
	/** Read from localStorage after mount, so the server and first paint agree on Read. */
	let resume = $state<EpisodeRef | null>(null);

	function readHref(ep: EpisodeRef): string {
		return hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(episodeQueryId(ep))}`, page.url);
	}

	let read = $derived.by((): CoverRead | null => {
		const ep = resume ?? FIRST_EPISODE;
		if (!ep) return null;
		const label = resume ? (ko ? '이어 읽기' : 'Continue') : ko ? '읽기' : 'Read';
		return { label, ep: episodeNavLabel(ep), href: readHref(ep) };
	});

	onMount(() => {
		/* `/#scene-id` bookmarks from when the reader lived here. */
		if (location.hash) {
			void goto(`${resolve('/read')}${location.search}${location.hash}`, { replaceState: true });
			return;
		}
		resume = lastEpisode();
	});
</script>

<svelte:head>
	<title>King for All 삼한왕검</title>
	<meta
		name="description"
		content="King for All (삼한왕검) by Heewon Ahn — a three-generation chronicle of 7th-century Samhan, at the end of the Three Kingdoms Period."
	/>
</svelte:head>

<main class="home">
	<TitleCover {ko} {read}>
		{#snippet lead()}
			<a class="map" href={resolve('/map')} aria-label={ko ? '지도 열기' : 'Open the map'}>
				<MapTimelapse {ko} />
			</a>
		{/snippet}
	</TitleCover>
</main>

<style>
	.home {
		min-height: 100svh;
	}

	/* The map is the hero's picture: no frame, the peninsula on the bare page. */
	.map {
		display: block;
		height: 100%;
		color: inherit;
		text-decoration: none;
		border-radius: var(--radius);
		transition: transform 0.4s var(--ease);
	}

	.map:hover {
		transform: scale(1.01);
	}

	/* A plain rectangle of sheet lying under the still wall. */
	.map :global(.canvas) {
		border-radius: var(--radius);
	}

	.map:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 6px;
	}
</style>
