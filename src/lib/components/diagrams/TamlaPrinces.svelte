<script lang="ts">
	/**
	 * Tamla three princes rising from Samseonghyeol (삼성혈).
	 * Compact island diagram — step unused beyond registry default.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'well', active = false }: DiagramProps = $props();

	const PRINCES = [
		{ ko: '양을나', en: 'Yang', x: 90 },
		{ ko: '고을나', en: 'Go', x: 180 },
		{ ko: '부을나', en: 'Bu', x: 270 }
	] as const;
</script>

<svg
	viewBox="0 0 360 260"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of the three Tamla princes rising from the Samseonghyeol well"
>
	<!-- island note -->
	<text class="island" style="--d: 0" x="180" y="28">탐라 · Tamla</text>

	<!-- three princes -->
	{#each PRINCES as p, i (p.en)}
		<path
			class="rise"
			style="--d: {200 + i * 120}"
			d="M {p.x} 168 V 92"
			pathLength="100"
		/>
		<g class="node prince" style="--d: {400 + i * 140}">
			<circle cx={p.x} cy="72" r="26" />
			<ChartLabel x={p.x} y="74" ko={p.ko} en={p.en} w={50} />
		</g>
	{/each}

	<!-- the well / hole -->
	<g class="well" style="--d: 100">
		<ellipse class="well-rim" cx="180" cy="178" rx="78" ry="22" />
		<ellipse class="well-mouth" cx="180" cy="178" rx="52" ry="14" />
		<ChartLabel x="180" y="178" ko="삼성혈" en="the well" w={70} size="sm" />
	</g>

	<text class="foot" style="--d: 1100" x="180" y="240">세 왕자 · three princes from the well</text>
</svg>

<style>
	.dg {
		--accent: #ff9a2e;
		--tamla: #ff9a2e;
		font-family: var(--serif);
	}

	.island,
	.node,
	.well,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: translateY(10px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 700ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .island,
	.play .node,
	.play .well,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: translateY(0);
	}

	.island {
		font-size: 8px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--tamla);
	}

	.prince circle {
		fill: var(--tamla);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.well-rim {
		fill: color-mix(in srgb, var(--tamla) 62%, #3a1800);
		stroke: var(--node-stroke);
		stroke-width: 2.2;
	}

	.well-mouth {
		fill: var(--tamla);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.rise {
		fill: none;
		stroke: var(--tamla);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 900ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .rise {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 6.5px;
		text-transform: none;
		letter-spacing: 0.05em;
		fill: var(--tamla);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .rise {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
