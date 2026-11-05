<script lang="ts">
	import { page, navigating } from '$app/state';
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { PILL_LINKS, isSiteLinkActive } from '$lib/siteLinks';

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

<nav class="site-nav surface" class:inline aria-label="Site" {@attach track}>
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
</nav>

<style>
	/* Opaque floating pill — segments glide under a solid highlight. */
	.site-nav {
		--glide: var(--duration-slow) var(--ease-out);
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		border-radius: var(--radius-pill);
		contain: layout style;
	}

	.site-nav:not(.inline) {
		position: fixed;
		z-index: 95;
		top: max(1rem, env(safe-area-inset-top, 0px));
		left: 50%;
		transform: translateX(-50%);
		max-width: calc(100vw - 2rem);
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
		font-size: 0.84rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		white-space: nowrap;
		color: var(--fg-dim);
		padding: 0.6rem 1.15rem;
		border-radius: var(--radius-pill);
		-webkit-tap-highlight-color: transparent;
		transition:
			color var(--duration-normal) var(--ease),
			background-color var(--duration-fast) var(--ease);
	}

	.site-nav a:not(.active):hover {
		color: var(--fg-strong);
		background-color: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.site-nav a.active {
		color: var(--on-highlight);
	}

	.site-nav a:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator.glide {
			transition: opacity 0.2s var(--ease);
		}
	}

	/* Phones navigate from the tab bar; the pill would only crowd the top. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav:not(.inline) {
			display: none;
		}
	}
</style>
