<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';
	import {
		wikiBookCount,
		WIKI_BOOKS,
		type WikiBookId,
		type WikiBookSpec
	} from '$lib/wikiBooks';
	import {
		filterProfiles,
		kindOf,
		wikiSubsOf,
		wikiSubCount,
		type WikiKind,
		type WikiSubSpec
	} from '$lib/wiki';

	let {
		kind = $bindable(),
		sub = $bindable('all'),
		q = $bindable(),
		onKind,
		onSub
	}: {
		kind: WikiKind | 'all';
		sub: string | 'all';
		q: string;
		onKind: () => void;
		onSub?: () => void;
	} = $props();

	let ko = $derived(reading.lang === 'ko');
	let searching = $derived(q.trim().length > 0);
	let chips = $derived(WIKI_BOOKS.filter((b) => wikiBookCount(b.id) > 0));
	let subs = $derived(wikiSubsOf(kind));
	let matchCounts = $derived.by(() => {
		const counts = {} as Record<WikiBookId, number>;
		for (const spec of WIKI_BOOKS) counts[spec.id] = 0;
		if (!q.trim()) {
			for (const spec of WIKI_BOOKS) counts[spec.id] = wikiBookCount(spec.id);
			return counts;
		}
		const hits = filterProfiles({
			kind: 'all',
			sub: 'all',
			kingdom: 'all',
			tag: 'all',
			story: 'all',
			gender: 'all',
			art: 'all',
			q
		});
		counts.all = hits.length;
		for (const p of hits) {
			const k = kindOf(p);
			counts[k] = (counts[k] ?? 0) + 1;
		}
		return counts;
	});
	let allHits = $derived(matchCounts.all ?? 0);
	let kindHits = $derived(matchCounts[kind] ?? 0);
	let hiddenHits = $derived(searching && kind !== 'all' ? Math.max(0, allHits - kindHits) : 0);

	function chipCount(id: WikiBookId): number {
		return matchCounts[id] ?? 0;
	}

	function subCount(id: string | 'all'): number {
		return wikiSubCount(kind, id);
	}

	function onSearchKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && q) {
			e.preventDefault();
			q = '';
		}
	}

	function clearSearch() {
		q = '';
	}

	function labelOf(spec: WikiBookSpec): string {
		return ko ? spec.ko : spec.title;
	}

	function subLabel(spec: WikiSubSpec): string {
		return ko ? spec.ko : spec.en;
	}

	function pick(id: WikiBookId) {
		kind = id;
		sub = 'all';
		onKind();
	}

	function pickSub(id: string | 'all') {
		sub = id;
		onSub?.();
	}
</script>

