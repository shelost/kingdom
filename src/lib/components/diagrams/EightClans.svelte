<script lang="ts">
	/**
	 * The Eight Great Clans of Baekje (대성팔족) seated like the UK Commons:
	 * Buyeo on the Speaker’s chair at the helm; four houses on each bench,
	 * facing across a central aisle. Steps:
	 *   - 'court'   — the eight houses take their places, Satek brightest (default)
	 *   - 'rivalry' — Satek vs Yunbi across the aisle; the other six dim
	 */
	import type { DiagramProps } from './registry';

	let { step = 'court', active = false }: DiagramProps = $props();

	// Front benches nearest the throne face each other — the feud reads as
	// government vs opposition. Remaining houses fill back along each side.
	const LEFT = [
		{ ko: '사택', en: 'Satek', satek: true as const },
		{ ko: '진모', en: 'Jinmo' },
		{ ko: '해', en: 'Hae' },
		{ ko: '백', en: 'Baek' }
	];
	const RIGHT = [
		{ ko: '연비', en: 'Yunbi', yunbi: true as const },
		{ ko: '목리', en: 'Mokli' },
		{ ko: '안', en: 'Ahn' },
		{ ko: '국', en: 'Guk' }
	];

	const LEFT_X = 78;
	const RIGHT_X = 282;
	const SEAT_YS = [134, 194, 254, 314] as const;

	type Clan = {
		ko: string;
		en: string;
		satek?: true;
		yunbi?: true;
		i: number;
		x: number;
		y: number;
	};

	const nodes: Clan[] = [
		...LEFT.map((c, i) => ({ ...c, i, x: LEFT_X, y: SEAT_YS[i] })),
		...RIGHT.map((c, i) => ({ ...c, i: i + 4, x: RIGHT_X, y: SEAT_YS[i] }))
	];

	const satek = nodes[0];
	const yunbi = nodes[4];
	const inFeud = (n: Clan) => !!(n.satek || n.yunbi);
</script>

<svg
	viewBox="0 0 360 360"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Eight clan houses of Baekje seated on opposing benches before the royal Buyeo throne, like a parliament chamber"
