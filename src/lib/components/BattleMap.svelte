<script lang="ts">
	import type { Block } from '$lib/story';
	import {
		BATTLES,
		FIELD,
		MEN_PER_DOT,
		fieldDots,
		flagSites,
		heldBy,
		moundAt,
		sideColors,
		strengths,
		unitSpots,
		type ArrowKind,
		type Battle,
		type EventKind,
		type Terrain
	} from '$lib/battles';
	import { PLACES, MAP_SHEET_BOX, MAP_VIEW } from '$lib/places';
	import { reading } from '$lib/reading.svelte';
	import { formatYear } from '$lib/borders';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import { CROSSED_SWORDS, FORT_GLYPH, arrowHead, curveThrough, waveAlong, type Pt } from '$lib/mapPaths';
	import { sideBanner } from '$lib/banners';
	import KitStage from './diagrams/three/KitStage.svelte';
	import { BATTLE_SCENE } from './diagrams/three/scenes';
	import MapFlag from './MapFlag.svelte';

	type BattleBlock = Extract<Block, { kind: 'battle' }>;

	let { block }: { block: BattleBlock } = $props();

	const uid = $props.id();
	/** Seconds per phase when playing straight through. */
	const PHASE_SECONDS = 4.2;
	/** How long a scene in the script takes to march into its phase (the story bar fills with it). */
	const MARCH_SECONDS = 1.6;
	const R = 4.4;

	let b = $derived<Battle | undefined>(BATTLES[block.battle]);
	/** The whole battle with controls (episode end); otherwise one phase as a scene in the script. */
	let full = $derived(!!block.full);
	let ko = $derived(reading.lang === 'ko');
	let start = $derived(Math.max(0, b?.phases.findIndex((p) => p.id === block.phase) ?? 0));

	let index = $state(0);
	let live = $state(false);
	let playing = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	let phase = $derived(b?.phases[Math.min(index, (b?.phases.length ?? 1) - 1)]);
	let palette = $derived(b ? sideColors(b) : new Map<string, string>());
	const colorOf = (sideId: string | undefined) => (sideId && palette.get(sideId)) || '#8a8a94';
	const pct = ([x, y]: Pt) => ({ left: (x / FIELD.w) * 100, top: (y / FIELD.h) * 100 });

	let dots = $derived(b ? fieldDots(b, index).map((d) => ({ ...d, color: colorOf(d.side), on: d.on && live })) : []);

	/** Every walled place, camp, gate and raised mound flies its holder's banner; a capture swaps it between phases. */
	let flags = $derived.by(() => {
		const field = b;
		if (!field) return [];
		const fly = (key: string, side: string | undefined, at: Pt, big: boolean) => {
			const banner = sideBanner(field, side, colorOf(side));
			return banner ? [{ key, banner, big, ...pct(at) }] : [];
		};
		return [
			...flagSites(field).flatMap(({ i, t, at }) => fly(`f${i}`, heldBy(field, t, index), at, t.kind === 'city' || t.kind === 'town')),
			...field.terrain.flatMap((t, i) => {
				if (t.kind !== 'mound') return [];
				const m = moundAt(field, t, index);
				return m.rise > 0 ? fly(`f${i}`, m.hold, t.at, false) : [];
			})
		];
	});

	/** One label per unit on the field, just above its dots. */
	let unitLabels = $derived(
		b && phase
			? unitSpots(b, phase).map(({ unit: u, state: s, cx, top }) => ({
					id: u.id,
					text: ko ? (u.ko ?? u.label) : u.label,
					men: full && !u.unrecorded ? fmt(s.men) : '',
					unrecorded: !!u.unrecorded,
					color: colorOf(u.side),
					routed: !!s.routed,
					...pct([cx, top - 6])
				}))
			: []
	);

	/** Camera azimuth over the 3D ground; dragging the field turns it. 0 = looking north. */
	let az = $state(0);
	let flat = $state(false);
	let drag: { x: number; az: number; w: number } | null = null;
	function grab(e: PointerEvent) {
		if (flat || e.button !== 0) return;
		const el = e.currentTarget as HTMLElement;
		drag = { x: e.clientX, az, w: el.clientWidth || 1 };
		el.setPointerCapture(e.pointerId);
	}
	function turn(e: PointerEvent) {
		if (!drag) return;
		az = Math.max(-1.2, Math.min(1.2, drag.az - ((e.clientX - drag.x) / drag.w) * Math.PI));
	}
	const release = () => (drag = null);

	const ARROW: Record<ArrowKind, { width: number; dash?: string }> = {
		advance: { width: 3.2 },
		charge: { width: 4.6 },
		flank: { width: 3.2 },
		naval: { width: 2.6 },
		retreat: { width: 2.6, dash: '8 6' },
		pursuit: { width: 3, dash: '2 6' },
		feint: { width: 3, dash: '0.5 7' }
	};

	let arrows = $derived.by(() =>
		(phase?.arrows ?? []).flatMap((a, i) => {
			const curve = curveThrough(a.points, { endGap: 13 });
			if (!curve) return [];
			const mid = curve.samples[Math.floor(curve.samples.length / 2)];
			return [
				{
					key: `${phase?.id}:${i}`,
					kind: a.kind,
					color: colorOf(a.side),
					d: a.kind === 'naval' ? waveAlong(curve.samples, 3, 26) : curve.d,
					head: arrowHead(curve.samples, 13),
					label: a.label ? (ko ? (a.ko ?? a.label) : a.label) : undefined,
					mid: pct(mid),
					delay: 0.25 + i * 0.35
				}
			];
		})
	);

	const EVENT: Record<EventKind, string> = {
		clash: '',
		fire: 'M0,-9C4,-4 7,-1 5,4C4,7 1,8 0,8C-1,8 -4,7 -5,4C-7,-1 -2,-3 0,-9Z',
		death: 'M-4.5,-4.5L4.5,4.5M4.5,-4.5L-4.5,4.5',
		gate: 'M-7,7V-3A7,7 0 0 1 7,-3V7M-3,7V0A3,3 0 0 1 3,0V7',
		flood: 'M-9,-3q2.2,-3 4.5,0t4.5,0t4.5,0t4.5,0M-9,3q2.2,-3 4.5,0t4.5,0t4.5,0t4.5,0',
		surrender: 'M-4,8V-8M-4,-8H6L3,-4L6,0H-4',
		ambush: 'M0,-5V1.5M0,4.2V4.6'
	};

	let events = $derived(
		(phase?.events ?? []).map((e, i) => ({
			key: `${phase?.id}:e${i}`,
			...e,
			label: e.label ? (ko ? (e.ko ?? e.label) : e.label) : undefined,
			pos: pct(e.at),
			delay: 0.9 + (phase?.arrows?.length ?? 0) * 0.35 + i * 0.25
		}))
	);

	const closed = (pts: Pt[]) => (curveThrough([...pts, pts[0]])?.d ?? '') + 'Z';
	const open = (pts: Pt[]) => curveThrough(pts)?.d ?? '';

	/** Short ticks down one side of a ridge line, the way an old survey map hachures a crest. */
	function hachures(pts: Pt[]): string {
		const c = curveThrough(pts);
		if (!c) return '';
		let d = '';
		let run = 0;
		for (let i = 1; i < c.samples.length; i++) {
			const [x0, y0] = c.samples[i - 1];
			const [x1, y1] = c.samples[i];
			run += Math.hypot(x1 - x0, y1 - y0);
			if (run < 9) continue;
			run = 0;
			const len = Math.hypot(x1 - x0, y1 - y0) || 1;
			const nx = -(y1 - y0) / len;
			const ny = (x1 - x0) / len;
			d += `M${x1.toFixed(1)},${y1.toFixed(1)}l${(nx * 8).toFixed(1)},${(ny * 8).toFixed(1)}`;
		}
		return d;
	}

	let terrainLabels = $derived(
		(b?.terrain ?? []).flatMap((t: Terrain, i) => {
			if (!t.label || (!full && t.kind === 'label')) return [];
			const area = ['sea', 'lake', 'marsh', 'forest', 'plain', 'town'].includes(t.kind);
			const at: Pt = t.labelAt
				? t.labelAt
				: 'at' in t
					? t.at
					: area
						? [t.points.reduce((a, p) => a + p[0], 0) / t.points.length, t.points.reduce((a, p) => a + p[1], 0) / t.points.length]
						: t.points[Math.floor(t.points.length / 2)];
			const text = ko ? (t.ko ?? t.label) : t.label;
			return [{ key: `t${i}`, text, kind: t.kind, ...pct(at) }];
		})
	);

	let tally = $derived(b && phase ? strengths(b, phase) : {});
	let opening = $derived(b ? strengths(b, b.phases[0]) : {});

	let hasUnrecorded = $derived(!!b?.units.some((u) => u.unrecorded));

	/** The corner locator: a crop of the border map around the battle's place. */
	let locator = $derived.by(() => {
		const p = b?.place ? PLACES[b.place] : undefined;
		if (!p) return null;
		const w = 240;
		const h = 192;
		const x = p.x - w / 2;
		const y = p.y - h / 2;
		return {
			view: {
				left: ((MAP_VIEW.x - x) / w) * 100,
				top: ((MAP_VIEW.y - y) / h) * 100,
				width: (MAP_VIEW.w / w) * 100,
				height: (MAP_VIEW.h / h) * 100
			}
		};
	});

	let scaleBar = $derived(b?.scale ? { w: (b.scale.px / FIELD.w) * 100, km: b.scale.km } : null);

	function go(i: number) {
		if (!b) return;
		index = Math.max(0, Math.min(b.phases.length - 1, i));
	}

	function stop() {
		playing = false;
		clearTimeout(timer);
	}

	function play() {
		if (!b) return;
		if (playing) return stop();
		playing = true;
		if (index >= b.phases.length - 1) index = 0;
		const tick = () => {
			if (!b || index >= b.phases.length - 1) return stop();
			index += 1;
			timer = setTimeout(tick, PHASE_SECONDS * 1000);
		};
		timer = setTimeout(tick, prefersReducedMotion() ? 600 : 1200);
	}

	/** Enter on the phase before the block's own, then move into it, so the first thing seen is movement. */
	function enter() {
		index = full ? 0 : Math.max(0, start - 1);
		live = true;
		if (!full && start > index) timer = setTimeout(() => (index = start), 900);
		return () => clearTimeout(timer);
	}

	$effect(() => () => clearTimeout(timer));

	const fmt = (n: number) => n.toLocaleString('en-US');
