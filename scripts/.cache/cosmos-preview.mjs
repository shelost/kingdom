/**
 * Offline look at the cosmos land mask: baked land + LAND_ADDS − WATER_CUTS, both discs,
 * the rivers' lens. Writes scripts/.cache/shots/cosmos-mask.svg and a PNG via Quick Look.
 *   node scripts/.cache/cosmos-preview.mjs [extra-svg-file]
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEAD_DISC, LAND_ADDS, LIVING_DISC, WATER_CUTS, sheetRing } from '../../src/lib/cosmos.ts';

const disc = process.env.DISC === 'dead' ? DEAD_DISC : LIVING_DISC;
const F = { x: disc.x - disc.r * 1.02, y: disc.y - disc.r * 1.02, w: disc.r * 2.04, h: disc.r * 2.04 };
const land = JSON.parse(fs.readFileSync('static/map-cosmos.json', 'utf8')).land;
const ring = (r) => 'M' + sheetRing(r).map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join('L') + 'Z';
const extra = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : '';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${F.x} ${F.y} ${F.w} ${F.h}" width="2000" height="${Math.round((2000 * F.h) / F.w)}">
<defs>
 <mask id="land" maskUnits="userSpaceOnUse" x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}">
  <rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="black"/>
  <path d="${land}" fill="white"/>
  ${LAND_ADDS.map((r) => `<path d="${ring(r)}" fill="white"/>`).join('')}
  ${WATER_CUTS.map((r) => `<path d="${ring(r)}" fill="black"/>`).join('')}
 </mask>
 <clipPath id="discs"><circle cx="${LIVING_DISC.x}" cy="${LIVING_DISC.y}" r="${LIVING_DISC.r}"/><circle cx="${DEAD_DISC.x}" cy="${DEAD_DISC.y}" r="${DEAD_DISC.r}"/></clipPath>
</defs>
<rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="#111"/>
<g clip-path="url(#discs)">
 <rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="#0a4e72"/>
 <rect x="${F.x}" y="${F.y}" width="${F.w}" height="${F.h}" fill="#e4d3b4" mask="url(#land)"/>
 ${extra}
</g>
<circle cx="${LIVING_DISC.x}" cy="${LIVING_DISC.y}" r="${LIVING_DISC.r}" fill="none" stroke="#fff" stroke-width="20"/>
<circle cx="${DEAD_DISC.x}" cy="${DEAD_DISC.y}" r="${DEAD_DISC.r}" fill="none" stroke="#fff" stroke-width="20"/>
</svg>`;
fs.mkdirSync('scripts/.cache/shots', { recursive: true });
const name = `scripts/.cache/shots/mask-${process.env.DISC ?? 'living'}-${Date.now()}.svg`;
fs.writeFileSync(name, svg);
execFileSync('qlmanage', ['-t', '-s', '1400', '-o', 'scripts/.cache/shots', name], { stdio: 'ignore' });
fs.rmSync(name);
console.log(`${name}.png`);
