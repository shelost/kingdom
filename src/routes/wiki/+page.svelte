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
		reignAvatarOf,
		photoOf,
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
		regnalOf,
		type Person
	} from '$lib/people';
	import { birthNameOf, profileNameOf, wikiNameParts, wikiStyleOf } from '$lib/givenNames';
	import { ordinalSuffix, realmColor, kingdomFrameOf, frameDigitNudge } from '$lib/names';
	import { reading } from '$lib/reading.svelte';
	import {
		WIKI_KINDS,
		WIKI_KINGDOMS,
		kindOf,
		kindLabel,
		filterProfiles,
		hasRealAvatar,
		hasConfirmedAvatar,
		groupByKind,
		groupByGodTier,
		groupByKingdomOrder,
		groupByObjectKind,
		godTierLabel,
		domainMarkOf,
		parentPlaceOf,
		showsWikiAccent,
		clanSpotlightOf,
		groupMembersOf,
		civilizationCoverOf,
		famousFacesOf,
		hasCastFilter,
		castChips,
		withCast,
		ownersOf,
		wikiThumbRatio,
		wikiSubsOf,
		isLegacyObjectKind,
		WIKI_WIDE_THUMB_KINDS,
		STORY_FILTER_OPTIONS,
		type WikiKind,
		type WikiFilters
	} from '$lib/wiki';

	const WIDE_THUMB_KIND = new Set<string>([
		...WIKI_WIDE_THUMB_KINDS,
		'sword',
		'instrument',
		'clothing'
	]);
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
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { storyImg } from '$lib/img';
	import { ui } from '$lib/uiLang';
	import type { Snapshot } from './$types';

	const INDEX_SCROLL_KEY = 'wiki:indexScroll';
	const DETAIL_SCROLL_KEY = 'wiki:detailScroll';
	const FILTERS_KEY = 'wiki:filters';
	const DENSITY_KEY = 'wiki:density';

	/** Query keys for the view, so a refresh or a shared link reopens it exactly. */
	const PARAM = {
		kind: 'type',
		sub: 'sub',
		kingdom: 'kingdom',
		tag: 'era',
		story: 'story',
		gender: 'gender',
		art: 'image',
		q: 'q',
		cast: 'with',
		id: 'id',
		full: 'full'
	} as const;

	const STORY_TITLES = new Set(STORY_FILTER_OPTIONS.map((o) => o.id));

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
		if (k && isLegacyObjectKind(k)) {
			out.kind = 'object';
			out.sub = k;
		} else if (k && WIKI_KINDS.some((w) => w.id === k)) {
			out.kind = k as WikiKind;
		}
		const subRaw = get('sub');
		if (subRaw && subRaw !== 'all' && !out.sub) {
			const allowed = wikiSubsOf((out.kind ?? 'all') as WikiKind | 'all').map((x) => x.id);
			if (allowed.includes(subRaw)) out.sub = subRaw;
		}
		const kid = get('kingdom');
		if (kid && kid in KINGDOMS) out.kingdom = kid as WikiFilters['kingdom'];
		const t = get('tag');
		if (t && ERA_TAG_IDS.includes(t)) out.tag = t;
		const st = get('story');
		if (st && STORY_TITLES.has(st)) out.story = st;
		const g = get('gender');
		if (g === 'm' || g === 'f') out.gender = g;
		const art = get('art');
		if (art === 'missing' || art === 'confirmed') out.art = art;
		const text = get('q');
		if (text) out.q = text;
		return out;
	}

	const fromUrl = filtersFromUrl(page.url);
	let kind = $state<WikiFilters['kind']>(fromUrl.kind ?? 'all');
	let sub = $state<WikiFilters['sub']>(fromUrl.sub ?? 'all');
	let kingdom = $state<WikiFilters['kingdom']>(fromUrl.kingdom ?? 'all');
	let tag = $state<WikiFilters['tag']>(fromUrl.tag ?? 'all');
	let story = $state<WikiFilters['story']>(fromUrl.story ?? 'all');
	let gender = $state<WikiFilters['gender']>(fromUrl.gender ?? 'all');
	let art = $state<WikiFilters['art']>(fromUrl.art ?? 'all');
	let q = $state(fromUrl.q ?? '');
	let cast = $state<string[]>(castFromList(page.url.searchParams.get(PARAM.cast)));
	let expanded = $state(page.url.searchParams.get(PARAM.full) === '1' && !!page.url.searchParams.get(PARAM.id));
	/** Compressed tiles by default; localStorage can still override on mount. */
	let compressed = $state(true);
	/** Characters only: importance (default) or split by kingdom with reign order. */
	let charSort = $state<'importance' | 'kingdom-order'>('importance');
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
	let base = $derived(filterProfiles({ kind, sub, kingdom, tag, story, gender, art, q }));
	let showCast = $derived(hasCastFilter(kind));
	let castOptions = $derived(showCast ? castChips(base) : []);
	let filtered = $derived(showCast ? withCast(base, cast) : base);
	/** Gods filter → class sections; characters can split by kingdom & order; else kind groups. */
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
		if (kind === 'character' && charSort === 'kingdom-order') {
			return groupByKingdomOrder(filtered);
		}
		/** Demigod founders share the Characters shelf — don't split them into a Gods heading. */
		if (kind === 'character') {
			return [
				{
					key: 'character',
					title: WIKI_KINDS.find((k) => k.id === 'character')?.plural ?? 'Characters',
					subtitle: '',
					items: filtered
				}
			];
		}
		/** Objects keep swords / instruments / clothing under their own headers. */
		if (kind === 'object') {
			const ko = reading.lang === 'ko';
			return groupByObjectKind(filtered).map((s) => ({
				key: s.key,
				title: ko ? s.titleKo : s.title,
				subtitle: '',
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
	let showCharSort = $derived(kind === 'character');
	const CHAR_SORT_OPTIONS: GlassOption<'importance' | 'kingdom-order'>[] = [
		{ value: 'importance', label: 'By relevance' },
		{ value: 'kingdom-order', label: 'By kingdom & order' }
	];
	let activeFilterCount = $derived(
		(kind !== 'all' ? 1 : 0) +
			(sub !== 'all' ? 1 : 0) +
			(kingdom !== 'all' ? 1 : 0) +
			(tag !== 'all' ? 1 : 0) +
			(story !== 'all' ? 1 : 0) +
			(gender !== 'all' ? 1 : 0) +
			(art !== 'all' ? 1 : 0) +
			(showCast && cast.length ? 1 : 0) +
			(q.trim() ? 1 : 0)
	);
	let showGenderFilter = $derived(kind === 'character' || kind === 'god' || kind === 'all');
	/** Story cast is character metadata — show beside Era when browsing characters or All. */
	let showStoryFilter = $derived(kind === 'character' || kind === 'all');

	function readStoredFilters() {
		if (!browser) return;
		try {
			const raw = sessionStorage.getItem(FILTERS_KEY);
			if (!raw) return;
			const v = JSON.parse(raw) as Partial<WikiFilters> & { cast?: unknown };
			if (v.kind && isLegacyObjectKind(v.kind)) {
				kind = 'object';
				sub = v.kind;
			} else {
				if (v.kind && WIKI_KINDS.some((w) => w.id === v.kind)) kind = v.kind;
				if (typeof v.sub === 'string') {
					const allowed = wikiSubsOf(kind).map((x) => x.id);
					sub = v.sub === 'all' || allowed.includes(v.sub) ? v.sub : 'all';
				}
			}
			cast = castFromList(v.cast);
			if (v.kingdom === 'underworld') kingdom = 'all';
			else if (v.kingdom) kingdom = v.kingdom;
			if (v.tag) tag = v.tag;
			if (typeof v.story === 'string' && (v.story === 'all' || STORY_TITLES.has(v.story))) {
				story = v.story;
			}
			if (v.gender) gender = v.gender;
			if (v.art === 'missing' || v.art === 'confirmed' || v.art === 'all') art = v.art;
			if (kind !== 'character' && kind !== 'god' && kind !== 'all') gender = 'all';
			// Do not restore `q` — sticky search (e.g. "go") hid most gods/nations.
		} catch {
			/* ignore */
		}
	}

	function persistFilters() {
		if (!browser) return;
		// Persist type/kingdom/era/story/gender/image/people only — never the find query.
		sessionStorage.setItem(
			FILTERS_KEY,
			JSON.stringify({ kind, sub, kingdom, tag, story, gender, art, cast })
		);
	}

	function onKindChange() {
		if (kind !== 'character' && kind !== 'god' && kind !== 'all') gender = 'all';
		// Sub-chips are per category; leave them when the category changes.
		sub = 'all';
		// People picked for one kind mean nothing to the next.
		cast = [];
		persistFilters();
	}

	function onSubChange() {
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

	function artPool(): Person[] {
		return kind === 'all' ? PROFILES : PROFILES.filter((p) => kindOf(p) === kind);
	}

	let artOptions = $derived<GlassOption<WikiFilters['art']>[]>([
		{ value: 'all', label: 'All', count: artPool().length },
		{
			value: 'confirmed',
			label: 'Confirmed',
			hint: 'Transparent cutouts only',
			count: artPool().filter((p) => hasConfirmedAvatar(p)).length
		},
		{
			value: 'missing',
			label: 'No image',
			count: artPool().filter((p) => !hasRealAvatar(p)).length
		}
	]);

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
		if (sub !== 'all') params.set(PARAM.sub, sub);
		if (kingdom !== 'all') params.set(PARAM.kingdom, kingdom);
		if (tag !== 'all') params.set(PARAM.tag, tag);
		if (story !== 'all') params.set(PARAM.story, story);
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
	function persistDensity() {
		if (!browser) return;
		try {
			localStorage.setItem(DENSITY_KEY, compressed ? 'compressed' : 'comfortable');
		} catch {
			/* ignore */
		}
	}

	onMount(() => {
		// A URL that names its filters wins; a bare /wiki falls back to the last session's.
		if (!Object.keys(fromUrl).length && !cast.length) readStoredFilters();
		persistFilters();
		try {
			const dens = localStorage.getItem(DENSITY_KEY);
			if (dens === 'comfortable') compressed = false;
			else if (dens === 'compressed') compressed = true;
		} catch {
			/* ignore */
		}
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

	const STORY_OPTIONS: GlassOption<WikiFilters['story']>[] = [
		{
			value: 'all',
			label: 'Any story',
			count: PROFILES.filter((p) => kindOf(p) === 'character').length
		},
		...STORY_FILTER_OPTIONS.map((o) => ({
			value: o.id,
			label: o.label,
			count: o.count
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
		story: WikiFilters['story'];
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
				story,
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
			story =
				typeof value.story === 'string' &&
				(value.story === 'all' || STORY_TITLES.has(value.story))
					? value.story
					: 'all';
			gender = value.gender ?? 'all';
			art =
				value.art === 'missing' || value.art === 'confirmed' || value.art === 'all'
					? value.art
					: 'all';
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
		content="Wiki of every profile in the chronicle — characters, gods, animals, flowers, places, nations, clans, organizations, concepts, and relationships."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} onpopstate={onPopState} onpagehide={onPageHide} />

<main class="wiki" class:dimmed={!!selectedId}>
	<SiteNavSpace />
	<WikiLibrary bind:kind bind:sub bind:q onKind={onKindChange} onSub={onSubChange} />

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
			{#if showStoryFilter}
				<GlassSelect
					label="Story"
					bind:value={story}
					options={STORY_OPTIONS}
					onchange={persistFilters}
				/>
			{/if}
			{#if showGenderFilter}
				<GlassSelect
					label="Gender"
					bind:value={gender}
					options={genderOptions}
					onchange={persistFilters}
				/>
			{/if}
			<GlassSelect
				label="Image"
				bind:value={art}
				options={artOptions}
				onchange={persistFilters}
			/>
			{#if showCharSort}
				<GlassSelect
					label="Sort"
					bind:value={charSort}
					options={CHAR_SORT_OPTIONS}
					onchange={persistFilters}
				/>
			{/if}
		</div>
		<div class="count-row">
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
							: kind === 'character' && charSort === 'kingdom-order'
								? '· by kingdom & order'
								: '· by relevance'}</span
				>
				<a class="grade-link" href={resolve('/grade')}>Grade</a>
			</p>
			<span class="density-mode" role="group" aria-label={ui('Card density')}>
				<button
					type="button"
					aria-pressed={!compressed}
					onclick={() => {
						compressed = false;
						persistDensity();
					}}>{ui('Comfortable')}</button
				>
				<button
					type="button"
					aria-pressed={compressed}
					onclick={() => {
						compressed = true;
						persistDensity();
					}}>{ui('Compressed')}</button
				>
			</span>
		</div>

		{#if showCast && castOptions.length}
			<CastChips chips={castOptions} bind:selected={cast} onchange={persistFilters} />
		{/if}

		{#if filtered.length === 0}
			<p class="no-results">
				{art === 'missing'
					? 'Nothing in this type is missing a portrait. Set Type to All.'
					: art === 'confirmed'
						? 'Nothing in this type has a confirmed cutout. Painted backgrounds stay out of this filter.'
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
					<ul
						class="grid"
						class:dense={compressed}
						class:thumbs-wide={compressed && WIDE_THUMB_KIND.has(section.key)}
					>
						{#each section.items as p, i (p.id)}
							{@const kc = { ...(KINGDOMS[p.kingdom] ?? KINGDOMS.other), color: colorOf(p) }}
							{@const accents = accentColorsOf(p)}
							{@const showAccent = showsWikiAccent(p)}
							{@const cardKind = kindOf(p)}
							{@const bondStill =
								cardKind === 'relationship' && !p.avatar ? bondStillOf(p) : undefined}
							{@const art =
								bondStill ?? (sub === 'monarch' ? reignAvatarOf(p) : avatarOf(p))}
							{@const frame = kingdomFrameOf(p.kingdom)}
							{@const digitNudge = frameDigitNudge(frame)}
							{@const parentPlace = cardKind === 'place' ? parentPlaceOf(p) : undefined}
							{@const isNationCard = cardKind === 'nation' || cardKind === 'people'}
							{@const isObjectCard = cardKind === 'animal' || cardKind === 'object'}
							{@const isBondCard = cardKind === 'relationship' && (!!p.avatar || !!bondStill)}
							{@const isOrgCard = cardKind === 'organization'}
							{@const isGroupCard = cardKind === 'group'}
							{@const isClanCard = cardKind === 'clan'}
							{@const groupStillArt =
								(isOrgCard || isGroupCard || isClanCard) && art && !isPlaceholderArt(art)
									? art
									: undefined}
							{@const isGroupStill = !!groupStillArt}
							{@const stages = cardKind === 'relationship' ? tieStages(p) : []}
							{@const isShowcase =
								cardKind === 'place' ||
								cardKind === 'city' ||
								isNationCard ||
								isObjectCard ||
								isBondCard ||
								isGroupStill}
							{@const flagArt = cardKind === 'nation' ? kingdomFlag(p.kingdom) : undefined}
							{@const peopleCover =
								cardKind === 'people' ? civilizationCoverOf(p) ?? photoOf(p) : undefined}
							{@const showcaseArt = isNationCard
								? (peopleCover ?? flagArt)
								: isGroupStill
									? groupStillArt
									: art}
							{@const hasOrgPreview =
								(isOrgCard || isGroupCard) &&
								(!!chartsForWikiEntry(p.id).length || !!(p.orgChart && p.orgChart.length))}
							{@const famousFaces =
								cardKind === 'people' && !showcaseArt ? famousFacesOf(p.id) : []}
							{@const roster =
								famousFaces.length
									? famousFaces
									: isGroupCard && !isGroupStill && !hasOrgPreview
										? groupMembersOf(p.id).slice(0, 4)
										: []}
							{@const spotlight =
								isClanCard && !isGroupStill ? clanSpotlightOf(p.id) : undefined}
							{@const clanArt = spotlight ? avatarOf(spotlight) : undefined}
							{@const isPortraitCard =
								!isShowcase && !roster.length && !isOrgCard && !isGroupCard && !isClanCard}
							{@const isFaceCard =
								cardKind === 'character' || cardKind === 'god' || cardKind === 'clan'}
							{@const thumbRatio = wikiThumbRatio(p)}
							{@const ownerPeople =
								cardKind === 'animal' || p.entity === 'sword' ? ownersOf(p.id) : []}
							{@const born = birthNameOf(p)}
							{@const koName = born?.korean ?? koreanOf(p)}
							{@const cardHanja = born?.hanja ?? p.hanja}
							{@const hasNative = !!(koName || cardHanja)}
							{@const nameParts = isFaceCard ? wikiNameParts(p, koMode) : null}
							{@const styleLine = isFaceCard ? wikiStyleOf(p, koMode) : undefined}
							{@const regnal = isFaceCard ? (regnalOf(p) ?? null) : null}
							{@const nation = isFaceCard ? realmColor(p) : kc.color}
							{@const regnalLabel =
								regnal == null
									? ''
									: koMode
										? `제${regnal}대`
										: `${regnal}${ordinalSuffix(regnal)} sovereign`}
							<li
								class:tagged={stages.length > 0 || !!p.historical}
								class:owned={ownerPeople.length > 0}
							>
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
								{#if ownerPeople.length}
									<span class="owner-avatars" aria-hidden="true">
										{#each ownerPeople as owner (owner.id)}
											{@const ownerArt = avatarOf(owner)}
											<span
												class="owner-avatar"
												class:silhouette={ownerArt ? isPlaceholderArt(ownerArt) : false}
												title={nameOf(owner)}
											>
												{#if ownerArt}
													<img
														{...storyImg(ownerArt, {
															kind: 'thumb',
															alt: '',
															sizes: '40px'
														})}
													/>
												{:else}
													{hangulInitial(owner)}
												{/if}
											</span>
										{/each}
									</span>
								{/if}
								<button
									type="button"
									class="card"
									class:card-showcase={isShowcase && (!!showcaseArt || !roster.length)}
									class:card-character={isPortraitCard}
									class:card-place={cardKind === 'place' ||
										cardKind === 'city' ||
										isObjectCard ||
										isBondCard ||
										isGroupStill ||
										isClanCard}
									class:card-org={isOrgCard || isGroupCard || (cardKind === 'people' && !!roster.length && !showcaseArt)}
									class:card-dense={compressed}
									style:--k={kc.color}
									style:--k2={p.colorSecondary ?? kc.color}
									style:--nation={nation}
									style:--thumb-ratio={thumbRatio}
									onclick={() => openEntry(p.id)}
								>
									{#if compressed && regnal != null}
										<span
											class="regnal-chip"
											data-frame={frame}
											style:--nation={nation}
											style:--nudge-x={digitNudge.x}
											style:--nudge-y={digitNudge.y}
											title={regnalLabel}
											aria-label={regnalLabel}
										><span class="regnal-n">{regnal}</span></span>
									{:else if compressed}
										{@const mark = domainMarkOf(p)}
										{#if mark}
											<span
												class="domain-chip"
												data-kind={mark.kind}
												data-frame={frame}
												style:--nation={mark.color}
												style:--nudge-x={digitNudge.x}
												style:--nudge-y={digitNudge.y}
												title={`${mark.en} · ${mark.ko}`}
												aria-label={`${mark.en} · ${mark.ko}`}
											>
												{#if mark.kind === 'icon'}
													<span class="material-symbols-outlined" aria-hidden="true">{mark.show}</span>
												{:else}
													{mark.show}
												{/if}
											</span>
										{/if}
									{/if}
									{#if isShowcase && (showcaseArt || !roster.length)}
										<span
											class="showcase"
											class:showcase-flag={cardKind === 'nation' && !!flagArt && !peopleCover}
											class:showcase-bond={isBondCard || isGroupStill || cardKind === 'people'}
											class:showcase-sword={p.entity === 'sword'}
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
										{#if compressed && styleLine}
											<span class="card-style" style:--nation={nation}>{styleLine}</span>
										{/if}
										<span class="card-name">
											{#if compressed && nameParts}
												{#if nameParts.surname}<span class="surname">{nameParts.surname}</span>{/if}
												<span class="given">{nameParts.given}</span>
											{:else}
												{koMode ? (koName || profileNameOf(p)) : profileNameOf(p)}
											{/if}
											{#if p.main}<em class="lead-dot" title="Lead">●</em>{/if}
										</span>
										{#if cardKind === 'people'}
											<span class="card-sub card-people-sub">
												{#if hasNative}
													<span class="native">
														{#if koName}<span class="ko">{koName}</span>{/if}
														{#if cardHanja}<span class="hanja">{cardHanja}</span>{/if}
													</span>
												{/if}
												{#if p.modernName}
													{#if hasNative}<span class="sep">·</span>{/if}
													<span class="modern">{p.modernName.en}</span>
												{/if}
											</span>
											{#if p.rulerTitle}
												<span class="card-title card-ruler" title={p.rulerTitle.gloss ?? p.rulerTitle.en}>
													{p.rulerTitle.en}
													{#if p.rulerTitle.native}<span class="ruler-native"> · {p.rulerTitle.native}</span>{/if}
												</span>
											{:else if titleOf(p)}
												<span class="card-title">{titleOf(p)}</span>
											{/if}
											{#if p.summary && !compressed}
												<span class="card-summary">{p.summary.en}</span>
											{/if}
										{:else}
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
											{#if p.retired}
												<span class="card-retired">Retired</span>
											{/if}
											{#if p.realm && !compressed}
												{@const mark = domainMarkOf(p)}
												<span class="card-realm">
													{#if mark}
														<span class="card-domain" data-kind={mark.kind} style:--domain={mark.color} title={mark.en}>
															{#if mark.kind === 'icon'}
																<span class="material-symbols-outlined" aria-hidden="true">{mark.show}</span>
															{:else}
																{mark.show}
															{/if}
														</span>
													{/if}
													{p.realm.en}<span class="realm-ko"> · {p.realm.ko}</span>
												</span>
											{/if}
											{#if p.summary}
												<span class="card-summary">{p.summary.en}</span>
											{:else if titleOf(p)}
												<span class="card-title">{titleOf(p)}</span>
											{:else if !isFaceCard}
												<span class="card-title">{kindLabel(p)}</span>
											{/if}
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

<style lang="scss">
	.wiki {
		--card-radius: var(--radius-panel);
		--plate: var(--panel);
		--gutter-l: max(2rem, env(safe-area-inset-left, 0px) + 0.5rem);
		--gutter-r: max(2rem, env(safe-area-inset-right, 0px) + 0.5rem);
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
		transition: filter var(--duration-normal) var(--ease);
		padding: 0 var(--gutter-r) max(4.5rem, env(safe-area-inset-bottom, 0px) + 2.5rem) var(--gutter-l);
		&.dimmed {
			filter: saturate(0.92);
		}
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1.15rem;
	}

	.browse {
		width: 100%;
		max-width: 72rem;
		min-width: 0;
		margin: 0 auto;
		padding-top: 0.35rem;
	}

	.count-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem 1rem;
		margin: 0 0 1.75rem;
	}

	.count {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.2;
		color: var(--fg-faint);
		& span {
			color: var(--fg-dim);
		}
	}

	.sort-hint {
		color: var(--fg-faint) !important;
		opacity: 0.75;
	}

	.grade-link {
		margin-left: 0.65rem;
		color: inherit;
		text-decoration: none;
		transition: color 0.2s var(--ease);
		&:hover {
			color: var(--fg);
		}
	}

	.density-mode {
		display: inline-flex;
		flex: 0 0 auto;
		padding: 2px;
		border: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
		border-radius: 999px;
		font-family: var(--ui);
		& button {
			padding: 0.14rem 0.65rem;
			border: 0;
			border-radius: 999px;
			background: transparent;
			font: inherit;
			font-size: 0.62rem;
			font-weight: 600;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--fg-faint);
			cursor: pointer;
			transition: color 0.2s var(--ease), background 0.2s var(--ease);
			&[aria-pressed='true'] {
				color: var(--bg);
				background: var(--fg-strong);
			}
			&:focus-visible {
				outline: 2px solid var(--gold);
				outline-offset: 2px;
			}
		}
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
		&::after {
			content: '';
			flex: 1;
			align-self: center;
			height: 1px;
			margin-left: 0.35rem;
			background: var(--hairline);
		}
		& span {
			font-family: var(--serif);
			font-size: 0.9rem;
			font-weight: 400;
			font-style: italic;
			font-variant-numeric: oldstyle-nums;
			letter-spacing: 0;
			line-height: 1.2;
			color: var(--gold);
		}
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
		& .group-head {
			border-bottom: none;
			padding-bottom: 0.2rem;
		}
		& h2 {
			font-size: 1.6rem;
		}
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
		gap: 1.5rem;
		& > li {
			/* No content-visibility here: its paint containment clips the hover shadow. */
			min-width: 0;
			&.tagged, &.owned {
				/* Room for tags / owner circles that hang off the card corners. */
				position: relative;
			}
		}
	}

	/* The tags hang off the card's top-left corner; each later stage overlaps the one before. */

	.card-tags {
		position: absolute;
		top: -0.6rem;
		left: -0.6rem;
		z-index: 4;
		display: flex;
		pointer-events: none;
		& > :global(* + *) {
			margin-left: -0.4rem;
		}
	}

	/* Owner portraits hang off the thumbnail’s top-right (animals / swords). */

	.owner-avatars {
		position: absolute;
		top: -0.55rem;
		right: -0.45rem;
		z-index: 4;
		display: flex;
		flex-direction: row-reverse;
		pointer-events: none;
	}

	.owner-avatar {
		display: grid;
		place-items: center;
		width: 1.85rem;
		height: 1.85rem;
		overflow: hidden;
		border-radius: 50%;
		background: color-mix(in srgb, var(--panel) 88%, var(--fg) 12%);
		box-shadow: 0 0 0 2px var(--bg, #15120e), 0 4px 10px -4px rgb(0 0 0 / 0.55);
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 700;
		color: var(--fg-dim);
		.owner-avatars > .owner-avatar + & {
			margin-right: -0.45rem;
		}
		& img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center 18%;
		}
		&.silhouette img {
			opacity: 0.62;
		}
		.grid.dense & {
			width: 1.45rem;
			height: 1.45rem;
			font-size: 0.58rem;
		}
	}

	.grid.dense .owner-avatars {
		top: -0.4rem;
		right: -0.35rem;
		& > .owner-avatar + .owner-avatar {
			margin-right: -0.38rem;
		}
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
		padding: 1.35rem 1.45rem;
		border: 1px solid var(--hairline);
		border-radius: var(--card-radius);
		background: var(--plate);
		box-shadow: var(--shadow-soft);
		cursor: pointer;
		font: inherit;
		color: inherit;
		isolation: isolate;
		transition: border-color var(--duration-normal) var(--ease), box-shadow var(--duration-normal) var(--ease);
		&.card-showcase {
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			padding: 0;
			overflow: hidden;
		}
		&.card-character {
			/* Character / clan portrait cards — art flush to edges; text top-aligned. */
			align-items: flex-start;
			gap: 0;
			padding: 0;
			overflow: hidden;
			& .avatar, & .avatar.avatar-clan {
				width: 7.35rem;
				flex-shrink: 0;
				align-self: flex-start;
				aspect-ratio: 2 / 3;
				height: auto;
				min-height: 11.25rem;
				border-radius: 0;
				background: color-mix(in srgb, var(--k) 12%, transparent);
			}
			& .avatar img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center 18%;
				transform-origin: 50% 20%;
			}
		}
		& .avatar img, & .showcase img {
			transform: scale(var(--art-scale, 1));
			transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		&:hover {
			--art-scale: 1.06;
		}
		&.card-character .meta {
			padding: 1.1rem 1.25rem 1.15rem 1.1rem;
			flex: 1;
			min-width: 0;
			align-self: stretch;
			align-content: start;
			align-items: start;
			justify-content: start;
		}
	}

	/* Compressed — image tiles with title / kingdom overlay. */

	.grid.dense {
		grid-template-columns: repeat(auto-fill, minmax(8.75rem, 1fr));
		gap: 0.55rem;
		&.thumbs-wide {
			/* Horizontal boards (places, bonds, orgs, clans…) — three columns, not six. */
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.65rem;
		}
		& .card.card-dense {
			flex-direction: column;
			align-items: stretch;
			gap: 0;
			min-height: 0;
			aspect-ratio: var(--thumb-ratio, 2 / 3);
			padding: 0;
			overflow: hidden;
			&.card-character .avatar, &.card-character .avatar.avatar-clan, & .showcase, & .avatar-roster, & :global(.org-preview) {
				position: absolute;
				inset: 0;
				width: 100%;
				height: 100%;
				min-height: 0;
				aspect-ratio: auto;
				border-radius: 0;
				z-index: 0;
			}
			&.card-character .avatar img, & .showcase img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center 16%;
			}
			& .meta {
				position: absolute;
				inset: auto 0 0 0;
				z-index: 2;
				display: flex;
				flex-direction: column;
				gap: 0.1rem;
				padding: 1.65rem 0.5rem 0.45rem;
				background: linear-gradient( to top, color-mix(in srgb, #0a0908 72%, transparent) 0%, color-mix(in srgb, #0a0908 28%, transparent) 62%, transparent 100% );
				color: #f4f1e8;
				pointer-events: none;
			}
			& .regnal-chip, & .domain-chip {
				/* Seat / domain mark: solid kingdom polygon, white digit, shape per kingdom. */
				position: absolute;
				top: 0.4rem;
				right: 0.4rem;
				z-index: 3;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 2.3rem;
				height: 2.3rem;
				padding: 0;
				border: 0;
				border-radius: 0.7rem;
				background: var(--nation);
				box-shadow: 0 2px 8px rgb(0 0 0 / 0.28);
				color: #fff;
				font-family: var(--serif);
				font-variant-numeric: tabular-nums;
				text-shadow: none;
				pointer-events: none;
				--nudge-x: 0;
				--nudge-y: 0.06em;
			}
			& .regnal-chip .regnal-n,
			& .domain-chip > :first-child {
				display: block;
				font-size: 1.15rem;
				font-weight: 800;
				letter-spacing: -0.04em;
				line-height: 1;
				color: #fff;
				/* Per-shape optical centre — set via --nudge-x/y on the chip. */
				translate: var(--nudge-x) var(--nudge-y);
			}
			& .regnal-chip[data-frame='circle'], & .domain-chip[data-frame='circle'] {
				border-radius: 999px;
			}
			& .regnal-chip[data-frame='square'], & .domain-chip[data-frame='square'] {
				border-radius: 0.28rem;
			}
			& .regnal-chip[data-frame='rounded'], & .domain-chip[data-frame='rounded'] {
				border-radius: 0.55rem;
			}
			& .regnal-chip[data-frame='pill'], & .domain-chip[data-frame='pill'] {
				width: 2.55rem;
				border-radius: 999px;
			}
			& .regnal-chip[data-frame='diamond'], & .domain-chip[data-frame='diamond'] {
				border-radius: 0.35rem;
				rotate: 45deg;
			}
			& .regnal-chip[data-frame='diamond'] .regnal-n,
			& .domain-chip[data-frame='diamond'] > :first-child {
				rotate: -45deg;
			}
			& .regnal-chip[data-frame='pentagon'], & .domain-chip[data-frame='pentagon'] {
				border-radius: 0;
				clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
			}
			& .regnal-chip[data-frame='hexagon'], & .domain-chip[data-frame='hexagon'] {
				border-radius: 0;
				clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
			}
			& .regnal-chip[data-frame='shield'], & .domain-chip[data-frame='shield'] {
				border-radius: 0.45rem 0.45rem 0.45rem 0.45rem / 0.45rem 0.45rem 1.1rem 1.1rem;
			}
			& .domain-chip[data-kind='text'] {
				font-size: 0.72rem;
				font-weight: 800;
				letter-spacing: 0.02em;
				min-width: 2.55rem;
				padding: 0 0.35rem;
			}
			& .domain-chip[data-kind='icon'] .material-symbols-outlined {
				font-size: 1.25rem;
				font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24;
				text-shadow: none;
			}
			& .domain-chip[data-kind='hanja'] {
				font-size: 1.35rem;
			}
			& .card-style {
				font-family: var(--serif);
				font-size: 0.62rem;
				font-weight: 650;
				font-style: italic;
				letter-spacing: 0.02em;
				line-height: 1.15;
				color: color-mix(in srgb, var(--nation) 72%, #fff);
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
			}
			& .card-name {
				display: flex;
				flex-wrap: wrap;
				align-items: baseline;
				gap: 0.28rem;
				font-size: 0.82rem;
				line-height: 1.15;
				color: #faf8f2;
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
				& .surname {
					font-weight: 500;
					opacity: 0.72;
					letter-spacing: 0.02em;
				}
				& .given {
					font-weight: 750;
				}
			}
			& .card-sub {
				font-size: 0.58rem;
				letter-spacing: 0.04em;
				color: color-mix(in srgb, #f4f1e8 78%, transparent);
			}
			& .card-sub .native, & .card-sub .sep, & .card-tier, & .card-realm, & .card-summary, & .card-hexes, & .card-line, & .lead-dot {
				display: none;
			}
			& .card-people-sub, & .card-people-sub .native, & .card-people-sub .sep, & .card-people-sub .modern, & .card-ruler {
				/* Ten Peoples: keep native script, modern name, and ruler title on the tile. */
				display: inline;
			}
			& .card-people-sub {
				display: flex;
				flex-wrap: wrap;
				align-items: baseline;
				gap: 0.2rem 0.35rem;
				font-size: 0.58rem;
				letter-spacing: 0.03em;
				color: color-mix(in srgb, #f4f1e8 82%, transparent);
				& .native {
					display: inline-flex;
					gap: 0.28rem;
					font-family: var(--serif);
					font-weight: 650;
					color: color-mix(in srgb, #f4f1e8 92%, transparent);
				}
				& .modern {
					font-weight: 600;
					letter-spacing: 0.06em;
					text-transform: uppercase;
					font-size: 0.52rem;
					color: color-mix(in srgb, var(--k) 55%, #f4f1e8);
				}
			}
			& .card-ruler {
				display: block;
				margin-top: 0.12rem;
				font-family: var(--serif);
				font-size: 0.62rem;
				font-weight: 700;
				letter-spacing: 0.04em;
				color: color-mix(in srgb, #f4f1e8 88%, transparent);
				-webkit-line-clamp: 1;
				line-clamp: 1;
				& .ruler-native {
					font-weight: 500;
					opacity: 0.78;
				}
			}
			& .card-title {
				font-size: 0.58rem;
				line-height: 1.2;
				color: color-mix(in srgb, #f4f1e8 70%, transparent);
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}
			&.card-character .card-title {
				/* Face tiles: style line + name carry the rank; drop the long title. */
				display: none;
			}
			& .flag {
				width: 0.85rem;
				height: 0.55rem;
			}
		}
	}

	.card.card-org {
		align-items: flex-start;
	}

	.card:hover {
		border-color: color-mix(in srgb, var(--k) 35%, var(--hairline));
		box-shadow: var(--shadow-soft);
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
		aspect-ratio: var(--thumb-ratio, 16 / 10);
		overflow: hidden;
		background: color-mix(in srgb, var(--k) 12%, var(--panel-sunken));
		&.showcase-bond {
			/* Relationship boards are 2:1 tenebrist two-shots; keep both faces and the gesture between them. */
			aspect-ratio: var(--thumb-ratio, 2 / 1);
			background: #0b0907;
		}
		&.empty {
			display: grid;
			place-items: center;
		}
		& img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
		&.showcase-flag img {
			/* Nation flags — contain-fit on kingdom accent, not photo crop. */
			object-fit: contain;
			object-position: center;
			padding: 1rem 1.25rem;
			box-sizing: border-box;
		}
		&.showcase-sword {
			/* Sword pommel boards — square tile, full blade in frame. */
			background: #0b0907;
			& img {
				object-fit: contain;
				object-position: center;
				padding: 0.55rem;
				box-sizing: border-box;
			}
		}
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
		& img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center bottom;
			background: transparent;
		}
		&.silhouette img {
			opacity: 0.62;
		}
		&.avatar-clan {
			background: transparent;
		}
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
		&[data-n='2'] {
			/* Two members split the square; a trio gives the first a full column. */
			grid-template-rows: 1fr;
		}
		&[data-n='3'] .roster-cell:first-child {
			grid-row: span 2;
		}
	}

	.roster-cell {
		display: grid;
		place-items: center;
		overflow: hidden;
		font-family: var(--serif);
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--fg-dim);
		& img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center top;
		}
		&.silhouette img {
			opacity: 0.62;
		}
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

	.card-people-sub .modern {
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 0.68rem;
		color: color-mix(in srgb, var(--k) 70%, var(--fg));
	}

	.card-ruler {
		font-style: normal;
		font-weight: 650;
		& .ruler-native {
			font-weight: 500;
			opacity: 0.75;
		}
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
		&::before {
			content: '';
			width: 0.55rem;
			height: 0.55rem;
			flex-shrink: 0;
			border-radius: 50%;
			background: var(--chip, var(--k));
			box-shadow: 0 0 0 1px color-mix(in srgb, var(--fg) 14%, transparent);
		}
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
		&[data-tier='S'] {
			--tag: #e8c873;
		}
		&[data-tier='demigod'] {
			--tag: color-mix(in srgb, var(--k) 55%, #c4a574);
		}
	}

	.card-retired {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		margin-top: 0.1rem;
		padding: 0.1rem 0.42rem;
		border-radius: var(--radius-pill);
		font-family: var(--ui);
		font-size: 0.58rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--fg-muted) 85%, var(--fg-strong));
		background: color-mix(in srgb, var(--fg) 7%, transparent);
		border: 1px solid color-mix(in srgb, var(--fg) 16%, transparent);
	}

	.card-domain {
		display: inline-grid;
		place-items: center;
		width: 1.15rem;
		height: 1.15rem;
		margin-right: 0.1rem;
		border-radius: 50%;
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
		color: #fffaf0;
		background: var(--domain);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, #fffaf0 40%, transparent);
		flex-shrink: 0;
		&[data-kind='text'] {
			width: auto;
			min-width: 1.35rem;
			padding: 0 0.28rem;
			font-size: 0.55rem;
			font-weight: 800;
			letter-spacing: 0.02em;
		}
		&[data-kind='icon'] .material-symbols-outlined {
			font-size: 0.85rem;
			font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
		}
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
		& .realm-ko {
			letter-spacing: 0;
			text-transform: none;
			opacity: 0.9;
			font-size: 0.85em;
		}
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
			&.dense {
				grid-template-columns: repeat(auto-fill, minmax(7.25rem, 1fr));
				gap: 0.45rem;
				&.thumbs-wide {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}
			}
		}
		.avatar {
			width: 5rem;
		}
		.card.card-character .avatar,
		.card.card-character .avatar.avatar-clan {
			width: 6.4rem;
			min-height: 9.6rem;
		}
		.grid.dense .card.card-dense.card-character .avatar,
		.grid.dense .card.card-dense.card-character .avatar.avatar-clan {
			width: 100%;
			min-height: 0;
		}
		.card {
			min-height: 9.6rem;
		}
		.grid.dense .card.card-dense {
			min-height: 0;
			padding: 0;
		}
		.card {
			padding: 1rem 1.1rem;
			&.card-character .meta {
				padding: 0.9rem 1rem 0.95rem 0.9rem;
			}
		}
		.grid.dense .card.card-dense .meta {
			padding: 2rem 0.45rem 0.4rem;
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
