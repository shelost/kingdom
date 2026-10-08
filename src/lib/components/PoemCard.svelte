<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId } from '$lib/people';
	import { onceInView } from '$lib/inView';
	import { reading } from '$lib/reading.svelte';
	import Avatar from './Avatar.svelte';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';
	import { balance } from './balance';

	type Poem = Extract<Block, { kind: 'poem' }>;

	let {
		block,
		year = null,
		side = 'left'
	}: {
		block: Poem;
		year?: number | null;
		/** Two poets answer each other across the page. */
		side?: 'left' | 'right';
	} = $props();

	const PUNCT = /[，。；：！？、,.;:!?\s]/g;
	const COLUMN_MS = 200;

	/** One line per column: split on newlines, else after each closing punctuation mark. */
	let columns = $derived.by(() => {
		const t = block.hanja.trim();
		const parts = t.includes('\n') ? t.split(/\n+/) : t.split(/(?<=[，。；！？,.;!?])/);
		return parts.map((s) => s.replace(PUNCT, '')).filter(Boolean);
	});
	let poet = $derived(block.person ? byId.get(block.person) : undefined);
	/** The original plus one reading: the reader's language, else whichever the poem has. */
	let ko = $derived(reading.lang === 'ko' && !!block.ko);
	let readingLines = $derived(lines(ko ? block.ko : block.html));
	let inked = $state(false);

	function lines(s: string | undefined): string[] {
		return s ? s.split(/\s*(?:<br\s*\/?>|\n)\s*/i).filter(Boolean) : [];
	}

	function render(s: string) {
		return supMarks(linkPeople(s, year), block.notes);
	}

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.25 });
</script>

<figure class="poem {side}" class:inked {@attach ink}>
	<header class="head">
		{#if poet}<Avatar person={poet} {year} size="2.1rem" label />{/if}
		{#if block.title}<span class="title">{block.title}</span>{/if}
	</header>
	<div class="sheet ink-plate" {@attach balance('.verse', '.reading')}>
		<Material kind="paper" />
		<span class="plate-tab">詩 · Poem</span>
		<div class="verse" lang="zh-Hant" aria-label={block.hanja}>
			{#each columns as col, i (i)}
				<span class="col" style:--i={i} aria-hidden="true">{col}</span>
			{/each}
		</div>
		<div class="reading" style:--n={columns.length}>
			{#each readingLines as line, j (j)}
				<p class="line" class:ko class:en={!ko} lang={ko ? 'ko' : 'en'} style:--j={j}>{@html render(line)}</p>
			{/each}
			<RecordNotes notes={block.notes} {year} />
			{#if block.source}
				<div class="source">
					<RecordCite source={block.source} {inked} delay={columns.length * COLUMN_MS + 300} />
				</div>
			{/if}
		</div>
	</div>
</figure>

<style>
	.poem {
		width: min(100%, 38rem);
		margin: var(--widget-gap) 0;
	}

	.poem.right {
		margin-left: auto;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem 0.7rem;
		margin-bottom: 0.55rem;
	}

	.right .head {
		justify-content: flex-end;
	}

	.title {
		font-family: var(--serif);
		font-size: 0.78rem;
		font-style: italic;
		color: var(--fg-faint);
	}

	/* Xuan paper with vermilion column rules (朱絲欄) behind the verse. */
	.sheet {
		--glyph: var(--sumi);
		--rule: rgb(184 56 42 / 0.28);
		--text-cite: var(--vermilion);
		--text-faint: var(--sumi-dim);
		isolation: isolate;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
		gap: 1.1rem 1.4rem;
		margin: 0;
		padding-top: 1.5rem;
	}

	.right .sheet {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.right .verse {
		order: 2;
	}

	.verse {
		display: flex;
		flex-direction: row-reverse;
		gap: 0;
		padding: 0.2rem 0;
		border-inline: 1px solid var(--rule);
	}

	.col {
		writing-mode: vertical-rl;
		padding: 0.15rem 0.38rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.22rem;
		font-weight: 600;
		line-height: 1;
		letter-spacing: 0.22em;
		color: var(--glyph);
		border-left: 1px solid var(--rule);
		clip-path: inset(0 0 100% 0);
		transition: clip-path 380ms cubic-bezier(0.3, 0.6, 0.3, 1);
		transition-delay: calc(var(--i) * 200ms);
	}

	.col:last-child {
		border-left: none;
	}

	.inked .col {
		clip-path: inset(0 0 -0.2em 0);
	}

	.reading {
		display: grid;
		gap: 0.5rem;
		min-width: 0;
	}

	.line {
		display: grid;
		gap: 0.08rem;
		margin: 0;
		opacity: 0;
		transform: translateY(0.25rem);
		transition:
			opacity 360ms var(--ease),
			transform 360ms var(--ease);
		transition-delay: calc(var(--n) * 200ms + var(--j) * 110ms);
	}

	.inked .line {
		opacity: 1;
		transform: none;
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--sumi);
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		color: var(--sumi);
	}

	.source {
		margin-top: 0.4rem;
	}

	/* A long translation beside a short verse: the verse spans the top, the reading flows below in two columns. */
	.sheet:global([data-balance='band']) {
		grid-template-columns: minmax(0, 1fr);
	}

	.sheet:global([data-balance='band']) .verse {
		order: 0;
		justify-self: center;
	}

	.sheet:global([data-balance='band']) .reading {
		display: block;
		columns: 2 15rem;
		column-gap: 1.8rem;
		column-rule: 1px solid var(--rule);
	}

	.sheet:global([data-balance='band']) .reading > :global(*) {
		break-inside: avoid;
		margin-bottom: 0.5rem;
	}

	.sheet:global([data-balance='band']) .reading > :global(.record-notes),
	.sheet:global([data-balance='band']) .source {
		column-span: all;
	}

	@media (prefers-reduced-motion: reduce) {
		.col,
		.line {
			transition: none;
			clip-path: none;
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 560px) {
		.sheet,
		.right .sheet {
			grid-template-columns: minmax(0, 1fr);
		}

		.verse,
		.right .verse {
			order: 0;
			justify-self: center;
		}
	}
</style>
