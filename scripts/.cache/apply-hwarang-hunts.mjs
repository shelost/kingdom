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

const H = { look: 'hwarang' };
const bidam = { person: 'bidam', look: 'hwarang', chip: '#141C2E' };
const yushin = { person: 'yushin', look: 'hwarang', chip: '#4a8fe0' };
const alchun = { person: 'alchun', look: 'hwarang', chip: '#8fb3e0' };
const chunchu = { person: 'chunchu', look: 'hwarang', chip: '#D8258C' };
const sadaham = { person: 'sadaham', chip: '#6fa8ff' };
const mugwan = { person: 'mugwan' };
const isabu = { person: 'isabu' };

function one(entry, frag) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`"${frag.slice(0, 50)}" → ${hits.length} in ${entry.title}`);
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
	const start = a.i;
	const end = b.i;
	a.list.splice(start, end - start + 1, ...blocks);
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
		'Class 51’s first hunt. Each hyangdo goes into the forest and brings back a piece of an animal. Antlers. Hide. Hooves. Whatever you can take and still walk home.',
		'오십일기 첫 산사냥. 향도마다 숲에 들어가 짐승 조각을 가져온다. 뿔이든, 가죽이든, 굽이든. 들고 걸어 나올 수 있는 것이면 된다.'
	),
	P(
		'Most bands draw a deer. One draws a horse that has already lost. Bidam’s three draw the tiger. The Marshal does not offer to redraw.',
		'대부분은 사슴이 나온다. 하나는 이미 진 말이 나온다. 비담의 셋은 호랑이가 나온다. 도감은 다시 뽑으라고 하지 않는다.'
	),
	P(
		'Mount Nam. Pine shade, a dry creek, and a tiger that has already decided the order. Three boys who have not.',
		'남산. 소나무 그늘, 마른 개울, 그리고 순서를 이미 정한 호랑이 한 마리. 아직 정하지 못한 소년 셋.'
	),
	D({
		...bidam,
		en: ['What if we talk to it.', 'Everything listens, once.'],
		lines: ['말을 걸어 보는 게 어떻소.', '한 번은, 다 듣거든.']
	}),
	D({
		...yushin,
		en: ['The sword is faster.'],
		lines: ['칼이 더 빠르다.']
	}),
	D({
		...alchun,
		en: ['Oi.', 'Both of you shut up.', 'I can take the neck.'],
		lines: ['야.', '둘 다 입 다물어.', '목은 내가 잡는다.']
	}),
	P(
		'Bidam does not shut up. He draws in the dirt with a stick: a goat on a rope, and a strip of blood down the creek. Yushin in the open. Alchun in the pine.',
		'비담은 입을 다물지 않는다. 막대기로 흙에 그린다. 밧줄에 맨 염소, 개울을 따라 그은 피 자국. 유신은 길에. 알천은 소나무에.'
	),
	D({
		...bidam,
		en: ['It has to want the path.', 'If it wants the path, it does not want you yet.'],
		lines: ['길이 먹고 싶어야 하오.', '길을 먹고 싶으면, 아직은 자네가 아니오.']
	}),
	D({
		...yushin,
		en: ['I’ll stand.'],
		lines: ['내가 선다.']
	}),
	D({
		...bidam,
		en: ['If it takes you, the plan still works.', 'That is the ugly part.'],
		lines: ['자네를 가져가도, 계획은 살아 있소.', '그게 더러운 자리요.']
	}),
	D({
		...yushin,
		en: ['Then it had better not take me.'],
		lines: ['그럼 가져가지 말든가.']
	}),
	P(
		'They stake the goat. Bidam opens a cut on his own thumb and paints the creek with it. Alchun climbs. Yushin stands in the path with the sword still in the ring and does not draw it.',
		'염소를 박아 둔다. 비담이 제 엄지를 열어 개울에 바른다. 알천이 오른다. 유신은 길에 선다. 칼은 고리에 그대로다. 뽑지 않는다.'
	),
	P('The tiger leaves the trees. It is larger than the plan.', '호랑이가 나무에서 나온다. 계획보다 크다.'),
	P(
		'Yushin stands in the path. The tiger gathers, and then it leaves the ground.',
		'유신이 길에 선다. 호랑이가 몸을 모은다. 그리고 땅이 없어진다.'
	),
	P('The sword goes still in Yushin’s hand.', '유신 손에서 칼이 멈춘다.'),
	P('The beads go still.', '염주가 멈춘다.'),
	P('The mountain goes. There is only his face.', '산이 사라진다. 그 얼굴만 남는다.'),
	P(
		'Alchun comes out of the pine with nothing in his hands. Alchun’s arms find the neck. The sword never has to finish the sentence.',
		'알천이 빈손으로 소나무에서 나온다. 알천의 팔이 목을 찾는다. 칼은 문장을 끝낼 필요가 없다.'
	),
	D({
		...bidam,
		en: ['…I was going to count the beads first.'],
		lines: ['…염주부터 셀 생각이었소.']
	}),
	D({
		...alchun,
		en: ['Count later.', 'He’s heavy.'],
		lines: ['나중에 세.', '무겁다.']
	}),
	D({
		...yushin,
		en: ['You’re welcome.'],
		lines: ['천만에.']
	}),
	P(
		'They take the hide. They leave the goat. The yard will talk about the tiger for a year. It will not talk about who stood in the path.',
		'가죽을 가져간다. 염소는 둔다. 연무장은 일 년 동안 호랑이 얘기를 할 것이다. 길에 선 사람 얘기는 하지 않을 것이다.'
	)
];

