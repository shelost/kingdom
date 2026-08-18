<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { StackImage } from '$lib/story';
	import { displayArtOf } from '$lib/cueArt';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';

	let {
		images,
		inline = false
	}: {
		images: StackImage[];
		/** When true, show every frame in reading order (no sticky cue swap). */
		inline?: boolean;
	} = $props();

	/** Immersion keeps the landscape phone-frame treatment; script uses normal sticky + cues. */
	let immersion = $derived(reading.mode === 'immersion');

	let live = $state(0);

	/** Same mid as the reading band in `reading.svelte.ts` — a fixed viewport line. */
	const BAND_MID = 0.4;

	/**
	 * Rank of this slot among images that share its beat, and how many share it.
	 * Used to subdivide a beat's scroll range so every image gets its own cue.
	 */
	function cueShare(i: number): { rank: number; total: number; beat: number } {
		const beat = images[i]?.beatIndex ?? 0;
		let rank = 0;
		let total = 0;
		for (let j = 0; j < images.length; j++) {
			if ((images[j].beatIndex ?? 0) !== beat) continue;
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
		for (let i = 0; i < images.length; i++) {
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
		if (inline || !images.length) {
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

	Inline layout: frames stack in reading order, each always visible.
-->
<div class="stack" class:immersion class:inline {@attach watchLive}>
	{#each images as slot, i (slot.id)}
		{@const art = displayArtOf(slot, 'reading')}
		<figure
			class="frame"
			class:art={!!art}
			class:live={inline || i === live}
			style:aspect-ratio={immersion ? '3 / 2' : (slot.ratio ?? 4 / 3)}
			style:--tone={slot.tone ?? '#3a3a40'}
			use:reveal={{ delay: i * 70, y: 0 }}
		>
			{#if art}
				{#if immersion}
					<img
						class="fill"
						src={art}
						alt=""
						aria-hidden="true"
						loading="lazy"
						decoding="async"
					/>
				{/if}
				<img
					class="shot"
					src={art}
					alt={slot.alt ?? ''}
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			{:else}
				<div class="ph">
					<div class="cue">
						<span class="cue-id">{slot.id}</span>
						<p class="cue-prompt">{cueText(slot)}</p>
					</div>
				</div>
			{/if}

			{#if !inline && images.length > 1}
				<figcaption class="count" aria-hidden="true">{i + 1}/{images.length}</figcaption>
			{/if}
		</figure>
	{/each}
</div>

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

	/* Inline: every frame in document order, no overlay swap. */
	.stack.inline {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1.1rem;
		height: auto;
		min-height: 0;
		place-items: stretch;
	}

	.stack.inline .frame {
		grid-area: auto;
		max-height: none;
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
		border-radius: 8px;
		overflow: hidden;
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

		.stack.inline:not(.immersion) .frame {
			max-height: min(42dvh, 18rem);
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
