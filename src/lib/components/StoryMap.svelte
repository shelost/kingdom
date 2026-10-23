<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import {
		PLACES,
		MAP_MARKERS,
		standsIn,
		MAP_LINES,
		RIVERS,
		MAP_VIEW,
		MAP_VIEWBOX,
		MAP_SHEET_BOX,
		MAP_OUTER_BOX,
		isFortress,
		mapLabel,
		type Place
	} from '$lib/places';
	import { FLAG_SIZE, placeLabels, type LabelSpot } from '$lib/mapLabels';
	import { placeBanner } from '$lib/banners';
	import { KINGDOMS } from '$lib/people';
	import { openProfile } from '$lib/profiles.svelte';
	import { mapUi, closeStoryMap } from '$lib/mapUi.svelte';
	import { onDestroy, tick, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import BorderLayer from '$lib/components/BorderLayer.svelte';
	import MapFlag from '$lib/components/MapFlag.svelte';
	import { FORT_GLYPH, STAR_GLYPH } from '$lib/mapPaths';

	let {
		pageMode = false,
		pinnable = false,
		year = null,
		markers = true,
		show = null,
		rivers = true,
		riverNames = false,
		detail = true,
		hovered = $bindable(null)
	}: {
		/** Show the place markers (and their labels); off leaves the bare sheet. */
		markers?: boolean;
		/** Which markers to draw (all of them when unset). */
		show?: ((p: Place) => boolean) | null;
		/** Draw the great rivers and their names. */
		rivers?: boolean;
		/** Statelet shades and internal seams. Off: one colour per kingdom. */
		detail?: boolean;
		/** Name the rivers on the sheet. */
		riverNames?: boolean;
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
		pts: line.stops
			.map((id) => PLACES[id])
			.filter(Boolean)
			.map((p): [number, number] => [p.x, p.y])
	}));

	/** How much of a line stands in `year` (0–1): a wall under construction grows along its course. */
	function builtShare(line: (typeof LINES)[number], at: number | null): number {
		if (at === null || !line.built) return 1;
		const [from, to] = line.built;
		return at < from ? 0 : at >= to ? 1 : (at - from + 1) / (to - from + 1);
	}

	/** The first `share` of a polyline's length, as SVG points. */
	function partialPoints(pts: [number, number][], share: number): string {
		if (share >= 1) return pts.map(([x, y]) => `${x},${y}`).join(' ');
		const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
		let left = lens.reduce((a, b) => a + b, 0) * share;
		const out: [number, number][] = [pts[0]];
		for (let i = 0; i < lens.length && left > 0; i++) {
			const t = Math.min(1, left / lens[i]);
			const [a, b] = [pts[i], pts[i + 1]];
			out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
			left -= lens[i];
		}
		return out.map(([x, y]) => `${x},${y}`).join(' ');
	}

	/** The markers on the sheet right now. */
	let visible = $derived(
		markers ? MAP_MARKERS.filter((p) => (!show || show(p)) && (year === null || standsIn(p, year))) : []
	);
	let ko = $derived(reading.lang === 'ko');
	const koName = (p: { korean?: string }) => p.korean?.split(/[\s(]/)[0];

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
		const r = (sheet.querySelector<HTMLElement>('.canvas') ?? sheet).getBoundingClientRect();
		let best: Place | null = null;
		let bestD = HOVER_RADIUS;
		for (const p of visible) {
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
		if (dragged) return;
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
		if (dragged) return;
		if (pageMode && pinnable) {
			cancelClear();
			pinned = p;
			hovered = p;
		} else {
			openProfile(p.id);
		}
	}

	let open = $derived(pageMode || mapUi.open);
	/** On the border timeline, capitals and fortresses fly their holder's flag. */
	let flagged = $derived(year !== null);
	const flies = (p: Place) => p.capital || isFortress(p);
	let place = $derived<Place | null>(reading.place ? (PLACES[reading.place] ?? null) : null);
	let colour = $derived(place ? KINGDOMS[place.side].color : '#8a8a94');

	/** the marker the explainer describes: hover wins, else the story's own */
	let shown = $derived(hovered ?? place);

	/** Where a pannable phone sheet opens when the story has no current place. */
	const MARKER_CENTRE = {
		x: MAP_MARKERS.reduce((sum, p) => sum + p.x, 0) / MAP_MARKERS.length,
		y: MAP_MARKERS.reduce((sum, p) => sum + p.y, 0) / MAP_MARKERS.length
	};

	/**
	 * The map page looks through a window wider than the sheet (the same shape as the
	 * frame), so zooming out reaches Shandong, the steppe and the islands. It opens
	 * at HOME_ZOOM, framed on the sheet exactly as before.
	 */
	const WIDE_W = 1000;
	const WIDE_H = (WIDE_W * MAP_VIEW.h) / MAP_VIEW.w;
	const WIDE = { x: MAP_VIEW.x + MAP_VIEW.w / 2 - WIDE_W / 2, y: MAP_VIEW.y + MAP_VIEW.h / 2 - WIDE_H / 2, w: WIDE_W, h: WIDE_H };
	/** Where the sheet's window sits inside the wide one (%). */
	const VIEW_IN_WIDE = {
		left: ((MAP_VIEW.x - WIDE.x) / WIDE.w) * 100,
		top: ((MAP_VIEW.y - WIDE.y) / WIDE.h) * 100,
		width: (MAP_VIEW.w / WIDE.w) * 100,
		height: (MAP_VIEW.h / WIDE.h) * 100
	};
	const HOME_ZOOM = WIDE.w / MAP_VIEW.w;

	/** Scroll the wide sheet so a point (as % of the sheet's window) sits in the frame's centre. */
	function centreOn(frame: HTMLElement, c: { left: number; top: number }) {
		const x = (VIEW_IN_WIDE.left + (c.left * VIEW_IN_WIDE.width) / 100) / 100;
		const y = (VIEW_IN_WIDE.top + (c.top * VIEW_IN_WIDE.height) / 100) / 100;
		frame.scrollLeft = x * frame.scrollWidth - frame.clientWidth / 2;
		frame.scrollTop = y * frame.scrollHeight - frame.clientHeight / 2;
	}

	/** Open on the sheet (phones a step closer, centred on the story's place). */
	const centreSheet: Attachment<HTMLElement> = (frame) => {
		const phone = matchMedia('(max-width: 820px)').matches;
		const c = phone ? pct(untrack(() => place) ?? MARKER_CENTRE) : { left: 50, top: 50 };
		zoom = phone ? HOME_ZOOM * 2 : HOME_ZOOM;
		/* Wait for the wide sheet to lay out (it is wider than the frame once it has), then centre. */
		let tries = 0;
		let raf = 0;
		const settle = () => {
			if (frame.scrollWidth > frame.clientWidth + 1 || ++tries > 60) centreOn(frame, c);
			else raf = requestAnimationFrame(settle);
		};
		tick().then(() => (raf = requestAnimationFrame(settle)));
		return () => cancelAnimationFrame(raf);
	};

	/** Back to the opening frame: the whole sheet, centred. */
	async function recentre() {
		zoom = HOME_ZOOM;
		await tick();
		if (frameEl) centreOn(frameEl, { left: 50, top: 50 });
	}

	/* ————— zoom and pan (map page) ————— */
	const ZOOM_MIN = 1;
	const ZOOM_MAX = HOME_ZOOM * 5;
	/** Pointer travel (px) before a press counts as a drag, not a click. */
	const DRAG_SLOP = 4;

	let zoom = $state(HOME_ZOOM);
	let frameEl: HTMLElement | null = null;
	/** The last press moved the map, so its click must not pick a place. */
	let dragged = false;
	const pointers = new Map<number, { x: number; y: number }>();
	let pressAt: { x: number; y: number } | null = null;
	let pinchFrom = 0;

	/** Zooms to `next`, keeping the sheet point under (cx, cy) where it is. */
	async function zoomTo(next: number, cx?: number, cy?: number) {
		const frame = frameEl;
		const to = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
		if (!frame || to === zoom) return;
		const r = frame.getBoundingClientRect();
		const ox = (cx ?? r.left + r.width / 2) - r.left;
		const oy = (cy ?? r.top + r.height / 2) - r.top;
		const k = to / zoom;
		const x = (frame.scrollLeft + ox) * k - ox;
		const y = (frame.scrollTop + oy) * k - oy;
		zoom = to;
		await tick();
		frame.scrollLeft = x;
		frame.scrollTop = y;
	}

	const pinchSpread = () => {
		const [a, b] = [...pointers.values()];
		return Math.hypot(a.x - b.x, a.y - b.y);
	};

	function framePointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		dragged = false;
		pressAt = { x: e.clientX, y: e.clientY };
		if (pointers.size === 2) pinchFrom = pinchSpread();
	}

	function framePointerMove(e: PointerEvent) {
		const last = pointers.get(e.pointerId);
		if (!last || !frameEl) return;
		const now = { x: e.clientX, y: e.clientY };
		pointers.set(e.pointerId, now);
		if (pointers.size === 2) {
			const spread = pinchSpread();
			const [a, b] = [...pointers.values()];
			if (pinchFrom) zoomTo(zoom * (spread / pinchFrom), (a.x + b.x) / 2, (a.y + b.y) / 2);
			pinchFrom = spread;
			dragged = true;
			return;
		}
		if (pressAt && Math.hypot(now.x - pressAt.x, now.y - pressAt.y) > DRAG_SLOP) dragged = true;
		if (dragged) {
			frameEl.scrollLeft -= now.x - last.x;
			frameEl.scrollTop -= now.y - last.y;
		}
	}

	function framePointerUp(e: PointerEvent) {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinchFrom = 0;
		if (!pointers.size) pressAt = null;
	}

	/** Wheel zoom needs a non-passive listener to keep the page from scrolling. */
	const zoomable: Attachment<HTMLElement> = (frame) => {
		frameEl = frame;
		const wheel = (e: WheelEvent) => {
			e.preventDefault();
			zoomTo(zoom * Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY);
		};
		frame.addEventListener('wheel', wheel, { passive: false });
		return () => {
			frame.removeEventListener('wheel', wheel);
			frameEl = null;
		};
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
		const withFlags = flagged;
		void visible.length;
		void ko;
		const layout = () => {
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (!w || !h) return;
			const items = visible.flatMap((p) => {
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
						priority: p.capital ? 1 : 0,
						flag: withFlags && flies(p) ? FLAG_SIZE.xs : undefined
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
	{#if p.capital}
		<svg class="glyph fort star" viewBox="0 0 12 12" aria-hidden="true">
			<path d={STAR_GLYPH} />
		</svg>
	{:else if isFortress(p)}
		<svg class="glyph fort" viewBox="0 0 12 12" aria-hidden="true">
			<path d={FORT_GLYPH} />
		</svg>
	{:else}
		<span class="glyph"></span>
	{/if}
	{#if year !== null && flies(p)}
		{@const banner = placeBanner(p, year)}
		{#if banner}<span class="flagpost"><MapFlag {banner} size="xs" /></span>{/if}
	{/if}
{/snippet}

{#snippet mapBody()}
	<div class="canvas" class:placed={!!spots} {@attach placeOnResize}>
		{#if pageMode}
			<img
				class="outer"
				src="/map-outer.svg"
				alt=""
				decoding="async"
				style:left="{MAP_OUTER_BOX.left}%"
				style:top="{MAP_OUTER_BOX.top}%"
				style:width="{MAP_OUTER_BOX.width}%"
				style:height="{MAP_OUTER_BOX.height}%"
			/>
		{/if}
		<img
			class:inner={pageMode}
			src={year === null ? '/map.svg' : '/map-base.svg'}
			alt={ko ? '삼국 지도' : 'Map of the Three Kingdoms'}
			decoding="async"
			fetchpriority={open ? 'auto' : 'low'}
			style:left="{IMG.left}%"
			style:top="{IMG.top}%"
			style:width="{IMG.width}%"
			style:height="{IMG.height}%"
		/>

		{#if year !== null}
			<BorderLayer {year} {detail} />
		{/if}

		{#if open && markers}
			<svg
				class="lines"
				viewBox="{MAP_VIEW.x} {MAP_VIEW.y} {MAP_VIEW.w} {MAP_VIEW.h}"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				{#each LINES as line (line.id)}
					{@const share = builtShare(line, year)}
					{#if share > 0}
						<polyline points={partialPoints(line.pts, share)} class:building={share < 1}>
							<title>{line.name} · {line.korean}</title>
						</polyline>
					{/if}
				{/each}
			</svg>
			{#each LINES as line (line.id)}
				{@const at = line.place ? PLACES[line.place] : null}
				{#if at && builtShare(line, year) > 0}
					{@const lc = pct(at)}
					<button
						type="button"
						class="line-label"
						style:left="{lc.left}%"
						style:top="{lc.top}%"
						onclick={(e) => choose(at, e)}
						onmouseenter={() => (hovered = at)}
					>
						{ko ? koName(line) : line.name}
					</button>
				{/if}
			{/each}
		{/if}

		{#if rivers}
			<!-- clipped to the coastline by the land mask, so no river runs out to sea -->
			<svg
				class="rivers"
				viewBox="0 0 {MAP_VIEWBOX.w} {MAP_VIEWBOX.h}"
				preserveAspectRatio="none"
				style:left="{IMG.left}%"
				style:top="{IMG.top}%"
				style:width="{IMG.width}%"
				style:height="{IMG.height}%"
				aria-hidden="true"
			>
				{#each RIVERS as river (river.id)}
					<polyline points={river.points.map(([x, y]) => `${x},${y}`).join(' ')}>
						<title>{river.name} · {river.korean}</title>
					</polyline>
				{/each}
			</svg>
			{#if open && riverNames}
				{#each RIVERS as river (river.id)}
					{@const rc = pct({ x: river.labelAt[0], y: river.labelAt[1] })}
					<span class="river-label" style:left="{rc.left}%" style:top="{rc.top}%" aria-hidden="true">
						{ko ? koName(river) : river.name}
					</span>
				{/each}
			{/if}
		{/if}

		<!-- every named site; labels only once the map is opened -->
		{#each visible as p (p.id)}
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
						{#if ko}
							{koName(p) ?? mapLabel(p)}
						{:else}
							{#if p.capital && p.korean}<b class="ko">{koName(p)}</b>{/if}
							{mapLabel(p)}
						{/if}
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
				? ko
					? '장소를 누르면 소개가 열립니다 · 끌어서 이동 · 두 손가락으로 확대'
					: 'Tap a place for its profile · drag to pan · pinch to zoom'
				: ko
					? '장소를 누르면 소개가 열립니다 · 바깥을 누르면 닫힙니다'
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
		<div
			class="frame"
			class:zoomed={zoom > 1}
			role="group"
			aria-label={ko ? '삼한 지도' : 'Map of Samhan'}
			onpointerdown={framePointerDown}
			onpointermove={framePointerMove}
			onpointerup={framePointerUp}
			onpointercancel={framePointerUp}
			{@attach zoomable}
			{@attach centreSheet}
		>
			<!-- Pointer proximity drives hover; each pin is still its own button for keyboard and touch. -->
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div
				class="sheet"
				class:near={!!hovered}
				style:width="{zoom * 100}%"
				onpointermove={sheetMove}
				onpointerleave={sheetLeave}
				onclick={sheetClick}
			>
				<div class="wide">
					<div
						class="wide-canvas"
						style:left="{VIEW_IN_WIDE.left}%"
						style:top="{VIEW_IN_WIDE.top}%"
						style:width="{VIEW_IN_WIDE.width}%"
						style:height="{VIEW_IN_WIDE.height}%"
					>
						{@render mapBody()}
					</div>
				</div>
			</div>
		</div>
		<div class="zoom">
			<button type="button" onclick={() => zoomTo(zoom * 1.5)} disabled={zoom >= ZOOM_MAX} aria-label={ko ? '확대' : 'Zoom in'}>+</button>
			<button type="button" onclick={() => zoomTo(zoom / 1.5)} disabled={zoom <= ZOOM_MIN} aria-label={ko ? '축소' : 'Zoom out'}>−</button>
			<button type="button" onclick={recentre} aria-label={ko ? '원래 위치로' : 'Re-center map'}>⟲</button>
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
				<span class="pl-name" style:--c={KINGDOMS[shown.side].color}>{ko ? (shown.korean ?? shown.name) : shown.name}</span>
				{#if shown.korean && !ko}<span class="pl-ko">{shown.korean}</span>{/if}
			</button>
			{#if open}<span class="pl-blurb">{shown.blurb}</span>{/if}
			{#if open}
				{@render hint(
					ko
						? pageMode
							? '장소를 누르면 소개가 열립니다'
							: '장소를 누르면 소개가 열립니다 · Esc로 닫기'
						: pageMode
							? 'Click a place for its profile'
							: 'Click a place for its profile · Esc to close'
				)}
			{/if}
		{:else if open}
			{@render hint(
				ko
					? pageMode
						? '장소에 마우스를 올리면 설명이 보입니다 · 스크롤로 확대 · 끌어서 이동'
						: '장소에 마우스를 올리면 설명이 보입니다 · 누르면 소개 · Esc로 닫기'
					: pageMode
						? 'Hover a place to read about it · scroll to zoom · drag to pan'
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

	/* a wall still going up: lighter, finer dashes */
	.lines polyline.building {
		stroke-dasharray: 2 3;
		stroke-opacity: 0.5;
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

	/* the great rivers: thin solid blue under the markers, only over land */
	.rivers {
		position: absolute;
		pointer-events: none;
		mask: url('/map-land.svg') 0 0 / 100% 100% no-repeat;
		-webkit-mask: url('/map-land.svg') 0 0 / 100% 100% no-repeat;
	}

	.rivers polyline {
		fill: none;
		stroke: #6aa8d8;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
		stroke-opacity: 0.85;
	}

	:global(html[data-theme='light']) .rivers polyline {
		stroke: #2f74b5;
		stroke-width: 2;
	}

	:global(html[data-theme='light']) .river-label {
		color: #245f96;
		text-shadow:
			0 1px 2px rgba(255, 253, 248, 0.95),
			0 0 6px rgba(255, 253, 248, 0.9);
	}

	.line-label {
		position: absolute;
		z-index: 2;
		translate: -50% -160%;
		margin: 0;
		padding: 0.05rem 0.3rem;
		border: 1px dashed color-mix(in srgb, var(--ink) 55%, transparent);
		border-radius: 3px;
		background: var(--ink-halo);
		font: inherit;
		font-size: 0.56rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--ink);
		cursor: pointer;
	}

	.line-label:hover {
		color: var(--gold);
	}

	/* ————— zoom (map page) ————— */
	.map.page .frame {
		aspect-ratio: var(--map-aspect);
		overflow: hidden;
		touch-action: none;
		cursor: grab;
	}

	.map.page .frame:active {
		cursor: grabbing;
	}

	.map.page .sheet {
		flex: none;
	}

	/* The wide window: the frame's own shape, the sheet's window placed inside it. */
	.wide {
		position: relative;
		aspect-ratio: var(--map-aspect);
		overflow: hidden;
	}

	.wide-canvas {
		position: absolute;
	}

	.wide .canvas {
		overflow: visible;
	}

	/* The sheet's coast is finer than Natural Earth's: fade its edges into the outer land. */
	img.inner {
		--fade: linear-gradient(to right, transparent, #000 2.5%, #000 97.5%, transparent);
		-webkit-mask-image: var(--fade), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent);
		-webkit-mask-composite: source-in;
		mask-image: var(--fade), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent);
		mask-composite: intersect;
	}

	.zoom {
		position: absolute;
		top: 1.3rem;
		right: 1.3rem;
		z-index: 5;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.zoom button {
		width: 1.8rem;
		height: 1.8rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 4px;
		background: var(--glass);
		backdrop-filter: blur(8px);
		color: var(--fg-strong);
		font: inherit;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
	}

	.zoom button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.river-label {
		position: absolute;
		translate: 4px -50%;
		font-size: 0.58rem;
		font-style: italic;
		letter-spacing: var(--tracking-micro);
		white-space: nowrap;
		color: rgba(143, 195, 232, 0.9);
		text-shadow:
			0 1px 3px #000,
			0 0 8px #000;
		pointer-events: none;
		opacity: 0;
		animation: labelIn 0.5s var(--ease) forwards;
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

	/* the flag's pole stands on the glyph's top edge */
	.flagpost {
		position: absolute;
		left: 0;
		top: -4px;
		width: 0;
		height: 0;
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

	/* Capitals are stars, readable even on the closed sheet. */
	.glyph.star {
		width: 9px;
		height: 9px;
		opacity: 1;
		stroke-width: 1.2;
	}

	.map.open .pin.capital .glyph.star {
		width: 14px;
		height: 14px;
		box-shadow: none;
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

		/* The page map opens at 2× so labels stop colliding; drag pans it. */
		.map.page .frame {
			max-height: 68dvh;
			border-radius: calc(var(--radius) - 2px);
		}

		.map.page .label {
			font-size: 0.66rem;
		}
	}
</style>
