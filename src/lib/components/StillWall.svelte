<script lang="ts" module>
	export const WALL_ROWS = 7;
	export const WALL_PER_ROW = 6;
	/** Stills that fill every row with no repeats. */
	export const WALL_STILLS = WALL_ROWS * WALL_PER_ROW;

	/** A line floated over a still: who says it, in the reader's language. */
	export type WallLine = { text: string; person?: string };

	/** A frame on the wall: 2:1 by default; a tint lights a cut-out portrait from below. */
	export type WallStill = { src: string; ratio?: number; tint?: string; line?: WallLine };
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { storyImg } from '$lib/img';
	import { inView } from '$lib/attachments/inView';
	import { byId, avatarOf, nameOf } from '$lib/people';
	let {
		stills,
		storyId,
		fill = false,
		wide = false,
		faded = false,
		children
	}: {
		stills: WallStill[];
		/** `data-story-id` for the reader's episode tracking; omit outside the chronicle. */
		storyId?: string;
		/** Fill the parent box instead of standing as a full-bleed screen. */
		fill?: boolean;
		/** A wide copy box (the home hero's map beside its title), with the clearing stretched to match. */
		wide?: boolean;
		/** Melt the wall away (slowly) to show what lies beneath it. */
		faded?: boolean;
		children: Snippet;
	} = $props();

	/** How far each row's run starts from the one above, so no two rows line up. */
	const ROW_OFFSET = 5;
	/** Rows in the order they take stills: the two flanking the title first, then outward to the edges. */
	const DEAL = [2, 4, 3, 1, 5, 0, 6];
	/** Copies of each run on its track. Three, sliding one run's length about the centre, keep both edges covered. */
	const COPIES = 3;
	/** Every other still on a run carries its line, so the cards never pile up. */
	const carries = (r: number, i: number) => (r + i) % 2 === 0;

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

