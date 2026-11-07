/**
 * Clothing of the chronicle: crowns, caps and helms, each a wiki profile
 * (`entity: 'clothing'`), the same way `instruments.ts` turns instruments into profiles.
 *
 * `board` is the museum photo or board in `static/` shown as the card and hero.
 * `sceneRefs` are the GenerateImage refs that put this piece on a still (a crowned
 * king carries the crown ref); a still also matches when its slot id names the piece.
 * The jougwan has no scene refs on purpose: every Samhan man wears it by default,
 * so its ref sits on most stills and would swallow the gallery.
 */

import type { LifeEvent, Person } from '$lib/people';

interface ClothingDef {
	id: string;
	name: string;
	ko: string;
	hanja?: string;
	/** The house nickname and any other names that identify it in a slot id or text. */
	altNames?: string[];
	kingdom: Person['kingdom'];
	/** Real light of the piece: its gold, lacquer or cloth. */
	color: string;
	title: string;
	board: string;
	sceneRefs?: string[];
	/** Make line beside the board. */
	build: string;
	tagline: string;
	arc: string;
	/** Person ids who wear it in the chronicle (most prominent first). */
	wearers: string[];
	events?: LifeEvent[];
}

const CLOTHING_DEFS: ClothingDef[] = [
	{
		id: 'flame-crown',
		name: 'Flame Crown',
		ko: '불꽃관',
		hanja: '火焰冠',
		altNames: ['Goguryeo crown', '불꽃무늬 금동관'],
		kingdom: 'goguryeo',
		color: '#D8632A',
		title: 'Crown of the Goguryeo kings',
		board: '/research/goguryeo-gilt-bronze-crown.jpg',
		sceneRefs: ['/ref_crown_goguryeo.png', '/research/goguryeo-gilt-bronze-crown.jpg'],
		build: 'Gilt-bronze band crowded with upright flame and branch sprays cut in openwork, hung with small round spangles that shiver when the head turns.',
		tagline: 'A ring of fire for the children of the sun.',
		arc: 'Goguryeo says its first king was a son of the sun, and its kings dress like they believe it. The crown is a band of gilt bronze with flames standing up all the way round, cut so thin that light comes through them. On a bright day it looks less like metal than like a small fire someone has agreed to wear. Few Goguryeo crowns survive, because Goguryeo tombs were robbed early and often, and the court mostly prefers the tall silk cap in front of its own people. The flame comes out for heaven, for envoys, and for anyone who needs reminding whose grandson the king is.',
		wearers: ['yeongnyu', 'bojang']
	},
	{
		id: 'tree-crown',
		name: 'Tree Crown',
		ko: '나무관',
		hanja: '出字形冠',
		altNames: ['Silla gold crown', '출자형 금관'],
		kingdom: 'silla',
		color: '#E2C15A',
		title: 'Gold crown of the Silla throne',
		board: '/research/silla-hwangnam-gold-crown.jpg',
		sceneRefs: [
			'/ref_crown_silla.jpg',
			'/research/silla-cheonmachong-gold-crown.jpg',
			'/research/silla-hwangnam-gold-crown.jpg'
		],
		build: 'Open crown on a narrow gold band: three flat tree uprights branching like 出 at the front and over the ears, two shorter antlers at the back, hundreds of trembling spangles and curved green jade gogok, long leaf pendants at the temples.',
		tagline: 'A forest in sheet gold, so thin it was never meant to fight anything.',
		arc: 'Silla buries more gold than its neighbours own. Its crowns are trees: three flat trunks rising from the band, branches turned up in stacked tiers, every tip a bud. Behind them stand two small antlers, because the shaman kings who first wore this were also the ones who talked to the forest. The whole thing is gold leaf on wire. It trembles when the wearer breathes and would fold in a light wind. Nobody wore it to war. Sunduk wore it to be looked at, which in Silla was a harder job.',
		wearers: ['sunduk', 'jinduk', 'chunchu', 'munmu']
	},
	{
		id: 'antler-crown',
		name: 'Antler Crown',
		ko: '뿔관',
		hanja: '鹿角冠',
		altNames: ['Baekje crown', '금제관식'],
		kingdom: 'baekje',
		color: '#C9A24A',
		title: 'Gold cap ornaments of the Baekje kings',
		board: '/crown_baekje.jpeg',
		sceneRefs: ['/crown_baekje.jpeg'],
		build: 'Tall black silk cap with a pair of openwork gold ornaments pinned to its sides, thin blades fanning up and out like a stag’s antlers, curling into leaf buds at the tips.',
		tagline: 'Black silk, and two gold antlers for the heavenly deer.',
		arc: 'Baekje does not make a ring of gold and put it on a head. It makes a black silk cap and pins two gold ornaments to the sides, so the king grows antlers when he dresses. The museum labels call them flame-and-honeysuckle. Sabi calls them antlers, after the heavenly deer on its banners, and nobody at court argues with Sabi about its own animals. The pair from King Muryeong’s tomb came out of the ground with their silk long rotted away, still standing up as if the head were there. Euija wears his tipped forward a little. It suits the expression.',
		wearers: ['euija', 'kingmu'],
		events: [{ label: 'The pair from King Muryeong’s tomb is the best surviving set.' }]
	},
	{
		id: 'leaf-crown',
		name: 'Leaf Crown',
		ko: '잎관',
		hanja: '草葉冠',
		altNames: ['Gaya crown', '초화형 금관'],
		kingdom: 'gaya',
		color: '#B7AE55',
		title: 'Crown of the Gaya kings',
		board: '/research/gaya-gilt-bronze-crown.jpg',
		sceneRefs: ['/ref_crown_gaya.png', '/research/gaya-gilt-bronze-crown.jpg'],
		build: 'Gold band with four or five tall uprights shaped like grass blades or unfolding leaves, plain edges, small jade gogok hanging from the band.',
		tagline: 'Grass in gold: the plainest crown on the peninsula, from the country that made the best iron.',
		arc: 'Gaya’s crowns are the simplest in Samhan. A band, and a few tall leaves of gold standing up from it like grass in a field. No branches, no antlers, no flames. A league of iron towns does not need its king to look like a forest. It needs him to look like the harvest. When the last king of Golden Gaya walked into Silla with his sons, he took the crown off and kept the iron. His grandsons would wear Silla’s trees.',
		wearers: ['ijinasi', 'guhae']
	},
	{
		id: 'jougwan',
		name: 'Jougwan',
		ko: '조우관',
		hanja: '鳥羽冠',
		altNames: ['feather cap'],
		kingdom: 'other',
		color: '#8A6A44',
		title: 'Feather cap of Samhan',
		board: '/hat_jougwan_rider.png',
		build: 'Small black lacquered gauze cap set high over the topknot, a thin band with a square opening at the front, cords tied under the chin, and two long barred pheasant feathers rising from the sides.',
		tagline: 'Two feathers on a black cap, and every foreign court knew where you were from.',
		arc: 'Silla, Goguryeo, Baekje and Gaya fight about everything except this. Their men all wear the same small black cap with two bird feathers standing up from it, and they have since before any of them were kingdoms. The feathers are for the bird that carries a man’s soul up to heaven. To an outsider they are simply the uniform of the peninsula. A Tang painter lining up the envoys of the world draws the Koreans by their feathers. A painter in faraway Samarkand, who had probably never heard of any of the four kingdoms, puts two men with feathered caps at the back of a royal audience, and that is how you know they came from the east. Tang men wear the soft black futou. Yamato men wear cloth caps in the twelve colours. Nobody else wears the feathers. Rank changes the cap: lacquer and plain feathers for most men, gold and silver plumes for the great, a crown for the king. Take it off and a Samhan man is half undressed.',
		wearers: ['yushin', 'bidam', 'gyebek', 'gesomun', 'seohyeon', 'muryuk']
	},
	{
		id: 'hwarang-headband',
		name: 'Crescent Headband',
		ko: '화랑 이마띠',
		altNames: ['hwarang headband', 'crescent-moon headband'],
		kingdom: 'silla',
		color: '#2A5FB8',
		title: 'Headband of the Hwarang',
		board: '/ch_kim_yushin_hwarang.png',
		build: 'Silk band tied across the brow with a crescent moon at the centre and long tails trailing behind; worn under the jougwan, in the wearer’s own colour.',
		tagline: 'A crescent moon on the forehead, and tails long enough for an old man to notice you are young.',
		arc: 'Silla’s banner is a crescent moon, and its boys wear one on their foreheads. Every Hwarang ties a silk band across his brow with the moon at the centre and the ends left long, so they fly when he runs and drag when he is tired. The colour is his own: Silla blue for Yushin, purple for Bidam, red for the boys who are going to do something stupid at Hwangsan. The band comes off when the yard is over. Yushin swaps his for a plain blue ribbon in his topknot. Bidam stops wearing anything on his forehead at all, which says more than the band ever did.',
		wearers: ['yushin', 'bidam', 'gwanchang', 'pumil', 'sadaham', 'wonsul', 'bangul']
	},
	{
		id: 'wing-helmet',
		name: 'Wing Helmet',
		ko: '날개 투구',
		altNames: ['Goguryeo helmet', 'red-wing helm'],
		kingdom: 'goguryeo',
		color: '#C30000',
		title: 'War helm of Goguryeo',
		board: '/ar_silla_goguryeo.jpg',
		build: 'Peaked steel helm of narrow riveted plates with a red horsehair plume, a lamellar neck guard, and swept red wing flaps over the ears and shoulders.',
		tagline: 'Red wings and a red plume: you saw a Goguryeo line before you heard it.',
		arc: 'Goguryeo fights on horseback and wants to be seen doing it. Its helm is a tall steel peak of riveted strips, topped with red horsehair, with a neck guard of small plates and red wings swept back over the ears. Hung off a line of cavalry coming downhill, the wings make the whole charge look like a flock that has decided to land on you. The Tang generals who wrote reports from the Liao River describe the red before anything else. Yeon Gaesomun wears his with a red cape, two swords on his back and no interest in hiding.',
		wearers: ['gesomun', 'yangmanchun']
	},
	{
		id: 'gilt-hood',
		name: 'Gilt Hood',
		ko: '금동관',
		hanja: '金銅冠',
		altNames: ['Baekje noble crown', 'great-clan crown'],
		kingdom: 'baekje',
		color: '#B8893A',
		title: 'Gilt-bronze cap of the Baekje great clans',
		board: '/crown_baekje_noble.jpeg',
		sceneRefs: ['/crown_baekje_noble.jpeg'],
		build: 'Tall pointed gilt-bronze cap like a peaked hood, pierced all over with dragon-and-flame scrolls, a crest arching over the top, two cup finials at the back and a leaf plume at the front; gold wings added at court.',
		tagline: 'The king wears silk and antlers. The great clans wear more gold than he does.',
		arc: 'Baekje is run by eight great houses, and the Satek house runs most of them. Their lords wear a tall pointed hood of gilt bronze, cut all over with dragons, with a crest along the top and little cups standing up at the back. It is heavier, taller and shinier than anything the king wears, and the king has noticed. At court audiences the lords pin two gold wings to the sides, which makes the hall look like a meeting of very rich birds. Buried with their owners up and down the country, these hoods are how archaeologists know how far the Satek reach went.',
		wearers: ['eldersatek', 'ministersatek', 'chunbok', 'sateksangya', 'sateksondung']
	},
	{
		id: 'futou',
		name: 'Futou',
		ko: '복두',
		hanja: '幞頭',
		altNames: ['Tang cap'],
		kingdom: 'tang',
		color: '#2B2B30',
		title: 'Soft black cap of the Tang court',
		board: '/ch_taizong.png',
		build: 'Black gauze kerchief wrapped over the topknot and stiffened into a rounded crown, with two tails hanging or standing out behind.',
		tagline: 'Black gauze and two tails: the cap of a man who answers to Chang’an.',
		arc: 'Every man in Chang’an who matters ties his hair under the same black gauze, the emperor included when he is not on a throne. It is soft, round, and very sure of itself. Next to a Samhan feather cap it looks like a different idea of what a head is for. Which is why Chunchu’s decision to put Silla’s court into Tang dress lands the way it does. The feathers come off. The futou goes on. Old men in Surabol take it personally.',
		wearers: ['taizong', 'gaozong']
	}
];

/** Profile id for a garment, prefixed so it never collides with a person id. */
export function clothingProfileId(id: string): string {
	return `clothing-${id}`;
}

function toClothingPerson(def: ClothingDef): Person {
	return {
		id: clothingProfileId(def.id),
		name: def.name,
		korean: def.ko,
		hanja: def.hanja,
		entity: 'clothing',
		kingdom: def.kingdom,
		color: def.color,
		title: def.title,
		tagline: def.tagline,
		arc: def.arc,
		events: def.events,
		owners: def.wearers,
		ownersLabel: 'Worn by',
		avatar: def.board,
		objectImage: def.board,
		object: def.build,
		aliases: [...new Set([def.name, def.ko, ...(def.hanja ? [def.hanja] : []), ...(def.altNames ?? [])])]
	};
}

export const CLOTHING_INDEX: { profileId: string; boards: string[]; names: string[] }[] =
	CLOTHING_DEFS.map((def) => ({
		profileId: clothingProfileId(def.id),
		boards: def.sceneRefs ?? [],
		names: [def.name, ...(def.altNames ?? [])]
	}));

export const CLOTHING: Person[] = CLOTHING_DEFS.map(toClothingPerson);
