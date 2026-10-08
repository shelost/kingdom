<script lang="ts">
	import StoryOutline from '$lib/components/StoryOutline.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.outline.title} · Stories · King for All</title>
	<meta name="description" content={data.outline.logline} />
</svelte:head>

<StoryOutline outline={data.outline} maps={data.maps} />
