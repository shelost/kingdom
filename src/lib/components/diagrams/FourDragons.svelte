<script lang="ts">
	/** Second Emperor’s Four Dragons — Taizong roster; Blue Dragon alone continues as a Beast. */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { active = false }: DiagramProps = $props();

	const DRAGONS = [
		{ ko: '백룡', en: 'White', han: '白龍', who: '설인귀', whoEn: 'Xue Rengui', x: 54, fill: '#c5d0dc', stroke: '#1e293b', overlap: false },
		{ ko: '적룡', en: 'Red', han: '赤龍', who: '이정', whoEn: 'Li Jing', x: 138, fill: '#ff4444', stroke: '#7f1d1d', overlap: false },
		{ ko: '청룡', en: 'Blue', han: '青龍', who: '이세적', whoEn: 'Li Shiji', x: 222, fill: '#3b82ff', stroke: '#1e3a8a', overlap: true },
		{ ko: '흑룡', en: 'Black', han: '黑龍', who: '울지공', whoEn: 'Yuchi Gong', x: 306, fill: '#4b5563', stroke: '#030712', overlap: false }
	] as const;
</script>

<svg
	viewBox="0 0 360 300"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Four Dragons under the Second Emperor: White Xue Rengui, Red Li Jing, Blue Li Shiji, Black Yuchi Gong. Only Li Shiji continues as a Beast."
>
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="108" y="8" width="144" height="52" rx="8" />
		<ChartLabel x="180" y="34" ko="서토 황제" en="Second Emperor" w={128} size="lg" />
	</g>

	<path class="spine" style="--d: 200" d="M 180 60 V 78" pathLength="100" />

	{#each DRAGONS as d, i (d.en)}
		<g
			class={['node', 'dragon', d.overlap && 'overlap']}
			style="--d: {380 + i * 120}; --fill: {d.fill}; --stroke: {d.stroke}"
		>
			<path class="link" style="--d: {340 + i * 120}" d="M 180 78 C 180 92 {d.x} 92 {d.x} 108" pathLength="100" />
			<rect x={d.x - 36} y="108" width="72" height="52" rx="6" />
			<ChartLabel x={d.x} y="134" ko={d.ko} en={d.en} w={66} />
			<text class="who" x={d.x} y="176">{d.who}</text>
			<text class="whoen" x={d.x} y="188">{d.whoEn}</text>
		</g>
	{/each}

	<text class="note" style="--d: 920" x="222" y="204">also Four Beasts</text>
	<text class="foot" style="--d: 980" x="180" y="278">사룡 · Four Dragons · 645 · Blue Dragon Li Shiji alone survives into the beasts</text>
	<text class="foot sub" style="--d: 1020" x="180" y="290">Xue · Li Jing · Li Shiji · Yuchi — each colour a different man</text>
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

	.dragon rect {
		fill: var(--fill);
		stroke: var(--stroke);
		stroke-width: var(--stroke-w);
	}

	.dragon.overlap rect {
		stroke: #1e3a8a;
		stroke-width: 3.2;
		filter: drop-shadow(0 0 4px color-mix(in srgb, #3b82ff 70%, transparent));
	}

	.who,
	.whoen {
		font-size: 6px;
		text-anchor: middle;
		fill: var(--tang);
	}

	.whoen {
		font-size: 5px;
		letter-spacing: 0.04em;
		opacity: 0.8;
		text-transform: uppercase;
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
		font-size: 6.5px;
		text-anchor: middle;
		fill: var(--tang);
	}

	.foot.sub {
		font-size: 5.5px;
		opacity: 0.85;
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
