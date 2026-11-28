<script lang="ts">
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import FilmFx from './FilmFx.svelte';
	import FilmLine from './FilmLine.svelte';
	import FilmMap from './FilmMap.svelte';
	import FilmPlates from './FilmPlates.svelte';
	import FilmStage from './FilmStage.svelte';
	import { poseInto, type SiteFrame } from '$lib/film/camera';
	import { buildFilm } from '$lib/film/build';
	import { present } from '$lib/film/present';
	import { indexAt, layout } from '$lib/film/timeline';
	import { loadGround } from '$lib/film/three/ground';
	import type { StageDrive, Label, View } from '$lib/stage/build';
	import type { Entry } from '$lib/story';
	import { reading } from '$lib/reading.svelte';

	let { entry, onclose }: { entry: Entry; onclose: () => void } = $props();

	let film = $derived(buildFilm(entry));
	let tl = $derived(layout(film));

	let t = $state(0);
	let playing = $state(true);
	let speed = $state(1);
	let reduce = $state(false);
	let chrome = $state(true);
	let built = $state<{ site: string; frame: SiteFrame } | null>(null);

	/** The player covers the page, outside any transformed ancestor. */
	const toBody: Attachment<HTMLElement> = (node) => {
		document.body.appendChild(node);
		return () => node.remove();
	};

	const drive: StageDrive = { on: false, pos: [0, 280, 700], target: [0, 20, 0], fov: 42, rise: null };
	const SPEEDS = [0.5, 1, 1.5, 2];

	let show = $derived(present(film, tl, t, built, reduce));
	let ko = $derived(reading.lang === 'ko');
	let filter = $derived(
		[show.blur > 0.05 ? `blur(${show.blur}px)` : '', show.memory ? 'saturate(0.4)' : '', show.impact ? 'invert(1) grayscale(1) contrast(2.4)' : '']
			.filter(Boolean)
			.join(' ') || undefined
	);

	function fmt(n: number): string {
		const s = Math.max(0, Math.floor(n));
		return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
	}

	function stepScene(dir: number) {
		const i = indexAt(tl.scenes, t);
		const n = Math.min(tl.scenes.length - 1, Math.max(0, i + dir));
		t = tl.scenes[n]?.t0 ?? 0;
	}

	function stepLine(dir: number) {
		const i = indexAt(tl.cues, t);
		const n = Math.min(tl.cues.length - 1, Math.max(0, i + dir));
		t = tl.cues[n]?.t0 ?? 0;
	}

	let hideAt = 0;
	function poke() {
		chrome = true;
		hideAt = performance.now() + 2400;
	}

	/** Last site the stage reported. Kept off state so the report effect does not subscribe to `built` and retrigger itself. */
	let reported = '';

	function take(site: string, info: { views: View[]; labels: Label[]; allViews?: View[]; allLabels?: Label[] } | null) {
		if (!info) return;
		const views = info.allViews?.length ? info.allViews : info.views;
		const labels = info.allLabels?.length ? info.allLabels : info.labels;
		const sig = `${site}:${views.map((v) => v.id).join(',')}:${labels.length}`;
		if (sig === reported) return;
		reported = sig;
		built = { site, frame: { views, labels } };
	}

	onMount(() => {
		reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		// the peninsula takes a moment to raise: start it now, not at the first map shot
		if (tl.shots.some((s) => s.visual.kind === 'peninsula' || s.visual.kind === 'descent')) loadGround().catch(() => {});
		let raf = 0;
		let last = performance.now();
		hideAt = last + 2400;
		const loop = (now: number) => {
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			if (playing && t < tl.duration) t = Math.min(tl.duration, t + dt * speed);
			const stage = present(film, tl, t, built, reduce).stage;
			if (stage?.pose) poseInto(drive, stage.pose);
			else drive.on = false;
			drive.rise = stage?.rise ?? null;
			if (playing && now > hideAt) chrome = false;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onclose();
			else if (e.key === ' ') {
				e.preventDefault();
				playing = !playing;
				poke();
			} else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
				e.preventDefault();
				const dir = e.key === 'ArrowRight' ? 1 : -1;
				if (e.shiftKey) stepScene(dir);
				else stepLine(dir);
				poke();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('keydown', onKey);
		};
	});
</script>

<div
	class="film"
	{@attach toBody}
	role="dialog"
	tabindex="-1"
	aria-label={film.title}
	onmousemove={poke}
	onpointerdown={poke}
