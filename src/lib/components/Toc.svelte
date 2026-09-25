<script lang="ts">
	import { onMount } from 'svelte';
	import { chapters, entryId, partId } from '$lib/story';
	import { entryForReading } from '$lib/nsfwUi.svelte';
	import { branchContains, spineEntries, spineLabel, tocLeavesFor } from '$lib/tocTree';
	import { TOC_DURATION_MS, saveTocAnchor, loadTocAnchor, beginTocJump, endTocJump, tocUi, loadTocFloating } from '$lib/tocUi.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import {
		reading,
		episodes,
		canonicalHashId,
		findStoryHeading,
		goToEpisodeById,
		resolveEpisodeIndex,
		scrollToStoryHeading,
		storyRoot,
		stripStoryHash
	} from '$lib/reading.svelte';
	import HudSearch from './HudSearch.svelte';
	import { isLoveEpisode } from '$lib/loveEpisodes';

	/** Bound by the story layout so the reading shell + plate shift together. */
	let { open = $bindable(true) } = $props();

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

	let panelEl: HTMLDivElement | undefined = $state();
	let pill = $state({ top: 0, left: 0, width: 0, height: 0, on: false });
	let lastPill = { top: 0, left: 0, width: 0, height: 0, on: false };
	let pillAt = $state('');

	/** Scene if one is live; otherwise the episode; otherwise the chapter. */
	let pillId = $derived(reading.sceneId || activeEntry || active || '');

	function findPillItem(): HTMLElement | null {
		if (!panelEl) return null;
		const ids = [pillId, activeEntry, active].filter(Boolean);
		for (const id of ids) {
			const item = panelEl.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(id)}"]`);
			if (!item || item.offsetParent === null) continue;
			if (item.getBoundingClientRect().height < 2) continue;
			return item;
		}
		return null;
	}

	function measurePill() {
		if (!panelEl || !open) {
			if (lastPill.on) {
				lastPill = { ...lastPill, on: false };
				pill = lastPill;
			}
			pillAt = '';
			return;
		}
		const item = findPillItem();
		if (!item) {
			if (lastPill.on) {
				lastPill = { ...lastPill, on: false };
				pill = lastPill;
			}
			pillAt = '';
			return;
		}
		const pr = panelEl.getBoundingClientRect();
		const ir = item.getBoundingClientRect();
		const next = {
			top: ir.top - pr.top + panelEl.scrollTop,
			left: ir.left - pr.left + panelEl.scrollLeft,
			width: ir.width,
			height: ir.height,
			on: true
		};
		const at = item.dataset.tocId ?? '';
		if (pillAt !== at) pillAt = at;
		if (
			lastPill.on &&
			Math.abs(lastPill.top - next.top) < 0.5 &&
			Math.abs(lastPill.left - next.left) < 0.5 &&
			Math.abs(lastPill.width - next.width) < 0.5 &&
			Math.abs(lastPill.height - next.height) < 0.5
		) {
			return;
		}
		lastPill = next;
		pill = next;
	}

	$effect(() => {
		pillId;
		activeEntry;
		open;
		tocUi.floating;
		if (!open) return;
		const raf1 = requestAnimationFrame(() => {
			measurePill();
			requestAnimationFrame(measurePill);
		});
		const t = setTimeout(measurePill, 360);
		return () => {
			cancelAnimationFrame(raf1);
			clearTimeout(t);
		};
	});

	$effect(() => {
		const el = panelEl;
		if (!el) return;
		const ro = new ResizeObserver(() => measurePill());
		ro.observe(el);
		return () => ro.disconnect();
	});

	/* ————— panel scroll persistence ————— */

	let panelScrollRaf = 0;
	let restoreTimer: ReturnType<typeof setTimeout> | undefined;
	let refreshObservers: (() => void) | undefined;

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
		loadTocFloating();
		const io = new IntersectionObserver(
			(entries) => {
				if (reading.viewScope === 'episodes') return;
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					const id = (e.target as HTMLElement).dataset.storyId;
					if (id) scrollActive = id;
				}
			},
			// a chapter is "active" while it crosses the upper third of the screen
			{ rootMargin: '-15% 0px -70% 0px' }
		);

		// entry-level tracking + reading progress
		const ioEntry = new IntersectionObserver(
			(entries) => {
				if (reading.viewScope === 'episodes') return;
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					const id = (e.target as HTMLElement).dataset.storyId;
					if (id) scrollActiveEntry = id;
				}
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);

		refreshObservers = () => {
			io.disconnect();
			ioEntry.disconnect();
			const script = storyRoot();
			if (!script) return;
			for (const ch of chapters) {
				const el = script.querySelector(`[data-story-id="${CSS.escape(ch.id)}"]`);
				if (el) io.observe(el);
			}
			for (const ch of chapters)
				for (const en of ch.entries) {
					const el = script.querySelector(
						`[data-story-id="${CSS.escape(entryId(ch.id, en.title))}"]`
					);
					if (el) ioEntry.observe(el);
				}
		};
		refreshObservers();

		// Component recreated (e.g. route change): pre-scroll the hidden panel
		// so the saved anchor is already in place when the TOC next opens.
		restoreAnchor();

		let scrollRaf = 0;
		const onScroll = () => {
			if (reading.viewScope === 'episodes') return;
			if (scrollRaf) return;
			scrollRaf = requestAnimationFrame(() => {
				scrollRaf = 0;
				const max = document.documentElement.scrollHeight - window.innerHeight;
				const next = max > 0 ? Math.min(1, window.scrollY / max) : 0;
				if (Math.abs(next - scrollProgress) > 0.002) scrollProgress = next;
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') open = false;
		};
		window.addEventListener('keydown', onKey);

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

	/** Re-bind observers when returning to full scroll. */
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
			scrollActiveEntry = entry.dataset.storyId ?? '';
			scrollActive = entry.closest<HTMLElement>('.chapter')?.dataset.storyId ?? scrollActive;
		} else {
			scrollActive = id;
			scrollActiveEntry = '';
		}
	}

	/**
	 * Jump to a chapter / episode / scene / part title.
	 * Full scope: scroll the continuous manuscript to that heading.
	 * Episodes scope: swap the mounted entry (same as Prev/Next), then land
	 * on the heading — never scroll through off-page siblings.
	 */
	function jump(id: string) {
		const gen = beginTocJump();
		try {
			const dest = canonicalHashId(id);
			stripStoryHash();

			if (reading.viewScope === 'episodes') {
				goToEpisodeById(dest, { closeToc: false });
				return;
			}

			const reduce =
				typeof matchMedia !== 'undefined' &&
				matchMedia('(prefers-reduced-motion: reduce)').matches;
			const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
			const idx = resolveEpisodeIndex(dest);
			if (idx >= 0) reading.episodeIndex = idx;

			const go = () => {
				const el = findStoryHeading(dest);
				if (!el) return;
				markActive(el, dest);
				scrollToStoryHeading(el, behavior);
				stripStoryHash();
			};

			requestAnimationFrame(() => requestAnimationFrame(go));
		} finally {
			setTimeout(() => endTocJump(gen), 640);
		}
	}

	/** Scene lists sit under the current episode (or its nested branch). No toggle. */
	function scenesOpen(id: string, leafIds: string[]) {
		if (activeEntry === id) return true;
		return leafIds.includes(activeEntry) || leafIds.includes(reading.sceneId ?? '');
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

<nav
	class={['toc', { open, floating: tocUi.floating }]}
	class:in={scriptUi.inScript}
	id="toc-panel"
	aria-label="Table of contents"
	aria-hidden={!open || !scriptUi.inScript}
>
	<div class="panel" bind:this={panelEl} onscroll={onPanelScroll}>
		<div
			class="toc-pill"
			class:on={pill.on}
			style:top="{pill.top}px"
			style:left="{pill.left}px"
			style:width="{pill.width}px"
			style:height="{pill.height}px"
			aria-hidden="true"
		></div>
		<div class="toc-search">
			<p class="toc-label">Search</p>
			<HudSearch placement="toc" />
		</div>
		<p class="toc-label">Chapters</p>
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
				class:on-pill={pillAt === ch.id}
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
				<p class="toc-label nested">Episodes</p>
				{#each spineEntries(ch) as en (ch.id + en.title)}
					{@const eid = entryId(ch.id, en.title)}
					{@const heading = spineLabel(ch, en)}
					<!-- Read off the sanitized entry: a scene the Intimate toggle hides
					     has no anchor in the document, so it must not sit in the list. -->
					{@const leaves = tocLeavesFor(ch, en, eid, entryForReading(en))}
					{@const leafIds = leaves.map((l) => l.id)}
					{@const isOpen = scenesOpen(eid, leafIds)}
					{@const onBranch =
						activeEntry === eid || branchContains(leaves, activeEntry, reading.sceneId ?? '')}
					<div class="ep-block">
						<button
							type="button"
							class="sub-item"
							class:active={activeEntry === eid}
							class:branch={onBranch && activeEntry !== eid}
							class:on-pill={pillAt === eid}
							class:love={isLoveEpisode(eid)}
							data-toc-id={eid}
							onclick={() => jump(eid)}
						>
							<span class="si-year">{en.year || '·'}</span>
							<span class="si-title">{heading || 'Untitled'}</span>
							{#if isLoveEpisode(eid)}
								<span class="si-love" title="Love story" aria-label="Love story"></span>
							{/if}
						</button>
						{#if leaves.length}
							<div
								class="scene-fold"
								class:open={isOpen}
								id="toc-scenes-{eid}"
								aria-hidden={!isOpen}
							>
								<div class="scene-fold-inner">
									<div class="scenes">
										{#each leaves as s, si (s.id)}
											<button
												type="button"
												class="scene-item"
												class:active={activeEntry === s.id || reading.sceneId === s.id}
												class:on-pill={pillAt === s.id}
												data-toc-id={s.id}
												tabindex={isOpen ? 0 : -1}
												onclick={() => jump(s.id)}
											>
												<span class="scene-num">{si + 1}</span>
												<span class="scene-title">{s.title}</span>
											</button>
										{/each}
									</div>
								</div>
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
		border-radius: var(--radius);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 12px var(--bg);
		opacity: 0;
		transform: translate3d(0, -0.85rem, 0);
		pointer-events: none;
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease),
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
		background: color-mix(in srgb, var(--gold) 12%, transparent);
		transform: scale(1.05);
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

		.scene-fold {
			transition: none;
		}

		.toc-pill {
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
		transform: translate3d(-1.15rem, 0, 0);
		opacity: 0;
		visibility: hidden;
		--tracking-toc: -0.035em;
		--tracking-toc-kicker: -0.04em;
		--tracking-toc-scene: -0.03em;
		font-family: var(--ui);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc);
		line-height: var(--leading-ui);
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

	.toc.floating {
		top: max(3.55rem, calc(env(safe-area-inset-top, 0px) + 3.15rem));
		left: max(0.55rem, env(safe-area-inset-left, 0px));
		bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
		width: min(calc(var(--toc-w) - 0.85rem), 86vw);
		padding: 0;
	}

	.toc.floating .panel {
		background: var(--glass);
		backdrop-filter: blur(22px);
		-webkit-backdrop-filter: blur(22px);
		border: 1px solid var(--hairline);
		border-radius: 14px;
		box-shadow:
			0 1px 0 color-mix(in srgb, white 7%, transparent),
			0 18px 44px rgba(0, 0, 0, 0.48),
			0 4px 14px rgba(0, 0, 0, 0.28);
		padding: 0.7rem 0.5rem 1rem;
	}

	.toc.floating .toc-search {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--panel) 92%, transparent) 62%,
			transparent
		);
	}

	.panel {
		position: relative;
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: transparent;
		padding: 0.2rem 0.4rem 1rem 0;
		scrollbar-width: thin;
		scrollbar-color: var(--scroll-thumb) transparent;
	}

	.toc-pill {
		position: absolute;
		z-index: 0;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.22);
		pointer-events: none;
		opacity: 0;
		transition:
			top 320ms var(--toc-ease),
			left 320ms var(--toc-ease),
			width 320ms var(--toc-ease),
			height 320ms var(--toc-ease),
			opacity 180ms var(--toc-ease);
	}

	.toc-pill.on {
		opacity: 1;
	}

	.toc-search {
		position: sticky;
		top: 0;
		z-index: 2;
		padding: 0 0 0.65rem;
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--bg) 88%, transparent) 70%,
			transparent
		);
	}

	.toc-label {
		margin: 0.7rem 0.35rem 0.28rem;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc-kicker);
		color: color-mix(in srgb, var(--fg-faint) 82%, transparent);
		text-transform: uppercase;
	}

	.toc-label.nested {
		margin: 0.45rem 0.35rem 0.15rem;
		font-size: 10px;
	}

	.toc-search .toc-label {
		margin-top: 0;
	}

	.panel-part {
		display: block;
		width: 100%;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: var(--tracking-toc);
		text-transform: none;
		text-align: left;
		color: var(--gold);
		padding: 0.55rem 0.35rem 0.2rem;
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
		border-radius: 8px;
		padding: 0.42rem 0.45rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 90%, transparent);
		position: relative;
		z-index: 1;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 12px var(--bg);
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.panel-item:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.panel-item.active {
		background: transparent;
	}

	.panel-item.on-pill {
		color: #14140f;
		background: transparent;
		text-shadow: none;
	}

	.panel-item.on-pill .pi-num {
		color: #14140f;
	}

	.pi-title {
		font: inherit;
		font-weight: 600;
		font-size: 13.5px;
		letter-spacing: var(--tracking-toc);
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
		font-size: 11px;
		letter-spacing: 0;
		opacity: 0.5;
		flex-shrink: 0;
	}

	.pi-range {
		margin-left: auto;
		font: inherit;
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc-scene);
		opacity: 0.45;
		flex-shrink: 0;
	}

	.sub {
		margin-left: 0.55rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--fg) 14%, transparent);
	}

	.ep-block {
		border-radius: var(--radius);
	}

	.sub-item {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		width: 100%;
		font: inherit;
		font-size: 12.5px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 8px;
		padding: 0.22rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 55%, transparent);
		position: relative;
		z-index: 1;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 10px var(--bg);
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.sub-item:hover {
		color: color-mix(in srgb, var(--fg) 92%, transparent);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.sub-item.active {
		background: transparent;
	}

	.sub-item.on-pill {
		color: #14140f;
		background: transparent;
		text-shadow: none;
	}

	.sub-item.branch {
		color: color-mix(in srgb, var(--fg) 82%, transparent);
	}

	.si-year {
		flex-shrink: 0;
		width: 2.7em;
		font: inherit;
		font-variant-numeric: tabular-nums;
		letter-spacing: var(--tracking-toc);
		opacity: 0.72;
	}

	.si-title {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-toc);
	}

	.si-love {
		flex: 0 0 auto;
		align-self: center;
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 50%;
		background: #e879a8;
		box-shadow: 0 0 0 1px color-mix(in srgb, #e879a8 40%, transparent);
	}

	.sub-item.on-pill .si-love {
		background: #c45a8a;
		box-shadow: none;
	}

	.scene-fold {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 340ms var(--toc-ease);
	}

	.scene-fold.open {
		grid-template-rows: 1fr;
	}

	.scene-fold-inner {
		overflow: hidden;
		min-height: 0;
	}

	.scenes {
		margin: 0.08rem 0 0.34rem 0.2rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--gold) 26%, transparent);
	}

	.scene-item {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		width: 100%;
		font: inherit;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: var(--tracking-toc-scene);
		text-align: left;
		background: transparent;
		border: none;
		border-radius: 8px;
		padding: 0.16rem 0.4rem;
		cursor: pointer;
		color: color-mix(in srgb, var(--fg) 42%, transparent);
		position: relative;
		z-index: 1;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 10px var(--bg);
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease),
			transform 220ms var(--toc-ease);
	}

	.scene-item:hover {
		color: color-mix(in srgb, var(--fg) 88%, transparent);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.scene-item.active {
		background: transparent;
	}

	.scene-item.on-pill {
		color: #14140f;
		background: transparent;
		text-shadow: none;
	}

	.scene-item.on-pill .scene-num {
		opacity: 0.72;
		color: #14140f;
	}

	.scene-num {
		flex-shrink: 0;
		width: 1.15em;
		font-variant-numeric: tabular-nums;
		font-size: 11px;
		opacity: 0.55;
		color: var(--gold);
	}

	.scene-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-toc-scene);
	}

	/* Overlay (no padding push below 1000px): a sheet so inline art behind
	   the panel cannot show through. Desktop push relies on .reading-clip. */
	@media (max-width: 1000px) {
		.toc.open.in:not(.floating) {
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
			font-size: 12.5px;
		}

		.scene-item {
			min-height: 2.5rem;
			padding: 0.4rem 0.45rem;
			font-size: 12px;
		}
	}
</style>
