<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { storyImg } from '$lib/img';
	import {
		closeLightbox,
		currentLightboxItem,
		imageLightbox,
		stepLightbox
	} from '$lib/imageLightbox.svelte';
	import {
		canonicalHashId,
		findStoryHeading,
		requestStoryJump,
		scrollToStoryHeading,
		stripStoryHash
	} from '$lib/reading.svelte';

	let item = $derived(currentLightboxItem());
	let hasStack = $derived(imageLightbox.items.length > 1);

	$effect(() => {
		const lock = imageLightbox.open;
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = lock ? 'hidden' : '';
		return () => {
			document.documentElement.style.overflow = prev;
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (!imageLightbox.open) return;
		if (e.key === 'Escape') {
			closeLightbox();
			e.stopPropagation();
			return;
		}
		if (e.key === 'ArrowRight') {
			stepLightbox(1);
			e.preventDefault();
		}
		if (e.key === 'ArrowLeft') {
			stepLightbox(-1);
			e.preventDefault();
		}
	}

	function openInChronicle(episodeId: string) {
		closeLightbox();
		stripStoryHash();
		const home = resolve('/');
		const here = page.url.pathname;
		const onStory = here === home || here === '/' || here === '';
		if (onStory) {
			const el = findStoryHeading(canonicalHashId(episodeId));
			if (el) scrollToStoryHeading(el, 'smooth');
			return;
		}
		requestStoryJump(episodeId);
		void goto(home, { noScroll: true, replaceState: false });
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if imageLightbox.open && item}
	<div class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
		<button type="button" class="lightbox-scrim" onclick={closeLightbox} aria-label="Close image"
		></button>
		<figure class="lightbox-frame">
			<img
				class="lightbox-shot"
				{...storyImg(item.src, {
					kind: 'hero',
					alt: item.alt,
					sizes: '96vw',
					priority: true,
					widths: [828, 1200, 1920]
				})}
			/>
			<figcaption class="lightbox-cap">
				<p id="lightbox-title" class="lightbox-title">{item.title}</p>
				{#if item.caption}
					<p class="lightbox-id">{item.caption}</p>
				{/if}
				{#if item.nsfw}
					<p class="lightbox-nsfw">NSFW</p>
				{/if}
				{#if item.episodeId}
					<button
						type="button"
						class="lightbox-jump"
						onclick={() => item && item.episodeId && openInChronicle(item.episodeId)}
					>
						Open in chronicle
					</button>
				{/if}
			</figcaption>
		</figure>
		{#if hasStack}
			<button
				type="button"
				class="lightbox-nav prev"
				onclick={() => stepLightbox(-1)}
				aria-label="Previous image"
			>
				‹
			</button>
			<button
				type="button"
				class="lightbox-nav next"
				onclick={() => stepLightbox(1)}
				aria-label="Next image"
			>
				›
			</button>
			<p class="lightbox-count" aria-live="polite">
				{imageLightbox.index + 1} / {imageLightbox.items.length}
			</p>
		{/if}
		<button type="button" class="lightbox-close" onclick={closeLightbox} aria-label="Close">
			✕
		</button>
	</div>
{/if}

<style>
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 240;
		display: grid;
		place-items: center;
		padding: max(1.1rem, env(safe-area-inset-top, 0px))
			max(1.1rem, env(safe-area-inset-right, 0px)) max(1.1rem, env(safe-area-inset-bottom, 0px))
			max(1.1rem, env(safe-area-inset-left, 0px));
	}

	.lightbox-scrim {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 0;
		border: none;
		background: color-mix(in srgb, var(--panel-sunken, #08080c) 86%, transparent);
		cursor: zoom-out;
	}

	.lightbox-frame {
		position: relative;
		z-index: 1;
		margin: 0;
		display: grid;
		justify-items: center;
		gap: 0.7rem;
		max-width: min(96vw, 92rem);
		max-height: min(92dvh, 92rem);
	}

	.lightbox-shot {
		display: block;
		width: auto;
		height: auto;
		max-width: min(96vw, 92rem);
		max-height: min(82dvh, 88rem);
		object-fit: contain;
		object-position: center;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--panel-sunken) 70%, var(--bg));
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
	}

	.lightbox-cap {
		display: grid;
		gap: 0.2rem;
		justify-items: center;
		text-align: center;
		max-width: min(36rem, 90vw);
	}

	.lightbox-cap p {
		margin: 0;
	}

	.lightbox-title {
		font-family: var(--serif);
		font-size: 0.95rem;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.lightbox-id {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.lightbox-nsfw {
		width: fit-content;
		margin-top: 0.15rem;
		padding: 0.08rem 0.42rem;
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #fff7f8;
		background: #9f1239;
		border-radius: var(--radius-pill);
	}

	.lightbox-jump {
		margin-top: 0.35rem;
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold);
		background: none;
		border: none;
		padding: 0.35rem 0.2rem;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.lightbox-jump:hover {
		color: var(--fg-strong);
	}

	.lightbox-close {
		position: absolute;
		top: max(0.7rem, env(safe-area-inset-top, 0px));
		right: max(0.7rem, env(safe-area-inset-right, 0px));
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		color: var(--fg-strong);
		cursor: pointer;
		backdrop-filter: blur(12px);
		z-index: 2;
	}

	.lightbox-close:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.lightbox-nav {
		position: absolute;
		top: 50%;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		color: var(--fg-strong);
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		backdrop-filter: blur(12px);
		transform: translateY(-50%);
	}

	.lightbox-nav.prev {
		left: max(0.7rem, env(safe-area-inset-left, 0px));
	}

	.lightbox-nav.next {
		right: max(0.7rem, env(safe-area-inset-right, 0px));
	}

	.lightbox-nav:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.lightbox-count {
		position: absolute;
		z-index: 2;
		bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
		left: 50%;
		transform: translateX(-50%);
		margin: 0;
		padding: 0.2rem 0.55rem;
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		color: var(--fg-faint);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		backdrop-filter: blur(12px);
	}

	@media (prefers-reduced-motion: reduce) {
		.lightbox {
			transition: none;
		}
	}
</style>
