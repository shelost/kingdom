<script lang="ts">
	import { BORDER_SITES, POLITIES, holderAt, realmsAt } from '$lib/borders';
	import { MAP_SHEET_BOX, MAP_VIEW, MAP_VIEWBOX } from '$lib/places';

	let { year }: { year: number } = $props();

	let holdings = $derived(BORDER_SITES.map((s) => holderAt(s, year)));
	let realms = $derived(realmsAt(year, holdings));

	const pct = (x: number, y: number) => ({
		left: ((x - MAP_VIEW.x) / MAP_VIEW.w) * 100,
		top: ((y - MAP_VIEW.y) / MAP_VIEW.h) * 100
	});
</script>

<!-- The layer covers the whole sheet, exactly like the map image, so the land mask lines up. -->
<svg
	class="terr"
	viewBox="0 0 {MAP_VIEWBOX.w} {MAP_VIEWBOX.h}"
	preserveAspectRatio="none"
	style:left="{MAP_SHEET_BOX.left}%"
	style:top="{MAP_SHEET_BOX.top}%"
	style:width="{MAP_SHEET_BOX.width}%"
	style:height="{MAP_SHEET_BOX.height}%"
	aria-hidden="true"
>
	<defs>
		<filter id="border-soft" x="-5%" y="-5%" width="110%" height="110%">
			<feGaussianBlur stdDeviation="4.5" />
		</filter>
	</defs>
	<g class="cells" filter="url(#border-soft)">
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
</svg>

<div class="realms" aria-hidden="true">
	{#each realms as realm (realm.key)}
		{@const at = pct(realm.x, realm.y)}
		<span
			class="realm"
			class:small={realm.minor}
			style:left="{at.left}%"
			style:top="{at.top}%"
			style:--c={POLITIES[realm.polity].color}
		>
			{realm.label}
		</span>
	{/each}
</div>

<style>
	.terr {
		position: absolute;
		display: block;
		pointer-events: none;
		mask-image: url('/map-land.svg');
		mask-mode: luminance;
		mask-size: 100% 100%;
		mask-repeat: no-repeat;
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
		font-size: 0.95rem;
		font-weight: 700;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		white-space: nowrap;
		color: color-mix(in srgb, var(--c) 60%, #fff);
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
		opacity: 0.5;
		transition:
			left 600ms var(--ease),
			top 600ms var(--ease);
	}

	.realm.small {
		font-size: 0.55rem;
		letter-spacing: 0.16em;
		opacity: 0.6;
	}

	:global(html[data-theme='light']) .realm {
		color: color-mix(in srgb, var(--c) 75%, #1a140a);
		text-shadow: 0 1px 3px rgba(255, 253, 248, 0.95);
		opacity: 0.7;
	}

	@media (prefers-reduced-motion: reduce) {
		.cells path,
		.realm {
			transition: none;
		}
	}
</style>
