<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { chapters } from '$lib/story';
	import { reveal } from '$lib/reveal';
	import ImageStack from '$lib/components/ImageStack.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import Toc from '$lib/components/Toc.svelte';
	import PersonLayer from '$lib/components/PersonLayer.svelte';
	import Hud from '$lib/components/Hud.svelte';
	import SpeakerPlate from '$lib/components/SpeakerPlate.svelte';
	import StoryMap from '$lib/components/StoryMap.svelte';
	import RelationChart from '$lib/components/RelationChart.svelte';
	import { ENTRY_PLACE } from '$lib/places';
	import { buildBeats } from '$lib/beats';
	import { loadMode, watchReading } from '$lib/reading.svelte';
	import { flagOf, flagSrc } from '$lib/flags';
	import { onMount } from 'svelte';
	import type { Chapter, Entry, StackImage } from '$lib/story';

	onMount(() => {
		/* Sync saved mode (or immersive default) onto <html> before the watcher. */
		loadMode();
		return watchReading();
	});

	/**
	 * The year each entry is "set in", used to derive ages in the prose.
	 * Entries labelled only "March" / "October" inherit the previous entry's
	 * year; a chapter that opens that way falls back to its range start.
	 */
	function entryYears(ch: Chapter): (number | null)[] {
		const fallback = Number(ch.range?.match(/-?\d+/)?.[0]) || null;
		let last: number | null = fallback;
		return ch.entries.map((en) => {
			const n = Number(en.year);
			if (en.year.trim() !== '' && Number.isFinite(n)) last = n;
			return last;
		});
	}

	/** Flatten beat-anchored images into one sticky stack, tagged with beatIndex. */
	function stackImages(entry: Entry): StackImage[] {
		return buildBeats(entry).flatMap((beat, bi) =>
			beat.images.map((im) => ({ ...im, beatIndex: bi }))
		);
	}

	const yearsByChapter = new Map(chapters.map((ch) => [ch.id, entryYears(ch)]));

	/** TOC open — desktop main shifts by --toc-w; narrow keeps overlay. */
	let tocOpen = $state(false);
</script>

<svelte:head>
	<title>King for All 삼한왕검</title>
	<meta
		name="description"
		content="King for All (삼한왕검) — a scrolling chronicle of 7th-century East Asia, at the end of the Three Kingdoms Period."
	/>
</svelte:head>

<Toc bind:open={tocOpen} />
<PersonLayer />
<Hud />
<SpeakerPlate />
<RelationChart />
<StoryMap />

