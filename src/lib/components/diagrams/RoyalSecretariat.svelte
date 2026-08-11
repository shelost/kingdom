<script lang="ts">
	/**
	 * Royal Secretariat (집사부): fourteen Silla ministries modeled after Tang’s
	 * 三省六部 but exceeded. One 시중; 집사부·병부·창부·예부 + ten 府.
	 */
	import type { DiagramProps } from './registry';

	let { active = false }: DiagramProps = $props();

	const MINISTRIES = [
		{ ko: '집사부', en: 'Secretariat', han: '執事' },
		{ ko: '병부', en: 'War', han: '兵' },
		{ ko: '창부', en: 'Granary', han: '倉' },
		{ ko: '예부', en: 'Rites', han: '禮' },
		{ ko: '좌사부', en: 'Left Sec.', han: '左' },
		{ ko: '우사부', en: 'Right Sec.', han: '右' },
		{ ko: '형부', en: 'Justice', han: '刑' },
		{ ko: '공부', en: 'Works', han: '工' },
		{ ko: '시부', en: 'Markets', han: '市' },
		{ ko: '화부', en: 'Treasury', han: '貨' },
		{ ko: '공주부', en: 'Granary II', han: '倉' },
		{ ko: '내관부', en: 'Inner', han: '內' },
		{ ko: '외관부', en: 'Outer', han: '外' },
		{ ko: '태학부', en: 'Academy', han: '學' }
	] as const;

	const COLS = 7;
	const BOX_W = 44;
	const BOX_H = 28;
	const GAP = 6;
	const GRID_W = COLS * BOX_W + (COLS - 1) * GAP;
	const X0 = 180 - GRID_W / 2;
</script>

<svg
	viewBox="0 0 360 340"
	class="dg"
	class:play={active}
	role="img"
	aria-label="Royal Secretariat with fourteen Silla ministries under the Royal Secretary — Never Enough"
>
	<g class="node king" style="--d: 0">
		<circle cx="180" cy="28" r="22" />
		<text class="k-ko" x="180" y="26">왕</text>
		<text class="k-en" x="180" y="38">King</text>
	</g>

	<path class="spine" style="--d: 120" d="M 180 50 V 62" pathLength="100" />

	<g class="node sec" style="--d: 200">
		<rect x="118" y="62" width="124" height="36" rx="6" />
		<text class="s-ko" x="180" y="78">시중</text>
		<text class="s-en" x="180" y="90">Royal Secretary</text>
	</g>

	<path class="spine" style="--d: 320" d="M 180 98 V 112" pathLength="100" />

	<text class="slogan" style="--d: 380" x="180" y="124">Never Enough · 결코 충분하지 않다</text>

	{#each MINISTRIES as m, i (m.ko)}
		{@const col = i % COLS}
		{@const row = Math.floor(i / COLS)}
		{@const x = X0 + col * (BOX_W + GAP) + BOX_W / 2}
		{@const y = 138 + row * (BOX_H + GAP)}
		<g class="node min" style="--d: {440 + i * 45}">
			<rect x={x - BOX_W / 2} y={y} width={BOX_W} height={BOX_H} rx="4" />
			<text class="m-ko" x={x} y={y + 12}>{m.ko}</text>
			<text class="m-en" x={x} y={y + 22}>{m.en}</text>
		</g>
	{/each}

	<text class="foot" style="--d: 1200" x="180" y="328">14 ministries · Tang’s six was never enough</text>
</svg>

<style>
	.dg {
		--silla: #3e79e4;
		--gold: #d8b26a;
		--parchment: #fff8e8;
		font-family: var(--serif);
	}

	.node,
	.foot,
	.slogan {
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 550ms var(--ease) calc(var(--d) * 1ms),
			transform 600ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .node,
	.play .foot,
	.play .slogan {
		opacity: 1;
		transform: translateY(0);
	}

	.king circle {
		fill: color-mix(in srgb, var(--gold) 34%, var(--parchment));
		stroke: var(--gold);
		stroke-width: 1.4;
	}

	.sec rect {
		fill: color-mix(in srgb, var(--gold) 38%, var(--parchment));
		stroke: var(--gold);
		stroke-width: 1.5;
	}

	.min rect {
		fill: color-mix(in srgb, var(--silla) 28%, var(--parchment));
		stroke: color-mix(in srgb, var(--silla) 70%, var(--gold));
		stroke-width: 1.05;
	}

	.k-ko,
	.s-ko,
	.m-ko {
		font-size: 8px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--silla) 35%, #1a2a4a);
	}

	.k-ko {
		font-size: 11px;
	}

	.s-ko {
		font-size: 11px;
	}

	.k-en,
	.s-en,
	.m-en {
		font-size: 5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--silla) 45%, var(--fg-faint));
	}

	.slogan {
		font-size: 7px;
		font-style: italic;
		text-anchor: middle;
		fill: var(--gold);
		letter-spacing: 0.04em;
	}

	.spine {
		fill: none;
		stroke: color-mix(in srgb, var(--gold) 55%, var(--silla));
		stroke-width: 1.1;
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

	.foot {
		font-size: 6.5px;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--silla) 50%, var(--fg-faint));
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
		}

		.play .spine {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
