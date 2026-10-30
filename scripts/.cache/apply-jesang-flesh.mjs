/** Flesh Park Jesang: Jangsu wordplay, Han chase east of Baekje, seizure, Wa hate, torture, stone. */
import { editStory, find } from './story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const S = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const Sp = (speaker, gender, en, lines) => ({ kind: 'dialogue', speaker, gender, en, lines });

const HALL_AND_CHASE = [
	P(
		'Jesang does not kneel first. He sits the way a man sits when he has already decided the ending.',
		'제상은 먼저 안 꿇는다. 이미 끝을 정한 사람이 앉는 방식으로 앉는다.'
	),
	D('jangsu', ['Another Silla man.'], ['신라 사람 또 왔구먼.']),
	D(
		'jesang',
		['The man who wrote that word is dead.', 'So is the man he wrote it to.'],
		['그 글 쓴 사람은 죽었소.', '쓰인 사람도 죽었소.']
	),
	D('jangsu', ['You talk well.'], ['말 잘하네.']),
	D(
		'jesang',
		['Your father took kingdoms.', 'You already have them.', 'A man who has them does not need a child for furniture.'],
		['선왕께서는 나라를 취하셨소.', '태왕께는 이미 있소.', '가진 사람은 아이를 가구로 안 쓰오.']
	),
	D('jangsu', ['That’s flattery.'], ['아첨이군.']),
	D(
		'jesang',
		['Flattery is for the weak.', 'I am telling a great king a fact, in his own hall.'],
		['아첨은 약한 사람 것이오.', '나는 태왕께, 이 대청에서, 사실을 고하오.']
	),
	Sp(
		'A Goguryeo officer',
		'm',
		['Rent is rent, Tae Wang.', 'The boy stays.'],
		['세는 세입니다, 태왕이시여.', '아이는 남습니다.']
	),
	D('jangsu', ['What do I get.'], ['나는 뭘 받지.']),
	D('jesang', ['What you already have.', 'A guest.'], ['이미 가진 것이오.', '손님.']),
	D('jangsu', ['I have a hostage.'], ['나는 볼모가 있어.']),
	D(
		'jesang',
		[
			'You have a boy who has eaten your rice since two kings died.',
			'That is a guest.',
			'I am only taking a guest home.'
		],
		['두 왕이 죽은 뒤로 태왕의 밥을 먹은 아이요.', '그건 손님이오.', '나는 손님을 데려갈 뿐이오.']
	),
	D('jangsu', ['Say Silla is the younger.'], ['신라가 아래라고 해.']),
	D('jesang', ['Silla is the younger of the two who asked.'], ['신라는 청한 둘 중에 아래요.']),
	D('jangsu', ['Say it again.'], ['다시 해.']),
	D(
		'jesang',
		[
			'Silla is the younger of the two who asked.',
			'Your father heard it in the dirt.',
			'I am not writing a new paper.',
			'I am taking a guest home.'
		],
		['신라는 청한 둘 중에 아래요.', '선왕께서 흙에서 들으셨소.', '새 글은 안 쓰오.', '손님을 데려가오.']
	),
	P(
		'Jangsu’s mouth moves. Not a smile. The start of one. The hall feels it, the way a hall feels a weather change.',
		'장수의 입이 움직인다. 웃음은 아니다. 그 시작이다. 대청이 느낀다. 날씨가 바뀌는 방식으로.'
	),
	D('jangsu', ['You came alone.'], ['혼자 왔군.']),
	D('jesang', ['A hall that needs an army has already said no.'], ['군대가 필요한 대청은 이미 거절한 대청이오.']),
	D('jangsu', ['And if I say no.'], ['거절하면.']),
	D('jesang', ['Then I go to the island with nothing.'], ['그럼 빈손으로 섬에 가오.']),
	D(
		'jangsu',
		['A well-made ask is still an ask.', 'A guest may leave.', 'Take him.'],
		['잘 만든 청도 청이야.', '손님이면 가도 돼.', '데려가게.']
	),
	D('jesang', ['There is a next.', 'That one is ours.'], ['다음이 있소.', '그건 우리 것이오.']),
	D('jangsu', ['I will not ask what is next.'], ['다음은 안 묻지.']),
	P(
		'They are already on the stairs when the officer finds his voice. Jesang does not look back.',
		'장수가 입을 열 때, 둘은 이미 계단에 있다. 제상은 안 돌아본다.'
	),
	Sp('A Goguryeo officer', 'm', ['Tae Wang.', 'You said guest.'], ['태왕이시여.', '손님이라 하셨습니다.']),
	D('jangsu', ['I did.'], ['그랬지.']),
	Sp(
		'A Goguryeo officer',
		'm',
		['A hostage owes.', 'A guest does not.', 'If he was a guest, they never owed.', 'Every title we put on them comes off.'],
		['볼모는 빚이 있습니다.', '손님은 없습니다.', '손님이었으면, 원래 빚이 없습니다.', '우리가 붙인 호가 다 떨어집니다.']
	),
	Sp(
		'A Goguryeo officer',
		'm',
		['And the younger.', 'Younger of the two who asked.', 'He meant the yard.', 'The one who knelt.', 'Not the chair.'],
		['그리고 아래.', '청한 둘 중에 아래.', '마당을 말한 겁니다.', '꿇은 쪽.', '의자가 아닙니다.']
	),
	P(
		'Jangsu’s hand is on the window-frame. The start of the smile is gone. He has been generous in his own hall, and the generosity just turned around and bit him.',
		'장수의 손이 창틀에 있다. 웃음의 시작이 없다. 제 대청에서 후했다. 그 후함이 돌아서서 물었다.'
	),
	D('jangsu', ['Bring the boy.', 'Alive.', 'The Silla man too.'], ['아이 데려와.', '살려서.', '신라 놈도.']),
	S('The East Ford', '동쪽 나루'),
	{
		kind: 'map',
		year: 418,
		places: ['pyongyang', 'wirye', 'surabol'],
		routes: ['jesang418-home', 'jesang418-chase'],
		riverNames: true,
		caption: 'East across the Han. Not the west road. The west road is someone else’s country.',
		ko: '한강을 동으로 건넌다. 서쪽 길은 안 탄다. 서쪽 길은 남의 나라다.'
	},
	P(
		'They ride southeast. Not south. South-west is someone else’s argument.',
		'동남으로 탄다. 남쪽이 아니다. 서남은 남의 싸움이다.'
	),
	P(
		'They keep the Han on the right until the east ford. Baekje is the other bank of a different story. They do not take that road.',
		'동쪽 나루까지 한강을 오른쪽에 둔다. 백제는 다른 이야기의 다른 강가다. 그 길은 안 탄다.'
	),
	P('For one ridge the hall still means it.', '능선 하나만큼은, 대청이 아직 진심이다.'),
	P(
		'Then the dust behind them is not weather. It is horses. A lot of horses. Jesang does not swear. He shortens the reins.',
		'뒤의 먼지가 날씨가 아니다. 말이다. 말이 많다. 제상은 욕하지 않는다. 고삐를 짧게 잡는다.'
	),
	D('bokho', ['They said I could leave.'], ['가도 된다 하지 않았소.']),
	D('jesang', ['Keep low.', 'Don’t look back.'], ['숙이시오.', '돌아보지 마시오.']),
	P(
		'The first arrows come at the river-bend. One hits Jesang’s saddle and stands there, quivering, like a question.',
		'첫 화살은 강굽이에서 온다. 하나가 제상 안장에 꽂혀 선다. 질문처럼 떤다.'
	),
	D('bokho', ['That one—', 'There’s no head on it.'], ['저거—', '촉이 없소.']),
	P(
		'Another shaft slaps the horse’s neck and falls in the grass. Wood. Just wood. A third kisses Jesang’s sleeve and drops.',
		'다음 대가 말 목을 치고 풀에 떨어진다. 나무다. 나무뿐. 세 번째가 제상 소매를 스치고 떨어진다.'
	),
	P(
		'On the ridge the Goguryeo line is still shooting. Nobody aims at the horses’ legs. Nobody rides down to finish it. These men used to steal the boy’s rice.',
		'능선에서 고구려 줄이 아직 쏜다. 말 다리를 노리는 사람은 없다. 내려와 끝내는 사람도 없다. 이 사람들은 그 아이 쌀을 훔치던 사람들이다.'
	),
	D('bokho', ['They used to steal my rice.', 'I let them.', 'I— I knew their names.'], [
		'내 쌀을 훔쳤소.',
		'내가 뒀소.',
		'나— 이름을 알았소.'
	]),
	D('jesang', ['Then ride.', 'They just spent that.'], ['그럼 타시오.', '방금 그걸 썼소.']),
	P(
		'The Han is brown and wide. No bridge. No ferry that will wait. The east current is the road.',
		'한강은 갈색이고 넓다. 다리 없다. 기다려 주는 나룻배도 없다. 동쪽 물살이 길이다.'
	),
	P(
		'They hit the water so hard the horses scream. Arrows stitch the near bank, still blunt, still enough to kill if one finds an eye.',
		'물에 들어가니 말이 운다. 화살이 이쪽 강가를 꿰맨다. 아직 뭉툭하다. 눈에 맞으면 그래도 죽는다.'
	)
];

