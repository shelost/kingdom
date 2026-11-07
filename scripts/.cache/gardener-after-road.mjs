import { editStory, find } from './story-ops.mjs';

const fall = [
	{ kind: 'scene', label: 'He Falls', ko: '쓰러지다' },
	{
		kind: 'p',
		html: 'The flower smell is the last thing his legs agree to. One more step. The ground comes up. White rags. The black headband in the dust. He cannot lift his chin.',
		ko: '꽃 냄새가 다리가 동의하는 마지막이다. 한 걸음 더. 땅이 올라온다. 흰 누더기. 먼지 속의 검은 머리띠. 턱을 들지 못한다.'
	},
	{
		kind: 'p',
		html: 'A shadow covers him. It does not move like a cloud. He thinks, so this is the end, and shuts his eyes.',
		ko: '그림자가 그를 덮는다. 구름처럼 움직이지 않는다. 그는 생각한다. 여기가 끝이구나. 눈을 감는다.'
	},
	{
		kind: 'p',
		html: 'The shadow kneels. It is a man, and the man is crying. Sara has watched the whole road from these rows. The cuff. The hoof. The ice. The red water. He is one of the three who keep a realm. From the field he can see a life. He cannot step out of it to stop one.',
		ko: '그림자가 무릎을 꿇는다. 남자다. 남자가 울고 있다. 사라는 이 고랑에서 길 전부를 보았다. 따귀. 발굽. 얼음. 붉은 물. 그는 한 세계를 지키는 셋 중 하나다. 밭에서는 한 인생이 보인다. 그것을 막으러 밭 밖으로 나갈 수는 없다.'
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['봤다.', '마당도. 강도. 갈래 전부.', '이 밭을 비우면 문이 닫혀.', '문이 닫히면 너를 되돌릴 꽃이 없어.'],
		en: ['I saw.', 'The yards. The rivers. Every fork.', 'If I leave this field, the gate closes.', 'If the gate closes, nothing brings you back.']
	},
	{
		kind: 'dialogue',
		person: 'sara',
		lines: ['…아방.', '왜 안 왔어.'],
		en: ['…Father.', 'Why didn’t you come.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['오면 네가 죽어.', '그래서 여기서 울었다.'],
		en: ['If I come, you die.', 'So I cried here.']
	},
	{
		kind: 'p',
		html: 'He carries the boy in and does not count a single bloom. Broth. Clean cloth. Days where the son only shakes. The white hemp comes off in strips.',
		ko: '아들을 안고 들어가, 꽃은 한 송이도 세지 않는다. 국. 깨끗한 천. 아들이 떨기만 하는 날들. 흰 베는 조각으로 벗겨진다.'
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['느 어멍.', '죽었어.', '까마귀가 먼저였다.'],
		en: ['Your mother.', 'She’s dead.', 'The crows got there first.']
	},
	{
		kind: 'dialogue',
		person: 'sara',
		lines: ['…뭐.', '아니.', '방금 그 물을—'],
		en: ['…What.', 'No.', 'I just came through the water—']
	},
	{
		kind: 'p',
		html: 'Sara does not soften it. He sets the flowers in a line on the dirt, the way he sets seeds, and he tells the plan in pieces.',
		ko: '사라는 부드럽게 하지 않는다. 씨앗을 놓듯 꽃을 흙 위에 늘어놓고, 계획을 조각으로 말한다.'
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['웃음꽃. 집이 서지 못할 때까지.', '울음꽃. 그다음.', '고랑 끝. 심장꽃. 식구가 식구를 먹는다.'],
		en: ['Laughing flower. Until the house cannot stand.', 'Weeping flower. After.', 'The end of the row. The heart. A family eats its own.']
	},
	{
		kind: 'dialogue',
		person: 'sara',
		lines: ['치안은.'],
		en: ['The magistrate.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['제 딸들 손에.', '그 뒤에 어미를. 뼈, 피, 살, 숨, 넋. 그 순서.', '회색 후드. 가짜 수염. 한쪽 눈만 회색으로 가려.', '칼은 넣지 마. 꽃이 칼이다.'],
		en: ['His daughters’ hands.', 'Then your mother. Bone, blood, flesh, breath, soul. That order.', 'Gray hood. Fake beard. A gray cloth over one eye.', 'No blade. The flowers are the blade.']
	},
	{
		kind: 'dialogue',
		person: 'sara',
		lines: ['…알겠어.', '문 열어 둬.'],
		en: ['…Alright.', 'Keep the gate open.']
	}
];

editStory((story) => {
	const en = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === 'Gardener');
	const blocks = en.blocks;

	const gate = blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith('Past the third water the living maps quit'));
	if (gate < 0) throw new Error('gate paragraph missing');
	const field = blocks.findIndex((b, i) => i > gate && b.kind === 'scene' && b.label === 'The Flower Field');
	if (field < 0) throw new Error('flower field missing');
	if (blocks.some((b) => b.label === 'He Falls')) throw new Error('already inserted');
	blocks.splice(field, 0, ...fall);

	const alive = find(en, 'Alive — or we bring her back.')[0];
	if (!alive) throw new Error('alive line missing');
	alive.b.en = ['We bring her back.', 'The order I showed you.'];
	alive.b.lines = ['되돌린다.', '내가 보여 준 순서로.'];

	const hood = find(en, 'Fake beard. Gray hood. Basket of flowers only.')[0];
	if (!hood) throw new Error('hood line missing');
	hood.b.en = ['Fake beard. Gray hood. A gray cloth over one eye.', 'Basket of flowers only. No blade. The flowers are the blade.'];
	hood.b.lines = ['가짜 수염. 회색 후드. 한쪽 눈만 회색으로 가려.', '바구니엔 꽃만. 칼은 넣지 마. 꽃이 칼이다.'];

	const party = find(en, 'He shows up at the magistrate’s house as a blind guest')[0];
	if (!party) throw new Error('party missing');
	party.b.html = party.b.html.replace(
		'Gray hood. A fake gray beard glued wrong on purpose',
		'Gray hood. A gray cloth over one eye. A fake gray beard glued wrong on purpose'
	);
	party.b.ko = party.b.ko.replace('회색 후드. 일부러', '회색 후드. 한쪽 눈의 회색 안대. 일부러');

	const heart = find(en, 'Only after the house has laughed itself raw')[0];
	if (!heart) throw new Error('heart missing');
	const hi = blocks.indexOf(heart.b);
	blocks.splice(hi + 1, 0,
		{
			kind: 'p',
			html: 'The daughters get to him first. The black robe comes off his shoulders in their fists. He is not a master anymore. He is quarry, and the heart-flower has given the hunt to his own house.',
			ko: '딸들이 먼저 닿는다. 검은 도포가 주먹 안에서 어깨를 벗어난다. 이제 상전이 아니다. 사냥감이다. 심장꽃이 사냥을 제 집에 넘겼다.'
		},
		{
			kind: 'p',
			html: 'It does not stop at him. Maids. Servants. Slaves. The daughters who are not covering their eyes. On the paper screens it is only shadow. Hands. Mouths. Silk going down. A house eating itself.',
			ko: '그에게서 멈추지 않는다. 시녀. 하인. 종. 눈을 가리지 않은 딸들. 병풍 위에서는 그림자뿐이다. 손. 입. 내려가는 비단. 집을 먹는 집.'
		}
	);

	const mother = find(en, '…Mother.')[0];
	if (!mother) throw new Error('mother line missing');
	const mi = blocks.indexOf(mother.b);
	blocks.splice(mi + 1, 0, {
		kind: 'p',
		html: 'He breaks. The one who did not cry in the rivers cries now. He gets his arms around her before she is steady, and she holds on, and the winter rose is crushed between them.',
		ko: '무너진다. 강에서는 울지 않던 아이가 이제 운다. 어미가 서기도 전에 팔을 감고, 어미도 붙잡고, 겨울 장미가 둘 사이에서 눌린다.'
	});

	const enough = find(en, 'Alive is enough.')[0];
	if (!enough) throw new Error('enough missing');
	const ei = blocks.indexOf(enough.b);
	blocks.splice(ei + 1, 0,
		{
			kind: 'dialogue',
			person: 'wongang',
			lines: ['용서한다.', '과거는 잊자.', '같이 살자. 영원히.', '내가 원하는 건 그뿐이야.'],
			en: ['I forgive you.', 'Let the past go.', 'Live with me. Forever.', 'That is all I want.']
		},
		{
			kind: 'p',
			html: 'She is crying when she says it. He cries harder. A god of the rows, ruined, and glad of it.',
			ko: '말하면서 운다. 그는 더 크게 운다. 고랑의 신이, 망가지고, 그것을 기뻐한다.'
		}
	);

	console.log('blocks', blocks.length);
});
