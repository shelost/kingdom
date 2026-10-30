import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

const arc = story.find((a) => a.id === 'five-principles' || a.title === 'The Five Principles');
if (!arc) throw new Error('five-principles arc not found');
const entry = arc.entries.find((e) => e.title === 'Bupmin');
if (!entry) throw new Error('Bupmin entry not found');

const blocks = entry.blocks;

function findIndex(pred) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + pred);
	return i;
}

// 1. After the Hwarang diagram: name the first headband.
const diagramI = findIndex((b) => b.kind === 'diagram' && b.diagram === 'hwarang');
const afterDiagram = blocks[diagramI + 1];
if (afterDiagram?.kind === 'p' && !/Seolwon|설원/.test(afterDiagram.html + afterDiagram.ko)) {
	blocks.splice(diagramI + 1, 0, {
		kind: 'p',
		html: 'The first headband they ever named was Seolwon. First 국선. They put a stone up for him in the east, then painted him on the yard wall so the new boys would have someone to walk past on the way to the latrines. That is about right. The rest of the wall is what the name was supposed to cost.',
		ko: '머리띠를 처음 이름 붙여 준 사람은 설원이다. 초대 국선. 동쪽에 비를 세워 주고, 연무장 벽에 그려 두었으니, 새내기들이 뒷간 가며 지나칠 얼굴이 있게. 그게 맞다. 벽의 나머지는, 그 이름이 얼마를 받기로 했는지다.'
	});
}

// 2. Eaves: Wongwang, and the wall is who kept the five.
const eavesP = blocks.find(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('A monk wrote them for boys')
);
if (!eavesP) throw new Error('eaves monk paragraph not found');
eavesP.html =
	'At dusk he gathers the flower youth under the eaves and speaks the <b>Five Principles</b>, the way other houses recite ancestors. Wongwang wrote them for boys who would never be monks. The long wall is who kept them. Loyalty to the king comes first, so nobody can say they missed it. Duty to your father is easy, until the king and your father want different things. The boys elbow each other at <i>no retreat</i>. They go quiet at <i>no needless killing</i>. Boys skip that one. Old soldiers don’t. Each of them is privately certain the Marshal is looking at him. He is looking at all of them.';
eavesP.ko =
	'해 질 녘 그는 처마 아래 꽃다운 소년들을 모으고, 다른 집이 조상을 외듯 <b>세속오계</b>를 왼다. 원광이 중이 될 리 없는 아이들을 위해 지은 계율이다. 긴 벽이 지킨 사람들이다. 임금에 대한 충성이 맨 앞이다. 못 들었다는 소리는 못 하게. 부모에 대한 효는 쉽다. 임금과 아버지가 서로 다른 걸 원하기 전까지는. 소년들은 <i>임전무퇴</i>에서 서로 팔꿈치를 찌른다. <i>살생유택</i>에서는 조용해진다. 아이들은 그 계율을 건너뛴다. 늙은 군인들은 안 그런다. 저마다 장군이 바로 자기를 보고 있다고 남몰래 확신한다. 장군은 그들 모두를 보고 있다.';

