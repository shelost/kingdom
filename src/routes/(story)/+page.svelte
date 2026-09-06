<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { chapters, isFlashEntry, entryId, partId } from '$lib/story';
	import { reveal } from '$lib/reveal';
	import ImageStack from '$lib/components/ImageStack.svelte';
	import PlaceBanner from '$lib/components/PlaceBanner.svelte';
	import PlaceMapTile from '$lib/components/PlaceMapTile.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import { ENTRY_PLACE } from '$lib/places';
	import { buildBeats } from '$lib/beats';
	import { filterNsfw } from '$lib/nsfwUi.svelte';
	import {
		reading,
		episodes,
		isInlineArt,
		loadMode,
		loadViewScope,
		stepEpisode,
		storyRoot,
		watchReading
	} from '$lib/reading.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { flagOf, flagSrc } from '$lib/flags';
	import { onMount } from 'svelte';
	import type { Chapter, Entry, StackImage } from '$lib/story';

	let episodesMode = $derived(reading.viewScope === 'episodes');
	let atFirstEpisode = $derived(reading.episodeIndex <= 0);
	let atLastEpisode = $derived(reading.episodeIndex >= episodes.length - 1);
	/* The mode is the layout: the script reads as a manuscript with its figures
	   in the flow and no location cards at all; immersion and cinema keep the
	   sticky stage column beside the text. */
	let inlineImages = $derived(isInlineArt(reading.mode));
	let sideImages = $derived(!inlineImages);

	onMount(() => {
		/* Sync saved mode / view onto state before the watcher. */
		loadMode();
		loadViewScope();
		const stopReading = watchReading();

		/** Chrome waits until cover + blurb are behind the reader. */
		const scriptEl = storyRoot();
		const syncInScript = () => {
			if (!scriptEl) {
				scriptUi.inScript = true;
				return;
			}
			/* A TOC jump can briefly look like cover until the measured-Y scroll
			   lands — keep chrome up so the panel does not retract. */
			if (tocUi.jumping) {
				scriptUi.inScript = true;
				return;
			}
			/* True once any of the script has entered the viewport from below. */
			scriptUi.inScript = scriptEl.getBoundingClientRect().top < window.innerHeight * 0.92;
		};

		syncInScript();
		requestAnimationFrame(syncInScript);

		window.addEventListener('scroll', syncInScript, { passive: true });
		window.addEventListener('resize', syncInScript);

		return () => {
			stopReading();
			window.removeEventListener('scroll', syncInScript);
			window.removeEventListener('resize', syncInScript);
			scriptUi.inScript = false;
		};
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
			filterNsfw(beat.images).map((im) => ({ ...im, beatIndex: bi }))
		);
	}

	const yearsByChapter = new Map(chapters.map((ch) => [ch.id, entryYears(ch)]));
</script>

<svelte:head>
	<title>King for All 삼한왕검</title>
	<meta
		name="description"
		content="King for All (삼한왕검) by Heewon Ahn — a three-generation chronicle of 7th-century Samhan, at the end of the Three Kingdoms Period."
	/>
</svelte:head>

