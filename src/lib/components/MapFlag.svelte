<script lang="ts">
	/**
	 * A small flag on a pole, planted over a map marker or a battle feature. When the
	 * holder changes (the border sweep crosses a capture, a battle phase changes
	 * hands), the old cloth drops down the pole and the new one runs up it.
	 * The parent positions it: the pole's foot sits on the parent's centre-top.
	 */
	import type { TransitionConfig } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import type { Banner } from '$lib/banners';
	import { FLAG_SIZE } from '$lib/mapLabels';

	let { banner, size = 'sm' }: { banner: Banner; size?: keyof typeof FLAG_SIZE } = $props();

	/** The finial rides 2px above the pole's box. */
	const box = $derived(FLAG_SIZE[size]);

	/** Halyard: `t` 0 is the cloth at the foot of the pole, furled; 1 is at the top, flying. */
	const halyard = (t: number) =>
		`transform: translateY(${((1 - t) * 175).toFixed(1)}%) scaleX(${(0.25 + t * 0.75).toFixed(3)}); opacity: ${Math.min(1, t * 2.5).toFixed(2)}`;

	function raise(_: Element, { delay = 0 } = {}): TransitionConfig {
		return { delay, duration: 560, easing: cubicOut, css: halyard };
	}

	function lower(_: Element): TransitionConfig {
		return { duration: 320, easing: cubicIn, css: halyard };
	}
</script>

<span class="mapflag" title={banner.label} style:--w="{box.w}px" style:--h="{box.h - 2}px">
	<i class="pole"></i>
	{#key banner.key}
		<span class="cloth" in:raise={{ delay: 280 }} out:lower>
			<span class="fabric" style:--c={banner.color}>
				{#if banner.src}<img src={banner.src} alt="" decoding="async" />{/if}
			</span>
		</span>
	{/key}
</span>

<style>
	.mapflag {
		position: absolute;
		left: 50%;
		bottom: 55%;
		width: var(--w);
		height: var(--h);
		pointer-events: none;
		filter: drop-shadow(0 1px 1.5px rgb(0 0 0 / 0.55));
	}

	.pole {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 1.5px;
		height: 100%;
		border-radius: 1px;
		background: color-mix(in srgb, var(--fg, #eee) 70%, #6b4f2c);
	}

	.pole::before {
		content: '';
		position: absolute;
		top: -2px;
		left: -1.25px;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--gold, #e8c36a);
	}

	.cloth {
		position: absolute;
		top: 1px;
		left: 1.5px;
		width: calc(var(--w) - 1.5px);
		aspect-ratio: 3 / 2;
		transform-origin: 0 50%;
	}

	.fabric {
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: 0 1.5px 1.5px 0;
		background: var(--c);
		box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 0.35);
		transform-origin: 0 50%;
	}

	.fabric img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@media (prefers-reduced-motion: no-preference) {
		.fabric {
			animation: wave 2.6s ease-in-out infinite alternate;
		}
	}

	@keyframes wave {
		from {
			transform: skewY(-5deg) scaleX(0.94);
		}
		to {
			transform: skewY(4deg) scaleX(1);
		}
	}
</style>
