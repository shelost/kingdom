/**
 * Baekje rewrite, #72–#77 (Yellow Mountain → King Pungjang). `node scripts/.cache/rewrite/baekje.mjs`
 * Each episode is rebuilt in its own editStory call; a rebuilt episode is detected by its new first line and skipped.
 */
import { editStory, textOf } from '../story-ops.mjs';

const strip = (s = '') => s.replace(/<[^>]+>/g, '');

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const FB = (year, title, blocks) => ({ kind: 'flashback', year, title, blocks });

const CHIPS = {
	gyebek: '#8a6f3f',
	euija: '#e0b155',
	yushin: '#4a8fe0',
	chunchu: '#D8258C',
	munmu: '#3fa9c9',
	munhee: '#e07fa8',
	kangrim: '#5f5f6b',
	pumil: '#6a8ab8',
	sudingfang: '#d95f4b',
	yesikjin: '#a3813d',
	gumil: '#9a7b5f',
	gaozong: '#b8935a',
	wuzetian: '#9d7bd0',
	liurengui: '#1f2937',
	boksin: '#a8781f',
	pung: '#e6c76a',
	takutsu: '#b05575',
	saimei: '#c0504d'
};

const D = (person, en, ko, extra = {}) => {
	if (en.length !== ko.length) throw new Error(`dialogue ${person}: ${en.length}/${ko.length}`);
	return { kind: 'dialogue', chip: CHIPS[person] ?? '#8a8a94', person, lines: ko, en, ...extra };
};

/** An unprofiled speaker (nobody in people.ts): a label and a silhouette. */
const S = (speaker, chip, en, ko, extra = {}) => {
	if (en.length !== ko.length) throw new Error(`dialogue ${speaker}: ${en.length}/${ko.length}`);
	return { kind: 'dialogue', chip, speaker, gender: 'm', lines: ko, en, ...extra };
};

/** Copy of a block with fields replaced (keeps chip, person, look, zh…). */
const W = (b, patch) => ({ ...structuredClone(b), ...patch });

/** Blocks lo..hi kept as they are, in order (indices from the fresh dump). */
const range = (B, lo, hi) => Array.from({ length: hi - lo + 1 }, (_, k) => B(lo + k));

const firstText = (e) => strip(e.blocks.find((b) => b.kind === 'p')?.html);

/**
 * Rebuild one entry. `build(B)` returns the new top-level block list. `B(i, frag)` returns the
 * current block at index i after checking it still holds `frag` (a text fragment or a kind),
 * so a stale index throws before anything is saved.
 */
function rebuild(n, opening, build, { anchors = {}, logline } = {}) {
	return editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (firstText(e) === strip(opening.html)) {
			console.log(`#${n} ${e.title}: already applied`);
			return false;
		}
		const orig = e.blocks;
		const B = (i, frag) => {
			const b = orig[i];
			if (!b) throw new Error(`#${n} [${i}] missing`);
			if (frag === undefined) return b;
			const ok = frag === b.kind || strip(textOf(b)).includes(frag);
			if (!ok) throw new Error(`#${n} [${i}] expected "${frag}", found ${b.kind}: ${strip(textOf(b)).slice(0, 80)}`);
			return b;
		};
		e.blocks = [opening, ...build(B)];
		for (const im of e.images ?? []) if (im.id in anchors) im.at = anchors[im.id];
		if (logline) e.logline = logline;
		console.log(`#${n} ${e.title}: ${orig.length} → ${e.blocks.length} blocks`);
	});
}

// Baekje adjutant at Yellow Mountain, and Yushin's brother: neither has a people.ts entry.
const SEOKDAL = (en, ko) => S('Seokdal', '#d9b13a', en, ko);
const HEUMSUN = (en, ko) => S('Kim Heumsun', '#4f7fc4', en, ko);

/* ───────────────────────── #72 Yellow Mountain ───────────────────────── */