const DEER_FB = [
	P(
		'Class 59’s first hunt. Each hyangdo into the forest for a piece of an animal. Antlers. Hide. Hooves.',
		'오십구기 첫 산사냥. 향도마다 숲에 들어가 짐승 조각을 가져온다. 뿔이든, 가죽이든, 굽이든.'
	),
	P(
		'Nobody wants the ghost boy in their hyangdo. The Marshal does not usually walk out with a group. He takes him anyway.',
		'귀신 자식을 향도에 넣겠다는 사람이 없다. 도감은 원래 무리를 직접 끌고 나가지 않는다. 그래도 데려간다.'
	),
	P(
		'In the pines the deer is too fast to catch. Chunchu does not run it. He watches it, and then he starts to carve.',
		'소나무 사이, 사슴은 너무 빨라 잡을 수 없다. 춘추는 쫓지 않는다. 보다가, 깎기 시작한다.'
	),
	P(
		'A wooden doe with a coat of moss. A handful of crushed leaves. The deer comes. It does not leave.',
		'이끼 입힌 나무 암사슴. 짓이긴 잎 한 줌. 사슴이 온다. 가지는 않는다.'
	),
	P('The pines go. There is only his face.', '소나무가 사라진다. 그 얼굴만 남는다.'),
	P(
		'The antlers come off clean. The deer wakes. It walks.',
		'뿔이 깨끗이 떨어진다. 사슴이 깬다. 걷는다.'
	),
	P(
		'Last through the gate: a magenta sleeve, and a deer still walking. The Marshal beside him, two fingers on the rope he is not holding.',
		'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 곁에 도감. 쥐지도 않은 고삐 위에 손가락 둘.'
	),
	D({
		speaker: 'A judge',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	}),
	D({
		...chunchu,
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.']
	}),
	P(
		'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the marshal. He has been watching the rope, not the horn.',
		'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 도감이 아니다. 뿔이 아니라 고삐를 보고 있었다.'
	),
	D({
		...yushin,
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.']
	}),
	P(
		'The deer eats the blossom off its own horn. The yard has to give it to him. The man on the wall does not look at the deer. He looks at the boy.',
		'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 연무장은 줄 수밖에 없다. 담 위의 사람은 사슴을 보지 않는다. 소년을 본다.'
	)
];

