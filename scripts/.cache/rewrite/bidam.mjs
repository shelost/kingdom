/**
 * Bidam's Rebellion rewrite (#40–#46): the new ten-day split.
 * Run once: `node scripts/.cache/rewrite/bidam.mjs`. Each phase checks a marker and skips if already applied.
 * `DRY=1` runs every phase against a fresh load and saves nothing.
 */
import fs from 'node:fs';
import { editStory, find, lists, loadStory, textOf } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const DAYKO = ['', '첫째 날', '둘째 날', '셋째 날', '넷째 날', '다섯째 날', '여섯째 날', '일곱째 날', '여덟째 날', '아홉째 날', '열째 날'];
const DAY = (n) => ({ kind: 'day', label: `DAY ${n}`, ko: DAYKO[n] });
const card = (en, ko) => P(`<b>${en}</b>`, `<b>${ko}</b>`);
const clone = (b) => JSON.parse(JSON.stringify(b));

function helpers(story) {
	const entries = story.flatMap((c) => c.entries);
	const ep = (n) => entries[n - 1];
	const chips = { muryuk: '#8B5CF6' };
	for (const e of entries)
		for (const list of lists(e))
			for (const b of list) if (b.kind === 'dialogue' && b.person && b.chip && !chips[b.person]) chips[b.person] = b.chip;
	const D = (person, en, ko, extra = {}) => ({ kind: 'dialogue', chip: chips[person] ?? '#8a8a94', person, lines: ko, en, ...extra });
	const S = (speaker, chip, en, ko) => ({ kind: 'dialogue', chip, speaker, gender: 'm', lines: ko, en });
	/** The one top-level block matching a text fragment or predicate; throws if missing or ambiguous. */
	const get = (e, q) => {
		const hits = typeof q === 'function' ? e.blocks.filter(q) : find(e, q).filter((h) => h.list === e.blocks).map((h) => h.b);
		if (hits.length !== 1) throw new Error(`#${entries.indexOf(e) + 1}: ${hits.length} hits for ${q}`);
		return hits[0];
	};
	const flash = (e, title) => get(e, (b) => b.kind === 'flashback' && b.title === title);
	const scene = (e, label) => get(e, (b) => b.kind === 'scene' && b.label === label);
	const day = (e, n) => get(e, (b) => b.kind === 'day' && b.label === `DAY ${n}`);
	return { entries, ep, D, S, get, flash, scene, day };
}

let dry = null;
const edit = (name, fn) => {
	if (process.env.DRY) {
		dry ??= loadStory();
		const r = fn(dry);
		console.log(`${name}: ${r === false ? 'skip' : 'ok'} (dry)`);
		fs.writeFileSync('/tmp/bidam-dry.json', JSON.stringify(dry));
		return;
	}
	editStory((s) => {
		const r = fn(s);
		console.log(`${name}: ${r === false ? 'skip' : 'ok'}`);
		return r;
	});
};

