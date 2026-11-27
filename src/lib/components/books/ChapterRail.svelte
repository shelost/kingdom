<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import VolumePreview from '$lib/components/books/VolumePreview.svelte';
	import { volumeNth, type BookSeries, type BookVolume } from '$lib/books';
	import { GODKING_PARTS, GODKING_VOLUMES } from '$lib/godKingBooks';
	import { REIGNMAKER_PARTS, REIGNMAKER_VOLUMES } from '$lib/reignmakerBooks';
	import { OURLAND_PARTS, OURLAND_VOLUMES } from '$lib/ourLandBooks';
	import { SEED_PARTS, SEED_VOLUMES } from '$lib/seedBooks';
	import { ALL_SECTIONS } from '$lib/allBooks';
	import type { StoryPart } from '$lib/storyShelf';
	import { PARTS, type DirectoryEpisode } from '$lib/episodeDirectory';
	import {
		EPISODE_KIND_META,
		episodeSideKindsOf,
		episodeTitleTypeOf,
		isFlashbackTitle,
		titleTypeMeta
	} from '$lib/episodeKinds';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { libraryUi, setLibraryDetails, setLibraryThumbs, setLibraryType } from '$lib/libraryUi.svelte';
	import { EP_QUERY, reading } from '$lib/reading.svelte';
	import { volumeCover } from '$lib/posters.svelte';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import { staticAsset } from '$lib/staticAsset.svelte';
	import { setTocFlat, tocUi } from '$lib/tocUi.svelte';
	import { titleLogoSrc } from '$lib/titleLogos';
	import { partId } from '$lib/story';

	let {
		hovered = $bindable<string | null>(null),
		onpick,
		series = 'chronicle'
	}: {
		hovered?: string | null;
		/** Open a volume in the shelf when its chapter heading is chosen. */
		onpick?: (volumeId: string) => void;
		series?: BookSeries;
	} = $props();

	type StoryShelfId = 'godking' | 'reignmaker' | 'ourland' | 'seed';
	const STORY: Record<StoryShelfId, { parts: StoryPart[]; volumes: BookVolume[] }> = {
		godking: { parts: GODKING_PARTS, volumes: GODKING_VOLUMES },
		reignmaker: { parts: REIGNMAKER_PARTS, volumes: REIGNMAKER_VOLUMES },
		ourland: { parts: OURLAND_PARTS, volumes: OURLAND_VOLUMES },
		seed: { parts: SEED_PARTS, volumes: SEED_VOLUMES }
	};

	let ko = $derived(reading.lang === 'ko');
	let story = $derived(
		series === 'godking' || series === 'reignmaker' || series === 'ourland' || series === 'seed'
			? STORY[series]
			: null
	);

	function readHref(queryId: string): string {
		if (queryId.startsWith('/')) return hrefWithNsfw(queryId, page.url);
		return hrefWithNsfw(`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(queryId)}`, page.url);
	}
	let showType = $derived(libraryUi.type);
	let showDetails = $derived(libraryUi.details);
	let showThumbs = $derived(libraryUi.thumbs);
	let flatEpisodes = $derived(
		PARTS.flatMap((part) => part.arcs.flatMap((arc) => arc.chapters.flatMap((chapter) => chapter.episodes)))
	);

	function hrefOf(ep: DirectoryEpisode): string {
		return hrefWithNsfw(`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(ep.queryId)}`, page.url);
	}

	function logoOf(ep: DirectoryEpisode): string | null {
		return titleLogoSrc(ep.title, ko) ?? titleLogoSrc(ep.title, !ko);
	}
</script>

