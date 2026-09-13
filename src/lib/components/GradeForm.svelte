<script lang="ts">
	import { untrack } from 'svelte';
	import {
		GRADE_AXES,
		blankAxisScores,
		type GradeAxes,
		type GradeAxisId,
		type GradeDraft,
		type ImageGrade
	} from '$lib/imageGrades';
	import type { StoryCueImage } from '$lib/storyImages';
	import type { SelfStillGrade } from '$lib/selfGrade';

	const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

	let {
		im,
		existing,
		suggestion,
		saving = false,
		onsave,
		onskip,
		onprev,
		onclear
	}: {
		im: StoryCueImage;
		existing?: ImageGrade;
		suggestion?: SelfStillGrade;
		saving?: boolean;
		onsave: (draft: GradeDraft) => void;
		onskip: () => void;
		onprev: () => void;
		onclear: () => void;
	} = $props();

	/* Initial values only — parent remounts this form with {#key im.slot.id}. */
	let score = $state<number | null>(untrack(() => existing?.score ?? null));
	let note = $state(
		untrack(() => existing?.note || [existing?.keep, existing?.cut].filter(Boolean).join(' — ') || '')
	);
	let axes = $state<Record<GradeAxisId, number | null>>(
		untrack(() => blankAxisScores(existing?.axes))
	);
	const graded = $derived(!!existing);
	const existingSource = $derived(existing?.source);

	function packedAxes(): GradeAxes {
		const out: GradeAxes = {};
		for (const axis of GRADE_AXES) {
			const n = axes[axis.id];
			if (n !== null) out[axis.id] = n;
		}
		return out;
	}

	function applySelf() {
		if (!suggestion) return;
		score = suggestion.score;
		note = suggestion.note;
		axes = blankAxisScores(suggestion.axes);
	}

	function submit(source: 'human' | 'self' = 'human') {
		if (score === null || saving) return;
		onsave({ score, note: note.trim(), axes: packedAxes(), source });
	}

	function onKey(e: KeyboardEvent) {
		const t = e.target;
		if (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement) return;
		if (e.key === 'ArrowRight' || e.key === 'j') {
			e.preventDefault();
			onskip();
			return;
		}
		if (e.key === 'ArrowLeft' || e.key === 'k') {
			e.preventDefault();
			onprev();
			return;
		}
		if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
			e.preventDefault();
			submit();
			return;
		}
		if (e.key === 'Backspace' && e.shiftKey && graded) {
			e.preventDefault();
			onclear();
			return;
		}
		if (e.key >= '1' && e.key <= '9') {
			score = Number(e.key);
			return;
		}
		if (e.key === '0') score = 10;
	}
</script>

<svelte:window onkeydown={onKey} />

