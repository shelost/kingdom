// Rewrite of #64–#71 (The Fall of Euija, Euija/Gyebek spine). Run once: node scripts/.cache/rewrite/euija.mjs
// Each episode is its own editStory call and skips itself if its marker text is already present.
import { editStory, find, textOf } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const CARD = (html, ko) => ({ kind: 'p', html: `<b>${html}</b>`, ko: `<b>${ko}</b>` });
const S = (label, ko) => ({ kind: 'scene', label, ko });

let chips = {};
function loadChips(story) {
	chips = {};
	const walk = (bs) =>
		bs.forEach((b) => {
			if (b.kind === 'dialogue' && b.person && b.chip && !chips[b.person]) chips[b.person] = b.chip;
			if (b.blocks) walk(b.blocks);
		});
	for (const c of story) for (const e of c.entries) walk(e.blocks);
}
const D = (person, en, ko, extra = {}) => ({ kind: 'dialogue', person, chip: chips[person] ?? '#8d8d95', lines: ko, en, ...extra });
/** Unprofiled speaker with a label. */
const U = (speaker, gender, en, ko, chip = '#8d8d95') => ({ kind: 'dialogue', chip, speaker, gender, lines: ko, en });

function episode(n, marker, fn) {
	editStory((story) => {
		loadChips(story);
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (e.blocks.some((b) => textOf(b).includes(marker) || (b.blocks ?? []).some((x) => textOf(x).includes(marker)))) {
			console.log(`#${n} already rewritten, skipped`);
			return false;
		}
		const K = (frag, pred = () => true) => {
			const h = find(e, frag, pred);
			if (!h.length) throw new Error(`#${n}: no block with "${frag}"`);
			return h[0].b;
		};
		const kind = (k) => K('', (b) => b.kind === k);
		fn(e, K, kind);
		console.log(`#${n} ${e.title}: rewritten (${e.blocks.length} blocks)`);
	});
}

/** Re-point image anchors: { oldAt: newAt }. */
function reanchor(e, map) {
	for (const im of e.images ?? []) if (im.at != null && map[im.at] != null) im.at = map[im.at];
}

// ───────────────────────────── #64 Coup ─────────────────────────────
episode(64, 'He folds the letter into his sleeve', (e, K, kind) => {
	e.year = '657';
	const map = kind('map');
	map.year = 657;
	const diagram = kind('diagram');
	diagram.title = 'The Rock of Politics, after · 정사암, 그 후';
	const named = K('is named Premier');
	named.html = '<b>Satek Chunbok</b> is named Premier. His own clan watches him walk to the chair. The Enabling Law did not abolish the chair. It only changed who sits in it.';
	named.ko = '<b>사택춘복</b>이 상좌평에 오른다. 제 가문이 그가 그 자리로 걸어가는 것을 지켜본다. 수권법은 그 자리를 없애지 않았다. 앉는 사람만 바꿨을 뿐이다.';
	const eleven = K('Eleven of them by nightfall');
	eleven.html = 'Eleven of them by morning.';
	eleven.ko = '아침이 오기 전에 열하나가 된다.';

	e.blocks = [
		K('the way a gambler calls a final hand'),
		map,
		P(
			'Mourning ends at dawn. By breakfast <b>Euija</b> has called the Ministers’ Assembly to the Rock of Politics. The rock is dry. Someone forgot the brine, or remembered it and chose not to.',
			'상은 새벽에 끝난다. 아침상이 들어오기도 전에 <b>의자</b>는 정사암으로 회의를 소집한다. 바위는 말라 있다. 소금물을 잊었거나, 기억하고도 바르지 않았다.'
		),
		D(
			'euija',
			[
				'Beloved people.',
				'As Eraha, I appeal to you with a heart that spits blood.',
				'To eradicate in one stroke the shameless pro-Tang anti-state forces that plunder our people’s freedom and happiness —',
				'I hereby declare emergency martial law.'
			],
			['친애하는 백성 여러분.', '어라하로서, 피 토하는 심정으로 호소하오.', '우리 백성의 자유와 행복을 약탈하는 파렴치한 친당 반국가세력을 일거에 척결하기 위해 —', '비상계엄을 선포하오.']
		),
		P(
			'Somebody coughs. Nobody looks at the rock. On the Satek bench a young man leans to his elder and whispers, loud enough to carry two benches over.',
			'누군가 기침을 한다. 아무도 바위를 보지 않는다. 사택 쪽 자리에서 젊은 사내 하나가 어른 쪽으로 몸을 기울여 속삭인다. 두 자리 건너까지 들릴 만큼.'
		),
		K('I can smell the ink'),
		D(
			'euija',
			[
				'There may be some inconveniences for the good people who have followed the lawful order of this country.',
				'We will strive to minimize such inconveniences.',
				'I place my trust solely in you.',
				'Please trust me.'
			],
			['이 나라의 법도를 믿고 따라 온 선량한 백성들께 다소 불편이 있을 수 있소.', '그 불편을 최소화하도록 노력하겠소.', '과인은 오직 여러분만을 믿소.', '과인을 믿어 주시오.']
		),
		D('ministersatek', ['Majesty. For how long?'], ['폐하. 언제까지입니까?']),
		K('Temporary is how permanent things begin'),
		K('Law to Remedy the Distress'),
		D(
			'euija',
			[
				'Laws of Baekje may also be enacted by the Eraha’s command.',
				'Such laws may deviate from old custom — insofar as the Assembly as such is not abolished.',
				'The existence of the Assembly is not endangered. The Premier’s chair remains undisturbed.'
			],
			['백제의 법은 회의가 정한 절차 외에, 어라하의 명으로도 제정할 수 있다.', '그 법은 옛 관례에서 벗어날 수 있다 — 회의 그 자체를 폐하지 않는 한.', '회의의 존립은 위태롭지 않다. 상좌평의 자리도 그대로 둔다.']
		),
		K('a law for emptying the Assembly'),
		K('peace, or war'),
		P(
			'Nobody chooses war out loud. Choosing peace means raising a sleeve for the scroll, and for a long moment nobody does that either. Then a sleeve goes up on the Satek bench. It belongs to <b>Satek Chunbok</b>, the young man who was whispering about wet ink.',
			'아무도 큰 소리로 전쟁을 고르지 않는다. 평화를 고르려면 두루마리에 소매를 들어야 하는데, 한참 동안 그것도 아무도 하지 않는다. 그때 사택 쪽 자리에서 소매 하나가 올라간다. 젖은 먹 냄새를 속삭이던 그 젊은이, <b>사택춘복</b>이다.'
		),
		D('ministersatek', ['Chunbok. Put your arm down.'], ['춘복아. 팔 내려라.']),
		D('chunbok', ['As my lord well knows, His Majesty asked for peace or war.', 'I am choosing peace.'], ['어르신께서도 잘 아시다시피, 폐하께서는 평화냐 전쟁이냐를 물으셨습니다.', '저는 평화를 고르겠습니다.']),
		P(
			'The old men try to rally, Satek calling in four generations of favors. Too late. The other houses, the ones Satek kept out of the light for a century, raise their sleeves one after another, delighted. Some are already paid. Some are already afraid. Some are the king’s own sons, waiting in the corridor.',
			'늙은 대신들이 판을 되돌리려 한다. 사택은 사 대에 걸친 빚을 한꺼번에 불러들인다. 너무 늦었다. 백 년 동안 사택에 가려 그늘에 있던 다른 가문들이 신이 나서 하나씩 소매를 든다. 이미 삯을 받은 자, 이미 겁난 자, 그리고 복도에서 기다리던 왕의 아들들.'
		),
		P(
			'A face-off only works if you know your opponent’s style, and Euija has spent twenty years teaching them his. They lined up for a duel. He had already changed who was sitting.',
			'맞대결은 상대의 수를 알 때나 통한다. 의자는 이십 년 동안 그들에게 자기 수를 가르쳐 왔다. 그들은 결투하려고 줄을 섰다. 그는 이미 앉는 사람을 바꿔 놓았다.'
		),
		K('of his own sons to the Assembly'),
		diagram,
		named,
		kind('card'),
		K('puts it in a drawer'),
		kind('place'),
		K('quiet money'),
		K('He cannot do what Yeon did'),
		K('That Night', (b) => b.kind === 'scene'),
		P(
			'That night he writes one letter himself, with no clerk in the room. It is short, because the man it is for cannot read. A boatman will have to say it to him aloud.',
			'그날 밤 그는 서기도 물리고 손수 편지 한 장을 쓴다. 짧다. 받을 사람이 글을 못 읽기 때문이다. 뱃사공이 소리 내어 일러 줘야 할 것이다.'
		),
		D('euija', ['Tamla. The fastest boat in the harbour.', 'Tonight, Chunbok. Before the old men finish counting what they lost.'], ['탐라다. 포구에서 제일 빠른 배로.', '오늘 밤이다, 춘복. 늙은이들이 잃은 걸 다 세기 전에.']),
		D(
			'chunbok',
			[
				'Your Majesty… as Your Majesty well knows, the houses are counting tonight.',
				'If a boat leaves for Tamla before the benches are cold, they will read it as war.',
				'Let them get used to losing first. A month. Then send for him.'
			],
			['폐하… 폐하께서도 잘 아시다시피, 오늘 밤 가문들은 셈을 하고 있습니다.', '자리가 식기도 전에 탐라로 배가 떠나면, 저들은 그것을 전쟁으로 읽을 것입니다.', '먼저 지는 데 익숙해지게 두십시오. 한 달입니다. 그다음에 부르십시오.']
		),
		D('euija', ['…A month.', 'Fine. A month. He’s good at waiting. He counts.'], ['…한 달.', '좋다. 한 달. 그놈은 기다리는 건 잘해. 세거든.']),
		P('He folds the letter into his sleeve. It will stay there a good deal longer than a month.', '그는 편지를 접어 소매에 넣는다. 그 편지는 한 달보다 훨씬 오래 거기 머물 것이다.'),
		K('How many did you dismiss today?'),
		K('You… I keep.'),
		K('How frightening.'),
		K('What was your name again'),
		K('As you did for General Gyebek'),
		eleven,
		P(
			'Months later, the new Premier is in Chang’an, talking too much. A spy who learns his trade that well rarely works for only one house.',
			'몇 달 뒤, 새 상좌평은 장안에서 말이 많다. 일을 그만큼 잘 배운 첩자는 한 집만 섬기는 법이 드물다.'
		),
		K('Chang’an', (b) => b.kind === 'scene'),
		K('What of Baekje—'),
		K('Do not trouble yourself over Baekje'),
		K('?', (b) => b.kind === 'dialogue' && b.person === 'gaozong' && b.en?.[0] === '?'),
		K('Baekje will fall on its own'),
		K('Then why am I needed at all?'),
		K('However weak it is'),
		K('He beat eight houses in one morning')
	];
	reanchor(e, {
		'Ministers’ Assembly at Deer Rock': 'Ministers’ Assembly to the Rock of Politics'
	});
});

