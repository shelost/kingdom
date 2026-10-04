<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { editUi, permanentlyDeleteImage } from '$lib/editUi.svelte';
	import { closeImageGrade, existingGrade, imageGradeUi, saveInlineGrade } from '$lib/imageGradeUi.svelte';
	import { ensureStars, isStarred, toggleStar } from '$lib/imageStarsUi.svelte';
	import { STILL_EXPAND_ASPECTS, type StillEditOp } from '$lib/stillEdit';
	import { runStillEdit, stillEditUi } from '$lib/stillEditUi.svelte';

	const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

	let open = $derived(imageGradeUi.open && editUi.enabled && !!imageGradeUi.slotId);
	let slotId = $derived(imageGradeUi.slotId);
	let existing = $derived(existingGrade(slotId));
	let starred = $derived(!!slotId && isStarred(slotId));
	let boxEl: HTMLDivElement | null = null;

	$effect(() => {
		if (open) void ensureStars();
	});

	function star() {
		if (slotId) toggleStar(slotId);
	}

	const left = $derived(imageGradeUi.x);
	const top = $derived(imageGradeUi.y);

	const place: Attachment<HTMLElement> = (node) => {
		boxEl = node as HTMLDivElement;
		const pad = 10;
		const apply = () => {
			const r = node.getBoundingClientRect();
			const x = Math.min(Math.max(pad, imageGradeUi.x), window.innerWidth - r.width - pad);
			const y = Math.min(Math.max(pad, imageGradeUi.y), window.innerHeight - r.height - pad);
			node.style.left = `${x}px`;
			node.style.top = `${y}px`;
		};
		apply();
		node.focus();
		const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null;
		ro?.observe(node);
		window.addEventListener('resize', apply);
		return () => {
			if (boxEl === node) boxEl = null;
			ro?.disconnect();
			window.removeEventListener('resize', apply);
		};
	};

	let toolsOn = $derived(stillEditUi.available === true);

	async function save() {
		if (imageGradeUi.draftScore === null || imageGradeUi.saving) return;
		await saveInlineGrade({
			score: imageGradeUi.draftScore,
			note: imageGradeUi.draftNote.trim(),
			axes: {}
		});
	}

	async function tool(op: StillEditOp) {
		const id = slotId;
		if (!id) return;
		await runStillEdit(id, op);
	}

	function onDocKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			closeImageGrade();
			return;
		}
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			const t = e.target;
			if (t instanceof HTMLTextAreaElement && t.dataset.stillPrompt != null) return;
			e.preventDefault();
			void save();
			return;
		}
		const t = e.target;
		if (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement) {
			if (e.key === 'Enter' && !e.shiftKey && t instanceof HTMLInputElement) {
				e.preventDefault();
				void save();
			}
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			void save();
			return;
		}
		if (e.key === 's' || e.key === 'S') {
			e.preventDefault();
			star();
			return;
		}
		if (e.key >= '1' && e.key <= '9') imageGradeUi.draftScore = Number(e.key);
		if (e.key === '0') imageGradeUi.draftScore = 10;
	}

	function onPointerDown(e: PointerEvent) {
		if (!open) return;
		if (e.button === 2) return;
		const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
		if (now < imageGradeUi.ignoreUntil) return;
		const t = e.target;
		if (t instanceof Node && boxEl?.contains(t)) return;
		closeImageGrade();
	}

	async function onDelete() {
		const id = slotId;
		if (!id) return;
		closeImageGrade();
		await permanentlyDeleteImage({ kind: 'cue', slotId: id });
	}
</script>

<svelte:window onkeydown={onDocKey} onpointerdown={onPointerDown} />

