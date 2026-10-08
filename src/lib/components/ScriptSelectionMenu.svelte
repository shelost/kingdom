<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { chapters, entryId, type Block } from '$lib/story';
	import { lineStarId, type StarredLine } from '$lib/lineStars';
	import { ensureLineStars, isLineStarred, toggleLineStar } from '$lib/lineStarsUi.svelte';
	import type { BlockPath } from '$lib/rewrite';

	/**
	 * Highlight a passage of the script and a small bar floats above it: star the
	 * passage, or (in dev) rewrite its block with a note and accept the result.
	 */

	type Picked = {
		text: string;
		context: string;
		episodeId: string;
		entryTitle: string;
		person?: string;
		inKorean: boolean;
		x: number;
		y: number;
	};
	type Preview = { path: BlockPath; before: Block; block: Block };

	const TITLES = new Map(chapters.flatMap((c) => c.entries.map((e) => [entryId(c.id, e.title), e.title])));

	let picked = $state<Picked | null>(null);
	let mode = $state<'bar' | 'note' | 'busy' | 'preview'>('bar');
	let note = $state('');
	let preview = $state<Preview | null>(null);
	let failure = $state('');
	let menu = $state<HTMLElement>();
	let pointerDown = false;

	let starId = $derived(picked ? lineStarId(picked.episodeId, picked.text) : '');
	let starred = $derived(!!starId && isLineStarred(starId));

	/** The selection, if it sits inside one episode of the script. */
	function readSelection(): Picked | null {
		const sel = window.getSelection();
		if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
		const text = sel.toString().replace(/\s+/g, ' ').trim();
		if (text.length < 2) return null;
		const range = sel.getRangeAt(0);
		const start = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
		const entry = start?.closest<HTMLElement>('[data-story-root] article.entry[data-story-id]');
		if (!start || !entry || !entry.contains(range.endContainer)) return null;
		const episodeId = entry.dataset.storyId ?? '';
		const holder = start.closest<HTMLElement>('.dialogue, p, blockquote, li, figcaption') ?? start;
		const rect = range.getBoundingClientRect();
		return {
			text,
			context: (holder.textContent ?? '').replace(/\s+/g, ' ').trim(),
			episodeId,
			entryTitle: TITLES.get(episodeId) ?? '',
			person: start.closest<HTMLElement>('.dialogue[data-speaker]')?.dataset.speaker,
			inKorean: !!start.closest('.line.ko, [lang="ko"]'),
			x: rect.left + rect.width / 2,
			y: rect.top
		};
	}

	function refresh() {
		if (pointerDown || (mode !== 'bar' && picked)) return;
		picked = readSelection();
		failure = '';
	}

	function close() {
		picked = null;
		mode = 'bar';
		note = '';
		preview = null;
		failure = '';
		window.getSelection()?.removeAllRanges();
	}

	function star() {
		if (!picked) return;
		const line: StarredLine = {
			id: starId,
			episodeId: picked.episodeId,
			entryTitle: picked.entryTitle,
			...(picked.person ? { person: picked.person } : {}),
			en: picked.text,
			...(picked.inKorean ? { ko: picked.text } : {}),
			createdAt: new Date().toISOString()
		};
		toggleLineStar(line);
	}

	async function openNote() {
		mode = 'note';
		await tick();
		menu?.querySelector('textarea')?.focus();
	}

	async function post(body: object): Promise<Response> {
		return fetch(resolve('/api/rewrite'), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
	}

	async function runPreview() {
		if (!picked) return;
		mode = 'busy';
		failure = '';
		try {
			const res = await post({
				mode: 'preview',
				episodeId: picked.episodeId,
				selection: picked.text,
				context: picked.context,
				note
			});
			if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? res.statusText);
			preview = (await res.json()) as Preview;
			mode = 'preview';
		} catch (err) {
			failure = err instanceof Error ? err.message : String(err);
			mode = 'note';
		}
	}

	async function accept() {
		if (!picked || !preview) return;
		mode = 'busy';
		try {
			const res = await post({ mode: 'apply', episodeId: picked.episodeId, ...preview });
			if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? res.statusText);
			close();
		} catch (err) {
			failure = err instanceof Error ? err.message : String(err);
			mode = 'preview';
		}
	}

	/** The new block's English and Korean, as the preview shows them. */
	function linesOf(b: Block): { en: string; ko: string }[] {
		const v = b as { html?: string; ko?: string; en?: string[]; lines?: string[] };
		if (v.en || v.lines)
			return (v.en ?? v.lines ?? []).map((en, i) => ({ en, ko: v.lines?.[i] ?? '' }));
		return [{ en: v.html ?? '', ko: v.ko ?? '' }];
	}

	const strip = (s: string) => s.replace(/<[^>]+>/g, '');

	onMount(() => {
		void ensureLineStars();
		const down = (e: PointerEvent) => {
			if (menu?.contains(e.target as Node)) return;
			pointerDown = true;
			if (mode !== 'bar') close();
		};
		const up = () => {
			pointerDown = false;
			requestAnimationFrame(refresh);
		};
		const key = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && picked) close();
		};
		document.addEventListener('pointerdown', down);
		document.addEventListener('pointerup', up);
		document.addEventListener('selectionchange', refresh);
		document.addEventListener('keydown', key);
		window.addEventListener('scroll', refresh, { passive: true });
		return () => {
			document.removeEventListener('pointerdown', down);
			document.removeEventListener('pointerup', up);
			document.removeEventListener('selectionchange', refresh);
			document.removeEventListener('keydown', key);
			window.removeEventListener('scroll', refresh);
		};
	});
