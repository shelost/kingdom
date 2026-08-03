<script lang="ts">
	import type { NodeProps } from '@xyflow/svelte';

	type Data = {
		label: string;
		hint?: string;
	};

	let { data }: NodeProps & { data: Data } = $props();
</script>

<div class="section">
	<span class="label">{data.label}</span>
	{#if data.hint}<span class="hint">{data.hint}</span>{/if}
</div>

<style>
	.section {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		pointer-events: none;
		user-select: none;
		min-width: 12rem;
	}

	.label {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(235, 235, 245, 0.55);
	}

	.hint {
		font-size: 0.62rem;
		color: rgba(235, 235, 245, 0.28);
		letter-spacing: 0.02em;
	}
</style>
