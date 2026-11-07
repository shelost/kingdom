/**
 * The nine human nations: civilizations, not dynastic borders.
 *
 * Display English is the Korean period reading (RR). Modern / other readings
 * live in `aliases` and `sobriquets`. Wiki ids stay stable.
 *
 * | Wiki id          | Name (EN)  | Korean     | Modern / alt                         | Map label (`cosmos.ts`)      |
 * | samhan           | Samhan     | 삼한 三韓  | Han, Joseon, Korea                   | `samhan`                     |
 * | wa               | Yamato     | 왜국 倭國  | Wa, Waeguk, Japan, Ilbon             | `japan-wa`                   |
 * | hwa              | Huaxia     | 화하 華夏  | Hua, China, Zhonghua, Western Lands  | `hwa`                        |
 * | northern-nomads  | Bukjeok    | 북적 北狄  | Northern Nomads, Turks               | `northern-nomads`            |
 * | tubo             | Tubo       | 토번 吐蕃  | Tibet, Tufan                         | `tubo`                       |
 * | cheonchuk        | Chunchuk   | 천축 天竺  | Cheonchuk, India, Five Indias        | `cheonchuk`                  |
 * | persia           | Pasa       | 파사 波斯  | Persia; Daesik after 651             | `persia` / `daesik`          |
 * | bullim           | Bulim      | 불림 拂菻  | Rome, Fulin, Daqin                   | `bullim`                     |
 * | southern-seas    | Namyang    | 남양 南洋  | Southern Seas, Kunlun, Nanhai        | `southern-seas`              |
 *
 * Turks stay inside `northern-nomads` (map label `turks` is a people line, `people: true`,
 * hosted on `northern-nomads`). Do not mint a Turk nation.
 * Polity pages (Silla, Tang, Wa’s court) keep their own ids and list a
 * civilization in `groups`.
 *
 * Two rings, named from the peninsula. Softness grows with distance.
 * Near Lands · 옆나라 — Samhan, Yamato, Huaxia, Bukjeok
 * Far Lands · 먼나라 — Tubo, Chunchuk, Pasa, Bulim, Namyang
 */

import type { Person } from '$lib/people';

/** Profile ids of the nine worlds. */
export const CIVILIZATION_IDS = [
	'samhan',
	'wa',
	'hwa',
	'northern-nomads',
	'tubo',
	'cheonchuk',
	'persia',
	'bullim',
	'southern-seas'
] as const;

export type CivilizationId = (typeof CIVILIZATION_IDS)[number];

/** Which ring a civilization sits in, counted from the peninsula. */
export const LAND_RINGS = {
	near: {
		en: 'Near Lands',
		ko: '옆나라',
		ids: ['samhan', 'wa', 'hwa', 'northern-nomads'] as const
	},
	far: {
		en: 'Far Lands',
		ko: '먼나라',
		ids: ['tubo', 'cheonchuk', 'persia', 'bullim', 'southern-seas'] as const
	}
} as const;

const NEAR = { en: LAND_RINGS.near.en, ko: LAND_RINGS.near.ko };
const FAR = { en: LAND_RINGS.far.en, ko: LAND_RINGS.far.ko };

/**
 * How living mouths describe the walk to 서천꽃밭. The Far Lands are stations on that
 * road; past them the map becomes myth (the threefold path, Mujangsung, three thousand li).
 */
export const WEST_ROAD_ADVICE = {
	en: 'Cross the Western Empire, around the Land of Air and the Land of Earth, through the Land of Fire and the Land of Water, until you come to the threefold path. Take the middle path. Confront Mujangsung. Then go three thousand li further.',
	ko: '서쪽 제국을 건너, 바람의 땅과 대지의 땅을 돌아, 불의 땅과 물의 땅을 지나, 세 갈래 길에 이르러라. 가운데 길로 가라. 무장승을 만나고, 거기서 삼천 리를 더 가라.',
	fork: {
		en: 'Right is paradise. Left is hell. The middle road is Seocheon — the Western Flower Field.',
		ko: '오른쪽은 극락, 왼쪽은 지옥, 가운데가 서천서역국 — 서천꽃밭 가는 길이다.'
	}
} as const;


/**
 * Polity nation-pages that sit inside a civilization, in reading order.
 * The same ids are on each polity’s `groups`, so the kingdom page links up.
 */
export const POLITIES_OF: Record<string, readonly string[]> = {
	samhan: [
		'nation-joseon',
		'nation-buyeo',
		'nation-jolbon',
		'nation-goguryeo',
		'nation-baekje',
		'nation-silla',
		'nation-gaya',
		'nation-tamla'
	],
	hwa: ['nation-tang'],
	wa: ['nation-yamato']
};

/** A famous name of a civilization; `id` links the wiki profile when the chronicle has one. */
export type Famous = { en: string; ko: string; note: string; id?: string };

/** The best-known people of each civilization, most famous first. */
export const FAMOUS_OF: Record<CivilizationId, readonly Famous[]> = {
	samhan: [
		{ en: 'Dangun', ko: '단군', id: 'dangun', note: 'Founder of Joseon in the legend' },
		{ en: 'Jumong', ko: '주몽', id: 'jumong', note: 'The archer who founded Goguryeo' },
		{ en: 'Gwanggaeto', ko: '광개토왕', id: 'gwanggaeto', note: 'Goguryeo’s widest conqueror' },
		{ en: 'Queen Seondeok', ko: '선덕여왕', id: 'sunduk', note: 'Silla’s first reigning queen' },
		{ en: 'Kim Yushin', ko: '김유신', id: 'yushin', note: 'The general who unified the peninsula' },
		{ en: 'Yeon Gaesomun', ko: '연개소문', id: 'gesomun', note: 'Goguryeo’s dictator, who held off the Tang' },
		{ en: 'Gyebaek', ko: '계백', id: 'gyebek', note: 'Baekje’s last stand at Hwangsan' },
		{ en: 'Wonhyo', ko: '원효', note: 'The monk who brought Buddhism to the street' }
	],
	hwa: [
		{ en: 'Confucius', ko: '공자', note: 'Teacher of rites and the five relations' },
		{ en: 'Laozi', ko: '노자', note: 'Said to have written the Tao Te Ching' },
		{ en: 'Qin Shi Huang', ko: '진시황', note: 'First emperor; one script, one wall' },
		{ en: 'Emperor Taizong', ko: '당 태종', id: 'taizong', note: 'The Tang emperor who came to Ansi' },
		{ en: 'Wu Zetian', ko: '측천무후', id: 'wuzetian', note: 'The only woman to rule as emperor' },
		{ en: 'Xuanzang', ko: '현장', note: 'Walked to India for the sutras' },
		{ en: 'Li Bai', ko: '이백', note: 'The poet of wine and the moon' }
	],
	wa: [
		{ en: 'Prince Shōtoku', ko: '쇼토쿠 태자', id: 'shotoku', note: 'Regent, Buddhist patron, author of the Seventeen Articles' },
		{ en: 'Emperor Tenji', ko: '덴지 천황', id: 'tenji', note: 'Struck down the Soga; sent the fleet to the White River' },
		{ en: 'Emperor Kōtoku', ko: '고토쿠 천황', id: 'kotoku', note: 'Reigned over the Taika reforms' },
		{ en: 'Soga no Umako', ko: '소가노 우마코', note: 'The minister who built Asuka-dera' },
		{ en: 'Fujiwara no Kamatari', ko: '후지와라노 가마타리', note: 'Founder of the Fujiwara house' },
		{ en: 'Empress Jitō', ko: '지토 천황', note: 'Built Fujiwara-kyō, the first grid capital' },
		{ en: 'Kakinomoto no Hitomaro', ko: '가키노모토노 히토마로', note: 'The great poet of the Man’yōshū' }
	],
	'northern-nomads': [
		{ en: 'Modu Chanyu', ko: '묵돌 선우', note: 'Forged the Xiongnu and humbled the Han' },
		{ en: 'Bumin Qaghan', ko: '부민 가한', note: 'Founder of the Turk khaganate' },
		{ en: 'Ashina She’er', ko: '아사나사이', id: 'ashinasheer', note: 'A Turk prince turned Tang general' },
		{ en: 'Tonyukuk', ko: '톤유쿠크', note: 'The old counsellor who carved his own stone' },
		{ en: 'Kül Tegin', ko: '퀼 테긴', note: 'The prince whose stele speaks Turkic' },
		{ en: 'Bilge Qaghan', ko: '빌게 가한', note: 'The wise khan of the second khaganate' }
	],
	tubo: [
		{ en: 'Songtsen Gampo', ko: '송첸감포', note: 'Unified Tibet and took a Tang bride' },
		{ en: 'Princess Wencheng', ko: '문성공주', note: 'The Tang bride who brought the Jowo Buddha' },
		{ en: 'Thonmi Sambhota', ko: '톤미 삼보타', note: 'Made the Tibetan script from an Indian one' },
		{ en: 'Gar Tongtsen', ko: '가르 통첸', note: 'The minister who won the Tang bride' },
		{ en: 'Trisong Detsen', ko: '티송데첸', note: 'The king whose armies took Chang’an' },
		{ en: 'Padmasambhava', ko: '파드마삼바바', note: 'The guru who tamed the mountain spirits' }
	],
	cheonchuk: [
		{ en: 'The Buddha', ko: '석가모니', note: 'The prince who woke up' },
		{ en: 'Ashoka', ko: '아소카', note: 'The emperor who carved the dharma on pillars' },
		{ en: 'Nāgārjuna', ko: '용수', note: 'Philosopher of emptiness' },
		{ en: 'Harsha', ko: '하르샤', note: 'King who hosted Xuanzang' },
		{ en: 'Kālidāsa', ko: '칼리다사', note: 'The greatest Sanskrit poet' },
		{ en: 'Āryabhaṭa', ko: '아리아바타', note: 'Astronomer of the turning earth' }
	],
	persia: [
		{ en: 'Zoroaster', ko: '조로아스터', note: 'Prophet of the good fire' },
		{ en: 'Cyrus the Great', ko: '키루스 대왕', note: 'Founder of the first Persian empire' },
		{ en: 'Khosrow I', ko: '호스로 1세', note: 'The just king of the Sasanians' },
		{ en: 'Mani', ko: '마니', note: 'Prophet of light and dark' },
		{ en: 'Yazdegerd III', ko: '야즈데게르드 3세', note: 'The last Sasanian king' },
		{ en: 'Peroz III', ko: '페로즈 3세', note: 'His son, who fled to Chang’an' }
	],
	bullim: [
		{ en: 'Augustus', ko: '아우구스투스', note: 'First emperor of Rome' },
		{ en: 'Constantine', ko: '콘스탄티누스', note: 'Founded the city on the Bosporus' },
		{ en: 'Justinian', ko: '유스티니아누스', note: 'Built Hagia Sophia and wrote the law' },
		{ en: 'Theodora', ko: '테오도라', note: 'The actress who became empress' },
		{ en: 'Belisarius', ko: '벨리사리우스', note: 'Justinian’s general' },
		{ en: 'Heraclius', ko: '헤라클리우스', note: 'Beat Persia, then lost the east to the Arabs' }
	],
	'southern-seas': [
		{ en: 'Kaundinya and Soma', ko: '카운디냐와 소마', note: 'The founding couple of Funan' },
		{ en: 'Jayanasa', ko: '자야나사', note: 'Founder of Srivijaya' },
		{ en: 'Jayavarman II', ko: '자야바르만 2세', note: 'Founder of Angkor, the god-king' },
		{ en: 'Queen Shima', ko: '시마 여왕', note: 'Kalingga’s queen, so just no one stole from the road' },
		{ en: 'Samaratungga', ko: '사마라퉁가', note: 'The king who finished Borobudur' }
	]
};

