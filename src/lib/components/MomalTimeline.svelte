<script lang="ts">
	/** Dated beats on one rail; each dot says whether the record or this chronicle gives it. */
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reading } from '$lib/reading.svelte';
	import { formatYear } from '$lib/wiki';
	import { MOMAL_LAYERS } from '$lib/momal';
	import type { MomalLayer, MomalWidget } from '$lib/momalTypes';

	let { widget }: { widget: Extract<MomalWidget, { type: 'timeline' }> } = $props();

	const ko = $derived(reading.lang === 'ko');
	const events = $derived([...widget.events].sort((a, b) => a.year - b.year));
	const layers = $derived([...new Set(events.map((e) => e.layer ?? 'record'))] as MomalLayer[]);
</script>

<section class="timeline">
	<header>
		<span class="kicker">{widget.title ?? (ko ? '연표' : 'Timeline')}</span>
		{#if layers.length > 1}
			<span class="legend">
				{#each layers as l (l)}
					<span class="key"><i class="dot {l}"></i>{ko ? MOMAL_LAYERS[l].ko : MOMAL_LAYERS[l].en}</span>
				{/each}
			</span>
		{/if}
	</header>
	<ol>
		{#each events as e, i (i)}
			<li in:fly={{ y: 6, duration: 360, delay: i * 50, easing: cubicOut }}>
				<span class="year">{formatYear(e.year)}</span>
				<i class="dot {e.layer ?? 'record'}"></i>
				<span class="label">{e.label}</span>
			</li>
		{/each}
	</ol>
</section>

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$parchment: #efe3c8;

	.timeline {
		width: 100%;
		padding: 0.8rem 0.9rem 0.6rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	header {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.4rem;
		margin-bottom: 0.55rem;
	}

	.kicker {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}

	.legend {
		display: flex;
		gap: 0.7rem;
		font-size: 0.66rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	ol {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
		&::before {
			content: '';
			position: absolute;
			top: 0.6rem;
			bottom: 0.6rem;
			left: 4.6rem;
			width: 1px;
			background: rgba(255, 255, 255, 0.14);
		}
	}

	li {
		display: grid;
		grid-template-columns: 4rem 1.2rem 1fr;
		align-items: baseline;
		gap: 0 0.3rem;
		padding: 0.32rem 0;
		font-size: 0.84rem;
		line-height: 1.45;
	}

	.year {
		text-align: right;
		font-family: 'Newsreader', Georgia, serif;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: #fff;
	}

	.label {
		color: rgba(255, 255, 255, 0.82);
	}

	.dot {
		position: relative;
		z-index: 1;
		justify-self: center;
		display: inline-block;
		width: 0.62rem;
		height: 0.62rem;
		border-radius: 50%;
		box-shadow: 0 0 0 3px #0b0b10;
		&.record {
			background: $parchment;
		}
		&.chronicle {
			background: conic-gradient($red, $gold, $blue, $red);
		}
		&.both {
			background: linear-gradient(90deg, $parchment 50%, $gold 50%);
		}
		.key & {
			box-shadow: none;
			width: 0.5rem;
			height: 0.5rem;
		}
	}
</style>
