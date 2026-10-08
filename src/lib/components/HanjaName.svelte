<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import BrushGlyphs from './BrushGlyphs.svelte';
	import Material from './Material.svelte';

	type Hanja = Extract<Block, { kind: 'hanja' }>;

	let { block }: { block: Hanja } = $props();

	/** Which character the brush is on; -1 until the plate scrolls in. */
	let turn = $state(-1);
	let written = $state<boolean[]>([]);

	let note = $derived(reading.lang === 'ko' ? (block.noteKo ?? block.note) : block.note);
	let noteSub = $derived(reading.lang === 'both' ? block.noteKo : undefined);

	const start = onceInView(() => {
		turn = 0;
	});

	function finished(i: number) {
		written[i] = true;
		turn = i + 1;
	}
</script>

<figure class="hanja-name ink-plate" {@attach start}>
	<Material kind="paper" />
	<span class="plate-tab">{reading.lang === 'en' ? 'Name' : '이름 · Name'}</span>
	<div class="chars">
		{#each block.chars as c, i (i)}
			<div class="cell" class:done={written[i]}>
				<BrushGlyphs
					text={c.char}
					size="clamp(5rem, 16vw, 6.75rem)"
					grid
					play={turn >= i}
					ondone={() => finished(i)}
				/>
				<span class="gloss" lang="ko">{c.gloss}</span>
				{#if c.meaning && reading.lang !== 'ko'}<span class="meaning">{c.meaning}</span>{/if}
			</div>
		{/each}
	</div>
	{#if block.name || note}
		<figcaption>
			{#if block.name}
				<span class="name">{block.name}</span>
				{#if block.ko}<span class="name-ko" lang="ko">{block.ko}</span>{/if}
			{/if}
			{#if note}<span class="note">{note}</span>{/if}
			{#if noteSub && noteSub !== note}<span class="note sub" lang="ko">{noteSub}</span>{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.hanja-name {
		isolation: isolate;
		padding-top: 1.4rem;
	}

	.chars {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.1rem 0.9rem;
	}

	.cell {
		display: grid;
		justify-items: center;
		gap: 0.3rem;
		max-width: 8rem;
	}

	.gloss,
	.meaning {
		opacity: 0;
		transform: translateY(0.35rem);
		transition:
			opacity 300ms var(--ease),
			transform 300ms var(--ease);
	}

	.done .gloss,
	.done .meaning {
		opacity: 1;
		transform: none;
	}

	.done .meaning {
		transition-delay: 45ms;
	}

	.gloss {
		margin-top: 0.3rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--sumi);
	}

	.meaning {
		font-size: 0.78rem;
		font-style: italic;
		text-align: center;
		color: var(--sumi-dim);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.6rem;
		margin-top: 1rem;
		padding-top: 0.7rem;
		border-top: 1px solid color-mix(in srgb, var(--sumi) 14%, transparent);
	}

	.name {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--sumi);
	}

	.name-ko {
		font-size: 0.85rem;
		color: var(--vermilion);
	}

	.note {
		flex-basis: 100%;
		font-size: 0.95rem;
		color: var(--sumi-dim);
	}

	.note.sub {
		font-size: 0.875rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.gloss,
		.meaning {
			transition: none;
		}
	}
</style>
