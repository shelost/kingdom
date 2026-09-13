/**
 * Planned movie sequences — grounded film like Jumong / Pumsuk / Wu halls:
 * same place, chronology, angle variety, stills locked to dialogue.
 */
export type SequenceShot = {
	id: string;
	role: string;
	angle: string;
	at?: string;
};

export type MovieSequence = {
	id: string;
	title: string;
	entryTitles: string[];
	place: string;
	why: string;
	canon: string;
	shots: SequenceShot[];
};

export const MOVIE_SEQUENCES: MovieSequence[] = [
	{
		id: 'sasu-soul',
		title: 'Snake River — soul and the escorts',
		entryTitles: ['Snake River'],
		place: 'Sasu / Snake River — winter willow bend, ice plane (pl_snake_river)',
		why: 'Yeon Gesomun’s near-death: Tang blade at the throat, Kangrim and Haewonmek fail, soul leaves, cuts the escorts, returns, eyes lock, soldier is stopped mid-stab. (Chronicle marshal here is Yeon, not Yushin.)',
		canon: 'DARK night battle, painterly not photoreal, 80% crushed black. Goguryeo red-wing helm (Ansi guardian language). Soul is a translucent WHITE body-double, bare-handed vs both escorts. Wide first, then dutch stab, worm’s-eye exit, dutch grapple, high return, ECU eyes, OTS subdue. Same ice. No army catalog.',
		shots: [
			{ id: 'snake-river-wide', role: 'exposition', angle: 'wide winter establishing' },
			{ id: 'sasu-seq-stab', role: 'Tang mid-stab', angle: 'over-shoulder', at: 'a Tang blade a finger from his throat' },
			{ id: 'sasu-seq-soul-exit', role: 'soul leaves', angle: 'worm’s-eye', at: 'the air thins the way Tamla stories promised' },
			{ id: 'sasu-seq-soul-fight', role: 'soul defeats escorts', angle: 'dutch', at: 'And neither is your business until I am done' },
			{ id: 'sasu-seq-soul-return', role: 'soul returns', angle: 'high dutch', at: 'He stands up on will alone' },
			{ id: 'sasu-seq-eyes', role: 'dead to alive', angle: 'ECU', at: 'The blade misses' },
			{ id: 'sasu-seq-subdue', role: 'wrist-lock stare', angle: 'OTS close', at: 'The blade misses' }
		]
	},
	{
		id: 'hwangsan',
		title: 'Yellow Mountain Fields',
		entryTitles: ['Yellow Mountain Fields'],
		place: 'Hwangsanbeol / Yeonsan — yellow grass, Maebong, three palisades',
		why: 'Baekje’s last arithmetic: 5,000 against 50,000. Steel lamellar both sides; yellow vs Confucian-blue cloth peek. Gyebek’s wait → charge → collapse.',
		canon: 'Wide place first, then palisade, gallop, clash, last stand. Steel-gray plates, character-hex cloth, high contrast, one device per cut.',
		shots: [
			{ id: 'hwangsan-wide', role: 'exposition wide', angle: 'aerial / high establishing' },
			{ id: 'hwangsan-three-camps', role: 'three roads in', angle: 'high view' },
			{ id: 'gyebek-seq-palisade', role: 'Gyebek holds', angle: 'worm’s-eye', at: 'Yellow lacquer holds the palisade' },
			{ id: 'yushin-seq-gallop', role: 'Yushin arrives', angle: 'dutch low gallop', at: 'The tall Silla helm comes in at a gallop' },
			{ id: 'hwangsan-seq-clash', role: 'two blades', angle: 'over-shoulder', at: 'Blue plume cuts yellow lacquer' },
			{ id: 'hwangsan-cavalry-fourth', role: 'fourth charge', angle: 'ground tracking' },
			{ id: 'gyebek-last-stand-yellow', role: 'aftermath iconic', angle: 'poster / lower-third' }
		]
	},
	{
		id: 'ansi',
		title: 'Ansi siege',
		entryTitles: ['Ansi'],
		place: 'Ansi fortress — red two-tier munru, stone ring, earthen ramp',
		why: 'The wall that stops an emperor. Same fortress every cut; Tang yellow vs Goguryeo red wings.',
		canon: 'Attach pl_ansi.png. Open wide, cut to ramp, parapet worm’s-eye, Taizong close, winter.',
		shots: [
			{ id: 'ansi-wide', role: 'exposition', angle: 'wide establishing' },
			{ id: 'ansi-stone-ring', role: 'the ring', angle: 'high view' },
			{ id: 'ansi-earthen-ramp', role: 'the mountain of dirt', angle: 'low / dutch' },
			{ id: 'yangmanchun-seq-wings', role: 'red wings', angle: 'worm’s-eye parapet', at: 'Red wings on the parapet' },
			{ id: 'taizong-ansi-face', role: 'emperor unmasked', angle: 'ECU' },
			{ id: 'ansi-winter', role: 'sixty days', angle: 'wide winter' }
		]
	},
	{
		id: 'gaya-muryuk',
		title: 'Muryuk — fight to surrender',
		entryTitles: ['Jinheung’s Betrayal', 'The Fall of Gaya'],
		place: 'Gwansanseong ridge, then Jinheung’s hall',
		why: 'Gaya’s last prince plus Sadaham’s 562 vanguard: cone helm at Gwansanseong, then Jinheung’s hall; True Bone is the price. Fight → Sadaham gate → surrender → rank.',
		canon: 'Lock the tall Gaya cone. Steel plates, purple cloth peek. Night ridge dutch, then hall. Sadaham ice-blue #6fa8ff under Silla steel.',
		shots: [
			{ id: 'gaya-seq-fortress-night', role: 'Gaya seong night', angle: 'wide night' },
			{ id: 'gwansan-three-hosts', role: 'three camps', angle: 'night wide' },
			{ id: 'muryuk-seq-ridge', role: 'ambush', angle: 'dutch night', at: 'Muryuk’s cone cuts the night ridge' },
			{ id: 'muryuk-seq-cone-fight', role: 'last fight', angle: 'worm’s-eye', at: 'The tall Gaya cone still fights' },
			{ id: 'sadaham-seq-vanguard', role: 'Sadaham fifteen', angle: 'dutch charge', at: 'They said too young.' },
			{ id: 'sadaham-seq-gate', role: 'the gate', angle: 'worm’s-eye', at: 'The gate didn’t.' },
			{ id: 'sadaham-seq-free', role: 'prize-cages', angle: 'lower-third', at: 'Take the land. Leave the people.' },
			{ id: 'gaya-surrender', role: 'kneel', angle: 'two-shot hall' },
			{ id: 'gaya-crown', role: 'True Bone', angle: 'insert / close' },
			{ id: 'muryuk-seq-aged', role: 'old prince', angle: 'worm’s-eye', at: 'Very well. Your descendants shall be raised as True Bone' }
		]
	},
	{
		id: 'sadaham-hwarang',
		title: 'Sadaham — first class',
		entryTitles: ['The Flower Youth', 'The Fall of Gaya'],
		place: 'Hwarang eaves, then Gaya seong, then empty bowl',
		why: 'Fifteen on the vanguard; Mugwan vow; seven days without food. Ice-blue #6fa8ff is the person.',
		canon: 'Steel on campaign stills; Hwarang coats on the vow. Intimate grief for seven days. High contrast. One of each named person.',
		shots: [
			{ id: 'sadaham-gaya-road', role: 'empty road', angle: 'iconic wide', at: '<b>Sadaham</b> was fifteen' },
			{ id: 'sadaham-seq-mugwan-vow', role: 'the swear', angle: 'two-shot eaves', at: 'If you die first, I will not eat.' },
			{ id: 'sadaham-seq-vanguard', role: 'too young', angle: 'dutch charge', at: 'They said too young.' },
			{ id: 'sadaham-seq-seven-close', role: 'seven days', angle: 'ECU', at: 'Sadaham did not take food for seven days' }
		]
	},
	{
		id: 'yeon-massacre',
		title: 'Yeon’s Massacre',
		entryTitles: ['Yeon’s Massacre'],
		place: 'Pyongyang banquet hall — same timber, one flame, then the door',
		why: 'The coup that makes Gesomun. Already ink-red; needs a film chronology: lamps → speech → blades → red-wing door.',
		canon: 'Locked hall. Gesomun is red #d0362f. Five pommels as a device. No army catalog.',
		shots: [
			{ id: 'pyongyang-sunset', role: 'place', angle: 'wide fortress' },
			{ id: 'banquet-lamps', role: 'before', angle: 'insert lamps' },
			{ id: 'gesomun-title', role: 'speech', angle: 'low authority' },
			{ id: 'gesomun-seq-wings', role: 'the door', angle: 'dutch / worm’s-eye', at: 'Red-wing chalgap fills the door' },
			{ id: 'yeon-shadow', role: 'the cut', angle: 'close kinetic' }
		]
	},
	{
		id: 'secretariat',
		title: 'Royal Secretariat',
		entryTitles: ['The Royal Secretariat', 'King Muyeol'],
		place: 'Silla palace interior — Tang-style official silk vs Harmony Council’s empty chairs',
		why: 'Power moves from round council to Tang bureaucracy. Dramatic interiors, rank clothes, Chunchu as Muyeol.',
		canon: 'Same hall. Tang coat vs Silla bone. Dutch / OTS / ECU. No furniture dump — one table or none. Chunchu #D8258C is the plane.',
		shots: [
			{ id: 'silla-tang-wide', role: 'two halls', angle: 'wide split' },
			{ id: 'secretariat-wide', role: 'exposition', angle: 'wide empty secretariat' },
			{ id: 'secretariat_01', role: 'side hall begins', angle: 'interior dutch', at: 'side hall in the palace' },
			{ id: 'secretariat_02', role: 'seal insert', angle: 'ECU still-life', at: '청원' },
			{ id: 'secretariat_03', role: 'relay leaves', angle: 'yard dusk', at: '파발' },
			{ id: 'tang-three-six-grid', role: 'Tang grammar', angle: 'iconic stamp-grid', at: 'Tang protocol adopted' },
			{ id: 'chunchu-map-pool', role: 'Muyeol counts', angle: 'poster / lower-third', at: 'Chunchu has counted the seals' }
		]
	},
	{
		id: 'taizong-chunchu-meet',
		title: 'Taizong and Chunchu — hall, then go',
		entryTitles: ['Silla-Tang Alliance'],
		place: 'Inside Daming Palace: night audience hall (vermilion colonnade, real dais with stairs), then a side chamber of the same palace for go',
		why: 'The 648 meeting as grounded film: court first, then one-on-one go. Li Shimin in yellow dragon yuanlingpao; Chunchu magenta. Emperor sits higher.',
		canon: 'REAL Daming interior every cut — vermilion columns, stone floor, oil-lamp, dais with stairs attached to the floor. NOT a floating yellow box, NOT a graphic void, NOT a bird’s-eye dollhouse. Worm’s-eye. Dark, yellow silk highlights. Two people. Same hall for shots 1–4; same side chamber for shots 5–8. Chronology: enter → kneel → Spring-and-Autumn → private go → name gift.',
		shots: [
			{
				id: 'taizong-meet-court-wide',
				role: 'court exposition',
				angle: 'worm’s-eye wide',
				at: 'approaches the Second Emperor'
			},
			{ id: 'taizong-meet-robe', role: 'emperor on the real dais', angle: 'worm’s-eye seated', at: 'Chunchu knelt and memorialized' },
			{
				id: 'taizong-meet-dais',
				role: 'kneel below the platform',
				angle: 'worm’s-eye stairs',
				at: 'Chunchu knelt and memorialized'
			},
			{
				id: 'taizong-meet-name',
				role: 'Spring and Autumn',
				angle: 'worm’s-eye ECU',
				at: 'Your name is Spring and Autumn'
			},
			{
				id: 'taizong-meet-go-wide',
				role: 'private room',
				angle: 'worm’s-eye wide',
				at: 'After the hall, a smaller room. A go board.'
			},
			{
				id: 'taizong-meet-go-up',
				role: 'looking up from the floor',
				angle: 'OTS worm’s-eye',
				at: 'Yes — there is something between us that fits.'
			},
			{
				id: 'taizong-meet-go-stone',
				role: 'stone click',
				angle: 'worm’s-eye ECU',
				at: 'I prefer allies who can count'
			},
			{
				id: 'taizong-meet-fit',
				role: 'two heights',
				angle: 'worm’s-eye two-shot',
				at: 'You asked my name, did you not.'
			}
		]
	},
	{
		id: 'jumong-sosuno-tsun',
		title: 'Sosuno — tsundere at Jolbon well',
		entryTitles: ['Jumong'],
		place: 'Jolbon yard: timber hall, grain porch, stone well, packed earth, grey giwa',
		why: 'Sosuno pretends hostility because she is too aroused; Jumong is confused, then catches on. Well kiss, fake exile, memorabilia stash, she runs. Tabal watches, grumpy. Original stills stay; new cuts lock to the new cues.',
		canon: 'SAME Jolbon well-yard every cut. Dusty-rose #e8a04a hanbok, not gold. Jumong red #e8563f. High contrast. Reuse existing porch/well/pine/ledger stills; new shots only for kiss → leave → stash → chase → Tabal.',
		shots: [
			{ id: 'jumong-seq-jolbon-wide', role: 'place', angle: 'dutch dusk', at: 'The Jolbon hall is a timber country' },
			{ id: 'jumong-seq-tabal-weigh', role: 'Tabal weighs', angle: 'OTS', at: 'I do not want ash tracked into my hall' },
			{ id: 'jumong-seq-porch-watch', role: 'she watches', angle: 'porch', at: 'She prices him, then forgets the count' },
			{ id: 'jumong-seq-back-blush', role: 'heat at his back', angle: 'OTS', at: 'She blushes at his back' },
			{ id: 'jumong-seq-well-wide', role: 'well exposition', angle: 'wide', at: 'The well is an accident she timed' },
			{ id: 'jumong-seq-well-name', role: 'name', angle: 'two-shot', at: 'May I ask your name' },
			{ id: 'jumong-seq-well-tsun', role: 'don’t look', angle: 'ECU', at: 'Don’t look at my face' },
			{ id: 'jumong-seq-well-kiss', role: 'he kisses her', angle: 'dutch two-shot', at: 'He kisses her at the well-beam' },
			{ id: 'sosuno-seq-how-dare', role: 'how dare you', angle: 'ECU', at: 'How dare you.' },
			{ id: 'jumong-seq-leave-bow', role: 'I’ll leave', angle: 'worm’s-eye', at: 'I’ll leave the village. Tonight.' },
			{ id: 'sosuno-seq-stay-awkward', role: 'don’t say stay', angle: 'OTS', at: 'The second bucket isn’t full' },
			{ id: 'jumong-seq-stash', role: 'memorabilia', angle: 'ECU still-life', at: 'You hide these like a thief' },
			{ id: 'sosuno-seq-stash-blush', role: 'caught', angle: 'ECU', at: 'Those are… inventory' },
			{ id: 'jumong-seq-turn-leave', role: 'he turns', angle: 'OTS back', at: 'save you the heartache' },
			{ id: 'sosuno-seq-run-kiss', role: 'she admits', angle: 'dutch catch', at: 'Stay. I wanted you.' },
			{ id: 'tabal-seq-grumpy', role: 'Tabal watches', angle: 'porch OTS', at: 'I am not pleased. I am also not blind.' },
			{ id: 'jumong-seq-pine-wide', role: 'the pine', angle: 'worm’s-eye yard', at: 'The pine is a hundred paces' },
			{ id: 'jumong-seq-split', role: 'arrow splits', angle: 'worm’s-eye', at: 'The hall hears the wood cry' },
			{ id: 'jumong-seq-ledger', role: 'after, the ledger', angle: 'lamp night', at: 'The ledger stays open longer than it needs to' }
		]
	}
];

export function sequenceOfSlot(slotId: string): MovieSequence | undefined {
	return MOVIE_SEQUENCES.find((s) => s.shots.some((sh) => sh.id === slotId));
}
