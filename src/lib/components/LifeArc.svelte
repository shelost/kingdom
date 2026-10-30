<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { LifeArcStep } from '$lib/lifeArcs';
	import { episodeQueryForTitle, stillsForArc } from '$lib/lifeArcView';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { EP_QUERY, reading } from '$lib/reading.svelte';
	import { storyImg } from '$lib/img';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import type { WikiScene } from '$lib/wikiScenes';

	let { personId, steps }: { personId: string; steps: LifeArcStep[] } = $props();

	let ko = $derived(reading.lang === 'ko');
	let beats = $derived(stillsForArc(personId, steps));
	let gallery = $derived(beats.map((b) => b.scene).filter((s): s is WikiScene => s != null));

	function readHref(title: string | undefined): string | null {
		const q = episodeQueryForTitle(title);
		if (!q) return null;
		return hrefWithNsfw(`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(q)}`, page.url);
	}

	function openStill(scene: WikiScene, from?: EventTarget | null) {
		const index = Math.max(
			0,
			gallery.findIndex((s) => s.id === scene.id)
		);
		openLightbox(
			gallery.map((s) => ({
				src: s.art,
				alt: s.alt,
				title: s.title,
				caption: s.caption,
				nsfw: s.nsfw,
				episodeId: s.episodeId
			})),
			index,
			from
		);
	}

	function n(i: number) {
		return String(i + 1).padStart(2, '0');
	}
</script>

<ol class="life-arc">
	{#each beats as beat, i (beat.step.title + (beat.step.episode ?? '') + i)}
		<li class="beat">
			<p class="num" aria-hidden="true">{n(i)}</p>
			<div class="copy">
				<h3>{ko ? beat.step.titleKo : beat.step.title}</h3>
				<p class="summary">{ko ? beat.step.summaryKo : beat.step.summary}</p>
			</div>
			{#if beat.scene}
				<button
					type="button"
					class="still"
					onclick={(e) => openStill(beat.scene!, e.currentTarget)}
					aria-label={beat.scene.alt || beat.scene.title}
				>
					<img
						{...storyImg(beat.scene.art, {
							kind: 'cue',
							alt: '',
							sizes: '(min-width: 56rem) 28vw, 90vw',
							widths: [640, 828, 1200]
						})}
					/>
				</button>
			{/if}
			{#if beat.step.turn && steps[i + 1]}
				<p class="turn">
					<span class="event">{ko ? (beat.step.turnKo ?? beat.step.turn) : beat.step.turn}</span>
					{#if beat.step.episode}
						{@const href = readHref(beat.step.episode)}
						{#if href}
							<a class="ep" {href}>{beat.step.episode}</a>
						{:else}
							<span class="ep dead">{beat.step.episode}</span>
						{/if}
					{/if}
				</p>
			{/if}
		</li>
	{/each}
</ol>

<style>
	.life-arc {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: grid;
		gap: 0;
	}

	.beat {
		position: relative;
		display: grid;
		gap: 0.55rem;
		padding: 0 0 1.45rem 1.15rem;
		border-left: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
	}

	.beat:last-child {
		padding-bottom: 0;
		border-left-color: transparent;
	}

	.num {
		position: absolute;
		left: 0;
		top: 0.15rem;
		translate: calc(-50% - 0.5px) 0;
		margin: 0;
		width: 1.35rem;
		height: 1.35rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: var(--bg, #fff);
		border: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
		font-family: var(--ui);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.copy {
		min-width: 0;
	}

	h3 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.25;
		color: var(--fg-strong);
	}

	.summary {
		margin: 0.28rem 0 0;
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.still {
		display: block;
		width: 100%;
		padding: 0;
		margin: 0.15rem 0 0;
		border: none;
		border-radius: 2px;
		background: none;
		line-height: 0;
		cursor: zoom-in;
		overflow: hidden;
	}

	.still img {
		display: block;
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		object-position: center;
	}

	.turn {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.55rem;
		margin: 0;
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--fg-dim);
	}

	.event {
		font-style: italic;
	}

	.ep {
		color: var(--k);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--k) 35%, transparent);
	}

	.ep:hover {
		border-bottom-color: var(--k);
	}

	.ep.dead {
		color: var(--fg-faint);
		border-bottom: none;
	}
</style>
