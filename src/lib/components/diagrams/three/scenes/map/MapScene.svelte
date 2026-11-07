<script lang="ts">
	/**
	 * The whole map on its real ground: the Samhan sheet as one relief slab (baked by
	 * scripts/bake-map-terrain.mjs) wearing the flat map's own painted surface, realm
	 * borders standing up as low walls, and realm and place labels in the DOM.
	 *
	 * Framed wider (`scope`), the known world spreads out around the relief
	 * (CosmosLayer). With `select`, it is the Stage's site picker: only the built
	 * sites are lit, everything else goes quiet.
	 */
	import { T, useThrelte } from '@threlte/core';
	import { CanvasTexture, DoubleSide, SRGBColorSpace } from 'three';
	import { holdingsAt, realmsAt, settledYear } from '$lib/borders';
	import { polityBanner } from '$lib/banners';
	import { groundPalette } from '$lib/battleTerrain';
	import {
		SCOPE_BOX,
		SCOPE_VIEW,
		SKY_AT,
		SKY_HEIGHT,
		cosmosProject,
		viewBox,
		type CosmosLayout,
		type CosmosScope,
		type FishEyeId
	} from '$lib/cosmos';
	import { MAP_GRID, MAP_SKIRT, MAP_TERRAIN, buildMapRelief, mapGroundAt, mapPalette, toMapWorld } from '$lib/mapTerrain';
	import { loadMapGround, paintMapSurface, type MapGround } from '$lib/mapTerritory';
	import { MAP_MARKERS, mapLabel, type Place, type PlaceKind } from '$lib/places';
	import { PLACE_STAGE, anchorsFor, type StageAnchor } from '$lib/stage/placeStage';
	import type { StageSite, StageSiteId } from '$lib/stage/sites';
	import { getKit, type Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';
	import { terrainGeometry } from '../battle/ground';
	import CosmosLayer from './CosmosLayer.svelte';
	import StageSites from './StageSites.svelte';
	import { borderWalls } from './walls';

	let {
		year,
		ko = false,
		rivers = true,
		detail = true,
		kinds = [],
		onpick,
		scope = 'samhan',
		layout = 'circles',
		cosmos = false,
		select,
		onscope,
		rulers = false,
		labels = true,
		fish = 'mid'
	}: {
		year: number;
		ko?: boolean;
		rivers?: boolean;
		/** Statelet shades and commanderies; off, one colour per kingdom. */
		detail?: boolean;
		/** Place kinds whose markers show (the page's layer chips). */
		kinds?: PlaceKind[];
		onpick?: (p: Place) => void;
		/** How far out the camera stands: the peninsula, the two courts, or the known world. */
		scope?: CosmosScope;
		/** World only: one split circle, or 이승 and 저승 as two circles. */
		layout?: CosmosLayout;
		/** Paint the known world around the relief even when framing Samhan. */
		cosmos?: boolean;
		/** The Stage's site picker: these sites lit and clickable, everything else quiet. */
		select?: { anchors: StageAnchor[]; active: StageSiteId; onselect: (s: StageSite) => void };
		/** A marker asks for another frame (the folded peninsula flies back to Samhan). */
		onscope?: (s: CosmosScope) => void;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Civilization and myth names on the wide frames. */
		labels?: boolean;
		/** Fish-eye strength on the wide frames. */
		fish?: FishEyeId;
	} = $props();

	const kit = getKit();
	const { invalidate } = useThrelte();
	/** The skirt hangs under the sea; the group lifts it onto the stage floor. */
	const LIFT = -MAP_SKIRT;

	const pal = $derived(mapPalette(kit.palette.light));
	/** Picking a site, the kingdoms' washes step back so the lit sites read first. */
	const surfacePal = $derived(select ? { ...pal, wash: pal.wash * 0.7 } : pal);
	/** Repaint only when a site changes hands; the scrubber moves every frame. */
	const settled = $derived(settledYear(year));

	let ground = $state.raw<MapGround | null>(null);
	$effect(() => {
		let gone = false;
		loadMapGround().then(
			(g) => {
				if (!gone) ground = g;
			},
			() => {}
		);
		return () => {
			gone = true;
		};
	});

	const relief = $derived(ground ? buildMapRelief(ground.dem, ground.coast) : null);
	const slab = $derived(
		relief ? terrainGeometry(relief, { ...groundPalette(kit.palette.light), skirt: pal.skirt }, MAP_GRID, MAP_SKIRT, false) : null
	);
	const walls = $derived(relief ? borderWalls(settled, relief, pal, detail) : null);

	$effect(() => {
		const g = slab;
		invalidate();
		return () => g?.dispose();
	});
	$effect(() => {
		const g = walls;
		invalidate();
		return () => g?.dispose();
	});

	/** Known-world paint: only past Samhan. Unmount on the peninsula so no black plane remains. */
	const wide = $derived(cosmos || scope !== 'samhan');
	const worldMounted = $derived(wide);

	$effect(() => {
		if (scope === 'samhan') {
			kit.fit(
				{ min: [-MAP_GRID.w / 2, 0, -MAP_GRID.d / 2], max: [MAP_GRID.w / 2, (relief?.maxY ?? 0.6) + LIFT + 0.1, MAP_GRID.d / 2] },
				SCOPE_VIEW.samhan
			);
			return;
		}
		const b = SCOPE_BOX[scope === 'samhan' ? 'sphere' : scope];
		const [x0, z0] = toMapWorld(b.x, b.y);
		const [x1, z1] = toMapWorld(b.x + b.w, b.y + b.h);
		const peak = scope === 'cosmos' ? 16 : SKY_HEIGHT[scope] * 0.6;
		const floor = scope === 'cosmos' ? -10 : 0;
		kit.fit({ min: [x0, LIFT + floor, z0], max: [x1, LIFT + peak, z1] }, SCOPE_VIEW[scope]);
	});

	/* —————————————— the painted surface —————————————— */

	const sheet = document.createElement('canvas');
	const surface = new CanvasTexture(sheet);
	surface.colorSpace = SRGBColorSpace;
	surface.anisotropy = 8;
	$effect(() => () => surface.dispose());
	$effect(() => {
		if (!ground) return;
		paintMapSurface(sheet, settled, ground, surfacePal, rivers, detail);
		surface.needsUpdate = true;
		invalidate();
	});

	/* —————————————— labels —————————————— */

	const inFrame = (x: number, y: number) =>
		x >= MAP_TERRAIN.x && x <= MAP_TERRAIN.x + MAP_TERRAIN.w && y >= MAP_TERRAIN.y && y <= MAP_TERRAIN.y + MAP_TERRAIN.h;
	const lifted = (x: number, y: number, up: number): Vec3 => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, (relief ? mapGroundAt(relief, x, y) : 0) + LIFT + up, wz];
	};

	const realms = $derived(
		realmsAt(settled, holdingsAt(settled), detail)
			.filter((r) => inFrame(r.x, r.y))
			.map((r) => ({
				...r,
				at: lifted(r.x, r.y, 0.14),
				flag: r.minor ? null : polityBanner(r.polity, settled).src
			}))
	);
	const places = $derived(
		MAP_MARKERS.filter((p) => kinds.includes(p.kind) && inFrame(p.x, p.y) && !(select && p.id in PLACE_STAGE)).map((p) => ({
			p,
			at: lifted(p.x, p.y, 0.03),
			name: ko ? (p.korean ?? p.name) : mapLabel(p)
		}))
	);

	const skyBase = $derived.by(() => {
		const [x, y] = cosmosProject(...SKY_AT);
		return lifted(x, y, 0)[1];
	});
