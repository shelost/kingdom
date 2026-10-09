/**
 * Pilots rewrite (#1–#9, The King for All, Part I).
 * Each episode is rebuilt in its own short editStory call and skips itself once its marker is present.
 */
import { editStory, lists, textOf, personIds } from '../story-ops.mjs';

const norm = (s) => s.replace(/[’‘]/g, "'");
function find(entry, fragment, pred = () => true) {
	const hits = [];
	for (const list of lists(entry))
		list.forEach((b, i) => {
			if (pred(b) && norm(textOf(b)).includes(norm(fragment))) hits.push({ list, i, b });
		});
	return hits;
}

const PEOPLE = personIds();
const P = (html, ko) => ({ kind: 'p', html, ko });
const B = (html, ko) => ({ kind: 'p', html: `<b>${html}</b>`, ko: `<b>${ko}</b>` });
const SC = (label, ko) => ({ kind: 'scene', label, ko });
const D = (person, en, ko, extra = {}) => {
	if (!PEOPLE.has(person)) throw new Error(`unknown person ${person}`);
	return { kind: 'dialogue', person, en, lines: ko, ...extra };
};
const S = (speaker, en, ko, gender = 'm') => ({ kind: 'dialogue', chip: '#8a8a94', speaker, gender, en, lines: ko });

function taker(e) {
	return (frag, pred = () => true) => {
		let hits = find(e, frag, pred);
		if (hits.length > 1) hits = hits.filter((h) => h.list === e.blocks);
		if (hits.length !== 1) throw new Error(`#${e.title}: "${frag}" matched ${hits.length}`);
		return hits[0].b;
	};
}
const card = (person) => (b) => b.kind === 'card' && b.person === person;
const kind = (k) => (b) => b.kind === k;

function reanchor(e, map) {
	for (const im of e.images ?? []) if (map[im.id]) im.at = map[im.id];
}

function episode(n, marker, build) {
	editStory((story) => {
		const e = story.flatMap((c) => c.entries)[n - 1];
		if (find(e, marker).length) {
			console.log(`#${n} already done`);
			return false;
		}
		build(e, taker(e));
		if (!find(e, marker).length) throw new Error(`#${n}: marker missing after build`);
		console.log(`#${n} ${e.title}: ${e.blocks.length} blocks`);
	});
}

