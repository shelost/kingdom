import { editStory, find } from './story-ops.mjs';

const gyebek = { person: 'gyebek', chip: '#d9b13a' };
const dora = { person: 'yuridora', chip: '#ff9a3d' };
const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (o) => ({ kind: 'dialogue', ...o });

const TRAIN = [
	S('The dirt', '흙'),
	P(
		'He finds what the island already has. A boulder the size of a horse. Trees. A staff. That is the yard.',
		'섬이 이미 가진 걸로 한다. 말만 한 바위. 나무. 막대. 그게 연병장이다.'
	),
	P(
		'The first morning the rock does not move. His arms are a soldier’s, not a labourer’s. Ribs. A little muscle from the river years. He hits it anyway.',
		'첫날 아침, 돌은 안 움직인다. 병사 팔이지 일꾼 팔이 아니다. 갈비. 강가에서 남은 조금의 힘. 그래도 친다.'
	),
	D({
		...dora,
		en: ['That stone’s been here longer than my house.'],
		lines: ['그 돌은 우리 집보다 오래여.']
	}),
	D({
		...gyebek,
		look: 'training-early',
		en: ['Again.'],
		lines: ['다시.']
	}),
	P(
		'Staff instead of a sword. Black volcanic dirt. The mountain is the only one counting.',
		'칼 대신 막대. 검은 화산흙. 세는 건 산뿐이다.'
	),
	P('Between sets he looks north.', '한 세트 사이에, 북쪽을 본다.'),
	D({
		...dora,
		en: ['The staff, or the story.'],
		lines: ['막대냐, 이야기냐.']
	}),
	D({
		...gyebek,
		look: 'training-early',
		en: ['Both.'],
		lines: ['둘 다.']
	}),
	P(
		'He does not sit for the stories at first. He stands at the edge of the firelight and files them the way he files a count. Dora talks anyway.',
		'처음엔 이야기에 앉지 않는다. 불빛 가장자리에 서서, 숫자를 넣듯 넣는다. 도라는 그래도 말한다.'
	),
	P(
		'A year. He can put two fingers in the crack. His shoulders have started to mean it.',
		'일 년. 금에 손가락 두 개가 들어간다. 어깨가 이제 제 일을 한다.'
	),
	D({
		...dora,
		en: ['You’re going to lose that mountain a tree.'],
		lines: ['산 나무 하나 없어지켄다.']
	}),
	D({
		...gyebek,
		look: 'training-mid',
		en: ['The tree is in the way.'],
		lines: ['나무가 길을 막고 있습니다.']
	}),
	P(
		'Another year. He takes the trees down with the staff until they stop being trees. The goats find another slope.',
		'또 일 년. 막대로 나무를 내려, 나무가 아니게 만든다. 염소들은 다른 비탈을 찾는다.'
	),
	P('Five years of mornings like that.', '그런 아침이 오 년이다.'),
	P(
		'The boulder is pebbles. A ring of them where the horse-sized rock sat. Stumps as far as the dirt goes. The yard has a new shape, and it is his.',
		'바위는 자갈이다. 말만 하던 돌이 앉던 자리에 고리처럼. 흙이 닿는 데까지 그루터기. 연병장 모양이 바뀌었다. 그의 것이다.'
	),
	P('The islanders notice. He does not.', '섬사람들은 알아챈다. 그는 모른다.')
];

editStory((story) => {
	const yuri = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Yuri Dora');
	if (!yuri) throw new Error('no Yuri Dora');
	const start = find(yuri, 'The dirt');
	const end = find(yuri, 'Five years of mornings like that');
	if (start.length !== 1) throw new Error(`The dirt hits: ${start.length}`);
	if (end.length !== 1) throw new Error(`Five years hits: ${end.length}`);
	if (start[0].list !== end[0].list) throw new Error('dirt / five years not in the same list');
	const { list, i } = start[0];
	const j = end[0].i;
	list.splice(i, j - i + 1, ...TRAIN);
	return true;
});
console.log('applied tamla training progress');
