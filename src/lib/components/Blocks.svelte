<script lang="ts">
	import type { Block } from '$lib/story';
	import {
		linkPeople,
		avatarOf,
		nameOf,
		isPlaceholderArt,
		byId,
		colorOf,
		hangulInitial,
		type Person
	} from '$lib/people';
	import { reading, isKorean, isStageMode, activateDialogue } from '$lib/reading.svelte';
	import { utteranceOf } from '$lib/speech.svelte';
	import Self from './Blocks.svelte';
	import DiagramBlock from './diagrams/DiagramBlock.svelte';
	import SpeakButton from './SpeakButton.svelte';

	type Dialogue = Extract<Block, { kind: 'dialogue' }>;

	let { blocks, year = null }: { blocks: Block[]; year?: number | null } = $props();

	function visible(b: Block) {
		if (
			b.kind === 'flashback' ||
			b.kind === 'table' ||
			b.kind === 'hanja' ||
			b.kind === 'verse' ||
			b.kind === 'formation' ||
			b.kind === 'diagram' ||
			b.kind === 'day'
		)
			return true;
		// quotes always carry hanja / hangul / english together
		if (b.kind === 'quote') return true;
		if (reading.lang === 'both') return true;
		if (b.kind === 'dialogue')
			return reading.lang === 'en'
				? !!b.en?.length || !b.lines.some((l) => isKorean(l))
				: b.lines.some(Boolean);
		// narration + retrospective monologue: EN always; KO when translated
		return reading.lang === 'en' ? true : !!b.ko || isKorean(b.html);
	}

	/** The narration string to render for the current language. */
	function prose(b: { html: string; ko?: string }) {
		return reading.lang === 'ko' && b.ko ? b.ko : b.html;
	}

	let shown = $derived(blocks.filter(visible));
</script>

