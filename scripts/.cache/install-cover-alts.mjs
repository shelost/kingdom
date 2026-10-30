#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cropArgs } from '../crop-ratio.mjs';

const ROOT = new URL('../..', import.meta.url).pathname;
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const CATALOG = join(ROOT, 'src/lib/data/poster-catalog.json');
const COVER_PICKS = join(ROOT, 'src/lib/data/cover-picks.json');
const POSTER_PICKS = join(ROOT, 'src/lib/data/poster-picks.json');

const ITEMS = [
	['ch-fall-of-euija--three-loyalists', 'silhouette.jpg', 'loyalists-silhouette.jpg'],
	['ch-fall-of-euija--three-loyalists', 'shadows.jpg', 'loyalists-shadows.jpg'],
	['ch-fall-of-euija--three-loyalists', 'row.jpg', 'loyalists-row.jpg'],
	['ch-fall-of-euija--three-loyalists', 'gomanari.jpg', 'loyalists-gomanari.jpg'],
	['ch-fall-of-euija--three-loyalists', 'gomanari-stand.jpg', 'loyalists-gomanari-stand.jpg'],
	['ch-fall-of-euija--three-loyalists', 'walk.jpg', 'loyalists-three-walk.jpg'],
	['ch-samhan--baekje', 'onjo.jpg', 'baekje-onjo.jpg'],
	['ch-samhan--baekje', 'yellow-hall.jpg', 'baekje-yellow-hall.jpg'],
	['ch-five-principles--five-princes', 'five-row.jpg', 'princes-five-row.jpg'],
	['ch-five-principles--five-princes', 'rift.jpg', 'princes-rift.jpg'],
	['ch-chunchu-era--chunchu', 'magenta.jpg', 'chunchu-magenta-ridge.jpg'],
	['ch-chunchu-era--chunchu', 'fox.jpg', 'chunchu-fox.jpg'],
	['ch-fall-of-euija--tamla', 'halla.jpg', 'tamla-halla.jpg'],
	['ch-fall-of-euija--euija', 'prisoner.jpg', 'euija-prisoner-v2.jpg'],
	['ch-fall-of-euija--euija', 'papers.jpg', 'euija-papers-v2.jpg'],
	['ch-fall-of-euija--euija', 'empty-throne.jpg', 'euija-empty-throne.jpg'],
	['ch-chunchu-era--hyukgos', 'egg.jpg', 'hyukgose-egg.jpg'],
	['ch-chunchu-era--hyukgos', 'crowning.jpg', 'hyukgose-crowning-v2.jpg'],
	['ch-silla-tang-war--king-for-all', 'triad.jpg', 'kingforall-triad.jpg'],
	['ch-silla-tang-war--king-for-all', 'thirds.jpg', 'kingforall-thirds.jpg'],
	['ch-silla-tang-war--king-for-all', 'night-unity.jpg', 'kingforall-night.jpg']
];

const catalog = JSON.parse(readFileSync(CATALOG, 'utf8'));

for (const [chapter, destName, srcName] of ITEMS) {
	const src = join(ASSETS, srcName);
	if (!existsSync(src)) throw new Error(`missing ${src}`);
	const destDir = join(ROOT, 'static/posters/alts', chapter);
	mkdirSync(destDir, { recursive: true });
	const dest = join(destDir, destName);
	copyFileSync(src, dest);
	const crop = cropArgs(dest, 3 / 4);
	if (crop.length) execFileSync('sips', [...crop, dest]);
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', dest]);
	const list = catalog[chapter] ?? (catalog[chapter] = []);
	if (!list.includes(destName)) list.push(destName);
	console.log(chapter, destName, execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', dest], { encoding: 'utf8' }).trim());
}

writeFileSync(CATALOG, JSON.stringify(catalog, null, '\t') + '\n');

const live = 'ch-silla-tang-war--king-for-all';
const liveFile = 'night-unity.jpg';
for (const p of [COVER_PICKS, POSTER_PICKS]) {
	const picks = JSON.parse(readFileSync(p, 'utf8'));
	picks[live] = liveFile;
	writeFileSync(p, JSON.stringify(picks, null, '\t') + '\n');
}
console.log('live', live, liveFile);
