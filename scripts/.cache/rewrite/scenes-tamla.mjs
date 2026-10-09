/**
 * Scenes pass, Tamla myths (#58–#64): strip the Yuri Dora / Gyebek storytelling frame.
 * #58–#63 become straight myth episodes told by the house narrator.
 * #64 Tribute keeps Gyebek (it is his real time on the island) and plants the frame facts later episodes call back to.
 * Idempotent: each entry checks a marker before it rebuilds. `DRY=1` runs without saving.
 */
import { editStory, textOf } from '../story-ops.mjs';

const DRY = !!process.env.DRY;
const CHIP = '#5f5a52';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const SAY = (person, en, ko) => ({ kind: 'dialogue', person, lines: ko, en });
const EXTRA = (speaker, gender, en, ko) => ({ kind: 'dialogue', chip: CHIP, speaker, gender, lines: ko, en });
const CARD = (html, ko) => P(`<b>${html}</b>`, `<b>${ko}</b>`);

function entryByTitle(story, title) {
	const hits = story.flatMap((c) => c.entries.filter((e) => e.title === title));
	if (hits.length !== 1) throw new Error(`entry "${title}": ${hits.length} matches`);
	return hits[0];
}

/** The one top-level block whose text holds `frag`. */
function get(entry, frag) {
	const hits = entry.blocks.filter((b) => textOf(b).includes(frag));
	if (hits.length !== 1) throw new Error(`${entry.title}: "${frag}" matched ${hits.length} blocks`);
	return hits[0];
}

const has = (entry, frag) => entry.blocks.some((b) => textOf(b).includes(frag));

function images(entry, { drop = [], at = {} }) {
	entry.images = (entry.images ?? []).filter((im) => !drop.includes(im.id));
	for (const im of entry.images) if (im.id in at) im.at = at[im.id];
}

const log = [];

/* ───────────────────────── #58 Heaven–Earth King ───────────────────────── */

function heavenEarthKing(story) {
	const e = entryByTitle(story, 'Heaven–Earth King');
	const OPEN = 'Every family has one relative who never comes home for dinner.';
	if (has(e, OPEN)) return log.push('#58 already done');

	const from = e.blocks.indexOf(get(e, 'In the beginning there were two suns and two moons.')) - 1; // its scene header
	const to = e.blocks.indexOf(get(e, 'judges, and the measures are honest.'));
	if (e.blocks[from]?.kind !== 'scene') throw new Error('#58: Two Suns header moved');
	const tale = e.blocks.slice(from, to + 1);

	e.blocks = [
		P(`${OPEN} In ours, it was Heaven–Earth King.`, '어느 집안에나 저녁 먹으러 안 들어오는 친척이 하나쯤 있다. 우리 집안에선 천지왕이 그랬다.'),
		...tale,
		P(
			'So the house was divided, and it has stayed divided. Downstairs, the dead, and a judge with honest measures. Upstairs, the living, and a king who got there with a stolen flower. Out at the far western end there is a flower field. That is a story for another night.',
			'그렇게 집이 나뉘었고, 지금까지 나뉜 채다. 아래층엔 죽은 자들과 됫박이 정직한 판관. 위층엔 산 자들과, 훔친 꽃으로 그 자리에 오른 임금. 서쪽 맨 끝에는 꽃밭이 하나 있다. 그건 다른 날 밤의 이야기다.'
		),
		P(
			'Above all of it sits the oldest lord of the sky. He will tell you he never interferes. He says it with a straight face. He has had a great deal of practice.',
			'그 모든 것 위에 하늘의 가장 늙은 어른이 앉아 있다. 그는 자기가 절대 끼어들지 않는다고 말할 것이다. 얼굴색 하나 안 바꾸고 말한다. 연습을 아주 많이 했다.'
		),
		P(
			'As for the Lady of Wisdom, she kept the rice on, the way she said she would. Nobody in this story remembers to go back down and tell her how it went. Somebody should have.',
			'총명아기는 말한 대로 밥을 안쳐 두었다. 이 이야기에서 다시 내려가 어떻게 됐는지 일러 준 이는 아무도 없다. 누군가는 그랬어야 했다.'
		),
		CARD(
			'Down on the living side, somebody still has to make the ground. One woman makes an island, and she is enormous…!',
			'이승 쪽에선 아직 누군가 땅을 빚어야 한다. 한 여인이 섬 하나를 만든다. 어마어마하게 큰 여인이…!'
		)
	];
	images(e, { drop: ['hek-ink-frame', 'hek-ink-embers'] });
	log.push('#58 rebuilt');
}

/* ───────────────────────── #59 Sulmun ───────────────────────── */

