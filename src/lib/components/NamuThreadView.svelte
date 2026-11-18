<script lang="ts">
	import { BATCHES, stillSrc, type Batch, type Beat, type Thread } from '$lib/callbacks';

	let {
		batches,
		hrefFor
	}: {
		batches: (Batch & { threads: Thread[] })[];
		hrefFor: (title: string) => string;
	} = $props();

	function shots(beat: Beat): { id: string; src: string }[] {
		const out: { id: string; src: string }[] = [];
		for (const id of beat.stills) {
			const src = stillSrc(id);
			if (src) out.push({ id, src });
		}
		return out;
	}

	function sectionNo(id: string): number {
		return BATCHES.findIndex((b) => b.id === id) + 2;
	}

	function sectionId(n: number): string {
		return `s-${n}`;
	}
</script>

<article class="namu">
	<h1>What the book plants</h1>

	<nav class="toc" aria-label="Contents">
		<span class="toc-item">
			<a href="#{sectionId(1)}"><em>1</em>.</a>
			<a href="#{sectionId(1)}">Overview</a>
		</span>
		{#each batches as batch (batch.id)}
			{@const n = sectionNo(batch.id)}
			<span class="toc-item">
				<a href="#{sectionId(n)}"><em>{n}</em>.</a>
				<a href="#{sectionId(n)}">{batch.title}</a>
			</span>
		{/each}
	</nav>

	<section aria-labelledby={sectionId(1)}>
		<h2 id={sectionId(1)}>
			<span class="wiki-heading-content">1. Overview</span>
		</h2>
		<p>
			This page lists the threads planted in the book. The story has gone far enough that most of them are already spent, and the turns come more than once, so the rest of this page is spoilers. If you are still reading the book, do not read on.
		</p>
	</section>

	{#each batches as batch (batch.id)}
		{@const n = sectionNo(batch.id)}
		<section aria-labelledby={sectionId(n)}>
			<h2 id={sectionId(n)}>
				<span class="wiki-heading-content">{n}. {batch.title}</span>
				{#if batch.ko}<span class="ko">{batch.ko}</span>{/if}
			</h2>
			{#if batch.note}<p>{batch.note}</p>{/if}
			<ul>
				{#each batch.threads as thread (thread.id)}
					{@render item(thread)}
				{/each}
			</ul>
		</section>
	{/each}
</article>

{#snippet item(thread: Thread)}
	{@const reveal = thread.kind === 'pov' ? undefined : thread.beats[thread.beats.length - 1]}
	{@const plants = reveal ? thread.beats.slice(0, -1) : thread.beats}
	<li id="thread-{thread.id}">
		{thread.head}
		<ul>
			{#each plants as beat, i (beat.episode + beat.mark + i)}
				<li>
					{beat.line}
					(<a href={hrefFor(beat.episode)}>{beat.episode}</a>{#if beat.year}, {beat.year}{/if})
					{@render pics(beat)}
				</li>
			{/each}
			{#if reveal}
				<li>
					In <a href={hrefFor(reveal.episode)}>{reveal.episode}</a>{#if reveal.year}, {reveal.year}{/if}.
					{reveal.line}
					{#if thread.note}
						{thread.note}
					{/if}
					{@render pics(reveal)}
				</li>
			{:else if thread.note}
				<li>{thread.note}</li>
			{/if}
		</ul>
	</li>
{/snippet}

{#snippet pics(beat: Beat)}
	{@const frames = shots(beat)}
	{#if frames.length}
		<span class="frames">
			{#each frames as shot (shot.id)}
				<img src={shot.src} alt="" />
			{/each}
		</span>
	{/if}
{/snippet}

<style>
	.namu {
		max-width: 48rem;
		margin: 0.4rem auto 0;
		font-size: 0.98rem;
		line-height: 1.75;
		color: var(--fg);
	}

	h1 {
		margin: 0.2rem 0 0.7rem;
		padding-bottom: 0.35rem;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 16%, transparent);
		font-size: 1.7rem;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}

	.toc {
		margin: 0 0 0.4rem;
		line-height: 1.85;
	}

	.toc-item {
		display: inline;
		margin-right: 0.75rem;
		white-space: nowrap;
	}

	a {
		color: #6cb6f0;
		text-decoration: none;
	}

	:global(html[data-theme='light']) a {
		color: #0275d8;
	}

	.toc a:hover,
	.namu a:hover {
		text-decoration: underline;
	}

	.toc em {
		font-style: italic;
		font-weight: 650;
	}

	h2 {
		margin: 1.6rem 0 0.45rem;
		padding-bottom: 0.2rem;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 16%, transparent);
		font-size: 1.35rem;
		font-weight: 650;
		letter-spacing: -0.015em;
		line-height: 1.3;
		scroll-margin-top: 5.5rem;
	}

	.ko {
		margin-left: 0.45rem;
		color: var(--fg-faint);
		font-size: 0.85rem;
		font-weight: 500;
	}

	p {
		margin: 0.35rem 0 0.6rem;
	}

	ul {
		margin: 0.3rem 0 0.8rem;
		padding-left: 1.35rem;
		list-style: disc;
	}

	ul ul {
		margin: 0.2rem 0 0.35rem;
		list-style: circle;
	}

	li {
		margin: 0.35rem 0;
		scroll-margin-top: 5.5rem;
	}

	.frames {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.35rem;
	}

	.frames img {
		width: 11rem;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: 2px;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}
</style>
