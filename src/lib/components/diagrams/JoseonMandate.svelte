<script lang="ts">
	/**
	 * Old Joseon mandate lineage: Hwanin → Hwanung → Dangun → Asadal.
	 * Compact vertical chain. Step unused beyond registry default.
	 */
	import type { DiagramProps } from './registry';

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
			<text class="n-ko" x="140" y={n.y + 1}>{n.ko}</text>
			<text class="n-en" x="140" y={n.y + 14}>{n.en}</text>
		</g>
	{/each}

	<text class="foot" style="--d: 900" x="140" y="258">고조선 · Old Joseon</text>
</svg>

<style>
	.dg {
		--joseon: #c4a574;
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
		fill: color-mix(in srgb, var(--joseon) 14%, transparent);
		stroke: color-mix(in srgb, var(--joseon) 60%, transparent);
		stroke-width: 1.15;
	}

	.n-ko {
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--joseon) 40%, #fffdf8);
	}

	.n-en,
	.foot {
		text-anchor: middle;
		fill: var(--fg-faint);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.n-en {
		font-size: 6px;
	}

	.link {
		fill: none;
		stroke: color-mix(in srgb, var(--joseon) 42%, transparent);
		stroke-width: 1.05;
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
		fill: color-mix(in srgb, var(--joseon) 55%, var(--fg-faint));
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
