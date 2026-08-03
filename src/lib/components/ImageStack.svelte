<script lang="ts">
	import type { ImageSlot } from '$lib/story';
	import { reveal } from '$lib/reveal';

	let { images }: { images: ImageSlot[] } = $props();
</script>

<!--
	Slots with a `src` render the real artwork; the rest stay as labelled
	placeholders so the layout is already reserved for art still to come.
-->
<div class="stack">
	{#each images as slot, i (slot.id)}
		<figure
			class="strip"
			class:art={!!slot.src}
			style:aspect-ratio={slot.ratio}
			style:--tone={slot.tone ?? '#3a3a40'}
			use:reveal={i * 70}
		>
			{#if slot.src}
				<!-- the first strip of an entry loads eagerly so the art is never
				     waiting on an observer that may not fire -->
				<img
					src={slot.src}
					alt={slot.alt ?? ''}
					loading={i === 0 ? 'eager' : 'lazy'}
					decoding="async"
				/>
			{:else}
				<div class="ph">
					<span class="ph-id">{slot.id}</span>
				</div>
			{/if}
		</figure>
	{/each}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
	}

	.strip {
		position: relative;
		margin: 0;
		width: 100%;
		overflow: hidden;
		transition: transform 0.6s var(--ease);
	}

	.strip:hover {
		transform: scale(1.012);
		z-index: 2;
	}

	.strip img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ph {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		background: var(--tone);
	}

	.ph-id {
		position: relative;
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.62);
		background: rgba(0, 0, 0, 0.34);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		transition: color 0.35s var(--ease);
	}

	.strip:hover .ph-id {
		color: rgba(255, 255, 255, 0.95);
	}
</style>