function sulmun(story) {
	const e = entryByTitle(story, 'Sulmun');
	const MARK = 'Her apron had a hole in it.';
	if (has(e, MARK)) return log.push('#59 already done');

	const open = get(e, 'Before the island there is a woman, and she is enormous.');
	const cardBlock = e.blocks.find((b) => b.kind === 'card' && b.person === 'sulmun');
	const place = e.blocks.find((b) => b.kind === 'place' && b.place === 'halla');
	const sea = get(e, 'The youngest walked into the sea');
	const quote = e.blocks.find((b) => b.kind === 'quote');
	const next = e.blocks.at(-1);
	if (!cardBlock || !place || !quote || !/^\s*<b>/.test(next.html)) throw new Error('#59: shape changed');

	e.blocks = [
		open,
		P(
			`${MARK} Nobody mentioned it, because nobody mentions things to a woman that size. Every handful that fell through became a hill, and the island counts three hundred and sixty-eight of them.`,
			'치마에는 구멍이 나 있었다. 아무도 말하지 않았다. 그만한 덩치의 여자에게는 원래 아무도 뭘 말하지 않는다. 구멍으로 흘린 흙 한 줌 한 줌이 오름이 되었고, 섬은 그것을 삼백예순여덟 개로 센다.'
		),
		cardBlock,
		place,
		SCENE('The Bridge', '다리'),
		P(
			'She liked the island. She did not like that you could not walk off it. So one morning she sat down on the shore with her feet in the sea and made the islanders an offer.',
			'할망은 섬이 마음에 들었다. 걸어서 나갈 수 없다는 것만 빼고. 그래서 어느 아침 바닷가에 앉아 발을 바다에 담그고 섬사람들에게 흥정을 걸었다.'
		),
		SAY('sulmun', ['Make me a jacket and a skirt. My size.', 'Do that, and I’ll lay you a road to the mainland. You’ll walk to market.'], ['나 몸에 맞는 저고리영 치마 혼 벌 지어 도라.', '경허민 뭍까지 길 놔 주크라. 장에 걸엉 가게.']),
		EXTRA('An Islander', 'm', ['Your size, Halmang?', '…And how much silk would that be, now?'], ['할망 몸에 맞게마씸?', '…게민 명주가 얼마나 들어 마씸?']),
		SAY('sulmun', ['A hundred rolls.'], ['백 동.']),
		EXTRA('An Islander', 'm', ['A hundred.', 'Would ninety do you? With a bit of a stretch in the seams?'], ['백 동…', '아흔 동이민 안 되쿠과? 솔기를 호꼼 늘령?']),
		SAY('sulmun', ['Do I look like a woman you stretch things around?'], ['나가 늘령 둘러질 몸으로 뵈여?']),
		P(
			'They looked under every roof on the island. They found ninety-nine. The collar was never finished. Neither was the bridge.',
			'섬사람들은 집집마다 지붕 밑을 다 뒤졌다. 아흔아홉 동이 나왔다. 옷깃은 끝내 짓지 못했다. 다리도 끝내 놓이지 않았다.'
		),
		P(
			'One roll short is the worst amount to be short by. You can still see where she started: a line of black rocks walking out from the north shore into the sea, and stopping.',
			'한 동 모자란 게 제일 억울한 법이다. 할망이 놓기 시작한 자리는 지금도 보인다. 북쪽 바닷가에서 검은 바위들이 줄지어 바다로 걸어 나가다가, 멈춘다.'
		),
		SCENE('The Cauldron', '죽솥'),
		P(
			'Then came a famine, the kind the island still gets. She had five hundred sons, and every one of them came home hungry.',
			'그러다 흉년이 들었다. 섬에 지금도 드는 그런 흉년이다. 할망에게는 아들이 오백이었고, 하나같이 배를 곯고 돌아왔다.'
		),
		P(
			'She set a cauldron of porridge on to boil for them, climbed up on the rim to stir it, and slipped, and did not come out.',
			'할망은 아들들을 먹이려 큰 솥에 죽을 끓였다. 솥전에 올라서서 젓다가 미끄러졌고, 나오지 못했다.'
		),
		EXTRA(
			'Sulmun’s Sons',
			'm',
			['Smell that? Mother’s made porridge.', 'Where’s she got to, then?', 'Who cares, eat it before the little one’s back—', 'Another bowl! Sure it’s the best she ever made—'],
			['냄새 맡아 보라. 어멍이 죽 쒀 놨저.', '어멍은 어디 갔댄?', '몰라, 막내 오기 전에 먹으라—', '혼 그릇 더! 이추룩 맛좋은 건 처음이여—']
		),
		P('The youngest gets home last, the way youngest sons do. What is left for him is the bottom of the pot.', '막내는 막내들이 늘 그렇듯 맨 나중에 돌아온다. 그에게 남은 건 솥 바닥이다.'),
		EXTRA('The Youngest', 'm', ['Hyeong. There’s something down here.', '…Hyeong.', 'That’s her hairpin.'], ['성님. 바닥에 뭐 있저.', '…성님.', '이거 어멍 비녀여.']),
		P('Nobody blames the sons. They blame themselves, which takes longer.', '아무도 아들들을 탓하지 않는다. 아들들이 제 탓을 한다. 그쪽이 더 오래 걸린다.'),
		sea,
		quote,
		next
	];
	images(e, {
		at: {
			'tamla-oreum': MARK,
			'scene-tamla-birds-41': MARK,
			'scene-tamla-birds-42': 'Before the island there is a woman',
			'scene-tamla-birds-44': 'Before the island there is a woman',
			'scene-tamla-birds-43': 'One roll short is the worst amount',
			'sulmun-seq-silk': 'A hundred rolls.'
		}
	});
	log.push('#59 rebuilt');
}

