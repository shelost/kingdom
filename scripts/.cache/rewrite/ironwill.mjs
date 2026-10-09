// Iron Will rewrite (#21–#30). Idempotent: each episode checks its own new first line before editing.
// node scripts/.cache/rewrite/ironwill.mjs
import { run, P, D, C, SCENE, CARD, BOLD, picker, reanchor } from './ironwill-lib.mjs';
import { textOf } from '../story-ops.mjs';

// ───────────────────────────── #21 Gumil ─────────────────────────────
const FIRST21 = 'Gumil counts rice for a living. None of it has ever been his.';
const CAVE21 = 'a warm cave in the hills';
const DAEYA21 = {
	'daeya-wide': 'DAEYA FORTRESS',
	'nsfw-maehwa-yard-stare': 'By noon the yard splits',
	'maehwa-garrison-01-well': 'By noon the yard splits',
	'maehwa-garrison-02-store': 'Up on the stair, a purple sleeve',
	'maehwa-garrison-03-post': 'The hem stays a breath too long',
	'nsfw-gumil-yehwa-night': 'The night before the feast',
	'lovers-parting-war': 'The night before the feast',
	'emotional-closeness-comfort': 'The night before the feast',
	'pumsuk-forbidden-desire': 'Tomorrow they all look',
	'fortress-gate-red-omen': 'The granary at Daeya can feed'
};
const KEEP21 = new Set([
	...Object.keys(DAEYA21),
	'nsfw-maehwa-chin-up',
	'nsfw-maehwa-tease',
	'nsfw-maehwa-walk-on',
	'nsfw-maehwa-figure-yard',
	'daeya_02',
	'daeya_03',
	'pumsuk-seq-01-walk',
	'pumsuk-hc-01-walk',
	'maehwa-feast-families',
	'maehwa-feast-hands',
	'pumsuk-seq-02-contain',
	'pumsuk-hc-02-contain',
	'nsfw-gumil-yehwa-sash'
]);

run(
	21,
	(e) => e.blocks[0]?.html === FIRST21,
	(e) => {
		const K = picker(e.blocks);
		e.blocks = [
			P(FIRST21, '검일은 쌀을 세어 먹고산다. 그중 제 것이었던 쌀은 한 톨도 없다.'),
			K('DAEYA FORTRESS'),
			{
				kind: 'place',
				place: 'daeya',
				html: 'The last wall between Baekje and the capital, and the granary behind it.',
				ko: '백제와 서라벌 사이의 마지막 성벽, 그리고 그 뒤의 곳간.'
			},
			{ kind: 'map', year: 642, places: ['daeya', 'sabi'] },
			P(
				'The granary at Daeya can feed the garrison through a winter siege. Gumil knows the exact number of sacks. He counted them. Every tally he writes goes up the stair to a young man in a purple sleeve, who seals it without reading it.',
				'대야성 곳간은 겨울 농성 한 철을 버틸 만큼의 쌀을 품고 있다. 검일은 그 가마니 수를 정확히 안다. 그가 셌으니까. 그가 쓰는 장부는 전부 계단 위, 자줏빛 소매의 젊은이에게 올라간다. 그 젊은이는 읽지도 않고 도장을 찍는다.'
			),
			K('A yellow-sleeve officer.'),
			P(
				'In Silla the sleeve tells you everything. Purple is True Bone, the old royal blood. Yellow is a man who will die at the rank he was born to. Nobody has to explain it twice. You can see it from across a yard.',
				'신라에서는 소매가 모든 걸 말해 준다. 자주는 진골, 오래된 왕의 피다. 누런 소매는 태어난 그 자리에서 죽을 사람이다. 두 번 설명할 필요도 없다. 마당 건너편에서도 보인다.'
			),
			SCENE('The Stair', '계단'),
			P(
				'This morning Gumil climbs the stair with the harvest tally and one more sheet under it. The second sheet is his. Four years of border pay, owed and never paid, added up to the last measure.',
				'오늘 아침 검일은 추수 장부와, 그 밑에 한 장을 더 끼워 계단을 오른다. 그 한 장은 제 것이다. 사 년 치 변방 녹봉, 받을 것인데 한 번도 못 받은 것을 마지막 한 되까지 더한 것.'
			),
			P(
				'Pumsuk is twenty-four. He has held the fortress for a year, because his blood is right and his wife’s father is Chunchu. He is not a bad man. He is just a man who has never had to read the second sheet.',
				'품석은 스물넷이다. 피가 맞고 장인이 춘추라서, 이 성을 맡은 지 한 해가 되었다. 나쁜 사람은 아니다. 그저 두 번째 장을 읽을 일이 한 번도 없었던 사람이다.'
			),
			D('pumsuk', ['The harvest count. Good.', 'And this?'], ['추수 셈이오. 좋소.', '이건 무엇이오?']),
			D(
				'gumil',
				['My pay, Commander. Four years of it.', 'The capital sends the rice. Somewhere between the capital and me, it gets eaten.'],
				['제 녹봉입니다요, 성주님. 사 년 치.', '서라벌에선 쌀을 보낸답니다. 서라벌하고 저 사이 어디선가 누가 다 먹어 치우고요.']
			),
			D(
				'pumsuk',
				['Four years…', 'I— that should not happen. I will write to Surabol.', 'After the feast. Everything is after the feast this week.'],
				['사 년이라…', '그건— 그래선 안 되는 일이오. 서라벌에 서신을 쓰겠소.', '잔치가 끝나면. 이번 주엔 모든 게 잔치 뒤요.']
			),
			P(
				'He seals the harvest count. He hands the second sheet back, unsealed, with a kind smile. He does not ask Gumil’s name. In a year he has never needed it.',
				'추수 장부에 도장을 찍는다. 두 번째 장은 도장 없이, 다정한 웃음과 함께 돌려준다. 검일의 이름은 묻지 않는다. 한 해 동안 그럴 일이 없었다.'
			),
			SCENE('The Granary', '곳간'),
			P(
				'Down in the granary Mochuk is waiting. He is yellow too: same rank, same pay, same four years. He reads Gumil’s face before Gumil sits.',
				'곳간 아래에서 모척이 기다리고 있다. 그도 누런 소매다. 같은 품계, 같은 녹봉, 같은 사 년. 검일이 앉기도 전에 얼굴부터 읽는다.'
			),
			D('mochuk', ['After the feast?'], ['잔치 끝나고, 랬지?']),
			D(
				'gumil',
				['After the feast.', 'Putting a boy this green in charge of the border — does that make any sense?'],
				['잔치 끝나고.', '아니, 이런 귀에 피도 안 마른 놈을 국경에 놓는 게 말이 되나?']
			),
			D('mochuk', ['Keep your voice down.', 'It makes sense to them. That’s the whole trouble.'], ['목소리 낮춰.', '저쪽은 말이 된다고 생각하지. 그게 문제야.']),
			K('Ah, forgotten what country this is?'),
			K('Why was I even born in this wretched country'),
			K('Silla uses men by bone rank.'),
			D('mochuk', ['Your wife says the same thing. Prettier.'], ['자네 마누라도 똑같은 소리 하더만. 더 예쁘게.']),
			D(
				'gumil',
				['My wife says a lot of things.', 'She wants a new jeogori for the feast. Silk. Green. I said yes.', '…With what, I didn’t say.'],
				['우리 마누라야 별소리 다 하지.', '잔치에 입을 새 저고리가 갖고 싶대. 비단으로. 초록으로. 그러마 했어.', '…뭘로 사 줄지는 말 안 했고.']
			),
			SCENE('Home', '집'),
			K('is the poorest woman in Daeya'),
			K('Plum blossom: the flower'),
			K('They all smell the same.'),
			K('Cover yourself when you go out.'),
			K('Buy me clothes, then.'),
			K('You know what I am paid.'),
			K('Which is why everyone looks.'),
			D('gumil', ['I asked today. For the four years.'], ['오늘 달라고 했어. 사 년 치.']),
			D('gumilwife', ['And?'], ['그래서?']),
			D('gumil', ['He smiled at me.'], ['웃더라.']),
			D('gumilwife', ['Did he.', 'What colour was the smile?'], ['웃었어?', '무슨 색으로?']),
			D('gumil', ['…Purple.'], ['…자주색.']),
			D('gumilwife', ['Then I’ll wear the old green.', 'Let them all see what you’re paid.'], ['그럼 헌 초록 입고 가지 뭐.', '당신 녹봉이 얼마인지 다들 보라고.']),
			K('The Well-Post'),
			P(
				'By noon the yard splits. Porters, smiths and the grain boys find work at the well-post. Maehwa crosses alone, in the green jeogori washed too many times and one red sash. They do not come closer. She does not invite them.',
				'한낮이 되면 마당이 갈라진다. 짐꾼, 대장장이, 곳간 아이들이 우물 기둥 곁에서 일거리를 찾는다. 매화가 혼자 마당을 건넌다. 너무 여러 번 빤 초록 저고리에 붉은 띠 하나. 사내들은 가까이 오지 않는다. 그녀도 부르지 않는다.'
			),
			K('Look at that hem…'),
			P(
				'She hears every unfinished sentence. Bored chin, and the men keep looking anyway. Dirt under the nails, the same sour drink on every breath. She is tired of being their festival. She walks as if the yard were built around her anyway.',
				'끝나지 않은 문장을 하나도 빠짐없이 듣는다. 지루한 턱. 사내들은 그래도 본다. 손톱 밑의 흙, 숨마다 같은 시큼한 술. 그들의 구경거리 노릇도 지겹다. 그래도 마당이 자기를 둘러 지어진 것처럼 걷는다.'
			),
			K('That is a road.'),
			P(
				'One of them forgets to close his mouth. She turns just enough. The hem stays a breath too long, and she lets him have that second like a coin she can afford to drop. Then the silk falls back.',
				'한 놈이 입 다무는 걸 잊는다. 그녀는 딱 그만큼만 돈다. 치맛자락이 한 숨쯤 오래 머문다. 떨어뜨려도 아깝지 않은 동전처럼 그 한순간을 그에게 준다. 그리고 비단이 다시 내려온다.'
			),
			K('She didn\'t even say anything.'),
			P(
				'She leaves them wrecked on the packed earth and almost smiles. Up on the stair, a purple sleeve has stopped in the middle of a sentence. The yard is about the curve she takes with her.',
				'흙마당에 그들을 무너뜨려 놓고, 그녀는 거의 웃는다. 계단 위에서 자줏빛 소매 하나가 말을 하다 멈춘다. 마당은 그녀가 데리고 가는 곡선의 것이다.'
			),
			P(
				'Over the hills, King Euija reads Silla’s border the way he reads everything: patiently, and only once. Daeya is young at the top and hollow underneath. He sends Yunchung with ten thousand men.',
				'산 너머에서 의자왕은 신라의 국경을, 모든 것을 읽듯이 읽는다. 참을성 있게, 그리고 단 한 번만. 대야성은 윗자리가 어리고 그 밑이 비어 있다. 그는 윤충에게 군사 만 명을 준다.'
			),
			P(
				`Surabol’s dreams don’t change. Its famous sword is far from here this week, in ${CAVE21}, being told by three women who should not exist to watch a door in the north. That is another night’s story. Nobody tells Daeya anything.`,
				'서라벌의 꿈자리는 그대로다. 그 유명한 칼은 이번 주 여기서 멀리, 산속 따뜻한 동굴에 있다. 있어선 안 될 세 여인이 그에게 북쪽의 문을 조심하라 이른다. 그건 다른 밤의 이야기다. 대야에는 아무도 아무 말도 해 주지 않는다.'
			),
			K('The Night Before'),
			P(
				'The night before the feast, the room is only a lamp and the two of them. The old green jeogori hangs on its peg, mended at the seam for tomorrow. They still know how to find each other. They will not know how tomorrow.',
				'잔치 전날 밤, 방에는 등잔 하나와 두 사람뿐이다. 헌 초록 저고리가 내일을 위해 솔기를 기운 채 못에 걸려 있다. 그들은 아직 서로를 찾을 줄 안다. 내일은 모를 것이다.'
			),
			K('Tomorrow the boy arrives.', (b) => {
				b.en[0] = 'Tomorrow they all look.';
				b.lines[0] = '내일은 다들 쳐다보겠지.';
			}),
			K('Leave tomorrow for tomorrow.'),
			D('gumil', ['I’ll get the four years. I will.', 'You’ll have silk by the first frost.'], ['사 년 치 받아 낼 거야. 진짜로.', '첫서리 전엔 비단 입혀 줄게.']),
			D('gumilwife', ['Liar.', '…Say it again anyway.'], ['거짓말쟁이.', '…그래도 한 번 더 말해 봐.']),
			P(
				'They stop talking. The lamp is too small for manners. The red sash comes off the way it always does in this room, one impatient pull, and the old silk follows it onto the boards. Thirty-one, and she still puts him where she wants him.',
				'말이 멎는다. 예의를 차리기엔 등잔이 너무 작다. 붉은 띠는 이 방에서 늘 그렇듯 성급하게 한 번에 풀리고, 헌 비단이 그 뒤를 따라 마루에 떨어진다. 서른하나. 그녀는 아직도 그를 원하는 자리에 둔다.',
				{ nsfw: true }
			),
			K('Tomorrow can wait.'),
			P(
				'She knows his body the way a person knows a door they have opened every winter. He says her name at the end, not a rank. They sleep facing the same wall. In the morning the silk goes back on as if the night had been ordinary. It never is.',
				'그녀는 그의 몸을 겨울마다 열어 온 문처럼 안다. 끝에 그는 품계가 아니라 그녀 이름을 부른다. 둘은 같은 벽을 보고 잠든다. 아침이면 비단은 아무 일 없던 밤처럼 다시 입혀진다. 그런 밤은 없다.'
			),
			K('The Feast'),
			P(
				'The harvest feast fills the long hall. Purple at the top table, yellow at the back, families on the floor between. Lady Gotaso sits beside her husband for the first cup and goes up at the first drum. She is seventeen, and wine makes her sleepy.',
				'추수 잔치가 긴 전각을 채운다. 윗상엔 자주, 뒷줄엔 누런 소매, 그 사이 바닥엔 식구들. 고타소 아씨는 첫 잔까지 남편 곁에 앉았다가 첫 북소리에 올라간다. 열일곱이고, 술을 마시면 졸리다.'
			),
			P(
				'At the feast the wine finds Pumsuk first. Clean ice-blue silk, a cup he is not tasting. Then the lamp-line is hers. Maehwa walks the cheap hanging lamps like she built them, in the old green and the red sash tied by habit. Every head at the top table turns. His turns last, and stays.',
				'잔치에서 술은 품석을 먼저 찾는다. 깨끗한 연하늘 비단, 맛보지 않는 잔. 그다음 등잔 줄은 그녀의 것이다. 매화는 싸구려 걸이 등잔 사이를 제가 지은 것처럼 걷는다. 헌 초록 저고리에 버릇처럼 맨 붉은 띠. 윗상의 고개가 모두 돌아간다. 그의 고개가 맨 마지막에 돌아가고, 거기 머문다.'
			),
			P(
				'The feast is not a private room. It is every man in Daeya and the families they brought. Bowls stop. Necks turn. The wives watch her, not the food, and the watching is already a fight. The families are still eating. She is already working.',
				'잔치는 밀실이 아니다. 대야의 사내들과 데려온 식구들이다. 그릇이 멈춘다. 고개가 돈다. 아내들은 밥이 아니라 그녀를 보고, 그 눈이 이미 싸움이다. 식구들은 아직 먹고 있다. 그녀는 이미 일하고 있다.'
			),
			P(
				'She takes a plum from a tray and eats it slowly, because a plum is cheaper than silk. She has practised this. At the back of the hall, among the yellow sleeves, Gumil watches the purple sleeve watch his wife.',
				'그녀는 쟁반에서 자두 하나를 집어 천천히 먹는다. 자두가 비단보다 싸니까. 연습한 것이다. 전각 뒤편, 누런 소매들 사이에서 검일은 자줏빛 소매가 제 아내를 보는 것을 본다.'
			),
			P(
				'Pumsuk talks to his cup. It does not help. The training is a joke tonight. Nine years of Hwarang drill, and nobody taught him what to do with his eyes.',
				'품석은 잔에 대고 말한다. 소용없다. 오늘 밤 수련은 농담이다. 아홉 해의 화랑 수련 동안 누구도 눈 둘 곳은 가르쳐 주지 않았다.'
			),
			P(
				'Then he does something he has not done in a year. He sends for the grain clerk.',
				'그러다 그는 한 해 동안 한 번도 안 하던 일을 한다. 곳간지기를 부른다.'
			),
			D('pumsuk', ['You. The— grain tallies. You are…', 'I am sorry. Your name.'], ['자네. 그— 곳간 장부. 자네가…', '미안하오. 이름이.']),
			D('gumil', ['Gumil, Commander.', 'Four years.'], ['검일입니다요, 성주님.', '사 년째요.']),
			D('pumsuk', ['Gumil. Yes.', 'That woman. In the green. Who is she?'], ['검일. 그렇지.', '저 여인. 초록 입은. 누구요?']),
			P(
				'Gumil has waited four years for the purple sleeve to learn his name. It has taken a plum.',
				'자줏빛 소매가 제 이름을 알게 되기까지 검일은 사 년을 기다렸다. 자두 하나면 되는 일이었다.'
			),
			D('gumil', ['My wife, Commander.'], ['제 처입니다요, 성주님.']),
			P(
				'Pumsuk goes very red. He looks into his cup. Then he does the worst kind thing a man in his chair can do.',
				'품석의 얼굴이 아주 붉어진다. 잔 속을 내려다본다. 그리고 그 자리에 앉은 사내가 베풀 수 있는 가장 고약한 친절을 베푼다.'
			),
			D(
				'pumsuk',
				[
					'Your pay. The four years.',
					'Bring the sheet to me tomorrow. I will seal it myself.',
					'And— tonight. Baekje is on the road. Every sack in the stores counted by dawn. You are the only one who can do it right.'
				],
				[
					'자네 녹봉 말이오. 사 년 치.',
					'내일 그 장을 가져오시오. 내가 직접 도장을 찍겠소.',
					'그리고— 오늘 밤. 백제가 길에 올랐소. 날이 밝기 전에 곳간 가마니를 전부 세어 놓으시오. 제대로 셀 사람은 자네뿐이오.'
				]
			),
			P(
				'It may be an honest order. Baekje really is on the road. Gumil will spend the rest of his life deciding which it was.',
				'정직한 명령일 수도 있다. 백제는 정말 길에 올랐다. 검일은 그게 어느 쪽이었는지 남은 평생 따지게 될 것이다.'
			),
			D('gumil', ['…By dawn, Commander.'], ['…날 밝기 전까지요, 성주님.']),
			P(
				'On his way out he passes Maehwa. He does not tell her to cover herself. She does not ask where he is going. She saw him on the stair, and she can count too.',
				'나가는 길에 매화를 지난다. 가리라는 말은 하지 않는다. 그녀도 어디 가느냐고 묻지 않는다. 계단 앞의 그를 봤고, 그녀도 셀 줄은 안다.'
			),
			D(
				'gumilwife',
				['The plum— ah, it’s the mouth, Commander, not the cup.', 'Your lady went up early.', 'Twenty-four, and still sitting here.'],
				['자두요— 아, 잔 말고 입이에요, 성주님.', '아씨는 일찍 올라가셨던데.', '스물넷에, 아직도 여기 앉아 계시네.']
			),
			P(
				'He does the correct thing. He stands. He bows to a feast that has not asked him to leave. He goes up past Gotaso’s pink door to a cold pallet of his own. It does not take him.',
				'그는 옳은 일을 한다. 일어선다. 아무도 나가라 하지 않은 잔치에 절한다. 고타소의 분홍 방문을 지나 제 차가운 침상으로 올라간다. 잠은 그를 받아 주지 않는다.'
			),
			BOLD(
				'One husband counting sacks till dawn. One cold pallet. One feast still lit down the hall. How long can a True Bone lie still…?',
				'새벽까지 가마니를 세는 남편 하나. 차가운 잠자리 하나. 복도 끝엔 아직 불 밝힌 잔치. 진골은 얼마나 오래 누워 버틸 수 있을까…?'
			)
		];
		return reanchor(e, { byId: DAEYA21, fallback: CAVE21, force: (im) => !KEEP21.has(im.id) });
	}
);

