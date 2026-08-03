<script lang="ts">
	import { onMount } from 'svelte';
	import { chapters } from '$lib/story';

	let active = $state(chapters[0]?.id);
	let activeEntry = $state('');
	let open = $state(false);
	let progress = $state(0);

	let activeIndex = $derived(chapters.findIndex((c) => c.id === active));

	onMount(() => {
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

		return () => {
			io.disconnect();
			ioEntry.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});

	function jump(id: string) {
		open = false;
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<div class="progress" style:transform="scaleX({progress})" aria-hidden="true"></div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<nav
	class="toc"
	class:open
	aria-label="Table of contents"
	onmouseenter={() => (open = true)}
	onmouseleave={() => (open = false)}
	onfocusin={() => (open = true)}
	onfocusout={() => (open = false)}
>
	<div class="bars" aria-hidden="true">
		{#each chapters as ch (ch.id)}
			<span class="bar" class:part={!!ch.part} class:active={active === ch.id}></span>
		{/each}
	</div>

	<div class="panel">
		{#each chapters as ch, ci (ch.id)}
			{#if ch.part}
				<div class="panel-part">{ch.part}</div>
			{/if}
			<button class="panel-item" class:active={active === ch.id} onclick={() => jump(ch.id)}>
				<span class="pi-title">{ch.title}</span>
				{#if ch.korean}<span class="pi-ko">{ch.korean}</span>{/if}
				{#if ch.range}<span class="pi-range">{ch.range}</span>{/if}
			</button>

			<!-- entries unfold for the chapter you're reading -->
			<div class="sub" class:expanded={activeIndex === ci}>
				<div class="sub-inner">
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

	.toc {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 65;
		padding: 1.5rem 1.1rem; /* generous hover target */
	}

	/* ————— collapsed: notion-style dashes ————— */
	.bars {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		transition: opacity 220ms ease;
	}

	.toc.open .bars {
		opacity: 0;
	}

	.bar {
		display: block;
		height: 2px;
		width: 14px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.22);
		transition:
			background 250ms ease,
			width 250ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.bar.part {
		width: 22px;
		background: rgba(255, 255, 255, 0.38);
	}

	.bar.active {
		width: 26px;
		background: #fff;
	}

	/* ————— expanded panel ————— */
	.panel {
		position: absolute;
		right: 1.4rem;
		top: 50%;
		transform: translateY(-50%) translateX(10px) scale(0.98);
		width: 17.5rem;
		max-height: 80vh;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: rgba(19, 19, 21, 0.92);
		backdrop-filter: blur(20px) saturate(140%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 12px;
		box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
		padding: 0.7rem;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 260ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
			visibility 0s linear 260ms;
	}

	.toc.open .panel {
		opacity: 1;
		visibility: visible;
		transform: translateY(-50%) translateX(0) scale(1);
		transition-delay: 0s;
	}

	.panel-part {
		font-family: var(--serif);
		font-weight: 900;
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--gold);
		padding: 0.75rem 0.6rem 0.25rem;
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
		padding: 0.42rem 0.6rem;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.68);
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.panel-item:hover {
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
	}

	.panel-item.active {
		color: #fff;
		background: rgba(255, 255, 255, 0.09);
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

	/* ————— nested entries ————— */
	.sub {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		transition:
			grid-template-rows 380ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 260ms ease;
	}

	.sub.expanded {
		grid-template-rows: 1fr;
		opacity: 1;
	}

	.sub-inner {
		min-height: 0;
		overflow: hidden;
		margin-left: 0.65rem;
		border-left: 1px solid rgba(255, 255, 255, 0.09);
		padding-left: 0.3rem;
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
		padding: 0.22rem 0.5rem;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.4);
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.sub-item:hover {
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.9);
	}

	.sub-item.active {
		color: #fff;
		background: rgba(59, 111, 212, 0.16);
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

	@media (max-width: 1000px) {
		.toc {
			display: none;
		}
	}
</style>
