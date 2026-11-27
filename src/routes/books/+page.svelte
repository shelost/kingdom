<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import BookCatalog from '$lib/components/books/BookCatalog.svelte';
	import ChapterRail from '$lib/components/books/ChapterRail.svelte';
	import OpenVolume from '$lib/components/books/OpenVolume.svelte';
	import BooksStage from '$lib/components/BooksStage.svelte';
	import SiteNavSpace from '$lib/components/SiteNavSpace.svelte';
	import { editUi } from '$lib/editUi.svelte';
	import { volumeOf, type BookMode, type BookSeries } from '$lib/books';
	import { plateTab, reading } from '$lib/reading.svelte';
	import { ui } from '$lib/uiLang';

	let hovered = $state<string | null>(null);
	let selected = $state<string | null>(null);
	let open = $state(false);
	let mode = $state<BookMode>('shelf');
	const SHELVES: { id: BookSeries; en: string; ko: string; titleEn: string; titleKo: string; sub: string }[] = [
		{ id: 'chronicle', en: 'King for All', ko: '삼한왕검', titleEn: 'Read', titleKo: '읽기', sub: 'King for All' },
		{ id: 'godking', en: 'The God King', ko: '후삼제왕', titleEn: 'The God King', titleKo: '후삼제왕', sub: 'King for All Shores' },
		{ id: 'reignmaker', en: 'Kingmaker', ko: '태종대왕', titleEn: 'Kingmaker', titleKo: '태종대왕', sub: 'Yi Bang-Won' },
		{ id: 'ourland', en: 'Breaking', ko: '대한사람', titleEn: 'Breaking', titleKo: '대한사람', sub: '1876–1910' },
		{ id: 'seed', en: 'Seed', ko: '씨알소리', titleEn: 'Seed', titleKo: '씨알소리', sub: 'Ham Seok-heon' },
		{ id: 'all', en: 'All', ko: '모두', titleEn: 'All', titleKo: '모두', sub: 'Every book' }
	];

	function seriesFrom(param: string | null): BookSeries {
		if (param === 'godking' || param === 'reignmaker' || param === 'ourland' || param === 'seed' || param === 'all') return param;
		return 'chronicle';
	}

	let series = $state<BookSeries>(seriesFrom(page.url.searchParams.get('shelf')));
	let ko = $derived(reading.lang === 'ko');
	let shelfMeta = $derived(SHELVES.find((s) => s.id === series) ?? SHELVES[0]);
	let still = $derived(prefersReducedMotion.current);
	let duration = $derived(still ? 0 : 1);

	function shelfUrl(id: string | null, opened: boolean) {
		const q = new URLSearchParams();
		if (series !== 'chronicle') q.set('shelf', series);
		if (id) q.set('v', id);
		if (id && opened) q.set('open', '1');
		const qs = q.toString();
		return `${resolve('/books')}${qs ? `?${qs}` : ''}`;
	}

	function syncUrl(id: string | null, opened: boolean) {
		const href = shelfUrl(id, opened);
		if (page.url.pathname + page.url.search === href) return;
		void goto(href, { replaceState: true, keepFocus: true, noScroll: true });
	}

	function pick(id: string) {
		if (!volumeOf(id)) return;
		selected = id;
		open = false;
		syncUrl(id, false);
	}

	function openBook() {
		if (!selected || !volumeOf(selected)) return;
		open = true;
		syncUrl(selected, true);
	}

	function closeBook() {
		open = false;
		syncUrl(selected, false);
	}

	function back() {
		if (open) {
			closeBook();
			return;
		}
		selected = null;
		syncUrl(null, false);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && (selected || open)) {
			e.preventDefault();
			back();
		}
	}

	/** Deep links (`?v=` / `?open=1`) stay in sync on client navigations too. */
	function chooseSeries(next: BookSeries) {
		if (series === next) return;
		series = next;
		selected = null;
		open = false;
		hovered = null;
		const q = new URLSearchParams(page.url.searchParams);
		if (next === 'chronicle') q.delete('shelf');
		else q.set('shelf', next);
		q.delete('v');
		q.delete('open');
		const qs = q.toString();
		void goto(`${resolve('/books')}${qs ? `?${qs}` : ''}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	$effect(() => {
		const want = seriesFrom(page.url.searchParams.get('shelf'));
		if (series !== want) series = want;
		const id = page.url.searchParams.get('v');
		const wantOpen = page.url.searchParams.get('open') === '1';
		if (id && volumeOf(id)) {
			if (selected !== id) selected = id;
			if (open !== wantOpen) open = wantOpen;
		} else if (!id && (selected || open)) {
			selected = null;
			open = false;
		}
	});

	onMount(() => {
		const hash = page.url.hash.replace(/^#/, '');
		if (!hash) return;
		requestAnimationFrame(() => {
			document.getElementById(hash)?.scrollIntoView({ block: 'start' });
		});
	});
</script>

<svelte:head>
	<title>{plateTab(shelfMeta.titleEn, shelfMeta.titleKo)} — {shelfMeta.sub}</title>
	<meta
		name="description"
		content="The chronicle shelf and every episode — open a volume in 3D, flip through its leaves, or jump into /read."
	/>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class={['library', { edit: editUi.enabled, spread: mode === 'display', open }]}>
	<SiteNavSpace />
	<div class="floor">
		<aside class="side">
			<div class="rail-hold" inert={!!selected}>
				<div class="series" role="group" aria-label={plateTab('Series', '시리즈')}>
					{#each SHELVES as shelf (shelf.id)}
						<button type="button" class={{ on: series === shelf.id }} onclick={() => chooseSeries(shelf.id)}>
							{plateTab(shelf.en, shelf.ko)}
						</button>
					{/each}
				</div>
				<ChapterRail bind:hovered {series} onpick={pick} />
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
						<BookCatalog {selected} {ko} onOpenBook={open ? undefined : openBook} />
					</div>
				</div>
			{/if}
		</aside>
		<div class="stage-col">
			<BooksStage bind:hovered bind:selected bind:mode {series} onopen={pick} onback={back} />
			{#if selected && open}
				{#key selected}
					<OpenVolume volumeId={selected} {ko} onclose={closeBook} />
				{/key}
			{/if}
		</div>
	</div>
</main>

<style lang="scss">
	.library {
		--books-gold: var(--gold);
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
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
		width: min(92rem, calc(100% - 3rem));
		min-height: 0;
		overflow: hidden;
		transition: grid-template-columns 0.72s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.library.spread .floor,
	.library.open .floor {
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.45fr);
	}

	.library.spread:not(.open) .floor {
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
		background: transparent;
		transition:
			opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
			min-width 0.72s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.library.spread:not(.open) .side {
		min-width: 0;
		opacity: 0;
		pointer-events: none;
	}

	.series {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0.55rem 0.7rem 0.2rem;
		button {
			border: 1px solid color-mix(in srgb, var(--fg) 18%, transparent);
			border-radius: 2px;
			background: transparent;
			color: var(--fg-dim);
			font-family: var(--ui);
			font-size: 0.72rem;
			letter-spacing: 0.04em;
			padding: 0.28rem 0.55rem;
			cursor: pointer;
			&.on {
				color: var(--fg-strong);
				border-color: color-mix(in srgb, var(--accent, var(--gold)) 55%, transparent);
				background: color-mix(in srgb, var(--accent, var(--gold)) 16%, transparent);
			}
		}
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
			height: auto;
			min-height: 22rem;
			overflow: visible;
		}
		.stage-col {
			height: min(58vh, 28rem);
			min-height: 16rem;
		}
		.library.open .stage-col {
			height: min(72vh, 40rem);
		}
		.rail-hold,
		.detail {
			height: auto;
			min-height: 22rem;
		}
		.library.spread:not(.open) .floor {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 0fr minmax(0, 1fr);
		}
		.library.spread:not(.open) .side {
			min-height: 0;
			height: 0;
			border: 0;
			overflow: hidden;
		}
		.library.spread:not(.open) .stage-col {
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
