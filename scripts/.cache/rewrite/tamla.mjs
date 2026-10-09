/**
 * Tamla rewrite (#56–#63): Exile and the six island nights, plus Tribute as the frame's turn.
 * Run once: `node scripts/.cache/rewrite/tamla.mjs`. Each episode checks a marker and skips if already patched.
 */
import { editStory, find } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });

function helpers(story) {
	const entries = story.flatMap((c) => c.entries);
	const ep = (n) => entries[n - 1];
	const chips = {};
	for (const e of entries)
		for (const b of e.blocks) if (b.kind === 'dialogue' && b.person && b.chip && !chips[b.person]) chips[b.person] = b.chip;
	const D = (person, en, ko) => ({ kind: 'dialogue', chip: chips[person] ?? '#8a8a94', person, lines: ko, en });
	const S = (speaker, gender, chip, en, ko) => ({ kind: 'dialogue', chip, speaker, gender, lines: ko, en });
	/** The one top-level block containing `frag`; throws if missing or ambiguous. */
	const get = (e, frag, pred) => {
		const hits = find(e, frag, pred).filter((h) => h.list === e.blocks);
		if (hits.length !== 1) throw new Error(`#${entries.indexOf(e) + 1}: ${hits.length} hits for "${frag}"`);
		return hits[0].b;
	};
	const anchor = (e, id, at) => {
		const im = e.images.find((i) => i.id === id);
		if (!im) throw new Error(`no image ${id}`);
		im.at = at;
	};
	return { ep, D, S, get, anchor };
}

const card = (en, ko) => P(`<b>${en}</b>`, `<b>${ko}</b>`);

/** `DRY=1` runs every patch against a fresh load and saves nothing. */
const edit = (fn) => editStory((s) => { const r = fn(s); if (process.env.DRY) console.log(r === false ? "skip" : "ok"); return process.env.DRY ? false : r; });

