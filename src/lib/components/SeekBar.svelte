<script lang="ts">
	import { formatTime, music, seek } from '$lib/music.svelte';

	let { size = 'compact' }: { size?: 'compact' | 'large' } = $props();

	let scrubbing = $state(false);
	let scrubValue = $state(0);

	let displayTime = $derived(scrubbing ? scrubValue : music.currentTime);
	let progress = $derived(music.duration > 0 ? Math.min(1, displayTime / music.duration) : 0);

	function onSeekInput(e: Event) {
		scrubbing = true;
		scrubValue = Number((e.currentTarget as HTMLInputElement).value);
	}

	function onSeekCommit(e: Event) {
		scrubbing = false;
		seek(Number((e.currentTarget as HTMLInputElement).value));
	}
</script>

<div class={['scrub', size]}>
	<span class="time">{formatTime(displayTime)}</span>
	<label class="bar">
		<span class="sr">Seek</span>
		<input
			type="range"
			min="0"
			max={music.duration || 0}
			step="0.05"
			value={displayTime}
			disabled={!music.duration}
			style:--p="{progress * 100}%"
			oninput={onSeekInput}
			onchange={onSeekCommit}
			onpointerup={onSeekCommit}
		/>
	</label>
	<span class="time end">{music.duration ? formatTime(music.duration) : '—:—'}</span>
</div>

<style>
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.scrub {
		display: grid;
		grid-template-columns: 2.4rem minmax(0, 1fr) 2.4rem;
		align-items: center;
		gap: 0.45rem;
		width: min(100%, 26rem);
	}

	/* Now Playing sheet: full-width bar, times tucked underneath like a phone player. */
	.scrub.large {
		grid-template-columns: 1fr 1fr;
		grid-template-areas:
			'bar bar'
			'now end';
		gap: 0.35rem 0;
		width: 100%;
	}

	.large .bar {
		grid-area: bar;
	}

	.large .time {
		grid-area: now;
		text-align: left;
	}

	.large .time.end {
		grid-area: end;
		text-align: right;
	}

	.time {
		font-size: 0.65rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
		color: rgba(245, 245, 247, 0.55);
		text-align: right;
	}

	.time.end {
		text-align: left;
	}

	.bar {
		display: block;
		min-width: 0;
	}

	.bar input {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 0.28rem;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0.92) 0 var(--p, 0%),
			rgba(255, 255, 255, 0.18) var(--p, 0%) 100%
		);
		outline: none;
		cursor: pointer;
	}

	/* A thumb-sized hit strip on touch; the drawn line stays thin. */
	.large .bar input {
		height: 0.34rem;
		margin: 0.6rem 0;
	}

	.bar input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0.78rem;
		height: 0.78rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
		border: none;
		opacity: 0;
		transition: opacity 140ms ease;
	}

	.bar:hover input::-webkit-slider-thumb,
	.bar input:focus-visible::-webkit-slider-thumb,
	.large .bar input::-webkit-slider-thumb {
		opacity: 1;
	}

	.bar input::-moz-range-thumb {
		width: 0.78rem;
		height: 0.78rem;
		border-radius: 50%;
		background: #fff;
		border: none;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
	}
</style>
