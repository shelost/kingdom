<script lang="ts">
	import { recordBook, nationLabel } from '$lib/recordBooks';
	import RecordSeal from './RecordSeal.svelte';

	/**
	 * The citation under a record: the book's seal stamped beside its title,
	 * chapter, and who kept it. `compact` keeps only the seal and the title,
	 * for tags and table heads.
	 */
	let {
		source,
		inked = true,
		delay = 0,
		compact = false,
		nation = false
	}: {
		source: string;
		/** False until the card scrolls in; the seal lands when it turns true. */
		inked?: boolean;
		/** Milliseconds before the seal lands. */
		delay?: number;
		compact?: boolean;
		/** Compact form: add "Korean record" / "Chinese record" under the title. */
		nation?: boolean;
	} = $props();

	let book = $derived(recordBook(source));
</script>

<span class="record-cite" class:compact title={compact ? source : undefined}>
	{#if book.seal}
		<RecordSeal seal={book.seal} {inked} {delay} />
	{/if}
	<span class="cite">
		<span class="book">
			{book.name}{#if book.ko}<span class="book-ko" lang="ko">{book.ko}</span>{/if}
		</span>
		{#if compact}
			{#if nation && book.nation}<span class="origin" data-nation={book.nation}>{nationLabel(book.nation)}</span>{/if}
		{:else}
			{#if book.detail}<span class="detail">{book.detail}</span>{/if}
			{#if book.origin}
				<span class="origin" data-nation={book.nation}>{nationLabel(book.nation)} · {book.origin}</span>
			{/if}
		{/if}
	</span>
</span>

<style>
	.record-cite {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.compact {
		gap: 0.45rem;
	}

	.compact :global(.seal) {
		font-size: 0.66rem;
	}

	.cite {
		display: grid;
		gap: 0.1rem;
		min-width: 0;
	}

	.book {
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--text-cite, color-mix(in srgb, var(--quote) 70%, var(--fg-strong)));
	}

	.compact .book {
		font-size: 0.68rem;
	}

	.book-ko {
		margin-left: 0.45rem;
		font-weight: 500;
		opacity: 0.72;
	}

	.detail,
	.origin {
		font-size: 0.66rem;
		line-height: 1.45;
		color: var(--text-faint, color-mix(in srgb, var(--quote) 45%, var(--fg-faint)));
	}

	.origin {
		font-style: italic;
	}

	.compact .origin {
		font-size: 0.6rem;
	}
</style>
