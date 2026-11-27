/**
 * God King year plates. Same coastline as the map page (static/map-land.svg,
 * the sheet's land mask) and the same town holdings as the wash. "Start of YEAR"
 * is the land as that year opens: the previous year's holdings.
 *
 *   node scripts/god-king-year-maps.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'vite';

const YEARS = [
	{ year: 887, book: 'Kim Man, the Queen' },
	{ year: 891, book: 'Yang Kil, the Warlord' },
	{ year: 892, book: 'Kyun Hwon, the Dragon' },
	{ year: 900, book: 'Kyun Hwon, the Dragon' },
	{ year: 901, book: 'Kung Ye, the Monk' },
	{ year: 918, book: 'Hong Yu, the Revolutionary' },
	{ year: 926, book: 'Dae Gwang-hyun, the Northern Prince' },
	{ year: 927, book: 'Sin Sung-gyum, the Crimson Shadow' },
	{ year: 929, book: 'Yu Gum-pil, the Iron Shield' },
	{ year: 934, book: 'Yu Gum-pil, the Iron Shield' },
	{ year: 935, book: 'Kyun Sin-gum, the Divine Sword' },
	{ year: 936, book: 'Wang Gun, the King of Goryeo' },
	{ year: 938, book: 'Goryeo', at: 938, heading: '938' }
];

const SKIP = new Set(['china', 'wa', 'yamato']);
const RIVERS = [
	['Amnok', [[128.06, 41.99], [127.95, 41.75], [128.1, 41.45], [127.75, 41.42], [127.35, 41.6], [127.0, 41.75], [126.85, 41.55], [126.6, 41.35], [126.3, 41.15], [126.0, 40.95], [125.7, 40.82], [125.4, 40.65], [125.1, 40.5], [124.8, 40.35], [124.55, 40.2], [124.4, 40.08], [124.32, 39.9]]],
	['Han', [[128.95, 37.2], [128.75, 37.35], [128.6, 37.4], [128.47, 37.3], [128.46, 37.13], [128.3, 37.0], [128.15, 36.98], [127.93, 36.99], [127.82, 37.12], [127.7, 37.25], [127.55, 37.4], [127.32, 37.53], [127.15, 37.55], [126.98, 37.52], [126.85, 37.58], [126.72, 37.65], [126.62, 37.73]]],
	['Nakdong', [[129.05, 37.15], [128.95, 36.95], [128.75, 36.6], [128.5, 36.55], [128.3, 36.48], [128.25, 36.35], [128.35, 36.15], [128.4, 35.95], [128.45, 35.8], [128.4, 35.6], [128.45, 35.45], [128.6, 35.38], [128.78, 35.38], [128.95, 35.25], [128.95, 35.08]]]
];

/** Natural Earth land in the sheet's own projection: the same coast the map page uses past the sheet. */
const outer = readFileSync('static/map-outer-land.svg', 'utf8');
const landStart = outer.indexOf('d="');
const LAND = outer.slice(landStart + 3, outer.indexOf('"', landStart + 3));

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const borders = await server.ssrLoadModule('/src/lib/borders.ts');
const { BORDER_SITES, holderAt, siteColor, polityName, project, POLITIES } = borders;

/** Jeju to the Balhae north, the west coast to the east coast. The gutter is sea for the legend. */
const [wx0, ny0] = project(123.6, 43.6);
const [ex1, sy1] = project(129.7, 33.15);
const GEO = {
	x: Math.min(wx0, ex1) - 8,
	y: Math.min(ny0, sy1) - 8,
	w: Math.abs(ex1 - wx0) + 16,
	h: Math.abs(sy1 - ny0) + 16
};
const FRAME = { x: GEO.x - 8, y: GEO.y - 52, w: GEO.w + 132, h: GEO.h + 64 };
console.log('frame', FRAME, 'geo', GEO);

function riverPath(pts) {
	return pts
		.map(([lon, lat], i) => {
			const [x, y] = project(lon, lat);
			return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
		})
		.join('');
}

