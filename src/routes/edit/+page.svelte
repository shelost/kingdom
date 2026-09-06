<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import Editable from '$lib/editor/Editable.svelte';
	import EntryEditor from '$lib/editor/EntryEditor.svelte';
	import { uid, newBlock, decorate, stripIds } from '$lib/editor/model';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let story = $state<any[]>([]);
	let loaded = $state(false);
	let status = $state<'saved' | 'saving' | 'error'>('saved');
	let timer: ReturnType<typeof setTimeout> | undefined;

	onMount(async () => {
		const res = await fetch('/api/story');
		story = decorate(await res.json());
		loaded = true;
	});

	function dirty() {
		status = 'saving';
		clearTimeout(timer);
		timer = setTimeout(save, 700);
	}
	setContext('dirty', dirty);

	async function save() {
		try {
			const res = await fetch('/api/story', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(story, stripIds)
			});
			status = res.ok ? 'saved' : 'error';
		} catch {
			status = 'error';
		}
	}

	function set(fn: () => void) {
		fn();
		dirty();
	}

	function addEntry(chapterIdx: number) {
		set(() =>
			story[chapterIdx].entries.push({
				__id: uid(),
				year: '',
				title: '',
				images: [],
				blocks: [newBlock('p')]
			})
		);
	}

	function addChapter() {
		set(() =>
			story.push({
				__id: uid(),
				id: `chapter-${uid().slice(0, 6)}`,
				title: '',
				range: '',
				entries: []
			})
		);
	}

	function moveEntry(chapterIdx: number, entryIdx: number, dir: -1 | 1) {
		const entries = story[chapterIdx].entries;
		const j = entryIdx + dir;
		if (j < 0 || j >= entries.length) return;
		set(() => {
			const [e] = entries.splice(entryIdx, 1);
			entries.splice(j, 0, e);
		});
	}

	function removeEntry(chapterIdx: number, entryIdx: number) {
		const entry = story[chapterIdx].entries[entryIdx];
		if (!confirm(`Delete entry “${entry.year} ${entry.title}”?`)) return;
		set(() => story[chapterIdx].entries.splice(entryIdx, 1));
	}

	function removeChapter(chapterIdx: number) {
		const ch = story[chapterIdx];
		if (!confirm(`Delete chapter “${ch.title}” and its ${ch.entries.length} entries?`)) return;
		set(() => story.splice(chapterIdx, 1));
	}

	function jump(chId: string, enId?: string) {
		document
			.getElementById(enId ? `en-${enId}` : `ch-${chId}`)
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<svelte:head>
	<title>Kingdom — story editor</title>
</svelte:head>

<svelte:window
	onbeforeunload={(e) => {
		if (status === 'saving') e.preventDefault();
	}}
/>

<div class="editor">
	<aside class="side">
		<a class="back" href="/">← View story</a>
		<nav>
			{#each story as ch (ch.__id)}
				<button class="nav-ch" onclick={() => jump(ch.__id)}>
					{ch.title || 'Untitled chapter'}
				</button>
				{#each ch.entries as en (en.__id)}
					<button class="nav-en" onclick={() => jump(ch.__id, en.__id)}>
						<span class="nav-year">{en.year || '—'}</span>
						{en.title || 'Untitled'}
					</button>
				{/each}
			{/each}
		</nav>
		<button class="ghost" onclick={addChapter}>+ Chapter</button>
	</aside>

	<div class="status" data-s={status}>
		{status === 'saved' ? '✓ Saved' : status === 'saving' ? 'Saving…' : '⚠ Save failed'}
	</div>

	<main class="canvas">
		{#if !loaded}
			<p class="loading">Loading story…</p>
		{/if}

		{#each story as ch, ci (ch.__id)}
			<section class="chapter" id={'ch-' + ch.__id}>
				<header class="ch-head">
					<Editable
						single
						plain
						value={ch.part ?? ''}
						placeholder="Part — (optional divider)"
						class="ch-part"
						oninput={(v) => set(() => (ch.part = v || undefined))}
					/>
					<Editable
						single
						plain
						value={ch.title}
						placeholder="Chapter title"
						class="ch-title"
						oninput={(v) => set(() => (ch.title = v))}
					/>
					<div class="ch-subrow">
						<Editable
							single
							plain
							value={ch.hanja ?? ''}
							placeholder="漢字"
							class="ch-hanja"
							oninput={(v) => set(() => (ch.hanja = v || undefined))}
						/>
						<Editable
							single
							plain
							value={ch.korean ?? ''}
							placeholder="한글"
							class="ch-hanja"
							oninput={(v) => set(() => (ch.korean = v || undefined))}
						/>
						<Editable
							single
							plain
							value={ch.range}
							placeholder="632–642"
							class="ch-range"
							oninput={(v) => set(() => (ch.range = v))}
						/>
						<button class="ghost danger" onclick={() => removeChapter(ci)}>Delete chapter</button>
					</div>
				</header>

				{#each ch.entries as entry, ei (entry.__id)}
					<div id={'en-' + entry.__id}>
						<EntryEditor
							{entry}
							onremove={() => removeEntry(ci, ei)}
							onmove={(dir) => moveEntry(ci, ei, dir)}
						/>
					</div>
				{/each}

				<button class="ghost add-entry" onclick={() => addEntry(ci)}>+ Entry</button>
			</section>
		{/each}
	</main>
</div>

<style>
	/* The editor keeps a light, Notion-like surface even though the story is dark */
	.editor {
		display: flex;
		min-height: 100vh;
		background: #fff;
		color: #37352f;
		font-family: var(--sans);
		letter-spacing: normal;
	}

	/* ————— sidebar ————— */
	.side {
		position: sticky;
		top: 0;
		align-self: flex-start;
		height: 100vh;
		overflow-y: auto;
		width: 15rem;
		flex-shrink: 0;
		background: #f7f7f5;
		border-right: 1px solid #ececea;
		padding: 1rem 0.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.back {
		font-size: 0.85rem;
		color: #787774;
		text-decoration: none;
		padding: 0.3rem 0.5rem;
		border-radius: var(--radius);
	}

	.back:hover {
		background: #ececea;
	}

	nav {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.nav-ch,
	.nav-en {
		font: inherit;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: var(--radius);
		padding: 0.3rem 0.5rem;
		cursor: pointer;
		color: #37352f;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.nav-ch {
		font-weight: 700;
		font-size: 0.88rem;
		margin-top: 0.7rem;
	}

	.nav-en {
		font-size: 0.82rem;
		padding-left: 1.1rem;
		color: #6b6a67;
	}

	.nav-ch:hover,
	.nav-en:hover {
		background: #ececea;
	}

	.nav-year {
		font-family: var(--serif);
		font-weight: 700;
		margin-right: 0.3rem;
	}

	/* ————— status pill ————— */
	.status {
		position: fixed;
		top: 0.8rem;
		right: 1rem;
		z-index: 80;
		font-size: 0.78rem;
		padding: 0.25rem 0.7rem;
		border-radius: var(--radius-pill);
		background: #f1f1ef;
		color: #787774;
		transition: all 150ms ease;
	}

	.status[data-s='saving'] {
		background: #fdf3e7;
		color: #b45309;
	}

	.status[data-s='error'] {
		background: #fbe4e4;
		color: #c0392b;
	}

	/* ————— canvas ————— */
	.canvas {
		flex: 1;
		max-width: 56rem;
		padding: 3rem 3rem 8rem 5rem; /* left room for block gutters */
	}

	.loading {
		color: #9b9a97;
	}

	.chapter {
		margin-bottom: 3rem;
	}

	.ch-head {
		margin: 2.2rem 0 0.6rem;
		border-bottom: 4px solid var(--ink);
		padding-bottom: 0.5rem;
	}

	:global(.editable.ch-part) {
		font-family: var(--serif);
		font-weight: 900;
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #787774;
		padding: 2px 4px;
		max-width: 16rem;
	}

	:global(.editable.ch-title) {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 2rem;
		line-height: 1.1;
		padding: 2px 4px;
	}

	.ch-subrow {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0.2rem;
	}

	:global(.editable.ch-hanja) {
		font-family: 'Noto Serif KR', serif;
		font-weight: 900;
		font-size: 1rem;
		padding: 2px 4px;
		min-width: 3rem;
	}

	:global(.editable.ch-range) {
		font-family: var(--serif);
		font-size: 1rem;
		padding: 2px 4px;
		min-width: 4.5rem;
	}

	.ch-subrow .ghost {
		margin-left: auto;
		opacity: 0;
		transition: opacity 120ms ease;
	}

	.ch-head:hover .ghost {
		opacity: 1;
	}

	.ghost {
		font: inherit;
		font-size: 0.78rem;
		color: #787774;
		background: #f1f1ef;
		border: none;
		border-radius: var(--radius);
		padding: 0.25rem 0.6rem;
		cursor: pointer;
	}

	.ghost:hover {
		background: #e8e8e6;
	}

	.ghost.danger:hover {
		background: #fbe4e4;
		color: #c0392b;
	}

	.add-entry {
		margin-top: 0.6rem;
	}
</style>
