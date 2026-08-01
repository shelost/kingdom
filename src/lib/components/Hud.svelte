<script lang="ts">
	import { reading, setLang, loadLang, type Lang } from '$lib/reading.svelte';
	import { onMount } from 'svelte';

	const LANGS: { id: Lang; label: string; hint: string }[] = [
		{ id: 'both', label: 'A/한', hint: 'Show everything' },
		{ id: 'en', label: 'EN', hint: 'English narration only' },
		{ id: 'ko', label: '한', hint: 'Korean dialogue only' }
	];

	onMount(loadLang);
</script>

<div class="hud">
	<!-- ————— now playing ————— -->
	<div class="music" class:on={!!reading.music} aria-live="polite">
		<span class="wave" aria-hidden="true">
			<i style:--d="0ms"></i><i style:--d="180ms"></i><i style:--d="330ms"></i>
			<i style:--d="90ms"></i><i style:--d="260ms"></i>
		</span>
		<span class="track">{reading.music ?? 'no track'}</span>
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

	/* ————— language toggle ————— */
	.lang {
		display: flex;
		gap: 1px;
		padding: 2px;
		border: 1px solid var(--hairline);
		border-radius: 999px;
		background: rgba(22, 22, 25, 0.78);
		backdrop-filter: blur(14px);
	}

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

	.lang button:hover {
		color: var(--fg);
	}

	.lang button.active {
		color: #14140f;
		background: var(--gold);
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
