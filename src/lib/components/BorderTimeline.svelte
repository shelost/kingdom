<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, type Component } from 'svelte';
	import {
		BORDER_ERAS,
		BORDER_EVENTS,
		BORDER_PEAKS,
		EQUAL_ERAS,
		POLITIES,
		LATER_SPAN,
		STORY_SPAN,
		YEAR_MAX,
		YEAR_MIN,
		eraAt,
		eventAt,
		formatYear,
		polityName
	} from '$lib/borders';
	import { YearPlayer } from '$lib/yearPlayer.svelte';
	import { reading } from '$lib/reading.svelte';

	const FLOW = { duration: 280, easing: 'cubic-bezier(0.2, 0.85, 0.2, 1)' };

	/**
	 * The package's Svelte entry pulls a `.svelte` file Node cannot load during SSR.
	 * The server paints the plain number; the browser swaps in the animated counter.
	 */
	let Flow = $state<Component<{
		value: number;
		format?: Intl.NumberFormatOptions;
		transformTiming?: { duration: number; easing: string };
		spinTiming?: { duration: number; easing: string };
		respectMotionPreference?: boolean;
	}> | null>(null);
	if (browser) {
		import('@number-flow/svelte').then((m) => {
			Flow = m.default;
		});
	}

	let { year = $bindable(), pill = false }: { year: number; pill?: boolean } = $props();

	/* The whole span in about 30 seconds. */
	const player = new YearPlayer(
		() => year,
		(y) => (year = y)
	);
	const stop = () => player.stop();

	let event = $derived(eventAt(year));
	let era = $derived(eraAt(year));
	let ko = $derived(reading.lang === 'ko');
	const yr = (y: number) => formatYear(y, ko);

	/* ————— the span the slider covers ————— */
	type RangeId = 'all' | 'c7' | 'story' | 'later' | 'custom';
	const RANGES: {
		id: Exclude<RangeId, 'custom'>;
		en: string;
		ko: string;
		from: number;
		to: number;
		/** Plays the span from its first year, slowly enough to watch the borders move. */
		play?: boolean;
	}[] = [
		{ id: 'all', en: 'All', ko: '전체', from: YEAR_MIN, to: YEAR_MAX },
		{ id: 'c7', en: '7th century', ko: '7세기', from: 600, to: 700 },
		{ id: 'story', en: 'The story', ko: '이야기', from: STORY_SPAN.from, to: STORY_SPAN.to },
		{ id: 'later', en: 'Later', ko: '후삼국', from: LATER_SPAN.from, to: LATER_SPAN.to, play: true }
	];
	let rangeId = $state<RangeId>('all');
	let customFrom = $state(600);
	let customTo = $state(700);
	const clampYear = (y: number) => Math.min(YEAR_MAX, Math.max(YEAR_MIN, Math.round(y || 0)));
	let lo = $derived(
		rangeId === 'custom' ? Math.min(clampYear(customFrom), clampYear(customTo)) : RANGES.find((r) => r.id === rangeId)!.from
	);
	let hi = $derived(
		rangeId === 'custom'
			? Math.max(clampYear(customFrom), clampYear(customTo), Math.min(clampYear(customFrom), clampYear(customTo)) + 1)
			: RANGES.find((r) => r.id === rangeId)!.to
	);

	/** Pick a span: the player keeps to it and the year steps inside it. */
	function pick(id: RangeId) {
		const range = RANGES.find((r) => r.id === id);
		player.setSpeed(range?.play ? 5 : 32);
		rangeId = id;
		settle();
		if (range?.play) {
			jump(lo);
			player.play();
		}
	}

	function settle() {
		player.setRange(lo, hi);
		if (year < lo || year > hi) jump(year < lo ? lo : hi);
	}

	const within = (y: number) => y >= lo && y <= hi;

	/**
	 * Visual position on the bar. The long early ages keep a share of their
	 * years. Each hegemony, and each peer age after them, takes the same width.
	 */
	const scale = $derived.by(() => {
		type Seg = { from: number; to: number; w: number };
		const segs: Seg[] = [];
		const eras = BORDER_ERAS.filter((e) => e.to > lo && e.from < hi).sort((a, b) => a.from - b.from);
		let cursor = lo;
		for (const e of eras) {
			const a = Math.max(e.from, lo);
			const b = Math.min(e.to, hi);
			if (b <= a) continue;
			if (cursor < a - 0.5) segs.push({ from: cursor, to: a, w: Math.max(0.12, (a - cursor) / 140) });
			const w = EQUAL_ERAS.has(e.en) ? 1 : Math.max(0.85, (b - a) / 240);
			segs.push({ from: a, to: b, w });
			cursor = b;
		}
		if (cursor < hi) segs.push({ from: cursor, to: hi, w: Math.max(0.12, (hi - cursor) / 140) });
		const sum = segs.reduce((s, g) => s + g.w, 0) || 1;
		let acc = 0;
		return segs.map((g) => {
			const start = (acc / sum) * 100;
			acc += g.w;
			return { ...g, start, end: (acc / sum) * 100 };
		});
	});

	const at = (y: number) => {
		const y2 = Math.min(hi, Math.max(lo, y));
		for (let i = 0; i < scale.length; i++) {
			const g = scale[i];
			if (y2 <= g.to || i === scale.length - 1) {
				const t = g.to === g.from ? 0 : (y2 - g.from) / (g.to - g.from);
				return g.start + (g.end - g.start) * Math.min(1, Math.max(0, t));
			}
		}
		return 0;
	};

	const yearAt = (pct: number) => {
		const p = Math.min(100, Math.max(0, pct));
		for (let i = 0; i < scale.length; i++) {
			const g = scale[i];
			if (p <= g.end || i === scale.length - 1) {
				const t = g.end === g.start ? 0 : (p - g.start) / (g.end - g.start);
				return Math.round(g.from + (g.to - g.from) * Math.min(1, Math.max(0, t)));
			}
		}
		return lo;
	};

	let trackEl = $state<HTMLElement>();

	function scrub(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('button')) return;
		const el = trackEl;
		if (!el) return;
		stop();
		const apply = (ev: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const pad = 8;
			const p = ((ev.clientX - r.left - pad) / Math.max(1, r.width - pad * 2)) * 100;
			year = Math.min(hi, Math.max(lo, yearAt(p)));
		};
		apply(e);
		const move = (ev: PointerEvent) => apply(ev);
		const up = () => {
			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
		};
		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
	}

	function nudge(e: KeyboardEvent) {
		const step = e.shiftKey ? 10 : 1;
		if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
			e.preventDefault();
			jump(Math.min(hi, year + step));
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
			e.preventDefault();
			jump(Math.max(lo, year - step));
		} else if (e.key === 'Home') {
			e.preventDefault();
			jump(lo);
		} else if (e.key === 'End') {
			e.preventDefault();
			jump(hi);
		}
	}

	function jump(to: number) {
		stop();
		year = to;
	}

	onDestroy(stop);
