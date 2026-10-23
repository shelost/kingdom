<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		BORDER_EVENTS,
		BORDER_PEAKS,
		POLITIES,
		STORY_SPAN,
		YEAR_MAX,
		YEAR_MIN,
		eventAt,
		formatYear
	} from '$lib/borders';
	import { YearPlayer } from '$lib/yearPlayer.svelte';
	import { reading } from '$lib/reading.svelte';

	let { year = $bindable() }: { year: number } = $props();

	/* The whole span in about 30 seconds. */
	const player = new YearPlayer(
		() => year,
		(y) => (year = y)
	);
	const stop = () => player.stop();

	let event = $derived(eventAt(year));
	let ko = $derived(reading.lang === 'ko');
	const yr = (y: number) => formatYear(y, ko);

	/* ————— the span the slider covers ————— */
	type RangeId = 'all' | 'c7' | 'story' | 'custom';
	const RANGES: { id: Exclude<RangeId, 'custom'>; en: string; ko: string; from: number; to: number }[] = [
		{ id: 'all', en: 'All', ko: '전체', from: YEAR_MIN, to: YEAR_MAX },
		{ id: 'c7', en: '7th century', ko: '7세기', from: 600, to: 700 },
		{ id: 'story', en: 'The story', ko: '이야기', from: STORY_SPAN.from, to: STORY_SPAN.to }
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
		rangeId = id;
		settle();
	}

	function settle() {
		player.setRange(lo, hi);
		if (year < lo || year > hi) jump(year < lo ? lo : hi);
	}

	let span = $derived(hi - lo);
	const at = (y: number) => ((y - lo) / span) * 100;
	const within = (y: number) => y >= lo && y <= hi;

	function jump(to: number) {
		stop();
		year = to;
	}

	onDestroy(stop);
</script>

<div class="timeline">
	<div class="readout">
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
		<output class="year" for="border-year">{yr(year)}</output>
		{#if event}
			<span class="event">
				<span class="event-year">{yr(event.year)}</span>
				{ko ? event.ko : event.en}
			</span>
		{/if}
	</div>

	<div class="ranges" role="group" aria-label={ko ? '기간' : 'Range'}>
		{#each RANGES as r (r.id)}
			<button type="button" class="range" aria-pressed={rangeId === r.id} onclick={() => pick(r.id)}>
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

	<div class="track">
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
		<input
			id="border-year"
			type="range"
			min={lo}
			max={hi}
			step="1"
			bind:value={year}
			oninput={stop}
			aria-label={ko ? '연도' : 'Year'}
			aria-valuetext={yr(year)}
		/>
		<div class="lane ticks" aria-hidden="true">
			{#each BORDER_EVENTS.filter((e) => within(e.year)) as e (e.year)}
				<button
					type="button"
					tabindex="-1"
					class="tick"
					class:past={e.year <= year}
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
				class="peak"
				class:low={i % 2 === 1}
				class:reached={p.year <= year}
				style:left="{at(p.year)}%"
				style:--c={POLITIES[p.polity].color}
				title="{yr(p.year)} · {ko ? p.ko : p.en}"
				aria-label={ko ? `${POLITIES[p.polity].korean} 전성기, ${yr(p.year)}` : `${POLITIES[p.polity].label} at its height, ${yr(p.year)}`}
				onclick={() => jump(p.year)}
			>
				<span class="peak-name">{ko ? POLITIES[p.polity].korean : POLITIES[p.polity].label}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		padding: 0.6rem 0.2rem 0.2rem;
	}

	.readout {
		display: flex;
		align-items: baseline;
		gap: 0.65rem;
		min-width: 0;
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
	}

	.play:hover,

	.play svg {
		width: 0.7rem;
		height: 0.7rem;
		fill: currentColor;
	}

	.year {
		flex: 0 0 auto;
		min-width: 5.6rem;
		font-family: var(--font-display, inherit);
		font-size: 1.15rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--fg-strong);
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
	}

	.range[aria-pressed='true'] {
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--gold) 12%, transparent);
	}

	.custom {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.7rem;
		color: var(--fg-faint);
	}

	.custom input {
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

	.custom .hint {
		font-size: 0.62rem;
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
	}

	/* Lanes share the range input's inner width, so a year sits under the thumb. */
	.lane {
		position: absolute;
		left: 0.5rem;
		right: 0.5rem;
	}

	.lane:first-child {
		inset-block: 0.1rem;
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
		background: transparent;
		accent-color: var(--gold);
		cursor: pointer;
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
	}

	.tick.past {
		background: var(--gold);
		opacity: 0.9;
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
	}

	.peak::before {
		content: '';
		width: 0;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-bottom: 8px solid var(--c);
	}

	.peak.reached,
	.peak:hover {
		opacity: 1;
	}

	.peak-name {
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 65%, var(--fg-strong));
	}

	:global(html[data-theme='light']) .peak-name {
		color: color-mix(in srgb, var(--c) 75%, #17150e);
	}
</style>
