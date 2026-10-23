<script lang="ts">
	import { editUi } from '$lib/editUi.svelte';
	import {
		isCover,
		isCoverPreview,
		posterAlts,
		previewCover,
		setCover
	} from '$lib/posters.svelte';
	import { ui } from '$lib/uiLang';

	let {
		id,
		layout = 'rail',
		persist = false
	}: {
		id: string;
		/** rail = horizontal scroller (/books). stack = vertical column (title page). */
		layout?: 'rail' | 'stack';
		persist?: boolean;
	} = $props();

	let alts = $derived(posterAlts(id));
</script>

{#if alts.length}
	<section class="covers" class:stack={layout === 'stack'} class:strip={layout === 'rail'}>
		<h3>{ui('Covers')}</h3>
		<div class="scroller">
			<ul>
				{#each alts as file (file)}
					<li>
						<button
							type="button"
							class="thumb"
							class:on={isCover(id, file)}
							class:preview={isCoverPreview(id, file)}
							onclick={() => previewCover(id, file)}
						>
							<img src="/posters/alts/{id}/{file}" alt="" />
							<span class="fn">{file.replace(/\.jpg$/i, '')}</span>
						</button>
						{#if persist}
							<button
								type="button"
								class="set"
								disabled={isCover(id, file) || !!editUi.busyId}
								onclick={() => setCover(id, file)}
							>
								{isCover(id, file) ? ui('Cover') : ui('Set as cover')}
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.covers {
		position: relative;
		min-width: 0;
		font-family: var(--ui);
	}

	h3 {
		margin: 0 0 0.4rem;
		font: inherit;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.strip .scroller {
		margin: 0 -0.85rem 0 -0.25rem;
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
		padding: 0.15rem 0.85rem 0.35rem 0.25rem;
		scrollbar-width: thin;
	}

	.strip ul {
		display: flex;
		flex-wrap: nowrap;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
		width: max-content;
	}

	.strip li {
		flex: 0 0 5.4rem;
		width: 5.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		min-width: 0;
	}

	.stack .scroller {
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		max-height: calc(100dvh - 9rem);
		padding: 0.1rem 0.35rem 0.4rem 0;
		scrollbar-width: thin;
	}

	.stack ul {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stack li {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		min-width: 0;
	}

	.thumb {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 4px;
		background: none;
		color: inherit;
		cursor: pointer;
	}

	.thumb.on {
		border-color: var(--gold);
	}

	.thumb.preview:not(.on) {
		border-color: color-mix(in srgb, var(--gold) 50%, transparent);
	}

	.thumb:hover,
	.thumb:focus-visible {
		outline: none;
		border-color: var(--gold);
	}

	.thumb img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		object-position: center 18%;
		border-radius: 2px;
	}

	.fn {
		font-size: 0.58rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.set {
		padding: 0.18rem 0.2rem;
		border: 0;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--gold) 18%, transparent);
		color: var(--fg);
		font: inherit;
		font-size: 0.58rem;
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	.set:hover:not(:disabled),
	.set:focus-visible:not(:disabled) {
		background: color-mix(in srgb, var(--gold) 32%, transparent);
		color: var(--fg-strong);
		outline: none;
	}

	.set:disabled {
		opacity: 0.55;
		cursor: default;
	}
</style>