</script>

<div class={['timeline', { pill }]}>
	<div class="body">
	<div class="readout">
		<div class="yearline">
		<button
			type="button"
			class="play"
			onclick={() => player.toggle()}
			aria-label={player.playing ? (ko ? '멈춤' : 'Pause the timeline') : ko ? '재생' : 'Play the timeline'}
		>
			{#if player.playing}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" /></svg>
			{:else}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" /></svg>
			{/if}
		</button>
		<output class="year" for="border-year">
			{#if ko && year < 0}<span class="unit">기원전</span>{/if}
			{#if Flow}
				<Flow
					value={Math.abs(year)}
					format={{ useGrouping: false, maximumFractionDigits: 0 }}
					transformTiming={FLOW}
					spinTiming={FLOW}
					respectMotionPreference
				/>
			{:else}
				<span class="digits">{Math.abs(year)}</span>
			{/if}
			<span class="unit">{ko ? '년' : year < 0 ? 'BCE' : 'CE'}</span>
		</output>
		</div>
		{#if era}
			<span class="era-now">{ko ? era.ko : era.en}</span>
		{/if}
		{#if event}
			<span class="event">
				<span class="event-year">{yr(event.year)}</span>
				{ko ? event.ko : event.en}
			</span>
		{/if}
	</div>

	<div class="bars">
	<div class="ranges" role="group" aria-label={ko ? '기간' : 'Range'}>
		{#each RANGES as r (r.id)}
			<button
				type="button"
				class={['range', r.play && 'later']}
				aria-pressed={rangeId === r.id}
				title={r.play ? (ko ? '889년 분열, 후삼국, 936년 고려' : '889 the break, three kingdoms, Goryeo in 936') : undefined}
				onclick={() => pick(r.id)}
			>
				{ko ? r.ko : r.en}
			</button>
		{/each}
		<button type="button" class="range" aria-pressed={rangeId === 'custom'} onclick={() => pick('custom')}>
			{ko ? '직접 지정' : 'Custom'}
		</button>
		{#if rangeId === 'custom'}
			<span class="custom">
				<label>
					<span class="sr-only">{ko ? '시작 연도' : 'From year'}</span>
					<input type="number" min={YEAR_MIN} max={YEAR_MAX} step="1" bind:value={customFrom} onchange={settle} />
				</label>
				<span aria-hidden="true">–</span>
				<label>
					<span class="sr-only">{ko ? '끝 연도' : 'To year'}</span>
					<input type="number" min={YEAR_MIN} max={YEAR_MAX} step="1" bind:value={customTo} onchange={settle} />
				</label>
				<span class="hint">{ko ? '기원전은 음수' : 'BCE as negative'}</span>
			</span>
		{/if}
	</div>

	<div class="eras" role="group" aria-label={ko ? '시대' : 'Eras'}>
		{#each BORDER_ERAS as e (e.from)}
			{#if within(e.from) || within(e.to) || (lo >= e.from && hi <= e.to)}
				{@const left = Math.max(0, at(Math.max(e.from, lo)))}
				{@const right = Math.min(100, at(Math.min(e.to, hi)))}
				<button
					type="button"
					class={['era', { now: era === e }]}
					style:left="{left}%"
					style:width="{Math.max(0, right - left)}%"
					style:--c={e.color}
					title="{ko ? e.ko : e.en}: {yr(e.from)} – {yr(e.to)}"
					aria-pressed={era === e}
					onclick={() => jump(Math.min(hi, Math.max(lo, e.from)))}
				>
					<span>{ko ? e.ko : e.en}</span>
				</button>
			{/if}
		{/each}
	</div>

	<div
		class="track"
		bind:this={trackEl}
		role="slider"
		tabindex="0"
		aria-valuemin={lo}
		aria-valuemax={hi}
		aria-valuenow={year}
		aria-valuetext={yr(year)}
		aria-label={ko ? '연도' : 'Year'}
		onpointerdown={scrub}
		onkeydown={nudge}
	>
		<div class="lane" aria-hidden="true">
			{#if within(STORY_SPAN.from) || within(STORY_SPAN.to) || (lo > STORY_SPAN.from && hi < STORY_SPAN.to)}
			<button
				type="button"
				tabindex="-1"
				class="story"
				style:left="{Math.max(0, at(STORY_SPAN.from))}%"
				style:width="{Math.min(100, at(STORY_SPAN.to)) - Math.max(0, at(STORY_SPAN.from))}%"
				title={ko ? `이야기: ${STORY_SPAN.from}–${STORY_SPAN.to}년` : `The chronicle: ${STORY_SPAN.from}–${STORY_SPAN.to} CE`}
				onclick={() => jump(Math.max(lo, STORY_SPAN.from))}
			></button>
			{/if}
		</div>
		<input id="border-year" class="slider" type="range" min={lo} max={hi} step="1" value={year} tabindex="-1" aria-hidden="true" />
		<span class="thumb" style:left="calc(0.5rem + (100% - 1rem) * {at(year) / 100})"></span>
		<div class="lane ticks" aria-hidden="true">
			{#each BORDER_EVENTS.filter((e) => within(e.year)) as e (e.year)}
				<button
					type="button"
					tabindex="-1"
					class={['tick', { past: e.year <= year }]}
					style:left="{at(e.year)}%"
					title="{yr(e.year)} · {ko ? e.ko : e.en}"
					onclick={() => jump(e.year)}
				></button>
			{/each}
		</div>
	</div>

	<div class="lane peaks">
		{#each BORDER_PEAKS.filter((p) => within(p.year)) as p, i (p.polity)}
			<button
				type="button"
				class={['peak', { low: i % 2 === 1, reached: p.year <= year }]}
				style:left="{at(p.year)}%"
				style:--c={POLITIES[p.polity].color}
				title="{yr(p.year)} · {ko ? p.ko : p.en}"
				aria-label={ko ? `${polityName(p.polity, p.year).korean} 전성기, ${yr(p.year)}` : `${polityName(p.polity, p.year).label} at its height, ${yr(p.year)}`}
				onclick={() => jump(p.year)}
			>
				<span class="peak-name">{ko ? polityName(p.polity, p.year).korean : polityName(p.polity, p.year).label}</span>
			</button>
		{/each}
	</div>
	</div>
	</div>
</div>

<style lang="scss">
	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.6rem 0.2rem 0.2rem;
		&.pill {
			width: 100%;
			gap: 0;
			padding: 0.1rem 0.15rem 0;
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.bars {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.timeline.pill .body {
		display: grid;
		grid-template-columns: minmax(9.5rem, 13rem) minmax(0, 1fr);
		align-items: start;
		gap: 0.2rem 0.85rem;
	}

	.timeline.pill .bars {
		gap: 0.22rem;
	}

	.yearline {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		flex: 0 0 auto;
	}

	.era-now {
		flex: 0 0 auto;
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.03em;
		color: var(--fg-strong);
	}

	.eras {
		position: relative;
		height: 1.35rem;
		margin: 0 0.5rem;
		border-radius: 999px;
		overflow: hidden;
	}

	.era {
		position: absolute;
		top: 0;
		height: 100%;
		padding: 0 0.3rem;
		overflow: hidden;
		border: none;
		border-right: 1px solid rgb(0 0 0 / 0.35);
		background: color-mix(in srgb, var(--c, var(--fg)) 72%, #1a140c);
		color: #fff;
		font: inherit;
		font-size: 0.58rem;
		font-weight: 650;
		letter-spacing: -0.01em;
		line-height: 1.35rem;
		text-align: left;
		text-shadow: 0 1px 2px rgb(0 0 0 / 0.45);
		white-space: nowrap;
		cursor: pointer;
		& span {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&.now {
			background: var(--c, var(--gold));
			box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.55);
		}
		&:hover {
			filter: brightness(1.08);
		}
	}

	.readout {
		display: flex;
		align-items: baseline;
		gap: 0.65rem;
		min-width: 0;
	}

	.timeline.pill .readout {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.12rem;
	}

	.timeline.pill .event {
		white-space: normal;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		line-height: 1.25;
	}

	.play {
		flex: 0 0 auto;
		align-self: center;
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 50%;
		background: transparent;
		color: var(--fg-strong);
		cursor: pointer;
		&:hover, & svg {
			width: 0.7rem;
			height: 0.7rem;
			fill: currentColor;
		}
	}

	.year {
		display: inline-flex;
		align-items: baseline;
		gap: 0.28rem;
		flex: 0 0 auto;
		min-width: 6.2rem;
		font-family: var(--serif);
		font-size: 1.85rem;
		font-weight: 560;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--fg-strong);
		& :global(number-flow-svelte) {
			font: inherit;
			letter-spacing: inherit;
			--number-flow-mask-height: 0.12em;
		}
	}

	.unit {
		font-size: 0.42em;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--fg-dim);
	}

	.event {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.78rem;
		color: var(--fg-dim);
	}

	.event-year {
		margin-right: 0.35rem;
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.ranges {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
	}

	.range {
		padding: 0.18rem 0.6rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
		font: inherit;
		font-size: 0.68rem;
		color: var(--fg-faint);
		cursor: pointer;
		&[aria-pressed='true'] {
			border-color: color-mix(in srgb, var(--gold) 55%, transparent);
			color: var(--fg-strong);
			background: color-mix(in srgb, var(--gold) 12%, transparent);
		}
		&.later {
			border-color: color-mix(in srgb, #9b2c2c 70%, var(--hairline));
			color: var(--fg);
		}
		&.later[aria-pressed='true'] {
			border-color: #9b2c2c;
			color: var(--fg-strong);
			background: color-mix(in srgb, #9b2c2c 18%, transparent);
		}
	}

	.custom {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		color: var(--fg-faint);
		& input {
			width: 4.6rem;
			padding: 0.15rem 0.35rem;
			border: 1px solid var(--hairline);
			border-radius: 4px;
			background: transparent;
			font: inherit;
			font-size: 0.72rem;
			font-variant-numeric: tabular-nums;
			color: var(--fg-strong);
		}
		& .hint {
			font-size: 0.62rem;
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.track {
		position: relative;
		height: 1.4rem;
		cursor: pointer;
		touch-action: none;
		outline: none;
	}

	.thumb {
		position: absolute;
		z-index: 2;
		top: 50%;
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		background: var(--gold);
		box-shadow: 0 0 0 3px rgb(8 8 10 / 0.9);
		translate: -50% -50%;
		pointer-events: none;
	}

	/* Lanes share the range input's inner width, so a year sits under the thumb. */

	.lane {
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
		&:first-child {
			inset-block: 0.1rem;
		}
	}

	/* The chronicle's own years, picked out behind the track. */

	.story {
		position: absolute;
		top: 0;
		height: 100%;
		padding: 0;
		border: 1px solid var(--gold);
		border-radius: 4px;
		background: color-mix(in srgb, var(--gold) 45%, transparent);
		cursor: pointer;
	}

	input[type='range'] {
		position: absolute;
		inset: 0;
		width: 100%;
		margin: 0;
		opacity: 0;
		pointer-events: none;
	}

	.ticks {
		bottom: -0.15rem;
		height: 0.45rem;
	}

	.tick {
		position: absolute;
		top: 0;
		width: 2px;
		height: 100%;
		padding: 0;
		border: none;
		translate: -50% 0;
		background: var(--fg-faint);
		opacity: 0.55;
		cursor: pointer;
		&.past {
			background: var(--gold);
			opacity: 0.9;
		}
	}

	/* Each kingdom's height: a coloured peak with its name beneath. */

	.peaks {
		position: relative;
		left: auto;
		right: auto;
		margin: 0.1rem 0.5rem 0;
		height: 2.1rem;
	}

	/* Neighbouring peaks alternate rows so their names never collide. */

	.peak.low .peak-name {
		margin-top: 0.6rem;
	}

	.peak {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		padding: 0;
		border: none;
		background: none;
		translate: -50% 0;
		font: inherit;
		cursor: pointer;
		opacity: 0.55;
		transition: opacity 300ms var(--ease);
		&::before {
			content: '';
			width: 0;
			height: 0;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-bottom: 8px solid var(--c);
		}
		&.reached, &:hover {
			opacity: 1;
		}
	}

	.peak-name {
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 65%, var(--fg-strong));
		:global(html[data-theme='light']) & {
			color: color-mix(in srgb, var(--c) 75%, #17150e);
		}
	}

	@media (max-width: 1023px) {
		.timeline {
			padding: 0.35rem 0 0.15rem;
		}
		.play {
			width: 2.35rem;
			height: 2.35rem;
			& svg {
				width: 0.85rem;
				height: 0.85rem;
			}
		}
		.range {
			min-height: 2.15rem;
			padding: 0.35rem 0.75rem;
			font-size: 0.78rem;
		}
		.event {
			white-space: normal;
			line-height: 1.3;
		}
	}
</style>
