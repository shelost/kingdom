<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import gsap from 'gsap';
	import { normalizeHex, volumeOf, type BookEpisode, type BookVolume } from '$lib/books';
	import { editUi } from '$lib/editUi.svelte';
	import { setSpine, spineColor } from '$lib/spine.svelte';
	import { openLightbox, type LightboxItem } from '$lib/imageLightbox.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { episodePosterSrc } from '$lib/posters.svelte';
	import CoverAlts from './CoverAlts.svelte';
	import { EP_QUERY } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';

	let {
		ko,
		selected = null
	}: {
		ko: boolean;
		selected?: string | null;
	} = $props();

	let volume = $derived(volumeOf(selected) ?? null);
	let typingId = $state<string | null>(null);
	let typing = $state('');

	function pickerHex(v: BookVolume): string {
		return spineColor(v.id).toLowerCase();
	}

	function hexText(v: BookVolume): string {
		return typingId === v.id ? typing : spineColor(v.id);
	}

	function onPick(v: BookVolume, raw: string) {
		typingId = null;
		setSpine(v.id, raw);
	}

	function onHexInput(v: BookVolume, raw: string) {
		typingId = v.id;
		typing = raw;
		const hex = normalizeHex(raw);
		if (hex) setSpine(v.id, hex);
	}

	function onHexBlur(v: BookVolume) {
		const hex = normalizeHex(typingId === v.id ? typing : spineColor(v.id));
		if (hex) {
			typing = hex;
			setSpine(v.id, hex);
		} else {
			typingId = null;
		}
	}

	function labelOf(v: BookVolume) {
		return ko ? v.ko || v.title : v.title;
	}

	function secondOf(v: BookVolume) {
		return ko ? v.title : v.ko;
	}

	function chapterTitle(chapter: BookEpisode) {
		return ko ? chapter.ko || chapter.title : chapter.title;
	}

	function lengthOf(chapter: BookEpisode) {
		const step = chapter.words >= 500 ? 100 : 50;
		const n = (Math.round(chapter.words / step) * step).toLocaleString('en-US');
		return ko ? `약 ${n}단어 · ${chapter.minutes}분` : `~${n} words · ${chapter.minutes} min`;
	}

	function posterStack(): LightboxItem[] {
		if (!volume) return [];
		const items: LightboxItem[] = [];
		for (const chapter of volume.chapters) {
			const src = episodePosterSrc(chapter.id);
			if (!src) continue;
			const title = chapterTitle(chapter);
			items.push({ src, alt: title, title, caption: title, nsfw: false, episodeId: chapter.id });
		}
		return items;
	}

	function openEpisodePoster(chapterId: string, from: HTMLElement) {
		const items = posterStack();
		const index = items.findIndex((item) => item.episodeId === chapterId);
		if (index < 0) return;
		openLightbox(items, index, from);
	}

	function fadeIn(node: HTMLElement) {
		gsap.killTweensOf(node);
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			gsap.set(node, { opacity: 1, y: 0 });
			return;
		}
		gsap.fromTo(
			node,
			{ opacity: 0, y: 14 },
			{ opacity: 1, y: 0, duration: 0.48, ease: 'power3.out' }
		);
		return () => gsap.killTweensOf(node);
	}
</script>

