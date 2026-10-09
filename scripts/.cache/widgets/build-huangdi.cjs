// Builds scripts/.cache/widgets/huangdi.json — the rewritten "Huangdi (皇帝)" entry (chunchu-era).
// Reads the current entry from story.json (never writes it), reuses its blocks by index,
// splices in the new material, re-anchors images and validates.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const story = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/data/story.json'), 'utf8'));
const chapter = story.find((c) => c.id === 'chunchu-era');
const entry = chapter.entries.find((e) => e.title === 'Huangdi (皇帝)');
const orig = entry.blocks;
const clone = (x) => JSON.parse(JSON.stringify(x));

// The source snapshot this script was written against: guard against a drifted entry.
const EXPECT = {
	0: 'Shimin & Chunchu',
	28: 'Li Shimin.',
	135: 'west_ambassador',
	150: 'Gija & Wiman',
	189: 'Chunchu has watched one brush'
};
for (const [i, needle] of Object.entries(EXPECT)) {
	if (!JSON.stringify(orig[i]).includes(needle)) throw new Error(`entry drifted at block ${i}: expected “${needle}”`);
}

const CHIP = {
	chunchu: '#D8258C',
	taizong: '#c97a2e',
	wuzetian: '#9d7bd0',
	gaozong: '#b8935a',
	chusuiliang: '#8c7a5b',
	inmun: '#6fb0d8'
};

const O = (i) => clone(orig[i]);
const P = (html, ko) => ({ kind: 'p', html, ko });
/** rows: [ko, en] or [ko, en, zh, zhLatn] */
function D(person, rows) {
	const b = { kind: 'dialogue', chip: CHIP[person], person, lines: rows.map((r) => r[0]), en: rows.map((r) => r[1]) };
	if (rows.every((r) => r.length >= 4)) {
		b.zh = rows.map((r) => r[2]);
		b.zhLatn = rows.map((r) => r[3]);
	}
	if (person === 'chunchu') b.look = 'ambassador';
	return b;
}
const C = (o) => ({ kind: 'chengyu', ...o });
const DIAG = (diagram, step, title, caption, ko) => ({ kind: 'diagram', diagram, step, title, caption, ko });

/** Same dialogue block with some lines replaced (index → row) and/or rows dropped. */
function edit(i, { set = {}, drop = [], chip } = {}) {
	const b = O(i);
	const keys = ['lines', 'en', 'zh', 'zhLatn'].filter((k) => Array.isArray(b[k]));
	const n = b.lines.length;
	const rows = [];
	for (let j = 0; j < n; j++) {
		if (drop.includes(j)) continue;
		const r = set[j];
		rows.push(keys.map((k, ki) => (r ? r[ki] : b[k][j])));
	}
	for (const [ki, k] of keys.entries()) b[k] = rows.map((r) => r[ki]);
	if (chip) b.chip = chip;
	return b;
}
/** Split one dialogue block at line index `at` into two blocks. */
function split(i, at) {
	const a = O(i);
	const b = O(i);
	for (const k of ['lines', 'en', 'zh', 'zhLatn']) {
		if (!Array.isArray(a[k])) continue;
		a[k] = a[k].slice(0, at);
		b[k] = b[k].slice(at);
	}
	return [a, b];
}

// ─────────────────────────── chengyu cards ───────────────────────────

const CY_NAME = C({
	hanja: '名不正言不順',
	pinyin: 'míng bú zhèng, yán bú shùn',
	reading: '명부정 언불순',
	html: '“If the name is not correct, speech does not follow.” Call a thing by its right name first, or nothing said about it will hold.',
	ko: '“이름이 바르지 않으면 말이 순하지 않다.” 먼저 바른 이름으로 불러야, 그에 대해 하는 말이 선다.',
	origin: 'Analects (論語) 13.3',
	story:
		'Zilu asked Confucius what he would do first if the lord of Wei handed him the government. “Rectify the names,” said Confucius, and Zilu told him he was being impractical. Wei was ruled just then by a son who held the throne against his own father, so “father”, “son” and “lord” all meant the wrong thing.',
	storyKo:
		'자로가 공자에게, 위나라 임금이 정사를 맡기면 무엇부터 하시겠느냐고 물었다. 공자는 “이름을 바로잡겠다”고 했고, 자로는 세상 물정 모르는 말씀이라고 했다. 그때 위나라는 아버지를 막고 왕위에 앉은 아들이 다스리고 있었다. 아버지도, 아들도, 임금도 제 뜻을 잃은 나라였다.',
	person: 'chunchu'
});

const CY_KNOW = C({
	hanja: '知彼知己',
	pinyin: 'zhī bǐ zhī jǐ',
	reading: '지피지기',
	html: '“Know the other, know yourself: a hundred battles, no danger” (知彼知己，百戰不殆). Half of any war is knowing who you are fighting.',
	ko: '“상대를 알고 나를 알면 백 번 싸워도 위태롭지 않다(知彼知己 百戰不殆).” 싸움의 절반은 누구와 싸우는지 아는 것이다.',
	origin: 'Sunzi (孫子兵法) ch. 3, Attack by Stratagem (謀攻)',
	story:
		'Sunzi ends his chapter on strategy with a ladder. Know the enemy and yourself, and you are never in danger. Know only yourself, and you win one and lose one. Know neither, and every battle puts you in danger. Generals have quoted the top rung for a thousand years, and mostly lived on the second.',
	storyKo:
		'손자는 모공편 끝에 사다리 하나를 놓는다. 적을 알고 나를 알면 위태롭지 않다. 나만 알면 한 번 이기고 한 번 진다. 둘 다 모르면 싸울 때마다 위태롭다. 장수들은 천 년 동안 맨 윗칸을 인용했고, 대개는 둘째 칸에서 살았다.',
	person: 'chunchu'
});

const CY_LIPS = C({
	hanja: '脣亡齒寒',
	pinyin: 'chún wáng chǐ hán',
	reading: '순망치한',
	html: '“The lips gone, the teeth are cold.” Two neighbours who look separate stand or fall together.',
	ko: '“입술이 없으면 이가 시리다.” 따로인 듯한 두 이웃은 함께 서고 함께 쓰러진다.',
	origin: 'Zuo zhuan (左傳), Duke Xi yr. 5 (僖公五年)',
	story:
		'Jin asked the little state of Yu to lend it a road, so its army could strike Guo on the far side. Yu’s minister begged his duke to refuse: cheekbone and jaw hold each other up, and when the lips are gone the teeth go cold. The duke said Jin was family, and lent the road. Jin took Guo, and that winter, on the way home, it took the duke as well.',
	storyKo:
		'진(晉)나라가 작은 우나라에 길을 빌려 달라고 했다. 그 너머의 괵나라를 치려는 것이었다. 우나라 신하 궁지기는 거절하시라 간했다. 광대뼈와 턱은 서로 기대고, 입술이 없으면 이가 시리다고. 임금은 진나라는 한집안이라며 길을 내주었다. 진나라는 괵을 멸했고, 그해 겨울 돌아가는 길에 우나라 임금까지 잡아갔다.',
	person: 'chunchu'
});