// ───────────────────────────── #22 Maehwa ─────────────────────────────
const MARK22 = 'Did you walk past it on the way down?';
const ACT22 = 'The lamp keeps dying and he does not stop';

run(
	22,
	(e) => e.blocks.some((b) => b.en?.includes(MARK22)),
	(e) => {
		const K = picker(e.blocks);
		e.blocks = [
			K('A man is measured by his self-control.'),
			K('HE TRIES TO SLEEP'),
			P(
				'One dying lamp on dark timber. He lies in ice-blue with his eyes open. He tries to sleep and the hall comes with him: her hip, her mouth, the plum. A True Bone should be able to close his eyes. He is twenty-four. He knows exactly why he can’t.',
				'검은 마루 위에 꺼져 가는 등잔 하나. 그는 연하늘 비단 차림으로 눈을 뜨고 누워 있다. 자려 하면 전각이 따라 들어온다. 그녀의 허리, 그녀의 입, 그 자두. 진골이라면 눈쯤은 감을 수 있어야 한다. 그는 스물넷이다. 왜 못 감는지 너무 잘 안다.',
				{ nsfw: true }
			),
			P(
				'She arrives in the gold behind his lids, plum first. The look-back in the dark, over a shoulder in mended green. He sits up. Palm on the ice-blue, as if he could press the night flat.',
				'감은 눈꺼풀 뒤 금빛 속으로 그녀가 온다. 자두부터. 어둠 속에서 돌아보는 눈길, 기운 초록 어깨 너머로. 그는 일어나 앉는다. 연하늘 비단 위에 손바닥. 밤을 눌러 펼 수 있기라도 한 것처럼.'
			),
			P(
				'On his way down he passes Gotaso’s door. A pink ribbon hangs on the post where her maid tied it. He turns his shoulder so his sleeve won’t brush it. That is the whole of his self-control tonight, and he is proud of it for four steps.',
				'내려가는 길에 고타소의 방문을 지난다. 시녀가 묶어 둔 분홍 댕기가 기둥에 걸려 있다. 소매가 스치지 않게 어깨를 돌린다. 오늘 밤 그의 절제는 그게 전부다. 그리고 그는 네 걸음 동안 그게 자랑스럽다.'
			),
			K('Back at the Feast'),
			K('He goes back. The families'),
			K('Here— ah, don’t bother with the wind.'),
			K('She sits like the chair was always hers.'),
			K('My mouth opened first.'),
			D(
				'gumilwife',
				['Stores. Till dawn. Your order, Commander.', 'Hand— here. On the knot. It’s already tearing.', 'You didn’t do that. Not yet.'],
				['곳간이요. 새벽까지. 성주님 명이잖아요.', '손— 여기. 매듭에. 벌써 다 해졌어요.', '성주님이 그런 거 아니에요. 아직은.']
			),
			K('She puts his clean True'),
			K('I should move—'),
			K('You were counting. Not the cup.'),
			K('She counts his looks out loud.'),
			P(
				'She leans him into the post. His ice-blue has come open at the chest, clean silk, stupidly clean next to her mended green. Her mouth finds the tendon. She does not move back.',
				'그녀가 그를 기둥에 기대 세운다. 연하늘 비단이 가슴께에서 벌어져 있다. 깨끗한 비단. 그녀의 기운 초록 옆에서 바보처럼 깨끗하다. 그녀의 입이 그의 목 힘줄을 찾는다. 물러서지 않는다.'
			),
			K('Wait— I’ll make a sound.'),
			K('I’m not waiting. Sorry.'),
			K('Then she does the modest'),
			K('I’m going— I don’t mean go.'),
			K('He is already on the floor.'),
			K('My knees got here first.'),
			P(
				'She looks down at him, a little pleased. She does not start with her hands. She takes a plum from the tray. She puts the plum in her mouth so he has to watch. Thirty-one. She has never rushed a man who was already lost.',
				'그녀가 그를 내려다본다. 조금 흐뭇하게. 손부터 쓰지 않는다. 쟁반에서 자두를 집는다. 그가 볼 수밖에 없게 자두를 입에 문다. 서른하나. 이미 넘어온 사내를 서두른 적은 한 번도 없다.'
			),
			D('pumsuk', ['I have a wife upstairs.'], ['…위에 아내가 있소.']),
			D('gumilwife', ['I know. Gotaso. The pink ribbon.', MARK22], ['알아요. 고타소. 분홍 댕기.', '내려오면서 그 앞 지나왔어요?']),
			D('pumsuk', ['A man is measured by it.', '…I turned my shoulder.'], ['사내는 그걸로 재는 법이오.', '…어깨를 돌렸소.']),
			D(
				'gumilwife',
				['Half of a True Bone.', 'Still more than mine will ever be.'],
				['진골 반쪽이네.', '그래도 우리 그이가 평생 가져 볼 것보다는 많네.']
			),
			P(
				'The mouth goes first. He holds her like he is afraid the hall will take her back. Wine on her tongue, and a hunger ten years older than his. The feast keeps talking on the other side of the cheap screen.',
				'입이 먼저 간다. 그는 전각이 그녀를 도로 데려갈까 겁내는 사람처럼 그녀를 붙든다. 혀끝의 술, 그리고 그보다 십 년은 묵은 허기. 싸구려 병풍 저편에서 잔치는 계속 떠든다.',
				{ nsfw: true }
			),
			P(
				`As little silk as the lamp allows. She means to teach him, and keeps the teacher-voice for three breaths. Then the voice thins. He is not gentle, and she does not ask him to be. She meant to laugh. The laugh becomes a scream, and the feast behind the screen goes quiet to listen. ${ACT22}.`,
				'등잔이 허락하는 만큼만 비단이 남는다. 그녀는 가르칠 생각이었고, 세 숨 동안은 선생 목소리를 지킨다. 그러다 목소리가 가늘어진다. 그는 부드럽지 않고, 그녀도 그러라고 하지 않는다. 웃을 생각이었다. 웃음이 비명이 되고, 병풍 뒤 잔치가 귀를 기울이느라 조용해진다. 등잔은 자꾸 꺼져 가고 그는 멈추지 않는다.',
				{ nsfw: true }
			),
			D('gumilwife', ['Don’t— don’t you dare stop—', 'I hate you. I hate you—'], ['멈추지— 멈추기만 해 봐—', '미워. 진짜 미워—'], { nsfw: true }),
			D('pumsuk', ['Don’t go back to him.', 'Not tonight—'], ['그자에게 돌아가지 마시오.', '오늘 밤만은—'], { nsfw: true }),
			P(
				'When the lamp dies they are both still on the worn pine. She cannot sit up yet. She does not try. The feast on the other side of the screen has gone very quiet.',
				'등잔이 꺼질 때 둘은 아직 낡은 소나무 마루 위에 있다. 그녀는 아직 일어나 앉지 못한다. 애쓰지도 않는다. 병풍 저편 잔치는 아주 조용해졌다.'
			),
			P(
				'He stands. He looks once, the way a man looks at someone he has already lost. He never asked her name. He leaves the feast without a word, back into the rank that will pretend this timber never happened. She stays on the floor.',
				'그가 일어선다. 이미 잃은 사람을 보듯 한 번 본다. 끝내 이름은 묻지 않았다. 그는 말 한마디 없이 잔치를 떠난다. 이 마루가 없었던 일인 척해 줄 품계 속으로. 그녀는 바닥에 남는다.'
			),
			SCENE('Dawn', '새벽'),
			P(
				'By dawn the whole fortress has a version. The well-post has three.',
				'새벽이 되자 성 안 사람마다 제 이야기가 하나씩 있다. 우물가에는 셋이 있다.'
			),
			C(
				'🗣',
				['The commander took Gumil’s wife.', 'Took? I heard she—', 'Took. He’s True Bone. That’s how it gets written.'],
				['성주가 검일이 마누라를 뺏었대.', '뺏어? 내가 듣기론 그 여자가—', '뺏은 거야. 진골이잖아. 적을 땐 그렇게 적는 거야.']
			),
			D('gumilwife', ['Took.', '…Is that what happened.'], ['뺏었다.', '…그런 거였구나.']),
			K('Before this, the commander Pumsuk'),
			K('Morning comes. So does her husband')
		];
		return reanchor(e, {
			byAt: {
				'He tries to contain himself': 'I should move—',
				'From his eyes the chest is the lamp': 'His palm finds the worn knot',
				'Heart-pupils, if anyone looked that close': 'Her mouth finds the tendon',
				'She loses the room': 'The laugh becomes a scream',
				'White milk on the dirtied green': 'When the lamp dies'
			},
			fallback: ACT22
		});
	}
);

