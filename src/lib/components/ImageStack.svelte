<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { StackImage } from '$lib/story';
	import { reveal } from '$lib/reveal';
	import { reading } from '$lib/reading.svelte';

	let { images }: { images: StackImage[] } = $props();

	/** Immersive keeps the portrait frame treatment; both modes show one live image. */
	let immersive = $derived(reading.mode === 'immersive');

	let live = $state(0);

	const BAND_MID = 0.4;

	/**
	 * Pick the image for the beat sitting in the reading band. Beats without art
	 * keep the previous slot so the column never blanks mid-scroll.
	 */
	function indexForBeat(beat: number): number {
		let match = -1;
		let hold = 0;
		for (let i = 0; i < images.length; i++) {
			const bi = images[i].beatIndex ?? 0;
			if (bi < beat) hold = i;
			if (bi === beat && match < 0) match = i;
		}
		return match >= 0 ? match : hold;
	}

	const watchLive: Attachment<HTMLElement> = (node) => {
		if (!images.length || typeof IntersectionObserver === 'undefined') return;

		const article = node.closest<HTMLElement>('article.entry');
		const beats = article
			? [...article.querySelectorAll<HTMLElement>('[data-beat]')]
			: [];

		if (!beats.length) {
			live = 0;
			return;
		}

		const pick = () => {
			const mid = window.innerHeight * BAND_MID;
			let bestBeat = -1;
			let bestD = Infinity;
			for (const el of beats) {
				const r = el.getBoundingClientRect();
				if (r.bottom < 0 || r.top > window.innerHeight) continue;
				const d = Math.abs((r.top + r.bottom) / 2 - mid);
				if (d < bestD) {
					bestD = d;
					bestBeat = Number(el.dataset.beat);
				}
			}
			if (bestBeat >= 0) live = indexForBeat(bestBeat);
		};

		const io = new IntersectionObserver(pick, { rootMargin: '-35% 0px -55% 0px' });
		for (const el of beats) io.observe(el);
		pick();

		return () => io.disconnect();
	};

	function cueText(slot: StackImage): string {
		if (slot.prompt?.trim()) return slot.prompt.trim();
		const alt = slot.alt?.trim();
		if (alt) return alt;
		return `Generate art for “${slot.id}”`;
	}
</script>

<!--
	Sticky single-frame stack: all slots occupy one viewport; IntersectionObserver
	on entry beats picks which frame is live. Slots without `src` show id + prompt.
-->
<div class="stack" class:immersive {@attach watchLive}>
	{#each images as slot, i (slot.id)}
		<figure
			class="frame"
			class:art={!!slot.src}
			class:live={i === live}
			style:aspect-ratio={immersive ? '9 / 16' : (slot.ratio ?? 4 / 3)}
			style:--tone={slot.tone ?? '#3a3a40'}
			use:reveal={i * 70}
		>
			{#if slot.src}
				{#if immersive}
					<img
						class="fill"
						src={slot.src}
						alt=""
						aria-hidden="true"
						loading="lazy"
						decoding="async"
					/>
				{/if}
				<img
					class="shot"
					src={slot.src}
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

			{#if images.length > 1}
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

	/* Immersive: phone-shaped frame for the live slot */
	.stack.immersive .frame {
		display: grid;
		place-items: center;
		width: min(100%, calc(var(--reel-h, 58dvh) * 9 / 16));
		max-height: calc(100vh - 3.5rem);
		background: #14141a;
		border-radius: 12px;
		box-shadow: 0 14px 34px rgba(0, 0, 0, 0.4);
	}

	.stack.immersive .frame.live {
		box-shadow:
			0 0 0 1px rgba(216, 178, 106, 0.32),
			0 26px 64px rgba(0, 0, 0, 0.62);
	}

	.stack.immersive .fill,
	.stack.immersive .shot,
	.stack.immersive .ph {
		grid-area: 1 / 1;
	}

	.stack.immersive .fill {
		scale: 1.3;
		filter: blur(30px) saturate(1.3) brightness(0.42);
	}

	.stack.immersive .shot {
		z-index: 1;
		height: auto;
		max-height: 100%;
		object-fit: contain;
		box-shadow: 0 0 46px 6px rgba(0, 0, 0, 0.55);
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

	/* Narrow / portrait: cap the immersive reel so art leads the card without
	   owning the whole first screenful. Chronicle keeps a calmer landscape. */
	@media (max-width: 820px) {
		.stack {
			min-height: 0;
			width: 100%;
			padding: 0.65rem 1.1rem 0;
		}

		.stack:not(.immersive) .frame {
			max-height: min(38dvh, 16rem);
			border-radius: 8px;
			overflow: hidden;
		}

		.stack.immersive .frame {
			width: min(100%, calc(var(--reel-h, 34dvh) * 9 / 16), 13.5rem);
			max-height: var(--reel-h, 34dvh);
			margin-inline: auto;
			border-radius: 10px;
		}

		.stack.immersive .shot {
			max-height: 100%;
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
		.stack {
			padding: 0.5rem 0.9rem 0;
		}

		.stack.immersive .frame {
			width: min(100%, calc(var(--reel-h, 32dvh) * 9 / 16), 12rem);
		}
	}
</style>
