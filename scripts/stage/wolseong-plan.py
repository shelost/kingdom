"""
Wolseong site plan for /stage, traced from OpenStreetMap (ODbL).

  python3 scripts/stage/wolseong-plan.py

Reads scripts/stage/osm/wolseong.json (an Overpass extract around Wolseong)
and writes src/lib/stage/data/wolseong.json in local metres:
origin = centre of the fortress, +x = east, +z = south.

The fortress outline is the union of the four excavation zones A–D
(the interior survey areas of the National Research Institute), pushed
out to the rampart crest.
"""

import json
import math
from pathlib import Path

from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'scripts/stage/osm/wolseong.json'
OUT = ROOT / 'src/lib/stage/data/wolseong.json'

LAT0, LON0 = 35.8300, 129.2245
ZONES = (1163531654, 1163531655, 1163531656, 1163531657)
MOATS = (1338997228, 1338997227, 1424758190, 1446431208, 1446431207, 1446431204)
STONE_MOAT = 382134602
WOLJI = 10997588
DONGGUNG = 477417220
GYERIM = 382133881
CHEOMSEONGDAE = 382132601
WOLJEONGGYO = 712570832
NAMCHEON = 353253953
HWANGNYONGSA = 477218487
HWANGNYONGSA_NODE = 3793932628
BUNHWANGSA_NODE = 4723588467
REACH = 1900


def project(p):
	x = (p['lon'] - LON0) * 111320 * math.cos(math.radians(LAT0))
	z = -(p['lat'] - LAT0) * 110574
	return x, z


data = json.loads(SRC.read_text())
els = {(e['type'], e['id']): e for e in data['elements']}


def way(i):
	return [project(p) for p in els[('way', i)]['geometry']]


zones = unary_union([Polygon(way(i)).buffer(3) for i in ZONES]).buffer(-3)
cx, cz = zones.centroid.x, zones.centroid.y


def local(pts, simplify=0.0):
	out = [(round(x - cx, 1), round(z - cz, 1)) for x, z in pts]
	if simplify and len(out) > 3:
		closed = out[0] == out[-1]
		geom = Polygon(out) if closed else LineString(out)
		geom = geom.simplify(simplify)
		coords = list(geom.exterior.coords if closed else geom.coords)
		out = [(round(x, 1), round(z, 1)) for x, z in coords]
	if len(out) > 1 and out[0] == out[-1]:
		out = out[:-1]
	return [list(p) for p in out]


def ring(poly):
	return local(list(poly.exterior.coords))


interior = zones.simplify(1.5)
crest = zones.buffer(9, join_style='round').simplify(1.5)

wolji = els[('relation', WOLJI)]
wolji_outer = []
wolji_islands = []
for m in wolji['members']:
	pts = [project(p) for p in m.get('geometry', [])]
	if not pts:
		continue
	if m['role'] == 'outer':
		wolji_outer = local(pts, 0.6)
	else:
		wolji_islands.append(local(pts, 0.4))

# OSM maps the middle (≈600 m²) and small (≈60 m²) islands. The large one
# (≈1,100 m² in the 1975–76 report) is placed at the pond's widest open water.
from shapely.ops import polylabel

pond_open = Polygon(wolji_outer).difference(unary_union([Polygon(i).buffer(6) for i in wolji_islands]))
if pond_open.geom_type != 'Polygon':
	pond_open = max(pond_open.geoms, key=lambda g: g.area)
pole = polylabel(pond_open, tolerance=0.5)
large_island = {'at': [round(pole.x, 1), round(pole.y, 1)], 'area': 1094, 'placed': True}

river = LineString(way(NAMCHEON))
river_local = [
	[round(x - cx, 1), round(z - cz, 1)]
	for x, z in river.coords
	if abs(x - cx) < REACH and abs(z - cz) < REACH
]