// ───────────────────────────── #65 Descent ─────────────────────────────
episode(65, 'Here is what the lamps do not show', (e, K) => {
	e.year = '657';
	e.sub = 'September';
	const openCourt = K('Open court.', (b) => b.kind === 'dialogue');
	openCourt.en = ['Your Majesty. Open court. Today.'];
	openCourt.lines = ['폐하. 조회를 여십시오. 오늘.'];
	const names = K('reads his name three times');
	names.html = names.html.replaceAll('Seongchung', 'Sungchung');
	const asks = K('You chose the cell over silence');
	asks.en = asks.en.map((l) => l.replaceAll('Seongchung', 'Sungchung'));

	e.blocks = [
		K('Nightmares', (b) => b.kind === 'scene'),
		K('He starts dreaming about the Rock of Politics'),
		K('Some nights it is the white deer'),
		K('Who’s counting?'),
		K('You were saying numbers again'),
		K('I can tell when you water it'),
		S('The Hall', '전각'),
		P('The first man to say the obvious thing out loud is <b>Heungsu</b>. He says it smiling, the way he says everything.', '뻔한 말을 맨 먼저 소리 내어 한 사람은 <b>흥수</b>다. 늘 그렇듯 웃으면서 한다.'),
		D(
			'heungsu',
			['The Diamond Sutra says every made thing is like a dream, Majesty. A dewdrop. A flash of lightning.', 'Your new Assembly is a made thing.'],
			['금강경에 이르기를, 지어진 모든 것은 꿈과 같다 하였습니다, 폐하. 이슬 같고 번개 같다고.', '폐하의 새 회의도 지어진 것입니다.']
		),
		D('euija', ['Heungsu. Is this a sermon or a memorial?'], ['흥수. 이게 설법이냐, 상소냐?']),
		D(
			'heungsu',
			['Both, Majesty. The sermon is free.', 'Bring the Satek and Yunbi men back to the benches before winter. If Silla comes, it comes over Tanhyeon. If Tang comes—'],
			['둘 다입니다, 폐하. 설법은 공짜고요.', '겨울이 오기 전에 사택과 윤비 사람들을 자리로 돌려놓으십시오. 신라가 온다면 탄현으로 옵니다. 당이 온다면—']
		),
		D(
			'euija',
			['—it comes up the river. Yes. I can read a map.', 'You have a lovely voice, Heungsu. Gomamiji has nobody to hear it. Go and read them sutras.'],
			['—강으로 온다. 그래. 과인도 지도는 읽을 줄 안다.', '목소리 좋구나, 흥수. 고마미지에는 그걸 들어 줄 사람이 없지. 가서 그들에게 경이나 읽어 주거라.']
		),
		P(
			'Euija calls it a temporary posting. The court knows better. The paper names a county far to the south: packed earth, a magistrate’s hut, and a long way from anyone who matters.',
			'의자는 잠시 내려보내는 것이라 한다. 조정은 다 안다. 종이에 적힌 곳은 먼 남쪽 고을이다. 다져진 흙, 원님 오두막 하나, 그리고 중요한 사람들에게서 아주 먼 곳.'
		),
		K('Gomamiji', (b) => b.kind === 'scene'),
		P(
			'Gomamiji is a posting, not a retirement. He sits on the threshold until the dust on the hem looks like the hem. His office sword hangs on the doorpost. Nobody from Sabi writes.',
			'고마미지는 부임지다. 은퇴가 아니다. 그는 문지방에 앉아 있다. 옷자락의 먼지가 옷자락처럼 보일 때까지. 관직 칼은 문설주에 걸려 있다. 사비에서는 아무도 편지하지 않는다.'
		),
		K('The Banquet Hall', (b) => b.kind === 'scene'),
		K('The wine comes earlier each day'),
		K('Hundreds, by now'),
		K('The hems keep time'),
		P(
			'The feast is no longer a feast. The stories say three thousand. The room is not that. It is still too many, a harem so packed the lamp never finds a wall. Robes open early. The maids show him their bodies the way other courts show tribute, and he studies them the way he once studied a map.',
			'연회는 더 이상 연회가 아니다. 이야기로는 삼천이라 한다. 방이 그만큼은 아니다. 그래도 너무 많다. 등불이 벽에 닿지 못할 만큼 빽빽한 후궁이다. 옷고름은 일찍 풀린다. 궁녀들은 다른 조정이 조공을 바치듯 그에게 몸을 내보이고, 그는 예전에 지도를 들여다보던 눈으로 그것을 들여다본다.'
		),
		P(
			'He is half-undressed by the second jar and does not bother to hide what the wine has done to him. They climb into his lap two at a time. They hike the silk and laugh when he looks. They toast until the lamps blur. On rainy nights the party spills out onto the night veranda, and he follows a hip down the night corridor as if it were the last order anyone will ever give him.',
			'두 번째 단지쯤이면 그는 반쯤 벗었고, 술이 제 몸에 한 일을 굳이 감추지도 않는다. 궁녀들은 둘씩 그의 무릎에 오른다. 비단 자락을 걷어 올리고, 그가 보면 웃는다. 등불이 번질 때까지 잔을 든다. 비 오는 밤이면 잔치는 밤 툇마루로 넘쳐 나가고, 그는 누군가의 허리를 따라 밤 복도를 걷는다. 그것이 세상에 남은 마지막 명령이라도 되는 듯이.'
		),
		P(
			'Here is what the lamps do not show. The headband is gone, and nobody tells him to put it back on. The prince who could read a room in one glance cannot read past the next fold of silk. Every one of them flatters him. He knows it, and he likes knowing it. It is the only sum left in Sabi that always comes out in his favour.',
			'등불이 보여 주지 않는 것이 있다. 머리띠는 사라졌고, 다시 매라고 말하는 사람은 없다. 한 번 훑어보면 방 하나를 다 읽던 왕자가, 이제는 다음 비단 주름 너머를 읽지 못한다. 모두가 그에게 아첨한다. 그도 안다. 알아서 좋다. 사비에 남은 셈 가운데 언제나 그에게 유리하게 떨어지는 셈은 그것 하나뿐이다.'
		),
		K('You said that yesterday'),
		K('Was it good?'),
		K('The body still remembers'),
		K('Tell us about when you were young'),
		K('What is it you want to know'),
		K('more than fifty sons'),
		K('That was the thirtieth Eraha'),
		K('still has room to work with'),
		K('Asking was only manners'),
		K('He laughs for the first time in four months'),
		K('Somewhere in the third year'),
		P(
			'Every season Chunbok asks the same question, in front of witnesses, the way a careful man pays a small tax. It buys him a name for loyalty. He already knows the answer.',
			'철마다 춘복은 사람들 앞에서 같은 질문을 한다. 조심성 많은 사람이 작은 세금을 내듯이. 그걸로 충신이라는 이름을 산다. 답은 이미 알고 있다.'
		),
		K('Your Majesty…', (b) => b.person === 'chunbok' && b.en.length === 1 && b.en[0] === 'Your Majesty…'),
		K('bring back General Gyebek'),
		P('The letter is still in the king’s sleeve. It has gone soft at the folds.', '편지는 아직 왕의 소매 속에 있다. 접힌 자리가 보드라워졌다.'),
		K('That… who?'),
		K('over here, Your Majesty'),
		K('The ministers are waiting outside'),
		K('Let them wait'),
		K('Until when?'),
		K('…', (b) => b.person === 'euija' && b.en.length === 1 && b.en[0] === '…'),
		K('He does not answer. After a while'),
		P(
			'<b>Sungchung</b> comes while the wine is still being poured. He does not wait for a gap. He is the councillor who used to read the tides for the king, and he still wears his office sword as if there were an office.',
			'<b>성충</b>은 술이 아직 따라지는 중에 온다. 틈을 기다리지 않는다. 왕을 위해 물때를 읽던 좌평이다. 아직 관직이 있다는 듯 허리에 관직 칼을 차고 있다.'
		),
		openCourt,
		K('With the cup.'),
		K('There is a tide.'),
		P('He does not finish. The king is already on his feet.', '끝내지 못한다. 왕은 이미 일어서 있다.'),
		D('euija', ['Take his belt.', 'He wants open court? Give him a room where he can talk all day.'], ['저놈 허리띠를 풀어라.', '조회를 열라고? 하루 종일 떠들 수 있는 방을 하나 내줘라.']),
		P(
			'The belt comes off in the aisle, and his rank goes with it. The guards walk him to a cell. After that, nobody else tries to speak.',
			'허리띠가 복도에서 벗겨지고, 품계도 함께 벗겨진다. 군졸들이 그를 옥으로 끌고 간다. 그 뒤로는 아무도 입을 열려 하지 않는다.'
		),
		K('The Cell', (b) => b.kind === 'scene'),
		P(
			'<b>Sungchung</b> starves in a cell within earshot of the feast. His office sword hangs on the post outside. With the last of his ink he writes the king one page.',
			'<b>성충</b>은 연회 소리가 들리는 옥에서 굶어 간다. 관직 칼은 바깥 기둥에 걸려 있다. 마지막 남은 먹으로, 왕에게 종이 한 장을 쓴다.'
		),
		names,
		asks,
		K('Being right is the only loyalty left'),
		K('I will keep the minutes'),
		K('A loyal servant does not forget his king', (b) => b.kind === 'quote'),
		P(
			'The page reaches the banquet hall folded inside a guard’s glove. The king reads the first line. Then he sets it under a wine jar, and does not take it in.',
			'그 종이는 군졸의 장갑 속에 접힌 채 연회장에 닿는다. 왕은 첫 줄을 읽는다. 그러고는 술 단지 밑에 깔아 두고, 마음에 들이지 않는다.'
		),
		K('Foxes in the Assembly')
	];

	const to = (frag, olds) => Object.fromEntries(olds.map((o) => [o, frag]));
	reanchor(e, {
		'King Euija': 'He starts dreaming about the Rock of Politics',
		'tries to stop him, but is thrown in prison': 'The guards walk him to a cell',
		...to('a harem so packed', ['They kneel in ranks', 'They crowd a column']),
		...to('The stories say three thousand', ['They fill it']),
		...to('Robes open', ['Ribbons come undone', 'Jackets hang off the shoulders', 'The chima rides low', 'jeogori slipping off the shoulders']),
		...to('two at a time', ['Knees find laps', 'A maid finds his lap', 'both knees up in his lap', 'His hands on her thighs', 'A hand finds the silk at her own lap', 'her hand on the silk at her lap']),
		...to('He is half-undressed', ['the dark trousers tell it first', 'The robe hangs open', 'The robe hangs off', 'The robe hangs wider', 'open to the navel']),
		...to('They hike the silk', [
			'They loosen the silk',
			'Fingers rest on an inner thigh',
			'One knee up',
			'A twist',
			'They show off for him',
			'hike the silk to the hip',
			'Inner thighs face him',
			'A hem lifts',
			'as high as it will go',
			'Two of them hike together',
			'They sit with knees up',
			'One knee high',
			'She pulls the silk up',
			'He looks up the silk',
			'the last fold of silk',
			'The party does not sit still',
			'Wine-wet silk clinging',
			'both knees up',
			'She twists at the waist'
		]),
		...to('laugh when he looks', ['They turn their backs and laugh', 'They gasp and laugh in his face', 'They laugh into the lamp']),
		...to('They toast until the lamps blur', ['They pour bent at the waist', 'She pours clear wine down the silk']),
		...to('the night veranda', ['The hall is Sabi', 'Moonlight through the lattice', 'One lamp from the side', 'On the night veranda', 'Rain on the night veranda', 'A shaft of lamp in the dark']),
		...to('the night corridor', ['Over her shoulder', 'Moon on one side of his face', 'She looks back, hip out', 'His hand finds the silk at her waist', 'The S-curve of a hip']),
		...to('the next fold of silk', ['His mouth finds the silk', 'His mouth is at her hip', 'along a thigh', 'His face finds a hip', 'He buries himself between them', 'wet silk at her back', 'He goes face-first into the silk', 'An untied goreum']),
		...to('The headband is gone', [])
	});
});

