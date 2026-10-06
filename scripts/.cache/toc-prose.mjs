// New bilingual beats for the TOC restructure (restructure-toc.mjs).
// Block builders: chips for `person` dialogue are filled in by the restructure script.

export const p = (html, ko) => ({ kind: 'p', html, ko });
export const sc = (label, ko) => ({ kind: 'scene', label, ko });
export const moral = (html, ko) => ({ kind: 'moral', html, ko });
export const d = (person, en, lines) => ({ kind: 'dialogue', person, lines, en });
export const sp = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, lines, en });

// ——— The King for All ———

export const SUNDUK_BRIDGE = [
	p(
		'Which of the three it will be is settled the night before, in a pavilion off the pond, by six men and a brazier. By morning the palace has a name, and the name has to be dressed.',
		'셋 중 누가 될지는 전날 밤, 연못가 작은 정자에서 여섯 사내와 화로 하나가 정한다. 아침이 되자 궁에는 이름이 하나 생기고, 그 이름에 옷을 입혀야 한다.'
	)
];

export const COUNCIL_OPEN = [sc('The Night Before', '전날 밤')];

export const JINHEUNG_BEOPUN = p(
	'Near the end he shaved his head. The king who had put stones on four mountains put on a monk’s robe instead and took the name <b>Beopun</b> (法雲, Dharma Cloud), and his queen went into a nunnery beside him. The court kept calling him Majesty. He kept answering to the other thing.',
	'말년에 그는 머리를 깎았다. 네 산에 돌을 세운 왕이 대신 승복을 입고 <b>법운</b>(法雲), 법의 구름이라는 이름을 받았고, 왕비도 그 곁에서 비구니가 되었다. 조정은 계속 그를 전하라 불렀다. 그는 계속 다른 이름에 대답했다.'
);

export const JINHEUNG_ELDER_1 = {
	en: [
		'Jinheung… we called him the Cloud King. After the name he took at the end.',
		'A cloud has no border, you see. It goes where it likes, and for an afternoon the ground underneath is its ground.'
	],
	lines: [
		'진흥… 우리는 그분을 구름왕이라 불렀지. 마지막에 받은 그 이름 따라서.',
		'구름엔 경계가 없거든. 가고 싶은 데로 가고, 한나절은 그 아래 땅이 다 제 땅이야.'
	]
};

export const JINHEUNG_ELDER_2 = {
	en: [
		'It was, for about a year.',
		'Then you look at where the shade fell. Gwansan. The Han. Gaya.',
		'A cloud never asks whose field it’s raining on.'
	],
	lines: [
		'한 일 년은 칭찬이었지.',
		'그러다 그늘이 어디 드리웠는지 보게 돼. 관산. 한강. 가야.',
		'구름은 누구 밭에 비를 뿌리는지 묻지 않아.'
	]
};

export const PRINCE_EUIJA_OPEN = p(
	'In the spring of 632 King Mu does at last what Sabi has been betting on for years, and names his eldest son <b>Prince Euija (32)</b> Crown Prince of Baekje. Thirty-two is late for it. The prince already has more than fifteen sons, and the clans have had a long time to decide which of them they own.',
	'632년 봄, 무왕은 사비가 몇 해째 내기를 걸어 온 일을 마침내 한다. 맏아들 <b>의자 (32)</b>를 백제의 태자로 세운 것이다. 서른둘이면 늦다. 왕자에게는 이미 아들이 열다섯이 넘고, 가문들은 그중 누구를 제 것으로 삼을지 정할 시간이 넉넉했다.'
);

export const PRINCE_EUIJA_INVESTITURE = [
	d(
		'kingmu',
		['Crown Prince.', 'There. Now they have to bow to you first and complain about you second.'],
		['태자.', '됐다. 이제 저것들이 너한테 먼저 절하고, 흉은 그다음에 볼 게다.']
	),
	d(
		'euija',
		['They complained first for thirty-two years, Father.', 'I’ll take the bow.'],
		['서른두 해 동안 흉부터 봤지요, 아바마마.', '절은 받겠습니다.']
	)
];

export const NAMSENG_SCENE = [sc('Birth of Namseng', '남생의 탄생')];

// ——— The Five Principles ———

export const BUPMIN_EDITS = {
	date: { html: 'Silla, 641 — the spring Bupmin turns fifteen.', ko: '신라, 641년 — 법민이 열다섯이 되는 봄.' },
	intro: {
		html: '<b>Bupmin (15)</b> is old enough for the headband and too young to invent a country alone. His father is in the Council chamber collecting votes. His uncle keeps the yard.',
		ko: '<b>법민 (15)</b>은 머리띠를 맬 만큼은 컸고, 혼자 나라를 발명하기엔 아직 어리다. 아버지는 화백 회의실에서 표를 모으고 있다. 외숙이 연무장을 지킨다.'
	},
	fifteen: {
		en: [
			'Then make it true at fifteen.',
			'The Hwarang do not train for your father’s cleverness. They train for the hour the cleverness runs out.'
		],
		lines: ['그럼 열다섯에 참말로 만들어라.', '화랑은 네 아비의 꾀를 위해 닦는 게 아니다. 꾀가 바닥날 시각을 위해 닦는다.']
	},
	principles: {
		en: [
			'Loyalty to the sovereign.',
			'Filial duty to parents.',
			'Trust among friends.',
			'No retreat in battle.',
			'No needless killing.',
			'Bupmin — which one will you break first?'
		],
		lines: ['사군이충.', '사친이효.', '교우이신.', '임전무퇴.', '살생유택.', '법민아 — 너는 무엇을 제일 먼저 어길 것 같으냐.']
	},
	retreat: {
		en: [
			'…Retreat.',
			'When Gotaso rides too fast I always pull up first. Every time.',
			'If I am to be a king for all, I cannot be the boy who only follows.'
		],
		lines: [
			'…퇴각입니다.',
			'고타소가 말을 너무 빨리 몰면 제가 늘 먼저 고삐를 당겨요. 매번요.',
			'모두를 위한 임금이 되려면, 따라가기만 하는 아이여서는 안 됩니다.'
		]
	}
};

