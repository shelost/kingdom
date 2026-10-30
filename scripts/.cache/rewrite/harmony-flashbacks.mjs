// Harmony Council: split the one big 632 flashback into three and interleave them with Jade Gate Valley.
//   yard (636) → council night (632) → valley approach → Jinji's deposition + night bridge (579/612)
//   → the fight and the rock → the peonies (632) → the queen's door.
import { editStory } from '../story-ops.mjs';

const COUNCILLOR = { chip: '#8a7f6a', speaker: 'The High Councillor', gender: 'm' };

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (who, en, lines) => ({ kind: 'dialogue', ...(typeof who === 'string' ? { person: who } : who), en, lines });

const plain = (b) => (b?.html ?? (b?.en ?? []).join(' ') ?? '').replace(/<[^>]+>/g, '');
const findIdx = (blocks, test, what) => {
	const i = blocks.findIndex(test);
	if (i < 0) throw new Error(`Harmony Council: no ${what}`);
	return i;
};

const COMMITTEE = p(
	'Alchun has opinions about committees. Every lord in Surabol does. They grew up on the one that unmade a king.',
	'알천은 회의라면 할 말이 많다. 서라벌 귀족이라면 다 그렇다. 임금 하나를 무른 회의 얘기를 듣고 자랐으니까.'
);

const FLOWERS = p(
	'In Surabol the queen is waiting for a number. She will not be surprised by it. Nobody has surprised her since the flowers.',
	'서라벌에서 여왕은 숫자 하나를 기다린다. 그 숫자에 놀라지는 않을 것이다. 그 꽃 이후로 그녀를 놀라게 한 사람은 없다.'
);

const DEPOSITION = [
	{ kind: 'scene', label: 'The Same Pavilion', ko: '그 정자' },
	p(
		'Same pavilion. Same pond. Same brazier. Fifty-three winters before Dukman’s night, six sleeves sat here and did the opposite.',
		'같은 정자, 같은 연못, 같은 화로. 덕만의 밤보다 쉰세 해 앞서, 여섯 소매가 여기 앉아 정반대의 일을 했다.'
	),
	p(
		'The king they are counting has had the throne four years, and he is one corridor away. Nobody invited him. In this room a king is not a guest. He is the question.',
		'그들이 세는 왕은 왕좌에 앉은 지 네 해째이고, 복도 하나 건너에 있다. 아무도 그를 부르지 않았다. 이 방에서 왕은 손님이 아니다. 안건이다.'
	),
	p(
		'The charge has a woman in it. Dohwa, a married woman of the city, told the king that a wife does not serve two husbands. The king asked what would happen if her husband were dead. The city has been asking the same thing ever since.',
		'죄목엔 여인이 하나 끼어 있다. 도성의 유부녀 도화는 왕에게, 계집은 두 지아비를 섬기지 않는다고 했다. 왕은 물었다. 그럼 지아비가 죽으면 어떠냐고. 도성은 그 뒤로 내내 같은 걸 묻고 있다.'
	),
	p(
		'Nobody in the pavilion says her name. They say “misconduct,” which is cheaper.',
		'정자 안에서 그 이름을 입에 올리는 사람은 없다. 다들 ‘부덕’이라고 한다. 그쪽이 싸게 먹히니까.'
	),
	p(
		'The brazier goes red, then blue. The first count goes on the cups: six pieces on the no side. Nobody needs to argue, and nobody does.',
		'화로가 붉었다가 푸르러진다. 첫 셈이 잔 옆에 놓인다. 여섯 말이 모두 아니오 쪽이다. 따질 필요가 없고, 아무도 따지지 않는다.'
	),
	p('Then the door opens. The king has come to his own count, which is not done.', '그때 문이 열린다. 왕이 제 셈을 보러 왔다. 그러는 법이 아니다.'),
	say(
		'jinji',
		['You would unseat a Sacred Bone for a night’s rumor?', '…Say her name, then. One of you.'],
		['하룻밤 소문에 성골을 끌어내리겠다는 게냐?', '…그럼 이름을 대 봐라. 누구라도.']
	),
	say(COUNCILLOR, ['We are not here about the woman, Majesty.', 'We are here about the next one.'], ['그 여인 일로 모인 게 아니옵니다, 마마.', '그다음 여인 일로 모였사옵니다.']),
	say('jinji', ['Then I’ll sit. A king may sit in his own—'], ['그럼 앉겠다. 제 나라 정자에 임금이—']),
	say(COUNCILLOR, ['Not on that mat, Majesty. That one votes.'], ['그 자리는 아니 되옵니다, 마마. 그 자리는 표를 던지는 자리옵니다.']),
	p(
		'He stands through the deliberation, and through the final count. Six pieces stay where they are. The brazier stays blue. It is very quiet, for a thing that ends a reign.',
		'그는 선 채로 의논을 듣고, 마지막 셈을 본다. 여섯 말은 제자리에 있다. 화로는 푸른 채다. 한 임금의 치세가 끝나는 일치고는 아주 조용하다.'
	),
	p(
		'In the corridor a boy of twelve waits in a robe hemmed that evening. The lords bow to him on the way out. By morning he is King Jinpyung. His eldest daughter will be the next name this room argues over all night.',
		'복도엔 그날 저녁에 단을 접어 올린 두루마기를 입은 열두 살 소년이 기다린다. 나가던 대등들이 그에게 절한다. 아침이 되면 그는 진평왕이다. 그의 맏딸이 이 방이 밤새 다툴 다음 이름이 된다.'
	),
	p(
		'At the far end, a four-year-old has followed the lamps out of bed. Nobody sends him back. He watches the lords file past and counts them, the way small children count everything. Six. His house woke up Sacred Bone. It goes to bed True Bone.',
		'복도 저 끝엔 등불을 따라 자리에서 빠져나온 네 살배기가 있다. 아무도 그를 돌려보내지 않는다. 아이는 줄지어 지나가는 대등들을 센다. 어린애들이 뭐든 세듯이. 여섯. 그 집은 성골로 눈을 떴다가 진골로 잠든다.'
	),
	{
		kind: 'quote',
		html: 'He ruled the country four years. His government fell into disorder and he gave himself to debauchery, and the people of the country deposed him.',
		ko: '나라를 다스린 지 네 해, 정사가 어지럽고 음란에 빠지니 나라 사람들이 그를 폐하였다.',
		hanja: '御國四年。政亂荒婬。國人廢之。',
		source: 'Samguk Yusa (三國遺事) bk. 1, Marvels (紀異) — Dohwa-nyeo and Bihyeong-rang'
	},
	{ kind: 'scene', label: 'The Night Bridge · 612', ko: '밤의 다리 · 612' }
];

