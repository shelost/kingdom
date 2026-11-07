<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { plateLines, type Block } from '$lib/story';
	import { reading, leadLang } from '$lib/reading.svelte';
	import { jumpPlace } from '$lib/timeJump';

	type Plate = Extract<Block, { kind: 'section' | 'story' | 'day' | 'scene' }>;

	let {
		block,
		/** Scene id for the table of contents and scroll tracking. */
		sid,
		/** Running number of a section or story plate. */
		n,
		arrive
	}: {
		block: Plate;
		sid?: string;
		n?: number;
		arrive: Attachment<HTMLElement>;
	} = $props();

	let koFirst = $derived(leadLang(reading.lang) === 'ko');
</script>

{#if block.kind === 'section'}
	<!-- a section: Prince, General, Father — the run of stories under it -->
	<header class="section" data-story-id={sid} data-scene={sid} {@attach arrive}>
		{#if n}<span class="section-n">{koFirst ? `장 ${n}` : `Section ${n}`}</span>{/if}
		<span class="section-label">{block.label}</span>
		{#if block.ko}<span class="section-ko">{block.ko}</span>{/if}
	</header>
{:else if block.kind === 'story'}
	<!-- a story: Childhood, the battle — the run of scenes under it -->
	<header class="story" data-story-id={sid} data-scene={sid} {@attach arrive}>
		{#if n}<span class="story-n">{koFirst ? `이야기 ${n}` : `Story ${n}`}</span>{/if}
		<span class="story-label">{block.label}</span>
		{#if block.ko}<span class="story-ko">{block.ko}</span>{/if}
	</header>
{:else if block.jump}
	{@const where = jumpPlace(block, koFirst)}
	<!-- a large time jump: the time as a title card, the place small beneath it -->
	<header class="day jump" data-story-id={sid} data-scene={sid} {@attach arrive}>
		{#if block.jump.year != null}<span class="jump-year"
				>{Math.abs(block.jump.year)}{#if block.jump.year < 0}<small class="era">{koFirst ? '기원전' : 'BC'}</small>{/if}</span
			>{/if}
		<span class="jump-title" class:under={block.jump.year != null}>{(koFirst && block.jump.ko) || block.jump.en}</span>
		{#if where}
			<span class="jump-place">
				<span class="material-symbols-outlined" aria-hidden="true">location_on</span>
				{where}
			</span>
		{/if}
	</header>
{:else}
	<!-- the siege calendar / merged-episode scene plate -->
	{@const en = plateLines(block.label)}
	{@const koSplit = plateLines(block.ko, false)}
	{@const ko = koSplit.length === en.length ? koSplit : block.ko ? [block.ko] : []}
	<header class="day" data-story-id={sid} data-scene={sid} {@attach arrive}>
		{#each en as line, li (li)}
			<span class="day-line" class:day-when={li > 0}>
				<span class="day-label">{line}</span>
				{#if ko[li]}<span class="day-ko">{ko[li]}</span>{/if}
			</span>
		{/each}
	</header>
{/if}

<style lang="scss">
	/* ————— siege-day / scene header ————— */

	.day {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		margin: 6.5rem 0 1rem;
	}

	.day-line {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
	}

	.day-when .day-label {
		font-size: 0.98rem;
		font-weight: 500;
		color: var(--fg-dim);
	}

	.day:first-child {
		margin-top: 1rem;
	}

	.day-label {
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.015em;
		color: var(--fg-strong);
	}

	.day-ko {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	/* A time jump: the years as a large title card, the place as a small tag beneath. */

	.day.jump {
		align-items: center;
		gap: 0.6rem;
		margin: 9rem 0 3rem;
		text-align: center;
		&:first-child {
			margin-top: 2rem;
		}
	}

	.jump-title {
		font-family: var(--serif);
		font-size: clamp(2rem, 5vw, 3.1rem);
		font-weight: 600;
		font-style: italic;
		line-height: 1.05;
		letter-spacing: -0.025em;
		color: var(--fg-strong);
		text-wrap: balance;
	}

	.jump-year {
		font-family: var(--serif);
		font-size: clamp(3.4rem, 10vw, 6rem);
		font-weight: 700;
		line-height: 0.95;
		letter-spacing: -0.04em;
		font-variant-numeric: lining-nums;
		color: var(--fg-strong);
		& .era {
			margin-left: 0.3em;
			font-family: var(--ui);
			font-size: 0.85rem;
			font-weight: 600;
			letter-spacing: 0.14em;
			vertical-align: 0.4em;
			color: var(--fg-dim);
		}
	}

	.jump-title.under {
		font-size: clamp(1.2rem, 2.8vw, 1.6rem);
		font-weight: 500;
		color: var(--fg-dim);
	}

	.jump-place {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-family: var(--ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
		& .material-symbols-outlined {
			font-size: 0.95rem;
		}
	}

	/* A section plate sits one size above the stories it holds. */

	.section {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.3rem 0.75rem;
		margin: 9rem 0 1.4rem;
		padding-top: 1.25rem;
		border-top: 1px solid color-mix(in srgb, var(--fg) 22%, transparent);
		&:first-child {
			margin-top: 1rem;
		}
	}

	.section-n {
		display: block;
		flex-basis: 100%;
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.section-label {
		display: inline-block;
		font-family: var(--serif);
		font-size: 2rem;
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	.section-ko {
		display: inline-block;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	/* A story plate sits between the section and the location scenes. */

	.story {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.25rem 0.65rem;
		margin: 4.5rem 0 1rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		/* Each plate is its own instance, so the neighbour is matched by class alone. */
		:global(.section) + &, &:first-child {
			margin-top: 1.25rem;
		}
	}

	.story-n {
		display: block;
		flex-basis: 100%;
		font-family: var(--ui);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.story-label {
		display: inline-block;
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 600;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--fg-strong);
	}

	.story-ko {
		display: inline-block;
		font-size: 0.86rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	:global(.section) + .day,
	:global(.story) + .day {
		margin-top: 1.75rem;
	}
</style>
