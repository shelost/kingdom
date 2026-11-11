<script lang="ts">
	/**
	 * The map, flat: the same painted known world and the same relief as the 3D map
	 * (cosmosLayer.ts, worldRelief.ts), in every frame from the peninsula out to the
	 * cosmos. It fills its box; each frame paints well past what it fits, so the ground
	 * reaches every edge. Scope chips reframe. The wheel zooms, and past the zoom floor
	 * the frame steps out (Samhan → Sphere → World → Cosmos). Zooming in stays on the
	 * frame and brings a sharper peninsula, then city names, then the stage models.
	 */
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { holdingsAt, realmsAt, settledYear } from '$lib/borders';
	import { polityBanner } from '$lib/banners';
	import {
		SAMHAN_GOLD_YEAR,
		SAMHAN_LINE,
		fishEye,
		scopeFrame,
		setCosmosSplit,
		setFishEye,
		type CosmosLayout,
		type CosmosScope,
		type FishEyeId,
		type SheetBox
	} from '$lib/cosmos';
	import {
		samhanBox,
		biomeMotes,
		labelOn,
		labelsAt,
		loadCosmos,
		paintCosmos,
		paintSamhanLine,
		paintSamhanStates,
		paintWidth,
		uncrowded,
		type CosmosData
	} from '$lib/cosmosLayer';
	import {
		LOD,
		featherInset,
		insetAlpha,
		keepRoom,
		modelCandidate,
		screenDist,
		showPill,
		showPlace,
		showRealm,
		showRiver
	} from '$lib/mapLod';
	import { MAP_TERRAIN, mapPalette } from '$lib/mapTerrain';
	import { MAP_MARKERS, RIVERS, mapLabel, type Place, type PlaceKind } from '$lib/places';
	import { pillLabel, stagePills } from '$lib/stage/placeStage';
	import { siteFlag, type StageSite } from '$lib/stage/sites';
	import { loadWorldDem, reliefFor, reliefPaint, type WorldDem } from '$lib/worldRelief';
	import CosmosName from '$lib/components/diagrams/three/scenes/map/CosmosName.svelte';
	import { openProfile } from '$lib/profiles.svelte';
	import { byId } from '$lib/people';
	import { PLACES } from '$lib/places';
	import { reading } from '$lib/reading.svelte';

	const ORDER: CosmosScope[] = ['samhan', 'sphere', 'world', 'cosmos'];

	let {
		year,
		ko = false,
		scope,
		layout = 'circles',
		rulers = false,
		labels = true,
		fish = 'mid',
		rivers = true,
		detail = true,
		kinds = [],
		hovered = $bindable(null),
		onpick,
		onscope,
		terrain = true,
		washes = true,
		peoples = true,
		nature = true,
		mythic = true,
		split = 1,
		onwiki,
		ondive,
		onenter,
		road
	}: {
		year: number;
		ko?: boolean;
		scope: CosmosScope;
		layout?: CosmosLayout;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Show civilization and myth names. */
		labels?: boolean;
		/** Live fish-eye strength — changing it rebuilds the paint. */
		fish?: FishEyeId;
		/** The peninsula frame's rivers and their names. */
		rivers?: boolean;
		/** Statelet shades and commanderies in the realm names. */
		detail?: boolean;
		/** Place kinds whose markers show on the peninsula frame. */
		kinds?: PlaceKind[];
		/** The place under the pointer (the page's preview). */
		hovered?: Place | null;
		/** A place marker was clicked. */
		onpick?: (p: Place) => void;
		/** Step the frame out or in when the wheel passes the zoom floor / ceiling. */
		onscope?: (s: CosmosScope) => void;
		/** Relief tint and hillshade; off, the painted map alone. */
		terrain?: boolean;
		/** Civilization / Ten Peoples / Ten Hells colour washes. */
		washes?: boolean;
		/** Cosmos sheets. */
		peoples?: boolean;
		nature?: boolean;
		mythic?: boolean;
		/** 0 = HEK's Beginning (one circle), 1 = the split cosmos. Animated by the page. */
		split?: number;
		/** A name opens the wiki. Falls back to the profile card. */
		onwiki?: (id: string) => void;
		/** The view has come down on a stage model, or pulled back off it. */
		ondive?: (site: StageSite | null) => void;
		/** A pill was clicked. */
		onenter?: (site: StageSite) => void;
		/** A cord on the sheet. `here` is the stop this frame is standing on. */
		road?: { here: number; points: { x: number; y: number }[] };
	} = $props();

	let light = $state(false);
	let data = $state.raw<CosmosData | null>(null);
	let dem = $state.raw<WorldDem | null>(null);
	let sheet = $state<HTMLCanvasElement>();
	let gold = $state<HTMLCanvasElement>();
	let host = $state<HTMLDivElement>();
	let width = $state(0);
	let height = $state(0);

	/** Pan / zoom inside the current frame, in host pixels. */
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let dragging = $state(false);
	let lastX = 0;
	let lastY = 0;

	/** Smooth scope reframes — the same 1.4 s glide as the 3D KitRig. Fish-eye does not move this. */
	const flatten = (b: SheetBox) => [b.x, b.y, b.w, b.h];
	let framed = false;
	const framing = new Tween(flatten({ x: 0, y: 0, w: 1, h: 1 }), {
		duration: 1400,
		easing: cubicInOut
	});
	/** Scope changes reframe. A fish-eye change keeps the pan, the zoom and this window. */
	let frameKey = '';
	$effect(() => {
		setFishEye(fish);
		if (frameKey === scope) return;
		frameKey = scope;
		const target = flatten(scopeFrame(scope).fit);
		framing.set(target, framed ? undefined : { duration: 0 });
		framed = true;
		zoom = 1;
		panX = 0;
		panY = 0;
	});
	const box = $derived({
		x: framing.current[0],
		y: framing.current[1],
		w: framing.current[2],
		h: framing.current[3]
	} as SheetBox);

	/** Contain-fit of the framed box: pixels per sheet unit, and the box's top-left in the host. */
	const view = $derived.by(() => {
		const s = width && height ? Math.min(width / box.w, height / box.h) : 0;
		return { s, ox: (width - box.w * s) / 2, oy: (height - box.h * s) / 2 };
	});
	/** Sheet units → pixels on the (unzoomed) stage. */
	const stageAt = (x: number, y: number): [number, number] => [view.ox + (x - box.x) * view.s, view.oy + (y - box.y) * view.s];
	/** Sheet units → host pixels, after the reader's pan and zoom (labels stay crisp at any zoom). */
	const hostAt = (x: number, y: number): [number, number] => {
		const [sx, sy] = stageAt(x, y);
		return [panX + sx * zoom, panY + sy * zoom];
	};
	const rect = (b: SheetBox) => {
		const [left, top] = stageAt(b.x, b.y);
		return { left: `${left}px`, top: `${top}px`, width: `${b.w * view.s}px`, height: `${b.h * view.s}px` };
	};

	onMount(() => {
		const root = document.documentElement;
		const read = () => (light = root.dataset.theme === 'light');
		read();
		const obs = new MutationObserver(read);
		obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});

	$effect(() => {
		let gone = false;
		loadCosmos().then(
			(d) => {
				if (!gone) data = d;
			},
			() => {}
		);
		loadWorldDem().then(
			(e) => {
				if (!gone) dem = e;
			},
			() => {}
		);
		return () => {
			gone = true;
		};
	});

	const pal = $derived(mapPalette(light));
	const wide = $derived(scope !== 'samhan');
	const sheets = $derived({ peoples, nature, myth: mythic });
	const shown = $derived.by(() => {
		setCosmosSplit(split);
		if (!(labels && wide)) return [];
		return labelsAt(data, year, scope, layout, true, rulers).filter((l) => scope !== 'cosmos' || labelOn(l, sheets));
	});
	const motes = biomeMotes();

	/** The frame the canvas holds now (set as it is painted, so it never shows at another frame's place). */
	let painted = $state.raw<SheetBox | null>(null);
	const paintRect = $derived(painted ? rect(painted) : null);
	/** Pixels on the frame's long side: enough for the host at its density, in steps so a resize rarely repaints. */
	const long = $derived.by(() => {
		setFishEye(fish);
		const { fit, frame } = scopeFrame(scope);
		const dpr = Math.min(2, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);
		const need = Math.max(width, height) * dpr * Math.max(frame.w / fit.w, frame.h / fit.h);
		return Math.min(3072, Math.max(1024, Math.ceil(need / 512) * 512));
	});

	$effect(() => {
		setFishEye(fish);
		if (!sheet || !data || !width) return;
		const { frame } = scopeFrame(scope);
		setCosmosSplit(split);
		paintCosmos(sheet, data, {
			year,
			pal,
			light,
			width: paintWidth(frame, long),
			layout,
			scope,
			frame,
			relief: terrain && dem ? reliefPaint(reliefFor(data, dem, scope, layout), light) : null,
			shade: 1,
			rivers,
			washes,
			peoples: scope === 'cosmos' ? peoples : true,
			nature: scope === 'cosmos' ? nature : true,
			/** Myth fringe (five eastern lands, approach, path dots) is cosmos-only. */
			mythic: scope === 'cosmos' ? mythic : false,
			split
		});
		painted = frame;
	});

	$effect(() => {
		setFishEye(fish);
		if (!gold || !data || scope === 'samhan') return;
		/**
		 * Cosmos: paint kingdom colours on the high-res Samhan overlay (the gold
		 * halo would otherwise swallow a 20-px peninsula). Nearer scopes keep the line.
		 */
		if (scope === 'cosmos') {
			paintSamhanStates(gold, data, year);
			return;
		}
		paintSamhanLine(gold, data, SAMHAN_GOLD_YEAR, SAMHAN_LINE[scope], light);
	});
	const goldBox = $derived.by(() => {
		setFishEye(fish);
		return samhanBox();
	});

	let closeup = $state<HTMLCanvasElement>();
	let closeupArmed = $state(false);
	const detailBox = $derived.by(() => {
		setFishEye(fish);
		return scopeFrame('samhan').frame;
	});

	/* —— the peninsula frame's own names: realms, places, rivers —— */

	const settled = $derived(settledYear(year));
	const inSheet = (x: number, y: number) =>
		x >= MAP_TERRAIN.x && x <= MAP_TERRAIN.x + MAP_TERRAIN.w && y >= MAP_TERRAIN.y && y <= MAP_TERRAIN.y + MAP_TERRAIN.h;
	/** Sheet units across the view. Smaller as the reader zooms in. */
	const span = $derived(view.s ? width / (view.s * zoom) : 1e9);
	const detailAlpha = $derived(scope === 'samhan' ? 0 : insetAlpha(span));
	$effect(() => {
		if (detailAlpha > 0) closeupArmed = true;
	});
	$effect(() => {
		setFishEye(fish);
		if (!closeup || !data || !closeupArmed || scope === 'samhan') return;
		const frame = scopeFrame('samhan').frame;
		const changed = paintCosmos(closeup, data, {
			year,
			pal,
			light,
			width: paintWidth(frame, 2048),
			layout,
			scope: 'samhan',
			frame,
			relief: terrain && dem ? reliefPaint(reliefFor(data, dem, 'samhan', layout), light) : null,
			shade: 1,
			rivers,
			washes
		});
		if (changed) featherInset(closeup);
	});
	/** Wide names step aside once the peninsula's own names cover that ground. */
	const covered = (xy: [number, number]) => {
		if (detailAlpha < 0.55) return false;
		const b = scopeFrame('samhan').fit;
		return xy[0] > b.x - 30 && xy[0] < b.x + b.w + 30 && xy[1] > b.y - 30 && xy[1] < b.y + b.h + 30;
	};
	/** Flat peninsula points, fish-eyed once per frame change. */
	const near = $derived.by(() => {
		setFishEye(fish);
		return {
			realms: realmsAt(settled, holdingsAt(settled), detail)
				.filter((r) => inSheet(r.x, r.y))
				.map((r) => ({ ...r, xy: fishEye(r.x, r.y), flag: r.minor ? null : polityBanner(r.polity, settled).src })),
			places: MAP_MARKERS.filter((p) => kinds.includes(p.kind) && inSheet(p.x, p.y)).map((p) => ({
				p,
				xy: fishEye(p.x, p.y),
				name: ko ? (p.korean ?? p.name) : mapLabel(p)
			})),
			rivers: rivers ? RIVERS.map((r) => ({ id: r.id, name: ko ? r.korean : r.name, xy: fishEye(...r.labelAt) })) : [],
			pills: (() => {
				const list = stagePills();
				const names = pillLabel(list, ko);
				return list.map((p) => {
					const flag = siteFlag(p.site, p.site.timeless ? undefined : year);
					return {
						...p,
						xy: p.where === 'sheet' ? fishEye(p.x, p.y) : ([p.x, p.y] as [number, number]),
						name: names.get(p.site.id) ?? p.site.en,
						color: flag.color
					};
				});
			})()
		};
	});
	const pillIds = $derived(new Set(near.pills.map((p) => p.placeId)));
	const pillsOn = $derived(showPill(scope, span));
	const realmsOn = $derived(showRealm(scope, span));
	const riversOn = $derived(showRiver(scope, span));
	/** Whether a host point is on screen (with room for a label). */
	const onScreen = ([x, y]: [number, number]) => x > -80 && y > -40 && x < width + 80 && y < height + 40;
	let names = $state<HTMLDivElement>();
	/** The names' font size, which follows the viewport. */
	const namePx = $derived.by(() => {
		void width;
		return names ? parseFloat(getComputedStyle(names).fontSize) || 11 : 11;
	});
	/** Peninsula names with room at this zoom. Stage pills win a collision. */
	const room = $derived.by(() => {
		const items: { key: string; at: [number, number] | null; w: number; h: number; rank: number }[] = [];
		if (realmsOn) {
			for (const r of near.realms) {
				const at = hostAt(...r.xy);
				items.push({ key: `realm:${r.key}`, at: onScreen(at) ? at : null, w: r.minor ? 72 : 120, h: 18, rank: 1 });
			}
		}
		if (pillsOn) {
			for (const p of near.pills) {
				const at = hostAt(...p.xy);
				items.push({ key: `pill:${p.site.id}`, at: onScreen(at) ? at : null, w: 112, h: 28, rank: 0 });
			}
		}
		for (const { p, xy } of near.places) {
			if (pillsOn && pillIds.has(p.id)) continue;
			if (!showPlace(scope, span, !!p.capital)) continue;
			const at = hostAt(...xy);
			items.push({ key: p.id, at: onScreen(at) ? at : null, w: p.capital ? 88 : 70, h: 16, rank: p.capital ? 1 : 2 });
		}
		return keepRoom(items);
	});

	let held: string | null = null;
	let told = '';
	$effect(() => {
		const points = pillsOn
			? near.pills.map((p) => {
					const at = hostAt(...p.xy);
					return { id: p.site.id, dist: screenDist(at[0], at[1], width, height) };
				})
			: [];
		const next = modelCandidate(held, points, span);
		held = next;
		const id = next ?? '';
		if (id === told) return;
		told = id;
		ondive?.(next ? (near.pills.find((p) => p.site.id === next)?.site ?? null) : null);
	});

	function enterPill(p: (typeof near.pills)[number], at: [number, number]) {
		if (view.s) {
			const next = Math.min(64, Math.max(zoom, width / (view.s * LOD.model)));
			const k = next / zoom;
			panX = at[0] - (at[0] - panX) * k;
			panY = at[1] - (at[1] - panY) * k;
			zoom = next;
			clampPan();
		}
		onenter?.(p.site);
	}

	/** The names with room at this zoom; crowded ones wait for the reader to zoom in. */
	const roomy = $derived(
		uncrowded(
			shown,
			(l) => {
				const at = hostAt(...l.xy);
				return onScreen(at) ? at : null;
			},
			ko,
			namePx
		)
	);

	function openLabel(wiki: string) {
		if (onwiki) {
			onwiki(wiki);
			return;
		}
		if (byId.has(wiki)) openProfile(wiki, year);
		else if (PLACES[wiki]) reading.place = wiki;
	}

	/* —— pan and zoom —— */

	/** Keep the painted frame over the whole host when it can cover it, and inside it when it cannot. */
	function clampPan() {
		const f = painted;
		if (!f || !view.s) return;
		const [left, top] = stageAt(f.x, f.y);
		const fw = f.w * view.s * zoom;
		const fh = f.h * view.s * zoom;
		const ax = -left * zoom;
		const bx = width - left * zoom - fw;
		const ay = -top * zoom;
		const by = height - top * zoom - fh;
		panX = Math.min(Math.max(ax, bx), Math.max(Math.min(ax, bx), panX));
		panY = Math.min(Math.max(ay, by), Math.max(Math.min(ay, by), panY));
	}

	function onWheel(e: WheelEvent) {
		if (!host) return;
		e.preventDefault();
		const out = e.deltaY > 0;
		const i = ORDER.indexOf(scope);
		/* Past the floor: step the frame out. Zooming in stays here and adds detail. */
		if (out && zoom <= 0.86 && i < ORDER.length - 1 && onscope) {
			onscope(ORDER[i + 1]!);
			return;
		}
		const r = host.getBoundingClientRect();
		const mx = e.clientX - r.left;
		const my = e.clientY - r.top;
		const next = Math.min(64, Math.max(0.85, zoom * (out ? 1 / 1.12 : 1.12)));
		const k = next / zoom;
		panX = mx - (mx - panX) * k;
		panY = my - (my - panY) * k;
		zoom = next;
		clampPan();
	}

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0 || (e.target as HTMLElement).closest('button, a, [role="button"]')) return;
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		panX += e.clientX - lastX;
		panY += e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		clampPan();
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={['sheet', { dragging }]}
	bind:this={host}
	bind:clientWidth={width}
	bind:clientHeight={height}
	onwheel={onWheel}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	role="img"
	aria-label={ko ? '지도' : 'Map'}
