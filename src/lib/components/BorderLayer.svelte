<script lang="ts">
	import { BORDER_SITES, borderLinesAt, holdingsAt, realmsAt, siteColor } from '$lib/borders';
	import { polityBanner } from '$lib/banners';
	import { MAP_OUTER, MAP_OUTER_BOX, MAP_SHEET_BOX, MAP_VIEW, MAP_VIEWBOX } from '$lib/places';
	import { reading } from '$lib/reading.svelte';
	import { worldAt } from '$lib/worldLayer.svelte';
	import riversNe from '$lib/data/rivers-ne.json';

	let { year, detail = true }: { year: number; /** Statelet shades and internal seams. Off: one colour per kingdom. */ detail?: boolean } = $props();
	const uid = $props.id();
	const filterId = `border-soft-${uid}`;
	const landId = `border-land-${uid}`;
	const worldMaskId = `border-world-${uid}`;
	const worldLandId = `border-world-land-${uid}`;

	let ko = $derived(reading.lang === 'ko');

	/* Paint only when a site changes hands. The scrubber still moves every frame. */
	let holdings = $derived(holdingsAt(year));
	let realms = $derived(realmsAt(year, holdings, detail));
	let lines = $derived(borderLinesAt(year, detail));
	let world = $derived(worldAt(year));

	/** Every site's land, all at once: the world layer stays off the ground the book dates itself. */
	const SITE_LAND = BORDER_SITES.map((s) => s.d).join('');
	const OUTER_RIVERS = (riversNe.outer as [number, number][][]).map((l) => l.map(([x, y]) => `${x},${y}`).join(' '));

	/** World labels: the big polities only, never on top of the peninsula's own. */
	let worldLabels = $derived(
		world.filter(
			(w, i, all) =>
				w.label &&
				w.area > 150000 &&
				all.findIndex((o) => o.en === w.en) === i &&
				!realms.some((r) => r.label === w.en || r.korean === w.ko)
		)
	);

	const pct = (x: number, y: number) => ({
		left: ((x - MAP_VIEW.x) / MAP_VIEW.w) * 100,
		top: ((y - MAP_VIEW.y) / MAP_VIEW.h) * 100
	});
</script>

<!--
	Beyond the sheet: Cliopatria's polities (via the marble repo) on Natural Earth land,
	masked off the sites' own ground so the hand-dated borders always win.
-->
<div
	class="world"
	style:left="{MAP_OUTER_BOX.left}%"
	style:top="{MAP_OUTER_BOX.top}%"
	style:width="{MAP_OUTER_BOX.width}%"
	style:height="{MAP_OUTER_BOX.height}%"
