/**
 * One-shot content pass:
 *  - Coup: the 655 crown-prince mark moves Yung -> Hyo (+ Ungo's hand, brothers' confrontation)
 *  - Descent: Yung vs Hyo on the stair
 *  - Sabi: Yung slips out the river gate; Hyo kneels as crown prince; Busosan + the vanishing
 *  - Brothers' Coup: forged-mail mechanism, Heonseong at Gungnae, Bojang's seal,
 *    Namsan/Namgun split plant, Baekje-Goguryeo eldest-son mirror
 *  - Yellow Mountain: segmented duel beats for charges 1-4
 * Guarded: skips any insert whose marker scene/label is already present.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const F = path.join(ROOT, 'src/lib/data/story.json');
const s = JSON.parse(fs.readFileSync(F, 'utf8'));

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, chip, en, ko) => ({ kind: 'dialogue', chip, person, en, lines: ko });
const U = (en, ko) => ({ kind: 'dialogue', en, lines: ko });

const entry = (ch, title) => {
	const e = s.find((c) => c.id === ch).entries.find((e) => e.title === title);
	if (!e) throw new Error(`missing ${ch}/${title}`);
	return e;
};
const has = (e, marker) => JSON.stringify(e.blocks).includes(marker);
const idx = (e, pred) => {
	const i = e.blocks.findIndex(pred);
	if (i < 0) throw new Error('anchor missing');
	return i;
};
const isScene = (label) => (b) => b.kind === 'scene' && b.label === label;
const hasText = (t) => (b) => JSON.stringify(b).includes(t);

/* ---------------- Coup: The Mark Moves (655) ---------------- */
{
	const e = entry('fall-of-euija', 'Coup');
	if (!has(e, 'The Mark Moves')) {
		const at = idx(e, isScene('That Night'));
		e.blocks.splice(at, 0,
			SCENE('The Mark Moves', '표가 옮겨간다'),
			P(
				'There is one more chair that is not a chair. The crown-prince mark has sat on Yung’s forehead since the boy could walk — Satek tutors, Satek berths, Satek inevitability. Euija has been counting the cost of it the way other men count harvests.',
				'의자가 아닌 의자가 하나 더 있다. 태자의 표는 융이 걸음마를 시작할 때부터 그 이마에 앉아 있었다 — 사택 스승, 사택 자리, 사택의 필연. 의자는 그것을 다른 사내들이 추수를 세듯 세어 왔다.'
			),
			D('euija', '#e08a2e',
				['Yung. Twenty years you carried my mark, and never once dropped it where the people could see.'],
				['융. 스무 해 넘게 내 표를 짊어졌고, 백성들 보는 앞에선 한 번도 떨어뜨린 적 없지.']
			),
			D('yung', '#d4b45a',
				['Eleven, Father. Eleven years since the appointment. I keep the number for both of us.'],
				['열한 해입니다, 아버님. 책봉받은 지 열한 해. 두 분 몫으로 제가 세고 있습니다.']
			),
			D('euija', '#e08a2e',
				['Eleven. And in those eleven, whose tutors taught you? Whose berths berthed you? Whose inevitability did you sleep in?'],
				['열한 해. 그 열한 해 동안, 누구 스승이 너를 가르쳤고, 누구 자리가 너를 재웠느냐? 누구의 필연 속에서 잤느냐?']
			),
			D('yung', '#d4b45a',
				['My mother’s house. Which you chose for me.'],
				['제 외가입니다. 아버님이 골라 주신.']
			),
			D('euija', '#e08a2e',
				['A crown prince is not an eldest son. He is a choice. Mine.'],
				['태자는 맏아들이 아니다. 선택이다. 내 선택.']
			),
			P(
				'Hyo comes forward before he is called, which is the most Hyo thing he has ever done. Behind the screen, Ungo says one word — the way she ends all bargains.',
				'효는 불리기 전에 앞으로 나온다. 효답지 않게 가장 효다운 짓이다. 병풍 뒤에서 은고가 한 마디 한다 — 그녀가 모든 흥정을 끝내는 방식으로.'
			),
			D('ungo', '#c9a0a8', ['Done.'], ['됐다.']),
			D('hyo', '#c9a86a',
				['Father. Brother. I did not ask for—'],
				['아버님. 형님. 저는 청한 적—']
			),
			D('yung', '#d4b45a',
				['No. You never ask. Things arrive for you.'],
				['아니. 넌 청한 적이 없지. 것들은 제 발로 오니까.']
			),
			D('hyo', '#c9a86a',
				['Then give me the asking, brother. Tell me what to refuse and I will refuse it.'],
				['그럼 청하는 걸 다오, 형. 뭐를 사양해야 하는지만 말해라. 사양할게.']
			),
			D('yung', '#d4b45a',
				['You cannot refuse it. It is already on. I counted the years. You count the rest.'],
				['사양 못 해. 이미 얹혔어. 지나간 해는 내가 셌으니, 남은 해는 네가 세어라.']
			),
			P(
				'Yung bows to his father, to his brother, to the screen — three bows, three depths, the Satek tutors watching their eleven years walk out. That night the tutors are dismissed. The resentment stays, and it starts learning to count in a new currency.',
				'융은 아버님께, 아우에게, 병풍에게 절한다 — 세 번, 깊이를 달리해. 사택 스승들은 열한 해가 걸어 나가는 것을 본다. 그날 밤 스승들은 물러난다. 원망은 남고, 새 돈으로 셈을 배우기 시작한다.'
			)
		);
		console.log('coup: inserted The Mark Moves');
	} else console.log('coup: already present');
}

