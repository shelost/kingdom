<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { storyImg } from '$lib/img';
	import { koChrome } from '$lib/uiLang';
	import { stageOpening } from '$lib/stage/placeStage';
	import type { StageSite } from '$lib/stage/sites';
	import StageLink from './StageLink.svelte';

	type StageCanvasComponent = typeof import('./StageCanvas.svelte').default;

	/**
	 * A small orbitable stage for a wiki page. The board image stands in until a
	 * click; three.js loads only then (warmed when the preview scrolls near), and
	 * the stage is torn down again once it leaves the screen or the page closes.
	 */
	let { site }: { site: StageSite } = $props();

	const loadStage = () => import('./StageCanvas.svelte');

	let ko = $derived(koChrome());
	let opening = $derived(stageOpening(site));
	let poster = $derived(site.refs[0]?.src);

	let Stage = $state<StageCanvasComponent | null>(null);
	let running = $state(false);
	let busy = $state(true);
	let failed = $state(false);
	/** The scene reports no build while it is still raising one; only once it settles does that mean the site is missing. */
	let missing = $state(false);
	let unbuilt = $derived(running && !busy && missing);

	function start() {
		running = true;
		busy = true;
		failed = false;
		missing = false;
		loadStage()
			.then((m) => (Stage = m.default))
			.catch(() => {
				failed = true;
				running = false;
			});
	}

	/** Warm the module as it nears the screen; stop the stage once it has left it. */
	const watch: Attachment<HTMLElement> = (el) => {
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) void loadStage();
				else running = false;
			},
			{ rootMargin: '240px 0px' }
		);
		io.observe(el);
		return () => io.disconnect();
	};

	/** Plain scroll keeps scrolling the page; Ctrl/⌘ + scroll (and trackpad pinch) zooms the stage. */
	const guardWheel: Attachment<HTMLElement> = (el) => {
		const pass = (e: WheelEvent) => {
			if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
		};
		el.addEventListener('wheel', pass, { capture: true });
		return () => el.removeEventListener('wheel', pass, { capture: true });
	};

	/** Threlte disposes the renderer; release the WebGL context too, so wiki hopping never runs the browser out. */
	const releaseContext: Attachment<HTMLElement> = (el) => () => {
		const canvas = el.querySelector('canvas');
		const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
		if (gl) setTimeout(() => gl.getExtension('WEBGL_lose_context')?.loseContext(), 0);
	};
</script>

<figure class="stage-preview" {@attach watch}>
	<div class="screen">
		{#if running && Stage}
			<div class="live" {@attach guardWheel} {@attach releaseContext}>
				<Stage
					site={site.id}
					year={opening.year}
					hour={opening.hour}
					view="board"
					labels={false}
					people={false}
					onbusy={(b) => (busy = b)}
					onbuilt={(info) => (missing = !info)}
				/>
			</div>
		{/if}

		{#if !running || busy || unbuilt}
			<button
				type="button"
				class="poster"
				class:loading={running && !unbuilt}
				onclick={start}
				disabled={running}
				aria-label={ko ? `${site.ko} 3D 모형 돌려 보기` : `Orbit the 3D model of ${site.en}`}
			>
				{#if poster}
					<img {...storyImg(poster, { kind: 'place', alt: '', sizes: '(max-width: 820px) 100vw, 36rem' })} />
				{/if}
				<span class="play">
					<span class="material-symbols-outlined" aria-hidden="true"
						>{unbuilt ? 'construction' : running ? 'progress_activity' : '360'}</span
					>
					{#if unbuilt}
						{ko ? '이 모형은 다시 짓는 중입니다' : 'This model is being rebuilt'}
					{:else if running}
						{ko ? '모형을 짓는 중…' : 'Building the model…'}
					{:else if failed}
						{ko ? '다시 시도' : 'Try again'}
					{:else}
						{ko ? '3D로 돌려 보기' : 'Orbit in 3D'}
					{/if}
				</span>
			</button>
		{/if}

		<span class="badge" aria-hidden="true">3D</span>
		<div class="bar">
			{#if running && !busy && !unbuilt}
				<span class="hint">{ko ? '드래그: 회전 · Space+드래그: 이동 · 스크롤: 확대' : 'Drag to orbit · Space+drag to pan · Scroll to zoom'}</span>
			{/if}
			<StageLink {site} tone="glass" />
		</div>
	</div>
	<figcaption>
		<span class="name">{ko ? site.ko : site.en}</span>
		<span class="place">{site.place}</span>
	</figcaption>
</figure>

<style lang="scss">
	.stage-preview {
		margin: 0;
		display: grid;
		gap: 0.55rem;
	}

	.screen {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		background: #0d0d10;
		isolation: isolate;
	}

	.live {
		position: absolute;
		inset: 0;
	}

	.poster {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: grid;
		place-items: center;
		padding: 0;
		border: none;
		background: #0d0d10;
		cursor: pointer;
		color: #fafafa;
		& img {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;
			filter: saturate(0.9) brightness(0.72);
			transition: filter 300ms var(--ease), scale 600ms var(--ease-out);
		}
		&:hover img, &:focus-visible img {
			filter: saturate(1) brightness(0.82);
			scale: 1.03;
		}
		&.loading {
			cursor: progress;
			& img {
				filter: saturate(0.6) brightness(0.5) blur(2px);
			}
		}
		&:focus-visible {
			outline: none;
			& .play {
				box-shadow: 0 0 0 2px var(--gold);
			}
		}
	}

	.play {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.1rem 0.6rem 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 999px;
		background: rgba(12, 12, 16, 0.55);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		font-family: var(--ui);
		font-size: 0.88rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		& .material-symbols-outlined {
			font-size: 1.35rem;
			color: var(--gold);
		}
	}

	.poster.loading .play .material-symbols-outlined {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			rotate: 360deg;
		}
	}

	.badge {
		position: absolute;
		top: 0.7rem;
		left: 0.7rem;
		z-index: 2;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		background: var(--gold);
		color: #14140f;
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.06em;
		pointer-events: none;
	}

	.bar {
		position: absolute;
		right: 0.7rem;
		bottom: 0.7rem;
		left: 0.7rem;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.6rem;
		pointer-events: none;
		& :global(.stage-link) {
			pointer-events: auto;
		}
	}

	.hint {
		margin-right: auto;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: rgba(12, 12, 16, 0.5);
		color: rgba(250, 250, 250, 0.85);
		font-family: var(--ui);
		font-size: 0.7rem;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		font-family: var(--ui);
		font-size: 0.78rem;
		color: var(--fg-faint);
	}

	.name {
		font-weight: 600;
		color: var(--fg-dim);
	}

	@media (prefers-reduced-motion: reduce) {
		.poster img {
			transition: none;
		}
		.poster:hover img {
			scale: none;
		}
	}

	@media (max-width: 560px) {
		.hint {
			display: none;
		}
	}
</style>
