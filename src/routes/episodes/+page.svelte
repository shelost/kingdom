<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onNavigate } from '$app/navigation';
	import { MediaQuery } from 'svelte/reactivity';
	import { withViewTransition } from '$lib/viewTransition';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import RowThumb from '$lib/components/RowThumb.svelte';
	import EnsemblePoster, { type PosterMood } from '$lib/components/EnsemblePoster.svelte';
	import Toc from '$lib/components/Toc.svelte';
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { volumeOf } from '$lib/books';
	import { entryCast } from '$lib/entryHead';
	import { isWarEntry } from '$lib/episodeKinds';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { EP_QUERY, reading } from '$lib/reading.svelte';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import { episodePosterSrc, episodeThumbSrc, posterSrc } from '$lib/posters.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { hasTitleCard, titleLogoSrc } from '$lib/titleLogos';
	import { arcLabelAt, chapterLabel, partLabel } from '$lib/tocTree';
	import { partId } from '$lib/story';
	import {
		EPISODE_TOTAL,
		PARTS,
		STORY_RANGE,
		type DirectoryEpisode
	} from '$lib/episodeDirectory';
	import {
		groupStoriesByArc,
		groupStoriesByCountry,
		type StoryGroupMode
	} from '$lib/storyGroups';

	let ko = $derived(reading.lang === 'ko');

	const LAYOUT_KEY = 'kingdom:episodes-layout';
	const STORIES_KEY = 'kingdom:episodes-stories';
	const GROUP_KEY = 'kingdom:episodes-group';
	type Layout = 'list' | 'grid';
	const desktop = new MediaQuery('min-width: 1001px');

	function readLayout(): Layout {
		if (!browser) return 'list';
		const query = page.url.searchParams.get('layout');
		if (query === 'grid' || query === 'list') return query;
		const stored = localStorage.getItem(LAYOUT_KEY);
		return stored === 'grid' || stored === 'list' ? stored : 'list';
	}

	function readStories(): boolean {
		const query = page.url.searchParams.get('stories');
		if (query === '1') return true;
		if (query === '0') return false;
		if (!browser) return false;
		return localStorage.getItem(STORIES_KEY) === '1';
	}

	function readGroup(): StoryGroupMode {
		const query = page.url.searchParams.get('group');
		if (query === 'arc' || query === 'country' || query === 'default') return query;
		if (!browser) return 'default';
		const stored = localStorage.getItem(GROUP_KEY);
		return stored === 'arc' || stored === 'country' ? stored : 'default';
	}

	let layout = $state<Layout>(readLayout());
	let stories = $state(readStories());
	let groupMode = $state<StoryGroupMode>(readGroup());
	let grid = $derived(stories || (layout === 'grid' && desktop.current));

	function writeUrl() {
		if (!browser) return;
		const url = new URL(page.url);
		if (layout === 'list') url.searchParams.delete('layout');
		else url.searchParams.set('layout', layout);
		if (stories) url.searchParams.set('stories', '1');
		else url.searchParams.delete('stories');
		if (groupMode === 'default') url.searchParams.delete('group');
		else url.searchParams.set('group', groupMode);
		history.replaceState(history.state, '', url);
	}

	function setLayout(next: Layout) {
		layout = next;
		if (browser) localStorage.setItem(LAYOUT_KEY, next);
		writeUrl();
	}

	function setStories(next: boolean) {
		stories = next;
		if (next) layout = 'grid';
		if (browser) {
			localStorage.setItem(STORIES_KEY, next ? '1' : '0');
			if (next) localStorage.setItem(LAYOUT_KEY, 'grid');
		}
		writeUrl();
	}

	function setGroup(next: StoryGroupMode) {
		groupMode = next;
		if (browser) {
			if (next === 'default') localStorage.removeItem(GROUP_KEY);
			else localStorage.setItem(GROUP_KEY, next);
		}
		writeUrl();
	}

	function logoOf(ep: DirectoryEpisode): string | null {
		return titleLogoSrc(ep.title, ko) ?? titleLogoSrc(ep.title, !ko);
	}

	let shownParts = $derived(PARTS);

	const storyEpisodes = PARTS.flatMap((part) =>
		part.arcs.flatMap((arc) => arc.chapters.flatMap((chapter) => chapter.episodes))
	).filter((ep) => hasTitleCard(ep.title));

	const STORY_TOTAL = storyEpisodes.length;

	let storyGroups = $derived(
		groupMode === 'arc'
			? groupStoriesByArc(storyEpisodes)
			: groupMode === 'country'
				? groupStoriesByCountry(storyEpisodes)
				: null
	);

	function yearNum(ep: DirectoryEpisode): number | null {
		const n = Number.parseInt(ep.year, 10);
		return Number.isFinite(n) ? n : null;
	}

	function posterMood(ep: DirectoryEpisode): PosterMood {
		if (isWarEntry(ep.entry)) return 'war';
		return (ep.entry.kinds ?? []).some((k) => k === 'myth' || k === 'founding') ? 'folk' : 'court';
	}

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
	<title>Chapters · King for All</title>
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

