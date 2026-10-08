<script lang="ts">
	import { CROSSED_SWORDS, STAR_GLYPH } from '$lib/mapPaths';
	import type { RenderedMap, RenderedPoint } from '$lib/outlines/types';

	let { map }: { map: RenderedMap } = $props();

	const GAP = 18;

	function labelAt(p: RenderedPoint): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
		switch (p.side) {
			case 'left':
				return { x: p.x - GAP, y: p.y + 9, anchor: 'end' };
			case 'above':
				return { x: p.x, y: p.y - GAP - 2, anchor: 'middle' };
			case 'below':
				return { x: p.x, y: p.y + GAP + 22, anchor: 'middle' };
			default:
				return { x: p.x + GAP, y: p.y + 9, anchor: 'start' };
		}
	}
</script>

<figure class="world-map">
	<svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={`${map.title}. ${map.caption}`}>
		<rect class="sea" width={map.width} height={map.height} />
		<path class="graticule" d={map.graticule} />
		<path class="land" d={map.land} />

		{#each map.routes as r, i (i)}
			<g class={`route ${r.kind}`}>
				<path class="line" d={r.d} />
				{#if r.head}<path class="head" d={r.head} />{/if}
				{#if r.label}
					<text class="route-label" x={r.lx} y={r.ly - 12} text-anchor="middle">{r.label}</text>
				{/if}
			</g>
		{/each}

		{#each map.points as p (p.id)}
			{@const l = labelAt(p)}
			<g class={`pin ${p.kind ?? 'site'}`}>
				{#if p.kind === 'capital'}
					<path d={STAR_GLYPH} transform={`translate(${p.x - 15} ${p.y - 15}) scale(2.5)`} />
				{:else if p.kind === 'battle'}
					<path class="swords" d={CROSSED_SWORDS} transform={`translate(${p.x} ${p.y}) scale(10)`} />
				{:else}
					<circle cx={p.x} cy={p.y} r="7" />
				{/if}
				<text x={l.x} y={l.y} text-anchor={l.anchor}>
					{p.name}{#if p.ko}<tspan class="ko" dx="7">{p.ko}</tspan>{/if}
				</text>
			</g>
		{/each}
	</svg>
	<figcaption>
		<b>{map.title}</b>{#if map.years}<span class="years"> · {map.years}</span>{/if}
		<span class="caption">{map.caption}</span>
	</figcaption>
</figure>

<style>
	.world-map {
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 0.5rem;
		border: 1px solid var(--hairline);
	}

	.sea {
		fill: color-mix(in srgb, var(--fg) 4%, transparent);
	}

	.graticule {
		fill: none;
		stroke: var(--hairline);
		stroke-width: 0.6;
	}

	.land {
		fill: color-mix(in srgb, var(--fg) 18%, transparent);
		stroke: color-mix(in srgb, var(--fg) 38%, transparent);
		stroke-width: 1;
		stroke-linejoin: round;
	}

	.route .line {
		fill: none;
		stroke: var(--accent);
		stroke-width: 4;
		stroke-linecap: round;
	}

	.route .head {
		fill: var(--accent);
	}

	.route.flight .line {
		stroke-dasharray: 3 11;
	}

	.route.journey .line {
		stroke-dasharray: 16 10;
		opacity: 0.8;
	}

	.route.river .line,
	.route.water .line {
		stroke: #4d8fbf;
		stroke-width: 3.5;
		opacity: 0.85;
	}

	.route.water .line {
		stroke-width: 12;
	}

	.route-label {
		font-family: var(--ui);
		font-size: 21px;
		font-style: italic;
		fill: var(--fg-dim);
		paint-order: stroke;
		stroke: var(--bg, #000);
		stroke-width: 5px;
	}

	.pin path,
	.pin circle {
		fill: var(--fg-strong);
	}

	.pin.capital path {
		fill: var(--accent);
	}

	.pin .swords {
		fill: none;
		stroke: var(--fg-strong);
		stroke-width: 0.32;
		stroke-linecap: round;
	}

	.pin text {
		font-family: var(--ui);
		font-size: 26px;
		font-weight: 600;
		fill: var(--fg-strong);
		paint-order: stroke;
		stroke: var(--bg, #000);
		stroke-width: 6px;
		stroke-linejoin: round;
	}

	.pin .ko {
		font-weight: 400;
		fill: var(--fg-faint);
	}

	figcaption {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--fg-dim);
	}

	figcaption b {
		color: var(--fg-strong);
		font-weight: 600;
	}

	.years {
		color: var(--fg-faint);
	}

	.caption {
		display: block;
		margin-top: 0.15rem;
	}
</style>
