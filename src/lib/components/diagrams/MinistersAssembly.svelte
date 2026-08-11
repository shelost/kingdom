<script lang="ts">
	/**
	 * Baekje Ministers’ Assembly on Deer Rock — UK Commons layout:
	 * King at the helm (top), Premier (상좌평) just below on the aisle,
	 * two facing sides with Seniors (좌평) on front benches nearest the aisle
	 * and Juniors (달솔) on back benches against the walls.
	 * Steps: 'court' (default) | 'purged' | 'clans'
	 */
	import type { DiagramProps } from './registry';

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

	/** Front benches = nearer the aisle; back = outer against walls. */
	const LEFT_FRONT_X = 142;
	const LEFT_BACK_X = 68;
	const RIGHT_FRONT_X = 218;
	const RIGHT_BACK_X = 292;
	const ROW_YS = [176, 228, 280, 332] as const;

	const SENIORS = [
		{ x: LEFT_FRONT_X, y: ROW_YS[0], i: 0, clan: '사택' },
		{ x: LEFT_FRONT_X, y: ROW_YS[1], i: 1, clan: '진모' },
		{ x: RIGHT_FRONT_X, y: ROW_YS[0], i: 2, clan: '연비' },
		{ x: RIGHT_FRONT_X, y: ROW_YS[1], i: 3, clan: '목리' }
	];

	const JUNIORS = [
		{ x: LEFT_BACK_X, y: ROW_YS[0], i: 0, clan: '해' },
		{ x: LEFT_BACK_X, y: ROW_YS[1], i: 1, clan: '백' },
		{ x: LEFT_BACK_X, y: ROW_YS[2], i: 2, clan: null as string | null },
		{ x: RIGHT_BACK_X, y: ROW_YS[0], i: 3, clan: '안' },
		{ x: RIGHT_BACK_X, y: ROW_YS[1], i: 4, clan: '국' }
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
	aria-label="Baekje Ministers Assembly: Commons chamber with King at the helm, Premier on the aisle, Senior Ministers on front benches near the aisle, Junior Ministers on back benches, two facing sides"
>
	<!-- chamber floor + central aisle -->
	<g class="chamber" style="--d: 60">
		<rect class="floor" x="164" y="128" width="32" height="230" rx="2" />
		<line class="aisle" x1="180" y1="136" x2="180" y2="350" />
	</g>

	<!-- opposing benches — front near aisle, back against walls -->
	<g class="bench left-bench" style="--d: 100">
		<rect x="36" y="148" width="124" height="210" rx="8" />
	</g>
	<g class="bench right-bench" style="--d: 100">
		<rect x="200" y="148" width="124" height="210" rx="8" />
	</g>

	<!-- King at the helm (top end) -->
	<g class="node king" style="--d: 0">
		<rect class="dais" x="118" y="6" width="124" height="48" rx="8" />
		<circle cx="180" cy="26" r="14" />
		<polygon points="172,20 175,14 178,17 180,12 182,17 185,14 188,20" />
		<text class="k-ko" x="180" y="44">왕</text>
		<text class="k-en" x="180" y="54">King · helm</text>
	</g>

	<!-- Premier — just below throne, center of aisle -->
	<g class="node pm" style="--d: 160">
		<circle cx="180" cy="92" r="24" />
		{#if purged}
			<text class="pm-ko" x="180" y="88">왕자</text>
			<text class="pm-en" x="180" y="100">prince · hollow</text>
		{:else}
			<text class="pm-ko" x="180" y="88">상좌평</text>
			<text class="pm-en" x="180" y="100">Premier</text>
		{/if}
	</g>

	<path class="spine" style="--d: 240" d="M 180 54 V 68" pathLength="100" />
	<path class="spine" style="--d: 300" d="M 180 116 V 136" pathLength="100" />

	<!-- row guides: front vs back -->
	<g class="guide" style="--d: 360">
		<text class="g-ko" x="105" y="164">{purged ? '왕자' : '좌평 · front'}</text>
		<text class="g-ko" x="255" y="164">{purged ? '왕자' : '좌평 · front'}</text>
		<text class="g-ko dim" x="68" y="364">{purged ? '왕자' : '달솔 · back'}</text>
		<text class="g-ko dim" x="292" y="364">{purged ? '왕자' : '달솔 · back'}</text>
	</g>

	<!-- Senior Ministers — front benches (near aisle) -->
	{#each SENIORS as s (s.i)}
		<g
			class="node seat senior"
			class:prince={purged}
			class:bright={isBright(s.clan)}
			style="--d: {480 + s.i * 70}"
		>
			<rect x={s.x - 24} y={s.y - 16} width="48" height="32" rx="5" />
			<text class="s-ko" x={s.x} y={s.y - 1}>{seatKo('senior', s.clan)}</text>
			<text class="s-en" x={s.x} y={s.y + 11}>{seatEn('senior', s.clan)}</text>
		</g>
	{/each}

	<!-- Junior Ministers — back benches (outer / against walls) -->
	{#each JUNIORS as j (j.i)}
		<g
			class="node seat junior"
			class:prince={purged}
			class:bright={isBright(j.clan)}
			style="--d: {780 + j.i * 60}"
		>
			<rect x={j.x - 20} y={j.y - 13} width="40" height="26" rx="4" />
			<text class="j-ko" x={j.x} y={j.y}>{seatKo('junior', j.clan)}</text>
			<text class="j-en" x={j.x} y={j.y + 10}>{seatEn('junior', j.clan)}</text>
		</g>
	{/each}

	<text class="foot" class:hollow={purged} style="--d: 1200" x="180" y="392">
		{purged
			? '다수결 · hollow majority'
			: clans
				? '대성팔족 · Eight Clans on Commons benches'
				: '정사암 · Commons · 좌평 near aisle · 달솔 outer'}
	</text>
</svg>

<style>
	.dg {
		--baekje: #ffcb51;
		--parchment: #fff8e8;
		--nay: #cf4b4b;
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
		fill: color-mix(in srgb, var(--baekje) 12%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 40%, transparent);
		stroke-width: 0.8;
	}

	.aisle {
		stroke: color-mix(in srgb, var(--baekje) 65%, transparent);
		stroke-width: 1.4;
		stroke-dasharray: 4 5;
	}

	.bench rect {
		fill: color-mix(in srgb, var(--baekje) 28%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 70%, transparent);
		stroke-width: 1.1;
	}

	.king .dais {
		fill: color-mix(in srgb, var(--baekje) 36%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 75%, var(--gold));
		stroke-width: 1.3;
	}

	.king circle {
		fill: color-mix(in srgb, var(--baekje) 48%, var(--parchment));
		stroke: var(--baekje);
		stroke-width: 1.2;
	}

	.king polygon {
		fill: color-mix(in srgb, var(--baekje) 40%, var(--gold));
	}

	.k-ko,
	.pm-ko,
	.s-ko,
	.j-ko,
	.g-ko {
		font-weight: 700;
		text-anchor: middle;
		fill: color-mix(in srgb, var(--baekje) 28%, #4a3200);
	}

	.k-ko {
		font-size: 10px;
	}

	.pm circle {
		fill: color-mix(in srgb, var(--baekje) 50%, var(--parchment));
		stroke: var(--baekje);
		stroke-width: 1.7;
	}

	.pm-ko {
		font-size: 10px;
	}

	.seat rect {
		fill: color-mix(in srgb, var(--baekje) 42%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 80%, transparent);
		stroke-width: 1.1;
	}

	.junior rect {
		fill: color-mix(in srgb, var(--baekje) 28%, var(--parchment));
		stroke: color-mix(in srgb, var(--baekje) 65%, transparent);
	}

	.seat.bright rect {
		fill: color-mix(in srgb, var(--baekje) 58%, var(--parchment));
		stroke: var(--baekje);
		stroke-width: 1.6;
	}

	.seat.prince rect {
		fill: color-mix(in srgb, var(--nay) 18%, var(--parchment));
		stroke: color-mix(in srgb, var(--nay) 55%, transparent);
	}

	.k-en,
	.pm-en,
	.s-en,
	.j-en {
		font-size: 5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--fg-faint);
	}

	.s-ko {
		font-size: 9px;
	}

	.j-ko {
		font-size: 8px;
	}

	.g-ko {
		font-size: 6.5px;
		fill: color-mix(in srgb, var(--baekje) 45%, #5a3d00);
	}

	.g-ko.dim {
		font-size: 6px;
		opacity: 0.85;
	}

	.spine {
		fill: none;
		stroke: color-mix(in srgb, var(--baekje) 70%, var(--gold));
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
		fill: color-mix(in srgb, var(--baekje) 50%, var(--fg-faint));
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
