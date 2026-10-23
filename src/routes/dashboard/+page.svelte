<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import RowThumb from '$lib/components/RowThumb.svelte';
	import StoryChart from '$lib/components/StoryChart.svelte';
	import MysteryChart from '$lib/components/MysteryChart.svelte';
	import StoryView from '$lib/components/StoryView.svelte';
	import EpisodeArc from '$lib/components/EpisodeArc.svelte';
	import data from '$lib/data/episode-scores.json';
	import type { ArcBeat, ArcNode, ArcReview } from '$lib/episodeArc';
	import { chapters, entryId, type Entry } from '$lib/story';
	import { episodeQueryId, episodes } from '$lib/reading.svelte';
	import { episodeThumbnail } from '$lib/thumbnail.svelte';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';

	type Metric = 'pacing' | 'entertainment' | 'balance' | 'completeness' | 'human' | 'accuracy';
	type Grade = 'A' | 'B' | 'C';
	type Row = {
		n: number;
		id: string;
		arc: string;
		chapter: string;
		title: string;
		ko: string;
		year: string;
		grade: Grade | null;
		stats: Record<string, number | boolean | null>;
		outline?: ArcNode[];
		beats?: ArcBeat[];
		reviews?: ArcReview[];
		flagged: string[];
		metrics: Record<Metric, number | null>;
		ranks: Record<string, number>;
		composite: number;
		updated: string;
	};
	type Field = { key: string; label: string; short?: string; kind: 'score' | 'stat'; hint: string; unit?: string; get: (r: Row) => number | null };

	const score = (key: Metric, label: string, hint: string): Field => ({ key, label, kind: 'score', hint, get: (r) => r.metrics[key] });
	const stat = (key: string, label: string, hint: string, short?: string, unit?: string): Field => ({
		key,
		label,
		short,
		unit,
		kind: 'stat',
		hint,
		get: (r) => {
			const v = r.stats[key];
			return typeof v === 'number' ? v : typeof v === 'boolean' ? Number(v) : null;
		}
	});

	const FIELDS: Field[] = [
		{ key: 'composite', label: 'Score', kind: 'score', hint: 'Weighted blend of story metrics only: pacing, entertainment, balance and completeness. Human and accuracy are shown and do not enter the score.', get: (r) => r.composite },
		score('pacing', 'Pacing', 'Scenes near 300–650 words, some variation between them, narration and talk taking turns.'),
		score('entertainment', 'Entertainment', 'Talk share, questions, interruptions, speakers, a short opening line, a bold closer, stills.'),
		score('balance', 'Balance', 'Narration, dialogue, stills and widgets against a spoken scene with a frame every few hundred words.'),
		score('completeness', 'Completeness', 'Plot-audit grade blended with dialogue grip — beginning, middle, end. Ungraded episodes use grip alone, discounted.'),
		score('human', 'Human', 'Shown, not counted. Falls fast with AI tells per thousand words.'),
		score('accuracy', 'Accuracy', 'Shown, not counted. Quoted sources up; years in a mortal mouth, king numbers and glosses down.'),
		stat('words', 'Words', 'English words, narration plus dialogue. A count, not a score.'),
		stat('minutes', 'Minutes', 'Reading time at 230 words a minute.', 'Min'),
		stat('narration', 'Narration words', 'English words outside dialogue.', 'Narr.'),
		stat('dialogue', 'Dialogue words', 'English words spoken in dialogue blocks.', 'Dial.'),
		stat('dialoguePct', 'Dialogue %', 'Share of words that are dialogue.', 'Dial %', '%'),
		stat('koChars', 'Korean characters', 'Korean text, spaces removed.', 'KO'),
		stat('paragraphs', 'Paragraphs', 'Narration paragraphs.', 'Paras'),
		stat('dialogueBlocks', 'Dialogue blocks', 'Speaker turns.', 'Turns'),
		stat('lines', 'Dialogue lines', 'Individual spoken lines.', 'Lines'),
		stat('questions', 'Questions', 'Spoken lines with a question mark.', 'Q'),
		stat('interrupts', 'Interruptions', 'Lines cut off or trailing.', 'Int.'),
		stat('speakers', 'Speakers', 'Distinct people who talk.', 'Spk'),
		stat('scenes', 'Scenes', 'Scene, day and story headers. A count, not a score.', 'Scn'),
		stat('wordsPerScene', 'Words per scene', 'Average scene length.', 'W/scn'),
		stat('places', 'Places & maps', 'Place cards, maps and battle maps.', 'Plc'),
		stat('flashbacks', 'Flashbacks', 'Flashback blocks.', 'FB'),
		stat('images', 'Stills', 'Image slots on the episode.', 'Stills'),
		stat('stillsPerK', 'Stills per 1k words', 'Frames per thousand words.', 'St/k'),
		stat('sequences', 'Movie sequences', 'Movie sequences on the episode.', 'Seq'),
		stat('widgets', 'Widgets', 'Quotes, cards, maps, diagrams, terms, poems and other widgets.', 'Wdg'),
		stat('widgetsPerK', 'Widgets per 1k words', 'Widgets per thousand words.', 'W/k'),
		stat('quotes', 'Source quotes', 'Verbatim record quotes.', 'Quo'),
		stat('grip', 'Dialogue grip', 'Interruptions, questions and short lines up; telegrams and speeches down.', 'Grip'),
		stat('aiPerK', 'AI tells per 1k', 'Weighted AI tells per thousand words. Lower is better.', 'AI/k'),
		stat('aiHits', 'AI flags', 'Sentences flagged as AI-ish (first six kept).', 'AI'),
		stat('emDashes', 'Em-dashes', 'Em-dashes in narration.', '—'),
		stat('longSentences', 'Long sentences', 'Narration sentences over 30 words.', 'Long'),
		stat('sentenceCv', 'Sentence variety', 'How much narration sentence length varies. Under 0.55 reads uniform.', 'Var'),
		stat('speeches', 'Speeches', 'Turns of four or more lines and five or more sentences.', 'Spch'),
		stat('telegrams', 'Telegram lines', 'Lines like “Han. Mohe. Khitan.”', 'Tel'),
		stat('adInMouth', 'Years spoken', 'AD/CE years in dialogue.', 'Yrs'),
		stat('kingNos', 'King numbers', '“(#26)” in narration.', '#'),
		stat('glosses', 'Glosses', 'Hanja or Korean in parentheses in narration.', 'Gls')
	];
	const BY_KEY = new Map(FIELDS.map((f) => [f.key, f]));
	const SCORES = FIELDS.filter((f) => f.kind === 'score');
	const STORY_SCORES = SCORES.filter((f) => f.key === 'composite' || ['pacing', 'entertainment', 'balance', 'completeness'].includes(f.key));
	const CRAFT_SCORES = SCORES.filter((f) => f.key === 'human' || f.key === 'accuracy');
	const STATS = FIELDS.filter((f) => f.kind === 'stat');
	const CORE_KEYS = ['words', 'minutes', 'dialoguePct', 'speakers', 'scenes', 'images'];
	const CORE_STATS = STATS.filter((f) => CORE_KEYS.includes(f.key));
	const LOWER_IS_BETTER = new Set(['aiPerK', 'aiHits', 'emDashes', 'longSentences', 'speeches', 'telegrams', 'adInMouth', 'kingNos', 'glosses']);

	const book = data.book;
	const rows = Object.values(data.episodes) as unknown as Row[];

	const entries = new Map<string, { entry: Entry; eid: string }>();
	for (const ch of chapters) for (const entry of ch.entries) entries.set(`${ch.id}::${entry.title}`, { entry, eid: entryId(ch.id, entry.title) });
	const queryIds = new Map(episodes.filter((ep) => ep.kind === 'entry').map((ep) => [ep.id, episodeQueryId(ep)]));

	function thumbOf(row: Row): string | undefined {
		const hit = entries.get(row.id);
		return hit ? episodeThumbnail(hit.entry, hit.eid)?.src : undefined;
	}
	function readHref(row: Row): string {
		const eid = entries.get(row.id)?.eid ?? '';
		return hrefWithNsfw(`${resolve('/read')}?ep=${encodeURIComponent(queryIds.get(eid) ?? eid)}`, page.url);
	}

	/* ——— view state ——— */
	type View = 'table' | 'grid' | 'story';
	type Columns = 'scores' | 'stats' | 'all';
	type Range = { id: number; key: string; min: number | null; max: number | null };

	function readView(raw: string | null): View {
		return raw === 'table' || raw === 'grid' || raw === 'story' ? raw : 'table';
	}

	let view = $state<View>(readView(page.url.searchParams.get('view')));
	let chartHover = $state<string | null>(null);
	let selectedBox = $state<string | null>(null);
	let columns = $state<Columns>('stats');
	let sortKey = $state('composite');
	let dir = $state<1 | -1>(-1);
	let query = $state('');
	let arc = $state('all');
	let grades = $state<Record<Grade | 'none', boolean>>({ A: true, B: true, C: true, none: true });
	let ranges = $state<Range[]>([]);
	let open = $state<string | null>(null);
	let nextRange = 0;

	const shownFields = $derived(columns === 'scores' ? SCORES : columns === 'stats' ? [SCORES[0], ...CORE_STATS] : FIELDS);
	const gridFields = $derived.by(() => {
		const core = CORE_STATS;
		const extra = BY_KEY.get(sortKey);
		if (extra && extra.kind === 'stat' && !CORE_KEYS.includes(extra.key)) return [extra, ...core];
		return core;
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return rows.filter((r) => {
			if (arc !== 'all' && r.chapter !== arc) return false;
			if (!grades[r.grade ?? 'none']) return false;
			if (q && !`${r.title} ${r.ko} ${r.arc} ${r.year}`.toLowerCase().includes(q)) return false;
			for (const f of ranges) {
				const v = BY_KEY.get(f.key)?.get(r);
				if (v == null) return false;
				if (f.min != null && v < f.min) return false;
				if (f.max != null && v > f.max) return false;
			}
			return true;
		});
	});

	const sorted = $derived.by(() => {
		if (sortKey === 'title') return [...filtered].sort((a, b) => dir * a.title.localeCompare(b.title));
		if (sortKey === 'n') return [...filtered].sort((a, b) => dir * (a.n - b.n));
		const f = BY_KEY.get(sortKey);
		if (!f) return filtered;
		return [...filtered].sort((a, b) => dir * ((f.get(a) ?? -Infinity) - (f.get(b) ?? -Infinity)));
	});

	const visibleAvg = $derived(sorted.length ? Math.round(sorted.reduce((s, r) => s + r.composite, 0) / sorted.length) : 0);
	const reading = $derived([...filtered].sort((a, b) => a.n - b.n));

	function setView(next: View) {
		view = next;
		const url = new URL(page.url);
		if (next === 'table') url.searchParams.delete('view');
		else url.searchParams.set('view', next);
		history.replaceState(history.state, '', url);
	}

	function sortBy(key: string) {
		if (sortKey === key) dir = dir === -1 ? 1 : -1;
		else {
			sortKey = key;
			dir = key === 'title' || key === 'n' || LOWER_IS_BETTER.has(key) ? 1 : -1;
		}
	}
	function addRange() {
		ranges.push({ id: nextRange++, key: 'composite', min: null, max: null });
	}
	function removeRange(id: number) {
		ranges = ranges.filter((r) => r.id !== id);
	}
	function reset() {
		query = '';
		arc = 'all';
		grades = { A: true, B: true, C: true, none: true };
		ranges = [];
	}
	function numberOrNull(v: string): number | null {
		const n = Number.parseFloat(v);
		return Number.isFinite(n) ? n : null;
	}

	function tone(n: number | null): string {
		if (n == null) return 'var(--fg-faint)';
		if (n >= 80) return '#5fae7a';
		if (n >= 60) return '#7f9bb3';
		if (n >= 40) return '#d4a03e';
		return '#d0624a';
	}
	function fmt(f: Field, r: Row): string {
		const v = f.get(r);
		if (v == null) return '–';
		return `${v.toLocaleString('en-US')}${f.unit ?? ''}`;
	}
	const arrow = (key: string) => (sortKey === key ? (dir === -1 ? ' ↓' : ' ↑') : '');
	const TOTALS: [string, string][] = [
		['words', 'words'],
		['dialogue', 'dialogue words'],
		['koChars', 'Korean characters'],
		['lines', 'spoken lines'],
		['scenes', 'scenes'],
		['images', 'stills'],
		['widgets', 'widgets'],
		['quotes', 'source quotes'],
		['flashbacks', 'flashbacks'],
		['aiHits', 'AI flags']
	];
