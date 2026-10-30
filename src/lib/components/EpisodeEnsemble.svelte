<script lang="ts">
	/**
	 * Movie-poster ensemble under the episode thumbnail: painted 3:4 key art
	 * when one exists, otherwise the billed cast on a poster ground. Title and
	 * logline sit under the art (never lettered into the painting).
	 */
	import type { Entry } from '$lib/story';
	import { episodeHeading, episodeLogline, entryCast } from '$lib/entryHead';
	import { episodeEnsembleSrc } from '$lib/posters.svelte';
	import { isWarEntry } from '$lib/episodeKinds';
	import { storyImg } from '$lib/img';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import EnsemblePoster, { type PosterMood } from '$lib/components/EnsemblePoster.svelte';

	let {
		entry,
		eid,
		year = null,
		ko = false
	}: {
		entry: Entry;
		eid: string;
		year?: number | null;
		ko?: boolean;
	} = $props();

	let art = $derived(episodeEnsembleSrc(eid));
	let cast = $derived(entryCast(entry, year, 9));
	let title = $derived(episodeHeading(entry, ko));
	let plot = $derived(episodeLogline(entry, ko));
	let mood = $derived<PosterMood>(
		isWarEntry(entry)
			? 'war'
			: (entry.kinds ?? []).some((k) => k === 'myth' || k === 'founding')
				? 'folk'
				: 'court'
	);

	function open(host: HTMLElement) {
		if (!art) return;
		openLightbox(
			[{ src: art, alt: title, title, caption: plot || title, nsfw: false, episodeId: eid }],
			0,
			host
		);
	}
</script>

{#if art || cast.length}
	<figure class="ensemble">
		{#if art}
			<button
				type="button"
				class="art"
				onclick={(e) => open(e.currentTarget)}
				aria-label={`Open ${title} poster`}
			>
				<img {...storyImg(art, { kind: 'hero', sizes: '(max-width: 820px) 70vw, 22rem', alt: title })} />
			</button>
		{:else}
			<EnsemblePoster people={cast} {mood} />
		{/if}
		<figcaption class="card">
			<p class="eyebrow">{ko ? '에피소드' : 'Episode'}{#if year} · {year}{/if}</p>
			<h3 class="title">{title}</h3>
			{#if plot}
				<p class="plot">{plot}</p>
			{/if}
			{#if cast.length}
				<ul class="names">
					{#each cast as person (person.id)}
						<li>{(ko && person.ko) || person.name}</li>
					{/each}
				</ul>
			{/if}
		</figcaption>
	</figure>
{/if}

<style>
	.ensemble {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		margin: 1.75rem 0 0;
		width: 100%;
	}

	.art {
		display: block;
		width: min(22rem, 100%);
		aspect-ratio: 3 / 4;
		padding: 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		overflow: hidden;
		cursor: zoom-in;
		box-shadow: 0 22px 48px rgba(0, 0, 0, 0.38);
	}

	.art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ensemble :global(.poster) {
		--poster: min(22rem, 100%);
	}

	.card {
		width: min(42rem, 100%);
		text-align: center;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		font: 500 0.68rem/1 var(--ui);
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-dim);
	}

	.title {
		margin: 0 0 0.45rem;
		font-family: var(--serif);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.plot {
		margin: 0 auto;
		max-width: 36rem;
		font-family: var(--serif);
		font-size: 1.02rem;
		line-height: 1.45;
		color: var(--fg);
	}

	.names {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.2rem 0.85rem;
		margin: 0.85rem 0 0;
		padding: 0;
		list-style: none;
		font: 500 0.78rem/1.3 var(--ui);
		letter-spacing: 0.04em;
		color: var(--fg-dim);
	}

	.names li + li::before {
		content: '·';
		margin-right: 0.85rem;
		opacity: 0.5;
	}

	@media (max-width: 820px) {
		.ensemble {
			margin-top: 1.25rem;
		}
	}
</style>