>
	<div class="stage" style:transform="translate({panX}px, {panY}px) scale({zoom})">
		<canvas
			bind:this={sheet}
			class="paint"
			style:left={paintRect?.left}
			style:top={paintRect?.top}
			style:width={paintRect?.width}
			style:height={paintRect?.height}
			style:visibility={paintRect ? null : 'hidden'}
		></canvas>
		{#if wide}
			{@const d = rect(detailBox)}
			<canvas
				bind:this={closeup}
				class="detail"
				style:left={d.left}
				style:top={d.top}
				style:width={d.width}
				style:height={d.height}
				style:opacity={detailAlpha}
			></canvas>
			{@const g = rect(goldBox)}
			<canvas bind:this={gold} class={['gold', { states: scope === 'cosmos' }]} style:left={g.left} style:top={g.top} style:width={g.width} style:height={g.height}></canvas>
		{/if}
		{#if road && road.points.length > 1 && width && height}
			{@const walked = road.points.slice(0, road.here + 1)}
			{@const ahead = road.points.slice(road.here)}
			{@const line = (pts: { x: number; y: number }[]) => pts.map((p) => stageAt(p.x, p.y).join(',')).join(' ')}
			<svg class="cord" viewBox="0 0 {width} {height}" aria-hidden="true">
				{#if ahead.length > 1}<polyline class="ahead" points={line(ahead)} />{/if}
				{#if walked.length > 1}<polyline class="walked" points={line(walked)} />{/if}
				{#each walked as p, i (i)}
					{@const [cx, cy] = stageAt(p.x, p.y)}
					<circle {cx} {cy} r={i === road.here ? 5.5 : 3.2} class:here={i === road.here} />
				{/each}
			</svg>
		{/if}
		{#if scope === 'world' || scope === 'cosmos'}
			<div class="motes" aria-hidden="true">
				{#each motes as m (m.key)}
					{@const mp = stageAt(...m.xy)}
					<span class={['mote', m.kind]} style:left="{mp[0]}px" style:top="{mp[1]}px" style:--delay="{m.delay}s" style:--dur="{m.dur}s"></span>
				{/each}
			</div>
		{/if}
	</div>

	<div class="names" bind:this={names}>
		{#snippet cosmosName(l: (typeof shown)[number])}
			<CosmosName
				han={l.han}
				ko={l.ko}
				en={l.en}
				epithet={l.epithet}
				standing={l.standing}
				ruler={l.ruler}
				lines={l.lines}
				sea={l.sea}
				myth={l.myth}
				realm={l.realm}
				home={l.home}
				reach={l.protectorate}
				sub={l.sub}
				native={l.native}
				icon={l.icon}
				mark={l.mark}
				color={l.color}
				kind={l.kind}
				tint={l.tint}
				night={l.night}
				uiKo={ko}
			/>
		{/snippet}
		{#each shown as l (l.key)}
			{@const wiki = l.nation && byId.has(l.nation) ? l.nation : byId.has(l.id) ? l.id : PLACES[l.id] ? l.id : PLACES[l.nation ?? ''] ? l.nation : null}
			{@const at = hostAt(...l.xy)}
			{#if roomy.has(l.key) && !covered(l.xy)}
				{#if wiki}
					<button
						type="button"
						class="at link"
						style:left="{at[0]}px"
						style:top="{at[1]}px"
						onclick={(e) => {
							e.stopPropagation();
							openLabel(wiki);
						}}
					>
						{@render cosmosName(l)}
					</button>
				{:else}
					<div class="at" style:left="{at[0]}px" style:top="{at[1]}px">{@render cosmosName(l)}</div>
				{/if}
			{/if}
		{/each}

		{#each near.rivers as r (r.id)}
			{@const at = hostAt(...r.xy)}
			{#if riversOn && onScreen(at)}
				<span class="at river" style:left="{at[0]}px" style:top="{at[1]}px">{r.name}</span>
			{/if}
		{/each}

		{#each near.realms as r (r.key)}
			{@const at = hostAt(...r.xy)}
			{#if room.has(`realm:${r.key}`)}
				<span class={['at', 'realm', { small: r.minor }]} style:left="{at[0]}px" style:top="{at[1]}px" style:--c={r.color}>
					{#if r.flag}<img class="flag" src={r.flag} alt="" decoding="async" />{/if}
					<span class="name">{ko ? r.korean || r.label : r.label}</span>
				</span>
			{/if}
		{/each}

		{#each near.pills as p (p.site.id)}
			{@const at = hostAt(...p.xy)}
			{#if room.has(`pill:${p.site.id}`)}
				<button
					type="button"
					class="model-pill"
					style:left="{at[0]}px"
					style:top="{at[1]}px"
					style:--c={p.color}
					title={ko ? `${p.name} 모형` : `${p.name} model`}
					onclick={(e) => {
						e.stopPropagation();
						enterPill(p, at);
					}}
				>
					<span class="material-symbols-outlined" aria-hidden="true">view_in_ar</span>{p.name}
				</button>
			{/if}
		{/each}

		{#each near.places as { p, xy, name } (p.id)}
			{@const at = hostAt(...xy)}
			{#if room.has(p.id)}
				<button
					type="button"
					class={['place', { capital: p.capital, on: hovered?.id === p.id }]}
					style:left="{at[0]}px"
					style:top="{at[1]}px"
					title={name}
					onpointerenter={() => (hovered = p)}
					onfocus={() => (hovered = p)}
					onclick={() => onpick?.(p)}
				>
					<i></i><span>{name}</span>
				</button>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	.sheet {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: var(--radius);
		background: transparent;
		touch-action: none;
		cursor: grab;
		&.dragging {
			cursor: grabbing;
		}
	}

	.stage {
		position: absolute;
		inset: 0;
		transform-origin: 0 0;
		will-change: transform;
	}

	.cord {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		& polyline {
			fill: none;
			stroke: #e23b3a;
			stroke-width: 2.4;
			stroke-linejoin: round;
			stroke-linecap: round;
		}
		& .ahead {
			opacity: 0.35;
		}
		& circle {
			fill: #e23b3a;
			stroke: #1a120c;
			stroke-width: 1;
		}
		& .here {
			fill: #f2c14e;
			stroke: #e23b3a;
			stroke-width: 1.6;
		}
	}

	.paint,
	.gold,
	.detail {
		position: absolute;
		max-width: none;
		pointer-events: none;
	}

	.paint {
		transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.detail {
		opacity: 0;
	}

	.gold {
		mix-blend-mode: screen;
		&.states {
			mix-blend-mode: normal;
			opacity: 0.88;
		}
		:global(html[data-theme='light']) & {
			mix-blend-mode: multiply;
		}
	}

	:global(html[data-theme='light']) .gold.states {
		mix-blend-mode: normal;
		opacity: 0.9;
	}

	.motes {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.mote {
		position: absolute;
		border-radius: 50%;
		opacity: 0;
		animation: var(--dur) ease-in-out var(--delay) infinite;
		&.snow {
			width: 3px;
			height: 3px;
			background: #fff;
			box-shadow: 0 0 3px rgb(255 255 255 / 0.8);
			animation-name: snowfall;
		}
		&.sand {
			width: 9px;
			height: 2px;
			border-radius: 2px;
			background: linear-gradient(90deg, transparent, #fbe7b4, transparent);
			animation-name: drift;
		}
		&.leaf {
			width: 3px;
			height: 3px;
			background: #e8ff9a;
			box-shadow: 0 0 5px 1px rgb(214 255 120 / 0.75);
			animation-name: firefly;
		}
	}

	@keyframes snowfall {
		0% {
			opacity: 0;
			transform: translate(0, -6px);
		}
		25% {
			opacity: 0.85;
		}
		100% {
			opacity: 0;
			transform: translate(3px, 10px);
		}
	}

	@keyframes drift {
		0% {
			opacity: 0;
			transform: translateX(-8px);
		}
		40% {
			opacity: 0.7;
		}
		100% {
			opacity: 0;
			transform: translateX(12px);
		}
	}

	@keyframes firefly {
		0%,
		100% {
			opacity: 0;
			transform: translate(0, 0);
		}
		50% {
			opacity: 0.9;
			transform: translate(2px, -4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mote {
			animation: none;
			opacity: 0.5;
		}
	}

	.names {
		position: absolute;
		inset: 0;
		pointer-events: none;
		font-size: clamp(0.52rem, 0.85vw, 0.7rem);
	}

	.at {
		position: absolute;
		transform: translate(-50%, -50%);
		&.link {
			padding: 0;
			border: 0;
			background: none;
			color: inherit;
			font: inherit;
			pointer-events: auto;
			cursor: pointer;
		}
	}

	.river {
		font-family: var(--serif, serif);
		font-style: italic;
		font-size: 0.95em;
		letter-spacing: 0.04em;
		white-space: nowrap;
		color: #9cc6ec;
		text-shadow: 0 0 4px rgb(0 0 0 / 0.85);
		:global(html[data-theme='light']) & {
			color: #2f6497;
		}
	}

	.realm {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		font-family: var(--sans, inherit);
		font-size: 1.25em;
		font-weight: 700;
		letter-spacing: 0.035em;
		text-transform: uppercase;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 60%, #fff);
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.9);
		& .name {
			opacity: 0.8;
		}
		& .flag {
			height: 0.85em;
			aspect-ratio: 3 / 2;
			border-radius: 1px;
			box-shadow: 0 0 0 0.5px rgb(0 0 0 / 0.4), 0 1px 4px rgb(0 0 0 / 0.55);
		}
		&.small {
			font-size: 0.92em;
			font-weight: 600;
			letter-spacing: 0.02em;
		}
		:global(html[data-theme='light']) & {
			color: color-mix(in srgb, var(--c) 75%, #1a140a);
		}
	}

	.model-pill {
		position: absolute;
		display: inline-flex;
		align-items: center;
		gap: 0.28em;
		padding: 0.28em 0.7em 0.32em;
		border: 1px solid color-mix(in srgb, var(--c, var(--gold)) 70%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--panel, #16161c) 88%, transparent);
		box-shadow: inset 0 -2px 0 var(--c, var(--gold));
		color: var(--fg);
		font: inherit;
		font-weight: 650;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		pointer-events: auto;
		cursor: pointer;
		backdrop-filter: blur(6px);
		& .material-symbols-outlined {
			font-size: 1.05em;
			color: var(--gold);
		}
		&:hover,
		&:focus-visible {
			z-index: 2;
		}
	}

	.place {
		position: absolute;
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		padding: 0.1em 0.25em;
		border: 0;
		border-radius: 4px;
		background: none;
		font: inherit;
		font-size: 1em;
		white-space: nowrap;
		color: var(--fg);
		text-shadow: 0 0 5px var(--bg), 0 0 2px var(--bg);
		transform: translate(-0.4em, -50%);
		pointer-events: auto;
		cursor: pointer;
		& i {
			flex: none;
			width: 0.5em;
			height: 0.5em;
			border-radius: 50%;
			background: var(--fg);
			box-shadow: 0 0 0 1.5px var(--bg);
		}
		&.capital {
			font-weight: 700;
			& i {
				background: var(--gold);
				box-shadow: 0 0 0 1.5px var(--bg), 0 0 0 2.5px var(--gold);
			}
		}
		&:hover,
		&:focus-visible,
		&.on {
			color: var(--gold);
			z-index: 2;
		}
	}
</style>
