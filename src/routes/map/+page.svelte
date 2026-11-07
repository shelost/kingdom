<script lang="ts">
	import StoryMap from '$lib/components/StoryMap.svelte';
	import MapPreview from '$lib/components/MapPreview.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import BorderTimeline from '$lib/components/BorderTimeline.svelte';
	import KitStage from '$lib/components/diagrams/three/KitStage.svelte';
	import { MAP_SCENE } from '$lib/components/diagrams/three/scenes';
	import type { Place, PlaceKind } from '$lib/places';
	import { reading } from '$lib/reading.svelte';
	import LangSwitch from '$lib/components/LangSwitch.svelte';
	import { MediaQuery } from 'svelte/reactivity';
	import { resolve } from '$app/paths';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import LandLegend from '$lib/components/LandLegend.svelte';
	import { onMount } from 'svelte';
	import {
		COSMOS_SCOPES,
		FISH_EYES,
		isFishEye,
		setFishEye,
		viewBox,
		type CosmosScope,
		type FishEyeId
	} from '$lib/cosmos';

	const FISH_KEY = 'map-fish-eye';

	let hovered = $state<Place | null>(null);
	/** Opens on the year Daeya falls: the chronicle's centre of gravity. */
	let year = $state(642);
	/** Fish-eye strength on the wide frames — try them and keep the favourite. */
	let fish = $state<FishEyeId>('mid');

	/** Marker layers: settlements, and the land itself. */
	const LAYER_KINDS = {
		cities: ['city', 'harbor'],
		nature: ['mountain', 'cave', 'river', 'realm']
	} satisfies Record<string, PlaceKind[]>;

	let layers = $state({ rivers: true, cities: true, nature: true });
	let kinds = $derived(
		new Set<PlaceKind>([
			...(layers.cities ? LAYER_KINDS.cities : []),
			...(layers.nature ? LAYER_KINDS.nature : [])
		])
	);
	const show = (p: Place) => kinds.has(p.kind);
	let ko = $derived(reading.lang === 'ko');
	/** The sheet flat, or on its real relief (same borders, year and layers). */
	let relief = $state(false);
	/** Shades for leagues and commanderies. Off: one solid colour per kingdom. */
	let detail = $state(true);
	/** Wide frames: each realm's ruler in the year, under its name. */
	let rulers = $state(false);
	/** Civilization and myth names on the world / courts sheets. */
	let labels = $state(true);
	/** The relief's frame: the peninsula, the two courts, or the known world around them. */
	let scope = $state<CosmosScope>('samhan');
	const stageAspect = $derived(scope === 'cosmos' ? viewBox('circles').w / viewBox('circles').h : scope === 'world' ? 1.55 : scope === 'sphere' ? 1.45 : 0.92);
	const SCOPE_ORDER: CosmosScope[] = ['samhan', 'sphere', 'world', 'cosmos'];
	function scopeOut() {
		const i = SCOPE_ORDER.indexOf(scope);
		if (i < SCOPE_ORDER.length - 1) scope = SCOPE_ORDER[i + 1];
	}
	const pick = (p: Place) => (hovered = p);
	/** Fetch the 3D scene and its ground while the pointer is still on its way to the chip. */
	function warm3d() {
		void MAP_SCENE.load();
		void import('$lib/mapTerritory').then((m) => m.loadMapGround());
	}

	const LAYERS = [
		{ id: 'rivers', en: 'Rivers', ko: '강' },
		{ id: 'cities', en: 'Cities', ko: '도성' },
		{ id: 'nature', en: 'Nature', ko: '산천' }
	] as const;
	/** The preview panel only shows on desktop, so only there does a click pin a place to it. */
	const wide = new MediaQuery('min-width: 1024px');

	function pickFish(id: FishEyeId) {
		fish = id;
		setFishEye(id);
		try {
			localStorage.setItem(FISH_KEY, id);
		} catch {
			/* private mode */
		}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem(FISH_KEY);
			if (saved && isFishEye(saved)) pickFish(saved);
			else setFishEye(fish);
		} catch {
			setFishEye(fish);
		}
	});
