<script lang="ts">
	import type { Block } from '$lib/story';
	import { PLACES, MAP_SHEET_BOX, MAP_VIEW, MAP_VIEWBOX, isFortress, type Place } from '$lib/places';
	import { KINGDOMS } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { formatYear } from '$lib/borders';
	import { placeBanner } from '$lib/banners';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import { FLAG_SIZE, placeLabels, type LabelItem, type LabelSpot } from '$lib/mapLabels';
	import {
		ROUTE_BY_ID,
		ROUTE_KINDS,
		routeColor,
		routeLegendLabel,
		routePlaceIds,
		routePoints,
		routeSide,
		type MapRoute,
		type RouteKind
	} from '$lib/mapRoutes';
	import { CROSSED_SWORDS, FORT_GLYPH, STAR_GLYPH, arrowHead, curveThrough, pointAlong, waveAlong, type Pt } from '$lib/mapPaths';
	import type { Attachment } from 'svelte/attachments';
	import BorderLayer from './BorderLayer.svelte';
	import Material from './Material.svelte';
	import MapFlag from './MapFlag.svelte';
	import MapRouteLayer, { type BattleMark, type DrawnRoute } from './MapRouteLayer.svelte';

	type MapBlock = Extract<Block, { kind: 'map' }>;

	let { block }: { block: MapBlock } = $props();

	/** Sheet units around the framed places; the crop never gets smaller than MIN_W wide. */
	const PAD = 55;
	const MIN_W = 200;
	const ASPECT = 1.6;
	/** Route maps may stand squarer, so a north–south campaign is not padded out with empty sea. */
	const ROUTE_ASPECT = 1.2;
	/** Years per second while the borders sweep from `from` to `year`. */
	const SWEEP_SPEED = 6;
	/** Route timing (seconds): first route's lead-in, per-`order` stagger, draw-in length. */
	const LEAD = 0.35;
	const STAGGER = 0.6;
	const DRAW = 1.4;
	/** Arrowhead length and the gap left beside a place marker (px). */
	const HEAD = 8;
	const MARKER_GAP = 7;
	/** A route ending on a battle stops short of the crossed-swords disc. */
	const BATTLE_GAP = 11;
	const ROUTE_LABEL = 'route:';

	let ko = $derived(reading.lang === 'ko');

	let routes = $derived(
		[...new Set(block.routes ?? [])].map((id) => ROUTE_BY_ID[id]).filter((r): r is MapRoute => !!r)
	);

	/** The block's own places, then every place a route passes through (drawn smaller). */
	let pins = $derived.by(() => {
		const own = new Set(block.places);
		const ids = [...new Set([...block.places, ...routes.flatMap(routePlaceIds)])];
		return ids
			.map((id) => PLACES[id])
			.filter((p): p is Place => !!p)
			.map((place) => ({ place, own: own.has(place.id) }));
	});

	let crop = $derived.by(() => {
		const pts: Pt[] = [...pins.map(({ place }): Pt => [place.x, place.y]), ...routes.flatMap(routePoints)];
		const xs = pts.map((p) => p[0]);
		const ys = pts.map((p) => p[1]);
		const cx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : MAP_VIEW.x + MAP_VIEW.w / 2;
		const cy = ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : MAP_VIEW.y + MAP_VIEW.h / 2;
		const aspect = routes.length ? ROUTE_ASPECT : ASPECT;
		let w = Math.max(xs.length ? Math.max(...xs) - Math.min(...xs) + PAD * 2 : MAP_VIEW.w, MIN_W);
		let h = Math.max(ys.length ? Math.max(...ys) - Math.min(...ys) + PAD * 2 : 0, w / ASPECT);
		w = Math.max(w, h * aspect);
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

	/** Frame size in px: routes and labels are laid out in screen pixels. */
	let width = $state(0);
	let height = $state(0);
	/** The routes start drawing the first time the map scrolls into view. */
	let live = $state(false);

	const px = ([x, y]: Pt): Pt => [((x - crop.x) / crop.w) * width, ((y - crop.y) / crop.h) * height];

	let drawn = $derived.by(() => {
		if (!width || !height) return [];
		return routes.flatMap((route, i) => {
			const first = route.points[0];
			const last = route.points[route.points.length - 1];
			const curve = curveThrough(routePoints(route).map(px), {
				startGap: typeof first === 'string' ? MARKER_GAP : 0,
				endGap: (typeof last !== 'string' ? 0 : last === route.battle ? BATTLE_GAP : MARKER_GAP) + HEAD,
				bend: route.bend ?? 1
			});
			if (!curve) return [];
			const line: DrawnRoute = {
				id: route.id,
				kind: route.kind,
				color: routeColor(route),
				d: curve.d,
				wave: route.kind === 'naval' ? waveAlong(curve.samples, 1.6, 16) : undefined,
				head: arrowHead(curve.samples, HEAD),
				delay: LEAD + (route.order ?? i) * STAGGER
			};
			return [{ route, line, anchor: pointAlong(curve.samples, 0.5) }];
		});
	});

	/** One crossed-swords mark per battle place, stamped when the first route into it lands. */
	let battles = $derived.by(() => {
		const marks: Record<string, BattleMark> = {};
		for (const { route, line } of drawn) {
			const place = route.battle ? PLACES[route.battle] : undefined;
			if (!place) continue;
			const delay = line.delay + DRAW;
			if (marks[place.id] && marks[place.id].delay <= delay) continue;
			const [x, y] = px([place.x, place.y]);
			marks[place.id] = { id: place.id, x, y, delay };
		}
		return Object.values(marks);
	});

	let legend = $derived.by(() => {
		const sides: Record<string, { key: string; label: string; color: string }> = {};
		for (const r of routes) {
			const color = routeColor(r);
			const key = `${r.who ?? r.side}:${color}`;
			sides[key] ??= { key, label: routeLegendLabel(r, ko), color };
		}
		const present = new Set(routes.map((r) => r.kind));
		const kinds = (Object.keys(ROUTE_KINDS) as RouteKind[]).filter((k) => present.has(k));
		return { sides: Object.values(sides), kinds, battle: routes.some((r) => r.battle) };
	});

	let summary = $derived(
		routes
			.map((r) => `${routeSide(r.side).label}, ${ROUTE_KINDS[r.kind].label.toLowerCase()}: ${r.label}`)
			.join('; ')
	);

	/** Greedy label layout (mapLabels) over place names and route names, redone when the frame resizes. */
	let spots = $state<Record<string, LabelSpot>>({});
	const labelEls: Record<string, HTMLElement> = {};

	const measure =
		(id: string): Attachment<HTMLElement> =>
		(el) => {
			labelEls[id] = el;
			return () => delete labelEls[id];
		};

	$effect(() => {
		const w = width;
		const h = height;
		const placed = pins;
		const lines = live ? drawn : [];
		void ko;
		if (!w || !h) return;
		const layout = () => {
			const items: LabelItem[] = [];
			for (const { place, own } of placed) {
				const el = labelEls[place.id];
				if (!el) continue;
				const [x, y] = px([place.x, place.y]);
				const r = place.capital ? 6 : isFortress(place) ? 5.5 : 4;
				const flag = place.capital || isFortress(place) ? FLAG_SIZE[own ? 'sm' : 'xs'] : undefined;
				items.push({ id: place.id, x, y, r, w: el.offsetWidth, h: el.offsetHeight, priority: own ? (place.capital ? 4 : 3) : 1, flag });
			}
			for (const { route, anchor } of lines) {
				const el = labelEls[ROUTE_LABEL + route.id];
				if (!el) continue;
				items.push({ id: ROUTE_LABEL + route.id, x: anchor.x, y: anchor.y, r: 3, w: el.offsetWidth, h: el.offsetHeight, priority: 2 });
			}
			spots = placeLabels(items, w, h);
		};
		layout();
		let alive = true;
		document.fonts?.ready.then(() => alive && layout());
		return () => (alive = false);
	});

	let shownYear = $state<number | null>(null);
	let year = $derived(shownYear ?? block.from ?? block.year);
	let caption = $derived(ko ? (block.ko ?? block.caption) : block.caption);
	let playing = $state(false);
	let played = $state(false);
	let frame = 0;

	/** Sweep the borders from `from` to `year`; replays from the start when pressed again. */
	function play() {
		const from = block.from;
		if (from === undefined || playing) return;
		if (prefersReducedMotion()) {
			shownYear = block.year;
			played = true;
			return;
		}
		const span = block.year - from;
		const duration = Math.min(Math.max((Math.abs(span) / SWEEP_SPEED) * 1000, 1200), 4000);
		let start = 0;
		playing = true;
		shownYear = from;
		frame = requestAnimationFrame(function step(t) {
			start ||= t;
			const k = Math.min((t - start) / duration, 1);
			const eased = 1 - Math.pow(1 - k, 3);
			shownYear = Math.round(from + span * eased);
			if (k < 1) frame = requestAnimationFrame(step);
			else {
				playing = false;
				played = true;
			}
		});
	}

	$effect(() => () => cancelAnimationFrame(frame));
</script>

<figure class="excerpt">
	<div class="panel">
		<Material kind="paper" />
		<div
			class="frame"
			style:aspect-ratio="{crop.w} / {crop.h}"
			bind:clientWidth={width}
			bind:clientHeight={height}
			role={routes.length ? 'img' : undefined}
			aria-label={routes.length ? summary : undefined}
			{@attach onceInView(() => {
				live = true;
			})}
		>
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

			{#if live && drawn.length}
				<MapRouteLayer routes={drawn.map((d) => d.line)} {battles} {width} {height} draw={DRAW} />
			{/if}

			{#each pins as { place: p, own }, i (p.id)}
				{@const pos = at(p)}
				{@const spot = spots[p.id]}
				{@const banner = p.capital || isFortress(p) ? placeBanner(p, year) : null}
				<span
					class="pin"
					class:capital={p.capital}
					class:extra={!own}
					style:left="{pos.left}%"
					style:top="{pos.top}%"
					style:--c={banner?.color ?? KINGDOMS[p.side].color}
					style:--i={i}
					aria-hidden="true"
				>
					{#if p.capital}
						<svg class="fort star" viewBox="0 0 12 12"><path d={STAR_GLYPH} /></svg>
					{:else if isFortress(p)}
						<svg class="fort" viewBox="0 0 12 12"><path d={FORT_GLYPH} /></svg>
					{:else}
						<span class="dot"></span>
					{/if}
					{#if banner}<MapFlag {banner} size={own ? 'sm' : 'xs'} />{/if}
				</span>
				<span
					class="label"
					class:extra={!own}
					class:placed={!!spot}
					class:tucked={spot === null}
					style:left={spot ? `${spot.left}px` : `calc(${pos.left}% + 0.55rem)`}
					style:top={spot ? `${spot.top}px` : `${pos.top}%`}
					style:--i={i}
					{@attach measure(p.id)}
				>
					{ko ? (p.korean ?? p.name) : p.name}
				</span>
			{/each}

			{#if live}
				{#each drawn as { route, line, anchor } (route.id)}
					{@const spot = spots[ROUTE_LABEL + route.id]}
					<span
						class="route-label"
						class:placed={!!spot}
						class:tucked={spot === null}
						style:left="{spot ? spot.left : anchor.x}px"
						style:top="{spot ? spot.top : anchor.y}px"
						style:--c={line.color}
						style:--delay="{line.delay + DRAW * 0.6}s"
						aria-hidden="true"
						{@attach measure(ROUTE_LABEL + route.id)}
					>
						{ko ? (route.ko ?? route.label) : route.label}
					</span>
				{/each}
			{/if}

			<span class="year" aria-live="polite">{formatYear(year)}</span>
			{#if block.from !== undefined}
				<button
					type="button"
					class="play"
					class:playing
					onclick={play}
					aria-label={played ? 'Replay the border change' : 'Play the border change'}
				>
					<span class="material-symbols-outlined" aria-hidden="true">{played ? 'replay' : 'play_arrow'}</span>
					<span class="span">{formatYear(block.from)} → {formatYear(block.year)}</span>
				</button>
			{/if}
		</div>
	</div>
	{#if routes.length}
		<ul class="legend" aria-hidden="true">
			{#each legend.sides as s (s.key)}
				<li><span class="swatch" style:--c={s.color}></span>{s.label}</li>
			{/each}
			{#each legend.kinds as kind (kind)}
				{@const k = ROUTE_KINDS[kind]}
				<li>
					<svg class="sample" viewBox="0 0 28 8">
						<path class="stroke" d="M1.5 4H19" style:stroke-dasharray={k.dash} style:stroke-width="{k.width * 0.8}px" />
						<path class="tip" d="M26 4L19 0.8L20 4L19 7.2Z" />
					</svg>
					{ko ? k.ko : k.label}
				</li>
			{/each}
			{#if legend.battle}
				<li>
					<svg class="sample swords" viewBox="-1.25 -1.25 2.5 2.5"><path d={CROSSED_SWORDS} /></svg>
					{ko ? '전투' : 'Battle'}
				</li>
			{/if}
		</ul>
	{/if}
	{#if block.title || caption}
		<figcaption>
			{#if block.title}<span class="title">{block.title}</span>{/if}
			{#if caption}<span class="caption">{caption}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.excerpt {
		margin: var(--widget-gap) 0;
		container-type: inline-size;
	}

	/* The map is printed as a panel: the ink frame and print shadow ride on the
	   wrapper, outside the frame's clip. */
	.panel {
		position: relative;
		isolation: isolate;
	}

	.frame {
		position: relative;
		overflow: hidden;
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

	/* routes and battle marks (MapRouteLayer, z-index 2) draw over the place glyphs */
	.pin {
		position: absolute;
		z-index: 1;
		display: grid;
		place-items: center;
		translate: -50% -50%;
		animation: pin-in 520ms var(--ease) both;
		animation-delay: calc(var(--i) * 90ms + 200ms);
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

	.extra .dot {
		width: 0.42rem;
		height: 0.42rem;
		box-shadow: 0 0 0 1.5px rgba(255, 253, 248, 0.8);
	}

	.fort {
		display: block;
		width: 0.8rem;
		height: 0.8rem;
		overflow: visible;
		fill: var(--c);
		stroke: rgba(255, 253, 248, 0.9);
		stroke-width: 1.4;
		paint-order: stroke;
	}

	.extra .fort {
		width: 0.62rem;
		height: 0.62rem;
	}

	.fort.star {
		width: 1rem;
		height: 1rem;
	}

	.extra .fort.star {
		width: 0.78rem;
		height: 0.78rem;
	}

	.label,
	.route-label {
		position: absolute;
		z-index: 3;
		white-space: nowrap;
		pointer-events: none;
		text-shadow:
			0 0 6px var(--bg),
			0 0 2px var(--bg);
	}

	.label {
		font-size: 0.72rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--fg-strong);
		translate: 0 -50%;
		animation: pin-in 520ms var(--ease) both;
		animation-delay: calc(var(--i) * 90ms + 260ms);
	}

	.label.extra {
		font-size: 0.64rem;
		font-weight: 500;
		color: var(--fg-dim);
	}

	.route-label {
		font-size: 0.64rem;
		font-weight: 700;
		font-style: italic;
		line-height: 1.25;
		letter-spacing: 0.02em;
		color: color-mix(in srgb, var(--c) 70%, #fff);
		translate: -50% -50%;
		animation: label-in 480ms var(--ease) var(--delay) both;
	}

	:global(html[data-theme='light']) .route-label {
		color: color-mix(in srgb, var(--c) 82%, #000);
	}

	.label.placed,
	.route-label.placed {
		translate: none;
	}

	.label.tucked,
	.route-label.tucked {
		visibility: hidden;
	}

	.year {
		position: absolute;
		z-index: 4;
		right: 0.6rem;
		bottom: 0.45rem;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
		text-shadow: 0 0 8px var(--bg);
	}

	.play {
		position: absolute;
		z-index: 4;
		left: 0.55rem;
		bottom: 0.45rem;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.22rem 0.65rem 0.22rem 0.35rem;
		border: 1px solid color-mix(in srgb, var(--gold) 55%, transparent);
		border-radius: var(--radius-pill, 999px);
		font: 600 0.72rem/1 var(--ui);
		font-variant-numeric: tabular-nums;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		backdrop-filter: blur(6px);
		cursor: pointer;
		transition:
			background 200ms var(--ease),
			border-color 200ms var(--ease);
	}

	.play:hover {
		border-color: var(--gold);
		background: color-mix(in srgb, var(--gold) 22%, var(--bg));
	}

	.play.playing {
		opacity: 0.6;
		pointer-events: none;
	}

	.play .material-symbols-outlined {
		font-size: 1.15rem;
		color: var(--gold);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.9rem;
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--fg-dim);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.swatch {
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 2px;
		background: var(--c);
	}

	.sample {
		width: 1.75rem;
		height: 0.5rem;
		overflow: visible;
	}

	.sample .stroke {
		fill: none;
		stroke: var(--fg);
		stroke-linecap: round;
	}

	.sample .tip {
		fill: var(--fg);
	}

	.sample.swords {
		width: 0.85rem;
		height: 0.85rem;
	}

	.sample.swords path {
		fill: none;
		stroke: var(--gold);
		stroke-width: 0.26;
		stroke-linecap: round;
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
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	@container (max-width: 480px) {
		.label {
			font-size: 0.64rem;
		}

		.label.extra,
		.route-label {
			font-size: 0.58rem;
		}
	}

	@keyframes pin-in {
		from {
			opacity: 0;
			scale: 0.6;
		}
	}

	@keyframes label-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pin,
		.label,
		.route-label {
			animation: none;
		}
	}
</style>
