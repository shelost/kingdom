// One-shot: ordinals request — drop Inmun, rename Munhee / Yeon's Massacre, split Sadaham out of Bupmin.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';
const BACKUP = 'scripts/.cache/prev-stills/story.pre-sadaham.json';

const raw = fs.readFileSync(FILE, 'utf8');
if (!fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, raw);
const story = JSON.parse(raw);
const chapters = Array.isArray(story) ? story : story.chapters;

const chapter = (id) => {
	const ch = chapters.find((c) => c.id === id);
	if (!ch) throw new Error(`no chapter ${id}`);
	return ch;
};
const entry = (ch, title) => {
	const e = ch.entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${title} in ${ch.id}`);
	return e;
};

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, chip, en, lines) => ({ kind: 'dialogue', person, chip, en, lines });
const voice = (speaker, chip, en, lines) => ({ kind: 'dialogue', chip, lines, en, speaker });
const memory = (year, title, blocks) => ({ kind: 'flashback', year, title, blocks });

const YUSHIN = '#4a8fe0';
const BUPMIN = '#3fa9c9';
const SADAHAM = '#6fa8ff';
const MUGWAN = '#7aa0c8';
const JINHEUNG = '#2f6fd4';
const BOY = '#6b7280';

/* ————— Inmun out; its Punghun card hands the Wanggeom's Guest straight to Maeso ————— */
const war = chapter('silla-tang-war');
const inmun = entry(war, 'Inmun');
const guest = entry(war, "The Wanggeom's Guest");
guest.blocks[guest.blocks.length - 1] = inmun.blocks[inmun.blocks.length - 1];
war.entries = war.entries.filter((e) => e !== inmun);

/* ————— renames ————— */
entry(chapter('five-principles'), 'Chunchu & Munhee').title = 'Munhee';
const massacre = entry(chapter('iron-will'), 'Supreme Commander');
massacre.title = 'Yeon’s Massacre';
massacre.subtitle = '연개소문의 정변';

/* ————— Sadaham: Yushin's tale under the eaves, split out of Bupmin ————— */
const five = chapter('five-principles');
const bupmin = entry(five, 'Bupmin');
const FRAME_START = bupmin.blocks.findIndex(
	(b) => b.kind === 'p' && b.html.includes('the two names the yard still lowers its voice for')
);
if (FRAME_START < 0) throw new Error('Bupmin frame block not found');
const [frameP, yushinTwo, , thatIsFriends, betterChairs, gotasoCard] = bupmin.blocks.slice(FRAME_START);

const sadahamSlots = bupmin.images.filter((im) => im.id.startsWith('sadaham'));
bupmin.images = bupmin.images.filter((im) => !im.id.startsWith('sadaham'));
bupmin.thumbnail = 'bupmin-hwarang-yard';
bupmin.blocks = [
	...bupmin.blocks.slice(0, FRAME_START),
	p(
		'<b>The yard has two names it still whispers. Tonight the Marshal says them out loud…!</b>',
		'<b>연무장이 아직도 목소리를 낮추는 이름이 둘 있다. 오늘 밤, 장군이 그 이름을 소리 내어 말한다…!</b>'
	)
];

const sadaham = {
	year: '641',
	tone: 'campfire tale (Hwarang)',
	subtitle: '사다함',
	thumbnail: 'sadaham-seq-mugwan-vow',
	badges: ['flag:silla', '🌙'],
	music: 'The Crescent Moon',
	title: 'Sadaham',
	place: 'surabol',
	images: sadahamSlots,
	blocks: [
		{ kind: 'scene', label: 'The First Class', ko: '제일기' },
		p(
			'Every yard has its ghosts. This one has two, and they have never missed roll call.',
			'연무장마다 귀신이 있다. 이곳엔 둘이다. 점호에 빠진 적이 한 번도 없다.'
		),
		p(
			'The lamps go up under the eaves. Nobody sends the boys to bed. They decide this is an honour, and they are right, though not for the reason they think.',
			'처마 아래 등이 걸린다. 아무도 소년들을 재우러 보내지 않는다. 소년들은 이를 영광으로 여긴다. 맞는 말이다. 다만 그들이 생각하는 이유는 아니다.'
		),
		{
			...frameP,
			html: frameP.html.replace(/^Under the eaves he does not let/, 'The Marshal does not let'),
			ko: frameP.ko.replace(/^처마 아래서 그는/, '장군은')
		},
		yushinTwo,
		say('munmu', BUPMIN, ['Which one, Uncle?', 'Which one kept it?'], ['어느 쪽이요, 외숙부?', '누가 지켰는데요?']),
		say('yushin', YUSHIN, ['Sit down and you’ll find out.'], ['앉으면 알게 된다.']),
		voice('A new boy', BOY, ['Is this the one about the haunted lake?'], ['호수 귀신 얘기예요?']),
		say('yushin', YUSHIN, ['No. That one’s about me.'], ['아니. 그건 내 얘기다.']),

		memory('560', 'the first class', [
			p(
				'Back then the yard was new, and so was the idea. The king wanted boys who would ride ahead of the army and not ask why. The first year, he got a lot of them. Two of them got each other.',
				'그때는 연무장도 새것이었고, 그 생각도 새것이었다. 왕은 군대보다 앞서 달리면서 이유를 묻지 않을 소년들을 원했다. 첫해에 그런 소년은 많이 왔다. 그중 둘은 서로를 얻었다.'
			),
			p(
				'<b>Sadaham</b> is thirteen and talks like a dare. <b>Mugwan</b> is thirteen too, and says less than his horse. The hall has one gap, so they share it. They argue for a month about who snores.',
				'<b>사다함</b>은 열셋이고, 말마다 내기를 건다. <b>무관랑</b>도 열셋인데, 자기가 타는 말보다도 말수가 적다. 방에 빈자리가 하나뿐이라 둘은 한 방에 든다. 누가 코를 고는지 한 달을 다툰다.'
			),
			say('sadaham', SADAHAM, ['You snore.', 'Don’t argue. The whole hall heard you.'], ['너 코 골아.', '우기지 마. 방 전체가 들었어.']),
			say('mugwan', MUGWAN, ['That was you.'], ['그거 너야.']),
			say('sadaham', SADAHAM, ['…Then prove it. Stay up and listen.'], ['…그럼 증명해. 안 자고 들어 봐.']),
			p(
				'Mugwan stays up. It is the first of a great many nights he will stay up for Sadaham, and the only one either of them will find funny.',
				'무관랑은 안 자고 듣는다. 앞으로 사다함 때문에 지새울 수많은 밤 가운데 첫날이고, 둘 다 웃을 수 있는 건 그날 밤뿐이다.'
			)
		]),
		voice('A new boy', BOY, ['So who snored?'], ['그래서 누가 코 골았어요?']),
		say('yushin', YUSHIN, ['Both. That is not the story.'], ['둘 다. 그게 이야기가 아니다.']),

		memory('562', 'too young', [
			p(
				'Two summers on, Great Gaya stops paying. The king calls the war in his hall, and the hall fills up with men old enough to have opinions.',
				'두 해 뒤 여름, 대가야가 공물을 끊는다. 왕은 전당에서 전쟁을 정하고, 전당은 할 말이 있을 만한 나이의 사내들로 가득 찬다.'
			),
			p(
				'<b>Sadaham</b> was fifteen when he asked to ride against Great Gaya. He asked on his knees, in front of everyone. It is the only way a boy can ask a king for anything and not be sent outside.',
				'<b>사다함</b>은 열다섯에 대가야를 치겠다고 청했다. 무릎을 꿇고, 모두가 보는 앞에서. 소년이 왕에게 무언가를 청하면서 쫓겨나지 않는 방법은 그것뿐이다.'
			),
			say('jinheung', JINHEUNG, ['Go home. Grow a beard.', 'War is not a yard. Nobody hands the ball back.'], ['집에 가라. 수염이나 길러 오너라.', '전쟁은 연무장이 아니다. 공을 돌려주는 놈이 없어.']),
			say('sadaham', SADAHAM, ['Then I’ll ask again tomorrow.'], ['그럼 내일 다시 여쭙겠습니다.']),
			p(
				'He does. And the day after. The old general leading the campaign once took an island by frightening it with wooden lions. He tells the king it will be quicker to bring the boy than to keep hearing him.',
				'청한다. 그다음 날도. 원정을 맡은 늙은 장군은 예전에 나무 사자로 겁을 줘서 섬 하나를 통째로 받아 낸 사람이다. 그가 왕에게 아뢴다. 저 아이를 데려가는 편이 저 아이 말을 계속 듣는 것보다 빠르겠다고.'
			),
			say('jinheung', JINHEUNG, ['Fine. Take him.', 'If he dies, it was his idea. Write that down.'], ['좋다. 데려가라.', '죽으면 제 생각이었던 거다. 적어 둬라.']),
			say('mugwan', MUGWAN, ['You’re going.'], ['가는구나.']),
			say('sadaham', SADAHAM, ['We’re going.', 'I told them you’re my second. Don’t make me a liar.'], ['우리가 가는 거야.', '네가 내 부장이라고 했어. 나 거짓말쟁이 만들지 마.']),
			say('mugwan', MUGWAN, ['You didn’t ask me.'], ['나한테 안 물어봤잖아.']),
			say('sadaham', SADAHAM, ['I’m asking now.', '…Well?'], ['지금 묻잖아.', '…그래서?']),
			say('mugwan', MUGWAN, ['…I’ll get the horses.'], ['…말 꺼내 올게.'])
		]),
		say('munmu', BUPMIN, ['And the battle? Uncle, what happened at the gate?'], ['그래서 싸움은요? 외숙부, 성문에서 어떻게 됐어요?']),
		say(
			'yushin',
			YUSHIN,
			['Any old man in the market will give you the gate. He’ll get it wrong, but he’ll give it to you.', 'I am telling you about the rice.'],
			['시장 노인 아무나 붙잡아라. 성문 얘기는 해 줄 거다. 틀리게 하겠지만, 해는 줄 거다.', '나는 밥 이야기를 하는 중이다.']
		),

		memory('562', 'the prize', [
			p(
				'Afterward the king pays him the way kings pay: in people. Three hundred Gaya captives, roped in a line, his to keep. Sadaham walks down the line once. Then he starts cutting rope.',
				'싸움이 끝나자 왕은 왕들이 늘 하는 방식으로 값을 치른다. 사람으로. 줄줄이 묶인 가야 포로 삼백, 그의 몫이다. 사다함은 줄을 따라 한 번 걸어 내려간다. 그러고는 밧줄을 끊기 시작한다.'
			),
			say('mugwan', MUGWAN, ['The court will say you’re showing off.'], ['조정에선 네가 잘난 척한다고 할 거다.']),
			say('sadaham', SADAHAM, ['Then the court can have them back.', 'Help me with this knot.'], ['그럼 조정이 도로 가져가든가.', '이 매듭 좀 도와.']),
			p(
				'The land they give him instead is a strip of stones by the Alcheon that nobody wanted. The chronicle calls this virtue. Mugwan calls it typical, and holds the knot.',
				'대신 받은 땅은 알천 가의, 아무도 원하지 않던 돌밭이다. 기록은 이를 덕이라 한다. 무관랑은 늘 그렇다고 하고, 매듭을 잡아 준다.'
			)
		]),
		say('munmu', BUPMIN, ['My father would have found a use for three hundred people.'], ['아버지셨으면 삼백 명을 어디 쓸 데를 찾으셨을 거예요.']),
		say('yushin', YUSHIN, ['Your father would have found a use for three hundred and one.'], ['네 아비라면 삼백한 명 쓸 데를 찾았을 거다.']),

		memory('563', 'the swear', [
			p(
				'That winter Mugwan catches a cough he cannot put down. Sadaham sits by the mat and counts his breathing, the way they used to count snores.',
				'그 겨울, 무관랑은 내려놓을 수 없는 기침을 얻는다. 사다함은 자리 옆에 앉아 숨소리를 센다. 예전에 코 고는 소리를 세던 것처럼.'
			),
			say('mugwan', MUGWAN, ['Go eat. You smell like a sickroom.'], ['가서 밥 먹어. 너한테 병자 냄새 나.']),
			say('sadaham', SADAHAM, ['You remember what we swore.'], ['우리 맹세한 거 기억하지.']),
			say('mugwan', MUGWAN, ['We were thirteen. We also swore to marry the same girl.'], ['열셋이었어. 같은 여자랑 혼인하자고도 맹세했잖아.']),
			say('sadaham', SADAHAM, ['If you die first, I will not eat.', 'So don’t.'], ['네가 먼저 죽으면 나는 안 먹는다.', '그러니까 죽지 마.']),
			say('mugwan', MUGWAN, ['If I die first— you already know.'], ['내가 먼저 죽으면 — 너는 이미 알지.']),
			say('sadaham', SADAHAM, ['Then neither of us is allowed to be late.'], ['그럼 우리 둘 다 늦으면 안 된다.']),
			p(
				'<b>Mugwan</b> died of illness not long after the campaign. He did it quietly, the way he did everything, before dawn, so as not to wake anyone.',
				'<b>무관랑</b>은 전역이 끝난 지 얼마 되지 않아 병으로 죽었다. 무엇이든 그렇게 했듯 조용히, 새벽이 오기 전에, 아무도 깨우지 않으려는 듯이.'
			)
		]),

		memory('564', 'seven days', [
			p(
				'Sadaham did not take food for seven days. The cooks left bowls by his door. The order sent its oldest men to argue with him. He thanked them, and did not eat.',
				'사다함은 이레 동안 음식을 들지 않았다. 부엌에선 문 앞에 그릇을 두었다. 화랑은 가장 나이 든 이들을 보내 그를 설득했다. 그는 고맙다고 하고, 먹지 않았다.'
			),
			say('sadaham', SADAHAM, ['…It’s quiet in here. Nobody snoring.'], ['…조용하네. 코 고는 놈이 없어.']),
			p(
				'He was seventeen. The order buried two headbands and kept the story, because a Hwarang who outlives his vow is only a boy with a nice coat.',
				'열일곱이었다. 화랑은 머리띠 둘을 묻고 이야기를 남겼다. 맹세보다 오래 사는 화랑은, 옷만 좋은 소년에 불과하므로.'
			)
		]),

		p(
			'The lamp under the eaves has burned down a finger’s width. Nobody has moved. One boy is pretending he has something in his eye, and the others are kind enough to look at the lamp.',
			'처마 아래 등잔 기름이 손가락 한 마디만큼 줄었다. 아무도 움직이지 않았다. 한 소년은 눈에 뭐가 들어간 척하고, 나머지는 친절하게도 등잔만 본다.'
		),
		thatIsFriends,
		betterChairs,
		say('munmu', BUPMIN, ['Uncle.', 'Who would you stop eating for?'], ['외숙부.', '외숙부는 누구 때문이면 밥을 끊으시겠어요?']),
		p(
			'Yushin looks at the boy for a long moment. You can probably name her. He doesn’t.',
			'유신은 한참 동안 소년을 본다. 당신은 아마 그 이름을 댈 수 있을 것이다. 그는 대지 않는다.'
		),
		say('yushin', YUSHIN, ['…Go to bed. Gyuku at dawn.'], ['…가서 자라. 새벽에 격구다.']),
		gotasoCard
	]
};

five.entries.splice(five.entries.indexOf(bupmin) + 1, 0, sadaham);

fs.writeFileSync(FILE, JSON.stringify(story, null, '\t') + '\n');
console.log('ok', { bupminBlocks: bupmin.blocks.length, sadahamBlocks: sadaham.blocks.length, slots: sadahamSlots.length });