/* ---------------- Descent: The Stair ---------------- */
{
	const e = entry('fall-of-euija', 'Descent');
	if (!has(e, 'between the Rock and the wine')) {
		const at = idx(e, isScene('The Banquet Hall'));
		e.blocks.splice(at, 0,
			SCENE('The Stair', '계단'),
			P(
				'On the stair between the Rock and the wine, the two princes meet coming opposite ways. Hyo carries a basket of his father’s unopened memorials. Yung carries nothing, which these days is a statement.',
				'바위와 술잔 사이 계단에서 두 왕자가 엇갈린다. 효는 아버님의 뜯지 않은 상소 한 광주리를 들고 있다. 융은 아무것도 들고 있지 않다. 요즘은 그것도 뜻이다.'
			),
			D('hyo', '#c9a86a',
				['Brother. Mother reads them all. She only sleeps when—'],
				['형. 어머님이 다 읽으세요. 주무시는 건—']
			),
			D('yung', '#d4b45a',
				['When what. When the mark sits straight on your forehead?'],
				['언제. 표가 네 이마에 바로 앉을 때?']
			),
			D('hyo', '#c9a86a',
				['It itches. If you want it back, take it. Tell Father I dropped it.'],
				['가렵다. 도로 가져가려면 가져가. 아버님께 떨어뜨렸다고 해라.']
			),
			D('yung', '#d4b45a',
				['I take nothing from behind screens. Enjoy the basket.'],
				['병풍 뒤에서 받는 건 없어. 광주리나 즐겨라.']
			),
			P(
				'He goes up. Hyo goes down. On the stair between them, eleven years — one going, one coming — and neither looks back, because brothers who look back on stairs fall.',
				'그는 올라가고 효는 내려간다. 사이 계단에 열한 해 — 하나는 가고 하나는 오고 — 둘 다 뒤돌아보지 않는다. 계단에서 뒤돌아보는 형제는 떨어지니까.'
			)
		);
		console.log('descent: inserted The Stair');
	} else console.log('descent: already present');
}

