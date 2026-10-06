<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import SceneMobile from '$lib/components/SceneMobile.svelte';
	import SceneLyrics from '$lib/components/SceneLyrics.svelte';
	import ScenePlayer from '$lib/components/ScenePlayer.svelte';
	import SceneLoop from '$lib/components/SceneLoop.svelte';
	import SceneFrameEdit from '$lib/components/SceneFrameEdit.svelte';
	import AlbumCover from '$lib/components/AlbumCover.svelte';
	import { resolve } from '$app/paths';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { editUi } from '$lib/editUi.svelte';
	import { isReferenceImage } from '$lib/imageStars';
	import { starKey } from '$lib/imageStarsUi.svelte';
	import { openImageMenu } from '$lib/imageMenu.svelte';
	import { storyImg } from '$lib/img';
	import { hasLyricsForScene } from '$lib/lyrics';
	import { initMusic, playOrPause, playTrack, stopTrack, music, toggleMute } from '$lib/music.svelte';
	import {
	scenesForPage,
	trackOf,
	audioLabel,
	audioArtist,
	audioCredit,
	sceneFrames,
	isLoveScene,
	isPersonScene,
	type Scene
} from '$lib/scenes';

	const scenes = scenesForPage();
	let editing = $derived(editUi.enabled);
	/** Frame order edited this session. The file is updated underneath. */
	let frameEdits = $state<Record<string, string[]>>({});

	function framesOf(scene: Scene): string[] {
		return frameEdits[scene.id] ?? [...sceneFrames(scene)];
	}

	function coverOf(scene: Scene): string {
		return scene.cover || framesOf(scene)[0] || scene.image;
	}

	async function persistFrames(id: string, frames: string[]) {
		frameEdits = { ...frameEdits, [id]: frames };
		const res = await fetch(resolve('/api/scene-frames'), {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id, frames })
		});
		if (!res.ok) window.alert('Could not save this sequence');
	}

	function reorderActive(frames: string[]) {
		if (!active) return;
		void persistFrames(active.id, frames);
	}

	/** Frame the live still reported last, tagged with its scene. */
	let shown = $state<{ id: string; index: number }>({ id: '', index: 0 });
	/** Click in the sequence rail. `token` forces the still to jump even to the same index. */
	let frameCue = $state<{ id: string; index: number; token: number } | null>(null);

	function showFrame(index: number) {
		if (!active) return;
		shown = { id: active.id, index };
		frameCue = { id: active.id, index, token: (frameCue?.token ?? 0) + 1 };
	}

	/** Edit-mode right-click on a still (sequence rail or the live frame). Remove drops it from the song. */
	function openFrameMenu(sceneId: string, event: MouseEvent, index: number) {
		const src = frameSrc(sceneId, index);
		if (!src || isReferenceImage(src)) return;
		const count = frameCount(sceneId);
		openImageMenu(event, {
			label: `Still ${index + 1} of ${count}`,
			starKey: starKey(src),
			remove: count > 1 ? () => removeFrame(sceneId, index) : undefined,
			removeHint: 'A song needs at least one still'
		});
	}

	function frameCount(sceneId: string): number {
		const scene = scenes.find((s) => s.id === sceneId);
		return scene ? framesOf(scene).length : 0;
	}

	function frameSrc(sceneId: string, index: number): string {
		const scene = scenes.find((s) => s.id === sceneId);
		return scene ? (framesOf(scene)[index] ?? coverOf(scene)) : '';
	}

	function removeFrame(sceneId: string, index: number) {
		const scene = scenes.find((s) => s.id === sceneId);
		if (!scene) return;
		const frames = framesOf(scene).filter((_, i) => i !== index);
		if (!frames.length) return;
		void persistFrames(sceneId, frames);
	}

	/** `?scene=<id>` — the song on screen, so a reload or a shared link lands on it. */
	const SCENE_QUERY = 'scene';

	function sceneFromUrl(): Scene | null {
		const id = page.url.searchParams.get(SCENE_QUERY);
		return id ? (scenes.find((s) => s.id === id) ?? null) : null;
	}

	/* A linked song is the first scene on screen; it is not armed until the reader plays. */
	let activeId = $state(sceneFromUrl()?.id ?? scenes[0]?.id ?? '');
	let armed = $state(false);
	/** Album-cover grid. Off keeps the snap feed. */
	let grid = $state(false);
	/** Phones get the library + Now Playing sheet instead of the feed. SSR renders the desktop. */
	const phone = new MediaQuery('max-width: 720px', false);
	/** Set by `wireFeed` while the desktop feed is mounted. */
	let feedEl: HTMLElement | undefined;
	let railEl: HTMLElement | undefined = $state();

	let active = $derived(scenes.find((s) => s.id === activeId) ?? scenes[0] ?? null);
	/** Frame the sequence rail marks. A scene that has not reported yet is on frame one. */
	let shownFrame = $derived(shown.id === activeId ? shown.index : 0);

	/** False until mount, so the address bar is only written in the browser. */
	let urlReady = $state(false);

	$effect(() => {
		if (!urlReady || !activeId) return;
		/* `location`, not `page.url`: a fallback history write never reaches page state. */
		const url = new URL(location.href);
		if (url.searchParams.get(SCENE_QUERY) === activeId) return;
		url.searchParams.set(SCENE_QUERY, activeId);
		try {
			replaceState(`${url.pathname}${url.search}${url.hash}`, untrack(() => page.state));
		} catch {
			history.replaceState(history.state, '', url);
		}
	});
	let activeIndex = $derived(Math.max(0, scenes.findIndex((s) => s.id === activeId)));

	/** Scene id we are jumping to with play intent (thumb / next / prev). */
	let pendingPlayId: string | null = null;
	/** Smooth-scroll destination. Panels we only pass must not start their own players. */
	let scrollTargetId: string | null = null;
	/** Scene the feed last measured as most visible. */
	let visibleId: string | null = null;
	let audioTimer: number | undefined;
	let jumpTimer: number | undefined;

	function panelFor(id: string): HTMLElement | null {
		return feedEl?.querySelector<HTMLElement>(`[data-scene-id="${CSS.escape(id)}"]`) ?? null;
	}

	/** The panel whose top sits closest to the top of the feed, measured now. */
	function sceneInView(): string | null {
		if (!feedEl) return null;
		const top = feedEl.getBoundingClientRect().top;
		let best: { id: string; gap: number } | null = null;
		for (const el of feedEl.querySelectorAll<HTMLElement>('[data-scene-id]')) {
			const gap = Math.abs(el.getBoundingClientRect().top - top);
			if (!best || gap < best.gap) best = { id: el.dataset.sceneId ?? '', gap };
		}
		return best?.id || null;
	}

	/*
	 * `scrollTo` on each scroller, never two `scrollIntoView` calls in a row: Chrome
	 * cancels the first smooth scrollIntoView when a second one starts elsewhere.
	 * `instant`, not `auto`: the feed's CSS makes `auto` smooth.
	 */
	function scrollFeedTo(id: string, smooth: boolean): boolean {
		const panel = panelFor(id);
		if (!feedEl || !panel) return false;
		const delta = panel.getBoundingClientRect().top - feedEl.getBoundingClientRect().top;
		if (Math.abs(delta) < 2) return false;
		feedEl.scrollTo({ top: feedEl.scrollTop + delta, behavior: smooth ? 'smooth' : 'instant' });
		return true;
	}

	function revealThumb(id: string, smooth = true) {
		const thumb = railEl?.querySelector<HTMLElement>(`[data-thumb-id="${CSS.escape(id)}"]`);
		if (!railEl || !thumb) return;
		const rail = railEl.getBoundingClientRect();
		const box = thumb.getBoundingClientRect();
		let delta = 0;
		if (box.top < rail.top) delta = box.top - rail.top - 12;
		else if (box.bottom > rail.bottom) delta = box.bottom - rail.bottom + 12;
		if (!delta) return;
		railEl.scrollTo({ top: railEl.scrollTop + delta, behavior: smooth ? 'smooth' : 'instant' });
	}

	/** Programmatic jump. Panels passed on the way are ignored until it lands. */
	function jumpFeed(id: string, smooth: boolean) {
		window.clearTimeout(jumpTimer);
		scrollTargetId = id;
		const moving = scrollFeedTo(id, smooth);
		revealThumb(id, smooth);
		if (!moving) {
			scrollTargetId = null;
			return;
		}
		jumpTimer = window.setTimeout(() => finishJump(id), smooth ? 1600 : 150);
	}

	/** A jump that stopped short (snap, interrupted animation) is set onto its target. */
	function finishJump(id: string) {
		window.clearTimeout(jumpTimer);
		if (scrollTargetId !== id) return;
		scrollTargetId = null;
		if (sceneInView() !== id) scrollFeedTo(id, false);
	}

	function schedulePlay(id: string) {
		window.clearTimeout(audioTimer);
		audioTimer = window.setTimeout(() => {
			if (activeId !== id || scrollTargetId) return;
			const scene = scenes.find((s) => s.id === id);
			if (!scene) return;
			playScene(scene);
		}, 200);
	}

	/** True when the transport should keep sounding across slide changes (mute is separate). */
	function isTransportPlaying() {
		return music.armed && !music.paused;
	}

	function arm() {
		if (armed) return;
		armed = true;
		music.muted = false;
		try {
			localStorage.setItem('kingdom:muted', '0');
		} catch {
			/* private mode */
		}
	}

	function playScene(scene: Scene) {
		activeId = scene.id;
		const track = trackOf(scene);
		playTrack(track);
	}

	async function goTo(scene: Scene, opts: { play?: boolean; smooth?: boolean } = {}) {
		const wantPlay = opts.play === true;
		pendingPlayId = wantPlay ? scene.id : null;
		activeId = scene.id;
		window.clearTimeout(audioTimer);
		if (!wantPlay) stopTrack({ keepPauseState: true });
		if (grid || phone.current) {
			scrollTargetId = null;
			if (wantPlay) playScene(scene);
			return;
		}
		scrollTargetId = scene.id;
		await tick();
		jumpFeed(scene.id, opts.smooth !== false);
		if (wantPlay) playScene(scene);
	}

	function onThumbClick(scene: Scene) {
		arm();
		music.paused = false;
		void goTo(scene, { play: true });
	}

	function onFeedActivate(scene: Scene) {
		arm();
		music.paused = false;
		playScene(scene);
	}

	function step(delta: number) {
		const next = scenes[activeIndex + delta];
		if (!next) return;
		/* Prev/next keeps whatever play/pause the user left the transport in. */
		void goTo(next, { play: isTransportPlaying() });
	}

	async function toggleGrid() {
		const showFeed = grid;
		grid = !grid;
		if (!showFeed) return;
		await tick();
		jumpFeed(activeId, false);
	}

	function onPlayerPlay() {
		arm();
		music.paused = false;
		if (active) playScene(active);
	}

	/*
	 * The snap feed's scroll tracking. An attachment rather than onMount so the feed
	 * can come and go when the window crosses the phone breakpoint.
	 */
	const wireFeed: Attachment<HTMLElement> = (el) => {
		feedEl = el;
		/* Open on the current scene: a linked song, or the one picked on the phone layout. */
		jumpFeed(untrack(() => activeId), false);
		const ratios = new Map<string, number>();

		const io = new IntersectionObserver(
			(entries) => {
				if (grid) return;
				let best: { id: string; ratio: number } | null = null;

				for (const e of entries) {
					const id = (e.target as HTMLElement).dataset.sceneId;
					if (!id) continue;
					ratios.set(id, e.intersectionRatio);
				}

				for (const [id, ratio] of ratios) {
					if (ratio < 0.55) continue;
					if (!best || ratio > best.ratio) best = { id, ratio };
				}

				if (best) visibleId = best.id;

				if (!best || best.ratio < 0.55) {
					const activeRatio = activeId ? (ratios.get(activeId) ?? 0) : 0;
					if (!scrollTargetId && activeRatio < 0.45 && music.current) {
						window.clearTimeout(audioTimer);
						stopTrack({ keepPauseState: true });
					}
					return;
				}

				if (scrollTargetId) {
					if (best.id !== scrollTargetId) return;
					window.clearTimeout(jumpTimer);
					scrollTargetId = null;
					pendingPlayId = null;
					return;
				}

				if (best.id === activeId) {
					if (pendingPlayId === best.id) pendingPlayId = null;
					/* Snapped back onto the scene we just silenced. */
					if (!music.current && isTransportPlaying()) schedulePlay(best.id);
					return;
				}

				const scene = scenes.find((s) => s.id === best!.id);
				if (!scene) return;

				const keepPlaying = pendingPlayId === scene.id || isTransportPlaying();
				pendingPlayId = null;
				activeId = scene.id;
				revealThumb(scene.id);

				window.clearTimeout(audioTimer);
				stopTrack({ keepPauseState: true });
				if (keepPlaying) schedulePlay(scene.id);
			},
			{ root: el, threshold: [0.25, 0.45, 0.55, 0.7, 0.85] }
		);

		for (const panel of el.querySelectorAll<HTMLElement>('[data-scene-id]')) io.observe(panel);

		const onUserScroll = () => {
			window.clearTimeout(jumpTimer);
			scrollTargetId = null;
		};
		/* Scrollbar drags land on the feed itself; clicks on a still do not. */
		const onFeedPointer = (e: PointerEvent) => {
			if (e.target === el) onUserScroll();
		};
		/* The screen is the truth once scrolling stops: header, sequence and song follow it. */
		const onScrollEnd = () => {
			if (grid) return;
			if (scrollTargetId) {
				finishJump(scrollTargetId);
				return;
			}
			const id = sceneInView();
			visibleId = id;
			if (!id || id === activeId) return;
			const keep = isTransportPlaying();
			activeId = id;
			revealThumb(id);
			window.clearTimeout(audioTimer);
			stopTrack({ keepPauseState: true });
			if (keep) schedulePlay(id);
		};
		el.addEventListener('wheel', onUserScroll, { passive: true });
		el.addEventListener('touchmove', onUserScroll, { passive: true });
		el.addEventListener('pointerdown', onFeedPointer);
		el.addEventListener('scrollend', onScrollEnd);

		return () => {
			io.disconnect();
			window.clearTimeout(jumpTimer);
			el.removeEventListener('wheel', onUserScroll);
			el.removeEventListener('touchmove', onUserScroll);
			el.removeEventListener('pointerdown', onFeedPointer);
			el.removeEventListener('scrollend', onScrollEnd);
			scrollTargetId = null;
			if (feedEl === el) feedEl = undefined;
		};
	};

	onMount(() => {
		const endMusic = initMusic();
		urlReady = true;

		const onKey = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement | null)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;

			if (e.key === 'ArrowDown' || e.key === 'j') {
				e.preventDefault();
				step(1);
			} else if (e.key === 'ArrowUp' || e.key === 'k') {
				e.preventDefault();
				step(-1);
			} else if (e.key === 'm') {
				e.preventDefault();
				arm();
				toggleMute();
				if (active && !music.muted) playScene(active);
			} else if (e.key === ' ') {
				e.preventDefault();
				playOrPause(onPlayerPlay);
			}
		};
		window.addEventListener('keydown', onKey);

		return () => {
			window.clearTimeout(audioTimer);
			window.removeEventListener('keydown', onKey);
			stopTrack();
			endMusic();
		};
	});
