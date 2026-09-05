<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { toggleTheme } from '$lib/themeUi.svelte';

	const LINKS = [
		{ href: '/', label: 'Chronicle' },
		{ href: '/wiki', label: 'Wiki' },
		{ href: '/characters', label: 'Characters' },
		{ href: '/map', label: 'Map' },
		{ href: '/music', label: 'Music' }
	] as const;

	let path = $derived(page.url.pathname);
</script>

<nav class="site-nav" aria-label="Site">
	{#each LINKS as link (link.href)}
		{@const href = resolve(link.href)}
		{@const active =
			link.href === '/'
				? path === '/' || path === href
				: path === link.href || path === href || path.startsWith(`${link.href}/`)}
		<a {href} class:active aria-current={active ? 'page' : undefined}>{link.label}</a>
	{/each}
	<!--
	  Icon visibility is CSS-driven from html[data-theme] so SSR and the
	  pre-paint boot script never disagree (avoids hydration mismatch).
	-->
	<button
		type="button"
		class="theme-toggle"
		onclick={toggleTheme}
		aria-label="Toggle light and dark mode"
		title="Toggle light and dark mode"
	>
		<span class="material-symbols-outlined icon-for-dark" aria-hidden="true">light_mode</span>
		<span class="material-symbols-outlined icon-for-light" aria-hidden="true">dark_mode</span>
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
		border-radius: 999px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			background 0.25s var(--ease);
	}

	.site-nav a:hover {
		color: var(--fg);
		border-color: color-mix(in srgb, var(--fg) 22%, transparent);
	}

	.site-nav a.active {
		color: var(--on-highlight);
		background: var(--highlight);
		border-color: var(--highlight);
	}

	.theme-toggle {
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
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

	.theme-toggle .material-symbols-outlined {
		grid-area: 1 / 1;
		font-size: 1rem;
	}

	/* Default (dark / no attribute): offer the sun. Light theme: offer the moon. */
	.icon-for-light {
		display: none;
	}

	:global(html[data-theme='light']) .icon-for-dark {
		display: none;
	}

	:global(html[data-theme='light']) .icon-for-light {
		display: inline-block;
	}
</style>
