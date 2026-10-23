<script lang="ts">
	import { resolve } from '$app/paths';
	import data from '$lib/data/relation-scores.json';
	import { chapters } from '$lib/story';
	import { episodes, episodeQueryId } from '$lib/reading.svelte';

	/**
	 * How well developed a relationship is on the page (edit mode only). Scores come from
	 * `scripts/relation-scores.mjs`, which the episode tracker re-runs on every script change.
	 */
	type Status = 'strong' | 'appropriate' | 'thin' | 'underdeveloped';
	type Score = {
		score: number;
		expected: number;
		status: Status;
		minEpisodes: number;
		links: { title: string; kind: 'talk' | 'together' | 'about' }[];
		parts: { presence: number; talk: number; evolution: number; grip: number };
		grip: number | null;
		scenes: number;
		exchanges: number;
		words: number;
		lines: number;
		talkedIn: number;
		episodes: string[];
		years: [number, number] | null;
		interrupts: number;
		questions: number;
		aiisms: number;
		telegrams: number;
		speeches: number;
		flagged: string[];
		updated: string;
	};

	let { id, compact = false }: { id: string; compact?: boolean } = $props();

	const scores = data.scores as unknown as Record<string, Score>;
	let s = $derived(scores[id]);

	const STATUS: Record<Status, { label: string; color: string; note: string }> = {
		strong: { label: 'Strong', color: '#5fae7a', note: 'A fully developed bond.' },
		appropriate: { label: 'Appropriate', color: '#7f9bb3', note: 'About as developed as these two characters’ parts allow.' },
		thin: { label: 'Thin', color: '#d4a03e', note: 'Their parts could carry more than the page gives them.' },
		underdeveloped: { label: 'Underdeveloped', color: '#d0624a', note: 'Both characters are big enough for much more of this bond.' }
	};
	const PARTS = [
		{ key: 'presence', label: 'Presence', max: 20, hint: 'put them in more scenes together' },
		{ key: 'talk', label: 'Talk', max: 25, hint: 'let them speak to each other, not about each other' },
		{ key: 'evolution', label: 'Evolution', max: 25, hint: 'let the bond change across more episodes' },
		{ key: 'grip', label: 'Grip', max: 30, hint: 'roughen the talk: interruptions, questions, short lines, no speeches' }
	] as const;
	const GROUPS = [
		{ kind: 'talk', label: 'They talk' },
		{ kind: 'together', label: 'Together' },
		{ kind: 'about', label: 'Others talk about them' }
	] as const;

	/** Episode title → the reader's `?ep=` value. */
	const queryByTitle = new Map(
		episodes
			.filter((ep) => ep.entryIndex >= 0)
			.map((ep) => [chapters[ep.chapterIndex]?.entries[ep.entryIndex]?.title, encodeURIComponent(episodeQueryId(ep))])
	);

	const pct = (n: number, of: number) => (of ? Math.round((100 * n) / of) : 0);
	let tone = $derived(s ? STATUS[s.status] : STATUS.thin);
	let weakest = $derived(s ? [...PARTS].sort((a, b) => s.parts[a.key] / a.max - s.parts[b.key] / b.max)[0] : undefined);
	let years = $derived(s?.years ? (s.years[0] === s.years[1] ? `in ${s.years[0]}` : `from ${s.years[0]} to ${s.years[1]}`) : '');
</script>