{#if open && slotId}
	<div
		class="grade-pop"
		style:left="{left}px"
		style:top="{top}px"
		{@attach place}
		role="dialog"
		tabindex="0"
		aria-label="Grade and edit this still"
		oncontextmenu={(e) => e.preventDefault()}
	>
		<div class="head">
			<p class="id">{slotId}</p>
			<button type="button" class="star" class:on={starred} aria-pressed={starred} onclick={star}>
				<span aria-hidden="true">{starred ? '★' : '☆'}</span>
				{starred ? 'Starred' : 'Star'}
			</button>
		</div>
		<div class="scores" role="group" aria-label="Score from 1 to 10">
			{#each SCORES as n (n)}
				<button
					type="button"
					class="score"
					class:on={imageGradeUi.draftScore === n}
					onclick={() => (imageGradeUi.draftScore = n)}
				>
					{n}
				</button>
			{/each}
		</div>
		<label class="blurb">
			<span class="lbl">Keep / cut</span>
			<textarea
				data-grade-note
				bind:value={imageGradeUi.draftNote}
				rows="3"
				placeholder="What to copy, or what to ban…"
			></textarea>
		</label>
		{#if imageGradeUi.error}
			<p class="err">{imageGradeUi.error}</p>
		{/if}
		<div class="row">
			<button type="button" class="ghost" onclick={closeImageGrade}>Cancel</button>
			<button
				type="button"
				class="save"
				disabled={imageGradeUi.draftScore === null || imageGradeUi.saving}
				onclick={() => void save()}
			>
				{existing ? 'Update' : 'Save'}
			</button>
		</div>
		{#if toolsOn}
			<div class="tools">
				<p class="lbl">Image tools</p>
				<button
					type="button"
					class="tool"
					disabled={stillEditUi.busy}
					onclick={() => void tool('remove-bg')}
				>
					Remove background
				</button>
				<label class="blurb tight">
					<span class="lbl">Edit with prompt</span>
					<textarea
						data-still-prompt
						bind:value={stillEditUi.prompt}
						rows="2"
						placeholder="Keep faces. Change only…"
						disabled={stillEditUi.busy}
					></textarea>
				</label>
				<button
					type="button"
					class="tool"
					disabled={stillEditUi.busy || !stillEditUi.prompt.trim()}
					onclick={() => void tool('prompt-edit')}
				>
					Apply edit
				</button>
				<p class="lbl">Expand</p>
				<div class="row aspects">
					{#each STILL_EXPAND_ASPECTS as ratio (ratio)}
						<button
							type="button"
							class="aspect"
							class:on={stillEditUi.aspect === ratio}
							disabled={stillEditUi.busy}
							onclick={() => (stillEditUi.aspect = ratio)}
						>
							{ratio}
						</button>
					{/each}
				</div>
				<button
					type="button"
					class="tool"
					disabled={stillEditUi.busy}
					onclick={() => void tool('expand')}
				>
					Expand canvas
				</button>
				{#if stillEditUi.busy}
					<p class="hint">Working on {slotId}…</p>
				{/if}
				{#if stillEditUi.error}
					<p class="err">{stillEditUi.error}</p>
				{/if}
			</div>
		{/if}
		<button type="button" class="kill" onclick={() => void onDelete()}>Delete cue</button>
		<p class="hint">Esc closes · S stars · Enter saves grade · ⌘Enter in the note</p>
	</div>
{/if}

<style>
	.grade-pop {
		position: fixed;
		z-index: 240;
		width: min(20.5rem, calc(100vw - 1.2rem));
		max-height: calc(100vh - 1.4rem);
		overflow: auto;
		padding: 0.7rem 0.75rem 0.6rem;
		border-radius: 10px;
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--panel) 92%, transparent);
		backdrop-filter: blur(14px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
		font-family: var(--ui);
		color: var(--fg);
		outline: none;
	}

	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		margin: 0 0 0.45rem;
	}

	.id {
		margin: 0;
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
		word-break: break-all;
	}

	.star {
		flex-shrink: 0;
		padding: 0.18rem 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: var(--panel-sunken);
		color: var(--fg-dim);
		font-family: inherit;
		font-size: 0.66rem;
		font-weight: 600;
		cursor: pointer;
	}

	.star.on {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.scores,
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.22rem;
	}

	.score,
	.ghost,
	.save,
	.kill,
	.tool,
	.aspect {
		font-family: inherit;
		cursor: pointer;
	}

	.score {
		width: 1.55rem;
		height: 1.55rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: 6px;
		background: var(--panel-sunken);
		color: var(--fg);
		font-size: 0.68rem;
		font-weight: 600;
	}

	.score.on {
		color: var(--on-highlight);
		background: var(--highlight);
		border-color: var(--highlight);
	}

	.blurb {
		display: grid;
		gap: 0.22rem;
		margin: 0.5rem 0 0.4rem;
	}

	.lbl {
		font-size: 0.58rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	textarea {
		width: 100%;
		resize: vertical;
		min-height: 3.4rem;
		font: inherit;
		font-size: 0.78rem;
		line-height: 1.35;
		color: var(--fg);
		background: var(--panel-sunken);
		border: 1px solid var(--hairline);
		border-radius: 7px;
		padding: 0.4rem 0.5rem;
		outline: none;
	}

	.row {
		margin-top: 0.15rem;
		justify-content: flex-end;
	}

	.ghost,
	.save {
		border-radius: 7px;
		padding: 0.32rem 0.7rem;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.ghost {
		border: 1px solid var(--hairline);
		background: transparent;
		color: var(--fg-dim);
	}

	.save {
		border: 1px solid var(--highlight);
		background: var(--highlight);
		color: var(--on-highlight);
	}

	.save:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.kill {
		display: block;
		margin: 0.35rem 0 0;
		padding: 0;
		border: none;
		background: none;
		color: var(--fg-faint);
		font-size: 0.62rem;
		letter-spacing: 0.04em;
	}

	.kill:hover {
		color: var(--fg);
	}

	.hint,
	.err {
		margin: 0.35rem 0 0;
		font-size: 0.58rem;
		color: var(--fg-faint);
	}

	.err {
		color: color-mix(in srgb, #c45c4a 80%, var(--fg));
	}

	.tools {
		margin-top: 0.7rem;
		padding-top: 0.55rem;
		border-top: 1px solid var(--hairline);
	}

	.tools .lbl {
		margin: 0.35rem 0 0.28rem;
	}

	.blurb.tight {
		margin: 0.2rem 0 0.3rem;
	}

	.blurb.tight textarea {
		min-height: 2.6rem;
	}

	.tool {
		display: block;
		width: 100%;
		margin: 0.2rem 0 0.35rem;
		border-radius: 7px;
		padding: 0.32rem 0.65rem;
		font-size: 0.72rem;
		font-weight: 600;
		border: 1px solid var(--hairline);
		background: var(--panel-sunken);
		color: var(--fg);
	}

	.tool:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.aspects {
		justify-content: flex-start;
		margin: 0 0 0.25rem;
	}

	.aspect {
		padding: 0.22rem 0.45rem;
		border-radius: 6px;
		border: 1px solid var(--hairline);
		background: var(--panel-sunken);
		color: var(--fg);
		font-size: 0.62rem;
		font-weight: 600;
	}

	.aspect.on {
		color: var(--on-highlight);
		background: var(--highlight);
		border-color: var(--highlight);
	}
</style>
