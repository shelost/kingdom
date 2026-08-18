<script lang="ts">
	/**
	 * Tang central government as Chunchu sees it: emperor at the apex,
	 * Three Departments (legislative / examination / executive), Six Ministries
	 * under the Shangshu.
	 * Steps:
	 *   - 'machine' — full seating (default)
	 *   - 'flow'    — legislative → examination → executive lights in order
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'machine', active = false }: DiagramProps = $props();

	const DEPTS = [
		{ ko: '중서성', en: 'Legislative', han: '中書省', x: 70 },
		{ ko: '문하성', en: 'Examination', han: '門下省', x: 180 },
		{ ko: '상서성', en: 'Executive', han: '尚書省', x: 290 }
	] as const;

	const MINISTRIES = [
		{ ko: '이', en: 'Personnel', han: '吏' },
		{ ko: '호', en: 'Revenue', han: '戶' },
		{ ko: '예', en: 'Rites', han: '禮' },
		{ ko: '병', en: 'War', han: '兵' },
		{ ko: '형', en: 'Justice', han: '刑' },
		{ ko: '공', en: 'Works', han: '工' }
	] as const;

	const MIN_W = 48;
	const MIN_GAP = 6;
	const MIN_TOTAL = MINISTRIES.length * MIN_W + (MINISTRIES.length - 1) * MIN_GAP;
	const MIN_X0 = 180 - MIN_TOTAL / 2;
</script>

<svg
	viewBox="0 0 360 320"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Tang Three Departments and Six Ministries: emperor above Zhongshu legislative, Menxia examination, and Shangshu executive with six boards"
>
	<!-- emperor -->
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="118" y="8" width="124" height="50" rx="8" />
		<circle cx="180" cy="30" r="16" />
		<polygon points="171,22 174.5,14 178,18 180,12 182,18 185.5,14 189,22" />
		<ChartLabel x="180" y="42" ko="황제" han="皇帝" en="Emperor" w={88} />
	</g>

	<!-- fork: emperor directly to the three departments -->
	<path class="spine" style="--d: 180" d="M 180 58 V 70" pathLength="100" />
	<path class="spine" style="--d: 260" d="M 70 70 H 290" pathLength="100" />
	<path class="spine" style="--d: 340" d="M 70 70 V 82" pathLength="100" />
	<path class="spine" style="--d: 340" d="M 180 70 V 82" pathLength="100" />
	<path class="spine" style="--d: 340" d="M 290 70 V 82" pathLength="100" />

	<!-- Three Departments -->
	{#each DEPTS as d, i (d.en)}
		<g
			class="node dept"
			class:flow-a={step === 'flow' && i === 0}
			class:flow-b={step === 'flow' && i === 1}
			class:flow-c={step === 'flow' && i === 2}
			style="--d: {480 + i * 140}"
		>
			<rect x={d.x - 50} y="82" width="100" height="62" rx="6" />
			<ChartLabel x={d.x} y="113" ko={d.ko} han={d.han} en={d.en} w={94} />
		</g>
	{/each}

	<!-- flow arrows between departments -->
	<g class="flow-arrows" style="--d: 980">
		<path class="arrow a1" d="M 120 113 H 130" pathLength="100" />
		<path class="arrow a2" d="M 230 113 H 240" pathLength="100" />
	</g>

	<!-- Shangshu down to six ministries -->
	<path class="spine to-bu" style="--d: 1120" d="M 290 144 V 176" pathLength="100" />
	<path
		class="spine to-bu-bar"
		style="--d: 1200"
		d="M {MIN_X0 + MIN_W / 2} 176 H {MIN_X0 + MIN_TOTAL - MIN_W / 2}"
		pathLength="100"
	/>

	<g class="bu-label" style="--d: 1240">
		<text class="bu-ko" x="180" y="160">상서육부</text>
		<text class="bu-en" x="180" y="170">尚書六部 · Six Ministries</text>
	</g>

	{#each MINISTRIES as m, i (m.en)}
		{@const x = MIN_X0 + i * (MIN_W + MIN_GAP) + MIN_W / 2}
		<g class="node ministry" style="--d: {1320 + i * 80}">
			<rect x={x - MIN_W / 2} y="184" width={MIN_W} height="52" rx="4" />
			<ChartLabel x={x} y="210" ko={m.ko} han={m.han} en={m.en} w={MIN_W - 4} size="sm" />
		</g>
	{/each}

	<text class="foot" style="--d: 1900" x="180" y="258">legislative · examination · executive</text>
	<text class="foot-ko" style="--d: 2000" x="180" y="274">기안 · 심사 · 집행 — 하나의 기계</text>
</svg>

<style>
	.dg {
		--accent: #f0a03c;
		--tang: #f0a03c;
		--tang-hot: #ffb84a;
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

	.emperor .dais {
		fill: var(--tang);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.emperor circle {
		fill: var(--tang);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.emperor polygon {
		fill: var(--tang-hot);
	}

	.bu-ko {
		font-weight: 700;
		text-anchor: middle;
		fill: var(--ink);
		font-size: 8px;
	}

	.bu-en,
	.foot,
	.foot-ko {
		text-anchor: middle;
		fill: var(--ink-muted);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.dept rect {
		fill: var(--tang);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.play[data-step='flow'] .dept.flow-a rect {
		stroke: var(--tang-hot);
		stroke-width: 3.2;
		transition:
			stroke 500ms var(--ease) 1600ms,
			stroke-width 500ms var(--ease) 1600ms;
	}

	.play[data-step='flow'] .dept.flow-b rect {
		stroke: var(--tang-hot);
		stroke-width: 3.2;
		transition:
			stroke 500ms var(--ease) 2100ms,
			stroke-width 500ms var(--ease) 2100ms;
	}

	.play[data-step='flow'] .dept.flow-c rect {
		stroke: var(--tang-hot);
		stroke-width: 3.2;
		transition:
			stroke 500ms var(--ease) 2600ms,
			stroke-width 500ms var(--ease) 2600ms;
	}

	.ministry rect {
		fill: var(--tang);
		stroke: var(--node-stroke);
		stroke-width: 2.2;
	}

	.bu-label {
		opacity: 0;
		transition: opacity 600ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .bu-label {
		opacity: 1;
	}

	.bu-en {
		font-size: 5.5px;
	}

	.spine,
	.arrow {
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
	.play .arrow {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.flow-arrows {
		opacity: 0;
		transition: opacity 500ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .flow-arrows {
		opacity: 1;
	}

	.arrow {
		stroke: var(--tang-hot);
		stroke-width: 2.4;
	}

	.foot,
	.foot-ko {
		opacity: 0;
		transition: opacity 700ms var(--ease) calc(var(--d) * 1ms);
		font-size: 6.5px;
		text-transform: none;
		letter-spacing: 0.04em;
	}

	.foot-ko {
		font-size: 7px;
		fill: var(--tang);
	}

	.play .foot,
	.play .foot-ko {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .spine,
		.play .arrow {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
