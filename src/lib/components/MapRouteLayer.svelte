<script module lang="ts">
	import type { RouteKind } from '$lib/mapRoutes';

	export interface DrawnRoute {
		id: string;
		kind: RouteKind;
		color: string;
		/** the smooth curve, in layer pixels */
		d: string;
		/** a sine-wave copy of the curve (sea crossings) */
		wave?: string;
		/** arrowhead at the curve's end */
		head: string;
		/** seconds before it starts drawing in */
		delay: number;
	}

	export interface BattleMark {
		id: string;
		x: number;
		y: number;
		delay: number;
	}
</script>

<script lang="ts">
	import { ROUTE_KINDS, dashPeriod } from '$lib/mapRoutes';
	import { CROSSED_SWORDS } from '$lib/mapPaths';

	let {
		routes,
		battles,
		width,
		height,
		draw
	}: {
		routes: DrawnRoute[];
		battles: BattleMark[];
		width: number;
		height: number;
		/** seconds each route takes to draw in */
		draw: number;
	} = $props();

	const uid = $props.id();
</script>

<svg class="routes" viewBox="0 0 {width} {height}" style:--draw="{draw}s" aria-hidden="true">
	<defs>
		{#each routes as r (r.id)}
			<mask id="{uid}-{r.id}" maskUnits="userSpaceOnUse" x="0" y="0" {width} {height}>
				<path class="reveal" d={r.wave ?? r.d} pathLength="100" style:--delay="{r.delay}s" />
			</mask>
		{/each}
	</defs>

	{#each routes as r (r.id)}
		{@const k = ROUTE_KINDS[r.kind]}
		<g
			class="route {r.kind}"
			style:--c={r.color}
			style:--delay="{r.delay}s"
			style:--dash={k.dash}
			style:--w="{k.width}px"
			style:--period="{dashPeriod(r.kind)}px"
		>
			<g mask="url(#{uid}-{r.id})">
				<path class="casing" d={r.wave ?? r.d} />
				{#if r.wave}<path class="wake" d={r.d} />{/if}
				<path class="line" d={r.wave ?? r.d} />
			</g>
			<path class="head" d={r.head} />
		</g>
	{/each}

	{#each battles as b (b.id)}
		<g class="battle" transform="translate({b.x} {b.y})" style:--delay="{b.delay}s">
			<g class="mark">
				<circle class="pulse" r="9" />
				<circle class="disc" r="8.5" />
				<path class="swords" d={CROSSED_SWORDS} transform="scale(5)" />
			</g>
		</g>
	{/each}
</svg>

<style>
	.routes {
		position: absolute;
		z-index: 2;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.reveal {
		fill: none;
		stroke: #fff;
		stroke-width: 22;
		stroke-dasharray: 100 100;
		animation: reveal var(--draw) cubic-bezier(0.45, 0.05, 0.35, 1) var(--delay) both;
	}

	/* the dark page needs the hue lifted; paper takes it as drawn */
	.route {
		--stroke: color-mix(in srgb, var(--c) 74%, #fff);
	}

	:global(html[data-theme='light']) .route {
		--stroke: var(--c);
	}

	.casing,
	.line,
	.wake {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.casing {
		stroke: var(--bg);
		stroke-opacity: 0.5;
		stroke-width: calc(var(--w) + 3px);
	}

	.line {
		stroke: var(--stroke);
		stroke-width: var(--w);
		stroke-dasharray: var(--dash);
		animation: march 0.85s linear infinite;
	}

	.wake {
		stroke: var(--stroke);
		stroke-opacity: 0.3;
		stroke-width: 1;
	}

	.retreat .casing,
	.journey .casing {
		stroke-opacity: 0.32;
	}

	.retreat .line {
		opacity: 0.9;
		animation-duration: 1.3s;
	}

	.head {
		fill: var(--stroke);
		stroke: var(--bg);
		stroke-opacity: 0.6;
		stroke-width: 1.2;
		paint-order: stroke;
		animation: fade-in 260ms var(--ease) calc(var(--delay) + var(--draw) * 0.86) both;
	}

	.battle {
		animation: fade-in 320ms var(--ease) var(--delay) both;
	}

	.mark {
		transform-box: fill-box;
		transform-origin: center;
		animation: stamp 420ms cubic-bezier(0.3, 1.6, 0.5, 1) var(--delay) both;
	}

	.disc {
		fill: color-mix(in srgb, var(--bg) 82%, transparent);
		stroke: var(--gold);
		stroke-width: 1.2;
	}

	.pulse {
		fill: none;
		stroke: var(--gold);
		stroke-width: 1.4;
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2.2s ease-out calc(var(--delay) + 0.4s) infinite both;
	}

	.swords {
		fill: none;
		stroke: var(--fg-strong);
		stroke-width: 0.24;
		stroke-linecap: round;
	}

	@keyframes reveal {
		from {
			stroke-dashoffset: 100;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes march {
		to {
			stroke-dashoffset: calc(-1 * var(--period));
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes stamp {
		from {
			transform: scale(0.3);
		}
	}

	@keyframes pulse {
		from {
			transform: scale(1);
			opacity: 0.85;
		}
		to {
			transform: scale(2.4);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal,
		.line,
		.head,
		.battle,
		.mark {
			animation: none;
		}

		.reveal {
			stroke-dasharray: none;
		}

		.pulse {
			display: none;
		}
	}
</style>
