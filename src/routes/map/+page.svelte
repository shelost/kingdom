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

	let hovered = $state<Place | null>(null);
	/** Opens on the year Daeya falls: the chronicle's centre of gravity. */
	let year = $state(642);

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
				<div class="relief">
					<KitStage
						scene={MAP_SCENE}
						active
						orbit
						keepFallback={false}
						sceneProps={{ year, ko, rivers: layers.rivers, detail, kinds: [...kinds], onpick: pick }}
					>
						{#snippet fallback()}
							<StoryMap pageMode pinnable={wide.current} {year} {show} {detail} rivers={layers.rivers} bind:hovered />
						{/snippet}
					</KitStage>
				</div>
			{:else}
				<StoryMap pageMode pinnable={wide.current} {year} {show} {detail} rivers={layers.rivers} bind:hovered />
			{/if}
		</div>
		<div class="side">
			<div class="controls">
				<div class="group" role="group" aria-label={ko ? '지도 보기' : 'Map view'}>
					<button type="button" class="chip" aria-pressed={!relief} onclick={() => (relief = false)}>
						<span class="material-symbols-outlined" aria-hidden="true">map</span>2D
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
						<span class="material-symbols-outlined" aria-hidden="true">landscape</span>3D
					</button>
				</div>
				<div class="group" role="group" aria-label={ko ? '색 구분' : 'Colour detail'}>
					<button
						type="button"
						class="chip"
						aria-pressed={detail}
						onclick={() => (detail = !detail)}
					>
						{ko ? '상세' : 'Detail'}
					</button>
				</div>
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
		display: flex;
		flex-direction: column;
		min-width: 0;
		--map-reserve: 4rem;
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		min-width: 0;
	}

	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		padding: 0.3rem 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
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

	.chip .material-symbols-outlined {
		font-size: 1.05em;
		vertical-align: -0.18em;
		margin-right: 0.3em;
	}

	.relief {
		width: 100%;
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

		.preview {
			display: block;
			flex: 1 1 auto;
			min-height: 0;
		}
	}
</style>