const CY_FAR = C({
	hanja: '遠交近攻',
	pinyin: 'yuǎn jiāo jìn gōng',
	reading: '원교근공',
	html: '“Befriend the far, attack the near.” Make peace with distant powers and swallow your neighbours one at a time.',
	ko: '“먼 나라와 사귀고 가까운 나라를 친다.” 먼 세력과는 화친하고, 이웃은 하나씩 삼킨다.',
	origin: 'Shiji (史記) bk. 79, Fan Ju (范雎)',
	story:
		'Fan Ju, a fugitive from Wei smuggled into Qin, told its king to stop marching past his neighbours to fight far-off Qi. “Better to befriend the far and attack the near,” he said. “An inch won is Your Majesty’s inch.” Qin ate its neighbours one by one. The king’s great-grandson finished the meal and called himself Huangdi.',
	storyKo:
		'위나라에서 도망쳐 진나라로 숨어든 범수가 진나라 왕에게, 이웃을 지나쳐 먼 제나라를 치지 말라고 했다. “먼 나라와 사귀고 가까운 나라를 치느니만 못합니다. 한 치를 얻으면 그것이 왕의 한 치입니다.” 진나라는 이웃을 하나씩 먹어 들어갔다. 그 왕의 증손자가 식사를 마치고 스스로 황제라 불렀다.',
	person: 'taizong'
});

const CY_BOAT = C({
	hanja: '載舟覆舟',
	pinyin: 'zài zhōu fù zhōu',
	reading: '재주복주',
	html: '“Water carries the boat; water overturns the boat” (水則載舟，水則覆舟). The ruler floats on the people, and the people can sink him.',
	ko: '“물은 배를 띄우고, 물은 배를 뒤집는다(水則載舟 水則覆舟).” 임금은 백성 위에 떠 있고, 백성은 그를 가라앉힐 수 있다.',
	origin: 'Xunzi (荀子) ch. 9, The Regulations of a King (王制)',
	story:
		'Xunzi quotes it from an older book: the ruler is the boat, the common people are the water. Wei Zheng, the minister who contradicted the Second Emperor for seventeen years, said it to his face. The emperor liked it enough to teach it to his heir on a boat, and asked the boy if he understood boats. The boy said no.',
	storyKo:
		'순자는 더 오래된 책에서 이 말을 따온다. 임금은 배요, 백성은 물이다. 십칠 년 동안 황제에게 대든 신하 위징이 황제 면전에서 그 말을 했다. 황제는 그 말이 마음에 들어 배를 타던 날 태자에게 가르쳤고, 배가 무엇인지 아느냐고 물었다. 태자는 모른다고 했다.',
	person: 'taizong'
});

const CY_LEAF = C({
	hanja: '天子無戲言',
	pinyin: 'tiānzǐ wú xì yán',
	reading: '천자무희언',
	html: '“The Son of Heaven speaks no idle words.” Whatever a ruler says, even in play, is law once it is said.',
	ko: '“천자에게는 농담이 없다.” 임금이 한 말은 장난이라도, 입 밖에 나면 곧 법이다.',
	origin: 'Shiji (史記) bk. 39, Hereditary House of Jin (晉世家)',
	story:
		'King Cheng of Zhou, still a boy, cut a paulownia leaf into the shape of a jade tally and gave it to his little brother. “With this, I enfeoff you.” The court historian asked him to pick a day for the ceremony. “I was only playing,” said the king. “The Son of Heaven does not play,” said the historian. “What he says, the historians write.” The brother was enfeoffed in Tang.',
	storyKo:
		'주나라 성왕은 어렸을 때 오동잎을 홀 모양으로 잘라 아우 숙우에게 주며 “이것으로 너를 봉한다” 하고 놀았다. 사관 사일이 날을 잡아 봉하시라 청했다. “장난이었다.” 왕이 말하자 사일이 답했다. “천자에게는 농담이 없습니다. 말씀하시면 사관이 적습니다.” 숙우는 당(唐)에 봉해졌다.',
	person: 'taizong'
});

const CY_HEN = C({
	hanja: '牝雞之晨',
	pinyin: 'pìn jī zhī chén',
	reading: '빈계지신',
	html: '“When the hen crows at dawn, the house is ruined” (牝雞之晨，惟家之索). The oldest proverb men have for a woman who rules.',
	ko: '“암탉이 새벽에 울면 집안이 망한다(牝雞之晨 惟家之索).” 다스리는 여인을 두고 사내들이 하는 가장 오래된 속담.',
	origin: 'Book of Documents (書經), The Speech at Mu (牧誓)',
	story:
		'On the morning of the battle that ended the Shang, King Wu of Zhou stood before his army and quoted the ancients: the hen does not crow at dawn, and if she does, the house is finished. The Shang king, he said, listened only to a woman. Men have been quoting the line at women ever since, and some of the women have listened very carefully.',
	storyKo:
		'상나라를 끝낸 싸움의 아침, 주나라 무왕은 군사들 앞에서 옛사람의 말을 인용했다. 암탉은 새벽에 울지 않는다. 암탉이 새벽에 울면 집안이 망한다. 상나라 왕은 여인의 말만 듣는다고 했다. 그 뒤로 사내들은 이 말을 여인들에게 들이밀었고, 여인들 가운데 몇은 아주 주의 깊게 들었다.',
	person: 'wuzetian'
});

// ─────────────────────────── poems ───────────────────────────

const POEM_TAIZONG = {
	kind: 'poem',
	person: 'taizong',
	title: 'Given to Xiao Yu (賜蕭瑀)',
	hanja: '疾風知勁草，\n板蕩識誠臣。\n勇夫安識義，\n智者必懷仁。',
	ko: '모진 바람이 불어야 굳센 풀을 알고,*\n세상이 어지러워야 참된 신하를 안다.†\n날랜 사내가 어찌 의를 알랴,\n지혜로운 이는 반드시 어짊을 품는다.',
	html: 'The gale shows which grass is strong;*\nthe ruined age shows which minister is true.†\nWhat does a brave man know of right?\nThe wise man keeps benevolence close.',
	source: 'Quan Tangshi (全唐詩) bk. 1, Tang Taizong, Given to Xiao Yu (賜蕭瑀)',
	notes: [
		{
			mark: '*',
			html: '疾風知勁草: the first line is Emperor Guangwu’s, said to the one officer who stayed when the rest of his men drifted away (Hou Hanshu (後漢書) bk. 20, Wang Ba).',
			ko: '疾風知勁草: 첫 구는 광무제의 말이다. 부하들이 하나둘 떠날 때 홀로 남은 왕패에게 한 말(『후한서』 권20 왕패전).'
		},
		{
			mark: '†',
			html: '板蕩: “Ban” and “Dang” are two odes in the Book of Songs lamenting a ruined reign; together they mean an age of chaos. 誠臣 stands where 忠臣 would: 忠 was the personal name of the Sui founder’s father, and Tang writers still stepped around it.',
			ko: '板蕩: 『시경』 대아의 「판」과 「탕」, 무너진 치세를 탄식한 두 편으로, 합쳐서 난세를 뜻한다. 忠臣 대신 誠臣이라 쓴 것은 忠이 수 문제 아버지의 이름이라, 당의 문인들도 그 글자를 피해 갔기 때문이다.'
		}
	]
};

const POEM_CHUNCHU = {
	kind: 'poem',
	person: 'chunchu',
	title: 'Answering on the Emperor’s rhymes (奉和) · Chunchu’s own verse',
	hanja: '海隅生勁草，\n霜重見孤臣。\n不為狂風偃，\n心傾聖主仁。',
	ko: '바다 모퉁이에 굳센 풀이 자라니,*\n서리가 무거워야 외로운 신하가 보입니다.\n미친 바람에는 눕지 않되,†\n마음은 이미 성군의 어짊으로 기웁니다.',
	html: 'At the sea’s corner a stubborn grass grows;*\nonly under heavy frost does the lonely minister show.\nIt will not lie down for a mad wind,†\nbut its heart already leans to the Sage Lord’s benevolence.',
	notes: [
		{
			mark: '*',
			html: '海隅, “the sea’s corner”: the words Chunchu used for Silla when he knelt in the hall (臣之本國僻在海隅).',
			ko: '海隅(바다 모퉁이): 춘추가 전각에서 무릎 꿇고 신라를 일컬은 바로 그 말(臣之本國僻在海隅).'
		},
		{
			mark: '†',
			html: '偃, “to lie down”: Analects (論語) 12.19, “the gentleman’s virtue is the wind, the small man’s is the grass; let the wind pass over the grass and it must bend.” His grass refuses the mad wind and bows to the virtuous one. The rhymes 臣 and 仁 fall exactly where the emperor’s fell.',
			ko: '偃(눕다): 『논어』 12.19 “군자의 덕은 바람이요 소인의 덕은 풀이니, 풀 위로 바람이 불면 반드시 눕는다.” 그의 풀은 미친 바람에는 눕지 않고 덕의 바람에 눕는다. 운자 臣과 仁은 황제의 시와 꼭 같은 자리에 놓였다.'
		}
	]
};

