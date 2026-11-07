<script lang="ts">
	/**
	 * The Stage's selection markers on the 3D map: every built site lit, the open one
	 * ringed, a card (board, banner, both names) on hover or focus. Framing the whole
	 * world, the peninsula's sites fold into one marker that flies back to Samhan.
	 */
	import { SKY_HEIGHT, type CosmosScope } from '$lib/cosmos';
	import { storyImg } from '$lib/img';
	import { toMapWorld } from '$lib/mapTerrain';
	import type { StageAnchor } from '$lib/stage/placeStage';
	import { siteFlag, siteThumb, type StageSite, type StageSiteId } from '$lib/stage/sites';
	import type { Vec3 } from '../../kit.svelte';
	import KitLabel from '../../KitLabel.svelte';

	let {
		anchors,
		active,
		year,
		ko = false,
		scope,
		lift,
		lifted,
		onselect,
		onscope
	}: {
		anchors: StageAnchor[];
		active: StageSiteId;
		year: number;
		ko?: boolean;
		scope: CosmosScope;
		/** World height of the relief's sea. */
		lift: number;
		/** A sheet point on the relief, `up` above the ground. */
		lifted: (x: number, y: number, up: number) => Vec3;
		onselect: (s: StageSite) => void;
		onscope?: (s: CosmosScope) => void;
	} = $props();

	/** Where a name sits off its dot when the default (right) would collide or leave the sheet. */
	const SIDE: Partial<Record<StageSiteId, 'left' | 'below' | 'above' | 'wrap'>> = {
		nakrang: 'below',
		chek: 'left',
		ansi: 'left',
		threerealms: 'above',
		underworld: 'wrap'
	};

	const flatAt = (x: number, y: number, up: number): Vec3 => {
		const [wx, wz] = toMapWorld(x, y);
		return [wx, lift + up, wz];
	};

	const markers = $derived(
		anchors
			.filter((a) => !(scope === 'cosmos' && a.where === 'sheet'))
			.map((a) => {
				const flag = siteFlag(a.site, a.site.timeless ? undefined : year);
				return {
					a,
					flag,
					thumb: siteThumb(a.site),
					compact: scope === 'sphere' ? a.where === 'sheet' : scope === 'cosmos' && a.where !== 'myth',
					side: SIDE[a.site.id],
					at:
						a.where === 'sheet' ? lifted(a.x, a.y, 0.03) : a.where === 'sky' ? lifted(a.x, a.y, SKY_HEIGHT[scope]) : flatAt(a.x, a.y, 0.03)
				};
			})
	);

	const home = $derived(anchors.filter((a) => a.where === 'sheet'));
	const homeAt = $derived.by<Vec3>(() => {
		const n = home.length || 1;
		const x = home.reduce((s, a) => s + a.x, 0) / n;
		const y = home.reduce((s, a) => s + a.y, 0) / n;
		return lifted(x, y, 0.05);
	});
	const homeActive = $derived(home.some((a) => a.site.id === active));
</script>