rebuild(
	72,
	P(
		'Gyebek can count to fifty thousand. He has done it twice since dawn. The answer has not improved.',
		'계백은 오만까지 셀 줄 안다. 동틀 녘부터 벌써 두 번 셌다. 답은 나아지지 않았다.'
	),
	(B) => [
		B(3, 'map'),
		B(25, 'scene'),
		P(
			'Hundred-Victories gets to the <b>Yellow Mountain Fields</b> first and picks his ground. Then he waits, for the Sword of Silla or for arithmetic, whichever arrives with a banner.',
			'백승이 <b>황산벌</b>에 먼저 닿아 자리를 고른다. 그리고 기다린다. 신라의 칼이든 셈이든, 깃발을 달고 먼저 오는 쪽을.'
		),
		B(27, 'place'),
		B(28, 'He sets three camps'),
		B(29, 'He walked the ground'),
		B(30, 'Four hundred and twelve.'),
		B(31, 'Nobody asked'),
		P(
			'His adjutant is Seokdal, a ferryman’s son from the bear ferry. He has kept Gyebek’s tallies since the border and has never once been thanked for it. He does not expect to start today.',
			'부관은 석달이다. 곰나루 뱃사공의 아들이다. 국경 시절부터 계백의 셈을 받아 적었고, 고맙다는 말은 한 번도 듣지 못했다. 오늘부터 들을 거라 기대하지도 않는다.'
		),
		SEOKDAL(
			['Scouts are back, General. Over the Tanhyeon pass. Yushin’s banner in front.'],
			['척후가 돌아왔습니다, 장군. 탄현을 넘어옵니다. 맨 앞에 유신의 깃발입니다.']
		),
		D('gyebek', ['How many.'], ['몇이오.']),
		SEOKDAL(['Fifty thousand, my lord.'], ['5만이라 하옵니다.']),
		D('gyebek', ['And ours.'], ['우리는.']),
		SEOKDAL(['…You know ours, General.'], ['…아시지 않습니까, 장군.']),
		D('gyebek', ['Say it. I want it said once.'], ['말하시오. 한 번은 소리로 듣고 싶소.']),
		SEOKDAL(['Five thousand.'], ['오천입니다.']),
		W(B(36, 'Five thousand against fifty thousand'), { speaker: undefined, chip: CHIPS.gyebek }),
		B(32, 'quote'),
		SEOKDAL(
			['And the sea, General. Sails at the river mouth. The boatmen gave up counting them.'],
			['그리고 바다입니다, 장군. 강어귀에 돛이 가득합니다. 뱃사람들이 세다가 그만뒀답니다.']
		),
		D('gyebek', ['Then I will count them later.'], ['그럼 나중에 내가 세겠소.']),
		P(
			'Here is the man the boatmen gave up on. His name is Su Dingfang, and he is sixty-five. Three winters ago he took a qaghan’s camp in a blizzard, before anyone in it had found his boots. His regiment painted a red bird on his tent afterwards, and Chang’an calls him the <b>Red Fowl</b>.',
			'뱃사람들이 세다 만 그 사내다. 이름은 소정방, 나이는 예순다섯. 세 해 전 겨울, 그는 눈보라 속에서 가한의 진영을 통째로 먹었다. 그 진영 안의 누구도 장화를 찾기 전이었다. 그 뒤로 부하들이 그의 군막에 붉은 새를 그려 넣었고, 장안은 그를 <b>주작</b>이라 부른다.'
		),
		B(2, 'card'),
		B(4, 'Snow is just cold sand'),
		B(6, 'scene'),
		B(7, 'That summer he sails east'),
		B(8, 'map'),
		B(9, 'You’re the son?'),
		B(10, 'Kim Bupmin, General'),
		B(11, 'Tenth day of the seventh month'),
		B(12, 'We will be there'),
		B(13, 'Bupmin is rowed back'),
		B(14, 'They’ll be late'),
		B(15, 'scene'),
		P(
			'The king rides as far as a hill fort and no farther. The field belongs to his son and to Yushin. Under Yushin ride two more generals. Heumsun is his younger brother, with a boy of fifteen in the ranks. Pumil has one of sixteen. Fifty thousand men march west with a date in their heads, and between them and the date sits a man called Gyebek.',
			'임금은 산성 하나까지만 오고 더는 오지 않는다. 들판은 아들과 유신의 몫이다. 유신 밑으로 장수가 둘 더 있다. 흠순은 유신의 아우이고, 대열 속에 열다섯 살 아들이 있다. 품일에게는 열여섯 살이 하나 있다. 오만 군사가 머릿속에 날짜 하나를 넣고 서쪽으로 간다. 그들과 그 날짜 사이에 계백이라는 사내가 앉아 있다.'
		),
		B(17, 'The tenth day, then'),
		B(18, 'scene'),
		B(19, 'On the ninth day'),
		B(20, 'place'),
		B(21, 'Mud is just wet road'),
		B(22, 'His men lay willow mats'),
		B(23, 'The same morning, forty miles east'),
		B(24, 'map'),
		W(B(33, 'formation'), { note: '5,000 against 50,000. Three camps across three roads, and no fourth way in.' }),
		B(37, 'Then the air above the Yellow Mountain'),
		B(38, 'They cheer. They wave.'),
		B(39, 'You can all see me'),
		B(40, 'If even death showed up early'),
		P(
			'Gyebek kneels. He plants his sword in the yellow dust, point down. Inside its ring pommel sits a phoenix, the same bird that rode the incense burner he once dove for. He keeps his hand on it. Gyebek stands when the dust has learned the shape.',
			'계백은 무릎을 꿇는다. 칼끝을 아래로 하여 노란 먼지에 칼을 꽂는다. 고리 자루 안에 봉황이 앉아 있다. 언젠가 그가 강에 뛰어들어 건져 낸 향로 꼭대기의 그 새다. 그는 손을 그 위에 얹고 있다. 먼지가 그 모양을 기억하면, 계백은 일어선다.'
		),
		B(43, 'Seventh-month heat'),
		B(45, 'Dust on the ridge'),
		B(46, 'Shall we settle their argument?'),
		B(47, 'I do not drink in taverns'),
		B(48, 'Hold your ground, then'),
		B(49, 'scene'),
		B(50, 'Silla comes on the first time'),
		B(51, 'One.'),
		B(52, 'scene'),
		B(53, 'The second time Silla'),
		B(54, 'Two.'),
		B(55, 'Report.'),
		SEOKDAL(
			['…Left camp still has arrows.', 'Centre has men.', 'Right has both, and less of each than an hour ago.'],
			B(56, 'Left camp still has arrows').lines
		),
		B(57, 'scene'),
		B(58, 'The third time Pumil'),
		B(59, 'Three.'),
		B(60, 'scene'),
		P(
			'The fourth time Yushin rides at the head of the centre himself, on the white horse, and meets Hundred-Victories in the gap between the camps. Both armies stop to watch two men, which armies are not supposed to do.',
			'네 번째에는 유신이 몸소 흰 말을 타고 가운데 맨 앞에 서서, 진영과 진영 사이의 틈에서 백승을 만난다. 양쪽 군대가 두 사내를 구경하느라 멈춘다. 군대가 해서는 안 되는 일이다.'
		),
		P(
			'Gyebek comes the way the border remembers him. Gomanari at full stretch, Gyebek flat along the black neck like a thrown knife. His blade lies reversed along his forearm, edge out. There is no sword in his hand to watch. That is the point.',
			'계백은 국경이 기억하는 그대로 온다. 고마나리가 몸을 끝까지 뻗고, 계백은 던진 칼처럼 검은 목덜미에 바짝 엎드린다. 칼날은 거꾸로 쥐어 팔뚝을 따라 눕혔고, 날은 바깥을 향한다. 손에 지켜볼 칼이 없다. 그게 요점이다.'
		),
		P(
			'The tall Silla helm comes in at a gallop. Yushin has heard the tavern stories. He watches the hand, the way the stories say to, and reads the reversed blade half a beat late.',
			'신라의 높은 투구가 달려 들어온다. 유신도 주막의 이야기를 들었다. 이야기가 시키는 대로 손을 본다. 그리고 거꾸로 쥔 칼날을 반 박자 늦게 읽는다.'
		),
		P('They meet in the dust. Nobody hears steel. They hear the white horse scream.', '먼지 속에서 만난다. 쇳소리는 아무도 듣지 못한다. 흰 말이 비명 지르는 소리만 듣는다.'),
		P(
			'Then the white horse is going back the way it came with a red line along its shoulder, and the Sword of Silla is holding his left arm against his ribs. Gyebek turns Gomanari in his own length and walks him home. He came for one cut. He got half of one.',
			'그러고 나면 흰 말은 왔던 길로 돌아가고 있고, 그 어깨에 붉은 줄이 하나 그어져 있으며, 신라의 칼은 왼팔을 갈비뼈에 붙여 안고 있다. 계백은 고마나리를 제자리에서 돌려 천천히 걸려 돌아간다. 한 번 베러 왔다. 반 번을 벴다.'
		),
		B(62, 'Behind him the fifty thousand'),
		B(63, 'Four.'),
		B(67, 'After the fourth time there is a lull'),
		B(68, 'Black horse, white horse'),
		...[69, 70, 71, 72, 73].map((i) => B(i, 'dialogue')),
		B(74, 'does not say anything polite'),
		...[75, 76, 77, 78, 79, 80, 81, 82].map((i) => B(i, 'dialogue')),
		B(83, 'Neither of them laughs'),
		B(84, 'Your taverns.'),
		B(85, 'What about them.'),
		B(86, 'They will have a long winter.'),
		P(
			'They turn the horses at the same moment, black and white, as if somebody had rehearsed it, and ride back to their counts.',
			'둘은 같은 순간에 말머리를 돌린다. 검은 말과 흰 말, 누가 미리 맞춰 둔 것처럼. 그리고 각자의 셈으로 돌아간다.'
		),
		HEUMSUN(['Brother. The Tang are at the river mouth.', 'Tomorrow is the tenth.'], ['형님. 당군이 강어귀에 와 있습니다.', '내일이 열흘입니다.']),
		D('yushin', ['I know what day it is.'], ['무슨 날인지는 아네.']),
		P('Heumsun looks at the slope. Then, for longer, at his son.', '흠순은 비탈을 본다. 그리고 그보다 오래, 제 아들을 본다.'),
		B(89, 'scene'),
		B(90, 'Heumsun calls his son'),
		HEUMSUN(B(91, 'For a subject').en, B(91, 'For a subject').lines),
		B(92, 'card'),
		B(93, 'I have heard you, Father.'),
		B(94, 'Bangul rides out alone'),
		B(95, 'Pumil does not call his son'),
		B(96, 'card'),
		B(97, 'card'),
		B(98, 'My son is only sixteen'),
		B(99, 'Yes.'),
		B(100, 'He takes an armoured horse'),
		B(101, 'Gyebek has the helmet taken off'),
		B(102, 'Silla cannot be withstood'),
		B(103, 'They put him back on his horse'),
		B(104, 'I went into their midst'),
		B(105, 'Behind the Silla line there is a well'),
		P(
			'The second time, Gyebek has his helmet unstrapped again, and looks at the face inside it for a while. He has looked at faces like this once already this week, in his own house, before the light was up. Then he does what he has to. He ties the head to the saddle and sends the horse back.',
			'두 번째로 계백은 다시 그 투구를 벗기게 하고, 안에 든 얼굴을 한참 바라본다. 이런 얼굴들은 이번 주에 이미 한 번 보았다. 제 집에서, 날이 밝기 전에. 그리고 해야 할 일을 한다. 그 머리를 안장에 매어 말을 돌려보낸다.'
		),
		P(
			'Pumil holds the head up in front of the army and wipes the blood from its face with his own sleeve, so that the three armies can see whose son it is.',
			'품일은 그 머리를 군사들 앞에 들어 올리고, 제 소매로 얼굴의 피를 닦는다. 삼군이 그것이 누구의 아들인지 볼 수 있도록.'
		),
		D(
			'pumil',
			['Look at him. His face is as if he were alive.', 'He died in the king’s service. …I have nothing to regret.'],
			['보아라. 얼굴이 살아 있는 것 같지 않으냐.', '왕의 일에 죽었다. …나는 한이 없다.']
		),
		B(109, 'scene'),
		B(110, 'Nobody gives an order'),
		B(111, 'The Silla line, which has failed four times'),
		B(112, 'nobody says five'),
		P(
			'By the fifth charge the left camp is a rumour of men. Spears shorten. Names stop answering. Seokdal stops somewhere between one tally and the next. Gyebek calls the name twice, then says the next number himself.',
			'다섯 번째 돌격쯤이면 왼쪽 진영은 사람의 소문에 가깝다. 창이 짧아진다. 이름이 대답을 멈춘다. 석달은 셈과 셈 사이 어디쯤에서 멈춘다. 계백은 그 이름을 두 번 부르고, 다음 숫자는 제 입으로 센다.'
		),
		P(
			'Kangrim, who has been hanging in the day like unfinished weather, comes down to speaking distance.',
			'미완의 날씨처럼 대낮에 걸려 있던 강림이, 말 닿는 거리까지 내려온다.'
		),
		B(114, 'He reads the general'),
		B(115, 'When you killed your family'),
		D(
			'gyebek',
			['…Loyalty.', 'If it was terror, do not tell them. Let them keep the prettier word.', 'A magistrate sent you down to arrest King Yumla. Yumla kept you.'],
			['…충성이오.', '두려움이었다면 그들에게 말하지 마시오. 더 예쁜 말을 갖게 두시오.', '고을 원님이 염라대왕을 잡아 오라고 당신을 내려보냈지. 염라가 당신을 붙잡아 두었고.']
		),
		D(
			'kangrim',
			['…The island told you.', 'Living men are not supposed to finish that sentence.'],
			['…섬이 말해 주었군.', '산 사람은 그 문장을 끝까지 말하면 안 되는데.']
		),
		D(
			'kangrim',
			['Upstairs, I asked a gardener whether the dead can be put back.', 'He said it can be done.'],
			['위에서, 정원지기에게 물었소. 죽은 사람을 되돌릴 수 있느냐고.', '된다고 하더군.']
		),
		D('gyebek', ['Don’t.'], ['마시오.']),
		D('kangrim', ['…No. I didn’t think you would want it.', 'I asked anyway.'], ['…그렇지. 원하지 않을 줄 알았소.', '그래도 물어는 봤소.']),
		P(
			'Gyebek turns his head toward the river road, toward Sabi, where nobody is coming.',
			'계백은 고개를 강 쪽 길로 돌린다. 사비 쪽으로. 아무도 오지 않는 쪽으로.'
		),
		FB('632', 'The bank · 강둑', [
			P(
				'A mudbank on the White River at night. A boy who has gone into the water nineteen times, and a prince in a grey hood with a jar he has not opened.',
				'밤의 백강 진흙둑. 열아홉 번 물에 들어간 아이와, 뜯지 않은 술 단지를 든 회색 두건의 왕자.'
			),
			D('euija', ['Why do you do all of this?'], ['왜 이런 짓을 하는 게냐?']),
			D('gyebek', ['I gave my word.'], ['약조를 했습니다.']),
			D('euija', ['Gyebek, would you like to serve a higher purpose?'], ['계백, 더 큰 뜻을 섬겨 보겠느냐?']),
			D('gyebek', ['…Do you like the name, or do you like me?'], ['…그 이름이 마음에 드십니까, 제가 마음에 드십니까?']),
			D('euija', ['…People don’t usually ask that.'], ['…보통은 그런 걸 안 묻는데.']),
			D('gyebek', ['Yes.'], ['예.'])
		]),
		P('The field returns.', '벌판이 돌아온다.'),
		D('gyebek', ['Your Majesty… I gave my word.'], ['폐하… 약조를 드렸습니다.']),
		P(
			'He says it in exactly the same words, the way you set a stone back where it was. Kangrim closes the distance.',
			'똑같은 말이다. 돌을 제자리에 도로 놓듯이. 강림이 남은 거리를 좁힌다.'
		),
		B(124, 'Walk, then.'),
		B(125, 'The man who counted everything'),
		B(126, 'The Silla clerks count too'),
		B(127, 'Nobody can lead the black horse'),
		P(
			'<b>The pass is open. The river is open. And in Sabi, a runner is climbing the palace steps with one word…!</b>',
			'<b>고개가 열렸다. 강이 열렸다. 그리고 사비에서는, 전령 하나가 한 마디를 들고 궁궐 계단을 오른다…!</b>'
		)
	],
	{
		anchors: {
			'gyebek-seq-palisade': 'Then he waits, for the Sword of Silla',
			'hwangsan-seq-clash': 'They hear the white horse scream.',
			'scene-the-five-thousand-41': 'Gyebek comes the way the border remembers him.',
			'duel-ink-approach': 'Gyebek comes the way the border remembers him.',
			'duel-ink-slash': 'Nobody hears steel.',
			'general-statue': 'Yumla kept you.',
			'gyebek-planted-wedge': 'He plants his sword in the yellow dust',
			'parody-300-gyebek': 'If even death showed up early',
			'scene-the-five-thousand-42': 'Seventh-month heat sits on the Yellow Mountain',
			'duel-oil-duty': 'Your Majesty… I gave my word.',
			'cavalry-silhouette-golden-dust': 'Silla comes on the first time',
			'memorial-sword-blue-ribbon': 'The Silla clerks count too.',
			'yushin-after-yellow': 'The Silla clerks count too.',
			'flooded-battlefield-reflection': 'The White River, downstream, opens.'
		}
	}
);

