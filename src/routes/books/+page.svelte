<script lang="ts">
	import { onDestroy } from 'svelte';
	import BookCatalog from '$lib/components/books/BookCatalog.svelte';
	import BooksStage from '$lib/components/BooksStage.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { editUi } from '$lib/editUi.svelte';
	import type { BookMode } from '$lib/books';
	import { reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';

	const PANE_MS = 420;

	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	/** Split layout (rail + stage). Held through the pane fade so the canvas does not resize mid-tween. */
	let spread = $state(false);
	let pane = $state(false);
	let mode = $state<BookMode>('shelf');
	let ko = $derived(reading.lang === 'ko');
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let openFrame = 0;

	function reduced() {
		return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function pick(id: string) {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = undefined;
		}
		if (openFrame) cancelAnimationFrame(openFrame);
		selected = id;
		spread = true;
		if (reduced()) {
			pane = true;
			return;
		}
		openFrame = requestAnimationFrame(() => {
			openFrame = 0;
			pane = true;
		});
	}

	function back() {
		if (!spread && !selected) return;
		if (openFrame) {
			cancelAnimationFrame(openFrame);
			openFrame = 0;
		}
		pane = false;
		if (reduced()) {
			selected = null;
			spread = false;
			return;
		}
		if (closeTimer) clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			closeTimer = undefined;
			selected = null;
			spread = false;
		}, PANE_MS);
	}

	onDestroy(() => {
		if (closeTimer) clearTimeout(closeTimer);
		if (openFrame) cancelAnimationFrame(openFrame);
	});

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && (selected || spread)) back();
	}
</script>

<svelte:head>
	<title>{ko ? '책' : 'Books'} — Kingdom</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class="books" class:edit={editUi.enabled} class:open={spread} class:show={pane}>
	<SiteNavSpace />
	{#if spread}
		<button type="button" class="back" class:in={pane} aria-label={ui('Back')} onclick={back}>
			<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
		</button>
	{/if}
	<div class="floor">
		{#if selected}
			<button type="button" class="dismiss" aria-label={ui('Back')} onclick={back}></button>
		{/if}
		<div class="stage-col">
			<BooksStage bind:hovered bind:selected bind:mode onopen={pick} onback={back} />
		</div>
		<aside class="catalog-col" inert={!pane} aria-hidden={!pane ? 'true' : undefined}>
			<div class="catalog-pane">
				<BookCatalog {selected} {ko} />
			</div>
		</aside>
	</div>
</main>

<style>
	.books {
		--books-gold: var(--gold);
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;
		color: var(--fg);
		font-family: var(--ui);
		background: var(--bg);
	}

	.back {
		position: absolute;
		top: 4.35rem;
		left: max(1.1rem, env(safe-area-inset-left, 0px));
		z-index: 20;
		display: grid;
		place-items: center;
		width: 2.15rem;
		height: 2.15rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		backdrop-filter: blur(10px);
		color: var(--fg);
		cursor: pointer;
		opacity: 0;
		pointer-events: none;
		transition: opacity 420ms var(--ease);
	}

	.back.in {
		opacity: 1;
		pointer-events: auto;
	}

	.back .material-symbols-outlined {
		font-size: 1.2rem;
	}

	.back:hover,
	.back:focus-visible {
		background: color-mix(in srgb, var(--gold) 22%, transparent);
		color: var(--fg-strong);
		outline: none;
	}

	.floor {
		--pane: 20rem;
		--rail: 0px;
		position: relative;
		flex: 1;
		display: flex;
		justify-content: center;
		min-height: 0;
		overflow: hidden;
		padding: 0;
	}

	.books.edit .floor {
		--pane: 24rem;
	}

	.books.open .floor {
		--rail: var(--pane);
		padding: 0 3.75rem 0 1.5rem;
	}

	.dismiss {
		position: absolute;
		inset: 0;
		z-index: 0;
		border: 0;
		padding: 0;
		background: transparent;
		cursor: pointer;
	}

	.stage-col,
	.catalog-col {
		position: relative;
		z-index: 1;
		min-width: 0;
		min-height: 0;
		height: 100%;
		background: transparent;
	}

	.stage-col {
		flex: 1 1 auto;
		overflow: hidden;
	}

	.books.open .stage-col {
		flex: 0 1 30rem;
		max-width: 32rem;
	}

	.catalog-col {
		flex: 0 0 var(--rail);
		width: var(--rail);
		overflow: hidden;
		pointer-events: none;
	}

	.catalog-pane {
		width: var(--pane);
		height: 100%;
		opacity: 0;
		transform: translateX(0.85rem);
		pointer-events: none;
		transition:
			opacity 420ms var(--ease),
			transform 420ms var(--ease);
	}

	.books.show .catalog-col {
		pointer-events: auto;
		cursor: default;
	}

	.books.show .catalog-pane {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.back,
		.catalog-pane {
			transition: none;
		}
	}

	@media (max-width: 860px) {
		.books {
			height: auto;
			min-height: 100dvh;
			overflow: visible;
		}

		.floor,
		.books.edit .floor,
		.books.open .floor {
			flex-direction: column;
			padding: 0 1.15rem 1.25rem;
			height: auto;
			overflow: visible;
		}

		.stage-col,
		.books.open .stage-col {
			height: auto;
			min-height: 16rem;
			max-width: none;
			flex: 1 1 auto;
		}

		.floor,
		.books.edit .floor {
			--pane: min(48vh, 440px);
		}

		.catalog-col {
			flex: 0 0 var(--rail);
			width: 100%;
			height: var(--rail);
			max-height: none;
		}

		.catalog-pane {
			width: 100%;
			height: var(--pane);
			transform: translateY(0.7rem);
		}

		.back {
			top: 0.75rem;
		}
	}
</style>
