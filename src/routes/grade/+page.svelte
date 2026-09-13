<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { flattenStoryImages, type StoryCueImage } from '$lib/storyImages';
	import { peopleOfSlot } from '$lib/imagePeople';
	import { storyImg } from '$lib/img';
	import { nsfwAllowed } from '$lib/nsfwUi.svelte';
	import NsfwToggle from '$lib/components/NsfwToggle.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import GradeForm from '$lib/components/GradeForm.svelte';
	import {
		EMPTY_GRADE_STORE,
		readLocalGrades,
		writeLocalGrades,
		type GradeDraft,
		type ImageGrade,
		type ImageGradeStore
	} from '$lib/imageGrades';
	import {
		EMPTY_PROMPT_HOUSE,
		enrichGrade,
		layoutOfPrompt,
		rebuildPromptHouse,
		type PromptHouse
	} from '$lib/promptHouse';
	import { chapters, type ImageSlot } from '$lib/story';
	import { selfGradeAllSequences, selfGradeFromSlot } from '$lib/selfGrade';

	type QueueMode = 'remaining' | 'graded' | 'all';

	let catalog = $state.raw(flattenStoryImages().filter((im) => !!im.displayArt));
	let store = $state.raw<ImageGradeStore>(EMPTY_GRADE_STORE);
	let house = $state.raw<PromptHouse>(EMPTY_PROMPT_HOUSE);
	let mode = $state<QueueMode>('remaining');
	let currentId = $state<string | null>(null);
	let saving = $state(false);
	let saveError = $state('');
	let loaded = $state(false);

	if (import.meta.hot) {
		import.meta.hot.accept(() => {
			catalog = flattenStoryImages().filter((im) => !!im.displayArt);
		});
	}

	const pool = $derived(catalog.filter((im) => nsfwAllowed(im.slot)));
	const queue = $derived.by(() => {
		if (mode === 'all') return pool;
		if (mode === 'graded') return pool.filter((im) => !!store.grades[im.slot.id]);
		return pool.filter((im) => !store.grades[im.slot.id]);
	});
	const current = $derived.by(() => {
		if (!queue.length) return null;
		return queue.find((im) => im.slot.id === currentId) ?? queue[0] ?? null;
	});
	const cursor = $derived(current ? queue.findIndex((im) => im.slot.id === current.slot.id) : 0);
	const gradedCount = $derived(pool.filter((im) => !!store.grades[im.slot.id]).length);
	const remainingCount = $derived(pool.length - gradedCount);
	const slotsById = $derived.by(() => {
		const map = new Map<string, ImageSlot>();
		for (const ch of chapters) {
			for (const en of ch.entries ?? []) {
				for (const im of en.images ?? []) map.set(im.id, im);
			}
		}
		return map;
	});
	const sequenceGrades = $derived(selfGradeAllSequences(slotsById));
	const currentSelf = $derived(current ? selfGradeFromSlot(current.slot) : null);

	function peopleOf(im: StoryCueImage): string[] {
		return peopleOfSlot(im.slot.id, im.slot.people);
	}

	function setMode(next: QueueMode) {
		mode = next;
		if (!queue.some((im) => im.slot.id === currentId)) {
			currentId = queue[0]?.slot.id ?? null;
		}
	}

	function go(delta: number) {
		if (!queue.length) {
			currentId = null;
			return;
		}
		const next = queue[(cursor + delta + queue.length) % queue.length];
		currentId = next?.slot.id ?? null;
	}

	function snapshot(im: StoryCueImage, draft: GradeDraft): ImageGrade {
		const refs = im.refs.map((r) => r.src).filter(Boolean);
		return enrichGrade({
			id: im.slot.id,
			score: draft.score,
			note: draft.note,
			axes: draft.axes,
			keep: '',
			cut: '',
			tags: [],
			tagsWorked: [],
			tagsFailed: [],
			src: im.displayArt,
			prompt: im.prompt,
			alt: im.slot.alt,
			entryTitle: im.entryTitle,
			chapterTitle: im.chapterTitle,
			nsfw: im.isNsfw,
			people: peopleOf(im),
			refs: refs.length ? refs : undefined,
			layout: layoutOfPrompt(im.prompt),
			at: im.at,
			source: draft.source ?? 'human',
			gradedAt: new Date().toISOString()
		});
	}

	function commitStore(next: ImageGradeStore, nextHouse?: PromptHouse) {
		store = next;
		writeLocalGrades(next);
		house = nextHouse ?? rebuildPromptHouse(next);
	}

	async function persist(grade: ImageGrade) {
		saving = true;
		saveError = '';
		try {
			const res = await fetch(resolve('/api/grades'), {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(grade)
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || res.statusText);
			}
			const body = (await res.json()) as { store: ImageGradeStore; house?: PromptHouse };
			commitStore(body.store, body.house);
		} catch (err) {
			commitStore({
				updatedAt: grade.gradedAt,
				grades: { ...store.grades, [grade.id]: grade }
			});
			saveError = err instanceof Error ? err.message : 'Saved in this tab only';
		} finally {
			saving = false;
		}
	}

	async function saveAndNext(im: StoryCueImage, draft: GradeDraft) {
		if (saving) return;
		const idx = cursor;
		const nextId =
			mode === 'remaining'
				? (queue[idx + 1]?.slot.id ?? null)
				: (queue[(idx + 1) % queue.length]?.slot.id ?? null);
		await persist(snapshot(im, draft));
		currentId = nextId;
	}

	async function ungrade(id: string) {
		saving = true;
		const idx = queue.findIndex((im) => im.slot.id === id);
		const nextId = queue[idx + 1]?.slot.id ?? queue[idx - 1]?.slot.id ?? null;
		try {
			const res = await fetch(resolve('/api/grades'), {
				method: 'DELETE',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (res.ok) {
				const body = (await res.json()) as { store: ImageGradeStore; house?: PromptHouse };
				commitStore(body.store, body.house);
			} else {
				const next = { ...store.grades };
				delete next[id];
				commitStore({ ...store, grades: next, updatedAt: new Date().toISOString() });
			}
			if (mode === 'graded') currentId = nextId;
		} finally {
			saving = false;
		}
	}

	onMount(async () => {
		try {
			const res = await fetch(resolve('/api/grades'));
			if (res.ok) {
				const body = (await res.json()) as {
					store?: ImageGradeStore;
					house?: PromptHouse;
					grades?: ImageGradeStore['grades'];
					updatedAt?: string;
				};
				if (body.store?.grades) commitStore(body.store, body.house);
				else commitStore(body as ImageGradeStore, body.house);
			} else {
				commitStore(readLocalGrades() ?? EMPTY_GRADE_STORE);
			}
		} catch {
			commitStore(readLocalGrades() ?? EMPTY_GRADE_STORE);
		}
		loaded = true;
		currentId = queue[0]?.slot.id ?? null;
	});
</script>

<svelte:head>
	<title>Grade stills · King for All</title>
	<meta
		name="description"
		content="Grade chronicle stills one at a time so later art can follow what actually works."
	/>
</svelte:head>

<main class="grade">
	<header class="top">
		<div class="mast-nav">
			<SiteNav />
			<span class="dot" aria-hidden="true">·</span>
			<a class="quiet" href={resolve('/images')}>Images</a>
			<span class="dot" aria-hidden="true">·</span>
			<span>{gradedCount} graded</span>
			<span class="dot" aria-hidden="true">·</span>
			<span>{remainingCount} left</span>
		</div>
		<div class="tools">
			<NsfwToggle compact />
			<div class="modes" role="tablist" aria-label="Queue">
				<button type="button" class:on={mode === 'remaining'} onclick={() => setMode('remaining')}>
					Left
				</button>
				<button type="button" class:on={mode === 'graded'} onclick={() => setMode('graded')}>
					Graded
				</button>
				<button type="button" class:on={mode === 'all'} onclick={() => setMode('all')}>
					All
				</button>
			</div>
		</div>
	</header>

	<p class="lede">
		Overall plus style, place, layout, iconography, iconic emptiness, minimalism, pose, face, angle,
		color, and light. Self-grade reads the prompt; your save still rewrites the house suffix.
	</p>

	<details class="house">
		<summary>Living house prompt</summary>
		{#if house.copy.length}
			<p class="house-line"><strong>Copy</strong> — {house.copy.join('; ')}</p>
		{/if}
		{#if house.ban.length}
			<p class="house-line"><strong>Never</strong> — {house.ban.join('; ')}</p>
		{/if}
		<p class="prompt">{house.suffix}</p>
	</details>

	<details class="house">
		<summary>Five movie sequences (self-grade)</summary>
		<ul class="seq">
			{#each sequenceGrades as seq (seq.id)}
				<li>
					<strong>{seq.title}</strong>
					<span class="seq-score">{seq.score}</span>
					<span class="seq-meta"
						>cover {seq.axes.coverage} · angles {seq.axes.angleVariety} · beats {seq.axes.chronology} ·
						place {seq.axes.placeLock} · stills {seq.axes.stillAvg}</span
					>
					<p>{seq.note}{#if seq.missing.length} — missing {seq.missing.join(', ')}{/if}</p>
					<button
						type="button"
						class="ghost-inline"
						onclick={() => {
							const jump = seq.have[0] ?? seq.missing[0];
							if (!jump) return;
							mode = 'all';
							currentId = jump;
						}}>Open first cut</button
					>
				</li>
			{/each}
		</ul>
	</details>

	{#if !loaded}
		<p class="empty">Loading stills…</p>
	{:else if !current}
		<p class="empty">
			{#if mode === 'remaining'}
				Every visible still has a grade. Switch to Graded to revise, or turn Intimate on if more are hidden.
			{:else}
				Nothing in this queue.
			{/if}
		</p>
	{:else}
		{@const im = current}
		{@const art = im.displayArt}
		<p class="progress" aria-live="polite">
			{cursor + 1} / {queue.length}
			<span>{im.entryTitle} · {im.slot.id}</span>
		</p>

		<figure class="frame" style:--tone={im.slot.tone ?? '#3a3a40'}>
			{#if art}
				<img
					{...storyImg(art, {
						kind: 'cue',
						alt: im.slot.alt ?? im.title,
						priority: true,
						sizes: '(max-width: 900px) 100vw, 56rem'
					})}
				/>
			{/if}
		</figure>

		{#key im.slot.id}
			<GradeForm
				{im}
				existing={store.grades[im.slot.id]}
				suggestion={currentSelf ?? undefined}
				{saving}
				onsave={(draft) => void saveAndNext(im, draft)}
				onskip={() => go(1)}
				onprev={() => go(-1)}
				onclear={() => void ungrade(im.slot.id)}
			/>
		{/key}

		{#if saveError}
			<p class="err">{saveError}</p>
		{/if}
	{/if}
</main>

<style>
	.grade {
		min-height: 100dvh;
		max-width: 56rem;
		margin: 0 auto;
		padding:
			max(1.1rem, env(safe-area-inset-top, 0px) + 0.6rem)
			max(1.15rem, env(safe-area-inset-right, 0px))
			max(3rem, env(safe-area-inset-bottom, 0px) + 1.5rem)
			max(1.15rem, env(safe-area-inset-left, 0px));
		font-family: var(--ui);
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
	}

	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem 1rem;
		margin-bottom: 0.85rem;
	}

	.mast-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.quiet {
		color: inherit;
		text-decoration: none;
	}

	.quiet:hover {
		color: var(--fg);
	}

	.dot {
		opacity: 0.45;
	}

	.lede,
	.progress {
		margin: 0;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.lede {
		margin-bottom: 0.7rem;
		max-width: 36rem;
		line-height: 1.45;
	}

	.house {
		margin: 0 0 1rem;
		color: var(--fg-dim);
		font-size: 0.78rem;
	}

	.house summary {
		cursor: pointer;
		color: var(--fg-faint);
		font-size: 0.72rem;
	}

	.house-line {
		margin: 0.45rem 0 0;
	}

	.prompt {
		margin: 0.45rem 0 0;
		white-space: pre-wrap;
		color: var(--fg-dim);
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.45rem;
	}

	.modes {
		display: flex;
		gap: 0.25rem;
		padding: 0.15rem;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		background: var(--panel);
	}

	.modes button {
		font-family: inherit;
		cursor: pointer;
		border: 0;
		background: transparent;
		color: var(--fg-faint);
		font-size: 0.72rem;
		font-weight: 500;
		padding: 0.28rem 0.6rem;
		border-radius: 6px;
	}

	.modes button.on {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 8%, var(--panel));
	}

	.progress {
		margin-bottom: 0.65rem;
	}

	.progress span {
		color: var(--fg-dim);
		margin-left: 0.4rem;
	}

	.frame {
		margin: 0 0 1.15rem;
		overflow: hidden;
		border: 1px solid var(--hairline);
		border-radius: 8px;
		background: var(--tone, var(--panel-sunken));
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.frame img {
		display: block;
		width: 100%;
		height: auto;
		max-height: min(68vh, 40rem);
		object-fit: contain;
		background: #0a0a0c;
	}

	.err {
		margin: 0.7rem 0 0;
		font-size: 0.78rem;
		color: #c45b4a;
	}

	.empty {
		margin: 3rem 0;
		color: var(--fg-dim);
	}

	.seq {
		margin: 0.5rem 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 0.7rem;
	}

	.seq li p {
		margin: 0.2rem 0 0;
		font-size: 0.72rem;
		color: var(--fg-faint);
		line-height: 1.4;
	}

	.seq-score {
		display: inline-block;
		margin-left: 0.4rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg);
	}

	.seq-meta {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.68rem;
		color: var(--fg-faint);
	}

	.ghost-inline {
		margin-top: 0.25rem;
		font-family: inherit;
		cursor: pointer;
		border: 1px solid var(--hairline);
		background: var(--panel);
		color: var(--fg-faint);
		font-size: 0.68rem;
		font-weight: 600;
		border-radius: 6px;
		padding: 0.2rem 0.5rem;
	}
</style>