>
	<div
		class="visual"
		style:filter
		style:clip-path={show.iris < 0.999 ? `circle(${6 + show.iris * 76}% at 50% 46%)` : undefined}
	>
		<div class="frame" style:transform={show.shake[0] || show.shake[1] ? `translate(${show.shake[0]}px, ${show.shake[1]}px) scale(1.04)` : undefined}>
			{#if show.stage}
				{#key `${show.stage.site}:${show.stage.year}`}
					<div class="layer stage" style:opacity={show.stage.opacity}>
						<FilmStage
							site={show.stage.site}
							year={show.stage.year}
							hour={show.stage.hour}
							look={show.stage.look}
							people={show.stage.people}
							{drive}
							onbuilt={take}
						/>
					</div>
				{/key}
			{/if}
			{#if show.map}
				<div class="layer" style:opacity={show.map.opacity} style:visibility={show.map.opacity > 0.002 ? undefined : 'hidden'}>
					<FilmMap map={show.map} />
				</div>
			{/if}
			<FilmPlates plates={show.plates} {speed} paused={!playing} />
			<FilmFx fx={show.fx} time={t} />
		</div>
		<div class="black" style:opacity={show.black}></div>
		<div class="ink" style:opacity={show.ink}></div>
		<div class="flash" style:opacity={show.flash}></div>
		<div class="lid top" style:transform="scaleY({show.wake})"></div>
		<div class="lid bottom" style:transform="scaleY({show.wake})"></div>
	</div>

	<FilmLine cue={show.cue} time={t} year={film.year} />

	<div class={['bar', { away: playing && !chrome }]}>
		<button type="button" class="icon" onclick={() => (playing = !playing)} aria-label={playing ? (ko ? '일시정지' : 'Pause') : ko ? '재생' : 'Play'}>
			<span class="material-symbols-outlined">{playing ? 'pause' : 'play_arrow'}</span>
		</button>
		<button type="button" class="icon" onclick={() => stepScene(-1)} aria-label={ko ? '이전 장면' : 'Previous scene'}>
			<span class="material-symbols-outlined">skip_previous</span>
		</button>
		<div class="scrub">
			<input
				type="range"
				min="0"
				max={Math.max(0.1, tl.duration)}
				step="0.05"
				value={t}
				aria-label={ko ? '시간' : 'Time'}
				oninput={(e) => {
					t = Number(e.currentTarget.value);
					poke();
				}}
			/>
			<div class="ticks">
				{#each tl.scenes as scene (scene.i)}
					<button
						type="button"
						class={['tick', { on: scene.t0 <= t && t < scene.t1 }]}
						style:left="{(scene.t0 / Math.max(0.1, tl.duration)) * 100}%"
						title={ko && scene.ko ? scene.ko : scene.label}
						onclick={() => (t = scene.t0)}
					></button>
				{/each}
			</div>
		</div>
		<button type="button" class="icon" onclick={() => stepScene(1)} aria-label={ko ? '다음 장면' : 'Next scene'}>
			<span class="material-symbols-outlined">skip_next</span>
		</button>
		<button
			type="button"
			class="speed"
			onclick={() => (speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
			aria-label={ko ? '빠르기' : 'Speed'}
		>
			{speed}×
		</button>
		<span class="clock">{fmt(t)} / {fmt(tl.duration)}</span>
		<button type="button" class="icon close" onclick={onclose} aria-label={ko ? '닫기' : 'Close'}>
			<span class="material-symbols-outlined">close</span>
		</button>
	</div>
</div>

<style>
	.film {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: flex;
		flex-direction: column;
		background: #000;
		color: #f4f1e8;
		overflow: hidden;
	}
	.visual {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		background: #000;
	}
	.frame,
	.layer {
		position: absolute;
		inset: 0;
	}
	/* a stage that builds mid-dissolve eases in instead of popping */
	.layer.stage {
		transition: opacity 0.35s ease;
	}
	.black,
	.ink,
	.flash,
	.lid {
		position: absolute;
		pointer-events: none;
	}
	.black {
		inset: 0;
		background: #000;
	}
	.ink {
		inset: 0;
		background: radial-gradient(circle at 50% 46%, transparent 0 16%, #000 52%);
	}
	.flash {
		inset: 0;
		background: #fff;
	}
	.lid {
		left: 0;
		width: 100%;
		height: 52%;
		background: #000;
	}
	.top {
		top: 0;
		transform-origin: top center;
	}
	.bottom {
		bottom: 0;
		transform-origin: bottom center;
	}
	.bar {
		position: relative;
		z-index: 4;
		display: flex;
		align-items: center;
		gap: 0.2rem;
		padding: 0.35rem 0.6rem calc(0.45rem + env(safe-area-inset-bottom));
		background: linear-gradient(#0000, #000 28%);
		transition: opacity 0.4s ease;
	}
	.bar.away {
		opacity: 0;
	}
	.bar:hover,
	.bar:focus-within {
		opacity: 1;
	}
	.icon,
	.speed {
		display: grid;
		place-items: center;
		min-width: 2.4rem;
		min-height: 2.4rem;
		padding: 0;
		border: 0;
		background: transparent;
		color: #f4f1e8;
		font: inherit;
		cursor: pointer;
	}
	.speed {
		min-width: 2.8rem;
		font-variant-numeric: tabular-nums;
	}
	.scrub {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 1.6rem;
	}
	input[type='range'] {
		position: absolute;
		inset: 0;
		width: 100%;
		margin: 0;
		accent-color: #e7c56a;
		cursor: pointer;
	}
	.ticks {
		position: absolute;
		right: 0;
		bottom: -0.15rem;
		left: 0;
		height: 0;
		pointer-events: none;
	}
	.tick {
		position: absolute;
		bottom: 0;
		width: 2px;
		height: 7px;
		padding: 0;
		border: 0;
		background: rgba(244, 241, 232, 0.45);
		pointer-events: auto;
		cursor: pointer;
	}
	.tick.on {
		background: #e7c56a;
	}
	.clock {
		font-variant-numeric: tabular-nums;
		font-size: 0.75rem;
		opacity: 0.8;
		white-space: nowrap;
	}
	@media (max-width: 700px) {
		.clock {
			display: none;
		}
	}
</style>
