<script lang="ts">
	/**
	 * Tang central government as Chunchu sees it: emperor at the apex,
	 * Zhengshitang where chief ministers meet, Three Departments that draft /
	 * review / execute, Six Ministries under the Shangshu, Censorate aside.
	 * Steps:
	 *   - 'machine' — full seating (default)
	 *   - 'flow'    — draft → review → execute lights in order
	 */
	import type { DiagramProps } from './registry';

	let { step = 'machine', active = false }: DiagramProps = $props();

	const DEPTS = [
		{ ko: '중서성', en: 'Zhongshu', role: 'drafts', han: '中書省', x: 70 },
		{ ko: '문하성', en: 'Menxia', role: 'reviews', han: '門下省', x: 180 },
		{ ko: '상서성', en: 'Shangshu', role: 'executes', han: '尚書省', x: 290 }
	] as const;

	const MINISTRIES = [
		{ ko: '이', en: 'Personnel', full: '吏' },
		{ ko: '호', en: 'Revenue', full: '戶' },
		{ ko: '예', en: 'Rites', full: '禮' },
		{ ko: '병', en: 'War', full: '兵' },
		{ ko: '형', en: 'Justice', full: '刑' },
		{ ko: '공', en: 'Works', full: '工' }
	] as const;

	const MIN_W = 42;
	const MIN_GAP = 6;
	const MIN_TOTAL = MINISTRIES.length * MIN_W + (MINISTRIES.length - 1) * MIN_GAP;
	const MIN_X0 = 180 - MIN_TOTAL / 2;
</script>

<svg
	viewBox="0 0 360 360"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Tang Three Departments and Six Ministries under the emperor, with the Hall of State Affairs and Censorate"
