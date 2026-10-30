<script lang="ts">
	/**
	 * The episode's title on a quiet, drifting band of its own stills: the Part
	 * title wall in miniature, the full width of the window. Person-life episodes
	 * swap the serif title for a Marvel-style wordmark; everyone else keeps type.
	 */
	import type { Snippet } from 'svelte';
	import type { Entry } from '$lib/story';
	import { episodeStills } from '$lib/thumbnail.svelte';
	import { fullBleed } from '$lib/attachments/fullBleed';
	import StillWall, { type WallStill } from '$lib/components/StillWall.svelte';
	import { titleLogoSrc } from '$lib/titleLogos';

	let {
		entry,
		eid,
		ko = false,
		children
	}: { entry: Entry; eid: string; ko?: boolean; children: Snippet } = $props();

	let worded = $derived(!!titleLogoSrc(entry.title, ko));

	let stills = $derived<WallStill[]>(
		episodeStills(entry, eid, 8).map((t) => ({ src: t.src, ratio: t.slot.ratio ?? 2 }))
	);
</script>

{#if stills.length}
	<div class="title-card bleed walled" {@attach fullBleed}>
		<StillWall {stills} compact />
		<div class={['copy', { worded }]}>
			{@render children()}
		</div>
	</div>
{:else}
	<div class="title-card">
		<div class={['copy', { worded }]}>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.title-card {
		position: relative;
		isolation: isolate;
	}

	/* A title plate the width of the window, the words centred in it. */
	.title-card.walled {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--bleed-w, 100vw);
		max-width: none;
		min-height: clamp(20rem, 42vw, 32rem);
		margin-left: var(--bleed-left, calc(50% - 50vw));
		padding: 3rem 1.5rem;
		overflow: hidden;
	}

	.copy {
		position: relative;
		z-index: 1;
		width: min(42rem, 100%);
		min-width: 0;
		text-align: center;
	}

	.copy.worded {
		width: min(54rem, 100%);
	}

	@media (max-width: 820px) {
		.title-card.walled {
			min-height: 16rem;
			padding-inline: 0.75rem;
		}
	}
</style>
