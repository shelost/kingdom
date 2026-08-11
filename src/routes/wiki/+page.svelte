<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { pushState, afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import {
		PROFILES,
		byId,
		avatarOf,
		nameOf,
		titleOf,
		koreanOf,
		isPlaceholderArt,
		KINGDOMS,
		kingdomFlag,
		ERA_TAG_META,
		ERA_TAG_IDS,
		colorOf,
		accentColorsOf,
		hangulInitial,
		type Person
	} from '$lib/people';
	import {
		WIKI_KINDS,
		WIKI_KINGDOMS,
		WIKI_TOTAL,
		kindOf,
		kindLabel,
		filterProfiles,
		groupByKind,
		groupByGodTier,
		godTierLabel,
		cityOf,
		showsWikiAccent,
		clanSpotlightOf,
		type WikiKind,
		type WikiFilters
	} from '$lib/wiki';
	import WikiDetail from '$lib/components/WikiDetail.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import WikiOrgPreview from '$lib/components/diagrams/WikiOrgPreview.svelte';
	import { chartsForWikiEntry } from '$lib/components/diagrams/wikiCharts';
	import type { Snapshot } from './$types';

	const INDEX_SCROLL_KEY = 'wiki:indexScroll';
	const DETAIL_SCROLL_KEY = 'wiki:detailScroll';
	const FILTERS_KEY = 'wiki:filters';

	let kind = $state<WikiFilters['kind']>('all');
	let kingdom = $state<WikiFilters['kingdom']>('all');
	let tag = $state<WikiFilters['tag']>('all');
	let gender = $state<WikiFilters['gender']>('all');
	let q = $state('');
	let expanded = $state(false);
	let filtersOpen = $state(false);
	let detailScrollEl = $state<HTMLElement | undefined>(undefined);
	/** Per-entry detail scroll tops while hopping related links. */
	let detailScrollById = $state<Record<string, number>>({});

	/**
	 * Selection is local state so the overlay opens on click even if shallow
	 * routing lags. URL `?id=` stays in sync for deep links / back-forward.
	 */
	let selectedId = $state<string | null>(page.url.searchParams.get('id'));
	let selected = $derived(selectedId ? (byId.get(selectedId) ?? null) : null);
	let missing = $derived(!!selectedId && !selected);

	let filtered = $derived(filterProfiles({ kind, kingdom, tag, gender, q }));
	/** Gods filter → class sections; otherwise kind groups (All / Characters / …). */
	let sections = $derived.by((): {
		key: string;
		title: string;
		subtitle: string;
		items: Person[];
	}[] => {
		if (kind === 'god') {
			return groupByGodTier(filtered).map((s) => ({
				key: s.tier,
				title: s.title,
				subtitle: s.subtitle,
				items: s.items
			}));
		}
		return groupByKind(filtered).map((g) => ({
			key: g.kind,
			title: WIKI_KINDS.find((k) => k.id === g.kind)?.plural ?? g.kind,
			subtitle: '',
			items: g.items
		}));
	});
	let activeFilterCount = $derived(
		(kind !== 'all' ? 1 : 0) +
			(kingdom !== 'all' ? 1 : 0) +
			(tag !== 'all' ? 1 : 0) +
			(gender !== 'all' ? 1 : 0) +
			(q.trim() ? 1 : 0)
	);
	let showGenderFilter = $derived(kind === 'character' || kind === 'god' || kind === 'all');

	function readStoredFilters() {
		if (!browser) return;
		try {
			const raw = sessionStorage.getItem(FILTERS_KEY);
			if (!raw) return;
			const v = JSON.parse(raw) as Partial<WikiFilters>;
			if (v.kind) kind = v.kind;
			if (v.kingdom) kingdom = v.kingdom;
			if (v.tag) tag = v.tag;
			if (v.gender) gender = v.gender;
			// Do not restore `q` — sticky search (e.g. "go") hid most gods/nations.
		} catch {
			/* ignore */
		}
	}

	function persistFilters() {
		if (!browser) return;
		// Persist type/kingdom/era only — never the find query.
		sessionStorage.setItem(FILTERS_KEY, JSON.stringify({ kind, kingdom, tag, gender }));
	}

	/** Era chip counts — characters only (eras are not applied to other kinds). */
	function tagCount(t: string | 'all'): number {
		const chars = PROFILES.filter((p) => kindOf(p) === 'character');
		if (t === 'all') return chars.length;
		return chars.filter((p) => (p.tags ?? []).includes(t)).length;
	}

	/** Gender chip counts — characters & gods (mortal + divine). */
	function genderCount(g: WikiFilters['gender']): number {
		const pool = PROFILES.filter((p) => {
			if (kind === 'character') return kindOf(p) === 'character';
			if (kind === 'god') return kindOf(p) === 'god';
			return kindOf(p) === 'character' || kindOf(p) === 'god';
		});
		if (g === 'all') return pool.length;
		return pool.filter((p) => p.gender === g).length;
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

	/** After hydrate — session filters must not diverge SSR HTML from the first client paint. */
	onMount(() => {
		readStoredFilters();
		// Drop any legacy sticky `q` (e.g. "go") left in sessionStorage.
		persistFilters();
		try {
			const raw = sessionStorage.getItem(DETAIL_SCROLL_KEY);
			if (raw) detailScrollById = JSON.parse(raw) as Record<string, number>;
		} catch {
			/* ignore */
		}
	});

	/**
	 * Adopt `?id=` from a URL for deep links / full navigations.
	 * Intentionally does NOT run on our own `pushState` (Kit never fires
	 * afterNavigate for shallow history) — local `selectedId` already leads.
	 */
	function adoptIdFromUrl(nextId: string | null, opts?: { restoreIndex?: boolean }) {
		if (nextId === selectedId) {
			if (nextId) restoreDetailScroll(nextId);
			return;
		}
		const hadId = !!selectedId;
		selectedId = nextId;
		expanded = false;
		if (opts?.restoreIndex && hadId && !nextId) restoreIndexScroll();
		if (nextId) restoreDetailScroll(nextId);
	}

	afterNavigate(({ type, from, to }) => {
		if (!browser || !to?.url) return;
		const wikiPath = resolve('/wiki');
		const toWiki = to.url.pathname === '/wiki' || to.url.pathname === wikiPath;
		if (!toWiki) return;
		// Skip `enter`: selectedId is already seeded from page.url on init.
		// Re-adopting here can wipe a click that landed before afterNavigate ran.
		// Shallow back/forward is handled in onPopState (pushState never fires this).
		if (type !== 'link' && type !== 'goto' && type !== 'popstate') return;
		const fromWiki = from?.url?.pathname === '/wiki' || from?.url?.pathname === wikiPath;
		const hadId = !!from?.url?.searchParams?.get('id');
		const nextId = to.url.searchParams.get('id');
		adoptIdFromUrl(nextId, { restoreIndex: fromWiki && hadId && !nextId });
	});

	/**
	 * Shallow history (our pushState overlays): Kit updates the address bar but
	 * does not run afterNavigate. Read `location` — not `page.url` — as source.
	 */
	function onPopState() {
		if (!browser) return;
		const wikiPath = resolve('/wiki');
		const path = location.pathname;
		if (path !== '/wiki' && path !== wikiPath) return;
		const nextId = new URL(location.href).searchParams.get('id');
		adoptIdFromUrl(nextId, { restoreIndex: true });
	}

	/** Keep `?id=` in the address bar (deep links, share, history). Best-effort. */
	function syncUrl(id: string | null) {
		if (!browser) return;
		try {
			if (id) pushState(resolve(`/wiki?id=${encodeURIComponent(id)}`), {});
			else pushState(resolve('/wiki'), {});
		} catch {
			/* history API unavailable — overlay still works from local state */
		}
	}

	function openEntry(id: string) {
		if (!id) return;
		if (selectedId) saveDetailScroll(selectedId);
		else saveIndexScroll();
		expanded = false;
		filtersOpen = false;
		persistFilters();
		// Open immediately — do not wait for pushState / page.url.
		selectedId = id;
		syncUrl(id);
	}

	function clearEntry() {
		if (selectedId) saveDetailScroll(selectedId);
		expanded = false;
		selectedId = null;
		syncUrl(null);
		restoreIndexScroll();
	}

	function expandEntry() {
		expanded = true;
	}

	function collapseEntry() {
		expanded = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (selectedId) {
			if (expanded) collapseEntry();
			else clearEntry();
			return;
		}
		if (filtersOpen) filtersOpen = false;
	}

	function kindCount(k: WikiKind | 'all'): number {
		if (k === 'all') return PROFILES.length;
		return PROFILES.filter((p) => kindOf(p) === k).length;
	}

	function kingdomCount(kid: Person['kingdom'] | 'all'): number {
		if (kid === 'all') return PROFILES.length;
		return PROFILES.filter((p) => p.kingdom === kid).length;
	}

	type WikiSnap = {
		kind: WikiFilters['kind'];
		kingdom: WikiFilters['kingdom'];
		tag: WikiFilters['tag'];
		gender: WikiFilters['gender'];
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
				tag,
				gender,
				q,
				indexScroll: browser ? window.scrollY : 0,
				detailScrollById: { ...detailScrollById },
				expanded
			};
		},
		restore: (value) => {
			kind = value.kind;
			kingdom = value.kingdom;
			tag = value.tag ?? 'all';
			gender = value.gender ?? 'all';
			// Never restore search — sticky "go" made gods/nations look missing.
			q = '';
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
		content="Encyclopedia of every profile in the chronicle — characters, gods, places, nations, clans, organizations, phrases, concepts, and relationships."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} onpopstate={onPopState} />

<main class="wiki" class:dimmed={!!selectedId}>
	{#if filtersOpen}
		<button
			type="button"
			class="find-scrim"
			aria-label="Close find panel"
			onclick={() => (filtersOpen = false)}
		></button>
	{/if}

	<aside class="find" class:open={filtersOpen} id="wiki-find" aria-label="Find entries">
		<header class="mast">
			<div class="mast-nav">
				<SiteNav />
				<span class="dot" aria-hidden="true">·</span>
				<a class="quiet" href={resolve('/images')}>Images</a>
				<span class="dot" aria-hidden="true">·</span>
				<span>{WIKI_TOTAL} entries</span>
			</div>
			<h1>Encyclopedia</h1>
			<p class="lede">
				Every face, place, bond, and idea named in the chronicle — drawn from the same records the
				story reads.
			</p>
		</header>

		<div class="controls">
			<p class="find-label">Find</p>

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

			<div class="filter-block">
				<p class="filter-label" id="wiki-kind-label">Type</p>
				<div class="chips" role="group" aria-labelledby="wiki-kind-label">
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
			</div>

			<div class="filter-block">
				<p class="filter-label" id="wiki-kingdom-label">Kingdom</p>
				<div class="chips" role="group" aria-labelledby="wiki-kingdom-label">
					<button
						type="button"
						class:active={kingdom === 'all'}
						onclick={() => {
							kingdom = 'all';
							persistFilters();
						}}
					>
						All kingdoms <em>{kingdomCount('all')}</em>
					</button>
					{#each WIKI_KINGDOMS as kid (kid)}
						<button
							type="button"
							class:active={kingdom === kid}
							style:--chip={KINGDOMS[kid].color}
							onclick={() => {
								kingdom = kid;
								persistFilters();
							}}
						>
							{KINGDOMS[kid].label} <em>{kingdomCount(kid)}</em>
						</button>
					{/each}
					<button
						type="button"
						class:active={kingdom === 'other'}
						onclick={() => {
							kingdom = 'other';
							persistFilters();
						}}
					>
						{KINGDOMS.other.label} <em>{kingdomCount('other')}</em>
					</button>
				</div>
			</div>

			{#if showGenderFilter}
				<div class="filter-block">
					<p class="filter-label" id="wiki-gender-label">Gender</p>
					<div class="chips" role="group" aria-labelledby="wiki-gender-label">
						<button
							type="button"
							class:active={gender === 'all'}
							onclick={() => {
								gender = 'all';
								persistFilters();
							}}
						>
							All <em>{genderCount('all')}</em>
						</button>
						<button
							type="button"
							class:active={gender === 'm'}
							onclick={() => {
								gender = 'm';
								persistFilters();
							}}
						>
							Men <em>{genderCount('m')}</em>
						</button>
						<button
							type="button"
							class:active={gender === 'f'}
							onclick={() => {
								gender = 'f';
								persistFilters();
							}}
						>
							Women <em>{genderCount('f')}</em>
						</button>
					</div>
				</div>
			{/if}

			<div class="filter-block">
				<p class="filter-label" id="wiki-era-label">Era</p>
				<div class="chips" role="group" aria-labelledby="wiki-era-label">
					<button
						type="button"
						class:active={tag === 'all'}
						onclick={() => {
							tag = 'all';
							persistFilters();
						}}
					>
						Any era <em>{tagCount('all')}</em>
					</button>
					{#each ERA_TAG_IDS as tid (tid)}
						<button
							type="button"
							class:active={tag === tid}
							title={ERA_TAG_META[tid]?.hint}
							onclick={() => {
								tag = tid;
								persistFilters();
							}}
						>
							{ERA_TAG_META[tid]?.label ?? tid} <em>{tagCount(tid)}</em>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<button type="button" class="find-done" onclick={() => (filtersOpen = false)}>
			Show {filtered.length}
			{filtered.length === 1 ? 'entry' : 'entries'}
		</button>
	</aside>

	<section class="browse" aria-label="Encyclopedia results">
		<header class="browse-bar">
			<div class="browse-title">
				<div class="mobile-only mast-nav compact">
				<SiteNav />
				<span class="dot" aria-hidden="true">·</span>
				<span>{WIKI_TOTAL}</span>
			</div>
				<h2 class="mobile-only">Encyclopedia</h2>
				<p class="count" aria-live="polite">
					{filtered.length}
					{filtered.length === 1 ? 'entry' : 'entries'}
					{#if activeFilterCount > 0}
						<span>matched</span>
					{/if}
					<span class="sort-hint"
						>{kind === 'god'
							? '· by class'
							: kind === 'clan'
								? '· by members'
								: '· by importance'}</span
					>
				</p>
			</div>
			<button
				type="button"
				class="find-toggle"
				aria-expanded={filtersOpen}
				aria-controls="wiki-find"
				onclick={() => (filtersOpen = !filtersOpen)}
			>
				<span class="material-symbols-outlined" aria-hidden="true">tune</span>
				Find
				{#if activeFilterCount > 0}
					<em>{activeFilterCount}</em>
				{/if}
			</button>
		</header>

		{#if filtered.length === 0}
			<p class="empty">Nothing matches. Widen the filters or clear the search.</p>
		{:else}
			{#each sections as section (section.key)}
				<section class="group" class:tier-group={kind === 'god'}>
					<header class="group-head">
						<h2>
							{section.title}
							<span>{section.items.length}</span>
						</h2>
						{#if section.subtitle}
							<p class="group-sub">{section.subtitle}</p>
						{/if}
					</header>
					<ul class="grid">
						{#each section.items as p (p.id)}
							{@const kc = { ...(KINGDOMS[p.kingdom] ?? KINGDOMS.other), color: colorOf(p) }}
							{@const accents = accentColorsOf(p)}
							{@const showAccent = showsWikiAccent(p)}
							{@const art = avatarOf(p)}
							{@const cardKind = kindOf(p)}
							{@const parentCity = cardKind === 'place' ? cityOf(p) : undefined}
							{@const isShowcase = cardKind === 'place' || cardKind === 'city'}
							{@const isOrgCard = cardKind === 'organization'}
							{@const isClanCard = cardKind === 'clan'}
							{@const hasOrgPreview =
								isOrgCard &&
								(!!chartsForWikiEntry(p.id).length || !!(p.orgChart && p.orgChart.length))}
							{@const spotlight = isClanCard ? clanSpotlightOf(p.id) : undefined}
							{@const clanArt = spotlight ? avatarOf(spotlight) : undefined}
							<li>
								<button
									type="button"
									class="card"
									class:card-showcase={isShowcase}
									class:card-org={isOrgCard}
									style:--k={kc.color}
									style:--k2={p.colorSecondary ?? kc.color}
									onclick={() => openEntry(p.id)}
								>
									{#if isShowcase}
										<span class="showcase" class:empty={!art} aria-hidden="true">
											{#if art}
												<img src={art} alt="" />
											{:else}
												<span class="showcase-initial">{hangulInitial(p)}</span>
											{/if}
											<span class="showcase-fade"></span>
										</span>
									{:else if hasOrgPreview}
										<WikiOrgPreview entry={p} />
									{:else if spotlight}
										<span
											class="avatar avatar-clan"
											class:silhouette={clanArt ? isPlaceholderArt(clanArt) : false}
											aria-hidden="true"
										>
											{#if clanArt}
												<img src={clanArt} alt="" />
											{:else}
												{hangulInitial(spotlight)}
											{/if}
										</span>
									{:else}
										<span class="avatar" class:silhouette={isPlaceholderArt(art)} aria-hidden="true">
											{#if art}
												<img src={art} alt="" />
											{:else}
												{hangulInitial(p)}
											{/if}
										</span>
									{/if}
									<span class="meta">
										<span class="card-name">
											{nameOf(p)}
											{#if p.main}<em class="lead-dot" title="Lead">●</em>{/if}
										</span>
										<span class="card-sub">
											{#if koreanOf(p)}<span class="ko">{koreanOf(p)}</span>{/if}
											{#if koreanOf(p)}<span class="sep">·</span>{/if}
											{#if parentCity}
												<span class="city-chip">{nameOf(parentCity)}</span>
												<span class="sep">·</span>
											{/if}
											{#if kingdomFlag(p.kingdom)}<img class="flag" src={kingdomFlag(p.kingdom)} alt="" />{/if}
											{kc.label}
										</span>
										{#if p.godTier}
											{@const tier = godTierLabel(p.godTier)}
											<span class="card-tier" data-tier={p.godTier} title={tier.hint}>{tier.short}</span>
										{/if}
										{#if p.realm}
											<span class="card-realm">{p.realm.en}<span class="realm-ko"> · {p.realm.ko}</span></span>
										{/if}
										{#if titleOf(p)}
											<span class="card-title">{titleOf(p)}</span>
										{:else}
											<span class="card-title">{kindLabel(p)}</span>
										{/if}
										{#if showAccent}
											<span class="card-hexes" title="Accent color">
												{#each accents as hex (hex)}
													<span class="card-hex" style:--chip={hex}>{hex}</span>
												{/each}
											</span>
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
	</section>
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
		--wiki-find-w: 20.5rem;
		min-height: 100dvh;
		display: grid;
		grid-template-columns: var(--wiki-find-w) minmax(0, 1fr);
		align-items: start;
		background:
			radial-gradient(ellipse 70% 45% at 8% 0%, rgba(216, 178, 106, 0.08), transparent 55%),
			radial-gradient(ellipse 55% 40% at 92% 8%, rgba(62, 121, 228, 0.05), transparent 50%),
			var(--bg);
		transition: filter 0.35s var(--ease);
	}

	.wiki.dimmed {
		filter: saturate(0.92);
	}

	.find {
		position: sticky;
		top: 0;
		z-index: 30;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: max(1.75rem, env(safe-area-inset-top, 0px) + 1rem)
			1.25rem
			max(1.5rem, env(safe-area-inset-bottom, 0px) + 1rem)
			max(1.35rem, calc(env(safe-area-inset-left, 0px) + 1.85rem));
		border-right: 1px solid var(--hairline);
		background:
			linear-gradient(165deg, rgba(216, 178, 106, 0.06), transparent 42%),
			color-mix(in srgb, var(--panel) 88%, transparent);
		backdrop-filter: blur(16px);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.mast {
		flex-shrink: 0;
	}

	.dot {
		opacity: 0.5;
	}

	.mast h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.85rem, 2.4vw, 2.45rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: var(--fg-strong);
	}

	.lede {
		margin: 0.7rem 0 0;
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.controls {
		display: grid;
		gap: 1.05rem;
		padding-bottom: 0.25rem;
	}

	.find-label {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.filter-block {
		display: grid;
		gap: 0.45rem;
	}

	.filter-label {
		margin: 0;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.search input {
		width: 100%;
		font: inherit;
		font-size: 0.95rem;
		color: var(--fg);
		background: var(--panel-sunken);
		border: 1px solid var(--hairline);
		border-radius: 10px;
		padding: 0.75rem 0.9rem;
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
		gap: 0.35rem;
	}

	.chips button {
		font: inherit;
		font-size: 0.74rem;
		letter-spacing: 0.03em;
		color: var(--fg-faint);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0.4rem 0.7rem;
		min-height: 2.35rem;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease),
			border-color 0.2s var(--ease);
	}

	.chips button em {
		font-style: normal;
		opacity: 0.65;
		margin-left: 0.2rem;
	}

	.chips button:hover {
		color: var(--fg);
		border-color: rgba(216, 178, 106, 0.35);
	}

	.chips button.active {
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.chips button.active em {
		opacity: 0.7;
	}

	.mast-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0 0.75rem;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.mast-nav.compact :global(.site-nav a) {
		padding: 0.28rem 0.5rem;
		font-size: 0.62rem;
	}

	.mast-nav .quiet {
		color: inherit;
		text-decoration: none;
	}

	.mast-nav .quiet:hover {
		color: var(--gold);
	}

	.mast-nav .dot {
		opacity: 0.45;
	}

	.find-done,
	.find-toggle,
	.find-scrim,
	.mobile-only {
		display: none;
	}

	.browse {
		min-width: 0;
		padding: max(2rem, env(safe-area-inset-top, 0px) + 1.25rem)
			max(1.75rem, env(safe-area-inset-right, 0px))
			max(4rem, env(safe-area-inset-bottom, 0px) + 2rem)
			1.75rem;
	}

	.browse-bar {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.35rem;
	}

	.browse-title {
		min-width: 0;
	}

	.count {
		margin: 0;
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
		margin: 2rem 0;
		color: var(--fg-dim);
		font-style: italic;
	}

	.group {
		margin: 0 0 2.4rem;
	}

	.group-head {
		margin: 0 0 0.85rem;
		border-bottom: 1px solid var(--hairline);
		padding-bottom: 0.45rem;
	}

	.group h2 {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		margin: 0;
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.group h2 span {
		font-family: var(--sans);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.group-sub {
		margin: 0.28rem 0 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		font-style: italic;
		letter-spacing: 0.02em;
		line-height: 1.35;
		color: var(--fg-dim);
	}

	/* Gods filter — class bands read as chronicle divisions, not chip filters. */
	.tier-group {
		margin-bottom: 2.85rem;
	}

	.tier-group .group-head {
		border-bottom-color: color-mix(in srgb, var(--gold) 35%, var(--hairline));
		padding-bottom: 0.55rem;
	}

	.tier-group h2 {
		font-size: 0.9rem;
		letter-spacing: 0.14em;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(19.5rem, 1fr));
		gap: 0.75rem;
	}

	.card {
		display: flex;
		align-items: flex-start;
		gap: 1.05rem;
		width: 100%;
		height: 100%;
		text-align: left;
		padding: 0.95rem 1.05rem;
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

	.card.card-showcase {
		flex-direction: column;
		align-items: stretch;
		gap: 0;
		padding: 0;
		overflow: hidden;
	}

	.card.card-org {
		align-items: center;
	}

	.card:hover {
		border-color: rgba(216, 178, 106, 0.35);
		background: var(--bg-raised);
		transform: translateY(-2px);
	}

	.showcase {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: color-mix(in srgb, var(--k) 12%, var(--panel-sunken));
	}

	.showcase.empty {
		display: grid;
		place-items: center;
	}

	.showcase img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.showcase-fade {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			to top,
			var(--panel) 0%,
			color-mix(in srgb, var(--panel) 88%, transparent) 34%,
			color-mix(in srgb, var(--panel) 28%, transparent) 62%,
			transparent 82%
		);
	}

	.showcase-initial {
		position: relative;
		z-index: 1;
		font-family: var(--serif);
		font-weight: 700;
		font-size: 2.4rem;
		color: var(--fg-dim);
		opacity: 0.55;
	}

	.card-showcase .meta {
		padding: 0.15rem 1.05rem 1rem;
		margin-top: -2.4rem;
		position: relative;
		z-index: 1;
	}

	.city-chip {
		color: var(--fg-dim);
	}

	/* Portrait frame (2:3) — match asset ratio so full figure fits, no square crop. */
	.avatar {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 5.5rem;
		aspect-ratio: 2 / 3;
		height: auto;
		overflow: hidden;
		border-radius: 10px;
		font-family: var(--serif);
		font-weight: 700;
		font-size: 1.65rem;
		color: var(--fg-dim);
		background: transparent;
	}

	.avatar img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		background: transparent;
	}

	.avatar.silhouette img {
		opacity: 0.62;
	}

	.avatar.avatar-clan {
		background: color-mix(in srgb, var(--k) 12%, var(--panel-sunken));
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
		color: var(--fg-strong);
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

	.card-hexes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
		margin-top: 0.35rem;
	}

	.card-hex {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		max-width: 100%;
		padding: 0.1rem 0.45rem;
		min-height: 1.05rem;
		border-radius: 3px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		color: #fffdf8;
		background: var(--chip, var(--k));
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.45);
	}

	.card-tier {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		margin-top: 0.12rem;
		padding: 0.1rem 0.42rem;
		border-radius: 4px;
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--on-gold);
		background: var(--gold);
		border: 1px solid color-mix(in srgb, var(--gold) 70%, #000);
	}

	.card-tier[data-tier='S'] {
		background: #fff8e7;
		color: #3a2a10;
	}

	.card-tier[data-tier='demigod'] {
		background: color-mix(in srgb, var(--k) 45%, #c4a574);
		color: #fffdf8;
	}

	.card-realm {
		display: inline-flex;
		align-items: baseline;
		gap: 0.25rem;
		width: fit-content;
		margin-top: 0.1rem;
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #fffdf8;
		background: color-mix(in srgb, var(--k) 62%, #111);
		border: 1px solid color-mix(in srgb, var(--k) 75%, transparent);
	}

	.card-realm .realm-ko {
		letter-spacing: 0;
		text-transform: none;
		opacity: 0.9;
		font-size: 0.85em;
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
		color: var(--fg-strong);
	}

	.missing-body code {
		color: var(--gold);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}

	@media (max-width: 960px) {
		.wiki {
			grid-template-columns: 1fr;
		}

		.find-scrim {
			display: block;
			position: fixed;
			inset: 0;
			z-index: 90;
			border: 0;
			padding: 0;
			margin: 0;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(2px);
			cursor: pointer;
			animation: fade-in 0.25s ease;
		}

		.find {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			z-index: 95;
			width: min(22rem, calc(100vw - 2.5rem));
			height: 100dvh;
			border-right: 1px solid rgba(216, 178, 106, 0.22);
			box-shadow: 18px 0 48px rgba(0, 0, 0, 0.45);
			transform: translateX(-105%);
			transition: transform 0.32s var(--ease);
			padding-left: max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.find.open {
			transform: translateX(0);
		}

		.find-done {
			display: block;
			margin-top: auto;
			width: 100%;
			font: inherit;
			font-size: 0.9rem;
			font-weight: 600;
			letter-spacing: 0.04em;
			color: var(--on-gold);
			background: var(--gold);
			border: 1px solid var(--gold);
			border-radius: 10px;
			padding: 0.85rem 1rem;
			min-height: 2.75rem;
			cursor: pointer;
		}

		.browse {
			padding: max(1.15rem, env(safe-area-inset-top, 0px))
				max(1.05rem, env(safe-area-inset-right, 0px))
				max(4rem, env(safe-area-inset-bottom, 0px) + 2rem)
				max(1.05rem, env(safe-area-inset-left, 0px));
		}

		.browse-bar {
			position: sticky;
			top: 0;
			z-index: 25;
			align-items: flex-start;
			margin: 0 -0.15rem 1.2rem;
			padding: 0.35rem 0.15rem 0.85rem;
			background: linear-gradient(
				to bottom,
				var(--bg) 62%,
				color-mix(in srgb, var(--bg) 72%, transparent)
			);
			backdrop-filter: blur(10px);
		}

		.mobile-only {
			display: block;
		}

		.browse-title .mast-nav {
			margin-bottom: 0.45rem;
		}

		.browse-title h2 {
			margin: 0 0 0.45rem;
			font-family: var(--serif);
			font-size: 1.65rem;
			font-weight: 600;
			letter-spacing: var(--tracking-display);
			line-height: 1.1;
			color: var(--fg-strong);
		}

		.find-toggle {
			display: inline-flex;
			align-items: center;
			gap: 0.35rem;
			flex-shrink: 0;
			font: inherit;
			font-size: 0.78rem;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--fg);
			background: var(--glass);
			border: 1px solid rgba(216, 178, 106, 0.35);
			border-radius: 999px;
			padding: 0.55rem 0.9rem;
			min-height: 2.5rem;
			cursor: pointer;
		}

		.find-toggle .material-symbols-outlined {
			font-size: 1.05rem;
		}

		.find-toggle em {
			font-style: normal;
			min-width: 1.15rem;
			height: 1.15rem;
			display: inline-grid;
			place-items: center;
			border-radius: 999px;
			background: var(--gold);
			color: var(--on-gold);
			font-size: 0.68rem;
			font-weight: 700;
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.avatar {
			width: 5rem;
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
		.wiki,
		.find,
		.find-scrim {
			animation: none;
			transition: none;
		}

		.card:hover {
			transform: none;
		}
	}
</style>
