<script lang="ts">
	import { episodeContextOf, type EpisodeCue } from '$lib/cinema';
	import { goToEpisodeById } from '$lib/reading.svelte';
	import { storyImg } from '$lib/img';
	import { realArtFramesOf } from '$lib/storyImages';
	import { isNsfwCueImage } from '$lib/nsfwCue';

	let { next, ko = false }: { next: EpisodeCue; ko?: boolean } = $props();

	/** Most frames the strip carries; it loops, so a dozen reads as endless. */
	const MAX_FRAMES = 12;

	let frames = $derived.by(() => {
		const entry = episodeContextOf(next.id)?.entry;
		return (entry?.images ?? [])
			.filter((slot) => !isNsfwCueImage(slot))
			.flatMap((slot) => realArtFramesOf(slot).slice(0, 1))
			.slice(0, MAX_FRAMES);
	});
</script>

<button
	type="button"
	class="next-episode"
	onclick={() => goToEpisodeById(next.id, { hash: true, scroll: true })}
>
	{#if frames.length}
		<div class="strip" aria-hidden="true" style:--n={frames.length}>
			<div class="reel">
				<!-- drawn twice so the loop has no seam -->
				{#each [0, 1] as pass (pass)}
					{#each frames as frame, i (`${pass}-${i}`)}
						<img {...storyImg(frame.src, { kind: 'portrait' })} alt="" />
					{/each}
				{/each}
			</div>
		</div>
	{/if}
	<span class="caption">
		<span class="kicker">{ko ? '다음 회차' : 'Next episode'}</span>
		<span class="title">{(ko && next.subtitle) || next.title}</span>
	</span>
	<span class="material-symbols-outlined arrow" aria-hidden="true">arrow_forward</span>
</button>

<style>
	.next-episode {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 0.9rem 1rem;
		width: 100%;
		margin: 3rem 0 1rem;
		padding: 0 0 1rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		overflow: hidden;
		background: transparent;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		transition: opacity 200ms var(--ease);
	}

	.next-episode:hover {
		opacity: 0.8;
	}

	.strip {
		grid-column: 1 / -1;
		overflow: hidden;
		mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
	}

	.reel {
		display: flex;
		width: max-content;
		animation: roll calc(var(--n) * 4s) linear infinite;
	}

	.reel img {
		flex: none;
		width: 14rem;
		margin-right: 4px;
		aspect-ratio: 2;
		object-fit: cover;
		display: block;
	}

	/* one full pass of frames, then the second copy takes its place */
	@keyframes roll {
		to {
			translate: -50% 0;
		}
	}

	.caption {
		display: grid;
		gap: 0.15rem;
		padding-left: 1.25rem;
	}

	.next-episode:not(:has(.strip)) {
		padding-top: 1rem;
	}

	.kicker {
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: var(--tracking-micro);
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.arrow {
		padding-right: 1.25rem;
		color: var(--gold);
	}

	@media (prefers-reduced-motion: reduce) {
		.reel {
			animation: none;
		}
	}
</style>
