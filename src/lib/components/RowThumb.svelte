<script lang="ts">
	import { storyImg } from '$lib/img';

	let {
		src,
		sizes,
		alt = '',
		fallback = '',
		priority = false
	}: {
		src?: string;
		sizes: string;
		alt?: string;
		/** Letter drawn when the episode has no still yet. */
		fallback?: string;
		priority?: boolean;
	} = $props();
</script>

<span class="thumb">
	{#if src}
		<img {...storyImg(src, { kind: 'cue', priority, sizes, alt })} />
	{:else}
		<span class="thumb-empty" aria-hidden="true">{fallback}</span>
	{/if}
</span>

<style>
	/* A flat slab; the link or button around it zooms the picture a touch on hover. */
	.thumb {
		position: relative;
		display: block;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		box-shadow: 0 10px 22px -16px rgba(0, 0, 0, 0.7);
	}

	:global(:is(a, button):is(:hover, :focus-visible)) .thumb {
		--art-scale: 1.06;
	}

	:global(:is(a, button):focus-visible) .thumb {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	/* Glass edge: a lit top lip and a faint rim, above the picture. */
	.thumb::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 3;
		border-radius: inherit;
		pointer-events: none;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.22),
			inset 0 0 0 1px rgba(255, 255, 255, 0.07);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(var(--art-scale, 1.02));
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.thumb-empty {
		display: grid;
		place-items: center;
		height: 100%;
		font-family: var(--serif);
		font-size: 2rem;
		color: var(--fg-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		img {
			transition: none;
		}

		:global(:is(a, button):is(:hover, :focus-visible)) .thumb {
			--art-scale: 1.02;
		}
	}
</style>
