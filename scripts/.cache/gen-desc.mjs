// Prints GenerateImage inputs for slot ids: absolute refs + the slot prompt with the long house suffix swapped for heewon-short.txt.
// Usage: node scripts/.cache/gen-desc.mjs id [id...]
import fs from 'node:fs';
import path from 'node:path';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const suffix = JSON.parse(fs.readFileSync('src/lib/data/image-prompt-house.json', 'utf8')).suffix;
const short = fs.readFileSync('scripts/.cache/heewon-short.txt', 'utf8').trim();
const slots = new Map(story.flatMap((ch) => (ch.entries ?? []).flatMap((en) => (en.images ?? []).map((im) => [im.id, im]))));

for (const id of process.argv.slice(2)) {
	const im = slots.get(id);
	if (!im) throw new Error(`no slot ${id}`);
	const body = (im.prompt ?? '').replace(suffix, '').trim();
	const refs = (im.refs ?? []).map((r) => path.resolve('static', r.replace(/^\//, '')));
	const missing = refs.filter((r) => !fs.existsSync(r));
	if (missing.length) throw new Error(`${id}: missing refs ${missing.join(', ')}`);
	console.log(JSON.stringify({ id, refs, description: `HEEWON STYLE. ${body} ${short}` }));
}
