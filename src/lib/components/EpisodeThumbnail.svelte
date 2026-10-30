<script lang="ts">
	import type { Entry } from '$lib/story';
	import { storyImg } from '$lib/img';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import { cueMenuTarget, openImageMenu } from '$lib/imageMenu.svelte';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import { isNsfwCueImage } from '$lib/nsfwCue';

	let {
		entry,
		eid,
		priority = false
	}: {
		/** The entry as read (nsfw already filtered). */
		entry: Entry;
		/** Episode DOM id (`chapterId-slug`). */
		eid: string;
		priority?: boolean;
	} = $props();

	let thumb = $derived(episodeThumbnail(entry, eid));

	function openThumb(host: HTMLElement) {
		if (!thumb) return;
		const { slot, src } = thumb;
		openLightbox(
			[
				{
					src,
					alt: slot.alt ?? slot.id,
					title: slot.alt ?? slot.id,
					caption: slot.id,
					nsfw: isNsfwCueImage(slot),
					episodeId: eid
				}
			],
			0,
			host
		);
	}
</script>

<!-- 2:1 episode thumbnail. The 3:4 ensemble poster sits under this. -->
{#if thumb}
	<figure
		class="poster"
		oncontextmenu={(e) => thumb && openImageMenu(e, cueMenuTarget(thumb.slot.id, thumb.src))}
	>
		<button
			type="button"
			class="open"
			onclick={(e) => openThumb(e.currentTarget)}
			aria-label={`Open ${thumb.slot.alt ?? thumb.slot.id}`}
		>
			<img
				{...storyImg(thumb.src, {
					kind: 'cue',
					priority,
					sizes: '(max-width: 820px) 100vw, 48rem',
					alt: thumb.slot.alt ?? ''
				})}
			/>
		</button>
	</figure>
{/if}

<style>
	.poster {
		margin: 0;
		width: 100%;
		max-width: 48rem;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		box-shadow:
			0 30px 60px -28px rgb(0 0 0 / 0.75),
			0 0 0 1px color-mix(in srgb, var(--fg) 12%, transparent);
	}

	.open {
		display: block;
		width: 100%;
		height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: zoom-in;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Animated mode: the poster breathes, a slow push across the still. */
	:global(html[data-animated='on']) img {
		animation: ken 26s ease-in-out infinite alternate;
	}

	@keyframes ken {
		from {
			transform: scale(1.04) translate3d(-1.5%, 0.5%, 0);
		}
		to {
			transform: scale(1.12) translate3d(1.5%, -1.5%, 0);
		}
	}

	@media (max-width: 820px) {
		.poster {
			border-radius: 0;
			margin-inline: -0.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html[data-animated='on']) img {
			animation: none;
		}
	}
</style>
