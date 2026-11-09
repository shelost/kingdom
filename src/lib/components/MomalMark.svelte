<script lang="ts" module>
	/** Goguryeo red, Baekje gold, Silla blue: Momal's three colours, in samtaegeuk order. */
	export const MOMAL_COLORS = ['#e94949', '#ffb900', '#3e79e4'] as const;

	/* Three commas: each one runs out of the centre on a half-radius arc, along a third
	   of the rim, and back on the next comma's arc. */
	const C = 50;
	const R = 48;
	const rim = (deg: number) => {
		const a = (deg * Math.PI) / 180;
		return `${(C + R * Math.cos(a)).toFixed(2)} ${(C + R * Math.sin(a)).toFixed(2)}`;
	};
	const ANGLES = [-90, 30, 150];
	const COMMAS = ANGLES.map((deg, i) => {
		const from = rim(deg);
		const to = rim(ANGLES[(i + 1) % 3]);
		return `M${C} ${C}A${R / 2} ${R / 2} 0 0 1 ${from}A${R} ${R} 0 0 1 ${to}A${R / 2} ${R / 2} 0 0 0 ${C} ${C}Z`;
	});
</script>

<script lang="ts">
	let { size = 22, spinning = false }: { size?: number; spinning?: boolean } = $props();
</script>

<svg class="mark" class:spinning viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
	{#each COMMAS as d, i (i)}
		<path {d} fill={MOMAL_COLORS[i]} />
	{/each}
</svg>

<style>
	.mark {
		display: block;
		flex: 0 0 auto;
		filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.12));
	}

	.spinning {
		animation: momal-spin 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	}

	@keyframes momal-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinning {
			animation: none;
		}
	}
</style>
