<!--
  Icon visibility is CSS-driven from html[data-theme] so SSR and the
  pre-paint boot script never disagree (avoids hydration mismatch).
-->
<span class="material-symbols-outlined icon-for-dark" aria-hidden="true">light_mode</span>
<span class="material-symbols-outlined icon-for-light" aria-hidden="true">dark_mode</span>

<style>
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
