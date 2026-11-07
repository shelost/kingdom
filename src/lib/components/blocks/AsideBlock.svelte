<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { Block } from '$lib/story';
	import { byId, colorOf, linkPeople, nameOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';

	/** Caption asides beside the narration: what the story leaves behind, and the interior spoken from later. */
	let {
		block,
		year,
		arrive
	}: {
		block: Extract<Block, { kind: 'moral' | 'monologue' }>;
		year: number | null;
		arrive?: Attachment<HTMLElement>;
	} = $props();

	let html = $derived(linkPeople(reading.lang === 'ko' && block.ko ? block.ko : block.html, year));
</script>

{#if block.kind === 'moral'}
	<aside class="moral">
		<span class="moral-label">{block.label ?? 'the warning'}</span>
		<p>{@html html}</p>
	</aside>
{:else}
	{@const p = block.person ? byId.get(block.person) : undefined}
	<aside
		class="monologue"
		style:--chip={p ? colorOf(p) : 'var(--fg-dim)'}
		data-speaker={p?.id ?? undefined}
		data-look={block.look ?? undefined}
		{@attach arrive}
	>
		{#if p}<span class="mono-label">{nameOf(p, year, block.look)}</span>{/if}
		<p>{@html html}</p>
	</aside>
{/if}

<style lang="scss">
	:global(html.is-cinema) .moral,
	:global(html.is-cinema) .monologue {
		border-left: 3px solid color-mix(in srgb, var(--gold) 45%, transparent);
		padding-left: 0.9rem;
		background: color-mix(in srgb, var(--plate-ink) 34%, transparent);
	}

	/* ————— what the story leaves behind ————— */

	.moral {
		margin: 1.5rem 0 0.4rem;
		padding: 0.85rem 0 0;
		border-top: 1px solid color-mix(in srgb, var(--fg-faint) 30%, transparent);
	}

	.moral-label {
		display: block;
		margin-bottom: 0.4rem;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide, 0.14em);
		color: var(--fg-faint);
	}

	.moral p {
		margin: 0;
		font-size: 0.98em;
		font-style: italic;
		line-height: 1.48;
		color: color-mix(in srgb, var(--fg) 78%, var(--fg-faint));
	}

	/* ————— retrospective interior (spoken from later) ————— */

	.monologue {
		position: relative;
		margin: 1.55rem 0 1.4rem;
		padding: 0.85rem 0 0.85rem 1.05rem;
		border-left: 2px solid color-mix(in srgb, var(--chip) 55%, transparent);
	}

	.mono-label {
		display: block;
		margin-bottom: 0.35rem;
		font-size: 0.62rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--chip) 55%, var(--fg-faint));
	}

	.monologue p {
		margin: 0;
		font-family: var(--sans);
		font-size: 1.02em;
		font-style: italic;
		font-weight: 500;
		line-height: 1.5;
		letter-spacing: var(--tracking-body);
		color: color-mix(in srgb, var(--chip) 28%, var(--fg-strong));
	}
</style>
