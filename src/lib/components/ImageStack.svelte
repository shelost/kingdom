<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { ImageSlot } from '$lib/story';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';

	let { images }: { images: ImageSlot[] } = $props();

	/** Immersive turns the column into a portrait reel with one frame on. */
	let immersive = $derived(reading.mode === 'immersive');

	let live = $state(0);

	/**
	 * The reel is read the way the page reads dialogue: whichever frame sits in
	 * the reading band is the one on air. Watched with an observer rather than a
	 * scroll handler because every beat of every entry mounts one of these — a
	 * listener each would be hundreds of them. As an attachment it re-arms by
	 * itself when the reader switches modes.
	 */
	const BAND_MID = 0.4;

	const watchReel: Attachment<HTMLElement> = (node) => {
		if (!immersive || !images.length || typeof IntersectionObserver === 'undefined') return;

		const frames = [...node.querySelectorAll<HTMLElement>('.frame')];
		if (!frames.length) return;

		// Crossings are rare, so re-measuring every frame on one is cheap — and
		// it settles ties (two frames straddling the band) on real distance.
		const pick = () => {
			const mid = window.innerHeight * BAND_MID;
			let best = -1;
			let bestD = Infinity;
			frames.forEach((f, i) => {
				const r = f.getBoundingClientRect();
				const d = Math.abs((r.top + r.bottom) / 2 - mid);
				if (d < bestD) {
					bestD = d;
					best = i;
				}
			});
			if (best >= 0) live = best;
		};

		const io = new IntersectionObserver(pick, { rootMargin: '-35% 0px -55% 0px' });
		for (const f of frames) io.observe(f);
		pick();

		return () => io.disconnect();
	};
</script>

<!--
	Slots with a `src` render the real artwork; the rest stay as labelled
	placeholders so the layout is already reserved for art still to come.
	Chronicle keeps each slot at its authored ratio; immersive stands them all
	up as portrait frames, one lit at a time.
-->
<div class="stack" class:reel={immersive} {@attach watchReel}>
	{#each images as slot, i (slot.id)}
		<figure
			class="frame"
			class:art={!!slot.src}
			class:live={immersive && i === live}
			style:aspect-ratio={immersive ? '9 / 16' : slot.ratio}
			style:--tone={slot.tone ?? '#3a3a40'}
			use:reveal={i * 70}
		>
			{#if slot.src}
				<!-- The art is drawn as a wide strip, so a phone-shaped frame is
				     filled the way a vertical feed does it: the picture whole in
				     the middle, a blurred copy of itself holding the rest. -->
				{#if immersive}
					<!-- lazy even for the first frame: the sharp copy above it is
					     already in flight, so this one lands from cache -->
					<img
						class="fill"
						src={slot.src}
						alt=""
						aria-hidden="true"
						loading="lazy"
						decoding="async"
					/>
				{/if}
				<!-- the first frame of an entry loads eagerly so the art is never
				     waiting on an observer that may not fire -->
				<img
					class="shot"
					src={slot.src}
					alt={slot.alt ?? ''}
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			{:else}
				<div class="ph">
					<span class="ph-id">{slot.id}</span>
				</div>
			{/if}

			{#if immersive && images.length > 1}
				<figcaption class="count" aria-hidden="true">{i + 1}/{images.length}</figcaption>
			{/if}
		</figure>
	{/each}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
	}

	.frame {
		position: relative;
		margin: 0;
		width: 100%;
		overflow: hidden;
		transition: transform 0.6s var(--ease);
	}

	.frame:hover {
		transform: scale(1.012);
		z-index: 2;
	}

	.frame img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ph {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		background: var(--tone);
	}

	.ph-id {
		position: relative;
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
		background: rgba(0, 0, 0, 0.34);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		transition: color 0.35s var(--ease);
	}

	.frame:hover .ph-id {
		color: rgba(255, 255, 255, 0.95);
	}

	/* ————— Immersive: a vertical reel, one frame on air —————
	   Phone-shaped frames scrolled one at a time. The lit frame is the one in
	   the reading band; the rest stand back so the scene has a subject. The
	   cue is `scale` rather than `transform`, which the reveal action owns. */
	.reel {
		align-items: center;
		gap: 1.15rem;
	}

	.reel .frame {
		display: grid;
		place-items: center;
		width: min(100%, calc(var(--reel-h, 58dvh) * 9 / 16));
		background: #14141a;
		border-radius: 12px;
		opacity: 0.4;
		scale: 0.93;
		filter: saturate(0.65);
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
		transition:
			opacity 520ms var(--ease),
			scale 520ms var(--ease),
			filter 520ms var(--ease),
			box-shadow 520ms var(--ease);
	}

	.reel .frame.live {
		opacity: 1;
		scale: 1;
		filter: none;
		box-shadow:
			0 0 0 1px rgba(216, 178, 106, 0.32),
			0 26px 64px rgba(0, 0, 0, 0.62);
	}

	/* both pictures share the single grid cell: backdrop under, art over */
	.reel .fill,
	.reel .shot,
	.reel .ph {
		grid-area: 1 / 1;
	}

	.reel .fill {
		scale: 1.3;
		filter: blur(30px) saturate(1.3) brightness(0.42);
	}

	/* the picture is the subject; the backdrop is only room around it */
	.reel .shot {
		z-index: 1;
		height: auto;
		max-height: 100%;
		object-fit: contain;
		box-shadow: 0 0 46px 6px rgba(0, 0, 0, 0.55);
	}

	/* the reel's place marker: only the frame on air says where it is */
	.count {
		position: absolute;
		z-index: 2;
		right: 0.55rem;
		bottom: 0.55rem;
		padding: 0.1rem 0.45rem;
		font-size: 0.62rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		line-height: 1.6;
		color: rgba(255, 253, 248, 0.86);
		background: rgba(0, 0, 0, 0.42);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 999px;
		backdrop-filter: blur(6px);
		opacity: 0;
		transition: opacity 420ms var(--ease);
	}

	.reel .frame.live .count {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.reel .frame {
			transition: none;
		}
	}
</style>
