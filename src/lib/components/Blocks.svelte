<script lang="ts">
	import type { Block } from '$lib/story';
	import { linkPeople, byId, colorOf } from '$lib/people';
	import { reading, isKorean } from '$lib/reading.svelte';
	import Self from './Blocks.svelte';

	let { blocks, year = null }: { blocks: Block[]; year?: number | null } = $props();

	/** Korean-bearing blocks vs English narration, for the language toggle. */
	function langOf(b: Block): 'ko' | 'en' {
		if (b.kind === 'dialogue' || b.kind === 'verse') return 'ko';
		if (b.kind === 'hanja') return 'ko';
		if (b.kind === 'p' || b.kind === 'cite') return isKorean(b.html) ? 'ko' : 'en';
		return 'en'; // tables and flashback wrappers always show
	}

	function visible(b: Block) {
		if (b.kind === 'flashback' || b.kind === 'table') return true;
		if (reading.lang === 'both') return true;
		// translated dialogue belongs in the English view too
		if (b.kind === 'dialogue' && reading.lang === 'en') return !!b.en?.length;
		if (b.kind === 'dialogue' && reading.lang === 'ko') return b.lines.length > 0;
		return langOf(b) === reading.lang;
	}

	let shown = $derived(blocks.filter(visible));
</script>

<div class="prose">
	{#each shown as block, i (i)}
		{#if block.kind === 'p'}
			<p>{@html linkPeople(block.html, year)}</p>
		{:else if block.kind === 'cite'}
			<p class="cite">{@html linkPeople(block.html, year)}</p>
		{:else if block.kind === 'dialogue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			<div class="dialogue" style:--chip={p ? colorOf(p) : block.chip}>
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
							<span class="initial">{p.name.slice(0, 1)}</span>
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
		background: linear-gradient(150deg, var(--chip), color-mix(in srgb, var(--chip) 40%, #000));
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
		background: linear-gradient(180deg, #fffdf8, var(--gold));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
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
		background: linear-gradient(var(--gold), transparent);
	}

	.mini::before {
		top: 0;
	}

	.mini::after {
		bottom: 0;
		background: linear-gradient(transparent, var(--gold));
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
		background: linear-gradient(150deg, var(--chip), color-mix(in srgb, var(--chip) 40%, #000));
	}

	.prose :global(.person:focus-visible) {
		outline: 2px solid var(--gold);
		outline-offset: 2px;
	}
</style>
