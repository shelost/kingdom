/** Court ask, thief-line persuasion, three-brothers ending. */
import { editStory, find } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const Sp = (speaker, gender, en, lines) => ({ kind: 'dialogue', speaker, gender, en, lines });

const ASK = [
	P(
		'Nulji hears it from the window he is not supposed to open. He opens it anyway. He has been king long enough to know the songs get to the chair first.',
		'눌지는 열면 안 되는 창으로 그 노래를 듣는다. 그래도 연다. 의자에 앉은 지 오래돼서 안다. 노래가 의자보다 먼저 온다는 것을.'
	),
	S('The Ask', '청'),
	P('The hall is full. For once. He does not ask for an army. He asks for a mouth.', '대청이 가득하다. 이번엔. 군대를 안 청한다. 입을 청한다.'),
	D('nulji', ['Who talks best.'], ['누가 제일 잘 말해.']),
	Sp('A councillor', 'm', ['At what, Majesty.'], ['무엇을 말씀이십니까.']),
	D('nulji', ['At making a foreign hall say yes.'], ['남의 대청이 예 하게 하는 거.']),
	Sp('An officer', 'm', ['Park Jesang.', 'The south-shore one.'], ['박제상입니다.', '남쪽 나루 그이.']),
	Sp('A second officer', 'm', ['The tricks man.'], ['장난하던 그이.']),
	Sp(
		'An officer',
		'm',
		['He used to. As a boy.', 'Boats. Gates. Other people’s shoes.', 'He’s a lord now. High seat. He quit.'],
		['어릴 때요. 그랬습니다.', '배. 문. 남의 신.', '지금은 높은 자리입니다. 그만뒀습니다.']
	),
	D('nulji', ['Send for him.'], ['불러.']),
	P('They send. The streets still want a funeral. The hall wants a talker.', '보낸다. 거리는 아직 장례를 원한다. 대청은 말하는 사람을 원한다.')
];

const THIN = [
	P(
		'The song followed him into the hall. He lets it. He has been walking since the lamps went.',
		'노래가 대청까지 따라왔다. 그냥 둔다. 등불 꺼진 뒤부터 걸어왔다.'
	),
	D('nulji', ['Jesang.', 'The north has one.', 'The island has the other.', 'I have a chair.'], [
		'제상아.',
		'북에 하나.',
		'섬에 하나.',
		'난 의자야.'
	]),
	D('jesang', ['I’m a lord now.', 'I quit the boats.'], ['난 이제 벼슬이야.', '배는 그만뒀어.']),
	D('nulji', ['I didn’t send for the lord.', 'I sent for the boy who stole them.'], [
		'벼슬 부른 거 아니야.',
		'배 훔치던 애를 부른 거야.'
	]),
	D('jesang', ['That boy got people in trouble.'], ['그 애, 사람 곤란하게 했어.']),
	D(
		'nulji',
		['They took my brothers.', 'Not asked. Took.', 'Robbing a thief is no thievery.'],
		['내 아우들을 가져갔어.', '청한 게 아니야. 가져간 거야.', '도둑을 터는 건 도둑질이 아니야.']
	),
	D('jesang', ['That’s a proverb.'], ['그건 속담이야.']),
	D(
		'nulji',
		[
			'That’s the job.',
			'This country is finished. You heard the songs.',
			'They need to see three of us.',
			'Then they start believing we can start.'
		],
		['그게 일이야.', '이 나라 끝났어. 노래 들었잖아.', '우리 셋을 봐야 해.', '그래야 다시 시작할 수 있다고 믿어.']
	),
	D('jesang', ['If I go I might not come back.'], ['가면 안 돌아올 수도 있어.']),
	D('nulji', ['Then your name will.', 'I’ll see to it.'], ['그럼 이름은 남아.', '내가 할게.']),
	D('jesang', ['I’ll go.'], ['갈게.']),
	D('nulji', ['Don’t bring me a reason.', 'Just the people.'], ['이유는 가져오지 마.', '사람만.']),
	D('jesang', ['The north first.', 'The island after.'], ['북쪽 먼저.', '그다음 섬.']),
	D('nulji', ['Don’t stop at your house between.', 'If you stop I might— I might keep you.'], [
		'그 사이 집에 서지 마.',
		'서면 내가— 내가 붙잡을지도 몰라.'
	]),
	D('nulji', ['If you don’t go, I will.'], ['네가 안 가면, 내가 가.']),
	D('jesang', ['You can’t.', 'If the chair is empty, the island knows.'], [
		'안 돼.',
		'의자 비면 섬이 알아.'
	]),
	D('nulji', ['…Right.', 'Then it’s you.'], ['……그래.', '그럼 너야.']),
	P('He does not say if. He says after. That is the old sentence, grown up.', '만약이라고 안 한다. 그다음이라고 한다. 옛 문장이 어른이 된 것이다.')
];

