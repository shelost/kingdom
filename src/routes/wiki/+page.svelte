<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { pushState, replaceState, afterNavigate } from '$app/navigation';
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
	import { birthNameOf, profileNameOf } from '$lib/givenNames';
	import { reading } from '$lib/reading.svelte';
	import {
		WIKI_KINDS,
		WIKI_KINGDOMS,
		kindOf,
		kindLabel,
		filterProfiles,
		hasRealAvatar,
		groupByKind,
		groupByGodTier,
		godTierLabel,
		parentPlaceOf,
		showsWikiAccent,
		clanSpotlightOf,
		groupMembersOf,
		hasCastFilter,
		castChips,
		withCast,
		type WikiKind,
		type WikiFilters
	} from '$lib/wiki';
	import WikiPeek from '$lib/components/WikiPeek.svelte';
	import CardTag from '$lib/components/CardTag.svelte';
	import RelationHealth from '$lib/components/RelationHealth.svelte';
	import { editUi, EDIT_QUERY } from '$lib/editUi.svelte';
	import CastChips from '$lib/components/CastChips.svelte';
	import { HISTORICAL_TAG, TIE_META, tieStages, tieStageLabel } from '$lib/relations';
	import { bondStillOf } from '$lib/wikiScenes';
	import GlassSelect, { type GlassOption } from '$lib/components/GlassSelect.svelte';
	import WikiLibrary from '$lib/components/WikiLibrary.svelte';
	import WikiOrgPreview from '$lib/components/diagrams/WikiOrgPreview.svelte';
	import { chartsForWikiEntry } from '$lib/components/diagrams/wikiCharts';
	import { storyImg } from '$lib/img';
	import type { Snapshot } from './$types';

	const INDEX_SCROLL_KEY = 'wiki:indexScroll';
	const DETAIL_SCROLL_KEY = 'wiki:detailScroll';
	const FILTERS_KEY = 'wiki:filters';

	/** Query keys for the view, so a refresh or a shared link reopens it exactly. */
	const PARAM = {
		kind: 'type',
		kingdom: 'kingdom',
		tag: 'era',
		gender: 'gender',
		art: 'image',
		q: 'q',
		cast: 'with',
		id: 'id',
		full: 'full'
	} as const;

	/** Person ids picked in the “with” chips; unknown ids are dropped. */
	function castFromList(raw: unknown): string[] {
		const ids = typeof raw === 'string' ? raw.split(',') : Array.isArray(raw) ? raw : [];
		return ids.filter((id): id is string => typeof id === 'string' && byId.has(id));
	}

	/** The filters a URL names; unknown values are dropped. */
	function filtersFromUrl(u: URL): Partial<WikiFilters> {
		const get = (k: keyof typeof PARAM) => u.searchParams.get(PARAM[k]) ?? undefined;
		const out: Partial<WikiFilters> = {};
		const k = get('kind');
		if (k && WIKI_KINDS.some((w) => w.id === k)) out.kind = k as WikiKind;
		const kid = get('kingdom');
		if (kid && kid in KINGDOMS) out.kingdom = kid as WikiFilters['kingdom'];
		const t = get('tag');
		if (t && ERA_TAG_IDS.includes(t)) out.tag = t;
		const g = get('gender');
		if (g === 'm' || g === 'f') out.gender = g;
		const art = get('art');
		if (art === 'missing') out.art = art;
		const text = get('q');
		if (text) out.q = text;
		return out;
	}

	const fromUrl = filtersFromUrl(page.url);
	let kind = $state<WikiFilters['kind']>(fromUrl.kind ?? 'all');
	let kingdom = $state<WikiFilters['kingdom']>(fromUrl.kingdom ?? 'all');
	let tag = $state<WikiFilters['tag']>(fromUrl.tag ?? 'all');
	let gender = $state<WikiFilters['gender']>(fromUrl.gender ?? 'all');
	let art = $state<WikiFilters['art']>(fromUrl.art ?? 'all');
	let q = $state(fromUrl.q ?? '');
	let cast = $state<string[]>(castFromList(page.url.searchParams.get(PARAM.cast)));
	let expanded = $state(page.url.searchParams.get(PARAM.full) === '1' && !!page.url.searchParams.get(PARAM.id));
	let mounted = $state(false);
	let detailScrollEl = $state<HTMLElement | undefined>(undefined);
	/** Per-entry detail scroll tops while hopping related links. */
	let detailScrollById = $state<Record<string, number>>({});

	/**
	 * Selection is local state so the overlay opens on click even if shallow
	 * routing lags. URL `?id=` stays in sync for deep links / back-forward.
	 */
	let selectedId = $state<string | null>(page.url.searchParams.get(PARAM.id));
	let selected = $derived(selectedId ? (byId.get(selectedId) ?? null) : null);

	/** Everything the main filters keep, before the “with” chips narrow it. */
	let base = $derived(filterProfiles({ kind, kingdom, tag, gender, art, q }));
	let showCast = $derived(hasCastFilter(kind));
	let castOptions = $derived(showCast ? castChips(base) : []);
	let filtered = $derived(showCast ? withCast(base, cast) : base);
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
			(art !== 'all' ? 1 : 0) +
			(showCast && cast.length ? 1 : 0) +
			(q.trim() ? 1 : 0)
	);
	let showGenderFilter = $derived(kind === 'character' || kind === 'god' || kind === 'all');

	function readStoredFilters() {
		if (!browser) return;
		try {
			const raw = sessionStorage.getItem(FILTERS_KEY);
			if (!raw) return;
			const v = JSON.parse(raw) as Partial<WikiFilters> & { cast?: unknown };
			if (v.kind) kind = v.kind;
			cast = castFromList(v.cast);
			if (v.kingdom === 'underworld') kingdom = 'all';
			else if (v.kingdom) kingdom = v.kingdom;
			if (v.tag) tag = v.tag;
			if (v.gender) gender = v.gender;
			if (v.art === 'missing' || v.art === 'all') art = v.art;
			if (kind !== 'character' && kind !== 'god' && kind !== 'all') gender = 'all';
			// Do not restore `q` — sticky search (e.g. "go") hid most gods/nations.
		} catch {
			/* ignore */
		}
	}

	function persistFilters() {
		if (!browser) return;
		// Persist type/kingdom/era/gender/image/people only — never the find query.
		sessionStorage.setItem(FILTERS_KEY, JSON.stringify({ kind, kingdom, tag, gender, art, cast }));
	}

	function onKindChange() {
		if (kind !== 'character' && kind !== 'god' && kind !== 'all') gender = 'all';
		// People picked for one kind mean nothing to the next.
		cast = [];
		persistFilters();
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

	/** How many in the current type still lack a painted portrait / board. */
	let missingCount = $derived(
		(kind === 'all' ? PROFILES : PROFILES.filter((p) => kindOf(p) === kind)).filter(
			(p) => !hasRealAvatar(p)
		).length
	);

	function toggleArt() {
		art = art === 'missing' ? 'all' : 'missing';
		persistFilters();
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

	/** Scroll the entry back to where it was, retrying for a few frames while its body is still laying out. */
	function restoreDetailScroll(id: string) {
		if (!browser) return;
		const y = detailScrollById[id] ?? 0;
		let tries = 30;
		const apply = () => {
			if (selectedId !== id) return;
			if (detailScrollEl) detailScrollEl.scrollTop = y;
			if (detailScrollEl && Math.abs(detailScrollEl.scrollTop - y) < 2) return;
			if (tries-- > 0) requestAnimationFrame(apply);
		};
		requestAnimationFrame(apply);
	}

	/** The query for the current view, with entry `id` open (or none), without its `?`. */
	function queryFor(id: string | null): string {
		const params = new URLSearchParams();
		if (kind !== 'all') params.set(PARAM.kind, kind);
		if (kingdom !== 'all') params.set(PARAM.kingdom, kingdom);
		if (tag !== 'all') params.set(PARAM.tag, tag);
		if (gender !== 'all') params.set(PARAM.gender, gender);
		if (art !== 'all') params.set(PARAM.art, art);
		if (showCast && cast.length) params.set(PARAM.cast, cast.join(','));
		if (q.trim()) params.set(PARAM.q, q.trim());
		if (id) params.set(PARAM.id, id);
		if (id && expanded) params.set(PARAM.full, '1');
		if (editUi.enabled) params.set(EDIT_QUERY, 'true');
		return params.toString();
	}

	/** On refresh the open entry keeps its place; the page behind it is restored by the router. */
	function onPageHide() {
		if (selectedId) saveDetailScroll(selectedId);
	}

	/** After hydrate — session filters must not diverge SSR HTML from the first client paint. */
	onMount(() => {
		// A URL that names its filters wins; a bare /wiki falls back to the last session's.
		if (!Object.keys(fromUrl).length && !cast.length) readStoredFilters();
		persistFilters();
		try {
			const raw = sessionStorage.getItem(DETAIL_SCROLL_KEY);
			if (raw) detailScrollById = JSON.parse(raw) as Record<string, number>;
		} catch {
			/* ignore */
		}
		if (selectedId) restoreDetailScroll(selectedId);
		mounted = true;
	});

	/** Filters, search and full-screen ride in the address bar without adding history steps. */
	$effect(() => {
		const query = queryFor(selectedId);
		if (!mounted) return;
		const t = setTimeout(() => {
			if (location.search.slice(1) === query) return;
			try {
				if (query) replaceState(resolve(`/wiki?${query}`), {});
				else replaceState(resolve('/wiki'), {});
			} catch {
				/* history API unavailable */
			}
		}, 250);
		return () => clearTimeout(t);
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
			const query = queryFor(id);
			if (query) pushState(resolve(`/wiki?${query}`), {});
			else pushState(resolve('/wiki'), {});
		} catch {
			/* history API unavailable — overlay still works from local state */
		}
	}

	function openEntry(id: string) {
		if (!id) return;
		if (selectedId) saveDetailScroll(selectedId);
		else saveIndexScroll();
		// Following a link inside a full-screen entry stays full-screen, like a wiki page.
		if (!selectedId) expanded = false;
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
		if (!selectedId) return;
		if (expanded) collapseEntry();
		else clearEntry();
	}

	function kindCount(k: WikiKind | 'all'): number {
		if (k === 'all') return PROFILES.length;
		return PROFILES.filter((p) => kindOf(p) === k).length;
	}

	function kingdomCount(kid: Person['kingdom'] | 'all'): number {
		if (kid === 'all') return PROFILES.length;
		return PROFILES.filter((p) => p.kingdom === kid).length;
	}

	let koMode = $derived(reading.lang === 'ko');
	let featured = $derived(filtered.slice(0, 6));

	const KIND_OPTIONS: GlassOption<WikiFilters['kind']>[] = [
		{ value: 'all', label: 'All', count: kindCount('all') },
		...WIKI_KINDS.map((k) => ({ value: k.id, label: k.plural, count: kindCount(k.id) }))
	];

	const KINGDOM_OPTIONS: GlassOption<WikiFilters['kingdom']>[] = [
		{ value: 'all', label: 'All kingdoms', count: kingdomCount('all') },
		...[...WIKI_KINGDOMS, 'other' as const].map((kid) => ({
			value: kid,
			label: KINGDOMS[kid].label,
			count: kingdomCount(kid)
		}))
	];

	const ERA_OPTIONS: GlassOption<WikiFilters['tag']>[] = [
		{ value: 'all', label: 'Any era', count: tagCount('all') },
		...ERA_TAG_IDS.map((tid) => ({
			value: tid,
			label: ERA_TAG_META[tid]?.label ?? tid,
			count: tagCount(tid),
			hint: ERA_TAG_META[tid]?.hint
		}))
	];

	let genderOptions = $derived<GlassOption<WikiFilters['gender']>[]>([
		{ value: 'all', label: 'All', count: genderCount('all') },
		{ value: 'm', label: 'Men', count: genderCount('m') },
		{ value: 'f', label: 'Women', count: genderCount('f') }
	]);

	type WikiSnap = {
		kind: WikiFilters['kind'];
		kingdom: WikiFilters['kingdom'];
		tag: WikiFilters['tag'];
		gender: WikiFilters['gender'];
		art: WikiFilters['art'];
		q: string;
		cast: string[];
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
				art,
				q,
				cast: [...cast],
				indexScroll: browser ? window.scrollY : 0,
				detailScrollById: { ...detailScrollById },
				expanded
			};
		},
		restore: (value) => {
			kind = value.kind;
			kingdom = value.kingdom === 'underworld' ? 'all' : value.kingdom;
			tag = value.tag ?? 'all';
			gender = value.gender ?? 'all';
			art = value.art ?? 'all';
			if (kind !== 'character' && kind !== 'god' && kind !== 'all') gender = 'all';
			q = value.q ?? '';
			cast = castFromList(value.cast);
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
		>{selected ? `${profileNameOf(selected)} · Wiki` : 'Wiki · King for All'}</title
	>
	<meta
		name="description"
		content="Wiki of every profile in the chronicle — characters, gods, animals, places, nations, clans, organizations, phrases, concepts, and relationships."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} onpopstate={onPopState} onpagehide={onPageHide} />

<main class="wiki" class:dimmed={!!selectedId}>
	<WikiLibrary bind:kind bind:q {featured} onKind={onKindChange} onOpen={openEntry} />

	<section class="browse" aria-label="Wiki results">
		<div class="filters">
			<GlassSelect label="Type" bind:value={kind} options={KIND_OPTIONS} onchange={onKindChange} />
			<GlassSelect
				label="Kingdom"
				bind:value={kingdom}
				options={KINGDOM_OPTIONS}
				onchange={persistFilters}
			/>
			<GlassSelect label="Era" bind:value={tag} options={ERA_OPTIONS} onchange={persistFilters} />
			{#if showGenderFilter}
				<GlassSelect
					label="Gender"
					bind:value={gender}
					options={genderOptions}
					onchange={persistFilters}
				/>
			{/if}
			<button
				type="button"
				class="art-toggle liquid-glass"
				aria-pressed={art === 'missing'}
				onclick={toggleArt}
			>
				<span class="field">Image</span>
				<span class="value">No image</span>
				<span class="n">{missingCount}</span>
			</button>
		</div>
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
			<a class="grade-link" href={resolve('/grade')}>Grade</a>
		</p>

		{#if showCast && castOptions.length}
			<CastChips chips={castOptions} bind:selected={cast} onchange={persistFilters} />
		{/if}

		{#if filtered.length === 0}
			<p class="no-results">
				{art === 'missing'
					? 'Nothing in this type is missing a portrait. Set Type to All.'
					: 'Nothing matches. Widen the filters or clear the search.'}
			</p>
		{:else}
			{#each sections as section, si (section.key)}
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
						{#each section.items as p, i (p.id)}
							{@const kc = { ...(KINGDOMS[p.kingdom] ?? KINGDOMS.other), color: colorOf(p) }}
							{@const accents = accentColorsOf(p)}
							{@const showAccent = showsWikiAccent(p)}
							{@const cardKind = kindOf(p)}
							{@const bondStill =
								cardKind === 'relationship' && !p.avatar ? bondStillOf(p) : undefined}
							{@const art = bondStill ?? avatarOf(p)}
							{@const parentPlace = cardKind === 'place' ? parentPlaceOf(p) : undefined}
							{@const isNationCard = cardKind === 'nation'}
							{@const isObjectCard = cardKind === 'animal' || cardKind === 'instrument'}
							{@const isBondCard = cardKind === 'relationship' && (!!p.avatar || !!bondStill)}
							{@const isGroupStill =
								(cardKind === 'group' || cardKind === 'organization') && !!p.avatar}
							{@const stages = cardKind === 'relationship' ? tieStages(p) : []}
							{@const isShowcase =
								cardKind === 'place' ||
								cardKind === 'city' ||
								isNationCard ||
								isObjectCard ||
								isBondCard ||
								isGroupStill}
							{@const flagArt = isNationCard ? kingdomFlag(p.kingdom) : undefined}
							{@const showcaseArt = isNationCard ? flagArt : art}
							{@const isOrgCard = cardKind === 'organization'}
							{@const isGroupCard = cardKind === 'group'}
							{@const isClanCard = cardKind === 'clan'}
							{@const hasOrgPreview =
								(isOrgCard || isGroupCard) &&
								(!!chartsForWikiEntry(p.id).length || !!(p.orgChart && p.orgChart.length))}
							{@const roster =
								isGroupCard && !hasOrgPreview ? groupMembersOf(p.id).slice(0, 4) : []}
							{@const spotlight = isClanCard ? clanSpotlightOf(p.id) : undefined}
							{@const clanArt = spotlight ? avatarOf(spotlight) : undefined}
							{@const isPortraitCard =
								!isShowcase && !hasOrgPreview && !roster.length && !isOrgCard && !isGroupCard}
							{@const isFaceCard =
								cardKind === 'character' || cardKind === 'god' || cardKind === 'clan'}
							{@const born = birthNameOf(p)}
							{@const koName = born?.korean ?? koreanOf(p)}
							{@const cardHanja = born?.hanja ?? p.hanja}
							{@const hasNative = !!(koName || cardHanja)}
							<li class:tagged={stages.length > 0 || !!p.historical}>
								{#if stages.length}
									<span class="card-tags">
										{#each stages as stage, step (step)}
											{@const meaning = tieStageLabel(stage)}
											<CardTag
												icons={stage}
												colors={stage.map((t) => TIE_META[t].color)}
												label={`${meaning.label} · ${meaning.ko}`}
											/>
										{/each}
									</span>
								{:else if p.historical}
									<span class="card-tags">
										<CardTag
											icons={['historical']}
											colors={[HISTORICAL_TAG.color]}
											label={`${HISTORICAL_TAG.label} · ${HISTORICAL_TAG.ko}`}
										/>
									</span>
								{/if}
								<button
									type="button"
									class="card"
									class:card-showcase={isShowcase}
									class:card-character={isPortraitCard}
									class:card-place={cardKind === 'place' ||
										cardKind === 'city' ||
										isObjectCard ||
										isBondCard ||
										isGroupStill}
									class:card-org={isOrgCard || isGroupCard}
									style:--k={kc.color}
									style:--k2={p.colorSecondary ?? kc.color}
									onclick={() => openEntry(p.id)}
								>
									{#if isShowcase}
										<span
											class="showcase"
											class:showcase-flag={isNationCard}
											class:showcase-bond={isBondCard || isGroupStill}
											class:empty={!showcaseArt}
											aria-hidden="true"
										>
											{#if showcaseArt}
												<img
													{...storyImg(showcaseArt, {
														kind: 'place',
														priority: si === 0 && i < 8,
														alt: '',
														sizes: '(max-width: 820px) 45vw, 220px'
													})}
												/>
											{:else}
												<span class="showcase-initial">{hangulInitial(p)}</span>
											{/if}
											{#if isGroupStill && hasOrgPreview}
												<WikiOrgPreview entry={p} inset />
											{/if}
										</span>
									{:else if hasOrgPreview}
										<WikiOrgPreview entry={p} />
									{:else if roster.length}
										<span class="avatar-roster" data-n={roster.length} aria-hidden="true">
											{#each roster as m (m.id)}
												{@const mArt = avatarOf(m)}
												<span
													class="roster-cell"
													class:silhouette={mArt ? isPlaceholderArt(mArt) : false}
												>
													{#if mArt}
														<img
															{...storyImg(mArt, {
																kind: 'thumb',
																alt: '',
																sizes: '48px'
															})}
														/>
													{:else}
														{hangulInitial(m)}
													{/if}
												</span>
											{/each}
										</span>
									{:else if spotlight}
										<span
											class="avatar avatar-clan"
											class:silhouette={clanArt ? isPlaceholderArt(clanArt) : false}
											aria-hidden="true"
										>
											{#if clanArt}
												<img
													{...storyImg(clanArt, {
														kind: 'thumb',
														priority: si === 0 && i < 8,
														alt: '',
														sizes: '128px'
													})}
												/>
											{:else}
												{hangulInitial(spotlight)}
											{/if}
										</span>
									{:else}
										<span class="avatar" class:silhouette={isPlaceholderArt(art)} aria-hidden="true">
											{#if art}
												<img
													{...storyImg(art, {
														kind: 'thumb',
														priority: si === 0 && i < 8,
														alt: '',
														sizes: '128px'
													})}
												/>
											{:else}
												{hangulInitial(p)}
											{/if}
										</span>
									{/if}
									<span class="meta expo">
										<span class="card-name">
											{koMode ? (koName || profileNameOf(p)) : profileNameOf(p)}
											{#if p.main}<em class="lead-dot" title="Lead">●</em>{/if}
										</span>
										<span class="card-sub">
											{#if hasNative && !(koMode && koName && !cardHanja)}
												<span class="native">
													{#if koName && !koMode}<span class="ko">{koName}</span>{/if}
													{#if cardHanja}<span class="hanja">{cardHanja}</span>{/if}
												</span>
											{/if}
											{#if hasNative}<span class="sep">·</span>{/if}
											{#if parentPlace}
												<span class="city-chip">{nameOf(parentPlace)}</span>
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
										{#if p.summary}
											<span class="card-summary">{p.summary.en}</span>
										{:else if titleOf(p)}
											<span class="card-title">{titleOf(p)}</span>
										{:else if !isFaceCard}
											<span class="card-title">{kindLabel(p)}</span>
										{/if}
										{#if showAccent}
											<span class="card-hexes" title="Accent color">
												{#each accents as hex (hex)}
													<span class="card-hex" style:--chip={hex}>{hex}</span>
												{/each}
											</span>
										{/if}
										{#if !isFaceCard}
											<span class="card-line">{p.tagline}</span>
										{/if}
									</span>
									{#if editUi.enabled && cardKind === 'relationship'}
										<RelationHealth id={p.id} compact />
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		{/if}
	</section>
</main>

<WikiPeek
	{selectedId}
	{expanded}
	onBack={clearEntry}
	onOpen={openEntry}
	onExpand={expandEntry}
	onCollapse={collapseEntry}
	onScrollEl={(el) => (detailScrollEl = el ?? undefined)}
/>

<style>
	.wiki {
		--card-radius: 8px;
		--plate: color-mix(in srgb, var(--panel) 96%, var(--fg) 4%);
		--gutter-l: max(1.5rem, env(safe-area-inset-left, 0px));
		--gutter-r: max(1.5rem, env(safe-area-inset-right, 0px));
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		transition: filter 0.35s var(--ease);
		padding: 0 var(--gutter-r) max(4rem, env(safe-area-inset-bottom, 0px) + 2rem) var(--gutter-l);
	}

	.wiki.dimmed {
		filter: saturate(0.92);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1.15rem;
	}

	.art-toggle {
		--glass-tint: 30%;
		--glass-sheen: 12%;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.5rem;
		padding: 0 1.05rem;
		border-radius: var(--radius-pill);
		font: inherit;
		font-family: var(--ui);
		font-size: 13px;
		letter-spacing: var(--tracking-ui);
		line-height: 1;
		color: var(--fg);
		cursor: pointer;
	}

	.art-toggle:hover {
		--glass-tint: 48%;
	}

	.art-toggle[aria-pressed='true'] {
		--glass-tint: 52%;
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
		color: var(--fg-strong);
	}

	.art-toggle .field {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.art-toggle .value {
		font-weight: 500;
		color: var(--fg-strong);
	}

	.art-toggle .n {
		font-size: 0.68rem;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}

	.browse {
		width: 100%;
		max-width: 72rem;
		min-width: 0;
		margin: 0 auto;
		padding-top: 0.35rem;
	}

	.count {
		margin: 0 0 1.75rem;
		font-family: var(--ui);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.2;
		color: var(--fg-faint);
	}

	.count span {
		color: var(--fg-dim);
	}

	.sort-hint {
		color: var(--fg-faint) !important;
		opacity: 0.75;
	}

	.grade-link {
		float: right;
		color: inherit;
		text-decoration: none;
		transition: color 0.2s var(--ease);
	}

	.grade-link:hover {
		color: var(--fg);
	}

	.no-results {
		margin: 2rem 0;
		color: var(--fg-dim);
		font-style: italic;
	}

	.group {
		margin: 0 0 3.25rem;
	}

	.group-head {
		margin: 0 0 1.15rem;
		border-bottom: none;
		padding-bottom: 0;
	}

	/* Serif title, gold count, hairline running out to the right. */
	.group h2 {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		margin: 0;
		font-family: var(--serif);
		font-size: 1.45rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--fg-strong);
	}

	.group h2::after {
		content: '';
		flex: 1;
		align-self: center;
		height: 1px;
		margin-left: 0.35rem;
		background: var(--hairline);
	}

	.group h2 span {
		font-family: var(--serif);
		font-size: 0.9rem;
		font-weight: 400;
		font-style: italic;
		font-variant-numeric: oldstyle-nums;
		letter-spacing: 0;
		line-height: 1.2;
		color: var(--gold);
	}

	.group-sub {
		margin: 0.28rem 0 0;
		font-family: var(--ui);
		font-size: 0.88rem;
		font-weight: 400;
		letter-spacing: var(--tracking-ui);
		line-height: 1.28;
		color: var(--fg-dim);
	}

	/* Gods filter — class bands read as chronicle divisions, not chip filters. */
	.tier-group {
		margin-bottom: 2.85rem;
	}

	.tier-group .group-head {
		border-bottom: none;
		padding-bottom: 0.2rem;
	}

	.tier-group h2 {
		font-size: 1.6rem;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 1.5rem;
	}

	/* No content-visibility here: its paint containment clips the hover shadow. */
	.grid > li {
		min-width: 0;
	}

	/* Room for the round tag that hangs off the top-left corner. */
	.grid > li.tagged {
		position: relative;
	}

	/* The tags hang off the card's top-left corner; each later stage overlaps the one before. */
	.card-tags {
		position: absolute;
		top: -0.6rem;
		left: -0.6rem;
		z-index: 4;
		display: flex;
		pointer-events: none;
	}

	.card-tags > :global(* + *) {
		margin-left: -0.4rem;
	}

	/* Cards rise into place as they scroll into view. */
	@supports (animation-timeline: view()) {
		.grid > li {
			animation: card-rise linear both;
			animation-timeline: view();
			animation-range: entry 0% entry 55%;
		}
	}

	@keyframes card-rise {
		from {
			opacity: 0;
			transform: translateY(1.6rem) scale(0.97);
		}
	}

	.card {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 1.15rem;
		width: 100%;
		height: 100%;
		min-height: 11.25rem;
		text-align: left;
		padding: 1.25rem 1.35rem;
		border: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
		border-radius: var(--card-radius);
		background: var(--plate);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
		cursor: pointer;
		font: inherit;
		color: inherit;
		isolation: isolate;
		transition:
			border-color 0.35s var(--ease),
			box-shadow 0.35s var(--ease);
	}

	.card.card-showcase {
		flex-direction: column;
		align-items: stretch;
		gap: 0;
		padding: 0;
		overflow: hidden;
	}

	/* Character / clan portrait cards — art flush to edges; text top-aligned. */
	.card.card-character {
		align-items: flex-start;
		gap: 0;
		padding: 0;
		overflow: hidden;
	}

	.card.card-character .avatar,
	.card.card-character .avatar.avatar-clan {
		width: 7.35rem;
		flex-shrink: 0;
		align-self: flex-start;
		aspect-ratio: 2 / 3;
		height: auto;
		min-height: 11.25rem;
		border-radius: 0;
		background: color-mix(in srgb, var(--k) 7%, transparent);
	}

	.card.card-character .avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center bottom;
		transform-origin: 50% 100%;
	}

	.card .avatar img,
	.card .showcase img {
		transform: scale(var(--art-scale, 1));
		transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.card:hover {
		--art-scale: 1.06;
	}

	.card.card-character .meta {
		padding: 1.1rem 1.25rem 1.15rem 1.1rem;
		flex: 1;
		min-width: 0;
		align-self: stretch;
		align-content: start;
		align-items: start;
		justify-content: start;
	}

	.card.card-org {
		align-items: flex-start;
	}

	.card:hover {
		border-color: color-mix(in srgb, var(--k) 40%, transparent);
		box-shadow: 0 14px 30px -20px rgba(0, 0, 0, 0.55);
	}

	.card:focus-visible {
		outline: none;
		border-color: color-mix(in srgb, var(--gold) 70%, transparent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--gold) 22%, transparent);
	}

	.showcase {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: color-mix(in srgb, var(--k) 12%, var(--panel-sunken));
	}

	/* Relationship boards are 2:1 tenebrist two-shots; keep both faces and the gesture between them. */
	.showcase.showcase-bond {
		aspect-ratio: 2 / 1;
		background: #0b0907;
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

	/* Nation flags — contain-fit on kingdom accent, not photo crop. */
	.showcase.showcase-flag img {
		object-fit: contain;
		object-position: center;
		padding: 1rem 1.25rem;
		box-sizing: border-box;
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
		padding: 1rem 1.35rem 1.25rem;
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
		border-radius: var(--radius);
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
		background: transparent;
	}

	/* Group cards — square roster montage of member portraits. */
	.avatar-roster {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2px;
		flex-shrink: 0;
		width: 5.75rem;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 10px;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--k) 12%, var(--panel-sunken));
	}

	/* Two members split the square; a trio gives the first a full column. */
	.avatar-roster[data-n='2'] {
		grid-template-rows: 1fr;
	}

	.avatar-roster[data-n='3'] .roster-cell:first-child {
		grid-row: span 2;
	}

	.roster-cell {
		display: grid;
		place-items: center;
		overflow: hidden;
		font-family: var(--serif);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--fg-dim);
	}

	.roster-cell img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	.roster-cell.silhouette img {
		opacity: 0.62;
	}

	.meta {
		min-width: 0;
		display: grid;
		align-content: start;
		align-items: start;
		justify-items: start;
		gap: 0.16rem;
		padding-top: 0;
	}

	.card-name {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1.22rem;
		line-height: 1.1;
		color: var(--fg-strong);
		letter-spacing: -0.025em;
	}

	.lead-dot {
		font-style: normal;
		font-size: 0.55rem;
		vertical-align: middle;
		margin-left: 0.25rem;
		color: var(--fg-dim);
	}

	.card-sub {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--ui);
		font-size: 0.74rem;
		font-weight: 400;
		letter-spacing: var(--tracking-ui);
		line-height: 1.2;
		color: var(--fg-faint);
	}

	.sep {
		opacity: 0.45;
	}

	.card-sub .native {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--fg-dim);
	}

	.card-sub .hanja {
		color: var(--fg-faint);
	}

	.flag {
		width: 0.9rem;
		height: 0.6rem;
		object-fit: cover;
		border-radius: 1px;
	}

	/* A bond's one-line summary (“Loyalty”, “Girl Dad”), in its colour. */
	.card-summary {
		margin-top: 0.35rem;
		font-family: var(--serif);
		font-size: 1rem;
		font-style: italic;
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.25;
		color: color-mix(in srgb, var(--k) 65%, var(--fg-strong));
	}

	.card-title {
		margin-top: 0.2rem;
		font-family: var(--serif);
		font-size: 0.86rem;
		font-style: italic;
		font-weight: 400;
		letter-spacing: -0.005em;
		line-height: 1.3;
		color: var(--fg-dim);
	}

	.card-hexes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.75rem;
		margin-top: 0.5rem;
	}

	/* Colour swatch: a small lit dot and a quiet code. */
	.card-hex {
		display: inline-flex;
		align-items: center;
		gap: 0.38rem;
		width: fit-content;
		max-width: 100%;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.6rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.card-hex::before {
		content: '';
		width: 0.55rem;
		height: 0.55rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--chip, var(--k));
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 14%, transparent);
	}

	.card-tier {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		margin-top: 0.12rem;
		padding: 0.1rem 0.42rem;
		border-radius: var(--radius-pill);
		font-family: var(--ui);
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		text-transform: uppercase;
		--tag: var(--gold);
		color: color-mix(in srgb, var(--tag) 80%, var(--fg-strong));
		background: color-mix(in srgb, var(--tag) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--tag) 26%, transparent);
	}

	.card-tier[data-tier='S'] {
		--tag: #e8c873;
	}

	.card-tier[data-tier='demigod'] {
		--tag: color-mix(in srgb, var(--k) 55%, #c4a574);
	}

	.card-realm {
		display: inline-flex;
		align-items: baseline;
		gap: 0.25rem;
		width: fit-content;
		margin-top: 0.1rem;
		padding: 0.12rem 0.45rem;
		border-radius: var(--radius-pill);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--k) 72%, var(--fg-strong));
		background: color-mix(in srgb, var(--k) 13%, transparent);
		border: 1px solid color-mix(in srgb, var(--k) 24%, transparent);
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
		margin-top: 0.35rem;
		font-family: var(--ui);
		font-size: 0.82rem;
		letter-spacing: var(--tracking-ui);
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

	@media (max-width: 960px) {
		.wiki {
			--gutter-l: max(1.05rem, env(safe-area-inset-left, 0px));
			--gutter-r: max(1.05rem, env(safe-area-inset-right, 0px));
		}

		.group h2 {
			font-size: 1.25rem;
		}

		.filters {
			display: grid;
			grid-template-columns: 1fr 1fr;
			width: 100%;
		}

		.grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.avatar {
			width: 5rem;
		}

		.card.card-character .avatar,
		.card.card-character .avatar.avatar-clan {
			width: 6.4rem;
			min-height: 9.6rem;
		}

		.card {
			min-height: 9.6rem;
		}

		.card {
			padding: 1rem 1.1rem;
		}

		.card.card-character .meta {
			padding: 0.9rem 1rem 0.95rem 0.9rem;
		}
	}

	@keyframes rule-draw {
		from {
			opacity: 0;
			transform: scaleX(0);
		}
	}

	/* Section rules sweep out as their heading scrolls in. */
	@supports (animation-timeline: view()) {
		.group h2::after {
			transform-origin: left center;
			animation: rule-draw linear both;
			animation-timeline: view();
			animation-range: entry 20% cover 35%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.wiki,
		.grid > li,
		.search,
		.group h2::after {
			animation: none;
			transition: none;
		}

		.card .avatar img,
		.card .showcase img {
			transform: none;
		}
	}
</style>
