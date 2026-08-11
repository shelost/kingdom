<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { PLACES, MAP_MARKERS, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';
	import { mapUi, closeStoryMap } from '$lib/mapUi.svelte';

	/** Full-page Map route: always expanded, no modal scrim. */
	let { pageMode = false }: { pageMode?: boolean } = $props();

	const VB = { w: 595, h: 842 };

	let hovered = $state<Place | null>(null);

	let open = $derived(pageMode || mapUi.open);
	let place = $derived<Place | null>(reading.place ? (PLACES[reading.place] ?? null) : null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');

	/** the marker the explainer describes: hover wins, else the story's own */
	let shown = $derived(hovered ?? place);

	const pct = (p: Place) => ({ left: (p.x / VB.w) * 100, top: (p.y / VB.h) * 100 });

	function toggle() {
		if (pageMode) return;
		if (mapUi.open) {
			closeStoryMap();
			hovered = null;
		} else {
			mapUi.open = true;
		}
	}

	function openPlace(p: Place, e?: Event) {
		e?.stopPropagation();
		openProfile(p.id);
	}

	function onKey(e: KeyboardEvent) {
		if (pageMode) return;
		if (e.key === 'Escape' && open) {
			closeStoryMap();
			hovered = null;
		}
	}
</script>

<svelte:window onkeydown={onKey} />

{#if open && !pageMode}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={toggle}></div>
{/if}

{#snippet mapBody()}
	<img src="/map.svg" alt="Map of the Three Kingdoms" />

	<!-- every named site; labels only once the map is opened -->
	{#each MAP_MARKERS as p (p.id)}
		{@const c = pct(p)}
		{@const active = place?.id === p.id}
		{#if open}
			<button
				type="button"
				class="pin {p.kind}"
				class:active
				class:capital={p.capital}
				class:flip={p.labelLeft}
				class:lit={hovered?.id === p.id}
				style:left="{c.left}%"
				style:top="{c.top}%"
				style:--c={KINGDOMS[p.side].color}
				onmouseenter={() => (hovered = p)}
				onmouseleave={() => hovered?.id === p.id && (hovered = null)}
				onclick={(e) => openPlace(p, e)}
				aria-label="Open profile for {p.name}"
			>
				<span class="glyph"></span>
				<span class="label">
					{#if p.capital && p.korean}<b class="ko">{p.korean.split(' ')[0]}</b>{/if}
					{p.name}
				</span>
			</button>
		{:else}
			<span
				class="pin {p.kind}"
				class:active
				class:capital={p.capital}
				class:flip={p.labelLeft}
				style:left="{c.left}%"
				style:top="{c.top}%"
				style:--c={KINGDOMS[p.side].color}
				role="presentation"
			>
				<span class="glyph"></span>
			</span>
		{/if}
	{/each}

	<!-- where the story is right now -->
	{#if place}
		{@const c = pct(place)}
		<span class="here" style:left="{c.left}%" style:top="{c.top}%" style:--c={colour}>
			<span class="ping"></span>
		</span>
	{/if}
{/snippet}

<figure class="map" class:open class:page={pageMode} class:has-place={!!place || pageMode}>
	{#if pageMode}
		<div class="frame" role="group" aria-label="Map of Samhan">
			{@render mapBody()}
		</div>
	{:else}
		<div
			class="frame"
			onclick={toggle}
			role="button"
			tabindex="0"
			aria-label={open ? 'Close the map' : 'Open the map'}
			aria-expanded={open}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggle();
				}
			}}
		>
			{@render mapBody()}
		</div>
	{/if}

	<figcaption>
		{#if shown}
			<button
				type="button"
				class="pl-open"
				onclick={(e) => {
					e.stopPropagation();
					openPlace(shown);
				}}
			>
				<span class="pl-name" style:--c={KINGDOMS[shown.side].color}>{shown.name}</span>
				{#if shown.korean}<span class="pl-ko">{shown.korean}</span>{/if}
			</button>
			{#if open}<span class="pl-blurb">{shown.blurb}</span>{/if}
			{#if open}
				<span class="pl-hint"
					>{pageMode
						? 'Click a place for its profile'
						: 'Click a place for its profile · Esc to close'}</span
				>
			{/if}
		{:else if open}
			<span class="pl-hint"
				>{pageMode
					? 'Hover a place to read about it · click to open profile'
					: 'Hover a place to read about it · click to open profile · Esc to close'}</span
			>
		{/if}
	</figcaption>
</figure>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 88;
		background: rgba(0, 0, 0, 0.72);
		backdrop-filter: blur(3px);
		animation: fade 0.35s var(--ease);
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	/* Resting corner card removed — map lives in the images-column bento.
	   Only the expanded modal remains here (unless pageMode). */
	.map:not(.open):not(.page) {
		display: none;
	}

	.map {
		position: fixed;
		left: var(--corner-left);
		bottom: var(--corner-bottom);
		z-index: 90;
		width: var(--map-w);
		margin: 0;
		padding: 0.4rem 0.4rem 0.1rem;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		opacity: 0.5;
		transition:
			opacity 280ms var(--ease),
			border-color 280ms var(--ease),
			width 320ms var(--ease),
			left var(--toc-duration) var(--toc-ease),
			bottom 320ms var(--ease),
			padding 320ms var(--ease),
			background 280ms var(--ease);
	}

	.map.has-place {
		opacity: 1;
		border-color: rgba(255, 255, 255, 0.16);
	}

	.map:hover {
		opacity: 1;
	}

	/* Immersive: the map is part of the staging, standing over the speech —
	   it never fades back into the page the way it does while reading. */
	:global(html.is-immersion) .map {
		opacity: 1;
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5);
	}

	:global(html.is-immersion) .map:not(.open) figcaption {
		min-height: 2.2rem;
	}

	:global(html.is-immersion) .map:not(.open) .pl-name {
		font-size: 0.78rem;
	}

	:global(html.is-immersion) .map:not(.open) .pl-ko {
		font-size: 0.66rem;
	}

	/* Cinema: location is told by the graded panel and the caption slug, so the
	   corner tile stands down until the reader peeks (an opened map stays). */
	:global(html.is-cinema:not(.is-cinema-peek)) .map:not(.open) {
		opacity: 0;
		pointer-events: none;
	}

	/* ————— opened: centred like a modal ————— */
	.map.open {
		opacity: 1;
		/* the map is 595×842, so height is the binding dimension on most screens */
		width: min(88vw, calc((100vh - 9rem) * 0.707));
		left: 50%;
		bottom: 50%;
		translate: -50% 50%;
		padding: 0.9rem 0.9rem 0.2rem;
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(14, 14, 16, 0.94);
		box-shadow: 0 40px 120px rgba(0, 0, 0, 0.7);
	}

	.map.page {
		position: relative;
		inset: auto;
		left: auto;
		bottom: auto;
		translate: none;
		width: min(100%, 36rem);
		max-width: 100%;
		margin: 0 auto;
		opacity: 1;
		box-shadow: none;
		z-index: 1;
		border-radius: 10px;
	}

	.frame {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		line-height: 0;
		cursor: zoom-in;
	}

	.map.open .frame {
		cursor: zoom-out;
	}

	.map.page .frame {
		cursor: default;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		/* the source map is drawn for paper — invert it onto the dark page */
		filter: invert(1) hue-rotate(180deg) saturate(0.75) brightness(0.82) contrast(1.1);
		opacity: 0.72;
		transition: opacity 280ms var(--ease);
	}

	/* Light mode: the paper source can stand as drawn. */
	:global(html[data-theme='light']) img {
		filter: saturate(0.9) contrast(1.02);
		opacity: 0.94;
	}

	.map.open img {
		opacity: 0.95;
	}

	/* ————— place markers ————— */
	.pin {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 0.3rem;
		white-space: nowrap;
	}

	/* label on the left of the marker, mirroring the printed map */
	.pin.flip {
		flex-direction: row-reverse;
	}

	/* keep the marker itself on the coordinate, whichever side the label sits */
	.map.open .pin {
		transform: translate(-2px, -50%);
	}

	.map.open .pin.flip {
		transform: translate(calc(-100% + 2px), -50%);
	}

	.glyph {
		width: 4px;
		height: 4px;
		flex-shrink: 0;
		background: var(--c);
		border-radius: 50%;
		opacity: 0.5;
		transition:
			opacity 400ms var(--ease),
			transform 300ms var(--ease),
			box-shadow 300ms var(--ease);
	}

	.map.open .glyph {
		width: 7px;
		height: 7px;
		opacity: 0.9;
	}

	/* marker shapes, matching the printed map */
	.pin.mountain .glyph {
		border-radius: 0;
		clip-path: polygon(50% 0, 100% 100%, 0 100%);
	}

	.pin.river .glyph {
		border-radius: 1px;
		rotate: 45deg;
	}

	.pin.harbor .glyph {
		border-radius: 1px;
	}

	.pin.cave .glyph {
		border-radius: 0;
		rotate: 45deg;
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 55%, #000);
	}

	.pin.capital .glyph {
		box-shadow: 0 0 0 2px rgba(216, 178, 106, 0.75);
	}

	button.pin {
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	.pin.lit .glyph,
	.pin.active .glyph {
		opacity: 1;
		transform: scale(1.5);
		box-shadow: 0 0 10px 1px var(--c);
	}

	.label {
		font-size: 0.6rem;
		font-weight: 500;
		letter-spacing: var(--tracking-micro);
		color: rgba(255, 253, 248, 0.82);
		text-shadow:
			0 1px 3px #000,
			0 0 8px #000;
		opacity: 0;
		animation: labelIn 0.5s var(--ease) forwards;
		transition: color 250ms var(--ease);
	}

	.label .ko {
		font-weight: 600;
		color: var(--gold);
		margin-right: 0.15rem;
	}

	@keyframes labelIn {
		to {
			opacity: 1;
		}
	}

	.pin.lit .label,
	.pin.active .label {
		color: #fff;
	}

	/* Light mode: ink labels with a paper halo instead of white-on-black. */
	:global(html[data-theme='light']) .label {
		color: rgba(32, 26, 14, 0.85);
		text-shadow:
			0 1px 3px rgba(255, 253, 248, 0.95),
			0 0 8px rgba(255, 253, 248, 0.85);
	}

	:global(html[data-theme='light']) .pin.lit .label,
	:global(html[data-theme='light']) .pin.active .label {
		color: #17150e;
	}

	/* generous invisible hit area so small pins are easy to hover */
	.map.open .pin::before {
		content: '';
		position: absolute;
		inset: -0.55rem -0.4rem;
	}

	/* ————— the story's current position ————— */
	.here {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 1.5px rgba(0, 0, 0, 0.55),
			0 0 12px 1px var(--c);
		transition:
			left 900ms cubic-bezier(0.65, 0, 0.35, 1),
			top 900ms cubic-bezier(0.65, 0, 0.35, 1),
			background 600ms var(--ease);
	}

	.map.open .here {
		width: 10px;
		height: 10px;
	}

	.ping {
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		border: 1px solid var(--c);
		animation: ping 2.4s var(--ease) infinite;
	}

	@keyframes ping {
		0% {
			transform: scale(0.6);
			opacity: 0.9;
		}
		70%,
		100% {
			transform: scale(2.6);
			opacity: 0;
		}
	}

	/* ————— caption / explainer ————— */
	figcaption {
		display: flex;
		flex-direction: column;
		min-height: 1.9rem;
		padding: 0.3rem 0.15rem 0.15rem;
		border-top: 1px solid var(--hairline);
		margin-top: 0.35rem;
	}

	.map.open figcaption {
		min-height: 4rem;
		max-height: 5.5rem;
		overflow: hidden;
		padding: 0.55rem 0.2rem 0.4rem;
	}

	.pl-open {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.05rem;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
		max-width: 100%;
	}

	.pl-open:hover .pl-name {
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.pl-name {
		font-size: 0.66rem;
		font-weight: 500;
		letter-spacing: var(--tracking-micro);
		color: var(--fg-strong);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.map.open .pl-name {
		font-size: 0.95rem;
		color: color-mix(in srgb, var(--c) 45%, #fff);
	}

	/* Light mode: the opened modal reads as a paper sheet, not a lightbox. */
	:global(html[data-theme='light']) .map.open {
		background: rgba(250, 248, 244, 0.96);
		border-color: rgba(28, 22, 10, 0.16);
	}

	:global(html[data-theme='light']) .map.open .pl-name {
		color: color-mix(in srgb, var(--c) 60%, #17150e);
	}

	.pl-ko {
		font-size: 0.6rem;
		color: var(--fg-faint);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.map.open .pl-ko {
		font-size: 0.72rem;
	}

	.pl-blurb {
		margin-top: 0.35rem;
		max-width: 42rem;
		font-size: 0.78rem;
		line-height: 1.6;
		color: var(--fg-dim);
	}

	.pl-hint {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.ping {
			animation: none;
		}
		.here,
		.map,
		.label {
			transition: none;
			animation: none;
			opacity: 1;
		}
	}

	@media (max-width: 820px) {
		.map.open {
			width: 94vw;
			padding: 0.6rem 0.6rem 0.2rem;
		}

		figcaption {
			min-height: 0;
		}

		.pl-ko {
			display: none;
		}

		.map.open .pl-ko {
			display: block;
		}

		.label {
			font-size: 0.5rem;
		}
	}
</style>
