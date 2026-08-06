<script lang="ts">
	import { onMount } from 'svelte';
	import {
		byId,
		ageAt,
		avatarOf,
		isPlaceholderArt,
		KINGDOMS,
		colorOf,
		hangulInitial,
		type Person
	} from '$lib/people';
	import { BOND_LABEL } from '$lib/relations';
	import { profiles, openProfile, closeProfile } from '$lib/profiles.svelte';

	// hover card
	let hovered = $state<Person | null>(null);
	let hoverYear = $state<number | null>(null);
	let x = $state(0);
	let y = $state(0);
	let below = $state(false);

	let peeked = $derived(profiles.peeked);

	let hoverTimer: ReturnType<typeof setTimeout> | undefined;
	let card: HTMLElement | undefined = $state();

	function yearOf(el: HTMLElement): number | null {
		const art = el.closest<HTMLElement>('[data-year]');
		const v = art?.dataset.year;
		return v ? Number(v) : null;
	}

	function place(el: HTMLElement) {
		const r = el.getBoundingClientRect();
		const w = card?.offsetWidth ?? 300;
		const h = card?.offsetHeight ?? 150;
		below = r.top < h + 24; // not enough room above → flip under
		x = Math.min(Math.max(r.left + r.width / 2, w / 2 + 12), window.innerWidth - w / 2 - 12);
		y = below ? r.bottom + 10 : r.top - 10;
	}

	onMount(() => {
		const over = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person') as HTMLElement | null;
			if (!el) return;
			const p = byId.get(el.dataset.person ?? '');
			if (!p) return;
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => {
				hovered = p;
				hoverYear = yearOf(el);
				// place after the card has a size
				requestAnimationFrame(() => place(el));
			}, 90);
		};

		const out = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person');
			if (!el) return;
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => (hovered = null), 120);
		};

		const click = (e: Event) => {
			const el = (e.target as HTMLElement)?.closest?.('.person') as HTMLElement | null;
			if (!el) return;
			e.preventDefault();
			const p = byId.get(el.dataset.person ?? '');
			if (!p) return;
			hovered = null;
			openProfile(p);
		};

		const key = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeProfile();
				hovered = null;
			}
		};

		document.addEventListener('mouseover', over);
		document.addEventListener('mouseout', out);
		document.addEventListener('click', click);
		document.addEventListener('keydown', key);
		window.addEventListener('scroll', () => (hovered = null), { passive: true });

		return () => {
			document.removeEventListener('mouseover', over);
			document.removeEventListener('mouseout', out);
			document.removeEventListener('click', click);
			document.removeEventListener('keydown', key);
		};
	});

	function lifespan(p: Person) {
		const f = (n?: number) => (n == null ? '?' : n < 0 ? `${-n} BCE` : `${n}`);
		if (p.born == null && p.died == null) return '';
		return `${p.bornApprox ? 'c. ' : ''}${f(p.born)} – ${f(p.died)}`;
	}

</script>

