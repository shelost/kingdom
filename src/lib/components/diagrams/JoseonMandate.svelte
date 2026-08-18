<script lang="ts">
	/**
	 * Old Joseon mandate lineage: Hwanin → Hwanung → Dangun → Asadal.
	 * Compact vertical chain. Step unused beyond registry default.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'lineage', active = false }: DiagramProps = $props();

	const NODES = [
		{ ko: '환인', en: 'Hwanin', y: 36 },
		{ ko: '환웅', en: 'Hwanung', y: 96 },
		{ ko: '단군', en: 'Dangun', y: 156 },
		{ ko: '아사달', en: 'Asadal', y: 216 }
	] as const;
</script>

<svg
	viewBox="0 0 280 280"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Vertical lineage of the Old Joseon mandate from Hwanin through Hwanung and Dangun to Asadal"
>
	{#each NODES as n, i (n.en)}
		{#if i < NODES.length - 1}
			<path
				class="link"
				style="--d: {200 + i * 180}"
				d="M 140 {n.y + 22} V {NODES[i + 1].y - 22}"
				pathLength="100"
			/>
		{/if}
		<g class="node" style="--d: {80 + i * 180}">
			<circle cx="140" cy={n.y} r={i === 2 ? 26 : 22} />
			<ChartLabel x="140" y={n.y + 2} ko={n.ko} en={n.en} w={i === 2 ? 52 : 44} size={i === 2 ? 'md' : 'sm'} />
		</g>
	{/each}

	<text class="foot" style="--d: 900" x="140" y="258">고조선 · Old Joseon</text>
</svg>

<style>
	.dg {
		--accent: #f0c56a;
		--joseon: #f0c56a;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: translateY(8px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 700ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: translateY(0);
	}

	.node circle {
		fill: var(--joseon);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.link {
		fill: none;
		stroke: var(--joseon);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 900ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .link {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 7.5px;
		text-transform: none;
		letter-spacing: 0.08em;
		fill: var(--joseon);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .link {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
