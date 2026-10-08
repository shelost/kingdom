<script module lang="ts">
	import { byId, avatarOf, isPlaceholderArt } from '$lib/people';
	import { reading } from '$lib/reading.svelte';

	export interface Seat {
		id: string;
		year: number;
		ko: string;
		han: string;
		en: string;
	}

	export interface Command extends Seat {
		beast: { ko: string; en: string };
		/** Angle round the table; -90 is the head, where the chair sits. */
		deg: number;
	}

	/** Head of the table (the chair) and, beyond it, the king's seat. */
	export const HEAD_DEG = -90;

	/** The four commands (대가) round the table; the Central one is the chair itself. */
	export const COMMANDS: Command[] = [
		{ id: 'gesomun', year: 640, ko: '동부', han: '東部', en: 'East', beast: { ko: '까마귀', en: 'Crow' }, deg: -18 },
		{ id: 'southcmd', year: 640, ko: '남부', han: '南部', en: 'South', beast: { ko: '돼지', en: 'Pig' }, deg: 54 },
		{ id: 'westcmd', year: 640, ko: '서부', han: '西部', en: 'West', beast: { ko: '소', en: 'Cow' }, deg: 126 },
		{ id: 'northcmd', year: 640, ko: '북부', han: '北部', en: 'North', beast: { ko: '개', en: 'Dog' }, deg: 198 }
	];

	/** The Central command and the High Commander's chair are one seat, at the head. */
	export const CENTRAL: Seat = {
		id: 'gusesa',
		year: 640,
		ko: '중부 · 막리지',
		han: '中部 莫離支',
		en: 'Central · High Commander'
	};

	/** The chair at the head: the Central High Commander, then Yeon once he takes it. */
	export const chairOf = (supreme: boolean): Seat =>
		supreme ? { id: 'gesomun', year: 642, ko: '대막리지', han: '大莫離支', en: 'Supreme Commander' } : CENTRAL;

	/** The king, outside the table: the last word, then a puppet. */
	export const kingOf = (supreme: boolean): Seat =>
		supreme
			? { id: 'bojang', year: 643, ko: '보장왕', han: '寶藏王', en: 'King · puppet' }
			: { id: 'yeongnyu', year: 640, ko: '영류왕', han: '榮留王', en: 'King · last word' };

	export const CHANCELLOR: Seat = { id: 'dosuryu', year: 643, ko: '대대로', han: '大對盧', en: 'Chancellor' };

	/** Portrait for a seat; a silhouette stands in for the unpainted. */
	export const face = (id: string, year: number) => {
		const p = byId.get(id);
		return (p && avatarOf(p, undefined, year)) || null;
	};

	export const isSilhouette = isPlaceholderArt;

	/** A command's label: the 부, its beast, the hanja; English unless the reader is Korean-only. */
	export const commandLabel = (c: Command) => ({
		ko: `${c.ko} · ${c.beast.ko}`,
		han: c.han,
		en: reading.lang === 'ko' ? undefined : `${c.en} · ${c.beast.en}`
	});

	export const seatLabel = (s: Seat) => ({
		ko: s.ko,
		han: s.han,
		en: reading.lang === 'ko' ? undefined : s.en
	});
</script>