/* ───────────────────────────── #1 Queen Sunduk ───────────────────────────── */
episode(1, 'Still ridiculous, my lord?', (e, T) => {
	const yushinVow = T('Whether you do it well or badly');
	const munheeLine = T('Totally unfit for a Noble woman');
	const vow = T('the east star', kind('flashback'));
	const sundukSlaves = T('A country that does not count people as people');
	const queenLine = T('becomes the first Queen of Silla');
	const yard = T('The capital’s daughters follow the Sword of Silla');
	const back = T('She sees the width of his back');
	back.html = back.html.replace('and She sees', 'and she sees').replace('pretend it is the lamp', 'pretend it is the sun');
	back.ko = back.ko.replace('등불 탓으로', '햇볕 탓으로');
	const forgot = T('the Queen has forgotten to look away');
	forgot.html = 'The Queen has forgotten to look away.';
	forgot.ko = '여왕은 눈을 돌리는 걸 잊었다.';
	const nobody = T('Nobody in the room hears it.');
	nobody.html =
		'Nobody in the yard hears it. She will not say it again until a night of small rain, years from now. He will still hear it on the day he dies.';
	nobody.ko =
		'마당의 누구도 듣지 못한다. 그녀는 여러 해 뒤, 가랑비 내리는 어느 밤까지 다시는 그 이름을 부르지 않는다. 그는 죽는 날에도 그 소리를 들을 것이다.';
	const pledge = T('Then the young knights kneel');
	pledge.html =
		'Then the young knights kneel and pledge themselves to the throne. In front kneels the yard’s Second Blade, a cool young man who has never once waited his turn. You’ll meet him properly last night.';
	pledge.ko =
		'젊은 화랑들이 무릎 꿇고 왕좌에 충성을 맹세한다. 맨 앞에는 연무장의 제이검이 있다. 한 번도 제 차례를 기다린 적 없는 서늘한 젊은이다. 그와는 어젯밤에 제대로 인사하게 될 것이다.';
	const emperor = T('those Samhan barbarians are at it again');
	emperor.en = ['A woman king… those Samhan barbarians are at it again, aren’t they?', 'Send her flowers. Something that suits her.'];
	emperor.lines = ['여자 임금이라… 동이 오랑캐들이 또 시작이로구나.', '꽃이나 보내 주어라. 그 여인에게 어울리는 것으로.'];

	e.blocks = [
		T('A Queen? Ridiculous.'),
		T('Three kingdoms, one peninsula', kind('map')),
		T('Everyone here knows exactly how high they were born.'),
		T('Coronation Morning', kind('scene')),
		P(
			'Somebody says it in the corridor, not quite quietly enough. Behind the screen, Princess Dukman is being dressed for a crown. She is thirty-seven, and by noon she will be Queen Sunduk. The maid with the sash stops breathing.',
			'누군가 복도에서 그 말을 한다. 충분히 작은 목소리는 아니다. 병풍 뒤에서는 덕만공주가 왕관을 쓰려고 옷을 입는 중이다. 서른일곱. 정오면 선덕여왕이 된다. 띠를 매던 시녀가 숨을 멈춘다.'
		),
		P(
			'The old king is dead, and in Silla only Sacred Bone may wear the crown. The Sacred Bone men have run out. What is left is women: Dukman, her older sister, and a cousin named Seungman who is very glad it isn’t her.',
			'선왕이 승하했다. 신라에서 왕관은 성골만 쓸 수 있다. 그런데 성골 사내가 바닥났다. 남은 건 여자들이다. 덕만, 그 언니, 그리고 그게 제가 아니라서 몹시 다행인 사촌 승만.'
		),
		T('Bone, as in the bone you were born with', kind('term')),
		T('by six men and a brazier'),
		D(
			'sunduk',
			['Ridiculous. Yes.', 'Name me the man, my lord. The Sacred Bone one. I’ll wait.'],
			['웃기지. 그렇지.', '그럼 그 사내 이름을 대 보게. 성골 사내 말일세. 기다리겠네.']
		),
		P('The corridor suddenly remembers it has somewhere else to be.', '복도가 갑자기 다른 볼일이 생각난 모양이다.'),
		D(
			'sunduk',
			['Tie it tight. If I’m going to be ridiculous, I won’t be late as well.'],
			['단단히 매거라. 우스운 건 그렇다 쳐도, 늦기까지 할 순 없지.']
		),
		P(
			'One man stays at the door, where a guard would stand if the guard were the most famous swordsman in Silla. Kim Yushin is thirty-seven. He runs the Hwarang yard: horse, bow, gyuku, the place boys learn whether they matter. People call him the Sword of Silla. He is also, everyone notices, very fond of the princess.',
			'문 옆에 한 사내만 남는다. 호위가 설 자리다. 그 호위가 신라에서 가장 이름난 검객이라는 것만 빼면. 김유신, 서른일곱. 화랑의 연무장을 맡고 있다. 말, 활, 격구. 소년들은 거기서 제가 중요한 사람인지 배운다. 사람들은 그를 신라의 도검이라 부른다. 그리고 다들 눈치챘듯, 공주를 유난히 아낀다.'
		),
		T('', card('yushin')),
		D(
			'sunduk',
			['You heard him.', 'I put on this confident face, but honestly — me, a king…', 'I’ll do it no matter what. I just don’t know if I can.'],
			['자네도 들었지.', '난 이렇게 당당한 척은 하지만, 솔직히… 내가 왕이라니.', '무슨 일이 있어도 할 걸세. 다만 해낼 수 있을지를 모르겠어.']
		),
		yushinVow,
		P('She laughs. Nobody else will hear her do that today. Then the bells start.', '그녀가 웃는다. 오늘 다른 누구도 듣지 못할 웃음이다. 그리고 종이 울리기 시작한다.'),

		T('The Palace Road', kind('scene')),
		P(
			'Across the palace, Yushin’s little sister is late. Munhee is getting her hair done at the gate, because her husband has already saddled the horses.',
			'궁 건너편에서는 유신의 누이가 늦고 있다. 문희는 대문 앞에서 머리를 매만지는 중이다. 남편이 벌써 말에 안장을 얹었기 때문이다.'
		),
		T('', card('munhee')),
		munheeLine,
		P(
			'Her husband Chunchu is twenty-nine, and already the most cunning man in Samhan. Only the quiet rooms know it yet.',
			'남편 춘추는 스물아홉, 벌써 삼한에서 가장 교활한 사내다. 아직은 조용한 방들만 그걸 안다.'
		),
		T('', card('chunchu')),
		P(
			'Gotaso sits in front of him on the same horse. Bupmin, six, has his own, and will not share the saddle.',
			'고타소는 아버지와 같은 말 안장 앞자리에 앉는다. 여섯 살 법민은 제 말이 있고, 안장을 나눠 타지 않는다.'
		),
		T('', card('gotaso')),
		T('Faster.', (b) => b.kind === 'dialogue' && b.person === 'gotaso'),
		T('You’ll bite your tongue'),
		T('I’m following. That’s different.'),
		T('lawyer’s horse'),
		P(
			'The road climbs past the hill where adults invent countries. Bupmin reins in and looks down at the city, where the slaves are already sweeping the coronation road.',
			'길은 어른들이 나라를 만드는 언덕을 지나 오른다. 법민이 고삐를 당기고 아래 도성을 내려다본다. 노비들이 벌써 즉위식 길을 쓸고 있다.'
		),
		T('', card('munmu')),
		T('When I’m king everyone has to listen to me'),
		T('He gets the sentences from you'),
		T('I may need to borrow it back'),
		P(
			'Chunchu looks up the hill. He made a country up there once, with Yushin, when he was nine and the stars were still negotiable. Neither of them tells it the same way twice.',
			'춘추가 언덕 위를 올려다본다. 거기서 한번 나라를 만든 적이 있다. 유신과 함께, 아홉 살이었고 별도 아직 흥정이 되던 시절이었다. 둘 다 그 이야기를 할 때마다 조금씩 다르게 한다.'
		),
		vow,
		P('Then the bells change, and the whole family is late for a coronation.', '그때 종소리가 바뀌고, 온 집안이 즉위식에 늦는다.'),

		T('The Throne Hall', kind('scene')),
		P(
			'In the hall the sleeves are the census. Purple at the front for True Bone, then scarlet, blue and yellow, down to the doors. You can read a man before he speaks.',
			'전각에서는 소매가 호적이다. 앞줄은 진골의 자주색, 그 뒤로 붉은색, 푸른색, 노란색이 문까지 이어진다. 입을 열기 전에 사람을 읽는다.'
		),
		P(
			'Past the yellow there is no colour at all. The men holding the canopy poles wear undyed hemp. Nobody counts them.',
			'노란색 너머엔 아무 색도 없다. 일산 장대를 든 사내들은 물들이지 않은 삼베를 입었다. 아무도 그들을 세지 않는다.'
		),
		D('yushin', ['Slaves, Princess. They aren’t in the count.'], ['노비입니다, 공주님. 셈에 들지 않습니다.']),
		sundukSlaves,
		P('Then she walks the length of the hall alone. Two hundred sleeves bow, some of them late.', '그러고 그녀는 홀로 전각 끝까지 걷는다. 소매 이백 개가 고개를 숙인다. 몇은 늦게.'),
		P(
			'The crown is carried by the oldest man on the Council. She knows the voice. This morning it said “ridiculous” in her corridor.',
			'왕관은 화백의 가장 늙은 사내가 받쳐 든다. 그녀는 그 목소리를 안다. 오늘 아침 그녀의 복도에서 “웃기지도 않는군” 하던 목소리다.'
		),
		D('sunduk', ['Still ridiculous, my lord?'], ['아직도 우스운가, 공?']),
		D('suljong', ['…Entirely, Majesty.', 'Hold still. It’s heavier than it looks.'], ['……전적으로 그렇습니다, 폐하.', '가만히 계십시오. 보기보다 무겁습니다.']),
		D('sunduk', ['So am I.'], ['나도 그렇다네.']),
		P('He sets it on her head. It fits. Nobody mentions it.', '그가 왕관을 그녀 머리에 얹는다. 꼭 맞는다. 아무도 그 말을 하지 않는다.'),
		queenLine,
		T('', card('sunduk')),
		T('The sacred-bone males were exhausted', kind('quote')),

		T('The Yard', kind('scene')),
		yard,
		T('The marshal walked past.'),
		T('The most popular man in Silla'),
		back,
		forgot,
		T('Are you feeling alright, your majesty?'),
		T('(startled)'),
		T('Not the door.'),
		T('For a moment neither of them says anything.'),
		T('…Once.', (b) => b.kind === 'dialogue' && b.person === 'yushin'),
		T('Once what.'),
		T('Call me by name, not by title.'),
		T('…Yushin-ah.'),
		nobody,
		T('My sister married for love'),
		T('…Your Majesty.', (b) => b.kind === 'dialogue' && b.person === 'yushin' && b.en.length === 1),
		T('So from now on'),

		T('The Pledge', kind('scene')),
		pledge,
		T('pledge eternal allegiance to the Queen'),
		T('At the end of the ceremony, everyone chants'),
		T('Long live the Hwarang spirit!'),

		T('The Envoys', kind('scene')),
		P('Silla sends envoys to tell the neighbours. The neighbours have opinions.', '신라는 이웃 나라들에 사신을 보내 새 여왕을 알린다. 이웃들은 할 말이 많다.'),
		T('', card('kingmu')),
		T('So that old brat Jinpyung is finally dead'),
		P(
			'In Pyongyang a tired king laughs into his wine and bets on how long her council lasts. Across the eastern sea, a king with an empress for an aunt calls it a trend.',
			'평양에서는 지친 임금이 술잔에 대고 웃으며, 그 회의가 얼마나 갈지 내기를 건다. 동쪽 바다 건너에서는 여제를 숙모로 둔 왕이 새 유행이라 부른다.'
		),
		{
			kind: 'card',
			person: 'taizong',
			caption: 'The emperor of Tang. The largest empire under heaven, run by a man who has never lost a war.',
			ko: '당의 황제. 하늘 아래 가장 큰 제국을, 한 번도 전쟁에 져 본 적 없는 사내가 다스린다.'
		},
		emperor,

		T('The Peonies', kind('scene')),
		T('He sends her a gift: a painting of peonies'),
		T('There are no butterflies on these flowers.'),
		D('chunchu', ['Lovely work. Tang brushwork, three colours of— Majesty?'], ['훌륭한 솜씨입니다. 당나라 붓놀림에, 세 가지 빛깔의— 폐하?']),
		T('It means no scent.'),
		D(
			'chunchu',
			['…I’d have hung it in the hall.', 'Somebody remind me never to play go with Her Majesty.'],
			['……저라면 대전에 걸어 놓았을 겁니다.', '폐하와는 바둑을 두지 말라고, 누가 좀 일러 주십시오.']
		),
		T('She has the seeds planted anyway.'),
		T(', for kindness.'),
		T(', for virtue.'),
		T('', kind('hanja')),
		B(
			'Six men who hate the word “woman” crowned one anyway. One of them carried the crown. How? Go back one night, to a brazier…!',
			'“여자”라는 말을 질색하는 사내 여섯이, 끝내 여자를 왕으로 세웠다. 그중 하나는 왕관까지 받쳐 들었다. 어떻게? 하룻밤 전, 화로 하나 앞으로 돌아가 보자…!'
		)
	];

	const at = {};
	for (const id of ['three-princesses', 'scene-three-princesses-sing', 'scene-three-princesses-invite-2', 'scene-three-princesses-invite-39'])
		at[id] = 'What is left is women';
	for (const id of ['yushin-chunchu-munhee', 'scene-yushin-chunchu-bad-boy-5', 'scene-young-yushin-loves-sunduk-12'])
		at[id] = 'Kim Yushin is thirty-seven';
	for (const id of ['sunduk-yushin-back-blush', 'scene-sunduk-gayageum', 'scene-sunduk-loves-yushin-38']) at[id] = 'she sees the width of his back';
	for (const id of ['scene-yushin-chunchu-bad-boy-2', 'scene-yushin-chunchu-bad-boy-37']) at[id] = 'He made a country up there once';
	for (const id of [
		'sunduk-observatory-twilight',
		'cheomseongdae_01',
		'cheomseongdae_02',
		'cheomseongdae-moon-iconic',
		'cheomseongdae-moon-minimal',
		'sunduk-chunma-stars'
	])
		at[id] = 'Long live the Queen!';
	reanchor(e, {
		...at,
		'munhee-folded-letter': 'Yushin’s little sister is late',
		'kim-family': 'Her husband Chunchu',
		'bupmin-future-king': 'Her husband Chunchu',
		'council-blue-table': 'six men and a brazier',
		'three-crowns-symmetry': 'The neighbours have opinions',
		'sunduk-poster': 'bets on how long her council lasts',
		'scene-yushin-always-dukman-2': 'Nobody in the yard hears'
	});
});

