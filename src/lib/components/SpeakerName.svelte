<script lang="ts">
	import { speakerParts } from '$lib/chat';

	/** A dialogue name, with the rank a step fainter than the name it qualifies. */
	let { name }: { name: string } = $props();
	let parts = $derived(speakerParts(name));
</script>

{#if parts.title && parts.titleFirst}
	<span class="title lead">{parts.title}</span><span class="name">{parts.name}</span>
{:else if parts.title}
	<span class="name">{parts.name}</span><span class="title">{parts.title}</span>
{:else}
	{name}
{/if}

<style>
	.title {
		opacity: 0.7;
	}

	.title.lead {
		margin-right: 0.28em;
	}
</style>
