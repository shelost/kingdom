<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '$lib/components/diagrams/orgChartTheme.css';
	import { onMount } from 'svelte';
	import { loadShowIntimate } from '$lib/nsfwUi.svelte';

	let { children } = $props();

	onMount(loadShowIntimate);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="rail" aria-hidden="true"></div>

{@render children()}