/* ───────────────────────────── #2 Harmony Council ───────────────────────────── */
episode(2, 'Nobody counts the grumbling', (e, T) => {
	const rule = T('The Council decides by');
	rule.html = 'The Council decides by <b>unanimity</b>. One voice against is enough to stop a name. That is why it takes all night.';
	rule.ko = '화백은 <b>만장일치</b>로 정한다. 반대 하나면 이름이 멈춘다. 그래서 밤이 샌다.';
	const count = T('The first count is three to three');
	count.html = 'The first count is three to three. A hung jury in silk.';
	count.ko = '초투표는 셋 대 셋. 비단 옷 입은 배심이 갈렸다.';
	const bidamSpeech = T('My lords have said one word forty times');
	bidamSpeech.en.splice(3, 0, 'In the Lotus Sutra a dragon girl becomes a Buddha faster than the monks can object. I’ve read it. So have you, my lords.');
	bidamSpeech.lines.splice(3, 0, '법화경에서는 용녀가, 비구들이 반대하기도 전에 성불합니다. 저도 읽었고, 어르신들도 읽으셨지요.');
	const tiger = T('A tiger has no sex');
	tiger.en = ['I have taken a tiger.', 'A tiger has no sex. It has teeth.', '…I raise it.'];
	tiger.lines = ['나는 호랑이를 잡아 본 사람이오.', '호랑이는 암수가 없소. 이빨이 있지.', '……올리겠소.'];

	e.blocks = [
		P('One night earlier. Six nobles, one brazier, and nobody stands up until they all agree.', '하룻밤 전. 귀족 여섯, 화로 하나. 뜻이 모두 같아질 때까지 아무도 일어서지 않는다.'),
		T('The Night Before', kind('scene')),
		T('speaking in harmony', kind('term')),
		T('Someone lights the small brazier'),
		T('The flame turns blue'),
		T('wooden piece on a personal mat'),
		rule,
		P(
			'Six seats. Yushin has none. He has a wall, and he is leaning on it, because the Marshal was invited to answer questions, not to ask them.',
			'자리는 여섯. 유신의 자리는 없다. 벽이 있고, 그는 거기 기대어 있다. 대장군은 물음에 답하라고 부른 것이지, 물으라고 부른 게 아니다.'
		),
		count,
		T('Three go to the no side'),
		T('Somebody always tries a man first.'),
		D('murim', ['Prince Chunchu, then. His mother is royal.'], ['그럼 춘추 공은 어떻소. 어머니가 성골이오.']),
		D(
			'imjong',
			['And his father isn’t. Chunmyung’s boy is a Noble, Murim. By your own rule.'],
			['아버지는 아니잖소. 천명 공주의 아들은 진골이오, 무림 공. 공의 규칙대로라면.']
		),
		P('Chunchu is not in the room. He was nine when he learned why.', '춘추는 그 방에 없다. 왜 없는지는 아홉 살 때 배웠다.'),
		T('The night bridge', kind('flashback')),
		P(
			'Tonight Chunchu is sitting on the rail of the little bridge over the pond. Every man who leaves the pavilion will have to pass him.',
			'오늘 밤, 춘추는 연못 위 작은 다리 난간에 앉아 있다. 정자를 나서는 사내는 누구든 그 앞을 지나야 한다.'
		),
		D('murim', ['The Kim of Gaya, then. The Marshal’s blood is royal.'], ['그럼 가야 김씨는. 대장군의 피는 왕족이오.']),
		D(
			'imjong',
			['Royal in a country that no longer exists.', 'If we start counting kingdoms that no longer exist, half this room is royal.'],
			['이제 없는 나라의 왕족이지.', '없어진 나라까지 세기 시작하면, 이 방 절반이 왕족이오.']
		),
		P('By the wall, Yushin does not move. He has heard it before. He will hear it again.', '벽 앞의 유신은 꿈쩍하지 않는다. 전에도 들은 말이다. 또 듣게 될 말이다.'),
		{
			kind: 'card',
			person: 'alchun',
			caption: 'Yushin’s old yardmate. Blunt, folksy, and the only man on the Council who has killed a tiger.',
			ko: '유신의 연무장 동기. 투박하고 구수하고, 화백에서 호랑이를 잡아 본 유일한 사내.'
		},
		D(
			'alchun',
			['Three left, and all of them in skirts.', 'Well. Somebody say something new, or we’re here till the frost.'],
			['남은 피는 셋, 셋 다 치마요.', '자. 누가 새 말 좀 하시오. 아니면 서리 올 때까지 여기 있을 거요.']
		),
		T('The newest member of the Council'),
		T('', card('bidam')),
		bidamSpeech,
		T('Bone is the measure'),
		T('The bone has run out'),
		P(
			'Murim looks at the brazier for a long time. Then he moves his piece without a word, the way a man pays a debt he has decided not to argue about. Four to two.',
			'무림은 한참 화로를 본다. 그러고는 말없이 패를 옮긴다. 따지지 않기로 한 빚을 갚는 사람처럼. 넷 대 둘.'
		),
		T('cannot raise my hand'),
		T('That is what deliberation is for'),
		D('bidam', ['Alchun. You’ve wrestled worse than a woman.'], ['알천. 자네는 여자보다 무서운 것과도 붙어 봤잖나.']),
		tiger,
		T('Then a great tiger burst in among the seats', kind('quote')),
		P(
			'Five to one. Every face in the pavilion turns to the oldest sleeve in it. One voice against is still enough.',
			'다섯 대 하나. 정자 안의 모든 얼굴이 가장 늙은 소매에게로 돌아간다. 반대 하나면 여전히 충분하다.'
		),
		P(
			'Suljong’s hand is on his piece. It stays there. The brazier, which was blue, is going red again.',
			'술종의 손이 패 위에 있다. 그대로 있다. 푸르던 화롯불이 다시 붉어지고 있다.'
		),
		D(
			'suljong',
			['You want me to say she can do it. I don’t know that.', 'Nobody in this room knows that.'],
			['그분이 해낼 수 있다고 말하라는 거요. 나는 그걸 모르오.', '이 방 누구도 모르오.']
		),
		D(
			'bidam',
			[
				'No, my lord. Nobody does.',
				'A raft isn’t ashamed of the river. You don’t have to believe in her. Just move the piece to the other side of the cup.',
				'Then call it ridiculous all the way home. Nobody counts the grumbling. They count the pieces.'
			],
			[
				'예, 모르지요. 아무도 모릅니다.',
				'뗏목은 강을 부끄러워하지 않습니다. 그분을 믿으실 필요는 없습니다. 패만 잔 건너편으로 옮기십시오.',
				'그리고 댁에 가시는 내내 우습다고 하십시오. 투덜거림은 아무도 세지 않습니다. 세는 건 패입니다.'
			]
		),
		D('suljong', ['…Ridiculous.'], ['……웃기지도 않는군.']),
		P(
			'He moves the piece. All six sit on the yes side. He will say the word again in the morning, in a corridor, not quite quietly enough.',
			'그가 패를 옮긴다. 여섯이 모두 찬성 쪽에 앉는다. 아침에 그는 그 말을 한 번 더 한다. 어느 복도에서, 충분히 작지 않은 목소리로.'
		),
		T('has no fear in him at all'),
		T('catches the Second Blade'),
		T('Well stood.'),
		T('Today is the country’s business'),

		SC('Dawn', '새벽'),
		P(
			'The brazier is out by the time Alchun carries the six pieces to the princess’s door. He carries them in his fist, because nobody told him there was a box.',
			'알천이 여섯 개의 패를 공주의 문 앞까지 들고 갈 무렵, 화로는 꺼져 있다. 그는 패를 주먹에 쥐고 간다. 담는 함이 있다는 걸 아무도 일러 주지 않았으니까.'
		),
		D('sunduk', ['All six?'], ['여섯 다?']),
		D(
			'alchun',
			['All six, Princess. Took till the fire went out.', 'There’ll be talk. The old men are already at it. “There hasn’t been a real king since the Cloud King.”'],
			['여섯 다요, 공주님. 불 꺼질 때까지 걸렸소.', '말이 많을 거요. 늙은이들은 벌써 그러고 있소. “구름왕 이후로 임금다운 임금이 없었다”고.']
		),
		D(
			'sunduk',
			['My great-grandfather. They say that at every crowning.', '…Four stones on four mountains, and a yard full of boys. And now me.'],
			['증조부님 말이지. 즉위식마다 하는 소리야.', '……네 산에 비석 넷, 사내아이로 가득한 마당. 그리고 이제 나.']
		),
		D('alchun', ['We all came out of that yard. Every man who voted tonight.'], ['우리 다 그 마당에서 나왔소. 오늘 밤 패를 놓은 사내들 전부.']),
		D(
			'sunduk',
			['Then find me someone who remembers him. Not the stones. The man.', 'If I’m going to be measured against him, I’d like to see the ruler.'],
			['그럼 그분을 기억하는 사람을 찾아 줘. 비석 말고, 사람으로.', '그분한테 재어질 거라면, 그 자부터 봐야겠어.']
		),
		B(
			'Every man who voted that night grew up in her great-grandfather’s yard. Who was the Cloud King? Ask anyone in Surabol…!',
			'그날 밤 패를 놓은 사내들은 모두 그녀의 증조부가 만든 마당에서 컸다. 구름왕은 누구였나? 서라벌 아무에게나 물어보라…!'
		)
	];

	reanchor(e, {
		'harmony-council': 'Three left, and all of them in skirts',
		'empty-throne-blue-light': 'Three left, and all of them in skirts',
		'council-tea-wide': 'nobody stands up until they all agree',
		'council-tea-alchun': 'You’ve wrestled worse than a woman',
		'council-seq-alchun': '…I raise it.'
	});
});