// ───────────────────────────── #23 Siege of Daeya ─────────────────────────────
const FIRST23 = 'Gumil comes home at dawn with every sack in Daeya counted. He sits down to count one more thing.';

run(
	23,
	(e) => e.blocks[0]?.html === FIRST23,
	(e) => {
		const K = picker(e.blocks);
		e.blocks = [
			P(FIRST23, '검일은 대야의 가마니를 하나도 빠짐없이 세고 새벽에 집에 온다. 그리고 앉아서 하나를 더 센다.'),
			K('THE NEXT MORNING'),
			P(
				'Grey in the door-slit. Gumil comes back from the stores and finds his wife where the True Bone left her, the old green still open, last night still on the boards. He does not ask if she is hurt. He asks for the story.',
				'문틈이 잿빛이다. 검일은 곳간에서 돌아와, 진골이 두고 간 그 자리에서 아내를 찾는다. 헌 초록 저고리는 아직 벌어져 있고, 간밤은 아직 마루 위에 있다. 다쳤느냐고 묻지 않는다. 이야기를 하라고 한다.'
			),
			K('From the start.'),
			K('The lamp-line.'),
			K('The name.'),
			P(
				'She tells it. The walk. The knot. The scream the screen did not hide. He makes her say the leaving last. She tells him she said the wife’s name, and the boy stayed anyway.',
				'그녀가 말한다. 걸음. 매듭. 병풍이 가려 주지 못한 비명. 그는 떠나는 대목을 맨 마지막에 말하게 한다. 그녀는 아내의 이름을 입에 올렸는데도 그 애가 그대로 있더라고 말한다.'
			),
			K('He didn’t speak.'),
			K('A half is better.', (b) => {
				b.en = ['Half a True Bone.', 'More than mine.', 'You said that too. Did you.'];
				b.lines = ['진골 반쪽이.', '내 것보다 낫다고.', '그 말도 했어. 했어?'];
			}),
			K('Your men. These walls. This country.'),
			K('You are <b>trash</b> as well.'),
			P(
				'They stand in the door-slit of morning and do not touch. What is left is the count of what she said, and a marriage that has finished speaking.',
				'둘은 아침 문틈에 서서 서로 닿지 않는다. 남은 것은 그녀가 한 말의 셈, 그리고 할 말을 다 해 버린 혼인이다.'
			),
			P(
				'By noon she has a bundle and the old green on her back. She leaves by the south gate on her own feet. Nobody else in Daeya will.',
				'한낮이 되자 그녀는 보따리 하나에 헌 초록을 걸치고 있다. 남문으로, 제 발로 나간다. 대야에서 그렇게 나가는 사람은 그녀 하나뿐일 것이다.'
			),
			D('gumil', ['Where.'], ['어디로.']),
			D('gumilwife', ['Somewhere nobody knows my husband.'], ['우리 남편을 아무도 모르는 데.']),
			K('That is the last thing they ever say to each other.'),
			SCENE('The Roof', '지붕'),
			P(
				'Three weeks later, Yunchung’s ten thousand are under the wall. From the granary roof you can count their cookfires. Gumil does.',
				'세 주 뒤, 윤충의 만 명이 성벽 아래에 와 있다. 곳간 지붕에 오르면 그들의 밥 짓는 불을 셀 수 있다. 검일은 센다.'
			),
			D('mochuk', ['How many?'], ['몇 개야?']),
			D('gumil', ['Enough.', 'What if the stores burned? The whole winter. Gone.'], ['넉넉해.', '곳간이 타 버리면 어떨까? 겨울 한 철이. 통째로.']),
			D(
				'mochuk',
				['Then the walls don’t matter. Nobody holds a wall hungry.', '…You’ve thought about it.'],
				['그럼 성벽이고 뭐고 소용없지. 굶으면서 성벽 지키는 놈은 없어.', '…생각해 봤구나.']
			),
			D(
				'gumil',
				['Their general sent a man. Keeps his word, they say.', 'Open the granary gate when the fire starts. He takes the wall. We walk out.'],
				['저쪽 장수가 사람을 보냈어. 약속은 지키는 놈이래.', '불이 나면 곳간 문을 열어. 그쪽이 성벽을 먹고. 우린 걸어 나가.']
			),
			D('mochuk', ['We?'], ['우리?']),
			D('gumil', ['You’re yellow too.'], ['너도 누런 소매잖아.']),
			K('The Granary Gate'),
			P(
				'The fire starts where Gumil starts it. Gumil puts the torch to the stores he counted, sack by sack, in the order he wrote them down.',
				'불은 검일이 붙인 데서 시작된다. 검일은 제가 센 곳간에 횃불을 댄다. 장부에 적은 순서대로, 한 가마니씩.'
			),
			K('Mochuk lifts the bar.'),
			P(
				'Gumil puts his shoulder to the other leaf and opens the granary gate to Yunchung. It is not for Baekje. It is not for money.',
				'검일이 다른 쪽 문짝에 어깨를 대고, 윤충에게 곳간 문을 열어 준다. 백제를 위해서가 아니다. 돈 때문도 아니다.'
			),
			K('Why are you doing this. Truly.'),
			D('gumil', ['Because everyone in this fortress is trash.'], ['이 성 사람들은 다 쓰레기니까.']),
			P(
				'He is quoting her. He will keep quoting her for the eighteen years he has left, until a king he wronged finds him.',
				'아내의 말을 옮기는 것이다. 남은 십팔 년 동안 그는 계속 그 말을 옮길 것이다. 그가 저버린 왕이 그를 찾아낼 때까지.'
			),
			SCENE('The Wall', '성벽'),
			P(
				'From the granary roof Gumil watches the rest. Smoke. Shouting. A purple sleeve on the wall, asking the dark for terms.',
				'곳간 지붕에서 검일은 나머지를 지켜본다. 연기. 고함. 성벽 위의 자줏빛 소매 하나가 어둠에 대고 조건을 묻는다.'
			),
			K('If you swear to spare us all'),
			K('I swear it on that bright sun.'),
			P(
				'Beside him a yellow-sleeve officer named Jukjuk says what yellow sleeves never say upstairs.',
				'그 곁에서 죽죽이라는 누런 소매 하나가, 누런 소매들이 윗자리에선 절대 하지 않는 말을 한다.'
			),
			D(
				'jukjuk',
				['Commander. Baekje turns its word over like a hand.', 'That sweet talk is bait. Don’t open the gate.'],
				['성주님. 백제는 손바닥 뒤집듯 말을 바꾸는 나라입니다.', '저 달콤한 말은 미끼입니다. 성문을 열지 마십시오.']
			),
			D('pumsuk', ['…My wife is inside.'], ['…안에 내 아내가 있소.']),
			P(
				'The gate opens. The oath lasts until the last Silla shield is down. Then the killing starts. Yunchung turns his horse so the sun is behind him. On the roof, Gumil is not glad. He had thought he would be.',
				'성문이 열린다. 맹세는 마지막 신라 방패가 내려질 때까지만 간다. 그다음엔 살육이 시작된다. 윤충은 해가 등 뒤로 가도록 말머리를 돌린다. 지붕 위의 검일은 기쁘지 않다. 기쁠 줄 알았다.'
			),
			K('The Inner Room'),
			P(
				'In the inner room Gotaso understands before anyone says the word. Her pink ribbon is crooked on the post. She tied it again herself at dawn, badly, and knew why. She is seventeen, and the forever she promised at the wedding has run out of road.',
				'안방에서 고타소는 누가 말하기도 전에 안다. 기둥의 분홍 댕기가 삐뚤다. 새벽에 제 손으로 다시 묶었다. 서툴게. 그리고 왜 그래야 했는지 알았다. 열일곱. 혼례 날 약속한 영원은 갈 길이 다했다.'
			),
			K('If you are going to do it'),
			P(
				'Pumsuk looks at her, the way she asked. Then he does what a True Bone does when there is no road left. First her, then himself. He looks at her the whole time.',
				'품석은 그녀가 청한 대로 그녀를 본다. 그리고 길이 끊긴 진골이 하는 일을 한다. 그녀를 먼저, 그다음 저 자신을. 그동안 내내 그녀를 본다.'
			),
			K('ledger under one arm, crow-dark robe'),
			K('It keeps a ledger, and it is never late.'),
			P(
				'Kangrim reads her name aloud three times before he asks anything. Gotaso. Gotaso. Gotaso. It is the underworld’s way of making sure the ledger has opened the right door.',
				'강림은 무엇을 묻기 전에 그녀의 이름을 세 번 크게 부른다. 고타소. 고타소. 고타소. 명부가 올바른 문을 열었는지 확인하는 저승의 방식이다.'
			),
			K('The underworld’s fetch.'),
			K('One question, then we walk.'),
			K('I don’t know your face.'),
			K('I collect.'),
			K('Is that allowed?', (b) => {
				b.lines[2] = '…저를 데리러 왔을 때, 그이 옷에 뭐가 묻어 있었어요. 이따 갈아입겠다고 했고.';
			}),
			K('Honest. Rare.'),
			K('She goes with him surprised to the last'),
			P(
				'He reads the husband’s name three times next. Pumsuk. Pumsuk. Pumsuk. A second door in the same fortress.',
				'이어 남편의 이름을 세 번 부른다. 품석. 품석. 품석. 같은 성 안의 두 번째 문.'
			),
			K('Hwarang Pumsuk.'),
			K('I wanted the love and the oath to be one thing.'),
			P(
				'Kangrim does not ask him. You may decide whether that is mercy. A year ago Pumsuk rode into Daeya beside her cart, at the wheel, never ahead. Tonight he walks behind her into the dark.',
				'강림은 그에게 묻지 않는다. 그게 자비인지는 당신이 정하시라. 한 해 전 품석은 그녀의 수레 곁에서, 바퀴 옆에서, 한 번도 앞서지 않고 대야에 들어왔다. 오늘 밤 그는 그녀 뒤를 따라 어둠 속으로 걸어간다.'
			),
			SCENE('The Last Gate', '마지막 문'),
			P(
				'Jukjuk gathers the men who are left and shuts the inner gate behind them.',
				'죽죽이 남은 군사를 모아 안쪽 성문을 닫아건다.'
			),
			C('🗣', ['Sir— surrender while they’re still offering!'], ['나리— 받아 줄 때 항복하십시다!']),
			D(
				'jukjuk',
				[
					'My father named me for the bamboo.',
					'So I would not wither in the cold season. So I might be broken but never bent.',
					'How should I fear death, and live by surrendering?'
				],
				['아버지께서 대나무를 따라 내 이름을 지으셨소.', '추운 철에도 시들지 말라고. 부러질지언정 굽히지는 말라고.', '죽음이 두려워 항복해서 살 수야 있겠소?']
			),
			P(
				'He holds the inner gate until sundown. Then he is broken, exactly as promised, and not bent.',
				'그는 해 질 녘까지 안쪽 문을 지킨다. 그리고 약속대로 부러진다. 굽지 않고.'
			),
			K('The Moon Palace'),
			K('Daeya has fallen…'),
			K('…What was it that girl said at her wedding.'),
			K('“We will be happy forever.”'),
			K('Chunchu (39)', (b) => {
				b.html =
					'Chunchu does not shout. He asks, very calmly, for the names of everyone who was inside the fortress. Then, more calmly still, for the name of the man who opened the gate.';
				b.ko = '춘추는 소리치지 않는다. 아주 차분하게, 그 성 안에 있던 사람들의 이름을 모두 적어 오라 이른다. 그리고 더 차분하게, 성문을 연 자의 이름을.';
			}),
			K('One summer. Daeya was the door'),
			K('It was Pumsuk who swore to protect your daughter.'),
			K('I am the one who made him swear it.'),
			K('The Empty Hall'),
			K('lowers herself down beside him'),
			K('In go, when you lose a stone'),
			K('Then stop counting.'),
			K('he asks the Queen for a road north'),
			K('The Moon Palace Gate'),
			K('waits at the gate the way a boy waits'),
			K('Look at the road. Don’t look away.'),
			K('I will make a country where sisters come home.'),
			K('Start by surviving your father.'),
			K('In Pyongyang, Yeon has spent all summer bowing.')
		];
		return reanchor(e, {
			byAt: {
				'does not let go': 'From the start',
				'When he comes it is with her name': 'He makes her say the leaving last',
				'They stand in the door-slit of dawn': 'They stand in the door-slit',
				'Yunchung’s fire through the gate': 'Yunchung’s ten thousand are under the wall',
				'Three weeks later Yunchung’s fire': 'Yunchung’s ten thousand are under the wall',
				'calm fury': 'does not shout',
				'Chunchu (39)': 'does not shout'
			},
			fallback: 'he asks the Queen for a road north'
		});
	}
);

