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

	function open(host: HTMLElement) {
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

{#if thumb}
	<figure
		class="thumb"
		oncontextmenu={(e) => thumb && openImageMenu(e, cueMenuTarget(thumb.slot.id, thumb.src))}
	>
		<button
			type="button"
			class="open"
			onclick={(e) => open(e.currentTarget)}
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
	.thumb {
		margin: 0;
		width: 100%;
		max-width: 48rem;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
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
</style>
