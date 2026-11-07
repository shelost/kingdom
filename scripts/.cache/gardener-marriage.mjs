import { editStory } from './story-ops.mjs';

const marriage = [
	{ kind: 'section', label: 'The Two Villages', ko: '두 마을' },
	{
		kind: 'p',
		html: 'Two yards. A ditch between them. He is the son of one. She is the daughter of the other. That is the whole throne.',
		ko: '마당이 둘이다. 사이에 도랑이 있다. 그는 이쪽 아들. 그녀는 저쪽 딸. 왕좌라고 해 봐야 그뿐이다.'
	},
	{
		kind: 'p',
		html: 'Sara comes to the ditch with his eyes already shut in a grin, which is how he flirts. Wongang looks back over a vermilion shoulder and does not cross first.',
		ko: '사라는 눈을 감은 웃음으로 도랑에 온다. 그게 그의 작업이다. 원강은 주홍 어깨 너머로 돌아보고, 먼저 건너지 않는다.'
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['너 어느 마당이야.'],
		en: ['Which yard are you.']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['옆.', '건너도 돼?'],
		en: ['The next one.', 'Can I come across.']
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['와.', '신 벗고.'],
		en: ['Come.', 'Shoes off.']
	},
	{
		kind: 'p',
		html: 'They marry in the ditch, because neither roof will lend the shade. After the bows there is one yard. Two houses. One fire. The ditch stays, and nobody uses it as a border again.',
		ko: '그늘을 빌려 주는 지붕이 없어서, 도랑에서 혼인한다. 절이 끝나면 마당은 하나다. 집은 둘. 불은 하나. 도랑은 남고, 아무도 그걸 경계로 쓰지 않는다.'
	},
	{
		kind: 'p',
		html: 'They are happy. This part stays short. Happy does not need a second chapter.',
		ko: '행복하다. 이 대목은 짧다. 행복한 일에는 다음 장이 필요 없다.'
	},
	{ kind: 'scene', label: 'The Dream', ko: '꿈' },
	{
		kind: 'p',
		html: 'Then the nights start talking. No mouth. No face. West. The western flower field is empty, and the voice says his name as if the job were already his.',
		ko: '그러다 밤이 말하기 시작한다. 입도 없고 얼굴도 없다. 서쪽. 서천꽃밭이 비었고, 목소리는 이미 그 자리인 것처럼 그의 이름을 부른다.'
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['…또.', '서쪽이래.', '다음 꽃감관이래.'],
		en: ['…Again.', 'It says west.', 'It says I’m the next gardener.']
	},
	{
		kind: 'dialogue',
		person: 'wongang',
		lines: ['꿈이 임명이야?', '세 밤이면 임명이여?'],
		en: ['A dream appoints you?', 'Three nights and it’s an appointment?']
	},
	{
		kind: 'dialogue',
		person: 'saradoryeong',
		lines: ['네 밤이면 더 크게 말할 거다.', '밭은 안 기다린대.'],
		en: ['On the fourth night it will talk louder.', 'The field does not wait.']
	},
	{
		kind: 'p',
		html: 'She puts a hand on his chest until the voice quits. In the morning he is still hers. The one fire is still lit. The voice comes back the next night anyway.',
		ko: '그녀는 목소리가 그칠 때까지 그의 가슴에 손을 얹는다. 아침이면 그는 아직 그녀의 것이다. 불은 아직 켜져 있다. 다음 밤, 목소리는 그래도 돌아온다.'
	}
];

editStory((story) => {
	const en = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === 'Gardener');
	if (en.blocks.some((b) => b.label === 'The Two Villages')) throw new Error('already there');
	const i = en.blocks.findIndex((b) => b.kind === 'section' && b.label === 'The Magistrate');
	if (i < 0) throw new Error('magistrate section missing');
	// fix accidental typo if I left one — check lines
	en.blocks.splice(i, 0, ...marriage);
	const bad = JSON.stringify(en.blocks).includes('Random');
	if (bad) throw new Error('typo left in');
	console.log('inserted', marriage.length, 'at', i, 'now', en.blocks.length);
});
