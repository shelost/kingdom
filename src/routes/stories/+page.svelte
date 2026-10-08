<script lang="ts">
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { resolve } from '$app/paths';
	import { episodeCount, heroStill, outlineShelves } from '$lib/outlines';

	const shelves = outlineShelves();
</script>

<svelte:head>
	<title>Stories · King for All</title>
	<meta name="description" content="Outlines for the next books: Korea, China, Persia, the steppe, Israel and Silicon Valley." />
</svelte:head>

<main class="stories">
	<SiteNavSpace />

	<header>
		<h1>Stories</h1>
		<p>Outlines for the books after King for All.</p>
	</header>

	{#each shelves as { shelf, outlines } (shelf)}
		<section>
			<h2>{shelf}</h2>
			<ul class="grid">
				{#each outlines as o (o.slug)}
					{@const cover = heroStill(o)}
					<li style:--accent={o.accent}>
						<a href={resolve('/stories/[slug]', { slug: o.slug })}>
							{#if cover}
								<img src={staticAsset(cover.src)} alt={cover.alt} loading="lazy" />
							{/if}
							<div class="text">
								<h3>{o.title} <span class="ko">{o.ko}</span></h3>
								<p class="tagline">{o.tagline}</p>
								<p class="meta">{o.years} · {episodeCount(o)} episodes</p>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>

<style>
	.stories {
		min-height: 100dvh;
		max-width: 72rem;
		margin-inline: auto;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	header {
		margin: 3rem 0 1rem;
	}

	h1 {
		margin: 0 0 0.4rem;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	header p {
		margin: 0;
		font-family: var(--ui);
		color: var(--fg-dim);
	}

	h2 {
		margin: 3rem 0 1rem;
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: block;
		color: inherit;
		text-decoration: none;
	}

	img {
		display: block;
		width: 100%;
		aspect-ratio: 2;
		object-fit: cover;
		border-radius: 0.5rem;
		transition: opacity 0.2s;
	}

	a:hover img {
		opacity: 0.85;
	}

	.text {
		padding-top: 0.75rem;
		border-top: 2px solid transparent;
	}

	h3 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--fg-strong);
	}

	a:hover h3 {
		color: var(--accent);
	}

	.ko {
		font-family: var(--ui);
		font-size: 0.7em;
		color: var(--fg-faint);
	}

	.tagline {
		margin: 0.25rem 0 0;
		font-family: var(--ui);
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.meta {
		margin: 0.25rem 0 0;
		font-family: var(--ui);
		font-size: 0.78rem;
		color: var(--fg-faint);
	}
</style>
