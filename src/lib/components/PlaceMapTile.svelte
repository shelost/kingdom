<script lang="ts">
	import { PLACES, MAP_MARKERS, MAP_VIEWBOX as VB, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { openStoryMap } from '$lib/mapUi.svelte';
	import type { Attachment } from 'svelte/attachments';

	let { placeId }: { placeId: string } = $props();

	let place = $derived<Place | null>(PLACES[placeId] ?? null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');

	const pct = (p: Place) => ({ left: (p.x / VB.w) * 100, top: (p.y / VB.h) * 100 });

	/** How close the tile frames a place: the share of the map's width it shows is 1/ZOOM. */
	const ZOOM = 2.6;
	/** A jump farther than this share of the map's width pulls out before it lands. */
	const FAR = 0.16;
	const FLY_MS = 1100;
	const PAN_MS = 700;

	let tw = $state(0);
	let th = $state(0);

	type View = { x: number; y: number; s: number };

	/**
	 * The world layer is the whole map at the tile's width (origin top-left);
	 * `s` scales it and (x, y) shifts it so (fx, fy) sits at the tile's centre,
	 * clamped so the map always covers the tile.
	 */
	function viewAt(fx: number, fy: number, s: number): View {
		const wh = (tw * VB.h) / VB.w;
		const scale = Math.max(s, 1, th / wh);
		const clamp = (v: number, min: number) => Math.min(0, Math.max(min, v));
		return {
			x: clamp(tw / 2 - scale * fx * tw, tw - scale * tw),
			y: clamp(th / 2 - scale * fy * wh, th - scale * wh),
			s: scale
		};
	}

	const css = (v: View) => `translate(${v.x}px, ${v.y}px) scale(${v.s})`;

	let shownAt: { fx: number; fy: number } | null = null;

	/** Pans to each new place; a far jump zooms out over the midpoint and back in. */
	const fly: Attachment<HTMLElement> = (world) => {
		const p = place;
		if (!p || !tw || !th) return;
		const to = { fx: p.x / VB.w, fy: p.y / VB.h };
		const end = viewAt(to.fx, to.fy, ZOOM);
		const from = shownAt;
		shownAt = to;
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!from || reduce || (from.fx === to.fx && from.fy === to.fy)) {
			world.style.transform = css(end);
			return;
		}
		const start = viewAt(from.fx, from.fy, ZOOM);
		const dist = Math.hypot(to.fx - from.fx, ((to.fy - from.fy) * VB.h) / VB.w);
		const frames =
			dist > FAR
				? [
						{ transform: css(start) },
						{
							transform: css(viewAt((from.fx + to.fx) / 2, (from.fy + to.fy) / 2, ZOOM / (1 + dist * 6))),
							offset: 0.5
						},
						{ transform: css(end) }
					]
				: [{ transform: css(start) }, { transform: css(end) }];
		world.style.transform = css(end);
		const anim = world.animate(frames, {
			duration: dist > FAR ? FLY_MS : PAN_MS,
			easing: 'cubic-bezier(0.45, 0, 0.2, 1)'
		});
		return () => anim.cancel();
	};
</script>

{#if place}
	{@const c = pct(place)}
	<button
		type="button"
		class="tile"
		style:--c={colour}
		bind:clientWidth={tw}
		bind:clientHeight={th}
		onclick={() => openStoryMap()}
		aria-label="Open map at {place.name}"
	>
		<div class="world" {@attach fly}>
			<img class="map" src="/map.svg" alt="" loading="lazy" decoding="async" />
			{#each MAP_MARKERS as p (p.id)}
				{@const pin = pct(p)}
				<span
					class="dot"
					class:active={p.id === place.id}
					class:capital={p.capital}
					style:left="{pin.left}%"
					style:top="{pin.top}%"
					style:--d={KINGDOMS[p.side].color}
				></span>
			{/each}
			<span class="pulse" style:left="{c.left}%" style:top="{c.top}%" aria-hidden="true"></span>
		</div>
		<span class="label">Map</span>
	</button>
{/if}

<style>
	.tile {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		margin: 0;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--c) 35%, var(--hairline));
		border-radius: var(--radius);
		overflow: hidden;
		cursor: pointer;
		background: #14141a;
		font: inherit;
		color: inherit;
		transition:
			border-color 600ms var(--ease),
			transform 280ms var(--ease);
	}

	.tile:hover {
		border-color: color-mix(in srgb, var(--c) 55%, #fff);
		transform: translateY(-1px);
	}

	/* The whole sheet at the tile's width; `fly` frames the place inside it. */
	.world {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 595 / 842;
		transform-origin: 0 0;
		will-change: transform;
	}

	.map {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		filter: saturate(1.05) contrast(1.04);
	}

	/* Pins and the pulse keep their size at any zoom. */
	.dot,
	.pulse {
		scale: calc(1 / 2.6);
	}

	.dot {
		position: absolute;
		width: 5px;
		height: 5px;
		margin: -2.5px 0 0 -2.5px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--d) 70%, #fff);
		opacity: 0.45;
		pointer-events: none;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
	}

	.dot.capital {
		width: 6px;
		height: 6px;
		margin: -3px 0 0 -3px;
		opacity: 0.6;
	}

	.dot.active {
		opacity: 0;
	}

	.pulse {
		position: absolute;
		width: 11px;
		height: 11px;
		margin: -5.5px 0 0 -5.5px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 2px rgba(255, 253, 248, 0.85),
			0 0 14px color-mix(in srgb, var(--c) 70%, transparent);
		pointer-events: none;
		z-index: 1;
		transition:
			left 700ms cubic-bezier(0.45, 0, 0.2, 1),
			top 700ms cubic-bezier(0.45, 0, 0.2, 1),
			background 600ms var(--ease);
	}

	.label {
		position: absolute;
		left: 0.45rem;
		bottom: 0.4rem;
		z-index: 1;
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 253, 248, 0.78);
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.65);
		pointer-events: none;
	}
</style>