/* ───────────────────────── #73 Sabi ───────────────────────── */

const RUNNER = (en, ko) => S('Runner', '#8d8d95', en, ko);

rebuild(
	73,
	P('The runner has one word. Euija makes him say it twice.', '전령이 가져온 말은 한 마디다. 의자는 그 말을 두 번 하게 한다.'),
	(B) => [
		P(
			'He has run all night, and he falls on the palace steps instead of kneeling. The court hears about the Yellow Mountain Fields before the king does. Courts always do.',
			'밤새 달려온 전령은 무릎을 꿇는 대신 궁궐 계단에 쓰러진다. 조정은 임금보다 먼저 황산벌 소식을 듣는다. 조정은 늘 그렇다.'
		),
		RUNNER(['Hwangsan, Majesty.'], ['황산이옵니다, 폐하.']),
		D('euija', ['Again.'], ['다시.']),
		RUNNER(['Hwangsan. The Yellow Mountain Fields.'], ['황산벌이옵니다.']),
		D(
			'euija',
			['And? How many came back? Don’t give me a face, boy. Give me a number.'],
			['그래서? 몇이나 돌아왔느냐. 얼굴 말고, 숫자를 대라.']
		),
		RUNNER(['…There’s nobody left to count them, Majesty.', 'The man who counts—'], ['…셀 사람이 남지 않았사옵니다, 폐하.', '셈하시던 분이—']),
		D('euija', ['Yes. I know who counts.'], ['그래. 누가 세는지는 안다.']),
		P(
			'Euija sits down on the top step, in front of everyone, which kings do not do. The court waits for an order. For the first time in twenty years he does not have one ready. So he reaches for the next thing he owns, which is an idea.',
			'의자는 모두가 보는 앞에서 맨 윗계단에 주저앉는다. 임금이 해서는 안 되는 일이다. 조정은 명을 기다린다. 스무 해 만에 처음으로 그에게는 준비된 명이 없다. 그래서 그다음으로 가진 것에 손을 뻗는다. 꾀다.'
		),
		D(
			'euija',
			['…They’ve been at sea. Men off boats are always hungry.', 'Nobody burns a city on a full stomach. Feed them. Then we’ll talk about what they want.'],
			['…바다에서 오래 있었지. 배에서 내린 놈들은 늘 배가 고파.', '배부른 놈은 성을 안 태운다. 먹여라. 원하는 건 그다음에 얘기하자.']
		),
		P(
			'So his first move is to send the Tang camp a feast: oxen, wine, three cartloads of rice cakes. The court is told this is diplomacy.',
			'그래서 그의 첫 수는 당의 진영에 잔칫상을 보내는 것이다. 소, 술, 떡 세 수레. 조정에는 이것이 외교라고 알린다.'
		),
		B(1, 'map'),
		B(4, 'The oxen come back'),
		B(5, 'scene'),
		P(
			'The Silla army reaches the Tang camp two days late. The Red Fowl has the Silla supply officer, Kim Munyeong, dragged to his tent gate. They open his collar for the sword.',
			'신라군이 약속보다 이틀 늦게 당의 진영에 닿는다. 주작은 신라의 군량 장교 김문영을 군막 문 앞으로 끌어낸다. 칼 받을 목깃을 풀게 한다.'
		),
		B(7, 'I said it twice'),
		B(8, 'battle-axe'),
		B(9, 'did not see the Yellow Mountain'),
		B(10, 'quote'),
		B(11, 'steps on his commander'),
		B(12, 'about to turn on us'),
		B(13, 'collar is closed again'),
		B(14, 'scene'),
		B(15, 'leaves Sabi at night for'),
		B(16, 'map'),
		P(
			'On the river he sits in the bow and says nothing for a long time. The boatmen will remember it, because nobody had ever seen him do that before.',
			'강 위에서 그는 뱃머리에 앉아 오래도록 아무 말이 없다. 사공들은 그걸 기억할 것이다. 그가 그러는 걸 본 사람이 아무도 없었으니까.'
		),
		D(
			'euija',
			['Seongchung said hold the pass. Hold the river mouth. Wrote it out for me from his cell, in a hand that was going.', 'I put him in that cell. …Ha.', 'He’d love this. He’d be unbearable.'],
			['성충이 그랬지. 고개를 막아라. 강어귀를 막아라. 옥에서, 다 떨리는 손으로 적어 보냈다.', '그 옥에 넣은 게 나다. …하.', '이걸 봤으면 좋아했을 게다. 꼴 보기 싫게 굴었겠지.']
		),
		B(21, 'scene'),
		P(
			'Back in Sabi, the king’s second son, Tae, puts on a crown the next morning and means to fight. His nephews don’t. They go down the wall on a rope with their households, and half the city follows them down it.',
			'사비에서는 이튿날 아침 임금의 둘째 아들 태가 스스로 관을 쓰고 싸우겠다고 한다. 조카들은 생각이 다르다. 그들은 식솔을 데리고 밧줄을 타고 성벽을 내려가고, 성의 절반이 그 밧줄을 따라 내려간다.'
		),
		B(23, 'The crown prince comes out of the gate'),
		D(
			'munmu',
			['Look at me.', 'My sister. Gotaso. Your father’s general killed her at Daeya and buried her under a prison floor.', 'Eighteen years I’ve carried that. Look at me when I say her name.'],
			['나를 봐라.', '내 누이. 고타소. 네 아비의 장수가 대야성에서 죽이고 옥 바닥에 묻었다.', '열여덟 해를 그걸 안고 살았다. 그 이름을 말할 때는 나를 봐라.']
		),
		B(25, 'Yung lies flat'),
		P(
			'It was Chunbok who opened the gate. He would like that understood as a favour.',
			'성문을 연 것은 춘복이다. 그는 그것이 호의로 받아들여지기를 바란다.'
		),
		B(26, 'opened for the sake of the people'),
		B(27, 'scene'),
		B(28, 'the palace women do not wait'),
		P(
			'The stories that gave Euija three thousand women give them this cliff as well, and three thousand is the number they say went over it, their skirts opening on the way down like petals. Nobody who was there wrote down how many it really was. There was no one left on the cliff to count.',
			'의자에게 삼천 궁녀를 붙여 준 이야기들은 이 벼랑도 그들에게 준다. 그 위에서 떨어진 것이 삼천이었다고, 떨어지는 동안 치마가 꽃잎처럼 벌어졌다고 말한다. 그 자리에 있던 누구도 실제로 몇이었는지 적지 않았다. 벼랑 위에는 셀 사람이 남아 있지 않았다.'
		),
		P(
			'Two of them go together, holding hands. They are the two who sat in a prince’s garden with a go board and a jar of wine, a lifetime ago. Nobody counts them. Nobody has counted them for years. It had been two, once, and a joke, and a modest number a man was proud of.',
			'그중 둘은 손을 잡고 함께 간다. 아주 오래전, 바둑판과 술 단지를 놓고 왕자의 후원에 앉아 있던 그 둘이다. 아무도 세지 않는다. 여러 해 동안 아무도 세지 않았다. 한때는 둘이었고, 우스개였고, 한 사내가 자랑스러워하던 소박한 수효였다.'
		),
		B(58, 'He’ll reach for us today'),
		B(59, 'the body remembers'),
		P(
			'The rock is called the Falling Flowers afterwards, <b>Nakhwaam</b>, which is a kind way of saying it, and Baekje’s last invention.',
			'뒷날 그 바위는 <b>낙화암</b>, 꽃이 떨어진 바위라 불린다. 부드럽게 이르는 말이고, 백제가 마지막으로 지어낸 것이다.'
		),
		B(30, 'scene'),
		...range(B, 31, 47),
		B(48, 'On the fifth night'),
		D('euija', ['…Which seat. Ha.', 'The list. You read the list.'], ['…어느 자리냐, 라. 하.', '그 명단. 그걸 읽었구나.']),
		D('yesikjin', ['Three times, Majesty. I am careful with numbers.'], ['세 번 읽었습니다, 폐하. 숫자는 조심해서 봐야 하니까요.']),
		D(
			'euija',
			['Nobody inspects the evidence for a thing they already want to believe.', 'I said that, you know. Nineteen years ago, in a hall full of men like you.', '…Well? Bring the good rope, at least. Not the garrison one.'],
			['사람은 자기가 믿고 싶은 것의 증거는 절대 검사하지 않아.', '내가 한 말이다. 열아홉 해 전에. 너 같은 놈들로 꽉 찬 전각에서.', '…뭘 보느냐? 밧줄은 좋은 걸로 가져와라. 수비대 것 말고.']
		),
		B(49, 'on his way to the Red Fowl'),
		B(56, 'quote'),
		B(61, 'the winners want their wine poured'),
		B(62, 'scene'),
		P(
			'Chunchu finally arrives at the scene. He makes Euija pour his wine, and the Tang general’s beside it.',
			'마침내 춘추가 당도한다. 그는 의자에게 제 잔에, 그리고 그 옆 당 장수의 잔에 술을 따르게 한다.'
		),
		B(64, 'So… you are Euija'),
		B(65, 'A cup is put into Euija’s hands'),
		P(
			'He pours for the Red Fowl first, slowly, with a small host’s bow, and only then turns to the Silla king.',
			'그는 먼저 주작의 잔에 따른다. 천천히, 주인이 손님에게 하듯 살짝 고개를 숙이며. 그러고 나서야 신라 임금 쪽으로 돈다.'
		),
		D(
			'euija',
			['Guests who came furthest are served first. That’s manners.', 'You live next door. You can wait.'],
			['제일 멀리서 온 손님부터 따르는 법이지. 그게 예의다.', '너는 옆집 사람이니, 기다려라.']
		),
		B(66, 'what I said to Gesomun'),
		B(67, 'I was the man he said it about'),
		B(68, 'who is kneeling today'),
		D(
			'chunchu',
			['I am. I knelt to an emperor for this cup, and I would kneel again for the next one.', 'A man who kneels gets up afterwards, Euija. You never stayed to watch that part.'],
			['나다. 이 잔 하나 받으려고 황제 앞에 무릎을 꿇었고, 다음 잔을 위해서라면 또 꿇을 게다.', '무릎 꿇은 사람은 다시 일어난다, 의자. 너는 늘 그 대목을 안 보고 자리를 떴지.']
		),
		B(69, 'One day you will kneel'),
		B(70, 'Take this man away'),
		P(
			'There is one more prisoner. He has been kept for the end of the feast, the way a host keeps back the dish he cares about.',
			'포로가 하나 더 있다. 잔치 끝까지 남겨 둔 자다. 주인이 정말 아끼는 음식을 마지막까지 남겨 두듯이.'
		),
		P(
			'Gumil is older. The yellow sleeve is gone. Eighteen years in Baekje have not taught him to stand up straight, and they have not taught him to stop talking.',
			'검일은 늙었다. 누런 소매도 없다. 백제에서 보낸 열여덟 해는 그에게 허리 펴는 법도, 입 다무는 법도 가르쳐 주지 않았다.'
		),
		D(
			'gumil',
			['Ah~ so the father came after all.', 'I heard you ask him what it cost. Go on, then. Tell me.', 'From the start. All of it. Don’t leave any out.'],
			['아~ 아버지가 결국 왔네.', '저 양반한테 뭐가 들었냐고 묻는 거 다 들었어. 해 봐. 나한테도.', '처음부터. 다. 빼지 말고.']
		),
		D('chunchu', ['No.'], ['아니.']),
		D(
			'gumil',
			['No? Aigo~ the great talker of Silla, and he says no.', 'Everyone in that fortress was trash, you know. Your son-in-law took my wife, and the rest of them watched—'],
			['아니래? 아이고~ 신라 제일가는 말쟁이가, 아니래.', '그 성 놈들 다 쓰레기였어. 당신 사위가 내 마누라를 데려갔고, 나머지는 구경만—']
		),
		D('chunchu', ['My daughter was in that fortress.'], ['그 성에 내 딸이 있었다.']),
		P(
			'Gumil opens his mouth, and for once in eighteen years nothing comes out of it.',
			'검일은 입을 연다. 그리고 열여덟 해 만에 처음으로, 아무 말도 나오지 않는다.'
		),
		D(
			'chunchu',
			['You’ll get no story from me. Nobody is going to tell yours.', 'Take him down to the river.'],
			['너는 나한테서 이야기 한 줄 못 얻는다. 네 이야기는 아무도 하지 않을 게다.', '강가로 데려가라.']
		),
		P(
			'They put him to death on the riverbank before the wine is finished. Chunchu does not go down to watch. He drinks the cup Euija poured him instead, slowly, the way you finish a thing that took twenty years to pour.',
			'술이 다 비기 전에 그들은 강가에서 그를 죽인다. 춘추는 내려가 보지 않는다. 대신 의자가 따라 준 잔을 마신다. 천천히. 따르는 데 스무 해가 걸린 것을 비우듯이.'
		),
		B(71, 'scene'),
		...range(B, 72, 82),
		B(83, 'a confession is waiting for Euija')
	],
	{
		anchors: {
			'sabi-palace-empty': 'The court hears about the Yellow Mountain Fields',
			'sabi-abandoned-crown': 'Euija sits down on the top step',
			'collapsed-mourning': 'Nobody counts them. Nobody',
			'euija-laugh': 'The rock is called the Falling Flowers afterwards'
		}
	}
);

