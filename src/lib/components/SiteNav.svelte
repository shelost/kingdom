<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { toggleTheme } from '$lib/themeUi.svelte';
	import { SITE_LINKS, isSiteLinkActive } from '$lib/siteLinks';
	import ThemeIcon from './ThemeIcon.svelte';

	let path = $derived(page.url.pathname);
</script>

<nav class="site-nav" aria-label="Site">
	{#each SITE_LINKS as link (link.href)}
		{@const href = hrefWithNsfw(resolve(link.href), page.url)}
		{@const active = isSiteLinkActive(link, path, href)}
		<a {href} class:active aria-current={active ? 'page' : undefined}>{link.label}</a>
	{/each}
	<button
		type="button"
		class="theme-toggle"
		onclick={toggleTheme}
		aria-label="Toggle light and dark mode"
		title="Toggle light and dark mode"
	>
		<ThemeIcon />
	</button>
</nav>

<style>
	.site-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
	}

	.site-nav a {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		color: var(--fg-faint);
		padding: 0.34rem 0.7rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		backdrop-filter: blur(14px);
		transition:
			color 0.38s var(--toc-ease),
			border-color 0.38s var(--toc-ease),
			background 0.38s var(--toc-ease),
			box-shadow 0.38s var(--toc-ease),
			transform 0.38s var(--toc-ease);
	}

	.site-nav a:hover {
		color: var(--fg);
		border-color: color-mix(in srgb, var(--fg) 22%, transparent);
		transform: translateY(-1px);
		box-shadow: 0 6px 18px color-mix(in srgb, var(--bg) 55%, transparent);
	}

	.site-nav a.active {
		color: var(--on-highlight);
		background: var(--highlight);
		border-color: var(--highlight);
		transform: translateY(0);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--highlight) 35%, transparent);
	}

	.theme-toggle {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		backdrop-filter: blur(14px);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			background 0.25s var(--ease);
	}

	.theme-toggle:hover {
		color: var(--fg);
		border-color: color-mix(in srgb, var(--fg) 22%, transparent);
	}

	.theme-toggle :global(.material-symbols-outlined) {
		grid-area: 1 / 1;
		font-size: 1rem;
	}

	/* Phones navigate from the tab bar; the pill rows would only wrap. A page's
	   separator dot right after the nav goes with it. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav,
		:global(html.has-tabbar) .site-nav + :global(.dot) {
			display: none;
		}
	}
</style>
