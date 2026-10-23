<script lang="ts">
	/**
	 * A one-time moment over the script: love at first sight (a pink bloom, two
	 * heartbeats, a burst of petals) or a death (something pale rises and
	 * leaves). Sized in container units, so it fills the screen or, when
	 * `contained`, a positioned preview box.
	 */
	import type { Moment } from '$lib/story';

	let { kind, contained = false }: { kind: Moment; contained?: boolean } = $props();

	/** The petal burst of love at first sight: evenly round, with a little scatter. */
	const BURST = Array.from({ length: 26 }, (_, i) => ({
		a: Math.round((i / 26) * 360 + ((i * 37) % 11) - 5),
		r: 28 + ((i * 53) % 22),
		d: (i * 29) % 260
	}));
</script>

<div class="moment" class:contained data-moment={kind} aria-hidden="true">
	{#if kind === 'first-sight'}
		<span class="bloom"></span>
		<span class="beat"></span>
		<span class="beat second"></span>
		{#each BURST as p, i (i)}
			<i style:--a="{p.a}deg" style:--r="{p.r}cqmin" style:--d="{p.d}ms"></i>
		{/each}
	{:else}
		<span class="soul"></span>
	{/if}
</div>

<style>
	.moment {
		position: fixed;
		inset: 0;
		z-index: 61;
		pointer-events: none;
		overflow: hidden;
		container-type: size;
	}

	.contained {
		position: absolute;
	}

	/* ————— Love at first sight: the world goes pink, the heart knocks twice, petals burst. ————— */
	.bloom {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 50%, rgba(255, 170, 200, 0.5), rgba(255, 111, 174, 0.28) 40%, transparent 75%);
		mix-blend-mode: screen;
		opacity: 0;
		animation: bloom 3s ease-out forwards;
	}
	.beat {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 40cqmin;
		height: 40cqmin;
		translate: -50% -50%;
		border-radius: 50%;
		border: 3px solid rgba(255, 150, 190, 0.9);
		box-shadow: 0 0 30px rgba(255, 111, 174, 0.6);
		opacity: 0;
		animation: beat 1.3s cubic-bezier(0.2, 0.7, 0.3, 1) 0.15s forwards;
	}
	.beat.second {
		animation-delay: 0.5s;
	}
	.moment i {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 14px;
		height: 10px;
		border-radius: 80% 0 80% 0;
		background: linear-gradient(135deg, #ffe1ea, #ff8fb4);
		opacity: 0;
		animation: burst 2.4s cubic-bezier(0.15, 0.8, 0.3, 1) calc(0.45s + var(--d)) forwards;
	}

	/* ————— Death: something pale leaves upward. ————— */
	.soul {
		position: absolute;
		left: 50%;
		top: 55%;
		width: 26cqmin;
		height: 26cqmin;
		translate: -50% -50%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(220, 245, 255, 0.55), rgba(190, 233, 255, 0.15) 45%, transparent 70%);
		opacity: 0;
		animation: soul 3.2s ease-out 0.3s forwards;
	}

	@keyframes bloom {
		0% {
			opacity: 0;
		}
		18% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes beat {
		0% {
			scale: 0.3;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		100% {
			scale: 3.2;
			opacity: 0;
		}
	}

	@keyframes burst {
		0% {
			transform: rotate(var(--a)) translateX(0) rotate(0deg);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		100% {
			transform: rotate(var(--a)) translateX(var(--r)) rotate(400deg);
			opacity: 0;
		}
	}

	@keyframes soul {
		0% {
			opacity: 0;
			transform: translateY(0) scale(0.6);
		}
		25% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translateY(-35cqh) scale(1.4);
		}
	}
</style>