/* ─────────────── Phase A: #40 rebuilt, Day 1 moved in from #42 ─────────────── */
edit('#40', (story) => {
	const { ep, D, S, get, flash, scene, day } = helpers(story);
	const e = ep(40);
	const s = ep(42);
	if (e.blocks.some((b) => b.kind === 'day')) return false;
	const g = (q) => get(e, q);
	const h = (q) => get(s, q);

	const supum = g('Old Supum is thanked for his years');
	supum.html =
		'This winter the first chair has a new occupant. Old Supum is thanked for his years and sent home, and the queen gives his seat to the one councillor who has never once told her what she wanted to hear.';
	supum.ko = '이번 겨울, 첫 자리의 주인이 바뀌었다. 늙은 수품은 그간의 노고를 치하받고 물러났고, 여왕은 그 자리를 한 번도 듣기 좋은 말을 해 준 적 없는 화백에게 내준다.';

	const room = g('Then the room turns to');
	room.html =
		'Then the room turns to the question everyone has been circling: when Her Majesty fails, who next. The Sacred Bone has thinned to one cousin. Someone says the name <b>Princess Seungman</b> the way you set a cup down that you expect everyone to drink from. She is forty-five, kind, careful with servants, and has never once surprised anybody.';
	room.ko =
		'그다음 방은 모두가 돌고만 있던 질문으로 돌아선다. 폐하가 못 하시게 되면, 다음은 누구인가. 성골은 사촌 하나로 줄어 있다. 누군가 <b>승만공주</b>라는 이름을, 모두가 마실 줄 알고 잔을 내려놓듯 말한다. 마흔다섯, 다정하고, 아랫사람에게 조심스럽고, 누구를 놀라게 한 적이 한 번도 없는 사람이다.';

	const hands = g('One by one the hands go up.');
	hands.html = hands.html.replace('serve her sister', 'serve her cousin');
	hands.ko = hands.ko.replace('그 누이도', '그 사촌도');
	const veto = g((b) => b.kind === 'diagram' && b.step === 'veto');
	veto.caption = 'Five assent, Bidam’s hand stays down. The cousin’s name cannot pass.';
	veto.ko = '다섯이 찬성하고 비담의 손이 내린다. 사촌의 이름은 통과하지 못한다.';
	const same = g('Same blood. Same house.');
	same.en[2] = 'Thirteen years ago you put her cousin on that chair yourself.';
	same.lines[2] = '열세 해 전에 그 사촌 언니를 저 자리에 올린 게 당신 아니오.';

	const father = flash(e, 'The higher teaching · 아비달마');
	const speech = father.blocks.find((b) => b.person === 'sukwon' && b.en?.includes('성즉군왕 패즉역적.'));
	const ix = speech.en.indexOf('성즉군왕 패즉역적.');
	speech.en.splice(ix, 1);
	speech.lines.splice(ix, 1);

	const stub = g('In the emptied hall the incense has burned down');
	stub.html =
		'In the emptied hall the incense has burned down to a stub. Bidam has not left the table. His fist is still on the wood, the way his father’s was on the morning he walked him to the yard.';
	stub.ko = '텅 빈 회의장에서 향은 끄트머리만 남기고 다 탔다. 비담은 아직 탁자를 떠나지 않았다. 주먹은 여전히 나무 위에 있다. 아버지가 그를 연무장까지 데려다주던 아침, 아버지의 주먹이 그랬던 것처럼.';
	const alone = D('bidam', ['…Alone, Father. Just as you said.'], ['……혼자입니다, 아버지. 말씀하신 대로.']);

	const sCard = g((b) => b.kind === 'card' && b.person === 'jinduk');
	sCard.caption = 'The queen’s cousin, and the last of the Sacred Bone.';
	sCard.ko = '여왕의 사촌이자 마지막 성골.';
	const seungmanScene = [
		D('bidam', ['You heard right, Princess. One hand. Mine.'], ['바로 들으셨습니다, 공주. 손 하나. 제 손입니다.']),
		D(
			'jinduk',
			['She can barely sit up, Bidam. The physicians say a season. Less.', 'Couldn’t you let her have one quiet winter?'],
			['언니는 앉아 있기도 힘들어, 비담. 의원들이 한 철이래. 그보다 덜.', '조용한 겨울 하나쯤은 줄 수 없었나?'],
			{ look: 'princess' }
		),
		D(
			'bidam',
			[
				'I gave her thirteen quiet winters. I put her on the chair.',
				'She was chosen because she was the cleverest. Now the room wants the nearest.',
				'Forgive me, Princess. You are kind. Kindness does not hold a pass.'
			],
			['열세 해 겨울을 조용히 드렸습니다. 그 자리에 앉혀 드린 것도 저입니다.', '그분은 가장 총명해서 뽑혔습니다. 지금 방은 가장 가까운 사람을 원하고요.', '용서하십시오, 공주. 공주는 다정하십니다. 다정함으로는 고개를 지키지 못합니다.']
		),
		D('jinduk', ['…Then who holds it? You?'], ['……그럼 누가 지키나? 자네가?'], { look: 'princess' }),
		P(
			'He bows the full bow, the one owed to the Sacred Bone, and does not answer. Seungman watches him go the way you watch weather you can’t stop.',
			'그는 성골에게 바치는 온절을 올리고, 대답하지 않는다. 승만은 막을 수 없는 날씨를 보듯 그가 가는 것을 본다.'
		)
	];

	const pack = g('Munhee packs for him.');
	pack.html =
		'Chunchu is sailing east to ask the islands for ships. Munhee packs for him. She has packed for every trip he’s ever taken. She will pack for one more. Nobody writes any of this down, which is why it needs saying.';
	pack.ko = '춘추가 섬나라에 배를 청하러 동쪽으로 간다. 문희가 그의 짐을 싼다. 그가 떠난 모든 길의 짐을 그녀가 쌌다. 한 번 더 쌀 것이다. 아무도 이걸 적어 두지 않는다. 그래서 말해 둘 필요가 있다.';
	const packIdx = e.blocks.indexOf(pack);
	const munheeTalk = e.blocks.slice(packIdx + 1, packIdx + 4);
	const haesang = g((b) => b.person === 'haesang');
	haesang.en[1] = 'And if you ever reach Chang’an — ask after a woman who finishes the emperor’s sentences. Merchants hear weather early.';
	haesang.lines[1] = '언젠가 장안에 가시거든 — 황제 문장을 끝내는 여인을 물어보십시오. 상인은 날씨를 일찍 듣습니다.';
	const harbour = P(
		'At the harbour the wine merchant Haesang sees him off with advice nobody asked for.',
		'포구에서 술 상인 해상이 아무도 청하지 않은 조언을 들고 그를 배웅한다.'
	);

	const why = g('Why wasn’t this told to the Council?');
	why.en[2] = '…your nephew…';
	why.lines[2] = '…폐하의 조카일 뿐…';
	const lie = g('I-I need to lie down');
	lie.en = ['Lord Bidam… I-I need to lie down…'];
	lie.lines = ['비담 공… 나, 나 좀 누워야겠네…'];
	const falls = P('She tries to stand and doesn’t finish. Bidam catches her before the floor does.', '그녀는 일어서려다 끝내 일어서지 못한다. 바닥보다 비담이 먼저 그녀를 받는다.');
	const guards = g('THE QUEEN IS DOWN');
	guards.en = ['Y-Your Majesty! GUARDS! THE QUEEN IS DOWN!'];
	guards.lines = ['폐, 폐하! 게 누구 없느냐! 폐하께서 쓰러지셨다!'];

	const politely = g('receives him politely');
	politely.html = 'Across the sea, Chunchu has no idea. The King of the East receives him politely, which is its own kind of answer.';
	politely.ko = '바다 건너, 춘추는 아무것도 모른다. <b>왜왕</b>이 그를 정중히 맞는다. 그 정중함 자체가 하나의 대답이다.';

	const chest = g('takes the old black headband out of the chest');
	chest.html =
		'That night Bidam takes the old black headband out of the chest where he keeps it. There is still blood on it, gone brown with the years. Two seniors’ noses, the first morning on the yard.';
	chest.ko = '그날 밤 비담은 궤짝에서 낡은 검은 머리띠를 꺼낸다. 아직도 피가 묻어 있다. 세월이 흘러 갈색으로 변한 피다. 연무장 첫 아침, 선배 둘의 코피다.';
	const gave = g('I gave this to that boy');
	gave.en[0] = '…I offered this to that boy, back then.';
	gave.lines[0] = '…그때 이걸 그 애한테 내밀었지.';

	const shout = g('THE QUEEN IS DEAD');
	const pause = shout.en.indexOf('(pauses)');
	if (pause >= 0) {
		shout.en.splice(pause, 1);
		shout.lines.splice(pause, 1);
	}

	const summer = g('Last summer it was Chang’an');
	summer.en[0] = 'The islands, now. Last summer it was the emperor’s war.';
	summer.lines[0] = '이번엔 섬나라랍니다. 지난여름엔 황제의 전쟁이었고.';
	const thirty = flash(e, 'Thirty thousand · 삼만');
	thirty.blocks = thirty.blocks.filter((b) => b.kind !== 'quote');

	// Day 1, from #42
	const sick = h('is in critical condition');
	sick.html = '<b>Queen Sunduk</b> is in critical condition. The Eastern Palace smells of medicine and of a succession nobody has settled.';
	sick.ko = '<b>선덕여왕</b>이 위독하다. 동궁에는 약 냄새와, 아무도 정하지 못한 후계의 냄새가 난다.';
	const muster = h('raise men at the Fortress of Radiance');
	muster.html +=
		' Bidam ties on the old one, brown stain and all.';
	muster.ko += ' 비담은 그 낡은 것을, 갈색 얼룩째로 맨다.';
	const slogan = h('the room said it the year she was crowned');
	const sloganScene = [
		D(
			'yumjong',
			['Put it on the banner. ‘A woman cannot rule well.’', 'The men in the outer works don’t march for councils. They’ll march for that.'],
			['깃발에 쓰시지요. ‘여주는 능히 잘 다스리지 못한다.’', '외성 군사들은 회의를 위해 행군하지 않습니다. 이걸 위해선 합니다.']
		),
		D('bidam', ['I crowned a woman, Yumjong. I stood up in that room and did it.'], ['나는 여인을 왕으로 세운 사람이오, 염종. 그 방에서 일어서서.']),
		D('yumjong', ['Then you know exactly what the slogan is worth.'], ['그럼 그 구호가 얼마짜린지 정확히 아시겠군요.']),
		D(
			'bidam',
			['…女主不能善理. The room said it the year she was crowned and pretended it was weather.', 'Put it up. Let them march for the weather.', 'We won’t storm the palace. We wait.'],
			['……女主不能善理. 여주가 즉위하던 해에 방이 그렇게 말했고, 날씨인 척했지.', '올리시오. 날씨를 위해 행군하라지.', '궁은 치지 않소. 기다리오.']
		),
		D('yumjong', ['For what?'], ['뭘 말입니까?']),
		D(
			'bidam',
			[
				'Ten days of grain in there. On the tenth morning the gate opens from the inside.',
				'The Council sits with every chair full, and the succession goes back to the room where it belongs.'
			],
			['저 안엔 열흘 치 곡식이 있소. 열째 날 아침, 문은 안에서 열리오.', '화백은 빈자리 없이 앉고, 후계는 그것이 정해져야 할 방으로 돌아가오.']
		)
	];
	const s0 = s.blocks.indexOf(day(s, 1));
	const s1 = s.blocks.indexOf(day(s, 2));
	const day1 = s.blocks.slice(s0, s1).flatMap((b) => (b === slogan ? sloganScene : [b]));
	s.blocks = s.blocks.slice(s1);

	const OFFICER = (en, ko) => S('A young rebel officer', '#8a8a94', en, ko);
	const gayaScene = [
		SCENE('Dusk on the Wall', '성벽의 해 질 녘'),
		P(
			'By dusk Yumjong’s men have found a word they like. They shout it across the field at the blue lines, the way boys throw stones at a dog to see if it bites. Gaya.',
			'해 질 녘, 염종의 군사들은 마음에 드는 말 하나를 찾았다. 그들은 그 말을 들판 건너 푸른 대열에 대고 외친다. 개가 무는지 보려고 돌을 던지는 아이들처럼. 가야.'
		),
		P('On the rampart a young officer brings Bidam his rice. The black headband on him is an hour old. So is his nerve.', '성벽 위에서 젊은 장교 하나가 비담에게 밥을 가져온다. 그가 맨 검은 머리띠는 한 시진째다. 그의 배짱도 그렇다.'),
		OFFICER(['Councillor— forgive me.', 'What is Gaya, anyway? My father says it was a kind of iron.'], ['상대등— 송구합니다만.', '가야가 대체 뭡니까? 아버지는 쇠의 한 종류라고 하던데요.']),
		D(
			'bidam',
			[
				'Your father isn’t wrong.',
				'Six harbours down the southern river, selling iron to anyone with rice. Us. Baekje. The islands. Enemies included.',
				'No one king. Six chiefs and a great deal of arguing. Rather like our Council, only richer.'
			],
			['네 아비 말이 틀리진 않다.', '남쪽 강 아래 포구 여섯. 쌀만 있으면 누구에게나 쇠를 팔았지. 우리, 백제, 섬나라. 적까지.', '왕 하나가 없었다. 우두머리 여섯과 끝없는 말다툼. 우리 화백과 비슷하지. 더 부자였을 뿐.']
		),
		OFFICER(['And they lost?'], ['그리고 졌습니까?']),
		D(
			'bidam',
			['They were bought. One harbour at a time.', 'The Marshal’s great-grandfather drove the oldest one to Surabol in a cart and set his crown on our king’s floor.'],
			['팔렸지. 포구 하나씩.', '대장군의 증조부가 제일 오래된 포구를 수레에 싣고 서라벌로 와서, 왕관을 우리 임금 앞 바닥에 내려놓았다.']
		),
		OFFICER(['Then why does it still—'], ['그런데 왜 아직도—']),
		D(
			'bidam',
			[
				'Sting?',
				'Because they have a better story than we do.',
				'Their first king came down out of the sky in a golden egg. His queen sailed in from the end of the world under a red sail.',
				'We tell our beginnings at funerals. They tell theirs at weddings.'
			],
			['아프냐고?', '저쪽 이야기가 우리 것보다 낫기 때문이다.', '저쪽 첫 임금은 금빛 알에 담겨 하늘에서 내려왔다. 왕비는 세상 끝에서 붉은 돛을 달고 왔고.', '우리는 시작 이야기를 장례 때 한다. 저쪽은 혼례 때 한다.']
		),
		P(
			'Below the wall his horse, Bisamun, shifts in the lines. Across the field, under the blue banners, a man with Gaya eyes is not shouting back.',
			'성벽 아래 진영에서 그의 말 비사문이 몸을 뒤척인다. 들판 건너 푸른 깃발 아래, 가야의 눈을 가진 사내 하나는 맞받아 소리치지 않는다.'
		),
		card('A sky that looks too long at a mountain. Six eggs. A red sail. Here is how Gaya began…!', '산을 너무 오래 내려다본 하늘. 알 여섯. 붉은 돛. 가야는 이렇게 시작됐다…!')
	];

	const range = (from, to) => {
		const a = e.blocks.indexOf(g(from));
		const b = e.blocks.indexOf(g(to));
		if (a < 0 || b < a) throw new Error(`#40 range ${from}…${to}`);
		return e.blocks.slice(a, b + 1);
	};
	const council = scene(e, 'The Harmony Council');
	const alchunDoor = scene(e, 'Alchun’s Door');
	const chamber = e.blocks[e.blocks.indexOf(g('Bidam hears it from a harbour clerk')) - 1];
	const eastern = scene(e, 'The Eastern Court');
	const map = g((b) => b.kind === 'map');
	const thatNight = scene(e, 'That Night');
	const moon = scene(e, 'The Moon Palace');
	const yumjong = scene(e, 'Yumjong');
	const gate = scene(e, 'Princess Seungman');

	e.blocks = [
		P('The Harmony Council has one rule. Nothing moves unless the circle closes. Everyone agrees, or nobody goes home.', '화백회의의 규칙은 하나다. 원이 닫히지 않으면 아무것도 움직이지 않는다. 모두 찬성하거나, 아무도 집에 못 간다.'),
		council,
		supum,
		g((b) => b.kind === 'card' && b.person === 'bidam'),
		g('still decide only by unanimity'),
		room,
		...range('One by one the hands go up.', 'A country is not a score'),
		e.blocks[e.blocks.indexOf(g('A country is not a score')) + 1],
		stub,
		alone,
		father,
		gate,
		g('Princess Seungman catches him at the palace gate'),
		sCard,
		g('What is this I hear?'),
		...seungmanScene,
		...e.blocks.slice(e.blocks.indexOf(alchunDoor), e.blocks.indexOf(chamber)),
		SCENE('The Harbour', '포구'),
		pack,
		...munheeTalk,
		harbour,
		haesang,
		...e.blocks.slice(e.blocks.indexOf(chamber), e.blocks.indexOf(lie) + 1),
		falls,
		guards,
		e.blocks[e.blocks.indexOf(guards) + 1],
		eastern,
		map,
		politely,
		...e.blocks.slice(e.blocks.indexOf(politely) + 1, e.blocks.indexOf(g((b) => b.person === 'kuromaro')) + 1),
		...e.blocks.slice(e.blocks.indexOf(thatNight), e.blocks.indexOf(yumjong) + 1).filter((b) => b !== map),
		...e.blocks.slice(e.blocks.indexOf(yumjong) + 1, e.blocks.indexOf(summer) + 1),
		thirty,
		...e.blocks.slice(e.blocks.indexOf(summer) + 1, e.blocks.length - 1),
		...day1,
		...gayaScene
	];
	if (new Set(e.blocks).size !== e.blocks.length) throw new Error('#40: duplicated block');
	e.logline = {
		en: 'Bidam takes the Council’s first chair and keeps his hand down alone against the queen’s cousin. The queen falls, the gate shuts, and on the first day the black headbands go up on the Radiance wall.',
		ko: '비담은 화백의 첫 자리에 앉아, 홀로 여왕의 사촌에게 손을 내리지 않는다. 여왕이 쓰러지고 문이 닫히고, 첫째 날 명활성 성벽에 검은 머리띠가 오른다.'
	};
});

