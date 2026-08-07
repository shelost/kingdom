<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		PROFILES,
		byId,
		avatarOf,
		nameOf,
		titleOf,
		koreanOf,
		isPlaceholderArt,
		KINGDOMS,
		colorOf,
		hangulInitial
	} from '$lib/people';
	import {
		WIKI_KINDS,
		WIKI_KINGDOMS,
		WIKI_TOTAL,
		kindOf,
		kindLabel,
		filterProfiles,
		groupByKind,
		type WikiKind,
		type WikiFilters
	} from '$lib/wiki';
	import WikiDetail from '$lib/components/WikiDetail.svelte';
	import type { Snapshot } from './$types';

	const INDEX_SCROLL_KEY = 'wiki:indexScroll';
	const DETAIL_SCROLL_KEY = 'wiki:detailScroll';
	const FILTERS_KEY = 'wiki:filters';

	let kind = $state<WikiFilters['kind']>('all');
	let kingdom = $state<WikiFilters['kingdom']>('all');
	let q = $state('');
	let expanded = $state(false);
	let detailScrollEl = $state<HTMLElement | undefined>(undefined);
	/** Per-entry detail scroll tops while hopping related links. */
	let detailScrollById = $state<Record<string, number>>({});

	/** Deep-linkable selection via ?id= — opens overlay, index stays mounted. */
	let selectedId = $derived(page.url.searchParams.get('id'));
	let selected = $derived(selectedId ? (byId.get(selectedId) ?? null) : null);
	let missing = $derived(!!selectedId && !selected);

	let filtered = $derived(filterProfiles({ kind, kingdom, q }));
	let groups = $derived(groupByKind(filtered));

	function readStoredFilters() {
		if (!browser) return;
		try {
			const raw = sessionStorage.getItem(FILTERS_KEY);
			if (!raw) return;
			const v = JSON.parse(raw) as Partial<WikiFilters>;
			if (v.kind) kind = v.kind;
			if (v.kingdom) kingdom = v.kingdom;
			if (typeof v.q === 'string') q = v.q;
		} catch {
			/* ignore */
		}
	}

	function persistFilters() {
		if (!browser) return;
		sessionStorage.setItem(FILTERS_KEY, JSON.stringify({ kind, kingdom, q }));
	}

	function saveIndexScroll() {
		if (!browser) return;
		sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
	}

	function restoreIndexScroll() {
		if (!browser) return;
		const raw = sessionStorage.getItem(INDEX_SCROLL_KEY);
		const y = raw ? Number(raw) : 0;
		requestAnimationFrame(() => {
			window.scrollTo({ top: Number.isFinite(y) ? y : 0, behavior: 'instant' as ScrollBehavior });
		});
	}

	function saveDetailScroll(id: string | null) {
		if (!browser || !id || !detailScrollEl) return;
		detailScrollById[id] = detailScrollEl.scrollTop;
		sessionStorage.setItem(DETAIL_SCROLL_KEY, JSON.stringify(detailScrollById));
	}

	function restoreDetailScroll(id: string) {
		if (!browser) return;
		const y = detailScrollById[id] ?? 0;
		requestAnimationFrame(() => {
			if (detailScrollEl) detailScrollEl.scrollTop = y;
		});
	}

	if (browser) {
		readStoredFilters();
		try {
			const raw = sessionStorage.getItem(DETAIL_SCROLL_KEY);
			if (raw) detailScrollById = JSON.parse(raw) as Record<string, number>;
		} catch {
			/* ignore */
		}
	}

	afterNavigate(({ from, to }) => {
		if (!browser) return;
		const fromWiki = from?.url.pathname === '/wiki' || from?.url.pathname === resolve('/wiki');
		const toWiki = to?.url.pathname === '/wiki' || to?.url.pathname === resolve('/wiki');
		if (!toWiki) return;
		const hadId = !!from?.url.searchParams.get('id');
		const hasId = !!to.url.searchParams.get('id');
		const nextId = to.url.searchParams.get('id');
		// Closing overlay → restore index scroll; opening keeps index under scrim.
		if (fromWiki && hadId && !hasId) restoreIndexScroll();
		if (nextId) restoreDetailScroll(nextId);
	});

	function setId(id: string | null) {
		const opts = {
			keepFocus: true,
			noScroll: true,
			replaceState: false
		};
		if (id) {
			goto(resolve(`/wiki?id=${encodeURIComponent(id)}`), opts);
		} else {
			goto(resolve('/wiki'), opts);
		}
	}

	function openEntry(id: string) {
		if (selectedId) saveDetailScroll(selectedId);
		else saveIndexScroll();
		expanded = false;
		persistFilters();
		setId(id);
	}

	function clearEntry() {
		if (selectedId) saveDetailScroll(selectedId);
		expanded = false;
		setId(null);
		restoreIndexScroll();
	}

	function expandEntry() {
		expanded = true;
	}

	function collapseEntry() {
		expanded = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedId) {
			if (expanded) collapseEntry();
			else clearEntry();
		}
	}

	function kindCount(k: WikiKind | 'all'): number {
		if (k === 'all') return PROFILES.length;
		return PROFILES.filter((p) => kindOf(p) === k).length;
	}

	type WikiSnap = {
		kind: WikiFilters['kind'];
		kingdom: WikiFilters['kingdom'];
		q: string;
		indexScroll: number;
		detailScrollById: Record<string, number>;
		expanded: boolean;
	};

	export const snapshot: Snapshot<WikiSnap> = {
		capture: () => {
			if (selectedId && detailScrollEl) {
				detailScrollById[selectedId] = detailScrollEl.scrollTop;
			}
			return {
				kind,
				kingdom,
				q,
				indexScroll: browser ? window.scrollY : 0,
				detailScrollById: { ...detailScrollById },
				expanded
			};
		},
		restore: (value) => {
			kind = value.kind;
			kingdom = value.kingdom;
			q = value.q;
			detailScrollById = value.detailScrollById ?? {};
			expanded = !!value.expanded;
			if (browser) {
				sessionStorage.setItem(INDEX_SCROLL_KEY, String(value.indexScroll ?? 0));
				sessionStorage.setItem(DETAIL_SCROLL_KEY, JSON.stringify(detailScrollById));
				if (!page.url.searchParams.get('id')) {
					requestAnimationFrame(() => {
						window.scrollTo({
							top: value.indexScroll ?? 0,
							behavior: 'instant' as ScrollBehavior
						});
					});
				}
			}
		}
	};
