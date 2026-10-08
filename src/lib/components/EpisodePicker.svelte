<script lang="ts">
	import { chapters, arcNumber } from '$lib/story';
	import { arcLabel } from '$lib/tocTree';
	import { reading, episodes, episodeNavLabel, goToEpisode } from '$lib/reading.svelte';
	import GlassSelect, { type GlassOption } from './GlassSelect.svelte';

	/** The episode switcher: every episode, under its Arc, with Part pages as section rows. */
	let {
		variant = 'glass',
		placement = 'below',
		align = 'start',
		sheet = true,
		menuWidth = 'min(24rem, calc(100vw - 16px))',
		tabindex
	}: {
		variant?: 'glass' | 'inline';
		placement?: 'below' | 'above';
		align?: 'start' | 'center';
		sheet?: boolean;
		menuWidth?: string;
		tabindex?: number;
	} = $props();

	const INDEX_BY_ID = new Map(episodes.map((ep, i) => [ep.id, i]));

	/* The TOC marks love stories with a heart; the switcher reads plain. */
	const HEART = /^[♡♥❤]\uFE0F?\s*/u;

	let ko = $derived(reading.lang === 'ko');

	let options = $derived(
		episodes.map((ep): GlassOption<string> => {
			const label = episodeNavLabel(ep).replace(HEART, '');
			if (ep.kind !== 'entry') return { value: ep.id, label, strong: ep.kind === 'part' };
			const ch = chapters[ep.chapterIndex];
			const name = (ko && ch.korean) || ch.title;
			const arc = arcLabel(arcNumber(ep.chapterIndex), ko);
			return { value: ep.id, label, group: name === arc ? arc : `${arc} · ${name}` };
		})
	);
</script>

<GlassSelect
	label={ko ? '회차' : 'Episode'}
	value={episodes[reading.episodeIndex]?.id ?? episodes[0].id}
	{options}
	onchange={(id) => goToEpisode(INDEX_BY_ID.get(id) ?? 0)}
	{variant}
	{placement}
	{align}
	{sheet}
	{menuWidth}
	{tabindex}
/>
