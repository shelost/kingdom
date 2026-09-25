<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goToEpisodeById, reading, requestStoryJump, setViewScope } from '$lib/reading.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { groupStoryHits, searchStory, type StorySearchHit } from '$lib/storySearch';

	let { placement = 'hud' }: { placement?: 'hud' | 'toc' } = $props();

	let draft = $state('');
	let query = $state('');
	let open = $state(false);
	let active = $state(0);
	let root: HTMLDivElement | undefined;
	let debounce: ReturnType<typeof setTimeout> | undefined;

	let hits = $derived.by(() => (query.trim() ? searchStory(query) : []));
	let groups = $derived.by(() => groupStoryHits(hits));
	let flat = $derived(hits);
	let showPanel = $derived(open && query.trim().length > 0);

	function setDraft(value: string) {
		draft = value;
		if (debounce) clearTimeout(debounce);
		debounce = setTimeout(() => {
			query = draft;
			active = 0;
		}, 180);
	}

	function close() {
		open = false;
		draft = '';
		query = '';
		active = 0;
		if (debounce) clearTimeout(debounce);
	}

	function jump(hit: StorySearchHit) {
		const onStory = page.url.pathname === '/' || page.url.pathname === '';
		if (reading.viewScope !== 'episodes') setViewScope('episodes');
		const keepToc = placement === 'toc';
		if (!keepToc) tocUi.open = false;
		if (onStory) {
			goToEpisodeById(hit.destId, { closeToc: !keepToc });
		} else {
			requestStoryJump(hit.destId);
			const home = hrefWithNsfw(resolve('/'), page.url);
			void goto(home, { noScroll: true, invalidateAll: false });
		}
		close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			if (showPanel || draft) {
				close();
				e.stopPropagation();
			}
			return;
		}
		if (!showPanel || !flat.length) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = (active + 1) % flat.length;
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = (active - 1 + flat.length) % flat.length;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			const hit = flat[active];
			if (hit) jump(hit);
		}
	}

	function onWindowPointerDown(e: PointerEvent) {
		if (!open || !root) return;
		const t = e.target;
		if (t instanceof Node && !root.contains(t)) open = false;
	}

	function kindLabel(kind: StorySearchHit['kind']) {
		if (kind === 'quote') return 'quote';
		if (kind === 'dialogue') return 'spoken';
		if (kind === 'scene') return 'scene';
		if (kind === 'title') return 'title';
		if (kind === 'sequence') return 'film';
		return 'script';
	}
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

<div class="hud-search" class:toc={placement === 'toc'} bind:this={root} class:open={showPanel}>
	<label class="field">
		<span class="material-symbols-outlined" aria-hidden="true">search</span>
		<input
			type="search"
			placeholder="Scenes & quotes"
			autocomplete="off"
			spellcheck="false"
			aria-label="Search scenes and script quotes"
			aria-expanded={showPanel}
			aria-controls="hud-search-results"
			tabindex={scriptUi.inScript ? 0 : -1}
			value={draft}
			onfocus={() => (open = true)}
			oninput={(e) => {
				open = true;
				setDraft(e.currentTarget.value);
			}}
			onkeydown={onKeydown}
		/>
	</label>

	{#if showPanel}
		<div id="hud-search-results" class="panel" role="listbox" aria-label="Matching scenes">
			{#if !groups.length}
				<p class="empty">No scenes match.</p>
			{:else}
				{#each groups as g (g.episodeId)}
					<p class="ep">
						{g.episodeTitle}{#if g.episodeKo}<span class="ko">{g.episodeKo}</span>{/if}
					</p>
					{#each g.hits as hit (hit.destId + hit.kind + hit.snippet)}
						{@const i = flat.indexOf(hit)}
						<button
							type="button"
							role="option"
							class="hit"
							class:on={i === active}
							aria-selected={i === active}
							onmouseenter={() => (active = i)}
							onclick={() => jump(hit)}
						>
							<span class="meta">
								<span class="kind">{kindLabel(hit.kind)}</span>
								{#if hit.sceneTitle}
									<span class="scene">{hit.sceneTitle}</span>
								{/if}
							</span>
							<span class="snip">{hit.snippet}</span>
						</button>
					{/each}
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.hud-search {
		position: relative;
		flex: 1 1 12rem;
		min-width: 8.5rem;
		max-width: min(22rem, 46vw);
		font-family: var(--ui);
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
	}

	.field {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 1.85rem;
		padding: 0.18rem 0.65rem 0.18rem 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		backdrop-filter: blur(14px);
	}

	.field .material-symbols-outlined {
		font-size: 1rem;
		color: var(--fg-faint);
	}

	.field input {
		flex: 1;
		min-width: 0;
		font: inherit;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		color: var(--fg);
		background: transparent;
		border: none;
		outline: none;
	}

	.field input::placeholder {
		color: var(--fg-faint);
	}

	.field:focus-within {
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.panel {
		position: absolute;
		top: calc(100% + 0.4rem);
		right: 0;
		width: min(26rem, 88vw);
		max-height: min(22rem, 55vh);
		overflow: auto;
		padding: 0.45rem 0.35rem;
		border: 1px solid var(--hairline);
		border-radius: 0.85rem;
		background: var(--glass);
		backdrop-filter: blur(18px);
		box-shadow: 0 18px 40px color-mix(in srgb, var(--bg) 70%, transparent);
		z-index: 4;
		text-align: left;
	}

	.ep {
		margin: 0.35rem 0.45rem 0.2rem;
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.ep .ko {
		margin-left: 0.4rem;
		text-transform: none;
		letter-spacing: 0;
	}

	.empty {
		margin: 0.4rem 0.55rem;
		font-size: 0.72rem;
		color: var(--fg-dim);
	}

	.hit {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		width: 100%;
		padding: 0.4rem 0.55rem;
		border: none;
		border-radius: 0.55rem;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.hit.on,
	.hit:hover {
		background: color-mix(in srgb, var(--gold) 14%, transparent);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: baseline;
	}

	.kind {
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.scene {
		font-size: 0.7rem;
		color: var(--fg);
	}

	.snip {
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.hud-search.toc {
		flex: none;
		width: 100%;
		min-width: 0;
		max-width: none;
		letter-spacing: -0.035em;
	}

	.hud-search.toc .field input {
		letter-spacing: -0.035em;
	}

	.hud-search.toc .panel {
		left: 0;
		right: auto;
		width: 100%;
		max-height: min(18rem, 42vh);
	}

	@media (max-width: 700px) {
		.hud-search:not(.toc) {
			flex: 1 1 100%;
			max-width: 100%;
			order: -1;
		}

		.hud-search:not(.toc) .panel {
			width: min(100vw - 2rem, 26rem);
		}
	}
</style>