const DEER_LIVE = [
	S('The forest · a piece of an animal', '숲 · 짐승 조각'),
	P(
		'Class 59’s first hunt. Each hyangdo goes into the forest and brings back a piece of an animal. Antlers. Hide. Hooves. The Marshal says walking does not count, and neither does coming home empty.',
		'오십구기 첫 산사냥. 향도마다 숲에 들어가 짐승 조각을 가져온다. 뿔이든, 가죽이든, 굽이든. 도감은 걷는 건 안 된다 하고, 빈손으로 오는 것도 안 된다 한다.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['A piece of an animal before sundown.', 'Walking does not count.', 'Empty does not count either.'],
		lines: ['해 지기 전에 짐승 조각이다.', '걷는 건 안 된다.', '빈손도 안 된다.']
	}),
	P(
		'The bands form the way they always form. Nobody wants the ghost boy in their hyangdo. Heum takes six. Somebody takes five. The line around Chunchu stays a line.',
		'무리는 늘 그렇듯 묶인다. 귀신 자식을 향도에 넣겠다는 사람이 없다. 흠이 여섯을 데려간다. 누가 다섯을 데려간다. 춘추 주위만 줄이다.'
	),
	D({
		speaker: 'Heum',
		en: ['Who’s taking the ghost?', 'He’ll talk it to death.'],
		lines: ['귀신 누가 데려가?', '말로 죽여 버리겠지.']
	}),
	P('The Marshal does not usually walk out with a group. He takes him anyway.', '도감은 원래 무리를 직접 끌고 나가지 않는다. 그래도 데려간다.'),
	D({
		speaker: 'The Yard Marshal',
		en: ['I am.', 'You lot, move.'],
		lines: ['내가 간다.', '너희는 가라.']
	}),
	D({
		speaker: 'Heum',
		en: ['The Marshal?', 'For him?'],
		lines: ['도감이?', '저거 때문에?']
	}),
	P(
		'The Marshal has two fingers left on his sword hand. He counts on them. One for sympathy. One for the way the boy looks at a problem no one asked him to look at.',
		'도감의 칼잡이 손엔 손가락이 둘만 남았다. 그걸로 센다. 하나는 측은해서. 하나는, 묻지도 않은 문제를 들여다보는 저 눈 때문에.'
	),
	S('The pines', '소나무'),
	P(
		'The deer is too fast to catch. It is gone before the Marshal has finished pointing. Chunchu does not run it.',
		'사슴은 너무 빨라 잡을 수 없다. 도감이 가리키기를 끝내기도 전에 없다. 춘추는 쫓지 않는다.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['Well.', 'That’s a deer.'],
		lines: ['그래.', '사슴이구나.']
	}),
	D({
		...chunchu,
		en: ['If I chase it I lose it.', 'Give me until the shadow hits that pine.'],
		lines: ['쫓으면 잃습니다.', '저 소나무에 그늘 닿을 때까지만요.']
	}),
	P(
		'He carves. A wooden doe with a coat of moss, ears too long, then right. The Marshal sits on a root and does not help.',
		'깎는다. 이끼 입힌 나무 암사슴. 귀가 길다가, 맞는다. 도감은 뿌리에 앉아 돕지 않는다.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['That’s not a deer.'],
		lines: ['그건 사슴이 아니다.']
	}),
	D({
		...chunchu,
		en: ['It will be, if I get the ears right.'],
		lines: ['귀만 맞으면 됩니다.']
	}),
	P(
		'He crushes a handful of leaves against a stone until the smell goes sweet and wrong. He paints the wooden mouth with it.',
		'잎 한 줌을 돌에 짓이겨, 달고 이상한 냄새가 날 때까지 간다. 나무 입에 바른다.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['And that.'],
		lines: ['그건.']
	}),
	D({
		...chunchu,
		en: ['These put a horse to sleep.', 'A deer is smaller.'],
		lines: ['말 재우는 잎입니다.', '사슴은 더 작고요.']
	}),
	P(
		'He sets the doe on the path and sits downwind with the Marshal, as if they had come to watch a play. The deer comes. It does not leave.',
		'암사슴을 길에 세워 두고, 바람 아래로 도감과 앉는다. 구경 온 사람처럼. 사슴이 온다. 가지는 않는다.'
	),
	P('The pines go. There is only his face.', '소나무가 사라진다. 그 얼굴만 남는다.'),
	P(
		'The antlers come off clean. He ties a plum blossom on the cut, because the yard will need something to look at besides the fact that the deer is still breathing. The deer wakes. It walks.',
		'뿔이 깨끗이 떨어진다. 자른 자리에 매화 한 송이를 맨다. 연무장이 숨 쉬는 것 말고 볼 게 필요해서다. 사슴이 깬다. 걷는다.'
	),
	S('The yard · last through the gate', '연무장 · 문으로 마지막'),
	P(
		'Last through the gate: a magenta sleeve, and a deer still walking. The Marshal beside him. Heum’s fawn is already on the line, and the laugh has already happened, and then both of them stop.',
		'문으로 마지막. 자홍빛 소매, 그리고 아직 걷는 사슴. 곁에 도감. 흠의 새끼는 이미 선에 있고, 웃음은 이미 나왔고, 둘 다 멈춘다.'
	),
	D({
		speaker: 'Heum',
		en: ['Goblin’s boy’s still out.', 'Probably talking to—', '…That’s walking.'],
		lines: ['도깨비 녀석 아직이다.', '말하고 있겠지, 사슴이—', '…걷잖아.']
	}),
	D({
		speaker: 'A judge',
		en: ['Doesn’t count.', 'Kill it.'],
		lines: ['안 된다.', '죽여.']
	}),
	D({
		...chunchu,
		en: ['If I kill it now, sir, it’s just late.', 'If I don’t, it’s a deer.'],
		lines: ['지금 죽이면, 늦은 사슴입니다.', '안 죽이면 사슴입니다.']
	}),
	P(
		'The judges shout. On the wall, a young hwarang in blue is eating a pear. He is not the marshal. Class 51 left years ago, and the yard still runs drills under his name. He has been watching the rope, not the horn.',
		'심판들이 소리를 지른다. 담 위, 푸른 옷의 젊은 화랑이 배를 먹고 있다. 도감이 아니다. 오십일기는 몇 해 전에 나갔고, 연무장은 아직도 그 이름으로 훈련을 돌린다. 그는 뿔이 아니라 고삐를 보고 있었다.'
	),
	D({
		speaker: 'The Yard Marshal',
		en: ['Kim. The game said kill—'],
		lines: ['김 화랑. 놀이가 죽이라—']
	}),
	D({
		...yushin,
		en: ['The game said bring a deer.', 'It did not say kill one.'],
		lines: ['놀이가 사슴을 내라 했지.', '죽이라 하진 않았네.']
	}),
	P(
		'The deer eats the blossom off its own horn. The yard has to give it to him. That is the first time Kim Yushin looks at Kim Chunchu, and he does not look at the deer. The whole yard is looking at the boy who brought a deer back alive, and after that they start saying he is clever, which is a different kind of laugh.',
		'사슴이 제 뿔에서 꽃을 뜯어 먹는다. 연무장은 줄 수밖에 없다. 김유신이 김춘추를 처음 보는 순간이다. 사슴은 보지 않는다. 연무장 전체가, 사슴을 살려서 데려온 아이를 본다. 그다음부터는 똑똑하다 한다. 다른 종류의 웃음이다.'
	),
	D({
		...yushin,
		en: ['Name.'],
		lines: ['이름.']
	}),
	D({
		...chunchu,
		en: ['Kim Chunchu, sir.'],
		lines: ['김춘추입니다.']
	}),
	D({
		...yushin,
		en: ['The deer is still walking.', 'Don’t lose that.'],
		lines: ['사슴이 아직 걷고 있네.', '그걸 잃지 말게.']
	})
];

