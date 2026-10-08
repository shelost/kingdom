<script module lang="ts">
	import { reading } from '$lib/reading.svelte';

	export const CLAN_EN: Record<string, string> = {
		사택: 'Satek',
		진모: 'Jinmo',
		해: 'Hae',
		백: 'Baek',
		연비: 'Yunbi',
		목리: 'Mokli',
		안: 'Ahn',
		국: 'Guk'
	};

	export const LEFT_CLANS = ['사택', '진모', '해', '백'] as const;

	export const RIGHT_CLANS = ['연비', '목리', '안', '국'] as const;

	export type TitleKey = 'king' | 'premier' | 'senior' | 'junior';

	/** Seats are labelled by title: the title, not the clan, is the seat. */
	export const TITLES: Record<TitleKey, { ko: string; han: string; en: string }> = {
		king: { ko: '왕', han: '王', en: 'King' },
		premier: { ko: '상좌평', han: '上佐平', en: 'Prime Minister' },
		senior: { ko: '좌평', han: '佐平', en: 'Senior Minister' },
		junior: { ko: '달솔', han: '達率', en: 'Junior Minister' }
	};

	/** The thing: the sweating rock the council is named after. */
	export const ROCK = { ko: '정사암', han: '政事巖', en: 'Rock of Politics' };

	/** The council that meets at it. */
	export const ASSEMBLY = { ko: '정사암회의', han: '政事巖會議', en: 'The Ministers’ Assembly' };

	/** Korean first, hanja small, English unless the reader is Korean-only. */
	export const titleLabel = (t: { ko: string; han: string; en: string }, en = t.en) => ({
		ko: t.ko,
		han: t.han,
		en: reading.lang === 'ko' ? undefined : en
	});

	/** Satek and Yunbi, lifted in the 'clans' step. */
	export const isLeadClan = (clan: string | null) => clan === '사택' || clan === '연비';

	/** Seat ids in a scene's `cast`: senior seats 0–3 are the left bench (Satek first), 4–7 the right (Yunbi first). */
	export const SEAT = {
		king: 'king',
		premier: 'premier',
		senior: (i: number) => `senior${i}`,
		junior: (i: number) => `junior${i}`
	};
</script>

<script lang="ts">
	/**
	 * Baekje's Ministers' Assembly (정사암회의) — Commons layout: the King at
	 * the helm, the Prime Minister (상좌평) on the aisle, eight Senior
	 * Ministers (좌평) four-and-four on the inner benches, eight Junior
	 * Ministers (달솔) four-and-four on the outer benches. Seats carry titles,
	 * never names. The Rock of Politics (정사암) itself sits at the foot of
	 * the aisle: the council is named after it, it is not the council.
	 * Steps: 'court' (default) | 'purged' (every seat a prince) |
	 *        'clans' (the Eight Clans under the senior seats, Satek and Yunbi lifted)
	 * In a scene, `cast` (see SEAT) names who holds each seat, and their faces sit on it.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { sitter, type Sitter } from './cast';

	let { step = 'court', active = false, flat = false, cast, year = null }: DiagramProps = $props();

	const who = (seat: string) => sitter(cast, seat, year);
	const named = (s: Sitter) => ({ ko: s.ko ?? s.en, en: showEn ? s.en : undefined });
	const king = $derived(who(SEAT.king));
	const premier = $derived(who(SEAT.premier));

	const purged = $derived(step === 'purged');
	const clans = $derived(step === 'clans');
	const showEn = $derived(reading.lang !== 'ko');

	/** Front benches = nearer the aisle; back = outer against walls. Four rows. */
	const LEFT_FRONT_X = 142;
	const LEFT_BACK_X = 68;
	const RIGHT_FRONT_X = 218;
	const RIGHT_BACK_X = 292;
	const ROW_YS = [180, 226, 272, 318] as const;
	const GUIDE_Y = 148;
	const ROCK_AT = { x: 180, y: 372 };

	/** Eight Great Clans on the eight senior seats — four left, four right. */
	const SENIORS = [
		...ROW_YS.map((y, i) => ({ x: LEFT_FRONT_X, y, i, clan: LEFT_CLANS[i] as string })),
		...ROW_YS.map((y, i) => ({ x: RIGHT_FRONT_X, y, i: i + 4, clan: RIGHT_CLANS[i] as string }))
	];

	const JUNIORS = [
		...ROW_YS.map((y, i) => ({ x: LEFT_BACK_X, y, i })),
		...ROW_YS.map((y, i) => ({ x: RIGHT_BACK_X, y, i: i + 4 }))
	];

	/** Each bench column carries its title once; the seats stay plain. */
	const GUIDES: { x: number; t: TitleKey }[] = [
		{ x: LEFT_BACK_X, t: 'junior' },
		{ x: LEFT_FRONT_X, t: 'senior' },
		{ x: RIGHT_FRONT_X, t: 'senior' },
		{ x: RIGHT_BACK_X, t: 'junior' }
	];
	const guideEn = (t: TitleKey) => (purged ? 'Princes' : `${TITLES[t].en}s`);

	/** An irregular boulder outline round (0, 0). */
	const ROCK_PATH = 'M -24 4 L -19 -7 L -8 -13 L 6 -12 L 18 -8 L 25 1 L 21 9 L 4 12 L -13 11 Z';