</script>

<svelte:head>
	<title>Scenes · King for All</title>
	<meta
		name="description"
		content="TikTok-style chronicle scenes — stills with house themes and downloaded classical beds."
	/>
</svelte:head>

{#snippet sceneCaption(scene: Scene)}
	<span class="meta">
		<AlbumCover src={coverOf(scene)} alt="" live={activeId === scene.id} />
		<span class="shot-title">
			{scene.title}
			{#if isPersonScene(scene)}
				<span class="person-dot inline" title="Their theme" aria-hidden="true"></span>
			{/if}
			{#if isLoveScene(scene)}
				<span class="love-dot inline" title="Love story" aria-hidden="true"></span>
			{/if}
		</span>
		<span class="shot-place">{scene.place}</span>
		{#if audioArtist(scene)}
			<span class="shot-artist">{audioArtist(scene)}</span>
		{/if}
		<span class="shot-audio">{audioLabel(scene)}</span>
		<span class="shot-credit">{audioCredit(scene)}</span>
	</span>
{/snippet}

<main class="scenes" class:phone={phone.current}>
	{#if phone.current}
		<SceneMobile
			{scenes}
			{activeId}
			{coverOf}
			{framesOf}
			canPrev={activeIndex > 0}
			canNext={activeIndex < scenes.length - 1}
			onpick={onThumbClick}
			onstep={step}
			onplay={onPlayerPlay}
		/>
	{:else}
	<header class="chrome">
		<SiteNavSpace />
		<div class="chrome-meta">
			<span class="brand">Scenes</span>
			{#if active}
				<span class="sep" aria-hidden="true">·</span>
				<span class="now-title">{active.title}</span>
			{/if}
		</div>
		<button
			type="button"
			class="grid-toggle"
			aria-pressed={grid}
			onclick={toggleGrid}
		>
			{grid ? 'grid on' : 'grid off'}
		</button>
	</header>

	<div class="view">
	<div class="stage" class:editing class:asleep={grid}>
		<aside class="scene-rail" bind:this={railEl} aria-label="Scene grid">
			{#each scenes as scene, i (scene.id)}
				<button
					type="button"
					class="thumb"
					class:live={activeId === scene.id}
					class:love={isLoveScene(scene)}
					class:person={isPersonScene(scene)}
					data-thumb-id={scene.id}
					onclick={() => onThumbClick(scene)}
					aria-current={activeId === scene.id ? 'true' : undefined}
					aria-label="{scene.title}. {audioArtist(scene) ? `${audioArtist(scene)}. ` : ''}{audioLabel(scene)}{isPersonScene(scene) ? '. Their theme' : ''}{isLoveScene(scene) ? '. Love story' : ''}"
				>
					<span class="sleeve">
						<img
							{...storyImg(coverOf(scene), {
								kind: 'thumb',
								priority: i < 6,
								sizes: '96px',
								widths: [64, 96, 128],
								alt: ''
							})}
						/>
						<span class="thumb-num">{i + 1}</span>
						{#if isPersonScene(scene)}
							<span class="person-dot" title="Their theme" aria-hidden="true"></span>
						{/if}
						{#if isLoveScene(scene)}
							<span class="love-dot" title="Love story" aria-hidden="true"></span>
						{/if}
					</span>
					<span class="card-copy">
						<span class="card-title">{scene.title}</span>
						{#if audioArtist(scene)}
							<span class="card-artist">{audioArtist(scene)}</span>
						{/if}
						<span class="card-song">{audioLabel(scene)}</span>
					</span>
				</button>
			{/each}
		</aside>

		<div class="picture">
		<div class="feed" {@attach wireFeed} aria-label="Scene feed">
			{#each scenes as scene, i (scene.id)}
				<section
					class="panel"
					class:live={activeId === scene.id}
					class:with-lyrics={hasLyricsForScene(scene)}
					data-scene-id={scene.id}
				>
					{#if framesOf(scene).length > 1}
						<div class="frame">
							<SceneLoop
								frames={framesOf(scene)}
								alt={scene.title}
								live={activeId === scene.id}
								frameMs={scene.frameMs ?? 3000}
								kind="hero"
								priority={i === 0 || activeId === scene.id}
								sizes="(max-width: 900px) 100vw, 72vw"
								onactivate={() => onFeedActivate(scene)}
								onmenu={editing ? (e, index) => openFrameMenu(scene.id, e, index) : undefined}
								onindex={activeId === scene.id
									? (n) => (shown = { id: scene.id, index: n })
									: undefined}
								cue={frameCue?.id === scene.id ? frameCue : null}
							/>
							<span class="veil" aria-hidden="true"></span>
							{@render sceneCaption(scene)}
						</div>
					{:else}
						<button type="button" class="frame" onclick={() => onFeedActivate(scene)}>
							<img
								{...storyImg(coverOf(scene), {
									kind: 'hero',
									priority: i === 0,
									sizes: '(max-width: 900px) 100vw, 72vw',
									alt: scene.title
								})}
							/>
							<span class="veil" aria-hidden="true"></span>
							{@render sceneCaption(scene)}
						</button>
					{/if}
					<SceneLyrics
						scene={scene}
						live={activeId === scene.id}
						onplay={onPlayerPlay}
					/>
				</section>
			{/each}
		</div>
		</div>
		{#if editing && active}
			<SceneFrameEdit
				frames={framesOf(active)}
				current={shownFrame}
				onreorder={reorderActive}
				onmenu={(e, index) => openFrameMenu(active.id, e, index)}
				onpick={showFrame}
			/>
		{/if}
	</div>
	{#if grid}
		<div class="cover-grid" aria-label="Album covers">
			{#each scenes as scene (scene.id)}
				<button
					type="button"
					class="cover-card"
					class:live={activeId === scene.id}
					onclick={() => onThumbClick(scene)}
					aria-current={activeId === scene.id ? 'true' : undefined}
					aria-label="{scene.title}. {audioArtist(scene) ? `${audioArtist(scene)}. ` : ''}{audioLabel(scene)}"
				>
					<AlbumCover
						src={coverOf(scene)}
						alt=""
						live={activeId === scene.id}
						sizes="18rem"
					/>
					<span class="card-title">
						{scene.title}
						{#if isPersonScene(scene)}
							<span class="person-dot inline" title="Their theme" aria-hidden="true"></span>
						{/if}
						{#if isLoveScene(scene)}
							<span class="love-dot inline" title="Love story" aria-hidden="true"></span>
						{/if}
					</span>
					{#if audioArtist(scene)}
						<span class="card-artist">{audioArtist(scene)}</span>
					{/if}
					<span class="card-song">{audioLabel(scene)}</span>
				</button>
			{/each}
		</div>
	{/if}
	</div>

	<ScenePlayer
		scene={active}
		canPrev={activeIndex > 0}
		canNext={activeIndex < scenes.length - 1}
		onprev={() => step(-1)}
		onnext={() => step(1)}
		onplay={onPlayerPlay}
	/>
	{/if}
</main>

<style>
	.scenes {
		height: 100dvh;
		overflow: hidden;
		background: #050506;
		color: var(--fg);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
	}

	.scenes.phone {
		height: calc(100dvh - var(--tabbar-space));
		display: block;
	}

	.chrome {
		z-index: 6;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.55rem 0.85rem;
		padding: max(0.55rem, env(safe-area-inset-top)) max(0.85rem, env(safe-area-inset-right))
			0.45rem max(0.75rem, env(safe-area-inset-left));
		background: linear-gradient(
			180deg,
			rgba(5, 5, 6, 0.92) 40%,
			rgba(5, 5, 6, 0.35) 100%
		);
	}

	.chrome-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.5rem;
		min-width: 0;
		flex: 1;
		font-family: var(--ui);
		font-size: 0.78rem;
		letter-spacing: var(--tracking-ui);
	}

	.brand {
		font-weight: 600;
		color: #f3f1ec;
	}

	.sep {
		opacity: 0.35;
	}

	.now-title {
		color: #f3f1ec;
		font-weight: 500;
	}

	.grid-toggle {
		margin-left: auto;
		flex: none;
		border: 0;
		background: transparent;
		padding: 0.2rem 0.1rem;
		font-family: var(--ui);
		font-size: 0.78rem;
		letter-spacing: var(--tracking-ui);
		color: color-mix(in srgb, #f3f1ec 68%, transparent);
		cursor: pointer;
	}

	.grid-toggle[aria-pressed='true'] {
		color: var(--gold);
	}

	.view {
		height: 100%;
		min-height: 0;
		display: grid;
		grid-template-rows: minmax(0, 1fr);
		overflow: hidden;
	}

	.view > .stage,
	.view > .cover-grid {
		grid-area: 1 / 1;
		min-height: 0;
	}

	.stage.asleep {
		visibility: hidden;
		pointer-events: none;
	}

	.cover-grid {
		height: 100%;
		min-height: 0;
		overflow: auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
		gap: 1.75rem 1.15rem;
		align-content: start;
		padding: 1rem 1.35rem 2.5rem;
	}

	.cover-card {
		display: grid;
		justify-items: start;
		align-content: start;
		gap: 0.12rem;
		border: 0;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
		padding: 0.4rem 0.35rem 0.2rem;
	}

	.cover-card {
		--album-size: calc(100% - 0.6rem);
	}

	.cover-card :global(.album) {
		margin-bottom: 0.45rem;
	}

	.cover-card.live .card-title {
		color: var(--gold);
	}

	.stage {
		min-height: 0;
		height: 100%;
		display: grid;
		grid-template-columns: minmax(16.5rem, 20rem) minmax(0, 1fr);
		gap: 1.1rem;
		padding: 0.85rem 1.15rem 0.95rem 1rem;
		box-sizing: border-box;
	}

	.stage.editing {
		grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr) 11.5rem;
	}

	/* Not `.rail` — that class is the global decorative left stripe in app.css. */
	.scene-rail {
		min-height: 0;
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.85rem 0.7rem 1.4rem 0.55rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.95rem;
		scrollbar-width: thin;
		background: rgba(0, 0, 0, 0.55);
		border-right: 1px solid color-mix(in srgb, var(--fg) 12%, transparent);
		z-index: 2;
	}

	.thumb {
		position: relative;
		display: grid;
		grid-template-columns: 4.35rem minmax(0, 1fr);
		align-items: center;
		gap: 0.85rem;
		flex: 0 0 auto;
		width: 100%;
		margin: 0;
		padding: 0.35rem 0.15rem 0.55rem 0.1rem;
		border: none;
		border-radius: 6px;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.sleeve {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 1;
		perspective: 420px;
	}

	.sleeve::before {
		content: '';
		position: absolute;
		left: 18%;
		right: 4%;
		bottom: -14%;
		height: 32%;
		border-radius: 50%;
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7), transparent 70%);
		filter: blur(4px);
		pointer-events: none;
	}

	.sleeve img {
		position: relative;
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 3px;
		transform: rotateY(-16deg) rotateX(8deg);
		transform-origin: center center;
		box-shadow:
			8px 10px 0 -2px #1a140c,
			9px 11px 0 0 #c6a15a,
			14px 18px 18px rgba(0, 0, 0, 0.45);
		filter: brightness(0.86);
		transition:
			transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1),
			filter 0.3s var(--ease);
	}

	.thumb:hover img,
	.thumb.live img {
		filter: brightness(1);
		transform: rotateY(-6deg) rotateX(3deg) translateY(-4px);
	}

	.thumb.live img {
		box-shadow:
			8px 10px 0 -2px #1a140c,
			9px 11px 0 0 #f4e7cc,
			0 0 0 1px #fff,
			14px 18px 22px rgba(0, 0, 0, 0.5);
	}

	.card-copy {
		min-width: 0;
		display: grid;
		gap: 0.18rem;
	}

	.card-title {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0;
		font-size: 0.84rem;
		font-weight: 600;
		line-height: 1.25;
		letter-spacing: var(--tracking-display);
		color: #f4efe6;
	}

	.card-artist {
		font-family: var(--ui);
		font-size: 0.66rem;
		line-height: 1.25;
		letter-spacing: var(--tracking-ui);
		color: color-mix(in srgb, #f4efe6 78%, transparent);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-song {
		font-family: var(--ui);
		font-size: 0.68rem;
		line-height: 1.3;
		letter-spacing: var(--tracking-ui);
		color: var(--gold);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.thumb.live .card-title {
		color: #fff;
	}

	.thumb-num {
		position: absolute;
		left: 0.2rem;
		bottom: 0.15rem;
		z-index: 2;
		font-family: var(--ui);
		font-size: 0.58rem;
		letter-spacing: 0.04em;
		color: #fff;
		text-shadow: 0 1px 6px #000;
	}

	.person-dot {
		position: absolute;
		top: 0.22rem;
		left: 0.2rem;
		z-index: 3;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: #5aa2ff;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
	}

	.person-dot.inline {
		position: static;
		display: inline-block;
		width: 0.35rem;
		height: 0.35rem;
		margin-left: 0.35rem;
		vertical-align: middle;
	}

	.love-dot {
		position: absolute;
		top: 0.22rem;
		right: 0.15rem;
		z-index: 3;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 50%;
		background: #e879a8;
		box-shadow:
			0 0 0 1px color-mix(in srgb, #e879a8 45%, transparent),
			0 1px 4px rgba(0, 0, 0, 0.45);
		pointer-events: none;
	}

	.love-dot.inline {
		position: static;
		display: inline-block;
		width: 0.35rem;
		height: 0.35rem;
		margin-left: 0.35rem;
		vertical-align: middle;
		box-shadow: 0 0 0 1px color-mix(in srgb, #e879a8 40%, transparent);
	}

	.thumb.live .love-dot {
		background: #f0a3c0;
	}

	.shot-title .love-dot.inline {
		background: #e879a8;
	}

	.picture {
		position: relative;
		min-width: 0;
		min-height: 0;
		height: 100%;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 0 0 1px color-mix(in srgb, #fff 8%, transparent);
	}

	.panel.with-lyrics .meta {
		max-width: min(32rem, 54%);
	}

	.feed {
		min-width: 0;
		min-height: 0;
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		background: #050506;
		display: flex;
		flex-direction: column;
	}

	.panel {
		position: relative;
		box-sizing: border-box;
		flex: 0 0 100%;
		width: 100%;
		height: 100%;
		min-height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}

	.frame {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: #050506;
		cursor: pointer;
		text-align: left;
		/* visible so the album’s preserve-3d box is not flattened */
		overflow: visible;
	}

	.frame > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
		display: block;
		background: #050506;
	}

	/* Keep .loop without a z-index so .story can paint above the veil. */
	.frame :global(.story) {
		z-index: 5;
	}

	.veil {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: linear-gradient(
			180deg,
			rgba(5, 5, 6, 0.35) 0%,
			transparent 18%,
			transparent 42%,
			rgba(5, 5, 6, 0.45) 72%,
			rgba(5, 5, 6, 0.92) 100%
		);
		pointer-events: none;
	}

	.meta {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		display: grid;
		gap: 0.12rem;
		padding: 1.35rem 1.35rem max(1.35rem, env(safe-area-inset-bottom));
		pointer-events: none;
		max-width: min(40rem, 100%);
	}

	.shot-title {
		color: #fff;
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		text-shadow: 0 1px 16px #000;
	}

	.shot-place,
	.shot-credit {
		font-family: var(--ui);
		font-size: 0.78rem;
		letter-spacing: var(--tracking-ui);
		color: color-mix(in srgb, #fff 72%, transparent);
		text-shadow: 0 1px 10px #000;
	}

	.shot-artist {
		font-family: var(--ui);
		font-size: 0.8rem;
		letter-spacing: var(--tracking-ui);
		color: color-mix(in srgb, #fff 88%, transparent);
		margin-top: 0.15rem;
		text-shadow: 0 1px 10px #000;
	}

	.shot-audio {
		font-family: var(--ui);
		font-size: 0.84rem;
		letter-spacing: var(--tracking-ui);
		color: var(--gold);
		margin-top: 0.08rem;
		text-shadow: 0 1px 10px #000;
	}

	@media (max-width: 720px) {
		.stage {
			grid-template-columns: minmax(11.5rem, 42vw) minmax(0, 1fr);
			gap: 0.65rem;
			padding: 0.55rem 0.55rem 0.7rem;
		}

		.stage.editing {
			grid-template-columns: minmax(9rem, 34vw) minmax(0, 1fr) 6.75rem;
		}

		.scene-rail {
			padding: 0.45rem 0.25rem 1rem 0.15rem;
			gap: 0.7rem;
		}

		.thumb {
			grid-template-columns: 3.1rem minmax(0, 1fr);
			gap: 0.5rem;
		}

		.card-title {
			font-size: 0.72rem;
		}

		.card-song {
			font-size: 0.6rem;
			-webkit-line-clamp: 1;
		}
	}
</style>