// ───────────────────────────── #66 Nine Omens ─────────────────────────────
episode(66, 'Who buried you, little one?', (e, K, kind) => {
	const name = K('That name was one I made up');
	name.en = ['…That name was one I made up.', 'When I was a prince on a mudbank.'];
	name.lines = ['…그 이름은 과인이 지어낸 것이다.', '갯벌에 선 왕자였을 때.'];
	const drowning = K('drowning on dry land');
	drowning.html =
		'He has spent years drowning on dry land: wine, women, and a letter he never sent to the man he never sent for. The river does not care. It knew him before the crown.';
	drowning.ko = '그는 여러 해를 마른 땅에서 익사하며 보냈다. 술, 여자, 그리고 끝내 부르지 않은 사람에게 끝내 보내지 않은 편지. 강은 상관하지 않는다. 강은 왕관 이전의 그를 알았다.';

	e.blocks = [
		P(
			'Every one of the nine signs is real, in the sense that people saw it. That was always the only sense that mattered, and the man who taught Baekje so is about to find out how much he meant it.',
			'아홉 가지 징조는 모두 진짜다. 사람들이 보았다는 의미에서. 중요한 건 언제나 그 의미뿐이었고, 백제에 그것을 가르친 사람은 이제 자기가 그 말을 얼마나 진심으로 했는지 알게 될 참이다.'
		),
		P(
			'Foxes walk into the Assembly hall in a pack, and a white one sits down on the Premier’s desk. A hen mates with a sparrow. A dead fish as long as a boat washes up on the river. Then a dead woman, longer than the fish.',
			'여우 떼가 회의장에 들어오고, 흰 여우 한 마리가 상좌평의 책상에 올라앉는다. 암탉이 참새와 교미한다. 배만 한 죽은 물고기가 강가에 떠오른다. 그다음엔 죽은 여인이, 물고기보다 더 길게.'
		),
		P(
			'The palace trees weep at night. The White River turns red with blood. Toads gather in the tops of the trees by the ten thousand. Storm winds, rain, lightning, and black clouds fighting like dragons over the temples. Last, a ghost runs into the palace shouting, and burrows into the ground. They dig, and find a turtle.',
			'밤이면 궁궐의 나무가 운다. 백강이 피처럼 붉게 물든다. 두꺼비 수만 마리가 나무 꼭대기에 모인다. 폭풍과 비와 번개, 그리고 절 위에서 용처럼 싸우는 검은 구름. 마지막으로, 귀신 하나가 소리치며 궁으로 뛰어들어 땅속으로 파고든다. 파 보니 거북 한 마리가 나온다.'
		),
		P(
			'They bring the turtle to the king in a lacquer box. He turns it over in his hands like a forgery he is pricing.',
			'사람들이 거북을 옻칠한 상자에 담아 왕에게 가져온다. 그는 값을 매기는 위조품처럼 그것을 손안에서 뒤집어 본다.'
		),
		D(
			'euija',
			['Three feet down, under my own palace.', 'Who buried you, little one?', '…Hm. Somebody with good taste in shells.'],
			['내 궁 밑, 석 자 아래라.', '누가 널 묻었느냐, 요 녀석.', '…흠. 껍데기 보는 눈은 있는 놈이로구나.']
		),
		kind('flashback'),
		K('Baekje falls! Baekje falls!'),
		K('The Shaman', (b) => b.kind === 'scene'),
		K('He keeps a shaman on retainer'),
		K('I came for amusement today'),
		K('the politicians are corrupt'),
		K('the forgotten common man cries out'),
		K('From the shell.'),
		K('Baekje is like the full moon', (b) => b.kind === 'quote'),
		K('Baekje wanes. Silla fills.'),
		K('You wretch!!!'),
		K('The blade is out before the last word cools'),
		K('People start saying it out loud in the markets'),
		K('What you need right now is not wine'),
		K('Say one name.'),
		name,
		K('…Your Majesty.', (b) => b.person === 'chunbok' && b.en.length === 1),
		K('What are they saying in the markets these days'),
		K('That Baekje is the full moon'),
		K('Well made.'),
		K('He never says that the signs were made'),
		K('The best lie a man ever tells'),
		K('The White River', (b) => b.kind === 'scene'),
		K('That night he leaves the palace the way he left it as a boy'),
		drowning,
		K('I named you here.'),
		K('He jumps. The cold takes the wine off'),
		K('Summon Gyebek…!'),
		P(
			'Chunbok has followed him down with a lamp, the way a careful man follows a king who might be about to do something historic. He holds out a dry robe. The king does not take it.',
			'춘복이 등불을 들고 뒤따라 내려와 있다. 역사에 남을 짓을 할지도 모르는 임금을 조심성 많은 사람이 따라다니듯이. 그가 마른 옷을 내민다. 왕은 받지 않는다.'
		),
		D(
			'chunbok',
			[
				'Majesty, you’ll catch your death—',
				'As Your Majesty well knows, a boat to Tamla takes time.',
				'And the markets… forgive me. The markets are asking whether there will be a Baekje for him to come home to.'
			],
			['폐하, 고뿔 드십니다—', '폐하께서도 잘 아시다시피, 탐라까지 배는 시간이 걸립니다.', '그리고 저잣거리에서는… 송구합니다. 저잣거리에서는 그가 돌아올 백제가 남아 있겠느냐고들 합니다.']
		),
		D(
			'euija',
			['Let them ask.', 'We were a younger son’s house from the very start, Chunbok. Goguryeo got the hall. We got the road south.', 'Seven hundred years on a borrowed road, and we’re still here.'],
			['물으라 해라.', '우린 처음부터 작은아들네 집이었다, 춘복. 고구려가 대청을 가졌고, 우리는 남쪽 길을 가졌지.', '빌린 길 위에서 칠백 년이다. 그래도 아직 여기 있다.']
		),
		D('chunbok', ['…For now, Majesty.'], ['…아직은, 폐하.']),
		D('euija', ['‘For now.’ Ha.', 'That’s exactly what they told the first one, too.'], ['‘아직은.’ 하.', '맨 처음 그분한테도 딱 그렇게들 말했지.']),
		CARD(
			'Will Baekje survive? To answer that, go back to how it began: a mother, two sons, and a father who already had one…!',
			'백제는 살아남을까? 그 답을 알려면 처음으로 돌아가야 한다. 어머니 하나, 아들 둘, 그리고 이미 아들이 있던 아버지…!'
		)
	];
	reanchor(e, {
		'A herd of foxes infest the Ministers': 'Foxes walk into the Assembly hall',
		'A dead abnormally large fish washes up on the river.': 'A dead fish as long as a boat',
		'A dead abnormally large woman washes up on the river.': 'a dead woman, longer than the fish',
		'The screams of ghosts can be heard': 'The palace trees weep at night',
		'Tens of thousands of toads gathered in the tops of the trees.': 'Toads gather in the tops of the trees',
		'A ghost enters the palace and burrows into the ground.': 'burrows into the ground'
	});
});

