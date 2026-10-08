<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		arcNumber,
		chapters,
		episodeNumber,
		isFlashEntry,
		entryId
	} from '$lib/story';
	import { arcLabel, episodeCrumbs } from '$lib/tocTree';
	import { reveal } from '$lib/reveal';
	import ImageStack from '$lib/components/ImageStack.svelte';
	import EpisodeThumbnail from '$lib/components/EpisodeThumbnail.svelte';
	import PartTitle from '$lib/components/PartTitle.svelte';
	import AboutBlurb from '$lib/components/AboutBlurb.svelte';
	import HiddenStills from '$lib/components/HiddenStills.svelte';
	import PlaceBanner from '$lib/components/PlaceBanner.svelte';
	import PlaceMapTile from '$lib/components/PlaceMapTile.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import EpisodePicker from '$lib/components/EpisodePicker.svelte';
	import ScriptSelectionMenu from '$lib/components/ScriptSelectionMenu.svelte';
	import { buildBeats, type Beat } from '$lib/beats';
	import { chatForms } from '$lib/chat';
	import { dialogueUi } from '$lib/dialogueUi.svelte';
	import { withRealImages } from '$lib/storyImages';
	import { editUi } from '$lib/editUi.svelte';
	import type { Attachment } from 'svelte/attachments';
	import { entryForReading } from '$lib/nsfwUi.svelte';
	import {
		reading,
		episodes,
		PROLOGUE_EPISODE_ID,
		findStoryHeading,
		isInlineArt,
		loadMode,
		loadViewScope,
		scrollToStoryHeading,
		stepEpisode,
		storyRoot,
		watchReading
	} from '$lib/reading.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { tocUi } from '$lib/tocUi.svelte';
	import { entryCast, entryTags } from '$lib/entryHead';
	import { isWarEntry } from '$lib/episodeKinds';
	import { PARTS } from '$lib/episodeDirectory';
	import { onMount } from 'svelte';
	import type { Chapter, StackImage } from '$lib/story';

	let episodesMode = $derived(reading.viewScope === 'episodes');
	let currentEp = $derived(episodes[reading.episodeIndex]);
	let onPrologue = $derived(episodesMode && currentEp?.kind === 'prologue');
	let atFirstEpisode = $derived(reading.episodeIndex <= 0);
	let atLastEpisode = $derived(reading.episodeIndex >= episodes.length - 1);
	/** The bottom prev / next pill is up (and reachable by keyboard). */
	let navLive = $derived(scriptUi.inScript && episodesMode);
	/** Part title pages, keyed by the Arc that opens each Part. */
	const PART_BY_ARC = new Map(
		PARTS.filter((p) => chapters.find((ch) => ch.id === p.id)?.part).map((p) => [p.id, p])
	);

	/** Number and titles for the pill, by episode id. */
	const PILL_INFO = new Map(
		chapters.flatMap((ch, ci) =>
			ch.entries.map((en, i): [string, { num: string; title: string; ko?: string }] => [
				entryId(ch.id, en.title),
				{ num: episodeNumber(ci, i), title: en.title, ko: en.subtitle }
			])
		)
	);

	/** The episode under the reading line once its head has scrolled off the top. */
	let pinnedId = $state<string | null>(null);
	/** Last pinned episode, so the pill keeps its words while it slides away. */
	let pillId = $state<string | null>(null);
	let pill = $derived(pillId ? PILL_INFO.get(pillId) : undefined);

	function headScrolledPast(): string | null {
		const root = storyRoot();
		if (!root) return null;
		const line = 80;
		for (const article of root.querySelectorAll<HTMLElement>('article.entry')) {
			const r = article.getBoundingClientRect();
			if (r.top > line || r.bottom < line) continue;
			const head = article.querySelector<HTMLElement>('.entry-head')?.getBoundingClientRect();
			return head && head.height > 0 && head.bottom < 0 ? (article.dataset.storyId ?? null) : null;
		}
		return null;
	}

	function backToHead() {
		const el = pillId ? findStoryHeading(pillId) : null;
		if (el) scrollToStoryHeading(el, 'smooth');
	}
	/** Korean reading: the entry head leads with Korean titles and labels. */
	let koHead = $derived(reading.lang === 'ko');
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

		/** In the full scroll, chrome waits until the prologue is behind the reader. */
		const scriptEl = storyRoot();
		let syncRaf = 0;
		const syncInScript = () => {
			if (syncRaf) return;
			syncRaf = requestAnimationFrame(() => {
				syncRaf = 0;
				if (!scriptEl) {
					scriptUi.inScript = true;
					return;
				}
				if (reading.viewScope === 'episodes') {
					scriptUi.inScript = true;
					return;
				}
				/* A TOC jump can briefly look like cover until the measured-Y scroll
				   lands — keep chrome up so the panel does not retract. */
				if (tocUi.jumping) {
					scriptUi.inScript = true;
					return;
				}
				/* Hysteresis so chrome does not chatter when the cover edge
				   sits on the threshold. */
				const top = scriptEl.getBoundingClientRect().top;
				const vh = window.innerHeight;
				scriptUi.inScript = scriptUi.inScript ? top < vh * 0.98 : top < vh * 0.88;
			});
		};

		let pillRaf = 0;
		const syncPill = () => {
			if (pillRaf) return;
			pillRaf = requestAnimationFrame(() => {
				pillRaf = 0;
				pinnedId = headScrolledPast();
				if (pinnedId) pillId = pinnedId;
			});
		};

		syncInScript();
		syncPill();

		window.addEventListener('scroll', syncInScript, { passive: true });
		window.addEventListener('resize', syncInScript);
		window.addEventListener('scroll', syncPill, { passive: true });
		window.addEventListener('resize', syncPill);

		return () => {
			stopReading();
			if (syncRaf) cancelAnimationFrame(syncRaf);
			if (pillRaf) cancelAnimationFrame(pillRaf);
			window.removeEventListener('scroll', syncInScript);
			window.removeEventListener('resize', syncInScript);
			window.removeEventListener('scroll', syncPill);
			window.removeEventListener('resize', syncPill);
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

	/**
	 * Flatten beat-anchored images into one sticky stack, tagged with beatIndex.
	 * Takes the beats the entry is already rendering so the stack and the prose
	 * can never disagree about which art belongs to which beat.
	 */
	function stackImages(beats: Beat[]): StackImage[] {
		return beats.flatMap((beat, bi) => beat.images.map((im) => ({ ...im, beatIndex: bi })));
	}

	const yearsByChapter = new Map(chapters.map((ch) => [ch.id, entryYears(ch)]));

	/** Farthest an inline figure drifts from its place in the flow, in px. */
	const PARALLAX_PX = 14;
	/** Figures the drift applies to: script-mode art and solo-flashback art. */
	const PARALLAX_TARGETS = '.inline-art, .fb-art';

	/**
	 * Inline figures float a little slower than the prose. Each wrapper is
	 * measured (it never moves) and its child is shifted through the CSS
	 * `translate` property via `--parallax-y`, so the read never sees its own
	 * write and nothing reflows. One passive scroll listener, one rAF write
	 * pass, and only for wrappers an IntersectionObserver reports on screen.
	 */
	const parallax: Attachment<HTMLElement> = (root) => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		const onScreen = new Set<HTMLElement>();
		let raf = 0;

		const update = () => {
			raf = 0;
			const vh = innerHeight;
			const shifts = [...onScreen].map((el) => {
				const r = el.getBoundingClientRect();
				const t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
				return [el, -Math.max(-1, Math.min(1, t)) * PARALLAX_PX] as const;
			});
			for (const [el, y] of shifts) el.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
		};
		const schedule = () => {
			if (!raf && !motion.matches) raf = requestAnimationFrame(update);
		};

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					const el = e.target as HTMLElement;
					if (e.isIntersecting) onScreen.add(el);
					else onScreen.delete(el);
				}
				schedule();
			},
			{ rootMargin: '25% 0px' }
		);

		const observed = new Set<HTMLElement>();
		const collect = () => {
			const now = new Set(root.querySelectorAll<HTMLElement>(PARALLAX_TARGETS));
			for (const el of observed) {
				if (now.has(el)) continue;
				io.unobserve(el);
				observed.delete(el);
				onScreen.delete(el);
			}
			for (const el of now) {
				if (observed.has(el)) continue;
				io.observe(el);
				observed.add(el);
			}
		};
		let collectRaf = 0;
		const mo = new MutationObserver(() => {
			if (!collectRaf)
				collectRaf = requestAnimationFrame(() => {
					collectRaf = 0;
					collect();
				});
		});

		const onMotion = () => {
			if (!motion.matches) return schedule();
			for (const el of observed) el.style.removeProperty('--parallax-y');
		};

		collect();
		mo.observe(root, { childList: true, subtree: true });
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule);
		motion.addEventListener('change', onMotion);

		return () => {
			if (raf) cancelAnimationFrame(raf);
			if (collectRaf) cancelAnimationFrame(collectRaf);
			io.disconnect();
			mo.disconnect();
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
			motion.removeEventListener('change', onMotion);
		};
	};
