<script lang="ts">
	import type { Block } from '$lib/story';
	import { PLACES, MAP_VIEWBOX as VB } from '$lib/places';
	import { KINGDOMS, linkPeople } from '$lib/people';
	import { NATIVE_NAMES } from '$lib/names';
	import { PLACE_TYPE_LABEL, nationName, placeType, type PlaceType } from '$lib/cardTheme';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import { openProfile } from '$lib/profiles.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { storyImg } from '$lib/img';
	import { openStoryMap } from '$lib/mapUi.svelte';
	import BrushGlyphs from './BrushGlyphs.svelte';

	type PlaceBlock = Extract<Block, { kind: 'place' }>;

	let { block, year = null }: { block: PlaceBlock; year?: number | null } = $props();

	const PAREN = /\s*\((.*)\)\s*/;

	let place = $derived(PLACES[block.place]);
	let tone = $derived(place ? KINGDOMS[place.side]?.color ?? '#8a8a94' : '#8a8a94');
	let type = $derived<PlaceType>(place ? placeType(place) : 'city');
	let kindLabel = $derived.by(() => {
		if (!place) return '';
		const t = PLACE_TYPE_LABEL[type];
		const nation = place.side === 'other' ? '' : nationName(place.side, reading.lang);
		const what = reading.lang === 'en' ? t.en : t.ko;
		return nation ? `${nation} · ${what}` : what;
	});
	/** The place's own boards, avatar first; a board that fails to load hands over to the next. */
	let boards = $derived(
		[place?.avatar, ...(place?.gallery ?? [])].map((b) => b?.trim()).filter((b): b is string => !!b)
	);
	let failed = $derived.by(() => {
		void boards;
		return 0;
	});
	let artPath = $derived(boards[failed]);
	let art = $derived(artPath ? staticAsset(artPath) : null);
	/** The Korean name leads; a modern town in parentheses rides along as a footnote. */
	let korean = $derived(place?.korean?.replace(PAREN, '').trim() || undefined);
	let modern = $derived(place?.korean?.match(PAREN)?.[1]?.trim());
	/** Hanja only when they are the name's meaning, not a spelling of its native sound. */
	let hanja = $derived(
		place && !NATIVE_NAMES.has(place.id) ? place.hanja?.replace(PAREN, '').trim() || undefined : undefined
	);
	/** First sentence of the blurb when the block brings no caption of its own. */
	let fallback = $derived(place?.blurb.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? place?.blurb ?? '');
	let caption = $derived(reading.lang === 'ko' && block.ko ? block.ko : (block.html ?? fallback));
	let captionSub = $derived(reading.lang === 'both' && block.ko && block.html ? block.ko : undefined);
	let play = $state(false);

	const start = onceInView(() => {
		play = true;
	});
</script>

