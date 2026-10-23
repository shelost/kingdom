<script lang="ts">
	import Avatar from '$lib/components/Avatar.svelte';
	import RowThumb from '$lib/components/RowThumb.svelte';
	import {
		aPlotOf,
		bPlotOf,
		boxColor,
		boxesOf,
		introducedPeople,
		storyOf,
		type EpisodeStory,
		type MysteryBox
	} from '$lib/episodeStory';

	type StoryRow = {
		n: number;
		id: string;
		arc: string;
		title: string;
		ko: string;
		year: string;
		grade: 'A' | 'B' | 'C' | null;
		composite: number;
		stats: Record<string, number | boolean | null>;
	};

	let {
		rows,
		openId = null,
		selectedBox = null,
		onopen,
		onbox,
		thumbSrc,
		readHref,
		tone
	}: {
		rows: StoryRow[];
		openId?: string | null;
		selectedBox?: string | null;
		onopen: (id: string | null) => void;
		onbox?: (id: string | null) => void;
		thumbSrc: (row: StoryRow) => string | undefined;
		readHref: (row: StoryRow) => string;
		tone: (n: number | null) => string;
	} = $props();

	const ACTS: { key: keyof EpisodeStory; label: string }[] = [
		{ key: 'conflict', label: 'Conflict' },
		{ key: 'development', label: 'Development' },
		{ key: 'climax', label: 'Climax' },
		{ key: 'resolution', label: 'Resolution' }
	];

	function wordsOf(row: StoryRow): string {
		const v = row.stats.words;
		return typeof v === 'number' ? v.toLocaleString('en-US') : '–';
	}

	function yearOf(row: StoryRow): number | null {
		const n = Number.parseInt(row.year, 10);
		return Number.isFinite(n) ? n : null;
	}

	function hot(box: MysteryBox): boolean {
		return !selectedBox || selectedBox === box.id;
	}

	function pickBox(e: MouseEvent, id: string) {
		e.stopPropagation();
		onbox?.(selectedBox === id ? null : id);
	}
</script>