/* ───────────────────────── #60 Three Princes ───────────────────────── */

function threePrinces(story) {
	const e = entryByTitle(story, 'Three Princes');
	const MARK = 'They come up one after another, blinking';
	if (has(e, MARK)) return log.push('#60 already done');

	const open = get(e, 'Half the kingdoms on the mainland');
	const diagram = e.blocks.find((b) => b.kind === 'diagram');
	const bjScene = e.blocks.find((b) => b.kind === 'scene' && b.label === 'Baekjuto and Socheon-guk');
	const bjCard = e.blocks.find((b) => b.kind === 'card' && b.person === 'baekjuto');
	const bjLine = e.blocks.find((b) => b.kind === 'dialogue' && b.person === 'baekjuto');
	const scCard = e.blocks.find((b) => b.kind === 'card' && b.person === 'socheonguk');
	const scLine = e.blocks.find((b) => b.kind === 'dialogue' && b.person === 'socheonguk');
	const divorce = get(e, 'It is the first divorce in the record');
	const drift = get(e, 'It drifted for years');
	if (!diagram || !bjScene || !bjCard || !bjLine || !scCard || !scLine) throw new Error('#60: shape changed');

	e.blocks = [
		open,
		diagram,
		SCENE('The Three Holes', '삼성혈'),
		P(
			`Long after the Great Lady’s stone sons, three divine princes climb out of a hole in the ground. Nobody hatches. ${MARK}, dirt in their hair. They look at the island, and then at each other.`,
			'설문대할망의 돌 아들들이 생기고 한참 뒤, 신령한 왕자 셋이 땅구멍에서 기어 나온다. 알에서 깨어난 이는 없다. 하나씩 차례로 올라와 눈을 끔뻑인다. 머리엔 흙이 묻어 있다. 셋은 섬을 둘러보고, 그다음 서로를 본다.'
		),
		EXTRA('Yang-eulna', 'm', ['Who came out first?'], ['누게가 몬저 나와시니?']),
		EXTRA('Go-eulna', 'm', ['Me.'], ['나.']),
		EXTRA('Bu-eulna', 'm', ['You did not. I had my hand on the edge before you—'], ['아니주. 나가 몬저 손 걸쳤는디—']),
		EXTRA('Go-eulna', 'm', ['Hands don’t count.'], ['손은 안 쳐.']),
		EXTRA('Yang-eulna', 'm', ['…Is this how it’s going to be? Forever?'], ['…영 허멍 살 거라? 영영?']),
		EXTRA('Bu-eulna', 'm', ['Shoot for it. Wherever your arrow comes down, that’s yours. No arguing after.'], ['활로 정허게. 화살 떨어진 디가 지 땅. 뒷말 엇이.']),
		EXTRA('Go-eulna', 'm', ['No arguing after.'], ['뒷말 엇이.']),
		EXTRA('Yang-eulna', 'm', ['…He’s going to argue after.'], ['…쟈는 뒷말 헐 거여.']),
		P('They each shoot an arrow and rule wherever it lands. Nobody argues after. Well. Not much.', '셋은 저마다 활을 쏘아, 화살이 떨어진 땅을 다스린다. 뒷말은 없었다. 뭐. 많지는 않았다.'),
		SCENE('The Box', '상자'),
		P(
			'One day a box drifts from the East Sea and grounds on their beach. It is sealed with purple clay. Inside are a messenger and three princesses, and behind them, packed in straw, calves, foals and the five grains.',
			'어느 날 동쪽 바다에서 상자 하나가 떠밀려 와 그들의 바닷가에 얹힌다. 자줏빛 진흙으로 봉해져 있다. 안에는 사자 하나와 공주 셋, 그 뒤로 짚에 싸인 송아지와 망아지와 오곡이 있다.'
		),
		EXTRA(
			'The Messenger',
			'm',
			['My king in the east saw three princes with no wives and no seed grain. He sends both.', '…Take a moment, my lords.'],
			['동쪽 저희 임금께서 아내도 씨앗도 없는 왕자 셋을 보셨습니다. 둘 다 보내셨습니다.', '…잠시 숨을 고르십시오.']
		),
		EXTRA('Bu-eulna', 'm', ['The calves are ours too?'], ['송아지도 우리 거라?']),
		EXTRA('The Messenger', 'm', ['Everything in the box.'], ['상자 안의 것은 전부입니다.']),
		P(
			'They marry the three princesses at a pond. That is how Tamla learns to farm, and how it learns that anything worth having arrives by sea in a container.',
			'왕자들은 연못가에서 세 공주와 혼인한다. 그렇게 탐라는 농사를 배운다. 그리고 쓸 만한 것은 죄다 바다 건너 상자에 담겨 온다는 것도 배운다.'
		),
		bjScene,
		P(
			'Years later, the hunting god married the farming goddess. She had crossed the sea to find a husband, and she brought a dowry with a purpose: an ox to plough with.',
			'여러 해 뒤, 사냥의 신 소천국이 농사의 신 백주또와 혼인했다. 백주또는 남편을 찾아 바다를 건너왔고, 쓸모 있는 혼수를 가져왔다. 밭 갈 소 한 마리.'
		),
		bjCard,
		P('He went out with it in the morning. He came back in the evening without it, and with a very full stomach.', '아침에 그는 소를 몰고 나갔다. 저녁에 소 없이, 배가 아주 부른 채 돌아왔다.'),
		bjLine,
		scCard,
		scLine,
		divorce,
		P('Their son kicked his father in the chest at three years old.', '그 아들이 세 살에 아비의 가슴을 걷어찼다.'),
		SAY('socheonguk', ['He kicked me. In the chest. He’s three.'], ['저게 나를 찼저. 가슴팍을. 세 살짜리가.']),
		SAY('baekjuto', ['He takes after you.'], ['지 아방 닮았주.']),
		P('So they put the boy in an iron chest, locked it, and set it on the water.', '그래서 사람들은 아이를 무쇠 궤에 넣고 자물쇠를 채워 물에 띄웠다.'),
		drift,
		P(
			'He came home and became the god of his own land: the god the ones who threw him out have to bow to. How many years was he in the chest? The story doesn’t say. Exiles always want to know, and it never does.',
			'그는 돌아와 제 땅의 신이 되었다. 자기를 내다 버린 이들이 절해야 하는 신. 궤 속에서 몇 해를 보냈느냐고? 이야기는 말해 주지 않는다. 귀양 간 사람들은 늘 그걸 묻고, 이야기는 늘 말해 주지 않는다.'
		),
		CARD('A serpent in a cave. A woman who steps out of a rock. A man told not to look back…!', '동굴 속의 뱀. 바위에서 걸어 나온 여인. 돌아보지 말라는 말을 들은 사내…!')
	];

	const stoneLady = entryByTitle(story, 'Stone Lady');
	const chest = (stoneLady.images ?? []).find((im) => im.id === 'iron-chest');
	if (chest) {
		stoneLady.images = stoneLady.images.filter((im) => im !== chest);
		if (!e.images.some((im) => im.id === 'iron-chest')) e.images.push({ ...chest, at: 'set it on the water' });
	}
	images(e, {
		drop: ['yuridora-gwahama-shore', 'yuridora-gwahama-oranges'],
		at: { 'tamla-island': 'Half the kingdoms on the mainland', 'ox-iron-tale': 'an ox to plough with' }
	});
	log.push('#60 rebuilt');
}

