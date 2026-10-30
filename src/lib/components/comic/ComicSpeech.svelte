<script lang="ts">
	import { byId, colorOf, koreanOf, nameOf } from '$lib/people';
	import type { BalloonKind, ComicBalloon } from '$lib/comic';
	import { reading } from '$lib/reading.svelte';

	let { balloon, year }: { balloon: ComicBalloon; year: number } = $props();

	const ko = $derived(reading.lang === 'ko');
	const text = $derived(ko ? balloon.ko : balloon.en);
	const person = $derived(balloon.person ? byId.get(balloon.person) : undefined);
	const look = $derived(balloon.look);
	const who = $derived(
		person
			? ko
				? (koreanOf(person, year, look) ?? person.korean ?? person.name)
				: nameOf(person, year, look)
			: balloon.speaker
	);
	const chip = $derived(person ? colorOf(person) : '#888');
	const kind: BalloonKind = $derived(balloon.kind ?? 'speech');
</script>

{#if text}
	<p
		class="speech {balloon.corner} {kind}"
		style:--chip={chip}
		lang={ko ? 'ko' : 'en'}
	>
		{#if who}<span class="who">{who}</span>{/if}
		{text}
	</p>
{/if}

<style>
	.speech {
		position: absolute;
		z-index: 2;
		max-width: min(58%, 16rem);
		margin: 0;
		padding: 0.42rem 0.7rem 0.48rem;
		font-family: var(--sans);
		font-size: 0.78rem;
		font-weight: 650;
		line-height: 1.28;
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		border: 1.5px solid color-mix(in srgb, var(--chip) 55%, var(--fg) 20%);
		border-radius: 0.85rem;
		pointer-events: none;
		box-shadow: 0 0.35rem 0.8rem color-mix(in srgb, #000 22%, transparent);
	}

	.who {
		display: block;
		font-size: 0.58rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--chip);
		margin-bottom: 0.12rem;
	}

	.speech::after {
		content: '';
		position: absolute;
		border: 0.42rem solid transparent;
	}

	.tl {
		top: 6%;
		left: 5%;
	}
	.tl::after {
		top: 100%;
		left: 1.1rem;
		border-top-color: color-mix(in srgb, var(--bg) 88%, transparent);
		border-left-width: 0;
	}

	.tr {
		top: 6%;
		right: 5%;
	}
	.tr::after {
		top: 100%;
		right: 1.1rem;
		border-top-color: color-mix(in srgb, var(--bg) 88%, transparent);
		border-right-width: 0;
	}

	.bl {
		bottom: 8%;
		left: 5%;
	}
	.bl::after {
		bottom: 100%;
		left: 1.1rem;
		border-bottom-color: color-mix(in srgb, var(--bg) 88%, transparent);
		border-left-width: 0;
	}

	.br {
		bottom: 8%;
		right: 5%;
	}
	.br::after {
		bottom: 100%;
		right: 1.1rem;
		border-bottom-color: color-mix(in srgb, var(--bg) 88%, transparent);
		border-right-width: 0;
	}

	.tc {
		top: 5%;
		left: 50%;
		transform: translateX(-50%);
	}
	.tc::after {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-top-color: color-mix(in srgb, var(--bg) 88%, transparent);
	}

	.bc {
		bottom: 7%;
		left: 50%;
		transform: translateX(-50%);
	}
	.bc::after {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		border-bottom-color: color-mix(in srgb, var(--bg) 88%, transparent);
	}

	.thought {
		border-radius: 1.15rem;
		border-style: dashed;
	}
	.thought::after {
		display: none;
	}

	.whisper {
		font-style: italic;
		font-weight: 500;
		opacity: 0.92;
	}

	.shout {
		font-weight: 850;
		letter-spacing: 0.01em;
		border-width: 2.5px;
		border-radius: 0.35rem 0.9rem;
	}

	@media (max-width: 40rem) {
		.speech {
			font-size: 0.68rem;
			max-width: 70%;
			padding: 0.32rem 0.5rem 0.36rem;
		}
	}
</style>
