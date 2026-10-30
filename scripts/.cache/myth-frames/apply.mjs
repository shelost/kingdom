// Tamla myths: split Jachungbi out of Gardener into its own episode, and close every myth
// with a daytime Yuri Dora × Gyebek frame (a chore tied to the next tale; Dora slides into it).
// Idempotent: an existing Jachungbi episode or frame scene (same label) is left alone.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const card = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);
const G = (en, ko) => d('gyebek', en, ko);
const Y = (en, ko) => d('yuridora', en, ko);
const captain = (en, lines) => ({ kind: 'dialogue', chip: '#6f7f8f', speaker: 'The Captain', gender: 'm', lines, en });

/** Episode title → frame blocks (inserted before the closing next-episode card) and an optional new card. */
const FRAMES = {
	'Heaven–Earth King': {
		blocks: [
			scene('The Field Wall', '밭담'),
			p('Morning. Yuri Dora has him hauling stones before he can ask what for.', '아침. 유리도라는 계백이 무엇에 쓰느냐고 묻기도 전에 돌부터 지게 한다.'),
			G(['Nine hundred and sixty.'], ['구백예순.']),
			Y(['Good morning to you too, Turtle.'], ['아이고, 좋은 아침이여, 거북아.']),
			p(
				'The stone here is black lava, full of holes. The island stacks it into low walls around every field, loosely, so the wind can get through. Build one tight and the wind knocks it flat.',
				'이 섬 돌은 구멍 숭숭한 검은 현무암이다. 섬은 그걸로 밭마다 나지막한 담을 두른다. 성글게, 바람이 빠져나가도록. 빈틈없이 쌓으면 바람이 쓰러뜨린다.'
			),
			G(['The younger one cheated.', 'With the flowers.'], ['동생이 속였습니다.', '꽃으로.']),
			Y(['He did, so.'], ['속였주.']),
			G(['The elder woke first. He saw the basins.', 'He knew.'], ['형이 먼저 깼습니다. 동이를 봤습니다.', '알았습니다.']),
			Y(['He knew.'], ['알았주.']),
			G(['Then why did he let it stand.'], ['그런데 왜 그대로 두었습니까.']),
			Y(['And what would you have done?'], ['이녁 같으믄 어떵허크라?']),
			G(['Told the father. He was right there.'], ['아버지께 아뢰었을 겁니다. 바로 위에 계셨습니다.']),
			Y(['The father said he wasn’t deciding.'], ['그 아방은 안 정헌댄 했주.']),
			G(['…That is the part I do not follow.'], ['…그 대목을 모르겠습니다.']),
			p(
				'He sets the stone. It rocks. He lifts it off, turns it, and sets it again, and this time it sits.',
				'그는 돌을 얹는다. 흔들린다. 들어내어 돌리고 다시 얹자, 이번엔 앉는다.'
			),
			G(['The mother. With the rice on.'], ['그 어머니. 밥 안쳐 둔.']),
			Y(['What about her.'], ['그 사름이 무사?']),
			G(['……Nothing.'], ['……아닙니다.']),
			Y(
				['Know where all this stone came from?', 'One old woman put it here. Every rock on this field.'],
				['이 돌덜 다 어디서 와신지 알아?', '할망 하나가 놔둔 거여. 이 밭 돌 하나하나 다.']
			),
			G(['One woman.'], ['한 사람입니까.']),
			Y(['One. You’d want to see the size of her.'], ['하나. 그 덩치를 봐사주.'])
		]
	},
	Sulmun: {
		blocks: [
			scene('The Butts', '과녁'),
			p('Gyebek comes down off the mountain at noon, mud to the knee. He went up in the dark.', '계백이 한낮에 무릎까지 진흙을 묻히고 산에서 내려온다. 어두울 때 올라갔다.'),
			Y(['Well?'], ['게난?']),
			G(['Four hundred and ninety-one.'], ['사백아흔하나.']),
			Y(['The last fellow went up there got five hundred and three.'], ['지난번 올라간 놈은 오백셋 세었저.']),
			G(['Then he was wrong.'], ['그럼 그 사람이 틀렸습니다.']),
			Y(['Or you were.'], ['아니믄 이녁이 틀렸든지.']),
			G(['…I will go again.'], ['…다시 가겠습니다.']),
			p('Below the house, Yuri Dora has set two straw butts in the stubble. He hands Gyebek a bow.', '집 아래 그루터기 밭에 유리도라가 짚 과녁 둘을 세워 두었다. 그가 계백에게 활을 건넨다.'),
			G(['I am not an archer.'], ['저는 궁수가 아닙니다.']),
			Y(['Nobody on this island is. Shoot anyway.'], ['이 섬엔 궁수 엇저. 기냥 쏘라.']),
			G(['The silk. Ninety-nine rolls.', 'They could have cut the collar shorter.'], ['명주 말입니다. 아흔아홉 동.', '깃을 짧게 자르면 되었습니다.']),
			Y(['You’d tell her that, would you? Up at her knee?'], ['그 말을 할망한티 허크라? 무릎에 대영?']),
			G(['It is one roll.'], ['한 동입니다.']),
			Y(['Turtle. A woman that size doesn’t take a short collar.', 'No more does a king.'], ['거북아. 그만헌 할망은 짧은 깃 안 받나.', '임금도 안 받고.']),
			p(
				'Gyebek does not answer. It was not a question. He shoots ten arrows instead. They land in a knot the size of a fist, a hand left of centre, every one.',
				'계백은 대답하지 않는다. 물음이 아니었으니까. 대신 화살 열 대를 쏜다. 한가운데서 한 뼘 왼쪽, 주먹만 한 자리에 전부 박힌다.'
			),
			Y(['Not an archer, says he.'], ['궁수 아니렌 허멍.']),
			G(['They are all wrong by the same amount.'], ['전부 같은 만큼 틀렸습니다.']),
			Y(
				['Ha. That’s how this island got carved up, you know. Arrows.', 'Three fellows, three shots. Wherever yours fell, that was yours.'],
				['하. 이 섬은 그걸로 갈랐주. 활로.', '세 놈이 세 대. 떨어진 디가 지 땅.']
			),
			G(['Brothers.'], ['형제였습니까.']),
			Y(['Worse. They came up out of the same hole.'], ['더 고약허주. 한 구멍에서 기어 나와시난.'])
		],
		card: card(
			'Three of them, one hole, and nobody agrees who came out first. Then a box drifts in from the sea…!',
			'셋이 한 구멍에서 나왔는데, 누가 먼저였는지는 끝내 합의가 안 된다. 그러다 바다에서 궤짝 하나가 떠밀려 온다…!'
		)
	},
	'Three Princes': {
		blocks: [
			scene('Sanbang Rock', '산방산'),
			p(
				'Sanbang is one rock the size of a mountain. Halfway up there is a cave, and in the cave a spring. Yuri Dora wants a jar of that water. He wants Gyebek to carry it.',
				'산방산은 산만 한 바위 하나다. 중턱에 굴이 있고, 굴 안에 샘이 있다. 유리도라는 그 물 한 항아리를 원한다. 그걸 계백더러 지고 오게 하고 싶다.'
			),
			G(['The boy in the iron chest.', 'How many years.'], ['무쇠 궤 속의 아이.', '몇 해입니까.']),
			Y(['The story doesn’t say.'], ['이야기엔 엇저.']),
			G(['Someone counted.'], ['누군가는 세었을 겁니다.']),
			Y(['In a box? In the dark? Who’d count in there?'], ['궤 속에서? 캄캄헌디? 누게가 세느니.']),
			G(['I would.'], ['저는 셉니다.']),
			p('Yuri Dora stops on a ledge to get his breath, and looks at him, and believes it.', '유리도라는 바위턱에서 숨을 고르다 그를 본다. 믿긴다.'),
			G(['He came home.'], ['돌아왔습니다.']),
			Y(['He did. Not the way they sent him, mind.'], ['돌아왔주. 보낸 모양 그대로는 아니고.']),
			G(['…He came home.'], ['…돌아왔습니다.']),
			p(
				'At the cave mouth, water drips from the roof into a stone basin, one drop at a time. Gyebek’s lips start to move.',
				'굴 어귀에서 물이 천장에서 돌확으로 한 방울씩 떨어진다. 계백의 입술이 움직이기 시작한다.'
			),
			Y(
				['Don’t bother counting. It’s never once stopped.', 'There was a lady lived in this rock. She came out for a man.'],
				['세지 말라. 한 번도 그친 적 엇저.', '이 바위에 아기씨 하나 살았주. 사내 하나 보젠 나왔저.']
			),
			G(['Which man.'], ['어떤 사내입니까.']),
			Y(
				['A poor one. Fill the jar.', 'And whatever you hear behind you on the way down, don’t look back.'],
				['가난헌 놈. 항아리나 채우라.', '내려갈 때 뒤에서 뭔 소리가 나도, 돌아보지 말고.']
			),
			G(['Why.'], ['왜입니까.']),
			Y(['Tonight.'], ['밤에 골아 주마.'])
		]
	},
	'Stone Lady': {
		blocks: [
			scene('The Kitchen Garden', '텃밭'),
			p(
				'Behind the house Yuri Dora keeps a garden, which is mostly an argument with the wind. Gyebek is put to weeding. He asks which ones are weeds, is told, and pulls exactly those.',
				'유리도라는 집 뒤에 텃밭을 가꾼다. 대부분은 바람과의 말다툼이다. 계백은 김매기를 맡는다. 어느 게 풀이냐고 묻고, 대답을 듣고, 꼭 그것만 뽑는다.'
			),
			G(['The magistrate should not have looked back.'], ['판관은 돌아보지 말았어야 했습니다.']),
			Y(['And you’d not have?'], ['이녁은 안 돌아봤으크라?']),
			G(['He was told not to.'], ['하지 말라는 말을 들었습니다.']),
			G(['The youngest daughter.', 'If she had lied, she could have stayed.'], ['막내딸 말입니다.', '거짓말을 했으면 남을 수 있었습니다.']),
			Y(['In a house that was going blind. Some prize.'], ['눈멀어 가는 집에. 퍽도 좋겠다.']),
			Y(['Go on, then. By whose luck do you live, Turtle?'], ['게민 이녁은? 누구 덕에 사느니, 거북아?']),
			G(['His Majesty’s.'], ['폐하 덕입니다.']),
			Y(['Not heaven’s? Not your father’s?'], ['하늘 덕은? 아방 덕은?']),
			G(['My father told me to forget his name.', 'I did.'], ['아버지는 이름을 잊으라 하셨습니다.', '잊었습니다.']),
			p(
				'He pulls the next weed. Yuri Dora can find nothing to put after that, so he pulls one too.',
				'그는 다음 풀을 뽑는다. 유리도라는 그 뒤에 붙일 말을 찾지 못하고, 저도 하나 뽑는다.'
			),
			p('Gyebek holds up two seedlings, one in each hand. Same leaf, same stem, same grey fuzz.', '계백이 두 손에 모종을 하나씩 들어 보인다. 같은 잎, 같은 줄기, 같은 잿빛 솜털.'),
			G(['These are the same.'], ['이 둘은 같습니다.']),
			Y(['Put the left one back. That’s for the pot.', 'The right one would kill a horse.'], ['왼짝 건 도로 심으라. 국 끓일 거여.', '오른짝 건 말도 죽이주.']),
			G(['They grow in the same row.'], ['같은 고랑에 납니다.']),
			Y(['They do. Heaven keeps a garden like that.', 'It’s never kept a gardener long.'], ['경허주. 하늘에도 그런 밭이 있저.', '꽃감관을 오래 붙잡아 둔 적은 엇주.'])
		]
	},
	Gardener: {
		blocks: [
			scene('The Millet Field', '조밭'),
			p(
				'Millet goes in at the start of summer. The soil here is so light the wind lifts the seed straight back out. So once it is sown, the village drives horses over the field, back and forth, until the ground is packed.',
				'조는 여름 들머리에 뿌린다. 이 섬 흙은 너무 가벼워서 바람이 씨를 도로 들어 간다. 그래서 씨를 뿌리고 나면 마을이 말을 몰아 밭을 밟는다. 이리 갔다 저리 갔다, 땅이 다져질 때까지.'
			),
			p('Gyebek is given the horses. He is as good with horses as he is bad with people.', '계백은 말을 맡는다. 사람에겐 서툰 만큼 말에겐 능숙하다.'),
			G(['Seven hundred and twelve.'], ['칠백열둘.']),
			Y(['I never asked.'], ['안 물어봤저.']),
			G(['…The mother waited fifteen years.'], ['…어머니는 열다섯 해를 기다렸습니다.']),
			Y(['She did.'], ['기다렸주.']),
			G(['Nobody told her fifteen.'], ['열다섯이라고 일러 준 사람은 없었습니다.']),
			Y(['Nobody knew.'], ['아무도 몰랐주.']),
			G(['Then she was counting up.'], ['그럼 끝도 모르고 세었겠습니다.']),
			p('He turns the horses at the wall and brings them back down the field.', '그는 담 앞에서 말머리를 돌려 밭을 도로 내려온다.'),
			G(['The son put her back together.', 'In order.'], ['아들이 어머니를 다시 맞췄습니다.', '순서대로.']),
			Y(['Bone, flesh, blood, breath, soul.'], ['뼈, 살, 피, 숨, 넋.']),
			G(['Can the dead be fetched back.'], ['죽은 사람을 데려올 수 있습니까.']),
			Y(['……In stories.'], ['……이야기 속에선.']),
			p(
				'Neither of them says anything for the whole length of the field. The horses do not care. They reach the wall and turn.',
				'밭 한 끝에서 한 끝까지, 둘 다 아무 말도 하지 않는다. 말들은 상관하지 않는다. 담에 닿으면 돈다.'
			),
			Y(
				['Mind you, this seed came down with a girl.', 'Cut her hair off to sit in a boys’ school. She’d an opinion on that question of yours.'],
				['그런디 이 씨는 처녀 하나가 가져온 거여.', '사내 글방에 앉젠 머리를 잘라 분 처녀. 이녁 그 물음에 그 처녀가 헐 말이 좀 있주.']
			),
			G(['What opinion.'], ['무슨 말입니까.']),
			Y(['Walk the horses, Turtle.'], ['말이나 몰라, 거북아.'])
		],
		card: card(
			'A girl cuts off her hair to sit beside a boy from the sky. Three years at one desk, and he hasn’t noticed a thing…!',
			'한 처녀가 하늘에서 온 도령 곁에 앉으려고 머리를 자른다. 한 책상에서 삼 년, 도령은 아무것도 눈치채지 못한다…!'
		)
	},
	Jachungbi: {
		blocks: [
			scene('Crows', '까마귀'),
			p(
				'The millet is up, a green fuzz over the packed ground. So are the crows. Gyebek is posted on the field wall with a clapper and a heap of pebbles.',
				'조가 올라왔다. 다져 놓은 땅에 푸른 솜털처럼. 까마귀도 올라왔다. 계백은 딸랑이 하나와 자갈 한 무더기를 들고 밭담에 배치된다.'
			),
			G(['She picked them in order.'], ['순서대로 꺾었습니다.']),
			Y(['That’s the part you liked.'], ['이녁은 그 대목이 좋았구나.']),
			G(['It is the part that worked.'], ['그 대목이 통했습니다.']),
			Y(['Not the stream? Three years at one desk, and the boy never noticed?'], ['냇가 대목은? 한 책상에 삼 년을 앉아 놓고 그 도령이 몰랐덴 헌 거?']),
			G(['…Three years is a long time not to notice.'], ['…삼 년이면 모르기엔 깁니다.']),
			p(
				'Yuri Dora gives him a long look. Gyebek is busy with a crow, and misses it. He misses most looks.',
				'유리도라가 그를 한참 바라본다. 계백은 까마귀를 쫓느라 그 눈길을 놓친다. 그는 눈길이란 걸 대개 놓친다.'
			),
			p('One crow will not leave. It sits three stones down the wall and watches them with its head on one side.', '까마귀 한 마리가 떠나지 않는다. 담 세 돌 건너에 앉아 고개를 갸웃하고 둘을 지켜본다.'),
			Y(['Leave that one.', 'Only never give a crow anything with writing on it.'], ['그놈은 놔두라.', '다만 까마귀한티 글 적힌 건 절대 맡기지 말라.']),
			G(['Why.'], ['왜입니까.']),
			Y(
				['The last one lost everybody’s hour.', 'Used to be you went in your turn, Turtle. Old before young. Then a crow got hungry.'],
				['마지막으로 맡은 놈이 사름덜 죽을 시각을 잃어 부렀저.', '옛날엔 차례대로 갔주, 거북아. 늙은이 먼저, 젊은이 나중. 그러다 까마귀 하나가 배가 고팠주.']
			),
			G(['Whose book was it.'], ['누구의 책이었습니까.']),
			Y(['The one who comes for you.'], ['이녁 데리러 오는 사름 거.'])
		],
		card: card(
			'The island keeps one story for last. A magistrate sends a living man down to arrest the judge of the dead…!',
			'섬은 이야기 하나를 맨 끝까지 아껴 둔다. 원님이 산 사람을 저승에 보내 죽은 자의 판관을 잡아 오라 한다…!'
		)
	},
	Kangrim: {
		blocks: [
			scene('The Orange Boat', '귤 배'),
			p(
				'Oranges are the island’s tax, and they ripen in winter. Every basket bound for Sabi is counted on the sand. For once, Gyebek is the most useful man on the beach.',
				'귤은 섬의 세금이고, 겨울에 익는다. 사비로 갈 바구니는 모래밭에서 하나하나 센다. 이번만은 계백이 바닷가에서 제일 쓸모 있는 사내다.'
			),
			G(['The charcoal.', 'Washing it does not make it white.'], ['숯 말입니다.', '씻는다고 희어지지 않습니다.']),
			Y(['That’s the joke, Turtle. The old fellow stopped to laugh at it. That’s how he was caught.'], ['그게 우스운 거주, 거북아. 늙은이가 그거 비웃젠 멈췄다가 잡힌 거여.']),
			G(['…Ah.'], ['…아.']),
			p('Another line in the ledger.', '장부에 한 줄이 또 는다.'),
			G(['The question he asks. At the door.', 'What would he ask me.'], ['문턱에서 묻는다는 그 질문.', '저한테는 무엇을 묻겠습니까.']),
			Y(['……Count your oranges.'], ['……귤이나 세라.']),
			p('The last basket is full. The captain comes up the sand for the tally and keeps his eyes on the baskets.', '마지막 바구니가 찬다. 선장이 셈을 받으러 모래밭을 올라온다. 눈은 바구니에만 둔다.'),
			G(['How many days to Sabi.'], ['사비까지 며칠이오.']),
			captain(['…Eight. If the wind holds.'], ['…여드레유. 바람만 받쳐 주믄.']),
			G(['Thirty-one, less eight.', 'Tell my wife twenty-three.'], ['서른하나에서 여드레.', '내 처에게 스물셋이라 전해 주시오.']),
			p(
				'The captain takes the tally stick and goes back down to the boat without a word. Gyebek does not ask twice. He picks up the next basket.',
				'선장은 셈 막대를 받아 들고 한마디 없이 배로 내려간다. 계백은 두 번 묻지 않는다. 다음 바구니를 든다.'
			)
		]
	}
};