// ───────────────────────────── #67 Onjo ─────────────────────────────
episode(67, 'Most of them get the beginning wrong', (e, K, kind) => {
	const ye = K('Your father was no ordinary man');
	ye.en = ['Your father was no ordinary man. The country couldn’t hold him.', 'He went south and made himself a king.', 'He left something under the pine on the seven-sided stone.', 'Find it, and he’ll know you.'];
	ye.lines = ['네 아버지는 보통 사람이 아니었다. 이 나라가 그를 담지 못했지.', '남쪽으로 가서 스스로 임금이 되었다.', '일곱 모 난 돌 위 소나무 밑에 뭔가를 두고 갔다.', '그걸 찾으면, 너를 알아볼 거다.'];

	const j30 = K('Still that mouth.');
	j30.en = ['Still you.', 'Still that mouth.', 'Look at you. Older. Better. Sorry. Not sorry.'];
	j30.lines = ['여전하네.', '여전히 그 입.', '봐라. 나이 먹고. 더 좋아졌어. 미안. 안 미안해.'];
	const s31 = K('Little Sosuno listen');
	s31.en = ['Don’t— ha— don’t you dare be sweet now.', 'Twenty winters, and you still breathe like you ran here.', '…Slower. No. Not slower.', 'I want to remember this one. I’m not getting another.'];
	s31.lines = ['하지 마— 하— 지금 다정하게 굴기만 해 봐.', '스무 해 겨울을 지나고도 꼭 뛰어온 사람처럼 숨을 쉬네.', '…천천히. 아니. 천천히 말고.', '이번 건 기억할 거야. 다음은 없으니까.'];
	const j32 = K('Scream it. Last time');
	j32.en = ['Then don’t count.', 'I’ll count.', 'You know I’m bad at it.'];
	j32.lines = ['그럼 세지 마.', '내가 셀게.', '나 세는 거 못하는 거 알잖아.'];
	const s33 = K('I hate you');
	s33.en = ['I hate you. I hate you, don’t stop—', '…Say it. The thing you never say.', 'Say it now, while I can’t hit you.'];
	s33.lines = ['미워. 미워 죽겠어, 멈추지 마—', '…말해. 너 한 번도 안 한 그 말.', '지금 해. 내가 못 때릴 때.'];
	const p34 = K('scarlet at what she heard herself say');
	p34.html = 'He says it into her hair. Even the sky looks away for this part. She laughs, and then she doesn’t, and the lamp burns down to a coal.';
	p34.ko = '그는 그녀의 머리칼에 대고 말한다. 이 대목에서는 하늘도 고개를 돌린다. 그녀는 웃다가, 이내 웃지 않고, 등잔은 숯불이 될 때까지 타들어 간다.';
	const j35 = K('I’m keeping both of you');
	j35.en = ['There.', 'Now you have to come back someday and hit me for it.'];
	j35.lines = ['됐다.', '이제 언젠가 돌아와서 그걸로 날 때려야 해.'];
	const dawn = K('At dawn ten men');
	dawn.html =
		'At dawn ten men start packing carts before anyone tells them to. Onjo and Biryu take their mother south. She walks like a woman who has been thoroughly answered and will not explain it to a deer, a son, or a chronicle.';
	dawn.ko = '새벽, 누가 시키기도 전에 열 명의 사내가 수레를 꾸린다. 온조와 비류가 어머니를 모시고 남쪽으로 간다. 그녀는 제대로 대답을 들은 여자처럼 걷고, 그 대답을 사슴에게도, 아들에게도, 연대기에게도 설명하지 않는다.';
	const stag = K('a stag is standing in the way');
	stag.html = stag.html.replace('It happens like this. ', '');
	stag.ko =
		'강을 건너 사흘 남쪽, 수레가 지나기엔 너무 좁은 능선 길에 수사슴 한 마리가 길을 막고 서 있다. 닥종이처럼 희고, 빛이 닿는 곳마다 금빛이며, 뿔은 누군가 남겨 두기로 한 겨울나무처럼 갈라져 있다. 달아나지 않는다. 셋을 기다리라는 말을 들은 듯 세 사람을 바라본다.';

	e.blocks = [
		P('Every child in Baekje can tell you this story. Most of them get the beginning wrong.', '백제 아이라면 누구나 이 이야기를 할 줄 안다. 대부분은 첫머리를 틀리게 한다.'),
		K('grow up princes'),
		kind('map'),
		K('Buyeo', (b) => b.kind === 'scene'),
		K('has raised Jumong’s first son alone'),
		K('is a boy with a sling'),
		kind('card'),
		K('No father, no manners'),
		K('What kind of man was my father?'),
		ye,
		K('There is no pine on any hill he climbs'),
		K('Yuri….!'),
		K('With his friends'),
		K('The Half Sword', (b) => b.kind === 'scene'),
		K('In the hall at Jolbon'),
		K('Father…!'),
		K('watch from the porch rail'),
		K('The Last Night', (b) => b.kind === 'scene'),
		P(
			'When Yuri is named crown prince, Sosuno does not fight the hall. She packs her dusty-rose silk. She packs the boys. She leaves the well.',
			'유리가 태자로 책봉되자, 소서노는 대청과 싸우지 않는다. 빛바랜 장밋빛 비단을 싼다. 아이들을 챙긴다. 우물은 두고 간다.'
		),
		K('finds her at the old well'),
		K('a lot of buckets for one road'),
		K('Not buckets.'),
		K('I left iron'),
		K('don’t make a speech'),
		K('Wasn’t going to.'),
		K('Yuri can have the chair'),
		K('South, then.'),
		K('The boys are asleep'),
		K('They do not make it to a feast'),
		K('Older. Hungrier.'),
		j30,
		s31,
		j32,
		s33,
		p34,
		j35,
		K('Before dawn the lamp is out'),
		K('Keep the well. I’m taking the glow.'),
		K('Go found the other one'),
		K('The Road South', (b) => b.kind === 'scene'),
		dawn,
		stag,
		K('That’s dinner for ten ministers'),
		K('That look like dinner to you?'),
		K('Meat with antlers'),
		K('Listen to your mother'),
		K('Biryu lowers the bow'),
		K('A deer knows the way'),
		K('A deer’s practically civilised'),
		K('Mount Buak', (b) => b.kind === 'scene'),
		K('On the ninth day it takes them up Mount Buak'),
		K('Smell that? Sea.'),
		K('all ten of them say here'),
		K('Then the ten can live here'),
		K('Don’t ask me that'),
		K('Nobody answers him'),
		kind('place'),
		K('The land of ten tribes'),
		K('how does that sound?'),
		P(
			'Biryu takes the sea. Onjo takes the river. Up north, their half-brother Yuri keeps the chair, and his line keeps it after him.',
			'비류는 바다를 갖는다. 온조는 강을 갖는다. 북쪽에서는 이복형 유리가 자리를 지키고, 그 뒤로도 그의 핏줄이 지킨다.'
		),
		P(
			'So that is the family joke Euija and Gesomun used to throw at each other over wine. Goguryeo and Baekje are one father’s sons. One got the hall. One got the road. Neither has forgiven the other since.',
			'의자와 개소문이 술자리에서 서로에게 던지던 집안 농담이 바로 이것이다. 고구려와 백제는 한 아버지의 아들들이다. 하나는 대청을 가졌고, 하나는 길을 가졌다. 그 뒤로 어느 쪽도 상대를 용서하지 않았다.'
		),
		P(
			'Seven hundred years later, the road ends at a riverbank in Sabi. Onjo’s heir is wringing the White River out of his sleeves. He once said a country is a territory governed by a single story. This was the story. He is about to learn who else can tell it.',
			'칠백 년 뒤, 그 길은 사비의 강둑에서 끝난다. 온조의 후손이 소매에서 백강 물을 짜내고 있다. 그는 언젠가 나라란 하나의 이야기가 다스리는 땅이라고 말했다. 이것이 그 이야기였다. 이제 그는 그 이야기를 누가 또 할 줄 아는지 알게 될 참이다.'
		),
		CARD(
			'Back to Sabi. Two armies are on the road, the boat for Gyebek still hasn’t sailed, and the king wants to know why…!',
			'다시 사비. 두 군대가 이미 길 위에 있고, 계백을 데리러 갈 배는 아직 떠나지 않았다. 왕은 그 까닭을 알고 싶다…!'
		)
	];
	reanchor(e, {
		'After wandering for': 'a stag is standing in the way'
	});
	for (const im of e.images) if (im.id === 'harbor-city') im.at = 'Salt flats and sea wind';
});

