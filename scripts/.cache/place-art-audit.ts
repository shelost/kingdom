import fs from 'node:fs';
import story from '../../src/lib/data/story.json';
import { PLACES } from '../../src/lib/places';

const ids: string[] = [];
const walk = (o: unknown) => {
	if (Array.isArray(o)) return o.forEach(walk);
	if (o && typeof o === 'object') {
		const r = o as Record<string, unknown>;
		if (r.kind === 'place' && typeof r.place === 'string') ids.push(r.place);
		Object.values(r).forEach(walk);
	}
};
walk(story);
const files = fs.readdirSync('static').filter((f) => f.startsWith('pl_'));
const exists = (p?: string) => !!p && fs.existsSync(`static/${p.replace(/^\//, '').split('?')[0]}`);
console.log('place blocks', ids.length, 'unique', new Set(ids).size);
for (const id of new Set(ids)) {
	const p = PLACES[id];
	if (!p) { console.log('MISSING PLACE', id); continue; }
	const ok = exists(p.avatar);
	const gal = (p.gallery ?? []).find(exists);
	const guess = files.filter((f) => f.startsWith(`pl_${id}`));
	if (!ok) console.log('NO AVATAR', id, '| avatar:', p.avatar ?? '-', '| gallery:', gal ?? '-', '| static guess:', guess.join(',') || '-');
}