/* ---------------- Sabi: the eldest leaves, the mark kneels ---------------- */
{
	const e = entry('fall-of-baekje', 'Sabi');
	const crown = idx(e, hasText('puts on a crown'));
	if (!has(e, 'The eldest is already gone')) {
		e.blocks.splice(crown + 1, 0,
			P(
				'The eldest is already gone. Yung took the river gate in the night with four men and no mark on his forehead, and a boatman who will remember, years later, that the prince paid in Satek silver and asked which way the current runs at Ungjin. The answer is down. Everything at Ungjin runs down, caves included.',
				'맏이는 이미 없다. 융은 밤에 군사 넷과 이마의 표 없이 수구문으로 빠져나갔다. 뱃사공은 세월이 한참 지나서 기억할 것이다. 왕자가 사택 은으로 삯을 치르고 웅진의 물길이 어느 쪽으로 흐르느냐 물었다고. 답은 아래다. 웅진의 모든 것은 아래로 간다. 동굴까지도.'
			)
		);
		console.log('sabi: inserted Yung flight');
	} else console.log('sabi: flight already present');
	const flat = idx(e, hasText('Yung lies flat'));
	e.blocks[flat] = P(
		'Hyo lies flat on the ground and says nothing. The mark is still on his forehead, ground into the dirt. He wears it to the end, which is more than anyone in his house will do for him.',
		'효는 땅에 엎드려 아무 말도 하지 않는다. 표는 아직 이마에 있다, 흙에 문혀서. 그는 끝까지 쓰고 간다. 집안 누구도 그를 위해 해 주지 않을 일을.'
	);
	if (!has(e, 'The queen mother does not come out')) {
		const gate = idx(e, hasText('It was Chunbok who opened the gate'));
		e.blocks.splice(gate, 0,
			P(
				'The queen mother does not come out. She takes the household up to Busosan, the hill fort above the river, and holds it with women and old men until a soldier opens the gate for the Tang. The lists take her name, and Hyo’s, and twelve thousand others.',
				'대비는 나오지 않는다. 식솔을 데리고 강 위 산성 부소산성으로 올라가 여인들과 노인들로 버티다 군사 하나가 당을 위해 문을 열 때까지다. 명부가 그녀의 이름과 효의 이름, 그리고 만 이천의 이름을 가져간다.'
			),
			P(
				'The lists keep the younger brother for a page. Then the page turns, and history loses him the way a river loses a stone. In Chang’an the clerks will one day write “Yung” where the crown prince stood — the eldest holding his brother’s place in the paperwork, the way he never held it on the Rock.',
				'명부는 아우를 한 장에 적는다. 그러고 장이 넘어가면, 역사는 그를 강이 돌을 잃듯 잃는다. 장안의 서리들은 언젠가 태자가 섰던 자리에 “융”이라 쓸 것이다 — 맏이가 바위 위에서 한 번도 차지 못한 자리를 서류 위에서 차지하며.'
			)
		);
		console.log('sabi: inserted Busosan');
	} else console.log('sabi: busosan already present');
}

