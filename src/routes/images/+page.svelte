<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		findOrphanedImages,
		flattenStoryImages,
		type OrphanedImage,
		type StoryCueImage
	} from '$lib/storyImages';
	import type { GalleryDeleteItem, GalleryDeleteResponse } from '$lib/galleryDelete';
	import { storyImg } from '$lib/img';
	import NsfwToggle from '$lib/components/NsfwToggle.svelte';
	import { nsfwAllowed, nsfwUi } from '$lib/nsfwUi.svelte';
	import { openLightbox } from '$lib/imageLightbox.svelte';
	import { entryId } from '$lib/story';

	type GridCell = {
		key: string;
		kind: 'cue' | 'orphan';
		id: string;
		title: string;
		year: string;
		cueLabel: string;
		src: string | undefined;
		alt: string;
		tone: string;
		isNsfw: boolean;
		isTemp: boolean;
		hasGenuineRefs: boolean;
		hasExplicitRefs: boolean;
		isSeedCopy: boolean;
		episodeId?: string;
		filename: string;
		slot?: StoryCueImage['slot'];
	};

	function fileNameOf(src: string | undefined, fallback: string): string {
		if (!src) return fallback;
		const base = src.split('?')[0] ?? '';
		return base.split('/').pop() ?? fallback;
	}

	function cueCell(im: StoryCueImage): GridCell {
		return {
			key: im.key,
			kind: 'cue',
			id: im.slot.id,
			title: im.title,
			year: im.entryYear,
			cueLabel: im.slot.id,
			src: im.displayArt,
			alt: im.slot.alt ?? im.title,
			tone: im.slot.tone ?? '#3a3a40',
			isNsfw: im.isNsfw,
			isTemp: im.isTemp,
			hasGenuineRefs: im.hasGenuineRefs,
			hasExplicitRefs: im.hasExplicitRefs,
			isSeedCopy: im.isSeedCopy,
			episodeId: entryId(im.chapterId, im.entryTitle),
			filename: fileNameOf(im.displayArt, im.slot.id),
			slot: im.slot
		};
	}

	function orphanCell(o: OrphanedImage): GridCell {
		return {
			key: `orphan:${o.src}`,
			kind: 'orphan',
			id: o.id,
			title: o.id,
			year: o.kind,
			cueLabel: o.src,
			src: o.src,
			alt: o.id,
			tone: '#3a3a40',
			isNsfw: /nsfw/i.test(`${o.id} ${o.src}`),
			isTemp: true,
			hasGenuineRefs: false,
			hasExplicitRefs: false,
			isSeedCopy: false,
			filename: fileNameOf(o.src, o.id)
		};
	}

	let images = $state.raw(flattenStoryImages());
	let orphans = $state.raw(findOrphanedImages());
	let query = $state('');
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

	const cells = $derived.by(() => [...images.map(cueCell), ...orphans.map(orphanCell)]);
	const nsfwCount = $derived(cells.filter((c) => c.isNsfw).length);
	const allowed = $derived(
		cells.filter((c) => {
			if (!c.src) return false;
			return c.slot ? nsfwAllowed(c.slot) : nsfwUi.showIntimate || !c.isNsfw;
		})
	);
	const nsfwHidden = $derived(nsfwCount - allowed.filter((c) => c.isNsfw).length);
	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return allowed;
		return allowed.filter((c) => {
			if (q === 'nsfw') return c.isNsfw;
			const hay = [
				c.id,
				c.title,
				c.year,
				c.cueLabel,
				c.alt,
				c.filename,
				c.isNsfw ? 'nsfw intimate erotic close' : '',
				c.kind === 'orphan' ? 'orphan orphaned' : ''
			]
				.join(' ')
				.toLowerCase();
			return hay.includes(q);
		});
	});
	const tempCount = $derived(visible.filter((c) => c.isTemp && c.kind === 'cue').length);
	const refsCount = $derived(visible.filter((c) => c.hasGenuineRefs).length);
	const seedCopyCount = $derived(visible.filter((c) => c.isSeedCopy).length);
	const orphanCount = $derived(visible.filter((c) => c.kind === 'orphan').length);
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
		if (e.metaKey || e.ctrlKey) {
			e.preventDefault();
			if (!selecting) selecting = true;
			toggleKey(cell.key);
			return;
		}
		openCell(cell);
	}

	function openCell(im: GridCell) {
		if (!im.src) return;
		const items = visible
			.map((row) => {
				if (!row.src) return null;
				return {
					src: row.src,
					alt: row.alt,
					title: row.title,
					caption: row.cueLabel,
					nsfw: row.isNsfw,
					episodeId: row.episodeId
				};
			})
			.filter((row): row is NonNullable<typeof row> => !!row);
		const index = items.findIndex((row) => row.caption === im.cueLabel && row.title === im.title);
		openLightbox(items, index >= 0 ? index : 0);
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
		const items: GalleryDeleteItem[] = picked.map((c) =>
			c.kind === 'cue' ? { kind: 'cue', slotId: c.id } : { kind: 'orphan', id: c.id }
		);
		try {
			const res = await fetch(resolve('/api/images'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ items })
			});
			if (!res.ok) {
				let message = `Delete failed (${res.status})`;
				try {
					const body = (await res.json()) as { message?: string };
					if (body.message) message = body.message;
				} catch {
					/* keep status text */
				}
				deleteError = message;
				return;
			}
			const body = (await res.json()) as GalleryDeleteResponse;
			const cueGone = new Set(
				body.deleted.filter((d) => d.kind === 'cue').map((d) => d.slotId)
			);
			const orphanGone = new Set(
				body.deleted.filter((d) => d.kind === 'orphan').map((d) => d.id)
			);
			images = images.filter((im) => !cueGone.has(im.slot.id));
			orphans = orphans.filter((o) => !orphanGone.has(o.id));
			selected.clear();
			confirmOpen = false;
			selecting = false;
		} catch (err) {
			deleteError = err instanceof Error ? err.message : 'Delete failed';
		} finally {
			deleting = false;
		}
	}
