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
	import { editUi } from '$lib/editUi.svelte';
	import { tocUi, loadTocFloating, setTocFloating } from '$lib/tocUi.svelte';
	import { toggleTheme } from '$lib/themeUi.svelte';
	import { dialogueUi, loadDialogueStyle, setDialogueStyle, type DialogueStyle } from '$lib/dialogueUi.svelte';
	import ThemeIcon from './ThemeIcon.svelte';
	import { onMount } from 'svelte';
	import SpeakIcon from './SpeakIcon.svelte';
	import SiteNav from './SiteNav.svelte';
	import EpisodePicker from './EpisodePicker.svelte';

	const LANGS: { id: Lang; label: string; hint: string }[] = [
		{ id: 'both', label: 'A/한', hint: 'Show everything' },
		{ id: 'en', label: 'EN', hint: 'English narration only' },
		{ id: 'ko', label: '한', hint: 'Korean dialogue only' }
	];

	const MODES: { id: ReadMode; label: string; short: string; hint: string }[] = [
		{ id: 'script', label: 'Script', short: 'Script', hint: 'Scroll layout without the speaker plate' },
		{
			id: 'immersion',
			label: 'Immersion',
			short: 'Scene',
			hint: 'Speaker portrait like a game dialogue'
		},
		{
			id: 'cinema',
			label: 'Cinema',
			short: 'Cine',
			hint: 'Cinema layout — scene, script rail, character, active dialogue'
		}
	];

	const DIALOGUE_STYLES: { id: DialogueStyle; label: string; hint: string }[] = [
		{ id: 'script', label: 'Script', hint: 'Lines set as a screenplay' },
		{ id: 'comic', label: 'Comic', hint: 'Message bubbles, and balloons over the stills where the speaker is in frame' },
		{ id: 'tweet', label: 'Tweet', hint: 'Every line a post; exchanges run as threads' },
		{ id: 'hybrid', label: 'Hybrid', hint: 'Messages between people close to each other; posts for councils, rivals and strangers' }
	];

	const SCOPES: { id: ViewScope; label: string; short: string; hint: string }[] = [
		{
			id: 'episodes',
			label: 'Episodes',
			short: 'Eps',
			hint: 'One episode at a time with previous / next'
		},
		{ id: 'full', label: 'Full', short: 'Full', hint: 'Entire story as one continuous scroll' }
	];

	let settingsEl: HTMLDialogElement | undefined = $state();

	onMount(() => {
		loadLang();
		loadMode();
		loadViewScope();
		loadTocFloating();
		loadDialogueStyle();
		const endMusic = initMusic();
		const endSpeech = initSpeech();
		return () => {
			endMusic();
			endSpeech();
		};
	});

	$effect(() => {
		playTrack(reading.music ? (TRACKS[reading.music] ?? null) : null);
	});

	$effect(() => {
		syncSpeech(scriptUi.inScript);
	});

	$effect(() => {
		if (scriptUi.inScript) return;
		settingsEl?.close();
	});

	let label = $derived(music.current ? music.current.title : 'no track');
	let showKo = $derived(reading.lang !== 'en');

	let voiceHint = $derived(
		speech.error
			? speech.error
			: speech.auto
				? 'Reading dialogue aloud — click to silence'
				: 'Read each line of dialogue aloud as you reach it'
	);

	function openSettings() {
		settingsEl?.showModal();
	}

	function onDialogClick(e: MouseEvent) {
		if (e.target === settingsEl) settingsEl.close();
	}
</script>