/* ───────────────────────── #74 Buyeo Euija† ───────────────────────── */

rebuild(
	74,
	P(
		'An empire is not finished with a king until he has signed something.',
		'제국은 왕에게서 서명 하나를 받아 내기 전까지는, 그 왕과 끝난 게 아니다.'
	),
	(B) => [
		P(
			'In Chang’an, on the first morning of winter, Euija is brought forth before the Third Emperor.',
			'장안, 겨울의 첫 아침. 의자가 세 번째 황제 앞에 끌려 나온다.'
		),
		B(3, 'First, paperwork.'),
		B(4, 'Aloud, please'),
		B(5, 'the criminal Euija'),
		B(6, 'It’s a bad story'),
		B(7, 'Your name, please'),
		B(8, 'He signs in a hand so large'),
		B(1, 'quote'),
		B(12, 'KIM CHUNCHU'),
		B(13, 'eating his supper'),
		B(14, 'Hm?'),
		B(15, 'you wretch'),
		B(16, 'The shouting burns out'),
		B(17, 'avenge me'),
		P(
			'He is shouting at the man who won. Across the sea, a quiet son with lovely handwriting is still waiting to be needed.',
			'그는 이긴 사내를 향해 소리치고 있다. 바다 건너에서는, 글씨가 고운 조용한 아들 하나가 아직도 누군가 자기를 필요로 해 주기를 기다리고 있다.'
		),
		B(19, 'the room fills with men only he can see'),
		D(
			'euija',
			['Gods are props. Spirits are lighting.', 'Heh… so you guys are real after all…'],
			['신들은 소품이고. 귀신은 조명이지.', '흥… 너희 진짜였구나…']
		),
		B(21, 'Any last words?'),
		B(22, 'Euija waits'),
		B(23, 'No.'),
		B(24, 'Kangrim reads his name three times'),
		D(
			'kangrim',
			['Eraha. King.', 'One question, then we walk.', 'They called you the Zengzi of the East. You hung a dragon over the Sabi for a crowd. Which were you?'],
			['어라하. 임금이여.', '질문 하나 하고, 갑시다.', '사람들은 당신을 해동증자라 불렀소. 당신은 구경꾼들 보라고 사비강 위에 용을 띄웠고. 어느 쪽이었소?']
		),
		D(
			'euija',
			['…The dragon. Obviously.', 'Several hundred people saw the dragon. Nobody ever saw a Zengzi do anything.'],
			['…용이지. 당연히.', '용은 수백 명이 봤다. 증자가 뭘 하는 건 아무도 못 봤고.']
		),
		D(
			'kangrim',
			['The boy at the White River.', 'The name you gave him is still in the ledger.'],
			['백강의 아이.', '당신이 준 이름이 아직 명부에 있소.']
		),
		B(26, 'A friend.'),
		FB('632', 'The river · 백강', [
			P(
				'A jar in a hedge, and a prince who ought to be at his own investiture.',
				'울타리 밑의 술 단지 하나. 제 책봉식에 가 있어야 할 왕자 하나.'
			),
			P(
				'A grey hood at the back of a crowd. A boy going into black water on a rope.',
				'구경꾼들 맨 뒤의 회색 두건. 밧줄 하나에 매달려 검은 물로 들어가는 아이.'
			),
			D('euija', ['How many times have you gone in?'], ['몇 번째냐.']),
			D('gyebek', ['Nineteen.'], ['열아홉 번입니다.']),
			P(
				'A pale deer in the reeds, standing where nobody else is up to see it.',
				'갈대숲의 흰 사슴 한 마리. 아무도 깨어 있지 않은 자리에 서 있다.'
			),
			D('gyebek', ['…Do you like the name, or do you like me?'], ['…그 이름이 마음에 드십니까, 제가 마음에 드십니까?'])
		]),
		D(
			'euija',
			['…You.', 'It was you, you idiot. The name was just the best thing I had on me.'],
			['…너.', '너였다, 이 바보야. 이름은 그냥 그때 내가 가진 것 중에 제일 좋은 거였고.']
		),
		D(
			'kangrim',
			['He is waiting at the ford. Tell him yourself. He will want it said exactly.', 'Then you die richer than the record will admit.', 'Come.'],
			['그는 나루에서 기다리고 있소. 직접 말해 주시오. 그 사람은 정확히 말해 줘야 알아들으니.', '그렇다면 당신은 기록이 인정하는 것보다 부자로 죽는 거요.', '갑시다.']
		),
		P(
			'Euija dies, vengeful and emptied. Then, at the very last, neither.',
			'의자는 원한에 차고, 텅 빈 채로 죽는다. 그리고 맨 마지막 순간에는, 둘 다 아니다.'
		),
		B(32, 'Thus was the end of Buyeo Euija.'),
		B(33, 'Zengzi of the East'),
		B(34, 'quote'),
		B(35, '— Buyeo Euija —'),
		B(39, 'Seongchung told him'),
		B(40, 'They called him that when he was young'),
		B(42, 'Baekje is gone. Goguryeo still stands.')
	],
	{
		anchors: {
			'euija-death-black': 'before the humiliation finishes',
			'euija-death-close': 'Euija dies, vengeful and emptied.'
		}
	}
);

