<script lang="ts">
	import { untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Attachment } from 'svelte/attachments';
	import { storyImg } from '$lib/img';
	import { hasLyricsForScene } from '$lib/lyrics';
	import { isAudible, music, playOrPause } from '$lib/music.svelte';
	import { audioArtist, audioLabel, isLoveScene, isPersonScene, type Scene } from '$lib/scenes';
	import SceneLoop from './SceneLoop.svelte';
	import SceneLyrics from './SceneLyrics.svelte';
	import SeekBar from './SeekBar.svelte';

	let {
		scenes,
		activeId,
		coverOf,
		framesOf,
		canPrev = false,
		canNext = false,
		onpick,
		onstep,
		onplay
	}: {
		scenes: Scene[];
		activeId: string;
		coverOf: (scene: Scene) => string;
		framesOf: (scene: Scene) => string[];
		canPrev?: boolean;
		canNext?: boolean;
		/** A row was tapped: make it the scene and play it. */
		onpick: (scene: Scene) => void;
		onstep: (delta: number) => void;
		/** Arm + ensure the active scene's track is on. */
		onplay: () => void;
	} = $props();

	const FILTERS = [
		{ id: 'all', label: 'All', test: () => true },
		{ id: 'themes', label: 'Their themes', test: isPersonScene },
		{ id: 'love', label: 'Love stories', test: isLoveScene }
	] as const;

	/** Past this, a drag reads as a swipe rather than a tap. */
	const SWIPE_PX = 64;

	let filter = $state<(typeof FILTERS)[number]['id']>('all');
	let nowOpen = $state(false);
	let lyricsOn = $state(false);

	let active = $derived(scenes.find((s) => s.id === activeId) ?? null);
	let rows = $derived(scenes.filter(FILTERS.find((f) => f.id === filter)?.test ?? (() => true)));
	let playing = $derived(isAudible());
	let progress = $derived(music.duration > 0 ? Math.min(1, music.currentTime / music.duration) : 0);
	let canLyrics = $derived(!!active && hasLyricsForScene(active));

	function subtitle(scene: Scene): string {
		const artist = audioArtist(scene);
		return artist ? `${artist} · ${audioLabel(scene)}` : audioLabel(scene);
	}

	/** A linked song lands mid-list; bring its row into view once, on open. */
	const revealActiveRow: Attachment<HTMLElement> = (node) => {
		const id = untrack(() => activeId);
		const row = node.querySelector<HTMLElement>(`[data-row-id="${CSS.escape(id)}"]`);
		row?.scrollIntoView({ block: 'center', behavior: 'instant' });
	};

	/** Swipe down closes the sheet; with `sideways`, a horizontal swipe changes the scene. */
	function swipe(sideways: boolean): Attachment<HTMLElement> {
		return (node) => {
			let start: { x: number; y: number } | null = null;
			const onStart = (e: TouchEvent) => {
				const t = e.touches[0];
				start = t ? { x: t.clientX, y: t.clientY } : null;
			};
			const onEnd = (e: TouchEvent) => {
				const from = start;
				const t = e.changedTouches[0];
				start = null;
				if (!from || !t) return;
				const dx = t.clientX - from.x;
				const dy = t.clientY - from.y;
				if (dy > SWIPE_PX * 1.4 && dy > Math.abs(dx)) {
					nowOpen = false;
					return;
				}
				if (!sideways || Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.3) return;
				if (dx < 0 && canNext) onstep(1);
				else if (dx > 0 && canPrev) onstep(-1);
			};
			node.addEventListener('touchstart', onStart, { passive: true });
			node.addEventListener('touchend', onEnd, { passive: true });
			return () => {
				node.removeEventListener('touchstart', onStart);
				node.removeEventListener('touchend', onEnd);
			};
		};
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && nowOpen) nowOpen = false;
	}
</script>

<svelte:window onkeydown={onKey} />