<div class="chapter-rail">
	<div class="rail-body">
	{#snippet epRow(ep: DirectoryEpisode)}
		{@const logo = logoOf(ep)}
		{@const heading = ko && ep.ko ? ep.ko : ep.title}
		{@const titleType = showType ? episodeTitleTypeOf(ep.entry) : null}
		{@const sideKinds = showDetails ? episodeSideKindsOf(ep.entry) : []}
		{@const flash = showDetails && isFlashbackTitle(ep.entry)}
		{@const thumb = showThumbs ? episodeThumbnail(ep.entry, ep.id) : null}
		<li data-story-id={ep.id}>
			<a
				class={['row', { flash, 'with-thumb': !!thumb, 'with-logo': !!logo }]}
				href={hrefOf(ep)}
			>
				{#if thumb}
					<img class="ep-thumb" src={staticAsset(thumb.src) ?? thumb.src} alt="" />
				{/if}
				{#if logo}
					<img class="title-logo" src={staticAsset(logo) ?? logo} alt="" />
				{/if}
				<span class="main">
					<span class="num">{ep.number}</span>
					<span class="title-cluster">
						<span class="title">{heading}</span>
						{#if titleType}
							{@const tm = titleTypeMeta(titleType)}
							<span
								class="type-mark material-symbols-outlined filled"
								style:color={tm.color}
								title={ko ? tm.ko : tm.label}
								aria-label={ko ? tm.ko : tm.label}>{tm.icon}</span
							>
						{/if}
					</span>
				</span>
				<span class="aside">
					{#if ep.year}<span class="year">{ep.year}</span>{/if}
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
	{/snippet}

	{#if series === 'all'}
		{#each ALL_SECTIONS as section (section.id)}
			<section class="part" aria-label={ko ? section.ko : section.en}>
				<h2>
					<span class="head-title">{ko ? section.ko : section.en}</span>
				</h2>
				{#each section.rows as row, ri (`${section.id}-${row.part}-${ri}`)}
					<section class="arc">
						{#if row.title}
							<h3>
								<span class="head-title">{ko && row.korean ? row.korean : row.title}</span>
							</h3>
						{/if}
						{#each row.volumes as volume (volume.id)}
							<section class="volume">
								<div class="chapter-head">
									{#if onpick}
										<button
											type="button"
											class={['vol-open', { on: hovered === volume.id }]}
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
												<span class="chapter-line">{ko && volume.ko ? volume.ko : volume.title}</span>
											</span>
										</button>
									{/if}
								</div>
								<ol class="list">
									{#each volume.chapters as ep (ep.id)}
										<li>
											<a class={['row', 'with-thumb']} href={readHref(ep.queryId)}>
												<span class="ep-thumb slot" aria-hidden="true"></span>
												<span class="main">
													<span class="num">{ep.number}</span>
													<span class="title-cluster">
														<span class="title">{ko && ep.ko ? ep.ko : ep.title}</span>
													</span>
												</span>
												<span class="aside">
													{#if ep.year}<span class="year">{ep.year}</span>{/if}
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
	{:else if story}
		{#each story.parts as part (part.id)}
			<section class="part">
				<h2>
					<span class="head-title">{ko && part.ko ? part.ko : part.title}</span>
					{#if part.years}<span class="head-years">{part.years}</span>{/if}
				</h2>
				{#each part.arcs as arc (arc.id)}
					<section class={['arc', { bare: arc.title === part.title }]}>
						{#if arc.title !== part.title}
							<h3>
								<span class="head-title">{ko && arc.ko ? arc.ko : arc.title}</span>
							</h3>
						{/if}
						{#each arc.volumes as vol (vol.id)}
							{@const volume = story.volumes.find((v) => v.id === vol.id)}
							<section class="volume">
								<div class="chapter-head">
									{#if onpick && volume}
										<button
											type="button"
											class={['vol-open', { on: hovered === volume.id }]}
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
												<span class="chapter-line">{ko ? vol.ko : vol.title}</span>
											</span>
										</button>
									{/if}
								</div>
								<ol class="list">
									{#each vol.leaves as ep (ep.id)}
										<li>
											<a class={['row', 'with-thumb', { flash: ep.flashback }]} href={ep.href}>
												<span class="ep-thumb slot" aria-hidden="true"></span>
												<span class="main">
													<span class="num">{ep.number}</span>
													<span class="title-cluster">
														<span class="title">{ko && ep.ko ? ep.ko : ep.title}</span>
														{#if ep.hook && ep.hook !== ep.title}<span class="blurb">{ep.hook}</span>{/if}
													</span>
												</span>
												<span class="aside">
													{#if ep.year}<span class="year">{ep.year}</span>{/if}
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
	{:else if tocUi.flat}
		<ol class="list flat">
			{#each flatEpisodes as ep (ep.id)}
				{@render epRow(ep)}
			{/each}
		</ol>
	{:else}
	{#each PARTS as part (part.id)}
		<section class="part" aria-labelledby={`part-${part.id}`} data-story-id={partId(part.id)}>
			<h2 id={`part-${part.id}`}>
				{#if part.title || part.korean}
					<span class="head-title">{ko && part.korean ? part.korean : part.title}</span>
				{/if}
			</h2>

			{#each part.arcs as arc (arc.id)}
				<section class="arc" aria-labelledby={arc.anchor} data-story-id={arc.id}>
					{#if arc.title}
						<h3 id={arc.anchor}>
							<span class="head-title">{ko && arc.korean ? arc.korean : arc.title}</span>
						</h3>
					{/if}

					{#each arc.chapters as chapter, s (`${chapter.anchor ?? arc.id}#${s}`)}
						{@const nth = chapter.anchor
							? arc.chapters.slice(0, s).filter((c) => c.anchor === chapter.anchor).length
							: 0}
						{@const volume = chapter.anchor ? volumeNth(chapter.anchor, nth) : undefined}
						<!-- A chapter can resume after a loose episode, so only its first run owns the id. -->
						{@const headId =
							chapter.anchor && arc.chapters.findIndex((c) => c.anchor === chapter.anchor) === s
								? chapter.anchor
								: undefined}
						<section class="volume" aria-labelledby={headId} data-story-id={chapter.anchor}>
							{#if chapter.anchor}
								<div class="chapter-head">
									{#if volume && onpick}
										<button
											type="button"
											class={['vol-open', { on: hovered === volume.id }]}
											id={headId}
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
												<span class="chapter-line">{ko ? chapter.ko : chapter.label}</span>
											</span>
										</button>
									{:else}
										<h4 id={headId}>
											<span class="chapter-line">{ko ? chapter.ko : chapter.label}</span>
										</h4>
									{/if}
								</div>
							{/if}
							<ol class="list">
								{#each chapter.episodes as ep (ep.id)}
									{@render epRow(ep)}
								{/each}
							</ol>
						</section>
					{/each}
				</section>
			{/each}
		</section>
	{/each}
	{/if}
	</div>
	<div class="toc-foot">
		<button
			type="button"
			class="flat-toggle"
			aria-pressed={tocUi.flat}
			aria-label={ko ? '화를 목록으로' : 'Chapters as a list'}
			onclick={() => setTocFlat(!tocUi.flat)}
		>
			<span class={['flat-switch', { on: tocUi.flat }]} aria-hidden="true"></span>
			<span>{ko ? '목록' : 'List'}</span>
		</button>
		<button
			type="button"
			class="flat-toggle"
			aria-pressed={libraryUi.type}
			aria-label={ko ? '유형 표시' : 'Show type'}
			onclick={() => setLibraryType(!libraryUi.type)}
		>
			<span class={['flat-switch', { on: libraryUi.type }]} aria-hidden="true"></span>
			<span>{ko ? '유형' : 'Type'}</span>
		</button>
		<button
			type="button"
			class="flat-toggle"
			aria-pressed={libraryUi.details}
			aria-label={ko ? '세부 표시' : 'Show details'}
			onclick={() => setLibraryDetails(!libraryUi.details)}
		>
			<span class={['flat-switch', { on: libraryUi.details }]} aria-hidden="true"></span>
			<span>{ko ? '세부' : 'Details'}</span>
		</button>
		<button
			type="button"
			class="flat-toggle"
			aria-pressed={libraryUi.thumbs}
			aria-label={ko ? '썸네일 표시' : 'Show thumbnails'}
			onclick={() => setLibraryThumbs(!libraryUi.thumbs)}
		>
			<span class={['flat-switch', { on: libraryUi.thumbs }]} aria-hidden="true"></span>
			<span>{ko ? '썸네일' : 'Thumbnails'}</span>
		</button>
	</div>
</div>

<style lang="scss">
	/* Light paper list — titles stay black; not `.rail` (app.css stripe). */

	.chapter-rail {
		--ink: var(--fg);
		--ink-dim: var(--fg-dim);
		--ink-faint: color-mix(in srgb, var(--fg) 42%, transparent);
		--ink-flash: color-mix(in srgb, var(--fg) 48%, transparent);
		--line: color-mix(in srgb, var(--fg) 10%, transparent);
		display: flex;
		flex-direction: column;
		height: 100%;
		min-width: 0;
		overflow: hidden;
		font-family: var(--ui);
		background: transparent;
		color: var(--ink);
	}

	.rail-body {
		flex: 1;
		min-height: 0;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		padding: 1.1rem 1.35rem 1rem 1.15rem;
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

	h2 .head-title {
		font-family: var(--serif);
		font-size: 1.55rem;
		font-weight: 520;
		letter-spacing: -0.02em;
		line-height: 1.15;
		color: var(--ink);
	}

	.head-years {
		font-family: var(--ui);
		font-size: 0.75rem;
		letter-spacing: 0.04em;
		color: var(--ink-dim);
	}

	h3 .head-title {
		font-family: var(--serif);
		font-size: 1.12rem;
		font-weight: 500;
		line-height: 1.2;
		color: var(--ink);
	}

	.head-title {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 500;
		color: var(--ink);
	}

	.arc {
		margin-top: 1.25rem;
		&.bare {
			margin-top: 0;
		}
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

	.chapter-line {
		font-family: var(--serif);
		font-size: 1.02rem;
		font-weight: 500;
		line-height: 1.25;
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
		gap: 0.55rem 0.85rem;
		align-items: center;
		padding: 0.55rem 0.35rem;
		border-radius: 0.4rem;
		color: inherit;
		text-decoration: none;
		transition: background 160ms ease;
		&:hover {
			background: color-mix(in srgb, var(--fg) 4%, transparent);
		}
		&.with-logo:not(.with-thumb) {
			grid-template-columns: 9.5rem minmax(0, 1.15fr) minmax(6.2rem, 0.7fr);
		}
		&.with-thumb:not(.with-logo) {
			grid-template-columns: 11rem minmax(0, 1.15fr) minmax(6.2rem, 0.7fr);
		}
		&.with-thumb.with-logo {
			grid-template-columns: 8.5rem 8rem minmax(0, 1fr) minmax(5.4rem, 0.55fr);
		}
	}

	.ep-thumb {
		display: block;
		width: 100%;
		max-width: 11rem;
		height: auto;
		aspect-ratio: 2 / 1;
		justify-self: start;
		object-fit: cover;
		border-radius: 0.3rem;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.toc-foot {
		flex: 0 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem 0.85rem;
		padding: 0.45rem 1rem calc(0.55rem + var(--tabbar-space, 0px));
		border-top: 1px solid var(--line);
	}

	.flat-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.2rem 0.15rem;
		border: 0;
		background: transparent;
		color: var(--ink-dim);
		font: inherit;
		font-size: 11px;
		letter-spacing: 0.04em;
		cursor: pointer;
		&:hover, &:focus-visible {
			color: var(--ink);
			outline: none;
		}
	}

	.flat-switch {
		position: relative;
		width: 1.55rem;
		height: 0.9rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 18%, transparent);
		&::after {
			content: '';
			position: absolute;
			top: 0.12rem;
			left: 0.12rem;
			width: 0.66rem;
			height: 0.66rem;
			border-radius: 50%;
			background: var(--fg-faint);
			transition: transform 0.25s var(--ease, ease);
		}
		&.on {
			background: color-mix(in srgb, var(--gold) 50%, transparent);
			&::after {
				transform: translateX(0.62rem);
				background: var(--gold);
			}
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
		align-content: center;
		gap: 0.15rem 0.35rem;
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
		width: 100%;
		max-width: 9.5rem;
		height: auto;
		aspect-ratio: 1080 / 640;
		justify-self: start;
		align-self: center;
		object-fit: contain;
		object-position: left center;
		border-radius: 0.3rem;
	}

	.slot {
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--fg) 5%, transparent), transparent 70%),
			color-mix(in srgb, var(--fg) 7%, transparent);
		border: 1px solid color-mix(in srgb, var(--fg) 10%, transparent);
	}

	.blurb {
		flex: 1 0 100%;
		font-family: var(--ui);
		font-size: 0.75rem;
		line-height: 1.35;
		color: var(--ink-dim);
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
		.row.with-thumb:not(.with-logo) {
			grid-template-columns: 7.2rem minmax(0, 1fr);
		}
		.row.with-logo:not(.with-thumb) {
			grid-template-columns: 6.4rem minmax(0, 1fr);
		}
		.row.with-thumb.with-logo {
			grid-template-columns: 5.6rem 5.2rem minmax(0, 1fr);
		}
		.row.with-thumb.with-logo .main,
		.row.with-thumb.with-logo .aside {
			grid-column: 1 / -1;
		}
		.aside {
			grid-column: 2 / -1;
			padding-left: 0;
		}
	}
</style>
