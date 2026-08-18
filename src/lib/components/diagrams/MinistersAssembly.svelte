<script lang="ts">
	/**
	 * Baekje Ministers’ Assembly on Deer Rock — Commons layout:
	 * King at the helm, Premier (상좌평) on the aisle, eight Senior Ministers
	 * (좌평) four-and-four on the inner benches, eight Junior Ministers (달솔)
	 * four-and-four on the outer benches. Rank titles only — no personal names.
	 * Steps: 'court' (default) | 'purged' | 'clans'
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';

	let { step = 'court', active = false }: DiagramProps = $props();

	const purged = $derived(step === 'purged');
	const clans = $derived(step === 'clans');

	const CLAN_EN: Record<string, string> = {
		사택: 'Satek',
		진모: 'Jinmo',
		해: 'Hae',
		백: 'Baek',
		연비: 'Yunbi',
		목리: 'Mokli',
		안: 'Ahn',
		국: 'Guk'
	};

	/** Front benches = nearer the aisle; back = outer against walls. Four rows. */
	const LEFT_FRONT_X = 142;
	const LEFT_BACK_X = 68;
	const RIGHT_FRONT_X = 218;
	const RIGHT_BACK_X = 292;
	const ROW_YS = [164, 214, 264, 314] as const;

	/** Eight Great Clans on the eight senior seats — four left, four right. */
	const LEFT_CLANS = ['사택', '진모', '해', '백'] as const;
	const RIGHT_CLANS = ['연비', '목리', '안', '국'] as const;

	const SENIORS = [
		...ROW_YS.map((y, i) => ({ x: LEFT_FRONT_X, y, i, clan: LEFT_CLANS[i] })),
		...ROW_YS.map((y, i) => ({ x: RIGHT_FRONT_X, y, i: i + 4, clan: RIGHT_CLANS[i] }))
	];

	const JUNIORS = [
		...ROW_YS.map((y, i) => ({ x: LEFT_BACK_X, y, i, clan: null as string | null })),
		...ROW_YS.map((y, i) => ({ x: RIGHT_BACK_X, y, i: i + 4, clan: null as string | null }))
	];

	function seatKo(kind: 'senior' | 'junior', clan: string | null): string {
		if (purged) return '왕자';
		if (clans && clan) return clan;
		return kind === 'senior' ? '좌평' : '달솔';
	}

	function seatEn(kind: 'senior' | 'junior', clan: string | null): string {
		if (purged) return 'prince';
		if (clans && clan) return CLAN_EN[clan] ?? clan;
		return kind === 'senior' ? 'Senior' : 'Junior';
	}

	function isBright(clan: string | null): boolean {
		return Boolean(clans && (clan === '사택' || clan === '연비'));
	}
</script>

<svg
	viewBox="0 0 360 400"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Baekje Ministers Assembly: King at the helm, Premier on the aisle, eight Senior Ministers four on each side of the aisle, eight Junior Ministers four on each outer bench"