</script>

<svelte:head>
	<title>King for All 삼한왕검</title>
	<meta
		name="description"
		content="King for All (삼한왕검) by Heewon Ahn — a three-generation chronicle of 7th-century Samhan, at the end of the Three Kingdoms Period."
	/>
</svelte:head>

<main>
	{#if !episodesMode || onPrologue}
		<!-- ————— prologue: Heewon's note before the story. In episodes mode this is episode 0. ————— -->
		<section class="prologue" data-story-id={PROLOGUE_EPISODE_ID}>
			<p class="prologue-kicker">{koHead ? 'Prologue' : '프롤로그'}</p>
			<h1 class="prologue-title">{koHead ? '프롤로그' : 'Prologue'}</h1>
			<AboutBlurb />
		</section>
	{/if}

	<!-- Script: chapters after the prologue — fixed chrome waits on this region. -->
	<div
		data-story-root
		class="script"
		class:episodes={episodesMode}
		class:images-inline={inlineImages}
		{@attach parallax}
	>
		{#each chapters as chapter, ci (chapter.id)}
			{#if !episodesMode || chapter.id === currentEp?.chapterId}
				{@const part = PART_BY_ARC.get(chapter.id)}
				{#if part && (!episodesMode || currentEp?.kind === 'part')}
					<PartTitle {part} ko={koHead} />
				{/if}
				<section class="chapter" data-story-id={chapter.id}>
						{#if !episodesMode}
							<header class="chapter-head">
								<div class="chapter-title">
									<h1>
										<span class="num">{arcLabel(arcNumber(ci), koHead)}</span>
										<span class="en">{chapter.title}</span>
										{#if chapter.hanja}<span class="hanja">{chapter.hanja}</span>{/if}
										{#if chapter.korean}<span class="ko">{chapter.korean}</span>{/if}
										<span class="range">{chapter.range}</span>
									</h1>
									<span class="rule" aria-hidden="true"></span>
								</div>
							</header>
						{/if}

					{#each chapter.entries as entry, i (chapter.id + i)}
							{#if !episodesMode || (chapter.id === currentEp?.chapterId && i === currentEp?.entryIndex)}
							{@const years = yearsByChapter.get(chapter.id) ?? []}
							<!-- One sanitized copy of the entry per render: beats, the sticky
							     stack and the scene-id source all read from it, so anchors and
							     block indices can never be computed against the unfiltered
							     blocks while the prose shows the filtered ones. -->
							{@const shown = entryForReading(entry)}
							{@const beats = withRealImages(buildBeats(shown), editUi.enabled)}
							{@const images = stackImages(beats)}
							{@const eid = entryId(chapter.id, entry.title)}
							{@const tags = entryTags(entry)}
							{@const cast = entryCast(shown, years[i] ?? null)}
							{@const forms = chatForms(shown.blocks, dialogueUi.style)}
							<article
								class="entry"
								class:flash={isFlashEntry(entry)}
								data-story-id={eid}
								data-year={years[i]}
								data-flash={isFlashEntry(entry) ? '1' : undefined}
								data-music={entry.music ?? undefined}
								data-place={entry.place ?? undefined}
								style:--tone={entry.flashTone ?? '#8a8a94'}
							>
								<div class="content-col">
									<header class="entry-head">
										<div class="entry-head-main" use:reveal={{ y: 0 }}>
											<nav class="crumbs" aria-label="Breadcrumb">
												{#each episodeCrumbs(ci, i, koHead) as crumb, k (k)}
													{#if k}<span class="crumb-caret material-symbols-outlined" aria-hidden="true"
															>chevron_right</span
														>{/if}
													{#if crumb.anchor}
														<a class="crumb crumb-link" href={`${resolve('/episodes')}#${crumb.anchor}`}
															>{crumb.label}</a
														>
													{:else}
														<span class="crumb">{crumb.label}</span>
													{/if}
												{/each}
											</nav>
											<div class="episode">
												<div class="year" class:long={entry.year.length > 4}>
													{entry.year}
													{#if entry.sub}<span class="year-sub">{entry.sub}</span>{/if}
												</div>
												<h2>{(koHead && entry.subtitle) || entry.title}</h2>
												{#if entry.subtitle}
													<p class="episode-ko">{koHead ? entry.title : entry.subtitle}</p>
												{/if}
											</div>
										</div>
										{#if tags.length || cast.length}
											<dl class="props">
												{#if tags.length}
													<div class="prop">
														<dt>
															<span class="material-symbols-outlined" aria-hidden="true">sell</span>
															{koHead ? '태그' : 'Tags'}
														</dt>
														<dd>
															<ul class="tags">
																{#each tags as tag, j (tag.key)}
																	<li class="tag" style:--tag={tag.color} use:reveal={60 + j * 45}>
																		{#if tag.flag}
																			<img class="tag-flag" src={tag.flag} alt="" />
																		{:else if tag.icon}
																			<span class="tag-icon material-symbols-outlined" aria-hidden="true"
																				>{tag.icon}</span
																			>
																		{/if}
																		{#if koHead}
																			<span class="tag-en">{tag.ko}</span>
																		{:else}
																			<span class="tag-en">{tag.label}</span>
																			<span class="tag-ko">{tag.ko}</span>
																		{/if}
																	</li>
																{/each}
															</ul>
														</dd>
													</div>
												{/if}
												{#if cast.length}
													<div class="prop">
														<dt>
															<span class="material-symbols-outlined" aria-hidden="true">group</span>
															{koHead ? '등장인물' : 'Characters'}
														</dt>
														<dd>
															<ul class="cast-list">
																{#each cast as member, j (member.id)}
																	<li use:reveal={120 + j * 45}>
																		<button
																			type="button"
																			class="person cast-chip"
																			data-person={member.id}
																			style:--who={member.color}
																		>
																			{#if member.avatar}
																				<img
																					class="cast-face"
																					class:is-monarch={member.square}
																					class:silhouette={member.silhouette}
																					src={member.avatar}
																					alt=""
																				/>
																			{:else}
																				<span
																					class="cast-face blank"
																					class:is-monarch={member.square}
																					aria-hidden="true"
																					>{(member.ko ?? member.name).slice(0, 1)}</span
																				>
																			{/if}
																			<span class="cast-name"
																				>{(koHead && member.ko) || member.name}</span
																			>
																		</button>
																	</li>
																{/each}
															</ul>
														</dd>
													</div>
												{/if}
											</dl>
										{/if}
										<div class="entry-thumb">
											<EpisodeThumbnail
												entry={shown}
												{eid}
												priority={episodesMode || (ci === 0 && i === 0)}
											/>
											<HiddenStills entry={shown} />
										</div>
									</header>

									<!-- Side: sticky reel swaps from scrollY. Inline: art immediately before the beat it illustrates.
									     Solo flashback beats carry art inside the mini (via flashImages) so TOC jumps still see cues. -->
									<div class="beats">
									{#each beats as beat, bi (bi)}
										{@const soloFlash =
											beat.blocks.length === 1 && beat.blocks[0]?.kind === 'flashback'}
										{@const asMedia =
											inlineImages && beat.images.length > 0 && forms.get(beat.blocks[0]) === 'post'}
										{#if inlineImages && beat.images.length && !soloFlash && !asMedia}
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
											style:--art-n={Math.min(2, Math.max(1, beat.images.length))}
											use:reveal={{ delay: 80, y: 0 }}
										>
											<Blocks
												blocks={beat.blocks}
												year={years[i]}
												idPrefix={eid}
												sceneFrom={shown.blocks}
												flashImages={inlineImages && soloFlash ? beat.images : undefined}
												media={asMedia ? beat.images : undefined}
												breaking={isWarEntry(shown)}
											/>
										</div>
									{/each}
								</div>
								</div>

								<!-- The stage column belongs to the stage modes. The script
								     has no place banner and no map tile — only its own
								     figures, which ride inline with the prose. -->
								{#if sideImages && (images.length || entry.place)}
									<aside class="images-col">
										<div class="images-sticky" class:has-banner={!!entry.place}>
											{#if entry.place}
												<div class="bento">
													<div class="bento-place">
														<PlaceBanner
															placeId={entry.place}
															priority={episodesMode || (ci === 0 && i === 0)}
														/>
													</div>
													<div class="bento-map">
														<PlaceMapTile placeId={entry.place} />
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
							{/if}
					{/each}
				</section>
			{/if}
		{/each}
	</div>

	{#if !episodesMode}
		<footer class="colophon" use:reveal>
			<p>— to be continued —</p>
			<p class="colophon-links">
				<a href={resolve('/wiki')}>Wiki</a>
				<span aria-hidden="true">·</span>
				<a href={resolve('/images')}>Images</a>
				<span aria-hidden="true">·</span>
				<a href={resolve('/grade')}>Grade</a>
			</p>
		</footer>
	{/if}

	<button
		type="button"
		class="title-pill liquid-glass"
		class:in={!!pinnedId}
		aria-hidden={!pinnedId}
		tabindex={pinnedId ? 0 : -1}
		onclick={backToHead}
	>
		{#if pill}
			<span class="pill-num">{pill.num}</span>
			<span class="pill-title">{(koHead && pill.ko) || pill.title}</span>
		{/if}
	</button>

	<nav
		class="ep-nav liquid-glass"
		class:in={navLive}
		aria-label="Episode navigation"
		aria-hidden={!navLive}
	>
		<button
			type="button"
			class="ep-step prev"
			disabled={atFirstEpisode}
			aria-label={koHead ? '이전 회차' : 'Previous episode'}
			tabindex={navLive && !atFirstEpisode ? 0 : -1}
			onclick={() => stepEpisode(-1)}
		>
			<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
			<span class="step-label">{koHead ? '이전' : 'Prev'}</span>
		</button>
		<div class="ep-pick">
			<EpisodePicker variant="inline" placement="above" align="center" tabindex={navLive ? 0 : -1} />
		</div>
		<button
			type="button"
			class="ep-step next"
			disabled={atLastEpisode}
			aria-label={koHead ? '다음 회차' : 'Next episode'}
			tabindex={navLive && !atLastEpisode ? 0 : -1}
			onclick={() => stepEpisode(1)}
		>
			<span class="step-label">{koHead ? '다음' : 'Next'}</span>
			<span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
		</button>
	</nav>
	<ScriptSelectionMenu />
</main>

<style>
	/* Shell padding / TOC shift live in (story)/+layout.svelte */

	/* The prologue reads like a letter at the head of the book. */
	.prologue {
		max-width: 38rem;
		margin: 0 auto;
		padding: clamp(6rem, 16vh, 9rem) 1.5rem 4rem;
	}

	.prologue-kicker {
		margin: 0 0 0.4rem;
		font-family: var(--ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.prologue-title {
		margin: 0 0 1.8rem;
		font-family: var(--serif);
		font-size: clamp(2.2rem, 5vw, 3rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
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

	/* Immersion: no year/title/flag margin. Prose and the sticky stage only. */
	:global(html.is-immersion) .entry {
		grid-template-columns: minmax(0, 1fr) minmax(240px, 32%);
		gap: 0 2.75rem;
	}

	:global(html.is-immersion) .entry-head {
		display: none;
	}

	/* Script: no side column at all — one column at the script measure. */
	.script.images-inline .entry {
		grid-template-columns: minmax(0, var(--script-measure));
	}

	/* Centred on the window, not on the reading column: the TOC's push
	   (--reading-inset) comes back out of the left padding, so opening it only
	   moves the script once the card actually reaches it. Both paddings ease
	   on the TOC's curve, so the sum holds still while they trade. */
	@media (min-width: 821px) {
		.script.images-inline {
			--script-left: max(
				3rem,
				calc((100vw - var(--script-measure)) / 2 - var(--reading-inset))
			);
		}

		.script.images-inline .entry,
		.script.images-inline .chapter-head {
			padding-left: var(--script-left);
			transition: padding-left var(--toc-duration) var(--toc-ease);
		}

		.script.images-inline .chapter-head {
			max-width: calc(var(--script-left) + var(--script-measure));
		}
	}

	/* Browser overflow-anchor + image load used to pin the reader on one entry. */
	.script {
		overflow-anchor: none;
	}

	/* Inline art and sticky frames stop at the column edge, never in the TOC gutter. */
	.chapter {
		overflow-x: clip;
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

	/* The head scrolls with the page; once it is gone the title pill takes over. */
	.entry-head-main {
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
		padding: 2rem 0 2.25rem;
	}

	.crumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.15rem 0.3rem;
		font-family: var(--ui);
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.3;
		color: var(--fg-faint);
	}

	.crumb:last-child {
		color: var(--fg-dim);
	}

	.crumb-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 0.2em;
		transition:
			color 0.2s var(--ease),
			text-decoration-color 0.2s var(--ease);
	}

	.crumb-link:hover,
	.crumb-link:focus-visible {
		color: var(--fg-strong);
		text-decoration-color: currentColor;
	}

	.crumb-caret {
		font-size: 1rem;
		opacity: 0.7;
	}

	.episode {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.year {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 0.92rem;
		line-height: 1.3;
		letter-spacing: 0.04em;
		display: flex;
		flex-direction: row;
		align-items: baseline;
		gap: 0.4rem;
		margin: 0 0 0.5rem;
		color: var(--fg-dim);
	}

	/* "March", "October" — month-only markers stay the same subtitle size */
	.year.long {
		font-size: 0.82rem;
		line-height: 1.3;
	}

	/* ————— Flashback entries —————
	   The whole page drops into the past (html.is-flash, set by watchReading);
	   the entry carries no tint of its own, so page and script are one colour. */
	.entry.flash {
		padding-bottom: 3.4rem;
		margin-bottom: 1.4rem;
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
		font-size: clamp(2.3rem, 3.6vw, 3.1rem);
		line-height: 1.02;
		letter-spacing: var(--tracking-display);
		max-width: none;
		color: var(--fg-strong);
		text-wrap: balance;
	}

	.episode-ko {
		margin: 0.6rem 0 0;
		font-family: var(--serif);
		font-size: 1.05rem;
		letter-spacing: 0.06em;
		color: var(--fg-dim);
	}

	/* Properties: each quiet label sits above its values. */
	.props {
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
		margin: 0;
		padding: 0 0 2.75rem;
	}

	.prop {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.prop dt {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--ui);
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--fg-faint);
	}

	.prop dt .material-symbols-outlined {
		font-size: 1.05rem;
	}

	.prop dd {
		margin: 0;
		min-width: 0;
	}

	.entry-thumb {
		padding: 0 0 3.25rem;
	}

	.entry-thumb:not(:has(figure, button)) {
		display: none;
	}

	.tags,
	.cast-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		min-height: 1.85rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		height: 1.6rem;
		padding: 0 0.6rem 0 0.4rem;
		font-size: 0.74rem;
		line-height: 1;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--tag, var(--fg)) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--tag, var(--fg)) 28%, transparent);
		border-radius: 999px;
	}

	.tag-flag {
		width: 1.35rem;
		height: 0.9rem;
		object-fit: cover;
		border-radius: 2px;
		display: block;
	}

	.tag-icon {
		font-size: 0.95rem;
		color: var(--tag);
		font-variation-settings: 'FILL' 1;
	}

	.tag-ko {
		color: var(--fg-faint);
		font-size: 0.92em;
	}

	/* Notion person mentions: a round face and a name, no chip around them. */
	.cast-list {
		gap: 0.15rem 0.35rem;
	}

	.cast-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 1.75rem;
		padding: 0 0.4rem 0 0.2rem;
		font: inherit;
		font-family: var(--ui);
		font-size: 0.84rem;
		font-weight: 500;
		line-height: 1;
		color: var(--fg-strong);
		background: transparent;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.2s var(--ease);
	}

	.cast-chip:hover,
	.cast-chip:focus-visible {
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.cast-face {
		width: 1.3rem;
		height: 1.3rem;
		flex: 0 0 auto;
		border-radius: var(--avatar-radius, 50%);
		object-fit: cover;
		object-position: 50% 18%;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		box-shadow: 0 0 0 1px var(--hairline);
	}

	.cast-face.silhouette {
		object-position: 50% 50%;
		opacity: 0.8;
	}

	.cast-face.blank {
		display: inline-grid;
		place-items: center;
		font-size: 0.68rem;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--who) 30%, transparent);
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
		/* Room for the parallax drift (PARALLAX_PX) so a figure never rides over prose. */
		margin: 1rem 0;
		position: relative;
		z-index: 0;
		overflow-x: clip;
	}

	/* Scroll parallax: the wrapper holds its place in the flow, its figure drifts
	   by --parallax-y (set by the `parallax` attachment). `translate` composes
	   with any transform the figure already has. */
	.inline-art > :global(*),
	.beats :global(.fb-art > *) {
		translate: 0 var(--parallax-y, 0px);
	}

	/*
	   Desktop sticky reel: a modest runway so short prose cannot skip art.
	   --art-n is capped at 2 — a dozen stills on one beat used to inflate
	   this into empty screens, which felt like the page was stuck then jumped.
	   Inline layout skips this — art already sits in the flow.
	*/
	@media (min-width: 821px) {
		.text.has-art {
			min-height: calc(var(--art-n, 1) * min(36vh, 14rem));
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
			width: auto;
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
			padding: 3.25rem max(1.15rem, env(safe-area-inset-right, 0px)) 0
				max(1.15rem, env(safe-area-inset-left, 0px));
		}

		/* Episodes open on the entry head: clear the fixed menu and settings buttons. */
		.script.episodes .entry-head {
			padding-top: max(5rem, calc(env(safe-area-inset-top, 0px) + 4.25rem));
		}

		.content-col {
			order: 2;
			display: contents;
		}

		.entry-head-main {
			padding: 0 0 1.5rem;
			gap: 1.5rem;
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
			font-size: 2rem;
		}

		.props {
			padding: 0 0 1.75rem;
		}

		.entry-thumb {
			padding-bottom: 1.5rem;
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

	}

	@media (max-width: 480px) {
		.year {
			font-size: 0.76rem;
		}

		.episode h2 {
			font-size: 1.75rem;
		}
	}

	/* ————— Title pill: liquid glass (app.css) that drops in once the head is gone ————— */
	.title-pill {
		position: fixed;
		z-index: 91;
		top: max(0.75rem, env(safe-area-inset-top, 0px));
		left: 50%;
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		max-width: min(28rem, calc(100vw - 8rem));
		padding: 0.55rem 1.1rem;
		border-radius: var(--radius-pill);
		color: var(--fg-strong);
		font-family: var(--ui);
		font-size: 0.84rem;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transform: translate3d(-50%, calc(-100% - 1.5rem), 0);
		transition:
			transform 560ms cubic-bezier(0.2, 0.9, 0.25, 1.12),
			opacity 280ms var(--ease);
	}

	.title-pill.in {
		opacity: 1;
		pointer-events: auto;
		transform: translate3d(-50%, 0, 0);
	}

	.title-pill:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.pill-num {
		flex: 0 0 auto;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.pill-title {
		min-width: 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-family: var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.title-pill {
			transition: opacity 200ms ease;
			transform: translate3d(-50%, 0, 0);
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
		bottom: calc(max(1rem, env(safe-area-inset-bottom, 0px)) + 1rem);
		transform: translate3d(-50%, 0.85rem, 0);
		display: flex;
		align-items: center;
		gap: 0.3rem;
		max-width: calc(100vw - 1.5rem);
		padding: 0.3rem;
		border-radius: var(--radius-pill);
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
		bottom: calc(var(--plate-box-h, 9rem) + 1.1rem);
	}

	/* Cinema keeps the pill, lifted clear of the dialogue strip. */
	:global(html.is-cinema.is-in-script) .ep-nav {
		bottom: calc(var(--cin-strip-h) + 3.5rem);
	}

	/* Prev / Next: the pill's two real buttons — filled, arrowed, and obvious when spent. */
	.ep-step {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 2.75rem;
		padding: 0 1.05rem;
		border: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--fg) 9%, transparent);
		color: var(--fg-strong);
		font: inherit;
		font-family: var(--ui);
		font-size: 0.86rem;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			background 0.2s var(--ease),
			border-color 0.2s var(--ease),
			color 0.2s var(--ease),
			transform 0.15s var(--ease),
			opacity 0.2s var(--ease);
	}

	.ep-step.prev {
		padding-left: 0.8rem;
	}

	.ep-step.next {
		padding-right: 0.8rem;
	}

	/* The forward step is the one solid button: the page's ink on its paper. */
	.ep-step.next:not(:disabled) {
		color: var(--bg);
		background: var(--fg-strong);
		border-color: var(--fg-strong);
	}

	.ep-step .material-symbols-outlined {
		font-size: 1.2rem;
		font-variation-settings: 'wght' 600;
		transition: translate 0.2s var(--ease);
	}

	.ep-step:hover:not(:disabled) {
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.ep-step.prev:hover:not(:disabled) .material-symbols-outlined {
		translate: -2px 0;
	}

	.ep-step.next:hover:not(:disabled) .material-symbols-outlined {
		translate: 2px 0;
	}

	.ep-step:active:not(:disabled) {
		transform: scale(0.95);
	}

	.ep-step:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.ep-step:disabled {
		opacity: 0.32;
		background: transparent;
		border-style: dashed;
		cursor: not-allowed;
	}

	/* The episode switcher sits between them and gives way first when space runs out. */
	.ep-pick {
		flex: 0 1 auto;
		min-width: 0;
		max-width: min(18rem, 52vw);
		display: flex;
		font-size: 0.8rem;
	}

	.ep-pick :global(.trigger) {
		width: 100%;
		color: var(--fg);
		font-size: 0.8rem;
	}

	/* Clear the bottom pill in script mode. Immersion already reserves
	   --plate-h on body, which sits below the nav (--plate-box-h). */
	.script.episodes .entry {
		padding-bottom: 7rem;
	}

	@media (max-width: 700px) {
		.ep-nav {
			bottom: calc(max(0.75rem, env(safe-area-inset-bottom, 0px)) + 0.75rem);
		}

		:global(html.is-immersion.is-in-script) .ep-nav {
			bottom: calc(var(--plate-box-h, 9rem) + 0.75rem);
		}

		.ep-step {
			padding: 0 0.85rem;
		}

		.ep-step.prev {
			padding-left: 0.7rem;
		}

		.ep-step.next {
			padding-right: 0.7rem;
		}
	}

	/* Phones: arrows only, so the episode title keeps the room. */
	@media (max-width: 420px) {
		.ep-step {
			width: 2.75rem;
			padding: 0;
			justify-content: center;
		}

		.ep-step.prev,
		.ep-step.next {
			padding: 0;
		}

		.step-label {
			display: none;
		}

		.ep-pick {
			max-width: calc(100vw - 9rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ep-nav {
			transition: opacity 200ms ease;
			transform: translate3d(-50%, 0, 0);
		}

		.ep-step,
		.ep-step .material-symbols-outlined {
			transition: none;
		}
	}

</style>