export const CIVILIZATIONS: Person[] = [
	{
		id: 'samhan',
		name: 'Samhan',
		korean: '삼한',
		hanja: '三韓',
		entity: 'nation',
		kingdom: 'other',
		color: '#1a4d6d',
		realm: NEAR,
		title: 'The Three Hans',
		summary: {
			en: 'Near Lands. The peninsula is the heartland. The Three Kingdoms sit inside it.',
			ko: '옆나라. 반도가 본토다. 삼국은 그 안에 있다.'
		},
		tagline: 'Joseon is the old name of this world. Goguryeo, Baekje, Silla and Gaya are its kingdoms.',
		nature:
			'Samhan is a Near Land, the home ring, and the Korean civilization. The heartland is the peninsula itself. Goguryeo, Baekje, Silla and Gaya are polities inside that heartland, the way a dynasty is a polity inside Hwa. The civilizational reach takes in the older houses around it: Joseon, Buyeo, Jolbon, Tamla. This close to home, the edge is the sharpest of the nine. Joseon is the older name of the same world: the mandate Dangun is said to have opened, and the word later crowns still answer to. In 651 Tang Gaozong’s letter already calls them the three kingdoms east of the sea, and their people the people of the Three Han. Haedong is that Tang frame. Samhan is the name the peninsula kept. Buyeo and Jolbon are the parent houses. Tamla is the island that shares the language of myth. A border between Sabi and Surabol is a quarrel inside one nation, the way a border between dynasties never made two Chinas.',
		natureKo:
			'삼한은 옆나라이고, 아홉 문명 가운데 집의 고리이며, 한반도의 문명이다. 본토는 반도 자체다. 고구려와 백제와 신라와 가야는 그 본토 안의 나라다. 화가 왕조를 품듯, 삼한이 삼국을 품는다. 문명의 닿음은 그 둘레의 더 오랜 집까지다. 조선, 부여, 졸본, 탐라. 집에서 가장 가까우므로 경계가 아홉 가운데 가장 또렷하다. 조선은 같은 세계의 더 오래된 이름이다. 단군이 열었다고 하는 명의 이름이고, 뒤의 왕조가 여전히 대답하는 말이기도 하다. 651년 당 고종이 의자왕에게 보낸 글은 이 셋을 해동삼국이라 하고, 그 백성을 삼한의 백성이라 불렀다. 해동은 당이 만들어 준 틀이고, 삼한은 반도가 간직한 이름이다. 부여와 졸본은 그 부모 집이다. 탐라는 신화의 말을 같이 쓰는 섬이다. 사비와 서라벌 사이의 경계는 한 문명 안의 다툼이다.',
		arc:
			'What a Samhan writer or a Chinese historian used to tell them apart was cut, cap and colour, and even that was a family resemblance. The Sanguozhi account of the eastern peoples says Buyeo prized white at home: wide sleeves, robes and trousers, leather shoes, and abroad the great men added fox, sable and hats trimmed in gold and silver. Goguryeo met in brocade. Its great officers wore the jeolpung, a bent cap like a byeon, which the later murals and the Jougwan still remember as feathers. Yijing, writing in 691, says the west called Goguryeo Kukkuṭeśvara, honoured for a rooster, and that its men wore feathers in their caps. The Afrasiab mural at Samarkand paints the same feathered caps. Baekje, in the Book of Sui, dresses in that Goguryeo line and then makes it courtly: a black silk cap and the Antler Crown, and for the great clans the Gilt Hood. Gaya’s Leaf Crown is grass in gold over iron towns. Silla’s Tree Crown is a forest of sheet gold. In 649 the Samguk Sagi says Silla first put on the robes and caps of the Middle Court. That is a dated change of fashion at Surabol, after centuries of its own silk. Commoners across the kingdoms wear plain undyed white. The costume charts are ref_hanbok_gojoseon.png, ref_hanbok_goguryeo.png, ref_hanbok_baekje_gaya.png and ref_hanbok_silla.png. They write in Chinese for the state, and they keep mountain gods, bone rank, and a Buddhism that arrives kingdom by kingdom. Pyongyang, Sabi and Surabol argue. They argue in one world.',
		arcKo:
			'삼국을 가른 것은 옷의 선과 관과 색이었고, 그마저 한 집안의 닮음이었다. 삼국지 동이전은 부여가 나라 안에서는 흰옷을 귀히 여긴다고 적는다. 넓은 소매, 포와 고, 가죽신. 밖에 나갈 때 대인은 여우와 담비를 더하고 금은으로 모자를 꾸민다. 고구려는 대회에 금수로 꾸몄다. 대가의 관은 절풍이고, 뒤의 벽화와 조우관은 그 관을 깃으로 기억한다. 의정은 691년에, 서역이 고구려를 닭을 받드는 나라라 부르고 남자들이 관에 깃을 꽂는다고 적는다. 사마르칸트의 아프라시압 벽화에도 그 깃관이 있다. 수서는 백제의 옷을 고구려의 계열로 적고, 사비는 그것을 조정으로 만든다. 검은 비단 관과 뿔관, 대성에게는 금동관. 가야의 잎관은 쇠 고을 위의 풀잎이다. 신라의 나무관은 얇은 금의 숲이다. 삼국사기는 649년, 신라가 비로소 중조의 의관을 입었다고 적는다. 서라벌의 유행이 바뀐 해이지, 문명이 바뀐 해가 아니다. 어느 나라에서나 백성은 물들이지 않은 흰옷이다. 도표는 ref_hanbok_gojoseon.png, ref_hanbok_goguryeo.png, ref_hanbok_baekje_gaya.png, ref_hanbok_silla.png. 나라는 한문으로 적고, 산신과 골품과 나라마다 다른 때에 도착한 불교를 같이 둔다. 평양과 사비와 서라벌은 다툰다. 한 세계에서 다툰다.',
		events: [
			{ year: -2333, label: 'Joseon: the legend’s date for Dangun at Asadal. The name outlives the walls.' },
			{ year: 414, label: 'Gwanggaeto Stele: a Goguryeo world of Buyeo, Baekje, Silla, Gaya and Wa.' },
			{ year: 649, label: 'Samguk Sagi, Jindeok 3: Silla first wears the robes and caps of the Middle Court.' },
			{ year: 651, label: 'Tang letter to Uija: the three kingdoms east of the sea, the people of the Three Han.' },
			{ year: 691, label: 'Yijing: the west calls Goguryeo the rooster-honoured land; feathered caps.' }
		],
		sobriquets: ['Han', 'Haedong', 'the Three Han', 'Joseon', 'East of the Sea'],
		photo: '/civ/civ_samhan_rite.jpg',
		stills: [
			'/civ/civ_samhan_rite.jpg',
			'/ref_hanbok_gojoseon.png',
			'/ref_hanbok_goguryeo.png',
			'/ref_hanbok_baekje_gaya.png',
			'/ref_hanbok_silla.png'
		],
		aliases: [
			'Samhan',
			'Han',
			'韓',
			'한',
			'삼한',
			'三韓',
			'Haedong',
			'the Three Han',
			'Three Han',
			'Joseon',
			'Korea',
			'East of the Sea',
			'the Korean world'
		]
	},
	{
		id: 'wa',
		name: 'Yamato',
		korean: '왜국',
		hanja: '倭國',
		entity: 'nation',
		kingdom: 'other',
		color: '#ec4899',
		realm: NEAR,
		title: 'The Eastern Islands',
		summary: {
			en: 'Near Lands. The main islands are the heartland. Waeguk until 670, then Ilbon.',
			ko: '옆나라. 큰 섬들이 본토다. 670년까지 왜국, 그 뒤는 일본.'
		},
		tagline: 'The islands east of Samhan. Yamato · 왜국 until 670, when they took the name Ilbon.',
		stages: [
			{
				id: 'ilbon',
				from: 670,
				name: 'Ilbon',
				korean: '일본',
				hanja: '日本',
				title: 'Nihon · Japan',
				label: 'From 670'
			}
		],
		nature:
			'Japan is a Near Land, one strait from Samhan. The heartland is the main islands and the Yamato court in the Nara basin. The civilizational reach is the sea lane that learned from Baekje and then from Hwa, and the islands that court claimed, out to the Hairy People and, in Chinese myth geography, Fusang. A Korean knew this world by ships, so the edge is clear and still a little soft at the eastern islands. Koreans wrote it 倭, Wa, through the seventh century. The Gwanggaeto Stele already fights Wa. In 670 the Samguk Sagi, copying the Tang history, says Wa changed its name to Ilbon, because they are near where the sun comes out. The Book of Sui had already kept their own letter of 607, the Son of Heaven where the sun rises writing to the Son of Heaven where the sun sets. Yamato is the Nara-basin reading. No Korean source of the age spells that reading. The Nihon Shoki of 720 is the islands’ own book, useful and secondary. Fusang, in Chinese myth geography, is the sunrise land further out. The Hairy People in the fifth-century Wa king’s letter are the eastern edge of the same island world.',
		natureKo:
			'일본은 옆나라이고, 삼한에서 해협 하나다. 본토는 큰 섬들과 나라 분지의 야마토 조정이다. 문명의 닿음은 백제에게 배우고 뒤에 화에게 배운 바닷길이고, 그 조정이 자기 것이라 한 섬들이며, 동쪽의 모인과 중국 신화 지리의 부상까지다. 한국 사람은 이 세계를 배로 알았다. 경계는 또렷하고, 동쪽 섬에서 조금 부드럽다. 7세기까지 한반도의 글은 이 문명을 왜로 적었다. 광개토왕비에 이미 왜가 있다. 670년 삼국사기는 당의 역사를 베끼며, 왜가 이름을 일본으로 고쳤다고 적는다. 해가 나오는 곳에 가깝다는 그들 자신의 말이다. 수서는 607년의 편지를 남겨 두었다. 해 뜨는 곳의 천자가 해 지는 곳의 천자에게 쓴 글이다. 야마토는 나라 분지의 읽기이고, 그 시대의 한국 자료는 그렇게 적지 않는다. 720년의 일본서기는 섬의 자기 책이다. 쓸모가 있고, 두 번째 자료다. 부상은 중국 신화 지리의 더 먼 해돋이 땅이다. 5세기 왜왕 편지 속의 모인은 같은 섬 세계의 동쪽 끝이다.',
		arc:
			'Dress is how the Wei and Sui writers marked the islands off from Samhan. The third-century account already notes an unsewn cross-cloth, lengths of fabric tied rather than cut and stitched. The Book of Sui still has men and women binding the head in white cloth, jackets with narrow sleeves, lacquered shoes tied at the ankle, and commoners often barefoot. Gold and silver were not for everyone. That is a different head from the Jougwan. Two feathers on a black cap meant the peninsula. A white cloth on the brow meant the islands. Through the seventh century the court in Asuka takes continental rank-caps and colour grades. The Nihon Shoki tells that reform in its own voice. Baekje had been the teacher: writing, Buddhism, temple plans, and the guesthouse at Naniwa that the Sui envoys found sitting under a newer roof built for them. A Baekje wooden tablet from Sabi even writes a Naniwa clan name. The civilization stays one when the name changes. Wa and Ilbon are the same world on the chronicle’s slider, 670 the hinge.',
		arcKo:
			'옷이 왜와 삼한을 갈랐다. 3세기 위서의 왜인전은 이미 꿰매지 않은 횡폭을 적는다. 천을 잘라 바느질하기보다 묶어 입는 옷이다. 수서에도 남녀가 흰 베로 머리를 동이고, 소매가 좁고, 신에 옻을 칠해 발목에 매며, 백성은 맨발인 경우가 많다. 금은은 아무나 쓰지 못했다. 조우관과는 다른 머리다. 검은 관에 깃 두 개면 반도이고, 이마의 흰 베면 섬이다. 7세기에 아스카의 조정은 대륙의 관등과 색을 가져온다. 일본서기가 그 개혁을 자기 목소리로 전한다. 스승은 백제였다. 글과 불교와 절의 설계, 그리고 난파의 고구려 객관. 수나라 사신은 그 위에 새로 지은 객관에 들었다. 사비의 목간에는 난파 씨족의 이름까지 적혀 있다. 이름이 바뀌어도 문명은 하나다. 왜와 일본은 연대기 시간축 위의 같은 세계이고, 670년이 그 경첩이다.',
		events: [
			{ year: 414, label: 'Gwanggaeto Stele: Wa is already a power across the water.' },
			{ year: 478, label: 'Book of Song: Wa king Bu’s letter, hairy men to the east, Haebuk to the west.' },
			{ year: 607, label: 'Book of Sui: the sunrise Son of Heaven writes to the sunset Son of Heaven.' },
			{ year: 670, label: 'Samguk Sagi, Munmu 10: Wa changes its name to Ilbon, near where the sun comes out.' }
		],
		sobriquets: ['Waeguk', 'Wa', 'Japan', 'Ilbon', 'Nihon', 'Where the Sun Comes Up'],
		photo: '/civ/civ_wa_rite.jpg',
		stills: ['/civ/civ_wa_rite.jpg'],
		aliases: [
			'Yamato',
			'Waeguk',
			'Wa',
			'왜',
			'왜국',
			'倭',
			'倭國',
			'Japan',
			'Ilbon',
			'Nihon',
			'Where the Sun Comes Up'
		]
	},
	{
		id: 'hwa',
		name: 'Huaxia',
		korean: '화하',
		hanja: '華夏',
		entity: 'nation',
		kingdom: 'other',
		color: '#b45309',
		realm: NEAR,
		title: 'The Western Empire',
		summary: {
			en: 'Near Lands. China proper is the heartland. The court outlives the dynasty. Subtitle: 서토, Western Lands.',
			ko: '옆나라. 중국 본토가 심장이다. 조정은 왕조보다 오래 간다. 부제: 서토.'
		},
		tagline: 'Huaxia · 서토. Dynasties change. The civilizational world does not.',
		nature:
			'Hwa is a Near Land. Kings from Samhan went there in person, so the heartland is sharp: China proper, east of the Tibetan plateau and south of the nomad band, with Chang’an as its city. The civilizational reach is wider than any dynasty. Protectorates, the script, and the robes other courts copy are how far the court can still be felt. A dynasty is a roof on that heartland. 華 is the short name, “the flowered centre.” The name a Silla king actually says is older and more precise. In 648, in the Samguk Sagi, Chunchu tells the Tang he has served the Heavenly Court for years, and asks to follow the Zhonghua system of dress. The next year the annals say Silla first wore the robes and caps of the Middle Court. 천조 and 중조 are the Korean words. 중화 is the system. Hyecho, travelling in 727, calls the same land the Han land, and Chinese monks Han monks, and says Persian ships run to Guangzhou there. Dynasties are episodes inside this world. Han, the southern courts, Sui, Tang. The West in this chronicle is the Tang episode. The civilization is the court those dynasties keep inheriting. Chang’an is its city. A protectorate stamped on a neighbour is the court’s reach, a claim, a season.',
		natureKo:
			'화는 옆나라다. 삼한의 왕이 몸소 갔으므로 본토가 또렷하다. 티베트 고원의 동쪽, 북적 띠의 남쪽, 중국 본토이고, 장안이 그 도시다. 문명의 닿음은 어느 왕조보다 넓다. 도호부와 글과, 다른 조정이 베끼는 옷이, 조정이 아직 느껴지는 자리다. 왕조는 그 본토 위의 지붕이다. 화는 짧은 이름이다. 신라 왕이 실제로 부른 말은 더 또렷하다. 648년 삼국사기에서 춘추는 여러 해 천조를 섬겨 왔다고 말하고, 옷은 중화의 제도를 따르게 해 달라고 청한다. 이듬해 사기는 신라가 비로소 중조의 의관을 입었다고 적는다. 천조와 중조가 한국의 말이고, 중화가 그 제도다. 727년의 혜초는 같은 땅을 한지라 하고, 중국 승려를 한승이라 하며, 페르시아 배가 광주로 간다고 적는다. 왕조는 이 세계 안의 에피소드다. 한, 남조의 여러 조정, 수, 당. 이 연대기에서 서국은 당이라는 에피소드다. 문명은 그 왕조들이 물려 받는 조정이다. 장안이 그 도시다. 이웃에 찍힌 도호부는 조정의 팔이 닿은 자리고, 주장이고, 한 계절이다.',
		arc:
			'Tang dress is the look the neighbours copy when they want to be read as civilized. Men who matter tie the hair under a black gauze Futou, two tails at the back, and wear a round-collar robe. Yellow is the emperor’s colour. Roofs in the capital are grey and green-glazed, walls vermilion and white. The Samguk Sagi treats that wardrobe as a decision: 649 for the men of Silla, and under Munmu the women follow. Before that decision, a Samhan envoy in Chang’an was visible by the Jougwan. After it, he was trying to look like the room. The Liang tribute scroll of the 530s already lines the world’s envoys up in one painting, Baekje beside Persia, each in his own cut, so a Chinese court could tell them apart at a glance. Writing is the other uniform. The state script of Hwa is what Samhan, Wa and the western roads all borrow. Buddhism and the Daoist isles travel on the same pages. Hyecho’s “Han land” is the pilgrim’s word for this whole world, dynasty unnamed, because the road cares about the port and the monastery more than about the reign title.',
		arcKo:
			'당의 옷은 이웃이 문명으로 읽히고 싶을 때 베끼는 꼴이다. 사람이 되려면 머리를 검은 사라 복두 아래 동이고, 뒤에 꼬리 두 개를 늘어뜨리고, 둥근 깃의 포를 입는다. 노랑은 황제의 색이다. 도성의 지붕은 회색과 녹색 유약이고, 벽은 주홍과 흰색이다. 삼국사기는 그 옷장을 결단으로 적는다. 649년에 신라의 남자, 문무왕 때에 여자. 그 결단 전에 장안의 삼한 사신은 조우관으로 보였고, 뒤에는 그 방과 닮으려고 했다. 530년대의 양직공도는 이미 세상의 사신을 한 그림에 세운다. 백제 옆에 페르시아, 각자 자기 옷감. 중국 조정이 한눈에 가를 수 있게. 글이 또 하나의 제복이다. 화의 나라 글은 삼한과 왜와 서역의 길이 빌려 가는 글이다. 불교와 도교의 섬도 같은 종이 위를 간다. 혜초의 한지는 왕조 이름을 뺀 순례자의 말이다. 길에는 항구와 절이 연호보다 중요해서다.',
		events: [
			{ year: 648, label: 'Samguk Sagi, Jindeok 2: Chunchu says he has served the Heavenly Court, and asks for Zhonghua dress.' },
			{ year: 649, label: 'Jindeok 3: Silla first wears the robes and caps of the Middle Court.' },
			{ year: 727, label: 'Hyecho: Persian ships run to Guangzhou in the Han land. Chinese monks are Han monks.' }
		],
		sobriquets: ['the Heavenly Court', 'the Middle Court', 'Zhonghua', 'the Han land', 'Western Lands'],
		photo: '/civ/civ_hwa_rite.jpg',
		stills: ['/civ/civ_hwa_rite.jpg'],
		aliases: [
			'Huaxia',
			'Hua',
			'Hwa',
			'화',
			'화하',
			'華',
			'華夏',
			'China',
			'the Heavenly Court',
			'Heavenly Court',
			'Cheonjo',
			'the Middle Court',
			'Middle Court',
			'Zhonghua',
			'the Han land',
			'Han land',
			'Western Lands',
			'서토'
		]
	},
	{
		id: 'northern-nomads',
		name: 'Bukjeok',
		korean: '북적',
		hanja: '北狄',
		entity: 'nation',
		kingdom: 'other',
		color: '#5e5240',
		realm: NEAR,
		title: 'The Northern Nomads',
		summary: {
			en: 'Near Lands. The band north of China and Korea. Turks live inside it.',
			ko: '옆나라. 중국과 고구려 북쪽의 띠. 돌궐은 그 안에 산다.'
		},
		tagline: 'The old Northern Plains: steppe riders and forest hunters north of Huaxia and Samhan. Turks live here.',
		nature:
			'Northern Nomads are a Near Land, the band directly north of Hwa and north of Goguryeo. The heartland is that band, from north of China through north of Korea, and it stops at the Altai. Turks, Khitan, Mohe and the later Jurchen are peoples inside it. There is no separate Turk nation. The civilizational reach is the felt-and-leather life they share. Past the Altai the grass goes on, and a Korean record of it grows soft. Chinese books file them under the old quarter-name 北狄, the northern peoples. The chronicle’s map used to say Northern Plains, 막북, the land north of the desert. That is the region. This is the nation those peoples share. The Turks are inside it. So are the Khitan, the Mohe, the Shiwei, the Rouran before the Turks broke them, and the Tiele. The Jurchen are the later name of the forest tradition. Seventh-century books say Mohe. The Goguryeo annals for 551 already have Turks besieging a fortress. Hyecho meets Turkish kings ruling Gandhara, Kapisa and Zabul. The Kül Tegin inscription of 732, in Turkic, remembers Goguryeo among the eastern peoples at a khagan’s funeral, under the name Bökli. One felt-and-leather world, many khagans. A new qaghanate is a new roof. It is the same grass.',
		natureKo:
			'북적은 옆나라이고, 화의 바로 북쪽이자 고구려의 바로 북쪽인 띠다. 본토는 그 띠다. 중국의 북쪽에서 고려의 북쪽까지이고, 알타이에서 멈춘다. 돌궐과 거란과 말갈과, 나중에 여진이라 불린 사람들은 그 안의 백성이다. 돌궐만의 나라는 없다. 문명의 닿음은 그들이 같이 쓰는 펠트와 가죽의 삶이다. 알타이 너머로 풀은 이어지고, 한국 기록은 거기에서 부드러워진다. 중국 책은 이들을 옛 사방 이름인 북적에 넣는다. 연대기의 지도는 이 땅을 북방 초원, 막북이라 불러 왔다. 막북은 지역이고, 북적은 그 사람들이 같이 사는 나라다. 돌궐은 그 안이다. 거란도, 말갈도, 실위도, 돌궐이 깨기 전의 유연도, 철륵도 그 안이다. 여진은 숲의 전통이 나중에 얻은 이름이다. 7세기의 책은 말갈이라 한다. 고구려 양원왕 7년의 기록에는 이미 돌궐이 성을 에워싼다. 혜초는 건타라와 계빈과 사율에서 돌궐 왕을 만난다. 732년의 퀼 테긴 비문은 돌궐어로, 카간의 장례에 모인 동쪽 사람들 속에 고구려를 뵈클리라는 이름으로 기억한다. 펠트와 가죽의 한 세계, 많은 카간. 새 칸국은 새 지붕이다. 풀은 같다.',
		arc:
			'Court writers told the steppe from the sown by hair, closure and house. The Turk accounts in the Zhou and Sui histories give braided hair, tents of felt, and a people who move with water and grass. The left-closing robe is the old shelf’s mark for a life that is not the Middle Court. The Khitan, west of Goguryeo on the Shira Muren, appear on the Gwanggaeto Stele’s campaigns and later as Tang auxiliaries sent across the Liao marshes. The Rouran are the felt empire before 552. The Mohe are the other half of this nation, and the Book of Sui is careful about them. It lists seven tribes, Sokmal through Heuksu and Baeksan, and it describes hunters: poison on the arrows, houses of timber roofed with earth, pigs where the steppe counts horses. Shiwei, north of the Khitan, bought iron from Goguryeo. A Samhan soldier meeting Turks at a fortress and a Samhan soldier meeting Mohe in the northeast forest is meeting two peoples of one civilization. He is meeting riders and hunters. He is in the same north. There is no separate Turk nation in this wiki. The Turks are the most famous roof on this grass, and for a while the largest.',
		arcKo:
			'조정의 글은 머리와 옷섶과 집으로 초원을 농경에서 갈랐다. 주서와 수서의 돌궐전은 땋은 머리, 펠트 장막, 물과 풀을 따라 옮기는 삶을 적는다. 왼쪽으로 여미는 옷은 중조가 아닌 삶을 가리키는 옛 책장의 표지다. 거란은 고구려 서쪽 시라무렌의 사람들이고, 광개토왕비의 전쟁과, 뒤에는 요택을 건너게 한 당의 번병에 나타난다. 유연은 552년 전의 펠트 제국이다. 말갈은 이 나라의 다른 반쪽이고, 수서는 그들을 조심해서 적는다. 속말에서 흑수와 백산까지 일곱 부족. 화살에 독을 바르는 수렵, 나무 위에 흙을 덮은 집, 초원이 말을 세는 자리에서 돼지. 거란 북쪽의 실위는 고구려에서 쇠를 샀다. 성 앞에서 돌궐을 만난 삼한의 군인과, 동북쪽 숲에서 말갈을 만난 군인은 한 문명의 두 백성을 만난 것이다. 기마와 수렵. 같은 북쪽이다. 이 위키에 돌궐만의 나라는 없다. 돌궐은 이 풀 위에서 한동안 가장 큰 지붕이다.',
		events: [
			{ year: 414, label: 'Gwanggaeto Stele: a campaign against a Khitan tribe. The north is already on Goguryeo’s stone.' },
			{ year: 551, label: 'Samguk Sagi, Yangwon 7: Turks come against a fortress. The date is disputed. The name is in the annals.' },
			{ year: 636, label: 'Book of Sui: seven Mohe tribes, hunters of the forest rivers. A different life from the felt tents.' },
			{ year: 727, label: 'Hyecho: Turkish kings rule Gandhara, Kapisa and Zabul.' },
			{ year: 732, label: 'Kül Tegin inscription: Goguryeo, as Bökli, among the eastern peoples at a Turk funeral.' }
		],
		sobriquets: ['Northern Nomads', 'the Northern Plains', 'north of the desert', 'Makbuk'],
		photo: '/civ/civ_northern-nomads_rite.jpg',
		stills: ['/civ/civ_northern-nomads_rite.jpg'],
		aliases: [
			'Bukjeok',
			'북적',
			'北狄',
			'Northern Nomads',
			'the Northern Nomads',
			'Northern Plains',
			'the Northern Plains',
			'Makbuk',
			'막북',
			'the Turks',
			'Turks',
			'Khitan',
			'Mohe',
			'Malgal',
			'Jurchen'
		]
	},
	{
		id: 'tubo',
		name: 'Tubo',
		korean: '토번',
		hanja: '吐蕃',
		entity: 'nation',
		kingdom: 'other',
		color: '#8a4a5c',
		realm: FAR,
		title: 'The Land of Air',
		summary: {
			en: 'Far Lands. The plateau is the heartland. The roads past it grow soft.',
			ko: '먼나라. 고원이 본토다. 그 너머의 길은 부드럽다.'
		},
		tagline: 'Tubo · Tibet, as Yijing and Hyecho name it. A plateau world of felt and ice.',
		nature:
			'Tubo is a Far Land. The heartland is the Tibetan plateau, a definite roof of ice and felt between Hwa’s western roads and India. The civilizational reach is the valleys and subject lands a traveller puts under Tibet, and the road a Silla monk walked. Farther from Korea than the Near Lands, a border here is already softer than a Samhan frontier. The Samguk Sagi never names it. Koreans met it on the monk’s road. Yijing says the Silla monk Hyeontae took the Tibet road in the Yonghui years, the 650s. Hyecho, a generation later, writes 吐蕃 and also 土蕃. He puts Great Bolor, Yangtong and Sapoci under Tibet, and he describes Tibetans in felt tents among mountains of ice. He says they do not know the Buddha’s law. That is a traveller’s report from the edge, while the plateau’s own kings were already taking the new script and the new faith. For a Samhan reader the name arrives as a road and a power, the power that in the 670s beat Tang armies and pulled them off the peninsula. One empire on the roof of the world. Its valleys and its tribes sit inside that one name.',
		natureKo:
			'토번은 먼나라다. 본토는 티베트의 고원이고, 화의 서역 길과 천축 사이에 놓인 얼음과 펠트의 뚜렷한 지붕이다. 문명의 닿음은 나그네가 토번 아래 두는 골짜기와 속땅이고, 신라 승려가 걸은 길이다. 옆나라보다 한반도에서 머므로, 여기의 경계는 이미 삼한의 국경보다 부드럽다. 삼국사기는 이 이름을 적지 않는다. 한국 사람은 승려의 길에서 토번을 만났다. 의정은 신라 승 현태가 영휘 연간, 650년대에 토번 길을 취했다고 적는다. 한 세대 뒤 혜초는 吐蕃과 土蕃을 같이 쓴다. 둘 다 토번이다. 대발률과 양동과 사파자를 토번의 아래에 두고, 티베트 사람들이 얼음산 사이 펠트 장막에 산다고 적는다. 부처의 법을 모른다고도 한다. 가장자리에서 온 나그네의 보고다. 고원의 왕들은 이미 새 글자와 새 믿음을 들이고 있었다. 삼한의 독자에게 이 이름은 길로, 그리고 힘으로 도착한다. 670년대에 당의 군대를 이기고, 그 군대를 반도에서 끌어낸 힘. 세계의 지붕 위의 한 제국. 골짜기와 부족은 그 한 이름 안에 있다.',
		arc:
			'Tang histories tell Tibetans from Turks and from Chinese by the same signs Hyecho uses, and then add their own. Felt cloaks, hair in plaits, faces rubbed with red ochre, barley and butter, a king who writes laws for a new script. The tent is the shared technology of the north, and the ice and the ochre are the plateau’s own. Hyecho’s “they do not know the Buddha’s law” is what a monk from Silla found worth saying. Yijing’s Tibet road is what a monk from Silla actually walked, on the way toward India. Dress at home is the felt cloak against the wind. Dress toward Chang’an, when envoys go, is whatever the tribute painter needs in order to tell a Tibetan from a Turk. The chronicle keeps one article. Songtsen’s empire, and the kings after him, are reigns of Tubo.',
		arcKo:
			'당의 역사는 혜초가 쓴 표지로 티베트 사람을 돌궐과 중국에서 가르고, 자기 표지를 더한다. 펠트 외투, 땋은 머리, 붉은 흙을 문지른 얼굴, 보리와 버터, 새 글자를 위해 법을 쓰는 왕. 장막은 북쪽이 같이 쓰는 기술이고, 얼음과 붉은 흙은 고원 자신의 것이다. 혜초의 「부처의 법을 모른다」는 신라에서 온 승려가 적어 둘 만하다고 본 말이다. 의정의 토번 길은 신라에서 온 승려가 천축으로 가며 실제로 걸은 길이다. 집에서의 옷은 바람에 맞서는 펠트다. 장안을 향한 옷은, 사신이 갈 때, 공도의 화가가 티베트와 돌궐을 가르려고 필요한 그만큼이다. 연대기는 항목을 하나로 둔다. 송첸의 제국과 그 뒤의 왕들은 토번의 치세다.',
		events: [
			{ year: 650, label: 'Yijing: the Silla monk Hyeontae takes the Tibet road in the Yonghui years.' },
			{ year: 670, label: 'Tibet defeats Tang at the Dafei River. Tang armies thin on the peninsula.' },
			{ year: 727, label: 'Hyecho: felt tents, ice mountains, and lands under Tibet. He says they do not know the Buddha’s law.' }
		],
		sobriquets: ['Tibet', 'the Tibet road', 'Bod'],
		photo: '/civ/civ_tubo_rite.jpg',
		stills: ['/civ/civ_tubo_rite.jpg'],
		aliases: [
			'Tubo',
			'토번',
			'吐蕃',
			'土蕃',
			'Tibet',
			'Tufan',
			'the Tibet road',
			'Bod'
		]
	},
	{
		id: 'cheonchuk',
		name: 'Chunchuk',
		korean: '천축',
		hanja: '天竺',
		entity: 'nation',
		kingdom: 'other',
		color: '#c9a227',
		realm: FAR,
		title: 'The Land of Earth',
		summary: {
			en: 'Far Lands. The Indic core is the heartland. South Asia is the wider reach.',
			ko: '먼나라. 인도의 심지가 본토다. 남아시아가 더 넓은 닿음이다.'
		},
		tagline: 'Chunchuk · India, in the word Hyecho put on his book: the Five Indias.',
		nature:
			'Cheonchuk is a Far Land, India as one civilization, named in parallel with China’s Cheonjo. The heartland is the Indic core: the Five Indias, Magadha, the Gangetic kings. The civilizational reach is the broader South Asian world, cotton and stupas and Sanskrit, including coasts a Korean pilgrim only heard named. The further from the peninsula, the softer that outer reach becomes. Heaven’s court stands in the east of the Buddhist road, and heaven’s land at the west of it. 天竺 is the ordinary word, in Yijing, in the Samguk Yusa, in every monk’s mouth. The best period label is Hyecho’s own title, the Account of a Journey to the Five Indias, 往五天竺國傳, written about 727 and kept at Dunhuang. He divides the land into central, south, west, north and east, and he still treats it as one world: a king at Kanauj with nine hundred elephants, and a country he says has no cangues and no prisons. Magadha holds the four great stupas. Korean monks had been dying there for a generation. Yijing records the Silla monk Aryavarman living and dying at Nalanda, past seventy. Gandhara, when Hyecho reaches it, is ruled by Turks, its people Hu, with Brahmins among them. The rulers can be foreign. The civilization is the land, the cotton, the stupas, the Sanskrit. Queen Heo’s Ayuta, in the later Gaya legend, is this world’s story told from the peninsula.',
		natureKo:
			'천축은 먼나라이고, 하나의 문명으로서의 인도다. 이름은 중국의 천조와 나란하다. 본토는 인도의 심지다. 오천축과 마갈타와 갠지스의 왕들. 문명의 닿음은 더 넓은 남아시아다. 목면과 탑과 산스크리트, 그리고 한국 순례자가 이름만 들은 해안. 반도에서 멀수록 그 바깥 닿음은 부드러워진다. 불교 길의 동쪽에 하늘의 조정, 서쪽에 하늘의 땅. 천축은 의정과 삼국유사와 모든 승려의 입에서 보통의 말이다. 그 시대의 가장 좋은 이름은 혜초가 자기 책에 붙인 이름이다. 727년쯤 쓰여 돈황에 남은 왕오천축국전. 그는 땅을 중·남·서·북·동으로 나누면서도 하나의 세계로 다룬다. 코끼리 구백 마리의 카나우지 왕, 그리고 칼과 감옥이 없다고 그가 말한 나라. 마갈타에 네 큰 탑이 있다. 한국 승려는 한 세대 전부터 거기서 죽었다. 의정은 신라 승 아리야발마가 나란타에서 일흔이 넘어 살다 죽었다고 적는다. 혜초가 닿은 건타라는 돌궐이 다스리고, 백성은 호인이며, 그 사이에 브라만이 있다. 지배자는 바깥에서 올 수 있다. 문명은 땅과 목면과 탑과 산스크리트다. 가야 전설 속의 허왕후 아유타는, 반도에서 들려주는 이 세계의 이야기다.',
		arc:
			'A Korean pilgrim knew he had left Hwa when the silk robe stopped being the default and the cotton wrap began. Hyecho’s Five Indias are hot, elephant-rich, and dressed for that heat: a cloth at the waist, a shoulder bare or lightly covered, jewelry on a king, the monk’s robe on the man who came from Silla. He notes where grapes fail, from Gandhara through the Five Indias to the Kunlun countries, which is a stomach’s way of drawing a map. Brahmins and Buddhists share the cities. In Gandhara the king is a Turk and the people are still of India. That is the same rule as everywhere on this wiki. A conqueror is a roof. Cheonchuk is the house. The Samguk Yusa later enjoys the legend that Silla’s king was of India’s kshatriya caste, and names Jinpyeong’s house with the Buddha’s parents’ names. Pretty, and late. The seventh-century fact is the road: Nalanda, the Bodhi tree, and monks who did not come home.',
		arcKo:
			'한국 순례자는 비단 포가 기본이기를 멈추고 목면의 두루마리가 시작될 때, 화를 떠났다는 것을 알았다. 혜초의 오천축은 덥고, 코끼리가 많고, 그 더위에 맞게 입는다. 허리의 천, 드러나거나 얇게 가린 어깨, 왕의 장신구, 신라에서 온 사람의 승복. 그는 포도가 어디서 실패하는지를 적는다. 건타라에서 오천축을 지나 곤륜의 나라까지. 배가 그리는 지도다. 브라만과 불교도가 도시를 같이 쓴다. 건타라의 왕은 돌궐이고 백성은 여전히 인도의 백성이다. 이 위키의 어디서나 같은 규칙이다. 정복자는 지붕이다. 천축은 집이다. 삼국유사는 나중에, 신라 왕이 인도의 찰리종이라는 전설을 즐기고, 진평왕의 집을 부처의 부모 이름으로 적는다. 곱고, 늦다. 7세기의 사실은 길이다. 나란타, 보리수, 그리고 돌아오지 못한 승려들.',
		events: [
			{ year: 691, label: 'Yijing: Aryavarman of Silla lives and dies at Nalanda. Other Silla monks reach the Bodhi tree.' },
			{ year: 727, label: 'Hyecho’s Account of a Journey to the Five Indias. Kanauj, nine hundred elephants, Magadha’s stupas.' }
		],
		sobriquets: ['India', 'the Five Indias', 'Ocheonchuk'],
		photo: '/civ/civ_cheonchuk_rite.jpg',
		stills: ['/civ/civ_cheonchuk_rite.jpg'],
		aliases: [
			'Chunchuk',
			'Cheonchuk',
			'천축',
			'天竺',
			'India',
			'the Five Indias',
			'Five Indias',
			'Ocheonchuk',
			'오천축'
		]
	},
	{
		id: 'persia',
		name: 'Pasa',
		korean: '파사',
		hanja: '波斯',
		entity: 'nation',
		kingdom: 'other',
		color: '#2f8f83',
		realm: FAR,
		title: 'The Land of Fire',
		summary: {
			en: 'Far Lands. The plateau, then the caliphate’s core. The Middle East is the wider reach.',
			ko: '먼나라. 고원, 그리고 칼리프의 심지. 중동이 더 넓은 닿음이다.'
		},
		tagline: 'Pasa until the conquest. After 651 the chronicle calls the same world Daesik.',
		stages: [
			{
				id: 'daesik',
				from: 651,
				name: 'Daesik',
				korean: '대식',
				hanja: '大食',
				title: 'The caliphate',
				label: 'From 651'
			}
		],
		nature:
			'Persia is a Far Land, and Daesik is the same civilization after 651. The heartland before the conquest is the Iranian plateau and Mesopotamia. After 651 the heartland is the caliphate’s core, Arabia through Iran. The civilizational reach is the broader Middle East, wider than any one house, and the further shores grow faint in a Korean book. Egypt and the Maghreb sit in that softer reach. The chronicle’s time slider renames the nation in 651, when the last Sasanian king is killed and the caliphate swallows the plateau. It does not become a new nation each time the capital moves. Rashidun, Umayyad, Abbasid: one continuous civilization, the roads and the faith and the tax, under successive houses. Hyecho writes the new name 大寔. The usual Chinese spelling is 大食. His sentence is the whole politics in one breath. Persia once ruled the Arabs, who were its camel-herders. They rebelled, killed the king, and Persia is swallowed. He still meets Persians. They sail to Sri Lanka for gems, to the Kunlun countries for gold, and on to Guangzhou in the Han land. The Liang tribute scroll, a century earlier, had already painted a Persian envoy in the same procession as Baekje’s envoy. Samhan knew this world as a face in a Chinese painting before it knew it as a fallen kingdom.',
		natureKo:
			'파사는 먼나라이고, 대식은 651년 뒤의 같은 문명이다. 정복 전의 본토는 이란 고원과 메소포타미아다. 651년 뒤의 본토는 칼리프의 심지, 아라비아에서 이란까지다. 문명의 닿음은 더 넓은 중동이고, 어느 한 집보다 넓으며, 더 먼 해안은 한국 책에서 희미해진다. 이집트와 마그레브는 그 부드러운 닿음 안에 있다. 연대기의 시간축은 651년에 이름을 바꾼다. 마지막 사산 왕이 죽고 칼리프의 나라가 고원을 삼킨 해다. 도성이 옮 때마다 새 나라가 되지는 않는다. 정통 칼리프, 우마이야, 아바스. 하나의 연속된 문명이다. 길과 믿음과 세금이 집을 이어 간다. 혜초는 새 이름을 대식(大寔)으로 쓴다. 중국 쪽의 보통 글자는 대식(大食)이다. 그의 문장이 정치의 전부다. 파사는 한때 아랍을 다스렸고, 아랍은 그 낙타 치는 사람들이었다. 그들이 일어나 왕을 죽이자 파사는 삼켜졌다. 그는 여전히 페르시아 사람을 만난다. 보물을 찾아 사자국으로, 금을 찾아 곤륜으로, 한지의 광주로 배를 몬다. 한 세기 앞의 양직공도는 이미 페르시아 사신을 백제 사신과 같은 행렬에 그려 두었다. 삼한은 이 세계를, 망한 왕국으로 알기 전에, 중국 그림 속의 얼굴로 알았다.',
		arc:
			'Dress, in the Liang painting, is how a Chinese court told a Persian from a Baekje man standing in the same scroll: the Iranian caftan and the tall cap against the peninsula’s jacket, trousers and feathers. Roundel silk, pearl borders, a beard cut in the western manner. That is the Sasanian figure the tribute painters handed down. After 651 the rulers Hyecho meets on those roads are Arabs, and the religion of the tax is the new one. The merchants are often still Persian, and the ships are the same ships. Zoroaster’s fire does not vanish in a year. It stops being the king’s fire. The article stays one because the chronicle refuses to start a new nation for every caliphate. Open the Names row and the slider’s hinge is there: Pasa, 파사, 波斯, and from 651 Daesik, 대식, 大食. Hyecho’s spelling 大寔 is the eyewitness form.',
		arcKo:
			'양의 그림에서 옷은, 같은 두루마리 안에 선 페르시아 사람과 백제 사람을 중국 조정이 가르는 방법이다. 이란의 카프탄과 높은 관, 반도의 저고리와 바지와 깃. 둥근 무늬의 비단, 진주 테두리, 서역식으로 다듬은 수염. 공도의 화가가 남긴 사산의 모습이다. 651년 뒤에 혜초가 그 길에서 만나는 지배자는 아랍이고, 세금의 믿음은 새 믿음이다. 상인은 종종 여전히 페르시아인이고, 배는 같은 배다. 조로아스터의 불이 한 해에 사라지지는 않는다. 왕의 불이기를 멈출 뿐이다. 항목이 하나인 것은, 연대기가 칼리프조마다 새 나라를 열지 않기 때문이다. 이름 줄을 열면 시간축의 경첩이 있다. 파사, 波斯. 651년부터 대식, 大食. 혜초의 大寔은 목격자의 글자다.',
		events: [
			{ year: 530, label: 'Liang tribute scroll: a Persian envoy painted in the same procession as Baekje’s.' },
			{ year: 651, label: 'The Sasanian king falls. On the chronicle’s slider the name becomes Daesik.' },
			{ year: 727, label: 'Hyecho: Persia is swallowed. Persians still sail to Sri Lanka, Kunlun and Guangzhou.' }
		],
		sobriquets: ['Persia', 'Daesik', 'the caliphate', 'Fars'],
		photo: '/civ/civ_persia_rite.jpg',
		stills: ['/civ/civ_persia_rite.jpg'],
		aliases: [
			'Pasa',
			'파사',
			'波斯',
			'Persia',
			'Daesik',
			'대식',
			'大食',
			'大寔',
			'the caliphate',
			'Fars',
			'Dashi'
		]
	},
	{
		id: 'bullim',
		name: 'Bulim',
		korean: '불림',
		hanja: '拂菻',
		entity: 'nation',
		kingdom: 'other',
		color: '#7b4fa0',
		realm: FAR,
		title: 'The Land of Water',
		summary: {
			en: 'Far Lands. The Byzantine heartland. Europe and North Africa are the softer reach.',
			ko: '먼나라. 비잔티움의 본토. 유럽과 북아프리카는 더 부드러운 닿음이다.'
		},
		tagline: 'Bulim · Rome, which Hyecho calls Great Fulin. Daqin is the older Chinese name.',
		nature:
			'Rome is a Far Land, the farthest court a Korean only heard of. The heartland Samhan could name is the Byzantine one: Anatolia, the Balkans, and the city. The civilizational reach is larger and softer, more of Europe and northern Africa, a Mediterranean the annals never walk. Distance from Korea is why this page is the softest of the land roads. For a seventh-century Korean the name is Fulin. Hyecho writes Great Fulin, 大拂臨, and Little Fulin. The ordinary Tang spelling is 拂菻, read 불림. He did not go. He reports what the road said: northwest along the sea from Little Fulin lies Great Fulin, its armies strong, the Arabs having attacked it many times and failed, the Turks having failed too. Little Fulin is read as the Levant already under the Arabs. Great Fulin is the empire that held, Constantinople at the far end of the sea. Chinese books since the Han had called that west Daqin, 대진. By Hyecho’s day the living name is Fulin. No Korean annal of the age uses Daqin. The Korean reading is 불림. One civilization: the Roman empire the east still knew, under whatever dynasty wore the purple.',
		natureKo:
			'로마는 먼나라이고, 한국 사람이 듣기만 한 가장 먼 조정이다. 삼한이 이름으로 알 수 있던 본토는 비잔티움의 본토다. 아나톨리아와 발칸과 그 도시. 문명의 닿음은 더 크고 더 부드럽다. 유럽의 더 많은 곳과 북아프리카, 사서가 걷지 않은 지중해. 한반도에서의 거리가 이 항목을 육로 가운데 가장 부드럽게 만든다. 7세기의 한국 사람에게 이름은 불림이다. 혜초는 대불림(大拂臨)과 소불림을 쓴다. 당의 보통 글자는 拂菻이고, 읽기는 불림이다. 그는 가지 않았다. 길이 하는 말을 적는다. 소불림에서 바다를 끼고 서북으로 가면 대불림이 있고, 군사가 강해서 아랍이 여러 번 쳤으나 깨지 못했고, 돌궐도 깨지 못했다. 소불림은 이미 아랍 아래 든 레반트로 읽힌다. 대불림은 버틴 제국이고, 그 바다의 끝에 콘스탄티노플이 있다. 한 이래 중국 책은 그 서쪽을 대진이라 불렀다. 혜초의 시대에 살아있는 이름은 불림이다. 그 시대의 한국 사서는 대진을 쓰지 않는다. 읽기는 불림이다. 문명은 하나다. 동방이 여전히 알던 로마 제국, 자주를 입은 왕조가 누구이든.',
		arc:
			'Because Hyecho never arrived, the wardrobe is mostly Tang hearsay and tribute lists: glass, gems, a king in the west, an army that would not fall. That absence is itself the period’s knowledge. Samhan could name the Heavenly Court and walk to it. Samhan could send a monk to Cheonchuk and have him die at Nalanda. Rome arrived as a sentence about a strong army. The Nestorian stele in Chang’an, 635, uses the old name Daqin for a church from the western roads. That is a religion in the Tang capital. It is a cousin of this article. The country Hyecho means is the empire the Arabs could not finish. Dress, where the Tang descriptions bother, reads as western tailoring and jewelry against the caftan of Persia and the round-collar of Chang’an. The chronicle does not pretend to a Korean eyewitness of the forum. It keeps the name the eyewitness used for the place he only heard of.',
		arcKo:
			'혜초가 닿지 못했으므로 옷장은 대개 당의 풍문과 조공 목록이다. 유리, 보석, 서쪽의 왕, 무너지지 않는 군대. 그 빈자리가 그 시대의 지식이다. 삼한은 천조를 이름으로 알고 걸어갈 수 있었다. 삼한은 승려를 천축에 보내 나란타에서 죽게 할 수 있었다. 로마는 강한 군대에 대한 한 문장으로 도착했다. 635년 장안의 경교 비는 서쪽 길에서 온 교회에 옛 이름 대진을 쓴다. 그것은 당 도성 안의 종교이고, 이 항목의 친척이다. 혜초가 가리킨 나라는 아랍이 끝내지 못한 제국이다. 당의 기록이 옷을 신경 쓸 때, 그것은 페르시아의 카프탄과 장안의 둥근 깃에 대하여 서쪽의 재단과 장신구로 읽힌다. 연대기는 포룸을 본 한국 목격자를 가장하지 않는다. 듣기만 한 곳에 목격자가 쓴 이름을 둔다.',
		events: [
			{ year: 635, label: 'The Nestorian stele in Chang’an uses the old name Daqin for the western teaching.' },
			{ year: 727, label: 'Hyecho: Great Fulin, northwest of Little Fulin. Arabs and Turks attack it and fail.' }
		],
		sobriquets: ['Rome', 'Great Fulin', 'Fulin', 'Daqin'],
		photo: '/civ/civ_bullim_rite.jpg',
		stills: ['/civ/civ_bullim_rite.jpg'],
		aliases: [
			'Bulim',
			'Bullim',
			'불림',
			'拂菻',
			'Rome',
			'Fulin',
			'Great Fulin',
			'Daebulim',
			'Daebullim',
			'Daqin',
			'대진',
			'Ῥώμη'
		]
	},
	{
		id: 'southern-seas',
		name: 'Namyang',
		korean: '남양',
		hanja: '南洋',
		entity: 'nation',
		kingdom: 'other',
		color: '#3f7f9e',
		realm: FAR,
		title: 'The Southern Seafarers',
		summary: {
			en: 'Far Lands. The sea road is the heartland. Sanskrit: दक्षिणसागर. The harbours beyond it are softer.',
			ko: '먼나라. 바닷길이 본토다. 산스크리트: दक्षिणसागर. 그 너머의 항구는 더 부드럽다.'
		},
		tagline: 'Namyang · Southern Seas · दक्षिणसागर. The peoples Chinese books called Kunlun.',
		nature:
			'Southern Seas are a Far Land, and the softest edge of the nine, because the records name a sea more often than a crown. The heartland is the sea road itself and its great ports, Srivijaya above all, where Korean monks died. The civilizational reach runs from the mainland’s southern shore through the Malay world and on into Indonesia. A monsoon is a wide reach. A Korean death at one port is the sharp part. 南海 is the sea itself, and the right umbrella. Yijing says two Silla monks left Chang’an for the Southern Sea. Hyecho says Persian ships sail into that same sea, and that south India reaches it. The people-word, in both men’s Chinese, is Kunlun, 곤륜. Hyecho has Persians going to the Kunlun countries for gold, and he draws a line from Gandhara through the Five Indias to the Kunlun countries by the simple fact that none of them grow grapes. Kunlun in this century is a civilizational label for the dark-skinned sea peoples, a blunt Chinese word covering many ports. Srivijaya, 室利佛逝, is the one southern state where a Korean death is recorded: Yijing’s two monks sailed on to Srivijaya and to Barus, fell ill, and died. Funan’s goods show up in the Nihon Shoki as a Baekje gift to Yamato in 543. The Liang scroll seats a Langyaxiu envoy in the same world-procession as Baekje. Champa and Zhenla are in Chinese books. They have no Korean attestation of the age. They still belong to this sea.',
		natureKo:
			'남해는 먼나라이고, 아홉 가운데 가장 부드러운 가장자리다. 기록이 왕관보다 바다를 더 자주 부르기 때문이다. 본토는 바닷길 자체와 그 큰 항구이고, 그 가운데 한국 승려가 죽은 실리불서가 가장 또렷하다. 문명의 닿음은 대륙의 남쪽 해안에서 말레이 세계를 지나 인도네시아까지다. 계절풍은 넓은 닿음이다. 한 항구에서의 한국 사람의 죽음이 날카로운 부분이다. 남해는 바다 자체이고, 옳은 우산 이름이다. 의정은 신라 승 두 사람이 장안을 떠나 남해로 갔다고 적는다. 혜초는 페르시아 배가 그 바다로 들어가고, 남천축이 그 바다에 닿는다고 적는다. 두 사람의 중국어에서 사람을 가리키는 말은 곤륜이다. 혜초는 페르시아 사람들이 금을 찾아 곤륜국에 간다고 하고, 건타라에서 오천축을 지나 곤륜의 나라까지를 포도가 나지 않는다는 한 가지로 잇는다. 이 세기의 곤륜은 바다의 검은 피부의 백성을 통째로 부르는 문명 이름이다. 많은 항구를 덮는 무딘 중국어다. 실리불서는 한국 사람의 죽음이 기록된 남쪽 나라다. 의정의 두 승려는 실리불서와 그 서쪽 바루스로 가다가 병들어 둘 다 죽었다. 부남의 물건은 543년, 일본서기에서 백제가 야마토에 보낸 선물로 나타난다. 양직공도는 능아수 사신을 백제와 같은 세계 행렬에 앉힌다. 임읍과 진랍은 중국 책에 있다. 그 시대의 한국 자료는 없다. 그래도 이 바다의 것이다.',
		arc:
			'What a Tang or Silla writer used to mark this world was the sea, the ship, and the word Kunlun, more than any single crown. Court dress in a Malay port is cotton and gold against the salt, hair and cloth cut for the heat, a different silhouette from the Futou and from the Jougwan. The Chinese notices are crude about faces and precise about trade: gold, aromatics, the monsoon. Yijing’s book is a better witness than a tribute painting, because his monks actually sailed. Two of them died at Srivijaya. That death makes the south a Korean fact. Funan, by the 540s, is already a warehouse Baekje can shop in, if the Nihon Shoki’s 扶南 is the Mekong kingdom and a gift of goods and two slaves. One minority reading takes the word as “south of Buyeo.” Most readers take the goods. Either way the southern sea is in the story as cargo. The civilization has many kings. Srivijaya, Funan’s successors, the harbour towns. This page is the sea they share, the way Samhan is the world its kingdoms share.',
		arcKo:
			'당이나 신라의 글이 이 세계를 표시한 것은 왕관 하나보다 바다와 배와 곤륜이라는 말이었다. 말레이 항구의 궁정 옷은 소금기 속의 목면과 금이고, 더위에 맞춘 머리와 천이다. 복두와도 조우관과도 다른 실루엣이다. 중국의 기록은 얼굴에는 무디고 무역에는 정밀하다. 금, 향, 계절풍. 의정의 책이 공도화보다 나은 증인인 것은, 그의 승려가 실제로 배를 탔기 때문이다. 두 사람이 실리불서에서 죽었다. 그 죽음이 남쪽을 한국의 사실로 만든다. 540년대의 부남은, 일본서기의 부남이 메콩의 나라고 재물과 노예 두 사람이 선물이라면, 백제가 이미 물건을 사 올 수 있는 창고다. 한 소수 설은 그 글자를 부여의 남쪽으로 읽는다. 대부분의 독자는 재물로 읽는다. 어느 쪽이든 남해는 짐으로 이야기 안에 있다. 문명에는 왕이 많다. 실리불서, 부남 뒤의 나라들, 항구의 고을. 이 항목은 그들이 같이 쓰는 바다다. 삼한이 그 나라들이 같이 쓰는 세계이듯.',
		events: [
			{ year: 530, label: 'Liang tribute scroll: a Langyaxiu envoy in the same procession as Baekje.' },
			{ year: 543, label: 'Nihon Shoki: King Seong of Baekje sends Yamato Funan goods and two slaves.' },
			{ year: 691, label: 'Yijing: two Silla monks sail to Srivijaya and Barus, fall ill, and die.' },
			{ year: 727, label: 'Hyecho: Persians sail the Southern Sea and buy gold in the Kunlun countries.' }
		],
		sobriquets: ['Kunlun', 'Southern Seas', 'दक्षिणसागर', 'the Southern Sea'],
		photo: '/civ/civ_southern-seas_rite.jpg',
		stills: ['/civ/civ_southern-seas_rite.jpg'],
		aliases: [
			'Namyang',
			'남양',
			'南洋',
			'Southern Seas',
			'the Southern Seas',
			'the Southern Sea',
			'Southern Sea',
			'Kunlun',
			'곤륜',
			'Srivijaya',
			'Nanhai',
			'남해',
			'南海'
		]
	}
];
