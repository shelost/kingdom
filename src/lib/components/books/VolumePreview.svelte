<script lang="ts">
	import gsap from 'gsap';
	import { MediaQuery } from 'svelte/reactivity';
	import type { BookVolume } from '$lib/books';
	import {
		BOOK_RATIO,
		PREVIEW_D_MIN,
		PREVIEW_H,
		previewThick,
		spineInk
	} from '$lib/books';
	import { storyImg } from '$lib/img';
	import { volumeCover } from '$lib/posters.svelte';
	import { spineColor, spineInkOf } from '$lib/spine.svelte';
	import { reading } from '$lib/reading.svelte';

	let {
		volume,
		volumes = [],
		cover,
		spine = '#3a2a1c',
		title = '',
		number,
		size = 'chapter',
		pose = 'tilt',
		height,
		ratio,
		thick: thickOverride,
		mark = ''
	}: {
		volume?: BookVolume;
		/** Chapter volumes inside an arc; their cloth, titles and thickness paint the spine. */
		volumes?: BookVolume[];
		cover?: string;
		spine?: string;
		title?: string;
		number?: number;
		size?: 'chapter' | 'arc';
		/** tilt = catalogue rest; stand = face-on; spine = shelf edge. */
		pose?: 'tilt' | 'stand' | 'spine';
		/** Cover height in rem. Falls back to chapter / arc. */
		height?: number;
		/** Cover width ÷ height. Falls back to BOOK_RATIO. */
		ratio?: number;
		/** Spine as a fraction of cover height. */
		thick?: number;
		/** Cloth monogram when there is no cover art. */
		mark?: string;
	} = $props();

	const REST_Y = -48;
	const REST_X = 6;
	const HOVER_Y = -28;
	const STAND_REST_Y = -24;
	const STAND_REST_X = 6;
	const STAND_HOVER_Y = -12;
	const SPINE_REST_Y = -78;
	const SPINE_REST_X = 4;
	const SPINE_HOVER_Y = -68;

	const narrow = new MediaQuery('max-width: 720px');
	const ko = $derived(reading.lang === 'ko');

	let books = $derived(volume ? [volume] : volumes);
	let src = $derived(cover ?? volumeCover(volume?.id ?? ''));
	let cloth = $derived(books[0] ? spineColor(books[0].id) : spine);
	let ink = $derived(books[0] ? spineInkOf(books[0].id) : spineInk(cloth));
	let heightRem = $derived(
		height ??
			(size === 'arc'
				? narrow.current
					? PREVIEW_H.arcNarrow
					: PREVIEW_H.arc
				: narrow.current
					? PREVIEW_H.chapterNarrow
					: PREVIEW_H.chapter)
	);
	let faceRatio = $derived(ratio ?? BOOK_RATIO);
	let thick = $derived(thickOverride ?? previewThick(books));
	let sizes = $derived(`${heightRem}rem`);

	function labelOf(v: BookVolume): string {
		return ko ? v.ko || v.title : v.title;
	}

	function stage(node: HTMLDivElement) {
		const box = node.querySelector('.box');
		if (!(box instanceof HTMLElement)) return;

		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const fine = !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches;

		function angles() {
			if (node.classList.contains('pose-spine')) {
				return { y: SPINE_REST_Y, x: SPINE_REST_X, hoverY: SPINE_HOVER_Y };
			}
			if (node.classList.contains('pose-stand')) {
				return { y: STAND_REST_Y, x: STAND_REST_X, hoverY: STAND_HOVER_Y };
			}
			return { y: REST_Y, x: REST_X, hoverY: HOVER_Y };
		}

		let rotY: ReturnType<typeof gsap.quickTo> | undefined;
		let rotX: ReturnType<typeof gsap.quickTo> | undefined;
		let zTo: ReturnType<typeof gsap.quickTo> | undefined;
		let scaleTo: ReturnType<typeof gsap.quickTo> | undefined;

		const ctx = gsap.context(() => {
			const rest = angles();
			gsap.set(box, {
				transformOrigin: 'center center',
				rotationY: rest.y,
				rotationX: rest.x,
				z: 0,
				scale: 1,
				force3D: true
			});
			rotY = gsap.quickTo(box, 'rotationY', { duration: 0.48, ease: 'power3.out' });
			rotX = gsap.quickTo(box, 'rotationX', { duration: 0.48, ease: 'power3.out' });
			zTo = gsap.quickTo(box, 'z', { duration: 0.42, ease: 'power3.out' });
			scaleTo = gsap.quickTo(box, 'scale', { duration: 0.42, ease: 'power3.out' });
		}, node);

		function pose(clientX: number, clientY: number, hovering: boolean) {
			if (!rotY || !rotX || !zTo || !scaleTo) return;
			const r = node.getBoundingClientRect();
			const px = (clientX - r.left) / r.width - 0.5;
			const py = (clientY - r.top) / r.height - 0.5;
			const rest = angles();
			rotY((hovering ? rest.hoverY : rest.y) + px * 28);
			rotX(rest.x + py * -14);
			zTo(hovering ? 18 : 0);
			scaleTo(hovering ? 1.04 : 1);
			node.style.setProperty('--sx', `${(px + 0.5) * 100}%`);
			node.style.setProperty('--sy', `${(py + 0.5) * 100}%`);
			node.style.setProperty('--pox', `${40 + px * 24}%`);
			node.style.setProperty('--poy', `${38 + py * 18}%`);
		}

		function onEnter(e: PointerEvent) {
			if (!fine) return;
			node.classList.add('live');
			pose(e.clientX, e.clientY, true);
		}

		function onMove(e: PointerEvent) {
			if (!fine) return;
			pose(e.clientX, e.clientY, true);
		}

		function onLeave() {
			if (!fine) return;
			node.classList.remove('live');
			const rest = angles();
			rotY?.(rest.y);
			rotX?.(rest.x);
			zTo?.(0);
			scaleTo?.(1);
			node.style.setProperty('--sx', '28%');
			node.style.setProperty('--sy', '16%');
			node.style.setProperty('--pox', '32%');
			node.style.setProperty('--poy', '40%');
		}

		if (fine) {
			node.addEventListener('pointerenter', onEnter);
			node.addEventListener('pointermove', onMove);
			node.addEventListener('pointerleave', onLeave);
		}

		let io: IntersectionObserver | undefined;
		if (!reduce) {
			io = new IntersectionObserver(
				([entry]) => {
					if (!entry?.isIntersecting) return;
					io?.disconnect();
					gsap.from(box, {
						y: 22,
						autoAlpha: 0.35,
						duration: 0.75,
						ease: 'power3.out'
					});
				},
				{ threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
			);
			io.observe(node);
		}

		return {
			destroy() {
				io?.disconnect();
				node.removeEventListener('pointerenter', onEnter);
				node.removeEventListener('pointermove', onMove);
				node.removeEventListener('pointerleave', onLeave);
				ctx.revert();
			}
		};
	}
</script>

<div
	class="preview"
	class:arc={size === 'arc'}
	class:chapter={size === 'chapter'}
	class:han={ko}
	class:pose-stand={pose === 'stand'}
	class:pose-spine={pose === 'spine'}
	style:--h="{heightRem}rem"
	style:--ratio={faceRatio}
	style:--thick={thick}
	style:--d-min="{PREVIEW_D_MIN}rem"
	style:--cloth={cloth}
	style:--ink={ink}
	aria-hidden="true"
	use:stage
>
	<div class="rig">
		<div class="box">
			<div class="cover">
				{#if src}
					<img
						{...storyImg(src, {
							kind: 'thumb',
							sizes,
							widths: [256, 384, 640],
							alt: ''
						})}
						onerror={(e) => {
							e.currentTarget.style.display = 'none';
						}}
					/>
				{:else if mark}
					<span class="mark">{mark}</span>
				{/if}
				<span class="sheen"></span>
			</div>
			<span class="spine">
				{#if books.length}
					{#each books as vol (vol.id)}
						<span class="band" style:--cloth={spineColor(vol.id)} style:--ink={spineInkOf(vol.id)} style:flex-grow={vol.d}>
							<span class="num">{String(vol.number).padStart(2, '0')}</span>
							<span class="ttl">{labelOf(vol)}</span>
						</span>
					{/each}
				{:else}
					<span class="band">
						{#if number}<span class="num">{String(number).padStart(2, '0')}</span>{/if}
						{#if title}<span class="ttl">{title}</span>{/if}
					</span>
				{/if}
			</span>
			<span class="pages"></span>
			<span class="back"></span>
		</div>
	</div>
</div>

<style>
	.preview {
		--w: calc(var(--h) * var(--ratio));
		--d: max(var(--d-min), calc(var(--h) * var(--thick)));
		--sx: 28%;
		--sy: 16%;
		--pox: 32%;
		--poy: 40%;
		flex: 0 0 auto;
		box-sizing: content-box;
		width: calc(var(--w) * 0.88 + var(--d) * 1.25);
		height: var(--h);
		padding-left: 0.35rem;
		touch-action: pan-y;
	}

	.rig {
		width: var(--w);
		height: var(--h);
		margin-inline: auto;
		perspective: 1100px;
		perspective-origin: var(--pox) var(--poy);
		transform-style: preserve-3d;
	}

	.box {
		position: relative;
		width: 100%;
		height: 100%;
		transform-style: preserve-3d;
		transform-origin: center center;
		transform: rotateY(-48deg) rotateX(6deg);
	}

	.preview.pose-stand .box {
		transform: rotateY(-24deg) rotateX(6deg);
	}

	.preview.pose-spine {
		width: calc(var(--d) + 0.55rem);
	}

	.preview.pose-spine .box {
		transform: rotateY(-78deg) rotateX(4deg);
	}

	.mark {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-family: var(--serif);
		font-size: calc(var(--h) * 0.28);
		font-style: italic;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: color-mix(in srgb, var(--cloth, #16352c) 18%, #d4af77);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.12);
	}

	.cover,
	.pages,
	.back {
		position: absolute;
		backface-visibility: hidden;
	}

	.spine {
		position: absolute;
	}

	.cover {
		inset: 0;
		overflow: hidden;
		border-radius: 1px 3px 3px 1px;
		background: #1a1612;
		transform: translateZ(calc(var(--d) / 2));
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.18) inset,
			0 18px 32px rgba(0, 0, 0, 0.5);
		transition: box-shadow 0.4s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
	}

	.preview:global(.live) .cover {
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.22) inset,
			0 28px 48px rgba(0, 0, 0, 0.62);
	}

	.cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: center;
	}

	.sheen {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at var(--sx) var(--sy), rgba(255, 255, 255, 0.5), transparent 42%),
			linear-gradient(
				128deg,
				rgba(255, 255, 255, 0.22) 0%,
				transparent 32%,
				transparent 62%,
				rgba(0, 0, 0, 0.2) 100%
			);
		mix-blend-mode: soft-light;
		opacity: 0.55;
		transition: opacity 0.35s var(--ease, cubic-bezier(0.22, 0.61, 0.36, 1));
	}

	.preview:global(.live) .sheen {
		opacity: 0.95;
	}

	.spine {
		top: 0;
		left: calc(50% - var(--d) / 2);
		width: var(--d);
		height: 100%;
		display: flex;
		flex-direction: column;
		transform: rotateY(-90deg) translateZ(calc(var(--w) / 2 + 1px));
		color: var(--ink, #f6f1e6);
		overflow: hidden;
		border-radius: 2px 0 0 2px;
	}

	.band {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.28rem;
		min-height: 0;
		flex: 1 1 0;
		padding: 0.4rem 0 0.28rem;
		box-sizing: border-box;
		background:
			linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 35%, transparent 70%, rgba(255, 255, 255, 0.12)),
			var(--cloth, #241c14);
		color: var(--ink, #f6f1e6);
		box-shadow:
			inset 1px 0 0 rgba(0, 0, 0, 0.28),
			inset -1px 0 0 rgba(255, 255, 255, 0.22);
	}

	.num {
		flex: 0 0 auto;
		font-family: var(--ui);
		font-size: clamp(0.44rem, calc(var(--d) * 0.46), 0.64rem);
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.ttl {
		writing-mode: vertical-rl;
		text-orientation: mixed;
		font-family: var(--serif);
		font-size: clamp(0.44rem, calc(var(--d) * 0.42), 0.6rem);
		letter-spacing: 0.12em;
		overflow: hidden;
		max-height: 72%;
		white-space: nowrap;
	}

	.han .ttl,
	.han .num {
		font-family: var(--display-ko);
		font-weight: 400;
		letter-spacing: 0.04em;
	}

	.pages {
		top: 1.5%;
		left: calc(50% - var(--d) / 2);
		width: var(--d);
		height: 97%;
		transform: rotateY(90deg) translateZ(calc(var(--w) / 2));
		background: repeating-linear-gradient(90deg, #f3ead8 0 1px, #e7dcc6 1px 2px, #efe6d4 2px 3px);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
	}

	.back {
		inset: 0;
		border-radius: 3px 1px 1px 3px;
		background: color-mix(in srgb, var(--cloth, #241c14) 82%, #000);
		transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
	}

	@media (prefers-reduced-motion: reduce) {
		.box {
			transform: none;
		}

		.spine,
		.pages,
		.back {
			display: none;
		}

		.cover {
			transform: none;
			box-shadow: 0 10px 22px rgba(0, 0, 0, 0.4);
		}

		.preview {
			width: var(--w);
		}

		.sheen {
			opacity: 0.3;
		}
	}
</style>
