<script lang="ts">
	/**
	 * The stage model a map pill opens onto. Drag orbits it. Scrolling out,
	 * or the map button, returns to the sheet at the zoom that found it.
	 */
	import type { Attachment } from 'svelte/attachments';
	import { stageOpening } from '$lib/stage/placeStage';
	import type { StageSite } from '$lib/stage/sites';
	import StageCanvas from './stage/StageCanvas.svelte';

	let { site, year, ko = false, onback }: { site: StageSite; year: number; ko?: boolean; onback: () => void } = $props();

	const opening = $derived(stageOpening(site));
	let ready = $state(false);

	const wheel: Attachment<HTMLElement> = (el) => {
		const on = (e: WheelEvent) => {
			if (e.deltaY <= 0) return;
			e.preventDefault();
			e.stopPropagation();
			onback();
		};
		el.addEventListener('wheel', on, { capture: true, passive: false });
		return () => el.removeEventListener('wheel', on, { capture: true });
	};

	/** Threlte disposes the renderer; release the context too, so the map keeps its own. */
	const release: Attachment<HTMLElement> = (el) => () => {
		const canvas = el.querySelector('canvas');
		const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
		if (gl) setTimeout(() => gl.getExtension('WEBGL_lose_context')?.loseContext(), 0);
	};
</script>

<div class="dive" {@attach wheel}>
	<div class="screen" {@attach release}>
		<StageCanvas
			site={site.id}
			year={year}
			hour={opening.hour}
			view="board"
			labels={false}
			people={false}
			onbuilt={() => (ready = true)}
		/>
	</div>
	{#if !ready}
		<p class="wait">{ko ? '모형을 짓는 중…' : 'Building the model…'}</p>
	{/if}
	<button type="button" class="back" onclick={onback}>
		<span class="material-symbols-outlined" aria-hidden="true">map</span>
		{ko ? '지도로' : 'Back to the map'}
	</button>
	<p class="name">{ko ? site.ko : site.en}</p>
</div>

<style lang="scss">
	.dive {
		position: absolute;
		inset: 0;
		z-index: 8;
		background: var(--bg);
	}

	.screen {
		position: absolute;
		inset: 0;
	}

	.wait,
	.name {
		position: absolute;
		left: 50%;
		translate: -50% 0;
		margin: 0;
		pointer-events: none;
	}

	.wait {
		top: 42%;
		color: var(--fg-dim);
		font-size: 0.92rem;
	}

	.name {
		top: calc(0.7rem + env(safe-area-inset-top, 0px));
		padding: 0.28rem 0.7rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--panel, #16161c) 82%, transparent);
		color: var(--fg);
		font-size: 0.82rem;
		letter-spacing: 0.04em;
	}

	.back {
		position: absolute;
		left: 50%;
		bottom: calc(0.7rem + var(--tabbar-space, 0px));
		translate: -50% 0;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.45rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--panel, #16161c) 90%, transparent);
		color: var(--fg);
		font: inherit;
		font-size: 0.88rem;
		cursor: pointer;
		backdrop-filter: blur(8px);
		& .material-symbols-outlined {
			font-size: 1.15rem;
		}
	}
</style>
