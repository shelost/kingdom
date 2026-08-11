<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import {
		byId,
		avatarOf,
		nameOf,
		titleOf,
		koreanOf,
		isPlaceholderArt,
		KINGDOMS,
		ERA_TAG_META,
		colorOf,
		accentColorsOf,
		hangulInitial,
		photoOf,
		binyeoArtOf,
		kingdomFlag,
		type Person
	} from '$lib/people';
	import {
		kindOf,
		kindLabel,
		lifespanOf,
		formatYear,
		bondsFor,
		betweenPeople,
		appearanceCount,
		godTierLabel,
		orgsOf,
		membersOf,
		clanOf,
		clanEntriesOf,
		clanMembersOf,
		clanAffiliationOf,
		nationOf,
		cityOf,
		placesInCity,
		citiesOfKingdom,
		showsWikiAccent
	} from '$lib/wiki';
	import { buildChatPrompt, isChatPersona } from '$lib/chatPrompt';
	import WikiOrgCharts from './diagrams/WikiOrgCharts.svelte';
	import OrgChart from './diagrams/OrgChart.svelte';
	import { chartsForWikiEntry, hasDiagramChart } from './diagrams/wikiCharts';

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
	let art = $derived(avatarOf(entry));
	let photo = $derived(photoOf(entry));
	let binyeoArt = $derived(binyeoArtOf(entry));
	let flag = $derived(kingdomFlag(entry.kingdom));
	let who = $derived(nameOf(entry));
	let role = $derived(titleOf(entry));
	let ko = $derived(koreanOf(entry));
	let isBond = $derived(entry.entity === 'relationship');
	let isPlace = $derived(entry.entity === 'place');
	let isPhrase = $derived(entry.entity === 'phrase');
	let isGod = $derived(entry.entity === 'god');
	let isOrg = $derived(entry.entity === 'organization');
	let isClan = $derived(entry.entity === 'clan');
	let isNation = $derived(entry.entity === 'nation');
	let kind = $derived(kindOf(entry));
	let isCity = $derived(kind === 'city');
	let parentCity = $derived(kind === 'place' ? cityOf(entry) : undefined);
	let nation = $derived(nationOf(entry.kingdom));
	let childPlaces = $derived(isCity ? placesInCity(entry.id) : []);
	let kingdomCities = $derived(isNation ? citiesOfKingdom(entry.kingdom) : []);
	let relatedBonds = $derived(isBond ? [] : bondsFor(entry.id));
	let partners = $derived(isBond ? betweenPeople(entry) : []);
	let bondA = $derived(accents[0] ?? k.color);
	let bondB = $derived(accents[1] ?? accents[0] ?? k.color);
	let memberships = $derived(isOrg || isClan || isBond || isPlace ? [] : orgsOf(entry));
	let orgMembers = $derived(isOrg ? membersOf(entry.id) : isClan ? clanMembersOf(entry.id) : []);
	let clanLabel = $derived(isOrg || isClan || isBond || isPlace ? undefined : clanOf(entry));
	let clanEntries = $derived(
		isOrg || isClan || isBond || isPlace ? [] : clanEntriesOf(entry)
	);
	let chartNodes = $derived(isOrg ? (entry.orgChart ?? []) : []);
	let life = $derived(lifespanOf(entry));
	let apps = $derived(appearanceCount(entry.id));
	let eraTags = $derived(entry.tags ?? []);
	let charts = $derived(chartsForWikiEntry(entry.id));
	let showFlatOrgChart = $derived(isOrg && (entry.orgChart ?? []).length > 0 && !hasDiagramChart(entry.id));
	let orgSectionTitle = $derived(
		entry.id === 'four_divisions' ? 'Cosmology' : charts.length ? 'Organization chart' : 'Institutions'
	);
	let canChat = $derived(isChatPersona(entry));
	let chatPrompt = $derived(canChat ? buildChatPrompt(entry) : '');
	let copiedForId = $state<string | null>(null);
	let promptCopied = $derived(copiedForId === entry.id);

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
				<img src={photo} alt={who} />
				{#if entry.photoCredit}<figcaption>{entry.photoCredit}</figcaption>{/if}
			</figure>
		{/if}

		<div
			class="hero"
			class:has-art={!!art}
			class:stand-in={isPlaceholderArt(art)}
			class:place={isPlace}
		>
			{#if art}
				<figure class="hero-art" aria-hidden="true">
					<img src={art} alt="" />
				</figure>
			{/if}
			<div class="hero-id">
				{#if !art && !photo}
					<span class="initial" aria-hidden="true">{hangulInitial(entry)}</span>
				{/if}
				{#if isGod}<span class="badge god-badge">God</span>{/if}
				{#if entry.godTier}
					{@const tier = godTierLabel(entry.godTier)}
					<span class="badge tier-badge" data-tier={entry.godTier} title={tier.hint}>{tier.en}</span>
				{/if}
				{#if entry.realm}
					<span class="realm-chip" title="Realm / domain">{entry.realm.en}<span class="realm-ko">{entry.realm.ko}</span></span>
				{/if}
				<h1 class="name">{who}</h1>
				<p class="native">
					{#if entry.hanja}<span class="hanja">{entry.hanja}</span>{/if}
					{#if ko}<span class="ko">{ko}</span>{/if}
				</p>
				{#if entry.quote}
					<figure class="quote">
						<blockquote>{entry.quote}</blockquote>
					</figure>
				{/if}
			</div>
		</div>

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
						<span class="pill realm-pill">{entry.realm.en}<span class="realm-ko"> · {entry.realm.ko}</span></span>
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
			{#if parentCity}
				<div>
					<dt>City</dt>
					<dd class="links">
						<button type="button" class="linkish" onclick={() => onOpen(parentCity.id)}
							>{nameOf(parentCity)}</button
						>
					</dd>
				</div>
			{/if}
			<div>
				<dt>{isPlace ? (isCity ? 'Kingdom' : 'Territory') : isBond ? 'Kingdoms' : 'Kingdom'}</dt>
				<dd>
					{#if isBond && partners.length}
						<span class="pill-row">
							{#each partners as other (other.id)}
								{@const pk = { ...KINGDOMS[other.kingdom], color: colorOf(other) }}
								{@const pn = nationOf(other.kingdom)}
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
					{:else}
						<span class="pill">
							{#if flag}<img class="pill-flag" src={flag} alt="" />{/if}
							{k.label}
						</span>
					{/if}
				</dd>
			</div>
			{#if entry.entity === 'nation' && k.icons}
				<div><dt>Signs</dt><dd class="icons">{k.icons}</dd></div>
			{/if}
			{#if entry.blade}
				<div><dt>Blade</dt><dd>{entry.blade}</dd></div>
			{/if}
			{#if entry.binyeo}
				<div class="binyeo-prop">
					<dt>Binyeo</dt>
					<dd class="binyeo-row">
						{#if binyeoArt}
							<img class="binyeo-fig" src={binyeoArt} alt="" />
						{/if}
						<span class="binyeo-cap">{entry.binyeo}</span>
					</dd>
				</div>
			{/if}
			{#if life}
				<div>
					<dt
						>{kind === 'concept' ||
						kind === 'organization' ||
						kind === 'clan' ||
						kind === 'phrase' ||
						kind === 'city' ||
						kind === 'place' ||
						isBond
							? 'Active'
							: 'Lived'}</dt
					>
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

		{#if showFlatOrgChart}
			<section class="org-charts">
				<h2>Organization chart</h2>
				{#key entry.id}
					<OrgChart nodes={chartNodes} {onOpen} />
				{/key}
			</section>
		{/if}

		{#if orgMembers.length}
			<section>
				<h2>Members</h2>
				<ul class="member-grid">
					{#each orgMembers as m (m.id)}
						{@const art = avatarOf(m)}
						{@const clanAff = isClan ? clanAffiliationOf(m, entry.id) : null}
						<li>
							<button
								type="button"
								class="member-card"
								style:--mk={colorOf(m)}
								onclick={() => onOpen(m.id)}
							>
								<span
									class="member-avatar"
									class:silhouette={isPlaceholderArt(art)}
									aria-hidden="true"
								>
									{#if art}
										<img src={art} alt="" />
									{:else}
										{hangulInitial(m)}
									{/if}
								</span>
								<span class="member-meta">
									<span class="member-name">{nameOf(m)}</span>
									{#if clanAff === 'marriage'}
										<span class="member-clan-aff" title="Joined this clan by marriage">Marriage</span>
									{/if}
									{#if titleOf(m)}
										<span class="member-title">{titleOf(m)}</span>
									{:else}
										<span class="member-title">{kindLabel(m)}</span>
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
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
										<img src={cityArt} alt="" />
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
										<img src={placeArt} alt="" />
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
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #fffdf8;
		background: color-mix(in srgb, var(--k) 68%, #111);
		border: 1px solid color-mix(in srgb, var(--k) 80%, #fff);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--k) 35%, transparent);
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
		padding: 1.5rem 1.7rem 4rem;
		-webkit-overflow-scrolling: touch;
	}

	.photo {
		margin: 0 0 1.2rem;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--hairline);
	}

	.photo img {
		display: block;
		width: 100%;
		max-height: 18rem;
		object-fit: cover;
	}

	.photo figcaption {
		padding: 0.45rem 0.7rem;
		font-size: 0.62rem;
		color: var(--fg-faint);
		background: color-mix(in srgb, var(--fg) 3%, transparent);
	}

	.hero {
		position: relative;
		margin: 0 0 1.5rem;
	}

	.hero.has-art {
		display: flex;
		align-items: flex-end;
		min-height: 20rem;
		margin: -1.5rem -1.7rem 1.5rem;
		padding: 1.8rem 1.7rem 1.5rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--k) 13%, var(--panel-sunken));
		border-bottom: 1px solid var(--hairline);
	}

	.detail.expanded .hero.has-art {
		min-height: min(28rem, 52dvh);
	}

	.hero.place.has-art {
		min-height: 15.5rem;
	}

	.hero.stand-in .hero-art img {
		opacity: 0.45;
	}

	.hero-art {
		position: absolute;
		inset: 0 0 0 auto;
		z-index: 0;
		width: min(26rem, 74%);
		margin: 0;
		pointer-events: none;
	}

	.detail.expanded .hero-art {
		width: min(32rem, 68%);
	}

	.hero.place .hero-art {
		inset: 0;
		width: 100%;
	}

	.hero-art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: right center;
		-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 18%, #000 100%);
		mask-image: linear-gradient(to right, transparent 0%, #000 18%, #000 100%);
	}

	.hero.place .hero-art img {
		object-fit: cover;
		object-position: center;
		-webkit-mask-image: none;
		mask-image: none;
	}

	.hero.has-art::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			100deg,
			var(--panel) 0%,
			color-mix(in srgb, var(--panel) 88%, transparent) 34%,
			color-mix(in srgb, var(--panel) 35%, transparent) 52%,
			transparent 68%
		);
	}

	.hero.place.has-art::after {
		background: linear-gradient(
			to top,
			var(--panel) 0%,
			color-mix(in srgb, var(--panel) 92%, transparent) 28%,
			color-mix(in srgb, var(--panel) 40%, transparent) 55%,
			transparent 78%
		);
	}

	.hero-id {
		position: relative;
		z-index: 2;
		max-width: 22rem;
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

	.props > div.binyeo-prop {
		grid-template-columns: 1fr;
		gap: 0.35rem;
		align-items: start;
	}

	.binyeo-row {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.45rem;
	}

	.binyeo-fig {
		display: block;
		width: 100%;
		height: auto;
		object-fit: contain;
	}

	.binyeo-cap {
		line-height: 1.45;
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
		color: color-mix(in srgb, var(--mk) 72%, var(--fg));
		background: color-mix(in srgb, var(--mk) 14%, transparent);
		border: 1px solid color-mix(in srgb, var(--mk) 28%, transparent);
	}

	.clan-ko {
		font-weight: 400;
		color: var(--fg-dim);
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
			padding: 1.25rem 1.15rem max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2rem));
		}

		.hero.has-art {
			min-height: 16rem;
			margin: -1.25rem -1.15rem 1.2rem;
			padding: 1.25rem 1.15rem 1.1rem;
		}

		.detail.expanded .hero.has-art {
			min-height: min(22rem, 46dvh);
		}

		.hero-art {
			width: 62%;
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
