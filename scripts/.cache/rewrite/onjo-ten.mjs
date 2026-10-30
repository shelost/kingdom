// One-shot: Onjo episode — Ten Attendants color, Buaak remonstrance, the split,
// Mahan friction+acceptance, Michuhol failure, Biryu deathbed, Sipje->Baekje.
import fs from 'node:fs';
const f = 'src/lib/data/story.json';
let t = fs.readFileSync(f, 'utf8');
const after = (anchor, block) => {
	const i = t.indexOf(anchor);
	if (i < 0) throw new Error('anchor missing: ' + anchor.slice(0, 50));
	if (t.indexOf(anchor, i + 1) >= 0) throw new Error('anchor ambiguous: ' + anchor.slice(0, 50));
	const end = t.indexOf('},', i) + 2;
	t = t.slice(0, end) + '\n\t\t\t\t\t' + block + ',' + t.slice(end);
};
const P = (en, ko) =>
	`{\n\t\t\t\t\t\t"kind": "p",\n\t\t\t\t\t\t"html": "${en}",\n\t\t\t\t\t\t"ko": "${ko}"\n\t\t\t\t\t}`;
const D = (who, lines, en, extra = '') =>
	`{\n\t\t\t\t\t\t"kind": "dialogue",${who}\n\t\t\t\t\t\t"lines": [\n${lines.map((l) => `\t\t\t\t\t\t\t"${l}"`).join(',\n')}\n\t\t\t\t\t\t],\n\t\t\t\t\t\t"en": [\n${en.map((l) => `\t\t\t\t\t\t\t"${l}"`).join(',\n')}\n\t\t\t\t\t\t]${extra}\n\t\t\t\t\t}`;