<script lang="ts">
	/**
	 * Goguryeo High Summit (제가회의) as an org: four commands round a table,
	 * the Central command's High Commander in the chair at its head, the
	 * king's seat just outside, tied to the chair by one thin line — he has
	 * the last word.
	 * Steps:
	 *   - 'council' — the table as it sat before the massacre (default)
	 *   - 'supreme' — after it: Yeon in the chair as Supreme Commander, his
	 *                 East seat empty, the old High Commander and the other
	 *                 three commands struck out, the new king a puppet
	 *                 outside, the Chancellor at the table's centre
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import KitStage from './three/KitStage.svelte';
	import { hangulInitial } from '$lib/people';

	let { step = 'council', active = false, flat = false }: DiagramProps = $props();

	const supreme = $derived(step === 'supreme');

	const CX = 180;
	const CY = 190;
	const R = 92;
	const FACE = 21;
	const CHAIR = { x: CX, y: CY - R, r: 25 };
	const KING = { x: CX, y: 34, r: 18 };
	const MID = { x: CX, y: CY - 14, r: 16 };
	/** Where the old High Commander is shown, struck, once Yeon has his chair. */
	const OUSTED = { x: CX - 58, y: CHAIR.y - 6, r: 14 };
	const uid = $props.id();

	const seats = COMMANDS.map((c, i) => {
		const a = (c.deg * Math.PI) / 180;
		return { ...c, i, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
	});

	const chair = $derived(chairOf(supreme));
	const king = $derived(kingOf(supreme));
	const fate = (id: string) => (!supreme ? 'sit' : id === 'gesomun' ? 'moved' : 'struck');
</script>

{#snippet portrait(id: string, year: number, x: number, y: number, r: number, clip: string)}
	{@const href = face(id, year)}
	{#if href}
		<image
			{href}
			x={x - r}
			y={y - r - (isSilhouette(href) ? 0 : 4)}
			width={r * 2}
			height={r * 2}
			preserveAspectRatio={isSilhouette(href) ? 'xMidYMid meet' : 'xMidYMin slice'}
			clip-path="url(#{uid}-{clip})"
			class:silhouette={isSilhouette(href)}
		/>
	{:else}
		{@const p = byId.get(id)}
		<text class="initial" {x} y={y + r * 0.32} font-size={r * 0.9}>{p ? hangulInitial(p) : '·'}</text>
	{/if}
{/snippet}

<KitStage id="high-summit" {step} {active} {flat}>
	{#snippet fallback()}
<svg
	viewBox="0 0 360 330"
	class="dg"
	class:play={active}
	class:supreme
	data-step={step}
	role="img"
	aria-label={supreme
		? 'The High Summit after the massacre: Yeon Gesomun in the chair as Supreme Commander, his East seat empty, the old High Commander and the other three commands struck out, a puppet king outside the table, the Chancellor at its centre'
		: 'The Goguryeo High Summit: four regional commands round a table, the Central command’s High Commander in the chair at its head, and the king seated just outside with the last word'}
>
	<defs>
		<clipPath id="{uid}-chair"><circle cx={CHAIR.x} cy={CHAIR.y} r={CHAIR.r} /></clipPath>
		<clipPath id="{uid}-ousted"><circle cx={OUSTED.x} cy={OUSTED.y} r={OUSTED.r} /></clipPath>
		<clipPath id="{uid}-king"><circle cx={KING.x} cy={KING.y} r={KING.r} /></clipPath>
		<clipPath id="{uid}-mid"><circle cx={MID.x} cy={MID.y} r={MID.r} /></clipPath>
		{#each seats as s (s.id)}
			<clipPath id="{uid}-{s.i}"><circle cx={s.x} cy={s.y} r={FACE} /></clipPath>
		{/each}
	</defs>

	<circle class="table" style="--d: 0" cx={CX} cy={CY} r={R} />

	<!-- the king's one line into the org -->
	<line
		class="spoke king-line"
		class:cut={supreme}
		style="--d: 120"
		x1={KING.x}
		y1={KING.y + KING.r}
		x2={CHAIR.x}
		y2={CHAIR.y - CHAIR.r}
		pathLength="100"
	/>

	{#each seats as s (s.id)}
		<line
			class="spoke"
			class:cut={fate(s.id) !== 'sit'}
			style="--d: {240 + s.i * 70}"
			x1={CHAIR.x}
			y1={CHAIR.y}
			x2={s.x}
			y2={s.y}
			pathLength="100"
		/>
	{/each}

	<g class="node king" class:puppet={supreme} style="--d: 60">
		{@render portrait(king.id, king.year, KING.x, KING.y, KING.r, 'king')}
		<circle class="face-ring thin gold" cx={KING.x} cy={KING.y} r={KING.r} />
		{#if supreme}
			<line class="string" x1={KING.x - 10} y1="2" x2={KING.x - 10} y2={KING.y - KING.r + 4} />
			<line class="string" x1={KING.x + 10} y1="2" x2={KING.x + 10} y2={KING.y - KING.r + 4} />
		{/if}
		<ChartLabel x={KING.x + 64} y={KING.y} {...seatLabel(king)} w={74} size="sm" />
	</g>

	<g class="node chair" style="--d: 180">
		{#key chair.id}
			{@render portrait(chair.id, chair.year, CHAIR.x, CHAIR.y, CHAIR.r, 'chair')}
		{/key}
		<circle class="face-ring hub" cx={CHAIR.x} cy={CHAIR.y} r={CHAIR.r} />
		<ChartLabel x={CHAIR.x} y={CHAIR.y + CHAIR.r + 16} {...seatLabel(chair)} w={supreme ? 84 : 100} size="sm" />
	</g>

	{#each seats as s (s.id)}
		{@const f = fate(s.id)}
		<g class="node" class:struck={f === 'struck'} class:gone={f === 'moved'} style="--d: {460 + s.i * 100}">
			{#if f !== 'moved'}
				{@render portrait(s.id, s.year, s.x, s.y, FACE, String(s.i))}
			{/if}
			<circle class="face-ring" cx={s.x} cy={s.y} r={FACE} />
			{#if f === 'moved'}
				<ChartLabel x={s.x} y={s.y + FACE + 12} ko="빈자리" en={reading.lang === 'ko' ? undefined : 'empty seat'} w={54} size="sm" />
			{:else}
				<ChartLabel x={s.x} y={s.y + FACE + 16} {...commandLabel(s)} w={66} size="sm" />
			{/if}
		</g>
	{/each}

	{#if supreme}
		{#each seats.filter((s) => fate(s.id) === 'struck') as s (s.id)}
			<path
				class="x"
				style="--d: {1200 + s.i * 120}"
				d="M {s.x - 15} {s.y - 15} L {s.x + 15} {s.y + 15} M {s.x + 15} {s.y - 15} L {s.x - 15} {s.y + 15}"
				pathLength="100"
			/>
		{/each}
		<g class="node struck" style="--d: 1100">
			{@render portrait(CENTRAL.id, CENTRAL.year, OUSTED.x, OUSTED.y, OUSTED.r, 'ousted')}
			<circle class="face-ring thin" cx={OUSTED.x} cy={OUSTED.y} r={OUSTED.r} />
			<ChartLabel x={OUSTED.x - 50} y={OUSTED.y} {...seatLabel(CENTRAL)} w={70} size="sm" />
		</g>
		<path
			class="x"
			style="--d: 1250"
			d="M {OUSTED.x - 10} {OUSTED.y - 10} L {OUSTED.x + 10} {OUSTED.y + 10} M {OUSTED.x + 10} {OUSTED.y - 10} L {OUSTED.x - 10} {OUSTED.y + 10}"
			pathLength="100"
		/>
		<g class="node" style="--d: 1800">
			{@render portrait(CHANCELLOR.id, CHANCELLOR.year, MID.x, MID.y, MID.r, 'mid')}
			<circle class="face-ring thin" cx={MID.x} cy={MID.y} r={MID.r} />
			<ChartLabel x={MID.x} y={MID.y + MID.r + 14} {...seatLabel(CHANCELLOR)} w={58} size="sm" />
		</g>
	{/if}

	<text class="foot" style="--d: 1500" x={CX} y="324">
		{supreme ? '大莫離支 · one chair where five sat' : '諸加會議 · five commands, the first in the chair, the king outside'}
	</text>
</svg>
	{/snippet}
</KitStage>

<style>
	.dg {
		--goguryeo: #ff3d36;
		--gold: #e8c36a;
		font-family: var(--serif);
	}

	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: scale(0.35);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 550ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms),
			filter 700ms var(--ease) calc(var(--d) * 1ms + 700ms);
	}

	.play .node,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: scale(1);
	}

	.play .node.struck {
		filter: grayscale(1) brightness(0.55);
	}

	.play .node.gone {
		opacity: 0.55;
	}

	.table {
		fill: color-mix(in srgb, var(--goguryeo) 7%, transparent);
		stroke: var(--goguryeo);
		stroke-width: 2;
		stroke-dasharray: 3 5;
		opacity: 0;
		transition: opacity 700ms var(--ease);
	}

	.play .table {
		opacity: 1;
	}

	.face-ring {
		fill: none;
		stroke: var(--goguryeo);
		stroke-width: var(--stroke-w, 2.6);
	}

	.face-ring.hub {
		stroke-width: 3.6;
	}

	.face-ring.thin {
		stroke-width: 2;
	}

	.face-ring.gold {
		stroke: var(--gold);
	}

	.gone .face-ring {
		stroke-dasharray: 3 4;
		fill: color-mix(in srgb, var(--fg, #fff) 4%, transparent);
	}

	.silhouette {
		opacity: 0.7;
	}

	.initial {
		font-family: 'Noto Serif KR', var(--serif);
		font-weight: 700;
		text-anchor: middle;
		fill: var(--fg-dim, #aaa);
	}

	.spoke {
		fill: none;
		stroke: var(--goguryeo);
		stroke-width: var(--link-w, 1.6);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.king-line {
		stroke: var(--gold);
		stroke-width: 1;
	}

	.play .spoke {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.play .spoke.cut {
		opacity: 0.22;
	}

	.x {
		fill: none;
		stroke: #ff3d36;
		stroke-width: 4;
		stroke-linecap: round;
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		transition: stroke-dashoffset 420ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .x {
		stroke-dashoffset: 0;
	}

	.string {
		stroke: color-mix(in srgb, var(--fg, #f4efe6) 55%, transparent);
		stroke-width: 0.8;
	}

	.foot {
		font-size: 7.5px;
		letter-spacing: 0.06em;
		fill: var(--goguryeo);
		text-anchor: middle;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .spoke,
		.play .x {
			stroke-dashoffset: 0;
		}
	}
</style>
