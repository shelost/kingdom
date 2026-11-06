<script lang="ts">
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import BattleMap from '$lib/components/BattleMap.svelte';
	import { STAGE_SITES, BASIS_LABEL, type StageSite, type StageSiteId } from '$lib/stage/sites';
	import { scenesFor, type StageScene } from '$lib/stage/scenes';
	import { DEFAULT_LAYERS, type Layers, type LightPreset, type StageApi, type View } from '$lib/stage/build';
	import { STAGE_LOOKS, type StageStyle } from '$lib/stage/post';

	type StageCanvasComponent = typeof import('$lib/components/stage/StageCanvas.svelte').default;

	/** The Nature switch carries every living layer of the world at once. */
	const NATURE: (keyof Layers)[] = ['nature', 'wind', 'clouds', 'mist', 'birds', 'water'];

	const HOUR_OF: Record<LightPreset, number> = { dawn: 6, day: 11, golden: 17, night: 21 };

	const VIEW_ICON: Record<string, string> = {
		board: 'landscape',
		court: 'account_balance',
		palace: 'account_balance',
		hall: 'account_balance',
		bridge: 'architecture',
		wolji: 'water',
		tower: 'filter_hdr',
		temple: 'temple_buddhist',
		plan: 'map',
		river: 'water',
		sea: 'sailing',
		shore: 'beach_access',
		ghost: 'bedtime',
		radiance: 'castle',
		well: 'water_drop',
		flowers: 'local_florist',
		port: 'sailing',
		city: 'location_city',
		gungnamji: 'park',
		jeongnimsa: 'temple_buddhist',
		kangrim: 'home',
		magistrate: 'gavel',
		wall: 'castle',
		yard: 'grass',
		amakashi: 'terrain',
		tsuki: 'park',
		fort: 'castle',
		ramp: 'stairs',
		danfeng: 'door_front',
		taiye: 'water',
		costume: 'checkroom'
	};

	function viewIcon(id: string) {
		return VIEW_ICON[id] ?? 'place';
	}

	function phase(h: number) {
		if (h < 5 || h >= 20) return 'Night';
		if (h < 8.5) return 'Dawn';
		if (h < 16) return 'Day';
		return 'Dusk';
	}

	const defaultYear = (s: StageSite) => s.defaultYear ?? s.eras[s.eras.length - 1].year;

	let site = $state<StageSiteId>('moon');
	let year = $state(defaultYear(STAGE_SITES[0]));
	let hour = $state(11);
	let style = $state<StageStyle>('natural');
	let people = $state(true);
	let boats = $state(true);
	let layers = $state<Layers>({ ...DEFAULT_LAYERS });
	let view = $state('board');
	let scene = $state<string | null>(null);
	/** Simulation scenes play on the real 3D grounds by default; the circular battle board stays as an option. */
	let simMode = $state<'grounds' | 'board'>('grounds');
	let labels = $state(true);
	let busy = $state(true);
	let views = $state<View[]>([]);
	let missing = $state(false);
	let lookOpen = $state(false);
	let lookEl = $state<HTMLElement | null>(null);
	let Stage = $state<StageCanvasComponent | null>(null);
	let api: StageApi | null = null;

	let current = $derived(STAGE_SITES.find((s) => s.id === site) ?? STAGE_SITES[0]);
	let scenes = $derived(scenesFor(site));
	let playing = $derived(scenes.find((s) => s.id === scene) ?? null);
	let onBoard = $derived(!!playing && simMode === 'board');
	let showGrounds = $derived(!onBoard);
	let look = $derived(STAGE_LOOKS.find((l) => l.id === style) ?? STAGE_LOOKS[0]);
	let nature = $derived(NATURE.every((k) => layers[k]));

	let toggles = $derived([
		{ id: 'labels', en: 'Labels', icon: 'label', on: labels, title: 'Place names', flip: () => (labels = !labels) },
		{ id: 'people', en: 'People', icon: 'groups', on: people, title: 'Commoners in undyed white, rank cloth by kingdom', flip: () => (people = !people) },
		{ id: 'boats', en: 'Boats', icon: 'sailing', on: boats, title: 'Kingdom sails, no emblems', flip: () => (boats = !boats) },
		{ id: 'nature', en: 'Nature', icon: 'forest', on: nature, title: 'Trees, grass, wind, clouds, mist, birds and ripples', flip: () => setNature(!nature) },
		{ id: 'lamps', en: 'Lamps', icon: 'emoji_objects', on: layers.lamps, title: 'Lanterns and lamp light', flip: () => (layers = { ...layers, lamps: !layers.lamps }) }
	]);

	function setNature(on: boolean) {
		const next = { ...layers };
		for (const k of NATURE) next[k] = on;
		layers = next;
	}

	function pickLook(id: StageStyle) {
		style = id;
		lookOpen = false;
	}

	function closeLook(e: PointerEvent) {
		if (lookOpen && lookEl && !lookEl.contains(e.target as Node)) lookOpen = false;
	}

	function writeUrl(nextScene: string | null) {
		const q = nextScene ? `site=${site}&scene=${nextScene}` : `site=${site}`;
		replaceState(resolve(`/stage?${q}`), {});
	}

	function preferGroundCamera() {
		if (view !== 'board') return;
		const next = views.find((v) => v.id === 'palace') ?? views.find((v) => v.id !== 'board');
		if (next) view = next.id;
	}

	function show(s: StageSite) {
		site = s.id;
		year = defaultYear(s);
		view = 'board';
		scene = null;
		simMode = 'grounds';
		hour = HOUR_OF[s.light ?? 'day'];
	}

	function pick(s: StageSite) {
		if (s.id === site) return;
		show(s);
		writeUrl(null);
	}

	function play(next: StageScene | null) {
		scene = next?.id ?? null;
		if (next) {
			year = next.year;
			preferGroundCamera();
		} else {
			simMode = 'grounds';
		}
		writeUrl(scene);
	}

	function saveStill() {
		const url = api?.capture(2400);
		if (!url) return;
		const a = document.createElement('a');
		a.href = url;
		a.download = `stage-${site}-${year}-${view}-${Math.round(hour)}.png`;
		a.click();
	}

	onMount(() => {
		const params = new URLSearchParams(location.search);
		const wanted = STAGE_SITES.find((s) => s.id === params.get('site'));
		if (wanted) show(wanted);
		const wantedScene = params.get('scene');
		const linked = wantedScene ? scenesFor(site).find((s) => s.id === wantedScene) : null;
		if (linked) {
			scene = linked.id;
			year = linked.year;
		}
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

<svelte:window onpointerdown={closeLook} onkeydown={(e) => e.key === 'Escape' && (lookOpen = false)} />

<main class="stage">
	<SiteNavSpace />
	<div class="frame">
		<section
			class={['view', { playing: onBoard }]}
			aria-label={playing ? `${playing.en}${onBoard ? ' · board' : ' · stage'}` : '3D grounds'}
		>
			{#if onBoard && playing}
				<BattleMap block={{ kind: 'battle', battle: playing.id, full: true }} fit />
			{:else if Stage}
				<Stage
					{site}
					{year}
					{hour}
					{style}
					{people}
					{boats}
					{layers}
					{view}
					{labels}
					onbusy={(b) => (busy = b)}
					onbuilt={(info) => {
						views = info?.views ?? [];
						missing = !info;
						if (playing) preferGroundCamera();
					}}
					onapi={(a) => (api = a)}
				/>
			{/if}

			{#if showGrounds && (busy || !Stage)}
				<p class="busy">Raising the walls…</p>
			{:else if showGrounds && missing}
				<p class="busy">This site is still being rebuilt.</p>
			{/if}

			<div class="bar top">
				<div class="group">
					{#if scenes.length}
						<div class="pill seg scenes" role="group" aria-label="Scenes">
							<button type="button" class={{ on: !playing }} onclick={() => play(null)}>Grounds</button>
							{#each scenes as s (s.id)}
								<button type="button" class={{ on: playing?.id === s.id }} onclick={() => play(s)} title={s.note}>{s.en}</button>
							{/each}
						</div>
					{/if}
					{#if playing}
						<div class="pill seg" role="group" aria-label="Simulation surface">
							<button type="button" class={{ on: simMode === 'grounds' }} onclick={() => (simMode = 'grounds')} title="Play on the real 3D grounds">Stage</button>
							<button type="button" class={{ on: simMode === 'board' }} onclick={() => (simMode = 'board')} title="Circular battle board (simplified)">Board</button>
						</div>
					{/if}
				</div>

				{#if showGrounds}
					<div class="group">
						<div class="pill hour">
							<input
								type="range"
								min="0"
								max="24"
								step="0.25"
								value={hour}
								aria-label="Time of day"
								aria-valuetext={phase(hour)}
								title={phase(hour)}
								oninput={(e) => (hour = Number(e.currentTarget.value))}
							/>
						</div>

						<div class="look" bind:this={lookEl}>
							<button type="button" class="pill pick" aria-haspopup="listbox" aria-expanded={lookOpen} onclick={() => (lookOpen = !lookOpen)}>
								<span class="material-symbols-outlined" aria-hidden="true">{look.icon}</span>
								{look.en}
								<span class="material-symbols-outlined chev" aria-hidden="true">expand_more</span>
							</button>
							{#if lookOpen}
								<div class="menu" role="listbox" aria-label="Look">
									{#each STAGE_LOOKS as l (l.id)}
										<button type="button" role="option" aria-selected={style === l.id} class={{ on: style === l.id }} onclick={() => pickLook(l.id)}>
											<span class="material-symbols-outlined" aria-hidden="true">{l.icon}</span>
											<span class="name">{l.en}<small>{l.ko}</small></span>
											{#if style === l.id}<span class="material-symbols-outlined tick" aria-hidden="true">check</span>{/if}
										</button>
									{/each}
								</div>
							{/if}
						</div>

						<div class="pill seg" role="group" aria-label="Show">
							{#each toggles as t (t.id)}
								<button type="button" class={{ on: t.on }} aria-pressed={t.on} title={t.title} onclick={t.flip}>
									<span class="material-symbols-outlined" aria-hidden="true">{t.icon}</span>
									{t.en}
								</button>
							{/each}
						</div>

						<button type="button" class="pill round" onclick={saveStill} disabled={busy || missing} aria-label="Save still" title="Save still">
							<span class="material-symbols-outlined" aria-hidden="true">photo_camera</span>
						</button>
					</div>
				{/if}
			</div>

			{#if showGrounds && views.length}
				<div class="bar bottom">
					<div class="pill seg views" role="group" aria-label="Camera">
						{#each views as v (v.id)}
							<button type="button" class={{ on: view === v.id }} onclick={() => (view = v.id)} title={v.ko}>
								<span class="material-symbols-outlined" aria-hidden="true">{viewIcon(v.id)}</span>
								{v.en}
							</button>
						{/each}
					</div>
				</div>
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
			<p class={['basis', current.basis.kind]}><b>{BASIS_LABEL[current.basis.kind].en}</b> {current.basis.note}</p>
			{#if playing?.note}
				<p class="place">{playing.note}</p>
			{/if}

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
		--glass-ink: rgb(20 20 24 / 0.88);
		--glass-dim: rgb(20 20 24 / 0.5);
		position: relative;
		min-height: 0;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--hairline);
		background: #cfdbe2;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Apple SD Gothic Neo', 'Helvetica Neue', system-ui, sans-serif;
	}

	.view.playing {
		overflow: auto;
		background: var(--bg);
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
		left: 0.65rem;
		right: 0.65rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.45rem;
		pointer-events: none;
	}

	.bar.top {
		top: 0.65rem;
	}

	.bar.bottom {
		bottom: 0.75rem;
		justify-content: center;
	}

	.group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	/* ---------------------------------------------------------- frosted pills */

	.pill {
		display: flex;
		align-items: center;
		min-height: 2.25rem;
		padding: 3px;
		border: 0;
		border-radius: 999px;
		color: var(--glass-ink);
		background: rgb(250 250 252 / 0.6);
		backdrop-filter: blur(22px) saturate(1.8);
		-webkit-backdrop-filter: blur(22px) saturate(1.8);
		box-shadow:
			inset 0 0 0 0.5px rgb(0 0 0 / 0.1),
			inset 0 1px 0 rgb(255 255 255 / 0.55),
			0 6px 20px rgb(0 0 0 / 0.12);
		pointer-events: auto;
		font: inherit;
	}

	.seg {
		flex-wrap: wrap;
		gap: 1px;
	}

	.seg.scenes {
		max-width: min(100%, 36rem);
	}

	.seg button {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		min-height: 1.875rem;
		padding: 0 0.72rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--glass-dim);
		font: inherit;
		font-size: 0.76rem;
		font-weight: 590;
		letter-spacing: -0.01em;
		cursor: pointer;
		transition:
			background 0.18s,
			color 0.18s,
			box-shadow 0.18s;
	}

	.seg button:hover {
		color: var(--glass-ink);
	}

	.seg button.on {
		color: var(--glass-ink);
		background: rgb(255 255 255 / 0.92);
		box-shadow:
			0 1px 3px rgb(0 0 0 / 0.12),
			0 0 0 0.5px rgb(0 0 0 / 0.05);
	}

	.material-symbols-outlined {
		font-size: 1.08rem;
		font-variation-settings:
			'FILL' 0,
			'wght' 500,
			'GRAD' 0,
			'opsz' 20;
	}

	.seg button.on .material-symbols-outlined {
		font-variation-settings:
			'FILL' 1,
			'wght' 500,
			'GRAD' 0,
			'opsz' 20;
	}

	.seg.views button {
		font-size: 0.8rem;
		padding: 0 0.85rem;
		min-height: 2.1rem;
	}

	.pill.round {
		justify-content: center;
		width: 2.25rem;
		padding: 0;
		cursor: pointer;
	}

	.pill.round:disabled {
		opacity: 0.45;
		cursor: default;
	}

	/* ---------------------------------------------------------- the hour: a sky you can scrub */

	.hour input {
		--h: 1.875rem;
		appearance: none;
		-webkit-appearance: none;
		width: 10.5rem;
		height: var(--h);
		margin: 0;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			#1b2742 0%,
			#2c3a63 17%,
			#e7a98f 23%,
			#f3d6b4 30%,
			#a9d0f2 40%,
			#8fc2ee 62%,
			#f2c17c 71%,
			#e4875a 77%,
			#3a3d6a 84%,
			#1b2742 100%
		);
		box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 0.12);
		cursor: pointer;
	}

	.hour input::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: var(--h);
		height: var(--h);
		border-radius: 50%;
		background: #fff;
		box-shadow:
			0 1px 4px rgb(0 0 0 / 0.28),
			0 0 0 0.5px rgb(0 0 0 / 0.08);
	}

	.hour input::-moz-range-thumb {
		width: var(--h);
		height: var(--h);
		border: 0;
		border-radius: 50%;
		background: #fff;
		box-shadow:
			0 1px 4px rgb(0 0 0 / 0.28),
			0 0 0 0.5px rgb(0 0 0 / 0.08);
	}

	.hour input:focus-visible {
		outline: 2px solid rgb(0 122 255 / 0.6);
		outline-offset: 1px;
	}

	/* ---------------------------------------------------------- the look menu */

	.look {
		position: relative;
		pointer-events: auto;
	}

	.pick {
		gap: 0.35rem;
		padding: 0 0.6rem 0 0.75rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		cursor: pointer;
	}

	.pick .chev {
		font-size: 1.1rem;
		color: var(--glass-dim);
	}

	.menu {
		position: absolute;
		top: calc(100% + 0.4rem);
		right: 0;
		z-index: 30;
		display: grid;
		min-width: 12rem;
		padding: 5px;
		border-radius: 14px;
		background: rgb(250 250 252 / 0.78);
		backdrop-filter: blur(26px) saturate(1.8);
		-webkit-backdrop-filter: blur(26px) saturate(1.8);
		box-shadow:
			inset 0 0 0 0.5px rgb(0 0 0 / 0.1),
			0 12px 36px rgb(0 0 0 / 0.2);
	}

	.menu button {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.45rem 0.6rem;
		border: 0;
		border-radius: 9px;
		background: transparent;
		color: var(--glass-ink);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 550;
		text-align: left;
		cursor: pointer;
	}

	.menu button:hover {
		background: rgb(0 0 0 / 0.06);
	}

	.menu .name {
		flex: 1;
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}

	.menu small {
		font-size: 0.68rem;
		color: var(--glass-dim);
	}

	.menu .tick {
		color: rgb(0 122 255);
	}

	/* ---------------------------------------------------------- the side column */

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

	.basis {
		margin: 0.55rem 0 0;
		padding: 0.4rem 0.55rem;
		border-radius: var(--radius);
		font-size: 0.76rem;
		line-height: 1.35;
		color: var(--fg-dim);
		border: 1px solid var(--hairline);
	}

	.basis b {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--fg);
	}

	.basis.historical {
		border-color: color-mix(in srgb, #8fb06a 55%, var(--hairline));
	}

	.basis.mixed {
		border-color: color-mix(in srgb, #d8b46a 55%, var(--hairline));
	}

	.basis.fictional {
		border-color: color-mix(in srgb, #b28fcc 60%, var(--hairline));
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
			bottom: 0.55rem;
		}
	}
</style>