export const GRAND_ACADEMY = [
	sc('The Taehak', '태학'),
	p(
		'The <b>Taehak</b> (태학), the Grand Academy, has stood in the capital since the second year of King Sosurim, and it arrived in the same season as the first Buddha images from the Former Qin. The academy and the temple came over the river together and have shared the noble sons of Goguryeo ever since: the Five Classics in the morning, sutras after the midday meal, archery whenever the masters lose their voices.',
		'<b>태학</b>은 소수림왕 이 년부터 도성에 서 있었고, 전진에서 첫 불상이 건너온 것과 같은 철에 세워졌다. 학당과 절은 함께 강을 건너왔고, 그 뒤로 줄곧 고구려 귀족의 아들들을 나눠 가졌다. 아침에는 오경, 점심을 먹고 나면 불경, 스승들 목이 쉬면 활쏘기.'
	),
	p(
		'Yeon brings <b>Namseng (7)</b> to the gate himself, in riding boots, and does not take them off on the swept stone.',
		'연은 <b>남생 (7)</b>을 직접 문 앞까지 데려온다. 말 탈 때 신는 장화 그대로, 쓸어 놓은 돌바닥 위에서도 벗지 않는다.'
	),
	sp(
		'Taehak Master',
		'#8aafa0',
		[
			'Commander. The sons of the five commanderies begin with the Analects and the Lotus Sutra.',
			'As your own father did, if I remember the register.'
		],
		['대가. 오부의 자제들은 논어와 법화경으로 시작합니다.', '기록이 맞다면 대가의 선친께서도 그러셨지요.']
	),
	d(
		'gesomun',
		['The Analects, fine. A boy should know how to bow before he decides not to.', 'The sutra he can skip.'],
		['논어는 됐어. 사내라면 절하는 법은 알고 나서 안 할지 정해야지.', '불경은 빼.']
	),
	d('namseng', ['Father.', 'Is the Buddha not allowed?'], ['아버님.', '부처님은 안 되는 겁니까.']),
	d(
		'gesomun',
		['The Buddha’s fine. Fat, quiet, never asked me for anything.', 'It’s his landlords I mind.'],
		['부처는 괜찮다. 살찌고 조용하고, 나한테 뭘 달란 적이 없지.', '내가 싫은 건 그 땅 주인들이다.']
	),
	p(
		'The landlords are not a figure of speech. Half the good valley land between Pyongyang and the Amnok belongs to monasteries, and the monasteries belong, in every way that matters, to the great houses whose second sons run them. None of it pays a levy for the wall. Every spring Yeon writes to the Summit about this, and every spring the Summit thanks him for his piety.',
		'땅 주인은 말장난이 아니다. 평양에서 압록까지 좋은 골짜기 땅의 절반은 절 땅이고, 절은 중요한 모든 의미에서 둘째 아들들을 주지로 앉힌 대가문의 것이다. 그중 어느 것도 장성 부역을 내지 않는다. 연은 해마다 봄이면 이 일로 제가회의에 글을 올리고, 제가회의는 해마다 봄이면 그의 신심에 감사한다.'
	),
	p(
		'What he wants instead is the Way of Laozi, which is an odd thing for him to want, because the Tang emperors claim Laozi as their ancestor. Yeon has heard this and does not care. He has a sentence for it, the only one he ever repeats word for word.',
		'그가 대신 원하는 것은 노자의 도다. 그에게는 이상한 바람이다. 당 황실이 노자를 제 조상이라 우기니까. 연도 그 말을 들었고, 상관하지 않는다. 그에게는 이 일에 쓰는 문장이 하나 있다. 그가 토씨 하나 안 바꾸고 되풀이하는 유일한 말이다.'
	),
	d(
		'gesomun',
		[
			'A pot stands on three legs.',
			'Confucius is one. The Buddha’s two. We’re missing the third, and the pot’s tipping into the fire.'
		],
		['솥은 다리가 셋이다.', '공자가 하나, 부처가 둘. 셋째가 없으니 솥이 불 속으로 기울지.']
	),
	sp('Taehak Master', '#8aafa0', ['The third leg would be… Tang priests, Commander?'], ['그 셋째 다리가… 당의 도사들이란 말씀입니까, 대가?']),
	d('gesomun', ['The third leg is whatever doesn’t own a farm.'], ['셋째 다리는 농장 없는 놈이면 뭐든 된다.']),
	p(
		'Across the courtyard a monk named <b>Bodeok</b> has stopped sweeping. He is from the monastery at Banryong, which owns a great deal of farm, and he will remember the sentence longer than anyone else who hears it.',
		'마당 건너편에서 <b>보덕</b>이라는 승려가 비질을 멈췄다. 그는 반룡사 사람이고, 반룡사는 농장을 아주 많이 가졌다. 그날 그 말을 들은 누구보다 그가 오래 그 문장을 기억할 것이다.'
	),
	p(
		'The complaint reaches the High Commander’s table before Yeon has ridden home. Gusesa reads it at supper, between courses.',
		'연이 집에 닿기도 전에 그 불평은 막리지의 상에 올라간다. 구세사는 저녁상에서, 요리와 요리 사이에 그것을 읽는다.'
	),
	d(
		'gusesa',
		[
			'(mild, wiping his fingers) A Yeon telling monks what to own.',
			'My nephew collects enemies the way other men collect horses. At least horses eat less.'
		],
		['(손가락을 닦으며, 부드럽게) 연가가 중들한테 뭘 가지라 마라 하는군.', '내 조카는 남들이 말 모으듯 적을 모아. 말은 그나마 덜 먹는데.']
	),
	p(
		'Namseng is enrolled anyway. He learns the Analects first and best, and on the days the sutra master is ill he reads his father’s copy of the Daodejing, which has never been opened past the first page.',
		'남생은 어쨌든 입학한다. 그는 논어를 제일 먼저, 제일 잘 익히고, 불경 스승이 앓아누운 날에는 아버지의 도덕경을 읽는다. 첫 장 너머로는 한 번도 펼쳐진 적 없는 책이다.'
	)
];

export const DOSURYU_OPEN = [
	p(
		'Late in the year Dosuryu comes in without knocking, which he has done since Gesomun was small enough to lift by the collar, and without taking his boots off, which he has never done.',
		'그해 늦게 도수류가 문도 두드리지 않고 들어온다. 개소문이 멱살 잡아 들어 올릴 만큼 작았을 때부터 늘 그랬다. 장화도 벗지 않는다. 그건 처음이다.'
	),
	d('gesomun', ['Oi. Old man. Boots.'], ['어이. 영감. 신발.']),
	d('dosuryu', ['Shut up and sit down.', 'No — stay standing. You listen better standing.'], ['닥치고 앉아.', '아니, 서 있어. 넌 서 있을 때 말을 더 잘 듣더라.']),
	d(
		'dosuryu',
		[
			'His Majesty and your uncle. Three times this month, the same little room behind the audience hall.',
			'Nobody else in it. Not even a boy to pour.'
		],
		['폐하하고 네 숙부. 이번 달에만 세 번이다. 알현전 뒤 그 작은 방.', '딴 사람은 아무도 없었어. 술 따르는 아이조차.']
	),
	d('gesomun', ['So they drink together. Good for them.'], ['같이 마시는 거지. 좋겠네.']),
	d(
		'dosuryu',
		[
			'They don’t drink. That’s what’s wrong with it.',
			'Ever since you walked out of the Summit, your name comes up in that room. They mean to send you to the far end of the wall in the spring. And have you not come back from it.'
		],
		[
			'안 마셔. 그게 문제야.',
			'네가 제가회의에서 박차고 나간 뒤로 그 방에서 네 이름이 나와. 봄에 너를 장성 끝자락으로 보낼 작정이다. 그리고 거기서 안 돌아오게 할 작정이고.'
		]
	)
];

export const DOSURYU_CLOSE = [
	d(
		'dosuryu',
		[
			'Laugh. Go on.',
			'Your father laughed at the Summit for twelve years and came home grey. You haven’t got twelve years. You’ve got till spring.'
		],
		['웃어. 실컷 웃어.', '네 아버지는 열두 해를 제가회의 보고 웃다가 머리가 하얘져서 돌아왔다. 넌 열두 해 없어. 봄까지야.']
	),
	p('Yeon stops laughing. He does it all at once, the way a door shuts.', '연이 웃음을 멈춘다. 문이 닫히듯, 한 번에.'),
	d('gesomun', ['How many names on their list.'], ['그놈들 명단에 이름이 몇이야.']),
	d(
		'dosuryu',
		['One that I know of. Yours.', '…Why are you smiling like that? Stop it. I hate it when you do that.'],
		['내가 아는 건 하나. 너.', '…왜 그렇게 웃어? 그만둬. 너 그렇게 웃는 거 질색이다.']
	),
	d('gesomun', ['Then I’ll make a list too.', 'Mine’ll be longer.'], ['그럼 나도 명단을 만들지.', '내 건 더 길 거다.']),
	p(
		'Dosuryu goes out the way he came in, boots and all, and stands a long time in the yard before he can make himself mount. He has known the boy for thirty years. He knows exactly what kind of list it will be.',
		'도수류는 들어올 때처럼 장화 신은 채로 나가서, 한참을 마당에 서 있다가 겨우 말에 오른다. 그 아이를 안 지 서른 해다. 그게 어떤 명단일지 그는 정확히 안다.'
	)
];

