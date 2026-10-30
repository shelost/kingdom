/** Rename episode titles + in-world "the Severing"; migrate General chapter poster id. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');

function load(rel) {
	return JSON.parse(readFileSync(resolve(ROOT, rel), 'utf8'));
}
function save(rel, data) {
	writeFileSync(resolve(ROOT, rel), JSON.stringify(data, null, '\t') + '\n');
}

const story = load('src/lib/data/story.json');

function walk(node, fn) {
	if (Array.isArray(node)) {
		for (const item of node) walk(item, fn);
		return;
	}
	if (!node || typeof node !== 'object') return;
	fn(node);
	for (const v of Object.values(node)) walk(v, fn);
}

let titles = 0;
let strings = 0;

walk(story, (obj) => {
	if (obj.title === 'The Severing') {
		obj.title = 'Gwansan';
		titles++;
		if (obj.subtitle === '단 (斷)') obj.subtitle = '관산';
	}
	if (obj.title === 'Forty Fortresses') {
		obj.title = 'Yushin';
		titles++;
		if (obj.subtitle === '마흔 성') obj.subtitle = '유신';
	}
	if (obj.term === 'The Severing') {
		obj.term = 'Gwansan';
		if (obj.hanja === '斷') obj.hanja = '管山';
		if (obj.reading === '단') obj.reading = '관산';
	}
	if (obj.label === 'The Severing') {
		obj.label = 'Gwansan';
		if (obj.ko === '단절') obj.ko = '관산';
	}
	for (const [k, v] of Object.entries(obj)) {
		if (typeof v !== 'string') continue;
		let next = v
			.replaceAll('The Severing', 'Gwansan')
			.replaceAll('the Severing', 'Gwansan')
			.replaceAll('斷이 뭡니까', '관산이 뭡니까')
			.replaceAll('斷이다', '관산이다')
			.replaceAll('斷이 왔다', '관산이 왔다')
			.replaceAll('그게 斷이여', '그게 관산이여')
			.replaceAll('그 斷 말입니다', '그 관산 말입니다')
			.replaceAll('단이라 부르지', '관산이라 부르지')
			.replaceAll('단(斷)이라 부른다', '관산이라 부른다');
		if (next !== v) {
			obj[k] = next;
			strings++;
		}
	}
});

save('src/lib/data/story.json', story);
console.log(`story.json: ${titles} titles, ${strings} string fields`);

const OLD = 'ch-iron-will--kim-yushin';
const NEW = 'ch-iron-will--general';
const oldDir = resolve(ROOT, 'static/posters/alts', OLD);
const newDir = resolve(ROOT, 'static/posters/alts', NEW);
if (existsSync(oldDir) && !existsSync(newDir)) {
	renameSync(oldDir, newDir);
	console.log(`moved posters ${OLD} → ${NEW}`);
} else if (existsSync(newDir)) {
	console.log(`poster dir already ${NEW}`);
} else {
	console.log('poster dir missing; skip move');
}

function remapKey(rel, keepValue = true) {
	const data = load(rel);
	if (OLD in data) {
		data[NEW] = data[OLD];
		delete data[OLD];
		save(rel, data);
		console.log(`remapped key in ${rel}`);
	} else {
		console.log(`no ${OLD} in ${rel}`);
	}
}

remapKey('src/lib/data/poster-catalog.json');
remapKey('src/lib/data/cover-picks.json');
remapKey('src/lib/data/poster-picks.json');

const summaries = load('src/lib/data/scene-summaries.json');
const sumOut = {};
let sumN = 0;
for (const [k, v] of Object.entries(summaries)) {
	let nk = k
		.replace(/^five-principles-the-severing/, 'five-principles-gwansan')
		.replace(/^iron-will-forty-fortresses/, 'iron-will-yushin');
	if (nk !== k) sumN++;
	if (v && typeof v.en === 'string') {
		v.en = v.en.replaceAll('the Severing', 'Gwansan').replaceAll('The Severing', 'Gwansan');
	}
	if (v && typeof v.ko === 'string') {
		v.ko = v.ko.replaceAll('단절', '관산');
	}
	sumOut[nk] = v;
}
save('src/lib/data/scene-summaries.json', sumOut);
console.log(`scene-summaries: ${sumN} keys`);

const scores = load('src/lib/data/episode-scores.json');
if (scores['five-principles::The Severing']) {
	const e = scores['five-principles::The Severing'];
	e.id = 'five-principles::Gwansan';
	e.title = 'Gwansan';
	scores['five-principles::Gwansan'] = e;
	delete scores['five-principles::The Severing'];
}
if (scores['iron-will::Forty Fortresses']) {
	const e = scores['iron-will::Forty Fortresses'];
	e.id = 'iron-will::Yushin';
	e.title = 'Yushin';
	scores['iron-will::Yushin'] = e;
	delete scores['iron-will::Forty Fortresses'];
}
save('src/lib/data/episode-scores.json', scores);

const rel = load('src/lib/data/relation-scores.json');
function walkRel(n) {
	if (Array.isArray(n)) n.forEach(walkRel);
	else if (n && typeof n === 'object') {
		if (n.title === 'The Severing') n.title = 'Gwansan';
		if (n.title === 'Forty Fortresses') n.title = 'Yushin';
		for (const [k, v] of Object.entries(n)) {
			if (Array.isArray(v)) n[k] = v.map((x) => (x === 'The Severing' ? 'Gwansan' : x === 'Forty Fortresses' ? 'Yushin' : x));
			else walkRel(v);
		}
	}
}
walkRel(rel);
save('src/lib/data/relation-scores.json', rel);

console.log('json remaps done');
