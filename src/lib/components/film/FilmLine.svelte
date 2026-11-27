<script lang="ts">
	import { speakerName } from '$lib/chat';
	import { progress } from '$lib/film/timeline';
	import type { Cue } from '$lib/film/timeline';
	import { avatarOf, byId, colorOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';

	let { cue, time, year }: { cue: Cue | null; time: number; year: number } = $props();

	let lang = $derived(reading.lang);
	let beat = $derived(cue?.beat);
	let full = $derived(!beat ? '' : lang === 'ko' ? beat.ko || beat.en : beat.en);
	let sub = $derived(lang === 'both' && beat?.ko && beat.ko !== full ? beat.ko : '');
	let typed = $derived.by(() => {
		if (!cue || !full) return '';
		const span = Math.min(1.35, Math.max(0.35, (cue.t1 - cue.t0) * 0.42));
		const n = Math.ceil(progress(time, cue.t0, cue.t0 + span) * full.length);
		return full.slice(0, n);
	});
	let who = $derived.by(() => {
		const id = beat?.person;
		if (!id) return null;
		const p = byId.get(id);
		if (!p) return null;
		const name = speakerName(p, year, beat?.look, lang === 'ko' ? 'ko' : 'en');
		return { name, color: colorOf(p), face: avatarOf(p, beat?.en, year, beat?.look) };
	});
</script>

{#if typed}
	<div class={['line', { title: beat?.kind === 'title', spoken: !!who }]}>
		{#if who}
			{#if who.face}<img src={who.face} alt="" style:border-color={who.color} />{/if}
			<span class="who" style:color={who.color}>{who.name}</span>
		{/if}
		<p>{typed}</p>
		{#if sub}<p class="ko" lang="ko">{sub}</p>{/if}
	</div>
{/if}

<style>
	.line {
		position: relative;
		z-index: 3;
		flex: 0 0 auto;
		margin: 0;
		padding: 0.85rem 1.2rem calc(0.4rem + env(safe-area-inset-bottom));
		color: #f4f1e8;
		text-align: center;
	}
	p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.4;
	}
	.title p {
		font-size: clamp(1.35rem, 3vw, 2rem);
		letter-spacing: 0.04em;
	}
	.ko {
		margin-top: 0.35rem;
		font-size: 0.86em;
		opacity: 0.82;
	}
	.who {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	img {
		width: 2.4rem;
		height: 2.4rem;
		margin-bottom: 0.35rem;
		border: 2px solid #f4f1e8;
		border-radius: 50%;
		object-fit: cover;
	}
	@media (min-width: 800px) {
		.line {
			position: absolute;
			right: 8%;
			bottom: 12%;
			left: 8%;
			padding: 0;
			text-shadow: 0 2px 18px #000;
		}
		p {
			font-size: clamp(1.15rem, 2.3vw, 1.7rem);
		}
	}
</style>
