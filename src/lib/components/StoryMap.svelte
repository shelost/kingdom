<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import {
		PLACES,
		MAP_MARKERS,
		MAP_LINES,
		MAP_VIEW,
		MAP_SHEET_BOX,
		isFortress,
		mapLabel,
		type Place
	} from '$lib/places';
	import { placeLabels, type LabelSpot } from '$lib/mapLabels';
	import { KINGDOMS } from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';
	import { mapUi, closeStoryMap } from '$lib/mapUi.svelte';
	import { onDestroy, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import BorderLayer from '$lib/components/BorderLayer.svelte';

	let {
		pageMode = false,
		pinnable = false,
		year = null,
		markers = true,
		hovered = $bindable(null)
	}: {
		/** Show the place markers (and their labels); off leaves the bare sheet. */
		markers?: boolean;
		/** Border timeline year: the sheet drops its printed tints and draws that year's holders. */
		year?: number | null;
		/** Full-page Map route: always expanded, no modal scrim. */
		pageMode?: boolean;
		/** A click pins the place to the preview instead of opening its profile. */
		pinnable?: boolean;
		/** The place the preview shows: under the pointer, else the pinned one. */
		hovered?: Place | null;
	} = $props();

	/** How far (screen px) the pointer may sit from a marker and still hover it. */
	const HOVER_RADIUS = 26;
	/** Grace before an empty hover clears, so gliding between markers does not flicker. */
	const HOVER_GRACE = 220;
	/** Marker radius (px) for label placement, matching the glyph sizes below. */
	const GLYPH_R = { capital: 6, fortress: 5.5, other: 3.5 };

	const LINES = MAP_LINES.map((line) => ({
		...line,
		points: line.stops
			.map((id) => PLACES[id])
			.filter(Boolean)
			.map((p) => `${p.x},${p.y}`)
			.join(' ')
	}));

	const pct = (p: { x: number; y: number }) => ({
		left: ((p.x - MAP_VIEW.x) / MAP_VIEW.w) * 100,
		top: ((p.y - MAP_VIEW.y) / MAP_VIEW.h) * 100
	});

	const IMG = MAP_SHEET_BOX;

	let pinned = $state<Place | null>(null);
	let spots = $state<Record<string, LabelSpot> | null>(null);
	const labelEls: Record<string, HTMLElement> = {};

	let clearTimer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(clearTimer));

	function cancelClear() {
		clearTimeout(clearTimer);
		clearTimer = undefined;
	}

	/** The marker nearest the pointer, if one sits within the hover radius. */
	function nearest(sheet: HTMLElement, e: MouseEvent): Place | null {
		if (!markers) return null;
		const r = sheet.getBoundingClientRect();
		let best: Place | null = null;
		let bestD = HOVER_RADIUS;
		for (const p of MAP_MARKERS) {
			const c = pct(p);
			const d = Math.hypot(r.left + (c.left / 100) * r.width - e.clientX, r.top + (c.top / 100) * r.height - e.clientY);
			if (d < bestD) {
				bestD = d;
				best = p;
			}
		}
		return best;
	}

	function sheetMove(e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		const hit = nearest(e.currentTarget as HTMLElement, e);
		if (hit) {
			cancelClear();
			if (pinned && pinned.id !== hit.id) pinned = null;
			if (hovered?.id !== hit.id) hovered = hit;
		} else if (hovered !== pinned && !clearTimer) {
			clearTimer = setTimeout(() => {
				hovered = pinned;
				clearTimer = undefined;
			}, HOVER_GRACE);
		}
	}

	function sheetLeave() {
		cancelClear();
		hovered = pinned;
	}

	/** A click inside a marker's radius picks it; a click on empty map lets a pin go. */
	function sheetClick(e: MouseEvent) {
		const hit = nearest(e.currentTarget as HTMLElement, e);
		if (hit) choose(hit, e);
		else if (pinnable) {
			pinned = null;
			hovered = null;
		}
	}

	/** Desktop map page pins the place to the preview; everywhere else opens its profile. */
	function choose(p: Place, e?: Event) {
		e?.stopPropagation();
		if (pageMode && pinnable) {
			cancelClear();
			pinned = p;
			hovered = p;
		} else {
			openProfile(p.id);
		}
	}

	let open = $derived(pageMode || mapUi.open);
	let place = $derived<Place | null>(reading.place ? (PLACES[reading.place] ?? null) : null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');

	/** the marker the explainer describes: hover wins, else the story's own */
	let shown = $derived(hovered ?? place);

	/** Where a pannable phone sheet opens when the story has no current place. */
	const MARKER_CENTRE = {
		x: MAP_MARKERS.reduce((sum, p) => sum + p.x, 0) / MAP_MARKERS.length,
		y: MAP_MARKERS.reduce((sum, p) => sum + p.y, 0) / MAP_MARKERS.length
	};

	/** Phones pan an enlarged sheet: open it centred on the story's place. */
	const centreSheet: Attachment<HTMLElement> = (frame) => {
		const c = pct(untrack(() => place) ?? MARKER_CENTRE);
		frame.scrollLeft = (c.left / 100) * frame.scrollWidth - frame.clientWidth / 2;
		frame.scrollTop = (c.top / 100) * frame.scrollHeight - frame.clientHeight / 2;
	};

	const measureLabel =
		(id: string): Attachment<HTMLElement> =>
		(el) => {
			labelEls[id] = el;
			return () => delete labelEls[id];
		};

	/** Lays the labels out whenever the canvas changes size (and once the font is in). */
	const placeOnResize: Attachment<HTMLElement> = (canvas) => {
		if (!open) return;
		const layout = () => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (!w || !h) return;
			const items = MAP_MARKERS.flatMap((p) => {
				const el = labelEls[p.id];
				if (!el) return [];
				const c = pct(p);
				const r = p.capital ? GLYPH_R.capital : isFortress(p) ? GLYPH_R.fortress : GLYPH_R.other;
				return [
					{
						id: p.id,
						x: (c.left / 100) * w,
						y: (c.top / 100) * h,
						r,
						w: el.offsetWidth,
						h: el.offsetHeight,
						priority: p.capital ? 1 : 0
					}
				];
			});
			spots = placeLabels(items, w, h);
		};
		const ro = new ResizeObserver(layout);
		ro.observe(canvas);
		document.fonts?.ready.then(layout);
		return () => ro.disconnect();
	};

	function toggle() {
		if (pageMode) return;
		if (mapUi.open) {
			closeStoryMap();
			hovered = null;
		} else {
			mapUi.open = true;
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (pageMode) {
			pinned = null;
			hovered = null;
		} else if (open) {
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

{#snippet glyph(p: Place)}
	{#if isFortress(p)}
		<svg class="glyph fort" viewBox="0 0 12 12" aria-hidden="true">
			<path d="M1 11V1.5h2.2v2h1.7v-2h2.2v2h1.7v-2H11V11H7.6V8.4a1.6 1.6 0 0 0-3.2 0V11Z" />
		</svg>
	{:else}
		<span class="glyph"></span>
	{/if}
{/snippet}

{#snippet mapBody()}
	<div class="canvas" class:placed={!!spots} {@attach placeOnResize}>
		<img
			src={year === null ? '/map.svg' : '/map-base.svg'}
			alt="Map of the Three Kingdoms"
			style:left="{IMG.left}%"
			style:top="{IMG.top}%"
			style:width="{IMG.width}%"
			style:height="{IMG.height}%"
		/>

		{#if year !== null}
			<BorderLayer {year} />
		{/if}

		{#if open && markers}
			<svg
				class="lines"
				viewBox="{MAP_VIEW.x} {MAP_VIEW.y} {MAP_VIEW.w} {MAP_VIEW.h}"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				{#each LINES as line (line.id)}
					<polyline points={line.points}>
						<title>{line.name} · {line.korean}</title>
					</polyline>
				{/each}
			</svg>
		{/if}

		<!-- every named site; labels only once the map is opened -->
		{#each markers ? MAP_MARKERS : [] as p (p.id)}
			{@const c = pct(p)}
			{@const active = place?.id === p.id}
			{#if open}
				{@const spot = spots?.[p.id]}
				<button
					type="button"
					class="pin {p.kind}"
					class:fortress={isFortress(p)}
					class:active
					class:capital={p.capital}
					class:lit={hovered?.id === p.id}
					style:left="{c.left}%"
					style:top="{c.top}%"
					style:--c={KINGDOMS[p.side].color}
					onmouseenter={() => !pageMode && (hovered = p)}
					onmouseleave={() => !pageMode && hovered?.id === p.id && (hovered = null)}
					onclick={(e) => choose(p, e)}
					aria-label="{pinnable ? 'Show' : 'Open profile for'} {p.name}"
				>
					{@render glyph(p)}
					<span
						class="label"
						class:tucked={spots && !spot}
						style:left={spot ? `calc(${spot.left}px - ${c.left}cqw)` : null}
						style:top={spot ? `calc(${spot.top}px - ${c.top}cqh)` : null}
						{@attach measureLabel(p.id)}
					>
						{#if p.capital && p.korean}<b class="ko">{p.korean.split(' ')[0]}</b>{/if}
						{mapLabel(p)}
					</span>
				</button>
			{:else}
				<span
					class="pin {p.kind}"
					class:fortress={isFortress(p)}
					class:active
					class:capital={p.capital}
					style:left="{c.left}%"
					style:top="{c.top}%"
					style:--c={KINGDOMS[p.side].color}
					role="presentation"
				>
					{@render glyph(p)}
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
	</div>
{/snippet}

{#snippet hint(mouse: string)}
	<span class="pl-hint">
		<span class="hint-mouse">{mouse}</span>
		<span class="hint-touch"
			>{pageMode
				? 'Tap a place for its profile · drag to pan'
				: 'Tap a place for its profile · tap outside to close'}</span
		>
	</span>
{/snippet}

<figure
	class="map"
	class:open
	class:page={pageMode}
	class:has-place={!!place || pageMode}
	style:--map-aspect={MAP_VIEW.w / MAP_VIEW.h}
>
	{#if pageMode}
		<div class="frame" role="group" aria-label="Map of Samhan" {@attach centreSheet}>
			<!-- Pointer proximity drives hover; each pin is still its own button for keyboard and touch. -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				class="sheet"
				class:near={!!hovered}
				onpointermove={sheetMove}
				onpointerleave={sheetLeave}
				onclick={sheetClick}
			>
				{@render mapBody()}
			</div>
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
					openProfile(shown.id);
				}}
			>
				<span class="pl-name" style:--c={KINGDOMS[shown.side].color}>{shown.name}</span>
				{#if shown.korean}<span class="pl-ko">{shown.korean}</span>{/if}
			</button>
			{#if open}<span class="pl-blurb">{shown.blurb}</span>{/if}
			{#if open}
				{@render hint(
					pageMode ? 'Click a place for its profile' : 'Click a place for its profile · Esc to close'
				)}
			{/if}
		{:else if open}
			{@render hint(
				pageMode
					? 'Hover a place to read about it · click to open profile'
					: 'Hover a place to read about it · click to open profile · Esc to close'
			)}
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
		/* marker ink: pale on the inverted dark sheet, black on paper */
		--ink: #f4efe4;
		--ink-halo: rgba(10, 10, 12, 0.85);
		position: fixed;
		left: var(--corner-left);
		bottom: var(--corner-bottom);
		z-index: 90;
		width: var(--map-w);
		margin: 0;
		padding: 0.4rem 0.4rem 0.1rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
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

	:global(html[data-theme='light']) .map {
		--ink: #111;
		--ink-halo: rgba(255, 253, 248, 0.9);
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
		/* the map is taller than wide, so height is the binding dimension on most screens */
		width: min(88vw, calc((100vh - 9rem) * var(--map-aspect)));
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
		border-radius: var(--radius);
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

	.sheet {
		position: relative;
	}

	.sheet.near {
		cursor: pointer;
	}

	/* The visible window onto the sheet; labels are placed in its pixels (cqw/cqh). */
	.canvas {
		position: relative;
		aspect-ratio: var(--map-aspect);
		overflow: hidden;
		container-type: size;
	}

	/* ————— lines drawn through places (the thousand-li wall) ————— */
	.lines {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.lines polyline {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.4;
		stroke-dasharray: 5 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		stroke-opacity: 0.7;
		opacity: 0;
		animation: labelIn 0.8s var(--ease) forwards;
	}

	/* Desktop map page: the sheet takes the window's height beside its preview panel. */
	@media (min-width: 1024px) {
		/* A definite width (not a %), so the page grid's auto column hugs the sheet;
		   the 1.8rem is the opened padding on both sides. */
		.map.page {
			width: min(52vw, calc((100dvh - var(--map-reserve, 7.6rem)) * var(--map-aspect) + 1.8rem));
			margin: 0;
		}

		.map.page figcaption {
			display: none;
		}

		.map.page .label {
			font-size: 0.66rem;
		}
	}

	img {
		position: absolute;
		display: block;
		max-width: none;
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
		z-index: 1;
		width: 0;
		height: 0;
	}

	.pin.fortress {
		z-index: 2;
	}

	/* capitals stand in front of every other marker and label */
	.pin.capital {
		z-index: 3;
	}

	.pin.lit {
		z-index: 4;
	}

	.glyph {
		position: absolute;
		left: 0;
		top: 0;
		width: 4px;
		height: 4px;
		translate: -50% -50%;
		background: var(--ink);
		border-radius: 50%;
		opacity: 0.6;
		transition:
			opacity 400ms var(--ease),
			scale 300ms var(--ease),
			background 300ms var(--ease),
			fill 300ms var(--ease);
	}

	.map.open .glyph {
		width: 7px;
		height: 7px;
		opacity: 1;
		box-shadow: 0 0 0 1px var(--ink-halo);
	}

	/* marker shapes, matching the printed map */
	.pin.mountain .glyph {
		border-radius: 0;
		box-shadow: none;
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
		background: var(--ink-halo);
		box-shadow: inset 0 0 0 1.5px var(--ink);
	}

	.glyph.fort {
		background: none;
		border-radius: 0;
		fill: var(--ink);
		stroke: var(--ink-halo);
		stroke-width: 0.9;
		paint-order: stroke;
		overflow: visible;
	}

	.map.open .glyph.fort {
		width: 11px;
		height: 11px;
		box-shadow: none;
	}

	.map.open .pin.capital .glyph {
		width: 11px;
		height: 11px;
		box-shadow:
			0 0 0 2px var(--ink-halo),
			0 0 0 3px var(--ink);
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

	/* hovered or pinned: the marker takes its kingdom's colour and breathes */
	.pin.lit .glyph,
	.pin.active .glyph {
		opacity: 1;
		scale: 1.45;
	}

	.pin.lit .glyph {
		background: var(--c);
		fill: var(--c);
		animation: breathe 1.4s var(--ease) infinite;
	}

	.pin.lit::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 12px;
		height: 12px;
		translate: -50% -50%;
		border: 1.5px solid var(--c);
		border-radius: 50%;
		pointer-events: none;
		animation: ping 1.4s var(--ease) infinite;
	}

	@keyframes breathe {
		50% {
			scale: 1.75;
		}
	}

	.label {
		position: absolute;
		left: 6px;
		top: 0;
		translate: 0 -50%;
		font-size: 0.6rem;
		font-weight: 500;
		line-height: 1.25;
		letter-spacing: var(--tracking-micro);
		white-space: nowrap;
		color: rgba(255, 253, 248, 0.82);
		text-shadow:
			0 1px 3px #000,
			0 0 8px #000;
		opacity: 0;
		visibility: hidden;
		transition: color 250ms var(--ease);
	}

	/* placed labels: the spot is the box's top-left, so drop the default centring */
	.canvas.placed .label {
		visibility: visible;
		animation: labelIn 0.5s var(--ease) forwards;
	}

	.canvas.placed .label:not(.tucked) {
		translate: none;
	}

	/* no free spot: the name only shows while its marker is hovered */
	.canvas.placed .label.tucked {
		animation: none;
		opacity: 0;
	}

	.canvas.placed .pin.lit .label.tucked {
		opacity: 1;
	}

	.pin.capital .label {
		font-size: 1.2em;
		font-weight: 700;
	}

	.label .ko {
		font-weight: 700;
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

	:global(html[data-theme='light']) .pin.capital .label {
		color: #17150e;
	}

	:global(html[data-theme='light']) .pin.lit .label,
	:global(html[data-theme='light']) .pin.active .label {
		color: #17150e;
	}

	/* generous invisible hit area so small pins are easy to hover */
	.map.open .pin::before {
		content: '';
		position: absolute;
		left: -0.5rem;
		top: -0.5rem;
		width: 1rem;
		height: 1rem;
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
		pointer-events: none;
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

	.hint-touch {
		display: none;
	}

	@media (hover: none) {
		.hint-mouse {
			display: none;
		}

		.hint-touch {
			display: inline;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ping,
		.pin.lit .glyph,
		.pin.lit::after {
			animation: none;
		}
		.here,
		.map,
		.label,
		.canvas.placed .label {
			transition: none;
			animation: none;
			opacity: 1;
		}
		.canvas.placed .label.tucked {
			opacity: 0;
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

		/* The page map pans a sheet twice the column's width so labels stop colliding. */
		.map.page .frame {
			max-height: 68dvh;
			overflow: auto;
			overscroll-behavior: contain;
			border-radius: calc(var(--radius) - 2px);
		}

		.map.page .sheet {
			width: 200%;
		}

		.map.page .label {
			font-size: 0.66rem;
		}
	}
</style>