// ───────────────────────────── #68 Sungchung ─────────────────────────────
episode(68, 'through the fish market first', (e, K) => {
	e.blocks = [
		P('The war reaches Sabi the way bad news always does: through the fish market first.', '전쟁은 나쁜 소식이 늘 그렇듯 사비에 닿는다. 어시장부터.'),
		P(
			'Two armies are coming for the capital, one by sea and one over the hills. The fishwives already have a name for it: the Chunchu Army. The king hears it from a maid, who heard it from a fishwife.',
			'두 군대가 도성으로 오고 있다. 하나는 바다로, 하나는 산을 넘어. 생선 장수 아낙들은 벌써 이름을 붙였다. 춘추군. 왕은 그 말을 궁녀에게서 듣고, 궁녀는 생선 장수에게서 들었다.'
		),
		S('The Hall', '전각'),
		P(
			'Euija holds court for the first time in three years. Half the benches are his sons. They watch him the way sons watch a father who has come home sober: politely, and counting the exits.',
			'의자가 세 해 만에 처음으로 조회를 연다. 자리 절반이 그의 아들들이다. 아들들은 술 깨고 돌아온 아버지를 보듯 그를 본다. 공손하게, 그리고 문이 몇 개인지 세면서.'
		),
		D(
			'euija',
			['The boat for Gyebek.', 'I gave that order on a riverbank, soaking wet, in front of witnesses.', 'Where is he?'],
			['계백을 데리러 간 배.', '과인이 강둑에서, 흠뻑 젖은 채로, 보는 눈들 앞에서 내린 명이다.', '그놈은 어디 있느냐?']
		),
		D('chunbok', ['Your Majesty… as Your Majesty well knows, the winter crossings are—', 'And then the spring winds were—'], ['폐하… 폐하께서도 잘 아시다시피, 겨울 뱃길은—', '그리고 봄바람이—']),
		D('euija', ['The winds. A whole year of winds.', 'Chunbok. Do you take me for a fool, or for a drunk?'], ['바람. 한 해 내내 바람이었구나.', '춘복. 과인을 바보로 아느냐, 술주정뱅이로 아느냐?']),
		D(
			'chunbok',
			['Majesty, by Onjo’s shrine, we have too few troops to send General Gyebek!', 'The Satek house lost its benches, not its levies. Better to wait for Lord Satek’s men…'],
			['폐하, 온조묘에 걸고 아뢰오니, 계백 장군에게 딸려 보낼 군사가 너무 적습니다!', '사택가가 잃은 것은 자리이지 사병이 아닙니다. 사택 공의 군사를 기다리시는 것이…']
		),
		K('Who is the Eraha of this country?!'),
		P(
			'Chunbok bows very low, which is what he does instead of answering. A boat leaves for Tamla that afternoon. It is the fastest in the harbour. It is a year late.',
			'춘복은 아주 깊이 절한다. 대답 대신 하는 일이다. 그날 오후 탐라로 배 한 척이 떠난다. 포구에서 가장 빠른 배다. 한 해 늦었다.'
		),
		S('The Letter', '편지'),
		P('That night the king does something he has not done in three years. He goes looking for a piece of paper.', '그날 밤 왕은 세 해 동안 하지 않던 일을 한다. 종이 한 장을 찾으러 간다.'),
		P(
			'It is where he left it in the banquet hall, under a wine jar, with a red ring where the jar stood. The maids watch him lift the jar. Nobody giggles.',
			'종이는 그가 둔 자리, 연회장의 술 단지 밑에 있다. 단지가 놓였던 자리에 붉은 테가 져 있다. 궁녀들이 그가 단지를 드는 것을 지켜본다. 아무도 킥킥대지 않는다.'
		),
		D('courtmaid', ['Majesty… that’s the councillor’s.', 'We didn’t throw it away.', 'We didn’t know if we were allowed to.'], ['폐하… 그건 그 좌평 나리 것이에요.', '저희가 안 버렸어요.', '버려도 되는 건지 몰라서요.']),
		D('euija', ['Read it to me.', 'My eyes are— just read it.'], ['읽어 다오.', '눈이 좀— 그냥 읽어라.']),
		D(
			'courtmaid',
			['‘A loyal servant does not forget his king even in death—’', 'Majesty, then it’s a river and a pass.', '‘Do not let them cross Chimhyeon by land. Do not let their ships into Final Ford.’', '…Then just his name.'],
			['‘충신은 죽어도 임금을 잊지 않으니—’', '폐하, 그다음은 강이랑 고개 얘기예요.', '‘육로로는 침현을 넘지 못하게 하고, 수군은 기벌포에 들이지 마소서.’', '…그리고 그분 이름뿐이에요.']
		),
		D(
			'euija',
			['Chimhyeon. The soldiers call it Tanhyeon.', 'He told me the pass and the river three years ago. Starving. Through that wall.', 'And I put a jar on him.'],
			['침현. 군졸들은 탄현이라 부르지.', '세 해 전에 고개와 강을 일러 주었다. 굶어 가면서. 저 벽 너머에서.', '그런데 과인은 그 위에 술 단지를 올려놓았다.']
		),
		D('courtmaid', ['Majesty—'], ['폐하—']),
		D(
			'euija',
			['Somebody else said this. Before him. Smiling at me, quoting sutras—', '…Heungsu.'],
			['누가 또 이 말을 했어. 저 사람보다 먼저. 날 보고 웃으면서, 경을 읊으면서—', '…흥수.']
		),
		S('The Back of the Hall', '전각 뒤편'),
		P(
			'Next morning the provincial lords are summoned too. For the first time in four generations, the Ye family has been asked to court. They have picked a bad year to accept.',
			'이튿날 아침에는 지방의 성주들도 불려 온다. 예씨 가문이 사 대 만에 처음으로 조정에 부름을 받았다. 받아들이기엔 운 나쁜 해를 골랐다.'
		),
		K('the lord of Bear Fortress says nothing'),
		K('One man might still know what to do')
	];
	reanchor(e, { 'In the Baekje court, there is panic as the Silla/Tang ar': 'Who is the Eraha of this country?!' });
});