</script>

{#if slab && walls && scope !== 'cosmos' && scope !== 'world'}
	<T.Group position.y={LIFT}>
		<T.Mesh geometry={slab}>
			<T.MeshLambertMaterial map={surface} vertexColors side={DoubleSide} />
		</T.Mesh>
		<T.Mesh geometry={walls} renderOrder={1}>
			<T.MeshBasicMaterial vertexColors transparent opacity={0.8} side={DoubleSide} depthWrite={false} toneMapped={false} />
		</T.Mesh>
	</T.Group>
{/if}

{#if worldMounted}
	<CosmosLayer {year} {ko} {scope} {layout} lift={LIFT} show={wide} mythLabels={!select && labels} {skyBase} peninsula={relief} {rulers} {labels} {fish} />
{/if}

{#each places as { p, at, name } (p.id)}
	{#if select}
		<KitLabel {at} tone="note" size="xs" minor show={scope === 'samhan'}>
			<span class="place quiet" title={name}><i></i></span>
		</KitLabel>
	{:else}
		<KitLabel {at} lift tone="note" size="xs" minor={!p.capital} title={name} show={scope === 'samhan'} onclick={onpick ? () => onpick(p) : undefined}>
			<span class="place" class:capital={p.capital}><i></i>{name}</span>
		</KitLabel>
	{/if}
{/each}

{#each realms as r (r.key)}
	<KitLabel at={r.at} tone="note" size={r.minor ? 'sm' : 'lg'} minor={r.minor} moveDelay={0} show={scope === 'samhan'}>
		<span class="realm" class:small={r.minor} class:quiet={!!select} style:--c={r.color}>
			{#if r.flag}<img class="flag" src={r.flag} alt="" decoding="async" />{/if}
			<span class="name">{ko ? r.korean || r.label : r.label}</span>
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
		lift={LIFT}
		{lifted}
		onselect={select.onselect}
		{onscope}
	/>
{/if}

<style>
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
	}

	.realm .name {
		opacity: 0.75;
	}

	.realm .flag {
		height: 0.85em;
		aspect-ratio: 3 / 2;
		border-radius: 1px;
		box-shadow:
			0 0 0 0.5px rgb(0 0 0 / 0.4),
			0 1px 4px rgb(0 0 0 / 0.55);
	}

	.realm.small {
		font-size: 0.9em;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	:global(html[data-theme='light']) .realm {
		color: color-mix(in srgb, var(--c) 75%, #1a140a);
		text-shadow: 0 1px 3px rgb(255 253 248 / 0.95);
	}

	.place {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		white-space: nowrap;
		color: var(--fg);
		text-shadow:
			0 0 5px var(--bg),
			0 0 2px var(--bg);
	}

	.place i {
		width: 0.45em;
		height: 0.45em;
		border-radius: 50%;
		background: var(--fg);
		box-shadow: 0 0 0 1.5px var(--bg);
	}

	.place.capital {
		font-weight: 700;
	}

	.place.capital i {
		background: var(--gold);
		box-shadow:
			0 0 0 1.5px var(--bg),
			0 0 0 2.5px var(--gold);
	}

	/* The picker: places without a model stay on the map, small and quiet. */
	.place.quiet {
		opacity: 0.38;
	}

	.place.quiet i {
		width: 0.35em;
		height: 0.35em;
		box-shadow: none;
	}

	.realm.quiet {
		opacity: 0.55;
		font-size: 1em;
	}
</style>
