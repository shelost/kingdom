<script lang="ts">
	/** Baekje Restoration Army — king at apex, four general seats beneath. */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { active = false }: DiagramProps = $props();

	const GENERALS = [
		{ x: 54 },
		{ x: 138 },
		{ x: 222 },
		{ x: 306 }
	] as const;
</script>

<svg
	viewBox="0 0 360 260"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Baekje Restoration Army: King with four generals beneath"
>
	<g class="node king" style="--d: 0">
		<circle cx="180" cy="42" r="28" />
		<ChartLabel x="180" y="44" ko="왕" en="King" w={48} size="lg" />
	</g>

	<path class="spine" style="--d: 220" d="M 180 70 V 88" pathLength="100" />

	{#each GENERALS as g, i (g.x)}
		<g class="node gen" style="--d: {400 + i * 110}">
			<path class="link" style="--d: {360 + i * 110}" d="M 180 88 C 180 100 {g.x} 100 {g.x} 118" pathLength="100" />
			<rect x={g.x - 32} y="118" width="64" height="44" rx="5" />
			<ChartLabel x={g.x} y="140" ko="장군" en="General" w={58} />
		</g>
	{/each}

	<text class="foot" style="--d: 900" x="180" y="248">백제부흥군 · Restoration Army</text>
</svg>

<style>
	.dg {
		--accent: #ffd24a;
		--baekje: #ffd24a;
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

	.king circle {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.gen rect {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.spine,
	.link {
		fill: none;
		stroke: var(--baekje);
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
		fill: var(--baekje);
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
