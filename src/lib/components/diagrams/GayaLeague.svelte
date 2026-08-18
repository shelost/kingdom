<script lang="ts">
	/**
	 * Gaya iron confederacy — six courts, no single crown.
	 * Step accepted for registry contract; default `'league'`.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'league', active = false }: DiagramProps = $props();

	const CX = 180;
	const CY = 128;
	const R = 88;

	const COURTS = [
		{ ko: '금관', en: 'Golden' },
		{ ko: '대가야', en: 'Great' },
		{ ko: '소가야', en: 'Lesser' },
		{ ko: '성산', en: 'Holy' },
		{ ko: '고자', en: 'Bright' },
		{ ko: '안라', en: 'Iron' }
	].map((c, i) => {
		const a = ((-90 + i * 60) * Math.PI) / 180;
		return {
			...c,
			i,
			x: CX + R * Math.cos(a),
			y: CY + R * Math.sin(a)
		};
	});
</script>

<svg
	viewBox="0 0 360 280"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of the Gaya confederacy: six iron courts in a ring with no single throne"
>
	<!-- faint ring -->
	<circle class="ring" style="--d: 80" cx={CX} cy={CY} r={R} />

	<!-- spokes -->
	{#each COURTS as c (c.i)}
		<line
			class="spoke"
			style="--d: {140 + c.i * 70}"
			x1={CX}
			y1={CY}
			x2={c.x}
			y2={c.y}
			pathLength="100"
		/>
	{/each}

	<!-- centre: confederacy, not a throne -->
	<g class="center" style="--d: 0">
		<circle class="hub" cx={CX} cy={CY} r="34" />
		<ChartLabel x={CX} y={CY + 2} ko="가야" en="league" w={62} size="lg" />
	</g>

	{#each COURTS as c (c.i)}
		<g class="node court" style="--d: {500 + c.i * 100}">
			<circle cx={c.x} cy={c.y} r="24" />
			<ChartLabel x={c.x} y={c.y + 2} ko={c.ko} en={c.en} w={44} size="sm" />
		</g>
	{/each}

	<text class="foot" style="--d: 1300" x="180" y="258">여섯 가야 · no single crown</text>
</svg>

<style>
	.dg {
		--accent: #edb15a;
		--gaya: #edb15a;
		font-family: var(--serif);
	}

	.center,
	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: scale(0.35);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 550ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .center,
	.play .node,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: scale(1);
	}

	.ring {
		fill: none;
		stroke: var(--gaya);
		stroke-width: 2.2;
		stroke-dasharray: 3 5;
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .ring {
		opacity: 1;
	}

	.hub {
		fill: var(--gaya);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
		stroke-dasharray: 4 4;
	}

	.court circle {
		fill: var(--gaya);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.spoke {
		fill: none;
		stroke: var(--gaya);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .spoke {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 7px;
		text-transform: none;
		letter-spacing: 0.06em;
		fill: var(--gaya);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .spoke {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
