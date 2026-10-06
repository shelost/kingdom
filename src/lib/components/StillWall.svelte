<script lang="ts" module>
	export const WALL_ROWS = 7;
	export const WALL_PER_ROW = 6;
	/** Stills that fill every row with no repeats. */
	export const WALL_STILLS = WALL_ROWS * WALL_PER_ROW;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { storyImg } from '$lib/img';
	import { inView } from '$lib/attachments/inView';
	let {
		stills,
		storyId,
		fill = false,
		children
	}: {
		stills: { src: string }[];
		/** `data-story-id` for the reader's episode tracking; omit outside the chronicle. */
		storyId?: string;
		/** Fill the parent box instead of standing as a full-bleed screen. */
		fill?: boolean;
		children: Snippet;
	} = $props();

	/** How far each row's run starts from the one above, so no two rows line up. */
	const ROW_OFFSET = 5;
	/** Rows in the order they take stills: the two flanking the title first, then outward to the edges. */
	const DEAL = [2, 4, 3, 1, 5, 0, 6];
	/** Copies of each run on its track. Three, sliding one run's length about the centre, keep both edges covered. */
	const COPIES = 3;

	/* Enough stills for every row: deal them out so each appears once and the
	   first (the starred ones) land beside the title. Fewer: one run, staggered per row. */
	let rows = $derived(
		stills.length >= WALL_STILLS
			? Array.from({ length: WALL_ROWS }, (_, r) =>
					stills.filter((_, i) => DEAL[i % WALL_ROWS] === r).slice(0, WALL_PER_ROW)
				)
			: stills.length
				? Array.from({ length: WALL_ROWS }, (_, r) =>
						Array.from(
							{ length: WALL_PER_ROW },
							(_, i) => stills[(r * ROW_OFFSET + i) % stills.length]
						)
					)
				: []
	);
</script>

<section class="wall-page" class:fill data-story-id={storyId} {@attach inView()}>
	{#if rows.length}
		<div class="wall" aria-hidden="true">
			<div class="plane">
				{#each rows as row, r (r)}
					<div class="row" style:--row={r} style:--depth={r - (WALL_ROWS - 1) / 2}>
						<!-- The run three times over: sliding one run's length loops without a seam. -->
						<div class="track">
							{#each Array.from({ length: COPIES }, () => row).flat() as still, i (i)}
								<img class="still" {...storyImg(still.src, { kind: 'cue', sizes: '24rem' })} />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="wall-copy">
		{@render children()}
	</div>
</section>

<style>
	/* Full-bleed under the floating navbar: the stills slide behind its glass,
	   and the copy centres on the window like the script does. */
	.wall-page {
		--still-w: clamp(13rem, 21vw, 22rem);
		--still-gap: clamp(0.8rem, 1.4vw, 1.4rem);
		position: relative;
		display: grid;
		place-items: center;
		min-height: 100svh;
		margin-left: calc(-1 * var(--reading-inset));
		width: calc(100% + var(--reading-inset));
		overflow: hidden;
		isolation: isolate;
		transition:
			margin-left var(--toc-duration) var(--toc-ease),
			width var(--toc-duration) var(--toc-ease);
	}

	.wall-page.fill {
		--still-w: clamp(11rem, 15vw, 17rem);
		position: absolute;
		inset: 0;
		min-height: 0;
		margin: 0;
		width: auto;
	}

	/* ————— the wall: runs of stills on a plane tipped away into the dark ————— */
	.wall {
		position: absolute;
		inset: 0;
		z-index: -1;
		perspective: 1300px;
		perspective-origin: 50% 35%;
		mask-image: linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent);
	}

	/* Soft clearing behind the copy, so the words never sit on a busy frame. */
	.wall::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 42% 38% at 50% 50%,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 78%, transparent) 42%,
			color-mix(in srgb, var(--bg) 18%, transparent) 78%,
			transparent 100%
		);
		pointer-events: none;
	}

	.plane {
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		flex-direction: column;
		gap: var(--still-gap);
		transform-style: preserve-3d;
		transform: translate(-50%, -50%) rotateX(34deg) rotateZ(-11deg);
		animation: dolly 2.2s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* Each run floats at its own depth (the middle one level with the plane), so they slide past one another. */
	.row {
		transform: translateZ(calc(var(--depth) * 60px));
		transform-style: preserve-3d;
	}

	.track {
		display: flex;
		gap: var(--still-gap);
		width: max-content;
		animation: drift calc(78s + var(--row) * 14s) linear infinite;
	}

	.row:nth-child(even) .track {
		animation-direction: reverse;
	}

	.still {
		display: block;
		width: var(--still-w);
		height: auto;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		box-shadow:
			0 28px 40px -26px rgba(0, 0, 0, 0.7),
			inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	/* One run is a third of the track plus a third of a gap. Sliding it from half
	   a run right of centre to half a run left lands each copy where the next
	   began, and the middle copy never leaves the window. */
	@keyframes drift {
		from {
			transform: translate3d(calc((100% + var(--still-gap)) / 6), 0, 0);
		}
		to {
			transform: translate3d(calc((100% + var(--still-gap)) / -6), 0, 0);
		}
	}

	@keyframes dolly {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) rotateX(58deg) rotateZ(-4deg) translateZ(-420px);
		}
	}

	/* Hold everything while the page is off screen (full-scroll view keeps every wall mounted). */
	.wall-page:global([data-in-view='false']) .plane,
	.wall-page:global([data-in-view='false']) .track,
	.wall-page:global([data-in-view='false']) .wall-copy {
		animation-play-state: paused;
	}

	/* ————— the copy ————— */
	.wall-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: min(40rem, 86vw);
		padding: 3rem 1.5rem;
		text-align: center;
		animation: rise 1.4s 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@media (max-width: 820px) {
		.wall-page {
			--still-w: 14rem;
		}

		.plane {
			transform: translate(-50%, -50%) rotateX(30deg) rotateZ(-9deg) scale(1.2);
		}

		.wall::after {
			background: radial-gradient(
				ellipse 70% 34% at 50% 50%,
				var(--bg) 0%,
				color-mix(in srgb, var(--bg) 80%, transparent) 48%,
				transparent 100%
			);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.plane,
		.track,
		.wall-copy {
			animation: none;
		}
	}
</style>