// A. Ten color after the packing-carts block
after(
	'will not explain it to a deer, a son, or a chronicle.',
	P(
		'Of the ten the records name two, and the other eight history keeps to itself. Ogan, who counts every cart twice and trusts nothing he has not kicked. Maryeo, who laughs at funerals and talks his way out of them. The eight walk behind them, carrying the things the records forgot.',
		'열 명 중 기록이 이름을 남긴 건 둘이다. 수레마다 두 번 세고, 발로 차 보지 않은 건 믿지 않는 오간. 장례식에서도 웃고, 말로 빠져나오는 마려. 나머지 여덟은 그 뒤를 걷는다. 기록이 잊은 짐을 지고.'
	)
);
// B. the four-directions remonstrance on Buaak, before Biryu smells the sea
after(
	'Biryu smells the salt before he sees it.',
	D(
		'\n\t\t\t\t\t\t"speaker": "Ogan",\n\t\t\t\t\t\t"gender": "m",',
		[
			'북쪽은 띠처럼 두른 강.',
			'동쪽은 성벽 삼을 높은 산. 남쪽은 기름진 들. 서쪽은 해자 삼을 바다.',
			'하늘이 여기를 요새로 만들었는데, 아무도 못 알아봤다. 여기에 세우시오.'
		],
		[
			'North, the river for a belt.',
			'East, high mountains for a wall. South, fat fields. West, the sea for a moat.',
			'Heaven made this place a fortress, and nobody else noticed. Build here.'
		]
	)
);
// C. the split, after Sosuno's refusal
after(
	'…Don’t ask me that.',
	P(
		'Eight of the ten stay on the mountain with Onjo. The youngest two go down to the sea with Biryu, because somebody has to make sure the elder prince eats. They promise to write. They don\u2019t.',
		'열 중 여덟은 산에 남아 온조와 함께한다. 막내 둘은 비류와 함께 바다로 내려간다. 큰 왕자가 밥은 챙겨 먹는지 누군가는 봐야 하니까. 편지 쓰겠다고 약속한다. 안 쓴다.'
	)
);
// D. Mahan + Michuhol + deathbed + rename, after the brothers-divide block
after(
	'and his line keeps it after him.',
	[
		P(
			'The land south of the river already has an owner. Mahan holds it, fifty-four small countries under one high king the Han histories call Jin. Onjo sends Maryeo with iron and salt, and instructions to bow lower than feels necessary.',
			'강 남쪽 땅에는 이미 주인이 있다. 마한이 쥐고 있다. 쉰네 개의 작은 나라들, 그 위에는 한나라 역사책이 진왕이라 부르는 높은 임금. 온조는 쇠와 소금을 들려 마려를 보낸다. 자존심 상할 만큼 절하고 오라는 당부와 함께.'
		),
		D(
			'\n\t\t\t\t\t\t"speaker": "A Mahan headman",\n\t\t\t\t\t\t"gender": "m",',
			['또 북쪽 사람이로구만. 저번에는 네 아비가 왔지.', '낮은 땅에 살아. 곡식은 바치고. 위로는 짓지 마.'],
			[
				'More northerners. Last time it was thy father.',
				'Take the low ground. Pay the grain. Nothing upward.'
			]
		),
		D(
			'\n\t\t\t\t\t\t"speaker": "Maryeo",\n\t\t\t\t\t\t"gender": "m",',
			['낮은 땅. 곡식. 위로는 아무것도.', '우리 왕자는 원래 낮게 사오. 겸손해서.'],
			[
				'Low ground. Grain. Nothing upward.',
				'My prince builds low anyway. He is modest.'
			]
		),
		P(
			'The Mahan villages watch Wirye\u2019s wall rise and decide these northerners know how to dig a ditch. They bring grain. They bring daughters. The glad following starts here, a hundred crossings before anyone counts them.',
			'마한 마을들은 위례의 담이 오르는 걸 보고, 이 북쪽 사람들이 도랑 팔 줄은 안다고 판단한다. 곡식을 가져온다. 딸들을 데려온다. 기꺼운 따름이 여기서 시작된다. 아무도 세기 전, 백 번의 건너옴보다 먼저.'
		),
		`{\n\t\t\t\t\t\t"kind": "scene",\n\t\t\t\t\t\t"label": "Michuhol",\n\t\t\t\t\t\t"ko": "미추홀"\n\t\t\t\t\t}`,
		P(
			'Michuhol is damp earth and salt water. The wells come up brackish. The stored grain sweats. Biryu\u2019s people cough through their first winter, and the youngest two of the ten write north letters they don\u2019t send.',
			'미추홀은 젖은 흙과 짠물이다. 우물은 짠물이 올라온다. 쌓아 둔 곡식은 땀을 흘린다. 비류의 백성은 첫겨울을 기침하며 난다. 열 중 막내 둘은 북으로 보낼 편지를 쓰고, 보내지 않는다.'
		),
		P(
			'In the second year Biryu walks back over the ridge to look at his brother\u2019s town. The wall is finished. The market is loud. Nobody is coughing. He stands outside the gate for a long time, and does not go in.',
			'이듬해 비류는 능선을 넘어 동생의 고을을 보러 온다. 담은 완성됐다. 장은 시끌벅적하다. 기침하는 사람이 없다. 그는 문밖에서 한참 서 있다. 들어가지 않는다.'
		),
		D(
			'\n\t\t\t\t\t\t"person": "biryu",',
			['바다가 거짓말을 했다, 동생아.', '그건 아무 데도 새기지 마라.'],
			['The sea lied, little brother.', 'Don\u2019t let them carve that on anything.']
		),
		D(
			'\n\t\t\t\t\t\t"person": "onjo",',
			['형. 문 열려 있어.', '처음부터 열려 있었어.'],
			['Hyung. The gate is open.', 'It has always been open.']
		),
		P(
			'They bury him facing the sea he wanted. His people walk north to Wirye with their carts, and the youngest two of the ten walk in front, crying and pretending it is the dust. Sipje grows by a hundred crossings at once.',
			'그가 원하던 바다를 보게 묻는다. 그의 백성은 수레를 끌고 북쪽 위례로 간다. 열 중 막내 둘이 앞에서 걷는다. 울면서 먼지 탓을 한다. 십제는 단숨에 백 번의 건너옴만큼 는다.'
		),
		P(
			'People keep coming \u2014 Mahan villages, river folk, Biryu\u2019s people \u2014 gladly, unforced. Ten crossings become a hundred. The joke Onjo made on the mountain finally fits, and Sipje, the land of ten, becomes Baekje, the land of a hundred crossings.',
			'사람들은 계속 온다. 마한 마을, 강마을, 비류의 백성. 기꺼이, 억지 없이. 열 번의 건너옴이 백 번이 된다. 온조가 산에서 하던 농담이 마침내 들어맞는다. 열의 땅 십제는 백 번 건너옴의 땅, 백제가 된다.'
		)
	].join(',\n\t\t\t\t\t')
);
fs.writeFileSync(f, t);
JSON.parse(t);
console.log('done, json ok');