// ─────────────────────────── diagrams ───────────────────────────

const DIAG_IMPERIAL = DIAG(
	'tang-imperial',
	'tribute',
	'All Under Heaven · 天下',
	'One man at the centre. Around him the court, then the prefectures, then the kings beyond the frontier, who take his calendar and his seals and send gifts back. Silla is in the outer ring. So is the banner.',
	'한가운데 한 사람. 그 둘레에 조정, 그 바깥에 주현, 다시 그 바깥에 변경 너머의 왕들. 그들은 황제의 달력과 인장을 받고 예물을 보낸다. 신라는 맨 바깥 고리에 있다. 저 현수막도 거기 걸려 있다.'
);

const DIAG_MILITARY = DIAG(
	'tang-military',
	'fubing',
	'The Garrison Army · 府兵',
	'Farmers on registered land, mustered in six hundred-odd garrisons. They take turns guarding the capital, march when a general is named for a war, and go home when it ends. The Ministry of War has every one of them by name.',
	'나라에 등록된 땅을 받은 농부들이 육백여 곳의 절충부에 편성된다. 번갈아 도성을 지키고, 전쟁에 장수가 임명되면 출정하고, 끝나면 집으로 돌아간다. 병부는 그들 하나하나의 이름을 쥐고 있다.'
);

const DIAG_EXAM = DIAG(
	'tang-exam',
	'exam',
	'Clans and the Examination · 氏族 · 科擧',
	'The old clans rank themselves by blood. The emperor ranks them again, by register. And beside that door the academy opens a second one: the examination, which asks what a man has read, not whose son he is.',
	'옛 가문들은 핏줄로 서열을 매긴다. 황제는 족보로 그 서열을 다시 매긴다. 그리고 국학은 그 문 옆에 두 번째 문을 연다. 누구의 아들이냐가 아니라 무엇을 읽었느냐를 묻는 과거(科擧).'
);

const DIAG_DEPTS = DIAG(
	'tang-departments',
	'flow',
	'Three Departments · 三省六部',
	'Three departments and six boards stand between a petition and a province. None of them can say no to the man at the top. Every road on the chart ends at the same brush.',
	'청원서와 고을 사이에 세 관청과 여섯 부서가 있다. 그중 어느 것도 맨 위의 사람에게 아니라고 하지 못한다. 도표의 모든 길은 같은 붓 하나에서 끝난다.'
);

// ─────────────────────────── the Qin flashback ───────────────────────────

const QIN_FLASHBACK = {
	kind: 'flashback',
	year: '-213',
	title: 'The First Emperor',
	blocks: [
		P(
			'Nearly nine hundred years earlier, a king of Qin has eaten six kingdoms in ten years, and “king” no longer fits him. He nails the two biggest words he can find together and becomes the first Huangdi. He would like it to last ten thousand generations.',
			'구백 년쯤 전, 진나라 왕이 십 년 만에 여섯 나라를 먹어 치우고 나니 ‘왕’이라는 말이 몸에 맞지 않는다. 그는 찾을 수 있는 가장 큰 두 글자를 못 박아 붙이고 첫 황제가 된다. 만세까지 가기를 바란다.'
		),
		P(
			'The scholars will not stop praising the old kings, and every word for the old kings is a word against the new one. His chancellor has a fix. Burn every history but Qin’s. Burn the Odes and the Documents in private hands. Whoever uses the past to fault the present dies, and his clan with him. Books on medicine, divination and planting may stay. Those are useful.',
			'선비들은 옛 임금 칭송을 멈추지 않고, 옛 임금을 기리는 말은 하나하나가 새 임금을 헐뜯는 말이다. 승상에게 해법이 있다. 진나라 기록 말고는 사서를 모두 태운다. 민간이 가진 시(詩)와 서(書)도 태운다. 옛것을 들어 지금을 그르다 하는 자는 죽이고, 그 일족도 함께 죽인다. 의약과 점복과 농사 책은 남겨 둔다. 그건 쓸모가 있으니까.'
		),
		P(
			'The order gives everyone thirty days. The next year, the emperor hears that the scholars in his capital have been talking about him.',
			'기한은 삼십 일. 이듬해, 황제는 도성의 선비들이 저를 두고 수군댄다는 말을 듣는다.'
		),
		{
			kind: 'quote',
			hanja: '於是使御史悉案問諸生，諸生傳相告引，乃自除犯禁者四百六十餘人，皆阬之咸陽，使天下知之，以懲後。',
			html: 'Thereupon he had the censors question every one of the scholars. The scholars informed on one another, and he himself struck off more than four hundred and sixty who had broken the prohibitions, and buried them all at Xianyang, so that all under heaven would know of it, as a warning to those who came after.',
			ko: '이에 어사를 시켜 여러 선비를 낱낱이 캐묻게 하니, 선비들이 서로 고발하여 끌어들였다. 이에 몸소 금령을 범한 자 사백육십여 명을 가려내어 모두 함양에 구덩이를 파 묻고, 천하가 이를 알게 하여 뒷사람을 징계하였다.',
			source: 'Shiji (史記) bk. 6, Basic Annals of the First Emperor of Qin (秦始皇本紀), yr. 35'
		},
		P(
			'His eldest son points out that the scholars only recite Confucius, and that the realm is barely settled. The emperor sends him north, to keep an eye on the general building the wall.',
			'맏아들이 선비들은 공자를 외울 뿐이고 천하는 이제 겨우 자리 잡았을 뿐이라고 아뢴다. 황제는 아들을 북쪽으로 보내, 성을 쌓는 장수를 감독하게 한다.'
		),
		P('Ten thousand generations, he had said. It lasts fifteen years.', '만세라고 했다. 십오 년 간다.')
	]
};

// ─────────────────────────── the episode ───────────────────────────