const BEAR_LIVE = [
	S('The forest · Isabu’s hyangdo', '숲 · 이사부의 향도'),
	P(
		'First Class gets the hunt too. General Isabu does not usually walk boys into trees. This year he does, because the king asked who would keep forty noble sons from dying stupid, and Isabu said he would try.',
		'제일기도 산사냥을 한다. 이사부 장군은 원래 아이들을 숲에 데려가지 않는다. 올해는 간다. 임금이 진골 아들 마흔을 바보로 죽지 않게 할 사람을 물었고, 이사부가 해 보겠다고 해서다.'
	),
	P(
		'He draws the plan in dirt. Wind. Nets. Drive the bear, do not meet it. Sadaham is already not listening.',
		'흙에 계획을 그린다. 바람. 그물. 곰을 몰되, 마주치지 마라. 사다함은 이미 안 듣고 있다.'
	),
	D({
		...isabu,
		en: ['Upwind. Nets in the draw.', 'When I say now, you shout. You do not run at it.'],
		lines: ['바람 위. 골에 그물.', '이제, 하면 소리만 지른다. 뛰어들지는 마라.']
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
		en: ['I heard it.', 'I’m still going to hit it.'],
		lines: ['들었어.', '그래도 때릴 건데.']
	}),
	P(
		'Sadaham does not wait. He goes in grinning, the way he jumped off the roof, as if the ground owed him a soft landing and had not paid yet.',
		'사다함은 기다리지 않는다. 지붕에서 뛰어내리던 그 웃음으로 들어간다. 땅이 부드럽게 받아 주기로 해 놓고 아직 안 갚은 것처럼.'
	),
	P(
		'The bear knocks him down a first time. He gets up laughing with dirt in his teeth. The bear knocks him down a second time. He spits blood and bows, as if the bear had asked him to dance.',
		'곰이 한 번 눕힌다. 이 묻고 웃으며 일어난다. 두 번 눕힌다. 피를 뱉고 절한다. 곰이 춤을 청한 것처럼.'
	),
	D({
		...sadaham,
		en: ['STILL HERE!', 'Come on— again—'],
		lines: ['아직이다!', '자— 또—']
	}),
	P(
		'The bear knocks him down a third time. Mugwan has the net. Isabu has the shout. Neither of them uses it, because the boy on the ground is still getting up, and you do not throw a net over a person who has decided to be a wall.',
		'세 번째에 눕힌다. 무관은 그물을 들고 있다. 이사부는 고함을 들고 있다. 둘 다 안 쓴다. 땅의 아이가 아직 일어나고 있으니까. 벽이 되기로 한 사람 위에 그물을 던지지는 않는다.'
	),
	P(
		'He wins the way a storm wins a roof. There is no skill in it that Isabu will write down. There is only a boy who would not stay down, and a bear that finally did.',
		'지붕을 이기는 폭풍처럼 이긴다. 이사부가 적어 둘 기술은 없다. 눕지 않기로 한 아이, 그리고 결국 누운 곰. 그게 다다.'
	),
	P(
		'Then he does not get up. He is still smiling. Mugwan catches him before the dirt does.',
		'그러고는 일어나지 않는다. 웃고는 있다. 흙보다 무관이 먼저 받는다.'
	),
	D({
		...mugwan,
		en: ['You idiot.', 'You were supposed to wait.'],
		lines: ['바보.', '기다리라며.']
	}),
	D({
		...isabu,
		en: ['That was not the plan.'],
		lines: ['그건 계획이 아니었다.']
	}),
	D({
		...sadaham,
		en: ['…Did I win.'],
		lines: ['…이겼어?']
	}),
	D({
		...mugwan,
		en: ['You passed out.', 'That’s not winning.'],
		lines: ['기절했잖아.', '그게 이긴 거냐.']
	}),
	D({
		...sadaham,
		en: ['Did the bear pass out.'],
		lines: ['곰도 기절했어?']
	}),
	P(
		'Mugwan looks at the bear. The bear is not getting up either. He hates that this counts.',
		'무관이 곰을 본다. 곰도 안 일어난다. 이게 이긴 걸로 쳐지는 게 싫다.'
	),
	D({
		...mugwan,
		en: ['…Yes.', 'Don’t smile.'],
		lines: ['…응.', '웃지 마.']
	})
];