>
	<!-- emperor -->
	<g class="node emperor" style="--d: 0">
		<rect class="dais" x="118" y="10" width="124" height="52" rx="8" />
		<circle cx="180" cy="32" r="18" />
		<polygon points="171,24 174.5,16 178,20 180,14 182,20 185.5,16 189,24" />
		<text class="t-ko" x="180" y="40">황제</text>
		<text class="t-en" x="180" y="54">Emperor · 皇帝</text>
	</g>

	<!-- spine: emperor → zhengshitang -->
	<path class="spine" style="--d: 200" d="M 180 62 V 78" pathLength="100" />

	<!-- Zhengshitang — joint council of chief ministers -->
	<g class="node hall" style="--d: 280">
		<rect x="96" y="78" width="168" height="40" rx="6" />
		<text class="h-ko" x="180" y="94">정사당</text>
		<text class="h-en" x="180" y="108">政事堂 · Hall of State Affairs</text>
	</g>

	<path class="spine" style="--d: 480" d="M 180 118 V 132" pathLength="100" />

	<!-- Three Departments -->
	{#each DEPTS as d, i (d.en)}
		<g class="node dept" class:flow-a={step === 'flow' && i === 0} class:flow-b={step === 'flow' && i === 1} class:flow-c={step === 'flow' && i === 2} style="--d: {600 + i * 160}">
			<rect x={d.x - 48} y="132" width="96" height="54" rx="6" />
			<text class="d-ko" x={d.x} y="150">{d.ko}</text>
			<text class="d-han" x={d.x} y="162">{d.han}</text>
			<text class="d-en" x={d.x} y="176">{d.en} · {d.role}</text>
		</g>
	{/each}

	<!-- flow arrows between departments -->
	<g class="flow-arrows" style="--d: 1100">
		<path class="arrow a1" d="M 118 159 H 132" pathLength="100" />
		<path class="arrow a2" d="M 228 159 H 242" pathLength="100" />
	</g>

	<!-- Shangshu down to six ministries -->
	<path class="spine to-bu" style="--d: 1280" d="M 290 186 V 224" pathLength="100" />
	<path
		class="spine to-bu-bar"
		style="--d: 1360"
		d="M {MIN_X0 + MIN_W / 2} 224 H {MIN_X0 + MIN_TOTAL - MIN_W / 2}"
		pathLength="100"
	/>

	<g class="bu-label" style="--d: 1400">
		<text class="bu-ko" x="180" y="200">상서육부</text>
		<text class="bu-en" x="180" y="210">尚書六部 · Six Ministries</text>
	</g>

	{#each MINISTRIES as m, i (m.en)}
		{@const x = MIN_X0 + i * (MIN_W + MIN_GAP) + MIN_W / 2}
		<g class="node ministry" style="--d: {1500 + i * 90}">
			<rect x={x - MIN_W / 2} y="234" width={MIN_W} height="44" rx="4" />
			<text class="m-ko" x={x} y="252">{m.ko}</text>
			<text class="m-en" x={x} y="266">{m.en}</text>
		</g>
	{/each}

	<!-- Censorate — watches from the side -->
	<g class="node censor" style="--d: 2100">
		<rect x="12" y="300" width="72" height="42" rx="6" />
		<text class="c-ko" x="48" y="316">어사대</text>
		<text class="c-en" x="48" y="328">御史臺 · Censorate</text>
	</g>

	<text class="foot" style="--d: 2300" x="210" y="318">draft · review · execute — one machine</text>
	<text class="foot-ko" style="--d: 2400" x="210" y="332">기안 · 심사 · 집행 — 하나의 기계</text>
</svg>

<style>
	.dg {
		--tang: #c97a2e;
		--tang-hot: #e8a04a;
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

	.emperor .dais {
		fill: color-mix(in srgb, var(--tang) 20%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 55%, transparent);
		stroke-width: 1;
	}

	.emperor circle {
		fill: color-mix(in srgb, var(--tang) 30%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 85%, transparent);
		stroke-width: 1.4;
	}

	.emperor polygon {
		fill: var(--tang-hot);
	}

	.t-ko,
	.h-ko,
	.d-ko,
	.m-ko,
	.c-ko,
	.bu-ko {
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--tang) 40%, #3a2208);
	}

	.t-ko {
		font-size: 11px;
	}

	.t-en,
	.h-en,
	.d-en,
	.d-han,
	.m-en,
	.c-en,
	.bu-en,
	.foot,
	.foot-ko {
		text-anchor: middle;
		fill: var(--fg-faint);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.t-en {
		font-size: 6px;
	}

	.hall rect {
		fill: color-mix(in srgb, var(--tang) 22%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 65%, transparent);
		stroke-width: 1.1;
	}

	.h-ko {
		font-size: 12px;
	}

	.h-en {
		font-size: 6px;
	}

	.dept rect {
		fill: color-mix(in srgb, var(--tang) 26%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 70%, transparent);
		stroke-width: 1.1;
	}

	.play[data-step='flow'] .dept.flow-a rect {
		stroke: var(--tang-hot);
		stroke-width: 1.6;
		transition: stroke 500ms var(--ease) 1600ms, stroke-width 500ms var(--ease) 1600ms;
	}

	.play[data-step='flow'] .dept.flow-b rect {
		stroke: var(--tang-hot);
		stroke-width: 1.6;
		transition: stroke 500ms var(--ease) 2100ms, stroke-width 500ms var(--ease) 2100ms;
	}

	.play[data-step='flow'] .dept.flow-c rect {
		stroke: var(--tang-hot);
		stroke-width: 1.6;
		transition: stroke 500ms var(--ease) 2600ms, stroke-width 500ms var(--ease) 2600ms;
	}

	.d-ko {
		font-size: 11px;
	}

	.d-han {
		font-size: 7px;
		letter-spacing: 0.04em;
		text-transform: none;
	}

	.d-en {
		font-size: 5.5px;
	}

	.ministry rect {
		fill: color-mix(in srgb, var(--tang) 18%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 58%, transparent);
		stroke-width: 1;
	}

	.m-ko {
		font-size: 12px;
	}

	.m-en {
		font-size: 5px;
	}

	.censor rect {
		fill: color-mix(in srgb, var(--tang) 14%, var(--parchment));
		stroke: color-mix(in srgb, var(--tang) 45%, transparent);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}

	.c-ko {
		font-size: 10px;
	}

	.c-en {
		font-size: 6px;
		text-transform: none;
	}

	.bu-label {
		opacity: 0;
		transition: opacity 600ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .bu-label {
		opacity: 1;
	}

	.bu-ko {
		font-size: 8px;
	}

	.bu-en {
		font-size: 5.5px;
	}

	.spine,
	.arrow {
		fill: none;
		stroke: color-mix(in srgb, var(--tang) 55%, transparent);
		stroke-width: 1.1;
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
		stroke-width: 1.4;
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
		fill: color-mix(in srgb, var(--tang) 45%, var(--fg-faint));
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