/* ─────────────────────────────── #56 Exile ─────────────────────────────── */
edit((story) => {
	const { ep, D, S, get, anchor } = helpers(story);
	const e = ep(56);
	if (e.blocks[0].html.includes('loses the right to say no')) return false;
	const g = (f, p) => get(e, f, p);
	const WIFE = (en, ko) => S('Gyebek’s Wife', 'f', '#b07a6a', en, ko);
	// Black Rock → hinge moral stay in #56 for one more call; the #63 patch below moves them.
	const trStart = e.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Black Rock');
	const trEnd = e.blocks.findIndex((b) => b.kind === 'moral' && (b.html ?? '').includes('hinge'));
	const trainingBlocks = e.blocks.slice(trStart, trEnd + 1);
	if (trStart < 0 || trEnd < trStart) throw new Error('#56: training blocks not found');

	const monasteryRetag = ['more than forty sons', 'In the chairs of all eight houses', 'The one with no house', 'Things without a price'];
	for (const f of monasteryRetag) g(f).person = 'eldersatek';

	const offer = g('They try the ordinary way first');
	offer.html =
		'They try the ordinary way first: they offer him a name. A real one, an old one, the eighth branch of a minor house, papers and a grave-line and ancestors, and a clan chair at the end of it for his son. It is a serious offer, and it is the only thing he has ever wanted.';
	offer.ko =
		'먼저 통상적인 방법을 쓴다. 이름을 준다. 진짜 이름을, 오래된 이름을. 작은 집안의 여덟째 갈래, 문서와 산소와 조상, 그리고 그 끝에 아들이 앉을 가문의 의자까지. 진지한 제안이고, 그가 평생 원해 온 단 하나의 것이다.';
	const already = g('…I already have one.');
	already.en = ['I have thought of him.', '…I already have one.'];
	already.lines = ['생각했습니다.', '…이름은 이미 하나 있습니다.'];

	const readOut = g('It is read with the king’s formula');
	readOut.html =
		'It is read with the king’s formula and the king’s seal, but not in the king’s voice. <b>Minister Satek</b> holds the Assembly’s borrowed stamp.';
	readOut.ko = '왕의 문구로, 왕의 옥새로 읽힌다. 다만 왕의 목소리는 아니다. 정사암에 맡겨 둔 옥새는 <b>사택지적</b>의 손에 있다.';
	const sealSet = g('The seal is set.');
	sealSet.en = ['The seal is set.', 'I read this in the Assembly’s name.', 'Gyebek is hereby sent into exile!'];
	sealSet.lines = ['옥새가 찍혔다.', '정사암 회의의 이름으로 읽는다.', '계백을 유배에 처한다!'];
	const remember = g('Remember the young Satek');
	remember.html =
		'Remember the young Satek who just called it His Majesty’s will. He has small feet, and he walks very carefully. He will say worse things in His Majesty’s name, later, to a much bigger king.';
	remember.ko =
		'방금 ‘전하의 뜻’이라 말한 사택 집안 젊은이를 기억해 두라. 발이 작고, 아주 조심스럽게 걷는 사내다. 그는 나중에, 훨씬 큰 임금 앞에서, 전하의 이름으로 더한 말을 한다.';
	const turtle = g('A man named turtle?');
	turtle.en = ['Gyebek? Like geobuk? A man named Turtle?'];
	turtle.lines = ['뭐? 계백? 거북이라고?'];

	const blocks = [
		P(
			'<b>Queen Satek</b> dies, and the king, her son, loses the right to say no.',
			'<b>사택왕후</b>가 승하한다. 그리고 그 아들인 왕은 ‘안 된다’고 말할 권리를 잃는다.'
		),
		e.blocks.find((b) => b.kind === 'map'),
		P(
			'Three years of mourning, by the rite. The king may not judge, may not sign, may not overturn. Everyone in Sabi knows exactly how long three years is, and exactly what can be done inside them.',
			'예법대로 삼년상이다. 그동안 왕은 판결할 수 없고, 서명할 수 없고, 뒤집을 수 없다. 사비의 누구나 삼 년이 얼마나 긴지 정확히 알고, 그 안에서 무엇을 할 수 있는지도 정확히 안다.'
		),
		g('grieving that the body’s days go so easily'),
		P(
			'Minister Satek carved that last year, grieving his own short days. He knows what mourning is good for.',
			'사택지적이 지난해 제 짧은 날을 서러워하며 새긴 글이다. 그는 슬픔이 어디에 쓸모 있는지 안다.'
		),
		g('Her death removes the clan’s hand'),
		P(
			'With her gone, the clan has one worry left. The king owns a man who cannot be bought: Hundred-Victories <b>Gyebek</b>. And Gyebek owns a horse.',
			'왕후가 없으니 가문에 남은 걱정은 하나다. 왕에게는 돈으로 살 수 없는 사내가 있다. 백승 <b>계백</b>. 그리고 계백에게는 말이 있다.'
		),
		g('They have watched him work.'),
		g('He doesn’t ride at armies.'),
		P(
			'Gyebek has no clan. That is the whole problem. He has a wife the king found for him, and a boy and a girl who carry the name the king made up. He took the wife and the name the way he takes orders, and has kept both. A man with a clan can be bargained with: you find out what his family wants and give them some of it. A man with no clan wants only what the king wants, and there is nothing to buy.',
			'계백에게는 가문이 없다. 그게 문제의 전부다. 왕이 짝지어 준 아내가 있고, 왕이 지어 준 이름을 단 아들 하나, 딸 하나가 있다. 그는 아내도 이름도 명령 받듯 받았고, 둘 다 지켜 왔다. 가문이 있는 사내와는 흥정이 된다. 그 집안이 뭘 원하는지 알아내서 조금 쥐여 주면 된다. 가문이 없는 사내는 왕이 원하는 것만 원한다. 살 게 없다.'
		),
		g('The Monastery', (b) => b.kind === 'scene'),
		g('So the two largest houses in Baekje meet'),
		g('counted twice at the gate by both sides'),
		g('How many generations have we been at this?'),
		g('lantern festival'),
		g('One of them was my grandson.'),
		g('Neither of them apologises.'),
		g('a second set of footprints'),
		g('Spill the cups.'),
		g('So why did you send for me tonight.'),
		g('more than forty sons'),
		g('…In our chairs.'),
		g('In the chairs of all eight houses'),
		g('It goes quiet.'),
		g('We will destroy each other'),
		g('As long as it takes.'),
		g('What gets removed first.'),
		g('The one with no house'),
		g('They do not say his name at the table.'),
		g('There is no price on that man.'),
		g('Things without a price'),
		g('The Offer', (b) => b.kind === 'scene'),
		offer,
		D(
			'eldersatek',
			['Think of the boy.', 'He grows up with a name the king invented. Every door in Sabi will know it.'],
			['아이를 생각하게.', '임금이 지어낸 이름을 달고 클 걸세. 사비의 문이란 문은 다 그걸 알 테고.']
		),
		already,
		g('The king made that one up.'),
		g('Which is why it is owed to someone.'),
		g('The Drill Ground', (b) => b.kind === 'scene'),
		g('The arrow comes through a tent wall'),
		g('He stops eating food he has not watched'),
		P(
			'One minister comes to see him: Sungchung, the man at court who asks the questions nobody else will.',
			'찾아오는 대신은 하나다. 성충. 조정에서 아무도 묻지 않는 것을 묻는 사람이다.'
		),
		g('You should be away from here.'),
		g('…I don’t run.'),
		g('Which is exactly how they win.'),
		g('The truce holds exactly as long'),
		g('The Sealed Order', (b) => b.kind === 'scene'),
		g('Gyebek is summoned to the hall'),
		g('The order is genuine.'),
		readOut,
		sealSet,
		g('It is His Majesty’s will.'),
		remember,
		D('gyebek', ['His Majesty is in mourning.', 'He cannot will anything.'], ['폐하께서는 상중이십니다.', '아무것도 뜻하실 수 없습니다.']),
		P(
			'Nobody answers him. He is correct, and it is not the kind of correct that helps.',
			'아무도 대답하지 않는다. 그의 말이 맞다. 다만 도움이 되는 종류의 맞음은 아니다.'
		),
		g('Satek water at the berth'),
		P(
			'His wife is at the berth with a bundle and both children. Nobody sent for her. In Sabi, news of a sealed order travels faster than the order.',
			'부두에 아내가 보따리와 두 아이를 데리고 와 있다. 아무도 부르지 않았다. 사비에서는 봉인된 교서의 소식이 교서보다 빨리 돈다.'
		),
		WIFE(['How long.'], ['얼마나요.']),
		D('gyebek', ['I do not know.'], ['모르오.']),
		WIFE(['Guess. For the children.', 'Say any number.'], ['아무 거라도요. 애들한테 해 줄 말.', '아무 숫자나 말해 봐요.']),
		D('gyebek', ['I do not know the number.', 'I will not give them a wrong one.'], ['숫자를 모르오.', '틀린 걸 줄 수는 없소.']),
		WIFE(['…No. You wouldn’t.'], ['…그렇죠. 당신은 안 그러지.']),
		P(
			'The boy asks if Father is going to war. Gyebek says no, because it is not a war. It is the only question all day he can answer exactly.',
			'아들이 아버지 전쟁 가느냐고 묻는다. 계백은 아니라고 한다. 전쟁이 아니니까. 그날 정확히 대답할 수 있었던 질문은 그것 하나뿐이다.'
		),
		g('Sabi', (b) => b.kind === 'scene' && b.label === 'Sabi'),
		P(
			'In Sabi, the order comes back to the king that evening, to be filed. That is the insult. His own seal sits at the bottom, a little crooked.',
			'사비에서는 그날 저녁, 교서가 정리하라고 왕에게 돌아온다. 그게 모욕이다. 맨 아래에 그의 옥새가 조금 비뚤게 찍혀 있다.'
		),
		g('Who used my seal'),
		g('Your Majesty… the Assembly'),
		g('You put my man on a boat?'),
		D('euija', ['Minister. How many days are left of my rite?'], ['지적. 내 상이 며칠 남았느냐.']),
		D('ministersatek', ['…Nine hundred and seventy-two, Majesty.'], ['…구백일흔이틀이옵니다, 폐하.']),
		D(
			'euija',
			[
				'Good. Count them. Out loud, at my door, every morning, so I never lose one.',
				'The morning it reaches nothing, I call the Assembly. All eight houses. Every chair.',
				'Then I send a boat. Well? Start.'
			],
			['좋다. 세거라. 매일 아침 내 문 앞에서, 소리 내어. 하루도 잃지 않게.', '그게 바닥나는 아침에 정사암을 부른다. 여덟 가문 전부. 의자란 의자 다.', '그다음에 배를 보낸다. 뭐 하느냐? 시작해라.']
		),
		D('ministersatek', ['…Nine hundred and seventy-two.'], ['…구백일흔이틀.']),
		P(
			'Euija laughs first, the way he always does. Then he makes the minister say it again.',
			'의자가 먼저 웃는다. 늘 그렇듯이. 그러고는 지적에게 한 번 더 말하게 한다.'
		),
		g('Tamla', (b) => b.kind === 'scene' && b.label === 'Tamla'),
		g('sand in his teeth'),
		e.blocks.find((b) => b.kind === 'place'),
		e.blocks.find((b) => b.kind === 'card' && b.person === 'yuridora'),
		...e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0] === 'How many days.'),
		g('Not one for greetings'),
		...e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0] === '…How many days.'),
		g('Eleven. Better?'),
		g('The islanders will spend five years noticing'),
		P('He takes eleven from a number he has carried since the hall.', '그는 교서가 읽힌 대전에서부터 지니고 온 숫자에서 열하루를 뺀다.'),
		D('gyebek', ['Nine hundred and sixty-one.'], ['구백예순하루.']),
		D('yuridora', ['Until what?'], ['뭐까지 말이냐?']),
		D('gyebek', ['Until His Majesty can sign again.', 'Then he sends for me.'], ['폐하께서 다시 서명하실 수 있을 때까지입니다.', '그때 저를 부르십니다.']),
		D('yuridora', ['Ha. A man who carries his own calendar.'], ['허. 달력을 품고 다니는 놈이로구나.']),
		g('Your name?'),
		g('I am called Gyebek.'),
		turtle,
		g('is the stone step'),
		g('…It was a joke.'),
		...e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0] === '…Ah.'),
		g('the way another man would say'),
		...trainingBlocks,
		g('First night on the island.')
	];
	if (blocks.some((b) => !b)) throw new Error('#56: missing block ' + blocks.findIndex((b) => !b));
	if (new Set(blocks).size !== blocks.length) throw new Error('#56: duplicate block');
	e.blocks = blocks;

	anchor(e, 'exile-queen-bier', 'loses the right to say no');
	anchor(e, 'tamla-map', 'He wakes on a beach');
	anchor(e, 'euija-mourning-fury', 'His own seal sits at the bottom');
	anchor(e, 'scene-euija-anger-sing', 'Euija laughs first');
});

