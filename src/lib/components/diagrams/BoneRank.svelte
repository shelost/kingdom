<script lang="ts">
	/**
	 * The Bone Rank system (골품제) as a pyramid — robe colours as the story
	 * teaches them. Steps:
	 *   - 'ranks'   — the layers stack up under the throne (default)
	 *   - 'chunchu' — True Bone is highlighted and barred from the crown
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'ranks', active = false }: DiagramProps = $props();

	const LAYERS = [
		{ ko: '성골', en: 'Sacred Bone', w: 84, c: '#a78bfa' },
		{ ko: '진골', en: 'True Bone', w: 132, c: '#8b5cf6' },
		{ ko: '6두품', en: 'Head Rank Six', w: 180, c: '#ef4444' },
		{ ko: '5두품', en: 'Head Rank Five', w: 228, c: '#3b82f6' },
		{ ko: '4두품 이하', en: 'Four & below', w: 276, c: '#eab308' },
		{ ko: '평민 · 노비', en: 'commoners & slaves', w: 324, c: '#9ca3af' }
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
		<ChartLabel x="248" y="32" ko="왕좌" en="throne" w={52} size="sm" />
	</g>

	{#each layers as l (l.i)}
		<g class="layer" class:focus={step === 'chunchu' && l.i === 1} style="--d: {l.delay}; --c: {l.c}">
			<rect x={l.x} y={l.y} width={l.w} height={H} rx="3" />
			<ChartLabel x="180" y={l.y + H / 2} ko={l.ko} en={l.en} w={Math.min(l.w - 12, 140)} />
		</g>
	{/each}

	<!-- Chunchu: True Bone, one layer down, barred from the crown -->
	{#if step === 'chunchu'}
		<g class="barred" style="--d: 1600">
			<circle class="dot" cx={trueBone.x + trueBone.w + 10} cy={trueBone.y + 20} r="3.4" />
			<ChartLabel
				x={trueBone.x + trueBone.w + 52}
				y={trueBone.y + 20}
				ko="춘추"
				en="True Bone"
				w={72}
				size="sm"
			/>
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
		stroke: color-mix(in srgb, var(--c) 28%, #080604);
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

	.crown polygon {
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
