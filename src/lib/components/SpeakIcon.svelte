<script lang="ts">
	/** A speaker cone with two waves — lit and pulsing while a line sounds. */
	let { on = false, size = 13 }: { on?: boolean; size?: number } = $props();
</script>

<svg
	class="ico"
	class:on
	viewBox="0 0 20 20"
	width={size}
	height={size}
	aria-hidden="true"
	focusable="false"
>
	<path class="cone" d="M2.6 7.4h2.9L9.6 4v12L5.5 12.6H2.6z" />
	<path class="arc near" d="M12.2 7.3a3.9 3.9 0 0 1 0 5.4" />
	<path class="arc far" d="M14.9 4.9a7.3 7.3 0 0 1 0 10.2" />
</svg>

<style>
	.ico {
		display: block;
		overflow: visible;
	}

	.cone {
		fill: currentColor;
	}

	.arc {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	/* At rest the outer wave is only implied; sounding, both breathe outward. */
	.arc.far {
		opacity: 0.4;
	}

	.ico.on .arc {
		animation: wave 900ms var(--ease, ease-in-out) infinite;
	}

	.ico.on .arc.far {
		animation-delay: 140ms;
	}

	@keyframes wave {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ico.on .arc {
			animation: none;
			opacity: 1;
		}
	}
</style>