{#if s}
	{#if compact}
		<span class="strip" title={`Relationship health ${s.score} · ${tone.label}`} style:--c={tone.color}>
			<span class="strip-fill" style:width={`${Math.max(2, s.score)}%`}></span>
			<span class="strip-label">{s.score} · {tone.label}</span>
		</span>
	{:else}
		<section class="health" style:--c={tone.color}>
			<div class="head">
				<span class="score">{s.score}</span>
				<span class="verdict">
					<span class="pill">{tone.label}</span>
					<span class="expect">expected ~{s.expected}</span>
				</span>
			</div>
			<span class="meter">
				<span class="meter-fill" style:width={`${s.score}%`}></span>
				<span class="meter-mark" style:left={`${s.expected}%`} title={`Expected ~${s.expected}`}></span>
			</span>
			<p class="note">{tone.note}</p>

			<p class="summary">
				{#if s.scenes}
					They share {s.scenes} scene{s.scenes === 1 ? '' : 's'}{years ? ` ${years}` : ''}, and talk to each other in {s.talkedIn} episode{s.talkedIn === 1 ? '' : 's'}:
					{s.exchanges} exchange{s.exchanges === 1 ? '' : 's'}, {s.words.toLocaleString('en-US')} words.
				{:else}
					They never share a scene yet.
				{/if}
			</p>

			<div class="parts">
				{#each PARTS as part (part.key)}
					<span class="part">
						<span class="part-name">{part.label}</span>
						<span class="part-track"><span class="part-fill" style:width={`${pct(s.parts[part.key], part.max)}%`}></span></span>
					</span>
				{/each}
			</div>

			{#if s.lines}
				<p class="summary">
					Dialogue: {pct(s.interrupts, s.lines)}% interruptions, {pct(s.questions, s.lines)}% questions{#if s.aiisms}, <span class="warn">{s.aiisms} AI-ism{s.aiisms === 1 ? '' : 's'}</span>{/if}{#if s.speeches}, <span class="warn">{s.speeches} speech{s.speeches === 1 ? '' : 'es'}</span>{/if}.
				</p>
				{#each s.flagged as line, i (i)}<p class="flag">“{line}”</p>{/each}
			{/if}

			{#if weakest && s.status !== 'strong'}<p class="summary">To grow it: {weakest.hint}.</p>{/if}

			{#each GROUPS as group (group.kind)}
				{@const eps = s.links.filter((l) => l.kind === group.kind)}
				{#if eps.length}
					<div class="eps">
						<span class="eps-label">{group.label}</span>
						<span class="eps-list">
							{#each eps as ep (ep.title)}
								{@const q = queryByTitle.get(ep.title)}
								{#if q}
									<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- resolved path plus the episode query -->
									<a href={`${resolve('/read')}?ep=${q}`}>{ep.title}</a>
								{:else}<span>{ep.title}</span>{/if}
							{/each}
						</span>
					</div>
				{/if}
			{/each}
		</section>
	{/if}
{/if}

<style>
	/* ——— On the card: a hairline along its bottom edge ——— */
	.strip {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		overflow: visible;
		border-radius: 0 0 var(--card-radius, 0.75rem) var(--card-radius, 0.75rem);
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		pointer-events: none;
	}

	.strip-fill {
		position: absolute;
		inset: 0 auto 0 0;
		background: var(--c);
	}

	.strip-label {
		position: absolute;
		right: 0.9rem;
		bottom: 0.45rem;
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		font-variant-numeric: tabular-nums;
		color: color-mix(in srgb, var(--c) 75%, var(--fg));
	}

	/* ——— In the profile ——— */
	.health {
		display: grid;
		gap: 0.55rem;
		margin: 1.2rem 0;
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.head {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.score {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		color: var(--c);
	}

	.verdict {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.pill {
		align-self: flex-start;
		padding: 0.05rem 0.5rem;
		border-radius: 999px;
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		background: color-mix(in srgb, var(--c) 20%, transparent);
		color: color-mix(in srgb, var(--c) 70%, var(--fg-strong));
	}

	.expect,
	.note {
		margin: 0;
		font-size: 0.78rem;
		color: var(--fg-faint);
	}

	.meter {
		position: relative;
		height: 4px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 10%, transparent);
	}

	.meter-fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: inherit;
		background: var(--c);
	}

	.meter-mark {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 2px;
		margin-left: -1px;
		background: var(--fg-dim);
	}

	.summary,
	.flag {
		margin: 0;
		color: var(--fg-dim);
	}

	.flag {
		padding-left: 0.8rem;
		border-left: 2px solid #d0624a;
		font-size: 0.8rem;
	}

	.warn {
		color: #e07a64;
	}

	.parts {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.6rem;
	}

	.part {
		display: grid;
		gap: 0.25rem;
	}

	.part-name {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.part-track {
		height: 3px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 10%, transparent);
		overflow: hidden;
	}

	.part-fill {
		display: block;
		height: 100%;
		background: var(--fg-dim);
	}

	.eps {
		display: grid;
		gap: 0.2rem;
	}

	.eps-label {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	.eps-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.8rem;
	}

	.eps-list a {
		color: var(--fg-strong);
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--fg) 30%, transparent);
		text-underline-offset: 3px;
	}

	.eps-list a:hover {
		text-decoration-color: var(--c);
	}
</style>
