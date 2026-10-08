<script lang="ts">
	import { tick } from 'svelte';
	import { prefersReducedMotion } from '$lib/inView';
	import { BRUSH_HAN, brushFamily } from '$lib/brushFont';

	/**
	 * Black sumi calligraphy, written one character at a time once `play` turns on.
	 * Each character is set in a brush face and revealed through a soft mask: for
	 * hanja the mask follows hanzi-writer's stroke medians in stroke order; Hangul,
	 * and any hanja the stroke data lacks, are brushed in with a wipe in the
	 * writing direction. A last soak fills whatever the medians missed.
	 */
	let {
		text,
		size = '4.5rem',
		grid = false,
		vertical = false,
		play = false,
		speed = 1,
		onwritten,
		ondone
	}: {
		text: string;
		/** Edge of one character square (any CSS length). */
		size?: string;
		/** 米字格 practice squares behind each character. */
		grid?: boolean;
		/** Top-to-bottom column instead of a left-to-right row. */
		vertical?: boolean;
		play?: boolean;
		/** Brush tempo: 1 is the house pace, below 1 a slower, heavier hand. */
		speed?: number;
		onwritten?: (i: number) => void;
		ondone?: () => void;
	} = $props();

	const uid = $props.id();
	/** House pace relative to hanzi-writer's own timing. */
	const PACE = 1.25;
	const STROKE_SPEED = 4.8;
	const STROKE_GAP = 22;
	const CHAR_GAP = 80;
	const WIPE_MS = 280;
	const SOAK_MS = 160;
	/** Mask brush width in the 1024-unit glyph square: wide enough to cover a fat brush stroke. */
	const BRUSH_W = 170;
	const HAN = /\p{Script=Han}/u;

	type Median = { points: string; length: number };

	let tempo = $derived(Math.max(0.1, speed) * PACE);
	let wipeMs = $derived(Math.round(WIPE_MS / tempo));
	let soakMs = $derived(Math.round(SOAK_MS / tempo));
	let glyphs = $derived(Array.from(text));
	let face = $state(BRUSH_HAN);
	/** Stroke medians per glyph; null brushes it in with a wipe. */
	let medians = $state<(Median[] | null)[]>([]);
	let written = $state<boolean[]>([]);
	let settled = $state<boolean[]>([]);
	let inks: SVGSVGElement[] = $state([]);
	let started = false;

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	function median(pts: number[][]): Median {
		let length = 0;
		for (let k = 1; k < pts.length; k++) {
			length += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
		}
		return { points: pts.map((p) => p.join(',')).join(' '), length: Math.max(1, length) };
	}

	async function strokeData(char: string): Promise<Median[] | null> {
		try {
			const { default: HanziWriter } = await import('hanzi-writer');
			const data = await HanziWriter.loadCharacterData(char);
			return data?.medians?.length ? data.medians.map(median) : null;
		} catch {
			return null;
		}
	}

	async function brush(i: number) {
		const lines = medians[i];
		if (!lines) {
			await sleep(wipeMs);
			return;
		}
		const strokes = inks[i]?.querySelectorAll<SVGPolylineElement>('.stroke') ?? [];
		for (const [k, el] of Array.from(strokes).entries()) {
			const len = lines[k].length;
			await el.animate(
				[
					{ opacity: 1, strokeDashoffset: len },
					{ opacity: 1, strokeDashoffset: 0 }
				],
				{
					duration: (len + 600) / (3 * STROKE_SPEED * tempo),
					easing: 'cubic-bezier(0.35, 0.05, 0.35, 1)',
					fill: 'forwards'
				}
			).finished;
			await sleep(STROKE_GAP / tempo);
		}
	}

	async function write() {
		const [family, data] = await Promise.all([
			brushFamily(text),
			Promise.all(glyphs.map((g) => (HAN.test(g) ? strokeData(g) : Promise.resolve(null))))
		]);
		face = family;
		medians = data;
		await tick();
		if (prefersReducedMotion()) {
			written = glyphs.map(() => true);
			settled = glyphs.map(() => true);
			glyphs.forEach((_, i) => onwritten?.(i));
			ondone?.();
			return;
		}
		for (let i = 0; i < glyphs.length; i++) {
			if (!glyphs[i].trim()) continue;
			written[i] = true;
			await brush(i);
			settled[i] = true;
			onwritten?.(i);
			await sleep(CHAR_GAP / tempo);
		}
		await sleep(soakMs);
		ondone?.();
	}

	$effect(() => {
		if (play && !started) {
			started = true;
			write();
		}
	});
</script>