</script>

<svelte:head>
	<title>Dashboard · King for All</title>
	<meta name="description" content="Every episode ranked on pacing, entertainment, completeness, voice and the house rules. Word count and scene count stay facts." />
</svelte:head>

{#snippet thumb(row: Row, sizes: string)}
	<a class="thumb-link" href={readHref(row)} onclick={(e) => e.stopPropagation()} aria-label={`Read ${row.title}`}>
		<RowThumb src={thumbOf(row)} {sizes} fallback={row.title.charAt(0)} />
	</a>
{/snippet}

{#snippet detail(row: Row)}
	<div class="detail-body">
		<EpisodeArc outline={row.outline ?? []} beats={row.beats ?? []} reviews={row.reviews ?? []} words={Number(row.stats.words) || 0} />
		<dl>
			{#each STATS as f (f.key)}
				<div><dt title={f.hint}>{f.label}</dt><dd>{fmt(f, row)}</dd></div>
			{/each}
		</dl>
		<p class="ranks">
			Rank {row.ranks.composite} of {rows.length} overall.
			{#each SCORES.slice(1) as f (f.key)}{f.label} #{row.ranks[f.key]}. {/each}
		</p>
		{#if row.flagged.length}
			<p class="flag-head">Flagged as AI-ish</p>
			<ul>
				{#each row.flagged as line, i (i)}<li>{line}</li>{/each}
			</ul>
		{/if}
	</div>
{/snippet}

<main class="dash">
	<SiteNavSpace />
	<header class="intro">
		<p class="eyebrow">Story health</p>
		<h1>Dashboard</h1>
		<p class="lede">
			The book scores <strong style:color={tone(book.composite)}>{book.composite}</strong> (median {book.median}, range {book.spread[0]}–{book.spread[1]}) on story alone — pacing, entertainment, balance, completeness.
			Weakest measure: <strong>{BY_KEY.get(book.weakest)?.label}</strong> at {book.metrics[book.weakest as Metric]}.
			Human and accuracy stay on the board and do not enter the score.
		</p>
		<p class="totals">
			{book.episodes} episodes
			{#each TOTALS as [k, label] (k)}
				· {(book.totals as Record<string, number>)[k].toLocaleString('en-US')} {label}
			{/each}
		</p>
	</header>

	<section class="board quality" aria-label="Quality">
		<p class="board-k">Quality</p>
		<article class="card hero">
			<span class="card-label">Score</span>
			<strong class="big" style:color={tone(book.composite)}>{book.composite}</strong>
			<span class="card-note">A {book.grades.A} · B {book.grades.B} · C {book.grades.C}{#if book.grades.ungraded} · ungraded {book.grades.ungraded}{/if}</span>
		</article>
		{#each STORY_SCORES.slice(1) as f (f.key)}
			{@const v = book.metrics[f.key as Metric]}
			<button type="button" class="card" class:on={sortKey === f.key} title={f.hint} onclick={() => sortBy(f.key)}>
				<span class="card-label">{f.label}</span>
				<strong style:color={tone(v)}>{v}</strong>
				<span class="bar"><span style:width="{v}%" style:background={tone(v)}></span></span>
			</button>
		{/each}
		{#each CRAFT_SCORES as f (f.key)}
			{@const v = book.metrics[f.key as Metric]}
			<button type="button" class="card craft" class:on={sortKey === f.key} title={f.hint} onclick={() => sortBy(f.key)}>
				<span class="card-label">{f.label}</span>
				<strong>{v}</strong>
				<span class="card-note">not in score</span>
			</button>
		{/each}
	</section>

	<section class="board facts" aria-label="Facts">
		<p class="board-k">Facts</p>
		{#each CORE_STATS as f (f.key)}
			{@const raw = f.key === 'dialoguePct'
				? Math.round((100 * book.totals.dialogue) / Math.max(1, book.totals.words))
				: f.key === 'minutes'
					? Math.max(1, Math.round(book.totals.words / 230))
					: f.key === 'speakers'
						? Math.round(book.totals.speakers / Math.max(1, book.episodes))
						: (book.totals as Record<string, number>)[f.key]}
			<button type="button" class="card" class:on={sortKey === f.key} title={f.hint} onclick={() => sortBy(f.key)}>
				<span class="card-label">{f.key === 'speakers' ? 'Avg speakers' : f.label}</span>
				<strong>{raw == null ? '–' : `${raw.toLocaleString('en-US')}${f.unit ?? ''}`}</strong>
			</button>
		{/each}
	</section>

	<div class="charts">
		<StoryChart rows={reading} highlightId={chartHover ?? open} onhover={(id) => (chartHover = id)} />
		{#if view === 'story'}
			<MysteryChart selectedId={selectedBox} onselect={(id) => (selectedBox = id)} />
		{/if}
	</div>

	<section class="controls" aria-label="Filters">
		<div class="row">
			<input class="search" type="search" placeholder="Search episodes" bind:value={query} />
			<select bind:value={arc} aria-label="Arc">
				<option value="all">All arcs</option>
				{#each book.arcs as a (a.id)}<option value={a.id}>{a.title} · {a.composite}</option>{/each}
			</select>
			<div class="chips" role="group" aria-label="Grade">
				{#each ['A', 'B', 'C', 'none'] as const as g (g)}
					<button type="button" class="chip" class:on={grades[g]} onclick={() => (grades[g] = !grades[g])}>{g === 'none' ? 'Ungraded' : g}</button>
				{/each}
			</div>
			<span class="spacer"></span>
			<div class="chips" role="group" aria-label="View">
				<button type="button" class={{ chip: true, on: view === 'table' }} onclick={() => setView('table')}>
					<span class="material-symbols-outlined" aria-hidden="true">table_rows</span>Table
				</button>
				<button type="button" class={{ chip: true, on: view === 'grid' }} onclick={() => setView('grid')}>
					<span class="material-symbols-outlined" aria-hidden="true">grid_view</span>Grid
				</button>
				<button type="button" class={{ chip: true, on: view === 'story' }} onclick={() => setView('story')}>
					<span class="material-symbols-outlined" aria-hidden="true">auto_stories</span>Story
				</button>
			</div>
		</div>
		<div class="row">
			<label class="sort">
				Sort
				<select bind:value={sortKey}>
					<option value="n">Reading order</option>
					<option value="title">Title</option>
					<optgroup label="Quality">{#each SCORES as f (f.key)}<option value={f.key}>{f.label}</option>{/each}</optgroup>
					<optgroup label="Facts">{#each STATS as f (f.key)}<option value={f.key}>{f.label}</option>{/each}</optgroup>
				</select>
			</label>
			<button type="button" class="chip" onclick={() => (dir = dir === -1 ? 1 : -1)}>{dir === -1 ? 'High → low' : 'Low → high'}</button>
			{#if view === 'table'}
				<div class="chips" role="group" aria-label="Columns">
					{#each [['scores', 'Quality'], ['stats', 'Facts'], ['all', 'All']] as const as [k, label] (k)}
						<button type="button" class="chip" class:on={columns === k} onclick={() => (columns = k)}>{label}</button>
					{/each}
				</div>
			{/if}
			<button type="button" class="chip" onclick={addRange}>
				<span class="material-symbols-outlined" aria-hidden="true">filter_alt</span>Add filter
			</button>
			<span class="spacer"></span>
			<span class="count">{sorted.length} of {rows.length} · avg {visibleAvg}</span>
			<button type="button" class="chip ghost" onclick={reset}>Reset</button>
		</div>
		{#each ranges as r (r.id)}
			<div class="row range">
				<select bind:value={r.key} aria-label="Filter metric">
					<optgroup label="Quality">{#each SCORES as f (f.key)}<option value={f.key}>{f.label}</option>{/each}</optgroup>
					<optgroup label="Facts">{#each STATS as f (f.key)}<option value={f.key}>{f.label}</option>{/each}</optgroup>
				</select>
				<input type="number" placeholder="min" value={r.min ?? ''} oninput={(e) => (r.min = numberOrNull(e.currentTarget.value))} />
				<span>to</span>
				<input type="number" placeholder="max" value={r.max ?? ''} oninput={(e) => (r.max = numberOrNull(e.currentTarget.value))} />
				<button type="button" class="chip ghost" onclick={() => removeRange(r.id)} aria-label="Remove filter">
					<span class="material-symbols-outlined" aria-hidden="true">close</span>
				</button>
			</div>
		{/each}
	</section>

	{#if view === 'story'}
		<StoryView rows={reading} openId={open} {selectedBox} onopen={(id) => (open = id)} onbox={(id) => (selectedBox = id)} thumbSrc={thumbOf} {readHref} {tone} />
	{:else if view === 'table'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th class="sticky"><button type="button" onclick={() => sortBy('n')}>#{arrow('n')}</button></th>
						<th class="sticky ep-col"><button type="button" onclick={() => sortBy('title')}>Episode{arrow('title')}</button></th>
						{#each shownFields as f (f.key)}
							<th title={f.hint}><button type="button" onclick={() => sortBy(f.key)}>{f.short ?? f.label}{arrow(f.key)}</button></th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each sorted as row (row.id)}
						<tr class:open={open === row.id} onclick={() => (open = open === row.id ? null : row.id)}>
							<td class="num sticky">{row.n}</td>
							<td class="ep sticky ep-col">
								<span class="ep-thumb">{@render thumb(row, '6rem')}</span>
								<span class="ep-text">
									<a href={readHref(row)} onclick={(e) => e.stopPropagation()}>{row.title}</a>
									<span class="ko">{row.ko}{row.year ? ` · ${row.year}` : ''}</span>
								</span>
								{#if row.grade}<span class="grade g-{row.grade}">{row.grade}</span>{/if}
							</td>
							{#each shownFields as f (f.key)}
								<td class:score={f.kind === 'score'} class:sorted={sortKey === f.key} style:color={f.kind === 'score' ? tone(f.get(row)) : undefined}>{fmt(f, row)}</td>
							{/each}
						</tr>
						{#if open === row.id}
							<tr class="detail"><td colspan={shownFields.length + 2}>{@render detail(row)}</td></tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	{:else if view === 'grid'}
		<ul class="grid">
			{#each sorted as row (row.id)}
				<li class="tile" class:open={open === row.id}>
					{@render thumb(row, '(max-width: 640px) 90vw, 18rem')}
					<span class="tile-score" style:background={tone(row.composite)}>{row.composite}</span>
					{#if row.grade}<span class="tile-grade g-{row.grade}">{row.grade}</span>{/if}
					<div class="tile-body">
						<div class="tile-head">
							<span class="num">{row.n}</span>
							<a href={readHref(row)}>{row.title}</a>
						</div>
						<p class="tile-meta">
							{row.arc}{row.year ? ` · ${row.year}` : ''} · {Number(row.stats.words).toLocaleString('en-US')} words · {row.stats.minutes} min
						</p>
						<div class="core">
							{#each gridFields as f (f.key)}
								<span class={{ sorted: sortKey === f.key }} title={f.hint}>
									<em>{f.short ?? f.label}</em>
									{fmt(f, row)}
								</span>
							{/each}
						</div>
						<button type="button" class="more" onclick={() => (open = open === row.id ? null : row.id)}>
							{open === row.id ? 'Close' : 'Expand'}
						</button>
						{#if open === row.id}{@render detail(row)}{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	{#if !sorted.length}<p class="empty">No episode matches these filters.</p>{/if}

	<footer class="notes">
		<p><strong>Quality.</strong> Pacing, entertainment, balance and completeness enter the score. Human and accuracy are shown and not counted.</p>
		{#each SCORES as f (f.key)}
			<p><strong>{f.label}.</strong> {f.hint}</p>
		{/each}
		<p><strong>Facts.</strong> Words, scenes, speakers, stills and the rest are counts. A short episode can still score well; a long one can still fail.</p>
		<p>Updated {data.generated}. Every score is curved (raw<sup>{data.curve}</sup>), so the ranks spread instead of crowding the top.</p>
	</footer>
</main>

<style>
	.dash {
		max-width: 1320px;
		margin: 0 auto;
		padding: 0 1.25rem 4rem;
		color: var(--fg);
	}
	.intro { margin: 1.5rem 0 1.25rem; }
	.eyebrow {
		margin: 0;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-size: 0.72rem;
		color: var(--gold);
	}
	h1 { margin: 0.2rem 0; font-size: 2rem; font-weight: 560; }
	.lede { max-width: 48rem; color: var(--fg-dim); line-height: 1.45; margin: 0.4rem 0; }
	.lede strong { color: var(--fg); }
	.totals { color: var(--fg-faint); font-size: 0.82rem; font-variant-numeric: tabular-nums; margin: 0; }

	.board {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(7.25rem, 1fr));
		gap: 0.6rem;
	}
	.board.facts { margin-top: 0.7rem; }
	.board-k {
		grid-column: 1 / -1;
		margin: 0 0 0.05rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-size: 0.68rem;
		color: var(--fg-faint);
	}
	.card {
		background: var(--panel);
		border: 1px solid transparent;
		border-radius: var(--radius);
		padding: 0.75rem 0.8rem 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		text-align: left;
		color: inherit;
		font: inherit;
	}
	.facts .card {
		background: transparent;
		border-color: var(--hairline);
	}
	.facts .card strong {
		color: var(--fg);
		font-weight: 520;
	}
	.card.craft {
		background: transparent;
		border-color: var(--hairline);
	}
	.card.craft strong { color: var(--fg); font-weight: 520; }
	button.card { cursor: pointer; }
	.card.on { border-color: var(--gold); }
	.card strong { font-size: 1.45rem; font-variant-numeric: tabular-nums; }
	.hero .big { font-size: 2.4rem; }
	.card-label { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-faint); }
	.card-note { color: var(--fg-dim); font-size: 0.8rem; }
	.card .bar { flex: none; margin-top: auto; }
	.bar { display: block; flex: 1; height: 4px; background: var(--hairline); border-radius: 2px; overflow: hidden; }
	.bar span { display: block; height: 100%; border-radius: 2px; }

	.charts { display: flex; flex-direction: column; gap: 1.1rem; margin: 0.4rem 0 0.2rem; }
	.controls { margin: 1.2rem 0 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; }
	.row { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; }
	.spacer { flex: 1; }
	.count { color: var(--fg-faint); font-size: 0.8rem; font-variant-numeric: tabular-nums; }
	input,
	select {
		background: var(--panel);
		color: var(--fg);
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		padding: 0.35rem 0.55rem;
		font: inherit;
		font-size: 0.84rem;
	}
	.search { min-width: 14rem; }
	.range input { width: 6rem; }
	.range span { color: var(--fg-faint); font-size: 0.8rem; }
	.sort { display: flex; gap: 0.4rem; align-items: center; color: var(--fg-faint); font-size: 0.8rem; }
	.chips { display: flex; gap: 0.3rem; flex-wrap: wrap; }
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		border: 0;
		background: var(--panel);
		color: var(--fg-dim);
		border-radius: var(--radius-pill);
		padding: 0.35rem 0.75rem;
		cursor: pointer;
		font: inherit;
		font-size: 0.8rem;
	}
	.chip .material-symbols-outlined { font-size: 1rem; }
	.chip.on { background: var(--gold); color: var(--on-gold); }
	.chip.ghost { background: none; color: var(--fg-faint); }

	.table-wrap { overflow-x: auto; border-radius: var(--radius); }
	table { width: 100%; border-collapse: collapse; font-size: 0.82rem; font-variant-numeric: tabular-nums; }
	th,
	td { text-align: right; padding: 0.4rem 0.45rem; border-bottom: 1px solid var(--hairline); white-space: nowrap; background: var(--bg); }
	th { position: sticky; top: 0; z-index: 2; }
	.sticky { position: sticky; left: 0; z-index: 1; }
	th.sticky { z-index: 3; }
	.ep-col { left: 2.4rem; text-align: left; min-width: 15rem; }
	th button {
		border: 0;
		background: none;
		color: var(--fg-faint);
		font: inherit;
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
		padding: 0;
	}
	tbody tr { cursor: pointer; }
	tbody tr:hover td { background: var(--panel); }
	td.sorted { background: color-mix(in srgb, var(--panel) 55%, var(--bg)); }
	td.num, .num { color: var(--fg-faint); }
	.ep { display: flex; align-items: center; gap: 0.6rem; white-space: normal; }
	.ep-thumb { width: 5.5rem; flex: none; }
	.ep-text { display: flex; flex-direction: column; min-width: 0; }
	.ep a, .tile-head a { color: var(--fg-strong); text-decoration: none; }
	.ep a:hover, .tile-head a:hover { text-decoration: underline; }
	.ko { color: var(--fg-faint); font-size: 0.74rem; }
	.grade { margin-left: auto; font-size: 0.72rem; font-weight: 650; }
	.g-A { color: #5fae7a; }
	.g-B { color: #7f9bb3; }
	.g-C { color: #d4a03e; }
	td.score { font-weight: 600; }
	.thumb-link { display: block; }
	.detail td { text-align: left; white-space: normal; background: var(--panel-sunken); cursor: default; }

	.detail-body { color: var(--fg-dim); font-size: 0.8rem; line-height: 1.4; }
	.detail-body dl {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: 0.25rem 1rem;
		margin: 0.3rem 0 0.6rem;
	}
	.detail-body dl div { display: flex; justify-content: space-between; gap: 0.5rem; border-bottom: 1px dotted var(--hairline); }
	.detail-body dt { color: var(--fg-faint); }
	.detail-body dd { margin: 0; color: var(--fg); font-variant-numeric: tabular-nums; }
	.ranks { margin: 0.3rem 0; }
	.flag-head { margin: 0.5rem 0 0.2rem; color: var(--fg-faint); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.68rem; }
	.detail-body ul { margin: 0; padding-left: 1.1rem; }

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 0.9rem;
	}
	.tile { position: relative; background: var(--panel); border-radius: var(--widget-radius); overflow: hidden; display: flex; flex-direction: column; }
	.tile.open { grid-column: 1 / -1; }
	.tile.open .thumb-link { max-width: 24rem; }
	.tile-score {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 4;
		color: #111;
		font-weight: 700;
		font-size: 0.95rem;
		padding: 0.15rem 0.5rem;
		border-radius: var(--radius-pill);
		font-variant-numeric: tabular-nums;
	}
	.tile-grade {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 4;
		background: rgba(0, 0, 0, 0.6);
		font-weight: 700;
		font-size: 0.8rem;
		padding: 0.15rem 0.5rem;
		border-radius: var(--radius-pill);
	}
	.tile-body { padding: 0.65rem 0.8rem 0.75rem; display: flex; flex-direction: column; gap: 0.35rem; }
	.tile-head { display: flex; gap: 0.45rem; align-items: baseline; font-size: 0.95rem; }
	.tile-meta { margin: 0; color: var(--fg-faint); font-size: 0.74rem; }
	.core {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.75rem;
	}
	.core span {
		display: flex;
		gap: 0.3rem;
		font-size: 0.74rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg);
	}
	.core em {
		font-style: normal;
		color: var(--fg-faint);
	}
	.core .sorted em { color: var(--gold); }
	.more { align-self: flex-start; border: 0; background: none; color: var(--fg-faint); font: inherit; font-size: 0.74rem; cursor: pointer; padding: 0; text-decoration: underline; }

	.empty { color: var(--fg-faint); text-align: center; margin: 2rem 0; }
	.notes { margin-top: 1.5rem; color: var(--fg-faint); font-size: 0.8rem; }
	.notes p { margin: 0.25rem 0; }
	.notes strong { color: var(--fg-dim); }
</style>
