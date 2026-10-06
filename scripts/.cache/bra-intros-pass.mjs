// King Pungjang: Saimei's sponsorship flashback (Asuka, 660) + the BRA roll call on the shingle below Juryu (661).
// Writes scripts/.cache/manifest-bra-intros.json for add-image-slots.mjs → GenerateImage → install-temp-art.mjs.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const MANIFEST = 'scripts/.cache/manifest-bra-intros.json';
const ENTRY = 'King Pungjang';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const en = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === ENTRY);
if (!en) throw new Error(`missing entry ${ENTRY}`);

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines, extra = {}) => ({ kind: 'dialogue', person, lines, en, ...extra });

const asuka = {
	kind: 'flashback',
	year: '660',
	title: 'Asuka, that winter',
	blocks: [
		p(
			'Asuka, the tenth month. The Baekje envoy has come the whole way with frost in his beard and a hundred Tang soldiers roped neck to neck behind him, a present, which is a polite word for proof. The empress is sixty-six. She has buried two husbands, held this throne twice and sat through a great many envoys, and she lets this one finish.',
			'아스카, 시월. 백제 사신은 수염에 서리를 얹은 채 먼 길을 왔고, 그 뒤로 당나라 병사 백 명이 목과 목을 밧줄로 엮인 채 서 있다. 선물이다. 증거를 점잖게 부르는 말이다. 여제는 예순여섯이다. 남편 둘을 묻었고, 이 자리에 두 번 올랐고, 사신이라면 질리도록 받아 보았다. 그녀는 이 사신이 말을 끝낼 때까지 둔다.'
		),
		say(
			'tenji',
			['A hundred prisoners. Generous.', '…That’s the first page, though. When do they show us the rest of the bill?'],
			['포로 백 명이라. 후하군요.', '…그건 첫 장일 뿐이고요. 나머지 셈은 언제 내놓는답니까?'],
			{
				ja: ['捕虜百人とは。気前のよいことだ。', '……それは一枚目にすぎぬ。残りの勘定はいつ出てくる。'],
				jaLatn: ['Horyo hyakunin to wa. Kimae no yoi koto da.', '…Sore wa ichimaime ni suginu. Nokori no kanjō wa itsu dete kuru.']
			}
		),
		p(
			'The envoy tells him. Soldiers, and the prince. Every head in the hall turns to the prince, who has lived in this palace for twenty years and who discovers that he has been sitting very straight.',
			'사신이 답한다. 군사, 그리고 왕자. 전각 안의 모든 고개가 왕자에게로 돌아간다. 이 궁에서 스무 해를 산 그는, 자기가 아까부터 몹시 꼿꼿이 앉아 있었다는 걸 그제야 안다.'
		),
		say(
			'abe',
			['Send me! I’ve crossed the cold sea.', 'I’ve taken Mishihase arrows. The western sea’s only warmer. I’ll bring you back their emperor’s hat!'],
			['보내 주시오! 나는 찬 바다를 건너 본 사람이오.', '숙신 놈들 화살도 맞아 봤소. 서쪽 바다는 그냥 좀 따뜻할 뿐이지. 당나라 황제 모자라도 벗겨 오리다!'],
			{
				ja: ['わしを遣わされよ！ 冷たい海なら渡ってきた。', '粛慎の矢も受けた。西の海はちと暖かいだけよ。唐の帝の冠でも剝いで参ろう！'],
				jaLatn: [
					'Washi o tsukawasare yo! Tsumetai umi nara watatte kita.',
					'Mishihase no ya mo uketa. Nishi no umi wa chito atatakai dake yo. Tō no mikado no kanmuri demo haide mairō!'
				]
			}
		),
		say(
			'tenji',
			['Before anyone asks him anything, Mother, I will.', 'Prince. Do they want you, or your name?'],
			['어머님, 누가 묻기 전에 제가 먼저 묻겠습니다.', '왕자. 저들이 원하는 게 그대요, 그대의 이름이오?'],
			{
				ja: ['母上、誰より先に私がお尋ねします。', '王子。あちらが欲しいのはそなたか、それともそなたの名か。'],
				jaLatn: ['Hahaue, dare yori saki ni watakushi ga otazune shimasu.', 'Ōji. Achira ga hoshii no wa sonata ka, soretomo sonata no na ka.']
			}
		),
		say(
			'pung',
			['…Both, I expect. The name first.', 'I am still a son of Baekje. I have only… forgotten some of the words.'],
			['…둘 다겠지요. 이름이 먼저고요.', '저는 아직 백제의 아들입니다. 말을 몇 개… 잊었을 뿐이지요.'],
			{ chip: '#e6c76a' }
		),
		p(
			'The empress has let all of it run: her son’s arithmetic, the admiral’s hat, the prince’s missing words. Then she speaks once.',
			'여제는 그 모든 것을 흘려들었다. 아들의 셈도, 제독의 모자도, 왕자가 잃어버린 말들도. 그러고는 한 번 입을 연다.'
		),
		say(
			'saimei',
			[
				'Asking for soldiers is old. Holding up a falling house is older.',
				'The sea is also a border, my son. When the western roof catches, our eaves are next.',
				'Give them the ships. Give the boy a cap of rank and a wife, so he does not arrive looking like a hostage.'
			],
			[
				'군사를 청하는 일은 옛날부터 있었다. 쓰러지는 집을 붙드는 일은 그보다 더 오래되었지.',
				'바다도 국경이다, 아들아. 서쪽 지붕에 불이 붙으면, 다음은 우리 처마야.',
				'배를 내주어라. 저 아이에게는 관을 씌우고 아내를 붙여 보내라. 볼모 꼴로 도착하지 않게.'
			],
			{
				ja: [
					'援軍を乞うは古くからのこと。傾く家を支えるは、なお古い。',
					'海もまた境ぞ、我が子よ。西の屋根に火がつけば、次はこちらの軒。',
					'船を出せ。あの子には冠を授け、妻を添えて送れ。人質のような顔で着かぬように。'
				],
				jaLatn: [
					'Engun o kou wa furuku kara no koto. Katamuku ie o sasaeru wa, nao furui.',
					'Umi mo mata sakai zo, waga ko yo. Nishi no yane ni hi ga tsukeba, tsugi wa kochira no noki.',
					'Fune o dase. Ano ko ni wa kanmuri o sazuke, tsuma o soete okure. Hitojichi no yō na kao de tsukanu yō ni.'
				]
			}
		),
		{
			kind: 'quote',
			hanja: '乞師請救、聞之古昔。扶危繼絶、著自恆典。……雲會雷動、俱集沙㖨、翦其鯨鯢、紓彼倒懸。',
			ko: '군사를 빌고 구원을 청하는 일은 옛적부터 들어 온 바요, 위태로운 것을 붙들고 끊긴 것을 잇는 일은 떳떳한 법도에 적혀 있다. …… 구름처럼 모이고 우레처럼 움직여 사탁에 함께 모여, 그 고래를 베고 거꾸로 매달린 이들을 풀어 주라.',
			html: 'To beg for troops and plead for rescue, this we have heard of from of old; to steady the falling and continue the severed line is written in the constant laws. …… Gather like clouds and move like thunder, assemble together at Sataku, cut down its whales and loosen those who hang upside down.',
			source: 'Nihon Shoki (日本書紀) vol. 26, Empress Saimei 6 (660), 10th month — the edict to aid Baekje'
		},
		p(
			'Abe is out of the hall before the edict is copied. The prince goes to find a tailor. The eastern prince, who agrees with his mother on everything she has decided, writes the cost of it down on a separate sheet anyway.',
			'칙서가 베껴지기도 전에 아베는 전각을 나가고 없다. 왕자는 재봉사를 찾으러 간다. 어머니가 정한 일이라면 무엇이든 따르는 동쪽 태자는, 그래도 그 값을 따로 한 장에 적어 둔다.'
		)
	]
};

