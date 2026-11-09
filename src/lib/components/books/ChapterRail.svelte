<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { volumeOf } from '$lib/books';
	import {
		EPISODE_TOTAL,
		PARTS,
		STORY_RANGE,
		type DirectoryEpisode
	} from '$lib/episodeDirectory';
	import {
		EPISODE_KIND_META,
		episodeSideKindsOf,
		episodeTitleTypeOf,
		isFlashbackTitle,
		titleTypeMeta
	} from '$lib/episodeKinds';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { libraryUi } from '$lib/libraryUi.svelte';
	import { EP_QUERY, reading } from '$lib/reading.svelte';
	import { volumeCover } from '$lib/posters.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { titleLogoSrc } from '$lib/titleLogos';
	import { arcLabelAt, chapterLabel, partLabel } from '$lib/tocTree';
	import { partId } from '$lib/story';
	import { ui } from '$lib/uiLang';

	let {
		hovered = $bindable<string | null>(null),
		onpick
	}: {
		hovered?: string | null;
		/** Open a volume in the shelf when its chapter heading is chosen. */
		onpick?: (volumeId: string) => void;
	} = $props();

	let ko = $derived(reading.lang === 'ko');
	let showType = $derived(libraryUi.type);
	let showDetails = $derived(libraryUi.details);

	function hrefOf(ep: DirectoryEpisode): string {
		return hrefWithNsfw(`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(ep.queryId)}`, page.url);
	}

	function synopsis(ep: DirectoryEpisode): string {
		return ko ? ep.synopsis.ko : ep.synopsis.en;
	}

	function logoOf(ep: DirectoryEpisode): string | null {
		return titleLogoSrc(ep.title, ko) ?? titleLogoSrc(ep.title, !ko);
	}
</script>

