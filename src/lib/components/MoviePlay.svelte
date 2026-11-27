<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import gsap from 'gsap';
	import CosmosFlat from '$lib/components/CosmosFlat.svelte';
	import { movieFrames, type MovieFrame } from '$lib/movieFrames';
	import type { MovieMove } from '$lib/movieCuts';
	import { speakerName } from '$lib/chat';
	import { byId } from '$lib/people';
	import { reading } from '$lib/reading.svelte';
	import type { Entry } from '$lib/story';

	let { entry, onclose }: { entry: Entry; onclose: () => void } = $props();

	const frames = $derived(movieFrames(entry));
	const hasMap = $derived(frames.some((f) => f.kind === 'map'));
	const year = $derived.by(() => {
		const m = String(entry.year).match(/\d{3,4}/);
		return m ? Number(m[0]) : 632;
	});

	let i = $state(0);
	let playing = $state(false);
	let relief = $state(false);
	let lead = $state('');
	let sub = $state('');
	let who = $state('');
	let titleCard = $state(false);
	/** Listeners live outside Svelte's tracking, so the cut's place is kept here. */
	const cursor = { i: 0, playing: false };

	let root: HTMLElement | undefined;

	let ctx: gsap.Context | undefined;
	let tl: gsap.core.Timeline | undefined;
	let front = 0;
	let token = 0;

	const POSE: Record<MovieMove, { from: Pose; to: Pose }> = {
		push: { from: { scale: 1, xPercent: 0, yPercent: 0 }, to: { scale: 1.12, xPercent: 0, yPercent: -1 } },
		pull: { from: { scale: 1.14, xPercent: 0, yPercent: 1 }, to: { scale: 1, xPercent: 0, yPercent: 0 } },
		left: { from: { scale: 1.08, xPercent: 3.5, yPercent: 0 }, to: { scale: 1.12, xPercent: -3.5, yPercent: 0 } },
		right: { from: { scale: 1.08, xPercent: -3.5, yPercent: 0 }, to: { scale: 1.12, xPercent: 3.5, yPercent: 0 } },
		rise: { from: { scale: 1.06, xPercent: 0, yPercent: 4 }, to: { scale: 1.1, xPercent: 0, yPercent: -3 } }
	};
	const CYCLE: MovieMove[] = ['push', 'left', 'pull', 'right', 'rise'];

	type Pose = { scale: number; xPercent: number; yPercent: number };

	function soften(p: Pose, mobile: boolean): Pose {
		if (!mobile) return p;
		return {
			scale: 1 + (p.scale - 1) * 0.4,
			xPercent: p.xPercent * 0.35,
			yPercent: p.yPercent * 0.35
		};
	}

	function whoOf(shot: MovieFrame): string {
		if (shot.kind === 'title' || shot.kind === 'map') return '';
		if (shot.person) {
			const p = byId.get(shot.person);
			if (p) return speakerName(p, year, shot.look, reading.lang === 'ko' ? 'ko' : 'en');
		}
		return shot.speaker ?? '';
	}

	function cutTo(n: number) {
		const list = frames;
		const shot = list[n];
		if (!shot || !root || !ctx) return;
		const mine = ++token;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mobile = window.matchMedia('(max-width: 799px)').matches;
		const stage = root.querySelector('.stage');
		const band = root.querySelector<HTMLElement>('.band');
		const barEl = root.querySelector<HTMLElement>('.bar');
		const mapEl = root.querySelector<HTMLElement>('.map');
		const lineEl = root.querySelector<HTMLElement>('.line');
		if (!stage) return;
		const plates = stage.querySelectorAll<HTMLImageElement>('.plate');
		const incoming = plates[front ^ 1];
		const outgoing = plates[front];
		front ^= 1;

		const ko = reading.lang === 'ko';
		lead = ko ? shot.ko || shot.en : shot.en || shot.ko;
		sub = reading.lang === 'both' ? shot.ko : '';
		who = whoOf(shot);
		titleCard = shot.kind === 'title';
		relief = !!shot.relief;

		const raw = reduce
			? { from: { scale: 1, xPercent: 0, yPercent: 0 }, to: { scale: 1, xPercent: 0, yPercent: 0 } }
			: POSE[shot.move ?? CYCLE[n % CYCLE.length]];
		const from = soften(raw.from, mobile);
		const to = soften(raw.to, mobile);
		const hold = reduce ? Math.min(shot.hold, 2.4) : shot.hold;
		const fade = reduce ? 0.18 : 0.75;
		const dim = shot.kind === 'title' ? 0.38 : 1;
		const showMap = shot.kind === 'map';

		if (!showMap && shot.src && incoming.getAttribute('src') !== shot.src) incoming.src = shot.src;

		ctx.add(() => {
			tl?.kill();
			gsap.set(incoming, { autoAlpha: 0, ...from });
			if (lineEl) gsap.set(lineEl, { scale: 1 });
			tl = gsap.timeline({
				paused: true,
				onComplete: () => {
					if (mine !== token) return;
					if (cursor.playing && cursor.i < list.length - 1) go(cursor.i + 1);
				}
			});
			if (band) tl.set(band, { autoAlpha: 0, y: 20 });
			tl.to(outgoing, { autoAlpha: 0, duration: fade, ease: 'power1.inOut' }, 0);
			if (showMap && mapEl) {
				gsap.set(mapEl, { autoAlpha: 0, scale: from.scale });
				tl.to(mapEl, { autoAlpha: 1, duration: fade, ease: 'power2.out' }, 0);
				tl.to(mapEl, { scale: to.scale, duration: hold, ease: 'none' }, 0);
			} else {
				if (mapEl) tl.to(mapEl, { autoAlpha: 0, duration: fade * 0.6, ease: 'power1.in' }, 0);
				tl.to(incoming, { autoAlpha: dim, duration: fade, ease: 'power2.out' }, 0);
				tl.to(incoming, { scale: to.scale, xPercent: to.xPercent, yPercent: to.yPercent, duration: hold, ease: 'none' }, 0);
			}
			if (lineEl && shot.kind === 'title' && !reduce) {
				tl.fromTo(lineEl, { scale: 1.06 }, { scale: 1, duration: 0.9, ease: 'power2.out' }, 0.12);
			}
			if (band) {
				tl.to(band, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.12);
				if (n < list.length - 1) {
					tl.to(band, { autoAlpha: 0, y: -14, duration: 0.32, ease: 'power1.in' }, Math.max(hold - 0.38, fade));
				}
			}
			if (barEl) {
				tl.eventCallback('onUpdate', () => {
					const across = (n + (tl?.progress() ?? 0)) / list.length;
					barEl?.style.setProperty('--p', String(across));
				});
			}
		});

		const begin = () => {
			if (mine !== token) return;
			if (cursor.playing) tl?.play();
		};
		if (showMap || !shot.src || (incoming.complete && incoming.naturalWidth > 0)) begin();
		else {
			incoming.addEventListener('load', begin, { once: true });
			incoming.addEventListener('error', begin, { once: true });
		}
	}

	function go(n: number, run = cursor.playing) {
		const last = Math.max(frames.length - 1, 0);
		cursor.i = Math.max(0, Math.min(last, n));
		cursor.playing = run;
		i = cursor.i;
		playing = run;
		cutTo(cursor.i);
	}

	function toggle() {
		cursor.playing = !cursor.playing;
		playing = cursor.playing;
		if (cursor.playing) tl?.play();
		else tl?.pause();
	}

	function close() {
		token++;
		tl?.kill();
		onclose();
	}

	function onAct(e: Event) {
		const act = (e.target as HTMLElement).closest<HTMLElement>('[data-act]')?.dataset.act;
		if (act === 'back') go(cursor.i - 1);
		else if (act === 'forward') go(cursor.i + 1);
		else if (act === 'toggle') toggle();
		else if (act === 'replay') go(0, true);
		else if (act === 'close') close();
	}

	const dock: Attachment<HTMLElement> = (node) => {
		root = node;
		document.body.appendChild(node);
		ctx = gsap.context(() => {}, node);
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		playing = !reduce;
		cursor.playing = !reduce;
		go(0, !reduce);
		return () => {
			token++;
			tl?.kill();
			ctx?.revert();
			ctx = undefined;
			if (root === node) root = undefined;
			node.remove();
		};
	};

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			go(cursor.i + 1);
		} else if (e.key === 'ArrowLeft') go(cursor.i - 1);
		else if (e.key === 'k') toggle();
	}

	onMount(() => {
		document.addEventListener('click', onAct, true);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('click', onAct, true);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div class="movie" {@attach dock} role="dialog" aria-label={entry.title}>
	<div class="bar"></div>
	<div class="stage">
		<img class="plate" alt="" />
		<img class="plate" alt="" />
		{#if hasMap}
			<div class="map">
				<CosmosFlat
					year={year}
					scope="samhan"
					ko={reading.lang === 'ko'}
					terrain={true}
					washes={!relief}
					labels={!relief}
					nations={!relief}
					cities={false}
					tribes={false}
					rivers={true}
					detail={true}
					fish="off"
					mythic={false}
					nature={false}
					peoples={false}
					kinds={[]}
				/>
			</div>
		{/if}
		<button type="button" class="zone prev" data-act="back" aria-label="Previous"></button>
		<button type="button" class="zone next" data-act="forward" aria-label="Next"></button>
	</div>
	<div class="band" aria-live="polite">
		{#if who}<p class="who">{who}</p>{/if}
		<p class={['line', { title: titleCard }]}>{lead}</p>
		{#if sub}<p class="ko" lang="ko">{sub}</p>{/if}
		<div class="transport">
			<button type="button" data-act="back">{reading.lang === 'ko' ? '이전' : 'Back'}</button>
			<button type="button" data-act="toggle">
				{playing ? (reading.lang === 'ko' ? '멈춤' : 'Pause') : reading.lang === 'ko' ? '재생' : 'Play'}
			</button>
			<button type="button" data-act="forward">{reading.lang === 'ko' ? '다음' : 'Next'}</button>
			<span class="count">{i + 1} / {frames.length}</span>
		</div>
	</div>
	<button type="button" class="replay" data-act="replay">
		{reading.lang === 'ko' ? '다시' : 'Replay'}
	</button>
	<button type="button" class="skip" data-act="close">{reading.lang === 'ko' ? '닫기' : 'Close'}</button>
</div>

<style>
	.movie {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: flex;
		flex-direction: column;
		background: #000;
		color: #f4f1e8;
		padding-top: env(safe-area-inset-top);
	}
	.bar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(244, 241, 232, 0.18);
		z-index: 4;
	}
	.bar::after {
		content: '';
		display: block;
		height: 100%;
		width: calc(var(--p, 0) * 100%);
		background: #f4f1e8;
	}
	.stage {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		background: #000;
	}
	.stage::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		background: radial-gradient(ellipse at center, transparent 42%, rgba(0, 0, 0, 0.55) 100%);
	}
	.plate,
	.map {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		will-change: transform, opacity;
	}
	.plate {
		object-fit: cover;
		object-position: center;
		opacity: 0;
	}
	.map {
		opacity: 0;
		pointer-events: none;
	}
	.map :global(.sheet) {
		border-radius: 0;
		background: #0c1014;
	}
	.zone {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 28%;
		border: 0;
		background: transparent;
		z-index: 2;
	}
	.zone.prev {
		left: 0;
	}
	.zone.next {
		right: 0;
	}
	.band {
		flex: 0 0 auto;
		padding: 0.85rem 1.1rem calc(0.85rem + env(safe-area-inset-bottom));
		background: #000;
		text-align: center;
	}
	.who {
		margin: 0 0 0.25rem;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.62;
	}
	.line {
		margin: 0 auto;
		max-width: 40rem;
		font-size: 1.05rem;
		line-height: 1.4;
		transform-origin: center bottom;
	}
	.line.title {
		font-size: 1.7rem;
		letter-spacing: 0.04em;
	}
	.ko {
		margin: 0.35rem auto 0;
		max-width: 40rem;
		font-size: 0.92rem;
		line-height: 1.4;
		opacity: 0.78;
	}
	.transport {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.75rem;
	}
	.transport button,
	.skip,
	.replay {
		border: 0;
		background: transparent;
		color: rgba(244, 241, 232, 0.78);
		font: inherit;
		cursor: pointer;
		min-height: 44px;
		padding: 0 0.7rem;
	}
	.transport button:hover,
	.skip:hover,
	.replay:hover {
		color: #f4f1e8;
	}
	.count {
		margin-left: 0.4rem;
		font-size: 0.78rem;
		opacity: 0.5;
		font-variant-numeric: tabular-nums;
	}
	.skip {
		position: absolute;
		z-index: 5;
		top: calc(0.45rem + env(safe-area-inset-top));
		right: 0.4rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.replay {
		position: absolute;
		z-index: 5;
		top: calc(0.45rem + env(safe-area-inset-top));
		left: 0.4rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	@media (max-width: 799px) {
		.plate {
			object-fit: contain;
		}
	}
	@media (min-width: 800px) {
		.band {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 3;
			padding-bottom: 1.6rem;
			background: linear-gradient(transparent, rgba(0, 0, 0, 0.88) 42%);
		}
		.line {
			font-size: clamp(1.2rem, 2.2vw, 1.7rem);
			text-shadow: 0 2px 18px #000;
		}
		.line.title {
			font-size: clamp(2rem, 4vw, 3.2rem);
		}
	}
</style>