const JACHUNGBI = {
	title: 'Jachungbi',
	subtitle: '자청비',
	year: '태초',
	tone: 'island folklore',
	flash: true,
	flashTone: '#fce7f3',
	flashback: true,
	logline: {
		en: 'A girl cuts her hair to study beside a boy from the sky. When heaven kills him for it, she walks to the end of the west to fetch him back.',
		ko: '하늘에서 온 도령 곁에서 글을 배우려고 머리를 자른 처녀. 하늘이 그 일로 도령을 죽이자, 그를 데려오려 서쪽 끝까지 걸어간다.'
	},
	badges: ['flag:tamla'],
	place: 'western_flower_field',
	kinds: ['myth', 'love']
};

/** Scene headers for the moved blocks, keyed by the opening words of the block they go before. */
const JACHUNGBI_SCENES = [
	['Jachungbi wanted to study', 'The Desk', '글방'],
	['Three years at the same desk', 'The Parting Stream', '이별의 냇물'],
	['So she walks west', 'The Western Flower Field', '서천꽃밭']
];

const plain = (b) =>
	[b.html, b.ko, ...(b.en ?? []), ...(b.lines ?? []), b.label, b.caption]
		.filter(Boolean)
		.join('\n')
		.replace(/<[^>]+>/g, '');

