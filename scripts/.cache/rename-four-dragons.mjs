import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../..', import.meta.url).pathname.replace(/\/$/, '');

function load(rel) {
	return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));
}
function save(rel, data) {
	writeFileSync(join(ROOT, rel), JSON.stringify(data, null, '\t') + '\n');
}
function remapKey(obj, oldK, newK) {
	if (!obj || !(oldK in obj) || oldK === newK) return;
	obj[newK] = obj[oldK];
	delete obj[oldK];
}

const storyPath = join(ROOT, 'src/lib/data/story.json');
const story = JSON.parse(readFileSync(storyPath, 'utf8'));
let hits = 0;
for (const ch of story) {
	if (ch.id !== 'seventh-invasion' || !ch.entries) continue;
	for (const e of ch.entries) {
		if (e.title !== 'Four Dragons') continue;
		e.title = 'Emperor';
		e.subtitle = '황제';
		hits++;
	}
}
writeFileSync(storyPath, JSON.stringify(story, null, '\t') + '\n');
console.log('story entries renamed', hits);

const widgets = load('src/lib/data/hidden-widgets.json');
let w = 0;
for (const item of Object.values(widgets)) {
	if (item && item.entryTitle === 'Four Dragons') {
		item.entryTitle = 'Emperor';
		w++;
	}
}
save('src/lib/data/hidden-widgets.json', widgets);
console.log('widgets', w);

const scores = load('src/lib/data/episode-scores.json');
const eps = scores.episodes ?? scores;
if (eps['seventh-invasion::Four Dragons']) {
	const rec = eps['seventh-invasion::Four Dragons'];
	rec.id = 'seventh-invasion::Emperor';
	rec.title = 'Emperor';
	rec.ko = '황제';
	eps['seventh-invasion::Emperor'] = rec;
	delete eps['seventh-invasion::Four Dragons'];
	save('src/lib/data/episode-scores.json', scores);
	console.log('episode-scores remapped');
}

const rel = load('src/lib/data/relation-scores.json');
function walkRel(o) {
	if (!o || typeof o !== 'object') return;
	if (Array.isArray(o)) {
		for (let i = 0; i < o.length; i++) {
			if (o[i] === 'Four Dragons') o[i] = 'Emperor';
			else walkRel(o[i]);
		}
		return;
	}
	if (o.title === 'Four Dragons') o.title = 'Emperor';
	for (const v of Object.values(o)) walkRel(v);
}
walkRel(rel);
save('src/lib/data/relation-scores.json', rel);
console.log('relation-scores walked');

const catalog = load('src/lib/data/poster-catalog.json');
const covers = load('src/lib/data/cover-picks.json');
const posters = load('src/lib/data/poster-picks.json');
remapKey(catalog, 'ch-seventh-invasion--emperor', 'ch-seventh-invasion--four-dragons');
remapKey(covers, 'ch-seventh-invasion--emperor', 'ch-seventh-invasion--four-dragons');
remapKey(posters, 'ch-seventh-invasion--emperor', 'ch-seventh-invasion--four-dragons');
save('src/lib/data/poster-catalog.json', catalog);
save('src/lib/data/cover-picks.json', covers);
save('src/lib/data/poster-picks.json', posters);

const oldDir = join(ROOT, 'static/posters/alts/ch-seventh-invasion--emperor');
const newDir = join(ROOT, 'static/posters/alts/ch-seventh-invasion--four-dragons');
if (existsSync(oldDir) && !existsSync(newDir)) {
	renameSync(oldDir, newDir);
	console.log('moved poster dir');
} else {
	console.log('poster dir', existsSync(oldDir), existsSync(newDir));
}
