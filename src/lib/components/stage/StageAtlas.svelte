<script lang="ts">
	/**
	 * The Stage's site picker: the map page's 3D relief with only the built sites lit,
	 * the open one ringed. Scroll out (or pick a frame) from Samhan to the two courts to
	 * the known world, where Persia and Rome give way to the Western Flower Fields and
	 * the Underworld. Docked beside the stage, or opened large over it.
	 * Without WebGL it is the old card grid.
	 */
	import KitStage from '$lib/components/diagrams/three/KitStage.svelte';
	import { MAP_SCENE } from '$lib/components/diagrams/three/scenes';
	import { formatYear } from '$lib/borders';
	import LandLegend from '$lib/components/LandLegend.svelte';
	import { COSMOS_SCOPES, viewBox, type CosmosScope } from '$lib/cosmos';
	import { storyImg } from '$lib/img';
	import { STAGE_ANCHORS } from '$lib/stage/placeStage';
	import { STAGE_SITES, siteFlag, siteThumb, type StageSite, type StageSiteId } from '$lib/stage/sites';

	let {
		site,
		year,
		ko = false,
		onpick
	}: {
		site: StageSiteId;
		/** The year the map shows (the stage's, or the last real one under a myth realm). */
		year: number;
		ko?: boolean;
		onpick: (s: StageSite) => void;
	} = $props();

	const ORDER: CosmosScope[] = ['samhan', 'sphere', 'world', 'cosmos'];
	const FRAME_OF = { sheet: 'samhan', sky: 'samhan', abroad: 'sphere', myth: 'cosmos' } as const;
	/** The open site's own frame (a link or the URL lands there); the reader's chips and scroll override it. */
	let scope = $state<CosmosScope>('samhan');
	const layout = 'circles' as const;
	$effect(() => {
		const where = STAGE_ANCHORS.find((a) => a.site.id === site)?.where ?? 'sheet';
		scope = FRAME_OF[where];
	});
	let expanded = $state(false);
	let boxW = $state(0);
	let boxH = $state(0);
	let atlasH = $state(0);
	/** The docked height, held while the map is open large so the column keeps its place. */
	let lastDockH = 0;
	let dockH = $derived.by(() => (expanded ? lastDockH : (lastDockH = atlasH)));

	function zoomOut() {
		const i = ORDER.indexOf(scope);
		if (i < ORDER.length - 1) scope = ORDER[i + 1];
	}

	function pick(s: StageSite) {
		onpick(s);
		expanded = false;
	}

	/** Docked, the box takes each frame's shape: the peninsula is square, the known world wide. */
	const DOCK_ASPECT: Record<CosmosScope, number> = { samhan: 1, sphere: 1.15, world: 1.2, cosmos: 1 };
	const aspect = $derived(
		expanded && boxW && boxH ? boxW / boxH : scope === 'cosmos' ? viewBox(layout).w / viewBox(layout).h : DOCK_ASPECT[scope]
	);
	const sceneProps = $derived({
		year,
		ko,
		detail: false,
		kinds: ['city', 'harbor'],
		scope,
		layout,
		select: { anchors: STAGE_ANCHORS, active: site, onselect: pick },
		onscope: (s: CosmosScope) => (scope = s)
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (expanded = false)} />

{#if expanded}
	<button type="button" class="scrim" aria-label={ko ? '지도 닫기' : 'Close the map'} onclick={() => (expanded = false)}></button>
{/if}

<div class="slot" style:height={expanded && dockH ? `${dockH}px` : undefined}>
	<section class={['atlas', { full: expanded }]} aria-label={ko ? '3D 무대 고르기' : 'Choose a 3D site'} bind:clientHeight={atlasH}>
		<header class="bar">
			<div class="scopes" role="group" aria-label={ko ? '보는 범위' : 'Frame'}>
				{#each COSMOS_SCOPES as s (s.id)}
					<button type="button" class={{ on: scope === s.id }} aria-pressed={scope === s.id} title={ko ? s.ko : s.en} onclick={() => (scope = s.id)}>
						<span class="material-symbols-outlined" aria-hidden="true">{s.icon}</span>
						<span class="scope-text">{ko ? s.ko : s.en}</span>
					</button>
				{/each}
			</div>
			<span class="year">{formatYear(year, ko)}</span>
			<button
				type="button"
				class="grow"
				aria-label={expanded ? (ko ? '작게' : 'Dock the map') : ko ? '크게 보기' : 'Open the map large'}
				title={expanded ? (ko ? '작게' : 'Dock the map') : ko ? '크게 보기' : 'Open the map large'}
				onclick={() => (expanded = !expanded)}
			>
				<span class="material-symbols-outlined" aria-hidden="true">{expanded ? 'close_fullscreen' : 'open_in_full'}</span>
			</button>
		</header>

		<div class="box" bind:clientWidth={boxW} bind:clientHeight={boxH}>
			<KitStage scene={MAP_SCENE} active orbit keepFallback={false} {aspect} reframe={scope} onzoomout={zoomOut} {sceneProps}>
				{#snippet fallback()}
					<nav class="picks" aria-label={ko ? '무대' : 'Sites'}>
						{#each STAGE_SITES as s (s.id)}
							{@const flag = siteFlag(s, s.id === site ? year : undefined)}
							{@const thumb = siteThumb(s)}
							<button type="button" class={{ on: site === s.id }} onclick={() => pick(s)}>
								<span class="thumb">
									{#if thumb}
										<img class="shot" {...storyImg(thumb, { kind: 'place', widths: [128, 256], sizes: '3.6rem' })} />
									{/if}
									{#if s.timeless}
										<span class="flag myth" style:--c={flag.color} role="img" aria-label={flag.name} title={flag.name}>
											<span class="material-symbols-outlined" aria-hidden="true">auto_awesome</span>
										</span>
									{:else if flag.src}
										<img class="flag" src={flag.src} alt={flag.name} title={flag.name} loading="lazy" decoding="async" />
									{:else}
										<span class="flag swatch" style:--c={flag.color} role="img" aria-label={flag.name} title={flag.name}></span>
									{/if}
								</span>
								<span class="name">
									<span class="ko">{s.ko}</span>
									<span class="en">{s.en}</span>
								</span>
							</button>
						{/each}
					</nav>
				{/snippet}
			</KitStage>
			{#if scope === 'cosmos'}
				<div class="land-legend"><LandLegend {ko} /></div>
			{/if}
		</div>

		<p class="hint">
			{#if scope === 'samhan'}
				{ko ? '점에 올리면 미리보기, 누르면 무대가 열립니다. 바깥으로 스크롤하면 화와 왜, 그리고 천하.' : 'Hover a light to preview, click to open it. Scroll out for the Sphere, then the World, then the Cosmos.'}
			{:else}
				{ko ? '이승과 저승은 서천꽃밭에서 맞닿은 두 원입니다.' : 'This world and that world are two circles joined at the flower fields.'}
				{#if scope === 'cosmos'}
					{ko ? '삼한의 불빛을 누르면 돌아갑니다.' : "Click Samhan's light to fly home."}
				{/if}
				<span class="credit">{ko ? '국경: Cliopatria (CC BY 4.0) · 해안: Natural Earth' : 'Borders: Cliopatria (CC BY 4.0) · coast: Natural Earth'}</span>
			{/if}
		</p>
	</section>
</div>

<style lang="scss">
	.slot {
		position: relative;
	}

	.atlas {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		border-radius: var(--radius);
		&.full {
			position: fixed;
			z-index: 61;
			inset: 4.1rem max(1rem, 3vw) calc(1rem + var(--tabbar-space, 0px));
			padding: 0.6rem;
			background: color-mix(in srgb, var(--bg) 92%, #000);
			border: 1px solid var(--hairline);
			box-shadow: 0 30px 80px rgb(0 0 0 / 0.55);
		}
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 60;
		border: 0;
		background: rgb(0 0 0 / 0.5);
		backdrop-filter: blur(3px);
		cursor: zoom-out;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.scopes {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding: 2px;
		border-radius: 999px;
		border: 1px solid var(--hairline);
	}

	.scopes button,
	.grow {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		min-height: 1.75rem;
		padding: 0 0.6rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--fg-faint);
		font: inherit;
		font-size: 0.74rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.18s, color 0.18s;
	}

	.scopes button:hover,
	.grow:hover {
		color: var(--fg-strong, var(--fg));
	}

	.scopes button.on {
		color: var(--fg-strong, var(--fg));
		background: color-mix(in srgb, var(--gold) 16%, transparent);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--gold) 55%, transparent);
	}

	.material-symbols-outlined {
		font-size: 1rem;
	}

	.year {
		margin-left: auto;
		font-family: var(--serif);
		font-size: 0.78rem;
		color: var(--fg-faint);
		white-space: nowrap;
	}

	.grow {
		padding: 0;
		width: 1.9rem;
		justify-content: center;
		border: 1px solid var(--hairline);
	}

	.box {
		position: relative;
		min-height: 0;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--hairline);
		background: radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--bg) 80%, #1a2233) 0%, var(--bg) 75%);
		.atlas.full & {
			flex: 1;
		}
	}

	.land-legend {
		position: absolute;
		z-index: 4;
		left: 0.45rem;
		bottom: 0.45rem;
	}

	.hint {
		margin: 0;
		font-size: 0.7rem;
		line-height: 1.35;
		color: var(--fg-faint);
	}

	.credit {
		display: block;
		margin-top: 0.15rem;
		font-size: 0.62rem;
		opacity: 0.8;
	}

	/* ———————————— the no-WebGL fallback: the card grid ———————————— */

	.picks {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem;
		padding: 0.35rem;
		& button {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			min-width: 0;
			text-align: left;
			padding: 0.3rem 0.5rem 0.3rem 0.3rem;
			border-radius: var(--radius);
			border: 1px solid var(--hairline);
			background: transparent;
			color: inherit;
			font: inherit;
			cursor: pointer;
			transition: border-color 0.18s, background 0.18s;
			&:hover {
				border-color: color-mix(in srgb, var(--fg) 22%, var(--hairline));
			}
			&.on {
				border-color: color-mix(in srgb, var(--gold) 65%, var(--hairline));
				background: color-mix(in srgb, var(--gold) 12%, transparent);
			}
		}
	}

	.thumb {
		position: relative;
		flex: none;
		width: 3.6rem;
		aspect-ratio: 3 / 2;
		border-radius: calc(var(--radius) * 0.75);
		background: var(--panel-sunken);
		& .shot {
			width: 100%;
			height: 100%;
			object-fit: cover;
			border-radius: inherit;
			filter: saturate(0.85) brightness(0.86);
			transition: filter 0.18s;
		}
	}

	.picks button:hover .shot,
	.picks button.on .shot {
		filter: none;
	}

	/* the kingdom's banner pinned to the board's corner; a myth realm gets a star instead */

	.thumb .flag {
		position: absolute;
		right: -0.3rem;
		bottom: -0.25rem;
		width: 1.2rem;
		height: 0.8rem;
		border-radius: 2px;
		object-fit: cover;
		background: var(--c, transparent);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.55), 0 1px 3px rgb(0 0 0 / 0.45);
	}

	.thumb .swatch {
		background: linear-gradient(135deg, color-mix(in srgb, var(--c) 80%, #fff) 0%, var(--c) 55%, color-mix(in srgb, var(--c) 70%, #000) 100%);
	}

	.thumb .myth {
		display: grid;
		place-items: center;
		width: 1.05rem;
		height: 1.05rem;
		border-radius: 50%;
		color: var(--c);
		background: rgb(14 14 18 / 0.82);
		& .material-symbols-outlined {
			font-size: 0.72rem;
			font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
		}
	}

	.name {
		min-width: 0;
	}

	.ko {
		display: block;
		font-family: var(--serif);
		font-size: 0.95rem;
	}

	.en {
		display: block;
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	@media (max-width: 860px) {
		.atlas.full {
			inset: 0.5rem 0.5rem calc(0.5rem + var(--tabbar-space, 0px) + env(safe-area-inset-bottom));
		}
		.bar {
			flex-wrap: wrap;
			gap: 0.35rem;
		}
		.scopes {
			flex: 1 1 auto;
		}
		.scopes button,
		.grow {
			min-height: 2.35rem;
			padding: 0 0.65rem;
			font-size: 0.8rem;
		}
		.grow {
			width: 2.35rem;
		}
		.year {
			margin-left: 0;
			font-size: 0.72rem;
		}
		.box {
			min-height: 12rem;
		}
		.scope-text {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}
		.scopes button {
			position: relative;
			padding: 0 0.55rem;
			min-width: 2.35rem;
			justify-content: center;
		}
		.scopes .material-symbols-outlined {
			font-size: 1.2rem;
		}
		.hint {
			font-size: 0.68rem;
		}
		.picks {
			grid-template-columns: 1fr;
			& button {
				min-height: 3.25rem;
				padding: 0.4rem 0.55rem 0.4rem 0.4rem;
			}
		}
	}
</style>
