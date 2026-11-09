<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { koChrome } from '$lib/uiLang';
	import { stagePath } from '$lib/stage/placeStage';
	import type { StageSite } from '$lib/stage/sites';

	/** "Open in 3D" for a site: the wiki preview, the map panel and the profile card share it. */
	let { site, year, view, tone = 'line' }: { site: StageSite; year?: number; view?: string; tone?: 'line' | 'glass' } = $props();

	let ko = $derived(koChrome());
	let title = $derived(ko ? `${site.ko} 3D로 보기` : `Open ${site.en} on the 3D stage`);
	/** Year and camera ride inside the route string so `resolve()` still owns the href. */
	let target = $derived.by(() => {
		const extra = [year == null ? '' : `year=${year}`, view && view !== 'board' ? `view=${view}` : ''].filter(Boolean).join('&');
		const path = (extra ? `${stagePath(site.id)}&${extra}` : stagePath(site.id)) as ReturnType<typeof stagePath>;
		return hrefWithNsfw(path, page.url) as ReturnType<typeof stagePath>;
	});
</script>

<a class="stage-link {tone}" href={resolve(target)} {title}>
	<span class="material-symbols-outlined" aria-hidden="true">view_in_ar</span>
	{ko ? '3D로 보기' : 'Open in 3D'}
	<span class="material-symbols-outlined arrow" aria-hidden="true">arrow_outward</span>
</a>

<style lang="scss">
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
		transition: background 200ms var(--ease), border-color 200ms var(--ease);
		& .material-symbols-outlined {
			font-size: 1.05rem;
			color: var(--gold);
		}
		& .arrow {
			font-size: 0.9rem;
			color: inherit;
			opacity: 0.7;
		}
		&:hover, &:focus-visible {
			background: color-mix(in srgb, var(--gold) 14%, transparent);
			border-color: var(--gold);
			outline: none;
		}
		&:focus-visible {
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--gold) 45%, transparent);
		}
		&.glass {
			/* Over a picture or the live stage. */
			border-color: rgba(255, 255, 255, 0.22);
			background: rgba(12, 12, 16, 0.55);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
			color: #fafafa;
			&:hover, &:focus-visible {
				background: rgba(12, 12, 16, 0.75);
				border-color: var(--gold);
			}
		}
	}
</style>
