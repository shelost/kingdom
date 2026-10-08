<script lang="ts">
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import NsfwToggle from '$lib/components/NsfwToggle.svelte';
	import StoryWorldMap from '$lib/components/StoryWorldMap.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { filterNsfw } from '$lib/nsfwUi.svelte';
	import { resolve } from '$app/paths';
	import { episodeCount, heroStill } from '$lib/outlines';
	import { EPISODE_KIND_META } from '$lib/episodeKindMeta';
	import type { Lore, Note, Outline, Person, RenderedMap, Still, Verdict } from '$lib/outlines/types';

	let { outline, maps = [] }: { outline: Outline; maps?: RenderedMap[] } = $props();

	const hero = $derived(heroStill(outline));
	const stills = $derived(filterNsfw(outline.images));
	const hasIntimate = $derived(outline.images.some((s) => s.nsfw));
	const leads = $derived(outline.cast.filter((c) => c.lead));
	const supporting = $derived(outline.cast.filter((c) => !c.lead));
	const episodes = $derived(episodeCount(outline));
	const creeds = $derived(outline.cast.filter((c) => c.creed));
	const stillsByEpisode = $derived.by(() => {
		const byEpisode = new Map<string, Still[]>();
		for (const s of stills) if (s.episode) byEpisode.set(s.episode, [...(byEpisode.get(s.episode) ?? []), s]);
		return byEpisode;
	});
	const legends = $derived(outline.legends ?? []);
	const concepts = $derived(outline.concepts ?? []);

	const VERDICT: Record<Verdict, string> = {
		backed: 'Historically backed',
		partly: 'Partly backed',
		dramatized: 'Dramatized'
	};
	const numbered = $derived.by(() => {
		let n = 0;
		return outline.parts.map((p) => ({ ...p, episodes: p.episodes.map((e) => ({ ...e, n: ++n })) }));
	});
	const sections = $derived(
		[
			{ id: 'synopsis', label: 'Synopsis', show: outline.synopsis.length > 0 },
			{ id: 'maps', label: 'Maps', show: maps.length > 0 },
			{ id: 'stills', label: 'Stills', show: outline.images.length > 1 },
			{ id: 'leads', label: 'Leads', show: leads.length > 0 },
			{ id: 'cast', label: 'Characters', show: supporting.length > 0 },
			{ id: 'creeds', label: 'Where they stand', show: creeds.length > 0 },
			{ id: 'bonds', label: 'Bonds', show: outline.bonds.length > 0 },
			{ id: 'quotes', label: 'Quotes', show: outline.quotes.length > 0 },
			{ id: 'chapters', label: 'Chapters', show: outline.parts.length > 0 },
			{ id: 'arcs', label: 'Arcs', show: outline.arcs.length > 0 },
			{ id: 'themes', label: 'Themes', show: outline.themes.length > 0 },
			{ id: 'legends', label: 'Legends', show: legends.length > 0 },
			{ id: 'concepts', label: 'Concepts', show: concepts.length > 0 },
			{ id: 'plants', label: 'Plants and payoffs', show: outline.plants.length > 0 },
			{ id: 'timeline', label: 'Timeline', show: outline.timeline.length > 0 },
			{ id: 'research', label: 'Research', show: outline.sources.length + outline.research.length > 0 },
			{ id: 'places', label: 'Places', show: outline.places.length > 0 },
			{ id: 'production', label: 'Production', show: outline.production.length > 0 },
			{ id: 'titles', label: 'Other titles', show: outline.altTitles.length > 0 }
		].filter((s) => s.show)
	);
</script>

