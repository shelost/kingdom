<script lang="ts">
	import type { ImageSlot } from '$lib/story';
	import { reveal } from '$lib/reveal';

	let { images }: { images: ImageSlot[] } = $props();
</script>

<!--
	Placeholder strips. When the real art is ready, replace the inner
	<div class="ph"> with <img src="/images/{slot.id}.png" alt="..." />
	— the aspect-ratio box stays the same.
-->
<div class="stack">
	{#each images as slot, i (slot.id)}
		<figure
			class="strip"
			style:aspect-ratio={slot.ratio}
			style:--tone={slot.tone ?? '#5b5b63'}
			use:reveal={i * 70}
		>
			<div class="ph">
				<span class="ph-id">{slot.id}</span>
			</div>
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

	.ph {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		/* tones are authored bright — damped so they sit on the black page */
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--tone) 62%, #000) 0%,
				color-mix(in srgb, var(--tone) 44%, #000) 55%,
				color-mix(in srgb, var(--tone) 22%, #000) 100%
			);
	}

	/* a slow sheen so the placeholders read as "pending art", not broken */
	.ph::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			transparent 38%,
			rgba(255, 255, 255, 0.06) 50%,
			transparent 62%
		);
		background-size: 260% 100%;
		animation: sheen 7s var(--ease) infinite;
		pointer-events: none;
	}

	@keyframes sheen {
		0%,
		62% {
			background-position: 130% 0;
		}
		100% {
			background-position: -60% 0;
		}
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

	@media (prefers-reduced-motion: reduce) {
		.ph::after {
			animation: none;
		}
	}
</style>