export const EUIJA_PRINCES = [
	sc('The Princes', '왕자들'),
	p(
		'At the coronation feast the princes are seated by age, and the table has to be lengthened twice. <b>Yung (26)</b> sits nearest the king, as the eldest should, with a Satek cup-bearer at his elbow. <b>Tae</b>, <b>Hyo</b> and <b>Yun</b> come after him, each with a clan’s tutor standing behind his chair like a second shadow. Then the younger ones, and the younger ones after them, until the servants at the far end are pouring for boys who have not yet been given names worth carving.',
		'즉위 잔치에서 왕자들은 나이순으로 앉는데, 상을 두 번이나 이어 붙여야 한다. 맏이답게 <b>융 (26)</b>이 왕 가까이 앉고, 팔꿈치 곁에는 사택가의 술 시중이 있다. 그 뒤로 <b>태</b>, <b>효</b>, <b>연</b>. 저마다 의자 뒤에 가문의 스승이 두 번째 그림자처럼 서 있다. 그다음은 더 어린 아들들, 또 그다음 더 어린 아들들. 상 끝자락의 시종들은 아직 새길 만한 이름도 받지 못한 아이들에게 술을 따른다.'
	),
	d(
		'euija',
		[
			'Look at that table! The thirtieth Eraha left me a country. I made a second one out of sons.',
			'Count them, Seongchung. Go on. I lose track after thirty.'
		],
		['저 상 좀 봐라! 서른 번째 어라하께선 나라를 하나 남기셨지. 나는 아들로 나라를 하나 더 만들었다.', '세어 봐라, 성충. 어서. 나는 서른 넘어가면 헷갈려.']
	),
	d(
		'seongchung',
		[
			'Forty-one, Majesty. If the two born this spring are counted.',
			'…And each of them will need a chair, one day. There are only so many chairs, and—'
		],
		['마흔하나입니다, 전하. 올봄에 난 둘까지 치면.', '…그리고 언젠가는 저마다 자리가 하나씩 필요할 겁니다. 자리는 정해져 있는데, 그…']
	),
	d('euija', ['Then we’ll build more chairs. Or empty some.', 'Pung! Where’s Pung?'], ['그럼 자리를 더 만들지. 아니면 몇 개 비우든가.', '풍아! 풍이 어디 있느냐?']),
	p(
		'<b>Prince Pung (17)</b> stands. He is the quiet one, the one with the good handwriting, and he already knows what is coming because his mother told him the night before, crying into his collar.',
		'<b>풍 왕자 (17)</b>가 일어선다. 말수 적고 글씨 잘 쓰는 아들. 무슨 말이 나올지 그는 이미 안다. 어젯밤 어머니가 그의 옷깃에 얼굴을 묻고 울면서 말해 주었으니까.'
	),
	d(
		'euija',
		[
			'The East wants a prince of Baekje at its court, to show the world how close we are. You’re going.',
			'Learn their poems. Drink their wine. Don’t marry anyone I’ll have to go to war over.'
		],
		[
			'왜가 백제 왕자를 제 조정에 두고 싶어 한다. 우리 둘이 얼마나 가까운지 세상에 보이고 싶은 게지. 네가 가거라.',
			'그쪽 시를 배우고, 그쪽 술을 마셔라. 내가 전쟁까지 치러야 할 여자랑은 혼인하지 말고.'
		]
	),
	d('pung', ['As Your Majesty commands.', '…For how long?'], ['분부 받들겠사옵니다.', '…얼마나 오래이옵니까.']),
	d(
		'euija',
		['Until I need you.', 'Ha! Don’t look like that. It’s a compliment. Nobody sends a prince he doesn’t mean to want back.'],
		['내가 너를 필요로 할 때까지.', '하! 그런 얼굴 하지 마라. 칭찬이다. 다시 찾을 생각 없는 왕자를 보내는 놈은 없어.']
	),
	p(
		'Twenty years later his father is a prisoner in Chang’an and Baekje sends for him after all. Nobody at the feast would have believed it, Pung least of all.',
		'스무 해 뒤, 그의 아버지는 장안의 포로가 되고 백제는 정말로 그를 부르러 온다. 잔치 자리의 누구도 믿지 않았을 일이다. 풍이 제일 믿지 않았을 것이다.'
	)
];

export const YUNCHUNG_OPEN = [
	p(
		'That winter Euija sends for <b>Yunchung</b>, and nobody from the eight houses is told. Yunchung is a general from a family too small to keep a clan tutor. He has held the Silla frontier for eleven years by doing exactly what he says he will do, which the Assembly finds tiring.',
		'그해 겨울 의자는 <b>윤충</b>을 부르고, 여덟 가문 누구에게도 알리지 않는다. 윤충은 가문 스승을 둘 만큼 크지 않은 집안의 장수다. 그는 열한 해 동안 신라 국경을 지켰다. 하겠다고 한 일을 꼭 그대로 해서인데, 대신회의는 그게 피곤하다.'
	),
	d(
		'euija',
		['Sit, General. No, the good cushion. Take it before I change my mind.', 'Tell me. Who rules Baekje?'],
		['앉게, 장군. 아니, 그 좋은 방석. 내 마음 바뀌기 전에 깔고 앉아.', '말해 보게. 백제는 누가 다스리나?']
	),
	d('yunchung', ['Your Majesty does.', 'On paper.'], ['전하께서 다스리십니다.', '문서상으로는요.']),
	d('euija', ['Ha! And off paper?'], ['하! 문서 밖에서는?']),
	d(
		'yunchung',
		[
			'Off paper, the Rock does. And whoever rubs the brine on it.',
			'The eight houses pick the Premier, the Premier picks the ministers, and the ministers send me the grain late. They pay my men. My men know it.'
		],
		[
			'문서 밖에서는 바위가 다스립니다. 그리고 그 바위에 소금물 바르는 자들이요.',
			'여덟 가문이 좌평을 고르고, 좌평이 대신들을 고르고, 대신들이 제게 군량을 늦게 보냅니다. 제 군사들 녹은 그쪽이 주니, 군사들도 압니다.'
		]
	),
	d(
		'euija',
		['So. How does a king get his country back off the Rock without a war at home?'],
		['그래. 왕이 안에서 피 안 보고 바위한테서 나라를 도로 찾으려면 어찌해야 하나?']
	),
	d(
		'yunchung',
		[
			'With a war abroad, Majesty.',
			'A king who wins a fortress owns the men who took it. The clans can’t vote on a victory. They can only show up to the feast.'
		],
		[
			'밖에서 전쟁을 하시면 됩니다, 전하.',
			'성을 하나 빼앗은 왕은 그 성을 빼앗은 군사들을 갖습니다. 가문들은 승리를 두고 표결할 수 없습니다. 잔치에 얼굴이나 내밀 수 있지요.'
		]
	),
	d(
		'euija',
		['Plainly put.', 'I like a man who says the ugly thing without a cushion under it. Even when he’s sitting on mine.'],
		['거 참 말 한번 시원하게 하네.', '나는 험한 말을 방석도 안 깔고 하는 사람이 좋아. 제가 내 방석에 앉아 있어도 말이야.']
	),
	p(
		'It is the first time in the reign that Euija says what he has decided before the Assembly hears it. By spring the Assembly will hear it anyway, in the form of a question he has already answered.',
		'의자가 대신회의보다 먼저 제 결정을 입 밖에 낸 것은 이 치세에서 처음이다. 봄이면 대신회의도 결국 듣게 된다. 그가 이미 답을 정해 둔 질문의 모양으로.'
	)
];

export const YUNCHUNG_CLOSE = [
	d(
		'euija',
		['Ha! Then go and be done for at Daeya, General. Ten thousand men.', 'Bring me back the fortress. And a story to go with it.'],
		['하! 그럼 대야 가서 끝장을 보게, 장군. 군사 만이야.', '성을 가져오게. 이야기도 하나 곁들여서.']
	),
	d('yunchung', ['Daeya by autumn, Majesty.'], ['가을까지 대야를 바치겠습니다, 전하.'])
];

export const CM_SCENES = {
	met: sc('How They Met', '첫 만남'),
	closed: sc('The Closed Months', '닫힌 달들'),
	birth: sc('Bupmin’s Birth', '법민의 탄생')
};

// ——— The Chunchu Era ———

export const GI_COUNCIL = [sc('The Harmony Council', '화백회의')];

