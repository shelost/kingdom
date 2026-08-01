<script lang="ts">
	import { getContext, tick } from 'svelte';
	import Editable from './Editable.svelte';
	import BlockEditor from './BlockEditor.svelte';
	import { uid, newBlock, turnInto, BLOCK_KINDS, type AnyBlock } from './model';

	let {
		entry,
		onremove,
		onmove
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		entry: any;
		onremove: () => void;
		onmove: (dir: -1 | 1) => void;
	} = $props();

	const dirty = getContext<() => void>('dirty');

	let root: HTMLElement;
	let openMenu = $state<string | null>(null); // block __id with an open ⋮⋮ menu
	let dragId = $state<string | null>(null);
	let dropAt = $state<number | null>(null); // insertion index while dragging

	function set(fn: () => void) {
		fn();
		dirty();
	}

	async function focusBlock(id: string) {
		await tick();
		const el = root.querySelector<HTMLElement>(`[data-bid="${id}"] [contenteditable]`);
		if (!el) return;
		el.focus();
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		const sel = window.getSelection();
		sel?.removeAllRanges();
		sel?.addRange(range);
	}

	function addBelow(i: number, kind = 'p') {
		const nb = newBlock(kind);
		set(() => entry.blocks.splice(i + 1, 0, nb));
		openMenu = null;
		focusBlock(nb.__id);
	}

	function removeBlock(i: number) {
		const prev = entry.blocks[i - 1];
		set(() => entry.blocks.splice(i, 1));
		openMenu = null;
		if (prev) focusBlock(prev.__id);
	}

	function moveBlock(i: number, dir: -1 | 1) {
		const j = i + dir;
		if (j < 0 || j >= entry.blocks.length) return;
		set(() => {
			const [b] = entry.blocks.splice(i, 1);
			entry.blocks.splice(j, 0, b);
		});
	}

	function convert(i: number, kind: string) {
		set(() => (entry.blocks[i] = turnInto(entry.blocks[i], kind)));
		openMenu = null;
	}

	// — drag to reorder —
	function handleDragOver(e: DragEvent, i: number) {
		if (dragId === null) return;
		e.preventDefault();
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		dropAt = e.clientY < rect.top + rect.height / 2 ? i : i + 1;
	}

	function handleDrop() {
		if (dragId === null || dropAt === null) return;
		const from = entry.blocks.findIndex((b: AnyBlock) => b.__id === dragId);
		if (from !== -1) {
			let to = dropAt;
			if (to > from) to -= 1;
			if (to !== from) {
				set(() => {
					const [b] = entry.blocks.splice(from, 1);
					entry.blocks.splice(to, 0, b);
				});
			}
		}
		dragId = null;
		dropAt = null;
	}
</script>

<svelte:window onclick={() => (openMenu = null)} />