/* ---------------- Brothers' Coup ---------------- */
{
	const e = entry('final-stand', 'Brothers’ Coup');
	if (!has(e, 'They are carried both ways')) {
		const at = idx(e, hasText('Nonsense. They are my brothers.'));
		e.blocks.splice(at + 1, 0,
			P(
				'The whispers travel both ways because they are carried both ways. Seals are cut in the night that look like Gesomun’s and read like him — the old man’s own bluntness, borrowed by a hand that learned it in Surabol. Nobody in Pyongyang asks who profits when brothers read forged mail.',
				'속삭임이 양쪽으로 다니는 것은 양쪽으로 나르기 때문이다. 밤에 개소문의 것 같은 인장이 파인다 — 그 어르신의 퉁명함 그대로, 수라벌에서 배운 손이 빌려 쓴. 평양에선 형제가 위조 서찰을 읽을 때 누가 이득을 보는지 아무도 묻지 않는다.'
			)
		);
		console.log('brothers: inserted forged-mail mechanism');
	} else console.log('brothers: mechanism already present');
	if (!has(e, 'Heonseong')) {
		const at = idx(e, hasText('That night he rides north to the old capital'));
		e.blocks.splice(at, 0,
			P(
				'At Gungnae the old capital keeps his father’s other chair warm, and his eldest boy Heonseong — the one the uncles did not catch — says aloud what Namseng has been carrying since the gate.',
				'국내성에서 옛 도성이 아버님의 다른 자리를 데워 두고, 숙부들의 손에 잡히지 않은 맏아들 헌성이 남생이 성문 앞에서부터 짊어진 말을 입 밖에 낸다.'
			),
			P(
				'“They will kill you by paper, Father. The gate proved it. Go west before the paper reaches Gungnae.” Namseng looks at his son for a long time. Then he decides, in one word.',
				'“서류로 죽일 겁니다, 아버지. 성문이 증명했습니다. 서류가 국내성에 닿기 전에 서쪽으로 가십시오.” 남생이 아들을 오래 본다. 그러고 한 마디로 정한다.'
			),
			D('namseng', '#c25a4e', ['West.'], ['서쪽이다.'])
		);
		console.log('brothers: inserted Heonseong');
	} else console.log('brothers: heonseong already present');
	if (!has(e, 'Bojang does not want Namseng dead')) {
		const at = idx(e, isScene('Defection of Yeon Namseng'));
		e.blocks.splice(at, 0,
			P(
				'In Pyongyang the king’s seal comes out. Bojang does not want Namseng dead — he wants the brothers in one room, which is the one thing no seal in Pyongyang can buy that spring. Namgun’s men hold the seal-hand while it presses. The order says arrest. Everyone in the room hears execution, including the man it is written about, by the time the fast rider reaches him.',
				'평양에선 왕의 인장이 나온다. 보장왕은 남생을 죽이고 싶지 않다 — 형제를 한 방에 모으고 싶을 뿐인데, 그 봄 평양의 어떤 인장으로도 살 수 없는 것이 바로 그것이다. 남건의 군사들이 인장 든 손을 잡고 찍는다. 명령은 체포라 적혀 있다. 방 안 모두가 처형으로 듣는다. 빠른 말이 닿을 때쯤엔 그 명령이 쓰인 당사자까지도.'
			)
		);
		console.log('brothers: inserted Bojang seal');
	} else console.log('brothers: bojang already present');
	if (!has(e, 'with a white flag and ninety-eight men')) {
		const at = idx(e, isScene('Chang’an'));
		e.blocks.splice(at, 0,
			P(
				'Two brothers keep the city. Years from now one of them will walk out of it with a white flag and ninety-eight men, and be received with courtesy. The other will bar the gate, trust a monk with the keys, and have to be carried. Neither of them knows yet which is which — though Namsan, looking at the ground, has already begun to guess.',
				'두 아우가 성을 지킨다. 세월이 지나면 그중 하나가 백기와 아흔여덟 명을 들고 성을 걸어 나가 예로써 접대받을 것이다. 다른 하나는 문을 걸어잠그고 열쇠를 중에게 맡겼다가 들려 나갈 것이다. 둘 다 아직 누가 누군지 모른다 — 땅을 보는 남산은 이미 짐작하기 시작했을 뿐.'
			)
		);
		console.log('brothers: inserted white-flag plant');
	} else console.log('brothers: plant already present');
	if (!has(e, 'Two eldest sons, two rivers')) {
		e.blocks.push(
			P(
				'Two eldest sons, two rivers. In the south Yung counts his eleven years on a boat to Ungjin; in the north Namseng counts his thirty-two on the road to Chang’an. Each leaves a younger brother holding a burning house — Hyo with the mark, Namgun with the gate. The Tang will take both houses in. That is what the Tang are for.',
				'두 맏아들, 두 강. 남쪽에선 융이 열한 해를 세며 웅진으로 가는 배에 있고, 북쪽에선 남생이 서른두 해를 세며 장안으로 가는 길에 있다. 각자 불타는 집을 든 아우를 남긴다 — 효는 표를, 남건은 성문을. 당은 두 집을 다 받아들일 것이다. 당이란 그런 데 쓰는 것이다.'
			)
		);
		console.log('brothers: inserted mirror');
	} else console.log('brothers: mirror already present');
}