export const GI_BRIDGE = [
	sc('Yumjong', '염종'),
	p(
		'Bidam does not recruit with speeches, whatever the Council thinks of him. He recruits with tea and long silences, and the first man to drink the tea is <b>Yumjong</b>, a True Bone whom nobody has ever accused of anything, because nobody has ever noticed him.',
		'평의회가 어떻게 여기든, 비담은 연설로 사람을 모으지 않는다. 차와 긴 침묵으로 모은다. 그 차를 처음 마신 사람은 <b>염종</b>이다. 아무도 그를 무엇으로 탓한 적이 없는 진골. 아무도 그를 눈여겨본 적이 없어서다.'
	),
	d('yumjong', ['How many men, Councillor?'], ['몇이나 됩니까, 상대등.']),
	d(
		'bidam',
		[
			'A paddy is not planted in a morning, Yumjong. One shoot, and then the next, and then the water does the rest.',
			'Enough for the Fortress of Radiance. By the time Her Majesty’s breath runs out.'
		],
		['논은 한나절에 심는 게 아니오, 염종. 모 하나, 또 하나, 그다음은 물이 알아서 하지.', '명활성을 채울 만큼. 폐하의 숨이 다하실 무렵까지는.']
	),
	d('yumjong', ['And the Marshal?'], ['장군은요?']),
	d(
		'bidam',
		[
			'Yushin stands where the Queen stands. He always has.',
			'When she is gone he will stand where the next one stands, and he will call it loyalty, and he will even be right.'
		],
		['유신은 폐하가 서신 자리에 서오. 늘 그랬지.', '폐하가 가시면 다음 분이 서는 자리에 설 거고, 그걸 충이라 부를 거요. 심지어 맞는 말이기도 하고.']
	),
	d(
		'yumjong',
		[
			'He’s not even Silla, you know.',
			'Gaya. His great-grandfather handed over Geumgwan with the keys still warm. The men in the outer works would like hearing that.'
		],
		['그 사람은 신라 사람도 아니잖습니까.', '가야요. 증조부가 금관을 열쇠도 식기 전에 넘겼지요. 외성 군사들이 들으면 좋아할 겁니다.']
	),
	p(
		'Bidam’s beads stop. He has said the word to Yushin’s face a hundred times on the yard, and Yushin has laughed every time. He has never heard it said like this, by a man who means it as a door.',
		'비담의 염주가 멈춘다. 연무장에서 유신의 얼굴에 대고 그 말을 백 번은 했고, 유신은 그때마다 웃었다. 그 말을 문으로 쓰려는 사내의 입에서 이렇게 나오는 것을 들은 적은 없다.'
	),
	d(
		'bidam',
		['…Careful, Yumjong.', 'A word you shout at a man’s gate comes back to your own. Gaya.'],
		['…조심하오, 염종.', '남의 대문에 대고 외친 말은 제 집으로 돌아오는 법이오. 가야라.']
	),
	p(
		'He says it once more, under his breath, as if testing the weight. The word is six hundred years old. To know why it can still cut a marshal of Silla, the story has to go back to a riverbank at Gimhae, to six golden eggs and a sky that looked down.',
		'그는 숨결 아래로 한 번 더 그 말을 해 본다. 무게를 달아 보듯. 그 말은 육백 년 묵었다. 그것이 왜 아직도 신라의 장군을 벨 수 있는지 알려면, 이야기는 김해의 강가, 여섯 개의 황금 알과 내려다보던 하늘까지 거슬러 가야 한다.'
	)
];

export const GYEOL_REMEMBERS = {
	html: 'That night Yushin remembers the first day of the rebellion, and it is not the way he has been telling it.',
	ko: '그날 밤 유신은 반란의 첫날을 기억한다. 그것은 그가 말해 온 방식이 아니다.'
};

export const JINDUK_OPEN = [
	p(
		'The crown was made for her cousin and has to be padded at the temples. Seungman sits very still while the goldsmith does it, because somebody told her once that Dukman never fidgeted, and she has believed it for forty years.',
		'왕관은 사촌 언니에게 맞춰 만든 것이라 관자놀이에 솜을 대야 한다. 금장이 그 일을 하는 동안 승만은 꼼짝 않고 앉아 있다. 덕만은 한 번도 몸을 비튼 적이 없다고 누가 말해 준 적이 있고, 그녀는 마흔 해 동안 그 말을 믿어 왔다.'
	)
];

export const JINDUK_COMPARE = [
	p(
		'The court does not mean to compare. It simply cannot stop. The old Queen read the peony seeds before they were planted. She heard frogs at Jade Gate Pond in midwinter and sent two thousand men to the exact valley where five hundred Baekje soldiers were hiding. She named the day of her own death and was right about it. The new Queen is gentle, and good at a loom, and has never once predicted anything.',
		'조정은 견주려는 게 아니다. 그냥 멈출 수가 없다. 선왕은 모란씨를 심기도 전에 읽어 냈다. 한겨울 옥문지에서 개구리 우는 소리를 듣고 이천 군사를 꼭 그 골짜기로 보내 숨어 있던 백제군 오백을 잡았다. 제가 죽을 날을 짚었고, 그 날이 맞았다. 새 여왕은 온화하고, 베틀을 잘 다루고, 무엇 하나 예언한 적이 없다.'
	),
	d(
		'courtmaid',
		['The old Queen would have known it was going to rain.', 'Shh.', '…She would have, though.'],
		['선왕마마셨으면 비 올 줄 아셨을 텐데.', '쉿.', '…아시긴 하셨겠지.']
	)
];

export const JINDUK_CLOSE = [
	d(
		'jinduk',
		['Chunchu.', 'Unni knew about the frogs before the frogs did. I can’t even tell when it’s going to rain.'],
		['춘추.', '언니는 개구리보다 먼저 개구리를 알았네. 나는 비 올 날도 모르는데.']
	),
	d(
		'chunchu',
		['Majesty, nobody asks the moon to be the sun.', 'They love it because it lets them look straight at it.'],
		['전하, 누구도 달더러 해가 되라 하지 않습니다.', '사람들이 달을 사랑하는 건 똑바로 쳐다보게 해 주기 때문이지요.']
	),
	d('jinduk', ['…You had that ready.'], ['…미리 준비해 둔 말이로군.']),
	d('chunchu', ['Since the funeral, Majesty.'], ['장례 때부터요, 전하.']),
	p(
		'At night she sits at a loom, because her hands want work that nobody will compare. Three years from now she will weave an ode to the Tang emperor into a length of silk, and it will do more for Silla than any prophecy her cousin made. Nobody at court thinks to compare that.',
		'밤이면 그녀는 베틀 앞에 앉는다. 누구도 견주지 않을 일을 손이 원해서다. 세 해 뒤 그녀는 당 황제에게 바치는 송시를 비단 한 필에 짜 넣을 것이고, 그것이 사촌 언니의 어떤 예언보다 신라에 더 큰 일을 해낼 것이다. 조정의 누구도 그것은 견주어 볼 생각을 하지 않는다.'
	)
];

// ——— The Fall of Euija ———

export const EXILE_SCENES = {
	blackRock: sc('Black Rock', '검은 돌'),
	fiveThousand: sc('Five Thousand', '오천')
};

export const SULMUN_NEXT = {
	html: 'The next story is told to him on a roof, because he is on a roof, mending it, and Yuri Dora has decided that a man who will not sit down can still listen.',
	ko: '다음 이야기는 지붕 위에서 들려진다. 그가 지붕 위에서 그것을 고치고 있기 때문이고, 유리도라는 앉지 않으려는 사내도 듣기는 한다고 판단했기 때문이다.'
};

export const BAEKJUTO_SCENE = [sc('Baekjuto and Socheon-guk', '백주또와 소천국')];
export const GAMEUNJANG_SCENE = [sc('Gameunjang', '가믄장아기')];
export const JACHEONGBI_SCENE = [sc('Jacheongbi', '자청비')];

