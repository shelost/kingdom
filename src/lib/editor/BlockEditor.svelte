<script lang="ts">
	import { getContext } from 'svelte';
	import Editable from './Editable.svelte';
	import { PROFILES, byId, colorOf } from '$lib/people';
	import { BLOCK_KINDS, newBlock } from './model';
	import Self from './BlockEditor.svelte';
	// Blocks carry a client-side __id (stripped on save)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let {
		block,
		onenter,
		ondeleteempty
	}: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		block: any;
		onenter: () => void;
		ondeleteempty: () => void;
	} = $props();

	const dirty = getContext<() => void>('dirty');

	function set(fn: () => void) {
		fn();
		dirty();
	}
</script>

{#if block.kind === 'p'}
	<div class="p-cols">
		<Editable
			value={block.html}
			placeholder="Write, or ⋮⋮ to change type…"
			single
			class="bp"
			oninput={(v) => set(() => (block.html = v))}
			{onenter}
			{ondeleteempty}
		/>
		<Editable
			value={block.ko ?? ''}
			placeholder="한국어 번역…"
			single
			class="bp bko"
			oninput={(v) => set(() => (block.ko = v || undefined))}
		/>
	</div>
{:else if block.kind === 'cite'}
	<div class="cite-row">
		<span class="bullet">•</span>
		<Editable
			value={block.html}
			placeholder="Attribution — 👑 King Mu (51) of Baekje"
			single
			class="bcite"
			oninput={(v) => set(() => (block.html = v))}
			{onenter}
			{ondeleteempty}
		/>
	</div>
{:else if block.kind === 'dialogue'}
	{@const who = block.person ? byId.get(block.person) : undefined}
	<div class="dlg-row">
		<div class="dlg-side">
			<!-- who is speaking: drives the avatar shown in the story -->
			<select
				class="who-pick"
				class:set={!!who}
				title={who ? who.name : 'Assign a speaker'}
				value={block.person ?? ''}
				onchange={(e) => set(() => (block.person = e.currentTarget.value || undefined))}
			>
				<option value="">— speaker —</option>
				{#each PROFILES as p (p.id)}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
			{#if who}
				<span class="who-chip" style:--k={colorOf(who)}>
					{who.name.slice(0, 1)}
				</span>
			{:else}
				<input
					type="color"
					title="Speaker color"
					value={block.chip}
					oninput={(e) => set(() => (block.chip = e.currentTarget.value))}
				/>
			{/if}
			<input
				type="text"
				class="speaker"
				placeholder="👑"
				title="Speaker emoji (used when no person is assigned)"
				value={block.speaker ?? ''}
				oninput={(e) => set(() => (block.speaker = e.currentTarget.value || undefined))}
			/>
		</div>
		<div class="dlg-cols">
			<Editable
				plain
				value={block.lines.join('\n')}
				placeholder={'Korean — one line per row…'}
				class="bdlg"
				oninput={(v) => set(() => (block.lines = v.split('\n')))}
				{ondeleteempty}
			/>
			<Editable
				plain
				value={(block.en ?? []).join('\n')}
				placeholder={'English — one line per row…'}
				class="bdlg ben"
				oninput={(v) =>
					set(() => (block.en = v.trim() ? v.split('\n') : undefined))}
			/>
		</div>
	</div>
{:else if block.kind === 'verse'}
	<div class="dlg-row">
		<div class="dlg-side">
			<input
				type="color"
				title="Verse color"
				value={block.color}
				oninput={(e) => set(() => (block.color = e.currentTarget.value))}
			/>
		</div>
		<Editable
			plain
			value={block.lines.join('\n')}
			placeholder={'Verse — one line per row…'}
			class="bverse"
			oninput={(v) => set(() => (block.lines = v.split('\n')))}
			{ondeleteempty}
		/>
		<div class="verse-tint" style:background={block.color} aria-hidden="true"></div>
	</div>
{:else if block.kind === 'table'}
	<div class="tbl">
		<table>
			<thead>
				<tr>
					{#each block.head as _, c (c)}
						<th>
							<Editable
								single
								value={block.head[c]}
								placeholder="Head"
								oninput={(v) => set(() => (block.head[c] = v))}
							/>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each block.rows as row, r (r)}
					<tr>
						{#each row as _, c (c)}
							<td>
								<Editable
									single
									value={row[c]}
									placeholder="…"
									oninput={(v) => set(() => (row[c] = v))}
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="tbl-tools">
			<button onclick={() => set(() => { block.head.push(''); block.rows.forEach((r: string[]) => r.push('')); })}>+ col</button>
			<button
				disabled={block.head.length <= 1}
				onclick={() => set(() => { block.head.pop(); block.rows.forEach((r: string[]) => r.pop()); })}
			>− col</button>
			<button onclick={() => set(() => block.rows.push(block.head.map(() => '')))}>+ row</button>
			<button
				disabled={block.rows.length <= 1}
				onclick={() => set(() => block.rows.pop())}
			>− row</button>
		</div>
	</div>
{:else if block.kind === 'hanja'}
	<div class="hanja">
		{#each block.chars as pair, i (i)}
			<div class="hanja-pair">
				<input
					class="glyph"
					type="text"
					maxlength="2"
					value={pair.char}
					oninput={(e) => set(() => (pair.char = e.currentTarget.value))}
				/>
				<input
					class="gloss"
					type="text"
					placeholder="착할 선"
					value={pair.gloss}
					oninput={(e) => set(() => (pair.gloss = e.currentTarget.value))}
				/>
				<button
					class="ghost"
					title="Remove character"
					onclick={() => set(() => block.chars.splice(i, 1))}
				>×</button>
			</div>
		{/each}
		<button class="ghost add" onclick={() => set(() => block.chars.push({ char: '字', gloss: '' }))}>
			+ character
		</button>
		<Editable
			single
			value={block.after ?? ''}
			placeholder="Closing line (optional)…"
			class="bp"
			oninput={(v) => set(() => (block.after = v || undefined))}
			{onenter}
		/>
	</div>
{:else if block.kind === 'flashback'}
	<!-- an inline mini-flashback; the page goes black around it in the story -->
	<div class="fb">
		<div class="fb-head">
			<span class="fb-mark">⌛</span>
			<input
				class="fb-year"
				type="text"
				placeholder="612"
				value={block.year ?? ''}
				oninput={(e) => set(() => (block.year = e.currentTarget.value || undefined))}
			/>
			<input
				class="fb-title"
				type="text"
				placeholder="Flashback title…"
				value={block.title ?? ''}
				oninput={(e) => set(() => (block.title = e.currentTarget.value || undefined))}
			/>
		</div>
		<div class="fb-body">
			{#each block.blocks as inner, k (inner.__id)}
				<div class="fb-block">
					<Self
						block={inner}
						onenter={() => set(() => block.blocks.splice(k + 1, 0, newBlock('p')))}
						ondeleteempty={() => set(() => block.blocks.length > 1 && block.blocks.splice(k, 1))}
					/>
					<button
						class="ghost fb-x"
						title="Remove block"
						onclick={() => set(() => block.blocks.length > 1 && block.blocks.splice(k, 1))}>×</button
					>
				</div>
			{/each}
			<div class="fb-add">
				{#each BLOCK_KINDS.filter((k) => k.kind !== 'flashback') as k (k.kind)}
					<button class="ghost" onclick={() => set(() => block.blocks.push(newBlock(k.kind)))}>
						+ {k.label}
					</button>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Mirror the reading view so editing feels wysiwyg */
	:global(.editable.bp) {
		font-size: 15px;
		line-height: 1.55;
		padding: 2px 4px;
	}

	.p-cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}

	.p-cols :global(.editable.bko) {
		color: #787774;
		border-left: 1px solid #ececea;
		padding-left: 0.5rem;
	}

	.cite-row {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
		padding-left: 1.1rem;
		font-size: 0.92em;
	}

	.cite-row :global(.editable) {
		flex: 1;
		padding: 2px 4px;
	}

	.dlg-row {
		position: relative;
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
		margin: 0.35rem 0;
	}

	.dlg-side {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-top: 4px;
	}

	/* speaker picker */
	.who-pick {
		font: inherit;
		font-size: 0.62rem;
		max-width: 5.2rem;
		border: 1px solid #ececea;
		border-radius: 4px;
		background: #fff;
		color: #787774;
		padding: 1px 2px;
		cursor: pointer;
	}

	.who-pick.set {
		color: #37352f;
		border-color: #c9c9c5;
	}

	.who-chip {
		display: grid;
		place-items: center;
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 50%;
		font-size: 0.65rem;
		font-weight: 700;
		color: #fff;
		background: color-mix(in srgb, var(--k) 72%, #000);
	}

	/* inline flashback */
	.fb {
		border: 1px dashed #d8d4cc;
		border-radius: 8px;
		background: #fbfaf7;
		padding: 0.5rem 0.7rem 0.7rem;
		margin: 0.5rem 0;
	}

	.fb-head {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.4rem;
	}

	.fb-mark {
		font-size: 0.8rem;
	}

	.fb-year,
	.fb-title {
		font: inherit;
		font-size: 0.78rem;
		border: none;
		background: transparent;
		border-radius: 4px;
		padding: 0.1rem 0.25rem;
	}

	.fb-year {
		width: 4.5rem;
		font-weight: 700;
	}

	.fb-title {
		flex: 1;
	}

	.fb-year:hover,
	.fb-title:hover {
		background: rgba(0, 0, 0, 0.03);
	}

	.fb-body {
		border-left: 2px solid #e6e2d8;
		padding-left: 0.6rem;
	}

	.fb-block {
		display: flex;
		align-items: flex-start;
		gap: 0.3rem;
	}

	.fb-block > :global(*:first-child) {
		flex: 1;
		min-width: 0;
	}

	.fb-x {
		opacity: 0;
	}

	.fb-block:hover .fb-x {
		opacity: 1;
	}

	.fb-add {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-top: 0.4rem;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.fb:hover .fb-add,
	.fb:focus-within .fb-add {
		opacity: 1;
	}

	.dlg-side input[type='color'] {
		inline-size: 1.15rem;
		block-size: 1.15rem;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
	}

	.speaker {
		width: 1.5rem;
		border: none;
		background: transparent;
		font-size: 0.8rem;
		text-align: center;
	}

	.speaker::placeholder {
		opacity: 0.3;
	}

	.dlg-row :global(.editable) {
		padding: 2px 4px;
	}

	/* Korean and its English rendering, side by side */
	.dlg-cols {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		min-width: 0;
	}

	.dlg-cols :global(.editable) {
		min-width: 0;
	}

	.dlg-cols :global(.editable.ben) {
		color: #6b6a67;
		font-style: italic;
		border-left: 1px solid #ececea;
		padding-left: 0.5rem;
	}

	:global(.editable.bverse) {
		font-weight: 600;
	}

	.verse-tint {
		position: absolute;
		left: -0.65rem;
		top: 4px;
		bottom: 4px;
		width: 3px;
		border-radius: 2px;
		opacity: 0.6;
	}

	.tbl {
		margin: 0.4rem 0;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.85rem;
	}

	th,
	td {
		border: 1px solid #e3e3e1;
		padding: 0.15rem 0.4rem;
		min-width: 5rem;
	}

	th {
		background: #fafaf9;
	}

	.tbl-tools {
		display: flex;
		gap: 0.3rem;
		margin-top: 0.3rem;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.tbl:hover .tbl-tools,
	.tbl:focus-within .tbl-tools {
		opacity: 1;
	}

	.tbl-tools button,
	.ghost {
		font: inherit;
		font-size: 0.75rem;
		color: #787774;
		background: #f1f1ef;
		border: none;
		border-radius: 4px;
		padding: 0.15rem 0.5rem;
		cursor: pointer;
	}

	.tbl-tools button:hover,
	.ghost:hover {
		background: #e8e8e6;
	}

	.tbl-tools button:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.hanja {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.hanja-pair {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.glyph {
		width: 4.2rem;
		font-family: 'Noto Serif KR', serif;
		font-size: 2.2rem;
		font-weight: 900;
		border: none;
		background: transparent;
		border-radius: 4px;
	}

	.glyph:hover,
	.gloss:hover {
		background: rgba(0, 0, 0, 0.025);
	}

	.gloss {
		font: inherit;
		font-size: 0.85rem;
		font-weight: 700;
		border: none;
		background: transparent;
		border-radius: 4px;
		padding: 0.2rem 0.3rem;
	}

	.hanja-pair .ghost {
		opacity: 0;
	}

	.hanja-pair:hover .ghost {
		opacity: 1;
	}

	.add {
		align-self: flex-start;
	}
</style>