<section class="library" aria-label={ui('Wiki')}>
	<div class="mast">
		<div class="search">
			<label class="search-field">
				<span class="sr">{ui('Search the wiki')}</span>
				<input
					type="search"
					placeholder={ui('Search the wiki')}
					bind:value={q}
					autocomplete="off"
					spellcheck="false"
					enterkeyhint="search"
					onkeydown={onSearchKey}
				/>
			</label>
			{#if searching}
				<span class="search-count" aria-live="polite">{kindHits}</span>
				<button type="button" class="search-clear" onclick={clearSearch} aria-label={ui('Clear search')}>
					<span class="material-symbols-outlined" aria-hidden="true">close</span>
				</button>
			{/if}
		</div>
		{#if hiddenHits > 0}
			<button type="button" class="widen" onclick={() => pick('all')}>
				{hiddenHits}
				{ui('more outside this category')}
				<span aria-hidden="true">·</span>
				{ui('Search all')}
			</button>
		{/if}
		<div class="trend" role="tablist" aria-label={ui('Categories')}>
			{#each chips as spec (spec.id)}
				{@const n = chipCount(spec.id)}
				<button
					type="button"
					role="tab"
					aria-selected={kind === spec.id}
					class:on={kind === spec.id}
					class:empty={searching && n === 0}
					onclick={() => pick(spec.id)}
				>
					<span class="material-symbols-outlined chip-icon" aria-hidden="true">{spec.icon}</span>
					{labelOf(spec)}
					<span class="chip-n">{n}</span>
				</button>
			{/each}
		</div>
		{#if subs.length}
			<div class="subtrend" role="tablist" aria-label={ui('Subcategories')}>
				<button
					type="button"
					role="tab"
					aria-selected={sub === 'all'}
					class:on={sub === 'all'}
					onclick={() => pickSub('all')}
				>
					<span class="material-symbols-outlined chip-icon" aria-hidden="true">select_all</span>
					{ui('All')}
					<span class="chip-n">{subCount('all')}</span>
				</button>
				{#each subs as spec (spec.id)}
					{@const n = subCount(spec.id)}
					<button
						type="button"
						role="tab"
						aria-selected={sub === spec.id}
						class:on={sub === spec.id}
						class:empty={n === 0}
						onclick={() => pickSub(spec.id)}
					>
						{#if spec.icon}
							<span class="material-symbols-outlined chip-icon" aria-hidden="true">{spec.icon}</span>
						{/if}
						{subLabel(spec)}
						<span class="chip-n">{n}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.library {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0 calc(-1 * var(--gutter-r)) 1.85rem calc(-1 * var(--gutter-l));
		padding: 0.85rem var(--gutter-r) 0.2rem var(--gutter-l);
		background: var(--bg);
	}

	.mast {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.1rem;
		min-height: 0;
		padding: 1.15rem 0 0.85rem;
	}

	.search {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		width: min(36rem, 100%);
		min-height: 3.45rem;
		padding: 0.35rem 0 0.55rem;
		border: 0;
		background: transparent;
		overflow: visible;
	}

	.search-field {
		position: relative;
		flex: 1 1 auto;
		min-width: 0;
		overflow: visible;
	}

	.search input {
		display: block;
		width: 100%;
		height: auto;
		min-height: 3.25rem;
		padding: 0.4rem 0 0.55rem;
		border: 0;
		background: transparent;
		font-family: var(--serif);
		font-size: clamp(1.55rem, 3.2vw, 2.05rem);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.35;
		text-align: center;
		color: var(--fg-strong);
		outline: none;
		appearance: none;
		overflow: visible;
		&::-webkit-search-decoration, &::-webkit-search-cancel-button {
			-webkit-appearance: none;
		}
		&::placeholder {
			font-weight: 500;
			color: color-mix(in srgb, var(--fg-faint) 88%, transparent);
		}
	}

	.search-count {
		flex: 0 0 auto;
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--fg-dim);
		font-variant-numeric: tabular-nums;
	}

	.search-clear {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
		&:hover {
			color: var(--fg-strong);
		}
		& .material-symbols-outlined {
			font-size: 1.15rem;
		}
	}

	.widen {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		font-family: var(--ui);
		font-size: 0.78rem;
		color: var(--gold);
		cursor: pointer;
	}

	.trend,
	.subtrend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.28rem 0.3rem;
		width: min(42rem, 100%);
		max-width: 42rem;
		padding: 0.15rem 0 0.35rem;
	}

	.subtrend {
		width: min(36rem, 100%);
		max-width: 36rem;
		padding-top: 0;
		margin-top: -0.55rem;
	}

	.trend button,
	.subtrend button {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.28rem;
		height: 1.7rem;
		padding: 0 0.55rem 0 0.48rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 40%, transparent);
		font-family: var(--ui);
		font-size: 0.64rem;
		letter-spacing: 0.035em;
		color: var(--fg-dim);
		cursor: pointer;
		white-space: nowrap;
	}

	.subtrend button {
		height: 1.5rem;
		font-size: 0.6rem;
		padding: 0 0.48rem 0 0.42rem;
		border-style: dashed;
	}

	.chip-icon {
		font-size: 0.85rem;
		line-height: 1;
		font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 20;
		opacity: 0.72;
		.subtrend & {
			font-size: 0.78rem;
		}
		.trend button.on &, .subtrend button.on & {
			opacity: 0.92;
		}
	}

	.trend button.on,
	.trend button[aria-selected='true'],
	.subtrend button.on,
	.subtrend button[aria-selected='true'] {
		border-color: color-mix(in srgb, var(--fg) 32%, transparent);
		background: color-mix(in srgb, var(--fg) 10%, transparent);
		color: var(--fg-strong);
		border-style: solid;
	}

	.trend button.empty,
	.subtrend button.empty {
		opacity: 0.38;
	}

	.chip-n {
		font-size: 0.56rem;
		letter-spacing: 0.03em;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
		.trend button.on &, .subtrend button.on & {
			color: var(--fg-dim);
		}
	}

	@media (max-width: 720px) {
		.library {
			padding-top: 0.55rem;
		}
		.mast {
			gap: 0.85rem;
			padding: 0.85rem 0 0.55rem;
		}
		.search {
			min-height: 3.05rem;
			width: 100%;
			& input {
				min-height: 2.9rem;
				padding: 0.35rem 0 0.5rem;
				font-size: clamp(1.4rem, 6vw, 1.75rem);
			}
		}
		.trend,
		.subtrend {
			width: 100%;
			max-width: none;
		}
	}
</style>