</script>

<svelte:head>
	<title
		>{selected ? `${nameOf(selected)} · Encyclopedia` : 'Encyclopedia · King for All'}</title
	>
	<meta
		name="description"
		content="Encyclopedia of every profile in the chronicle — characters, places, nations, concepts, and relationships."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class="wiki" class:dimmed={!!selectedId}>
	<header class="mast">
		<p class="eyebrow">
			<a href={resolve('/')}>← Chronicle</a>
			<span class="dot" aria-hidden="true">·</span>
			<span>{WIKI_TOTAL} entries</span>
		</p>
		<h1>Encyclopedia</h1>
		<p class="lede">
			Every face, place, bond, and idea named in the chronicle — drawn from the same records the
			story reads.
		</p>
	</header>

	<div class="controls">
		<label class="search">
			<span class="sr">Search</span>
			<input
				type="search"
				placeholder="Search name, Korean, title…"
				bind:value={q}
				oninput={persistFilters}
				autocomplete="off"
			/>
		</label>

		<div class="chips" role="group" aria-label="Filter by type">
			<button
				type="button"
				class:active={kind === 'all'}
				onclick={() => {
					kind = 'all';
					persistFilters();
				}}
			>
				All <em>{kindCount('all')}</em>
			</button>
			{#each WIKI_KINDS as k (k.id)}
				<button
					type="button"
					class:active={kind === k.id}
					onclick={() => {
						kind = k.id;
						persistFilters();
					}}
				>
					{k.plural} <em>{kindCount(k.id)}</em>
				</button>
			{/each}
		</div>

		<label class="kingdom-pick">
			<span>Kingdom</span>
			<select
				bind:value={kingdom}
				onchange={persistFilters}
			>
				<option value="all">All kingdoms</option>
				{#each WIKI_KINGDOMS as kid (kid)}
					<option value={kid}>{KINGDOMS[kid].label}</option>
				{/each}
				<option value="other">{KINGDOMS.other.label}</option>
			</select>
		</label>
	</div>

	<p class="count" aria-live="polite">
		{filtered.length}
		{filtered.length === 1 ? 'entry' : 'entries'}
		{#if kind !== 'all' || kingdom !== 'all' || q.trim()}
			<span>matched</span>
		{/if}
		<span class="sort-hint">· by importance</span>
	</p>

	{#if filtered.length === 0}
		<p class="empty">Nothing matches. Widen the filters or clear the search.</p>
	{:else}
		{#each groups as group (group.kind)}
			<section class="group">
				<h2>
					{WIKI_KINDS.find((k) => k.id === group.kind)?.plural ?? group.kind}
					<span>{group.items.length}</span>
				</h2>
				<ul class="grid">
					{#each group.items as p (p.id)}
						{@const kc = { ...KINGDOMS[p.kingdom], color: colorOf(p) }}
						{@const art = avatarOf(p)}
						<li>
							<button
								type="button"
								class="card"
								style:--k={kc.color}
								onclick={() => openEntry(p.id)}
							>
								<span class="avatar" class:silhouette={isPlaceholderArt(art)} aria-hidden="true">
									{#if art}
										<img src={art} alt="" />
									{:else}
										{hangulInitial(p)}
									{/if}
								</span>
								<span class="meta">
									<span class="card-name">
										{nameOf(p)}
										{#if p.main}<em class="lead-dot" title="Lead">●</em>{/if}
									</span>
									<span class="card-sub">
										{#if koreanOf(p)}<span class="ko">{koreanOf(p)}</span>{/if}
										{#if koreanOf(p)}<span class="sep">·</span>{/if}
										{#if kc.flag}<img class="flag" src={kc.flag} alt="" />{/if}
										{kc.label}
									</span>
									{#if titleOf(p)}
										<span class="card-title">{titleOf(p)}</span>
									{:else}
										<span class="card-title">{kindLabel(p)}</span>
									{/if}
									<span class="card-line">{p.tagline}</span>
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	{/if}
</main>

{#if selected}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="scrim"
		class:full={expanded}
		onclick={clearEntry}
	></div>
	<div
		class="peek"
		class:full={expanded}
		style:--k={colorOf(selected)}
		role="dialog"
		aria-modal="true"
		aria-label="{nameOf(selected)} encyclopedia entry"
	>
		<WikiDetail
			entry={selected}
			{expanded}
			onBack={clearEntry}
			onOpen={openEntry}
			onExpand={expandEntry}
			onCollapse={collapseEntry}
			onScrollEl={(el) => (detailScrollEl = el ?? undefined)}
		/>
	</div>
{:else if missing}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={clearEntry}></div>
	<div class="peek missing" role="dialog" aria-modal="true" aria-label="Entry not found">
		<header class="missing-head">
			<button type="button" class="missing-close" onclick={clearEntry} aria-label="Close">✕</button>
			<a href={resolve('/')}>Chronicle</a>
		</header>
		<div class="missing-body">
			<h1>Not found</h1>
			<p>No entry matches <code>{selectedId}</code> in the chronicle’s records.</p>
		</div>
	</div>
{/if}

<style>
	.wiki {
		min-height: 100dvh;
		padding: max(2.5rem, env(safe-area-inset-top, 0px) + 1.5rem)
			max(1.5rem, env(safe-area-inset-right, 0px))
			max(4rem, env(safe-area-inset-bottom, 0px) + 2rem)
			max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.5rem));
		background:
			radial-gradient(ellipse 80% 50% at 10% 0%, rgba(216, 178, 106, 0.07), transparent 55%),
			radial-gradient(ellipse 60% 40% at 90% 10%, rgba(62, 121, 228, 0.05), transparent 50%),
			var(--bg);
		transition: filter 0.35s var(--ease);
	}

	.wiki.dimmed {
		filter: saturate(0.92);
	}

	.mast {
		max-width: 48rem;
		margin: 0 auto 2rem;
	}

	.eyebrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		margin: 0 0 0.85rem;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.eyebrow a {
		font: inherit;
		font-size: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		color: var(--fg-dim);
		text-decoration: none;
		transition: color 0.2s var(--ease);
	}

	.eyebrow a:hover {
		color: var(--gold);
	}

	.dot {
		opacity: 0.5;
	}

	.mast h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: #fffdf8;
	}

	.lede {
		max-width: 34rem;
		margin: 0.85rem 0 0;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--fg-dim);
	}

	.controls {
		position: sticky;
		top: 0;
		z-index: 20;
		max-width: 56rem;
		margin: 0 auto 1.2rem;
		display: grid;
		gap: 0.9rem;
		padding: 0.65rem 0 0.85rem;
		background: linear-gradient(
			to bottom,
			var(--bg) 55%,
			color-mix(in srgb, var(--bg) 70%, transparent)
		);
		backdrop-filter: blur(10px);
	}

	.search input {
		width: 100%;
		font: inherit;
		font-size: 1rem;
		color: var(--fg);
		background: var(--panel);
		border: 1px solid var(--hairline);
		border-radius: 10px;
		padding: 0.8rem 1rem;
		outline: none;
		transition: border-color 0.2s var(--ease);
	}

	.search input::placeholder {
		color: var(--fg-faint);
	}

	.search input:focus {
		border-color: rgba(216, 178, 106, 0.45);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chips button {
		font: inherit;
		font-size: 0.78rem;
		letter-spacing: 0.03em;
		color: var(--fg-faint);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0.45rem 0.8rem;
		min-height: 2.5rem;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease),
			border-color 0.2s var(--ease);
	}

	.chips button em {
		font-style: normal;
		opacity: 0.65;
		margin-left: 0.25rem;
	}

	.chips button:hover {
		color: var(--fg);
		border-color: rgba(216, 178, 106, 0.35);
	}

	.chips button.active {
		color: #14140f;
		background: var(--gold);
		border-color: var(--gold);
	}

	.chips button.active em {
		opacity: 0.7;
	}

	.kingdom-pick {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.kingdom-pick select {
		font: inherit;
		font-size: 0.9rem;
		letter-spacing: 0;
		text-transform: none;
		color: var(--fg);
		background: var(--panel);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 0.5rem 0.7rem;
		min-height: 2.5rem;
	}

	.count {
		max-width: 56rem;
		margin: 0 auto 1.4rem;
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.count span {
		color: var(--gold);
	}

	.sort-hint {
		color: var(--fg-faint) !important;
		opacity: 0.75;
	}

	.empty {
		max-width: 56rem;
		margin: 2rem auto;
		color: var(--fg-dim);
		font-style: italic;
	}

	.group {
		max-width: 56rem;
		margin: 0 auto 2.4rem;
	}

	.group h2 {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		margin: 0 0 0.85rem;
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
		border-bottom: 1px solid var(--hairline);
		padding-bottom: 0.45rem;
	}

	.group h2 span {
		font-family: var(--sans);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
		gap: 0.75rem;
	}

	.card {
		display: flex;
		align-items: flex-start;
		gap: 0.95rem;
		width: 100%;
		height: 100%;
		text-align: left;
		padding: 1rem 1.05rem;
		border: 1px solid var(--hairline);
		border-radius: 14px;
		background: var(--panel);
		cursor: pointer;
		font: inherit;
		color: inherit;
		transition:
			border-color 0.22s var(--ease),
			transform 0.22s var(--ease),
			background 0.22s var(--ease);
	}

	.card:hover {
		border-color: rgba(216, 178, 106, 0.35);
		background: var(--bg-raised);
		transform: translateY(-2px);
	}

	.avatar {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 4.5rem;
		height: 5.4rem;
		overflow: hidden;
		border-radius: 10px;
		font-family: var(--serif);
		font-weight: 700;
		font-size: 1.35rem;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 12%;
	}

	.avatar.silhouette img {
		opacity: 0.62;
	}

	.meta {
		min-width: 0;
		display: grid;
		gap: 0.18rem;
		padding-top: 0.1rem;
	}

	.card-name {
		font-weight: 600;
		font-size: 1.05rem;
		color: #fffdf8;
		letter-spacing: var(--tracking-display);
	}

	.lead-dot {
		font-style: normal;
		font-size: 0.55rem;
		vertical-align: middle;
		margin-left: 0.25rem;
		color: var(--gold);
	}

	.card-sub {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.74rem;
		color: var(--fg-faint);
	}

	.sep {
		opacity: 0.45;
	}

	.flag {
		width: 0.9rem;
		height: 0.6rem;
		object-fit: cover;
		border-radius: 1px;
	}

	.card-title {
		font-size: 0.78rem;
		color: var(--fg-dim);
	}

	.card-line {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-top: 0.25rem;
		font-size: 0.82rem;
		line-height: 1.4;
		color: var(--fg-dim);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	/* ————— Notion-style peek overlay ————— */
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
		animation: fade-in 0.3s ease;
		transition: background 0.45s var(--ease);
	}

	.scrim.full {
		background: rgba(0, 0, 0, 0.72);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	.peek {
		position: fixed;
		top: 0.85rem;
		right: 0.85rem;
		bottom: 0.85rem;
		z-index: 115;
		width: min(34rem, calc(100vw - 1.7rem));
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		box-shadow:
			0 28px 70px rgba(0, 0, 0, 0.55),
			0 8px 24px rgba(0, 0, 0, 0.35);
		animation: slide-in 0.42s cubic-bezier(0.22, 0.61, 0.36, 1);
		transition:
			top 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			right 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			bottom 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			left 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			width 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			border-radius 0.48s cubic-bezier(0.22, 0.61, 0.36, 1),
			box-shadow 0.48s var(--ease);
	}

	.peek.full {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 0;
		border-color: transparent;
		box-shadow: none;
		animation: none;
	}

	.peek :global(.detail) {
		height: 100%;
	}

	@keyframes slide-in {
		from {
			opacity: 0.85;
			transform: translateX(calc(100% + 1rem));
		}
	}

	.missing-head {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.missing-close {
		width: 2.4rem;
		height: 2.4rem;
		display: grid;
		place-items: center;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
	}

	.missing-head a {
		margin-left: auto;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
		text-decoration: none;
	}

	.missing-body {
		padding: 2rem 1.5rem;
	}

	.missing-body h1 {
		margin: 0 0 0.6rem;
		font-family: var(--serif);
		color: #fffdf8;
	}

	.missing-body code {
		color: var(--gold);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}

	@media (max-width: 720px) {
		.wiki {
			padding-left: max(1.05rem, env(safe-area-inset-left, 0px));
			padding-right: max(1.05rem, env(safe-area-inset-right, 0px));
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.avatar {
			width: 4.2rem;
			height: 5rem;
		}

		.peek {
			top: max(0.25rem, env(safe-area-inset-top, 0px));
			right: max(0.25rem, env(safe-area-inset-right, 0px));
			bottom: max(0.25rem, env(safe-area-inset-bottom, 0px));
			left: max(0.25rem, env(safe-area-inset-left, 0px));
			width: auto;
			border-radius: 14px;
		}

		.peek.full {
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			border-radius: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.scrim,
		.peek,
		.wiki {
			animation: none;
			transition: none;
		}

		.card:hover {
			transform: none;
		}
	}
</style>
