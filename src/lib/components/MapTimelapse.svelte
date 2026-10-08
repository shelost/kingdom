<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { MediaQuery } from 'svelte/reactivity';
	import { eventAt, formatYear } from '$lib/borders';
	import { MAP_SHEET_BOX, MAP_VIEW } from '$lib/places';
	import { YearPlayer } from '$lib/yearPlayer.svelte';
	import BorderLayer from '$lib/components/BorderLayer.svelte';

	/**
	 * The border timeline on a loop, with no controls: the kingdoms swell and
	 * shrink across the sheet while the year ticks over it. Plays only on screen;
	 * with reduced motion it holds on the year Daeya falls.
	 */
	let { ko = false }: { ko?: boolean } = $props();

	const STILL_YEAR = 642;
	const reduce = new MediaQuery('prefers-reduced-motion: reduce');

	let year = $state(STILL_YEAR);
	const player = new YearPlayer(
		() => year,
		(y) => (year = y),
		{ speed: 36, loop: true }
	);

	/** Borders repaint a blurred SVG, so they step every few years and let their
	    own transitions fill the gap; the readout still ticks every year. */
	const BORDER_STEP = 4;

	let shown = $derived(reduce.current ? STILL_YEAR : year);
	let bordersAt = $derived(Math.floor(shown / BORDER_STEP) * BORDER_STEP);
	let event = $derived(eventAt(shown));

	const playInView: Attachment<HTMLElement> = (node) => {
		const io = new IntersectionObserver(([hit]) => {
			if (hit.isIntersecting && !reduce.current) player.play();
			else player.stop();
		});
		io.observe(node);
		return () => {
			io.disconnect();
			player.stop();
		};
	};
</script>

<div class="timelapse" {@attach playInView}>
	<div class="canvas" style:--map-aspect={MAP_VIEW.w / MAP_VIEW.h}>
		<img
			src="/map-base.svg"
			alt=""
			style:left="{MAP_SHEET_BOX.left}%"
			style:top="{MAP_SHEET_BOX.top}%"
			style:width="{MAP_SHEET_BOX.width}%"
			style:height="{MAP_SHEET_BOX.height}%"
		/>
		<BorderLayer year={bordersAt} />
	</div>
	<div class="readout">
		<span class="year">{formatYear(shown)}</span>
		{#if event}
			<span class="event">{ko ? event.ko : event.en}</span>
		{/if}
	</div>
</div>

<style>
	.timelapse {
		position: relative;
		height: 100%;
		display: grid;
		place-items: center;
		overflow: hidden;
		container-type: size;
	}

	/* Always the map's own shape, as large as the box allows: the sheet (an SVG that
	   letterboxes) and the wash (stretched to its box) only line up when the box keeps it. */
	.canvas {
		position: relative;
		width: min(100cqw, 100cqh * var(--map-aspect));
		aspect-ratio: var(--map-aspect);
		overflow: hidden;
	}

	.canvas img {
		position: absolute;
		display: block;
		max-width: none;
		pointer-events: none;
		/* Same as StoryMap: the sheet is drawn for paper, so invert it onto the dark page. */
		filter: invert(1) hue-rotate(180deg) saturate(0.75) brightness(0.82) contrast(1.1);
	}

	:global(html[data-theme='light']) .canvas img {
		filter: saturate(0.9) contrast(1.02);
	}

	/* The year sits on the sea under the peninsula, where the sheet is empty. */
	.readout {
		position: absolute;
		left: 1rem;
		right: 1rem;
		bottom: 0.9rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-align: left;
		white-space: normal;
		pointer-events: none;
	}

	.year {
		font-family: var(--serif);
		font-size: clamp(1.6rem, 3.2vw, 2.4rem);
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		color: var(--fg-strong);
		text-shadow: 0 1px 12px rgb(0 0 0 / 0.55);
	}

	.event {
		max-width: 22rem;
		font-family: var(--ui);
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--fg-dim);
		text-shadow: 0 1px 8px rgb(0 0 0 / 0.6);
	}

	:global(html[data-theme='light']) .year,
	:global(html[data-theme='light']) .event {
		text-shadow: 0 1px 8px rgb(255 253 248 / 0.9);
	}
</style>
