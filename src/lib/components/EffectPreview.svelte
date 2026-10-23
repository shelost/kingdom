<script lang="ts">
	/**
	 * One animation effect as a widget: a small screen that plays it with the
	 * reader's own code (the weather planes, the moment, a real dialogue line in
	 * message form, a script line with its scene entrance), then its name, what
	 * it looks like and when the story plays it.
	 */
	import type { Attachment } from 'svelte/attachments';
	import type { Block } from '$lib/story';
	import type { Effect } from '$lib/effects';
	import { animating } from '$lib/motionUi.svelte';
	import { sceneReveal } from '$lib/sceneReveal';
	import Blocks from './Blocks.svelte';
	import WeatherPlanes from './WeatherPlanes.svelte';
	import WeatherMoment from './WeatherMoment.svelte';

	let { effect, ko = false }: { effect: Effect; ko?: boolean } = $props();

	/** Bumped by Replay; the first time the screen comes into view starts the one-shot effects. */
	let run = $state(0);
	/** Weather only runs while its screen is on screen, so a long gallery stays light. */
	let visible = $state(false);

	const pick = (t: { en: string; ko: string }) => (ko ? t.ko : t.en);

	/** The bubble demo as a real dialogue line, so it plays through the reader's own bubble code. */
	let line = $derived<Block | null>(
		effect.kind === 'bubble'
			? { kind: 'dialogue', chip: '', person: effect.person, lines: [effect.line.ko], en: [effect.line.en] }
			: null
	);

	const watch: Attachment<HTMLElement> = (node) => {
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			if (visible && !run) run = 1;
		});
		io.observe(node);
		return () => io.disconnect();
	};
</script>

<div class="effect">
	<div class="screen" class:chat={effect.kind === 'bubble'} {@attach watch}>
		{#if !animating()}
			<p class="off">{ko ? '설정에서 애니메이션이 꺼져 있습니다.' : 'Animations are off in Settings.'}</p>
		{:else if effect.kind === 'weather'}
			{#if visible}<WeatherPlanes weather={effect.weather} contained />{/if}
			<p class="title">{pick(effect.name)}</p>
		{:else if effect.kind === 'moment'}
			<p class="title">{pick(effect.name)}</p>
			{#key run}
				{#if run}<WeatherMoment kind={effect.moment} contained />{/if}
			{/key}
		{:else if effect.kind === 'bubble' && line}
			{#key run}
				<div class="line">
					<Blocks blocks={[line]} weather={effect.weather} dialogueStyle="comic" idPrefix={`fx-${effect.id}-${run}-`} />
				</div>
			{/key}
		{:else if effect.kind === 'entrance'}
			{#key run}
				<p class="sample" {@attach sceneReveal(effect.mood)}>{pick(effect.sample)}</p>
			{/key}
		{/if}
		{#if animating() && effect.kind !== 'weather'}
			<button type="button" class="replay" aria-label={ko ? '다시 보기' : 'Replay'} onclick={() => run++}>
				<span class="material-symbols-outlined" aria-hidden="true">replay</span>
			</button>
		{/if}
	</div>

	<h3>
		{pick(effect.name)}
		<span class="other">{ko ? effect.name.en : effect.name.ko}</span>
	</h3>
	<p class="describe">{pick(effect.describe)}</p>
	<p class="when"><b>{ko ? '언제' : 'When'}</b> {pick(effect.when)}</p>
</div>

<style>
	.screen {
		position: relative;
		isolation: isolate;
		display: grid;
		place-items: center;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border: 1px solid var(--hairline);
		border-radius: 12px;
		background: color-mix(in oklab, var(--bg) 90%, black);
	}

	.screen.chat {
		aspect-ratio: auto;
		min-height: 9rem;
		place-items: center stretch;
		padding: 1.25rem 1.5rem;
	}

	.title,
	.sample {
		position: relative;
		z-index: 1;
		margin: 0;
		padding: 0 1.5rem;
		font-family: var(--serif);
		color: var(--fg-strong);
		text-align: center;
		text-shadow:
			0 0 3px var(--bg),
			0 0 10px var(--bg);
	}

	.title {
		font-size: clamp(1.4rem, 4vw, 2rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
	}

	.sample {
		max-width: 32rem;
		font-size: 1.1rem;
		line-height: 1.55;
	}

	.line {
		min-width: 0;
	}

	.off {
		margin: 0;
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	.replay {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		z-index: 70;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: color-mix(in oklab, var(--bg) 80%, transparent);
		color: var(--fg-dim);
		cursor: pointer;
		transition: color 0.15s;
	}

	.replay:hover {
		color: var(--fg-strong);
	}

	.replay .material-symbols-outlined {
		font-size: 1.1rem;
	}

	h3 {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0.7rem 0 0.25rem;
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.other {
		font-family: var(--ui);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	.describe,
	.when {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.when {
		margin-top: 0.3rem;
	}

	.when b {
		margin-right: 0.35rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}
</style>