export const GARDENER = [
	p(
		'Told in the orange grove, in the hour after the picking, when Gyebek has finally been persuaded to sit on a basket.',
		'귤밭에서, 따기가 끝난 뒤 한 시간, 귤 바구니에 앉으라는 설득에 그가 마침내 넘어갔을 때 들려진 이야기.'
	),
	d(
		'yuridora',
		[
			'There was a man called Sara Doryeong. Heaven sent for him to keep its flower field in the west.',
			'His wife was carrying. She couldn’t walk as fast as heaven wanted, so he left her at a rich man’s house to wait.'
		],
		[
			'사라도령이란 사내가 있었지. 하늘이 서쪽 꽃밭을 지키라고 그를 불렀어.',
			'아내는 배가 불러 있었고, 하늘이 바라는 만큼 빨리 걷지를 못했지. 그래서 사내는 어느 부잣집에 아내를 맡겨 두고 갔단다.'
		]
	),
	d('gyebek', ['How long was she to wait.'], ['얼마나 기다리기로 했습니까.']),
	d('yuridora', ['He didn’t say.', 'That’s the first mistake. Count it if you like.'], ['말 안 했지.', '그게 첫 번째 잘못이야. 세고 싶으면 세렴.']),
	p(
		'The rich man wanted her. Wonganghami said no, and went on saying no for fifteen years, through every kind of work a rich man can find for a servant who says no. Her son was born in that house and grew up a servant in it. His name was <b>Hallakgungi</b>.',
		'부자는 그녀를 원했다. 원강아미는 싫다 했고, 열다섯 해 동안 계속 싫다 했다. 싫다는 종에게 부자가 찾아낼 수 있는 온갖 일을 다 겪으면서. 그 집에서 태어난 아들은 그 집 종으로 자랐다. 그 이름이 <b>할락궁이</b>다.'
	),
	d(
		'yuridora',
		[
			'When he was old enough she told him where his father was. He went west that night.',
			'And the rich man, when he found the boy gone, killed the mother instead and threw her into a bamboo grove.'
		],
		['아이가 클 만큼 크자 그녀는 아비가 어디 있는지 일러 줬어. 아이는 그날 밤 서쪽으로 떠났고.', '부자는 아이가 없어진 걸 알고, 대신 어미를 죽여 대숲에 던졌지.']
	),
	d('gyebek', ['…She knew he would.'], ['…그녀는 그럴 줄 알았겠군요.']),
	d('yuridora', ['She knew.', 'She told him anyway.'], ['알았지.', '그래도 말해 줬어.']),
	p(
		'Hallakgungi found the flower field at the far end of the west, where the living maps run out, and his father at the gate of it. Sara Doryeong took him down the rows. Here, the flowers that put back bone, and flesh, and blood, and breath, and the soul last of all. Over there, the flowers that laugh a man to death, and the ones that make a house fight itself, and at the end of the row the one that ends a line altogether.',
		'할락궁이는 산 사람의 지도가 끝나는 서쪽 맨 끝에서 꽃밭을 찾았고, 그 문간에서 아버지를 찾았다. 사라도령은 그를 데리고 꽃밭 고랑을 걸었다. 여기는 뼈를, 살을, 피를, 숨을, 맨 마지막으로 넋을 되살리는 꽃. 저쪽은 사람을 웃다 죽게 하는 꽃, 한 집안이 저희끼리 싸우게 하는 꽃, 고랑 맨 끝에는 한 핏줄을 아주 끊어 버리는 꽃.'
	),
	d('gyebek', ['Which did he take.'], ['어느 것을 가져갔습니까.']),
	d(
		'yuridora',
		[
			'Both rows.',
			'He went back to that rich man’s house and held a little party. Laughing flower, fighting flower, and the last one. Then he went to the bamboo grove and found his mother’s bones, and put her back together in order. Bone, flesh, blood, breath, soul.'
		],
		[
			'두 고랑 다.',
			'그 부잣집으로 돌아가서 작은 잔치를 열었지. 웃음꽃, 싸움꽃, 그리고 마지막 꽃. 그다음 대숲에 가서 어머니 뼈를 찾아, 순서대로 맞췄어. 뼈, 살, 피, 숨, 넋.'
		]
	),
	d('gyebek', ['In order.', '…Good.'], ['순서대로.', '…잘했습니다.']),
	p(
		'Afterwards the son took the flower field over from his father and keeps it still. The island calls him the Gardener when it does not want to say his name, which is most of the time. The flowers that bring you back and the flowers that end you grow in the same rows, and he is the only one who knows which is which in the dark.',
		'그 뒤로 아들이 아버지에게서 꽃밭을 물려받아 지금도 지킨다. 섬은 그 이름을 입에 올리기 싫을 때 그를 꽃감관이라 부르는데, 대개 그렇다. 되살리는 꽃과 끝장내는 꽃이 같은 고랑에서 자라고, 어둠 속에서 어느 게 어느 것인지 아는 이는 그 하나뿐이다.'
	),
	d('gyebek', ['Did the father go home with them.'], ['아버지는 같이 돌아갔습니까.']),
	d(
		'yuridora',
		['No. He kept the gate till the boy was ready for it.', '…You ask the right questions in the wrong places, Turtle.'],
		['아니. 아들이 그 문을 맡을 만해질 때까지 지켰지.', '…거북아, 넌 맞는 질문을 꼭 엉뚱한 데서 하더라.']
	),
	moral(
		'The flower that brings back and the flower that ends grow in the same row. Learn which is which before you need them.',
		'되살리는 꽃과 끝내는 꽃은 같은 고랑에서 자란다. 필요해지기 전에 어느 게 어느 것인지 익혀 두어라.'
	)
];

export const DESCENT_NIGHTMARES = [
	sc('Nightmares', '악몽'),
	p(
		'He starts dreaming about the Rock of Politics. In the dream it is dry, and he is rubbing it with brine, and the brine will not stay. Every time he lifts the cloth the stone is dry again, and the eight elders are standing round it waiting for it to sweat.',
		'그는 정사암 꿈을 꾸기 시작한다. 꿈속에서 바위는 말라 있고, 그는 소금물을 문지르는데 소금물이 배지 않는다. 천을 들 때마다 돌은 다시 말라 있고, 여덟 원로가 그 둘레에 서서 바위가 땀 흘리기를 기다린다.'
	),
	p(
		'Some nights it is the white deer, come back out of the dark it was kept in, and too big for the hunting ground. Some nights it is a boat on the water with a man sitting very straight in the stern, not rowing, counting.',
		'어떤 밤은 흰 사슴이다. 가둬 두었던 어둠에서 다시 나왔는데, 사냥터에 들기엔 너무 크다. 어떤 밤은 물 위의 배 한 척이고, 고물에 한 사내가 아주 꼿꼿이 앉아 있다. 노는 젓지 않고, 센다.'
	),
	d(
		'euija',
		['(waking, to the dark) Who’s counting?', '…Who’s there. Light. Somebody bring a light!'],
		['(잠에서 깨어, 어둠에 대고) 누가 세고 있느냐?', '…거기 누구냐. 불. 누가 불 좀 가져와라!']
	),
	d('courtmaid', ['Majesty. It’s only us.', '…You were saying numbers again.'], ['전하. 저희뿐이옵니다.', '…또 숫자를 말씀하셨어요.']),
	d('euija', ['Wine.', 'No. Don’t water it. I can tell when you water it.'], ['술.', '아니. 물 타지 마라. 물 타면 다 안다.'])
];

// ——— The Fall of Baekje ———

export const YELLOW_MOUNTAIN_SCENE = [sc('Yellow Mountain Fields', '황산벌')];

