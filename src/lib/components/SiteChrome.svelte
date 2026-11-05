<script lang="ts">
	import { toggleTheme } from '$lib/themeUi.svelte';
	import LangSwitch from './LangSwitch.svelte';
	import ThemeIcon from './ThemeIcon.svelte';
</script>

<div class="site-chrome" role="group" aria-label="Language and theme">
	<LangSwitch />
	<button
		type="button"
		class="theme-toggle"
		onclick={toggleTheme}
		aria-label="Toggle light and dark mode"
		title="Toggle light and dark mode"
	>
		<ThemeIcon />
	</button>
</div>

<style>
	.site-chrome {
		position: fixed;
		z-index: 96;
		top: max(1rem, env(safe-area-inset-top, 0px));
		right: max(1rem, env(safe-area-inset-right, 0px));
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		border: 1px solid var(--hairline);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.theme-toggle {
		display: inline-grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.theme-toggle:hover,
	.theme-toggle:focus-visible {
		color: var(--fg-strong);
		outline: none;
	}

	.theme-toggle:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.theme-toggle :global(.material-symbols-outlined) {
		font-size: 1.15rem;
	}

	.site-chrome :global(.langs) {
		margin-left: 0;
	}

	@media (max-width: 720px) {
		.site-chrome {
			top: max(0.65rem, env(safe-area-inset-top, 0px));
			right: max(0.65rem, env(safe-area-inset-right, 0px));
			padding: 0.25rem;
			gap: 0.2rem;
		}
	}
</style>
