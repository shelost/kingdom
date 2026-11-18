/**
 * How the chronicle’s gods show up in the mortal world — musok paintings,
 * household jars, door charms, shrine posts. Historical forms first; the
 * chronicle attaches a board when we have one (`src`).
 *
 * Sources in brief: Encyclopedia of Korean Folk Culture (가신신앙, 삼신, 문배,
 * 무신도, 산신도); Samguk Yusa (비형랑 문부, 처용문배); 국사당 무신도 roster;
 * 「차사본풀이」 / 「바리공주」 rite props.
 */

export type WorldIconKind =
	| 'painting'
	| 'charm'
	| 'jar'
	| 'table'
	| 'talisman'
	| 'shrine'
	| 'post'
	| 'warrant'
	| 'object';

export type WorldIcon = {
	id: string;
	/** English label on the wiki. */
	name: string;
	ko?: string;
	hanja?: string;
	kind: WorldIconKind;
	/** Board in `static/` when painted; omit until art exists. */
	src?: string;
	/**
	 * How people keep it — one or two concrete sentences, not a lecture.
	 * Prefer attested practice over invention.
	 */
	note: string;
	/**
	 * Person id this icon belongs to (god or folk-saint).
	 * Omit for household / village forms that have no chronicle face yet
	 * (Seongju, Jowang, Chilseong…) — still listed as research slots.
	 */
	person?: string;
};

/**
 * Attested / strongly attested worldly forms, keyed for wiki + GenerateImage.
 * Icons with `src` are live; the rest are research slots waiting for boards.
 */