/* ─────────────── Phase B: #41 Suro trims, tail returns to Day 2 ─────────────── */
edit('#41', (story) => {
	const { ep, get } = helpers(story);
	const e = ep(41);
	if (e.blocks.some((b) => b.kind === 'day')) return false;
	const g = (q) => get(e, q);
	const look = g('Before the sons, there is a look from very high up.');
	look.html = look.html.replace('Before the sons, there is a look from very high up. ', '');
	look.ko = look.ko.replace('아들들보다 먼저, 아주 높은 곳에서의 시선이 있다. ', '');
	const births = g('give birth to two sons');
	births.html = 'Their eggs fall to earth on a hill called Guji, and wait for someone to sing.';
	births.ko = '그 알들은 구지라는 언덕에 떨어져, 누군가 노래해 주기를 기다린다.';
	const box = g('box of six eggs');
	box.html = 'The people dig where the song tells them and find a box of six eggs, gold as the sun. Six babies hatch. The first one out is Suro. Each of the six founds a harbour kingdom:';
	box.ko = '사람들이 노래가 시킨 곳을 파서 해처럼 누런 알 여섯이 든 궤짝, 알 여섯 개가 든 상자를 찾아낸다. 아기 여섯이 깨어난다. 맨 먼저 나온 아이가 수로다. 여섯은 저마다 포구 나라 하나씩을 세운다:';
	const answer = g('Six. In a box. From the sky.');
	delete answer.person;
	answer.speaker = 'A villager';
	answer.gender = 'm';
	answer.chip = '#8a8a94';
	e.blocks = e.blocks.filter((b) => b.kind !== 'verse' && !(b.kind === 'map' && b.year === 42));
	const last = e.blocks[e.blocks.length - 1];
	if (!/^<b>Ten days of grain/.test(last.html ?? '')) throw new Error('#41 card not found');
	e.blocks.splice(
		e.blocks.length - 1,
		1,
		P(
			'Her sons have her eyes, the colour of the far side of the sea. Gaya will marry into Silla and lose almost everything else. The eyes keep turning up anyway, a generation here and there, like a word nobody can quite translate.',
			'아들들은 그녀의 눈을 닮았다. 바다 저편의 빛깔이다. 가야는 신라와 혼인하며 거의 모든 것을 잃을 것이다. 그래도 그 눈은 한 대 걸러 한 번씩 다시 나타난다. 아무도 똑바로 옮기지 못하는 낱말처럼.'
		),
		DAY(2),
		P(
			'Back on the Radiance road, the second morning comes up grey. Nine days of grain behind the palace gate. Bidam sends a runner across the field with a folded note. It says one word: tea.',
			'다시 명활성 길. 둘째 날 아침이 잿빛으로 밝는다. 궁문 안에는 아흐레 치 곡식. 비담이 전령을 시켜 들판 건너로 접은 쪽지를 보낸다. 쪽지엔 한 글자뿐이다. 차.'
		),
		card('Nine days of grain. One folded note. Will the Marshal of Silla come to tea with a traitor…?', '아흐레 치 곡식. 접힌 쪽지 하나. 신라의 대장군은 역적과 차를 마시러 올 것인가…?')
	);
});

