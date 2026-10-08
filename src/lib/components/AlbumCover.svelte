<script lang="ts">
	import { storyImg } from '$lib/img';

	let { src, alt = '', sizes = '9rem' }: { src: string; alt?: string; sizes?: string } = $props();
</script>

<div class="album">
	<div class="rig">
		<div class="box">
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
	 * Thin box at a few degrees of rest lean. Parents resize it through
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