/* ───────────────────────── #75 Kim Chunchu† ───────────────────────── */

rebuild(
	75,
	P(
		'Chunchu has talked his way out of every room in Samhan. This one has no other door.',
		'춘추는 삼한의 모든 방에서 말로 빠져나왔다. 이 방에는 다른 문이 없다.'
	),
	(B) => [
		B(1, 'map'),
		B(3, 'scene'),
		B(4, 'It is the sixth month of 661'),
		P(
			'<b>Munhee (55)</b> sits where she has sat since the spring. Outside the door a monk who knows when not to speak keeps the incense going. Forty years ago she bought a dream off her sister for a silk skirt. This is where the dream comes out: a sickroom, a husband, and a son at the foot of the bed.',
			'<b>문희(55)</b>는 봄부터 앉아 있던 그 자리에 앉아 있다. 문밖에서는 말을 아낄 줄 아는 스님 하나가 향을 지킨다. 마흔 해 전, 그녀는 비단 치마 한 벌로 언니의 꿈을 샀다. 그 꿈이 닿은 곳이 여기다. 병실 하나, 남편 하나, 그리고 침상 발치에 선 아들 하나.'
		),
		B(6, 'Have I… paid all of it?'),
		B(7, 'I’ll pay the rest.'),
		D('chunchu', ['Do you remember the skirt?'], ['그 치마 기억하오?']),
		D('munhee', ['It was a very good skirt.', 'Don’t make me cry in front of the boy.'], ['아주 좋은 치마였지요.', '애 앞에서 울리지 마세요.']),
		D('chunchu', ['Best bargain in Silla.'], ['신라 제일의 흥정이었소.']),
		D('munhee', ['Second best. Bupmin, don’t stand in the door. Come in.'], ['두 번째지요. 법민아, 문간에 서 있지 말고. 들어와.']),
		B(8, 'He looks past her'),
		B(9, 'Bupmin.'),
		B(10, 'Father.'),
		B(11, 'only for your sister'),
		D(
			'chunchu',
			['But that was never the only debt.', 'On a hill once, with your uncle, I said a thing. “A king for all.”', 'Not a king of Silla. Of everyone.'],
			['하지만 그게 내가 갚던 유일한 빚은 아니었다.', '언젠가 언덕에서, 네 외숙과 함께, 내가 한 말이 있다. “만인의 왕.”', '신라의 왕이 아니라. 모두의.']
		),
		D('munmu', ['And I stole it. I was six. I used to say it at dinner—'], ['그걸 제가 훔쳤지요. 여섯 살 때. 밥상머리에서 그 말만—']),
		D(
			'chunchu',
			[
				'You said it wrong. The word sat crooked in your mouth.',
				'I said it first. You took it. That is how children steal. They take the largest thing in the room.',
				'I cleared the road as far as Baekje. Goguryeo is still standing, and the Tang will be smiling.',
				'The rest — walk it as king. Not as my revenge. As the country you wanted when you were six.'
			],
			[
				'너는 그 말을 틀리게 했지. 입 안에서 말이 삐뚤게 앉아 있었다.',
				'내가 먼저 했다. 네가 가져갔고. 아이들은 그렇게 훔친다. 방 안에서 제일 큰 것을 가져가지.',
				'나는 백제까지 길을 텄다. 고구려는 아직 서 있고, 당은 웃고 있을 게다.',
				'나머지는 — 왕으로서 걸어라. 내 복수로서가 아니라. 네가 여섯 살 때 바라던 나라로서.'
			]
		),
		B(15, 'I promise'),
		B(16, 'I love you'),
		B(17, 'The escort arrives on schedule.'),
		P(
			'Kangrim reads the name three times — Muyeol. Muyeol. Muyeol. The room still knows him as Chunchu.',
			'강림이 그 이름을 세 번 부른다 — 무열. 무열. 무열. 방 안은 아직 그를 춘추로 안다.'
		),
		D(
			'kangrim',
			['King Muyeol.', 'We have met before, at Daeya. You weren’t looking at me. You were looking at a list of names.'],
			['무열왕.', '전에 만난 적이 있소. 대야성에서. 당신은 나를 보지 않았지. 이름 적힌 명단을 보고 있었으니.']
		),
		D('chunchu', ['Euija swore heaven would find me.', '…Is this heaven?'], ['의자가 하늘이 나를 찾아낼 거라 저주했지.', '…이게 그 하늘이오?']),
		D(
			'kangrim',
			['No. This is a fever. Heaven does not make house calls. I do.', 'One question, then we walk. Was it for Gotaso, or for the king for all?'],
			['아니오. 이건 열병이오. 하늘은 왕진을 오지 않소. 오는 건 나요.', '질문 하나 하고 갑시다. 고타소를 위해서였소, 아니면 만인의 왕을 위해서였소?']
		),
		D('chunchu', ['…Yes.'], ['…그렇소.']),
		D('kangrim', ['That is not one of the two.'], ['그건 둘 중 하나가 아니오.']),
		D(
			'chunchu',
			['In go, nobody plays a stone for one reason.', 'Write it in both columns. Your ledger has two, I assume.'],
			['바둑에서 돌 하나를 한 가지 이유로 놓는 사람은 없소.', '두 칸에 다 적으시오. 장부에 칸이 둘은 있을 테니.']
		),
		D(
			'kangrim',
			['It does. I will.', 'Come. The road is long, and you will want to talk the whole way.'],
			['있소. 그리 하리다.', '갑시다. 길이 머니, 가는 내내 말하고 싶을 거요.']
		),
		B(24, 'dies.'),
		D(
			'munhee',
			['…He knelt to everyone. Gesomun. The emperor. Anyone who would hold a door.', 'Never once to Baekje.', 'Get up, Bupmin. You’re the king. Kings don’t kneel by beds.'],
			['…다들한테 무릎을 꿇은 양반이야. 연개소문한테도, 황제한테도. 문 잡아 줄 사람이면 누구한테든.', '백제한테만은 한 번도 안 꿇었지.', '일어나라, 법민아. 이제 네가 왕이다. 왕은 침상 옆에서 무릎 꿇는 거 아니다.']
		),
		P(
			'He died with Baekje gone and Goguryeo still standing. Halfway. The last two names he said were his daughter’s and his son’s. Not the kingdom’s.',
			'그는 백제가 사라지고 고구려는 아직 서 있는 채로 죽었다. 절반에서. 그가 마지막으로 부른 두 이름은 딸의 이름과 아들의 이름이었다. 나라의 이름이 아니었다.'
		),
		B(25, 'Twelve years earlier an emperor'),
		P(
			'They give him a name for the dead: Muyeol. His temple name is Taejong, the same name the Tang gave their Second Emperor. Chang’an will notice.',
			'그에게 죽은 자의 이름이 붙는다. 무열. 묘호는 태종이다. 당이 두 번째 황제에게 붙인 바로 그 이름이다. 장안이 그냥 넘어가지 않을 것이다.'
		),
		B(34, 'card'),
		P('Bupmin takes the throne. They will call him Munmu.', '법민이 왕위에 오른다. 사람들은 그를 문무라 부를 것이다.'),
		B(37, 'call its king a clerk')
	],
	{
		anchors: {
			'succession-thrones': 'dies.',
			'chunchu-afterlife-walk': 'The road is long, and you will want to talk the whole way.',
			'chunchu-west-road': 'Heaven does not make house calls.'
		}
	}
);