const blocks = [
	// ── The Son of Heaven ──
	{ kind: 'scene', label: 'The Son of Heaven', ko: '천자' },
	P(
		'Everyone on earth wants something from the Son of Heaven. Most of them bring tribute. Chunchu brings an offer.',
		'땅 위의 모든 이가 천자에게 바라는 것이 있다. 대개는 공물을 들고 온다. 춘추는 제안을 들고 온다.'
	),
	O(2),
	O(3),
	O(5),
	O(6),
	O(7),
	O(8),
	O(9),
	O(10),
	O(11),
	DIAG_IMPERIAL,
	O(12),
	O(13),
	O(14),
	O(15),
	O(16),
	O(17),
	O(18),
	O(19),
	O(20),
	O(21),
	D('chunchu', [
		['공자께서 이르셨지요. 이름이 바르지 않으면 말이 순하지 않다고(名不正則言不順).', 'Confucius said it: if the name is not correct, speech does not follow.'],
		['하여 감히 여쭙습니다. 폐하께서는 소신의 이름을 가지셨습니다.', 'So I dare to ask. Your Majesty has my name.'],
		['소신은 폐하를 무어라 불러야 바르겠사옵니까?', 'What is the correct name for me to call Your Majesty?']
	]),
	CY_NAME,
	P(
		'The hall stops breathing. Nobody in Chang’an says that name. Half of it is not even allowed on a banner. A clerk by the door shuts his eyes, the way men do just before a horse kicks.',
		'전각이 숨을 멈춘다. 장안에서는 아무도 그 이름을 입에 올리지 않는다. 그 반쪽은 현수막에도 못 오른다. 문가의 서기 하나가 눈을 감는다. 말이 뒷발질하기 직전에 사람들이 그러듯이.'
	),
	D('taizong', [
		['폐하라 부르면 되느니라. 천하가 다 그리 부른다.', 'You may call Us Majesty. Everyone under heaven does.', '稱陛下即可。天下皆如是稱之。', 'Chēng bìxià jí kě. Tiānxià jiē rúshì chēng zhī.'],
		['그 이름은 짐이 줄 때 받는 것이니라. 청한다고 받는 것이 아니고.', 'That name is received when We give it. Not when it is asked for.', '那名字，朕給時方得，不是求來的。', 'Nà míngzi, zhèn gěi shí fāng dé, bú shì qiú lái de.']
	]),
	edit(22, {
		set: {
			0: ['삼주시대부터, 삼한과 중원은 떼려야 뗄 수 없는 관계였습니다.', 'Since the age of the Three Zhou, Samhan and the Central Plain have been inseparable.']
		}
	}),
	O(23),
	D('taizong', [['짐에게 삼한을 가르치겠다는 것이냐.', 'You would teach Us Samhan?', '你要教朕三韓？', 'Nǐ yào jiāo zhèn Sānhán?']]),
	D('chunchu', [
		['가르치신 분은 따로 계시지요. 손자께서 지피지기면 백전불태(知彼知己 百戰不殆)라 하셨습니다.', 'Someone taught it long before me. Sunzi: know the other, know yourself, and a hundred battles hold no danger.'],
		['폐하께서는 안시에서 폐하 자신을 아셨습니다.', 'At Ansi, Your Majesty knew yourself.'],
		['성벽 위에 누가 서 있는지는 모르셨고요.', 'Your Majesty did not know who was standing on the wall.']
	]),
	CY_KNOW,
	P(
		'Several ministers discover something interesting on the floor. The emperor does not move for one long breath. Then he laughs, and the floor stops being interesting.',
		'대신 여럿이 바닥에서 흥미로운 무언가를 발견한다. 황제는 긴 숨 한 번 동안 꼼짝하지 않는다. 그러고는 웃는다. 바닥은 다시 재미없어진다.'
	),
	O(24),
	O(25),
	edit(26, { chip: CHIP.taizong }),
	D('chunchu', [
		['그럼 하나만 세어 주십시오, 폐하. 순망치한(脣亡齒寒)이라 하였습니다.', 'Then count one thing for me, Majesty. When the lips are gone, the teeth are cold.'],
		['신라가 입술이면, 요동이 이입니다.', 'If Silla is the lip, Liaodong is the tooth.']
	]),
	CY_LIPS,
	D('taizong', [
		['우나라 신하가 제 임금에게 한 말이로구나.', 'That is what a minister of Yu told his duke.', '此虞國之臣諫其君之言也。', 'Cǐ Yú guó zhī chén jiàn qí jūn zhī yán yě.'],
		['그 이야기가 어찌 끝나는지 아느냐, 춘추?', 'Do you know how that story ends, Spring-and-Autumn?', '春秋，你可知那故事如何收場？', 'Chūnqiū, nǐ kě zhī nà gùshi rúhé shōuchǎng?']
	]),
	D('chunchu', [['말을 안 들은 임금이 어찌 되는지는 압니다, 폐하.', 'I know how it ends for the duke who didn’t listen, Majesty.']]),
	P(
		'Both men know the rest of that story. Neither says it out loud, which is the most honest thing either of them does all evening.',
		'두 사람 다 그 이야기의 뒷부분을 안다. 둘 다 소리 내어 말하지 않는다. 그날 저녁 두 사람이 한 일 가운데 가장 정직한 일이다.'
	),

	// ── the go room ──
	O(27),
	P(
		'Chunchu opens in the far corner. Then he turns, and starts pressing the stones right beside his own.',
		'춘추는 먼 귀에서 시작한다. 그러고는 돌아서서, 제 돌 바로 옆의 돌들을 압박하기 시작한다.'
	),
	D('taizong', [
		['먼 데와 사귀고 가까운 데를 친다. 원교근공(遠交近攻)이로군.', 'Befriend the far, strike the near. You play it the way Qin did.', '遠交而近攻。你下得跟秦一樣。', 'Yuǎn jiāo ér jìn gōng. Nǐ xià de gēn Qín yíyàng.'],
		['진나라는 그걸로 천하를 먹었지.', 'Qin ate the world with it.', '秦以此吞天下。', 'Qín yǐ cǐ tūn tiānxià.']
	]),
	CY_FAR,
	D('chunchu', [['진나라는 그 천하를 얼마나 오래 가졌사옵니까, 폐하?', 'And how long did Qin keep the world, Majesty?']]),
	D('taizong', [
		['이름을 지어 붙일 만큼은.', 'Long enough to name it.', '夠給它起個名字。', 'Gòu gěi tā qǐ ge míngzi.'],
		['헌데 이 판에서 먼 데는 자네일세. 짐더러 먼 친구가 되어 자네 이웃을 쳐 달라는 게지.', 'But on this board the far one is you. You want Us to be the far friend who strikes your neighbours.', '可這盤棋上，遠的是你。你要朕做那遠方的朋友，替你打鄰居。', 'Kě zhè pán qí shàng, yuǎn de shì nǐ. Nǐ yào zhèn zuò nà yuǎnfāng de péngyou, tì nǐ dǎ línjū.'],
		['바둑에선 말일세, 먼 친구가 대개 귀까지 차지하네.', 'On a go board, Spring-and-Autumn, the far friend usually takes the corner as well.', '在棋盤上，春秋，遠方的朋友往往連角也拿走。', 'Zài qípán shàng, Chūnqiū, yuǎnfāng de péngyou wǎngwǎng lián jiǎo yě ná zǒu.']
	]),
	D('chunchu', [['그럼 소신이 귀를 먼저 두어야겠사옵니다.', 'Then I’ll have to play the corner first, Majesty.']]),
	O(35),
	O(36),
	O(37),
	O(38),
	O(39),
	O(40),
	O(41),
	O(42),
	O(43),
	O(44),
	O(45),
	O(46),

	// ── the machine ──
	O(47),
	O(48),
	P(
		'What the clerk does find, while he isn’t finding Saluzi, is everybody else. Chunchu has never seen a country that can lay its hand on any one of its soldiers by suppertime.',
		'삽로자를 못 찾는 동안 서기가 찾아낸 것은 나머지 모두다. 춘추는 저녁 먹기 전에 제 병사 아무나 하나를 손가락으로 짚어 낼 수 있는 나라를 처음 본다.'
	),
	DIAG_MILITARY,
	O(49),
	O(50),
	O(51),
	O(52),
	O(53),
	O(54),
	O(55),
	O(56),
	O(57),
	D('chunchu', [
		['옛날 진(晉)나라 사관 동호는, 재상이 임금을 시해했다고 적고 끝내 고치지 않았다지요. 동호지필(董狐之筆)이라고.', 'In the old state of Jin, they say, the historian Dong Hu wrote that the chief minister had killed his lord, and would not change a word. Dong Hu’s brush.']
	]),
	D('chusuiliang', [
		['동호는 훌륭한 사관이었지요.', 'Dong Hu was a fine historian.', '董狐是個好史官。', 'Dǒng Hú shì ge hǎo shǐguān.'],
		['그 진나라는 없어졌고요.', 'And that Jin is gone.', '那個晉，已經沒了。', 'Nàge Jìn, yǐjīng méi le.']
	]),
	O(58),
	D('chusuiliang', [['서가 조심하십시오, 전하. 이 방의 책은 전부 베낀 겁니다.', 'Mind the shelves, Prince. Every book in this room is a copy.', '殿下小心書架。這屋裏的書，都是抄本。', 'Diànxià xiǎoxīn shūjià. Zhè wū lǐ de shū, dōu shì chāoběn.']]),
	D('chunchu', [['무엇을 베꼈습니까?', 'A copy of what?']]),
	D('chusuiliang', [
		['탄 것을요.', 'Of what burned.', '抄那些燒掉的。', 'Chāo nàxiē shāo diào de.'],
		['처음 황제라는 말을 지어 쓴 사람은 기록을 조화롭게 하지 않았습니다, 전하. 그냥 태웠지요.', 'The first man to call himself Huangdi didn’t harmonize the record, Prince. He burned it.', '第一個自稱皇帝的人，可沒和諧史書，殿下。他直接燒了。', 'Dì-yī ge zìchēng huángdì de rén, kě méi héxié shǐshū, diànxià. Tā zhíjiē shāo le.']
	]),
	QIN_FLASHBACK,
	D('chunchu', [['그래서 폐하께서는 책을 태우지 않으시는군요.', 'So His Majesty doesn’t burn books.']]),
	D('chusuiliang', [
		['폐하께서는 책을 짓게 하십니다.', 'His Majesty commissions them.', '陛下命人修書。', 'Bìxià mìng rén xiū shū.'],
		['그 편이 싸고, 연기도 덜 나지요.', 'It’s cheaper, and there’s less smoke.', '省錢，煙也少。', 'Shěng qián, yān yě shǎo.']
	]),
	D('chunchu', [['선비들은요?', 'And the scholars?']]),
	D('chusuiliang', [['더 빨리 씁니다.', 'Write faster.', '寫得更快。', 'Xiě de gèng kuài.']]),
	O(59),
	P(
		'Chunchu asks one favour no envoy has asked in years. He would like to watch the rites to Confucius at the Imperial Academy, and sit in on the lectures. The clerks are so surprised that they say yes.',
		'춘추는 여러 해 동안 어느 사신도 하지 않은 부탁을 하나 한다. 국학에서 공자께 올리는 석전을 보고, 강론에도 앉아 보고 싶다는 것. 서리들은 너무 놀라서 그러시라고 한다.'
	),
	P(
		'Sons of dukes recite in one hall, sons of clerks in the next, and in the hall after that, sons of nobody in particular. They all study the same classics for the same examination. In time, a good enough answer can put any of them in a purple robe.',
		'한 강당에서는 공의 아들들이, 옆 강당에서는 서리의 아들들이, 그다음 강당에서는 누구의 아들도 아닌 아들들이 경전을 왼다. 모두 같은 경전으로 같은 시험을 준비한다. 답만 훌륭하면, 언젠가는 누구든 자줏빛 관복을 입을 수 있다.'
	),
	P(
		'The students’ favourite gossip is ten years old. The court drew up a register of the great clans and put an old family from the northeast first. The emperor sent it back. His own family is first now.',
		'학생들이 가장 좋아하는 소문은 십 년 묵은 것이다. 조정이 큰 가문들의 족보를 엮으면서 동북의 오래된 집안을 첫째로 올렸다. 황제는 그것을 돌려보냈다. 지금은 황제의 집안이 첫째다.'
	),
	DIAG_EXAM,
	P(
		'Chunchu was born one step below the throne, by his own council’s arithmetic, and has spent his life sitting anywhere but the chair. He watches a clerk’s son recite the Odes without one slip, and does not say a word for the rest of the afternoon.',
		'춘추는 제 나라 화백의 셈법으로 왕좌 한 계단 아래에서 태어났고, 평생 그 의자만 빼고 아무 데나 앉아 왔다. 그는 서리의 아들이 시경을 한 글자도 틀리지 않고 외는 것을 지켜보고, 그날 오후 내내 한마디도 하지 않는다.'
	),
	D('inmun', [['…아버님?', '…Father?']]),
	D('chunchu', [['공부해라, 인문아. 여기선 그게 핏줄보다 빠르다.', 'Study, Inmun. Here it’s faster than blood.']]),
	O(63),
	O(64),
	O(65),
	O(66),
	O(67),
	...(() => {
		const [a, b] = split(68, 1);
		a.lines.push('하늘에 해가 둘이 없고, 백성에게 임금이 둘이 없느니라(天無二日 民無二王). 해를 두고 표를 던지는 자는 없네.');
		a.en.push('There are not two suns in the sky, nor two kings over one people. Nobody takes a vote on the sun.');
		return [a, b];
	})(),
	O(69),
	O(70),
	O(71),
	D('chunchu', [['그럼 폐하, 배는 누가 뒤집사옵니까?', 'Then who overturns the boat, Majesty?']]),
	D('taizong', [
		['물이지. 승객이 아니라.', 'The water. Not the passengers.', '水。不是乘客。', 'Shuǐ. Bú shì chéngkè.'],
		['임금은 배요 백성은 물이라. 물은 배를 띄우기도 하고, 뒤집기도 하지.', 'The ruler is the boat and the people are the water. Water carries the boat, and water overturns it.', '君者舟也，庶人者水也。水則載舟，水則覆舟。', 'Jūn zhě zhōu yě, shùrén zhě shuǐ yě. Shuǐ zé zài zhōu, shuǐ zé fù zhōu.'],
		['짐의 늙은 신하 하나가 십칠 년 동안 아침마다 그 말을 했고, 짐은 하게 두었네. 옳은 말이었으니.', 'An old minister of Ours said it every morning for seventeen years, and We let him, because it was true.', '朕有個老臣，十七年來天天早上說這句，朕也由他說，因為說得對。', 'Zhèn yǒu ge lǎo chén, shíqī nián lái tiāntiān zǎoshang shuō zhè jù, zhèn yě yóu tā shuō, yīnwèi shuō de duì.'],
		['짐은 물은 두려워하네. 자네 삼촌들은 승객이야.', 'We fear the water. Your uncles are passengers.', '朕怕水。你那些叔伯，是乘客。', 'Zhèn pà shuǐ. Nǐ nàxiē shūbó, shì chéngkè.']
	]),
	CY_BOAT,
	O(72),
	DIAG_DEPTS,
	O(73),
	O(74),

	// ── gyuku with Li Zhi ──
	...[75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87].map(O),

	// ── The Six Steeds ──
	...Array.from({ length: 132 - 88 + 1 }, (_, k) => O(88 + k)),
	D('taizong', [
		['천자에게는 농담이 없다 하지 않던가. 천자무희언(天子無戲言).', 'The Son of Heaven makes no jokes. You know the saying.', '天子無戲言。你知道這話。', 'Tiānzǐ wú xì yán. Nǐ zhīdào zhè huà.'],
		['주나라의 어린 임금이 장난으로 오동잎을 잘라 아우에게 주었네. ‘이걸로 너를 봉한다.’', 'A boy-king of Zhou once cut a paulownia leaf into a tally and handed it to his little brother as a game. ‘With this, I enfeoff you.’', '周成王與叔虞戲，削桐葉為珪給他：「以此封若。」', 'Zhōu Chéngwáng yǔ Shūyú xì, xiāo tóngyè wéi guī gěi tā: “Yǐ cǐ fēng ruò.”'],
		['사관이 그걸 적었고, 아우는 나라를 받았지. 그 나라 이름이 당(唐)일세.', 'His historian wrote it down, and the brother got a country. It was called Tang.', '史官記下了，弟弟便得了一國。那國叫唐。', 'Shǐguān jì xià le, dìdi biàn dé le yì guó. Nà guó jiào Táng.']
	]),
	D('chunchu', [['…그럼 서기를 믿겠사옵니다, 폐하.', '…Then I’ll trust the clerk, Majesty.']]),
	CY_LEAF,
	O(133),

	// ── The Farewell Banquet ──
	{ kind: 'scene', label: 'The Farewell Banquet', ko: '전별연' },
	O(134),
	O(140),
	P(
		'It is a farewell banquet, so every official of the third rank and above must attend and look pleased. Halfway through, the emperor calls for brushes. In Chang’an, a banquet without verse is just dinner.',
		'전별연이라, 삼품 이상 관원은 모두 나와 즐거운 얼굴을 해야 한다. 연회가 반쯤 무르익자 황제가 붓을 가져오라 한다. 장안에서 시 없는 연회는 그냥 저녁밥이다.'
	),
	D('taizong', [
		['신라의 춘추에게 짐이 시 한 수를 내리노라. 경들도 들으라.', 'Spring-and-Autumn of Silla, We give you a poem. Ministers, attend.', '朕賜新羅春秋詩一首。眾卿且聽。', 'Zhèn cì Xīnluó Chūnqiū shī yì shǒu. Zhòng qīng qiě tīng.'],
		['짐의 형제들이 짐을 용납하지 않던 시절, 이익으로도 꾈 수 없고 죽음으로도 겁줄 수 없던 늙은 신하에게 써 준 것이니라.', 'We wrote it for an old minister, in the years when Our brothers could not bear Us. He was the one man who could not be bought with profit or frightened with death.', '此詩，朕昔為兄弟所不容時，賜一老臣。其人不可以利誘，不可以死懼。', 'Cǐ shī, zhèn xī wéi xiōngdì suǒ bù róng shí, cì yì lǎo chén. Qí rén bù kě yǐ lì yòu, bù kě yǐ sǐ jù.']
	]),
	POEM_TAIZONG,
	P(
		'The hall applauds, the way halls do. Then all of it turns toward the Silla guest. An answer is expected. A barbarian is expected to need until morning.',
		'전각이 박수를 친다. 전각들이 늘 그러듯이. 그러고는 전각 전체가 신라 손님 쪽으로 돈다. 답시가 나와야 한다. 오랑캐라면 아침까지는 걸리리라고들 기대한다.'
	),
	D('taizong', [['답하라. 운은 짐의 것을 쓰거라.', 'Answer. And use Our rhymes.', '和來。用朕的韻。', 'Hè lái. Yòng zhèn de yùn.']]),
	D('chunchu', [['잔 하나 비울 동안만 주시옵소서, 폐하.', 'Grant me the time it takes to empty one cup, Majesty.']]),
	P(
		'He does not empty it. He sets it down full, asks for the brush, and writes on his knees at the low table.',
		'그는 잔을 비우지 않는다. 가득 찬 채로 내려놓고, 붓을 청하고, 낮은 상 앞에 무릎을 꿇은 채 쓴다.'
	),
	POEM_CHUNCHU,
	P(
		'Nobody in the hall says anything, because nobody knows yet what the emperor thinks. The emperor reads it twice. The second time, his lips move on the last line.',
		'전각의 누구도 아무 말 하지 않는다. 황제가 어떻게 생각하는지 아직 아무도 모르기 때문이다. 황제는 두 번 읽는다. 두 번째에는 마지막 구에서 입술이 움직인다.'
	),
	D('taizong', [
		['짐은 바람이 풀을 시험한다 하였다.', 'We said the wind tests the grass.', '朕說疾風知勁草。', 'Zhèn shuō jí fēng zhī jìng cǎo.'],
		['헌데 이자는 짐의 풀을 받아 들고, 짐을 바람으로 만들어 돌려주는구나!', 'And he takes Our grass and hands it back with Us as the wind!', '他卻接過朕的草，反把朕做成了風！', 'Tā què jiē guò zhèn de cǎo, fǎn bǎ zhèn zuò chéng le fēng!'],
		['군자의 덕은 바람이요 소인의 덕은 풀이니, 풀 위로 바람이 불면 반드시 눕는다. 『논어』를 짐의 운에 실어 짐에게 바치다니!', '“The gentleman’s virtue is the wind, the small man’s is the grass; let the wind pass over it, and the grass must bend.” He has put the Analects on Our rhymes and handed it to Us!', '君子之德風，小人之德草，草上之風必偃。他把《論語》押上朕的韻，獻給朕！', 'Jūnzǐ zhī dé fēng, xiǎorén zhī dé cǎo, cǎo shàng zhī fēng bì yǎn. Tā bǎ Lúnyǔ yā shàng zhèn de yùn, xiàn gěi zhèn!'],
		['미친 바람은 백제요, 기울 곳은 짐이라. 이토록 기분 좋게 군사를 청하는 자는 처음 보노라.', 'The mad wind is Baekje, and the place to lean is Us. We have never been asked for an army so pleasantly.', '狂風是百濟，可傾之處是朕。朕從未被人借兵借得這般悅耳。', 'Kuángfēng shì Bǎijì, kě qīng zhī chù shì zhèn. Zhèn cóng wèi bèi rén jiè bīng jiè de zhè bān yuè’ěr.']
	]),
	edit(139, {
		drop: [0],
		set: {
			1: [
				'治 — 이 자를 옆에 두거라. 무릎 꿇고도 운을 맞출 줄 아는 자는 정직한 장군보다 드무니라.',
				'Zhi — keep this one. Men who can rhyme on their knees are rarer than honest generals.',
				'治——把這人留在身邊。跪着還能押韻的，比老實將軍還稀罕。',
				'Zhì — bǎ zhè rén liú zài shēnbiān. Guì zhe hái néng yāyùn de, bǐ lǎoshi jiāngjūn hái xīhan.'
			]
		}
	}),
	P(
		'Twenty characters. He has asked for an army, flattered an emperor out of his own classics, and called his neighbours a bad wind, without one word anybody could quote back at him.',
		'스무 글자. 그는 군사를 청했고, 황제를 황제 자신의 경전으로 추어올렸고, 이웃 나라들을 나쁜 바람이라 불렀다. 누구도 그에게 되받아 인용할 수 없는 말로만.'
	),
	(() => {
		const b = O(142);
		b.html =
			'Behind the screen <b>Wu</b> does not merely listen. She works the room without entering it: a glance that steadies a nervous maid, a smile that slows a minister’s cup, a silence that turns every eye in the hall back to the foreign prince.';
		b.ko =
			'병풍 뒤의 <b>무</b>는 듣기만 하지 않는다. 방에 들어가지 않고 방을 움직인다. 긴장한 시녀를 가라앉히는 눈빛, 대신의 잔을 늦추는 미소, 전각의 모든 눈을 외국 왕자에게로 되돌리는 침묵.';
		return b;
	})(),
	O(143),
	O(144),
	O(145),
	D('chunchu', [['꾸밀 필요가 없습니다, 낭자. 그분은 삼촌들보다 먼저 말씀하시니까요.', 'They don’t need to pretend, my lady. She speaks before they do.']]),
	D('wuzetian', [['『서경』에 그런 말이 있지요. ‘암탉이 새벽에 울면—’', 'The Documents have a line for that. “When the hen crows at dawn—”', '《書》裏有句話：「牝雞之晨——」', '“Shū” lǐ yǒu jù huà: “Pìn jī zhī chén——”']]),
	D('chunchu', [['‘—집안이 망한다.’ 압니다, 낭자. 그래도 신라에선 해가 뜹니다.', '“—the house is ruined.” I know it, my lady. And in Silla the sun still comes up.']]),
	D('wuzetian', [
		['(웃는다)', '(laughs)', '（笑）', '(Xiào)'],
		['해가 그분을 기다리나요, 아니면 그분이 해를 기다리나요?', 'Does it wait for her? Or does she wait for it?', '是太陽等她，還是她等太陽？', 'Shì tàiyáng děng tā, háishi tā děng tàiyáng?']
	]),
	CY_HEN,
	edit(148, {
		set: {
			1: [
				'위험한 소식을 들고도 제국을 상대로 운을 맞출 틈을 찾는 사내가 좋아요.',
				'I like a man who brings dangerous news and still finds time to rhyme with an empire.',
				'我喜歡帶着危險消息，卻仍有空與帝國對詩的男人。',
				'Wǒ xǐhuān dàizhe wēixiǎn xiāoxi, què réng yǒu kòng yǔ dìguó duì shī de nánrén.'
			],
			2: [
				'잔 하나만 더. 아니면 신라의 시는 일정대로 끝나야 하나요?',
				'Stay for one more cup. Or must Silla’s verses end on schedule?',
				'再留一杯。還是新羅的詩，也得按時收筆？',
				'Zài liú yì bēi. Háishi Xīnluó de shī, yě děi ànshí shōu bǐ?'
			]
		}
	}),
	edit(149, {
		set: {
			0: ['잘 받아치는 사람을 좋아하시는군.', 'He likes the one who answers in rhyme.', '他喜歡會對詩的人。', 'Tā xǐhuān huì duì shī de rén.']
		}
	}),
	O(60),
	O(61),
	O(62),
	P(
		'One of the two rubbings is for a temple at Jinci, raised to a little brother who was once handed a leaf. Chunchu reads the first column, laughs out loud, and does not explain it to Inmun.',
		'탁본 두 벌 가운데 하나는 진사(晉祠)의 비문이다. 오래전 나뭇잎 한 장을 받은 어린 아우를 모신 사당. 춘추는 첫 줄을 읽고 소리 내어 웃고, 인문에게 까닭을 말해 주지 않는다.'
	),
	O(150),

	// ── Hallway ──
	...Array.from({ length: 169 - 151 + 1 }, (_, k) => O(151 + k)),

	// ── The Last Game ──
	{ kind: 'scene', label: 'The Last Game', ko: '마지막 판' },
	P(
		'Chunchu gets as far as the next courtyard. A eunuch is waiting there with a lamp, as if someone had told him exactly how fast a frightened prince walks. The emperor is not asleep. The go board is out.',
		'춘추는 옆 마당까지밖에 못 간다. 환관 하나가 등불을 들고 기다리고 있다. 겁먹은 왕자가 얼마나 빨리 걷는지 누가 정확히 일러 주기라도 한 것처럼. 황제는 자지 않는다. 바둑판이 나와 있다.'
	),
	D('taizong', [['앉게. 한 판만 두고 가게.', 'Sit. One game, and then you may go.', '坐。下完這盤再走。', 'Zuò. Xià wán zhè pán zài zǒu.']]),
	P(
		'They play without talking. Chunchu takes the far corner again. This time the emperor lets him have it.',
		'둘은 말없이 둔다. 춘추가 또 먼 귀를 차지한다. 이번에는 황제가 내준다.'
	),
	O(28),
	O(29),
	O(30),
	O(31),
	O(32),
	O(33),
	O(34),
	D('taizong', [
		['자네가 그랬지. 이름이 바르지 않으면 말이 순하지 않다고.', 'You told Us once: if the name is not correct, speech does not follow.', '你說過：名不正，則言不順。', 'Nǐ shuō guo: míng bú zhèng, zé yán bú shùn.'],
		['이제 바른가?', 'Is it correct now?', '現在正了嗎？', 'Xiànzài zhèng le ma?']
	]),
	D('chunchu', [['…이제야 말이 순하옵니다, 폐하.', '…Now the speech can follow, Majesty.']]),
	{
		kind: 'card',
		person: 'taizong',
		tab: 'intro',
		write: '李世民',
		sub: '이세민',
		caption: 'Li Shimin, the Second Emperor of Tang. Nobody in Chang’an writes his name. He has just said it to a foreigner, on purpose.',
		ko: '이세민, 당의 두 번째 황제. 장안의 누구도 그의 이름을 쓰지 않는다. 그는 방금 그 이름을 외국인에게 말했다. 일부러.'
	},

	// ── The Mingde Gate · On Gunhae ──
	...Array.from({ length: 189 - 170 + 1 }, (_, k) => O(170 + k))
];