/* ─────────────── Phase C: #42 Seung, Days 2–5, ends on the grandfather ─────────────── */
edit('#42', (story) => {
	const { ep, D, get, flash, day } = helpers(story);
	const e = ep(42);
	if (find(e, 'Of course he comes.').length) return false;
	const g = (q) => get(e, q);

	const pav = g('Between the camps a small pavilion goes up');
	pav.html =
		'Of course he comes. Yushin has never once refused Bidam a rematch. Between the camps a small pavilion goes up, open on every side, so nobody can say the other side hid archers. A low table. Tea already poured. A half moon in an empty sky. They meet the way they used to after sparring: gloves off, courtesy on.';
	pav.ko =
		'물론 그는 온다. 유신은 비담의 재대결 청을 한 번도 거절한 적이 없다. 두 진영 사이에 사방이 트인 작은 정자가 선다. 어느 쪽도 상대가 궁수를 숨겼다고 말하지 못하게. 낮은 탁자 하나. 차는 이미 따라져 있다. 빈 하늘에 반달. 그들은 예전 대련이 끝난 뒤처럼 만난다. 장갑은 벗고, 예의는 갖추고.';
	const d2 = day(e, 2);
	if (e.blocks[0] !== d2) throw new Error('#42 should open on DAY 2');

	const three = g('Three Hwarang. One princess.');
	e.blocks.splice(
		e.blocks.indexOf(three),
		0,
		D('bidam', ['Alchun sends his regards. From the middle of the field.', 'He’s eating alone again.'], ['알천이 안부 전하더군. 들판 한가운데서.', '또 혼자 먹고 있어.']),
		D('yushin', ['He always did eat between us.'], ['그분은 늘 우리 둘 사이에서 먹었소.'])
	);
	const clever = flash(e, 'The cleverest of the three');
	clever.blocks = clever.blocks.filter((b) => !(b.kind === 'p' && (b.html ?? '').includes('Sadaham')));
	const joke = clever.blocks.findIndex((b) => b.person === 'alchun');
	clever.blocks.splice(
		joke + 1,
		0,
		D('sunduk', ['If you three are finished deciding my life—', 'the ball is still on the field.'], ['셋이서 내 인생 다 정했으면—', '공은 아직 마당에 있어.'], { look: 'princess' })
	);

	const arrows = g('Arrows trade; messengers lie');
	arrows.html += ' Inside the palace, the stewards count eight days of grain.';
	arrows.ko += ' 궁 안에서 집사들은 여드레 치 곡식을 센다.';

	const jade = flash(e, 'Jade Gate Valley · 옥문곡');
	const [j0, j1, , j3] = jade.blocks;
	j0.html =
		'Baekje sends five hundred armoured men to slip through a valley in the dark and bite a fortress from behind. In midwinter the toads in the palace pond start croaking, which toads do not do. The queen listens for one night. Then she sends steel instead of prayers.';
	j0.ko = '백제가 갑옷 입은 오백 명을 보낸다. 어둠을 틈타 골짜기를 지나, 성 하나를 뒤에서 물어뜯으라고. 한겨울에 궁 연못의 두꺼비들이 울기 시작한다. 두꺼비는 겨울에 울지 않는다. 여왕은 하룻밤을 듣는다. 그리고 기도 대신 칼을 보낸다.';
	j1.en[1] = 'If their captain loosens a saddle, we do not wait for a committee.';
	j1.lines[1] = '저쪽 장수가 안장을 풀면, 위원회를 기다리지 않는다.';
	j3.html = 'They fall on the Baekje camp at dusk. Their captain climbs a boulder and empties a quiver; the quiver ends before the argument does. Alchun takes the general. Bidam takes the valley’s silence.';
	j3.ko = '해 질 녘 백제 진영을 덮친다. 저쪽 장수는 큰 돌 위에 올라가 화살을 비운다. 화살이 먼저 바닥난다. 알천이 장군을 잡고, 비담이 골짜기의 침묵을 갖는다.';
	const okmun = jade.blocks.find((b) => (b.html ?? '').includes('Okmun-gok'));
	if (okmun) okmun.html = okmun.html.replace('Okmun-gok', 'the Jade Gate');

	const bupmin = g('keep him talking');
	bupmin.html = bupmin.html.replace('<b>Bupmin (21)</b>', 'his son <b>Bupmin</b>, twenty-one,');
	bupmin.ko = bupmin.ko.replace('<b>법민 (21)</b>을', '스물한 살 아들 <b>법민</b>을');
	const islands = g('home from the islands');
	islands.html = 'Chunchu is home from the islands. They kept him just long enough to be rude about it, then sent him back with compliments and no ships.';
	islands.ko = '춘추는 섬에서 돌아왔다. 섬나라는 무례하다 싶을 만큼만 그를 붙잡아 두었다가, 칭찬만 들려 배 한 척 없이 돌려보냈다.';

	const wells = g('wells drop');
	wells.html = 'Seven days of grain. ' + wells.html;
	wells.ko = '이레 치 곡식. ' + wells.ko;

	const haedong = g('First, even, in all of Haedong');
	haedong.en = ['Under Seungman, with these reforms, Silla could be the strongest country in Samhan in a few harvests.'];
	haedong.lines = ['승만공주 아래 이 개혁이 서면, 몇 해 안에 신라가 삼한에서 제일 강한 나라가 될 수 있소.'];
	const tenli = g('Surabol is scarcely ten square miles');
	tenli.en = ['Yushin.', 'Has the royal house spent one year outside the capital? Has Chunchu?', 'I have.', 'Out there, nobody wants a foreign emperor’s yoke.'];
	tenli.lines = ['유신.', '왕실이 도성 밖에서 한 해라도 살아 봤느냐. 춘추가?', '나는 살아 봤다.', '저 밖에선 아무도 남의 황제 멍에를 원하지 않는다.'];
	const hyuk = g('Surabol is where Hyukgosé was crowned');
	hyuk.en = [
		'As for outsiders, Lord Bidam, I will always be more outsider than you.',
		'You, of Six-Elder blood, speak poorly of the halls that raised this land,',
		'while I, last son of a conquered kingdom, would die for it.'
	];
	hyuk.lines = ['바깥사람 이야기로 치자면, 비담 공, 바깥사람은 평생 공이 아니라 나일 것이오.', '육촌의 피를 이은 공은 이 땅을 일군 집들을 그리 얕보는데,', '정복당한 나라의 막내아들인 나는 이 땅을 위해 죽을 각오가 돼 있소.'];
	const jar = g('Bupmin’s jar ticks once');
	jar.html = jar.html.replace('Behind the 정자', 'Behind the pavilion');
	const once = g('That ten-mile story. Once more.');
	once.en = ['Bidam.', 'Say it once more.', 'The people have no wish for an emperor. Where did you hear that?'];
	once.lines = ['비담.', '한 번만 더 말해 보시오.', '백성이 황제를 원치 않는다. 그 말은 어디서 들었소?'];
	e.blocks = e.blocks.filter((b) => !(b.kind === 'quote' && (b.hanja ?? '').startsWith('菩提薩埵')));
	const packed = g('I packed the year the Queen was crowned');
	packed.lines = ['이미 쌌어요.', '여왕께서 즉위하시던 해에 쌌어요. 당신은 포위 때만 눈치채시죠.'];

	const fifth = g('Fifth night — the pavilion again');
	fifth.html += ' Six days of grain.';
	fifth.ko += ' 엿새 치 곡식.';
	const score = flash(e, 'One hundred and eight');
	const [, s1, s2, , s4] = score.blocks;
	s1.en = ['One hundred and eight…!', 'Today I take the lead, Gaya!'];
	s1.lines = ['백팔…!', '오늘은 내가 앞선다, 가야!'];
	s2.en = ['One hundred and eight.', 'Get up, hyung. An uneven number does not sleep.'];
	s2.lines = ['백팔.', '일어나시오, 형님. 기우는 숫자는 밤에 못 자오.'];
	s4.en = ['Written or not.', 'Again.'];
	s4.lines = ['적히든 말든.', '다시.'];
	score.blocks.splice(4 + 1, 0, D('bidam', ['…And don’t call me hyung when you’re winning.'], ['……그리고 이길 때는 형님 소리 하지 마라.']));
	e.blocks.splice(e.blocks.indexOf(score), 1);
	e.blocks.splice(e.blocks.indexOf(g('only the old score again')) + 1, 0, score);

	const last = e.blocks[e.blocks.length - 1];
	if (!(last.html ?? '').startsWith('<b>“You were never even of Silla.”')) throw new Error('#42 card not found');
	e.blocks.splice(
		e.blocks.length - 1,
		1,
		P('Yushin does not answer the speech. He looks at the cold tea as if the answer were at the bottom of the cup.', '유신은 그 연설에 대답하지 않는다. 답이 잔 바닥에 있기라도 한 듯 식은 차를 내려다본다.'),
		D(
			'bidam',
			['Yumjong says your great-grandfather drove Geumgwan to Surabol in a cart.', 'Fine. Everyone knows the cart.', 'Nobody talks about the grandfather. What did he hand over, Yushin?'],
			['염종 말로는 네 증조부가 금관을 수레에 싣고 서라벌에 왔다더군.', '좋아. 수레 이야기야 다 알지.', '할아버지 이야기는 아무도 안 해. 그분은 뭘 넘겼나, 유신?']
		),
		D('yushin', ['Leave the dead in their rooms, Bidam.'], ['죽은 사람은 제 방에 두시오, 비담.']),
		D(
			'bidam',
			['No.', 'Five nights you’ve drunk my tea and told me nothing that was yours.', 'Give me one thing. Then call me a traitor.'],
			['아니.', '닷새 밤을 내 차를 마시면서, 네 것은 하나도 말하지 않았다.', '하나만 내놔. 그다음에 역적이라 불러.']
		),
		P(
			'For a long time the only sound is the wind through the open pavilion. Yushin has not said this aloud in Surabol since he was fifteen.',
			'한참 동안, 트인 정자를 지나는 바람 소리뿐이다. 유신은 열다섯 이후로 서라벌에서 이 이야기를 입 밖에 낸 적이 없다.'
		),
		D(
			'yushin',
			['…Baekje has a name for one night on the Gwansan road.', 'Ask any soldier over the western hills. They call it the Severing.'],
			['……백제에는 관산성 길의 어느 밤을 부르는 이름이 있소.', '서쪽 고개 너머 아무 군사에게나 물어보시오. 단이라 부르지.']
		),
		D('bidam', ['The night their king lost his head. Everyone knows it. A slave held the knife.'], ['그쪽 임금이 목을 잃은 밤. 다 아는 얘기다. 칼은 노비가 들었지.']),
		D(
			'yushin',
			['A slave held the knife.', 'A man in a Gaya cone helm sat their king on a camp stool and told him to sit.', '…That was my grandfather.'],
			['칼은 노비가 들었소.', '가야 고깔 투구를 쓴 사내가 그쪽 임금을 호상에 앉히고, 앉으라 했소.', '……그게 내 할아버지요.']
		),
		P('Bidam’s beads stop for the second time this winter.', '비담의 염주가 올겨울 들어 두 번째로 멈춘다.'),
		D('bidam', ['…A Gaya prince broke the oldest peace in Samhan.', 'For us.'], ['……가야 왕자가 삼한에서 가장 오래된 화친을 끊었다.', '우리를 위해.']),
		D(
			'yushin',
			['For Silla.', 'And his grandson sits at your table and hears he was never of it.'],
			['신라를 위해서요.', '그리고 그 손자가 공의 상에 앉아, 애초에 신라 사람이 아니었다는 말을 듣고 있소.']
		),
		D('bidam', ['…Drink your tea, Marshal.'], ['……차나 마셔라, 대장군.']),
		P(
			'Neither of them drinks. Bidam does not ask the grandfather’s name, and Yushin does not offer it. Some names a family keeps in a box.',
			'둘 다 마시지 않는다. 비담은 그 할아버지의 이름을 묻지 않고, 유신도 말하지 않는다. 어떤 이름은 집안이 상자에 넣어 둔다.'
		),
		card('A cone helm, a king on a camp stool, and a name Yushin won’t say. Who was his grandfather…?', '고깔 투구, 호상에 앉은 임금, 그리고 유신이 입에 올리지 않는 이름. 그의 할아버지는 누구였나…?')
	);
	e.logline = {
		en: 'Five nights of tea between the camps, and a score still tied. On the fifth, Bidam asks the one question Yushin has never answered in Surabol.',
		ko: '두 진영 사이에서 닷새 밤의 차, 점수는 아직 동점. 다섯째 밤, 비담은 유신이 서라벌에서 한 번도 답하지 않은 질문을 던진다.'
	};
});