{#snippet playIcon(on: boolean)}
	<svg viewBox="0 0 24 24" aria-hidden="true">
		{#if on}
			<path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
		{:else}
			<path fill="currentColor" d="M8 5v14l11-7L8 5z" />
		{/if}
	</svg>
{/snippet}

{#snippet skipIcon(dir: 'prev' | 'next')}
	<svg viewBox="0 0 24 24" aria-hidden="true">
		{#if dir === 'prev'}
			<path fill="currentColor" d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
		{:else}
			<path fill="currentColor" d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z" />
		{/if}
	</svg>
{/snippet}

{#snippet marks(scene: Scene)}
	{#if isPersonScene(scene)}<span class="mark theme" title="Their theme" aria-hidden="true"></span>{/if}
	{#if isLoveScene(scene)}<span class="mark love" title="Love story" aria-hidden="true"></span>{/if}
{/snippet}

<div class="lib" {@attach revealActiveRow}>
	<header class="lib-head">
		<h1>Scenes</h1>
		<p>{scenes.length} scenes · stills and their songs</p>
	</header>

	<div class="chips" role="group" aria-label="Filter scenes">
		{#each FILTERS as f (f.id)}
			<button type="button" class="chip" aria-pressed={filter === f.id} onclick={() => (filter = f.id)}>
				{f.label}
			</button>
		{/each}
	</div>

	<ul class="rows">
		{#each rows as scene, i (scene.id)}
			{@const live = scene.id === activeId}
			<li>
				<button
					type="button"
					class="row"
					class:live
					data-row-id={scene.id}
					aria-current={live ? 'true' : undefined}
					onclick={() => onpick(scene)}
				>
					<img
						class="row-art"
						{...storyImg(coverOf(scene), {
							kind: 'thumb',
							priority: i < 8,
							sizes: '56px',
							widths: [64, 96, 128],
							alt: ''
						})}
					/>
					<span class="row-copy">
						<span class="row-title">{scene.title}{@render marks(scene)}</span>
						<span class="row-sub">{subtitle(scene)}</span>
					</span>
					{#if live && playing}
						<span class="eq" aria-label="Playing"><i></i><i></i><i></i></span>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</div>

{#if active}
	<div class="mini" role="region" aria-label="Now playing">
		<button type="button" class="mini-open" onclick={() => (nowOpen = true)} aria-label="Open player: {active.title}">
			<img
				class="mini-art"
				{...storyImg(coverOf(active), {
					kind: 'thumb',
					priority: true,
					sizes: '44px',
					widths: [64, 96],
					alt: ''
				})}
			/>
			<span class="mini-copy">
				<span class="mini-title">{active.title}</span>
				<span class="mini-sub">{subtitle(active)}</span>
			</span>
		</button>
		<button type="button" class="mini-btn" onclick={() => playOrPause(onplay)} aria-label={playing ? 'Pause' : 'Play'}>
			{@render playIcon(playing)}
		</button>
		<button type="button" class="mini-btn" disabled={!canNext} onclick={() => onstep(1)} aria-label="Next scene">
			{@render skipIcon('next')}
		</button>
		<span class="mini-line" style:transform="scaleX({progress})" aria-hidden="true"></span>
	</div>
{/if}

{#if nowOpen && active}
	<div
		class="sheet"
		role="dialog"
		aria-modal="true"
		aria-label="Now playing: {active.title}"
		transition:fly={{ y: 700, opacity: 1, duration: 320 }}
	>
		<img
			class="sheet-bg"
			aria-hidden="true"
			{...storyImg(coverOf(active), { kind: 'thumb', priority: true, sizes: '64px', widths: [64], alt: '' })}
		/>

		<header class="sheet-top" {@attach swipe(false)}>
			<button type="button" class="round" onclick={() => (nowOpen = false)} aria-label="Close player">
				<span class="material-symbols-outlined" aria-hidden="true">keyboard_arrow_down</span>
			</button>
			<span class="sheet-kicker">
				<span>Playing from Scenes</span>
				<strong>{active.place}</strong>
			</span>
			<button
				type="button"
				class="round"
				class:on={lyricsOn && canLyrics}
				disabled={!canLyrics}
				aria-pressed={lyricsOn && canLyrics}
				onclick={() => (lyricsOn = !lyricsOn)}
				aria-label="Lyrics"
			>
				<span class="material-symbols-outlined" aria-hidden="true">lyrics</span>
			</button>
		</header>

		<div class="art" {@attach swipe(true)}>
			{#key active.id}
				<SceneLoop
					frames={framesOf(active)}
					alt={active.title}
					live
					frameMs={active.frameMs ?? 3000}
					kind="hero"
					priority
					sizes="100vw"
					onactivate={onplay}
				/>
			{/key}
			{#if lyricsOn && canLyrics}
				<span class="art-scrim" aria-hidden="true"></span>
				<SceneLyrics scene={active} live layout="full" {onplay} />
			{/if}
		</div>

		<div class="info">
			<h2>{active.title}{@render marks(active)}</h2>
			<p>{subtitle(active)}</p>
		</div>

		<SeekBar size="large" />

		<div class="transport">
			<button type="button" class="skip" disabled={!canPrev} onclick={() => onstep(-1)} aria-label="Previous scene">
				{@render skipIcon('prev')}
			</button>
			<button type="button" class="play" onclick={() => playOrPause(onplay)} aria-label={playing ? 'Pause' : 'Play'}>
				{@render playIcon(playing)}
			</button>
			<button type="button" class="skip" disabled={!canNext} onclick={() => onstep(1)} aria-label="Next scene">
				{@render skipIcon('next')}
			</button>
		</div>
	</div>
{/if}

<style>
	/* ————— Library ————— */
	.lib {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: max(1rem, env(safe-area-inset-top)) 0 6rem;
		font-family: var(--ui);
		color: #f5f5f7;
	}

	.lib-head {
		padding: 0.6rem 1.1rem 0.2rem;
	}

	.lib-head h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.035em;
	}

	.lib-head p {
		margin: 0.15rem 0 0;
		font-size: 0.8rem;
		color: rgba(245, 245, 247, 0.55);
	}

	.chips {
		position: sticky;
		top: 0;
		z-index: 2;
		display: flex;
		gap: 0.45rem;
		padding: 0.7rem 1.1rem 0.65rem;
		overflow-x: auto;
		scrollbar-width: none;
		background: linear-gradient(180deg, #050506 70%, rgba(5, 5, 6, 0));
	}

	.chips::-webkit-scrollbar {
		display: none;
	}

	.chip {
		flex: none;
		min-height: 2.1rem;
		padding: 0 0.95rem;
		border: none;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.1);
		color: #f5f5f7;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
	}

	.chip[aria-pressed='true'] {
		background: var(--gold);
		color: #14140f;
	}

	.rows {
		list-style: none;
		margin: 0;
		padding: 0 0.55rem;
	}

	.row {
		display: grid;
		grid-template-columns: 3.4rem minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.8rem;
		width: 100%;
		min-height: 4.1rem;
		padding: 0.35rem 0.55rem;
		border: none;
		border-radius: 10px;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.row:active {
		background: rgba(255, 255, 255, 0.06);
	}

	.row-art {
		width: 3.4rem;
		height: 3.4rem;
		border-radius: 6px;
		object-fit: cover;
		background: #151518;
	}

	.row-copy {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.row-title,
	.row-sub {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.row-title {
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.row.live .row-title {
		color: var(--gold);
	}

	.row-sub {
		font-size: 0.76rem;
		color: rgba(245, 245, 247, 0.6);
	}

	.mark {
		display: inline-block;
		width: 0.38rem;
		height: 0.38rem;
		margin-left: 0.4rem;
		border-radius: 50%;
		vertical-align: middle;
	}

	.mark.theme {
		background: #5aa2ff;
	}

	.mark.love {
		background: #e879a8;
	}

	.eq {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		width: 1.1rem;
		height: 0.95rem;
	}

	.eq i {
		flex: 1;
		height: 100%;
		border-radius: 1px;
		background: var(--gold);
		transform-origin: bottom;
		animation: eq 0.9s ease-in-out infinite;
	}

	.eq i:nth-child(2) {
		animation-delay: -0.3s;
	}

	.eq i:nth-child(3) {
		animation-delay: -0.6s;
	}

	@keyframes eq {
		0%,
		100% {
			transform: scaleY(0.3);
		}
		50% {
			transform: scaleY(1);
		}
	}

	/* ————— Mini player ————— */
	.mini {
		position: fixed;
		left: max(0.5rem, env(safe-area-inset-left));
		right: max(0.5rem, env(safe-area-inset-right));
		bottom: calc(var(--tabbar-space) + 0.45rem);
		z-index: 70;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 0.15rem;
		height: 3.6rem;
		padding: 0 0.35rem 0 0.4rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		background: rgba(34, 32, 30, 0.9);
		backdrop-filter: blur(24px) saturate(1.4);
		-webkit-backdrop-filter: blur(24px) saturate(1.4);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
		font-family: var(--ui);
		color: #f5f5f7;
	}

	.mini-open {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
		height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.mini-art {
		flex: none;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 6px;
		object-fit: cover;
	}

	.mini-copy {
		display: grid;
		min-width: 0;
	}

	.mini-title,
	.mini-sub {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.mini-title {
		font-size: 0.86rem;
		font-weight: 600;
	}

	.mini-sub {
		font-size: 0.72rem;
		color: rgba(245, 245, 247, 0.6);
	}

	.mini-btn {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	.mini-btn:disabled {
		opacity: 0.3;
	}

	.mini-btn svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.mini-line {
		position: absolute;
		left: 0.6rem;
		right: 0.6rem;
		bottom: 0;
		height: 2px;
		border-radius: 1px;
		background: #f5f5f7;
		transform-origin: left center;
	}

	/* ————— Now Playing sheet ————— */
	.sheet {
		position: fixed;
		inset: 0;
		z-index: 120;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: max(0.6rem, env(safe-area-inset-top)) max(1.4rem, env(safe-area-inset-right))
			max(1.6rem, env(safe-area-inset-bottom)) max(1.4rem, env(safe-area-inset-left));
		overflow: hidden;
		background: #0b0b0d;
		font-family: var(--ui);
		color: #f5f5f7;
		isolation: isolate;
	}

	.sheet-bg {
		position: absolute;
		inset: -10%;
		z-index: -1;
		width: 120%;
		height: 120%;
		object-fit: cover;
		filter: blur(48px) brightness(0.42) saturate(1.3);
		pointer-events: none;
	}

	.sheet-top {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.5rem;
		touch-action: none;
	}

	.sheet-kicker {
		display: grid;
		min-width: 0;
		text-align: center;
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(245, 245, 247, 0.6);
	}

	.sheet-kicker strong {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		text-transform: none;
		color: #f5f5f7;
	}

	.round {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		color: inherit;
		cursor: pointer;
	}

	.round .material-symbols-outlined {
		font-size: 1.6rem;
	}

	.round:disabled {
		opacity: 0.3;
	}

	.round.on {
		background: #f5f5f7;
		color: #111;
	}

	.art {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		border-radius: 14px;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
	}

	.art-scrim {
		position: absolute;
		inset: 0;
		z-index: 3;
		background: rgba(8, 8, 10, 0.62);
		pointer-events: none;
	}

	.info {
		min-width: 0;
	}

	.info h2 {
		margin: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 1.35rem;
		font-weight: 700;
		letter-spacing: -0.03em;
	}

	.info p {
		margin: 0.2rem 0 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 0.92rem;
		color: var(--gold);
	}

	.transport {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2.2rem;
	}

	.skip,
	.play {
		display: grid;
		place-items: center;
		padding: 0;
		border: none;
		cursor: pointer;
	}

	.skip {
		width: 3.2rem;
		height: 3.2rem;
		background: transparent;
		color: #f5f5f7;
	}

	.skip:disabled {
		opacity: 0.3;
	}

	.skip svg {
		width: 2rem;
		height: 2rem;
	}

	.play {
		width: 4.4rem;
		height: 4.4rem;
		border-radius: 50%;
		background: #f5f5f7;
		color: #111;
	}

	.play svg {
		width: 2rem;
		height: 2rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.eq i {
			animation: none;
			transform: scaleY(0.7);
		}
	}
</style>