/* ───────────────────────── #61 Stone Lady ───────────────────────── */

function stoneLady(story) {
	const e = entryByTitle(story, 'Stone Lady');
	const OPEN = 'Tamla is made of stone.';
	if (has(e, OPEN)) return log.push('#61 already done');

	const sbScene = e.blocks.find((b) => b.kind === 'scene' && b.label === 'Sanbangdeok');
	const sbFrom = e.blocks.indexOf(sbScene);
	const sbTo = e.blocks.indexOf(get(e, 'The spring inside it has not stopped since.'));
	const gmScene = e.blocks.find((b) => b.kind === 'scene' && b.label === 'Gameunjang');
	const quote = e.blocks.find((b) => b.kind === 'quote');
	const yams = get(e, 'She walked until she found three brothers digging yams');
	const next = e.blocks.at(-1);
	if (!sbScene || sbTo < sbFrom || !gmScene || !quote || !/^\s*<b>/.test(next.html)) throw new Error('#61: shape changed');

	e.blocks = [
		P(`${OPEN} Sooner or later, so is everybody in its stories.`, '탐라는 돌로 되어 있다. 조만간 그 이야기 속 사람들도 다 돌이 된다.'),
		SCENE('Gimnyeong Cave', '김녕굴'),
		P(
			'There is the serpent in the cave at Gimnyeong, and every year the village gives it a girl. One year a young magistrate comes over from the mainland and refuses to.',
			'김녕굴에는 뱀이 산다. 마을은 해마다 그것에게 처녀를 하나씩 바친다. 어느 해, 뭍에서 건너온 젊은 판관이 그러기를 거부한다.'
		),
		EXTRA('A Village Elder', 'm', ['It’s always been fed, sir. Every year.', 'Don’t go in there.'], ['해마다 먹여 왔수다, 나리.', '그디 들어가지 맙서.']),
		EXTRA('The Young Magistrate', 'm', ['Then it’s had plenty.'], ['그럼 실컷 먹었군.']),
		P(
			'He goes in with a spear and a great deal of smoke, and comes out with the serpent dead behind him. At the cave mouth the old shaman catches his sleeve.',
			'그는 창과 연기를 잔뜩 가지고 들어가, 등 뒤에 죽은 뱀을 두고 나온다. 굴 어귀에서 늙은 심방이 그의 소매를 잡는다.'
		),
		EXTRA('The Shaman', 'f', ['Ride for the town, sir. Don’t look back.', 'Whatever you hear behind you. Don’t.'], ['읍내까지 내쳐 갑서, 나리. 뒤돌아보지 맙서.', '뒤에서 뭔 소리가 나도, 돌아보지 맙서.']),
		P(
			'Halfway to town he hears something behind him. He wants to see whether he has won. He looks back. By evening he is dead in his bed, and nobody in the village is surprised, which is the saddest part.',
			'읍내까지 반쯤 갔을 때 등 뒤에서 소리가 난다. 그는 자기가 이겼는지 보고 싶다. 돌아본다. 저녁이 되자 그는 제 자리에서 죽어 있고, 마을의 누구도 놀라지 않는다. 그게 제일 슬픈 대목이다.'
		),
		...e.blocks.slice(sbFrom, sbTo + 1),
		P('The island says its stories don’t end badly. They end in stone, which is different. Stone stays.', '섬사람들은 자기네 이야기가 나쁘게 끝나는 게 아니라고 한다. 돌로 끝난다고. 그건 다르다. 돌은 남는다.'),
		gmScene,
		P(
			'Not every story here ends in stone. Some end in gold, which is worse news for somebody. A rich man had three daughters, and one evening he asked them whose luck they lived on.',
			'여기 이야기가 다 돌로 끝나는 건 아니다. 금으로 끝나는 것도 있는데, 그건 누군가에게 더 나쁜 소식이다. 부자에게 딸이 셋 있었다. 어느 저녁 그는 딸들에게 누구 덕에 사느냐고 물었다.'
		),
		EXTRA('The Eldest Daughter', 'f', ['Heaven’s, Father. And earth’s. And yours, and Mother’s.'], ['하늘님 덕, 땅님 덕, 아방 덕, 어멍 덕이우다.']),
		EXTRA('The Middle Daughter', 'f', ['What she said.', '…Mostly yours, Father.'], ['성님 말 그대로우다.', '…거의 아방 덕이우다.']),
		P('The father beams. Then he turns to the youngest.', '아버지 얼굴이 환해진다. 그러고는 막내를 돌아본다.'),
		quote,
		EXTRA('The Father', 'm', ['Out.', 'Tonight. Take nothing my luck paid for.'], ['나가라.', '오늘 밤. 나 덕으로 산 건 하나도 가져가지 말라.']),
		SAY('gameunjang', ['Then I’ll take the black cow. She was born before you were rich.'], ['게민 검은 암소나 데령 가쿠다. 아방 부자 되기 전에 난 소우다.']),
		yams,
		P(
			'Her parents lost everything and went blind. Years later she held a beggars’ feast that lasted three days. On the third day two old blind beggars came to the gate, and she served them herself.',
			'부모는 모든 것을 잃고 눈이 멀었다. 여러 해 뒤 그는 사흘 동안 거지 잔치를 열었다. 사흘째 되는 날 눈먼 늙은 거지 둘이 문에 왔고, 그는 손수 상을 올렸다.'
		),
		SAY('gameunjang', ['Eat, both of you. There’s more.', '…It’s me. The youngest. The one who lived on her own luck.'], ['두 분 다 드십서. 더 있수다.', '…나우다. 막내. 지 덕으로 살던 그 딸.']),
		P('Their eyes opened. The first thing they saw was the daughter they had thrown out, holding the ladle.', '두 사람의 눈이 뜨였다. 처음 본 것은 자기들이 내쫓은 딸이 국자를 든 모습이었다.'),
		next
	];
	images(e, { drop: ['iron-chest'] });
	log.push('#61 rebuilt');
}

