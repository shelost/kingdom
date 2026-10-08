<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import { DIAGRAMS } from './diagrams/registry';
	import BrushGlyphs from './BrushGlyphs.svelte';
	import Material from './Material.svelte';

	type Term = Extract<Block, { kind: 'term' }>;

	let { block }: { block: Term } = $props();

	let play = $state(false);
	let written = $state(false);

	let Diagram = $derived(block.diagram ? DIAGRAMS[block.diagram] : undefined);
	let html = $derived(reading.lang === 'ko' ? (block.ko ?? block.html) : block.html);
	let htmlSub = $derived(reading.lang === 'both' && block.ko ? block.ko : undefined);

	const TABS = {
		term: { en: 'Term', ko: '용어' },
		clan: { en: 'House', ko: '가문' }
	} as const;
	let tab = $derived(TABS[block.tab ?? 'term']);
	let small = $derived(block.tab === 'clan');

	const start = onceInView(() => {
		play = true;
	});
</script>

<figure class="term-card ink-plate" class:has-image={!!block.image} class:small {@attach start}>
	<Material kind="paper" />
	<span class="plate-tab">{reading.lang === 'en' ? tab.en : `${tab.ko} · ${tab.en}`}</span>
	<div class="head">
		<span class="brush">
			<BrushGlyphs
				text={block.hanja}
				size={small ? 'clamp(1.8rem, 6vw, 2.4rem)' : 'clamp(2.2rem, 7.5vw, 3.1rem)'}
				vertical={Array.from(block.hanja).length <= 4}
				{play}
				ondone={() => (written = true)}
			/>
		</span>
		<div class="words" class:shown={written}>
			<span class="reading" lang="ko">{block.reading}</span>
			<span class="term">{block.term}</span>
			<p class="gloss">{@html html}</p>
			{#if htmlSub && htmlSub !== html}<p class="gloss sub" lang="ko">{@html htmlSub}</p>{/if}
		</div>
		{#if block.image}
			<img class="ref" src={block.image} alt="" loading="lazy" decoding="async" />
		{/if}
	</div>
	{#if Diagram}
		<div class="inset">
			<Diagram step={block.step} realm={block.realm} active={play} />
		</div>
	{/if}
</figure>

<style>
	.term-card {
		isolation: isolate;
		padding-top: 1.35rem;
	}

	.head {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		gap: 1rem;
	}

	.has-image .head {
		grid-template-columns: auto 1fr minmax(5.5rem, 26%);
	}

	/* A run of houses stacks tight, like entries in a register. */
	.small {
		margin: 1.1rem 0;
		padding: 1.1rem 1rem 0.8rem;
	}

	.small .gloss {
		margin-top: 0.3rem;
	}

	.small .ref {
		aspect-ratio: 1;
		object-fit: contain;
		object-position: bottom;
		border: none;
		box-shadow: none;
		background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--sumi) 18%, transparent), transparent 70%);
	}

	.brush {
		padding: 0.2rem 0.9rem 0.2rem 0;
		border-right: 2px solid var(--vermilion);
	}

	.words {
		display: grid;
		gap: 0.15rem;
		opacity: 0;
		transform: translateY(0.3rem);
		transition:
			opacity 320ms var(--ease),
			transform 320ms var(--ease);
	}

	.words.shown {
		opacity: 1;
		transform: none;
	}

	.reading {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1.15rem;
		font-weight: 900;
		color: var(--vermilion);
	}

	.term {
		font-family: var(--serif);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--sumi-dim);
	}

	.gloss {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0.5rem 0 0;
		color: var(--sumi);
	}

	.gloss.sub {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin-top: 0.3rem;
		color: var(--sumi-dim);
	}

	/* The picture is a panel inside the panel. */
	.ref {
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		border-radius: var(--widget-radius);
	}

	/* The diagram sits in a page-coloured inset on the paper, so it follows the theme. */
	.inset {
		margin-top: 1rem;
		padding: 0.8rem;
		border-radius: var(--widget-radius);
		color: var(--fg);
		background: radial-gradient(120% 100% at 50% 0%, var(--panel), var(--panel-sunken) 70%);
	}

	.inset :global(svg) {
		display: block;
		width: 100%;
		max-width: 28rem;
		height: auto;
		margin: 0 auto;
	}

	@media (max-width: 30rem) {
		.has-image .head {
			grid-template-columns: auto 1fr;
		}

		.ref {
			grid-column: 1 / -1;
			aspect-ratio: 2 / 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.words {
			transition: none;
		}
	}
</style>