<!-- ————— floating preview ————— -->
{#if hovered}
	{@const k = { ...KINGDOMS[hovered.kingdom], color: colorOf(hovered) }}
	{@const art = avatarOf(hovered)}
	<div
		class="card"
		class:below
		bind:this={card}
		style:left="{x}px"
		style:top="{y}px"
		style:--k={k.color}
		role="tooltip"
	>
		<div class="card-top">
			<span class="avatar" class:silhouette={isPlaceholderArt(art)} aria-hidden="true">
				{#if art}
					<img src={art} alt="" />
				{:else}
					{hangulInitial(hovered)}
				{/if}
			</span>
			<div class="card-id">
				<span class="card-name">{hovered.name}</span>
				<span class="card-sub">
					{#if hovered.korean}<span class="ko">{hovered.korean}</span>{/if}
					<span class="k-dot"></span>
					{#if k.flag}<img class="card-flag" src={k.flag} alt="" />{/if}
					{k.label}
				</span>
			</div>
			{#if hovered.entity !== 'concept' && hovered.entity !== 'relationship' && hovered.entity !== 'place' && ageAt(hovered, hoverYear) != null}
				<span class="card-age">{ageAt(hovered, hoverYear)}</span>
			{/if}
		</div>
		{#if hovered.title}<p class="card-title">{hovered.title}</p>{/if}
		<p class="card-line">{hovered.tagline}</p>
		<p class="card-hint">
			{#if hovered.entity === 'place'}
				Place · click to open
			{:else}
				{lifespan(hovered)} · click to open
			{/if}
		</p>
	</div>
{/if}

<!-- ————— notion-style side peek ————— -->
{#if peeked}
	{@const k = { ...KINGDOMS[peeked.kingdom], color: colorOf(peeked) }}
	{@const isBond = peeked.entity === 'relationship'}
	{@const isPlace = peeked.entity === 'place'}
	{@const art = avatarOf(peeked)}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={() => closeProfile()}></div>
	<aside class="peek" style:--k={k.color} aria-label="{peeked.name} profile">
		<header class="peek-head">
			<button class="close" onclick={() => closeProfile()} aria-label="Close">✕</button>
			{#if peeked.main}<span class="lead">Lead</span>{/if}
			{#if peeked.entity === 'concept'}<span class="lead concept">Institution</span>{/if}
			{#if isPlace}<span class="lead place">Place</span>{/if}
			{#if isBond}<span class="lead bond">{peeked.bond ? BOND_LABEL[peeked.bond] : 'Bond'}</span>{/if}
		</header>

		<div class="peek-body">
			{#if peeked.photo}
				<figure class="peek-photo">
					<img src={peeked.photo} alt={peeked.name} />
					{#if peeked.photoCredit}<figcaption>{peeked.photoCredit}</figcaption>{/if}
				</figure>
			{/if}

			<!-- The art stands on the right; the name, native script and defining
			     line sit in front of it, lifted off the picture by a scrim. -->
			<div class="hero" class:has-art={!!art} class:stand-in={isPlaceholderArt(art)}>
				{#if art}
					<figure class="hero-art" aria-hidden="true">
						<img src={art} alt="" />
					</figure>
				{/if}
				<div class="hero-id">
					{#if !art && !peeked.photo}
						<span class="peek-avatar" aria-hidden="true">{hangulInitial(peeked)}</span>
					{/if}
					<h2 class="peek-name">{peeked.name}</h2>
					<p class="peek-native">
						{#if peeked.hanja}<span class="hanja">{peeked.hanja}</span>{/if}
						{#if peeked.korean}<span class="ko">{peeked.korean}</span>{/if}
					</p>
					{#if peeked.quote}
						<figure class="defining">
							<blockquote>{peeked.quote}</blockquote>
						</figure>
					{/if}
				</div>
			</div>

			<dl class="props">
				{#if peeked.title}
					<div>
						<dt>{isBond ? 'Bond' : isPlace ? 'Type' : 'Role'}</dt>
						<dd>{peeked.title}</dd>
					</div>
				{/if}
				{#if isBond && peeked.between}
					<div>
						<dt>Between</dt>
						<dd class="between">
							{#each peeked.between as id, i (id)}
								{@const other = byId.get(id)}
								{#if i > 0}<span class="amp">·</span>{/if}
								{#if other}
									<button type="button" class="linkish" onclick={() => openProfile(other)}
										>{other.name}</button
									>
								{/if}
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
				{#if peeked.entity === 'nation' && k.icons}
					<div><dt>Signs</dt><dd class="icons">{k.icons}</dd></div>
				{/if}
				{#if peeked.blade}
					<div><dt>Blade</dt><dd>{peeked.blade}</dd></div>
				{/if}
				{#if peeked.binyeo}
					<div><dt>Binyeo</dt><dd>{peeked.binyeo}</dd></div>
				{/if}
				{#if lifespan(peeked)}
					<div>
						<dt>{peeked.entity === 'concept' || isBond ? 'Active' : 'Lived'}</dt>
						<dd>{lifespan(peeked)}</dd>
					</div>
				{/if}
				{#if peeked.entity !== 'concept' && peeked.entity !== 'relationship' && peeked.entity !== 'place' && peeked.born != null && peeked.died != null}
					<div><dt>Age at death</dt><dd>{peeked.died - peeked.born}</dd></div>
				{/if}
				<div><dt>Identifier</dt><dd><code class="hex">{colorOf(peeked)}</code></dd></div>
			</dl>

			<p class="tagline">{peeked.tagline}</p>

			{#if peeked.nature}
				<h3>Nature</h3>
				<p class="arc nature">{peeked.nature}</p>
			{/if}

			{#if peeked.arc}
				<h3>{isBond ? 'Story of the bond' : isPlace ? 'About this place' : 'Character arc'}</h3>
				<p class="arc">{peeked.arc}</p>
			{/if}

			{#if peeked.events?.length}
				<h3>Key events</h3>
				<ol class="timeline">
					{#each peeked.events as ev, i (i)}
						<li>
							<span class="tl-year"
								>{ev.year == null ? '—' : ev.year < 0 ? `${-ev.year} BCE` : ev.year}</span
							>
							<span class="tl-dot" aria-hidden="true"></span>
							<span class="tl-text">
								{ev.label}
								{#if peeked.born != null && ev.year != null && ev.year >= peeked.born}
									<span class="tl-age">age {ev.year - peeked.born}</span>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			{/if}
		</div>
	</aside>
{/if}

<style>
	/* ————— hover preview ————— */
	.card {
		position: fixed;
		z-index: 120;
		width: 19rem;
		transform: translate(-50%, -100%);
		background: var(--glass);
		backdrop-filter: blur(18px) saturate(150%);
		border: 1px solid rgba(255, 255, 255, 0.11);
		border-top: 2px solid var(--k);
		border-radius: 12px;
		box-shadow: 0 20px 55px rgba(0, 0, 0, 0.6);
		padding: 0.8rem 0.9rem;
		pointer-events: none;
		animation: pop 0.24s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.card.below {
		transform: translate(-50%, 0);
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% + 6px)) scale(0.97);
		}
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.avatar,
	.peek-avatar {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		overflow: hidden;
		border-radius: 8px;
		font-family: var(--serif);
		font-weight: 700;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	/* standing busts have headroom — crop to the face, not empty sky */
	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 16%;
	}

	.avatar.silhouette img {
		opacity: 0.62;
	}

	.card-id {
		min-width: 0;
		flex: 1;
	}

	.card-name {
		display: block;
		font-weight: 600;
		font-size: 0.92rem;
		color: #fffdf8;
		letter-spacing: var(--tracking-display);
	}

	.card-sub {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.k-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--k);
	}

	.card-flag {
		width: 0.95rem;
		height: 0.64rem;
		object-fit: cover;
		border-radius: 1px;
	}

	.card-age {
		font-family: var(--serif);
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--k);
		line-height: 1;
	}

	.card-title {
		margin: 0.55rem 0 0;
		font-size: 0.75rem;
		color: var(--fg-dim);
	}

	.card-line {
		margin: 0.35rem 0 0;
		font-size: 0.8rem;
		line-height: 1.45;
		color: var(--fg);
	}

	.card-hint {
		margin: 0.55rem 0 0;
		font-size: 0.66rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	/* ————— side peek ————— */
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 110;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(2px);
		animation: fade 0.3s ease;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.peek {
		position: fixed;
		inset: 0 0 0 auto;
		z-index: 115;
		width: min(30rem, 92vw);
		display: flex;
		flex-direction: column;
		background: var(--panel);
		border-left: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: -30px 0 80px rgba(0, 0, 0, 0.55);
		animation: slide 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	@keyframes slide {
		from {
			transform: translateX(100%);
		}
	}

	.peek-head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.8rem 1rem;
		border-bottom: 1px solid var(--hairline);
	}

	.close {
		width: 1.8rem;
		height: 1.8rem;
		display: grid;
		place-items: center;
		font-size: 0.8rem;
		color: var(--fg-dim);
		background: transparent;
		border: 1px solid var(--hairline);
		border-radius: 7px;
		cursor: pointer;
		transition:
			background 0.2s var(--ease),
			color 0.2s var(--ease);
	}

	.close:hover {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}

	.hex {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.72rem;
		color: var(--k);
		border: 1px solid color-mix(in srgb, var(--k) 35%, transparent);
		background: color-mix(in srgb, var(--k) 14%, transparent);
		border-radius: 4px;
		padding: 0.05rem 0.4rem;
	}

	.lead.concept {
		color: var(--fg-dim);
		border-color: var(--hairline);
	}

	.lead.place {
		color: color-mix(in srgb, var(--k) 65%, #fff);
		border-color: color-mix(in srgb, var(--k) 40%, transparent);
	}

	.lead.bond {
		color: color-mix(in srgb, var(--k) 70%, #fff);
		border-color: color-mix(in srgb, var(--k) 45%, transparent);
	}

	/* place art: fill the hero like a landscape, not a bust */
	.peek:has(.lead.place) .hero.has-art {
		min-height: 13.5rem;
	}

	.peek:has(.lead.place) .hero-art img {
		object-fit: cover;
		object-position: center;
	}

	.between {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem;
	}

	.between .amp {
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

	.lead {
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
		border: 1px solid rgba(216, 178, 106, 0.4);
		border-radius: 999px;
		padding: 0.15rem 0.55rem;
	}

	.peek-body {
		flex: 1;
		overflow-y: auto;
		padding: 1.6rem 1.8rem 4rem;
	}

	/* ————— hero: art on the right, identity in front of it ————— */
	.hero {
		position: relative;
		margin: 0 0 1.3rem;
	}

	/* with art the hero bleeds to the pane edges and reserves the bust's height */
	.hero.has-art {
		margin: -1.6rem -1.8rem 1.4rem;
		padding: 1.6rem 1.8rem 1.3rem;
		display: flex;
		align-items: flex-end;
		min-height: 17.5rem;
		overflow: hidden;
		background: color-mix(in srgb, var(--k) 13%, var(--panel-sunken));
		border-bottom: 1px solid var(--hairline);
	}

	/* a placeholder body: present, but visibly not a likeness */
	.hero.stand-in .hero-art img {
		opacity: 0.45;
	}

	.hero-art {
		position: absolute;
		inset: 0 0 0 auto;
		z-index: 0;
		width: min(22rem, 72%);
		margin: 0;
		pointer-events: none;
	}

	.hero-art img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: right center;
		/* soft edge toward the name — keep the bust itself opaque */
		-webkit-mask-image: linear-gradient(to right, transparent 0%, #000 18%, #000 100%);
		mask-image: linear-gradient(to right, transparent 0%, #000 18%, #000 100%);
	}

	/* Panel wash only under the text column — do not grey out the portrait. */
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
		max-width: 20rem;
	}

	/* ————— the line the character would answer everything with ————— */
	.defining {
		position: relative;
		margin: 1rem 0 0;
		padding-left: 1.2rem;
	}

	.defining::before {
		content: '\201C';
		position: absolute;
		left: -0.05rem;
		top: 0.62em;
		font-family: var(--serif);
		font-size: 2.2rem;
		line-height: 0;
		color: color-mix(in srgb, var(--k) 60%, var(--gold));
	}

	.defining blockquote {
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

	.peek-photo {
		margin: 0 0 1.1rem;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid var(--hairline);
	}

	.peek-photo img {
		display: block;
		width: 100%;
		max-height: 15rem;
		object-fit: cover;
	}

	.peek-photo figcaption {
		padding: 0.4rem 0.6rem;
		font-size: 0.62rem;
		letter-spacing: 0.03em;
		color: var(--fg-faint);
		background: rgba(255, 255, 255, 0.03);
	}

	.peek-avatar {
		width: 3.4rem;
		height: 3.4rem;
		border-radius: 12px;
		font-size: 1.5rem;
		margin-bottom: 0.9rem;
	}

	.peek-name {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.9rem;
		font-weight: 700;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: #fffdf8;
	}

	.peek-native {
		margin: 0.3rem 0 0;
		display: flex;
		gap: 0.7rem;
		font-family: 'Noto Serif KR', serif;
	}

	.peek-native .hanja {
		color: var(--k);
		font-weight: 900;
	}

	.peek-native .ko {
		color: var(--fg-dim);
	}

	.props {
		margin: 0 0 1.4rem;
		display: grid;
		gap: 0.05rem;
	}

	.props > div {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		align-items: baseline;
		padding: 0.32rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.045);
	}

	dt {
		font-size: 0.74rem;
		color: var(--fg-faint);
	}

	dd {
		margin: 0;
		font-size: 0.85rem;
		color: var(--fg);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.72rem;
		padding: 0.1rem 0.5rem 0.1rem 0.28rem;
		border-radius: 999px;
		color: color-mix(in srgb, var(--k) 70%, #fff);
		background: color-mix(in srgb, var(--k) 22%, transparent);
		border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
	}

	.pill-flag {
		width: 1.15rem;
		height: 0.76rem;
		object-fit: cover;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.icons {
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		color: var(--fg-dim);
	}

	.tagline {
		margin: 0 0 1.6rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.02rem;
		line-height: 1.5;
		color: color-mix(in srgb, var(--k) 45%, #fff);
	}

	h3 {
		margin: 1.5rem 0 0.6rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.arc {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.68;
		color: var(--fg-dim);
	}

	/* ————— timeline ————— */
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.timeline li {
		position: relative;
		display: grid;
		grid-template-columns: 3.6rem 1rem 1fr;
		align-items: start;
		padding-bottom: 0.85rem;
	}

	.tl-year {
		font-family: var(--serif);
		font-size: 0.88rem;
		font-weight: 700;
		color: #fffdf8;
		letter-spacing: 0;
	}

	.tl-dot {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.tl-dot::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0.42em;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--k);
		transform: translateX(-50%);
		box-shadow: 0 0 12px -1px var(--k);
	}

	/* connector line, hidden on the last item */
	.timeline li:not(:last-child) .tl-dot::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 1.1em;
		bottom: -0.85rem;
		width: 1px;
		background: rgba(255, 255, 255, 0.12);
		transform: translateX(-50%);
	}

	.tl-text {
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.tl-age {
		display: inline-block;
		margin-left: 0.4rem;
		font-size: 0.68rem;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0 0.4rem;
		white-space: nowrap;
	}

	/* narrow panel: the bust gives ground so the name and quote keep their width */
	@media (max-width: 560px) {
		.hero.has-art {
			min-height: 14.5rem;
		}

		.hero-art {
			width: 58%;
		}

		.defining blockquote {
			font-size: 1.02rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.peek,
		.scrim {
			animation: none;
		}
	}
</style>
