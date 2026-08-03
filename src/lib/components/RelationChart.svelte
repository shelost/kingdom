<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		Panel,
		ConnectionMode,
		type Node,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	import { byId, colorOf, KINGDOMS, type Person } from '$lib/people';
	import {
		CHART_NODES,
		RELATIONSHIPS,
		BOND_LABEL,
		RANK_SIZE,
		ERA_META,
		ERA_SECTIONS,
		type ChartEra
	} from '$lib/relations';
	import { runForceLayout } from '$lib/chart/force';
	import { openProfile, closeProfile, profiles } from '$lib/profiles.svelte';
	import PersonNode from '$lib/components/chart/PersonNode.svelte';
	import FloatingEdge from '$lib/components/chart/FloatingEdge.svelte';
	import SectionNode from '$lib/components/chart/SectionNode.svelte';
	import FitViewWhenReady from '$lib/components/chart/FitViewWhenReady.svelte';

	let open = $state(false);
	/** Filter by kingdom id; null = show all. */
	let filter = $state<Person['kingdom'] | null>(null);
	/** Filter by era band; null = show all. */
	let eraFilter = $state<ChartEra | null>(null);
	/** Remount + fitView token after layout settles. */
	let flowKey = $state(0);

	const nodeTypes = { person: PersonNode, section: SectionNode };
	const edgeTypes = { floating: FloatingEdge };

	const kingdomOrder: Person['kingdom'][] = [
		'silla',
		'baekje',
		'goguryeo',
		'tang',
		'gaya',
		'tamla',
		'other'
	];

	const eraOrder: ChartEra[] = ['present', 'past', 'myth'];

	function filteredChart(kingdom: Person['kingdom'] | null, era: ChartEra | null) {
		return CHART_NODES.filter(({ id, era: nodeEra }) => {
			const p = byId.get(id);
			if (!p) return false;
			if (kingdom && p.kingdom !== kingdom) return false;
			if (era && nodeEra !== era) return false;
			return true;
		});
	}

	function buildGraph(kingdom: Person['kingdom'] | null, era: ChartEra | null): {
		nodes: Node[];
		edges: Edge[];
	} {
		const chart = filteredChart(kingdom, era);
		const linkInputs = RELATIONSHIPS.flatMap((rel) => {
			if (!rel.between) return [];
			const [a, b] = rel.between;
			if (!chart.some((n) => n.id === a) || !chart.some((n) => n.id === b)) return [];
			return [{ source: a, target: b, rel }];
		});

		const positions = runForceLayout(
			chart.map((n) => {
				const p = byId.get(n.id)!;
				return {
					id: n.id,
					era: n.era,
					kingdom: p.kingdom,
					r: RANK_SIZE[n.rank] / 2,
					x: n.x,
					y: n.y
				};
			}),
			linkInputs.map(({ source, target }) => ({ source, target }))
		);

		const people: Node[] = chart.flatMap(({ id, rank, gender, era: nodeEra }) => {
			const p = byId.get(id);
			if (!p) return [];
			const size = RANK_SIZE[rank];
			const pos = positions.get(id) ?? { x: 0, y: 0 };
			return [
				{
					id,
					type: 'person',
					position: { x: pos.x, y: pos.y },
					data: {
						label: p.name,
						korean: p.korean,
						color: colorOf(p),
						kingdom: KINGDOMS[p.kingdom].label,
						kingdomColor: KINGDOMS[p.kingdom].color,
						size,
						gender,
						era: nodeEra
					},
					style: `width: ${size}px; height: ${size}px; background: transparent; border: none; padding: 0; border-radius: 50%; overflow: visible;`
				} satisfies Node
			];
		});

		const sections: Node[] = ERA_SECTIONS.flatMap(({ era: e, x, y }) => {
			if (era && e !== era) return [];
			const hasPeople = chart.some((n) => n.era === e);
			if (!hasPeople) return [];
			const m = ERA_META[e];
			return [
				{
					id: `section-${e}`,
					type: 'section',
					position: { x, y: y - 40 },
					data: { label: m.label, hint: m.hint },
					draggable: false,
					selectable: false,
					connectable: false,
					style: 'background: transparent; border: none; padding: 0; width: auto; height: auto;'
				} satisfies Node
			];
		});

		const edges: Edge[] = linkInputs.map(({ source, target, rel }) => {
			const c = colorOf(rel);
			return {
				id: rel.id,
				type: 'floating',
				source,
				target,
				label: BOND_LABEL[rel.bond ?? 'love'],
				style: `stroke: ${c}; stroke-width: ${rel.bond === 'love' || rel.bond === 'affair' ? 1.6 : 1.1}; opacity: 0.65;`,
				animated: false
			};
		});

		return { nodes: [...sections, ...people], edges };
	}

	let nodes = $state.raw<Node[]>(buildGraph(null, null).nodes);
	let edges = $state.raw<Edge[]>(buildGraph(null, null).edges);

	function applyFilters(k: Person['kingdom'] | null, e: ChartEra | null) {
		filter = k;
		eraFilter = e;
		const g = buildGraph(k, e);
		nodes = g.nodes;
		edges = g.edges;
		flowKey += 1;
	}

	function setFilter(k: Person['kingdom'] | null) {
		applyFilters(k, eraFilter);
	}

	function setEra(e: ChartEra | null) {
		applyFilters(filter, e);
	}

	function toggle() {
		open = !open;
		if (!open) {
			closeProfile();
			filter = null;
			eraFilter = null;
			const g = buildGraph(null, null);
			nodes = g.nodes;
			edges = g.edges;
			flowKey = 0;
		} else {
			const g = buildGraph(filter, eraFilter);
			nodes = g.nodes;
			edges = g.edges;
			flowKey += 1;
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

	const usedKingdoms = $derived(
		kingdomOrder.filter((k) => CHART_NODES.some((n) => byId.get(n.id)?.kingdom === k))
	);
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
				{#key flowKey}
					<SvelteFlow
						bind:nodes
						bind:edges
						{nodeTypes}
						{edgeTypes}
						fitView={false}
						minZoom={0.15}
						maxZoom={1.8}
						colorMode="dark"
						connectionMode={ConnectionMode.Loose}
						nodesDraggable={true}
						nodesConnectable={false}
						elementsSelectable={true}
						attributionPosition="bottom-left"
						onnodeclick={({ node }) => {
							if (node.type === 'person') openProfile(node.id);
						}}
						onedgeclick={({ edge }) => openProfile(edge.id)}
					>
						<FitViewWhenReady token={flowKey} />
						<Background gap={28} size={1} bgColor="#1e1e1e" patternColor="rgba(255,255,255,0.04)" />
						<Controls showLock={false} />
						<MiniMap
							pannable
							zoomable
							bgColor="#181818"
							maskColor="rgba(0,0,0,0.55)"
							nodeColor={(n) => (typeof n.data?.color === 'string' ? n.data.color : '#555')}
							nodeStrokeColor="#1e1e1e"
						/>
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
							<p class="legend-hint">Larger circles = central figures · Present / Past / Myth are separate bands</p>
						</Panel>
					</SvelteFlow>
				{/key}
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
			<span class="pl-hint">Click a circle or a bond · Esc to close</span>
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

	.chart {
		position: fixed;
		left: 1.15rem;
		bottom: calc(1.15rem + 11.2rem);
		z-index: 90;
		width: 9.5rem;
		margin: 0;
		padding: 0.4rem 0.4rem 0.1rem;
		border: 1px solid var(--hairline);
		border-radius: 6px;
		background: rgba(30, 30, 30, 0.88);
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
		background: #1e1e1e;
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
		width: 100%;
		flex: 1;
		min-height: min(72vh, 46rem);
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: #1e1e1e;
	}

	.flow :global(.svelte-flow) {
		background: #1e1e1e;
	}

	.flow :global(.svelte-flow__edge-path) {
		cursor: pointer;
	}

	.flow :global(.svelte-flow__node) {
		cursor: pointer;
	}

	.flow :global(.svelte-flow__node-section) {
		cursor: default;
	}

	.flow :global(.svelte-flow__attribution) {
		background: transparent;
		opacity: 0.25;
	}

	.flow :global(.svelte-flow__controls) {
		background: #252525;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		box-shadow: none;
	}

	.flow :global(.svelte-flow__controls-button) {
		background: #252525;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		fill: rgba(235, 235, 245, 0.7);
	}

	.flow :global(.svelte-flow__minimap) {
		background: #181818;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 4px;
	}

	.flow :global(.legend-panel) {
		margin: 0.55rem;
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
		.chart {
			width: 6.2rem;
			left: 0.7rem;
			bottom: calc(0.7rem + 7.8rem);
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
