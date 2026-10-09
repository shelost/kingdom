<script lang="ts">
	/**
	 * Goguryeo High Summit (제가會議): king at the apex, High Commander
	 * beneath, five regional Commanders below. Steps:
	 *   - 'council'  — classic consultation; king holds the final vote (default)
	 *   - 'supreme'  — after 642: Supreme Commander replaces High Commander;
	 *                  Chancellor appears; king dims to a puppet note
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'council', active = false }: DiagramProps = $props();

	const supreme = $derived(step === 'supreme');

	const COMMANDERS = [
		{ ko: '동부', en: 'East', x: 52 },
		{ ko: '서부', en: 'West', x: 116 },
		{ ko: '남부', en: 'South', x: 180 },
		{ ko: '북부', en: 'North', x: 244 },
		{ ko: '중부', en: 'Central', x: 308 }
	] as const;
</script>

<svg
	viewBox="0 0 360 320"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of the Goguryeo High Summit: the king above a High Commander and five regional Commanders"
>
	<!-- king -->
	<g class="node king" class:puppet={supreme} style="--d: 0">
		<rect class="dais" x="118" y="12" width="124" height="58" rx="8" />
		<circle cx="180" cy="36" r="20" />
		<polygon points="171,28 174.5,20 178,24 180,18 182,24 185.5,20 189,28" />
		<ChartLabel x="180" y="50" ko="왕" en="King" w={56} />
	</g>

	<text class="king-note" class:hollow={supreme} style="--d: 200" x="180" y="82">
		{supreme ? '꼭두각시 · puppet' : '최종 투표 · final vote'}
	</text>

	<!-- spine king → high seat -->
	<path class="spine" style="--d: 280" d="M 180 88 V 108" pathLength="100" />

	<!-- High Commander / Supreme Commander -->
	<g class="node high" style="--d: 360">
		<rect x={supreme ? 64 : 108} y="108" width={supreme ? 120 : 144} height="48" rx="6" />
		{#if supreme}
			<ChartLabel x="124" y="132" ko="대막리지" en="Supreme" w={108} />
		{:else}
			<ChartLabel x="180" y="132" ko="막리지" en="High Commander" w={128} />
		{/if}
	</g>

	{#if supreme}
		<!-- Chancellor beside Supreme Commander -->
		<g class="node chancellor" style="--d: 480">
			<rect x="200" y="108" width="96" height="48" rx="6" />
			<ChartLabel x="248" y="132" ko="대대로" en="Chancellor" w={88} />
		</g>
	{/if}

	<!-- bar down to five Commanders -->
	<path class="spine" style="--d: 620" d="M 180 156 V 188" pathLength="100" />
	<path class="spine bar" style="--d: 700" d="M 52 188 H 308" pathLength="100" />

	{#each COMMANDERS as c, i (c.en)}
		<path
			class="spine"
			style="--d: {760 + i * 40}"
			d="M {c.x} 188 V 208"
			pathLength="100"
		/>
		<g class="node commander" style="--d: {880 + i * 90}">
			<circle cx={c.x} cy="232" r="26" />
			<ChartLabel x={c.x} y="234" ko={c.ko} en={c.en} w={46} size="sm" />
		</g>
	{/each}

	<text class="foot" style="--d: 1500" x="180" y="292">제가會議 · High Summit</text>
	<text class="foot-en" style="--d: 1600" x="180" y="306">five Commanders · 오부대가</text>
</svg>

<style>
	.dg {
		--accent: #ff3d36;
		--goguryeo: #ff3d36;
		font-family: var(--serif);
	}

	.node {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 700ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node {
		opacity: 1;
		transform: translateY(0);
	}

	.play .king.puppet {
		opacity: 0.38;
		transition:
			opacity 800ms var(--ease) 1400ms,
			transform 700ms var(--ease) calc(var(--d) * 1ms);
	}

	.king .dais {
		fill: var(--goguryeo);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.king circle {
		fill: var(--goguryeo);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.king polygon {
		fill: var(--goguryeo);
	}

	.foot,
	.foot-en,
	.king-note {
		text-anchor: middle;
		fill: var(--ink-muted);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.king-note {
		font-size: 7px;
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
		fill: var(--goguryeo);
	}

	.play .king-note {
		opacity: 1;
	}

	.play .king-note.hollow {
		fill: var(--ink-muted);
		letter-spacing: 0.14em;
	}

	.high rect,
	.chancellor rect {
		fill: var(--goguryeo);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.play[data-step='supreme'] .high rect {
		stroke: var(--node-stroke);
		stroke-width: 3.2;
		fill: var(--goguryeo);
	}

	.chancellor rect {
		stroke-dasharray: 4 4;
		stroke: var(--node-stroke);
		fill: var(--goguryeo);
	}

	.commander circle {
		fill: var(--goguryeo);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.spine {
		fill: none;
		stroke: var(--goguryeo);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 900ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .spine {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot,
	.foot-en {
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
		font-size: 7px;
	}

	.foot {
		fill: var(--goguryeo);
		text-transform: none;
		letter-spacing: 0.06em;
	}

	.foot-en {
		font-size: 6px;
	}

	.play .foot,
	.play .foot-en {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .spine {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
