<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { PARTS } from '$lib/episodeDirectory';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { EP_QUERY } from '$lib/reading.svelte';
	import { OUTLINES } from '$lib/outlines';


	const pages = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'))
		.map((f) =>
			f
				.replace(/^\/src\/routes/, '')
				.replace(/\/\+page\.svelte$/, '')
				.replace(/\/\([^)]+\)/g, '')
		)
		.filter((p) => !p.includes('['))
		.map((p) => p || '/')
		.sort();

	const readHref = (queryId: string) =>
		hrefWithNsfw(`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(queryId)}`, page.url);
</script>

<svelte:head>
	<title>Directory · King for All</title>
</svelte:head>

<main class="directory">
	<SiteNavSpace />
	<h1>Directory</h1>

	<h2>Pages</h2>
	<ul>
		{#each pages as p (p)}
			<li><a href={resolve(p as '/')}>{p}</a></li>
		{/each}
	</ul>

	<h2>Episodes</h2>
	{#each PARTS as part (part.id)}
		<h3>{part.label}{part.title ? ` · ${part.title}` : ''}</h3>
		<ul>
			{#each part.arcs as arc (arc.id)}
				{#each arc.episodes as ep (ep.id)}
					<li><a href={readHref(ep.queryId)}>{ep.number} {ep.title}</a></li>
				{/each}
			{/each}
		</ul>
	{/each}

	<h2>Stories</h2>
	<ul>
		{#each OUTLINES as o (o.slug)}
			<li><a href={resolve('/stories/[slug]', { slug: o.slug })}>{o.title}</a></li>
		{/each}
	</ul>
</main>

<style>
	.directory {
		max-width: 40rem;
		margin: 0 auto;
		padding: 2rem 1.25rem 4rem;
		line-height: 1.6;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
	}
	a {
		color: inherit;
	}
</style>
