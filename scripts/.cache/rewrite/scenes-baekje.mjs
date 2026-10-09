// Scenes pass "scenes-baekje": #4 Prince Euija opens on King Mu at the sluice; #66 Descent gets Queen Eungo,
// the Rock without a king, and three maps of the eastern frontier going while Sabi drinks.
// Idempotent: each episode skips once its marker text exists. `--dry` prints without saving.
// node scripts/.cache/rewrite/scenes-baekje.mjs [--dry]
import { editStory, textOf, lists } from '../story-ops.mjs';

const DRY = process.argv.includes('--dry');

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const MAP = (year, places, routes, title, caption, ko) => ({ kind: 'map', year, places, routes, title, caption, ko });

/** Speaker chips: the colour a person already speaks in, else their CHARACTER_COLORS hex. */
const CHIPS = new Map();
const FALLBACK_CHIP = { ungo: '#c9a0a8', hyo: '#c9a86a', yung: '#d4b45a', kingmu: '#b8862c' };
const EXTRA_CHIP = '#8a8a94';
/** D('ungo', [['EN', 'KO'], …]) */
const D = (person, pairs, extra = {}) => ({
	kind: 'dialogue',
	chip: (person && (CHIPS.get(person) ?? FALLBACK_CHIP[person])) || EXTRA_CHIP,
	...(person ? { person } : {}),
	en: pairs.map((p) => p[0]),
	lines: pairs.map((p) => p[1]),
	...extra
});
/** An unprofiled extra. */
const X = (speaker, gender, pairs) => D(null, pairs, { speaker, gender });

function entry(story, chap, title) {
	const e = story.find((c) => c.id === chap)?.entries.find((x) => x.title === title);
	if (!e) throw new Error(`no entry ${chap} / ${title}`);
	return e;
}

const has = (e, frag) => lists(e).some((list) => list.some((b) => textOf(b).includes(frag)));

/** The one block (any list of the entry) whose text contains `frag`. */
function pick(e, frag, kind) {
	const hits = [];
	for (const list of lists(e))
		list.forEach((b, i) => {
			if ((!kind || b.kind === kind) && textOf(b).includes(frag)) hits.push({ list, i, b });
		});
	if (hits.length !== 1) throw new Error(`${e.title}: "${frag}" has ${hits.length} hits`);
	return hits[0];
}

function after(e, frag, blocks, kind) {
	const { list, i } = pick(e, frag, kind);
	list.splice(i + 1, 0, ...blocks);
}

function step(name, chap, title, marker, fn) {
	try {
		editStory((story) => {
			for (const c of story)
				for (const x of c.entries)
					for (const b of x.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !CHIPS.has(b.person)) CHIPS.set(b.person, b.chip);
			const e = entry(story, chap, title);
			if (has(e, marker)) {
				console.log(`${name}: already done`);
				return false;
			}
			fn(e);
			console.log(`${name}: ${DRY ? 'ok (dry)' : 'patched'}`);
			if (DRY) return false;
		});
	} catch (err) {
		console.log(`${name}: FAILED ${err.message}`);
		process.exitCode = 1;
	}
}

