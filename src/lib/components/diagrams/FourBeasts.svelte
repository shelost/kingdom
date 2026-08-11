<script lang="ts">
	/** Third Emperor’s Four Beasts — Blue Dragon is the sole survivor from the dragon roster. */
	import type { DiagramProps } from './registry';

	let { active = false }: DiagramProps = $props();

	const BEASTS = [
		{ ko: '백호', en: 'White Tiger', han: '白虎', x: 54, fill: '#f1f5f9', stroke: '#94a3b8', survivor: false },
		{ ko: '주작', en: 'Red Fowl', han: '朱雀', x: 138, fill: '#fecaca', stroke: '#dc2626', survivor: false },
		{ ko: '청룡', en: 'Blue Dragon', han: '青龍', x: 222, fill: '#bfdbfe', stroke: '#2563eb', survivor: true },
		{ ko: '현무', en: 'Black Tortoise', han: '玄武', x: 306, fill: '#374151', stroke: '#6b7280', survivor: false }
	] as const;
</script>

<svg
	viewBox="0 0 360 300"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Four Beasts under the Third Emperor; Blue Dragon is the only general shared with the Four Dragons"
>
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="108" y="8" width="144" height="52" rx="8" />
		<text class="t-ko" x="180" y="32">제3황제</text>
		<text class="t-en" x="180" y="46">Third Emperor</text>
	</g>

	<path class="spine" style="--d: 200" d="M 180 60 V 78" pathLength="100" />

	{#each BEASTS as b, i (b.en)}
		<g
			class="node beast"
			class:survivor={b.survivor}
			style="--d: {380 + i * 120}; --fill: {b.fill}; --stroke: {b.stroke}"
		>
			<path class="link" style="--d: {340 + i * 120}" d="M 180 78 C 180 92 {b.x} 92 {b.x} 108" pathLength="100" />
			<rect x={b.x - 36} y="108" width="72" height="52" rx="6" />
			<text class="d-ko" x={b.x} y="128">{b.ko}</text>
			<text class="d-han" x={b.x} y="142">{b.han}</text>
			<text class="d-en" x={b.x} y="154">{b.en}</text>
		</g>
	{/each}

	<text class="note" style="--d: 920" x="222" y="182">also Four Dragons</text>
	<text class="foot" style="--d: 980" x="180" y="288">사신 · Four Beasts · Blue Dragon alone served both emperors</text>
</svg>

<style>
	.dg {
		--tang: #b45309;
		font-family: var(--serif);
	}

	.node,
	.foot,
	.note {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot,
	.play .note {
		opacity: 1;
		transform: translateY(0);
	}

	.emperor .dais {
		fill: color-mix(in srgb, var(--tang) 18%, #1a0f05);
		stroke: var(--gold);
		stroke-width: 1.4;
	}

	.t-ko {
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--gold);
	}

	.t-en {
		font-size: 6px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--gold) 55%, var(--fg-faint));
	}

	.beast rect {
		fill: color-mix(in srgb, var(--fill) 35%, #0a0a12);
		stroke: var(--stroke);
		stroke-width: 1.4;
	}

	.beast.survivor rect {
		stroke: #2563eb;
		stroke-width: 2;
		filter: drop-shadow(0 0 4px color-mix(in srgb, #2563eb 50%, transparent));
	}

	.d-ko {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--stroke) 70%, #fffdf8);
	}

	.d-han {
		font-size: 8px;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--stroke) 55%, var(--fg-faint));
	}

	.d-en {
		font-size: 5.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.note {
		font-size: 6px;
		font-style: italic;
		text-anchor: middle;
		fill: #2563eb;
	}

	.spine,
	.link {
		fill: none;
		stroke: color-mix(in srgb, var(--tang) 60%, var(--gold));
		stroke-width: 1.1;
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
		text-anchor: middle;
		fill: color-mix(in srgb, var(--tang) 55%, var(--fg-faint));
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
