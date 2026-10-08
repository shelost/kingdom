<script module lang="ts">
	/** Roughly where each polity sat: x runs east, y runs south, across the lower Nakdong. */
	export const CX = 180;
	export const CY = 140;

	/** The six great Gayas, each its own shade of purple: one league, no single crown. */
	export const COURTS = [
		{ ko: '고령가야', en: 'Goryeong', x: 196, y: 38, shade: '#c3a3ea' },
		{ ko: '성산가야', en: 'Seongsan', x: 246, y: 84, shade: '#a983dc' },
		{ ko: '대가야', en: 'Daegaya', x: 170, y: 104, shade: '#6a34a6' },
		{ ko: '아라가야', en: 'Ara', x: 182, y: 192, shade: '#7d4bbd' },
		{ ko: '금관가야', en: 'Geumgwan', x: 270, y: 206, shade: '#4f2185' },
		{ ko: '소가야', en: 'Sogaya', x: 106, y: 214, shade: '#9468cf' }
	].map((c, i) => ({ ...c, i }));

	/** The smaller states round them, sized by how much the records make of them. */
	export const STATES = [
		{ ko: '기문', en: 'Gimun', x: 52, y: 92, r: 9 },
		{ ko: '졸마', en: 'Jolma', x: 96, y: 126, r: 7 },
		{ ko: '다라', en: 'Dara', x: 128, y: 150, r: 10 },
		{ ko: '산반하', en: 'Sanbanha', x: 150, y: 166, r: 6 },
		{ ko: '걸찬', en: 'Geolchan', x: 82, y: 168, r: 6 },
		{ ko: '자타', en: 'Jata', x: 128, y: 190, r: 8 },
		{ ko: '사이기', en: 'Sai-gi', x: 156, y: 140, r: 6 },
		{ ko: '대사', en: 'Dasa', x: 60, y: 226, r: 8 },
		{ ko: '임례', en: 'Imrye', x: 214, y: 168, r: 6 },
		{ ko: '비화', en: 'Bihwa', x: 236, y: 130, r: 9 },
		{ ko: '탁기탄', en: 'Takgitan', x: 278, y: 156, r: 7 },
		{ ko: '탁순', en: 'Takseun', x: 236, y: 196, r: 8 }
	].map((s, i) => ({ ...s, i }));
</script>

<script lang="ts">
	/**
	 * Gaya iron confederacy: six great courts, each its own purple, with a
	 * scatter of smaller states round them. Step accepted for the registry
	 * contract; default `'league'`.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';

	let { step = 'league', active = false, flat = false }: DiagramProps = $props();
</script>

<KitStage id="gaya-league" {step} {active} {flat}>
	{#snippet fallback()}
<svg
	viewBox="0 0 360 280"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of the Gaya confederacy: six great Gayas in shades of purple, ringed by smaller states, with no single throne"
>
	<!-- spokes: the league, not a throne -->
	{#each COURTS as c (c.i)}
		<line
			class="spoke"
			style="--d: {140 + c.i * 70}; --shade: {c.shade}"
			x1={CX}
			y1={CY}
			x2={c.x}
			y2={c.y}
			pathLength="100"
		/>
	{/each}

	<g class="center" style="--d: 0">
		<circle class="hub" cx={CX} cy={CY} r="15" />
		<text class="hub-label" x={CX} y={CY + 3}>가야</text>
	</g>

	{#each STATES as s (s.i)}
		<g class="node state" style="--d: {1100 + s.i * 50}">
			<circle cx={s.x} cy={s.y} r={s.r} />
			<text class="state-label" x={s.x} y={s.y + s.r + 7}>{s.ko}</text>
		</g>
	{/each}

	{#each COURTS as c (c.i)}
		<g class="node court" style="--d: {500 + c.i * 100}; --shade: {c.shade}">
			<circle cx={c.x} cy={c.y} r="22" />
			<ChartLabel x={c.x} y={c.y + 2} ko={c.ko} en={c.en} w={50} size="sm" />
		</g>
	{/each}

	<text class="foot" style="--d: 1800" x="180" y="268">여섯 가야와 작은 나라들 · no single crown</text>
</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--accent: #8f5fcf;
		--gaya: #8f5fcf;
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

	.hub {
		fill: none;
		stroke: var(--gaya);
		stroke-width: var(--stroke-w);
		stroke-dasharray: 3 3;
	}

	.hub-label {
		font-size: 8px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--gaya);
	}

	.court circle {
		fill: var(--shade);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.state circle {
		fill: color-mix(in srgb, var(--gaya) 35%, transparent);
		stroke: var(--gaya);
		stroke-width: 1;
	}

	.state-label {
		font-size: 6px;
		text-anchor: middle;
		fill: var(--gaya);
	}

	.spoke {
		fill: none;
		stroke: var(--shade);
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
		text-anchor: middle;
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
