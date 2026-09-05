<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { StackImage } from '$lib/story';
	import { displayArtOf, scriptArtFramesOf } from '$lib/cueArt';
	import { storyImg } from '$lib/img';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';
	import { filterNsfw } from '$lib/nsfwUi.svelte';

	let {
		images,
		inline = false,
		priority = false
	}: {
		images: StackImage[];
		/** When true, show every frame in reading order (no sticky cue swap). */
		inline?: boolean;
		/** First visible stack — eager + high fetch for the opening cue. */
		priority?: boolean;
	} = $props();

	/** Immersion keeps the landscape phone-frame treatment; script uses normal sticky + cues. */
	let immersion = $derived(reading.mode === 'immersion');
	let visible = $derived(filterNsfw(images));

	let live = $state(0);
	/** Sticky stacks only fetch once they are near the viewport (or marked LCP). */
	let near = $state(false);

	const CUE_SIZES = '(max-width: 820px) 100vw, 42vw';
	const INLINE_SIZES = '(max-width: 820px) 90vw, 280px';

	/** Same mid as the reading band in `reading.svelte.ts` — a fixed viewport line. */
	const BAND_MID = 0.4;

	/**
	 * Sticky mode stacks every frame in the same viewport cell, so native
	 * `loading="lazy"` does not help — the browser treats them all as in-view.
	 * Only decode the live cue plus one neighbour for the fade / the next cut.
	 */
	function paintSlot(i: number): boolean {
		if (inline) return true;
		if (priority && i <= 1) return true;
		if (!near) return false;
		return Math.abs(i - live) <= 1;
	}

	const watchNear: Attachment<HTMLElement> = (node) => {
		if (inline) return;
		if (priority) {
			near = true;
			return;
		}
		if (typeof IntersectionObserver === 'undefined') {
			near = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) near = true;
			},
			{ rootMargin: '1000px 0px', threshold: 0 }
		);
		io.observe(node);
		return () => io.disconnect();
	};

	/**
	 * Rank of this slot among images that share its beat, and how many share it.
	 * Used to subdivide a beat's scroll range so every image gets its own cue.
	 */
	function cueShare(i: number): { rank: number; total: number; beat: number } {
		const beat = visible[i]?.beatIndex ?? 0;
		let rank = 0;
		let total = 0;
		for (let j = 0; j < visible.length; j++) {
			if ((visible[j].beatIndex ?? 0) !== beat) continue;
			if (j < i) rank++;
			total++;
		}
		return { rank, total: Math.max(1, total), beat };
	}

	/**
	 * Active image = last cue whose top has crossed the reading-band mid.
	 * Pure function of layout + scrollY — identical going up or down.
	 */
	function indexAtBand(beats: HTMLElement[], mid: number): number {
		let active = 0;
		for (let i = 0; i < visible.length; i++) {
			const { rank, total, beat } = cueShare(i);
			const el = beats[beat];
			if (!el) continue;
			const r = el.getBoundingClientRect();
			const cueTop = r.top + (r.height * rank) / total;
			if (cueTop <= mid) active = i;
		}
		return active;
	}

	const watchLive: Attachment<HTMLElement> = (node) => {
		if (inline || !visible.length) {
			live = 0;
			return;
		}

		const article = node.closest<HTMLElement>('article.entry');
		const beats = article
			? [...article.querySelectorAll<HTMLElement>('[data-beat]')]
			: [];

		if (!beats.length) {
			live = 0;
			return;
		}

		let raf = 0;
		const pick = () => {
			raf = 0;
			live = indexAtBand(beats, window.innerHeight * BAND_MID);
		};

		const onScroll = () => {
			if (raf) return;
			raf = requestAnimationFrame(pick);
		};

		pick();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);

		const ro =
			typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(onScroll)
				: null;
		for (const el of beats) ro?.observe(el);

		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			ro?.disconnect();
		};
	};

	/**
	 * Fade each frame up as it arrives — except inline, where the figures are
	 * part of the manuscript and must simply be there, with nothing to wait for.
	 */
	function revealFrame(index: number): Attachment<HTMLElement> {
		return (node) => {
			if (inline) return;
			const handle = reveal(node, { delay: index * 70, y: 0 });
			return 'destroy' in handle ? handle.destroy : undefined;
		};
	}

	function cueText(slot: StackImage): string {
		if (slot.prompt?.trim()) return slot.prompt.trim();
		const alt = slot.alt?.trim();
		if (alt) return alt;
		return `Generate art for “${slot.id}”`;
	}
