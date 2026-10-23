<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { StackImage } from '$lib/story';
	import { stageTrack, watchReached } from '$lib/pinnedWidgets.svelte';
	import PlaceBanner from './PlaceBanner.svelte';
	import PlaceMapTile from './PlaceMapTile.svelte';
	import ImageStack from './ImageStack.svelte';

	/**
	 * The stage column of the stage modes. Cinema's peek and the phone feed
	 * lead with map and location side by side, which follow the reader: a
	 * `place` block the reader has passed moves the banner and flies the map
	 * there. Desktop immersion is the stills track alone.
	 */
	let {
		place,
		images,
		priority = false
	}: { place?: string; images: StackImage[]; priority?: boolean } = $props();

	let reached = $state<string | null>(null);
	let current = $derived(reached ?? place ?? null);

	const follow = watchReached('[data-place-mark]', (els) => {
		reached = els.at(-1)?.dataset.placeMark ?? null;
	});

	let swap = $derived({ duration: prefersReducedMotion.current ? 0 : 420 });
</script>

<div class="scenes" {@attach follow}>
	<!-- Immersion's track is stills only; the place lives in the widgets. -->
	{#if current && !stageTrack()}
		<div class="bento">
			<div class="bento-map">
				<PlaceMapTile placeId={current} />
			</div>
			<div class="bento-place">
				{#key current}
					<div class="place-layer" in:fade={swap} out:fade={swap}>
						<PlaceBanner placeId={current} {priority} />
					</div>
				{/key}
			</div>
		</div>
	{/if}
	{#if images.length}
		<div class="reel" class:track={stageTrack()}>
			<ImageStack {images} {priority} track={stageTrack()} />
		</div>
	{/if}
</div>

<style>
	.scenes {
		display: contents;
	}

	.bento,
	.reel {
		width: var(--stage-w, 100%);
		max-width: 100%;
		flex-shrink: 0;
	}

	/* Mini map + place banner side by side; the banner's 16:9 sets the row height. */
	.bento {
		display: grid;
		grid-template-columns: 1fr 1.55fr;
		gap: var(--stage-gap, 0.7rem);
		align-items: stretch;
	}

	.bento-place,
	.bento-map {
		min-width: 0;
		min-height: 0;
	}

	/* Outgoing and incoming banners share one cell while they crossfade. */
	.bento-place {
		display: grid;
	}

	.place-layer {
		grid-area: 1 / 1;
		min-width: 0;
	}

	.bento-place :global(.banner) {
		width: 100%;
		height: auto;
	}

	.bento-map {
		display: flex;
	}

	.bento-map :global(.tile) {
		flex: 1 1 auto;
		width: 100%;
		height: 100%;
	}

	.reel {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.reel :global(.stack) {
		width: 100%;
		height: auto;
	}

	/* The track fills what the bento leaves of the sticky column. */
	.reel.track {
		flex: 1 1 0;
		min-height: 0;
		align-items: stretch;
	}

	.reel.track :global(.stack) {
		height: 100%;
	}

	@media (max-width: 820px) {
		.reel {
			flex: none;
		}
	}
</style>
