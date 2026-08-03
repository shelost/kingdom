<script lang="ts">
	import {
		reading,
		setLang,
		setMode,
		loadLang,
		loadMode,
		type Lang,
		type ReadMode
	} from '$lib/reading.svelte';
	import { music, TRACKS, initMusic, playTrack, toggleMute } from '$lib/music.svelte';
	import { onMount } from 'svelte';

	const LANGS: { id: Lang; label: string; hint: string }[] = [
		{ id: 'both', label: 'A/한', hint: 'Show everything' },
		{ id: 'en', label: 'EN', hint: 'English narration only' },
		{ id: 'ko', label: '한', hint: 'Korean dialogue only' }
	];

	const MODES: { id: ReadMode; label: string; hint: string }[] = [
		{ id: 'chronicle', label: 'Chronicle', hint: 'Default reading layout' },
		{ id: 'immersive', label: 'Immersive', hint: 'Speaker portrait like a game dialogue' }
	];

	onMount(() => {
		loadLang();
		loadMode();
		return initMusic();
	});

	// follow the reader: whatever section they're in decides the track
	$effect(() => {
		playTrack(reading.music ? (TRACKS[reading.music] ?? null) : null);
	});

	let label = $derived(music.current ? music.current.title : 'no track');
</script>

<div class="hud">
	<!-- ————— now playing ————— -->
	<button
		class="music"
		class:on={!!music.current}
		class:muted={music.muted}
		aria-live="polite"
		aria-pressed={!music.muted}
		title={music.current
			? (music.muted ? 'Play — ' : 'Mute — ') + music.current.credit
			: 'No track in this section'}
		onclick={toggleMute}
	>
		<span class="wave" aria-hidden="true">
			<i style:--d="0ms"></i><i style:--d="180ms"></i><i style:--d="330ms"></i>
			<i style:--d="90ms"></i><i style:--d="260ms"></i>
		</span>
		<span class="track">{label}</span>
	</button>

	<!-- ————— reading mode ————— -->
	<div class="mode" role="group" aria-label="Reading mode">
		{#each MODES as m (m.id)}
			<button
				class:active={reading.mode === m.id}
				title={m.hint}
				aria-pressed={reading.mode === m.id}
				onclick={() => setMode(m.id)}
			>
				{m.label}
			</button>
		{/each}
	</div>

	<!-- ————— language ————— -->
	<div class="lang" role="group" aria-label="Language">
		{#each LANGS as l (l.id)}
			<button
				class:active={reading.lang === l.id}
				title={l.hint}
				aria-pressed={reading.lang === l.id}
				onclick={() => setLang(l.id)}
			>
				{l.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.hud {
		position: fixed;
		top: 1rem;
		right: 1.15rem;
		z-index: 96;
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}

	/* ————— music tag ————— */
	/* Always present in the corner; it just brightens when a track is playing. */
	.music {
		font: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.34rem 0.8rem;
		white-space: nowrap;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgba(22, 22, 25, 0.72);
		backdrop-filter: blur(14px);
		opacity: 0.5;
		transition:
			opacity 420ms var(--ease),
			border-color 420ms var(--ease);
	}

	.music.on {
		opacity: 1;
		border-color: rgba(216, 178, 106, 0.32);
	}

	.wave {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 0.85rem;
		flex-shrink: 0;
	}

	.wave i {
		display: block;
		width: 2px;
		height: 26%;
		border-radius: 1px;
		background: var(--fg-faint);
		transition: background 420ms var(--ease);
	}

	.music.on .wave i {
		background: var(--gold);
		animation: bounce 1.05s ease-in-out infinite;
		animation-delay: var(--d);
	}

	/* muted: bars hold still and dim, so the state is readable at a glance */
	.music.muted .wave i {
		animation: none;
		height: 26%;
		background: var(--fg-faint);
	}

	.music.on.muted {
		opacity: 0.72;
	}

	.music:hover {
		opacity: 1;
		border-color: rgba(216, 178, 106, 0.5);
	}

	@keyframes bounce {
		0%,
		100% {
			height: 26%;
			opacity: 0.65;
		}
		50% {
			height: 100%;
			opacity: 1;
		}
	}

	.track {
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		color: var(--fg-dim);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ————— mode / language toggles ————— */
	.mode,
	.lang {
		display: flex;
		gap: 1px;
		padding: 2px;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgba(22, 22, 25, 0.78);
		backdrop-filter: blur(14px);
	}

	.mode button,
	.lang button {
		font: inherit;
		font-size: 0.7rem;
		letter-spacing: 0.03em;
		color: var(--fg-faint);
		background: transparent;
		border: none;
		border-radius: 999px;
		padding: 0.22rem 0.6rem;
		cursor: pointer;
		transition:
			background 0.25s var(--ease),
			color 0.25s var(--ease);
	}

	.mode button:hover,
	.lang button:hover {
		color: var(--fg);
	}

	.mode button.active,
	.lang button.active {
		color: #14140f;
		background: var(--gold);
	}

	@media (max-width: 900px) {
		.mode button {
			padding: 0.22rem 0.45rem;
			font-size: 0.65rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.wave i {
			animation: none;
			height: 60%;
		}
	}

	@media (max-width: 700px) {
		.track {
			display: none;
		}
	}
</style>
