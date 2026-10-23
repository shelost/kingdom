<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { scriptOf, type ScriptLine } from '$lib/screenplay';
	import type { Block } from '$lib/story';

	let {
		blocks,
		year,
		title,
		second = '',
		when = '',
		place = ''
	}: {
		blocks: Block[];
		year: number | null;
		title: string;
		second?: string;
		when?: string;
		place?: string;
	} = $props();

	let lines = $derived<ScriptLine[]>(scriptOf(blocks, reading.lang, year));

	function printScript() {
		window.print();
	}
</script>

<div class="sheet">
	<header class="mast">
		{#if when || place}
			<p class="when">
				{when}{#if place}<span class="dot" aria-hidden="true">·</span>{place}{/if}
			</p>
		{/if}
		<h1>{title}</h1>
		{#if second && second !== title}<p class="second">{second}</p>{/if}
		<button type="button" class="print" onclick={printScript}>
			{reading.lang === 'en' ? 'Print' : '인쇄'}
		</button>
	</header>
	<div class="page">
		{#each lines as line, i (i)}
			{#if line.kind === 'slug'}
				<p class="slug">{line.text}</p>
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
				<p class="transition">{line.text}</p>
			{/if}
		{/each}
	</div>
</div>

<style>
	.sheet {
		max-width: 40rem;
		margin: 0 auto 4rem;
		color: var(--fg);
	}

	.mast {
		padding: 0.4rem 0 1.4rem;
		margin-bottom: 1.6rem;
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

	.page {
		background: transparent;
		color: var(--fg);
		padding: 0 0 2rem;
		font-family: 'Courier New', Courier, monospace;
		font-size: 12pt;
		line-height: 1.35;
		white-space: pre-wrap;
	}

	.page p {
		margin: 0;
	}

	.slug {
		margin-top: 1.35rem;
		font-weight: 700;
	}

	.action {
		margin-top: 0.7rem;
	}

	.character {
		margin-top: 1rem;
		text-align: center;
	}

	.paren {
		width: 50%;
		margin: 0 auto;
		text-align: center;
	}

	.speech {
		width: 62%;
		margin: 0 auto;
	}

	.sub {
		display: block;
		margin-top: 0.15rem;
		font-style: italic;
	}

	.transition {
		margin-top: 1.1rem;
		text-align: right;
	}

	@media print {
		.print {
			display: none;
		}

		.sheet {
			max-width: none;
			margin: 0;
		}

		.page,
		.mast,
		h1,
		.second,
		.when {
			color: #111;
		}

		.sheet {
			color: #111;
		}

		.page {
			padding: 0;
		}

		:global(html.is-screenplay) :global(.hud),
		:global(html.is-screenplay) :global(.title-pill),
		:global(html.is-screenplay) :global(.outline),
		:global(html.is-screenplay) :global(.reading-clip > nav),
		:global(html.is-screenplay) :global(.chapter-head),
		:global(html.is-screenplay) :global(.entry-head),
		:global(html.is-screenplay) :global(.colophon) {
			display: none !important;
		}

		:global(html.is-screenplay) :global(body) {
			background: #fff !important;
		}
	}
</style>