>
	<!-- chamber floor + central aisle -->
	<g class="chamber" style="--d: 60">
		<rect class="floor" x="164" y="118" width="32" height="228" rx="2" />
		<line class="aisle" x1="180" y1="126" x2="180" y2="338" />
	</g>

	<!-- opposing benches — front near aisle, back against walls -->
	<g class="bench left-bench" style="--d: 100">
		<rect x="36" y="138" width="124" height="210" rx="8" />
	</g>
	<g class="bench right-bench" style="--d: 100">
		<rect x="200" y="138" width="124" height="210" rx="8" />
	</g>

	<!-- King at the helm (top end) -->
	<g class="node king" style="--d: 0">
		<rect class="dais" x="118" y="6" width="124" height="48" rx="8" />
		<circle cx="180" cy="26" r="14" />
		<polygon points="172,20 175,14 178,17 180,12 182,17 185,14 188,20" />
		<ChartLabel x="180" y="42" ko="왕" en="King" w={56} />
	</g>

	<!-- Premier — just below throne, center of aisle -->
	<g class="node pm" style="--d: 160">
		<circle cx="180" cy="88" r="22" />
		{#if purged}
			<ChartLabel x="180" y="88" ko="왕자" en="prince" w={48} size="sm" />
		{:else}
			<ChartLabel x="180" y="88" ko="상좌평" en="Premier" w={52} size="sm" />
		{/if}
	</g>

	<path class="spine" style="--d: 240" d="M 180 54 V 66" pathLength="100" />
	<path class="spine" style="--d: 300" d="M 180 110 V 126" pathLength="100" />

	<!-- row guides: front vs back, four per side -->
	<g class="guide" style="--d: 360">
		<text class="g-ko" x="105" y="152">{purged ? '왕자' : '좌평 · 4'}</text>
		<text class="g-ko" x="255" y="152">{purged ? '왕자' : '좌평 · 4'}</text>
		<text class="g-ko dim" x="68" y="358">{purged ? '왕자' : '달솔 · 4'}</text>
		<text class="g-ko dim" x="292" y="358">{purged ? '왕자' : '달솔 · 4'}</text>
	</g>

	<!-- Senior Ministers — eight, four each side of the aisle -->
	{#each SENIORS as s (s.i)}
		<g
			class="node seat senior"
			class:prince={purged}
			class:bright={isBright(s.clan)}
			style="--d: {420 + s.i * 50}"
		>
			<rect x={s.x - 24} y={s.y - 16} width="48" height="32" rx="5" />
			<ChartLabel x={s.x} y={s.y} ko={seatKo('senior', s.clan)} en={seatEn('senior', s.clan)} w={46} size="sm" />
		</g>
	{/each}

	<!-- Junior Ministers — eight, four each outer bench -->
	{#each JUNIORS as j (j.i)}
		<g
			class="node seat junior"
			class:prince={purged}
			class:bright={isBright(j.clan)}
			style="--d: {820 + j.i * 40}"
		>
			<rect x={j.x - 20} y={j.y - 13} width="40" height="26" rx="4" />
			<ChartLabel x={j.x} y={j.y} ko={seatKo('junior', j.clan)} en={seatEn('junior', j.clan)} w={38} size="sm" />
		</g>
	{/each}

	<text class="foot" class:hollow={purged} style="--d: 1200" x="180" y="390">
		{purged
			? '다수결 · hollow majority'
			: clans
				? '대성팔족 · Eight Clans on the eight senior benches'
				: '정사암 · 좌평 8 · 달솔 8 · four each side of the aisle'}
	</text>
</svg>

<style>
	.dg {
		--accent: #ffd24a;
		--baekje: #ffd24a;
		--nay: #ff4d4d;
		font-family: var(--serif);
	}

	.chamber,
	.bench,
	.node,
	.guide,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: translateY(6px);
		transition:
			opacity 600ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .chamber,
	.play .bench,
	.play .node,
	.play .guide,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: translateY(0);
	}

	.floor {
		fill: var(--band-fill);
		stroke: var(--baekje);
		stroke-width: 2;
	}

	.aisle {
		stroke: var(--baekje);
		stroke-width: 2.2;
		stroke-dasharray: 4 5;
	}

	.bench rect {
		fill: var(--band-fill);
		stroke: var(--baekje);
		stroke-width: 2.2;
	}

	.king .dais {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.king circle {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.king polygon {
		fill: var(--baekje);
	}

	.g-ko {
		font-weight: 700;
		text-anchor: middle;
		fill: var(--baekje);
		font-size: 6.5px;
	}

	.pm circle {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.seat rect {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.junior rect {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: 2.2;
	}

	.seat.bright rect {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: 3.2;
	}

	.seat.prince rect {
		fill: var(--nay);
		stroke: color-mix(in srgb, var(--nay) 28%, #080604);
	}

	.g-ko.dim {
		font-size: 6px;
		opacity: 0.85;
	}

	.spine {
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

	.play .spine {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 6.5px;
		text-anchor: middle;
		fill: var(--baekje);
	}

	.play .foot.hollow {
		opacity: 0.55;
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
