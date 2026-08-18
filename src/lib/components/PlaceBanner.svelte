<script lang="ts">
	import { PLACES, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';

	let { placeId }: { placeId: string } = $props();

	import { staticAsset } from '$lib/staticAsset.svelte';

	let place = $derived<Place | null>(PLACES[placeId] ?? null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');
	let art = $derived(place?.avatar?.trim() ? staticAsset(place.avatar.trim()) : '');

	const VB = { w: 595, h: 842 };

	function open() {
		if (place) openProfile(place.id);
	}
</script>

{#if place}
	<button
		type="button"
		class="banner"
		style:--c={colour}
		style:--px={(place.x / VB.w) * 100}
		style:--py={(place.y / VB.h) * 100}
		onclick={open}
		aria-label="Open location: {place.name}"
	>
		{#if art}
			<img class="art" src={art} alt="" />
		{:else}
			<div class="map-crop" aria-hidden="true">
				<img class="map-bg" src={staticAsset('/map.svg') ?? '/map.svg'} alt="" />
				<span class="map-veil"></span>
			</div>
		{/if}
		<span class="shade" aria-hidden="true"></span>
		<span class="meta">
			<span class="kind">{place.title ?? 'Location'}</span>
			<span class="name">{place.name}</span>
			{#if place.korean}
				<span class="ko">{place.korean}</span>
			{/if}
		</span>
	</button>
{/if}

<style>
	.banner {
		position: relative;
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		border: 1px solid rgba(255, 255, 255, 0);
		border-radius: 10px;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		width: 100%;
		cursor: pointer;
		background: color-mix(in srgb, var(--c) 18%, #14141a);
		text-align: left;
		font: inherit;
		color: inherit;
		flex-shrink: 0;
		transition:
			border-color 280ms var(--ease),
			transform 280ms var(--ease);
	}

	.banner:hover {
		transform: translateY(-1px);
	}

	.art,
	.map-crop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.art {
		object-fit: cover;
		object-position: center;
	}

	.map-crop {
		overflow: hidden;
	}

	.map-bg {
		position: absolute;
		/* Zoom the peninsula map so the marker sits in frame */
		width: 220%;
		height: auto;
		max-width: none;
		left: calc(var(--px) * 1%);
		top: calc(var(--py) * 1%);
		transform: translate(-50%, -50%);
		filter: saturate(1.05) contrast(1.05);
		opacity: 0.92;
	}

	.map-veil {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			160deg,
			color-mix(in srgb, var(--c) 28%, transparent),
			rgba(12, 12, 16, 0.25) 45%,
			rgba(12, 12, 16, 0.55)
		);
		pointer-events: none;
	}

	.shade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(8, 8, 12, 0.82) 0%,
			rgba(8, 8, 12, 0.25) 48%,
			rgba(8, 8, 12, 0.08) 100%
		);
		pointer-events: none;
	}

	.meta {
		position: absolute;
		left: 0.7rem;
		right: 0.7rem;
		bottom: 0.55rem;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.08rem;
		pointer-events: none;
	}

	.kind {
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--c) 55%, #fff);
	}

	.name {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: var(--tracking-display);
		color: #fffdf8;
		line-height: 1.15;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.55);
	}

	.ko {
		font-size: 0.68rem;
		color: rgba(255, 253, 248, 0.72);
	}

	:global(html.is-immersion) .banner {
		border-radius: 10px;
	}

	@media (max-width: 820px) {
		.banner {
			border-radius: 8px;
		}

		.name {
			font-size: 0.88rem;
		}
	}
</style>
