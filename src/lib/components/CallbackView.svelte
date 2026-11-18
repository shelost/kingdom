<script lang="ts">
	import { resolve } from '$app/paths';
	import { BATCHES, KINDS, THREADS, stillSrc, type Beat, type Kind, type Thread } from '$lib/callbacks';
	import { firstLabel, laterLabel, plantedArrivals, type Arrival } from '$lib/firsts';
	import { wikiIdQuery } from '$lib/lifeArcView';
	import { koChrome, ui } from '$lib/uiLang';
	import NamuThreadView from './NamuThreadView.svelte';

	let {
		hrefFor,
		thumbFor
	}: {
		hrefFor: (title: string) => string;
		thumbFor: (title: string) => string | undefined;
	} = $props();

	let layout = $state<'kind' | 'batch' | 'namu'>('batch');
	let kind = $state<Kind | 'all'>('all');
	let query = $state('');

	const shown = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return THREADS.filter((t) => {
			if (kind !== 'all' && t.kind !== kind) return false;
			if (!q) return true;
			const blob = [t.head, t.ko, t.note, ...t.beats.flatMap((b) => [b.episode, b.line, b.mark])].join(' ').toLowerCase();
			return blob.includes(q);
		});
	});

	function shots(beat: Beat): { id: string; src: string }[] {
		const out: { id: string; src: string }[] = [];
		for (const id of beat.stills) {
			const src = stillSrc(id);
			if (src) out.push({ id, src });
		}
		return out;
	}

	const came = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return plantedArrivals().filter((a) => {
			const blob = [a.name, a.korean, ...a.beats.flatMap((b) => [b.episode, b.line, firstLabel(b.kind)])]
				.join(' ')
				.toLowerCase();
			if (q && !blob.includes(q)) return false;
			if (kind === 'foreshadow') return a.beats.some((b) => b.kind === 'allusion');
			return kind === 'all';
		});
	});

	const cameGroups = $derived.by(() => {
		const groups: { episode: string; rows: Arrival[] }[] = [];
		for (const row of came) {
			const episode = row.beats[row.beats.length - 1]?.episode ?? '';
			const last = groups[groups.length - 1];
			if (last && last.episode === episode) last.rows.push(row);
			else groups.push({ episode, rows: [row] });
		}
		return groups;
	});

	function wikiHref(id: string): string {
		return `${resolve('/wiki')}?${wikiIdQuery(id)}`;
	}

	const batches = $derived.by(() =>
		BATCHES.map((batch) => ({
			...batch,
			threads: shown.filter((t) => t.batch === batch.id),
			covers: batch.episodes.map((ep) => thumbFor(ep)).filter((src): src is string => !!src)
		})).filter((batch) => batch.threads.length)
	);
</script>