<div class="wrap">
	<table>
		<thead>
			<tr>
				<th class="n">#</th>
				<th class="still">Still</th>
				<th class="ep">Episode</th>
				<th>Story</th>
				<th>Cast</th>
				<th>Planted</th>
				<th>Paid</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.id)}
				{@const note = storyOf(row.id)}
				{@const a = aPlotOf(note)}
				{@const b = bPlotOf(note)}
				{@const people = introducedPeople(note)}
				{@const shown = people.slice(0, 8)}
				{@const extra = people.length - shown.length}
				{@const planted = boxesOf(note?.plant)}
				{@const paid = boxesOf(note?.pay)}
				{@const held = boxesOf(note?.hold)}
				{@const acts = ACTS.filter((act) => note?.[act.key])}
				{@const match = selectedBox && (note?.plant.includes(selectedBox) || note?.pay.includes(selectedBox) || note?.hold.includes(selectedBox))}
				<tr class={{ open: openId === row.id, match: !!match, dim: !!(selectedBox && !match) }} onclick={() => onopen(openId === row.id ? null : row.id)}>
					<td class="n">
						<span class="num">{row.n}</span>
						<span class="score" style:color={tone(row.composite)}>{row.composite}</span>
						{#if row.grade}<span class={['grade', `g-${row.grade}`]}>{row.grade}</span>{/if}
					</td>
					<td class="still">
						<a class="thumb" href={readHref(row)} onclick={(e) => e.stopPropagation()} aria-label="Read {row.title}">
							<RowThumb src={thumbSrc(row)} sizes="10rem" fallback={row.title.charAt(0)} />
						</a>
					</td>
					<td class="ep">
						<a class="title" href={readHref(row)} onclick={(e) => e.stopPropagation()}>{row.title}</a>
						<p class="meta">{row.ko}{row.year ? ` · ${row.year}` : ''} · {row.arc} · {wordsOf(row)} words</p>
						{#if a}<p class="a">{a}</p>{/if}
						{#if b}<p class="b"><span>B</span> {b}</p>{/if}
						{#if note?.themes.length}
							<div class="pills">
								{#each note.themes as th (th.id)}
									<span class="pill theme" title={th.note}>{th.label}</span>
								{/each}
							</div>
						{/if}
					</td>
					<td class="acts">
						{#each acts as act (act.key)}
							<div>
								<span class="act-k">{act.label}</span>
								<p>{note?.[act.key]}</p>
							</div>
						{/each}
					</td>
					<td class="cast">
						{#if shown.length}
							<div class="faces">
								{#each shown as p (p.id)}
									<Avatar person={p} year={yearOf(row)} size="1.7rem" />
								{/each}
								{#if extra > 0}<span class="more">+{extra}</span>{/if}
							</div>
						{/if}
					</td>
					<td class="boxes">
						{#each planted as box (box.id)}
							<button
								type="button"
								class={['box', 'plant', { dim: !hot(box) }]}
								style:--swatch={boxColor(box.id)}
								title={box.about}
								onclick={(e) => pickBox(e, box.id)}
							>
								<strong>{box.head}</strong>
								<span>{box.question}</span>
							</button>
						{/each}
						{#each held as box (box.id)}
							{#if !planted.some((p) => p.id === box.id) && !paid.some((p) => p.id === box.id)}
								<button
									type="button"
									class={['box', 'held', { dim: !hot(box) }]}
									style:--swatch={boxColor(box.id)}
									title={box.about}
									onclick={(e) => pickBox(e, box.id)}
								>
									<strong>{box.head}</strong>
									<span>{box.question}</span>
								</button>
							{/if}
						{/each}
					</td>
					<td class="boxes">
						{#each paid as box (box.id)}
							<button
								type="button"
								class={['box', 'paid', { dim: !hot(box) }]}
								style:--swatch={boxColor(box.id)}
								title={box.about}
								onclick={(e) => pickBox(e, box.id)}
							>
								<strong>{box.head}</strong>
								<span>{box.question}</span>
							</button>
						{/each}
					</td>
				</tr>
				{#if openId === row.id && (note?.want || note?.problem)}
					<tr class="detail">
						<td colspan="7">
							{#if note?.want}<p><strong>Want.</strong> {note.want}</p>{/if}
							{#if note?.problem}<p><strong>Problem.</strong> {note.problem}</p>{/if}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

<style>
	.wrap { overflow-x: auto; border-radius: var(--widget-radius); }
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}
	th {
		position: sticky;
		top: 0;
		z-index: 2;
		text-align: left;
		padding: 0.45rem 0.55rem;
		background: var(--bg);
		color: var(--fg-faint);
		font-size: 0.64rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 550;
		border-bottom: 1px solid var(--hairline);
		white-space: nowrap;
	}
	td {
		padding: 0.7rem 0.55rem;
		border-bottom: 1px solid var(--hairline);
		vertical-align: top;
		background: var(--bg);
	}
	tbody tr { cursor: pointer; }
	tbody tr:hover td { background: var(--panel); }
	tr.open td { background: color-mix(in srgb, var(--panel) 82%, var(--panel-sunken)); }
	tr.dim td { opacity: 0.38; }
	tr.match td { background: color-mix(in srgb, var(--gold) 8%, var(--bg)); }
	.n { width: 3.2rem; text-align: right; }
	.n .num, .n .score, .n .grade { display: block; }
	.num { color: var(--fg-faint); font-variant-numeric: tabular-nums; font-size: 0.72rem; }
	.score { font-weight: 650; font-variant-numeric: tabular-nums; font-size: 1rem; }
	.grade { font-size: 0.68rem; font-weight: 650; }
	.g-A { color: #5fae7a; }
	.g-B { color: #7f9bb3; }
	.g-C { color: #d4a03e; }
	.still { width: 9.5rem; }
	.thumb { display: block; width: 9.2rem; pointer-events: auto; }
	.ep { min-width: 14rem; max-width: 20rem; }
	.title {
		color: var(--fg-strong);
		text-decoration: none;
		font-size: 1rem;
		font-weight: 560;
	}
	.title:hover { text-decoration: underline; }
	.meta { margin: 0.15rem 0 0.35rem; color: var(--fg-faint); font-size: 0.72rem; }
	.a { margin: 0; color: var(--fg); line-height: 1.35; }
	.b { margin: 0.2rem 0 0; color: var(--fg-dim); font-size: 0.8rem; line-height: 1.35; }
	.b span {
		color: var(--gold);
		font-size: 0.64rem;
		letter-spacing: 0.08em;
		font-weight: 650;
		margin-right: 0.25rem;
	}
	.pills { display: flex; flex-wrap: wrap; gap: 0.28rem; margin-top: 0.4rem; }
	.pill {
		border-radius: var(--radius-pill);
		padding: 0.1rem 0.45rem;
		font-size: 0.68rem;
		background: color-mix(in srgb, var(--gold) 16%, var(--panel-sunken));
		color: var(--fg-strong);
	}
	.acts { min-width: 16rem; }
	.acts div + div { margin-top: 0.4rem; }
	.act-k {
		display: block;
		color: var(--fg-faint);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 0.1rem;
	}
	.acts p { margin: 0; color: var(--fg-dim); font-size: 0.78rem; line-height: 1.35; }
	.cast { width: 8.5rem; }
	.faces { display: flex; flex-wrap: wrap; gap: 0.22rem; align-items: center; }
	.more { color: var(--fg-faint); font-size: 0.7rem; }
	.boxes { min-width: 11.5rem; }
	.box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.08rem;
		width: 100%;
		margin: 0 0 0.35rem;
		border: 0;
		border-left: 2px solid var(--swatch);
		background: color-mix(in srgb, var(--swatch) 12%, var(--panel-sunken));
		color: inherit;
		font: inherit;
		text-align: left;
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: 0.28rem 0.45rem 0.32rem 0.5rem;
		cursor: pointer;
	}
	.box.paid { background: color-mix(in srgb, #5fae7a 12%, var(--panel-sunken)); }
	.box.held { background: transparent; border-left-style: dashed; }
	.box.dim { opacity: 0.28; }
	.box strong { font-size: 0.74rem; font-weight: 560; color: var(--fg-strong); }
	.box span { font-size: 0.7rem; color: var(--fg-dim); line-height: 1.3; }
	.detail td {
		background: var(--panel-sunken);
		color: var(--fg-dim);
		font-size: 0.8rem;
		cursor: default;
	}
	.detail p { margin: 0.2rem 0; }
	.detail strong { color: var(--fg-faint); font-weight: 550; }
	@media (max-width: 900px) {
		.still { width: 6.5rem; }
		.thumb { width: 6.2rem; }
		.acts, .ep { min-width: 12rem; }
	}
</style>