export const SABI_NAKHWAAM = [
	sc('Falling Flower Rock', '낙화암'),
	p(
		'When the gate opens the palace women do not wait to be counted. They go out the back of the palace and up the ridge path to the cliff above the White River, where the rock drops straight into the water, and the soldiers coming up behind them find nobody at the top.',
		'성문이 열리자 궁의 여인들은 세어지기를 기다리지 않는다. 궁 뒤로 빠져나가 백마강 위 벼랑까지 능선 길을 오른다. 바위가 물속으로 곧장 떨어지는 곳이다. 뒤따라 올라온 군사들은 꼭대기에서 아무도 찾지 못한다.'
	),
	p(
		'The stories that gave Euija three thousand women give them this cliff as well, and three thousand is the number they say went over it, their skirts opening on the way down like petals. That is why the rock is called <b>Nakhwaam</b>, the Rock of Falling Flowers. Nobody who was there wrote down how many it really was. There was no one left on the cliff to count.',
		'의자에게 삼천 궁녀를 붙여 준 이야기들은 이 벼랑도 그들에게 준다. 그 위에서 떨어진 것이 삼천이었다고, 떨어지는 동안 치마가 꽃잎처럼 벌어졌다고 말한다. 그래서 그 바위를 <b>낙화암</b>, 꽃이 떨어진 바위라 부른다. 그 자리에 있던 누구도 실제로 몇이었는지 적지 않았다. 벼랑 위에는 셀 사람이 남아 있지 않았다.'
	)
];

export const UNGJIN_SCENE = { label: 'Ungjin', ko: '웅진성' };

export const UNGJIN_EDITS = {
	nets: {
		html: 'When Sabi fell the Tang drew five commanderies over Baekje like a net over a pond, and put the largest of them at Bear Ford on the Geum, <b>Ungjin</b>, where Euija had been handed over. So far the net catches mostly rebels.',
		ko: '사비가 떨어지자 당은 연못에 그물을 덮듯 백제 위에 도독부 다섯을 그었고, 그중 가장 큰 것을 금강 가 곰나루, <b>웅진</b>에 두었다. 의자가 넘겨진 곳이다. 아직까지 그 그물에 걸리는 것은 대개 반란군이다.'
	},
	paperwork: [
		[
			'Now the rebels are gone, into the White River or onto Yamato ships, and the Black Tortoise has time for what he actually came for, which is paperwork.',
			'The rebels come and go like weather, and between storms the Black Tortoise does what he actually came for, which is paperwork.'
		],
		[
			'이제 반란군은 백강 물속으로, 아니면 야마토의 배 위로 사라졌고, 현무에게는 그가 정말로 하러 온 일, 곧 서류를 할 시간이 생겼다.',
			'반란군은 날씨처럼 왔다 가고, 폭풍과 폭풍 사이에 현무는 그가 정말로 하러 온 일, 곧 서류를 한다.'
		]
	],
	edict: [
		[
			'The year before, an edict had come to Surabol naming King Munmu Grand Commander of the Gyerim Prefecture.',
			'Before long an edict comes to Surabol naming the new king, Munmu, Grand Commander of the Gyerim Prefecture.'
		],
		['그 전해, 문무왕을 계림주 대도독으로 삼는다는 칙서가 서라벌에 왔다.', '머지않아 새 왕 문무를 계림주 대도독으로 삼는다는 칙서가 서라벌에 온다.']
	]
};

export const UNGJIN_GAOZONG = [
	sc('Chang’an', '장안'),
	p(
		'In Chang’an the Third Emperor is told that Baekje is finished and that its king has died in the capital of a broken heart, and he takes out his father’s maps.',
		'장안에서 세 번째 황제는 백제가 끝났고 그 왕이 도성에서 상심하여 죽었다는 말을 듣는다. 그리고 아버지의 지도를 꺼낸다.'
	),
	d(
		'gaozong',
		[
			'Father went east three times and came home coughing.',
			'Baekje was the knife at Goguryeo’s back, and now we’re holding it — no. That sounds like something he would say. Write it down anyway.'
		],
		['아버님은 동쪽에 세 번 가셨다가 기침을 하며 돌아오셨지.', '백제는 고구려 등 뒤의 칼이었고, 이제 그 칼을 우리가 쥐었어 — 아니. 이건 아버님이 하실 말 같군. 그래도 적어 두게.']
	),
	d(
		'wuzetian',
		[
			'Then don’t say it like him. Say it like you.',
			'Four generals. One for each side of the map, so none of them can come home claiming he did it alone.'
		],
		['그럼 아버님처럼 말고 폐하처럼 하세요.', '장수 넷이요. 지도 네 귀퉁이에 하나씩. 그래야 아무도 혼자 했다고 우기며 돌아오지 못하죠.']
	),
	p(
		'That is how the Four Beasts are chosen: by a woman who knows how generals talk at banquets.',
		'사신(四神)은 그렇게 뽑힌다. 장수들이 잔치에서 무슨 말을 하는지 아는 여자에 의해.'
	),
	sc('The Four Beasts', '사신')
];

// ——— The Final Stand ———

export const REBELLION = [
	sc('Naesaji', '내사지성'),
	p(
		'Two summers after Sabi, Baekje is supposed to be finished. Nobody has told the fortresses. In the eighth month of 662 the remnants gather at <b>Naesaji</b>, a hill fort east of the old capital, and start doing the things a kingdom does when it has no king nearby: collecting grain, hanging collaborators, sending boys to watch the Silla roads.',
		'사비가 떨어지고 두 번의 여름이 지났으니 백제는 끝났어야 한다. 성들에는 아무도 그 말을 전하지 않았다. 662년 팔월, 잔당이 옛 도읍 동쪽의 산성 <b>내사지성</b>에 모여, 가까이에 왕이 없는 나라가 하는 일을 시작한다. 곡식을 걷고, 부역자를 매달고, 아이들을 보내 신라 길목을 지켜보게 한다.'
	),
	p(
		'Munmu names nineteen generals to deal with it. One of them is <b>Kim Jinju</b>, Grand General of the Tang Army Command, a True Bone of good family who led men at the Yellow Mountain and has a son serving in the emperor’s guard at Chang’an.',
		'문무왕은 이 일을 맡길 장군 열아홉을 지명한다. 그중 하나가 대당총관 <b>김진주</b>다. 좋은 집안의 진골로, 황산벌에서 군사를 이끌었고, 아들 하나가 장안의 황제 숙위로 가 있다.'
	),
	p(
		'Jinju sends word that he is ill. So does <b>Jinheum</b>, governor of Namcheon. Neither of them is ill. They stay at home through the whole of the campaign, eat well, receive visitors, and are seen at a gyuku match.',
		'진주는 병이 났다고 기별을 보낸다. 남천주총관 <b>진흠</b>도 그렇게 한다. 둘 다 아프지 않다. 그들은 싸움 내내 집에 머물며 잘 먹고, 손님을 맞고, 격구장에서 눈에 띄기까지 한다.'
	),
	sp(
		'Kim Jinju',
		'#8a7f6a',
		['Nineteen generals for one hill fort. They don’t need a twentieth.', 'Besides. The war’s over. Somebody should say so.'],
		['산성 하나에 장군이 열아홉이야. 스무 번째는 필요 없어.', '게다가 전쟁은 끝났잖나. 누군가는 그렇다고 말해야지.']
	),
	p(
		'Naesaji falls without him. Kim Heumsun takes it in a fortnight and reports it to the king in two lines, and then, because he is honest and it is his duty, he reports who was missing.',
		'내사지성은 그 없이 떨어진다. 김흠순이 보름 만에 성을 빼앗고 왕에게 두 줄로 보고한 뒤, 정직하고 그것이 직분이므로, 누가 빠졌는지도 보고한다.'
	),
	d('munmu', ['Ill.', 'The whole campaign. Both of them. And well enough for gyuku.'], ['병이라.', '싸움 내내. 둘 다. 격구 칠 만큼은 멀쩡하고.']),
	sp('Kim Jinju', '#8a7f6a', ['Majesty, the fever came and went. A man cannot choose his days—'], ['전하, 열이 오르내렸습니다. 사람이 앓는 날을 고를 수는—']),
	d(
		'munmu',
		['My father never had a day off from this war. My sister didn’t get to choose hers.', 'Take them out.'],
		['내 아버님은 이 전쟁에서 하루도 쉬신 적이 없다. 내 누이는 죽을 날을 고르지도 못했다.', '끌어내라.']
	),
	p(
		'Jinju and Jinheum are beheaded, and their households with them, down to the cousins. It is the first time Munmu kills his own nobility, barely a year into the reign, and after it nobody mistakes the new king for a soft one.',
		'진주와 진흠은 목이 베이고, 그 집안도 사촌까지 함께 죽는다. 문무가 제 귀족을 죽인 것은 이것이 처음이고, 왕위에 오른 지 겨우 한 해 남짓이다. 그 뒤로 누구도 새 왕을 무르다고 착각하지 않는다.'
	),
	p(
		'The annals are not finished with him. Eight years later the same pages have a Jinju sent to behead <b>Suse</b>, governor of Hanseong, who was caught arranging to go over to the Tang commandery in Baekje, and later tellings like that version better and give him the credit for putting down the rising at Naesaji as well. Either Silla had two men of the name, or a clerk killed him once and forgot. The one person who never mixes the versions up is his son.',
		'연대기는 그를 아직 놓아주지 않는다. 여덟 해 뒤의 같은 책에는, 백제 땅의 당 도독부로 넘어가려다 들킨 한성주 총관 <b>수세</b>의 목을 베러 가는 진주가 나온다. 뒷날의 이야기꾼들은 그쪽을 더 좋아해서, 내사지성의 난을 진압한 공까지 그에게 돌린다. 신라에 그 이름의 사내가 둘이었거나, 아니면 한 서기가 그를 한 번 죽여 놓고 잊은 것이다. 판본을 한 번도 헷갈리지 않는 사람은 그의 아들 하나뿐이다.'
	),
	p(
		'<b>Kim Punghun</b> is at Chang’an when the news comes, in the emperor’s guard, where the sons of vassal houses are kept. He hears it from a Tang officer who is sorry for him, which is worse. He asks for leave to go home for the mourning and is told, kindly, that he has no home to go to.',
		'소식이 왔을 때 <b>김풍훈</b>은 장안에 있다. 번국 집안의 아들들을 두는 황제의 숙위다. 그는 그 소식을 그를 딱하게 여기는 당나라 장교에게서 듣는다. 그게 더 나쁘다. 그는 상을 치르러 돌아가게 해 달라고 청하고, 돌아갈 집이 없다는 말을 친절하게 듣는다.'
	),
	d(
		'kimpunghun',
		['…Then I will wait.', 'The emperor’s ships go east sooner or later. I can wait for a ship.'],
		['…그럼 기다리지요.', '황제의 배는 언젠가 동쪽으로 갑니다. 배 한 척쯤은 기다릴 수 있습니다.']
	)
];