/* The island training (Black Rock, Five Thousand) moves from #56 to #63, with its stills. */
const MOVED_IMAGES = [
	'black-rock-wide',
	'black-rock-lava',
	'black-rock-monolith',
	'jacheongbi',
	'five-thousand-formation',
	'parody-sehando-gyebek',
	'scene-gyebek-ocean-back',
	'scene-gyebek-who-am-i-15'
];

/* ─────────────────────────────── #63 Tribute ─────────────────────────────── */
edit((story) => {
	const { ep, D, S, get } = helpers(story);
	const e = ep(63);
	if (e.blocks[0].html.includes('comes home light')) return false;
	const ex = ep(56);
	const CAPTAIN = (en, ko) => S('The Captain', 'm', '#6f7f8f', en, ko);

	const training = [];
	{
		const start = ex.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Black Rock');
		const end = ex.blocks.findIndex((b) => (b.html ?? '').startsWith('He drills in units of five hundred'));
		if (start < 0 || end < 0) throw new Error('#63: training blocks not found in #56 (already moved?)');
		training.push(...ex.blocks.slice(start, end + 1));
		const tail = ex.blocks.slice(end + 1);
		const hinge = tail.find((b) => b.kind === 'moral' && (b.html ?? '').includes('hinge'));
		ex.blocks.splice(start, end + 1 - start + (hinge ? 1 : 0));
	}
	const drill = training.at(-1);
	drill.html =
		'He drills in units of five hundred. One day he will take ten of those units to a field and leave the rest behind. The count is already in his mouth.';
	drill.ko = '그는 오백을 한 단위로 훈련한다. 언젠가 그는 그것 열 개를 벌판으로 데려가고 나머지는 남겨 둘 것이다. 숫자는 이미 입에 있다.';
	for (const id of MOVED_IMAGES) {
		const i = ex.images.findIndex((im) => im.id === id);
		if (i >= 0) e.images.push(...ex.images.splice(i, 1));
	}

	const forgot = get(e, 'Tamla stops sending tribute.');
	forgot.html =
		'One year, long ago, Tamla stops sending tribute. Rebellion would at least have been legible. This is closer to forgetting, which a large kingdom finds harder to forgive.';
	forgot.ko =
		'옛날 어느 해, 탐라가 조공을 끊는다. 반란이었다면 차라리 읽어 낼 수는 있었을 것이다. 이것은 잊어버림에 가깝고, 큰 나라에게는 그쪽이 더 용서하기 어렵다.';

	e.blocks = [
		P('The tribute boat comes home light. The oranges stayed in Sabi. The news did not.', '조공선이 가볍게 돌아온다. 귤은 사비에 두고 왔다. 소식은 두고 오지 않았다.'),
		P(
			'Gyebek is on the sand before the sail has a shape. The captain holds a Yunbi contract and has been told not to talk to him. He talks anyway. It is a long way to sail with a thing like that in your mouth.',
			'돛이 모양을 갖추기도 전에 계백은 모래밭에 나와 있다. 선장은 윤비의 계약을 쥐고 있고, 그와 말을 섞지 말라는 당부를 들었다. 그래도 말한다. 그런 걸 입에 물고 오기엔 먼 뱃길이다.'
		),
		CAPTAIN(
			['The rite is over, General. Done at the new year.', 'His Majesty calls the Assembly on the first of the month. All eight houses.'],
			['상은 끝났습니다, 장군. 설에 마치셨지요.', '폐하께서 초하루에 정사암을 부르십니다. 여덟 가문 전부.']
		),
		D('gyebek', ['Did he send for me.'], ['저를 부르셨습니까.']),
		CAPTAIN(['……', 'Nobody said your name, General.'], ['……', '장군 이름은 아무도 안 꺼냈습니다.']),
		D('gyebek', ['Did anyone say it.'], ['누구라도 꺼냈습니까.']),
		CAPTAIN(['No.', '…Your wife came to the berth when we docked. She said to tell you—', 'the boy counts too.'], ['아니요.', '…배 댈 때 부인께서 부두에 나오셨습니다. 전해 달라고—', '아드님도 센다고.']),
		P(
			'Gyebek thanks him exactly once. He walks up the beach to the beam by the door, where the notches have run out. Nothing. He has never had a number end on him before.',
			'계백은 꼭 한 번 고맙다고 한다. 그러고는 해변을 걸어 올라가 문 옆 들보 앞에 선다. 금이 다 그어져 있다. 영. 숫자가 그보다 먼저 끝나 버린 건 처음이다.'
		),
		SCENE('The Forgotten Oranges', '잊어버린 귤'),
		D('gyebek', ['Why does your island keep Baekje’s men.', 'You owe Baekje nothing.'], ['왜 이 섬은 백제의 사람들을 맡아 줍니까.', '백제에 빚진 것도 없는데.']),
		D('yuridora', ['Owe nothing? Ha. Once, long ago, we forgot the oranges.'], ['빚이 없어? 하. 옛날에 우리가 귤을 깜빡한 적이 있지.']),
		forgot,
		get(e, 'marches an army to the southern harbour'),
		e.blocks.find((b) => b.kind === 'quote'),
		D(
			'yuridora',
			['See what he did? He marched to the harbour, and stopped.', 'He didn’t want to cross. He wanted us to know he could.'],
			['봤지? 항구까지 와서 멈췄다.', '건너고 싶었던 게 아니야. 건널 수 있다는 걸 알리고 싶었던 거지.']
		),
		get(e, 'and the oranges resume'),
		get(e, 'somewhere to put a man it cannot kill'),
		D('gyebek', ['His Majesty will cross.', 'After the Assembly.'], ['폐하께서는 건너오십니다.', '회의가 끝나면.']),
		D('yuridora', ['Turtle. A king who marches to the harbour and stops is telling you something.'], ['거북아. 항구까지 와서 멈추는 임금은 뭔가를 말하고 있는 거다.']),
		D('gyebek', ['His Majesty has not marched to the harbour.', 'So he has not stopped.'], ['폐하께서는 항구에 오시지 않았습니다.', '그러니 멈추신 것도 아닙니다.']),
		P(
			'Yuri Dora opens his mouth, and shuts it. There is no answer to that. There is only the next morning.',
			'유리도라가 입을 열었다가 다문다. 거기엔 대답이 없다. 다음 날 아침이 있을 뿐이다.'
		),
		P(
			'He has run out of days to count. So at dawn he goes down to the black rock and starts counting something else.',
			'셀 날이 다 떨어졌다. 그래서 새벽에 그는 검은 바위로 내려가 다른 것을 세기 시작한다.'
		),
		...training,
		P(
			'That night he cuts a new notch at the other end of the beam. One. If the king sends, he will be ready. If the king does not send, he will be ready.',
			'그날 밤 그는 들보 반대쪽 끝에 새 금을 하나 긋는다. 하나. 왕이 부르면, 준비가 되어 있을 것이다. 왕이 부르지 않아도, 준비가 되어 있을 것이다.'
		),
		get(e, 'Euija calls the Assembly')
	];
	if (e.blocks.some((b) => !b)) throw new Error('#63: missing block');
	e.logline = {
		en: 'The tribute boat comes home from Sabi with the king’s news. None of it has Gyebek’s name in it.',
		ko: '조공선이 사비에서 왕의 소식을 싣고 돌아온다. 그 어디에도 계백의 이름은 없다.'
	};
});