tombs = []
for (kind, i), e in els.items():
	if kind != 'way' or e.get('tags', {}).get('historic') != 'tomb':
		continue
	poly = Polygon(way(i))
	if poly.area < 60:
		continue
	c = poly.centroid
	if abs(c.x - cx) > REACH or abs(c.y - cz) > REACH:
		continue
	rect = list(poly.minimum_rotated_rectangle.exterior.coords)
	e0 = math.dist(rect[0], rect[1])
	e1 = math.dist(rect[1], rect[2])
	ang = math.atan2(rect[1][1] - rect[0][1], rect[1][0] - rect[0][0])
	tombs.append({
		'name': e.get('tags', {}).get('name'),
		'at': [round(c.x - cx, 1), round(c.y - cz, 1)],
		'rx': round(e0 / 2, 1),
		'rz': round(e1 / 2, 1),
		'angle': round(ang, 3),
		'outline': local(list(poly.exterior.coords), 0.8),
	})


def node(i):
	e = els[('node', i)]
	x, z = project(e)
	return [round(x - cx, 1), round(z - cz, 1)]


bridge = Polygon(way(WOLJEONGGYO))
br = list(bridge.minimum_rotated_rectangle.exterior.coords)
sides = sorted(
	[(math.dist(br[k], br[k + 1]), br[k], br[k + 1]) for k in range(4)],
	key=lambda s: -s[0],
)
long_a, long_b = sides[0][1], sides[0][2]
short = sides[2][0]
bc = bridge.centroid
half = math.dist(long_a, long_b) / 2
axis = math.atan2(long_b[1] - long_a[1], long_b[0] - long_a[0])

plan = {
	'source': 'OpenStreetMap contributors (ODbL), Overpass extract',
	'origin': {'lat': None, 'lon': None, 'note': 'centroid of excavation zones A–D'},
	'interior': ring(interior),
	'crest': ring(crest),
	'zones': [ring(Polygon(way(i))) for i in ZONES],
	'moats': [local(way(i), 0.4) for i in MOATS],
	'stoneMoat': local(way(STONE_MOAT), 0.4),
	'wolji': {'outer': wolji_outer, 'islands': wolji_islands, 'largeIsland': large_island},
	'donggung': local(way(DONGGUNG), 0.8),
	'gyerim': local(way(GYERIM), 1.5),
	'cheomseongdae': [round(Polygon(way(CHEOMSEONGDAE)).centroid.x - cx, 1), round(Polygon(way(CHEOMSEONGDAE)).centroid.y - cz, 1)],
	'woljeonggyo': {
		'at': [round(bc.x - cx, 1), round(bc.y - cz, 1)],
		'length': round(half * 2, 1),
		'width': round(short, 1),
		'angle': round(axis, 3),
	},
	'namcheon': river_local,
	'hwangnyongsa': {'site': local(way(HWANGNYONGSA), 1.5), 'at': node(HWANGNYONGSA_NODE)},
	'bunhwangsa': node(BUNHWANGSA_NODE),
	'tombs': tombs,
}

lon0 = LON0 + cx / (111320 * math.cos(math.radians(LAT0)))
lat0 = LAT0 - cz / 110574
plan['origin'] = {'lat': round(lat0, 6), 'lon': round(lon0, 6), 'note': 'centroid of excavation zones A–D'}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(plan, ensure_ascii=False, separators=(',', ':')))

ib = interior.bounds
print(f'wrote {OUT.relative_to(ROOT)}  {OUT.stat().st_size // 1024} KB')
print(f'interior {round(interior.area)} m²  bounds x {ib[0]-cx:.0f}..{ib[2]-cx:.0f}  z {ib[1]-cz:.0f}..{ib[3]-cz:.0f}')
print(f'tombs {len(tombs)}  river pts {len(river_local)}  moats {len(MOATS)}  islands {len(wolji_islands)}')
print(f'woljeonggyo {plan["woljeonggyo"]}')
