<script lang="ts">
	import MapPreview from '$lib/components/MapPreview.svelte';
	import WikiPeek from '$lib/components/WikiPeek.svelte';
	import BorderTimeline from '$lib/components/BorderTimeline.svelte';
	import { fly } from 'svelte/transition';
	import KitStage from '$lib/components/diagrams/three/KitStage.svelte';
	import { MAP_SCENE } from '$lib/components/diagrams/three/scenes';
	import type { Place, PlaceKind } from '$lib/places';
	import { reading } from '$lib/reading.svelte';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import LandLegend from '$lib/components/LandLegend.svelte';
	import MapDive from '$lib/components/MapDive.svelte';
	import type { StageSite } from '$lib/stage/sites';
	import { onMount } from 'svelte';
	import { COSMOS_SCOPES, FISH_EYES, isFishEye, setFishEye, type CosmosScope, type FishEyeId } from '$lib/cosmos';

	const FISH_KEY = 'map-fish-eye';

	let hovered = $state<Place | null>(null);
	/** The place card, open only after a marker is clicked. */
	let picked = $state<Place | null>(null);
	/** A stage model opened by zooming in on its city. */
	let dive = $state<StageSite | null>(null);
	/** A clicked pill stays open until the reader leaves it. */
	let pinned = false;
	/** After leaving, ignore the same pill until the view pulls back. */
	let latch = false;
	function onenter(site: StageSite) {
		pinned = true;
		latch = false;
		dive = site;
	}
	function onauto(site: StageSite | null) {
		if (pinned) return;
		if (site && latch) return;
		if (!site) latch = false;
		dive = site;
	}
	function leaveDive() {
		pinned = false;
		latch = true;
		dive = null;
	}
	let zoomTo = $state<{ n: number; u: number; v: number; k: number } | null>(null);
	let zoomN = 0;
	function flyTo(u: number, v: number, k: number) {
		zoomTo = { n: ++zoomN, u, v, k };
	}
	/** The wiki entry open over the map — the same panel as /wiki. */
	let wikiId = $state<string | null>(null);
	let wikiExpanded = $state(false);
	function openWiki(id: string) {
		wikiId = id;
		wikiExpanded = false;
	}
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
	let ko = $derived(reading.lang === 'ko');
	/** The sheet flat, or on its real relief (same borders, year and layers). */
	let relief = $state(false);
	/** Topography: the relief's heights, tint, hillshade and sea surface, in both views. */
	let terrain = $state(true);
	/** Civilization / Ten Peoples / Ten Hells colour washes. Off = bare topography. */
	let washes = $state(true);
	/** League / commandery shades stay on; the old Detail toggle was redundant. */
	const detail = true;
	/** Wide frames: each realm's ruler in the year, under its name. */
	let rulers = $state(false);
	/** Civilization and myth names on the world / courts sheets. */
	let labels = $state(true);
	/** The relief's frame: the peninsula, the two courts, or the known world around them. */
	let scope = $state<CosmosScope>('samhan');
	const SCOPE_ORDER: CosmosScope[] = ['samhan', 'sphere', 'world', 'cosmos'];
	function scopeOut() {
		const i = SCOPE_ORDER.indexOf(scope);
		if (i < SCOPE_ORDER.length - 1) scope = SCOPE_ORDER[i + 1];
	}
	/** Hover lights a marker. Click opens the place card; the card opens the wiki. */
	const pick = (p: Place) => {
		hovered = p;
		picked = p;
	};
	/** Fetch the 3D scene and its ground while the pointer is still on its way to the chip. */
	function warm3d() {
		void MAP_SCENE.load();
		void import('$lib/worldRelief').then((m) => m.loadWorldDem());
	}

	const LAYERS = [
		{ id: 'rivers', en: 'Rivers', ko: '강' },
		{ id: 'cities', en: 'Cities', ko: '도성' },
		{ id: 'nature', en: 'Nature', ko: '산천' }
	] as const;

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
	/** Places and rivers are the peninsula frame's own layers. */
	let showLayers = $derived(scope === 'samhan');
	/** Colour washes matter on the wide frames (sphere / world / cosmos). */
	let showWashes = $derived(scope !== 'samhan');

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

	let seenScope = '';
	$effect(() => {
		const s = scope;
		if (seenScope && seenScope !== s && dive) leaveDive();
		seenScope = s;
	});

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

<svelte:window
	onkeydown={(e) => {
		if (e.key !== 'Escape') return;
		if (dive) {
			leaveDive();
			return;
		}
		if (picked && !wikiId) picked = null;
	}}
/>

