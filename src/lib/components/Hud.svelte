<script lang="ts">
	import {
		reading,
		setLang,
		setMode,
		setViewScope,
		loadLang,
		loadMode,
		loadViewScope,
		type Lang,
		type ReadMode,
		type ViewScope
	} from '$lib/reading.svelte';
	import { music, TRACKS, initMusic, playTrack, toggleMute } from '$lib/music.svelte';
	import { speech, initSpeech, syncSpeech, toggleAutoSpeech } from '$lib/speech.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import { onMount } from 'svelte';
	import SpeakIcon from './SpeakIcon.svelte';
	import SiteNav from './SiteNav.svelte';
	import NsfwToggle from './NsfwToggle.svelte';
	import { loadShowIntimate } from '$lib/nsfwUi.svelte';

	const LANGS: { id: Lang; label: string; hint: string }[] = [
		{ id: 'both', label: 'A/한', hint: 'Show everything' },
		{ id: 'en', label: 'EN', hint: 'English narration only' },
		{ id: 'ko', label: '한', hint: 'Korean dialogue only' }
	];

	/** `short` is what a phone shows — the full words do not fit beside the
	    chapter bar without pushing the title under the toggles. */
	const MODES: { id: ReadMode; label: string; short: string; hint: string }[] = [
		{ id: 'script', label: 'Script', short: 'Script', hint: 'Scroll layout without the speaker plate' },
		{
			id: 'immersion',
			label: 'Immersion',
			short: 'Scene',
			hint: 'Speaker portrait like a game dialogue (default)'
		},
		{
			id: 'cinema',
			label: 'Cinema',
			short: 'Cine',
			hint: 'Cinema layout — scene, script rail, character, active dialogue'
		}
	];

	const SCOPES: { id: ViewScope; label: string; short: string; hint: string }[] = [
		{ id: 'full', label: 'Full', short: 'Full', hint: 'Entire story as one continuous scroll' },
		{
			id: 'episodes',
			label: 'Episodes',
			short: 'Eps',
			hint: 'One episode at a time with previous / next'
		}
	];

	/** User intent; visual open also requires the HUD to be on stage. */
	let settingsWanted = $state(false);
	let settingsRoot: HTMLDivElement | undefined;
	let settingsOpen = $derived(settingsWanted && scriptUi.inScript);

	onMount(() => {
		loadLang();
		loadMode();
		loadViewScope();
		loadShowIntimate();
		const endMusic = initMusic();
		const endSpeech = initSpeech();
		return () => {
			endMusic();
			endSpeech();
		};
	});

	// follow the reader: whatever section they're in decides the track
	$effect(() => {
		playTrack(reading.music ? (TRACKS[reading.music] ?? null) : null);
	});

	// the voice follows the reader the same way — and a new line cuts off the last
	$effect(() => {
		syncSpeech(scriptUi.inScript);
	});

	let label = $derived(music.current ? music.current.title : 'no track');

	let voiceHint = $derived(
		speech.error
			? speech.error
			: speech.auto
				? 'Reading dialogue aloud — click to silence'
				: 'Read each line of dialogue aloud as you reach it'
	);

	function closeSettings() {
		settingsWanted = false;
	}

	function toggleSettings() {
		settingsWanted = !settingsWanted;
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && settingsOpen) {
			closeSettings();
			e.stopPropagation();
		}
	}

	function onWindowPointerDown(e: PointerEvent) {
		if (!settingsOpen || !settingsRoot) return;
		const target = e.target;
		if (target instanceof Node && !settingsRoot.contains(target)) {
			closeSettings();
		}
	}
</script>

<svelte:window onkeydown={onWindowKeydown} onpointerdown={onWindowPointerDown} />