<span
	class="brush-glyphs"
	class:vertical
	class:grid
	style:--size={size}
	style:--han-face={face}
	style:--wipe="{wipeMs}ms"
	style:--soak="{soakMs}ms"
	role="img"
	aria-label={text}
>
	<svg class="defs" aria-hidden="true" focusable="false">
		<defs>
			<filter id="{uid}-wet" filterUnits="userSpaceOnUse" x="-120" y="-120" width="1264" height="1264">
				<feGaussianBlur stdDeviation="16" />
			</filter>
			<filter id="{uid}-bleed" filterUnits="userSpaceOnUse" x="-60" y="-60" width="1144" height="1144">
				<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="fibre" />
				<feDisplacementMap in="SourceGraphic" in2="fibre" scale="14" xChannelSelector="R" yChannelSelector="G" />
			</filter>
		</defs>
	</svg>
	{#each glyphs as g, i (i)}
		{#if g.trim()}
			<span class="sq" class:on={written[i]} class:settled={settled[i]} class:han={HAN.test(g)}>
				{#if grid}
					<svg class="grid-lines" viewBox="0 0 100 100" aria-hidden="true">
						<rect x="0.5" y="0.5" width="99" height="99" />
						<line x1="50" y1="0" x2="50" y2="100" />
						<line x1="0" y1="50" x2="100" y2="50" />
						<line x1="0" y1="0" x2="100" y2="100" />
						<line x1="100" y1="0" x2="0" y2="100" />
					</svg>
				{/if}
				<svg class="ink" viewBox="0 0 1024 1024" aria-hidden="true" bind:this={inks[i]}>
					<mask id="{uid}-m{i}" maskUnits="userSpaceOnUse" x="-120" y="-120" width="1264" height="1264">
						<g filter="url(#{uid}-wet)">
							{#if medians[i]}
								<g transform="translate(0 900) scale(1 -1)">
									{#each medians[i] ?? [] as m, k (k)}
										<polyline
											class="stroke"
											points={m.points}
											stroke-width={BRUSH_W}
											stroke-dasharray="{m.length} {m.length}"
										/>
									{/each}
								</g>
							{:else}
								<rect class="wipe" x="-60" y="-60" width="1144" height="1144" />
							{/if}
						</g>
						<rect class="soak" x="-60" y="-60" width="1144" height="1144" />
					</mask>
					{#if grid}<text class="ghost" x="512" y="512">{g}</text>{/if}
					<text x="512" y="512" mask="url(#{uid}-m{i})" filter="url(#{uid}-bleed)">{g}</text>
				</svg>
			</span>
		{:else}
			<span class="space" aria-hidden="true"></span>
		{/if}
	{/each}
</span>

<style>
	.brush-glyphs {
		position: relative;
		display: inline-flex;
		flex-wrap: wrap;
		color: var(--sumi);
	}

	.vertical {
		flex-direction: column;
		flex-wrap: nowrap;
	}

	.grid {
		gap: calc(var(--size) * 0.1);
	}

	.defs {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
	}

	.sq {
		position: relative;
		width: var(--size);
		height: var(--size);
		flex: none;
	}

	.space {
		width: calc(var(--size) * 0.25);
		height: calc(var(--size) * 0.25);
	}

	.grid-lines,
	.ink {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.grid-lines {
		fill: none;
		stroke: rgba(184, 56, 42, 0.38);
		stroke-width: 0.6;
		vector-effect: non-scaling-stroke;
	}

	.grid-lines line {
		stroke-dasharray: 2 3;
	}

	text {
		font-family: var(--brush);
		font-size: 980px;
		text-anchor: middle;
		dominant-baseline: central;
		fill: currentColor;
	}

	/* The brush faces come in one weight; a stroke of the same ink loads the brush heavier. */
	.han text {
		font-family: var(--han-face);
		stroke: currentColor;
		stroke-width: 30px;
		stroke-linejoin: round;
		paint-order: stroke fill;
	}

	.han text.ghost {
		stroke: none;
	}

	text.ghost {
		fill: color-mix(in srgb, currentColor 8%, transparent);
	}

	.stroke {
		fill: none;
		stroke: #fff;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0;
	}

	.wipe,
	.soak {
		fill: #fff;
	}

	.wipe {
		transform-box: view-box;
		transform-origin: 0 0;
		transform: scaleX(0);
		transition: transform var(--wipe, 280ms) cubic-bezier(0.3, 0.6, 0.3, 1);
	}

	.vertical .wipe {
		transform: scaleY(0);
	}

	.on .wipe {
		transform: none;
	}

	.soak {
		opacity: 0;
		transition: opacity var(--soak, 160ms) ease-out;
	}

	.settled .soak {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.wipe,
		.soak {
			transition: none;
		}
	}
</style>
