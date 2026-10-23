<script lang="ts">
	import gsap from 'gsap';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Attachment } from 'svelte/attachments';
	import { chapters, outlineOf } from '$lib/story';
	import { animating } from '$lib/motionUi.svelte';
	import {
		episodes,
		reading,
		leadLang,
		findStoryHeading,
		scrollToStoryHeading,
		goToScene,
		watchSection
	} from '$lib/reading.svelte';

	/**
	 * Notion-style outline on the right edge: sections, then stories, then
	 * location-and-time scenes. Hover (or focus) opens the mini table of
	 * contents; a click glides to that heading.
	 */
	let { live = true }: { live?: boolean } = $props();

	let ep = $derived(episodes[reading.episodeIndex]);
	let entry = $derived(
		ep?.kind === 'entry' ? chapters[ep.chapterIndex]?.entries[ep.entryIndex] : undefined
	);
	let outline = $derived(entry && ep ? outlineOf(entry.blocks, ep.id) : undefined);
	let here = $state<string>();
	let active = $derived(here === undefined ? -1 : (outline?.of.get(here) ?? -1));
	let ko = $derived(leadLang() === 'ko');
	let open = $state(false);

	type RailEls = {
		root: HTMLElement;
		panel: HTMLElement;
		ticks: HTMLElement;
		list: HTMLElement;
		mark: HTMLElement;
	};
	let els: RailEls | undefined;
	let tl: gsap.core.Timeline | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	const rail: Attachment<HTMLElement> = (node) => {
		const panel = node.querySelector<HTMLElement>('.panel');
		const ticks = node.querySelector<HTMLElement>('.ticks');
		const list = node.querySelector<HTMLElement>('.toc');
		const mark = node.querySelector<HTMLElement>('.mark');
		if (!panel || !ticks || !list || !mark) return;
		els = { root: node, panel, ticks, list, mark };
		const ctx = gsap.context(() => {
			if (animating()) {
				gsap.set(panel, { opacity: 0, x: 18, scale: 0.96, transformOrigin: '100% 50%' });
				gsap.set(mark, { autoAlpha: 0 });
			}
		}, node);
		return () => {
			tl?.kill();
			ctx.revert();
			els = undefined;
			if (closeTimer) {
				clearTimeout(closeTimer);
				closeTimer = undefined;
			}
		};
	};

	function items(): HTMLElement[] {
		if (!els) return [];
		return [...els.panel.querySelectorAll<HTMLElement>('.head, .item')];
	}

	function placeMark() {
		if (!els) return;
		const current =
			els.list.querySelector<HTMLElement>('[aria-current="location"]') ??
			els.list.querySelector<HTMLElement>('[aria-current="true"]');
		if (!current) {
			if (animating()) gsap.to(els.mark, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' });
			else els.mark.style.opacity = '0';
			return;
		}
		const y = current.getBoundingClientRect().top - els.list.getBoundingClientRect().top + els.list.scrollTop;
		const h = current.offsetHeight;
		if (!animating()) {
			els.mark.style.opacity = '1';
			els.mark.style.transform = `translateY(${y}px)`;
			els.mark.style.height = `${h}px`;
			return;
		}
		gsap.to(els.mark, {
			autoAlpha: 1,
			y,
			height: h,
			duration: 0.42,
			ease: 'power3.out',
			overwrite: 'auto'
		});
	}

	function centerActive() {
		if (!els) return;
		const current = els.list.querySelector<HTMLElement>('[aria-current="location"]');
		if (!current) return;
		const top = current.offsetTop - (els.list.clientHeight - current.offsetHeight) / 2;
		if (!animating()) {
			els.list.scrollTop = top;
			return;
		}
		gsap.to(els.list, { scrollTop: top, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
	}

	function play(next: boolean) {
		if (!els || !animating()) return;
		tl?.kill();
		const row = items();
		tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
		if (next) {
			tl.to(els.ticks, { autoAlpha: 0, x: 10, duration: 0.22, ease: 'power2.out' }, 0);
			tl.to(
				els.panel,
				{ opacity: 1, x: 0, scale: 1, duration: 0.44, ease: 'power3.out' },
				0.04
			);
			tl.fromTo(
				row,
				{ autoAlpha: 0, x: 14 },
				{ autoAlpha: 1, x: 0, duration: 0.36, stagger: 0.016, ease: 'power2.out' },
				0.1
			);
			tl.add(() => {
				centerActive();
				placeMark();
			}, 0.12);
		} else {
			tl.to(
				row,
				{
					autoAlpha: 0,
					x: 8,
					duration: 0.14,
					stagger: { each: 0.008, from: 'end' },
					ease: 'power1.in'
				},
				0
			);
			tl.to(els.panel, { opacity: 0, x: 14, scale: 0.97, duration: 0.22, ease: 'power2.in' }, 0.05);
			tl.to(els.ticks, { autoAlpha: 1, x: 0, duration: 0.24, ease: 'power2.out' }, 0.08);
			tl.set(els.mark, { autoAlpha: 0 });
		}
	}

	function setOpen(next: boolean) {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = undefined;
		}
		if (!next) {
			/* Keep the open hit box for a beat so moving onto the panel doesn't collapse it. */
			closeTimer = setTimeout(() => {
				closeTimer = undefined;
				if (!open) return;
				open = false;
				play(false);
			}, 120);
			return;
		}
		if (open) return;
		open = true;
		centerActive();
		play(true);
	}

	function jump(id: string) {
		const el = findStoryHeading(id);
		if (el) scrollToStoryHeading(el, prefersReducedMotion.current ? 'auto' : 'smooth');
		else goToScene(id);
	}

	function leave(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (next && e.currentTarget instanceof Node && e.currentTarget.contains(next)) return;
		setOpen(false);
	}

	$effect(() => {
		if (!live) return;
		return watchSection((section) => {
			here = section?.key;
			if (open) queueMicrotask(placeMark);
		});
	});
</script>

{#if live && reading.mode === 'script' && entry && ep && outline && (outline.sections.length > 1 || outline.sections.some((s) => s.stories.length || s.scenes.length))}
	<nav
		class="outline"
		class:is-open={open}
		aria-label={ko ? '이 회차의 목차' : 'Outline of this episode'}
		{@attach rail}
		onpointerenter={() => setOpen(true)}
		onpointerleave={() => setOpen(false)}
		onfocusin={() => setOpen(true)}
		onfocusout={leave}
	>
		<div class="ticks" aria-hidden="true">
			{#each outline.sections as s, i (s.id)}
				<span class="tick" class:passed={i < active} class:active={i === active}></span>
			{/each}
		</div>
		<div class="stage">
			<div class="panel">
				<button class="head" onclick={() => jump(ep.id)}>
					{(ko && entry.subtitle) || entry.title}
				</button>
				<div class="toc">
					<span class="mark" aria-hidden="true"></span>
					<ol>
					{#each outline.sections as s, i (s.id)}
						<li>
							<button
								class="item section"
								aria-current={here === s.id ? 'location' : i === active ? 'true' : undefined}
								onclick={() => jump(s.id)}
							>
								<span class="n">{i + 1}</span>
								{(ko && s.ko) || s.title}
							</button>
							{#if s.scenes.length}
								<ol class="nest">
									{#each s.scenes as sc, si (sc.id)}
										<li>
											<button
												class="item scene"
												aria-current={here === sc.id ? 'location' : undefined}
												onclick={() => jump(sc.id)}
											>
												<span class="n">{si + 1}</span>
												{(ko && sc.ko) || sc.title}
											</button>
										</li>
									{/each}
								</ol>
							{/if}
							{#if s.stories.length}
								<ol class="nest">
									{#each s.stories as st, si (st.id)}
										<li>
											<button
												class="item story"
												aria-current={here === st.id ? 'location' : undefined}
												onclick={() => jump(st.id)}
											>
												<span class="n">{si + 1}</span>
												{(ko && st.ko) || st.title}
											</button>
											{#if st.scenes.length}
												<ol class="nest">
													{#each st.scenes as sc, ci (sc.id)}
														<li>
															<button
																class="item scene"
																aria-current={here === sc.id ? 'location' : undefined}
																onclick={() => jump(sc.id)}
															>
																<span class="n">{ci + 1}</span>
																{(ko && sc.ko) || sc.title}
															</button>
														</li>
													{/each}
												</ol>
											{/if}
										</li>
									{/each}
								</ol>
							{/if}
						</li>
					{/each}
					</ol>
				</div>
			</div>
		</div>
	</nav>
{/if}

<style>
	.outline {
		display: none;
	}

	@media (min-width: 821px) {
		.outline {
			position: fixed;
			z-index: 30;
			top: 50%;
			right: 0.6rem;
			display: block;
			translate: 0 -50%;
			font-family: var(--ui);
		}
	}

	:global(html.is-immersion) .outline {
		display: none;
	}

	.ticks {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 9px;
		padding: 0.75rem 0.4rem;
	}

	.tick {
		flex: none;
		width: 11px;
		height: 2px;
		border-radius: 1px;
		background: color-mix(in srgb, var(--fg) 22%, transparent);
		transform-origin: right center;
		transition:
			width 420ms cubic-bezier(0.22, 0.61, 0.36, 1),
			height 420ms cubic-bezier(0.22, 0.61, 0.36, 1),
			background 420ms cubic-bezier(0.22, 0.61, 0.36, 1),
			box-shadow 420ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.tick.passed {
		width: 16px;
		background: color-mix(in srgb, var(--fg) 45%, transparent);
	}

	.tick.active {
		width: 28px;
		height: 3px;
		background: var(--fg-strong);
		box-shadow: 0 0 12px color-mix(in srgb, var(--fg-strong) 38%, transparent);
		animation: tick-in 0.48s cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	@keyframes tick-in {
		from {
			transform: scaleX(0.35);
		}
		to {
			transform: scaleX(1);
		}
	}

	.outline:not(.is-open):hover .tick {
		background: color-mix(in srgb, var(--fg) 40%, transparent);
	}

	.outline:not(.is-open):hover .tick.active {
		background: var(--fg-strong);
	}

	.stage {
		position: absolute;
		top: 50%;
		right: 0;
		translate: 0 -50%;
		pointer-events: none;
	}

	.panel {
		display: flex;
		flex-direction: column;
		width: 16.5rem;
		max-height: 72vh;
		padding: 0.5rem;
		border: 1px solid var(--hairline);
		border-radius: 10px;
		background: color-mix(in srgb, var(--panel) 92%, transparent);
		backdrop-filter: blur(12px);
		box-shadow: 0 10px 34px rgb(0 0 0 / 0.32);
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}

	/* The panel is absolutely positioned and taller than the tick column.
	   Opacity (not autoAlpha) keeps it in the hit tree while fading, so
	   hovering the open card counts as still being on the rail. */
	.outline.is-open .stage,
	.outline.is-open .panel {
		visibility: visible;
		pointer-events: auto;
	}

	:global(html[data-animated='off']) .outline:hover .panel,
	:global(html[data-animated='off']) .outline:focus-within .panel,
	:global(html[data-animated='off']) .outline.is-open .panel {
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	:global(html[data-animated='off']) .outline:hover .ticks,
	:global(html[data-animated='off']) .outline:focus-within .ticks,
	:global(html[data-animated='off']) .outline.is-open .ticks {
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.tick,
		.item,
		.head {
			transition: none;
			animation: none;
		}

		.outline.is-open .panel {
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}

		.outline.is-open .ticks {
			opacity: 0;
		}
	}

	.toc {
		position: relative;
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;
		scrollbar-width: thin;
	}

	.toc ol {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mark {
		position: absolute;
		z-index: 0;
		left: 2px;
		right: 2px;
		top: 0;
		height: 1.8rem;
		border-radius: 6px;
		background: color-mix(in srgb, var(--fg) 9%, transparent);
		pointer-events: none;
		opacity: 0;
	}

	button {
		position: relative;
		z-index: 1;
		display: block;
		width: 100%;
		border: 0;
		border-radius: 6px;
		background: none;
		font: inherit;
		text-align: left;
		cursor: pointer;
		transition:
			color 220ms ease,
			background 220ms ease,
			transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	button:hover,
	button:focus-visible {
		background: color-mix(in srgb, var(--fg) 8%, transparent);
		outline: none;
		transform: translateX(-2px);
	}

	.head {
		flex: none;
		margin-bottom: 0.25rem;
		padding: 0.4rem 0.55rem 0.5rem;
		border-bottom: 1px solid var(--hairline);
		border-radius: 6px 6px 0 0;
		font-family: var(--serif);
		font-size: 0.86rem;
		font-weight: 600;
		color: var(--fg-strong);
	}

	.item {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		padding: 0.38rem 0.55rem;
		font-size: 0.8rem;
		line-height: 1.3;
		color: var(--fg-dim);
	}

	.n {
		flex: none;
		width: 0.9rem;
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		color: var(--fg-faint);
	}

	.item[aria-current='location'],
	.item[aria-current='true'] {
		font-weight: 600;
		color: var(--fg-strong);
	}

	.item.section {
		font-family: var(--serif);
		font-size: 0.86rem;
		color: var(--fg-strong);
	}

	.item.story {
		padding-left: 1.55rem;
		font-size: 0.78rem;
		color: var(--fg);
	}

	.nest {
		margin: 0 0 0.15rem;
		padding: 0;
		list-style: none;
	}

	.item.scene {
		padding-left: 2.45rem;
		font-size: 0.72rem;
		color: var(--fg-dim);
	}

	.section + .nest > li > .item.scene {
		padding-left: 1.55rem;
	}

	.item.story .n,
	.item.scene .n {
		width: 0.75rem;
	}
</style>
