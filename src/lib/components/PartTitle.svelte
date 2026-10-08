<script lang="ts">
	import { partId } from '$lib/story';
	import { partLabel } from '$lib/tocTree';
	import { partStills } from '$lib/thumbnail.svelte';
	import { episodeNavLabel, episodes, goToEpisode } from '$lib/reading.svelte';
	import StillWall from '$lib/components/StillWall.svelte';
	import type { DirectoryPart } from '$lib/episodeDirectory';

	let { part, ko = false }: { part: DirectoryPart; ko?: boolean } = $props();

	let stills = $derived(partStills(part, 12));
	let firstIndex = $derived(
		episodes.findIndex((e) => e.kind === 'entry' && e.chapterId === part.id)
	);
	let lead = $derived((ko && part.korean) || part.title);
	let second = $derived(ko ? part.title : part.korean);
</script>

<StillWall {stills} storyId={partId(part.id)}>
	<span class="part-eyebrow float-up" style:--i={0}>{partLabel(part.label, ko)}</span>
	{#if lead}<h2 class="part-title float-up" style:--i={1}>{lead}</h2>{/if}
	{#if second}<p class="part-second float-up" style:--i={2}>{second}</p>{/if}
	{#if part.hanja}<p class="part-hanja float-up" style:--i={3}>{part.hanja}</p>{/if}
	<p class="part-meta float-up" style:--i={4}>
		<span>{part.range}</span>
		<span aria-hidden="true">·</span>
		<span>{part.arcs.length} {ko ? '편' : 'arcs'}</span>
		<span aria-hidden="true">·</span>
		<span>{part.count} {ko ? '화' : 'episodes'}</span>
	</p>
	{#if firstIndex >= 0}
		<button type="button" class="part-read float-up" style:--i={5} onclick={() => goToEpisode(firstIndex)}>
			<span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
			<span>{episodeNavLabel(episodes[firstIndex])}</span>
		</button>
	{/if}
</StillWall>

<style>
	.part-eyebrow {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.34em;
		text-transform: uppercase;
		color: var(--gold);
		margin-bottom: 1.2rem;
	}

	.part-title {
		margin: 0;
		font-family: var(--serif);
		font-weight: 500;
		font-size: clamp(2.6rem, 6.2vw, 5.2rem);
		line-height: 0.98;
		letter-spacing: -0.035em;
		color: var(--fg-strong);
		text-wrap: balance;
	}

	.part-second,
	.part-hanja {
		margin: 0;
		font-family: 'Noto Serif KR', serif;
		font-weight: 500;
		line-height: 1.25;
	}

	.part-second {
		margin-top: 0.9rem;
		font-size: clamp(1.05rem, 1.9vw, 1.4rem);
		color: var(--fg-strong);
	}

	.part-hanja {
		margin-top: 0.3rem;
		font-size: clamp(0.9rem, 1.5vw, 1.1rem);
		letter-spacing: 0.12em;
		color: var(--gold);
	}

	.part-meta {
		display: flex;
		gap: 0.5rem;
		margin: 1.4rem 0 0;
		font-size: 0.8rem;
		color: var(--fg-faint);
		font-variant-numeric: tabular-nums;
	}

	.part-read {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.6rem;
		padding: 0.6rem 1.1rem 0.6rem 0.9rem;
		font: inherit;
		font-size: 0.85rem;
		font-weight: var(--weight-strong);
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--bg) 62%, transparent);
		backdrop-filter: blur(14px) saturate(170%);
		-webkit-backdrop-filter: blur(14px) saturate(170%);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		box-shadow: var(--shadow-pill);
		cursor: pointer;
		transition:
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.3s;
	}

	.part-read:hover {
		transform: translateY(-2px);
		background: color-mix(in srgb, var(--bg) 82%, transparent);
	}

	.part-read:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 3px;
	}

	.part-read .material-symbols-outlined {
		font-size: 1.15rem;
	}
</style>
