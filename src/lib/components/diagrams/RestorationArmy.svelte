<script lang="ts">
	/** Baekje Restoration Army — king at apex, four general seats beneath. */
	import type { DiagramProps } from './registry';

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
		<text class="k-ko" x="180" y="40">왕</text>
		<text class="k-en" x="180" y="54">King</text>
	</g>

	<path class="spine" style="--d: 220" d="M 180 70 V 88" pathLength="100" />

	{#each GENERALS as g, i (g.x)}
		<g class="node gen" style="--d: {400 + i * 110}">
			<path class="link" style="--d: {360 + i * 110}" d="M 180 88 C 180 100 {g.x} 100 {g.x} 118" pathLength="100" />
			<rect x={g.x - 32} y="118" width="64" height="44" rx="5" />
			<text class="g-ko" x={g.x} y="136">장군</text>
			<text class="g-en" x={g.x} y="150">General</text>
		</g>
	{/each}

	<text class="foot" style="--d: 900" x="180" y="248">백제부흥군 · Restoration Army</text>
</svg>

<style>
	.dg {
		--baekje: #ffcb51;
		--parchment: #fff8e8;
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
		fill: color-mix(in srgb, var(--baekje) 42%, var(--parchment));
		stroke: var(--baekje);
		stroke-width: 1.6;
	}

	.k-ko,
	.g-ko {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--baekje) 28%, #4a3200);
	}

	.k-en,
	.g-en {
		font-size: 5.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.gen rect {
		fill: color-mix(in srgb, var(--baekje) 28%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 75%, transparent);
		stroke-width: 1.2;
	}

	.spine,
	.link {
		fill: none;
		stroke: color-mix(in srgb, var(--baekje) 65%, var(--gold));
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
		fill: color-mix(in srgb, var(--baekje) 50%, var(--fg-faint));
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