// 3. Replace The Long Wall through the cliffhanger.
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
		html: 'The Hwarang hall has a wall nobody is allowed to lean on. It runs the whole length of the yard under its own little roof, and it is painted from end to end. The newest paint is by the gate. The oldest is so far down that the new boys have never walked that far.',
		ko: '화랑 연무장에는 아무도 기대면 안 되는 벽이 있다. 마당 길이만큼 길게, 제 지붕을 따로 이고 뻗어 있고, 끝에서 끝까지 그림이 그려져 있다. 가장 새 그림은 대문 곁에 있다. 가장 오래된 그림은 하도 멀어서, 새내기들은 거기까지 걸어가 본 적이 없다.'
	},
	{
		kind: 'p',
		html: 'When a class has been a month on the yard, the Marshal walks the new boys down it with one lamp. Five bays. One precept each. He starts at the gate and walks backwards through time. He has never explained why.',
		ko: '한 기가 연무장에서 한 달을 보내고 나면, 국선이 등불 하나로 새 아이들을 그 벽을 따라 걷힌다. 칸이 다섯. 계율마다 하나. 문에서 시작해 시간을 거꾸로 걷는다. 이유는 한 번도 말한 적이 없다.'
	},
	{
		kind: 'p',
		html: 'The first bay is still wet enough to smell. <i>Choose when you kill.</i> A painted deer stands in a painted circle of boys, a plum blossom tied on one horn, very much alive. The boy holding the rope is in magenta, and he is laughing at the judges.',
		ko: '첫 칸은 아직 물감 냄새가 난다. <i>살생유택.</i> 그린 사슴 한 마리가 그린 소년들 원 안에 서 있다. 한쪽 뿔에 매화 한 송이. 아주 살아 있다. 고삐를 쥔 소년은 자홍빛이고, 심판들을 보고 웃고 있다.'
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
	{
		kind: 'p',
		html: 'Low in the same bay, older paint, almost a footnote: a fifteen-year-old on one knee, sawing a rope of kneeling captives. The yard has not reached his name yet. Yushin does not raise the lamp for him.',
		ko: '같은 칸 아래, 더 낡은 물감, 주석처럼. 무릎 꿇은 포로들의 줄을 톱질하는 열다섯. 연무장은 아직 그 이름에 이르지 않았다. 유신은 그를 위해 등불을 들지 않는다.'
	},
	{
		kind: 'p',
		html: 'The next stretch of wall is older, and the paint has started to go. A tiger on Mount Nam, and three boys about to be eaten by it: a round one with his arms round its neck, one with a sword, one with a string of beads.',
		ko: '다음 벽은 더 오래됐고, 물감이 바래기 시작했다. 남산의 호랑이 한 마리, 그리고 막 잡아먹히게 생긴 소년 셋. 호랑이 목을 끌어안은 동글한 아이, 칼을 든 아이, 염주를 든 아이.'
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
			'화공이 우리 셋을 계율에 나눠 걸었네. 나는 네 번째. 염주는 첫 번째. 호랑이 목은 세 번째.',
			'나중에 웃기면 그때 웃게.'
		],
		en: [
			'A councillor. He talks less now.',
			'…No. He talks the same. Now they pay him for it.',
			'Sword is me. Alchun caught the tiger. Write that down. He checks.',
			'The painter hung the three of us on three precepts. I got the fourth. The beads got the first. The neck got the third.',
			'If that gets funny later, laugh then.'
		]
	},
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
			'귀산. 추항.',
			'둘이 스님을 찾아가 속인이 지킬 만한 계율을 청했다. 원광이 준 게 오늘 밤 너거가 외운 그 다섯이다.',
			'이듬해 서쪽 산의 성에서, 둘 다 네 번째를 지켰다.',
			'귀산은 그 전에 아버지를 제 말에 태워 보냈다. 두 번째도 지킨 셈이지.'
		],
		en: [
			'Gwisan. Chuhang.',
			'They went to the monk and asked for rules a layman could keep. Wongwang gave them the five you said tonight.',
			'The next year they kept the fourth one, at a fort in the western hills. Both of them.',
			'Gwisan put his father on his own horse first. So he kept the second one too.'
		]
	},
	{
		kind: 'p',
		html: 'Bupmin, who said tonight which rule he would break first, looks at the arrows for a long time. Nobody offers to carry his club box for this part.',
		ko: '오늘 밤 어느 계율을 제일 먼저 깰지 말했던 법민이, 화살들을 오래 바라본다. 이 대목에선 아무도 그의 채 함을 들어 주겠다고 나서지 않는다.'
	},
	{
		kind: 'p',
		html: 'After that the wall gets older and the Marshal does not walk faster. The boys wish he would. Three painted youths look up at a painted comet, and a small monk has his mouth open. Yushin gives that one half a lamp.',
		ko: '그다음부터 벽은 더 오래된다. 장군의 걸음은 빨라지지 않는다. 소년들은 빨라지길 바란다. 그린 소년 셋이 그린 혜성을 올려다보고, 작은 스님이 입을 벌리고 있다. 유신은 그 그림에 등불을 반만 준다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'동쪽에서 배가 오던 해다.',
			'스님이 노래를 불렀지. 별이 꺼지고 배가 돌아갔다.',
			'계율은 아니네. 그래도 걸어 둔다. 화랑이 산천을 다닐 때 무슨 일이 생기는지, 그 칸이거든.'
		],
		en: [
			'The year the ships came from the east.',
			'A monk sang. The star went out. The ships turned around.',
			'Not a precept. We hang it anyway. That bay is what happens when Hwarang walk the hills.'
		]
	},
	{
		kind: 'p',
		html: 'Then the first precept’s old paint. A boy of fifteen on both knees in a dark hall, chin already up, asking a king for the first horse through a gate. The Cloud King is a red sleeve on a dais. He looks amused, which is how that king looked when he was about to say yes.',
		ko: '그다음이 첫째 계율의 낡은 그림. 어두운 전각에서 열다섯이 두 무릎을 꿇고, 이미 턱을 든 채, 성문 첫 말을 임금에게 청한다. 구름왕은 대 위의 붉은 소매다. 재미있어 보인다. 그 임금이 예스 하려 할 때의 얼굴이다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['저 아이 또 나와예.', '포로 줄 톱던—'],
		en: ['That boy again.', 'The one sawing the rope—']
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: ['아직 이름 말 안 했네.', '첫째 칸이다. 사군이충. 임금에게 청한 기 아버지보다 나중이었네.'],
		en: ['I have not said the name yet.', 'First precept. Serve the sovereign. He asked the king after he asked his father.']
	},
	{
		kind: 'p',
		html: 'The father is the next panel. An old man in a yard at night, one hand on the same boy’s head. No crown. No horse. Just a gate, and leave being asked for.',
		ko: '아버지가 다음 그림이다. 밤 마당의 늙은이, 같은 아이 머리에 손 하나. 관도 없고 말도 없다. 문 하나, 그리고 떠남을 청하는 일.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'구리지. 급찬이었네.',
			'아이가 가야로 가겠다고 밤을 새워 빌었지. 아버지가 머리 위에 손을 얹고 가라 했어.',
			'둘째다. 사친이효. 가서도 아버지를 아버지라 부를 수 있으면, 가라고.'
		],
		en: [
			'Guriji. A captain.',
			'The boy sat up all night asking for Gaya. The father put a hand on his head and said go.',
			'Second precept. Serve your parents. Go, if you can still call me father when you get back.'
		]
	},
	{
		kind: 'p',
		html: 'The fourth bay is a gate. White cloth on a spear, a boy first through it, fifteen, no helm. Great Gaya’s timber under smoke. The painter gave him the whole gate and almost no army, which is how the yard likes a charge remembered.',
		ko: '넷째 칸은 성문이다. 창에 흰 천, 투구 없이 먼저 들어가는 열다섯. 연기 아래 대가야의 나무. 화공은 성문만 주고 군대는 거의 안 그렸다. 연무장이 돌격을 기억하는 방식이다.'
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'넷째. 임전무퇴.',
			'저 아이가 문을 열었다. 열다섯이었다.',
			'내 할배가 그 산 위에 계셨네. 막지 않으셨다.'
		],
		en: [
			'Fourth. Never retreat.',
			'That boy opened the gate. He was fifteen.',
			'My grandfather was on that hill. He did not stop him.'
		]
	},
	{
		kind: 'p',
		html: 'A new boy starts counting on his fingers. Deer. Rope. King. Father. Gate. He runs out of fingers before he runs out of the same face.',
		ko: '새내기 하나가 손가락을 접기 시작한다. 사슴. 줄. 임금. 아버지. 문. 얼굴이 바닥나기 전에 손가락이 먼저 바닥난다.'
	},
	{
		kind: 'p',
		html: 'At the very end, where the wall meets the old gate, the lamp finds two boys. No battle. No horse. Two thirteen-year-olds on a riverbank, one scratching at a flat grey stone with a knife, the other watching him do it badly.',
		ko: '맨 끝, 벽이 옛 대문과 만나는 자리에서 등불이 소년 둘을 찾아낸다. 싸움도 없고 말도 없다. 강가의 열세 살 둘. 하나는 납작한 잿빛 돌을 칼로 서툴게 긁고 있고, 하나는 그걸 지켜보고 있다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A new Hwarang',
		gender: 'm',
		chip: '#6b7280',
		lines: ['이기 다라예?', '뭘 했는데예?', '저 아이 또— 다섯이네.'],
		en: ['That’s it?', 'What did they do?', 'That boy again— that’s five.']
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
			'다섯 칸에 다 걸린 얼굴은 하나다. 그래서 화랑의 전설이라 하네.',
			'연무장이 아직도 목소리를 낮추는 이름이 둘 있다. 사다함. 무관.',
			'셋째다. 교우이신. 길다.'
		],
		en: [
			'Sit down.',
			'Only one face hangs in all five bays. That is why the yard calls him the Legend of the Hwarang.',
			'The yard has two names it still whispers. Sadaham. Mugwan.',
			'Third precept. Trust among friends. It’s a long one.'
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
console.log('Bupmin wall restructured', {
	diagramInsert: true,
	eaves: true,
	wallBlocks: wall.length
});
