<script lang="ts">
	import { page, navigating } from '$app/state';
	import { resolve } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { koChrome } from '$lib/uiLang';
	import { MENU_SECTIONS, PILL_LINKS, isSiteLinkActive, type SiteLink } from '$lib/siteLinks';

	/**
	 * `inline` keeps the pill in the flow (the chronicle's settings panel). Otherwise
	 * it floats centred over the page: the root layout renders that one for every
	 * page but the chronicle, and pages hold its room with `SiteNavSpace`.
	 */
	let { inline = false }: { inline?: boolean } = $props();

	const menuId = $props.id();

	/** Where we are going wins, so the highlight slides on click, not when the page lands. */
	let path = $derived(navigating.to?.url.pathname ?? page.url.pathname);
	let ko = $derived(koChrome());

	function entry(link: SiteLink) {
		const href = hrefWithNsfw(resolve(link.href), page.url);
		return {
			href,
			icon: link.icon,
			label: ko ? link.ko : link.label,
			/** The other language, under the label in the menu. */
			alt: ko ? link.label : link.ko,
			active: isSiteLinkActive(link, path, href)
		};
	}

	let links = $derived(PILL_LINKS.map(entry));
	let sections = $derived(
		MENU_SECTIONS.map((s) => ({ id: s.id, label: ko ? s.ko : s.en, links: s.links.map(entry) }))
	);
	let activeIndex = $derived(links.findIndex((link) => link.active));
	let menuActive = $derived(sections.some((s) => s.links.some((link) => link.active)));

	const anchors: HTMLAnchorElement[] = [];
	let moreButton = $state<HTMLButtonElement>();
	let menu = $state<HTMLDivElement>();
	let menuOpen = $state(false);
	let menuAt = $state({ top: 0, left: 0, maxHeight: 0 });

	/** The sliding highlight's box, in the nav's own coordinates. */
	let box = $state({ x: 0, y: 0, w: 0, h: 0 });
	let shown = $state(false);
	/** Off for the first placement, so the highlight appears in place instead of sliding in from 0. */
	let glide = $state(false);

	/** A page behind the ⋯ menu parks the highlight on the ⋯ button. */
	function place(index: number, onMenu: boolean) {
		const el = index >= 0 ? anchors[index] : onMenu ? moreButton : undefined;
		shown = !!el;
		if (!el) return;
		box = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
		if (!glide) requestAnimationFrame(() => (glide = true));
	}

	$effect(() => {
		place(activeIndex, menuActive);
	});

	/** Re-measure when the nav changes size (font swap, wrap in the settings panel, language). */
	const track: Attachment<HTMLElement> = (nav) => {
		const ro = new ResizeObserver(() => untrack(() => place(activeIndex, menuActive)));
		ro.observe(nav);
		return () => ro.disconnect();
	};

	/** Under the ⋯ button, right edges aligned, kept inside the viewport. */
	function positionMenu() {
		if (!moreButton || !menu) return;
		const r = moreButton.getBoundingClientRect();
		const vw = document.documentElement.clientWidth;
		/* Still hidden before it opens: fall back to the CSS width, min(31rem, 100vw - 1rem). */
		const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
		const w = menu.offsetWidth || Math.min(31 * rem, vw - 16);
		const top = r.bottom + 10;
		menuAt = {
			top,
			left: Math.min(Math.max(8, r.right - w), vw - w - 8),
			maxHeight: window.innerHeight - top - 12
		};
	}

	function menuItems(): HTMLAnchorElement[] {
		return menu ? [...menu.querySelectorAll<HTMLAnchorElement>('a[href]')] : [];
	}

	/** Placed before it paints, so it never flashes at the corner. */
	function onBeforeToggle(e: ToggleEvent) {
		if (e.newState === 'open') positionMenu();
	}

	function onToggle(e: ToggleEvent) {
		menuOpen = e.newState === 'open';
		if (!menuOpen) return;
		positionMenu();
		const items = menuItems();
		(items.find((a) => a.getAttribute('aria-current') === 'page') ?? items[0])?.focus({ preventScroll: true });
	}

	function closeMenu(refocus = false) {
		if (menu?.matches(':popover-open')) menu.hidePopover();
		if (refocus) moreButton?.focus();
	}

	/** Arrow keys walk the links; Escape or tabbing off either end closes it and hands focus back to ⋯. */
	function onMenuKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeMenu(true);
			return;
		}
		if (e.key === 'Tab') {
			const items = menuItems();
			const at = items.indexOf(document.activeElement as HTMLAnchorElement);
			const leaving = e.shiftKey ? at <= 0 : at === items.length - 1;
			if (leaving) {
				e.preventDefault();
				closeMenu(true);
			}
			return;
		}
		const keys: Record<string, (i: number, n: number) => number> = {
			ArrowDown: (i, n) => (i + 1) % n,
			ArrowRight: (i, n) => (i + 1) % n,
			ArrowUp: (i, n) => (i - 1 + n) % n,
			ArrowLeft: (i, n) => (i - 1 + n) % n,
			Home: () => 0,
			End: (_, n) => n - 1
		};
		const step = keys[e.key];
		if (!step) return;
		e.preventDefault();
		const items = menuItems();
		const at = items.indexOf(document.activeElement as HTMLAnchorElement);
		items[step(at < 0 ? 0 : at, items.length)]?.focus();
	}

	/* Keep the menu pinned to ⋯ while anything under it scrolls or resizes. */
	$effect(() => {
		if (!menuOpen) return;
		const follow = () => positionMenu();
		window.addEventListener('resize', follow);
		document.addEventListener('scroll', follow, { capture: true, passive: true });
		return () => {
			window.removeEventListener('resize', follow);
			document.removeEventListener('scroll', follow, { capture: true });
		};
	});

	afterNavigate(() => closeMenu());
