<script lang="ts">
	/** Second Emperor’s Four Dragons — expedition roster under Taizong. */
	import type { DiagramProps } from './registry';

	let { active = false }: DiagramProps = $props();

	const DRAGONS = [
		{ ko: '백룡', en: 'White Dragon', han: '白龍', x: 54, fill: '#f8fafc', stroke: '#cbd5e1' },
		{ ko: '적룡', en: 'Red Dragon', han: '赤龍', x: 138, fill: '#fecaca', stroke: '#ef4444' },
		{ ko: '청룡', en: 'Blue Dragon', han: '青龍', x: 222, fill: '#bfdbfe', stroke: '#2563eb' },
		{ ko: '흑룡', en: 'Black Dragon', han: '黑龍', x: 306, fill: '#374151', stroke: '#9ca3af' }
	] as const;
</script>

<svg
	viewBox="0 0 360 280"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Four Dragons under the Second Emperor: White, Red, Blue, and Black dragon generals"
>
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="108" y="8" width="144" height="52" rx="8" />
		<text class="t-ko" x="180" y="32">서토 황제</text>
		<text class="t-en" x="180" y="46">Second Emperor</text>
	</g>

	<path class="spine" style="--d: 200" d="M 180 60 V 78" pathLength="100" />

	{#each DRAGONS as d, i (d.en)}
		<g class="node dragon" style="--d: {380 + i * 120}; --fill: {d.fill}; --stroke: {d.stroke}">
			<path class="link" style="--d: {340 + i * 120}" d="M 180 78 C 180 92 {d.x} 92 {d.x} 108" pathLength="100" />
			<rect x={d.x - 36} y="108" width="72" height="52" rx="6" />
			<text class="d-ko" x={d.x} y="128">{d.ko}</text>
			<text class="d-han" x={d.x} y="142">{d.han}</text>
			<text class="d-en" x={d.x} y="154">{d.en}</text>
		</g>
	{/each}

	<text class="foot" style="--d: 900" x="180" y="268">사룡 · Four Dragons · 645 Liao roads</text>
</svg>

<style>
	.dg {
		--tang: #b45309;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot {
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

	.dragon rect {
		fill: color-mix(in srgb, var(--fill) 35%, #0a0a12);
		stroke: var(--stroke);
		stroke-width: 1.4;
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
