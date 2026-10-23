<script lang="ts">
	import type { Emotion } from '$lib/story';
	import { byId } from '$lib/people';
	import { playInView, tintOf } from '$lib/stillMotion';
	import Avatar from './Avatar.svelte';
	import EmotionGallery from './EmotionGallery.svelte';

	/**
	 * One of the prologue's emotion beats ("Love.", "Revenge." …) as a title
	 * card: the Korean word is brushed in huge and translucent behind it, then the
	 * word arrives in its own way. Replays each time it scrolls back into view.
	 * Below it, the emotion's character and a strip of their iconic stills.
	 */
	let {
		emotion,
		text,
		ko,
		focus,
		gallery = []
	}: { emotion: Emotion; text: string; ko?: string; focus?: string; gallery?: string[] } = $props();

	const plain = $derived(text.replace(/<[^>]*>/g, '').trim());
	const letters = $derived(Array.from(plain));
	const brush = $derived((ko ?? '').replace(/<[^>]*>/g, '').replace(/[.。…!?]/g, '').trim());
	const person = $derived(focus ? byId.get(focus) : undefined);
</script>

<section class="emotion-card" data-emotion={emotion} style:--tint={tintOf(emotion)}>
	<p class="emotion" style:--n={letters.length} {@attach playInView(0.6)}>
		<span class="sr">{plain}</span>
		{#if brush}
			<span class="brush" lang="ko" aria-hidden="true">{brush}</span>
		{/if}
		<span class="word" aria-hidden="true">
			{#each letters as ch, i (i)}
				<span class="ch" style:--i={i}>{ch}</span>
			{/each}
		</span>
	</p>
	{#if person}
		<div class="focus"><Avatar {person} size="2.2rem" label /></div>
	{/if}
	<EmotionGallery ids={gallery} />
</section>

<style>
	.emotion-card {
		position: relative;
		margin: 2.4rem 0 0.4rem;
	}

	.emotion {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		min-height: clamp(7rem, 18vw, 10rem);
		margin: 0 0 0.6rem;
		color: var(--fg-strong);
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* The Korean word, brushed huge and translucent behind the English one. */
	.brush {
		position: absolute;
		z-index: -1;
		top: 50%;
		left: -0.08em;
		font-family: var(--brush);
		font-size: clamp(7rem, 22vw, 12rem);
		line-height: 1;
		white-space: nowrap;
		color: var(--tint);
		opacity: 0.2;
		transform: translateY(-52%) rotate(-4deg);
		pointer-events: none;
		user-select: none;
	}

	.word {
		display: inline-flex;
		font-family: var(--serif);
		font-size: clamp(2.6rem, 6.5vw, 4.2rem);
		font-weight: 700;
		line-height: 1;
		letter-spacing: 0.02em;
	}

	.ch {
		display: inline-block;
		white-space: pre;
	}

	.focus {
		margin: 0 0 0.7rem;
	}

	/* ————— before play: hidden only once JS has armed the card ————— */

	.emotion:global([data-play='']) .brush {
		animation: ink-in 1.6s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	.emotion:global([data-play='']) .word {
		text-shadow: 0 0 22px color-mix(in srgb, var(--tint) 45%, transparent);
	}

	/* Love: letters bloom up out of a blur, then the word beats twice. */
	[data-emotion='love'] .emotion:global([data-play='']) .ch {
		animation: bloom 0.9s calc(0.5s + var(--i) * 70ms) cubic-bezier(0.2, 0.8, 0.3, 1) both;
	}
	[data-emotion='love'] .emotion:global([data-play='']) .word {
		color: color-mix(in srgb, var(--tint) 35%, var(--fg-strong));
		animation: heartbeat 1.3s 1.5s ease-in-out 2;
	}

	/* Revenge: slow and cold from the left, then a blade line cuts through. */
	[data-emotion='revenge'] .emotion:global([data-play='']) .ch {
		animation: creep 1.1s calc(0.5s + var(--i) * 90ms) cubic-bezier(0.25, 0.6, 0.2, 1) both;
	}
	[data-emotion='revenge'] .word {
		position: relative;
	}
	[data-emotion='revenge'] .emotion:global([data-play='']) .word::after {
		content: '';
		position: absolute;
		left: -6%;
		right: -6%;
		top: 52%;
		height: 2px;
		background: linear-gradient(90deg, transparent, #fff, var(--tint), transparent);
		box-shadow: 0 0 10px var(--tint);
		transform-origin: left;
		animation: cut 0.9s 1.6s cubic-bezier(0.7, 0, 0.2, 1) both;
	}

	/* Betrayal: it arrives whole, then breaks — every other letter slips. */
	[data-emotion='betrayal'] .emotion:global([data-play='']) .ch {
		animation:
			fade-in 0.5s calc(0.45s + var(--i) * 45ms) ease-out both,
			slip-up 0.18s 1.45s steps(2) forwards;
	}
	[data-emotion='betrayal'] .emotion:global([data-play='']) .ch:nth-child(even) {
		animation:
			fade-in 0.5s calc(0.45s + var(--i) * 45ms) ease-out both,
			slip-down 0.18s 1.45s steps(2) forwards;
	}
	[data-emotion='betrayal'] .emotion:global([data-play='']) .word {
		animation: poison 0.4s 1.45s ease-out forwards;
	}

	/* Greed: letters drop like coins, then gold keeps sliding over them. */
	[data-emotion='greed'] .emotion:global([data-play='']) .ch {
		background: linear-gradient(100deg, #b8862a 30%, #fff2b8 48%, var(--tint) 56%, #b8862a 74%);
		background-size: 300% 100%;
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation:
			coin-drop 0.7s calc(0.45s + var(--i) * 80ms) cubic-bezier(0.3, 1.5, 0.5, 1) both,
			gild 2.6s calc(1.2s + var(--i) * 90ms) linear infinite;
	}

	/* Loyalty: no stagger — every letter rises together and holds the line. */
	[data-emotion='loyalty'] .emotion:global([data-play='']) .ch {
		animation: hold 1.4s 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}
	[data-emotion='loyalty'] .word {
		position: relative;
	}
	[data-emotion='loyalty'] .emotion:global([data-play='']) .word::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -0.18em;
		height: 2px;
		background: var(--tint);
		transform-origin: center;
		animation: line-out 1.2s 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) both;
	}

	/* Pride: small and close, then it spreads its wings and lifts its chin. */
	[data-emotion='pride'] .emotion:global([data-play='']) .ch {
		animation: swell 1.4s calc(0.45s + var(--i) * 40ms) cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	[data-emotion='pride'] .emotion:global([data-play='']) .word {
		animation: spread 1.8s 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	/* Rage: letters slam down from huge, then the whole word shakes and flares. */
	[data-emotion='rage'] .emotion:global([data-play='']) .ch {
		animation: slam 0.42s calc(0.4s + var(--i) * 45ms) cubic-bezier(0.3, 1.5, 0.5, 1) both;
	}
	[data-emotion='rage'] .emotion:global([data-play='']) .word {
		color: color-mix(in srgb, var(--tint) 55%, var(--fg-strong));
		animation:
			quake 0.36s calc(0.6s + var(--n) * 45ms) steps(3) 3,
			flare 1.2s calc(0.6s + var(--n) * 45ms) ease-out infinite;
	}

	/* The brush stroke: wiped on left to right, blurred ink settling sharp. */
	@keyframes ink-in {
		from {
			clip-path: inset(0 100% 0 0);
			filter: blur(10px);
			opacity: 0;
		}
		40% {
			opacity: 0.28;
		}
		to {
			clip-path: inset(0 0 0 0);
			filter: none;
			opacity: 0.2;
		}
	}
	@keyframes fade-in {
		from { opacity: 0; }
	}
	@keyframes bloom {
		from { opacity: 0; transform: translateY(0.35em); filter: blur(8px); }
		to { opacity: 1; transform: none; filter: none; }
	}
	@keyframes heartbeat {
		0%, 40%, 100% { transform: scale(1); }
		15% { transform: scale(1.08); }
		28% { transform: scale(1.03); }
	}
	@keyframes creep {
		from { opacity: 0; transform: translateX(-0.5em); filter: brightness(0.4); }
		to { opacity: 1; transform: none; filter: none; }
	}
	@keyframes cut {
		0% { transform: scaleX(0); opacity: 1; }
		60% { transform: scaleX(1); opacity: 1; }
		100% { transform: scaleX(1); opacity: 0.35; }
	}
	@keyframes slip-up {
		to { transform: translate(-0.03em, -0.1em) rotate(-3deg); }
	}
	@keyframes slip-down {
		to { transform: translate(0.03em, 0.12em) rotate(4deg); }
	}
	@keyframes poison {
		to { color: color-mix(in srgb, var(--tint) 45%, var(--fg-strong)); }
	}
	@keyframes coin-drop {
		from { opacity: 0; transform: translateY(-1.3em) rotateY(90deg); }
		to { opacity: 1; transform: none; }
	}
	@keyframes gild {
		from { background-position: 110% 0; }
		to { background-position: -10% 0; }
	}
	@keyframes hold {
		from { opacity: 0; transform: translateY(0.5em); }
		to { opacity: 1; transform: none; }
	}
	@keyframes line-out {
		from { transform: scaleX(0); }
		to { transform: scaleX(1); }
	}
	@keyframes swell {
		from { opacity: 0; transform: scale(0.55) translateY(0.25em); }
		to { opacity: 1; transform: translateY(-0.06em); }
	}
	@keyframes spread {
		from { letter-spacing: -0.12em; }
		to { letter-spacing: 0.16em; }
	}
	@keyframes slam {
		from { opacity: 0; transform: scale(2.6); filter: blur(4px); }
		to { opacity: 1; transform: none; filter: none; }
	}
	@keyframes quake {
		0% { transform: translate(-0.04em, 0.02em); }
		33% { transform: translate(0.05em, -0.03em); }
		66% { transform: translate(-0.02em, 0.04em); }
		100% { transform: none; }
	}
	@keyframes flare {
		0%, 100% { text-shadow: 0 0 18px color-mix(in srgb, var(--tint) 40%, transparent); }
		50% { text-shadow: 0 0 34px var(--tint); }
	}

	@media (prefers-reduced-motion: reduce) {
		.emotion-card * {
			animation: none !important;
		}
	}
</style>