/* ───────────────────────────── #57 Heaven–Earth King ───────────────────────────── */
edit((story) => {
	const { ep, D, get, anchor } = helpers(story);
	const e = ep(57);
	if (e.blocks[0].html.includes('busy being wronged')) return false;
	const swap = (s) => s?.replaceAll('Daebyeol', 'Big Star').replaceAll('Sobyeol', 'Little Star');
	for (const b of e.blocks) {
		if (b.html) b.html = swap(b.html);
		if (b.en) b.en = b.en.map(swap);
	}
	const frame = get(e, 'Told on the first night');
	frame.html = 'Yuri Dora has a fire going and no plan to ask permission.';
	frame.ko = '유리도라는 불을 피워 두었고, 허락을 구할 생각은 없다.';
	const start = get(e, 'I’ll start at the beginning.');
	start.en = ['Ha. Then you want the one about a world stolen fair and square.', 'I’ll start at the beginning.', 'Sit or don’t.'];
	start.lines = ['하. 그럼 세상을 정정당당하게 도둑맞은 이야기가 필요하겠구나.', '처음부터 말하마.', '앉든 말든.'];

	const chant = e.blocks.find((b) => b.kind === 'quote' && b.source?.includes('Bepo-doeop-chim'));
	const climaxCards = e.blocks.filter((b, i) => b.kind === 'card' && !b.caption && i > 80);
	const moral = e.blocks.find((b) => b.kind === 'moral');
	e.blocks = e.blocks.filter((b) => b !== chant && b !== moral && !climaxCards.includes(b));

	e.blocks.splice(
		0,
		1,
		P(
			'The first night, the king of Tamla pours two cups. His guest stays by the door, busy being wronged.',
			'첫날 밤, 탐라의 임금이 잔 두 개를 채운다. 손님은 문가에 선 채로, 억울한 일을 당하는 중이다.'
		),
		frame,
		D('gyebek', ['The order was not his.', 'It had his seal. It was not his.'], ['그 교서는 폐하의 것이 아니었습니다.', '옥새는 폐하의 것이었습니다. 교서는 아니었습니다.']),
		D('yuridora', ['That’s the third time tonight.'], ['오늘 밤에만 세 번째다.']),
		D('gyebek', ['The fourth.'], ['네 번째입니다.'])
	);
	const last = e.blocks.at(-1);
	Object.assign(
		last,
		card(
			'The next night Gyebek finds a roof to mend. Yuri Dora finds a ladder. One woman made this island, and she was enormous…!',
			'다음 날 밤 계백은 고칠 지붕을 찾아낸다. 유리도라는 사다리를 찾아낸다. 이 섬은 한 여자가 만들었다. 어마어마하게 큰 여자가…!'
		)
	);
	anchor(e, 'hek-ink-moon', 'At midnight Little Star draws');
	anchor(e, 'hek-ink-riddle', 'Big Star proposes riddles');
});