</script>

<!--
	Sticky single-frame stack: all slots occupy one viewport; scroll position
	picks which frame is live (symmetric, no IO hysteresis). Reading prefers
	final `src` over temp stand-in. Slots with no resolvable art show id + prompt.

	Inline layout (script mode): every frame sits in reading order at its own
	proportions, capped in height and always visible — no reveal, no crop.
	Final art leads; a distinct temp stand-in is shown beside it so references
	are not hidden behind a locked-in `src`.
-->
{#if visible.length}
<div class="stack" class:immersion class:inline {@attach watchLive} {@attach watchNear}>
	{#each visible as slot, i (`${slot.id}:${i}`)}
		{#if inline}
			{@const frames = scriptArtFramesOf(slot)}
			{#if frames.length}
				{#each frames as frame, fi (`${slot.id}:${i}:${frame.layer}`)}
					<figure
						class="frame art live"
						class:temp={frame.layer === 'temp'}
						style:--tone={slot.tone ?? '#3a3a40'}
					>
						<img
							class="shot"
							{...storyImg(frame.src, {
								kind: 'cue',
								priority: priority && i === 0 && fi === 0,
								sizes: INLINE_SIZES,
								alt:
									frame.layer === 'temp'
										? `${slot.alt ?? slot.id} (temp)`
										: (slot.alt ?? '')
							})}
						/>
						{#if frame.layer === 'temp'}
							<figcaption class="temp-tag">temp</figcaption>
						{/if}
					</figure>
				{/each}
			{:else}
				<figure
					class="frame live"
					style:--tone={slot.tone ?? '#3a3a40'}
				>
					<div class="ph">
						<div class="cue">
							<span class="cue-id">{slot.id}</span>
							<p class="cue-prompt">{cueText(slot)}</p>
						</div>
					</div>
				</figure>
			{/if}
		{:else}
			{@const art = displayArtOf(slot, 'reading')}
			<figure
				class="frame"
				class:art={!!art}
				class:live={i === live}
				style:--ratio={immersion ? '3 / 2' : (slot.ratio ?? 4 / 3)}
				style:--tone={slot.tone ?? '#3a3a40'}
				{@attach revealFrame(i)}
			>
				{#if art && paintSlot(i)}
					{#if immersion}
						<img
							class="fill"
							{...storyImg(art, {
								kind: 'cue',
								alt: '',
								sizes: CUE_SIZES,
								widths: [640],
								loading: 'lazy',
								fetchpriority: 'low'
							})}
							aria-hidden="true"
						/>
					{/if}
					<img
						class="shot"
						{...storyImg(art, {
							kind: 'cue',
							priority: priority && i === 0,
							sizes: CUE_SIZES,
							alt: slot.alt ?? ''
						})}
					/>
				{:else if !art}
					<div class="ph">
						<div class="cue">
							<span class="cue-id">{slot.id}</span>
							<p class="cue-prompt">{cueText(slot)}</p>
						</div>
					</div>
				{/if}

				{#if visible.length > 1}
					<figcaption class="count" aria-hidden="true">{i + 1}/{visible.length}</figcaption>
				{/if}
			</figure>
		{/if}
	{/each}
</div>
{/if}

<style>
	.stack {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 12rem;
		display: grid;
		place-items: center;
	}

	.frame {
		grid-area: 1 / 1;
		position: relative;
		margin: 0;
		width: 100%;
		max-height: 100%;
		aspect-ratio: var(--ratio);
		overflow: hidden;
		box-shadow: none;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 480ms var(--ease),
			visibility 0s linear 480ms;
	}

	.frame.live {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		transition-delay: 0s;
		z-index: 1;
	}

	.frame.art {
		background: color-mix(in srgb, var(--tone) 40%, #14141a);
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
		min-height: 10rem;
		display: grid;
		place-items: center;
		padding: 1.1rem;
		background: color-mix(in srgb, var(--tone) 55%, #14141a);
	}

	.cue {
		max-width: 18rem;
		text-align: left;
	}

	.cue-id {
		display: inline-block;
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
		padding-bottom: 0.28rem;
		margin-bottom: 0.55rem;
	}

	.cue-prompt {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.78rem;
		line-height: 1.45;
		letter-spacing: var(--tracking-display);
		color: rgba(255, 253, 248, 0.78);
		white-space: pre-wrap;
		user-select: text;
	}

	/* Immersion: horizontal / landscape 3:2 phone frame — width locked to the stage column. */
	.stack.immersion {
		width: 100%;
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.stack.immersion .frame {
		display: grid;
		place-items: center;
		width: 100%;
		max-width: 100%;
		max-height: none;
		aspect-ratio: 3 / 2;
		background: #14141a;
		border-radius: 8px;
	}

	.stack.immersion .fill,
	.stack.immersion .shot,
	.stack.immersion .ph {
		grid-area: 1 / 1;
	}

	.stack.immersion .fill {
		scale: 1.35;
		filter: blur(28px) saturate(1.35) brightness(0.38);
	}

	.stack.immersion .shot {
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	/* ————— Inline (script) —————
	   Every frame in reading order, small enough that the prose still leads:
	   a plate in the margin of a manuscript, never a full-bleed illustration.
	   No crop and no declared ratio — whatever proportions the art was drawn
	   in are the proportions it keeps. */
	.stack.inline {
		/* The one dimension an inline figure is allowed to claim. */
		--inline-h: 200px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.6rem;
		height: auto;
		min-height: 0;
		place-items: start;
	}

	.stack.inline .frame {
		grid-area: auto;
		width: auto;
		max-width: 100%;
		min-width: 0;
		height: auto;
		max-height: var(--inline-h);
		aspect-ratio: auto;
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		z-index: auto;
		/* Always present: nothing to fade, nothing to slide. */
		transition: none;
		border-radius: 6px;
		overflow: hidden;
	}

	.stack.inline .frame img {
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: var(--inline-h);
		object-fit: contain;
	}

	.stack.inline .ph {
		width: auto;
		min-width: min(100%, 17rem);
		height: var(--inline-h);
		min-height: 0;
		padding: 0.5rem 0.7rem;
	}

	.stack.inline .cue-prompt {
		font-size: 0.7rem;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.stack.inline .frame.temp {
		outline: 1px dashed color-mix(in srgb, var(--gold, #c9a227) 40%, transparent);
		outline-offset: -1px;
	}

	.stack.inline .temp-tag {
		position: absolute;
		z-index: 2;
		left: 0.4rem;
		bottom: 0.4rem;
		margin: 0;
		padding: 0.08rem 0.4rem;
		font-size: 0.55rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		line-height: 1.5;
		color: rgba(255, 236, 179, 0.92);
		background: rgba(0, 0, 0, 0.48);
		border: 1px dashed color-mix(in srgb, var(--gold, #c9a227) 50%, transparent);
		border-radius: 999px;
	}

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

	.frame.live .count {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.frame {
			transition: none;
		}
	}

	/* Narrow / portrait: cap the immersion reel so art leads the card without
	   owning the whole first screenful. Script keeps a calmer landscape + cues. */
	@media (max-width: 820px) {
		.stack {
			min-height: 0;
			width: 100%;
			padding: 0.65rem 1.1rem 0;
		}

		.stack.inline {
			padding: 0;
		}

		.stack:not(.immersion):not(.inline) .frame {
			max-height: min(38dvh, 16rem);
			border-radius: 8px;
			overflow: hidden;
		}

		.stack.immersion .frame {
			width: 100%;
			margin-inline: auto;
			border-radius: 8px;
		}

		.stack.immersion .shot {
			max-height: 100%;
			height: 100%;
			object-fit: cover;
		}

		.cue {
			max-width: 100%;
		}

		.cue-prompt {
			font-size: 0.72rem;
			display: -webkit-box;
			-webkit-line-clamp: 5;
			line-clamp: 5;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	@media (max-width: 480px) {
		.stack:not(.inline) {
			padding: 0.5rem 0.9rem 0;
		}
	}
</style>
