/**
 * The God King castle lords and the men around Wang Geon.
 *
 * No portraits. `seal` is the surname drawn as the face.
 * `hojokOrder` is the place of the first daughter in the list of twenty-nine
 * wives. Sisters share that number. A lord with no daughter in the list
 * stays unnumbered. Wang Ryung is his father, not a father-in-law.
 *
 * The four gate-openers who are not also fathers sit at the bottom as
 * generals: Sin Sung-gyeom, Bae Hyeon-gyeong, Bok Jik-gyeom, Park Sul-hui.
 * Hong Yu and Yu Geum-pil are numbered with the wives.
 */
import type { Person } from './people';

type LordInput = Omit<Person, 'kingdom' | 'gender'> & Partial<Pick<Person, 'kingdom' | 'gender'>>;

function lord(p: LordInput): Person {
	return { kingdom: 'other', gender: 'm', tags: ['l3k'], ...p };
}

/** Fathers and castle lords. Ids in this list are the Hojok shelf. */
export const HOJOK_LORDS: Person[] = [
	lord({
		id: 'yuchungung',
		name: 'Yoo Chun-Gung',
		korean: '유천궁',
		hanja: '柳天弓',
		seal: '柳',
		hojokOrder: 1,
		color: '#c9844a',
		epithet: 'river mouth',
		clan: 'Jeongju Yoo',
		tagline: 'Puts the armour on him at Cheorwon. Father of Queen Sinhye.',
		aliases: ['Yu Chun-Gung', 'Yu Chungung', '유천궁', '柳天弓']
	}),
	lord({
		id: 'odaryeon',
		name: 'Oh Daryeon',
		korean: '오다련',
		hanja: '吳多憐',
		seal: '吳',
		hojokOrder: 2,
		color: '#3a8a6a',
		epithet: 'gold castle',
		clan: 'Naju Oh',
		tagline: 'Naju. Father of Queen Janghwa, and through her of the second king.',
		aliases: ['O Daryeon', 'Daryeon', '다련군', '오다련', '吳多憐']
	}),
	lord({
		id: 'yugungdal',
		name: 'Yuh Gung-Dal',
		korean: '유긍달',
		hanja: '劉兢達',
		seal: '劉',
		hojokOrder: 3,
		color: '#c45a8a',
		epithet: 'middle plain',
		clan: 'Chungju Yuh',
		tagline: 'Chungju. Father of the queen who bears the third king and the fourth.',
		aliases: ['Yu Gung-Dal', 'Yu Geungdal', '유긍달', '劉兢達']
	}),
	lord({
		id: 'hwangbojegong',
		name: 'Hwangbo Jegong',
		korean: '황보제공',
		hanja: '皇甫悌恭',
		seal: '皇甫',
		hojokOrder: 4,
		color: '#6fbf8a',
		epithet: 'the loyal',
		clan: 'Hwangju Hwangbo',
		tagline: 'Hwangju. Father of Queen Sinjeong. They call him the loyal after he is gone.',
		aliases: ['Hwangbo Jegong', '황보제공', '皇甫悌恭']
	}),
	lord({
		id: 'kimeokryeom',
		name: 'Kim Eok-ryeom',
		korean: '김억렴',
		hanja: '金億廉',
		seal: '金',
		hojokOrder: 5,
		color: '#c4a35a',
		clan: 'Gyeongju Kim',
		tagline: 'Gyeongju. Father of Queen Sinseong.',
		aliases: ['Kim Eokryeom', '김억렴', '金億廉', '金憶廉']
	}),
	lord({
		id: 'yudeokyeong',
		name: 'Yoo Deok-yeong',
		korean: '유덕영',
		hanja: '柳德英',
		seal: '柳',
		hojokOrder: 6,
		color: '#b8734a',
		clan: 'Jeongju Yoo',
		tagline: 'Jeongju, the same house as Yoo Chun-Gung. Father of Queen Jeongdeok.',
		aliases: ['You Deok-yeong', 'Yu Deok-yeong', 'Yu Deokyeong', '유덕영', '柳德英']
	}),
	lord({
		id: 'pyeongjun',
		name: 'Pyeong Jun',
		korean: '평준',
		hanja: '平準',
		seal: '平',
		hojokOrder: 7,
		color: '#8a9a6a',
		clan: 'Gyeongju Pyeong',
		tagline: 'Gyeongju. Father of Lady Heonmok.',
		aliases: ['Pyeong Jun', '평준', '平準']
	}),
	lord({
		id: 'wanggyeong',
		name: 'Wang Gyeong',
		korean: '왕경',
		hanja: '王景',
		seal: '王',
		hojokOrder: 8,
		color: '#c47a6a',
		clan: 'Myeongju Wang',
		tagline: 'Myeongju. Father of Lady Jeongmok.',
		aliases: ['Wang Gyeong', '왕경', '王景']
	}),
	lord({
		id: 'yugeumpil',
		name: 'Yu Geum-pil',
		korean: '유금필',
		hanja: '庾黔弼',
		seal: '庾',
		hojokOrder: 9,
		color: '#6a7a4a',
		title: 'General',
		clan: 'Pyeongju Yu',
		tagline: 'One of the generals, and father of Lady Dongyangwon. The surname is 庾.',
		aliases: ['Yu Gumpil', 'Yu Geumpil', '유금필', '庾黔弼']
	}),
	lord({
		id: 'myeongpil',
		name: 'Myeong-pil',
		korean: '명필',
		seal: '명',
		hojokOrder: 10,
		color: '#8a8a78',
		clan: 'Jincheon',
		tagline: 'Jincheon. The annals keep the name and lose the surname. Father of Lady Sukmok.',
		aliases: ['Myeongpil', '명필']
	}),
	lord({
		id: 'imeon',
		name: 'Im Eon',
		korean: '임언',
		hanja: '林彦',
		seal: '林',
		hojokOrder: 11,
		color: '#5a8a5a',
		clan: 'Im',
		tagline: 'Father of the Cheonan lady.',
		aliases: ['Im Eon', '임언', '林彦']
	}),
	lord({
		id: 'honggyu',
		name: 'Hong Gyu',
		korean: '홍규',
		hanja: '洪規',
		seal: '洪',
		hojokOrder: 12,
		color: '#c45a4a',
		clan: 'Hongju Hong',
		tagline: 'Hongju. Father of Lady Heungbok.',
		aliases: ['Hong Gyu', '홍규', '洪規']
	}),
	lord({
		id: 'yiwonhap',
		name: 'Rhie Won',
		korean: '이원',
		hanja: '李元',
		seal: '李',
		hojokOrder: 13,
		color: '#8a7048',
		clan: 'Hapju Rhie',
		tagline: 'Hapcheon. Father of Lady Hudaeryang.',
		aliases: ['Yi Won', '이원', '李元']
	}),
	lord({
		id: 'wangye',
		name: 'Wang Ye',
		korean: '왕예',
		hanja: '王乂',
		seal: '王',
		hojokOrder: 14,
		color: '#a86858',
		clan: 'Myeongju Wang',
		tagline: 'Myeongju. Father of Lady Daemyeongju.',
		aliases: ['Wang Ye', '왕예', '王乂']
	}),
	lord({
		id: 'wanggyu',
		name: 'Wang Gyu',
		korean: '왕규',
		hanja: '王規',
		seal: '王',
		hojokOrder: 15,
		color: '#b85a6a',
		clan: 'Gwangju Wang',
		tagline: 'Gwangju. Two daughters for Taejo, and later one for the second king.',
		aliases: ['Wang Gyu', '왕규', '王規']
	}),
	lord({
		id: 'parkyounggyu',
		name: 'Park Young-Gyu',
		korean: '박영규',
		hanja: '朴英規',
		seal: '朴',
		hojokOrder: 17,
		color: '#e090b0',
		epithet: 'risen peace',
		clan: 'Seungju Park',
		tagline: 'Suncheon. Father of Lady Dongsan. He also marries daughters to the third king.',
		aliases: ['Park Yeonggyu', '박영규', '朴英規']
	}),
	lord({
		id: 'wangyu',
		name: 'Wang Yu',
		korean: '왕유',
		hanja: '王柔',
		seal: '王',
		hojokOrder: 18,
		color: '#c49070',
		clan: 'Chunju Wang',
		tagline: 'Chuncheon. Father of Lady Yehwa.',
		aliases: ['Wang Yu', '왕유', '王柔']
	}),
	lord({
		id: 'kimhaengpa',
		name: 'Kim Haeng-pa',
		korean: '김행파',
		hanja: '金行波',
		seal: '金',
		hojokOrder: 19,
		color: '#c4a040',
		clan: 'Dongju Kim',
		tagline: 'Dongju. Father of both Seowon ladies.',
		aliases: ['Kim Haengpa', '김행파', '金行波']
	}),
	lord({
		id: 'ganggiju',
		name: 'Gang Gi-ju',
		korean: '강기주',
		hanja: '康起珠',
		seal: '康',
		hojokOrder: 22,
		color: '#a89868',
		clan: 'Seonju Gang',
		tagline: 'Father of Lady Sinju.',
		aliases: ['Gang Giju', '강기주', '康起珠']
	}),
	lord({
		id: 'yeongjang',
		name: 'Yeong-jang',
		korean: '영장',
		seal: '영',
		hojokOrder: 23,
		color: '#8a8870',
		tagline: 'The surname is not written down. Father of Lady Wolhwa.',
		aliases: ['Yeongjang', '영장']
	}),
	lord({
		id: 'sunhaeng',
		name: 'Sun-haeng',
		korean: '순행',
		seal: '순',
		hojokOrder: 24,
		color: '#9a8860',
		clan: 'Hwangju',
		tagline: 'Hwangju. The surname is not written down. Father of Lady Sohwangju.',
		aliases: ['Sunhaeng', '순행']
	}),
	lord({
		id: 'parkjiyun',
		name: 'Pak Ji-Yun',
		korean: '박지윤',
		hanja: '朴智胤',
		seal: '朴',
		hojokOrder: 25,
		color: '#5aa0c8',
		epithet: 'Pyeongju',
		clan: 'Pyeongju Pak',
		tagline: 'Pyeongju. Father of Lady Seongmu.',
		aliases: ['Park Ji-Yun', 'Park Jiyun', '박지윤', '朴智胤', 'Park Jeok-Yun', '박적윤']
	}),
	lord({
		id: 'hongyu',
		name: 'Houng Yu',
		korean: '홍유',
		hanja: '洪儒',
		seal: '洪',
		hojokOrder: 26,
		color: '#c04040',
		clan: 'Uiseong Houng',
		tagline: 'Opens the Cheorwon gate with the other three. Father of Lady Uiseong.',
		aliases: ['Hong Yu', '홍유', '洪儒']
	}),
	lord({
		id: 'parksumun',
		name: 'Pak Su-mun',
		korean: '박수문',
		hanja: '朴守文',
		seal: '朴',
		hojokOrder: 27,
		color: '#6a90b0',
		clan: 'Pyeongju Pak',
		tagline: 'Pyeongju, with his brother Pak Su-gyeong. Father of Lady Wolgyeong.',
		aliases: ['Bak Su-mun', 'Park Su-mun', 'Park Sumun', '박수문', '朴守文']
	}),
	lord({
		id: 'parksugyeong',
		name: 'Pak Su-gyeong',
		korean: '박수경',
		hanja: '朴守卿',
		seal: '朴',
		hojokOrder: 28,
		color: '#4a78a0',
		clan: 'Pyeongju Pak',
		tagline: 'Pyeongju, with his brother Pak Su-mun. Father of Lady Mongnyang.',
		aliases: ['Bahk Su-gyeong', 'Bak Su-gyeong', 'Park Su-gyeong', 'Park Sugyeong', '박수경', '朴守卿']
	}),
	lord({
		id: 'seonpil',
		name: 'Seon-pil',
		korean: '선필',
		seal: '선',
		hojokOrder: 29,
		color: '#7a8a70',
		clan: 'Haepyeong',
		tagline: 'Haepyeong. The surname is not written down. Father of Lady Haeryang.',
		aliases: ['Seonpil', '선필']
	}),
	// Castle lords with no daughter in the list. Unnumbered.
	lord({
		id: 'geumyong',
		name: 'Geumyong',
		korean: '금용',
		hanja: '金',
		seal: '金',
		color: '#b07cc4',
		epithet: 'little goguryeo',
		tagline: 'Sits on Pyongyang and still calls it Goguryeo.',
		aliases: ['Geumyong', '금용']
	}),
	lord({
		id: 'unseon',
		name: 'Unseon',
		korean: '운선',
		seal: '운',
		color: '#7eb8c9',
		tagline: 'A name at Anbyeon. The annals do not give him a surname.',
		aliases: ['Unseon', '운선']
	}),
	lord({
		id: 'myeonggwi',
		name: 'Myeong-Gwi',
		korean: '명귀',
		hanja: '明',
		seal: '明',
		color: '#d0a0c0',
		epithet: 'red and yellow',
		tagline: 'Haeju.',
		aliases: ['Myung-Gwi', 'Myeonggwi', '명귀']
	}),
	lord({
		id: 'gangyeonchang',
		name: 'Kang Yeon-Chang',
		korean: '강연창',
		hanja: '康',
		seal: '康',
		color: '#c4b48a',
		tagline: 'Paju. Not the Gang who marries a daughter to the king.',
		aliases: ['Gang Yeon-Chang', 'Gang Yeonchang', '강연창']
	}),
	lord({
		id: 'ryugumsun',
		name: 'Ryu Gumsun',
		korean: '류금순',
		hanja: '柳',
		seal: '柳',
		color: '#8fb86a',
		epithet: 'the salt coast',
		tagline: 'The salt coast. Same character as Yoo Chun-Gung, another house.',
		aliases: ['Ryu Geumsun', '류금순']
	}),
	lord({
		id: 'choejunung',
		name: 'Choe Jun-Ung',
		korean: '최준웅',
		hanja: '崔',
		seal: '崔',
		color: '#d4c06a',
		tagline: 'Maeso.',
		aliases: ['Choe Junung', '최준웅']
	}),
	lord({
		id: 'kimsunsik',
		name: 'Kim Sun-Sik',
		korean: '김순식',
		hanja: '金',
		seal: '金',
		color: '#7a8fd4',
		epithet: 'east of the ridge',
		tagline: 'Holds the east of the ridge after the rest have come in.',
		aliases: ['Kim Sunsik', '김순식']
	}),
	lord({
		id: 'honggi',
		name: 'Hoong-Gi',
		korean: '홍기',
		hanja: '弘',
		seal: '弘',
		color: '#c46a4a',
		epithet: 'bear ferry',
		tagline: 'The bear ferry. Not Houng Yu, and not Hong Gyu.',
		aliases: ['Hong-Gi', 'Honggi', '홍기']
	}),
	lord({
		id: 'yichongeun',
		name: 'Lee Chong-Eon',
		korean: '이총언',
		hanja: '李',
		seal: '李',
		color: '#80a060',
		epithet: 'green ford',
		tagline: 'The green ford. Another house, not Ajagé’s.',
		aliases: ['Yi Chong-Eon', 'Yi Chongeun', '이총언']
	}),
	lord({
		id: 'yiui',
		name: 'Rhee Ui',
		korean: '이의',
		hanja: '李',
		seal: '李',
		color: '#d0b070',
		tagline: 'Okcheon.',
		aliases: ['Yi Ui', '이의']
	}),
	lord({
		id: 'ajitae',
		name: 'Aji-Tae',
		korean: '아지태',
		hanja: '阿',
		seal: '阿',
		color: '#4e9a78',
		epithet: 'the accuser',
		tagline: 'Hamchang. The accuser.',
		aliases: ['Ajitae', '아지태']
	}),
	lord({
		id: 'jihwon',
		name: 'Ji-Hwon',
		korean: '지훤',
		hanja: '池',
		seal: '池',
		color: '#8a8a8a',
		epithet: 'martial plain',
		tagline: 'Gochang. The martial plain.',
		aliases: ['Jihwon', '지훤']
	}),
	lord({
		id: 'chaunung',
		name: 'Cha Un-Ung',
		korean: '차운웅',
		hanja: '車',
		seal: '車',
		color: '#c47840',
		epithet: 'south river',
		tagline: 'The south river.',
		aliases: ['Cha Unung', '차운웅']
	}),
	lord({
		id: 'kimingwang',
		name: 'Kim In-Gwang',
		korean: '김인광',
		hanja: '金',
		seal: '金',
		color: '#d06060',
		epithet: 'gold crown',
		tagline: 'The gold crown at Gimhae. A Gaya Kim, not the Silla house.',
		aliases: ['Kim Ingwang', '김인광']
	}),
	lord({
		id: 'nungchang',
		name: 'Nungchang',
		korean: '능창',
		hanja: '能',
		seal: '能',
		color: '#4a8a8c',
		epithet: 'sea otter',
		tagline: 'The sea otter. Wang Geon takes him. Gung Ye does not spare him.',
		aliases: ['Nungchang', '능창', 'Sea Otter', '수달']
	})
];

