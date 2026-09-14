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
		id: 'sunduk-overture',
		title: 'Queen Sunduk — Eastern Palace morning',
		entryTitles: ['Queen Sunduk'],
		place: 'Surabol Eastern Palace — pond, giwa, timber colonnade (pl_eastern_palace)',
		why: 'The chronicle opens here: Munhee’s hair, Chunchu with the children, Bupmin inventing a country on the hill. Needs film, not a portrait dump.',
		canon: 'SAME Eastern Palace every cut. ICONIC MINIMAL: one named device, empty frame, tiny or lower-third. 2D cel-painterly, no photoreal, no halo/bloom. DUTCH and WIDE. Sharp foreground / creamy bokeh. Magenta #D8258C, pink #E07FA8, crimson #C41E3A as rims only. One of each named person.',
		shots: [
			{
				id: 'sunduk-seq-palace-wide',
				role: 'exposition',
				angle: 'dutch wide dusk',
				at: 'getting her hair done'
			},
			{
				id: 'sunduk-seq-munhee-hair',
				role: 'Munhee attended',
				angle: 'dutch OTS / rack-focus',
				at: 'Totally unfit for a Noble woman'
			},
			{
				id: 'sunduk-seq-chunchu-prep',
				role: 'Chunchu preparing',
				angle: 'dutch mid-stride',
				at: 'the most cunning man in Samhan'
			},
			{
				id: 'sunduk-seq-bupmin-hill',
				role: 'Bupmin on the hill',
				angle: 'wide worm’s-eye',
				at: 'the hill where adults invent countries'
			}
		]
	},
	{
		id: 'family-ride',
		title: 'Chunchu — two horses on the palace road',
		entryTitles: ['Queen Sunduk'],
		place: 'Eastern Palace packed-earth road (pl_eastern_palace)',
		why: 'Chapter 1 Chunchu is still loud. Gotaso in front of him; Bupmin follows. Wide then close.',
		canon: 'ICONIC MINIMAL. Bird’s-eye then dutch close. 2D cel. Caravaggio key. Chunchu in prince magenta from ch_chunchu.png — NO hwarang headband. Gotaso in front of him; Bupmin follows in BLUE boy hanbok (ch_bupmin_child). GRINS. No glow. Magenta #D8258C rim. Same Eastern Palace road.',
		shots: [
			{ id: 'family-seq-ride-wide', role: 'exposition', angle: 'bird’s-eye wide', at: 'Gotaso sits in front of him on the same horse' },
			{ id: 'family-seq-ride-close', role: 'laughing', angle: 'dutch close', at: "That's a lawyer's horse, son." }
		]
	},
	{
		id: 'sunduk-coronation',
		title: 'Sunduk — symmetrical coronation',
		entryTitles: ['Queen Sunduk'],
		place: 'Moon Palace interior (pl_moon_palace)',
		why: 'First queen. Needs a bird’s-eye empty hall, then a symmetrical axis still — not a void poster.',
		canon: 'REAL Moon Palace timber. BIRD’S-EYE then worm’s-eye SYMMETRY. Vermilion #E8552B. 2D cel. No halo. One device per cut. Empty hall, no crowd catalog.',
		shots: [
			{ id: 'moon-seq-hall-bird', role: 'interior exposition', angle: 'bird’s-eye', at: 'becomes the first Queen of Silla' },
			{ id: 'sunduk-seq-coronation-sym', role: 'axis', angle: 'worm’s-eye symmetrical', at: 'the Blue Moon of the Divine Country' }
		]
	},
	{
		id: 'gyebek-naming',
		title: 'White River — nineteen dives, then a name',
		entryTitles: ['The Eight Great Clans'],
		place: 'White River mouth below Sabi (pl_white_river, pl_sabi_palace)',
		why: 'Euija in commoner disguise meets a nameless boy who keeps diving. He names him Gyebek. Memory: houses burn, he runs, he begs.',
		canon: 'Young Euija: GRAY disguise robe, NO large beard (ch_euija_young), amber #e08a2e key. Gyebek: the BOY sheet ch_gyebek_boy — WHITE hanbok, short-medium hair, consistent child, #d9b13a key. 2D cel. Caravaggio. Loud faces. NO glow. Baekgang is a trading estuary (pl_white_river, pl_sabi_port), not an empty graphic river.',
		shots: [
			{ id: 'sabi-seq-hall-bird', role: 'Sabi interior', angle: 'bird’s-eye', at: 'Sabi from the White River' },
			{ id: 'euija-seq-disguise-yard', role: 'sneaks out', angle: 'dutch', at: 'Euija sneaks out of the palace' },
			{ id: 'gyebek-seq-dive-wide', role: 'another dive', angle: 'dutch wide', at: 'The boy is going back into the water' },
			{ id: 'gyebek-seq-surface', role: 'nineteen', angle: 'dutch close', at: 'Nineteen' },
			{ id: 'gyebek-seq-name', role: 'the name', angle: 'two-shot', at: 'How about — <Gyebek>?' },
			{ id: 'gyebek-fb-burn', role: 'houses burn', angle: 'iconic wide', at: 'Silk burns faster than timber' },
			{ id: 'gyebek-fb-run', role: 'run', angle: 'dutch', at: 'not say the name' },
			{ id: 'gyebek-fb-beg', role: 'beg', angle: 'lower-third', at: 'The noble collar is dirty enough' }
		]
	},
	{
		id: 'gesomun-pyongyang',
		title: 'Gesomun rides into Pyongyang',
		entryTitles: ['The Summit'],
		place: 'Yeon snow fortress (pl_yeon_fortress) then Pyongyang river-city (pl_pyongyang_city)',
		why: 'The Red Sun leaves the highland Eastern Hall and enters the capital for the High Summit. Mountain house first, then the city.',
		canon: 'TWO PLACES. Snowy Yeon mountain fortress is NOT Pyongyang. Pyongyang is a Taedong river CITY — dense giwa, walls, quay. Grey steel, red-wing #C30000 / #d0362f. One rider. 2D cel. Caravaggio key. No glow. No army catalog. Dutch crane, then worm’s-eye gate, then hall.',
		shots: [
			{ id: 'gesomun-seq-yeon-snow', role: 'eastern hall', angle: 'dutch crane wide', at: 'Eastern Commandery the safest' },
			{ id: 'gesomun-seq-pyongyang-wide', role: 'city exposition', angle: 'dutch crane', at: 'He rides in at the red two-tier gate' },
			{ id: 'gesomun-seq-pyongyang-gate', role: 'the gate', angle: 'worm’s-eye dutch', at: 'Pyongyang already knows the sound of those hooves' },
			{ id: 'pyongyang-seq-hall-bird', role: 'interior', angle: 'dutch gallery', at: 'High Summit' }
		]
	},
	{
		id: 'east-star-film',
		title: 'East star — two boys on the hill',
		entryTitles: ['Queen Sunduk'],
		place: 'Night hill above Surabol — packed grass, city giwa as bokeh, one planet in the east',
		why: 'The vow that names the saga. Existing stills sit as icons; this is chronology: wide hill → pointing → planet not a star → king for all.',
		canon: 'SAME hill, SAME night, SAME FILM as the rest of Part I: 16:9 anamorphic 2D cel-painterly movie frames. DUTCH / OTS. Foreground grass/sleeve, boys lower-third, rooftops as a thin bokeh strip. The planet is a small light in a real sky — not a graphic spotlight cone, not neon outlines. No halo. Yushin #2A5FB8, Chunchu #D8258C as rims. Faces from portraits on younger bodies. Crushed blacks, one hard key.',
		shots: [
			{
				id: 'east-seq-hill-wide',
				role: 'exposition',
				angle: 'dutch wide night',
				at: 'Two boys on a hill above Surabol'
			},
			{
				id: 'east-seq-point',
				role: 'the east star',
				angle: 'dutch two-shot',
				at: 'That star, in the east'
			},
			{
				id: 'east-seq-planet',
				role: 'planet not a star',
				angle: 'OTS rack-focus',
				at: 'That is a planet, not a star'
			},
			{
				id: 'east-seq-vow',
				role: 'king for all',
				angle: 'dutch low two-shot',
				at: 'Let us make Samhan one country'
			}
		]
	},
	{
		id: 'gotaso-road',
		title: 'Gotaso — lantern market to the carry home',
		entryTitles: ['Gotaso’s Wedding'],
		place: 'Surabol lantern street → night ford → nineteen-li road. Timber shops, packed earth, then river.',
		why: 'The chapter’s first film: she is taken, they find the road, he carries her. Existing stills skip the street and the ford.',
		canon: 'ICONIC MINIMAL night film. DUTCH wides. Lanterns as a bokeh-orb device, not a shop dump. 2D cel, no halo. Chunchu magenta #D8258C, Gotaso pink #F0A3C0, tiny or lower-third. Two people per frame. Crushed blacks, one hard key.',
		shots: [
			{
				id: 'gotaso-seq-market-wide',
				role: 'lantern market',
				angle: 'dutch wide street',
				at: 'goes out to the lantern market'
			},
			{
				id: 'gotaso-seq-ford',
				role: 'the ford',
				angle: 'dutch low night',
				at: 'They find the road on the second night'
			},
			{
				id: 'gotaso-seq-wipe',
				role: 'he wipes his hands',
				angle: 'ECU / rack-focus',
				at: 'wipes his hands on the grass'
			},
			{
				id: 'gotaso-seq-nineteen',
				role: 'nineteen li',
				angle: 'dutch tracking wide',
				at: 'It is nineteen li'
			}
		]
	},
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
		entryTitles: ['The Hwarang', 'The Fall of Gaya'],
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
		entryTitles: ['The Emperor'],
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
		place: 'Jolbon: pine road, timber hall, grain porch, SAME stone well (rim, timber beam, two buckets), packed earth, grey giwa',
		why: 'Scouts drag a wet exile to Tabal. Sosuno is girl-boss on the packed earth and Little Sosuno in the loft. Love-hate grain room; she mate-guards other daughters. Pine, five tribes, kingship, dawn cavern.',
		canon: 'SAME Jolbon well every well-cut: round granite rim, timber beam, hemp rope, two buckets on packed earth, nobody in the shaft, grey giwa hall, grain porch left. Dusty-rose #e8a04a hanbok, not gold. Jumong red #e8563f. Shot variety: bird’s-eye, top-down, ECU, dutch wide, OTS. Cavern stills lock to pl_jumong_cave.',
		shots: [
			{ id: 'jumong-seq-scouts-wide', role: 'scouts find him', angle: 'bird’s-eye pines', at: 'Jolbon scouts find him first' },
			{ id: 'jumong-seq-scouts-ots', role: 'spear OTS', angle: 'OTS', at: 'You’ll get Tabal' },
			{ id: 'jumong-seq-jolbon-wide', role: 'place', angle: 'dutch dusk', at: 'The Jolbon hall is a timber country' },
			{ id: 'jumong-seq-tabal-ledger', role: 'valley as ledger', angle: 'dutch wide', at: 'Tabal shows him the valley like a ledger' },
			{ id: 'jumong-seq-tabal-weigh', role: 'Tabal weighs', angle: 'OTS', at: 'I do not want ash tracked into my hall' },
			{ id: 'jumong-seq-tabal-use', role: 'the millet votes', angle: 'worm’s-eye draw', at: 'The millet likes you. I don’t.' },
			{ id: 'sosuno-seq-hunt-wide', role: 'girl-boss muster', angle: 'worm’s-eye ranks', at: 'She is running the hunt' },
			{ id: 'sosuno-seq-muster-dutch', role: 'spear-count dutch', angle: 'dutch lower-third', at: 'The yard answers her first' },
			{ id: 'sosuno-seq-cold-ecu', role: 'cold command face', angle: 'ECU chin', at: 'She does not raise her voice' },
			{ id: 'sosuno-seq-silence-ecu', role: 'first look silence', angle: 'ECU eyes', at: 'The yard goes quiet' },
			{ id: 'nsfw-sosuno-first-purr', role: 'hungry stare', angle: 'ECU mouth', at: 'Little Sosuno is purring' },
			{ id: 'sosuno-seq-tough-chin', role: 'chieftain’s daughter', angle: 'low dutch porch', at: 'She prices him, then forgets the count' },
			{ id: 'sosuno-seq-shy-back', role: 'blush at his back', angle: 'ECU OTS', at: 'She blushes at his back' },
			{ id: 'sosuno-seq-dump-water', role: 'rude days', angle: 'dutch dump', at: 'Don’t follow me.' },
			{ id: 'sosuno-seq-mean-two', role: 'looks down on him', angle: 'dutch two-shot', at: 'You’re in the way' },
			{ id: 'sosuno-seq-cold-ots', role: 'cold shoulder OTS', angle: 'OTS yard', at: 'Around. Big idiot.' },
			{ id: 'nsfw-sosuno-loft-ogle', role: 'loft window', angle: 'OTS', at: 'She ogles him from the loft' },
			{ id: 'nsfw-sosuno-loft-hike', role: 'hiked loft ogle', angle: 'dutch OTS', at: 'She ogles him from the loft' },
			{ id: 'nsfw-sosuno-little', role: 'little Sosuno', angle: 'ECU', at: 'Little Sosuno.' },
			{ id: 'sosuno-seq-come-down', role: 'eldest again', angle: 'low dutch stairs', at: 'She comes down a different woman' },
			{ id: 'sosuno-seq-mate-guard', role: 'other daughters', angle: 'dutch yard', at: 'She finds a flaw every time' },
			{ id: 'jumong-seq-girls-fawn', role: 'women fawn', angle: 'dutch well', at: 'She finds a flaw every time' },
			{ id: 'sosuno-seq-scream-mad', role: 'screaming mad', angle: 'ECU shout', at: 'screaming mad' },
			{ id: 'jumong-seq-well-bird', role: 'well exposition', angle: 'bird’s-eye', at: 'The well is an accident she timed' },
			{ id: 'jumong-seq-well-wide', role: 'well dutch', angle: 'dutch wide', at: 'The well is an accident she timed' },
			{ id: 'jumong-seq-well-ecu-rope', role: 'rope ECU', angle: 'ECU', at: 'Rope’s being a villain' },
			{ id: 'jumong-seq-well-topdown', role: 'pink ears', angle: 'top-down', at: 'Your ears are pink' },
			{ id: 'jumong-seq-well-name', role: 'name', angle: 'two-shot', at: 'Sosuno.' },
			{ id: 'jumong-seq-well-kiss', role: 'he kisses her', angle: 'dutch two-shot', at: 'He kisses her at the well-beam' },
			{ id: 'nsfw-sosuno-naked-back', role: 'her back', angle: 'OTS', at: 'the back is the picture' },
			{ id: 'jumong-seq-leave-bow', role: 'bow left', angle: 'worm’s-eye', at: 'He leaves the bow on packed earth' },
			{ id: 'sosuno-seq-beam-shot', role: 'she shoots the beam', angle: 'worm’s-eye full-draw', at: 'She puts an arrow in the beam' },
			{ id: 'sosuno-seq-forced-confess', role: 'forced confession', angle: 'ECU', at: 'I wasn’t going to say it' },
			{ id: 'jumong-seq-stash', role: 'memorabilia', angle: 'ECU still-life', at: 'You hide these like a thief' },
			{ id: 'jumong-seq-ledger', role: 'lamp heat', angle: 'grain-room two-shot', at: 'The ledger stays open longer than it needs to' },
			{ id: 'nsfw-sosuno-hands-shake', role: 'not wife yet', angle: 'ECU hands', at: 'I am not your wife yet' },
			{ id: 'nsfw-sosuno-wall-pin', role: 'mouth first', angle: 'dutch pin', at: 'Give me your mouth… first' },
			{ id: 'nsfw-sosuno-grain-back', role: 'first time', angle: 'OTS grain room', at: 'The first time is the grain room' },
			{ id: 'nsfw-sosuno-dumb-idiot', role: 'climax scream', angle: 'ECU', at: 'DUMB BIG IDIOT' },
			{ id: 'tabal-seq-grumpy', role: 'Tabal watches', angle: 'porch OTS', at: 'I am not pleased. I am also not blind.' },
			{ id: 'jumong-seq-pine-wide', role: 'the pine', angle: 'worm’s-eye yard', at: 'The pine is a hundred paces' },
			{ id: 'jumong-seq-split', role: 'arrow splits', angle: 'worm’s-eye', at: 'The hall hears the wood cry' },
			{ id: 'jumong-seq-tribes-wide', role: 'five roofs', angle: 'bird’s-eye', at: 'You keep cutting each other' },
			{ id: 'jumong-seq-tribes-speak', role: 'one roof', angle: 'dutch hall', at: 'This valley is one roof' },
			{ id: 'jumong-seq-king-vote', role: 'they vote', angle: 'low strip', at: 'The five tribes vote' },
			{ id: 'jumong-seq-royal-pair', role: 'king and queen', angle: 'worm’s-eye court', at: 'the largest kingdom in Samhan' },
			{ id: 'jumong-seq-cave-dawn', role: 'dawn seam', angle: 'worm’s-eye cavern', at: 'A break of light at dawn' },
			{ id: 'jumong-seq-haemosu-unveil', role: 'father unveils', angle: 'two-shot cavern', at: 'Haemosu unveils himself' },
			{ id: 'jumong-seq-largest', role: 'first king', angle: 'iconic courtyard', at: 'the largest kingdom in Samhan' }
		]
	}
];

export function sequenceOfSlot(slotId: string): MovieSequence | undefined {
	return MOVIE_SEQUENCES.find((s) => s.shots.some((sh) => sh.id === slotId));
}