/* ───────────────────────────── #3 Jinheung, the Cloud ───────────────────────────── */
episode(3, 'I’ll put one in the middle', (e, T) => {
	const OLD = 'The Old Hwarang';
	const boy = (en, ko) => S('The Boy', en, ko);
	const old = (en, ko) => S(OLD, en, ko);
	e.blocks = [
		T('Ask anyone in Surabol about the Cloud King'),
		T('The Cloud King’s shade', kind('map')),
		SC('Coronation Night', '즉위식 밤'),
		P(
			'On her first night as queen, Sunduk does not sleep. Alchun has found her a man who remembers. He is seventy-one, the last boy left from the Cloud King’s yard, and he arrives in a litter, complaining about the stairs.',
			'여왕이 된 첫날 밤, 선덕은 잠들지 않는다. 알천이 기억하는 사람을 찾아 왔다. 일흔하나, 구름왕의 마당에서 남은 마지막 소년이다. 그는 가마를 타고 와서 계단 불평부터 한다.'
		),
		old(
			['Majesty. You wanted the Cloud King.', 'Everyone loses to him, you know. He’s dead. The dead stop making mistakes.'],
			['폐하. 구름왕을 찾으셨다지요.', '다들 그분한테 집니다. 돌아가셨으니까요. 죽은 사람은 더 실수를 안 하거든요.']
		),
		D('sunduk', ['Then tell me his mistakes. I’ve heard the rest all day.'], ['그럼 그분 실수를 말해 주게. 나머지는 하루 종일 들었네.']),
		T('He was seven when they put the crown on him'),
		T('', card('jinheung')),
		T('He put up stones wherever he stopped'),
		old(
			['There’s no boasting on those stones at all. I’ve read them. I climbed two mountains to do it.', 'Boasting is for men who are worried about losing it.'],
			['그 비석들엔 자랑이 하나도 없습니다. 제가 읽어 봤지요. 그거 읽자고 산을 둘이나 올랐습니다.', '자랑은 뺏길 걱정을 하는 사람이나 하는 겁니다.']
		),
		T('the Great King Jinheung toured the lands', kind('quote')),
		T('Late in his reign he invents the Hwarang'),
		T('Flower youths', kind('term')),
		P(
			'Every man who voted for her last night came out of that yard. So did the old man in the litter, in its first years, when it was still mostly bruises.',
			'어젯밤 그녀에게 패를 놓은 사내들은 모두 그 마당에서 나왔다. 가마 속 늙은이도 그랬다. 처음 몇 해, 아직 거의 멍뿐이던 시절에.'
		),
		T('Near the end he shaved his head'),
		D('sunduk', ['Why the robe? He had everything.'], ['왜 승복을 입으셨나? 다 가지셨는데.']),
		old(['I asked him that. I was fifteen and stupid. Same question, worse manners.'], ['저도 여쭸습니다. 열다섯에, 멍청했지요. 같은 질문인데, 버릇은 더 없었고요.']),
		{
			kind: 'flashback',
			year: '576',
			title: 'The yard fence · 마당 울타리',
			blocks: [
				P(
					'A boy is losing in the yard when a bald monk leans on the fence and laughs at him. Everyone else is kneeling. The boy is too busy losing to notice.',
					'한 소년이 연무장에서 지고 있을 때, 까까머리 중 하나가 울타리에 기대 그를 보고 웃는다. 다른 이들은 다 무릎을 꿇고 있다. 소년은 지느라 바빠서 그걸 못 본다.'
				),
				D(
					'jinheung',
					['You drop your shoulder before you swing. He knows what you’ll do before you do.'],
					['휘두르기 전에 어깨가 먼저 떨어지는구나. 네가 뭘 할지 저놈이 너보다 먼저 안다.']
				),
				boy(['Who asked you, monk?'], ['누가 물어봤소, 스님?']),
				D('jinheung', ['Nobody. That’s the nice thing about this robe.'], ['아무도. 이 옷의 좋은 점이 그거다.']),
				P(
					'Then the boy sees the kneeling yard, and the face under the shaved head, and goes down in the dust so fast he bruises a knee.',
					'그제야 소년은 무릎 꿇은 마당을 보고, 깎은 머리 아래 얼굴을 본다. 얼마나 빨리 엎드렸는지 무릎이 멍든다.'
				),
				boy(['Majesty— why— the robe, Majesty, why?'], ['전하— 어찌— 그 옷은, 전하, 어찌하여?']),
				D(
					'jinheung',
					[
						'They put a crown on me at seven. It was too big. I grew into it.',
						'Then I filled it. A river. A coast. A kingdom.',
						'Everything I won, I won from a friend first.',
						'…The robe is lighter. Get up. Fix your shoulder.'
					],
					[
						'일곱 살에 왕관을 씌우더구나. 너무 컸지. 자라서 맞췄다.',
						'그다음엔 채웠다. 강 하나. 바닷가 하나. 나라 하나.',
						'얻은 건 전부, 먼저 벗한테서 얻은 것이다.',
						'……이 옷이 더 가볍다. 일어나라. 어깨나 고쳐라.'
					]
				)
			]
		},
		D('sunduk', ['From a friend. Which friend?'], ['벗한테서. 어느 벗?']),
		old(
			['He never said. He died that same year.', 'Ask in Sabi, Majesty. They’ll change the subject. That’s how you know.'],
			['말씀 안 하셨습니다. 그해에 돌아가셨지요.', '사비에 가서 물어보십시오, 폐하. 말을 돌릴 겁니다. 그걸로 아는 거지요.']
		),
		old(
			[
				'We called him the Cloud King, after the name he took at the end.',
				'A cloud has no border, you see. It goes where it likes, and for an afternoon the ground underneath is its ground.',
				'A cloud never asks whose field it’s raining on.'
			],
			['우리는 그분을 구름왕이라 불렀지요. 마지막에 받은 그 이름 따라서.', '구름엔 경계가 없거든요. 가고 싶은 데로 가고, 한나절은 그 아래 땅이 다 제 땅입니다.', '구름은 누구 밭에 비를 뿌리는지 묻지 않습니다.']
		),
		P(
			'The queen sits with that a long time. Her great-grandfather marked the edges of what he took. She has nothing to take, and a council that counts her every step.',
			'여왕은 오래 그 말을 곱씹는다. 증조부는 제가 취한 것의 가장자리에 표시를 했다. 그녀에게는 취할 것이 없고, 걸음마다 세는 회의가 있다.'
		),
		D(
			'sunduk',
			['He put his stones at the edges.', '…I’ll put one in the middle, and point it at the sky. Nobody can say I took that from a friend.'],
			['그분은 가장자리에 돌을 세우셨지.', '……나는 한가운데 세우겠네. 하늘을 향해서. 그건 벗한테서 뺏었다고 아무도 못 하겠지.']
		),
		P(
			'Within a year there is a stone tower in the middle of Surabol for reading the stars. It boasts about nothing. It just looks up.',
			'한 해가 안 돼 서라벌 한복판에 별을 읽는 돌탑이 선다. 아무것도 뽐내지 않는다. 그저 올려다볼 뿐이다.'
		),
		B(
			'The rain fell on Baekje’s field, and Baekje kept the grudge. In five days, it names the prince who will inherit it…!',
			'그 비는 백제의 밭에 내렸고, 백제는 원한을 간직했다. 닷새 뒤, 백제는 그 원한을 물려받을 왕자를 세운다…!'
		)
	];
});

/* ───────────────────────────── #4 Prince Euija (one Silla line) ───────────────────────────── */
episode(4, 'It still owes us a river', (e, T) => {
	const mu = T('in a hedge with a jar');
	mu.en.push('Over the mountains, Silla crowned a woman this spring. Even she gets up before noon.');
	mu.lines.push('산 너머 신라는 올봄 여자를 왕으로 세웠다. 그 여자도 한낮 전엔 일어난다더라.');
	const euija = T('A crown prince ought to hit what he aims at.');
	euija.en = ['Let Silla crown a heifer, Father. It still owes us a river. Ha!', 'Meanwhile I’m practising. A crown prince ought to hit what he aims at.'];
	euija.lines = ['신라가 암소를 왕으로 세운들 어떻습니까, 아바마마. 그래도 우리한테 강 하나 빚진 건 그대로지요. 하하!', '그동안 저는 연습 중입니다. 태자라면 겨눈 데는 맞혀야지요.'];
});