/* ───────────────────────── #76 Ungjin Commandery ───────────────────────── */

const CLERK = (en, ko) => S('Tang clerk', '#b45309', en, ko);

rebuild(
	76,
	P(
		'In Chang’an, the cheapest way to conquer a country is to rename it.',
		'장안에서 나라 하나를 정복하는 가장 싼 방법은, 그 나라의 이름을 바꾸는 것이다.'
	),
	(B) => [
		B(17, 'scene'),
		P(
			'The Red Fowl is home with his captives. The emperor asks him a question in front of the whole court, which is how emperors ask questions they already know the answer to.',
			'주작이 포로들을 데리고 돌아왔다. 황제는 온 조정 앞에서 그에게 묻는다. 황제들은 답을 이미 아는 질문을 그렇게 묻는다.'
		),
		{
			kind: 'dialogue',
			chip: '#b8935a',
			lines: ['경이 군대를 끌고 거기 있었는데, 어째서 내친김에 신라까지 치지 않았소?'],
			en: ['You were there with an army. Why didn’t you take Silla while you were at it?'],
			zh: ['卿既在彼，何不因而伐新羅？'],
			zhLatn: ['Qīng jì zài bǐ, hé bù yīn ér fá Xīnluó?'],
			person: 'gaozong'
		},
		{
			kind: 'dialogue',
			chip: '#d95f4b',
			person: 'sudingfang',
			lines: ['그 임금은 어질어 백성을 아끼고, 신하들은 충성으로 나라를 섬기며, 아랫사람은 윗사람을 아비와 형처럼 섬깁니다.', '작은 나라이나, 꾀로 도모할 수는 없습니다.'],
			en: [
				'Their king is kind and loves his people. His ministers serve the country loyally. Below, they serve those above like fathers and elder brothers.',
				'It is a small country, Majesty. But it cannot be schemed against.'
			],
			zh: ['新羅其君仁而愛民，其臣忠以事國，下之人事其上如父兄。', '雖小，不可謀也。'],
			zhLatn: ['Xīnluó qí jūn rén ér ài mín, qí chén zhōng yǐ shì guó, xià zhī rén shì qí shàng rú fù xiōng.', 'Suī xiǎo, bù kě móu yě.']
		},
		D(
			'gaozong',
			['Can’t be schemed against. Hm.', 'Then we won’t scheme. We’ll write. Make their king a governor of ours — no. That sounds like a slap.', '…Write it anyway.'],
			['꾀로는 안 된다라. 흠.', '그럼 꾀 말고 글로 하지요. 그 나라 임금을 우리 도독으로 삼으면— 아니. 뺨 때리는 소리 같군요.', '…그래도 적으세요.']
		),
		B(20, 'card'),
		D(
			'wuzetian',
			['Make it sound like an honour, Majesty.', 'A slap they have to bow for is worth two they can return.'],
			['영광처럼 들리게 하세요, 폐하.', '절하면서 받아야 하는 뺨 한 대가, 되돌려 칠 수 있는 뺨 두 대보다 값져요.']
		),
		B(10, 'scene'),
		B(11, 'Then an edict arrives for the new king'),
		B(12, 'me its clerk'),
		B(13, 'And keep a copy.'),
		B(14, 'The court is angrier than the king'),
		P(
			'Only Daeto, a smooth councillor who always urges the softer word, keeps his voice down.',
			'부드러운 말을 권하는 게 일인 매끄러운 신하, 대토만이 목소리를 낮춘다.'
		),
		B(15, 'Have you seen their calendar?'),
		B(16, 'Nobody answers him'),
		B(4, 'scene'),
		B(3, 'map'),
		P(
			'Someone has to hold what the Tang broke. Nobody in Chang’an expected to see Liu Rengui in uniform again. He is sixty. Last year he lost a grain fleet in a storm and was stripped of office. Now he comes east as a commoner in white, to earn it back. In his baggage: the Tang calendar, and the list of names nobody may write.',
			'당이 부순 것을 누군가는 붙들고 있어야 한다. 장안의 누구도 유인궤가 다시 군복을 입으리라 생각하지 않았다. 그는 예순이다. 지난해 폭풍에 군량선단을 잃고 관직을 빼앗겼다. 이제 그는 흰옷 입은 평민으로 동쪽에 와서 그것을 되찾으려 한다. 짐 속에는 당의 달력과, 아무도 써서는 안 되는 이름들의 목록이 들어 있다.'
		),
		B(6, 'card'),
		B(7, 'Heaven means to make an old man rich'),
		P(
			'Between skirmishes the Black Tortoise does what he actually came for, which is paperwork. He counts the households of Baekje village by village and writes them down as numbers. He mends dykes and bridges. He posts the Tang calendar at every crossroads, with the list of names that may not be written, so that the people of Baekje will know which characters to leave out of their letters home.',
			'싸움과 싸움 사이에 현무는 정말로 하러 온 일을 한다. 서류다. 백제의 호구를 마을마다 세어 숫자로 적는다. 둑과 다리를 고친다. 갈림길마다 당의 달력을 붙이고, 써서는 안 되는 이름의 목록도 함께 붙인다. 백제 사람들이 집에 보내는 편지에서 어떤 글자를 빼야 하는지 알도록.'
		),
		B(9, 'A village that knows what year it is'),
		SCENE('The Ferry', '나루'),
		P(
			'The ferry calendar lasts four days. On the fifth morning it is still on its post, untouched, which is worse. Someone has added a line to the bottom of the list of names one must not write. The charcoal is still soft.',
			'나루의 달력은 나흘을 버틴다. 닷새째 아침에도 그것은 기둥에 멀쩡히 붙어 있다. 그게 더 나쁘다. 누군가 써서는 안 되는 이름 목록 맨 아래에 한 줄을 보탰다. 숯이 아직 무르다.'
		),
		CLERK(['Shall I scrape it off, General?'], ['긁어낼까요, 장군?']),
		D('liurengui', ['Read it to me first.'], ['먼저 읽어 보시오.']),
		CLERK(['“Buyeo Pung.” And under it: “Gwishil Boksin, who sends his regards.”'], ['“부여풍.” 그리고 그 밑에, “귀실복신이 안부를 전함.”']),
		D('liurengui', ['A prince, and a man who signs his notes.', 'Who is the prince?'], ['왕자 하나, 그리고 쪽지에 제 이름을 적는 사내 하나라.', '왕자는 누구요?']),
		CLERK(
			['Euija’s son, General. The quiet one. They sent him to the Yamato court as a boy.'],
			['의자의 아들입니다, 장군. 조용한 놈이요. 어릴 때 왜 조정에 보냈답니다.']
		),
		D(
			'liurengui',
			['Then they are telling me which name I will soon be forbidden to write.', 'Copy it. Twice. And leave the original up. I want him to know I read it.'],
			['그럼 내가 곧 쓰지 못하게 될 이름을 미리 알려 주는 셈이군.', '베껴 두시오. 두 벌. 원본은 그대로 붙여 두고. 내가 읽었다는 걸 그자가 알도록.']
		),
		SCENE('The Fires', '불'),
		P(
			'That night the hills around Sabi light up. One fire, then forty. Boksin has brought the restoration to the Tang’s front door, and the garrison inside has ten days of rice.',
			'그날 밤 사비를 둘러싼 산들에 불이 켜진다. 하나, 그리고 마흔. 복신이 부흥군을 당의 앞문까지 끌고 왔고, 성 안 수비대에게는 열흘 치 쌀이 남았다.'
		),
		P(
			'The Black Tortoise has no cavalry to speak of and no reputation left to lose. What he has is a census. He counted those villages a month ago. He knows which of them fed the fires, and which are short of men tonight.',
			'현무에게는 내세울 기병도, 더 잃을 명성도 없다. 그에게 있는 것은 호적이다. 한 달 전에 그 마을들을 세었다. 어느 마을이 저 불에 쌀을 댔는지, 오늘 밤 어느 마을에 사내가 모자란지 안다.'
		),
		D(
			'liurengui',
			['Not the hills. The villages behind them.', 'Close the roads they bring the rice on. Politely. Write down every cart.'],
			['산이 아니오. 그 뒤의 마을이오.', '쌀 나르는 길을 막으시오. 정중하게. 수레는 하나하나 다 적고.']
		),
		P(
			'It takes nine days. On the tenth the fires around Sabi go out one by one, the way they were lit, and the rebels walk back up into the hills to a fortress called Imjon. They are not beaten. They are waiting for somebody.',
			'아흐레가 걸린다. 열흘째, 사비를 둘러싼 불들이 켜질 때처럼 하나씩 꺼지고, 부흥군은 임존이라는 성으로 산을 걸어 올라간다. 진 게 아니다. 누군가를 기다리는 것이다.'
		),
		D('liurengui', ['He’ll be back. He has to fetch a king first.'], ['다시 올 거요. 먼저 왕을 모셔 와야 하니.']),
		SCENE('The Maps', '지도'),
		B(18, 'takes out his father’s maps'),
		B(19, 'Father went east three times'),
		B(21, 'Say it like you'),
		B(22, 'That is how the Four Beasts are chosen'),
		B(23, 'scene'),
		B(24, 'launches the Eighth Invasion'),
		B(25, 'diagram'),
		B(28, 'Samhan never learns their names'),
		P('The Silla envoy is still in the hall. The emperor turns to him last.', '신라 사신이 아직 전각에 있다. 황제는 마지막으로 그를 돌아본다.'),
		D(
			'gaozong',
			['Baekje is done. I have taken your king’s worry off his hands.', 'Now Goguryeo. Go home and tell him to bring his army north.', 'He has our calendar now. Tell him the date.'],
			['백제는 끝났소. 그대 왕의 근심은 내가 덜어 주었소.', '이제 고구려요. 돌아가서 왕에게 군사를 이끌고 북으로 오라 전하시오.', '이제 우리 달력이 있으니, 날짜도 전하시오.']
		),
		B(30, 'an exiled prince is packing his bags')
	],
	{
		anchors: {
			'four-riders-2': 'Baekje is done. I have taken your king’s worry off his hands.',
			'yellow-general-2': 'Now Goguryeo. Go home and tell him to bring his army north.'
		}
	}
);