/* ─────────────────────────────── #58 Sulmun ─────────────────────────────── */
edit((story) => {
	const { ep, D, get } = helpers(story);
	const e = ep(58);
	if (find(e, 'Guests don’t mend roofs.').length) return false;
	const g = (f) => get(e, f);
	const dupRecord = e.blocks.find((b) => b.kind === 'quote' && b.source?.includes('Sulmun Halmang legend'));
	e.blocks = [
		g('The next story is told to him on a roof'),
		D('yuridora', ['Guests don’t mend roofs.'], ['손님은 지붕 안 고친다.']),
		D('gyebek', ['I eat your rice. I mend your roof.', 'Then I owe nothing.'], ['밥을 먹었습니다. 지붕을 고칩니다.', '그러면 빚이 없습니다.']),
		D('yuridora', ['And when the roof’s done?'], ['지붕 다 고치면?']),
		D('gyebek', ['The wall.'], ['담입니다.']),
		P(
			'He drives a peg and counts it. Then, without looking down, he asks what he has wanted to ask all day.',
			'그는 나무못 하나를 박고 센다. 그러고는 내려다보지도 않고, 종일 묻고 싶던 것을 묻는다.'
		),
		D('gyebek', ['How far is the mainland.'], ['육지까지 얼마나 됩니까.']),
		D('yuridora', ['Two days, with a good wind.', 'Nobody here has a good wind for you, Turtle.'], ['바람 좋으면 이틀.', '여기엔 너한테 좋은 바람 내줄 놈이 없다, 거북아.']),
		D('gyebek', ['Is there a bridge.'], ['다리는 없습니까.']),
		D('yuridora', ['Ha! There nearly was.'], ['하! 있을 뻔했지.']),
		g('One woman made this island. Sulmun.'),
		g('Before the island there is a woman'),
		g('Some fell out on the way.'),
		e.blocks.find((b) => b.kind === 'card'),
		e.blocks.find((b) => b.kind === 'place'),
		g('Was there a hole in the apron.'),
		g('How did you know that?'),
		g('If it were poured in one place'),
		g('Yuri Dora looks at him for a while.'),
		g('You do not listen to a story.'),
		...e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gyebek' && b.en?.[0] === '…Yes.'),
		g('She had five hundred sons.'),
		P('The hammering stops.', '망치 소리가 멎는다.'),
		D('gyebek', ['…They said it was good.'], ['…맛있다고 했습니다.']),
		D('yuridora', ['The best they ever had.'], ['평생 먹어 본 것 중에 제일이라고.']),
		D('gyebek', ['It was not their fault that it was good.'], ['맛있었던 건 그들 잘못이 아닙니다.']),
		D('yuridora', ['No. That’s why the youngest walked into the sea.'], ['아니지. 그래서 막내가 바다로 걸어 들어간 거다.']),
		g('The youngest walked into the sea'),
		e.blocks.find((b) => b.kind === 'quote' && b !== dupRecord),
		D(
			'yuridora',
			['So the island had stone sons, and no bridge. She meant to fix that.'],
			['그래서 섬에는 돌이 된 아들들만 있고 다리는 없었지. 할망이 그걸 고치려 했다.']
		),
		g('They found ninety-nine'),
		g('They were one roll short.'),
		e.blocks.find((b) => b.kind === 'dialogue' && b.en?.[0] === 'They were.'),
		g('That is the worst amount to be short by.'),
		P(
			'He finishes the roof by feel after dark. He comes down with one peg left over, and goes back up to find the hole it belongs in.',
			'날이 저문 뒤에는 손으로 더듬어 지붕을 마친다. 내려와 보니 나무못이 하나 남는다. 그는 그 못이 들어갈 구멍을 찾으러 다시 올라간다.'
		),
		P('In the morning he cuts a notch in the beam by the door. Nine hundred and sixty.', '아침에 그는 문 옆 들보에 금을 하나 긋는다. 구백예순.'),
		g('Three princes climb out of the ground.')
	];
	if (e.blocks.some((b) => !b)) throw new Error('#58: missing block');
});

/* ─────────────────────────────── #59 Three Princes ─────────────────────────────── */
edit((story) => {
	const { ep, D, get, anchor } = helpers(story);
	const e = ep(59);
	if (e.blocks[0].html.includes('hatched from an egg')) return false;
	const g = (f) => get(e, f);
	const diver = g('Ordinary Tamla does not play');
	diver.html =
		'Ordinary Tamla does not play the mainland’s endless status games. A diver offers <b>Gyebek</b> grilled fish before she asks which Baekje office ruined him. Since the arrow he has not eaten food he did not watch being cooked. So he watches. She turns the fish; he watches the fish. She laughs at him and turns it slower. Kindness here is not strategy. It takes him most of a year to believe that.';
	diver.ko =
		'탐라의 보통 사람들은 육지의 끝없는 신분 놀이를 하지 않는다. 해녀 하나가 백제의 어느 관직이 그를 망쳤는지 묻기도 전에 <b>계백</b>에게 구운 생선부터 내민다. 화살 이후로 그는 굽는 걸 지켜보지 않은 음식은 먹지 않는다. 그래서 지켜본다. 그녀가 생선을 뒤집으면, 그는 생선을 본다. 그녀는 그를 보고 웃고는 더 천천히 뒤집는다. 여기 친절은 전략이 아니다. 그걸 믿는 데 그는 거의 한 해가 걸린다.';
	const oranges = g('Told while he is stacking oranges badly');
	oranges.html = 'Told some evenings later, while he is stacking oranges badly, which Yuri Dora treats as invitation.';
	oranges.ko = '며칠 저녁 뒤, 그가 귤을 서툴게 쌓는 동안 들려진 이야기. 유리도라는 그걸 초대로 본다.';
	const homeTurn = g('He came home and became the god of his own land.');
	e.blocks = [
		P(
			'Half the kingdoms on the mainland have a first king who hatched from an egg. Tamla is proud to say its kings climbed out of a hole.',
			'육지 나라 절반은 첫 임금이 알에서 나왔다. 탐라는 제 임금들이 구멍에서 기어 나왔다는 게 자랑이다.'
		),
		e.blocks.find((b) => b.kind === 'diagram'),
		get(e, 'The Diver', (b) => b.kind === 'scene'),
		diver,
		g('You look like a man who was promoted'),
		g('That is an exact sentence.'),
		g('We have those.'),
		D('gyebek', ['Why do you feed me.', 'I am Baekje’s prisoner.'], ['왜 저를 먹입니까.', '저는 백제의 죄인입니다.']),
		D(
			'haenyeo',
			['You’re the island’s guest.', 'This island came out of a hole in the ground, Turtle. It doesn’t ask whose son you are.'],
			['섬 손님이주.', '이 섬은 땅구멍에서 나왔수다, 거북아. 누구 아들인지 안 물어.']
		),
		P(
			'Long after the Great Lady’s stone sons, three divine princes climb out of a hole in the ground. Nobody hatches. They each shoot an arrow and rule wherever it lands. One day a box drifts from the East Sea, with a messenger and three princesses inside. They marry the three princesses at a pond. The box also holds calves, foals and the five grains. That is how Tamla learns to farm, and how it learns that anything worth having arrives by sea in a container.',
			'설문대할망의 돌 아들들이 생기고 한참 뒤, 신령한 왕자 셋이 땅구멍에서 기어 나온다. 알에서 깨어난 이는 없다. 셋은 저마다 활을 쏘아, 화살이 떨어진 땅을 다스린다. 어느 날 동쪽 바다에서 상자 하나가 떠밀려 오고, 그 안에 사자 하나와 공주 셋이 있다. 왕자들은 연못가에서 세 공주와 혼인한다. 상자에는 송아지와 망아지와 오곡도 들어 있다. 그렇게 탐라는 농사를 배운다. 그리고 쓸 만한 것은 죄다 바다 건너 상자에 담겨 온다는 것도 배운다.'
		),
		D('gyebek', ['And Baekje’s prisoners.'], ['백제의 죄인들도 그렇게 왔습니까.']),
		D('haenyeo', ['Those came later. Ask the king.'], ['그건 나중 얘기. 임금님한테 물어.']),
		get(e, 'Baekjuto and Socheon-guk', (b) => b.kind === 'scene'),
		oranges,
		D('gyebek', ['Do they go home.', 'The men Baekje sends here.'], ['돌아갑니까.', '백제가 여기 보낸 사람들 말입니다.']),
		D('yuridora', ['Some. Let me tell you about one whose own parents threw him out.'], ['더러는. 제 부모한테 버림받은 놈 이야기를 해 주마.']),
		...e.blocks.slice(e.blocks.indexOf(g('The hunting god married the farming goddess.')), e.blocks.indexOf(homeTurn) + 1),
		P(
			'On the way back he says the count out loud, which he has never done in front of anyone. Nine hundred and twelve. Yuri Dora hears it and, for once, says nothing.',
			'돌아오는 길에 그는 처음으로 남 앞에서 숫자를 소리 내어 말한다. 구백열둘. 유리도라가 그걸 듣고, 웬일로 아무 말도 하지 않는다.'
		),
		g('Tomorrow’s isn’t a kind one, Turtle.')
	];
	if (e.blocks.some((b) => !b)) throw new Error('#59: missing block');
	anchor(e, 'tamla-well', 'three divine princes climb out');
	anchor(e, 'princes-seq-rise', 'three divine princes climb out');
	anchor(e, 'princes-seq-arrows', 'They each shoot an arrow');
	anchor(e, 'yuridora-gwahama-shore', 'Tamla is proud to say');
});

