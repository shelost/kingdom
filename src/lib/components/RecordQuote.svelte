<script module lang="ts">
	/** Stack / Compare state of one testimony group, shared by its cards across beats. */
	type Group = { uid: number; compare: boolean; active: number; dir: 1 | -1 };

	const groups = new WeakMap<object, Group>();
	let nextUid = 0;

	function groupOf(key: object): Group {
		const known = groups.get(key);
		if (known) return known;
		const fresh = $state<Group>({ uid: ++nextUid, compare: false, active: 0, dir: 1 });
		groups.set(key, fresh);
		return fresh;
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import type { Block } from '$lib/story';
	import { linkPeople, byId } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { recordBook, nationLabel, nationLabelKo, type Testimony } from '$lib/recordBooks';
	import { onceInView, prefersReducedMotion } from '$lib/inView';
	import RecordCite from './RecordCite.svelte';
	import RecordOriginal from './RecordOriginal.svelte';
	import RecordLetter from './RecordLetter.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';
	import Avatar from './Avatar.svelte';
	import Material, { type MaterialKind } from './Material.svelte';
	import { balance } from './balance';

	type Quote = Extract<Block, { kind: 'quote' }>;

	let {
		block,
		year = null,
		testimony,
		side = 'left'
	}: {
		block: Quote;
		year?: number | null;
		testimony?: Testimony;
		/** Letters: which side of the exchange this one comes from. */
		side?: 'left' | 'right';
	} = $props();

	/** Past this many characters the original runs as horizontal text, not woodblock columns. */
	const COLUMN_MAX = 72;
	const COLUMN_LEN = 12;
	const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	const COUNT_KO = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];
	const STANCE = {
		agree: { en: 'agree', ko: '일치한다' },
		differ: { en: 'disagree', ko: '엇갈린다' }
	} as const;
	const MATERIAL: Record<string, MaterialKind> = {
		annal: 'paper',
		myth: 'paper',
		stage: 'paper',
		stele: 'rubbing',
		tomb: 'stone',
		sutra: 'paper',
		shaman: 'cloth'
	};

	let book = $derived(recordBook(block.source));
	let kind = $derived(block.style ?? book.kind);
	/** A sutra reads as its original plus the reader's language, not every translation at once. */
	let oneReading = $derived(kind === 'sutra');
	let readKo = $derived(reading.lang === 'ko' && !!block.ko);
	let length = $derived([...(block.hanja ?? '').replace(/\s+/g, '')].length);
	let columns = $derived(length > 0 && length <= COLUMN_MAX);
	let speaker = $derived(block.person ? byId.get(block.person) : undefined);
	let nations = $derived.by(() => {
		if (!testimony || testimony.index > 0) return [];
		const seen = new Set<string>();
		const out: string[] = [];
		for (const n of testimony.nations) {
			const label = nationLabel(n);
			if (label && !seen.has(label)) {
				seen.add(label);
				out.push(label);
			}
		}
		return out;
	});
	/** "Three records agree" / "세 기록이 엇갈린다"; without a stance, the neutral "One incident". */
	let countLabel = $derived.by(() => {
		if (!testimony) return '';
		const n = testimony.count;
		const ko = reading.lang === 'ko';
		if (!testimony.stance) return `One incident · ${COUNT_WORDS[n] ?? n} records`;
		const verb = STANCE[testimony.stance];
		if (ko) return `${COUNT_KO[n] ?? n} 기록이 ${verb.ko}`;
		const word = COUNT_WORDS[n] ?? String(n);
		return `${word[0].toUpperCase()}${word.slice(1)} records ${verb.en}`;
	});
	let claim = $derived(
		testimony ? ((reading.lang === 'ko' ? testimony.claimKo : undefined) ?? testimony.claim) : undefined
	);
	let group = $derived(testimony ? groupOf(testimony.key) : null);
	let comparing = $derived(!!group?.compare);
	let current = $derived(!!group && !!testimony && group.active === testimony.index);
	let tabs = $derived(
		testimony?.sources.map((s, i) => {
			const b = recordBook(s);
			return { i, book: b.name, nation: b.nation };
		}) ?? []
	);
	let inked = $state(false);

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.25 });

	function panelId(g: Group, i: number) {
		return `testimony-${g.uid}-${i}`;
	}

	/** Only the active card draws the tab strip, so each tab id exists once at a time. */
	function tabId(g: Group, i: number) {
		return `${panelId(g, i)}-tab`;
	}

	/** Switch cards; the strip moves to the new card, so keyboard focus follows it there. */
	async function show(i: number, focus = false) {
		if (!group || !testimony) return;
		const g = group;
		const next = (i + testimony.count) % testimony.count;
		if (next === g.active) return;
		g.dir = next > g.active ? 1 : -1;
		g.active = next;
		await tick();
		document.getElementById(panelId(g, next))?.scrollIntoView({
			block: 'nearest',
			behavior: prefersReducedMotion() ? 'auto' : 'smooth'
		});
		if (focus) document.getElementById(tabId(g, next))?.focus({ preventScroll: true });
	}

	function tabKey(e: KeyboardEvent) {
		if (!group || !testimony) return;
		const last = testimony.count - 1;
		const target =
			e.key === 'ArrowRight' ? group.active + 1
			: e.key === 'ArrowLeft' ? group.active - 1
			: e.key === 'Home' ? 0
			: e.key === 'End' ? last
			: null;
		if (target == null) return;
		e.preventDefault();
		show(target, true);
	}