// ───────────────────────────── #69 Heungsu ─────────────────────────────
episode(69, 'Today the king has finally sent someone to look at it', (e, K) => {
	const [berth, yard] = e.blocks.filter((b) => b.kind === 'flashback');
	yard.year = '657–660';
	const arrive = yard.blocks.find((b) => textOf(b).includes('one chest and the office blade'));
	arrive.html =
		'The county is a day’s ride from the sea and a month from anyone who matters. Heungsu arrives with one chest and his office sword, hangs the sword on the doorpost, and on the first morning, before the clerk has finished his bow, scratches a map into the packed earth of the yard with the end of a broom handle.';
	arrive.ko =
		'고을은 바다에서 하루 길이고, 중요한 사람들에게서는 한 달 길이다. 흥수는 궤짝 하나와 관직 칼 하나를 들고 와서, 칼을 문설주에 걸고, 첫날 아침 향리가 절을 다 마치기도 전에 빗자루 끝으로 마당의 다져진 흙에 지도를 긋는다.';
	const news = yard.blocks.find((b) => textOf(b).includes('The news about Seongchung'));
	news.html = news.html.replaceAll('Seongchung', 'Sungchung');

	const pick = (frag) => {
		const b = berth.blocks.find((x) => textOf(x).includes(frag));
		if (!b) throw new Error(`#69 berth: no "${frag}"`);
		return b;
	};
	const hold = pick('Hold the White River mouth');
	hold.en = [
		'Then hear one thing that is not a story.',
		'If they ever send for you, hold the White River mouth and the Tanhyeon pass — or there will be no Sabi left to be loyal to.',
		'The Tang do not need our clans’ permission to land. They need our absence.'
	];
	hold.lines = ['그러면 이야기가 아닌 것 하나만 들으시게.', '언젠가 자네를 부르거든, 백강 하구와 탄현을 지키게 — 그렇지 않으면 충성할 사비가 남지 않네.', '당은 상륙에 우리 가문의 허가가 필요 없네. 우리의 빈자리가 필요할 뿐이지.'];
	const SON = (en, ko) => U('Gyebek’s Son', 'm', en, ko);
	berth.blocks = [
		P(
			'It was a berth on Satek water, the afternoon the clans put Gyebek on a boat. Heungsu still had his office then. He came down to the water because nobody else from court did.',
			'사택의 물가 나루였다. 가문들이 계백을 배에 태우던 날 오후. 흥수는 그때만 해도 아직 관직이 있었다. 조정에서 아무도 나오지 않았기에 그가 물가로 나왔다.'
		),
		pick('A Baekje minister sent far from court'),
		P(
			'Gyebek’s wife came too, with their boy at her side and a small girl on her hip. She had packed his bag. He had unpacked it on the dock and packed it again, in order.',
			'계백의 아내도 나왔다. 사내아이를 곁에 세우고, 어린 딸을 허리에 안고. 짐은 아내가 쌌다. 그는 나루에서 짐을 풀어 순서대로 다시 쌌다.'
		),
		D('heungsu', ['You… you truly mean to go?', 'Without a word to the king—'], ['자네... 진짜로 가는 건가?', '임금께 한마디도 없이—']),
		D('gyebek', ['The king is in mourning. He cannot sign.', 'The order has his seal. I am a loyal servant of Baekje.'], ['폐하께서는 상중이십니다. 서명을 하실 수 없습니다.', '명에는 폐하의 인장이 있습니다. 저는 백제의 충신입니다.']),
		D(
			'gyebek',
			['His Majesty gave me a name.', 'A name — to a child who had none.', 'If he wants it back, he will send for it.'],
			['폐하께서 저에게 이름을 주셨습니다.', '이름 없는 아이한테, 이름을.', '돌려받고 싶으시면, 부르실 겁니다.']
		),
		SON(['Father. How many days is Tamla?'], ['아버지. 탐라는 며칠이에요?']),
		D('gyebek', ['Four, with a good wind.'], ['바람이 좋으면 나흘이다.']),
		SON(['Then I’ll count to four.'], ['그럼 넷까지 셀게요.']),
		D('gyebek', ['Count to five. The wind is not always good.'], ['다섯까지 세라. 바람이 늘 좋지는 않다.']),
		pick('Do you know the story of the Guardian of Ansi?'),
		pick('One person to cherish. One person to serve.'),
		pick('for me they are the same person'),
		P(
			'His wife was standing close enough to hear it. She shifted the girl to her other hip and looked at the water. Heungsu has never forgotten that she did not look surprised.',
			'아내는 그 말이 들릴 만큼 가까이 서 있었다. 딸을 다른 쪽 허리로 옮겨 안고 물을 바라보았다. 흥수는 그녀가 놀라는 기색이 없었던 것을 지금껏 잊지 못한다.'
		),
		hold,
		pick('I know the roads.'),
		P(
			'Then the captain with the Yunbi contract called the tide. Gyebek stepped aboard and did not look back, because looking back was not on the list. The boy counted out loud until the sail was gone. He got to four hundred and something before his mother made him stop.',
			'그때 윤비 가문 계약서를 품은 선장이 물때를 불렀다. 계백은 배에 올랐고 돌아보지 않았다. 돌아보는 일은 목록에 없었기 때문이다. 아이는 돛이 사라질 때까지 소리 내어 셌다. 사백 몇까지 갔을 때 어머니가 그만 세라고 했다.'
		)
	];

	const sungWrote = K('Seongchung already wrote it');
	sungWrote.en = sungWrote.en.map((l) => l.replaceAll('Seongchung', 'Sungchung'));
	const COURIER = (en, ko) => U('The Courier', 'm', en, ko, '#8a8a7a');
	e.blocks = [
		P(
			'Heungsu has drawn the same map in the dirt every morning for three years. Today the king has finally sent someone to look at it.',
			'흥수는 세 해 동안 아침마다 흙바닥에 같은 지도를 그렸다. 오늘에야 왕이 그것을 보러 사람을 보냈다.'
		),
		yard,
		K('The Courier', (b) => b.kind === 'scene'),
		P(
			'The courier does not sit. Dust is still on him. The sword on the doorpost is the only bright thing in the yard.',
			'파발은 앉지 않는다. 먼지를 그대로 뒤집어쓰고 있다. 문설주의 칼만이 마당에서 유일하게 반짝인다.'
		),
		K('in the middle of the map'),
		K('The matter is urgent. What then.'),
		sungWrote,
		K('That is all?'),
		K('You’re standing on Tanhyeon.'),
		K('steps off a notch in the dirt'),
		D('heungsu', ['And Gyebek?', 'Has anybody sent for Gyebek?'], ['계백은?', '누가 계백을 부르러 갔는가?']),
		COURIER(['A boat went for him this week, sir. To Tamla.'], ['이번 주에 배가 갔습니다, 나리. 탐라로.']),
		D('heungsu', ['This week.', 'Five years, and this week.'], ['이번 주라.', '다섯 해 만에, 이번 주라.']),
		P(
			'He looks down at the river mouth he has drawn too wide, and remembers the last time he saw the man they have finally sent for.',
			'그는 너무 넓게 그린 강어귀를 내려다보며, 그들이 이제야 부른 사람을 마지막으로 본 날을 떠올린다.'
		),
		berth,
		K('He has the paper.'),
		S('Sabi', '사비'),
		K('The answer comes back to Sabi'),
		D(
			'chunbok',
			['Majesty, Heungsu is a man in exile. He resents his lord.', 'A man who resents his lord has no love of country. As Your Majesty well knows, his words must not be used.'],
			['폐하, 흥수는 유배 중인 사람입니다. 임금을 원망하고 있습니다.', '임금을 원망하는 자는 나라를 사랑하지 않습니다. 폐하께서도 잘 아시다시피, 그의 말은 쓸 수 없습니다.']
		),
		U(
			'A Minister',
			'm',
			[
				'Let them in, Majesty.',
				'Let the Tang come up the river single file, with no room to spread their boats. Let Silla climb Tanhyeon, a path too narrow for two horses abreast.',
				'Then strike. Chickens in a basket. Fish in a net.'
			],
			['들이십시오, 폐하.', '당군은 강을 거슬러 한 줄로 오게 하여 배를 벌리지 못하게 하고, 신라군은 탄현을 오르게 하여 말 두 필이 나란히 서지 못하게 하십시오.', '그때 치면 됩니다. 삼태기 속의 닭이요, 그물 속의 고기입니다.'],
			'#7d7568'
		),
		D(
			'euija',
			['Chickens in a basket.', '…Ha. That’s good. That’s the kind of thing I used to think of.', 'Heungsu would say—'],
			['삼태기 속의 닭이라.', '…하. 좋구나. 과인이 예전에 생각해 내던 그런 수야.', '흥수라면 이렇게—']
		),
		D('chunbok', ['Heungsu says what Sungchung said, Majesty.', 'And Your Majesty did not take Sungchung’s advice either.'], ['흥수는 성충이 한 말을 하는 것입니다, 폐하.', '그리고 폐하께서는 성충의 말도 쓰지 않으셨습니다.']),
		P(
			'It is very quiet. To take the advice now, the king would have to admit what it cost the last man who gave it. Kings will pay almost anything not to admit that.',
			'아주 조용하다. 이제 와서 그 말을 쓰려면, 왕은 앞서 그 말을 한 사람이 무엇을 치렀는지 인정해야 한다. 임금들은 그것만은 인정하지 않으려고 거의 무엇이든 치른다.'
		),
		K('So it is.', (b) => b.kind === 'dialogue'),
		K('The next courier is shorter'),
		K('No second courier comes to Gomamiji'),
		K('On the twelfth it rains'),
		K('The histories do not mention him again'),
		K('a boat is coming for the Turtle')
	];
	reanchor(e, {
		'You… you truly mean to march?': 'You… you truly mean to go?',
		'Hold the White River mouth and the Tanhyeon pass': 'hold the White River mouth and the Tanhyeon pass'
	});
});

