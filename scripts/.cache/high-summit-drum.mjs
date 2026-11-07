import { editStory } from './story-ops.mjs';

const G = { person: 'gesomun', chip: '#d0362f' };
const D = { person: 'dosuryu', chip: '#c98578' };
const GROOM = { speaker: 'Groom', gender: 'm', chip: '#8d8d95' };

const blocks = [
	{ kind: 'scene', label: 'The Drum', ko: '북' },
	{
		kind: 'p',
		html: 'Past the gate the yard opens, and in the middle of it stands a drum. It is bigger than a cart. Nobody has built a roof over it, and there is no stick beside it. One face is slit from rim to rim, and the hide hangs open like a mouth that gave up.',
		ko: '문을 지나면 마당이 열리고, 한가운데 북이 하나 서 있다. 수레보다 크다. 누구도 그 위에 지붕을 얹지 않았고, 곁에 북채도 없다. 한쪽 가죽이 테두리에서 테두리까지 찢겨, 말하다 만 입처럼 벌어져 있다.'
	},
	{
		kind: 'p',
		html: 'Yeon’s horse sees it first. It stops dead with its ears flat, and it will not pass the slit until he gets down and leads it.',
		ko: '연의 말이 먼저 본다. 귀를 납작 붙이고 우뚝 서더니, 그가 내려서 고삐를 끌 때까지 찢긴 자리를 지나가려 하지 않는다.'
	},
	{ kind: 'dialogue', ...GROOM, lines: ['손대디 마시라요, 나리. 귀가 있습네다.'], en: ['Don’t touch it, sir. It’s got ears.'] },
	{ kind: 'dialogue', ...G, lines: ['북에 귀가 어딨네.'], en: ['Drums don’t have ears.'] },
	{ kind: 'dialogue', ...GROOM, lines: ['이건 있었습네다.'], en: ['This one did.'] },
	{ kind: 'dialogue', ...D, lines: ['칠 수도 없는 북을 왜 마당 한복판에 세워 둬?', '땔감으로나 쓰지.'], en: ['Why keep a drum you can’t even beat? Right in the middle of the yard?', 'Burn it, I say.'] },
	{ kind: 'dialogue', ...G, lines: ['치라고 둔 게 아니다. 보라고 둔 거다.'], en: ['It’s not for beating. It’s for looking at.'] },
	{ kind: 'dialogue', ...D, lines: ['뭘 보라고.'], en: ['Looking at what.'] },
	{ kind: 'dialogue', ...G, lines: ['안 찢을 걸 찢으면 어케 되는디.'], en: ['What happens when somebody cuts what they shouldn’t.'] },
	{
		kind: 'p',
		html: 'He runs a thumb along the cut as he passes, groom or no groom. The hide is dry as bark. Who slit it, and for whom, this yard will not tell you. You will hear it. Not here.',
		ko: '마부가 뭐라든, 그는 지나가며 엄지로 찢긴 자리를 훑는다. 가죽은 나무껍질처럼 말라 있다. 누가, 누구를 위해 찢었는지 이 마당은 말해 주지 않는다. 언젠가 듣게 될 것이다. 여기서는 아니다.'
	}
];

editStory((story) => {
	const en = story.flatMap((p) => p.entries ?? []).find((e) => e.title === 'High Summit');
	if (en.blocks.some((b) => b.kind === 'scene' && b.label === 'The Drum')) return false;
	const i = en.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Horse Wall');
	if (i < 0) throw new Error('Horse Wall scene not found');
	en.blocks.splice(i, 0, ...blocks);
	console.log(`inserted ${blocks.length} blocks before block ${i}`);
});