</script>

<svelte:head>
	<title>Map · King for All</title>
	<meta
		name="description"
		content="Interactive map of Samhan — places named in the chronicle, open for their profiles."
	/>
</svelte:head>

<main class="map-page">
	<header class="mast">
		<SiteNavSpace />
		<h1>{ko ? '지도' : 'Map'}</h1>
		<p class="lede">{ko ? '한 장에 담은 삼한 — 장소를 누르면 위키 항목이 열립니다.' : 'Samhan on one sheet — click a place for its wiki entry.'}</p>
	</header>
	<div class="split">
		<div class="atlas">
			{#if relief}
				<div class={['relief', { world: scope === 'world' || scope === 'cosmos' }]} style:--frame={stageAspect}>
					<KitStage
						scene={MAP_SCENE}
						active
						orbit
						keepFallback={false}
						aspect={stageAspect}
						reframe={scope}
						onzoomout={scopeOut}
						sceneProps={{ year, ko, rivers: layers.rivers, detail, kinds: [...kinds], onpick: pick, scope, layout: 'circles', rulers, labels, fish, onscope: (s: CosmosScope) => (scope = s) }}
					>
						{#snippet fallback()}
							<StoryMap pageMode pinnable={wide.current} {year} {show} {detail} rivers={layers.rivers} bind:hovered />
						{/snippet}
					</KitStage>
				</div>
			{:else if scope !== 'samhan'}
				<div class={['relief', { world: scope === 'world' || scope === 'cosmos' }]} style:--frame={stageAspect}>
					{#key fish}
						<CosmosFlat
							{year}
							{ko}
							{scope}
							layout="circles"
							{rulers}
							{labels}
							{fish}
							onscope={(s) => (scope = s)}
						/>
					{/key}
				</div>
			{:else}
				<StoryMap pageMode pinnable={wide.current} {year} {show} {detail} rivers={layers.rivers} bind:hovered />
			{/if}
			<div class="chrome">
				<div class="corner tl">
					<div class="group" role="group" aria-label={ko ? '지도 보기' : 'Map view'}>
						<button type="button" class="chip" aria-pressed={!relief} onclick={() => (relief = false)}>
							<span class="material-symbols-outlined" aria-hidden="true">map</span><span class="chip-text">2D</span>
						</button>
						<button
							type="button"
							class="chip"
							aria-pressed={relief}
							title={ko ? '드래그: 회전 · 스페이스+드래그: 이동 · 스크롤: 확대' : 'Drag to rotate · Space + drag to pan · Scroll to zoom'}
							onpointerenter={warm3d}
							onfocus={warm3d}
							onclick={() => (relief = true)}
						>
							<span class="material-symbols-outlined" aria-hidden="true">landscape</span><span class="chip-text">3D</span>
						</button>
					</div>
					<div class="group" role="group" aria-label={ko ? '보는 범위' : 'Frame'}>
						{#each COSMOS_SCOPES as s (s.id)}
							<button type="button" class="chip" aria-pressed={scope === s.id} onclick={() => (scope = s.id)} title={ko ? s.ko : s.en}>
								<span class="material-symbols-outlined" aria-hidden="true">{s.icon}</span><span class="chip-text">{ko ? s.ko : s.en}</span>
							</button>
						{/each}
					</div>
				</div>
				<div class="corner tr">
					<div class="group" role="group" aria-label={ko ? '색 구분' : 'Colour detail'}>
						<button type="button" class="chip" aria-pressed={detail} onclick={() => (detail = !detail)}>
							{ko ? '상세' : 'Detail'}
						</button>
						{#if scope !== 'samhan'}
							<button type="button" class="chip" aria-pressed={labels} onclick={() => (labels = !labels)} title={ko ? '이름' : 'Labels'}>
								<span class="material-symbols-outlined" aria-hidden="true">title</span><span class="chip-text">{ko ? '이름' : 'Labels'}</span>
							</button>
							<button type="button" class="chip" aria-pressed={rulers} onclick={() => (rulers = !rulers)} title={ko ? '군주' : 'Rulers'}>
								<span class="material-symbols-outlined" aria-hidden="true">crown</span><span class="chip-text">{ko ? '군주' : 'Rulers'}</span>
							</button>
						{/if}
					</div>
					{#if scope !== 'samhan'}
						<div class="group" role="group" aria-label={ko ? '어안' : 'Fish-eye'}>
							{#each FISH_EYES as f (f.id)}
								<button
									type="button"
									class="chip"
									aria-pressed={fish === f.id}
									title={ko ? `어안 · ${f.ko}` : `Fish-eye · ${f.en}`}
									onclick={() => pickFish(f.id)}
								>
									{ko ? f.ko : f.en}
								</button>
							{/each}
						</div>
					{/if}
					<div class="group" role="group" aria-label={ko ? '지도 층' : 'Map layers'}>
						{#each LAYERS as layer (layer.id)}
							<button
								type="button"
								class="chip"
								aria-pressed={layers[layer.id]}
								onclick={() => (layers[layer.id] = !layers[layer.id])}
							>
								{ko ? layer.ko : layer.en}
							</button>
						{/each}
					</div>
					<div class="group lang-group" role="group" aria-label={ko ? '언어' : 'Language'}>
						<LangSwitch />
					</div>
				</div>
				{#if scope === 'world'}
					<div class="land-legend"><LandLegend {ko} /></div>
				{/if}
				<a
					class="legend corner br"
					href={resolve('/stage')}
					title={ko ? '3D 무대 열기' : 'Open the 3D stage'}
					aria-label={ko ? '3D 모형이 있는 곳 · 무대 열기' : 'Places with a 3D model · open stage'}
				>
					<span class="model" aria-hidden="true">3D</span>
					<span class="legend-text">{ko ? '3D 모형이 있는 곳' : 'Has a 3D model'}</span>
				</a>
			</div>
		</div>
		<div class="side">
			<BorderTimeline bind:year />
			<div class="preview">
				<MapPreview place={hovered && (kinds.has(hovered.kind) || hovered.offMap) ? hovered : null} />
			</div>
		</div>
	</div>
</main>

<PersonLayer />

<style>
	.map-page {
		min-height: 100vh;
		padding: max(1.25rem, env(safe-area-inset-top)) max(1.15rem, env(safe-area-inset-right))
			max(2rem, env(safe-area-inset-bottom)) max(1.15rem, env(safe-area-inset-left));
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
		align-items: stretch;
	}

	.mast {
		display: grid;
		gap: 0.55rem;
		max-width: 42rem;
	}

	h1 {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.1rem);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.lede {
		margin: 0;
		color: var(--fg-faint);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.split {
		display: flex;
		flex-direction: column;
		gap: 1.15rem;
	}

	.atlas {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		--map-reserve: 4rem;
	}

	.chrome {
		position: absolute;
		inset: 0;
		z-index: 5;
		pointer-events: none;
	}

	.corner {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-width: min(46%, 22rem);
		pointer-events: auto;
	}

	.tl {
		top: 0.45rem;
		left: 0.45rem;
	}

	.tr {
		top: 0.45rem;
		right: 0.45rem;
		align-items: flex-end;
	}

	.br {
		right: 0.45rem;
		bottom: 0.45rem;
	}

	.land-legend {
		position: absolute;
		z-index: 4;
		left: 0.45rem;
		bottom: 0.45rem;
		pointer-events: none;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgb(8 8 10 / 0.72);
		font: inherit;
		font-size: 0.76rem;
		color: var(--fg-faint);
		cursor: pointer;
		transition:
			background 200ms var(--ease),
			color 200ms var(--ease);
	}

	.chip:hover {
		background: var(--highlight);
	}

	:global(html[data-theme='light']) .chip {
		background: rgb(255 252 246 / 0.88);
	}

	.chip .material-symbols-outlined {
		font-size: 1.05em;
		vertical-align: -0.18em;
		margin-right: 0.3em;
	}

	.relief {
		width: 100%;
	}

	/* Key for the gold "3D" tag on markers; it opens the stage. */
	.legend {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.74rem;
		color: var(--fg-faint);
		text-decoration: none;
	}

	.legend:hover,
	.legend:focus-visible {
		color: var(--fg-strong);
	}

	.legend .model {
		padding: 0 0.3rem;
		border-radius: 3px;
		background: var(--gold);
		color: #14140f;
		font-size: 0.6rem;
		font-weight: 800;
		line-height: 1rem;
		letter-spacing: 0.04em;
	}

	.chip[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--gold) 12%, transparent);
	}

	/* Phones and tablets: the profile opens on tap instead. */
	.preview {
		display: none;
	}

	/* Phones and tablets: chrome sits under the sheet so the map stays full-bleed. */
	@media (max-width: 1023px) {
		.map-page {
			gap: 0.75rem;
			padding: max(0.85rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right))
				calc(1rem + var(--tabbar-space, 0px) + env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
		}

		.mast {
			gap: 0.35rem;
		}

		h1 {
			font-size: clamp(1.35rem, 5.5vw, 1.75rem);
		}

		.lede {
			font-size: 0.84rem;
			line-height: 1.35;
		}

		.split {
			gap: 0.85rem;
		}

		.atlas {
			--map-reserve: 0;
		}

		.chrome {
			position: static;
			inset: auto;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-top: 0.55rem;
			pointer-events: auto;
		}

		.corner {
			position: static;
			max-width: none;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.4rem;
		}

		.tr {
			align-items: flex-start;
		}

		.land-legend {
			position: static;
			left: auto;
			bottom: auto;
			align-self: flex-start;
		}

		.chip {
			min-height: 2.35rem;
			padding: 0.4rem 0.9rem;
			font-size: 0.84rem;
		}

		.chip .material-symbols-outlined {
			margin-right: 0.2em;
		}

		.legend {
			min-height: 2.35rem;
			padding: 0.35rem 0.7rem;
			border: 1px solid var(--hairline);
			border-radius: 999px;
			background: rgb(8 8 10 / 0.72);
			align-self: flex-start;
		}

		:global(html[data-theme='light']) .legend {
			background: rgb(255 252 246 / 0.88);
		}
	}

	@media (max-width: 560px) {
		.chip:has(.material-symbols-outlined) .chip-text {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.chip:has(.material-symbols-outlined) {
			position: relative;
			padding: 0 0.7rem;
			min-width: 2.5rem;
			justify-content: center;
		}

		.chip .material-symbols-outlined {
			margin-right: 0;
			font-size: 1.25rem;
			vertical-align: 0;
		}

		.legend-text {
			display: none;
		}

		.legend {
			padding: 0.35rem 0.55rem;
		}
	}

	/* Desktop: the map holds the left, the preview fills the right at the map's height. */
	@media (min-width: 1024px) {
		.map-page {
			height: 100dvh;
			min-height: 0;
			padding-bottom: 1.25rem;
		}

		.mast {
			display: none;
		}

		.split {
			flex: 1 1 auto;
			min-height: 0;
			display: grid;
			grid-template-columns: auto minmax(0, 1fr);
			gap: 1.25rem;
			padding-top: 2.75rem;
		}

		.side {
			min-height: 0;
		}

		/* A definite width, like the flat sheet's, so the auto column hugs the stage (aspect 0.92). */
		.relief {
			width: min(52vw, calc((100dvh - 5.5rem) * 0.92));
		}

		.relief.world {
			width: min(74vw, calc((100dvh - 6.2rem) * var(--frame, 1)));
		}

		.preview {
			display: block;
			flex: 1 1 auto;
			min-height: 0;
		}
	}
</style>
