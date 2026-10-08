<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reading } from '$lib/reading.svelte';

	/**
	 * Wraps an animated widget with a replay control. Replaying re-mounts the
	 * widget, and every widget starts its animation when it enters the view, so
	 * a fresh mount on screen plays it again from the top.
	 */
	let { children }: { children: Snippet } = $props();

	let run = $state(0);
	let label = $derived(reading.lang === 'ko' ? '다시 보기' : 'Replay');
</script>

<div class="replay">
	{#key run}
		{@render children()}
	{/key}
	<button type="button" class="again" title={label} aria-label={label} onclick={() => run++}>
		<span class="material-symbols-outlined" aria-hidden="true">replay</span>
	</button>
</div>

<style>
	.replay {
		position: relative;
	}

	/* Pinned on the panel's top edge, opposite the caption box, so it never
	   covers the corner flag and seal inside the panel. */
	.again {
		position: absolute;
		top: -1.15rem;
		right: 0.7rem;
		z-index: 6;
		display: grid;
		place-items: center;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: var(--caption-bg);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.22);
		color: var(--caption-ink);
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.2s var(--ease),
			color 0.2s var(--ease),
			transform 0.3s var(--ease);
	}

	.again .material-symbols-outlined {
		font-size: 1.1rem;
	}

	.replay:hover > .again,
	.again:focus-visible {
		opacity: 1;
	}

	.again:hover {
		color: var(--gold);
	}

	.again:active {
		transform: rotate(-120deg);
	}

	/* No hover on touch screens: keep the control in sight, just quieter. */
	@media (hover: none) {
		.again {
			opacity: 0.7;
		}
	}
</style>