<main class:toc-open={tocOpen}>
	<!-- ————— cover ————— -->
	<header class="cover">
		<div class="cover-mark" use:reveal aria-hidden="true"></div>
		<h1 class="cover-title" use:reveal={80}>King for All</h1>
		<p class="cover-ko" use:reveal={160}>삼한왕검</p>
		<h2 class="cover-subtitle" use:reveal={160}>A Story Told In Parts</h2>
		
		<div class="blurb" use:reveal={240}>
			<p>
				<em>King for All</em> is a story set in 7th-century Samhan, at the end of the Three
				Kingdoms Period.
			</p>
			<p>
				Inspired by the 2009 K-Drama series <em>The Great Queen Seondeok</em>, it was supposed to be
				a webcomic series originally, but I’m putting the text version on here first for now.
			</p>
			<p>
				One major theme of this story is political satire — highlighting the absurdities of the
				social systems of each of the Three Kingdoms, and how they ultimately led to tragic and
				avoidable events.
			</p>
			<p>
				When I was a child, I used to watch dramas and movies about this period, which naturally tend
				to romanticize the heroes and stories. However, as I grew older and did more research, it
				became increasingly clear how absurd many of the situations the people of the era found
				themselves in, actually were.
			</p>
			<p>
				It also speaks to many human flaws — every character is a unique product of their
				environment, and the course of the story makes it abundantly clear how each person’s life has
				shaped who they are.
			</p>
			<p class="sign">I hope you enjoy it!</p>
		</div>

		<span class="scroll-cue" use:reveal={340} aria-hidden="true">
			<span class="cue-line"></span>
		</span>
	</header>

	{#each chapters as chapter, ci (chapter.id)}
		{#if chapter.part}
			<section class="part-page" use:reveal>
				<span class="part-eyebrow">{chapter.part}</span>
				{#if chapter.partTitle}<h2 class="part-title">{chapter.partTitle}</h2>{/if}
				{#if chapter.partKorean}<p class="part-ko">{chapter.partKorean}</p>{/if}
				{#if chapter.partHanja}<p class="part-hanja">{chapter.partHanja}</p>{/if}
				<span class="part-rule" aria-hidden="true"></span>
			</section>
		{/if}
		<section class="chapter" id={chapter.id}>
			<header class="chapter-head">
				<div class="chapter-title">
					<h1>
						<span class="num">{ci + 1}</span>
						<span class="en">{chapter.title}</span>
						{#if chapter.hanja}<span class="hanja">{chapter.hanja}</span>{/if}
						{#if chapter.korean}<span class="ko">{chapter.korean}</span>{/if}
						<span class="range">{chapter.range}</span>
					</h1>
					<span class="rule" aria-hidden="true"></span>
				</div>
			</header>

			{#each chapter.entries as entry, i (chapter.id + i)}
				{@const years = yearsByChapter.get(chapter.id) ?? []}
				{@const beats = buildBeats(entry)}
				{@const images = stackImages(entry)}
				<article
					class="entry"
					class:flash={entry.flash}
					id="{chapter.id}-{i}"
					data-year={years[i]}
					data-flash={entry.flash ? '1' : undefined}
					data-music={entry.music ?? undefined}
					data-place={ENTRY_PLACE[entry.title] ?? undefined}
					style:--tone={entry.flashTone ?? '#8a8a94'}
				>
					<div class="meta">
						<div class="meta-sticky" use:reveal={{ y: 0 }}>
							<div class="side-chrome">
								<p class="chapter-label">
									<span class="num">{ci + 1}</span>
									<span class="dot" aria-hidden="true">·</span>
									<span class="name">{chapter.title}</span>
								</p>
								<p class="story-index">
									Story {i + 1} out of {chapter.entries.length}
								</p>
							</div>
							<div class="meta-row">
								<div class="year" class:long={entry.year.length > 4}>
									{entry.year}
									{#if entry.sub}<span class="year-sub">{entry.sub}</span>{/if}
								</div>
								<div class="episode">
									<h2 style:color={entry.accent}>{entry.title}</h2>
									{#if entry.subtitle}<p class="episode-ko">{entry.subtitle}</p>{/if}
									{#if entry.badges}
										<div class="badges">
											{#each entry.badges as badge, j (j)}
												{@const flag = flagOf(badge)}
												{#if flag}
													<span
														class="badge flag"
														use:reveal={60 + j * 55}
														title={flag}
													>
														<img src={flagSrc(flag)} alt="" />
													</span>
												{:else}
													<span class="badge" use:reveal={60 + j * 55}>{badge}</span>
												{/if}
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>

					<!-- text beats scroll; the image column sticks and swaps via IO -->
					<div class="beats">
						{#each beats as beat, bi (bi)}
							<div class="text" class:first={bi === 0} data-beat={bi} use:reveal={80}>
								<Blocks blocks={beat.blocks} year={years[i]} />
							</div>
						{/each}
					</div>

					{#if images.length}
						<aside class="images-col">
							<div class="images-sticky">
								<ImageStack {images} />
							</div>
						</aside>
					{/if}
				</article>
			{/each}
		</section>
	{/each}

	<footer class="colophon" use:reveal>
		<p>— to be continued —</p>
		<p class="colophon-links">
			<a href={resolve('/wiki')}>Encyclopedia</a>
		</p>
	</footer>

	{#if dev}
		<a class="edit-link" href={resolve('/edit')} title="Open the story editor">✎ Edit</a>
	{/if}
</main>

<style>
	main {
		padding-left: 22px; /* clear the fixed rail */
		transition: padding-left 260ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* Desktop: open TOC pushes the reading column (Notion-style), not overlay. */
	main.toc-open {
		padding-left: var(--toc-w);
	}

	@media (max-width: 1000px) {
		main.toc-open {
			padding-left: 22px;
		}
	}

	/* ————— Cover ————— */
	.cover {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 7rem 6rem 5rem 12%;
	}

	.cover-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 52px;
		line-height: 1;
		letter-spacing: -3px;
	}

	.cover-subtitle {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 24px;
		letter-spacing: -1px;
		color: rgba(white, .3);
	}

	.cover-ko {
		margin: 0.6rem 0 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: 24px;
		letter-spacing: -.5px;
		color: var(--fg);
	}

	.blurb {
		margin-top: 3.2rem;
		max-width: 34rem;
	}

	.blurb p {
		margin: 0 0 1.15rem;
		font-size: 0.9rem;
		font-weight: 100 !important;
		line-height: 1.72;
		color: var(--fg-dim);
	}

	.blurb em {
		font-style: italic;
		font-weight: 500;
		color: var(--fg);
	}

	.blurb .sign {
		margin-top: 1.6rem;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.05rem;
		color: var(--gold);
	}

	/* a quiet "keep going" hint */
	.scroll-cue {
		margin-top: 3.5rem;
		display: block;
		width: 1px;
		height: 3.5rem;
		overflow: hidden;
		background: var(--hairline);
	}

	.cue-line {
		display: block;
		width: 1px;
		height: 45%;
		background: var(--gold);
		animation: drip 2.6s var(--ease) infinite;
	}

	@keyframes drip {
		0% {
			transform: translateY(-100%);
		}
		60%,
		100% {
			transform: translateY(340%);
		}
	}

	/* ————— Part title page: a held breath between acts ————— */
	.part-page {
		min-height: 62vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 6rem 6rem 4.5rem 12%;
	}

	.part-eyebrow {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.38em;
		text-transform: uppercase;
		color: var(--gold);
		margin-bottom: 1.1rem;
	}

	.part-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(1.7rem, 3.4vw, 2.7rem);
		line-height: 1;
		letter-spacing: -0.03em;
	}

	.part-ko,
	.part-hanja {
		margin: 0;
		font-family: 'Noto Serif KR', serif;
		font-weight: 500;
		line-height: 1.25;
		letter-spacing: 0.01em;
	}

	.part-ko {
		margin-top: 0.5rem;
		font-size: clamp(0.95rem, 1.7vw, 1.25rem);
		color: #fffdf8;
	}

	.part-hanja {
		font-size: clamp(0.85rem, 1.4vw, 1.05rem);
		color: var(--gold);
		opacity: 0.75;
	}

	/* ————— Chapter opener: scrolls with the page (sticky chrome lives in .meta) ————— */
	.chapter-head {
		padding: 1.35rem 3rem 1.1rem;
	}

	.chapter-title {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.chapter-title h1 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(1.1rem, 2.1vw, 1.6rem);
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		white-space: nowrap;
		display: flex;
		align-items: baseline;
		gap: 0.55em;
		color: #fffdf8;
	}

	.chapter-title .num {
		font-variant-numeric: tabular-nums;
		color: var(--gold);
		font-weight: 500;
	}

	.chapter-title .num::after {
		content: ' ·';
		color: var(--fg-faint);
		font-weight: 400;
	}

	.chapter-title .hanja,
	.chapter-title .ko {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 0.8em;
		color: var(--gold);
		letter-spacing: 0;
	}

	.chapter-title .range {
		font-weight: 500;
		font-size: 0.78em;
		color: var(--fg-faint);
		letter-spacing: 0.02em;
	}
	/* ————— Entry: (sticky) year + episode | text beats | sticky images ————— */
	.entry {
		position: relative;
		display: grid;
		grid-template-columns: 16rem minmax(0, 1fr) minmax(260px, 32%);
		grid-auto-rows: min-content;
		gap: 0 3.75rem;
		padding: 0 0 7rem 3rem;
		scroll-margin-top: 1.5rem;
	}

	/* marker + art columns span the full entry so sticky inners can travel with it */
	.meta {
		grid-column: 1;
		grid-row: 1 / -1;
		height: 100%;
	}

	.beats {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
	}

	.images-col {
		grid-column: 3;
		grid-row: 1 / -1;
		align-self: stretch;
		min-width: 0;
	}

	.images-sticky {
		position: sticky;
		top: 1.5rem;
		height: calc(100vh - 3rem);
		display: flex;
		align-items: center;
		padding-top: 2.1rem;
	}

	/* Side chrome only: chapter label + story counter + year/title stick here */
	.meta-sticky {
		position: sticky;
		top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		padding: 1.5rem 0 1rem;
		background: linear-gradient(
			to bottom,
			var(--bg) 0%,
			var(--bg) 72%,
			transparent 100%
		);
	}

	.side-chrome {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
		max-width: 14rem;
	}

	.chapter-label {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: 0.78rem;
		line-height: 1.25;
		letter-spacing: var(--tracking-micro);
		color: var(--fg-dim);
	}

	.chapter-label .num {
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.chapter-label .dot {
		margin: 0 0.28em;
		color: var(--fg-faint);
	}

	.chapter-label .name {
		color: #fffdf8;
	}

	.story-index {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.meta-row {
		display: flex;
		gap: 1.4rem;
	}

	.year {
		font-family: var(--serif);
		font-weight: 500;
		font-size: 2.3rem;
		line-height: 0.9;
		letter-spacing: var(--tracking-display);
		display: flex;
		flex-direction: column;
		color: #fffdf8;
	}

	/* "March", "October" — month-only markers get a smaller face */
	.year.long {
		font-size: 1.35rem;
		line-height: 1;
	}

	/* ————— Flashback entries —————
	   The page background itself drops to black (see watchReading); the entry
	   only carries a thin tinted edge so you can see where the past begins. */
	.entry.flash {
		padding-top: 2.4rem;
		padding-bottom: 3.4rem;
		margin-bottom: 1.4rem;
		border-block: 1px solid color-mix(in srgb, var(--tone) 22%, transparent);
	}

	.entry.flash::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: color-mix(in srgb, var(--tone) 7%, transparent);
	}

	.entry.flash > * {
		position: relative;
	}

	.entry.flash .meta-sticky {
		background: transparent;
	}

	.year-sub {
		font-family: var(--sans);
		font-size: 0.82rem;
		font-weight: 400;
		letter-spacing: var(--tracking-micro);
		margin-top: 0.45rem;
		color: var(--fg-faint);
	}

	.episode h2 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1.06rem;
		line-height: 1.08;
		letter-spacing: var(--tracking-display);
		max-width: 9em;
		color: #fffdf8;
	}

	.episode-ko {
		margin: 0.28rem 0 0;
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--fg-dim);
	}

	.badges {
		display: flex;
		gap: 0.35rem;
		margin-top: 0.6rem;
	}

	.badge {
		display: inline-grid;
		place-items: center;
		min-width: 1.7rem;
		height: 1.45rem;
		padding: 0 0.3rem;
		font-size: 0.9rem;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid var(--hairline);
		border-radius: 0.3rem;
		transition:
			transform 0.3s var(--ease),
			background 0.3s var(--ease);
	}

	.badge.flag {
		padding: 0;
		overflow: hidden;
		width: 2.1rem;
		min-width: 2.1rem;
		height: 1.4rem;
		background: transparent;
	}

	.badge.flag img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.badge:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.12);
	}

	.badge.flag:hover {
		background: transparent;
		filter: brightness(1.08);
	}

	.text {
		padding: 0;
	}

	.text.first {
		padding-top: 2.1rem;
	}

	.edit-link {
		position: fixed;
		right: 1.2rem;
		bottom: 1.2rem;
		z-index: 70;
		font-size: 0.82rem;
		letter-spacing: var(--tracking-micro);
		text-decoration: none;
		color: var(--fg-dim);
		background: var(--glass);
		backdrop-filter: blur(14px);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		padding: 0.45rem 0.95rem;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			transform 0.25s var(--ease);
	}

	.edit-link:hover {
		color: #fff;
		border-color: rgba(216, 178, 106, 0.5);
		transform: translateY(-2px);
	}

	.colophon {
		padding: 7rem 0 9rem;
		text-align: center;
		font-family: var(--serif);
		font-style: italic;
		font-size: 1.05rem;
		letter-spacing: 0.06em;
		color: var(--fg-faint);
	}

	.colophon-links {
		margin: 1.1rem 0 0;
		font-style: normal;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.colophon-links a {
		color: var(--fg-dim);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease);
	}

	.colophon-links a:hover {
		color: var(--gold);
		border-color: rgba(216, 178, 106, 0.45);
	}

	/* ————— Small screens: a TikTok-style snap feed ————— */
	@media (max-width: 820px) {
		main,
		main.toc-open {
			padding-left: 0;
			padding-right: 0;
			overflow-x: clip;
			/* each entry is a "card" the scroll settles onto */
			scroll-snap-type: y proximity;
		}

		.cover {
			min-height: 100dvh;
			padding: max(4.5rem, calc(env(safe-area-inset-top, 0px) + 3.4rem))
				max(1.15rem, env(safe-area-inset-right, 0px)) 3rem
				max(1.15rem, env(safe-area-inset-left, 0px));
			scroll-snap-align: start;
		}

		.cover-title {
			font-size: clamp(2.1rem, 9vw, 2.8rem);
			letter-spacing: -0.04em;
		}

		.blurb {
			margin-top: 2rem;
			max-width: 36rem;
		}

		.part-page {
			min-height: 72dvh;
			padding: 3.5rem max(1.15rem, env(safe-area-inset-right, 0px)) 2.5rem
				max(1.15rem, env(safe-area-inset-left, 0px));
			scroll-snap-align: start;
		}

		/* Chapter opener scrolls away; sticky chrome lives in the side meta on desktop.
		   Extra top padding clears the fixed HUD when the opener is in view. */
		.chapter-head {
			padding: max(3.1rem, calc(env(safe-area-inset-top, 0px) + 2.6rem))
				max(1.15rem, env(safe-area-inset-right, 0px)) 0.35rem
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.chapter-title h1 {
			white-space: normal;
			flex-wrap: wrap;
			gap: 0.3em;
			font-size: 0.95rem;
		}

		.chapter-title .rule {
			display: none;
		}

		/* one entry = one card: compact art, then title, then text */
		.entry {
			display: flex;
			flex-direction: column;
			min-height: 0;
			padding: 0 0 3.5rem;
			scroll-snap-align: start;
			scroll-snap-stop: always;
		}

		/* Immersive glides a tapped line into the reading band; snap points
		   would drag that scroll back to the top of the entry. Extra foot room
		   keeps the last lines above the speaker plate. */
		:global(html.is-immersive) main {
			scroll-snap-type: none;
		}

		:global(html.is-immersive) .entry {
			scroll-snap-align: none;
			scroll-snap-stop: normal;
			padding-bottom: 1.25rem;
		}

		.entry.flash {
			padding-top: 0;
		}

		/* art leads the card, then title, then text — not sticky on narrow */
		.images-col {
			order: 1;
			margin: 0;
			max-width: 100%;
		}

		.images-sticky {
			position: static;
			height: auto;
			padding-top: 0;
			display: block;
		}

		.meta {
			order: 2;
			height: auto;
			padding: 1.15rem max(1.15rem, env(safe-area-inset-right, 0px)) 0
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.meta-sticky {
			position: static;
			padding: 0;
			gap: 0.65rem;
			background: none;
		}

		.meta-row {
			gap: 0.85rem;
			min-width: 0;
		}

		.side-chrome {
			max-width: none;
		}

		.year {
			font-size: 1.75rem;
			flex-shrink: 0;
		}

		.episode {
			min-width: 0;
		}

		.episode h2 {
			max-width: none;
			font-size: 1.02rem;
		}

		.beats {
			order: 3;
			min-width: 0;
		}

		.text {
			padding: 1.1rem max(1.15rem, env(safe-area-inset-right, 0px)) 0
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.colophon {
			padding: 4rem 1.15rem max(6rem, calc(env(safe-area-inset-bottom, 0px) + 4rem));
			scroll-snap-align: start;
		}

		.edit-link {
			right: max(0.7rem, env(safe-area-inset-right, 0px));
			bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
			min-height: 2.75rem;
			display: inline-grid;
			place-items: center;
		}

		:global(html.is-immersive) .edit-link {
			bottom: calc(var(--plate-h, 14rem) + 0.45rem);
		}
	}

	@media (max-width: 480px) {
		.cover-ko,
		.cover-subtitle {
			font-size: 1.05rem;
		}

		.year {
			font-size: 1.55rem;
		}

		.badges {
			flex-wrap: wrap;
		}
	}

	/* Snapping is a nice-to-have; never fight a reader who wants to scan. */
	@media (max-width: 820px) and (prefers-reduced-motion: reduce) {
		main {
			scroll-snap-type: none;
		}
	}

</style>