{#snippet person(c: Person)}
	<li class="person" class:lead={c.lead} style:--c={c.hex}>
		<div class="avatar">
			{#if c.portrait}
				<img src={staticAsset(c.portrait)} alt={c.name} loading="lazy" />
			{:else}
				<span aria-hidden="true">{c.ko.slice(0, 1)}</span>
			{/if}
		</div>
		<div class="person-text">
			<h3>
				{c.name}
				<span class="ko">{c.ko}{c.hanja ? ` ${c.hanja}` : ''}</span>
			</h3>
			<p class="epithet">{c.epithet}</p>
			{#if c.sobriquets?.length}
				<ul class="sobriquets">
					{#each c.sobriquets as s (s)}<li>{s}</li>{/each}
				</ul>
			{/if}
			<p class="person-meta"><span class="swatch"></span>{c.side} · {c.life}</p>
			<blockquote class="line">{c.line}</blockquote>
			<dl>
				{#if c.creed}
					<dt>Creed</dt>
					<dd><b>{c.creed.stance}.</b> {c.creed.wants}</dd>
				{/if}
				{#if c.look}
					<dt>Look</dt>
					<dd>{c.look}</dd>
				{/if}
				<dt>Wants</dt>
				<dd>{c.want}</dd>
				<dt>Voice</dt>
				<dd>{c.voice}</dd>
				<dt>Arc</dt>
				<dd>{c.arc}</dd>
			</dl>
		</div>
	</li>
{/snippet}

{#snippet lore(list: Lore[])}
	<dl class="lore">
		{#each list as l (l.name)}
			<div>
				<dt>
					{l.name}{#if l.ko || l.hanja}<span class="ko">{[l.ko, l.hanja].filter(Boolean).join(' ')}</span>{/if}
				</dt>
				<dd>{l.body}</dd>
			</div>
		{/each}
	</dl>
{/snippet}

{#snippet notes(list: Note[])}
	<dl class="notes">
		{#each list as n (n.title)}
			<dt>{n.title}</dt>
			{#each n.body as para, i (i)}
				<dd>{para}</dd>
			{/each}
		{/each}
	</dl>
{/snippet}

<main class="outline" style:--accent={outline.accent}>
	<SiteNavSpace />

	{#if hero}
		<figure class="hero">
			<img src={staticAsset(hero.src)} alt={hero.alt} />
		</figure>
	{/if}

	<div class="layout">
		<nav class="toc" aria-label="Outline sections">
			<a class="back" href={resolve('/stories')}>← All stories</a>
			<ol>
				{#each sections as s (s.id)}
					<li><a href={`#${s.id}`}>{s.label}</a></li>
				{/each}
			</ol>
		</nav>

		<article class="column">
			<header class="head">
				<p class="eyebrow">{outline.shelf} · {outline.era}</p>
				<h1>
					{outline.title}
					<span class="ko">{outline.ko}{outline.hanja ? ` ${outline.hanja}` : ''}</span>
				</h1>
				<p class="tagline">{outline.tagline}</p>
				<p class="meta">{outline.years} · {outline.parts.length} parts · {episodes} episodes</p>
				<p class="logline">{outline.logline}</p>
				<p class="opening">{outline.opening}</p>
			</header>

			<section id="synopsis">
				<h2>Synopsis</h2>
				{#each outline.synopsis as para, i (i)}
					<p>{para}</p>
				{/each}
			</section>

			{#if maps.length}
				<section id="maps">
					<h2>Maps</h2>
					<div class="maps">
						{#each maps as m (m.id)}
							<StoryWorldMap map={m} />
						{/each}
					</div>
				</section>
			{/if}

			{#if outline.images.length > 1}
				<section id="stills">
					<div class="section-head">
						<h2>Stills</h2>
						{#if hasIntimate}<NsfwToggle compact />{/if}
					</div>
					<ul class="stills">
						{#each stills as still (still.src)}
							<li class:poster={still.kind === 'poster'}>
								<figure>
									<img src={staticAsset(still.src)} alt={still.alt} loading="lazy" />
									<figcaption>
										{#if still.kind}<span class="tag">{still.kind}</span>{/if}
										{#if still.nsfw}<span class="tag">intimate</span>{/if}
										{#if still.year}<span class="years">{still.year}</span>{/if}
										{still.caption}
									</figcaption>
								</figure>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if leads.length}
				<section id="leads">
					<h2>Leads</h2>
					<ul class="cast leads">
						{#each leads as c (c.name)}
							{@render person(c)}
						{/each}
					</ul>
				</section>
			{/if}

			{#if supporting.length}
				<section id="cast">
					<h2>{leads.length ? 'Supporting cast' : 'Characters'}</h2>
					<ul class="cast">
						{#each supporting as c (c.name)}
							{@render person(c)}
						{/each}
					</ul>

					{#if outline.returning?.length}
						<h3 class="sub">Returning</h3>
						{@render notes(outline.returning)}
					{/if}
				</section>
			{/if}

			{#if creeds.length}
				<section id="creeds">
					<h2>Where they stand</h2>
					<p class="lede">
						Each player’s position and private want, with how far the sources back the characterisation.
					</p>
					<ul class="creeds">
						{#each creeds as c (c.name)}
							{#if c.creed}
								<li style:--c={c.hex}>
									<div class="creed-head">
										<span class="swatch"></span>
										<b>{c.name}</b>
										<span class="stance">{c.creed.stance}</span>
										<span class={`verdict ${c.creed.verdict}`}>{VERDICT[c.creed.verdict]}</span>
									</div>
									<p class="creed-wants">{c.creed.wants}</p>
									<p class="creed-history">{c.creed.history}</p>
								</li>
							{/if}
						{/each}
					</ul>
				</section>
			{/if}

			{#if outline.bonds.length}
				<section id="bonds">
					<h2>Bonds</h2>
					<ul class="bonds">
						{#each outline.bonds as b (b.a + b.b)}
							<li>
								<h3>{b.a} <span class="amp">&amp;</span> {b.b}</h3>
								<p class="kind">{b.kind}</p>
								<p>{b.body}</p>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if outline.quotes.length}
				<section id="quotes">
					<h2>Quotes</h2>
					<ul class="quotes">
						{#each outline.quotes as q (q.text)}
							<li>
								<blockquote>
									{#if q.original}<p class="original">{q.original}</p>{/if}
									<p>“{q.text}”</p>
								</blockquote>
								<p class="cite">{q.who}{q.source ? ` · ${q.source}` : ''}</p>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			<section id="chapters">
				<h2>Chapters</h2>
				<p class="lede">
					Each episode opens on one short hook line and ends on a bold next-episode card. † marks a named death;
					flashbacks are told as memory inside the episode around them.
				</p>
				{#each numbered as part (part.id)}
					<section class="part">
						<header class="part-head">
							<h3>{part.title} <span class="ko">{part.ko}</span></h3>
							<span class="years">{part.years}</span>
						</header>
						<p class="part-summary">{part.summary}</p>
						<ol class="episodes">
							{#each part.episodes as ep (ep.n)}
								<li class="episode" class:flashback={ep.flashback}>
									<details>
										<summary>
											<span class="n">{String(ep.n).padStart(2, '0')}</span>
											<span class="ep-title">
												{ep.title}{#if ep.death}<span class="dagger" title={`${ep.death} dies`}>†</span>{/if}
												{#each ep.kinds ?? [] as k (k)}
													<span
														class="kind material-symbols-outlined"
														style:color={EPISODE_KIND_META[k].color}
														title={EPISODE_KIND_META[k].label}
														aria-label={EPISODE_KIND_META[k].label}
														role="img">{EPISODE_KIND_META[k].icon}</span
													>
												{/each}
												{#if (stillsByEpisode.get(ep.title)?.length ?? 0) > 0}
													<span class="kind material-symbols-outlined still-mark" title="Has stills" aria-label="Has stills" role="img"
														>image</span
													>
												{/if}
												<span class="ko">{ep.ko}</span>
											</span>
											<span class="years">{ep.year}</span>
										</summary>
										<div class="ep-body">
											{#each stillsByEpisode.get(ep.title) ?? [] as still (still.src)}
												<figure class="ep-still">
													<img src={staticAsset(still.src)} alt={still.alt} loading="lazy" />
													<figcaption>
														{#if still.nsfw}<span class="tag">intimate</span>{/if}
														{still.caption}
													</figcaption>
												</figure>
											{/each}
											<p class="hook">{ep.hook}</p>
											<ul class="beats">
												{#each ep.beats as beat, i (i)}
													<li>{beat}</li>
												{/each}
											</ul>
											<p class="next"><b>{ep.next}</b></p>
										</div>
									</details>
								</li>
							{/each}
						</ol>
					</section>
				{/each}
			</section>

			{#if outline.arcs.length}
				<section id="arcs">
					<h2>Arcs</h2>
					<ul class="arcs">
						{#each outline.arcs as a (a.who)}
							<li>
								<h3>{a.who}</h3>
								<ol class="steps">
									{#each a.steps as step, i (i)}
										<li>{step}</li>
									{/each}
								</ol>
								<p class="mirror">Mirror: {a.mirror}</p>
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if outline.themes.length}
				<section id="themes">
					<h2>Themes</h2>
					{@render notes(outline.themes)}
				</section>
			{/if}

			{#if legends.length}
				<section id="legends">
					<h2>Legends</h2>
					<p class="lede">The era’s cultural lexicon: the dead kings, gods and prophecies every character already knows.</p>
					{@render lore(legends)}
				</section>
			{/if}

			{#if concepts.length}
				<section id="concepts">
					<h2>Concepts</h2>
					<p class="lede">The institutions and terms of art the drama runs on.</p>
					{@render lore(concepts)}
				</section>
			{/if}

			{#if outline.plants.length}
				<section id="plants">
					<h2>Plants and payoffs</h2>
					<table class="table">
						<thead>
							<tr><th>Plant</th><th>Payoff</th></tr>
						</thead>
						<tbody>
							{#each outline.plants as p (p.plant)}
								<tr><td>{p.plant}</td><td>{p.payoff}</td></tr>
							{/each}
						</tbody>
					</table>
				</section>
			{/if}

			{#if outline.timeline.length}
				<section id="timeline">
					<h2>Timeline</h2>
					<ol class="timeline">
						{#each outline.timeline as e (e.year + e.text)}
							<li><span class="years">{e.year}</span><span>{e.text}</span></li>
						{/each}
					</ol>
				</section>
			{/if}

			<section id="research">
				<h2>Research</h2>
				{#if outline.sources.length}
					<h3 class="sub">Sources</h3>
					{@render notes(outline.sources)}
				{/if}
				{#if outline.research.length}
					<h3 class="sub">The world</h3>
					{@render notes(outline.research)}
				{/if}
				{#if outline.contested.length}
					<h3 class="sub">Contested or legendary</h3>
					<ul class="plain">
						{#each outline.contested as c (c)}
							<li>{c}</li>
						{/each}
					</ul>
				{/if}
				{#if outline.invented.length}
					<h3 class="sub">Invented for the book</h3>
					<ul class="plain">
						{#each outline.invented as c (c)}
							<li>{c}</li>
						{/each}
					</ul>
				{/if}
			</section>

			{#if outline.places.length}
				<section id="places">
					<h2>Places</h2>
					<table class="table">
						<thead>
							<tr><th>Place</th><th>Today</th><th>In the story</th></tr>
						</thead>
						<tbody>
							{#each outline.places as p (p.name)}
								<tr>
									<td><b>{p.name}</b> {#if p.ko}<span class="ko">{p.ko}</span>{/if}</td>
									<td>{p.now}</td>
									<td>{p.note}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
			{/if}

			{#if outline.production.length}
				<section id="production">
					<h2>Production</h2>
					{@render notes(outline.production)}
				</section>
			{/if}

			{#if outline.altTitles.length}
				<section id="titles">
					<h2>Other titles</h2>
					<dl class="notes">
						{#each outline.altTitles as t (t.title)}
							<dt>{t.title} {#if t.ko}<span class="ko">{t.ko}</span>{/if}</dt>
							<dd>{t.note}</dd>
						{/each}
					</dl>
				</section>
			{/if}
		</article>
	</div>
</main>

<style>
	.outline {
		min-height: 100dvh;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(5rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		color: var(--fg);
	}

	.hero {
		max-width: calc(var(--script-measure) + 14rem);
		margin: 1rem auto 0;
	}

	.hero img {
		display: block;
		width: 100%;
		aspect-ratio: 2;
		object-fit: cover;
		border-radius: 0.75rem;
	}

	.layout {
		display: grid;
		gap: 3rem;
		max-width: calc(var(--script-measure) + 14rem);
		margin-inline: auto;
	}

	.toc ol {
		display: none;
	}

	.back {
		display: inline-block;
		margin-top: 1.5rem;
	}

	@media (min-width: 64rem) {
		.layout {
			grid-template-columns: 10rem minmax(0, 1fr);
		}

		.toc {
			position: sticky;
			top: 6rem;
			align-self: start;
			margin-top: 3.4rem;
		}

		.back {
			margin: 0 0 1.25rem;
		}

		.toc ol {
			display: grid;
			gap: 0.45rem;
			margin: 0;
			padding: 0;
			list-style: none;
		}
	}

	.toc a {
		font-family: var(--ui);
		font-size: 0.82rem;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
		text-decoration: none;
	}

	.toc a:hover {
		color: var(--fg-strong);
	}

	.column {
		min-width: 0;
		max-width: var(--script-measure);
	}

	section {
		scroll-margin-top: 5rem;
	}

	.eyebrow {
		margin: 2rem 0 0.6rem;
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h1 {
		margin: 0 0 0.5rem;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 500;
		line-height: 1.05;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	.ko {
		font-family: var(--ui);
		font-size: 0.62em;
		font-weight: 400;
		color: var(--fg-faint);
		letter-spacing: 0;
	}

	.tagline {
		margin: 0 0 0.35rem;
		font-family: var(--ui);
		font-size: 0.95rem;
		color: var(--fg-strong);
	}

	.meta {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.85rem;
		color: var(--fg-faint);
	}

	.logline {
		margin: 1.5rem 0 0;
	}

	.opening {
		margin: 1.5rem 0 0;
		padding-left: 1rem;
		border-left: 2px solid var(--accent);
		font-family: var(--serif);
		font-size: 1.3rem;
		font-style: italic;
		line-height: 1.4;
		color: var(--fg-strong);
	}

	h2 {
		margin: 4rem 0 1rem;
		padding-top: 2rem;
		border-top: 1px solid var(--hairline);
		font-family: var(--serif);
		font-size: 1.6rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		color: var(--fg-strong);
	}

	h3 {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-strong);
	}

	.sub {
		margin: 2.25rem 0 0.75rem;
	}

	p,
	dd,
	li,
	td {
		font-size: 1rem;
		font-weight: var(--weight-body);
		line-height: 1.6;
		letter-spacing: var(--tracking-body);
		color: var(--fg-dim);
	}

	section > p {
		margin: 0 0 0.9rem;
	}

	.lede {
		font-size: 0.9rem;
	}

	.notes {
		margin: 0;
	}

	.notes dt {
		margin: 1.4rem 0 0.3rem;
		font-family: var(--ui);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.notes dd {
		margin: 0 0 0.6rem;
	}

	.stills {
		display: grid;
		gap: 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stills figure {
		margin: 0;
	}

	.stills img {
		display: block;
		width: 100%;
		aspect-ratio: 2;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.stills figcaption {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	.stills figcaption .years {
		margin-right: 0.4rem;
	}

	.sobriquets {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin: 0.35rem 0 0.1rem;
		padding: 0;
		list-style: none;
	}

	.sobriquets li {
		padding: 0.05rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--c) 40%, var(--hairline));
		border-radius: 999px;
		font-family: var(--ui);
		font-size: 0.75rem;
		color: var(--fg-dim);
	}

	.creeds {
		display: grid;
		gap: 1.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.creeds li {
		padding-left: 0.9rem;
		border-left: 2px solid var(--c);
	}

	.creed-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.3rem 0.6rem;
		font-family: var(--ui);
	}

	.creed-head b {
		color: var(--fg-strong);
	}

	.stance {
		font-family: var(--serif);
		font-style: italic;
		color: var(--fg-strong);
	}

	.verdict {
		margin-left: auto;
		padding: 0.05rem 0.5rem;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.verdict.backed {
		color: #3f9a5a;
		background: color-mix(in srgb, #3f9a5a 14%, transparent);
	}

	.verdict.partly {
		color: #c08a2a;
		background: color-mix(in srgb, #c08a2a 14%, transparent);
	}

	.verdict.dramatized {
		color: #c0504a;
		background: color-mix(in srgb, #c0504a 14%, transparent);
	}

	.creed-wants {
		margin: 0.3rem 0 0.25rem;
		color: var(--fg-strong);
	}

	.creed-history {
		margin: 0;
		font-size: 0.92rem;
		color: var(--fg-dim);
	}

	.lore {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 1rem 1.5rem;
		margin: 0;
	}

	.lore dt {
		font-family: var(--ui);
		font-weight: 600;
		color: var(--fg-strong);
	}

	.lore dt .ko {
		margin-left: 0.4rem;
		font-weight: 400;
		font-size: 0.85em;
		color: var(--fg-faint);
	}

	.lore dd {
		margin: 0.2rem 0 0;
		font-size: 0.92rem;
		color: var(--fg-dim);
	}

	.section-head {
		display: flex;
		align-items: last baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.maps {
		display: grid;
		gap: 2rem;
	}

	.tag {
		display: inline-block;
		margin-right: 0.4rem;
		padding: 0.05rem 0.4rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		vertical-align: 0.1em;
		color: var(--fg-faint);
	}

	.episode.flashback .ep-title {
		font-style: italic;
	}

	.episode.flashback .tag {
		color: var(--accent);
		border-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}

	.leads {
		gap: 2.25rem;
	}

	.person.lead {
		grid-template-columns: 7.5rem minmax(0, 1fr);
		gap: 1.4rem;
		padding: 1.25rem;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--c) 7%, transparent);
		border: 1px solid color-mix(in srgb, var(--c) 30%, var(--hairline));
	}

	.person.lead .avatar {
		width: 7.5rem;
		height: 7.5rem;
		border-width: 2px;
	}

	.person.lead h3 {
		font-size: 1.35rem;
	}

	.person.lead .epithet {
		font-size: 1.1rem;
	}

	@media (max-width: 560px) {
		.person.lead {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	.part {
		margin-top: 2.5rem;
	}

	.part-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.part-head h3 {
		font-family: var(--serif);
		font-size: 1.25rem;
		font-weight: 500;
	}

	.years {
		flex: none;
		font-family: var(--ui);
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.part-summary {
		margin: 0.4rem 0 0.9rem;
	}

	.episodes {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--hairline);
	}

	.episode {
		border-bottom: 1px solid var(--hairline);
	}

	summary {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 0.75rem;
		padding: 0.75rem 0;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.n {
		font-family: var(--ui);
		font-size: 0.75rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.ep-title {
		font-family: var(--ui);
		font-size: 0.98rem;
		font-weight: 500;
		color: var(--fg-strong);
	}

	.ep-title .ko {
		margin-left: 0.4rem;
		font-size: 0.8em;
	}

	.dagger {
		margin-left: 0.2rem;
		color: var(--accent);
	}

	details[open] summary .ep-title {
		font-weight: 600;
	}

	.ep-body {
		padding: 0 0 1.1rem 2.75rem;
	}

	.kind {
		margin-left: 0.3rem;
		font-size: 1rem;
		vertical-align: -0.18em;
	}

	.still-mark {
		color: var(--fg-faint);
	}

	.ep-still {
		margin: 0.2rem 0 0.9rem;
	}

	.ep-still img {
		display: block;
		width: 100%;
		aspect-ratio: 2;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.ep-still figcaption {
		margin-top: 0.4rem;
		font-size: 0.88rem;
		color: var(--fg-dim);
	}

	.hook {
		margin: 0 0 0.6rem;
		font-family: var(--serif);
		font-size: 1.08rem;
		font-style: italic;
		color: var(--fg-strong);
	}

	.beats {
		margin: 0 0 0.75rem;
		padding-left: 1.1rem;
	}

	.beats li {
		margin-bottom: 0.3rem;
		font-size: 0.95rem;
	}

	.next {
		margin: 0;
		font-size: 0.92rem;
	}

	.next b {
		color: var(--fg-strong);
	}

	.cast,
	.bonds,
	.quotes,
	.arcs {
		display: grid;
		gap: 1.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.person {
		display: grid;
		grid-template-columns: 4.5rem minmax(0, 1fr);
		gap: 1rem;
	}

	.avatar {
		display: grid;
		place-items: center;
		width: 4.5rem;
		height: 4.5rem;
		overflow: hidden;
		border-radius: 50%;
		background: color-mix(in srgb, var(--c) 18%, transparent);
		border: 1px solid color-mix(in srgb, var(--c) 45%, var(--hairline));
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 12%;
	}

	.avatar span {
		font-family: var(--serif);
		font-size: 1.6rem;
		color: var(--fg-strong);
	}

	.person h3 .ko {
		margin-left: 0.35rem;
		font-size: 0.85em;
	}

	.epithet {
		margin: 0.1rem 0 0;
		font-family: var(--serif);
		font-style: italic;
		font-size: 0.98rem;
		color: var(--fg-strong);
	}

	.person-meta {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin: 0.15rem 0 0.5rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	.swatch {
		flex: none;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 50%;
		background: var(--c);
	}

	.line {
		margin: 0 0 0.6rem;
		padding-left: 0.75rem;
		border-left: 2px solid var(--c);
		font-family: var(--serif);
		font-size: 0.98rem;
		line-height: 1.5;
		color: var(--fg-strong);
	}

	.person dl {
		display: grid;
		grid-template-columns: 4rem minmax(0, 1fr);
		gap: 0.3rem 0.75rem;
		margin: 0;
	}

	.person dt {
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1.6rem;
		color: var(--fg-faint);
	}

	.person dd {
		margin: 0;
		font-size: 0.93rem;
	}

	.amp {
		color: var(--fg-faint);
		font-weight: 400;
	}

	.kind {
		margin: 0.1rem 0 0.35rem;
		font-family: var(--serif);
		font-style: italic;
		color: var(--accent);
	}

	.bonds p {
		margin-bottom: 0;
	}

	.quotes blockquote {
		margin: 0;
	}

	.quotes blockquote p {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.15rem;
		line-height: 1.45;
		color: var(--fg-strong);
	}

	.quotes .original {
		margin-bottom: 0.3rem;
		font-size: 1rem;
		color: var(--fg-dim);
	}

	.cite {
		margin: 0.35rem 0 0;
		font-family: var(--ui);
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	.steps {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin: 0.5rem 0;
		padding: 0;
		list-style: none;
	}

	.steps li {
		padding: 0.2rem 0.6rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		font-family: var(--ui);
		font-size: 0.8rem;
		line-height: 1.5;
	}

	.mirror {
		margin: 0;
		font-size: 0.9rem;
	}

	.table {
		width: 100%;
		border-collapse: collapse;
	}

	.table th {
		padding: 0.5rem 0.75rem 0.5rem 0;
		border-bottom: 1px solid var(--hairline);
		font-family: var(--ui);
		font-size: 0.75rem;
		font-weight: 600;
		text-align: left;
		color: var(--fg-faint);
	}

	.table td {
		padding: 0.6rem 0.75rem 0.6rem 0;
		border-bottom: 1px solid var(--hairline);
		font-size: 0.92rem;
		vertical-align: top;
	}

	.table td b {
		font-weight: 600;
		color: var(--fg-strong);
	}

	.timeline {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.timeline li {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr);
		gap: 0.75rem;
		padding: 0.4rem 0;
		border-bottom: 1px solid var(--hairline);
		font-size: 0.93rem;
	}

	.timeline .years {
		line-height: 1.6rem;
	}

	.plain {
		margin: 0;
		padding-left: 1.1rem;
	}

	.plain li {
		margin-bottom: 0.4rem;
		font-size: 0.95rem;
	}
</style>
