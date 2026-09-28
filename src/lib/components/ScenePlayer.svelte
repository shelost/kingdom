<script lang="ts">
	import { storyImg } from '$lib/img';
	import { isAudible, music, playOrPause, setVolume, toggleMute } from '$lib/music.svelte';
	import SeekBar from './SeekBar.svelte';
	import type { Scene } from '$lib/scenes';
	import { audioArtist, audioCredit, audioLabel, sceneCover } from '$lib/scenes';

	let {
		scene,
		canPrev = false,
		canNext = false,
		onprev,
		onnext,
		onplay
	}: {
		scene: Scene | null;
		canPrev?: boolean;
		canNext?: boolean;
		onprev?: () => void;
		onnext?: () => void;
		/** Arm + ensure the active scene track is playing. */
		onplay?: () => void;
	} = $props();

	let volOpen = $state(false);

	let title = $derived(scene ? audioLabel(scene) : 'No track');
	let artist = $derived(scene ? audioArtist(scene) : '');
	let credit = $derived(scene ? audioCredit(scene) : '');
	let cover = $derived(scene ? sceneCover(scene) : '');
	let sceneTitle = $derived(scene?.title ?? 'Scenes');

	let playing = $derived(isAudible());

	function onVolInput(e: Event) {
		const el = e.currentTarget as HTMLInputElement;
		setVolume(Number(el.value));
	}

	function volIconLevel() {
		if (music.muted || music.volume < 0.01) return 0;
		if (music.volume < 0.34) return 1;
		if (music.volume < 0.67) return 2;
		return 3;
	}
</script>