<main>
	<!-- ————— cover: brand only ————— -->
	<header class="cover">
		<div class="cover-mark" use:reveal aria-hidden="true"></div>
		<h1 class="cover-title" use:reveal={80}>King for All</h1>
		<p class="cover-ko" use:reveal={160}>삼한왕검</p>
		<h2 class="cover-subtitle" use:reveal={160}>A Story Told In Parts</h2>
		<p class="cover-author" use:reveal={180}>Heewon Ahn · 안희원</p>

		<span class="scroll-cue" use:reveal={280} aria-hidden="true">
			<span class="cue-line"></span>
		</span>
	</header>

	<!-- ————— blurb: standalone full-viewport screen ————— -->
	<section class="blurb-page" aria-label="About this story">
		<div class="blurb" use:reveal={80}>
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

		<span class="scroll-cue" use:reveal={200} aria-hidden="true">
			<span class="cue-line"></span>
		</span>
	</section>

	<!-- Script: chapters after cover + blurb — fixed chrome waits on this region. -->
	<div
		data-story-root
		class="script"
		class:episodes={episodesMode}
		class:images-inline={inlineImages}
	>
		{#each chapters as chapter, ci (chapter.id)}
				{#if chapter.part}
					<section class="part-page" data-story-id={partId(chapter.id)} use:reveal>
						<span class="part-eyebrow">{chapter.part}</span>
						{#if chapter.partTitle}<h2 class="part-title">{chapter.partTitle}</h2>{/if}
						{#if chapter.partKorean}<p class="part-ko">{chapter.partKorean}</p>{/if}
						{#if chapter.partHanja}<p class="part-hanja">{chapter.partHanja}</p>{/if}
						<span class="part-rule" aria-hidden="true"></span>
					</section>
				{/if}
				<section class="chapter" data-story-id={chapter.id}>
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
							{@const beats = buildBeats(entry).map((beat) => ({
								...beat,
								images: filterNsfw(beat.images)
							}))}
							{@const images = stackImages(entry)}
							{@const eid = entryId(chapter.id, entry.title)}
							<article
								class="entry"
								class:flash={isFlashEntry(entry)}
								data-story-id={eid}
								data-year={years[i]}
								data-flash={isFlashEntry(entry) ? '1' : undefined}
								data-music={entry.music ?? undefined}
								data-place={ENTRY_PLACE[entry.title] ?? undefined}
								style:--tone={entry.flashTone ?? '#8a8a94'}
							>
								<div class="content-col">
									<header class="entry-head">
										<div class="entry-head-sticky" use:reveal={{ y: 0 }}>
											<div class="head-top">
												<p class="chapter-label">
													<span class="num">{ci + 1}</span>
													<span class="dot" aria-hidden="true">·</span>
													<span class="name">{chapter.title}</span>
												</p>
												<p class="story-index">
													Story {i + 1} out of {chapter.entries.length}
												</p>
											</div>
											<div class="head-main">
												<div class="episode">
													<div class="year" class:long={entry.year.length > 4}>
														{entry.year}
														{#if entry.sub}<span class="year-sub">{entry.sub}</span>{/if}
													</div>
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
									</header>

									<!-- Side: sticky reel swaps from scrollY. Inline: art immediately before the beat it illustrates. -->
									<div class="beats">
									{#each beats as beat, bi (bi)}
										{#if inlineImages && beat.images.length}
											<!-- No reveal here: inline figures are part of the
											     manuscript, so they are simply present. -->
											<div class="inline-art">
												<ImageStack
													images={beat.images}
													inline
													priority={episodesMode ? bi === 0 : ci === 0 && i === 0 && bi === 0}
												/>
											</div>
										{/if}
										<div
											class="text"
											class:first={bi === 0}
											class:has-art={sideImages && beat.images.length > 0}
											data-beat={bi}
											style:--art-n={Math.max(1, beat.images.length)}
											use:reveal={80}
										>
											<Blocks
												blocks={beat.blocks}
												year={years[i]}
												idPrefix={eid}
												sceneFrom={entry.blocks}
											/>
										</div>
									{/each}
								</div>
								</div>

								<!-- The stage column belongs to the stage modes. The script
								     has no place banner and no map tile — only its own
								     figures, which ride inline with the prose. -->
								{#if sideImages && (images.length || ENTRY_PLACE[entry.title])}
									<aside class="images-col">
										<div class="images-sticky" class:has-banner={!!ENTRY_PLACE[entry.title]}>
											{#if ENTRY_PLACE[entry.title]}
												<div class="bento">
													<div class="bento-place">
														<PlaceBanner
															placeId={ENTRY_PLACE[entry.title]}
															priority={episodesMode || (ci === 0 && i === 0)}
														/>
													</div>
													<div class="bento-map">
														<PlaceMapTile placeId={ENTRY_PLACE[entry.title]} />
													</div>
												</div>
											{/if}
											{#if images.length}
												<div class="reel">
													<ImageStack {images} priority={episodesMode || (ci === 0 && i === 0)} />
												</div>
											{/if}
										</div>
									</aside>
								{/if}
							</article>
					{/each}
				</section>
		{/each}
	</div>

	<footer class="colophon" use:reveal>
		<p>— to be continued —</p>
		<p class="colophon-links">
			<a href={resolve('/wiki')}>Encyclopedia</a>
			<span aria-hidden="true">·</span>
			<a href={resolve('/images')}>Images</a>
		</p>
	</footer>

	<nav
		class="ep-nav"
		class:in={scriptUi.inScript && episodesMode}
		aria-label="Episode navigation"
		aria-hidden={!scriptUi.inScript || !episodesMode}
	>
		<button
			type="button"
			disabled={atFirstEpisode}
			tabindex={scriptUi.inScript && episodesMode && !atFirstEpisode ? 0 : -1}
			onclick={() => stepEpisode(-1)}
		>
			Prev
		</button>
		<span class="ep-count" aria-live="polite">
			{reading.episodeIndex + 1}
			<span class="ep-of">/</span>
			{episodes.length}
		</span>
		<button
			type="button"
			disabled={atLastEpisode}
			tabindex={scriptUi.inScript && episodesMode && !atLastEpisode ? 0 : -1}
			onclick={() => stepEpisode(1)}
		>
			Next
		</button>
	</nav>

	{#if dev}
		<a
			class="edit-link"
			class:in={scriptUi.inScript}
			href={resolve('/edit')}
			title="Open the story editor"
			aria-hidden={!scriptUi.inScript}
			tabindex={scriptUi.inScript ? 0 : -1}
		>✎ Edit</a>
	{/if}
</main>

<style>
	/* Shell padding / TOC shift live in (story)/+layout.svelte */

	/* ————— Cover + blurb: two full-viewport screens (no document snap) ————— */
	.cover,
	.blurb-page {
		min-height: 100vh;
		min-height: 100dvh;
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

	.cover-author {
		margin: 0.85rem 0 0;
		font-family: var(--serif);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: var(--fg-dim);
	}

	.blurb {
		margin: 0;
		max-width: 34rem;
	}

	.blurb p {
		margin: 0 0 1.15rem;
		font-size: 0.9rem;
		font-weight: 100 !important;
		line-height: 1.48;
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
		color: var(--fg-strong);
	}

	.part-hanja {
		font-size: clamp(0.85rem, 1.4vw, 1.05rem);
		color: var(--gold);
		opacity: 0.75;
	}

	/* ————— Chapter opener: scrolls with the page (sticky chrome lives in .entry-head) ————— */
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
		color: var(--fg-strong);
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
	/* ————— Entry: sticky header + text beats | sticky images ————— */
	.entry {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(240px, 26%);
		grid-auto-rows: auto;
		gap: 0 3.25rem;
		padding: 0 3rem 7rem;
		overflow: visible;
		overflow-anchor: none;
	}

	/* Immersion: a lead margin column carries the sticky year + chapter chrome,
	   and the phone reel keeps a wide sticky stage column (0.8× its script width). */
	:global(html.is-immersion) .entry {
		grid-template-columns: 15rem minmax(0, 1fr) minmax(240px, 32%);
		gap: 0 2.75rem;
	}

	/* Script: no side column at all — the prose takes the full measure. */
	.script.images-inline .entry {
		grid-template-columns: minmax(0, 1fr);
	}

	/* Browser overflow-anchor + image load used to pin the reader on one entry. */
	.script {
		overflow-anchor: none;
	}

	/* ————— Cinema: one column over the panel —————
	   The stage carries the art, the place and the episode marker, so the side
	   meta, the sticky reel and the inline figures all stand down and the prose
	   becomes a single centred column reading over the full-bleed panel.
	   Everything here is undone by `is-cinema-peek`, which is the one control
	   that hands the dashboard back. */
	:global(html.is-cinema) .entry {
		grid-template-columns: minmax(0, 1fr);
		gap: 0;
		padding: 0 1.5rem 6rem;
	}

	:global(html.is-cinema:not(.is-cinema-peek)) .entry-head,
	:global(html.is-cinema:not(.is-cinema-peek)) .images-col,
	:global(html.is-cinema:not(.is-cinema-peek)) .inline-art,
	:global(html.is-cinema:not(.is-cinema-peek)) .chapter-head {
		display: none;
	}

	:global(html.is-cinema) .beats {
		width: min(100%, 58rem);
		margin: 0 auto;
	}

	/* Enough head-room that the opening paragraphs read below the title card
	   even while it is still holding its beat. */
	:global(html.is-cinema) .text.first {
		padding-top: 7rem;
	}

	/* Peeking: the ordinary two-column entry comes back under the stage. */
	:global(html.is-cinema.is-cinema-peek) .entry {
		grid-template-columns: minmax(0, 1fr) minmax(240px, 26%);
		gap: 0 3.25rem;
		padding: 0 3rem 7rem;
	}

	:global(html.is-cinema.is-cinema-peek) .beats {
		width: auto;
		margin: 0;
	}

	/* Sticky header + text column; art column spans the full entry height. */
	.content-col {
		grid-column: 1;
		min-width: 0;
	}

	.entry-head {
		min-width: 0;
	}

	/* Immersion: the head takes the lead margin column with a full-height
	   runway, so the sticky year + chapter chrome ride alongside the script. */
	:global(html.is-immersion) .content-col {
		display: contents;
	}

	:global(html.is-immersion) .entry-head {
		grid-column: 1;
		grid-row: 1 / -1;
		height: 100%;
	}

	:global(html.is-immersion) .beats {
		grid-column: 2;
	}

	:global(html.is-immersion) .images-col {
		grid-column: 3;
	}

	.beats {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
	}

	.images-col {
		grid-column: 2;
		grid-row: 1 / -1;
		align-self: stretch;
		height: 100%;
		min-height: 100%;
		min-width: 0;
		overflow: visible;
		/* Flex column so the sticky stage can `align-self: flex-start`
		   and pin while this tall column scrolls with the entry. */
		display: flex;
		flex-direction: column;
	}

	.images-sticky {
		/* Shared stage width: bento row + landscape phone (3:2) match. */
		--stage-gap: 0.7rem;
		--stage-w: 100%;
		position: sticky;
		top: 1.5rem;
		/* Viewport-tall stage pinned while the entry’s text column scrolls. */
		height: calc(100vh - 3rem);
		max-height: calc(100dvh - 3rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--stage-gap);
		padding-top: 2.1rem;
		min-height: 0;
		align-self: flex-start;
		width: 100%;
	}

	.images-sticky .bento,
	.images-sticky .reel {
		width: var(--stage-w);
		max-width: 100%;
		flex-shrink: 0;
	}

	/* Place banner + mini map side by side; banner 16:9 sets the row height. */
	.bento {
		display: grid;
		grid-template-columns: 1.55fr 1fr;
		gap: var(--stage-gap);
		align-items: stretch;
	}

	.bento-place,
	.bento-map {
		min-width: 0;
		min-height: 0;
	}

	.bento-place :global(.banner) {
		width: 100%;
		height: auto;
	}

	.bento-map {
		display: flex;
	}

	.bento-map :global(.tile) {
		flex: 1 1 auto;
		width: 100%;
		height: 100%;
	}

	.images-sticky .reel {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.images-sticky .reel :global(.stack) {
		width: 100%;
		height: auto;
	}

	/* Immersion: size stage so bento + landscape 3:2 phone fit above the plate. */
	:global(html.is-immersion) .images-sticky {
		top: 1.1rem;
		height: calc(100dvh - var(--plate-h) - 1.35rem);
		padding-top: 0.35rem;
		padding-bottom: 0.35rem;
		justify-content: center;
		box-sizing: border-box;
		/* phone only: height = w * 2/3  →  w = H * 3/2 */
		--stage-w: min(100%, calc((100dvh - var(--plate-h) - 1.35rem) * 3 / 2));
	}

	:global(html.is-immersion) .images-sticky.has-banner {
		/* bento 9/16 + phone 2/3 = 59/48 of width, plus gap */
		--stage-w: min(
			100%,
			calc((100dvh - var(--plate-h) - 1.35rem - var(--stage-gap)) * 48 / 59)
		);
	}

	/* Year / title chrome sticks to the top of the script column. */
	.entry-head-sticky {
		position: sticky;
		top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 1.5rem 0 1rem;
		background: linear-gradient(
			to bottom,
			var(--bg) 0%,
			var(--bg) 72%,
			transparent 100%
		);
	}

	.head-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Immersion: the chrome stacks in the narrow margin column. */
	:global(html.is-immersion) .head-top {
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.28rem;
	}

	.head-main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
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
		color: var(--fg-strong);
	}

	.story-index {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--fg-faint);
		white-space: nowrap;
	}

	.year {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 0.82rem;
		line-height: 1.3;
		letter-spacing: 0.04em;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 0.4rem;
		margin: 0 0 0.28rem;
		color: var(--fg-dim);
	}

	/* "March", "October" — month-only markers stay the same subtitle size */
	.year.long {
		font-size: 0.82rem;
		line-height: 1.3;
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

	/* Tint overlay only — do not promote children into relative containing
	   blocks that can interfere with sticky side columns. */
	.entry.flash .beats,
	.entry.flash .entry-head-sticky,
	.entry.flash .images-sticky {
		position: relative;
	}

	.entry.flash .entry-head-sticky {
		background: transparent;
	}

	.year-sub {
		font-family: var(--sans);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: var(--tracking-micro);
		margin-top: 0;
		color: var(--fg-faint);
	}

	.episode h2 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: 1.06rem;
		line-height: 1.08;
		letter-spacing: var(--tracking-display);
		max-width: none;
		color: var(--fg-strong);
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
		background: color-mix(in srgb, var(--fg) 6%, transparent);
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
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
		background: color-mix(in srgb, var(--fg) 12%, transparent);
	}

	.badge.flag:hover {
		background: transparent;
		filter: brightness(1.08);
	}

	.text {
		padding: 0;
	}

	.text.first {
		padding-top: 0.5rem;
	}

	.inline-art {
		width: 100%;
		max-width: min(100%, 54rem);
		min-width: 0;
		margin: 0.85rem 0 0.55rem;
		position: relative;
		z-index: 0;
		overflow-x: clip;
	}

	/*
	   Desktop sticky reel: each image-bearing beat reserves a minimum scroll
	   runway so cue switch points stay spaced and short prose cannot skip art.
	   --art-n scales the floor when several images share one beat.
	   Inline layout skips this — art already sits in the flow.
	*/
	@media (min-width: 821px) {
		.text.has-art {
			min-height: calc(var(--art-n, 1) * min(52vh, 22rem));
		}
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
		border-radius: var(--radius-pill);
		padding: 0.45rem 0.95rem;
		opacity: 0;
		transform: translate3d(0, 0.85rem, 0);
		pointer-events: none;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			opacity 520ms var(--ease),
			transform 560ms var(--ease);
	}

	.edit-link.in {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}

	.edit-link.in:hover {
		color: var(--fg-strong);
		border-color: rgba(216, 178, 106, 0.5);
		transform: translateY(-2px);
	}

	/* Cinema: the dev link keeps out of the strip and out of the way. */
	:global(html.is-cinema) .edit-link {
		bottom: calc(var(--cin-strip-h) + 4rem);
		opacity: 0;
	}

	:global(html.is-cinema) .edit-link.in {
		opacity: 0.3;
	}

	:global(html.is-cinema) .edit-link.in:hover {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.edit-link {
			transition: opacity 200ms ease, color 0.2s ease, border-color 0.2s ease;
			transform: none;
		}

		.edit-link.in:hover {
			transform: none;
		}
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
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.55rem;
		color: var(--fg-faint);
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
		main {
			padding-left: 0;
			padding-right: 0;
			overflow-x: clip;
		}

		.cover,
		.blurb-page {
			min-height: 100dvh;
			padding: max(4.5rem, calc(env(safe-area-inset-top, 0px) + 3.4rem))
				max(1.15rem, env(safe-area-inset-right, 0px)) 3rem
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.cover-title {
			font-size: clamp(2.1rem, 9vw, 2.8rem);
			letter-spacing: -0.04em;
		}

		.blurb {
			margin: 0;
			max-width: 36rem;
		}

		.part-page {
			min-height: 72dvh;
			padding: 3.5rem max(1.15rem, env(safe-area-inset-right, 0px)) 2.5rem
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		/* Chapter opener scrolls away; sticky chrome lives in the entry head on desktop.
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
		}

		.entry.flash {
			padding-top: 0;
		}

		/* Immersion glides a tapped line into the reading band; entry snap
		   points would drag that scroll back to the top of the entry.
		   Extra foot room keeps the last lines above the speaker plate. */
		:global(html.is-immersion) .entry {
			padding-bottom: 1.25rem;
		}

		/* Stage modes: art leads the card, then title, then text — not sticky on
		   narrow. The script has no column here at all; its figures ride inside
		   .beats, so only the inline gutters need widening. */
		.images-col {
			order: 1;
			margin: 0;
			max-width: 100%;
		}

		.script.images-inline .inline-art {
			max-width: none;
			margin: 0.85rem max(1.15rem, env(safe-area-inset-right, 0px)) 0.15rem
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.images-sticky {
			position: static;
			height: auto;
			padding-top: 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--stage-gap, 0.55rem);
			padding-inline: max(1.15rem, env(safe-area-inset-left, 0px))
				max(1.15rem, env(safe-area-inset-right, 0px));
			--stage-w: min(100%, 22rem);
		}

		.images-sticky .reel {
			flex: none;
		}

		:global(html.is-immersion) .images-sticky,
		:global(html.is-immersion) .images-sticky.has-banner {
			--stage-w: min(100%, 18rem);
		}

		.entry-head {
			order: 2;
			padding: 1.15rem max(1.15rem, env(safe-area-inset-right, 0px)) 0
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		.content-col {
			order: 2;
			display: contents;
		}

		.entry-head-sticky {
			position: static;
			padding: 0;
			gap: 0.65rem;
			background: none;
		}

		/* Narrow: the head is a full-width card row again, not a margin column. */
		:global(html.is-immersion) .head-top {
			flex-direction: row;
			justify-content: space-between;
			align-items: baseline;
			gap: 1rem;
		}

		.head-main {
			gap: 0;
			min-width: 0;
		}

		.year {
			font-size: 0.78rem;
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

		/* Phones: clear the (temporary) title card without wasting a screen. */
		:global(html.is-cinema) .text.first {
			padding-top: 5rem;
		}

		.colophon {
			padding: 4rem 1.15rem max(6rem, calc(env(safe-area-inset-bottom, 0px) + 4rem));
		}

		.edit-link {
			right: max(0.7rem, env(safe-area-inset-right, 0px));
			bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
			min-height: 2.75rem;
			display: inline-grid;
			place-items: center;
		}

		:global(html.is-immersion) .edit-link {
			bottom: calc(var(--plate-h, 14rem) + 0.45rem);
		}
	}

	@media (max-width: 480px) {
		.cover-ko,
		.cover-subtitle {
			font-size: 1.05rem;
		}

		.year {
			font-size: 0.76rem;
		}

		.badges {
			flex-wrap: wrap;
		}
	}

	/* ————— Episodes scope: floating prev / next —————
	   Bottom-center chrome. In immersion, clear the dialogue *box*
	   (--plate-box-h) — not --plate-h (bust reserve) — so the pill sits
	   just above the plate instead of mid-prose. z-index stays under the
	   plate (93) so the two never fight for hits. */
	.ep-nav {
		position: fixed;
		z-index: 92;
		left: 50%;
		bottom: max(1rem, env(safe-area-inset-bottom, 0px));
		transform: translate3d(-50%, 0.85rem, 0);
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.28rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		backdrop-filter: blur(14px);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 480ms var(--ease),
			transform 520ms var(--ease),
			bottom 420ms var(--ease);
	}

	.ep-nav.in {
		opacity: 1;
		transform: translate3d(-50%, 0, 0);
		pointer-events: auto;
	}

	:global(html.is-immersion.is-in-script) .ep-nav {
		bottom: calc(var(--plate-box-h, 9rem) + 0.75rem);
	}

	/* Cinema keeps the pill, lifted clear of the dialogue strip. */
	:global(html.is-cinema.is-in-script) .ep-nav {
		bottom: calc(var(--cin-strip-h) + 3.5rem);
	}

	.ep-nav button {
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--fg-dim);
		background: transparent;
		border: none;
		border-radius: var(--radius-pill);
		padding: 0.4rem 0.85rem;
		min-height: 2.5rem;
		cursor: pointer;
		transition:
			background 0.25s var(--ease),
			color 0.25s var(--ease);
	}

	.ep-nav button:hover:not(:disabled) {
		color: var(--on-gold);
		background: var(--gold);
	}

	.ep-nav button:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.ep-count {
		font-size: 0.7rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.06em;
		color: var(--fg-faint);
		padding: 0 0.35rem;
		min-width: 3.4rem;
		text-align: center;
	}

	.ep-of {
		opacity: 0.55;
		margin: 0 0.1em;
	}

	/* Clear the bottom pill in script mode. Immersion already reserves
	   --plate-h on body, which sits below the nav (--plate-box-h). */
	.script.episodes .entry {
		padding-bottom: 5.5rem;
	}

	@media (max-width: 700px) {
		.ep-nav {
			bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
		}

		:global(html.is-immersion.is-in-script) .ep-nav {
			bottom: calc(var(--plate-box-h, 9rem) + 0.55rem);
		}

		.ep-nav button {
			min-height: 2.75rem;
			padding: 0.45rem 0.95rem;
			font-size: 0.74rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ep-nav {
			transition: opacity 200ms ease;
			transform: translate3d(-50%, 0, 0);
		}
	}

</style>
