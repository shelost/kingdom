<script lang="ts">
	/**
	 * The known world, flat: the same paint as the 3D disc (src/lib/cosmosLayer.ts).
	 * Scope chips only reframe; wheel zooms, and past the zoom floor/ceiling the
	 * frame steps out (Sphere → World → Cosmos) or back in.
	 */
	import { onMount } from 'svelte';
	import { COSMOS_FRAME, SAMHAN_GOLD_YEAR, SAMHAN_LINE, SCOPE_BOX, type CosmosLayout, type CosmosScope } from '$lib/cosmos';
	import { SAMHAN_BOX, biomeMotes, labelsAt, loadCosmos, paintCosmos, paintSamhanLine, paintSamhanStates, type CosmosData } from '$lib/cosmosLayer';
	import { mapPalette } from '$lib/mapTerrain';
	import CosmosName from '$lib/components/diagrams/three/scenes/map/CosmosName.svelte';

	const ORDER: Exclude<CosmosScope, 'samhan'>[] = ['sphere', 'world', 'cosmos'];

	let {
		year,
		ko = false,
		scope,
		layout = 'circles',
		rulers = false,
		labels = true,
		onscope
	}: {
		year: number;
		ko?: boolean;
		scope: Exclude<CosmosScope, 'samhan'>;
		layout?: CosmosLayout;
		/** Each realm's ruler this year, in a pill under its name. */
		rulers?: boolean;
		/** Show civilization and myth names. */
		labels?: boolean;
		/** Step the frame out or in when the wheel passes the zoom floor / ceiling. */
		onscope?: (s: Exclude<CosmosScope, 'samhan'>) => void;
	} = $props();

	let light = $state(false);
	let data = $state.raw<CosmosData | null>(null);
	let sheet = $state<HTMLCanvasElement>();
	let gold = $state<HTMLCanvasElement>();
	let host = $state<HTMLDivElement>();

	/** Pan / zoom inside the current frame. */
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let dragging = $state(false);
	let lastX = 0;
	let lastY = 0;

	onMount(() => {
		const root = document.documentElement;
		const read = () => (light = root.dataset.theme === 'light');
		read();
		const obs = new MutationObserver(read);
		obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => obs.disconnect();
	});

	$effect(() => {
		let gone = false;
		loadCosmos().then(
			(d) => {
				if (!gone) data = d;
			},
			() => {}
		);
		return () => {
			gone = true;
		};
	});

	$effect(() => {
		scope;
		layout;
		zoom = 1;
		panX = 0;
		panY = 0;
	});

	const box = $derived(SCOPE_BOX[scope]);
	const pal = $derived(mapPalette(light));
	const shown = $derived(labels ? labelsAt(data, year, scope, layout, true, rulers) : []);
	const canPan = $derived(true);
	const motes = biomeMotes();

	const place = (b: { x: number; y: number; w: number; h: number }) => ({
		left: `${((b.x - box.x) / box.w) * 100}%`,
		top: `${((b.y - box.y) / box.h) * 100}%`,
		width: `${(b.w / box.w) * 100}%`,
		height: `${(b.h / box.h) * 100}%`
	});

	const paintStyle = $derived(place(COSMOS_FRAME));
	const goldStyle = $derived(place(SAMHAN_BOX));

	$effect(() => {
		if (!sheet || !data) return;
		paintCosmos(sheet, data, year, pal, light, scope === 'cosmos' ? 2400 : 1800, layout);
	});

	$effect(() => {
		if (!gold || !data) return;
		/**
		 * Cosmos: paint kingdom colours on the high-res Samhan overlay (the gold
		 * halo would otherwise swallow a 20-px peninsula). Nearer scopes keep the line.
		 */
		if (scope === 'cosmos') {
			paintSamhanStates(gold, year);
			return;
		}
		paintSamhanLine(gold, data, SAMHAN_GOLD_YEAR, SAMHAN_LINE[scope], light);
	});

	const at = (xy: [number, number]) => ({
		left: `${((xy[0] - box.x) / box.w) * 100}%`,
		top: `${((xy[1] - box.y) / box.h) * 100}%`
	});

	function onWheel(e: WheelEvent) {
		if (!canPan || !host) return;
		e.preventDefault();
		const out = e.deltaY > 0;
		const i = ORDER.indexOf(scope);
		/* Past the floor: step the frame out. Past the ceiling: step back in. */
		if (out && zoom <= 0.86 && i < ORDER.length - 1 && onscope) {
			onscope(ORDER[i + 1]!);
			return;
		}
		if (!out && zoom >= 4.4 && i > 0 && onscope) {
			onscope(ORDER[i - 1]!);
			return;
		}
		const rect = host.getBoundingClientRect();
		const mx = e.clientX - rect.left;
		const my = e.clientY - rect.top;
		const before = zoom;
		const next = Math.min(4.5, Math.max(0.85, zoom * (out ? 1 / 1.12 : 1.12)));
		const k = next / before;
		panX = mx - (mx - panX) * k;
		panY = my - (my - panY) * k;
		zoom = next;
	}

	function onPointerDown(e: PointerEvent) {
		if (!canPan || e.button !== 0) return;
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		panX += e.clientX - lastX;
		panY += e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class={['sheet', { pan: canPan, dragging }]}
	style:aspect-ratio="{box.w} / {box.h}"
	bind:this={host}
	onwheel={onWheel}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	role="img"
	aria-label={ko ? '세계 지도' : 'World map'}
>
	<div class="stage" style:transform="translate({panX}px, {panY}px) scale({zoom})">
		<canvas bind:this={sheet} class="paint" style:left={paintStyle.left} style:top={paintStyle.top} style:width={paintStyle.width} style:height={paintStyle.height}></canvas>
		<canvas
			bind:this={gold}
			class={['gold', { states: scope === 'cosmos' }]}
			style:left={goldStyle.left}
			style:top={goldStyle.top}
			style:width={goldStyle.width}
			style:height={goldStyle.height}
		></canvas>
		<div class="motes" aria-hidden="true">
			{#each motes as m (m.key)}
				<span class={['mote', m.kind]} style:left={at(m.xy).left} style:top={at(m.xy).top} style:--delay="{m.delay}s" style:--dur="{m.dur}s"></span>
			{/each}
		</div>
		{#if labels}
			<div class="names">
				{#each shown as l (l.key)}
					<div class="at" style:left={at(l.xy).left} style:top={at(l.xy).top}>
						<CosmosName
							han={l.han}
							ko={l.ko}
							en={l.en}
							epithet={l.epithet}
							standing={l.standing}
							ruler={l.ruler}
							lines={l.lines}
							sea={l.sea}
							myth={l.myth}
							realm={l.realm}
							home={l.home}
							reach={l.protectorate}
							sub={l.sub}
							native={l.native}
							icon={l.icon}
							color={l.color}
							uiKo={ko}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.sheet {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: var(--radius);
		background: transparent;
		touch-action: none;
	}

	.sheet.pan {
		cursor: grab;
	}

	.sheet.dragging {
		cursor: grabbing;
	}

	.stage {
		position: absolute;
		inset: 0;
		transform-origin: 0 0;
		will-change: transform;
	}

	.paint,
	.gold {
		position: absolute;
		max-width: none;
		pointer-events: none;
	}

	.gold {
		mix-blend-mode: screen;
	}

	.gold.states {
		mix-blend-mode: normal;
		opacity: 0.88;
	}

	:global(html[data-theme='light']) .gold {
		mix-blend-mode: multiply;
	}

	:global(html[data-theme='light']) .gold.states {
		mix-blend-mode: normal;
		opacity: 0.9;
	}

	.motes {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.mote {
		position: absolute;
		border-radius: 50%;
		opacity: 0;
		animation: var(--dur) ease-in-out var(--delay) infinite;
	}

	.mote.snow {
		width: 3px;
		height: 3px;
		background: #fff;
		box-shadow: 0 0 3px rgb(255 255 255 / 0.8);
		animation-name: snowfall;
	}

	.mote.sand {
		width: 9px;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(90deg, transparent, #fbe7b4, transparent);
		animation-name: drift;
	}

	.mote.leaf {
		width: 3px;
		height: 3px;
		background: #e8ff9a;
		box-shadow: 0 0 5px 1px rgb(214 255 120 / 0.75);
		animation-name: firefly;
	}

	@keyframes snowfall {
		0% {
			opacity: 0;
			transform: translate(0, -6px);
		}
		25% {
			opacity: 0.85;
		}
		100% {
			opacity: 0;
			transform: translate(3px, 10px);
		}
	}

	@keyframes drift {
		0% {
			opacity: 0;
			transform: translateX(-8px);
		}
		40% {
			opacity: 0.7;
		}
		100% {
			opacity: 0;
			transform: translateX(12px);
		}
	}

	@keyframes firefly {
		0%,
		100% {
			opacity: 0;
			transform: translate(0, 0);
		}
		50% {
			opacity: 0.9;
			transform: translate(2px, -4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mote {
			animation: none;
			opacity: 0.5;
		}
	}

	.names {
		position: absolute;
		inset: 0;
		pointer-events: none;
		font-size: clamp(0.48rem, 0.85vw, 0.68rem);
	}

	.at {
		position: absolute;
		transform: translate(-50%, -50%);
	}
</style>
