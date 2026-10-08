<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId, type Person } from '$lib/people';
	import { recordBook, type RecordSeal as Seal } from '$lib/recordBooks';
	import { onceInView } from '$lib/inView';
	import RecordSeal from './RecordSeal.svelte';
	import RecordOriginal from './RecordOriginal.svelte';
	import RecordNotes, { supMarks } from './RecordNotes.svelte';
	import Avatar from './Avatar.svelte';
	import Material from './Material.svelte';

	type Quote = Extract<Block, { kind: 'quote' }>;

	let {
		block,
		year = null,
		side = 'left'
	}: {
		block: Quote;
		year?: number | null;
		/** Which side of the exchange: the two correspondents answer each other across the page. */
		side?: 'left' | 'right';
	} = $props();

	/** A letter longer than this is written across, not down. */
	const COLUMN_MAX = 140;
	const COLUMN_LEN = 14;

	let book = $derived(recordBook(block.source));
	let from = $derived(block.person ? byId.get(block.person) : undefined);
	let to = $derived(block.to ? byId.get(block.to) : undefined);
	let length = $derived([...(block.hanja ?? '').replace(/\s+/g, '')].length);
	let columns = $derived(length > 0 && length <= COLUMN_MAX);
	/** The sender signs with a name seal (薛仁貴印); without a hanja name, the book's own seal stands in. */
	let seal = $derived.by((): Seal | null => {
		const base = book.seal;
		const name = from?.hanja?.replace(/\s+/g, '');
		if (name && name.length <= 3) {
			return {
				text: name + '印',
				shape: 'square',
				color: base?.color ?? '#b8302a',
				cut: 'intaglio',
				tilt: side === 'left' ? -4 : 3
			};
		}
		return base;
	});
	let inked = $state(false);

	const ink = onceInView(() => {
		inked = true;
	}, { threshold: 0.2 });
</script>

{#snippet party(p: Person | undefined, label: string | undefined)}
	{#if p}
		<span class="party"><Avatar person={p} {year} size="1.75rem" label /></span>
	{:else if label}
		<span class="party"><span class="party-name">{label}</span></span>
	{/if}
{/snippet}

<figure class="letter {side}" class:inked {@attach ink}>
	<header class="route">
		{@render party(from, block.person)}
		<svg class="arrow" viewBox="0 0 28 10" aria-hidden="true">
			<path d="M0 5h25M20 1l5 4l-5 4" fill="none" stroke="currentColor" stroke-width="1.2" />
		</svg>
		{@render party(to, block.to)}
	</header>
	<div class="sheet" class:columns>
		<Material kind="paper" />
		{#if block.hanja}
			<RecordOriginal text={block.hanja} {inked} {columns} perColumn={COLUMN_LEN} />
		{/if}
		<div class="body">
			{#if block.ko}
				<p class="ko" lang="ko">{@html supMarks(linkPeople(block.ko, year), block.notes)}</p>
			{/if}
			<p class="en">{@html supMarks(linkPeople(block.html, year), block.notes)}</p>
			<RecordNotes notes={block.notes} {year} />
		</div>
		{#if seal}
			<span class="stamp">
				<RecordSeal {seal} {inked} delay={Math.min(length, 60) * 22 + 420} />
			</span>
		{/if}
	</div>
	<figcaption class="source">
		{book.name}{#if book.ko}<span lang="ko"> {book.ko}</span>{/if}{#if book.detail}<span class="detail"> · {book.detail}</span>{/if}
	</figcaption>
</figure>

<style>
	.letter {
		--paper: #f4ecdb;
		--paper-edge: #d8ccb2;
		--letter-ink: #2c2620;
		--letter-cite: #7c2a20;
		--crease: rgb(0 0 0 / 0.05);
		--crease-lit: rgb(255 255 255 / 0.35);
		--glyph: var(--letter-ink);
		--rule: color-mix(in srgb, var(--letter-ink) 20%, transparent);
		width: min(100%, 40rem);
		margin: var(--widget-gap) 0;
	}

	:global(html:not([data-theme='light'])) .letter {
		--paper: #211d17;
		--paper-edge: #3b352c;
		--letter-ink: #ece4d3;
		--letter-cite: #ec8a76;
		--crease: rgb(0 0 0 / 0.3);
		--crease-lit: rgb(255 255 255 / 0.05);
	}

	.letter.right {
		margin-left: auto;
	}

	.route {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.45rem;
		color: var(--fg-faint);
	}

	.right .route {
		justify-content: flex-end;
	}

	.arrow {
		width: 1.6rem;
		flex-shrink: 0;
	}

	.party {
		display: inline-flex;
		align-items: center;
	}

	.party-name {
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	/* A folded sheet: two creases across, a little deckle in the shadow. */
	.sheet {
		--text-faint: color-mix(in srgb, var(--letter-ink) 66%, transparent);
		--text-cite: var(--letter-cite);
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 0.9rem 1.3rem;
		padding: 1.2rem 1.3rem 1.4rem;
		color: var(--letter-ink);
		background:
			linear-gradient(
				to bottom,
				transparent 0 33%,
				var(--crease) 33.2%,
				var(--crease-lit) 33.6%,
				transparent 34.5% 66%,
				var(--crease) 66.2%,
				var(--crease-lit) 66.6%,
				transparent 67.5%
			),
			var(--paper);
		border: 1px solid var(--paper-edge);
		border-radius: var(--widget-radius);
		transform-origin: top center;
		transition:
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 400ms var(--ease);
	}

	.sheet.columns {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: start;
	}

	/* The two hands answer each other: the reply's original stands on the far side. */
	.right .sheet.columns {
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.right .sheet.columns :global(.original) {
		order: 2;
		padding-right: 0;
		padding-left: 1.1rem;
		border-right: none;
		border-left: 1px solid var(--rule);
	}

	.letter:not(.inked) .sheet {
		opacity: 0;
		transform: perspective(900px) rotateX(-62deg) scaleY(0.55);
	}

	.body {
		display: grid;
		gap: 0.5rem;
		min-width: 0;
	}

	.ko,
	.en {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
		margin: 0;
	}

	.ko {
		font: var(--chronicle-font);
		letter-spacing: var(--tracking-body);
	}

	.en {
		font-family: var(--serif);
		font-size: 0.96rem;
		font-style: italic;
		opacity: 0.82;
	}

	.stamp {
		position: absolute;
		right: 1rem;
		bottom: -0.7rem;
	}

	.right .stamp {
		right: auto;
		left: 1rem;
	}

	.source {
		margin-top: 0.95rem;
		font-size: 0.66rem;
		line-height: 1.45;
		color: var(--fg-faint);
	}

	.right .source {
		text-align: right;
	}

	.detail {
		opacity: 0.8;
	}

	@media (prefers-reduced-motion: reduce) {
		.sheet {
			transition: none;
		}

		.letter:not(.inked) .sheet {
			opacity: 1;
			transform: none;
		}
	}

	@media (max-width: 560px) {
		.sheet.columns,
		.right .sheet.columns {
			grid-template-columns: minmax(0, 1fr);
		}

		.right .sheet.columns :global(.original) {
			order: 0;
			padding-left: 0;
			border-left: none;
		}
	}
</style>
