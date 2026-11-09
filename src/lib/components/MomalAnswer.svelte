<script lang="ts">
	/** One Momal answer: thinking dropdown, prose and inline widgets, sources, follow-ups. */
	import { untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reading } from '$lib/reading.svelte';
	import { askMarkdown } from '$lib/askMarkdown';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import { MOMAL_LAYERS } from '$lib/momal';
	import { parseMomal } from '$lib/momalTypes';
	import type { AskMsg } from '$lib/storyAsk.svelte';
	import MomalThinking from '$lib/components/MomalThinking.svelte';
	import MomalWidget from '$lib/components/MomalWidget.svelte';

	let {
		m,
		live = false,
		large = false,
		followups = false,
		onask
	}: {
		m: AskMsg;
		live?: boolean;
		large?: boolean;
		/** Show the suggested next questions (only under the newest answer). */
		followups?: boolean;
		onask?: (q: string) => void;
	} = $props();

	const ko = $derived(reading.lang === 'ko');
	const waiting = $derived(live && !m.content.trim());
	const parsed = $derived(parseMomal(m.content, live));
	const lastText = $derived.by(() => {
		const s = parsed.segments;
		return s.length && s[s.length - 1].kind === 'text' ? s.length - 1 : -1;
	});
	const sources = $derived(m.trace?.sources ?? []);

	$effect(() => {
		const trace = m.trace;
		untrack(() => momalRefs.absorb(trace));
	});

	function host(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return '';
		}
	}
</script>

<div class="answer" class:large>
	<MomalThinking trace={m.trace} thinking={waiting} thinkMs={m.thinkMs} {large} />

	{#if !waiting}
		<div class="flow">
			{#each parsed.segments as seg, i (i)}
				{#if seg.kind === 'text'}
					<div class="md" class:live={live && i === lastText}>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- askMarkdown escapes the model text -->
						{@html askMarkdown(seg.text)}
					</div>
				{:else if seg.kind === 'widget'}
					<MomalWidget widget={seg.widget} />
				{:else}
					<MomalWidget pending={seg.type ?? ''} />
				{/if}
			{/each}
		</div>

		{#if !live && sources.length}
			<div class="sources" in:fly={{ y: 4, duration: 300, easing: cubicOut }}>
				<span class="src-label">
					<span class="material-symbols-outlined" aria-hidden="true">{MOMAL_LAYERS.record.icon}</span>
					{ko ? '출처' : 'Sources'}
				</span>
				{#each sources as s (s.label + (s.url ?? ''))}
					{#if s.url}
						<a class="src" href={s.url} target="_blank" rel="noopener noreferrer" title={s.url}>
							<span class="material-symbols-outlined" aria-hidden="true">public</span>
							{s.label}
							<span class="host">{host(s.url)}</span>
						</a>
					{:else}
						<span class="src">{s.label}</span>
					{/if}
				{/each}
			</div>
		{/if}

		{#if followups && !live && parsed.followups.length && onask}
			<div class="follow" aria-label={ko ? '이어서 물어보기' : 'Ask next'}>
				{#each parsed.followups as q, i (q)}
					<button
						type="button"
						class="fq"
						onclick={() => onask(q)}
						in:fly={{ x: -6, duration: 320, delay: 120 + i * 70, easing: cubicOut }}
					>
						<span class="material-symbols-outlined" aria-hidden="true">subdirectory_arrow_right</span>
						{q}
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;

	.answer {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		width: 100%;
	}

	.flow {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-size: 0.88rem;
		line-height: 1.55;
		letter-spacing: -0.012em;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 450;
		.large & {
			font-size: 1rem;
			line-height: 1.65;
		}
	}

	.md + .md {
		margin-top: 0.65em;
	}

	.md :global(p) {
		margin: 0 0 0.65em;
	}
	.md :global(p:last-child) {
		margin-bottom: 0;
	}
	.md :global(strong) {
		font-weight: 650;
		color: #fff;
	}
	.md :global(ul),
	.md :global(ol) {
		margin: 0.25em 0 0.65em;
		padding-left: 1.25em;
	}
	.md :global(li) {
		margin: 0.2em 0;
	}
	.md :global(code) {
		font-size: 0.88em;
		padding: 0.08em 0.32em;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.12);
	}
	.md :global(pre) {
		margin: 0.45em 0;
		padding: 0.65em 0.75em;
		border-radius: 10px;
		overflow: auto;
		background: rgba(255, 255, 255, 0.08);
	}
	.md :global(pre code) {
		padding: 0;
		background: none;
	}
	.md :global(a) {
		color: $gold;
		text-underline-offset: 2px;
	}
	.md :global(blockquote) {
		margin: 0.35em 0;
		padding-left: 0.75em;
		border-left: 2px solid;
		border-image: linear-gradient($red, $gold, $blue) 1;
		color: rgba(255, 255, 255, 0.66);
	}
	.md :global(h1),
	.md :global(h2),
	.md :global(h3) {
		margin: 0.7em 0 0.3em;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 1.15em;
		font-weight: 600;
		color: #fff;
	}
	.md :global(table) {
		border-collapse: collapse;
		margin: 0.5em 0;
		font-size: 0.92em;
	}
	.md :global(th),
	.md :global(td) {
		padding: 0.35em 0.6em;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		text-align: left;
	}

	.md.live :global(p:last-child)::after,
	.md.live :global(li:last-child)::after,
	.md.live:not(:has(p, li))::after {
		content: '';
		display: inline-block;
		width: 0.5em;
		height: 0.5em;
		margin-left: 0.3em;
		vertical-align: middle;
		border-radius: 50%;
		background: conic-gradient($red, $gold, $blue, $red);
		animation: momal-pulse 1.3s ease-in-out infinite;
	}

	@keyframes momal-pulse {
		0%,
		100% {
			transform: scale(0.7);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.15);
			opacity: 1;
		}
	}

	.sources {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		margin-top: 0.4rem;
	}

	.src-label {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		margin-right: 0.15rem;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
		& .material-symbols-outlined {
			font-size: 0.9rem;
		}
	}

	.src {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		max-width: 15rem;
		padding: 0.15rem 0.55rem 0.15rem 0.4rem;
		border-radius: 999px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.68rem;
		font-weight: 550;
		color: rgba(255, 255, 255, 0.7);
		background: rgba(255, 255, 255, 0.06);
		text-decoration: none;
		& .material-symbols-outlined {
			flex: 0 0 auto;
			font-size: 0.85rem;
			color: rgba(255, 255, 255, 0.45);
		}
	}

	.host {
		color: rgba(255, 255, 255, 0.35);
		font-weight: 450;
	}
	a.src:hover {
		background: rgba(255, 255, 255, 0.14);
		color: #fff;
	}

	.follow {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.15rem;
		margin-top: 0.55rem;
		padding-top: 0.55rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		width: 100%;
	}

	.fq {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.4rem;
		padding: 0.32rem 0.6rem 0.32rem 0.35rem;
		margin-left: -0.35rem;
		border: none;
		border-radius: 10px;
		background: transparent;
		color: rgba(255, 255, 255, 0.72);
		font: inherit;
		font-size: 0.82rem;
		text-align: left;
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 1rem;
			color: $gold;
			margin-top: 0.05rem;
		}
		&:hover {
			background: rgba(255, 255, 255, 0.07);
			color: #fff;
		}
		.large & {
			font-size: 0.9rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.md.live :global(p:last-child)::after,
		.md.live :global(li:last-child)::after,
		.md.live:not(:has(p, li))::after {
			animation: none;
			opacity: 0.85;
		}
	}
</style>