/* ───────────────────────────── #5 Eight Great Clans ───────────────────────────── */
episode(5, 'This country needs a new story', (e, T) => {
	const CROWD = '🗣';
	const crowd = (en, ko) => ({ kind: 'dialogue', chip: '#8a8a94', speaker: CROWD, en, lines: ko });
	const opener = T('one king sits between them');
	opener.html = 'The Eight Great Clans run this country, and one king sits between them. Today, on the crown prince’s day, they settle nothing on the sand. They never do.';
	opener.ko = '여덟 대성이 이 나라를 쥐고, 그 사이에 왕 하나가 앉아 있다. 오늘, 태자 책봉 날, 그들은 모래판에서 아무것도 결판내지 않는다. 늘 그렇다.';
	const grid = T('square grid in the palace yard');
	grid.html = 'On the crown prince’s day, the court chalks a square grid in the palace yard. Four hard lines. No banners. The young men of each house step onto the grid in white.';
	grid.ko = '태자 책봉 날, 궁은 마당에 네모난 격자를 분필로 긋는다. 단단한 선 넷. 깃발은 없다. 각 가문의 젊은이들이 흰옷을 입고 격자에 오른다.';
	const satekWhite = T('White cloth. Wooden swords.');
	satekWhite.en = ['White cloth. Wooden swords.', 'If anyone bleeds the wrong colour, the harbour talks stop for a month.'];
	satekWhite.lines = ['흰옷. 목검.', '엉뚱한 색으로 피 보면, 항구 얘기는 한 달 쉰다.'];
	const swords = T('Swords first. Wooden ones');
	swords.html =
		'Swords first. Wooden ones, which still remember steel. The Jinmo boy holds his blade high over his head, the Jinmo way, daring you. A Hae boy takes the dare. On the call they both move. Blades skim the chalk. The white sleeves clap together so close that the steps gasp.';
	swords.ko =
		'칼부터. 목검이다. 아직 쇠를 기억하는 나무. 진모 도령이 진모식으로 칼을 머리 위로 높이 든다. 덤벼 보라는 뜻이다. 해씨 소년이 덤빈다. 구령이 떨어지자 둘이 동시에 움직인다. 칼날이 분필 위를 스친다. 흰 소매가 맞부딪는 소리에 계단이 숨을 삼킨다.';
	const point = T('Point to the white sleeve.');
	point.en = ['That Jinmo boy?', 'Fast wrists.', 'Faster feet than the Hae, too.', 'Point to Jinmo.'];
	point.lines = ['저거 진모 애지?', '손목 빠르네.', '발도 해씨보다 빨라.', '점 — 진모.'];
	const throwP = T('hooks a leg');
	throwP.html =
		'A Yunbi boy hooks a leg, low, the coast-road way. The Satek boy answers with his hip. He lifts, he turns, and the Yunbi boy’s feet leave the earth. The yard goes quiet the way a dock goes quiet when a rope snaps. Sand takes the shoulder. The chalk does not argue.';
	throwP.ko =
		'연비 소년이 해안 길 사람답게 낮게 다리를 건다. 사택 소년이 엉덩이로 받는다. 들어 올리고, 돌리고, 연비 소년의 발이 땅을 떠난다. 밧줄 끊긴 부두처럼 마당이 조용해진다. 모래가 어깨를 받는다. 분필은 따지지 않는다.';
	const yunbiKnee = T('Your boy’s knee touched first.');
	yunbiKnee.en = ['Your boy’s knee touched first.', 'Ask the chalk.'];
	yunbiKnee.lines = ['너희 애 무릎이 먼저야.', '분필한테 물어봐.'];
	const yunbiArm = T('You hold the king’s sleeve and call it a harbour.');
	yunbiArm.en = ['You hold the king’s sleeve and call it a harbour.', 'We don’t hold the sleeve. We hold the arm.'];
	yunbiArm.lines = ['너희는 임금의 소매를 잡고 그걸 항구라 부르는군.', '우리는 소매를 안 잡소. 팔을 잡지.'];

	e.blocks = [
		T('Satek. Yunbi. Jinmo. Mokli.'),
		opener,
		T('The eight great surnames', kind('term')),
		P(
			'The Chinese wrote the eight names down too, and got half of them wrong. That tells you how often the clans let outsiders count them.',
			'중국 사람들도 그 여덟 이름을 적어 두었는데, 절반을 틀리게 적었다. 가문들이 바깥사람에게 저희를 세게 해 주는 일이 얼마나 드문지 알 만하다.'
		),
		T('The great surnames of the country are eight clans', kind('quote')),
		T('The Sand', kind('scene')),
		grid,
		T('The Yunbi boys turned a Satek cart over'),
		satekWhite,
		T('', card('elderyunbi')),
		T('keep your boys’ wrists honest'),
		swords,
		point,
		P(
			'The Jinmo boy bows to the steps and looks straight past the Hae boy, to the edge of the sand, where the crown prince’s nobody is waiting.',
			'진모 도령이 계단을 향해 절하고는, 해씨 소년 너머 모래판 가장자리를 똑바로 본다. 태자의 이름 없던 아이가 기다리는 곳이다.'
		),
		T('satba locked before they stand'),
		throwP,
		T('Even Yunbi can fall without a cart.'),
		yunbiKnee,
		P(
			'The elders watch from the hall steps. They always do, and they still count wrong when it is their sleeve.',
			'원로들은 섬돌에서 본다. 늘 본다. 그래도 제 소매 일이면 잘못 센다.'
		),

		SC('The Last Bout', '마지막 판'),
		P(
			'Last on the sand: the Jinmo boy, and the crown prince’s nobody. For five days the Jinmo boy has told the steps what he will do to a peasant. Now the peasant has a royal surname, and the steps want to see.',
			'모래판의 마지막 판. 진모 도령, 그리고 태자의 이름 없던 아이. 진모 도령은 닷새 내내 천한 놈을 어떻게 해 주겠다고 계단에 떠벌렸다. 이제 그 천한 놈에게 왕실의 성이 붙었고, 계단은 구경하고 싶어 한다.'
		),
		D(
			'jinmoboy',
			['Buyeo. BUYEO.', 'You got that name off a drunk on a riverbank, eel boy. I’ll hand it back to him in pieces.'],
			['부여. 부여라고.', '강가에서 술 취한 놈한테 얻은 이름이잖아, 장어 새끼야. 조각내서 돌려주마.']
		),
		D('gyebek', ['It was given.'], ['받은 것이오.']),
		D('jinmoboy', ['…What?'], ['……뭐?']),
		D('gyebek', ['You said I got it. It was given. That is different.'], ['얻었다고 했소. 받은 것이오. 다르오.']),
		P(
			'Satba. Equal grips, knees in the grit, then up together. The Jinmo boy is a head taller, and he knows it. He leans.',
			'샅바. 같은 힘으로 잡고, 무릎은 모래에, 그리고 함께 일어선다. 진모 도령이 머리 하나 더 크고, 본인도 그걸 안다. 그가 밀어붙인다.'
		),
		crowd(['Jinmo’s got him—', 'Look at the eel boy’s feet, he’s going—', 'He’s not going anywhere. Look.'], ['진모가 잡았다—', '장어 놈 발 좀 봐, 밀린다—', '안 밀려. 봐 봐.']),
		P(
			'Gyebek’s heels slide back a finger’s width, and stop. He does not try to throw. He holds, the way he held a rope in a river for five days, and he waits.',
			'계백의 발꿈치가 손가락 한 마디만큼 밀리다가, 멈춘다. 그는 넘기려 하지 않는다. 버틴다. 닷새 동안 강물 속에서 밧줄을 버티던 것처럼. 그리고 기다린다.'
		),
		D(
			'euija',
			['Ha! Look at him, Father. He isn’t wrestling.', 'He’s waiting for the other one to get bored of breathing.'],
			['하하! 보십시오, 아바마마. 저건 씨름이 아닙니다.', '저쪽이 숨 쉬는 데 질릴 때까지 기다리는 거지요.']
		),
		D('kingmu', ['Sit down. You’ll frighten the Satek.'], ['앉아라. 사택이 놀라겠다.']),
		D('jinmoboy', ['Let— go— you—'], ['놔— 이— 놓으라고—']),
		D('gyebek', ['No.'], ['아니오.']),
		P(
			'The Jinmo boy runs out of breath first. Gyebek turns him the way you turn over a full basket: carefully, so nothing spills.',
			'숨이 먼저 떨어지는 쪽은 진모 도령이다. 계백은 가득 찬 바구니를 뒤집듯 그를 돌린다. 조심스럽게, 아무것도 쏟아지지 않게.'
		),
		T('Sand takes a Jinmo shoulder.'),
		P(
			'Then someone in the crowd starts the old chant, the one every house in Sabi knows by heart, because a royal name has just won on the sand. Eraha is the old Baekje word for king.',
			'그때 군중 속 누군가가 옛 구호를 시작한다. 사비의 집이라면 어디나 외우는 구호다. 방금 왕실의 성이 모래판에서 이겼으니까. 어라하는 백제의 옛말로 임금이다.'
		),
		crowd(['Restore the reign of the thirteenth Eraha!'], ['열셋째 어라하의 치세를 다시 이루소서!']),
		P(
			'Euija hears it and stops smiling. Nobody notices, except Gyebek, who is still on his knees in the sand and looking straight at him.',
			'의자가 그 소리를 듣고 웃음을 거둔다. 아무도 눈치채지 못한다. 모래 위에 아직 무릎 꿇은 채 그를 똑바로 보는 계백만 빼고.'
		),
		T('By dusk the white is grey'),

		T('The Assembly', kind('scene')),
		T('In the Assembly they fight for power'),
		T('The Rock of Government', kind('term')),
		T('Unlike Silla’s Harmony Council'),
		T('What the Assembly votes on, more often than war'),
		T('Blood cools. A winter anchorage does not.'),
		yunbiArm,
		T('Nobody alive can say what started it.'),
		P('Today, for once, they agree on something. They don’t like the boy on the sand.', '오늘은 웬일로 둘이 한 가지에 뜻이 맞는다. 모래판의 그 아이가 싫다.'),
		D(
			'eldersatek',
			['Buyeo, on an eel boy.', 'Every house on this rock owns one of the crown prince’s sons. Now he has a man none of us own.'],
			['장어 파는 놈한테 부여라니.', '이 바위 위 가문마다 태자의 아들 하나씩은 쥐고 있소. 그런데 이제 그한테 우리 누구 것도 아닌 사내가 생겼단 말이오.']
		),
		D('elderyunbi', ['Then we buy him. Before you do.'], ['그럼 사지. 당신네보다 먼저.']),
		D('eldersatek', ['You’ll overpay. You always do.'], ['값을 더 쳐주겠지. 늘 그러니까.']),
		T('Neither house has ever won'),
		T('They say Yunbi already knows'),

		SC('The Rock at Dusk', '해 질 녘의 바위'),
		P(
			'When the rock is empty, the crown prince is still sitting on it, which is not allowed. His new man stands beside him, which is not allowed either.',
			'바위가 비고 나서도 태자는 그 위에 앉아 있다. 허락되지 않는 일이다. 그 옆엔 새 사람이 서 있다. 그것도 허락되지 않는 일이다.'
		),
		D('euija', ['They want to buy you, you know. Both of them. They’ll bid all winter.'], ['저치들이 너를 사려고 한다. 둘 다. 겨울 내내 값을 부를 거다.']),
		D('gyebek', ['I am not for sale.'], ['저는 팔 것이 아닙니다.']),
		D('euija', ['Ha! No. That’s what frightens them.', 'You heard the chant on the sand?'], ['하하! 그렇지. 그래서 저치들이 겁을 먹는 거다.', '모래판에서 그 구호 들었느냐?']),
		D('gyebek', ['Yes. Everyone knows it.'], ['예. 다들 압니다.']),
		D('euija', ['Do you know what it’s about?'], ['무슨 뜻인지는 아느냐?']),
		D('gyebek', ['No.'], ['모릅니다.']),
		D(
			'euija',
			[
				'Neither do they. That’s the trouble.',
				'Eight houses, one river, and the only thing they’ll shout together is a king three hundred years dead.',
				'This country needs a new story, Gyebek. The old one is wearing out.'
			],
			['저치들도 모른다. 그게 문제지.', '가문 여덟, 강 하나. 그런데 다 같이 외치는 거라곤 삼백 년 전에 죽은 임금 하나뿐이다.', '이 나라엔 새 이야기가 필요하다, 계백아. 옛것은 닳아 가고 있어.']
		),
		D('gyebek', ['Who will tell it?'], ['누가 합니까?']),
		P('Euija laughs, and does not answer, which for him is a kind of answer.', '의자는 웃기만 하고 대답하지 않는다. 그에겐 그것도 대답의 한 가지다.'),
		B(
			'Why is one dead king the only thing eight houses still agree on? To find out, we go back three hundred years…!',
			'어째서 죽은 임금 하나가 여덟 가문이 아직도 뜻을 모으는 유일한 것일까? 알려면 삼백 년을 거슬러 가야 한다…!'
		)
	];

	reanchor(e, {
		heartbeat: 'We don’t hold the sleeve. We hold the arm.',
		'satek-crowns-steps': 'Every house on this rock owns one',
		'clan-tourney-sword-victory': 'Point to Jinmo.',
		'clan-tourney-ssireum-lift': 'A Yunbi boy hooks a leg'
	});
});

