<script lang="ts">
	import {
		activeLyricIndex,
		lyricsForScene,
		lyricsIdOfScene,
		playerTimeForLyric
	} from '$lib/lyrics';
	import { music, seek } from '$lib/music.svelte';
	import type { Scene } from '$lib/scenes';

	let {
		scene,
		live = false,
		layout = 'side',
		onplay
	}: {
		scene: Scene | null;
		/** Only the active feed panel should drive highlight + seek. */
		live?: boolean;
		/** `side`: a column beside the still. `full`: the whole box, large lines (phone Now Playing). */
		layout?: 'side' | 'full';
		/** Arm / ensure the scene track is playing before a lyric jump. */
		onplay?: () => void;
	} = $props();

	let scrollHost = $state<HTMLElement | null>(null);
	let reduceMotion = $state(false);
	/** Lyrics id whose column is showing the recording instead of the scene lines. */
	let originalFor = $state<string | null>(null);

	let lyricsId = $derived(scene ? lyricsIdOfScene(scene) : null);
	let track = $derived(scene ? lyricsForScene(scene) : null);
	let lines = $derived(track?.lines ?? []);
	let hasSceneLines = $derived(lines.some((line) => !!line.scene));
	let showOriginal = $derived(!!lyricsId && originalFor === lyricsId);
	let offset = $derived(track?.offset ?? 0);
	let activeIndex = $derived(
		live ? activeLyricIndex(lines, music.currentTime, offset) : -1
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			reduceMotion = mq.matches;
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	$effect(() => {
		if (!live) return;
		const host = scrollHost;
		const idx = activeIndex;
		if (!track || !host || idx < 0) return;
		const el = host.querySelector<HTMLElement>(`[data-lyric-index="${idx}"]`);
		if (!el) return;
		const top = el.offsetTop - host.clientHeight / 2 + el.clientHeight / 2;
		host.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
	});

	function lineText(line: { text: string; scene?: string }) {
		if (showOriginal || !line.scene) return line.text;
		return line.scene;
	}

	function isNote(line: { text: string; scene?: string }) {
		const t = lineText(line).trim();
		return t.length > 0 && /^[♪♩♫♬\s]+$/u.test(t);
	}

	function toggleOriginal() {
		originalFor = showOriginal ? null : lyricsId;
	}

	function jumpToLine(lineT: number, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!live) return;
		onplay?.();
		const target = playerTimeForLyric(lineT, offset);
		seek(target);
	}
</script>

{#if live && scene && track && lines.length > 0}
	<div class="col" class:full={layout === 'full'} aria-label="Lyrics">
		{#if hasSceneLines}
			<button
				type="button"
				class="source"
				aria-pressed={showOriginal}
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					toggleOriginal();
				}}
			>
				{showOriginal ? 'Scene' : 'Original'}
			</button>
		{/if}
		<div class="scroller" bind:this={scrollHost}>
			{#each lines as line, i (i)}
				<button
					type="button"
					class="line"
					class:active={i === activeIndex}
					class:past={activeIndex > i}
					data-lyric-index={i}
					onclick={(e) => jumpToLine(line.t, e)}
				>
					{lineText(line) || '…'}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.col {
		position: absolute;
		z-index: 4;
		top: 2.6rem;
		right: 0;
		bottom: 0.4rem;
		width: min(22rem, 42%);
		display: flex;
		align-items: stretch;
		pointer-events: none;
	}

	.source {
		pointer-events: auto;
		position: absolute;
		top: 0.35rem;
		right: 0.85rem;
		z-index: 2;
		appearance: none;
		border: none;
		background: transparent;
		padding: 0.15rem 0;
		color: rgba(255, 255, 255, 0.72);
		font-family: var(--ui);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-shadow: 0 1px 8px #000;
		cursor: pointer;
	}

	.source:hover {
		color: #fff;
	}

	.scroller {
		position: relative;
		pointer-events: auto;
		min-height: 0;
		width: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: none;
		padding: 12% 1.15rem 18% 1.35rem;
		box-sizing: border-box;
		mask-image: linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
	}

	.scroller::-webkit-scrollbar {
		display: none;
	}

	.line {
		appearance: none;
		display: block;
		width: 100%;
		border: none;
		background: transparent;
		margin: 0;
		padding: 0.28rem 0;
		text-align: left;
		cursor: pointer;
		color: #fff;
		font-family: var(--ui);
		font-size: 0.92rem;
		font-weight: 500;
		line-height: 1.35;
		letter-spacing: -0.01em;
		text-shadow: 0 1px 10px #000;
		opacity: 0.38;
	}

	.line.past {
		opacity: 0.22;
	}

	.line.active {
		opacity: 1;
		font-weight: 600;
	}

	.line:hover {
		opacity: 0.72;
	}

	.line.active:hover {
		opacity: 1;
	}

	@media (max-width: 720px) {
		.col {
			width: min(11.5rem, 48%);
			top: 2.2rem;
		}

		.scroller {
			padding-right: 0.7rem;
			padding-left: 0.7rem;
		}

		.line {
			font-size: 0.72rem;
		}
	}

	.col.full {
		top: 0;
		left: 0;
		bottom: 0;
		width: auto;
	}

	.full .scroller {
		padding: 22% 1.1rem 30%;
	}

	.full .line {
		padding: 0.4rem 0;
		font-size: 1.28rem;
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	/* Below the still's segment bars. */
	.full .source {
		top: 1.9rem;
		right: 1.1rem;
	}
</style>
