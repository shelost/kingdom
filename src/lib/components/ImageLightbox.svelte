<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import gsap from 'gsap';
	import FlipPkg from 'gsap/Flip';
	import { storyImg } from '$lib/img';
	import {
		closeLightbox,
		imageLightbox,
		lightboxReduceMotion,
		stepLightbox
	} from '$lib/imageLightbox.svelte';
	import {
		canonicalHashId,
		findStoryHeading,
		requestStoryJump,
		scrollToStoryHeading,
		stripStoryHash
	} from '$lib/reading.svelte';

	/** ESM build default-exports the plugin; Vercel’s CJS build puts it on `.Flip`. */
	function loadFlip(mod: unknown): typeof FlipPkg {
		if (typeof mod === 'function') return mod as typeof FlipPkg;
		if (mod && typeof mod === 'object') {
			const bag = mod as { Flip?: unknown; default?: unknown };
			const picked = bag.Flip ?? bag.default;
			if (typeof picked === 'function') return picked as typeof FlipPkg;
		}
		throw new Error('GSAP Flip did not load');
	}

	const Flip = loadFlip(FlipPkg);
	gsap.registerPlugin(Flip);

	const OPEN_MS = 0.28;
	const CLOSE_MS = 0.26;

	let item = $derived(
		imageLightbox.open ? imageLightbox.items[imageLightbox.index] : undefined
	);
	let hasStack = $derived(imageLightbox.items.length > 1);

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let scrimEl = $state<HTMLButtonElement | null>(null);
	let shotEl = $state<HTMLImageElement | null>(null);
	let flipping = $state(false);

	function clearFlipStyles(el: HTMLElement | null) {
		if (!el) return;
		gsap.set(el, {
			clearProps:
				'transform,transformOrigin,width,height,position,top,left,maxWidth,maxHeight,opacity,borderRadius,filter'
		});
	}

	function fadeChromeIn(delay = 0.06) {
		const cap = dialogEl?.querySelector('.lightbox-cap');
		const chrome = dialogEl?.querySelectorAll('.lightbox-close, .lightbox-nav, .lightbox-count');
		if (cap) {
			gsap.fromTo(
				cap,
				{ autoAlpha: 0, y: 6 },
				{ autoAlpha: 1, y: 0, duration: 0.18, delay, ease: 'power2.out' }
			);
		}
		if (chrome?.length) {
			gsap.fromTo(
				chrome,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: 0.16, delay: delay + 0.04, ease: 'power2.out' }
			);
		}
	}

	function fadeChromeOut() {
		const cap = dialogEl?.querySelector('.lightbox-cap');
		const chrome = dialogEl?.querySelectorAll('.lightbox-close, .lightbox-nav, .lightbox-count');
		if (cap) gsap.to(cap, { autoAlpha: 0, duration: 0.1, ease: 'power1.in' });
		if (chrome?.length) gsap.to(chrome, { autoAlpha: 0, duration: 0.1, ease: 'power1.in' });
	}

	function runOpenFlip(shot: HTMLImageElement) {
		const reduce = lightboxReduceMotion();
		const origin = imageLightbox.originEl;
		const flipId = imageLightbox.flipId;
		const scrim = scrimEl;

		if (scrim) {
			gsap.fromTo(
				scrim,
				{ autoAlpha: 0 },
				{ autoAlpha: 1, duration: reduce ? 0 : OPEN_MS, ease: 'power2.out' }
			);
		}

		if (reduce || !origin?.isConnected || !flipId) {
			gsap.fromTo(
				shot,
				{ autoAlpha: 0, scale: reduce ? 1 : 0.96 },
				{ autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.2, ease: 'power2.out' }
			);
			fadeChromeIn(0.04);
			return;
		}

		origin.dataset.flipId = flipId;
		shot.dataset.flipId = flipId;

		const state = Flip.getState(origin);
		flipping = true;
		gsap.set(shot, { autoAlpha: 1 });

		Flip.from(state, {
			targets: shot,
			duration: OPEN_MS,
			ease: 'power2.inOut',
			absolute: true,
			scale: true,
			fade: true,
			onComplete: () => {
				flipping = false;
				clearFlipStyles(shot);
			}
		});

		fadeChromeIn(OPEN_MS * 0.45);
	}

	function finishClose() {
		flipping = false;
		closeLightbox();
	}

	function requestClose() {
		if (flipping) return;
		const reduce = lightboxReduceMotion();
		const shot = shotEl;
		const origin = imageLightbox.originEl;
		const flipId = imageLightbox.flipId;
		const scrim = scrimEl;

		fadeChromeOut();
		if (scrim) {
			gsap.to(scrim, {
				autoAlpha: 0,
				duration: reduce ? 0 : CLOSE_MS,
				ease: 'power2.in'
			});
		}

		if (reduce || !shot || !origin?.isConnected || !flipId) {
			if (shot && !reduce) {
				gsap.to(shot, {
					autoAlpha: 0,
					scale: 0.97,
					duration: 0.16,
					ease: 'power2.in',
					onComplete: finishClose
				});
			} else {
				finishClose();
			}
			return;
		}

		/* Keep the dialog alive and fit the modal shot back onto the thumb. */
		flipping = true;
		origin.dataset.flipId = flipId;
		shot.dataset.flipId = flipId;
		gsap.set(origin, { autoAlpha: 0 });

		Flip.fit(shot, origin, {
			duration: CLOSE_MS,
			ease: 'power2.inOut',
			scale: true,
			absolute: true,
			onComplete: () => {
				clearFlipStyles(shot);
				clearFlipStyles(origin);
				gsap.set(origin, { autoAlpha: 1, clearProps: 'opacity,visibility' });
				delete origin.dataset.flipId;
				finishClose();
			}
		});
	}

	/**
	 * Native modal: `showModal()` puts the dialog in the top layer so it cannot
	 * sit under HUD / TOC / wiki peek, and is not trapped by SvelteKit's
	 * `display: contents` wrapper (`position: fixed` fails there in WebKit).
	 */
	const mountDialog: Attachment<HTMLDialogElement> = (node) => {
		dialogEl = node;
		const prev = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		/* Next frame: opening during the same click that mounted us would hit
		   the dialog and close it (classic overlay ghost-click). */
		const frame = requestAnimationFrame(() => {
			if (!node.isConnected) return;
			if (!node.open) node.showModal();
		});
		return () => {
			cancelAnimationFrame(frame);
			document.documentElement.style.overflow = prev;
			dialogEl = null;
		};
	};

	const mountScrim: Attachment<HTMLButtonElement> = (node) => {
		scrimEl = node;
		gsap.set(node, { autoAlpha: 0 });
		return () => {
			scrimEl = null;
		};
	};

	const mountShot: Attachment<HTMLImageElement> = (node) => {
		shotEl = node;
		gsap.set(node, { autoAlpha: 0 });

		let started = false;
		const start = () => {
			if (started || !node.isConnected) return;
			started = true;
			runOpenFlip(node);
		};

		if (node.complete && node.naturalWidth > 0) {
			const frame = requestAnimationFrame(start);
			return () => {
				cancelAnimationFrame(frame);
				shotEl = null;
			};
		}

		node.addEventListener('load', start, { once: true });
		const timer = window.setTimeout(start, 140);
		return () => {
			node.removeEventListener('load', start);
			window.clearTimeout(timer);
			shotEl = null;
		};
	};

	/** Distance (px) a finger must travel before a swipe counts. */
	const SWIPE_PX = 48;

	/**
	 * Touch has no arrow keys: swipe sideways through a stack, swipe down to close.
	 * A tap (no travel) falls through to the scrim and buttons as a click.
	 */
	let swipedAt = 0;
	/** The click a browser may still send after a swipe ends on the scrim. */
	const justSwiped = () => performance.now() - swipedAt < 400;

	const swipe: Attachment<HTMLElement> = (node) => {
		let start: { x: number; y: number; id: number } | null = null;
		const down = (e: PointerEvent) => {
			if (e.pointerType === 'mouse' || !e.isPrimary) return;
			start = { x: e.clientX, y: e.clientY, id: e.pointerId };
		};
		const up = (e: PointerEvent) => {
			if (!start || e.pointerId !== start.id) return;
			const dx = e.clientX - start.x;
			const dy = e.clientY - start.y;
			start = null;
			if (flipping) return;
			if (hasStack && Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.4) {
				swipedAt = performance.now();
				stepLightbox(dx < 0 ? 1 : -1);
			} else if (dy > SWIPE_PX * 1.6 && dy > Math.abs(dx) * 1.4) {
				swipedAt = performance.now();
				requestClose();
			}
		};
		const cancel = () => (start = null);
		node.addEventListener('pointerdown', down);
		node.addEventListener('pointerup', up);
		node.addEventListener('pointercancel', cancel);
		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', cancel);
		};
	};

	function onDialogClose() {
		if (imageLightbox.open) closeLightbox();
	}

	function onKeydown(e: KeyboardEvent) {
		if (!imageLightbox.open) return;
		if (e.key === 'Escape') {
			requestClose();
			e.stopPropagation();
			return;
		}
		if (flipping) return;
		if (e.key === 'ArrowRight') {
			stepLightbox(1);
			e.preventDefault();
		}
		if (e.key === 'ArrowLeft') {
			stepLightbox(-1);
			e.preventDefault();
		}
	}

	function openInChronicle(episodeId: string) {
		requestClose();
		stripStoryHash();
		const home = resolve('/read');
		const onStory = page.url.pathname === home;
		if (onStory) {
			const el = findStoryHeading(canonicalHashId(episodeId));
			if (el) scrollToStoryHeading(el, 'smooth');
			return;
		}
		requestStoryJump(episodeId);
		void goto(home, { noScroll: true, replaceState: false });
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if imageLightbox.open && item}
	<dialog
		class="lightbox"
		aria-labelledby="lightbox-title"
		{@attach mountDialog}
		{@attach swipe}
		onclose={onDialogClose}
	>
		<button
			type="button"
			class="lightbox-scrim"
			aria-label="Close image"
			{@attach mountScrim}
			onclick={() => !justSwiped() && requestClose()}
		></button>
		<figure class="lightbox-frame">
			<img
				class="lightbox-shot"
				data-flip-id={imageLightbox.flipId || undefined}
				{@attach mountShot}
				{...storyImg(item.src, {
					kind: 'hero',
					alt: item.alt,
					sizes: '96vw',
					priority: true,
					widths: [828, 1200, 1920]
				})}
			/>
			<figcaption class="lightbox-cap">
				<p id="lightbox-title" class="lightbox-title">{item.title}</p>
				{#if item.caption}
					<p class="lightbox-id">{item.caption}</p>
				{/if}
				{#if item.nsfw}
					<p class="lightbox-nsfw">NSFW</p>
				{/if}
				{#if item.episodeId}
					<button
						type="button"
						class="lightbox-jump"
						onclick={() => item?.episodeId && openInChronicle(item.episodeId)}
					>
						Open in chronicle
					</button>
				{/if}
			</figcaption>
		</figure>
		{#if hasStack}
			<p class="lightbox-count" aria-live="polite">
				{imageLightbox.index + 1} / {imageLightbox.items.length}
			</p>
		{/if}
		<button type="button" class="lightbox-close" onclick={requestClose} aria-label="Close">
			✕
		</button>
	</dialog>
{/if}

<style>
	.lightbox {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		border: none;
		background: transparent;
		color: inherit;
		z-index: 240;
		display: grid;
		place-items: center;
		padding: max(1.1rem, env(safe-area-inset-top, 0px))
			max(1.1rem, env(safe-area-inset-right, 0px)) max(1.1rem, env(safe-area-inset-bottom, 0px))
			max(1.1rem, env(safe-area-inset-left, 0px));
		overflow: hidden;
		overscroll-behavior: contain;
		/* Swipes belong to the lightbox; a pinch still zooms. */
		touch-action: pinch-zoom;
	}

	/* Real blur lives on .lightbox-scrim (animatable). Keep native backdrop clear. */
	.lightbox::backdrop {
		background: transparent;
	}

	.lightbox-scrim {
		position: absolute;
		inset: 0;
		z-index: 0;
		margin: 0;
		padding: 0;
		border: none;
		cursor: zoom-out;
		background: color-mix(in srgb, #050508 62%, transparent);
		backdrop-filter: blur(18px) saturate(1.05);
		-webkit-backdrop-filter: blur(18px) saturate(1.05);
	}

	.lightbox-frame {
		position: relative;
		z-index: 1;
		margin: 0;
		display: grid;
		justify-items: center;
		gap: 0.7rem;
		max-width: min(80vw, 76rem);
		max-height: min(80dvh, 76rem);
		pointer-events: auto;
	}

	.lightbox-shot {
		display: block;
		width: auto;
		height: auto;
		max-width: min(80vw, 76rem);
		max-height: min(68dvh, 72rem);
		object-fit: contain;
		object-position: center;
		border-radius: 12px;
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
		-webkit-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
	}

	.lightbox-cap {
		display: grid;
		gap: 0.2rem;
		justify-items: center;
		text-align: center;
		max-width: min(36rem, 90vw);
	}

	.lightbox-cap p {
		margin: 0;
	}

	.lightbox-title {
		font-family: var(--serif);
		font-size: 0.95rem;
		letter-spacing: var(--tracking-display);
		color: #fff;
	}

	.lightbox-id {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #fff;
	}

	.lightbox-nsfw {
		width: fit-content;
		margin-top: 0.15rem;
		padding: 0.08rem 0.42rem;
		font-size: 0.58rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #fff7f8;
		background: #9f1239;
		border-radius: var(--radius-pill);
	}

	.lightbox-jump {
		margin-top: 0.35rem;
		font: inherit;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--gold);
		background: none;
		border: none;
		padding: 0.35rem 0.2rem;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.lightbox-jump:hover {
		color: var(--fg-strong);
	}

	.lightbox-close {
		position: absolute;
		top: max(0.7rem, env(safe-area-inset-top, 0px));
		right: max(0.7rem, env(safe-area-inset-right, 0px));
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		padding: 0;
		border: none;
		background: none;
		color: #fff;
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
		z-index: 2;
		transition: opacity 0.15s var(--ease);
	}

	.lightbox-close:hover {
		opacity: 0.7;
	}

	.lightbox-count {
		position: absolute;
		z-index: 2;
		bottom: max(0.7rem, env(safe-area-inset-bottom, 0px));
		left: 50%;
		transform: translateX(-50%);
		margin: 0;
		padding: 0.2rem 0.55rem;
		font-size: 0.68rem;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.08em;
		color: var(--fg-faint);
		background: var(--glass);
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		backdrop-filter: blur(12px);
	}

	/* Phones: the picture takes the width, the words tighten, the controls stay in thumb reach. */
	@media (max-width: 640px) {
		.lightbox {
			padding: max(3.25rem, env(safe-area-inset-top, 0px)) max(0.6rem, env(safe-area-inset-right, 0px))
				max(2.75rem, env(safe-area-inset-bottom, 0px)) max(0.6rem, env(safe-area-inset-left, 0px));
		}

		.lightbox-frame {
			gap: 0.55rem;
			max-width: 100%;
			max-height: 100%;
		}

		.lightbox-shot {
			max-width: 100%;
			max-height: min(72dvh, calc(100dvh - 9rem));
		}

		.lightbox-cap {
			max-width: 100%;
			padding: 0 0.4rem;
		}

		.lightbox-title {
			font-size: 0.88rem;
			line-height: 1.35;
		}

		.lightbox-jump {
			padding: 0.6rem 0.8rem;
		}

		.lightbox-close {
			top: max(0.35rem, env(safe-area-inset-top, 0px));
			right: max(0.35rem, env(safe-area-inset-right, 0px));
			width: 3rem;
			height: 3rem;
			font-size: 1.75rem;
		}

		.lightbox-count {
			bottom: max(0.6rem, env(safe-area-inset-bottom, 0px));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lightbox {
			transition: none;
		}

		.lightbox-scrim {
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}
	}
</style>
