<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import ComicBook from '$lib/components/comic/ComicBook.svelte';
	import LangSwitch from '$lib/components/LangSwitch.svelte';
	import { CHUNCHU_DEER } from '$lib/data/comics/chunchu-deer';
	import { COMICS, comicById } from '$lib/comic';
	import { comicUi, setComicInk } from '$lib/comicUi.svelte';
	import { reading } from '$lib/reading.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const story = $derived(comicById.get(data.storyId) ?? CHUNCHU_DEER);
	const n = $derived(data.page);
	const total = $derived(story.pages.length);
	const current = $derived(story.pages[n - 1] ?? story.pages[0]);
	const ko = $derived(reading.lang === 'ko');

	function go(p: number) {
		const next = Math.min(total, Math.max(1, p));
		if (next === n) return;
		const q = new URLSearchParams(page.url.searchParams);
		q.set('story', story.id);
		q.set('p', String(next));
		void goto(resolve(`/comic?${q}`), { keepFocus: true, noScroll: true });
	}

	function onKey(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			go(n + 1);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			go(n - 1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			go(1);
		} else if (e.key === 'End') {
			e.preventDefault();
			go(total);
		}
	}

	function pickStory(e: Event) {
		const id = (e.currentTarget as HTMLSelectElement).value;
		const q = new URLSearchParams(page.url.searchParams);
		q.set('story', id);
		q.set('p', '1');
		void goto(resolve(`/comic?${q}`), { keepFocus: true });
	}
</script>

<svelte:window onkeydown={onKey} />

<svelte:head>
	<title>{ko ? story.title.ko : story.title.en} · {ko ? '만화' : 'Comic'} · King for All</title>
	<meta name="description" content={ko ? story.logline.ko : story.logline.en} />
</svelte:head>

<main class="comic">
	<!-- Not aside.rail — app.css pins `.rail` as the 22px decorative stripe. -->
	<div class="comic-nav">
		<div class="kicker">{ko ? '만화' : 'Comic'}</div>
		<h1>{ko ? story.title.ko : story.title.en}</h1>
		<p class="log">{ko ? story.logline.ko : story.logline.en}</p>
		{#if current?.title}
			<p class="page-title">{ko ? current.title.ko : current.title.en}</p>
		{/if}

		<div class="tools">
			<label class="pick">
				<span class="sr">{ko ? '이야기' : 'Story'}</span>
				<select value={story.id} onchange={pickStory}>
					{#each COMICS as c (c.id)}
						<option value={c.id}>{ko ? c.title.ko : c.title.en}</option>
					{/each}
				</select>
			</label>
			<LangSwitch />
			<button
				type="button"
				class={['ink', { on: comicUi.ink }]}
				aria-pressed={comicUi.ink}
				onclick={() => setComicInk(!comicUi.ink)}
			>
				{comicUi.ink
					? ko
						? '흑백'
						: 'Ink'
					: ko
						? '컬러'
						: 'Colour'}
			</button>
			<a class="read" href={resolve(`/read?ep=${story.episodeId}`)}
				>{ko ? '본편에서 읽기' : 'Read in the chronicle'}</a
			>
		</div>

		<nav class="pager" aria-label={ko ? '쪽' : 'Pages'}>
			<button type="button" disabled={n <= 1} onclick={() => go(n - 1)}>
				{ko ? '앞쪽' : 'Back'}
			</button>
			<span class="n">{n} / {total}</span>
			<button type="button" disabled={n >= total} onclick={() => go(n + 1)}>
				{ko ? '다음' : 'Next'}
			</button>
		</nav>

		<nav class="thumbs" aria-label={ko ? '모든 쪽' : 'All pages'}>
			{#each story.pages as p (p.id)}
				<a
					href={resolve(`/comic?story=${story.id}&p=${p.n}`)}
					class={{ on: p.n === n }}
					aria-current={p.n === n ? 'page' : undefined}
				>
					{p.n}
				</a>
			{/each}
		</nav>
	</div>

	<section class="stage" aria-label={ko ? '만화책' : 'Comic book'}>
		<ComicBook {story} {n} onturn={go} />
	</section>
</main>

<style>
	.comic {
		display: grid;
		grid-template-columns: 17.25rem minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		width: 100%;
		height: 100dvh;
		height: 100svh;
		max-height: 100dvh;
		overflow: hidden;
		padding-top: 3.55rem;
		padding-bottom: var(--tabbar-space);
		box-sizing: border-box;
	}

	.comic-nav {
		grid-column: 1;
		min-width: 0;
		overflow: auto;
		padding: 0.15rem 1rem 1.4rem;
		border-right: 1px solid var(--hairline);
		background: var(--bg);
	}

	.kicker {
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
	}

	h1 {
		margin: 0.15rem 0 0.4rem;
		font-size: 1.55rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.15;
	}

	.log {
		margin: 0 0 0.55rem;
		color: var(--fg-dim);
		font-size: 0.88rem;
		line-height: 1.4;
	}

	.page-title {
		margin: 0 0 0.85rem;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.tools {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.55rem;
	}

	.pick select {
		width: 100%;
		font: inherit;
		font-weight: 650;
		padding: 0.35rem 0.6rem;
		border-radius: var(--radius-pill);
		border: 1px solid var(--hairline);
		background: var(--panel);
		color: var(--fg-strong);
	}

	.ink {
		font: inherit;
		font-weight: 700;
		padding: 0.38rem 0.75rem;
		border-radius: var(--radius-pill);
		border: 1px solid var(--hairline);
		background: var(--panel);
		color: var(--fg-strong);
		cursor: pointer;
	}

	.ink.on {
		color: var(--on-gold);
		background: var(--gold);
		border-color: transparent;
	}

	.read {
		font-size: 0.82rem;
		font-weight: 650;
		color: var(--gold);
	}

	.pager {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		margin: 1rem 0 0.75rem;
	}

	.pager button {
		font: inherit;
		font-weight: 700;
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: var(--radius-pill);
		background: var(--panel);
		color: var(--fg-strong);
		cursor: pointer;
	}

	.pager button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.n {
		font-variant-numeric: tabular-nums;
		font-weight: 750;
		min-width: 3.6rem;
		text-align: center;
	}

	.thumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.thumbs a {
		width: 1.85rem;
		height: 1.85rem;
		display: grid;
		place-items: center;
		border-radius: 50%;
		font-size: 0.72rem;
		font-weight: 750;
		color: var(--fg-dim);
		background: var(--panel);
		text-decoration: none;
	}

	.thumbs a.on {
		color: var(--on-gold);
		background: var(--gold);
	}

	.stage {
		grid-column: 2;
		min-width: 0;
		min-height: 0;
		display: grid;
		place-items: center;
		padding: 0.55rem 1.1rem 0.7rem 1.25rem;
		background: #0c0d0f;
		overflow: hidden;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	@media (max-width: 860px) {
		.comic {
			grid-template-columns: 1fr;
			grid-template-rows: minmax(0, 1fr) auto;
		}

		.comic-nav {
			grid-column: 1;
			order: 2;
			border-right: none;
			border-top: 1px solid var(--hairline);
			max-height: 34dvh;
			padding-top: 0.7rem;
		}

		.stage {
			grid-column: 1;
			order: 1;
			padding: 0.35rem 0.45rem;
		}

		.tools {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
		}

		.pick select {
			width: auto;
		}

		h1 {
			font-size: 1.28rem;
		}
	}

	@media (max-width: 720px) {
		:global(html.has-tabbar) .comic {
			padding-top: 0.35rem;
		}
	}
</style>
