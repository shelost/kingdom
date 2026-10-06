<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { toggleTheme } from '$lib/themeUi.svelte';
	import { SITE_LINKS, isSiteLinkActive } from '$lib/siteLinks';
	import ThemeIcon from './ThemeIcon.svelte';

	/**
	 * `inline` keeps the pill in the flow (the chronicle's settings panel). Otherwise
	 * it floats centred over the page: the root layout renders that one for every
	 * page but the chronicle, and pages hold its room with `SiteNavSpace`.
	 */
	let { inline = false }: { inline?: boolean } = $props();

	let path = $derived(page.url.pathname);
</script>

<nav class="site-nav" class:inline aria-label="Site">
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
	/* ————— Liquid glass: one pill, the links as segments inside it ————— */
	.site-nav {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.25rem;
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		border: 1px solid color-mix(in srgb, white 32%, transparent);
		border-radius: var(--radius-pill);
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, white 24%, transparent),
				color-mix(in srgb, white 4%, transparent) 60%
			),
			color-mix(in srgb, var(--bg) 52%, transparent);
		backdrop-filter: blur(18px) saturate(180%);
		-webkit-backdrop-filter: blur(18px) saturate(180%);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, white 55%, transparent),
			inset 0 -1px 0 color-mix(in srgb, white 12%, transparent),
			var(--shadow-float);
	}

	.site-nav:not(.inline) {
		position: fixed;
		z-index: 95;
		top: max(0.75rem, env(safe-area-inset-top, 0px));
		left: 50%;
		transform: translateX(-50%);
		max-width: calc(100vw - 1.5rem);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.site-nav.inline {
		flex-wrap: wrap;
	}

	.site-nav a {
		flex: 0 0 auto;
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		white-space: nowrap;
		color: var(--fg-dim);
		padding: 0.4rem 0.8rem;
		border-radius: var(--radius-pill);
		transition:
			color 0.3s var(--toc-ease),
			background 0.3s var(--toc-ease),
			box-shadow 0.3s var(--toc-ease);
	}

	.site-nav a:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.site-nav a.active {
		color: var(--on-highlight);
		background: var(--highlight);
		box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--highlight) 60%, transparent);
	}

	.site-nav a:focus-visible,
	.theme-toggle:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.theme-toggle {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 1.85rem;
		height: 1.85rem;
		margin-left: 0.1rem;
		padding: 0;
		color: var(--fg-dim);
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 0.25s var(--ease),
			background 0.25s var(--ease);
	}

	.theme-toggle:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.theme-toggle :global(.material-symbols-outlined) {
		grid-area: 1 / 1;
		font-size: 1rem;
	}

	/* Phones navigate from the tab bar; the pill would only crowd the top. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav:not(.inline) {
			display: none;
		}
	}
</style>