/* ─────────────── Phase D: #43 Muryuk, a whole life, back to Day 6 ─────────────── */
edit('#43', (story) => {
	const { ep, D, get, scene } = helpers(story);
	const e = ep(43);
	const sh = ep(45);
	if (find(e, 'His name was Muryuk.').length) return false;
	const g = (q) => get(e, q);
	const grand = get(sh, (b) => b.kind === 'quote' && (b.hanja ?? '').startsWith('祖武力'));
	sh.blocks.splice(sh.blocks.indexOf(grand), 1);
	for (const b of e.blocks) if (b.person === 'muryuk') delete b.look;

	const peace = g('For five hundred years the people of Gaya lived by iron');
	peace.html += ' Then Silla came shopping.';
	peace.ko += ' 그러다 신라가 장을 보러 왔다.';
	const vanguard = g('The vanguard thought otherwise.');
	vanguard.html = 'The boy took his prize anyway. After the city fell he opened the prize-cages and kept only Alcheon dirt. Take the land. Leave the people.';
	vanguard.ko = '소년은 그래도 상을 받았다. 성이 떨어진 뒤 상으로 받은 우리를 열고 알천의 박토만 받았다. 땅은 가져라. 사람은 놔둬라.';
	const nameBlocks = [g('Then he says a name nobody has been given yet.'), g((b) => b.person === 'muryuk' && b.en?.[0] === 'Yushin…')];

	e.blocks = [
		P('His name was Muryuk. He was the youngest of three sons in a cart, and the only one who looked back.', '그의 이름은 무력이었다. 수레에 탄 세 아들 중 막내였고, 뒤를 돌아본 건 그 하나뿐이었다.'),
		g((b) => b.kind === 'map'),
		peace,
		scene(e, 'The Surrender'),
		P(
			'The lord of Geumgwan did the arithmetic first. Baekje to the west, Silla to the north, a river of iron and no army worth the name.',
			'금관의 임금이 먼저 셈을 했다. 서쪽엔 백제, 북쪽엔 신라. 쇠의 강은 있는데 군대라 할 만한 것은 없다.'
		),
		g((b) => b.kind === 'quote' && (b.hanja ?? '').startsWith('金官國主')),
		g((b) => b.kind === 'card' && b.person === 'muryuk'),
		P('The king on the dais has bought harbours before. He has never bought one that talks back.', '단 위의 임금은 포구를 사 본 적이 있다. 말대꾸하는 포구를 사 본 적은 없다.'),
		g('If we are to surrender, I have one condition'),
		g('And what do you mean by that?'),
		g('Sacred Bone, True Bone'),
		g('Your descendants shall be raised as True Bones'),
		D(
			'beopheung',
			['In return you ride for me. North, west. Wherever the border itches.', '…Even south.'],
			['대신 자네는 나를 위해 말을 타야 하네. 북으로, 서로. 국경이 가려운 곳이면 어디든.', '……남으로도.']
		),
		D('muryuk', ['…Even south.'], ['……남으로도.']),
		g('Three generations later'),
		g('Your grace is boundless'),

		SCENE('The Night Road', '밤길'),
		P(
			'Twenty-two years later he is a Silla governor in a Gaya helm, because nobody has managed to make him take it off. One night on the Gwansan road, the King of Baekje rides into his ditch.',
			'스물두 해 뒤, 그는 가야 투구를 쓴 신라 군주다. 아무도 그 투구를 벗기지 못했다. 관산성 길의 어느 밤, 백제 임금이 그의 도랑으로 말을 몰아 들어온다.'
		),
		P(
			'You have seen that night from the king’s side. From the cone’s side it is shorter. A man who once begged at a king’s feet sits another king on a camp stool and does not draw his sword. The slave does the rest.',
			'그 밤은 임금 쪽에서 이미 보았다. 고깔 쪽에서 보면 더 짧다. 한때 임금의 발치에서 청하던 사내가 다른 임금을 호상에 앉히고, 칼을 뽑지 않는다. 나머지는 노비가 한다.'
		),
		grand,
		P('Ten thousand heads, says the record, and makes him a hero. He goes home and does not eat for two days.', '만 급이라고 기록은 말하고, 그를 영웅으로 만든다. 그는 집에 가서 이틀을 먹지 않는다.'),

		SCENE('The Last Gate', '마지막 성문'),
		P(
			'Eight years after that, the Cloud King comes for what is left of Gaya. He brings a boy-general, Sadaham. He brings Muryuk.',
			'그로부터 여덟 해 뒤, 구름왕이 남은 가야를 치러 온다. 소년 장수 사다함을 데리고. 그리고 무력을 데리고.'
		),
		g('They said too young.'),
		g('Don’t die first.'),
		g('Then keep up.'),
		P(
			'The tall Gaya cone still fights. The men on Daegaya’s gate wear the same helm Muryuk does.',
			'높은 가야 고깔은 아직 싸운다. 대가야 성문 위의 사내들은 무력과 같은 투구를 썼다.'
		),
		D('muryuk', ['Those are my father’s helms.', 'Let me walk up first. Alone.'], ['저건 내 아버지의 투구다.', '먼저 올라가게 해 다오. 혼자.']),
		D('sadaham', ['They’ll shoot you.'], ['쏠 텐데요.']),
		D('muryuk', ['Then keep the gate warm for me.'], ['그럼 성문이나 데워 둬라.']),
		P(
			'He walks to the gate with his helm in his hand. Nobody on the wall knows what to do with a Gaya face under a Silla banner. By the time they decide, he is talking. Gaya has always listened to a good price.',
			'그는 투구를 손에 들고 성문으로 걸어간다. 성벽 위 누구도 신라 깃발 아래의 가야 얼굴을 어찌해야 할지 모른다. 그들이 정하기도 전에 그는 말을 하고 있다. 가야는 언제나 좋은 값에는 귀를 기울였다.'
		),
		g((b) => b.kind === 'quote' && (b.hanja ?? '').startsWith('九月')),
		vanguard,
		g((b) => b.person === 'sadaham' && b.en?.[0] === 'Alcheon dirt.'),
		P('Muryuk watches the cages open and says nothing. It is the first Silla habit he has ever liked.', '무력은 우리가 열리는 것을 보며 아무 말도 하지 않는다. 처음으로 마음에 드는 신라의 버릇이다.'),

		SCENE('The Name', '이름'),
		P(
			'He grows old in Surabol with a True Bone seal and a Gaya accent he never loses. His son Seohyun is clever and polite, and keeps walking into things while looking at clouds.',
			'그는 진골의 인장과 끝내 버리지 못한 가야 말씨로 서라벌에서 늙는다. 아들 서현은 영리하고 예의 바르며, 구름을 보다가 자꾸 무언가에 부딪힌다.'
		),
		D(
			'muryuk',
			['Seohyun. When you have a son—', 'Don’t give him a Silla name to make them like him. They won’t.', 'Give him one that keeps faith.'],
			['서현아. 네가 아들을 보거든—', '신라 사람들 마음에 들라고 신라 이름을 지어 주지 마라. 어차피 안 좋아한다.', '신의를 지키는 이름을 줘라.']
		),
		D('seohyeon', ['Father, I’m not even— there isn’t even a girl, I—'], ['아버지, 저는 아직— 여자도 없는데, 저—']),
		...nameBlocks,

		DAY(6),
		P(
			'On the sixth night there are two cups on the pavilion table. Bidam poured them himself. Last night he found out whose grandson he has been calling a Gaya ox.',
			'여섯째 밤, 정자 탁자에 찻잔 둘이 놓여 있다. 비담이 손수 따랐다. 어젯밤 그는 자기가 가야 소라 부르던 사내가 누구의 손자인지 알았다.'
		),
		card('Five days of grain. Two cups poured. Will the grandson of the cone helm come to tea…?', '닷새 치 곡식. 채워 둔 찻잔 둘. 고깔 투구의 손자는 차를 마시러 올 것인가…?')
	];
	e.logline = {
		en: 'The youngest son in the cart surrenders Gaya on one condition, then spends his life riding for Silla. Even south.',
		ko: '수레에 탄 막내아들은 조건 하나를 걸고 가야를 넘긴다. 그리고 평생 신라를 위해 말을 탄다. 남으로도.'
	};
});

