#!/usr/bin/env node
/**
 * Splits static/map.svg (the Figma export) into the two layers the border
 * timeline needs:
 *
 *   static/map-base.svg  the same sheet without the three frozen territory
 *                        tints (and their radial gradients)
 *   static/map-land.svg  an alpha mask: land opaque white, sea transparent
 *                        (alpha, not luminance, because Safari ignores mask-mode)
 *
 * The sea is the large #D7E1F4 even-odd path; everything else on the sheet is land.
 * Re-run after map.svg changes:  node scripts/split-map-svg.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = 'static/map.svg';
const svg = readFileSync(SRC, 'utf8');

/** The territory tints are the six paths filled #FF7E7E/#FFE08F/#AAC8FF or their paint gradients. */
const TERRITORY = /<path\b[^>]*fill="(?:#FF7E7E|#FFE08F|#AAC8FF|url\(#paint[012]_radial_[^)]+\))"[^>]*\/>\s*/g;
const removed = svg.match(TERRITORY)?.length ?? 0;
if (removed !== 6) throw new Error(`expected 6 territory paths, found ${removed}`);
/** Figma's inside-stroke on the coast: a black fill masked to the land edge. It reads as a hard outline. */
const COAST_STROKE = /fill="black"( mask="url\(#path-\d+-inside-[^)]+\)")/g;
writeFileSync('static/map-base.svg', svg.replace(TERRITORY, '').replace(COAST_STROKE, 'fill="none"$1'));

const sea = svg.match(/<path\b[^>]*\bd="([^"]+)"[^>]*fill="#D7E1F4"/);
if (!sea) throw new Error('sea path (#D7E1F4) not found');
writeFileSync(
	'static/map-land.svg',
	`<svg xmlns="http://www.w3.org/2000/svg" width="595" height="842" viewBox="0 0 595 842" preserveAspectRatio="none">` +
		`<defs><mask id="land" maskUnits="userSpaceOnUse" x="0" y="0" width="595" height="842">` +
		`<rect width="595" height="842" fill="#fff"/>` +
		`<path fill-rule="evenodd" d="${sea[1]}" fill="#000"/></mask></defs>` +
		`<rect width="595" height="842" fill="#fff" mask="url(#land)"/></svg>\n`
);

console.log(`map-base.svg: ${removed} territory paths removed · map-land.svg: sea mask written`);
