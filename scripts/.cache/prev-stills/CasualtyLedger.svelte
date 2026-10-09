<script lang="ts">
	import type { Block } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { claimRank, countUp, ledgerSources, readLedger, shownClaim } from '$lib/ledger';
	import Material from './Material.svelte';
	import RecordCite from './RecordCite.svelte';

	type Ledger = Extract<Block, { kind: 'ledger' }>;

	let { block }: { block: Ledger } = $props();

	/** Every source cited in any row, in order of first appearance — the columns. */
	let sources = $derived(ledgerSources(block));
	let rows = $derived(readLedger(block, sources));

	let title = $derived(reading.lang === 'ko' && block.ko ? block.ko : block.title);
	let progress = $state(0);
	let inked = $state(false);

	const count = countUp(
		(t) => (progress = t),
		() => (inked = true)
	);
</script>

<figure class="ledger" class:inked {@attach count}>
	<Material kind="paper" />
	{#if title}<figcaption class="title">{title}</figcaption>{/if}
	<div class="scroll">
		<table>
			<thead>
				<tr>
					<th scope="col" class="corner"><span class="sr">{reading.lang === 'ko' ? '항목' : 'Claim'}</span></th>
					{#each sources as s, i (s)}
						<th scope="col"><RecordCite source={s} {inked} delay={i * 140} compact nation /></th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as r, ri (ri)}
					<tr class:disputed={r.disputed}>
						<th scope="row">
							<span class="label">{reading.lang === 'ko' && r.row.ko ? r.row.ko : r.row.label}</span>
							{#if reading.lang === 'both' && r.row.ko}<span class="label-ko" lang="ko">{r.row.ko}</span>{/if}
						</th>
						{#each r.cells as c, ci (ci)}
							{@const rank = claimRank(r, c)}
							<td class:hi={rank === 'hi'} class:lo={rank === 'lo'}>
								{#if c}
									<span class="value" aria-label={c.raw}>{shownClaim(c, progress)}</span>
									{#if c.note}<span class="note">{c.note}</span>{/if}
								{:else}
									<span class="none" aria-label="not recorded">—</span>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	{#if rows.some((r) => r.disputed)}
		<p class="legend">
			<span class="key hi"></span>{reading.lang === 'ko' ? '가장 큰 수' : 'highest claim'}
			<span class="key lo"></span>{reading.lang === 'ko' ? '가장 작은 수' : 'lowest claim'}
		</p>
	{/if}
</figure>

<style>
	.ledger {
		--text-cite: color-mix(in srgb, var(--quote) 70%, var(--fg-strong));
		--text-faint: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
		--hi: #c8442c;
		--lo: #3e79e4;
		position: relative;
		isolation: isolate;
		margin: 1.8rem 0;
		padding: 0.9rem 1rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--quote) 22%, transparent);
		border-radius: var(--radius);
		background: color-mix(in srgb, var(--quote) 6%, transparent);
	}

	.title {
		margin-bottom: 0.6rem;
		font-family: var(--serif);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-cite);
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.84rem;
	}

	th,
	td {
		padding: 0.5rem 0.7rem;
		text-align: left;
		vertical-align: top;
		border-bottom: 1px solid color-mix(in srgb, var(--quote) 16%, transparent);
	}

	thead th {
		vertical-align: bottom;
		border-bottom-color: color-mix(in srgb, var(--quote) 34%, transparent);
	}

	tbody th {
		font-weight: 600;
		color: var(--fg-strong);
	}

	.label,
	.label-ko {
		display: block;
	}

	.label-ko {
		font-size: 0.74rem;
		font-weight: 500;
		color: var(--text-faint);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	td {
		font-variant-numeric: tabular-nums;
		color: var(--fg);
	}

	.value {
		display: block;
		font-family: var(--serif);
		font-size: 1.05rem;
		font-weight: 700;
		white-space: nowrap;
	}

	.note {
		display: block;
		margin-top: 0.1rem;
		font-size: 0.68rem;
		line-height: 1.35;
		color: var(--text-faint);
	}

	.none {
		color: var(--fg-faint);
	}

	/* Where the records disagree, the row is flagged and the extremes coloured. */
	tr.disputed th[scope='row'] {
		box-shadow: inset 3px 0 0 var(--gold);
	}

	td.hi .value {
		color: color-mix(in srgb, var(--hi) 80%, var(--fg-strong));
	}

	td.lo .value {
		color: color-mix(in srgb, var(--lo) 80%, var(--fg-strong));
	}

	td.hi {
		background: color-mix(in srgb, var(--hi) 8%, transparent);
	}

	td.lo {
		background: color-mix(in srgb, var(--lo) 8%, transparent);
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.6rem 0 0;
		font-size: 0.66rem;
		color: var(--text-faint);
	}

	.key {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 2px;
	}

	.key.lo {
		margin-left: 0.6rem;
		background: var(--lo);
	}

	.key.hi {
		background: var(--hi);
	}
</style>
