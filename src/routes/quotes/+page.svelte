<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { reading } from '$lib/reading.svelte';
	import { byId, nameOf, koreanOf, avatarOf, colorOf, isPlaceholderArt } from '$lib/people';
	import { READ_PATH } from '$lib/siteLinks';
	import {
		ICONIC_QUOTES,
		RECORD_QUOTES,
		quoteSearchText,
		type QuoteKind,
		type StoryQuote
	} from '$lib/quotes';
	import { ensureLineStars, isLineStarred, lineStars, toggleLineStar } from '$lib/lineStarsUi.svelte';
	import { lineStarId, type StarredLine } from '$lib/lineStars';

	type Tab = 'all' | 'iconic' | 'record' | 'starred';

	let tab = $state<Tab>('all');
	let query = $state('');
	let ko = $derived(reading.lang === 'ko');

	function applyHash() {
		const h = window.location.hash.replace('#', '');
		if (h === 'all' || h === 'iconic' || h === 'record' || h === 'starred') tab = h;
	}

	function goTab(next: Tab) {
		tab = next;
		if (typeof history !== 'undefined') history.replaceState(null, '', '#' + next);
	}

	onMount(() => {
		void ensureLineStars();
		applyHash();
		window.addEventListener('hashchange', applyHash);
		return () => window.removeEventListener('hashchange', applyHash);
	});

	let q = $derived(query.trim().toLowerCase());

	let starredAsQuotes = $derived<StoryQuote[]>(
		lineStars.lines.map((line) => ({
			id: line.id,
			kind: 'iconic' as QuoteKind,
			en: line.en,
			ko: line.ko,
			person: line.person,
			episodeId: line.episodeId,
			entryTitle: line.entryTitle
		}))
	);

	function matches(item: StoryQuote): boolean {
		return !q || quoteSearchText(item).includes(q);
	}

	let iconic = $derived(ICONIC_QUOTES.filter(matches));
	let record = $derived(RECORD_QUOTES.filter(matches));
	let starred = $derived(starredAsQuotes.filter(matches));

	let sections = $derived(
		(
			[
				tab === 'all' || tab === 'iconic'
					? { id: 'iconic', title: ko ? '명대사' : 'Iconic', items: iconic }
					: null,
				tab === 'all' || tab === 'record'
					? { id: 'record', title: ko ? '사료' : 'From the record', items: record }
					: null,
				tab === 'all' || tab === 'starred'
					? { id: 'starred', title: ko ? '별표' : 'Starred', items: starred }
					: null
			] as const
		).filter((s): s is NonNullable<typeof s> => !!s)
	);

	function who(item: StoryQuote): string {
		if (!item.person) return item.source ?? '';
		const p = byId.get(item.person);
		if (!p) return item.person;
		return (ko ? koreanOf(p) : nameOf(p)) || p.name;
	}

	function starFromCanon(item: StoryQuote) {
		const episodeId = item.episodeId ?? '';
		const line: StarredLine = {
			id: lineStarId(episodeId, item.en),
			episodeId,
			entryTitle: item.entryTitle ?? '',
			...(item.person ? { person: item.person } : {}),
			en: item.en,
			...(item.ko ? { ko: item.ko } : {}),
			createdAt: new Date().toISOString()
		};
		toggleLineStar(line);
	}

	function starredId(item: StoryQuote): string {
		return item.id.startsWith('ln-') ? item.id : lineStarId(item.episodeId ?? '', item.en);
	}

	function episodeHref(id: string): string {
		return resolve(READ_PATH) + '?ep=' + id;
	}
</script>

<svelte:head>
	<title>{ko ? '명대사' : 'Quotes'} · King for All</title>
	<meta
		name="description"
		content={ko
			? '이야기의 명대사, 사료의 한 줄, 읽으며 별표한 구절.'
			: 'Iconic lines, the historical record, and the passages you star while reading.'}
	/>
</svelte:head>

