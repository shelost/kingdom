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
		swordsOf,
		swordOfPerson
	} from '$lib/wiki';
	import { buildChatPrompt, isChatPersona } from '$lib/chatPrompt';
	import { leitmotifOf, playLeitmotif, stopLeitmotif, tempsOf } from '$lib/leitmotifs';
	import TempRefs from '$lib/components/TempRefs.svelte';
	import WikiOrgCharts from './diagrams/WikiOrgCharts.svelte';
	import OrgChart from './diagrams/OrgChart.svelte';
	import { chartsForWikiEntry, hasDiagramChart } from './diagrams/wikiCharts';
	import { storyImg } from '$lib/img';

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
	let isNation = $derived(entry.entity === 'nation');
	/** Nation detail hero uses the kingdom flag when present (not portrait art). */
	let heroArt = $derived(isNation && flag ? flag : art);
	let isNationFlagHero = $derived(isNation && !!flag);
	/** People / gods / clans — 2:3 bust beside identity, not a stacked landscape. */
	let isPortraitHero = $derived(!!heroArt && !isPlace && !isNationFlagHero);
	let kind = $derived(kindOf(entry));
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
	let memberships = $derived(isOrg || isGroup || isClan || isBond || isSword ? [] : orgsOf(entry));
	let groupMemberships = $derived(
		isOrg || isGroup || isClan || isBond || isSword ? [] : groupsOf(entry)
	);
	let orgMembers = $derived(
		isOrg
			? membersOf(entry.id)
			: isGroup
				? groupMembersOf(entry.id)
				: isClan
					? clanMembersOf(entry.id)
					: isSword
						? ownersOf(entry.id)
						: []
	);
	let orgRosterTitle = $derived(
		isSword ? 'Owners' : isClan ? 'Members' : 'Members'
	);
	let linkedSword = $derived(!isSword && entry.blade ? swordOfPerson(entry.id) : undefined);
	let personSwords = $derived(!isSword && entry.blade ? swordsOf(entry.id) : []);
	let isHwarang = $derived(entry.id === 'hwarang');
	let orgRoster = $derived(isHwarang ? sortHwarangMembers(orgMembers) : orgMembers);
	let hwarangGroups = $derived(isHwarang ? groupByHwarangClass(orgMembers) : []);
	let clanLabel = $derived(isOrg || isGroup || isClan || isBond || isPlace || isSword ? undefined : clanOf(entry));
	let clanEntries = $derived(
		isOrg || isGroup || isClan || isBond || isPlace || isSword ? [] : clanEntriesOf(entry)
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

	let motif = $derived(leitmotifOf(entry.id));
	let temps = $derived(tempsOf(motif));
	let motifPlaying = $state(false);
	let motifTimer: ReturnType<typeof setTimeout> | undefined;

	function quietMotif() {
		if (!browser) return;
		stopLeitmotif();
		clearTimeout(motifTimer);
		motifPlaying = false;
	}

	function toggleMotif() {
		if (!browser || !motif) return;
		if (motifPlaying) {
			quietMotif();
			return;
		}
		const ms = playLeitmotif(entry.id);
		if (ms <= 0) return;
		motifPlaying = true;
		motifTimer = setTimeout(() => (motifPlaying = false), ms);
	}

	// Stop playback when the entry changes or the detail view unmounts.
	$effect(() => {
		void entry.id;
		previewLook = null;
		return quietMotif;
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
	aria-label="{who} encyclopedia entry"
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
			<a class="text-btn" href={resolve('/')} title="Back to the chronicle">Chronicle</a>
		</div>
	</header>

	<div class="detail-scroll" {@attach bindScroll}>
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
				class:place={isPlace}
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
					{#if entry.quote}
						<figure class="quote">
							<blockquote>{entry.quote}</blockquote>
						</figure>
					{/if}
					{#if motif}
						<div class="motif-row">
							<button
								type="button"
								class={['motif-btn', motifPlaying && 'playing']}
								onclick={toggleMotif}
								aria-pressed={motifPlaying}
								title={motif.idea}
							>
								<span class="material-symbols-outlined" aria-hidden="true"
									>{motifPlaying ? 'stop' : 'music_note'}</span
								>
								{motifPlaying ? 'Playing' : 'Leitmotif'}
							</button>
						</div>
						{#if temps.length}
							<div class="motif-temps">
								<TempRefs {temps} />
							</div>
						{/if}
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

		<dl class="props">
			{#if role}
				<div>
					<dt>{isBond ? 'Bond' : isPlace ? 'Type' : 'Title'}</dt>
					<dd>{role}</dd>
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
				{#if isHwarang}
					<div class="class-bands">
						{#each hwarangGroups as g (g.id)}
							<section class="class-band">
								<h3 class="class-band-head">
									<span class="member-clan-aff" style:--hw={g.color} title="Hwarang {g.label}"
										>{g.label}</span
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
										<img {...storyImg(cityArt, { kind: 'place', alt: '', sizes: '7.25rem' })} />
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
										<img {...storyImg(placeArt, { kind: 'place', alt: '', sizes: '7.25rem' })} />
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

		{#if isPhrase}
			<p class="phrase-mark">Household idiom · say it the way others say Trojan horse</p>
		{/if}
		{#if isSword}
			<p class="phrase-mark">Ring-pommel blade · owner linked below</p>
		{/if}
		<p class="tagline">{entry.tagline}</p>

		{#if eraTags.length}
			<ul class="era-tags" aria-label="Era tags">
				{#each eraTags as t (t)}
					<li title={ERA_TAG_META[t]?.hint ?? t}>{ERA_TAG_META[t]?.label ?? t}</li>
				{/each}
			</ul>
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
					{#if entry.ideology}<span class="ideo-label">{entry.ideology}. </span>{/if}{entry.ideologyNote}
				</p>
			</section>
		{/if}

		{#if entry.nature}
			<section>
				<h2>Nature</h2>
				<p class="prose">{entry.nature}</p>
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
										: isGod
											? 'Myth'
											: 'Character arc'}
				</h2>
				<p class="prose">{entry.arc}</p>
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
								{ev.label}
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
									{kindLabel(bond)}
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
		</div><!-- expo -->
	</div>
</article>

<style>
	.detail {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		background: var(--panel);
	}

	.detail-bar {
		display: flex;
		align-items: center;
		flex-shrink: 0;
		gap: 0.55rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--hairline);
		background: var(--panel);
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
		border: 1px solid var(--hairline);
		border-radius: 8px;
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
		border-radius: 999px;
		padding: 0.15rem 0.55rem;
	}

	.badge.lead {
		color: var(--fg-strong);
		border-color: color-mix(in srgb, var(--k) 50%, transparent);
	}

	.badge.god-badge {
		margin-bottom: 0.45rem;
		color: #fffdf8;
		background: color-mix(in srgb, var(--k) 55%, #000);
		border-color: color-mix(in srgb, var(--k) 70%, transparent);
	}

	.badge.tier-badge {
		margin-bottom: 0.45rem;
		color: var(--on-gold);
		background: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 70%, #000);
		border-radius: 4px;
		letter-spacing: 0.1em;
	}

	.badge.tier-badge[data-tier='S'] {
		background: #fff8e7;
		color: #3a2a10;
	}

	.badge.tier-badge[data-tier='demigod'] {
		background: color-mix(in srgb, var(--k) 45%, #c4a574);
		color: #fffdf8;
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
		border-radius: 999px;
		font: inherit;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #fffdf8;
		background: color-mix(in srgb, var(--k) 68%, #111);
		border: 1px solid color-mix(in srgb, var(--k) 80%, #fff);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--k) 35%, transparent);
	}

	button.realm-chip {
		cursor: pointer;
	}

	button.realm-chip:hover {
		border-color: color-mix(in srgb, var(--k) 40%, #fff);
	}

	.realm-chip .realm-ko,
	.realm-pill .realm-ko {
		letter-spacing: 0.02em;
		text-transform: none;
		opacity: 0.88;
		font-size: 0.78em;
	}

	.pill.realm-pill {
		background: color-mix(in srgb, var(--k) 28%, transparent);
		border-color: color-mix(in srgb, var(--k) 55%, transparent);
		color: color-mix(in srgb, var(--k) 40%, var(--fg-strong));
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
		border-radius: 6px;
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
		padding: 0 1.7rem;
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
		padding: 0.45rem 1.7rem;
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

	.detail.expanded .hero.portrait {
		grid-template-columns: minmax(0, 26rem) auto;
		justify-content: space-between;
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
		width: 10.5rem;
		aspect-ratio: 2 / 3;
		line-height: 0;
		overflow: hidden;
		align-self: end;
		background: transparent;
	}

	.hero.portrait .hero-art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
	}

	.detail.expanded .hero.portrait .hero-art {
		width: 16rem;
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
		padding: 0.85rem 0.95rem 0.95rem;
		border: 1px solid color-mix(in srgb, var(--k) 28%, var(--line));
		border-radius: 8px;
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
		border-radius: 8px;
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
		border-radius: 6px;
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
		border-radius: 8px;
		font-family: var(--serif);
		font-weight: 700;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	.name {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.9rem, 4.5vw, 2.6rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.15;
		color: var(--fg-strong);
	}

	.native {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		margin: 0.45rem 0 0;
		font-size: 1rem;
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

	.motif-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.85rem;
	}

	.motif-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.75rem 0.3rem 0.6rem;
		border-radius: 999px;
		border: 1px solid rgba(216, 178, 106, 0.4);
		background: var(--glass);
		color: var(--gold);
		font: inherit;
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			border-color 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.motif-temps {
		margin-top: 0.55rem;
		max-width: 28rem;
	}

	.motif-btn .material-symbols-outlined {
		font-size: 0.95rem;
	}

	.motif-btn:hover {
		background: rgba(216, 178, 106, 0.12);
		border-color: rgba(216, 178, 106, 0.65);
	}

	.motif-btn.playing {
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.props {
		display: grid;
		gap: 0.75rem;
		margin: 0 0 1.4rem;
		padding: 0;
	}

	.props > div {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 0.6rem;
		align-items: baseline;
	}

	.props dt {
		margin: 0;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--fg-faint);
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

	.hex-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.12rem 0.45rem;
		min-height: 1.15rem;
		border-radius: 3px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #fffdf8;
		background: var(--chip);
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.7), 0 1px 2px rgba(0, 0, 0, 0.45);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.12rem 0.55rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
		background: color-mix(in srgb, var(--k) 14%, transparent);
		font-size: 0.85rem;
	}

	button.pill.link-pill {
		font: inherit;
		color: inherit;
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
		border-color: color-mix(in srgb, var(--pill, var(--k)) 45%, transparent);
		background: color-mix(in srgb, var(--pill, var(--k)) 16%, transparent);
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

	.linkish {
		padding: 0;
		border: none;
		background: none;
		color: color-mix(in srgb, var(--k) 55%, var(--fg-strong));
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.15em;
		cursor: pointer;
	}

	.linkish:hover {
		color: var(--fg-strong);
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

	.tagline {
		margin: 0 0 0.85rem;
		font-size: 1.05rem;
		line-height: 1.45;
		color: var(--fg-dim);
		border-left: 2px solid color-mix(in srgb, var(--k) 55%, transparent);
		padding-left: 0.9rem;
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
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0.28rem 0.65rem;
		background: var(--glass);
	}

	section {
		margin: 0 0 1.8rem;
	}

	h2 {
		margin: 0 0 0.65rem;
		font-family: var(--serif);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.h2-ko {
		margin-left: 0.35rem;
		font-size: 0.85em;
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
		line-height: 1.48;
		color: var(--fg);
	}

	.ideo-label {
		font-family: var(--serif);
		font-weight: 600;
		color: color-mix(in srgb, var(--k) 70%, var(--fg));
	}

	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.timeline li {
		display: grid;
		grid-template-columns: 4.2rem 0.7rem 1fr;
		gap: 0.55rem;
		align-items: start;
		padding: 0.45rem 0;
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
		border-radius: 999px;
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
		padding: 0.85rem 0.95rem;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		background: var(--bg-raised);
		cursor: pointer;
		font: inherit;
		color: inherit;
		transition:
			border-color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.rel-card:hover {
		border-color: rgba(216, 178, 106, 0.4);
		background: color-mix(in srgb, var(--bg-raised) 80%, var(--k));
	}

	.rel-name {
		font-weight: 600;
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
		border: 1px solid var(--hairline);
		border-radius: 12px;
		background: var(--bg-raised);
		cursor: pointer;
		font: inherit;
		color: inherit;
		transition:
			border-color 0.2s var(--ease),
			background 0.2s var(--ease),
			transform 0.2s var(--ease);
	}

	.member-card:hover {
		border-color: rgba(216, 178, 106, 0.4);
		background: color-mix(in srgb, var(--bg-raised) 78%, var(--mk, var(--k)));
		transform: translateY(-1px);
	}

	.member-avatar {
		display: grid;
		place-items: center;
		width: 100%;
		aspect-ratio: 2 / 3;
		overflow: hidden;
		border-radius: 8px;
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
		border-radius: 999px;
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
		border-radius: 999px;
		font-size: 0.72rem;
		letter-spacing: 0.02em;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--k) 10%, transparent);
	}

	.chat-prompt details {
		border: 1px solid var(--hairline);
		border-radius: 12px;
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
		border-radius: 8px;
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

	@media (max-width: 600px) {
		.icon-btn {
			width: 2.75rem;
			height: 2.75rem;
		}

		.detail-scroll {
			padding: 0 0 max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2rem));
		}

		.expo {
			padding: 0 1.15rem;
		}

		.photo figcaption {
			padding: 0.45rem 1.15rem;
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

		.timeline li {
			grid-template-columns: 3.4rem 0.55rem 1fr;
		}

		.text-btn {
			min-height: 2.5rem;
		}
	}
</style>
