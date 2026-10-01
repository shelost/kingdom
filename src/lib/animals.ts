/**
 * Named horses and mythic creatures of the chronicle — each one is a wiki
 * profile (`entity: 'animal'`), the same way `swords.ts` turns blades into
 * profiles.
 *
 * Visual facts (name, Korean, kind, rider, board) live once in
 * `data/visual-canon.json` → `animals`, which GenerateImage prompts also read.
 * This file only adds what the wiki needs on top: a cover still, prose, years.
 */

import { animals as CANON } from '$lib/data/visual-canon.json';
import type { LifeEvent, Person } from '$lib/people';

type CanonAnimal = {
	name: string;
	ko?: string;
	owner?: string;
	guides?: string[];
	kind: string;
	board?: string;
	battleBoard?: string;
};

export type AnimalId = keyof typeof CANON;

interface AnimalDef {
	id: AnimalId;
	kingdom: Person['kingdom'];
	/** Real light of the animal — coat colour, or the one accent it carries. */
	color: string;
	/** Card / infobox title line. */
	title: string;
	/** Story still used as the card and hero art (`/temp/*.jpg`). */
	cover?: string;
	hanja?: string;
	/** Reader-facing coat line beside the board (canon `look` is prompt text). */
	coat: string;
	tagline: string;
	arc: string;
	events?: LifeEvent[];
	/** Earlier names that still appear in old still prompts / refs. */
	formerNames?: string[];
	formerBoards?: string[];
	mythic?: boolean;
}

