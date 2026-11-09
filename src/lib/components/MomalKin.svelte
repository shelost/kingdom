<script lang="ts">
	/** How two people are related on our tree: the common ancestor, and the line down to each. */
	import { reading } from '$lib/reading.svelte';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import { MOMAL_LAYERS } from '$lib/momal';
	import MomalPerson from '$lib/components/MomalPerson.svelte';

	let { a, b }: { a: string; b: string } = $props();

	const ko = $derived(reading.lang === 'ko');
	const kin = $derived(momalRefs.kin(a, b));
	const known = $derived(momalRefs.kinKnown(a, b));
	/** Lines below the ancestor, `a` on the left; an empty side means that person is the ancestor. */
	const lines = $derived.by(() => {
		if (!kin?.ancestor) return { left: [] as string[], right: [] as string[] };
		const [toLeft, toRight] = kin.a === a ? [kin.toA, kin.toB] : [kin.toB, kin.toA];
		return { left: (toLeft ?? []).slice(1), right: (toRight ?? []).slice(1) };
	});
	const left = $derived(lines.left);
	const right = $derived(lines.right);
	const direct = $derived(!left.length || !right.length);

	function nameOf(id: string): string {
		const p = momalRefs.person(id);
		return p ? (ko && p.korean ? p.korean : p.name) : id;
	}

	$effect(() => momalRefs.wantKin(a, b));
</script>

<section class="kin" aria-label={ko ? '관계도' : 'Kinship'}>
	<header>
		<span class="kicker">
			<span class="material-symbols-outlined" aria-hidden="true">family_history</span>
			{ko ? '족보' : 'Family tree'}
		</span>
		<span class="layer">{ko ? MOMAL_LAYERS.chronicle.ko : MOMAL_LAYERS.chronicle.en} · {ko ? '위키 족보' : 'our wiki'}</span>
	</header>

	{#if kin?.married}
		<div class="pair">
			<MomalPerson id={a} compact />
			<span class="wed" aria-hidden="true"><span class="material-symbols-outlined">favorite</span></span>
			<MomalPerson id={b} compact />
		</div>
	{:else if kin?.ancestor}
		<div class="tree" class:direct>
			<div class="root"><MomalPerson id={kin.ancestor} compact /></div>
			{#if left.length}
				<ol class="line l">
					{#each left as id, i (id)}<li class:end={i === left.length - 1}><MomalPerson {id} compact /></li>{/each}
				</ol>
			{/if}
			{#if right.length}
				<ol class="line r">
					{#each right as id, i (id)}<li class:end={i === right.length - 1}><MomalPerson {id} compact /></li>{/each}
				</ol>
			{/if}
		</div>
	{:else if known}
		<div class="pair">
			<MomalPerson id={a} compact />
			<span class="gap" aria-hidden="true">?</span>
			<MomalPerson id={b} compact />
		</div>
	{:else}
		<div class="loading" aria-hidden="true"></div>
	{/if}

	{#if kin || known}
		<p class="verdict">
			{#if kin?.married}
				<b>{ko ? '부부' : 'Married'}</b>
			{:else if kin}
				{@const nameA = nameOf(kin.a)}
				{@const nameB = nameOf(kin.b)}
				<span>
					{#if ko}{nameB}, {nameA}의 <b>{kin.ko}</b>{:else}{nameB} is {nameA}’s <b>{kin.en}</b>{/if}
				</span>
				{#if kin.chon != null && kin.chon > 0}<span class="chon">{kin.chon}{ko ? '촌' : '-chon'}</span>{/if}
			{:else}
				{ko ? '우리 족보에는 두 사람의 혈연이 없다.' : 'Our tree has no blood tie between them.'}
			{/if}
		</p>
	{/if}
</section>

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;

	.kin {
		width: 100%;
		padding: 0.8rem 0.9rem 0.75rem;
		border-radius: 20px;
		background:
			radial-gradient(90% 70% at 50% 0%, rgba($gold, 0.08), transparent 70%),
			rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.8rem;
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

	.layer {
		font-size: 0.62rem;
		font-weight: 650;
		color: $gold;
		opacity: 0.8;
	}

	.tree {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: center;
		row-gap: 0;
		&.direct {
			grid-template-columns: 1fr;
		}
	}

	.root {
		grid-column: 1 / -1;
		position: relative;
		padding-bottom: 1.1rem;
		/* The fork under the ancestor: a stem, then a bar out to both lines. */
		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: 0;
			width: 2px;
			height: 1.1rem;
			background: linear-gradient($gold, rgba($gold, 0.5));
			transform: translateX(-50%);
		}
		.tree:not(.direct) &::before {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			/* Centre of the left line to centre of the right one: half the tree. */
			width: 50cqi;
			height: 2px;
			background: rgba($gold, 0.5);
			transform: translateX(-50%);
		}
	}

	.tree:not(.direct) {
		container-type: inline-size;
	}

	.line {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
		& li {
			position: relative;
			padding-top: 1rem;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 50%;
				width: 2px;
				height: 1rem;
				background: rgba($gold, 0.5);
				transform: translateX(-50%);
			}
			&.end :global(.face) {
				box-shadow:
					0 0 0 2px var(--tone),
					0 0 0 4px #0b0b10,
					0 0 0 5.5px $gold;
			}
		}
	}

	.pair {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.2rem;
		padding: 0.25rem 0 0.5rem;
	}

	.wed,
	.gap {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 1.2rem;
	}

	.wed .material-symbols-outlined {
		font-size: 1.1rem;
		color: #f472b6;
	}

	.loading {
		height: 9rem;
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

	.verdict {
		display: flex;
		justify-content: center;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0.75rem 0 0;
		padding-top: 0.6rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		font-size: 0.9rem;
		text-align: center;
		color: rgba(255, 255, 255, 0.75);
		& b {
			font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
			font-size: 1.05rem;
			font-weight: 600;
			color: #fff;
		}
	}

	.chon {
		padding: 0.05rem 0.5rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 700;
		color: #0a0a0f;
		background: linear-gradient(90deg, $red, $gold, $blue);
	}

	@media (prefers-reduced-motion: reduce) {
		.loading {
			animation: none;
		}
	}
</style>
