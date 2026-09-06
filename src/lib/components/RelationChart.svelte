<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		Panel,
		ConnectionMode,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { untrack } from 'svelte';
	import type { Simulation } from 'd3-force';

	import {
		byId,
		colorOf,
		accentColorsOf,
		avatarOf,
		hangulInitial,
		KINGDOMS,
		type Person
	} from '$lib/people';
	import {
		CHART_NODES,
		RELATIONSHIPS,
		BOND_LABEL,
		ERA_META,
		type ChartEra
	} from '$lib/relations';
	import {
		ERA_Y,
		createRelationForceSimulation,
		type ForceLink,
		type ForceNode
	} from '$lib/chart/force';
	import { openProfile, closeProfile, profiles } from '$lib/profiles.svelte';
	import { scriptUi } from '$lib/scriptUi.svelte';

	import PersonNode from '$lib/components/chart/PersonNode.svelte';
	import FloatingEdge from '$lib/components/chart/FloatingEdge.svelte';
	import SectionNode from '$lib/components/chart/SectionNode.svelte';
	import FitViewWhenReady from '$lib/components/chart/FitViewWhenReady.svelte';

	/** Full-page Characters route: graph always open, no story-corner chrome. */
	let { pageMode = false }: { pageMode?: boolean } = $props();

	/** Portrait diameters — RANK_SIZE scaled up for readable faces. */
	const PORTRAIT: Record<1 | 2 | 3, number> = {
		1: 28,
		2: 36,
		3: 48
	};

	const nodeTypes = {
		person: PersonNode,
		section: SectionNode
	};

	const edgeTypes = {
		floating: FloatingEdge
	};

	type PersonFlowNode = Node<
		{
			label: string;
			korean?: string;
			color: string;
			kingdom: string;
			kingdomColor: string;
			size: number;
			gender: 'm' | 'f';
			avatar: string | null;
			initial: string;
			era: ChartEra;
		},
		'person'
	>;

	type SectionFlowNode = Node<{ label: string; hint?: string }, 'section'>;
	type ChartFlowNode = PersonFlowNode | SectionFlowNode;

	/** Manual open for the story-corner modal; pageMode keeps the graph open. */
	let openManual = $state(false);
	let open = $derived(pageMode || openManual);
	/** Filter by kingdom id; null = show all. */
	let filter = $state<Person['kingdom'] | null>(null);
	/** Filter by era band; null = show all. */
	let eraFilter = $state<ChartEra | null>(null);

	let nodes = $state.raw<ChartFlowNode[]>([]);
	let edges = $state.raw<Edge[]>([]);
	/** Bumped when the graph membership changes so FitViewWhenReady re-fits. */
	let fitToken = $state(0);

	let sim: Simulation<ForceNode, ForceLink> | null = null;
	let simNodes: ForceNode[] = [];
	const simById = new Map<string, ForceNode>();
	const dragging = new Set<string>();

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

	function filteredChart(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		return CHART_NODES.filter(({ id, era: nodeEra }) => {
			const p = byId.get(id);
			if (!p) return false;
			if (kingdom && p.kingdom !== kingdom) return false;
			if (era && nodeEra !== era) return false;
			return true;
		});
	}

	function visibleErasFor(graphNodes: ForceNode[], era: ChartEra | null): ChartEra[] {
		const eras = eraOrder.filter((e) => graphNodes.some((n) => n.era === e));
		if (era) return eras.filter((e) => e === era);
		return eras;
	}

	function buildGraph(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		const chart = filteredChart(kingdom, era);
		const nextSim: ForceNode[] = chart.flatMap(({ id, rank, era: nodeEra, x, y }) => {
			const p = byId.get(id);
			if (!p) return [];
			const diameter = PORTRAIT[rank] ?? 28;
			return [
				{
					id,
					era: nodeEra,
					kingdom: p.kingdom,
					r: diameter / 2,
					x,
					y
				}
			];
		});

		const ids = new Set(nextSim.map((n) => n.id));
		const nextLinks: ForceLink[] = RELATIONSHIPS.flatMap((rel) => {
			if (!rel.between) return [];
			const [a, b] = rel.between;
			if (!ids.has(a) || !ids.has(b)) return [];
			return [{ id: rel.id, source: a, target: b }];
		});

		const personNodes: PersonFlowNode[] = nextSim.flatMap((sn) => {
			const meta = chart.find((c) => c.id === sn.id);
			const p = byId.get(sn.id);
			if (!meta || !p) return [];
			const size = sn.r * 2;
			return [
				{
					id: sn.id,
					type: 'person' as const,
					position: { x: sn.x, y: sn.y },
					width: size,
					height: size,
					data: {
						label: p.name,
						korean: p.korean,
						color: colorOf(p),
						kingdom: KINGDOMS[p.kingdom].label,
						kingdomColor: KINGDOMS[p.kingdom].color,
						size,
						gender: meta.gender,
						avatar: avatarOf(p),
						initial: hangulInitial(p),
						era: sn.era
					}
				}
			];
		});

		const eras = visibleErasFor(nextSim, era);
		const sectionNodes: SectionFlowNode[] = eras.map((e) => ({
			id: `era-${e}`,
			type: 'section' as const,
			position: { x: -20, y: ERA_Y[e] - 72 },
			draggable: false,
			selectable: false,
			connectable: false,
			focusable: false,
			data: {
				label: ERA_META[e].label,
				hint: ERA_META[e].hint
			}
		}));

		const nextEdges: Edge[] = RELATIONSHIPS.flatMap((rel) => {
			if (!rel.between) return [];
			const [a, b] = rel.between;
			if (!ids.has(a) || !ids.has(b)) return [];
			const bond = rel.bond ?? 'love';
			const c = colorOf(rel);
			const thick = bond === 'love' || bond === 'affair';
			return [
				{
					id: rel.id,
					source: a,
					target: b,
					sourceHandle: 's',
					targetHandle: 't',
					type: 'floating',
					label: BOND_LABEL[bond],
					style: `stroke: ${c}; stroke-width: ${thick ? 1.8 : 1.15}; opacity: 0.7`,
					interactionWidth: 18
				}
			];
		});

		return {
			nextSim,
			nextLinks,
			flowNodes: [...sectionNodes, ...personNodes] as ChartFlowNode[],
			nextEdges
		};
	}

	function stopSimulation() {
		sim?.stop();
		sim = null;
		simNodes = [];
		simById.clear();
		dragging.clear();
		nodes = [];
		edges = [];
	}

	function startSimulation(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		sim?.stop();
		dragging.clear();

		const { nextSim, nextLinks, flowNodes, nextEdges } = buildGraph(kingdom, era);
		simNodes = nextSim;
		simById.clear();
		for (const n of nextSim) simById.set(n.id, n);

		nodes = flowNodes;
		edges = nextEdges;
		fitToken++;

		const simulation = createRelationForceSimulation(nextSim, nextLinks);
		simulation.on('tick', () => {
			// Reassign flow nodes from sim positions; skip nodes under the pointer.
			nodes = nodes.map((n) => {
				if (n.type !== 'person') return n;
				if (dragging.has(n.id)) return n;
				const sn = simById.get(n.id);
				if (!sn) return n;
				return {
					...n,
					position: { x: sn.x ?? n.position.x, y: sn.y ?? n.position.y }
				};
			});
		});

		sim = simulation;

		let fitted = false;
		simulation.on('tick.fit', () => {
			if (fitted || simulation.alpha() > 0.4) return;
			fitted = true;
			fitToken++;
			simulation.on('tick.fit', null);
		});
	}

	function setFilter(k: Person['kingdom'] | null) {
		filter = k;
	}

	function setEra(e: ChartEra | null) {
		eraFilter = e;
	}

	function toggle() {
		if (pageMode) return;
		if (!openManual && !scriptUi.inScript) return;
		openManual = !openManual;
		if (!openManual) {
			closeProfile();
			filter = null;
			eraFilter = null;
			stopSimulation();
		}
	}

	$effect(() => {
		if (pageMode) return;
		if (scriptUi.inScript || !openManual) return;
		openManual = false;
		closeProfile();
		filter = null;
		eraFilter = null;
		stopSimulation();
	});

	function onKey(e: KeyboardEvent) {
		if (pageMode) return;
		if (e.key === 'Escape' && openManual && !profiles.peeked) openManual = false;
	}

	let tip = $derived.by(() => {
		const p = profiles.peeked;
		if (!p || !open) return null;
		if (p.entity === 'relationship' && p.between) {
			const a = byId.get(p.between[0]);
			const b = byId.get(p.between[1]);
			const colors = accentColorsOf(p);
			return {
				name: p.name,
				sub: [a?.name, b?.name].filter(Boolean).join(' · '),
				line: p.tagline,
				color: colors[0] ?? colorOf(p),
				color2: colors[1] ?? colors[0] ?? colorOf(p)
			};
		}
		return {
			name: p.name,
			sub: KINGDOMS[p.kingdom].label,
			line: p.tagline,
			color: colorOf(p),
			color2: colorOf(p)
		};
	});

	function onNodeClick({ node }: { node: ChartFlowNode }) {
		if (node.type !== 'person') return;
		openProfile(node.id);
	}

	function onEdgeClick({ edge }: { edge: Edge }) {
		openProfile(edge.id);
	}

	function onNodeDragStart({
		nodes: dragged
	}: {
		nodes: ChartFlowNode[];
	}) {
		if (!sim) return;
		for (const n of dragged) {
			if (n.type !== 'person') continue;
			dragging.add(n.id);
			const sn = simById.get(n.id);
			if (!sn) continue;
			sn.fx = n.position.x;
			sn.fy = n.position.y;
		}
		sim.alphaTarget(0.25).restart();
	}

	function onNodeDrag({
		nodes: dragged
	}: {
		nodes: ChartFlowNode[];
	}) {
		for (const n of dragged) {
			if (n.type !== 'person') continue;
			const sn = simById.get(n.id);
			if (!sn) continue;
			sn.fx = n.position.x;
			sn.fy = n.position.y;
		}
	}

	function onNodeDragStop({
		nodes: dragged
	}: {
		nodes: ChartFlowNode[];
	}) {
		for (const n of dragged) {
			dragging.delete(n.id);
			const sn = simById.get(n.id);
			if (!sn) continue;
			// Release so the force sim can settle again.
			sn.fx = null;
			sn.fy = null;
		}
		sim?.alphaTarget(0);
	}

	// Live simulation while open; rebuild only when filters / open change.
	// startSimulation/stopSimulation write state we must not track here
	// (fitToken++ would otherwise make this effect re-trigger itself).
	$effect(() => {
		if (!open) {
			untrack(stopSimulation);
			return;
		}
		const k = filter;
		const e = eraFilter;
		untrack(() => startSimulation(k, e));
		return () => {
			sim?.stop();
			sim = null;
		};
	});