const ANIMAL_DEFS: AnimalDef[] = [
	{
		id: 'hanbyul',
		kingdom: 'silla',
		color: '#8A4B2A',
		title: 'Kim Yushin’s first horse',
		coat: 'Plain dark chestnut hwarang mount — nothing grand.',
		tagline: 'Yushin’s first horse; took a sleeping rider where he always went, and lost its head for it.',
		arc: 'Seventeen, drunk, and asleep in the saddle, Yushin let Hanbyul find the way home — and a good horse takes a sleeping rider where he always goes. He woke at the courtesan Cheongwan’s gate with her lantern already lifted. He had sworn off that gate; the horse had not. He got down, drew, and took Hanbyul’s head off in one stroke, then walked home past the lantern. Cheongwan’s song about that night outlived them both.',
		events: [{ year: 612, label: 'Carries a sleeping Yushin to Cheongwan’s gate; beheaded there.' }]
	},
	{
		id: 'hangyul',
		kingdom: 'silla',
		color: '#E8E4DA',
		title: 'Kim Yushin’s war horse',
		cover: '/temp/nangbi-naming.jpg',
		coat: 'Pure white war horse with a long flowing white mane.',
		tagline: 'The spare from the royal stable that took the Nangbi trench in one jump.',
		arc: 'At Nangbi Fortress Yushin, thirty-four and a banner captain, rode a white horse nobody had bothered to name. It took the trench in one jump the men in it described for the rest of their lives, usually with their hands — in, out, in again. That night Yushin asked the groom its name; it had none, so he gave it one. Hangyul carried him eighteen years, to every border the queen sent him and a few he went to without asking, and at the end put its nose into his chest and waited.',
		events: [
			{ year: 629, label: 'Jumps the Nangbi trench three times; named that night.' },
			{ year: 647, label: 'Dies after eighteen years under Yushin.' }
		]
	},
	{
		id: 'hanseul',
		kingdom: 'silla',
		color: '#DCE3E8',
		title: 'Kim Yushin’s last horse',
		cover: '/temp/hwangsan-white-horse-back.jpg',
		coat: 'Pure white like Hangyul before him — younger, a hand lighter in the chest.',
		tagline: 'The last horse Yushin names — white against Gyebek’s black at the Yellow Mountain.',
		arc: 'Named on the tenth day after Hangyul, and the last horse Yushin ever names. He rides Hanseul out that day and across the Yellow Mountain fields thirteen years later, and never once lets a groom catch him brushing it longer than the others. At Hwangsanbeol the white horse against Gyebek’s black Gomanari is the picture the field remembers.',
		events: [
			{ year: 647, label: 'Named after Hangyul’s death.' },
			{ year: 660, label: 'Carries Yushin across Hwangsanbeol against Gomanari.' }
		]
	},
	{
		id: 'gomanari',
		kingdom: 'baekje',
		color: '#D9B13A',
		title: 'Gyebek’s war horse',
		cover: '/temp/gomanari-dawn-yard.jpg',
		coat: 'Jet-black war horse, long black mane and tail; plain dark tack with a yellow cord at the bridle.',
		tagline: 'The one thing Gyebek owns that the Tang cannot sell in a slave market.',
		arc: 'Named for the old bear ferry at Gomanaru (Ungjin) where Gyebek learned to ride. On the last morning the yard is swept and nothing in it belongs to him any more except the black horse at the post. Gomanari carries him onto the Yellow Mountain field against the white Hanseul, and stands by its master’s planted sword after the field is quiet.',
		events: [{ year: 660, label: 'Carries Gyebek to Hwangsanbeol; stands by the planted sword.' }]
	},
	{
		id: 'bisamun',
		kingdom: 'silla',
		color: '#6B2A1E',
		title: 'Bidam’s war horse',
		cover: '/temp/bisamun-riderless.jpg',
		hanja: '毘沙門',
		coat: 'Dark mahogany blood-bay, heavy black mane and long forelock, black legs; nine prayer beads knotted under the jaw.',
		tagline: 'Named for the guardian king of the north; will not be led by anyone else.',
		arc: 'Bisamun is named for Vaiśravaṇa, the guardian king who stands at the north of every temple with a pagoda in his hand. Through the Radiance siege Bidam goes down to the lines to stand beside him, saying nothing. Before the last gate opens he saddles the horse himself — which a Sangdaedeung does not do — and knots nine beads from his string to the bridle. When it is over, the horse stands riderless over him and lets no groom near, then walks north.',
		events: [{ year: 647, label: 'Carries Bidam out of Radiance Fortress; walks north riderless.' }]
	},
	{
		id: 'hadong',
		kingdom: 'silla',
		color: '#A0522D',
		title: 'Kim Chunchu’s road horse',
		cover: '/temp/hadong-empty-saddle.jpg',
		hanja: '夏冬',
		coat: 'Lean rangy red bay with a fine head, black stockings and a thin black mane; court tack with magenta tassels.',
		tagline: 'A diplomat’s horse, named for summer and winter — it has to stand in both.',
		arc: 'Chunchu leaves by the west gate of Wolseong on Hadong, a lean red bay he named for summer and winter, because a diplomat’s horse, he says, has to stand in both. Yushin walks beside the bridle as far as the gate and no farther. When Chunchu comes back down the last hill on foot, thinner, his left hand bound, Yushin has brought the horse: Hadong tied at the front of the lines with an empty saddle, the way some armies carry an empty chair.',
		events: [
			{ year: 642, label: 'Carries Chunchu out of the west gate toward Goguryeo.' },
			{ year: 642, label: 'Waits at the border with an empty saddle for his return.' }
		]
	},
	{
		id: 'damul',
		kingdom: 'goguryeo',
		color: '#7A2418',
		title: 'Yeon Gesomun’s war stallion',
		cover: '/temp/sasu-damul-knot.jpg',
		hanja: '多勿',
		coat: 'The biggest horse on any field: deep brown-red stallion with a thick black mane and tail; in battle, Goguryeo gaema barding with a steel chamfron and red plume.',
		tagline: 'Gesomun’s war stallion — named for winning back the lost land.',
		arc: 'Damul takes its name from the old Goguryeo word 다물 (多勿): to win back what was lost. Browner and darker than Hadong, redder and larger than Bisamun, it charges into water and spears without being asked and bites other horses. At the Sasu River it carries Gesomun, a crow sword in each hand, through the Tang riders in the winter shallows.',
		events: [{ year: 662, label: 'Carries Gesomun into the Sasu shallows against the Tang.' }],
		formerNames: ['Bulgae'],
		formerBoards: ['/obj_bulgae.png']
	},
	{
		id: 'chunma',
		kingdom: 'silla',
		color: '#F1E6C8',
		title: 'Heavenly horse of Najeong',
		cover: '/temp/chunma-najeong-kneel.jpg',
		hanja: '天馬',
		mythic: true,
		coat: 'White winged heavenly horse, painted as on the Cheonmachong saddle-flap.',
		tagline: 'Knelt and wept beside a purple egg at Najeong, then rose into the sky.',
		arc: 'One morning at the Najeong well a white horse kneels and cries beside something in the grass. When it sees men coming it neighs and rises into the sky. Alpyung is the first to look down at what it was kneeling over: a purple egg, and in it Hyukgose. Much later, when the country has a name and a calendar and a clerk for everything, the horse is painted on a saddle-flap, buried with a king, and called Chunma, the heavenly horse.',
		events: [{ year: -69, label: 'Kneels beside the purple egg at Najeong; rises into the sky.' }]
	},
	{
		id: 'sinrok',
		kingdom: 'baekje',
		color: '#E3C98A',
		title: 'Guardian deer of Baekje',
		cover: '/temp/sinrok-buak-summit.jpg',
		hanja: '神鹿',
		mythic: true,
		coat: 'Pale white-gold stag with tall branching antlers.',
		tagline: 'The guardian deer that led Onjo and Biryu south — and stayed with Onjo.',
		arc: 'Owned by no one. The stag leads the two brothers south from Jolbon to the summit where the land can be read. Biryu laughs too loudly, says the deer has no taste, and takes his half of the people down to Michuhol and the salt flats. The stag stays. Baekje will call it Sinrok, the guardian deer, for as long as Baekje has anything to call.',
		events: [{ year: -18, label: 'Leads Onjo and Biryu south; stays with Onjo.' }]
	},
	{
		id: 'samjogo',
		kingdom: 'goguryeo',
		color: '#C30000',
		title: 'Three-legged crow, guardian of Goguryeo',
		cover: '/temp/samjogo-cavern-door.jpg',
		hanja: '三足烏',
		mythic: true,
		coat: 'Black three-legged crow — always three legs — under a red sun.',
		tagline: 'The three-legged crow that flew ahead to show Jumong the way.',
		arc: 'Owned by no one. The black crow keeps pace with Jumong through the pines, waits on the far bank of the Amnok when the tortoises carry him over — he counts the legs, grinning, and gets three — and sits above the cavern mouth where the road turns. Under a red sun it rides south with him, and the crow becomes Goguryeo’s mark: stamped on every commander’s ring-pommel in Pyongyang.',
		events: [{ year: -37, label: 'Waits on the far bank of the Amnok; leads Jumong south.' }]
	},
	{
		id: 'sunfox',
		kingdom: 'goguryeo',
		color: '#F0B429',
		title: 'Haemosu’s heat on foot',
		cover: '/temp/yuhwa-exile-fox-pine.jpg',
		mythic: true,
		coat: 'Large pale cream-white fox with long flowing fur and a full brush tail.',
		tagline: 'Haemosu’s heat on foot — it walked Yuhwa down the exile road.',
		arc: 'When Habek casts Yuhwa out and the sun-chariot cannot stop twice, Haemosu sends the heat that walks instead. The fox is already on the packed earth when she looks up — pale gold-white fur, the same heat that stopped the chariot. It looks back once, so she will not miss the joke, leads her through the pine shade and over the pass, and does not explain the map. At the Buyeo ridge it is gone, and Geumwa is coming down the path.',
		events: [{ label: 'Leads Yuhwa from the Amnok to Buyeo.' }]
	},
	{
		id: 'baitiwu',
		kingdom: 'tang',
		color: '#3A3A42',
		title: 'The Second Emperor’s horse in the west',
		cover: '/temp/steed-baitiwu-night-ride.jpg',
		hanja: '白蹄烏',
		coat: 'Black from ear to tail, white at all four feet.',
		tagline: 'Ran two hundred li in one night and put a twenty-year-old prince at a warlord’s gate by dawn.',
		arc: 'The first of the six stone horses in the gallery behind the Liangyi Hall. When the warlord who held the west broke at Qianshuiyuan before noon, the generals wanted rest; the prince did not. Baitiwu ran all night, two hundred li, and the warlord woke to find the Tang at his gate and simply surrendered. The emperor still calls it the most exhausted and the most pleased he has ever been.',
		events: [{ year: 618, label: 'Night ride from Qianshuiyuan; the west surrenders at dawn.' }]
	},
	{
		id: 'telebiao',
		kingdom: 'tang',
		color: '#D8B860',
		title: 'The Second Emperor’s horse at Taiyuan',
		cover: '/temp/steed-telebiao-queshu.jpg',
		hanja: '特勒驃',
		coat: 'Yellow, with a pale muzzle — a steppe horse with a Turkic name.',
		tagline: 'Eight engagements in one day, and not one complaint.',
		arc: 'He came off the steppe with a Turkic name, and the prince had not the heart to take it from him. When a northern warlord seized Taiyuan — his father’s own city, the one the Tang marched out of — Telebiao carried him down the Queshu valley: eight engagements in a single day, two days without food, three without armour off. The horse never complained. The rider never stopped.',
		events: [{ year: 620, label: 'Queshu valley: eight engagements in a day; Taiyuan retaken.' }]
	},
	{
		id: 'qingzhui',
		kingdom: 'tang',
		color: '#8C98A0',
		title: 'The Second Emperor’s horse at Hulao',
		cover: '/temp/steed-qingzhui-hulao.jpg',
		hanja: '青騅',
		coat: 'Grey-dappled, and fast as a rumour.',
		tagline: 'Five arrows at Hulao — every one from behind.',
		arc: 'At Hulao a rival who called himself king came with a hundred thousand men to relieve Luoyang. The prince had perhaps three thousand five hundred riders and chose to be rude about the arithmetic. Five arrows struck Qingzhui, every one of them from behind: by the time the archers drew, the grey was already past them.',
		events: [{ year: 621, label: 'Hulao: three thousand five hundred riders against a hundred thousand.' }]
	},
	{
		id: 'shifachi',
		kingdom: 'tang',
		color: '#B8322A',
		title: 'The Second Emperor’s horse of two pretenders',
		cover: '/temp/steed-shifachi-hedgehog.jpg',
		hanja: '什伐赤',
		coat: 'Red as a seal — the name is a Turkic title, worn like one.',
		tagline: 'Finished the charge with five arrows in the hindquarters, bristling like a hedgehog.',
		arc: 'In one spring he carried the prince against both pretenders — the one shut up in Luoyang and the one who came to save him. Five arrows in the hindquarters and he finished the charge regardless, bristling like a hedgehog that had lost its temper. Two pretenders taken in one season on that horse, and the historians still insist on crediting the rider.',
		events: [{ year: 621, label: 'Carries the prince against Luoyang and its relief army.' }]
	},
	{
		id: 'quanmaogua',
		kingdom: 'tang',
		color: '#B8935A',
		title: 'The Second Emperor’s horse at the Ming River',
		cover: '/temp/steed-quanmaogua-nine-arrows.jpg',
		hanja: '拳毛騧',
		coat: 'Curly-coated and black-muzzled — the ugliest horse in the empire.',
		tagline: 'Nine arrows, six in front and three behind; stood until the fighting was done.',
		arc: 'The ugliest horse in the empire and the most stubborn. By the Ming River, against the last of the rebels, he took nine arrows — six in front, three behind; the masons who cut his panel counted them carefully. He stood until the fighting was done. Then he lay down, as though he had only been waiting for permission.',
		events: [{ year: 622, label: 'Ming River: nine arrows; stands until the battle ends.' }]
	},
	{
		id: 'saluzi',
		kingdom: 'tang',
		color: '#6E2C4A',
		title: 'The Second Emperor’s most loyal warrior',
		cover: '/temp/steed-saluzi-arrow.jpg',
		hanja: '颯露紫',
		coat: 'Purple, the colour of a fresh bruise, and quite as proud of himself.',
		tagline: 'The most loyal warrior the emperor ever had — never held office, never asked for anything, and was a horse.',
		arc: 'At their first audience the emperor tells Chunchu he is alive because he reads people well — “that, and Saluzi,” the most loyal warrior he ever had, who never held office and took an arrow meant for him outside Luoyang. Chunchu has a clerk of the Ministry of War search the rolls for an afternoon and finds no Saluzi anywhere. In the gallery of stone horses the emperor saves the third panel for last: the young prince had galloped too far ahead and found himself alone with the pretender’s army; an arrow took Saluzi in the chest, and he stood with it in him until one of the generals rode in and drew it out with his bare hands. Saluzi carried the prince back to camp, and then died. At Zhaoling he stands nearest the door.',
		events: [
			{ year: 621, label: 'Takes an arrow outside Luoyang; carries the prince back to camp and dies.' },
			{ year: 648, label: 'Introduced to Chunchu in the gallery of the six stone horses.' }
		]
	}
];