<div class="chapter-rail">
	<header class="intro">
		<p class="kicker">{ui('Shelf')}</p>
		<h1>{ko ? '편' : 'Chapters'}</h1>
		<p class="meta">
			<span>{STORY_RANGE}</span>
			<span class="sep" aria-hidden="true">·</span>
			<span>{PARTS.length} {ko ? '부' : 'Parts'}</span>
			<span class="sep" aria-hidden="true">·</span>
			<span>{EPISODE_TOTAL} {ko ? '화' : 'episodes'}</span>
		</p>
	</header>

	{#each PARTS as part (part.id)}
		<section class="part" aria-labelledby={`part-${part.id}`} data-story-id={partId(part.id)}>
			<h2 id={`part-${part.id}`}>
				<span class="eyebrow">{partLabel(part.label, ko)}</span>
				<span class="head-line">
					{#if part.title || part.korean}
						<span class="head-title">{ko && part.korean ? part.korean : part.title}</span>
					{/if}
					{#if part.range}<span class="head-range">{part.range}</span>{/if}
				</span>
			</h2>

			{#each part.arcs as arc (arc.id)}
				<section class="arc" aria-labelledby={arc.anchor} data-story-id={arc.id}>
					<h3 id={arc.anchor}>
						<span class="eyebrow">{arcLabelAt(arc.index, ko)}</span>
						<span class="head-line">
							{#if arc.number}<span class="head-title">{arc.title}</span>{/if}
							{#if arc.korean}<span class="head-ko">{arc.korean}</span>{/if}
							{#if arc.range}<span class="head-range">{arc.range}</span>{/if}
						</span>
					</h3>

					{#each arc.chapters as chapter, s (chapter.anchor ?? `${arc.id}-${s}`)}
						{@const volume = chapter.anchor ? volumeOf(chapter.anchor) : undefined}
						<section class="volume" aria-labelledby={chapter.anchor} data-story-id={chapter.anchor}>
							{#if chapter.anchor}
								<div class="chapter-head">
									{#if volume && onpick}
										<button
											type="button"
											class="vol-open"
											class:on={hovered === volume.id}
											id={chapter.anchor}
											onpointerenter={() => (hovered = volume.id)}
											onpointerleave={() => {
												if (hovered === volume.id) hovered = null;
											}}
											onclick={() => onpick(volume.id)}
										>
											<VolumePreview
												{volume}
												cover={volumeCover(volume.id)}
												size="chapter"
												pose="tilt"
												height={4.6}
											/>
											<span class="vol-copy">
												{#if chapter.number}
													<span class="chapter-num">{chapterLabel(chapter.number, ko)}</span>
												{/if}
												<span class="chapter-line">{ko ? chapter.ko : chapter.label}</span>
											</span>
										</button>
									{:else}
										<h4 id={chapter.anchor}>
											{#if chapter.number}
												<span class="chapter-num">{chapterLabel(chapter.number, ko)}</span>
											{/if}
											<span class="chapter-line">{ko ? chapter.ko : chapter.label}</span>
										</h4>
									{/if}
								</div>
							{/if}
							<ol class="list">
								{#each chapter.episodes as ep (ep.id)}
									{@const logo = logoOf(ep)}
									{@const heading = ko && ep.ko ? ep.ko : ep.title}
									{@const titleType = showType ? episodeTitleTypeOf(ep.entry) : null}
									{@const sideKinds = showDetails ? episodeSideKindsOf(ep.entry) : []}
									{@const flash = showDetails && isFlashbackTitle(ep.entry)}
									{@const blurb = synopsis(ep)}
									<li data-story-id={ep.id}>
										<a class="row" class:flash href={hrefOf(ep)}>
											<span class="main">
												<span class="num">{ep.number}</span>
												<span class="title-cluster">
													{#if logo}
														<img
															class="title-logo"
															src={staticAsset(logo) ?? logo}
															alt=""
															aria-hidden="true"
														/>
													{/if}
													<span class="title">{heading}</span>
													{#if titleType}
														{@const tm = titleTypeMeta(titleType)}
														<span
															class="type-mark material-symbols-outlined filled"
															style:color={tm.color}
															title={ko ? tm.ko : tm.label}
															aria-label={ko ? tm.ko : tm.label}
															>{tm.icon}</span
														>
													{/if}
												</span>
											</span>
											<span class="aside">
												<span class="facts">
													{#if ep.year}<span class="year">{ep.year}</span>{/if}
													<span class="dur">{ep.minutes}{ko ? '분' : ' min'}</span>
												</span>
												{#if blurb}<span class="synopsis">{blurb}</span>{/if}
												{#if sideKinds.length}
													<span class="side-kinds" aria-hidden="true">
														{#each sideKinds as k (k)}
															{@const meta = EPISODE_KIND_META[k]}
															<span
																class="material-symbols-outlined filled"
																style:color={meta.color}
																title={ko ? meta.ko : meta.label}>{meta.icon}</span
															>
														{/each}
													</span>
												{/if}
											</span>
										</a>
									</li>
								{/each}
							</ol>
						</section>
					{/each}
				</section>
			{/each}
		</section>
	{/each}
</div>

<style lang="scss">
	/* Light paper list — titles stay black; not `.rail` (app.css stripe). */

	.chapter-rail {
		--ink: var(--fg);
		--ink-dim: var(--fg-dim);
		--ink-faint: color-mix(in srgb, var(--fg) 42%, transparent);
		--ink-flash: color-mix(in srgb, var(--fg) 48%, transparent);
		--line: color-mix(in srgb, var(--fg) 10%, transparent);
		height: 100%;
		min-width: 0;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		padding: 1.1rem 1.35rem calc(2rem + var(--tabbar-space, 0px)) 1.15rem;
		font-family: var(--ui);
		background: transparent;
		color: var(--ink);
	}

	.intro {
		display: grid;
		gap: 0.35rem;
		padding: 0.35rem 0 1.25rem;
		border-bottom: 1px solid var(--line);
		margin-bottom: 1.15rem;
	}

	.kicker {
		margin: 0;
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #9a7a28;
	}

	h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.65rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: var(--ink);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin: 0;
		font-size: 0.72rem;
		color: var(--ink-dim);
	}

	.sep {
		color: var(--ink-faint);
	}

	.part {
		margin-top: 1.75rem;
		&:first-of-type {
			margin-top: 0;
		}
	}

	h2,
	h3,
	h4 {
		scroll-margin-top: 1rem;
		margin: 0;
	}

	[data-story-id] {
		scroll-margin-top: 1rem;
	}

	h2,
	h3 {
		display: grid;
		gap: 0.2rem;
		margin-bottom: 0.75rem;
	}

	.eyebrow {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.head-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.35rem 0.55rem;
	}

	.head-title {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 500;
		color: var(--ink);
	}

	.head-ko,
	.head-range {
		font-size: 0.72rem;
		color: var(--ink-dim);
	}

	.arc {
		margin-top: 1.25rem;
	}

	.volume {
		margin-top: 0.95rem;
	}

	.chapter-head {
		margin-bottom: 0.45rem;
	}

	.vol-open {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		width: 100%;
		margin: 0;
		padding: 0.35rem 0.4rem 0.35rem 0.2rem;
		border: 0;
		border-radius: 0.55rem;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition: background 160ms ease;
		&:hover, &.on {
			background: color-mix(in srgb, var(--fg) 5%, transparent);
		}
	}

	.vol-copy {
		display: grid;
		gap: 0.15rem;
		min-width: 0;
	}

	.chapter-num {
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #9a7a28;
	}

	.chapter-line {
		font-family: var(--serif);
		font-size: 0.95rem;
		color: var(--ink);
	}

	h4 {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.2rem 0;
	}

	.list {
		display: grid;
		gap: 0.15rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.row {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(7.5rem, 0.85fr);
		gap: 0.65rem 0.85rem;
		align-items: start;
		padding: 0.42rem 0.35rem;
		border-radius: 0.4rem;
		color: inherit;
		text-decoration: none;
		transition: background 160ms ease;
		&:hover {
			background: color-mix(in srgb, var(--fg) 4%, transparent);
		}
	}

	.main {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		min-width: 0;
	}

	.num {
		flex: none;
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-faint);
	}

	.title-cluster {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
		flex-wrap: wrap;
	}

	.title {
		font-family: var(--serif);
		font-size: 0.95rem;
		line-height: 1.25;
		color: var(--fg-strong);
		overflow-wrap: anywhere;
		.row.flash & {
			color: var(--ink-flash);
		}
	}

	.title-logo {
		display: block;
		height: 0.95rem;
		width: auto;
		max-width: 7rem;
		object-fit: contain;
	}

	.type-mark,
	.side-kinds .filled {
		font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
	}

	.type-mark {
		flex: none;
		font-size: 0.95rem;
		line-height: 1;
	}

	.aside {
		display: grid;
		justify-items: start;
		align-content: start;
		gap: 0.2rem;
		min-width: 0;
		text-align: left;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		font-size: 0.68rem;
		color: var(--ink-faint);
	}

	.synopsis {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--ink-dim);
		text-align: left;
	}

	.side-kinds {
		display: inline-flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 0.2rem;
		width: 100%;
		margin-top: 0.1rem;
		& .material-symbols-outlined {
			font-size: 0.85rem;
			line-height: 1;
		}
		& .filled {
			font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
		}
	}

	@media (max-width: 720px) {
		.row {
			grid-template-columns: minmax(0, 1fr);
		}
		.aside {
			padding-left: 1.35rem;
		}
	}
</style>