const SEIZE = [
	P(
		'Royal troops come through the yard gate. Not a polite escort. Spears. Hands. The king’s own men.',
		'왕실 군사들이 마당 문으로 들어온다. 정중한 호위가 아니다. 창. 손. 임금의 사람들이다.'
	),
	P(
		'They take her in the packed earth of the yard. A soldier grabs her arm. Another lifts a daughter off the ground. She kicks. She will not stand. They drag her.',
		'마당 다진 흙에서 잡는다. 군사 하나가 팔을 잡는다. 다른 하나가 딸을 땅에서 들어올린다. 찬다. 일어서지 않는다. 끌어간다.'
	),
	P(
		'Later they name that dirt. They call it 불지지 — the place she would not stand.',
		'나중에 그 흙에 이름을 붙인다. 불지지. 일어서지 않은 곳.'
	),
	D('chisul', ['You didn’t even turn.', 'You didn’t even—', '제상!'], ['안 돌아봤어.', '안 돌아봤잖아—', '제상!']),
	P(
		'He looks at the king. Not at her. Looking at her would make the rest of it optional.',
		'임금을 본다. 그녀는 안 본다. 보면 나머지가 선택이 되니까.'
	),
	D('jesang', ['The children first.', 'Stand up.', 'Please.'], ['아이들 먼저.', '일어서.', '제발.']),
	D('chisul', ['After.', 'When is after.', 'When is after the island.'], [
		'그다음.',
		'그다음이 언제야.',
		'섬 다음이 언제야.'
	]),
	P(
		'A spear-butt finds her shoulder. She goes down in the dirt and they haul her anyway. The girls scream. The yard does not help.',
		'창 자루가 어깨에 닿는다. 흙에 쓰러져도 끌어간다. 딸들이 운다. 마당은 안 돕는다.'
	)
];