/** Profile id for a canon animal — prefixed so it never collides with a person id. */
export function animalProfileId(id: AnimalId): string {
	return `animal-${id}`;
}

function canonOf(id: AnimalId): CanonAnimal {
	return CANON[id] as CanonAnimal;
}

/** Every board that identifies this animal in a still's `refs` (including retired names). */
export function animalBoards(def: AnimalDef): string[] {
	const c = canonOf(def.id);
	return [c.board, c.battleBoard, ...(def.formerBoards ?? [])].filter((b): b is string => !!b);
}

/** Names that identify this animal in a still's id / alt / canon header. */
export function animalNames(def: AnimalDef): string[] {
	const c = canonOf(def.id);
	return [c.name, ...(c.ko ? [c.ko] : []), ...(def.formerNames ?? [])];
}

export function toAnimalPerson(def: AnimalDef): Person {
	const c = canonOf(def.id);
	const guided = !!c.guides?.length;
	const owners = guided ? c.guides! : c.owner ? [c.owner] : [];
	const aliases = [c.name, ...(c.ko ? [c.ko] : []), ...(def.hanja ? [def.hanja] : [])];
	return {
		id: animalProfileId(def.id),
		name: c.name,
		korean: c.ko,
		hanja: def.hanja,
		entity: 'animal',
		kingdom: def.kingdom,
		color: def.color,
		title: def.title,
		tagline: def.tagline,
		arc: def.arc,
		events: def.events,
		owners,
		ownersLabel: guided ? 'Guided' : def.mythic ? 'Bound to' : 'Rider',
		avatar: def.cover ?? c.board,
		objectImage: c.board,
		object: def.coat,
		aliases: [...new Set(aliases)]
	};
}

export const ANIMAL_INDEX: { profileId: string; boards: string[]; names: string[] }[] =
	ANIMAL_DEFS.map((def) => ({
		profileId: animalProfileId(def.id),
		boards: animalBoards(def),
		names: animalNames(def)
	}));

export const ANIMALS: Person[] = ANIMAL_DEFS.map(toAnimalPerson);
