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
	import { MediaQuery } from 'svelte/reactivity';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import LandLegend from '$lib/components/LandLegend.svelte';
	import { onMount } from 'svelte';
	import {
		COSMOS_SCOPES,
		FISH_EYES,
		isFishEye,
		scopeBox,
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
	/** League / commandery shades stay on; the old Detail toggle was redundant. */
	const detail = true;
	/** Wide frames: each realm's ruler in the year, under its name. */
	let rulers = $state(false);
	/** Civilization and myth names on the world / courts sheets. */
	let labels = $state(true);
	/** The relief's frame: the peninsula, the two courts, or the known world around them. */
	let scope = $state<CosmosScope>('samhan');
	const stageAspect = $derived(
		scope === 'cosmos'
			? viewBox('circles').w / viewBox('circles').h
			: scope === 'world'
				? 1.55
				: scope === 'sphere'
					? 1.45
					: 0.92
	);
	/** The flat sheet's own shape, which the fish-eye moves; the page sizes it to fit the window's height. */
	const flatAspect = $derived.by(() => {
		if (scope === 'samhan') return 1;
		setFishEye(fish);
		const b = scopeBox(scope);
		return b.w / b.h;
	});
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

	/** Exclusive name mode for the wide frames: Off · Labels · Rulers (rulers keep labels on). */
	type NameMode = 'off' | 'labels' | 'rulers';
	let nameMode = $derived<NameMode>(!labels ? 'off' : rulers ? 'rulers' : 'labels');
	function setNameMode(mode: NameMode) {
		if (mode === 'off') {
			labels = false;
			rulers = false;
		} else if (mode === 'labels') {
			labels = true;
			rulers = false;
		} else {
			labels = true;
			rulers = true;
		}
	}
	const NAME_MODES: { id: NameMode; en: string; ko: string; icon: string }[] = [
		{ id: 'off', en: 'Off', ko: '숨김', icon: 'visibility_off' },
		{ id: 'labels', en: 'Labels', ko: '이름', icon: 'title' },
		{ id: 'rulers', en: 'Rulers', ko: '군주', icon: 'crown' }
	];

	let showFish = $derived(scope !== 'samhan');
	let showNames = $derived(scope !== 'samhan');
	/** Place markers only matter on the peninsula sheet or the 3D relief. */
	let showLayers = $derived(scope === 'samhan' || relief);

	let viewIdx = $derived(relief ? 1 : 0);
	let scopeIdx = $derived(Math.max(0, SCOPE_ORDER.indexOf(scope)));
	let fishIdx = $derived(Math.max(0, FISH_EYES.findIndex((f) => f.id === fish)));
	let nameIdx = $derived(Math.max(0, NAME_MODES.findIndex((m) => m.id === nameMode)));

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
						sceneProps={{
							year,
							ko,
							rivers: layers.rivers,
							detail,
							kinds: [...kinds],
							onpick: pick,
							scope,
							layout: 'circles',
							rulers,
							labels,
							fish,
							onscope: (s: CosmosScope) => (scope = s)
						}}
					>
						{#snippet fallback()}
							<StoryMap pageMode pinnable={wide.current} {year} {show} {detail} rivers={layers.rivers} bind:hovered />
						{/snippet}
					</KitStage>
				</div>
			{:else if scope !== 'samhan'}
				<div class="relief flat" style:--frame={flatAspect}>
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
					<div class="seg" style:--n={2} style:--i={viewIdx} role="group" aria-label={ko ? '지도 보기' : 'Map view'}>
						<span class="seg-thumb" aria-hidden="true"></span>
						<button type="button" class="seg-btn" aria-pressed={!relief} onclick={() => (relief = false)}>
							<span class="material-symbols-outlined" aria-hidden="true">map</span><span class="chip-text">2D</span>
						</button>
						<button
							type="button"
							class="seg-btn"
							aria-pressed={relief}
							title={ko ? '드래그: 회전 · 스페이스+드래그: 이동 · 스크롤: 확대' : 'Drag to rotate · Space + drag to pan · Scroll to zoom'}
							onpointerenter={warm3d}
							onfocus={warm3d}
							onclick={() => (relief = true)}
						>
							<span class="material-symbols-outlined" aria-hidden="true">landscape</span><span class="chip-text">3D</span>
						</button>
					</div>
					<div
						class="seg"
						style:--n={COSMOS_SCOPES.length}
						style:--i={scopeIdx}
						role="group"
						aria-label={ko ? '보는 범위' : 'Frame'}
					>
						<span class="seg-thumb" aria-hidden="true"></span>
						{#each COSMOS_SCOPES as s (s.id)}
							<button
								type="button"
								class="seg-btn"
								aria-pressed={scope === s.id}
								onclick={() => (scope = s.id)}
								title={ko ? s.ko : s.en}
							>
								<span class="material-symbols-outlined" aria-hidden="true">{s.icon}</span><span class="chip-text"
									>{ko ? s.ko : s.en}</span
								>
							</button>
						{/each}
					</div>
				</div>
				<div class="corner tr">
					{#if showNames}
						<div
							class="seg"
							style:--n={NAME_MODES.length}
							style:--i={nameIdx}
							role="group"
							aria-label={ko ? '이름' : 'Names'}
						>
							<span class="seg-thumb" aria-hidden="true"></span>
							{#each NAME_MODES as m (m.id)}
								<button
									type="button"
									class="seg-btn"
									aria-pressed={nameMode === m.id}
									onclick={() => setNameMode(m.id)}
									title={ko ? m.ko : m.en}
								>
									<span class="material-symbols-outlined" aria-hidden="true">{m.icon}</span><span class="chip-text"
										>{ko ? m.ko : m.en}</span
									>
								</button>
							{/each}
						</div>
					{/if}
					{#if showFish}
						<div
							class="seg"
							style:--n={FISH_EYES.length}
							style:--i={fishIdx}
							role="group"
							aria-label={ko ? '어안' : 'Fish-eye'}
						>
							<span class="seg-thumb" aria-hidden="true"></span>
							{#each FISH_EYES as f (f.id)}
								<button
									type="button"
									class="seg-btn"
									aria-pressed={fish === f.id}
									title={ko ? `어안 · ${f.ko}` : `Fish-eye · ${f.en}`}
									onclick={() => pickFish(f.id)}
								>
									{ko ? f.ko : f.en}
								</button>
							{/each}
						</div>
					{/if}
					{#if showLayers}
						<div class="seg multi" role="group" aria-label={ko ? '지도 층' : 'Map layers'}>
							{#each LAYERS as layer (layer.id)}
								<button
									type="button"
									class="seg-btn"
									aria-pressed={layers[layer.id]}
									onclick={() => (layers[layer.id] = !layers[layer.id])}
								>
									{ko ? layer.ko : layer.en}
								</button>
							{/each}
						</div>
					{/if}
				</div>
				{#if scope === 'world'}
					<div class="land-legend"><LandLegend {ko} /></div>
				{/if}
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

<style lang="scss">
	.map-page {
		min-height: 100vh;
		padding: max(1.25rem, env(safe-area-inset-top)) max(1.15rem, env(safe-area-inset-right)) max(2rem, env(safe-area-inset-bottom)) max(1.15rem, env(safe-area-inset-left));
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
		--map-reserve: 0rem;
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
		gap: 0.4rem;
		max-width: min(52%, 26rem);
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

	/* Exclusive segmented control: one sliding thumb behind the pressed option. */

	.seg {
		--n: 2;
		--i: 0;
		position: relative;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		align-items: stretch;
		gap: 0;
		padding: 0.18rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgb(8 8 10 / 0.72);
		backdrop-filter: blur(10px) saturate(1.2);
		-webkit-backdrop-filter: blur(10px) saturate(1.2);
		isolation: isolate;
		:global(html[data-theme='light']) & {
			background: rgb(255 252 246 / 0.88);
		}
	}

	.seg-thumb {
		position: absolute;
		z-index: 0;
		top: 0.18rem;
		bottom: 0.18rem;
		left: calc(0.18rem + var(--i) * ((100% - 0.36rem) / var(--n)));
		width: calc((100% - 0.36rem) / var(--n));
		border-radius: 999px;
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gold) 45%, transparent), 0 2px 8px -2px color-mix(in srgb, var(--gold) 35%, transparent);
		pointer-events: none;
		transition: left 280ms var(--ease), width 280ms var(--ease);
	}

	.seg.multi {
		display: inline-flex;
		grid-auto-flow: unset;
		grid-auto-columns: unset;
		gap: 0.1rem;
		& .seg-btn[aria-pressed='true'] {
			color: var(--fg-strong);
			background: color-mix(in srgb, var(--gold) 18%, transparent);
			box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gold) 40%, transparent);
		}
	}

	.seg-btn {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.28rem;
		min-height: 1.85rem;
		padding: 0.28rem 0.7rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		font: inherit;
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-faint);
		cursor: pointer;
		white-space: nowrap;
		transition: color 200ms var(--ease);
		&:hover {
			color: var(--fg);
		}
	}

	.seg:not(.multi) .seg-btn[aria-pressed='true'] {
		color: var(--fg-strong);
	}

	.seg-btn .material-symbols-outlined {
		font-size: 1.05em;
		line-height: 1;
	}

	.relief {
		width: 100%;
	}

	/* Phones and tablets: the profile opens on tap instead. */

	.preview {
		display: none;
	}

	/* Phones and tablets: chrome sits under the sheet so the map stays full-bleed. */

	@media (max-width: 1023px) {
		.map-page {
			gap: 0.75rem;
			padding: max(0.85rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) calc(1rem + var(--tabbar-space, 0px) + env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
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
		.seg-btn {
			min-height: 2.35rem;
			padding: 0.4rem 0.85rem;
			font-size: 0.84rem;
		}
	}

	@media (max-width: 560px) {
		.seg-btn:has(.material-symbols-outlined) .chip-text {
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
		.seg-btn:has(.material-symbols-outlined) {
			position: relative;
			padding: 0 0.7rem;
			min-width: 2.5rem;
		}
		.seg-btn .material-symbols-outlined {
			font-size: 1.25rem;
		}
	}

	/* Desktop: map ~⅔, side panel ~⅓. */

	@media (min-width: 1024px) {
		.map-page {
			height: 100dvh;
			min-height: 0;
			padding-bottom: 1.25rem;
			overflow: hidden;
		}
		.mast {
			display: none;
		}
		.split {
			flex: 1 1 auto;
			min-height: 0;
			display: grid;
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
			grid-template-rows: minmax(0, 1fr);
			gap: 1.25rem;
			padding-top: 2.75rem;
		}
		.atlas {
			--map-h: calc(100dvh - 5.25rem);
			--map-reserve: calc(5.25rem + 1.8rem);
			min-height: 0;
			width: 100%;
		}
		.side {
			min-height: 0;
		}
		.relief {
			width: min(100%, calc(var(--map-h) * var(--frame, 0.92)));
			&.world, &.flat {
				width: min(100%, calc(var(--map-h) * var(--frame, 1)));
			}
		}
		.preview {
			display: block;
			flex: 1 1 auto;
			min-height: 0;
		}
	}
</style>