// He is “the Second Emperor” / “the emperor” until the name drop; “Taizong” is a temple name he does not have yet.
for (const b of blocks) {
	if (b.kind !== 'p') continue;
	b.html = b.html.replace(/\bTaizong\b/g, 'The emperor');
	b.ko = b.ko.replace(/태종은/g, '황제는').replace(/태종이/g, '황제가');
}

// ─────────────────────────── images ───────────────────────────

const REANCHOR = {
	'bowing-envoys': 'Chunchu brings an offer',
	'taizong-meet-court-wide': 'Chunchu brings an offer',
	'chunchu-strategist-shadow': 'Chunchu brings an offer',
	'silla-tang-alliance-hands': 'Chunchu brings an offer',
	'taizong-huanglong-audience': 'Chunchu brings an offer',
	'alliance-handshake': 'alliance sealed',
	'taizong-meet-name': 'Then is your younger brother called',
	'taizong-meet-go-stone': 'You play it the way Qin did',
	'taizong-meet-go-up': 'Sit. One game, and then you may go.',
	'tang-banquet': 'does not merely listen',
	'tang-banner-storm': 'I do not go to Liaodong for land'
};
const REMOVED = [];
const images = entry.images
	.filter((im) => !REMOVED.includes(im.id))
	.map((im) => (REANCHOR[im.id] ? { ...clone(im), at: REANCHOR[im.id] } : clone(im)));

