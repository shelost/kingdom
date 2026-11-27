<script lang="ts">
	import { resolve } from '$app/paths';
	import { OUTLINES } from '$lib/outlines';
	import { reading } from '$lib/reading.svelte';

	const stories = OUTLINES.filter((o) => o.timeline.length > 0);
	let ko = $derived(reading.lang === 'ko');
</script>

<svelte:head>
	<title>{ko ? '연표' : 'Timeline'}</title>
</svelte:head>

<main class="timeline-index">
	<header>
		<h1>{ko ? '연표' : 'Timeline'}</h1>
		<p>
			{ko
				? '각 이야기가 붙잡는 해. 책 이름은 그 구간에서 가장 움직이는 사람이지, 그 사람의 일생이 아니다.'
				: 'The years each story keeps. A book’s name is whoever is most active in that stretch, not a life from birth to death.'}
		</p>
		<p class="aside">
			<a href={resolve('/parallel')}>{ko ? '병행' : 'Parallel'}</a>
			{ko ? '은 연대기의 모든 해를 한 축에 쌓는다.' : 'stacks every dated thing in the chronicle on one axis.'}
		</p>
	</header>

	{#each stories as story (story.slug)}
		<section id={story.slug}>
			<h2>
				<a href={resolve(`/stories/${story.slug}`)}>{ko ? story.ko : story.title}</a>
				<span>{story.years}</span>
			</h2>
			<ol>
				{#each story.timeline as e, i (e.year + e.text)}
					{#if e.group && e.group !== story.timeline[i - 1]?.group}
						<li class="group">{e.group}</li>
					{/if}
					<li>
						<span class="year">{e.year}</span>
						<span>{e.text}</span>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</main>

<style>
	.timeline-index {
		max-width: 42rem;
		margin: 0 auto;
		padding: 2.5rem 1.25rem 5rem;
	}

	header h1 {
		margin: 0 0 0.4rem;
		font-size: 2rem;
		font-weight: 600;
	}

	header p {
		margin: 0.35rem 0;
		line-height: 1.5;
	}

	.aside {
		color: var(--fg-faint);
	}

	.aside a {
		color: inherit;
	}

	section {
		margin-top: 2.4rem;
	}

	h2 {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
		margin: 0 0 0.4rem;
		font-size: 1.25rem;
		font-weight: 600;
	}

	h2 span {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	h2 a {
		color: inherit;
		text-decoration: none;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr);
		gap: 0.75rem;
		padding: 0.35rem 0;
		border-bottom: 1px solid var(--hairline);
		font-size: 0.95rem;
		line-height: 1.45;
	}

	.year {
		color: var(--fg-faint);
	}

	.group {
		display: block;
		margin-top: 1rem;
		padding-top: 0.2rem;
		border-bottom: none;
		font-weight: 600;
	}
</style>
