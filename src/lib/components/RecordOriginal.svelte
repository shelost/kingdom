<script lang="ts">
	let {
		text,
		inked = true,
		columns = false,
		perColumn = 12,
		lang = 'zh-Hant'
	}: {
		text: string;
		/** False until the card scrolls in; characters ink in one by one when it turns true. */
		inked?: boolean;
		/** Woodblock layout: vertical columns read right to left. */
		columns?: boolean;
		/** Characters per column. */
		perColumn?: number;
		lang?: string;
	} = $props();

	let glyphs = $derived([...text.replace(/\s+/g, '')]);
</script>

<p class="original" class:columns class:inked style:--col={perColumn} {lang} aria-label={text}>
	{#each glyphs as g, i (i)}<span style:--i={i} aria-hidden="true">{g}</span>{/each}
</p>

<style>
	.original {
		--track: 0.06em;
		margin: 0;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1rem;
		line-height: 1.6;
		letter-spacing: 0.14em;
		color: var(--glyph, color-mix(in srgb, var(--quote) 80%, var(--fg-strong)));
	}

	/* Columns sit close, the way a block cutter packs them. */
	.columns {
		writing-mode: vertical-rl;
		max-height: calc(var(--col) * (1em + var(--track)));
		font-size: 1.12rem;
		line-height: 1.28;
		letter-spacing: var(--track);
		padding-right: 1.1rem;
		border-right: 1px solid var(--rule, color-mix(in srgb, var(--quote) 25%, transparent));
	}

	/* Stone cards rule a cell round each character and cut it in. */
	span {
		box-shadow: var(--cell, none);
		text-shadow: var(--carve, none);
		transition:
			opacity 420ms var(--ease),
			filter 420ms var(--ease);
		transition-delay: calc(min(var(--i), 60) * 26ms);
	}

	.original:not(.inked) span {
		opacity: 0;
		filter: blur(2px);
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
	}

	@media (max-width: 560px) {
		.columns {
			justify-self: end;
			padding-right: 0;
			border-right: none;
		}
	}
</style>
