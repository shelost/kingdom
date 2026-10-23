<script lang="ts">
	import { slotById } from '$lib/slotIndex';
	import { liveDisplayArt } from '$lib/stillEditUi.svelte';
	import { storyImg } from '$lib/img';
	import { filterNsfw } from '$lib/nsfwUi.svelte';
	import { filterVisibleCues } from '$lib/editUi.svelte';
	import { isBrokenArt, markBrokenArt } from '$lib/storyImages';
	import { isNsfwCueImage } from '$lib/nsfwCue';
	import { openLightbox, type LightboxItem } from '$lib/imageLightbox.svelte';
	import { stillMotion } from '$lib/stillMotion';
	import ComicBalloon from './ComicBalloon.svelte';

	/**
	 * An emotion card's strip of stills: its character's iconic scenes from
	 * anywhere in the chronicle, scrolled sideways. Each frame letters its line
	 * in comic mode, plays its motion, and opens the lightbox on the whole strip.
	 */
	let { ids }: { ids: string[] } = $props();

	const frames = $derived.by(() => {
		const found = ids.flatMap((id) => {
			const hit = slotById(id);
			return hit ? [hit] : [];
		});
		const shown = new Set(filterNsfw(filterVisibleCues(found.map((f) => f.slot))));
		return found.flatMap((f) => {
			const art = shown.has(f.slot) ? liveDisplayArt(f.slot, 'reading') : undefined;
			return art && !isBrokenArt(art) ? [{ ...f, art }] : [];
		});
	});

	function open(index: number, host: HTMLElement) {
		const items: LightboxItem[] = frames.map((f) => ({
			src: f.art,
			alt: f.slot.alt ?? '',
			title: f.entryTitle,
			caption: f.slot.alt ?? f.slot.id,
			nsfw: isNsfwCueImage(f.slot),
			episodeId: f.episodeId
		}));
		openLightbox(items, index, host);
	}
</script>

{#if frames.length}
	<div class="strip" role="list">
		{#each frames as f, i (f.slot.id)}
			<figure class="frame" role="listitem" {@attach stillMotion(f.slot.motion)}>
				<button
					type="button"
					class="open"
					onclick={(e) => open(i, e.currentTarget)}
					aria-label={`Open ${f.slot.alt ?? f.slot.id}`}
				>
					<img
						class="shot"
						onerror={() => markBrokenArt(f.art)}
						{...storyImg(f.art, {
							kind: 'cue',
							sizes: '(max-width: 40rem) 85vw, 26rem',
							widths: [384, 640, 828],
							alt: f.slot.alt ?? ''
						})}
					/>
				</button>
				<ComicBalloon id={f.slot.id} />
				<figcaption>{f.entryTitle}</figcaption>
			</figure>
		{/each}
	</div>
{/if}

<style>
	.strip {
		display: flex;
		gap: 0.75rem;
		margin: 0 0 2.2rem;
		padding: 0.25rem 0 0.9rem;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: 0.25rem;
		scrollbar-width: thin;
		/* The strip bleeds into the margins and fades at both ends. */
		mask-image: linear-gradient(90deg, transparent, #000 2.5%, #000 97.5%, transparent);
	}

	.frame {
		position: relative;
		flex: 0 0 min(85%, 26rem);
		margin: 0;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: 6px;
		background: #111;
		scroll-snap-align: center;
	}

	.open {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
	}

	.shot {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	figcaption {
		position: absolute;
		top: 0.45rem;
		left: 0.55rem;
		z-index: 2;
		padding: 0.1rem 0.45rem;
		border-radius: 999px;
		font-family: var(--sans);
		font-size: 0.68rem;
		letter-spacing: 0.02em;
		color: #f4f0e6;
		background: rgb(0 0 0 / 0.45);
		pointer-events: none;
	}
</style>
