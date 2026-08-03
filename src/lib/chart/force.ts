/**
 * Light d3-force layout for the relationship chart.
 * Soft pulls toward era bands and kingdom columns; links keep related people near.
 */

import {
	forceSimulation,
	forceLink,
	forceManyBody,
	forceCollide,
	forceX,
	forceY
} from 'd3-force';
import type { ChartEra } from '$lib/relations';
import type { Person } from '$lib/people';

type SimNode = {
	id: string;
	era: ChartEra;
	kingdom: Person['kingdom'];
	r: number;
	x: number;
	y: number;
	vx?: number;
	vy?: number;
	index?: number;
};

const ERA_Y: Record<ChartEra, number> = {
	present: 220,
	past: 620,
	myth: 980
};

const KINGDOM_X: Partial<Record<Person['kingdom'], number>> = {
	silla: 200,
	baekje: 520,
	goguryeo: 860,
	tang: 1120,
	gaya: 520,
	tamla: 860,
	other: 200,
	yamato: 1120
};

export function runForceLayout(
	people: { id: string; era: ChartEra; kingdom: Person['kingdom']; r: number; x: number; y: number }[],
	links: { source: string; target: string }[],
	ticks = 160
): Map<string, { x: number; y: number }> {
	const nodes: SimNode[] = people.map((p) => ({
		id: p.id,
		era: p.era,
		kingdom: p.kingdom,
		r: p.r,
		x: p.x,
		y: p.y
	}));

	const simLinks = links.map((l) => ({ ...l }));

	const sim = forceSimulation(nodes)
		.force(
			'link',
			forceLink(simLinks)
				.id((d) => (d as SimNode).id)
				.distance(100)
				.strength(0.42)
		)
		.force('charge', forceManyBody().strength(-200))
		.force(
			'collide',
			forceCollide<SimNode>()
				.radius((d) => d.r + 26)
				.strength(0.9)
		)
		.force(
			'x',
			forceX<SimNode>((d) => KINGDOM_X[d.kingdom] ?? 520).strength(0.05)
		)
		.force(
			'y',
			forceY<SimNode>((d) => ERA_Y[d.era]).strength(0.065)
		)
		.stop();

	for (let i = 0; i < ticks; i++) sim.tick();

	const out = new Map<string, { x: number; y: number }>();
	for (const n of nodes) out.set(n.id, { x: n.x, y: n.y });
	return out;
}