<div class="hud" class:in={scriptUi.inScript} aria-hidden={!scriptUi.inScript}>
	<!-- ————— now playing ————— -->
	<button
		class="music"
		class:on={!!music.current}
		class:muted={music.muted}
		aria-live="polite"
		aria-pressed={!music.muted}
		tabindex={scriptUi.inScript ? 0 : -1}
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

	<!-- ————— the voice —————
	     Wears the player's pill (same corner, same weight): both are "what you
	     are hearing", and the reader shouldn't have to learn two shapes. -->
	<button
		class="music voice"
		class:on={speech.auto}
		class:warn={!!speech.error}
		aria-pressed={speech.auto}
		tabindex={scriptUi.inScript ? 0 : -1}
		title={voiceHint}
		onclick={toggleAutoSpeech}
	>
		<SpeakIcon on={speech.playing} size={14} />
		<span class="track">{speech.auto ? 'Voice on' : 'Voice off'}</span>
	</button>

	<!-- ————— settings (mode / scope / lang / site nav) ————— -->
	<div
		class="settings"
		class:open={settingsOpen}
		bind:this={settingsRoot}
	>
		<button
			type="button"
			class="settings-toggle"
			aria-expanded={settingsOpen}
			aria-controls="hud-settings"
			tabindex={scriptUi.inScript ? 0 : -1}
			title={settingsOpen ? 'Close settings' : 'Open settings'}
			aria-label={settingsOpen ? 'Close settings' : 'Open settings'}
			onclick={toggleSettings}
		>
			<span class="material-symbols-outlined" aria-hidden="true">
				{settingsOpen ? 'close' : 'tune'}
			</span>
		</button>

		<div
			id="hud-settings"
			class="settings-tray"
			role="region"
			aria-label="Reading settings"
			inert={!settingsOpen}
		>
			<div class="settings-tray-inner">
				<!-- ————— reading mode ————— -->
				<div class="mode pill-stagger" style:--i="0" role="group" aria-label="Reading mode">
					{#each MODES as m (m.id)}
						<button
							class:active={reading.mode === m.id}
							title={m.hint}
							aria-pressed={reading.mode === m.id}
							onclick={() => setMode(m.id)}
						>
							<span class="wide">{m.label}</span>
							<span class="narrow">{m.short}</span>
						</button>
					{/each}
				</div>

				<!-- ————— view scope ————— -->
				<div class="scope pill-stagger" style:--i="1" role="group" aria-label="View">
					{#each SCOPES as s (s.id)}
						<button
							class:active={reading.viewScope === s.id}
							title={s.hint}
							aria-pressed={reading.viewScope === s.id}
							onclick={() => setViewScope(s.id)}
						>
							<span class="wide">{s.label}</span>
							<span class="narrow">{s.short}</span>
						</button>
					{/each}
				</div>

				<!-- ————— language ————— -->
				<div class="lang pill-stagger" style:--i="2" role="group" aria-label="Language">
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

				<div class="nsfw-wrap pill-stagger" style:--i="3">
					<NsfwToggle compact />
				</div>

				<div class="nav-wrap pill-stagger" style:--i="4">
					<SiteNav />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.hud {
		position: fixed;
		top: max(1rem, env(safe-area-inset-top, 0px));
		right: max(1.15rem, env(safe-area-inset-right, 0px));
		z-index: 96;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.55rem;
		opacity: 0;
		transform: translate3d(0, -0.85rem, 0);
		pointer-events: none;
		transition:
			opacity 520ms var(--ease),
			transform 560ms var(--ease);
	}

	.hud.in {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}

	/* Cinema: the corner steps almost all the way out of the picture and comes
	   back on approach, so the panel is not framed by a dashboard. */
	:global(html.is-cinema:not(.is-cinema-peek)) .hud.in {
		opacity: 0.22;
	}

	:global(html.is-cinema) .hud.in:hover,
	:global(html.is-cinema) .hud.in:focus-within {
		opacity: 1;
	}

	.narrow {
		display: none;
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
		background: var(--glass);
		backdrop-filter: blur(14px);
		opacity: 0.5;
		transition:
			opacity 420ms var(--ease),
			border-color 420ms var(--ease);
		flex-shrink: 0;
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

	/* ————— voice pill ————— */
	.voice {
		color: var(--fg-faint);
		gap: 0.45rem;
	}

	.voice.on {
		color: var(--gold);
	}

	/* something is wrong with synthesis — the tooltip says what */
	.voice.warn {
		opacity: 1;
		color: var(--fg-dim);
		border-color: rgba(200, 96, 78, 0.45);
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

	/* ————— settings shell ————— */
	.settings {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		gap: 0.45rem;
		min-width: 0;
		max-width: min(42rem, calc(100vw - 7.5rem));
	}

	.settings-toggle {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		color: var(--fg-faint);
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			color 0.25s var(--ease),
			border-color 0.25s var(--ease),
			background 0.25s var(--ease);
	}

	.settings-toggle:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.settings.open .settings-toggle {
		color: var(--on-gold);
		background: var(--gold);
		border-color: var(--gold);
	}

	.settings-toggle .material-symbols-outlined {
		font-size: 1.05rem;
		line-height: 1;
	}

	.settings-tray {
		display: grid;
		grid-template-columns: 0fr;
		opacity: 0;
		pointer-events: none;
		transition:
			grid-template-columns 420ms var(--ease),
			opacity 280ms var(--ease);
	}

	.settings.open .settings-tray {
		grid-template-columns: 1fr;
		opacity: 1;
		pointer-events: auto;
	}

	.settings-tray-inner {
		min-width: 0;
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;
		gap: 0.45rem;
	}

	.pill-stagger {
		opacity: 0;
		transform: translate3d(0.4rem, 0, 0);
		transition:
			opacity 280ms var(--ease),
			transform 360ms var(--ease);
		transition-delay: 0ms;
	}

	.settings.open .pill-stagger {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		transition-delay: calc(50ms + var(--i, 0) * 45ms);
	}

	/* ————— mode / scope / language toggles ————— */
	.mode,
	.scope,
	.lang {
		display: flex;
		gap: 1px;
		padding: 2px;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: var(--glass);
		backdrop-filter: blur(14px);
		flex-shrink: 0;
	}

	.mode button,
	.scope button,
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
	.scope button:hover,
	.lang button:hover {
		color: var(--fg);
	}

	.mode button.active,
	.scope button.active,
	.lang button.active {
		color: var(--on-gold);
		background: var(--gold);
	}

	.nav-wrap {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.nsfw-wrap {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.nav-wrap :global(.site-nav) {
		gap: 0.28rem;
	}

	.nav-wrap :global(.site-nav a) {
		padding: 0.3rem 0.55rem;
		font-size: 0.65rem;
	}

	@media (max-width: 1100px) {
		.mode button,
		.scope button {
			padding: 0.22rem 0.45rem;
			font-size: 0.65rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hud {
			transition: opacity 200ms ease;
			transform: none;
		}

		.wave i {
			animation: none;
			height: 60%;
		}

		.settings-tray,
		.pill-stagger {
			transition: none;
		}

		.pill-stagger {
			transform: none;
		}

		.settings.open .pill-stagger {
			transition-delay: 0ms;
		}
	}

	/* ————— Phones: a compact strip clear of the TOC toggle ————— */
	@media (max-width: 700px) {
		.track {
			display: none;
		}

		.hud {
			top: max(0.45rem, env(safe-area-inset-top, 0px));
			right: max(0.55rem, env(safe-area-inset-right, 0px));
			left: max(3.4rem, calc(env(safe-area-inset-left, 0px) + 3.1rem));
			justify-content: flex-end;
			flex-wrap: wrap;
			row-gap: 0.3rem;
			gap: 0.3rem;
			max-width: calc(100vw - 3.6rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));
		}

		.settings {
			max-width: 100%;
		}

		.settings-tray-inner {
			gap: 0.3rem;
			row-gap: 0.3rem;
		}

		.wide {
			display: none;
		}

		.narrow {
			display: inline;
		}

		.mode button,
		.scope button,
		.lang button {
			min-height: 2.75rem;
			min-width: 2.5rem;
			padding: 0.35rem 0.55rem;
			font-size: 0.68rem;
		}

		.music,
		.settings-toggle {
			min-height: 2.75rem;
			min-width: 2.75rem;
			width: auto;
			height: auto;
			padding: 0.4rem 0.65rem;
			justify-content: center;
		}

		.nav-wrap :global(.site-nav a),
		.nav-wrap :global(.site-nav .theme-toggle) {
			min-height: 2.75rem;
			min-width: 2.75rem;
			display: inline-grid;
			place-items: center;
			padding: 0.35rem 0.65rem;
			font-size: 0.68rem;
		}
	}

	@media (max-width: 380px) {
		.hud {
			gap: 0.22rem;
		}

		.mode button,
		.scope button,
		.lang button {
			min-width: 2.2rem;
			padding: 0.3rem 0.4rem;
			font-size: 0.64rem;
		}
	}
</style>
