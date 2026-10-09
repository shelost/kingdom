/**
 * Jeon (轉) + Gyeol (結), Bidam's rebellion days 6–10.
 * Jeon: the Day 8 "Stone" scene becomes Seohyun's deathbed (Yushin leaves the gate to Chunchu and a captain for one night,
 *   Bidam declines to use it), last words cut off, Kangrim's question → the Seohyun episode as his answer.
 * Gyeol: Day 9 cavern rebuilt as three Gaya men (Suro's spirit, then Muryuk, then Seohyun, cut off mid-sentence);
 *   the duel gains the pinned-down moment with the father's line in a flashback; Yushin's sword is the fish sword.
 * Idempotent: each episode checks its own marker first.
 */
import { editStory } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });
const extra = (speaker, en, ko) => ({ kind: 'dialogue', speaker, gender: 'm', chip: '#6b7280', en, lines: ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const english = (b) => [b.html, b.label, ...(b.en ?? [])].filter(Boolean).join(' ');
const at = (blocks, text, from = 0) => blocks.findIndex((b, i) => i >= from && english(b).includes(text));
const must = (i, what) => {
	if (i < 0) throw new Error(`not found: ${what}`);
	return i;
};

const FATHER_EN = 'No matter what you do…';
const FATHER_KO = '네가 무엇을 하든…';

/* —— Jeon, Day 8 night: the gate, the wall, the deathbed —— */
const jeonTail = [
	scene('The Moon Palace · near midnight', '월성 · 자정 무렵'),
	p(
		'Near midnight Chunchu comes to Yushin’s desk to say there are three days of rice left and not to tell the kitchen. A runner from the Kim house has beaten him there by a breath.',
		'자정 무렵, 쌀이 사흘 치 남았으니 부엌엔 말하지 말라고 전하러 춘추가 유신의 책상으로 온다. 김씨 집 심부름꾼이 한 숨 먼저 와 있다.'
	),
	extra(
		'A runner',
		['Marshal— it’s your father.', 'The physicians say tonight. He keeps asking for you.', '…And for his horse. We don’t know which one he means.'],
		['대장군— 아버님이십니다.', '의원들이 오늘 밤이라 합니다. 자꾸 대장군을 찾으십니다.', '…말도 찾으십니다. 어느 말을 말씀하시는지 저희는 모르겠고요.']
	),
	p(
		'Yushin stands up. Then he looks at the grain tally, and at the window where the Radiance fires are, and doesn’t move.',
		'유신이 일어선다. 그러고는 곡식 장부를 보고, 명활성 불빛이 보이는 창을 보고는, 움직이지 않는다.'
	),
	say('chunchu', ['Go.'], ['가.']),
	say(
		'yushin',
		['A rebel on the wall. Three days of rice. And the marshal goes home.'],
		['성벽엔 역적이 있고 쌀은 사흘 치일세. 그런데 대장군이 집엘 간다고.']
	),
	say(
		'chunchu',
		['For one night. I’ll sit in your chair and frown at the gate.', 'If Bidam sends a poem, I’ll answer it. If he sends men, I’ll wake your captain.', '…He won’t, though. He’s a gentleman. It’s the worst thing about him.'],
		['하룻밤이야. 네 자리에 앉아서 성문을 노려보고 있을게.', '비담이 시를 보내면 내가 답하고, 군사를 보내면 네 부장을 깨우지.', '…안 보낼 거야. 점잖은 양반이거든. 그게 제일 고약한 점이지.']
	),
	p(
		'Yushin gives the gate to his captain in one sentence: shut, and shut it stays. Then he takes the young grey out by the back way. It is Hanseul’s first errand, and it is this one.',
		'유신은 한 문장으로 성문을 부장에게 맡긴다. 닫아 두고, 닫힌 채로 둘 것. 그리고 어린 회색 말을 뒷길로 끌고 나간다. 한슬의 첫 심부름이 하필 이것이다.'
	),
	p(
		'On the Radiance wall an officer counts the torches leaving the palace. One. Riding south, fast.',
		'명활성 성벽 위에서 한 장교가 궁을 빠져나가는 횃불을 센다. 하나. 남쪽으로, 빠르게.'
	),
	extra(
		'A rebel officer',
		['Sangdaedeung. The marshal’s ridden out. Alone.', 'Give me two hundred men and the gate is ours by morning.'],
		['상대등. 대장군이 나갔습니다. 혼자.', '이백만 주십시오. 아침이면 저 성문은 우리 겁니다.']
	),
	say('bidam', ['Where to?'], ['어디로.']),
	extra('A rebel officer', ['The Kim house. They say the old man’s dying.'], ['김씨 댁입니다. 노인이 위독하답니다.']),
	p(
		'Bidam doesn’t answer for a while. He has already put his beads away tonight, so his hands have nothing to do.',
		'비담은 한동안 대답하지 않는다. 염주는 오늘 밤 이미 거둬 두었으니, 손이 할 일이 없다.'
	),
	say(
		'bidam',
		['I ate at that man’s table when I was sixteen. He apologised for the soup all night.', '…Let him go home.'],
		['열여섯 살에 그 어른 밥상에서 밥을 먹었다. 밤새 국이 싱겁다고 사과하시더군.', '……집에 가게 둬라.']
	),
	extra('A rebel officer', ['Sangdaedeung, the gate—'], ['상대등, 성문이—']),
	say('bidam', ['Will still be there tomorrow. So will I.'], ['내일도 거기 있다. 나도.']),

	scene('The Kim house, Surabol · the small hours', '서라벌, 김씨 집 · 새벽녘'),
	p(
		'The house is full of physicians who have stopped pretending. <b>Kim Seohyun</b> lies under two quilts with his riding boots beside the bed. He asked for them, and nobody has had the heart to ask where he thinks he’s going.',
		'집 안엔 시늉을 그만둔 의원들이 가득하다. <b>김서현</b>은 이불 두 채 아래 누워 있고, 침상 옆엔 그의 승마 신이 놓여 있다. 본인이 달라고 했고, 어딜 가시려느냐고 물을 만큼 모진 사람은 아무도 없었다.'
	),
	say('seohyeon', ['Captain? Are the horses— somebody see to the—', '…Ah. It’s you.'], ['부장인가? 말들은— 누가 좀 말들을—', '…아. 너로구나.']),
	say('yushin', ['It’s me, Father.'], ['저예요, 아버지.']),
	say(
		'seohyeon',
		['Which horse did you— not the white. You’ll lame him on these stones.'],
		['무슨 말을 타고— 흰 말은 안 된다. 이 돌길에 다리 절게 해.']
	),
	p(
		'Tonight Yushin edited heaven with a kite and a lie and never blinked. He finds he can’t tell this man about the white horse.',
		'오늘 밤 유신은 연 하나와 거짓말 하나로 하늘을 고치면서 눈 한 번 깜빡이지 않았다. 그런데 이 사람에게는 흰 말 얘기를 못 하겠다.'
	),
	say('yushin', ['A grey, Father. A new one.'], ['회색 말이에요, 아버지. 새 녀석이요.']),
	say(
		'seohyeon',
		['Grey. Good. Greys are— sensible.', 'They said there was fire in the sky tonight. Over the palace. I thought, that’ll be him.'],
		['회색. 좋다. 회색은— 얌전하지.', '오늘 밤 하늘에 불이 났다더구나. 궁 위에. 그 녀석이구나 했다.']
	),
	say('yushin', ['It was me.'], ['저였어요.']),
	say(
		'seohyeon',
		['Hm. Your mother always said you’d set the sky on fire one day. I told her not to encourage you.'],
		['흠. 네 어미가 늘 그랬지. 언젠가 네가 하늘에 불을 놓을 거라고. 부추기지 말라 했는데.']
	),
	p(
		'Somewhere in that sentence his vowels go south. When Yushin was seven, this man sat him down and made him say the capital’s vowels until he cried. He never once let his own slip in front of anyone. Tonight they have gone home without asking.',
		'그 문장 어딘가에서 그의 모음이 남쪽으로 내려간다. 유신이 일곱 살 때, 이 사람은 아들을 앉혀 놓고 울 때까지 도읍 말씨를 따라 하게 했다. 제 말씨는 누구 앞에서도 단 한 번 흘린 적이 없다. 오늘 밤 그 말씨가 허락도 없이 고향으로 돌아갔다.'
	),
	say('yushin', ['Father. Your voice.'], ['아버지. 말씨가.']),
	say('seohyeon', ['Hm? …Ah.', 'Don’t tell anyone.'], ['응? …아.', '아무한테도 말하지 마라.']),
	p(
		'He smiles about that for a while. Then he stops smiling and takes hold of his son’s sleeve, the one with the stone in it, hard enough to hurt.',
		'그는 한동안 그 일로 웃는다. 그러다 웃음을 멈추고 아들의 소매를, 돌이 든 그 소매를, 아플 만큼 세게 움켜쥔다.'
	),
	say(
		'seohyeon',
		['Yushin. Closer. There’s a thing I— I’ve meant to say it for forty years, and there was always a horse to see to, or—'],
		['유신아. 가까이. 할 말이— 마흔 해를 하려고 했는데, 늘 말을 봐야 했거나, 아니면—']
	),
	say('yushin', ['I’m here.'], ['여기 있어요.']),
	say('seohyeon', [FATHER_EN], [FATHER_KO]),
	p(
		'The rest of it doesn’t come. Yushin waits for it with his ear at his father’s mouth for a long time after there is nothing there to wait for.',
		'나머지는 오지 않는다. 기다릴 것이 없어진 뒤로도 한참을, 유신은 아버지의 입가에 귀를 댄 채 그 나머지를 기다린다.'
	),
	p(
		'Kangrim is already in the doorway with the red ledger open. He reads the name three times — Seohyun. Seohyun. Seohyun. — and makes the small cut.',
		'강림은 이미 문간에 서 있다. 붉은 명부를 펼친 채. 이름을 세 번 부른다 — 서현. 서현. 서현. — 그리고 짧게 끊는다.'
	),
	say(
		'seohyeon',
		['Ah— excuse me. I wasn’t finished.', 'I was in the middle of telling my son something, and he didn’t—'],
		['아— 실례하오. 아직 안 끝났소.', '아들한테 하던 말이 있는데, 저 녀석이 끝을—']
	),
	say(
		'kangrim',
		['Most people are in the middle of something, sir. The ledger has never once waited for a full stop.'],
		['대개들 무슨 말인가 하시던 중이오. 명부는 마침표를 기다려 준 적이 한 번도 없소.']
	),
	say(
		'kangrim',
		['One question, then we walk.', 'Kim Seohyun. The life you just finished — was it a Gaya life, or a Silla one?'],
		['하나만 묻고 가십시다.', '김서현. 방금 마치신 그 삶 — 가야의 삶이었소, 신라의 삶이었소?']
	),
	p(
		'Seohyun looks at his son, still bent over the bed with his ear at a mouth that has stopped.',
		'서현은 아들을 본다. 이미 멈춘 입에 아직도 귀를 대고 침상에 엎드려 있는 아들을.'
	),
	say('seohyeon', ['…That’s going to take a while.'], ['……그건 좀 길어지겠소.']),
	say('kangrim', ['It’s a long road, sir.'], ['길이 기오.']),
	p(
		'<b>To answer, Seohyun has to go back to a road, a gate, and a young man who got very lost on purpose…!</b>',
		'<b>대답하려면 서현은 돌아가야 한다. 길 하나, 대문 하나, 그리고 일부러 아주 크게 길을 잃었던 젊은이에게로…!</b>'
	)
];

/* —— Gyeol, Day 9 before light: three Gaya men in the steam —— */
const cavern = [
	p(
		'Yushin has carried his father’s stone in his sleeve for thirty years, and it has never once been warm. Before light on the ninth day, on the road back from his father’s house, it is.',
		'유신이 아버지의 돌을 소매에 넣고 다닌 지 서른 해, 한 번도 따뜻했던 적이 없다. 아홉째 날 동트기 전, 아버지 집에서 돌아오는 길에, 돌이 따뜻하다.'
	),
	scene('The cavern under the hill · before light', '언덕 아래 동굴 · 동트기 전'),
	{
		kind: 'place',
		place: 'steam_cavern',
		html: 'The one room in Silla where nobody asks him for a victory. This morning it has guests.',
		ko: '신라에서 아무도 그에게 승리를 요구하지 않는 단 하나의 방. 오늘 새벽엔 손님이 있다.'
	},
	p(
		'So Yushin goes to the cavern lake, as if habit could hold a country together. He leaves the young grey shivering at the mouth, his sword and his clothes on the rock lip, and wades in to the chest.',
		'그래서 유신은 습관이 나라를 붙잡아 주기라도 할 것처럼 동굴 호수로 간다. 어린 회색 말은 어귀에 떨게 두고, 칼과 옷은 바위턱에 두고, 가슴까지 물에 들어간다.'
	),
	p(
		'The three sisters are on the far rock. For once nobody says anything. Golhwa doesn’t even look at his waist, which has never happened, and he is too tired to notice that it hasn’t.',
		'세 자매는 저쪽 바위에 있다. 웬일로 아무도 입을 열지 않는다. 골화가 그의 허리를 쳐다보지도 않는다. 처음 있는 일인데, 그는 너무 지쳐서 그걸 알아채지도 못한다.'
	),
	p('He washes his hands. Then he washes them again.', '그는 손을 씻는다. 그리고 또 씻는다.'),
	say('suro', ['Turtle, turtle, show your head…', 'Mm. How does the rest go?'], ['거북아 거북아, 머리를 내어라…', '음. 그다음이 뭐더라?']),
	p(
		'Yushin turns so fast the water slaps the rock. An old man is sitting on the lip beside his sword, where nobody was a moment ago, feet in the water and beard in his lap, humming. You have met him. Yushin hasn’t.',
		'유신이 어찌나 빨리 돌아서는지 물이 바위를 친다. 방금까지 아무도 없던 그의 칼 옆 바위턱에, 노인 하나가 물에 발을 담그고 수염을 무릎에 얹은 채 흥얼거리고 있다. 당신은 이 노인을 만난 적이 있다. 유신은 없다.'
	),
	say('yushin', ['Who’s there?'], ['누구요?']),
	say('suro', ['Hm? No, no. You’ve got it the wrong way round.', 'Who are <b>you</b>?'], ['응? 아니, 아니. 거꾸로 물었소.', '<b>그대</b>는 누구요?']),
	say('yushin', ['…I am Kim Yushin. General of—'], ['…김유신이오. 대장군이오, 그—']),
	p(
		'He stops on the last word as if it were a step that isn’t there.',
		'마지막 말 앞에서 그는 멈춘다. 있어야 할 계단이 없는 것처럼.'
	),
	say('yushin', ['…of Silla.'], ['…신라의.']),
	say('suro', ['Hm…', 'Why the hesitation?'], ['흠…', '왜 머뭇거리오?']),
	say('yushin', ['…Some people still don’t think I belong to this country.'], ['…아직도 내가 이 나라 사람이 아니라는 이들이 있소.']),
	say('suro', ['Do you?'], ['그대는?']),
	say('yushin', ['Bidam says I was never—'], ['비담은 내가 애초에—']),
	say('suro', ['No, no, I’m not asking what Bidam thinks.', 'Do <b>you</b>?'], ['아니, 아니, 비담 생각을 묻는 게 아니오.', '<b>그대</b>는?']),
	say('yushin', ['…How did you know about our conversation?', 'Are you a spirit as well?'], ['…우리가 나눈 얘기를 어찌 아시오?', '그대도 혼령이오?']),
	say('suro', ['…Something like that.'], ['…비슷한 거요.']),
	p(
		'He says it with the old southern music on every vowel, unashamed. Yushin hasn’t heard it said out loud since he was seven, and he heard it last night.',
		'그는 모음마다 옛 남쪽 가락을 실어, 부끄럼 없이 말한다. 유신은 일곱 살 이후로 그 말씨를 소리 내어 들은 적이 없다. 어젯밤만 빼고.'
	),
	say('yushin', ['You talk like Gaya.', 'My father told me never to talk like that.'], ['가야 말씨를 쓰시는구려.', '아버지가 나더러 절대 그렇게 말하지 말라 하셨소.']),
	say('suro', ['Did he! Good for him.', 'Did it work?'], ['그러셨소? 잘하셨네.', '그래서, 먹혔소?']),
	say('yushin', ['…Mostly.'], ['…대체로.']),
	say('suro', ['Mostly!'], ['대체로라!']),
	p(
		'The old man laughs until he has to hold on to the rock. Four hundred years dead, and still the best audience in the cave.',
		'노인은 바위를 붙잡아야 할 만큼 웃는다. 죽은 지 사백 년인데, 아직도 이 동굴에서 제일 잘 웃어 주는 관객이다.'
	),
	say('suro', ['So. You came down here with a question.', 'Ask it.'], ['자. 물어볼 게 있어서 내려왔지.', '물어보시오.']),
	say('yushin', ['Not of a stranger.'], ['낯선 이에게는 안 묻소.']),
	say('suro', ['A stranger! In this water?'], ['낯선 이라! 이 물에서?']),
	p(
		'He nudges the sword beside him with one wet toe. The little fish in its pommel ring turns over in the lamplight.',
		'그는 젖은 발가락으로 옆에 놓인 칼을 쿡 찌른다. 자루 머리 고리 속의 작은 물고기가 불빛에 뒤집힌다.'
	),
	say('suro', ['What’s this made of?'], ['이건 뭘로 만들었소?']),
	say('yushin', ['Iron.'], ['쇠요.']),
	say('suro', ['Whose iron?'], ['누구네 쇠?']),
	say('yushin', ['…Gaya’s. Everyone’s is. Gaya had the mines.'], ['…가야 쇠요. 다들 그렇소. 광산이 가야에 있었으니.']),
	say('suro', ['Hm! And it cuts for Silla.', 'Does the iron mind?'], ['흠! 그런데 신라를 위해 베는군.', '쇠가 그걸 언짢아하오?']),
	say('yushin', ['Iron doesn’t mind anything.'], ['쇠는 아무것도 언짢아하지 않소.']),
	say('suro', ['Then why do you?'], ['그럼 그대는 왜 언짢소?']),
	p('Yushin opens his mouth. Nothing he owns fits in it.', '유신이 입을 연다. 가진 말 중에 맞는 게 없다.'),
	say('suro', ['Look down.'], ['내려다보시오.']),
	p(
		'Yushin looks down. The water has gone still as lacquer. There is only his own face in it, older than he thinks of it, with grey at the temple.',
		'유신이 내려다본다. 물이 옻칠처럼 잔잔해졌다. 거기엔 제 얼굴뿐이다. 그가 생각하는 것보다 늙었고, 관자놀이가 희끗하다.'
	),
	say('yushin', ['It’s only me.'], ['나뿐이오.']),
	say('suro', ['Only! You say it like it’s small.', 'Look harder.'], ['뿐이라! 꼭 작은 것처럼 말하는구려.', '더 자세히 보시오.']),
	p(
		'He looks harder. Steam crosses the water, and the face in it isn’t quite his any more. The beard is wrong. The eyes are older than any he has met in a mirror. When he looks up to say so, the rock is empty. There is only the sword, and wet prints where nobody was sitting.',
		'더 자세히 본다. 김이 물 위를 지나가고, 물속의 얼굴이 더는 온전히 제 것이 아니다. 수염이 다르다. 눈은 그가 거울에서 본 어떤 눈보다 늙었다. 그 말을 하려고 고개를 드니 바위가 비어 있다. 칼 한 자루, 그리고 아무도 앉지 않았던 자리의 젖은 발자국뿐.'
	),
	say('muryuk', ['You stand in the water the way I did.', 'Weight on the back foot. Ready to leave.'], ['물에 서 있는 꼴이 나랑 똑같구나.', '뒷발에 무게를 싣고. 언제든 떠날 사람처럼.']),
	p(
		'The voice is behind him. Yushin turns. An old soldier stands where the rock shelves into black, a cone helm under his arm, and it is the face from the water.',
		'목소리는 등 뒤에서 온다. 유신이 돌아선다. 바위가 검은 물로 꺾이는 곳에 늙은 군인 하나가 고깔 투구를 옆구리에 끼고 서 있다. 물속의 그 얼굴이다.'
	),
	say('yushin', ['…Have we met?', 'You look—'], ['…뵌 적이 있습니까?', '어딘가—']),
	say('muryuk', ['Yushin, my beloved grandson.'], ['유신아, 내 사랑하는 손자야.']),
	p(
		'The pause after it is long. Muryuk was always a man of long pauses. The histories never had the room.',
		'그 뒤의 침묵이 길다. 무력은 늘 침묵이 긴 사람이었다. 사서에 그걸 적을 자리가 없었을 뿐.'
	),
	say('yushin', ['…Grandfather.'], ['…할아버지.']),
	say(
		'muryuk',
		['I was a prince once. The youngest of three, in a cart going north.', 'My brothers watched the road ahead. I looked back.'],
		['나도 한때는 왕자였다. 셋 중 막내로, 북쪽으로 가는 수레에 타고.', '형들은 앞길을 봤지. 나는 뒤를 돌아봤다.']
	),
	say('yushin', ['…The surrender.'], ['…항복.']),
	say(
		'muryuk',
		['Then I was a general, for the people who owned the road.', 'I sat a king on a camp stool for them. I talked the last gate of Gaya open for them.'],
		['그다음엔 장수였다. 그 길의 주인들을 위한.', '그들을 위해 임금 하나를 군막 걸상에 앉혔고, 가야의 마지막 성문을 말로 열었다.']
	),
	p(
		'Somebody called him a traitor for each of those. He doesn’t say who. His grandson has just had six nights of it.',
		'그 하나하나마다 누군가는 그를 역적이라 불렀다. 누가 그랬는지는 말하지 않는다. 손자가 방금 엿새 밤을 그 소리를 들었으니.'
	),
	say('yushin', ['Why?'], ['왜 그러셨습니까?']),
	say(
		'muryuk',
		['When I swore allegiance to the Silla crown, it was not for my own sake, but for yours.'],
		['내가 신라 왕실에 충성을 맹세했을 때, 그것은 나 자신을 위해서가 아니라 — 너를 위해서였다.']
	),
	say('yushin', ['You never met me. I wasn’t even born.'], ['저를 보신 적도 없잖습니까. 태어나지도 않았는데.']),
	say('muryuk', ['I loved you before I knew you.'], ['나는 너를 알기 전에 너를 사랑했다.']),
	p('Yushin looks at the water, because it is easier.', '유신은 물을 본다. 그게 쉬우니까.'),
	say('muryuk', ['Yushin, look at me.', 'I am so, so proud of you…!'], ['유신아, 나를 보아라.', '나는… 정말, 정말 네가 자랑스럽다…!']),
	p(
		'Behind the old man the steam stirs again. A third man comes out of it barefoot, in the night-robe he died in a few hours ago, peering about like a guest who has walked into the wrong banquet.',
		'노인 뒤에서 김이 다시 일렁인다. 세 번째 사내가 맨발로 걸어 나온다. 몇 시간 전 숨을 거둘 때 입었던 잠옷 차림으로, 잔치를 잘못 찾아온 손님처럼 두리번거리며.'
	),
	say('seohyeon', ['Father, you said wait by the— I wasn’t sure which rock you—', '…Ah.'], ['아버지, 기다리라 하신 데가— 어느 바위인지 몰라서—', '…아.']),
	say('yushin', ['Father.'], ['아버지.']),
	p(
		'Yushin goes through the water at him. He throws his arms around his father, and they close on steam. He tries again. Steam. The Marshal of Silla is crying in front of three goddesses and two dead men, and he doesn’t stop to mind.',
		'유신이 물을 헤치고 그에게 간다. 아버지를 끌어안는데, 두 팔이 김을 안는다. 다시 해 본다. 김. 신라의 대장군이 여신 셋과 죽은 사내 둘 앞에서 울고 있고, 그는 그걸 개의치도 않는다.'
	),
	say(
		'seohyeon',
		['No— no, don’t, son. It doesn’t work.', 'I tried it on your grandfather an hour ago. Nearly drowned. And I’m already dead.'],
		['아니— 아니다, 그러지 마라. 안 된다.', '나도 아까 네 할아버지한테 해 봤다. 물에 빠져 죽을 뻔했어. 이미 죽었는데도.']
	),
	say('golhwa', ['Look at him — he’s crying.'], ['봐, 울잖아.']),
	p('She says it to the rock wall, so nobody can see her face.', '골화는 그 말을 바위벽에 대고 한다. 아무도 제 얼굴을 못 보게.'),
	say('yushin', ['You didn’t finish.', 'Last night. You were saying something and you didn’t—'], ['끝을 안 맺으셨잖아요.', '어젯밤에. 뭔가 말씀하시다가 그만—']),
	say(
		'seohyeon',
		['I know. I never was much good at the end of things.', 'Yushin, my beloved son.', 'You were the light of my life, and now the nation needs you to be its savior.'],
		['안다. 나는 원래 끝맺음에 서툴렀지.', '유신아, 내 사랑하는 아들아.', '너는 내 인생의 빛이었고, 이제 나라는 네가 구원자가 되기를 필요로 한다.']
	),
	say(
		'seohyeon',
		['I am sorry that I was not of Silla blood… I tried my hardest to forget my Gaya roots, and tried to pretend that I was something I was not.'],
		['미안하다… 내가 신라의 피가 아니어서. 가야의 뿌리를 잊으려 애썼고, 내가 아닌 무언가인 척하려 했다.']
	),
	say('yushin', ['The vowels.', 'You made me say them till I cried.'], ['말씨요.', '울 때까지 시키셨잖아요.']),
	say('seohyeon', ['I know. I know.', 'But you don’t need to do that anymore.'], ['안다. 알아.', '하지만 너는 더 이상 그렇게 할 필요가 없다.']),
	say(
		'seohyeon',
		['Son, you are the mighty Sword of Silla, and the Last Prince of Gaya.', 'But you are infinitely more than that…!', 'You are my son. You are Kim Yushin.'],
		['아들아, 너는 강력한 신라의 도검이며, 가야의 마지막 왕자이기도 하다.', '그러나 너는 그보다 무한히 더 크다…!', '너는 내 아들이다. 너는 김유신이다.']
	),
	p(
		'He leans in, close enough that his breath ought to stir the steam, and it doesn’t. It is the same lean as last night, by the bed.',
		'그가 몸을 기울인다. 숨결이 김을 흔들어야 할 만큼 가까이. 김은 흔들리지 않는다. 어젯밤 침상 곁에서와 똑같은 기울기다.'
	),
	say('seohyeon', ['Yushin. What I was saying.', FATHER_EN], ['유신아. 아까 하던 말.', FATHER_KO]),
	scene('The cavern mouth · first light', '동굴 어귀 · 첫새벽'),
	p(
		'Yushin comes up out of the cavern into first light with his hair still wet and the stone gone cold again in his fist. Whatever his father said after that, he tells nobody. You’ll hear it. Not yet.',
		'유신이 젖은 머리로, 다시 식어 버린 돌을 주먹에 쥐고 첫새벽 속으로 동굴을 나온다. 아버지가 그 뒤에 무슨 말을 했는지는 아무에게도 말하지 않는다. 당신은 듣게 될 것이다. 아직은 아니다.'
	),
	p(
		'Hanseul is waiting at the mouth, shivering. Across the valley the Radiance wall is grey with morning and already black with banners. Yushin mounts and rides at it. One more day of this. Then one more morning, and Bidam.',
		'한슬이 어귀에서 떨며 기다린다. 골짜기 건너 명활성 성벽은 아침빛에 잿빛이고, 벌써 깃발로 검다. 유신은 말에 올라 그쪽으로 달린다. 하루만 더. 그리고 아침 한 번 더, 그리고 비담.'
	)
];

/* —— Gyeol, Day 10: pinned in the beads —— */
const pinned = [
	p(
		'Neither does. The string does instead, and ninety-nine beads go into the mud between their feet. Yushin’s back heel comes down on a handful of them, and the Marshal of Silla, who has not been knocked off his feet since he was a boy, goes over backwards.',
		'둘 다 놓지 않는다. 대신 줄이 놓고, 아흔아홉 알이 두 사람 발 사이 진흙으로 쏟아진다. 유신의 뒤꿈치가 그중 한 줌을 밟고, 어려서 이후 한 번도 넘어진 적 없는 신라의 대장군이 뒤로 나자빠진다.'
	),
	p(
		'Bidam is on him before he finishes landing. A knee on the sword arm. The heavenly-horse blade up, point down, over the throat. Fifty-three, and for once he doesn’t move like it.',
		'유신이 다 떨어지기도 전에 비담이 그 위에 있다. 칼 든 팔에 무릎. 천마 칼은 위로, 칼끝은 아래로, 목 위에. 쉰셋인데, 이번만은 쉰셋처럼 움직이지 않는다.'
	),
	say('bidam', ['Say it.', 'Once in your life. Say “yield.”'], ['말해.', '평생 딱 한 번. “졌다”고.']),
	p('Yushin never learned the word. The point starts down.', '유신은 그 말을 배운 적이 없다. 칼끝이 내려오기 시작한다.'),
	{
		kind: 'flashback',
		year: '647',
		title: 'The ninth morning · 아홉째 새벽',
		blocks: [
			p(
				'Steam. His father’s face an arm’s length away, no use to anybody’s arms, getting to the end of a sentence at last.',
				'김. 한 팔 거리의 아버지 얼굴. 누구의 팔로도 안을 수 없는 그 얼굴이, 마침내 문장의 끝에 닿는다.'
			),
			say('seohyeon', [FATHER_EN, 'I am so proud of you…!'], [FATHER_KO, '아비는 네가 참으로 자랑스럽다…!'])
		]
	},
	p(
		'The point goes into the mud where his throat was. Yushin has rolled out from under the knee with the fish hilt still in his fist and the cut on his brow running into one eye. He comes up. He does not step back. He steps in.',
		'칼끝이 방금까지 그의 목이 있던 진흙에 박힌다. 유신은 물고기 자루를 쥔 채 무릎 밑에서 굴러 나왔고, 이마의 상처에서 흐른 피가 한쪽 눈으로 들어간다. 그가 일어선다. 물러서지 않는다. 파고든다.'
	)
];

editStory((story) => {
	const era = story.find((c) => c.id === 'chunchu-era');
	const jeon = era.entries.find((x) => x.title === 'Jeon (轉)');
	const gyeol = era.entries.find((x) => x.title === 'Gyeol (結)');
	let changed = 0;

	/* —— Jeon —— */
	if (!jeon.blocks.some((b) => b.kind === 'scene' && b.label === 'The Kim house, Surabol · the small hours')) {
		const b = jeon.blocks;
		const a = must(b.findIndex((x) => x.kind === 'scene' && x.label === 'The Stone'), 'Jeon: The Stone');
		must(at(b, 'Who was Kim Seohyun', a), 'Jeon: old card');
		b.splice(a, b.length - a, ...jeonTail);

		const k = jeon.images.findIndex((im) => im.id === 'yushin-cavern-lineage-wide');
		if (k >= 0) gyeol.images.push(...jeon.images.splice(k, 1));
		jeon.thumbnail = 'yushin-fire-kite';
		jeon.logline = {
			en: 'The sixth night’s tea turns to insult, the cavern throws Bidam out, a white horse burns for a falling star, and Yushin leaves the gate for one night to sit by his father.',
			ko: '여섯째 밤의 차는 욕설로 끝나고, 동굴은 비담을 내쫓고, 떨어진 별을 위해 흰 말이 바쳐지고, 유신은 하룻밤 성문을 떠나 아버지 곁에 앉는다.'
		};
		changed++;
	} else console.log('skip Jeon');

	/* —— Gyeol —— */
	if (!gyeol.blocks.some((b) => b.kind === 'dialogue' && b.en?.includes('Why the hesitation?'))) {
		const b = gyeol.blocks;
		const a = must(at(b, 'The water under the hill has been warm for thirty years'), 'Gyeol: opening');
		const z = must(at(b, 'He comes up out of the water with the stone gone cold', a), 'Gyeol: old cavern exit');
		b.splice(a, z - a + 1, ...cavern);

		const mid = must(at(b, 'By midday the ninth day has turned into the battle'), 'Gyeol: midday');
		b[mid].html = 'Yushin is back at the palace gate by mid-morning, and Chunchu gets out of his chair without a word. ' + b[mid].html;
		b[mid].ko = '유신은 오전 중에 궁문으로 돌아오고, 춘추는 말없이 그의 자리에서 일어난다. ' + b[mid].ko;

		const pom = must(at(b, 'Dragon pommel against heavenly horse'), 'Gyeol: pommel');
		b[pom].html = b[pom].html.replace('Dragon pommel against heavenly horse', 'Fish pommel against heavenly horse');
		b[pom].ko = b[pom].ko.replace('용 자루 머리와 천마', '물고기 자루 머리와 천마');
		const ring = must(at(b, 'dragon ring of his hilt'), 'Gyeol: ring');
		b[ring].html = b[ring].html.replace('dragon ring', 'fish ring');
		b[ring].ko = b[ring].ko.replace('용 고리', '물고기 고리');
		for (const im of gyeol.images)
			if (im.at === 'Dragon pommel against heavenly horse') {
				im.at = 'Fish pommel against heavenly horse';
				if (im.alt) im.alt = im.alt.replace('Dragon pommel', 'Fish pommel');
			}

		const s = must(at(b, 'Neither does. The string does instead.'), 'Gyeol: string');
		b.splice(s, 1, ...pinned);

		const beads = must(at(b, 'Ninety-nine beads go into the mud after the blood'), 'Gyeol: beads');
		b[beads] = p(
			'The beads are still rolling when it’s over. They stop one at a time, in the blood, like somebody counting.',
			'끝났을 때도 염주알들은 아직 구르고 있다. 핏속에서 하나씩 멈춘다. 누가 세기라도 하듯.'
		);

		gyeol.logline = {
			en: 'Three Gaya men wait for Yushin in the steam, and one of them doesn’t finish his sentence. Then the gate opens from the inside, and the score finally breaks.',
			ko: '김 속에서 가야 사내 셋이 유신을 기다리고, 그중 하나는 말을 끝맺지 못한다. 그리고 문이 안에서 열리고, 점수가 마침내 깨진다.'
		};
		changed++;
	} else console.log('skip Gyeol');

	console.log(`changed ${changed}`);
	return changed > 0;
});
