<script lang="ts">
	/**
	 * Tamla three princes rising from Samseonghyeol (삼성혈).
	 * Compact island diagram — step unused beyond registry default.
	 */
	import type { DiagramProps } from './registry';

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
			<text class="p-ko" x={p.x} y="70">{p.ko}</text>
			<text class="p-en" x={p.x} y="84">{p.en}</text>
		</g>
	{/each}

	<!-- the well / hole -->
	<g class="well" style="--d: 100">
		<ellipse class="well-rim" cx="180" cy="178" rx="78" ry="22" />
		<ellipse class="well-mouth" cx="180" cy="178" rx="52" ry="14" />
		<text class="w-ko" x="180" y="184">삼성혈</text>
		<text class="w-en" x="180" y="208">Samseonghyeol</text>
	</g>

	<text class="foot" style="--d: 1100" x="180" y="240">세 왕자 · three princes from the well</text>
</svg>

<style>
	.dg {
		--tamla: #e08a2e;
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
		fill: color-mix(in srgb, var(--tamla) 55%, var(--fg-faint));
	}

	.prince circle {
		fill: color-mix(in srgb, var(--tamla) 16%, transparent);
		stroke: color-mix(in srgb, var(--tamla) 70%, transparent);
		stroke-width: 1.2;
	}

	.p-ko {
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--tamla) 40%, #fffdf8);
	}

	.p-en,
	.w-en,
	.foot {
		text-anchor: middle;
		fill: var(--fg-faint);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.p-en {
		font-size: 6px;
	}

	.well-rim {
		fill: color-mix(in srgb, var(--tamla) 8%, transparent);
		stroke: color-mix(in srgb, var(--tamla) 40%, transparent);
		stroke-width: 1;
	}

	.well-mouth {
		fill: color-mix(in srgb, var(--tamla) 18%, #1a1410);
		stroke: color-mix(in srgb, var(--tamla) 55%, transparent);
		stroke-width: 1.1;
	}

	.w-ko {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--tamla) 50%, #fffdf8);
	}

	.w-en {
		font-size: 6.5px;
	}

	.rise {
		fill: none;
		stroke: color-mix(in srgb, var(--tamla) 45%, transparent);
		stroke-width: 1.1;
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
		fill: color-mix(in srgb, var(--tamla) 50%, var(--fg-faint));
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
