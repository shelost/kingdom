// Lists Goguryeo speakers who name Jumong / Daemusin / Gwanggaeto instead of using the epithet.
// Usage: node scripts/.cache/audit-goguryeo-kings.mjs
import fs from 'node:fs';

const story = JSON.parse(fs.readFileSync('src/lib/data/story.json', 'utf8'));
const peopleSrc = fs.readFileSync('src/lib/people.ts', 'utf8');

const goguryeo = new Set();
for (const m of peopleSrc.matchAll(/id: '([\w-]+)',[\s\S]*?kingdom: '(\w+)'/g)) {
	if (m[2] === 'goguryeo') goguryeo.add(m[1]);
}

const NAMES = /Jumong|Dongmyeong|Dongmyung|Gwanggaeto|Daemusin|주몽|동명|광개토|대무신/;

function walk(blocks, title, path) {
	blocks.forEach((b, i) => {
		const p = `${path}${i}`;
		if (b.blocks) walk(b.blocks, title, `${p}.`);
		if (b.kind !== 'dialogue' && b.kind !== 'monologue') return;
		if (!goguryeo.has(b.person)) return;
		const text = [...(b.lines ?? []), ...(b.en ?? []), b.html ?? '', b.ko ?? ''].join(' | ');
		if (NAMES.test(text)) console.log(`[${title}] #${p} ${b.person}: ${text.replace(/<[^>]+>/g, '')}`);
	});
}

for (const entry of story.flatMap((c) => c.entries ?? [])) walk(entry.blocks ?? [], entry.title, '');
