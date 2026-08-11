/**
 * d3-force layout for the relationship chart.
 * Soft pulls toward era bands and kingdom columns; link force keeps related people near.
 */

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
import type { ChartEra } from '$lib/relations';
import type { Person } from '$lib/people';

export type ForceNode = {
	id: string;
	era: ChartEra;
	kingdom: Person['kingdom'];
	r: number;
	x: number;
	y: number;
	vx?: number;
	vy?: number;
	fx?: number | null;
	fy?: number | null;
	index?: number;
};

export type ForceLink = SimulationLinkDatum<ForceNode> & {
	id?: string;
};

/** Soft vertical anchors for era bands (forceY targets). */
export const ERA_Y: Record<ChartEra, number> = {
	present: 220,
	past: 620,
	myth: 980
};

/** Soft horizontal anchors by kingdom (forceX targets). */
export const KINGDOM_X: Partial<Record<Person['kingdom'], number>> = {
	silla: 200,
	baekje: 520,
	goguryeo: 860,
	tang: 1120,
	gaya: 520,
	tamla: 860,
	underworld: 200,
	other: 200,
	yamato: 1120
};

/** Live simulation used by RelationChart (Svelte Flow syncs positions each tick). */
export function createRelationForceSimulation(
	nodes: ForceNode[],
	links: ForceLink[]
): Simulation<ForceNode, ForceLink> {
	return forceSimulation<ForceNode, ForceLink>(nodes)
		.force(
			'link',
			forceLink<ForceNode, ForceLink>(links)
				.id((d) => d.id)
				.distance(100)
				.strength(0.42)
		)
		.force('charge', forceManyBody().strength(-200))
		.force(
			'collide',
			forceCollide<ForceNode>()
				.radius((d) => d.r + 26)
				.strength(0.9)
		)
		.force(
			'x',
			forceX<ForceNode>((d) => KINGDOM_X[d.kingdom] ?? 520).strength(0.05)
		)
		.force(
			'y',
			forceY<ForceNode>((d) => ERA_Y[d.era]).strength(0.065)
		);
}

/** One-shot bake for static layouts / offline tooling. */
export function runForceLayout(
	people: {
		id: string;
		era: ChartEra;
		kingdom: Person['kingdom'];
		r: number;
		x: number;
		y: number;
	}[],
	links: { source: string; target: string }[],
	ticks = 160
): Map<string, { x: number; y: number }> {
	const nodes: ForceNode[] = people.map((p) => ({
		id: p.id,
		era: p.era,
		kingdom: p.kingdom,
		r: p.r,
		x: p.x,
		y: p.y
	}));

	const simLinks: ForceLink[] = links.map((l) => ({ ...l }));
	const sim = createRelationForceSimulation(nodes, simLinks).stop();

	for (let i = 0; i < ticks; i++) sim.tick();

	const out = new Map<string, { x: number; y: number }>();
	for (const n of nodes) out.set(n.id, { x: n.x, y: n.y });
	return out;
}
