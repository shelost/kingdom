import { editStory, find, lists } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const D = ({ person, speaker, gender = 'm', en, lines, look, chip }) => {
	const b = { kind: 'dialogue', en, lines };
	if (person) b.person = person;
	if (speaker) {
		b.speaker = speaker;
		b.gender = gender;
	}
	if (look) b.look = look;
	if (chip) b.chip = chip;
	return b;
};
const S = (label, ko) => ({ kind: 'scene', label, ko });

const bidam = { person: 'bidam', look: 'hwarang', chip: '#141C2E' };
const yushinH = { person: 'yushin', look: 'hwarang', chip: '#4a8fe0' };
const alchunBoy = { person: 'alchun', look: 'hwarang', chip: '#8fb3e0' };
const alchunOld = { person: 'alchun', look: 'councillor', chip: '#8fb3e0' };
const chunchu = { person: 'chunchu', look: 'hwarang', chip: '#D8258C' };
const sadaham = { person: 'sadaham', chip: '#6fa8ff' };
const mugwan = { person: 'mugwan' };
const isabu = { person: 'isabu' };

function one(entry, frag) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`"${frag.slice(0, 60)}" → ${hits.length} in ${entry.title}`);
	return hits[0];
}

function replaceFb(entry, title, blocks) {
	let fb;
	for (const list of lists(entry)) {
		const hit = list.find((b) => b.kind === 'flashback' && b.title === title);
		if (hit) fb = hit;
	}
	if (!fb) throw new Error(`no flashback ${title} in ${entry.title}`);
	fb.blocks = blocks;
}

function replaceRange(entry, startFrag, endFrag, blocks) {
	const a = one(entry, startFrag);
	const b = one(entry, endFrag);
	if (a.list !== b.list) throw new Error(`range crosses lists: ${startFrag}`);
	a.list.splice(a.i, b.i - a.i + 1, ...blocks);
}

function setHtml(entry, frag, html, ko) {
	const { b } = one(entry, frag);
	b.html = html;
	b.ko = ko;
}

function setLines(entry, frag, en, lines) {
	const { b } = one(entry, frag);
	b.en = en;
	b.lines = lines;
}