>
	<!-- chamber floor / aisle -->
	<g class="chamber" style="--d: 80">
		<rect class="floor" x="118" y="96" width="124" height="250" rx="4" />
		<line class="aisle" x1="180" y1="104" x2="180" y2="338" />
	</g>

	<!-- opposing benches -->
	<g class="bench left-bench" style="--d: 160">
		<rect x="34" y="104" width="88" height="238" rx="6" />
	</g>
	<g class="bench right-bench" style="--d: 160">
		<rect x="238" y="104" width="88" height="238" rx="6" />
	</g>

	<!-- the throne — Speaker’s chair at the helm -->
	<g class="throne" style="--d: 0">
		<rect class="dais" x="118" y="18" width="124" height="68" rx="8" />
		<circle cx="180" cy="48" r="30" />
		<polygon points="169.5,36 173,26.5 177.5,31 180,24 182.5,31 187,26.5 190.5,36" />
		<text class="t-ko" x="180" y="58">부여</text>
		<text class="t-en" x="180" y="70">Buyeo · the throne</text>
	</g>

	<!-- the eight houses -->
	{#each nodes as n (n.i)}
		<g
			class="clan"
			class:satek={n.satek}
			class:yunbi={n.yunbi}
			class:dimmed={step === 'rivalry' && !inFeud(n)}
			style="--d: {450 + n.i * 110}"
		>
			<circle cx={n.x} cy={n.y} r={n.satek ? 26 : 22} />
			<text class="c-ko" x={n.x} y={n.y + 1.5}>{n.ko}</text>
			<text class="c-en" x={n.x} y={n.y + 13}>{n.en}</text>
		</g>
	{/each}

	<!-- Satek holds the queen and the Prime Minister -->
	<text class="satek-note" style="--d: 1650" x={satek.x} y={satek.y - 36}
		>왕비 · 재상 queen &amp; PM</text
	>

	<!-- the feud: four generations, drawn straight across the aisle -->
	{#if step === 'rivalry'}
		<g class="feud" style="--d: 1700">
			<line
				x1={satek.x + 28}
				y1={satek.y}
				x2={yunbi.x - 28}
				y2={yunbi.y}
				pathLength="100"
			/>
			<text class="feud-x" x="180" y={satek.y + 5}>✕</text>
		</g>
	{/if}
</svg>

<style>
	.dg {
		--baekje: #ffcb51;
		--nay: #cf4b4b;
		font-family: var(--serif);
	}

	/* ——— chamber ——— */
	.chamber,
	.bench {
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .chamber,
	.play .bench {
		opacity: 1;
	}

	.floor {
		fill: color-mix(in srgb, var(--baekje) 16%, #fff8e8);
		stroke: color-mix(in srgb, var(--baekje) 45%, transparent);
		stroke-width: 0.9;
	}

	.aisle {
		stroke: color-mix(in srgb, var(--baekje) 50%, transparent);
		stroke-width: 1.15;
		stroke-dasharray: 3 5;
	}

	.bench rect {
		fill: color-mix(in srgb, var(--baekje) 20%, #fff8e8);
		stroke: color-mix(in srgb, var(--baekje) 50%, transparent);
		stroke-width: 1;
	}

	/* ——— throne ——— */
	.throne {
		opacity: 0;
		transform: scale(0.6);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 650ms var(--ease),
			transform 750ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .throne {
		opacity: 1;
		transform: scale(1);
	}

	.throne .dais {
		fill: color-mix(in srgb, var(--baekje) 24%, #fff8e8);
		stroke: color-mix(in srgb, var(--baekje) 55%, transparent);
		stroke-width: 1;
	}

	.throne circle {
		fill: color-mix(in srgb, var(--baekje) 32%, #fff8e8);
		stroke: color-mix(in srgb, var(--baekje) 85%, transparent);
		stroke-width: 1.35;
	}

	.throne polygon {
		fill: var(--baekje);
	}

	.t-ko {
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--baekje) 40%, #5a3d00);
	}

	.t-en {
		font-size: 6px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	/* ——— clans ——— */
	.clan {
		opacity: 0;
		transform: scale(0.3);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 550ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .clan {
		opacity: 1;
		transform: scale(1);
	}

	.play .clan.dimmed {
		opacity: 0.32;
		transition:
			opacity 800ms var(--ease) 1900ms,
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.clan circle {
		fill: color-mix(in srgb, var(--baekje) 28%, #fff8e8);
		stroke: color-mix(in srgb, var(--baekje) 70%, transparent);
		stroke-width: 1.1;
	}

	.clan.satek circle {
		fill: color-mix(in srgb, var(--baekje) 44%, #fff8e8);
		stroke: var(--baekje);
		stroke-width: 1.6;
	}

	.play[data-step='rivalry'] .clan.yunbi circle {
		fill: color-mix(in srgb, var(--baekje) 36%, #fff8e8);
		stroke: color-mix(in srgb, var(--nay) 70%, var(--baekje));
		stroke-width: 1.6;
	}

	.c-ko {
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--baekje) 35%, #5a3d00);
	}

	.c-en {
		font-size: 6.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	/* ——— annotations ——— */
	.satek-note {
		font-size: 7px;
		letter-spacing: 0.08em;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--baekje) 60%, var(--fg-faint));
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .satek-note {
		opacity: 1;
	}

	.feud {
		opacity: 0;
		transition: opacity 500ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .feud {
		opacity: 1;
	}

	.feud line {
		fill: none;
		stroke: var(--nay);
		stroke-width: 1.3;
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 1100ms var(--ease);
		transition-delay: calc(var(--d) * 1ms + 200ms);
	}

	.play .feud line {
		stroke-dashoffset: 0;
	}

	.feud-x {
		font-size: 13px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--nay);
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
