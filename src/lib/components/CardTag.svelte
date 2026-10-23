<script lang="ts" module>
	import type { TieKind } from '$lib/people';

	export type CardTagIcon = TieKind | 'historical' | 'myth' | 'reality';

	/** Filled Material Symbols glyph per tag. */
	const GLYPHS: Record<CardTagIcon, string> = {
		romance: 'favorite',
		liege: 'crown',
		parent: 'family_restroom',
		sibling: 'group',
		spouse: 'join_inner',
		family: 'home',
		friend: 'handshake',
		rival: 'swords',
		enemy: 'skull',
		mentor: 'menu_book',
		ally: 'shield',
		historical: 'hourglass',
		myth: 'auto_awesome',
		reality: 'visibility'
	};
</script>

<script lang="ts">
	/**
	 * One round tag in the row hanging off a card's top-left corner: what a bond
	 * is (heart, crown, parent and child…) or that a group never met. Ties that
	 * hold at once share one capsule, one coloured segment each; a bond that
	 * turns gets one tag per stage (the row lives in the page, `.card-tags`).
	 * With `text` the last segment carries a word; `glass` tints the capsule over
	 * a blurred backdrop instead of filling it.
	 */
	let {
		icons,
		colors,
		label,
		text,
		glass = false
	}: {
		icons: CardTagIcon[];
		/** Each segment's fill, a plain hex, index for index with `icons`. */
		colors: string[];
		/** What the tag means, in the reader's language (tooltip + screen readers). */
		label: string;
		/** A short visible word after the last glyph. */
		text?: string;
		glass?: boolean;
	} = $props();
</script>

<span class="card-tag" class:glass role="img" aria-label={label} title={label}>
	{#each icons as icon, i (icon)}
		<span class="segment" class:worded={text && i === icons.length - 1} style:--tag={colors[i] ?? '#b3261e'}>
			<span class="material-symbols-outlined" aria-hidden="true">{GLYPHS[icon]}</span>
			{#if text && i === icons.length - 1}<span class="word" aria-hidden="true">{text}</span>{/if}
		</span>
	{/each}
</span>

<style>
	.card-tag {
		display: inline-flex;
		height: 2.1rem;
		border-radius: 999px;
		overflow: hidden;
		box-shadow:
			0 0 0 2px var(--bg, #15120e),
			0 4px 10px -4px rgb(0 0 0 / 0.6);
		pointer-events: auto;
	}

	.segment {
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 100%;
		background: var(--tag);
	}

	/* Joined segments sit tight, so two ties read as one tag. */
	.segment + .segment {
		width: 1.75rem;
		padding-right: 0.2rem;
	}

	.segment.worded {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		width: auto;
		padding: 0 0.85rem 0 0.6rem;
	}

	.word {
		color: #fffaf0;
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.glass {
		background: rgb(20 18 24 / 0.28);
		backdrop-filter: blur(14px) saturate(1.4);
		-webkit-backdrop-filter: blur(14px) saturate(1.4);
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.28),
			inset 0 1px 0 rgb(255 255 255 / 0.35),
			0 8px 22px -8px rgb(0 0 0 / 0.65);
	}

	.glass .segment {
		background: color-mix(in srgb, var(--tag) 42%, transparent);
	}

	.material-symbols-outlined {
		font-size: 1.2rem;
		color: #fffaf0;
		font-variation-settings:
			'FILL' 1,
			'wght' 500,
			'GRAD' 0,
			'opsz' 24;
	}
</style>