</script>

<KitStage id="ministers-assembly" {step} {active} {flat} sceneProps={{ cast, year }}>
	{#snippet fallback()}
<svg
	viewBox="0 0 360 420"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Baekje Ministers’ Assembly: the King at the helm, the Prime Minister on the aisle, eight Senior Ministers four on each side of the aisle, eight Junior Ministers four on each outer bench, and the Rock of Politics at the foot of the aisle"
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
		<circle cx="180" cy="24" r="12" />
		<polygon points="172,20 175,14 178,17 180,12 182,17 185,14 188,20" />
		<ChartLabel x="180" y="42" {...king ? named(king) : titleLabel(TITLES.king)} w={56} size="sm" />
	</g>

	<!-- Prime Minister — just below the throne, on the aisle -->
	<g class="node pm" class:prince={purged} style="--d: 160">
		<circle cx="180" cy="88" r="22" />
		<ChartLabel
			x="180"
			y="88"
			{...premier ? named(premier) : titleLabel(TITLES.premier, purged ? 'Prime Min. · prince' : 'Prime Minister')}
			w={60}
			size="sm"
		/>
	</g>

	<path class="spine" style="--d: 240" d="M 180 54 V 66" pathLength="100" />
	<path class="spine" style="--d: 300" d="M 180 110 V 126" pathLength="100" />

	<!-- column guides: the title of each column, once -->
	<g class="guide" style="--d: 360">
		{#each GUIDES as g (g.x)}
			<ChartLabel x={g.x} y={GUIDE_Y} {...titleLabel(TITLES[g.t], guideEn(g.t))} w={66} size="sm" />
		{/each}
	</g>

	<!-- Senior Ministers — eight, four each side of the aisle -->
	{#each SENIORS as s (s.i)}
		{@const holder = who(SEAT.senior(s.i))}
		<g
			class="node seat senior"
			class:prince={purged}
			class:bright={clans && isLeadClan(s.clan)}
			class:faded={clans && !isLeadClan(s.clan)}
			style="--d: {420 + s.i * 50}"
		>
			<rect x={s.x - 22} y={s.y - 14} width="44" height="28" rx="5" />
			{#if holder}
				<text class="clan" x={s.x} y={s.y + 3}>{holder.ko ?? holder.en}</text>
			{:else if clans}
				<text class="clan" x={s.x} y={s.y + 3}>
					{s.clan}{showEn ? ` ${CLAN_EN[s.clan] ?? ''}` : ''}
				</text>
			{/if}
		</g>
	{/each}

	<!-- Junior Ministers — eight, four each outer bench -->
	{#each JUNIORS as j (j.i)}
		<g class="node seat junior" class:prince={purged} class:faded={clans} style="--d: {820 + j.i * 40}">
			<rect x={j.x - 18} y={j.y - 12} width="36" height="24" rx="4" />
		</g>
	{/each}

	<!-- the Rock of Politics: the thing, at the foot of the aisle -->
	<g class="node rock" style="--d: 1000">
		<path class="rock-body" d={ROCK_PATH} transform="translate({ROCK_AT.x} {ROCK_AT.y})" />
		<ChartLabel x={ROCK_AT.x + 68} y={ROCK_AT.y} {...titleLabel(ROCK)} w={70} size="sm" />
	</g>

	<text class="foot" class:hollow={purged} style="--d: 1200" x="180" y="412">
		{ASSEMBLY.ko} {ASSEMBLY.han}{showEn ? ` · ${ASSEMBLY.en}` : ''}{purged
			? ' · 다수결, hollow majority'
			: clans
				? ' · 대성팔족 under the senior seats'
				: ''}
	</text>
</svg>
	{/snippet}
</KitStage>

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

	.play .node.faded {
		opacity: 0.55;
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

	.pm circle {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.pm.prince circle {
		fill: var(--nay);
	}

	.seat rect {
		fill: var(--baekje);
		stroke: var(--node-stroke);
		stroke-width: var(--stroke-w);
	}

	.junior rect {
		stroke-width: 2.2;
	}

	.seat.bright rect {
		stroke-width: 3.2;
	}

	.seat.prince rect {
		fill: var(--nay);
		stroke: color-mix(in srgb, var(--nay) 28%, #080604);
	}

	.clan {
		font-size: 6px;
		font-weight: 700;
		text-anchor: middle;
		fill: #1a1206;
	}

	.rock-body {
		fill: color-mix(in srgb, var(--fg, #ddd) 45%, var(--band-fill, #333));
		stroke: var(--baekje);
		stroke-width: 1.6;
		stroke-linejoin: round;
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