const BEAR_FB = [
	P(
		'First Class. Isabu’s hyangdo. A plan in the dirt, and a boy who does not read dirt.',
		'제일기. 이사부의 향도. 흙 위의 계획, 그리고 흙을 안 읽는 아이.'
	),
	D({
		...isabu,
		en: ['When I say now, you shout.', 'You do not run at it.'],
		lines: ['이제, 하면 소리만 지른다.', '뛰어들지는 마라.']
	}),
	D({
		...sadaham,
		en: ['That’s boring.', 'I’ll just hit it.'],
		lines: ['재미없네.', '그냥 때릴게.']
	}),
	P('Sadaham does not wait.', '사다함은 기다리지 않는다.'),
	P(
		'The bear knocks him down a third time. He gets up anyway. Then he does not get up.',
		'세 번째에 눕힌다. 그래도 일어난다. 그러고는 일어나지 않는다.'
	),
	D({
		...sadaham,
		en: ['…Did I win.'],
		lines: ['…이겼어?']
	}),
	D({
		...mugwan,
		en: ['You passed out.', 'The bear passed out.', 'That’s not a plan.'],
		lines: ['기절했잖아.', '곰도 기절했고.', '그게 계획이냐.']
	})
];

editStory((story) => {
	const entry = (title) => {
		const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === title);
		if (!e) throw new Error(`no entry ${title}`);
		return e;
	};

	const bup = entry('Bupmin');
	const mun = entry('Munhee');
	const sad = entry('Sadaham');
	const gi = entry('Gi');
	const jeon = entry('Jeon');

	setHtml(
		bup,
		'A tiger on Mount Nam, and three boys about to be eaten by it',
		'The third bay is older, and the paint has started to go. A tiger on Mount Nam, and three boys who went into the forest for a piece of an animal: one with a stick drawing a plan in the dirt, one standing in the path, one with his arms round a neck.',
		'셋째 칸은 더 오래됐고, 물감이 바래기 시작했다. 남산의 호랑이, 그리고 짐승 조각을 하러 숲에 들어간 소년 셋. 흙에 계획을 그리는 아이, 길에 선 아이, 목을 끌어안은 아이.'
	);
	setLines(
		bup,
		'Alchun caught the tiger. Write that down. He checks.',
		[
			'A councillor. He talks less now.',
			'…No. He talks the same. Now they pay him for it.',
			'Bidam made the plan. I stood in the path. Alchun caught the tiger. Write that down. He checks.',
			'Third precept. Trust among friends. The painter hung the three of us in that bay together.',
			'If that gets funny later, laugh then.'
		],
		[
			'대신이다. 요새는 말이 줄었다.',
			'……아니다. 똑같다. 요새는 그걸로 녹봉을 받을 뿐이지.',
			'계획은 비담이다. 길에 선 건 나다. 호랑이는 알천이 잡았다. 적어 둬라. 그 사람 확인한다.',
			'셋째다. 교우이신. 화공이 우리 셋을 그 칸에 같이 걸었네.',
			'나중에 웃기면 그때 웃게.'
		]
	);
	replaceFb(bup, 'the tiger', TIGER);

	setLines(
		bup,
		'The game said bring a deer. It did not say kill one.',
		[
			'The Marshal took him out himself. He does not usually do that.',
			'Nobody else would have him. Weird father. You know the song.',
			'The deer was too fast. So the boy made a wooden one, put it to sleep with leaves, and walked it home with the antlers in his hand.',
			'The game said bring a deer. It did not say kill one.',
			'The judges shouted. Then the deer ate the blossom off its own horn, and they had to give it to him.',
			'That is the fifth precept. Choosing.'
		],
		[
			'도감이 직접 데려갔다. 원래 안 그러는 사람인데.',
			'넣을 향도가 없었어. 이상한 아비. 그 노래 알지.',
			'사슴이 너무 빨랐거든. 그래서 나무로 하나 만들고, 잎으로 재운 다음, 뿔만 들고 걸어 왔어. 사슴이랑.',
			'놀이가 사슴을 내라 했지. 죽이라 하진 않았네.',
			'심판들이 소리를 질렀어. 사슴이 제 뿔에서 꽃을 뜯어 먹는 바람에, 줄 수밖에 없었지.',
			'다섯째 계율이 그거라네. 가림.'
		]
	);
	replaceFb(bup, 'the deer', DEER_FB);

	setHtml(
		bup,
		'Five small paintings. One face.',
		'At the very end, where the wall meets the old gate, the lamp finds a bay the yard does not number. Six small paintings. One face. A dark hall, chin already up. A father’s hand. A river stone. A boy on his back under a bear. A gate with white cloth on a spear. A fifteen-year-old on one knee, sawing a rope.',
		'맨 끝, 벽이 옛 대문과 만나는 자리에, 등불이 번호 없는 칸을 찾아낸다. 작은 그림 여섯. 얼굴은 하나. 어두운 전각, 이미 든 턱. 아버지의 손. 강가의 돌. 곰 밑에 누운 아이. 창에 흰 천을 단 성문. 무릎 꿇고 포로 줄을 톱는 열다섯.'
	);

	const stoneDesc = one(bup, 'Two thirteen-year-olds on a riverbank');
	stoneDesc.list.splice(stoneDesc.i, 0, {
		kind: 'p',
		html: 'Beside the stone, a bear, and a boy who would not stay down. Isabu had a plan. The boy did not read it.',
		ko: '돌 옆, 곰, 그리고 눕지 않기로 한 아이. 이사부에게는 계획이 있었다. 아이는 읽지 않았다.'
	}, {
		kind: 'flashback',
		year: '560',
		title: 'the bear',
		blocks: BEAR_FB
	});

	replaceRange(
		mun,
		'A yard game, the first month. One deer before sundown.',
		'Don’t lose that.',
		DEER_LIVE
	);

	const afterNo = one(sad, 'He says no eleven times that spring. He goes all eleven.');
	afterNo.list.splice(afterNo.i + 1, 0, ...BEAR_LIVE);

	const pungak = one(gi, 'A star sits on the roofs. The three of them are supposed to be on a mountain.');
	pungak.list.splice(pungak.i + 1, 0, P(
		'The old song is about three hwarang and a star that sat on the roofs. The yard will later say the song was about them. They do not know that yet. They think they are late for a mountain.',
		'옛노래는 화랑 셋과, 지붕에 앉은 별 이야기다. 연무장은 나중에 그 노래가 이 셋 얘기라고 할 것이다. 지금은 모른다. 산에 늦은 줄만 안다.'
	));
	setHtml(
		gi,
		'The yard will call the three eternal. The song keeps the monk’s name.',
		'They never go. Rumour on the east shore, that same hour: riders who had already wet their hooves turned around, as if a song had reached them too. The yard will call them 삼화랑 first, then the three eternal. The song keeps the monk’s name. Bidam keeps the headband, blood and all, in a chest he will open on a worse night.',
		'다시는 안 간다. 같은 시각, 동쪽 바닷가 소문. 이미 발굽을 적신 기병들이 돌아갔다고. 노래가 거기까지 간 것처럼. 연무장은 먼저 삼화랑이라 부를 것이다. 그다음엔 영원하다 하고. 노래는 스님 이름을 남긴다. 비담은 피 묻은 머리띠를, 더 나쁜 밤에 열 궤짝에 넣어 둔다.'
	);

	const band = one(gi, 'That night Bidam takes the old black headband out of the chest');
	band.list.splice(band.i + 1, 0, P(
		'He turns the band in his fingers. A star sat on the roofs once, and they turned the horses. Yushin said the king would call. Bidam said the mountain would keep. He does not yet know that Yushin will put a star back with paper and a lie. He only knows the band still has blood on it.',
		'머리띠를 손가락에서 돌린다. 한때 별이 지붕에 앉았고, 셋을 말을 돌렸다. 유신은 임금이 부를 거라 했다. 비담은 산은 안 달아난다고 했다. 유신이 종이와 거짓말로 별을 도로 올려 놓을 줄은, 아직 모른다. 아는 건, 머리띠에 아직 피가 있다는 것뿐이다.'
	));

	setLines(
		jeon,
		'Then someone over there has read the same books I have.',
		[
			'Then someone over there has read the same books I have.',
			'No. Not books.',
			'Pungak. The roofs.',
			'He finally put it back.',
			'…Bring another cup.'
		],
		[
			'저쪽에도 내가 읽은 책을 읽은 사람이 있군.',
			'아니. 책이 아니야.',
			'풍악. 지붕.',
			'드디어 도로 올려 놨군.',
			'…잔 하나 더.'
		]
	);
});

console.log('hunts applied');
