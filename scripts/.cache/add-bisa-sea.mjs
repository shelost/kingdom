// Adds the Bisa sea fight (645) to the Yodong entry, between White Cliff and "Of all the forts".
import { editStory, find } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SAY = (speaker, en, lines) => ({ kind: 'dialogue', speaker, gender: 'm', chip: '#7a6b5a', lines, en });
const PHASE = (phase) => ({ kind: 'battle', battle: 'bisa-645', phase });

const BLOCKS = [
	{ kind: 'scene', label: 'The Cape', ko: '곶' },
	P(
		'Meanwhile, the sea. Five hundred hulls leave the West’s coast and cross in four days. Nobody aboard has fought on water. Nobody thinks they’ll need to. Theirs are the bigger ships.',
		'그사이, 바다. 배 오백 척이 서쪽 해안을 떠나 나흘 만에 건넌다. 배에 탄 누구도 물 위에서 싸워 본 적이 없다. 그럴 일이 있으리라 생각하는 사람도 없다. 배는 저쪽이 더 크니까.'
	),
	P(
		'Where the land runs out, Bisa sits on a ridge with cliffs on every side. Below it, in the inlet, Goguryeo keeps a few warships. The records don’t mention them. The records were written on the other side’s decks.',
		'땅이 끝나는 곳, 비사성은 사방이 벼랑인 능선 위에 앉아 있다. 그 아래 포구에 고구려는 전함 몇 척을 둔다. 기록에는 그 배들이 없다. 기록은 저쪽 갑판 위에서 쓰였다.'
	),
	PHASE('crossing'),
	SAY('A Goguryeo lookout', ['Captain— sails. South. I stopped counting at a hundred.', 'They keep coming out of the haze.'], ['선장님— 돛입니다. 남쪽. 백까지 세다 그만뒀습니다.', '안개 속에서 자꾸 나와요.']),
	SAY('A Goguryeo captain', ['Then we go now, while they’re still in a line.', 'Oars! Anyone who wants to live forever can swim home.'], ['그럼 지금 간다. 저놈들이 아직 줄지어 올 때.', '노 잡아! 오래 살고 싶은 놈은 헤엄쳐서 집에 가라.']),
	P(
		'A Goguryeo warship is a big ship. It stays a big ship right up to the moment it comes alongside a tower-ship. Then the enemy deck is two men above its own, and the arrows come down.',
		'고구려 전함은 큰 배다. 누선 옆에 붙는 그 순간까지는. 붙고 나면 적의 갑판이 제 갑판보다 사람 둘 키만큼 높고, 화살이 위에서 쏟아진다.'
	),
	SAY('A Tang crossbowman', ['They’re rowing at us. At us!', '…They look so small from up here.'], ['우리 쪽으로 저어 온다. 우리 쪽으로!', '…여기서 보니까 되게 작네.']),
	PHASE('sea'),
	P(
		'The coast ships burn or run. The fleet beaches under the ridge, and the army walks up out of the surf.',
		'연안 함선들은 불타거나 달아난다. 함대는 능선 아래에 배를 대고, 군대가 파도 속에서 걸어 올라온다.'
	),
	PHASE('landing'),
	P(
		'From the beach every side of Bisa is a cliff. Every side but one. A column goes round to the west gate in the dark, and a junior officer named Wang Wendu is the first over the wall. Nobody remembers him for anything else.',
		'해변에서 보면 비사성은 어느 쪽이나 벼랑이다. 한 쪽만 빼고. 한 부대가 어둠 속에 서문으로 돌아가고, 왕문도라는 하급 장교가 맨 먼저 성벽을 넘는다. 그 밖의 일로 그를 기억하는 사람은 없다.'
	),
	PHASE('night'),
	P(
		'In the fifth month the clerks count eight thousand people taken, men and women. The fleet sails on round the cape.',
		'오월, 서기들은 사로잡은 사람을 남녀 합쳐 팔천으로 센다. 함대는 곶을 돌아 계속 간다.'
	),
	PHASE('fall')
];

editStory((story) => {
	const entry = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Yodong' && String(e.year).includes('645'));
	if (!entry) throw new Error('no Yodong entry');
	if (entry.blocks.some((b) => b.battle === 'bisa-645')) return false;
	const [hit] = find(entry, 'Of all the forts Yeon spent fourteen years', (b) => b.kind === 'p');
	if (!hit) throw new Error('anchor not found');
	hit.list.splice(hit.i, 0, ...BLOCKS);
	console.log(`inserted ${BLOCKS.length} blocks at ${hit.i}`);
});
