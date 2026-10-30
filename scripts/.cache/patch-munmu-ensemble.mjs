import { editStory, entryOf, makeInserter, find } from './story-ops.mjs';

editStory((story) => {
	const entry = entryOf(story, 'silla-tang-war', 'Munmu');
	if (!entry) throw new Error('Munmu not found');
	const insert = makeInserter(entry);

	const letGo = find(entry, 'Then the near ones let go');
	if (letGo.length !== 1) throw new Error(`let-go hits: ${letGo.length}`);
	Object.assign(letGo[0].b, {
		html: 'Then the near ones let go, one by one, the way lamps go out down a long hall. His father nods once. The queen squeezes. The marshal doesn’t squeeze; he taps twice, like a man checking a saddle girth.',
		ko: '가까이 있던 이들이 하나둘 손을 놓는다. 긴 복도의 등이 꺼지듯. 아버지가 한 번 끄덕인다. 여왕이 어깨를 쥔다. 대장군은 쥐지 않는다. 안장 가슴걸이를 확인하듯, 두 번 톡 친다.'
	});

	const sisters = insert('It is the plainest advice anyone has given him in years', [
		{
			kind: 'scene',
			label: 'The Other Two',
			ko: '나머지 둘'
		},
		{
			kind: 'p',
			html: 'The steam behind the queen was never empty. Two women have been sitting on the ledge the whole time. He only sees them when they decide he can.',
			ko: '여왕 뒤 김은 처음부터 비어 있지 않았다. 여자 둘이 처음부터 턱에 앉아 있었다. 그들이 봐도 된다 할 때에야 보인다.'
		},
		{
			kind: 'dialogue',
			person: 'jinduk',
			chip: '#c4a0b4',
			en: ['Bupmin-ah.', 'Your hair. Dry it.'],
			lines: ['문무야.', '머리. 말려.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['Aunt Sungman—'],
			lines: ['승만 이모—']
		},
		{
			kind: 'dialogue',
			person: 'jinduk',
			chip: '#c4a0b4',
			en: ['Jinduk is fine. I only held the seat.'],
			lines: ['진덕이 맞다. 자리만 빌렸을 뿐이야.']
		},
		{
			kind: 'dialogue',
			person: 'chunmyung',
			chip: '#d8a0e8',
			en: ['Sit him down. He asks standing up.', 'Always has.'],
			lines: ['앉혀. 저 애는 서서 묻는 버릇이 있어.', '원래 그래.']
		},
		{
			kind: 'dialogue',
			person: 'sunduk',
			chip: '#E8552B',
			en: ['Chunmyung. You came late.'],
			lines: ['천명아. 늦게 왔네.']
		},
		{
			kind: 'dialogue',
			person: 'chunmyung',
			chip: '#d8a0e8',
			en: ['I didn’t come late.', 'I was sitting here. You didn’t look.'],
			lines: ['늦게 온 게 아니야.', '처음부터 앉아 있었어. 네가 안 봤지.']
		},
		{
			kind: 'p',
			html: 'Three of Jinpyung’s house, on one wet rock. The one who wore the crown. The one who gave it away. The one who kept the chair from becoming a joke.',
			ko: '진평의 집 셋이, 젖은 바위 하나에. 관을 쓴 이. 관을 내준 이. 자리가 농담이 되지 않게 지킨 이.'
		},
		{
			kind: 'dialogue',
			person: 'jinduk',
			chip: '#c4a0b4',
			en: ['The letter.', 'Write it. The way I wrote for seven years.', 'Just don’t believe it.'],
			lines: ['그 편지.', '써. 내가 일곱 해 쓴 것처럼.', '그냥 믿지 마.']
		},
		{
			kind: 'dialogue',
			person: 'chunmyung',
			chip: '#d8a0e8',
			en: ['Ask your grandfather before you ask anyone else.', 'His answers run long.'],
			lines: ['다른 사람 묻기 전에 네 할아버지부터 물어.', '그 사람 답이 길어.']
		}
	]);
	if (sisters !== true) throw new Error(`sisters insert: ${sisters}`);

	const yard = insert('Then the near ones let go', [
		{
			kind: 'scene',
			label: 'The First Yard',
			ko: '첫 마당'
		},
		{
			kind: 'p',
			html: 'The steam in front of the gold will not open yet. A boy in ice-blue comes through it first, laughing as if he just got hit and liked it.',
			ko: '금빛 앞 김은 아직 열리지 않는다. 먼저 얼음빛 옷을 입은 아이가 그 김을 뚫고 나온다. 방금 얻어맞고 좋아서 웃는 얼굴이다.'
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			chip: '#6fa8ff',
			en: ['STILL HERE.', 'Hey. Are you a king?'],
			lines: ['아직 있어.', '야. 너 왕이야?']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['…Sadaham.'],
			lines: ['…사다함.']
		},
		{
			kind: 'dialogue',
			person: 'sadaham',
			chip: '#6fa8ff',
			en: ['You know me. So the song stuck.', 'Mugwan. Look. They still sing us.'],
			lines: ['알아? 노래가 남았구나.', '무관아. 봐. 우리 노래 아직 있어.']
		},
		{
			kind: 'dialogue',
			person: 'mugwan',
			chip: '#8aa0b8',
			en: ['That’s your song.'],
			lines: ['그건 네 노래야.']
		},
		{
			kind: 'p',
			html: 'Two more behind them. Not First Class. The western hills. They stand the way men stand who already kept the hard precept.',
			ko: '그 뒤로 둘이 더 있다. 제일기는 아니다. 서쪽 언덕이다. 이미 어려운 계를 지킨 사람들이 서는 법으로 선다.'
		},
		{
			kind: 'dialogue',
			person: 'gwisan',
			chip: '#5c7a6a',
			en: ['We kept the fourth.'],
			lines: ['네 번째는 지켰습니다.']
		},
		{
			kind: 'dialogue',
			person: 'chuhang',
			chip: '#6a8a7a',
			en: ['I said it would be the hard one.', 'We kept it anyway.'],
			lines: ['어렵다고 한 건 나다.', '그래도 지켰지.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['Amak.'],
			lines: ['아마크.']
		},
		{
			kind: 'dialogue',
			person: 'gwisan',
			chip: '#5c7a6a',
			en: ['Yes.'],
			lines: ['예.']
		},
		{
			kind: 'p',
			html: 'Then two boys younger than the apology. One will not wait. One will not get down.',
			ko: '그다음엔 사죄문보다 어린 아이 둘. 하나는 기다리지 않는다. 하나는 내리지 않는다.'
		},
		{
			kind: 'dialogue',
			person: 'bangul',
			chip: '#3d6b9a',
			en: ['Ride first. Someone has to.'],
			lines: ['먼저 나가. 누군가는 해야지.']
		},
		{
			kind: 'dialogue',
			person: 'gwanchang',
			chip: '#4a6a88',
			en: ['Yes.'],
			lines: ['예.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['…Yellow Mountain.'],
			lines: ['…황산.']
		},
		{
			kind: 'dialogue',
			person: 'gwanchang',
			chip: '#4a6a88',
			en: ['Yes.'],
			lines: ['예.']
		},
		{
			kind: 'scene',
			label: 'The Man Who Stayed',
			ko: '남은 사람'
		},
		{
			kind: 'p',
			html: 'Last before the gold. A south-shore Park, no crown, salt dried in the sleeve. He looks at Munmu the way you look at a boat you already decided will leave.',
			ko: '금 앞에서 마지막이다. 남쪽 나루의 박씨. 관은 없고, 소매엔 마른 소금이 있다. 이미 떠나기로 한 배를 보듯 문무를 본다.'
		},
		{
			kind: 'dialogue',
			person: 'jesang',
			chip: '#c4a574',
			en: ['Park Jesang.', 'The boats were Momal’s.'],
			lines: ['박제상이오.', '배는 모말이 몰았소.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['You brought both princes home—'],
			lines: ['두 왕자를 데려오신—']
		},
		{
			kind: 'dialogue',
			person: 'jesang',
			chip: '#c4a574',
			en: ['One man stays.', 'That was the job.'],
			lines: ['한 사람은 남고.', '그게 일이었소.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#C41E3A',
			en: ['They want a letter. On my knees. To the West.'],
			lines: ['편지를 쓰라 합니다. 무릎 꿇고. 서국에.']
		},
		{
			kind: 'dialogue',
			person: 'jesang',
			chip: '#c4a574',
			en: ['A letter.', 'Sail the boat. Let someone else copy the letter.'],
			lines: ['편지요.', '배는 몰으시오. 편지는 남이 베끼게 두시오.']
		},
		{
			kind: 'p',
			html: 'Then the steam in front of him opens on gold, and the yard steps aside.',
			ko: '그때 앞 김이 금빛으로 열리고, 마당은 길을 비킨다.'
		}
	]);
	if (yard !== true) throw new Error(`yard insert: ${yard}`);

	return true;
});

console.log('Munmu ensemble beats written');