</script>

<svelte:window onkeydown={onKey} />

{#if open && !pageMode}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="scrim" onclick={toggle}></div>
{/if}

<figure
	class="chart"
	class:open
	class:page={pageMode}
	class:in={scriptUi.inScript || pageMode}
	aria-hidden={!pageMode && !scriptUi.inScript && !open}
>
	{#if open}
		<div class="frame open-frame">
			<div class="flow">
				<SvelteFlow
					bind:nodes
					bind:edges
					{nodeTypes}
					{edgeTypes}
					nodeOrigin={[0.5, 0.5]}
					fitView
					fitViewOptions={{ padding: 0.22 }}
					minZoom={0.12}
					maxZoom={1.8}
					nodesConnectable={false}
					elementsSelectable={false}
					nodesDraggable={true}
					panOnScroll
					zoomOnScroll
					panOnDrag
					selectionOnDrag={false}
					selectNodesOnDrag={false}
					connectionMode={ConnectionMode.Loose}
					proOptions={{ hideAttribution: true }}
					colorMode="dark"
					onnodeclick={onNodeClick}
					onedgeclick={onEdgeClick}
					onnodedragstart={onNodeDragStart}
					onnodedrag={onNodeDrag}
					onnodedragstop={onNodeDragStop}
					defaultEdgeOptions={{ type: 'floating' }}
				>
					<Background
						gap={28}
						size={1}
						patternColor="rgba(255,255,255,0.035)"
						bgColor="#1e1e1e"
					/>
					<Controls showLock={false} position="bottom-right" />
					<FitViewWhenReady token={fitToken} />
					<Panel position="top-left" class="legend-panel">
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
					</Panel>
				</SvelteFlow>
			</div>
		</div>
	{:else}
		<button
			class="frame"
			onclick={toggle}
			aria-label="Open the relationship chart"
			aria-expanded="false"
			tabindex={scriptUi.inScript ? 0 : -1}
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

	{#if !pageMode || tip}
		<figcaption>
			{#if open && tip}
				<span class="pl-name" style:--c={tip.color} style:--c2={tip.color2}>
					<span class="pl-swatches" aria-hidden="true">
						<span class="pl-swatch" style:background={tip.color}></span>
						{#if tip.color2 !== tip.color}
							<span class="pl-swatch" style:background={tip.color2}></span>
						{/if}
					</span>
					{tip.name}
				</span>
				<span class="pl-ko">{tip.sub}</span>
				<span class="pl-blurb">{tip.line}</span>
			{:else if open}
				<span class="pl-hint"
					>{pageMode
						? 'Click a circle or a bond · Drag nodes · Scroll to zoom'
						: 'Click a circle or a bond · Drag nodes · Esc to close'}</span
				>
			{:else}
				<span class="pl-name">Relations</span>
				<span class="pl-ko">인물 관계</span>
			{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 88;
		background: rgba(0, 0, 0, 0.72);
	}

	.chart {
		position: fixed;
		left: var(--corner-left);
		bottom: var(--corner-bottom);
		z-index: 90;
		width: var(--chart-w);
		margin: 0;
		padding: 0.4rem 0.4rem 0.1rem;
		border: 1px solid var(--hairline);
		border-radius: var(--radius);
		background: var(--glass);
		opacity: 0;
		transform: translate3d(0, 1.1rem, 0);
		pointer-events: none;
		transition:
			opacity 520ms var(--ease),
			transform 560ms var(--ease),
			border-color 280ms var(--ease),
			width 320ms var(--ease),
			height 320ms var(--ease),
			left var(--toc-duration) var(--toc-ease),
			bottom 320ms var(--ease),
			padding 320ms var(--ease),
			background 280ms var(--ease);
	}

	.chart.in {
		opacity: 0.55;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}

	.chart.in:hover {
		opacity: 1;
	}

	.chart.open {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
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

	/* Full-viewport Characters map — chrome floats above; sheet peeks over. */
	.chart.page {
		position: fixed;
		inset: 0;
		left: 0;
		bottom: 0;
		translate: none;
		width: 100%;
		height: 100dvh;
		min-height: 100dvh;
		opacity: 1;
		transform: none;
		pointer-events: auto;
		border: none;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
		background: #1e1e1e;
		z-index: 1;
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
		border-radius: var(--radius);
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
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: #1e1e1e;
	}

	.chart.page .flow {
		min-height: 100%;
		height: 100%;
		border: none;
		border-radius: 0;
	}

	.chart.page .open-frame {
		height: 100%;
	}

	:global(.legend-panel) {
		margin: 0.55rem !important;
		pointer-events: none;
	}

	:global(.legend-panel) .legend,
	:global(.legend-panel) .tag {
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

	/* Dark chronicle skin for Svelte Flow chrome */
	.flow :global(.svelte-flow) {
		background: #1e1e1e;
	}

	.flow :global(.svelte-flow__controls) {
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius);
		overflow: hidden;
		box-shadow: none;
	}

	.flow :global(.svelte-flow__controls-button) {
		background: #252525;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		fill: rgba(235, 235, 245, 0.7);
		width: 1.7rem;
		height: 1.7rem;
	}

	.flow :global(.svelte-flow__controls-button:hover) {
		background: #2e2e2e;
		fill: #fff;
	}

	.flow :global(.svelte-flow__edge-path) {
		cursor: pointer;
	}

	.flow :global(.svelte-flow__edge:hover .svelte-flow__edge-path) {
		stroke-opacity: 1;
		stroke-width: 2.2;
	}

	.flow :global(.svelte-flow__node) {
		cursor: pointer;
	}

	.flow :global(.svelte-flow__attribution) {
		display: none;
	}

	figcaption {
		display: flex;
		flex-direction: column;
		min-height: 1.9rem;
		padding: 0.3rem 0.15rem 0.15rem;
		border-top: 1px solid var(--hairline);
		margin-top: 0.35rem;
	}

	.chart.open:not(.page) figcaption {
		min-height: 3.4rem;
		max-height: 4.6rem;
		overflow: hidden;
		padding: 0.45rem 0.2rem 0.3rem;
	}

	.chart.page figcaption {
		position: absolute;
		left: 0.75rem;
		bottom: 0.75rem;
		z-index: 4;
		margin: 0;
		padding: 0.55rem 0.7rem;
		min-height: 0;
		max-width: min(28rem, 70vw);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--radius);
		background: rgba(30, 30, 30, 0.88);
		backdrop-filter: blur(12px);
		pointer-events: none;
	}

	.pl-name {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.66rem;
		font-weight: 500;
		letter-spacing: var(--tracking-micro);
		color: #fbfaf8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pl-swatches {
		display: inline-flex;
		align-items: center;
		gap: 0.15rem;
		flex-shrink: 0;
	}

	.pl-swatch {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 2px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
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

	/* Cinema: relations are dashboard, not drama — the corner card stands down
	   until the reader peeks, and an already-open graph is left alone. */
	:global(html.is-cinema:not(.is-cinema-peek)) .chart:not(.open) {
		opacity: 0;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.chart {
			transition:
				opacity 200ms ease,
				border-color 200ms ease,
				width 200ms ease,
				height 200ms ease,
				left var(--toc-duration) var(--toc-ease),
				bottom 200ms ease,
				padding 200ms ease,
				background 200ms ease;
			transform: none;
		}
	}

	@media (max-width: 820px) {
		:global(html.is-immersion) .chart:not(.open) {
			display: none;
		}

		.chart.open:not(.page) {
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
