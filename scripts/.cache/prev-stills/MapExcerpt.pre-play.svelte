<script lang="ts">
	import type { Block } from '$lib/story';
	import { PLACES, MAP_SHEET_BOX, MAP_VIEW, MAP_VIEWBOX, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { formatYear } from '$lib/borders';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import BorderLayer from './BorderLayer.svelte';

	type MapBlock = Extract<Block, { kind: 'map' }>;

	let { block }: { block: MapBlock } = $props();

	/** Sheet units around the framed places; the crop never gets smaller than MIN_W wide. */
	const PAD = 55;
	const MIN_W = 200;
	const ASPECT = 1.6;
	/** Years per second while the borders sweep from `from` to `year`. */
	const SWEEP_SPEED = 6;

	let places = $derived(block.places.map((id) => PLACES[id]).filter((p): p is Place => !!p));

	let crop = $derived.by(() => {
		const xs = places.map((p) => p.x);
		const ys = places.map((p) => p.y);
		const cx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : MAP_VIEW.x + MAP_VIEW.w / 2;
		const cy = ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : MAP_VIEW.y + MAP_VIEW.h / 2;
		let w = Math.max(xs.length ? Math.max(...xs) - Math.min(...xs) + PAD * 2 : MAP_VIEW.w, MIN_W);
		let h = Math.max(ys.length ? Math.max(...ys) - Math.min(...ys) + PAD * 2 : 0, w / ASPECT);
		w = Math.max(w, h * ASPECT);
		w = Math.min(w, MAP_VIEWBOX.w);
		h = Math.min(h, MAP_VIEWBOX.h);
		const x = Math.min(Math.max(cx - w / 2, 0), MAP_VIEWBOX.w - w);
		const y = Math.min(Math.max(cy - h / 2, 0), MAP_VIEWBOX.h - h);
		return { x, y, w, h };
	});

	/** The MAP_VIEW box (what BorderLayer and the sheet image are laid out against), placed inside the crop. */
	let view = $derived({
		left: ((MAP_VIEW.x - crop.x) / crop.w) * 100,
		top: ((MAP_VIEW.y - crop.y) / crop.h) * 100,
		width: (MAP_VIEW.w / crop.w) * 100,
		height: (MAP_VIEW.h / crop.h) * 100
	});

	const at = (p: Place) => ({
		left: ((p.x - crop.x) / crop.w) * 100,
		top: ((p.y - crop.y) / crop.h) * 100
	});

	let shownYear = $state<number | null>(null);
	let year = $derived(shownYear ?? block.from ?? block.year);
	let caption = $derived(reading.lang === 'ko' ? (block.ko ?? block.caption) : block.caption);

	const sweep = onceInView(() => {
		const from = block.from;
		if (from === undefined || prefersReducedMotion()) {
			shownYear = block.year;
			return;
		}
		const span = block.year - from;
		const duration = Math.min(Math.max((Math.abs(span) / SWEEP_SPEED) * 1000, 1200), 4000);
		let start = 0;
		let frame = requestAnimationFrame(function step(t) {
			start ||= t;
			const k = Math.min((t - start) / duration, 1);
			const eased = 1 - Math.pow(1 - k, 3);
			shownYear = Math.round(from + span * eased);
			if (k < 1) frame = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(frame);
	});
</script>

<figure class="excerpt">
	<div class="frame" style:aspect-ratio="{crop.w} / {crop.h}" {@attach sweep}>
		<div
			class="view"
			style:left="{view.left}%"
			style:top="{view.top}%"
			style:width="{view.width}%"
			style:height="{view.height}%"
		>
			<img
				class="sheet"
				src="/map-base.svg"
				alt=""
				loading="lazy"
				decoding="async"
				style:left="{MAP_SHEET_BOX.left}%"
				style:top="{MAP_SHEET_BOX.top}%"
				style:width="{MAP_SHEET_BOX.width}%"
				style:height="{MAP_SHEET_BOX.height}%"
			/>
			<BorderLayer {year} />
		</div>
		{#each places as p, i (p.id)}
			{@const pos = at(p)}
			<span
				class="pin"
				class:capital={p.capital}
				style:left="{pos.left}%"
				style:top="{pos.top}%"
				style:--c={KINGDOMS[p.side].color}
				style:--i={i}
			>
				<span class="dot" aria-hidden="true"></span>
				<span class="label">{reading.lang === 'ko' ? (p.korean ?? p.name) : p.name}</span>
			</span>
		{/each}
		<span class="year" aria-live="polite">{formatYear(year)}</span>
	</div>
	{#if block.title || caption}
		<figcaption>
			{#if block.title}<span class="title">{block.title}</span>{/if}
			{#if caption}<span class="caption">{caption}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.excerpt {
		margin: 1.8rem 0;
	}

	.frame {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--fg) 4%, transparent);
	}

	.view {
		position: absolute;
	}

	.sheet {
		position: absolute;
		display: block;
		max-width: none;
		/* the source map is drawn for paper — invert it onto the dark page */
		filter: invert(1) hue-rotate(180deg) saturate(0.75) brightness(0.82) contrast(1.1);
		opacity: 0.72;
	}

	:global(html[data-theme='light']) .sheet {
		filter: saturate(0.9) contrast(1.02);
		opacity: 0.94;
	}

	.pin {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		transform: translate(-0.3rem, -50%);
		animation: pin-in 520ms var(--ease) both;
		animation-delay: calc(var(--i) * 120ms + 200ms);
	}

	.dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 2px rgba(255, 253, 248, 0.85),
			0 0 12px color-mix(in srgb, var(--c) 70%, transparent);
	}

	.capital .dot {
		width: 0.75rem;
		height: 0.75rem;
		box-shadow:
			0 0 0 2px var(--gold),
			0 0 14px color-mix(in srgb, var(--c) 70%, transparent);
	}

	.label {
		font-size: 0.72rem;
		font-weight: 600;
		white-space: nowrap;
		color: var(--fg-strong);
		text-shadow:
			0 0 6px var(--bg),
			0 0 2px var(--bg);
	}

	.year {
		position: absolute;
		right: 0.6rem;
		bottom: 0.45rem;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
		text-shadow: 0 0 8px var(--bg);
	}

	figcaption {
		display: grid;
		gap: 0.15rem;
		margin-top: 0.55rem;
	}

	.title {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.caption {
		font-size: 0.86rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	@keyframes pin-in {
		from {
			opacity: 0;
			transform: translate(-0.3rem, -30%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pin {
			animation: none;
		}
	}
</style>