</script>

{#if picked}
	<div
		class="sel-menu liquid-glass"
		class:wide={mode !== 'bar'}
		style:left="{picked.x}px"
		style:top="{picked.y}px"
		bind:this={menu}
		role="dialog"
		aria-label="Selection"
	>
		{#if mode === 'bar'}
			<button type="button" onclick={star} aria-pressed={starred}>
				<span class="material-symbols-outlined" class:filled={starred} aria-hidden="true">star</span>
				{starred ? 'Starred' : 'Star'}
			</button>
			{#if dev}
				<button type="button" onclick={openNote}>
					<span class="material-symbols-outlined" aria-hidden="true">edit_note</span>
					Rewrite
				</button>
			{/if}
		{:else if mode === 'note' || mode === 'busy'}
			<form
				class="note"
				onsubmit={(e) => {
					e.preventDefault();
					void runPreview();
				}}
			>
				<p class="quote">“{picked.text}”</p>
				<textarea
					bind:value={note}
					rows="3"
					placeholder="How should it change? (blank: make it read more naturally)"
					disabled={mode === 'busy'}
					onkeydown={(e) => {
						if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void runPreview();
					}}
				></textarea>
				{#if failure}<p class="failure" role="alert">{failure}</p>{/if}
				<div class="actions">
					<button type="button" class="quiet" onclick={close} disabled={mode === 'busy'}>Cancel</button>
					<button type="submit" class="solid" disabled={mode === 'busy'}>
						{mode === 'busy' ? 'Rewriting…' : 'Rewrite'}
					</button>
				</div>
			</form>
		{:else if preview}
			<div class="note">
				<ol class="result">
					{#each linesOf(preview.block) as line, i (i)}
						<li>
							<span class="en">{strip(line.en)}</span>
							{#if line.ko}<span class="ko" lang="ko">{strip(line.ko)}</span>{/if}
						</li>
					{/each}
				</ol>
				{#if failure}<p class="failure" role="alert">{failure}</p>{/if}
				<div class="actions">
					<button type="button" class="quiet" onclick={close}>Discard</button>
					<button type="button" class="quiet" onclick={runPreview}>Try again</button>
					<button type="button" class="solid" onclick={accept}>Accept</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Floats just above the highlighted words, centred on them. */
	.sel-menu {
		--glass-tint: 88%;
		position: fixed;
		z-index: 120;
		display: flex;
		gap: 0.15rem;
		padding: 0.25rem;
		border-radius: var(--radius-pill);
		translate: -50% calc(-100% - 0.6rem);
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		animation: pop 0.18s var(--ease) both;
	}

	.sel-menu.wide {
		display: block;
		width: min(26rem, calc(100vw - 2rem));
		padding: 0.85rem;
		border-radius: var(--radius);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.4rem 0.8rem;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
	}

	button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.material-symbols-outlined {
		font-size: 1.05rem;
	}

	.filled {
		font-variation-settings: 'FILL' 1;
	}

	.note {
		display: grid;
		gap: 0.6rem;
	}

	.quote {
		margin: 0;
		font-family: var(--serif);
		font-size: 0.88rem;
		line-height: 1.4;
		color: var(--fg-dim);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	textarea {
		width: 100%;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--bg);
		color: var(--fg-strong);
		font: inherit;
		font-size: 0.85rem;
		resize: vertical;
	}

	.result {
		display: grid;
		gap: 0.55rem;
		max-height: 16rem;
		margin: 0;
		padding: 0;
		overflow: auto;
		list-style: none;
	}

	.result li {
		display: grid;
		gap: 0.15rem;
	}

	.en {
		font-family: var(--serif);
		font-size: 0.92rem;
		line-height: 1.4;
		color: var(--fg-strong);
	}

	.ko {
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.failure {
		margin: 0;
		font-size: 0.78rem;
		color: #e11d48;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.solid {
		color: var(--bg);
		background: var(--fg-strong);
	}

	.solid:hover:not(:disabled) {
		background: var(--fg-strong);
		opacity: 0.88;
	}

	@keyframes pop {
		from {
			opacity: 0;
			scale: 0.94;
		}
	}
</style>
