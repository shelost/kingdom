import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function findEntry(title) {
	for (const a of story)
		for (const e of a.entries || []) if (e.title === title) return e;
	throw new Error('missing ' + title);
}

// Alchun: drop modern 참고로
{
	const e = findEntry('Bupmin');
	let n = 0;
	for (const b of e.blocks) {
		if (b.kind !== 'flashback') continue;
		for (const x of b.blocks) {
			if (x.kind === 'dialogue' && x.person === 'alchun' && x.lines?.[0]?.startsWith('참고로')) {
				x.en = ['You’re welcome.'];
				x.lines = ['고맙다는 말은 내가 먼저 안 한다.'];
				n++;
			}
		}
	}
	if (!n) throw new Error('alchun line not patched');
}

// Euija: section name clash with scene The Rock
{
	const e = findEntry('King Euija');
	const sec = e.blocks.find((b) => b.kind === 'section' && b.label === 'The Rock');
	if (!sec) throw new Error('Euija section');
	sec.label = 'The Morning';
	sec.ko = '아침';
}

// Stele: hill first, then the house
{
	const e = findEntry('The Stele');
	if (e.blocks[0]?.kind !== 'section') {
		e.blocks.splice(0, 0, { kind: 'section', label: 'The Stone', ko: '비' });
	}
}

// Gwanggaeto Southern Hall: don't repeat the cliff's water/stone
{
	const e = findEntry('King Gwanggaeto');
	const cap = e.blocks.find(
		(b) =>
			b.kind === 'dialogue' &&
			b.speaker === 'A Baekje captain' &&
			b.en?.[0] === 'The water is ours.'
	);
	if (!cap) throw new Error('southern hall captain');
	cap.en = ['The hall holds.'];
	cap.lines = ['전각은 버팁니다.'];
	const i = e.blocks.indexOf(cap);
	const g1 = e.blocks[i + 1];
	const c2 = e.blocks[i + 2];
	const g2 = e.blocks[i + 3];
	if (g1?.person !== 'gwanggaeto' || c2?.speaker !== 'A Baekje captain' || g2?.person !== 'gwanggaeto')
		throw new Error('southern hall dialogue shape');
	g1.en = ['The bank first.'];
	g1.lines = ['강변부터.'];
	c2.en = ['If you take the bank, the hall starves.'];
	c2.lines = ['강변을 가져가면, 전각이 굶습니다.'];
	g2.en = ['Then it will open.'];
	g2.lines = ['그럼 열리겠지.'];
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('patched');