/* ─────────────── Phase E: #44 Jeon (Days 6–8) and #46 Gyeol (Days 9–10) ─────────────── */
edit('#44/#46', (story) => {
	const { ep, D, get, flash, scene, day } = helpers(story);
	const e = ep(44);
	const f = ep(46);
	if (f.blocks[0]?.label === 'DAY 9') return false;
	const g = (q) => get(e, q);
	const k = (q) => get(f, q);

	// #44 Day 6
	const rain = g('Night rain.');
	rain.html = 'Night rain. Five days of grain behind the palace gate. Bidam’s officers want a dawn assault. Bidam wants the score finished properly. He wants Yushin to come out again.';
	rain.ko = '밤비. 궁문 안에는 닷새 치 곡식. 비담의 장교들은 새벽 돌격을 원한다. 비담은 점수를 제대로 끝내고 싶다. 유신이 다시 나오기를 원한다.';
	const band = flash(e, 'The headband');
	band.year = '610';
	const defend = band.blocks.findIndex((b) => b.person === 'bidam');
	band.blocks.splice(
		defend + 1,
		0,
		P(
			'He punches the nearer one before the other can answer, then the second for good measure. Then he wipes his knuckles on his own black headband.',
			'그는 대답이 나오기도 전에 가까운 놈을 치고, 덤으로 다른 놈도 친다. 그러고는 제 검은 머리띠에 주먹을 닦는다.'
		)
	);
	const cupLeft = g('The cup Yushin did not drink sits where Bidam left it.');

	// #44 Day 7
	const d7 = day(e, 7);
	const golInv = g('Golhwa’s invitation is not meant for him');
	const low = g('Heat hits him low');
	low.html = 'The spring does not hide much. Heat hits him low. He recites. The beads do not help.';
	low.ko = '샘이 감춰 주는 게 없다. 열이 아래서 온다. 염불을 한다. 염주가 도움이 안 된다.';
	const lotus = g((b) => b.kind === 'quote' && (b.hanja ?? '').startsWith('若有眾生'));

	// #44 Day 8
	const kiteQ = g((b) => b.kind === 'quote' && (b.html ?? '').startsWith('So he made a straw man'));
	const grey = g('The kite buys one night.');
	grey.html =
		'The kite buys one night. A sky can only be argued with for so long, and by midnight both camps are already arguing about what they saw. While the drums are still asleep, <b>Yushin</b> goes down to the palace stables alone and leads out the white horse.';
	grey.ko =
		'연은 하룻밤을 번다. 하늘과는 그리 오래 다툴 수 없고, 자정이 되자 두 진영은 벌써 자기들이 무엇을 보았는지를 두고 다툰다. 북이 아직 잠든 사이, <b>유신</b>은 홀로 궁의 마구간으로 내려가 흰 말을 끌어낸다.';
	const dawn = g('At dawn the groom leads out a young grey');
	dawn.html = dawn.html.replace('At dawn the groom', 'Afterwards the groom');
	dawn.ko = dawn.ko.replace('새벽에 마부 아이가', '그 뒤 마부 아이가');

	const lakeStart = e.blocks.indexOf(scene(e, 'The Lake, Again'));
	const lakeEnd = e.blocks.indexOf(g('Look at him — he’s crying.'));
	const lake = e.blocks.slice(lakeStart, lakeEnd + 1);
	const d9 = e.blocks.indexOf(day(e, 9));
	const speechEnd = e.blocks.indexOf(g('So come at me, fate!'));
	const day9 = e.blocks.slice(d9 + 1, speechEnd + 1);
	const tail = e.blocks.slice(speechEnd + 1);
	if (tail.length !== 2) throw new Error('#44 tail should be quote + card');

	const stone = [
		SCENE('The Stone', '돌'),
		P(
			'Near midnight, at his desk in the palace, Yushin feels something warm against his wrist. He has carried his father’s stone in his sleeve for thirty years. It has never once been warm.',
			'자정 무렵, 궁 안 책상 앞에서 유신은 손목에 닿는 따뜻한 것을 느낀다. 아버지의 돌을 소매에 넣고 다닌 지 서른 해. 한 번도 따뜻했던 적이 없다.'
		),
		P(
			'He sets it on the desk between the lamp and the grain tally. Chunchu came in to say there are three days of rice left and not to tell the kitchen. He looks at the stone the way he looks at a letter in a script he can’t read.',
			'그는 그것을 등잔과 곡식 장부 사이에 내려놓는다. 쌀이 사흘 치 남았으니 부엌엔 말하지 말라고 전하러 들어온 춘추가, 못 읽는 글씨로 쓴 편지를 보듯 그 돌을 본다.'
		),
		D('chunchu', ['…It’s a rock.', 'Why is your rock warm?'], ['……돌이잖아.', '네 돌이 왜 따뜻해?']),
		D(
			'yushin',
			['My father had it from a spring under the hill. It warmed when the hill wanted him.', 'It hasn’t since he died.'],
			['아버지가 언덕 아래 샘에서 받은 거야. 언덕이 아버지를 부를 때마다 따뜻해졌지.', '돌아가신 뒤로는 한 번도.']
		),
		D('chunchu', ['And you’re going. With a rebel on the wall and three days of rice. To ask a spring something.'], ['그래서 가겠다고. 성벽엔 역적이 있고 쌀은 사흘 치인데. 샘한테 뭘 물으러.']),
		D('yushin', ['Bidam says I was never of Silla.', 'Six nights I let him say it. I want to know—', '…whether I am.'], ['비담은 내가 애초에 신라 사람이 아니래.', '엿새 밤을 그 말 하게 뒀어. 알고 싶어—', '……내가 그런지.']),
		D('chunchu', ['You’re asking a rock.'], ['돌한테 묻는 거네.']),
		D('yushin', ['I’m asking him.'], ['아버지한테 묻는 거야.']),
		P(
			'Chunchu doesn’t argue. He has just watched this man kill his own horse for a sky. He pours out the last of the wine, drinks half, and leaves the other half for whoever comes back.',
			'춘추는 따지지 않는다. 그는 방금 이 남자가 하늘 하나 때문에 제 말을 죽이는 것을 보았다. 남은 술을 따라 반을 마시고, 나머지 반은 돌아올 사람 몫으로 남긴다.'
		),
		P('Yushin puts the stone back in his sleeve. He will go down before light.', '유신은 돌을 다시 소매에 넣는다. 날이 밝기 전에 내려갈 것이다.'),
		card(
			'A warm stone, a spring under a hill, and a father who once got very lost on purpose. Who was Kim Seohyun…?',
			'따뜻한 돌, 언덕 아래의 샘, 그리고 일부러 아주 크게 길을 잃었던 아버지. 김서현은 누구였나…?'
		)
	];
	const drop = new Set([cupLeft, golInv, lotus, kiteQ, ...lake, e.blocks[d9], ...day9, ...tail]);
	const rest = e.blocks.filter((b) => !drop.has(b));
	rest.splice(
		rest.indexOf(d7) + 1,
		0,
		P(
			'Seven days in, nobody pours. Four days of grain. Last night’s two cups are still on the pavilion table, and one of them was never touched.',
			'이레째, 아무도 차를 따르지 않는다. 곡식은 나흘 치. 어젯밤의 찻잔 둘이 정자 탁자에 그대로 있고, 하나는 끝내 아무도 손대지 않았다.'
		)
	);
	e.blocks = [...rest, ...stone];
	e.logline = {
		en: 'The sixth night’s tea turns to insult, the cavern throws Bidam out, a white horse burns for a falling star, and Yushin’s father’s stone goes warm.',
		ko: '여섯째 밤의 차는 욕설로 끝나고, 동굴은 비담을 내쫓고, 떨어진 별을 위해 흰 말이 바쳐지고, 유신 아버지의 돌이 따뜻해진다.'
	};

	// #46 Day 9: the cavern, then the outer works and the rampart
	const [lakeScene, lakeIn, undress, wet, ...lakeRest] = lake;
	lakeIn.html = 'So Yushin goes to the cavern lake, as if habit could hold a country together.';
	lakeIn.ko = '그래서 유신은 습관이 나라를 붙잡아 주기라도 할 것처럼 동굴 호수로 간다.';
	wet.html = 'Golhwa knows that walk and is already wet for it. She watches him like a problem she means to solve with her body.';
	wet.ko = '골화는 그 걸음을 알고, 이미 젖어 있다. 몸으로 풀 문제를 보듯 그를 본다.';
	const shapes = lakeRest.find((b) => (b.html ?? '').startsWith('Steam thins. Two shapes wait'));
	const asks = lakeRest.find((b) => b.person === 'yushin' && b.en?.[0] === 'Father. Grandfather.');
	asks.en[1] = 'In eight days the same mouth has called me the sacred country’s saviour and a Gaya wretch.';
	asks.lines[1] = '여드레 사이에 같은 입이 저를 신국의 구원자라 부르고, 가야 놈이라 불렀습니다.';
	lakeRest.splice(
		lakeRest.indexOf(shapes),
		0,
		D('narim', ['So the stone woke you.', 'One question, Kim. From the water. Once.'], ['돌이 너를 깨웠구나.', '질문은 하나다, 김. 물에서. 한 번만.'])
	);
	const muryukGhost = lakeRest.find((b) => b.person === 'muryuk');
	delete muryukGhost.look;
	const [alchunAsk, alchunAnswer, alchunAfter, ...rampart] = day9;
	const neither = alchunAfter;
	neither.html = 'He still does not draw. Surabol will remember that sentence for years: the man who caught tigers, filed under Neither.';
	neither.ko = '그는 끝내 칼을 뽑지 않는다. 서라벌은 그 문장을 오래 기억할 것이다. 호랑이를 잡던 남자, ‘어느 쪽도 아님’으로 분류되어.';
	alchunAsk.html =
		'By midday the ninth day has turned into the battle both sides spent eight days pretending they could avoid. Assault and counter-assault in the outer works.';
	alchunAsk.ko = '한낮이 되자 아홉째 날은, 양쪽이 여드레 동안 피할 수 있는 척했던 싸움이 된다. 외성에서 공격과 역공.';
	const day9Blocks = [
		DAY(9),
		P(
			'The water under the hill has been warm for thirty years. Before light on the ninth day, so is the stone in Yushin’s sleeve.',
			'언덕 아래 물은 서른 해 동안 따뜻했다. 아홉째 날 동트기 전, 유신의 소매 속 돌도 따뜻하다.'
		),
		lakeScene,
		lakeIn,
		undress,
		wet,
		...lakeRest,
		P('He comes up out of the water with the stone gone cold again in his fist. He does not need it warm any more.', '그는 다시 식어 버린 돌을 주먹에 쥐고 물에서 올라온다. 이제 따뜻할 필요가 없다.'),
		SCENE('The Outer Works', '외성'),
		alchunAsk,
		P('Yumjong goes down in the outer ditch with a Silla spear under his arm. Bidam reaches him before the rebels finish falling back.', '염종은 신라 창을 겨드랑이에 꽂은 채 바깥 도랑에서 쓰러진다. 반군이 다 물러서기도 전에 비담이 그에게 닿는다.'),
		D(
			'yumjong',
			['Don’t— don’t make that face, Councillor.', 'They marched. You said they wouldn’t. They marched…', '…It was a good word, though. Gaya. They liked shouting it.'],
			['그런— 그런 얼굴 마십시오, 상대등.', '행군했잖습니까. 안 할 거라 하셨는데. 했잖습니까…', '……그래도 좋은 말이었지요. 가야. 다들 외치기 좋아했는데.']
		),
		D('bidam', ['Yumjong.', '…Yumjong.'], ['염종.', '……염종.']),
		P('The quieter name on the banner goes first. Bidam closes his eyes for him and does not let anyone see his hand.', '깃발의 더 조용한 이름이 먼저 간다. 비담은 손수 그의 눈을 감겨 주고, 그 손을 아무에게도 보이지 않는다.'),
		P(
			'By dusk the granary inside the Moon Palace is down to its last sacks, and men who have never prayed are learning the postures. Alchun is asked, for the last useful time, which wall he belongs to.',
			'해 질 무렵 월성 안 곳간은 마지막 섬만 남고, 기도해 본 적 없는 사내들이 무릎 꿇는 자세를 배운다. 알천은 마지막으로 쓸모 있는 질문을 받는다. 어느 성벽에 속하느냐고.'
		),
		alchunAnswer,
		neither,
		...rampart
	];

	// #46 Day 10: the gate opens from the inside, and the duel
	const white = k('They burned a white horse over there the other day');
	white.en[2] = '…They burned a white horse over there two nights ago. Even if I lose, somebody should still be holding on to this one.';
	const meet = k('They meet again between the camps');
	const wins = k('Blood finds the mud that used to be a scoreboard.');
	const reads = k('Kangrim reads his name three times where the body');
	const walk = k('Your list ends here. Walk with me');
	const kite = k('The opposite kite.');
	kite.en = ['One question, then we walk.', 'Were you a righteous traitor, or an unrighteous king?'];
	kite.lines = ['하나만 묻고 가십시다.', '의로운 역적이었소, 불의한 임금이었소?'];
	const flew = k('Write that I flew it.');
	flew.en = ['…My father asked me that at a gate.', 'Write that I was his son.', 'Tell the sacred country I loved it badly.'];
	flew.lines = ['……아버지가 문 앞에서 내게 그걸 물으셨소.', '그분 아들이었다고 적으시오.', '신국에 전하게 — 나는 서툴게 사랑했다고.'];
	const finish = k('The body finishes falling after the name does.');
	const kneel = k('Yushin does not kneel.');
	kneel.html =
		'Yushin kneels once, only to untie the black headband from the body. Then he stands, mud still wet, turns to the Hwarang behind him and names a house. Bidam’s own line. The one he carried in his jaw and never once claimed aloud.';
	kneel.ko =
		'유신은 한 번 무릎을 꿇는다. 시신에서 검은 머리띠를 풀기 위해서만. 그러고는 일어나, 진흙이 마르기도 전에 뒤따른 화랑들을 돌아보고 한 집안의 이름을 댄다. 비담의 핏줄. 비담이 턱 안에 물고 다니면서도 한 번도 입 밖에 내지 않은 그 핏줄.';
	const erase = k('Erase Bidam’s house.');
	erase.en = ['Erase Bidam’s house.', 'The Son line, every one of them.', 'Treason’s blood must be cut.'];
	erase.lines = ['비담의 집안을 없애라.', '손씨 핏줄, 하나 남김없이.', '반역의 피는 끊어야 한다.'];
	const stands = k('Nobody repeats it.');
	const purgeQ = k((b) => b.kind === 'quote' && (b.hanja ?? '').startsWith('於是'));
	const secondFall = k('Bidam falls the way a Hwarang falls');
	const yardEyes = k('the way they used to across the yard');
	const i0 = f.blocks.indexOf(k((b) => b.kind === 'scene' && b.label === 'Between the Camps'));
	const iWins = f.blocks.indexOf(wins);
	const iEyes = f.blocks.indexOf(yardEyes);
	const iStands = f.blocks.indexOf(stands);
	const head = f.blocks.slice(0, i0 + 1);
	const afterWin = f.blocks.slice(iWins + 1, iEyes + 1);
	const horse = f.blocks.slice(f.blocks.indexOf(k('Bisamun comes through the lines without a rider')), f.blocks.indexOf(kneel));
	const purge = f.blocks.slice(f.blocks.indexOf(erase), iStands + 1);
	const after = f.blocks.slice(f.blocks.indexOf(secondFall) + 1);
	if ([head, afterWin, horse, purge, after].some((x) => !x.length)) throw new Error('#46 slice empty');

	const duel = [
		P(
			'On the tenth morning the grain is gone, and the palace gate opens from the inside, exactly as Bidam said it would. Out of it comes the Marshal of Silla at a gallop, on a grey horse that had no name the day before yesterday.',
			'열째 날 아침, 곳간은 비었고, 궁문이 안에서 열린다. 비담이 말한 그대로다. 그 문에서 나오는 것은 신라의 대장군이다. 그저께까지 이름도 없던 회색 말을 타고, 질풍처럼.'
		),
		P(
			'Bidam rides out to meet him and stops halfway. He gets down, slaps Bisamun on the rump and sends him back to the lines. A spear’s length off, Yushin gets down too. They learned this on foot.',
			'비담이 마주 나가다 중간에서 멈춘다. 말에서 내려 비사문의 엉덩이를 쳐 진영으로 돌려보낸다. 창 한 자루 거리에서 유신도 내린다. 둘은 이것을 땅에서 배웠다.'
		),
		meet,
		P('The yard drill first. High guard, cut, step, return. Bidam is fifty-three and moves like it, until he doesn’t.', '먼저 연무장 연습 그대로다. 높은 자세, 베기, 한 걸음, 제자리. 비담은 쉰셋이고 쉰셋처럼 움직인다. 그러지 않을 때까지는.'),
		D('bidam', ['You still drop your left shoulder.'], ['너 아직도 왼어깨가 처지는구나.']),
		D('yushin', ['You still talk.'], ['공은 아직도 말이 많소.']),
		P(
			'Bidam’s third cut is a feint and the fourth isn’t. It opens a line above Yushin’s brow, right where a Hwarang headband sits. Yushin’s hand goes to his forehead, the way a new boy’s does in the hall when the seniors start in on him.',
			'비담의 셋째 칼은 허초이고, 넷째는 아니다. 그 칼이 유신의 이마 위, 화랑 머리띠가 앉는 바로 그 자리에 금을 긋는다. 유신의 손이 이마로 간다. 강당에서 선배들이 시비를 걸 때 새로 온 아이의 손이 그러듯.'
		),
		P(
			'Yushin steps inside the next cut, too close for either blade. Bidam’s bead string catches on the dragon ring of his hilt. For one breath they are tied together at the wrist.',
			'유신이 다음 칼 안쪽으로, 어느 칼도 쓸 수 없을 만큼 가까이 파고든다. 비담의 염주 줄이 유신 칼자루의 용 고리에 걸린다. 한 숨 동안 둘은 손목으로 묶여 있다.'
		),
		D('bidam', ['…Let go, Gaya.'], ['……놔라, 가야.']),
		D('yushin', ['You let go.'], ['공이 놓으시오.']),
		P('Neither does. The string does instead.', '둘 다 놓지 않는다. 대신 줄이 놓는다.'),
		wins,
		P('Ninety-nine beads go into the mud after the blood, one at a time, like somebody counting.', '아흔아홉 알이 피를 따라 진흙으로 떨어진다. 하나씩, 누가 세기라도 하듯.'),
		...afterWin,
		reads,
		walk,
		kite,
		flew,
		finish,
		...horse,
		kneel,
		...purge,
		P('Somewhere behind the palace wall, the queen is already slipping away.', '궁 담장 너머 어딘가에서, 여왕은 이미 떠나가고 있다.')
	];
	const remember = after.find((b) => (b.html ?? '').startsWith('That night Yushin remembers the first day of the rebellion'));
	remember.html = 'That night Yushin remembers the first morning on the yard, and it is not the way he has been telling it.';
	remember.ko = '그날 밤 유신은 연무장의 첫 아침을 기억한다. 그것은 그가 말해 온 방식이 아니다.';
	const twist = after.find((b) => b.kind === 'flashback' && b.title === 'the twist');
	twist.year = '610';
	twist.blocks.unshift(P('The same desk. The same headband held out across it, still wet at the knuckle end.', '같은 책상. 그 너머로 내밀어진 같은 머리띠. 주먹 닿은 끝은 아직 젖어 있다.'));
	const cup = after.find((b) => (b.html ?? '').includes('the cup he never touched'));
	cup.html = cup.html.replace('He sits down across from no one.', 'He lays the black headband beside it and sits down across from no one.');
	cup.ko = cup.ko.replace('그는 아무도 없는 맞은편을 두고 앉는다.', '그는 그 옆에 검은 머리띠를 내려놓고, 아무도 없는 맞은편을 두고 앉는다.');

	const dropped = [purgeQ, secondFall];
	f.blocks = [...day9Blocks, ...head, ...duel, ...after];
	for (const b of dropped) if (f.blocks.includes(b)) throw new Error('#46 dropped block survived');
	if (new Set(f.blocks).size !== f.blocks.length) throw new Error('#46: duplicated block');
	f.logline = {
		en: 'Yushin asks the water who he is. Then the gate opens from the inside, the yard’s two best meet between the camps, and the score finally breaks.',
		ko: '유신은 물에게 자신이 누구인지 묻는다. 그리고 문이 안에서 열리고, 연무장의 두 최고가 진영 사이에서 만나고, 점수가 마침내 깨진다.'
	};
});

