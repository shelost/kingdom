// One-off: copy the approved story key art into static/stories/{slug}/ as 2:1 centre crops.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cropArgs, HOUSE_RATIO } from '../crop-ratio.mjs';

const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const OUT = new URL('../../static/stories/', import.meta.url).pathname;

const ART = {
	husam: ['story-husam-buseoksa-v3', 'story-husam-wansan-v3', 'story-husam-naju-v3', 'story-husam-armour-v3', 'story-husam-surrender-v3'],
	chunchu: ['story-chunchu-beltbuckle-v3', 'story-chunchu-split-v3', 'story-chunchu-cage-v3', 'story-chunchu-warning-v3'],
	xiangyu: ['story-xiangyu-replace-v3', 'story-xiangyu-julu-v3', 'story-xiangyu-feast-v3', 'story-xiangyu-gaixia-v3', 'story-xiangyu-ferry-v3'],
	sijo: ['story-sijo-heshibi-v3', 'story-sijo-dowager-v3', 'story-sijo-xuanwu-v3', 'story-sijo-chenqiao-v3'],
	shahanshah: ['story-cyrus-herdsman-v3', 'story-cyrus-game-v3', 'story-cyrus-croesus-v3', 'story-cyrus-entry-v3'],
	khagan: ['story-khagan-sorghaghtani-v3', 'story-khagan-goryeo-v3', 'story-khagan-two-khans-v3', 'story-khagan-xiangyang-v3'],
	'command-line': ['story-cmd-garage', 'story-cmd-plane', 'story-cmd-parc', 'story-cmd-giant-face'],
	'lord-and-shepherd': ['story-david-elah', 'story-david-spear', 'story-david-nathan', 'story-david-absalom'],
	judges: ['story-judges-nebo', 'story-judges-jordan', 'story-judges-jericho', 'story-judges-gideon', 'story-judges-samson'],
	kings: ['story-kings-solomon', 'story-kings-carmel', 'story-kings-jezebel', 'story-kings-jerusalem']
};

function install(slug, src, short) {
	const dir = join(OUT, slug);
	mkdirSync(dir, { recursive: true });
	const dest = join(dir, `${short}.jpg`);
	if (existsSync(dest) && process.argv[2] !== '--all') return;
	copyFileSync(src, dest);
	const crop = cropArgs(dest, HOUSE_RATIO);
	if (crop.length) execFileSync('sips', [...crop, dest], { stdio: 'ignore' });
	console.log(`${slug}/${short}.jpg`);
}

for (const [slug, files] of Object.entries(ART)) {
	for (const name of files) {
		const src = join(ASSETS, `${name}.jpg`);
		if (!existsSync(src)) {
			console.warn(`missing ${src}`);
			continue;
		}
		install(slug, src, name.replace(/^story-[a-z]+-/, '').replace(/-v3$/, ''));
	}
}

/* Later batches are named `{slug}__{short}.jpg`. */
for (const file of readdirSync(ASSETS)) {
	const m = /^([a-z-]+)__([a-z0-9-]+)\.jpg$/.exec(file);
	if (m) install(m[1], join(ASSETS, file), m[2]);
}
