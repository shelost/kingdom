import type { StoryMap } from './types';

/** Shared waterways for the three Israel books; land data has no lakes or rivers. */
const JORDAN: StoryMap['routes'] = [
	{ via: [[32.88, 35.6], [32.72, 35.58]], kind: 'water' },
	{ via: [[32.71, 35.57], [32.45, 35.56], [32.1, 35.54], [31.78, 35.55]], kind: 'river', label: 'Jordan' },
	{ via: [[31.75, 35.52], [31.5, 35.48], [31.2, 35.42]], kind: 'water' }
];

/** Maps per story slug, merged into each outline by `index.ts`. */
export const STORY_MAPS: Record<string, StoryMap[]> = {
	husam: [
		{
			id: 'three-kingdoms',
			title: 'Three borrowed names',
			years: 'c. 915',
			caption:
				'Gung Ye’s Taebong in the north, Gyeon Hwon’s Later Baekje in the southwest, and what is left of Silla in the east. Wang Geon’s fleet sails round the tiger’s back to Naju.',
			points: [
				{ id: 'cheorwon', name: 'Cheorwon', ko: '철원', at: [38.15, 127.31], kind: 'capital' },
				{ id: 'songak', name: 'Songak', ko: '송악', at: [37.97, 126.55], kind: 'capital', side: 'left' },
				{ id: 'wansan', name: 'Wansan', ko: '완산', at: [35.82, 127.15], kind: 'capital' },
				{ id: 'gyeongju', name: 'Gyeongju', ko: '경주', at: [35.84, 129.21], kind: 'capital', side: 'right' },
				{ id: 'naju', name: 'Naju', ko: '나주', at: [35.03, 126.71], kind: 'battle', side: 'left' },
				{ id: 'cheonghae', name: 'Cheonghae', ko: '청해', at: [34.31, 126.75], kind: 'site' },
				{ id: 'gongsan', name: 'Gongsan', ko: '공산', at: [36.02, 128.69], kind: 'battle' },
				{ id: 'hwangsan', name: 'Hwangsan', ko: '황산', at: [36.2, 127.1], kind: 'battle', side: 'left' },
				{ id: 'buseoksa', name: 'Buseoksa', ko: '부석사', at: [36.99, 128.69], kind: 'site' },
				{ id: 'gayasan', name: 'Gayasan', ko: '가야산', at: [35.8, 128.1], kind: 'site', side: 'below' }
			],
			routes: [
				{ via: ['songak', [37.2, 125.9], [35.9, 125.9], 'naju'], kind: 'naval', label: 'Wang Geon, 903' },
				{ via: ['wansan', 'gyeongju'], kind: 'march', label: 'Gyeon Hwon sacks Gyeongju, 927' }
			]
		}
	],
	chunchu: [
		{
			id: 'states',
			title: 'The states of the Zhou',
			years: 'c. 685–651 BC',
			caption:
				'Qi on the eastern sea, Lu next door, the Zhou king in Luoyang with no army, and Chu in the south, which never thought it needed permission. Kuiqiu’s exact site is uncertain.',
			points: [
				{ id: 'linzi', name: 'Linzi', ko: '임치', at: [36.81, 118.35], kind: 'capital' },
				{ id: 'ju', name: 'Ju', ko: '거', at: [35.58, 118.83], kind: 'site' },
				{ id: 'qufu', name: 'Qufu (Lu)', ko: '곡부', at: [35.6, 116.99], kind: 'capital', side: 'left' },
				{ id: 'luoyang', name: 'Luoyang (Zhou)', ko: '낙양', at: [34.62, 112.45], kind: 'capital', side: 'left' },
				{ id: 'jiang', name: 'Jiang (Jin)', ko: '강', at: [35.71, 111.72], kind: 'capital', side: 'left' },
				{ id: 'ying', name: 'Ying (Chu)', ko: '영', at: [30.42, 112.17], kind: 'capital' },
				{ id: 'kuiqiu', name: 'Kuiqiu', ko: '규구', at: [34.65, 115.15], kind: 'site', side: 'below' },
				{ id: 'shaoling', name: 'Shaoling', ko: '소릉', at: [33.6, 113.95], kind: 'battle' }
			],
			routes: [
				{ via: ['ju', 'linzi'], kind: 'flight', label: 'The race home, 685 BC' },
				{ via: ['qufu', 'linzi'], kind: 'journey', label: 'Guan Zhong in a cage' },
				{ via: ['linzi', 'kuiqiu', 'shaoling'], kind: 'march', label: 'Qi faces Chu, 656 BC' }
			]
		}
	],
	xiangyu: [
		{
			id: 'chu-han',
			title: 'Chu against Han',
			years: '209–202 BC',
			caption:
				'Xiang Yu goes north to Julu and west to the Qin capital, then home to Pengcheng. Liu Bang is sent to the far mountains of Hanzhong and comes back. Gaixia’s exact site is debated.',
			points: [
				{ id: 'kuaiji', name: 'Kuaiji', ko: '회계', at: [31.3, 120.6], kind: 'site' },
				{ id: 'pei', name: 'Pei', ko: '패', at: [34.72, 116.93], kind: 'site', side: 'above' },
				{ id: 'pengcheng', name: 'Pengcheng', ko: '팽성', at: [34.26, 117.18], kind: 'capital' },
				{ id: 'julu', name: 'Julu', ko: '거록', at: [37.12, 114.95], kind: 'battle' },
				{ id: 'xianyang', name: 'Xianyang', ko: '함양', at: [34.33, 108.71], kind: 'capital', side: 'left' },
				{ id: 'hongmen', name: 'Hongmen', ko: '홍문', at: [34.38, 109.21], kind: 'site', side: 'above' },
				{ id: 'hanzhong', name: 'Hanzhong', ko: '한중', at: [33.07, 107.03], kind: 'capital', side: 'left' },
				{ id: 'xingyang', name: 'Xingyang', ko: '형양', at: [34.79, 113.38], kind: 'battle', side: 'above' },
				{ id: 'gaixia', name: 'Gaixia', ko: '해하', at: [33.55, 117.38], kind: 'battle' },
				{ id: 'wujiang', name: 'Wujiang', ko: '오강', at: [31.81, 118.31], kind: 'site', side: 'left' }
			],
			routes: [
				{ via: ['kuaiji', 'pengcheng', 'julu'], kind: 'march', label: 'Xiang Yu north, 207 BC' },
				{ via: ['julu', 'hongmen'], kind: 'march' },
				{ via: ['hongmen', 'hanzhong'], kind: 'flight', label: 'Liu Bang exiled' },
				{ via: ['gaixia', 'wujiang'], kind: 'flight', label: 'The last ride' }
			]
		}
	],
	sijo: [
		{
			id: 'seal-road',
			title: 'The seal’s road',
			years: '221 BC – 1644',
			caption:
				'Every founder takes the capital, and the jade seal goes with it. Six capitals in nineteen centuries: west, then east, then south, then north.',
			points: [
				{ id: 'xianyang', name: 'Xianyang (Qin)', ko: '함양', at: [34.33, 108.71], kind: 'capital', side: 'below' },
				{ id: 'changan', name: 'Chang’an (Sui, Tang)', ko: '장안', at: [34.27, 108.94], kind: 'capital', side: 'above' },
				{ id: 'luoyang', name: 'Luoyang (Eastern Han)', ko: '낙양', at: [34.62, 112.45], kind: 'capital', side: 'above' },
				{ id: 'kaifeng', name: 'Kaifeng (Song)', ko: '개봉', at: [34.79, 114.31], kind: 'capital', side: 'below' },
				{ id: 'chenqiao', name: 'Chenqiao', ko: '진교', at: [35.02, 114.42], kind: 'site' },
				{ id: 'fengyang', name: 'Fengyang', ko: '봉양', at: [32.87, 117.56], kind: 'site', side: 'left' },
				{ id: 'nanjing', name: 'Nanjing (Ming)', ko: '남경', at: [32.06, 118.79], kind: 'capital' },
				{ id: 'beijing', name: 'Beijing (Ming, Qing)', ko: '북경', at: [39.91, 116.4], kind: 'capital', side: 'left' },
				{ id: 'shanhai', name: 'Shanhai Pass', ko: '산해관', at: [40.0, 119.75], kind: 'battle' },
				{ id: 'mukden', name: 'Mukden', ko: '심양', at: [41.8, 123.43], kind: 'capital' }
			],
			routes: [
				{ via: ['xianyang', 'luoyang', 'changan'], kind: 'journey', label: 'Qin to Han to Tang' },
				{ via: ['changan', 'kaifeng', 'nanjing'], kind: 'journey', label: 'Song to Ming' },
				{ via: ['nanjing', 'beijing'], kind: 'journey' },
				{ via: ['mukden', 'shanhai', 'beijing'], kind: 'march', label: 'The Qing come through the pass, 1644' }
			]
		}
	],
	shahanshah: [
		{
			id: 'empire',
			title: 'From Anshan to everywhere',
			years: '559–530 BC',
			caption:
				'The herdsman’s son takes the Medes, then Lydia at the edge of the Greek world, then Babylon. The last campaign goes north-east to the Massagetae, where the battlefield has never been found.',
			points: [
				{ id: 'anshan', name: 'Anshan', ko: '안샨', at: [29.99, 52.44], kind: 'capital', side: 'below' },
				{ id: 'pasargadae', name: 'Pasargadae', ko: '파사르가대', at: [30.2, 53.18], kind: 'capital' },
				{ id: 'ecbatana', name: 'Ecbatana', ko: '엑바타나', at: [34.8, 48.52], kind: 'capital' },
				{ id: 'pteria', name: 'Pteria', ko: '프테리아', at: [40.02, 34.62], kind: 'battle', side: 'above' },
				{ id: 'sardis', name: 'Sardis', ko: '사르디스', at: [38.49, 28.04], kind: 'capital', side: 'left' },
				{ id: 'opis', name: 'Opis', ko: '오피스', at: [33.4, 44.3], kind: 'battle', side: 'above' },
				{ id: 'babylon', name: 'Babylon', ko: '바빌론', at: [32.54, 44.42], kind: 'capital', side: 'left' },
				{ id: 'jerusalem', name: 'Jerusalem', ko: '예루살렘', at: [31.78, 35.23], kind: 'site', side: 'left' },
				{ id: 'massagetae', name: 'Massagetae', ko: '마사게타이', at: [42.5, 63.0], kind: 'battle' }
			],
			routes: [
				{ via: ['ecbatana', 'pteria', 'sardis'], kind: 'march', label: 'Lydia, 547 BC' },
				{ via: ['ecbatana', 'opis', 'babylon'], kind: 'march', label: 'Babylon, 539 BC' },
				{ via: ['babylon', 'jerusalem'], kind: 'journey', label: 'The cups go home' },
				{ via: ['pasargadae', [37.6, 58.4], 'massagetae'], kind: 'march', label: 'The last war, 530 BC' }
			]
		}
	],
	khagan: [
		{
			id: 'khanates',
			title: 'One empire, four khans',
			years: 'c. 1260',
			caption:
				'Möngke dies and the family breaks into four: Kublai in China, Ariq Böke at Karakorum, Hulegu in Persia, and Batu’s house on the Volga. Hulegu’s march ends at Baghdad; his army’s next step ends at Ain Jalut.',
			points: [
				{ id: 'karakorum', name: 'Karakorum', ko: '카라코룸', at: [47.2, 102.82], kind: 'capital' },
				{ id: 'shangdu', name: 'Shangdu', ko: '상도', at: [42.36, 116.18], kind: 'capital' },
				{ id: 'dadu', name: 'Dadu', ko: '대도', at: [39.91, 116.4], kind: 'capital', side: 'left' },
				{ id: 'almaliq', name: 'Almaliq', ko: '알말리크', at: [43.9, 80.97], kind: 'capital' },
				{ id: 'sarai', name: 'Sarai', ko: '사라이', at: [47.43, 46.42], kind: 'capital', side: 'above' },
				{ id: 'kiev', name: 'Kiev', ko: '키예프', at: [50.45, 30.52], kind: 'battle', side: 'left' },
				{ id: 'maragheh', name: 'Maragheh', ko: '마라게', at: [37.39, 46.24], kind: 'capital', side: 'left' },
				{ id: 'baghdad', name: 'Baghdad', ko: '바그다드', at: [33.31, 44.36], kind: 'battle' },
				{ id: 'ainjalut', name: 'Ain Jalut', ko: '아인잘루트', at: [32.55, 35.36], kind: 'battle', side: 'left' },
				{ id: 'diaoyu', name: 'Diaoyu', ko: '조어성', at: [30.0, 106.28], kind: 'battle' },
				{ id: 'ganghwa', name: 'Ganghwa', ko: '강화', at: [37.71, 126.49], kind: 'site' }
			],
			routes: [
				{ via: ['karakorum', 'almaliq', [39.5, 63.5], 'maragheh', 'baghdad'], kind: 'march', label: 'Hulegu, 1253–1258' },
				{ via: ['baghdad', 'ainjalut'], kind: 'march', label: '1260' },
				{ via: ['sarai', 'kiev'], kind: 'march', label: 'Batu, 1240' },
				{ via: ['karakorum', 'diaoyu'], kind: 'march', label: 'Möngke, 1258' }
			]
		},
		{
			id: 'song',
			title: 'The fall of the Song',
			years: '1268–1279',
			caption:
				'Five years outside Xiangyang, then Bayan goes down the Yangzi to Lin’an. The Song court flees south by sea and ends at Yamen.',
			points: [
				{ id: 'dadu', name: 'Dadu', ko: '대도', at: [39.91, 116.4], kind: 'capital' },
				{ id: 'xiangyang', name: 'Xiangyang', ko: '양양', at: [32.01, 112.12], kind: 'battle', side: 'left' },
				{ id: 'ezhou', name: 'Ezhou', ko: '악주', at: [30.55, 114.3], kind: 'battle', side: 'below' },
				{ id: 'linan', name: 'Lin’an', ko: '임안', at: [30.25, 120.17], kind: 'capital' },
				{ id: 'fuzhou', name: 'Fuzhou', ko: '복주', at: [26.07, 119.3], kind: 'site' },
				{ id: 'yamen', name: 'Yamen', ko: '애산', at: [22.2, 113.08], kind: 'battle', side: 'left' },
				{ id: 'diaoyu', name: 'Diaoyu', ko: '조어성', at: [30.0, 106.28], kind: 'battle', side: 'left' }
			],
			routes: [
				{ via: ['dadu', 'xiangyang'], kind: 'march', label: 'Siege, 1268–1273' },
				{ via: ['xiangyang', 'ezhou', [30.9, 117.6], 'linan'], kind: 'march', label: 'Bayan, 1274–1276' },
				{ via: ['linan', 'fuzhou', [23.4, 116.7], 'yamen'], kind: 'flight', label: 'The last Song court' }
			]
		}
	],
	judges: [
		{
			id: 'canaan',
			title: 'Across the Jordan',
			years: 'c. 1250–1100 BC',
			caption:
				'Moses dies on Nebo, the tribes cross at Gilgal, and the first towns fall. Later judges fight in the north valleys and on the Philistine coast.',
			frame: [[33.1, 34.3], [31.0, 36.0]],
			points: [
				{ id: 'nebo', name: 'Mount Nebo', ko: '느보 산', at: [31.77, 35.72], kind: 'site' },
				{ id: 'gilgal', name: 'Gilgal', at: [31.85, 35.5], kind: 'site', side: 'above' },
				{ id: 'jericho', name: 'Jericho', ko: '여리고', at: [31.87, 35.44], kind: 'battle', side: 'left' },
				{ id: 'ai', name: 'Ai', ko: '아이', at: [31.92, 35.26], kind: 'battle', side: 'above' },
				{ id: 'gibeon', name: 'Gibeon', ko: '기브온', at: [31.85, 35.18], kind: 'battle', side: 'left' },
				{ id: 'shechem', name: 'Shechem', ko: '세겜', at: [32.21, 35.28], kind: 'site', side: 'left' },
				{ id: 'tabor', name: 'Mount Tabor', ko: '다볼 산', at: [32.69, 35.39], kind: 'battle', side: 'left' },
				{ id: 'harod', name: 'Harod (Gideon)', ko: '하롯', at: [32.55, 35.36], kind: 'battle', side: 'left' },
				{ id: 'hazor', name: 'Hazor', ko: '하솔', at: [33.02, 35.57], kind: 'battle' },
				{ id: 'zorah', name: 'Zorah', ko: '소라', at: [31.77, 34.98], kind: 'site', side: 'left' },
				{ id: 'gaza', name: 'Gaza', ko: '가사', at: [31.5, 34.47], kind: 'site' },
				{ id: 'bethlehem', name: 'Bethlehem', ko: '베들레헴', at: [31.7, 35.2], kind: 'site', side: 'below' }
			],
			routes: [
				...JORDAN,
				{ via: ['nebo', 'gilgal'], kind: 'journey', label: 'The crossing' },
				{ via: ['gilgal', 'ai', 'gibeon'], kind: 'march' }
			]
		}
	],
	'lord-and-shepherd': [
		{
			id: 'david',
			title: 'Shepherd to king',
			years: 'c. 1025–980 BC',
			caption:
				'Bethlehem to Elah, the outlaw years in the southern wilderness, Saul’s death on Gilboa, Hebron, then Jerusalem. When Absalom takes the city, David flees east across the Jordan.',
			frame: [[32.8, 34.4], [31.2, 36.0]],
			points: [
				{ id: 'bethlehem', name: 'Bethlehem', ko: '베들레헴', at: [31.7, 35.2], kind: 'site', side: 'below' },
				{ id: 'elah', name: 'Elah', ko: '엘라', at: [31.69, 34.96], kind: 'battle', side: 'left' },
				{ id: 'gath', name: 'Gath', ko: '가드', at: [31.7, 34.85], kind: 'site', side: 'below' },
				{ id: 'jerusalem', name: 'Jerusalem', ko: '예루살렘', at: [31.78, 35.23], kind: 'capital', side: 'above' },
				{ id: 'engedi', name: 'En Gedi', ko: '엔게디', at: [31.46, 35.39], kind: 'site' },
				{ id: 'ziklag', name: 'Ziklag', ko: '시글락', at: [31.37, 34.68], kind: 'site', side: 'left' },
				{ id: 'hebron', name: 'Hebron', ko: '헤브론', at: [31.53, 35.1], kind: 'capital', side: 'left' },
				{ id: 'gilboa', name: 'Mount Gilboa', ko: '길보아 산', at: [32.47, 35.4], kind: 'battle', side: 'left' },
				{ id: 'endor', name: 'Endor', ko: '엔돌', at: [32.63, 35.36], kind: 'site', side: 'left' },
				{ id: 'mahanaim', name: 'Mahanaim', ko: '마하나임', at: [32.18, 35.65], kind: 'site' },
				{ id: 'rabbah', name: 'Rabbah', ko: '랍바', at: [31.95, 35.93], kind: 'battle' }
			],
			routes: [
				...JORDAN,
				{ via: ['jerusalem', 'engedi', 'ziklag'], kind: 'flight', label: 'Outlaw years' },
				{ via: ['jerusalem', 'mahanaim'], kind: 'flight', label: 'From Absalom' }
			]
		}
	],
	kings: [
		{
			id: 'two-kingdoms',
			title: 'Two kingdoms',
			years: '931–586 BC',
			caption:
				'Israel in the north with its calves at Dan and Bethel, Judah in the south with the Temple. Elijah’s fire falls on Carmel, Jezebel dies at Jezreel and Josiah at Megiddo.',
			frame: [[33.4, 34.6], [31.3, 36.0]],
			points: [
				{ id: 'jerusalem', name: 'Jerusalem', ko: '예루살렘', at: [31.78, 35.23], kind: 'capital', side: 'below' },
				{ id: 'samaria', name: 'Samaria', ko: '사마리아', at: [32.28, 35.2], kind: 'capital', side: 'left' },
				{ id: 'bethel', name: 'Bethel', ko: '벧엘', at: [31.93, 35.22], kind: 'site', side: 'left' },
				{ id: 'dan', name: 'Dan', ko: '단', at: [33.25, 35.65], kind: 'site' },
				{ id: 'jezreel', name: 'Jezreel', ko: '이스르엘', at: [32.56, 35.33], kind: 'site' },
				{ id: 'carmel', name: 'Carmel', ko: '갈멜', at: [32.67, 35.07], kind: 'site', side: 'left' },
				{ id: 'megiddo', name: 'Megiddo', ko: '므깃도', at: [32.58, 35.18], kind: 'battle', side: 'below' },
				{ id: 'lachish', name: 'Lachish', ko: '라기스', at: [31.56, 34.85], kind: 'battle', side: 'left' },
				{ id: 'sidon', name: 'Sidon', ko: '시돈', at: [33.56, 35.37], kind: 'capital', side: 'left' }
			],
			routes: [...JORDAN]
		},
		{
			id: 'exile',
			title: 'To Babylon',
			years: '722–538 BC',
			caption:
				'Assyria takes the north from Nineveh. Elijah runs to Horeb. Zedekiah is taken to Riblah, then everyone goes to Babylon, and Cyrus sends them home.',
			points: [
				{ id: 'jerusalem', name: 'Jerusalem', ko: '예루살렘', at: [31.78, 35.23], kind: 'capital', side: 'left' },
				{ id: 'samaria', name: 'Samaria', ko: '사마리아', at: [32.28, 35.2], kind: 'capital', side: 'left' },
				{ id: 'horeb', name: 'Horeb', ko: '호렙', at: [28.54, 33.97], kind: 'site' },
				{ id: 'riblah', name: 'Riblah', ko: '리블라', at: [34.6, 36.5], kind: 'site', side: 'above' },
				{ id: 'nineveh', name: 'Nineveh', ko: '니느웨', at: [36.36, 43.15], kind: 'capital' },
				{ id: 'babylon', name: 'Babylon', ko: '바벨론', at: [32.54, 44.42], kind: 'capital' }
			],
			routes: [
				{ via: [[32.56, 35.33], [31.25, 34.79], 'horeb'], kind: 'flight', label: 'Elijah' },
				{ via: ['jerusalem', 'riblah', [35.8, 39.5], 'babylon'], kind: 'march', label: 'Exile, 586 BC' }
			]
		}
	],
	'command-line': [
		{
			id: 'america',
			title: 'Coast to coast',
			years: '1975–1997',
			caption:
				'Paul Allen flies from Boston to Albuquerque with a paper tape. Microsoft moves home to Seattle. IBM builds the PC in Florida, the operating system nearly comes from Pacific Grove, and the war is fought out of Cupertino and Redmond.',
			points: [
				{ id: 'boston', name: 'Boston', at: [42.36, -71.06], kind: 'site' },
				{ id: 'albuquerque', name: 'Albuquerque', at: [35.08, -106.65], kind: 'site' },
				{ id: 'seattle', name: 'Seattle', at: [47.61, -122.2], kind: 'capital' },
				{ id: 'cupertino', name: 'Cupertino', at: [37.32, -122.03], kind: 'capital' },
				{ id: 'pacificgrove', name: 'Pacific Grove', at: [36.62, -121.92], kind: 'site', side: 'below' },
				{ id: 'bocaraton', name: 'Boca Raton', at: [26.37, -80.1], kind: 'site', side: 'left' }
			],
			routes: [
				{ via: ['boston', 'albuquerque'], kind: 'journey', label: 'Allen’s flight, 1975' },
				{ via: ['albuquerque', 'seattle'], kind: 'journey', label: '1979' }
			]
		},
		{
			id: 'valley',
			title: 'The Valley',
			years: '1975–1985',
			caption: 'Everything in the first half happens within twenty minutes’ drive of a garage in Los Altos.',
			frame: [[37.62, -122.5], [37.2, -121.85]],
			points: [
				{ id: 'losaltos', name: 'Los Altos garage', at: [37.36, -122.1], kind: 'site', side: 'below' },
				{ id: 'cupertino', name: 'Apple, Cupertino', at: [37.32, -122.03], kind: 'capital' },
				{ id: 'parc', name: 'Xerox PARC', at: [37.4, -122.15], kind: 'site', side: 'left' },
				{ id: 'homebrew', name: 'Homebrew (Stanford)', at: [37.43, -122.18], kind: 'site', side: 'above' },
				{ id: 'atari', name: 'Atari', at: [37.35, -121.96], kind: 'site' }
			]
		}
	]
};
