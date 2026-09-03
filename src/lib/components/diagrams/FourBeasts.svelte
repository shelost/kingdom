<script lang="ts">
	/** Third Emperor’s Four Beasts — Blue Dragon overlaps the dragons; Xue replaces the fallen White Tiger. */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { active = false }: DiagramProps = $props();

	const BEASTS = [
		{
			ko: '백호',
			en: 'White Tiger',
			han: '白虎',
			who: '방효태',
			whoEn: 'Pang Xiaotai',
			x: 54,
			fill: '#c5d0dc',
			stroke: '#1e293b',
			fallen: true,
			survivor: false
		},
		{
			ko: '주작',
			en: 'Red Fowl',
			han: '朱雀',
			who: '소정방',
			whoEn: 'Su Dingfang',
			x: 138,
			fill: '#ff4444',
			stroke: '#7f1d1d',
			fallen: false,
			survivor: false
		},
		{
			ko: '청룡',
			en: 'Blue Dragon',
			han: '青龍',
			who: '이세적',
			whoEn: 'Li Shiji',
			x: 222,
			fill: '#3b82ff',
			stroke: '#1e3a8a',
			fallen: false,
			survivor: true
		},
		{
			ko: '현무',
			en: 'Black Tortoise',
			han: '玄武',
			who: '유인궤',
			whoEn: 'Liu Rengui',
			x: 306,
			fill: '#4b5563',
			stroke: '#030712',
			fallen: false,
			survivor: false
		}
	] as const;
</script>

<svg
	viewBox="0 0 360 340"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Four Beasts under the Third Emperor: White Tiger Pang Xiaotai fallen at Snake River, succeeded by Xue Rengui; Red Fowl Su Dingfang; Blue Dragon Li Shiji also of the Four Dragons; Black Tortoise Liu Rengui"
>
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="108" y="8" width="144" height="52" rx="8" />
		<ChartLabel x="180" y="34" ko="제3황제" en="Third Emperor" w={128} size="lg" />
	</g>

	<path class="spine" style="--d: 200" d="M 180 60 V 78" pathLength="100" />

	{#each BEASTS as b, i (b.en)}
		<g
			class={['node', 'beast', b.fallen && 'fallen', b.survivor && 'survivor']}
			style="--d: {380 + i * 120}; --fill: {b.fill}; --stroke: {b.stroke}"
		>
			<path class="link" style="--d: {340 + i * 120}" d="M 180 78 C 180 92 {b.x} 92 {b.x} 108" pathLength="100" />
			<rect x={b.x - 36} y="108" width="72" height="52" rx="6" />
			<ChartLabel x={b.x} y="134" ko={b.ko} en={b.en} w={66} />
			{#if b.fallen}
				<line class="slash" x1={b.x - 30} y1="116" x2={b.x + 30} y2="152" />
			{/if}
			<text class="who" class:struck={b.fallen} x={b.x} y="176">{b.who}</text>
			<text class="whoen" class:struck={b.fallen} x={b.x} y="188">{b.whoEn}</text>
		</g>
	{/each}

	<g class="node heir" style="--d: 920">
		<path class="heir-link" d="M 54 190 V 208" pathLength="100" />
		<rect class="heir-box" x="18" y="208" width="72" height="36" rx="5" />
		<text class="heir-ko" x="54" y="220">백호 2세</text>
		<text class="heir-en" x="54" y="232">Xue Rengui</text>
	</g>

	<text class="note" style="--d: 980" x="222" y="204">also Four Dragons</text>
	<text class="note succ" style="--d: 1000" x="54" y="256">after Snake River</text>
	<text class="foot" style="--d: 1080" x="180" y="318">사신 · Four Beasts · 661 · White Tiger fallen 662 · Xue succeeds</text>
	<text class="foot sub" style="--d: 1120" x="180" y="330">Blue Dragon Li Shiji is the only man on both rosters from the start</text>
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

	.beast.fallen rect {
		opacity: 0.45;
	}

	.slash {
		stroke: #7f1d1d;
		stroke-width: 1.6;
		opacity: 0.85;
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

	.struck {
		text-decoration: line-through;
		opacity: 0.55;
	}

	.heir-box {
		fill: #e8e3d5;
		stroke: #1e293b;
		stroke-width: var(--stroke-w);
	}

	.heir-ko {
		font-size: 7px;
		font-weight: 700;
		text-anchor: middle;
		fill: #1e293b;
	}

	.heir-en {
		font-size: 5.5px;
		text-anchor: middle;
		fill: #1e293b;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.heir-link {
		fill: none;
		stroke: var(--tang);
		stroke-width: var(--link-w);
		stroke-dasharray: 3 2;
	}

	.note {
		font-size: 6px;
		font-style: italic;
		text-anchor: middle;
		fill: #7eb6ff;
	}

	.note.succ {
		fill: var(--tang);
		font-size: 5.5px;
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