<div class="page">
	{#if layout !== 'namu'}
	<header class="mast">
		<p class="kicker">Threads</p>
		<h1>What the book plants</h1>
		<p class="deck">
			A plant, then the episode that spends it. Grouped by that episode, or by the kind of device.
			The same night told twice is not a device. A question answered in the scene you are already in is not one either.
			Under that, the book’s own arrivals: a hint, a name, a body, a first line, kept when they fall in different episodes.
		</p>
	</header>
	{/if}

	<div class="bar">
		<div class="segment" role="tablist" aria-label="Group threads">
			<button type="button" role="tab" class={['seg', { on: layout === 'batch' }]} aria-selected={layout === 'batch'} onclick={() => (layout = 'batch')}>
				By episode
			</button>
			<button type="button" role="tab" class={['seg', { on: layout === 'kind' }]} aria-selected={layout === 'kind'} onclick={() => (layout = 'kind')}>
				By kind
			</button>
			<button type="button" role="tab" class={['seg', { on: layout === 'namu' }]} aria-selected={layout === 'namu'} onclick={() => (layout = 'namu')}>
				Article
			</button>
		</div>
		<div class="segment" role="tablist" aria-label="Kind of device">
			<button type="button" role="tab" class={['seg', { on: kind === 'all' }]} aria-selected={kind === 'all'} onclick={() => (kind = 'all')}>
				All
				<span>{THREADS.length}</span>
			</button>
			{#each KINDS as k (k.id)}
				<button type="button" role="tab" class={['seg', { on: kind === k.id }]} aria-selected={kind === k.id} onclick={() => (kind = k.id)}>
					{k.label}
					<span>{THREADS.filter((t) => t.kind === k.id).length}</span>
				</button>
			{/each}
		</div>
		<input class="search" type="search" placeholder="Search" bind:value={query} />
	</div>

	{#if layout === 'namu'}
		<NamuThreadView {batches} {hrefFor} />
	{:else if layout === 'batch'}
		{#each batches as batch (batch.id)}
			<section class="batch" aria-labelledby="batch-{batch.id}">
				<header class="banner" style:--wash={batch.covers[0] ? `url("${batch.covers[0]}")` : 'none'}>
					<div class="banner-copy">
						<p class="kicker">{batch.threads.length} {batch.threads.length === 1 ? 'thread' : 'threads'}</p>
						<h2 id="batch-{batch.id}"><a href={hrefFor(batch.episodes[0])}>{batch.title}</a></h2>
						{#if batch.ko}<span class="ko">{batch.ko}</span>{/if}
						<p>{batch.note}</p>
						<p class="eps">
							{#each batch.episodes as ep, i (ep)}
								{#if i}<span aria-hidden="true"> · </span>{/if}<a href={hrefFor(ep)}>{ep}</a>
							{/each}
						</p>
					</div>
					{#if batch.covers.length}
						<div class="covers">
							{#each batch.covers as src, i (batch.id + i)}
								<img src={src} alt="" />
							{/each}
						</div>
					{/if}
				</header>
				<ol class="qas">
					{#each batch.threads as thread (thread.id)}
						{@render qa(thread)}
					{/each}
				</ol>
			</section>
		{/each}
	{:else}
		{#each KINDS as k (k.id)}
			{@const rows = shown.filter((t) => t.kind === k.id)}
			{#if rows.length}
				<section class="kind" aria-labelledby="kind-{k.id}">
					<div class="kind-head">
						<h2 id="kind-{k.id}">{k.label}</h2>
						<p>{k.line}</p>
					</div>
					<ol>
						{#each rows as thread (thread.id)}
							{@render card(thread)}
						{/each}
					</ol>
				</section>
			{/if}
		{/each}
	{/if}

	{#if cameGroups.length}
		<section class="arrivals" aria-labelledby="arrivals-h">
			<div class="kind-head">
				<h2 id="arrivals-h">{ui('How they arrive')}</h2>
				<p>The same chain as the wiki. A step stays when its episode is its own.</p>
			</div>
			{#each cameGroups as group (group.episode)}
				<h3 class="arrive-ep"><a href={hrefFor(group.episode)}>{group.episode}</a></h3>
				<ul class="arrive-list">
					{#each group.rows as row (row.id)}
						<li>
							<a class="who" href={wikiHref(row.id)}>{row.name}</a>
							{#if row.korean}<span class="ko">{row.korean}</span>{/if}
							<ol class="chain">
								{#each row.beats as beat (beat.kind)}
									<li>
										<span>{ui(firstLabel(beat.kind))}</span>
										<a href={hrefFor(beat.episode)}>{beat.episode}</a>
										{#if beat.later}<span class="later">{laterLabel(beat.later, koChrome())}</span>{/if}
										{#if beat.line}<em>“{beat.line}”</em>{/if}
									</li>
								{/each}
							</ol>
						</li>
					{/each}
				</ul>
			{/each}
		</section>
	{/if}

	{#if !shown.length && !cameGroups.length}
		<p class="empty">Nothing matches.</p>
	{/if}
</div>

{#snippet qa(thread: Thread)}
	{@const reveal = thread.kind === 'pov' ? undefined : thread.beats[thread.beats.length - 1]}
	{@const plants = reveal ? thread.beats.slice(0, -1) : thread.beats}
	<li class="qa">
		<h3>{thread.head}</h3>
		{#each plants as beat, i (beat.episode + beat.mark + i)}
			<p class="plant">
				<a href={hrefFor(beat.episode)}>{beat.episode}</a>
				{#if beat.year}<span class="year">{beat.year}</span>{/if}
				{beat.line}
			</p>
		{/each}
		{@render stills(plants)}
		{#if reveal}
			<p class="ans">
				<a href={hrefFor(reveal.episode)}>{reveal.episode}</a>
				{#if reveal.year}<span class="year">{reveal.year}</span>{/if}
				{reveal.line}
			</p>
			{@render stills([reveal])}
		{/if}
	</li>
{/snippet}

{#snippet stills(beats: Beat[])}
	{@const pics = beats.flatMap((b) => shots(b))}
	{#if pics.length}
		<div class="pics">
			{#each pics as shot (shot.id)}
				<img src={shot.src} alt="" />
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet card(thread: Thread)}
	<li class="card">
		<div class="title">
			<h3>{thread.head}</h3>
			{#if thread.ko}<span class="ko">{thread.ko}</span>{/if}
		</div>
		<p class="note">{thread.note}</p>
		<div class="film">
			{#each thread.beats as beat, i (beat.episode + beat.mark + i)}
				{#if i > 0}<span class="then" aria-hidden="true"></span>{/if}
				<figure>
					<div class="pics">
						{#each shots(beat) as shot (shot.id)}
							<img src={shot.src} alt="" />
						{/each}
					</div>
					<figcaption>
						<span class="mark">{beat.mark}</span>
						<a href={hrefFor(beat.episode)}>{beat.episode}</a>
						{#if beat.year}<span class="year">{beat.year}</span>{/if}
						<blockquote>{beat.line}</blockquote>
					</figcaption>
				</figure>
			{/each}
		</div>
	</li>
{/snippet}

<style>
	.page {
		max-width: 1080px;
		margin: 0 auto;
		padding: 0.5rem 0 4rem;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
		color: var(--fg);
	}

	.mast {
		padding: 1.5rem 0 1.25rem;
	}

	.kicker {
		margin: 0 0 0.35rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 650;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.deck {
		margin: 0.75rem 0 0;
		max-width: 38rem;
		font-size: 1.05rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.bar {
		position: sticky;
		top: 3.2rem;
		z-index: 2;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		padding: 0.65rem 0 0.85rem;
		background: color-mix(in srgb, var(--bg, Canvas) 88%, transparent);
		backdrop-filter: blur(16px);
	}

	.segment {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		padding: 0.2rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.seg {
		border: 0;
		background: transparent;
		color: var(--fg-dim);
		border-radius: 999px;
		padding: 0.4rem 0.75rem;
		font: inherit;
		font-size: 0.84rem;
		font-weight: 550;
		cursor: pointer;
		display: inline-flex;
		gap: 0.35rem;
		align-items: center;
	}

	.seg span {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--fg-faint);
	}

	.seg.on {
		background: var(--fg);
		color: var(--bg, #111);
	}

	.seg.on span {
		color: color-mix(in srgb, var(--bg, #111) 65%, var(--fg));
	}

	.search {
		margin-left: auto;
		width: 12rem;
		border: 0;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
		color: inherit;
		border-radius: 999px;
		padding: 0.5rem 0.9rem;
		font: inherit;
		font-size: 0.9rem;
	}

	.kind {
		padding-top: 2.25rem;
	}

	.kind-head h2 {
		margin: 0;
		font-size: 1.35rem;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.kind-head p {
		margin: 0.3rem 0 0;
		color: var(--fg-dim);
		font-size: 0.95rem;
	}

	ol {
		list-style: none;
		margin: 1rem 0 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card {
		padding: 1.15rem 1.2rem 1.25rem;
		border-radius: 1.1rem;
		background: color-mix(in srgb, var(--fg) 4.5%, transparent);
	}

	.title {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem 0.7rem;
		align-items: baseline;
	}

	h3 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 630;
		letter-spacing: -0.015em;
	}

	.ko {
		color: var(--fg-faint);
		font-size: 0.9rem;
	}

	.note {
		margin: 0.35rem 0 0.9rem;
		max-width: 40rem;
		color: var(--fg-dim);
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.film {
		display: flex;
		align-items: stretch;
		gap: 0.35rem;
		overflow-x: auto;
		padding-bottom: 0.15rem;
	}

	.film figure {
		margin: 0;
		flex: 1 1 16rem;
		min-width: 15rem;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.qas {
		list-style: none;
		margin: 0.35rem 0 0;
		padding: 0;
	}

	.qa {
		padding: 1.15rem 0 1.25rem;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
	}

	.qa h3 {
		margin: 0 0 0.45rem;
		font-size: 1.2rem;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	.plant,
	.ans {
		margin: 0.2rem 0;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.plant {
		color: var(--fg-dim);
	}

	.plant a,
	.ans a {
		color: inherit;
		font-weight: 600;
		text-decoration: none;
	}

	.ans {
		margin-top: 0.55rem;
		padding-left: 0.85rem;
		border-left: 2px solid color-mix(in srgb, var(--fg) 28%, transparent);
		color: var(--fg);
	}

	.qa .pics {
		margin-top: 0.55rem;
	}

	.qa .pics img {
		width: 11rem;
		flex: 0 0 11rem;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: 0.65rem;
	}

	.pics {
		display: flex;
		gap: 0.35rem;
		overflow-x: auto;
	}

	.film img {
		display: block;
		width: 100%;
		min-width: 0;
		flex: 1;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.arrivals {
		margin: 1.5rem 0 2.5rem;
	}

	.arrive-ep {
		margin: 1.25rem 0 0.35rem;
		font-size: 1.05rem;
	}

	.arrive-ep a {
		color: inherit;
		text-decoration: none;
	}

	.arrive-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.arrive-list > li {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.7rem;
		align-items: baseline;
	}

	.who {
		font-weight: 650;
		color: inherit;
		text-decoration: none;
	}

	.chain {
		flex-basis: 100%;
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.chain li {
		color: var(--fg-dim);
		font-size: 0.92rem;
		line-height: 1.4;
	}

	.chain a {
		color: inherit;
		font-weight: 600;
		text-decoration: none;
	}

	.chain em {
		font-family: var(--serif);
	}

	.batch {
		margin: 1.75rem 0 2.75rem;
	}

	.banner {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1.25rem;
		align-items: end;
		min-height: 12rem;
		padding: 1.6rem 1.45rem;
		border-radius: 1.35rem;
		overflow: hidden;
		color: #fff;
		background: #1c1c1e;
	}

	.banner::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: var(--wash);
		background-size: cover;
		background-position: center 30%;
		transform: scale(1.06);
		filter: saturate(0.9);
	}

	.banner::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(100deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 48%, rgba(0, 0, 0, 0.28) 100%);
	}

	.banner-copy,
	.covers {
		position: relative;
		z-index: 1;
	}

	.banner .kicker {
		color: rgba(255, 255, 255, 0.62);
	}

	.banner h2 {
		margin: 0;
		font-size: 2.15rem;
		font-weight: 650;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.banner h2 a {
		color: inherit;
		text-decoration: none;
	}

	.banner .ko {
		display: block;
		margin-top: 0.2rem;
		color: rgba(255, 255, 255, 0.55);
	}

	.banner-copy > p {
		margin: 0.45rem 0 0;
		max-width: 32rem;
		color: rgba(255, 255, 255, 0.84);
		font-size: 0.98rem;
		line-height: 1.4;
	}

	.eps {
		font-size: 0.86rem;
	}

	.eps a {
		color: #fff;
		font-weight: 600;
		text-decoration: none;
	}

	.covers {
		display: flex;
		gap: 0.45rem;
		align-items: flex-end;
	}

	.covers img {
		width: 9.2rem;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: 0.7rem;
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
	}

	@media (max-width: 720px) {
		.banner {
			grid-template-columns: 1fr;
		}

		.covers img {
			width: 7rem;
		}
	}

	.film figure:not(:has(img)) {
		justify-content: flex-end;
	}

	.mark {
		display: block;
		margin-bottom: 0.15rem;
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	figcaption a {
		color: inherit;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
	}

	.year {
		margin-left: 0.35rem;
		color: var(--fg-faint);
		font-size: 0.8rem;
		font-weight: 500;
	}

	blockquote {
		margin: 0.3rem 0 0;
		font-size: 0.88rem;
		line-height: 1.35;
		color: var(--fg-dim);
	}

	.then {
		flex: 0 0 1.25rem;
		align-self: center;
		height: 1px;
		margin-bottom: 4.5rem;
		background: color-mix(in srgb, var(--fg) 22%, transparent);
		position: relative;
	}

	.then::after {
		content: '';
		position: absolute;
		right: -1px;
		top: -3px;
		border: 4px solid transparent;
		border-left-color: color-mix(in srgb, var(--fg) 35%, transparent);
	}

	.empty {
		color: var(--fg-dim);
		padding: 2rem 0;
	}

	@media (max-width: 720px) {
		h1 {
			font-size: 2rem;
		}

		.search {
			margin-left: 0;
			width: 100%;
		}

		.film figure {
			min-width: 78vw;
		}
	}
</style>