const INK_HOUSE =
	'Joseon / Chinese sumi ink painting on bare paper, composed for a 2:1 letterbox crop. Huge black ink masses against blinding untouched paper; the light is the unpainted paper. Splashed ink, dry-brush flying white, soft wet bleeds. One graphic device. Ancient figures in topknots, no brimmed hats. FULL-BLEED, no paper margin. No text, no seals, no calligraphy.';

const newImages = [
	{
		id: 'huangdi-ink-names',
		at: 'What is the correct name for me to call Your Majesty?',
		alt: 'Ink: Confucius in an ox-cart on the road to Wei, Zilu at the reins, a city gate as one black mass ahead',
		scene: `Confucius, old and upright, rides in a small open ox-cart on an empty road toward the gate of Wei; his disciple Zilu walks at the ox's head with the reins, turned back to argue. ONE device: the city gate ahead as a single enormous black ink block with a pale slit of a doorway, the cart a tiny shape on a long dry-brush road that runs toward it. No colour wash. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-know',
		at: 'Your Majesty did not know who was standing on the wall.',
		alt: 'Ink: a towering fortress wall in mist, one tiny figure on top, an army of dry-brush specks below',
		scene: `A sheer mountain-fortress wall rising out of mist like a cliff, drawn in heavy wet ink, filling the right two-thirds of the frame; on its rim one tiny standing figure, unreadable, facing out. Far below on the left, a vast besieging host reduced to dry-brush specks and a few long banners, staring up. ONE device: the vertical wall against empty paper sky. One thin vermilion wash only on the besiegers' banners. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-lips',
		at: 'If Silla is the lip, Liaodong is the tooth.',
		alt: 'Ink: a long chariot column threading a mountain road through a small walled state toward another',
		scene: `Two small walled states sit on two hills, joined by a single thin mountain road. A long column of war chariots and spears, drawn as one continuous black ink ribbon, threads along the road out of the left edge, through the first little state's open gate, toward the second. In the foreground, tiny, a minister kneels before his duke, who has already turned away. ONE device: the road as a single serpentine line binding the two walls. No colour wash. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-far',
		at: 'Qin ate the world with it.',
		alt: 'Ink: a strategist leans to a king’s ear above a landscape where near kingdoms are swallowed by spreading black ink',
		scene: `Bird's-eye landscape of mountains and rivers like a map painted in ink. From the left, one black ink pool spreads and swallows the nearest hills one by one, while the far mountains on the right edge stay pale and untouched, almost bare paper. In the upper corner, small, a lean strategist leans to whisper in a seated king's ear. ONE device: the advancing ink bleed eating the near country. No colour wash. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-qin-fire',
		at: 'Burn the Odes and the Documents in private hands',
		alt: 'Ink: a bonfire of bamboo-slip books in an empty square, smoke filling the sky',
		scene: `An empty stone square at night. In the centre, a tall pyre of bound bamboo-slip books, the slips curling as they burn; a few officials in dark robes stand at a distance with more bundles, tiny against it. ONE device: the column of smoke rising from the pyre and spreading into a huge black ink sky over everything. The one colour wash is vermilion-orange in the flames only. ${INK_HOUSE}`,
		style_note: 'Qin flashback'
	},
	{
		id: 'huangdi-ink-qin-pit',
		at: 'buried them all at Xianyang',
		alt: 'Ink: a long open pit in bare earth at Xianyang, rows of scholars at its edge, soldiers as black verticals',
		scene: `A long, straight open pit cut into bare pale earth, seen from high above. Along its far edge kneels a row of scholars in plain robes and topknots, heads bowed; behind them, spear-soldiers as a row of hard black verticals. A few scattered bamboo slips lie in the dirt. ONE device: the pit as one black horizontal slash across the paper. No colour wash. ${INK_HOUSE}`,
		style_note: 'Qin flashback'
	},
	{
		id: 'huangdi-ink-boat',
		at: 'Water carries the boat, and water overturns it.',
		alt: 'Ink: a small boat on the crest of a huge ink wave',
		scene: `A small, elegant river boat with a single canopy rides the crest of an enormous wave made of thousands of tiny dry-brush figures merging into water, so the wave reads both as water and as a crowd of people. ONE device: the wave curling over, its shadow already falling on the boat. No colour wash. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-leaf',
		at: 'cut a paulownia leaf into a tally',
		alt: 'Ink: a boy-king hands a cut paulownia leaf to his little brother; a historian writes in the shadows',
		scene: `Under a great paulownia tree drawn in loose wet ink, a boy-king of Zhou kneels and hands a leaf, trimmed into the shape of a jade tally, to his smaller brother, both laughing. Behind them, half lost in the ink shadow of a palace pillar, a grave historian is already writing on a bamboo slip. ONE device: the single leaf at the exact centre of the paper. The one colour wash is a pale green on that leaf only. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-grass',
		at: 'And he takes Our grass and hands it back with Us as the wind!',
		alt: 'Ink: a gale flattens a field of grass, one stalk stands upright',
		scene: `A wide field of tall grass under a gale, every blade flattened in one direction in long dry-brush strokes that run off the right edge; in the lower third one single stalk stands straight. Behind, a great ink storm cloud fills the upper half. ONE device: the one upright stalk against the sea of bent strokes. No colour wash. ${INK_HOUSE}`
	},
	{
		id: 'huangdi-ink-hen',
		at: 'The Documents have a line for that.',
		alt: 'Ink: a hen crows from a palace roof ridge at dawn, the hall below still black',
		scene: `A single hen stands on the high curved ridge of a palace roof, head thrown back, crowing. The great roof and the hall below are one black ink mass; the sky above is bare paper just beginning to pale. ONE device: the long dark ridge line with the small hen at its very end. The one colour wash is a faint dawn red at the paper's edge behind her. ${INK_HOUSE}`
	}
].map(({ style_note, ...im }) => ({ ratio: 2, style: 'ink', ...im }));

