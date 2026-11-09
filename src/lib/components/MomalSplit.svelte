<script lang="ts">
	/** The record beside this chronicle: what the sources say, what King for All adds, where they part. */
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { reading } from '$lib/reading.svelte';
	import { storyAsk } from '$lib/storyAsk.svelte';
	import { momalRefs } from '$lib/momalRefs.svelte';
	import { MOMAL_LAYERS, momalEpisodeHref } from '$lib/momal';
	import type { MomalWidget } from '$lib/momalTypes';

	let { widget }: { widget: Extract<MomalWidget, { type: 'split' }> } = $props();

	const ko = $derived(reading.lang === 'ko');
	const record = MOMAL_LAYERS.record;
	const chronicle = MOMAL_LAYERS.chronicle;

	$effect(() => momalRefs.want([], widget.episodes ?? []));
</script>

<section class="split" aria-label={ko ? '기록과 이야기' : 'Record and chronicle'}>
	<header>
		<span class="kicker">{ko ? '기록 대 이야기' : 'Record vs. chronicle'}</span>
		{#if widget.topic}<h4>{widget.topic}</h4>{/if}
	</header>

	<div class="cols">
		<div class="col record" in:fly={{ x: -10, duration: 420, easing: cubicOut }}>
			<span class="label">
				<span class="material-symbols-outlined" aria-hidden="true">{record.icon}</span>
				{ko ? record.ko : record.en}
			</span>
			{#if widget.record?.length}
				<ul>
					{#each widget.record as line, i (i)}<li>{line}</li>{/each}
				</ul>
			{:else}
				<p class="none">{ko ? '기록에는 없다.' : 'The record is silent.'}</p>
			{/if}
			{#if widget.recordSources?.length}
				<div class="chips">
					{#each widget.recordSources as s (s)}<span class="chip">{s}</span>{/each}
				</div>
			{/if}
		</div>

		<span class="seal" aria-hidden="true">vs</span>

		<div class="col chronicle" in:fly={{ x: 10, duration: 420, delay: 90, easing: cubicOut }}>
			<span class="label">
				<span class="material-symbols-outlined" aria-hidden="true">{chronicle.icon}</span>
				{ko ? chronicle.ko : chronicle.en}
			</span>
			{#if widget.chronicle?.length}
				<ul>
					{#each widget.chronicle as line, i (i)}<li>{line}</li>{/each}
				</ul>
			{:else}
				<p class="none">{ko ? '이 이야기는 기록을 따른다.' : 'The chronicle follows the record.'}</p>
			{/if}
			{#if widget.episodes?.length}
				<div class="chips">
					{#each widget.episodes as id (id)}
						{@const ep = momalRefs.episode(id)}
						<a class="chip ep" href={momalEpisodeHref(ep?.queryId ?? id)} onclick={() => storyAsk.show()}>
							<span class="material-symbols-outlined" aria-hidden="true">play_arrow</span>
							{ep?.title ?? id}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if widget.verdict}
		<p class="verdict">
			<span class="material-symbols-outlined" aria-hidden="true">call_split</span>
			{widget.verdict}
		</p>
	{/if}
</section>

<style lang="scss">
	$red: #e94949;
	$gold: #ffb900;
	$blue: #3e79e4;
	$parchment: #efe3c8;

	.split {
		container-type: inline-size;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		width: 100%;
		padding: 0.85rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.035);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		padding: 0 0.15rem;
	}

	.kicker {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
	}

	h4 {
		margin: 0;
		font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
		font-size: 1.12rem;
		font-weight: 600;
		color: #fff;
	}

	.cols {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.55rem;
		@container (min-width: 30rem) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem 0.85rem 0.85rem;
		border-radius: 14px;
		& ul {
			margin: 0;
			padding-left: 1.05em;
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			font-size: 0.84rem;
			line-height: 1.5;
		}
	}

	.record {
		color: rgba($parchment, 0.92);
		background:
			radial-gradient(120% 90% at 0% 0%, rgba($parchment, 0.13), transparent 70%),
			rgba($parchment, 0.045);
		box-shadow: inset 0 0 0 1px rgba($parchment, 0.18);
		& ul {
			font-family: 'Newsreader', 'Noto Serif KR', Georgia, serif;
			font-size: 0.9rem;
		}
		& li::marker {
			color: rgba($parchment, 0.5);
		}
	}

	.chronicle {
		position: relative;
		color: rgba(255, 255, 255, 0.92);
		background: linear-gradient(
			160deg,
			rgba($red, 0.16),
			rgba($gold, 0.07) 50%,
			rgba($blue, 0.18)
		);
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
			padding: 1px;
			background: linear-gradient(140deg, rgba($red, 0.7), rgba($gold, 0.5), rgba($blue, 0.7));
			mask:
				linear-gradient(#000 0 0) content-box exclude,
				linear-gradient(#000 0 0);
			pointer-events: none;
		}
		& li::marker {
			color: $gold;
		}
	}

	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		& .material-symbols-outlined {
			font-size: 1rem;
		}
	}

	.none {
		margin: 0;
		font-size: 0.82rem;
		font-style: italic;
		opacity: 0.6;
	}

	.seal {
		display: none;
		@container (min-width: 30rem) {
			position: absolute;
			top: 50%;
			left: 50%;
			z-index: 1;
			display: grid;
			place-items: center;
			width: 1.9rem;
			height: 1.9rem;
			border-radius: 50%;
			background: #0b0b10;
			box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
			font-family: 'Newsreader', Georgia, serif;
			font-size: 0.78rem;
			font-style: italic;
			color: rgba(255, 255, 255, 0.7);
			transform: translate(-50%, -50%);
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: auto;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		padding: 0.12rem 0.5rem;
		border-radius: 999px;
		font-size: 0.66rem;
		font-weight: 600;
		background: rgba(255, 255, 255, 0.08);
		color: inherit;
		text-decoration: none;
		.record & {
			background: rgba($parchment, 0.1);
		}
		&.ep {
			padding-left: 0.3rem;
			&:hover {
				background: #fff;
				color: #0a0a0f;
			}
		}
		& .material-symbols-outlined {
			font-size: 0.85rem;
		}
	}

	.verdict {
		display: flex;
		align-items: flex-start;
		gap: 0.45rem;
		margin: 0;
		padding: 0.55rem 0.75rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		font-size: 0.84rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.86);
		& .material-symbols-outlined {
			font-size: 1.05rem;
			color: $gold;
			margin-top: 0.1rem;
		}
	}
</style>
