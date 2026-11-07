<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';

	let { block, arrive }: { block: Extract<Block, { kind: 'verse' }>; arrive: Attachment<HTMLElement> } = $props();
</script>

{#if block.person}
	<div class="verse dirge" style:--vc={block.color} {@attach arrive}>
		<span class="dirge-kicker">{reading.lang === 'en' ? 'The spirits sing' : reading.lang === 'ko' ? '혼백들의 노래' : '혼백들의 노래 · The spirits sing'}</span>
		<span class="dirge-title">
			{#if reading.lang !== 'en'}<span lang="ko">{block.titleKo ?? '상엿소리'}</span>{/if}
			{#if reading.lang !== 'ko'}<span>{block.title ?? 'The spirits’ bier song'}</span>{/if}
		</span>
		{#each block.lines as line, j (j)}
			{@const chorus = block.refrain?.includes(j)}
			{@const en = block.en?.[j]}
			<span class="dirge-line" class:chorus style:--j={j}>
				{#if reading.lang === 'ko' || !en}
					<span lang="ko">{line}</span>
				{:else}
					<span>{en}</span>
					{#if reading.lang === 'both'}<span class="sub" lang="ko">{line}</span>{/if}
				{/if}
			</span>
		{/each}
	</div>
{:else}
	<div class="verse" style:--vc={block.color} {@attach arrive}>
		{#each block.lines as line, j (j)}
			<span class="line">{line}</span>
			{#if reading.lang !== 'ko' && block.en?.[j]}
				<span class="line en sub">{block.en[j]}</span>
			{/if}
		{/each}
	</div>
{/if}

<style lang="scss">
	/* Verse — a lit rule down the left edge */

	.verse {
		position: relative;
		margin: 1.15rem 0;
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-weight: 500;
		color: color-mix(in srgb, var(--vc) 58%, var(--fg-strong));
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0.25rem;
			bottom: 0.25rem;
			width: 2px;
			border-radius: 2px;
			background: var(--vc);
			box-shadow: 0 0 16px -1px var(--vc);
		}
	}

	/* The same language layers as a spoken line: the gloss a step smaller beneath. */

	.line {
		font-weight: calc(var(--weight-body) + 100);
		color: var(--fg-dim);
		&.sub {
			font-size: 0.88em;
			font-style: italic;
			opacity: 0.62;
			margin-bottom: 0.22rem;
		}
	}

	:global(html.is-cinema) .line.sub {
		font-size: 0.86em;
	}

	/* Dirge — the spirits' bier song: a lead singer's couplets, the chorus answering in the reaper's colour */

	.dirge {
		margin: 2rem auto;
		padding: 1.4rem 1.4rem 1.5rem;
		max-width: 30rem;
		align-items: center;
		text-align: center;
		gap: 0.1rem;
		border-top: 1px solid var(--fg-strong);
		border-bottom: 1px solid var(--fg-strong);
		color: var(--fg-strong);
		font-weight: var(--weight-body);
		&::before {
			display: none;
		}
	}

	.dirge-kicker {
		font-size: 0.7em;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.dirge-title {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
		margin: 0.2rem 0 0.9rem;
		font-size: 1.15em;
		font-weight: 700;
		line-height: 1.3;
	}

	.dirge-line {
		display: flex;
		flex-direction: column;
		line-height: 1.6;
		& .sub {
			font-size: 0.85em;
			color: var(--fg-dim);
		}
		&.chorus {
			margin: 0.3rem 0 0.7rem;
			font-size: 0.85em;
			letter-spacing: 0.08em;
			color: var(--fg-dim);
		}
	}
</style>
