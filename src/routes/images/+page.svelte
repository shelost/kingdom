<script lang="ts">
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import type { Attachment } from 'svelte/attachments';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		findOrphanedImages,
		flattenStoryImages,
		type OrphanedImage,
		type StoryCueImage
	} from '$lib/storyImages';
	import type { GalleryDeleteItem } from '$lib/galleryDelete';
	import { storyImg } from '$lib/img';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import { deleteGalleryItems, editUi, permanentlyDeleteImage } from '$lib/editUi.svelte';
	import { isReferenceImage } from '$lib/imageStars';
	import { ensureStars, isStarred, starKey } from '$lib/imageStarsUi.svelte';
	import { openImageMenu } from '$lib/imageMenu.svelte';
	import { entryId } from '$lib/story';

	type GridCell = {
		key: string;
		kind: 'cue' | 'orphan';
		id: string;
		title: string;
		year: string;
		src: string;
		alt: string;
		tone: string;
		episodeId?: string;
		filename: string;
		/** Empty for reference boards — those never star. */
		starKey: string;
	};

	function fileNameOf(src: string, fallback: string): string {
		const base = src.split('?')[0] ?? '';
		return base.split('/').pop() ?? fallback;
	}

	/** Intimate stills never show on this page; neither do slots with no art yet. */
	function cueCell(im: StoryCueImage): GridCell | null {
		if (im.isNsfw || !im.displayArt) return null;
		return {
			key: im.key,
			kind: 'cue',
			id: im.slot.id,
			title: im.title,
			year: im.entryYear,
			src: im.displayArt,
			alt: im.slot.alt ?? im.title,
			tone: im.slot.tone ?? '#3a3a40',
			episodeId: entryId(im.chapterId, im.entryTitle),
			filename: fileNameOf(im.displayArt, im.slot.id),
			starKey: starKey(im.displayArt, im.slot.id)
		};
	}

	function orphanCell(o: OrphanedImage): GridCell | null {
		if (/nsfw/i.test(`${o.id} ${o.src}`)) return null;
		return {
			key: `orphan:${o.src}`,
			kind: 'orphan',
			id: o.id,
			title: o.id,
			year: o.kind,
			src: o.src,
			alt: o.id,
			tone: '#3a3a40',
			filename: fileNameOf(o.src, o.id),
			starKey: isReferenceImage(o.src) ? '' : starKey(o.src)
		};
	}

	let images = $state.raw(flattenStoryImages());
	let orphans = $state.raw(findOrphanedImages());
	let query = $state('');
	let starredOnly = $state(false);
	let selecting = $state(false);
	let confirmOpen = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');
	const selected = new SvelteSet<string>();

	function reloadCatalog() {
		images = flattenStoryImages();
		orphans = findOrphanedImages();
	}

	if (import.meta.hot) {
		import.meta.hot.accept(() => {
			reloadCatalog();
		});
	}

	$effect(() => {
		void ensureStars();
	});

	const present = <T,>(x: T | null): x is T => x !== null;

	/** Unattached files are a maintenance view, so they only appear in edit mode. */
	const cells = $derived.by(() => [
		...images.filter((im) => !editUi.removedCueIds.has(im.slot.id)).map(cueCell).filter(present),
		...(editUi.enabled
			? orphans.filter((o) => !editUi.removedOrphanIds.has(o.id)).map(orphanCell).filter(present)
			: [])
	]);
	const starredCount = $derived(cells.filter((c) => isStarred(c.starKey)).length);
	/** Starred stills lead; reading order holds within each half. */
	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		const pool = cells.filter(
			(c) =>
				(!starredOnly || isStarred(c.starKey)) &&
				(!q || [c.id, c.title, c.year, c.alt, c.filename].join(' ').toLowerCase().includes(q))
		);
		return [...pool.filter((c) => isStarred(c.starKey)), ...pool.filter((c) => !isStarred(c.starKey))];
	});
	const picked = $derived(cells.filter((c) => selected.has(c.key)));
	const extraNames = $derived(Math.max(0, picked.length - 12));

	function toggleSelectMode() {
		selecting = !selecting;
		if (!selecting) {
			selected.clear();
			confirmOpen = false;
			deleteError = '';
		}
	}

	function toggleKey(key: string) {
		if (selected.has(key)) selected.delete(key);
		else selected.add(key);
	}

	function onThumbClick(e: MouseEvent, cell: GridCell) {
		if (editUi.enabled && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			if (!selecting) selecting = true;
			toggleKey(cell.key);
			return;
		}
		openCell(cell, e.currentTarget);
	}

	function deleteItemOf(cell: GridCell): GalleryDeleteItem {
		return cell.kind === 'cue' ? { kind: 'cue', slotId: cell.id } : { kind: 'orphan', id: cell.id };
	}

	function onThumbMenu(e: MouseEvent, cell: GridCell) {
		if (!cell.starKey) return;
		openImageMenu(e, {
			label: cell.id,
			starKey: cell.starKey,
			remove: () => permanentlyDeleteImage(deleteItemOf(cell))
		});
	}

	function openCell(cell: GridCell, from?: EventTarget | null) {
		const items = visible.map((row) => ({
			src: row.src,
			alt: row.alt,
			title: row.title,
			caption: row.id,
			nsfw: false,
			episodeId: row.episodeId
		}));
		const index = visible.findIndex((row) => row.key === cell.key);
		openLightbox(items, Math.max(0, index), from);
	}

	function openConfirm() {
		if (!picked.length) return;
		deleteError = '';
		confirmOpen = true;
	}

	function closeConfirm() {
		if (deleting) return;
		confirmOpen = false;
		deleteError = '';
	}

	const mountConfirm: Attachment<HTMLDialogElement> = (node) => {
		const frame = requestAnimationFrame(() => {
			if (!node.isConnected) return;
			if (!node.open) node.showModal();
		});
		return () => {
			cancelAnimationFrame(frame);
			if (node.open) node.close();
		};
	};

	function onConfirmBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) closeConfirm();
	}

	async function confirmDelete() {
		if (!picked.length || deleting) return;
		deleting = true;
		deleteError = '';
		try {
			const result = await deleteGalleryItems(picked.map(deleteItemOf));
			if (!result.ok) {
				deleteError = result.message;
				return;
			}
			selected.clear();
			confirmOpen = false;
			selecting = false;
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Images · King for All</title>
</svelte:head>

<main class="page">
	<SiteNavSpace />

	<header class="mast">
		<div class="titles">
			<h1>Images</h1>
			<p class="count">
				{query.trim() || starredOnly ? `${visible.length} of ${cells.length}` : cells.length} stills{#if starredCount}
					<span class="dot" aria-hidden="true">·</span>{starredCount} starred{/if}
			</p>
		</div>
		<div class="tools">
			<label class="search">
				<span class="material-symbols-outlined" aria-hidden="true">search</span>
				<span class="sr-only">Search stills</span>
				<input type="search" placeholder="Search" bind:value={query} />
			</label>
			{#if starredCount}
				<button
					type="button"
					class="chip"
					class:active={starredOnly}
					aria-pressed={starredOnly}
					onclick={() => (starredOnly = !starredOnly)}
				>
					<span aria-hidden="true">★</span> Starred
				</button>
			{/if}
			{#if editUi.enabled}
				<button type="button" class="chip" class:active={selecting} aria-pressed={selecting} onclick={toggleSelectMode}>
					{selecting ? 'Done' : 'Select'}
				</button>
				{#if selecting}
					<button type="button" class="chip danger" disabled={!picked.length || deleting} onclick={openConfirm}>
						Delete{picked.length ? ` ${picked.length}` : ''}
					</button>
				{/if}
			{/if}
		</div>
	</header>

	<section class="grid" aria-label="Stills">
		{#each visible as im (im.key)}
			<article class="card" class:picked={selected.has(im.key)}>
				{#if selecting}
					<label class="pick">
						<span class="sr-only">Select {im.title}</span>
						<input type="checkbox" checked={selected.has(im.key)} onchange={() => toggleKey(im.key)} />
					</label>
				{/if}
				<button
					type="button"
					class="thumb"
					style:--tone={im.tone}
					aria-label={`Open ${im.title}`}
					onclick={(e) => onThumbClick(e, im)}
					oncontextmenu={(e) => onThumbMenu(e, im)}
				>
					<img {...storyImg(im.src, { kind: 'thumb', alt: im.alt, sizes: '16rem', widths: [256, 384, 512] })} />
					{#if isStarred(im.starKey)}
						<span class="star" aria-label="Starred">★</span>
					{/if}
				</button>
				<p class="title">{im.title}</p>
				<p class="year">{im.year}</p>
			</article>
		{:else}
			<p class="empty">No stills match.</p>
		{/each}
	</section>
</main>

{#if confirmOpen}
	<dialog
		class="confirm"
		aria-labelledby="delete-title"
		{@attach mountConfirm}
		onclick={onConfirmBackdrop}
		oncancel={(e) => {
			if (deleting) e.preventDefault();
		}}
		onclose={closeConfirm}
	>
		<div class="confirm-sheet">
			<h2 id="delete-title">Delete {picked.length} still{picked.length === 1 ? '' : 's'}?</h2>
			<p class="confirm-copy">
				Permanent. Files under <code>static/</code> are removed, and chronicle slots are cleared
				so they do not come back on reload. Portraits (<code>ch_*.png</code>) are never deleted.
			</p>
			<ul class="confirm-files">
				{#each picked.slice(0, 12) as cell (cell.key)}
					<li>{cell.filename}</li>
				{/each}
			</ul>
			{#if extraNames}
				<p class="confirm-more">and {extraNames} more</p>
			{/if}
			{#if deleteError}
				<p class="confirm-error" role="alert">{deleteError}</p>
			{/if}
			<div class="confirm-actions">
				<button type="button" class="chip" disabled={deleting} onclick={closeConfirm}>Cancel</button>
				<button type="button" class="chip danger" disabled={deleting} onclick={confirmDelete}>
					{deleting ? 'Deleting…' : 'Delete permanently'}
				</button>
			</div>
		</div>
	</dialog>
{/if}

<style>
	.page {
		min-height: 100dvh;
		max-width: 76rem;
		margin: 0 auto;
		padding: 0 max(1.25rem, env(safe-area-inset-right, 0px) + 1rem)
			calc(4rem + var(--tabbar-space, 0px)) max(1.25rem, env(safe-area-inset-left, 0px) + 1rem);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		color: var(--fg);
	}

	.mast {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem 1.5rem;
		padding: 2.75rem 0 1.75rem;
	}

	h1 {
		margin: 0;
		font-family: var(--ui);
		font-size: clamp(1.6rem, 3vw, 2rem);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--fg-strong);
	}

	.count {
		margin: 0.35rem 0 0;
		font-size: 0.82rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--fg-dim);
	}

	.dot {
		margin: 0 0.4rem;
		opacity: 0.5;
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.search {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0 0.85rem 0 0.7rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		color: var(--fg-dim);
	}

	.search:focus-within {
		border-color: var(--fg-dim);
	}

	.search .material-symbols-outlined {
		font-size: 1.05rem;
	}

	.search input {
		width: min(14rem, 52vw);
		padding: 0.45rem 0;
		border: none;
		background: transparent;
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.85rem;
		outline: none;
	}

	.search input::placeholder {
		color: var(--fg-faint);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.45rem 0.9rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg-dim);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			color 0.2s var(--ease),
			background-color 0.2s var(--ease),
			border-color 0.2s var(--ease);
	}

	.chip:hover:not(:disabled) {
		color: var(--fg-strong);
		border-color: var(--fg-dim);
	}

	.chip.active {
		color: var(--bg);
		background: var(--fg-strong);
		border-color: var(--fg-strong);
	}

	.chip.danger {
		color: #fff;
		background: #9f1239;
		border-color: #9f1239;
	}

	.chip:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.chip:focus-visible,
	.thumb:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 1.75rem 1.1rem;
	}

	.card {
		position: relative;
		min-width: 0;
	}

	.thumb {
		position: relative;
		display: block;
		width: 100%;
		margin: 0 0 0.6rem;
		padding: 0;
		aspect-ratio: 2 / 1;
		overflow: hidden;
		border: none;
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--tone) 40%, var(--panel-sunken));
		cursor: zoom-in;
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s var(--ease);
	}

	.thumb:hover img {
		transform: scale(1.03);
	}

	.card.picked .thumb {
		outline: 2px solid var(--fg-strong);
		outline-offset: 2px;
	}

	.star {
		position: absolute;
		top: 0.45rem;
		right: 0.5rem;
		font-size: 0.85rem;
		line-height: 1;
		color: #fff;
		text-shadow: 0 1px 6px rgb(0 0 0 / 0.6);
	}

	.pick {
		position: absolute;
		z-index: 2;
		top: 0.45rem;
		left: 0.45rem;
		display: grid;
		place-items: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--bg) 80%, transparent);
	}

	.pick input {
		margin: 0;
		accent-color: var(--fg-strong);
		cursor: pointer;
	}

	.title {
		margin: 0;
		font-size: 0.88rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--fg-strong);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.year {
		margin: 0.15rem 0 0;
		font-size: 0.76rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.empty {
		grid-column: 1 / -1;
		margin: 3rem 0;
		text-align: center;
		color: var(--fg-dim);
	}

	.confirm {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		border: none;
		background: rgb(8 8 10 / 0.6);
		color: inherit;
	}

	.confirm::backdrop {
		background: transparent;
	}

	.confirm-sheet {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: min(28rem, calc(100vw - 2rem));
		padding: 1.25rem 1.3rem 1.1rem;
		border-radius: var(--radius);
		background: var(--panel);
		box-shadow: 0 18px 40px rgb(0 0 0 / 0.35);
		font-family: var(--ui);
	}

	.confirm-sheet h2 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.confirm-copy {
		margin: 0.65rem 0 0;
		font-size: 0.86rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.confirm-files {
		margin: 0.75rem 0 0;
		padding: 0.55rem 0.75rem;
		max-height: 10rem;
		overflow: auto;
		list-style: none;
		font-size: 0.78rem;
		line-height: 1.4;
		background: var(--panel-sunken);
		border-radius: var(--radius);
	}

	.confirm-more {
		margin: 0.4rem 0 0;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.confirm-error {
		margin: 0.65rem 0 0;
		font-size: 0.82rem;
		color: #e11d48;
	}

	.confirm-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	@media (max-width: 700px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
			gap: 1.25rem 0.75rem;
		}
	}
</style>
