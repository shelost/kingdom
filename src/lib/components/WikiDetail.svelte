<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import {
		byId,
		avatarOf,
		nameOf,
		titleOf,
		koreanOf,
		stageGalleryOf,
		isPlaceholderArt,
		KINGDOMS,
		ERA_TAG_META,
		colorOf,
		accentColorsOf,
		hangulInitial,
		hasHumanAge,
		photoOf,
		binyeoArtOf,
		swordArtOf,
		objectArtOf,
		posterArtOf,
		kingdomFlag,
		sortHwarangMembers,
		groupByHwarangClass,
		hwarangClassColor,
		type Person,
		type CareerOffice
	} from '$lib/people';
	import {
		kindOf,
		kindLabel,
		lifespanOf,
		formatYear,
		careerYearsOf,
		careerAgesOf,
		bondsFor,
		betweenPeople,
		appearanceCount,
		godTierLabel,
		orgsOf,
		membersOf,
		groupsOf,
		groupMembersOf,
		clanOf,
		clanEntriesOf,
		clanMembersOf,
		clanAffiliationOf,
		nationOf,
		realmPlaceOf,
		parentPlaceOf,
		placesInCity,
		citiesOfKingdom,
		showsWikiAccent,
		ownersOf,
		hasOwnerRoster,
		swordsOf,
		swordOfPerson,
		animalsOf,
		instrumentsOf,
		membersByKingdom,
		type MemberBand
	} from '$lib/wiki';
	import { buildChatPrompt, isChatPersona } from '$lib/chatPrompt';
	import { ensureStars, isStarred, starKey } from '$lib/imageStarsUi.svelte';
	import type { Attachment } from 'svelte/attachments';
	import WikiText from '$lib/components/WikiText.svelte';
	import WikiOrgCharts from './diagrams/WikiOrgCharts.svelte';
	import OrgChart from './diagrams/OrgChart.svelte';
	import { chartsForWikiEntry, hasDiagramChart } from './diagrams/wikiCharts';
	import { storyImg } from '$lib/img';
	import { scenesForWikiEntry, type WikiScene } from '$lib/wikiScenes';
	import { openLightbox } from '$lib/imageLightbox.svelte';

	let {
		entry,
		expanded = false,
		onBack,
		onOpen,
		onExpand,
		onCollapse,
		onScrollEl
	}: {
		entry: Person;
		expanded?: boolean;
		onBack: () => void;
		onOpen: (id: string) => void;
		onExpand?: () => void;
		onCollapse?: () => void;
		onScrollEl?: (el: HTMLElement | null) => void;
	} = $props();

	function bindScroll(node: HTMLElement) {
		onScrollEl?.(node);
		return () => onScrollEl?.(null);
	}

	let k = $derived({ ...KINGDOMS[entry.kingdom], color: colorOf(entry) });
	let accents = $derived(accentColorsOf(entry));
	let showAccent = $derived(showsWikiAccent(entry));
	/** Wiki portrait preview — null = base Person fields. */
	let previewLook = $state<string | null>(null);
	let stageRows = $derived(stageGalleryOf(entry));
	let hasStageGallery = $derived(stageRows.length > 1);
	let art = $derived(avatarOf(entry, undefined, null, previewLook));
	let photo = $derived(photoOf(entry));
	let binyeoArt = $derived(binyeoArtOf(entry));
	let swordArt = $derived(swordArtOf(entry));
	let objectArt = $derived(objectArtOf(entry));
	let posterArt = $derived(posterArtOf(entry));
	let flag = $derived(kingdomFlag(entry.kingdom));
	let who = $derived(nameOf(entry, null, previewLook));
	let role = $derived(titleOf(entry, null, previewLook));
	let ko = $derived(koreanOf(entry, null, previewLook));
	let isBond = $derived(entry.entity === 'relationship');
	let isPlace = $derived(entry.entity === 'place');
	let isPhrase = $derived(entry.entity === 'phrase');
	let isGod = $derived(entry.entity === 'god');
	let isOrg = $derived(entry.entity === 'organization');
	let isGroup = $derived(entry.entity === 'group');
	let isClan = $derived(entry.entity === 'clan');
	let isSword = $derived(entry.entity === 'sword');
	let isAnimal = $derived(entry.entity === 'animal');
	let isInstrument = $derived(entry.entity === 'instrument');
	/** Swords, animals and instruments list people in `owners` (wielders / rider / players). */
	let hasOwners = $derived(hasOwnerRoster(entry));
	let isNation = $derived(entry.entity === 'nation');
	let kind = $derived(kindOf(entry));
	let scenes = $derived(
		kind === 'character' ||
			kind === 'god' ||
			kind === 'animal' ||
			kind === 'instrument' ||
			kind === 'relationship'
			? scenesForWikiEntry(entry.id)
			: []
	);
	/** A relationship's cover still (its `still` slot), when that slot has art. */
	let bondStill = $derived(
		isBond && entry.still ? scenes.find((s) => s.id === entry.still && !s.nsfw)?.art : undefined
	);
	/** A bond's painted 2:1 board (`avatar`) leads; otherwise its cover still. */
	let bondBoard = $derived(isBond && entry.avatar ? art : null);
	let bondArt = $derived(bondBoard ?? bondStill);
	/** Nation detail hero uses the kingdom flag when present (not portrait art); bonds lead with their board or still. */
	let heroArt = $derived(isNation && flag ? flag : (bondArt ?? art));
	let isNationFlagHero = $derived(isNation && !!flag);
	/** Places, animals, and bonds / instruments with a cover still lead with a landscape still. */
	let isLandscapeHero = $derived(
		isPlace || isAnimal || (isInstrument && entry.avatar !== entry.objectImage) || !!bondArt
	);
	/** People / gods / clans — 2:3 bust beside identity, not a stacked landscape. */
	let isPortraitHero = $derived(!!heroArt && !isLandscapeHero && !isNationFlagHero);
	/** SFW stills tagged with this person. NSFW stays on /images + the modal, not the grid. */
	let galleryScenes = $derived.by(() => {
		const rest = scenes.filter((s) => !s.nsfw);
		const isPoster = (s: WikiScene) =>
			s.id.startsWith('poster_') ||
			s.id === 'yushin-sword-vertical' ||
			s.id === 'chunchu-strategist';
		const starred = (s: WikiScene) => isStarred(starKey(s.art, s.id));
		const posters = rest.filter(isPoster);
		const others = rest.filter((s) => !isPoster(s));
		const ordered = [...posters, ...others.filter(starred), ...others.filter((s) => !starred(s))];
		if (!posterArt) return ordered;
		const posterPath = posterArt.split('?')[0] ?? posterArt;
		if (ordered.some((s) => (s.art.split('?')[0] ?? s.art) === posterPath)) return ordered;
		return [
			{
				id: `poster_${entry.id}`,
				title: who,
				alt: `${who} — profile poster`,
				art: posterArt,
				episodeId: '',
				nsfw: false
			} satisfies WikiScene,
			...ordered
		];
	});

	function openWikiGallery(list: WikiScene[], index: number, from?: EventTarget | null) {
		openLightbox(
			list.map((s) => ({
				src: s.art,
				alt: s.alt,
				title: s.title,
				caption: s.caption,
				nsfw: s.nsfw,
				episodeId: s.episodeId
			})),
			index,
			from
		);
	}
	let isCity = $derived(kind === 'city');
	let parentPlace = $derived(kind === 'place' ? parentPlaceOf(entry) : undefined);
	let nation = $derived(nationOf(entry.kingdom));
	let realmPlace = $derived(realmPlaceOf(entry));
	/** Skip empty Territory/Kingdom rows for unrooted cosmological places. */
	let showPolityRow = $derived(
		isBond ||
			isNation ||
			isCity ||
			!!parentPlace ||
			!!nation ||
			(!isPlace && !!realmPlace && realmPlace.id !== entry.id) ||
			(!isPlace && entry.kingdom === 'underworld' && !entry.realm) ||
			(!isPlace && entry.kingdom !== 'other' && entry.kingdom !== 'underworld')
	);
	let polityLabel = $derived(
		isPlace
			? isCity
				? 'Kingdom'
				: 'Territory'
			: isBond
				? 'Kingdoms'
				: realmPlace && !nation
					? 'Place'
					: 'Kingdom'
	);
	let childPlaces = $derived(
		isCity || entry.placeKind === 'realm' ? placesInCity(entry.id) : []
	);
	let kingdomCities = $derived(isNation ? citiesOfKingdom(entry.kingdom) : []);
	let relatedBonds = $derived(isBond ? [] : bondsFor(entry.id));
	let partners = $derived(isBond ? betweenPeople(entry) : []);
	let bondA = $derived(accents[0] ?? k.color);
	let bondB = $derived(accents[1] ?? accents[0] ?? k.color);
	let memberships = $derived(isOrg || isGroup || isClan || isBond || hasOwners ? [] : orgsOf(entry));
	let groupMemberships = $derived(
		isOrg || isGroup || isClan || isBond || hasOwners ? [] : groupsOf(entry)
	);
	let orgMembers = $derived(
		isOrg
			? membersOf(entry.id)
			: isGroup
				? groupMembersOf(entry.id)
				: isClan
					? clanMembersOf(entry.id)
					: hasOwners
						? ownersOf(entry.id)
						: []
	);
	let orgRosterTitle = $derived(
		entry.ownersLabel ?? (isSword ? 'Owners' : 'Members')
	);
	let linkedSword = $derived(!isSword && entry.blade ? swordOfPerson(entry.id) : undefined);
	let personSwords = $derived(!isSword && entry.blade ? swordsOf(entry.id) : []);
	/** Animals and instruments a character owns — one pill row each. */
	let personOwned = $derived(
		kind === 'character' || kind === 'god'
			? [
					{ label: 'Animals', items: animalsOf(entry.id) },
					{ label: 'Instruments', items: instrumentsOf(entry.id) }
				].filter((row) => row.items.length)
			: []
	);
	let isHwarang = $derived(entry.id === 'hwarang');
	let orgRoster = $derived(isHwarang ? sortHwarangMembers(orgMembers) : orgMembers);
	let memberBands = $derived<MemberBand[]>(
		isHwarang
			? groupByHwarangClass(orgMembers)
			: entry.rosterBy === 'kingdom'
				? membersByKingdom(orgMembers)
				: []
	);
	let clanLabel = $derived(isOrg || isGroup || isClan || isBond || isPlace || hasOwners ? undefined : clanOf(entry));
	let clanEntries = $derived(
		isOrg || isGroup || isClan || isBond || isPlace || hasOwners ? [] : clanEntriesOf(entry)
	);
	let chartNodes = $derived(isOrg || isGroup ? (entry.orgChart ?? []) : []);
	let life = $derived(lifespanOf(entry));
	let apps = $derived(appearanceCount(entry.id));
	let eraTags = $derived(entry.tags ?? []);
	let charts = $derived(chartsForWikiEntry(entry.id));
	let showFlatOrgChart = $derived(
		(isOrg || isGroup) && (entry.orgChart ?? []).length > 0 && !hasDiagramChart(entry.id)
	);
	let orgSectionTitle = $derived(
		entry.id === 'four_divisions' ? 'Cosmology' : charts.length ? 'Organization chart' : 'Institutions'
	);
	let canChat = $derived(isChatPersona(entry));
	let chatPrompt = $derived(canChat ? buildChatPrompt(entry) : '');
	let copiedForId = $state<string | null>(null);
	let promptCopied = $derived(copiedForId === entry.id);

	/** The gallery stops at this height (rem) until See all. */
	const GALLERY_MAX = 26;
	let galleryOpen = $state(false);
	/** Whether the stills run past `GALLERY_MAX`, so See all has anything to show. */
	let galleryTall = $state(false);

	const measureGallery: Attachment<HTMLElement> = (list) => {
		const ro = new ResizeObserver(() => {
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
			galleryTall = list.scrollHeight > GALLERY_MAX * rem + 1;
		});
		ro.observe(list);
		for (const child of list.children) ro.observe(child);
		return () => ro.disconnect();
	};

	$effect(() => {
		void ensureStars();
	});

	// A new entry starts on its base look with the gallery folded.
	$effect(() => {
		void entry.id;
		previewLook = null;
		galleryOpen = false;
	});

	async function copyChatPrompt() {
		if (!chatPrompt || !browser) return;
		try {
			await navigator.clipboard.writeText(chatPrompt);
			copiedForId = entry.id;
			setTimeout(() => {
				if (copiedForId === entry.id) copiedForId = null;
			}, 1600);
		} catch {
			/* ignore */
		}
	}

	function careerOrgId(office: CareerOffice): string | undefined {
		return office.org && byId.has(office.org) ? office.org : undefined;
	}</script>

