<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { storyImg } from '$lib/img';

	let {
		src,
		alt = '',
		live = false,
		sizes = '9rem'
	}: { src: string; alt?: string; live?: boolean; sizes?: string } = $props();

	/** Resting lean, plus how far the cursor may push it. Degrees. */
	const REST_X = 3;
	const REST_Y = -5;
	const PUSH_X = 7;
	const PUSH_Y = 9;

	const tilt: Attachment<HTMLElement> = (node) => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mq.matches) {
			node.style.transform = 'none';
			return () => {
				node.style.transform = '';
			};
		}

		let rx = REST_X;
		let ry = REST_Y;
		let tx = REST_X;
		let ty = REST_Y;
		let raf = 0;

		const paint = () => {
			node.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
		};

		const step = () => {
			rx += (tx - rx) * 0.18;
			ry += (ty - ry) * 0.18;
			paint();
			if (Math.abs(tx - rx) > 0.04 || Math.abs(ty - ry) > 0.04) {
				if (!raf) {
					raf = requestAnimationFrame(() => {
						raf = 0;
						step();
					});
				}
			}
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType && e.pointerType !== 'mouse') return;
			const field = node.closest('.picture')?.getBoundingClientRect() ?? node.getBoundingClientRect();
			const nx = (e.clientX - (field.left + field.width / 2)) / (field.width / 2);
			const ny = (e.clientY - (field.top + field.height / 2)) / (field.height / 2);
			const cx = Math.max(-1, Math.min(1, nx));
			const cy = Math.max(-1, Math.min(1, ny));
			ty = REST_Y + cx * PUSH_Y;
			tx = REST_X - cy * PUSH_X;
			step();
		};

		const onLeave = () => {
			tx = REST_X;
			ty = REST_Y;
			step();
		};

		window.addEventListener('pointermove', onMove, { passive: true });
		document.documentElement.addEventListener('pointerleave', onLeave);

		paint();

		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onMove);
			document.documentElement.removeEventListener('pointerleave', onLeave);
			node.style.transform = '';
		};
	};
</script>

<div class="album">
	<div class="rig">
		<div class="box" {@attach live && tilt}>
			<div class="front">
				<img
					{...storyImg(src, {
						kind: 'thumb',
						sizes,
						widths: [128, 256, 384, 640],
						alt
					})}
				/>
				<span class="sheen" aria-hidden="true"></span>
			</div>
			<span class="edge" aria-hidden="true"></span>
			<span class="lid" aria-hidden="true"></span>
		</div>
	</div>
</div>

<style>
	/*
	 * Thin box. A few degrees of rest lean, then the live cover eases
	 * toward the cursor across the picture. Parents resize it through
	 * `--album-size`; the right margin leaves room for the box edge.
	 */
	.album {
		--depth: 0.5rem;
		width: var(--album-size, 7.6rem);
		margin: 0 0.6rem 0.75rem 0;
		pointer-events: none;
	}

	.rig {
		position: relative;
		aspect-ratio: 1;
		perspective: 880px;
		perspective-origin: 50% 45%;
		transform-style: preserve-3d;
	}

	.box {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform-origin: center center;
		transform: rotateX(3deg) rotateY(-5deg);
	}

	.front {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 2px;
		background: #161616;
		transform: translateZ(calc(var(--depth) / 2));
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.22) inset,
			0 16px 28px rgba(0, 0, 0, 0.38);
	}

	.front img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center center;
		display: block;
	}

	.sheen {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			128deg,
			rgba(255, 255, 255, 0.42) 0%,
			rgba(255, 255, 255, 0.08) 22%,
			transparent 42%
		);
		mix-blend-mode: soft-light;
	}

	.edge {
		position: absolute;
		top: 0;
		right: 0;
		width: var(--depth);
		height: 100%;
		transform-origin: right center;
		transform: rotateY(90deg);
		background: linear-gradient(90deg, #2c2926 0%, #b7aea2 28%, #f3efe8 52%, #6e675e 100%);
	}

	.lid {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--depth);
		transform-origin: center top;
		transform: rotateX(90deg);
		background: linear-gradient(#f7f4ee, #9a9186);
	}

	@media (max-width: 720px) {
		.album {
			width: var(--album-size, 5.35rem);
			margin: 0 0.25rem 0.5rem 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.box {
			transform: none;
		}

		.edge,
		.lid {
			display: none;
		}

		.front {
			transform: none;
			box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
		}
	}
</style>
