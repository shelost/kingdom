<script lang="ts">
	import { BORDER_SITES, POLITIES, holdingsAt, realmsAt } from '$lib/borders';
	import { polityBanner } from '$lib/banners';
	import { MAP_SHEET_BOX, MAP_VIEW, MAP_VIEWBOX } from '$lib/places';

	let { year }: { year: number } = $props();
	const uid = $props.id();
	const filterId = `border-soft-${uid}`;
	const landId = `border-land-${uid}`;

	/* Paint only when a site changes hands. The scrubber still moves every frame. */
	let holdings = $derived(holdingsAt(year));
	let realms = $derived(realmsAt(year, holdings));

	const pct = (x: number, y: number) => ({
		left: ((x - MAP_VIEW.x) / MAP_VIEW.w) * 100,
		top: ((y - MAP_VIEW.y) / MAP_VIEW.h) * 100
	});
</script>

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
<svg
	class="terr"
	viewBox="0 0 {MAP_VIEWBOX.w} {MAP_VIEWBOX.h}"
	preserveAspectRatio="none"
	aria-hidden="true"
>
	<defs>
		<filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
			<feGaussianBlur stdDeviation="4.5" />
		</filter>
		<!-- Luminance: the land file paints land white on transparent sea. -->
		<mask
			id={landId}
			maskUnits="userSpaceOnUse"
			x="0"
			y="0"
			width={MAP_VIEWBOX.w}
			height={MAP_VIEWBOX.h}
		>
			<image
				href="/map-land.svg?v=alpha"
				width={MAP_VIEWBOX.w}
				height={MAP_VIEWBOX.h}
				preserveAspectRatio="none"
			/>
		</mask>
	</defs>
	<g mask="url(#{landId})">
		<g class="cells" filter="url(#{filterId})">
			{#each BORDER_SITES as site, i (site.id)}
				{@const hold = holdings[i]}
				{#if site.d}
					<path
						d={site.d}
						class:disputed={hold.disputed}
						class:empty={!hold.polity}
						style:--c={hold.polity ? POLITIES[hold.polity].color : 'transparent'}
					/>
				{/if}
			{/each}
		</g>
	</g>
</svg>
</div>

<div class="realms" aria-hidden="true">
	{#each realms as realm (realm.key)}
		{@const at = pct(realm.x, realm.y)}
		{@const flag = realm.minor ? null : polityBanner(realm.polity, year).src}
		<span
			class="realm"
			class:small={realm.minor}
			style:left="{at.left}%"
			style:top="{at.top}%"
			style:--c={POLITIES[realm.polity].color}
		>
			{#if flag}<img class="flag" src={flag} alt="" decoding="async" />{/if}
			<span class="name">{realm.label}</span>
		</span>
	{/each}
</div>

<style>
	.wash {
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

	.cells {
		opacity: 0.48;
	}

	/* Paper washes colour out: push saturation and weight so the kingdoms hold their own. */
	:global(html[data-theme='light']) .terr {
		filter: saturate(1.45);
	}

	:global(html[data-theme='light']) .cells {
		opacity: 0.46;
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

	.cells path.disputed {
		fill-opacity: 0.7;
		stroke-opacity: 0.7;
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
		gap: 0.45em;
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.32em;
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
		letter-spacing: 0.16em;
	}

	.realm.small .name {
		opacity: 0.6;
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