const rollCall = [
	{ kind: 'scene', label: 'Roll Call', ko: '점호' },
	p(
		'Juryu, the ninth month of 661. Prince Pung comes ashore below the fortress with a cap of rank, a Yamato wife, five thousand eastern soldiers and an admiral nobody asked for, and finds the founders of the restoration drawn up on the shingle to meet him. Boksin has written the order of introductions on a tally board. He has made them rehearse it twice.',
		'주류, 661년 구월. 부여풍이 성 아래 자갈밭에 내린다. 관을 쓰고, 왜국 아내를 데리고, 동쪽 군사 오천과 아무도 청하지 않은 제독 하나를 거느리고. 부흥군을 세운 장수들이 자갈밭에 줄지어 그를 맞는다. 복신은 소개 순서를 목간에 적어 두었다. 연습도 두 번이나 시켰다.'
	),
	p(
		'The board begins with Boksin. The order lasts until <b>Abe no Hirafu</b>, who is not on it, leaps from the gunwale of the first boat into surf up to his knees, flings his arms wide in his wolf-fur and his red cape, and introduces himself to the fortress, the gulls and the Tang scouts on the far ridge.',
		'목간은 복신으로 시작한다. 그 순서는, 목간에 이름도 없는 <b>아베노 히라부</b>가 첫 배 뱃전에서 무릎까지 오는 파도 속으로 뛰어내릴 때까지만 간다. 늑대 모피와 붉은 망토 차림으로 두 팔을 활짝 벌리고, 그는 성채와 갈매기들과 건너편 능선의 당나라 척후들에게 자기를 소개한다.'
	),
	say(
		'abe',
		['Abe no Hirafu! General of the cold northern sea!', 'A hundred and eighty ships against the Emishi, and I caught Mishihase arrows in my teeth! Tang’s next! Ha!'],
		['아베노 히라부요! 북쪽 찬 바다의 장군!', '배 백팔십 척으로 에미시를 쓸었고, 숙신 놈들 화살은 이빨로 받았소! 다음은 당나라요! 하하!'],
		{
			ja: ['阿倍比羅夫なり！ 北の冷たき海の将軍！', '百八十艘で蝦夷を平らげ、粛慎の矢は歯で受け止めた！ 次は唐よ！ はっはっ！'],
			jaLatn: ['Abe no Hirafu nari! Kita no tsumetaki umi no shōgun!', 'Hyakuhachijissō de Emishi o tairage, Mishihase no ya wa ha de uketometa! Tsugi wa Tō yo! Hahha!']
		}
	),
	say('boksin', ['You’re not on the board, Admiral.', '…Lovely entrance, though.'], ['제독께서는 목간에 안 계십니다.', '…등장은 훌륭하셨습니다만.'], { chip: '#a8781f' }),
	p(
		'<b>Echi no Takutsu</b> waits until the admiral has finished, which takes a while. Then he walks up the shingle, turns his back on the Baekje generals and bows to the sea he has just crossed, low and long, the tails of his white headband lifting in the wind, before he turns round and says the one thing he has prepared.',
		'<b>에치노 다쿠쓰</b>는 제독이 다 끝낼 때까지 기다린다. 한참 걸린다. 그러고는 자갈밭을 걸어 올라가, 백제 장수들에게 등을 돌리고, 방금 건너온 바다를 향해 낮고 길게 절한다. 흰 머리띠 끝이 바람에 들린다. 그런 다음 돌아서서, 준비해 온 단 한 마디를 한다.'
	),
	say(
		'takutsu',
		['No one in this country knows my name. So instead of mine, I will say yours.', 'Long live Kudara. If Kudara needs a life, begin with mine.'],
		['이 나라에서 내 이름을 아는 사람은 없소. 그러니 내 이름 대신 이 나라 이름을 외치겠소.', '구다라 만세. 구다라에 목숨이 하나 필요하거든, 내 것부터 쓰시오.'],
		{
			chip: '#b05575',
			ja: ['この国に我が名を知る者はおらぬ。ならば我が名の代わりに、この国の名を叫ぼう。', '百済万歳。百済に命が一つ要るなら、まず我がものを使われよ。'],
			jaLatn: [
				'Kono kuni ni waga na o shiru mono wa oranu. Naraba waga na no kawari ni, kono kuni no na o sakebō.',
				'Kudara banzai. Kudara ni inochi ga hitotsu iru nara, mazu waga mono o tsukaware yo.'
			]
		}
	),
	say('sateksangya', ['…He means it.'], ['…저 사람, 진심이네.'], { chip: '#b8933f' }),
	p(
		'<b>Dochim</b> introduces himself sitting down. He has found a flat rock above the tideline and settled on it in his red kasaya, the beads running through one hand and the gilt staff across his knees, and he smiles at the new king the way a monk smiles at a donor whose gift has not yet arrived.',
		'<b>도침</b>은 앉은 채로 자기를 소개한다. 물때선 위 평평한 바위에 붉은 가사 차림으로 자리 잡고, 한 손으로 염주를 굴리며 금빛 석장을 무릎에 가로놓은 채, 아직 시주가 도착하지 않은 시주자에게 스님이 짓는 웃음을 새 임금에게 짓는다.'
	),
	say(
		'dochim',
		[
			'Dochim. A monk of no temple, now. They call me General of the Spirit Army.',
			'The Buddha taught that all things are impermanent. The Tang garrison at Sabi is one of those things.',
			'We march at dawn. Do sleep well tonight.'
		],
		[
			'도침입니다. 이제는 어느 절의 중도 아니고, 영군장군이라 불리지요.',
			'부처님께서는 모든 것이 덧없다 하셨습니다. 사비의 당나라 군도 그 모든 것 가운데 하나입니다.',
			'내일 새벽에 떠납니다. 오늘 밤은 푹 주무십시오.'
		]
	),
	p(
		'Boksin, who did not write “General of the Spirit Army” on the board, makes a small mark beside it.',
		'목간에 ‘영군장군’이라고 쓴 적 없는 복신이, 그 옆에 작은 표시를 하나 한다.'
	),
	p(
		'<b>Heukchi Sangji</b> is seven feet tall. The autumn Sabi fell he walked into Imjon with a handful of men and walked out ten days later with thirty thousand, and he regards the whole business of a roll call as a kind of weather. When his turn comes he steps forward exactly one pace.',
		'<b>흑치상지</b>는 키가 칠 척이다. 사비가 무너진 가을, 그는 몇 안 되는 사람을 데리고 임존성에 들어가 열흘 만에 삼만을 데리고 나왔다. 그에게 점호 같은 건 날씨 비슷한 것이다. 차례가 오자 그는 정확히 한 걸음 앞으로 나선다.'
	),
	say('sangji', ['Heukchi Sangji. Imjon.', '…That’s it.'], ['흑치상지. 임존.', '…끝.'], { chip: '#8a6b1f' }),
	say('boksin', ['The arms, General. We discussed the arms.'], ['장군, 팔. 팔 동작 말입니다. 얘기했잖습니까.'], { chip: '#a8781f' }),
	say('sangji', ['You discussed the arms.'], ['얘기는 당신이 했지.'], { chip: '#8a6b1f' }),
	p(
		'<b>Satek Sangya</b> has worn the tall gilt cap of his house for the occasion, which is the only concession he makes to it. He does not look up from the ledger.',
		'<b>사택상여</b>는 이날을 위해 집안의 높은 금동관을 쓰고 나왔다. 그가 이날에 해 주는 양보는 그게 전부다. 그는 장부에서 눈을 들지 않는다.'
	),
	say(
		'sateksangya',
		['Satek Sangya. Forty boats, eleven hundred bales of rice, thirty thousand arrows, and I stopped counting the rope.', 'Nobody has paid me yet. That’s my pose.'],
		['사택상여. 배 마흔 척, 쌀 천백 섬, 화살 삼만, 밧줄은 세다 말았고.', '아직 아무도 값을 안 쳤어. 이게 내 인사요.'],
		{ chip: '#b8933f' }
	),
	p(
		'Then <b>Gwishil Boksin</b>, who wrote the board, steps out in front of all of them, plants the red shaft in the shingle and does the arms exactly as rehearsed.',
		'그리고 목간을 쓴 <b>귀실복신</b>이 모두의 앞으로 나와 붉은 자루를 자갈에 꽂고, 연습한 그대로 팔 동작을 해 보인다.'
	),
	say(
		'boksin',
		['Gwishil Boksin. I raised this country once when it fell, and if it falls twice I’ll raise it twice.', 'Welcome home, Majesty. Your army.'],
		['귀실복신. 나라가 쓰러졌을 때 한 번 일으켰고, 두 번 쓰러지면 두 번 일으킬 사람이오.', '돌아오신 걸 환영합니다, 전하. 전하의 군대입니다.'],
		{ chip: '#a8781f' }
	),
	p(
		'Everyone looks at the king. Nobody has given <b>Pung</b> a line. He has been in the country for less than an hour and has spent most of it being bowed at, and he ad-libs.',
		'모두가 왕을 본다. <b>풍</b>에게 대사를 준 사람은 아무도 없다. 이 땅에 내린 지 한 시진도 안 되었고, 그동안 절만 받았다. 그는 즉석에서 지어낸다.'
	),
	say(
		'pung',
		['I am Buyeo Pung, son of King Euija, and… king of— of Baekje.', '…Is that right? Is “restoration” the word?'],
		['나는 부여풍. 의자왕의 아들이고… 백제의, 그… 왕이다.', '…맞소? ‘부흥’이라는 말이 그거 맞소?'],
		{ chip: '#e6c76a' }
	),
	say('boksin', ['Close enough, Majesty.'], ['대충 맞습니다, 전하.'], { chip: '#a8781f' }),
	p(
		'Boksin counts them in. “Baekje— Restoration— Army!” Takutsu and the admiral land it perfectly, which is embarrassing for everyone else. Dochim does half and goes back to his beads. Sangya is still counting. Sangji folds his arms, which is at least an arm. The new king is a beat late and on the wrong foot.',
		'복신이 박자를 센다. “백제— 부흥— 군!” 다쿠쓰와 제독은 완벽하게 해낸다. 나머지 모두가 민망해진다. 도침은 반쯤 하다 말고 염주로 돌아간다. 상여는 아직 세는 중이다. 상지는 팔짱을 낀다. 그래도 팔은 팔이다. 새 임금은 한 박자 늦고, 발도 반대다.'
	),
	p(
		'On the far ridge two Tang scouts watch the whole performance, and that night Liu Rengui files their report under morale.',
		'건너편 능선에서 당나라 척후 둘이 이 공연을 처음부터 끝까지 지켜본다. 그날 밤 유인궤는 그 보고를 ‘사기(士氣)’ 항목에 철해 둔다.'
	)
];