{#if place}
	<figure class="place-card" class:has-art={!!art} class:live={play} style:--tone={tone} {@attach start}>
		{#if type === 'fortress'}
			<button
				type="button"
				class="fort-zoom"
				style:--fx={place.x / VB.w}
				style:--fy={place.y / VB.h}
				onclick={() => openStoryMap()}
				aria-label="Open map at {place.name}"
			>
				<img class="zoom-map" src="/map.svg" alt="" loading="lazy" decoding="async" />
				<span class="zoom-pin" aria-hidden="true"></span>
			</button>
		{/if}
		<div class="words">
			<span class="kind">{kindLabel}</span>
			{#if hanja}
				<span class="han">
					<BrushGlyphs text={hanja} size="clamp(1rem, 2.8vw, 1.25rem)" {play} />
				</span>
			{/if}
			{#if korean}
				<span class="korean" lang="ko" aria-label={korean}>
					{#each Array.from(korean) as g, i (i)}
						{#if g.trim()}<span class="syl" style:--i={i} aria-hidden="true">{g}</span>{:else}<span class="gap" aria-hidden="true"></span>{/if}
					{/each}
				</span>
			{/if}
			<div class="meta">
				<button type="button" class="name" class:lead={!korean} onclick={() => openProfile(place.id, year)}>
					{place.name}
				</button>
				{#if modern}<span class="modern" lang="ko">{modern}</span>{/if}
				{#if caption}<p class="caption">{@html linkPeople(caption, year)}</p>{/if}
				{#if captionSub && captionSub !== caption}<p class="caption sub" lang="ko">{@html linkPeople(captionSub, year)}</p>{/if}
			</div>
		</div>
		{#if art}
			<div class="art">
				{#key art}
					<img
						{...storyImg(art, { kind: 'place', alt: '', sizes: '(max-width: 820px) 60vw, 22rem' })}
						onerror={() => (failed += 1)}
					/>
				{/key}
			</div>
		{/if}
	</figure>
{/if}

<style>
	.place-card {
		/* A torn-paper edge: a rect roughened by turbulence, used as the picture's mask. */
		--brush-edge: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'%3E%3Cfilter id='f' x='-5%25' y='-5%25' width='110%25' height='110%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.035 .05' numOctaves='4' seed='7'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='26'/%3E%3C/filter%3E%3Crect x='14' y='14' width='372' height='272' rx='6' filter='url(%23f)'/%3E%3C/svg%3E");
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		gap: 1rem 1.3rem;
		margin: var(--widget-gap) 0;
		padding: 1.4rem 1.3rem 1.2rem 1.5rem;
		border: 1px solid color-mix(in srgb, var(--tone) 35%, rgb(0 0 0 / 0.55));
		border-radius: var(--widget-radius);
		background: color-mix(in srgb, var(--tone) 9%, var(--hanji));
		color: var(--sumi);
		letter-spacing: var(--name-track);
		cursor: pointer;
	}

	.place-card.has-art {
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
	}

	.words,
	.art {
		position: relative;
	}

	/* Fortress cards open on a zoomed minimap: the sheet at 220% width,
	   offset so the fortress pin sits dead centre (sheet 595×842, window 2:1). */
	.fort-zoom {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		margin: 0;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--tone) 40%, var(--hairline));
		border-radius: var(--radius);
		background: #14141a;
		cursor: pointer;
		font: inherit;
	}

	.fort-zoom .zoom-map {
		position: absolute;
		width: 220%;
		max-width: none;
		height: auto;
		left: calc(50% - var(--fx) * 220%);
		top: calc(50% - var(--fy) * 623%);
	}

	.fort-zoom .zoom-pin {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 12px;
		margin: -6px 0 0 -6px;
		border-radius: 50%;
		background: var(--tone);
		outline: 2px solid #fff;
	}

	.words {
		display: grid;
		justify-items: start;
		gap: 0.25rem;
		min-width: 0;
	}

	.kind {
		font-family: 'Noto Sans KR', var(--ui);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--tone) 70%, var(--sumi));
	}

	.han {
		--sumi: color-mix(in srgb, var(--tone) 40%, var(--sumi));
		line-height: 1;
		opacity: 0.88;
	}

	.han :global(.brush-glyphs) {
		gap: 0;
	}

	.korean {
		display: inline-flex;
		flex-wrap: wrap;
		font-family: var(--display-ko);
		font-size: clamp(1.8rem, 7.5cqi, 3.1rem);
		line-height: 1.02;
		letter-spacing: var(--name-track);
		color: var(--sumi);
	}

	.gap {
		width: 0.22em;
	}

	.syl {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.28em);
		filter: blur(5px);
	}

	.live .syl {
		animation: syl-in 620ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 75ms + 180ms);
	}

	/* Each line floats up after the one above it: name, modern name, then the blurb. */
	.meta {
		display: grid;
		justify-items: start;
		gap: 0.1rem;
	}

	.meta > * {
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 420ms var(--ease) calc(600ms + var(--k, 0) * 200ms),
			transform 420ms var(--ease) calc(600ms + var(--k, 0) * 200ms);
	}

	.meta > :nth-child(2) { --k: 1; }
	.meta > :nth-child(3) { --k: 2; }
	.meta > :nth-child(4) { --k: 3; }

	.live .meta > * {
		opacity: 1;
		transform: none;
	}

	/* The picture: brushed-out ragged edges, with a thin ink line that follows them. */
	.art {
		aspect-ratio: 4 / 3;
		filter: drop-shadow(0 0 0.6px rgb(20 16 10 / 0.9)) drop-shadow(0 0 0.6px rgb(20 16 10 / 0.6));
	}

	.art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		-webkit-mask: var(--brush-edge) center / 100% 100% no-repeat;
		mask: var(--brush-edge) center / 100% 100% no-repeat;
	}

	/* The name opens the place's profile; its hit area stretches over the whole card. */
	.name {
		padding: 0;
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: left;
		color: var(--sumi);
		background: none;
		border: none;
		cursor: pointer;
	}

	.name.lead {
		font-size: 1.4rem;
		font-weight: 700;
	}

	.name::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
	}

	.name:focus-visible {
		outline: none;
	}

	.place-card:has(.name:focus-visible) {
		outline: 2px solid var(--tone);
		outline-offset: 3px;
	}

	.modern {
		font-family: 'Noto Sans KR', var(--ui);
		font-size: 0.74rem;
		font-weight: 500;
		color: var(--sumi-dim);
	}

	.caption {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0.45rem 0 0;
		color: var(--sumi);
	}

	.caption.sub {
		margin-top: 0.1rem;
		color: var(--sumi-dim);
	}

	/* Person links inside the caption stay clickable above the stretched name. */
	.caption :global(.person) {
		position: relative;
		z-index: 2;
	}

	@keyframes syl-in {
		to {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}

	@container prose (max-width: 560px) {
		.place-card.has-art {
			grid-template-columns: minmax(0, 1fr);
		}

		.art {
			grid-row: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.syl,
		.meta > * {
			animation: none;
			transition: none;
		}

		.syl {
			opacity: 1;
			transform: none;
			filter: none;
		}
	}
</style>
