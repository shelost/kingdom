<script lang="ts">
	import type { Block } from '$lib/story';
	import {
		PLACES,
		MAP_OUTER,
		MAP_OUTER_BOX,
		MAP_SHEET_BOX,
		MAP_VIEW,
		MAP_VIEWBOX,
		RIVERS,
		isFortress,
		type Place
	} from '$lib/places';
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

	let {
		block,
		focus,
		startYear
	}: {
		block: MapBlock;
		/** An episode's intro map: the place the story is set, where the glide ends up close. */
		focus?: string;
		/** An episode's intro map: the year it opens. The borders stand as that year begins, before its own events. */
		startYear?: number;
	} = $props();

	/** An intro map ends this close on its episode's place (sheet units across). */
	const FOCUS_W = 130;
	/** How long all of Samhan holds before the glide starts, and how long the glide takes (ms). */
	const HOLD = 1600;
	const GLIDE = 2200;

	/** Sheet units around the framed places; the crop never gets smaller than MIN_W wide. */
	const PAD = 55;
	const MIN_W = 200;
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

	/** Frame size in px: routes and labels are laid out in screen pixels. */
	let width = $state(0);
	let height = $state(0);

	const VIEW_ASPECT = MAP_VIEW.w / MAP_VIEW.h;
	/** The frame's real shape: MAP_VIEW's, until the 80vh cap makes it wider. */
	let aspect = $derived(width && height ? width / height : VIEW_ASPECT);

	/** Every intro opens on this same window: all of Samhan, widened (never cropped) to the frame. */
	let wide = $derived.by((): { x: number; y: number; w: number; h: number } => {
		if (aspect <= VIEW_ASPECT) return MAP_VIEW;
		const w = MAP_VIEW.h * aspect;
		return { x: MAP_VIEW.x + (MAP_VIEW.w - w) / 2, y: MAP_VIEW.y, w, h: MAP_VIEW.h };
	});

	/** Where the camera ends: this episode's places, in that same frame shape. */
	let focusPlace = $derived(focus ? (PLACES[focus] ?? PLACES[block.places[0]]) : undefined);

	let tight = $derived.by(() => {
		const pts: Pt[] = focusPlace
			? [[focusPlace.x, focusPlace.y]]
			: [...pins.map(({ place }): Pt => [place.x, place.y]), ...routes.flatMap(routePoints)];
		if (!pts.length) return wide;
		const xs = pts.map((p) => p[0]);
		const ys = pts.map((p) => p[1]);
		const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
		const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
		let w = focusPlace ? FOCUS_W : Math.max(Math.max(...xs) - Math.min(...xs) + PAD * 2, MIN_W);
		let h = Math.max(Math.max(...ys) - Math.min(...ys) + PAD * 2, w / aspect);
		w = Math.max(w, h * aspect);
		h = w / aspect;
		w = Math.min(w, wide.w);
		h = w / aspect;
		if (h > wide.h) {
			h = wide.h;
			w = h * aspect;
		}
		const x = Math.min(Math.max(cx - w / 2, wide.x), wide.x + wide.w - w);
		const y = Math.min(Math.max(cy - h / 2, wide.y), wide.y + wide.h - h);
		return { x, y, w, h };
	});

	/** 0 is the whole peninsula; 1 is the episode's place. Routes wait until it arrives. */
	let zoom = $state(prefersReducedMotion() ? 1 : 0);
	let zoomFrame = 0;
	let holdTimer: ReturnType<typeof setTimeout> | undefined;

	type Crop = { x: number; y: number; w: number; h: number };

	/** The arrival glide's frame: whole peninsula → this episode's place. */
	let glide = $derived.by((): Crop => {
		const t = zoom;
		return {
			x: wide.x + (tight.x - wide.x) * t,
			y: wide.y + (tight.y - wide.y) * t,
			w: wide.w + (tight.w - wide.w) * t,
			h: wide.h + (tight.h - wide.h) * t
		};
	});

	/** The reader's own framing once they pan or zoom; null follows the glide. */
	let userCrop = $state<Crop | null>(null);
	let crop = $derived(userCrop ?? glide);

	/** Closest the reader may zoom, in sheet units across. */
	const MIN_ZOOM_W = 70;
	const RECENTER_MS = 550;
	let recenterFrame = 0;
	let dragging = $state(false);

	/** Widest the reader may zoom out: the outer land (Chang'an to Nara), in a frame of this shape. */
	const maxWidthFor = (shape: number) => Math.max(tight.w, Math.min(MAP_OUTER.w, MAP_OUTER.h * shape));

	/** Keep a frame on the outer land, in the frame's own shape, no closer than MIN_ZOOM_W and no wider than that land. */
	function frameTo(c: Crop) {
		const shape = tight.w / Math.max(tight.h, 1);
		const w = Math.min(Math.max(c.w, MIN_ZOOM_W), maxWidthFor(shape));
		const h = w / shape;
		const cx = c.x + c.w / 2;
		const cy = c.y + c.h / 2;
		const fit = (v: number, size: number, from: number, span: number) =>
			size >= span ? from + (span - size) / 2 : Math.min(Math.max(v, from), from + span - size);
		userCrop = {
			x: fit(cx - w / 2, w, MAP_OUTER.x, MAP_OUTER.w),
			y: fit(cy - h / 2, h, MAP_OUTER.y, MAP_OUTER.h),
			w,
			h
		};
	}

	/** The reader takes the camera: the glide (or a re-center) stops where it is. */
	function takeControl() {
		cancelAnimationFrame(recenterFrame);
		if (userCrop) return;
		const here = { ...crop };
		cancelAnimationFrame(zoomFrame);
		clearTimeout(holdTimer);
		zoom = 1;
		live = true;
		userCrop = here;
	}

	/** Zoom by `factor` (>1 closer) about a point given as a fraction of the frame. */
	function zoomAt(factor: number, fx = 0.5, fy = 0.5) {
		takeControl();
		const c = crop;
		const shape = c.w / Math.max(c.h, 1);
		const target = c.w / factor;
		const w = Math.min(Math.max(target, MIN_ZOOM_W), maxWidthFor(shape));
		const h = w / shape;
		const ax = c.x + fx * c.w;
		const ay = c.y + fy * c.h;
		const x = ax - fx * w;
		const y = ay - fy * h;
		frameTo({ x, y, w, h });
	}

	/** Move the frame by a screen-pixel drag. */
	function pan(dx: number, dy: number) {
		const c = crop;
		if (!width || !height) return;
		frameTo({ ...c, x: c.x - (dx * c.w) / width, y: c.y - (dy * c.h) / height });
	}

	/** Glide back to the episode's own framing, then hand the camera back. */
	function recenter() {
		const from = userCrop;
		if (!from) return;
		cancelAnimationFrame(recenterFrame);
		if (prefersReducedMotion()) {
			userCrop = null;
			return;
		}
		const to = tight;
		let start = 0;
		const step = (now: number) => {
			start ||= now;
			const k = Math.min((now - start) / RECENTER_MS, 1);
			const e = 1 - Math.pow(1 - k, 3);
			userCrop = {
				x: from.x + (to.x - from.x) * e,
				y: from.y + (to.y - from.y) * e,
				w: from.w + (to.w - from.w) * e,
				h: from.h + (to.h - from.h) * e
			};
			if (k < 1) recenterFrame = requestAnimationFrame(step);
			else userCrop = null;
		};
		recenterFrame = requestAnimationFrame(step);
	}

	/* Pointers on the frame: one drags, two pinch. A touch only takes the camera once it
	   actually moves, so a vertical swipe still scrolls the page (touch-action: pan-y). */
	const pointers = new Map<number, { x: number; y: number }>();
	let pinch: { d: number; mx: number; my: number } | null = null;
	let travelled = 0;

	function pointerDown(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		if ((e.target as HTMLElement).closest('button')) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		travelled = 0;
	}

	function pointerMove(e: PointerEvent) {
		const prev = pointers.get(e.pointerId);
		if (!prev) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		if (pointers.size === 1) {
			const dx = e.clientX - prev.x;
			const dy = e.clientY - prev.y;
			travelled += Math.abs(dx) + Math.abs(dy);
			if (travelled < 4 && !dragging) return;
			if (!dragging) {
				takeControl();
				dragging = true;
			}
			pan(dx, dy);
			return;
		}
		const [a, b] = [...pointers.values()];
		const d = Math.hypot(a.x - b.x, a.y - b.y);
		const mx = (a.x + b.x) / 2;
		const my = (a.y + b.y) / 2;
		if (pinch && pinch.d > 0) {
			takeControl();
			dragging = true;
			pan(mx - pinch.mx, my - pinch.my);
			zoomAt(d / pinch.d, (mx - rect.left) / rect.width, (my - rect.top) / rect.height);
		}
		pinch = { d, mx, my };
	}

	function pointerUp(e: PointerEvent) {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinch = null;
		if (!pointers.size) dragging = false;
	}

	function doubleZoom(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		zoomAt(1.8, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
	}

	/** Pinch on a trackpad (or Ctrl/⌘ + wheel) zooms; a plain wheel keeps scrolling the page. */
	const wheelZoom: Attachment<HTMLElement> = (el) => {
		const onWheel = (e: WheelEvent) => {
			if (!e.ctrlKey && !e.metaKey) return;
			e.preventDefault();
			const r = el.getBoundingClientRect();
			zoomAt(Math.exp(-e.deltaY * 0.01), (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
		};
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => el.removeEventListener('wheel', onWheel);
	};

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

	/** The routes start drawing the first time the map scrolls into view. */
	let live = $state(false);

	const px = ([x, y]: Pt): Pt => [((x - crop.x) / crop.w) * width, ((y - crop.y) / crop.h) * height];

	/** The great rivers crossing this crop, in frame pixels. */
	let rivers = $derived.by(() => {
		if (!width || !height) return [];
		const m = 24;
		return RIVERS.filter((r) =>
			r.points.some(
				([x, y]) => x > crop.x - m && x < crop.x + crop.w + m && y > crop.y - m && y < crop.y + crop.h + m
			)
		).map((river) => ({
			river,
			pts: river.points.map(px),
			label: px(river.labelAt)
		}));
	});

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
	/** Half a year back: the holdings as the episode's year begins, so its own siege has not happened yet. */
	let year = $derived(shownYear ?? (startYear !== undefined ? startYear - 0.5 : (block.from ?? block.year)));
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

	/** Once the map is on screen, hold on all of Samhan, then glide down to this episode's place. */
	function arrive() {
		if (prefersReducedMotion()) {
			zoom = 1;
			live = true;
			return;
		}
		let start = 0;
		const step = (now: number) => {
			start ||= now;
			const k = Math.min((now - start) / GLIDE, 1);
			zoom = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
			if (k < 1) zoomFrame = requestAnimationFrame(step);
			else live = true;
		};
		holdTimer = setTimeout(() => (zoomFrame = requestAnimationFrame(step)), HOLD);
	}

	/** Watch it again: back to all of Samhan, routes undrawn, then the hold and the glide. */
	function replay() {
		cancelAnimationFrame(zoomFrame);
		cancelAnimationFrame(recenterFrame);
		clearTimeout(holdTimer);
		userCrop = null;
		live = false;
		zoom = prefersReducedMotion() ? 1 : 0;
		arrive();
	}

	$effect(() => () => {
		cancelAnimationFrame(frame);
		cancelAnimationFrame(zoomFrame);
		cancelAnimationFrame(recenterFrame);
		clearTimeout(holdTimer);
	});
</script>

<figure class="excerpt bleed">
	<div class="panel">
		<Material kind="paper" />
		<div
			class="frame"
			class:dragging
			style:aspect-ratio="{MAP_VIEW.w} / {MAP_VIEW.h}"
			bind:clientWidth={width}
			bind:clientHeight={height}
			role={routes.length ? 'img' : undefined}
			aria-label={routes.length ? summary : undefined}
			{@attach onceInView(arrive)}
			{@attach wheelZoom}
			onpointerdown={pointerDown}
			onpointermove={pointerMove}
			onpointerup={pointerUp}
			onpointercancel={pointerUp}
			ondblclick={doubleZoom}
		>
			<div
				class="view"
				style:left="{view.left}%"
				style:top="{view.top}%"
				style:width="{view.width}%"
				style:height="{view.height}%"
			>
				<div class="land">
					<img
						class="sheet"
						src="/map-outer.svg"
						alt=""
						loading="lazy"
						decoding="async"
						style:left="{MAP_OUTER_BOX.left}%"
						style:top="{MAP_OUTER_BOX.top}%"
						style:width="{MAP_OUTER_BOX.width}%"
						style:height="{MAP_OUTER_BOX.height}%"
					/>
					<img
						class="sheet inner"
						src="/map-base.svg"
						alt=""
						loading="lazy"
						decoding="async"
						style:left="{MAP_SHEET_BOX.left}%"
						style:top="{MAP_SHEET_BOX.top}%"
						style:width="{MAP_SHEET_BOX.width}%"
						style:height="{MAP_SHEET_BOX.height}%"
					/>
				</div>
				<BorderLayer {year} />
			</div>

			{#if live && drawn.length}
				<MapRouteLayer routes={drawn.map((d) => d.line)} {battles} {width} {height} draw={DRAW} />
			{/if}

			{#if rivers.length}
				<svg
					class="rivers"
					viewBox="0 0 {width} {height}"
					style:--land-size="{(MAP_VIEWBOX.w / crop.w) * width}px {(MAP_VIEWBOX.h / crop.h) * height}px"
					style:--land-at="{(-crop.x / crop.w) * width}px {(-crop.y / crop.h) * height}px"
					aria-hidden="true"
				>
					{#each rivers as { river, pts } (river.id)}
						<polyline points={pts.map(([x, y]) => `${x},${y}`).join(' ')}>
							<title>{river.name} · {river.korean}</title>
						</polyline>
					{/each}
				</svg>
				{#if block.riverNames}
					{#each rivers as { river, label } (river.id)}
						<span
							class="river-label"
							style:left="{label[0]}px"
							style:top="{label[1]}px"
							aria-hidden="true"
						>
							{ko ? river.korean.split(/[\s(]/)[0] : river.name}
						</span>
					{/each}
				{/if}
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

		</div>
	</div>
	<div class="map-controls">
		<button type="button" class="again" onclick={replay} aria-label={ko ? '다시 보기' : 'Replay'} title={ko ? '다시 보기' : 'Replay'}>
			<span class="material-symbols-outlined" aria-hidden="true">replay</span>
		</button>
		<button type="button" onclick={() => zoomAt(1.5)} aria-label={ko ? '확대' : 'Zoom in'}>
			<span class="material-symbols-outlined" aria-hidden="true">add</span>
		</button>
		<button type="button" onclick={() => zoomAt(1 / 1.5)} aria-label={ko ? '축소' : 'Zoom out'}>
			<span class="material-symbols-outlined" aria-hidden="true">remove</span>
		</button>
		{#if userCrop}
			<button type="button" class="recenter" onclick={recenter} aria-label={ko ? '원래 위치로' : 'Re-center map'}>
				<span class="material-symbols-outlined" aria-hidden="true">my_location</span>
			</button>
		{/if}
	</div>
	<div class="chrome">
		{#if block.from !== undefined}
			<button
				type="button"
				class="play"
				class:playing
				onclick={play}
				aria-label={played ? 'Replay the border change' : 'Play the border change'}
			>
				<span class="material-symbols-outlined" aria-hidden="true">{played ? 'replay' : 'play_arrow'}</span>
				<span class="span">{formatYear(block.from, ko)} → {formatYear(block.year, ko)}</span>
			</button>
		{:else}
			<span></span>
		{/if}
		<span class="year" aria-live="polite">{formatYear(Math.ceil(year), ko)}</span>
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
		position: relative;
		margin: var(--widget-gap) 0;
		container-type: inline-size;
	}

	/* Almost the width of the window, centred on the script column. The chapter
	   lets this one spill; inline figures stay clipped. */
	@media (min-width: 821px) {
		.excerpt.bleed {
			width: min(90vw, 76rem);
			max-width: calc(100vw - 3rem);
			margin-left: calc(50% - min(45vw, 38rem));
		}
	}

	/* The map is printed as a panel: the ink frame and print shadow ride on the
	   wrapper, outside the frame's clip. */
	.panel {
		position: relative;
		isolation: isolate;
		/* Same edge fade as the battle maps: the sheet dissolves instead of ending on a box. */
		-webkit-mask-image: radial-gradient(ellipse 72% 68% at 50% 48%, #000 46%, transparent 96%);
		mask-image: radial-gradient(ellipse 72% 68% at 50% 48%, #000 46%, transparent 96%);
	}

	.chrome {
		position: absolute;
		z-index: 5;
		left: 14%;
		right: 14%;
		bottom: 16%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		pointer-events: none;
	}

	.frame {
		position: relative;
		width: 100%;
		max-height: 80vh;
		overflow: hidden;
		background: color-mix(in srgb, var(--fg) 4%, transparent);
		/* One finger: horizontal drags pan the map, vertical swipes still scroll the page. */
		touch-action: pan-y;
		user-select: none;
		cursor: grab;
	}

	.frame.dragging {
		cursor: grabbing;
	}

	.map-controls {
		position: absolute;
		z-index: 5;
		top: 14%;
		right: 16%;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.map-controls button {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		border: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
		border-radius: 999px;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		backdrop-filter: blur(6px);
		cursor: pointer;
		transition:
			background 200ms var(--ease),
			border-color 200ms var(--ease);
	}

	.map-controls button:hover {
		border-color: var(--gold);
		background: color-mix(in srgb, var(--gold) 18%, var(--bg));
	}

	.map-controls button:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.map-controls .again:active .material-symbols-outlined {
		transform: rotate(-120deg);
	}

	.map-controls .material-symbols-outlined {
		transition: transform 0.3s var(--ease);
		font-size: 1.1rem;
	}

	.map-controls .recenter {
		border-color: color-mix(in srgb, var(--gold) 60%, transparent);
		color: var(--gold);
		animation: pin-in 260ms var(--ease) both;
	}

	.view {
		position: absolute;
	}

	/* The outer land and the sheet recolour and fade as one layer, so neither shows through the other. */
	.land {
		position: absolute;
		inset: 0;
		/* the source map is drawn for paper — invert it onto the dark page */
		filter: invert(1) hue-rotate(180deg) saturate(0.75) brightness(0.82) contrast(1.1);
		opacity: 0.72;
	}

	.sheet {
		position: absolute;
		display: block;
		max-width: none;
	}

	/* The Figma sheet's coast is finer than Natural Earth's: fade its edges into the outer land so the seam never reads. */
	.sheet.inner {
		--fade: linear-gradient(to right, transparent, #000 2.5%, #000 97.5%, transparent);
		-webkit-mask-image: var(--fade), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent);
		-webkit-mask-composite: source-in;
		mask-image: var(--fade), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent);
		mask-composite: intersect;
	}

	:global(html[data-theme='light']) .land {
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

	/* the great rivers ride under the pins */
	.rivers {
		position: absolute;
		z-index: 0;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
		/* the sheet's land mask, scaled to this crop: rivers stop at the coast */
		mask: url('/map-land.svg') var(--land-at) / var(--land-size) no-repeat;
		-webkit-mask: url('/map-land.svg') var(--land-at) / var(--land-size) no-repeat;
	}

	.rivers polyline {
		fill: none;
		stroke: #6aa8d8;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-opacity: 0.8;
	}

	.river-label {
		position: absolute;
		z-index: 1;
		translate: 5px -50%;
		font-size: 0.62rem;
		font-style: italic;
		white-space: nowrap;
		pointer-events: none;
		color: rgba(143, 195, 232, 0.92);
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
		position: static;
		z-index: 4;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
		text-shadow: 0 0 8px var(--bg);
	}

	.play {
		position: static;
		z-index: 4;
		pointer-events: auto;
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