const TIGER = [
	P(
		'Class 51 draws lots in the yard before the heat comes up. Each hyangdo goes into the forest and brings back a piece of an animal, and the Marshal will not say what counts until you are standing in front of him with it.',
		'오십일기가 더위 오기 전에 연무장에서 제비를 뽑는다. 향도마다 숲에 들어가 짐승 조각을 가져온다. 도감은 그걸 들고 앞에 서기 전엔, 뭐가 인정인지 안 말해 준다.'
	),
	P(
		'Nam is all pines from above. Then it is a path, and a goat, and three boys who have not yet decided who is bait.',
		'남산은 위에선 소나무뿐이다. 그다음이 길이고, 염소고, 누가 미끼인지 아직 안 정한 아이 셋이다.'
	),
	D({
		...alchunBoy,
		en: ['Deer.', 'I’m telling you. Deer is food after.'],
		lines: ['사슴.', '사슴이라니까. 나중에 먹을 거잖아.']
	}),
	D({ ...bidam, en: ['You ate before we drew.'], lines: ['뽑기 전에 먹었잖소.'] }),
	D({
		...alchunBoy,
		en: ['That was breakfast.', 'This would be lunch.'],
		lines: ['그건 아침이고.', '이건 점심이지.']
	}),
	P(
		'Bidam’s three draw the tiger. The Marshal looks at the lot, then at the three of them, and does not offer to redraw. Alchun laughs once, the way you laugh at a joke that has already landed on you.',
		'비담의 셋은 호랑이가 나온다. 도감이 제비를 보고, 셋을 보고, 다시 뽑으라고 하지 않는다. 알천이 한 번 웃는다. 이미 자기 앞에 떨어진 농담을 보고 웃는 웃음이다.'
	),
	D({
		...alchunBoy,
		en: ['We’re going to die.', 'Anyone want the rest of this?', 'No, seriously. I’ll take a deer. Someone swap.'],
		lines: ['우리 죽네.', '이거 남은 거 먹을 사람?', '야, 진짜. 나 사슴 할게. 바꿔 줄 사람.']
	}),
	D({ ...yushinH, en: ['Put it away.', 'We’re going.'], lines: ['치워.', '간다.'] }),
	D({
		...bidam,
		en: ['If you swap, someone else dies in your coat.', 'I would rather it was a coat I already know.'],
		lines: ['바꾸면 다른 놈이 자네 옷을 입고 죽소.', '나는 이미 아는 옷이 낫소.']
	}),
	D({ ...alchunBoy, en: ['That’s not comforting.'], lines: ['그게 위로냐.'] }),
	D({ ...bidam, en: ['It was not meant to be.'], lines: ['위로하려고 한 말이 아니오.'] }),
	S('Mount Nam', '남산'),
	P(
		'They hear it before they see it. A dry creek. Pine shade. Something large moving like it owns the path. Bidam stops counting beads without meaning to.',
		'보기 전에 먼저 들린다. 마른 개울. 소나무 그늘. 길을 제 것처럼 쓰는 큰 것. 비담이 염주를 세다 만다. 세려고 만 건 아니다.'
	),
	D({
		...alchunBoy,
		en: ['We go back.', 'We say it ran. Lots of things run.'],
		lines: ['돌아가자.', '도망갔다고 하자. 도망가는 거 많잖아.']
	}),
	D({
		...bidam,
		en: ['What if we talk to it.', 'Everything listens, once.'],
		lines: ['말을 걸어 보는 게 어떻소.', '한 번은, 다 듣거든.']
	}),
	D({ ...yushinH, en: ['The sword is faster.'], lines: ['칼이 더 빠르다.'] }),
	D({
		...alchunBoy,
		en: ['Oi.', 'Both of you shut up.', 'I don’t— I don’t even have a sword.'],
		lines: ['야.', '둘 다 입 다물어.', '나— 나 칼도 없거든.']
	}),
	P(
		'Bidam does not shut up. He kneels in the pine-dirt and draws with a stick: a goat on a rope, and a strip of blood down the creek, a mark where a person stands, a mark in the pine. Yushin watches the marks the way he watches a drill. Alchun is the skinniest of the three. He has been frightened since the lots. His hands will not close on the pine.',
		'비담은 입을 다물지 않는다. 소나무 흙에 무릎 꿇고 막대기로 그린다. 밧줄에 맨 염소, 개울을 따라 그은 피 자국, 사람 서는 자리, 소나무 자리. 유신은 훈련을 보듯 그 표시를 본다. 알천은 셋 중 가장 마르다. 제비 뽑을 때부터 겁이 나 있다. 소나무에서 손이 안 쥐어진다.'
	),
	D({
		...bidam,
		en: ['It has to want the path.', 'If it wants the path, it does not want you yet.', 'That is the whole trick.'],
		lines: ['길이 먹고 싶어야 하오.', '길을 먹고 싶으면, 아직은 자네가 아니오.', '요령이 그거요.']
	}),
	D({
		...alchunBoy,
		en: ['Which mark is me.', 'Say it.'],
		lines: ['나 어디냐.', '말해.']
	}),
	D({
		...bidam,
		en: ['The pine.', 'You are the one who can still run if it goes wrong.', 'That is not an insult.'],
		lines: ['소나무요.', '잘못되면 아직 달아날 수 있는 사람이 자네요.', '욕이 아니오.']
	}),
	D({ ...alchunBoy, en: ['It sounded like one.'], lines: ['욕처럼 들렸는데.'] }),
	D({ ...yushinH, en: ['I’ll stand.'], lines: ['내가 선다.'] }),
	P(
		'He says it the way he says the rest of his life. Bidam looks at him a moment too long, which is how you know he heard it.',
		'평생 할 말을 하듯 말한다. 비담이 그를 잠깐 너무 오래 본다. 들었다는 표시가 그것이다.'
	),
	D({
		...bidam,
		en: [
			'If it takes you, the plan still works.',
			'That is the ugly part.',
			'I should tell you that before you stand there.'
		],
		lines: ['자네를 가져가도, 계획은 살아 있소.', '그게 더러운 자리요.', '거기 서기 전에 말하는 게 맞소.']
	}),
	D({ ...yushinH, en: ['Then it had better not take me.'], lines: ['그럼 가져가지 말든가.'] }),
	D({
		...alchunBoy,
		en: ['Are you two finished.', 'The goat’s looking at me.'],
		lines: ['둘 얘기 끝났냐.', '염소가 나 보는데.']
	}),
	P(
		'They stake the goat. Bidam opens a cut on his own thumb and paints the creek with it, neat as a sutra line. Alchun goes up. Yushin walks into the path and stops, the sword still in the ring, and does not draw it.',
		'염소를 박아 둔다. 비담이 제 엄지를 열어 개울에 바른다. 경 한 줄처럼 단정하다. 알천이 오른다. 유신이 길로 걸어가 선다. 칼은 고리에 그대로다. 뽑지 않는다.'
	),
	P(
		'The tiger leaves the trees. It is larger than the drawing. Bidam’s mouth opens and does not say the next instruction. Yushin does not move.',
		'호랑이가 나무에서 나온다. 그림보다 크다. 비담의 입이 열리고, 다음 지시가 안 나온다. 유신은 안 움직인다.'
	),
	P(
		'Alchun’s hands will not close on the pine. Then they do.',
		'알천의 손이 소나무에서 안 쥐어진다. 그러고는 쥐어진다.'
	),
	P(
		'It gathers itself the way a wave does. The tiger leaves the ground. Yushin could draw. He does not.',
		'파도처럼 몸을 모은다. 호랑이가 땅을 떠난다. 유신은 뽑을 수 있다. 안 뽑는다.'
	),
	P('The sword goes still.', '칼이 멈춘다.'),
	P('The beads go still.', '염주가 멈춘다.'),
	P(
		'Alchun comes out of the pine the way a stone comes out of a sling. Nothing in his hands. The mountain goes. There is only his face. Then Alchun’s arms find the neck, and the tiger’s weight is suddenly a problem for the skinniest boy in the yard, who was eating a rice cake this morning.',
		'알천이 소나무에서 나온다. 물매에서 돌이 나오듯. 손은 비었다. 산이 사라진다. 그 얼굴만 남는다. 그리고 알천의 팔이 목을 찾는다. 호랑이 무게가, 연무장에서 제일 말랐던, 오늘 아침 떡 먹던 아이의 문제가 된다.'
	),
	D({ ...bidam, en: ['…I was going to count the beads first.'], lines: ['…염주부터 셀 생각이었소.'] }),
	D({
		...alchunBoy,
		en: ['Count later.', 'He’s heavy.', 'Yushin-ah. Help. Or don’t. I’m fine.'],
		lines: ['나중에 세.', '무겁다.', '유신아. 도와. 말든가. 난 괜찮아.']
	}),
	D({ ...yushinH, en: ['You’re welcome.'], lines: ['천만에.'] }),
	P(
		'They take the hide. They leave the goat, because none of them can look at it. Back at the yard Alchun is the one they cheer. Bidam goes back to his beads as if a count had been interrupted. Yushin wipes the creek-blood off his thumb and does not mention the path. Nobody asks him to. Alchun eats. He will, for the rest of his life, start the story there.',
		'가죽을 가져간다. 염소는 둔다. 셋을 다, 그걸 못 봐서다. 연무장에선 알천을 환호한다. 비담은 끊긴 셈을 이어 가듯 염주로 돌아간다. 유신은 엄지에서 개울 피를 닦고, 길 얘기는 하지 않는다. 묻는 사람도 없다. 알천은 먹는다. 평생, 그 이야기를 거기서부터 시작할 사람이다.'
	)
];