<div class="hud" class:in={scriptUi.inScript} aria-hidden={!scriptUi.inScript}>
	<button
		type="button"
		class="theme-text"
		tabindex={scriptUi.inScript ? 0 : -1}
		onclick={toggleTheme}
		aria-label="Toggle light and dark mode"
		title="Toggle light and dark mode"
	>
		<ThemeIcon />
	</button>
	<button
		type="button"
		class="settings-text"
		tabindex={scriptUi.inScript ? 0 : -1}
		aria-haspopup="dialog"
		aria-controls="hud-settings"
		onclick={openSettings}
	>
		Settings{#if showKo}<span class="hud-kicker-ko">설정</span>{/if}
	</button>
</div>

<dialog
	id="hud-settings"
	class="settings-dialog"
	bind:this={settingsEl}
	aria-labelledby="hud-settings-title"
	onclick={onDialogClick}
>
	<div class="settings-sheet">
		<header class="settings-head">
			<h2 id="hud-settings-title" class="settings-title">
				Settings{#if showKo}<span class="hud-kicker-ko">설정</span>{/if}
			</h2>
			<button type="button" class="settings-close" onclick={() => settingsEl?.close()}>Done</button>
		</header>

		<div class="hud-cluster">
			<span class="hud-kicker">Listen{#if showKo}<span class="hud-kicker-ko">듣기</span>{/if}</span>
			<div class="hud-cluster-row">
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

				<button
					class="music voice"
					class:on={speech.auto}
					class:warn={!!speech.error}
					aria-pressed={speech.auto}
					title={voiceHint}
					onclick={toggleAutoSpeech}
				>
					<SpeakIcon on={speech.playing} size={14} />
					<span class="track">{speech.auto ? 'Voice on' : 'Voice off'}</span>
				</button>
			</div>
		</div>

		<div class="hud-cluster">
			<span class="hud-kicker">View{#if showKo}<span class="hud-kicker-ko">보기</span>{/if}</span>
			<div class="mode" role="group" aria-label="Reading mode">
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
		</div>

		<div class="hud-cluster">
			<span class="hud-kicker">Dialogue{#if showKo}<span class="hud-kicker-ko">대사</span>{/if}</span>
			<div class="mode" role="group" aria-label="Dialogue style">
				{#each DIALOGUE_STYLES as d (d.id)}
					<button
						class:active={dialogueUi.style === d.id}
						title={d.hint}
						aria-pressed={dialogueUi.style === d.id}
						onclick={() => setDialogueStyle(d.id)}
					>
						{d.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="hud-cluster">
			<span class="hud-kicker">Episode{#if showKo}<span class="hud-kicker-ko">회차</span>{/if}</span>
			<div class="hud-cluster-row">
				<div class="scope" role="group" aria-label="View">
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
				{#if reading.viewScope === 'episodes'}
					<div class="ep-pick">
						<EpisodePicker />
					</div>
				{/if}
			</div>
		</div>

		<div class="hud-cluster">
			<span class="hud-kicker">Language{#if showKo}<span class="hud-kicker-ko">언어</span>{/if}</span>
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

		<div class="hud-cluster">
			<span class="hud-kicker">Sidebar{#if showKo}<span class="hud-kicker-ko">목차</span>{/if}</span>
			<div class="scope" role="group" aria-label="Sidebar">
				<button
					class:active={!tocUi.floating}
					title="Flush against the left edge"
					aria-pressed={!tocUi.floating}
					onclick={() => setTocFloating(false)}
				>
					Docked
				</button>
				<button
					class:active={tocUi.floating}
					title="Floating card with drop shadow"
					aria-pressed={tocUi.floating}
					onclick={() => setTocFloating(true)}
				>
					Floating
				</button>
			</div>
		</div>

		<div class="hud-cluster">
			<span class="hud-kicker">Site{#if showKo}<span class="hud-kicker-ko">사이트</span>{/if}</span>
			<div class="nav-wrap">
				<SiteNav inline />
			</div>
		</div>

		{#if editUi.enabled}
			<div class="hud-cluster">
				<span class="hud-kicker">Edit{#if showKo}<span class="hud-kicker-ko">편집</span>{/if}</span>
				<p class="edit-flag" title="?edit=true — right-click cue art to grade">On</p>
			</div>
		{/if}
	</div>
</dialog>

<style>
	.hud {
		position: fixed;
		top: max(1rem, env(safe-area-inset-top, 0px));
		right: max(1.15rem, env(safe-area-inset-right, 0px));
		z-index: 96;
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--ui);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
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

	:global(html.is-cinema:not(.is-cinema-peek)) .hud.in {
		opacity: 0.22;
	}

	:global(html.is-cinema) .hud.in:hover,
	:global(html.is-cinema) .hud.in:focus-within {
		opacity: 1;
	}

	.theme-text {
		display: grid;
		place-items: center;
		padding: 0.2rem;
		color: var(--fg-faint);
		background: transparent;
		border: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.theme-text :global(.material-symbols-outlined) {
		font-size: 1.05rem;
		font-variation-settings: 'wght' 500;
	}

	.theme-text:hover,
	.theme-text:focus-visible {
		color: var(--fg);
		outline: none;
	}

	.settings-text {
		font: inherit;
		color: var(--fg-faint);
		background: transparent;
		border: none;
		padding: 0.2rem 0.1rem;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.settings-text:hover,
	.settings-text:focus-visible {
		color: var(--fg);
		outline: none;
	}

	.hud-kicker {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-faint);
		line-height: 1.1;
		user-select: none;
	}

	.hud-kicker-ko {
		margin-left: 0.35rem;
		font-weight: 500;
		opacity: 0.85;
	}

	.settings-dialog {
		padding: 0;
		border: none;
		background: transparent;
		max-width: min(28rem, calc(100vw - 1.5rem));
		width: 100%;
		color: var(--fg);
		font-family: var(--ui);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		line-height: var(--leading-ui);
	}

	.settings-dialog::backdrop {
		background: color-mix(in srgb, var(--bg) 55%, transparent);
		backdrop-filter: blur(10px);
	}

	.settings-sheet {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.1rem 1.15rem 1.25rem;
		border: 1px solid var(--hairline);
		border-radius: 1rem;
		background: var(--glass);
		backdrop-filter: blur(22px);
		box-shadow: 0 22px 50px color-mix(in srgb, var(--bg) 70%, transparent);
	}

	.settings-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.settings-title {
		margin: 0;
		font: inherit;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: var(--tracking-ui);
	}

	.settings-close {
		font: inherit;
		font-size: 13px;
		color: var(--gold);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.hud-cluster {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.28rem;
		min-width: 0;
	}

	.hud-cluster-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		min-width: 0;
	}

	.narrow {
		display: none;
	}

	.music {
		font: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.34rem 0.8rem;
		white-space: nowrap;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--bg) 35%, transparent);
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

	.voice {
		color: var(--fg-faint);
		gap: 0.45rem;
	}

	.voice.on {
		color: var(--gold);
	}

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
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-dim);
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mode,
	.scope,
	.lang {
		display: flex;
		gap: 1px;
		padding: 2px;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--bg) 35%, transparent);
		flex-shrink: 0;
	}

	.ep-pick {
		display: flex;
		min-width: 0;
		max-width: min(16rem, 60vw);
	}

	.ep-pick :global(.trigger) {
		width: 100%;
		height: 1.95rem;
	}

	.mode button,
	.scope button,
	.lang button {
		font: inherit;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		color: var(--fg-faint);
		background: transparent;
		border: none;
		border-radius: var(--radius-pill);
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

	.edit-flag {
		margin: 0;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
		text-transform: none;
		color: var(--on-gold);
		background: var(--gold);
		border: 1px solid var(--gold);
		border-radius: var(--radius-pill);
		padding: 0.3rem 0.65rem;
	}

	.nav-wrap :global(.site-nav) {
		gap: 0.28rem;
	}

	.nav-wrap :global(.site-nav a) {
		padding: 0.3rem 0.55rem;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-ui);
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
	}

	@media (max-width: 700px) {
		.track {
			display: none;
		}

		.hud {
			top: max(0.45rem, env(safe-area-inset-top, 0px));
			right: max(0.55rem, env(safe-area-inset-right, 0px));
		}

		.wide {
			display: none;
		}

		.narrow {
			display: inline;
		}

		.mode button,
		.scope button,
		.lang button,
		.music,
		/* Same glass pill as the menu button, so prose never reads through it. */
		.settings-text,
		.theme-text {
			min-height: 2.75rem;
			padding: 0 0.85rem;
			border: 1px solid var(--hairline);
			border-radius: var(--radius-pill);
			background: var(--glass);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}
	}
</style>