<section class="entry" class:flash={entry.flash} bind:this={root}>
	<header class="meta">
		<div class="year-col">
			<Editable
				single
				plain
				value={entry.year}
				placeholder="Year"
				class="year"
				oninput={(v) => set(() => (entry.year = v))}
			/>
			<Editable
				single
				plain
				value={entry.sub ?? ''}
				placeholder="month…"
				class="year-sub"
				oninput={(v) => set(() => (entry.sub = v || undefined))}
			/>
		</div>
		<div class="title-col">
			<Editable
				single
				plain
				value={entry.title}
				placeholder="Episode title"
				class="etitle"
				oninput={(v) => set(() => (entry.title = v))}
			/>
			<Editable
				single
				plain
				value={entry.subtitle ?? ''}
				placeholder="한글 부제…"
				class="esub"
				oninput={(v) => set(() => (entry.subtitle = v || undefined))}
			/>
			<div class="accent-row">
				<input
					type="color"
					title="Title color (battle entries use red)"
					value={entry.accent ?? '#111111'}
					oninput={(e) => set(() => (entry.accent = e.currentTarget.value))}
				/>
				{#if entry.accent}
					<button class="ghost" title="Reset title color" onclick={() => set(() => (entry.accent = undefined))}>↺</button>
				{/if}
			</div>
			<input
				class="badges music"
				type="text"
				placeholder="♫ track name (optional)"
				title="Shows in the player tag while this entry is being read"
				value={entry.music ?? ''}
				oninput={(e) => set(() => (entry.music = e.currentTarget.value || undefined))}
			/>
			<input
				class="badges"
				type="text"
				placeholder="badges: 👑 🌙 唐"
				value={(entry.badges ?? []).join(' ')}
				oninput={(e) =>
					set(() => {
						const parts = e.currentTarget.value.split(/\s+/).filter(Boolean);
						entry.badges = parts.length ? parts : undefined;
					})}
			/>
		</div>
		<div class="entry-tools">
			<button
				title="Toggle flashback band"
				class="flash-btn"
				class:on={entry.flash}
				onclick={() => set(() => (entry.flash = entry.flash ? undefined : true))}
			>⌛</button>
			<button title="Move entry up" onclick={() => onmove(-1)}>↑</button>
			<button title="Move entry down" onclick={() => onmove(1)}>↓</button>
			<button title="Delete entry" class="danger" onclick={onremove}>🗑</button>
		</div>
	</header>

	<div class="images">
		{#each entry.images as img, i (img.__id)}
			<div class="img-card" style:--tone={img.tone ?? '#e5e5e5'}>
				<div class="swatch">
					<input
						type="color"
						title="Placeholder tone"
						value={img.tone ?? '#e5e5e5'}
						oninput={(e) => set(() => (img.tone = e.currentTarget.value))}
					/>
				</div>
				<input
					class="img-id"
					type="text"
					placeholder="image-id"
					value={img.id}
					oninput={(e) => set(() => (img.id = e.currentTarget.value))}
				/>
				<input
					class="img-ratio"
					type="number"
					step="0.1"
					min="0.3"
					title="Aspect ratio (w/h)"
					value={img.ratio}
					oninput={(e) => set(() => (img.ratio = +e.currentTarget.value || 1))}
				/>
				<button class="ghost" title="Remove image" onclick={() => set(() => entry.images.splice(i, 1))}>×</button>
			</div>
		{/each}
		<button
			class="ghost"
			onclick={() => set(() => entry.images.push({ __id: uid(), id: 'new-image', ratio: 2.4, tone: '#9ca3af' }))}
		>
			+ image
		</button>
	</div>

	<div class="blocks" role="list" ondrop={handleDrop} ondragover={(e) => e.preventDefault()}>
		{#each entry.blocks as block, i (block.__id)}
			<div
				class="block"
				class:drop-before={dropAt === i && dragId !== null}
				class:drop-after={dropAt === i + 1 && i === entry.blocks.length - 1 && dragId !== null}
				data-bid={block.__id}
				role="listitem"
				ondragover={(e) => handleDragOver(e, i)}
			>
				<div class="gutter">
					<button class="g" title="Add block below" onclick={() => addBelow(i)}>+</button>
					<button
						class="g handle"
						title="Drag to move · click for menu"
						draggable="true"
						ondragstart={(e) => {
							dragId = block.__id;
							e.dataTransfer?.setData('text/plain', block.__id);
						}}
						ondragend={() => {
							dragId = null;
							dropAt = null;
						}}
						onclick={(e) => {
							e.stopPropagation();
							openMenu = openMenu === block.__id ? null : block.__id;
						}}
					>⋮⋮</button>
				</div>

				{#if openMenu === block.__id}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div class="menu" onclick={(e) => e.stopPropagation()}>
						<div class="menu-label">Turn into</div>
						{#each BLOCK_KINDS as k (k.kind)}
							<button class="mi" class:active={block.kind === k.kind} onclick={() => convert(i, k.kind)}>
								<span class="mi-icon">{k.icon}</span>{k.label}
							</button>
						{/each}
						<div class="menu-sep"></div>
						<button class="mi" disabled={i === 0} onclick={() => { moveBlock(i, -1); openMenu = null; }}>
							<span class="mi-icon">↑</span>Move up
						</button>
						<button class="mi" disabled={i === entry.blocks.length - 1} onclick={() => { moveBlock(i, 1); openMenu = null; }}>
							<span class="mi-icon">↓</span>Move down
						</button>
						<button class="mi danger" onclick={() => removeBlock(i)}>
							<span class="mi-icon">🗑</span>Delete
						</button>
					</div>
				{/if}

				<div class="block-body">
					<BlockEditor
						{block}
						onenter={() => addBelow(i)}
						ondeleteempty={() => removeBlock(i)}
					/>
				</div>
			</div>
		{/each}
		{#if entry.blocks.length === 0}
			<button class="ghost" onclick={() => addBelow(-1)}>+ first block</button>
		{/if}
	</div>
</section>

<style>
	.entry {
		position: relative;
		padding: 1.6rem 0 2.2rem;
		border-top: 1px solid #f0f0ee;
	}

	.entry.flash {
		background: #f4f4f2;
		border-radius: 8px;
		padding-inline: 1.1rem;
	}

	.entry-tools .flash-btn.on {
		background: #e0e7ff;
		opacity: 1;
	}

	/* ————— meta row ————— */
	.meta {
		display: flex;
		gap: 1.6rem;
		align-items: flex-start;
		margin-bottom: 0.9rem;
	}

	.year-col {
		min-width: 7rem;
	}

	:global(.editable.year) {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 2.6rem;
		line-height: 1;
		padding: 2px 4px;
	}

	:global(.editable.year-sub) {
		font-size: 0.85rem;
		color: #787774;
		padding: 2px 4px;
	}

	.title-col {
		flex: 1;
		max-width: 22rem;
	}

	:global(.editable.etitle) {
		font-family: var(--serif);
		font-weight: 900;
		font-size: 1.3rem;
		line-height: 1.1;
		padding: 2px 4px;
	}

	.accent-row {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.25rem;
	}

	.accent-row input[type='color'] {
		inline-size: 1.1rem;
		block-size: 1.1rem;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}

	:global(.editable.esub) {
		font-weight: 700;
		font-size: 0.9rem;
		padding: 2px 4px;
	}

	.badges {
		font: inherit;
		font-size: 0.9rem;
		border: none;
		background: transparent;
		border-radius: 4px;
		padding: 2px 4px;
		width: 100%;
	}

	.badges:hover {
		background: rgba(0, 0, 0, 0.025);
	}

	.badges::placeholder {
		color: #b9b9b7;
	}

	.music {
		font-size: 0.78rem;
		color: #787774;
	}

	.entry-tools {
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.entry:hover .entry-tools {
		opacity: 1;
	}

	.entry-tools button {
		font: inherit;
		font-size: 0.8rem;
		border: none;
		background: #f1f1ef;
		border-radius: 4px;
		width: 1.7rem;
		height: 1.7rem;
		cursor: pointer;
		color: #787774;
	}

	.entry-tools button:hover {
		background: #e8e8e6;
	}

	.entry-tools .danger:hover {
		background: #fbe4e4;
	}

	/* ————— image slots ————— */
	.images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.img-card {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		border: 1px solid #ececea;
		border-left: 6px solid var(--tone);
		border-radius: 6px;
		padding: 0.2rem 0.4rem;
		background: #fff;
	}

	.swatch input[type='color'] {
		inline-size: 1rem;
		block-size: 1rem;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}

	.img-id {
		font: inherit;
		font-size: 0.78rem;
		border: none;
		width: 11ch;
	}

	.img-ratio {
		font: inherit;
		font-size: 0.78rem;
		border: none;
		width: 4.5ch;
		color: #787774;
	}

	.img-card .ghost {
		opacity: 0.4;
	}

	.img-card:hover .ghost {
		opacity: 1;
	}

	/* ————— blocks ————— */
	.blocks {
		max-width: 46rem;
	}

	.block {
		position: relative;
		padding: 1px 0;
	}

	.block.drop-before {
		box-shadow: 0 -2px 0 0 var(--rail-blue);
	}

	.block.drop-after {
		box-shadow: 0 2px 0 0 var(--rail-blue);
	}

	.gutter {
		position: absolute;
		left: -3.4rem;
		top: 2px;
		display: flex;
		gap: 2px;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.block:hover .gutter {
		opacity: 1;
	}

	.g {
		font: inherit;
		font-size: 0.9rem;
		line-height: 1;
		color: #9b9a97;
		background: transparent;
		border: none;
		border-radius: 4px;
		width: 1.5rem;
		height: 1.5rem;
		cursor: pointer;
		display: grid;
		place-items: center;
	}

	.g:hover {
		background: #f1f1ef;
	}

	.handle {
		cursor: grab;
		letter-spacing: -0.28em;
		text-indent: -0.14em;
	}

	.menu {
		position: absolute;
		left: -1.9rem;
		top: 1.7rem;
		z-index: 60;
		background: #fff;
		border: 1px solid #ececea;
		border-radius: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
		padding: 0.3rem;
		min-width: 11rem;
	}

	.menu-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #9b9a97;
		padding: 0.25rem 0.5rem;
	}

	.menu-sep {
		height: 1px;
		background: #ececea;
		margin: 0.25rem 0;
	}

	.mi {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		font: inherit;
		font-size: 0.85rem;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 5px;
		padding: 0.3rem 0.5rem;
		cursor: pointer;
		color: #37352f;
	}

	.mi:hover:not(:disabled) {
		background: #f1f1ef;
	}

	.mi:disabled {
		opacity: 0.35;
		cursor: default;
	}

	.mi.active {
		background: #edf3fd;
	}

	.mi.danger {
		color: #c0392b;
	}

	.mi-icon {
		width: 1.2rem;
		text-align: center;
	}

	.ghost {
		font: inherit;
		font-size: 0.78rem;
		color: #787774;
		background: #f1f1ef;
		border: none;
		border-radius: 4px;
		padding: 0.2rem 0.55rem;
		cursor: pointer;
	}

	.ghost:hover {
		background: #e8e8e6;
	}
</style>