const has = (pred) => en.blocks.some(pred);
if (!has((b) => b.kind === 'flashback' && b.title === asuka.title)) {
	const i = en.blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith('The eastern empress raises ships'));
	if (i < 0) throw new Error('missing "The eastern empress raises ships" block');
	en.blocks.splice(i, 0, asuka);
}
if (!has((b) => b.kind === 'scene' && b.label === 'Roll Call')) {
	const i = en.blocks.findIndex((b) => b.kind === 'p' && b.html?.includes('<b>Echi no Takutsu</b>') && b.html?.startsWith('King <b>Pungjang'));
	if (i < 0) throw new Error('missing roster block');
	en.blocks.splice(i + 1, 0, ...rollCall);
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const FRAME = 'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge.';
const JURYU =
	'Juryu Fortress: a rough Baekje mountain fortress of piled grey stone on a pine ridge above the western sea, timber gate-house with a plain giwa roof.';
const SHORE = `Below it a grey shingle beach at stormy dusk, beached war-boats, the slate western sea behind, one low break of sun under the storm clouds.`;
const INTRO = `HEEWON STYLE manga character-intro splash, the hero-pose page of a seinen historical manga painted in ink and oil. ${FRAME} ${JURYU} ${SHORE} Bold dry-brush sumi-ink radial FOCUS LINES converge on the figure, flung ink-splatter spray, hard dutch tilt, heavy black ink masses against a few hard highlights; ONE accent colour for this character. Face stays clean webtoon ink line. Full-bleed single frame: NO panel borders, NO speech bubbles, NO name lettering, NO sound effects, NO text of any kind.`;
const ASUKA = `HEEWON STYLE. Minimal iconic 2:1 movie still, interior at night = old-master tenebrist canvas. ${FRAME} The Asuka palace hall, winter 660: unpainted cypress pillars, plank floor, bark-shingle roof beams in the dark, a raised wooden dais with a plain folding screen; 7th-century Yamato court, never Edo, no tatami, no shoji grid.`;

const intro = (id, at, alt, scene, people, canon = {}) => ({ id, entry: ENTRY, at, alt, scene: `${INTRO} ${scene}`, people, canon });

const items = [
	{
		id: 'saimei-court-prisoners',
		entry: ENTRY,
		at: 'roped neck to neck behind him',
		alt: 'In the Asuka hall a hundred Tang prisoners kneel roped neck to neck before the old empress on her dais',
		scene: `${ASUKA} Low wide from the plank floor at the back of the hall: in the dark foreground a line of kneeling Tang prisoners roped neck to neck, backs to us, the rope a pale diagonal leading the eye forward; midground the Baekje envoy kneeling, frost on his shoulders; on the dais the old empress small and immovable in white silk and celadon borders, one standing oil lamp beside her raking light across her face and the floor. Device: the rope line running to the dais. Cast shadows climbing the pillars.`,
		people: ['saimei'],
		canon: { year: 660 }
	},
	{
		id: 'pung-yamato-straight',
		entry: ENTRY,
		at: 'he has been sitting very straight',
		alt: 'Every head in the Yamato hall turns to Prince Pung, who finds he has been sitting very straight',
		scene: `${ASUKA} Medium close, low three-quarter: Prince Pung kneeling bolt upright on a mat, hands flat on his knees, throat tight, eyes fixed forward; in the soft dark foreground the blurred heads and black caps of Yamato courtiers all turned toward him. One oil lamp on the floor at his side rakes his cheek and the red-and-gold cord in his topknot; bokeh of distant lamps behind. Device: the turned heads as a curve closing on him.`,
		people: ['pung'],
		canon: { year: 660 }
	},
	{
		id: 'saimei-decides',
		entry: ENTRY,
		at: 'The sea is also a border, my son',
		alt: 'Over the eastern prince’s shoulder, the old empress lifts one hand from her knee and decides',
		scene: `${ASUKA} Over-the-shoulder from the eastern prince in the dark foreground, his flat wooden shaku tablet edge-on as a hard vertical line; beyond it the old empress on the dais lifts one hand an inch from her knee, decision made, face calm and final; a standing oil lamp close at her side rakes her powdered face and the celadon silk; behind her a plain screen with dim painted waves. Device: the shaku tablet dividing the frame.`,
		people: ['tenji', 'saimei'],
		canon: { year: 660 }
	},
	intro(
		'bra-intro-abe',
		'introduces himself to the fortress, the gulls',
		'Abe no Hirafu leaps from the boat into the surf below Juryu, arms flung wide, roaring his own name',
		'Abe no Hirafu mid-leap from the gunwale of a war-boat into knee-deep surf, arms flung wide, grey wolf-fur mantle and long red cape exploding behind him, mouth wide open in a laughing roar, spray bursting around his boots. Worm’s-eye from the surf, extreme foreshortening, one boot coming at the lens. Accent: the red cape against the slate sea; tiny Baekje figures waiting on the shingle behind.',
		['abe']
	),
	intro(
		'bra-intro-takutsu',
		'bows to the sea he has just crossed',
		'Echi no Takutsu bows low and long to the sea at the waterline, white headband tails lifting in the wind',
		'Echi no Takutsu bowing low and long to the sea at the waterline, seen in low side three-quarter, hands on his knees, the white headband tails lifting straight out in the wind, his straight sword sheathed in its red-lacquered scabbard at the hip; ahead of him the open grey sea and one cloud-break shaft falling on the water. The focus lines converge quietly on his bowed head. Accent: his orange-red robe catching the shaft. Still, sincere, unbending.',
		['takutsu']
	),
	intro(
		'bra-intro-dochim',
		'introduces himself sitting down',
		'Dochim sits cross-legged on a rock above the tideline, beads in hand, smiling down at the new king',
		'Dochim seated cross-legged on a flat black rock above the tideline, red-orange kasaya over ochre robe, the long string of black beads running through one hand, the gilt ringed monk staff laid across his knees, smiling faintly down at the viewer with half-closed eyes. Worm’s-eye from the shingle so he sits serene and huge against the storm sky; the radial focus lines stop dead around him like a still wheel (lines, NOT a halo, no glow). Accent: the red-orange kasaya under the low sun.',
		['dochim'],
		{ hat: false }
	),
	intro(
		'bra-intro-sangji',
		'is seven feet tall',
		'Heukchi Sangji, seven feet tall, refuses to pose and glares down from under his plume',
		'Heukchi Sangji, seven feet tall, standing dead still with his arms flat at his sides, refusing to pose, glaring down at the lens; extreme worm’s-eye from the shingle at his boots so he towers like a gate-post; black-lacquered lamellar, tall red plume, his long gilt-headed spear upright beside him like a second spine; behind him the grey stone wall of Juryu. The focus lines slam toward him and he does not move. Accent: the maroon robe at his skirt.',
		['sangji']
	),
	intro(
		'bra-intro-sangya',
		'does not look up from the ledger',
		'Satek Sangya in his tall gilt cap stands on a beached boat reading his ledger, not looking up',
		'Satek Sangya in the tall pointed openwork gilt-bronze noble cap, planted square-footed on the gunwale of a beached boat, NOT looking at the viewer: head down, reading a long unrolled bamboo-slip ledger, one thick finger counting, a string of square-holed bronze coins swinging from his sash; beside him stacked rice bales, coils of rope and bundled arrows on the shingle. Dutch tilt, low three-quarter. Accent: the gilt cap and bronze coins catching the low sun.',
		['sateksangya']
	),
	intro(
		'bra-intro-boksin',
		'does the arms exactly as rehearsed',
		'Gwishil Boksin plants the red shaft in the shingle and throws out his arm in the rehearsed pose',
		'Gwishil Boksin at the centre of the shingle planting a long red-lacquered shaft into the stones with one fist, the other arm thrown out in a sweeping rehearsed pose, the long topknot tail whipping behind his bald head, scowl split into a fierce grin; a wooden tally board with blank brush strokes (no readable writing) propped at his feet. Low dutch angle, radial focus lines converging on his face. Accent: the slate-blue robe and the red shaft.',
		['boksin']
	),
	intro(
		'bra-intro-pung',
		'and he ad-libs',
		'King Pungjang, given no line, half-raises a hand and ad-libs while the generals watch',
		'King Pungjang in the red king’s robe and Baekje crown, caught mid-gesture with one hand half-raised as if unsure, eyes darting sideways, a small uncertain smile; behind him the rough generals as dark out-of-focus silhouettes watching him. Over-the-shoulder from a general’s armoured shoulder blurred in the foreground, slight dutch. The focus lines converge on him and he looks as if he wishes they would not. Accent: gold light on the crown’s flame ornaments.',
		['pung']
	),
	{
		id: 'bra-roll-call',
		entry: ENTRY,
		at: 'Takutsu and the admiral land it perfectly',
		alt: 'The Baekje Restoration Army strikes its group pose on the shingle at sunset, half of them getting it wrong',
		scene: `${INTRO} Wide low shot along the shingle at sunset: seven figures in a ragged line striking a group pose, silhouetted against the blazing low sun on the sea, rim-lit by it: at one end a huge fur-caped bearded admiral and a young Yamato captain with white headband tails both nailing a perfect dramatic pose; a seated monk with a ringed staff doing half of it; a stocky lord in a tall pointed gilt cap still reading a scroll; a giant general with folded arms and a tall plume; a shaven-headed general in the centre with a long red shaft flung wide; and a crowned king one beat late, on the wrong foot. Radial focus lines burst from the sun. Heroic, comic and a little sad. Accent: the sun.`,
		canon: { with: ['dress:baekje'] }
	}
];

fs.writeFileSync(MANIFEST, JSON.stringify(items, null, '\t') + '\n');
console.log(`wrote ${items.length} manifest items`);
