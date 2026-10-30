import { editStory, find } from './story-ops.mjs';

editStory((story) => {
	const seung = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Seung');
	if (!seung) throw new Error('no Seung');
	const hits = find(seung, 'So please… my friends… step aside');
	if (hits.length !== 1) throw new Error(`step aside hits: ${hits.length}`);
	const { list, i, b } = hits[0];
	if (b.kind !== 'dialogue' || b.person !== 'bidam') throw new Error('anchor is not Bidam');
	const next = list[i + 1];
	if (next?.kind === 'dialogue' && next.person === 'yushin' && (next.en ?? []).join(' ').includes('thousand different ways')) {
		console.log('already applied');
		return false;
	}
	list.splice(i + 1, 0, {
		kind: 'dialogue',
		chip: '#2A5FB8',
		person: 'yushin',
		en: ['<b>There are a thousand different ways to be wrong... but only one way to be right.</b>'],
		lines: ['<b>틀린 길은 천 가지요. 바른 길은 하나요.</b>']
	});
	const blood = find(seung, 'Blood is inevitable.');
	for (const h of blood) {
		if (h.b.kind !== 'dialogue' || h.b.person !== 'bidam') continue;
		h.b.en = (h.b.en ?? []).map((s) => (s.includes('Blood is inevitable') && !s.includes('<b>') ? `<b>${s}</b>` : s));
		h.b.lines = (h.b.lines ?? []).map((s) => (s.includes('피는 못 속인다') && !s.includes('<b>') ? `<b>${s}</b>` : s));
	}
	return true;
});
console.log('applied yushin one-way + bidam blood bold');