/* ─────────────────────────────── #60 Stone Lady ─────────────────────────────── */
edit((story) => {
	const { ep, D, S, get } = helpers(story);
	const e = ep(60);
	if (find(e, 'You looked at the sea again.').length) return false;
	const g = (f) => get(e, f);
	const husband = g('Then don’t let go.');
	delete husband.person;
	husband.speaker = 'The Husband';
	husband.gender = 'm';
	const lady = g('when I hold your hand');
	const ladyLine = (en, ko) => ({ kind: 'dialogue', chip: lady.chip, person: lady.person, lines: ko, en });
	const quiet = g('So she went back into the rock.');
	quiet.en = ['She went back into the rock.', '…The rock did not lie to her.'];
	quiet.lines = ['바위로 돌아갔습니다.', '…바위는 그녀를 속이지 않았습니다.'];
	e.blocks = [
		g('Today’s is not a kind one.'),
		g('That is acceptable.'),
		P(
			'A year has gone. He still walks to the shore every dawn and looks at the sea, the same way, for the same count. Five hundred and ninety-six.',
			'한 해가 갔다. 그는 아직도 새벽마다 바닷가로 걸어가 바다를 본다. 같은 쪽으로, 같은 수만큼. 오백아흔여섯.'
		),
		D('yuridora', ['You looked at the sea again.'], ['또 바다 봤구나.']),
		D('gyebek', ['Every morning.'], ['매일 아침 봅니다.']),
		D('yuridora', ['Then you get the one about looking back.'], ['그럼 뒤돌아본 놈 이야기를 들어야지.']),
		g('the serpent in the cave at Gimnyeong'),
		g('Why did he look back.'),
		g('To check that he had won.'),
		D('gyebek', ['I will not look back.'], ['저는 뒤돌아보지 않습니다.']),
		D('yuridora', ['You look back every morning, Turtle. At the sea.'], ['매일 아침 돌아보잖느냐, 거북아. 바다를.']),
		D('gyebek', ['That is not back.', 'That is Sabi.'], ['그건 뒤가 아닙니다.', '사비입니다.']),
		e.blocks.find((b) => b.kind === 'scene'),
		g('who came down out of the rock to love a poor man'),
		e.blocks.find((b) => b.kind === 'card'),
		lady,
		husband,
		P('Then an official on a tax round sees her at the spring.', '그러다 세금 걷으러 돌던 관리가 샘가에서 그녀를 본다.'),
		S('The Official', 'm', '#5f5a52', ['A woman out of the rock belongs to the government.', 'Like the rock.'], ['바위에서 나온 여자는 관아 것이다.', '바위처럼.']),
		S('The Husband', 'm', husband.chip, ['She belongs to nobody. She picked a hut.'], ['이 사람은 누구 것도 아니오. 오두막을 고른 거요.']),
		P(
			'Poor men always owe something somewhere, and the official finds it. Then the official has the husband killed to take her.',
			'가난한 사내는 어딘가에 늘 빚이 있고, 관리는 그걸 찾아낸다. 그러고는 관리가 남편을 죽여 그녀를 차지하려 한다.'
		),
		ladyLine(['You wanted me because I wasn’t stone.', 'Look again.'], ['내가 돌이 아니라서 탐냈지.', '다시 봐.']),
		P('She walks back into the cliff. The spring inside it has not stopped since.', '그녀는 절벽 속으로 돌아간다. 그 안의 샘물은 그 뒤로 마른 적이 없다.'),
		quiet,
		g('Do all the stories on this island end badly.'),
		g('They all end as'),
		get(e, 'Gameunjang', (b) => b.kind === 'scene'),
		g('Told at a well'),
		g('A rich man had three daughters.'),
		g('The youngest said her own navel-string.'),
		e.blocks.find((b) => b.kind === 'quote' && b.source?.includes('Samgong')),
		g('If she had lied she could have stayed.'),
		g('She could have.'),
		g('three brothers digging yams'),
		g('beggars’ feast'),
		g('So the child they threw away was the luck.'),
		g('The luck was always hers.'),
		g('tests it eleven times'),
		g('Heaven sends for a man to keep its flower field.')
	];
	if (e.blocks.some((b) => !b)) throw new Error('#60: missing block');
});

