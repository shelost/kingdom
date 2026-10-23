<script lang="ts">
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { profileNameOf } from '$lib/givenNames';
	import { koreanOf, titleOf, type Person } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';
	import {
		wikiBookCount,
		wikiBookCover,
		wikiBookOf,
		WIKI_BOOKS,
		type WikiBookId,
		type WikiBookSpec
	} from '$lib/wikiBooks';
	import type { WikiKind } from '$lib/wiki';

	let {
		kind = $bindable(),
		q = $bindable(),
		featured = [],
		onKind,
		onOpen
	}: {
		kind: WikiKind | 'all';
		q: string;
		featured?: Person[];
		onKind: () => void;
		onOpen: (id: string) => void;
	} = $props();

	const FEATURED_H = 16.4;

	let ko = $derived(reading.lang === 'ko');
	let book = $derived(wikiBookOf(kind));
	let cover = $derived(wikiBookCover(kind));
	let lead = $derived(featured[0] ?? null);
	let rest = $derived(featured.slice(1, 6));
	let shelf = $derived(WIKI_BOOKS.filter((b) => wikiBookCount(b.id) > 0));
	let chips = $derived(shelf);

	function labelOf(spec: WikiBookSpec): string {
		return ko ? spec.ko : spec.title;
	}

	function entryName(p: Person): string {
		if (ko) return koreanOf(p) || profileNameOf(p);
		return profileNameOf(p);
	}

	function pick(id: WikiBookId) {
		kind = id;
		onKind();
	}

	function openLead() {
		if (lead) onOpen(lead.id);
	}
</script>