// ───────────────────────────── #24 Yeon’s Massacre ─────────────────────────────
const FIRST24 = 'Everyone in Pyongyang agrees that a man who bows all summer has learned his place.';

run(
	24,
	(e) => e.blocks[0]?.html === FIRST24,
	(e) => {
		const K = picker(e.blocks);
		const at = (frag) => e.blocks.findIndex((b) => textOf(b).includes(frag));
		const old = e.blocks;
		const pick = (from, to) => old.slice(at(from), at(to) + 1).map((b) => structuredClone(b));
		e.blocks = [
			P(FIRST24, '여름 내내 고개를 숙인 사내라면 제 분수를 배운 것이다. 평양에서는 다들 그렇게 생각한다.'),
			...pick('dies in the spring, in his own bed', 'Every door in the hall closes at once'),
			K('The side doors were never for servants.', (b) => {
				b.html =
					'The side doors were never for servants. When they open again, Yeon’s soldiers come through every one of them. Tables overturn. Wine becomes a darker color before anyone names it. Yeon does not shout orders. He walks the length of the room the way a man walks a border he has already decided to keep, and he takes each commander’s blade himself.';
				b.ko =
					'옆문은 원래 하인을 위한 것이 아니었다. 다시 열릴 때, 그 문마다 연의 군사들이 들이닥친다. 상이 뒤집힌다. 술이, 누가 이름 붙이기 전에, 더 어두운 색이 된다. 연은 명령을 외치지 않는다. 이미 지키기로 한 국경을 걷듯 전각을 가로지르며, 장수들의 칼은 제 손으로 거둔다.';
			}),
			...pick('First the Southern Commander.', 'Three crows. The hall’s lamps lean'),
			P(
				'<b>Lee Gaesa</b> carries no banner. He is the Summit’s clerk, and he wrote its verdict on Yeon: one winter on the border, and do not come back. Tonight he has wine in his mouth, and then nothing.',
				'<b>이가사</b>는 깃발을 든 적이 없다. 대대로 회의의 서기이고, 연에게 내린 판결을 제 손으로 적었다. 국경에서 겨울 한 철, 그리고 돌아오지 말 것. 오늘 밤 그의 입에는 술이 있고, 그다음엔 아무것도 없다.'
			),
			K('That day… I…'),
			D(
				'gesomun',
				['Lee Gaesa.', 'You wrote me one winter.', 'I am giving you one night.'],
				['이가사.', '그대는 내게 겨울 한 철을 적어 주었소.', '나는 그대에게 하룻밤을 주겠소.']
			),
			P('Four. The verdict becomes metal he can wear.', '넷. 그에게 내린 판결이, 멜 수 있는 쇠가 된다.'),
			K('Last of the banners: his uncle.'),
			K('A feast… like this…', (b) => {
				b.en = ['Nephew…', 'Traitor… a feast… like this…'];
				b.lines = ['조카…', '역적 놈… 잔치를… 이렇게…'];
			}),
			K('A Yeon takes this one from a Yeon.', (b) => {
				b.en = ['Uncle.', 'You told me to sit down.', 'You called me traitor for standing.', '….', 'A Yeon takes this one from a Yeon.'];
				b.lines = ['숙부.', '앉으라 하셨지요.', '일어섰다고 역적이라 하셨고.', '….', '이 칼은 연씨가 연씨에게서 거둡니다.'];
			}),
			K('Five ring-pommels. Five crows.'),
			K('for the final blow'),
			K('With gold… decades…'),
			K('He had already priced your head.', (b) => {
				b.en[1] = 'The gold was never going to be enough. The Tang emperor had already priced your head.';
				b.lines[1] = '금으로 될 일이 아니었습니다. 당 황제는 이미 폐하의 목값을 매겨 두었으니.';
			}),
			K('Five Blades</b> onto his own back'),
			K('He wore five swords on his body'),
			...pick('Red-wing chalgap fills the door', 'Yeon enthrones the king’s nephew as'),
			...pick('You there… what is your name?', 'M-my name?'),
			D('gesomun', ['You there… what is your name?'], [old[at('M-my name?') + 1].lines[0]]),
			K('The old king’s nephew.'),
			K('A chair he built himself'),
			K('He makes one more appointment'),
			K('I have had you by the scruff'),
			K('I only need the name', (b) => {
				b.en[2] = 'The one who speaks to the people is you.';
			}),
			K('for as long as you still listen to me'),
			K('Yeon listens. Not always.'),
			K('The Temples'),
			P(
				'After the blood dries, Yeon looks at the temples. They own half the capital and pray for whoever is winning. He has an idea about that, which can wait. One young monk named <b>Shinsung</b> learns how to wait too.',
				'피가 마른 뒤 연은 절들을 본다. 도읍의 절반을 가졌고, 누가 이기든 이기는 쪽을 위해 비는 절들이다. 거기에 대해 그는 생각이 하나 있다. 그건 기다려도 된다. <b>신성</b>이라는 젊은 스님도 기다리는 법을 배운다.'
			),
			...pick('Pray quieter.', 'What has the most strength?'),
			K('AFTER THE KNIVES'),
			K('In the markets the news arrives'),
			K('they say he’s dead.', (b) => {
				b.en = ['The king… they say he’s dead.', 'The commanders too. More than a hundred.'];
				b.lines = ['임금이… 죽었대…', '대장들도. 백이 넘는다고.'];
			}),
			...pick('Some say the Eternal General', 'On the barracks steps'),
			P(
				'The capital learns a new etiquette. Officials swear loyalty to the <b>Supreme Commander</b>’s door, not the nephew-king’s smile. Envoys who ask for an audience are told the kingdom is closed for inventory: of grain, of blades, of who belongs inside the walls.',
				'도읍이 새 예법을 배운다. 관리들은 조카왕의 미소가 아니라 <b>대막리지</b>의 문에 충성을 맹세한다. 알현을 청하는 사신은 나라가 재고 조사 중이라는 말을 듣고 돌아간다. 곡식과, 칼과, 성 안에 남을 자격의.'
			),
			...pick('The Yeon House', 'A kingdom with its doors shut, and a man with five swords')
		];
		return reanchor(e, {
			byAt: {
				'blood and tears fill the banquet hall': 'Wine becomes a darker color',
				'You gave me the word.': 'You wrote me one winter.',
				'sends for Tang masters of the Way': 'One young monk named',
				'murdered the king': 'for the final blow'
			},
			fallback: 'Wine becomes a darker color'
		});
	}
);