{#snippet card(line: WallLine, n: number)}
	{@const p = line.person ? byId.get(line.person) : undefined}
	{@const face = p ? avatarOf(p) : undefined}
	<figure class="card" style:--nudge={n % 3}>
		{#if face}
			<img class="face" {...storyImg(face, { kind: 'thumb', alt: '', sizes: '1.8rem', widths: [96] })} />
		{/if}
		<figcaption>
			{#if p}<span class="who">{nameOf(p)}</span>{/if}
			<span class="said">{line.text}</span>
		</figcaption>
	</figure>
{/snippet}

<section class="wall-page" class:fill class:wide class:faded data-story-id={storyId} {@attach inView()}>
	{#if rows.length}
		<div class="wall" aria-hidden="true">
			<div class="plane">
				{#each rows as row, r (r)}
					{@const run = Array.from({ length: COPIES }, () => row).flat()}
					<div class="row" style:--row={r}>
						<!-- The run three times over: sliding one run's length loops without a seam. -->
						<div class="track">
							{#each run as still, i (i)}
								<img
									class="still"
									class:tinted={!!still.tint}
									style:--ratio={still.ratio}
									style:--tint={still.tint}
									{...storyImg(still.src, { kind: 'cue', sizes: '20rem', widths: [384, 640] })}
								/>
							{/each}
						</div>
						<!-- The lines ride a layer above, laid out like the stills (each starts over its own)
						     but a touch faster, so they slip ahead of the pictures as the wall turns. -->
						{#if row.some((still) => still.line)}
							<div class="lines">
								<div class="track">
									{#each run as still, i (i)}
										<div class="slot" style:--ratio={still.ratio}>
											{#if still.line && carries(r, i % row.length)}
												{@render card(still.line, i % row.length)}
											{/if}
										</div>
									{/each}
								</div>
							</div>
						{/if}
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
		/* The plane's tip, shared with whatever lies on it (the home page's map). */
		--tilt-x: 34deg;
		--tilt-z: -11deg;
		--still-gap: clamp(0.8rem, 1.4vw, 1.4rem);
		--row-gap: clamp(1.8rem, 3vw, 3rem);
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
		pointer-events: none;
		transition: opacity 1.8s var(--ease);
	}

	/* Slow, so the stills seem to dissolve rather than switch off. */
	.faded .wall {
		opacity: 0.05;
		transition-duration: 2.4s;
	}

	/* Soft clearing behind the copy, so the words never sit on a busy frame.
	   `--wall-clear` thins it where the copy is glass and should show the stills. */
	.wall::after {
		content: '';
		position: absolute;
		inset: 0;
		opacity: var(--wall-clear, 1);
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
		gap: var(--row-gap);
		transform-style: preserve-3d;
		transform: translate(-50%, -50%) rotateX(var(--tilt-x)) rotateZ(var(--tilt-z));
		animation: dolly 2.2s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* Every run lies flat on the plane. A per-row depth only shows once the dolly's fade
	   finishes (opacity below 1 flattens 3D), and then shoves the rows into each other. */
	.row {
		position: relative;
	}

	.track {
		display: flex;
		gap: var(--still-gap);
		width: max-content;
		will-change: transform;
		animation: drift var(--run-time) linear infinite;
	}

	.row {
		--run-time: calc(78s + var(--row) * 14s);
	}

	.row:nth-child(even) .track {
		animation-direction: reverse;
	}

	/* The lines' own layer over the stills; its run is a tenth quicker. */
	.lines {
		position: absolute;
		inset: 0 auto auto 0;
		pointer-events: none;
	}

	.lines .track {
		animation-duration: calc(var(--run-time) * 0.9);
	}

	.slot {
		position: relative;
		flex: none;
		height: calc(var(--still-w) / 2);
		aspect-ratio: var(--ratio, 2);
	}

	/* Every frame shares the row height; its ratio sets the width. */
	.still {
		display: block;
		width: auto;
		height: calc(var(--still-w) / 2);
		aspect-ratio: var(--ratio, 2);
		object-fit: cover;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		box-shadow:
			0 28px 40px -26px rgba(0, 0, 0, 0.7),
			inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	.still.tinted {
		object-position: center top;
		background:
			radial-gradient(
				ellipse 95% 55% at 50% 100%,
				color-mix(in srgb, var(--tint) 42%, transparent),
				transparent 72%
			),
			color-mix(in srgb, var(--tint) 10%, var(--panel-sunken));
	}

	/* A line hovering over its still, tipped with the plane like the stills. */
	.card {
		position: absolute;
		left: 6%;
		bottom: calc(10% + var(--nudge) * 12%);
		display: flex;
		align-items: flex-start;
		gap: 0.45rem;
		width: max-content;
		max-width: min(15rem, 92%);
		margin: 0;
		padding: 0.45rem 0.65rem 0.5rem 0.45rem;
		border-radius: var(--radius);
		text-align: left;
		background: color-mix(in srgb, var(--bg) 86%, transparent);
		box-shadow:
			0 14px 28px -12px rgb(0 0 0 / 0.6),
			inset 0 0 0 1px color-mix(in srgb, var(--fg) 12%, transparent);
	}

	.face {
		flex: none;
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 50%;
		object-fit: cover;
		object-position: center top;
	}

	.card figcaption {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.who {
		font-family: var(--ui);
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
	}

	.said {
		font-family: var(--serif);
		font-size: 0.82rem;
		line-height: 1.3;
		color: var(--fg-strong);
		text-wrap: pretty;
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
	.wall-page:global([data-in-view='false']) .wall-copy :global(.float-up) {
		animation-play-state: paused;
	}

	/* ————— the copy (each element floats up on its own: `.float-up` in app.css) ————— */
	.wall-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: min(40rem, 86vw);
		padding: 3rem 1.5rem;
		text-align: center;
	}

	.wide .wall-copy {
		width: min(84rem, 100%);
		max-width: none;
		padding: 6rem clamp(1rem, 4vw, 3rem) 4rem;
	}

	/* The clearing sits behind the copy only: the lead beside it lies under the wall. */
	.wide .wall::after {
		background: radial-gradient(
			ellipse 34% 48% at 76% 52%,
			var(--bg) 0%,
			color-mix(in srgb, var(--bg) 82%, transparent) 46%,
			color-mix(in srgb, var(--bg) 22%, transparent) 80%,
			transparent 100%
		);
	}

	/* Stacked: the copy on top, the lead below it. */
	@media (max-width: 900px) {
		.wide .wall::after {
			background: radial-gradient(
				ellipse 75% 26% at 50% 30%,
				var(--bg) 0%,
				color-mix(in srgb, var(--bg) 80%, transparent) 48%,
				transparent 100%
			);
		}
	}

	@media (max-width: 820px) {
		.wall-page {
			--still-w: 14rem;
			--tilt-x: 30deg;
			--tilt-z: -9deg;
		}

		.plane {
			transform: translate(-50%, -50%) rotateX(var(--tilt-x)) rotateZ(var(--tilt-z)) scale(1.2);
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
		.wall-copy :global(.float-up) {
			animation: none;
		}
	}
</style>