const isCard = (b) => b?.kind === 'p' && /^<b>[\s\S]*<\/b>$/.test(b.html ?? '');

const raw = fs.readFileSync(FILE, 'utf8');
const chapters = JSON.parse(raw);
const chapter = chapters.find((c) => c.id === 'fall-of-euija');
const byTitle = (t) => chapter.entries.find((e) => e.title === t);

/* 1. Split Jachungbi out of Gardener. */
if (!byTitle('Jachungbi')) {
	const gardener = byTitle('Gardener');
	const from = gardener.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Jachungbi');
	const end = gardener.blocks.length - 1;
	if (from < 0 || !isCard(gardener.blocks[end])) throw new Error('Gardener: no Jachungbi scene or closing card');

	const moved = gardener.blocks.slice(from + 1, end);
	const closing = gardener.blocks[end];
	gardener.blocks.splice(from, end - from);
	gardener.kinds = ['myth'];

	for (const [start, label, ko] of [...JACHUNGBI_SCENES].reverse()) {
		const i = moved.findIndex((b) => b.kind === 'p' && b.html.startsWith(start));
		if (i < 0) throw new Error(`Jachungbi: no block starting “${start}”`);
		moved.splice(i, 0, scene(label, ko));
	}

	const text = moved.map(plain).join('\n');
	const images = [];
	gardener.images = gardener.images.filter((im) => {
		const go = im.at ? text.includes(im.at) : im.id.startsWith('jacheongbi');
		if (go) images.push(im);
		return !go;
	});

	const thumbnail = images.find((im) => im.id === 'jacheongbi-wide' && im.tempImage)?.id ?? images[0]?.id;
	const entry = { ...JACHUNGBI, thumbnail, images, blocks: [...moved, closing] };
	chapter.entries.splice(chapter.entries.indexOf(gardener) + 1, 0, entry);
	gardener.blocks.push(p('', '')); /* placeholder card, replaced by the Gardener frame below */
	console.log(`Jachungbi: ${moved.length} blocks, ${images.length} images moved`);
}

/* 2. Frames before each myth's closing card. */
let framed = 0;
for (const [title, { blocks, card: newCard }] of Object.entries(FRAMES)) {
	const entry = byTitle(title);
	if (!entry) throw new Error(`no episode “${title}”`);
	const label = blocks[0].label;
	if (entry.blocks.some((b) => b.kind === 'scene' && b.label === label)) continue;
	const last = entry.blocks.length - 1;
	if (!isCard(entry.blocks[last]) && entry.blocks[last].html !== '') throw new Error(`${title}: last block is not a card`);
	const closing = newCard ?? entry.blocks[last];
	entry.blocks.splice(last, 1, ...blocks, closing);
	framed++;
}

const empty = chapter.entries.flatMap((e) => e.blocks).filter((b) => b.kind === 'p' && b.html === '');
if (empty.length) throw new Error('placeholder card left behind');

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));
console.log(`frames added: ${framed}`);
