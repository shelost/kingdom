<script lang="ts">
	import { reading } from '$lib/reading.svelte';
	import { dialogueUi } from '$lib/dialogueUi.svelte';
	import { sayOf, type Say } from '$lib/comicSay';
	import { hash } from '$lib/tweet';

	/**
	 * Comic mode: the speaker's line in a white balloon over a still. Place it
	 * inside a positioned frame. `say` overrides the line read for `id`.
	 */
	let { id, say: own, preview = false }: { id: string; say?: Say | false; preview?: boolean } = $props();

	const say = $derived(own === false ? undefined : own && typeof own === 'object' ? own : sayOf(id));
	const on = $derived(
		!!say && (dialogueUi.style === 'comic' || dialogueUi.style === 'hybrid' || (preview && !!own && typeof own === 'object'))
	);
	const ko = $derived(reading.lang === 'ko');
	const text = $derived(ko ? say?.ko : say?.en);
</script>

{#if on && text}
	<p class="balloon liquid-glass" class:right={hash(id) % 2 === 1} lang={ko ? 'ko' : 'en'}>{text}</p>
{/if}

<style>
	.balloon {
		position: absolute;
		top: auto;
		bottom: 6%;
		left: 5%;
		z-index: 2;
		max-width: min(55%, 18rem);
		margin: 0;
		padding: 0.45rem 0.8rem 0.5rem;
		font-family: var(--sans);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: 0;
		color: var(--fg-strong);
		/* Liquid glass, tinted up so the line reads over a busy still. */
		--glass-tint: 68%;
		border-radius: 0.9rem;
		pointer-events: none;
	}

	.balloon.right {
		left: auto;
		right: 5%;
	}

	/* The tail, pointing down toward the speaker. */
	.balloon::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 1.1rem;
		border: 0.45rem solid transparent;
		border-top-color: color-mix(in srgb, var(--bg) 68%, transparent);
		border-left-width: 0;
	}

	.balloon.right::after {
		left: auto;
		right: 1.1rem;
		border-left-width: 0.45rem;
		border-right-width: 0;
	}

	@media (max-width: 30rem) {
		.balloon {
			font-size: 0.7rem;
			max-width: 62%;
		}
	}
</style>