// ───────────────────────────── #70 Gyebek ─────────────────────────────
episode(70, 'Then that’s my allowance spent', (e, K) => {
	const water = K('He stops correcting the people who call him Turtle');
	water.html =
		'He stops correcting the people who call him Turtle, and carries water for the women who dive. He cannot write home. He never learned. Some evenings he counts to five on the beach, out loud, for a boy the island cannot see. For the first and last time in his life, he is in a place where being exactly what he is costs him nothing.';
	water.ko =
		'거북이라 부르는 사람들을 더는 바로잡지 않고, 물질하는 여자들의 물을 날라 준다. 집에 편지를 쓸 수 없다. 배운 적이 없다. 어떤 저녁이면 바닷가에서 소리 내어 다섯까지 센다. 섬사람들 눈에는 보이지 않는 아이를 위해. 평생 처음이자 마지막으로, 그는 있는 그대로의 자신이 아무 값도 치르지 않는 곳에 있다.';
	const debt = K('took me in, raised me');
	debt.en = ['…My lord. I was a child with no family and no name.', 'The crown prince of a kingdom gave me a name, and asked if I liked it.', 'I am an ignorant man who cannot even read.', 'But as a man, I will keep faith.'];
	debt.lines = ['…어르신. 저는 집도 이름도 없는 아이였습니다.', '한 나라의 태자께서 제게 이름을 주시고, 마음에 드느냐고 물으셨습니다.', '저는 글도 못 읽는 무식한 사람입니다.', '그래도 사내로서, 신의는 지키겠습니다.'];

	const BOAT = (en, ko) => U('The Boatman', 'm', en, ko);
	const WIFE = (en, ko) => U('Gyebek’s Wife', 'f', en, ko);
	const SON = (en, ko) => U('Gyebek’s Son', 'm', en, ko);
	e.blocks = [
		K('he has stopped counting the days'),
		water,
		K('A boat comes for him in the fifth year'),
		BOAT(
			['General Gyebek?', 'His Majesty’s words. He made me say them back to him twice.', '‘The river was cold. I went in. Come home.’'],
			['계백 장군이십니까?', '폐하의 말씀입니다. 두 번이나 따라 외우게 하셨습니다.', '‘강물이 차더라. 들어갔다. 돌아오너라.’']
		),
		D('gyebek', ['…That is three things.'], ['…세 가지요.']),
		BOAT(['Sir?'], ['예?']),
		D('gyebek', ['He said three things. I heard all three.'], ['세 가지를 말씀하셨소. 셋 다 들었소.']),
		K('What is the hurry'),
		K('Nothing here is mine to keep'),
		K('Then what is yours.'),
		K('…A promise.'),
		K('He takes nothing off the island except the stories'),
		K('Learn one thing before you go'),
		K('…Mine is fixed.'),
		K('Five years of listening'),
		K('He says goodbye at the water.'),
		K('Do not forget people'),
		debt,
		S('Sabi', '사비'),
		P(
			'He lands at the White River mouth and rides to the palace without changing his clothes. The guards do not know his face any more. The king does.',
			'그는 백강 어귀에 내려 옷도 갈아입지 않고 궁으로 달린다. 문지기들은 이제 그의 얼굴을 모른다. 왕은 안다.'
		),
		P(
			'Euija meets him in the yard, not the hall. He is thinner, and sober, and sobriety does not suit him yet. For a moment neither of them says anything, which for Euija is some kind of record.',
			'의자는 대청이 아니라 마당에서 그를 맞는다. 더 말랐고, 술이 깨어 있으며, 맨정신은 아직 그에게 어울리지 않는다. 잠시 둘 다 아무 말도 하지 않는다. 의자에게는 일종의 기록이다.'
		),
		D(
			'euija',
			['Turtle!', 'That’s what they call you down there, isn’t it? The boatman told me.', 'Ha— it suits you. You look like you’ve been living under a rock.'],
			['거북아!', '거기서 너를 그렇게 부른다며? 뱃사공이 그러더라.', '하— 어울린다. 바위 밑에서 살다 온 꼴이구나.']
		),
		D('gyebek', ['Five years.', 'Your Majesty sent for me after four.'], ['다섯 해입니다.', '폐하께서는 네 해째에 부르셨습니다.']),
		D(
			'euija',
			['…I wrote it the night of the Assembly.', 'I didn’t send it. The houses were counting, and a careful man said wait a month, and I—', 'I’m a king. I don’t explain myself twice.'],
			['…회의가 있던 그날 밤에 썼다.', '보내지 않았다. 가문들이 셈을 하고 있었고, 조심성 많은 놈 하나가 한 달만 기다리라 했고, 과인은—', '과인은 임금이다. 같은 말 두 번 안 한다.']
		),
		D('gyebek', ['You explained it once.'], ['한 번 하셨습니다.']),
		D('euija', ['Then that’s my allowance spent!'], ['그럼 내 몫은 다 쓴 거로구나!']),
		P(
			'He laughs first, the way he always does. Then he tells him the rest the way a king gives orders. Tang ships for the river mouth. Silla on the eastern road. Fifty thousand between them. He does not pretend that five thousand is enough.',
			'그가 먼저 웃는다. 늘 그랬듯이. 그러고는 임금이 명을 내리듯 나머지를 말한다. 강어귀로 오는 당의 배. 동쪽 길로 오는 신라. 둘을 합쳐 오만. 오천으로 충분하다는 시늉은 하지 않는다.'
		),
		D('euija', ['Five thousand. That’s the whole purse.', 'The Satek levies are ‘on the way’. They’ve been on the way for a year.'], ['오천. 그게 주머니 전부다.', '사택의 사병은 ‘오는 중’이란다. 한 해째 오는 중이지.']),
		D('gyebek', ['Where.'], ['어디입니까.']),
		D('euija', ['Wherever you judge.', 'You remember what I told you. The last time.'], ['네가 판단하는 곳.', '기억하지? 지난번에 내가 한 말.']),
		D(
			'gyebek',
			['‘One day I will give you a stupid order. Judge it yourself.’', '‘You are still the king of your own life.’'],
			['‘내가 언젠가 어리석은 명을 내릴 게다. 그때는 네가 판단해라.’', '‘네 삶의 임금은 너다.’']
		),
		D(
			'euija',
			['Word for word. Of course.', 'This isn’t a stupid order. It’s just a bad one.', 'You don’t owe me this. The name was a gift.'],
			['한 글자도 안 틀리는구나. 그렇지.', '이건 어리석은 명이 아니다. 그냥 나쁜 명이지.', '너는 이걸 빚진 게 아니다. 이름은 선물이었어.']
		),
		D('gyebek', ['I gave my word.'], ['약조를 했습니다.']),
		D('euija', ['…You asked me once whether I liked the name, or you.', 'I never answered.'], ['…네가 언젠가 물었지. 이름이 좋으냐, 네가 좋으냐.', '과인은 대답하지 않았다.']),
		D('gyebek', ['No.'], ['안 하셨습니다.']),
		D('euija', ['Both.', 'Now go, before I say something royal.'], ['둘 다다.', '이제 가라. 과인이 임금 같은 소리 하기 전에.']),
		P('Gyebek bows and turns. He is at the gate when the king calls after him.', '계백이 절하고 돌아선다. 문에 이르렀을 때 왕이 뒤에서 부른다.'),
		D('euija', ['Gyebek— your house. Your wife, the children.', 'Send them to Bear Fortress. Lord Ye’s walls are thick.'], ['계백아— 네 집. 처자식 말이다.', '웅진성으로 보내라. 예 공의 성벽이 두껍다.']),
		D('gyebek', ['If Sabi falls, no wall in Baekje is thick.'], ['사비가 무너지면, 백제에 두꺼운 성벽은 없습니다.']),
		D('euija', ['…Then judge it yourself. You always do.'], ['…그럼 네가 판단해라. 늘 그랬듯이.']),
		P(
			'It is the kindest thing he can think of to say. Gyebek, who takes every word exactly as it is given, takes it home.',
			'그가 생각해 낼 수 있는 가장 다정한 말이다. 모든 말을 받은 그대로 받는 계백은, 그 말을 집으로 가져간다.'
		),
		K('Home', (b) => b.kind === 'scene'),
		P(
			'Before he marches he goes home. His wife is in the yard. She has heard; the whole street has heard. She does not ask how many. She has been married to him long enough to know he will tell her the exact number.',
			'출정하기 전에 그는 집에 들른다. 아내가 마당에 있다. 이미 들었다. 온 거리가 들었다. 몇이냐고 묻지 않는다. 그가 정확한 숫자를 말해 주리라는 걸 알 만큼 오래 그의 아내였다.'
		),
		D('gyebek', ['Five thousand. Against fifty.'], ['오천. 오만을 상대로.']),
		WIFE(['…The boy has been counting since the boat was sighted.', 'He won’t stop until you tell him.'], ['…아이가 배가 보일 때부터 세고 있어요.', '당신이 그만하라 할 때까지 안 멈출 거예요.']),
		SON(['Father! Nine thousand, four hundred and— and twelve!'], ['아버지! 구천, 사백— 사백 열둘!']),
		D('gyebek', ['You can stop.'], ['그만 세도 된다.']),
		SON(['Was it right?'], ['맞았어요?']),
		D('gyebek', ['Yes.'], ['그래.']),
		P(
			'His wife looks at him for a long time. Then she takes the children inside and leaves the door open, and he goes in after them.',
			'아내는 오래 그를 바라본다. 그러고는 아이들을 데리고 안으로 들어가, 문을 열어 둔다. 그가 뒤따라 들어간다.'
		),
		P(
			'What he does there he does so that nothing of his can be used against him. The histories record it in one line.',
			'그가 거기서 하는 일은, 그의 것 그 무엇도 적에게 쓰이지 않게 하려는 것이다. 사서는 그것을 한 줄로 적는다.'
		),
		K('made slaves', (b) => b.kind === 'quote'),
		K('a black horse at the post'),
		K('a boy from the next village'),
		K('Gomanari too?'),
		K('A horse can’t be made a slave'),
		K('forehead against the black neck'),
		K('The March', (b) => b.kind === 'scene'),
		K('his five thousand set out for the'),
		P(
			'They are waiting at the crossroads outside the city: farmers’ sons, old border men, a few who stood on the mudbank the day a prince named a boy. Nobody cheers. Somebody holds out a spare spear. Gyebek takes it, and counts them row by row before he says a word.',
			'그들은 성 밖 갈림길에서 기다리고 있다. 농부의 아들들, 늙은 국경 병사들, 그리고 왕자가 한 소년에게 이름을 지어 주던 날 갯벌에 서 있던 몇 사람. 아무도 환호하지 않는다. 누군가 여분의 창을 내민다. 계백은 그것을 받아 들고, 한마디 하기 전에 줄줄이 그들을 센다.'
		),
		K('Long live Baekje'),
		CARD(
			'Somewhere, Kangrim closes his ledger on a swept yard. Then he goes up to a meeting with one question he shouldn’t ask…!',
			'어딘가에서 강림이 쓸어 놓은 마당 위로 장부를 덮는다. 그러고는 물어선 안 될 질문 하나를 품고 회의에 올라간다…!'
		)
	];
});

