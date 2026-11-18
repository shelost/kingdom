import { readFileSync, writeFileSync } from 'node:fs';
const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));
const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Gyul');
e.images = e.images.filter((im) => im.id !== 'gyul-yard-cut');
writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('cut slot dropped');