const ASUKA_OPEN = [
	P(
		'The East’s court sits on packed earth and raised floors. Cypress. A gravel yard that has never heard a Silla song.',
		'동쪽 조정은 다진 흙과 마루 위에 앉는다. 편백. 신라 노래를 한 번도 안 들어 본 자갈 마당.'
	),
	P(
		'Jesang does not bow. The magenta silk is still wet from a different crossing. His face is not a guest’s face. It is a man who watched his house taken.',
		'제상은 안 절한다. 자줏빛 비단이 다른 강을 아직 머금고 있다. 얼굴이 손님 얼굴이 아니다. 집을 뺏기는 걸 본 얼굴이다.'
	)
];

const ASUKA_ASK = [
	D(
		'nintoku',
		['A Silla man, tired of his king.', 'Convenient.', 'Sit.'],
		['신라 사람, 제 임금에 지쳤군.', '편하군.', '앉으시오.']
	),
	D(
		'jesang',
		[
			'I did not come to sit.',
			'They took my house.',
			'They took the woman in it.',
			'They put my children in a room with no window.'
		],
		['앉으러 온 게 아니오.', '내 집을 가져갔소.', '그 안의 사람을 가져갔소.', '아이들을 창 없는 방에 넣었소.']
	),
	D('nintoku', ['Then what did you come to do.'], ['그럼 뭘 하러 왔소.']),
	D(
		'jesang',
		[
			'Give me a fleet.',
			'A small army. Enough to knock on Surabol.',
			'I will take my family back.',
			'You can keep whatever is left of the hall.',
			'I want the man who named me.'
		],
		['함대를 주시오.', '작은 군대. 서라벌을 두드릴 만큼.', '내 식구를 찾아오겠소.', '대청에 남은 건 가지시오.', '나를 부른 자를 원하오.']
	),
	P(
		'The Wa king’s mouth moves. Not a smile. The start of one. He likes a man who arrives already ruined, and this one arrives already hunting.',
		'왜왕 입이 움직인다. 웃음은 아니다. 그 시작이다. 이미 망하고 온 사람을 좋아한다. 이 사람은 이미 사냥하고 왔다.'
	)
];