<!-- The body of one dialogue block: who is talking, then the lines themselves.
     Shared by the plain rendering and the clickable immersive one. -->
{#snippet utterance(block: Dialogue, p: Person | undefined)}
	{#if p}
		<span class="who">{nameOf(p, year, block.look)}</span>
	{:else if block.speaker}
		<span class="speaker">{block.speaker}</span>
	{/if}
	{#each {
		length: Math.max(
			block.lines.length,
			block.en?.length ?? 0,
			block.zh?.length ?? 0,
			block.ja?.length ?? 0
		)
	} as _, j (j)}
		{#if block.lines[j] && reading.lang !== 'en'}
			<span class="line ko">{@html block.lines[j]}</span>
		{/if}
		{#if block.en?.[j] && reading.lang !== 'ko'}
			<span class="line en" class:solo={!block.lines[j]}>{@html block.en[j]}</span>
		{/if}
		<!-- Native CN/JP subtitle + transcription: always shown when present -->
		{#if block.zh?.[j]}
			<span class="line zh">{@html block.zh[j]}</span>
		{/if}
		{#if block.zhLatn?.[j]}
			<span class="line zh-latn">{block.zhLatn[j]}</span>
		{/if}
		{#if block.ja?.[j]}
			<span class="line ja">{@html block.ja[j]}</span>
		{/if}
		{#if block.jaLatn?.[j]}
			<span class="line ja-latn">{block.jaLatn[j]}</span>
		{/if}
	{/each}
{/snippet}

<div class="prose">
	{#each shown as block, i (i)}
		{#if block.kind === 'p'}
			<p>{@html linkPeople(prose(block), year)}</p>
		{:else if block.kind === 'cite'}
			<p class="cite">{@html linkPeople(prose(block), year)}</p>
		{:else if block.kind === 'dialogue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			{@const spoken = utteranceOf(block.lines, block.en, p?.id ?? null)}
			<div
				class="dialogue"
				style:--chip={p ? colorOf(p) : block.chip}
				data-speaker={p?.id ?? undefined}
				data-look={block.look ?? undefined}
			>
				{#if p}
					{@const maidSeed =
						p.id === 'courtmaid'
							? (block.lines ?? block.en ?? []).join('\n')
							: undefined}
					{@const art = avatarOf(p, maidSeed, year, block.look)}
					{@const who = nameOf(p, year, block.look)}
					<button
						type="button"
						class="face person"
						class:silhouette={isPlaceholderArt(art) && p.id !== 'courtmaid'}
						data-person={p.id}
						title={who}
						aria-label={who}
					>
						{#if art}
							<img src={art} alt="" />
						{:else}
							<span class="initial">{hangulInitial(p)}</span>
						{/if}
					</button>
				{:else}
					<span class="chip"></span>
				{/if}
				<!-- Immersion / cinema: the lines are a control — click one to put it
				     on stage. Only speakers with a profile can hold a stage, so only
				     those become clickable; everything else stays plain prose. -->
				{#if p && isStageMode(reading.mode)}
					<button
						type="button"
						class="lines pick"
						title="Speak this line"
						onclick={(e) => activateDialogue(e.currentTarget)}
					>
						{@render utterance(block, p)}
					</button>
				{:else}
					<div class="lines">
						{@render utterance(block, p)}
					</div>
				{/if}
				<!-- Hear the line: parked in the gutter under the face, out of the
				     text's way, and out of flow so it changes no measurement. -->
				<SpeakButton utterance={spoken} />
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
		{:else if block.kind === 'monologue'}
			{@const p = block.person ? byId.get(block.person) : undefined}
			<aside
				class="monologue"
				style:--chip={p ? colorOf(p) : 'var(--fg-dim)'}
				data-speaker={p?.id ?? undefined}
				data-look={block.look ?? undefined}
			>
				<span class="mono-label">{p ? `${nameOf(p, year, block.look)}, later` : 'later'}</span>
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
		{:else if block.kind === 'diagram'}
			<DiagramBlock {block} />
		{:else if block.kind === 'day'}
			<!-- the siege calendar: one large plate per day of the chronicle -->
			<header class="day">
				<span class="day-rule" aria-hidden="true"></span>
				<span class="day-text">
					<span class="day-label">{block.label}</span>
					{#if block.ko}<span class="day-ko">{block.ko}</span>{/if}
				</span>
				<span class="day-rule" aria-hidden="true"></span>
			</header>
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
		max-width: 54rem;
	}

	.prose p {
		margin: 0 0 1.2rem;
		line-height: 1.5;
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
		position: relative;
		display: grid;
		grid-template-columns: 1.75rem 1fr;
		gap: 0.7rem;
		margin: 1.25rem 0;
		transition:
			background 420ms var(--ease),
			box-shadow 420ms var(--ease),
			opacity 420ms var(--ease),
			padding 420ms var(--ease),
			margin 420ms var(--ease);
	}

	/* Stage modes (immersion + cinema): script lines stay; the live line gets a
	   soft featured pulse and the rest steps back — but never so far that the
	   page reads as empty. Neighbours stay skimmable. */
	:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.74;
	}

	/* The lit wash is the whole cue — no edge rule, so the line reads as a
	   raised piece of the page rather than a quoted block. */
	:global(html.is-stage) .dialogue:global(.is-speaking) {
		margin-left: -0.55rem;
		padding: 0.45rem 0.65rem 0.45rem 0.55rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--chip) 12%, color-mix(in srgb, var(--fg) 4%, transparent));
		opacity: 1;
	}

	/* ————— Cinema lettering —————
	   Comic rhythm: a balloon around every cue, narration set as a caption box
	   with a gold edge, and the translation kept deliberately under its breath
	   so a bilingual panel still reads as one voice. */
	:global(html.is-cinema) .prose p {
		font-size: 1.02rem;
		line-height: 1.62;
	}

	:global(html.is-cinema) .dialogue {
		margin: 1.05rem 0;
		padding: 0.5rem 0.8rem 0.55rem 0.6rem;
		border-radius: 12px;
		background: color-mix(in srgb, var(--plate-ink) 46%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 20%, transparent);
	}

	:global(html.is-cinema) .dialogue:not(:global(.is-speaking)) {
		opacity: 0.72;
	}

	:global(html.is-cinema) .dialogue:global(.is-speaking) {
		margin-left: 0;
		padding: 0.5rem 0.8rem 0.55rem 0.6rem;
		border-radius: 12px;
		background: color-mix(in srgb, var(--chip) 16%, color-mix(in srgb, var(--plate-ink) 62%, transparent));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--chip) 45%, transparent);
	}

	:global(html.is-cinema) .line.ko {
		font-size: 1.04em;
		color: var(--fg);
	}

	:global(html.is-cinema) .line.en:not(.solo) {
		font-size: 0.86em;
		color: var(--fg-dim);
	}

	/* Narration, monologue and the moral read as caption boxes. */
	:global(html.is-cinema) .cite,
	:global(html.is-cinema) .monologue,
	:global(html.is-cinema) .moral {
		border-left: 3px solid color-mix(in srgb, var(--gold) 45%, transparent);
		padding-left: 0.9rem;
		background: color-mix(in srgb, var(--plate-ink) 34%, transparent);
	}

	:global(html.is-cinema) .cite::before {
		display: none;
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
		background: transparent;
		cursor: pointer;
		transition:
			transform 0.25s var(--ease),
			box-shadow 0.25s var(--ease);
	}

	/* Initials still need a fill; painted portraits stay transparent. */
	.face:not(:has(img)) {
		background: color-mix(in srgb, var(--chip) 72%, #000);
	}

	.face:hover {
		transform: scale(1.1);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--chip) 25%, transparent);
	}

	/* Full standing bust — never crop heads/feet. */
	.face img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center bottom;
		background: transparent;
	}

	/* a placeholder body, not a likeness — it sits back a little */
	.face.silhouette img {
		opacity: 0.62;
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

	/* ————— speak this line —————
	   Out of flow in the gutter beneath the face, so it can never crowd the
	   text or change how tall a dialogue is. It keeps out of sight until the
	   reader is on this line, and stays lit while it is the one sounding. */
	.dialogue :global(.speak) {
		position: absolute;
		top: 2.15rem;
		left: 0.12rem;
		opacity: 0;
		transition: opacity 0.25s var(--ease);
	}

	@media (hover: hover) {
		.dialogue:hover :global(.speak) {
			opacity: 1;
		}
	}

	/* Nothing hovers on a touch screen — the control just sits there, quiet. */
	@media (hover: none) {
		.dialogue :global(.speak) {
			opacity: 0.45;
		}
	}

	.dialogue:focus-within :global(.speak),
	.dialogue :global(.speak.on),
	.dialogue :global(.speak.busy) {
		opacity: 1;
	}

	/* Immersive: the lines are the click target; the wash paints the whole
	   `.dialogue` (same box as `.is-speaking`), not just the text column. */
	.lines.pick {
		align-items: flex-start;
		width: 100%;
		margin: 0;
		padding: 0;
		font: inherit;
		letter-spacing: inherit;
		text-align: left;
		border: none;
		border-radius: 2px;
		background: transparent;
		cursor: pointer;
	}

	/* Hover only where hovering exists — on a touch screen the state would
	   stick to the last line tapped. Mirror the active wash on the parent. */
	@media (hover: hover) {
		:global(html.is-stage) .dialogue:has(.lines.pick:hover):not(:global(.is-speaking)) {
			margin-left: -0.55rem;
			padding: 0.45rem 0.65rem 0.45rem 0.55rem;
			border-radius: 6px;
			background: color-mix(in srgb, var(--chip) 10%, color-mix(in srgb, var(--fg) 3%, transparent));
			opacity: 0.92;
		}
	}

	.lines.pick:focus-visible {
		outline: 1px solid color-mix(in srgb, var(--chip) 55%, var(--fg-strong));
		outline-offset: 0.35rem;
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

	/* Tang / Yamato native speech — a subtitle under the reading language */
	.line.zh,
	.line.ja {
		margin-top: 0.12rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 0.94em;
		letter-spacing: 0.06em;
		line-height: 1.42;
		color: color-mix(in srgb, var(--chip) 38%, var(--fg-dim));
	}

	.line.zh-latn,
	.line.ja-latn {
		font-size: 0.78em;
		font-style: italic;
		letter-spacing: 0.02em;
		line-height: 1.45;
		color: var(--fg-faint);
		margin-bottom: 0.22rem;
	}

	.who {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: var(--tracking-micro);
		color: color-mix(in srgb, var(--chip) 45%, var(--fg-strong));
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
		color: color-mix(in srgb, var(--vc) 58%, var(--fg-strong));
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
		color: var(--fg-strong);
		letter-spacing: var(--tracking-micro);
		background: color-mix(in srgb, var(--fg) 5%, transparent);
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
		line-height: 1.45;
		color: color-mix(in srgb, var(--quote) 72%, var(--fg-faint));
	}

	.quote-ko {
		margin: 0 0 0.35rem;
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1em;
		line-height: 1.48;
		color: color-mix(in srgb, var(--quote) 88%, var(--fg-strong));
	}

	.quote-en,
	.quote blockquote {
		margin: 0;
		font-size: 0.98em;
		font-style: italic;
		line-height: 1.48;
		color: color-mix(in srgb, var(--quote) 70%, var(--fg-dim));
	}

	.quote figcaption {
		margin-top: 0.45rem;
		font-size: 0.68rem;
		letter-spacing: var(--tracking-micro);
		line-height: 1.45;
		max-width: 54rem;
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
		font-family: var(--serif);
		font-size: 1.02em;
		font-style: italic;
		font-weight: 500;
		line-height: 1.5;
		letter-spacing: var(--tracking-display);
		color: color-mix(in srgb, var(--chip) 28%, var(--fg-strong));
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

	/* ————— siege-day header ————— */
	.day {
		display: flex;
		align-items: center;
		gap: 1.1rem;
		margin: 3.4rem 0 1.9rem;
	}

	.day:first-child {
		margin-top: 1.4rem;
	}

	.day-rule {
		flex: 1;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--gold) 55%, transparent)
		);
	}

	.day-rule:last-child {
		background: linear-gradient(
			to left,
			transparent,
			color-mix(in srgb, var(--gold) 55%, transparent)
		);
	}

	.day-text {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
	}

	.day-label {
		font-family: var(--serif);
		font-size: 1.65rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.24em;
		text-indent: 0.24em; /* re-centres the tracked type */
		text-transform: uppercase;
		color: var(--gold);
		text-shadow: 0 0 24px color-mix(in srgb, var(--gold) 35%, transparent);
	}

	.day-ko {
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.3em;
		text-indent: 0.3em;
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
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 10%, transparent);
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

	/* ————— Phones: targets a thumb can actually hit ————— */
	@media (max-width: 820px) {
		.dialogue {
			grid-template-columns: 2.25rem 1fr;
			gap: 0.8rem;
			margin: 1.5rem 0;
		}

		.face {
			width: 2.25rem;
			height: 2.25rem;
			margin-top: 0.1rem;
		}

		/* clears the taller face, and the target grows to thumb size */
		.dialogue :global(.speak) {
			top: 2.7rem;
			left: 0.08rem;
		}

		/* The line is already the full width of the column; only its height is
		   short of a comfortable target, and padding-block grown against an
		   equal negative margin-block adds it without moving any text. */
		.lines.pick {
			min-height: 2.75rem;
			margin-block: -0.5rem;
			padding-block: 0.5rem;
			border-radius: 6px;
			-webkit-tap-highlight-color: transparent;
		}

		/* the chronicle either side of the live line still has to be readable */
		:global(html.is-stage) .dialogue:not(:global(.is-speaking)) {
			opacity: 0.88;
		}
	}
</style>
