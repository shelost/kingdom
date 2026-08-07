<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		byId,
		avatarOf,
		nameOf,
		titleOf,
		koreanOf,
		isPlaceholderArt,
		KINGDOMS,
		colorOf,
		hangulInitial,
		type Person
	} from '$lib/people';
	import {
		kindOf,
		kindLabel,
		lifespanOf,
		formatYear,
		bondsFor,
		betweenPeople,
		appearanceCount
	} from '$lib/wiki';

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
	let art = $derived(avatarOf(entry));
	let who = $derived(nameOf(entry));
	let role = $derived(titleOf(entry));
	let ko = $derived(koreanOf(entry));
	let isBond = $derived(entry.entity === 'relationship');
	let isPlace = $derived(entry.entity === 'place');
	let kind = $derived(kindOf(entry));
	let relatedBonds = $derived(isBond ? [] : bondsFor(entry.id));
	let partners = $derived(isBond ? betweenPeople(entry) : []);
	let life = $derived(lifespanOf(entry));
	let apps = $derived(appearanceCount(entry.id));
</script>

<article class="detail" class:expanded style:--k={k.color} aria-label="{who} encyclopedia entry">
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
		{#if entry.photo}
			<figure class="photo">
				<img src={entry.photo} alt={who} />
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
				{#if !art && !entry.photo}
					<span class="initial" aria-hidden="true">{hangulInitial(entry)}</span>
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
			{#if partners.length}
				<div>
					<dt>Between</dt>
					<dd class="links">
						{#each partners as other, i (other.id)}
							{#if i > 0}<span class="sep">·</span>{/if}
							<button type="button" class="linkish" onclick={() => onOpen(other.id)}
								>{nameOf(other)}</button
							>
						{/each}
					</dd>
				</div>
			{/if}
			<div>
				<dt>{isPlace ? 'Territory' : 'Kingdom'}</dt>
				<dd>
					<span class="pill">
						{#if k.flag}<img class="pill-flag" src={k.flag} alt="" />{/if}
						{k.label}
					</span>
				</dd>
			</div>
			{#if entry.entity === 'nation' && k.icons}
				<div><dt>Signs</dt><dd class="icons">{k.icons}</dd></div>
			{/if}
			{#if entry.blade}
				<div><dt>Blade</dt><dd>{entry.blade}</dd></div>
			{/if}
			{#if entry.binyeo}
				<div><dt>Binyeo</dt><dd>{entry.binyeo}</dd></div>
			{/if}
			{#if life}
				<div>
					<dt>{kind === 'concept' || isBond ? 'Active' : 'Lived'}</dt>
					<dd>{life}</dd>
				</div>
			{/if}
			{#if kind === 'character' && entry.born != null && entry.died != null}
				<div><dt>Age at death</dt><dd>{entry.died - entry.born}</dd></div>
			{/if}
		</dl>

		<p class="tagline">{entry.tagline}</p>

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

		{#if entry.nature}
			<section>
				<h2>Nature</h2>
				<p class="prose">{entry.nature}</p>
			</section>
		{/if}

		{#if entry.arc}
			<section>
				<h2>{isBond ? 'Story of the bond' : isPlace ? 'About this place' : 'Character arc'}</h2>
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
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
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
		color: #fffdf8;
		border-color: color-mix(in srgb, var(--k) 50%, transparent);
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
		background: rgba(255, 255, 255, 0.03);
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
		min-height: 14rem;
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
		color: #fffdf8;
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
		color: #fffdf8;
		text-shadow: 0 1px 14px rgba(0, 0, 0, 0.8);
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

	.sep {
		opacity: 0.45;
		margin: 0 0.1rem;
	}

	.linkish {
		padding: 0;
		border: none;
		background: none;
		color: color-mix(in srgb, var(--k) 55%, #fff);
		font: inherit;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 0.15em;
		cursor: pointer;
	}

	.linkish:hover {
		color: #fff;
	}

	.tagline {
		margin: 0 0 1.8rem;
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--fg-dim);
		border-left: 2px solid color-mix(in srgb, var(--k) 55%, transparent);
		padding-left: 0.9rem;
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
		line-height: 1.7;
		color: var(--fg);
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
		color: #fffdf8;
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