const DEER_FB = [
	P(
		'Class 59’s first hunt, and the bands form the way they always form. Nobody wants the ghost boy in their hyangdo. Heum takes six and looks around for the laugh. He gets it.',
		'오십구기 첫 산사냥. 무리는 늘 그렇듯 묶인다. 귀신 자식을 향도에 넣겠다는 사람이 없다. 흠이 여섯을 데려가고 웃음을 찾는다. 웃음을 받는다.'
	),
	D({
		speaker: 'Heum',
		gender: 'm',
		en: ['Who’s taking the ghost?', 'He’ll talk it to death.'],
		lines: ['귀신 누가 데려가?', '말로 죽여 버리겠지.']
	}),
	P(
		'Alchun does not usually walk out with a group. Grey at the temples now, a scar cutting the left one, the man who caught a tiger with empty hands and still eats at the fence like a boy. He looks at the empty ring the way he looks at a crooked stance, and then he walks into it.',
		'알천은 원래 무리를 직접 끌고 나가지 않는다. 이제 관자놀이가 희고, 왼쪽엔 흉터가 있다. 맨손으로 호랑이를 잡고도 울타리에 기대 먹는 사람이다. 빈 줄을 본다. 자세가 틀린 아이를 보듯. 그리고 그 안으로 걸어 들어간다.'
	),
	D({ ...alchunOld, en: ['I am.', 'You lot, move.'], lines: ['내가 간다.', '너희는 가라.'] }),
	P(
		'In the pines the deer is gone before he has finished pointing at it. He makes a noise that might be a laugh. Chunchu is already looking at a fallen branch, the way other boys look at a trail.',
		'소나무 사이, 가리키기를 끝내기도 전에 사슴은 없다. 알천이 웃음인지 모를 소리를 낸다. 춘추는 이미 쓰러진 가지를 보고 있다. 다른 아이들이 발자국을 보듯.'
	),
	D({ ...alchunOld, en: ['Well.', 'That’s a deer.'], lines: ['그래.', '사슴이구나.'] }),
	D({
		...chunchu,
		en: [
			'If I chase it I lose it.',
			'Give me until the shadow hits that pine.',
			'I have an idea. It’s a bit— ugly. You might not like it.'
		],
		lines: [
			'쫓으면 잃습니다.',
			'저 소나무에 그늘 닿을 때까지만요.',
			'생각이 있습니다. 좀— 지저분합니다. 마음에 안 드실 수도 있고요.'
		]
	}),
	D({
		...alchunOld,
		en: ['Ugly I can live with.', 'Stupid I send home.', 'Sit down if you’re sitting.'],
		lines: ['지저분한 건 참는다.', '바보 같은 건 보낸다.', '앉을 거면 앉아.']
	}),
	P(
		'He sits down and starts to carve. Alchun sits on a root and does not help, which is how you know he is staying. A wooden doe with a coat of moss, ears too long, then right. Chunchu holds it up. Alchun’s face does not move.',
		'앉아 깎기 시작한다. 알천은 뿌리에 앉아 돕지 않는다. 남는다는 표시가 그것이다. 이끼 입힌 나무 암사슴. 귀가 길다가, 맞는다. 춘추가 들어 보인다. 알천의 얼굴은 꿈쩍도 하지 않는다.'
	),
	D({ ...alchunOld, en: ['That’s not a deer.'], lines: ['그건 사슴이 아니다.'] }),
	D({ ...chunchu, en: ['It will be, if I get the ears right.'], lines: ['귀만 맞으면 됩니다.'] }),
	P(
		'He crushes leaves against a stone until the smell goes sweet and wrong, and paints the wooden mouth with it. Alchun watches his hands, not the forest.',
		'잎을 돌에 짓이겨, 달고 이상한 냄새가 날 때까지 간다. 나무 입에 바른다. 알천은 숲이 아니라 그 손을 본다.'
	),
	D({ ...alchunOld, en: ['And that.'], lines: ['그건.'] }),
	D({
		...chunchu,
		en: ['These put a horse to sleep.', 'A deer is smaller.', 'I thought— if it comes in quiet, I won’t have to run it.'],
		lines: ['말 재우는 잎입니다.', '사슴은 더 작고요.', '가만히 오면, 쫓지 않아도 되잖아요.']
	}),
	P(
		'They set the doe on the path and sit downwind as if they had come to watch a play. Alchun’s fingers drum once on his knee and stop. The deer that comes is huge. It noses the wooden mouth. It does not leave.',
		'암사슴을 길에 세워 두고, 바람 아래로 앉는다. 구경 온 사람처럼. 알천의 손가락이 무릎에서 한 번 구르다 멈춘다. 오는 사슴이 크다. 나무 입에 코를 댄다. 가지는 않는다.'
	),
	P(
		'Chunchu could take the head. Alchun would not stop him. The pines go. There is only his face. Then he looks at the sleeping animal the way he looks at a problem no one asked him to look at.',
		'춘추는 목을 칠 수 있다. 알천이 말리지는 않을 것이다. 소나무가 사라진다. 그 얼굴만 남는다. 그리고 잠든 짐승을 본다. 묻지도 않은 문제를 보듯.'
	),
	D({
		...chunchu,
		en: ['If I bring a head, they’ll say I found a dead one.', 'If it walks, they have to look at me.'],
		lines: ['머리만 가져가면, 죽은 거 주웠다고 할 겁니다.', '걸어오면, 절 볼 수밖에 없잖아요.']
	}),
	D({ ...alchunOld, en: ['Do it, then.', 'I’m not carrying it.'], lines: ['그러면 해.', '나는 안 든다.'] }),
	P(
		'The antlers come off the way a hat comes off. He ties a plum blossom on the cut because his hands need something to do while the deer is still breathing. It wakes. It walks. He talks to it under his breath the whole way back, and Alchun pretends not to hear.',
		'뿔이 모자 벗듯 떨어진다. 자른 자리에 매화 한 송이를 맨다. 사슴이 아직 숨 쉬는 동안, 손이 할 일이 필요해서다. 깬다. 걷는다. 돌아가는 내내 춘추가 낮은 소리로 말을 걸고, 알천은 안 들은 척한다.'
	),
	P(
		'Last through the gate: a magenta sleeve, and a deer still walking. Heum has a fawn on the line and a joke half out, and both of them stop. Alchun is beside him, empty hands on the rope he is not holding.',
		'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 흠은 선에 새끼를 내려놓고 농담을 반쯤 꺼낸 채다. 둘 다 멈춘다. 곁에 알천. 쥐지도 않은 고삐 위에 빈 손.'
	),
	D({
		speaker: 'A judge',
		gender: 'm',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	}),
	D({
		...chunchu,
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.']
	}),
	P(
		'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the one who walked out. He has been watching the rope, not the horn.',
		'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 걸어 나온 사람은 아니다. 뿔이 아니라 고삐를 보고 있었다.'
	),
	D({
		...yushinH,
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.']
	}),
	P(
		'The deer eats the blossom off its own horn. Somebody in the yard starts to laugh and cannot finish it. The man on the wall does not look at the deer. He looks at the boy.',
		'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 마당 어디선가 웃음이 나다가 끝을 못 낸다. 담 위의 사람은 사슴을 보지 않는다. 소년을 본다.'
	)
];