const NAME = [
	S('The Three', '셋'),
	P(
		'Miseheun comes home on the Silla ship. The yard fills. Not a court. The street. The well-woman. The boy. The drunk.',
		'미사흔이 신라 배를 타고 온다. 마당이 찬다. 조정이 아니다. 거리. 우물가 여자. 아이. 취한 사람.'
	),
	P(
		'Three brothers stand in the packed earth. Nulji. Bokho. Miseheun. The songs stop in the middle of a verse.',
		'세 형제가 다진 흙 위에 선다. 눌지. 복호. 미사흔. 노래가 절반에서 멈춘다.'
	),
	Sp('A woman at the well', 'f', ['That’s—', 'That’s all three.'], ['저게—', '저게 셋이야.']),
	Sp('A boy', 'm', ['The king has a hall with people in it—'], ['임금 대청에 사람이—']),
	P(
		'They start to believe. Not a country yet. The start of one.',
		'믿기 시작한다. 나라는 아직 아니다. 그 시작이다.'
	),
	P(
		'Nulji looks at the sky. Not at the crowd. The name he promised is already doing the work.',
		'눌지가 하늘을 본다. 무리는 안 본다. 약속한 이름이 이미 일을 한다.'
	),
	D('nulji', ['Jesang.', 'I said your name would last.', 'It will.'], [
		'제상아.',
		'이름 남는다고 했어.',
		'남을 거야.'
	]),
	P(
		'He names the dead man Deachan. He marries Miseheun to Jesang’s second daughter.',
		'죽은 사람을 대아찬이라 부른다. 미사흔을 제상의 둘째 딸과 혼인시킨다.'
	),
	D('miseheun', ['I took the boat.', 'The coat— he wore the coat.'], [
		'배 탔습니다.',
		'그 옷— 그이가 입었습니다.'
	]),
	D('nulji', ['He meant you to.', 'I remember the name.'], ['그러라고 한 거야.', '이름 기억한다.']),
	P(
		'<b>The prince who oiled a rusty hinge now sits where his father sat…!</b>',
		'<b>녹슨 경첩에 기름을 친 왕자가, 이제 아비가 앉던 자리에 앉는다…!</b>'
	)
];

function one(entry, fragment) {
	const hits = find(entry, fragment);
	if (hits.length !== 1) throw new Error(`"${fragment}" hits: ${hits.length}`);
	return hits[0];
}

function spliceRange(entry, startFrag, endFrag, next) {
	const a = one(entry, startFrag);
	const b = one(entry, endFrag);
	if (a.list !== b.list) throw new Error(`lists differ: ${startFrag} / ${endFrag}`);
	a.list.splice(a.i, b.i - a.i + 1, ...next);
}

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Park Jesang');
	if (!e) throw new Error('missing Park Jesang');

	spliceRange(e, 'Nulji hears it from the window', 'The streets want a funeral', ASK);

	const boys = one(e, 'Two boys on a wet boat');
	boys.b.html =
		'Two boys on a wet boat. One will be king. The other already knows which oar is his. And which boat is not his.';
	boys.b.ko =
		'젖은 배 위에 소년 둘. 하나는 임금이 된다. 다른 하나는 이미 제 노를 안다. 그리고 제 배가 아닌 배도.';

	const send = one(e, 'If I ever have to send someone');
	send.list.splice(send.i, 0,
		D('nulji', ['That was someone’s boat.'], ['누구 배였어.']),
		D('jesang', ['They left it untied.', 'That’s a gift.'], ['묶어 놨어야지.', '그건 선물이야.']),
		D('nulji', ['That’s a crime.'], ['그건 죄야.']),
		D('jesang', ['Then don’t send me when you’re king.'], ['그럼 왕 되면 나 보내지 마.'])
	);

	spliceRange(e, 'The song followed him into the hall', 'He does not say if', THIN);

	spliceRange(e, 'Miseheun comes home on the Silla ship', 'The prince who oiled a rusty hinge', NAME);

	return true;
});

console.log('applied jesang court + ending');
