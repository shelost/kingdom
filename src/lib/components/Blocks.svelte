<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId, colorOf, hangulInitial } from '$lib/people';
	import { reading, isKorean } from '$lib/reading.svelte';
	import Self from './Blocks.svelte';

	let { blocks, year = null }: { blocks: Block[]; year?: number | null } = $props();

	function visible(b: Block) {
		if (
			b.kind === 'flashback' ||
			b.kind === 'table' ||
			b.kind === 'hanja' ||
			b.kind === 'verse' ||
			b.kind === 'formation'
		)
			return true;
		// quotes always carry hanja / hangul / english together
		if (b.kind === 'quote') return true;
		if (reading.lang === 'both') return true;
		if (b.kind === 'dialogue')
			return reading.lang === 'en'
				? !!b.en?.length || !b.lines.some((l) => isKorean(l))
				: b.lines.some(Boolean);
		// narration: visible in EN always (source is English), in KO when a
		// translation exists or the source is already Korean
		return reading.lang === 'en' ? true : !!b.ko || isKorean(b.html);
	}

	/** The narration string to render for the current language. */
	function prose(b: { html: string; ko?: string }) {
		return reading.lang === 'ko' && b.ko ? b.ko : b.html;
	}

	let shown = $derived(blocks.filter(visible));
</script>

