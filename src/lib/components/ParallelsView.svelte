<script lang="ts">
	import { MOVE_LABEL, RHYMES, SCRIPTURE_TYPES, TITLE_TYPES } from '$lib/parallels';

	type Tab = 'titles' | 'book' | 'scripture';

	let tab = $state<Tab>('titles');
	let query = $state('');

	const q = $derived(query.trim().toLowerCase());

	function hit(parts: string[]): boolean {
		if (!q) return true;
		return parts.join(' ').toLowerCase().includes(q);
	}

	const titles = $derived(TITLE_TYPES.filter((row) => hit([row.year, row.figure, row.ko, row.represents, row.note])));
	const rhymes = $derived(RHYMES.filter((row) => hit([row.earlier, row.later, row.pattern, MOVE_LABEL[row.move]])));
	const scripture = $derived(
		SCRIPTURE_TYPES.filter((row) => hit([row.figure, row.type, row.pattern, MOVE_LABEL[row.move]]))
	);

	const tabs: { id: Tab; label: string; n: number }[] = [
		{ id: 'titles', label: 'Title cards', n: TITLE_TYPES.length },
		{ id: 'book', label: 'In the book', n: RHYMES.length },
		{ id: 'scripture', label: 'Scripture', n: SCRIPTURE_TYPES.length }
	];

	const shown = $derived(tab === 'titles' ? titles.length : tab === 'book' ? rhymes.length : scripture.length);
	const total = $derived(tab === 'titles' ? TITLE_TYPES.length : tab === 'book' ? RHYMES.length : SCRIPTURE_TYPES.length);
</script>

<section class="types" aria-label="Typology">
	<header>
		<p class="eyebrow">Running list</p>
		<h1>Types</h1>
		<p class="lede">
			Title-card flashbacks, the figures who repeat each other inside this book, and the scripture they rhyme with.
			Add a row in <code>src/lib/parallels.ts</code>. Escalation means the later one is larger. Contrast is where they split. Pattern is the same job, done again.
		</p>
	</header>

	<div class="bar">
		<div class="chips" role="group" aria-label="Which list">
			{#each tabs as t (t.id)}
				<button type="button" class={{ chip: true, on: tab === t.id }} onclick={() => (tab = t.id)}>
					{t.label}<span class="n">{t.n}</span>
				</button>
			{/each}
		</div>
		<input class="search" type="search" placeholder="Search the list" bind:value={query} />
		<span class="count">{shown} of {total}</span>
	</div>

	{#if tab === 'titles'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>When</th>
						<th>Figure</th>
						<th>Carries</th>
						<th>The beat</th>
					</tr>
				</thead>
				<tbody>
					{#each titles as row (`${row.figure}-${row.year}`)}
						<tr>
							<td class="when">{row.year}</td>
							<td class="who">{row.figure}<span class="ko">{row.ko}</span></td>
							<td>{row.represents}</td>
							<td class="note">{row.note}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if tab === 'book'}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Earlier</th>
						<th>Later</th>
						<th>Move</th>
						<th>What repeats</th>
					</tr>
				</thead>
				<tbody>
					{#each rhymes as row (`${row.earlier}-${row.later}`)}
						<tr>
							<td class="who">{row.earlier}</td>
							<td class="who">{row.later}</td>
							<td><span class="move {row.move}">{MOVE_LABEL[row.move]}</span></td>
							<td class="note">{row.pattern}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>In this book</th>
						<th>Scripture</th>
						<th>Move</th>
						<th>The rhyme</th>
					</tr>
				</thead>
				<tbody>
					{#each scripture as row (`${row.figure}-${row.type}`)}
						<tr>
							<td class="who">{row.figure}</td>
							<td class="who">{row.type}</td>
							<td><span class="move {row.move}">{MOVE_LABEL[row.move]}</span></td>
							<td class="note">{row.pattern}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if shown === 0}
		<p class="empty">Nothing in this list matches.</p>
	{/if}
</section>

<style>
	.types {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.eyebrow {
		margin: 0;
		color: var(--fg-faint);
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0.2rem 0 0;
		font-size: 1.8rem;
	}

	.lede {
		max-width: 46rem;
		margin: 0.4rem 0 0;
		color: var(--fg-dim);
		line-height: 1.45;
	}

	code {
		font-size: 0.85em;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.chip {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
		border: 0;
		background: var(--panel);
		color: var(--fg-dim);
		border-radius: var(--radius-pill);
		padding: 0.35rem 0.75rem;
		cursor: pointer;
	}

	.chip.on {
		background: var(--fg);
		color: var(--bg);
	}

	.n {
		opacity: 0.7;
		font-variant-numeric: tabular-nums;
	}

	.search {
		min-width: 12rem;
		flex: 1;
		border: 0;
		background: var(--panel);
		color: inherit;
		border-radius: var(--radius-pill);
		padding: 0.4rem 0.8rem;
	}

	.count {
		color: var(--fg-faint);
		font-size: 0.8rem;
		font-variant-numeric: tabular-nums;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.92rem;
	}

	th {
		padding: 0.45rem 0.7rem;
		color: var(--fg-faint);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-align: left;
		text-transform: uppercase;
		border-bottom: 1px solid var(--line, rgb(255 255 255 / 12%));
	}

	td {
		padding: 0.7rem;
		vertical-align: top;
		border-bottom: 1px solid var(--line, rgb(255 255 255 / 8%));
	}

	.when {
		white-space: nowrap;
		color: var(--fg-dim);
		font-variant-numeric: tabular-nums;
	}

	.who {
		font-weight: 600;
		min-width: 9rem;
	}

	.ko {
		display: block;
		margin-top: 0.15rem;
		color: var(--fg-faint);
		font-weight: 400;
	}

	.note {
		max-width: 40rem;
		color: var(--fg-dim);
		line-height: 1.45;
	}

	.move {
		display: inline-block;
		border-radius: var(--radius-pill);
		padding: 0.1rem 0.5rem;
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.escalation {
		background: rgb(196 30 58 / 18%);
		color: #e07080;
	}

	.contrast {
		background: rgb(42 95 184 / 22%);
		color: #8eb4ef;
	}

	.pattern {
		background: rgb(244 241 232 / 10%);
		color: var(--fg-dim);
	}

	.empty {
		margin: 0;
		color: var(--fg-faint);
	}
</style>
