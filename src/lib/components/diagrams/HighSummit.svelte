<script lang="ts">
	/**
	 * Goguryeo High Summit (제가會議): king at the apex, High Commander
	 * beneath, five regional Commanders below. Steps:
	 *   - 'council'  — classic consultation; king holds the final vote (default)
	 *   - 'supreme'  — after 642: Supreme Commander replaces High Commander;
	 *                  Chancellor appears; king dims to a puppet note
	 */
	import type { DiagramProps } from './registry';

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
		<text class="t-ko" x="180" y="44">왕</text>
		<text class="t-en" x="180" y="60">King</text>
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
			<text class="h-ko" x="124" y="126">대막리지</text>
			<text class="h-en" x="124" y="142">Supreme Commander</text>
		{:else}
			<text class="h-ko" x="180" y="126">막리지</text>
			<text class="h-en" x="180" y="142">High Commander</text>
		{/if}
	</g>

	{#if supreme}
		<!-- Chancellor beside Supreme Commander -->
		<g class="node chancellor" style="--d: 480">
			<rect x="200" y="108" width="96" height="48" rx="6" />
			<text class="h-ko" x="248" y="126">대대로</text>
			<text class="h-en" x="248" y="142">Chancellor</text>
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
			<text class="c-ko" x={c.x} y="228">{c.ko}</text>
			<text class="c-role" x={c.x} y="240">대가</text>
			<text class="c-en" x={c.x} y="252">{c.en}</text>
		</g>
	{/each}

	<text class="foot" style="--d: 1500" x="180" y="292">제가會議 · High Summit</text>
	<text class="foot-en" style="--d: 1600" x="180" y="306">five Commanders · 오부대가</text>
</svg>

<style>
	.dg {
		--goguryeo: #d0362f;
		--parchment: #fff8e8;
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
		fill: color-mix(in srgb, var(--goguryeo) 20%, var(--parchment));
		stroke: color-mix(in srgb, var(--goguryeo) 55%, transparent);
		stroke-width: 1;
	}

	.king circle {
		fill: color-mix(in srgb, var(--goguryeo) 32%, var(--parchment));
		stroke: color-mix(in srgb, var(--goguryeo) 85%, transparent);
		stroke-width: 1.4;
	}

	.king polygon {
		fill: var(--goguryeo);
	}

	.t-ko,
	.h-ko,
	.c-ko,
	.c-role {
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--goguryeo) 40%, #3a1010);
	}

	.t-ko {
		font-size: 12px;
	}

	.t-en,
	.h-en,
	.c-en,
	.foot,
	.foot-en,
	.king-note {
		text-anchor: middle;
		fill: var(--fg-faint);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.t-en {
		font-size: 6px;
	}

	.king-note {
		font-size: 7px;
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
		fill: color-mix(in srgb, var(--goguryeo) 55%, var(--fg-faint));
	}

	.play .king-note {
		opacity: 1;
	}

	.play .king-note.hollow {
		fill: color-mix(in srgb, var(--fg-faint) 70%, transparent);
		letter-spacing: 0.14em;
	}

	.high rect,
	.chancellor rect {
		fill: color-mix(in srgb, var(--goguryeo) 24%, var(--parchment));
		stroke: color-mix(in srgb, var(--goguryeo) 70%, transparent);
		stroke-width: 1.15;
	}

	.play[data-step='supreme'] .high rect {
		stroke: var(--goguryeo);
		stroke-width: 1.6;
		fill: color-mix(in srgb, var(--goguryeo) 38%, var(--parchment));
	}

	.chancellor rect {
		stroke-dasharray: 3 3;
		stroke: color-mix(in srgb, var(--goguryeo) 55%, transparent);
		fill: color-mix(in srgb, var(--goguryeo) 16%, var(--parchment));
	}

	.h-ko {
		font-size: 12px;
	}

	.h-en {
		font-size: 5.5px;
	}

	.commander circle {
		fill: color-mix(in srgb, var(--goguryeo) 26%, var(--parchment));
		stroke: color-mix(in srgb, var(--goguryeo) 70%, transparent);
		stroke-width: 1.1;
	}

	.c-ko {
		font-size: 10px;
	}

	.c-role {
		font-size: 7px;
		fill: color-mix(in srgb, var(--goguryeo) 55%, var(--fg-faint));
	}

	.c-en {
		font-size: 5.5px;
	}

	.spine {
		fill: none;
		stroke: color-mix(in srgb, var(--goguryeo) 58%, transparent);
		stroke-width: 1.05;
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
		fill: color-mix(in srgb, var(--goguryeo) 50%, var(--fg-faint));
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
