<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '$lib/components/diagrams/orgChartTheme.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="rail" aria-hidden="true"></div>

{@render children()}
