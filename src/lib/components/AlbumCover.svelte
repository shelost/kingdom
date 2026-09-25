<script lang="ts">
	import { storyImg } from '$lib/img';

	let { src, alt = '' }: { src: string; alt?: string } = $props();
</script>

<div class="album">
	<div class="rig">
		<div class="box">
			<div class="front">
				<img
					{...storyImg(src, {
						kind: 'thumb',
						sizes: '9rem',
						widths: [128, 256, 384],
						alt
					})}
				/>
				<span class="sheen" aria-hidden="true"></span>
			</div>
			<span class="edge" aria-hidden="true"></span>
			<span class="lid" aria-hidden="true"></span>
		</div>
		<span class="contact" aria-hidden="true"></span>
		<span class="shelf" aria-hidden="true"></span>
	</div>
</div>

<style>
	/*
	 * Shopify Editions albums are thin boxes (depth ≈ 1% of the face) standing
	 * on a pale shelf: a cover texture, a plastic-wrap highlight, and a soft
	 * contact shadow. Depth is exaggerated just enough to read at this size.
	 */
	.album {
		--depth: 0.55rem;
		width: 10.5rem;
		margin: 0 0 0.95rem;
		pointer-events: none;
	}

	.rig {
		position: relative;
		height: 9.5rem;
		perspective: 680px;
		perspective-origin: 40% 30%;
		transform-style: preserve-3d;
	}

	.box {
		position: absolute;
		left: 0.15rem;
		bottom: 0.85rem;
		width: 7.6rem;
		aspect-ratio: 1;
		transform-style: preserve-3d;
		transform: rotateX(12deg) rotateY(-18deg);
		transform-origin: 50% 100%;
	}

	.front {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border-radius: 2px;
		background: #161616;
		transform: translateZ(calc(var(--depth) / 2));
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.22) inset;
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

	.shelf {
		position: absolute;
		left: -0.15rem;
		right: 0.35rem;
		bottom: 0.05rem;
		height: 1.35rem;
		border-radius: 3px;
		background: linear-gradient(180deg, #f7f7f6 0%, #dedcd8 100%);
		box-shadow:
			0 1px 0 rgba(255, 255, 255, 0.9) inset,
			0 14px 22px rgba(0, 0, 0, 0.42);
		transform: rotateX(72deg);
		transform-origin: center bottom;
	}

	.contact {
		position: absolute;
		left: 8%;
		width: 62%;
		bottom: 0.55rem;
		height: 1.1rem;
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.62), transparent 70%);
		filter: blur(4px);
		transform: translateZ(2px) rotateX(72deg);
		transform-origin: center bottom;
	}

	@media (max-width: 720px) {
		.album {
			width: 7.4rem;
			margin-bottom: 0.6rem;
		}

		.rig {
			height: 6.7rem;
		}

		.box {
			width: 5.35rem;
			bottom: 0.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.box {
			transform: none;
		}

		.edge,
		.lid,
		.shelf,
		.contact {
			display: none;
		}

		.front {
			transform: none;
			box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
		}
	}
</style>