/* ───────────────────────── #77 King Pungjang ───────────────────────── */

rebuild(
	77,
	P('Baekje is finished, says everyone except Baekje.', '백제는 끝났다고 다들 말한다. 백제만 빼고.'),
	(B) => {
		const fbAsuka = B(6, 'flashback').blocks;
		const fbSword = B(0, 'flashback');
		const A = (i, frag) => {
			const b = fbAsuka[i];
			if (frag && !strip(textOf(b)).includes(frag) && b.kind !== frag) throw new Error(`#77 [6.${i}] expected ${frag}`);
			return b;
		};
		const Sw = (i) => fbSword.blocks[i];
		return [
			B(4, 'map'),
			SCENE('The Crossing', '바닷길'),
			P(
				'Its last prince is on a Yamato boat off Juryu, with a new cap of rank in a box on his knees. He has been rehearsing one sentence since the islands. It keeps coming out in the wrong language.',
				'백제의 마지막 왕자는 주류 앞바다의 왜 배 위에 있다. 무릎 위 상자에는 새로 지은 관이 들어 있다. 섬들을 지나올 때부터 문장 하나를 연습하고 있다. 자꾸 엉뚱한 나라 말로 나온다.'
			),
			D(
				'pung',
				['Takutsu. The Baekje word for coming home to a place. The proper one.', '…I used to know it.'],
				['다쿠쓰. 어떤 곳에 돌아올 때 쓰는 백제 말. 제대로 된 말 말이오.', '…알았었는데.']
			),
			D('takutsu', ['I don’t know it either, Majesty. I am told they will just be glad you came.'], ['저도 모르오, 전하. 그냥 오신 것만 반가워할 거라 들었소.']),
			P(
				'He has been losing words for twenty years. He only noticed last winter, in front of the whole Yamato court.',
				'그는 스무 해 동안 말을 잃어 왔다. 그걸 알아챈 건 지난겨울, 왜 조정 전체가 보는 앞에서였다.'
			),
			FB('660', 'Asuka, that winter · 아스카, 그해 겨울', [
				P(
					'Asuka, the winter Sabi falls. A Baekje envoy has come the whole way with frost in his beard and a hundred Tang soldiers roped neck to neck behind him, a present, which is a polite word for proof. The empress is sixty-six. She has buried two husbands, held this throne twice and sat through a great many envoys, and she lets this one finish.',
					'아스카, 사비가 무너진 그해 겨울. 백제 사신은 수염에 서리를 얹은 채 먼 길을 왔고, 그 뒤로 당나라 병사 백 명이 목과 목을 밧줄로 엮인 채 서 있다. 선물이다. 증거를 점잖게 부르는 말이다. 여제는 예순여섯이다. 남편 둘을 묻었고, 이 자리에 두 번 올랐고, 사신이라면 질리도록 받아 보았다. 그녀는 이 사신이 말을 끝낼 때까지 둔다.'
				),
				A(1, 'place'),
				P(
					'The envoy comes from <b>Gwishil Boksin</b>, who has been raising a dead country in the hills since summer. Boksin wants two things: an army, and the king’s quiet son, who was sent across the sea as a boy and never sent for.',
					'사신을 보낸 이는 <b>귀실복신</b>이다. 여름부터 산속에서 죽은 나라를 일으켜 온 사내다. 복신이 청하는 것은 둘이다. 원병, 그리고 어려서 바다를 건너왔다가 한 번도 부름을 받지 못한 임금의 조용한 아들.'
				),
				B(3, 'card'),
				A(2, 'card'),
				A(3, 'When do they show us the rest'),
				A(4, 'sitting very straight'),
				A(5, 'card'),
				A(6, 'Send me!'),
				A(7, 'Do they want you, or your name?'),
				A(8, 'forgotten some of the words'),
				A(9, 'The empress has let all of it run'),
				A(10, 'card'),
				D(
					'saimei',
					['My son wants to know what we owe Baekje.', 'Bring him the sword. The one with seven branches.'],
					['내 아들이 우리가 백제에 무엇을 빚졌는지 알고 싶어 하는구나.', '그 칼을 가져오너라. 가지가 일곱인 것.']
				),
				P(
					'Three hundred years ago a Baekje king sent the King of Wa a sword with seven branches. It was a gift. It was also a message.',
					'삼백 년 전, 백제의 한 임금이 왜왕에게 가지가 일곱 달린 칼을 보냈다. 선물이었다. 전갈이기도 했다.'
				),
				Sw(3),
				Sw(4),
				Sw(5),
				Sw(6),
				P(
					'What is not in dispute: Baekje sent scholars, craftsmen, weavers, horse-handlers, potters and the written word across that water for three hundred years. Nobody on either shore ever sent a bill.',
					'다투지 않는 사실은 이렇다. 백제는 삼백 년 동안 그 바다 건너로 학자와 장인과 직공과 말 다루는 이와 옹기장이와 글자를 보냈다. 어느 쪽 바닷가에서도 값을 청구한 적은 없다.'
				),
				A(11, 'The sea is also a border'),
				A(13, 'Abe is out of the hall')
			]),
			P(
				'The empress died this summer, on her way west to see the fleet off. Her son keeps her promise anyway. Baekje’s refugees are coming home from everywhere they ran.',
				'여제는 올여름, 함대를 배웅하러 서쪽으로 가던 길에 죽었다. 아들은 그래도 어머니의 약속을 지킨다. 백제의 피란민들이 흩어졌던 곳곳에서 돌아오고 있다.'
			),
			B(9, 'scene'),
			B(10, 'Juryu, the ninth month of 661'),
			B(11, 'place'),
			...range(B, 12, 17),
			D('boksin', ['…He means it.'], ['…진심이군.']),
			...range(B, 20, 22),
			...range(B, 24, 29),
			B(18, 'card'),
			B(30, 'does not look up from the ledger'),
			B(31, 'Nobody has paid me yet'),
			B(32, 'does the arms exactly as rehearsed'),
			D(
				'boksin',
				['Gwishil Boksin. I raised this country once when it fell, and if it falls twice I’ll raise it twice.', 'Your father asked for this, Majesty. In Chang’an, at the end. We heard.', 'Welcome home. Your army.'],
				['귀실복신. 나라가 쓰러졌을 때 한 번 일으켰고, 두 번 쓰러지면 두 번 일으킬 사람이오.', '선왕께서 바라신 일입니다, 전하. 장안에서, 마지막에. 저희도 들었습니다.', '돌아오신 걸 환영합니다. 전하의 군대입니다.']
			),
			B(34, 'and he ad-libs'),
			B(35, 'son of King Euija'),
			B(36, 'card'),
			B(37, 'Close enough, Majesty.'),
			B(38, 'Boksin counts them in'),
			B(39, 'They try it twice more'),
			B(5, 'diagram'),
			B(40, 'On the far ridge two Tang scouts'),
			P('That evening, on the wall, the new king finds his general alone.', '그날 저녁, 성벽 위에서 새 왕은 홀로 있는 장군을 찾아낸다.'),
			D(
				'pung',
				['My father sent me away with a sentence. “Until I need you.”', '…He did not say it would be somebody else who needed me.'],
				['아버님이 나를 보내며 한마디 하셨소. “내가 너를 필요로 할 때까지.”', '…다른 사람이 나를 필요로 하게 될 거라고는 말씀하지 않으셨소.']
			),
			D('boksin', ['Somebody always does, Majesty.', 'Sleep. We crown you tomorrow.'], ['누군가는 늘 필요로 합니다, 전하.', '주무십시오. 내일 즉위하십니다.']),
			P(
				'Pung was the only prince left, so they crowned him the next day, in the fortress hall, in a cap the Yamato tailor made. Boksin did the crowning. The Yamato men call him Pungjang. Baekje learns to.',
				'남은 왕자가 풍뿐이라, 이튿날 성의 전각에서, 왜의 재봉사가 지은 관을 씌워 그를 왕으로 세웠다. 관을 씌운 사람은 복신이다. 왜 사람들은 그를 풍장이라 부른다. 백제도 따라 배운다.'
			),
			B(41, 'The crown is Pung’s'),
			B(47, 'scene'),
			B(48, 'Boksin sends a messenger'),
			B(49, 'When are you gentlemen going home'),
			B(50, 'Tell him we are guests'),
			B(51, 'scene'),
			P('Then Prince Pung wants to move house.', '그러다 풍왕이 집을 옮기고 싶어 한다.'),
			D(
				'pung',
				['This Juryu lies far from farmland. The soil is stone. The people will starve up here.'],
				['이 주류는 농토에서 멀고, 땅은 돌뿐이오. 여기 있다간 백성이 굶소.']
			),
			D('takutsu', ['They will starve slower than they will die down there, Majesty.'], ['아래로 내려가면 굶기 전에 먼저 죽을 거요, 전하.']),
			D('pung', ['Pisong has water. Rice. Embankments all round it—'], ['피성에는 물이 있소. 쌀도 있고. 둘레에 둑도—']),
			D('takutsu', ['Pisong is one night’s march from the enemy.'], ['피성은 적에게서 하룻밤 거리요.']),
			D('pung', ['I am the king. We move.'], ['나는 왕이오. 옮기오.']),
			D('boksin', ['Then we move, Majesty.'], ['그럼 옮기지요, 전하.']),
			P(
				'They move. Two months later Silla takes the towns to the south in an afternoon, and the whole restoration climbs back up to the barren hill it left.',
				'그들은 옮긴다. 두 달 뒤 신라가 남쪽 고을들을 한나절 만에 가져가고, 부흥군 전체가 떠났던 그 메마른 산으로 도로 기어오른다.'
			),
			B(56, 'The men move once, move back'),
			P(
				'Boksin says nothing on the road back up. He doesn’t need to. Everyone saw who was right, and everyone saw who wore the crown.',
				'다시 오르는 길에 복신은 아무 말도 하지 않는다. 할 필요가 없다. 누가 옳았는지 모두 보았고, 누가 관을 썼는지도 모두 보았다.'
			),
			P(
				'<b>Baekje has its king back, and a general who already regrets it. Now the emperor turns north, to walls that have never fallen…!</b>',
				'<b>백제는 왕을 되찾았고, 벌써 그걸 후회하는 장군도 얻었다. 이제 황제는 북쪽으로, 한 번도 무너진 적 없는 성벽으로 고개를 돌린다…!</b>'
			)
		];
	},
	{
		anchors: {
			'saimei-empress': 'Abe is out of the hall before the edict is copied'
		}
	}
);

