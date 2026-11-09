import fs from 'node:fs';
const p = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(p, 'utf8'));
const chapters = Array.isArray(story) ? story : Object.values(story);
let n = 0;
for (const ch of chapters) {
	for (const en of ch.entries ?? []) {
		for (const im of en.images ?? []) {
			if (im.id !== 'hek-wind-cut') continue;
			const cut = String(im.prompt).indexOf(' SWORD ANATOMY');
			if (cut > 0) im.prompt = im.prompt.slice(0, cut);
			im.refs = ['/ch_wind_sage.png'];
			im.style = 'ink';
			n++;
		}
	}
}
if (n !== 1) {
	console.error('found', n);
	process.exit(1);
}
fs.writeFileSync(p, JSON.stringify(story, null, '\t') + '\n');
console.log('patched wind');
