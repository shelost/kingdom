// The three cavern sisters as a through-line: Jade Gate Valley (first on the page) → Forty Fortresses → Bidam stumbles in (Jeon)
// → Seohyun finds them (flashback) → Yushin's family (Gyul) → Chunchu's first visit (Royal Secretariat) → Yushin's last visit
// after Wonsul (Kim Yushin†) → Bupmin (The Wanggum's Guest). Moves the cave stack off Gumil (Daeya). Idempotent on MARKER.
import { editStory } from '../story-ops.mjs';

const MARKER = 'Unni. Unni. Waist.';
const CHIP = { narim: '#5fad6e', golhwa: '#e0783a', hyulle: '#6ec4c9', yushin: '#4a8fe0', chunchu: '#D8258C' };
const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const say = (person) => (en, lines) => ({ kind: 'dialogue', chip: CHIP[person], person, en, lines });
const [N, G, H, Y, C] = ['narim', 'golhwa', 'hyulle', 'yushin', 'chunchu'].map(say);
const hill = (en, lines) => ({ kind: 'dialogue', chip: '#0e7490', speaker: 'The Hill', en, lines });

const textOf = (b) => [b.html, b.ko, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ');

const jadeGate = [
	scene('Under the Hill', '언덕 아래'),
	p(
		'Yushin reaches the palace before the drum has finished, and finds the queen already in council with it. The door stays shut. A Marshal can’t stand in a corridor all night being looked at, so he does the other thing he does when nobody is counting. He rides east, into hills nobody uses.',
		'유신은 북이 그치기도 전에 궁에 닿는다. 여왕은 이미 그 북과 함께 회의 중이다. 문은 닫힌 채다. 원수가 밤새 복도에 서서 구경거리가 될 수는 없으니, 그는 아무도 세지 않을 때 하는 다른 일을 한다. 동쪽으로, 아무도 쓰지 않는 언덕으로 말을 몬다.'
	),
	{
		kind: 'place',
		place: 'steam_cavern',
		html: 'A hole in a hill east of the capital. The water is black, the steam is warm, and the hill has opinions.',
		ko: '도성 동쪽 언덕의 구멍 하나. 물은 검고, 김은 따뜻하고, 언덕은 할 말이 많다.'
	},
	p(
		'His father found this cave by falling into it, and told his son exactly one thing about it: go when you’re stuck. Inside, three women sit on the far rock as if they have always been there, which is roughly true. Narim, the eldest, keeps the rules. Hyullé keeps quiet. Golhwa keeps nothing.',
		'그의 아버지는 이 동굴을 굴러떨어져서 찾았고, 아들에게는 딱 한 가지만 일러 주었다. 막히면 가라. 안에는 세 여인이 저쪽 바위에 앉아 있다. 늘 거기 있었다는 듯이. 대충 맞는 말이다. 맏이 나림은 규칙을 지킨다. 혈레는 입을 지킨다. 골화는 아무것도 안 지킨다.'
	),
	p(
		'The house rules are older than Silla: Kims only, clean-shaven, and nobody stands in the water dressed. He folds his clothes on the rock lip, lays the sword beside them, and wades in to the chest with his eyes politely on the ceiling.',
		'집 규칙은 신라보다 오래됐다. 김씨만, 면도한 얼굴로, 그리고 옷 입고 물에 서는 사람은 없다. 그는 바위턱에 옷을 개어 두고 그 곁에 칼을 누인 뒤, 눈은 예의 바르게 천장에 둔 채 가슴께까지 걸어 들어간다.'
	),
	G([MARKER, '…What? I said waist. I’m being good.'], ['언니. 언니. 허리.', '…왜? 허리라고만 했잖아. 나 지금 착하게 구는 거야.']),
	N(['Golhwa. Chin.'], ['골화. 턱.']),
	G(['Shaved this morning. For the palace. Poor thing.', 'Chin passes.'], ['오늘 아침에 깎았네. 궁 가려고. 불쌍해라.', '턱 통과.']),
	N(['Your father’s stone is cold, Marshal. I can feel it from here. So no question tonight.'], ['아버님 돌이 차네요, 원수. 여기서도 느껴져요. 그러니 오늘 밤 질문은 없어요.']),
	Y(['I didn’t come for a question.', '…I came for advice.'], ['질문하러 온 게 아니오.', '…조언을 구하러 왔소.']),
	G(['Advice is cheaper. Go on.', 'Stand up a bit when you ask.'], ['조언은 싸. 해 봐.', '물을 땐 좀 일어서고.']),
	Y(
		['Her Majesty has been on the throne four winters. Every morning a man in the east corridor says the same word to her back.', 'She has a Council that votes, a war in the west, and a country that still—'],
		['폐하께서 즉위하신 지 네 해요. 아침마다 동쪽 복도에서 한 사내가 그분 등에 대고 같은 말을 하오.', '표결하는 화백이 있고, 서쪽엔 전쟁이 있고, 나라는 아직도—']
	),
	G(['He said Her Majesty with his whole chest. Unni, did you hear—'], ['폐하래. 가슴을 다 써서. 언니, 들었어—']),
	N(['Golhwa.'], ['골화.']),
	Y(['…How does a soldier help with that?'], ['…군인이 그걸 어떻게 돕소?']),
	H(['…He wants to go west. With the drums.', 'He keeps looking at the mouth.'], ['…서쪽으로 가고 싶으신 거예요. 북 따라서.', '자꾸 입구를 보세요.']),
	N(
		['Then don’t.', 'Bidam and the big one can carry one valley. They’d like one in public.', 'Every man in that palace has a sword, Marshal. Not one of them stands at her door without wanting something through it.'],
		['그럼 가지 마요.', '비담이랑 그 덩치면 골짜기 하나는 들어요. 남들 보는 데서 하나 갖고 싶어 하잖아요.', '저 궁에 칼 없는 남자 없어요, 원수. 그 문 앞에 서면서 그 너머로 뭘 바라지 않는 남자도 하나 없고요.']
	),
	Y(['I want nothing through it.'], ['나는 그 너머로 바라는 것이 없소.']),
	G(['Liar.', '…Sorry. That wasn’t the hill. That was me.'], ['거짓말.', '…미안. 그건 언덕 아니고 나.']),
	N(
		['Watch her door. Not the valley. The door.', 'Go when she sends you. Come back to that corridor before the dust settles. That’s how a soldier helps a queen.'],
		['그분 문을 지켜요. 골짜기 말고. 문.', '보내시면 가고, 먼지가 가라앉기 전에 그 복도로 돌아와요. 군인이 여왕을 돕는 건 그런 거예요.']
	),
	H(['…And eat something.', 'You never eat when she’s worried.'], ['…그리고 뭐 좀 드세요.', '그분이 걱정하시면 하나도 안 드시잖아요.']),
	p(
		'He dresses on the rock lip with his back to them, badly, the way every man does in that cave. Golhwa narrates. Narim lets her. Hyullé watches him climb back toward the city and the one lamp still lit in the palace, and says nothing at all.',
		'그는 등을 돌린 채 바위턱에서 옷을 입는다. 그 동굴의 남자들이 다 그렇듯 서툴게. 골화가 중계한다. 나림은 내버려 둔다. 혈레는 그가 도성과, 궁에 아직 하나 켜진 등불을 향해 다시 오르는 것을 지켜보고, 아무 말도 하지 않는다.'
	)
];

const fortyFortresses = [
	scene('The Hill', '언덕'),
	p(
		'He doesn’t stop at his own gate. He stops at the hill. Thirty riders wait on the road below with the horses and are told it’s a shrine, which in a way it is.',
		'제 집 대문에선 서지 않는다. 언덕에선 선다. 기병 서른이 아래 길에서 말과 함께 기다리며 사당이라는 말을 듣는다. 어떻게 보면 틀린 말도 아니다.'
	),
	p('He undresses fast, like a man with forty forts to not take back.', '그는 되찾지 않을 성 마흔이 걸린 사람처럼 빠르게 옷을 벗는다.'),
	G(['Slow down. We only get you between wars.', '…Which is never. Fine. Go fast.'], ['천천히 해. 우린 전쟁 사이에만 너 보잖아.', '…그런 날이 없지. 알았어. 빨리 해.']),
	N(['Forty.', 'The hill heard. Even the moss is talking about it.'], ['마흔.', '언덕도 들었어요. 이끼까지 그 얘기예요.']),
	Y(['I’ll start with one.'], ['하나부터 하겠소.']),
	H(['…Which one?'], ['…어느 거요?']),
	Y(['One of theirs. The one they think is safest.'], ['저쪽 것 하나. 제일 안전하다고 믿는 곳.']),
	N(
		['Then the hill has one thing for you, and it isn’t an answer.', 'Every fort on a river trusts its cliff. Nobody climbs the side the water guards.'],
		['그럼 언덕이 줄 게 하나 있어요. 답은 아니고요.', '강가의 성은 다 제 벼랑을 믿어요. 물이 지키는 쪽으론 아무도 안 올라요.']
	),
	G(['Go up in your socks. Boots ring.', '…That one actually was the hill. I’m as surprised as you.'], ['버선만 신고 올라가. 장화는 울려.', '…그건 진짜 언덕이었어. 나도 놀랐어.']),
	H(['…Your wife was at the gate.', 'You didn’t look. …We did.'], ['…부인께서 대문에 계셨어요.', '안 보셨죠. …저흰 봤어요.']),
	p(
		'He doesn’t answer that. He dresses with his back to them and goes down to the road, where thirty men are pretending they didn’t just hear a shrine laugh at their general.',
		'그 말엔 답하지 않는다. 등을 돌려 옷을 입고 길로 내려간다. 서른 명이 방금 사당이 자기네 장군을 비웃는 소리를 못 들은 척하고 있다.'
	)
];

const secretariat = [
	scene('Under the Hill', '언덕 아래'),
	p('Yushin comes by the next evening and finds the study exactly as it was, which in that house counts as progress.', '유신은 이튿날 저녁에 들러, 서재가 어제 그대로인 것을 본다. 그 집에선 그게 진전이다.'),
	Y(['You mean to take their seals one rice sack at a time.'], ['저들 인장을 쌀가마 하나씩 가져가겠다는 거로군.']),
	C(['One sack at a time. Nobody climbs a sacred hill over a sack.'], ['한 가마씩. 쌀가마 하나 갖고 신성한 언덕 오를 사람은 없제.']),
	Y(['Before you start, go to the hill.', 'Not the sacred one. Mine. Under it.'], ['시작하기 전에 언덕에 가 보게.', '신성한 언덕 말고. 내 언덕. 그 아래.']),
	C(['Your steam? Thirty years you’ve kept that cave from me like a mistress.', 'I sent Bupmin with a jar. Nobody ever asked me.'], ['니 김? 삼십 년을 첩 숨기듯 그 굴을 숨기더니.', '법민이는 단지 들려 보냈다. 내는 아무도 안 불러 주데.']),
	Y(['I’m asking now. Shave first.'], ['지금 청하는 걸세. 먼저 면도하게.']),
	C(['…I beg your pardon?'], ['…뭐라꼬?']),
	Y(['House rules.'], ['그 집 규칙일세.']),
	p(
		'So the most elegant man in Silla shaves by lantern at the mouth of a cave, a bronze mirror propped on a rock, complaining to it in couplets. Yushin holds the lantern and does not help.',
		'그리하여 신라에서 가장 우아한 사내가 동굴 입구에서 등불을 켜 놓고 면도를 한다. 바위에 청동 거울을 기대 놓고, 거울에 대고 대구로 투덜대면서. 유신은 등불을 들고 서서 거들지 않는다.'
	),
	p(
		'Inside, he undresses the way he does everything, as if someone were going to write it down. Three women on the far rock watch him do it.',
		'안에서 그는 무엇이든 하는 식으로 옷을 벗는다. 누가 받아 적기라도 할 것처럼. 저쪽 바위의 세 여인이 그걸 지켜본다.'
	),
	G(['Oh, he’s pretty. Unni, he knows he’s pretty.', 'Turn around. Slower. You’re a poet, act like it.'], ['어머, 예쁘다. 언니, 쟤 자기 예쁜 거 알아.', '돌아봐. 더 천천히. 시인이라며, 시인답게 해.']),
	C(['Ladies. I’ve been looked over by an emperor.', 'You’re kinder. …Marginally.'], ['숙녀분들. 내 황제한테도 훑어보인 몸이오.', '그대들이 더 친절하구려. …조금.']),
	N(['Golhwa. Chin.'], ['골화. 턱.']),
	G(['Lamp-shaved. Butchered under the jaw.', '…Passes.'], ['등불 켜고 깎았네. 턱 밑은 난도질이고.', '…통과.']),
	N(['A Surabol Kim. The mouth that talked an emperor round.', 'Ask, then. Once. From the water.'], ['서라벌 김이네요. 황제를 말로 돌려세운 그 입.', '그럼 물어요. 한 번. 물속에서.']),
	C(
		['I’m going to build an office that does in a morning what the Council does in a year. No vote. No hill. No uncles.', 'Will it hold?'],
		['화백이 한 해 걸릴 일을 아침나절에 해치우는 관청을 하나 지을 참이오. 표결도, 언덕도, 숙부들도 없이.', '버티겠소?']
	),
	p('The steam stops moving. Their eyes go solid, green and cyan and ember, and the cave stops being polite.', '김이 멈춘다. 셋의 눈이 초록과 청록과 불씨빛으로 굳고, 동굴은 더 이상 예의를 차리지 않는다.'),
	hill(
		['The door you build will open for any hand that holds the seal. Choose the hands.', 'A crown will come to you on paper.', 'Wear the gold one anyway.'],
		['당신이 짓는 문은 인장을 쥔 손이면 누구에게나 열릴 거예요. 손을 고르세요.', '관은 종이에 실려 당신에게 올 거예요.', '그래도 금관을 쓰세요.']
	),
	C(['…That’s a better line than mine.', 'I’ll steal it.'], ['…내 대사보다 낫구려.', '훔쳐 가겠소.']),
	H(['…It was yours.', 'You just hadn’t said it yet.'], ['…원래 당신 거였어요.', '아직 말을 안 하셨을 뿐이에요.']),
	p(
		'He comes up the slope at first light with a nick under his jaw and his hair wet. Yushin is asleep against the horses. The most talkative man in Silla stands there a while with nothing to say, and then wakes him anyway, because it’s cold and he wants to tell somebody.',
		'첫새벽, 그는 턱 밑에 베인 자국을 달고 젖은 머리로 비탈을 올라온다. 유신은 말에 기대 잠들어 있다. 신라에서 가장 말 많은 사내가 할 말 없이 한참 서 있다가, 그래도 그를 깨운다. 춥고, 누구한테든 말하고 싶어서.'
	)
];

const lastVisit = [
	N(
		['You used to bring the boy as far as the mouth. He’d wait with the horses and throw pebbles at the steam.', 'He isn’t at the mouth.'],
		['예전엔 그 아이를 입구까지 데려오셨잖아요. 말 옆에서 기다리며 김에 돌멩이를 던지곤 했죠.', '입구에 없네요.']
	),
	Y(['I have no son by that name.'], ['그런 이름의 아들은 없소.']),
	G(['Ugh. You did the voice. The Marshal voice. In here.'], ['으. 그 목소리 냈어. 원수 목소리. 여기서.']),
	H(['…He comes as far as the road below your gate. Twice now. The hill feels him stop.', 'He turns back at the lamp.'], ['…그분이 대문 아래 길까지 와요. 벌써 두 번이요. 멈추는 걸 언덕이 느껴요.', '등불을 보고 돌아가세요.']),
	p('Yushin looks at the water for a long time. It shows him nothing, which in this cave is an answer.', '유신은 오래도록 물을 들여다본다. 물은 아무것도 보여 주지 않는다. 이 동굴에선 그것도 답이다.')
];

// Cave stack that used to hang off Gumil’s one-line aside, rehomed to the scene each image depicts.
const MOVES = {
	'Jade Gate Valley': {
		'scene-steam-cavern-43': 'He rides east, into hills nobody uses.',
		steam_02: 'three women sit on the far rock',
		'goddesses-settle-beauty': 'three women sit on the far rock',
		'goddesses-heads-turn': 'three women sit on the far rock',
		'scene-steam-cavern-41': 'three women sit on the far rock',
		steam_01: 'wades in to the chest with his eyes politely on the ceiling',
		'golhwa-flame-wedge': MARKER,
		'narim-jade-pin': 'Your father’s stone is cold',
		'hyulle-wave-arc': 'He keeps looking at the mouth.',
		'golhwa-steam-emblem': 'That wasn’t the hill. That was me.',
		'scene-steam-cavern-44': 'Watch her door. Not the valley.',
		'steam-cavern-intimacy': 'He dresses on the rock lip with his back to them'
	},
	Seohyun: {
		'seohyeon-cavern-wide': 'Under the hill three sisters keep the heat in the stone',
		'goddesses-fox-shift': 'They try both.',
		'goddesses-crone-shift': 'They try both.',
		'goddesses-milf-shift': 'They try both.',
		'seohyeon-accident-wide': 'the ground gives under his boot',
		'seohyeon-page-turn': 'At the surname all three of them go quiet',
		'golhwa-pounce-kim': 'Golhwa is across the pool before he can step back',
		'seohyeon-robe-falls': 'He turns his back, takes off the wet clothes',
		'seohyeon-naked-enter': 'He turns his back, takes off the wet clothes',
		'narim-his-kind-look': 'Narim waits until he is in the water to the chest',
		'goddesses-pronounce-glow': 'Their eyes go solid, green and cyan and ember',
		'goddesses-yushin-prophecy': 'Their eyes go solid, green and cyan and ember',
		'seohyeon-leaving': 'He rides north with a stone in his sleeve'
	},
	'Gyul (結)': {
		'yushin-cavern-tears': 'Yushin goes through the water at him.',
		'seohyeon-older-wide': 'A third man comes out of it barefoot'
	},
	'Royal Secretariat': {
		marshal_steam_01: 'shaves by lantern at the mouth of a cave'
	}
};

const rewrite = (block, en, ko) => {
	block.html = en;
	block.ko = ko;
};

editStory((story) => {
	const entries = story.flatMap((c) => c.entries ?? []);
	const entry = (title) => entries.find((e) => e.title === title) ?? (() => { throw new Error(`no entry ${title}`); })();
	if (JSON.stringify(entry('Jade Gate Valley').blocks).includes(MARKER)) {
		console.log('goddess-arc: already applied');
		return false;
	}
	const at = (e, text) => {
		const hits = e.blocks.flatMap((b, i) => (textOf(b).includes(text) ? [i] : []));
		if (hits.length !== 1) throw new Error(`${e.title}: “${text}” matches ${hits.length} blocks`);
		return hits[0];
	};
	const insertAfter = (title, text, blocks) => {
		const e = entry(title);
		e.blocks.splice(at(e, text) + 1, 0, ...blocks);
	};

	const gumil = entry('Gumil');
	rewrite(
		gumil.blocks[at(gumil, 'a warm cave in the hills')],
		'Surabol’s dreams don’t change. Its famous sword is far from here this week, on some other errand of the queen’s. Nobody tells Daeya anything.',
		'서라벌의 꿈자리는 그대로다. 그 유명한 칼은 이번 주 여기서 멀리, 여왕의 다른 심부름 길에 있다. 대야에는 아무도 아무 말도 해 주지 않는다.'
	);

	insertAfter('Jade Gate Valley', 'Riding west in the last of the light', jadeGate);
	const jade = entry('Jade Gate Valley');
	rewrite(
		jade.blocks[at(jade, 'He has been at the door since the drums.')],
		'Yushin is at the door. He has been at the door since he came down out of the hills, hair still damp, and somebody has made him eat. Bidam notices, and for once says nothing. Alchun will later call it the bravest thing he saw all night.',
		'유신이 문 앞에 있다. 언덕에서 내려온 뒤로 줄곧, 머리도 덜 마른 채, 누가 억지로 뭘 먹이기까지 한 얼굴로 문 앞에 있었다. 비담은 그걸 보고도, 웬일로 아무 말도 하지 않는다. 알천은 나중에 그것이 그 밤 본 것 중 가장 용감한 일이었다고 말한다.'
	);

	insertAfter('Forty Fortresses', 'I’ll invent the reasons for you.', fortyFortresses);

	const jeon = entry('Jeon (轉)');
	rewrite(
		jeon.blocks[at(jeon, 'finds the cavern the way a man finds a rumor')],
		'<b>Bidam</b> isn’t looking for it. He is riding the eastern hills alone at night to count the queen’s fires from behind, and his horse goes lame on a path nobody uses. He walks. The path gets warm under his boots. Then the rock breathes, and there is a cave mouth with steam coming out of it like a temple at New Year. Sword on the lip. Beads in the fist. Six nights in armour; a hot spring is a hot spring, and no sutra forbids a wash.',
		'<b>비담</b>은 그걸 찾던 게 아니다. 여왕의 불을 뒤에서 세려고 홀로 밤의 동쪽 언덕을 타다가, 아무도 안 쓰는 길에서 말이 다리를 전다. 걸어간다. 장화 밑의 길이 따뜻해진다. 그러다 바위가 숨을 쉬고, 설날 절간처럼 김을 뿜는 동굴 입구가 나온다. 칼은 턱에. 염주는 주먹에. 엿새 밤을 갑옷 속에서 지냈다. 온천은 온천이고, 씻지 말라는 경은 없다.'
	);

	insertAfter('Royal Secretariat', 'sleeps the sleep of the saved and the thankful', secretariat);
	insertAfter('Kim Yushin†', 'You always liked it. Come sit. Please.', lastVisit);

	for (const [title, anchors] of Object.entries(MOVES)) {
		const target = entry(title);
		target.images ??= [];
		for (const [id, anchor] of Object.entries(anchors)) {
			const i = gumil.images.findIndex((im) => im.id === id);
			if (i < 0) throw new Error(`Gumil has no image ${id}`);
			at(target, anchor);
			const [im] = gumil.images.splice(i, 1);
			im.at = anchor;
			target.images.push(im);
		}
	}
	console.log('goddess-arc: applied');
});