<div class="catalog">
	{#if volume}
		{#key volume.id}
			<article class="volume" {@attach fadeIn}>
				<div class="head">
					<p class="pk">{volume.part}</p>
					<p class="voln">{ui('Volume')} {String(volume.number).padStart(2, '0')}</p>
					<h2 class:han={ko}>{labelOf(volume)}</h2>
					{#if secondOf(volume)}
						<p class="second" class:han={!ko}>{secondOf(volume)}</p>
					{/if}
					<p class="meta">
						{volume.range}
						· {volume.episodes}{ko ? '화' : volume.episodes === 1 ? ' episode' : ' episodes'}
						· {volume.minutes}{ko ? '분' : ' min'}
					</p>
					{#if editUi.enabled}
						<label class="spine">
							<span>{ui('Spine')}</span>
							<span class="spine-row">
								<input
									type="color"
									value={pickerHex(volume)}
									aria-label={ui('Spine')}
									oninput={(e) => onPick(volume, e.currentTarget.value)}
								/>
								<input
									type="text"
									class="hex"
									spellcheck="false"
									autocomplete="off"
									maxlength="7"
									value={hexText(volume)}
									aria-label={ui('Hex')}
									oninput={(e) => onHexInput(volume, e.currentTarget.value)}
									onblur={() => onHexBlur(volume)}
								/>
							</span>
						</label>
					{/if}
				</div>
				{#if (ko ? volume.blurb.ko : volume.blurb.en)}
					<p class="blurb">{ko ? volume.blurb.ko || volume.blurb.en : volume.blurb.en}</p>
				{/if}
				<CoverAlts id={volume.id} persist={editUi.enabled} />
				<h3>{ui('Episodes')}</h3>
				<ol>
					{#each volume.chapters as chapter (chapter.id)}
						{@const epPoster = episodePosterSrc(chapter.id)}
						<li>
							{#if epPoster}
								<button
									type="button"
									class="ep-open"
									aria-label={ko ? `${chapterTitle(chapter)} 표지 보기` : `Open ${chapterTitle(chapter)} poster`}
									onclick={(e) => openEpisodePoster(chapter.id, e.currentTarget)}
								>
									<img class="ep-poster" src={epPoster} alt="" />
								</button>
							{:else}
								<span class="ep-poster empty" aria-hidden="true"></span>
							{/if}
							<a
								href={hrefWithNsfw(
									`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(chapter.queryId)}`,
									page.url
								)}
							>
								<span class="line">
									<span class="n">{chapter.number}</span>
									<span class="t" class:han={ko}>{chapterTitle(chapter)}</span>
								</span>
								<span class="len">{lengthOf(chapter)}</span>
							</a>
							<span class="y">{chapter.year}</span>
						</li>
					{/each}
				</ol>
				<a
					class="read"
					href={hrefWithNsfw(
						`${resolve('/read')}?${EP_QUERY}=${encodeURIComponent(volume.queryId)}`,
						page.url
					)}
				>
					{ko ? '처음부터 읽기' : 'Read from the start'}
				</a>
			</article>
		{/key}
	{/if}
</div>

<style>
	.catalog {
		height: 100%;
		min-width: 0;
		overflow-x: hidden;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.15rem 1.75rem calc(2rem + var(--tabbar-space, 0px)) 1.1rem;
		font-family: var(--ui);
	}

	.volume {
		padding: 0 0 1.4rem;
	}

	.head {
		min-width: 0;
	}

	.pk {
		margin: 0;
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--gold);
	}

	.voln {
		margin: 0.35rem 0 0;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	h2 {
		margin: 0.28rem 0 0;
		font-family: var(--serif);
		font-size: 1.55rem;
		font-weight: 500;
		letter-spacing: var(--tracking-display);
		line-height: 1.15;
		color: var(--fg-strong);
		overflow-wrap: break-word;
	}

	h2.han {
		font-family: var(--display-ko);
		font-weight: 400;
		letter-spacing: 0;
	}

	.second {
		margin: 0.35rem 0 0;
		font-family: var(--serif);
		font-size: 1.05rem;
		color: var(--fg-dim);
	}

	.second.han {
		font-family: var(--display-ko);
		letter-spacing: 0;
	}

	.meta {
		margin: 0.5rem 0 0;
		font-size: 0.8rem;
		color: var(--fg-faint);
	}

	.spine {
		display: flex;
		flex-direction: column;
		gap: 0.32rem;
		margin: 0.85rem 0 0;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.spine-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.spine input[type='color'] {
		flex: none;
		width: 1.7rem;
		height: 1.7rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 4px;
		background: none;
		cursor: pointer;
	}

	.spine input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	.spine input[type='color']::-webkit-color-swatch {
		border: 0;
		border-radius: 3px;
	}

	.hex {
		flex: 1 1 auto;
		min-width: 0;
		padding: 0.32rem 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: 4px;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.hex:focus,
	.spine input[type='color']:focus-visible {
		outline: none;
		border-color: var(--gold);
	}

	.blurb {
		margin: 0.7rem 0 0;
		font-family: var(--ui);
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--fg);
	}

	h3 {
		margin: 1.15rem 0 0.4rem;
		font: inherit;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.volume :global(.covers) {
		margin-top: 1.15rem;
	}

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.06rem;
	}

	ol li {
		display: grid;
		grid-template-columns: 3.6rem minmax(0, 1fr) auto;
		gap: 0.5rem;
		align-items: center;
		padding: 0.48rem 0.05rem;
		border-bottom: 1px solid color-mix(in srgb, var(--fg) 8%, transparent);
	}

	ol a {
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
		min-width: 0;
		color: var(--fg);
		text-decoration: none;
	}

	.ep-open {
		padding: 0;
		border: 0;
		background: none;
		border-radius: 3px;
		cursor: zoom-in;
	}

	.ep-open:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.ep-poster {
		display: block;
		width: 3.6rem;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		border-radius: 3px;
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		box-shadow: 0 6px 14px -10px rgba(0, 0, 0, 0.7);
	}

	.ep-poster.empty {
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
		min-width: 0;
	}

	.len {
		font-size: 0.68rem;
		color: var(--fg-faint);
	}

	ol a:hover,
	ol a:focus-visible {
		color: var(--fg-strong);
		outline: none;
	}

	ol a:hover .t,
	ol a:focus-visible .t {
		color: var(--gold);
	}

	.n {
		flex: 0 0 auto;
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		color: var(--gold);
	}

	.t {
		min-width: 0;
		font-family: var(--serif);
		font-size: 0.9rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.t.han {
		font-family: var(--display-ko);
		letter-spacing: 0;
	}

	.y {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.read {
		margin-top: 0.95rem;
		display: inline-flex;
		padding: 0.48rem 0.95rem;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		color: var(--fg-strong);
		text-decoration: none;
		font-size: 0.86rem;
	}

	.read:hover,
	.read:focus-visible {
		background: color-mix(in srgb, var(--gold) 36%, transparent);
		outline: none;
	}

	@media (max-width: 860px) {
		.catalog {
			height: auto;
			max-height: 48vh;
			padding-inline: 1.4rem 1.6rem;
		}
	}
</style>