export const BETRAYAL_DOCHIM = [
	sc('Dochim', '도침'),
	p(
		'Before Boksin and the king there were Boksin and the monk. <b>Dochim</b> raised the first restoration banner at Juryu with him in the autumn Sabi fell, a monk who put down the begging bowl for a spear and named himself General of the Spirit Army. For a year the two of them held the west between them, and the Tang garrison at Sabi could not go out for water.',
		'복신과 왕 이전에, 복신과 승려가 있었다. 사비가 떨어진 가을, 주류성에서 그와 함께 처음 부흥의 깃발을 든 이가 <b>도침</b>이다. 바리때를 내려놓고 창을 든 승려, 스스로 영군장군이라 일컬은 자. 한 해 동안 둘은 서쪽을 나눠 쥐었고, 사비의 당군은 물 길으러도 나오지 못했다.'
	),
	p(
		'Then a Tang envoy came to the walls with a letter, and Dochim sent him back with it unread and a message that the General of the Spirit Army did not receive men of so small a rank. It was a good line. Boksin heard it and understood that the monk had begun to think of himself as the one in charge.',
		'그러다 당의 사신이 서신을 들고 성 아래 왔고, 도침은 그것을 읽지도 않은 채 돌려보내며, 영군장군은 그리 낮은 벼슬아치를 맞지 않는다고 전하게 했다. 근사한 말이었다. 복신은 그 말을 듣고, 그 승려가 자기가 우두머리라고 여기기 시작했음을 알았다.'
	),
	d(
		'dochim',
		['The Buddha gave me this army, Boksin. You only fed it.', 'Feed it well. It is going to Sabi.'],
		['이 군대는 부처님이 내게 주셨다, 복신. 자네는 먹이기만 했지.', '잘 먹이게. 사비로 갈 군대니까.']
	),
	d(
		'boksin',
		['Of course, General. Whatever the Spirit Army needs.', 'Supper tonight, then. Just the two of us. We’ll talk about Sabi.'],
		['물론입니다, 장군. 영군께 필요한 건 무엇이든.', '그럼 오늘 저녁 드시지요. 단둘이. 사비 이야기를 하십시다.']
	),
	p(
		'Dochim comes to supper. He does not leave it. By morning his men have been folded into Boksin’s army without a vote, and Prince Pung, newly crowned and still learning the names, is told that the monk has gone on a long retreat.',
		'도침은 저녁을 먹으러 온다. 그리고 돌아가지 못한다. 아침이 되자 그의 군사들은 아무 표결도 없이 복신의 군에 접혀 들어가 있고, 갓 왕관을 쓰고 아직 이름들을 외우는 중인 풍 왕자는, 그 승려가 긴 수행을 떠났다는 말을 듣는다.'
	),
	d('pung', ['A retreat. In the middle of a war.', '…I see. And who commands his men now?'], ['수행이라. 전쟁 한가운데서.', '…그렇구려. 하면 지금 그의 군사는 누가 거느리오?']),
	d('boksin', ['I do, Majesty. So that Your Majesty need never worry about it.'], ['제가 거느립니다, 전하. 전하께서는 그런 걱정 하실 일이 없도록.']),
	p('Pung remembers the answer. He has two years to think about it.', '풍은 그 대답을 기억한다. 그에게는 그것을 곱씹을 두 해가 있다.'),
	sc('The Jar', '항아리')
];

// ——— Silla-Tang War ———

export const ANSEUNG_QUARREL = [
	p(
		'The quarrel is about whether to fight. Geom Mojam wants to hold the Taedong and die on it if he has to. Anseung has seen what the Tang do to cities that hold, and would rather be a guest somewhere than a corpse in a capital.',
		'다툼은 싸울 것이냐 말 것이냐를 두고 벌어진다. 검모잠은 대동강을 지키다 죽어야 한다면 죽겠다고 한다. 안승은 버티는 성에 당이 무슨 짓을 하는지 보았고, 도성의 시체가 되느니 어딘가의 손님이 되는 편을 택한다.'
	),
	sp(
		'Geom Mojam',
		'#C30000',
		['Pyongyang has kings in its soil four hundred years deep. You want to leave them for a Silla guest room?'],
		['평양 땅에는 사백 년 묵은 임금들이 묻혀 계시오. 그분들을 두고 신라 사랑채로 가겠다는 거요?']
	),
	sp(
		'Anseung',
		'#d0362f',
		['The kings in the soil will keep. The four thousand households above it won’t.'],
		['땅속의 임금들은 기다려 주실 거요. 그 위의 사천 호는 못 기다리오.']
	),
	p(
		'That night Anseung has him killed. It is the first Goguryeo blood the revival spills, and it is spilled by Goguryeo.',
		'그날 밤 안승은 그를 죽인다. 부흥군이 흘린 첫 고구려 피이고, 그것을 흘린 것도 고구려다.'
	)
];

