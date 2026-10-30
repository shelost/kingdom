import { editStory } from './story-ops.mjs';
import fs from 'node:fs';

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Bihyungnang');
	if (!e) throw new Error('Bihyungnang entry missing');
	e.title = 'Bihyung';
	console.log('story title → Bihyung; subtitle', e.subtitle);
});

function swapFile(path, from, to) {
	const raw = fs.readFileSync(path, 'utf8');
	if (!raw.includes(from)) return console.log('skip', path);
	fs.writeFileSync(path, raw.replaceAll(from, to));
	console.log('swapped', path);
}

swapFile('src/lib/data/key-events.json', '"ep": "Bihyungnang"', '"ep": "Bihyung"');
swapFile('src/lib/lifeArcs.ts', "episode: 'Bihyungnang'", "episode: 'Bihyung'");
swapFile('src/lib/data/line-stars.json', '"entryTitle": "Bihyungnang"', '"entryTitle": "Bihyung"');
swapFile('src/lib/data/episode-story-notes.json', '"Bihyungnang":', '"Bihyung":');
swapFile('src/lib/data/episode-story.json', 'Bihyungnang', 'Bihyung');