/* ───────────────────────────── #6 Gunchogo, the 13th ───────────────────────────── */
episode(6, 'A king who climbs off his wall', (e, T) => {
	const ARCHER = 'A Goguryeo Archer';
	const KING = 'The Goguryeo King';
	const remembers = T('Goguryeo remembers it too');
	remembers.html =
		'Goguryeo remembers it too, and differently, and for exactly as long. The boy from the wall lives to be old. He tells it to his grandsons, and they tell theirs.';
	remembers.ko = '고구려도 그것을 기억한다. 다르게, 그리고 꼭 그만큼 오래. 성벽 위의 그 소년은 늙도록 산다. 손자들에게 그 이야기를 하고, 손자들은 또 제 손자들에게 한다.';
	e.blocks = [
		T('marches north to Pyongyang'),
		T('', card('gyeonggeunchogo')),
		T('The north’s capital', kind('place')),
		T('Baekje at its height.', kind('map')),
		T('Baekje has the river, the coast and the sea roads east'),
		P(
			'What its king wants is the one thing Baekje doesn’t have: the north’s capital. One winter he takes thirty thousand men up the frozen roads to get it.',
			'임금이 원하는 건 백제에 없는 단 하나, 북쪽의 수도다. 어느 겨울 그는 군사 삼만을 이끌고 얼어붙은 길을 올라 그것을 가지러 간다.'
		),
		SC('The Wall', '성벽'),
		P(
			'On the wall of Pyongyang there is a Goguryeo boy with a bow and not enough arrows. Beside him, in the same frozen mud, is his king.',
			'평양 성벽 위에 활은 있고 화살은 모자란 고구려 소년 하나가 있다. 그 옆, 같은 언 진흙 위에 그의 임금이 있다.'
		),
		S(ARCHER, ['Majesty, get down— they’ve found the range—'], ['전하, 엎드리십시오— 저놈들 사정거리를 잡았습니다—']),
		S(
			KING,
			['So have we.', 'A king who climbs off his wall teaches the whole wall to climb off. Shoot.'],
			['우리도 잡았다.', '임금이 성벽에서 내려가면, 성벽 전체가 내려가는 법을 배운다. 쏴라.']
		),
		P(
			'The arrow that finds him isn’t aimed at anyone. It comes over the parapet the way rain does. He sits down in the mud as if he had decided to.',
			'그를 찾아온 화살은 누구를 겨눈 것도 아니다. 비가 오듯 성가퀴를 넘어온다. 그는 그러기로 마음먹은 사람처럼 진흙 위에 주저앉는다.'
		),
		S(KING, ['…Don’t tell them.', 'Not until they’ve gone home. Keep shooting.'], ['……알리지 마라.', '저놈들이 돌아갈 때까지는. 계속 쏴라.']),
		P(
			'The boy tells no one. The gate stays shut. Below it, the Baekje king hears the wailing start inside the walls, and knows exactly what that sound is.',
			'소년은 누구에게도 말하지 않는다. 성문은 닫힌 채다. 그 아래에서 백제 임금은 성 안에서 곡소리가 시작되는 걸 듣고, 그게 무슨 소리인지 정확히 안다.'
		),
		D(
			'gyeonggeunchogo',
			['That’s a king’s funeral.', '…Turn them around. We came for a city. We’re going home with something better.'],
			['저건 임금의 장례다.', '……돌려라. 성 하나 얻으러 왔지만, 그보다 나은 걸 갖고 돌아간다.']
		),
		T('The king of Baekje came with thirty thousand men', kind('quote')),
		P(
			'Back in the south they give him a chant, and the chant outlives everything else he won.',
			'남쪽으로 돌아가자 사람들은 그에게 구호 하나를 바친다. 그 구호는 그가 얻은 다른 모든 것보다 오래 산다.'
		),
		T('Restore the reign of the thirteenth Eraha.'),
		T('They will still be chanting that sentence'),
		remembers,
		B(
			'North, then, three hundred years on, to the snow and Goguryeo’s most frightening commander. First question: do you know what happens to traitors…?',
			'이제 북으로, 삼백 년 뒤의 눈 속으로, 고구려에서 가장 무서운 장수에게로. 첫 질문이다. 반역자가 어떻게 되는지 아느냐…?'
		)
	];
});

/* ───────────────────────────── #7 Commander Yeon ───────────────────────────── */
episode(7, 'Then nobody will miss it.', (e, T) => {
	const accuse = T('leaked our secrets to the enemy');
	accuse.en = ['They say you… leaked our secrets to the enemy.'];
	accuse.lines = ['네가… 우리 기밀을 적에게 흘렸다더구나.'];
	const reply = T('The barbarians always show more respect.');
	reply.en = ['Good. Then nobody will miss it.'];
	reply.lines = ['잘됐군. 그럼 아쉬워할 놈도 없겠다.'];
	const guards = T('The guards talk about him the way men talk about weather');
	guards.html =
		'The guards talk about him the way men talk about weather. “He’s a monster, you know. He’s made the Eastern Commandery the safest in the kingdom. The barbarians run if they hear his name.”';
	guards.ko =
		'경비병들은 날씨 얘기하듯 그를 입에 올린다. “저 사람 괴물이야, 알지? 동부 도호부를 나라에서 제일 안전한 데로 만들어 놨잖아. 오랑캐들은 이름만 들어도 도망간다니까.”';
	const wall = T('The outpost is also a building site.');
	wall.html =
		'The outpost is also a building site. Three summers ago, the Tang flattened Goguryeo’s pile of enemy bones. It is the same emperor who sent Silla’s new queen flowers with no scent. Goguryeo got the message. Now it builds a wall. A thousand li of it. When Yeon isn’t killing anybody, he walks it with a plumb line and kicks the crooked stones.';
	wall.ko =
		'초소는 공사장이기도 하다. 세 해 전 여름, 당이 고구려의 적군 뼈 무덤을 밀어 버렸다. 신라의 새 여왕에게 향 없는 꽃을 보낸 바로 그 황제다. 고구려는 알아들었다. 그래서 지금 성을 쌓는다. 천 리나. 연은 누굴 죽이지 않을 때면 다림줄을 들고 그 성을 걸으며 삐뚤어진 돌을 걷어찬다.';
	const village = T('A month before the Summit');
	village.html = village.html.replace('A month before the Summit', 'A month before the summons');
	village.ko = village.ko.replace('제가회의 한 달 전', '소집령이 오기 한 달 전');
	const cold = T('Liar. I’m cold too.');
	cold.en = [
		'Liar. I’m cold too.',
		'A king of ours died up here once. Baekje arrow. The wall held anyway.',
		'Remember it. Kings die, courts get tired, walls come down—',
		cold.en.at(-1)
	];
	cold.lines = ['거짓말 마라. 나도 춥다.', '우리 임금 한 분이 여기서 돌아가셨다. 백제 화살이었지. 그래도 성은 버텼다.', '기억해라. 왕은 죽고, 조정은 지치고, 성은 무너져도—', cold.lines.at(-1)];
	const surname = T('Gulgul grows up quiet.');
	surname.html = 'Gulgul grows up quiet. Years from now, Yeon will send him north to guard the marches and give him a surname to take along. Dae. Big, as big as the country.';
	surname.ko = '걸걸은 조용히 자란다. 훗날 연은 그를 북쪽 변경으로 보내며 성 하나를 붙여 준다. 대. 나라만큼 크라는 뜻이다.';
	const summons = T('The summons isn');
	summons.html = 'Back in that first winter, the summons comes. ' + summons.html;
	summons.ko = '다시 그 첫 겨울. 소집령이 온다. ' + summons.ko;
	const half = T('Half, son. Half.');
	half.en = ['I know. I sat in it for twelve years.', 'Your uncle chairs it now. He’ll be kind to you. That’s worse.', 'Half, son. Half.'];
	half.lines = ['안다. 내가 열두 해를 앉아 있었다.', '지금은 네 숙부가 그 자리를 맡고 있다. 너한테 다정하게 굴 거다. 그게 더 나쁘다.', '반만이다, 개소문아. 반만.'];

	e.blocks = [
		P(
			'Everyone in the north has a story about the Eternal General. None of them are bedtime stories.',
			'북쪽 사람이라면 누구나 영원의 대장군 이야기를 하나씩 안다. 자장가로 들려줄 만한 건 하나도 없다.'
		),
		T('', kind('map')),
		P(
			'This one starts in the snow, two winters after Silla crowned its queen. A young man is caught on the border and dragged to Commander Yeon, who is twenty-nine and holds the east in his father’s name.',
			'이 이야기는 눈 속에서 시작한다. 신라가 여왕을 세우고 두 번째 겨울이다. 국경에서 붙잡힌 청년 하나가 연 장군에게 끌려온다. 스물아홉, 아버지의 이름으로 동쪽을 쥔 사내다.'
		),
		T('', card('gesomun')),
		T('Do you know what happens to traitors, young man'),
		accuse,
		T('I have… no name.'),
		reply,
		T('It is over quickly, and it is not clean.'),
		guards,
		T('He claimed he had been born in water', kind('quote')),
		wall,
		T('The Burned Village', kind('scene')),
		village,
		T('Move.', (b) => b.kind === 'dialogue' && b.person === 'gesomun' && b.en.length === 1),
		T('A Mohe boy Yeon pulled out of the snow', card('gulgul')),
		...e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gulgul' && b.en[0] === '…'),
		T('Do you understand me.'),
		T('He does not. Yeon looks at him'),
		T('Guarding a house that’s already burned'),
		T('He hands the gloves down.'),
		T('', card('dosuryu')),
		T('You are taking him?'),
		T('Where do you think that boy is standing'),
		T('Opposite us, I should think.'),
		T('That is why I am taking him.'),
		T('He gives him the name'),
		T('The North Wall', kind('scene')),
		T('Years later, on the north wall'),
		T('Cold?'),
		T('No, sir.'),
		cold,
		surname,
		T('The Summons', kind('scene')),
		summons,
		T('', card('yeontaejo')),
		T('Take the seal. You sit in my place this year.'),
		T('Why do I have to go to Pyongyang?'),
		half,
		T('He promised his father half.')
	];
	// the two silent Gulgul beats sit between "Move." and "Do you understand me." — reorder to keep the exchange
	const i = e.blocks.findIndex((b) => b.kind === 'dialogue' && b.en?.[0] === 'Do you understand me.');
	const silent = e.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gulgul' && b.en[0] === '…');
	if (silent.length === 2) {
		e.blocks = e.blocks.filter((b) => !silent.includes(b));
		const j = e.blocks.findIndex((b) => b.kind === 'dialogue' && b.en?.[0] === 'Do you understand me.');
		e.blocks.splice(j, 0, silent[0]);
		e.blocks.splice(j + 2, 0, silent[1]);
	} else if (i < 0) throw new Error('#7 Gulgul beats');
	reanchor(e, { 'nameless-boy': 'A month before the summons' });
});

