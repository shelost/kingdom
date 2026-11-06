<script lang="ts">
	import { onMount } from 'svelte';
	import type { KingdomIntro } from '$lib/intro/intros';
	import { analyse, decode } from '$lib/intro/beats';
	import { cutAt, plan as buildPlan, type IntroPerson, type Plan } from '$lib/intro/timeline';
	import { draw, KO_FONT, TITLE_FONT } from '$lib/intro/render';

	let {
		intro,
		opening,
		cast,
		finale
	}: { intro: KingdomIntro; opening: IntroPerson[]; cast: IntroPerson[]; finale: IntroPerson | null } = $props();

	const W = 1920;
	const H = 1080;
	const RECORD_TYPES = [
		'video/mp4;codecs=avc1.640028,mp4a.40.2',
		'video/webm;codecs=vp9,opus',
		'video/webm'
	];

	let canvas = $state<HTMLCanvasElement>();
	let audio = $state<HTMLAudioElement>();
	let status = $state('Loading fonts…');
	let song = $state('');
	let plan = $state.raw<Plan | null>(null);
	let time = $state(0);
	let playing = $state(false);
	let recording = $state(false);

	let images: (HTMLImageElement | null)[] = [];
	let raf = 0;
	let actx: AudioContext | null = null;
	let dest: MediaStreamAudioDestinationNode | null = null;
	let recorder: MediaRecorder | null = null;
	let drawn = 0;
	let warning = $state('');

	const everyone = $derived([...opening, ...cast, ...(finale ? [finale] : [])]);
	const names = $derived(new Map(everyone.map((p) => [p.id, p.name])));
	const firstSeen = $derived.by(() => {
		const out = new Map<string, number>();
		for (const c of plan?.cuts ?? []) if (c.kind !== 'logo' && !out.has(c.person)) out.set(c.person, c.t);
		return out;
	});
	const now = $derived.by(() => {
		if (!plan) return '';
		const i = cutAt(plan.cuts, time);
		if (i < 0) return '';
		const cut = plan.cuts[i];
		return time >= plan.logo ? intro.title : (names.get(cut.person) ?? '');
	});
	const pct = (t: number) => (plan ? ((t - plan.start) / (plan.end - plan.start)) * 100 : 0);

	function load(src: string): Promise<HTMLImageElement | null> {
		return new Promise((done) => {
			const img = new Image();
			img.decoding = 'async';
			img.onload = () => done(img);
			img.onerror = () => done(null);
			img.src = src;
		});
	}

	function render() {
		const ctx = canvas?.getContext('2d');
		if (ctx && plan) draw(ctx, W, H, time, plan, images, intro);
	}

	function route() {
		if (actx || !audio) return;
		actx = new AudioContext();
		const source = actx.createMediaElementSource(audio);
		dest = actx.createMediaStreamDestination();
		source.connect(actx.destination);
		source.connect(dest);
	}

	function tick() {
		if (!plan || !audio) return;
		time = audio.currentTime;
		render();
		drawn++;
		if (time >= plan.end) {
			stop();
			return;
		}
		raf = requestAnimationFrame(tick);
	}

	async function play() {
		if (!plan || !audio) return;
		route();
		await actx?.resume();
		if (time >= plan.end - 0.05 || time < plan.start) seek(plan.start);
		await audio.play();
		playing = true;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(tick);
	}

	function stop() {
		audio?.pause();
		playing = false;
		cancelAnimationFrame(raf);
		if (recorder?.state === 'recording') recorder.stop();
	}

	function seek(t: number) {
		if (!audio || !plan) return;
		time = Math.min(plan.end, Math.max(plan.start, t));
		audio.currentTime = time;
		render();
	}

	async function record() {
		if (!plan || !canvas) return;
		stop();
		route();
		const type = RECORD_TYPES.find((m) => MediaRecorder.isTypeSupported(m)) ?? '';
		const stream = canvas.captureStream(30);
		for (const track of dest?.stream.getAudioTracks() ?? []) stream.addTrack(track);
		const chunks: Blob[] = [];
		recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 16_000_000 });
		recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
		recorder.onstop = () => {
			recording = false;
			const fps = drawn / Math.max(0.1, plan ? plan.end - plan.start : 1);
			warning =
				fps < 24
					? `That take drew only ${Math.round(fps)} frames a second. Keep this tab in front and record again.`
					: '';
			const blob = new Blob(chunks, { type: recorder?.mimeType || 'video/webm' });
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = `intro-${intro.id}.${blob.type.includes('mp4') ? 'mp4' : 'webm'}`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(a.href), 4000);
			recorder = null;
		};
		seek(plan.start);
		drawn = 0;
		warning = '';
		recording = true;
		recorder.start(250);
		await play();
	}

	onMount(() => {
		let cancelled = false;
		(async () => {
			await Promise.all([
				document.fonts.load(`200px "${TITLE_FONT}"`),
				document.fonts.load(`40px "${KO_FONT}"`, intro.ko)
			]).catch(() => {});
			status = 'Reading the song…';
			let buffer: AudioBuffer | null = null;
			for (const src of intro.songs) {
				try {
					buffer = await decode(src);
					song = src;
					break;
				} catch {
					continue;
				}
			}
			if (cancelled) return;
			if (!buffer || !audio) {
				status = 'No song found.';
				return;
			}
			audio.src = song;
			const next = buildPlan(analyse(buffer), opening, cast, finale, {
				start: intro.start,
				drop: intro.drop,
				after: intro.after
			});
			status = `Loading ${next.frames.length} frames…`;
			images = await Promise.all(next.frames.map(load));
			if (cancelled) return;
			plan = next;
			status = '';
			seek(next.start);
		})();
		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
			if (recorder?.state === 'recording') recorder.stop();
			audio?.pause();
			actx?.close();
		};
	});
