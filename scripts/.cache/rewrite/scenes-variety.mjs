/**
 * Scenes pass (variety): Eight Great Clans, Stallion Mountain, Suro, Jeon, Gyeol, Royal Secretariat.
 * Reshapes question → lecture exchanges, opens battles in medias res, adds transitions.
 * Run: `node scripts/.cache/rewrite/scenes-variety.mjs` (`DRY=1` to test). Each patch checks a marker and skips if done.
 */
import { editStory, find } from '../story-ops.mjs';

const P = (html, ko) => ({ kind: 'p', html, ko });
const SCENE = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, en, lines, extra = {}) => ({ kind: 'dialogue', person, en, lines, ...extra });
const X = (speaker, en, lines) => ({ kind: 'dialogue', speaker, en, lines });

const CHIP = {
	eldersatek: '#d9b13a',
	elderyunbi: '#c4a35a',
	taizong: '#c97a2e',
	yushin: '#4a8fe0',
	bidam: '#7b5cd6',
	chunchu: '#D8258C',
	jukji: '#6a9e7a',
	munhee: '#e07fa8',
	alchun: '#c9a24a'
};
const C = (person, en, lines, extra = {}) => D(person, en, lines, CHIP[person] ? { chip: CHIP[person], ...extra } : extra);

function one(entry, frag) {
	const hits = find(entry, frag);
	if (hits.length !== 1) throw new Error(`${entry.title}: "${frag}" matched ${hits.length} blocks`);
	return hits[0];
}
const insertAfter = (entry, frag, blocks) => {
	const { list, i } = one(entry, frag);
	list.splice(i + 1, 0, ...blocks);
};
const insertBefore = (entry, frag, blocks) => {
	const { list, i } = one(entry, frag);
	list.splice(i, 0, ...blocks);
};
/** Replace the run of blocks from `first` through `last` (same list) with `blocks`. */
const replaceRange = (entry, first, last, blocks) => {
	const a = one(entry, first);
	const b = last ? one(entry, last) : a;
	if (a.list !== b.list || b.i < a.i) throw new Error(`${entry.title}: bad range ${first} … ${last}`);
	a.list.splice(a.i, b.i - a.i + 1, ...blocks);
};
/** Reuse an existing block untouched (found by text). */
const keep = (entry, frag) => structuredClone(one(entry, frag).b);