// ───────────────────────────── #25 Chunchu & Yeon ─────────────────────────────
const FIRST25 = 'Every morning since Daeya, Chunchu asks the Queen for the same thing. Every morning she says no.';

run(
	25,
	(e) => e.blocks[0]?.html === FIRST25,
	(e) => {
		const K = picker(e.blocks);
		const old = e.blocks;
		const at = (frag) => old.findIndex((b) => textOf(b).includes(frag));
		const pick = (from, to) => old.slice(at(from), at(to) + 1).map((b) => structuredClone(b));
		e.blocks = [
			P(FIRST25, '대야성이 떨어진 뒤로 아침마다 춘추는 여왕께 같은 것을 청한다. 아침마다 여왕은 안 된다고 한다.'),
			P(
				'He wants to go north to Pyongyang and borrow an army against Baekje. Then news comes down from the north, a month late, the way it always does.',
				'북쪽 평양에 가서 백제를 칠 군사를 빌려 오겠다는 것이다. 그러다 북쪽 소식이 내려온다. 늘 그렇듯 한 달 늦게.'
			),
			...pick('The King of Goryeo, murdered by his own subject?', '“Yeon Gesomun”…'),
			D('sunduk', ['A man who kills his own king at a banquet.', 'And you want to go and ask him for a favour.'], ['제 임금을 잔치에서 죽인 자일세.', '그런 자에게 자네가 부탁을 하러 가겠다고?']),
			D(
				'chunchu',
				['A man like that is the only kind who can still say yes, Majesty.', 'Everyone else has to ask a council.'],
				['그런 자라야 아직 "예"라고 할 수 있습니다, 폐하.', '다른 이들은 다 회의에 물어야 하니까요.']
			),
			D('sunduk', ['And what will it cost?'], ['값은 얼마인가?']),
			D('chunchu', ['Only me. I’m cheap.'], ['저 하나면 됩니다. 저는 쌉니다.']),
			D(
				'sunduk',
				['Nothing you do is cheap, Chunchu.', '…Go. Before I think of a better question.'],
				['자네가 하는 일 중에 싼 건 없네, 춘추.', '…가게. 내가 더 좋은 질문을 떠올리기 전에.']
			),
			P('The Queen lets him go. Nobody offers to go instead.', '여왕이 그를 보낸다. 대신 가겠다는 사람은 없다.'),
			K('Hangyul’s hooves', (b) => {
				b.en = ['If you go and do not return, my white horse will trample Goryeo underfoot without fail.'];
				b.lines = ['공이 가서 돌아오지 않는다면, 내 흰 말의 말발굽이 반드시 고려 왕정을 짓밟을 것이오.'];
			}),
			...pick('I will return within sixty days.', 'On the sixtieth day'),
			SCENE('The Mangniji’s Desk', '막리지의 책상'),
			P(
				'In Pyongyang, Dosuryu brings Yeon two pieces of paper on the same morning. One is the envoy’s letter to the king. The other is a scout’s report from the border.',
				'평양에서 도수류가 같은 날 아침 연에게 종이 두 장을 가져온다. 하나는 사신이 왕에게 쓴 편지다. 다른 하나는 국경에서 온 척후의 보고다.'
			),
			D(
				'dosuryu',
				[
					'The letter says he’ll ask his queen to give back the passes.',
					'He won’t, of course.',
					'This one says ten thousand Silla men are camped at the border. With a white horse at the front.'
				],
				['편지엔 저놈이 제 여왕한테 고개를 돌려 달라 청하겠다고 써 있어.', '물론 안 하겠지.', '이건 신라 군사 만이 국경에 진을 쳤다는 거고. 맨 앞에 흰 말이 있대.']
			),
			K('The Sword of the Divine Country is coming?'),
			K('Sir?'),
			K('Release Chunchu.'),
			K('Surely… you are not afraid?', (b) => {
				b.en = ['Who is this Sword of Silla, that the Eternal General jumps like this?', 'Don’t tell me… you’re afraid?'];
				b.lines = ['신라의 검이 누군데 영원의 대장군이 이렇게 펄쩍 뛰어?', '설마… 겁나는 건 아니지?'];
			}),
			K('does not poke a tiger', (b) => {
				b.en[0] = 'Old man— even a man ready to die does not poke a tiger for no reason.';
				b.lines = ['형님, 아무리 죽을 각오를 한 자라도, 호랑이는 함부로 건드리는 게 아니오.', '우리도 언젠가 유신을 대적할 날이 오겠지…', '하지만 춘추 따위로 그럴 건 아니오.'];
			}),
			D(
				'gesomun',
				['Keep the letter.', 'He signed it. One day I’ll make him read it back to me.', 'That’s the win.'],
				['편지는 두시오.', '저놈이 서명했소. 언젠가 내 앞에서 소리 내 읽게 할 거요.', '그거면 이긴 거요.']
			),
			...pick('The Border Camp', 'ties both reins around his right wrist'),
			D('chunchu', ['They opened my door the morning your camp appeared. No reason given.'], ['자네 진이 선 그날 아침에 내 방 문이 열렸네. 까닭도 없이.']),
			D('yushin', ['Perhaps he heard I was coming.'], ['내가 온다는 소리를 들었나 보지.']),
			D('chunchu', ['(…A more fearsome man than I expected. Both of them.)'], ['(…생각보다 무서운 자다. 둘 다.)']),
			...pick('One envoy coming south, ten thousand Silla men', 'One envoy left Pyongyang bleeding.')
		];
		return reanchor(e, {
			byAt: {
				'this time the Queen lets him go': 'The Queen lets him go',
				'Yushin is coming!': 'a white horse at the front'
			},
			fallback: 'The Queen lets him go'
		});
	}
);

// ───────────────────────────── #26 Euija & Yeon ─────────────────────────────
const FIRST26 = 'King Euija hears how Goguryeo’s king died, and feels the one thing a king should never admit to. Envy.';

run(
	26,
	(e) => e.blocks[0]?.html === FIRST26,
	(e) => {
		const K = picker(e.blocks);
		const old = e.blocks;
		const at = (frag) => old.findIndex((b) => textOf(b).includes(frag));
		const pick = (from, to) => old.slice(at(from), at(to) + 1).map((b) => structuredClone(b));
		e.blocks = [
			P(FIRST26, '의자왕은 고구려 왕이 어떻게 죽었는지 듣고, 왕이라면 절대 인정해선 안 될 감정을 느낀다. 부러움.'),
			SCENE('Sabi', '사비'),
			K('The King of Goryeo, murdered by his own subject?'),
			K('This is an opportunity…'),
			D(
				'euija',
				['A whole Summit, in one dinner.', 'If I tried that, the Satek would serve me in the soup.', 'Gyebek. We’re going north.'],
				['회의 하나를 통째로, 저녁 한 끼에.', '내가 그랬다간 사택 놈들이 나를 국에 넣어 끓이겠지.', '계백아. 북쪽에 간다.']
			),
			D('gyebek', ['How many days.'], ['며칠입니까.']),
			D('euija', ['As long as it takes. Forever, if he’s charming.'], ['걸리는 만큼. 그자가 재미있으면 영원히.']),
			D('gyebek', ['Forever is not a number, Majesty.', 'I will pack for twenty.'], ['영원은 숫자가 아닙니다, 폐하.', '스무 날 치를 싸겠습니다.']),
			P(
				'Other kings would write for troops. Euija rides north himself, with three men, one of them Gyebek counting the days. The man at the door does not give his name.',
				'다른 왕이라면 군사를 청하는 편지를 쓸 것이다. 의자는 직접 북으로 간다. 데려가는 것은 셋, 그중 하나는 날짜를 세는 계백이다. 문 앞의 사내는 이름을 대지 않는다.'
			),
			...pick('Pyongyang', 'Besides… of the two men in this room'),
			K('puts the blade on the table'),
			P(
				'Behind the king, Gyebek’s hand is already on his own hilt. Nobody saw it get there.',
				'왕의 등 뒤에서 계백의 손은 이미 제 칼자루에 가 있다. 언제 갔는지 본 사람이 없다.'
			),
			K('Give me one reason I should not cut you down'),
			D('gyebek', ['Four steps.'], ['네 걸음.']),
			D('gesomun', ['Three.'], ['세 걸음이오.']),
			D('gyebek', ['Four. You are leaning back.'], ['네 걸음이오. 몸을 뒤로 빼고 있소.']),
			...pick('Pfft—hahahahahaha!!', 'Wait… wait. The Supreme Commander of a country'),
			K('Do not laugh.', (b) => {
				b.en[2] = 'That blood is the bone of these people.';
				b.lines[2] = '그 피가 이 겨레의 뼈다.';
			}),
			...pick('There was probably a man who shot well.', 'What the marches tell'),
			...pick('Yeon asks for the same thing he asked Chunchu for.', 'Kings who forget docks'),
			...pick('Do you know a “Kim Chunchu” of Silla?', 'It was not flattery.'),
			D('euija', ['And the other one? Their sword. Kim Yushin.'], ['그럼 다른 하나는? 저쪽 칼 말이오. 김유신.']),
			P(
				'Yeon’s cup stops an inch from his mouth. Just for a breath. Then he drinks.',
				'연의 잔이 입 앞 한 치에서 멈춘다. 딱 한 숨. 그리고 마신다.'
			),
			D('euija', ['Ha! Did you see that, Gyebek? His cup stopped.'], ['하! 봤느냐, 계백아? 잔이 멈췄다.']),
			D('gesomun', ['I don’t flinch.'], ['나는 움찔하지 않소.']),
			D('gyebek', ['It stopped, Majesty.'], ['멈췄습니다, 폐하.']),
			...pick('You came with three. You’re leaving with five.', 'I have a gift for gathering people.'),
			D(
				'gesomun',
				['You. The one who counts steps.', 'Stay in Pyongyang. I’ll give you a horse worth riding.'],
				['너. 걸음 세는 놈.', '평양에 남아라. 탈 만한 말 한 필 주지.']
			),
			D('gyebek', ['I gave my word.'], ['약조를 했소.']),
			D('euija', ['Don’t bother. He only ever says it once.'], ['관두시오. 저놈은 그 말을 딱 한 번만 하오.']),
			K('In the morning he rides south with all five.'),
			P('On the road home, Euija is still laughing.', '돌아오는 길에도 의자는 계속 웃는다.'),
			D('euija', ['His cup stopped! Find out why.'], ['잔이 멈췄어! 왜인지 알아 와.']),
			D('gyebek', ['Yes, Majesty.'], ['예, 폐하.']),
			P(
				'He does not wait for the answer. By the first frost, forty-odd Silla fortresses are flying Baekje yellow. He takes them in one autumn, and he laughs the whole way.',
				'그는 답을 기다리지 않는다. 첫서리가 내릴 무렵, 신라 성 마흔 남짓에 백제의 누런 깃발이 걸린다. 한 가을에 다 거두고, 내내 웃는다.'
			),
			K('attacked more than forty Silla cities'),
			K('Why does the Eternal General flinch at one Silla name?')
		];
		return reanchor(e, { fallback: 'Look at this map.' });
	}
);