</script>

<nav class="site-nav surface" class:inline aria-label={ko ? '사이트' : 'Site'} {@attach track}>
	<span
		class="indicator"
		class:shown
		class:glide
		style:width="{box.w}px"
		style:height="{box.h}px"
		style:transform="translate3d({box.x}px, {box.y}px, 0)"
		aria-hidden="true"
	></span>
	{#each links as link, i (link.href)}
		<a
			href={link.href}
			bind:this={anchors[i]}
			class:active={link.active}
			aria-current={link.active ? 'page' : undefined}>{link.label}</a
		>
	{/each}
	<button
		type="button"
		class="more"
		class:active={activeIndex < 0 && menuActive}
		class:open={menuOpen}
		bind:this={moreButton}
		popovertarget={menuId}
		aria-haspopup="true"
		aria-expanded={menuOpen}
		aria-controls={menuId}
		aria-label={ko ? '다른 페이지' : 'More pages'}
		title={ko ? '다른 페이지' : 'More pages'}
	>
		<span class="material-symbols-outlined" aria-hidden="true">more_horiz</span>
	</button>
</nav>

<div
	bind:this={menu}
	id={menuId}
	class="site-menu"
	popover="auto"
	role="dialog"
	tabindex="-1"
	aria-label={ko ? '다른 페이지' : 'More pages'}
	style:top="{menuAt.top}px"
	style:left="{menuAt.left}px"
	style:max-height="{menuAt.maxHeight}px"
	onbeforetoggle={onBeforeToggle}
	ontoggle={onToggle}
	onkeydown={onMenuKey}
>
	<p class="menu-kicker">{ko ? '다른 페이지' : 'More pages'}</p>
	{#each sections as section (section.id)}
		<section class="menu-section" aria-labelledby="{menuId}-{section.id}">
			<h2 id="{menuId}-{section.id}">{section.label}</h2>
			<ul>
				{#each section.links as link (link.href)}
					<li>
						<a
							href={link.href}
							class:active={link.active}
							aria-current={link.active ? 'page' : undefined}
							onclick={() => closeMenu()}
						>
							<span class="tile material-symbols-outlined" aria-hidden="true">{link.icon}</span>
							<span class="text">
								<span class="label">{link.label}</span>
								{#if link.alt !== link.label}<span class="alt" lang={ko ? 'en' : 'ko'}>{link.alt}</span>{/if}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

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

	.site-nav a,
	.more {
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

	.site-nav a:not(.active):hover,
	.more:not(.active):hover,
	.more.open:not(.active) {
		color: var(--fg-strong);
		background-color: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.site-nav a.active,
	.more.active {
		color: var(--on-highlight);
	}

	.site-nav a:focus-visible,
	.more:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
	}

	/* ⋯ stays at the pill's right end even when the links scroll under it. */
	.more {
		display: inline-grid;
		place-items: center;
		margin-left: 0.15rem;
		padding: 0;
		width: 2.45rem;
		height: 2.45rem;
		border: none;
		background: transparent;
		font: inherit;
		cursor: pointer;
	}

	.site-nav:not(.inline) .more {
		position: sticky;
		right: 0;
		box-shadow: -10px 0 10px -6px var(--panel);
	}

	.site-nav:not(.inline) .more:not(.active) {
		background-color: var(--panel);
	}

	.site-nav:not(.inline) .more:not(.active):hover,
	.site-nav:not(.inline) .more.open:not(.active) {
		background-color: color-mix(in srgb, var(--fg) 7%, var(--panel));
	}

	.more .material-symbols-outlined {
		font-size: 1.3rem;
	}

	/* ————— the ⋯ menu (top layer: no ancestor clips it) ————— */
	.site-menu {
		position: fixed;
		inset: auto;
		margin: 0;
		width: min(31rem, calc(100vw - 1rem));
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 0.85rem 0.6rem 0.6rem;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		border-radius: 20px;
		background: color-mix(in srgb, var(--panel) 86%, transparent);
		backdrop-filter: blur(18px) saturate(1.4);
		-webkit-backdrop-filter: blur(18px) saturate(1.4);
		box-shadow:
			var(--shadow-float),
			0 24px 60px -18px rgba(0, 0, 0, 0.55);
		color: var(--fg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		opacity: 0;
		transform: translateY(-6px) scale(0.98);
		transform-origin: top right;
		transition:
			opacity var(--duration-fast) var(--ease),
			transform var(--duration-normal) var(--ease-out),
			overlay var(--duration-normal) allow-discrete,
			display var(--duration-normal) allow-discrete;
	}

	.site-menu:popover-open {
		opacity: 1;
		transform: none;
	}

	@starting-style {
		.site-menu:popover-open {
			opacity: 0;
			transform: translateY(-6px) scale(0.98);
		}
	}

	.site-menu::backdrop {
		background: transparent;
	}

	.menu-kicker {
		margin: 0 0.55rem 0.55rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.menu-section + .menu-section {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--hairline);
	}

	.menu-section h2 {
		margin: 0.2rem 0.55rem 0.3rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.menu-section ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13.5rem, 1fr));
		gap: 0.1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.site-menu a {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		min-height: 2.9rem;
		padding: 0.35rem 0.55rem;
		border-radius: 12px;
		color: var(--fg);
		text-decoration: none;
		-webkit-tap-highlight-color: transparent;
		transition:
			background-color var(--duration-fast) var(--ease),
			color var(--duration-fast) var(--ease);
	}

	.site-menu a:hover,
	.site-menu a:focus-visible {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		color: var(--fg-strong);
		outline: none;
	}

	.site-menu a:focus-visible {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--gold) 70%, transparent);
	}

	.tile {
		display: inline-grid;
		place-items: center;
		flex: 0 0 auto;
		width: 2.1rem;
		height: 2.1rem;
		border-radius: 10px;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
		color: var(--fg-dim);
		font-size: 1.15rem;
		transition:
			background-color var(--duration-fast) var(--ease),
			color var(--duration-fast) var(--ease);
	}

	.site-menu a:hover .tile,
	.site-menu a:focus-visible .tile {
		color: var(--gold);
	}

	.site-menu a.active .tile {
		background: var(--highlight);
		color: var(--on-highlight);
	}

	.text {
		display: grid;
		min-width: 0;
	}

	.label {
		font-size: 0.86rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.alt {
		font-size: 0.72rem;
		color: var(--fg-faint);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator.glide {
			transition: opacity 0.2s var(--ease);
		}

		.site-menu {
			transform: none;
			transition: opacity var(--duration-fast) var(--ease);
		}
	}

	/* Phones navigate from the tab bar; the pill would only crowd the top. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav:not(.inline) {
			display: none;
		}

		.site-menu {
			border-radius: 16px;
		}

		.site-menu a {
			min-height: 3rem;
		}
	}
</style>