editStory((chapters) => {
	const entry = chapters.flatMap((c) => c.entries).find((e) => e.title === 'Harmony Council');
	if (!entry) throw new Error('no Harmony Council');
	const B = entry.blocks;
	if (B.some((b) => b.kind === 'flashback' && b.year === '579')) {
		console.log('already split');
		return false;
	}

	const council = B[findIdx(B, (b) => b.kind === 'flashback' && b.year === '632', 'council flashback')];
	const inner = council.blocks;
	const bridgeAt = findIdx(inner, (b) => b.kind === 'flashback' && b.year === '612', 'night bridge');
	const bridge = inner[bridgeAt];
	const peonyAt = findIdx(inner, (b) => b.kind === 'scene' && b.label === 'The Peonies', 'peony scene');
	const peonies = inner.slice(peonyAt + 1);
	council.blocks = [...inner.slice(0, bridgeAt), ...inner.slice(bridgeAt + 1, peonyAt)];

	const committeeAt = findIdx(B, (b) => b.person === 'alchun' && /committee/.test(plain(b)), 'committee line');
	const rideHomeAt = findIdx(B, (b) => b.kind === 'p' && /Class 77 ride home/.test(plain(b)), 'ride-home line');
	const doorAt = findIdx(B, (b) => b.kind === 'scene' && b.label === 'The Queen’s Door', 'queen’s door');
	if (!(committeeAt < rideHomeAt && rideHomeAt < doorAt)) throw new Error('Harmony Council: unexpected order');

	entry.blocks = [
		...B.slice(0, committeeAt + 1),
		COMMITTEE,
		{ kind: 'flashback', year: '579', title: 'The Three Counts · 세 번의 셈', blocks: [...DEPOSITION, ...bridge.blocks] },
		...B.slice(committeeAt + 1, rideHomeAt + 1),
		FLOWERS,
		{ kind: 'flashback', year: '632', title: 'The Peonies · 모란', blocks: peonies },
		...B.slice(doorAt)
	];
	console.log('Harmony Council: 3 flashbacks');
});
