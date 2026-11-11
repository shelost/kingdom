<script lang="ts">
	/**
	 * The whole map on its real ground. Every frame — the peninsula, the sphere, the
	 * world, the cosmos — is the same painted known world (CosmosLayer) raised on the
	 * same elevation (worldRelief.ts); the frames differ only in zoom. World is 이승's
	 * circle cylinder (cosmos living disc without the myth fringe); cosmos adds 저승
	 * and the myth stations. Realm and place labels ride the relief in the DOM. With
	 * `select`, it is the Stage's site picker: only the built sites are lit.
	 */
	import { holdingsAt, realmsAt, settledYear } from '$lib/borders';
	import { polityBanner } from '$lib/banners';
	import {
		SCOPE_VIEW,
		SKY_AT,
		SKY_HEIGHT,
		cosmosProject,
		fishEye,
		COSMOS_GAZES,
		scopeFrame,
		type CosmosGaze,
		setCosmosSplit,
		setFishEye,
		type CosmosLayout,
		type CosmosScope,
		type FishEyeId
	} from '$lib/cosmos';
	import { loadCosmos, type CosmosData } from '$lib/cosmosLayer';
	import { LOD, insetAlpha, keepRoom, modelCandidate, screenDist, showPill, showPlace, showRealm } from '$lib/mapLod';
	import { MAP_TERRAIN, toMapWorld } from '$lib/mapTerrain';
	import { MAP_MARKERS, PLACES, mapLabel, type Place, type PlaceKind } from '$lib/places';
	import { PLACE_STAGE, anchorsFor, pillLabel, stagePills, type StageAnchor } from '$lib/stage/placeStage';
	import { siteFlag, type StageSite, type StageSiteId } from '$lib/stage/sites';
	import { flatField, heightAt, loadWorldDem, reliefFor, reliefInset, type WorldDem } from '$lib/worldRelief';
	import type { RoadPoint } from '$lib/kangrimRoad';
	import { getKit, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import CosmosLayer from './CosmosLayer.svelte';
	import RoadThread from './RoadThread.svelte';
	import StageSites from './StageSites.svelte';

	let {
		year,
		ko = false,
		rivers = true,
		detail = true,
		kinds = [],
		onpick,
		scope = 'samhan',
		layout = 'circles',
		select,
		onscope,
		rulers = false,
		labels = true,
		fish = 'mid',
		terrain = true,
		washes = true,
		peoples = true,
		nature = true,
		mythic = true,
		gaze = 'above',
		split = 1,
		onwiki,
		ondive,
		onenter,
		onzoomto,
		road
	}: {
		year: number;
		ko?: boolean;
		rivers?: boolean;
		/** Statelet shades and commanderies; off, one colour per kingdom. */
		detail?: boolean;
		/** Place kinds whose markers show (the page's layer chips). */
		kinds?: PlaceKind[];
		onpick?: (p: Place) => void;
		/** How far out the camera stands: the peninsula, the sphere, the world, or both worlds. */
		scope?: CosmosScope;
		/** Cosmos only: one split circle, or 이승 and 저승 as two circles. */
		layout?: CosmosLayout;
		/** The Stage's site picker: these sites lit and clickable, everything else quiet. */
		select?: { anchors: StageAnchor[]; active: StageSiteId; onselect: (s: StageSite) => void };
		/** A marker asks for another frame (the folded peninsula flies back to Samhan). */
		onscope?: (s: CosmosScope) => void;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Civilization and myth names on the wide frames. */
		labels?: boolean;
		/** Fish-eye strength. */
		fish?: FishEyeId;
		/** The ground on its real relief; off, a flat painted sheet. */
		terrain?: boolean;
		/** Civilization / Ten Peoples / Ten Hells colour washes. */
		washes?: boolean;
		/** Cosmos sheets: the ten peoples, the biomes and rivers, the myth fringe. */
		peoples?: boolean;
		nature?: boolean;
		mythic?: boolean;
		/** Named 3D camera. Above keeps the scope's own tilt. */
		gaze?: CosmosGaze;
		/** 0 = HEK's Beginning (one circle), 1 = the split cosmos. */
		split?: number;
		/** A cosmos name opens the wiki. */
		onwiki?: (id: string) => void;
		/** The view has come down on a stage model, or pulled back off it. */
		ondive?: (site: StageSite | null) => void;
		/** A pill was clicked: open its model even before the zoom arrives. */
		onenter?: (site: StageSite) => void;
		/** Fly the camera toward a screen point (−1…1) at this zoom, keeping the spin. */
		onzoomto?: (u: number, v: number, k: number) => void;
		/** A walked cord on the relief. `here` is the stop the frame is standing on. */
		road?: { here: number; points: RoadPoint[] };
	} = $props();

	const kit = getKit();
	/** Repaint only when a site changes hands; the scrubber moves every frame. */
	const settled = $derived(settledYear(year));

	let data = $state.raw<CosmosData | null>(null);
	let dem = $state.raw<WorldDem | null>(null);
	$effect(() => {
		let gone = false;
		Promise.all([loadCosmos(), loadWorldDem()]).then(
			([d, e]) => {
				if (gone) return;
				data = d;
				dem = e;
			},
			() => {}
		);
		return () => {
			gone = true;
		};
	});

	const field = $derived.by(() => {
		setFishEye(fish);
		setCosmosSplit(split);
		if (!data || !dem) return null;
		const f = reliefFor(data, dem, scope, layout);
		return terrain ? f : flatField(f);
	});
	const fitWidth = $derived.by(() => {
		setFishEye(fish);
		return scopeFrame(scope).fit.w / 50;
	});
	/** The table's thickness under the deepest sea; the group stands on the stage floor. */
	const lift = $derived(field ? -(field.minH - fitWidth * 0.03) : fitWidth * 0.03);

	/**
	 * Reframe when the scope, the relief, or the loaded ground changes.
	 * A fish-eye change warps the sheet under the camera and leaves the turn, tilt and zoom.
	 */
	let framed = '';
	$effect(() => {
		setFishEye(fish);
		const key = `${scope}|${terrain ? 1 : 0}|${field ? 1 : 0}|${gaze}`;
		if (framed === key) return;
		framed = key;
		const { fit } = scopeFrame(scope);
		const [x0, z0] = toMapWorld(fit.x, fit.y);
		const [x1, z1] = toMapWorld(fit.x + fit.w, fit.y + fit.h);
		const top = lift + (field?.maxH ?? 0);
		const peak = scope === 'samhan' ? top : Math.max(top, lift + SKY_HEIGHT[scope] * 0.6);
		const posed = scope === 'cosmos' && gaze !== 'above' ? COSMOS_GAZES.find((g) => g.id === gaze) : null;
		kit.fit({ min: [x0, lift, z0], max: [x1, peak, z1] }, posed ?? SCOPE_VIEW[scope]);
	});

	/* —————————————— labels —————————————— */

	const inSheet = (x: number, y: number) =>
		x >= MAP_TERRAIN.x && x <= MAP_TERRAIN.x + MAP_TERRAIN.w && y >= MAP_TERRAIN.y && y <= MAP_TERRAIN.y + MAP_TERRAIN.h;
	/** A fish-eyed sheet point on the ground, `up` above it. */
	const placed = (x: number, y: number, up: number): Vec3 => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, lift + (field ? heightAt(field, x, y) : 0) + up, wz];
	};
	/** A flat sheet point (the peninsula's places and realms) on the ground. */
	const lifted = (x: number, y: number, up: number): Vec3 => {
		setFishEye(fish);
		const [fx, fy] = fishEye(x, y);
		return placed(fx, fy, up);
	};

	const realms = $derived(
		realmsAt(settled, holdingsAt(settled), detail)
			.filter((r) => inSheet(r.x, r.y))
			.map((r) => ({
				...r,
				at: lifted(r.x, r.y, fitWidth * 0.01),
				flag: r.minor ? null : polityBanner(r.polity, settled).src
			}))
	);
	const places = $derived(
		MAP_MARKERS.filter((p) => kinds.includes(p.kind) && inSheet(p.x, p.y) && !(select && p.id in PLACE_STAGE)).map((p) => ({
			p,
			at: lifted(p.x, p.y, fitWidth * 0.002),
			name: ko ? (p.korean ?? p.name) : mapLabel(p)
		}))
	);

	/** Sheet units across the fitted frame. Smaller as the reader zooms in. */
	const span = $derived(scopeFrame(scope).fit.w / Math.max(kit.zoom.k, 0.001));
	let insetArmed = $state(false);
	$effect(() => {
		if (scope !== 'samhan' && span < LOD.region) insetArmed = true;
	});
	const inset = $derived.by(() => {
		setFishEye(fish);
		if (!insetArmed || !data || !dem || scope === 'samhan') return null;
		const f = reliefInset(data, dem, scope);
		return terrain ? f : flatField(f);
	});
	const closeAlpha = $derived(inset ? insetAlpha(span) : 0);

	const pills = $derived.by(() => {
		setFishEye(fish);
		if (select) return [];
		const list = stagePills();
		const names = pillLabel(list, ko);
		return list.map((p) => {
			const place = PLACES[p.placeId];
			const flag = siteFlag(p.site, p.site.timeless ? undefined : year);
			const at = p.where === 'sheet' ? lifted(p.x, p.y, fitWidth * 0.004) : placed(p.x, p.y, fitWidth * 0.004);
			return { ...p, place, name: names.get(p.site.id) ?? p.site.en, color: flag.color, at };
		});
	});
	const pillIds = $derived(new Set(pills.map((p) => p.placeId)));
	const pillsOn = $derived(showPill(scope, span));
	const realmsOn = $derived(showRealm(scope, span));

	const room = $derived.by(() => {
		const { width, height } = kit.size;
		const items: { key: string; at: [number, number] | null; w: number; h: number; rank: number }[] = [];
		const pin = (at: Vec3, key: string, w: number, h: number, rank: number) => {
			const p = kit.project(at);
			const on = width > 0 && p.x > -80 && p.y > -40 && p.x < width + 80 && p.y < height + 40;
			items.push({ key, at: on ? [p.x, p.y] : null, w, h, rank });
		};
		if (realmsOn) for (const r of realms) pin(r.at, `realm:${r.key}`, r.minor ? 70 : 110, 18, 1);
		if (pillsOn) for (const p of pills) pin(p.at, `pill:${p.site.id}`, 108, 26, 0);
		for (const { p, at } of places) {
			if (pillsOn && pillIds.has(p.id)) continue;
			if (!showPlace(scope, span, !!p.capital)) continue;
			pin(at, p.id, p.capital ? 84 : 68, 16, p.capital ? 1 : 2);
		}
		return keepRoom(items);
	});

	let held: string | null = null;
	let told = '';
	$effect(() => {
		const { width, height } = kit.size;
		const points = pillsOn
			? pills.map((p) => {
					const s = kit.project(p.at);
					return { id: p.site.id, dist: screenDist(s.x, s.y, width, height) };
				})
			: [];
		const next = modelCandidate(held, points, span);
		held = next;
		const id = next ?? '';
		if (id === told) return;
		told = id;
		ondive?.(next ? (pills.find((p) => p.site.id === next)?.site ?? null) : null);
	});

	function enterPill(p: (typeof pills)[number]) {
		const { width, height } = kit.size;
		const s = kit.project(p.at);
		const u = width ? (s.x / width) * 2 - 1 : 0;
		const v = height ? -((s.y / height) * 2 - 1) : 0;
		onzoomto?.(u, v, scopeFrame(scope).fit.w / LOD.model);
		onenter?.(p.site);
	}

	const hereMark = $derived.by(() => {
		const p = road?.points[road.here];
		if (!p) return null;
		const [wx, wz] = toMapWorld(p.x, p.y);
		const h = field ? Math.max(0, heightAt(field, p.x, p.y)) : 0;
		const up = scope === 'cosmos' ? 0.7 : scope === 'world' ? 0.34 : 0.18;
		return { at: [wx, lift + h + up, wz] as Vec3, name: ko ? '강림' : 'Kangrim' };
	});

	const skyBase = $derived.by(() => {
		setFishEye(fish);
		const [x, y] = cosmosProject(...SKY_AT);
		return placed(x, y, 0)[1];
	});