// ───────────────────────── #4 Prince Euija: King Mu at the sluice ─────────────────────────
step('Prince Euija', 'samhan', 'Prince Euija', 'Somebody else will have to oil it.', (e) => {
	const cite = pick(e, 'King Mu (71)', 'cite');
	cite.list.splice(cite.i, 1);

	const opening = [
		P(
			'Everyone in Baekje agrees that King Mu is a good king. Even the eight great houses say so. They are already discussing the next one.',
			'백제에서 무왕이 좋은 임금이라는 데 토를 다는 사람은 없다. 여덟 대가문조차 그렇게 말한다. 그리고 벌써 다음 임금 얘기를 하고 있다.'
		),
		SCENE('The Sluice', '봇둑'),
		P(
			'Dawn, below the walls of Sabi. Two villages share one timber sluice. This spring they have been sharing it with sticks. The king came down to look before breakfast. He is seventy-one, his sleeves are tied back, and he is up to his shins in the ditch.',
			'새벽, 사비 성벽 아래. 두 마을이 나무 봇문 하나를 같이 쓴다. 올봄엔 몽둥이까지 같이 쓰고 있다. 임금은 아침도 들기 전에 보러 내려왔다. 일흔하나, 소매를 뒤로 동여매고, 정강이까지 도랑에 잠겨 있다.'
		),
		{
			kind: 'card',
			person: 'kingmu',
			write: '武王',
			caption: 'They call him the Martial King. The villages remember the ditches.',
			ko: '사람들은 그를 굳셀 무 자, 무왕이라 부른다. 마을들은 도랑을 기억한다.'
		},
		cite.b,
		X('A Satek Steward', 'm', [
			[
				'Majesty, with respect. The upper paddies belong to the house, and the house’s fields drink first. It has always been so.',
				'전하, 황공하오나 윗논은 댁의 논이옵니다. 댁의 논이 먼저 물을 먹는 것이 예부터의 법도이옵니다.'
			]
		]),
		X('A Farmer', 'm', [
			['Always since last spring, he means. Before that we drank first.', '예부터라는 게 작년 봄부터유. 그 전엔 우리가 먼저 먹었슈.'],
			['Then his lads brought sticks, and I reckon his memory changed.', '그러다 저 댁 젊은 것들이 몽둥이를 들고 오더니, 기억이 바뀌었나 봐유.']
		]),
		D('kingmu', [
			['Ha! Sticks before breakfast. Lovely.', '하! 아침 먹기 전부터 몽둥이라. 좋구나.'],
			['Here’s the law, then. The house gets the water by day. The village gets it by night.', '그럼 법을 정해 주마. 낮엔 댁이 물을 대고, 밤엔 마을이 댄다.']
		]),
		X('A Satek Steward', 'm', [['By night, Majesty? Who works a sluice in the dark?', '밤에 말씀이옵니까, 전하? 캄캄한 데서 누가 봇문을 연단 말씀이옵니까?']]),
		D('kingmu', [['Farmers. That’s why they get the night.', '농사꾼이지. 그러니 밤을 주는 거다.']]),
		P(
			'The farmers laugh before the steward has worked it out. By the time he has, the gate is open and the king is holding out a hand for something to eat.',
			'집사가 알아듣기도 전에 농사꾼들이 먼저 웃는다. 그가 알아들었을 땐 봇문은 이미 열려 있고, 임금은 먹을 것을 달라고 손을 내밀고 있다.'
		),
		X('A Farmer', 'm', [['It’s only barley, Majesty. In a leaf, mind, so it’s proper.', '보리밥뿐이유, 전하. 그래두 잎사귀에 쌌으니께 갖출 건 갖췄슈.']]),
		D('kingmu', [['Barley’s a feast. I was raised on yams. Don’t tell the palace.', '보리면 잔치지. 난 마 캐 먹고 컸다. 궁에는 말하지 마라.']]),
		P(
			'He eats it standing in the ditch. Two village children watch him chew, in case he does something royal with it.',
			'그는 도랑에 선 채로 먹는다. 마을 아이 둘이, 혹시 임금다운 무슨 짓이라도 할까 싶어 씹는 입을 지켜본다.'
		),
		X('A Farmer', 'm', [['Your boy’ll come down and do this, Majesty? When it’s his turn?', '전하 아드님도 이렇게 내려와 주실까유? 그분 차례가 되믄?']]),
		P(
			'The king looks up the hill, past the walls, to where the palace garden is. Something up there catches the sun. An arrowhead, probably.',
			'임금은 언덕 위, 성벽 너머 궁의 후원 쪽을 올려다본다. 거기서 뭔가 햇빛에 번쩍인다. 아마 화살촉일 것이다.'
		),
		D('kingmu', [['…He’s a very good shot.', '……활은 아주 잘 쏜다.']]),
		D('herald', [
			['Majesty! Majesty— the houses are in the yard. All eight, with their boys. Early.', '전하! 전하— 가문들이 마당에 와 있사옵니다. 여덟 집 다, 아이들까지 데리고요. 일찍들 왔사옵니다.']
		]),
		D('kingmu', [['They’re always early. That’s how they get the good seats.', '늘 일찍 오지. 그래야 좋은 자리를 차지하거든.']]),
		P(
			'He climbs out slowly. Halfway up the bank he stops and looks back at the sluice. He has kept it working for thirty years. Somebody else will have to oil it.',
			'그는 천천히 도랑을 빠져나온다. 둑 중간쯤에서 멈춰 봇문을 돌아본다. 삼십 년을 그가 손봐 온 문이다. 언젠가는 다른 누가 기름을 쳐야 한다.'
		),
		P('He goes up the hill to see who.', '그는 그게 누구일지 보러 언덕을 오른다.')
	];
	e.blocks.splice(0, 0, ...opening);

	after(e, 'the way sparrows stop when a hawk goes over', [
		P('There is ditch mud to his knees. Nobody in the garden mentions it.', '무릎까지 도랑 흙이 묻어 있다. 후원의 누구도 그 얘기를 꺼내지 않는다.')
	]);
});

