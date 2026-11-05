<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import BattleMap from '$lib/components/BattleMap.svelte';
	import { STAGE_SITES, STATUS_LEGEND, type StageSite, type StageSiteId } from '$lib/stage/sites';
	import { scenesFor, type StageScene } from '$lib/stage/scenes';
	import type { LightPreset, Quality, StageApi, View } from '$lib/stage/build';

	type StageCanvasComponent = typeof import('$lib/components/stage/StageCanvas.svelte').default;

	const LIGHTS: { id: LightPreset; en: string; ko: string }[] = [
		{ id: 'dawn', en: 'Dawn', ko: '새벽' },
		{ id: 'day', en: 'Day', ko: '낮' },
		{ id: 'golden', en: 'Dusk', ko: '해질녘' },
		{ id: 'night', en: 'Night', ko: '밤' }
	];

	const defaultYear = (s: StageSite) => s.defaultYear ?? s.eras[s.eras.length - 1].year;

	let site = $state<StageSiteId>('moon');
	let year = $state(defaultYear(STAGE_SITES[0]));
	let light = $state<LightPreset>('day');
	let quality = $state<Quality>('balanced');
	let view = $state('board');
	let scene = $state<string | null>(null);
	let labels = $state(true);
	let busy = $state(true);
	let views = $state<View[]>([]);
	let missing = $state(false);
	let buildMs = $state(0);
	let Stage = $state<StageCanvasComponent | null>(null);
	let api: StageApi | null = null;

	let current = $derived(STAGE_SITES.find((s) => s.id === site) ?? STAGE_SITES[0]);
	let scenes = $derived(scenesFor(site));
	let playing = $derived(scenes.find((s) => s.id === scene) ?? null);

	function writeUrl(nextScene: string | null) {
		const q = nextScene ? `site=${site}&scene=${nextScene}` : `site=${site}`;
		replaceState(resolve(`/stage?${q}`), {});
	}

	function show(s: StageSite) {
		site = s.id;
		year = defaultYear(s);
		view = 'board';
		scene = null;
		if (s.light) light = s.light;
	}

	function pick(s: StageSite) {
		if (s.id === site) return;
		show(s);
		writeUrl(null);
	}

	function play(next: StageScene | null) {
		scene = next?.id ?? null;
		writeUrl(scene);
	}

	function saveStill() {
		const url = api?.capture(2400);
		if (!url) return;
		const a = document.createElement('a');
		a.href = url;
		a.download = `stage-${site}-${year}-${view}-${light}.png`;
		a.click();
	}

	onMount(() => {
		const params = new URLSearchParams(location.search);
		const wanted = STAGE_SITES.find((s) => s.id === params.get('site'));
		if (wanted) show(wanted);
		const wantedScene = params.get('scene');
		if (wantedScene && scenesFor(site).some((s) => s.id === wantedScene)) scene = wantedScene;
		void import('$lib/components/stage/StageCanvas.svelte').then((m) => {
			Stage = m.default;
		});
	});
</script>

<svelte:head>
	<title>Stage · King for All</title>
	<meta
		name="description"
		content="3D grounds of the Three Kingdoms: Wolseong, Sabi, Pyongyang, Wirye, and the fortresses of Ansi, Daeya, the Yeon clan and Tamla."
	/>
</svelte:head>