/* ───────────────────────── #62 Gardener ───────────────────────── */

function gardener(story) {
	const e = entryByTitle(story, 'Gardener');
	const OPEN = 'Heaven has trouble keeping gardeners.';
	if (has(e, OPEN)) return log.push('#62 already done');

	const servant = get(e, 'The rich man wanted her.');
	const hlCard = e.blocks.find((b) => b.kind === 'card' && b.person === 'sara');
	const field = get(e, 'found the flower field at the far end of the west');
	const keeper = get(e, 'Afterwards the son took the flower field over');
	const jcScene = e.blocks.find((b) => b.kind === 'scene' && b.label === 'Jacheongbi');
	const jcCard = e.blocks.find((b) => b.kind === 'card' && b.person === 'jacheongbi');
	const jcFrom = e.blocks.indexOf(get(e, 'Three years at the same desk.'));
	const jcTo = e.blocks.indexOf(get(e, 'does not come home empty-handed'));
	const next = e.blocks.at(-1);
	if (!hlCard || !jcScene || !jcCard || jcTo < jcFrom || !/^\s*<b>/.test(next.html)) throw new Error('#62: shape changed');

	e.blocks = [
		P(`${OPEN} The first one left a wife behind and forgot to say how long.`, '하늘은 꽃감관을 오래 붙잡아 두지 못한다. 첫 번째 감관은 아내를 두고 떠나면서 얼마나 걸릴지 말하는 걸 잊었다.'),
		SCENE('The Rich Man’s House', '부잣집'),
		P(
			'His name was Sara Doryeong, and heaven sent for him to keep its flower field in the west. His wife was carrying. She could not walk as fast as heaven wanted, so he left her at a rich man’s house to wait.',
			'그 이름은 사라도령. 하늘은 서쪽 꽃밭을 지키라고 그를 불렀다. 아내는 아이를 배고 있었다. 하늘이 바라는 만큼 빨리 걷지 못했다. 그래서 그는 아내를 어느 부잣집에 맡겨 두고 기다리라 했다.'
		),
		EXTRA('Sara Doryeong', 'm', ['Wait for me here.'], ['이디서 기다리라.']),
		EXTRA('Hallakgungi’s Mother', 'f', ['When?'], ['언제마씸?']),
		EXTRA('Sara Doryeong', 'm', ['…I’ll come back.'], ['…돌아오마.']),
		servant,
		hlCard,
		P('When he was old enough, his mother told him where his father was.', '아이가 클 만큼 크자, 어머니는 아버지가 어디 있는지 일러 주었다.'),
		EXTRA('Hallakgungi’s Mother', 'f', ['West. Past where the roads stop.', 'Go tonight. Don’t come back for me.'], ['서쪽. 길 끝나는 디 너머.', '오늘 밤 가라. 나 데리러 오지 말라.']),
		SAY('sara', ['Come with me.'], ['같이 가.']),
		EXTRA('Hallakgungi’s Mother', 'f', ['I’d slow you down. I slowed him down too.'], ['나가 느 발 잡을 거라. 느 아방 발도 잡았주.']),
		P(
			'He went west that night. In the morning the rich man found the boy gone, killed the mother instead, and threw her into a bamboo grove. She had known he would. She told the boy anyway.',
			'아이는 그날 밤 서쪽으로 떠났다. 아침에 부자는 아이가 없어진 걸 알고 대신 어머니를 죽여 대숲에 던졌다. 그녀는 그럴 줄 알았다. 그래도 아이에게 말해 주었다.'
		),
		SCENE('The Flower Field', '서천꽃밭'),
		field,
		EXTRA('Sara Doryeong', 'm', ['You have her chin.'], ['느 어멍 턱을 닮았구나.']),
		SAY('sara', ['She waited fifteen years.', 'You didn’t say how long.'], ['어멍은 열다섯 해를 기다렸어.', '얼마나 걸린다고 말을 안 했잖아.']),
		EXTRA('Sara Doryeong', 'm', ['…No.', 'Mind the end of the row. Don’t touch that one.'], ['…그래.', '고랑 끝은 조심해라. 그건 만지지 마라.']),
		P(
			'He took from both rows. He went back to the rich man’s house and held a little party: the laughing flower, the fighting flower, and the last one. Then he went to the bamboo grove, found his mother’s bones, and put her back together in order. Bone, flesh, blood, breath, soul.',
			'아들은 두 고랑에서 다 꺾었다. 그 부잣집으로 돌아가 작은 잔치를 열었다. 웃음꽃, 싸움꽃, 그리고 마지막 꽃. 그다음 대숲에 가서 어머니의 뼈를 찾아, 순서대로 맞추었다. 뼈, 살, 피, 숨, 넋.'
		),
		keeper,
		P(
			'The father did not go home with them. He kept the gate until the boy was ready for it, and then he retired, which in heaven is the same as vanishing.',
			'아버지는 함께 돌아가지 않았다. 아들이 문을 맡을 만해질 때까지 지키다가 물러났다. 하늘에서 물러난다는 건 사라지는 것과 같다.'
		),
		jcScene,
		P(
			'The gardener’s flowers come back into the story, the way borrowed tools do. This time they are wanted by a girl with no patience at all.',
			'꽃감관의 꽃은 빌려 간 연장처럼 이야기에 다시 돌아온다. 이번에 그 꽃을 찾는 건 참을성이라곤 없는 처녀다.'
		),
		P(
			'Jacheongbi wanted to study beside a boy from the sky. Women were not allowed in the room, so she cut her hair and put on a man’s clothes.',
			'자청비는 하늘에서 온 도령을 따라 글을 배우고 싶었다. 여자는 그 방에 들 수 없었다. 그래서 머리를 자르고 남자 옷을 입었다.'
		),
		jcCard,
		P('Nobody had ever written a rule against it. Nobody had imagined they would need one.', '그걸 막는 규칙은 아무도 써 둔 적이 없었다. 그런 규칙이 필요할 줄 아무도 몰랐다.'),
		...e.blocks.slice(jcFrom, jcTo + 1),
		next
	];
	images(e, {
		at: {
			'hallakgungi-green-bloom': 'The gardener’s flowers come back into the story',
			'scene-gardener-homage-21': 'The gardener’s flowers come back into the story'
		}
	});
	log.push('#62 rebuilt');
}

