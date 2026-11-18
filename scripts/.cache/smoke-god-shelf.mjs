import { filterProfiles, groupByGodShelf } from '../../src/lib/wiki.ts';

const gods = filterProfiles({
	kind: 'god',
	sub: 'all',
	kingdom: 'all',
	tag: 'all',
	story: 'all',
	gender: 'all',
	art: 'all',
	q: ''
});
const sections = groupByGodShelf(gods);
for (const s of sections) {
	console.log(s.title, `(${s.items.length})`);
	for (const g of s.subgroups) {
		console.log(
			'  -',
			g.title || '(ungrouped)',
			g.items.length,
			g.items.map((p) => p.wikiName ?? p.name).join(', ')
		);
	}
}
