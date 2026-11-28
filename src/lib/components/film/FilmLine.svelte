<script lang="ts">
	import { speakerName } from '$lib/chat';
	import { progress, smooth } from '$lib/film/timeline';
	import type { Cue } from '$lib/film/timeline';
	import { avatarOf, byId, colorOf } from '$lib/people';
	import { reading } from '$lib/reading.svelte';

	let { cue, time, year }: { cue: Cue | null; time: number; year: number } = $props();

	/** Seconds between one line floating up and the next. */
	const STAGGER = 0.26;
	/** Seconds a line takes to rise into place, and the whole cue to float off. */
	const RISE = 0.6;
	const LEAVE = 0.45;

	let width = $state(0);
	let lang = $derived(reading.lang);
	let beat = $derived(cue?.beat);
	let full = $derived(!beat ? '' : lang === 'ko' ? beat.ko || beat.en : beat.en);
	let sub = $derived(lang === 'both' && beat?.ko && beat.ko !== full ? beat.ko : '');
	let title = $derived(beat?.kind === 'title');

	/** Words packed into lines no longer than `max` characters. */
	function wrap(text: string, max: number): string[] {
		const out: string[] = [];
		let line = '';
		for (const word of text.split(/\s+/).filter(Boolean)) {
			if (line && line.length + 1 + word.length > max) {
				out.push(line);
				line = word;
			} else line = line ? `${line} ${word}` : word;
		}
		if (line) out.push(line);
		return out;
	}

	let max = $derived(width > 0 ? Math.max(22, Math.min(54, Math.round(width / 15))) : 40);
	let lines = $derived([
		...wrap(full, max).map((text) => ({ text, ko: false })),
		...wrap(sub, Math.round(max * 0.8)).map((text) => ({ text, ko: true }))
	]);

	/** Out at the end of the cue, for every line together. */
	let leave = $derived(cue ? smooth(progress(time, cue.t1 - LEAVE, cue.t1)) : 0);

	function rise(i: number): number {
		if (!cue) return 0;
		const t0 = cue.t0 + i * STAGGER;
		return smooth(progress(time, t0, t0 + RISE));
	}

	let who = $derived.by(() => {
		const id = beat?.person;
		if (!id) return null;
		const p = byId.get(id);
		if (!p) return null;
		const name = speakerName(p, year, beat?.look, lang === 'ko' ? 'ko' : 'en');
		return { name, color: colorOf(p), face: avatarOf(p, beat?.en, year, beat?.look) };
	});

	let titleIn = $derived(cue ? smooth(progress(time, cue.t0, cue.t0 + 0.9)) : 0);
</script>

{#if cue && full && title}
	<div class="card" style:opacity={titleIn * (1 - leave)} style:filter="blur({(1 - titleIn) * 8 + leave * 6}px)">
		<span class="rule" style:transform="scaleX({titleIn})"></span>
		<h2 style:letter-spacing="{0.02 + (1 - titleIn) * 0.32}em" style:transform="scale({1.05 - 0.05 * titleIn})">{full}</h2>
		{#if sub}<p class="ko" lang="ko">{sub}</p>{/if}
		<span class="rule" style:transform="scaleX({titleIn})"></span>
	</div>
{:else if cue && full}
	<div class={['line', { spoken: !!who }]} bind:clientWidth={width}>
		{#if who}
			<div class="who" style:opacity={rise(0) * (1 - leave)}>
				{#if who.face}<img src={who.face} alt="" style:border-color={who.color} />{/if}
				<span style:color={who.color}>{who.name}</span>
			</div>
		{/if}
		{#each lines as l, i (i)}
			{@const a = rise(i)}
			<p
				class={{ ko: l.ko }}
				lang={l.ko ? 'ko' : undefined}
				style:opacity={a * (1 - leave)}
				style:transform="translateY({(1 - a) * 0.85 - leave * 0.5}em)"
				style:filter={a < 1 || leave > 0 ? `blur(${(1 - a) * 5 + leave * 3}px)` : undefined}
			>
				{l.text}
			</p>
		{/each}
	</div>
{:else}
	<div class="line" bind:clientWidth={width}></div>
{/if}

<style>
	.line {
		position: relative;
		z-index: 3;
		flex: 0 0 auto;
		min-height: 3.2rem;
		margin: 0;
		padding: 0.85rem 1.2rem calc(0.4rem + env(safe-area-inset-bottom));
		color: #f4f1e8;
		text-align: center;
		pointer-events: none;
	}
	p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.42;
		will-change: transform, opacity;
	}
	p.ko {
		margin-top: 0.15rem;
		font-size: 0.88em;
		opacity: 0.82;
	}
	.who {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		margin-bottom: 0.35rem;
	}
	.who span {
		font-size: 0.78rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	img {
		width: 2.4rem;
		height: 2.4rem;
		border: 2px solid #f4f1e8;
		border-radius: 50%;
		object-fit: cover;
	}
	.card {
		position: absolute;
		inset: 0;
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.9rem;
		padding: 0 6%;
		color: #f7f1e3;
		text-align: center;
		pointer-events: none;
		text-shadow: 0 4px 40px rgba(0, 0, 0, 0.85);
	}
	h2 {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(2.6rem, 8.5vw, 6.4rem);
		font-weight: 600;
		line-height: 1.02;
	}
	.card .ko {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.1rem, 2.6vw, 1.8rem);
		letter-spacing: 0.3em;
		opacity: 0.8;
	}
	.rule {
		display: block;
		width: min(16rem, 40vw);
		height: 1px;
		background: linear-gradient(90deg, transparent, #e7c56a, transparent);
		transform-origin: center;
	}
	@media (min-width: 800px) {
		.line {
			position: absolute;
			right: 8%;
			bottom: 11%;
			left: 8%;
			padding: 0;
			text-shadow:
				0 2px 18px #000,
				0 0 4px rgba(0, 0, 0, 0.6);
		}
		p {
			font-size: clamp(1.15rem, 2.2vw, 1.62rem);
		}
	}
</style>
