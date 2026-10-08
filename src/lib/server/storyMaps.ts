import { geoArea, geoGraticule10, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { MultiPolygon } from 'geojson';
import type { GeometryCollection, Topology } from 'topojson-specification';
import land10m from 'world-atlas/land-10m.json';
import { arrowHead, curveThrough, pointAlong, waveAlong, type Pt } from '$lib/mapPaths';
import type { RenderedMap, RenderedRoute, StoryMap } from '$lib/outlines/types';

const MAP_WIDTH = 1000;
const MIN_HEIGHT = 480;
const MAX_HEIGHT = 900;
const PAD_X = 190;
const PAD_Y = 80;

const topology = land10m as unknown as Topology<{ land: GeometryCollection }>;
const WORLD = feature(topology, topology.objects.land);

/**
 * Every polygon of land except Antarctica (Mercator sends it to infinity) and the few
 * slivers wound inside-out in the 10m atlas, which d3 reads as "the whole globe".
 */
const LAND: MultiPolygon = {
	type: 'MultiPolygon',
	coordinates: WORLD.features.flatMap((f) => {
		const g = f.geometry;
		const polys = g.type === 'MultiPolygon' ? g.coordinates : g.type === 'Polygon' ? [g.coordinates] : [];
		return polys.filter(
			(poly) =>
				poly[0].every(([, lat]) => lat > -60) &&
				geoArea({ type: 'Polygon', coordinates: poly }) < 2 * Math.PI
		);
	})
};

const lonLat = ([lat, lon]: [number, number]): [number, number] => [lon, lat];
const round = (n: number) => Math.round(n * 10) / 10;

export function renderStoryMap(map: StoryMap): RenderedMap {
	const byId = new Map(map.points.map((p) => [p.id, p]));
	const frame = {
		type: 'MultiPoint' as const,
		coordinates: [...map.points.map((p) => p.at), ...(map.frame ?? [])].map(lonLat)
	};

	const [[x0, y0], [x1, y1]] = geoPath(geoMercator()).bounds(frame);
	const aspect = (y1 - y0) / Math.max(x1 - x0, 1e-6);
	const height = Math.round(
		Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, (MAP_WIDTH - 2 * PAD_X) * aspect + 2 * PAD_Y))
	);

	const projection = geoMercator()
		.fitExtent(
			[
				[PAD_X, PAD_Y],
				[MAP_WIDTH - PAD_X, height - PAD_Y]
			],
			frame
		)
		.clipExtent([
			[0, 0],
			[MAP_WIDTH, height]
		]);
	const path = geoPath(projection).digits(1);
	const project = (at: [number, number]): Pt => {
		const [x, y] = projection(lonLat(at)) ?? [0, 0];
		return [round(x), round(y)];
	};

	const routes = (map.routes ?? []).flatMap((route): RenderedRoute[] => {
		const kind = route.kind ?? 'march';
		const water = kind === 'river' || kind === 'water';
		const pts = route.via.flatMap((v): Pt[] => {
			const at = typeof v === 'string' ? byId.get(v)?.at : v;
			return at ? [project(at)] : [];
		});
		const curve = curveThrough(pts, { startGap: water ? 0 : 16, endGap: water ? 0 : 22, bend: water ? 0 : 1 });
		if (!curve) return [];
		const mid = pointAlong(curve.samples, 0.5);
		return [
			{
				kind,
				d: kind === 'naval' ? waveAlong(curve.samples, 4, 30) : curve.d,
				head: water ? undefined : arrowHead(curve.samples, 20),
				label: route.label,
				lx: round(mid.x),
				ly: round(mid.y)
			}
		];
	});

	return {
		id: map.id,
		title: map.title,
		years: map.years,
		caption: map.caption,
		width: MAP_WIDTH,
		height,
		land: path(LAND) ?? '',
		graticule: path(geoGraticule10()) ?? '',
		points: map.points.map(({ at, ...p }) => {
			const [x, y] = project(at);
			return { ...p, x, y };
		}),
		routes
	};
}