/* ─────────────── Phase F: #45 Seohyun, records trimmed, card to Day 9 ─────────────── */
edit('#45', (story) => {
	const { ep, D, get } = helpers(story);
	const e = ep(45);
	const last = e.blocks[e.blocks.length - 1];
	if ((last.html ?? '').includes('Ninth morning')) return false;
	const g = (q) => get(e, q);
	const cart = g('His father handed the kingdom over');
	cart.html = cart.html.replace('His father handed the kingdom over, then spent', 'His father rode in the cart that handed the kingdom over, then spent');
	cart.ko = cart.ko.replace('그의 아버지는 나라를 넘기고, 남은 평생', '그의 아버지는 나라를 넘기는 수레에 탔고, 남은 평생');
	const box = g('whose father carried his country here in a box');
	box.en[1] = 'The one whose grandfather carried his country here in a box and set it on the floor in front of my grandfather.';
	box.lines[1] = '제 할애비가 나라를 궤짝에 담아 와서 내 외조부 앞 마루에 내려놓은 집.';
	const cutQuotes = ['舒玄為萬弩郡太守', '舒玄庚辰之夜', '及欲定名', '初以庾信胎藏之高山', '公年十五歲爲花郞'];
	e.blocks = e.blocks.filter((b) => !(b.kind === 'quote' && cutQuotes.some((h) => (b.hanja ?? '').startsWith(h))));
	const sit = g('I’m going to sit down.');
	e.blocks.splice(
		e.blocks.indexOf(sit) + 1,
		0,
		D('manmyung', ['Sit, then. Sit.', 'And his eyes are some grandmother’s, a long way back. Seohyun says there was a boat.'], ['앉는다면서요. 앉아요.', '눈은 먼 옛날 어느 할머니 눈이래요. 서현 말로는 배가 한 척 있었대요.'])
	);
	const rise = g('Seohyun rises the way a Gaya man rises');
	rise.html = rise.html.replace(' His son’s memorial stone will give him a different name. The historian can’t decide between them, writes both down, and moves on.', '');
	rise.ko = rise.ko.replace(' 아들의 비석은 그에게 다른 이름을 붙일 것이다. 사관은 둘 중 하나를 고르지 못하고, 둘 다 적고 넘어간다.', '');
	const died = g('The histories do not record the year he died');
	died.html =
		'The histories do not record the year he died, only how high he got. He climbs the ridge beyond the city whenever the stone in his sleeve is warm, shaved every time, until the climb is too much for him. Then the stone goes to his son. The boy with seven stars on his back finds the same water on his own and bathes in it for thirty years, and the stone in his sleeve stays cold the whole time, as if the hill were waiting for a better question.';
	died.ko =
		'사서는 그가 죽은 해를 적지 않았다. 얼마나 높이 올랐는지만 적었다. 그는 소매 속 돌이 따뜻해질 때마다 도성 너머 능선을 오른다. 매번 면도를 하고. 오르기 버거워질 때까지. 그 뒤 돌은 아들에게 간다. 등에 일곱 별을 지닌 아이는 혼자 힘으로 같은 물을 찾아내 서른 해를 거기서 씻는다. 그동안 소매 속 돌은 한 번도 따뜻해지지 않는다. 언덕이 더 나은 질문을 기다리기라도 하는 것처럼.';
	if (!(last.html ?? '').startsWith('<b>Tenth morning')) throw new Error('#45 card not found');
	e.blocks.splice(
		e.blocks.indexOf(last),
		1,
		card('Ninth morning, before light. The stone in his son’s sleeve is warm at last. Down Yushin goes, to the water…!', '아홉째 날, 동트기 전. 아들의 소매 속 돌이 마침내 따뜻하다. 유신은 물로 내려간다…!')
	);
});