<article
	class="detail"
	class:expanded
	style:--k={isBond ? bondA : k.color}
	style:--k2={isBond ? bondB : (entry.colorSecondary ?? k.color)}
	aria-label="{who} wiki entry"
>
	<header class="detail-bar">
		<button type="button" class="icon-btn" onclick={onBack} aria-label="Close">✕</button>
		{#if entry.main}<span class="badge lead">Lead</span>{/if}
		<span class="badge">{kindLabel(entry)}</span>
		{#if apps > 0}
			<span class="apps" title="Appearances in the chronicle">{apps}</span>
		{/if}
		<div class="bar-actions">
			{#if expanded}
				<button type="button" class="text-btn" onclick={() => onCollapse?.()}>
					<span class="material-symbols-outlined" aria-hidden="true">close_fullscreen</span>
					Peek
				</button>
			{:else}
				<button type="button" class="text-btn expand" onclick={() => onExpand?.()}>
					<span class="material-symbols-outlined" aria-hidden="true">open_in_full</span>
					Expand
				</button>
			{/if}
			<a class="text-btn" href={resolve('/read')} title="Back to the chronicle">Chronicle</a>
		</div>
	</header>

	<div class="detail-scroll" {@attach bindScroll}>
		{#key entry.id}
		<div class="body" class:split={expanded}>
		<div class="info">
		{#if photo}
			<figure class="photo">
				<img {...storyImg(photo, { kind: 'hero', priority: true, alt: who, sizes: '40rem' })} />
				{#if entry.photoCredit}<figcaption>{entry.photoCredit}</figcaption>{/if}
			</figure>
		{/if}

		{#if heroArt && !isPortraitHero}
			<figure
				class="hero-art"
				class:stand-in={!isNationFlagHero && isPlaceholderArt(art)}
				class:place={isLandscapeHero}
				class:bond={!!bondBoard}
				class:nation={isNationFlagHero}
				aria-hidden="true"
			>
				<img
					{...storyImg(heroArt, {
						kind: isNationFlagHero ? 'place' : 'hero',
						priority: true,
						alt: '',
						sizes: isNationFlagHero ? '100vw' : '(max-width: 820px) 100vw, 40rem'
					})}
				/>
			</figure>
		{/if}

		<div class="expo">
			{#snippet identity()}
				<div class="hero-id" class:text-only={!heroArt && !photo}>
					{#if !heroArt && !photo}
						<span class="initial" aria-hidden="true">{hangulInitial(entry)}</span>
					{/if}
					{#if isGod}<span class="badge god-badge">God</span>{/if}
					{#if entry.godTier}
						{@const tier = godTierLabel(entry.godTier)}
						<span class="badge tier-badge" data-tier={entry.godTier} title={tier.hint}>{tier.en}</span>
					{/if}
					{#if entry.realm}
						{#if realmPlace && realmPlace.id !== entry.id}
							<button
								type="button"
								class="realm-chip"
								title="Open {realmPlace.name}"
								onclick={() => onOpen(realmPlace.id)}
							>
								{entry.realm.en}<span class="realm-ko">{entry.realm.ko}</span>
							</button>
						{:else}
							<span class="realm-chip" title="Realm / domain">{entry.realm.en}<span class="realm-ko">{entry.realm.ko}</span></span>
						{/if}
					{/if}
					<h1 class="name">{who}</h1>
					<p class="native">
						{#if entry.hanja}<span class="hanja">{entry.hanja}</span>{/if}
						{#if ko}
							<span class="ko" class:modern-gloss={isClan} title={isClan ? 'Modern bon-gwan / surname' : undefined}
								>{ko}</span
							>
						{/if}
					</p>
					{#if entry.summary}
						<p class="short-desc">
							{entry.summary.en}<span class="short-desc-ko">{entry.summary.ko}</span>
						</p>
					{/if}
					{#if entry.quote}
						<figure class="quote">
							<blockquote>{entry.quote}</blockquote>
						</figure>
					{/if}
				</div>
			{/snippet}

			{#if isPortraitHero && heroArt}
				<div class="hero portrait">
					{@render identity()}
					<figure
						class="hero-art"
						class:stand-in={isPlaceholderArt(art)}
						aria-hidden="true"
					>
						<img
							{...storyImg(heroArt, {
								kind: 'portrait',
								priority: true,
								alt: '',
								sizes: '(max-width: 820px) 8.25rem, 16rem'
							})}
						/>
					</figure>
				</div>
			{:else}
				{@render identity()}
			{/if}

		{#if hasStageGallery}
			<section class="stage-gallery" aria-label="Character looks">
				<h2 class="stage-heading">Looks</h2>
				<div class="stage-chips">
					{#each stageRows as row, i (row.id ?? `base-${i}`)}
						<button
							type="button"
							class="stage-chip"
							class:active={previewLook === row.id}
							onclick={() => (previewLook = row.id)}
							title={row.label}
						>
							{#if row.art && !isPlaceholderArt(row.art)}
								<img {...storyImg(row.art, { kind: 'thumb', alt: '', sizes: '3.4rem' })} />
							{:else}
								<span class="stage-initial" aria-hidden="true">{hangulInitial(entry)}</span>
							{/if}
							<span class="stage-label">{row.label}</span>
						</button>
					{/each}
				</div>
			</section>
		{/if}

		{#if isPhrase}
			<p class="phrase-mark">Household idiom · say it the way others say Trojan horse</p>
		{/if}
		{#if isSword}
			<p class="phrase-mark">Ring-pommel blade · owner linked below</p>
		{/if}
		{#if entry.tagline}
			<p class="tagline"><WikiText text={entry.tagline} selfId={entry.id} {onOpen} /></p>
		{/if}

		<dl class="props">
			{#if role}
				<div>
					<dt>{isBond ? 'Bond' : isPlace ? 'Type' : 'Title'}</dt>
					<dd>{role}</dd>
				</div>
			{/if}
			{#if isBond && entry.dynamic}
				<div>
					<dt>Dynamic</dt>
					<dd>{entry.dynamic.en}<span class="realm-ko"> · {entry.dynamic.ko}</span></dd>
				</div>
			{/if}
			{#if entry.godTier}
				{@const tier = godTierLabel(entry.godTier)}
				<div>
					<dt>Class</dt>
					<dd>
						<span class="pill tier-pill" data-tier={entry.godTier} title={tier.hint}
							>{tier.en}<span class="realm-ko"> · {tier.short}</span></span
						>
					</dd>
				</div>
			{/if}
			{#if entry.realm}
				<div>
					<dt>Realm</dt>
					<dd>
						{#if realmPlace && realmPlace.id !== entry.id}
							<button
								type="button"
								class="pill realm-pill link-pill"
								onclick={() => onOpen(realmPlace.id)}
							>
								{entry.realm.en}<span class="realm-ko"> · {entry.realm.ko}</span>
							</button>
						{:else}
							<span class="pill realm-pill">{entry.realm.en}<span class="realm-ko"> · {entry.realm.ko}</span></span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if partners.length}
				<div>
					<dt>Between</dt>
					<dd class="links bond-pair">
						{#each partners as other, i (other.id)}
							{#if i > 0}<span class="sep">·</span>{/if}
							<button type="button" class="linkish partner" onclick={() => onOpen(other.id)}>
								<span class="swatch" style:--sw={colorOf(other)} aria-hidden="true"></span>
								{nameOf(other)}
							</button>
						{/each}
					</dd>
				</div>
			{/if}
			{#if parentPlace}
				{@const parent = parentPlace}
				<div>
					<dt>{parent.placeKind === 'realm' ? 'Realm' : 'City'}</dt>
					<dd class="links">
						<button type="button" class="linkish" onclick={() => onOpen(parent.id)}
							>{nameOf(parent)}</button
						>
					</dd>
				</div>
			{/if}
			{#if showPolityRow}
				<div>
					<dt>{polityLabel}</dt>
					<dd>
						{#if isBond && partners.length}
							<span class="pill-row">
								{#each partners as other (other.id)}
									{@const pk = { ...KINGDOMS[other.kingdom], color: colorOf(other) }}
									{@const pn = nationOf(other.kingdom)}
									{@const rp = realmPlaceOf(other)}
									{#if pn}
										<button
											type="button"
											class="pill link-pill"
											style:--pill={pk.color}
											onclick={() => onOpen(pn.id)}
										>
											{#if kingdomFlag(other.kingdom)}<img class="pill-flag" src={kingdomFlag(other.kingdom)} alt="" />{/if}
											{pk.label}
										</button>
									{:else if rp}
										<button
											type="button"
											class="pill link-pill"
											style:--pill={pk.color}
											onclick={() => onOpen(rp.id)}
										>
											{pk.label}
										</button>
									{:else}
										<span class="pill" style:--pill={pk.color}>
											{#if kingdomFlag(other.kingdom)}<img class="pill-flag" src={kingdomFlag(other.kingdom)} alt="" />{/if}
											{pk.label}
										</span>
									{/if}
								{/each}
							</span>
						{:else if nation && !isNation}
							<button type="button" class="pill link-pill" onclick={() => onOpen(nation.id)}>
								{#if flag}<img class="pill-flag" src={flag} alt="" />{/if}
								{k.label}
							</button>
						{:else if realmPlace && realmPlace.id !== entry.id}
							<button type="button" class="pill link-pill" onclick={() => onOpen(realmPlace.id)}>
								{k.label === '—' ? nameOf(realmPlace) : k.label}
							</button>
						{:else}
							<span class="pill">
								{#if flag}<img class="pill-flag" src={flag} alt="" />{/if}
								{k.label}
							</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if entry.entity === 'nation' && k.icons}
				<div><dt>Signs</dt><dd class="icons">{k.icons}</dd></div>
			{/if}
			{#if entry.blade || swordArt || (isSword && entry.tagline)}
				<div class={{ 'prop-art': swordArt }}>
					<dt>Blade</dt>
					<dd class={{ 'prop-art-row': swordArt }}>
						{#if swordArt}
							<img class="prop-art-fig" {...storyImg(swordArt, { kind: 'hero', alt: '', sizes: '36rem' })} />
						{/if}
						{#if isSword && entry.tagline}
							<span class="prop-art-cap">{entry.tagline}</span>
						{:else if entry.blade}
							{#if linkedSword}
								<button type="button" class="prop-art-link" onclick={() => onOpen(linkedSword.id)}>
									<span class="prop-art-cap">{entry.blade}</span>
								</button>
							{:else}
								<span class="prop-art-cap">{entry.blade}</span>
							{/if}
						{/if}
					</dd>
				</div>
			{/if}
			{#if personSwords.length > 1}
				<div>
					<dt>Swords</dt>
					<dd class="pill-row">
						{#each personSwords as sword (sword.id)}
							<button type="button" class="pill link-pill" onclick={() => onOpen(sword.id)}>
								{nameOf(sword)}
							</button>
						{/each}
					</dd>
				</div>
			{/if}
			{#each personOwned as row (row.label)}
				<div>
					<dt>{row.label}</dt>
					<dd class="pill-row">
						{#each row.items as owned (owned.id)}
							<button
								type="button"
								class="pill link-pill"
								style:--pill={colorOf(owned)}
								onclick={() => onOpen(owned.id)}
							>
								{nameOf(owned)}{#if owned.korean}<span class="realm-ko"> · {owned.korean}</span>{/if}
							</button>
						{/each}
					</dd>
				</div>
			{/each}
			{#if entry.binyeo}
				<div class="prop-art">
					<dt>Binyeo</dt>
					<dd class="prop-art-row">
						{#if binyeoArt}
							<img class="prop-art-fig" {...storyImg(binyeoArt, { kind: 'hero', alt: '', sizes: '36rem' })} />
						{/if}
						<span class="prop-art-cap">{entry.binyeo}</span>
					</dd>
				</div>
			{/if}
			{#if entry.object || objectArt}
				<div class={{ 'prop-art': objectArt }}>
					<dt>{isAnimal ? 'Coat' : isInstrument ? 'Build' : 'Object'}</dt>
					<dd class={{ 'prop-art-row': objectArt }}>
						{#if objectArt}
							<img class="prop-art-fig" {...storyImg(objectArt, { kind: 'hero', alt: '', sizes: '36rem' })} />
						{/if}
						{#if entry.object}
							<span class="prop-art-cap">{entry.object}</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if life}
				<div>
					<dt>{hasHumanAge(entry) ? 'Lived' : 'Active'}</dt>
					<dd>{life}</dd>
				</div>
			{/if}
			{#if kind === 'character' && entry.born != null && entry.died != null}
				<div><dt>Age at death</dt><dd>{entry.died - entry.born}</dd></div>
			{/if}
			{#if entry.ideology}
				<div>
					<dt>Ideology</dt>
					<dd>{entry.ideology}</dd>
				</div>
			{/if}
			{#if clanLabel}
				<div>
					<dt>Clan</dt>
					<dd class="links">
						{#if clanEntries.length}
							{#each clanEntries as c, i (c.id)}
								{#if i > 0}<span class="sep">·</span>{/if}
								<button type="button" class="linkish" onclick={() => onOpen(c.id)}
									>{nameOf(c)}{#if c.korean}
										<span class="clan-ko"> ({c.korean})</span>{/if}</button
								>
							{/each}
						{:else}
							{clanLabel}
						{/if}
					</dd>
				</div>
			{/if}
			{#if memberships.length}
				<div>
					<dt>Organizations</dt>
					<dd class="links">
						{#each memberships as org, i (org.id)}
							{#if i > 0}<span class="sep">·</span>{/if}
							<button type="button" class="linkish" onclick={() => onOpen(org.id)}
								>{nameOf(org)}</button
							>
						{/each}
					</dd>
				</div>
			{/if}
			{#if entry.hwarangClass}
				{@const hwColor = hwarangClassColor(entry)}
				<div>
					<dt>Hwarang class</dt>
					<dd>
						<span
							class="member-clan-aff"
							style:--hw={hwColor}
							title="Hwarang {entry.hwarangClass.label}"
							>{entry.hwarangClass.label}</span
						>{#if entry.hwarangClass.korean}<span class="clan-ko">
								({entry.hwarangClass.korean})</span
							>{/if}
					</dd>
				</div>
			{/if}
			{#if groupMemberships.length}
				<div>
					<dt>Groups</dt>
					<dd class="links">
						{#each groupMemberships as g, i (g.id)}
							{#if i > 0}<span class="sep">·</span>{/if}
							<button type="button" class="linkish" onclick={() => onOpen(g.id)}
								>{nameOf(g)}{#if g.korean}
									<span class="clan-ko"> ({g.korean})</span>{/if}</button
							>
						{/each}
					</dd>
				</div>
			{/if}
			{#if showAccent && accents.length}
				<div>
					<dt>{isBond ? 'Colours' : 'Accent'}</dt>
					<dd class="accent-row">
						{#each accents as hex (hex)}
							<code class="hex-chip" style:--chip={hex}>{hex}</code>
						{/each}
					</dd>
				</div>
			{/if}
			{#if entry.firstLine}
				<div>
					<dt>First line</dt>
					<dd class="spoken">
						<span class="spoken-en">“{entry.firstLine.en}”</span>
						{#if entry.firstLine.ko}
							<span class="spoken-ko">{entry.firstLine.ko}</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if entry.lastLine}
				<div>
					<dt>Last line</dt>
					<dd class="spoken">
						<span class="spoken-en">“{entry.lastLine.en}”</span>
						{#if entry.lastLine.ko}
							<span class="spoken-ko">{entry.lastLine.ko}</span>
						{/if}
					</dd>
				</div>
			{/if}
		</dl>

		{#if eraTags.length}
			<ul class="era-tags" aria-label="Era tags">
				{#each eraTags as t (t)}
					<li title={ERA_TAG_META[t]?.hint ?? t}>{ERA_TAG_META[t]?.label ?? t}</li>
				{/each}
			</ul>
		{/if}

		{#if galleryScenes.length}
			<section class="gallery" aria-label="Gallery">
				<ul
					class="gallery-masonry"
					class:clamped={!galleryOpen}
					style:--gallery-max="{GALLERY_MAX}rem"
					{@attach measureGallery}
				>
					{#each galleryScenes as scene, i (scene.id)}
						<li>
							<button
								type="button"
								class="gallery-shot"
								onclick={(e) => openWikiGallery(galleryScenes, i, e.currentTarget)}
								aria-label={scene.alt || scene.title}
							>
								<img
									{...storyImg(scene.art, {
										kind: 'cue',
										alt: '',
										sizes: '(min-width: 56rem) 28vw, (min-width: 40rem) 11rem, 45vw',
										widths: [384, 640, 828]
									})}
								/>
							</button>
						</li>
					{/each}
				</ul>
				{#if galleryTall}
					<button
						type="button"
						class="gallery-more"
						aria-expanded={galleryOpen}
						onclick={() => (galleryOpen = !galleryOpen)}
					>
						{galleryOpen ? 'Show less' : `See all ${galleryScenes.length}`}
						<span class="material-symbols-outlined" aria-hidden="true"
							>{galleryOpen ? 'expand_less' : 'expand_more'}</span
						>
					</button>
				{/if}
			</section>
		{/if}
		</div><!-- expo -->
		</div><!-- info -->

		<div class="text expo">
		{#if entry.career?.length}
			<section class="cv">
				<h2>CV <span class="h2-ko">이력</span></h2>
				{#snippet officeTitle(office: CareerOffice)}
					{#if office.korean}<span class="cv-ko">{office.korean}</span>{/if}
					{#if office.hanja}<span class="cv-hanja">{office.hanja}</span>{/if}
					{#if office.korean || office.hanja}<span class="cv-dot">·</span>{/if}
					<span class="cv-en">{office.title}</span>
				{/snippet}
				<ol class="cv-list">
					{#each entry.career as office, i (`${office.title}-${office.from ?? 'x'}-${office.to ?? 'x'}-${i}`)}
						{@const years = careerYearsOf(office, entry.died)}
						{@const ages = hasHumanAge(entry)
							? careerAgesOf(office, entry.born, entry.died)
							: null}
						{@const orgId = careerOrgId(office)}
						<li>
							<span class="cv-office">
								{#if orgId}
									<button
										type="button"
										class="linkish cv-post"
										onclick={() => {
											if (orgId) onOpen(orgId);
										}}
									>
										{@render officeTitle(office)}
									</button>
								{:else}
									<span class="cv-post">
										{@render officeTitle(office)}
									</span>
								{/if}
								{#if office.note}<span class="cv-note">{office.note}</span>{/if}
							</span>
							<span class="cv-when">
								<span class="cv-years">{years}</span>
								{#if ages}
									<span class="cv-dot">·</span>
									<span class="cv-age">{ages}</span>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		{#if showFlatOrgChart}
			<section class="org-charts">
				<h2>Organization chart</h2>
				{#key entry.id}
					<OrgChart nodes={chartNodes} {onOpen} />
				{/key}
			</section>
		{/if}

		{#if orgRoster.length}
			<section>
				<h2>{orgRosterTitle}</h2>
				{#snippet memberCard(m: Person)}
					{@const portrait = avatarOf(m)}
					{@const clanAff = isClan ? clanAffiliationOf(m, entry.id) : null}
					<li>
						<button
							type="button"
							class="member-card"
							class:place-card={m.entity === 'place'}
							style:--mk={colorOf(m)}
							onclick={() => onOpen(m.id)}
						>
							<span
								class="member-avatar"
								class:place-thumb={m.entity === 'place'}
								class:silhouette={isPlaceholderArt(portrait)}
								aria-hidden="true"
							>
								{#if portrait}
									<img {...storyImg(portrait, { kind: 'thumb', alt: '', sizes: '7.25rem' })} />
								{:else}
									{hangulInitial(m)}
								{/if}
							</span>
							<span class="member-meta">
								<span class="member-name">{nameOf(m)}</span>
								{#if clanAff === 'marriage'}
									<span class="member-clan-aff" title="Joined this clan by marriage">Marriage</span>
								{/if}
								{#if isHwarang && m.hwarangClass}
									<span
										class="member-clan-aff"
										style:--hw={hwarangClassColor(m)}
										title="Hwarang {m.hwarangClass.label}"
										>{m.hwarangClass.label}</span
									>
								{/if}
								{#if titleOf(m)}
									<span class="member-title">{titleOf(m)}</span>
								{:else}
									<span class="member-title">{kindLabel(m)}</span>
								{/if}
							</span>
						</button>
					</li>
				{/snippet}
				{#if memberBands.length}
					<div class="class-bands">
						{#each memberBands as g (g.id)}
							<section class="class-band">
								<h3 class="class-band-head">
									<span
										class="member-clan-aff"
										style:--hw={g.color}
										title={isHwarang ? `Hwarang ${g.label}` : g.label}>{g.label}</span
									>
									{#if g.korean}<span class="clan-ko"> ({g.korean})</span>{/if}
								</h3>
								<ul class="member-grid">
									{#each g.members as m (m.id)}
										{@render memberCard(m)}
									{/each}
								</ul>
							</section>
						{/each}
					</div>
				{:else}
					<ul class="member-grid">
						{#each orgRoster as m (m.id)}
							{@render memberCard(m)}
						{/each}
					</ul>
				{/if}
			</section>
		{/if}

		{#if kingdomCities.length}
			<section>
				<h2>Cities</h2>
				<ul class="member-grid">
					{#each kingdomCities as city (city.id)}
						{@const cityArt = avatarOf(city)}
						<li>
							<button
								type="button"
								class="member-card place-card"
								style:--mk={colorOf(city)}
								onclick={() => onOpen(city.id)}
							>
								<span
									class="member-avatar place-thumb"
									class:silhouette={isPlaceholderArt(cityArt)}
									aria-hidden="true"
								>
									{#if cityArt}
										<img {...storyImg(cityArt, { kind: 'place', alt: '', sizes: '7.25rem', widths: [128, 256] })} />
									{:else}
										{hangulInitial(city)}
									{/if}
								</span>
								<span class="member-meta">
									<span class="member-name">{nameOf(city)}</span>
									{#if titleOf(city)}
										<span class="member-title">{titleOf(city)}</span>
									{:else}
										<span class="member-title">{kindLabel(city)}</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if childPlaces.length}
			<section>
				<h2>Places</h2>
				<ul class="member-grid">
					{#each childPlaces as place (place.id)}
						{@const placeArt = avatarOf(place)}
						<li>
							<button
								type="button"
								class="member-card place-card"
								style:--mk={colorOf(place)}
								onclick={() => onOpen(place.id)}
							>
								<span
									class="member-avatar place-thumb"
									class:silhouette={isPlaceholderArt(placeArt)}
									aria-hidden="true"
								>
									{#if placeArt}
										<img {...storyImg(placeArt, { kind: 'place', alt: '', sizes: '7.25rem', widths: [128, 256] })} />
									{:else}
										{hangulInitial(place)}
									{/if}
								</span>
								<span class="member-meta">
									<span class="member-name">{nameOf(place)}</span>
									{#if titleOf(place)}
										<span class="member-title">{titleOf(place)}</span>
									{:else}
										<span class="member-title">{kindLabel(place)}</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if charts.length}
			<section class="org-charts">
				<h2>{orgSectionTitle}</h2>
				<WikiOrgCharts entryId={entry.id} />
			</section>
		{/if}

		{#if entry.sobriquets?.length}
			<section>
				<h2>Sobriquets</h2>
				<ul class="aliases sobriquets">
					{#each entry.sobriquets as s (s)}
						<li>{s}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if entry.ideologyNote}
			<section>
				<h2>Political affiliation</h2>
				<p class="prose">
					{#if entry.ideology}<span class="ideo-label">{entry.ideology}. </span>{/if}<WikiText
						text={entry.ideologyNote}
						selfId={entry.id}
						{onOpen}
					/>
				</p>
			</section>
		{/if}

		{#if entry.nature}
			<section>
				<h2>Nature</h2>
				<p class="prose"><WikiText text={entry.nature} selfId={entry.id} {onOpen} /></p>
			</section>
		{/if}

		{#if entry.personality?.length}
			<section>
				<h2>Personality</h2>
				<ul class="trait-chips">
					{#each entry.personality as trait (trait)}
						<li>{trait}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if entry.voice}
			<section>
				<h2>Voice</h2>
				<p class="prose">{entry.voice}</p>
			</section>
		{/if}

		{#if canChat && chatPrompt}
			<section class="chat-prompt">
				<details>
					<summary>
						<span class="chat-summary-label">Chat as {who}</span>
						<span class="chat-summary-hint">LLM prompt</span>
					</summary>
					<div class="chat-body">
						<p class="chat-help">
							Copy this system prompt into any chat model to roleplay as {who}. Paste it as the
							system / developer message, then talk in character.
						</p>
						<pre class="chat-pre">{chatPrompt}</pre>
						<div class="chat-actions">
							<button type="button" class="text-btn" onclick={copyChatPrompt}>
								{promptCopied ? 'Copied' : 'Copy prompt'}
							</button>
						</div>
					</div>
				</details>
			</section>
		{/if}

		{#if entry.arc}
			<section>
				<h2>
					{isBond
						? 'Story of the bond'
						: isPlace
							? 'About this place'
							: isOrg
								? 'About this organization'
								: isGroup
									? 'About this group'
									: isClan
										? 'About this clan'
										: isInstrument
											? 'About this instrument'
											: isGod
												? 'Myth'
												: 'Character arc'}
				</h2>
				<p class="prose"><WikiText text={entry.arc} selfId={entry.id} {onOpen} /></p>
			</section>
		{/if}

		{#if entry.events?.length}
			<section>
				<h2>Key events</h2>
				<ol class="timeline">
					{#each entry.events as ev, i (i)}
						<li>
							<span class="tl-year">{formatYear(ev.year)}</span>
							<span class="tl-dot" aria-hidden="true"></span>
							<span class="tl-text">
								<WikiText text={ev.label} selfId={entry.id} {onOpen} />
								{#if entry.born != null && ev.year != null && ev.year >= entry.born}
									<span class="tl-age">age {ev.year - entry.born}</span>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			</section>
		{/if}

		{#if entry.aliases.length}
			<section>
				<h2>Also known as</h2>
				<ul class="aliases">
					{#each entry.aliases as a (a)}
						<li>{a}</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if relatedBonds.length}
			<section>
				<h2>Relationships</h2>
				<ul class="related">
					{#each relatedBonds as bond (bond.id)}
						{@const others = (bond.between ?? [])
							.filter((id) => id !== entry.id)
							.map((id) => byId.get(id))
							.filter((x): x is Person => !!x)}
						<li>
							<button type="button" class="rel-card" onclick={() => onOpen(bond.id)}>
								<span class="rel-name">{nameOf(bond)}</span>
								<span class="rel-meta">
									{bond.summary?.en ?? kindLabel(bond)}
									{#if others.length}
										· with {others.map((o) => nameOf(o)).join(', ')}
									{/if}
								</span>
								<span class="rel-line">{bond.tagline}</span>
							</button>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
		</div><!-- text -->
		</div><!-- body -->
		{/key}
	</div>
</article>

<style>
	.detail {
		--card-radius: 8px;
		--plate: color-mix(in srgb, var(--panel) 96%, var(--fg) 4%);
		/* Tinted chip: light wash of the entry colour, text in that colour. */
		--chip-fg: color-mix(in srgb, var(--k) 72%, var(--fg-strong));
		--chip-bg: color-mix(in srgb, var(--k) 13%, transparent);
		--chip-line: color-mix(in srgb, var(--k) 24%, transparent);
		/* Expanded: the chronicle's centred measure; peek: the panel's own width. */
		--column-pad: 1.9rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		background: var(--panel);
	}

	.detail.expanded {
		--column-pad: max(1.5rem, calc((100% - var(--script-measure)) / 2));
		background: var(--bg);
	}

	.detail-bar {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.55rem;
		padding: 0.8rem 1.1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 7%, transparent);
		background: transparent;
	}

	.detail.expanded .detail-bar {
		padding-inline: var(--column-pad);
	}

	.icon-btn {
		width: 2.4rem;
		height: 2.4rem;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		font-size: 0.85rem;
		color: var(--fg-dim);
		background: transparent;
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
		border-radius: 50%;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.icon-btn:hover {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		color: var(--fg-strong);
	}

	.badge {
		display: inline-block;
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
		border: 1px solid rgba(216, 178, 106, 0.4);
		border-radius: var(--radius-pill);
		padding: 0.15rem 0.55rem;
	}

	.badge.lead {
		color: var(--fg-strong);
		border-color: color-mix(in srgb, var(--k) 50%, transparent);
	}

	.badge.god-badge {
		margin-bottom: 0.45rem;
		color: var(--chip-fg);
		background: var(--chip-bg);
		border-color: var(--chip-line);
	}

	.badge.tier-badge {
		--tag: var(--gold);
		margin-bottom: 0.45rem;
		color: color-mix(in srgb, var(--tag) 80%, var(--fg-strong));
		background: color-mix(in srgb, var(--tag) 14%, transparent);
		border-color: color-mix(in srgb, var(--tag) 26%, transparent);
		letter-spacing: 0.1em;
	}

	.badge.tier-badge[data-tier='S'] {
		--tag: #e8c873;
	}

	.badge.tier-badge[data-tier='demigod'] {
		--tag: color-mix(in srgb, var(--k) 55%, #c4a574);
	}

	.pill.tier-pill {
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
		color: var(--gold);
	}

	.realm-chip {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4rem;
		margin: 0 0 0.55rem;
		padding: 0.22rem 0.65rem;
		border-radius: var(--radius-pill);
		font: inherit;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--chip-fg);
		background: var(--chip-bg);
		border: 1px solid var(--chip-line);
	}

	button.realm-chip {
		cursor: pointer;
	}

	button.realm-chip:hover {
		border-color: color-mix(in srgb, var(--k) 50%, transparent);
	}

	.realm-chip .realm-ko,
	.realm-pill .realm-ko {
		letter-spacing: 0.02em;
		text-transform: none;
		opacity: 0.88;
		font-size: 0.78em;
	}

	.pill.realm-pill {
		background: var(--chip-bg);
		border-color: var(--chip-line);
		color: var(--chip-fg);
	}

	.apps {
		font-size: 0.68rem;
		color: var(--fg-faint);
		letter-spacing: 0.04em;
	}

	.bar-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.text-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--fg-dim);
		background: none;
		border: none;
		border-radius: var(--radius);
		padding: 0.4rem 0.55rem;
		cursor: pointer;
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.text-btn .material-symbols-outlined {
		font-size: 1rem;
	}

	.text-btn:hover,
	.text-btn.expand:hover {
		color: var(--gold);
		background: rgba(216, 178, 106, 0.08);
	}

	.detail-scroll {
		flex: 1;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		padding: 0 0 4rem;
		-webkit-overflow-scrolling: touch;
	}

	.expo {
		padding: 0 var(--column-pad);
	}

	/* Expanded reads like the chronicle: art and text share one centred 640px column. */
	.detail.expanded .detail-scroll {
		padding-top: 1.75rem;
	}

	.detail.expanded .photo,
	.detail.expanded .hero-art.place,
	.detail.expanded .hero-art.nation {
		width: auto;
		margin: 0 var(--column-pad) 0.5rem;
		border: none;
		border-radius: var(--card-radius);
		overflow: hidden;
	}

	.detail.expanded .photo figcaption {
		padding-inline: 0.75rem;
	}

	/* Expanded on a wide screen: the infobox and pictures on the left, the writing on the right. */
	@media (min-width: 60rem) {
		.body.split {
			--split-pad: max(1.5rem, calc((100% - 74rem) / 2));
			display: grid;
			grid-template-columns: minmax(19rem, 25rem) minmax(0, 1fr);
			column-gap: clamp(2rem, 4vw, 3.5rem);
			align-items: start;
			padding-inline: var(--split-pad);
		}

		.body.split .expo {
			padding: 0;
		}

		.detail.expanded .body.split .hero.portrait .hero-art {
			width: 10.5rem;
		}

		.body.split .photo,
		.body.split .hero-art.place,
		.body.split .hero-art.nation {
			margin: 0 0 0.5rem;
		}

		.body.split .text {
			max-width: var(--script-measure);
			padding-top: 1.5rem;
		}

		.body.split .text > section:first-child > h2 {
			margin-top: 0;
		}
	}

	.photo {
		margin: 0;
		border-radius: 0;
		overflow: hidden;
		border: none;
		border-bottom: 1px solid var(--hairline);
	}

	.photo img {
		display: block;
		width: 100%;
		max-height: 18rem;
		object-fit: cover;
	}

	.photo figcaption {
		padding: 0.45rem var(--column-pad);
		font-size: 0.62rem;
		color: var(--fg-faint);
		background: color-mix(in srgb, var(--fg) 3%, transparent);
	}

	.hero-art.place,
	.hero-art.nation {
		margin: 0;
		padding: 0;
		width: 100%;
		line-height: 0;
		background: transparent;
		border-bottom: 1px solid var(--hairline);
	}

	.hero-art.place img {
		display: block;
		width: 100%;
		max-height: none;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		object-position: center;
	}

	.hero-art.place.bond img {
		aspect-ratio: 2 / 1;
		background: #0b0907;
	}

	.hero-art.nation img {
		display: block;
		width: 100%;
		max-height: min(14rem, 28dvh);
		object-fit: contain;
		object-position: center;
	}

	.hero-art.stand-in img {
		opacity: 0.45;
	}

	.hero.portrait {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas: 'id art';
		align-items: end;
		column-gap: 1.25rem;
		margin: 0 0 0.15rem;
	}

	.hero.portrait .hero-id {
		grid-area: id;
		padding: 1.5rem 0 1.25rem;
		min-width: 0;
	}

	.hero.portrait .hero-art {
		grid-area: art;
		margin: 0;
		padding: 0;
		width: 11.5rem;
		aspect-ratio: 2 / 3;
		line-height: 0;
		overflow: hidden;
		align-self: end;
		/* The figure fades into the rule below. */
		mask-image: linear-gradient(to bottom, #000 80%, transparent);
	}

	.hero.portrait .hero-art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	.detail.expanded .hero.portrait .hero-art {
		width: 13rem;
	}

	.hero.portrait .hero-art.stand-in {
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.hero-id {
		padding: 1.5rem 0 1.25rem;
		max-width: none;
	}

	.hero-id.text-only {
		padding-top: 2rem;
	}

	.stage-gallery {
		margin: 0 0 1.1rem;
		padding: 0.95rem 1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--k) 28%, var(--line));
		border-radius: var(--card-radius);
		background: color-mix(in srgb, var(--panel) 92%, var(--k) 8%);
	}

	.stage-heading {
		margin: 0 0 0.65rem;
		font-family: var(--sans);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-muted);
	}

	.stage-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.stage-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		width: 5.2rem;
		padding: 0.45rem 0.35rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--k) 22%, var(--line));
		border-radius: 10px;
		background: var(--panel);
		cursor: pointer;
		color: inherit;
		font: inherit;
		transition:
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.stage-chip:hover {
		border-color: color-mix(in srgb, var(--k) 45%, var(--line));
	}

	.stage-chip.active {
		border-color: color-mix(in srgb, var(--k) 65%, var(--gold));
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--k) 35%, transparent);
	}

	.stage-chip img {
		display: block;
		width: 3.4rem;
		height: 4.2rem;
		object-fit: contain;
		object-position: bottom center;
	}

	.stage-initial {
		display: grid;
		place-items: center;
		width: 3.4rem;
		height: 4.2rem;
		border-radius: var(--radius);
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 700;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	.stage-label {
		max-width: 100%;
		font-size: 0.62rem;
		font-weight: 600;
		line-height: 1.25;
		text-align: center;
		color: var(--fg-muted);
	}

	.initial {
		display: grid;
		place-items: center;
		width: 2.8rem;
		height: 2.8rem;
		margin-bottom: 0.7rem;
		border-radius: var(--radius);
		font-family: var(--serif);
		font-weight: 700;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	/* Wikipedia-style title: serif, ruled off from the article. */
	.name {
		margin: 0;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid var(--hairline);
		font-family: var(--serif);
		font-size: clamp(2rem, 5vw, 2.6rem);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--fg-strong);
	}

	/* The one-line summary under the title (“Loyalty”, “Girl Dad”). */
	.short-desc {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0.55rem 0 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		font-style: italic;
		line-height: 1.3;
		color: color-mix(in srgb, var(--k) 60%, var(--fg-strong));
	}

	.short-desc-ko {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.82em;
		font-style: normal;
		color: var(--fg-dim);
	}

	.native {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin: 0.6rem 0 0;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1rem;
		letter-spacing: 0.04em;
		color: var(--fg-dim);
	}

	.hanja {
		color: var(--fg-faint);
	}

	.quote {
		position: relative;
		margin: 1.1rem 0 0;
		padding-left: 1.2rem;
	}

	.quote::before {
		content: '\201C';
		position: absolute;
		left: -0.05rem;
		top: 0.62em;
		font-family: var(--serif);
		font-size: 2.2rem;
		line-height: 0;
		color: color-mix(in srgb, var(--k) 60%, var(--gold));
	}

	.quote blockquote {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.14rem;
		font-style: italic;
		font-weight: 500;
		line-height: 1.45;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
		text-shadow: 0 1px 14px color-mix(in srgb, var(--bg) 80%, transparent);
	}

	/* Infobox: a bordered fact table, label column on the left. */
	.props {
		display: grid;
		gap: 0;
		margin: 0 0 1.6rem;
		padding: 0.35rem 1.1rem;
		border: 1px solid var(--hairline);
		border-radius: var(--card-radius);
		background: color-mix(in srgb, var(--fg) 2.5%, transparent);
		font-size: 0.86rem;
		line-height: 1.45;
	}

	.props:empty {
		display: none;
	}

	.props > div {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 1rem;
		align-items: baseline;
		padding: 0.6rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.props > div:last-child {
		border-bottom: none;
	}

	.props dt {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
	}

	.props dd {
		margin: 0;
		color: var(--fg);
	}

	.props > div.prop-art {
		grid-template-columns: 1fr;
		gap: 0.35rem;
		align-items: start;
	}

	.prop-art-row {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.45rem;
	}

	.prop-art-fig {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
	}

	.prop-art-cap {
		line-height: 1.45;
	}

	.prop-art-link {
		display: block;
		padding: 0;
		border: none;
		background: none;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.prop-art-link:hover .prop-art-cap {
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.accent-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	/* Colour swatch: a small lit dot and a quiet code. */
	.hex-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.22rem 0.65rem 0.22rem 0.4rem;
		min-height: 1.4rem;
		border-radius: var(--radius-pill);
		border: 1px solid color-mix(in srgb, var(--chip) 35%, transparent);
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.66rem;
		font-weight: 400;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
		color: var(--fg-dim);
		background: color-mix(in srgb, var(--chip) 8%, transparent);
	}

	.hex-chip::before {
		content: '';
		width: 0.7rem;
		height: 0.7rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--chip);
		box-shadow: 0 0 10px color-mix(in srgb, var(--chip) 60%, transparent);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.12rem 0.55rem;
		border-radius: var(--radius-pill);
		border: 1px solid var(--chip-line);
		background: var(--chip-bg);
		color: var(--chip-fg);
		font-size: 0.85rem;
	}

	button.pill.link-pill {
		font: inherit;
		color: var(--chip-fg);
		cursor: pointer;
		transition:
			border-color 0.2s var(--ease),
			background 0.2s var(--ease),
			transform 0.2s var(--ease);
	}

	button.pill.link-pill:hover {
		border-color: color-mix(in srgb, var(--k) 65%, transparent);
		background: color-mix(in srgb, var(--k) 22%, transparent);
		transform: translateY(-1px);
	}

	.pill-flag {
		width: 1rem;
		height: 0.68rem;
		object-fit: cover;
		border-radius: 1px;
	}

	.icons {
		font-size: 0.88rem;
		color: var(--fg-dim);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}

	.bond-pair .partner {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.swatch {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 2px;
		background: var(--sw);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
		flex-shrink: 0;
	}

	.pill-row {
		display: inline-flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		align-items: center;
	}

	.pill-row .pill {
		border-color: color-mix(in srgb, var(--pill, var(--k)) 24%, transparent);
		background: color-mix(in srgb, var(--pill, var(--k)) 13%, transparent);
		color: color-mix(in srgb, var(--pill, var(--k)) 72%, var(--fg-strong));
	}

	.spoken {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.spoken-en {
		font-family: var(--serif);
		font-style: italic;
		color: var(--fg-strong);
		line-height: 1.35;
	}

	.spoken-ko {
		font-size: 0.88rem;
		color: var(--fg-dim);
	}

	.sep {
		opacity: 0.45;
		margin: 0 0.1rem;
	}

	/* Infobox links read like the inline prose links. */
	.linkish {
		padding: 0;
		border: none;
		background: none;
		color: var(--wiki-link);
		font: inherit;
		font-weight: var(--weight-link);
		letter-spacing: inherit;
		text-align: left;
		cursor: pointer;
	}

	.linkish:hover {
		text-decoration: underline;
		text-underline-offset: 0.16em;
	}

	.phrase-mark {
		margin: 0 0 0.55rem;
		font-family: var(--serif);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #c9a227;
	}

	/* The lead paragraph, above the infobox. */
	.tagline {
		margin: 0.25rem 0 1.4rem;
		font-family: var(--serif);
		font-size: 1.1rem;
		line-height: 1.55;
		letter-spacing: -0.01em;
		color: var(--fg-strong);
	}

	.era-tags {
		list-style: none;
		margin: 0 0 1.6rem;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.era-tags li {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg-dim);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		padding: 0.28rem 0.65rem;
		background: color-mix(in srgb, var(--fg) 4%, transparent);
	}

	section {
		margin: 0 0 2.2rem;
	}

	/* Wikipedia section heading: serif, ruled underneath. */
	h2 {
		display: flex;
		align-items: baseline;
		margin: 0 0 0.85rem;
		padding-bottom: 0.3rem;
		border-bottom: 1px solid var(--hairline);
		font-family: var(--serif);
		font-size: 1.3rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.2;
		color: var(--fg-strong);
	}

	.h2-ko {
		margin-left: 0.5rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.1em;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: none;
		color: var(--fg-faint);
	}

	.cv-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.cv-list li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.35rem 0.75rem;
		padding: 0.28rem 0;
		line-height: 1.45;
		color: var(--fg);
	}

	.cv-when {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.4rem;
		margin-left: auto;
		white-space: nowrap;
	}

	.cv-years {
		font-family: var(--serif);
		font-size: 0.82rem;
		color: var(--k);
		white-space: nowrap;
	}

	.cv-age {
		font-size: 0.72rem;
		color: var(--fg-faint);
		white-space: nowrap;
	}

	.cv-dot {
		opacity: 0.45;
		font-size: 0.72rem;
	}

	.cv-office {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
		min-width: 0;
	}

	.cv-post {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem;
		min-width: 0;
		text-align: left;
	}

	button.cv-post.linkish {
		color: inherit;
		font-weight: inherit;
	}

	button.cv-post.linkish:hover .cv-ko,
	button.cv-post.linkish:hover .cv-en {
		color: var(--k);
	}

	.cv-ko {
		font-weight: 600;
		color: var(--fg-strong);
	}

	.cv-hanja {
		color: var(--fg-faint);
	}

	.cv-en {
		color: var(--fg);
	}

	.cv-note {
		font-size: 0.78rem;
		color: var(--fg-dim);
	}

	.cv-note::before {
		content: '· ';
		opacity: 0.55;
	}

	.prose {
		margin: 0;
		font-family: var(--sans);
		font-size: 0.95rem;
		line-height: 1.65;
		letter-spacing: var(--tracking-body);
		color: var(--fg);
	}

	.ideo-label {
		font-family: var(--serif);
		font-weight: 600;
		color: color-mix(in srgb, var(--k) 70%, var(--fg));
	}

	.timeline {
		--tl-year: 4.2rem;
		--tl-gap: 0.55rem;
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* Spine through the dots. */
	.timeline::before {
		content: '';
		position: absolute;
		top: 0.9rem;
		bottom: 0.9rem;
		left: calc(var(--tl-year) + var(--tl-gap) + 3px);
		width: 1px;
		background: color-mix(in srgb, var(--k) 30%, transparent);
	}

	.timeline li {
		position: relative;
		display: grid;
		grid-template-columns: var(--tl-year) 0.7rem 1fr;
		gap: var(--tl-gap);
		align-items: start;
		padding: 0.5rem 0;
	}

	.tl-year {
		font-family: var(--serif);
		font-size: 0.82rem;
		color: var(--k);
		text-align: right;
	}

	.tl-dot {
		width: 7px;
		height: 7px;
		margin-top: 0.45rem;
		border-radius: 50%;
		background: var(--k);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 18%, transparent);
	}

	.tl-text {
		color: var(--fg);
		line-height: 1.5;
	}

	.tl-age {
		display: inline-block;
		margin-left: 0.35rem;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.aliases {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.aliases li {
		padding: 0.2rem 0.55rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		font-size: 0.8rem;
		color: var(--fg-dim);
	}

	.sobriquets li {
		border-color: color-mix(in srgb, var(--k) 45%, var(--hairline));
		color: var(--fg);
		font-style: italic;
	}

	.related {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.55rem;
	}

	.rel-card {
		display: grid;
		gap: 0.2rem;
		width: 100%;
		text-align: left;
		padding: 0.95rem 1.05rem;
		border: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
		border-radius: var(--card-radius);
		background: var(--plate);
		cursor: pointer;
		font: inherit;
		color: inherit;
		position: relative;
		transition:
			border-color 0.3s var(--ease),
			box-shadow 0.3s var(--ease);
	}

	.rel-card:hover {
		border-color: color-mix(in srgb, var(--k) 45%, transparent);
		box-shadow: 0 10px 24px -18px rgba(0, 0, 0, 0.6);
	}

	.rel-name {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 500;
		letter-spacing: -0.015em;
		color: var(--fg-strong);
	}

	.rel-meta {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.rel-line {
		font-size: 0.86rem;
		color: var(--fg-dim);
		line-height: 1.4;
	}

	/* Character roster — compact portrait tiles for org members. */
	.member-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5.75rem, 1fr));
		gap: 0.55rem;
	}

	.class-bands {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}

	.class-band-head {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		margin: 0 0 0.45rem;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.class-band-head .member-clan-aff {
		margin-top: 0;
	}

	.detail.expanded .member-grid {
		grid-template-columns: repeat(auto-fill, minmax(7.25rem, 1fr));
		gap: 0.75rem;
	}

	.member-card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.45rem;
		width: 100%;
		height: 100%;
		text-align: center;
		padding: 0.55rem 0.45rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
		border-radius: var(--card-radius);
		background: var(--plate);
		cursor: pointer;
		font: inherit;
		color: inherit;
		position: relative;
		transition:
			border-color 0.3s var(--ease),
			box-shadow 0.3s var(--ease);
	}

	.member-card:hover {
		border-color: color-mix(in srgb, var(--mk, var(--k)) 45%, transparent);
		box-shadow: 0 16px 34px -22px color-mix(in srgb, var(--mk, var(--k)) 60%, rgba(0, 0, 0, 0.8));
	}

	.member-avatar {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: var(--radius);
		font-family: var(--serif);
		font-weight: 700;
		font-size: 1.35rem;
		color: var(--fg-dim);
		background: transparent;
	}

	.member-avatar img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		background: transparent;
	}

	.member-avatar.silhouette img {
		opacity: 0.62;
	}

	.member-avatar.place-thumb {
		aspect-ratio: 16 / 10;
	}

	.member-avatar.place-thumb img {
		object-fit: cover;
		object-position: center;
	}

	/* Chronicle stills — bare 3-col masonry, native aspect, no tile chrome. */
	.gallery {
		container-type: inline-size;
		container-name: wiki-gallery;
		padding: 0;
		border: none;
		background: none;
	}

	.gallery-masonry {
		list-style: none;
		margin: 0;
		padding: 0;
		column-count: 3;
		column-gap: 0.35rem;
	}

	.gallery-masonry > li {
		display: inline-block;
		width: 100%;
		margin: 0 0 0.35rem;
		vertical-align: top;
		break-inside: avoid;
		-webkit-column-break-inside: avoid;
		page-break-inside: avoid;
	}

	/* Folded: the first rows of stills, fading out above See all. */
	.gallery-masonry.clamped {
		max-height: var(--gallery-max);
		overflow: hidden;
		mask-image: linear-gradient(to bottom, #000 78%, transparent);
	}

	.gallery-more {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 100%;
		margin-top: 0.5rem;
		padding: 0.55rem 1rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg-strong);
		font: inherit;
		font-family: var(--ui);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		cursor: pointer;
		transition: background-color 0.2s var(--ease);
	}

	.gallery-more:hover {
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.gallery-more .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.gallery-shot {
		display: block;
		width: 100%;
		padding: 0;
		margin: 0;
		border: none;
		border-radius: 0;
		background: none;
		color: inherit;
		font: inherit;
		line-height: 0;
		cursor: zoom-in;
	}

	.gallery-shot img {
		display: block;
		width: 100%;
		height: auto;
	}

	@container wiki-gallery (max-width: 26rem) {
		.gallery-masonry {
			column-count: 2;
		}
	}

	@container wiki-gallery (max-width: 16rem) {
		.gallery-masonry {
			column-count: 1;
		}
	}

	.member-meta {
		display: grid;
		gap: 0.12rem;
		min-width: 0;
	}

	.member-name {
		font-weight: 600;
		font-size: 0.82rem;
		line-height: 1.25;
		color: var(--fg-strong);
		letter-spacing: var(--tracking-display);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.member-title {
		font-size: 0.68rem;
		line-height: 1.3;
		color: var(--fg-dim);
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.member-clan-aff {
		display: inline-block;
		margin-top: 0.12rem;
		padding: 0.08rem 0.38rem;
		border-radius: var(--radius-pill);
		font-size: 0.58rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--hw, var(--mk)) 72%, var(--fg));
		background: color-mix(in srgb, var(--hw, var(--mk)) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--hw, var(--mk)) 28%, transparent);
	}

	.props .member-clan-aff {
		margin-top: 0;
		margin-right: 0.2rem;
		vertical-align: 0.12em;
	}

	.clan-ko {
		font-weight: 400;
		color: var(--fg-dim);
	}

	.modern-gloss {
		font-size: 0.92em;
		font-weight: 400;
		color: var(--fg-dim);
	}

	.modern-gloss::before {
		content: '· ';
		opacity: 0.65;
	}

	.trait-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.trait-chips li {
		padding: 0.28rem 0.65rem;
		border: 1px solid color-mix(in srgb, var(--k) 35%, var(--hairline));
		border-radius: var(--radius-pill);
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--k) 10%, transparent);
	}

	.chat-prompt details {
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--bg-raised);
		overflow: hidden;
	}

	.chat-prompt summary {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		cursor: pointer;
		list-style: none;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.chat-prompt summary::-webkit-details-marker {
		display: none;
	}

	.chat-summary-hint {
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--fg-dim);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.chat-body {
		display: grid;
		gap: 0.75rem;
		padding: 0 1rem 1rem;
		border-top: 1px solid var(--hairline);
		padding-top: 0.85rem;
	}

	.chat-help {
		margin: 0;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.chat-pre {
		margin: 0;
		max-height: 18rem;
		overflow: auto;
		padding: 0.85rem 0.95rem;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--bg) 88%, var(--fg));
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.72rem;
		line-height: 1.45;
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--fg-strong);
	}

	.chat-actions {
		display: flex;
		gap: 0.5rem;
	}

	/* ————— Entrance — replays per entry ({#key entry.id}) ————— */
	.hero-art img {
		animation: art-in 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	.hero-id > *,
	.props > div,
	.tagline {
		animation: rise-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	.hero-id > :nth-child(2) {
		animation-delay: 0.06s;
	}

	.hero-id > :nth-child(3) {
		animation-delay: 0.12s;
	}

	.hero-id > :nth-child(4) {
		animation-delay: 0.18s;
	}

	.hero-id > :nth-child(n + 5) {
		animation-delay: 0.24s;
	}

	.props > div:nth-child(1) {
		animation-delay: 0.2s;
	}

	.props > div:nth-child(2) {
		animation-delay: 0.25s;
	}

	.props > div:nth-child(3) {
		animation-delay: 0.3s;
	}

	.props > div:nth-child(4) {
		animation-delay: 0.35s;
	}

	.props > div:nth-child(5) {
		animation-delay: 0.4s;
	}

	.props > div:nth-child(n + 6) {
		animation-delay: 0.45s;
	}

	.tagline {
		animation-delay: 0.3s;
	}

	@keyframes art-in {
		from {
			opacity: 0;
			transform: scale(1.06) translateY(0.6rem);
			filter: blur(8px);
		}
	}

	@keyframes rise-in {
		from {
			opacity: 0;
			transform: translateY(0.7rem);
		}
	}

	/* Lower sections and gallery shots rise as they scroll into the panel. */
	@supports (animation-timeline: view()) {
		section,
		.gallery-masonry > li {
			animation: rise-in linear both;
			animation-timeline: view();
			animation-range: entry 0% entry 45%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-art img,
		.hero-id > *,
		.props > div,
		.tagline,
		section,
		.gallery-masonry > li {
			animation: none;
		}
	}

	@media (max-width: 600px) {
		.icon-btn {
			width: 2.75rem;
			height: 2.75rem;
		}

		.detail-scroll {
			padding: 0 0 max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2rem));
		}

		.detail,
		.detail.expanded {
			--column-pad: 1.15rem;
		}

		.hero-id {
			padding: 1.25rem 0 1rem;
		}

		.hero-id.text-only {
			padding-top: 1.5rem;
		}

		.hero.portrait .hero-id {
			padding: 1.25rem 0 1rem;
		}

		.hero.portrait {
			column-gap: 0.85rem;
		}

		.hero.portrait .hero-art {
			width: 8.25rem;
		}

		.detail.expanded .hero.portrait .hero-art {
			width: 11rem;
		}

		.hero-art.nation img {
			max-height: min(11rem, 28dvh);
		}

		.props > div {
			grid-template-columns: 1fr;
			gap: 0.15rem;
		}

		.timeline {
			--tl-year: 3.4rem;
		}

		.timeline li {
			grid-template-columns: var(--tl-year) 0.55rem 1fr;
		}

		.text-btn {
			min-height: 2.5rem;
		}
	}
</style>