// ───────────────────────────── #27 Nangbi ─────────────────────────────
const CARD27 = 'Thirteen years on, the banner captain has a queen, a title, and forty fortresses Baekje just took from her. He wants them back…!';

run(
	27,
	(e) => e.blocks.at(-1)?.html === `<b>${CARD27}</b>`,
	(e) => {
		const K = picker(e.blocks);
		const old = e.blocks;
		const at = (frag) => old.findIndex((b) => textOf(b).includes(frag));
		const pick = (from, to) => old.slice(at(from), at(to) + 1).map((b) => structuredClone(b));
		e.blocks = [
			...pick('a name that strikes fear in all of Samhan', 'Put your helmet on.'),
			P(
				'The white horse takes the trench in one jump that the men in it will describe for the rest of their lives, usually with their hands. Mud to the girth. A horn somewhere, too late. The Goguryeo line bends where he hits it, like a wall that has just remembered it is made of men. In, out. In again. The third time Yushin comes back there is something heavy hanging from his saddle, and the men in the trench are already climbing out after him.',
				'흰 말은 단번에 참호를 뛰어넘는다. 그 안에 있던 병사들이 평생, 대개는 손짓까지 해 가며 이야기하게 될 도약이다. 뱃대끈까지 차오르는 진흙. 어딘가에서 뒤늦은 뿔피리. 그가 부딪친 자리에서 고구려의 줄이 휜다. 제가 사람으로 쌓였다는 걸 막 떠올린 성벽처럼. 들어갔다, 나왔다. 다시 들어간다. 세 번째로 유신이 돌아올 때 안장에는 묵직한 것이 매달려 있고, 참호의 병사들은 벌써 그를 따라 기어 나오고 있다.'
			),
			...pick('He brings the weight on his saddle back', 'Five thousand heads. Off one charge.'),
			K('You. At the Colossal River.'),
			K('He had a ditch and a horse.', (b) => {
				b.en = ['I had thirty thousand men, a river on my side, and Ulchi giving the orders.', 'He had a ditch and a horse.'];
				b.lines = ['나한텐 삼만 군사가 있었고, 강도 우리 편이었고, 을지 공이 명을 내렸다.', '이놈은 도랑 하나에 말 한 필이다.'];
			}),
			...pick('Gesomun has seen his father angry', '…Kim Yushin.'),
			K('That’s where the name comes from.', (b) => {
				b.html =
					'That’s where the name comes from. Not from his own capital, which likes its titles stamped and filed. From the people he beat. Goguryeo calls him the Sword of Silla first, and means it as a warning. On the border, mothers use it to get children indoors before dark.';
				b.ko =
					'그 이름은 거기서 나왔다. 칭호에 도장 찍어 철해 두기 좋아하는 제 나라 도읍에서가 아니다. 그에게 진 사람들에게서다. 고구려가 먼저 그를 신라의 검이라 부른다. 경고의 뜻으로. 국경의 어머니들은 해 지기 전 아이들을 불러들일 때 그 이름을 쓴다.';
			}),
			P(
				'Thirteen years later, Gesomun hears that sword is riding for the Silla envoy in his prison, and opens the cell. A few months after that, a laughing king says the name across a table. Gesomun’s cup stops an inch from his mouth. Now you know why.',
				'십삼 년 뒤, 개소문은 그 검이 자기 감옥의 신라 사신을 구하러 온다는 소식을 듣고 옥문을 연다. 몇 달 뒤, 잘 웃는 왕 하나가 술상 너머로 그 이름을 입에 올린다. 개소문의 잔이 입 앞 한 치에서 멈춘다. 이제 왜인지 아실 것이다.'
			),
			BOLD(CARD27, '십삼 년이 지나, 그 깃발 대장에게는 여왕과 칭호가 있다. 그리고 백제가 방금 그 여왕에게서 빼앗은 성 마흔 개. 그는 그걸 되찾고 싶다…!')
		];
		return reanchor(e, { byAt: { 'Then he mounted, drew his': 'In, out. In again.' }, fallback: 'Hangyul' });
	}
);

// ───────────────────────────── #28 Forty Fortresses ─────────────────────────────
const FIRST28 = 'Baekje took forty Silla fortresses in one autumn. Silla’s answer reaches Sabi at breakfast.';
const NOT28 = 'It is not one of the forty';

run(
	28,
	(e) => e.blocks[0]?.html === FIRST28,
	(e) => {
		const K = picker(e.blocks);
		e.place = 'surabol';
		e.blocks = [
			P(FIRST28, '백제는 한 가을에 신라 성 마흔 개를 빼앗았다. 신라의 대답은 아침상에 맞춰 사비에 닿는다.'),
			K('I-i-it’s Kim Yushin!!'),
			K('You’ve never heard of Kim Yushin…?'),
			K('Kim Yushin is the Greatest Blade of Samhan'),
			K('In Baekje’s markets they spit'),
			K('Forty fortresses, along a border', (b) => {
				b.year = 642;
			}),
			P('What reached Sabi had started a week earlier, in Surabol.', '사비에 닿은 그것은 한 주 전 서라벌에서 시작되었다.'),
			SCENE('The Moon Palace', '월성'),
			D('sunduk', ['Forty, Yushin.'], ['마흔일세, 유신.']),
			D('yushin', ['I’ll start with one, Majesty.'], ['하나부터 하겠습니다, 폐하.']),
			D('sunduk', ['Which one?'], ['어느 것부터?']),
			D('yushin', ['One of theirs. The one they think is safest.'], ['저쪽 것으로요. 저들이 제일 안전하다고 여기는 것.']),
			SCENE('The Gate', '대문'),
			P(
				'He rides out that afternoon. The road runs past his own gate, and his household is lined up outside it, hoping. He does not turn his head. Fifty paces on he stops and sends a spearman back to the house for a cup of water.',
				'그는 그날 오후 떠난다. 길은 제 집 대문 앞을 지나고, 집안 사람들이 혹시나 하고 대문 밖에 줄지어 서 있다. 그는 고개를 돌리지 않는다. 오십 걸음쯤 가서 말을 세우고, 창병 하나를 집으로 보내 물 한 잔을 떠 오게 한다.'
			),
			D('yushin', ['The water at home still tastes the way it used to.'], ['우리 집 물은 아직도 옛 맛이 나는구나.']),
			C('🗣', ['He didn’t even look at the house.', '…He drank the water, though.'], ['집 쪽은 쳐다보지도 않으셨어.', '…물은 드셨잖아.']),
			P('Chunchu is waiting at the city gate, as if by accident.', '춘추가 성문에서 기다리고 있다. 우연인 척.'),
			D('chunchu', ['Your wife was at the gate. I saw her.', 'You could have stopped. One cup, inside.'], ['자네 부인이 대문 앞에 서 있더군. 내가 봤네.', '잠깐 들를 수도 있었잖나. 안에서 한 잔.']),
			K('If I stopped, they would invent a reason for my stopping.'),
			SCENE('The River Fort', '강가의 성'),
			P(
				'The fort sits on a bluff over a crossing, the kind of post a Baekje sentry gets sent to for a rest. Two of them are dicing by the brazier.',
				'성은 나루 위 벼랑에 앉아 있다. 백제 보초가 쉬러 보내지는 그런 자리다. 둘이 화로 곁에서 주사위를 던지고 있다.'
			),
			C('🗣', ['Silla won’t come this far. They’re busy crying over forty forts.', 'Throw.'], ['신라가 여기까진 안 와. 성 마흔 개 잃고 우느라 바쁠걸.', '던져.']),
			P(
				'The other one does not throw. He is looking at the ridge. There is a pale horse on it, standing very still, and then there isn’t.',
				'다른 하나는 던지지 않는다. 능선을 보고 있다. 거기 흰 말 한 마리가 아주 가만히 서 있다. 그리고 없다.'
			),
			P(
				'Yushin’s men come up the bluff in the dark, where nobody climbs because nobody can. By the time the brazier is kicked over they are on the wall.',
				'유신의 군사들은 어둠 속에서 벼랑을 오른다. 아무도 못 오르니 아무도 안 지키는 자리다. 화로가 걷어차일 무렵 그들은 이미 성벽 위에 있다.'
			),
			C('🗣', ['K-… IT’S KIM YUSHIN!!'], ['기… 김유신이다!!']),
			P(
				'The defence breaks before it starts. In the storehouse a young Baekje officer is trying to fire the rice before Silla can eat it. His hands shake too much for the flint.',
				'방어는 시작되기도 전에 무너진다. 곳간에서는 백제의 젊은 장교 하나가 신라가 먹기 전에 쌀에 불을 지르려 애쓰고 있다. 손이 너무 떨려 부싯돌이 안 맞는다.'
			),
			D('yushin', ['Put it down. Nobody burns anything tonight.'], ['내려놓게. 오늘 밤엔 아무도 아무것도 태우지 않네.']),
			C('🗣', ['…You’re not going to kill me?'], ['…안 죽이십니까?']),
			D('yushin', ['Go home. Tell them who sent you.'], ['집에 가게. 누가 보냈는지 말하고.']),
			P(
				`${NOT28}. It is one of Baekje’s own, and that is the message. He has never been in a hurry about anything except a charge.`,
				'마흔 중 하나가 아니다. 백제 제 성이다. 그게 전하는 말이다. 그는 돌격 말고는 무엇에도 서두른 적이 없다.'
			),
			K('opened the Gahye crossing'),
			K('Sabi'),
			P('The young officer comes home. He tells it the way he was told to.', '젊은 장교가 돌아온다. 시킨 그대로 전한다.'),
			D('euija', ['He sent you home? With your sword on?'], ['너를 돌려보냈다고? 칼까지 채워서?']),
			K('Yushin, my friend~~'),
			D('euija', ['Gyebek. How many did he take?'], ['계백아. 몇 개나 가져갔느냐?']),
			D('gyebek', ['One, Majesty. One of ours. None of the forty.'], ['하나입니다, 폐하. 우리 성 하나. 마흔 중엔 하나도 없습니다.']),
			D('euija', ['…He isn’t taking them back.', 'He’s sending me the bill.', 'Could you beat him?'], ['…되찾는 게 아니로구나.', '값을 청구하는 거야.', '너라면 이기겠느냐?']),
			D('gyebek', ['I have not met him.'], ['만나 본 적이 없습니다.']),
			P(
				'Euija laughs, because it is the most honest answer anyone has given him all morning.',
				'의자가 웃는다. 오늘 아침 누구한테 들은 대답보다 정직했으니까.'
			),
			K('One star over Samhan tonight.')
		];
		const cave = 'The water at home still tastes';
		return reanchor(e, {
			byAt: {
				'In the meantime': 'Silla’s answer reaches Sabi at breakfast',
				'Between campaigns he still goes alone to the cavern lake': cave,
				'Between campaigns he': cave,
				'질문을 들고 왔든, 언덕이': cave,
				'세 가지요. 북쪽 문. 여왕의': cave,
				'앉으려고도 할 거야. 경고는': cave,
				'Hyullé does not': cave,
				'After the twentieth,': NOT28,
				'After the twentieth, nobody was counting.': NOT28,
				'Over the next few': 'had started a week earlier'
			},
			fallback: 'had started a week earlier'
		});
	}
);