// ───────────────────────── #66 Descent: Eungo, the empty Rock, the eastern forts ─────────────────────────
step('Descent', 'fall-of-euija', 'Descent', 'Then she blows it out.', (e) => {
	e.blocks.splice(
		0,
		0,
		P(
			'When a kingdom falls, somebody always finds a woman to blame. Baekje had one picked out years early.',
			'나라가 무너지면 누군가는 꼭 탓할 여자를 찾아낸다. 백제는 몇 해나 앞서 하나를 골라 두었다.'
		)
	);

	// — the lamp: the queen answers "Somebody bring a light!" —
	after(e, 'Don’t you go watering it', [
		P(
			'The light comes before the wine does. Queen Eungo carries it herself, across three courtyards, in her sleeping robe. The maids find somewhere else to be.',
			'술보다 불이 먼저 온다. 왕후 은고가 손수 들고 왔다. 마당 셋을 건너, 잠옷 차림으로. 궁녀들은 각자 있을 곳을 찾아 흩어진다.'
		),
		{
			kind: 'card',
			person: 'ungo',
			write: '恩古',
			caption: 'The queen. The court has its own word for her, and it isn’t queen.',
			ko: '왕후. 조정은 그녀를 부르는 말이 따로 있다. 왕후는 아니다.'
		},
		D('ungo', [
			['They don’t water it. I do.', '물은 쟤들이 안 타요. 내가 타지.'],
			['Half and half. You stop tasting it after the second cup.', '반반. 두 잔째부턴 맛도 모르잖아요.']
		]),
		D('euija', [
			['I taste it at the first.', '첫 잔부터 알어.'],
			['…What are you doing up?', '……안 자고 뭐 혀?']
		]),
		D('ungo', [['Somebody shouted for a light. I was nearest.', '누가 불 가져오라고 소리치길래. 내가 제일 가까웠어요.']]),
		D('euija', [['You were three courtyards off.', '마당 셋 건너 있었잖여.']]),
		D('ungo', [['Then I was quick.', '그럼 빨랐네요.']]),
		P(
			'She sets the lamp where he can see her face, and sits on the edge of the bed like a woman who has done this before. She has. Most nights this year.',
			'그녀는 얼굴이 보이는 자리에 등잔을 내려놓고, 한두 번 해 본 솜씨가 아닌 듯 침상 끝에 앉는다. 한두 번이 아니다. 올해 들어 거의 매일 밤이다.'
		),
		D('euija', [['I was counting again.', '또 세고 있었지.']]),
		D('ungo', [['Nine hundred and seventy-two. Then you lose your place and start over.', '구백칠십이. 그러다 어디까지 셌는지 잊고 처음부터 다시.']]),
		P(
			'She does not ask what the number is. She was in Sabi the year a minister counted it at his door every morning.',
			'그 숫자가 뭔지 그녀는 묻지 않는다. 대신 하나가 아침마다 그의 문 앞에서 그 수를 세던 해에, 그녀도 사비에 있었다.'
		),
		D('euija', [['Where’s the boy?', '애는?']]),
		D('ungo', [
			['Asleep. Like a crown prince.', '자요. 태자답게.'],
			['He sits the Rock in the morning. Top bench. Yung’s had his robe pressed since yesterday.', '아침에 정사암에 앉아요. 맨 윗자리. 융은 어제부터 옷을 다려 놨대요.']
		]),
		D('euija', [['Yung presses his robe for funerals.', '융은 초상 때나 옷을 다리는디.']]),
		D('ungo', [['…Whose?', '……누구 초상이요?']]),
		D('euija', [['Ha! Nobody’s. Yet. Go to sleep, woman.', '하! 아무도 아녀. 아직은. 가서 자.']]),
		D('ungo', [['Come to the Rock tomorrow.', '내일 정사암에 나와요.']]),
		D('euija', [['You go.', '당신이 가.']]),
		D('ungo', [['Queens don’t sit on the Rock.', '왕후는 정사암에 못 앉아요.']]),
		D('euija', [['Then sit behind it. You hear better from behind things.', '그럼 뒤에 앉어. 뭐든 뒤에서 들어야 잘 들리는 겨.']]),
		P(
			'He means it as a compliment. It is the most important order he gives all year, and he is asleep again before the lamp gutters.',
			'그는 칭찬으로 한 말이다. 그해 그가 내린 명령 중 가장 중요한 명령인데, 등잔불이 사그라지기도 전에 그는 다시 잠든다.'
		)
	]);

	// — Gomamiji → a letter from the other direction → the Rock without a king —
	after(e, 'Nobody from Sabi writes.', [
		P(
			'Somebody does write, from the other direction. The letter comes from a hill fort east of Charcoal Pass. It is short, because the fort is gone.',
			'편지는 오긴 온다. 반대쪽에서. 탄현 동쪽 산성 하나에서 온 편지다. 짧다. 그 성이 이제 없으니까.'
		),
		MAP(657, ['sabi', 'tanhyeon'], ['silla657-hillforts'], 'The eastern forts', 'While Sabi drinks, Silla takes the hill forts one at a time.', '사비가 마시는 동안, 신라는 산성을 하나씩 가져간다.'),
		SCENE('The Rock of Politics', '정사암'),
		P(
			'The letter reaches the Rock on a morning when the Premier is in Chang’an and the king is in bed. That leaves forty-one sons and one screen.',
			'편지가 정사암에 닿은 아침, 상좌평은 장안에 가 있고 임금은 침상에 있다. 남은 건 아들 마흔하나와 병풍 하나다.'
		),
		P(
			'Behind the screen sits the queen. The king told her to, half asleep. Nobody else heard him say it.',
			'병풍 뒤에는 왕후가 앉아 있다. 반쯤 잠든 임금이 그러라고 했다. 그 말을 들은 사람은 그녀뿐이다.'
		),
		P(
			'The clerk reads standing. Nobody tells him to sit, because two princes at the far end are using the only spare cushion to settle something.',
			'서기는 선 채로 읽는다. 앉으라는 사람이 없다. 맨 끝자리 왕자 둘이 하나 남은 방석을 두고 뭔가를 결판내는 중이라서다.'
		),
		X('The Clerk', 'm', [['“…the fort at—” The name’s smudged, my lords. Something-seong.', '“……의 성이—” 이름이 번졌사옵니다, 나리들. 무슨무슨 성이옵니다.']]),
		X('Two Princes', 'm', [
			['—it was mine on the second day—', '—둘째 날엔 내 거였다니까—'],
			['—you weren’t even here on the second day—', '—너 둘째 날엔 오지도 않았잖아—']
		]),
		X('The Clerk', 'm', [['“…is lost. The garrison is—” That part’s smudged too.', '“……함락되었고, 수비병은—” 그 대목도 번졌사옵니다.']]),
		D('yung', [['Smudged. Then it was small.', '번졌다. 그럼 작은 성이군.']]),
		D('tae', [['Small, and Silla’s now. Write that. It’s shorter.', '작고, 이젠 신라 거지. 그렇게 적어. 그게 더 짧다.']]),
		P('Tae laughs at his own joke. He is the only one.', '태가 제 농담에 웃는다. 혼자다.'),
		D('hyo', [['We send men. Today. From Bear Fortress—', '군사를 보내야 하오. 오늘. 웅진성에서—']]),
		D('yung', [['Ye Sikjin’s men? He’s still sulking over his invitation.', '예식진 군사를? 그 양반 아직도 초대장 못 받은 걸로 삐쳐 있소.']]),
		D('hyo', [['The capital guard, then.', '그럼 도성 수비군을.']]),
		D('yung', [
			['Father’s guard. Ask Father.', '아버님 군사요. 아버님께 여쭙시오.'],
			['…Oh. He’s asleep. Ask your mother.', '……아, 주무시지. 그럼 그대 어머님께 여쭙시오.']
		]),
		P('Forty heads turn to the screen, then away from it, as if it were hot.', '마흔 개의 머리가 병풍 쪽으로 돌아갔다가, 데기라도 한 듯 도로 돌아간다.'),
		D('ungo', [
			['The capital guard stays in the capital.', '도성 군사는 도성에 있어야 하오.'],
			['Prince Yung. Your mother’s house keeps two thousand men on the eastern road. Lend them.', '융 왕자. 그대 외가가 동쪽 길에 군사 이천을 두고 있지요. 빌려주시오.']
		]),
		D('yung', [['My mother’s house has no bench on this Rock, Majesty. Father saw to that.', '제 외가는 이 바위에 자리가 없습니다, 마마. 아버님이 그리 만드셨지요.']]),
		D('ungo', [['Then they’ll be glad of the work.', '그럼 일거리가 생겨 반갑겠군요.']]),
		D('yung', [['…Two thousand men. And the river pilot fees go back to Satek.', '……군사 이천. 대신 강 뱃길 삯은 사택에 돌려주시지요.']]),
		D('hyo', [['Those are Father’s—', '그건 아버님의—']]),
		D('ungo', [['Done.', '그리하지요.']]),
		D('hyo', [['Mother—', '어머님—']]),
		D('ungo', [['Done, I said. Clerk, write it.', '그리하겠다 했소. 서기, 적게.']]),
		P(
			'The clerk writes it. Yung bows to the screen as though he had paid something. The screen paid more, and everyone on the Rock knows exactly how much.',
			'서기가 받아 적는다. 융은 뭔가 치른 사람처럼 병풍에 절한다. 더 많이 치른 건 병풍 쪽이고, 정사암의 모두가 그게 얼마인지 정확히 안다.'
		),
		P('The Satek men march nine days later. They arrive in time to count the smoke.', '사택의 군사는 아흐레 뒤에 떠난다. 도착해 보니 셀 수 있는 건 연기뿐이다.'),
		P(
			'At the foot of the Rock, where the benches end, an old man with an office sword and no office has listened to all of it.',
			'정사암 아래, 자리가 끝나는 곳에서, 관직 없이 관검만 찬 노인 하나가 그 모든 걸 듣고 있었다.'
		),
		D('seongchung', [['My lords. If the eastern forts go, the next thing is the pass, and after the pass—', '나리들. 동쪽 성들이 떨어지면 다음은 고개고, 고개 다음은—']]),
		D('yung', [['You don’t have a bench, Sungchung.', '성충, 그대는 자리가 없소.']]),
		D('seongchung', [['…No, my lord. I’ll take it to someone who does.', '……예, 나리. 자리가 있는 분께 가져가겠습니다.']]),
		SCENE('The Corridor', '회랑'),
		X('A Clerk', 'm', [['She gave away the pilot fees. From behind a screen.', '뱃삯을 내줬댜. 병풍 뒤에서.']]),
		X('Another Clerk', 'm', [['She did? Or the screen did?', '왕후가? 병풍이?']]),
		X('A Clerk', 'm', [['My aunt says a fox sits behind screens. A white one. Nine tails.', '우리 이모가 그러는디, 병풍 뒤엔 여우가 앉는댜. 흰 놈. 꼬리 아홉 달린.']]),
		X('Another Clerk', 'm', [['Your aunt cooks for the Satek.', '느 이모 사택 댁 부엌데기잖여.']]),
		X('A Clerk', 'm', [['Still.', '그래두.']]),
		P(
			'By the end of the month the whole palace has heard about the white fox. The queen hears it last, and laughs, which does not help.',
			'그달이 다 가기 전에 온 궁이 흰 여우 얘기를 듣는다. 왕후는 맨 나중에 듣고 웃는다. 그게 도움이 되진 않는다.'
		)
	]);

	// — the queen's rooms, the old men, and Daeya's road —
	after(e, 'It is the last recorded instance.', [
		SCENE('The Queen’s Rooms', '왕후전'),
		P(
			'Three courtyards away it is very quiet. The queen’s rooms smell of ink, not wine. The memorials the king will not open come here instead.',
			'마당 셋 건너는 아주 조용하다. 왕후전에선 술 냄새 대신 먹 냄새가 난다. 임금이 펴 보지 않는 상소들이 대신 이리로 온다.'
		),
		P(
			'She reads every one and sorts them into two baskets. The left is for things he would laugh at. The right is for things he would hate. The right basket is always fuller.',
			'그녀는 한 장도 빼지 않고 읽고, 바구니 두 개에 나눈다. 왼쪽은 그가 웃어넘길 것들, 오른쪽은 그가 질색할 것들이다. 늘 오른쪽이 더 차 있다.'
		),
		D('hyo', [['You’re reading Father’s mail again.', '또 아버님 서신을 읽으세요.']]),
		D('ungo', [['Somebody has to. Sit. You look like your father did at forty.', '누군가는 읽어야지. 앉아. 네 아버지 마흔 때 얼굴이구나.']]),
		D('hyo', [['I am forty.', '저 마흔이에요.']]),
		D('ungo', [['Then it suits you less than it suited him.', '그럼 그 양반보단 덜 어울리네.']]),
		D('hyo', [
			['Yung is telling every bench you sold the river.', '융 형님이 자리마다 다니며 어머님이 강을 팔았다고 해요.'],
			['And the kitchens are saying something worse.', '부엌에선 더 심한 말도 돌고요.']
		]),
		D('ungo', [['The fox.', '여우.']]),
		D('hyo', [['…You’ve heard.', '……들으셨어요.']]),
		D('ungo', [
			['I’m told I have nine tails. I’d settle for nine generals.', '꼬리가 아홉이라더라. 꼬리 말고 장수 아홉이면 좋겠다만.'],
			['Here. Read this one. It came from Daeya.', '자. 이거 읽어 봐. 대야성에서 온 거다.']
		]),
		X('Hyo’s Little Girl', 'f', [['Grandmother, do you have tails?', '할머니, 꼬리 있어요?']]),
		D('ungo', [['Eat your pear.', '배 먹어라.']]),
		D('hyo', [
			['“The road to Sabi is cut in two places. We have grain until the first frost. Send—”', '“사비 가는 길이 두 군데서 끊겼사옵니다. 첫서리까지 먹을 곡식은 있사오니, 보내 주—”'],
			['It stops there.', '여기서 끊겼네요.']
		]),
		D('ungo', [['They always stop there.', '늘 거기서 끊기지.']]),
		D('hyo', [['Does Father know?', '아버님은 아세요?']]),
		P('She puts the letter in the right-hand basket.', '그녀는 편지를 오른쪽 바구니에 넣는다.'),
		D('hyo', [['Mother. Do you do all this for Father, or for me?', '어머님. 이 모든 걸 아버님 위해 하세요, 저 위해 하세요?']]),
		P(
			'Somebody asked the king a question shaped like that once, on a mudbank. He is still answering it.',
			'예전에 강가 갯벌에서 누군가 임금에게 꼭 그렇게 생긴 질문을 한 적이 있다. 임금은 아직도 거기에 답하는 중이다.'
		),
		D('ungo', [['Eat something. You’ve gone grey at the mouth.', '뭐라도 좀 먹어. 입가가 허옇다.']]),
		SCENE('The Monastery', '산사'),
		P(
			'Across the city, at the monastery that belongs to neither of them, two old men have nothing to do but talk. They used to sit on the Rock. Now they hear about it.',
			'도성 건너편, 어느 쪽 것도 아닌 그 산사에서, 할 일 없는 노인 둘이 이야기를 나눈다. 둘 다 정사암에 앉던 사람들이다. 이제는 전해 듣는다.'
		),
		D('eldersatek', [['A queen behind a screen. In my grandfather’s day—', '병풍 뒤에 왕후라니. 우리 조부 때 같았으면—']]),
		D('elderyunbi', [['Your grandfather’s day had a king in the room.', '그대 조부 때는 방 안에 임금이 있었소.']]),
		D('eldersatek', [
			['…It did.', '……그랬지.'],
			['Our two thousand came home at half strength. She paid for them with my own fees.', '우리 군사 이천이 반토막으로 돌아왔소. 그 값을 내 뱃삯으로 치렀고.'],
			['Next time a fort writes, the roads will be wet.', '다음번에 성에서 편지가 오면, 길이 질 거요.']
		]),
		D('elderyunbi', [['And the fort?', '성은?']]),
		D('eldersatek', [['A small one. Let the woman lose one, and the Rock will remember who sat behind the screen when it went.', '작은 거 하나. 그 여자가 하나 잃게 두면, 그때 병풍 뒤에 누가 앉아 있었는지 정사암이 기억할 거요.']]),
		D('elderyunbi', [['Which fort?', '어느 성?']]),
		D('eldersatek', [['Does it matter? You couldn’t find it on a map.', '그게 중요하오? 지도에서 찾지도 못할 텐데.']]),
		D('elderyunbi', [['I could. I’ve just never had to walk there.', '찾을 수야 있지. 걸어가 볼 일이 없었을 뿐이오.']]),
		MAP(658, ['sabi', 'daeya'], ['silla658-daeya'], 'Daeya’s road', 'Two forts on Daeya’s road fall. Nobody in Sabi sends the men.', '대야로 가는 길목의 성 둘이 떨어진다. 사비에선 아무도 군사를 보내지 않는다.'),
		P(
			'Nobody sends them. The Satek reply that the roads are wet. On the Rock, the princes argue about whose turn it is to be blamed. In the end the queen moves the capital guard without asking anyone. They are four days late, and now the court has two things to whisper.',
			'아무도 보내지 않는다. 사택 쪽은 길이 질다고 답한다. 정사암에선 왕자들이 이번엔 누가 욕먹을 차례인지 다툰다. 결국 왕후가 누구에게도 묻지 않고 도성 수비군을 움직인다. 나흘 늦는다. 이제 조정이 수군거릴 거리가 둘이다.'
		)
	]);

	// — after the belt: the queen walks into the banquet hall —
	after(e, 'After that, nobody else tries to speak.', [
		P(
			'Somebody does, that night. The queen walks into the banquet hall for the first time in a year. The music stops by itself.',
			'그날 밤, 누군가 입을 연다. 왕후가 일 년 만에 처음 연회장에 들어선다. 풍악이 저절로 멎는다.'
		),
		D('ungo', [['Let him out.', '풀어 줘요.']]),
		D('euija', [['He told me I’d miss the tide. In front of the maids.', '조수를 놓친다더라. 궁녀들 앞에서.']]),
		D('ungo', [['Then send him where the tide is. Gomamiji, next to Heungsu. Far, and alive.', '그럼 조수 있는 데로 보내요. 고마미지, 흥수 옆으로. 멀리, 살려서.']]),
		D('euija', [['You want him gone too.', '당신도 그 사람 치우고 싶은 거구먼.']]),
		D('ungo', [['I want him alive and far. Those are two different things. You used to know that.', '살려서 멀리 두자는 거예요. 그건 다른 얘기예요. 전엔 당신도 알았잖아요.']]),
		D('euija', [['…Tomorrow. Remind me tomorrow.', '……내일. 내일 다시 말혀.']]),
		P(
			'She reminds him the next day, and the day after. By then he is asking which minister she means.',
			'그녀는 이튿날도, 그다음 날도 말한다. 그때쯤 그는 어느 대신 얘기냐고 묻는다.'
		),
		P(
			'The kitchens tell it differently. In their version the queen walked in and asked for the belt.',
			'부엌에선 다르게 전한다. 거기선 왕후가 걸어 들어와 허리띠를 벗기라고 했다.'
		)
	]);

	// — the pass in the page, and the empty Rock —
	after(e, 'and does not take it in', [
		P(
			'The page names two places. One of them is a pass. That same autumn, Silla sends men to look at it.',
			'그 글엔 두 곳이 적혀 있다. 하나는 고개다. 바로 그해 가을, 신라가 그 고개를 보러 사람을 보낸다.'
		),
		MAP(659, ['sabi', 'tanhyeon', 'gibeolpo'], ['silla659-pass'], 'Charcoal Pass', 'The pass in the page. Silla walks up to it, and nobody stops them.', '그 글에 적힌 고개. 신라가 걸어 올라와도 막는 사람이 없다.'),
		SCENE('Charcoal Pass', '탄현'),
		X('A Silla Scout', 'm', [['Oi. Anybody up here?', '어이. 여 아무도 없나?']]),
		X('Another Scout', 'm', [['Nobody. Not a fire. Not a dog.', '아무도 없다. 불도 없고, 개 한 마리 없다.']]),
		X('A Silla Scout', 'm', [['Mark it, then. How wide?', '그라믄 적어라. 폭이 얼만데?']]),
		X('Another Scout', 'm', [
			['Two carts. Three if they’re friendly.', '수레 둘. 사이 좋으면 셋.'],
			['Who builds a door this size and doesn’t lock it?', '이만한 문을 내 놓고 안 잠그는 놈이 어딨노?']
		]),
		X('A Silla Scout', 'm', [['Baekje, apparently. Write it small. The general likes small writing.', '백제지 뭐. 작게 적어라. 장군님은 글씨 작은 거 좋아하신다.']]),
		SCENE('The Empty Rock', '빈 바위'),
		P(
			'That night the queen goes to the Rock alone, with the same lamp. The Premier’s chair is empty. It has been empty since spring.',
			'그날 밤 왕후는 같은 등잔을 들고 혼자 정사암에 간다. 상좌평 자리가 비어 있다. 봄부터 비어 있다.'
		),
		D('hyo', [['Sit in it, Mother. They think you do anyway.', '앉으세요, 어머님. 어차피 다들 어머님이 앉아 계신 줄 알아요.']]),
		D('ungo', [['That’s why I don’t.', '그러니까 안 앉는 거다.']]),
		D('hyo', [['Then who does?', '그럼 누가 앉아요?']]),
		P(
			'She doesn’t answer. She holds the lamp over the chair for a while, the way you hold a light over a well to see if anything is down there. Then she blows it out.',
			'그녀는 대답하지 않는다. 우물 속에 뭐가 있나 비춰 보듯, 한동안 등잔을 의자 위로 들고 있다. 그러고는 불을 끈다.'
		),
		{
			kind: 'quote',
			hanja: '或曰 百濟自亡 由君大夫人妖女之無道 擅奪國柄 誅殺賢良 故召斯禍矣 可不愼歟 可不愼歟',
			ko: '혹자는 말한다. 백제는 스스로 망했다. 임금의 대부인, 요사한 여자가 무도하여 나라의 권세를 제멋대로 빼앗고 어질고 착한 이들을 죽였으니, 그래서 이 화를 불렀다. 삼가지 않을 수 있겠는가, 삼가지 않을 수 있겠는가.',
			html: 'Some say Baekje destroyed itself. The king’s great lady, a bewitching woman, was lawless: she seized the handle of the state and put the wise and good to death, and so called down this disaster. Can one fail to take care? Can one fail to take care?',
			source: 'Nihon Shoki (日本書紀) bk. 26, Saimei 6, 7th month, citing the Goguryeo monk Dohyeon’s Nihon Seki (日本世記)'
		},
		P(
			'A monk wrote that later, in another country. He never met her. Neither did most of the people who agreed with him.',
			'훗날 다른 나라에서 한 승려가 쓴 글이다. 그는 그녀를 만난 적이 없다. 그 글에 고개를 끄덕인 사람들 대부분도 그랬다.'
		)
	]);
});
