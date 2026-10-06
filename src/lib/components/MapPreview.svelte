<script lang="ts">
	import { fade } from 'svelte/transition';
	import { storyImg } from '$lib/img';
	import { KINGDOMS } from '$lib/people';
	import { PLACES, PLACE_KIND_LABEL, placeImages, type Place } from '$lib/places';
	import { placeStills } from '$lib/thumbnail.svelte';
	import { openProfile } from '$lib/profiles.svelte';
	import StillWall from '$lib/components/StillWall.svelte';

	/** The hovered place; with none, a drifting wall of every location board. */
	let { place }: { place: Place | null } = $props();

	const STRIP = 6;

	/** Every location board, map places first; boards shared by two places appear once. */
	const WALL = [
		...new Set(
			[...Object.values(PLACES)]
				.sort((a, b) => Number(!!a.offMap) - Number(!!b.offMap))
				.flatMap(placeImages)
		)
	].map((src) => ({ src }));

	/** Its own boards first, then stills from the episodes set there. */
	let images = $derived(
		place
			? [...new Set([...placeImages(place), ...placeStills(place.id, STRIP).map((t) => t.src)])]
			: []
	);
	let kingdom = $derived(place ? KINGDOMS[place.side] : null);
</script>

<aside class="preview" aria-live="polite">
	{#if place && kingdom}
		{#key place.id}
			<article class="card" style:--c={kingdom.color} in:fade={{ duration: 180 }}>
				<div class="hero">
					{#if images[0]}
						<img {...storyImg(images[0], { kind: 'place', sizes: '40vw', alt: place.name })} />
					{:else}
						<span class="blank" aria-hidden="true">{place.korean?.split(/[\s(]/)[0] ?? place.name}</span>
					{/if}
				</div>

				<header class="head">
					<p class="kicker">
						{#if kingdom.flag}<img class="flag" src={kingdom.flag} alt="" />{/if}
						<span>{kingdom.label}</span>
						<span aria-hidden="true">·</span>
						<span>{PLACE_KIND_LABEL[place.kind]}</span>
					</p>
					<h2>{place.name}</h2>
					{#if place.korean}<p class="ko">{place.korean}</p>{/if}
				</header>

				<p class="blurb">{place.blurb}</p>

				{#if images.length > 1}
					<ul class="strip">
						{#each images.slice(1, STRIP + 1) as src (src)}
							<li><img {...storyImg(src, { kind: 'cue', sizes: '10rem' })} /></li>
						{/each}
					</ul>
				{/if}

				<button type="button" class="open" onclick={() => openProfile(place.id)}>Open profile →</button>
			</article>
		{/key}
	{:else}
		<div class="wall" in:fade={{ duration: 240 }}>
			<StillWall stills={WALL} fill>
				<p class="wall-kicker">Samhan</p>
				<p class="wall-title">Hover a place</p>
				<p class="wall-sub">{WALL.length} locations painted so far</p>
			</StillWall>
		</div>
	{/if}
</aside>

<style>
	.preview {
		position: relative;
		height: 100%;
		min-height: 0;
		overflow: hidden;
		border-radius: calc(var(--radius) * 1.5);
		background: color-mix(in srgb, var(--fg) 3%, var(--bg));
		border: 1px solid var(--hairline);
	}

	.wall {
		position: absolute;
		inset: 0;
	}

	.wall-kicker {
		margin: 0 0 0.8rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.34em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.wall-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2rem, 3.6vw, 3.2rem);
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	.wall-sub {
		margin: 0.9rem 0 0;
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	/* ————— a hovered place ————— */
	.card {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 1rem 1.25rem;
		overflow-y: auto;
	}

	/* Wide panels would make a 16:9 hero swallow the strip; cap it at half the panel. */
	.hero {
		flex: 0 0 auto;
		aspect-ratio: 16 / 9;
		max-height: 50%;
		overflow: hidden;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--c) 14%, var(--bg));
		box-shadow: 0 24px 50px -30px rgba(0, 0, 0, 0.7);
	}

	.hero img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.blank {
		display: grid;
		place-items: center;
		height: 100%;
		font-family: 'Noto Serif KR', serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		color: color-mix(in srgb, var(--c) 70%, var(--fg));
		opacity: 0.6;
	}

	.head {
		display: grid;
		gap: 0.3rem;
		padding: 0 0.25rem;
	}

	.kicker {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--c) 60%, var(--fg-dim));
	}

	.flag {
		width: 1.3rem;
		height: 0.85rem;
		object-fit: cover;
		border-radius: 2px;
	}

	h2 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(1.8rem, 2.8vw, 2.6rem);
		line-height: 1.02;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	.ko {
		margin: 0;
		font-family: 'Noto Serif KR', serif;
		font-size: 1rem;
		color: var(--fg-dim);
	}

	.blurb {
		margin: 0;
		padding: 0 0.25rem;
		max-width: 38rem;
		font-size: 0.92rem;
		line-height: 1.6;
		color: var(--fg-dim);
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.strip img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		border-radius: calc(var(--radius) * 0.75);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.open {
		align-self: flex-start;
		margin: auto 0 0 0.25rem;
		padding: 0.4rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--c) 45%, var(--hairline));
		border-radius: 999px;
		background: transparent;
		font: inherit;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--fg-strong);
		cursor: pointer;
		transition:
			background 200ms var(--ease),
			border-color 200ms var(--ease);
	}

	.open:hover,
	.open:focus-visible {
		background: color-mix(in srgb, var(--c) 14%, transparent);
		border-color: var(--c);
	}
</style>