// ───────────────────────────── #29 The Eastern Star ─────────────────────────────
const FIRST29 = 'There is a hill above Surabol where two boys once lay on their backs and argued about a star. Thirty years on, they climb it again.';

run(
	29,
	(e) => e.blocks[0]?.html === FIRST29,
	(e) => {
		const K = picker(e.blocks);
		const old = e.blocks;
		const at = (frag) => old.findIndex((b) => textOf(b).includes(frag));
		const pick = (from, to) => old.slice(at(from), at(to) + 1).map((b) => structuredClone(b));
		e.blocks = [
			P(FIRST29, '서라벌 위에는 언덕이 하나 있다. 옛날 두 소년이 거기 드러누워 별 하나를 두고 다퉜다. 삼십 년 뒤, 둘이 다시 그 언덕을 오른다.'),
			P(
				'Yushin still has river-fort mud on his boots. Chunchu’s left hand is still in its sling. Neither of them mentions either.',
				'유신의 장화엔 아직 강가 성의 진흙이 묻어 있다. 춘추의 왼손은 아직 천에 걸려 있다. 둘 다 그 얘기는 꺼내지 않는다.'
			),
			...pick('Well — is it enough now?', 'Thirty years and you are still saying that.'),
			D(
				'chunchu',
				[
					'I want the chair, brother. I’ll say it once, up here, where only the star can hear.',
					'Daeya was a room I wasn’t in. I won’t stand outside the room again.'
				],
				['형님, 저는 그 자리를 원합니다. 여기서 한 번만 말하겠습니다. 별만 듣는 데서.', '대야는 제가 없던 방이었습니다. 다시는 방 밖에 서 있지 않겠습니다.']
			),
			D('yushin', ['Then I will stand beside you.'], ['그럼 내가 자네 곁에 서지.']),
			P(
				'He said that once before, on this hill, when he was seventeen and it cost nothing. It costs something now. He says it in exactly the same voice.',
				'예전에 이 언덕에서 한 번 한 말이다. 열일곱이었고, 아무 값도 들지 않던 때였다. 지금은 값이 든다. 그는 꼭 같은 목소리로 말한다.'
			),
			...pick('Sabi', 'a man should hold a larger dream'),
			D(
				'gyebek',
				['Your Majesty.', 'In Pyongyang, Gesomun offered me a horse.', 'I gave my word. You said to judge for myself. I judged.'],
				['폐하.', '평양에서 개소문이 제게 말을 한 필 주겠다 했습니다.', '약조를 했습니다. 스스로 판단하라 하셨지요. 판단했습니다.']
			),
			P(
				'Euija opens his mouth to laugh, and for once does not. He looks at Gyebek a long moment. Then he pours two cups and pushes one across the table, which a king does not do.',
				'의자는 웃으려고 입을 열다가, 웬일로 웃지 않는다. 한참 계백을 본다. 그러고는 잔 둘을 따라 하나를 상 건너로 밀어 준다. 왕은 그런 걸 하지 않는다.'
			),
			...pick('The Sacred Cave', 'The Holy King forged a country here.'),
			K('You gave me monsters.', (b) => {
				b.en[2] = 'Holy King, you gave me monsters.';
			}),
			...pick('Until every bone in me is broken.', 'Gesomun wants a country.')
		];
		return reanchor(e, {
			byAt: { 'He touches the': 'In Pyongyang, Gesomun offered me a horse' },
			fallback: 'The banquet hall has been'
		});
	}
);

// ───────────────────────────── #30 Emperor ─────────────────────────────
const MARK30 = 'He has his excuse.';

run(
	30,
	(e) => e.blocks.at(-1)?.html?.includes(MARK30),
	(e) => {
		const K = picker(e.blocks);
		e.blocks = [
			K('Far to the west, a man who owns half the world'),
			K('Half the world sends tribute here'),
			P(
				'The grapes are from Gaochang. Three summers ago it was a kingdom. Now it is a province with very good grapes.',
				'포도는 고창에서 왔다. 세 해 전 여름만 해도 나라였다. 지금은 포도가 아주 좋은 고을이다.'
			),
			P(
				'The courier has ridden from the far north-east with a report in a lacquered tube. The emperor reads it himself, which his ministers dread. He reads the name twice.',
				'파발은 머나먼 동북에서 옻칠한 통에 보고서를 넣어 달려왔다. 황제가 그것을 몸소 읽는다. 신하들이 제일 두려워하는 일이다. 그는 그 이름을 두 번 읽는다.'
			),
			K('Zhang Jian, Governor-General of Yingzhou'),
			P(
				'One character of that name nobody in this palace may write, because it belonged to the emperor’s late father. So a clerk wrote another one. The man in Pyongyang will be furious when he hears. That is a story for later.',
				'그 이름의 한 글자는 이 궁에서 아무도 쓸 수 없다. 황제의 선친 이름자이기 때문이다. 그래서 서기가 다른 글자를 썼다. 평양의 그 사내가 들으면 노발대발할 것이다. 그건 나중 이야기다.'
			),
			K('The Second Emperor of Tang.'),
			SCENE('The Night Audience', '밤의 알현'),
			D(
				'taizong',
				['Gai… Suwen.', 'He murdered his lord and seized the government. It is truly not to be borne.'],
				['개…소문.', '제 임금을 죽이고 나라를 틀어쥐었다. 참으로 참을 수 없도다.']
			),
			D('chusuiliang', ['The report is dated the ninth month, Majesty. It took the summer to arrive.'], ['보고는 구월 자로 되어 있사옵니다, 폐하. 오는 데 여름이 꼬박 걸렸습니다.']),
			P(
				'You may notice who is saying “not to be borne.” He did not get his own chair by waiting for it either. Nobody at this court mentions that. Nobody is allowed to.',
				'"참을 수 없다"고 말하는 이가 누구인지 눈치채셨을 것이다. 그도 제 자리를 얌전히 기다려서 얻은 사람은 아니다. 이 조정에서 아무도 그 얘기를 하지 않는다. 할 수가 없다.'
			),
			D(
				'taizong',
				[
					'With what we have today, taking the place would not be hard.',
					'But I do not wish to wear out the people. For now, let the Khitan and the Mohe harass him. What do you say?'
				],
				['오늘 가진 군사로 그곳을 취하기는 어렵지 않으리라.', '허나 백성을 수고롭게 하고 싶지 않노라. 우선은 거란과 말갈을 시켜 그를 어지럽히라. 경은 어찌 보는가?']
			),
			D(
				'chusuiliang',
				[
					'The Khitan were given silk last spring, Majesty. They harassed the Mohe.',
					'The last time Majesty asked what anyone said was the spring Gaochang fell. I have the date.'
				],
				['거란은 지난봄에 비단을 받았사옵니다, 폐하. 그리고 말갈을 어지럽혔습니다.', '폐하께서 누구에게 어찌 보느냐 물으신 것은 고창이 떨어진 그 봄이 마지막이었사옵니다. 날짜도 적어 두었습니다.']
			),
			D(
				'taizong',
				['When I have taken everything, nobody will be left to tell me no.', '…That was a joke.'],
				['짐이 모든 것을 취하고 나면, 짐에게 아니라 할 자가 하나도 남지 않으리라.', '…농이었노라.']
			),
			D('chusuiliang', ['It is noted, Majesty. As a joke.'], ['적어 두었사옵니다, 폐하. 농으로.']),
			D(
				'chusuiliang',
				['The last dynasty went to that country four times. I have the dates.'],
				['앞선 왕조가 그 나라에 네 번 갔사옵니다. 날짜도 있습니다.']
			),
			D(
				'taizong',
				['The last dynasty was led by a fool.', '…Who beat them at the river?'],
				['앞선 왕조는 어리석은 자가 이끌었노라.', '…강에서 그들을 꺾은 자가 누구였던가?']
			),
			D(
				'chusuiliang',
				['A minister named Ulchi, Majesty. The man in this report had a father in the line that day.', 'It was a fine day, I am told. For them.'],
				['을지라는 신하였사옵니다, 폐하. 이 보고서의 사내는 그날 그 줄에 아비가 서 있었습니다.', '날이 좋았다 하옵니다. 그쪽에게는.']
			),
			D(
				'taizong',
				['Then the son has a reason to hate us.', 'And we have a reason to hurry.'],
				['그렇다면 그 아들은 짐을 미워할 까닭이 있도다.', '그리고 짐은 서두를 까닭이 있도다.']
			),
			P(
				'The grape bowl is empty. He did not notice eating them. The diarist did, and writes nothing down, which at this court is a kind of courage.',
				'포도 그릇이 비었다. 그는 먹은 줄도 몰랐다. 사관은 알았고, 아무것도 적지 않는다. 이 조정에서 그건 일종의 용기다.'
			),
			P(
				'Half the world is asleep when he goes to bed. The name is still on his tongue. He hasn’t decided to eat it yet.',
				'그가 잠자리에 들 때 천하의 절반은 이미 자고 있다. 그 이름은 아직 혀 위에 있다. 삼킬지는 아직 정하지 않았다.'
			),
			BOLD(
				`${MARK30} What he doesn’t have yet is a war worth leading himself. For that he’ll need four dragons…!`,
				'구실은 생겼다. 아직 없는 건 몸소 이끌 만한 전쟁이다. 그러려면 용 네 마리가 필요하다…!'
			)
		];
		return reanchor(e, {
			byAt: {
				'가이쑤웬...? Gai Suwen…?': 'The name is still on his tongue',
				'The seventh invasion of Goguryeo has not begun': MARK30
			},
			fallback: 'Far to the west, a'
		});
	}
);

// ───────────────────────────── Polish ─────────────────────────────
run(
	24,
	(e) => !e.blocks.some((b) => b.html?.includes('They own half the capital and pray')),
	(e) => {
		const b = e.blocks.find((x) => x.html?.includes('They own half the capital and pray'));
		b.html = b.html.replace('They own half the capital and pray', 'They are rich, and they pray');
		b.ko = b.ko.replace('도읍의 절반을 가졌고, 누가 이기든', '부자이고, 누가 이기든');
		return ['temple line no longer repeats “half the capital”'];
	}
);
run(
	28,
	(e) => !(e.images ?? []).some((im) => im.id === 'scene-yushin-sword-12' && im.at !== 'I-i-it’s Kim Yushin!!'),
	(e) => {
		e.images.find((im) => im.id === 'scene-yushin-sword-12').at = 'I-i-it’s Kim Yushin!!';
		return ['scene-yushin-sword-12 → I-i-it’s Kim Yushin!!'];
	}
);

// ───────────────────────────── Grow the stubs (#28–#30) ─────────────────────────────
function insertAfter(e, frag, blocks) {
	const i = e.blocks.findIndex((b) => textOf(b).includes(frag));
	if (i < 0) throw new Error(`${e.title}: no "${frag}"`);
	e.blocks.splice(i + 1, 0, ...blocks);
}