>
	<svg
		class="terr"
		viewBox="{MAP_OUTER.x} {MAP_OUTER.y} {MAP_OUTER.w} {MAP_OUTER.h}"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<defs>
			<mask id={worldLandId} maskUnits="userSpaceOnUse" x={MAP_OUTER.x} y={MAP_OUTER.y} width={MAP_OUTER.w} height={MAP_OUTER.h}>
				<image href="/map-outer-land.svg" x={MAP_OUTER.x} y={MAP_OUTER.y} width={MAP_OUTER.w} height={MAP_OUTER.h} preserveAspectRatio="none" />
			</mask>
			<filter id="{worldMaskId}-soft" x="-5%" y="-5%" width="110%" height="110%">
				<feGaussianBlur stdDeviation="1.5" />
			</filter>
			<mask id={worldMaskId} maskUnits="userSpaceOnUse" x={MAP_OUTER.x} y={MAP_OUTER.y} width={MAP_OUTER.w} height={MAP_OUTER.h}>
				<image href="/map-outer-land.svg" x={MAP_OUTER.x} y={MAP_OUTER.y} width={MAP_OUTER.w} height={MAP_OUTER.h} preserveAspectRatio="none" />
				<!-- blurred like the sites' own wash, so the two hand over without a seam -->
				<path d={SITE_LAND} fill="#000" filter="url(#{worldMaskId}-soft)" />
			</mask>
		</defs>
		<g mask="url(#{worldMaskId})">
			{#each world as w (w.key)}
				<path class="world-realm" d={w.d} style:--c={w.color} />
			{/each}
		</g>
		<g class="outer-rivers" mask="url(#{worldLandId})">
			{#each OUTER_RIVERS as pts, i (i)}
				<polyline points={pts} />
			{/each}
		</g>
	</svg>
</div>

<!--
	The wash sits on an HTML box the same size as the sheet image, and the land
	clip is an SVG mask in the same viewBox, so it lands on the coastline exactly.
	A CSS mask-image here is dropped by Safari under the home map's 3D tilt.
-->
<div
	class="wash"
	style:left="{MAP_SHEET_BOX.left}%"
	style:top="{MAP_SHEET_BOX.top}%"
	style:width="{MAP_SHEET_BOX.width}%"
	style:height="{MAP_SHEET_BOX.height}%"
>
	<svg class="terr" viewBox="0 0 {MAP_VIEWBOX.w} {MAP_VIEWBOX.h}" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
				<feGaussianBlur stdDeviation="1.5" />
			</filter>
			<!-- Luminance: the land file paints land white on transparent sea. -->
			<mask id={landId} maskUnits="userSpaceOnUse" x="0" y="0" width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h}>
				<image href="/map-land.svg?v=alpha" width={MAP_VIEWBOX.w} height={MAP_VIEWBOX.h} preserveAspectRatio="none" />
			</mask>
		</defs>
		<g mask="url(#{landId})">
			<g class="cells" filter="url(#{filterId})">
				{#each BORDER_SITES as site, i (site.id)}
					{@const hold = holdings[i]}
					{#if site.d}
						<path
							d={site.d}
							class:empty={!hold.polity}
							style:--c={siteColor(site, hold, year, detail)}
						/>
					{/if}
				{/each}
			</g>
			<!-- Gaya was a league, not a kingdom: each statelet keeps a sharp shade the blur would melt. -->
			{#if detail}
				<g class="leagues">
					{#each BORDER_SITES as site, i (site.id)}
						{@const hold = holdings[i]}
						{#if site.d && site.league && hold.polity === 'gaya'}
							<path d={site.d} style:--c={siteColor(site, hold, year, true)} />
						{/if}
					{/each}
				</g>
			{/if}
			<path class="seams" d={lines.seams} />
			{#each lines.borders as b (b.color)}
				<path class="borders" d={b.d} style:--c={b.color} />
			{/each}
		</g>
	</svg>
</div>

<div class="realms" aria-hidden="true">
	{#each worldLabels as w (w.en)}
		{@const at = pct(w.label![0], w.label![1])}
		<span class="realm world-name" style:left="{at.left}%" style:top="{at.top}%" style:--c={w.color}>
			<span class="name">{ko ? w.ko : w.en}</span>
		</span>
	{/each}
	{#each realms as realm (realm.key)}
		{@const at = pct(realm.x, realm.y)}
		{@const flag = realm.minor ? null : polityBanner(realm.polity, year).src}
		<span
			class="realm"
			class:small={realm.minor}
			style:left="{at.left}%"
			style:top="{at.top}%"
			style:--c={realm.color}
		>
			{#if flag}<img class="flag" src={flag} alt="" decoding="async" />{/if}
			<span class="name">{ko ? realm.korean || realm.label : realm.label}</span>
		</span>
	{/each}
</div>

<style>
	.wash,
	.world {
		position: absolute;
		pointer-events: none;
	}

	.terr {
		display: block;
		width: 100%;
		height: 100%;
	}

	.realms {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	/* The peninsula's own states: a touch brighter than they used to sit. */
	.cells {
		opacity: 0.54;
	}

	/* Paper washes colour out: push saturation and weight so the kingdoms hold their own. */
	:global(html[data-theme='light']) .terr {
		filter: saturate(1.45);
	}

	:global(html[data-theme='light']) .cells {
		opacity: 0.5;
	}

	.cells path {
		fill: var(--c);
		stroke: var(--c);
		stroke-width: 1.5;
		transition:
			fill 600ms var(--ease),
			stroke 600ms var(--ease),
			fill-opacity 600ms var(--ease),
			stroke-opacity 600ms var(--ease);
	}


	.leagues path {
		fill: var(--c);
		fill-opacity: 0.16;
	}

	/* The world beyond sits back: darker, quieter, hairline borders in its own tint. */
	/* Same weight as the sites' own wash (.cells), so a state reads as one colour across the seam. */
	.world-realm {
		fill: var(--c);
		fill-opacity: 0.54;
		stroke: color-mix(in srgb, var(--c) 55%, #fff);
		stroke-opacity: 0.35;
		stroke-width: 0.8;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
	}

	.outer-rivers polyline {
		fill: none;
		stroke: #6aa8d8;
		stroke-opacity: 0.55;
		stroke-width: 1;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.borders,
	.seams {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	/* Each realm outlines itself in a pale version of its own colour. */
	.borders {
		stroke: color-mix(in srgb, var(--c) 48%, rgb(255 253 248));
		stroke-opacity: 0.62;
		stroke-width: 1.15;
	}

	.seams {
		stroke: rgb(255 253 248 / 0.34);
		stroke-width: 0.6;
	}

	:global(html[data-theme='light']) .borders {
		stroke: color-mix(in srgb, var(--c) 62%, rgb(40 30 15));
		stroke-opacity: 0.6;
	}

	:global(html[data-theme='light']) .seams {
		stroke: rgb(40 30 15 / 0.3);
	}

	:global(html[data-theme='light']) .world-realm {
		fill-opacity: 0.5;
		stroke: color-mix(in srgb, var(--c) 60%, rgb(40 30 15));
	}

	.cells path.empty {
		fill-opacity: 0;
		stroke-opacity: 0;
	}

	.realm {
		position: absolute;
		translate: -50% -50%;
		display: flex;
		align-items: center;
		gap: 0.4em;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.035em;
		text-transform: uppercase;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 60%, #fff);
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
		transition:
			left 600ms var(--ease),
			top 600ms var(--ease);
	}

	.realm .name {
		opacity: 0.5;
	}

	.realm .flag {
		height: 0.8em;
		aspect-ratio: 3 / 2;
		border-radius: 1px;
		box-shadow:
			0 0 0 0.5px rgb(0 0 0 / 0.4),
			0 1px 4px rgb(0 0 0 / 0.55);
		opacity: 0.9;
	}

	.realm.small {
		font-size: 0.55rem;
		letter-spacing: 0.02em;
	}

	.realm.small .name {
		opacity: 0.6;
	}

	.realm.world-name {
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.03em;
	}

	.realm.world-name .name {
		opacity: 0.42;
	}

	:global(html[data-theme='light']) .realm {
		color: color-mix(in srgb, var(--c) 75%, #1a140a);
		text-shadow: 0 1px 3px rgba(255, 253, 248, 0.95);
	}

	:global(html[data-theme='light']) .realm .name {
		opacity: 0.7;
	}

	@media (prefers-reduced-motion: reduce) {
		.cells path,
		.realm {
			transition: none;
		}
	}
</style>