function plate(spec) {
	const shown = spec.at ?? spec.year - 1;
	const heading = spec.heading ?? `Start of ${spec.year}`;
	const fills = [];
	const seen = new Map();
	for (const site of BORDER_SITES) {
		if (site.x < FRAME.x - 40 || site.x > FRAME.x + FRAME.w + 40) continue;
		if (site.y < FRAME.y - 40 || site.y > FRAME.y + FRAME.h + 40) continue;
		const hold = holderAt(site, shown);
		if (!hold.polity || SKIP.has(hold.polity)) continue;
		fills.push(`<path d="${site.d}" fill="${siteColor(site, hold, shown, true, 'near')}" />`);
		if (!seen.has(hold.polity)) {
			const name = polityName(hold.polity, shown);
			seen.set(hold.polity, { color: POLITIES[hold.polity]?.color ?? '#888', label: name.label });
		}
	}
	const caps = [
		['gyeongju', 'Seorabeol'],
		['jeonju', 'Wansan'],
		['kaesong', 'Songak'],
		['pyongyang', 'Pyongyang'],
		['sangju', 'Sangju'],
		['naju', 'Naju']
	];
	const marks = caps.flatMap(([id, label]) => {
		const site = BORDER_SITES.find((s) => s.id === id);
		if (!site) return [];
		return [
			`<circle cx="${site.x.toFixed(1)}" cy="${site.y.toFixed(1)}" r="2.2" fill="#1a140e" />`,
			`<text x="${(site.x + 5).toFixed(1)}" y="${(site.y - 3).toFixed(1)}" font-size="11" font-family="Palatino, Georgia, serif" fill="#1a140e">${label}</text>`
		];
	});
	const legend = [...seen.values()]
		.sort((a, b) => a.label.localeCompare(b.label))
		.map((p, i) => {
			const y = i * 16;
			return `<rect x="0" y="${y}" width="9" height="9" fill="${p.color}" /><text x="14" y="${y + 9}" font-size="12" font-family="Palatino, Georgia, serif" fill="#1a140e">${p.label}</text>`;
		})
		.join('');
	const rivers = RIVERS.map(([, pts]) => `<path d="${riverPath(pts)}" fill="none" stroke="#2f6f9a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />`).join('');
	const { x, y, w, h } = FRAME;
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${Math.round(w)}" height="${Math.round(h)}">
<title>${heading}. ${spec.book}</title>
<desc>${spec.at ? 'The peninsula after Tamla comes in. One crown.' : `The peninsula as ${spec.year} opens, before that year's campaigns.`} Coastline is the map page's Natural Earth land.</desc>
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#d6e0f2" />
<defs>
<clipPath id="land"><path fill-rule="evenodd" d="${LAND}" /></clipPath>
<clipPath id="geo"><rect x="${GEO.x}" y="${GEO.y}" width="${GEO.w}" height="${GEO.h}" /></clipPath>
</defs>
<g clip-path="url(#geo)">
<g clip-path="url(#land)">
<rect x="${GEO.x}" y="${GEO.y}" width="${GEO.w}" height="${GEO.h}" fill="#f3eadc" />
${fills.join('\n')}
${rivers}
</g>
</g>
${marks.join('\n')}
<text x="${x + 16}" y="${y + 28}" font-size="22" font-family="Palatino, Georgia, serif" fill="#1a140e">${heading}</text>
<text x="${x + 16}" y="${y + 48}" font-size="13" font-family="Palatino, Georgia, serif" fill="#3a332c">${spec.book}</text>
<g transform="translate(${x + w - 140} ${y + 70})">${legend}</g>
</svg>
`;
}

const out = 'static/maps/god-king';
mkdirSync(out, { recursive: true });
for (const spec of YEARS) {
	const file = `${out}/${spec.year}.svg`;
	writeFileSync(file, plate(spec));
	console.log(file);
}

const links = YEARS.map(
	(s) =>
		`<li><a download="god-king-${s.year}.svg" href="${s.year}.svg">${s.year} — ${s.book}</a></li>`
).join('\n');
writeFileSync(
	`${out}/index.html`,
	`<!doctype html>
<meta charset="utf-8" />
<title>God King year maps</title>
<style>
	body { margin: 0; background: #111; color: #eee; font: 16px Palatino, Georgia, serif; }
	main { max-width: 640px; margin: 0 auto; padding: 2rem 1.2rem 4rem; }
	a { color: #f4efe6; }
	li { margin: 0.45rem 0; }
</style>
<main>
<h1>God King, as each year opens</h1>
<p>Each link saves an SVG file. Or save them all at once.</p>
<p><a download="god-king-years.zip" href="god-king-years.zip">Download all of them (zip)</a></p>
<ul>
${links}
</ul>
</main>
`
);
await server.close();
