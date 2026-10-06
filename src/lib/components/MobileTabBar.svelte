<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { toggleTheme } from '$lib/themeUi.svelte';
	import { SITE_LINKS, hasTabBar, isSiteLinkActive } from '$lib/siteLinks';
	import ThemeIcon from './ThemeIcon.svelte';

	const TABS = SITE_LINKS.filter((link) => link.tab);
	const MORE = SITE_LINKS.filter((link) => !link.tab);

	let path = $derived(page.url.pathname);
	let show = $derived(hasTabBar(path));
	let moreOpen = $state(false);
	let moreActive = $derived(MORE.some((link) => isSiteLinkActive(link, path, resolve(link.href))));

	/* Pages read --tabbar-space off this class to lift their floor above the bar. */
	$effect(() => {
		document.documentElement.classList.toggle('has-tabbar', show);
		return () => document.documentElement.classList.remove('has-tabbar');
	});

	afterNavigate(() => {
		moreOpen = false;
	});

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && moreOpen) moreOpen = false;
	}
</script>

<svelte:window onkeydown={onKey} />

{#snippet linkIcon(icon: string, active: boolean)}
	<span class="material-symbols-outlined" class:filled={active} aria-hidden="true">{icon}</span>
{/snippet}

{#if show}
	{#if moreOpen}
		<button
			type="button"
			class="scrim"
			aria-label="Close menu"
			onclick={() => (moreOpen = false)}
			transition:fade={{ duration: 160 }}
		></button>
		<div class="more" id="tabbar-more" role="menu" transition:fly={{ y: 24, duration: 220 }}>
			{#each MORE as link (link.href)}
				{@const href = hrefWithNsfw(resolve(link.href), page.url)}
				{@const active = isSiteLinkActive(link, path, href)}
				<a {href} role="menuitem" class:active aria-current={active ? 'page' : undefined}>
					{@render linkIcon(link.icon, active)}
					{link.label}
				</a>
			{/each}
			<button type="button" role="menuitem" onclick={toggleTheme}>
				<span class="theme-icon"><ThemeIcon /></span>
				Light / dark
			</button>
		</div>
	{/if}

	<nav class="tabbar" aria-label="Site">
		{#each TABS as link (link.href)}
			{@const href = hrefWithNsfw(resolve(link.href), page.url)}
			{@const active = isSiteLinkActive(link, path, href)}
			<a {href} class="tab" class:active aria-current={active ? 'page' : undefined}>
				{@render linkIcon(link.icon, active)}
				<span class="tab-label">{link.label}</span>
			</a>
		{/each}
		<button
			type="button"
			class="tab"
			class:active={moreActive || moreOpen}
			aria-expanded={moreOpen}
			aria-controls="tabbar-more"
			onclick={() => (moreOpen = !moreOpen)}
		>
			{@render linkIcon('more_horiz', moreActive || moreOpen)}
			<span class="tab-label">More</span>
		</button>
	</nav>
{/if}

<style>
	.tabbar,
	.more,
	.scrim {
		display: none;
	}

	@media (max-width: 720px) {
		.tabbar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 80;
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: minmax(0, 1fr);
			height: var(--tabbar-space);
			padding: 0 max(0.25rem, env(safe-area-inset-right, 0px))
				env(safe-area-inset-bottom, 0px) max(0.25rem, env(safe-area-inset-left, 0px));
			border-top: 1px solid var(--hairline);
			background: color-mix(in srgb, var(--bg) 84%, transparent);
			backdrop-filter: blur(22px) saturate(1.4);
			-webkit-backdrop-filter: blur(22px) saturate(1.4);
			font-family: var(--ui);
		}

		.tab {
			display: grid;
			place-items: center;
			align-content: center;
			gap: 0.12rem;
			min-width: 0;
			padding: 0;
			border: none;
			background: transparent;
			color: var(--fg-faint);
			text-decoration: none;
			cursor: pointer;
			-webkit-tap-highlight-color: transparent;
			transition: color 0.2s var(--ease);
		}

		.tab.active {
			color: var(--fg-strong);
		}

		.tab :global(.material-symbols-outlined) {
			font-size: 1.45rem;
		}

		.tab-label {
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.62rem;
			font-weight: 500;
			letter-spacing: var(--tracking-ui);
		}

		.filled {
			font-variation-settings:
				'FILL' 1,
				'wght' 400,
				'GRAD' 0,
				'opsz' 24;
		}

		.scrim {
			position: fixed;
			inset: 0;
			z-index: 78;
			display: block;
			padding: 0;
			border: none;
			background: rgba(0, 0, 0, 0.45);
		}

		.more {
			position: fixed;
			right: max(0.6rem, env(safe-area-inset-right, 0px));
			bottom: calc(var(--tabbar-space) + 0.5rem);
			z-index: 79;
			display: grid;
			min-width: 12.5rem;
			padding: 0.35rem;
			border: 1px solid var(--hairline);
			border-radius: 14px;
			background: var(--panel);
			box-shadow: var(--shadow-float);
			font-family: var(--ui);
		}

		.more a,
		.more button {
			display: flex;
			align-items: center;
			gap: 0.7rem;
			min-height: 2.9rem;
			padding: 0 0.75rem;
			border: none;
			border-radius: 10px;
			background: transparent;
			color: var(--fg);
			font: inherit;
			font-size: 0.9rem;
			letter-spacing: var(--tracking-ui);
			text-decoration: none;
			text-align: left;
			cursor: pointer;
		}

		.more a.active {
			background: color-mix(in srgb, var(--fg) 8%, transparent);
			color: var(--fg-strong);
		}

		.theme-icon {
			display: grid;
		}

		.theme-icon :global(.material-symbols-outlined) {
			grid-area: 1 / 1;
		}
	}
</style>