/* ───────────────────────── #63 Kangrim ───────────────────────── */

function kangrim(story) {
	const e = entryByTitle(story, 'Kangrim');
	const OPEN = 'Every death you’ve watched so far has had a visitor';
	images(e, { at: { 'scene-grim-reapers-killmonger-2': 'the hour does not come in a just order' } });
	if (has(e, OPEN)) return log.push('#63 already done');

	const caseP = get(e, 'A rich couple killed three brothers for their silk');
	const roadFrom = e.blocks.indexOf(e.blocks.find((b) => b.kind === 'scene' && b.label === 'The Road Down'));
	const roadTo = e.blocks.indexOf(get(e, 'Lend me that man. I still have errands.'));
	const woke = get(e, 'That is how Kangrim died upstairs');
	const ledger = get(e, 'Yumla then put in his hands a ledger');
	const quote = e.blocks.find((b) => b.kind === 'quote');
	const charcoal = get(e, 'One errand was left');
	const collect = e.blocks.find((b) => b.kind === 'dialogue' && b.person === 'kangrim' && b.en.some((l) => l.includes('I do not punish.')));
	if (roadFrom < 0 || roadTo < roadFrom || !quote || !collect) throw new Error('#63: shape changed');

	e.blocks = [
		P(
			`${OPEN}: a man with a red book and one question. Here is where he came from.`,
			'지금까지 당신이 지켜본 죽음마다 손님이 하나 있었다. 붉은 책 한 권과 질문 하나를 든 사내. 그가 어디서 왔는지 이야기할 차례다.'
		),
		SCENE('The Magistrate’s Hall', '원님 동헌'),
		caseP,
		P(
			'How did they come back? Three flowers on the water, three beads, three sons. That part is a night’s work by itself. And yes, the magistrate was called Gimchi. He was a serious man. Please don’t laugh.',
			'어떻게 돌아왔느냐고? 물 위에 꽃 셋, 구슬 셋, 아들 셋. 그 대목만 해도 하룻밤 걸린다. 그리고 그렇다, 원님 이름이 김치였다. 진지한 양반이었다. 웃지 마시라.'
		),
		EXTRA('Magistrate Gimchi', 'm', ['Kangrim. Go down and bring me King Yumla.'], ['강림아. 저승에 내려가 염라대왕을 잡아 오너라.']),
		SAY('kangrim', ['…Down, sir.'], ['…내려가라 하셨습니까, 사또.']),
		EXTRA('Magistrate Gimchi', 'm', ['Down. The hearing is in three days.'], ['내려가라. 공초는 사흘 뒤다.']),
		SAY('kangrim', ['Sir. Does he know he’s coming?'], ['사또. 그분도 오실 줄 아십니까.']),
		EXTRA('Magistrate Gimchi', 'm', ['He will when you tell him.'], ['네가 말하면 알겠지.']),
		...e.blocks.slice(roadFrom, roadTo + 1),
		P(
			'The magistrate refused. He did not believe in souls, and he was not about to lend his best man to one. So they split him. The magistrate kept the body. Yumla took the soul.',
			'원님은 거절했다. 혼 같은 건 믿지 않았고, 제일 쓸 만한 부하를 그런 것에 빌려줄 생각도 없었다. 그래서 둘로 갈랐다. 원님은 몸을 가졌다. 염라는 혼을 가져갔다.'
		),
		woke,
		ledger,
		quote,
		charcoal,
		collect,
		P('He still asks it, the question. You have heard him. You will hear him again.', '그는 지금도 그 질문을 한다. 당신도 들었다. 또 듣게 될 것이다.'),
		CARD(
			'Back in the world of counted days, a tribute boat sails home from Sabi. On the beach, Gyebek has been waiting for it…!',
			'세는 날들의 세상으로 돌아가자. 조공선 한 척이 사비에서 돌아온다. 바닷가에서 계백이 그 배를 기다려 왔다…!'
		)
	];
	e.logline = {
		en: 'A magistrate sends his strongest man down alive to arrest the judge of the dead. The judge keeps him, and a crow loses the book of everyone’s hour.',
		ko: '원님이 제일 힘센 부하를 산 채로 저승에 보내 죽은 자의 판관을 잡아 오게 한다. 판관은 그 사내를 붙잡아 두고, 까마귀는 모두의 시각이 적힌 책을 잃어버린다.'
	};
	log.push('#63 rebuilt');
}

