<!-- Holds the floating site pill's height in a page header (the pill itself lives in the root layout). -->
<div class="site-nav-space" aria-hidden="true"></div>

<style>
	.site-nav-space {
		flex: 0 0 auto;
		height: 2.85rem;
	}

	/* A page's separator dot after the nav has nothing beside it once the pill floats. */
	.site-nav-space + :global(.dot) {
		display: none;
	}

	/* Phones navigate from the tab bar, where the pill is hidden too. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .site-nav-space {
			display: none;
		}
	}
</style>