/* ───────────────────────────── #8 High Summit ───────────────────────────── */
episode(8, 'Then we’re two hundred years late', (e, T) => {
	const gate = T('He rides in at the red two-tier gate');
	gate.html = 'He rides in at the red two-tier gate, in his father’s place. Pyongyang already knows the sound of those hooves.';
	gate.ko = '그는 아버지 대신 붉은 이중 문루로 들어간다. 평양은 이미 그 발굽 소리를 안다.';
	const works = T('Goguryeo works like this. Five');
	works.html = 'Goguryeo works like this. Five commanders argue at the High Summit. The High Commander holds the first sword. The king has the last word.';
	works.ko = '고구려는 이렇게 돌아간다. 제가회의에서 대가 다섯이 다툰다. 막리지가 첫 칼을 쥔다. 마지막 말은 왕이 한다.';
	const lecture = T('You cannot buy a man who has already decided the price');
	lecture.en = ['You cannot buy a man who has already decided the price of your head.', 'I have watched how courts die. They starve the wall that is screaming, and fatten the wall that—'];
	lecture.lines = ['제 목값을 이미 정한 사내는 살 수 없소.', '조정이 죽는 꼴을 봤소. 비명 지르는 성벽은 굶기고, 아첨하는 성벽은—'];
	const rider = T('That night a rider finds him.');
	rider.html = 'That night, in the tent, a rider finds him. His wife’s time has come, and it has gone badly before.';
	rider.ko = '그날 밤, 천막에서 전령이 그를 찾는다. 아내의 해산이 시작됐다. 전에도 잘 안 된 적이 있다.';
	const room = T('Yeon’s wife labours');
	room.html =
		'He reaches the house after midnight. One lamp, one midwife, and the mother. On the wall hangs a painting of Samsin, the birth goddess, prayed at so often that the paint has gone pale where the hands touch it.';
	room.ko = '그가 집에 닿는 건 자정이 지나서다. 등불 하나, 산파 하나, 그리고 어머니. 벽에는 아이를 점지하는 여신, 삼신의 그림이 걸려 있다. 하도 빌어서 손이 닿는 자리마다 물감이 바랬다.';
	const steps = T('steps from the frame the way steam');
	steps.html = 'The painting does not stay paint. <b>Samsin</b> steps from the frame the way steam steps from a kettle, and lays a hand where mortal hands have failed.';
	steps.ko = '그림은 그림으로 남지 않는다. <b>삼신</b>이 주전자에서 김이 오르듯 액자에서 내려와, 사람의 손이 닿지 못한 곳에 손을 얹는다.';

	e.blocks = [
		P('Half, his father said. Yeon manages it until the second pot of tea.', '반만, 아버지는 그렇게 말했다. 연은 두 번째 차 주전자까지는 그럭저럭 해낸다.'),
		T('', kind('map')),
		gate,
		works,
		T('The meeting of the ka', kind('term')),
		T('The chamber is already loud when Yeon arrives'),
		T('I will be the “King for All”'),
		P(
			'He is not the first man this year to want to be king for all. He is the first to want it on a budget.',
			'올해 ‘모두를 위한 임금’이 되겠다는 사내가 그가 처음은 아니다. 예산 안에서 되겠다는 사내로는 처음이다.'
		),
		T('Then the Southern Command takes the next levy'),
		P(
			'The north wants horses. The west wants timber and iron. Both want them from Central, and both say so twice.',
			'북부는 말을 원한다. 서부는 목재와 쇠를 원한다. 둘 다 중부에서 받아 내고 싶어 하고, 둘 다 그 말을 두 번씩 한다.'
		),
		T('', card('gusesa')),
		T('Each front believes it is the only front'),
		T('I have been killing tribes so this room can argue'),
		T('Watch your tongue about foreign kings'),
		lecture,
		D(
			'yeongnyu',
			['Enough, Commander. We heard you the first time. The whole hall heard you the first time.'],
			['그만하게, 연 장군. 처음에 다 들었네. 온 전각이 처음에 다 들었어.']
		),
		T('Easy for the East to lecture'),
		T('Yeon’s hands are flat on the table.'),
		T('Listen to yourselves.'),
		T('we may have to name you a traitor'),
		T('Nephew. Sit down.'),
		T('Then keep your Summit.'),
		T('He walks out before it ends.'),
		T('Heaven above… help this foolish country'),
		P('The Tang keep notes on this room. Theirs are less polite.', '당은 이 방에 대해 기록을 남긴다. 그쪽 기록은 덜 점잖다.'),
		T('Their highest office is called Daedaero', kind('quote')),
		T('The Palace Yard', kind('scene')),
		T('In the yard the Eastern banners answer him anyway'),
		T('see how Pyongyang loves you'),
		T('The people have never once abandoned me'),
		D('dosuryu', ['So. That was half?'], ['그래서. 그게 반이냐?']),
		D('gesomun', ['That was a quarter. You should’ve heard what I didn’t say.'], ['그게 사분의 일이다. 안 한 말을 들었어야 해.']),
		T('The Summit wants the roof itemised.'),
		D(
			'gesomun',
			[
				'Gold to the Tang for quiet. Grain counted twice. A king who’d rather pay than ride.',
				'There was a time Goguryeo didn’t pay anybody, Dosuryu. Other kings paid us. Silla came begging on its knees, and we rode south and saved it.',
				'Now look at us.'
			],
			[
				'조용하게 해 달라고 당에 금을 바치고. 곡식은 두 번 세고. 말 타느니 돈 내겠다는 임금이고.',
				'고구려가 아무한테도 바치지 않던 때가 있었어, 도수류. 다른 임금들이 우리한테 바쳤지. 신라가 무릎 꿇고 빌러 왔고, 우리가 남으로 내려가 구해 줬다.',
				'그런데 지금 꼴을 봐라.'
			]
		),
		D('dosuryu', ['That was two hundred years ago.'], ['이백 년 전 얘기잖아.']),
		D('gesomun', ['Then we’re two hundred years late. Get the horses.'], ['그럼 이백 년 늦은 거지. 말 가져와.']),
		rider,
		T('Birth of Namseng', kind('scene')),
		room,
		T('This child alone'),
		steps,
		T('', card('samsin')),
		T('I will open the breath.'),
		T('So the first heir arrives under Samsin'),
		T('Heavier than it sounds.'),
		P(
			'He holds the boy up to the lamp and tells him the only bedtime story he knows: the one about the king who rode south and never counted grain.',
			'그는 아이를 등불 쪽으로 들어 올리고, 제가 아는 유일한 옛날이야기를 들려준다. 남으로 말을 달렸고 곡식 따위는 세지 않았던 임금 이야기다.'
		),
		B(
			'Once, Silla begged Goguryeo for an army, and Goguryeo came. To meet the king who answered, we go back two centuries…!',
			'한때 신라가 고구려에 군대를 빌었고, 고구려는 왔다. 그 부름에 답한 임금을 만나려면 이백 년을 거슬러 가야 한다…!'
		)
	];

	reanchor(e, {
		'five-banners': 'Half, his father said',
		'goguryeo-five-blocks': 'Half, his father said',
		'hs-pentagon': 'Half, his father said',
		'yeon-duel': 'The north wants horses',
		'namseng-birth-white': 'One lamp, one midwife, and the mother',
		'samsin-namseng-birth': 'One lamp, one midwife, and the mother',
		'samsin-life-office': 'One lamp, one midwife, and the mother',
		'samsin-open-desire': 'The painting does not stay paint'
	});
});

