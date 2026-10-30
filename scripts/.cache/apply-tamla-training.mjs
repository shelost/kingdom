import { editStory, makeInserter } from './story-ops.mjs';

const gyebek = { person: 'gyebek', chip: '#d9b13a' };
const dora = { person: 'yuridora', chip: '#ff9a3d' };
const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (o) => ({ kind: 'dialogue', ...o });

const TRAIN = [
	S('The dirt', '흙'),
	P(
		'He trains. Staff instead of a sword. Black volcanic dirt. The mountain is the only one watching.',
		'훈련한다. 칼 대신 막대. 검은 화산흙. 산만 본다.'
	),
	P('Between sets he looks north.', '한 세트 사이에, 북쪽을 본다.'),
	D({
		...gyebek,
		look: 'training',
		en: ['Again.'],
		lines: ['다시.']
	}),
	D({
		...dora,
		en: ['The staff, or the story.'],
		lines: ['막대냐, 이야기냐.']
	}),
	D({
		...gyebek,
		look: 'training',
		en: ['Both.'],
		lines: ['둘 다.']
	}),
	P(
		'He does not sit for the stories at first. He stands at the edge of the firelight and files them the way he files a count. Dora talks anyway.',
		'처음엔 이야기에 앉지 않는다. 불빛 가장자리에 서서, 숫자를 넣듯 넣는다. 도라는 그래도 말한다.'
	),
	P('Five years of mornings like that. The islanders notice. He does not.', '그런 아침이 오 년이다. 섬사람들은 알아챈다. 그는 모른다.')
];

editStory((story) => {
	const yuri = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Yuri Dora');
	if (!yuri) throw new Error('no Yuri Dora');
	const ins = makeInserter(yuri);
	const n = ins('Gyebek looks at the water the way he looked at a drill ground', TRAIN);
	if (n !== true) throw new Error(`insert failed: ${n}`);
	for (const b of yuri.blocks) {
		if (b.kind !== 'dialogue' || b.person !== 'gyebek') continue;
		if (b.look) continue;
		const t = (b.en ?? []).join(' ');
		if (t.includes('Where is this') || t.includes('How many days') || t.includes('Nine hundred') || t.includes('I am called') || t.includes('king’s colour') || t.includes('stone step')) continue;
		b.look = 'tamla';
	}
	return true;
});
console.log('applied tamla training beats');
