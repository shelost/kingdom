<script lang="ts">
	import {
		forceSimulation,
		forceLink,
		forceManyBody,
		forceCollide,
		forceX,
		forceY,
		type Simulation,
		type SimulationLinkDatum
	} from 'd3-force';
	import { drag } from 'd3-drag';
	import { select, type Selection } from 'd3-selection';
	import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
	import type { Attachment } from 'svelte/attachments';

	import {
		byId,
		colorOf,
		avatarOf,
		hangulInitial,
		KINGDOMS,
		type Person
	} from '$lib/people';
	import {
		CHART_NODES,
		RELATIONSHIPS,
		BOND_LABEL,
		RANK_SIZE,
		ERA_META,
		type ChartEra
	} from '$lib/relations';
	import { ERA_Y, KINGDOM_X } from '$lib/chart/force';
	import { openProfile, closeProfile, profiles } from '$lib/profiles.svelte';

	/** Portrait diameters — RANK_SIZE scaled up for readable faces. */
	const PORTRAIT: Record<1 | 2 | 3, number> = {
		1: 22,
		2: 28,
		3: 36
	};

	type GraphNode = {
		id: string;
		name: string;
		korean?: string;
		color: string;
		avatar: string | null;
		initial: string;
		r: number;
		era: ChartEra;
		kingdom: Person['kingdom'];
		x: number;
		y: number;
		vx?: number;
		vy?: number;
		fx?: number | null;
		fy?: number | null;
		index?: number;
	};

	type GraphLink = SimulationLinkDatum<GraphNode> & {
		id: string;
		color: string;
		label: string;
		thick: boolean;
	};

	let open = $state(false);
	/** Filter by kingdom id; null = show all. */
	let filter = $state<Person['kingdom'] | null>(null);
	/** Filter by era band; null = show all. */
	let eraFilter = $state<ChartEra | null>(null);

	/** Simulation nodes / links — mutated by d3-force; reassigned on rebuild. */
	let nodes = $state.raw<GraphNode[]>([]);
	let links = $state.raw<GraphLink[]>([]);
	/** Bumped each tick so the SVG re-reads x/y. */
	let tick = $state(0);
	/** Viewport pan/zoom applied to the inner `<g>`. */
	let view = $state({ x: 0, y: 0, k: 1 });

	let svgEl: SVGSVGElement | null = $state(null);
	let sim: Simulation<GraphNode, GraphLink> | null = null;
	let zoomer: ZoomBehavior<SVGSVGElement, unknown> | null = null;
	let svgSel: Selection<SVGSVGElement, unknown, null, undefined> | null = null;
	/** Suppress click after a real drag. */
	let didDrag = false;

	const kingdomOrder: Person['kingdom'][] = [
		'silla',
		'baekje',
		'goguryeo',
		'tang',
		'gaya',
		'tamla',
		'underworld',
		'yamato',
		'other'
	];

	const eraOrder: ChartEra[] = ['present', 'past', 'myth'];

	const usedKingdoms = $derived(
		kingdomOrder.filter((k) => CHART_NODES.some((n) => byId.get(n.id)?.kingdom === k))
	);

	const visibleEras = $derived.by(() => {
		const eras = eraOrder.filter((e) => nodes.some((n) => n.era === e));
		if (eraFilter) return eras.filter((e) => e === eraFilter);
		return eras;
	});

	function filteredChart(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		return CHART_NODES.filter(({ id, era: nodeEra }) => {
			const p = byId.get(id);
			if (!p) return false;
			if (kingdom && p.kingdom !== kingdom) return false;
			if (era && nodeEra !== era) return false;
			return true;
		});
	}

	function buildGraph(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		const chart = filteredChart(kingdom, era);
		const nextNodes: GraphNode[] = chart.flatMap(({ id, rank, era: nodeEra, x, y }) => {
			const p = byId.get(id);
			if (!p) return [];
			const diameter = PORTRAIT[rank] ?? RANK_SIZE[rank] * 2;
			return [
				{
					id,
					name: p.name,
					korean: p.korean,
					color: colorOf(p),
					avatar: avatarOf(p),
					initial: hangulInitial(p),
					r: diameter / 2,
					era: nodeEra,
					kingdom: p.kingdom,
					x,
					y
				}
			];
		});

		const ids = new Set(nextNodes.map((n) => n.id));
		const nextLinks: GraphLink[] = RELATIONSHIPS.flatMap((rel) => {
			if (!rel.between) return [];
			const [a, b] = rel.between;
			if (!ids.has(a) || !ids.has(b)) return [];
			const bond = rel.bond ?? 'love';
			return [
				{
					id: rel.id,
					source: a,
					target: b,
					color: colorOf(rel),
					label: BOND_LABEL[bond],
					thick: bond === 'love' || bond === 'affair'
				}
			];
		});

		return { nextNodes, nextLinks };
	}

	function linkEnd(end: GraphLink['source'] | GraphLink['target']): GraphNode | null {
		if (typeof end === 'object' && end) return end as GraphNode;
		return nodes.find((n) => n.id === end) ?? null;
	}

	function fitView(svg: SVGSVGElement, graphNodes: GraphNode[]) {
		if (!zoomer || !svgSel || graphNodes.length === 0) return;
		const w = svg.clientWidth || 1;
		const h = svg.clientHeight || 1;
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const n of graphNodes) {
			minX = Math.min(minX, n.x - n.r - 40);
			minY = Math.min(minY, n.y - n.r - 28);
			maxX = Math.max(maxX, n.x + n.r + 40);
			maxY = Math.max(maxY, n.y + n.r + 28);
		}
		const bw = Math.max(maxX - minX, 1);
		const bh = Math.max(maxY - minY, 1);
		const pad = 36;
		const k = Math.min(1.4, Math.max(0.2, Math.min((w - pad * 2) / bw, (h - pad * 2) / bh)));
		const tx = (w - k * (minX + maxX)) / 2;
		const ty = (h - k * (minY + maxY)) / 2;
		svgSel.call(zoomer.transform, zoomIdentity.translate(tx, ty).scale(k));
	}

	function startSimulation(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		sim?.stop();
		const { nextNodes, nextLinks } = buildGraph(kingdom, era);
		nodes = nextNodes;
		links = nextLinks;
		tick++;

		const simulation = forceSimulation<GraphNode, GraphLink>(nextNodes)
			.force(
				'link',
				forceLink<GraphNode, GraphLink>(nextLinks)
					.id((d) => d.id)
					.distance(100)
					.strength(0.42)
			)
			.force('charge', forceManyBody().strength(-200))
			.force(
				'collide',
				forceCollide<GraphNode>()
					.radius((d) => d.r + 26)
					.strength(0.9)
			)
			.force(
				'x',
				forceX<GraphNode>((d) => KINGDOM_X[d.kingdom] ?? 520).strength(0.05)
			)
			.force(
				'y',
				forceY<GraphNode>((d) => ERA_Y[d.era]).strength(0.065)
			)
			.on('tick', () => {
				tick++;
			});

		sim = simulation;

		// Fit once the layout has settled a bit.
		let fitted = false;
		simulation.on('tick.fit', () => {
			if (fitted || simulation.alpha() > 0.35) return;
			fitted = true;
			if (svgEl) fitView(svgEl, nextNodes);
			simulation.on('tick.fit', null);
		});
	}

	function stopSimulation() {
		sim?.stop();
		sim = null;
		nodes = [];
		links = [];
	}

	function setFilter(k: Person['kingdom'] | null) {
		filter = k;
	}

	function setEra(e: ChartEra | null) {
		eraFilter = e;
	}

	function toggle() {
		open = !open;
		if (!open) {
			closeProfile();
			filter = null;
			eraFilter = null;
			stopSimulation();
			view = { x: 0, y: 0, k: 1 };
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open && !profiles.peeked) open = false;
	}

	let tip = $derived.by(() => {
		const p = profiles.peeked;
		if (!p || !open) return null;
		if (p.entity === 'relationship' && p.between) {
			const a = byId.get(p.between[0]);
			const b = byId.get(p.between[1]);
			return {
				name: p.name,
				sub: [a?.name, b?.name].filter(Boolean).join(' · '),
				line: p.tagline,
				color: colorOf(p)
			};
		}
		return {
			name: p.name,
			sub: KINGDOMS[p.kingdom].label,
			line: p.tagline,
			color: colorOf(p)
		};
	});

	/** d3-zoom on the SVG; restarts when the open chart mounts. */
	const zoomAttach: Attachment<SVGSVGElement> = (svg) => {
		svgEl = svg;
		view = { x: 0, y: 0, k: 1 };
		const z = zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.15, 1.8])
			.filter((event) => {
				// Let node drags own primary-button gestures on .node
				if (event.type === 'wheel') return true;
				const t = event.target as Element | null;
				if (t?.closest?.('.node')) return false;
				return !event.ctrlKey && !event.button;
			})
			.on('zoom', (event) => {
				const t = event.transform;
				view = { x: t.x, y: t.y, k: t.k };
			});
		zoomer = z;
		svgSel = select(svg);
		svgSel.call(z);
		svgSel.on('dblclick.zoom', null);

		return () => {
			svgSel?.on('.zoom', null);
			zoomer = null;
			svgSel = null;
			if (svgEl === svg) svgEl = null;
		};
	};

	/** Pin node under the pointer while dragging; release on end. */
	function nodeDrag(node: GraphNode): Attachment<SVGGElement> {
		return (el) => {
			const behavior = drag<SVGGElement, unknown>()
				.container(() => (svgEl ?? el.ownerSVGElement) as SVGSVGElement)
				.subject(() => {
					const t = view;
					return { x: node.x * t.k + t.x, y: node.y * t.k + t.y };
				})
				.on('start', (event) => {
					didDrag = false;
					if (!event.active) sim?.alphaTarget(0.25).restart();
					node.fx = node.x;
					node.fy = node.y;
				})
				.on('drag', (event) => {
					didDrag = true;
					const t = view;
					node.fx = (event.x - t.x) / t.k;
					node.fy = (event.y - t.y) / t.k;
					tick++;
				})
				.on('end', (event) => {
					if (!event.active) sim?.alphaTarget(0);
					node.fx = null;
					node.fy = null;
				});

			select(el).call(behavior);
			return () => {
				select(el).on('.drag', null);
			};
		};
	}

	function onNodeClick(id: string) {
		if (didDrag) {
			didDrag = false;
			return;
		}
		openProfile(id);
	}

	function onLinkClick(id: string) {
		openProfile(id);
	}

	function zoomBy(factor: number) {
		if (!svgEl || !zoomer || !svgSel) return;
		svgSel.call(zoomer.scaleBy, factor);
	}

	function zoomReset() {
		if (svgEl) fitView(svgEl, nodes);
	}

	// Live simulation while the modal is open; rebuild when filters change.
	$effect(() => {
		if (!open || !svgEl) return;
		const k = filter;
		const e = eraFilter;
		startSimulation(k, e);
		return () => {
			sim?.stop();
			sim = null;
		};
	});