/* ─────────────── Phase H: images follow their text ─────────────── */
const strip = (s) => s.replace(/<[^>]+>/g, '');
function blockText(b) {
	if (b.kind === 'map') return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
	if (b.kind === 'table') return [...b.head, ...b.rows.flat()].join(' ');
	return textOf(b);
}
const hay = (e) => lists(e).flat().map((b) => strip(blockText(b))).join('\n');
const matches = (e, at) => hay(e).includes(strip(at));

edit('images', (story) => {
	const { ep } = helpers(story);
	const range = [40, 41, 42, 43, 44, 45, 46];
	const REPOINT = {
		'gaya-ridge-night': 'The sky comes down to touch the mountain',
		'nsfw-ibiga-heart-ridge': 'The sky comes down to touch the mountain',
		'nsfw-ibiga-swallow-clutch': 'The sky comes down to touch the mountain',
		'gaya-iron-coast': 'It has a league of iron harbours',
		'ibiga-sky-hero': 'keeps the sky the way other gods keep a hall',
		'ibiga-in-clouds': 'keeps the sky the way other gods keep a hall',
		'bidam-sword-pommel': 'Only the ring pommel holds the light',
		'silla-moon-hall': 'not one man the equal of',
		gaya_01: 'From that heat come eggs'
	};
	const THUMB_AT = {
		40: 'Nothing moves unless the circle closes',
		42: 'Between the camps a small pavilion goes up',
		44: 'has carried his father’s stone in his sleeve',
		46: 'They meet again between the camps'
	};
	let changed = 0;
	for (const n of range)
		for (const im of ep(n).images ?? [])
			if (REPOINT[im.id] && im.at !== REPOINT[im.id] && !matches(ep(n), im.at ?? '')) {
				im.at = REPOINT[im.id];
				changed++;
			}
	for (const n of range) {
		const e = ep(n);
		for (const im of [...(e.images ?? [])]) {
			if (!im.at || matches(e, im.at)) continue;
			if (im.id === e.thumbnail && THUMB_AT[n]) {
				im.at = THUMB_AT[n];
				changed++;
				continue;
			}
			const home = range.map(ep).find((x) => x !== e && matches(x, im.at));
			if (!home) continue;
			e.images.splice(e.images.indexOf(im), 1);
			(home.images ??= []).push(im);
			changed++;
		}
	}
	for (const n of range) for (const im of ep(n).images ?? []) if (im.at && !matches(ep(n), im.at)) console.log(`  unmatched #${n} ${im.id} :: ${im.at}`);
	return changed ? true : false;
});

/* ─────────────── Phase D2: #43 grows past a stub ─────────────── */
edit('#43 scenes', (story) => {
	const { ep, D, S, get } = helpers(story);
	const e = ep(43);
	if (find(e, 'Face front, Muryuk.').length) return false;
	const g = (q) => get(e, q);
	const LORD = (en, ko) => S('The lord of Geumgwan', '#8B5CF6', en, ko);
	e.blocks.splice(
		e.blocks.indexOf(g('The lord of Geumgwan did the arithmetic first.')) + 1,
		0,
		P('The cart is slow. The road to Surabol is long enough for a boy to change his mind several times.', '수레는 느리다. 서라벌 가는 길은 아이가 마음을 여러 번 바꿀 만큼 길다.'),
		LORD(['Face front, Muryuk.', 'Your brothers are facing front.'], ['앞을 봐라, 무력아.', '형들은 앞을 보고 있다.']),
		D('muryuk', ['Somebody should remember what it looked like.', '…The harbour. Before.'], ['누군가는 어떻게 생겼는지 기억해야지요.', '……포구 말입니다. 그 전에.']),
		LORD(['Then remember it quietly. Kings don’t like being reminded what they bought.'], ['그럼 조용히 기억해라. 임금들은 자기가 산 걸 상기받는 걸 싫어한다.']),
		P('He keeps looking back until the river bends out of sight.', '그는 강이 굽어 보이지 않을 때까지 뒤를 돌아본다.')
	);
	e.blocks.splice(
		e.blocks.indexOf(g('does not eat for two days')) + 1,
		0,
		P('Before that, the slave who did the cutting comes to his tent with the king’s knife, because nobody else will take it.', '그 전에, 목을 벤 노비가 임금의 칼을 들고 그의 막사로 온다. 아무도 그 칼을 받으려 하지 않아서다.'),
		D('dodo', ['My lord. They said give it to the Gaya one.', '…That’s you, isn’t it?'], ['나리. 가야 분한테 드리라던데요.', '……나리 맞으시죠?']),
		D('muryuk', ['Keep it.', 'A knife that’s done that once shouldn’t go home to a man with sons.'], ['네가 가져라.', '그런 일을 한 번 한 칼은 아들 있는 집에 가면 안 된다.'])
	);
	e.blocks.splice(
		e.blocks.indexOf(g('there isn’t even a girl')) + 1,
		0,
		D(
			'muryuk',
			['There will be. You walk into walls looking at clouds.', 'Some girl will find that charming. One.'],
			['생길 거다. 구름 보다가 벽에 부딪히는 놈이니.', '그걸 귀엽다 할 여자가 하나는 있을 거다. 딱 하나.']
		)
	);
});