<section class="panel" aria-label="Grade this still">
	<div class="axis overall">
		<p class="axis-label">Overall</p>
		<div class="scores" role="group" aria-label="Overall score from 1 to 10">
			{#each SCORES as n (n)}
				<button type="button" class="score" class:on={score === n} onclick={() => (score = n)}>
					{n}
				</button>
			{/each}
		</div>
	</div>

	{#each GRADE_AXES as axis (axis.id)}
		<div class="axis">
			<p class="axis-label">
				{axis.label}
				{#if 'hint' in axis && axis.hint}
					<span class="hint-inline">{axis.hint}</span>
				{/if}
			</p>
			<div class="scores slim" role="group" aria-label="{axis.label} from 1 to 10">
				{#each SCORES as n (n)}
					<button
						type="button"
						class="score slim"
						class:on={axes[axis.id] === n}
						onclick={() => (axes[axis.id] = n)}
					>
						{n}
					</button>
				{/each}
			</div>
		</div>
	{/each}

	<label class="why">
		<span class="axis-label">Note</span>
		<textarea
			bind:value={note}
			rows="3"
			placeholder="Optional — name the thing: dynamic landing, white void, pasted portrait…"
		></textarea>
	</label>

	<div class="actions">
		<button type="button" class="ghost" onclick={onprev}>Prev</button>
		<button type="button" class="ghost" onclick={onskip}>Skip</button>
		<button type="button" class="save" disabled={score === null || saving} onclick={() => submit()}>
			{graded ? 'Update' : 'Save'} & next
		</button>
		{#if existingSource}
			<span class="hint">{existingSource === 'self' ? 'Last save: self-grade' : 'Last save: human'}</span>
		{/if}
		{#if graded}
			<button type="button" class="ghost" onclick={onclear}>Clear</button>
		{/if}
	</div>

	<p class="hint">Keys 1–9 and 0=10 set overall · Enter saves · ← → skips</p>

	{#if suggestion}
		<div class="self">
			<p class="axis-label">Self-grade</p>
			<p class="self-line">
				Prompt doctrine scores this still <strong>{suggestion.score}</strong>
				{#if suggestion.note}
					— {suggestion.note}
				{/if}
			</p>
			<div class="actions">
				<button type="button" class="ghost" onclick={applySelf}>Fill from self-grade</button>
				<button
					type="button"
					class="ghost"
					disabled={saving}
					onclick={() => {
						applySelf();
						submit('self');
					}}>Save as self-grade</button
				>
			</div>
		</div>
	{/if}

	<details class="meta">
		<summary>Prompt & context</summary>
		<p class="meta-line">{im.chapterTitle} · {im.entryYear}</p>
		{#if im.at}<p class="meta-line">at: {im.at}</p>{/if}
		{#if im.cueContext}<p class="meta-line">{im.cueContext}</p>{/if}
		{#if im.prompt}<p class="prompt">{im.prompt}</p>{/if}
	</details>
</section>

<style>
	.panel {
		display: grid;
		gap: 0.7rem;
	}

	.axis {
		display: grid;
		gap: 0.28rem;
	}

	.axis-label {
		margin: 0;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.hint-inline {
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		opacity: 0.75;
		margin-left: 0.35rem;
	}

	.scores,
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.score,
	.ghost,
	.save {
		font-family: inherit;
		cursor: pointer;
	}

	.score {
		width: 2.35rem;
		height: 2.35rem;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		background: var(--panel);
		color: var(--fg);
		font-size: 0.85rem;
		font-weight: 600;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.score.slim {
		width: 1.95rem;
		height: 1.85rem;
		font-size: 0.75rem;
		border-radius: 6px;
	}

	.score:hover {
		border-color: color-mix(in srgb, var(--fg) 22%, transparent);
	}

	.score.on {
		color: var(--on-highlight);
		background: var(--highlight);
		border-color: var(--highlight);
	}

	.why {
		display: grid;
		gap: 0.35rem;
	}

	.why textarea {
		width: 100%;
		resize: vertical;
		min-height: 4.5rem;
		font: inherit;
		font-size: 0.92rem;
		color: var(--fg);
		background: var(--panel);
		border: 1px solid var(--hairline);
		border-radius: 8px;
		padding: 0.7rem 0.8rem;
		outline: none;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.why textarea:focus {
		border-color: color-mix(in srgb, var(--highlight) 50%, var(--hairline));
		box-shadow:
			0 1px 2px rgba(0, 0, 0, 0.06),
			0 0 0 3px color-mix(in srgb, var(--highlight) 20%, transparent);
	}

	.ghost,
	.save {
		border-radius: 8px;
		padding: 0.55rem 0.9rem;
		font-size: 0.82rem;
		font-weight: 600;
		min-height: 2.4rem;
	}

	.ghost {
		border: 1px solid var(--hairline);
		background: var(--panel);
		color: var(--fg);
	}

	.save {
		border: 1px solid var(--highlight);
		background: var(--highlight);
		color: var(--on-highlight);
	}

	.save:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.hint,
	.meta-line {
		margin: 0;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.meta {
		margin-top: 0.2rem;
		color: var(--fg-dim);
		font-size: 0.78rem;
	}

	.meta summary {
		cursor: pointer;
		color: var(--fg-faint);
	}

	.prompt {
		margin: 0.45rem 0 0;
		white-space: pre-wrap;
		color: var(--fg-dim);
	}

	.self {
		display: grid;
		gap: 0.35rem;
		padding-top: 0.2rem;
		border-top: 1px solid var(--hairline);
	}

	.self-line {
		margin: 0;
		font-size: 0.78rem;
		color: var(--fg-dim);
		line-height: 1.4;
	}

	@media (max-width: 640px) {
		.score {
			width: 2.1rem;
			height: 2.1rem;
		}

		.score.slim {
			width: 1.75rem;
			height: 1.7rem;
		}
	}
</style>