export const ANSEUNG_CLOSE = [
	p(
		'Silla settles him at <b>Geumma</b>, south of the old Baekje capital, in a town that was Baekje’s until ten years ago. Within the year he is styled King of Goguryeo; four years later, King of Bodeok, and in time he is given a Silla bride and a seat at Munmu’s feasts, well below the king’s.',
		'신라는 그를 옛 백제 도읍 남쪽 <b>금마저</b>, 열 해 전까지 백제 땅이던 고을에 앉힌다. 그해가 가기 전에 그는 고구려왕으로 불리고, 네 해 뒤에는 보덕왕이 되며, 때가 되자 신라의 신부와 문무의 잔치 자리를 얻는다. 왕의 자리보다 한참 아래다.'
	),
	d(
		'munmu',
		['A king of Goguryeo in Silla. The emperor will hate it.', 'Good. Give him a seal. A big one.'],
		['신라 안에 고구려 왕이라. 황제가 질색하겠군.', '좋다. 인장을 줘라. 큰 걸로.']
	)
];

export const WONSUL_MORE = [
	p(
		'Yushin goes to the king and asks, in so many words, for his son to be put to death. It is the most formal request he has made in fifty years of service, and he makes it standing.',
		'유신은 왕에게 가서, 말 그대로 아들을 죽여 달라고 청한다. 쉰 해를 섬기며 올린 청 가운데 가장 격식을 갖춘 청이고, 그는 그것을 선 채로 올린다.'
	),
	d(
		'munmu',
		[
			'Uncle. He was a lieutenant. Lieutenants follow.',
			'If I execute every man who lived through Seokmun, I won’t have an army left to lose the next one with.'
		],
		['외숙. 그 애는 비장이었습니다. 비장은 따라가는 자리입니다.', '석문에서 살아 돌아온 자를 다 죽이면, 다음 싸움에서 질 군사도 안 남습니다.']
	),
	d(
		'yushin',
		['Then do not execute him, Majesty.', 'But do not ask me to call him back into my house.'],
		['그럼 죽이지는 마십시오, 전하.', '다만 제 집에 다시 들이라고는 하지 마십시오.']
	),
	p(
		'Wonsul does not go home. He goes into the hill farms east of the capital and works another man’s fields under no name at all, which is the one punishment his father did not think to ask for. He does not write. Twice he comes as far as the road below his father’s gate and turns back at the sight of the lamp.',
		'원술은 집에 가지 않는다. 도성 동쪽 산골 농가로 들어가 이름도 없이 남의 밭을 간다. 아버지가 미처 청하지 못한 단 하나의 벌이다. 그는 편지를 쓰지 않는다. 두 번, 아버지 집 대문 아래 길까지 왔다가 등불을 보고 돌아선다.'
	),
	sp('Farmer', '#9cb380', ['You hold a hoe like it owes you money.', 'Soldier, were you?'], ['괭이를 무슨 빚쟁이 잡듯 쥐네.', '군인이었소?']),
	sp('Wonsul', '#5b7fc4', ['No.', '…Not a good one.'], ['아니오.', '…좋은 군인은 아니었소.'])
];

export const JISO = [
	sc('Lady Jiso', '지소부인'),
	p(
		'After the funeral Wonsul comes down from the hills at last and asks at the gate for his mother. <b>Lady Jiso</b> is King Muyeol’s daughter and Yushin’s widow, and she has already cut her hair for the nunnery.',
		'장례가 끝나고 원술은 마침내 산에서 내려와 대문에서 어머니를 청한다. <b>지소부인</b>은 무열왕의 딸이자 유신의 미망인이고, 이미 비구니가 되려고 머리를 잘랐다.'
	),
	sp(
		'Lady Jiso',
		'#c06a9a',
		['A woman has three to follow. Her father, her husband, her son.', 'My husband would not call you son. How am I to be your mother?'],
		['여자는 셋을 따른다 했다. 아비, 지아비, 아들.', '네 아버지가 너를 아들이라 부르지 않았는데, 내가 어찌 네 어미가 되겠느냐.']
	),
	p(
		'She does not come to the gate. The answer is carried out by a servant who cannot look at him. Wonsul stands in the road until dark and then goes back up into the hills. The record says only that he left weeping, and that he never stopped trying to give the afternoon back.',
		'그녀는 대문까지 나오지 않는다. 대답은 그를 똑바로 보지 못하는 종이 들고 나온다. 원술은 어두워질 때까지 길에 서 있다가 다시 산으로 올라간다. 기록은 그가 울며 떠났다는 것, 그리고 그 한나절을 되돌리려는 일을 끝내 멈추지 않았다는 것만 적는다.'
	)
];

export const INMUN_SHIP = [
	p(
		'Liu Rengui, the Black Tortoise, is given the army. Inmun is given the title, a new robe in the Silla colour, and a seat in the general’s ship that faces backwards, toward Chang’an. The Tang clerks are very particular about where a puppet sits.',
		'군대는 현무 유인궤에게 주어진다. 인문에게는 왕의 칭호와 신라 빛깔의 새 도포, 그리고 장군의 배에서 뒤쪽, 장안을 바라보는 자리가 주어진다. 당의 서기들은 꼭두각시가 어디 앉는지에 무척 까다롭다.'
	),
	d(
		'liurengui',
		['Your Majesty will forgive the accommodations. A king usually travels with more of his own people.', 'I expect they’ll come out to meet you.'],
		['전하, 처소가 이 모양이라 송구합니다. 임금은 대개 제 백성을 더 많이 거느리고 다니시지요.', '아마 마중들 나오겠지요.']
	),
	d(
		'inmun',
		[
			'They will come out to meet the army, General.',
			'…My brother taught me to swim in the Alcheon. I was six. He held my chin up the whole time and told me he wasn’t.'
		],
		['마중 나오는 건 군대일 겁니다, 장군.', '…형님이 알천에서 헤엄을 가르쳐 주셨지요. 저는 여섯 살이었습니다. 내내 제 턱을 받쳐 주시면서 안 받치고 있다고 하셨어요.']
	)
];

export const INMUN_CLOSE = [
	p(
		'Munmu reads the apology over twice before he sends it. He does not show it to anyone. The court never learns which of the beautiful phrases was the one that worked, and the king never says whether he wrote it for the emperor or for the brother on the ship.',
		'문무는 사죄문을 보내기 전에 두 번 읽는다. 아무에게도 보여 주지 않는다. 조정은 그 아름다운 구절 가운데 어느 것이 통했는지 끝내 모르고, 왕은 그것을 황제에게 쓴 것인지 배 위의 아우에게 쓴 것인지 끝내 말하지 않는다.'
	)
];

export const MAESO_WONSUL = [
	p(
		'One of the men who cut the picket lines that night is a lieutenant nobody in the capital has seen for three years. Wonsul comes down out of the hills when he hears where the Tang have gone, asks for the worst stretch of the line, and leads the horse-cut himself. When the king sends for him afterwards to give him rank, he will not take it. He says the rank belongs to the afternoon at Seokmun, and he has not paid that off yet.',
		'그날 밤 말뚝 줄을 끊은 사내들 가운데 하나는 세 해 동안 도성에서 아무도 보지 못한 비장이다. 원술은 당군이 어디로 갔는지 듣고 산에서 내려와 가장 험한 자리를 청하고, 말 끊기를 몸소 이끈다. 뒤에 왕이 벼슬을 주려고 그를 부르자 그는 받지 않는다. 그 벼슬은 석문의 한나절 몫인데, 그것을 아직 다 갚지 못했다고 한다.'
	)
];

export const HUMBLE_SERVANT_EDIT = [
	['Not long ago the king put', 'Nine summers ago the king put'],
	['얼마 전 왕은', '아홉 해 전 왕은']
];

// ——— The Seventh Invasion ———

export const LONGMEN_SCENE = [sc('Longmen Field', '용문')];
export const DONGMYUNG_SCENE = [sc('Dongmyung', '동명성왕')];
export const YODONG_FOOTNOTE = [sc('The Rest of the Line', '남은 성들')];
export const YODONG_EDIT = [
	['After that the line comes down like roof tiles.', 'Meanwhile the rest of the line comes down like roof tiles, and the Tang clerks file it in a single column.'],
	['그 뒤로 방어선은 기와처럼 차례로 흘러내린다.', '그사이 나머지 방어선은 기와처럼 차례로 흘러내리고, 당의 서기들은 그것을 한 줄에 몰아 적는다.']
];
