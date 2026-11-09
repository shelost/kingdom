<script lang="ts">
	/** One person's household on our tree: parents above, spouses and siblings beside, children below. */
	import { reading } from '$lib/reading.svelte';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import MomalPerson from '$lib/components/MomalPerson.svelte';

	let { person }: { person: string } = $props();

	const ko = $derived(reading.lang === 'ko');
	const fam = $derived(momalRefs.family(person));
	const known = $derived(momalRefs.familyKnown(person));

	const ROWS = [
		{ key: 'parents', en: 'Parents', ko: '부모' },
		{ key: 'spouses', en: 'Married to', ko: '배우자' },
		{ key: 'siblings', en: 'Siblings', ko: '형제자매' },
		{ key: 'children', en: 'Children', ko: '자녀' }
	] as const;

	$effect(() => momalRefs.wantFamily(person));
</script>

<section class="family" aria-label={ko ? '가족' : 'Family'}>
	<header>
		<span class="kicker">
			<span class="material-symbols-outlined" aria-hidden="true">diversity_3</span>
			{ko ? '가족' : 'Family'}
		</span>
	</header>
	{#if fam}
		<div class="center"><MomalPerson id={person} /></div>
		{#each ROWS as row (row.key)}
			{@const ids = fam[row.key]}
			{#if ids.length}
				<div class="row">
					<span class="label">{ko ? row.ko : row.en}</span>
					<div class="faces">
						{#each ids.slice(0, 8) as id (id)}<MomalPerson {id} compact />{/each}
						{#if ids.length > 8}<span class="more">+{ids.length - 8}</span>{/if}
					</div>
				</div>
			{/if}
		{/each}
	{:else if known}
		<p class="none">{ko ? '우리 족보에 가족이 적혀 있지 않다.' : 'Our tree lists no family for them.'}</p>
	{:else}
		<div class="loading" aria-hidden="true"></div>
	{/if}
</section>

<style lang="scss">
	$gold: #ffb900;

	.family {
		width: 100%;
		padding: 0.8rem 0.9rem 0.6rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	header {
		margin-bottom: 0.6rem;
	}

	.kicker {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		& .material-symbols-outlined {
			font-size: 1rem;
			color: $gold;
		}
	}

	.center {
		max-width: 24rem;
		margin-bottom: 0.4rem;
	}

	.row {
		display: grid;
		grid-template-columns: 5.5rem 1fr;
		align-items: start;
		gap: 0.6rem;
		padding: 0.6rem 0 0.4rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.label {
		padding-top: 1.2rem;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}

	.faces {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 0.9rem;
		& :global(.person.compact) {
			width: 4.6rem;
		}
	}

	.more {
		align-self: center;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.none {
		margin: 0;
		font-size: 0.84rem;
		font-style: italic;
		color: rgba(255, 255, 255, 0.55);
	}

	.loading {
		height: 8rem;
		border-radius: 14px;
		background:
			linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.06) 50%, transparent 70%) 0 0 / 220% 100%,
			rgba(255, 255, 255, 0.02);
		animation: sweep 1.6s linear infinite;
	}

	@keyframes sweep {
		to {
			background-position: -220% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loading {
			animation: none;
		}
	}
</style>
