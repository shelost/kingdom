<script lang="ts">
	import { tilt } from '$lib/attachments/tilt';
	import { storyImg } from '$lib/img';

	let {
		src,
		sizes,
		alt = '',
		fallback = '',
		priority = false,
		max = 10
	}: {
		src?: string;
		sizes: string;
		alt?: string;
		/** Letter drawn when the episode has no still yet. */
		fallback?: string;
		priority?: boolean;
		/** Peak rotation toward the pointer, in degrees. */
		max?: number;
	} = $props();
</script>

<span class="thumb tilt" style:--tilt-max={`${max}deg`} {@attach tilt()}>
	{#if src}
		<img {...storyImg(src, { kind: 'cue', priority, sizes, alt })} />
	{:else}
		<span class="thumb-empty" aria-hidden="true">{fallback}</span>
	{/if}
</span>

<style>
	/* Quasi-3D slab: `.tilt` (app.css) rotates it toward the pointer; the link or
	   button around it lifts it, and its shadow slides away from the raised corner. */
	.thumb {
		display: block;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		box-shadow: 0 10px 22px -16px rgba(0, 0, 0, 0.7);
		transition:
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	:global(:is(a, button):is(:hover, :focus-visible)) .thumb {
		--tilt-lift: -6px;
		--art-scale: 1.08;
		box-shadow: calc(var(--tilt-x) * -16px) calc(26px + var(--tilt-y) * -12px) 40px -20px
			rgba(0, 0, 0, 0.75);
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

	.thumb::after {
		background: radial-gradient(
			circle at var(--tilt-mx, 50%) var(--tilt-my, 0%),
			rgba(255, 255, 255, 0.38),
			transparent 55%
		);
	}

	/* Picture drifts against the tilt, a window onto a deeper plane. */
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: translate3d(calc(var(--tilt-x) * -8px), calc(var(--tilt-y) * -6px), 0)
			scale(var(--art-scale, 1.02));
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
		.thumb,
		img {
			transition: none;
		}

		:global(:is(a, button):is(:hover, :focus-visible)) .thumb {
			--tilt-lift: 0px;
			--art-scale: 1.02;
		}
	}
</style>
