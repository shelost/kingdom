<script module lang="ts">
	import { reading } from '$lib/reading.svelte';

	const YELLOW = '#eab308';

	export interface Layer {
		ko: string;
		en: string;
		c: string;
		/** How solid the colour is: the head ranks fade towards the bottom. */
		a: number;
		/** The highest office that bone may reach (of the 17 ranks), where the record says. */
		capKo?: string;
		cap?: string;
	}

	/** Apex first. */
	export const LAYERS: Layer[] = [
		{ ko: '성골', en: 'Sacred Bone', c: '#a78bfa', a: 1, capKo: '왕위', cap: 'the crown' },
		{ ko: '진골', en: 'True Bone', c: '#8b5cf6', a: 1, capKo: '이벌찬까지', cap: 'up to rank 1' },
		{ ko: '6두품', en: 'Head Rank Six', c: '#ef4444', a: 1, capKo: '아찬까지', cap: 'up to rank 6' },
		{ ko: '5두품', en: 'Head Rank Five', c: '#3b82f6', a: 1, capKo: '대나마까지', cap: 'up to rank 10' },
		{ ko: '4두품', en: 'Head Rank Four', c: YELLOW, a: 1, capKo: '대사까지', cap: 'up to rank 12' },
		{ ko: '3두품', en: 'Head Rank Three', c: YELLOW, a: 0.72 },
		{ ko: '2두품', en: 'Head Rank Two', c: YELLOW, a: 0.5 },
		{ ko: '1두품', en: 'Head Rank One', c: YELLOW, a: 0.32 },
		{ ko: '평민 · 노비', en: 'commoners & slaves', c: '#9ca3af', a: 1, capKo: '관직 없음', cap: 'no office' }
	];

	export const KING = { ko: '왕', han: '王', en: 'King' };

	/** English unless the reader is Korean-only. */
	export const enFor = (en: string | undefined) => (reading.lang === 'ko' ? undefined : en);
</script>

<script lang="ts">
	/**
	 * The Bone Rank system (골품제) as a pyramid — robe colours as the story
	 * teaches them, the King (王) on the summit, the lowest head ranks
	 * fading into the commoners below. Steps:
	 *   - 'ranks'   — the layers stack up under the King (default)
	 *   - 'chunchu' — True Bone is highlighted and barred from the crown
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';

	let { step = 'ranks', active = false, flat = false }: DiagramProps = $props();

	const TOP = 74;
	const H = 36;
	const GAP = 4;
	const APEX_W = 84;
	const STEP_W = 32;
	const GLYPH_Y = 58;

	const layers = LAYERS.map((l, i) => {
		const w = APEX_W + i * STEP_W;
		return {
			...l,
			i,
			w,
			x: 180 - w / 2,
			y: TOP + i * (H + GAP),
			// stack rises from the bottom up: widest first, apex last
			delay: 150 + (LAYERS.length - 1 - i) * 140
		};
	});

	const trueBone = layers[1];
	const height = TOP + LAYERS.length * (H + GAP) + 6;
</script>

<KitStage id="bone-rank" {step} {active} {flat}>
	{#snippet fallback()}
<svg
	viewBox="0 0 360 {height}"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Pyramid of the Bone Rank system: the King on top, then Sacred Bone, True Bone, head ranks six down to one, and commoners at the base"
>
	<!-- the King on the summit -->
	<g class="crown" style="--d: 1450">
		<text class="glyph" x="180" y={GLYPH_Y}>{KING.han}</text>
		<ChartLabel x="240" y={GLYPH_Y - 10} ko={KING.ko} en={enFor(KING.en)} w={46} size="sm" />
	</g>

	{#each layers as l (l.i)}
		<g
			class="layer"
			class:focus={step === 'chunchu' && l.i === 1}
			style="--d: {l.delay}; --c: {l.c}; --a: {l.a}"
		>
			<rect x={l.x} y={l.y} width={l.w} height={H} rx="3" />
			<ChartLabel x="180" y={l.y + H / 2} ko={l.ko} en={enFor(l.en)} w={Math.min(l.w - 12, 120)} size="sm" />
		</g>
	{/each}

	<!-- Chunchu: True Bone, one layer down, barred from the crown -->
	{#if step === 'chunchu'}
		<g class="barred" style="--d: 1600">
			<circle class="dot" cx={trueBone.x + trueBone.w + 10} cy={trueBone.y + H / 2} r="3.4" />
			<ChartLabel
				x={trueBone.x + trueBone.w + 52}
				y={trueBone.y + H / 2}
				ko="춘추"
				en={enFor('True Bone')}
				w={72}
				size="sm"
			/>
			<line
				class="bar-line"
				x1={trueBone.x + trueBone.w + 10}
				y1={trueBone.y + H / 2 - 8}
				x2="198"
				y2={GLYPH_Y - 6}
				pathLength="100"
			/>
			<text class="bar-x" x="226" y={GLYPH_Y + 22}>✕</text>
		</g>
	{/if}
</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #a78bfa;
		font-family: var(--serif);
	}

	/* ——— layers ——— */
	.layer {
		opacity: 0;
		transform: translateY(14px);
		transition: opacity 600ms var(--ease), transform 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.layer rect {
		fill: var(--c);
		fill-opacity: var(--a, 1);
		stroke: color-mix(in srgb, var(--c) 28%, #080604);
		stroke-opacity: calc(0.35 + var(--a, 1) * 0.65);
		stroke-width: var(--stroke-w);
		transition: stroke 700ms var(--ease) 1900ms, fill 700ms var(--ease) 1900ms;
	}

	.play .layer {
		opacity: 1;
		transform: translateY(0);
	}

	.play[data-step='chunchu'] .layer.focus rect {
		stroke: var(--gold);
		stroke-width: 3.2;
		fill: var(--c);
	}

	.crown {
		opacity: 0;
		transform: translateY(6px);
		transition: opacity 600ms var(--ease), transform 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.glyph {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 34px;
		font-weight: 900;
		text-anchor: middle;
		fill: var(--gold);
	}

	.play .crown {
		opacity: 1;
		transform: translateY(0);
	}

	.barred {
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .barred {
		opacity: 1;
	}

	.barred .dot {
		fill: var(--gold);
	}

	.bar-line {
		stroke: #cf4b4b;
		stroke-width: 2.2;
		stroke-dasharray: 5 4;
	}

	.bar-x {
		font-size: 14px;
		font-weight: 700;
		text-anchor: middle;
		fill: #cf4b4b;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
