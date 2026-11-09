<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import BookCatalog from '$lib/components/books/BookCatalog.svelte';
	import ChapterRail from '$lib/components/books/ChapterRail.svelte';
	import BooksStage from '$lib/components/BooksStage.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { editUi } from '$lib/editUi.svelte';
	import { volumeOf, type BookMode } from '$lib/books';
	import { reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';

	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let mode = $state<BookMode>('shelf');
	let ko = $derived(reading.lang === 'ko');
	let still = $derived(prefersReducedMotion.current);
	let duration = $derived(still ? 0 : 1);

	function pick(id: string) {
		selected = id;
	}

	function back() {
		selected = null;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && selected) back();
	}

	onMount(() => {
		const id = page.url.searchParams.get('v');
		if (id && volumeOf(id)) pick(id);
		const hash = page.url.hash.replace(/^#/, '');
		if (hash) {
			requestAnimationFrame(() => {
				document.getElementById(hash)?.scrollIntoView({ block: 'start' });
			});
		}
	});
</script>

<svelte:head>
	<title>{ko ? '읽기' : 'Read'} — King for All</title>
	<meta
		name="description"
		content="The chronicle shelf and every episode — open a volume in 3D, or scroll the chapter list to read."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class={['library', { edit: editUi.enabled, spread: mode === 'display' }]}>
	<SiteNavSpace />
	<div class="floor">
		<aside class="side">
			<div class="rail-hold" inert={!!selected}>
				<ChapterRail bind:hovered onpick={pick} />
			</div>
			{#if selected}
				<div
					class="detail"
					in:fly={{ y: 10, duration: 460 * duration, delay: 80 * duration, easing: cubicOut }}
					out:fade={{ duration: 160 * duration }}
				>
					<button type="button" class="back" aria-label={ui('Back')} onclick={back}>
						<span class="material-symbols-outlined" aria-hidden="true">arrow_back</span>
						{ui('Back')}
					</button>
					<div class="detail-body">
						<BookCatalog {selected} {ko} />
					</div>
				</div>
			{/if}
		</aside>
		<div class="stage-col">
			<BooksStage bind:hovered bind:selected bind:mode onopen={pick} onback={back} />
		</div>
	</div>
</main>

<style lang="scss">
	.library {
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

	.floor {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.35fr);
		gap: 0;
		flex: 1;
		min-height: 0;
		overflow: hidden;
		transition: grid-template-columns 0.72s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.library.spread .floor {
		grid-template-columns: minmax(0, 0fr) minmax(0, 1fr);
	}

	.stage-col {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		background: transparent;
	}

	.side {
		position: relative;
		display: grid;
		min-width: 18rem;
		min-height: 0;
		overflow: hidden;
		border-right: 1px solid var(--hairline);
		background: transparent;
		transition:
			opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.5s ease,
			min-width 0.72s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.library.spread .side {
		min-width: 0;
		opacity: 0;
		border-color: transparent;
		pointer-events: none;
	}

	.rail-hold,
	.detail {
		grid-area: 1 / 1;
		min-width: 0;
		min-height: 0;
		height: 100%;
		overflow: hidden;
	}

	.detail {
		z-index: 1;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--fg);
	}

	.detail-body {
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		flex: none;
		align-self: flex-start;
		margin: 1rem 1.35rem 0.35rem 1rem;
		padding: 0.35rem 0.55rem 0.35rem 0.4rem;
		border: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--fg) 6%, transparent);
		color: var(--fg-dim);
		font-family: var(--ui);
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		cursor: pointer;
		& .material-symbols-outlined {
			font-size: 1rem;
		}
		&:hover, &:focus-visible {
			color: var(--fg-strong);
			background: color-mix(in srgb, var(--gold) 18%, transparent);
			outline: none;
		}
	}

	@media (max-width: 860px) {
		.library {
			height: auto;
			min-height: 100dvh;
			overflow: visible;
		}
		.floor {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: minmax(22rem, auto) min(58vh, 28rem);
			overflow: visible;
			transition: grid-template-rows 0.72s cubic-bezier(0.22, 1, 0.36, 1);
		}
		.side {
			min-width: 0;
			border-right: 0;
			border-bottom: 1px solid var(--hairline);
			height: auto;
			min-height: 22rem;
			overflow: visible;
		}
		.stage-col {
			height: min(58vh, 28rem);
			min-height: 16rem;
		}
		.rail-hold,
		.detail {
			height: auto;
			min-height: 22rem;
		}
		.library.spread .floor {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 0fr minmax(0, 1fr);
		}
		.library.spread .side {
			min-height: 0;
			height: 0;
			border: 0;
			overflow: hidden;
		}
		.library.spread .stage-col {
			height: min(72vh, 36rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.floor,
		.side {
			transition: none;
		}
	}
</style>
