<script lang="ts">
	/**
	 * Silla Hwarang order: 국선 (marshal) centered above six 화랑;
	 * four 낭도 stacked vertically beneath each hwarang.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { active = false }: DiagramProps = $props();

	/** Six-column row centered in viewBox; marshal x matches row midpoint. */
	const HWARANG_XS = [48, 108, 168, 228, 288, 348] as const;
	const ROW_MID = (HWARANG_XS[0] + HWARANG_XS[5]) / 2;
	const MARSHAL = { ko: '국선', en: 'Marshal', x: ROW_MID, y: 36 };
	const HW_Y = 118;
	const DISC_YS = [172, 196, 220, 244] as const;
</script>

<svg
	viewBox="0 0 396 360"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Hwarang org chart: Marshal at the apex, six Hwarang in a row, four disciples stacked beneath each"
>
	<g class="node marshal" style="--d: 0">
		<circle cx={MARSHAL.x} cy={MARSHAL.y} r="30" />
		<ChartLabel x={MARSHAL.x} y={MARSHAL.y + 2} ko={MARSHAL.ko} en={MARSHAL.en} w={56} size="lg" />
	</g>

	<path class="spine" style="--d: 180" d="M {ROW_MID} 66 V 88" pathLength="100" />

	{#each HWARANG_XS as hx, i (hx)}
		<g class="node hwarang" style="--d: {320 + i * 90}">
			<path
				class="link"
				style="--d: {300 + i * 90}"
				d="M {ROW_MID} 88 C {ROW_MID} 100 {hx} 100 {hx} {HW_Y}"
				pathLength="100"
			/>
			<rect x={hx - 26} y={HW_Y} width="52" height="38" rx="5" />
			<ChartLabel x={hx} y={HW_Y + 19} ko="화랑" en="Hwarang" w={48} />
		</g>
		<path
			class="link disc-spine"
			style="--d: {500 + i * 90}"
			d="M {hx} {HW_Y + 38} V {DISC_YS[0]}"
			pathLength="100"
		/>
		{#each DISC_YS as dy, d (d)}
			<g class="node disc" style="--d: {520 + i * 90 + d * 40}">
				<rect x={hx - 14} y={dy} width="28" height="18" rx="3" />
				<ChartLabel x={hx} y={dy + 9} ko="낭도" w={26} size="sm" />
			</g>
		{/each}
	{/each}

	<text class="foot" style="--d: 1200" x={ROW_MID} y="348">6 화랑 · 24 낭도</text>
</svg>

<style>
	.dg {
		--accent: #4d8eff;
		--silla: #4d8eff;
		--gold: #e8c36a;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot {
		opacity: 1;
		transform: translateY(0);
	}

	.marshal circle {
		fill: var(--gold);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.hwarang rect {
		fill: var(--silla);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.disc rect {
		fill: var(--silla);
		stroke: var(--node-stroke);
		stroke-width: 2.2;
	}

	.spine,
	.link {
		fill: none;
		stroke: var(--silla);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 900ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .spine,
	.play .link {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 7px;
		letter-spacing: 0.06em;
		text-anchor: middle;
		fill: var(--gold);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
		}

		.play .spine,
		.play .link {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