<main class="stage">
	<SiteNavSpace />
	<div class="frame">
		<section class={['view', { playing: !!playing }]} aria-label={playing ? playing.en : '3D grounds'}>
			{#if playing}
				<BattleMap block={{ kind: 'battle', battle: playing.id, full: true }} fit />
			{:else if Stage}
				<Stage
					{site}
					{year}
					{light}
					{quality}
					{view}
					{labels}
					onbusy={(b) => (busy = b)}
					onbuilt={(info) => {
						views = info?.views ?? [];
						missing = !info;
						buildMs = info?.ms ?? 0;
					}}
					onapi={(a) => (api = a)}
				/>
			{/if}

			{#if !playing && (busy || !Stage)}
				<p class="busy">Raising the walls…</p>
			{:else if !playing && missing}
				<p class="busy">This site is still being rebuilt.</p>
			{/if}

			<div class="bar top">
				{#if scenes.length}
					<div class="seg scenes" role="group" aria-label="Scenes">
						<button type="button" class={{ on: !playing }} onclick={() => play(null)}>Grounds</button>
						{#each scenes as s (s.id)}
							<button type="button" class={{ on: playing?.id === s.id }} onclick={() => play(s)} title={s.note}>{s.en}</button>
						{/each}
					</div>
				{/if}
				{#if !playing}
					<div class="seg" role="group" aria-label="Era">
						{#each current.eras as e (e.year)}
							<button type="button" class={{ on: year === e.year }} onclick={() => (year = e.year)} title={e.ko}>{e.en}</button>
						{/each}
					</div>
					<div class="seg" role="group" aria-label="Light">
						{#each LIGHTS as l (l.id)}
							<button type="button" class={{ on: light === l.id }} onclick={() => (light = l.id)} title={l.ko}>{l.en}</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if !playing}
			<div class="bar bottom">
				<div class="seg views" role="group" aria-label="Camera">
					{#each views as v (v.id)}
						<button type="button" class={{ on: view === v.id }} onclick={() => (view = v.id)} title={v.ko}>{v.en}</button>
					{/each}
				</div>
				<div class="seg">
					<button type="button" class={{ on: labels }} onclick={() => (labels = !labels)}>Labels</button>
					<button
						type="button"
						class={{ on: quality === 'cinematic' }}
						onclick={() => (quality = quality === 'cinematic' ? 'balanced' : 'cinematic')}
						title="Cinematic: sharper shadows, higher resolution, heavier GPU"
					>
						Cinematic
					</button>
					<button type="button" onclick={saveStill} disabled={busy || missing}>Save still · 2:1</button>
				</div>
			</div>
			{/if}

			{#if !playing}
			<p class="hint">
				Drag to orbit · right-drag to pan · scroll to zoom{#if buildMs}<span> · built in {(buildMs / 1000).toFixed(1)} s</span>{/if}
			</p>
			{/if}
		</section>

		<aside>
			<nav class="picks" aria-label="Sites">
				{#each STAGE_SITES as s (s.id)}
					<button type="button" class={{ on: site === s.id }} onclick={() => pick(s)}>
						<span class="ko">{s.ko}</span>
						<span class="en">{s.en}</span>
					</button>
				{/each}
			</nav>

			<h1>{current.ko} <span>{current.en}</span></h1>
			<p class="place">{current.place}</p>
			<p class="years">{current.years}</p>
			{#if playing?.note}
				<p class="place">{playing.note}</p>
			{/if}

			<ul class="legend" aria-label="Label key">
				{#each STATUS_LEGEND as s (s.id)}
					<li class={s.id}><i>{s.ko}</i>{s.en}</li>
				{/each}
			</ul>

			<ul class="facts">
				{#each current.facts as fact, i (i)}
					<li>{fact}</li>
				{/each}
			</ul>

			<div class="refs">
				{#each current.refs as ref (ref.src)}
					<figure>
						<img src={ref.src} alt={ref.caption} />
						<figcaption>{ref.caption}</figcaption>
					</figure>
				{/each}
			</div>

			{#if current.credit}
				<p class="credit">{current.credit}</p>
			{/if}
		</aside>
	</div>
</main>

<style>
	.stage {
		height: 100svh;
		max-height: 100svh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.frame {
		flex: 1;
		min-height: 0;
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(17rem, 24rem);
		gap: 0.75rem;
		padding: 0 0.9rem calc(0.7rem + var(--tabbar-space, 0px));
	}

	.view {
		position: relative;
		min-height: 0;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--hairline);
		background: #cfdbe2;
	}

	.view.playing {
		overflow: auto;
		background: var(--bg);
	}

	.seg.scenes {
		max-width: min(100%, 36rem);
	}

	.busy {
		position: absolute;
		inset: 0;
		margin: 0;
		display: grid;
		place-items: center;
		font-family: var(--serif);
		font-size: 1rem;
		color: #2b241b;
		background: color-mix(in srgb, #e9e2d2 55%, transparent);
		backdrop-filter: blur(2px);
		pointer-events: none;
	}

	.bar {
		position: absolute;
		left: 0.6rem;
		right: 0.6rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.4rem;
		pointer-events: none;
	}

	.bar.top {
		top: 0.6rem;
	}

	.bar.bottom {
		bottom: 2rem;
	}

	.seg {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding: 2px;
		border-radius: 999px;
		background: color-mix(in srgb, #f6efe1 82%, transparent);
		border: 1px solid color-mix(in srgb, #2b241b 16%, transparent);
		box-shadow: 0 1px 6px rgb(0 0 0 / 0.14);
		pointer-events: auto;
	}

	.seg button {
		border: 0;
		background: transparent;
		color: #2b241b;
		font-size: 0.72rem;
		padding: 0.28rem 0.6rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.seg button.on {
		background: #2b241b;
		color: #f6efe1;
	}

	.seg button:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.hint {
		position: absolute;
		left: 0.7rem;
		bottom: 0.5rem;
		margin: 0;
		font-size: 0.68rem;
		color: #2b241b;
		background: color-mix(in srgb, #f6efe1 80%, transparent);
		padding: 0.15rem 0.45rem;
		border-radius: 999px;
		pointer-events: none;
	}

	aside {
		min-height: 0;
		overflow: auto;
		padding-right: 0.2rem;
	}

	.picks {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem;
		margin-bottom: 0.8rem;
	}

	.picks button {
		text-align: left;
		padding: 0.45rem 0.55rem;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	.picks button.on {
		border-color: color-mix(in srgb, var(--gold) 65%, var(--hairline));
		background: color-mix(in srgb, var(--gold) 12%, transparent);
	}

	.ko {
		display: block;
		font-family: var(--serif);
		font-size: 0.95rem;
	}

	.en {
		display: block;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.55rem;
		font-weight: 600;
		line-height: 1.1;
	}

	h1 span {
		display: block;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--fg-dim);
	}

	.place,
	.years {
		margin: 0.35rem 0 0;
		font-size: 0.82rem;
		line-height: 1.35;
		color: var(--fg-dim);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.6rem;
		margin: 0.7rem 0 0;
		padding: 0;
		list-style: none;
		font-size: 0.7rem;
		color: var(--fg-dim);
	}

	.legend i {
		font-style: normal;
		margin-right: 0.25rem;
		padding: 0 0.3rem;
		border-radius: 999px;
		color: #2b241b;
		background: #ddd2bd;
	}

	.legend .survey i,
	.legend .standing i {
		background: #bcd3a8;
	}

	.legend .excavated i {
		background: #e3c58f;
	}

	.legend .recorded i {
		background: #c9d3e6;
	}

	.legend .placed i {
		background: #e5c3bd;
	}

	.facts {
		margin: 0.7rem 0 0;
		padding: 0 0 0 1rem;
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--fg);
	}

	.facts li + li {
		margin-top: 0.45rem;
	}

	.refs {
		display: grid;
		gap: 0.45rem;
		margin-top: 0.8rem;
	}

	figure {
		margin: 0;
	}

	img {
		width: 100%;
		height: auto;
		border-radius: var(--radius);
		display: block;
		background: var(--panel-sunken);
	}

	figcaption {
		margin-top: 0.2rem;
		font-size: 0.7rem;
		color: var(--fg-faint);
	}

	.credit {
		margin: 0.7rem 0 0.4rem;
		font-size: 0.66rem;
		color: var(--fg-faint);
	}

	@media (max-width: 860px) {
		.stage {
			height: auto;
			max-height: none;
			overflow: auto;
		}

		.frame {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(18rem, 60svh) auto;
		}

		.bar.bottom {
			bottom: 1.8rem;
		}
	}
</style>