/* #75: a goodbye between Chunchu and Yushin before the family scene, and the vigil anchor. */
editStory((story) => {
	const e = story.flatMap((c) => c.entries)[75 - 1];
	if (e.blocks.some((b) => strip(b.html).includes('too close to the door'))) return false;
	const at = e.blocks.findIndex((b) => b.kind === 'p' && strip(b.html).startsWith('It is the sixth month of 661'));
	if (at < 0) throw new Error('#75 sickroom paragraph not found');
	e.blocks.splice(
		at + 1,
		0,
		P(
			'Yushin comes in the afternoon, still in his riding boots, and stands where a marshal stands, which is too close to the door.',
			'유신은 오후에 온다. 아직 승마 장화를 신은 채, 장수가 서는 자리에 선다. 문에 너무 가까운 자리다.'
		),
		D('yushin', ['The Tang want us at Pyongyang by winter.', 'I told them you were busy.'], ['당이 겨울까지 평양으로 오라 하네.', '자네가 바쁘다고 해 두었네.']),
		D(
			'chunchu',
			['Busy. Yes. Dying turns out to be a full day’s work.', 'Brother, sit down for once. You make the room look like a gate.'],
			['바쁘지요. 죽는 것도 하루 품이 꽉 차는 일이더군요.', '형님, 오늘은 좀 앉으시오. 형님이 서 있으면 방이 성문 같소.']
		),
		D('yushin', ['I’ll stand.'], ['서 있겠네.']),
		D(
			'chunchu',
			['Of course you will.', '…Take him north for me. Bupmin. He’ll want to charge the walls. Don’t let him charge the walls.'],
			['그러시겠지.', '…북으로 데려가 주시오. 법민을. 저 애는 성벽에 돌격하고 싶어 할 거요. 돌격하게 두지 마시오.']
		),
		D('yushin', ['I won’t.'], ['안 두겠네.']),
		P(
			'That is the whole goodbye. They have been saying the rest of it for forty years.',
			'작별은 그게 다다. 나머지는 마흔 해 동안 이미 해 왔다.'
		)
	);
	const vigil = e.images.find((im) => im.id === 'munhee-temple-vigil');
	if (vigil) vigil.at = 'a monk who knows when not to speak';
	console.log('#75: Yushin goodbye inserted');
});
