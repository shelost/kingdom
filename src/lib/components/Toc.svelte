<script lang="ts">
	import { onMount } from 'svelte';
	import { chapters } from '$lib/story';

	/** Bound by the page so main can shift (Notion-style) when the TOC is open. */
	let { open = $bindable(false) } = $props();

	let active = $state(chapters[0]?.id);
	let activeEntry = $state('');
	let progress = $state(0);
	let narrow = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(max-width: 1000px)');
		const syncNarrow = () => (narrow = mq.matches);
		syncNarrow();
		mq.addEventListener('change', syncNarrow);

		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = e.target.id;
			},
			// a chapter is "active" while it crosses the upper third of the screen
			{ rootMargin: '-15% 0px -70% 0px' }
		);
		for (const ch of chapters) {
			const el = document.getElementById(ch.id);
			if (el) io.observe(el);
		}

		// entry-level tracking + reading progress
		const ioEntry = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) activeEntry = e.target.id;
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);
		for (const ch of chapters)
			for (let i = 0; i < ch.entries.length; i++) {
				const el = document.getElementById(`${ch.id}-${i}`);
				if (el) ioEntry.observe(el);
			}

		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
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
			mq.removeEventListener('change', syncNarrow);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKey);
		};
	});

	function jump(id: string) {
		// keep open on desktop; close on narrow screens so content isn't covered
		if (narrow) open = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function toggle() {
		open = !open;
	}
</script>

<div class="progress" style:transform="scaleX({progress})" aria-hidden="true"></div>

<button
	class="toc-toggle"
	type="button"
	aria-expanded={open}
	aria-controls="toc-panel"
	aria-label={open ? 'Close table of contents' : 'Open table of contents'}
	onclick={toggle}
>
	{open ? '✕' : '☰'}
</button>

<nav class="toc" class:open id="toc-panel" aria-label="Table of contents" aria-hidden={!open}>
	<div class="panel">
		{#each chapters as ch, ci (ch.id)}
			{#if ch.part}
				<div class="panel-part">{ch.part}</div>
			{/if}
			<button class="panel-item" class:active={active === ch.id} onclick={() => jump(ch.id)}>
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
					<button
						class="sub-item"
						class:active={activeEntry === `${ch.id}-${ei}`}
						onclick={() => jump(`${ch.id}-${ei}`)}
					>
						<span class="si-year">{en.year || '·'}</span>
						<span class="si-title">{en.title || 'Untitled'}</span>
					</button>
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
		z-index: 90;
		background: var(--gold);
		transform-origin: 0 50%;
		will-change: transform;
	}

	.toc-toggle {
		position: fixed;
		top: max(0.55rem, env(safe-area-inset-top, 0px));
		left: max(calc(22px + 0.2rem), env(safe-area-inset-left, 0px));
		z-index: 95;
		width: 2.75rem;
		height: 2.75rem;
		display: grid;
		place-items: center;
		font-size: 1.1rem;
		line-height: 1;
		color: rgba(255, 253, 248, 0.92);
		background: transparent;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		text-shadow:
			0 1px 2px rgba(0, 0, 0, 0.85),
			0 0 12px rgba(0, 0, 0, 0.55);
		transition:
			color 150ms ease,
			transform 180ms ease,
			background 150ms ease;
	}

	.toc-toggle:hover {
		color: #fff;
		transform: scale(1.06);
	}

	.toc {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 94;
		width: min(var(--toc-w), 86vw);
		padding: 3.6rem 0.5rem 1.5rem calc(22px + 0.35rem);
		pointer-events: none;
		transform: translateX(-12px);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 260ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
			visibility 0s linear 260ms;
	}

	.toc.open {
		pointer-events: auto;
		opacity: 1;
		visibility: visible;
		transform: translateX(0);
		transition-delay: 0s;
	}

	.panel {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: transparent;
		padding: 0.2rem 0.4rem 1rem 0;
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
	}

	.panel-part {
		font-family: var(--serif);
		font-weight: 900;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
		padding: 0.95rem 0.35rem 0.3rem;
		text-shadow:
			0 1px 2px rgba(0, 0, 0, 0.9),
			0 0 14px rgba(0, 0, 0, 0.55);
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
		color: rgba(255, 255, 255, 0.72);
		text-shadow:
			0 1px 2px rgba(0, 0, 0, 0.9),
			0 0 12px rgba(0, 0, 0, 0.5);
		transition: color 150ms ease;
	}

	.panel-item:hover {
		color: #fff;
	}

	.panel-item.active {
		color: #fff;
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
		border-left: 1px solid rgba(255, 255, 255, 0.14);
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
		color: rgba(255, 255, 255, 0.45);
		text-shadow:
			0 1px 2px rgba(0, 0, 0, 0.9),
			0 0 10px rgba(0, 0, 0, 0.45);
		transition: color 150ms ease;
	}

	.sub-item:hover {
		color: rgba(255, 255, 255, 0.92);
	}

	.sub-item.active {
		color: #fff;
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

	@media (max-width: 820px) {
		.toc-toggle {
			/* Top-left stays clear of Hud; size is thumb-friendly (≥44px). */
			top: max(0.4rem, env(safe-area-inset-top, 0px));
			left: max(0.35rem, env(safe-area-inset-left, 0px));
			width: 2.75rem;
			height: 2.75rem;
			background: rgba(32, 32, 38, 0.55);
			backdrop-filter: blur(10px);
			border: 1px solid rgba(255, 255, 255, 0.08);
		}

		.toc {
			padding: max(3.6rem, calc(env(safe-area-inset-top, 0px) + 3rem)) 0.5rem
				max(1.5rem, env(safe-area-inset-bottom, 0px)) max(0.55rem, env(safe-area-inset-left, 0px));
			width: min(20rem, 92vw);
			/* Dim the page behind so the open TOC reads as a sheet, not chrome. */
			background: linear-gradient(
				90deg,
				rgba(20, 20, 26, 0.92) 0%,
				rgba(20, 20, 26, 0.78) 72%,
				transparent 100%
			);
		}

		.panel-item {
			min-height: 2.75rem;
			padding: 0.55rem 0.5rem;
		}

		.sub-item {
			min-height: 2.5rem;
			padding: 0.45rem 0.45rem;
			font-size: 0.8rem;
		}
	}
</style>