/* ─────────────────────────────── #61 Gardener ─────────────────────────────── */
edit((story) => {
	const { ep, D, get } = helpers(story);
	const e = ep(61);
	if (find(e, 'Can the boat carry a word.').length) return false;
	const g = (f) => get(e, f);
	const mother = g('Wonganghami');
	mother.html = mother.html.replace('Wonganghami said no', 'She said no');
	mother.ko = mother.ko.replace('원강아미는 싫다 했고', '그녀는 싫다 했고');
	const record = e.blocks.find((b) => b.kind === 'quote');
	const morals = e.blocks.filter((b) => b.kind === 'moral');
	const twice = g('That one he asks to hear twice.');
	const death = g('They killed him for it.');
	const revive = g('She took what she needed');
	const out = [];
	for (const b of e.blocks) {
		if (b === record || morals.includes(b) || b === twice) continue;
		if (b === death) {
			out.push(
				P(
					'Heaven does not care for that sort of marriage. They kill him for it, and send his body down the parting stream, past her.',
					'하늘은 그런 혼인을 좋아하지 않는다. 사람들은 그 일로 도령을 죽이고, 그 몸을 이별의 냇물에 띄워 그녀 앞으로 흘려보낸다.'
				),
				D('jacheongbi', ['You noticed me late.', 'You don’t get to leave early.'], ['늦게 알아봤으면서.', '먼저 가는 건 안 돼.']),
				P('So she walks west, past every gate, into the Western Flower Field.', '그래서 그녀는 서쪽으로 걷는다. 있는 문이란 문을 다 지나, 서천꽃밭으로.')
			);
			continue;
		}
		if (b === revive) {
			out.push(
				P(
					'She picks the five flowers in order and puts him back together bone by bone. Bone, flesh, blood, breath, soul. He sits up on the bank like a man woken too early.',
					'그녀는 다섯 꽃을 차례대로 꺾어 그를 뼈 하나하나 다시 맞춘다. 뼈, 살, 피, 숨, 혼. 그는 너무 일찍 깨운 사람처럼 냇가에 일어나 앉는다.'
				),
				D('mundoryeong', ['…How long was I gone.'], ['…내가 얼마나 없었소.']),
				D('jacheongbi', ['Long enough. Don’t do it again.'], ['충분히. 다시는 그러지 마.']),
				P(
					'Then she brings the five grains down to Tamla, because a woman who has been to the end of the west does not come home empty-handed.',
					'그러고는 오곡을 탐라로 가지고 내려온다. 서쪽 끝까지 다녀온 여자는 빈손으로 돌아오지 않는 법이다.'
				)
			);
			continue;
		}
		out.push(b);
		if ((b.html ?? '').startsWith('Told in the orange grove')) {
			out.push(
				P(
					'The baskets are for the tribute boat. It leaves for Sabi in the morning, full of oranges and empty of him.',
					'광주리들은 조공선에 실릴 것이다. 배는 내일 아침 사비로 떠난다. 귤은 가득, 그는 없이.'
				),
				D('gyebek', ['Can the boat carry a word.'], ['배에 말 한 마디 실을 수 있습니까.']),
				D('yuridora', ['To your king?'], ['네 임금한테?']),
				P('He does not answer, which is new.', '그는 대답하지 않는다. 처음 있는 일이다.'),
				D('yuridora', ['Hm. Then sit. Here’s one about a man who left somebody waiting.'], ['흠. 그럼 앉아라. 누굴 기다리게 해 놓고 간 놈 이야기다.'])
			);
		}
		if ((b.en ?? []).some((l) => l.includes('You ask the right questions in the wrong places'))) {
			out.push(
				D('gyebek', ['I did not say either.'], ['저도 말하지 않았습니다.']),
				D('yuridora', ['Say what?'], ['뭘?']),
				D('gyebek', ['How long.', 'My wife asked at the berth. I said I did not know.'], ['얼마나인지.', '아내가 부두에서 물었습니다. 모른다고 했습니다.']),
				P('Yuri Dora puts down his orange.', '유리도라가 까던 귤을 내려놓는다.'),
				D('yuridora', ['You have a wife.'], ['너 마누라가 있냐.']),
				D('gyebek', ['And a son. And a daughter.'], ['아들 하나. 딸 하나 있습니다.']),
				D('yuridora', ['A whole year of evenings, and you never said.'], ['한 해 내내 저녁마다 붙어 앉아 놓고, 말 한 번을 안 했어.']),
				D('gyebek', ['You did not ask.'], ['묻지 않으셨습니다.']),
				D('yuridora', ['……So. The word on the boat.'], ['……그래서. 배에 실을 말은.']),
				D(
					'gyebek',
					['Tell her three hundred and forty-one days.', 'Then His Majesty can sign. Then he sends for me.'],
					['삼백마흔하루라고 전해 주십시오.', '그때 폐하께서 서명하십니다. 그때 저를 부르십니다.']
				),
				P('It is the first number he has ever given her. It is the king’s.', '그가 아내에게 준 첫 숫자다. 그리고 그건 왕의 숫자다.')
			);
		}
	}
	if (out.length - e.blocks.length < 10) throw new Error('#61: inserts did not land');
	e.blocks = out;
});