</script>

{#if b && phase}
	<figure class="battle" class:full aria-label={`${ko ? b.ko : b.title}, ${phase.label}`}>
		{#if full}
			<header class="whole">
				<span class="kicker">{ko ? '전투 전체' : 'The whole battle'}</span>
				<span class="name">{ko ? b.ko : b.title}{#if b.hanja}<i>{b.hanja}</i>{/if}</span>
			</header>
		{/if}
		<div class="field" {@attach onceInView(enter)}>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="ground" class:turning={!flat} onpointerdown={grab} onpointermove={turn} onpointerup={release} onpointercancel={release}>
				<KitStage scene={BATTLE_SCENE} active={live} {flat} sceneProps={{ battle: b.id, index, ko, az, full }}>
					{#snippet fallback()}
				<svg viewBox="0 0 {FIELD.w} {FIELD.h}" class="map" aria-hidden="true">
					<defs>
						<pattern id="{uid}-marsh" width="14" height="10" patternUnits="userSpaceOnUse">
							<path d="M2,7h5M8,3h4" class="marsh-tick" />
						</pattern>
						<pattern id="{uid}-forest" width="16" height="16" patternUnits="userSpaceOnUse">
							<circle cx="4" cy="5" r="2.2" class="tree" /><circle cx="12" cy="12" r="2.2" class="tree" />
						</pattern>
						{#each arrows as a (a.key)}
							<mask id="{uid}-m-{a.key}" maskUnits="userSpaceOnUse" x="0" y="0" width={FIELD.w} height={FIELD.h}>
								<path d={a.d} pathLength="1" class="reveal" style:--delay="{a.delay}s" />
							</mask>
						{/each}
					</defs>

					{#each b.terrain as t, i (i)}
						{#if t.kind === 'sea' || t.kind === 'lake'}
							<path d={closed(t.points)} class="water" />
						{:else if t.kind === 'marsh'}
							<path d={closed(t.points)} class="marsh" fill="url(#{uid}-marsh)" />
						{:else if t.kind === 'forest'}
							<path d={closed(t.points)} class="forest" fill="url(#{uid}-forest)" />
						{:else if t.kind === 'plain'}
							<path d={closed(t.points)} class="plain" />
						{:else if t.kind === 'town'}
							<path d={closed(t.points)} class="town" />
						{:else if t.kind === 'river'}
							<path d={open(t.points)} class="river" style:stroke-width={t.width ?? 14} />
							<path d={open(t.points)} class="river-core" style:stroke-width={(t.width ?? 14) * 0.35} />
						{:else if t.kind === 'road'}
							<path d={open(t.points)} class="road" />
						{:else if t.kind === 'wall'}
							<path d={open(t.points)} class="wall" style:stroke-width={t.width ?? 5} />
						{:else if t.kind === 'ridge'}
							<path d={open(t.points)} class="ridge" />
							<path d={hachures(t.points)} class="hachure" />
						{:else if t.kind === 'hill'}
							{@const r = t.r ?? 40}
							<g transform="translate({t.at[0]} {t.at[1]})" class="contour">
								<ellipse rx={r} ry={r * 0.62} /><ellipse rx={r * 0.62} ry={r * 0.38} /><ellipse rx={r * 0.28} ry={r * 0.17} />
							</g>
						{:else if t.kind === 'mountain'}
							{@const k = (t.r ?? 30) / 20}
							<g transform="translate({t.at[0]} {t.at[1]}) scale({k})" class="peak">
								<path d="M-22,10L-8,-12L2,2L10,-6L24,10Z" />
								<path d="M-8,-12L-4,-4M10,-6L13,-1" class="snow" />
							</g>
						{:else if t.kind === 'fort' || t.kind === 'city'}
							{@const k = t.kind === 'city' ? 2.4 : 1.8}
							<g transform="translate({t.at[0] - 6 * k} {t.at[1] - 6 * k}) scale({k})" class="fort" style:--c={colorOf(heldBy(b, t, index))}>
								<path d={FORT_GLYPH} />
							</g>
						{:else if t.kind === 'camp'}
							<g transform="translate({t.at[0]} {t.at[1]})" class="camp" style:--c={colorOf(heldBy(b, t, index))}>
								<path d="M-9,6L0,-8L9,6ZM0,-8V6" />
							</g>
						{:else if t.kind === 'gate'}
							<g transform="translate({t.at[0]} {t.at[1]}) scale(1.4)" class="fort" style:--c={colorOf(heldBy(b, t, index))}>
								<path d={EVENT.gate} class="gate" />
							</g>
						{:else if t.kind === 'mound'}
							{@const m = moundAt(b, t, index)}
							{@const r = (t.r ?? 40) * (0.4 + m.rise * 0.6)}
							<g transform="translate({t.at[0]} {t.at[1]})" class="contour mound" style:opacity={m.rise ? 1 : 0.25} style:--c={colorOf(m.hold)}>
								<ellipse rx={r} ry={r * 0.62} /><ellipse rx={r * 0.62 * m.rise} ry={r * 0.38 * m.rise} /><ellipse rx={r * 0.28 * m.rise} ry={r * 0.17 * m.rise} />
							</g>
						{:else if t.kind === 'shrine'}
							<g transform="translate({t.at[0]} {t.at[1]})" class="camp">
								<path d="M-6,5h12v-6h-12zM-9,-1L0,-7L9,-1" />
							</g>
						{/if}
					{/each}

					<g class="dots" class:live>
						{#each dots as d (d.key)}
							<circle
								r={R}
								class="dot"
								class:on={d.on}
								class:routed={d.routed}
								class:unrecorded={d.unrecorded}
								style:--c={d.color}
								style:transform="translate({d.x}px, {d.y}px)"
								style:transition-delay="{d.delay}s"
							/>
						{/each}
					</g>

					{#if live}
						{#key phase.id}
							<g class="arrows">
								{#each arrows as a (a.key)}
									<g class="arrow {a.kind}" style:--c={a.color} style:--delay="{a.delay}s">
										<path d={a.d} class="shaft" mask="url(#{uid}-m-{a.key})" style:stroke-width={ARROW[a.kind].width} style:stroke-dasharray={ARROW[a.kind].dash} />
										<path d={a.head} class="head" />
									</g>
								{/each}
							</g>
							<g class="events">
								{#each events as e (e.key)}
									<g transform="translate({e.at[0]} {e.at[1]})">
										<g class="event {e.kind}" style:--delay="{e.delay}s">
											<circle r="12" class="halo" />
											{#if e.kind === 'clash'}
												<path d={CROSSED_SWORDS} transform="scale(7)" class="glyph swords" />
											{:else}
												<path d={EVENT[e.kind]} class="glyph" />
											{/if}
										</g>
									</g>
								{/each}
							</g>
						{/key}
					{/if}
				</svg>

				<div class="labels" aria-hidden="true">
					{#each flags as f (f.key)}
						<span class="flagpost" style:left="{f.left}%" style:top="{f.top}%"><MapFlag banner={f.banner} size={f.big ? 'md' : 'sm'} /></span>
					{/each}
					{#each terrainLabels as t (t.key)}
						<span class="tlabel {t.kind}" style:left="{t.left}%" style:top="{t.top}%">{t.text}</span>
					{/each}
					{#if live}
						{#each unitLabels as u (u.id)}
							<span class="ulabel" class:routed={u.routed} style:left="{u.left}%" style:top="{u.top}%" style:--c={u.color}>
								{u.text}{#if u.men}<b>{u.men}</b>{/if}
							</span>
						{/each}
						{#key phase.id}
							{#each arrows as a (a.key)}
								{#if full && a.label}
									<span class="alabel" style:left="{a.mid.left}%" style:top="{a.mid.top}%" style:--c={a.color} style:--delay="{a.delay + 0.6}s">{a.label}</span>
								{/if}
							{/each}
							{#each events as e (e.key)}
								{#if full && e.label}
									<span class="elabel" style:left="{e.pos.left}%" style:top="{e.pos.top}%" style:--delay="{e.delay + 0.2}s">{e.label}</span>
								{/if}
							{/each}
						{/key}
					{/if}
				</div>
					{/snippet}
				</KitStage>
			</div>

			<button type="button" class="compass" style:rotate="{flat ? 0 : az}rad" onclick={() => (az = 0)} aria-label={ko ? '북쪽으로' : 'Face north'}>N<i></i></button>
			{#if full}
				<span class="stamp">{formatYear(b.year)}</span>
				<button type="button" class="view" onclick={() => (flat = !flat)} aria-pressed={!flat} aria-label={flat ? (ko ? '입체 지도' : '3D ground') : ko ? '평면 지도' : 'Flat map'}>
					<span class="material-symbols-outlined" aria-hidden="true">{flat ? 'landscape' : 'map'}</span>
				</button>
				{#if scaleBar && (flat || Math.abs(az) < 0.05)}
					<span class="scalebar" style:width="{scaleBar.w}%" aria-hidden="true"><i></i>{scaleBar.km} km</span>
				{/if}
				{#if locator}
					<span class="locator" aria-hidden="true">
						<span
							class="loc-view"
							style:left="{locator.view.left}%"
							style:top="{locator.view.top}%"
							style:width="{locator.view.width}%"
							style:height="{locator.view.height}%"
						>
							<img
								src="/map-base.svg"
								alt=""
								loading="lazy"
								decoding="async"
								style:left="{MAP_SHEET_BOX.left}%"
								style:top="{MAP_SHEET_BOX.top}%"
								style:width="{MAP_SHEET_BOX.width}%"
								style:height="{MAP_SHEET_BOX.height}%"
							/>
						</span>
						<i class="loc-pin"></i>
					</span>
				{/if}
			{/if}

			<!-- Story bars: one per phase; the current one fills while the phase plays. -->
			<div class="stories" style:--phase-s="{full && playing ? PHASE_SECONDS : MARCH_SECONDS}s">
				{#key phase.id}<span class="now">{ko ? phase.ko : phase.label}</span>{/key}
				<div class="track">
					{#if full}
						<button type="button" class="play" onclick={play} aria-label={playing ? 'Pause' : 'Play the battle'}>
							<span class="material-symbols-outlined" aria-hidden="true">{playing ? 'pause' : index === b.phases.length - 1 ? 'replay' : 'play_arrow'}</span>
						</button>
					{/if}
					<ol class="bars">
						{#each b.phases as p, i (p.id)}
							<li>
								{#if full}
									<button
										type="button"
										class:past={i < index}
										class:on={i === index}
										onclick={() => (stop(), go(i))}
										aria-label={ko ? p.ko : p.label}
										aria-current={i === index ? 'step' : undefined}
									>
										{#key `${index}:${playing}`}<i class:run={i === index && live && playing}></i>{/key}
									</button>
								{:else}
									<span class:past={i < index} class:on={i === index}>
										{#key index}<i class:run={i === index && live}></i>{/key}
									</span>
								{/if}
							</li>
						{/each}
					</ol>
				</div>
			</div>
		</div>

		{#if full}
			{#key phase.id}
				<p class="caption" aria-live="polite">{ko ? phase.captionKo : phase.caption}</p>
			{/key}

			<ul class="legend">
				{#each b.sides as s (s.id)}
					{@const now = tally[s.id]}
					{@const then = opening[s.id]}
					<li>
						<span class="swatch" style:--c={colorOf(s.id)}></span>
						{ko ? s.ko : s.name}
						{#if now?.men || !now?.unknown}<b>{fmt(now?.men ?? 0)}</b>{/if}{#if now?.unknown}<b class="unknown">{now.men ? '+ ?' : '?'}</b>{/if}{#if (then?.men ?? 0) !== (now?.men ?? 0)}<s>{fmt(then?.men ?? 0)}</s>{/if}
					</li>
				{/each}
				<li class="rate"><span class="one"></span>= {fmt(MEN_PER_DOT)} {ko ? '명' : 'men'}</li>
				{#if hasUnrecorded}
					<li class="rate"><span class="one hollow"></span>{ko ? '= 규모 미상' : '= size not recorded'}</li>
				{/if}
			</ul>
			<p class="sources">{ko ? '출처' : 'Sources'}: {b.sources.join(' · ')}</p>
		{/if}
	</figure>
{/if}

<style>
	/* Wider than the script column, centred on it, and open at the edges: no frame. */
	.battle {
		--wide: min(1100px, 100vw - 1.5rem);
		width: var(--wide);
		margin: var(--widget-gap) 0 var(--widget-gap) calc(50% - var(--wide) / 2);
		container-type: inline-size;
	}

	.field {
		position: relative;
		aspect-ratio: 1000 / 560;
	}

	.ground {
		position: absolute;
		inset: 0;
	}

	/* The drawing fades out in an ellipse instead of ending at a rectangle; the zoom controls stay sharp. */
	.ground :global(.kit-gl),
	.map,
	.labels {
		-webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 42%, transparent 90%);
		mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 42%, transparent 90%);
	}

	.whole {
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		margin-bottom: 0.25rem;
		text-align: center;
	}

	.whole .kicker {
		font: 600 0.66rem/1 var(--ui);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.whole .name {
		font-family: var(--serif);
		font-size: 1.25rem;
		color: var(--fg-strong);
	}

	.whole .name i {
		margin-left: 0.5em;
		font-style: normal;
		font-size: 0.85em;
		color: var(--fg-faint);
	}

	.map {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		--water: color-mix(in srgb, #4f86b8 34%, transparent);
		--ink: color-mix(in srgb, var(--fg) 46%, transparent);
	}

	:global(html[data-theme='light']) .map {
		--water: color-mix(in srgb, #6d9ec7 38%, transparent);
	}

	.water {
		fill: var(--water);
		stroke: color-mix(in srgb, #6d9ec7 55%, transparent);
		stroke-width: 1.2;
	}

	.plain {
		fill: color-mix(in srgb, var(--gold) 8%, transparent);
	}

	.town {
		fill: color-mix(in srgb, var(--fg) 9%, transparent);
		stroke: var(--ink);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}

	.marsh {
		stroke: color-mix(in srgb, #6d9ec7 40%, transparent);
		stroke-width: 1;
	}

	.marsh-tick {
		stroke: color-mix(in srgb, #6d9ec7 70%, transparent);
		stroke-width: 1.2;
		stroke-linecap: round;
	}

	.tree {
		fill: color-mix(in srgb, #5f8a52 45%, transparent);
	}

	.forest {
		stroke: none;
	}

	.river {
		fill: none;
		stroke: var(--water);
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.river-core {
		fill: none;
		stroke: color-mix(in srgb, #9cc3e4 45%, transparent);
		stroke-linecap: round;
	}

	.road {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.4;
		stroke-dasharray: 5 4;
	}

	.wall {
		fill: none;
		stroke: color-mix(in srgb, var(--fg) 62%, transparent);
		stroke-linecap: square;
	}

	.ridge {
		fill: none;
		stroke: var(--ink);
		stroke-width: 2.2;
		stroke-linecap: round;
	}

	.hachure {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.1;
		opacity: 0.75;
	}

	.contour ellipse {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.1;
	}

	.mound ellipse {
		fill: color-mix(in srgb, #a5875c 18%, transparent);
		stroke: color-mix(in srgb, var(--c) 60%, var(--ink));
		transition: rx 1.2s ease, ry 1.2s ease;
	}

	.peak path {
		fill: color-mix(in srgb, var(--fg) 12%, transparent);
		stroke: var(--ink);
		stroke-width: 1.4;
		stroke-linejoin: round;
	}

	.peak .snow {
		fill: none;
	}

	.fort path,
	.camp path {
		fill: color-mix(in srgb, var(--c) 70%, var(--bg));
		stroke: var(--fg-strong);
		stroke-width: 0.9;
		paint-order: stroke;
	}

	.camp path {
		stroke-width: 1.3;
		fill: color-mix(in srgb, var(--c, var(--fg)) 40%, transparent);
	}

	.fort .gate {
		fill: none;
		stroke: var(--c);
		stroke-width: 1.4;
	}

	.dot {
		opacity: 0;
		transition:
			transform 1.5s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.9s ease;
		stroke: color-mix(in srgb, var(--bg) 70%, transparent);
		stroke-width: 0.8;
	}

	.dot {
		fill: var(--c);
	}

	.dot.on {
		opacity: 0.95;
	}

	.dot.unrecorded {
		fill: color-mix(in srgb, var(--c) 12%, transparent);
		stroke: var(--c);
		stroke-width: 1.4;
		stroke-dasharray: 2.2 1.6;
	}

	.dot.on.routed {
		opacity: 0.5;
	}

	.arrow .shaft {
		fill: none;
		stroke: var(--c);
		stroke-linecap: round;
		stroke-linejoin: round;
		filter: drop-shadow(0 0 2px var(--bg));
	}

	.arrow .head {
		fill: var(--c);
		opacity: 0;
		animation: fade 260ms ease forwards;
		animation-delay: calc(var(--delay) + 1s);
	}

	.reveal {
		fill: none;
		stroke: #fff;
		stroke-width: 22;
		stroke-linecap: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.05s cubic-bezier(0.4, 0, 0.2, 1) forwards;
		animation-delay: var(--delay);
	}

	.event {
		opacity: 0;
		animation: pop 420ms cubic-bezier(0.3, 1.5, 0.5, 1) forwards;
		animation-delay: var(--delay);
	}

	.event .halo {
		fill: color-mix(in srgb, var(--bg) 82%, transparent);
		stroke: var(--gold);
		stroke-width: 1.2;
	}

	.event .glyph {
		fill: none;
		stroke: var(--gold);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.event .glyph.swords {
		stroke-width: 0.26;
	}

	.event.fire .glyph {
		fill: #e8642a;
		stroke: #ffb347;
		stroke-width: 1;
	}

	.event.death .glyph {
		stroke: #d23b3b;
		stroke-width: 2.4;
	}

	.labels {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.labels span {
		position: absolute;
		white-space: nowrap;
		text-shadow:
			0 0 6px var(--bg),
			0 0 2px var(--bg);
	}

	/* the flag's pole stands on top of its fort glyph */
	.flagpost {
		width: 0;
		height: 0;
		translate: 0 -7px;
	}

	.tlabel {
		translate: -50% -50%;
		font-family: var(--serif);
		font-size: 0.7rem;
		font-style: italic;
		color: var(--fg-dim);
	}

	.tlabel.fort,
	.tlabel.city,
	.tlabel.camp,
	.tlabel.gate,
	.tlabel.shrine {
		translate: -50% 0.55rem;
		font-style: normal;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.tlabel.river,
	.tlabel.sea,
	.tlabel.lake {
		color: color-mix(in srgb, #8fbbe0 85%, var(--fg));
		letter-spacing: 0.08em;
	}

	.ulabel {
		translate: -50% -100%;
		display: inline-flex;
		gap: 0.3rem;
		align-items: baseline;
		font-size: 0.66rem;
		font-weight: 700;
		color: color-mix(in srgb, var(--c) 72%, var(--fg-strong));
		transition:
			left 1.5s cubic-bezier(0.45, 0, 0.2, 1),
			top 1.5s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.4s ease;
	}

	.ulabel b {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.ulabel.routed {
		opacity: 0.6;
		font-style: italic;
	}

	.alabel {
		translate: -50% -50%;
		font-size: 0.62rem;
		font-weight: 700;
		font-style: italic;
		color: color-mix(in srgb, var(--c) 70%, var(--fg-strong));
		opacity: 0;
		animation: fade 400ms ease forwards;
		animation-delay: var(--delay);
	}

	.elabel {
		translate: 0.95rem -50%;
		font-size: 0.64rem;
		font-weight: 600;
		color: var(--gold);
		opacity: 0;
		animation: fade 400ms ease forwards;
		animation-delay: var(--delay);
	}

	.stamp {
		position: absolute;
		top: 4%;
		left: 9%;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
		text-shadow: 0 0 8px var(--bg);
	}

	.compass {
		position: absolute;
		top: 4%;
		right: 9%;
		display: grid;
		justify-items: center;
		font: 700 0.6rem/1 var(--ui);
		color: var(--fg-dim);
	}

	button.compass {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		transition: rotate 260ms var(--ease, ease);
	}

	.ground.turning {
		cursor: grab;
		touch-action: pan-y;
	}

	.ground.turning:active {
		cursor: grabbing;
	}

	.compass i {
		width: 1px;
		height: 0.9rem;
		margin-top: 0.15rem;
		background: currentColor;
	}

	.scalebar {
		position: absolute;
		left: 9%;
		bottom: 8%;
		display: grid;
		gap: 0.15rem;
		font: 600 0.58rem/1 var(--ui);
		color: var(--fg-dim);
	}

	.scalebar i {
		height: 0.28rem;
		border: 1px solid currentColor;
		border-top: 0;
	}

	.locator {
		position: absolute;
		right: 8%;
		bottom: 9%;
		width: 13%;
		min-width: 4.5rem;
		aspect-ratio: 240 / 192;
		overflow: hidden;
		border-radius: 3px;
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 25%, transparent);
		background: var(--bg);
	}

	.loc-view {
		position: absolute;
	}

	.loc-view img {
		position: absolute;
		max-width: none;
		filter: invert(1) hue-rotate(180deg) saturate(0.75) brightness(1.1) contrast(1.15);
		opacity: 0.95;
	}

	:global(html[data-theme='light']) .loc-view img {
		filter: none;
		opacity: 0.94;
	}

	.loc-pin {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0.7rem;
		height: 0.55rem;
		translate: -50% -50%;
		border: 1.5px solid var(--gold);
	}

	.view {
		position: absolute;
		top: calc(4% - 0.1rem);
		right: calc(9% + 1.6rem);
		display: grid;
		place-items: center;
		padding: 0.2rem;
		border: 0;
		background: none;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.view .material-symbols-outlined {
		font-size: 1.15rem;
	}

	/* Story bars, bottom centre: past phases full, the current one filling, the rest empty. */
	.stories {
		position: absolute;
		left: 50%;
		bottom: 3%;
		z-index: 4;
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		width: min(26rem, 56%);
		translate: -50% 0;
		pointer-events: none;
	}

	.now {
		font: 600 0.72rem/1.2 var(--ui);
		letter-spacing: 0.04em;
		color: var(--fg-strong);
		text-shadow:
			0 0 8px var(--bg),
			0 0 2px var(--bg);
		animation: fade 380ms ease both;
	}

	.track {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		pointer-events: auto;
	}

	.bars {
		display: flex;
		flex: 1;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bars li {
		flex: 1;
	}

	.bars button,
	.bars span {
		display: block;
		width: 100%;
		height: 3px;
		padding: 0;
		border: 0;
		border-radius: 3px;
		overflow: hidden;
		background: color-mix(in srgb, var(--fg) 22%, transparent);
	}

	.bars button {
		height: 4px;
		cursor: pointer;
		/* a taller hit area than the bar itself */
		box-shadow: 0 0 0 6px transparent;
	}

	.bars i {
		display: block;
		width: 0;
		height: 100%;
		border-radius: inherit;
		background: var(--fg-strong);
	}

	.bars .past i,
	.bars .on i {
		width: 100%;
	}

	.bars .on i.run {
		animation: fill var(--phase-s) linear both;
	}

	.play {
		display: grid;
		place-items: center;
		width: 1.7rem;
		height: 1.7rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--bg) 70%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gold) 60%, transparent);
		color: var(--gold);
		cursor: pointer;
	}

	.play .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.caption {
		max-width: var(--script-measure, 40rem);
		margin: 0.4rem auto 0;
		font-size: 0.95rem;
		line-height: 1.5;
		text-align: center;
		color: var(--fg-dim);
		animation: fade 380ms ease both;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.3rem 0.9rem;
		margin: 0.6rem 0 0;
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

	.legend b {
		font-variant-numeric: tabular-nums;
		color: var(--fg-strong);
	}

	.legend s {
		font-weight: 500;
		color: var(--fg-faint);
	}

	.swatch {
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 2px;
		background: var(--c);
	}

	.one {
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: var(--fg-dim);
	}

	.one.hollow {
		background: none;
		box-shadow: inset 0 0 0 1.2px var(--fg-dim);
	}

	.unknown {
		font-style: italic;
		font-weight: 600;
		color: var(--fg-faint);
	}

	.sources {
		margin: 0.45rem 0 0;
		text-align: center;
		font-size: 0.66rem;
		line-height: 1.45;
		color: var(--fg-faint);
	}

	@container (max-width: 520px) {
		.tlabel,
		.ulabel {
			font-size: 0.56rem;
		}

		.alabel,
		.elabel {
			font-size: 0.54rem;
		}

		.locator {
			display: none;
		}
	}

	@keyframes fill {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.4);
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.ulabel {
			transition: none;
		}

		.reveal,
		.arrow .head,
		.event,
		.alabel,
		.elabel,
		.caption,
		.now,
		.bars i.run {
			animation-duration: 1ms;
			animation-delay: 0s;
		}
	}
</style>
