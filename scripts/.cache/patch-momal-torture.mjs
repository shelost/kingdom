import { editStory, find } from './story-ops.mjs';

const NEW = [
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['The boy is gone.', 'Why.'],
		lines: ['아이가 갔소.', '왜요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Because my king asked.'],
		lines: ['우리 임금이 청하셨소.']
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: [
			'You walked in here as mine.',
			'Sit.',
			'As a minister.',
			'We will even give you a chair.',
			'Say this hall and you eat. Say the other name and I use all five.'
		],
		lines: [
			'여기 들어올 때 내 사람이었소.',
			'앉으시오.',
			'신하로.',
			'의자까지 드리리다.',
			'이 대청이라 하면 먹여 주리다. 다른 이름을 말하면 다섯을 다 쓰리다.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: [
			'I’d rather be a dog of Silla.',
			'I’d rather be a pig.',
			'I’d rather take our whip than sit in that.'
		],
		lines: ['신라의 개가 되리다.', '돼지가 되리다.', '그 의자에 앉느니 우리 매를 맞으리다.']
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['Whose man.'],
		lines: ['어느 나라 사람이오.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Silla’s.'],
		lines: ['신라의 신이오.']
	},
	{
		kind: 'p',
		html: 'They take the skin off his soles. He does not sit for that either.',
		ko: '발바닥 가죽을 벗긴다. 그때도 앉지 않는다.'
	},
	{
		kind: 'p',
		html: 'They cut the reeds short. He walks. Every step opens.',
		ko: '갈대를 짧게 벤다. 걷는다. 걸음마다 벌어진다.'
	},
	{
		kind: 'dialogue',
		person: 'katsuragi',
		en: ['Walk.'],
		lines: ['걷으시오.']
	},
	{
		kind: 'p',
		html: 'They still cut those reeds on that island. They say the red is his.',
		ko: '그 섬에서 지금도 그 갈대를 벤다. 붉은 건 그 피라고들 한다.'
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['Again.', 'Whose.'],
		lines: ['다시.', '누구요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Silla’s.'],
		lines: ['신라의 신이오.']
	},
	{
		kind: 'p',
		html: 'They heat a plate until it is a color. They stand him on it.',
		ko: '쇠를 색깔이 날 때까지 달군다. 그 위에 세운다.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['A dog of Silla—'],
		lines: ['신라의 개—']
	},
	{
		kind: 'p',
		html: 'The later book kept the feet and the iron. The official one only kept the fire, and the head after.',
		ko: '나중 책은 발과 쇠를 남겼다. 정사는 불만 남겼다. 그리고 그다음 목.'
	},
	{
		kind: 'dialogue',
		person: 'nintoku',
		en: ['Take him to the wood island.'],
		lines: ['목도로 보내시오.']
	},
	{
		kind: 'place',
		place: 'tsushima',
		html: 'A rock they call Wood Island. Off the mountain in the water. No hall. A pile they can light.',
		ko: '목도라 부르는 바위. 물 위 산 옆. 대청 없다. 불 지를 더미만.'
	},
	{
		kind: 'p',
		html: 'The record names it Wood Island. They pile the wood. A stake in packed earth. Rope. He does not sit.',
		ko: '기록은 목도라 한다. 나무를 쌓는다. 다진 흙의 말뚝. 밧줄. 앉지 않는다.'
	},
	{
		kind: 'p',
		html: 'They tie him to the post. The fire takes the hem first. Then the fire takes the skirt. He looks up.',
		ko: '기둥에 묶는다. 불이 먼저 단을 먹는다. 그다음 불이 치마를 먹는다. 위를 본다.'
	},
	{
		kind: 'p',
		html: 'The flames go up. Not a hearth. A column. Magenta silk becomes a dark shape inside it. From the road you would see a man-shaped hole in a sheet of fire.',
		ko: '불이 올라간다. 화덕이 아니다. 기둥이다. 자줏빛 비단이 그 안의 검은 모양이 된다. 길에서는, 불 장막 속 사람 모양 구멍만 보일 것이다.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['<b>A dog of Silla!</b>', 'A dog— of— Silla—!'],
		lines: ['<b>신라의 개다!</b>', '신라—의— 개—!']
	},
	{
		kind: 'p',
		html: 'The fire is orange first, the way a kitchen is orange. Then it goes blue. The color of the water he put the boy on. The hottest part.',
		ko: '불은 먼저 주황이다. 부엌 불처럼. 그러다 파래진다. 아이를 태운 물 색깔. 제일 뜨거운 부분.'
	},
	{
		kind: 'p',
		html: 'He is still saying it when the color changes. The same sentence. Louder each time, until there is no more air in him, only the words, and a blue column into the sky.',
		ko: '색깔이 바뀔 때도 그 말이다. 같은 문장. 갈수록 크다. 숨이 없을 때까지. 말만 남을 때까지. 하늘로 가는 푸른 기둥.'
	},
	{
		kind: 'p',
		html: 'When there is no more man, they take the head. The official book is particular about that.',
		ko: '사람이 없어지면 목을 벤다. 정사는 그 대목을 빠뜨리지 않는다.'
	},
	{
		kind: 'p',
		html: 'The sky does not answer. It does not have to. The island heard him.',
		ko: '하늘은 안 대답한다. 안 해도 된다. 섬이 들었다.'
	}
];

editStory((story) => {
	const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Momal');
	if (!en) throw new Error('Momal not found');
	const start = find(en, 'They beat him first');
	const end = find(en, 'The island heard him');
	if (start.length !== 1) throw new Error(`start hits: ${start.length}`);
	if (end.length !== 1) throw new Error(`end hits: ${end.length}`);
	if (start[0].list !== end[0].list) throw new Error('start/end not in same list');
	const { list } = start[0];
	const a = start[0].i;
	const b = end[0].i;
	if (b < a) throw new Error('end before start');
	list.splice(a, b - a + 1, ...NEW);
	return { replaced: b - a + 1, added: NEW.length };
});
