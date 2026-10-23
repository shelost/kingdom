<script lang="ts">
	import type { Person } from '$lib/people';
	import { lifespanParts } from '$lib/wiki';

	/** `note` spells out "best guess" beside the dates when either year is the story's choice. */
	let { person, note = false }: { person: Person; note?: boolean } = $props();

	let parts = $derived(lifespanParts(person));
	let guessed = $derived(!!parts && (parts.born.invented || parts.died.invented));
</script>

{#if parts}
	<span class="life"
		>{#if parts.approx}c.&nbsp;{/if}{#each [parts.born, parts.died] as half, i (i)}{#if i}&nbsp;–&nbsp;{/if}<span
				class:invented={half.invented}
				title={half.invented ? 'Best guess: not in the record, a year the story chose' : undefined}>{half.text}</span
			>{/each}{#if note && guessed}<span class="guess">best guess</span>{/if}</span
	>
{/if}

<style>
	.invented {
		color: var(--invented-year, #e2709e);
	}

	.guess {
		margin-left: 0.5em;
		font-size: 0.75em;
		font-style: italic;
		letter-spacing: 0.02em;
		color: var(--invented-year, #e2709e);
		opacity: 0.8;
	}
</style>