const DEER_LIVE = [
	P(
		'Alchun stands them in a line and does not raise his voice. He never does. Grey at the temples, a red scar cutting the left one, teal over rust, no crescent left on him. The boys still call him senior. The yard calls him the tiger-catcher. He doesn’t have to shout.',
		'알천이 아이들을 한 줄로 세운다. 목소리를 높이지 않는다. 원래 안 높인다. 관자놀이가 희고, 왼쪽에 붉은 흉터, 녹슨 붉은 옷 위에 청록. 초승달 머리띠는 이미 없다. 아이들은 아직 선배라 한다. 연무장은 호랑이 잡은 사람이라 한다. 소리를 지를 필요가 없다.'
	),
	D({
		...alchunOld,
		en: [
			'A piece of an animal before sundown.',
			'Walking does not count.',
			'Empty does not count either.',
			'Each hyangdo goes into the forest. I will be here when you come back. Most of you.'
		],
		lines: [
			'해 지기 전에 짐승 조각이다.',
			'걷는 건 안 된다.',
			'빈손도 안 된다.',
			'향도마다 숲에 들어가라. 돌아올 때 내가 여기 있다. 대부분은.'
		]
	}),
	P(
		'The bands form the way they always form. Heum takes six. Somebody takes five. Nobody wants the ghost boy in their hyangdo. The space around Chunchu stays a space. He has known it would, since the shoes in the pond. He stands in it anyway, as if the line might change its mind.',
		'무리는 늘 그렇듯 묶인다. 흠이 여섯. 누가 다섯. 귀신 자식을 향도에 넣겠다는 사람이 없다. 춘추 주위만 빈다. 못에 신발 빠지던 밤부터 이럴 줄 알았다. 그래도 그 빈자리에 선다. 줄이 마음을 바꿀지도 모른다는 듯이.'
	),
	D({
		speaker: 'Heum',
		gender: 'm',
		en: ['Who’s taking the ghost?', 'He’ll talk it to death.'],
		lines: ['귀신 누가 데려가?', '말로 죽여 버리겠지.']
	}),
	P(
		'Nobody answers. Alchun does not usually walk out with a group. He looks at the empty ring the way he looks at a crooked stance. He was the skinny one once. He remembers the laugh. Then he walks into it.',
		'대답하는 사람이 없다. 알천은 원래 무리를 직접 끌고 나가지 않는다. 빈 줄을 본다. 자세가 틀린 아이를 보듯. 자기도 마른 아이였던 적이 있다. 그 웃음도 기억한다. 그리고 그 안으로 걸어 들어간다.'
	),
	D({ ...alchunOld, en: ['I am.', 'You lot, move.'], lines: ['내가 간다.', '너희는 가라.'] }),
	D({
		speaker: 'Heum',
		gender: 'm',
		en: ['Alchun?', 'For him?'],
		lines: ['알천 선배가?', '저거 때문에?']
	}),
	P(
		'Chunchu looks at Alchun, and then at the gate, and does not ask why. Asking why is how you lose a thing like this.',
		'춘추가 알천을 보고, 문을 보고, 왜냐고 묻지 않는다. 이런 건 왜냐고 묻는 순간 놓친다.'
	),
	S('The pines', '소나무'),
	P(
		'The deer is there and then it is not. Alchun’s arm is still out. Chunchu does not run. He tilts his head, the way he tilts it at a go board when the other person has just played the obvious stone.',
		'사슴이 있다. 그리고 없다. 알천의 팔은 아직 나와 있다. 춘추는 쫓지 않는다. 머리를 기울인다. 바둑에서 상대가 뻔한 수를 두었을 때 기울이는 그 각이다.'
	),
	D({ ...alchunOld, en: ['Well.', 'That’s a deer.'], lines: ['그래.', '사슴이구나.'] }),
	D({
		...alchunOld,
		en: ['You going to talk to it, or chase it.', 'Talking didn’t work on a tiger. I’ll tell you that for free.'],
		lines: ['말 걸 거냐, 쫓을 거냐.', '호랑이한테 말은 안 먹히더라. 그건 공짜로 알려 준다.']
	}),
	D({
		...chunchu,
		en: [
			'If I chase it I lose it.',
			'Give me until the shadow hits that pine.',
			'I have an idea. It’s a bit— ugly. You might not like it.'
		],
		lines: [
			'쫓으면 잃습니다.',
			'저 소나무에 그늘 닿을 때까지만요.',
			'생각이 있습니다. 좀— 지저분합니다. 마음에 안 드실 수도 있고요.'
		]
	}),
	D({
		...alchunOld,
		en: ['Ugly I can live with.', 'Stupid I send home.', 'Sit down if you’re sitting.'],
		lines: ['지저분한 건 참는다.', '바보 같은 건 보낸다.', '앉을 거면 앉아.']
	}),
	P(
		'He sits. He carves. Alchun takes a root and watches him the way you watch a boy who might still be stupid. A wooden doe with a coat of moss. The first ears are too long. Chunchu swears under his breath, which Alchun also pretends not to hear, and cuts them back.',
		'앉는다. 깎는다. 알천은 뿌리를 잡고, 아직 바보일 수 있는 아이를 보듯 본다. 이끼 입힌 나무 암사슴. 첫 귀가 길다. 춘추가 낮은 소리로 욕을 하고, 알천은 그것도 안 들은 척하고, 귀를 다시 깎는다.'
	),
	D({ ...alchunOld, en: ['That’s not a deer.'], lines: ['그건 사슴이 아니다.'] }),
	D({
		...chunchu,
		en: ['It will be, if I get the ears right.', 'They look at the ears first. I checked.'],
		lines: ['귀만 맞으면 됩니다.', '귀부터 보더라고요. 확인해 봤습니다.']
	}),
	P(
		'He picks leaves Alchun does not know the name of and crushes them against a stone until the smell goes sweet and wrong. He paints the wooden mouth. His hands are steady. Alchun’s are not, quite.',
		'알천이 이름 모르는 잎을 집어, 돌에 짓이겨 달고 이상한 냄새가 날 때까지 간다. 나무 입에 바른다. 춘추의 손은 안 떤다. 알천의 손은, 조금, 떤다.'
	),
	D({ ...alchunOld, en: ['And that.'], lines: ['그건.'] }),
	D({
		...chunchu,
		en: [
			'These put a horse to sleep.',
			'A deer is smaller.',
			'It shouldn’t— I mean. It should wake up. If I didn’t take too much.'
		],
		lines: ['말 재우는 잎입니다.', '사슴은 더 작고요.', '안— 그러니까. 깨긴 깰 겁니다. 너무 많이 안 바르면.']
	}),
	D({ ...alchunOld, en: ['And if you did.'], lines: ['많이 바르면.'] }),
	D({
		...chunchu,
		en: ['Then I bring a head, and Heum gets his joke.', 'I’d rather not give him that.'],
		lines: ['그러면 머리를 가져가고, 흠이 웃겠지요.', '그건 주기 싫습니다.']
	}),
	P(
		'They set the doe on the path. They sit downwind. Alchun’s fingers drum once on his knee and stop. Nothing happens for long enough that a lesser boy would have started explaining. Chunchu does not explain. The deer comes. It noses the wooden mouth. It folds.',
		'암사슴을 길에 세운다. 바람 아래로 앉는다. 알천의 손가락이 무릎에서 한 번 구르다 멈춘다. 한참 아무 일도 없다. 덜된 아이면 설명을 시작했을 시간이다. 춘추는 설명하지 않는다. 사슴이 온다. 나무 입에 코를 댄다. 접힌다.'
	),
	P(
		'The deer that comes is huge. Shoulder as high as the boy’s chest. It folds anyway.',
		'오는 사슴이 크다. 어깨가 아이 가슴까지다. 그래도 접힌다.'
	),
	P(
		'The knife is in Chunchu’s hand before he has decided to pick it up. Alchun does not take it from him. The pines go. There is only his face. Then he lets the knife hang, and looks at the sleeping animal, and laughs once, very quietly, at himself.',
		'결정하기도 전에 칼이 춘추 손에 있다. 알천은 뺏지 않는다. 소나무가 사라진다. 그 얼굴만 남는다. 그리고 칼을 늘어뜨리고, 잠든 짐승을 보고, 아주 낮게, 한 번, 자기를 보고 웃는다.'
	),
	D({
		...chunchu,
		en: [
			'If I bring a head, they’ll say I found it.',
			'If it walks— they have to look at me.',
			'That’s ugly too. I did warn you.'
		],
		lines: [
			'머리만 가져가면, 주웠다고 할 겁니다.',
			'걸어오면— 절 볼 수밖에 없잖아요.',
			'이것도 지저분합니다. 말씀드렸잖아요.'
		]
	}),
	D({
		...alchunOld,
		en: ['Do it.', 'I’m not carrying it.', 'And if it doesn’t wake, you carry the head. That’s the bet.'],
		lines: ['해.', '나는 안 든다.', '안 깨면 네가 머리 든다. 그게 내기다.']
	}),
	P(
		'The antlers come off like a hat. He talks to the deer while he does it, nonsense, the way you talk to a horse you need to keep still. He ties a plum blossom on the cut because his hands are shaking now and a flower is something to hold. The deer wakes. It startles. It looks at him. It walks.',
		'뿔이 모자처럼 떨어진다. 깎는 동안 사슴에게 말을 건다. 아무 말. 가만히 있어야 하는 말에게 하듯. 자른 자리에 매화 한 송이를 맨다. 이제 손이 떨리고, 꽃은 잡을 것이라서다. 사슴이 깬다. 깜짝 놀란다. 그를 본다. 걷는다.'
	),
	D({ ...alchunOld, en: ['Hah.'], lines: ['하.'] }),
	S('The yard · last through the gate', '연무장 · 문으로 마지막'),
	P(
		'Last through the gate: a magenta sleeve, and a deer still walking. Heum has a fawn on the line and a joke half out. The joke dies. The fawn looks embarrassed to be dead. Alchun is beside Chunchu, empty hands, as if he had planned this, which he had not.',
		'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 흠은 선에 새끼를 내려놓고 농담을 반쯤 꺼낸 채다. 농담이 죽는다. 새끼는 죽어 있는 게 민망한 얼굴이다. 곁에 알천. 쥐지도 않은 고삐 위에 빈 손. 계획한 사람처럼. 계획하지는 않았다.'
	),
	D({
		speaker: 'Heum',
		gender: 'm',
		en: ['Goblin’s boy’s still out.', 'Probably talking to—', '…That’s walking.'],
		lines: ['도깨비 녀석 아직이다.', '말하고 있겠지, 사슴이—', '…걷잖아.']
	}),
	D({
		speaker: 'A judge',
		gender: 'm',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	}),
	D({
		...chunchu,
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.']
	}),
	P(
		'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the one who walked out. Class 51 still owns the wall. He has been watching the rope, not the horn. He puts the pear down.',
		'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 걸어 나온 사람은 아니다. 오십일기는 아직 그 담의 것이다. 그는 뿔이 아니라 고삐를 보고 있었다. 배를 내려놓는다.'
	),
	D({ ...alchunOld, en: ['He brought a deer.'], lines: ['사슴을 데려왔다.'] }),
	D({
		...yushinH,
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.']
	}),
	P(
		'The deer eats the blossom off its own horn. Somebody starts to laugh and cannot finish it. After that they start saying the magenta one is clever, which is a different kind of laugh, and Chunchu stands in it as if he had expected that too.',
		'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 누가 웃다가 끝을 못 낸다. 그다음부터는 자홍빛 아이가 똑똑하다 한다. 다른 종류의 웃음이다. 춘추는 그것도 알고 있었다는 듯이 그 안에 선다.'
	),
	D({ ...yushinH, en: ['Name.'], lines: ['이름.'] }),
	D({ ...chunchu, en: ['Kim Chunchu, sir.'], lines: ['김춘추입니다.'] }),
	D({
		...yushinH,
		en: ['The deer is still walking.', 'Don’t lose that.'],
		lines: ['사슴이 아직 걷고 있네.', '그걸 잃지 말게.']
	})
];

