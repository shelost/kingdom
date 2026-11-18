import { readFileSync } from 'node:fs';
const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
for (const ch of story.chapters || story) {
	for (const en of ch.entries || []) {
		if (!en.thumbnail) continue;
		const log = (en.logline?.en || '').replace(/\s+/g, ' ').slice(0, 110);
		console.log(`${en.subtitle || en.title}  ·  ${en.thumbnail}  ·  ${log}`);
	}
}