/* ─────────────────────────────── #62 Kangrim ─────────────────────────────── */
edit((story) => {
	const { ep, D, get } = helpers(story);
	const e = ep(62);
	if (e.blocks[0].html.includes('a death gets a fire')) return false;
	const g = (f) => get(e, f);
	const fetch = g('woke as a chasa');
	fetch.html = fetch.html.replace('woke as a chasa', 'woke as a fetch of the dead');
	fetch.ko = fetch.ko.replace('차사로 깨어났다', '저승차사로 깨어났다');
	const errand = g('One errand was left.');
	errand.html =
		'One errand was left: a man who had dodged death for three thousand years. Kangrim sat in a stream washing charcoal until the old man stopped to laugh at him, and took him by the sleeve. Only then did Yumla seat him as the one who comes for everyone else. That is why he asks a question at the threshold. Not for the sentence — Yumla keeps the sentence. A scrambled list still deserves accurate last words.';
	errand.ko =
		'심부름이 하나 남았다. 삼천 년을 죽음에서 빠져나간 사내였다. 강림은 냇가에 앉아 숯을 씻었고, 늙은이가 비웃으려고 걸음을 멈추자 그 소매를 잡았다. 그제야 염라는 그를, 나머지 모두를 데리러 가는 자로 앉혔다. 그래서 그는 문턱에서 질문을 한다. 판결을 위해서가 아니다. 판결은 염라가 내린다. 뒤섞인 명부에도 정확한 마지막 말은 필요하니까.';
	const caseBlock = g('A magistrate named Kimchi');
	const moral = e.blocks.find((b) => b.kind === 'moral');
	const oldCard = e.blocks.at(-1);
	const out = [
		P('On this island, a death gets a fire on the shore and one story.', '이 섬에서는 누가 죽으면 바닷가에 불을 피우고 이야기 하나를 한다.'),
		P(
			'This winter it is the diver who grilled his fish. She went down at the third rock and did not come up. Gyebek was in the water with the others until dark, counting other people’s breaths.',
			'이번 겨울에는 그에게 생선을 구워 주던 해녀다. 셋째 바위에서 물에 들어가 올라오지 않았다. 계백은 해 질 때까지 다른 이들과 물속에 있었다. 남의 숨을 세면서.'
		),
		D('gyebek', ['She was twenty-six.', 'Her mother is on the shore.'], ['스물여섯이었습니다.', '그 어머니는 바닷가에 있습니다.']),
		D('yuridora', ['She is.'], ['그렇지.']),
		D('gyebek', ['That is the wrong order.'], ['순서가 틀렸습니다.']),
		D('yuridora', ['It is. Sit, Turtle. The island keeps one story for last, and this is why.'], ['틀렸지. 앉아라, 거북아. 섬이 이야기 하나를 끝까지 아껴 두는 게 이래서다.'])
	];
	for (const b of e.blocks.slice(1)) {
		if (b === moral || b === oldCard) continue;
		if (b === caseBlock) {
			out.push(
				P(
					'A rich couple killed three brothers for their silk and sank them in a pond. The brothers came back, and died again, and no living court could try a case like that. So the magistrate, a man called Gimchi, sent his strongest man down to fetch the judge of the dead.',
					'부잣집 내외가 비단 때문에 삼형제를 죽여 못에 가라앉혔다. 삼형제는 돌아왔다가 또 죽었고, 산 사람의 관아로는 그런 사건을 심리할 수가 없었다. 그래서 김치라는 원님이 제일 힘센 부하를 저승으로 보내 죽은 자의 판관을 데려오게 했다.'
				),
				D('gyebek', ['How did they come back.'], ['어떻게 돌아왔습니까.']),
				D(
					'yuridora',
					['Three flowers on the water. Three beads. Three sons. Don’t ask, that part takes a whole night.', 'And yes, Gimchi. Don’t laugh. He was a serious man.'],
					['물 위에 꽃 셋. 구슬 셋. 아들 셋. 묻지 마라, 그것만 하룻밤 걸린다.', '그리고 그래, 김치. 웃지 마라. 진지한 양반이었다.']
				),
				D('gyebek', ['I was not going to laugh.'], ['웃을 생각 없었습니다.'])
			);
			continue;
		}
		out.push(b);
		if ((b.en ?? []).some((l) => l.includes('That is the key.'))) {
			out.push(
				D('gyebek', ['Then she gets a question.'], ['그럼 그 사람도 질문을 받습니까.']),
				D('yuridora', ['She gets a question. And she gets to answer it.'], ['받지. 대답도 하고.']),
				P(
					'Walking home, he says the count to the dark. Twelve. In twelve days the king’s rite ends, and the tribute boat is already in Sabi.',
					'돌아오는 길에 그는 어둠에 대고 숫자를 말한다. 열둘. 열이틀이면 왕의 상이 끝나고, 조공선은 벌써 사비에 가 있다.'
				)
			);
		}
	}
	out.push(
		card(
			'In spring the tribute boat comes back from Sabi with news of the king. Gyebek has one question for it…!',
			'봄, 조공선이 왕의 소식을 싣고 사비에서 돌아온다. 계백이 물을 것은 하나뿐이다…!'
		)
	);
	if (!out.some((b) => (b.html ?? '').startsWith('Walking home'))) throw new Error('#62: frame end did not land');
	e.blocks = out;
	e.logline = {
		en: 'A diver drowns, and the island tells its last story: the strongman who went down alive to arrest the judge of the dead, and the crow that lost the book of everyone’s hour.',
		ko: '해녀 하나가 물에서 돌아오지 않고, 섬은 마지막 이야기를 한다. 산 채로 저승에 내려가 죽은 자의 판관을 잡아 오려던 장사와, 모두의 시각이 적힌 책을 잃어버린 까마귀 이야기.'
	};
});

edit((story) => {
	const { ep, anchor } = helpers(story);
	const e = ep(59);
	if (e.images.find((i) => i.id === 'yuridora-gwahama-oranges')?.at === 'while he is stacking oranges badly') return false;
	anchor(e, 'yuridora-gwahama-oranges', 'while he is stacking oranges badly');
});

/* Second pass: grow the three stubs by one played beat each; merge Yuri Dora's two lines in #56. */
edit((story) => {
	const { ep, D, get } = helpers(story);
	if (find(ep(58), 'I will count them.').length) return false;

	const e56 = ep(56);
	const cal = get(e56, 'A man who carries his own calendar.');
	const nameQ = get(e56, 'Your name?');
	nameQ.en = ['Ha. A man who carries his own calendar.', 'Your name?'];
	nameQ.lines = ['허. 달력을 품고 다니는 놈이로구나.', '이름은?'];
	e56.blocks.splice(e56.blocks.indexOf(cal), 1);

	const e58 = ep(58);
	const stones = get(e58, 'Nobody has ever got the same number twice.');
	e58.blocks.splice(
		e58.blocks.indexOf(stones) + 1,
		0,
		D('gyebek', ['I will count them.'], ['제가 세겠습니다.']),
		D('yuridora', ['Everybody says that.'], ['다들 그 소리 한다.']),
		P(
			'He counts them on his first free morning and gets four hundred and ninety-eight. He goes back the next morning to find the one he missed.',
			'첫 쉬는 아침에 그는 그걸 센다. 사백아흔여덟. 다음 날 아침 그는 빠뜨린 하나를 찾으러 다시 간다.'
		)
	);

	const e59 = ep(59);
	const home = get(e59, 'He came home and became the god of his own land.');
	e59.blocks.splice(
		e59.blocks.indexOf(home) + 1,
		0,
		D('gyebek', ['How long was he in the chest.'], ['상자 안에 얼마나 있었습니까.']),
		D('yuridora', ['Years.'], ['몇 해.']),
		D('gyebek', ['How many.'], ['몇 해입니까.']),
		D('yuridora', ['The story doesn’t say.'], ['이야기엔 안 나와.']),
		D('gyebek', ['…It should.'], ['…나와야 합니다.'])
	);

	const e60 = ep(60);
	const well = get(e60, 'Told at a well');
	e60.blocks.splice(
		e60.blocks.indexOf(well) + 1,
		0,
		D('gyebek', ['The men Baekje sends here.', 'Were any of them right.'], ['백제가 여기 보낸 사람들 말입니다.', '그중에 옳았던 사람이 있습니까.']),
		D('yuridora', ['Right about what?'], ['뭐가 옳았냐고?']),
		D('gyebek', ['Anything.'], ['무엇이든.']),
		D('yuridora', ['Ha. Here’s a girl who was right about one thing. It went badly for her family.'], ['하. 딱 하나 옳았던 계집애 이야기를 해 주마. 그 집안은 그 때문에 망했지.'])
	);
});

console.log('tamla patch done');
