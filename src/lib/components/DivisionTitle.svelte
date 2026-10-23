<script lang="ts">
	import { chapters } from '$lib/story';
	import {
		arcLabelAt,
		chapterHeadedBy,
		chapterLabel,
		chapterNumberOf,
		chapterOf,
		tocAnchor
	} from '$lib/tocTree';
	import { episodeNavLabel, episodes, goToEpisode } from '$lib/reading.svelte';
	import { editUi } from '$lib/editUi.svelte';
	import { volumeOf, volumesInArc } from '$lib/books';
	import { posterAlts, posterSrc } from '$lib/posters.svelte';
	import CoverAlts from './books/CoverAlts.svelte';
	import VolumePreview from './books/VolumePreview.svelte';

	let {
		scale,
		arcIndex,
		storyId,
		ko = false,
		section
	}: {
		scale: 'arc' | 'chapter';
		arcIndex: number;
		storyId: string;
		ko?: boolean;
		/** Episode title that opens the Chapter, when `scale` is `chapter`. */
		section?: string;
	} = $props();

	let arc = $derived(chapters[arcIndex]);
	let toc = $derived(section ? chapterHeadedBy(arc.id, section) : undefined);
	let entries = $derived(
		scale === 'arc' ? arc.entries : arc.entries.filter((en) => toc?.titles.includes(en.title))
	);

	let eyebrow = $derived.by(() => {
		if (scale === 'arc') return arcLabelAt(arcIndex, ko);
		const n = toc ? chapterNumberOf(toc) : null;
		return n ? chapterLabel(n, ko) : ko ? '장' : 'Chapter';
	});

	let lead = $derived(
		scale === 'arc' ? (ko && arc.korean) || arc.title : (ko && toc?.ko) || toc?.label || ''
	);
	let second = $derived(
		scale === 'arc' ? (ko ? arc.title : arc.korean) : ko ? toc?.label : toc?.ko
	);
	let hanja = $derived(scale === 'arc' ? arc.hanja : undefined);

	let meta = $derived.by(() => {
		const n = entries.length;
		const eps = ko ? '화' : n === 1 ? 'episode' : 'episodes';
		if (scale === 'chapter') return `${n} ${eps}`;
		const chaptersHere = arc.entries.filter((en) => chapterOf(arc.id, en.title)?.titles[0] === en.title).length;
		const chs = ko ? '장' : chaptersHere === 1 ? 'chapter' : 'chapters';
		const bits = [`${chaptersHere} ${chs}`, `${n} ${eps}`];
		if (arc.range) bits.unshift(arc.range);
		return bits.join(' · ');
	});

	let index = $derived(episodes.findIndex((ep) => ep.id === storyId));
	let next = $derived(index >= 0 ? episodes[index + 1] : undefined);
	let bookId = $derived(scale === 'arc' ? arc.id : toc ? tocAnchor(arc.id, toc) : '');
	let volume = $derived(scale === 'chapter' ? volumeOf(bookId) : undefined);
	let boxed = $derived(scale === 'arc' ? volumesInArc(arc.id) : volume ? [volume] : []);
	let art = $derived(bookId ? posterSrc(bookId) : undefined);
	let alts = $derived(bookId ? posterAlts(bookId) : []);
	let showAlts = $derived(editUi.enabled && alts.length > 0);
	let bookH = $derived(scale === 'arc' ? 22 : 18.5);
</script>

<article
	class="division"
	class:arc={scale === 'arc'}
	class:chapter={scale === 'chapter'}
	class:edit={showAlts}
	data-story-id={storyId}
