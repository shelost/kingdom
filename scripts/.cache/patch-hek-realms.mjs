// Splice Heaven–Earth King: brothers set up 이승 / 저승; Big Star names the fallen sun Haewonmek.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Heaven–Earth King');
if (!en) throw new Error('Heaven–Earth King missing');

const i = en.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('It goes the way his brother said')
);
if (i < 0) throw new Error('insert point missing');

const insert = [
	{ kind: 'scene', label: 'The Warm Side', ko: '이승' },
	{
		kind: 'p',
		html: 'Little Star walks into the heat like a man who just won a house.',
		ko: '소별은 집을 막 딴 사람처럼 더위 속으로 걸어 들어간다.'
	},
	{
		kind: 'p',
		html: 'One sun still going. The other is a hole in the sky. He likes this better already.',
		ko: '해는 아직 하나 간다. 다른 하나는 하늘의 구멍이다. 벌써 이게 낫다.'
	},
	{
		kind: 'p',
		html: 'He sits on a hill like a king. The hill doesn’t notice.',
		ko: '언덕에 임금처럼 앉는다. 언덕은 모른다.'
	},
	{
		kind: 'dialogue',
		chip: '#C94040',
		person: 'sobyeol',
		en: ['Hey.', 'You still going?'],
		lines: ['야.', '아직 가?']
	},
	{
		kind: 'p',
		html: 'The one still flying doesn’t stop. He has a schedule. Long white hair, a chariot, no interest in a new king on a hill.',
		ko: '아직 나는 놈은 멈추지 않는다. 시간표가 있다. 흰 머리 길게, 수레, 언덕의 새 임금 따위엔 관심 없다.'
	},
	{
		kind: 'dialogue',
		chip: '#f0b429',
		person: 'haemosu',
		en: ['Somebody has to.'],
		lines: ['누가 안 가면.']
	},
	{
		kind: 'p',
		html: 'A pine at the foot of the hill already has an opinion.',
		ko: '언덕 아래 소나무가 벌써 할 말이 있다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A pine',
		gender: 'n',
		en: ['Nice flower.'],
		lines: ['꽃 잘 골랐다.']
	},
	{
		kind: 'dialogue',
		chip: '#C94040',
		person: 'sobyeol',
		en: ['What.'],
		lines: ['뭐.']
	},
	{
		kind: 'dialogue',
		speaker: 'A pine',
		gender: 'n',
		en: ['The stolen one.'],
		lines: ['훔친 거.']
	},
	{
		kind: 'dialogue',
		chip: '#C94040',
		person: 'sobyeol',
		en: ['Trees.', 'Fine. I can live with trees.'],
		lines: ['나무는 괜찮아.', '나무는 살 수 있어.']
	},
	{
		kind: 'p',
		html: 'He hasn’t thought about ghosts yet. You’ll see.',
		ko: '귀신은 아직 생각 안 했다. 곧 한다.'
	},
	{ kind: 'scene', label: 'The Dark Road', ko: '저승길' },
	{
		kind: 'p',
		html: 'On the way down, Big Star passes his mother’s house. The rice is still on. Smoke from the pot. He does not stop.',
		ko: '내려가는 길에 대별은 어머니 집을 지난다. 밥은 아직 올려져 있다. 솥에서 김. 멈추지 않는다.'
	},
	{
		kind: 'p',
		html: 'The dark edge is not a gate. It’s a road that forgets colour as it goes.',
		ko: '어두운 끝은 문이 아니다. 갈수록 색을 잊는 길이다.'
	},
	{
		kind: 'p',
		html: 'Halfway down, something is still burning.',
		ko: '반쯤 내려가니, 아직 타고 있는 것이 있다.'
	},
	{ kind: 'scene', label: 'The Fallen Sun', ko: '떨어진 해' },
	{
		kind: 'p',
		html: 'A sun deity sits against a black rock, shorter-haired than the one still flying, same bones, same white robe torn at the chest. A golden arrow is in him. Noon’s leftover.',
		ko: '해의 신이 검은 바위에 기대 앉아 있다. 아직 나는 놈보다 머리가 짧고, 뼈대는 같고, 흰 옷은 가슴이 찢겼다. 금빛 화살이 박혀 있다. 한낮의 나머지.'
	},
	{
		kind: 'dialogue',
		chip: '#6b5b6e',
		person: 'haewonmek',
		en: ['…You.'],
		lines: ['……너냐.']
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['You’re still burning.'],
		lines: ['아직 타고 있구나.']
	},
	{
		kind: 'dialogue',
		chip: '#6b5b6e',
		person: 'haewonmek',
		en: ['You drew.', 'The long-haired one kept the chariot.'],
		lines: ['네가 쐈지.', '긴 머리 놈이 수레를 가져갔어.']
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['Can you walk.'],
		lines: ['걸을 수 있어.']
	},
	{
		kind: 'dialogue',
		chip: '#6b5b6e',
		person: 'haewonmek',
		en: ['I fell from noon.', 'I can walk anything.'],
		lines: ['정오에서 떨어졌다.', '어디든 걷지.']
	},
	{
		kind: 'p',
		html: 'Big Star looks at the hole the arrow made, then at the road that still has no clerks.',
		ko: '대별은 화살이 낸 구멍을 본다. 그리고 아직 차사 없는 길을 본다.'
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: [
			'People will die up there.',
			'Someone has to take them down.',
			'I can’t be on every road.'
		],
		lines: ['위에선 사람이 죽을 거다.', '누군가는 데려와야 해.', '내가 모든 길에 있을 순 없어.']
	},
	{
		kind: 'dialogue',
		chip: '#6b5b6e',
		person: 'haewonmek',
		en: ['You shot me.'],
		lines: ['날 쐈잖아.']
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['And now I’m offering you a job.'],
		lines: ['그래서 일을 주는 거다.']
	},
	{
		kind: 'p',
		html: 'The fallen sun laughs once, which hurts, and then he listens.',
		ko: '떨어진 해가 한 번 웃는다. 아프다. 그리고 듣는다.'
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['Walk them from life to death.', 'I’ll call you Haewonmek.'],
		lines: ['산 자에서 죽은 자로.', '이름은 해원맥이다.']
	},
	{
		kind: 'dialogue',
		chip: '#6b5b6e',
		person: 'haewonmek',
		en: ['…해.'],
		lines: ['……해.']
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['Keep it. You’ll need it, down there.'],
		lines: ['남겨. 아래선 그게 필요할 거다.']
	},
	{
		kind: 'card',
		person: 'haewonmek',
		caption: 'The other 해. Shot down at noon. Walks the night now.',
		ko: '다른 해. 한낮에 떨어졌다. 이젠 밤길을 걷는다.',
		still: '/intro/haewonmek--buyeo.jpg'
	},
	{
		kind: 'p',
		html: 'His brother kept the heat. He kept the road. You’ll know the long-haired one later. This one already has somewhere to be.',
		ko: '형은 더위를 가졌다. 그는 길을 가졌다. 긴 머리 놈은 나중에 알게 된다. 이 놈은 벌써 갈 데가 있다.'
	},
	{
		kind: 'p',
		html: 'Ink takes the white robe first. Then a brim. Then the mouth, and nothing above it.',
		ko: '먹이 흰 옷부터 먹는다. 그다음 모자 챙. 그다음 입. 그 위는 없다.'
	},
	{ kind: 'scene', label: 'The Dead Side', ko: '저승' },
	{
		kind: 'p',
		html: 'Big Star hangs an empty bench in the dark, and sits on it once, to see if it holds.',
		ko: '대별은 어둠에 빈 걸상을 달고, 한 번 앉아 본다. 버티는지.'
	},
	{
		kind: 'p',
		html: 'No one to judge yet. The first clerk is already walking.',
		ko: '판결할 사람은 아직 없다. 첫 차사는 이미 걷고 있다.'
	},
	{
		kind: 'dialogue',
		chip: '#3B6FBF',
		person: 'daebyeol',
		en: ['Clear law.', 'That’s all.'],
		lines: ['맑은 법.', '그게 다다.']
	},
	{
		kind: 'p',
		html: 'Up there, Little Star is still arguing with a pine.',
		ko: '위에선 소별이 아직 소나무와 다투고 있다.'
	}
];

en.blocks.splice(i, 0, ...insert);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`spliced ${insert.length} blocks before haunted; now ${en.blocks.length} blocks`);