/* ───────────────────────── #64 Tribute ───────────────────────── */

function tribute(story) {
	const e = entryByTitle(story, 'Tribute');
	const MARK = 'Gyebek has been waiting for this boat for nine hundred and sixty-one days.';
	if (has(e, MARK)) return log.push('#64 already done');

	const b = e.blocks;
	const open = get(e, 'The tribute boat comes home light.');
	const scene = b.find((x) => x.kind === 'scene' && x.label === 'The Forgotten Oranges');
	const ask = get(e, 'Why does your island keep Baekje');
	const forgot = get(e, 'Once, long ago, we forgot the oranges.');
	const tale = [get(e, 'One year, long ago, Tamla stops sending tribute.'), get(e, 'marches an army to the southern harbour'), b.find((x) => x.kind === 'quote'), get(e, 'and the oranges resume')];
	const marched = get(e, 'He marched to the harbour, and stopped.');
	const favour = get(e, 'there is an island, and the island owes it a favour');
	if (!scene || tale.includes(undefined)) throw new Error('#64: shape changed');

	const iOpen = b.indexOf(open);
	const iScene = b.indexOf(scene);
	const iFavour = b.indexOf(favour);
	const rest = b.slice(iFavour + 1);
	scene.label = 'Two Cups';
	scene.ko = '잔 둘';

	e.blocks = [
		open,
		P(
			`${MARK} He knows, because he has cut a notch for every one of them in the beam by Yuri Dora’s door. They are the days left on the king’s mourning, counted down from the morning he washed up. When they run out, the king can sign again.`,
			'계백은 이 배를 구백육십하루 동안 기다렸다. 그걸 아는 건, 유리도라의 집 문 옆 들보에 하루에 하나씩 금을 그어 왔기 때문이다. 왕의 상이 끝날 때까지 남은 날들이다. 바닷가에서 깨어난 아침부터 거꾸로 세어 왔다. 그게 다 떨어지면 왕은 다시 어보를 찍을 수 있다.'
		),
		P(
			'Every one of those nights, Yuri Dora poured two cups and told him one of the island’s stories. Gyebek heard all of them standing by the door. The second cup always went cold there.',
			'그 밤마다 유리도라는 잔 둘을 채우고 섬의 이야기를 하나씩 들려주었다. 계백은 그 이야기를 전부 문간에 선 채로 들었다. 두 번째 잔은 늘 거기서 식었다.'
		),
		...b.slice(iOpen + 1, iScene),
		scene,
		P('That night Yuri Dora pours two cups, as usual. Gyebek stands by the door, as usual. Nobody mentions the beam.', '그날 밤에도 유리도라는 잔 둘을 채운다. 계백은 여느 때처럼 문간에 선다. 들보 얘기는 아무도 꺼내지 않는다.'),
		SAY('yuridora', ['That’s the lot, Turtle. There’s not a story left on this island you haven’t had off me.'], ['거북아, 이젠 다 했저. 이 섬에 이녁이 안 들은 이야기는 하나도 엇다.']),
		SAY('gyebek', ['The fetch.', 'Tell that one again.'], ['차사 이야기.', '그것을 한 번 더 해 주십시오.']),
		SAY('yuridora', ['Kangrim, is it?', 'A magistrate sent a living man down to arrest the judge of the dead. And the judge kept him.'], ['강림이?', '원님이 산 사람을 저승에 보내 염라를 잡아 오렌 했주. 경헌디 염라가 그 사람을 붙잡아 둬 불었저.']),
		SAY('gyebek', ['The magistrate let him go.'], ['원님은 보내 주었습니까.']),
		SAY('yuridora', ['He did not. They split him between them. Sure it’s the both of them wanted him.'], ['아니. 둘이 갈라 가졌주. 둘 다 그 사람을 원했으난.']),
		SAY('gyebek', ['…Someone sent for him.'], ['…누군가는 그를 불렀군요.']),
		P(
			'Yuri Dora looks at him over the cup for a long time. Gyebek changes the subject, which he has never done before. It comes out as a question about debts.',
			'유리도라는 잔 너머로 오래 그를 바라본다. 계백이 말을 돌린다. 처음 있는 일이다. 빚에 관한 물음으로 나온다.'
		),
		ask,
		forgot,
		{ kind: 'flashback', year: '498', title: 'The Forgotten Oranges · 잊어버린 귤', blocks: tale },
		favour,
		marched,
		...rest.filter((x) => x !== marched)
	];
	const lost = b.filter((x) => !e.blocks.includes(x) && !tale.includes(x));
	if (lost.length) throw new Error(`#64 dropped ${lost.length} blocks`);
	log.push('#64 rebuilt');
}

editStory((story) => {
	heavenEarthKing(story);
	sulmun(story);
	threePrinces(story);
	stoneLady(story);
	gardener(story);
	kangrim(story);
	tribute(story);
	console.log(log.join('\n'));
	return DRY ? false : undefined;
});
