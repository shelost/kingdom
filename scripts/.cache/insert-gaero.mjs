import { editStory } from './story-ops.mjs';

const gaero = {
	year: '475',
	flash: true,
	flashback: true,
	tone: 'fairy-tale legend, dark',
	subtitle: '개로왕',
	logline: {
		en: 'Goguryeo waited a hundred years for a head. It takes the capital too.',
		ko: '고구려는 목 하나에 백 년을 기다렸다. 수도까지 가져간다.'
	},
	badges: ['flag:goguryeo', 'flag:baekje'],
	music: 'The River Gives Way',
	title: 'Gaero',
	place: 'wirye',
	images: [],
	blocks: [
		{
			kind: 'p',
			html: 'A hundred years. Goguryeo can wait that long for a head.',
			ko: '백 년. 고구려는 목 하나에 그만큼 기다릴 수 있다.'
		},
		{
			kind: 'p',
			html: 'The thirteenth Eraha took one off a wall in the north. The north wrote it down. Then it waited.',
			ko: '열셋째 어라하가 북쪽 성벽에서 목을 가져갔다. 북쪽은 그걸 적어 두었다. 그리고 기다렸다.'
		},
		{
			kind: 'p',
			html: 'Jangsu is the Great King’s son. He has the shoulders. He does not have the hurry. When he comes south, he does not send a letter first.',
			ko: '장수는 대왕의 아들이다. 어깨는 물려받았다. 서두름은 아니다. 남으로 올 때, 먼저 편지를 보내지 않는다.'
		},
		{
			kind: 'place',
			place: 'wirye',
			html: 'The old capital on the river. Baekje has lived in it since a first king nobody in this story is going to explain.',
			ko: '강가의 옛 도읍. 백제는 이 이야기에서 설명하지 않을 첫 임금 때부터 여기서 살았다.'
		},
		{
			kind: 'p',
			html: 'Hansung sits on a good hill. The walls are old. The king inside them thinks old walls are a kind of argument.',
			ko: '한성은 좋은 언덕 위에 있다. 성벽은 오래됐다. 그 안의 임금은, 오래된 성벽이 곧 논거라고 생각한다.'
		},
		{
			kind: 'dialogue',
			person: 'gaero',
			en: ['How far.', 'Say a number I can spend.'],
			lines: ['얼마나 왔느냐.', '쓸 수 있는 숫자를 대라.']
		},
		{
			kind: 'dialogue',
			en: ['The north road is full, Majesty.', 'Counting it is a kind of prayer.'],
			lines: ['북쪽이 꽉 찼습니다, 마마.', '세는 일이 기도입니다.']
		},
		{
			kind: 'p',
			html: 'He sends his brother east. Silla is always coming. Silla is always late.',
			ko: '아우를 동쪽으로 보낸다. 신라는 늘 온다. 신라는 늘 늦다.'
		},
		{
			kind: 'p',
			html: 'Seven days. That is all the old capital has in it.',
			ko: '이레. 옛 도읍이 가진 전부다.'
		},
		{
			kind: 'p',
			html: 'On the seventh night the gate goes. The king runs. Kings who run do not get far.',
			ko: '이렛날 밤, 문이 열린다. 임금이 달린다. 달리는 임금은 멀리 가지 못한다.'
		},
		{
			kind: 'p',
			html: 'They catch him at the foot of the mountain below his own roofs. Dawn. Packed earth. The river somewhere behind the trees.',
			ko: '자기 지붕 아래 산기슭에서 잡힌다. 새벽. 다진 흙. 나무 너머 어디쯤 강이 있다.'
		},
		{
			kind: 'dialogue',
			person: 'jangsu',
			en: ['Sit.'],
			lines: ['앉게.']
		},
		{
			kind: 'dialogue',
			person: 'gaero',
			en: ['I am the king of—'],
			lines: ['과인은—']
		},
		{
			kind: 'dialogue',
			person: 'jangsu',
			en: ['You were.'],
			lines: ['이었다.']
		},
		{
			kind: 'p',
			html: 'Jangsu gets off the horse. He does not get off a horse for a thin king unless he means the boot.',
			ko: '장수가 말에서 내린다. 얇은 임금 때문에 말에서 내리는 법은, 그 신발을 뜻할 때뿐이다.'
		},
		{
			kind: 'p',
			html: 'The boot finds the head. The old capital watches. It has nothing left to say.',
			ko: '신발이 머리를 찾는다. 옛 도읍이 본다. 할 말은 없다.'
		},
		{
			kind: 'p',
			html: 'The son gets out. The court packs what a court can carry and goes south, to a smaller river, a smaller hall. They will call that the new capital, because they have to call it something.',
			ko: '아들은 빠져나온다. 조정은 들고 갈 수 있는 것만 싸서 남으로 간다. 더 작은 강, 더 작은 전각. 새 도읍이라 부를 것이다. 뭔가는 불러야 하니까.'
		},
		{
			kind: 'p',
			html: 'Goguryeo does not apologise. Baekje does not forget. A hundred years each way. That is the story both of them tell.',
			ko: '고구려는 사과하지 않는다. 백제는 잊지 않는다. 이쪽 백 년, 저쪽 백 년. 둘 다 그 이야기를 한다.'
		},
		{
			kind: 'p',
			html: '<b>The story isn’t over. Ten thousand men are about to march on a fortress whose clerk is called Gumil…!</b>',
			ko: '<b>이야기는 아직 안 끝났다. 곳간지기 이름이 검일인 성으로, 만 명이 진군한다…!</b>'
		}
	]
};

editStory((story) => {
	const entries = story.flatMap((c) => c.entries ?? []);
	if (entries.some((e) => e.title === 'Gaero')) {
		console.log('Gaero already present');
		return false;
	}
	const seong = entries.find((e) => e.title === 'King Seong');
	if (!seong) throw new Error('King Seong missing');
	const last = seong.blocks[seong.blocks.length - 1];
	if (last?.kind === 'p' && /Gumil/.test(last.html || '')) {
		last.html =
			'<b>Silla walks on a skull. A hundred years before that, Goguryeo took the house itself…!</b>';
		last.ko = '<b>신라는 해골을 밟고 다닌다. 그 백 년 전, 고구려는 집 자체를 가져갔다…!</b>';
	}
	for (const ch of story) {
		const i = (ch.entries ?? []).findIndex((e) => e.title === 'King Seong');
		if (i >= 0) {
			ch.entries.splice(i + 1, 0, gaero);
			console.log('inserted Gaero after King Seong in', ch.id ?? ch.title);
			return;
		}
	}
	throw new Error('could not find King Seong chapter');
});