</script>

<svelte:head>
	<title>Images — The Kingdom</title>
</svelte:head>

<main class="page">
	<header class="mast">
		<div class="mast-inner">
			<p class="eyebrow">
				<a href={resolve('/')}>← Chronicle</a>
				<span class="dot" aria-hidden="true">·</span>
				<a href={resolve('/wiki')}>Encyclopedia</a>
				<span class="dot" aria-hidden="true">·</span>
				<a href={resolve('/grade')}>Grade</a>
				<span class="dot" aria-hidden="true">·</span>
				<span
					>{query.trim() ? `${visible.length} / ${cells.length}` : cells.length} stills</span
				>
				{#if tempCount}
					<span class="dot" aria-hidden="true">·</span>
					<span>{tempCount} temp</span>
				{/if}
				{#if nsfwCount}
					<span class="dot" aria-hidden="true">·</span>
					{#if nsfwUi.showIntimate}
						<span>{nsfwCount} nsfw</span>
					{:else}
						<span>{nsfwHidden} nsfw hidden</span>
					{/if}
				{/if}
				{#if refsCount}
					<span class="dot" aria-hidden="true">·</span>
					<span>{refsCount} temp + refs</span>
				{/if}
				{#if seedCopyCount}
					<span class="dot" aria-hidden="true">·</span>
					<span>{seedCopyCount} final copies</span>
				{/if}
				{#if orphanCount}
					<span class="dot" aria-hidden="true">·</span>
					<span>{orphanCount} orphaned</span>
				{/if}
			</p>
			<div class="mast-row">
				<div class="titles">
					<h1>Images</h1>
				</div>
				<div class="mast-tools">
					<NsfwToggle />
					<label class="search">
						<span class="sr-only">Search stills</span>
						<input
							type="search"
							placeholder="Search cues — gyebek, yushin, last stand…"
							bind:value={query}
						/>
					</label>
					<button
						type="button"
						class={['nsfw-filter', { active: query.trim().toLowerCase() === 'nsfw' }]}
						aria-pressed={query.trim().toLowerCase() === 'nsfw'}
						onclick={() => (query = query.trim().toLowerCase() === 'nsfw' ? '' : 'nsfw')}
					>
						NSFW
					</button>
					<button
						type="button"
						class={['select-toggle', { active: selecting }]}
						aria-pressed={selecting}
						onclick={toggleSelectMode}
					>
						{selecting ? 'Done' : 'Select'}
					</button>
					{#if selecting}
						<button
							type="button"
							class="delete-btn"
							disabled={!picked.length || deleting}
							onclick={openConfirm}
						>
							Delete{picked.length ? ` (${picked.length})` : ''}
						</button>
					{/if}
				</div>
			</div>
		</div>
	</header>

	<section class="grid" aria-label="Cue image grid">
		{#each visible as im (im.key)}
			<article
				class={{
					card: true,
					temp: im.isTemp,
					nsfw: im.isNsfw,
					orphan: im.kind === 'orphan',
					picked: selected.has(im.key)
				}}
			>
				{#if selecting}
					<label class="pick">
						<span class="sr-only">Select {im.title}</span>
						<input
							type="checkbox"
							checked={selected.has(im.key)}
							onchange={() => toggleKey(im.key)}
						/>
					</label>
				{/if}
				{#if im.src}
					<button
						type="button"
						class="thumb"
						style:--tone={im.tone}
						aria-label={`Open ${im.title} at original size`}
						onclick={(e) => onThumbClick(e, im)}
					>
						<img
							{...storyImg(im.src, {
								kind: 'cue',
								alt: im.alt,
								sizes: '180px'
							})}
						/>
						<div class="badges">
							{#if im.isNsfw}
								<span class="badge nsfw">nsfw</span>
							{/if}
							{#if im.kind === 'orphan'}
								<span class="badge orphan-badge">orphan</span>
							{:else if im.isTemp}
								<span class="badge">temp</span>
							{/if}
							{#if im.hasGenuineRefs}
								<span class={['badge', 'refs', { explicit: im.hasExplicitRefs }]}>refs</span>
							{/if}
							{#if im.isSeedCopy}
								<span class="badge seed">final copy</span>
							{/if}
						</div>
					</button>
				{:else}
					<figure class="thumb" style:--tone={im.tone}>
						<div class="ph">
							<span class="ph-id">{im.id}</span>
						</div>
						<div class="badges">
							{#if im.isNsfw}
								<span class="badge nsfw">nsfw</span>
							{/if}
							{#if im.isTemp}
								<span class="badge">temp</span>
							{/if}
						</div>
					</figure>
				{/if}
				<div class="meta">
					<p class="year">{im.year}</p>
					<p class="entry">{im.title}</p>
					<p class="cue">{im.cueLabel}</p>
					{#if im.isNsfw}
						<p class="nsfw-label">NSFW</p>
					{/if}
				</div>
			</article>
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
				<button type="button" class="cancel" disabled={deleting} onclick={closeConfirm}>
					Cancel
				</button>
				<button type="button" class="destroy" disabled={deleting} onclick={confirmDelete}>
					{deleting ? 'Deleting…' : 'Delete permanently'}
				</button>
			</div>
		</div>
	</dialog>
{/if}

<style>
	.page {
		min-height: 100dvh;
		padding: calc(7.25rem + env(safe-area-inset-top, 0px))
			max(1.5rem, env(safe-area-inset-right, 0px) + 1rem)
			max(3rem, env(safe-area-inset-bottom, 0px) + 2rem)
			max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.85rem));
		background:
			radial-gradient(ellipse 70% 45% at 8% 0%, rgba(216, 178, 106, 0.08), transparent 55%),
			radial-gradient(ellipse 55% 40% at 92% 8%, rgba(62, 121, 228, 0.05), transparent 50%),
			var(--bg);
		color: var(--fg);
	}

	.mast {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 40;
		padding: max(0.55rem, env(safe-area-inset-top, 0px) + 0.35rem)
			max(1.5rem, env(safe-area-inset-right, 0px) + 1rem)
			0.75rem
			max(1.5rem, calc(env(safe-area-inset-left, 0px) + 1.85rem));
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--hairline);
	}

	.mast-inner {
		max-width: 72rem;
		margin: 0 auto;
	}

	.eyebrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
		margin: 0 0 0.4rem;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.eyebrow a {
		font: inherit;
		color: var(--fg-dim);
		text-decoration: none;
		transition: color 0.2s var(--ease);
	}

	.eyebrow a:hover {
		color: var(--gold);
	}

	.dot {
		opacity: 0.5;
	}

	.mast-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.25rem;
	}

	.titles {
		flex: 1 1 18rem;
		min-width: 0;
	}

	.mast h1 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.35rem, 1.8vw, 1.75rem);
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		line-height: 1.1;
		color: #fffdf8;
	}

	.mast-tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem 0.85rem;
		flex-shrink: 0;
	}

	.search input {
		width: min(18rem, 70vw);
		padding: 0.38rem 0.85rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		color: #fffdf8;
		font: inherit;
		font-size: 0.82rem;
	}

	.search input::placeholder {
		color: var(--fg-faint);
	}

	.search input:focus-visible {
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

	.select-toggle,
	.delete-btn {
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		border-radius: var(--radius-pill);
		padding: 0.28rem 0.85rem;
		cursor: pointer;
	}

	.select-toggle {
		color: var(--fg-dim);
		background: transparent;
		border: 1px solid var(--hairline);
	}

	.select-toggle:hover,
	.select-toggle.active {
		color: #14140f;
		background: var(--gold);
		border-color: var(--gold);
	}

	.delete-btn {
		color: #fff7f8;
		background: #9f1239;
		border: 1px solid #9f1239;
	}

	.delete-btn:hover:not(:disabled) {
		background: #be123c;
	}

	.delete-btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.nsfw-filter {
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #fb7185;
		background: transparent;
		border: 1px solid color-mix(in srgb, #9f1239 70%, var(--hairline));
		border-radius: var(--radius-pill);
		padding: 0.28rem 0.85rem;
		cursor: pointer;
	}

	.nsfw-filter:hover,
	.nsfw-filter.active {
		color: #fff7f8;
		background: #9f1239;
		border-color: #9f1239;
	}

	.grid {
		max-width: 72rem;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11.5rem, 1fr));
		gap: 0.85rem 0.75rem;
	}

	.card {
		position: relative;
		display: grid;
		gap: 0.45rem;
		min-width: 0;
	}

	.card.picked .thumb {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.pick {
		position: absolute;
		z-index: 5;
		top: 0.4rem;
		right: 0.4rem;
		display: grid;
		place-items: center;
		width: 1.35rem;
		height: 1.35rem;
		border-radius: 0.3rem;
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		border: 1px solid var(--hairline);
	}

	.pick input {
		margin: 0;
		width: 0.9rem;
		height: 0.9rem;
		accent-color: var(--gold);
		cursor: pointer;
	}

	.thumb {
		position: relative;
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		aspect-ratio: 3 / 2;
		overflow: hidden;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--tone) 55%, #14141a);
		font: inherit;
		color: inherit;
		text-align: left;
	}

	button.thumb {
		cursor: zoom-in;
	}

	button.thumb:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ph {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		padding: 0.75rem;
	}

	.ph-id {
		font-size: 0.62rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.65);
		text-align: center;
		word-break: break-word;
	}

	.badges {
		position: absolute;
		z-index: 4;
		top: 0.4rem;
		left: 0.4rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		max-width: calc(100% - 2.2rem);
	}

	.badge {
		padding: 0.08rem 0.4rem;
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #14140f;
		background: var(--gold);
		border-radius: var(--radius-pill);
	}

	.badge.refs {
		background: color-mix(in srgb, #7eb6ff 70%, #fffdf8);
		color: #0f1720;
	}

	.badge.refs.explicit {
		background: #7eb6ff;
	}

	.badge.orphan-badge {
		background: color-mix(in srgb, var(--fg-faint) 55%, #14141a);
		color: #fffdf8;
	}

	.badge.nsfw {
		background: #9f1239;
		color: #fff7f8;
	}

	.badge.seed {
		background: color-mix(in srgb, var(--fg-faint) 40%, #fffdf8);
		color: #2a2a28;
	}

	.meta {
		display: grid;
		gap: 0.12rem;
		padding: 0 0.1rem;
	}

	.year {
		margin: 0;
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.entry {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		letter-spacing: var(--tracking-display);
		color: #fffdf8;
		line-height: 1.25;
	}

	.cue {
		margin: 0;
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.nsfw-label {
		margin: 0.15rem 0 0;
		width: fit-content;
		padding: 0.08rem 0.42rem;
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #fff7f8;
		background: #9f1239;
		border-radius: var(--radius-pill);
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
		background: rgba(8, 8, 10, 0.72);
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
		border: 1px solid var(--hairline);
		background: var(--panel);
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
	}

	.confirm-sheet h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: var(--tracking-display);
		color: #fffdf8;
	}

	.confirm-copy {
		margin: 0.65rem 0 0;
		font-size: 0.86rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.confirm-copy code {
		font-size: 0.82em;
		color: var(--gold);
	}

	.confirm-files {
		margin: 0.75rem 0 0;
		padding: 0.55rem 0.75rem;
		max-height: 10rem;
		overflow: auto;
		list-style: none;
		font-size: 0.78rem;
		line-height: 1.4;
		color: var(--fg);
		background: var(--panel-sunken);
		border: 1px solid var(--hairline);
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
		color: #fb7185;
	}

	.confirm-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.55rem;
		margin-top: 1rem;
	}

	.confirm-actions button {
		font: inherit;
		font-size: 0.78rem;
		letter-spacing: 0.04em;
		border-radius: var(--radius-pill);
		padding: 0.38rem 0.95rem;
		cursor: pointer;
	}

	.cancel {
		color: var(--fg);
		background: transparent;
		border: 1px solid var(--hairline);
	}

	.destroy {
		color: #fff7f8;
		background: #9f1239;
		border: 1px solid #9f1239;
	}

	.destroy:disabled,
	.cancel:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 700px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		}
	}
</style>