<main class="map-page">
	<h1 class="sr-only">{ko ? '지도' : 'Map'}</h1>
	<div class="atlas">
			{#snippet flat()}
				<CosmosFlat
					{year}
					{ko}
					{scope}
					layout="circles"
					{rulers}
					{labels}
					{fish}
					{terrain}
					{washes}
					rivers={layers.rivers}
					{detail}
					kinds={[...kinds]}
					bind:hovered
					onpick={pick}
					onwiki={openWiki}
					onscope={(s) => (scope = s)}
					ondive={onauto}
					onenter={onenter}
				/>
			{/snippet}
			<!-- One frame for every view: 2D and 3D, near and far, all fill the same box. -->
			<div class="frame">
				{#if relief}
					<KitStage
						scene={MAP_SCENE}
						active
						orbit
						fill
						keepFallback={false}
						reframe={scope}
						onzoomout={scopeOut}
						maxZoom={64}
						{zoomTo}
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
							terrain,
							washes,
							onwiki: openWiki,
							onscope: (s: CosmosScope) => (scope = s),
							ondive: onauto,
							onenter,
							onzoomto: flyTo
						}}
					>
						{#snippet fallback()}
							{@render flat()}
						{/snippet}
					</KitStage>
				{:else}
					{@render flat()}
				{/if}
			</div>
			{#if dive}
				<MapDive site={dive} {year} {ko} onback={leaveDive} />
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
							title={ko
								? '드래그: 회전·기울이기 · 오른쪽/Shift/스페이스+드래그: 이동 · 스크롤: 확대'
								: 'Drag to rotate and tilt · Right / Shift / Space + drag to pan · Scroll to zoom'}
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
					<div class="seg multi solo" role="group" aria-label={ko ? '지형' : 'Topography'}>
						<button type="button" class="seg-btn" aria-pressed={terrain} onclick={() => (terrain = !terrain)}>
							<span class="material-symbols-outlined" aria-hidden="true">terrain</span><span class="chip-text"
								>{ko ? '지형' : 'Topography'}</span
							>
						</button>
					</div>
					{#if showWashes}
						<div class="seg multi solo" role="group" aria-label={ko ? '색' : 'Colors'}>
							<button type="button" class="seg-btn" aria-pressed={washes} onclick={() => (washes = !washes)}>
								<span class="material-symbols-outlined" aria-hidden="true">palette</span><span class="chip-text"
									>{ko ? '색' : 'Colors'}</span
								>
							</button>
						</div>
					{/if}
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
			<div class="timepill">
				<BorderTimeline bind:year pill />
			</div>
			{#if picked}
				<aside class="dock" transition:fly={{ x: 28, duration: 220 }}>
					<button type="button" class="dock-x" onclick={() => (picked = null)} aria-label={ko ? '닫기' : 'Close'}>
						<span class="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
					<MapPreview place={picked} onopen={openWiki} />
				</aside>
			{/if}
		</div>
</main>

<WikiPeek
	selectedId={wikiId}
	expanded={wikiExpanded}
	onBack={() => {
		wikiId = null;
		wikiExpanded = false;
	}}
	onOpen={(id) => (wikiId = id)}
	onExpand={() => (wikiExpanded = true)}
	onCollapse={() => (wikiExpanded = false)}
/>

<style lang="scss">
	.map-page {
		position: fixed;
		inset: 0;
		display: flex;
		padding: 0;
		overflow: hidden;
		background: var(--bg);
	}

	.sr-only {
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

	.atlas {
		position: relative;
		flex: 1 1 auto;
		min-width: 0;
		min-height: 0;
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
		left: 0.55rem;
		bottom: calc(8.6rem + var(--tabbar-space, 0px));
		pointer-events: none;
	}

	.timepill {
		position: absolute;
		z-index: 6;
		left: 50%;
		bottom: calc(0.55rem + var(--tabbar-space, 0px));
		translate: -50% 0;
		width: min(46rem, calc(100% - 1.4rem));
		padding: 0.4rem 0.85rem 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: 1.2rem;
		background: rgb(8 8 10 / 0.78);
		backdrop-filter: blur(12px) saturate(1.2);
		-webkit-backdrop-filter: blur(12px) saturate(1.2);
		box-shadow: 0 16px 40px -24px rgb(0 0 0 / 0.7);
		pointer-events: auto;
		:global(html[data-theme='light']) & {
			background: rgb(255 252 246 / 0.9);
		}
	}

	.dock {
		position: absolute;
		z-index: 7;
		top: 3.6rem;
		right: 0.55rem;
		bottom: calc(8.6rem + var(--tabbar-space, 0px));
		width: min(22rem, calc(100% - 1.2rem));
		pointer-events: auto;
		& :global(.preview) {
			height: 100%;
		}
	}

	.dock-x {
		position: absolute;
		z-index: 2;
		top: 0.45rem;
		right: 0.45rem;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgb(8 8 10 / 0.72);
		color: var(--fg-strong);
		cursor: pointer;
		backdrop-filter: blur(8px);
		:global(html[data-theme='light']) & {
			background: rgb(255 252 246 / 0.9);
		}
		& .material-symbols-outlined {
			font-size: 1.1rem;
		}
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

	.seg.solo {
		align-self: flex-start;
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
		transition:
			color 240ms var(--ease),
			background 280ms var(--ease),
			box-shadow 280ms var(--ease),
			opacity 240ms var(--ease);
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

	.frame {
		position: absolute;
		inset: 0;
	}

	@media (max-width: 1040px) {
		.tl,
		.tr {
			top: calc(3.5rem + env(safe-area-inset-top, 0px));
		}
		.seg-btn {
			min-height: 2.35rem;
			padding: 0.4rem 0.85rem;
			font-size: 0.84rem;
		}
		.dock {
			top: calc(3.5rem + env(safe-area-inset-top, 0px));
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

</style>