{#each markers as m (m.a.site.id)}
	{@const s = m.a.site}
	<KitLabel at={m.at} tone="note" size="md" moveDelay={0} onclick={() => onselect(s)}>
		<span
			class={['site', m.a.where, m.side, { on: s.id === active, compact: m.compact }]}
			style:--c={m.flag.color}
			aria-current={s.id === active ? 'true' : undefined}
		>
			<i class="dot" aria-hidden="true"></i>
			<span class={['name', { quiet: m.compact }]}>{ko ? s.ko : s.en}</span>
			<span class="card" aria-hidden="true">
				{#if m.thumb}
					<img class="shot" {...storyImg(m.thumb, { kind: 'place', widths: [256], sizes: '9rem' })} />
				{/if}
				<span class="who">
					{#if m.flag.src}
						<img class="flag" src={m.flag.src} alt="" loading="lazy" decoding="async" />
					{:else}
						<span class="flag swatch"></span>
					{/if}
					<span class="names">
						<b>{s.ko}</b>
						<small>{s.en}</small>
					</span>
				</span>
			</span>
		</span>
	</KitLabel>
{/each}

{#if scope === 'cosmos' && home.length}
	<KitLabel at={homeAt} tone="note" size="md" moveDelay={0} onclick={() => onscope?.('samhan')}>
		<span class={['site', 'home', { on: homeActive }]}>
			<i class="dot" aria-hidden="true"></i>
			<span class="name hover">{ko ? `삼한 · ${home.length}곳` : `Samhan · ${home.length} sites`}</span>
		</span>
	</KitLabel>
{/if}

<style>
	.site {
		--c: var(--gold);
		position: relative;
		display: block;
		width: 0.8em;
		height: 0.8em;
		font-style: normal;
	}

	.dot {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: var(--c);
		box-shadow:
			0 0 0 2px rgb(10 10 14 / 0.85),
			0 0 0 3.5px var(--gold),
			0 0 10px 2px color-mix(in srgb, var(--gold) 55%, transparent);
		transition:
			scale 0.2s ease,
			box-shadow 0.2s ease;
	}

	.site.on .dot {
		scale: 1.35;
		box-shadow:
			0 0 0 2px rgb(10 10 14 / 0.9),
			0 0 0 4px #fff,
			0 0 16px 5px color-mix(in srgb, var(--gold) 80%, transparent);
	}

	.site.on .dot::after {
		content: '';
		position: absolute;
		inset: -0.55em;
		border: 1.5px solid var(--gold);
		border-radius: 50%;
		animation: ring 2.2s ease-out infinite;
	}

	@keyframes ring {
		from {
			opacity: 0.9;
			scale: 0.6;
		}
		to {
			opacity: 0;
			scale: 1.6;
		}
	}

	.name {
		position: absolute;
		top: 50%;
		left: calc(100% + 0.45em);
		translate: 0 -50%;
		font-family: var(--sans, inherit);
		font-size: 0.95em;
		font-weight: 650;
		letter-spacing: 0.01em;
		white-space: nowrap;
		color: #fff8e6;
		text-shadow:
			0 0 4px rgb(0 0 0 / 0.95),
			0 1px 2px rgb(0 0 0 / 0.9);
	}

	.site.left .name {
		left: auto;
		right: calc(100% + 0.45em);
	}

	/* West of Rome there is only the map's edge: a long name folds onto two lines instead. */
	.site.wrap .name {
		width: 5.5em;
		white-space: normal;
		line-height: 1.1;
	}

	.site.below .name,
	.site.above .name {
		top: calc(100% + 0.35em);
		left: 50%;
		translate: -50% 0;
	}

	.site.above .name {
		top: auto;
		bottom: calc(100% + 0.35em);
	}

	/* The world frame's way home names itself on hover, so it does not sit on the courts' names. */
	.name.hover {
		opacity: 0;
		transition: opacity 0.15s;
	}

	:global(.kl:hover) > .site .name.hover,
	:global(.kl:focus-visible) > .site .name.hover {
		opacity: 1;
	}

	.site.on .name {
		color: var(--gold);
	}

	/* Crowded frames quiet the far-off dots (the peninsula on the courts', the courts on the world's): names come with the card. */
	.name.quiet {
		display: none;
	}

	.site.myth .dot,
	.site.sky .dot {
		background: radial-gradient(circle, #fff 0 25%, var(--c) 60%);
	}

	.site.home .dot {
		background: var(--gold);
	}

	.card {
		position: absolute;
		bottom: calc(100% + 0.8em);
		left: 50%;
		translate: -50% 0.3em;
		display: none;
		flex-direction: column;
		width: 9.5em;
		padding: 0.3em;
		border-radius: 6px;
		background: rgb(16 16 20 / 0.94);
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--c) 60%, transparent),
			0 10px 28px rgb(0 0 0 / 0.55);
		font-style: normal;
		pointer-events: none;
	}

	:global(.kl:hover) > .site .card,
	:global(.kl:focus-visible) > .site .card {
		display: flex;
		translate: -50% 0;
	}

	/* The marker is the dot: no pill behind it, even on hover. */
	:global(.kl.btn:has(> .site)) {
		background: none !important;
		border-color: transparent !important;
		backdrop-filter: none !important;
	}

	/* The hovered marker rises over its neighbours, so its card is never under another pin. */
	:global(.pin:has(.kl:hover)),
	:global(.pin:has(.kl:focus-visible)) {
		z-index: 1000 !important;
	}

	.shot {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		border-radius: 4px;
		background: #1c1c22;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.35em 0.2em 0.1em;
	}

	.flag {
		flex: none;
		width: 1.6em;
		height: 1.07em;
		border-radius: 2px;
		object-fit: cover;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.6);
	}

	.swatch {
		background: var(--c);
	}

	.names {
		display: flex;
		flex-direction: column;
		min-width: 0;
		text-align: left;
		line-height: 1.15;
	}

	.names b {
		font-family: 'Noto Serif KR', var(--serif);
		font-size: 1em;
		color: #fff8e6;
	}

	.names small {
		font-family: var(--sans, inherit);
		font-size: 0.72em;
		color: rgb(255 248 230 / 0.65);
		letter-spacing: 0.04em;
	}

	@media (prefers-reduced-motion: reduce) {
		.site.on .dot::after {
			animation: none;
		}
	}
</style>
