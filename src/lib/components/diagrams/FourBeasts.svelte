<script lang="ts">
	/** Third Emperor’s Four Beasts — Blue Dragon is the sole survivor from the dragon roster. */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { active = false }: DiagramProps = $props();

	const BEASTS = [
		{ ko: '백호', en: 'White Tiger', han: '白虎', x: 54, fill: '#c5d0dc', stroke: '#1e293b', survivor: false },
		{ ko: '주작', en: 'Red Fowl', han: '朱雀', x: 138, fill: '#ff4444', stroke: '#7f1d1d', survivor: false },
		{ ko: '청룡', en: 'Blue Dragon', han: '青龍', x: 222, fill: '#3b82ff', stroke: '#1e3a8a', survivor: true },
		{ ko: '현무', en: 'Black', han: '玄武', x: 306, fill: '#4b5563', stroke: '#030712', survivor: false }
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
		<ChartLabel x="180" y="34" ko="제3황제" en="Third Emperor" w={128} size="lg" />
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
			<ChartLabel x={b.x} y="134" ko={b.ko} en={b.en} w={66} />
		</g>
	{/each}

	<text class="note" style="--d: 920" x="222" y="182">also Four Dragons</text>
	<text class="foot" style="--d: 980" x="180" y="288">사신 · Four Beasts · Blue Dragon alone served both emperors</text>
</svg>

<style>
	.dg {
		--accent: #f0a03c;
		--tang: #f0a03c;
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
		fill: var(--tang);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.beast rect {
		fill: var(--fill);
		stroke: var(--stroke);
		stroke-width: var(--stroke-w);
	}

	.beast.survivor rect {
		stroke: #1e3a8a;
		stroke-width: 3.2;
		filter: drop-shadow(0 0 4px color-mix(in srgb, #3b82ff 70%, transparent));
	}

	.note {
		font-size: 6px;
		font-style: italic;
		text-anchor: middle;
		fill: #7eb6ff;
	}

	.spine,
	.link {
		fill: none;
		stroke: var(--tang);
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
		text-anchor: middle;
		fill: var(--tang);
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