</script>

<CosmosLayer
	{year}
	{ko}
	{scope}
	{layout}
	{data}
	{field}
	{lift}
	{skyBase}
	mythLabels={!select && labels}
	{rulers}
	{labels}
	{rivers}
	quiet={!!select}
	{fish}
	{terrain}
	{washes}
	{peoples}
	{nature}
	{mythic}
	{split}
	{onwiki}
	{inset}
	insetAlpha={closeAlpha}
/>

{#if road && road.points.length}
	<RoadThread points={road.points} here={road.here} {lift} {field} {scope} />
{/if}
{#if hereMark}
	<KitLabel at={hereMark.at} tone="accent" accent="#e23b3a" size="sm" round>
		{hereMark.name}
	</KitLabel>
{/if}

{#each places as { p, at, name } (p.id)}
	{#if select}
		<KitLabel {at} tone="note" size="xs" minor show={scope === 'samhan'}>
			<span class="place quiet" title={name}><i></i></span>
		</KitLabel>
	{:else}
		<KitLabel
			{at}
			lift
			tone="note"
			size="xs"
			minor={!p.capital}
			title={name}
			show={room.has(p.id)}
			onclick={onpick ? () => onpick(p) : undefined}
		>
			<span class="place" class:capital={p.capital}><i></i>{name}</span>
		</KitLabel>
	{/if}
{/each}

{#each realms as r (r.key)}
	<KitLabel at={r.at} tone="note" size={r.minor ? 'sm' : 'lg'} minor={r.minor} moveDelay={0} show={room.has(`realm:${r.key}`)}>
		<span class="realm" class:small={r.minor} class:quiet={!!select} style:--c={r.color}>
			{#if r.flag}<img class="flag" src={r.flag} alt="" decoding="async" />{/if}
			<span class="name">{ko ? r.korean || r.label : r.label}</span>
		</span>
	</KitLabel>
{/each}

{#each pills as p (p.site.id)}
	<KitLabel
		at={p.at}
		tone="accent"
		accent={p.color}
		size="sm"
		round
		moveDelay={0}
		show={room.has(`pill:${p.site.id}`)}
		onclick={() => enterPill(p)}
		title={ko ? `${p.name} 모형` : `${p.name} model`}
	>
		<span class="model-pill">
			<span class="material-symbols-outlined" aria-hidden="true">view_in_ar</span>{p.name}
		</span>
	</KitLabel>
{/each}

{#if select}
	<StageSites
		anchors={anchorsFor(layout)}
		active={select.active}
		{year}
		{ko}
		{scope}
		{placed}
		{lifted}
		onselect={select.onselect}
		{onscope}
	/>
{/if}

<style lang="scss">
	.realm {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		font-family: var(--sans, inherit);
		font-size: 1.2em;
		font-style: normal;
		font-weight: 700;
		letter-spacing: 0.035em;
		text-transform: uppercase;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 60%, #fff);
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.9);
		& .name {
			opacity: 0.75;
		}
		& .flag {
			height: 0.85em;
			aspect-ratio: 3 / 2;
			border-radius: 1px;
			box-shadow: 0 0 0 0.5px rgb(0 0 0 / 0.4), 0 1px 4px rgb(0 0 0 / 0.55);
		}
		&.small {
			font-size: 0.9em;
			font-weight: 600;
			letter-spacing: 0.02em;
		}
		:global(html[data-theme='light']) & {
			color: color-mix(in srgb, var(--c) 75%, #1a140a);
		}
	}

	.place {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		white-space: nowrap;
		color: var(--fg);
		text-shadow: 0 0 5px var(--bg), 0 0 2px var(--bg);
		& i {
			width: 0.45em;
			height: 0.45em;
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
		&.quiet {
			/* The picker: places without a model stay on the map, small and quiet. */
			opacity: 0.38;
			& i {
				width: 0.35em;
				height: 0.35em;
				box-shadow: none;
			}
		}
	}

	.model-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.28em;
		font-style: normal;
		font-weight: 650;
		letter-spacing: 0.01em;
		& .material-symbols-outlined {
			font-size: 1.05em;
			color: var(--gold);
		}
	}

	.realm.quiet {
		opacity: 0.55;
		font-size: 1em;
	}
</style>