>
	<div class="stage">
		{#if volume || art || boxed.length}
			<div class="book float-up" style:--i={0}>
				<VolumePreview
					{volume}
					volumes={boxed}
					cover={art}
					title={lead}
					number={volume?.number}
					size={scale}
					pose="stand"
					height={bookH}
				/>
			</div>
		{/if}
		<div class="copy">
			<p class="eyebrow float-up" style:--i={1}>{eyebrow}</p>
			{#if lead}<h2 class="division-title float-up" style:--i={2}>{lead}</h2>{/if}
			{#if second && second !== lead}<p class="second float-up" style:--i={3}>{second}</p>{/if}
			{#if hanja}<p class="hanja float-up" style:--i={4}>{hanja}</p>{/if}
			<p class="meta float-up" style:--i={5}>{meta}</p>
			{#if next}
				<button type="button" class="read float-up" style:--i={6} onclick={() => goToEpisode(index + 1)}>
					<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
					<span>{episodeNavLabel(next)}</span>
				</button>
			{/if}
		</div>
	</div>
	{#if showAlts && bookId}
		<aside class="alts-col float-up" style:--i={1} aria-label="Covers">
			<CoverAlts id={bookId} layout="stack" persist />
		</aside>
	{/if}
</article>

<style>
	.division {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: center;
		justify-items: center;
		margin: 3.2rem auto 2.4rem;
		padding: 0 1.2rem;
		text-align: center;
	}

	.division.arc {
		max-width: 54rem;
	}

	.division.chapter {
		max-width: 40rem;
		margin-top: 2.2rem;
	}

	.division.edit {
		max-width: 64rem;
		grid-template-columns: minmax(0, 1fr) minmax(10.5rem, 13.5rem);
		column-gap: 1.4rem;
		align-items: stretch;
	}

	:global(.script.episodes) .division {
		min-height: 100dvh;
		box-sizing: border-box;
		margin: 0 auto;
		padding: max(5.25rem, calc(env(safe-area-inset-top, 0px) + 3.6rem)) 1.5rem
			max(3rem, calc(env(safe-area-inset-bottom, 0px) + 2rem));
	}

	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 0;
		width: 100%;
	}

	.book {
		display: flex;
		justify-content: center;
	}

	.alts-col {
		min-width: 0;
		align-self: stretch;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: start;
		padding: 0.2rem 0 0.2rem 1.1rem;
		border-left: 1px solid var(--hairline);
	}

	.copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 0;
		margin-top: 1.25rem;
	}

	.eyebrow {
		margin: 0 0 0.45rem;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.division-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
		text-wrap: balance;
	}

	.arc .division-title {
		font-size: clamp(2rem, 4.4vw, 3.4rem);
	}

	.chapter .division-title {
		font-size: clamp(1.45rem, 3vw, 2.15rem);
	}

	.second,
	.hanja {
		margin: 0;
		font-family: 'Noto Serif KR', serif;
		font-weight: 500;
		line-height: 1.25;
		color: var(--fg-strong);
	}

	.second {
		margin-top: 0.7rem;
		font-size: clamp(0.95rem, 1.6vw, 1.2rem);
	}

	:global(html:not([data-lang='ko'])) .second {
		font-family: var(--display-ko);
		font-weight: 400;
		font-size: clamp(1.3rem, 2.4vw, 1.7rem);
		letter-spacing: 0;
	}

	.hanja {
		margin-top: 0.2rem;
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		color: var(--gold);
	}

	.meta {
		margin: 0.9rem 0 0;
		font-size: 0.78rem;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}

	.read {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.2rem;
		padding: 0.55rem 1rem 0.55rem 0.8rem;
		font: inherit;
		font-size: 0.82rem;
		font-weight: var(--weight-strong);
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--bg) 62%, transparent);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		box-shadow: var(--shadow-pill);
		cursor: pointer;
	}

	.read:hover {
		background: color-mix(in srgb, var(--bg) 82%, transparent);
	}

	.read:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 3px;
	}

	.read .material-symbols-outlined {
		font-size: 1.05rem;
	}

	@media (max-width: 720px) {
		.division.edit {
			grid-template-columns: minmax(0, 1fr);
			max-width: 40rem;
		}

		.alts-col {
			border-left: 0;
			border-top: 1px solid var(--hairline);
			padding: 1.1rem 0 0;
			margin-top: 1.4rem;
			max-width: 22rem;
			width: 100%;
		}

		.alts-col :global(.stack .scroller) {
			max-height: none;
		}

		.alts-col :global(.stack ul) {
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
		}

		.alts-col :global(.stack li) {
			flex: 0 0 5.2rem;
			width: 5.2rem;
		}
	}
</style>
