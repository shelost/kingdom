<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { chapters, entryId, partId, scenesOf } from '$lib/story';
	import { TOC_DURATION_MS, saveTocAnchor, loadTocAnchor, beginTocJump, endTocJump } from '$lib/tocUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import {
		reading,
		episodes,
		goToEpisodeById,
		syncEpisodeFromHash,
		canonicalHashId,
		findStoryHeading,
		scrollToStoryHeading
	} from '$lib/reading.svelte';

	/** Bound by the story layout so the reading shell + plate shift together. */
	let { open = $bindable(false) } = $props();

	/** Scroll-driven markers (full scope); episodes mode overlays via derived. */
	let scrollActive = $state(chapters[0]?.id);
	let scrollActiveEntry = $state('');
	let scrollProgress = $state(0);

	let active = $derived(
		reading.viewScope === 'episodes'
			? (episodes[reading.episodeIndex]?.chapterId ?? chapters[0]?.id)
			: scrollActive
	);
	let activeEntry = $derived(
		reading.viewScope === 'episodes'
			? (episodes[reading.episodeIndex]?.id ?? '')
			: scrollActiveEntry
	);
	let progress = $derived(
		reading.viewScope === 'episodes'
			? episodes.length > 1
				? reading.episodeIndex / (episodes.length - 1)
				: 1
			: scrollProgress
	);

	let refreshObservers: (() => void) | undefined;

	/** Episode ids whose scene lists the reader opened or closed by hand. */
	const opened = new SvelteSet<string>();
	const closed = new SvelteSet<string>();

	/* ————— panel scroll persistence ————— */

	let panelEl: HTMLDivElement | undefined = $state();
	let panelScrollRaf = 0;
	let restoreTimer: ReturnType<typeof setTimeout> | undefined;

	/**
	 * Record the topmost visible panel item + its offset from the panel top,
	 * so the same item can be re-anchored on reopen (even after the component
	 * is destroyed and recreated, or the panel width changes between reopens).
	 */
	function captureAnchor() {
		if (!panelEl || !open) return;
		const panelTop = panelEl.getBoundingClientRect().top;
		for (const item of panelEl.querySelectorAll<HTMLElement>('[data-toc-id]')) {
			const r = item.getBoundingClientRect();
			if (r.bottom > panelTop + 1) {
				saveTocAnchor({ id: item.dataset.tocId ?? '', delta: r.top - panelTop });
				return;
			}
		}
	}

	/** Scroll the panel so the saved anchor item sits at its saved offset. */
	function restoreAnchor() {
		if (!panelEl) return;
		const anchor = loadTocAnchor();
		if (!anchor) return;
		const item = panelEl.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(anchor.id)}"]`);
		if (!item) return;
		const panelTop = panelEl.getBoundingClientRect().top;
		panelEl.scrollTop += item.getBoundingClientRect().top - panelTop - anchor.delta;
	}

	function onPanelScroll() {
		if (panelScrollRaf) return;
		panelScrollRaf = requestAnimationFrame(() => {
			panelScrollRaf = 0;
			captureAnchor();
		});
	}

	/**
	 * Re-anchor whenever the TOC opens: once right away, and once more after
	 * the open transition settles in case layout shifts during the animation.
	 */
	$effect(() => {
		if (!open) return;
		const raf = requestAnimationFrame(restoreAnchor);
		if (restoreTimer) clearTimeout(restoreTimer);
		restoreTimer = setTimeout(() => {
			restoreAnchor();
			restoreTimer = undefined;
		}, TOC_DURATION_MS + 32);
		return () => cancelAnimationFrame(raf);
	});

	onMount(() => {
		if (reading.mode === 'script') open = true;

		const io = new IntersectionObserver(
			(entries) => {
				if (reading.viewScope === 'episodes') return;
				for (const e of entries) if (e.isIntersecting) scrollActive = e.target.id;
			},
			// a chapter is "active" while it crosses the upper third of the screen
			{ rootMargin: '-15% 0px -70% 0px' }
		);

		// entry-level tracking + reading progress
		const ioEntry = new IntersectionObserver(
			(entries) => {
				if (reading.viewScope === 'episodes') return;
				for (const e of entries) if (e.isIntersecting) scrollActiveEntry = e.target.id;
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);

		refreshObservers = () => {
			io.disconnect();
			ioEntry.disconnect();
			for (const ch of chapters) {
				const el = document.getElementById(ch.id);
				if (el) io.observe(el);
			}
			for (const ch of chapters)
				for (const en of ch.entries) {
					const el = document.getElementById(entryId(ch.id, en.title));
					if (el) ioEntry.observe(el);
				}
		};
		refreshObservers();

		// Component recreated (e.g. route change): pre-scroll the hidden panel
		// so the saved anchor is already in place when the TOC next opens.
		restoreAnchor();

		const onScroll = () => {
			if (reading.viewScope === 'episodes') return;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			scrollProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('keydown', onKey);

		// Land on a hash target after load (navbar jump writes these).
		const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
		if (hash) {
			if (reading.viewScope === 'episodes') {
				syncEpisodeFromHash({ scroll: true });
			} else {
				const targetId = canonicalHashId(hash);
				const target = findStoryHeading(targetId);
				if (target) {
					requestAnimationFrame(() => {
						scrollToStoryHeading(target, 'auto');
						const entry = target.closest<HTMLElement>('article.entry') ?? target;
						markActive(entry, entry.id || targetId);
					});
				}
			}
		}

		return () => {
			io.disconnect();
			ioEntry.disconnect();
			refreshObservers = undefined;
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKey);
			if (restoreTimer) clearTimeout(restoreTimer);
			if (panelScrollRaf) cancelAnimationFrame(panelScrollRaf);
		};
	});

	/** Re-bind observers when returning to full scroll (entries remount). */
	$effect(() => {
		if (reading.viewScope !== 'full') return;
		const id = requestAnimationFrame(() => refreshObservers?.());
		return () => cancelAnimationFrame(id);
	});

	function markActive(el: HTMLElement, id: string) {
		const entry = el.classList.contains('entry')
			? el
			: el.closest<HTMLElement>('article.entry');
		if (entry) {
			scrollActiveEntry = entry.id;
			scrollActive = entry.closest('.chapter')?.id ?? scrollActive;
		} else {
			scrollActive = id;
			scrollActiveEntry = '';
		}
	}

	/**
	 * Jump to a chapter / episode / scene / part title. Click measures the
	 * title's document Y and scrolls the reading scroller — the TOC stays open
	 * (desktop push + mobile overlay). Overlay close is the toggle, or Escape.
	 */
	async function jump(id: string) {
		const gen = beginTocJump();
		try {
			const reduce =
				typeof matchMedia !== 'undefined' &&
				matchMedia('(prefers-reduced-motion: reduce)').matches;
			const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
			const dest = canonicalHashId(id);

			if (reading.viewScope === 'episodes') {
				const ok = goToEpisodeById(dest, { hash: true, scroll: false });
				if (!ok) return;
				await tick();
			}

			const go = () => {
				const el = findStoryHeading(dest);
				if (!el) return;
				markActive(el, dest);
				scrollToStoryHeading(el, behavior);
				try {
					history.replaceState(null, '', `#${encodeURIComponent(dest)}`);
				} catch {
					/* ignore */
				}
			};

			requestAnimationFrame(() => requestAnimationFrame(go));
		} finally {
			setTimeout(() => endTocJump(gen), 640);
		}
	}

	function scenesOpen(id: string) {
		if (closed.has(id)) return false;
		if (opened.has(id)) return true;
		return activeEntry === id;
	}

	function toggleExpand(id: string) {
		if (scenesOpen(id)) {
			closed.add(id);
			opened.delete(id);
		} else {
			opened.add(id);
			closed.delete(id);
		}
	}

	function toggle() {
		if (!scriptUi.inScript) return;
		open = !open;
	}
</script>

<div
	class="progress"
	class:in={scriptUi.inScript}
	style:transform="scaleX({progress})"
	aria-hidden="true"
></div>

<button
	class="toc-toggle"
	class:in={scriptUi.inScript}
	type="button"
	aria-expanded={open}
	aria-controls="toc-panel"
	aria-hidden={!scriptUi.inScript}
	tabindex={scriptUi.inScript ? 0 : -1}
	aria-label={open ? 'Close table of contents' : 'Open table of contents'}
	onclick={toggle}
>
	{open ? '✕' : '☰'}
</button>

<nav class="toc" class:open class:in={scriptUi.inScript} id="toc-panel" aria-label="Table of contents" aria-hidden={!open || !scriptUi.inScript}>
	<div class="panel" bind:this={panelEl} onscroll={onPanelScroll}>
		{#each chapters as ch, ci (ch.id)}
			{#if ch.part}
				<button
					type="button"
					class="panel-part"
					data-toc-id={partId(ch.id)}
					onclick={() => jump(partId(ch.id))}
				>
					{ch.part}
				</button>
			{/if}
			<button
				type="button"
				class="panel-item"
				class:active={active === ch.id}
				data-toc-id={ch.id}
				onclick={() => jump(ch.id)}
			>
				<span class="pi-title">
					<span class="pi-num">{ci + 1}</span>
					<span class="pi-dot" aria-hidden="true">·</span>
					{ch.title}
				</span>
				{#if ch.korean}<span class="pi-ko">{ch.korean}</span>{/if}
				{#if ch.range}<span class="pi-range">{ch.range}</span>{/if}
			</button>

			<div class="sub">
				{#each ch.entries as en, ei (ch.id + ei)}
					{@const eid = entryId(ch.id, en.title)}
					{@const scenes = scenesOf(en.blocks, eid)}
					{@const isOpen = scenesOpen(eid)}
					<div class="ep-block">
						<div class="ep-row">
							{#if scenes.length}
								<button
									type="button"
									class="ep-chevron"
									class:open={isOpen}
									aria-expanded={isOpen}
									aria-controls="toc-scenes-{eid}"
									aria-label={isOpen
										? `Hide scenes in ${en.title || 'Untitled'}`
										: `Show scenes in ${en.title || 'Untitled'}`}
									onclick={() => toggleExpand(eid)}
								></button>
							{:else}
								<span class="ep-chevron-spacer" aria-hidden="true"></span>
							{/if}
							<button
								type="button"
								class="sub-item"
								class:active={activeEntry === eid}
								data-toc-id={eid}
								onclick={() => jump(eid)}
							>
								<span class="si-year">{en.year || '·'}</span>
								<span class="si-title">{en.title || 'Untitled'}</span>
							</button>
						</div>
						{#if scenes.length && isOpen}
							<div class="scenes" id="toc-scenes-{eid}">
								{#each scenes as s (s.id)}
									<button
										type="button"
										class="scene-item"
										class:active={reading.sceneId === s.id}
										data-toc-id={s.id}
										onclick={() => jump(s.id)}
									>
										<span class="scene-title">{s.title}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</nav>

<style>
	/* ————— reading progress hairline ————— */
	.progress {
		position: fixed;
		inset: 0 0 auto 0;
		height: 2px;
		z-index: 100;
		background: var(--gold);
		transform-origin: 0 50%;
		will-change: transform;
		opacity: 0;
		transition: opacity 480ms var(--ease);
	}

	.progress.in {
		opacity: 1;
	}

	.toc-toggle {
		position: fixed;
		top: max(0.55rem, env(safe-area-inset-top, 0px));
		left: max(calc(22px + 0.2rem), env(safe-area-inset-left, 0px));
		z-index: 101;
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		font-size: 1.1rem;
		line-height: 1;
		color: color-mix(in srgb, var(--fg-strong) 92%, transparent);
		background: transparent;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 12px var(--bg);
		opacity: 0;
		transform: translate3d(0, -0.85rem, 0);
		pointer-events: none;
		transition:
			color 150ms ease,
			background 150ms ease,
			opacity 520ms var(--ease),
			transform 560ms var(--ease);
	}

	.toc-toggle.in {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}

	.toc-toggle.in:hover {
		color: var(--fg-strong);
		transform: scale(1.06);
	}

	@media (prefers-reduced-motion: reduce) {
		.progress,
		.toc-toggle {
			transition: opacity 200ms ease;
			transform: none;
		}

		.toc-toggle.in:hover {
			transform: none;
		}

		.ep-chevron::before {
			transition: none;
		}
	}

	.toc {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 100;
		isolation: isolate;
		width: min(var(--toc-w), 86vw);
		padding: 3.6rem 0.5rem 1.5rem calc(22px + 0.35rem);
		pointer-events: none;
		transform: translate3d(-10px, 0, 0);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity var(--toc-duration) var(--toc-ease),
			transform var(--toc-duration) var(--toc-ease),
			visibility 0s linear var(--toc-duration);
		will-change: transform, opacity;
	}

	.toc.open.in {
		pointer-events: auto;
		opacity: 1;
		visibility: visible;
		transform: translate3d(0, 0, 0);
		transition-delay: 0s;
	}

	.panel {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: transparent;
		padding: 0.2rem 0.4rem 1rem 0;
		scrollbar-width: thin;
		scrollbar-color: var(--scroll-thumb) transparent;
	}

	.panel-part {
		display: block;
		width: 100%;
		font-family: var(--serif);
		font-weight: 900;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-align: left;
		color: var(--gold);
		padding: 0.95rem 0.35rem 0.3rem;
		margin: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 14px var(--bg);
	}

	.panel-part:hover {
		color: color-mix(in srgb, var(--gold) 88%, white);
	}

	.panel-item {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		width: 100%;
		font: inherit;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 7px;
		padding: 0.42rem 0.45rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 80%, transparent);
		text-shadow:
			0 1px 2px var(--bg),
			0 0 12px var(--bg);
		transition: color 150ms ease;
	}

	.panel-item:hover {
		color: var(--fg-strong);
	}

	.panel-item.active {
		color: var(--fg-strong);
	}

	.pi-title {
		font-family: var(--serif);
		font-weight: 700;
		font-size: 0.88rem;
		letter-spacing: var(--tracking-display);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pi-num {
		font-variant-numeric: tabular-nums;
		color: var(--gold);
	}

	.pi-dot {
		margin: 0 0.28em;
		opacity: 0.45;
	}

	.pi-ko {
		font-size: 0.7rem;
		opacity: 0.55;
		flex-shrink: 0;
	}

	.pi-range {
		margin-left: auto;
		font-family: var(--serif);
		font-size: 0.72rem;
		opacity: 0.5;
		flex-shrink: 0;
	}

	.sub {
		margin-left: 0.55rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
	}

	.ep-row {
		display: flex;
		align-items: flex-start;
		gap: 0.05rem;
	}

	.ep-row .sub-item {
		flex: 1;
		min-width: 0;
	}

	.ep-chevron,
	.ep-chevron-spacer {
		flex-shrink: 0;
		width: 1.2rem;
		height: 1.55rem;
		padding: 0;
		margin-top: 0.08rem;
		background: transparent;
		border: none;
	}

	.ep-chevron {
		display: grid;
		place-items: center;
		cursor: pointer;
		color: color-mix(in srgb, var(--gold) 78%, transparent);
		-webkit-tap-highlight-color: transparent;
	}

	.ep-chevron::before {
		content: '';
		display: block;
		width: 0.38rem;
		height: 0.38rem;
		border-right: 1.5px solid currentColor;
		border-bottom: 1.5px solid currentColor;
		transform: rotate(-45deg);
		transition: transform 180ms ease;
	}

	.ep-chevron.open::before {
		transform: rotate(45deg);
	}

	.ep-chevron:hover {
		color: var(--gold);
	}

	.sub-item {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		width: 100%;
		font: inherit;
		font-size: 0.76rem;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 6px;
		padding: 0.22rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 55%, transparent);
		text-shadow:
			0 1px 2px var(--bg),
			0 0 10px var(--bg);
		transition: color 150ms ease;
	}

	.sub-item:hover {
		color: color-mix(in srgb, var(--fg) 92%, transparent);
	}

	.sub-item.active {
		color: var(--fg-strong);
	}

	.si-year {
		flex-shrink: 0;
		width: 2.7em;
		font-family: var(--serif);
		letter-spacing: 0;
		opacity: 0.8;
	}

	.si-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-display);
	}

	.scenes {
		margin: 0.08rem 0 0.28rem 1.25rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--gold) 26%, transparent);
	}

	.scene-item {
		display: flex;
		align-items: baseline;
		width: 100%;
		font: inherit;
		font-size: 0.7rem;
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 6px;
		padding: 0.16rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 42%, transparent);
		text-shadow:
			0 1px 2px var(--bg),
			0 0 10px var(--bg);
		transition: color 150ms ease;
	}

	.scene-item:hover {
		color: color-mix(in srgb, var(--fg) 88%, transparent);
	}

	.scene-item.active {
		color: var(--gold);
	}

	.scene-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-display);
	}

	/* Overlay (no padding push below 1000px): a sheet so inline art behind
	   the panel cannot show through. Desktop push relies on .reading-clip. */
	@media (max-width: 1000px) {
		.toc.open.in {
			background: linear-gradient(
				90deg,
				color-mix(in srgb, var(--panel-sunken) 96%, transparent) 0%,
				color-mix(in srgb, var(--panel-sunken) 88%, transparent) 68%,
				color-mix(in srgb, var(--panel-sunken) 55%, transparent) 88%,
				transparent 100%
			);
		}
	}

	@media (max-width: 820px) {
		.toc-toggle {
			/* Top-left stays clear of Hud; size is thumb-friendly (≥44px). */
			top: max(0.4rem, env(safe-area-inset-top, 0px));
			left: max(0.35rem, env(safe-area-inset-left, 0px));
			width: 2.75rem;
			height: 2.75rem;
			background: var(--glass);
			backdrop-filter: blur(10px);
			border: 1px solid var(--hairline);
		}

		.toc {
			padding: max(3.6rem, calc(env(safe-area-inset-top, 0px) + 3rem)) 0.5rem
				max(1.5rem, env(safe-area-inset-bottom, 0px)) max(0.55rem, env(safe-area-inset-left, 0px));
			width: min(20rem, 92vw);
		}

		.panel-item {
			min-height: 2.75rem;
			padding: 0.55rem 0.5rem;
		}

		.panel-part {
			min-height: 2.5rem;
			padding: 0.7rem 0.5rem 0.35rem;
		}

		.sub-item {
			min-height: 2.5rem;
			padding: 0.45rem 0.45rem;
			font-size: 0.8rem;
		}

		.ep-chevron,
		.ep-chevron-spacer {
			width: 2.5rem;
			height: 2.5rem;
			margin-top: 0;
		}

		.scene-item {
			min-height: 2.5rem;
			padding: 0.4rem 0.45rem;
			font-size: 0.76rem;
		}
	}
</style>