<section class="library" aria-label={ui('Wiki')}>
	<div class="mast">
		<div class="intro">
			<p class="edition">{wikiBookCount('all').toLocaleString()} {ui('entries')}</p>
			<h1>{ui('Wiki')}</h1>
			<p class="lede">{ui('An open collection of every name in the chronicle.')}</p>
			<label class="search liquid-glass">
				<span class="sr">{ui('Search the wiki')}</span>
				<span class="search-icon material-symbols-outlined" aria-hidden="true">search</span>
				<input
					type="search"
					placeholder="{ui('Search the wiki')} — {wikiBookCount('all')}"
					bind:value={q}
					autocomplete="off"
				/>
			</label>
			<div class="trend" role="tablist" aria-label={ui('Categories')}>
				{#each chips as spec (spec.id)}
					<button
						type="button"
						role="tab"
						aria-selected={kind === spec.id}
						class:on={kind === spec.id}
						onclick={() => pick(spec.id)}
					>
						{labelOf(spec)}
					</button>
				{/each}
			</div>
		</div>

		<div class="stage">
			<button
				type="button"
				class="featured-book"
				onclick={openLead}
				disabled={!lead}
				aria-label={lead ? entryName(lead) : labelOf(book)}
			>
				<VolumePreview
					pose="stand"
					cover={cover}
					spine={book.spine}
					title={labelOf(book)}
					mark={cover ? '' : ko && book.id === 'all' ? '왕' : book.mark}
					height={FEATURED_H}
					ratio={book.ratio}
					thick={book.thick}
				/>
			</button>
		</div>

		<aside class="aside">
			<p class="kicker">{ui('Featured')}</p>
			{#if lead}
				<h2>{entryName(lead)}</h2>
				{#if titleOf(lead)}
					<p class="aside-sub">{titleOf(lead)}</p>
				{/if}
				<button type="button" class="read" onclick={openLead}>
					{ui('Read the article')}
					<span aria-hidden="true">→</span>
				</button>
				<ol>
					{#each rest as p, i (p.id)}
						<li>
							<button type="button" onclick={() => onOpen(p.id)}>
								<span class="n">{String(i + 2).padStart(2, '0')}</span>
								<span class="n-title">{entryName(p)}</span>
							</button>
						</li>
					{/each}
				</ol>
			{/if}
		</aside>
	</div>

	<div class="shelf-wrap">
		<div class="shelf-head">
			<p>{ui('Categories')}</p>
		</div>
		<div class="shelf">
			{#each shelf as spec (spec.id)}
				{@const on = kind === spec.id}
				<button
					type="button"
					class="vol"
					class:on
					style:--lift={on ? '1.35rem' : '0px'}
					onclick={() => pick(spec.id)}
					aria-pressed={on}
					aria-label={labelOf(spec)}
				>
					<VolumePreview
						pose={on ? 'stand' : 'spine'}
						cover={on ? wikiBookCover(spec.id) : undefined}
						spine={spec.spine}
						title={labelOf(spec)}
						mark={spec.mark}
						height={spec.height}
						ratio={spec.ratio}
						thick={spec.thick}
					/>
				</button>
			{/each}
		</div>
	</div>
</section>

<style>
	.library {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin: 0 calc(-1 * var(--gutter-r)) 1.6rem calc(-1 * var(--gutter-l));
		padding: 1.4rem var(--gutter-r) 0 var(--gutter-l);
		background: var(--bg);
	}

	.mast {
		display: grid;
		grid-template-columns: minmax(16rem, 1fr) minmax(14rem, 22rem) minmax(14rem, 18rem);
		align-items: center;
		gap: 2rem 2.4rem;
		min-height: clamp(26rem, 58svh, 36rem);
	}

	.intro {
		min-width: 0;
	}

	.edition {
		margin: 0 0 0.35rem;
		font-family: var(--ui);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.intro h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(3.6rem, 8vw, 5.8rem);
		font-weight: 400;
		font-style: italic;
		letter-spacing: -0.045em;
		line-height: 0.92;
		color: var(--fg-strong);
	}

	.lede {
		margin: 0.85rem 0 1.35rem;
		max-width: 22rem;
		font-size: 1.02rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.search {
		--glass-tint: 26%;
		--glass-sheen: 14%;
		position: relative;
		display: block;
		width: min(28rem, 100%);
		border-radius: var(--radius-pill);
		transition:
			--glass-tint 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	.search:hover {
		--glass-tint: 36%;
	}

	.search:focus-within {
		--glass-tint: 46%;
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.search-icon {
		position: absolute;
		left: 1.15rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.25rem;
		color: var(--fg-dim);
		pointer-events: none;
	}

	.search input {
		display: block;
		width: 100%;
		height: 3.15rem;
		padding: 0 1.3rem 0 3.1rem;
		border: 0;
		background: transparent;
		font-family: var(--ui);
		font-size: 0.98rem;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-strong);
		outline: none;
		appearance: none;
	}

	.search input::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	.search input::placeholder {
		color: var(--fg-dim);
	}

	.trend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1rem;
	}

	.trend button {
		height: 1.85rem;
		padding: 0 0.85rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.trend button.on,
	.trend button[aria-selected='true'] {
		border-color: color-mix(in srgb, var(--fg) 28%, transparent);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		color: var(--fg-strong);
	}

	.stage {
		display: grid;
		place-items: center;
		min-height: 22rem;
		perspective: 1400px;
	}

	.featured-book {
		border: 0;
		background: transparent;
		padding: 1.5rem 2.4rem 2.2rem;
		overflow: visible;
		transform-style: preserve-3d;
		cursor: pointer;
		color: inherit;
	}

	.featured-book:disabled {
		cursor: default;
	}

	.aside {
		min-width: 0;
		padding-block: 0.4rem;
	}

	.kicker {
		margin: 0 0 0.45rem;
		font-family: var(--ui);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.aside h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.8rem, 3vw, 2.5rem);
		font-weight: 400;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--fg-strong);
	}

	.aside-sub {
		margin: 0.45rem 0 0;
		font-size: 0.92rem;
		color: var(--fg-dim);
	}

	.read {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0.85rem 0 1.15rem;
		padding: 0;
		border: 0;
		background: transparent;
		font-family: var(--ui);
		font-size: 0.88rem;
		color: var(--fg);
		cursor: pointer;
	}

	.read:hover {
		color: var(--gold);
	}

	.aside ol {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--hairline);
	}

	.aside li + li {
		border-top: 1px solid var(--hairline);
	}

	.aside li button {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		width: 100%;
		padding: 0.55rem 0;
		border: 0;
		background: transparent;
		font: inherit;
		text-align: left;
		color: var(--fg);
		cursor: pointer;
	}

	.aside li button:hover .n-title {
		color: var(--gold);
	}

	.n {
		flex: 0 0 1.6rem;
		font-family: var(--ui);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		color: var(--fg-faint);
	}

	.n-title {
		font-family: var(--serif);
		font-size: 0.98rem;
		letter-spacing: -0.01em;
	}

	.shelf-wrap {
		margin-top: 0.4rem;
		padding: 0.85rem 0 0;
		border-top: 1px solid var(--hairline);
	}

	.shelf-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.35rem;
	}

	.shelf-head p {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		color: var(--fg-strong);
	}

	.shelf {
		display: flex;
		align-items: flex-end;
		gap: 0.12rem;
		min-height: 12.5rem;
		padding: 1.8rem 0.2rem 0.6rem;
		overflow: visible;
	}

	.vol {
		flex: 0 0 auto;
		display: grid;
		place-items: end center;
		padding: 0;
		border: 0;
		background: transparent;
		transform: translateY(calc(-1 * var(--lift, 0px)));
		transition: transform 0.35s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
		cursor: pointer;
		z-index: 0;
	}

	.vol.on {
		z-index: 2;
		padding-inline: 0.55rem;
	}

	@media (max-width: 1080px) {
		.mast {
			grid-template-columns: 1fr 1fr;
			min-height: 0;
		}

		.aside {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 720px) {
		.mast {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}

		.intro h1 {
			font-size: 3.4rem;
		}

		.stage {
			min-height: 16rem;
		}

		.shelf {
			min-height: 10.5rem;
		}
	}
</style>
