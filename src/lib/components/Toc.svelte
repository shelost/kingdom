<script lang="ts">
	import { onMount } from 'svelte';
	import { chapterNumber, chapters, entryId, partId } from '$lib/story';
	import {
		groupEpisodes,
		partLabel,
		spineEntries,
		spineLabel,
		tocEpisode,
		type TocEpisode
	} from '$lib/tocTree';
	import { EPISODE_KIND_META } from '$lib/episodeKinds';
	import { TOC_DURATION_MS, saveTocAnchor, loadTocAnchor, beginTocJump, endTocJump, tocUi, loadTocFloating, tocOverlays } from '$lib/tocUi.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { hrefWithNsfw } from '$lib/nsfwUi.svelte';
	import { SITE_LINKS } from '$lib/siteLinks';
	import { scriptUi } from '$lib/scriptUi.svelte';
	import {
		reading,
		episodes,
		canonicalHashId,
		findStoryHeading,
		goToEpisode,
		goToEpisodeById,
		resolveEpisodeIndex,
		scrollToStoryHeading,
		storyRoot,
		stripStoryHash
	} from '$lib/reading.svelte';
	import HudSearch from './HudSearch.svelte';

	/** Bound by the story layout so the reading shell + plate shift together. */
	let { open = $bindable(true) } = $props();

	/** Korean reading: chapter, group and episode rows show their Korean titles. */
	let ko = $derived(reading.lang === 'ko');

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

	/** The episode if one is live; otherwise the chapter. */
	let pillId = $derived(activeEntry || active || '');

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
		/* A phone opens on the page, not on a drawer covering it. */
		if (tocOverlays()) open = false;
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
	 * Jump to a chapter / episode / part title.
	 * Full scope: scroll the continuous manuscript to that heading.
	 * Episodes scope: swap the mounted entry (same as Prev/Next), then land
	 * on the heading — never scroll through off-page siblings.
	 */
	function jump(id: string) {
		const gen = beginTocJump();
		/* On a phone the drawer sits over the page it just jumped to. */
		if (tocOverlays()) open = false;
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

	function toggle() {
		if (!scriptUi.inScript) return;
		open = !open;
	}

	let onTitle = $derived(reading.viewScope === 'episodes' && reading.episodeIndex === 0);

	function goToTitle() {
		if (tocOverlays()) open = false;
		goToEpisode(0);
	}

</script>

{#snippet episodeRow(ep: TocEpisode, nested: boolean)}
	<button
		type="button"
		class={nested ? 'ep-item' : 'sub-item'}
		class:active={activeEntry === ep.id}
		class:on-pill={pillAt === ep.id}
		data-toc-id={ep.id}
		onclick={() => jump(ep.id)}
	>
		{#if ep.num}<span class="ep-num">{ep.num}</span>{/if}
		<span class="si-title">{(ko && ep.ko) || ep.title || 'Untitled'}</span>
		{#if ep.kinds.length}
			<span class="ep-kinds" aria-hidden="true">
				{#each ep.kinds as k (k)}
					{@const kind = EPISODE_KIND_META[k]}
					<span class="ep-kind material-symbols-outlined" style:--kind={kind.color} title={kind.label}
						>{kind.icon}</span
					>
				{/each}
			</span>
		{/if}
	</button>
{/snippet}

<div
	class="progress"
	class:in={scriptUi.inScript}
	style:transform="scaleX({progress})"
	aria-hidden="true"
></div>

<button
	class="toc-toggle"
	class:in={scriptUi.inScript && !open}
	type="button"
	aria-expanded={open}
	aria-controls="toc-panel"
	aria-hidden={!scriptUi.inScript || open}
	tabindex={scriptUi.inScript && !open ? 0 : -1}
	aria-label="Open table of contents"
	onclick={toggle}
>
	☰
</button>

{#if open && scriptUi.inScript}
	<button
		type="button"
		class="toc-scrim"
		tabindex="-1"
		aria-label="Close table of contents"
		onclick={() => (open = false)}
	></button>
{/if}

<nav
	class={['toc', { open, floating: tocUi.floating }]}
	class:in={scriptUi.inScript}
	id="toc-panel"
	aria-label="Table of contents"
	aria-hidden={!open || !scriptUi.inScript}
>
	<div class="card">
	<div class="toc-head">
		<button
			type="button"
			class="toc-title"
			class:active={onTitle}
			aria-current={onTitle ? 'page' : undefined}
			tabindex={open ? 0 : -1}
			onclick={goToTitle}
		>
			<img class="toc-logo" src="/samhan_logo.svg" alt="" />
			<span class="toc-title-en">King for All</span>
		</button>
		<button
			type="button"
			class="toc-retract"
			aria-label="Retract table of contents"
			title="Retract"
			tabindex={open ? 0 : -1}
			onclick={() => (open = false)}
		>
			<span class="material-symbols-outlined" aria-hidden="true">left_panel_close</span>
		</button>
	</div>
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
		<div class="toc-site">
			<p class="toc-label">{ko ? '둘러보기' : 'Explore'}</p>
			<div class="toc-site-links">
				{#each SITE_LINKS as link (link.href)}
					{#if link.href !== '/'}
						<a href={hrefWithNsfw(resolve(link.href), page.url)} tabindex={open ? 0 : -1}>
							<span class="material-symbols-outlined" aria-hidden="true">{link.icon}</span>
							{link.label}
						</a>
					{/if}
				{/each}
			</div>
		</div>
		<div class="toc-search">
			<HudSearch placement="toc" />
		</div>
		{#each chapters as ch, ci (ch.id)}
			{#if ch.part}
				<button
					type="button"
					class="panel-part"
					class:on-pill={pillAt === partId(ch.id)}
					aria-current={activeEntry === partId(ch.id) ? 'page' : undefined}
					data-toc-id={partId(ch.id)}
					onclick={() => jump(partId(ch.id))}
				>
					{partLabel(ch.part, ko)}
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
					{#if chapterNumber(ci) !== null}
						<span class="pi-num">{chapterNumber(ci)}</span>
						<span class="pi-dot" aria-hidden="true">·</span>
					{/if}
					{(ko && ch.korean) || ch.title}
				</span>
				{#if ch.korean && !ko}<span class="pi-ko">{ch.korean}</span>{/if}
			</button>

			<div class="sub">
				{#each spineEntries(ch) as en (ch.id + en.title)}
					{@const eid = entryId(ch.id, en.title)}
					{@const group = groupEpisodes(ch, en)}
					{#if group.length}
						<div class="ep-block">
							<button
								type="button"
								class="sub-item group-head"
								class:branch={group.some((ep) => ep.id === activeEntry)}
								data-toc-id="{eid}~group"
								onclick={() => jump(eid)}
							>
								<span class="si-title">{spineLabel(ch, en, ko)}</span>
							</button>
							<div class="ep-group">
								{#each group as ep (ep.id)}
									{@render episodeRow(ep, true)}
								{/each}
							</div>
						</div>
					{:else}
						{@render episodeRow(tocEpisode(ch, en), false)}
					{/if}
				{/each}
			</div>
		{/each}
	</div>
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
		padding: var(--toc-gap) 0.5rem 1.5rem calc(22px + 0.35rem);
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

	/* The same gap above, left of, below and right of the card: the reading
	   column is pushed by --toc-w, so the card is --toc-w less two gaps. */
	.toc.floating {
		top: max(var(--toc-gap), env(safe-area-inset-top, 0px));
		left: max(var(--toc-gap), env(safe-area-inset-left, 0px));
		bottom: max(var(--toc-gap), env(safe-area-inset-bottom, 0px));
		width: min(calc(var(--toc-w) - 2 * var(--toc-gap)), 86vw);
		padding: 0;
	}

	.toc.floating .card {
		overflow: hidden;
		background: var(--glass);
		backdrop-filter: blur(22px);
		-webkit-backdrop-filter: blur(22px);
		border: 1px solid var(--hairline);
		border-radius: 14px;
		box-shadow: var(--shadow-float);
	}

	.toc.floating .toc-head {
		padding: 0.55rem 0.5rem 0.35rem 0.6rem;
	}

	.toc.floating .panel {
		padding: 0.2rem 0.5rem 1rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.toc-head {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0 0.4rem 0.35rem 0;
	}

	.toc-title {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		padding: 0.3rem 0.5rem 0.3rem 0.3rem;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--fg-strong);
		font: inherit;
		font-family: var(--serif);
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.02em;
		cursor: pointer;
		transition: background 220ms var(--toc-ease);
	}

	.toc-title:hover,
	.toc-title.active {
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.toc-logo {
		width: 1.9rem;
		height: 1.9rem;
		flex: 0 0 auto;
		filter: var(--logo-filter);
	}

	.toc-title-en {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toc-retract {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--fg-dim);
		cursor: pointer;
		transition:
			color 220ms var(--toc-ease),
			background 220ms var(--toc-ease);
	}

	.toc-retract:hover {
		color: var(--fg-strong);
		background: color-mix(in srgb, var(--fg) 7%, transparent);
	}

	.toc-title:focus-visible,
	.toc-retract:focus-visible {
		outline: 2px solid var(--gold);
		outline-offset: 1px;
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
		flex: 1 1 auto;
		min-height: 0;
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
		box-shadow: var(--shadow-pill);
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
		padding: 0.38rem 0.45rem;
		margin: 0.17rem 0 0;
		background: transparent;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		position: relative;
		z-index: 1;
		text-shadow:
			0 1px 2px var(--bg),
			0 0 14px var(--bg);
	}

	.panel-part:hover {
		color: color-mix(in srgb, var(--gold) 88%, white);
	}

	.panel-part.on-pill {
		color: #14140f;
		text-shadow: none;
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

	.si-title {
		flex: 0 1 auto;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: var(--tracking-toc);
	}

	.ep-kinds {
		flex: 0 0 auto;
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		margin-left: -0.2rem;
	}

	.ep-kind {
		font-size: 0.95rem;
		color: var(--kind, transparent);
		opacity: 0.85;
		text-shadow: none;
		transition:
			color 220ms var(--toc-ease),
			opacity 220ms var(--toc-ease);
	}

	.on-pill .ep-kind {
		color: color-mix(in srgb, var(--kind, transparent) 45%, #14140f);
		opacity: 1;
	}

	.ep-num {
		flex-shrink: 0;
		min-width: 2.4em;
		font-variant-numeric: tabular-nums;
		font-size: 11px;
		opacity: 0.55;
		color: var(--gold);
	}

	.on-pill .ep-num {
		opacity: 0.72;
		color: #14140f;
	}

	.ep-group {
		margin: 0.08rem 0 0.34rem 0.2rem;
		padding-left: 0.45rem;
		border-left: 1px solid color-mix(in srgb, var(--gold) 26%, transparent);
	}

	.ep-item {
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

	.ep-item:hover {
		color: color-mix(in srgb, var(--fg) 88%, transparent);
		background: color-mix(in srgb, var(--fg) 6%, transparent);
	}

	.ep-item.active {
		background: transparent;
	}

	.ep-item.on-pill {
		color: #14140f;
		background: transparent;
		text-shadow: none;
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

	/* Site links + tap-away scrim are phone chrome; desktop has the Hud's site nav. */
	.toc-site,
	.toc-scrim {
		display: none;
	}

	@media (max-width: 820px) {
		.toc-scrim {
			position: fixed;
			inset: 0;
			z-index: 99;
			display: block;
			padding: 0;
			border: none;
			background: rgba(0, 0, 0, 0.42);
		}

		.toc-site {
			display: block;
			padding: 0 0 0.4rem;
		}

		.toc-site-links {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.3rem;
		}

		.toc-site-links a {
			display: flex;
			align-items: center;
			gap: 0.45rem;
			min-height: 2.6rem;
			padding: 0 0.6rem;
			border: 1px solid var(--hairline);
			border-radius: 10px;
			background: color-mix(in srgb, var(--fg) 4%, transparent);
			color: var(--fg);
			font-size: 13px;
			text-decoration: none;
		}

		.toc-site-links .material-symbols-outlined {
			font-size: 1.1rem;
			color: var(--gold);
		}

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
			padding: max(var(--toc-gap), env(safe-area-inset-top, 0px)) 0.5rem
				max(1.5rem, env(safe-area-inset-bottom, 0px)) max(0.55rem, env(safe-area-inset-left, 0px));
			width: min(20rem, 92vw);
		}

		.toc.floating {
			width: min(20rem, calc(100vw - 2 * var(--toc-gap)));
		}

		.toc-retract {
			width: 2.75rem;
			height: 2.75rem;
		}

		.panel-item {
			min-height: 2.75rem;
			padding: 0.55rem 0.5rem;
		}

		.panel-part {
			min-height: 2.5rem;
			padding: 0.52rem 0.5rem;
		}

		.sub-item {
			min-height: 2.5rem;
			padding: 0.45rem 0.45rem;
			font-size: 12.5px;
		}

		.ep-item {
			min-height: 2.5rem;
			padding: 0.4rem 0.45rem;
			font-size: 12px;
		}
	}
</style>
