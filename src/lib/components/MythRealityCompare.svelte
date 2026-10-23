<script lang="ts" module>
	/** The two tellings of a beat: the song (myth) and what happened (reality). */
	export const VERSION_TAG = {
		myth: { label: 'Myth · 신화', text: 'Myth', color: '#8a6fd1' },
		reality: { label: 'Reality · 실제', text: 'Reality', color: '#4f8a6a' }
	} as const;
</script>

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { storyImg } from '$lib/img';
	import { animating } from '$lib/motionUi.svelte';
	import CardTag from './CardTag.svelte';

	type Side = { src: string; alt: string };

	/**
	 * A myth still and its reality twin, drawn on the same layout, as one frame.
	 * Reality is revealed from the left behind a draggable bar; when the frame scrolls
	 * into view the bar sweeps left to right once, then rests in the middle.
	 */
	let {
		myth,
		reality,
		ratio = 2,
		sizes,
		oncontextmenu
	}: {
		myth: Side;
		reality: Side;
		ratio?: number;
		sizes: string;
		/** Edit mode's image menu, for whichever telling sits under the pointer. */
		oncontextmenu?: (e: MouseEvent, side: 'myth' | 'reality') => void;
	} = $props();

	/** How much of the frame, from the left, shows the reality (percent). */
	let pos = $state(0);
	let frame: HTMLElement | undefined = $state();
	let raf = 0;
	let played = false;

	const SWEEP_MS = 1900;
	const SETTLE_MS = 700;
	const HOLD_MS = 350;

	const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

	function tween(from: number, to: number, ms: number, done?: () => void) {
		const t0 = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - t0) / ms);
			pos = from + (to - from) * ease(t);
			if (t < 1) raf = requestAnimationFrame(step);
			else done?.();
		};
		raf = requestAnimationFrame(step);
	}

	let hold = 0;

	function stop() {
		cancelAnimationFrame(raf);
		clearTimeout(hold);
		raf = 0;
	}

	function play() {
		stop();
		played = true;
		pos = 0;
		tween(0, 100, SWEEP_MS, () => {
			hold = window.setTimeout(() => tween(100, 50, SETTLE_MS), HOLD_MS);
		});
	}

	/** Sweep once, the first time most of the frame is on screen. */
	const watch: Attachment<HTMLElement> = (node) => {
		if (!animating()) {
			pos = 50;
			return;
		}
		if (typeof IntersectionObserver === 'undefined') {
			pos = 50;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (!played && entries.some((e) => e.isIntersecting)) {
					play();
					io.disconnect();
				}
			},
			{ threshold: 0.6 }
		);
		io.observe(node);
		return () => {
			io.disconnect();
			stop();
		};
	};

	function posFrom(clientX: number) {
		if (!frame) return;
		const r = frame.getBoundingClientRect();
		pos = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
	}

	function onDown(e: PointerEvent) {
		if (e.button !== 0) return;
		stop();
		played = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		posFrom(e.clientX);
	}

	function onMove(e: PointerEvent) {
		if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) posFrom(e.clientX);
	}

	function onKey(e: KeyboardEvent) {
		const delta = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : 0;
		if (e.key === 'Home') pos = 0;
		else if (e.key === 'End') pos = 100;
		else if (delta) pos = Math.max(0, Math.min(100, pos + delta));
		else return;
		e.preventDefault();
		stop();
		played = true;
	}

	function onMenu(e: MouseEvent) {
		if (!oncontextmenu || !frame) return;
		const r = frame.getBoundingClientRect();
		oncontextmenu(e, ((e.clientX - r.left) / r.width) * 100 < pos ? 'reality' : 'myth');
	}
</script>