const FIRE = [
	P(
		'They take him back to the hall. Sotsuhiko brings the man, not the capital. Late is still too soon for him.',
		'대청으로 다시 데려온다. 소쓰히코는 도성이 아니라 사람을 가져온다. 늦어도 그에게는 이르다.'
	),
	P(
		'They beat him first. In the yard. A post. A rope. He does not sit. He uses the whole of his air on one sentence.',
		'먼저 때린다. 마당에서. 기둥. 밧줄. 앉지 않는다. 숨 전부를 한 문장에 쓴다.'
	),
	D('jesang', ['A dog of Silla—'], ['신라의 개—']),
	P(
		'Water next. A tub. They hold him under. He comes up with the same sentence, louder, wrecked, still the same.',
		'그다음 물. 통. 담근다. 올라올 때 같은 문장이다. 더 크다. 망가졌다. 그래도 같다.'
	),
	D('jesang', ['A dog— of— Silla—'], ['신라—의— 개—']),
	D('nintoku', ['Sit.', 'As a minister.', 'We will even give you a chair.'], [
		'앉으시오.',
		'신하로.',
		'의자까지 드리리다.'
	]),
	P('They tie him to the post. The fire takes the hem first. He does not sit.', '기둥에 묶는다. 불이 먼저 단을 먹는다. 앉지 않는다.'),
	D('jesang', ['I’d rather be a minister of Wa—', '<b>I’d rather be a dog of Silla!</b>'], [
		'왜의 신하가 되리다—',
		'<b>신라의 개가 되리다!</b>'
	]),
	P(
		'The fire takes the skirt. He looks up. He uses the whole of his air, and then the air after that.',
		'불이 치마를 먹는다. 위를 본다. 숨 전부를 쓰고, 그다음 숨까지 쓴다.'
	),
	D('jesang', ['<b>A dog of Silla!</b>', 'A dog— of— Silla—!'], ['<b>신라의 개다!</b>', '신라—의— 개—!']),
	P(
		'He is still saying it when the post goes. The same sentence. Louder each time, until there is no more air in him, only the words.',
		'기둥이 넘어갈 때도 그 말이다. 같은 문장. 갈수록 크다. 숨이 없을 때까지. 말만 남을 때까지.'
	),
	P('The sky does not answer. It does not have to. The island heard him.', '하늘은 안 대답한다. 안 해도 된다. 섬이 들었다.')
];

const STONE = [
	P('She looks east until looking is all that’s left. The girls look because she looks.', '동쪽을 보다가, 보는 일만 남는다. 딸들은 그녀가 봐서 본다.'),
	D('chisul', ['At Buljiji…', 'He said stand up.', 'After is this.'], ['불지지에서…', '일어서라 했어.', '그다음이 이거야.']),
	Sp('The elder daughter', 'f', ['Mother.', 'Let’s go down.'], ['어머니.', '내려가요.']),
	D('chisul', ['If we go down we can’t see.', 'He has to see— he has to come.'], [
		'내려가면 안 보여.',
		'봐야 해— 와야 해.'
	]),
	P(
		'The ridge keeps her. Weather comes. Weather goes. She does not.',
		'고개가 붙잡는다. 날씨가 온다. 날씨가 간다. 그녀는 안 간다.'
	),
	P(
		'Later they will say stone. The body stops answering. The looking does not. A stone on the ridge with a woman’s patience.',
		'나중에 돌이라 한다. 몸은 대답을 그만둔다. 보는 일은 안 그만둔다. 고개 위에 돌. 아낙의 참을성.'
	),
	P(
		'Later than that, a bird. The daughters wait until there is nothing left to wait with, and then they go down without her.',
		'그보다 나중에, 새. 딸들은 기다릴 것이 없을 때까지 기다리다가, 그녀 없이 내려간다.'
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

	spliceRange(e, 'Jesang does not kneel first', 'They hit the water so hard the horses scream', HALL_AND_CHASE);

	spliceRange(e, 'The guards take her in the packed earth', 'When is after the island', SEIZE);

	// Keep the Asuka map that sits between the court p and the old "does not get up" p.
	const court = one(e, "The East’s court sits on packed earth and raised floors");
	court.list.splice(court.i, 1, ...ASUKA_OPEN);
	const up = find(e, 'The Wa king does not get up');
	if (up.length === 1) up[0].list.splice(up[0].i, 1);

	spliceRange(e, 'A Silla man, tired of his king', 'The Wa king’s mouth moves', ASUKA_ASK);

	spliceRange(e, 'They take him back to the hall', 'The island heard him', FIRE);

	// Ridge: keep scene + place, replace looking-east through daughters wait.
	spliceRange(e, 'She looks east until looking is all', 'The daughters wait until there is nothing left', STONE);

	return true;
});

console.log('applied jesang flesh');