</script>

<div class="player">
	<div class="screen">
		<canvas bind:this={canvas} width={W} height={H}></canvas>
		{#if status}<p class="status">{status}</p>{/if}
	</div>
	<audio
		bind:this={audio}
		preload="auto"
		ontimeupdate={() => plan && audio && playing && audio.currentTime >= plan.end && stop()}
	></audio>

	{#if plan}
		<div class="controls">
			<button type="button" onclick={() => (playing ? stop() : play())} disabled={recording}>
				<span class="material-symbols-outlined">{playing ? 'pause' : 'play_arrow'}</span>
			</button>
			<button type="button" onclick={() => seek(plan ? plan.start : 0)} disabled={recording} aria-label="Restart">
				<span class="material-symbols-outlined">replay</span>
			</button>
			<div class="track">
				<input
					type="range"
					min={plan.start}
					max={plan.end}
					step="0.01"
					value={time}
					disabled={recording}
					oninput={(e) => seek(+e.currentTarget.value)}
				/>
				<span class="mark" style:left="{pct(plan.drop)}%" title="Drop"></span>
				<span class="mark logo" style:left="{pct(plan.logo)}%" title="Logo"></span>
			</div>
			<span class="clock">{time.toFixed(2)}s</span>
			<button type="button" class="rec" onclick={record} disabled={recording}>
				<span class="material-symbols-outlined">fiber_manual_record</span>
				{recording ? 'Recording…' : 'Record'}
			</button>
		</div>

		<p class="now">{now}</p>
		{#if warning}<p class="warning">{warning}</p>{/if}

		<ol class="cast">
			{#each everyone as p (p.id)}
				{@const at = firstSeen.get(p.id)}
				<li>
					<button type="button" disabled={at === undefined || recording} onclick={() => at !== undefined && seek(at)}>
						<img src={p.portraits[0]} alt="" />
						<span>{p.name}</span>
						<small>{at === undefined ? '—' : `${at.toFixed(1)}s`}</small>
					</button>
				</li>
			{/each}
		</ol>

		<p class="meta">
			Song: <code>{song}</code>
			{#if !song.includes('all-caps')}
				(placeholder: drop the track at <code>static/intros/all-caps.mp3</code>)
			{/if}
			· drop {plan.drop.toFixed(2)}s · {plan.cuts.length} cuts · {plan.frames.length} frames
		</p>
	{/if}
</div>

<style>
	.player {
		display: grid;
		gap: 0.9rem;
	}

	.screen {
		position: relative;
		background: #000;
		border-radius: 10px;
		overflow: hidden;
	}

	canvas {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 9;
	}

	.status {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		margin: 0;
		color: #bbb;
		font-size: 0.95rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.controls button {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.6rem;
		border: 1px solid #333;
		border-radius: 8px;
		background: #141414;
		color: #eee;
		cursor: pointer;
	}

	.controls button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	.rec .material-symbols-outlined {
		color: #e5484d;
	}

	.track {
		position: relative;
		flex: 1;
	}

	.track input {
		width: 100%;
	}

	.mark {
		position: absolute;
		top: -6px;
		width: 2px;
		height: 8px;
		background: #f5c542;
		pointer-events: none;
	}

	.mark.logo {
		background: #e5484d;
	}

	.clock {
		min-width: 4.5rem;
		font-variant-numeric: tabular-nums;
		color: #aaa;
	}

	.now {
		margin: 0;
		min-height: 1.4em;
		font-family: 'Anton', sans-serif;
		font-size: 1.3rem;
		letter-spacing: 0.04em;
		color: #ddd;
	}

	.cast {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cast button {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.55rem 0.2rem 0.2rem;
		border: 1px solid #2a2a2a;
		border-radius: 999px;
		background: #111;
		color: #ddd;
		font-size: 0.82rem;
		cursor: pointer;
	}

	.cast button:disabled {
		opacity: 0.45;
	}

	.cast img {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		object-fit: cover;
		object-position: 50% 25%;
	}

	.cast small {
		color: #888;
		font-variant-numeric: tabular-nums;
	}

	.warning {
		margin: 0;
		color: #f5a524;
		font-size: 0.85rem;
	}

	.meta {
		margin: 0;
		color: #888;
		font-size: 0.8rem;
	}
</style>