editStory((story) => {
	const entry = (t) => story.flatMap((c) => c.entries ?? []).find((x) => x.title === t);
	const bup = entry('Bupmin');
	const mun = entry('Munhee');
	const sad = entry('Sadaham');

	replaceFb(bup, 'the tiger', TIGER);
	replaceFb(bup, 'the deer', DEER_FB);
	replaceRange(mun, 'Alchun stands them in a line', 'Don’t lose that.', DEER_LIVE);

	setLines(
		bup,
		'The Marshal took him out himself',
		[
			'Alchun took him out. The tiger-catcher. He does not usually do that.',
			'Nobody else would have him. Weird father. You know the song.',
			'The deer was too fast. So the boy made a wooden one, put it to sleep with leaves, and walked it home with the antlers in his hand.',
			'The game said bring a deer. It did not say kill one.',
			'The judges shouted. Then the deer ate the blossom off its own horn, and they had to give it to him.',
			'That is the fifth precept. Choosing.'
		],
		[
			'알천이 직접 데려갔다. 호랑이 잡은 그 사람. 원래 안 그러는 사람인데.',
			'넣을 향도가 없었어. 이상한 아비. 그 노래 알지.',
			'사슴이 너무 빨랐거든. 그래서 나무로 하나 만들고, 잎으로 재운 다음, 뿔만 들고 걸어 왔어. 사슴이랑.',
			'놀이가 사슴을 내라 했지. 죽이라 하진 않았네.',
			'심판들이 소리를 질렀어. 사슴이 제 뿔에서 꽃을 뜯어 먹는 바람에, 줄 수밖에 없었지.',
			'다섯째 계율이 그거라네. 가림.'
		]
	);

	setHtml(
		mun,
		'The yard belongs to the Yard Marshal',
		'The yard still belongs, some mornings, to Alchun. Grey, scarred, eating something, asking every new boy the same question as if it were a drill.',
		'어떤 아침엔 연무장이 아직 알천의 것이다. 희고, 흉터 있고, 뭘 먹으며, 새로 온 아이마다 같은 것을 묻는다. 훈련인 양.'
	);

	const start = one(mun, 'Alchun stands them in a line');
	const end = one(mun, 'You didn’t even go up.');
	if (start.list !== end.list) throw new Error('alchun look range crosses lists');
	for (let i = start.i; i <= end.i; i++) {
		const x = start.list[i];
		if (x.person === 'alchun') x.look = 'councillor';
	}

	replaceRange(
		sad,
		'General Isabu takes First Class into the trees',
		'He hates that this counts.',
		[
			P(
				'General Isabu takes First Class into the trees because the king asked who would keep forty noble sons from dying stupid, and Isabu said he would try. He draws the plan in dirt. Wind. Drive it. Do not meet it. Sadaham is on a stump, swinging his legs, and has not looked at the dirt once.',
				'이사부 장군이 제일기를 숲으로 데려간다. 임금이 진골 아들 마흔을 바보로 죽지 않게 할 사람을 물었고, 해 보겠다고 해서다. 흙에 계획을 그린다. 바람. 몰되, 마주치지 마라. 사다함은 그루터기에 앉아 다리를 흔들고, 흙은 한 번도 안 본다.'
			),
			D({
				...isabu,
				en: [
					'Upwind. Stay in the grass.',
					'When I say now, you shout.',
					'You do not run at it.',
					'Sadaham. That means you.'
				],
				lines: ['바람 위. 풀에 붙어라.', '이제, 하면 소리만 지른다.', '뛰어들지는 마라.', '사다함. 너 말이다.']
			}),
			D({
				...sadaham,
				en: ['That’s boring.', 'I’ll just hit it.'],
				lines: ['재미없네.', '그냥 때릴게.']
			}),
			D({
				...mugwan,
				en: ['That is the plan.', 'You heard the plan.'],
				lines: ['그게 계획이다.', '들었잖아.']
			}),
			D({
				...sadaham,
				en: ['I heard it.', 'I’m still going to hit it.', 'You coming?'],
				lines: ['들었어.', '그래도 때릴 건데.', '올래?']
			}),
			D({ ...mugwan, en: ['No.'], lines: ['아니.'] }),
			P(
				'Mugwan’s hand finds the sleeve. Holds it. Sadaham looks at the hand as if it had asked to dance and he was going to say yes anyway. Mugwan lets go.',
				'무관의 손이 소매를 찾는다. 잡는다. 사다함이 그 손을 본다. 춤을 청했고, 어차피 좋다고 할 사람처럼. 무관이 놓는다.'
			),
			D({
				...mugwan,
				en: ['If you die I am not carrying you back.', 'I am. I’m just saying it first.'],
				lines: ['죽으면 안 업고 간다.', '업긴 업지. 먼저 말하는 기다.']
			}),
			P(
				'Sadaham does not wait. He goes in grinning, the way he jumped off the roof, as if the ground owed him a soft landing and had not paid yet. Mugwan swears. Isabu does not. Isabu has seen this kind of boy before. He has not seen this kind of boy get back up as often.',
				'사다함은 기다리지 않는다. 지붕에서 뛰어내리던 그 웃음으로 들어간다. 땅이 부드럽게 받아 주기로 해 놓고 아직 안 갚은 것처럼. 무관이 욕을 한다. 이사부는 안 한다. 이런 아이는 본 적 있다. 이런 아이가 다시 일어나는 건, 그만큼은 못 봤다.'
			),
			P(
				'The bear hits him and the world turns over. He gets up laughing with dirt in his teeth. It hits him again. He spits blood and bows, as if the bear had asked him to dance and he was being polite about it.',
				'곰이 치고, 세상이 뒤집힌다. 이 묻고 웃으며 일어난다. 또 친다. 피를 뱉고 절한다. 곰이 춤을 청했고, 예의를 지키는 사람처럼.'
			),
			D({
				...isabu,
				en: ['Enough.', 'Get him—'],
				lines: ['됐다.', '저거 끌어—']
			}),
			P(
				'Mugwan’s hand finds Isabu’s sleeve this time. Does not pull. Just holds it, the way he held the other one. Isabu looks at him. Mugwan does not look back. He is watching the boy on the ground get up.',
				'이번엔 무관의 손이 이사부 소매를 찾는다. 당기지는 않는다. 잡기만 한다. 아까 그 손처럼. 이사부가 그를 본다. 무관은 안 돌아본다. 땅의 아이가 일어나는 걸 보고 있다.'
			),
			D({
				...sadaham,
				en: ['STILL HERE!', 'Come on— again—', 'Mugwan! Are you watching?'],
				lines: ['아직이다!', '자— 또—', '무관아! 보고 있어?']
			}),
			D({ ...mugwan, en: ['Unfortunately.'], lines: ['불행히도.'] }),
			P(
				'The bear knocks him down a third time. Mugwan could shout. Isabu could shout. Neither of them does. The boy on the ground is still getting up.',
				'세 번째에 눕힌다. 무관이 소리칠 수 있다. 이사부가 소리칠 수 있다. 둘 다 안 한다. 땅의 아이가 아직 일어나고 있으니까.'
			),
			P(
				'He wins the way a storm wins a roof. There is no skill in it that Isabu will write down. There is only a boy who would not stay down, and a bear that finally did. Then he does not get up. He is still smiling. Mugwan catches him before the dirt does.',
				'지붕을 이기는 폭풍처럼 이긴다. 이사부가 적어 둘 기술은 없다. 눕지 않기로 한 아이, 그리고 결국 누운 곰. 그게 다다. 그러고는 일어나지 않는다. 웃고는 있다. 흙보다 무관이 먼저 받는다.'
			),
			D({
				...mugwan,
				en: ['You idiot.', 'You were supposed to wait.'],
				lines: ['바보.', '기다리라며.']
			}),
			D({ ...isabu, en: ['That was not the plan.'], lines: ['그건 계획이 아니었다.'] }),
			D({ ...sadaham, en: ['…Did I win.'], lines: ['…이겼어?'] }),
			D({
				...mugwan,
				en: ['You passed out.', 'That’s not winning.'],
				lines: ['기절했잖아.', '그게 이긴 거냐.']
			}),
			D({ ...sadaham, en: ['Did the bear pass out.'], lines: ['곰도 기절했어?'] }),
			P(
				'Mugwan looks at the bear. The bear is not getting up either. He hates that this counts.',
				'무관이 곰을 본다. 곰도 안 일어난다. 이게 이긴 걸로 쳐지는 게 싫다.'
			)
		]
	);

	console.log('applied old-alchun + flesh');
});
