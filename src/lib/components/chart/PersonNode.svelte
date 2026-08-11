<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type Data = {
		label: string;
		korean?: string;
		color: string;
		kingdom: string;
		kingdomColor: string;
		size: number;
		gender: 'm' | 'f';
		avatar?: string | null;
		initial?: string;
	};

	let { data }: NodeProps & { data: Data } = $props();

	const size = $derived(data.size);
	const genderIcon = $derived(data.gender === 'f' ? 'female' : 'male');
</script>

<div
	class="person"
	style:--c={data.color}
	style:--k={data.kingdomColor}
	style:width="{size}px"
	style:height="{size}px"
>
	<div class="dot" aria-hidden="true">
		{#if data.avatar}
			<img class="face" src={data.avatar} alt="" draggable="false" />
		{:else}
			<span class="initial">{data.initial ?? data.label.slice(0, 1)}</span>
		{/if}
	</div>

	<div class="labels">
		<span class="name-row">
			<span class="name">{data.label}</span>
			<span class="material-symbols-outlined gender" aria-hidden="true">{genderIcon}</span>
		</span>
		{#if data.korean}<span class="ko">{data.korean}</span>{/if}
	</div>

	<Handle type="source" position={Position.Top} id="s" class="ghost" />
	<Handle type="target" position={Position.Top} id="t" class="ghost" />
</div>

<style>
	.person {
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		pointer-events: all;
		overflow: visible;
		cursor: pointer;
	}

	.dot {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--c) 75%, #1e1e1e);
		border: 1.25px solid rgba(0, 0, 0, 0.35);
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 35%, transparent);
		overflow: hidden;
		display: grid;
		place-items: center;
	}

	.face {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center top;
		pointer-events: none;
		user-select: none;
	}

	.initial {
		font-size: 0.7rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.92);
		pointer-events: none;
	}

	.labels {
		position: absolute;
		left: 50%;
		top: calc(100% + 0.28rem);
		translate: -50% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.04rem;
		width: max-content;
		max-width: 6.5rem;
		z-index: 2;
		pointer-events: none;
	}

	.name-row {
		display: inline-flex;
		align-items: center;
		gap: 0.1rem;
		max-width: 6.5rem;
	}

	.name {
		font-size: 0.58rem;
		font-weight: 550;
		letter-spacing: 0.01em;
		color: rgba(235, 235, 245, 0.82);
		text-align: center;
		line-height: 1.1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.gender {
		flex-shrink: 0;
		font-size: 11px !important;
		font-variation-settings:
			'FILL' 0,
			'wght' 300,
			'GRAD' 0,
			'opsz' 20;
		color: color-mix(in srgb, var(--k) 55%, #ebebf5);
		line-height: 1;
		opacity: 0.85;
	}

	.ko {
		font-size: 0.48rem;
		color: rgba(235, 235, 245, 0.35);
		line-height: 1.1;
	}

	:global(.ghost.svelte-flow__handle) {
		opacity: 0 !important;
		width: 4px !important;
		height: 4px !important;
		min-width: 0 !important;
		min-height: 0 !important;
		border: none !important;
		background: transparent !important;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%) !important;
	}
</style>