/* ---------------- Yellow Mountain: charges 1-4 ---------------- */
{
	const e = entry('fall-of-baekje', 'Yellow Mountain');
	const battlePhase = (ph) => (b) => b.kind === 'battle' && b.battle === 'hwangsan' && b.phase === ph;
	if (!has(e, 'three marks in the dust')) {
		const at = idx(e, battlePhase('first'));
		e.blocks.splice(at + 1, 0,
			P(
				'On the ridge Sukdal makes three marks in the dust with his thumb — left, middle, right — and wipes them out again. The tally is the same as morning. Five thousand. The arithmetic has not moved. That is the whole Baekje war plan, and it is working.',
				'능선에서 숙달이 엄지로 먼지에 세 금을 긋는다 — 왼쪽, 가운데, 오른쪽 — 도로 지운다. 셈은 아침과 같다. 오천. 산수가 움직이지 않았다. 그것이 백제 전쟁 계획의 전부이며, 먹히고 있다.'
			),
			D('gyebek', '#8a6f3f', ['Arrows?'], ['화살은?']),
			U(
				['Half what we loosed, General. The left camp shot wide on purpose.'],
				['쏜 것의 절반이 남았습니다, 장군. 왼쪽 진영은 일부러 헛쐈습니다.']
			)
		);
		console.log('yellow: charge 1 beat');
	} else console.log('yellow: charge 1 already present');
	if (!has(e, 'helmet too big')) {
		const at = idx(e, battlePhase('second'));
		e.blocks.splice(at + 1, 0,
			P(
				'The hwarang wedge reaches the stakes. That is the farthest any Silla man gets that day. A hwarang captain — seventeen, first campaign, helmet too big — takes a spear where the stakes break and holds it standing long enough for the men behind him to see his face. Yushin will ask his name at supper. Nobody will know it.',
				'화랑 쐐기가 말뚝에 닿는다. 그날 신라 군사 중에선 가장 먼 곳이다. 화랑 대장 하나 — 열일곱, 첫 출전, 투구가 크다 — 말뚝이 부서지는 자리에서 창을 받고도 뒤따르는 군사들이 제 얼굴을 볼 때까지 서서 버틴다. 유신은 저녁에 그 이름을 물을 것이다. 아는 사람이 없을 것이다.'
			),
			U(
				['The wedge broke on the stakes, Marshal. The boy held.'],
				['쐐기는 말뚝에서 부서졌습니다, 원수. 아이는 버텼습니다.']
			)
		);
		console.log('yellow: charge 2 beat');
	} else console.log('yellow: charge 2 already present');
	if (!has(e, 'Pace it again')) {
		const at = idx(e, battlePhase('third'));
		e.blocks.splice(at + 1, 0,
			D('pumil', '#6a8ab8', ['Forty paces. Pace it again.'], ['마흔 걸음. 다시 재어라.']),
			U(['Forty-one, General. Uphill.'], ['마흔하나입니다, 장군. 오르막으로요.']),
			P(
				'Pumil looks at the higher stakes for a long time. Somewhere up there Gyebek is counting too. That is the worst part of this morning. The counting.',
				'품일은 높아진 말뚝을 오래 본다. 저 위 어딘가에서 계백도 세고 있다. 오늘 아침 최악은 그거다. 셈하고 있다는 것.'
			)
		);
		console.log('yellow: charge 3 beat');
	} else console.log('yellow: charge 3 already present');
	if (!has(e, 'puts his hand on his son’s shoulder')) {
		const at = idx(e, battlePhase('fourth'));
		// after the duel paragraphs: anchor on the white-horse scream paragraph end -> insert before the "sit down" paragraph
		const sit = idx(e, hasText('sit down where they stand'));
		e.blocks.splice(sit, 0,
			P(
				'On the ridge Humsun puts his hand on his son’s shoulder and leaves it there. Bangul is fifteen and has been watching his father lose all morning the way sons watch. The hand says what Humsun will say with his mouth an hour from now, at his stirrup.',
				'능선에서 흠순이 아들 어깨에 손을 얹고 떼지 않는다. 방울은 열다섯이고, 아침 내내 아버지가 지는 것을 아들들이 보는 방식으로 봐 왔다. 그 손은 흠순이 한 시간 뒤 등자 앞에서 입으로 할 말을 미리 한다.'
			),
			U(['The white horse is bleeding, General.'], ['백마가 피를 흘립니다, 장군.']),
			D('gyebek', '#8a6f3f', ['Half a cut. Note it.'], ['반 칼. 적어 둬라.'])
		);
		console.log('yellow: charge 4 beat');
	} else console.log('yellow: charge 4 already present');
}

fs.writeFileSync(F, JSON.stringify(s, null, '\t') + '\n');
console.log('story.json written');