// ───────────────────────────── #71 Three Realms ─────────────────────────────
episode(71, 'Kangrim is late to this one', (e, K, kind) => {
	e.logline = {
		en: 'Once a year the gods meet in a pavilion on the clouds. This year the reaper comes late from a swept yard in Baekje, with a question about the dead.',
		ko: '해마다 한 번, 신들이 구름 위 정자에서 모인다. 올해 저승차사는 백제의 쓸어 놓은 마당에서 늦게 오고, 죽은 자에 관한 질문 하나를 품고 있다.'
	};
	const kangrim5 = K('Shut it, sun.');
	kangrim5.en = ['Shut it, sun. I’ve had a long morning.'];
	kangrim5.lines = ['닥쳐, 해. 오늘 아침이 길었다.'];
	const yumla = K('full of dead people');
	yumla.en = ['Y-you know… full of dead people.'];
	yumla.lines = ['그… 알지. 죽은 사람들 천지야.'];
	const hungry = K('Anyone in this pavilion hungrier');
	hungry.en = ['Barely? I felt that from the chariot.', 'Anyone in this pavilion hungrier than us? Name one.'];
	hungry.lines = ['조금? 수레에서도 느껴지던데.', '이 정자에서 우리보다 배고픈 애 있어? 하나라도.'];
	const crucify = K('crucify him');
	crucify.en = ['Hey Little Star… didn’t the Big Man Upstairs send his son down to the mortal domain a while back?', 'Whatever happened to him?'];
	crucify.lines = ['야, 소별왕… 위에 계신 어른이 아들 하나 이승으로 내려보냈다며?', '그 애 어떻게 됐냐?'];
	const flowers = K('regenerate new blood');
	flowers.en = flowers.en.map((l) => l.replace(' (laughs)', ''));
	flowers.lines = flowers.lines.map((l) => l.replace(/\s*\((웃음|웃으며)\)/, ''));
	const hard = K('What is this line of questioning?');
	hard.en = ['Grim Reaper Kangrim. What is this line of questioning?', 'Do you have something you need to tell me?'];
	hard.lines = hard.lines.filter((l) => !l.startsWith('('));
	if (hard.lines.length !== 2) hard.lines = ['저승차사 강림. 무슨 질문이냐.', '나한테 할 말 있나?'];

	e.blocks = [
		P('Once a year the gods hold a meeting. Kangrim is late to this one, because of a yard in Baekje.', '해마다 한 번 신들이 회의를 연다. 올해 강림은 늦는다. 백제의 어느 마당 때문이다.'),
		P(
			'The annual meeting is a small pavilion: four posts, a raised floor, clouds for a yard. Living, dead and western rows all fit if nobody stretches.',
			'해마다 여는 그 회의 자리는 작은 정자다. 기둥 넷, 높인 마루, 마당 삼은 구름. 이승과 저승과 서천 자리가 모두 들어간다. 아무도 다리를 뻗지 않는다면.'
		),
		kind('place'),
		kind('diagram'),
		K('servants first'),
		K('Looking as young as ever'),
		kangrim5,
		K('H-hey, Samsin.'),
		K('Underworld these days'),
		yumla,
		K('the midwife and the sun find the same rail'),
		K('And I barely hiked the skirt.'),
		hungry,
		K('Ibiga? He flirts with weather.'),
		K('Nothing for the ledger'),
		K('principals duck the lintel'),
		P('The pavilion was not built for three sovereignties. They sit anyway.', '그 정자는 세 주권을 위해 지어진 것이 아니다. 그래도 앉는다.'),
		crucify,
		K('Big things are happening in the mortal realm'),
		K('…', (b) => b.kind === 'dialogue' && b.en?.length === 1 && b.en[0] === '…'),
		K('Elder brother of the dead goes quiet again'),
		P(
			'Kangrim has not sat down. This morning he collected a woman and two children from a swept yard in Baekje. The girl asked if her father was coming too. Kangrim does not lie, so he said, “Later.” He has been thinking about the flower field ever since.',
			'강림은 아직 앉지 않았다. 오늘 아침 그는 백제의 쓸어 놓은 마당에서 여인 하나와 아이 둘을 거두었다. 계집아이가 아버지도 오느냐고 물었다. 강림은 거짓말을 하지 않는다. 그래서 “나중에.”라고 했다. 그 뒤로 내내 꽃밭 생각을 하고 있다.'
		),
		K('Sir.', (b) => b.person === 'kangrim' && b.en[0] === 'Sir.'),
		K('Yes?', (b) => b.kind === 'dialogue' && b.en[0] === 'Yes?'),
		K('what sorts of flowers grow'),
		flowers,
		kind('quote'),
		K('possible to resurrect a dead person'),
		P('Hallakgungi’s face hardens.', '할락궁이의 얼굴이 굳는다.'),
		hard,
		K('No, sir. I was—'),
		K('It is possible.'),
		D('kangrim', ['Only one.', '…And who decides which one?'], ['단 한 사람.', '…그 한 사람은 누가 정합니까?']),
		D(
			'sara',
			['I do. Cheerfully. And I already have.', 'Rule of the field, reaper: pick a flower for one mortal and the whole row wilts. Sit down.'],
			['내가. 기꺼이. 그리고 이미 정했지.', '꽃밭 규칙이야, 저승차사. 사람 하나 위해 꽃을 꺾으면 그 줄이 통째로 시들어. 앉아.']
		),
		P(
			'Kangrim sits down at the end of the dead’s row. He opens his ledger to a page headed Yellow Mountain, and does not like how long it is.',
			'강림은 저승 줄 맨 끝에 앉는다. 장부를 펼치니 황산벌이라 적힌 쪽이 나온다. 그 길이가 마음에 들지 않는다.'
		),
		K('I cheated for the living world'),
		K('Let the meeting begin'),
		K('The minutes of that meeting')
	];
	reanchor(e, {
		'The annual meeting is a small 정자': 'The annual meeting is a small pavilion',
		'The 정자 was not built': 'The pavilion was not built',
		'You didn\'t crucify him': 'Whatever happened to him?',
		'Epilogue · Part': 'Once a year the gods hold a meeting',
		'해모수. 너 또 해 수레에서': 'And I barely hiked the skirt.'
	});
});

// Old unmatched anchors in range, re-pointed to surviving beats.
editStory((story) => {
	const ep = (n) => story.flatMap((c) => c.entries)[n - 1];
	const fix = { 65: { 'the belt comes off in the aisle': 'The belt comes off in the aisle' }, 70: { 'Three kingdoms': 'Five thousand. Against fifty.', Endurance: 'They are waiting at the crossroads' }, 71: { '이비가? 날씨로 튕기지. 강림이는': 'Ibiga? He flirts with weather.', '솔직히 말할게. 출산 보고': 'And I barely hiked the skirt.', '야, 해모수. 염라 얼굴 봤어?': 'Went straight purple' } };
	for (const [n, map] of Object.entries(fix)) reanchor(ep(Number(n)), map);
});

// #68: Ye Sikjin asked for men.
episode(68, 'As many as the road allows', (e, K) => {
	const sum = K('the lord of Bear Fortress says nothing');
	const i = e.blocks.indexOf(sum);
	e.blocks.splice(
		i + 1,
		0,
		D('euija', ['Lord Ye! Bear Fortress! Four generations and I never once asked you to court. My mistake.', 'How many men can you give me?'], ['예 공! 웅진성! 사 대 동안 한 번도 조정에 부르지 않았구나. 과인의 실수다.', '군사를 몇이나 내줄 수 있느냐?']),
		D('yesikjin', ['Your Majesty is generous to say so.', 'Bear Fortress will do exactly what is needed, Majesty. The number depends on the road.'], ['폐하께서 그리 말씀해 주시니 황공합니다.', '웅진성은 꼭 필요한 만큼 하겠습니다, 폐하. 숫자는 길에 달렸습니다.']),
		D('euija', ['Every number depends on the road. Give me one.'], ['숫자야 다 길에 달렸지. 하나만 대 봐라.']),
		D('yesikjin', ['…As many as the road allows, Majesty.'], ['…길이 허락하는 만큼입니다, 폐하.']),
		P(
			'Euija laughs, because a king has to laugh at something before noon. Ye Sikjin bows exactly as low as the man beside him. That afternoon he rides home to Bear Fortress and opens a drawer.',
			'의자는 웃는다. 임금은 낮이 되기 전에 뭐라도 웃어야 하니까. 예식진은 옆 사람과 꼭 같은 깊이로 절한다. 그날 오후 그는 웅진성으로 돌아가 서랍 하나를 연다.'
		)
	);
});

editStory((story) => {
	const e = story.flatMap((c) => c.entries)[67];
	const b = find(e, 'For the first time in four generations, the Ye family')[0]?.b;
	if (!b) return false;
	b.html = 'Next morning the provincial lords are summoned too, even the ones nobody has ever summoned.';
	b.ko = '이튿날 아침에는 지방의 성주들도 불려 온다. 한 번도 불린 적 없는 이들까지.';
});

// Small cleanups: stage direction in #66, the ring in #69, unlabeled courier, Korean in a flashback title.
editStory((story) => {
	const ep = (n) => story.flatMap((c) => c.entries)[n - 1];
	const named = find(ep(66), 'I named you here.')[0].b;
	if (named.en[0].startsWith('(')) {
		named.en.shift();
		named.lines.shift();
	}
	const e69 = ep(69);
	const rain = find(e69, 'On the twelfth it rains')[0].b;
	rain.html = rain.html.replace('He lifts the blade off the doorpost by its ring and starts north', 'He lifts the sword off the doorpost and starts north');
	rain.ko = rain.ko.replace('문설주에서 칼을 고리째 들어 내리고', '문설주에서 칼을 내려 들고');
	for (const frag of ['The matter is urgent. What then.', 'That is all?']) Object.assign(find(e69, frag)[0].b, { speaker: 'The Courier', gender: 'm' });
	const yard = e69.blocks.find((b) => b.kind === 'flashback' && b.title.startsWith('Gomamiji'));
	yard.title = 'Gomamiji';
});
