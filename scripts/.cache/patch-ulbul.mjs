import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko, weather = 'dusk') => ({ kind: 'scene', label, ko, weather, year: 300 });
const map = () => ({
	kind: 'map',
	year: 300,
	places: ['jolbon'],
	caption: 'The first village is a cave.',
	ko: '첫 마을은 굴이다.'
});
const d = (person, chip, lines, en) => ({ kind: 'dialogue', person, chip, lines, en });

const M = '#C30000';
const C = '#8a7048';
const U = '#6b5a48';
const J = '#c4a574';
const JM = '#e8563f';

const inserted = [
	p(
		'Ulbul looks at the sack. Then at the silk in the mud. Then at the old man.',
		'을불은 가마니를 본다. 그다음 진흙 위의 비단을. 그다음 늙은이를.'
	),
	p('He does not say yes.', '예, 라고 하지 않는다.'),
	d(
		'changjori',
		C,
		['…알겠어요.', '무릎은. 다음에.'],
		['…Understood.', 'The knees. Next time.']
	),
	p(
		'Changjori walks up the bank. He does not look back.',
		'창조리가 둑으로 올라간다. 뒤는 안 본다.'
	),
	p(
		'Ulbul watches the empty bank until the silk is just mud again.',
		'을불은 빈 둑을 본다. 비단이 다시 진흙이 될 때까지.'
	),
	scene('The ditch · that night', '도랑 · 그날 밤', 'night'),
	p('That night he walks the ditch Changjori counted.', '그날 밤, 창조리가 센 도랑을 걷는다.'),
	p('A boy still holding a hand. A woman who has not stood in two days.', '아직 손을 잡고 있는 아이. 이틀째 일어나지 못한 여인.'),
	p('He stops counting.', '세기를 멈춘다.'),
	p(
		'You wanted him to stay a salt seller. Look at the ditch.',
		'소금장수로 남길 생각이었지. 도랑을 봐.'
	),
	scene("Ummo's stall", '음모의 좌판', 'dusk'),
	p('Seven years. You never asked my name.', '일곱 해. 이름은 한 번도 안 물었다.'),
	d(
		'micheon',
		M,
		['일곱 해였소.', '성함도 안 물으셨소.', '그게… 그게 은혜요.', '이제 가야 하오.', '저울은 비우지 마시오.'],
		[
			'Seven years.',
			'You never asked my name.',
			'That… that’s the kindness.',
			'I have to go.',
			'Don’t leave the scale empty.'
		]
	),
	d('eummo', U, ['가마니.', '묶어.', '입 말고.', '…가.'], ['Sack.', 'Tie it.', 'Mouth shut.', '…Go.']),
	d('jaemo', J, ['야. 어디.', '내일 오라며.'], ['Ya. Where.', 'You said tomorrow.']),
	d('micheon', M, ['내일. 진짜로.'], ['Tomorrow. For real.']),
	p('He takes the satgat off the hook. Puts it back on. That’s the joke.', '삿갓을 걸개에서 벗는다. 다시 쓴다. 그게 농담이다.'),
	p('He walks south. Not to the palace. To the first village.', '남쪽으로 간다. 궁이 아니다. 첫 마을이다.'),
	map(),
	scene('Jumong Cavern', '주몽의 굴', 'night'),
	p('The first village is a cave.', '첫 마을은 굴이다.'),
	p(
		'People still go there when they have nothing else to ask.',
		'물을 곳이 없을 때, 사람들은 아직도 거기로 간다.'
	),
	p(
		'He kneels in a cave older than his name.',
		'이름보다 오래된 굴에, 그는 무릎을 꿇는다.'
	),
	p('He does not know how kings pray. He knows how salt sellers wait.', '왕은 어떻게 비는지 모른다. 소금장수가 어떻게 기다리는지는 안다.'),
	p('Someone is already sitting in the dark.', '어둠 속에, 이미 누가 앉아 있다.'),
	d('jumong', JM, ['야. 너. 소금.'], ['Hey. You. Salt.']),
	p('The face is a boy’s. The eyes are not.', '얼굴은 애다. 눈은 아니다.'),
	p('You’ve heard the name. This is the first time you see him.', '이름은 들어 봤지. 얼굴을 보는 건, 이번이 처음이다.'),
	d(
		'jumong',
		JM,
		['나로부터 열하나다.', '아직도 두 번 세네.'],
		['Eleven from me.', 'And you still count twice.']
	),
	d('micheon', M, ['저는…', '소금을…'], ['I…', 'Salt…']),
	d('jumong', JM, ['가마니 멘다고 집이 안 죽는다.'], ['A sack on the back does not kill the house.']),
	p(
		'Jumong puts a hand on the satgat. Like handing it back. Like making it a crown for a minute.',
		'주몽이 삿갓에 손을 얹는다. 다시 씌워 주는 것처럼. 잠시 왕관으로 만드는 것처럼.'
	),
	d('jumong', JM, ['가.', '그 늙은이는 두 번 온다.'], ['Go.', 'The old man will come twice.']),
	p('When Ulbul looks up the cave is empty. The satgat is still on his head.', '을불이 고개를 들면 굴은 비어 있다. 삿갓은 그대로 머리에 있다.'),
	scene('The mouth · dawn', '굴 입구 · 새벽', 'day'),
	p('Dawn. Changjori at the mouth of the cave. Mud on both knees again.', '새벽. 굴 입구에 창조리. 무릎에 또 진흙이다.'),
	d('changjori', C, ['또 진흙이오.', '이번엔 무릎이 먼저요.'], ['Mud again.', 'This time the knees went first.']),
	d(
		'micheon',
		M,
		['이번엔… 예.', '…신발값은 받으셨소.', '아니. 됐어.', '배, 두고 가겠소.', '재모한테는… 내일 오라 하거라. 이번엔 진짜로.'],
		[
			'This time… yes.',
			'…Did they get the price of the shoe.',
			'No. Never mind.',
			'I’ll leave the boat.',
			'Tell Jaemo… come tomorrow. Tomorrow for real.'
		]
	)
];

editStory((story) => {
	const chapter = story.find((c) => c.entries?.some((e) => e.title === 'King Micheon' || e.title === 'Ulbul'));
	if (!chapter) throw new Error('chapter not found');
	const entry = chapter.entries.find((e) => e.title === 'King Micheon' || e.title === 'Ulbul');
	entry.title = 'Ulbul';
	entry.subtitle = '을불';
	entry.tagline = 'A Salt Merchant';
	entry.taglineKo = '소금장수';
	entry.logline = {
		en: 'A salt seller on the river. An old man on his knees. The first king in a cave.',
		ko: '강 위의 소금장수. 무릎 꿇은 늙은이. 굴 속의 첫 왕.'
	};
	if (!entry.cast.includes('jumong')) entry.cast.push('jumong');
	const i89 = entry.blocks.findIndex(
		(b) => b.kind === 'p' && /old man who will not get up until he says yes|Ulbul looks at the sack/.test(b.html ?? '')
	);
	if (i89 < 0) throw new Error('anchor 89 not found');
	const iHouse = entry.blocks.findIndex((b) => /prime minister’s house|국상의 집/.test(`${b.html ?? ''} ${b.ko ?? ''}`));
	if (iHouse < 0) throw new Error('house block not found');
	if (iHouse <= i89) throw new Error('house before refuse');
	entry.blocks = [...entry.blocks.slice(0, i89), ...inserted, ...entry.blocks.slice(iHouse)];
	console.log(`Ulbul: blocks ${entry.blocks.length}, splice at ${i89}, kept house+ from ${iHouse}`);
});
