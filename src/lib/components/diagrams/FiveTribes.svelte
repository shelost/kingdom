<script lang="ts">
	/**
	 * Jolbon five animal tribes — predecessor of Goguryeo’s five commanderies.
	 * Faces from `ch_*` chief portraits; hub is the Jolbon cavern place still.
	 */
	import type { DiagramProps } from './registry';
	import ChartLabel from './ChartLabel.svelte';
	import { byId, avatarOf } from '$lib/people';

	let { step = 'league', active = false }: DiagramProps = $props();

	const CX = 180;
	const CY = 122;
	const R = 86;
	const FACE = 26;
	const uid = `ft-${Math.floor(Math.random() * 1e9)}`;

	const TRIBES = $derived.by(() =>
		[
			{ ko: '까마귀', en: 'East', id: 'yeontabal' },
			{ ko: '호랑이', en: 'West', id: 'tigerchief' },
			{ ko: '멧돼지', en: 'South', id: 'boarchief' },
			{ ko: '늑대', en: 'North', id: 'wolfchief' },
			{ ko: '곰', en: 'Central', id: 'bearchief' }
		].map((c, i) => {
			const a = ((-90 + i * 72) * Math.PI) / 180;
			const person = byId.get(c.id);
			return {
				...c,
				i,
				x: CX + R * Math.cos(a),
				y: CY + R * Math.sin(a),
				href: (person && avatarOf(person)) || null
			};
		})
	);

	const hubHref = $derived.by(() => {
		const place = byId.get('jolbon');
		return (place && avatarOf(place)) || '/pl_jumong_cave.png';
	});
</script>

<svg
	viewBox="0 0 360 292"
	class="dg"
	class:play={active}
	data-step={step}
	role="img"
	aria-label="Diagram of Jolbon’s five animal tribes using chief portraits: crow east, tiger west, boar south, wolf north, bear central"
>
	<defs>
		<clipPath id={`${uid}-hub`}><circle cx={CX} cy={CY} r="32" /></clipPath>
		{#each TRIBES as c (c.i)}
			<clipPath id={`${uid}-${c.i}`}><circle cx={c.x} cy={c.y} r={FACE} /></clipPath>
		{/each}
	</defs>

	<circle class="ring" style="--d: 80" cx={CX} cy={CY} r={R} />

	{#each TRIBES as c (c.i)}
		<line
			class="spoke"
			style="--d: {140 + c.i * 70}"
			x1={CX}
			y1={CY}
			x2={c.x}
			y2={c.y}
			pathLength="100"
		/>
	{/each}

	<g class="center" style="--d: 0">
		<image
			href={hubHref}
			x={CX - 32}
			y={CY - 36}
			width="64"
			height="64"
			preserveAspectRatio="xMidYMid slice"
			clip-path={`url(#${uid}-hub)`}
		/>
		<circle class="hub-ring" cx={CX} cy={CY} r="32" />
		<ChartLabel x={CX} y={CY + 2} ko="졸본" en="five roofs" w={72} size="lg" />
	</g>

	{#each TRIBES as c (c.i)}
		<g class="node tribe" style="--d: {500 + c.i * 100}">
			{#if c.href}
				<image
					href={c.href}
					x={c.x - FACE}
					y={c.y - FACE - 4}
					width={FACE * 2}
					height={FACE * 2}
					preserveAspectRatio="xMidYMin slice"
					clip-path={`url(#${uid}-${c.i})`}
				/>
			{/if}
			<circle class="face-ring" cx={c.x} cy={c.y} r={FACE} />
			<ChartLabel x={c.x} y={c.y + FACE + 12} ko={c.ko} en={c.en} w={52} size="sm" />
		</g>
	{/each}

	<text class="foot" style="--d: 1300" x="180" y="278">오부족 · later the five commanderies</text>
</svg>

<style>
	.dg {
		--accent: #4a6741;
		--jolbon: #4a6741;
		font-family: var(--serif);
	}

	.center,
	.node,
	.foot {
		opacity: 0;
		transition: opacity 600ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.node {
		transform: scale(0.35);
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 550ms var(--ease) calc(var(--d) * 1ms),
			transform 650ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .center,
	.play .node,
	.play .foot {
		opacity: 1;
	}

	.play .node {
		transform: scale(1);
	}

	.ring {
		fill: none;
		stroke: var(--jolbon);
		stroke-width: 2.2;
		stroke-dasharray: 3 5;
		opacity: 0;
		transition: opacity 700ms var(--ease);
		transition-delay: calc(var(--d) * 1ms);
	}

	.play .ring {
		opacity: 1;
	}

	.hub-ring,
	.face-ring {
		fill: none;
		stroke: var(--jolbon);
		stroke-width: var(--stroke-w);
	}

	.spoke {
		fill: none;
		stroke: var(--jolbon);
		stroke-width: var(--link-w);
		stroke-dasharray: 100 100;
		stroke-dashoffset: 100;
		opacity: 0;
		transition:
			stroke-dashoffset 800ms var(--ease) calc(var(--d) * 1ms),
			opacity 400ms var(--ease) calc(var(--d) * 1ms);
	}

	.play .spoke {
		stroke-dashoffset: 0;
		opacity: 1;
	}

	.foot {
		font-size: 7px;
		text-transform: none;
		letter-spacing: 0.06em;
		fill: var(--jolbon);
		text-anchor: middle;
	}

	@media (prefers-reduced-motion: reduce) {
		.dg,
		.dg * {
			transition: none !important;
			animation: none !important;
		}

		.play .spoke {
			stroke-dashoffset: 0;
			opacity: 1;
		}
	}
</style>
