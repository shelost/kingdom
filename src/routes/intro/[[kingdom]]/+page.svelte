<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import IntroPlayer from '$lib/components/intro/IntroPlayer.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.intro.title} · Intro</title>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap" />
</svelte:head>

<main>
	<header>
		<SiteNavSpace />
		<nav aria-label="Kingdom intros">
			{#each data.kingdoms as k (k.id)}
				<a
					href={resolve('/intro/[[kingdom]]', { kingdom: k.id })}
					class:on={k.id === data.intro.id}
					style:--k={k.color}
				>
					{k.title}
				</a>
			{/each}
		</nav>
	</header>

	{#key data.intro.id}
		<IntroPlayer intro={data.intro} opening={data.opening} cast={data.cast} finale={data.finale} />
	{/key}
</main>

<style lang="scss">
	main {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1.2rem 3rem;
		color: #eee;
	}

	:global(body:has(main > header > nav[aria-label='Kingdom intros'])) {
		background: #070707;
	}

	nav {
		display: flex;
		gap: 0.5rem;
		margin: 0.4rem 0 1rem;
		& a {
			padding: 0.3rem 0.8rem;
			border: 1px solid #2a2a2a;
			border-radius: 6px;
			color: #bbb;
			font-family: 'Anton', sans-serif;
			letter-spacing: 0.05em;
			text-decoration: none;
			&.on {
				border-color: var(--k);
				background: var(--k);
				color: #fff;
			}
		}
	}
</style>