<div class="prose">
	{#each shown as block, i (i)}
		{#if block.kind === 'p'}
			<p>{@html linkPeople(prose(block), year)}</p>
		{:else if block.kind === 'cite'}
			<p class="cite">{@html linkPeople(prose(block), year)}</p>
		{:else if block.kind === 'dialogue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			<div
				class="dialogue"
				style:--chip={p ? colorOf(p) : block.chip}
				data-speaker={p?.id ?? undefined}
			>
				{#if p}
					<button
						type="button"
						class="face person"
						data-person={p.id}
						title={p.name}
						aria-label={p.name}
					>
						{#if p.avatar}
							<img src={p.avatar} alt="" />
						{:else}
							<span class="initial">{hangulInitial(p)}</span>
						{/if}
					</button>
				{:else}
					<span class="chip"></span>
				{/if}
				<div class="lines">
					{#if p}
						<span class="who">{p.name}</span>
					{:else if block.speaker}
						<span class="speaker">{block.speaker}</span>
					{/if}
					{#each { length: Math.max(block.lines.length, block.en?.length ?? 0) } as _, j (j)}
						{#if block.lines[j] && reading.lang !== 'en'}
							<span class="line ko">{@html block.lines[j]}</span>
						{/if}
						{#if block.en?.[j] && reading.lang !== 'ko'}
							<span class="line en" class:solo={!block.lines[j]}>{@html block.en[j]}</span>
						{/if}
					{/each}
				</div>
			</div>
		{:else if block.kind === 'verse'}
			<div class="verse" style:--vc={block.color}>
				{#each block.lines as line, j (j)}
					<span class="line">{line}</span>
				{/each}
			</div>
		{:else if block.kind === 'table'}
			<div class="table-scroll">
				<table>
					<thead>
						<tr>
							{#each block.head as h, j (j)}
								<th style:--hc={block.colors?.[j]}>{h}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each block.rows as row, j (j)}
							<tr>
								{#each row as cell, k (k)}
									<td>{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if block.kind === 'hanja'}
			<div class="hanja">
				{#each block.chars as c (c.char)}
					<div class="hanja-char">
						<span class="glyph">{c.char}</span>
						<span class="gloss">{c.gloss}</span>
					</div>
				{/each}
			</div>
			{#if block.after}
				<p class="hanja-after">{@html linkPeople(block.after, year)}</p>
			{/if}
		{:else if block.kind === 'quote'}
			<figure class="quote">
				{#if block.hanja}
					<p class="quote-hanja">{block.hanja}</p>
				{/if}
				{#if block.ko}
					<p class="quote-ko">{@html linkPeople(block.ko, year)}</p>
				{/if}
				<blockquote class="quote-en">{@html linkPeople(block.html, year)}</blockquote>
				<figcaption>{block.source}</figcaption>
			</figure>
		{:else if block.kind === 'moral'}
			<aside class="moral">
				<span class="moral-label">{block.label ?? 'the warning'}</span>
				<p>{@html linkPeople(prose(block), year)}</p>
			</aside>
		{:else if block.kind === 'formation'}
			<figure class="formation">
				{#if block.title}<figcaption class="fm-title">{block.title}</figcaption>{/if}
				<div class="fm-field">
					{#each block.sides as side, si (si)}
						<div class="fm-side" style:--s={side.color}>
							<span class="fm-name">{side.name}</span>
							<div class="fm-units">
								{#each side.units as u, ui (ui)}
									<span class="fm-unit">
										<b>{u.label}</b>
										{#if u.sub}<i>{u.sub}</i>{/if}
									</span>
								{/each}
							</div>
						</div>
						{#if si === 0}<span class="fm-vs" aria-hidden="true"></span>{/if}
					{/each}
				</div>
				{#if block.note}<p class="fm-note">{block.note}</p>{/if}
			</figure>
		{:else if block.kind === 'flashback'}
			<!-- mini-flashback: the page drops to black while this is under the reading line -->
			<aside class="mini" data-flash="1">
				<header class="mini-head">
					<span class="mini-mark" aria-hidden="true"></span>
					{#if block.year}<span class="mini-year">{block.year}</span>{/if}
					{#if block.title}<span class="mini-title">{block.title}</span>{/if}
				</header>
				<Self blocks={block.blocks} year={block.year ? Number(block.year) || year : year} />
			</aside>
		{/if}
	{/each}
</div>

<style>
	.prose {
		max-width: 46rem;
	}

	.prose p {
		margin: 0 0 0.4rem;
		color: var(--fg);
	}

	/* Attribution lines — a hairline tick instead of a bullet */
	.cite {
		position: relative;
		padding-left: 1.35rem;
		font-size: 0.92em;
		color: var(--fg-dim);
	}

	.cite::before {
		content: '';
		position: absolute;
		left: 0.35rem;
		top: 0.72em;
		width: 0.55rem;
		height: 1px;
		background: var(--fg-faint);
	}

	/* ————— dialogue ————— */
	.dialogue {
		display: grid;
		grid-template-columns: 1.75rem 1fr;
		gap: 0.6rem;
		margin: 0.9rem 0;
		transition:
			background 420ms var(--ease),
			box-shadow 420ms var(--ease),
			opacity 420ms var(--ease),
			padding 420ms var(--ease),
			margin 420ms var(--ease);
	}

	/* Immersive: chronicle lines stay; live line gets a soft featured pulse */
	:global(html.is-immersive) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.62;
	}

	:global(html.is-immersive) .dialogue:global(.is-speaking) {
		margin-left: -0.55rem;
		padding: 0.45rem 0.65rem 0.45rem 0.55rem;
		border-radius: 4px;
		background: color-mix(in srgb, var(--chip) 12%, rgba(255, 255, 255, 0.04));
		box-shadow: inset 2px 0 0 var(--chip);
		opacity: 1;
	}

	.chip {
		width: 0.85rem;
		height: 0.85rem;
		margin: 0.35rem 0 0 0.45rem;
		display: inline-block;
		border-radius: 3px;
		background: var(--chip);
		box-shadow: 0 0 14px -2px var(--chip);
	}

	/* profile picture (or initial) for an assigned speaker */
	.face {
		width: 1.75rem;
		height: 1.75rem;
		margin-top: 0.15rem;
		padding: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--chip) 55%, transparent);
		border-radius: 50%;
		background: color-mix(in srgb, var(--chip) 72%, #000);
		cursor: pointer;
		transition:
			transform 0.25s var(--ease),
			box-shadow 0.25s var(--ease);
	}

	.face:hover {
		transform: scale(1.1);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--chip) 25%, transparent);
	}

	.face img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.initial {
		font-family: var(--serif);
		font-size: 0.82rem;
		font-weight: 700;
		color: #fff;
	}

	.lines {
		display: flex;
		flex-direction: column;
		color: var(--fg-dim);
		min-width: 0;
	}

	.line.ko {
		color: var(--fg-dim);
	}

	/* the English rendering sits under its Korean line, quieter */
	.line.en {
		color: var(--fg-faint);
		font-size: 0.92em;
		font-style: italic;
		margin-bottom: 0.22rem;
	}

	/* no Korean above it — this *is* the line */
	.line.en.solo {
		color: var(--fg-dim);
		font-size: 1em;
		font-style: normal;
		margin-bottom: 0;
	}

	.who {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: color-mix(in srgb, var(--chip) 45%, #fff);
		margin-bottom: 0.1rem;
	}

	.speaker {
		font-size: 0.85em;
		opacity: 0.8;
	}

	/* Verse — a lit rule down the left edge */
	.verse {
		position: relative;
		margin: 1.15rem 0;
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-weight: 500;
		color: color-mix(in srgb, var(--vc) 58%, #fff);
	}

	.verse::before {
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

	.table-scroll {
		overflow-x: auto;
		margin: 1.2rem 0;
		border: 1px solid var(--hairline);
		border-radius: 8px;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.84rem;
	}

	th,
	td {
		border-right: 1px solid var(--hairline);
		padding: 0.4rem 0.9rem;
		text-align: center;
		white-space: nowrap;
	}

	th:last-child,
	td:last-child {
		border-right: none;
	}

	th {
		font-weight: 600;
		color: #fffdf8;
		letter-spacing: var(--tracking-micro);
		background: rgba(255, 255, 255, 0.05);
		border-bottom: 1px solid var(--hairline);
	}

	/* Column-tinted heads (the four Dragons, the four Beasts) */
	th[style*='--hc'] {
		background: color-mix(in srgb, var(--hc, transparent) 16%, transparent);
	}

	td {
		color: var(--fg-dim);
	}

	.hanja {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1.5rem 0 0.8rem;
	}

	.hanja-char {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.glyph {
		font-family: 'Noto Serif KR', serif;
		font-size: 3rem;
		font-weight: 900;
		line-height: 1;
		color: var(--gold);
	}

	.gloss {
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: var(--fg-dim);
	}

	.hanja-after {
		margin-top: 1.2rem;
	}

	/* ————— a genuine line from the record ————— */
	.quote {
		margin: 1.3rem 0;
		padding: 0 0 0 1rem;
		border-left: 2px solid var(--quote);
	}

	.quote-hanja {
		margin: 0 0 0.35rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.98em;
		letter-spacing: 0.14em;
		line-height: 1.55;
		color: color-mix(in srgb, var(--quote) 72%, var(--fg-faint));
	}

	.quote-ko {
		margin: 0 0 0.35rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1em;
		line-height: 1.62;
		color: color-mix(in srgb, var(--quote) 88%, #fff);
	}

	.quote-en,
	.quote blockquote {
		margin: 0;
		font-size: 0.98em;
		font-style: italic;
		line-height: 1.62;
		color: color-mix(in srgb, var(--quote) 70%, var(--fg-dim));
	}

	.quote figcaption {
		margin-top: 0.45rem;
		font-size: 0.68rem;
		letter-spacing: var(--tracking-micro);
		line-height: 1.45;
		max-width: 42rem;
		color: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
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
		line-height: 1.6;
		color: color-mix(in srgb, var(--fg) 78%, var(--fg-faint));
	}

	/* ————— battle formation ————— */
	.formation {
		margin: 1.4rem 0;
		padding: 0.9rem 1rem 0.8rem;
		border: 1px solid var(--hairline);
		border-radius: 8px;
	}

	.fm-title {
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
		margin-bottom: 0.7rem;
	}

	.fm-field {
		display: flex;
		align-items: stretch;
		gap: 0.9rem;
	}

	.fm-side {
		flex: 1;
		min-width: 0;
	}

	.fm-name {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: var(--s);
		margin-bottom: 0.45rem;
	}

	.fm-units {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.fm-unit {
		display: flex;
		flex-direction: column;
		padding: 0.32rem 0.55rem;
		border: 1px solid color-mix(in srgb, var(--s) 40%, transparent);
		border-left: 3px solid var(--s);
		border-radius: 4px;
		background: color-mix(in srgb, var(--s) 9%, transparent);
	}

	.fm-unit b {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--fg);
	}

	.fm-unit i {
		font-size: 0.68rem;
		font-style: normal;
		color: var(--fg-faint);
	}

	/* the line where the two sides meet */
	.fm-vs {
		width: 1px;
		background: var(--hairline);
		flex-shrink: 0;
	}

	.fm-note {
		margin: 0.7rem 0 0;
		font-size: 0.74rem;
		line-height: 1.55;
		color: var(--fg-faint);
	}

	/* ————— inline mini-flashback ————— */
	.mini {
		position: relative;
		margin: 2rem 0 2.2rem;
		padding: 1.1rem 0 1.1rem 1.6rem;
		border-left: 1px solid rgba(216, 178, 106, 0.28);
	}

	.mini::before,
	.mini::after {
		content: '';
		position: absolute;
		left: -1px;
		width: 1px;
		height: 1.6rem;
		background: var(--gold);
	}

	.mini::before {
		top: 0;
	}

	.mini::after {
		bottom: 0;
		background: var(--gold);
	}

	.mini-head {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 0.7rem;
	}

	.mini-mark {
		width: 0.75rem;
		height: 1px;
		background: var(--gold);
		align-self: center;
	}

	.mini-year {
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--gold);
		letter-spacing: 0;
	}

	.mini-title {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.mini :global(.prose) {
		max-width: none;
	}

	/* ————— person triggers ————— */
	.prose :global(.person) {
		font: inherit;
		font-weight: 500;
		color: #fffdfa;
		background: rgba(255, 255, 255, .1);
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: 3px;
		transition:
			color 0.2s var(--ease),
			background 0.2s var(--ease),
			text-decoration-color 0.2s var(--ease);
	}

	.prose :global(.person:hover) {
		color: var(--gold);
		background: rgba(216, 178, 106, 0.1);
		text-decoration-color: var(--gold);
		box-shadow: 0 0 0 3px rgba(216, 178, 106, 0.1);
	}

	/* the avatar is also a person trigger, but must not take the text styling */
	.prose :global(.face.person) {
		text-decoration: none;
		box-shadow: none;
		background: color-mix(in srgb, var(--chip) 72%, #000);
	}

	.prose :global(.person:focus-visible) {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}
</style>
