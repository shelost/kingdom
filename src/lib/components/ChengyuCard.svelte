<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { linkPeople, byId } from '$lib/people';
	import { onceInView } from '$lib/inView';
	import BrushGlyphs from './BrushGlyphs.svelte';
	import Avatar from './Avatar.svelte';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';

	type Chengyu = Extract<Block, { kind: 'chengyu' }>;

	let { block, year = null }: { block: Chengyu; year?: number | null } = $props();

	let play = $state(false);
	let written = $state(false);
	let speaker = $derived(block.person ? byId.get(block.person) : undefined);
	let gloss = $derived(reading.lang === 'ko' && block.ko ? block.ko : block.html);
	let glossSub = $derived(reading.lang === 'both' && block.ko ? block.ko : undefined);
	let story = $derived(reading.lang === 'ko' && block.storyKo ? block.storyKo : block.story);
	let storySub = $derived(reading.lang === 'both' && block.story && block.storyKo ? block.storyKo : undefined);
	let size = $derived(
		Array.from(block.hanja).length > 4 ? 'clamp(2rem, 7.5vw, 3rem)' : 'clamp(2.6rem, 10vw, 4rem)'
	);

	const start = onceInView(() => {
		play = true;
	});
</script>

<figure class="chengyu ink-plate" class:spoken={!!speaker} {@attach start}>
	<Material kind="paper" />
	<span class="wash" aria-hidden="true"></span>
	<span class="plate-tab">{reading.lang === 'en' ? 'Idiom' : '고사성어 · Idiom'}</span>
	{#if speaker}
		<span class="speaker"><Avatar person={speaker} {year} size="2.4rem" /></span>
	{/if}
	<div class="glyphs">
		<BrushGlyphs text={block.hanja} {size} {play} ondone={() => (written = true)} />
	</div>
	<div class="words" class:shown={written}>
		<p class="readings">
			{#if block.reading}<span class="reading" lang="ko">{block.reading}</span>{/if}
			{#if block.pinyin}<span class="pinyin" lang="zh-Latn">{block.pinyin}</span>{/if}
		</p>
		<p class="gloss">{@html linkPeople(gloss, year)}</p>
		{#if glossSub && glossSub !== gloss}<p class="gloss sub" lang="ko">{@html linkPeople(glossSub, year)}</p>{/if}
		{#if block.origin}
			<div class="origin">
				<RecordCite source={block.origin} inked={written} compact />
			</div>
		{/if}
		{#if story}
			<details class="story">
				<summary>{reading.lang === 'ko' ? '이 말의 유래' : 'The story behind it'}</summary>
				<p>{@html linkPeople(story, year)}</p>
				{#if storySub && storySub !== story}<p class="sub" lang="ko">{@html linkPeople(storySub, year)}</p>{/if}
			</details>
		{/if}
	</div>
</figure>

<style>
	.chengyu {
		--text-cite: var(--sumi);
		--text-faint: var(--sumi-dim);
		isolation: isolate;
		display: grid;
		justify-items: center;
		gap: 0.9rem;
		padding: 1.7rem 1.3rem 1.1rem;
	}

	/* A spreading pool of diluted ink behind the characters. */
	.wash {
		position: absolute;
		z-index: -1;
		left: 50%;
		top: 2.6rem;
		width: min(26rem, 90%);
		height: 7rem;
		translate: -50% 0;
		border-radius: 50%;
		background:
			radial-gradient(
				closest-side at 46% 52%,
				color-mix(in srgb, var(--sumi) 14%, transparent),
				color-mix(in srgb, var(--sumi) 5%, transparent) 60%,
				transparent
			),
			radial-gradient(closest-side at 70% 40%, color-mix(in srgb, var(--sumi) 7%, transparent), transparent);
		filter: blur(6px);
		pointer-events: none;
	}

	.speaker {
		position: absolute;
		top: 0.6rem;
		right: 0.7rem;
		z-index: 1;
	}

	.glyphs {
		padding: 0.3rem 0 0.6rem;
		border-bottom: 2px solid var(--vermilion);
	}

	.words {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		width: 100%;
		max-width: 34rem;
		text-align: center;
		opacity: 0;
		transform: translateY(0.3rem);
		transition:
			opacity 320ms var(--ease),
			transform 320ms var(--ease);
	}

	.words.shown {
		opacity: 1;
		transform: none;
	}

	.readings {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		gap: 0.2rem 0.8rem;
		margin: 0;
	}

	.reading {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.15rem;
		font-weight: 900;
		letter-spacing: 0.08em;
		color: var(--vermilion);
	}

	.pinyin {
		font-family: var(--serif);
		font-size: 0.92rem;
		font-style: italic;
		color: var(--sumi-dim);
	}

	.gloss {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0.2rem 0 0;
		color: var(--sumi);
	}

	.gloss.sub {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--sumi-dim);
	}

	.origin {
		margin-top: 0.35rem;
	}

	.story {
		width: 100%;
		margin-top: 0.4rem;
		text-align: left;
		border-top: 1px solid color-mix(in srgb, var(--sumi) 14%, transparent);
	}

	.story summary {
		padding: 0.5rem 0 0.2rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: center;
		color: var(--sumi-dim);
		cursor: pointer;
		list-style: none;
	}

	.story summary::-webkit-details-marker {
		display: none;
	}

	.story summary::after {
		content: ' ＋';
		color: var(--vermilion);
	}

	.story[open] summary::after {
		content: ' －';
	}

	.story summary:focus-visible {
		outline: 2px solid var(--vermilion);
		outline-offset: 2px;
	}

	.story p {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0.35rem 0 0.2rem;
		color: var(--sumi);
	}

	.story p.sub {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--sumi-dim);
	}

	@media (prefers-reduced-motion: reduce) {
		.words {
			transition: none;
		}
	}
</style>
