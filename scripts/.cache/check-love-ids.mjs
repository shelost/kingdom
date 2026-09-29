import { readFileSync } from 'node:fs';
import { LOVE_EPISODE_IDS } from '../src/lib/loveEpisodes.ts';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));
const chapters = Array.isArray(story) ? story : story.chapters;

function entrySlug(title) {
	return title
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['’‘]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function entryId(chapterId, title) {
	return `${chapterId}-${entrySlug(title)}`;
}

const titles = [
	'Dangun & Old Joseon',
	'Jumong',
	'Gaya, the Lost Nations',
	'Queen Sunduk',
	'Gotaso’s Wedding',
	'Harbour Ledgers',
	'Longmen Field'
];

for (const c of chapters) {
	for (const e of c.entries || []) {
		if (!titles.includes(e.title) && !/Gotaso/.test(e.title)) continue;
		const id = entryId(c.id, e.title);
		console.log(LOVE_EPISODE_IDS.has(id) ? '✓' : '✗', id, e.title);
	}
}
console.log('set size', LOVE_EPISODE_IDS.size);
