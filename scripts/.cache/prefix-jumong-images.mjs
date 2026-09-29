/**
 * Prefix every Jumong-chapter image id with jumong- (nsfw- → nsfw-jumong-).
 * Renames story slots, temp files, movie sequence shots, people gallery keys.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const PEOPLE_JSON = path.join(ROOT, 'src/lib/data/image-people.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const PEOPLE_TS = path.join(ROOT, 'src/lib/people.ts');
const TEMP = path.join(ROOT, 'static/temp');

function nextId(id) {
	if (id.startsWith('jumong-') || id.startsWith('jumong_')) return id;
	if (id.startsWith('nsfw-jumong-')) return id;
	if (id.startsWith('nsfw-')) return `nsfw-jumong-${id.slice(5)}`;
	return `jumong-${id}`;
}

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const jumong = story.find((c) => c.id === 'jumong')?.entries?.find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong entry missing');

const map = new Map();
for (const im of jumong.images) {
	const n = nextId(im.id);
	if (n !== im.id) map.set(im.id, n);
}

function rewriteTempPath(p) {
	if (typeof p !== 'string') return p;
	return p.replace(/\/temp\/([^/?#]+)\.(jpg|png|webp)/g, (full, name, ext) => {
		const n = map.get(name);
		return n ? `/temp/${n}.${ext}` : full;
	});
}

let renamedFiles = 0;
for (const [oldId, newId] of map) {
	for (const ext of ['jpg', 'png', 'webp']) {
		const from = path.join(TEMP, `${oldId}.${ext}`);
		const to = path.join(TEMP, `${newId}.${ext}`);
		if (!fs.existsSync(from)) continue;
		if (fs.existsSync(to)) {
			console.warn('skip file clash', to);
			continue;
		}
		fs.renameSync(from, to);
		renamedFiles++;
	}
}

for (const im of jumong.images) {
	const n = map.get(im.id);
	if (n) im.id = n;
	if (im.tempImage) im.tempImage = rewriteTempPath(im.tempImage);
	if (im.src) im.src = rewriteTempPath(im.src);
	if (Array.isArray(im.refs)) im.refs = im.refs.map(rewriteTempPath);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const people = JSON.parse(fs.readFileSync(PEOPLE_JSON, 'utf8'));
const nextPeople = {};
for (const [k, v] of Object.entries(people)) {
	nextPeople[map.get(k) || k] = v;
}
fs.writeFileSync(PEOPLE_JSON, JSON.stringify(nextPeople, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const keys = [...map.keys()].sort((a, b) => b.length - a.length);
for (const oldId of keys) {
	const n = map.get(oldId);
	seq = seq.split(`'${oldId}'`).join(`'${n}'`);
	seq = seq.split(`"${oldId}"`).join(`"${n}"`);
}
fs.writeFileSync(SEQ, seq);

let pts = fs.readFileSync(PEOPLE_TS, 'utf8');
for (const oldId of keys) {
	const n = map.get(oldId);
	pts = pts.split(`/temp/${oldId}.jpg`).join(`/temp/${n}.jpg`);
	pts = pts.split(`/temp/${oldId}.png`).join(`/temp/${n}.png`);
}
fs.writeFileSync(PEOPLE_TS, pts);

console.log(
	JSON.stringify(
		{
			ids: map.size,
			files: renamedFiles,
			samples: [...map.entries()].slice(0, 8)
		},
		null,
		2
	)
);
