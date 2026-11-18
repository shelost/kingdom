<script lang="ts">
	/**
	 * Bare Threlte shelf for Ovid's Home bento — no site chrome, just the
	 * window looking onto the books. Clicks post the volume (and its first
	 * episode) to the opener so Ovid can open Write.
	 */
	import { onMount } from 'svelte';
	import BooksStage from '$lib/components/BooksStage.svelte';
	import { volumeOf, type BookMode } from '$lib/books';

	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let mode = $state<BookMode>('shelf');

	function tellOpener(type: string, detail: Record<string, string | null>) {
		if (typeof window === 'undefined' || window.parent === window) return;
		window.parent.postMessage({ source: 'kingdom-shelf', type, ...detail }, '*');
	}

	function pick(id: string) {
		const volume = volumeOf(id);
		const episode = volume?.chapters[0];
		// Stay on the shelf — Ovid's Home is a window, not the full library.
		tellOpener('open', {
			volumeId: id,
			episodeId: episode?.id ?? null,
			queryId: episode?.queryId ?? volume?.queryId ?? null
		});
	}

	function back() {
		selected = null;
		tellOpener('back', { volumeId: null, episodeId: null, queryId: null });
	}

	onMount(() => {
		tellOpener('ready', { volumeId: null, episodeId: null, queryId: null });
	});
</script>

<svelte:head>
	<title>Shelf</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="embed">
	<BooksStage bind:hovered bind:selected bind:mode compact onopen={pick} onback={back} />
</div>

<style lang="scss">
	:global(html),
	:global(body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		background: transparent;
	}

	.embed {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		min-height: 100dvh;
		overflow: hidden;
		background: transparent;
	}

	/* The bento is the chrome; hide Shelf/Display and part labels inside the pane. */
	.embed :global(.chrome),
	.embed :global(.parts) {
		display: none !important;
	}
</style>