export const WORLD_ICONS: WorldIcon[] = [
	// ——— Samsin (産神 / 삼신할머니) ———
	{
		id: 'samsin-painting',
		person: 'samsin',
		name: 'Samsin painting',
		ko: '삼신도',
		kind: 'painting',
		src: '/icon_samsin_painting.png',
		note: 'A framed musindo of the birth goddess hung in the inner room or a mudang’s altar — gold ground, white gokkal, the midwife who opens the breath. Grandmothers call her Samsin Halmang.'
	},
	{
		id: 'samsin-jar',
		person: 'samsin',
		name: 'Samsin jar',
		ko: '삼신단지',
		kind: 'jar',
		note: 'Earthen jar (or gourd) of rice on the anbang shelf, covered with white paper and tied with left-twisted straw rope. Some houses keep only a “empty” Samsin with no jar until a birth, then set one for the three weeks.'
	},
	{
		id: 'samsin-table',
		person: 'samsin',
		name: 'Samsin table',
		ko: '삼신상',
		kind: 'table',
		src: '/icon_samsin_table.png',
		note: 'Rice and miyeok soup offered right after a birth — sometimes three bowls, sometimes one. Only the mother eats what was on that table. Repeated at three weeks, hundred days, and first birthday. Sits next to the mother in every birth room.'
	},
	{
		id: 'samsin-geumjul',
		person: 'samsin',
		name: 'Birth rope',
		ko: '금줄',
		kind: 'object',
		note: 'Left-twisted straw rope across the gate after a birth, charcoal and red peppers for a boy, charcoal and pine charcoal-ends for a girl — bars outsiders and unclean feet until the three weeks end.'
	},

	// ——— Bihyung (Samguk Yusa door charm) ———
	{
		id: 'bihyung-charm',
		person: 'yongsu',
		name: 'Bihyung door charm',
		ko: '비형랑 문부',
		hanja: '鼻荊郎',
		kind: 'charm',
		src: '/icon_bihyung_charm.png',
		note: 'After he kills the fox Gildal, ghosts flee the name Bihyung. People paste his portrait — or the four-line verse naming his room — on the gate so dokkaebi and plague spirits will not stay. Same job Cheoyong later does with a painted face.'
	},

	// ——— Cheoyong (처용) — plague door painting ———
	{
		id: 'cheoyong-munbae',
		person: 'cheoyong',
		name: 'Cheoyong door painting',
		ko: '처용문배',
		hanja: '處容門排',
		kind: 'charm',
		note: 'Samguk Yusa: the plague spirit vows never to enter a house that shows Cheoyong’s face. New Year sehwa and munbae keep pasting him on gates through Joseon — the older twin of the Bihyung charm.'
	},

	// ——— Hallakgungi (서천꽃밭) ———
	{
		id: 'hallak-flower',
		person: 'sara',
		name: 'Life / doom flower',
		ko: '서천꽃',
		kind: 'object',
		note: 'Not a household hanging — the western flower field itself is his body of work. Mudang and epic only gesture at the rows; a single bloom in a rite stands in for resurrection or ruin.'
	},

	// ——— Bari (巫祖) ———
	{
		id: 'bari-musindo',
		person: 'bari',
		name: 'Bari shaman painting',
		ko: '바리공주 무신도',
		kind: 'painting',
		note: 'In northern and central mudang halls she hangs as the shaman ancestress — often a quiet court lady, even when the epic makes her twenty-eight spans tall. The malmi (말미) of a jinogwi gut sings her road before the dead are walked west.'
	},
	{
		id: 'bari-knife',
		person: 'bari',
		name: 'Shaman’s knife',
		ko: '무도',
		kind: 'object',
		note: 'Every mudang hut keeps a knife for the road-cutting rites. The chronicle hangs it as Bari’s — soft where Kangrim is hard, the blade that parts this world from the next without fetching.'
	},

	// ——— Kangrim / Haewonmek (저승차사) ———
	{
		id: 'kangrim-jeokpaeji',
		person: 'kangrim',
		name: 'Red name warrant',
		ko: '적패지',
		hanja: '赤牌旨',
		kind: 'warrant',
		note: 'Red cloth or paper with the dead person’s name. Kangrim reads it three times; the soul leaves the body. The living never see the book unless a mudang paints the chasa holding it.'
	},
	{
		id: 'kangrim-musindo',
		person: 'kangrim',
		name: 'Chasa painting',
		ko: '차사도',
		kind: 'painting',
		note: 'Underworld-messenger musindo — dark coat, red warrant, sometimes paired with Haewonmek and Lee Deokchun as the three escorts. Hung in death-gut halls more than in kitchens.'
	},
	{
		id: 'haewonmek-musindo',
		person: 'haewonmek',
		name: 'Haewonmek painting',
		ko: '해원맥 무신도',
		kind: 'painting',
		note: 'The other famous escort beside Kangrim. In 「차사본풀이」 he already works the roads when Kangrim arrives; folk paintings keep them as a pair of stern clerks, not brothers with a crow.'
	},

	// ——— Yumla (염라 / 시왕) ———
	{
		id: 'yumla-siwang',
		person: 'yumla',
		name: 'Ten Kings painting',
		ko: '시왕도',
		hanja: '十王圖',
		kind: 'painting',
		note: 'Temple and mudang halls paint the Ten Kings of judgment; Yumla sits the first chair. A quieter cousin of the Buddhist siwangdo that Joseon temples hang in Myeongbujeon.'
	},

	// ——— Gusamsin ———
	{
		id: 'gusamsin-halmang',
		person: 'yongnyeo',
		name: 'Old Samsin',
		ko: '구삼신할망',
		kind: 'painting',
		note: 'Folk speech keeps a “former” or “old” Samsin for children who die before fifteen. Less often painted than her living sister; when she is, she is the midwife on the dead side of the same shelf.'
	},

	// ——— Haemosu / Ibiga / Yuhwa (life three) ———
	{
		id: 'haemosu-ilsindo',
		person: 'haemosu',
		name: 'Sun-god painting',
		ko: '일신도',
		kind: 'painting',
		note: 'Rare musindo of the sun god — chariot or standing solar figure. The chronicle’s gold chariot is the louder worldly form; mudang sun tablets are the quieter one.'
	},
	{
		id: 'ibiga-cheonsindo',
		person: 'ibiga',
		name: 'Sky-god painting',
		ko: '천신도',
		kind: 'painting',
		note: 'Heaven / sky god hanging in a mudang’s upper row — weather and open air. Ibiga’s cloud-country is what that painting is trying to keep in a room.'
	},
	{
		id: 'yuhwa-wolsindo',
		person: 'yuhwa',
		name: 'Moon-god painting',
		ko: '월신도',
		kind: 'painting',
		note: 'Moon deity musindo, sometimes paired with the sun. River offerings and willow banks are her older ground; the painting is the indoor copy.'
	},

	// ——— Dangun / Hwanung / Hannim ———
	{
		id: 'dangun-musindo',
		person: 'dangun',
		name: 'Dangun painting',
		ko: '단군 무신도',
		kind: 'painting',
		note: 'Attested on the Inwangsan Guksadang wall among twenty-one state-shaman paintings — sandalwood king kept as a hanging god, not only a foundation myth.'
	},
	{
		id: 'hwanung-shrine',
		person: 'hwanung',
		name: 'Heavenly-descent shrine',
		ko: '천신당',
		kind: 'shrine',
		note: 'Mountain shrines and later Dangun halls keep the descent as a paired tablet or painting — Hwanung with the three heavenly seals, before the sandalwood king is born.'
	},

	{
		id: 'yongwang-painting',
		person: 'dragonking',
		name: 'Dragon King painting',
		ko: '용왕도',
		kind: 'painting',
		note: 'Dragon King of wells and sea — hung for rain and safe boats. Housewives clean the well on the fourteenth of the first month; Jeju keeps a full yongwang maji rite. The chronicle’s East Sea father is the same office under a personal name.'
	},
	{
		id: 'sansin-painting',
		name: 'Mountain god painting',
		ko: '산신도',
		hanja: '山神圖',
		kind: 'painting',
		note: 'White-bearded mountain god with a tiger in a temple’s Sansingak or Samseonggak. The tiger is mount and double; people climb for sons and luck the same way they climb for a Buddha. (No single chronicle face yet — every mountain keeps its own.)'
	},

	// ——— Household gods without chronicle faces (research slots) ———
	{
		id: 'seongju-jar',
		name: 'House-guardian jar',
		ko: '성주단지',
		kind: 'jar',
		note: 'Rice or grain on a shelf under the main beam — Seongju, the god of the house itself. A gosa in the first month feeds him before anyone else eats.'
	},
	{
		id: 'jowang-bowl',
		name: 'Kitchen water bowl',
		ko: '조왕중발',
		kind: 'object',
		note: 'Fresh well water on the stove each dawn in Honam houses. The kitchen god opens most Honam guts; housewives rub their hands to him for the children’s safety.'
	},
	{
		id: 'teoju-stack',
		name: 'Site-god stack',
		ko: '터주가리',
		kind: 'jar',
		note: 'Jar of grain under a conical straw cover by the sauce-jar terrace — Teoju / Cheollyung, the god of the house plot. Do not spit there.'
	},
	{
		id: 'chilseong-painting',
		name: 'Seven Stars painting',
		ko: '칠성도',
		hanja: '七星圖',
		kind: 'painting',
		note: 'Northern Dipper as seven officials — longevity and children’s fate. Temples keep a Chilseonggak; mudang hang the same faces; paper chilseongbu talismans go home with the sick. (Roster god, not yet a chronicle character.)'
	},
	{
		id: 'chilseong-talisman',
		name: 'Seven Stars talisman',
		ko: '칠성부',
		hanja: '七星符',
		kind: 'talisman',
		note: 'Written or printed bujeok matched to a star of the Dipper — carried for long life, or tucked under a child’s pillow.'
	},

	// ——— Jangseung (boards live as relics) ———
	{
		id: 'jangsung-pair',
		person: 'relic-jangsung-male',
		name: 'Village guardian posts',
		ko: '장승',
		kind: 'post',
		note: 'Paired carved posts at the village mouth — Heaven’s Great General and the Underground Girl. Travellers bow or spit; the wood stays.'
	}
];

export function iconsOf(personId: string): WorldIcon[] {
	return WORLD_ICONS.filter((i) => i.person === personId);
}

export function iconsWithArt(personId: string): WorldIcon[] {
	return iconsOf(personId).filter((i) => !!i.src);
}

/** Kind label for wiki chips. */
export function iconKindLabel(kind: WorldIconKind, lang: 'en' | 'ko' = 'en'): string {
	const map: Record<WorldIconKind, { en: string; ko: string }> = {
		painting: { en: 'Painting', ko: '무신도' },
		charm: { en: 'Door charm', ko: '문부' },
		jar: { en: 'Jar', ko: '단지' },
		table: { en: 'Offering table', ko: '상' },
		talisman: { en: 'Talisman', ko: '부적' },
		shrine: { en: 'Shrine', ko: '신당' },
		post: { en: 'Post', ko: '장승' },
		warrant: { en: 'Warrant', ko: '적패지' },
		object: { en: 'Kept object', ko: '신체' }
	};
	return map[kind][lang];
}
