<script lang="ts">
	/** Momal's background: three slow blurred lights in Goguryeo red, Baekje gold and Silla blue. */
	let { strength = 0.2, size = '60vmax' }: { strength?: number; size?: string } = $props();
</script>

<div class="aurora" style:--strength={strength} style:--size={size} aria-hidden="true">
	<span class="blob red"></span>
	<span class="blob gold"></span>
	<span class="blob blue"></span>
</div>

<style>
	.aurora {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		opacity: var(--strength);
		transition: opacity 560ms ease;
	}

	.blob {
		position: absolute;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
		filter: blur(90px);
		will-change: transform;
	}

	.red {
		left: -30%;
		top: -36%;
		background: #e94949;
		animation: drift-a 22s ease-in-out infinite alternate;
	}

	.gold {
		right: -38%;
		top: 12%;
		background: #ffb900;
		animation: drift-b 26s ease-in-out infinite alternate;
	}

	.blue {
		left: 18%;
		bottom: -52%;
		background: #3e79e4;
		animation: drift-c 24s ease-in-out infinite alternate;
	}

	@keyframes drift-a {
		to {
			transform: translate(18%, 14%) scale(1.1);
		}
	}

	@keyframes drift-b {
		to {
			transform: translate(-16%, 18%) scale(0.92);
		}
	}

	@keyframes drift-c {
		to {
			transform: translate(12%, -16%) scale(1.08);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.blob {
			animation: none;
		}
	}
</style>
