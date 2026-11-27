<script lang="ts">
	/**
	 * The whole map on its real ground. Every frame — the peninsula, the sphere, the
	 * world, the cosmos — is the same painted known world (CosmosLayer) raised on the
	 * same elevation (worldRelief.ts); the frames differ only in zoom. World is 이승's
	 * circle cylinder (cosmos living disc without the myth fringe); cosmos adds 저승
	 * and the myth stations. Realm and place labels ride the relief in the DOM. With
	 * `select`, it is the Stage's site picker: only the built sites are lit.
	 */
	import { holdingsAt, hojokBox, hojokMarks, seatHojok, realmsAt, settledYear, tribesAt } from '$lib/borders';
	import HojokMark from '$lib/components/HojokMark.svelte';
	import { polityBanner } from '$lib/banners';
	import {
		SCOPE_VIEW,
		SKY_AT,
		SKY_HEIGHT,
		cameraBox,
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
	import { detailAlpha, detailPatch, keepRoom, labelNudge, modelCandidate, screenDist, showPill, showPlace, viewSheet } from '$lib/mapLod';
	import { MAP_TERRAIN, toMapWorld } from '$lib/mapTerrain';
	import { MAP_MARKERS, PLACES, capitalIn, mapLabel, standsIn, type Place, type PlaceKind } from '$lib/places';
	import { PLACE_STAGE, anchorsFor, pillLabel, stagePills, type StageAnchor } from '$lib/stage/placeStage';
	import { siteFlag, type StageSite, type StageSiteId } from '$lib/stage/sites';
	import { flatField, heightAt, loadWorldDem, pangaeaField, reliefFor, reliefInset, reliefWindow, type WorldDem } from '$lib/worldRelief';
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
		nations = true,
		showTribes = true,
		cities = true,
		fish = 'mid',
		terrain = true,
		washes = true,
		peoples = true,
		nature = true,
		mythic = true,
		gaze = 'above',
		split = 1,
		view3d = true,
		beginning = false,
		onwiki,
		ondive,
		onenter: _onenter,
		onzoomto: _onzoomto,
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
		/** Kingdom and realm names. */
		nations?: boolean;
		/** Northern peoples, as pills. */
		showTribes?: boolean;
		/** City pills and settlement names. */
		cities?: boolean;
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
		/** 0 = Pangaea (one circle), 1 = the split cosmos. */
		split?: number;
		/** Overhead (2D) or the scope's angled orbit (3D). Same model either way. */
		view3d?: boolean;
		/** The Beginning circle is up: hide the present's names and places. */
		beginning?: boolean;
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

	/** Every scope stands on the cosmos model. The chips only move the camera. */
	const field = $derived.by(() => {
		setFishEye(fish);
		setCosmosSplit(1);
		if (!data || !dem) return null;
		const f = reliefFor(data, dem, 'cosmos', layout);
		return terrain ? f : flatField(f);
	});
	const pangaea = $derived.by(() => (field ? pangaeaField(field, terrain) : null));
	/** Label lift and table thickness follow the model, not the camera, so a reframe does not rebuild the mesh. */
	const fitWidth = $derived.by(() => {
		setFishEye(fish);
		return scopeFrame(scope).fit.w / 50;
	});
	/** The table's thickness under the deepest sea; the group stands on the stage floor. */
	const lift = $derived(field ? -(Math.min(field.minH, pangaea?.minH ?? 0) - fitWidth * 0.03) : fitWidth * 0.03);

	/**
	 * Reframe when the scope, the relief, or the loaded ground changes.
	 * A fish-eye change warps the sheet under the camera and leaves the turn, tilt and zoom.
	 */
	let framed = '';
	$effect(() => {
		setFishEye(fish);
		const key = `${scope}|${terrain ? 1 : 0}|${field ? 1 : 0}|${gaze}|${view3d ? 1 : 0}|${beginning ? 1 : 0}`;
		if (framed === key) return;
		framed = key;
		const fit = cameraBox(scope, beginning);
		/**
		 * Samhan's window runs from Buyeo Fortress to Tamla. The nav sits on the
		 * top of that frame and the timeline on the bottom, so the camera keeps
		 * a clear band: a little north, more south.
		 */
		const viewFit =
			scope === 'samhan' && !beginning
				? (() => {
						const top = 0.09;
						const bottom = 0.2;
						const extraH = fit.h * ((top + bottom) / (1 - top - bottom));
						const extraW = fit.w * 0.04;
						return {
							x: fit.x - extraW / 2,
							y: fit.y - extraH * (top / (top + bottom)),
							w: fit.w + extraW,
							h: fit.h + extraH
						};
					})()
				: fit;
		const [x0, z0] = toMapWorld(viewFit.x, viewFit.y);
		const [x1, z1] = toMapWorld(viewFit.x + viewFit.w, viewFit.y + viewFit.h);
		const top = lift + Math.max(field?.maxH ?? 0, pangaea?.maxH ?? 0);
		const peak = scope === 'samhan' && !beginning ? top : Math.max(top, lift + SKY_HEIGHT[scope] * 0.6);
		const posed = view3d && !beginning && scope === 'cosmos' && gaze !== 'above' ? COSMOS_GAZES.find((g) => g.id === gaze) : null;
		const overhead = { az: 0, el: 1.45 };
		kit.fit({ min: [x0, lift, z0], max: [x1, peak, z1] }, !view3d ? overhead : (posed ?? SCOPE_VIEW[scope]));
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
			.filter((r) => r.x >= 0 && r.x <= 1080 && r.y >= 80 && r.y <= 1020)
			.filter((r) => scope === 'samhan' || r.polity !== 'china' || r.minor)
			.map((r) => ({
				...r,
				at: lifted(r.x, r.y, fitWidth * 0.01),
				flag: r.minor ? null : polityBanner(r.polity, settled).src
			}))
	);
	const places = $derived(
		MAP_MARKERS.filter(
			(p) => kinds.includes(p.kind) && inSheet(p.x, p.y) && standsIn(p, year) && !(select && p.id in PLACE_STAGE)
		).map((p) => ({
			p,
			at: lifted(p.x, p.y, fitWidth * 0.002),
			name: ko ? (p.korean ?? p.name) : mapLabel(p)
		}))
	);

	/** Sheet units across the fitted frame. Smaller as the reader zooms in. */
	const span = $derived(cameraBox(scope, beginning).w / Math.max(kit.zoom.k, 0.001));
	/** Sheet size of the ground actually in the window, letterbox included. */
	const view = $derived.by(() => {
		const { width, height } = kit.size;
		return viewSheet(cameraBox(scope, beginning), kit.zoom.k, width, height);
	});
	/**
	 * Closer than the framed scope, a sharper patch of just the ground under the
	 * camera. Samhan at rest keeps the peninsula sheet; zooming further crops it.
	 */
	const patch = $derived.by(() => {
		setFishEye(fish);
		if (beginning) return null;
		const fit = cameraBox(scope, false);
		const { k, x, y, r } = kit.zoom;
		return detailPatch(fit, { k, x, y, r }, view, scope);
	});
	/**
	 * The close-up follows the gliding zoom, but the relief is rebuilt only when
	 * the quantized patch actually moves. Returning the same object while the
	 * key holds keeps the elevation mesh off the per-frame spring.
	 */
	let heldPatch: ReturnType<typeof detailPatch> = null;
	let heldKey = '';
	const stablePatch = $derived.by(() => {
		const p = patch;
		const key = p ? `${p.box.x}|${p.box.y}|${p.box.w}|${p.box.h}|${p.long}|${p.paint}` : '';
		if (key === heldKey) return heldPatch;
		heldKey = key;
		heldPatch = p;
		return p;
	});
	const inset = $derived.by(() => {
		setFishEye(fish);
		if (!data || !dem || beginning) return null;
		if (stablePatch) {
			/**
			 * A cosmos window punches every cell outside the living disc. On a
			 * zoom that reaches China or Japan those holes read as torn land.
			 * Near scopes stay a full rectangle.
			 */
			const parent = scope === 'world' || scope === 'cosmos' ? scope : 'sphere';
			const f = reliefWindow(data, dem, parent, stablePatch.box, stablePatch.long, layout);
			return terrain ? f : flatField(f);
		}
		if (scope !== 'samhan') return null;
		const f = reliefInset(data, dem, scope);
		return terrain ? f : flatField(f);
	});
	const closeAlpha = $derived.by(() => {
		if (!inset) return 0;
		return detailAlpha(view, cameraBox(scope, false), scope);
	});
	const insetPaint = $derived(stablePatch?.paint ?? 2048);

	const pills = $derived.by(() => {
		setFishEye(fish);
		if (select) return [];
		const list = stagePills().filter((p) => {
			const place = PLACES[p.placeId];
			if (place?.offMap || (place && !standsIn(place, year))) return false;
			return capitalIn(p.placeId, year);
		});
		const names = pillLabel(list, ko);
		return list.map((p) => {
			const place = PLACES[p.placeId];
			const flag = siteFlag(p.site, p.site.timeless ? undefined : year);
			const [dx, dy] = labelNudge(p.placeId);
			const at =
				p.where === 'sheet'
					? lifted(p.x + dx, p.y + dy, fitWidth * 0.004)
					: placed(p.x + dx, p.y + dy, fitWidth * 0.004);
			return { ...p, place, name: names.get(p.site.id) ?? p.site.en, color: flag.color, at };
		});
	});
	const pillIds = $derived(new Set(pills.map((p) => p.placeId)));
	const pillsOn = $derived(showPill(scope, span));
	/** Individual kingdoms on Samhan + Ecumene; World abstracts them away. */
	const realmsOn = $derived(labels && nations && !beginning && (scope === 'samhan' || scope === 'sphere'));
	const tribesOn = $derived(labels && showTribes && !beginning && scope === 'samhan');
	const tribes = $derived.by(() => {
		setFishEye(fish);
		if (!tribesOn) return [];
		return tribesAt(year)
			.filter((t) => inSheet(t.x, t.y))
			.map((t) => ({ ...t, at: lifted(t.x, t.y, fitWidth * 0.006) }));
	});
	/** Castle lords still holding their own town. One name per lord, seated on his own land. */
	const hojok = $derived.by(() => {
		setFishEye(fish);
		if (!realmsOn) return [];
		const marks = hojokMarks(settled);
		const box = (h: (typeof marks)[number]) => hojokBox(ko ? h.ko : h.en, h.hanja, ko, ko ? h.epiKo : h.epi);
		const seated = seatHojok(
			marks,
			(x, y) => {
				const p = kit.project(lifted(x, y, fitWidth * 0.008));
				return [p.x, p.y];
			},
			box
		);
		return marks.map((h, i) => ({
			...h,
			at: lifted(seated[i].x, seated[i].y, fitWidth * 0.008),
			box: box(h)
		}));
	});
	const hojokSites = $derived(new Set(hojok.flatMap((h) => h.sites)));

	const room = $derived.by(() => {
		const { width, height } = kit.size;
		const items: { key: string; at: [number, number] | null; w: number; h: number; rank: number }[] = [];
		const pin = (at: Vec3, key: string, w: number, h: number, rank: number) => {
			const p = kit.project(at);
			const on = width > 0 && p.x > -80 && p.y > -40 && p.x < width + 80 && p.y < height + 40;
			items.push({ key, at: on ? [p.x, p.y] : null, w, h, rank });
		};
		if (pillsOn && labels && cities)
			for (const p of pills) {
				pin(p.at, `pill:${p.site.id}`, 108, 26, 0);
				const last = items.at(-1);
				if (last?.at) last.at = [last.at[0], last.at[1] - last.h / 2 - 8];
			}
		for (const { p, at } of places) {
			const cap = capitalIn(p.id, year);
			if (!showPlace(scope, span, cap)) continue;
			const piled = pillsOn && pillIds.has(p.id);
			const lord = hojokSites.has(p.id);
			if (p.kind !== 'river' && !lord && (piled || !labels)) pin(at, `dot:${p.id}`, 12, 12, 0);
			if (!labels || piled || lord) continue;
			pin(at, p.id, cap ? 84 : 68, 16, cap ? 1 : 2);
		}
		if (labels && realmsOn) for (const h of hojok) pin(h.at, `hojok:${h.id}`, h.box.w, h.box.h, -1);
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

	function openPill(p: (typeof pills)[number]) {
		if (p.placeId && onwiki) onwiki(p.placeId);
	}

	function openPlace(p: Place) {
		if (p.kind === 'river') return;
		onwiki?.(p.id);
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
	{dem}
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
	{pangaea}
	{beginning}
	{onwiki}
	{inset}
	insetAlpha={closeAlpha}
	{insetPaint}
	insetFeather={!!stablePatch && scope !== 'samhan'}
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
			lift={p.kind !== 'river'}
			aside={p.kind === 'river'}
			tone="note"
			size="xs"
			minor={!capitalIn(p.id, year)}
			title={name}
			show={labels && room.has(p.id) && !beginning}
			onclick={p.kind === 'river' ? undefined : () => openPlace(p)}
		>
			{#if p.kind === 'river'}
				<span class="river-name">{name}</span>
			{:else}
				<span class={['place', { capital: capitalIn(p.id, year) }]}><i></i>{name}</span>
			{/if}
		</KitLabel>
	{/if}
{/each}

{#each realms as r (r.key)}
	<KitLabel at={r.at} tone="note" size={r.minor ? 'sm' : 'lg'} moveDelay={0} show={realmsOn}>
		<span class={['realm', { small: r.minor, quiet: !!select }]}>
			{#if r.flag}<img class="flag" src={r.flag} alt="" decoding="async" />{/if}
			<span class="name">{ko ? r.korean || r.label : r.label}</span>
		</span>
	</KitLabel>
{/each}

{#each tribes as t (t.id)}
	<KitLabel at={t.at} tone="note" size="sm" moveDelay={0} show={tribesOn}>
		<span class="tribe">
			<span class="name">{ko ? t.ko : t.en}</span>
			<span class="epi">{ko ? t.epithet.ko : t.epithet.en}</span>
		</span>
	</KitLabel>
{/each}

{#each hojok as h (h.id)}
	<KitLabel at={h.at} tone="note" size="sm" moveDelay={0} show={realmsOn && room.has(`hojok:${h.id}`)}>
		<HojokMark hanja={h.hanja} name={ko ? h.ko : h.en} epithet={ko ? h.epiKo : h.epi} color={h.color} />
	</KitLabel>
{/each}

{#each places as { p, at } (`dot:${p.id}`)}
	{#if !select && p.kind !== 'river' && room.has(`dot:${p.id}`) && !(labels && room.has(p.id))}
		<KitLabel {at} tone="note" size="xs" show={!beginning} onclick={() => openPlace(p)}>
			<span class="place dot-only capital"><i></i></span>
		</KitLabel>
	{/if}
{/each}

{#each pills as p (p.site.id)}
	<KitLabel
		at={p.at}
		tone="accent"
		accent={p.color}
		size="sm"
		round
		moveDelay={0}
		lift
		show={labels && cities && room.has(`pill:${p.site.id}`) && !beginning}
		onclick={() => openPill(p)}
		title={p.name}
	>
		<span class="model-pill">{p.name}</span>
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
		font-family: var(--serif);
		font-size: 1.2em;
		font-style: normal;
		font-weight: 700;
		letter-spacing: -0.03em;
		text-transform: uppercase;
		white-space: nowrap;
		color: #fff;
		text-shadow: 0 1px 4px rgb(0 0 0 / 0.95), 0 0 2px rgb(0 0 0 / 0.8);
		& .name {
			opacity: 1;
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
			letter-spacing: -0.02em;
		}
		:global(html[data-theme='light']) & {
			color: #1a140c;
			text-shadow: 0 0 4px #fff, 0 1px 0 #fff;
		}
	}

	.tribe {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.05em;
		padding: 0.18em 0.6em 0.22em;
		border: none;
		border-radius: 0.55em;
		background: rgb(12 10 8 / 0.72);
		color: #fff;
		font-weight: 650;
		letter-spacing: -0.03em;
		text-shadow: none;
		& .name {
			line-height: 1.1;
		}
		& .epi {
			font-size: 0.72em;
			font-weight: 500;
			letter-spacing: 0.02em;
			opacity: 0.72;
			text-transform: lowercase;
		}
		:global(html[data-theme='light']) & {
			background: rgb(255 252 246 / 0.88);
			color: #1a140c;
		}
	}

	.river-name {
		font-style: italic;
		font-weight: 600;
		letter-spacing: 0.01em;
		color: #7eb6e0;
		text-shadow: 0 0 4px #0c1018, 0 1px 2px #0c1018;
		:global(html[data-theme='light']) & {
			color: #5a9fd4;
			text-shadow: 0 0 4px #f4f7fb, 0 1px 1px #f4f7fb;
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

	.place.dot-only {
		padding: 0;
		gap: 0;
		text-shadow: none;
		& i {
			width: 7px;
			height: 7px;
		}
	}

	.model-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.28em;
		font-style: normal;
		font-weight: 650;
		letter-spacing: 0.01em;
	}

	.realm.quiet {
		opacity: 0.55;
		font-size: 1em;
	}
</style>
