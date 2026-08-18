<svelte:options namespace="svg" />

<script lang="ts">
	/**
	 * White-on-black label pill, attached to an org-chart node.
	 * Short KO, optional hanja, and optional 1–2 word EN — sized for full
	 * diagrams and wiki thumbnails.
	 */
	let {
		x,
		y,
		ko,
		han,
		en,
		w = 52,
		size = 'md'
	}: {
		x: number | string;
		y: number | string;
		ko: string;
		han?: string;
		en?: string;
		w?: number;
		size?: 'sm' | 'md' | 'lg';
	} = $props();

	const px = $derived(Number(x));
	const py = $derived(Number(y));
	const lines = $derived(1 + (han ? 1 : 0) + (en ? 1 : 0));
	const h = $derived(
		size === 'sm'
			? lines === 1
				? 12
				: lines === 2
					? 18
					: 24
			: size === 'lg'
				? lines === 1
					? 16
					: lines === 2
						? 26
						: 36
				: lines === 1
					? 14
					: lines === 2
						? 22
						: 30
	);
	const rx = $derived(Math.min(4, h / 2));
	const koDy = $derived(
		lines === 1 ? (size === 'sm' ? 3 : 4) : lines === 2 ? (size === 'lg' ? -4 : -5) : size === 'lg' ? -9 : -8
	);
	const midDy = $derived(size === 'lg' ? 4 : 3);
	const enDy = $derived(lines === 3 ? (size === 'lg' ? 13 : 11) : size === 'lg' ? 9 : 8);
</script>

<g class="chart-label" class:sm={size === 'sm'} class:lg={size === 'lg'}>
	<rect class="pill" x={px - w / 2} y={py - h / 2} width={w} height={h} {rx} />
	<text class="l-ko" class:single={lines === 1} x={px} y={py + koDy}>{ko}</text>
	{#if han}
		<text class="l-han" x={px} y={py + (en ? midDy : enDy)}>{han}</text>
	{/if}
	{#if en}
		<text class="l-en" x={px} y={py + enDy}>{en}</text>
	{/if}
</g>

<style>
	.pill {
		fill: #0c0c10;
		stroke: none;
	}

	.l-ko,
	.l-han,
	.l-en {
		text-anchor: middle;
		font-family: var(--serif);
	}

	.l-ko {
		fill: #ffffff;
		font-size: 10px;
		font-weight: 700;
	}

	.l-ko.single {
		font-size: 9px;
	}

	.l-han {
		fill: #f4efe6;
		font-size: 7px;
		letter-spacing: 0.04em;
		opacity: 0.88;
	}

	.l-en {
		fill: #f4efe6;
		font-size: 6.5px;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.sm .l-ko,
	.sm .l-ko.single {
		font-size: 8px;
	}

	.sm .l-han {
		font-size: 6px;
	}

	.sm .l-en {
		font-size: 5.2px;
	}

	.lg .l-ko {
		font-size: 12px;
	}

	.lg .l-ko.single {
		font-size: 11px;
	}

	.lg .l-han {
		font-size: 8px;
	}

	.lg .l-en {
		font-size: 7px;
	}
</style>
