<script lang="ts">
	/**
	 * The Bone Rank system (골품제) as a pyramid — robe colours as the story
	 * teaches them. Steps:
	 *   - 'ranks'   — the layers stack up under the throne (default)
	 *   - 'chunchu' — True Bone is highlighted and barred from the crown
	 */
	import type { DiagramProps } from './registry';

	let { step = 'ranks', active = false }: DiagramProps = $props();

	const LAYERS = [
		{ ko: '성골', en: 'Sacred Bone', w: 84, c: '#8b5cf6' },
		{ ko: '진골', en: 'True Bone', w: 132, c: '#6d28d9' },
		{ ko: '6두품', en: 'Head Rank Six', w: 180, c: '#b91c1c' },
		{ ko: '5두품', en: 'Head Rank Five', w: 228, c: '#1d4ed8' },
		{ ko: '4두품 이하', en: 'Four & below', w: 276, c: '#a16207' },
		{ ko: '평민 · 노비', en: 'commoners & slaves', w: 324, c: '#6b7280' }
	];

	const TOP = 48;
	const H = 40;
	const GAP = 4;

	const layers = LAYERS.map((l, i) => ({
		...l,
		i,
		x: 180 - l.w / 2,
		y: TOP + i * (H + GAP),
		// stack rises from the bottom up: widest first, apex last
		delay: 150 + (LAYERS.length - 1 - i) * 160
	}));

	const trueBone = layers[1];
</script>

<svg
	viewBox="0 0 360 330"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Pyramid of the Bone Rank system, from Sacred Bone at the top to commoners at the base"
>
	<!-- the throne above the apex -->
	<g class="crown" style="--d: 1250">
		<polygon points="164,38 169,24 176,31 180,20 184,31 191,24 196,38" />
		<text class="crown-label" x="204" y="34">왕좌 the throne</text>
	</g>

	{#each layers as l (l.i)}
		<g class="layer" class:focus={step === 'chunchu' && l.i === 1} style="--d: {l.delay}; --c: {l.c}">
			<rect x={l.x} y={l.y} width={l.w} height={H} rx="3" />
			<text class="l-ko" x="180" y={l.y + 18}>{l.ko}</text>
			<text class="l-en" x="180" y={l.y + 31}>{l.en}</text>
		</g>
	{/each}

	<!-- Chunchu: True Bone, one layer down, barred from the crown -->
	{#if step === 'chunchu'}
		<g class="barred" style="--d: 1600">
			<circle class="dot" cx={trueBone.x + trueBone.w + 10} cy={trueBone.y + 20} r="3.4" />
			<text class="who-ko" x={trueBone.x + trueBone.w + 18} y={trueBone.y + 17}>춘추</text>
			<text class="who-en" x={trueBone.x + trueBone.w + 18} y={trueBone.y + 29}>Chunchu · True Bone</text>
			<line
				class="bar-line"
				x1={trueBone.x + trueBone.w + 10}
				y1={trueBone.y + 12}
				x2="200"
				y2="32"
				pathLength="100"
			/>
			<text class="bar-x" x="230" y="62">✕</text>
		</g>
	{/if}
</svg>

<style>
	.dg {
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
		fill: color-mix(in srgb, var(--c) 38%, #fff8e8);
		stroke: color-mix(in srgb, var(--c) 78%, transparent);
		stroke-width: 1.1;
		transition: stroke 700ms var(--ease) 1900ms, fill 700ms var(--ease) 1900ms;
	}

	.play .layer {
		opacity: 1;
		transform: translateY(0);
	}

	.l-ko {
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--c) 55%, #1a1020);
	}

	.l-en {
		font-size: 7.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	/* the focused layer lights up */
	.play[data-step='chunchu'] .layer.focus rect {
		stroke: var(--gold);
		fill: color-mix(in srgb, var(--c) 52%, #fff8e8);
	}

	/* ——— crown ——— */
	.crown {
		opacity: 0;
		transform: translateY(6px);
		transition: opacity 600ms var(--ease), transform 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.crown polygon {
		fill: var(--gold);
	}

	.crown-label {
		font-size: 8px;
		letter-spacing: 0.1em;
		fill: var(--fg-faint);
	}

	.play .crown {
		opacity: 1;
		transform: translateY(0);
	}

	/* ——— barred from the throne ——— */
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

	.who-ko {
		font-size: 11px;
		font-weight: 700;
		fill: #3b1d6e;
	}

	.who-en {
		font-size: 7px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		fill: var(--fg-faint);
	}

	.bar-line {
		stroke: #cf4b4b;
		stroke-width: 1.4;
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
