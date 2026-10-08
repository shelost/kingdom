<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import { onceInView } from '$lib/inView';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';
	import RecordOriginal from './RecordOriginal.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';

	type Oath = Extract<Block, { kind: 'oath' }>;

	let { block, year = null }: { block: Oath; year?: number | null } = $props();

	/** A back with more than this many characters is not carved on the stone's reverse, only translated. */
	const BACK_CARVE_MAX = 60;

	let length = $derived([...block.hanja.replace(/\s+/g, '')].length);
	let perColumn = $derived(Math.min(16, Math.max(8, Math.ceil(Math.sqrt(length * 2.4)))));
	let cols = $derived(Math.max(1, Math.ceil(length / perColumn)));
	let backCarve = $derived.by(() => {
		const t = (block.back?.ko ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');
		return t && [...t].length <= BACK_CARVE_MAX ? t : '';
	});
	let flipped = $state(false);
	let inked = $state(false);

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.3 });
</script>

{#snippet faces()}
	<span class="face front">
		<Material kind="stone" />
		<RecordOriginal text={block.hanja} {inked} columns {perColumn} />
	</span>
	<span class="face back" aria-hidden="true">
		<Material kind="stone" />
		{#if backCarve}
			<span class="back-carve" lang="ko">{backCarve}</span>
		{:else}
			<span class="back-mark" lang="zh-Hant">裏</span>
		{/if}
	</span>
{/snippet}

<figure class="oath" class:inked {@attach ink}>
	<div class="stage" style:--rows={perColumn} style:--cols={cols}>
		{#if block.back}
			<button
				type="button"
				class="stone"
				class:flipped
				aria-pressed={flipped}
				aria-label={flipped ? 'Turn the stone back to its face' : 'Turn the stone over'}
				onclick={() => (flipped = !flipped)}
			>
				{@render faces()}
			</button>
			<span class="hint" aria-hidden="true">{reading.lang === 'ko' ? '눌러서 뒤집기' : 'tap to turn over'}</span>
		{:else}
			<div class="stone" role="img" aria-label={block.hanja}>
				{@render faces()}
			</div>
		{/if}
	</div>
	<div class="panel" aria-live="polite">
		{#if !flipped}
			<div class="side">
				<span class="side-label">{reading.lang === 'ko' ? '앞면' : 'Face'}</span>
				{#if block.ko}<p class="ko" lang="ko">{@html supMarks(linkPeople(block.ko, year), block.notes)}</p>{/if}
				<blockquote class="en">{@html supMarks(linkPeople(block.html, year), block.notes)}</blockquote>
				<RecordNotes notes={block.notes} {year} />
			</div>
		{:else if block.back}
			<div class="side">
				<span class="side-label">{reading.lang === 'ko' ? '뒷면' : 'Back'}</span>
				{#if block.back.ko}<p class="ko" lang="ko">{@html linkPeople(block.back.ko, year)}</p>{/if}
				<blockquote class="en">{@html linkPeople(block.back.html, year)}</blockquote>
			</div>
		{/if}
		<RecordCite source={block.source} {inked} delay={Math.min(length, 60) * 26 + 200} />
	</div>
</figure>

<style>
	.oath {
		--text-cite: color-mix(in srgb, var(--quote) 70%, var(--fg-strong));
		--text-faint: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 1.2rem 1.8rem;
		margin: var(--widget-gap) 0;
	}

	.stage {
		position: relative;
		isolation: isolate;
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		perspective: 900px;
		font-size: 0.95rem;
	}

	/* A river pebble, longer than it is wide, characters cut into its face. */
	.stone {
		--w: calc(var(--cols) * 1.32em + 2.6em);
		--h: calc(var(--rows) * 1.06em + 3.4em);
		position: relative;
		width: var(--w);
		height: var(--h);
		padding: 0;
		font: inherit;
		background: none;
		border: none;
		border-radius: 46% 54% 44% 56% / 24% 26% 74% 76%;
		transform-style: preserve-3d;
		transition: transform 800ms cubic-bezier(0.34, 1.3, 0.5, 1);
	}

	button.stone {
		cursor: pointer;
	}

	.stone.flipped {
		transform: rotateY(180deg);
	}

	button.stone:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 6px;
	}

	.face {
		--glyph: #2c2a26;
		--rule: transparent;
		--carve: 0 1px 0 rgb(255 255 255 / 0.35), 0 -1px 0 rgb(0 0 0 / 0.35);
		position: absolute;
		inset: 0;
		isolation: isolate;
		display: grid;
		place-items: center;
		border-radius: inherit;
		backface-visibility: hidden;
		background:
			radial-gradient(70% 50% at 35% 28%, rgb(255 255 255 / 0.22), transparent 70%),
			radial-gradient(90% 60% at 70% 90%, rgb(0 0 0 / 0.22), transparent 70%),
			linear-gradient(160deg, #a49a8a, #847b6d 55%, #6c6458);
		box-shadow: 0 10px 28px -14px rgb(0 0 0 / 0.45);
	}

	.face > :global(.material)::before {
		display: none;
	}

	.back {
		transform: rotateY(180deg);
		background:
			radial-gradient(70% 50% at 65% 28%, rgb(255 255 255 / 0.18), transparent 70%),
			radial-gradient(90% 60% at 30% 90%, rgb(0 0 0 / 0.25), transparent 70%),
			linear-gradient(200deg, #9b9182, #7c7366 55%, #645d52);
	}

	.face :global(.original.columns) {
		padding-right: 0;
		border-right: none;
		font-size: 1em;
		font-weight: 700;
	}

	.back-carve {
		max-height: calc(var(--h) - 3.4em);
		writing-mode: vertical-rl;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.86em;
		font-weight: 700;
		line-height: 1.3;
		letter-spacing: 0.08em;
		color: var(--glyph);
		text-shadow: var(--carve);
	}

	.back-mark {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 2.6em;
		font-weight: 900;
		color: rgb(44 42 38 / 0.25);
		text-shadow: var(--carve);
	}

	:global(html:not([data-theme='light'])) .face {
		filter: brightness(0.86);
	}

	.hint {
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.panel {
		display: grid;
		gap: 0.6rem;
		min-width: 0;
	}

	.side {
		display: grid;
		gap: 0.4rem;
		animation: side-in 420ms var(--ease) both;
	}

	@keyframes side-in {
		from {
			opacity: 0;
			transform: translateY(0.3rem);
		}
	}

	.side-label {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-faint);
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: color-mix(in srgb, var(--quote) 88%, var(--fg-strong));
	}

	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
		color: color-mix(in srgb, var(--quote) 70%, var(--fg-dim));
	}

	@media (prefers-reduced-motion: reduce) {
		.stone {
			transition: none;
		}

		.side {
			animation: none;
		}
	}

	@media (max-width: 560px) {
		.oath {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