</script>

<svelte:window onkeydown={onKey} />

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={toggle}></div>
{/if}

<figure class="chart" class:open>
	{#if open}
		<div class="frame open-frame">
			<div class="flow">
				<div class="legend-panel">
					<div class="legend">
						<button
							type="button"
							class="tag era"
							class:on={eraFilter === null}
							onclick={() => setEra(null)}>All eras</button
						>
						{#each eraOrder as e (e)}
							<button
								type="button"
								class="tag era"
								class:on={eraFilter === e}
								onclick={() => setEra(eraFilter === e ? null : e)}
							>
								{ERA_META[e].label}
							</button>
						{/each}
					</div>
					<div class="legend">
						<button
							type="button"
							class="tag"
							class:on={filter === null}
							onclick={() => setFilter(null)}>All</button
						>
						{#each usedKingdoms as k (k)}
							<button
								type="button"
								class="tag"
								class:on={filter === k}
								style:--k={KINGDOMS[k].color}
								onclick={() => setFilter(filter === k ? null : k)}
							>
								{KINGDOMS[k].label}
							</button>
						{/each}
					</div>
					<p class="legend-hint">
						Larger circles = central figures · Present / Past / Myth are separate bands · Drag to
						rearrange
					</p>
				</div>

				<svg class="graph" {@attach zoomAttach} role="img" aria-label="Relationship force graph">
					<!-- tick read keeps positions live -->
					{#if tick >= 0}
						<g class="viewport" transform="translate({view.x},{view.y}) scale({view.k})">
							{#each visibleEras as era (era)}
								<text class="era-label" x={24} y={ERA_Y[era] - 72}>{ERA_META[era].label}</text>
								<text class="era-hint" x={24} y={ERA_Y[era] - 56}>{ERA_META[era].hint}</text>
							{/each}

							{#each links as l (l.id)}
								{@const s = linkEnd(l.source)}
								{@const t = linkEnd(l.target)}
								{#if s && t}
									<g
										class="link"
										role="button"
										tabindex="0"
										onclick={() => onLinkClick(l.id)}
										onkeydown={(ev) => {
											if (ev.key === 'Enter' || ev.key === ' ') {
												ev.preventDefault();
												onLinkClick(l.id);
											}
										}}
									>
										<title>{l.label}</title>
										<line
											class="hit"
											x1={s.x}
											y1={s.y}
											x2={t.x}
											y2={t.y}
											stroke="transparent"
											stroke-width="14"
										/>
										<line
											class="bond"
											x1={s.x}
											y1={s.y}
											x2={t.x}
											y2={t.y}
											stroke={l.color}
											stroke-width={l.thick ? 1.6 : 1.1}
											opacity="0.65"
										/>
									</g>
								{/if}
							{/each}

							{#each nodes as n (n.id)}
								<g
									class="node"
									transform="translate({n.x},{n.y})"
									{@attach nodeDrag(n)}
									onclick={() => onNodeClick(n.id)}
									role="button"
									tabindex="0"
									onkeydown={(ev) => {
										if (ev.key === 'Enter' || ev.key === ' ') {
											ev.preventDefault();
											onNodeClick(n.id);
										}
									}}
								>
									<title>{n.name}{n.korean ? ` · ${n.korean}` : ''}</title>
									<defs>
										<clipPath id="clip-{n.id}">
											<circle r={n.r} />
										</clipPath>
									</defs>
									<circle
										class="ring"
										r={n.r}
										fill={n.color}
										stroke="rgba(0,0,0,0.35)"
										stroke-width="1.25"
									/>
									{#if n.avatar}
										<image
											href={n.avatar}
											x={-n.r}
											y={-n.r}
											width={n.r * 2}
											height={n.r * 2}
											clip-path="url(#clip-{n.id})"
											preserveAspectRatio="xMidYMid slice"
										/>
									{:else}
										<text class="initial" text-anchor="middle" dy="0.35em">{n.initial}</text>
									{/if}
									<text class="label" text-anchor="middle" y={n.r + 12}>{n.name}</text>
								</g>
							{/each}
						</g>
					{/if}
				</svg>

				<div class="zoom-controls" aria-label="Zoom controls">
					<button type="button" onclick={() => zoomBy(1.25)} aria-label="Zoom in">+</button>
					<button type="button" onclick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">−</button>
					<button type="button" onclick={zoomReset} aria-label="Fit view">⊡</button>
				</div>
			</div>
		</div>
	{:else}
		<button
			class="frame"
			onclick={toggle}
			aria-label="Open the relationship chart"
			aria-expanded="false"
			type="button"
		>
			<div class="preview" aria-hidden="true">
				<span class="dot a"></span>
				<span class="link"></span>
				<span class="dot b"></span>
				<span class="dot c"></span>
				<span class="link2"></span>
			</div>
		</button>
	{/if}

	<figcaption>
		{#if open && tip}
			<span class="pl-name" style:--c={tip.color}>{tip.name}</span>
			<span class="pl-ko">{tip.sub}</span>
			<span class="pl-blurb">{tip.line}</span>
		{:else if open}
			<span class="pl-hint">Click a circle or a bond · Drag nodes · Esc to close</span>
		{:else}
			<span class="pl-name">Relations</span>
			<span class="pl-ko">인물 관계</span>
		{/if}
	</figcaption>
</figure>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 88;
		background: rgba(0, 0, 0, 0.72);
	}

	/* Rides directly on top of the map card, so it follows the map wherever
	   app.css puts it (immersive lifts the pair above the dialogue box). */
	.chart {
		position: fixed;
		left: var(--corner-left);
		bottom: calc(var(--corner-bottom) + var(--map-stack));
		z-index: 90;
		width: var(--chart-w);
		margin: 0;
		padding: 0.4rem 0.4rem 0.1rem;
		border: 1px solid var(--hairline);
		border-radius: 6px;
		background: var(--glass);
		opacity: 0.55;
		transition:
			opacity 500ms var(--ease),
			border-color 500ms var(--ease),
			width 620ms var(--ease),
			height 620ms var(--ease),
			left 620ms var(--ease),
			bottom 620ms var(--ease),
			padding 620ms var(--ease),
			background 620ms var(--ease);
	}

	.chart:hover {
		opacity: 1;
	}

	.chart.open {
		opacity: 1;
		width: min(96vw, 78rem);
		height: min(90vh, 56rem);
		left: 50%;
		bottom: 50%;
		translate: -50% 50%;
		padding: 0.65rem 0.65rem 0.12rem;
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--panel);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.65);
		display: flex;
		flex-direction: column;
	}

	.frame {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		line-height: 0;
		cursor: zoom-in;
		flex: 1;
		min-height: 0;
	}

	.chart.open .frame,
	.open-frame {
		cursor: default;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
	}

	.preview {
		position: relative;
		height: 4.6rem;
		border-radius: 4px;
		background: #181818;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.dot {
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
	.dot.a {
		left: 22%;
		top: 30%;
		background: #7aa2f7;
	}
	.dot.b {
		left: 68%;
		top: 38%;
		background: #c4a35a;
	}
	.dot.c {
		left: 48%;
		top: 68%;
		background: #b85c5c;
	}
	.link,
	.link2 {
		position: absolute;
		height: 1px;
		background: rgba(255, 255, 255, 0.22);
	}
	.link {
		left: 26%;
		top: 34%;
		width: 40%;
		rotate: 8deg;
	}
	.link2 {
		left: 40%;
		top: 52%;
		width: 28%;
		rotate: -28deg;
	}

	.flow {
		position: relative;
		width: 100%;
		flex: 1;
		min-height: min(72vh, 46rem);
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: #1e1e1e;
		display: flex;
		flex-direction: column;
	}

	.legend-panel {
		position: absolute;
		top: 0.55rem;
		left: 0.55rem;
		z-index: 2;
		pointer-events: none;
	}

	.legend-panel .legend,
	.legend-panel .tag {
		pointer-events: auto;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.28rem;
		max-width: min(70vw, 42rem);
		margin-bottom: 0.28rem;
	}

	.tag {
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: #252525;
		color: rgba(235, 235, 245, 0.7);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		cursor: pointer;
	}

	.tag.era {
		border-color: rgba(255, 255, 255, 0.14);
	}

	.tag.on {
		border-color: color-mix(in srgb, var(--k, #ebebf5) 45%, transparent);
		color: color-mix(in srgb, var(--k, #ebebf5) 35%, #fff);
		background: color-mix(in srgb, var(--k, #888) 22%, #1e1e1e);
	}

	.legend-hint {
		margin: 0.2rem 0 0;
		font-size: 0.6rem;
		color: rgba(235, 235, 245, 0.35);
		max-width: min(70vw, 28rem);
	}

	.graph {
		width: 100%;
		flex: 1;
		min-height: 0;
		display: block;
		cursor: grab;
		touch-action: none;
	}

	.graph:active {
		cursor: grabbing;
	}

	.era-label {
		fill: rgba(235, 235, 245, 0.45);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		pointer-events: none;
	}

	.era-hint {
		fill: rgba(235, 235, 245, 0.22);
		font-size: 10px;
		pointer-events: none;
	}

	.link {
		cursor: pointer;
	}

	.link:hover .bond {
		opacity: 1;
		stroke-width: 2.2;
	}

	.node {
		cursor: pointer;
	}

	.node:focus-visible .ring {
		stroke: #fff;
		stroke-width: 2;
	}

	.initial {
		fill: rgba(255, 255, 255, 0.92);
		font-size: 11px;
		font-weight: 600;
		pointer-events: none;
	}

	.label {
		fill: rgba(235, 235, 245, 0.78);
		font-size: 10px;
		font-weight: 550;
		pointer-events: none;
	}

	.zoom-controls {
		position: absolute;
		bottom: 0.55rem;
		right: 0.55rem;
		z-index: 2;
		display: flex;
		flex-direction: column;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		overflow: hidden;
		background: #252525;
	}

	.zoom-controls button {
		width: 1.7rem;
		height: 1.7rem;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		background: #252525;
		color: rgba(235, 235, 245, 0.7);
		font-size: 0.95rem;
		line-height: 1;
		cursor: pointer;
	}

	.zoom-controls button:last-child {
		border-bottom: none;
	}

	.zoom-controls button:hover {
		color: #fff;
		background: #2e2e2e;
	}

	figcaption {
		display: flex;
		flex-direction: column;
		min-height: 1.9rem;
		padding: 0.3rem 0.15rem 0.15rem;
		border-top: 1px solid var(--hairline);
		margin-top: 0.35rem;
	}

	.chart.open figcaption {
		min-height: 3.4rem;
		max-height: 4.6rem;
		overflow: hidden;
		padding: 0.45rem 0.2rem 0.3rem;
	}

	.pl-name {
		font-size: 0.66rem;
		font-weight: 500;
		letter-spacing: var(--tracking-micro);
		color: #fbfaf8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chart.open .pl-name {
		font-size: 0.95rem;
		color: color-mix(in srgb, var(--c, #fff) 45%, #fff);
	}

	.pl-ko {
		font-size: 0.6rem;
		color: var(--fg-faint);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chart.open .pl-ko {
		font-size: 0.72rem;
	}

	.pl-blurb {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--fg-dim);
	}

	.pl-hint {
		font-size: 0.72rem;
		color: var(--fg-faint);
	}

	@media (max-width: 820px) {
		/* Immersive lifts the map above the dialogue box, and one floating card
		   is all a phone can carry; opened, the chart is a modal and still welcome. */
		:global(html.is-immersive) .chart:not(.open) {
			display: none;
		}

		.chart.open {
			width: 98vw;
			height: 88vh;
			padding: 0.4rem;
		}

		.flow {
			min-height: min(68vh, 40rem);
		}

		.preview {
			height: 3.2rem;
		}
	}
</style>