/* ───────────────────────────── #9 Gwanggaeto, the Great King ───────────────────────────── */
episode(9, 'Servants don’t decide when the master goes home', (e, T) => {
	const ENVOY = 'Silla’s Envoy';
	const open = T('Silla is drowning. An army');
	open.html = 'Silla is drowning. An army from across the sea is inside its walls, and its king has one move left.';
	open.ko = '신라가 가라앉고 있다. 바다 건너 온 군대가 도성 안에 있고, 신라 왕에게 남은 수는 하나뿐이다.';
	const asked = T('Silla had asked.');
	asked.html =
		'Fifty thousand horsemen come down and clear the peninsula in a season. Silla had asked. That’s the part everyone forgets. Then the horsemen don’t leave for fifty years.';
	asked.ko = '기병 오만이 내려와 한 철 만에 반도를 쓸어 낸다. 신라가 청했다. 다들 잊는 대목이다. 그리고 기병들은 오십 년 동안 떠나지 않는다.';
	const hostage = T('crown princes go north as hostages');
	hostage.html =
		'Silla’s crown princes go north as hostages. The first one is twelve. Silla’s court takes Goguryeo titles. Silla’s army takes Goguryeo orders. It lasts two generations. Silla does not forget it.';
	hostage.ko =
		'신라의 태자들이 볼모로 북으로 간다. 첫 번째는 열두 살이다. 신라의 조정이 고구려의 관작을 받는다. 신라의 군대가 고구려의 명을 받는다. 두 세대가 그렇게 흐른다. 신라는 그것을 잊지 않는다.';
	e.blocks = [
		open,
		T('', card('gwanggaeto')),
		T('Watch the red run south', kind('map')),
		SC('The Plea', '청원'),
		P(
			'His envoy rides north for nine days and kneels in the tent of a Goguryeo king who is twenty-six and has never lost.',
			'그의 사신은 아흐레를 북으로 달려, 스물여섯에 한 번도 져 본 적 없는 고구려 임금의 막사에 무릎 꿇는다.'
		),
		S(
			ENVOY,
			['The Wa are inside our walls, Great King. My king writes in his own hand.', '“Silla is your servant. Save your servant.”'],
			['왜가 우리 성 안에 들어와 있습니다, 대왕. 저희 임금께서 친필로 쓰셨습니다.', '“신라는 대왕의 종입니다. 종을 구해 주소서.”']
		),
		D('gwanggaeto', ['Servant. He wrote that word himself?'], ['종이라. 그 글자를 제 손으로 썼단 말이냐?']),
		S(ENVOY, ['…In his own hand.'], ['……친필입니다.']),
		D(
			'gwanggaeto',
			['Then I’ll come.', 'Tell him one thing more, so he hears it from me first. Servants don’t decide when the master goes home.'],
			['그럼 가 주마.', '하나 더 전해라. 나한테서 먼저 듣게. 주인이 언제 돌아갈지는 종이 정하는 게 아니다.']
		),
		P(
			'The Silla king reads the answer twice. The first half saves his kingdom. The second half he does not read aloud.',
			'신라 왕은 답장을 두 번 읽는다. 앞의 반이 그의 나라를 구한다. 뒤의 반은 소리 내어 읽지 않는다.'
		),
		T('A red sun. The three-legged crow'),
		asked,
		hostage,
		S('The Silla Court', ['They did save us.', 'So why are they still here?'], ['구해 준 건 맞지.', '그런데 왜 아직 여기 있나?']),
		P('His stele, naturally, remembers it more kindly.', '그의 비석은 물론 그 일을 더 너그럽게 기억한다.'),
		T('the five grains ripened in plenty', kind('quote')),
		T('Two hundred and forty years later'),
		B(
			'The prince who will beg has a son. Bupmin is fifteen now, and his uncle has one question: which rule will you break first…?',
			'언젠가 빌러 갈 그 왕자에게는 아들이 있다. 법민이 열다섯이 되었고, 외숙에게는 질문이 하나 있다. 어느 계율을 제일 먼저 어기겠느냐…?'
		)
	];
});

/* ───────────────────────────── second pass: grow the two stubs ───────────────────────────── */
function insertAfter(e, T, frag, blocks, pred) {
	const anchor = T(frag, pred);
	const i = e.blocks.indexOf(anchor);
	if (i < 0) throw new Error(`insertAfter ${frag}`);
	e.blocks.splice(i + 1, 0, ...blocks);
}

episode(6, 'I’d hate to walk this far for an empty one', (e, T) => {
	const PRINCE = 'The Crown Prince';
	insertAfter(e, T, 'What its king wants is the one thing', [
		SC('The Camp', '진영'),
		P(
			'The night before, the Baekje king sits by a fire below the wall with his son, the crown prince, who has never seen a city this big and is trying not to show it.',
			'그 전날 밤, 백제 임금은 성벽 아래 모닥불 곁에 아들과 앉아 있다. 태자는 이렇게 큰 성을 처음 보고, 티를 내지 않으려 애쓰는 중이다.'
		),
		S(PRINCE, ['They have a wall, Father. A real one. And a king on it.'], ['성벽이 있습니다, 아바마마. 진짜 성벽이요. 그 위엔 임금도 있고요.']),
		D(
			'gyeonggeunchogo',
			['Good. I’d hate to walk this far for an empty one.', 'Nobody from the south has ever stood on that wall. Our grandsons will want to know who was first.'],
			['잘됐다. 빈 성 보자고 이 먼 길을 왔으면 서운할 뻔했지.', '남쪽 사람이 저 성벽에 서 본 적은 한 번도 없다. 손자들이 누가 처음이었는지 알고 싶어 할 거다.']
		),
		S(PRINCE, ['And if he won’t come down?'], ['그 임금이 안 내려오면요?']),
		D('gyeonggeunchogo', ['Then he’s braver than I am, and we’ll find out what that’s worth.'], ['그럼 나보다 용감한 거지. 그게 얼마짜리인지 알게 되겠지.'])
	]);
	insertAfter(
		e,
		T,
		'We came for a city.',
		[
			P(
				'On the road south the crown prince asks why they didn’t take the city. His father points back down the column. The men are already singing about it.',
				'남쪽으로 돌아가는 길에 태자가 왜 성을 차지하지 않았느냐고 묻는다. 아버지는 뒤따르는 행렬을 가리킨다. 병사들은 벌써 그 일을 노래하고 있다.'
			)
		],
		kind('dialogue')
	);
});

episode(9, 'I’ll write it myself, so nobody else has to', (e, T) => {
	const ELDER = 'A Silla Elder';
	const KING = 'The Silla King';
	insertAfter(
		e,
		T,
		'Watch the red run south',
		[
			SC('The Burning Capital', '불타는 도성'),
			P(
				'The Silla king stands on his own wall and counts the sea-raiders’ fires. There are more every night. Below, in the hall, his court is arguing about pride.',
				'신라 왕은 제 성벽 위에 서서 바다 도적들의 불을 센다. 밤마다 늘어난다. 아래 전각에서는 조정이 체면을 두고 다투는 중이다.'
			),
			S(ELDER, ['If we ask the north, they will come. And then they will stay.'], ['북에 청하면 옵니다. 그리고 눌러앉습니다.']),
			S(KING, ['And if we don’t ask, the Wa stay. Which guest would you rather feed?'], ['안 청하면 왜가 눌러앉지. 어느 손님을 먹이고 싶은가?']),
			S(ELDER, ['Majesty, the letter will have to say… they’ll want a word. A low word.'], ['전하, 서신에는… 그쪽이 바라는 말이 있을 겁니다. 낮은 말이요.']),
			S(KING, ['I know the word. Bring the brush.', 'I’ll write it myself, so nobody else has to.'], ['그 말은 안다. 붓 가져와라.', '내가 직접 쓰마. 다른 누가 쓰지 않아도 되게.'])
		],
		kind('map')
	);
	const answer = T('Then I’ll come.');
	answer.en = ['Then they’ll come. Fifty thousand of them.', 'Tell him one thing more, so he hears it from me first. Servants don’t decide when the master’s horsemen go home.'];
	answer.lines = ['그럼 보내 주마. 오만이다.', '하나 더 전해라. 나한테서 먼저 듣게. 주인의 기병이 언제 돌아갈지는 종이 정하는 게 아니다.'];
	insertAfter(e, T, 'The Silla king reads the answer twice', [
		SC('The Horsemen', '기병'),
		P(
			'The horsemen come down out of the north like weather. From his wall the Silla king watches the raiders’ fires go out one by one. Then he watches the red banners come through his own gate, and keep coming.',
			'기병들이 날씨처럼 북에서 내려온다. 신라 왕은 성벽 위에서 도적들의 불이 하나씩 꺼지는 것을 본다. 그다음엔 붉은 깃발들이 제 성문으로 들어오는 것을 본다. 들어오고, 또 들어온다.'
		)
	]);
	const asked = T('Silla had asked.');
	asked.html = 'They clear the peninsula in a season. Silla had asked. That’s the part everyone forgets. Then the horsemen don’t leave for fifty years.';
	asked.ko = '그들은 한 철 만에 반도를 쓸어 낸다. 신라가 청했다. 다들 잊는 대목이다. 그리고 기병들은 오십 년 동안 떠나지 않는다.';
	insertAfter(e, T, 'crown princes go north as hostages', [
		P(
			'He goes with a pony and a tutor. At the border he asks how long. Nobody answers him, which is how he finds out.',
			'소년은 조랑말 한 필과 스승 하나를 데리고 간다. 국경에서 그는 얼마나 오래냐고 묻는다. 아무도 대답하지 않는다. 그렇게 그는 알게 된다.'
		)
	]);
});
