import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(FILE, 'utf8'));

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });

let found = null;
for (const ch of story) {
	const i = ch.entries.findIndex((e) => e.title === 'Harmony Council');
	if (i >= 0) {
		found = ch.entries[i];
		break;
	}
}
if (!found) throw new Error('no Harmony Council');

const b = found.blocks;
if (b[0]?.kind !== 'p' || !b[0].html.includes('One night earlier')) {
	throw new Error('unexpected opener: ' + JSON.stringify(b[0]));
}
if (b[1]?.kind !== 'scene' || b[1].label !== 'The Night Before') {
	throw new Error('unexpected scene: ' + JSON.stringify(b[1]));
}

const death = [
	P(
		'One night earlier, he is still breathing.',
		'하룻밤 전, 그는 아직 숨을 쉰다.'
	),
	{ kind: 'scene', label: "The King's Room", ko: '임금의 침소' },
	P(
		'One lamp. An old king in the bed. Three women around it. By the screen, a man who should not be this quiet.',
		'등잔 하나. 침상 위엔 늙은 임금. 그 둘레에 여자 셋. 병풍 곁엔, 이토록 조용하면 안 되는 사내 하나.'
	),
	P(
		'His daughters Dukman and Chunmyung. Their cousin Sungman. That is the bone the house has left.',
		'딸은 덕만과 천명. 사촌은 승만. 그 집이 남긴 뼈가 이 셋이다.'
	),
	{
		kind: 'card',
		person: 'jinpyung',
		caption: 'Fifty-three years. He asks short questions, and listens to the whole answer.',
		ko: '쉰세 해. 짧은 물음을 던지고, 대답은 끝까지 듣는다.'
	},
	P(
		'The man by the screen is Kim Yongsu. Chunchu’s father.',
		'병풍 곁의 사내는 김용수다. 춘추의 아버지.'
	),
	P(
		'He looks worse than anyone else in the room. Why is a story called Bihyung. Not this one.',
		'이 방에서 제일 상한 얼굴이다. 이유는 나중에. 비형이라는 이야기에서.'
	),
	{
		kind: 'card',
		person: 'yongsu',
		caption: 'Chunchu’s father. In any other room he talks to the rafters. Not this one.',
		ko: '춘추의 아버지. 다른 방에선 서까래에 대고 말한다. 이 방에선 아니다.'
	},
	D('jinpyung', '#5a86d6', ['Dukman.', 'Come closer.'], ['덕만아.', '가까이 오너라.']),
	D('sunduk', '#E8552B', ['Father.'], ['아버지.']),
	D('jinpyung', '#5a86d6', ['Afraid?'], ['겁나느냐?']),
	D('sunduk', '#E8552B', ['…Yes.'], ['…예.']),
	D(
		'jinpyung',
		'#5a86d6',
		['Good. The other kind make a mess.'],
		['좋다. 안 겁내는 쪽이 일을 망친다.']
	),
	P(
		'He looks past her. At the man by the screen.',
		'그는 딸을 지나, 병풍 곁의 사내를 본다.'
	),
	D('jinpyung', '#5a86d6', ['Yongsu.', 'Come here.'], ['용수.', '이리 오너라.']),
	P(
		'Yongsu comes. He does not talk to the dark. He takes the hand.',
		'용수가 온다. 어둠에 대고 말하지 않는다. 그 손을 잡는다.'
	),
	D('jinpyung', '#5a86d6', ['You kept it.'], ['지켰구나.']),
	P(
		'Yongsu nods once. He is not a man who nods in front of people.',
		'용수가 한 번 끄덕인다. 남 앞에선 끄덕이지 않는 사람이다.'
	),
	P(
		'He beckons Dukman last. Whatever he tells her stays on the pillow. She looks at Yongsu differently after.',
		'마지막에 덕만을 부른다. 그 말은 베개에 남는다. 그 다음부터 덕만의 눈이 용수에게 가 있다.'
	),
	P(
		'He asks if the lamp has oil. It does. Then he doesn’t ask anything else.',
		'등잔에 기름이 남았느냐고 묻는다. 남았다. 그 다음엔 아무것도 묻지 않는다.'
	),
	D(
		'chunmyung',
		'#d8a0e8',
		['He got old in this house.', 'With his name. That’s all I— that’s all I wanted.'],
		['이 집에서 늙었어.', '이름도 그대로. 내가— 내가 바란 게 그거였어.']
	),
	P(
		'Yongsu is still holding the hand.',
		'용수는 그 손을 아직 잡고 있다.'
	),
	D(
		'jinduk',
		'#9d7bd0',
		['Dukman. They’ll sit tonight.'],
		['덕만 언니. 오늘 밤 화백이 앉는대요.']
	),
	D('sunduk', '#E8552B', ['I know.'], ['알아.']),
	P(
		'The lamp burns down. That night the pavilion lights. Six nobles, one brazier, and nobody stands up until they all agree.',
		'등잔이 잦아든다. 그날 밤, 정자에 불이 켜진다. 귀족 여섯, 화로 하나. 뜻이 모두 같아질 때까지 아무도 일어서지 않는다.'
	)
];

found.blocks = [...death, ...b.slice(1)];
writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('Harmony Council blocks:', found.blocks.length, 'opener:', found.blocks[0].html);
