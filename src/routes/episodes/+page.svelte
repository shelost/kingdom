<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onNavigate } from '$app/navigation';
	import { withViewTransition } from '$lib/viewTransition';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import RowThumb from '$lib/components/RowThumb.svelte';
	import Toc from '$lib/components/Toc.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { EP_QUERY, reading } from '$lib/reading.svelte';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import { arcLabel, chapterLabel, partLabel } from '$lib/tocTree';
	import { partId } from '$lib/story';
	import { EPISODE_TOTAL, PARTS, STORY_RANGE, type DirectoryEpisode } from '$lib/episodeDirectory';

	let ko = $derived(reading.lang === 'ko');

	/** The side TOC: open on arrival at desktop widths (Toc closes itself on a phone). */
	let tocOpen = $state(true);

	/** Opening an episode: the list sinks away and the episode floats up into its place. */
	onNavigate((navigation) => {
		const to = navigation.to?.url;
		if (to?.pathname !== resolve('/read') || !to.searchParams.has(EP_QUERY)) return;
		return withViewTransition(navigation, 'vt-episode-open');
	});

	function hrefOf(ep: DirectoryEpisode): string {
		return hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(ep.queryId)}`, page.url);
	}

	function synopsis(ep: DirectoryEpisode): string {
		return ko ? ep.synopsis.ko : ep.synopsis.en;
	}
</script>

<svelte:head>
	<title>Episodes · King for All</title>
	<meta
		name="description"
		content="Every episode of King for All, by Part, Arc and Chapter — open any one to start reading."
	/>
</svelte:head>

{#snippet heading(label: string, title?: string, korean?: string, range?: string)}
	<span class="eyebrow">{label}</span>
	<span class="head-line">
		{#if title}<span class="head-title">{title}</span>{/if}
		{#if korean}<span class="head-ko">{korean}</span>{/if}
		{#if range}<span class="head-range">{range}</span>{/if}
	</span>
{/snippet}

{#snippet row(ep: DirectoryEpisode)}
	{@const thumb = episodeThumbnail(ep.entry, ep.id)}
	{@const href = hrefOf(ep)}
	<li data-story-id={ep.id}>
		<a class="row" {href}>
			<RowThumb src={thumb?.src} sizes="(max-width: 480px) 8rem, 11rem" fallback={ep.title.charAt(0)} />
			<span class="body">
				<span class="title-line">
					<span class="num">{ep.number}</span>
					<span class="title">
						{ko && ep.ko ? ep.ko : ep.title}
						{#if ep.ko && !ko}<span class="title-ko">{ep.ko}</span>{/if}
					</span>
				</span>
				<span class="sub-line">
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
					<span class="aside">
						{#if ep.year}<span class="year">{ep.year}</span>{/if}
						<span class="dur">{ep.minutes}{ko ? '분' : ' min'}</span>
					</span>
				</span>
				{#if synopsis(ep)}<span class="synopsis">{synopsis(ep)}</span>{/if}
			</span>
		</a>
	</li>
{/snippet}

<div class="side-toc">
	<Toc bind:open={tocOpen} directory />
</div>

<main class="episodes-page" class:toc-open={tocOpen}>
	<header class="chrome">
		<SiteNavSpace />
	</header>

	<div class="column">
		<header class="intro">
			<h1>{ko ? '에피소드' : 'Episodes'}</h1>
			<p class="meta">
				<span>King for All · 삼한왕검</span>
				<span class="sep" aria-hidden="true">·</span>
				<span>{STORY_RANGE}</span>
				<span class="sep" aria-hidden="true">·</span>
				<span>{PARTS.length} {ko ? '부' : 'Parts'}</span>
				<span class="sep" aria-hidden="true">·</span>
				<span>{EPISODE_TOTAL} {ko ? '화' : 'episodes'}</span>
			</p>
		</header>

		{#each PARTS as part (part.id)}
			<section class="part" aria-labelledby={`part-${part.id}`} data-story-id={partId(part.id)}>
				<h2 id={`part-${part.id}`}>
					{@render heading(partLabel(part.label, ko), part.title, part.korean, part.range)}
				</h2>

				{#each part.arcs as arc (arc.id)}
					<section class="arc" aria-labelledby={arc.anchor} data-story-id={arc.id}>
						<h3 id={arc.anchor}>
							{@render heading(
								arcLabel(arc.number, ko),
								arc.number ? arc.title : undefined,
								arc.korean,
								arc.range
							)}
						</h3>
						{#each arc.chapters as chapter, s (chapter.anchor ?? `${arc.id}-${s}`)}
							{#if chapter.anchor}
								<h4 id={chapter.anchor}>
									{#if chapter.number}<span class="chapter-num">{chapterLabel(chapter.number, ko)}</span>{/if}
									<span class="chapter-line">
										{ko ? chapter.ko : chapter.label}
										{#if !ko && chapter.ko && chapter.ko !== chapter.label}<span class="chapter-ko"
												>{chapter.ko}</span
											>{/if}
									</span>
								</h4>
							{/if}
							<ol class="list">
								{#each chapter.episodes as ep (ep.id)}
									{@render row(ep)}
								{/each}
							</ol>
						{/each}
					</section>
				{/each}
			</section>
		{/each}
	</div>
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

	/* Desktop only, where the reader pushes its column too; phones keep the plain list. */
	.side-toc {
		display: none;
	}

	@media (min-width: 1001px) {
		.side-toc {
			display: contents;
		}

		.episodes-page {
			padding-left: 22px;
			transition: padding-left var(--toc-duration) var(--toc-ease);
		}

		.episodes-page.toc-open {
			padding-left: var(--toc-w);
		}
	}

	.chrome {
		padding: max(0.85rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) 0.5rem
			max(1rem, env(safe-area-inset-left));
	}

	/* Same measure as the script, so the directory reads like the page it opens. */
	.column {
		box-sizing: content-box;
		max-width: var(--script-measure);
		margin: 0 auto;
		padding: 0 max(1.25rem, env(safe-area-inset-right)) 0 max(1.25rem, env(safe-area-inset-left));
	}

	.intro {
		display: grid;
		gap: 0.4rem;
		padding: 2.5rem 0 0.5rem;
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

	/* —— Parts, chapters and groups —— */
	h2,
	h3,
	h4 {
		scroll-margin-top: 1.5rem;
	}

	/* TOC jumps land below the fixed site pill. */
	[data-story-id] {
		scroll-margin-top: calc(max(0.85rem, env(safe-area-inset-top)) + 3.25rem);
	}

	.part {
		margin-top: 2.75rem;
	}

	/* Part and Arc headings: the label sits above, the title line below. */
	h2,
	h3 {
		display: grid;
		gap: 0.2rem;
		margin: 0;
		font-family: var(--serif);
		font-weight: 600;
	}

	h2 {
		font-size: 1.45rem;
	}

	h3 {
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--hairline);
		font-size: 1.1rem;
	}

	.eyebrow {
		font-size: 0.85rem;
		color: var(--gold);
	}

	h2 .eyebrow {
		font-size: 0.95rem;
	}

	.head-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.65rem;
	}

	.head-title {
		color: var(--fg-strong);
	}

	.head-ko,
	.head-range {
		font-family: var(--ui);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	h2 :is(.head-ko, .head-range) {
		font-size: 0.85rem;
	}

	.head-range {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}

	.arc {
		margin-top: 2.5rem;
	}

	/* Chapter headings: the number is an eyebrow above the chapter's name, like Parts and Arcs. */
	h4 {
		display: grid;
		gap: 0.15rem;
		margin: 1.75rem 0 0.25rem;
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--fg-dim);
	}

	.chapter-num {
		font-family: var(--ui);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--gold);
	}

	.chapter-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.25rem 0.5rem;
	}

	.chapter-ko {
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	/* A breadcrumb landed here: the heading takes the gold for a beat. */
	h3:target .head-title,
	h4:target {
		animation: target-flash 2.6s var(--ease);
	}

	@keyframes target-flash {
		0%,
		45% {
			color: var(--gold);
		}
	}

	/* —— Episode rows —— */
	.list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		display: grid;
		grid-template-columns: 11rem minmax(0, 1fr);
		gap: 1.25rem;
		align-items: start;
		padding: 1.4rem 0;
		color: inherit;
		text-decoration: none;
	}

	.row:focus-visible {
		outline: none;
	}

	.body {
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
		font-size: 0.8rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.title {
		min-width: 0;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--fg-strong);
		transition: color 0.2s var(--ease);
	}

	.row:is(:hover, :focus-visible) .title {
		color: var(--gold);
	}

	.title-ko {
		margin-left: 0.45rem;
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	.sub-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.72rem;
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

	.aside {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}

	.dur {
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.synopsis {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
		font-family: var(--serif);
		font-size: 0.92rem;
		font-weight: 400;
		letter-spacing: -0.01em;
		line-height: 1.45;
		color: var(--fg-dim);
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

		.part {
			margin-top: 2rem;
		}
	}

	@media (max-width: 480px) {
		.row {
			grid-template-columns: 8rem minmax(0, 1fr);
			gap: 0.9rem;
			padding: 1.1rem 0;
		}

		.title-ko {
			display: block;
			margin: 0.1rem 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		h3:target .head-title,
		h4:target {
			animation: none;
		}

		.episodes-page {
			transition: none;
		}
	}
</style>