<div class="wrap">
	<figure
		class="compare"
		style:--ratio={ratio}
		style:--pos={`${pos}%`}
		bind:this={frame}
		{@attach watch}
		onpointerdown={onDown}
		onpointermove={onMove}
		oncontextmenu={onMenu}
	>
		<img class="layer" {...storyImg(myth.src, { kind: 'cue', sizes, widths: [640, 828, 1200, 1600], alt: myth.alt })} draggable="false" />
		<img
			class="layer reality"
			{...storyImg(reality.src, { kind: 'cue', sizes, widths: [640, 828, 1200, 1600], alt: reality.alt })}
			draggable="false"
		/>
		<span
			class="bar"
			role="slider"
			tabindex="0"
			aria-label="Myth or reality"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={Math.round(pos)}
			aria-valuetext={`${Math.round(pos)}% reality`}
			onkeydown={onKey}
		>
			<span class="knob" aria-hidden="true">
				<span class="material-symbols-outlined">chevron_left</span>
				<span class="material-symbols-outlined">chevron_right</span>
			</span>
		</span>
	</figure>
	{#each ['reality', 'myth'] as const as side (side)}
		{@const tag = VERSION_TAG[side]}
		<span class="tag {side}" class:dim={side === 'reality' ? pos < 12 : pos > 88}>
			<CardTag icons={[side]} colors={[tag.color]} label={tag.label} text={tag.text} glass />
		</span>
	{/each}
	{#if animating()}
		<button type="button" class="replay" aria-label="Replay the sweep" title="Replay" onclick={play}>
			<span class="material-symbols-outlined" aria-hidden="true">replay</span>
		</button>
	{/if}
</div>

<style>
	/* The reader clips overflow on the column, so a tag set outside this box
	   gets cut off. The hang lives in the padding instead: the pill straddles
	   the frame's corner and never leaves the box. */
	.wrap {
		position: relative;
		padding: 0.85rem 0.7rem 0;
	}

	.compare {
		position: relative;
		margin: 0;
		width: 100%;
		aspect-ratio: var(--ratio);
		overflow: hidden;
		border-radius: var(--widget-radius);
		background: #14141a;
		touch-action: pan-y;
		user-select: none;
		cursor: ew-resize;
	}

	.layer {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
	}

	.reality {
		clip-path: inset(0 calc(100% - var(--pos)) 0 0);
	}

	/* Tags hang off the frame's top corners, like the wiki's card tags. */
	.tag {
		position: absolute;
		top: 0;
		z-index: 5;
		pointer-events: none;
		transition: opacity 220ms var(--ease);
	}

	.tag.reality {
		left: 0;
	}

	.tag.myth {
		right: 0;
	}

	.tag.dim {
		opacity: 0.35;
	}

	.replay {
		position: absolute;
		right: 0.7rem;
		bottom: 0.7rem;
		z-index: 5;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		color: #fffaf0;
		cursor: pointer;
		background: rgb(20 18 24 / 0.28);
		backdrop-filter: blur(14px) saturate(1.4);
		-webkit-backdrop-filter: blur(14px) saturate(1.4);
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.28),
			inset 0 1px 0 rgb(255 255 255 / 0.35),
			0 8px 22px -8px rgb(0 0 0 / 0.65);
		transition:
			background 160ms var(--ease),
			rotate 360ms var(--ease);
	}

	.replay:hover {
		background: rgb(255 255 255 / 0.18);
		rotate: -45deg;
	}

	.replay:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.replay .material-symbols-outlined {
		font-size: 1.3rem;
	}

	.bar {
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--pos);
		z-index: 4;
		width: 2px;
		translate: -1px 0;
		background: rgb(255 255 255 / 0.92);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.25), 0 0 18px rgb(0 0 0 / 0.45);
		outline: none;
	}

	.knob {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.6rem;
		height: 2.6rem;
		border-radius: 50%;
		background: rgb(20 20 26 / 0.62);
		border: 2px solid rgb(255 255 255 / 0.92);
		backdrop-filter: blur(6px);
		color: #fff;
		box-shadow: 0 4px 14px rgb(0 0 0 / 0.5);
	}

	.knob .material-symbols-outlined {
		font-size: 1.05rem;
		margin-inline: -0.2rem;
	}

	.bar:focus-visible .knob {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}
</style>