/** Men of the reign who are not castle-lord fathers. Generals shelf. */
export const L3K_GENERALS: Person[] = [
	lord({
		id: 'sinsunggyeom',
		name: 'Sin Sung-gyeom',
		korean: '신숭겸',
		hanja: '申崇謙',
		seal: '申',
		color: '#c4b060',
		title: 'General',
		tagline: 'Dies at Gongsan wearing the king’s armour.',
		aliases: ['Sin Sunggyeom', '신숭겸', '申崇謙']
	}),
	lord({
		id: 'baehyeongyeong',
		name: 'Bae Hyeon-gyeong',
		korean: '배현경',
		hanja: '裵玄慶',
		seal: '裵',
		color: '#8a7048',
		title: 'General',
		tagline: 'One of the four who open the gate at Cheorwon.',
		aliases: ['Bae Hyeongyeong', '배현경', '裵玄慶']
	}),
	lord({
		id: 'bokjikgyeom',
		name: 'Bok Jik-gyeom',
		korean: '복지겸',
		hanja: '卜智謙',
		seal: '卜',
		color: '#6a8a78',
		title: 'General',
		tagline: 'One of the four who open the gate at Cheorwon.',
		aliases: ['Bok Jikgyeom', '복지겸', '卜智謙']
	}),
	lord({
		id: 'parksulhui',
		name: 'Park Sul-hui',
		korean: '박술희',
		hanja: '朴述希',
		seal: '朴',
		color: '#a08060',
		title: 'General',
		tagline: 'Janghwa shows him the yellow robe. He has the second king named heir.',
		aliases: ['Park Sulhui', '박술희', '朴述熙', '朴述希']
	})
];

export const L3K_CAST: Person[] = [...HOJOK_LORDS, ...L3K_GENERALS];

export const HOJOK_LORD_IDS: string[] = HOJOK_LORDS.map((p) => p.id);