{#snippet titleBlock(ep: DirectoryEpisode)}
	{@const logo = logoOf(ep)}
	{@const heading = ko && ep.ko ? ep.ko : ep.title}
	<span class={['title-line', { worded: !!logo }]}>
		<span class="num">{ep.number}</span>
		{#if logo}
			<span class="title-mark">
				<img class="title-logo" src={staticAsset(logo) ?? logo} alt="" />
				<span class="visually-hidden">{heading}</span>
				{#if ep.ko && !ko}<span class="title-ko">{ep.ko}</span>{/if}
			</span>
		{:else}
			<span class="title">
				{heading}
				{#if ep.ko && !ko}<span class="title-ko">{ep.ko}</span>{/if}
			</span>
		{/if}
	</span>
{/snippet}

{#snippet row(ep: DirectoryEpisode)}
	{@const dedicated = episodeThumbSrc(ep.id)}
	{@const poster = episodePosterSrc(ep.id)}
	{@const cue = dedicated || poster ? null : episodeThumbnail(ep.entry, ep.id)}
	{@const src = dedicated ?? poster ?? cue?.src}
	{@const portrait = !dedicated && !!poster}
	{@const href = hrefOf(ep)}
	<li data-story-id={ep.id}>
		<a class={['row', { portrait }]} {href}>
			<RowThumb
				{src}
				{portrait}
				kind={portrait ? 'hero' : 'cue'}
				sizes={portrait ? '(max-width: 480px) 6.2rem, 7.6rem' : '(max-width: 480px) 8rem, 11rem'}
				fallback={ep.title.charAt(0)}
			/>
			<span class="body">
				{@render titleBlock(ep)}
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

{#snippet card(ep: DirectoryEpisode)}
	{@const dedicated = episodeThumbSrc(ep.id)}
	{@const poster = episodePosterSrc(ep.id)}
	{@const cue = dedicated || poster ? null : episodeThumbnail(ep.entry, ep.id)}
	{@const src = dedicated ?? poster ?? cue?.src}
	{@const cast = src ? [] : entryCast(ep.entry, yearNum(ep), 7)}
	{@const href = hrefOf(ep)}
	<li data-story-id={ep.id}>
		<a class="card" {href}>
			{#if src}
				<RowThumb
					{src}
					portrait
					kind={poster && !dedicated ? 'hero' : 'cue'}
					sizes="(max-width: 1280px) 28vw, 18rem"
					fallback={ep.title.charAt(0)}
				/>
			{:else if cast.length}
				<EnsemblePoster people={cast} mood={posterMood(ep)} />
			{:else}
				<RowThumb
					portrait
					sizes="(max-width: 1280px) 28vw, 18rem"
					fallback={ep.title.charAt(0)}
				/>
			{/if}
			<span class="body">
				{@render titleBlock(ep)}
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

<main class={['episodes-page', { 'toc-open': tocOpen, 'grid-layout': grid, 'stories-only': stories }]}>
	<header class="chrome">
		<SiteNavSpace />
	</header>

	<div class="column">
		<header class="intro">
			<div class="intro-copy">
				<h1>{ko ? '편' : 'Chapters'}</h1>
				<p class="meta">
					<span>King for All · 삼한왕검</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{STORY_RANGE}</span>
					<span class="sep" aria-hidden="true">·</span>
					<span>{PARTS.length} {ko ? '부' : 'Parts'}</span>
					<span class="sep" aria-hidden="true">·</span>
					{#if stories}
						<span>{STORY_TOTAL} {ko ? '이야기' : 'stories'}</span>
					{:else}
						<span>{EPISODE_TOTAL} {ko ? '화' : 'episodes'}</span>
					{/if}
				</p>
			</div>
			<div class="view-tools">
				{#if !stories}
					<div class="layout-toggle" role="group" aria-label={ko ? '보기' : 'Layout'}>
						<button
							type="button"
							class={['chip', { on: layout === 'list' }]}
							onclick={() => setLayout('list')}
						>
							<span class="material-symbols-outlined" aria-hidden="true">view_agenda</span>
							{ko ? '목록' : 'List'}
						</button>
						<button
							type="button"
							class={['chip', { on: layout === 'grid' }]}
							onclick={() => setLayout('grid')}
						>
							<span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
							{ko ? '격자' : 'Grid'}
						</button>
					</div>
				{/if}
				<div class="filter-toggle" role="group" aria-label={ko ? '필터' : 'Filter'}>
					<button
						type="button"
						class={['chip', { on: stories }]}
						aria-pressed={stories}
						onclick={() => setStories(!stories)}
					>
						<span class="material-symbols-outlined" aria-hidden="true">auto_stories</span>
						{ko ? '이야기' : 'Stories'}
					</button>
				</div>
				{#if stories}
					<div class="group-toggle" role="group" aria-label={ko ? '묶기' : 'Group'}>
						<button
							type="button"
							class={['chip', { on: groupMode === 'default' }]}
							aria-pressed={groupMode === 'default'}
							onclick={() => setGroup('default')}
						>
							<span class="material-symbols-outlined" aria-hidden="true">grid_view</span>
							{ko ? '전체' : 'All'}
						</button>
						<button
							type="button"
							class={['chip', { on: groupMode === 'arc' }]}
							aria-pressed={groupMode === 'arc'}
							onclick={() => setGroup('arc')}
						>
							<span class="material-symbols-outlined" aria-hidden="true">account_tree</span>
							{ko ? '이야기 묶음' : 'Arc'}
						</button>
						<button
							type="button"
							class={['chip', { on: groupMode === 'country' }]}
							aria-pressed={groupMode === 'country'}
							onclick={() => setGroup('country')}
						>
							<span class="material-symbols-outlined" aria-hidden="true">public</span>
							{ko ? '나라' : 'Country'}
						</button>
					</div>
				{/if}
			</div>
		</header>

		{#if stories}
			{#if storyGroups}
				{#each storyGroups as group (group.id)}
					<section class="story-group" aria-labelledby={`story-group-${group.id}`}>
						<h2 id={`story-group-${group.id}`}>
							{@render heading(
								groupMode === 'country' ? (ko ? '나라' : 'Country') : ko ? '이야기 묶음' : 'Arc',
								ko ? group.ko : group.label,
								ko ? group.label : group.ko
							)}
						</h2>
						<ol class="list stories-grid">
							{#each group.episodes as ep (ep.id)}
								{@render card(ep)}
							{/each}
						</ol>
					</section>
				{/each}
			{:else}
				<ol class="list stories-grid">
					{#each storyEpisodes as ep (ep.id)}
						{@render card(ep)}
					{/each}
				</ol>
			{/if}
		{:else}
		{#each shownParts as part (part.id)}
			<section class="part" aria-labelledby={`part-${part.id}`} data-story-id={partId(part.id)}>
				<h2 id={`part-${part.id}`}>
					{@render heading(
						partLabel(part.label, ko),
						ko && part.korean ? part.korean : part.title,
						ko && part.korean ? part.title : part.korean,
						part.range
					)}
				</h2>

				{#each part.arcs as arc (arc.id)}
					{@const poster = posterSrc(arc.id)}
					{@const boxed = arc.chapters.flatMap((chapter) => {
						const next = chapter.anchor ? volumeOf(chapter.anchor) : undefined;
						return next ? [next] : [];
					})}
					<section class="arc" aria-labelledby={arc.anchor} data-story-id={arc.id}>
						<div class="arc-head">
							{#if poster}
								<VolumePreview size="arc" cover={poster} title={arc.title} volumes={boxed} />
							{/if}
							<h3 id={arc.anchor}>
								{@render heading(
									arcLabelAt(arc.index, ko),
									arc.number ? arc.title : undefined,
									arc.korean,
									arc.range
								)}
							</h3>
						</div>
						{#each arc.chapters as chapter, s (chapter.anchor ?? `${arc.id}-${s}`)}
							{#if chapter.anchor}
								{@const volume = volumeOf(chapter.anchor)}
								<section class="volume" aria-labelledby={chapter.anchor}>
									<div class="chapter-head">
										{#if volume}
											<VolumePreview {volume} size="chapter" />
										{/if}
										<h4 id={chapter.anchor}>
											{#if chapter.number}<span class="chapter-num">{chapterLabel(chapter.number, ko)}</span>{/if}
											<span class="chapter-line">
												{ko ? chapter.ko : chapter.label}
												{#if !ko && chapter.ko && chapter.ko !== chapter.label}<span class="chapter-ko"
														>{chapter.ko}</span
													>{/if}
											</span>
										</h4>
									</div>
									<ol class="list">
										{#each chapter.episodes as ep (ep.id)}
											{#if grid}
												{@render card(ep)}
											{:else}
												{@render row(ep)}
											{/if}
										{/each}
									</ol>
								</section>
							{:else}
								<ol class="list">
									{#each chapter.episodes as ep (ep.id)}
										{#if grid}
											{@render card(ep)}
										{:else}
											{@render row(ep)}
										{/if}
									{/each}
								</ol>
							{/if}
						{/each}
					</section>
				{/each}
			</section>
		{/each}
		{/if}
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
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		padding: 3rem 0 2rem;
	}

	.intro-copy {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
	}

	.view-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.layout-toggle,
	.filter-toggle,
	.group-toggle {
		display: inline-flex;
		gap: 0.35rem;
		padding: 0.22rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.story-group {
		margin-top: 3.5rem;
	}

	.story-group:first-of-type {
		margin-top: 0;
	}

	.story-group h2 {
		margin-bottom: 1.5rem;
	}

	.layout-toggle {
		display: none;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0;
		padding: 0.38rem 0.72rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--fg-dim);
		font: 600 0.72rem/1 var(--ui);
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	.chip .material-symbols-outlined {
		font-size: 1rem;
	}

	.chip.on {
		background: color-mix(in srgb, var(--fg) 10%, var(--bg));
		color: var(--fg-strong);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 12%, transparent);
	}

	.chip:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2.15rem, 5vw, 2.85rem);
		font-weight: 600;
		line-height: 1.02;
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
		margin-top: 5.5rem;
	}

	/* Part / Arc / Chapter: eyebrow in Inter, title in serif, each step a clear jump. */
	h2,
	h3 {
		display: grid;
		gap: 0.28rem;
		margin: 0;
		font-family: var(--serif);
		font-weight: 600;
		line-height: 1.08;
	}

	h2 {
		font-size: 1rem;
		margin-bottom: 2.5rem;
	}

	h3 {
		font-size: 1rem;
	}

	.eyebrow {
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	h2 .eyebrow {
		font-size: 0.74rem;
	}

	.head-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.28rem 0.7rem;
	}

	.head-title {
		color: var(--fg-strong);
		letter-spacing: var(--tracking-display);
	}

	h2 .head-title {
		font-size: clamp(1.85rem, 3.4vw, 2.2rem);
	}

	h3 .head-title {
		font-size: clamp(1.4rem, 2.6vw, 1.7rem);
	}

	.head-ko,
	.head-range {
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-faint);
	}

	h2 :is(.head-ko, .head-range) {
		font-size: 0.88rem;
	}

	.head-range {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}

	.arc {
		margin-top: 4.25rem;
		padding-top: 0.75rem;
	}

	.arc-head,
	.chapter-head {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 1.15rem 1.85rem;
		overflow: visible;
	}

	.arc-head {
		padding-bottom: 1.75rem;
		border-bottom: 1px solid var(--hairline);
	}

	.chapter-head {
		margin: 3.25rem 0 0.85rem;
	}

	.volume {
		margin: 0;
		padding: 0;
		border: 0;
		background: none;
	}

	/* Chapter headings: the number is an eyebrow above the chapter's name, like Parts and Arcs. */
	h4 {
		display: grid;
		gap: 0.22rem;
		margin: 0;
		font-family: var(--serif);
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.1;
		color: var(--fg-strong);
	}

	.chapter-num {
		font-family: var(--ui);
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.chapter-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.28rem 0.55rem;
		font-size: clamp(1.18rem, 2vw, 1.32rem);
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.chapter-ko {
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
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

	.list > li,
	.card,
	.row {
		min-width: 0;
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

	.row.portrait {
		grid-template-columns: 7.6rem minmax(0, 1fr);
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
		font-size: 1.02rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: var(--tracking-display);
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
		font-family: var(--sans);
		font-size: 0.9rem;
		font-weight: 400;
		letter-spacing: var(--tracking-body);
		line-height: 1.5;
		color: var(--fg-dim);
		transition: color 0.25s var(--ease);
	}

	.row:is(:hover, :focus-visible) .synopsis {
		color: var(--fg);
	}

	.card {
		display: grid;
		grid-template-columns: minmax(6.4rem, 36%) minmax(0, 1fr);
		gap: 0.7rem 0.9rem;
		align-items: start;
		color: inherit;
		text-decoration: none;
	}

	.card:focus-visible {
		outline: none;
	}

	.card :global(.thumb),
	.card :global(.poster) {
		width: 100%;
		--poster: 100%;
	}

	.card .title {
		font-size: 1.02rem;
	}

	.card .synopsis {
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}

	.card .aside {
		margin-left: 0;
	}

	.card:is(:hover, :focus-visible) .title {
		color: var(--gold);
	}

	.card:is(:hover, :focus-visible) .synopsis {
		color: var(--fg);
	}

	.title-line.worded {
		align-items: center;
	}

	.title-mark {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.12rem;
		min-width: 0;
	}

	.title-logo {
		display: block;
		width: auto;
		max-width: min(100%, 22rem);
		max-height: 4.4rem;
		height: auto;
		object-fit: contain;
		object-position: left center;
		filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.55));
	}

	.card .title-logo {
		max-width: 100%;
		max-height: 6.4rem;
	}

	.stories-only .title-logo {
		max-height: 6.2rem;
	}

	.stories-only .card .title-logo {
		max-width: 100%;
		max-height: 9.2rem;
	}

	.stories-only .list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem 1.1rem;
	}

	@media (min-width: 720px) {
		.stories-only .list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.85rem 1.35rem;
		}
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (min-width: 1001px) {
		.layout-toggle {
			display: inline-flex;
		}

		.grid-layout .column {
			max-width: 72rem;
		}

		.grid-layout .volume {
			margin-top: 2.75rem;
			padding: 1.55rem 1.4rem 1.7rem;
			border: 1px solid var(--hairline);
			border-radius: 20px;
			background: color-mix(in srgb, var(--fg) 3.5%, var(--bg));
		}

		.grid-layout .arc > .volume:first-of-type {
			margin-top: 1.75rem;
		}

		.grid-layout .chapter-head {
			margin: 0 0 1.35rem;
		}

		.grid-layout .list {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.85rem 1.25rem;
		}

		.stories-only.grid-layout .column {
			max-width: 80rem;
		}

		.stories-only.grid-layout .list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 2.2rem 1.6rem;
		}

		.stories-only.grid-layout .card {
			grid-template-columns: minmax(7.2rem, 32%) minmax(0, 1fr);
			gap: 0.85rem 1.1rem;
			align-items: center;
		}

		.stories-only.grid-layout .card .title-line.worded {
			align-items: center;
		}
	}

	@media (max-width: 720px) {
		.intro {
			padding-top: 1.5rem;
		}

		.part {
			margin-top: 3.5rem;
		}

		.arc {
			margin-top: 2.75rem;
		}

		.chapter-head {
			margin: 2.25rem 0 0.6rem;
		}

		.arc-head,
		.chapter-head {
			gap: 0.85rem 1.15rem;
		}
	}

	@media (max-width: 480px) {
		.row {
			grid-template-columns: 8rem minmax(0, 1fr);
			gap: 0.9rem;
			padding: 1.1rem 0;
		}

		.row.portrait {
			grid-template-columns: 6.2rem minmax(0, 1fr);
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
