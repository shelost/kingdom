<script lang="ts">
	import { PLACES, MAP_MARKERS, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { openStoryMap } from '$lib/mapUi.svelte';

	let { placeId }: { placeId: string } = $props();

	let place = $derived<Place | null>(PLACES[placeId] ?? null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');

	const VB = { w: 595, h: 842 };
	const pct = (p: Place) => ({ left: (p.x / VB.w) * 100, top: (p.y / VB.h) * 100 });
</script>

{#if place}
	{@const c = pct(place)}
	<button
		type="button"
		class="tile"
		style:--c={colour}
		onclick={() => openStoryMap()}
		aria-label="Open map at {place.name}"
	>
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
		<span
			class="pulse"
			style:left="{c.left}%"
			style:top="{c.top}%"
			style:--c={colour}
			aria-hidden="true"
		></span>
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
		border-radius: 8px;
		overflow: hidden;
		cursor: pointer;
		background: #14141a;
		font: inherit;
		color: inherit;
		transition:
			border-color 280ms var(--ease),
			transform 280ms var(--ease);
	}

	.tile:hover {
		border-color: color-mix(in srgb, var(--c) 55%, #fff);
		transform: translateY(-1px);
	}

	.map {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 42%;
		filter: saturate(1.05) contrast(1.04);
	}

	.dot {
		position: absolute;
		width: 5px;
		height: 5px;
		margin: -2.5px 0 0 -2.5px;
		border-radius: 50%;
		background: color-mix(in srgb, var(--d) 70%, #fff);
		opacity: 0.35;
		pointer-events: none;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
	}

	.dot.capital {
		width: 6px;
		height: 6px;
		margin: -3px 0 0 -3px;
		opacity: 0.5;
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

	:global(html.is-immersion) .tile {
		border-radius: 8px;
	}

	@media (max-width: 820px) {
		.tile {
			border-radius: 8px;
		}
	}
</style>