</script>

{#if kind === 'letter'}
	<RecordLetter {block} {year} {side} />
{:else}
	{#if testimony && group && testimony.index === 0}
		<header class="testimony" data-stance={testimony.stance}>
			<span class="t-count">{countLabel}</span>
			{#if claim}
				<span class="t-claim">{claim}</span>
			{/if}
			{#if nations.length > 1}
				<span class="t-nations">{nations.join(' · ')}</span>
			{/if}
			<span class="t-mode" role="group" aria-label="How to read the records">
				<button type="button" aria-pressed={!group.compare} onclick={() => group && (group.compare = false)}>Stack</button>
				<button type="button" aria-pressed={group.compare} onclick={() => group && (group.compare = true)}>Compare</button>
			</span>
		</header>
	{/if}
	{#if testimony && group && comparing && current}
		<div class="t-tabs" role="tablist" aria-label="Records of this incident" tabindex="-1" onkeydown={tabKey}>
			{#each tabs as t (t.i)}
				<button
					type="button"
					role="tab"
					id={tabId(group, t.i)}
					class="t-tab"
					data-nation={t.nation}
					aria-selected={t.i === group.active}
					aria-controls={panelId(group, t.i)}
					tabindex={t.i === group.active ? 0 : -1}
					onclick={() => show(t.i)}
				>
					<span class="t-tab-nation">{(reading.lang === 'ko' ? nationLabelKo(t.nation) : nationLabel(t.nation)) ?? '—'}</span>
					<span class="t-tab-book">{t.book}</span>
				</button>
			{/each}
		</div>
	{/if}
	<figure
		id={group && testimony ? panelId(group, testimony.index) : undefined}
		role={comparing ? 'tabpanel' : undefined}
		aria-labelledby={comparing && current && group && testimony ? tabId(group, testimony.index) : undefined}
		class="record kind-{kind} nation-{book.nation ?? 'none'}"
		class:columns
		class:inked
		class:spoken={!!speaker}
		class:witness={!!testimony && testimony.index > 0}
		class:comparing
		class:benched={comparing && !current}
		style:--dir={group?.dir ?? 1}
		{@attach ink}
		{@attach balance('.original', '.body')}
	>
		<Material kind={MATERIAL[kind] ?? 'paper'} />
		{#if speaker}
			<span class="speaker">
				<Avatar person={speaker} {year} />
			</span>
		{/if}
		{#if kind === 'sutra'}
			<svg class="lotus" viewBox="0 0 64 40" aria-hidden="true">
				<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">
					<path d="M32 3c6 8 6 22 0 33c-6-11-6-25 0-33z" />
					<path d="M32 36c-2-10-9-20-18-24c0 12 7 21 18 24z" />
					<path d="M32 36c2-10 9-20 18-24c0 12-7 21-18 24z" />
					<path d="M32 36C24 30 12 28 3 30c6 6 17 8 29 6z" />
					<path d="M32 36c8-6 20-8 29-6c-6 6-17 8-29 6z" />
				</g>
			</svg>
		{/if}
		{#if block.hanja}
			<RecordOriginal text={block.hanja} {inked} {columns} perColumn={COLUMN_LEN} />
		{/if}
		<div class="body">
			{#if block.native && !(oneReading && block.hanja)}
				<p class="native" lang={block.nativeLang ?? 'ko'}>{block.native}</p>
				{#if block.nativeLatn}
					<p class="native-latn" lang="{block.nativeLang ?? 'sa'}-Latn">{block.nativeLatn}</p>
				{/if}
			{/if}
			{#if block.ko && (!oneReading || readKo)}
				<p class="ko" lang="ko">{@html supMarks(linkPeople(block.ko, year), block.notes)}</p>
			{/if}
			{#if !oneReading || !readKo}
				<blockquote class="en">{@html supMarks(linkPeople(block.html, year), block.notes)}</blockquote>
			{/if}
			<RecordNotes notes={block.notes} {year} />
			<div class="source">
				<RecordCite source={block.source} {inked} delay={Math.min(length, 60) * 26 + 180} />
			</div>
		</div>
	</figure>
{/if}

<style>
	.record {
		--paper: color-mix(in srgb, var(--quote) 7%, transparent);
		--edge: color-mix(in srgb, var(--quote) 22%, transparent);
		--text-ko: color-mix(in srgb, var(--quote) 88%, var(--fg-strong));
		--text-en: color-mix(in srgb, var(--quote) 70%, var(--fg-dim));
		--text-cite: color-mix(in srgb, var(--quote) 70%, var(--fg-strong));
		--text-faint: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 0.9rem 1.4rem;
		margin: var(--widget-gap) 0;
		padding: 1.1rem 1.2rem 1rem;
		border: 1px solid var(--edge);
		border-radius: var(--widget-radius);
		background: var(--paper);
	}

	/* On light paper the record reads in black ink; the book's colour stays in its seal and edge.
	   Stele and tomb set their own ink for their own surfaces below. */
	:global(html[data-theme='light']) .record:not(.kind-stele, .kind-tomb) {
		--glyph: #14110d;
		--text-ko: #14110d;
		--text-en: #2b2621;
		--text-cite: #14110d;
		--text-faint: rgb(20 17 13 / 0.58);
	}

	/* Foreign histories on their own paper: Chinese books in Tang crimson (redder than the
	   Samguk Yusa's orange), Japanese in Yamato indigo. Korean books keep the gold; stones,
	   sutras and shaman cloth keep their own surfaces. */
	.record.nation-china:not(.kind-stele, .kind-tomb, .kind-sutra, .kind-shaman) {
		--quote: #ef8f8f;
	}

	.record.nation-japan:not(.kind-stele, .kind-tomb, .kind-sutra, .kind-shaman) {
		--quote: #9fb2e0;
	}

	:global(html[data-theme='light']) .record.nation-china:not(.kind-stele, .kind-tomb, .kind-sutra, .kind-shaman) {
		--quote: #a3242c;
	}

	:global(html[data-theme='light']) .record.nation-japan:not(.kind-stele, .kind-tomb, .kind-sutra, .kind-shaman) {
		--quote: #33508f;
	}

	/* Woodblock layout: the original stands in columns, read right to left, beside its translations. */
	.record.columns {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
	}

	/* A long translation beside a few columns: the columns head the card, the translation flows under in two. */
	.record.columns:global([data-balance='band']) {
		grid-template-columns: minmax(0, 1fr);
	}

	.record.columns:global([data-balance='band']) > :global(.original) {
		justify-self: center;
	}

	.record.columns:global([data-balance='band']) .body {
		display: block;
		columns: 2 15rem;
		column-gap: 1.6rem;
	}

	.record.columns:global([data-balance='band']) .body > :global(*) {
		break-inside: avoid;
		margin-bottom: 0.45rem;
	}

	.record.columns:global([data-balance='band']) .body > :global(.record-notes),
	.record.columns:global([data-balance='band']) .source {
		column-span: all;
	}

	/* The speaker's face hangs off the top-left corner, ringed in their colour. */
	.record.spoken {
		padding-top: 1.5rem;
	}

	.speaker {
		position: absolute;
		top: -1.05rem;
		left: -1.05rem;
		z-index: 1;
	}

	.body {
		display: grid;
		gap: 0.45rem;
		min-width: 0;
	}

	.native {
		margin: 0;
		font-family: 'Noto Serif KR', 'Noto Serif Devanagari', 'Kohinoor Devanagari', var(--serif);
		font-size: 1.08rem;
		line-height: 1.6;
		color: var(--glyph, var(--text-ko));
	}

	.native-latn {
		margin: -0.2rem 0 0;
		font-size: 0.8rem;
		font-style: italic;
		letter-spacing: 0.02em;
		color: var(--text-faint);
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--text-ko);
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: var(--text-en);
	}

	.source {
		margin-top: 0.45rem;
	}

	/* ————— one incident, several records ————— */
	.testimony {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.7rem;
		margin: 2rem 0 -0.9rem;
		font-family: var(--serif);
	}

	.t-count {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--gold);
	}

	/* Records that contradict each other read in vermilion; agreement keeps the gold. */
	.testimony[data-stance='differ'] .t-count {
		color: var(--vermilion, var(--danger));
	}

	.t-claim {
		font-size: 0.9rem;
		font-style: italic;
		color: var(--fg-strong);
	}

	.t-nations {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	/* Stack | Compare — a small segmented switch at the end of the header. */
	.t-mode {
		display: inline-flex;
		margin-left: auto;
		padding: 2px;
		border: 1px solid color-mix(in srgb, var(--gold) 30%, transparent);
		border-radius: 999px;
		font-family: var(--ui, inherit);
	}

	.t-mode button {
		padding: 0.12rem 0.6rem;
		font: inherit;
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
		background: none;
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.t-mode button[aria-pressed='true'] {
		color: var(--bg, #000);
		background: var(--gold);
	}

	.t-mode button:focus-visible,
	.t-tab:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}

	/* Nation tabs over the record on show. */
	.t-tabs {
		display: flex;
		gap: 0.3rem;
		margin: 1.6rem 0 -0.9rem;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.t-tab {
		flex: none;
		display: grid;
		justify-items: start;
		padding: 0.3rem 0.65rem 0.32rem;
		font: inherit;
		text-align: left;
		color: var(--fg-faint);
		background: color-mix(in srgb, var(--fg) 4%, transparent);
		border: 1px solid transparent;
		border-bottom: none;
		border-radius: var(--radius) var(--radius) 0 0;
		cursor: pointer;
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease);
	}

	.t-tab[aria-selected='true'] {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--quote) 9%, transparent);
		border-color: color-mix(in srgb, var(--quote) 22%, transparent);
	}

	.t-tab-nation {
		font-size: 0.56rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.t-tab[data-nation='korea'] .t-tab-nation {
		color: color-mix(in srgb, #3e79e4 70%, var(--fg-dim));
	}

	.t-tab[data-nation='china'] .t-tab-nation {
		color: color-mix(in srgb, #c8442c 75%, var(--fg-dim));
	}

	.t-tab[data-nation='japan'] .t-tab-nation {
		color: color-mix(in srgb, #9e1f2c 70%, var(--fg-dim));
	}

	.t-tab-book {
		font-family: var(--serif);
		font-size: 0.74rem;
		font-weight: 600;
		white-space: nowrap;
	}

	/* Each further witness hangs from the one above on a thread. */
	.record.witness {
		margin-top: 1.4rem;
	}

	.record.witness:not(.comparing)::before {
		content: '';
		position: absolute;
		left: 1.6rem;
		top: calc(-1.4rem - 1px);
		height: 1.4rem;
		border-left: 1px dashed color-mix(in srgb, var(--gold) 55%, transparent);
	}

	/* Compare: one record at a time; the others stay in the page (their stills
	   still anchor to them) but step out of the flow. */
	.record.comparing {
		margin-top: 0.9rem;
		animation: t-slide 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.record.benched {
		display: none;
	}

	@keyframes t-slide {
		from {
			opacity: 0;
			transform: translateX(calc(var(--dir) * 2rem));
		}
	}

	/* ————— Samguk Yusa: the monk's tales, on warmer paper with a cloud-scroll border ————— */
	.kind-myth {
		--paper: color-mix(in srgb, #cf5a2a 7%, color-mix(in srgb, var(--quote) 5%, transparent));
		--edge: color-mix(in srgb, #cf5a2a 30%, transparent);
		outline: 1px solid var(--edge);
		outline-offset: -5px;
	}

	/* ————— stele: an ink rubbing (탁본) — black paper, the stone's characters left pale ————— */
	.kind-stele {
		--paper: #1c1b1a;
		--edge: #000;
		--glyph: #ece6da;
		--rule: rgb(236 230 218 / 0.18);
		--carve: 0 1px 0 rgb(0 0 0 / 0.9), 0 -1px 0 rgb(255 255 255 / 0.08);
		--text-ko: #e4ddd0;
		--text-en: #b9b2a6;
		--text-cite: #e4ddd0;
		--text-faint: #8d877d;
		--seal-cut: #1c1b1a;
		background-color: var(--paper);
		background-image:
			radial-gradient(circle at 18% 22%, rgb(255 255 255 / 0.05), transparent 40%),
			radial-gradient(circle at 80% 70%, rgb(255 255 255 / 0.04), transparent 46%),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		box-shadow: inset 0 0 40px rgb(0 0 0 / 0.7);
	}

	/* The stone's ruled grid between columns. */
	.kind-stele :global(.original.columns) {
		background-image: repeating-linear-gradient(
			to left,
			transparent 0 calc(1.28em - 1px),
			rgb(236 230 218 / 0.12) calc(1.28em - 1px) 1.28em
		);
	}

	/* ————— tomb: an epitaph stone (墓誌), every character in its own ruled cell ————— */
	.kind-tomb {
		--paper: linear-gradient(160deg, #d9d6cf, #bfbbb2);
		--edge: #8f8a80;
		--glyph: #2b2925;
		--rule: rgb(43 41 37 / 0.25);
		--cell: inset 0 0 0 0.5px rgb(43 41 37 / 0.28);
		--carve: 0 1px 0 rgb(255 255 255 / 0.55);
		--text-ko: #2b2925;
		--text-en: #4a463f;
		--text-cite: #2b2925;
		--text-faint: #67625a;
		background: var(--paper);
		border-radius: var(--widget-radius);
		outline: 1px solid var(--edge);
		outline-offset: -5px;
	}

	:global(html:not([data-theme='light'])) .kind-tomb {
		--paper: linear-gradient(160deg, #46484c, #34363a);
		--edge: #1e1f22;
		--glyph: #e2ddd2;
		--rule: rgb(226 221 210 / 0.2);
		--cell: inset 0 0 0 0.5px rgb(226 221 210 / 0.22);
		--carve: 0 -1px 0 rgb(0 0 0 / 0.6);
		--text-ko: #e2ddd2;
		--text-en: #c0bab0;
		--text-cite: #e2ddd2;
		--text-faint: #9c968c;
	}

	/* ————— sutra: the same paper as every record, a gold lotus at the head ————— */
	.kind-sutra {
		padding-top: 2rem;
	}

	.lotus {
		position: absolute;
		top: 0.35rem;
		left: 50%;
		width: 2.6rem;
		translate: -50% 0;
		color: var(--gold);
		opacity: 0.85;
	}

	.kind-sutra .native {
		font-size: 1.15rem;
		letter-spacing: 0.01em;
	}

	/* ————— shaman: a Jeju bonpuri, the simbang's five-colour streamers down the edge ————— */
	.kind-shaman {
		--paper: color-mix(in srgb, #1f7a72 6%, transparent);
		--edge: color-mix(in srgb, #1f7a72 30%, transparent);
		padding-left: 1.9rem;
	}

	.kind-shaman::after {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 0.7rem;
		border-radius: var(--widget-radius) 0 0 var(--widget-radius);
		background: linear-gradient(
			to right,
			#2b5aa8 0 20%,
			#c8312a 20% 40%,
			#e0b83a 40% 60%,
			#f2efe6 60% 80%,
			#1d1d1d 80% 100%
		);
		opacity: 0.85;
	}

	.kind-shaman .native {
		font-size: 1.12rem;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.record.comparing {
			animation: none;
		}
	}

	@media (max-width: 560px) {
		.record.columns {
			grid-template-columns: minmax(0, 1fr);
		}

		.speaker {
			left: -0.4rem;
		}

		.t-mode {
			margin-left: 0;
		}
	}
</style>
