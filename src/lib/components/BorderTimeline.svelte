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

	let {
		year = $bindable(),
		places = $bindable(true)
	}: {
		year: number;
		/** Whether the map shows its place markers over the borders. */
		places?: boolean;
	} = $props();

	/* The whole span in about 30 seconds. */
	const player = new YearPlayer(
		() => year,
		(y) => (year = y)
	);
	const stop = () => player.stop();

	let event = $derived(eventAt(year));
	const span = YEAR_MAX - YEAR_MIN;
	const at = (y: number) => ((y - YEAR_MIN) / span) * 100;

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
			aria-label={player.playing ? 'Pause the timeline' : 'Play the timeline'}
		>
			{#if player.playing}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" /></svg>
			{:else}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" /></svg>
			{/if}
		</button>
		<output class="year" for="border-year">{formatYear(year)}</output>
		{#if event}
			<span class="event">
				<span class="event-year">{formatYear(event.year)}</span>
				{event.en}
			</span>
		{/if}
		<button
			type="button"
			class="places"
			aria-pressed={places}
			onclick={() => (places = !places)}
			title={places ? 'Hide the place markers' : 'Show the place markers'}
		>
			<svg viewBox="0 0 12 12" aria-hidden="true">
				<path d="M6 11s3.8-3.6 3.8-6.3a3.8 3.8 0 0 0-7.6 0C2.2 7.4 6 11 6 11Zm0-4.9a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z" />
			</svg>
			Places
		</button>
	</div>

	<div class="track">
		<div class="lane" aria-hidden="true">
			<button
				type="button"
				tabindex="-1"
				class="story"
				style:left="{at(STORY_SPAN.from)}%"
				style:width="{at(STORY_SPAN.to) - at(STORY_SPAN.from)}%"
				title="The chronicle: {STORY_SPAN.from}–{STORY_SPAN.to} CE"
				onclick={() => jump(STORY_SPAN.from)}
			></button>
		</div>
		<input
			id="border-year"
			type="range"
			min={YEAR_MIN}
			max={YEAR_MAX}
			step="1"
			bind:value={year}
			oninput={stop}
			aria-label="Year"
			aria-valuetext={formatYear(year)}
		/>
		<div class="lane ticks" aria-hidden="true">
			{#each BORDER_EVENTS as e (e.year)}
				<button
					type="button"
					tabindex="-1"
					class="tick"
					class:past={e.year <= year}
					style:left="{at(e.year)}%"
					title="{formatYear(e.year)} · {e.en}"
					onclick={() => jump(e.year)}
				></button>
			{/each}
		</div>
	</div>

	<div class="lane peaks">
		{#each BORDER_PEAKS as p, i (p.polity)}
			<button
				type="button"
				class="peak"
				class:low={i % 2 === 1}
				class:reached={p.year <= year}
				style:left="{at(p.year)}%"
				style:--c={POLITIES[p.polity].color}
				title="{formatYear(p.year)} · {p.en}"
				aria-label="{POLITIES[p.polity].label} at its height, {formatYear(p.year)}"
				onclick={() => jump(p.year)}
			>
				<span class="peak-name">{POLITIES[p.polity].label}</span>
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
	.places:hover {
		background: var(--highlight);
	}

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

	.places {
		flex: 0 0 auto;
		align-self: center;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.25rem 0.6rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
		font: inherit;
		font-size: 0.72rem;
		color: var(--fg-faint);
		cursor: pointer;
	}

	.places[aria-pressed='true'] {
		color: var(--fg-strong);
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.places svg {
		width: 0.7rem;
		height: 0.7rem;
		fill: currentColor;
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
