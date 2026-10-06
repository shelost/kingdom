<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import TiltThumb from '$lib/components/TiltThumb.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { reading } from '$lib/reading.svelte';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import {
		EPISODE_TOTAL,
		SEASONS,
		STORY_RANGE,
		type DirectoryChapter,
		type DirectoryEpisode
	} from '$lib/episodeDirectory';

	let ko = $derived(reading.lang === 'ko');

	function hrefOf(ep: DirectoryEpisode): string {
		return hrefWithNsfw(`${resolve('/')}?ep=${encodeURIComponent(ep.queryId)}`, page.url);
	}

	function synopsis(ep: DirectoryEpisode): string {
		return ko ? ep.synopsis.ko : ep.synopsis.en;
	}

	function chapterLabel(chapter: DirectoryChapter): string {
		if (!chapter.number) return ko ? '에필로그' : 'Epilogue';
		return ko ? `제${chapter.number}장` : `Chapter ${chapter.number}`;
	}
</script>

<svelte:head>
	<title>Episodes · King for All</title>
	<meta
		name="description"
		content="Every episode of King for All, by Part and chapter — open any one to start reading."
	/>
</svelte:head>

<main class="episodes-page">
	<header class="chrome">
		<SiteNav />
	</header>

	<header class="intro">
		<h1>{ko ? '에피소드' : 'Episodes'}</h1>
		<p class="meta">
			<span>King for All · 삼한왕검</span>
			<span class="sep" aria-hidden="true">·</span>
			<span>{STORY_RANGE}</span>
			<span class="sep" aria-hidden="true">·</span>
			<span>{SEASONS.length} {ko ? '부' : 'Parts'}</span>
			<span class="sep" aria-hidden="true">·</span>
			<span>{EPISODE_TOTAL} {ko ? '편' : 'episodes'}</span>
		</p>
	</header>

	{#each SEASONS as season (season.id)}
		<section class="season" aria-labelledby={`part-${season.id}`}>
			<h2 id={`part-${season.id}`}>
				<span class="part-label">{season.label}</span>
				{#if season.title}<span class="part-title">{season.title}</span>{/if}
				{#if season.korean}<span class="part-ko">{season.korean}</span>{/if}
				{#if season.range}<span class="part-range">{season.range}</span>{/if}
			</h2>

			{#each season.chapters as chapter (chapter.id)}
				<section class="chapter" aria-labelledby={`ch-${chapter.id}`}>
					<h3 id={`ch-${chapter.id}`}>
						<span class="ch-num">{chapterLabel(chapter)}</span>
						{#if chapter.number}<span class="ch-title">{chapter.title}</span>{/if}
						{#if chapter.korean}<span class="ch-ko">{chapter.korean}</span>{/if}
						{#if chapter.range}<span class="ch-range">{chapter.range}</span>{/if}
					</h3>
					<ol class="grid">
						{#each chapter.episodes as ep (ep.id)}
							{@const thumb = episodeThumbnail(ep.entry, ep.id)}
							{@const href = hrefOf(ep)}
							<li>
								<a class="card" {href}>
									<TiltThumb
										src={thumb?.src}
										sizes="(max-width: 520px) 100vw, (max-width: 1100px) 50vw, 20rem"
										fallback={ep.title.charAt(0)}
									/>
									<span class="body">
										<span class="title-line">
											<span class="num">{ep.number}</span>
											<span class="title">
												{ko && ep.ko ? ep.ko : ep.title}
												{#if ep.ko && !ko}<span class="title-ko">{ep.ko}</span>{/if}
											</span>
										</span>
										<span class="sub-line">
											{#if ep.year}<span class="year">{ep.year}</span>{/if}
											{#each ep.tags as tag (tag.key)}
												{#if tag.flag}
													<img class="flag" src={tag.flag} alt={tag.label} title={tag.label} />
												{:else if tag.icon}
													<span class="kind" style:color={tag.color} title={ko ? tag.ko : tag.label}>
														<span class="material-symbols-outlined" aria-hidden="true">{tag.icon}</span>
														<span class="visually-hidden">{ko ? tag.ko : tag.label}</span>
													</span>
												{/if}
											{/each}
											<span class="dur">{ep.minutes}{ko ? '분' : ' min'}</span>
										</span>
										{#if synopsis(ep)}<span class="synopsis">{synopsis(ep)}</span>{/if}
										<span class="read">
											<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
											{ko ? '읽기' : 'Read'}
										</span>
									</span>
								</a>
							</li>
						{/each}
					</ol>
				</section>
			{/each}
		</section>
	{/each}
</main>

<style>
	.episodes-page {
		min-height: 100dvh;
		padding-bottom: calc(3rem + var(--tabbar-space));
		background: var(--bg);
		color: var(--fg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
	}

	.chrome {
		padding: max(0.85rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) 0.5rem
			max(1rem, env(safe-area-inset-left));
	}

	.intro,
	.season {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 max(1.25rem, 4vw);
	}

	.intro {
		display: grid;
		gap: 0.4rem;
		padding-top: 2.5rem;
		padding-bottom: 1rem;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 0;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--fg-dim);
	}

	.sep {
		color: var(--fg-faint);
	}

	/* —— Parts and chapters —— */
	.season {
		margin-top: 2.75rem;
	}

	h2 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.7rem;
		margin: 0;
		font-family: var(--serif);
		font-size: 1.45rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.part-label {
		font-family: var(--ui);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--gold);
	}

	.part-ko,
	.part-range {
		font-family: var(--ui);
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	.part-range,
	.ch-range {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}

	.chapter {
		margin-top: 1.6rem;
	}

	h3 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.6rem;
		margin: 0 0 1rem;
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--hairline);
		font-size: 1rem;
		font-weight: 600;
	}

	.ch-num {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--gold);
	}

	.ch-title {
		color: var(--fg-strong);
	}

	.ch-ko,
	.ch-range {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	/* —— Episode cards —— */
	/* Auto-fill columns no narrower than 13rem; the max() floor keeps it at
	   four columns however wide the page gets. */
	.grid {
		--col-gap: 1.25rem;
		display: grid;
		grid-template-columns: repeat(
			auto-fill,
			minmax(max(13rem, calc((100% - 3 * var(--col-gap)) / 4)), 1fr)
		);
		gap: 1.5rem var(--col-gap);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.grid > li {
		display: flex;
	}

	.card {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		color: inherit;
		text-decoration: none;
	}

	.card:focus-visible {
		outline: none;
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
		min-width: 0;
	}

	.title-line {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
	}

	.num {
		flex: 0 0 auto;
		font-size: 0.85rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.title {
		min-width: 0;
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--fg-strong);
	}

	.title-ko {
		margin-left: 0.45rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	.sub-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: var(--fg-faint);
	}

	.year {
		padding: 0.05rem 0.35rem;
		border: 1px solid color-mix(in srgb, var(--fg) 25%, transparent);
		border-radius: 3px;
		font-variant-numeric: tabular-nums;
	}

	.flag {
		width: auto;
		height: 0.8rem;
		border-radius: 2px;
	}

	.kind {
		position: relative;
		display: inline-flex;
	}

	.kind .material-symbols-outlined {
		font-size: 0.95rem;
	}

	.dur {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.synopsis {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-size: 0.85rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.read {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: auto;
		padding: 0.4rem 0.9rem 0.4rem 0.7rem;
		border-radius: var(--radius);
		background: var(--highlight);
		color: var(--on-highlight);
		font-size: 0.82rem;
		font-weight: 600;
		transition:
			transform 0.25s var(--ease),
			opacity 0.25s var(--ease);
	}

	.read .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.card:hover .read {
		opacity: 0.86;
	}

	.card:active .read {
		transform: scale(0.97);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (max-width: 720px) {
		.intro {
			padding-top: 1.5rem;
		}

		.season {
			margin-top: 2rem;
		}

		.title-ko {
			display: block;
			margin: 0.15rem 0 0;
		}
	}
</style>
