<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { koChrome } from '$lib/uiLang';
	import { stagePath } from '$lib/stage/placeStage';
	import type { StageSite } from '$lib/stage/sites';

	/** "Open in 3D" for a site: the wiki preview, the map panel and the profile card share it. */
	let { site, tone = 'line' }: { site: StageSite; tone?: 'line' | 'glass' } = $props();

	let ko = $derived(koChrome());
	let href = $derived(hrefWithNsfw(resolve(stagePath(site.id)), page.url));
</script>

<a class="stage-link {tone}" {href} title={ko ? `${site.ko} 3D로 보기` : `Open ${site.en} on the 3D stage`}>
	<span class="material-symbols-outlined" aria-hidden="true">view_in_ar</span>
	{ko ? '3D로 보기' : 'Open in 3D'}
	<span class="material-symbols-outlined arrow" aria-hidden="true">arrow_outward</span>
</a>

<style>
	.stage-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.8rem 0.4rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--gold) 45%, var(--hairline));
		border-radius: 999px;
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		text-decoration: none;
		white-space: nowrap;
		color: var(--fg-strong);
		transition:
			background 200ms var(--ease),
			border-color 200ms var(--ease);
	}

	.stage-link .material-symbols-outlined {
		font-size: 1.05rem;
		color: var(--gold);
	}

	.stage-link .arrow {
		font-size: 0.9rem;
		color: inherit;
		opacity: 0.7;
	}

	.stage-link:hover,
	.stage-link:focus-visible {
		background: color-mix(in srgb, var(--gold) 14%, transparent);
		border-color: var(--gold);
		outline: none;
	}

	.stage-link:focus-visible {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--gold) 45%, transparent);
	}

	/* Over a picture or the live stage. */
	.stage-link.glass {
		border-color: rgba(255, 255, 255, 0.22);
		background: rgba(12, 12, 16, 0.55);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		color: #fafafa;
	}

	.stage-link.glass:hover,
	.stage-link.glass:focus-visible {
		background: rgba(12, 12, 16, 0.75);
		border-color: var(--gold);
	}
</style>
