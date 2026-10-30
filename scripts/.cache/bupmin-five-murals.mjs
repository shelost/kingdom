import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

const arc = story.find((a) => a.id === 'five-principles');
if (!arc) throw new Error('five-principles arc not found');
const entry = arc.entries.find((e) => e.title === 'Bupmin');
if (!entry) throw new Error('Bupmin entry not found');

const blocks = entry.blocks;

function findIndex(pred) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found');
	return i;
}

const wallI = findIndex((b) => b.kind === 'scene' && b.label === 'The Long Wall');
const cliffI = findIndex(
	(b, i) => i > wallI && b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('<b>The yard is new.')
);

const wall = [
	{
		kind: 'scene',
		label: 'The Long Wall',
		ko: '긴 벽'
	},
	{
		kind: 'p',
		html: 'The Hwarang hall has a wall nobody is allowed to lean on. It runs the whole length of the yard under its own little roof, and it is painted from end to end.',
		ko: '화랑 연무장에는 아무도 기대면 안 되는 벽이 있다. 마당 길이만큼 길게, 제 지붕을 따로 이고 뻗어 있고, 끝에서 끝까지 그림이 그려져 있다.'
	},
	{
		kind: 'p',
		html: 'When a class has been a month on the yard, the Marshal walks the new boys down it with one lamp. Five bays. One precept each. Then a last bay the yard does not number. He walks them in the order he recited. He has never explained why the last one stands alone.',
		ko: '한 기가 연무장에서 한 달을 보내고 나면, 국선이 등불 하나로 새 아이들을 그 벽을 따라 걷힌다. 칸이 다섯. 계율마다 하나. 그리고 연무장이 번호를 안 매기는 마지막 칸. 외운 순서대로 걷는다. 맨 끝이 왜 혼자인지는 한 번도 말한 적이 없다.'
	},

	// 1. 사군이충 — Geomgun, Geunrang
	{
		kind: 'p',
		html: 'The first bay is a storehouse door and a bowl. A painted boy holds the bowl in both hands. Another painted boy stands in the door and does not come in.',
		ko: '첫 칸은 창고 문과 사발이다. 그린 소년 하나가 사발을 두 손으로 들고 있다. 다른 그린 소년이 문간에 서서, 들어오지 않는다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'첫째다. 사군이충.',
			'검군. 근랑.',
			'흉년이었다. 창고 서기들이 곡식을 빼자고 했다. 검군이 거절했지.',
			'근랑이 화랑이었다. 고발하든지, 도망하든지 하라 했어.',
			'검군은 둘 다 안 했다. 임금의 곡식이니까. 동료를 팔 수도 없으니까.',
			'그 사발을 비웠다.'
		],
		en: [
			'First. Serve the sovereign.',
			'Geomgun. Geunrang.',
			'A famine year. The clerks wanted to skim the grain. Geomgun said no.',
			'Geunrang was the Hwarang. Report them, he said. Or run.',
			'Geomgun did neither. It was the king’s grain. And he would not sell a friend.',
			'He emptied the bowl.'
		]
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['쌀 때문에 죽었단 말이예?'],
		en: ['He died for rice?']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: ['안 집어 가서 죽었네.', '첫째 계율이 그거라네. 누구 곡식이냐.'],
		en: ['He died for not taking it.', 'That is the first precept. Whose grain it is.']
	},

	// 2. 사친이효 — Guriji + unnamed boy
	{
		kind: 'p',
		html: 'The second bay is a night yard. An old man, one hand on a boy’s head. No crown. No horse. Just a gate, and leave being asked for.',
		ko: '둘째 칸은 밤 마당이다. 늙은이, 아이 머리에 손 하나. 관도 없고 말도 없다. 문 하나, 그리고 떠남을 청하는 일.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'둘째다. 사친이효.',
			'구리지. 급찬이었네.',
			'아이가 가야로 가겠다고 밤을 새워 빌었지. 아버지가 머리 위에 손을 얹고 가라 했어.',
			'가서도 아버지를 아버지라 부를 수 있으면, 가라고.'
		],
		en: [
			'Second. Serve your parents.',
			'Guriji. A captain.',
			'The boy sat up all night asking for Gaya. The father put a hand on his head and said go.',
			'Go, if you can still call me father when you get back.'
		]
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['저 아이는 누구입니꺼.'],
		en: ['Who’s the boy.']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: ['나중에.'],
		en: ['Later.']
	},

	// 3. 교우이신 — Yushin, Bidam, Alchun
	{
		kind: 'p',
		html: 'The third bay is older, and the paint has started to go. A tiger on Mount Nam, and three boys about to be eaten by it: a round one with his arms round its neck, one with a sword, one with a string of beads.',
		ko: '셋째 칸은 더 오래됐고, 물감이 바래기 시작했다. 남산의 호랑이 한 마리, 그리고 막 잡아먹히게 생긴 소년 셋. 호랑이 목을 끌어안은 동글한 아이, 칼을 든 아이, 염주를 든 아이.'
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['장군! 저거 장군이시지예!'],
		en: ['Marshal! That’s you!']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: ['계속 걸어라.'],
		en: ['Keep walking.']
	},
	{
		kind: 'p',
		html: 'He doesn’t stop. He doesn’t raise the lamp. The boys have to read it at the edge of the light. The Three Eternal Hwarang, the whole country calls them, and the Marshal walks past himself like a door he has no use for.',
		ko: '그는 멈추지 않는다. 등불도 들지 않는다. 소년들은 불빛 가장자리에서 겨우 그림을 읽는다. 온 나라가 화랑삼웅이라 부르는 그 셋. 장군은 쓸 일 없는 문 앞을 지나가듯 제 그림을 지나간다.'
	},
	{
		kind: 'dialogue',
		person: 'munmu',
		chip: '#3fa9c9',
		lines: ['외숙. 염주 든 분은 누굽니꺼?'],
		en: ['Uncle. Who’s the one with the beads?']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'대신이다. 요새는 말이 줄었다.',
			'……아니다. 똑같다. 요새는 그걸로 녹봉을 받을 뿐이지.',
			'칼 든 기 나고. 호랑이는 알천이 잡았다. 적어 둬라. 그 사람 확인한다.',
			'셋째다. 교우이신. 화공이 우리 셋을 그 칸에 같이 걸었네.',
			'나중에 웃기면 그때 웃게.'
		],
		en: [
			'A councillor. He talks less now.',
			'…No. He talks the same. Now they pay him for it.',
			'Sword is me. Alchun caught the tiger. Write that down. He checks.',
			'Third precept. Trust among friends. The painter hung the three of us in that bay together.',
			'If that gets funny later, laugh then.'
		]
	},

	// 4. 임전무퇴 — Gwisan, Chuhang
	{
		kind: 'p',
		html: 'Then two young men under a fallen horse, arrows standing in them like reeds, and in the corner, painted small, a monk writing.',
		ko: '그다음엔 쓰러진 말 밑의 두 청년. 화살이 갈대처럼 꽂혀 있다. 귀퉁이엔 작게, 뭔가 쓰고 있는 스님 하나.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'넷째다. 임전무퇴.',
			'귀산. 추항.',
			'둘이 스님을 찾아가 속인이 지킬 만한 계율을 청했다. 원광이 준 게 오늘 밤 너거가 외운 그 다섯이다.',
			'이듬해 서쪽 산의 성에서, 둘 다 넷째를 지켰다.',
			'귀산은 그 전에 아버지를 제 말에 태워 보냈다. 둘째도 지킨 셈이지. 벽은 화살만 남겼다.'
		],
		en: [
			'Fourth. Never retreat.',
			'Gwisan. Chuhang.',
			'They went to the monk and asked for rules a layman could keep. Wongwang gave them the five you said tonight.',
			'The next year they kept the fourth one, at a fort in the western hills. Both of them.',
			'Gwisan put his father on his own horse first. He kept the second one too. The wall only kept the arrows.'
		]
	},
	{
		kind: 'p',
		html: 'Bupmin, who said tonight which rule he would break first, looks at the arrows for a long time. Nobody offers to carry his club box for this part.',
		ko: '오늘 밤 어느 계율을 제일 먼저 깰지 말했던 법민이, 화살들을 오래 바라본다. 이 대목에선 아무도 그의 채 함을 들어 주겠다고 나서지 않는다.'
	},

	// 5. 살생유택 — Chunchu
	{
		kind: 'p',
		html: 'The fifth bay is still wet enough to smell. <i>Choose when you kill.</i> A painted deer stands in a painted circle of boys, a plum blossom tied on one horn, very much alive. The boy holding the rope is in magenta, and he is laughing at the judges.',
		ko: '다섯째 칸은 아직 물감 냄새가 난다. <i>살생유택.</i> 그린 사슴 한 마리가 그린 소년들 원 안에 서 있다. 한쪽 뿔에 매화 한 송이. 아주 살아 있다. 고삐를 쥔 소년은 자홍빛이고, 심판들을 보고 웃고 있다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'연무장 놀이였다. 해 지기 전에 사슴 한 마리.',
			'대부분은 안장에 피 묻히고 돌아왔지.',
			'이 놈은 사슴을 끌고 왔다. 사슴이 아직 걷고 있었다.'
		],
		en: [
			'A yard game. One deer before sundown.',
			'Most boys came back with blood on the saddle.',
			'This one came back with the deer. The deer was still walking.'
		]
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['그게 돼예?', '놀이가 죽이라 했는데—'],
		en: ['Does that count?', 'The game said kill—']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'놀이가 사슴을 내라 했지. 죽이라 하진 않았네.',
			'심판들이 소리를 질렀어. 사슴이 제 뿔에서 꽃을 뜯어 먹는 바람에, 줄 수밖에 없었지.',
			'다섯째 계율이 그거라네. 가림.'
		],
		en: [
			'The game said bring a deer. It did not say kill one.',
			'The judges shouted. Then the deer ate the blossom off its own horn, and they had to give it to him.',
			'That is the fifth precept. Choosing.'
		]
	},
	{
		kind: 'p',
		html: 'Beside the deer, still bright: a young man in magenta sits cross-legged at a campfire among forty Baekje raiders. All of them are laughing. Every sword is on the ground.',
		ko: '사슴 옆, 아직 선명한 그림. 자홍빛 옷의 젊은이가 백제 약탈꾼 마흔 틈에서 모닥불 앞에 책상다리로 앉아 있다. 다들 웃고 있다. 칼은 전부 땅바닥에 있다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'서쪽 산에 약탈꾼 진채가 있었다. 두 해 여름을 우리 곡식을 털어 갔지.',
			'그 사람은 술 한 동이 들고 혼자 걸어 들어갔다. 새벽에 포로 마흔을 데리고 걸어 나왔다.',
			'따라오겠다고 지들이 졸랐다. 마흔을 안 죽였네. 다섯째 칸에 또 걸어 둔 이유일세.'
		],
		en: [
			'A raider camp in the western hills. Two summers they’d been taking our grain.',
			'He walked in alone with a jar of wine. At dawn he walked out with forty prisoners.',
			'They asked to come. He did not kill the forty. That is why he hangs in this bay twice.'
		]
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['누굽니꺼, 장군?'],
		en: ['Who is it, Marshal?']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: ['저 아한테 물어봐라.'],
		en: ['Ask him.']
	},
	{
		kind: 'p',
		html: 'He lifts the lamp an inch toward Bupmin. Sixty heads turn. A month as the boy who pulls up at the pine, and Bupmin is suddenly the most interesting person in Surabol.',
		ko: '장군이 등불을 법민 쪽으로 한 치 든다. 머리 예순 개가 돌아간다. 소나무에서 고삐 당기는 아이로 한 달을 지낸 법민이, 갑자기 서라벌에서 제일 흥미로운 사람이 된다.'
	},
	{
		kind: 'dialogue',
		speaker: 'The new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['저기 니 아부지가?!', '술 얘기 참말이가?', '사슴은 진짜로 꽃 뜯어 묵었나?'],
		en: ['That’s your father?!', 'Is it true about the wine?', 'Did the deer really eat the flower?']
	},
	{
		kind: 'dialogue',
		person: 'munmu',
		chip: '#3fa9c9',
		lines: [
			'아버지는 마흔이라 카십니더.',
			'작년 설에는 예순이었고예.',
			'……아버지는 술 덕이라 카시고. 어머니는 아버지 덕이라 카십니더.',
			'사슴은— 아버지가 지금까지 그 이야길 제일 좋아하십니더.'
		],
		en: [
			'He says it was forty.',
			'Last New Year it was sixty.',
			'…He says it was the wine. Mother says it was him.',
			'The deer— that’s still his favourite story.'
		]
	},
	{
		kind: 'p',
		html: 'For the rest of the walk two boys carry Bupmin’s club box without being asked. It lasts until breakfast.',
		ko: '남은 길 내내 두 소년이 시키지도 않았는데 법민의 채 함을 들어 준다. 그 인기는 아침밥 때까지 간다.'
	},

	// 6. Sadaham — all five
	{
		kind: 'p',
		html: 'At the very end, where the wall meets the old gate, the lamp finds a bay the yard does not number. Five small paintings. One face. A dark hall, chin already up. A father’s hand. A river stone. A gate with white cloth on a spear. A fifteen-year-old on one knee, sawing a rope.',
		ko: '맨 끝, 벽이 옛 대문과 만나는 자리에, 등불이 번호 없는 칸을 찾아낸다. 작은 그림 다섯. 얼굴은 하나. 어두운 전각, 이미 든 턱. 아버지의 손. 강가의 돌. 창에 흰 천을 단 성문. 무릎 꿇고 포로 줄을 톱는 열다섯.'
	},
	{
		kind: 'p',
		html: 'Under them, no battle. Two thirteen-year-olds on a riverbank, one scratching at a flat grey stone with a knife, the other watching him do it badly.',
		ko: '그 아래엔 싸움이 없다. 강가의 열세 살 둘. 하나는 납작한 잿빛 돌을 칼로 서툴게 긁고 있고, 하나는 그걸 지켜보고 있다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['이기 다라예?', '저 아이— 둘째 칸 아이다.', '다섯이네.'],
		en: ['That’s it?', 'That boy— the second bay.', 'That’s five.']
	},
	{
		kind: 'p',
		html: 'Yushin sets the lamp down on the ground in front of them. He did not do that for Chunchu, or for the tiger, or for himself.',
		ko: '유신이 그 앞 땅바닥에 등불을 내려놓는다. 춘추 그림 앞에서도, 호랑이 앞에서도, 제 그림 앞에서도 하지 않은 일이다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'앉아라.',
			'다섯 칸을 다 지킨 얼굴은 하나다. 그래서 화랑의 전설이라 하네.',
			'연무장이 아직도 목소리를 낮추는 이름이 둘 있다. 사다함. 무관.',
			'길다.'
		],
		en: [
			'Sit down.',
			'Only one face kept all five. That is why the yard calls him the Legend of the Hwarang.',
			'The yard has two names it still whispers. Sadaham. Mugwan.',
			'It’s a long one.'
		]
	},
	{
		kind: 'p',
		html: '<b>The yard is new. The idea is newer. Two boys share one gap in the hall, and argue about who snores…!</b>',
		ko: '<b>연무장은 새것이고, 그 생각은 더 새것이다. 숙소의 빈자리 하나를 나눠 쓰는 소년 둘이, 누가 코를 고는지 다툰다…!</b>'
	}
];

blocks.splice(wallI, cliffI - wallI + 1, ...wall);
writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', wall.length, 'wall blocks');
