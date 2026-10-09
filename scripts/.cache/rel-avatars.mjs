// One-off: point each painted relationship at its tenebrist board (static/rel_*.jpg).
import fs from 'node:fs';

const FILE = 'src/lib/relations.ts';
const IDS = [
	'rel-yushin-sunduk', 'rel-chunchu-munhee', 'rel-gotaso-pumsuk', 'rel-munmu-jayi',
	'rel-pumsuk-gumilwife', 'rel-jumong-sosuno', 'rel-xue-liu', 'rel-chunchu-euija',
	'rel-gesomun-chunchu', 'rel-yushin-bidam', 'rel-sunduk-bidam', 'rel-yushin-gyebek',
	'rel-chunchu-yushin', 'rel-euija-gyebek', 'rel-taizong-xuerengui', 'rel-gesomun-bojang',
	'rel-taizong-gaozong', 'rel-kingmu-euija', 'rel-chunchu-gotaso', 'rel-sunduk-chunmyung',
	'rel-seohyeon-yushin', 'rel-suro-heo'
];

let src = fs.readFileSync(FILE, 'utf8');
for (const id of IDS) {
	const board = `/rel_${id.replace(/^rel-/, '').replaceAll('-', '_')}.jpg`;
	const start = src.indexOf(`id: '${id}',`);
	if (start < 0) throw new Error(`missing ${id}`);
	const anchor = "entity: 'relationship',\n";
	const at = src.indexOf(anchor, start);
	const head = src.slice(start, at);
	if (head.includes('avatar:')) continue;
	const indent = src.slice(src.lastIndexOf('\n', at) + 1, at);
	const insertAt = at + anchor.length;
	src = `${src.slice(0, insertAt)}${indent}avatar: '${board}',\n${src.slice(insertAt)}`;
}
fs.writeFileSync(FILE, src);
console.log((src.match(/avatar: '\/rel_/g) ?? []).length, 'relationship boards');