const PATCHES = [
	// ── #5 Eight Great Clans ────────────────────────────────────────────────
	{
		entry: 'Eight Great Clans',
		done: 'the way you bring a new dog to dinner',
		run: (e) =>
			insertBefore(e, 'In the Assembly they fight for power', [
				P(
					'The chalk is still on Gyebek’s sleeve when the lords climb to the rock that afternoon. Nobody invited him. Euija brings him anyway, the way you bring a new dog to dinner to see who flinches.',
					'그날 오후 귀족들이 바위로 오를 때도 계백의 소매엔 아직 분필 가루가 묻어 있다. 아무도 그를 부르지 않았다. 의자가 그냥 데려온다. 새로 들인 개를 잔칫상에 데려가 누가 움찔하나 보는 식으로.'
				),
				X(
					'Servants on the stair',
					['Is that him? The eel boy?', 'In the prince’s shadow. Look, he’s still got sand in his ears.', 'Satek’ll want him by the new moon.', 'Yunbi’ll want him by tonight.'],
					['저거여? 그 뱀장어 놈?', '태자 그림자 속에. 봐, 귀에 아직 모래 들었구먼.', '사택은 초승달 전에 저놈을 갖고 싶어 할 겨.', '연비는 오늘 밤 안에 갖고 싶어 할 거구.']
				)
			])
	},
	{
		entry: 'Eight Great Clans',
		done: 'I’ll take the cart out of your berth fee.',
		run: (e) =>
			replaceRange(e, 'Blood cools. A winter anchorage does not.', 'We don’t hold the sleeve. We hold the arm.', [
				C('eldersatek', ['The west bridge. Your boys, my cart.', 'I’ll take the cart out of your berth fee.'], ['서쪽 다리 말이오. 그쪽 애들이 우리 수레를 엎었소.', '수레 값은 그쪽 선석세에서 까겠소.']),
				C('elderyunbi', ['Take it out of your wall.', 'Our boys are going over it tonight anyway.'], ['까려거든 그쪽 담장에서 까시오.', '오늘 밤 우리 애들이 어차피 넘을 담이니.']),
				C('eldersatek', ['Yunbi talks of blood.', 'We talk of berths.', 'Blood cools. A winter anchorage does not.'], ['연비는 피를 말하지.', '우리는 선석을 말하오.', '피는 식소. 겨울 정박지는 안 식고.']),
				C('elderyunbi', ['Says the man who holds the king’s sleeve and calls it a harbour—'], ['임금 소매 붙들고 그걸 항구라 부르는 양반이 할 소리는—']),
				C('eldersatek', ['Three berths.'], ['선석 셋.']),
				C('elderyunbi', ['—Four.'], ['—넷.']),
				C('eldersatek', ['Three, and I forget the cart.'], ['셋. 그럼 수레는 잊어 드리지.']),
				C('elderyunbi', ['…We don’t hold the sleeve. We hold the arm.', 'Three.'], ['……우린 소매를 안 잡소. 팔을 잡지.', '셋.']),
				P('Nobody on the rock writes it down. Everybody in Sabi knows it by supper.', '바위 위 누구도 그걸 적지 않는다. 사비 사람이면 저녁 전에 다 안다.')
			])
	},
	{
		entry: 'Eight Great Clans',
		done: 'like a man who has picked up a snake by the wrong end',
		run: (e) => {
			const wants = keep(e, 'A king who hears a bad number');
			const stick = keep(e, 'And you? The stick.');
			const same = keep(e, 'Same as him.');
			const remember = keep(e, 'Remember that answer.');
			const bid = keep(e, 'They want to buy you, you know.');
			replaceRange(e, 'Four hands. You could have written five', 'They will.', [
				P(
					'Euija unhooks a purse from his own belt and lobs it underhand. Seongchung catches it out of pure fright.',
					'의자가 제 허리춤에서 돈주머니를 끌러 아래로 툭 던진다. 성충은 순전히 놀라서 받는다.'
				),
				D('euija', ['You. The tide.', 'That’s what writing five would have paid. Satek rates.', 'Keep it. Just tell me why you wrote four.'], ['너. 물때.', '그게 다섯 적었으면 받았을 값이여. 사택 시세로.', '가져. 대신 왜 넷이라 적었는지 말혀 봐.']),
				D(
					'seongchung',
					['Highness, I— if I keep it, that’s the same as if I’d written—', 'Because in the eleventh month a hull sits down on that bar, and somebody asks who wrote five, and—'],
					['저하, 그— 이걸 받으면, 그건 제가 다섯이라고 적은 거나 매한가지라—', '동짓달에 배 한 척이 그 모래톱에 주저앉으면, 누가 다섯이라 적었느냐 묻는 사람이 꼭 있고, 그러면—']
				),
				D('euija', ['And it’s you.'], ['너구먼.']),
				D('seongchung', ['It is always the clerk.'], ['늘 서기입니다.']),
				P(
					'He holds the purse out. Euija doesn’t take it. Seongchung holds it at arm’s length for the rest of the evening, like a man who has picked up a snake by the wrong end.',
					'성충이 주머니를 내민다. 의자는 받지 않는다. 성충은 그날 저녁 내내 그걸 팔을 쭉 뻗어 들고 있다. 뱀을 거꾸로 집어 든 사람처럼.'
				),
				D('euija', ['Ha! Not the purse, then. So what does a clerk want?'], ['하! 돈도 싫다믄, 서기는 뭘 원햐?']),
				wants,
				stick,
				same,
				remember,
				bid,
				D('seongchung', ['Nobody has actually offered for me, Highness. …Except you. Just now.'], ['아직 아무도 값을 안 불렀습니다만, 저하. ……방금 저하 빼고는요.']),
				D('heungsu', ['They will.'], ['부를 겁니다.']),
				P(
					'Gyebek says nothing. His hand goes flat against his shirt, over the strip of wood with his name on it, and stays there.',
					'계백은 아무 말도 하지 않는다. 손바닥이 저고리 앞섶 위로, 제 이름이 적힌 나뭇조각 자리에 납작하게 얹히고, 그대로 있다.'
				)
			]);
		}
	},

	// ── #35 Stallion Mountain ───────────────────────────────────────────────
	{
		entry: 'Stallion Mountain',
		done: 'Shoot the white one!',
		run: (e) => {
			insertAfter(e, 'Sul Gedu ties off his helmet cord', [
				SCENE('The Field Below the Mountain', '산 아래 벌판'),
				P(
					'Noon. The plain under the mountain is one long noise: drums above, horns, a hundred and fifty thousand men leaning on a line that will not give. Dust stands up off the field like a second army. Somewhere inside it the Goguryeo centre is winning, knows it, and is shouting about it.',
					'한낮. 산 아래 벌판은 하나의 긴 소음이다. 위에선 북과 뿔나팔, 아래에선 꿈쩍 않는 대열을 미는 십오만. 먼지가 두 번째 군대처럼 벌판에서 일어선다. 그 속 어딘가에서 고구려 중군이 이기고 있고, 그걸 알고, 그걸 소리치고 있다.'
				),
				X(
					'Goguryeo ranks',
					['Push! PUSH, they’re giving—', 'Where’s the Turks gone? Where’s the bloody Turks—', 'Never mind the Turks, mind your feet!', 'Who’s yon in white?'],
					['밀라우! 밀어, 데놈들 밀린다—', '돌궐 놈들 어드메 갔네? 그 돌궐 놈들—', '돌궐은 일없다, 발밑이나 보라우!', '데 흰 거는 뭐이가?']
				)
			]);
			const charge = one(e, 'a low officer decides the field needs a mark').b;
			charge.html =
				'The one in white is a low officer of the Tang line who decided an hour ago that this field needed a mark it could not look away from. He put on <b>white armour</b> — not for mourning, for visibility — hung two bows at his waist, and took up his grandfather’s old <b>ji</b>, the one his wife bought back with eggs. Now he rides into the front so hard the relief army has to notice him or die without knowing why.';
			charge.ko =
				'흰 것은 당진의 낮은 장교 하나다. 한 시진 전에, 이 벌판엔 눈을 뗄 수 없는 표식이 필요하다고 판단한 사람. 그는 <b>흰 갑옷</b>을 입었다 — 상중이라서가 아니라, 보이려고 — 허리에 활 둘을 차고, 아내가 달걀로 되사 온 할아버지의 낡은 <b>극</b>을 들었다. 그리고 지금, 구원군이 그를 알아채거나 모른 채 죽게 되도록 선두로 파고든다.';
			insertAfter(e, 'If you will not — the ji will.', [
				X(
					'Goguryeo ranks',
					['Shoot him! Shoot the white one!', 'I did! Twice!', 'Then shoot him a third—', 'Drums. Listen— the drums have changed—', 'BEHIND! They’re behind us!'],
					['쏘라우! 흰 놈을 쏘라우!', '쐈수다! 두 번!', '기럼 세 번째로—', '북. 들어 보라우— 북소리가 바뀌었어—', '뒤다! 뒤에 있다!']
				)
			]);
		}
	},
	{
		entry: 'Stallion Mountain',
		done: 'ask the groom yourself',
		run: (e) =>
			insertAfter(e, 'Things Goryeo will never give you.', [
				D('namgun', ['…Is it true all your horses have names? All six?'], ['……폐하 말들이 다 이름이 있다는 거, 참말입니까? 여섯 마리 다요?']),
				C('taizong', ['Kneel, and you may ask the groom yourself.'], ['꿇거라. 그러면 마부에게 직접 물어보게 해 주마.'], {
					zh: ['跪下，便許你親問馬夫。'],
					zhLatn: ['Guìxià, biàn xǔ nǐ qīn wèn mǎfū.']
				}),
				P(
					'Namgun’s knee starts to bend. His brother’s hand closes on the back of his collar and holds him straight.',
					'남건의 무릎이 굽기 시작한다. 형의 손이 뒷덜미 옷깃을 움켜쥐고 그를 똑바로 세운다.'
				)
			])
	},

	// ── #45 Jeon (轉) ───────────────────────────────────────────────────────
	{
		entry: 'Jeon (轉)',
		done: 'Same thing, if you’re Bidam.',
		run: (e) => {
			insertAfter(e, 'The rebel shout shakes the ground.', [
				X(
					'Palace guards',
					['Did you see where it came down?', 'Inside. Inside the wall, I’m telling you.', 'It never. West wall. Outside.', 'Same thing, if you’re Bidam.'],
					['봤나? 어데 떨어졌노?', '안에. 성 안에 떨어졌다 캤다 아이가.', '아이다. 서쪽 담 바깥이다.', '비담한테는 그기 그기다.']
				)
			]);
			insertAfter(e, 'If they can read a star, they can also unread one.', [
				C('yushin', ['Who here can build a kite?'], ['이 궁에 연 만들 줄 아는 자 있나.']),
				X('A Hwarang', ['A kite, Marshal? …Now?'], ['연이요, 장군? ……지금요?']),
				C('yushin', ['A big one.'], ['큰 걸로.']),
				X('A Hwarang', ['How big?'], ['얼마나 큰 거요?']),
				C('yushin', ['Big enough to carry a scarecrow. Soaked in oil.'], ['허수아비 하나 태울 만큼. 기름 먹여서.']),
				X('A Hwarang', ['…Is it for Her Majesty?'], ['……폐하께 올릴 겁니꺼?']),
				C('yushin', ['For heaven.'], ['하늘에.'])
			]);
			insertAfter(e, 'or we changed heaven’s handwriting', [
				X(
					'On the Radiance wall',
					['It’s going back up.', 'Stars don’t go back up.', 'That one is.', '…Councillor? Councillor, the star’s going back up.'],
					['도로 올라간다.', '별이 도로 올라가는 법이 어딨노.', '저거는 올라가는데.', '……상대등? 상대등, 별이 도로 올라갑니더.']
				),
				C('bidam', ['Then someone over there has read the same books I have.', '…Bring another cup.'], ['그럼 저쪽에도 나와 같은 책을 읽은 자가 있다는 게지.', '……잔 하나 더 내오게.'])
			]);
		}
	},

	// ── #47 Gyeol (結) ──────────────────────────────────────────────────────
	{
		entry: 'Gyeol (結)',
		done: 'two rivers trying to go through one gate',
		run: (e) =>
			replaceRange(e, 'Yushin is back at the palace gate by mid-morning', null, [
				P(
					'Yushin is back at the palace gate by mid-morning. Chunchu is out of his chair before the guards have finished saluting.',
					'유신은 오전 중에 궁문으로 돌아온다. 위병들이 경례를 다 마치기도 전에 춘추가 의자에서 일어나 있다.'
				),
				C('chunchu', ['Your hair’s wet.'], ['머리가 젖었네.']),
				C('yushin', ['Bring the drums up.'], ['북 올려라.']),
				C('chunchu', ['Where’ve you been?'], ['어데 갔다 왔노.']),
				C('yushin', ['With my father.'], ['아버지한테.']),
				C('chunchu', ['…How is he?'], ['……좀 어떠시노?']),
				C('yushin', ['Bring the drums up.'], ['북 올려라.']),
				P(
					'Chunchu looks at him one breath longer than a friend should. Then he sends for the drums.',
					'춘추는 친구로서 봐도 될 만큼보다 한 숨 더 오래 그를 본다. 그러고는 북을 가져오라 이른다.'
				),
				P(
					'By midday the ninth day has turned into the battle both sides spent eight days pretending they could avoid. The palace blue goes up the road to the outer works under the Radiance wall, and the black comes down off the rampart to throw it back. From the Moon Palace it looks like two rivers trying to go through one gate.',
					'한낮이 되자 아홉째 날은, 양쪽이 여드레 동안 피할 수 있는 척했던 싸움이 된다. 궁의 푸른 띠가 길을 따라 명활성 아래 외성까지 밀고 올라가고, 검은 띠가 성벽에서 쏟아져 내려와 그것을 밀어낸다. 월성에서 보면 강 두 줄기가 문 하나를 한꺼번에 지나려는 것 같다.'
				),
				X(
					'In the outer ditch',
					['Ladders! Ladders left—', 'Whose left?!', 'GAYA! GAYA DOG!', 'Don’t stop on them, don’t stop on the bodies, keep—', 'Blue’s over the second ditch! BLUE’S OVER—'],
					['사다리! 사다리 왼쪽—', '누구 왼쪽이고?!', '가야! 가야 개새끼!', '밟고 서지 마라, 시체 위에 서지 마라, 계속—', '파랑이 둘째 도랑 넘었다! 넘었다—']
				)
			])
	},
	{
		entry: 'Gyeol (結)',
		done: 'Supper. There’s a word.',
		run: (e) =>
			replaceRange(e, 'Alchun is asked, for the last useful time', null, [
				P(
					'By dusk the granary inside the Moon Palace is down to its last sacks, and men who have never prayed are learning the postures. Chunchu finds Alchun on the inner stair, where he has spent nine days standing exactly halfway between two walls.',
					'해 질 무렵 월성 안 곳간은 마지막 섬만 남고, 기도해 본 적 없는 사내들이 무릎 꿇는 자세를 배운다. 춘추는 안쪽 계단에서 알천을 찾는다. 아흐레 동안 두 성벽 사이 딱 한가운데에 서 있던 자리다.'
				),
				C('chunchu', ['Alchun. The granary’s on its last sacks.', 'I need to know which wall you’re on before supper.'], ['알천. 곳간이 마지막 섬이오.', '저녁 전에 어느 성벽인지 들어야겠소.']),
				C('alchun', ['Supper. There’s a word.'], ['저녁이라. 좋은 말이네.']),
				P('Nobody laughs. On the yard it would have got one. The stair is not the yard.', '아무도 웃지 않는다. 연무장이었으면 웃음이 터졌을 말이다. 계단은 연무장이 아니다.'),
				C('chunchu', ['Alchun.'], ['알천.'])
			])
	},

	// ── #51 Royal Secretariat ───────────────────────────────────────────────
	{
		entry: 'Royal Secretariat',
		done: 'You drew an arrow.',
		run: (e) =>
			replaceRange(e, 'This is how the emperor sees the world.', null, [
				C('chunchu', ['Now. The emperor sits facing south, and the whole world—'], ['자, 황제는 남쪽을 보고 앉네. 그리고 온 세상이—']),
				C(
					'jukji',
					['—faces in. Every king on earth, facing the dais. It’s on your wall, my lord. Third sheet. You drew an arrow.'],
					['—안쪽을 보고 앉지요. 땅 위의 왕이 다 단을 향해서. 벽에 있습니다, 나리. 세 번째 장. 화살표도 그리셨고요.']
				),
				C('chunchu', ['…I was going to say it more beautifully.'], ['……더 아름답게 말하려던 참이었네.']),
				C('jukji', ['I’m sure.'], ['그러셨겠지요.'])
			])
	},
	{
		entry: 'Royal Secretariat',
		done: 'Write down speed.',
		run: (e) =>
			replaceRange(e, 'I watched that power, and I want it for this country.', null, [
				C('chunchu', ['That’s Chang’an.'], ['그게 장안일세.']),
				C('jukji', ['…Is it for speed, my lord? Or because you liked sitting at his desk?'], ['……속도 때문입니까, 나리? 아니면 그 책상에 앉아 보신 게 좋으셨던 겁니까?']),
				C('chunchu', ['Both. Write down speed.'], ['둘 다. 속도라고 적게.']),
				P('Jukji writes down speed.', '죽지는 ‘속도’라고 적는다.')
			])
	},
	{
		entry: 'Royal Secretariat',
		done: 'He’s never once found the pillow.',
		run: (e) =>
			replaceRange(e, 'In the market a storyteller invents a joke that sticks', 'They did not laugh. That was how I knew it had worked.', [
				SCENE('The East Market', '동시'),
				P('In the East Market a storyteller has a new joke, and it is doing well.', '동시 장터에서 이야기꾼이 새 농담을 하나 얻었는데, 반응이 좋다.'),
				X(
					'A storyteller',
					['So the prince comes home from Chang’an in the emperor’s own robe, see—', 'Our prince is in love with the emperor. Sleeps with the Tang code under his pillow!'],
					['그래 왕자가 장안서 황제 옷을 입고 돌아왔다 카이—', '우리 왕자는 황제랑 연애 중이라 카더라! 당 율령을 베개 밑에 깔고 잔다 카이!']
				),
				X('The crowd', ['Enamoured with China!', 'Moon-sick for it!'], ['중국에 반했다!', '상사병이다, 상사병!']),
				P(
					'At the next stall a woman in a good cloak is buying dried persimmons. She takes a long time choosing.',
					'옆 좌판에서 좋은 두루마기를 입은 여인이 곶감을 고른다. 한참을 고른다.'
				),
				C('munhee', ['The code’s on the floor, actually. He’s never once found the pillow.'], ['율령은 바닥에 깔려 있어요. 베개는 아직 한 번도 못 찾았고요.']),
				X('A storyteller', ['…And who might you be, missus?'], ['……아지매는 뉘신데요?']),
				C('munhee', ['His wife. Go on. You were at the robe.'], ['그 사람 아내요. 계속해요. 옷 얘기 하던 참이었잖아요.']),
				P('He does not go on. The crowd laughs at him, which was not the joke.', '그는 계속하지 않는다. 사람들이 그를 보고 웃는다. 그건 농담에 없던 대목이다.'),
				C('munhee', ['He is in love with a door that opens when he knocks.', 'Put that in. It’s funnier.'], ['그 사람은 두드리면 열리는 문을 좋아하는 거예요.', '그거 넣어요. 더 웃기니까.']),
				X('A storyteller', ['…It isn’t, though.'], ['……안 웃긴데요.']),
				P('Munhee pays for the persimmons and goes home to pack a different set of bags.', '문희는 곶감 값을 치르고, 다른 짐을 싸러 집으로 간다.'),
				P('Back in the palace, two uncles corner Jukji in a corridor, the way uncles do.', '궁으로 돌아오면, 삼촌 둘이 복도에서 죽지를 붙든다. 삼촌들이 늘 그러듯.'),
				D('murim', ['Jukji. This title of yours. Jungsi. What does it mean?'], ['죽지. 그대 직함 말이오. 중시. 무슨 뜻이오?']),
				C('jukji', ['The one in the middle, my lord. I stand beside the work.'], ['가운데 선 사람입니다, 나리. 일 옆에 섭니다.']),
				D('suljong', ['The middle of what?', 'Us and the king?'], ['가운데? 무엇과 무엇 사이 말이오?', '우리와 임금 사이란 말이오?']),
				C('jukji', ['…Yes.'], ['……예.']),
				P(
					'Murim waits for the joke. There isn’t one. He goes off down the corridor to tell somebody, and halfway there he works out that there wasn’t meant to be.',
					'무림은 농담이 나오길 기다린다. 없다. 그는 누구에게 말하러 복도를 걸어가다가, 중간쯤에서 애초에 농담이 아니었다는 걸 깨닫는다.'
				)
			])
	}
];

const out = editStory((story) => {
	const byTitle = new Map(story.flatMap((c) => c.entries).map((e) => [e.title, e]));
	const log = [];
	for (const p of PATCHES) {
		const e = byTitle.get(p.entry);
		if (!e) throw new Error(`no entry ${p.entry}`);
		if (find(e, p.done).length) {
			log.push(`skip  ${p.entry} :: ${p.done}`);
			continue;
		}
		p.run(e);
		if (!find(e, p.done).length) throw new Error(`${p.entry}: marker missing after patch: ${p.done}`);
		log.push(`apply ${p.entry} :: ${p.done}`);
	}
	console.log(log.join('\n'));
	return process.env.DRY ? false : true;
});
void out;