<main class="quotes">
	<SiteNavSpace />

	<article class="column">
		<h1>{ko ? '명대사' : 'Quotes'}</h1>
		<p class="lede">
			{ko
				? '책에 남는 말. 사료의 한 줄. 읽다 별표한 구절은 이 페이지에 모인다.'
				: 'The lines the book keeps. The record’s own words. Star a highlight while you read, and it lands here.'}
		</p>

		<div class="toolbar">
			<div class="tabs" role="tablist">
				<button type="button" role="tab" aria-selected={tab === 'all'} onclick={() => goTab('all')}>
					{ko ? '전체' : 'All'}
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={tab === 'iconic'}
					onclick={() => goTab('iconic')}
				>
					{ko ? '명대사' : 'Iconic'}
					<small>{ICONIC_QUOTES.length}</small>
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={tab === 'record'}
					onclick={() => goTab('record')}
				>
					{ko ? '사료' : 'Record'}
					<small>{RECORD_QUOTES.length}</small>
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={tab === 'starred'}
					onclick={() => goTab('starred')}
				>
					{ko ? '별표' : 'Starred'}
					<small>{lineStars.lines.length}</small>
				</button>
			</div>
			<input
				type="search"
				bind:value={query}
				placeholder={ko ? '검색' : 'Search'}
				aria-label={ko ? '명대사 검색' : 'Search quotes'}
			/>
		</div>

		{#each sections as section (section.id)}
			<section id={section.id}>
				<h2>{section.title} <small>{section.items.length}</small></h2>
				{#if !section.items.length}
					<p class="empty">
						{section.id === 'starred'
							? ko
								? '읽는 중에 글을 끌어 별표를 누르면 여기 쌓인다.'
								: 'Highlight a line while you read and press Star. It will wait here.'
							: ko
								? '맞는 구절이 없다.'
								: 'Nothing matches.'}
					</p>
				{:else}
					<ul>
						{#each section.items as item (item.id)}
							{@const p = item.person ? byId.get(item.person) : undefined}
							{@const on = isLineStarred(starredId(item))}
							<li style:--chip={p ? colorOf(p) : 'var(--fg-strong)'}>
								<blockquote>
									<p class="en">“{item.en}”</p>
									{#if item.ko}<p class="ko" lang="ko">{item.ko}</p>{/if}
									{#if item.hanja}<p class="hanja">{item.hanja}</p>{/if}
								</blockquote>
								<footer>
									{#if p}
										<a class="who" href={resolve(`/wiki?id=${p.id}`)}>
											{#if !isPlaceholderArt(avatarOf(p))}
												<img src={avatarOf(p)} alt="" width="28" height="28" />
											{/if}
											<span>{who(item)}</span>
										</a>
									{:else if item.source}
										<span class="who">{item.source}</span>
									{/if}
									{#if item.episodeId && item.entryTitle}
										<a class="ep" href={episodeHref(item.episodeId)}>{item.entryTitle}</a>
									{:else if item.entryTitle}
										<span class="ep">{item.entryTitle}</span>
									{/if}
									{#if item.source && p}
										<span class="src">{item.source}</span>
									{/if}
									<button
										type="button"
										class="star"
										class:on
										aria-pressed={on}
										aria-label={on ? (ko ? '별표 해제' : 'Unstar') : ko ? '별표' : 'Star'}
										onclick={() => starFromCanon(item)}
									>
										<span class="material-symbols-outlined" class:filled={on} aria-hidden="true"
											>star</span
										>
									</button>
								</footer>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}
	</article>
</main>

<style>
	.quotes {
		min-height: 100dvh;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	.column {
		max-width: var(--script-measure);
		margin-inline: auto;
	}

	h1 {
		margin: 3rem 0 0.6rem;
		font-family: var(--serif);
		font-size: clamp(2rem, 4vw, 2.6rem);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.lede {
		margin: 0 0 1.6rem;
		font-size: 1.02rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.toolbar {
		display: grid;
		gap: 0.7rem;
		margin-bottom: 2rem;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.tabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		cursor: pointer;
	}

	.tabs button[aria-selected='true'] {
		background: var(--fg-strong);
		border-color: var(--fg-strong);
		color: var(--bg);
	}

	.tabs small,
	h2 small {
		font-weight: 500;
		opacity: 0.62;
	}

	input[type='search'] {
		width: 100%;
		padding: 0.55rem 0.8rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--bg);
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.9rem;
	}

	h2 {
		margin: 2.4rem 0 0.8rem;
		font-family: var(--serif);
		font-size: 1.45rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.empty {
		color: var(--fg-dim);
		font-size: 0.95rem;
	}

	ul {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		padding: 1rem 1.1rem 0.85rem;
		border: 1px solid var(--hairline);
		border-left: 3px solid var(--chip);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--chip) 5%, var(--bg));
	}

	blockquote {
		margin: 0 0 0.7rem;
	}

	.en {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 500;
		line-height: 1.4;
		color: var(--fg-strong);
	}

	.ko,
	.hanja {
		margin: 0.3rem 0 0;
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.hanja {
		letter-spacing: 0.06em;
	}

	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem 0.7rem;
		font-size: 0.78rem;
		letter-spacing: var(--tracking-ui);
	}

	.who {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--fg-strong);
		font-weight: 600;
		text-decoration: none;
	}

	.who img {
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 50%;
		object-fit: cover;
		background: color-mix(in srgb, var(--chip) 18%, var(--bg));
	}

	.ep,
	.src {
		color: var(--fg-dim);
		text-decoration: none;
	}

	.ep:hover,
	.who:hover {
		color: var(--fg-strong);
	}

	.star {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		padding: 0.15rem;
		border: none;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.star.on,
	.star:hover {
		color: var(--chip);
	}

	.material-symbols-outlined {
		font-size: 1.15rem;
	}

	.filled {
		font-variation-settings: 'FILL' 1;
	}
</style>
