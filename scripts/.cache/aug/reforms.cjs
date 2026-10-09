// Royal Secretariat: Chunchu's Tang reforms as a scene at the Secretariat table.
// node scripts/.cache/aug/reforms.cjs [--dry]
const { replace, insertBefore, finish } = require('./lib.cjs');

const T = 'Royal Secretariat';
const say = (person, en, ko) => ({ kind: 'dialogue', person, en, lines: ko });

replace(T, /The chest of court robes from the west is opened at the new year/, {
	kind: 'p',
	html: 'What Chunchu brought home from Chang’an fits on one sheet. Jukji reads it out at the Secretariat table. Chunchu answers before he reaches the end of each line.',
	ko: '춘추가 장안에서 가져온 것은 종이 한 장에 다 들어간다. 죽지가 집사부 탁자에서 그것을 읽는다. 춘추는 죽지가 한 줄을 끝내기도 전에 답한다.'
});

insertBefore(T, (b) => b.kind === 'quote' && /Ode to Great Peace/.test(b.html), [
	say(
		'jukji',
		['First, address. In Chang’an only the emperor is “Your Majesty.”', 'So Her Majesty becomes “Your Highness.”'],
		['첫째, 호칭입니다. 장안에서는 ‘폐하’가 황제 한 분뿐이랍니다.', '그러니 우리 폐하께서는 ‘전하’가 되십니다.']
	),
	say(
		'chunchu',
		['Then she is Your Highness. A word is a cheap coat.', 'Let them see us wearing it.'],
		['그럼 전하시지. 말이란 값싼 옷일세.', '입고 있는 걸 보여 주면 되네.']
	),
	say(
		'jukji',
		['Second, the years. Taehwa is retired. From now on we count Yonghui.', 'The emperor’s years.'],
		['둘째, 연호입니다. 태화를 거두고, 이제부터는 영휘로 셉니다.', '황제의 해로 말입니다.']
	),
	say(
		'chunchu',
		['Taehwa. “Great Harmony.” A fine name. It never harmonised anything.', 'Retire it with honours.'],
		['태화라. 큰 화합. 좋은 이름이었지. 화합시킨 건 하나도 없었네만.', '예를 갖춰 거두게.']
	),
	say(
		'jukji',
		[
			'Third, dress. Tang robes and caps for every official, an ivory tablet in every hand.',
			'I once saw a camel driver in Chang’an better turned out than our whole—'
		],
		['셋째, 복식입니다. 모든 관리는 당의 관복과 관을 갖추고, 손에는 상아 홀을 듭니다.', '장안에서 본 낙타 몰이꾼 하나가 우리 조정 전체보다 잘 차려입었더군요—']
	),
	say('chunchu', ['Officials. Only officials.'], ['관리만. 관리만일세.']),
	say('jukji', ['…And the people?'], ['…백성은요?']),
	say(
		'chunchu',
		[
			'The people keep their own clothes.',
			'If the whole market starts dressing like Chang’an, someone in Chang’an will think he owns the market.'
		],
		['백성은 제 옷을 입네.', '저잣거리가 통째로 장안처럼 입기 시작하면, 장안의 누군가는 그 저잣거리가 제 것인 줄 알 걸세.']
	),
	say(
		'jukji',
		['Fourth. Chang’an asks, very politely, about our borders. Tribute. Garrisons—'],
		['넷째. 장안에서 아주 정중하게 묻습니다. 국경, 조공, 주둔군—']
	),
	say(
		'chunchu',
		['We send silk and poems. We keep the country.', 'Write it so they can’t tell which one I said louder.'],
		['비단과 시는 보내네. 나라는 우리가 갖고.', '어느 쪽을 더 크게 말했는지 모르게 적게.']
	),
	say(
		'jukji',
		['Fifth, the crowns. A court in Tang dress, they say, should not be seen in—'],
		['다섯째, 관입니다. 당의 옷을 입은 조정이라면 그런 걸 쓰고 나서면—']
	),
	say('chunchu', ['No.'], ['안 되네.']),
	say('jukji', ['I haven’t finished the—'], ['아직 다 말씀을—']),
	say(
		'chunchu',
		[
			'The crowns stay. Have you looked at them? Gold trees. Antlers. Little jade commas that ring when you nod.',
			'The emperor can have our calendar. He can’t have those.'
		],
		['관은 그대로 두네. 들여다본 적 있나? 금으로 만든 나무. 사슴뿔. 고개만 끄덕여도 짤랑거리는 곡옥.', '황제는 우리 달력을 가져가도 되네. 저건 안 되네.']
	),
	{
		kind: 'p',
		html: 'Jukji writes every answer down. The one about the crowns, he writes twice. On the first dawn of the new year, the whole court bows to the queen at once. Silla never bothered with that before. A law office opens beside the Secretariat. Every True Bone with a post now carries an ivory tablet. He holds it like a man who has been handed a live fish.',
		ko: '죽지는 대답을 모두 받아 적는다. 관에 대한 대답은 두 번 적는다. 새해 첫 새벽, 온 조정이 한꺼번에 여왕에게 절한다. 신라는 그런 수고를 해 본 적이 없다. 집사부 옆에 법을 맡는 관청이 문을 연다. 이제 벼슬 있는 진골은 모두 상아 홀을 든다. 산 물고기를 받아 든 사람처럼 쥐고서.'
	},
	{
		kind: 'p',
		html: 'Bupmin sails west with the queen’s ode woven into a length of silk. The emperor in Chang’an admires it extravagantly.',
		ko: '법민이 여왕의 송가를 짜 넣은 비단 한 필을 들고 서쪽으로 간다. 장안의 황제는 그것을 요란하게 칭찬한다.'
	}
]);

finish();