// ─────────────────────────── validation ───────────────────────────

const peopleSrc = fs.readFileSync(path.join(ROOT, 'src/lib/people.ts'), 'utf8');
const errors = [];

function textOf(b) {
	const own = [b.html, b.ko, b.hanja, b.caption, b.title, b.label, b.term, b.reading, b.story, b.storyKo, b.write, b.sub, ...(b.lines || []), ...(b.en || [])];
	return own.filter(Boolean).join(' \u2016 ');
}
function walk(list, fn, inFlash = null) {
	list.forEach((b, i) => {
		fn(b, i, inFlash);
		if (b.kind === 'flashback') walk(b.blocks, fn, b);
	});
}
const flat = [];
walk(blocks, (b) => {
	if (b.kind !== 'flashback') flat.push(b);
});

// image anchors: exactly one (leaf) block, matched like beats.ts (case-insensitive)
for (const im of [...images, ...newImages]) {
	if (!im.at) continue;
	const needle = im.at.trim().toLowerCase();
	const hits = flat.filter((b) => textOf(b).toLowerCase().includes(needle));
	if (hits.length !== 1) errors.push(`anchor ${im.id} “${im.at}” hits ${hits.length} blocks`);
	else if (!['p', 'dialogue', 'quote', 'diagram', 'card', 'term', 'scene', 'day', 'monologue'].includes(hits[0].kind))
		errors.push(`anchor ${im.id} lands on a ${hits[0].kind} block, which beats.ts does not read`);
}
// people ids
walk(blocks, (b) => {
	if (b.person && !peopleSrc.includes(`id: '${b.person}'`)) errors.push(`unknown person ${b.person}`);
	if (b.person === 'west_ambassador' || b.person === 'east_ambassador') errors.push(`ambassador block left in`);
	if (b.kind === 'dialogue') {
		for (const k of ['en', 'zh', 'zhLatn', 'ja', 'jaLatn'])
			if (b[k] && b[k].length !== b.lines.length) errors.push(`dialogue ${k} length mismatch: ${b.lines[0]}`);
		if (!b.chip) errors.push(`dialogue without chip: ${b.lines[0]}`);
	}
	if (b.kind === 'p' && !b.ko) errors.push(`p without ko: ${b.html.slice(0, 40)}`);
});
// name-drop: Li Shimin / 이세민 / 李世民 only in the last-game scene and the card
const lastGame = blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The Last Game');
walk(blocks, (b) => {
	const i = blocks.indexOf(b);
	if (/Li Shimin|이세민|李世民|Shimin/.test(textOf(b)) && (i < 0 || i < lastGame)) errors.push(`early name drop: ${textOf(b).slice(0, 60)}`);
});
const cards = blocks.filter((b) => b.kind === 'card' && b.person === 'taizong');
if (cards.length !== 1) errors.push(`expected one taizong card, found ${cards.length}`);

const out = {
	chapter: 'chunchu-era',
	title: 'Huangdi (皇帝)',
	blocks,
	images,
	newImages,
	removedImages: REMOVED,
	notes: fs.readFileSync(path.join(__dirname, 'huangdi-notes.txt'), 'utf8').trim()
};
fs.writeFileSync(path.join(__dirname, 'huangdi.json'), JSON.stringify(out, null, '\t') + '\n');
JSON.parse(fs.readFileSync(path.join(__dirname, 'huangdi.json'), 'utf8'));

console.log(`blocks ${blocks.length} (was ${orig.length}); images ${images.length}; new ink ${newImages.length}`);
console.log(`kinds:`, blocks.reduce((m, b) => ((m[b.kind] = (m[b.kind] || 0) + 1), m), {}));
if (errors.length) {
	console.log('ERRORS:\n' + errors.join('\n'));
	process.exitCode = 1;
} else console.log('OK — all checks pass');
