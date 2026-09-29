import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { A } from './scene-lines-1.mjs';
import { B } from './scene-lines-2.mjs';
import { C } from './scene-lines-3.mjs';
import { D } from './scene-lines-4.mjs';

const ALL = { ...A, ...B, ...C, ...D };

function fit(lines, n) {
	const next = lines.slice();
	if (next.length > n) {
		const drop = next.length - n;
		const mid = Math.floor(next.length / 2);
		const start = Math.max(1, mid - Math.floor(drop / 2));
		next.splice(start, drop);
	}
	while (next.length < n) {
		next.splice(Math.max(0, next.length - 1), 0, next[next.length - 1]);
	}
	return next;
}

const dir = new URL('../../src/lib/data/lyrics/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const missing = [];

for (const file of files) {
	const id = file.replace(/\.json$/, '');
	const path = new URL(file, dir);
	const data = JSON.parse(readFileSync(path, 'utf8'));
	const want = data.lines.length;
	if (!ALL[id]) {
		missing.push(id);
		continue;
	}
	const scene = fit(ALL[id], want);
	if (scene.length !== want) throw new Error(`${id} fit failed`);
	for (let i = 0; i < want; i++) data.lines[i].scene = scene[i];
	writeFileSync(path, JSON.stringify(data, null, '\t') + '\n');
	console.log(id, want);
}

if (missing.length) {
	console.error('missing', missing.join(', '));
	process.exit(1);
}
