<script lang="ts">
	import StoryOutline from '$lib/components/StoryOutline.svelte';
	import { plateTab } from '$lib/reading.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{plateTab(data.outline.title, data.outline.ko)} · {plateTab('Stories', '이야기')} · {plateTab('King for All', '삼한왕검')}</title>
	<meta name="description" content={data.outline.logline} />
</svelte:head>

<StoryOutline outline={data.outline} maps={data.maps} />
