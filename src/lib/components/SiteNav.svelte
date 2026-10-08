<script lang="ts">
	import { page, navigating } from '$app/state';
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { toggleTheme } from '$lib/themeUi.svelte';
	import { PILL_LINKS, isSiteLinkActive } from '$lib/siteLinks';
	import ThemeIcon from './ThemeIcon.svelte';

	/**
	 * `inline` keeps the pill in the flow (the chronicle's settings panel). Otherwise
	 * it floats centred over the page: the root layout renders that one for every
	 * page but the chronicle, and pages hold its room with `SiteNavSpace`.
	 */
	let { inline = false }: { inline?: boolean } = $props();

	/** Where we are going wins, so the highlight slides on click, not when the page lands. */
	let path = $derived(navigating.to?.url.pathname ?? page.url.pathname);
	let links = $derived(
		PILL_LINKS.map((link) => {
			const href = hrefWithNsfw(resolve(link.href), page.url);
			return { label: link.label, href, active: isSiteLinkActive(link, path, href) };
		})
	);
	let activeIndex = $derived(links.findIndex((link) => link.active));

	const anchors: HTMLAnchorElement[] = [];
	/** The sliding highlight's box, in the nav's own coordinates. */
	let box = $state({ x: 0, y: 0, w: 0, h: 0 });
	let shown = $state(false);
	/** Off for the first placement, so the highlight appears in place instead of sliding in from 0. */
	let glide = $state(false);

	function place(index: number) {
		const a = anchors[index];
		shown = !!a;
		if (!a) return;
		box = { x: a.offsetLeft, y: a.offsetTop, w: a.offsetWidth, h: a.offsetHeight };
		if (!glide) requestAnimationFrame(() => (glide = true));
	}

	$effect(() => {
		place(activeIndex);
	});

	/** Re-measure when the nav changes size (font swap, wrap in the settings panel). */
	const track: Attachment<HTMLElement> = (nav) => {
		const ro = new ResizeObserver(() => place(untrack(() => activeIndex)));
		ro.observe(nav);
		return () => ro.disconnect();
	};
</script>

{#if !inline}
	<div class="nav-blur" aria-hidden="true"></div>
{/if}
<nav class="site-nav liquid-glass" class:inline aria-label="Site" {@attach track}>
	<span
		class="indicator"
		class:shown
		class:glide
		style:width="{box.w}px"
		style:height="{box.h}px"
		style:transform="translate3d({box.x}px, {box.y}px, 0)"
		aria-hidden="true"
	></span>
	{#each links as link, i (link.label)}
		<a
			href={link.href}
			bind:this={anchors[i]}
			class:active={link.active}
			aria-current={link.active ? 'page' : undefined}>{link.label}</a
		>
	{/each}
	{#if !inline}
		<button
			type="button"
			class="theme-toggle"
			onclick={toggleTheme}
			aria-label="Toggle light and dark mode"
			title="Toggle light and dark mode"
		>
			<ThemeIcon />
		</button>
	{/if}
</nav>

<style>
	/* ————— Liquid glass (app.css): one pill, the links as segments inside it ————— */
	.site-nav {
		--glide: 0.5s cubic-bezier(0.32, 0.72, 0, 1);
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		padding: 0.25rem;
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		border-radius: var(--radius-pill);
		contain: layout style;
	}

	/* Content scrolling under the floating nav blurs out instead of colliding with it. */
	.nav-blur {
		position: fixed;
		z-index: 94;
		inset: 0 0 auto;
		height: calc(max(0.75rem, env(safe-area-inset-top, 0px)) + 3.5rem);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		mask-image: linear-gradient(to bottom, black 55%, transparent);
		pointer-events: none;
	}

	.site-nav:not(.inline) {
		--glass-tint: 34%;
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, white 55%, transparent),
			inset 0 -1px 0 color-mix(in srgb, white 12%, transparent);
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

	/* One highlight for the whole nav; it glides to the active link on the compositor. */
	.indicator {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		border-radius: var(--radius-pill);
		background: var(--highlight);
		box-shadow: 0 2px 8px -2px color-mix(in srgb, var(--highlight) 60%, transparent);
		opacity: 0;
		pointer-events: none;
		will-change: transform;
		transition: opacity 0.25s var(--ease);
	}

	.indicator.shown {
		opacity: 1;
	}

	.indicator.glide {
		transition:
			transform var(--glide),
			width var(--glide),
			height var(--glide),
			opacity 0.25s var(--ease);
	}

	.site-nav a {
		position: relative;
		z-index: 1;
		flex: 0 0 auto;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		white-space: nowrap;
		color: var(--fg-dim);
		padding: 0.4rem 0.8rem;
		border-radius: var(--radius-pill);
		-webkit-tap-highlight-color: transparent;
		transition:
			color 0.3s var(--ease),
			background-color 0.2s var(--ease);
	}

	.site-nav a:not(.active):hover {
		color: var(--fg-strong);
		background-color: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.site-nav a.active {
		color: var(--on-highlight);
	}

	.site-nav a:focus-visible,
	.theme-toggle:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	.theme-toggle {
		position: relative;
		z-index: 1;
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
			background-color 0.25s var(--ease);
	}

	.theme-toggle:hover {
		color: var(--fg-strong);
		background-color: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.theme-toggle :global(.material-symbols-outlined) {
		grid-area: 1 / 1;
		font-size: 1rem;
		font-variation-settings: 'wght' 500;
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator.glide {
			transition: opacity 0.2s var(--ease);
		}
	}

	/* Phones navigate from the tab bar; the pill would only crowd the top. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav:not(.inline),
		:global(html.has-tabbar) .nav-blur {
			display: none;
		}
	}
</style>
