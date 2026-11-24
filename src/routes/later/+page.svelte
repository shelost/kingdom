<script lang="ts">
	import { resolve } from '$app/paths';
	import Blocks from '$lib/components/Blocks.svelte';
	import ImageStack from '$lib/components/ImageStack.svelte';
	import { buildBeats } from '$lib/beats';
	import { withRealImages } from '$lib/storyImages';
	import { byId, colorOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { wikiIdQuery } from '$lib/lifeArcView';
	import { LATER_CAST, laterEntry } from '$lib/later/entry';

	const beats = $derived(withRealImages(buildBeats(laterEntry)));
	const ko = $derived(reading.lang === 'ko');
	const cast = $derived(LATER_CAST.flatMap((id) => {
		const p = byId.get(id);
		return p ? [p] : [];
	}));
</script>

<svelte:head>
	<title>{ko ? '후삼국' : 'Later'}</title>
</svelte:head>

<article class="later">
	<header class="episode">
		<p class="year">{laterEntry.sub}</p>
		<h1>{ko ? laterEntry.ko : laterEntry.title}</h1>
		<p class="episode-ko">{ko ? laterEntry.title : laterEntry.ko}</p>
	</header>

	<ul class="cast">
		{#each cast as p (p.id)}
			<li>
				<a href={`${resolve('/wiki')}?${wikiIdQuery(p.id)}`} style:--chip={colorOf(p)}>
					{ko ? p.korean : p.name}
				</a>
			</li>
		{/each}
	</ul>

	<div class="beats">
		{#each beats as beat, bi (bi)}
			{#if beat.images.length}
				<div class="inline-art">
					<ImageStack images={beat.images} inline priority={bi === 0} />
				</div>
			{/if}
			{#if beat.blocks.length}
				<div class="text">
					<Blocks blocks={beat.blocks} year={null} sceneFrom={laterEntry.blocks} />
				</div>
			{/if}
		{/each}
	</div>
</article>

<style>
	.later {
		width: min(100%, var(--script-measure));
		margin: 0 auto;
		padding: 4.5rem 1.25rem 6rem;
	}

	.episode {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-bottom: 0.5rem;
	}

	.year {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 1.05rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-dim);
	}

	h1 {
		margin: 0.35rem 0 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(3.1rem, 6.2vw, 4.8rem);
		line-height: 0.98;
		letter-spacing: -0.09em;
		color: var(--fg-strong);
	}

	.episode-ko {
		margin: 0.35rem 0 0;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: clamp(1.15rem, 2.2vw, 1.6rem);
		font-weight: 500;
		letter-spacing: -0.03em;
		color: var(--fg-dim);
	}

	.cast {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem 0.55rem;
		margin: 1.75rem 0 2.5rem;
		padding: 0;
		list-style: none;
	}

	.cast a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.55rem 0.2rem 0.4rem;
		border-radius: var(--radius-pill);
		color: var(--fg-dim);
		font-family: var(--ui);
		font-size: 0.78rem;
		text-decoration: none;
	}

	.cast a::before {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--chip);
	}

	.cast a:hover {
		color: var(--fg-strong);
	}

	.beats {
		display: flex;
		flex-direction: column;
	}

	.inline-art {
		margin: 1.75rem 0 0.25rem;
	}

	.text {
		margin-top: 0.35rem;
	}
</style>