run(
	28,
	(e) => e.blocks.some((b) => b.en?.includes('Tell the court I’m busy.')),
	(e) => {
		insertAfter(e, 'One of theirs. The one they think is safest.', [
			D('sunduk', ['And the forty?'], ['그럼 그 마흔은?']),
			D(
				'yushin',
				['Baekje has forty forts to hold now, Majesty. Forty granaries. Forty winters.', 'Let them feed it.'],
				['백제는 이제 성 마흔을 지켜야 합니다, 폐하. 곳간 마흔. 겨울 마흔.', '먹여 살리라 하십시오.']
			),
			D('sunduk', ['You want me to tell the court we’re letting them keep it?'], ['조정에 우리가 그걸 내버려 둔다고 말하란 말인가?']),
			D('yushin', ['Tell the court I’m busy.'], ['제가 바쁘다고 하십시오.']),
			D('sunduk', ['…That, they’ll believe.'], ['…그건 믿겠군.'])
		]);
		insertAfter(e, 'and then there isn’t.', [
			P(
				'An hour earlier, at the foot of the bluff, an officer had looked up at the rock and then at his general.',
				'한 시진 전, 벼랑 밑에서 장교 하나가 바위를 올려다보다가 제 장군을 보았다.'
			),
			C('🗣', ['Sir. Nobody climbs that side.'], ['장군. 저쪽은 아무도 못 오릅니다.']),
			D('yushin', ['Then nobody is watching it.'], ['그러니 아무도 안 지키겠지.']),
			P(
				'They go up in their socks, swords tied flat to their backs so nothing rings on the stone. Yushin goes third. Not first, which would be vanity. Not last, which would be worse.',
				'그들은 버선발로 오른다. 칼은 등에 납작하게 묶어 바위에 쇳소리가 나지 않게 한다. 유신은 세 번째로 오른다. 맨 앞은 허세다. 맨 뒤는 더 나쁘다.'
			)
		]);
		insertAfter(e, 'Go home. Tell them who sent you.', [
			C('🗣', ['Who— who do I say it was?'], ['누— 누구라고 말씀드립니까?']),
			D('yushin', ['They’ll know.'], ['알 걸세.'])
		]);
		insertAfter(e, 'He sent you home? With your sword on?', [
			C('🗣', ['He let an officer walk out armed, Majesty. Silla’s gone soft.'], ['무장한 장교를 그냥 보냈답니다, 폐하. 신라가 물러졌습니다.']),
			D(
				'euija',
				['Soft? He sent me a messenger with a sword on.', 'That’s a man saying, next time bring more.'],
				['물러져? 칼 찬 전령을 보냈잖느냐.', '다음엔 더 데려오라는 소리다.']
			)
		]);
		return ['#28 grown: forty-winters exchange, the bluff, the messenger'];
	}
);

run(
	29,
	(e) => e.blocks.some((b) => b.html?.includes('They were both supposed to be at lessons.')),
	(e) => {
		insertAfter(e, 'Neither of them mentions either.', [
			P(
				'Chunchu was nine that first night, and Yushin seventeen and already too serious for stars. They were both supposed to be at lessons.',
				'그 첫날 밤 춘추는 아홉 살이었다. 유신은 열일곱, 별을 보기엔 이미 너무 진지했다. 둘 다 글방에 있어야 할 시간이었다.'
			),
			D('yushin', ['You were supposed to be at lessons.'], ['자넨 그때 글방에 있어야 했지.']),
			D('chunchu', ['So were you, brother. You were supposed to be teaching them.'], ['형님도요. 형님은 가르치고 있어야 했고요.'])
		]);
		insertAfter(e, 'which a king does not do.', [
			P(
				'Then he goes to the window with his own cup. The eastern star is very bright over the river tonight. He raises his cup to it, a little drunk, the way you toast a rival you have not met yet.',
				'그러고는 제 잔을 들고 창가로 간다. 오늘 밤 강 위의 동쪽 별이 유난히 밝다. 그는 조금 취한 채 그 별에 잔을 든다. 아직 만나 보지 못한 맞수에게 건배하듯.'
			),
			D('euija', ['To whoever else is looking at you tonight.', 'May he trip on the stairs.'], ['오늘 밤 너를 올려다보는 다른 놈들에게.', '계단에서 자빠지기를.'])
		]);
		insertAfter(e, 'He asks for witnesses.', [
			P(
				'Dosuryu waits outside the cave mouth with the horses. He has never liked caves. He likes even less what men promise inside them.',
				'도수류는 동굴 어귀 밖에서 말을 잡고 기다린다. 동굴은 예전부터 싫었다. 사내들이 그 안에서 하는 약속은 더 싫다.'
			)
		]);
		insertAfter(e, 'Until every bone in me is broken.', [
			D('dosuryu', ['Done talking to your ancestors?'], ['조상님들하고 얘기 끝났냐?']),
			D('gesomun', ['They don’t talk back.', 'That’s why I like them.'], ['대꾸를 안 하시잖소.', '그래서 좋은 거요.']),
			D('dosuryu', ['I talk back.'], ['나는 대꾸한다.']),
			D('gesomun', ['I know, old man. That’s why I keep you.'], ['아오, 형님. 그래서 곁에 두는 거요.'])
		]);
		return ['#29 grown: the boys at lessons, Euija’s toast, Dosuryu at the cave'];
	}
);

run(
	30,
	(e) => e.blocks.some((b) => b.kind === 'card' && b.person === 'chusuiliang'),
	(e) => {
		insertAfter(e, 'The Second Emperor of Tang.', [
			P(
				'He has never lost a battle he led himself. He mentions this rarely, and only to people who already know.',
				'그는 몸소 이끈 싸움에서 져 본 적이 없다. 그 얘기는 좀처럼 하지 않는다. 이미 아는 사람에게만 한다.'
			)
		]);
		insertAfter(e, 'The Night Audience', [
			CARD(
				'chusuiliang',
				'The court diarist. He writes down everything the emperor says, which makes him the bravest man in the room.',
				'궁중의 사관. 황제가 하는 말을 빠짐없이 적는다. 그래서 이 방에서 제일 용감한 사람이다.'
			)
		]);
		insertAfter(e, 'And we have a reason to hurry.', [
			P(
				'Before bed he does something he has not done in years. He asks for the old map of the north-east, the one the last dynasty drew, with the river crossings marked in dead men’s hands.',
				'잠들기 전, 그는 몇 해 동안 안 하던 일을 한다. 동북의 옛 지도를 가져오라 한다. 앞선 왕조가 그린 것, 강 나루마다 죽은 자들의 손으로 표시가 된 지도다.'
			),
			D('taizong', ['Where is the river?'], ['강은 어디인가?']),
			D(
				'chusuiliang',
				['There, Majesty. Where the ink is thickest.', 'The clerks kept redrawing the line. Men kept dying on it.'],
				['저기이옵니다, 폐하. 먹이 제일 짙은 곳.', '서기들이 그 선을 자꾸 고쳐 그렸사옵니다. 사람들이 자꾸 그 위에서 죽었으니까요.']
			),
			P(
				'He puts his finger on the thick ink and leaves it there a while, the way you test whether a stove is still warm.',
				'그는 짙은 먹 위에 손가락을 얹고 한참 둔다. 화로가 아직 따뜻한지 대 보듯이.'
			)
		]);
		return ['#30 grown: the undefeated aside, the diarist card, the Sui map'];
	}
);

run(
	28,
	(e) => e.blocks.some((b) => b.en?.includes('He picked this field.')),
	(e) => {
		insertAfter(e, 'If I stopped, they would invent a reason for my stopping.', [
			D('chunchu', ['Then don’t stop.', 'I’ll invent the reasons for you. I’m better at it.'], ['그럼 멈추지 말게.', '이유는 내가 지어 주지. 그건 내가 더 잘하네.'])
		]);
		insertAfter(e, 'I have not met him.', [
			D('euija', ['Then go and meet him.'], ['그럼 가서 만나 봐라.']),
			D('gyebek', ['Not yet, Majesty.', 'He picked this field.'], ['아직은 아닙니다, 폐하.', '이 싸움터는 저쪽이 골랐습니다.'])
		]);
		return ['#28 grown: Chunchu’s offer, Gyebek’s field'];
	}
);

run(
	29,
	(e) => e.blocks.some((b) => b.html?.includes('He has decided they should be.')),
	(e) => {
		insertAfter(e, 'He likes even less what men promise inside them.', [
			P(
				'Gesomun climbs with the five blades still on his back. They are heavy. He has decided they should be.',
				'개소문은 다섯 자루 칼을 등에 멘 채 오른다. 무겁다. 무거워야 한다고 그는 정했다.'
			)
		]);
		insertAfter(e, 'Then I will stand beside you.', [
			D('chunchu', ['You don’t even like the chair.'], ['형님은 그 자리 좋아하지도 않잖습니까.']),
			D('yushin', ['I don’t have to like it. I have to stand next to it.'], ['좋아할 필요는 없네. 곁에 서 있기만 하면 되지.'])
		]);
		return ['#29 grown: the five blades uphill, the chair'];
	}
);

run(
	30,
	(e) => e.blocks.some((b) => b.en?.includes('Then Silla wants something.')),
	(e) => {
		insertAfter(e, 'Three summers ago it was a kingdom.', [
			C('🗣', ['From Yingzhou, Majesty. Urgent.'], ['영주에서 왔사옵니다, 폐하. 급보이옵니다.']),
			D('taizong', ['Everything from Yingzhou is urgent. Give it here.'], ['영주에서 오는 건 다 급보로다. 이리 다오.'])
		]);
		insertAfter(e, 'It is noted, Majesty. As a joke.', [
			D('taizong', ['Who else lives on that peninsula?'], ['그 반도에는 또 누가 사는가?']),
			D(
				'chusuiliang',
				['Two more kingdoms, Majesty. All three send tribute. All three complain about each other.', 'Silla sends the most letters.'],
				['두 나라가 더 있사옵니다, 폐하. 셋 다 조공을 바치고, 셋 다 서로를 헐뜯사옵니다.', '편지는 신라가 제일 많이 보냅니다.']
			),
			D('taizong', ['Then Silla wants something.'], ['그렇다면 신라가 무언가를 원하는 게로구나.']),
			D('chusuiliang', ['Silla always wants something, Majesty. This year it is soldiers.'], ['신라는 늘 무언가를 원하옵니다, 폐하. 올해는 군사이옵니다.'])
		]);
		insertAfter(e, 'the way you test whether a stove is still warm.', [
			P(
				'Down the hall a lamp still burns where his generals sleep when they are in the capital. He does not send for them. Not yet. A man who owns half the world can afford to sleep on a decision.',
				'복도 끝, 장수들이 도읍에 머물 때 자는 방에 아직 등불이 켜져 있다. 그는 그들을 부르지 않는다. 아직은. 천하의 절반을 가진 사내는 결정을 하룻밤 묵힐 여유가 있다.'
			)
		]);
		return ['#30 grown: the courier, the peninsula, the generals’ lamp'];
	}
);

run(
	29,
	(e) => {
		const seen = new Set();
		const dupes = e.blocks.some((b) => {
			const k = JSON.stringify(b);
			return seen.has(k) || !seen.add(k);
		});
		const iClimb = e.blocks.findIndex((b) => b.html?.includes('He has decided they should be.'));
		const iKneel = e.blocks.findIndex((b) => b.html?.includes('He kneels at the mouth'));
		return !dupes && iClimb < iKneel;
	},
	(e) => {
		const seen = new Set();
		e.blocks = e.blocks.filter((b) => {
			const k = JSON.stringify(b);
			return !seen.has(k) && seen.add(k);
		});
		const take = (frag) => e.blocks.splice(e.blocks.findIndex((b) => textOf(b).includes(frag)), 1)[0];
		const climb = take('He has decided they should be.');
		insertAfter(e, 'The banquet hall has been scrubbed', [climb]);
		const chair = [take('You don’t even like the chair.'), take('I don’t have to like it.')];
		insertAfter(e, 'He says it in exactly the same voice.', chair);
		return ['#29 deduped and reordered'];
	}
);

run(
	25,
	(e) => !e.blocks.some((b) => b.en?.[0]?.startsWith('Boy — even a man ready to die')),
	(e) => {
		const i = e.blocks.findIndex((b) => b.kind === 'map' && b.caption?.startsWith('One envoy coming south'));
		const j = e.blocks.findIndex((b) => b.html?.includes('One envoy left Pyongyang bleeding.'));
		const gone = e.blocks.splice(i + 1, j - i - 1);
		return [`#25 removed ${gone.length} stale release lines after the map`];
	}
);
