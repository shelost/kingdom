<script lang="ts">
	import { storyImg } from '$lib/img';
	import { reading } from '$lib/reading.svelte';
	import { storyboardOf, type BoardPanel, type ScriptLine } from '$lib/screenplay';
	import type { Entry } from '$lib/story';

	let {
		entry,
		year,
		title,
		second = '',
		when = '',
		place = ''
	}: {
		entry: Pick<Entry, 'blocks' | 'images'>;
		year: number | null;
		title: string;
		second?: string;
		when?: string;
		place?: string;
	} = $props();

	let panels = $derived<BoardPanel[]>(storyboardOf(entry, reading.lang, year));

	function printBoard() {
		window.print();
	}
</script>

{#snippet caption(lines: ScriptLine[])}
	<div class="cap">
		{#each lines as line, i (i)}
			{#if line.kind === 'slug'}
				<p class="slug">{line.text}</p>
			{:else if line.kind === 'shot'}
				<p class="shot-line">{line.text}</p>
			{:else if line.kind === 'action'}
				<p class="action">{line.text}</p>
			{:else if line.kind === 'character'}
				<p class="character">{line.text}</p>
			{:else if line.kind === 'paren'}
				<p class="paren">{line.text}</p>
			{:else if line.kind === 'speech'}
				<p class="speech">
					{line.text}
					{#if line.sub}<span class="sub" lang="ko">{line.sub}</span>{/if}
				</p>
			{:else if line.kind === 'transition'}
				<p class="slug">{line.text}</p>
			{/if}
		{/each}
	</div>
{/snippet}

<div class="sheet">
	<header class="mast">
		{#if when || place}
			<p class="when">
				{when}{#if place}<span class="dot" aria-hidden="true">·</span>{place}{/if}
			</p>
		{/if}
		<h1>{title}</h1>
		{#if second && second !== title}<p class="second">{second}</p>{/if}
		<button type="button" class="print" onclick={printBoard}>
			{reading.lang === 'en' ? 'Print' : '인쇄'}
		</button>
	</header>
	{#if panels.length === 0}
		<p class="empty">This episode has no boards yet.</p>
	{:else}
		<ol class="board">
			{#each panels as panel (panel.n)}
				<li class="panel" class:wide={panel.shots.length > 1}>
					<header class="num">{panel.n}</header>
					{#if panel.shots.length}
						<div class="frames" style:--n={panel.shots.length}>
							{#each panel.shots as shot, si (si)}
								<figure>
									{#if shot.src}
										<img {...storyImg(shot.src, { alt: shot.alt || `Panel ${panel.n}` })} />
									{:else}
										<div class="blank">{shot.alt}</div>
									{/if}
								</figure>
							{/each}
						</div>
					{/if}
					{@render caption(panel.lines)}
				</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
	.sheet {
		max-width: 68rem;
		margin: 0 auto 4rem;
		color: var(--fg);
	}

	.mast {
		max-width: 40rem;
		margin: 0 auto 1.6rem;
		padding: 0.4rem 0 1.4rem;
		text-align: center;
		border-bottom: 1px solid var(--hairline);
	}

	.when {
		margin: 0;
		font-family: var(--ui);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.dot {
		margin: 0 0.45em;
		opacity: 0.5;
	}

	:global(html[data-lang='ko']) h1 {
		font-family: var(--display-ko);
		font-weight: 400;
		letter-spacing: 0;
	}

	h1 {
		margin: 0.45rem 0 0;
		font-family: var(--serif);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: -0.03em;
		color: var(--fg-strong);
	}

	.second {
		margin: 0.4rem 0 0;
		font-family: 'Noto Serif KR', serif;
		font-size: 1rem;
		color: var(--fg-dim);
	}

	.print {
		margin-top: 0.9rem;
		font: inherit;
		font-family: var(--ui);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: transparent;
		color: var(--fg-faint);
		cursor: pointer;
	}

	.print:hover {
		color: var(--fg-strong);
		border-color: var(--fg-faint);
	}

	.empty {
		margin: 2rem 0;
		color: var(--fg-dim);
	}

	.board {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.1rem;
	}

	@media (min-width: 900px) {
		.board {
			grid-template-columns: 1fr 1fr;
		}

		.panel.wide {
			grid-column: 1 / -1;
		}
	}

	.panel {
		break-inside: avoid;
		background: color-mix(in srgb, var(--fg) 4%, var(--bg));
		color: var(--fg);
		border: 1px solid var(--hairline);
		border-radius: 2px;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.num {
		align-self: flex-start;
		margin: 0.45rem 0 0 0.5rem;
		min-width: 1.6rem;
		padding: 0.05rem 0.4rem;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.78rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--fg-dim);
	}

	.frames {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 0.4rem;
		padding: 0.45rem 0.55rem 0;
	}

	figure {
		margin: 0;
		background: #111;
		aspect-ratio: 2 / 1;
		overflow: hidden;
	}

	figure img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.blank {
		height: 100%;
		display: flex;
		align-items: flex-end;
		padding: 0.6rem;
		color: var(--fg-dim);
		font-size: 0.82rem;
	}

	.cap {
		padding: 0.55rem 0.7rem 0.75rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.78rem;
		line-height: 1.3;
		white-space: pre-wrap;
	}

	.cap p {
		margin: 0;
	}

	.slug,
	.shot-line {
		margin-top: 0.45rem;
		font-weight: 700;
	}

	.shot-line {
		font-weight: 400;
		font-style: italic;
	}

	.action {
		margin-top: 0.35rem;
	}

	.character {
		margin-top: 0.55rem;
		font-weight: 700;
	}

	.paren,
	.speech {
		padding-left: 0.8rem;
	}

	.sub {
		display: block;
		font-style: italic;
	}

	@media print {
		.print {
			display: none;
		}

		.sheet {
			max-width: none;
		}

		.board {
			grid-template-columns: 1fr 1fr;
			gap: 0.4rem;
		}

		.panel,
		.mast,
		h1,
		.second,
		.when,
		.cap {
			color: #111;
			background: #fff;
		}

		:global(html.is-storyboard) :global(.hud),
		:global(html.is-storyboard) :global(.title-pill),
		:global(html.is-storyboard) :global(.outline),
		:global(html.is-storyboard) :global(.chapter-head),
		:global(html.is-storyboard) :global(.entry-head),
		:global(html.is-storyboard) :global(.colophon) {
			display: none !important;
		}

		:global(html.is-storyboard) :global(body) {
			background: #fff !important;
		}
	}
</style>
