<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { replaceState } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import GlassSelect, { type GlassOption } from '$lib/components/GlassSelect.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import { chapters, entryId } from '$lib/story';
	import { PARTS, type DirectoryEpisode } from '$lib/episodeDirectory';
	import {
		collectWidgets,
		widgetPeople,
		widgetSearchText,
		widgetType,
		WIDGET_TYPES,
		type WidgetGroup,
		type WidgetInstance,
		type WidgetKind
	} from '$lib/widgets';
	import { collectHiddenWidgets } from '$lib/hiddenWidgets';
	import { onceInView } from '$lib/inView';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { reading } from '$lib/reading.svelte';
	import { byId, nameOf } from '$lib/people';
	import { plainText } from '$lib/speech';
	import { compareRanks, rankOf, type Rank } from '$lib/ranks';

	type Sort = 'order' | 'type' | 'year' | 'rank';
	type Section = { key: string; title: string; sub?: string; items: WidgetInstance[] };

	const GROUPS: { id: WidgetGroup; label: string; ko: string }[] = [
		{ id: 'sources', label: 'Sources', ko: '사료' },
		{ id: 'characters', label: 'Characters', ko: '인물' },
		{ id: 'evolutions', label: 'Evolutions', ko: '즉위' },
		{ id: 'places', label: 'Places', ko: '장소' },
		{ id: 'classics', label: 'Classics', ko: '고전' },
		{ id: 'maps', label: 'Maps', ko: '지도' },
		{ id: 'diagrams', label: 'Diagrams', ko: '도해' },
		{ id: 'other', label: 'Other', ko: '기타' }
	];

	const LIVE = collectWidgets(chapters);
	/** Widgets cut from the script: shown only under the Hidden tag. */
	const HIDDEN = collectHiddenWidgets(chapters);
	const ALL = [...LIVE, ...HIDDEN];
	const TYPE_ORDER = new Map(WIDGET_TYPES.map((t, i) => [t.kind, i]));
	const EPISODES = new Map<string, DirectoryEpisode>(
		PARTS.flatMap((p) => p.arcs.flatMap((a) => a.episodes)).map((ep) => [ep.id, ep])
	);

	let ko = $derived(reading.lang === 'ko');

	const params = page.url.searchParams;
	let group = $state<WidgetGroup | 'all' | 'hidden'>((params.get('group') as WidgetGroup | 'hidden') ?? 'all');
	let kind = $state<WidgetKind | 'all'>((params.get('kind') as WidgetKind) ?? 'all');
	let sort = $state<Sort>((params.get('sort') as Sort) ?? 'order');
	/** What the box shows as you type; `query` follows it after a short pause. */
	let draft = $state(params.get('q') ?? '');
	let query = $state(params.get('q')?.trim() ?? '');
	let searchTimer: ReturnType<typeof setTimeout> | undefined;
	/** Phones fold the filter chips away under the search bar. */
	let filtersOpen = $state(false);

	/** Widgets mounted so far: each one draws only once it nears the viewport. */
	const shown = new SvelteSet<string>();

	const keyOf = (w: WidgetInstance) => `${w.entryIndex}-${w.blockIndex}-${w.innerIndex ?? ''}`;

	function episodeOf(w: WidgetInstance) {
		return EPISODES.get(entryId(w.chapterId, w.entryTitle));
	}

	/** A person's every name — English, Korean, hanja, and the one they go by that year — or a plain label. */
	function personNames(id: string, year: number | null): string[] {
		const p = byId.get(id);
		return p ? [p.name, p.korean ?? '', p.hanja ?? '', nameOf(p, year)] : [id];
	}

	/** Lower-cased text of each widget (EN, KO, hanja, people, type and episode), built once. */
	const HAY: ReadonlyMap<WidgetInstance, string> = new Map(
		ALL.map((w) => {
			const type = widgetType(w.kind);
			const ep = episodeOf(w);
			const parts = [
				...widgetSearchText(w.block).map(plainText),
				...widgetPeople(w.block).flatMap((id) => personNames(id, w.year)),
				type?.label ?? '',
				type?.ko ?? '',
				w.entryTitle,
				ep?.ko ?? ''
			];
			return [w, parts.join('\n').toLowerCase()];
		})
	);

	let tokens = $derived(query.toLowerCase().split(/\s+/).filter(Boolean));
	let found = $derived(tokens.length ? ALL.filter((w) => tokens.every((t) => HAY.get(w)?.includes(t))) : ALL);
	let matched = $derived(found.filter((w) => !w.hidden));
	let matchedHidden = $derived(found.filter((w) => w.hidden));

	const count = (pred: (w: WidgetInstance) => boolean) => matched.filter(pred).length;

	let groupOptions = $derived<{ id: WidgetGroup | 'all' | 'hidden'; label: string; n: number }[]>([
		{ id: 'all', label: ko ? '전체' : 'All', n: matched.length },
		...GROUPS.map((g) => ({ id: g.id, label: ko ? g.ko : g.label, n: count((w) => w.group === g.id) })).filter(
			(g) => g.n > 0
		),
		...(matchedHidden.length ? [{ id: 'hidden' as const, label: ko ? '숨김' : 'Hidden', n: matchedHidden.length }] : [])
	]);

	let kindOptions = $derived(
		group === 'all'
			? []
			: WIDGET_TYPES.filter((t) => group === 'hidden' || t.group === group)
					.map((t) => ({
						id: t.kind,
						label: ko ? t.ko : t.label,
						n: (group === 'hidden' ? matchedHidden : matched).filter((w) => w.kind === t.kind).length
					}))
					.filter((t) => t.n > 0)
	);

	/** Rank sorting needs people on the cards, so it is offered only where cards live. */
	let rankable = $derived(group === 'all' || group === 'characters' || group === 'evolutions');
	let activeSort = $derived<Sort>(sort === 'rank' && !rankable ? 'order' : sort);

	let sortOptions = $derived<GlassOption<Sort>[]>([
		{ value: 'order', label: ko ? '읽는 순서 (회차별)' : 'Reading order, by episode' },
		{ value: 'type', label: ko ? '종류별' : 'By type' },
		{ value: 'year', label: ko ? '연도별' : 'By year' },
		...(rankable ? [{ value: 'rank' as const, label: ko ? '나라·서열별' : 'By kingdom & rank' }] : [])
	]);

	let visible = $derived(
		group === 'hidden'
			? matchedHidden.filter((w) => kind === 'all' || w.kind === kind)
			: matched.filter((w) => (group === 'all' || w.group === group) && (kind === 'all' || w.kind === kind))
	);
	let total = $derived(group === 'hidden' ? HIDDEN.length : LIVE.length);

	/** Filters set beyond the defaults, for the folded phone bar's badge. */
	let activeFilters = $derived((group !== 'all' ? 1 : 0) + (kind !== 'all' ? 1 : 0) + (sort !== 'order' ? 1 : 0));

	/** Card widgets rank their person at the card's year; other widgets carry no rank. */
	const RANKS: ReadonlyMap<WidgetInstance, Rank> = new Map(
		ALL.flatMap((w) => {
			const p = w.block.kind === 'card' ? byId.get(w.block.person) : undefined;
			return p ? [[w, rankOf(p, w.year)] as const] : [];
		})
	);

	function rankLabel(r: Rank) {
		const office = ko ? r.officeKo : r.officeLabel;
		return `${ko ? r.ko : r.label}${office ? ` · ${office}` : ''}`;
	}

	function typeLabel(k: WidgetKind) {
		const t = WIDGET_TYPES[TYPE_ORDER.get(k) ?? -1];
		return t ? (ko ? t.ko : t.label) : k;
	}

	function bucket(items: WidgetInstance[], keyFn: (w: WidgetInstance) => string, head: (w: WidgetInstance) => Omit<Section, 'items'>) {
		const out: Section[] = [];
		for (const w of items) {
			const key = keyFn(w);
			let s = out[out.length - 1];
			if (!s || s.key !== key) {
				s = { ...head(w), key, items: [] };
				out.push(s);
			}
			s.items.push(w);
		}
		return out;
	}

	let sections = $derived.by<Section[]>(() => {
		if (activeSort === 'rank') {
			const ranked = visible.filter((w) => RANKS.has(w));
			const rest = visible.filter((w) => !RANKS.has(w));
			ranked.sort((a, b) => compareRanks(RANKS.get(a)!, RANKS.get(b)!) || a.entryIndex - b.entryIndex);
			const out = bucket(ranked, (w) => RANKS.get(w)!.kingdom, (w) => {
				const r = RANKS.get(w)!;
				return { key: r.kingdom, title: ko ? r.section.ko : r.section.en };
			});
			if (rest.length) out.push({ key: 'unranked', title: ko ? '그 밖의 위젯 (읽는 순서)' : 'Other widgets, reading order', items: rest });
			return out;
		}
		if (activeSort === 'type') {
			const sorted = [...visible].sort(
				(a, b) => (TYPE_ORDER.get(a.kind) ?? 99) - (TYPE_ORDER.get(b.kind) ?? 99) || a.entryIndex - b.entryIndex
			);
			return bucket(sorted, (w) => w.kind, (w) => ({ key: w.kind, title: typeLabel(w.kind) }));
		}
		if (activeSort === 'year') {
			const sorted = [...visible].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.entryIndex - b.entryIndex);
			return bucket(
				sorted,
				(w) => String(w.year ?? '—'),
				(w) => ({ key: '', title: w.year == null ? '—' : w.year < 0 ? `${-w.year} BCE` : `${w.year}` })
			);
		}
		return bucket(visible, (w) => String(w.entryIndex), (w) => {
			const ep = episodeOf(w);
			return { key: '', title: ep ? `${ep.number} · ${ko && ep.ko ? ep.ko : ep.title}` : w.entryTitle, sub: ep?.year };
		});
	});

	/** Filters live in the URL so a filtered view can be shared or reloaded. */
	function syncUrl() {
		const url = new URL(page.url);
		for (const [k, v, def] of [
			['group', group, 'all'],
			['kind', kind, 'all'],
			['sort', sort, 'order'],
			['q', query, '']
		] as const) {
			if (v === def) url.searchParams.delete(k);
			else url.searchParams.set(k, v);
		}
		replaceState(resolve('/widgets') + url.search, page.state);
	}

	function pickGroup(id: WidgetGroup | 'all' | 'hidden') {
		group = id;
		kind = 'all';
		syncUrl();
	}

	function pickKind(id: WidgetKind | 'all') {
		kind = id;
		syncUrl();
	}

	function commitSearch() {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = undefined;
		const next = draft.trim();
		if (next === query) return;
		query = next;
		syncUrl();
	}

	/* A pending commit must not rewrite the address bar after leaving the page. */
	onDestroy(() => clearTimeout(searchTimer));

	function onSearchInput() {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(commitSearch, 160);
	}

	function clearSearch() {
		draft = '';
		commitSearch();
	}

	function onSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitSearch();
		else if (e.key === 'Escape' && draft) {
			e.preventDefault();
			clearSearch();
		}
	}

	/** The `?ep=` query (plus the nsfw/edit flags the reader carries) for a widget's episode. */
	function episodeSearch(w: WidgetInstance) {
		const href = hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(episodeOf(w)?.queryId ?? '')}`, page.url);
		return href.slice(href.indexOf('?'));
	}
</script>

<svelte:head>
	<title>Widgets · King for All</title>
	<meta name="description" content="Every record card, intro card, map and diagram in King for All, by type or episode." />
</svelte:head>

{#snippet chip(active: boolean, label: string, n: number, onclick: () => void)}
	<button type="button" class="chip" class:active aria-pressed={active} {onclick}>
		{label}<span class="n">{n}</span>
	</button>
{/snippet}

<main class="widgets-page">
	<header class="chrome">
		<SiteNavSpace />
	</header>

	<div class="layout">
		<header class="intro">
			<h1>{ko ? '위젯' : 'Widgets'}</h1>
			<p class="meta">
				{ko
					? `이야기 속 사료, 카드, 지도, 도해 ${LIVE.length}개`
					: `${LIVE.length} records, cards, maps and diagrams from the story`}
			</p>
		</header>

		<aside class="controls" class:expanded={filtersOpen} aria-label={ko ? '찾기와 분류' : 'Search and filters'}>
			<p class="tally" aria-live="polite">
				<b>{visible.length}</b>
				{#if visible.length !== total}<span class="of">/ {total}</span>{/if}
				{ko ? '개 위젯' : visible.length === 1 ? 'widget' : 'widgets'}
			</p>
			<div class="bar">
				<label class="search">
					<span class="material-symbols-outlined" aria-hidden="true">search</span>
					<span class="visually-hidden">{ko ? '위젯 검색' : 'Search widgets'}</span>
					<input
						type="search"
						bind:value={draft}
						oninput={onSearchInput}
						onkeydown={onSearchKeydown}
						placeholder={ko ? '이름, 한자, 문구…' : 'Names, hanja, words…'}
						autocomplete="off"
						spellcheck="false"
					/>
					{#if draft}
						<button type="button" class="clear" aria-label={ko ? '지우기' : 'Clear search'} onclick={clearSearch}>
							<span class="material-symbols-outlined" aria-hidden="true">close</span>
						</button>
					{/if}
				</label>
				<button
					type="button"
					class="filters-toggle"
					aria-expanded={filtersOpen}
					aria-controls="widget-filters"
					onclick={() => (filtersOpen = !filtersOpen)}
				>
					<span class="material-symbols-outlined" aria-hidden="true">tune</span>
					<span class="visually-hidden">{ko ? '분류' : 'Filters'}</span>
					{#if activeFilters}<span class="badge">{activeFilters}</span>{/if}
				</button>
			</div>

			<div class="filters" class:open={filtersOpen} id="widget-filters">
				<p class="filter-label">{ko ? '분류' : 'Group'}</p>
				<div class="chips" role="group" aria-label={ko ? '분류' : 'Group'}>
					{#each groupOptions as g (g.id)}
						{@render chip(group === g.id, g.label, g.n, () => pickGroup(g.id))}
					{/each}
				</div>
				{#if kindOptions.length > 1}
					<p class="filter-label">{ko ? '종류' : 'Type'}</p>
					<div class="chips sub" role="group" aria-label={ko ? '종류' : 'Type'}>
						{@render chip(kind === 'all', ko ? '전체' : 'All', kindOptions.reduce((n, k) => n + k.n, 0), () =>
							pickKind('all')
						)}
						{#each kindOptions as k (k.id)}
							{@render chip(kind === k.id, k.label, k.n, () => pickKind(k.id))}
						{/each}
					</div>
				{/if}
				<div class="sort">
					<GlassSelect label={ko ? '정렬' : 'Sort'} bind:value={sort} options={sortOptions} onchange={syncUrl} />
				</div>
			</div>
		</aside>

		<div class="results">
			{#each sections as section, s (`${activeSort}-${section.key || section.title}-${s}`)}
				<section class="section">
					<h2>
						{section.title}
						{#if section.sub}<span class="sub">{section.sub}</span>{/if}
						<span class="n">{section.items.length}</span>
					</h2>
					<ol class="list">
						{#each section.items as w (keyOf(w))}
							{@const key = keyOf(w)}
							<li
								class="item"
								class:pending={!shown.has(key)}
								{@attach onceInView(() => void shown.add(key), { threshold: 0, rootMargin: '800px 0px' })}
							>
								<div class="label">
									<span class="type">
										{typeLabel(w.kind)}
										{#if activeSort === 'rank' && RANKS.has(w)}<span class="rank">{rankLabel(RANKS.get(w)!)}</span>{/if}
										{#if w.hidden}<span class="hidden-tag">{ko ? '숨김' : 'Hidden'}</span>{/if}
									</span>
									<a class="ep" href={resolve('/read') + episodeSearch(w)}>
										{#if activeSort === 'order'}
											{ko ? '이 장면 읽기' : 'Read in episode'}
										{:else}
											{episodeOf(w)?.number ?? ''} · {w.entryTitle}
										{/if}
									</a>
								</div>
								{#if w.hidden?.after}
									<p class="was-after">{ko ? '원래 자리: ' : 'Cut from after: '}<q>{w.hidden.after}</q></p>
								{/if}
								{#if shown.has(key)}
									<div class="stage">
										<Blocks blocks={[w.block]} year={w.year} idPrefix={`w${key}-`} />
									</div>
								{/if}
							</li>
						{/each}
					</ol>
				</section>
			{:else}
				<p class="empty">
					{#if query}
						{ko ? `“${query}”에 해당하는 위젯이 없습니다.` : `No widgets match “${query}”.`}
					{:else}
						{ko ? '해당하는 위젯이 없습니다.' : 'No widgets match.'}
					{/if}
				</p>
			{/each}
		</div>
	</div>
</main>

<style>
	.widgets-page {
		/* Clear of the fixed site pill. */
		--pill-clear: calc(max(0.85rem, env(safe-area-inset-top)) + 2.9rem);
		--side-w: 17rem;
		/* The gutter between the widget column and the filter sidebar. */
		--gutter: clamp(3rem, 5vw, 4.5rem);
		min-height: 100dvh;
		padding-bottom: calc(4rem + var(--tabbar-space, 0px));
		background: var(--bg);
		color: var(--fg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
	}

	.chrome {
		padding: max(0.85rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) 0.5rem
			max(1rem, env(safe-area-inset-left));
	}

	.layout {
		box-sizing: content-box;
		max-width: var(--script-measure);
		margin: 0 auto;
		padding: 0 max(1.25rem, env(safe-area-inset-right)) 0 max(1.25rem, env(safe-area-inset-left));
	}

	.intro {
		display: grid;
		gap: 0.4rem;
		padding: 2.5rem 0 0.5rem;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.meta {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--fg-dim);
	}

	/* Search and filters stay in reach while the long list scrolls under them:
	   a folded bar over the list on phones, a sidebar to its right on desktop. */
	.controls {
		position: sticky;
		top: var(--pill-clear);
		z-index: 30;
		isolation: isolate;
		max-height: calc(100dvh - var(--pill-clear) - 1rem);
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		margin: 1.25rem 0 0.5rem;
		padding: 0.65rem 0;
		background: color-mix(in oklab, var(--bg) 88%, transparent);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--hairline);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding-top: 0.15rem;
	}

	.search {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		min-width: 0;
		height: 2.5rem;
		padding: 0 0.3rem 0 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 4%, transparent);
		color: var(--fg-faint);
		transition: border-color 0.15s;
	}

	.search:focus-within {
		border-color: var(--gold);
	}

	.search .material-symbols-outlined {
		font-size: 1.15rem;
	}

	.search input {
		flex: 1 1 auto;
		min-width: 0;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.search input::placeholder {
		color: var(--fg-faint);
	}

	.search input::-webkit-search-cancel-button {
		display: none;
	}

	.clear,
	.filters-toggle {
		display: grid;
		place-items: center;
		padding: 0;
		border-radius: 999px;
		cursor: pointer;
		font: inherit;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.clear {
		flex: 0 0 auto;
		width: 1.9rem;
		height: 1.9rem;
		border: none;
		background: transparent;
		color: var(--fg-dim);
	}

	.clear:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	.clear .material-symbols-outlined {
		font-size: 1rem;
	}

	.filters-toggle {
		position: relative;
		flex: 0 0 auto;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--hairline);
		background: transparent;
		color: var(--fg-dim);
	}

	.filters-toggle[aria-expanded='true'] {
		border-color: var(--fg-strong);
		background: var(--fg-strong);
		color: var(--bg);
	}

	.filters-toggle .material-symbols-outlined {
		font-size: 1.2rem;
	}

	.badge {
		position: absolute;
		top: -0.1rem;
		right: 0;
		display: grid;
		place-items: center;
		min-width: 1.1rem;
		height: 1.1rem;
		padding: 0 0.25rem;
		border-radius: 999px;
		background: var(--gold);
		color: #14140f;
		font-size: 0.62rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.filters {
		display: none;
		gap: 0.5rem;
		padding-top: 0.75rem;
	}

	.filters.open {
		display: grid;
	}

	.filter-label {
		margin: 0.2rem 0 0;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.results {
		min-width: 0;
	}

	.tally {
		display: none;
		align-items: baseline;
		gap: 0.3rem;
		margin: 0 0 0.6rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--fg-dim);
		font-variant-numeric: tabular-nums;
	}

	.tally b {
		font-size: 1rem;
		font-weight: 700;
		color: var(--fg-strong);
	}

	.tally .of {
		color: var(--fg-faint);
	}

	/* Folded phone bar: the count shows with the filters it answers to. */
	.controls.expanded .tally {
		display: flex;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* The sidebar only where the column, the gutter and the sidebar all fit with room to spare;
	   narrower screens keep the folded top bar. */
	@media (min-width: 1120px) {
		.layout {
			display: grid;
			grid-template-columns: minmax(0, var(--script-measure)) var(--side-w);
			grid-template-areas:
				'intro controls'
				'results controls';
			grid-template-rows: auto 1fr;
			column-gap: var(--gutter);
			max-width: calc(var(--script-measure) + var(--side-w) + var(--gutter));
		}

		.tally {
			display: flex;
		}

		.intro {
			grid-area: intro;
		}

		/* Wide widgets (map sheets) may not spill into the gutter; shadows keep their margin. */
		.results {
			grid-area: results;
			overflow-x: clip;
			overflow-clip-margin: 1.25rem;
		}

		.controls {
			grid-area: controls;
			align-self: start;
			top: calc(var(--pill-clear) + 0.5rem);
			max-height: calc(100dvh - var(--pill-clear) - 1.5rem);
			/* Inset so the scroll box does not clip chip borders and focus rings. */
			margin: calc(2.5rem - 0.2rem) -0.2rem 0;
			padding: 0.2rem 0.2rem 1rem;
			background: none;
			backdrop-filter: none;
			border-bottom: none;
		}

		.filters-toggle {
			display: none;
		}

		.filters,
		.filters.open {
			display: grid;
			gap: 0.55rem;
			padding-top: 1rem;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		display: inline-flex;
		align-items: baseline;
		gap: 0.35rem;
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
		color: var(--fg-dim);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.chip:hover {
		color: var(--fg-strong);
		border-color: var(--fg-faint);
	}

	.chip.active {
		background: var(--fg-strong);
		border-color: var(--fg-strong);
		color: var(--bg);
	}

	.chips.sub .chip {
		padding: 0.25rem 0.6rem;
		font-size: 0.76rem;
	}

	.n {
		font-size: 0.72em;
		font-weight: 500;
		opacity: 0.7;
		font-variant-numeric: tabular-nums;
	}

	.sort {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.75rem;
	}

	/* Touch sizes for the folded bar: every control at least 40px tall. */
	@media (max-width: 1119px) {
		.chip,
		.chips.sub .chip {
			align-items: center;
			min-height: 2.5rem;
		}

		.clear {
			width: 2.5rem;
			height: 2.5rem;
		}

		.search {
			height: 2.75rem;
		}

		.filters-toggle {
			width: 2.75rem;
			height: 2.75rem;
		}
	}

	/* Phones hide the top pill in favour of the tab bar, so the bar can ride the top edge. */
	@media (max-width: 720px) {
		:global(html.has-tabbar) .controls {
			top: max(0.4rem, env(safe-area-inset-top));
			max-height: calc(100dvh - max(0.4rem, env(safe-area-inset-top)) - var(--tabbar-space) - 0.5rem);
		}
	}

	.section {
		margin-top: 2.25rem;
	}

	h2 {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0 0 0.75rem;
		padding-bottom: 0.45rem;
		border-bottom: 1px solid var(--hairline);
		font-family: var(--serif);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	h2 .sub {
		font-family: var(--ui);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--gold);
	}

	h2 .n {
		margin-left: auto;
		font-family: var(--ui);
		color: var(--fg-faint);
	}

	/* minmax(0, …): one wide widget must not stretch the track past the column. */
	.list {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.item {
		min-width: 0;
	}

	.item.pending {
		min-height: 14rem;
	}

	.label {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.4rem;
		font-size: 0.74rem;
	}

	.type {
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.rank {
		margin-left: 0.5rem;
		font-weight: 600;
		letter-spacing: normal;
		text-transform: none;
		color: var(--fg-dim);
	}

	.hidden-tag {
		margin-left: 0.5rem;
		padding: 0.1rem 0.4rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--fg-faint);
	}

	.was-after {
		margin: 0 0 0.6rem;
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--fg-faint);
	}

	.was-after q {
		font-style: italic;
	}

	.ep {
		color: var(--fg-dim);
		text-decoration: none;
	}

	.ep:hover {
		color: var(--fg-strong);
		text-decoration: underline;
	}

	.empty {
		margin-top: 3rem;
		color: var(--fg-dim);
	}
</style>
