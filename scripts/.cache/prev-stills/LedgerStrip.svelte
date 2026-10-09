<script lang="ts">
	import type { LedgerData } from '$lib/story';
	import { reading } from '$lib/reading.svelte';
	import { routeSide } from '$lib/mapRoutes';
	import { claimRank, countUp, readLedger, shownClaim, type Claim } from '$lib/ledger';
	import RecordCite from './RecordCite.svelte';

	/** A battle's numbers as a strip of stats under its map: one cell per claim, sources stamped beneath. */
	let { numbers }: { numbers: LedgerData } = $props();

	/** A figure longer than this reads as a sentence, not a number, and is set smaller. */
	const WORDY = 26;

	let ko = $derived(reading.lang === 'ko');
	let both = $derived(reading.lang === 'both');
	let title = $derived(ko && numbers.ko ? numbers.ko : numbers.title);

	/** Records that give the same figure share one value, with every seal under it. */
	let stats = $derived(
		readLedger(numbers).map((r) => {
			const groups: { claim: Claim; sources: string[]; notes: string[]; rank: 'hi' | 'lo' | null }[] = [];
			for (const c of r.cells) {
				if (!c) continue;
				const g = groups.find((x) => x.claim.raw === c.raw);
				if (g) {
					g.sources.push(c.source);
					if (c.note) g.notes.push(c.note);
				} else groups.push({ claim: c, sources: [c.source], notes: c.note ? [c.note] : [], rank: claimRank(r, c) });
			}
			return { r, side: r.row.side ? routeSide(r.row.side) : null, groups };
		})
	);

	let progress = $state(0);
	let inked = $state(false);

	const count = countUp(
		(t) => (progress = t),
		() => (inked = true)
	);
</script>

<section class="strip" class:inked aria-label={title} {@attach count}>
	{#if title}
		<p class="title">
			{title}{#if both && numbers.ko}<span class="title-ko" lang="ko">{numbers.ko}</span>{/if}
		</p>
	{/if}
	<ul class="stats">
		{#each stats as { r, side, groups }, ri (ri)}
			<li class="stat" class:disputed={r.disputed} class:sided={!!side} style:--c={side?.color}>
				{#if side}<span class="side">{ko ? side.ko : side.label}</span>{/if}
				<span class="label">{ko && r.row.ko ? r.row.ko : r.row.label}</span>
				{#if both && r.row.ko}<span class="label-ko" lang="ko">{r.row.ko}</span>{/if}
				{#each groups as g, gi (gi)}
					<div class="claim" class:hi={g.rank === 'hi'} class:lo={g.rank === 'lo'}>
						<span class="value" class:wordy={g.claim.raw.length > WORDY} aria-label={g.claim.raw}>
							{shownClaim(g.claim, progress)}
						</span>
						{#each g.notes as note, ni (ni)}<span class="note">{note}</span>{/each}
						<span class="by">
							{#each g.sources as s, si (s)}
								<RecordCite source={s} {inked} delay={(ri + si) * 120} compact />
							{/each}
						</span>
					</div>
				{/each}
			</li>
		{/each}
	</ul>
	{#if stats.some((s) => s.r.disputed)}
		<p class="legend">
			<span class="key hi"></span>{ko ? '가장 큰 수' : 'highest claim'}
			<span class="key lo"></span>{ko ? '가장 작은 수' : 'lowest claim'}
		</p>
	{/if}
</section>

<style>
	.strip {
		--text-cite: color-mix(in srgb, var(--quote) 70%, var(--fg-strong));
		--text-faint: color-mix(in srgb, var(--quote) 45%, var(--fg-faint));
		--hi: #c8442c;
		--lo: #3e79e4;
		margin-top: 0.7rem;
		padding-top: 0.6rem;
		border-top: 1px solid var(--hairline);
	}

	.title {
		margin: 0 0 0.5rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--fg-faint);
	}

	.title-ko {
		margin-left: 0.5rem;
		letter-spacing: 0.04em;
		opacity: 0.8;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
		padding: 0.45rem 0.6rem 0.5rem;
		border-left: 3px solid var(--c, color-mix(in srgb, var(--quote) 40%, transparent));
		border-radius: 0 var(--radius) var(--radius) 0;
		background: color-mix(in srgb, var(--c, var(--quote)) 7%, transparent);
	}

	.stat.disputed {
		box-shadow: inset 0 2px 0 var(--gold);
	}

	.side {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--c) 75%, var(--fg-strong));
	}

	.label {
		font-size: 0.74rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--fg-strong);
	}

	.label-ko {
		font-size: 0.66rem;
		color: var(--text-faint);
	}

	.claim {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		margin-top: 0.3rem;
	}

	.claim + .claim {
		padding-top: 0.3rem;
		border-top: 1px dashed color-mix(in srgb, var(--quote) 22%, transparent);
	}

	.value {
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.2;
		font-variant-numeric: tabular-nums;
		color: var(--fg-strong);
	}

	.value.wordy {
		font-size: 0.86rem;
		font-weight: 600;
	}

	.claim.hi .value {
		color: color-mix(in srgb, var(--hi) 80%, var(--fg-strong));
	}

	.claim.lo .value {
		color: color-mix(in srgb, var(--lo) 80%, var(--fg-strong));
	}

	.note {
		font-size: 0.66rem;
		line-height: 1.35;
		color: var(--text-faint);
	}

	.by {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
		margin-top: 0.1rem;
	}

	.legend {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		margin: 0.5rem 0 0;
		font-size: 0.64rem;
		color: var(--text-faint);
	}

	.key {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 2px;
	}

	.key.hi {
		background: var(--hi);
	}

	.key.lo {
		margin-left: 0.6rem;
		background: var(--lo);
	}
</style>
