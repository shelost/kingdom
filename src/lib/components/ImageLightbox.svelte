<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import gsap from 'gsap';
	import { Flip } from 'gsap/Flip';
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
		const home = resolve('/');
		const here = page.url.pathname;
		const onStory = here === home || here === '/';
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
		onclose={onDialogClose}
	>
		<button
			type="button"
			class="lightbox-scrim"
			aria-label="Close image"
			{@attach mountScrim}
			onclick={requestClose}
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
			<button
				type="button"
				class="lightbox-nav prev"
				onclick={() => stepLightbox(-1)}
				aria-label="Previous image"
			>
				‹
			</button>
			<button
				type="button"
				class="lightbox-nav next"
				onclick={() => stepLightbox(1)}
				aria-label="Next image"
			>
				›
			</button>
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
		max-width: min(96vw, 92rem);
		max-height: min(92dvh, 92rem);
		pointer-events: auto;
	}

	.lightbox-shot {
		display: block;
		width: auto;
		height: auto;
		max-width: min(96vw, 92rem);
		max-height: min(82dvh, 88rem);
		object-fit: contain;
		object-position: center;
		border-radius: var(--radius);
		border: 1px solid var(--hairline);
		background: color-mix(in srgb, var(--panel-sunken) 70%, var(--bg));
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
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
		color: var(--fg-strong);
	}

	.lightbox-id {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--fg-faint);
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
		width: 2.1rem;
		height: 2.1rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		color: var(--fg-strong);
		cursor: pointer;
		backdrop-filter: blur(12px);
		z-index: 2;
	}

	.lightbox-close:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
	}

	.lightbox-nav {
		position: absolute;
		top: 50%;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		padding: 0;
		border: 1px solid var(--hairline);
		border-radius: var(--radius-pill);
		background: var(--glass);
		color: var(--fg-strong);
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		backdrop-filter: blur(12px);
		transform: translateY(-50%);
	}

	.lightbox-nav.prev {
		left: max(0.7rem, env(safe-area-inset-left, 0px));
	}

	.lightbox-nav.next {
		right: max(0.7rem, env(safe-area-inset-right, 0px));
	}

	.lightbox-nav:hover {
		color: var(--gold);
		border-color: color-mix(in srgb, var(--gold) 45%, transparent);
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