{#if scene}
	<div class="player" role="region" aria-label="Now playing">
		<div class="glow" aria-hidden="true"></div>

		<div class="now">
			<div class="art">
				<img
					{...storyImg(cover, {
						kind: 'thumb',
						priority: true,
						sizes: '56px',
						widths: [64, 96, 128],
						alt: ''
					})}
				/>
			</div>
			<div class="copy">
				<p class="track-title">{title}</p>
				<p class="track-sub">
					{#if artist}
						<span class="artist">{artist}</span>
						<span class="dot" aria-hidden="true">·</span>
					{/if}
					<span class="scene-name">{sceneTitle}</span>
					{#if credit}
						<span class="dot" aria-hidden="true">·</span>
						<span class="credit" title={credit}>{credit}</span>
					{/if}
				</p>
			</div>
		</div>

		<div class="transport">
			<div class="controls">
				<button
					type="button"
					class="icon skip"
					disabled={!canPrev}
					onclick={() => onprev?.()}
					aria-label="Previous scene"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z"
						/></svg
					>
				</button>

				<button
					type="button"
					class="play"
					onclick={() => playOrPause(onplay)}
					aria-label={playing ? 'Pause' : 'Play'}
				>
					{#if playing}
						<svg viewBox="0 0 24 24" aria-hidden="true"
							><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" /></svg
						>
					{:else}
						<svg viewBox="0 0 24 24" aria-hidden="true"
							><path fill="currentColor" d="M8 5v14l11-7L8 5z" /></svg
						>
					{/if}
				</button>

				<button
					type="button"
					class="icon skip"
					disabled={!canNext}
					onclick={() => onnext?.()}
					aria-label="Next scene"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M16 6h2v12h-2V6zM6 18l8.5-6L6 6v12z"
						/></svg
					>
				</button>
			</div>

			<SeekBar />
		</div>

		<div class="gain" class:open={volOpen}>
			<button
				type="button"
				class="icon mute"
				class:off={music.muted || music.volume < 0.01}
				onclick={() => {
					onplay?.();
					toggleMute();
				}}
				aria-label={music.muted ? 'Unmute' : 'Mute'}
				aria-pressed={music.muted}
				onpointerenter={() => (volOpen = true)}
			>
				{#if volIconLevel() === 0}
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M16.5 12a4.5 4.5 0 0 0-1.3-3.2l1.1-1.1A6 6 0 0 1 18.5 12c0 1.4-.5 2.7-1.3 3.7l-1.1-1.1A4.5 4.5 0 0 0 16.5 12zM4 9v6h3l5 4V5L7 9H4zm12.7-4.3 1.1-1.1A9.9 9.9 0 0 1 21 12a9.9 9.9 0 0 1-3.2 7.4l-1.1-1.1A8.4 8.4 0 0 0 19.5 12c0-2.1-.8-4-2-5.5zM3.3 3l16 16-1.3 1.3-3.5-3.5-.7-.7L4.3 7.1 2 4.8 3.3 3z"
						/></svg
					>
				{:else if volIconLevel() === 1}
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M4 9v6h3l5 4V5L7 9H4zm9.5 3a2.5 2.5 0 0 0-1.2-2.1v4.2A2.5 2.5 0 0 0 13.5 12z"
						/></svg
					>
				{:else if volIconLevel() === 2}
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M4 9v6h3l5 4V5L7 9H4zm9.5 3a2.5 2.5 0 0 0-1.2-2.1v4.2A2.5 2.5 0 0 0 13.5 12zm2.9 0a5.4 5.4 0 0 0-1.5-3.7l1.1-1.1A6.9 6.9 0 0 1 18 12a6.9 6.9 0 0 1-1.9 4.8l-1.1-1.1A5.4 5.4 0 0 0 16.4 12z"
						/></svg
					>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true"
						><path
							fill="currentColor"
							d="M4 9v6h3l5 4V5L7 9H4zm9.5 3a2.5 2.5 0 0 0-1.2-2.1v4.2A2.5 2.5 0 0 0 13.5 12zm2.9 0a5.4 5.4 0 0 0-1.5-3.7l1.1-1.1A6.9 6.9 0 0 1 18 12a6.9 6.9 0 0 1-1.9 4.8l-1.1-1.1A5.4 5.4 0 0 0 16.4 12zm3.2 0A8.9 8.9 0 0 0 17.5 5l1.1-1.1A10.4 10.4 0 0 1 22 12a10.4 10.4 0 0 1-3.4 7.7L17.5 19A8.9 8.9 0 0 0 19.6 12z"
						/></svg
					>
				{/if}
			</button>

			<label
				class="vol"
				onpointerleave={() => (volOpen = false)}
			>
				<span class="sr">Volume</span>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={music.muted ? 0 : music.volume}
					style:--p="{(music.muted ? 0 : music.volume) * 100}%"
					oninput={onVolInput}
				/>
			</label>
		</div>
	</div>
{/if}

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

	.player {
		--player-fg: #f5f5f7;
		--player-muted: rgba(245, 245, 247, 0.55);
		--player-line: rgba(255, 255, 255, 0.14);
		--player-fill: rgba(255, 255, 255, 0.92);
		--player-glass: rgba(22, 22, 28, 0.72);
		position: relative;
		z-index: 8;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(14rem, 1.4fr) minmax(0, 1fr);
		align-items: center;
		gap: 0.85rem 1.25rem;
		margin: 0 0.85rem max(0.75rem, env(safe-area-inset-bottom));
		padding: 0.7rem 0.85rem;
		border-radius: 18px;
		border: 1px solid var(--player-line);
		background: var(--player-glass);
		backdrop-filter: blur(28px) saturate(1.35);
		-webkit-backdrop-filter: blur(28px) saturate(1.35);
		box-shadow:
			0 18px 48px rgba(0, 0, 0, 0.45),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
		color: var(--player-fg);
		font-family: var(--ui);
		isolation: isolate;
		overflow: hidden;
	}

	.glow {
		position: absolute;
		inset: -40% auto -40% -10%;
		width: 42%;
		background: radial-gradient(
			ellipse at center,
			rgba(216, 178, 106, 0.16),
			transparent 70%
		);
		pointer-events: none;
		z-index: -1;
	}

	.now {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.art {
		flex: 0 0 auto;
		width: 3.35rem;
		height: 3.35rem;
		border-radius: 10px;
		overflow: hidden;
		background: #111;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
	}

	.art img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.copy {
		min-width: 0;
		display: grid;
		gap: 0.12rem;
	}

	.track-title {
		margin: 0;
		font-size: 0.92rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.artist {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: color-mix(in srgb, var(--player-fg) 82%, var(--player-muted));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.track-sub {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: var(--tracking-ui);
		color: var(--player-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dot {
		margin: 0 0.28rem;
		opacity: 0.5;
	}

	.transport {
		display: grid;
		gap: 0.35rem;
		justify-items: center;
		min-width: 0;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	.icon,
	.play {
		appearance: none;
		border: none;
		background: transparent;
		color: inherit;
		padding: 0;
		cursor: pointer;
		display: grid;
		place-items: center;
		transition:
			transform 160ms var(--ease),
			opacity 160ms var(--ease),
			background 160ms var(--ease);
	}

	.icon {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		color: rgba(245, 245, 247, 0.82);
	}

	.icon:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.08);
		color: #fff;
	}

	.icon:disabled {
		opacity: 0.28;
		cursor: default;
	}

	.icon svg,
	.play svg {
		width: 1.15rem;
		height: 1.15rem;
	}

	.play {
		width: 2.55rem;
		height: 2.55rem;
		border-radius: 999px;
		background: #fff;
		color: #111;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
	}

	.play svg {
		width: 1.2rem;
		height: 1.2rem;
	}

	.play:hover {
		transform: scale(1.05);
	}

	.play:active {
		transform: scale(0.97);
	}

	.vol input {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 0.28rem;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			var(--player-fill) 0 var(--p, 0%),
			rgba(255, 255, 255, 0.18) var(--p, 0%) 100%
		);
		outline: none;
		cursor: pointer;
	}

	.vol input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0.78rem;
		height: 0.78rem;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
		border: none;
	}

	.vol input::-moz-range-thumb {
		width: 0.78rem;
		height: 0.78rem;
		border-radius: 50%;
		background: #fff;
		border: none;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
	}

	.gain {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.35rem;
		min-width: 0;
	}

	.mute.off {
		color: rgba(245, 245, 247, 0.45);
	}

	.vol {
		width: 5.5rem;
		display: block;
	}

	@media (max-width: 900px) {
		.player {
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas:
				'now gain'
				'transport transport';
			gap: 0.55rem 0.75rem;
			padding: 0.65rem 0.75rem;
		}

		.now {
			grid-area: now;
		}

		.transport {
			grid-area: transport;
		}

		.gain {
			grid-area: gain;
		}

		.vol {
			width: 4.25rem;
		}

		.art {
			width: 2.85rem;
			height: 2.85rem;
		}
	}

	@media (max-width: 560px) {
		.player {
			margin-inline: 0.55rem;
			border-radius: 16px;
		}

		.credit {
			display: none;
		}

		.vol {
			display: none;
		}

		.gain.open .vol {
			display: block;
			position: absolute;
			right: 0.75rem;
			bottom: calc(100% + 0.4rem);
			width: 7rem;
			padding: 0.55rem 0.65rem;
			border-radius: 12px;
			background: rgba(18, 18, 24, 0.92);
			border: 1px solid var(--player-line);
			backdrop-filter: blur(16px);
		}
	}
</style>
