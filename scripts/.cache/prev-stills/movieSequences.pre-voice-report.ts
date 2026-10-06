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
		id: 'harmony-council-632',
		title: 'Harmony Council — first night, High Councillor Euljé',
		entryTitles: ['Harmony Council'],
		place: 'Eastern Palace pond pavilion (pl_eastern_palace) — tea, wooden pieces, flame red then blue',
		why: 'The chronicle’s first council: elderly High Councillor Euljé chairs; Bidam speaks; Alchun is the last sleeve, not the chair. The three eternal hwarang are classmates, not the old first chair.',
		canon: 'SAME pavilion every cut. High Councillor is Euljé (ch_eulje) — grey, elderly statesman, #6a8ab8 rim. Alchun is a young hwarang councillor who flips the last piece — NEVER the high councillor. Bidam, Yushin, Alchun: three eternal hwarang. Blue flame after red. Tea and wooden pieces. High contrast. One of each named person.',
		shots: [
			{ id: 'council-seq-red-wide', role: 'red flame', angle: 'dutch wide', at: 'Someone lights the small brazier' },
			{ id: 'council-seq-blue-birth', role: 'blue tongue', angle: 'insert', at: 'The flame turns blue' },
			{ id: 'council-tea-wide', role: 'session', angle: 'dutch pavilion', at: 'debate who the next king should be' },
			{ id: 'council-flame-close', role: 'High Councillor Euljé', angle: 'table-rim two-shot', at: 'The first count is split' },
			{ id: 'council-tea-bidam', role: 'Bidam speaks', angle: 'close', at: 'My lords have said one word' },
			{ id: 'council-alchun-tiger', role: 'Alchun last sleeve', angle: 'hand raised', at: 'A tiger has no sex' },
			{ id: 'council-seq-unanimous', role: '6:0', angle: 'wide', at: 'All six sit on the yes side' }
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
		entryTitles: ['Prince Euija'],
		place: 'White River mouth below Sabi (pl_white_river, pl_sabi_palace)',
		why: 'Euija in commoner disguise meets a nameless boy who keeps diving. He names him Gyebek. Memory: houses burn, he runs, he begs.',
		canon: 'Young Euija: GRAY disguise robe, NO large beard (ch_euija_young), amber #e08a2e key. Gyebek: the BOY sheet ch_gyebek_boy — WHITE hanbok, short-medium hair, consistent child, #d9b13a key. 2D cel. Caravaggio. Loud faces. NO glow. Baekgang is a trading estuary (pl_white_river, pl_sabi_port), not an empty graphic river.',
		shots: [
			{ id: 'sabi-seq-hall-bird', role: 'Sabi interior', angle: 'bird’s-eye', at: 'Sabi from the White River' },
			{ id: 'euija-seq-disguise-yard', role: 'sneaks out', angle: 'dutch', at: 'Euija sneaks out of the palace' },
			{ id: 'gyebek-seq-dive-wide', role: 'another dive', angle: 'dutch wide', at: 'The boy is going back into the water' },
			{ id: 'gyebek-seq-surface', role: 'nineteen', angle: 'dutch close', at: 'Nineteen' },
			{ id: 'gyebek-seq-name', role: 'the name', angle: 'two-shot', at: 'How about — “Gyebek”?' },
			{ id: 'gyebek-fb-burn', role: 'houses burn', angle: 'iconic wide', at: 'Silk burns faster than timber' },
			{ id: 'gyebek-fb-run', role: 'run', angle: 'dutch', at: 'not say the name' },
			{ id: 'gyebek-fb-beg', role: 'beg', angle: 'lower-third', at: 'The noble collar is dirty enough' }
		]
	},
	{
		id: 'clan-tourney',
		title: 'Sabi — princes in the white square',
		entryTitles: ['Eight Great Clans'],
		place: 'Sabi tournament yard (pl_sabi_tourney) — crushed-black packed earth, rotated white chalk square, gold #FFCB51 shaft, two-tier munru as a dark bar',
		why: 'The clans keep score; the bodies on the chalk are Euija’s five named sons in white. Same square every cut. Every frame a painting.',
		canon: 'LOCK to pl_sabi_tourney every still: wet crushed-black earth, ONE rotated white chalk square, one gold #FFCB51 sun-stripe through it, two-tier munru as a dark giwa bar. EVERY FRAME A PAINTING — one geometry owns the frame. Princes FACE from ch_yung / ch_tae / ch_hyo / ch_yun — WHITE training silk only, NEVER the red court portraits. Yung vs Hyo on the sword; Tae vs Yun on satba; Pung too small, watches from the hall bar. Chronology: square → they step → mid-strike → dutch skim → OTS → point → satba → lift → throw → steps. No army. No glow. No plaque text.',
		shots: [
			{ id: 'clan-tourney-grid-wide', role: 'the square', angle: 'dutch crane painting', at: 'square grid in the palace yard' },
			{ id: 'clan-tourney-call', role: 'five in white', angle: 'worm’s-eye sleeve-plane', at: 'young men of each house step onto the grid' },
			{ id: 'clan-tourney-sword-midstrike', role: 'Yung vs Hyo', angle: 'dutch X', at: 'Mokgeom mid-strike on the grid' },
			{ id: 'clan-tourney-sword-dutch', role: 'gold / ink split', angle: 'extreme dutch', at: 'Blades skim the chalk.' },
			{ id: 'clan-tourney-sword-ots', role: 'from Yung', angle: 'OTS rack-focus', at: 'Over his shoulder the chalk holds' },
			{ id: 'clan-tourney-sword-victory', role: 'the stripe is the crown', angle: 'shadow painting', at: 'Point to the white sleeve.' },
			{ id: 'clan-tourney-ssireum-grip', role: 'Tae vs Yun', angle: 'dutch knot', at: 'satba locked before they stand' },
			{ id: 'clan-tourney-ssireum-lift', role: 'white diagonal', angle: 'worm’s-eye', at: 'deulbaejigi clears the sand' },
			{ id: 'clan-tourney-ssireum-throw', role: 'gold calligraphy', angle: 'dutch freeze', at: 'Sand takes the shoulder.' },
			{ id: 'clan-tourney-spectators', role: 'Pung from the bar', angle: 'from the munru bar', at: 'elders watch from the hall steps' }
		]
	},
	{
		id: 'gesomun-pyongyang',
		title: 'Gesomun rides into Pyongyang',
		entryTitles: ['Commander Yeon', 'High Summit'],
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
		entryTitles: ['Gotaso'],
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
		entryTitles: ['Yellow Mountain'],
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
		entryTitles: ['Muryuk', 'The Severing'],
		place: 'Gwansanseong ridge, then Jinheung’s hall',
		why: 'Gaya’s last prince plus Sadaham’s 562 vanguard: cone helm at Gwansanseong, then Jinheung’s hall; True Bone is the price. Fight → Sadaham gate → surrender → rank.',
		canon: 'Lock the tall Gaya cone. Steel plates, purple cloth peek. Night ridge dutch, then hall. Sadaham ice-blue #6fa8ff under Silla steel.',
		shots: [
			{ id: 'gaya-seq-fortress-night', role: 'Gaya seong night', angle: 'wide night' },
			{ id: 'gwansan-three-hosts', role: 'three camps', angle: 'night wide' },
			{ id: 'muryuk-seq-ridge', role: 'ambush', angle: 'dutch night', at: 'Muryuk’s cone cuts the night ridge' },
			{ id: 'muryuk-seq-cone-fight', role: 'last fight', angle: 'worm’s-eye', at: 'The tall Gaya cone still fights' },
			{ id: 'sadaham-seq-keepup', role: 'keep up', angle: 'low gallop', at: 'Then keep up.' },
			{ id: 'sadaham-seq-vanguard', role: 'Sadaham fifteen', angle: 'dutch charge', at: 'They said too young.' },
			{ id: 'sadaham-seq-gate', role: 'the gate', angle: 'worm’s-eye', at: 'The gate didn’t.' },
			{ id: 'sadaham-seq-free', role: 'prize-cages', angle: 'lower-third', at: 'Take the land. Leave the people.' },
			{ id: 'sadaham-seq-alcheon', role: 'Alcheon dirt', angle: 'low close', at: 'Alcheon dirt.' },
			{ id: 'gaya-surrender', role: 'kneel', angle: 'two-shot hall' },
			{ id: 'gaya-crown', role: 'True Bone', angle: 'insert / close' },
			{ id: 'muryuk-seq-aged', role: 'old prince', angle: 'worm’s-eye', at: 'Very well. Your descendants shall be raised as True Bone' }
		]
	},
	{
		id: 'gyebek-general-killer',
		title: 'Hundred-Victories — one cut on the pass',
		entryTitles: ['Exile'],
		place: 'An empty stubble field on the Silla border at storm dusk',
		why: 'How Gyebek earned the name: Gomanari, the fastest horse in Samhan, out of an empty field at one man, one reverse-grip cut, gone before the escort draws. Painted wides bracket a run of manga action frames.',
		canon: 'Gyebek FACE from ch_gyebek but never its curved sword: straight ring-pommel blade (sw_bidam), reverse grip, ring above the thumb. Gomanari jet-black from obj_gomanari. Silla blue crescent banners, cone helms. Action beats use MANGA_ACTION (speed lines, focus lines, impact flash, extreme foreshortening). No gore.',
		shots: [
			{ id: 'gyebek-sig-ridge', role: 'the empty field', angle: 'far wide', at: 'goes looking for the general' },
			{ id: 'gyebek-sig-eye', role: 'the target', angle: 'ECU focus lines', at: 'He leaves the line to other men' },
			{ id: 'gyebek-sig-hooves', role: 'fastest in Samhan', angle: 'worm’s-eye from the dirt', at: 'the fastest thing on four legs in Samhan' },
			{ id: 'gyebek-sig-tuck', role: 'thrown knife', angle: 'low front dutch', at: 'rides him flat along the neck like a thrown knife' },
			{ id: 'gyebek-sig-turn', role: 'too late', angle: 'OTS dutch', at: 'starts to turn his horse' },
			{ id: 'gyebek-sig-impact', role: 'impact', angle: 'inverted impact frame', at: 'does not finish turning' },
			{ id: 'gyebek-sig-cut', role: 'the cut', angle: 'worm’s-eye dutch', at: 'One cut on the pass.' },
			{ id: 'gyebek-sig-riderless', role: 'gone', angle: 'low wide', at: 'a speck on the far ridge' },
			{ id: 'gyebek-sig-frozen', role: 'headless army', angle: 'crane down', at: 'nobody left to tell it what to do' }
		]
	},
	{
		id: 'the-severing',
		title: 'The Severing — Gucheon at night',
		entryTitles: ['The Severing'],
		place: 'Gwansanseong ditch at night — stone fortress, packed earth, one torch',
		why: 'Jinheung drops the signal. Seong sees a Gaya cone and understands too late. Muryuk presides and calls the name. Dodo does what the rank will not.',
		canon: 'NIGHT. Jinheung FACE from ch_jinheung, red robe stays red, #2f6fd4 is torch light not a recolor. Muryuk FACE from ch_kim_muryuk, steel lamellar, tall cone, purple #8B5CF6 peek only. Dodo FACE from ch_dodo, #7f96b5 cold cloth. Seong has no portrait — crown and yellow #e5b83a silk, face in shadow, never an invented face. One device each. High contrast. No gore catalog.',
		shots: [
			{ id: 'sever-night-wide', role: 'the ditch', angle: 'wide night', at: 'the torches coming up the bank' },
			{ id: 'sever-jinheung-hand', role: 'the signal', angle: 'ECU hand', at: 'Jinheung’s hand drops' },
			{ id: 'sever-seong-pov', role: 'what he sees', angle: 'OTS', at: 'A prince of Geumgwan' },
			{ id: 'sever-seong-recoil', role: 'surprise', angle: '3:4 shadow', at: 'A slave’s hand— no' },
			{ id: 'sever-dodo-ask', role: 'the ask', angle: 'ECU kneel', at: 'Let me take the head' },
			{ id: 'sever-muryuk-call', role: 'the call', angle: 'worm’s-eye', at: 'Dodo.' },
			{ id: 'sever-anguish', role: 'last moment', angle: '3:4 stool', at: 'It went into the marrow' },
			{ id: 'sever-blade-line', role: 'the cut', angle: 'iconic blade-line', at: 'The ditch takes the head' }
		]
	},
	{
		id: 'sadaham-hwarang',
		title: 'Sadaham — first class',
		entryTitles: ['Bupmin', 'Muryuk'],
		place: 'Hwarang eaves, then Gaya seong, then empty bowl',
		why: 'Fifteen on the vanguard; Mugwan vow; seven days without food. Ice-blue #6fa8ff is the person.',
		canon: 'Steel on campaign stills; Hwarang coats on the vow. Intimate grief for seven days. High contrast. One of each named person.',
		shots: [
			{ id: 'sadaham-seq-yushin-tells', role: 'two names', angle: 'over-shoulder eaves', at: 'the two names the yard still lowers its voice for' },
			{ id: 'sadaham-gaya-road', role: 'empty road', angle: 'iconic wide', at: '<b>Sadaham</b> was fifteen' },
			{ id: 'sadaham-seq-ask', role: 'too young', angle: 'worm’s-eye hall', at: 'asked to ride against Great Gaya' },
			{ id: 'sadaham-seq-keepup', role: 'keep up', angle: 'low gallop', at: 'Then keep up.' },
			{ id: 'sadaham-seq-vanguard', role: 'the charge', angle: 'dutch charge', at: 'They said too young.' },
			{ id: 'sadaham-seq-alcheon', role: 'Alcheon dirt', angle: 'low close', at: 'Alcheon dirt.' },
			{ id: 'sadaham-seq-mugwan-vow', role: 'the swear', angle: 'two-shot eaves', at: 'If you die first, I will not eat.' },
			{ id: 'sadaham-seq-sickbed', role: 'the pulse', angle: 'candle two-shot', at: 'died of illness not long after the campaign' },
			{ id: 'sadaham-grief-clutch', role: 'gone', angle: 'low dutch', at: 'Sadaham did not take food for seven days' },
			{ id: 'sadaham-seq-seven-close', role: 'seven days', angle: 'ECU', at: 'Sadaham did not take food for seven days' },
			{ id: 'sadaham-seq-headbands', role: 'two headbands', angle: 'low ground', at: 'buried two headbands' }
		]
	},
	{
		id: 'yeon-massacre',
		title: 'Yeon’s Massacre',
		entryTitles: ['Supreme Commander'],
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
		entryTitles: ['Huangdi (皇帝)', 'Royal Secretariat'],
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
		entryTitles: ['Huangdi (皇帝)'],
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
		id: 'jumong-amnok-myth',
		title: 'Jumong — Amnok myth (sisters, copper, Habek)',
		entryTitles: ['Haemosu'],
		place: 'Amnok / Ubal shallows — real river, wet rocks, same five-dragon gold wheeled sun-chariot; copper room on the bank. Habek’s court is INSIDE pl_amnok_pavillion (open floor, posts, railing, river only through the openings, wooden bridge off the cliff) — not a backdrop plate',
		why: 'Haemosu falls for all three river-daughters; only Yuhwa stays. Sequential landing + sun-stare banter, then copper heat, then Habek’s exile. Film, not a one-line kick-out.',
		canon: 'LOCK: /pl_amnok_river.png every Earth Amnok cut (braided river, ridges, alpenglow — not a night void). SAME chariot forever (two spoked wheels, rail, floor, yoke; five PLAYFUL dragons gold/crimson/azure/jade/white). Copper kiln on that bank only. Haemosu = sun: gold #f0b429 light-planes + copper reflections wherever he stands indoors — never a body-halo. SAME Amnok bank every Earth cut. SAME five-dragon gold chariot (do not invent a new one). Hwahye FACE ch_hwahye, Wihye FACE ch_wihye, Yuhwa ch_yuhwa + bn_yuhwa, Habek ch_habek, Haemosu ch_haemosu. Yuhwa blue #8fc4e0 + bn_yuhwa, Hwahye purple #8a62c4 + bn_hwahye, Wihye green #4fad72 + bn_wihye. Haemosu gold #f0b429 / #7fc4e8 as light not costume paint. Sisters dive; Yuhwa is the only one who does not run. Light is a plane/shaft, never a body-halo. Intimate sex stills stay skin-forward, faces want. Black pupils. Chronology: tiny chariot noon → look-down → three in the water → sisters dive → Yuhwa stays → falling-in-love rail → lands/wades → sun-stare banter → lead to copper → copper kiss/heat → Habek court → exile walk.',
		shots: [
			{ id: 'jumong-set-sky-noon-empty', role: 'empty sky', angle: 'wide noon', at: 'The sky is empty first' },
			{ id: 'jumong-haemosu-chariot-usual-run', role: 'usual sun-run', angle: 'wide sky dutch', at: 'The sky is' },
			{ id: 'jumong-haemosu-sky-noon-laugh', role: 'noon laugh-drive', angle: 'dutch close noon', at: 'The sky is' },
			{ id: 'jumong-haemosu-sky-night-drive', role: 'night drive', angle: 'dutch close night', at: 'Dawn, noon, dusk,' },
			{ id: 'jumong-set-amnok-morning-empty', role: 'empty morning river', angle: 'wide morning', at: 'Dawn, noon, dusk,' },
			{ id: 'jumong-set-amnok-silk-rocks', role: 'silk on rocks', angle: 'dutch bank', at: 'Hwahye and Wihye' },
			{ id: 'jumong-haemosu-pov-yuhwa-only', role: 'only her from the rail', angle: 'bird’s-eye rail', at: ', god of the' },
			{ id: 'jumong-haemosu-sky-sisters', role: 'looks down', angle: 'from the chariot', at: ', god of the' },
			{ id: 'jumong-yuhwa-sisters-bath', role: 'three bathing', angle: 'shallows wide', at: 'Hwahye and Wihye' },
			{ id: 'jumong-sisters-kneel-well', role: 'three in the well', angle: 'straight-down well', at: 'In the Ubal' },
			{ id: 'jumong-sisters-kneel-ots', role: 'her OTS two sisters', angle: 'OTS well', at: 'Go. I’m here.' },
			{ id: 'jumong-hwahye-amnok-dive-leave', role: 'eldest dives', angle: 'intimate dutch', at: 'Hwahye dives first and does not look back' },
			{ id: 'jumong-wihye-amnok-laugh-follow', role: 'middle follows', angle: 'intimate dutch', at: 'Wihye laughs and follows' },
			{ id: 'jumong-yuhwa-sisters-dive-wake', role: 'two wakes', angle: 'dutch shallows', at: 'Two wakes cut' },
			{ id: 'jumong-yuhwa-only-stays', role: 'she does not run', angle: 'worm’s-eye shallows', at: 'Two wakes cut' },
			{ id: 'jumong-haemosu-stunned-rail-ecu', role: 'stunned rail', angle: 'ECU rail', at: 'Those thighs' },
			{ id: 'jumong-haemosu-love-stunned-ecu', role: 'falls in love', angle: 'dutch ECU', at: 'He forgets how' },
			{ id: 'jumong-haemosu-chariot-dive', role: 'dive the hour', angle: 'dutch chariot', at: 'Stop. Stop the chariot.' },
			{ id: 'jumong-haemosu-grin-comes-down', role: 'grin down', angle: 'ECU grin', at: 'He forgets how' },
			{ id: 'jumong-haemosu-descent-dutch', role: 'leaves the rail', angle: 'dutch descent', at: 'He leaves the rail and the hour' },
			{ id: 'jumong-haemosu-wades-close-her', role: 'wades close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' },
			{ id: 'jumong-yuhwa-haemosu-two-grin', role: 'both grin close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' },
			{ id: 'jumong-haemosu-why-not-run', role: 'why stay', angle: 'dutch two-shot', at: 'Why didn’t you' },
			{ id: 'jumong-yuhwa-like-what-i-see', role: 'I like what I see', angle: 'intimate ECU', at: 'like what I see' },
			{ id: 'nsfw-jumong-yuhwa-sun-likes-hike', role: 'NSFW hike dare', angle: 'dutch hike', at: 'She tips her' },
			{ id: 'jumong-haemosu-gulp-her-ahead', role: 'gulp', angle: 'ECU gulp', at: 'He swallows.' },
			{ id: 'jumong-yuhwa-leads-copper-back', role: 'she leads', angle: 'OTS look-back', at: 'This way. The bank.' },
			{ id: 'jumong-yuhwa-copper-kiss-sfw', role: 'SFW kiss', angle: 'intimate two-shot', at: 'She kisses him with river still on her mouth' },
			{ id: 'jumong-yuhwa-copper-aftermath-back', role: 'aftermath back', angle: 'OTS copper', at: 'The copper keeps the afternoon' },
			{ id: 'nsfw-jumong-haemosu-copper-ecu', role: 'name-climax', angle: 'ECU', at: 'heaven is this thick' },
			{ id: 'jumong-cine-yuhwa-flinch-ecu', role: 'her tears', angle: 'ink ECU', at: 'I just— looked.' },
			{ id: 'jumong-cine-geumwa-stride', role: 'he reaches', angle: 'watercolor dutch', at: 'Come in. I’ve got a room free.' },
			{ id: 'jumong-habek-court-wide', role: 'river court', angle: 'bird’s-eye bank', at: 'The Amnok keeps its own court' },
			{ id: 'jumong-habek-sentence-mist', role: 'border sentence', angle: 'bird’s-eye mist', at: 'The Amnok keeps its own court' },
			{ id: 'jumong-habek-exile-dutch', role: 'kicked out', angle: 'dutch bank', at: 'Habek kicks Yuhwa out' },
			{ id: 'jumong-habek-exile-ots', role: 'leave the mist', angle: 'OTS walk', at: 'You don’t sleep in my mist after that' },
			{ id: 'jumong-amnok-wc-sisters-silent', role: 'watercolor sisters silent', angle: 'watercolor', at: 'Hwahye and Wihye do not argue the sentence' }
		]
	},
	{
		id: 'haemosu-yuhwa-amnok',
		title: 'Haemosu & Yuhwa — Amnok dusk to copper',
		entryTitles: ['Haemosu'],
		place: 'Amnok / Ubal shallows — real river, wet rocks; same five-dragon gold wheeled sun-chariot; copper room on the bank. Habek’s court is INSIDE pl_amnok_pavillion (open floor, posts, railing, river only through the openings, wooden bridge) — not a backdrop plate',
		why: 'Haemosu falls; only Yuhwa stays. Sequential landing, sun-stare banter, she leads to copper. SFW/NSFW parallels on the same ats. Habek exile stays thin.',
		canon: 'LOCK: /pl_amnok_river.png every Earth Amnok cut (braided river, ridges, alpenglow — not a night void). SAME chariot forever (two spoked wheels, rail, floor, yoke; five PLAYFUL dragons gold/crimson/azure/jade/white). Copper kiln on that bank only. Haemosu = sun: gold #f0b429 light-planes + copper reflections wherever he stands indoors — never a body-halo. SAME Amnok bank every Earth cut. SAME five-dragon gold chariot (do not invent a new one). Hwahye FACE ch_hwahye, Wihye FACE ch_wihye, Yuhwa ch_yuhwa + bn_yuhwa, Habek ch_habek, Haemosu ch_haemosu. Yuhwa blue #8fc4e0 + bn_yuhwa, Hwahye purple #8a62c4 + bn_hwahye, Wihye green #4fad72 + bn_wihye. Haemosu gold #f0b429 as light not costume paint. Sisters dive; Yuhwa is the only one who does not run. Light is a plane/shaft, never a body-halo. Intimate sex stills stay skin-forward, faces want. Black pupils. Chronology: empty bank → usual tiny chariot → sisters dive → stay → falling-in-love → lands/wades → sun-stare banter (SFW talk / NSFW hike parallel) → lead to copper → SFW kiss + NSFW heat → Habek cast-out.',
		shots: [
			{ id: 'jumong-set-amnok-morning-empty', role: 'morning empty', angle: 'wide morning', at: 'Dawn, noon, dusk,' },
			{ id: 'jumong-set-sky-noon-empty', role: 'sky first', angle: 'wide noon', at: 'The sky is empty first' },
			{ id: 'jumong-haemosu-chariot-usual-run', role: 'usual run', angle: 'wide sky dutch', at: 'The sky is' },
			{ id: 'jumong-haemosu-sky-noon-laugh', role: 'noon laugh-drive', angle: 'dutch close noon', at: 'The sky is' },
			{ id: 'jumong-haemosu-sky-night-drive', role: 'night drive', angle: 'dutch close night', at: 'Dawn, noon, dusk,' },
			{ id: 'jumong-yuhwa-amnok-dusk-expo', role: 'exposition dusk', angle: 'bird’s-eye wide', at: 'Dawn, noon, dusk,' },
			{ id: 'jumong-haemosu-pov-yuhwa-only', role: 'only her from the rail', angle: 'bird’s-eye rail', at: ', god of the' },
			{ id: 'jumong-hwahye-amnok-dive-leave', role: 'eldest dives', angle: 'intimate dutch', at: 'Hwahye dives first and does not look back' },
			{ id: 'jumong-wihye-amnok-laugh-follow', role: 'middle follows', angle: 'intimate dutch', at: 'Wihye laughs and follows' },
			{ id: 'jumong-yuhwa-sisters-dive-wake', role: 'sisters dive', angle: 'dutch shallows', at: 'Two wakes cut' },
			{ id: 'jumong-yuhwa-amnok-kneel-look', role: 'kneel look-up', angle: 'intimate worm’s-eye', at: 'Yuhwa kneels in the shallows' },
			{ id: 'jumong-haemosu-pov-yuhwa-shoulders', role: 'shoulders from above', angle: 'high three-quarter', at: 'Two wakes cut' },
			{ id: 'jumong-haemosu-pov-yuhwa-wash', role: 'rinse from the rail', angle: 'bird’s-eye look-back', at: 'Yuhwa kneels in' },
			{ id: 'jumong-haemosu-love-stunned-ecu', role: 'falls in love', angle: 'dutch ECU', at: 'He forgets how' },
			{ id: 'jumong-haemosu-grin-comes-down', role: 'grin down', angle: 'ECU grin', at: 'He forgets how' },
			{ id: 'jumong-haemosu-descent-dutch', role: 'leaves the rail', angle: 'dutch descent', at: 'He leaves the rail and the hour' },
			{ id: 'jumong-haemosu-wades-close-her', role: 'wades close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' },
			{ id: 'jumong-yuhwa-haemosu-two-grin', role: 'both grin close', angle: 'dutch two-shot', at: 'He wades close. She does not run.' },
			{ id: 'jumong-haemosu-why-not-run', role: 'why stay', angle: 'dutch two-shot', at: 'Why didn’t you' },
			{ id: 'jumong-yuhwa-like-what-i-see', role: 'I like what I see', angle: 'intimate ECU', at: 'like what I see' },
			{ id: 'nsfw-jumong-yuhwa-sun-likes-hike', role: 'NSFW hike dare', angle: 'dutch hike', at: 'She tips her' },
			{ id: 'jumong-haemosu-gulp-her-ahead', role: 'gulp', angle: 'ECU gulp', at: 'He swallows.' },
			{ id: 'jumong-yuhwa-leads-copper-back', role: 'she leads', angle: 'OTS look-back', at: 'This way. The bank.' },
			{ id: 'jumong-yuhwa-copper-room-rise', role: 'copper kiln', angle: 'worm’s-eye bank', at: 'The copper room rises on the bank like a kiln' },
			{ id: 'jumong-yuhwa-copper-kiss-sfw', role: 'SFW kiss', angle: 'intimate two-shot', at: 'She kisses him with river still on her mouth' },
			{ id: 'jumong-yuhwa-copper-aftermath-back', role: 'aftermath back', angle: 'OTS copper', at: 'The copper keeps the afternoon' },
			{ id: 'nsfw-jumong-yuhwa-copper-kiss', role: 'NSFW kiss', angle: 'intimate close', at: 'She kisses him with river still on her mouth' },
			{ id: 'nsfw-jumong-yuhwa-copper-pinned', role: 'pinned', angle: 'intimate close', at: 'Inside, the copper' },
			{ id: 'nsfw-jumong-yuhwa-wanting-ecu', role: 'wanting face', angle: 'ECU', at: 'If you want it,' },
			{ id: 'nsfw-jumong-yuhwa-ots-copper-back', role: 'OTS back', angle: 'OTS', at: 'The copper is' }
		]
	},
	{
		id: 'yuhwa-fox-exile',
		title: 'Yuhwa — kicked out, the sun-fox, Geumwa',
		entryTitles: ['Haemosu'],
		place: 'Habek’s court INSIDE pl_amnok_pavillion (dark giwa, timber walkway, braided Amnok below). Exile road: real Korean earth. Arrival: pl_northern_buyeo then pl_buyeo_palace path',
		why: 'The kick was a look; then she sits; the sky talks; the fox walks her to Buyeo. Needs film, not a gold sticker on watercolor.',
		canon: 'LOCK pavilion to /pl_amnok_pavillion.png — same dark giwa, same walkway, same braided river. Yuhwa FACE ch_yuhwa + bn_yuhwa; ice-blue silky jeogori+chima #8fc4e0, clothed, NOT the bathing nude-back clone. Habek FACE ch_habek, ice-blue river silk, #2f8f7a as mist/bounce not a body halo. Fox BODY from /obj_haemosu_fox.png: pale cream-white sun-fox, flowing fur; ignore the orange sticker outline; #f0b429 as real light on the fur, NEVER a halo on Yuhwa. Haemosu is a sky voice — gold light-plane in cloud, no body on the voice cut. Geumwa red-burgundy from ch_geumwa, not gold-plated; #a89a72 dusty bounce. Earth skies natural. HIGH CONTRAST. 2D cel-painterly. Chronology: pavilion wide → dutch kick → walkway stumble → dejected sit → ECU → sky voice → fox appears → fox lookback → follow south → pine → pass → Buyeo ridge → Geumwa path → come in.',
		shots: [
			{ id: 'yuhwa-exile-pavilion-wide', role: 'exposition kick', angle: 'dutch wide pavilion', at: 'Habek kicks Yuhwa out' },
			{ id: 'yuhwa-exile-walkway-stumble', role: 'stumble', angle: 'OTS walkway', at: 'The pavilion walkway does not catch her' },
			{ id: 'yuhwa-exile-dejected-sit', role: 'abandoned', angle: 'wide lower-third', at: 'For a while nobody comes' },
			{ id: 'yuhwa-exile-sky-voice', role: 'sky talks', angle: 'worm’s-eye look-up', at: 'The sky talks first' },
			{ id: 'yuhwa-exile-fox-appear', role: 'fox on the earth', angle: 'dutch two-shot', at: 'The fox is already on the packed earth' },
			{ id: 'yuhwa-exile-fox-follow-south', role: 'follow', angle: 'OTS road', at: 'The fox is' },
			{ id: 'yuhwa-exile-fox-pass', role: 'switchback stamp', angle: 'bird’s-eye pass', at: 'The fox is' },
			{ id: 'yuhwa-exile-geumwa-come-in', role: 'the room', angle: 'dutch two-shot', at: 'Come in. I’ve got a room free.' }
		]
	},
	{
		id: 'jumong-buyeo-north',
		title: 'Jumong — Northern Buyeo, egg to the four',
		entryTitles: ['Haemosu', 'Buyeo'],
		place: 'Northern Buyeo — pl_buyeo_palace is the hillside complex (path, stone terraces, giwa halls, lower thatched hut). Camera stands on the path or inside that hut; the plate is not a backdrop. City-wide cuts may still use pl_northern_buyeo daylight',
		why: 'Open on 16:9 exposition wides of the same timber capital so Buyeo is a place, then hatch and brothers live inside that geography.',
		canon: 'LOCK to pl_northern_buyeo every Earth cut. SAME mountain, giwa city, river, blue sky and white clouds — daylight, not dusk crushed black. Yard is sun on packed earth. All exposition 16:9 (1.778) — not 3:4 posters, not ECU-only. Geumwa red-burgundy from ch_geumwa (not gold-plated). Jumong red #e8563f, grin until the knife. CLEAN-SHAVEN — NO mustache, NO goatee; ignore facial hair on ch_jumong. Daeso #9b8f6a too close. Galsa sage #6b8f4a delayed smile. Yuhwa ice-blue court silk, FACE from ch_yuhwa, not the bathing wrap. Hatch is a WET NEWBORN plus a WIDE of room+yard through the door. Do not remake jumong-buyeo-egg. Friends anonymous silks, never clone Jumong. They split in the pines; friends do NOT ride the fish/turtles and do NOT walk into Jolbon here — reunion is the Pine Kingdom sequence. Chronology: capital → yard → roof → dutch yard → gate → river-edge → hall interior → sun-shaft → egg → hatch-room wide → hatch → hatch worm → hatch hold → childhood tiny → boys → youths → fly-wing → mark → knife → night palisade → four → pine net → split. No army. No glow-halo.',
		shots: [
			{ id: 'jumong-set-buyeo-approach', role: 'approach', angle: 'far bird’s-eye', at: 'Buyeo’s capital is' },
			{ id: 'jumong-seq-buyeo-wide', role: 'exposition', angle: 'bird’s-eye dutch dusk', at: 'Buyeo’s capital is' },
			{ id: 'jumong-buyeo-seq-yard-dutch', role: 'exposition', angle: 'dutch crane yard', at: 'The packed-earth yard tilts' },
			{ id: 'jumong-buyeo-seq-gate-wide', role: 'exposition', angle: 'outside iron-boss doors', at: 'Iron-boss doors keep the river' },
			{ id: 'jumong-buyeo-seq-river-edge', role: 'exposition', angle: 'river foreground', at: 'The river-edge is a real bank' },
			{ id: 'jumong-yuhwa-sunshaft-timber', role: 'light before the egg', angle: 'dutch shaft-plane', at: 'A sun-shaft finds her' },
			{ id: 'jumong-yuhwa-sunshaft-night-follow', role: 'yellow follows', angle: 'dutch turn', at: 'A sun-shaft finds' },
			{ id: 'jumong-set-egg-field-empty', role: 'empty field', angle: 'dusk field', at: 'Yuhwa lays a great egg' },
			{ id: 'jumong-buyeo-egg', role: 'the egg', angle: 'dutch room', at: 'Yuhwa lays a great egg' },
			{ id: 'jumong-egg-ordeal-cast-cliff', role: 'cast off the palisade', angle: 'worm’s-eye drop', at: 'Someone winds up' },
			{ id: 'jumong-egg-ordeal-fall', role: 'falling streak', angle: 'aerial fall', at: 'The egg falls' },
			{ id: 'jumong-egg-ordeal-land', role: 'lands unhurt', angle: 'worm’s-eye dust', at: 'It lands unhurt' },
			{ id: 'jumong-egg-ordeal-sty', role: 'sty refuses', angle: 'iconic stamp', at: 'Dogs and pigs will not eat it' },
			{ id: 'jumong-egg-ordeal-road', role: 'hooves part', angle: 'iconic road', at: 'Cattle and horses step around it' },
			{ id: 'jumong-egg-ordeal-road-worm', role: 'worm’s-eye egg', angle: 'worm’s-eye hooves', at: 'Cattle and horses step around it' },
			{ id: 'jumong-egg-ordeal-second-hurl', role: 'throws again', angle: 'dutch second hurl', at: 'He throws it again' },
			{ id: 'jumong-egg-ordeal-bounce', role: 'bounce unhurt', angle: 'dutch bounce-arc', at: 'It bounces' },
			{ id: 'jumong-egg-ordeal-birds-seize', role: 'talons seize — carried off', angle: 'aerial carry', at: 'Birds seize it' },
			{ id: 'jumong-egg-ordeal-birds-dive', role: 'birds dive', angle: 'dutch dive', at: 'Birds cover it with their wings' },
			{ id: 'jumong-egg-ordeal-birds-flight', role: 'wing-storm in flight', angle: 'dutch wing-storm', at: 'They carry it' },
			{ id: 'jumong-egg-ordeal-birds', role: 'wing-arc cover', angle: 'iconic wing-arc', at: 'Birds cover it with their wings' },
			{ id: 'jumong-egg-ordeal-drop-door', role: 'dropped at her door', angle: 'dutch doorstep', at: 'Dropped back at her door' },
			{ id: 'jumong-egg-ordeal-axe-spark', role: 'spark — shell unhurt', angle: 'close dutch spark', at: 'The axe will not split the egg' },
			{ id: 'jumong-egg-ordeal-return', role: 'returned to Yuhwa', angle: 'intimate hands', at: 'Yuhwa wraps it warm' },
			{ id: 'jumong-buyeo-hatch', role: 'hatch', angle: 'close 16:9 seam', at: 'Then the shell' },
			{ id: 'jumong-buyeo-hatch-worm', role: 'looks up from the shell', angle: 'worm’s-eye egg', at: 'Then the shell' },
			{ id: 'jumong-buyeo-hatch-hold', role: 'first roof', angle: 'OTS hold', at: 'Yuhwa’s ice-blue sleeve is the first roof' },
			{ id: 'jumong-child-fly-wing-bow', role: 'fly wing bow', angle: 'rack-focus dawn', at: 'find a fly’s wing with an arrow' },
			{ id: 'jumong-buyeo-boys-young', role: 'boys', angle: 'bird’s-eye stake', at: 'They are boys first' },
			{ id: 'jumong-child-borrowed-bows', role: 'borrowed bows', angle: 'dutch lift', at: 'borrowed bows' },
			{ id: 'jumong-buyeo-boys', role: 'brothers', angle: 'worm’s-eye stake', at: 'grows up with his brothers' },
			{ id: 'jumong-child-yuhwa-door', role: 'mother at the door', angle: 'OTS doorway', at: 'Yuhwa watches from the hall door' },
			{ id: 'jumong-child-daeso-close', role: 'too close', angle: 'OTS shoulder', at: 'Daeso stands too close' },
			{ id: 'jumong-child-daeso-no-clap', role: 'Daeso not clapping', angle: 'dutch two-shot', at: 'The yard hears' },
			{ id: 'jumong-child-galsa-dirt', role: 'Galsa at dirt', angle: 'worm’s-eye dirt', at: 'The yard hears' },
			{ id: 'jumong-child-one-roof-pile', role: 'night pile', angle: 'dutch night step', at: 'They sleep in a pile like dogs' },
			{ id: 'jumong-child-millet', role: 'millet steal', angle: 'intimate dutch', at: 'Jumong steals the last millet' },
			{ id: 'jumong-child-grow-apart', role: 'growing apart', angle: 'bird’s-eye spaced', at: 'They grow apart in the same square' },
			{ id: 'jumong-child-two-talk', role: 'two talking', angle: 'dutch path', at: 'Only two come back talking' },
			{ id: 'jumong-buyeo-daeso-grip', role: 'teaches then resents', angle: 'OTS grip', at: 'Daeso teaches the grip, then resents the hit' },
			{ id: 'jumong-grin-fly-ecu', role: 'grin cheaper', angle: 'ECU grin', at: 'grinning is cheaper than asking why' },
			{ id: 'jumong-daeso-plot-lamp-ecu', role: 'before the next hunt', angle: 'ECU lamp', at: 'Do it before the next hunt.' },
			{ id: 'jumong-daeso-bowline', role: 'the mark', angle: 'horizontal strip', at: 'Then put the mark farther' },
			{ id: 'jumong-galsa-east-split', role: 'Galsa leaves', angle: 'ribbon east', at: 'Galsa-Buyeo' },
			{ id: 'jumong-daeso-side-room', role: 'off the record', angle: 'dutch lamp room', at: 'side room' },
			{ id: 'jumong-lady-ye-half-door', role: 'half door', angle: 'dutch lamp', at: 'Leave the door' },
			{ id: 'jumong-buyeo-knife', role: 'assassination', angle: 'dutch blade-line', at: 'Before the next hunt,' },
			{ id: 'jumong-ye-arranged', role: 'arranged marriage', angle: 'lamp two-shot', at: 'Jumong’s arranged marriage to Lady Ye' },
			{ id: 'jumong-lady-ye-yuri-pregnant', role: 'Yuri under the ribs', angle: 'intimate ECU', at: 'Lady Ye gets pregnant with their son Yuri' },
			{ id: 'jumong-ye-whisper', role: 'half a sword', angle: 'intimate ECU', at: 'Leave Buyeo. Tonight.' },
			{ id: 'jumong-buyeo-seq-night-palisade', role: 'escape geography', angle: 'night palisade', at: 'Night at the palisade' },
			{ id: 'jumong-seq-pine-net-crane', role: 'closing net', angle: 'aerial crane', at: 'take the hills' },
			{ id: 'jumong-friends-split-wide', role: 'the split', angle: 'aerial fork', at: 'They split in' },
			{ id: 'jumong-friends-split-ots', role: 'ridge', angle: 'OTS', at: 'We’ll take the' }
		]
	},
	{
		id: 'haemosu-haewonmek-night',
		title: 'Jumong — Haemosu stops Haewonmek, living ford',
		entryTitles: ['Buyeo'],
		place: 'Night rain Amnok (pl_white_river) — reed banks, moon-haze, SAME five-dragon gold chariot; living 자라 ford',
		why: 'Beat-by-beat film: run → army net → trip/pass-out → encounter over an unseen Jumong → wrist-stop → whisper from behind → inspiration looking at water → shout at the ford → spaced turtles → that’s-my-boy. Jumong never sees the gods.',
		canon: 'LOCK pl_white_river banks/reeds/hills only — NO boats, NO pier. Haemosu = sun: gold #f0b429 as a LIGHT-PLANE, never a body-halo. SAME chariot (two spoked wheels, rail, floor, yoke; dragons gold/crimson/azure/jade/white). Haewonmek: black gat, cobalt sash, black mouth-band, FACE ch_haewonmek. Jumong CLEAN-SHAVEN, red #e8563f, FACE ch_jumong (ignore facial hair). HARD RULE: Jumong cannot see either god — no look, reach, talk-to-face, or eye contact; eyeline is river / dirt / empty dark. Whisper is at the ear from behind. Army = tiny anonymous silhouettes, no catalog, no named faces. LOCKED FORD: Korean 자라 — flattened olive-brown leathery oval discs, same species every still; dark carp backs; ONE-SHELL-WIDTH water gaps (a run, not a pile). No giant leatherback. No gold-ring path. Chronology: run → spears in the dark → trip → face-in-grit → pass-out → reaper over unconscious → gold plane → wrist → god talk → whisper-behind → idea looking at water → shout at ford → turtles rise → night ford → dutch run → gods watch → jolly → boy ECU → ledger ECU → that’s-my-boy.',
		shots: [
			{ id: 'jumong-night-run-dutch', role: 'running away', angle: 'dutch pines', at: 'He runs until the pines smear' },
			{ id: 'jumong-night-army-net', role: 'closing net', angle: 'bird’s-eye', at: 'take the hills' },
			{ id: 'jumong-night-army-points', role: 'spear-points only', angle: 'low dutch', at: 'He runs until' },
			{ id: 'jumong-night-trip', role: 'trip', angle: 'dutch root', at: 'A root takes' },
			{ id: 'jumong-haemosu-night-arrive', role: 'water place', angle: 'dutch wide rain', at: 'Jumong reaches the water alone' },
			{ id: 'jumong-haewonmek-seq-unseen', role: 'unseen dive', angle: 'OTS Jumong', at: ', the reaper' },
			{ id: 'jumong-haewonmek-cold-ecu', role: 'cold approach', angle: 'ECU eyes', at: 'Jumong does not see the reaper' },
			{ id: 'jumong-haewonmek-shock-ecu', role: 'mid-strike shock', angle: 'ECU', at: 'the sun comes in as a body' },
			{ id: 'jumong-haewonmek-pin-stones', role: 'collection', angle: 'low two-shot', at: 'A root takes' },
			{ id: 'jumong-haemosu-wrist-close', role: 'wrist lock', angle: 'close dutch', at: 'A hand closes on Haewonmek’s wrist' },
			{ id: 'jumong-haewonmek-pain-ecu', role: 'wrist pain', angle: 'ECU wince', at: 'A hand closes on Haewonmek’s wrist' },
			{ id: 'jumong-haemosu-ambush-night', role: 'ambush', angle: 'dutch rain', at: 'Jumong’s cheek is' },
			{ id: 'jumong-haewonmek-blocked-ecu', role: 'blocked', angle: 'ECU gat askew', at: 'The night is not your domain' },
			{ id: 'jumong-haemosu-playful-anger-ecu', role: 'playful contempt', angle: 'ECU', at: 'The night is not your domain' },
			{ id: 'jumong-haemosu-seq-wormglow', role: 'sun at night', angle: 'worm’s-eye', at: 'Do you really think the sun disappears at night' },
			{ id: 'jumong-haemosu-wink-ecu', role: 'wink', angle: 'ECU wink', at: 'Do you really think the sun disappears at night' },
			{ id: 'jumong-haemosu-whisper-ear', role: 'whisper', angle: 'two-shot rain', at: 'Jumong cannot see him' },
			{ id: 'jumong-night-inspire-forward', role: 'inspiration', angle: 'look-down river', at: 'The idea arrives as breath' },
			{ id: 'jumong-night-shout-worm', role: 'shout at ford', angle: 'worm’s-eye mouth', at: 'Make way for me!' },
			{ id: 'jumong-turtle-crossing-wide', role: 'turtles rise', angle: 'wide night river', at: 'Tortoises rise and lock shell to shell' },
			{ id: 'jumong-turtle-night', role: 'living ford', angle: 'wide moon ribbon', at: 'shell to shell in the dark' },
			{ id: 'jumong-gods-watch-run', role: 'red speck', angle: 'bank two-shot', at: 'a red speck on the far dark' },
			{ id: 'jumong-haewonmek-almost-smile-ecu', role: 'refused smile', angle: 'ECU', at: 'a red speck on the far dark' },
			{ id: 'jumong-haemosu-jolly-haewonmek', role: 'job done', angle: 'two-shot night', at: 'laughs like the job is done' },
			{ id: 'jumong-haewonmek-ledger-ecu', role: 'ledger', angle: 'ECU', at: 'You just robbed a ledger.' },
			{ id: 'jumong-haewonmek-disgust-ecu', role: 'disgust', angle: 'ECU', at: 'You just robbed a ledger.' },
			{ id: 'jumong-haewonmek-tired-ecu', role: 'tired clerk', angle: 'ECU', at: 'He is still mortal' },
			{ id: 'jumong-haemosu-thats-my-boy', role: 'that’s my boy', angle: 'OTS rail', at: "That's my boy." }
		]
	},
	{
		id: 'jumong-jolbon-end',
		title: 'Jumong — founding timber, cavern dawn, succession hint',
		entryTitles: ['Jolbon'],
		place: 'Jolbon timber courtyard + SAME Jumong cavern (pl_jumong_cave)',
		why: 'The entry ended thin after the cavern joke. Founding wide, cavern OTS, king/queen timber, bow waiting.',
		canon: 'Jolbon: real giwa, packed earth, natural sky. Cavern: lock pl_jumong_cave. Dongmyung FACE ch_dongmyung, Sosuno dusty-rose, Haemosu photoreal in the dawn plane. Jumong #e8563f. Light is a plane. Black pupils. No army.',
		shots: [
			{ id: 'jumong-founding-dawn-wide', role: 'founding', angle: 'bird’s-eye dawn', at: 'the largest kingdom in Samhan' },
			{ id: 'jumong-seq-cave-dawn', role: 'dawn seam', angle: 'worm’s-eye cavern', at: 'Later he goes' },
			{ id: 'jumong-cave-dawn-ots', role: 'father in the plane', angle: 'OTS kneel', at: 'Later he goes' },
			{ id: 'jumong-king-queen-timber', role: 'king and queen', angle: 'worm’s-eye hall', at: 'a queen who still counts fires' },
			{ id: 'jumong-onjo-biryu-well-watch', role: 'two sons at the well', angle: 'dutch well', at: ', watch the' },
			{ id: 'jumong-death-bow', role: 'the bow waits', angle: 'dutch empty yard', at: 'Years later, the' }
		]
	},
	{
		id: 'jumong-sosuno-tsun',
		title: 'Sosuno — tsundere at Jolbon well',
		entryTitles: ['Jolbon'],
		place: 'Jolbon: pine road, timber hall, grain porch, SAME stone well (rim, timber beam, two buckets), packed earth, grey giwa',
		why: 'Scouts drag a wet exile to Tabal. First look is four beats, not one crack: stern girl-boss → stupid love (Jumong in the void) → lustful Little Sosuno in her head → snap-back chin-up. Then loft, well, daughters, pine. Loft heat LOCK paint: nsfw-jumong-sosuno-loft-dutch-spread (dutch, gritted tsun flush, hiked dusty-rose, millet loft).',
		canon: 'LOCK Tabal night hall: torch pools ONLY, crushed blacks, timber posts, no daylight leftover. LOCK Jolbon well EVERY well-cut: round granite rim, timber beam, hemp rope, two buckets on packed earth, nobody in the shaft, grey giwa hall. SAME Jolbon well every well-cut: round granite rim, timber beam, hemp rope, two buckets on packed earth, nobody in the shaft, grey giwa hall, grain porch left. Dusty-rose #e8a04a hanbok, not gold. Jumong red #e8563f. CLEAN-SHAVEN pre-king — NO mustache, NO goatee; ignore facial hair on ch_jumong. Tabal first encounter is DEAD OF NIGHT — torch pools only, crushed blacks, no daylight. First-summit coronation LOCK: /temp/crown-cord-tabal.jpg (setting/pose — vermilion thread, five fires, packed earth, giwa). King FACE ch_dongmyung. Tabal FACE ch_yeon_tabal. Four other chiefs FACE ch_cow_chief / ch_pig_chief / ch_dog_chief / ch_horse_chief — ONE of each, a RING of bowed backs, Jumong center, Tabal placing the cord. Queen at the rail: ch_sosuno_queen + bn_sosuno. Shot variety: bird’s-eye, top-down, ECU, dutch wide, OTS, worm’s-eye. Cavern stills lock to pl_jumong_cave.',
		shots: [
			{ id: 'jumong-seq-scouts-wide', role: 'scouts find him', angle: 'bird’s-eye pines', at: 'Jolbon scouts find him first' },
			{ id: 'jumong-scouts-hands', role: 'hands up', angle: 'dutch', at: 'Down. It’s down.' },
			{ id: 'jumong-seq-scouts-ots', role: 'spear OTS', angle: 'OTS', at: 'You’ll get Tabal' },
			{ id: 'jumong-seq-tabal-night-wide', role: 'torch hall exposition', angle: 'bird’s-eye night', at: 'Inside, the hall' },
			{ id: 'jumong-tabal-rope-dutch', role: 'rope two spears', angle: 'dutch three-body', at: 'Inside, the hall' },
			{ id: 'jumong-seq-tabal-torch-ots', role: 'interrogation', angle: 'OTS torch', at: 'So who sent you' },
			{ id: 'jumong-nobody-sent-ecu', role: 'nobody sent me', angle: 'ECU grin', at: 'Nobody sent me' },
			{ id: 'jumong-clothes-swallow', role: 'clothes swallow', angle: 'ECU', at: 'Your clothes don’t look like anything nearby' },
			{ id: 'jumong-sees-her-ots', role: 'looks past the spear', angle: 'OTS spear', at: 'He looks past the spear.' },
			{ id: 'jumong-sosuno-hall-chin', role: 'her chin up', angle: 'dutch porch', at: 'He looks past the spear.' },
			{ id: 'jumong-pretty-says', role: 'he says pretty', angle: 'ECU mouth', at: 'Pretty. Just—' },
			{ id: 'jumong-sosuno-pretty-cold', role: 'Sosuno reprimand', angle: 'ECU chin', at: 'Count the dirt.' },
			{ id: 'jumong-how-i-die-ecu', role: 'how I die face', angle: 'ECU', at: 'So this is how I die' },
			{ id: 'jumong-tabal-guards-close-wide', role: 'points close', angle: 'bird’s-eye torch', at: 'The points close.' },
			{ id: 'jumong-tabal-guards-spear-throat', role: 'spear at throat', angle: 'dutch close', at: 'The points close.' },
			{ id: 'jumong-kill-react-ecu', role: 'grin gone', angle: 'ECU', at: 'So this is how I die.' },
			{ id: 'jumong-sosuno-porch-kill-ecu', role: 'porch reaction', angle: 'ECU stick', at: 'You said talk first.' },
			{ id: 'jumong-tabal-bow-notice', role: 'notices the bow', angle: 'OTS dirt', at: 'He notices the bow.' },
			{ id: 'jumong-tabal-bow-object-ecu', role: 'crow-bow object', angle: 'ECU object', at: 'Tabal notices the' },
			{ id: 'jumong-tabal-bow-all-strength', role: 'all his strength', angle: 'worm’s-eye strain', at: 'He cannot pull the string.' },
			{ id: 'jumong-seq-tabal-bow', role: 'the bow will not bend', angle: 'worm’s-eye strain', at: 'He cannot pull the string' },
			{ id: 'jumong-tabal-bow-strain', role: 'string won’t come', angle: 'worm’s-eye', at: 'He cannot pull the string' },
			{ id: 'jumong-tabal-bow-stop', role: 'Stop!', angle: 'ECU', at: 'Stop!' },
			{ id: 'jumong-tabal-bow-fail-ecu', role: 'suspicious', angle: 'ECU', at: 'This strong stranger.' },
			{ id: 'jumong-tabal-stop-points-down', role: 'points down', angle: 'dutch hand', at: 'Points down. I said down.' },
			{ id: 'jumong-seq-tabal-lineage', role: 'names Haemosu', angle: 'worm’s-eye', at: 'Son of Haemosu' },
			{ id: 'jumong-tabal-slave-assign', role: 'slave under Sosuno', angle: 'dutch porch point', at: "You're a slave. My daughter's." },
			{ id: 'jumong-seq-shed-night', role: 'let him go', angle: 'dutch torch shed', at: "You're a slave. My daughter's." },
			{ id: 'jumong-seq-jolbon-wide', role: 'place', angle: 'dutch dusk leftover', at: 'They bring him' },
			{ id: 'jumong-seq-tabal-ledger', role: 'valley as ledger', angle: 'dutch wide', at: 'Tabal walks him' },
			{ id: 'jumong-seq-tabal-weigh', role: 'Tabal weighs', angle: 'OTS', at: 'He cannot pull the string' },
			{ id: 'jumong-seq-tabal-use', role: 'the millet votes', angle: 'worm’s-eye draw', at: 'The millet likes you. I don’t.' },
			{ id: 'jumong-seq-hire', role: 'assigned to Sosuno', angle: 'dutch porch', at: 'Soon the porch' },
			{ id: 'jumong-sosuno-seq-hunt-wide', role: '1 stern girl-boss', angle: 'worm’s-eye ranks', at: ', a widow,' },
			{ id: 'jumong-sosuno-seq-cold-ecu', role: 'cold command face', angle: 'ECU chin', at: 'She does not raise her voice' },
			{ id: 'jumong-sosuno-seq-first-look-dutch', role: 'wet man enters', angle: 'dutch yard', at: 'Then the wet man is in the yard' },
			{ id: 'jumong-sosuno-seq-first-look-ots', role: 'her first look', angle: 'OTS Sosuno', at: 'The yard goes quiet.' },
			{ id: 'jumong-sosuno-seq-first-blush-ecu', role: 'stupid blush ECU', angle: 'ECU', at: 'Something in her goes stupid' },
			{ id: 'nsfw-jumong-sosuno-first-purr', role: 'hungry stare', angle: 'ECU mouth', at: 'Little Sosuno is purring' },
			{ id: 'jumong-sosuno-seq-think-void', role: '3 lust in her head', angle: 'black void + red grin', at: 'The counting-voice says' },
			{ id: 'jumong-sosuno-seq-thatch-night', role: 'first night thatch', angle: 'dutch bed', at: 'Sosuno lies on her thatched bed the first night' },
			{ id: 'jumong-sosuno-seq-thatch-fight', role: 'fights the fantasy', angle: 'ECU', at: 'She tries to' },
			{ id: 'nsfw-jumong-sosuno-thatch-hand', role: 'hand slips down', angle: 'intimate', at: 'Her hand slips down between her legs' },
			{ id: 'jumong-sosuno-seq-thatch-aftermath', role: 'after, beam stare', angle: 'low dutch', at: 'The first night does not leave the bed' },
			{ id: 'jumong-sosuno-seq-point-millet', role: 'she points west', angle: 'dutch point', at: 'She points him' },
			{ id: 'jumong-seq-haul-grin', role: 'hauls grinning', angle: 'worm’s-eye sack', at: 'She points him' },
			{ id: 'jumong-sosuno-seq-wrong-stack', role: 'wrong stack', angle: 'dutch correct', at: 'Wrong stack. Do it again.' },
			{ id: 'jumong-sosuno-seq-work-first-two', role: 'work first', angle: 'dutch two-shot', at: 'Work first. Looking later.' },
			{ id: 'jumong-sosuno-seq-dont-grin-work', role: 'don’t grin', angle: 'intimate two-shot', at: 'Don’t grin at the work.' },
			{ id: 'jumong-sosuno-not-a-tour', role: 'not a tour', angle: 'dutch porch', at: 'Work. Not a tour.' },
			{ id: 'jumong-sosuno-crow-obviously', role: 'crow tribe', angle: 'OTS millet', at: 'Crow.' },
			{ id: 'jumong-sosuno-tiger-side', role: 'tiger with him', angle: 'worm’s-eye ditch', at: "Tiger's with him." },
			{ id: 'jumong-sosuno-infight-lift', role: 'now lift', angle: 'dutch two-shot', at: "That's the whole country. Now lift." },
			{ id: 'jumong-sosuno-seq-shy-back', role: 'blush at his back', angle: 'ECU OTS', at: 'Chin up, she' },
			{ id: 'jumong-sosuno-seq-dump-water', role: 'rude days', angle: 'dutch dump', at: 'Don’t follow me.' },
			{ id: 'jumong-sosuno-seq-mate-guard', role: 'other daughters', angle: 'dutch yard', at: 'She finds a flaw every time' },
			{ id: 'jumong-seq-girls-fawn', role: 'women fawn', angle: 'dutch well', at: 'She finds a flaw every time' },
			{ id: 'jumong-sosuno-seq-daughters-sexy', role: 'they can pose', angle: 'dutch well', at: 'They can do sexy. She can do eldest' },
			{ id: 'jumong-daughter-teal-well-hike', role: 'teal hike close', angle: 'intimate dutch', at: 'Teal hikes at his well' },
			{ id: 'jumong-daughter-saffron-well-hitch', role: 'saffron hitch close', angle: 'intimate OTS', at: 'Saffron leaves the hem' },
			{ id: 'jumong-seq-daughters-invite', role: 'invitation faces', angle: 'worm’s-eye rim', at: 'Come fetch at ours' },
			{ id: 'jumong-daughter-teal-talk-ecu', role: 'teal talks', angle: 'ECU', at: 'Hey big boy~' },
			{ id: 'jumong-daughter-saffron-talk-ecu', role: 'saffron talks', angle: 'ECU', at: 'Ours is nicer. Stay.' },
			{ id: 'jumong-daughter-plum-talk-ecu', role: 'look at me', angle: 'ECU', at: 'Don’t look at Sosuno. Look at me.' },
			{ id: 'jumong-flirt-daughters', role: 'he flirts back', angle: 'dutch OTS wink', at: 'He flirts at the wrong well' },
			{ id: 'jumong-daughter-plum-ass-back', role: 'plum ass-back', angle: 'dutch well', at: 'Plum does not' },
			{ id: 'jumong-daughter-teal-aegyo-ecu', role: 'teal aegyo ECU', angle: 'ECU look-back', at: 'Aegyo look-back' },
			{ id: 'jumong-daughter-teal-lean-hike', role: 'lean teal hike', angle: 'intimate dutch', at: 'Teal hikes her' },
			{ id: 'jumong-cold-shudder', role: 'cold shudder', angle: 'OTS back', at: 'A Sosuno-shaped shadow' },
			{ id: 'jumong-sosuno-tsun-well-caught', role: 'tsundere caught', angle: 'ECU', at: 'A Sosuno-shaped shadow' },
			{ id: 'jumong-sosuno-seq-kick-out', role: 'kicks them off', angle: 'dutch wedge', at: 'Get off my well.' },
			{ id: 'jumong-sosuno-seq-kick-well-dutch', role: 'Get. Off.', angle: 'dutch kick', at: 'Get. Off.' },
			{ id: 'jumong-sosuno-seq-jealous-ecu', role: 'jealous ECU', angle: 'ECU glare', at: 'Don’t smile at them' },
			{ id: 'jumong-sosuno-seq-work-pull', role: 'my worker', angle: 'dutch sleeve', at: 'That’s my worker' },
			{ id: 'jumong-sosuno-seq-work-ditch', role: 'ditch', angle: 'worm’s-eye', at: 'Ditch. Now.' },
			{ id: 'jumong-sosuno-seq-work-rope', role: 'rope', angle: 'dutch well', at: 'She makes him wring the rope' },
			{ id: 'jumong-sosuno-seq-loft-ots', role: 'ogle his work', angle: 'OTS millet', at: 'She does not stay' },
			{ id: 'jumong-sosuno-side-full-draw', role: 'side full-draw', angle: 'strict side profile', at: 'She does not call' },
			{ id: 'jumong-sosuno-side-walk-away', role: 'side walk-away', angle: 'strict side profile', at: 'Around. Big idiot.' },
			{ id: 'nsfw-jumong-sosuno-loft-worm-open', role: 'worm’s-eye open', angle: 'worm’s-eye floor', at: 'Little Sosuno.' },
			{ id: 'nsfw-jumong-sosuno-haunt-face', role: 'haunt face', angle: 'thought ECU', at: 'His face comes' },
			{ id: 'nsfw-jumong-sosuno-little', role: 'little Sosuno', angle: 'ECU', at: 'Little Sosuno.' },
			{ id: 'jumong-sosuno-seq-come-down', role: 'eldest again', angle: 'low dutch stairs', at: 'She freezes mid-breath.' },
			{ id: 'jumong-sosuno-seq-scream-mad', role: 'screaming mad', angle: 'ECU shout', at: 'BECAUSE YOU WERE HANGING WITH THOSE OTHER BITCHES—' },
			{ id: 'jumong-seq-well-wide', role: 'well dutch', angle: 'dutch wide', at: 'They keep meeting' },
			{ id: 'jumong-set-well-day-empty', role: 'empty well day', angle: 'dutch day', at: 'Day at the well is two buckets' },
			{ id: 'jumong-seq-well-ecu-rope', role: 'rope ECU', angle: 'ECU', at: 'Rope’s being a villain' },
			{ id: 'jumong-seq-well-topdown', role: 'pink ears', angle: 'top-down', at: 'Your ears are pink' },
			{ id: 'jumong-seq-well-kiss', role: 'he kisses her', angle: 'dutch two-shot', at: 'He keeps ending' },
			{ id: 'jumong-sosuno-seq-kiss-shock', role: 'taken aback', angle: 'ECU shock', at: 'How dare you.' },
			{ id: 'jumong-sosuno-seq-how-dare', role: 'How dare you', angle: 'ECU blush-rage', at: 'How dare you.' },
			{ id: 'jumong-sosuno-seq-kiss-lash', role: 'she shoves', angle: 'dutch shove', at: 'Don’t grin. If you grin I—' },
			{ id: 'nsfw-jumong-sosuno-back-dutch', role: 'naked back dutch', angle: 'dutch OTS', at: 'She does not pull' },
			{ id: 'jumong-seq-leave-bow', role: 'bow left', angle: 'worm’s-eye', at: 'He stops smiling.' },
			{ id: 'jumong-sosuno-seq-beam-shot', role: 'she shoots the beam', angle: 'worm’s-eye full-draw', at: 'She does not call' },
			{ id: 'jumong-seq-turn-leave', role: 'he walks', angle: 'OTS receding red', at: 'He turns for the pine' },
			{ id: 'jumong-then-grins', role: 'the well-grin lands', angle: 'ECU grin', at: 'Then he grins, smaller' },
			{ id: 'jumong-sosuno-denial-heat', role: 'denial blush', angle: 'ECU denial', at: 'I don’t— I don’t like you.' },
			{ id: 'jumong-pov-tease', role: 'his view of the slip', angle: 'OTS Jumong', at: 'So how long has it been.' },
			{ id: 'jumong-pov-blush', role: 'his view of the blush', angle: 'OTS Jumong ECU', at: 'Then why are you furiously blushing.' },
			{ id: 'jumong-pov-lookback', role: 'his glance back', angle: 'OTS glance', at: 'He turns for the pine' },
			{ id: 'jumong-pov-wont-say', role: 'his view she looks down', angle: 'OTS Jumong', at: 'I wasn’t going to say it' },
			{ id: 'jumong-stunned-ecu', role: 'he is stunned', angle: 'ECU Jumong', at: 'Jumong’s grin dies in his mouth' },
			{ id: 'jumong-sosuno-stunned-ecu', role: 'she is stunned', angle: 'ECU Sosuno', at: 'Sosuno hears herself and cannot take it back' },
			{ id: 'jumong-confess-insert-rope', role: 'rope hangs', angle: 'insert still-life', at: 'The well-rope hangs' },
			{ id: 'jumong-here-soft', role: 'I’m here', angle: 'ECU soft', at: 'Hey. Hey I’m' },
			{ id: 'jumong-confess-pin-out', role: 'binyeo comes out', angle: 'ECU pin', at: 'The bird pin comes out' },
			{ id: 'jumong-confess-hair-falls', role: 'hair falls', angle: 'dutch ECU hair', at: 'The bird pin' },
			{ id: 'jumong-confess-sit-floor', role: 'she sits down', angle: 'low dutch sit', at: 'The bird pin' },
			{ id: 'jumong-confess-he-kneels', role: 'he kneels in', angle: 'OTS kneel', at: 'He kneels lower' },
			{ id: 'jumong-sosuno-seq-forced-confess', role: 'forced confession', angle: 'ECU', at: 'I wasn’t going to say it' },
			{ id: 'jumong-sosuno-seq-run-kiss', role: 'after she says it', angle: 'dutch catch', at: 'Now come here before I take it back' },
			{ id: 'jumong-seq-stash', role: 'memorabilia', angle: 'ECU still-life', at: 'You hide these like a thief' },
			{ id: 'jumong-sosuno-seq-stash-blush', role: 'caught stash', angle: 'ECU blush', at: 'She goes so' },
			{ id: 'jumong-seq-ledger', role: 'lamp heat', angle: 'grain-room two-shot', at: 'They do not' },
			{ id: 'nsfw-jumong-sosuno-grind-fit', role: 'too tight', angle: 'close grind', at: 'It won’t— ah— fit—' },
			{ id: 'nsfw-jumong-sosuno-hands-shake', role: 'not wife yet', angle: 'ECU hands', at: 'I am not your wife yet' },
			{ id: 'nsfw-jumong-sosuno-wall-pin', role: 'mouth first', angle: 'dutch pin', at: 'Give me your mouth… first' },
			{ id: 'nsfw-jumong-sosuno-grain-back', role: 'first time', angle: 'OTS grain room', at: 'The dusty-rose hiked,' },
			{ id: 'nsfw-jumong-sosuno-dumb-idiot', role: 'climax scream', angle: 'ECU', at: 'DUMB BIG IDIOT' },
			{ id: 'jumong-seq-dawn-shy', role: 'sleep in grain', angle: 'dutch low', at: 'He goes for' },
			{ id: 'jumong-tabal-seq-dawn-door', role: 'caught', angle: 'OTS doorway', at: 'Tabal is in the doorway' },
			{ id: 'jumong-tabal-seq-grumpy', role: 'son-in-law tests', angle: 'porch OTS', at: 'I am not pleased. I am also not blind.' },
			{ id: 'jumong-seq-pine-wide', role: 'the pine', angle: 'worm’s-eye yard', at: 'The pine stands' },
			{ id: 'jumong-seq-split', role: 'arrow splits', angle: 'worm’s-eye', at: 'The best men' },
			{ id: 'jumong-seq-tribes-wide', role: 'five roofs', angle: 'bird’s-eye', at: 'You keep cutting each other' },
			{ id: 'jumong-seq-tribes-speak', role: 'one roof', angle: 'dutch hall', at: 'He does not conquer' },
			{ id: 'jumong-seq-king-vote', role: 'they vote', angle: 'low strip', at: 'After the marriage' },
			{ id: 'jumong-seq-summit-wide', role: 'summit yard', angle: 'wide', at: 'the first summit of the five tribes' },
			{ id: 'jumong-seq-summit-fires', role: 'five fire columns', angle: 'worm’s-eye', at: 'What he calls' },
			{ id: 'jumong-crown-fires-dutch', role: 'five pits dutch', angle: 'dutch fires', at: 'The five fires take the same wind' },
			{ id: 'jumong-crown-cord-tabal', role: 'Tabal sets the cord', angle: 'dutch OTS hands', at: 'Tabal sets a vermilion cord' },
			{ id: 'jumong-crown-thread-ecu', role: 'thread ECU', angle: 'ECU hands', at: 'Tabal sets a vermilion cord' },
			{ id: 'jumong-seq-summit-queen', role: 'queen at ceremony', angle: 'rail', at: 'first queen of a country that still smells like millet' },
			{ id: 'jumong-crown-queen-rail', role: 'queen OTS', angle: 'OTS rail', at: 'first queen of a country that still smells like millet' },
			{ id: 'jumong-seq-summit-ring', role: 'five sit', angle: 'bird’s-eye ring', at: 'What he calls' },
			{ id: 'jumong-seq-summit-vote', role: 'the vote', angle: 'dutch fires', at: 'Crow roof votes' },
			{ id: 'jumong-seq-crown-pair', role: 'king and queen ceremony', angle: 'wide two-shot', at: 'King and queen on packed earth' },
			{ id: 'nsfw-jumong-royal-queen-back', role: 'queen naked back', angle: 'OTS press', at: 'In the new' },
			{ id: 'nsfw-jumong-royal-king-back', role: 'king naked back', angle: 'OTS reverse', at: 'In the new' },
			{ id: 'nsfw-jumong-royal-king-back-h', role: 'king naked back 16:9', angle: 'OTS reverse wide', at: 'his royal back is the picture' },
			{ id: 'nsfw-jumong-sosuno-queen-blush-ecu', role: 'blushing queen ECU', angle: 'ECU', at: 'I’m blushing— don’t you dare stop' },
			{ id: 'nsfw-jumong-royal-naked-pose', role: 'queen naked pose', angle: 'dutch sacks', at: 'Grind me like a queen.' },
			{ id: 'jumong-seq-cave-dawn', role: 'dawn seam', angle: 'worm’s-eye cavern', at: 'Later he goes' },
			{ id: 'jumong-seq-haemosu-unveil', role: 'father unveils', angle: 'two-shot cavern', at: 'Gold where the' }
		]
	},
	{
		id: 'jumong-songyang',
		title: 'Jumong — Song Yang / Pine Kingdom',
		entryTitles: ['Jolbon'],
		place: 'Pine Kingdom (소나무 나라) — real Korean pines, timber giwa hall as a dark bar, packed-earth mark-yard; contest here, not Tabal’s Jolbon square',
		why: 'After the cord: king and queen learn Oi, Mari, and Hyupbo reached the Pine Kingdom. They annex Song Yang’s pine roof to get the three back. One bow, one yard, not an army. Song Yang yields; the three return. Then the cavern.',
		canon: 'AFTER jumong-sosuno-tsun crown shots. LOCK pine yard: real Korean pines, timber giwa hall as dark bar, packed-earth mark — not Jolbon well cousins. LOCK pine timber + real pines every Earth cut. Do NOT caption the country 비류 / Biryu. Korean display: 소나무 나라. FACE from royal sheets: King Jumong ch_dongmyung (gold crown, red dragon robe) NOT exile ch_jumong; Queen Sosuno ch_sosuno_queen + bn_sosuno NOT worker dusty-rose ch_sosuno. Song Yang FACE ch_songyang, pine-ochre #c4a35a rim not gold-plate. Friends anonymous earth-tone silks — never clone Jumong, never invent faces. Shot variety: dutch Jolbon news, bird’s-eye pine wide, worm’s-eye draw, dutch short, OTS yield, dusk reunion. No army catalog. Black pupils.',
		shots: [
			{ id: 'jumong-pine-news', role: 'the news', angle: 'dutch Jolbon porch', at: 'Oi, Mari, and Hyupbo did not vanish' },
			{ id: 'jumong-songyang-yard-wide', role: 'exposition', angle: 'bird’s-eye pines', at: 'It is the Pine' },
			{ id: 'jumong-songyang-draw', role: 'the draw', angle: 'worm’s-eye', at: 'Then put the name on the mark' },
			{ id: 'jumong-songyang-shot-short', role: 'honest short', angle: 'dutch', at: 'Song Yang’s arrow is honest and short' },
			{ id: 'jumong-songyang-win', role: 'yield', angle: 'OTS', at: 'The pine country is under this roof' },
			{ id: 'jumong-friends-jolbon', role: 'reunion', angle: 'dutch pine gate', at: 'the three come out of the pine hall' }
		]
	},
	{
		id: 'onjo-south',
		title: 'Onjo — Yuri’s sword to the south road',
		entryTitles: ['Onjo'],
		place: 'Buyeo packed-earth yard → pine/seven-sided stone → river road → Goguryeo timber/stone court (pl_pyongyang_fortress) → SAME Jolbon well, grain room, dawn gate',
		why: 'Yuri bullied, token, retrace, click, leftover sons, ten carts, well goodbye, last night, caravan. Film, not a skip to Baekje.',
		canon: 'Earth locations stay buildings: grey giwa, timber, packed earth, natural sky. FACE from ch_yuri / ch_lady_ye / ch_dongmyung / ch_sosuno_queen / ch_onjo / ch_biryu. Horizontal 16:9. Shot variety. Last-night stills intimate/close, same grain room as Jumong. No abstract void courts.',
		shots: [
			{ id: 'onjo-seq-buyeo-bully', role: 'no father', angle: 'dutch yard', at: 'Whose son are you' },
			{ id: 'onjo-seq-pine-dig', role: 'token', angle: 'worm’s-eye pine', at: 'seven-sided stone' },
			{ id: 'onjo-seq-retrace-wide', role: 'retrace', angle: 'bird’s-eye river', at: 'With his friends' },
			{ id: 'onjo-seq-court-match', role: 'halves click', angle: 'dutch hall', at: 'In the hall' },
			{ id: 'onjo-seq-left-rail', role: 'left out', angle: 'OTS rail', at: 'The rail already knows' },
			{ id: 'onjo-seq-ten-pack', role: 'ten vassals', angle: 'dutch carts', at: 'ten men start packing' },
			{ id: 'onjo-seq-torn', role: 'Jumong torn', angle: 'dutch empty hall', at: 'I left iron under a pine' },
			{ id: 'onjo-seq-goodbye-well', role: 'well goodbye', angle: 'dutch dusk', at: 'I kept it. For you.' },
			{ id: 'onjo-seq-queen-king-rail', role: 'queen rail', angle: 'OTS', at: 'Yuri can have the chair' },
			{ id: 'nsfw-onjo-ogle-body', role: 'heart-eyes ogle', angle: 'ECU', at: 'Still that mouth.' },
			{ id: 'nsfw-onjo-last-ots', role: 'ride OTS', angle: 'OTS', at: 'Older. Hungrier. The' },
			{ id: 'sosuno-seq-glow-south', role: 'south road', angle: 'wide dawn', at: 'At dawn ten' }
		]
	},
	{
		id: 'bidam-father-hwarang',
		title: 'Bidam — first Hwarang morning',
		entryTitles: ['기 (起)'],
		place: 'Surabol Hwarang yard — packed earth, timber gate (after 645 veto, as memory)',
		why: 'After Bidam’s solo veto, the father’s If: walk alone toward the truth.',
		canon: 'Young Bidam FACE from ch_bidam_hwarang. Father FACE from ch_bidam_old as Son Sukwon. Navy #141C2E. Beads. Packed earth. One device. High contrast. 2D cel-painterly.',
		shots: [
			{ id: 'bidam-father-first-day', role: 'father sends', angle: 'dutch two-shot', at: 'righteous traitor' }
		]
	},
	{
		id: 'bidam-rebellion-splash',
		title: 'Bidam’s Rebellion — cavern water',
		entryTitles: ['승 (承)'],
		place: 'Steam cavern (pl_cave) then Radiance 정자 night',
		why: 'Bupmin at 21 first meets the goddesses; splash fails; Bidam laughs alive.',
		canon: 'Bupmin ch_bupmin_hwarang painterly #C41E3A. Goddesses photoreal-numinous, living eyes (not oracle glow). Bidam navy beads. Yushin Confucian blue standing. Splash is political, not sex. Same 정자 as other Radiance nights.',
		shots: [
			{ id: 'chunchu-sends-bupmin', role: 'send', angle: 'dutch stride', at: 'Take a jar.' },
			{ id: 'goddesses-meet-bupmin', role: 'first meeting', angle: 'two-shot steam', at: 'He is the best of both' },
			{ id: 'yushin-stalls-bidam', role: 'stall', angle: 'OTS pavilion', at: 'keep him talking' },
			{ id: 'bupmin-splash-bidam', role: 'splash', angle: 'dutch behind', at: 'splash the water' },
			{ id: 'water-does-nothing', role: 'no vision', angle: 'ECU', at: 'why isn’t it doing anything' },
			{ id: 'bidam-laugh-monologue', role: 'laugh', angle: "worm’s-eye", at: 'HAHAHAHAHA' }
		]
	},
	{
		id: 'bidam-rebellion-cinema',
		title: 'Bidam’s Rebellion — lineage, tea, black bands, Radiance',
		entryTitles: ['승 (承)', '전 (轉)', '결 (結)'],
		place: 'Steam cavern (pl_cave) · night 정자 · Radiance fortress (pl_radiance_fortress)',
		why: 'Cavern lineage, tabletop nights, age-scored duels, rebel black headbands, Bidam–Yumjong at the gate.',
		canon: 'Yushin CLEAN-SHAVEN from ch_kim_yushin. Father ch_kim_seohyun, grandfather ch_kim_muryuk. Bidam navy #141C2E + BLACK HEADBAND. Yushin #2A5FB8. Place refs drive 3D layout. High contrast. One device. No army carpet.',
		shots: [
			{ id: 'radiance-exposition-wide', role: 'Radiance wide', angle: 'exposition', at: 'Fortress of Radiance' },
			{ id: 'bidam-yumjong-gate', role: 'open gate', angle: 'dutch', at: 'Open the Radiance gate.' },
			{ id: 'rebel-black-headband-army', role: 'black bands', angle: 'iconic lower-third', at: 'The rebel band ties black headbands' },
			{ id: 'silla-blue-camp', role: 'Silla camp', angle: 'iconic opposite', at: 'Between the camps a small pavilion goes up' },
			{ id: 'bidam-yushin-tea-ots', role: 'tea OTS', angle: 'OTS', at: 'Tea first.' },
			{ id: 'bidam-yushin-tea-map', role: 'tea map', angle: 'dutch', at: 'Bidam has brought a map' },
			{ id: 'bidam-yushin-tea-cold', role: 'cold tea', angle: 'ECU cups', at: 'The tea is cold before anyone raises a blade' },
			{ id: 'bidam-yushin-duel-youth', role: 'duel youth', angle: 'dutch', at: 'The yard after rain' },
			{ id: 'bidam-yushin-duel-prime', role: 'duel prime', angle: "worm’s-eye", at: 'only the old score again' },
			{ id: 'bidam-defends-yushin', role: 'defends Yushin', angle: 'OTS yard', at: 'What did any of you do to earn True Bone?' },
			{ id: 'yushin-cavern-lineage-wide', role: 'lineage wide', angle: "worm’s-eye cavern", at: 'Two shapes wait where the rock shelves into black' },
			{ id: 'yushin-father-grandfather-close', role: 'lineage close', angle: 'dutch three', at: 'Two shapes wait where the rock shelves into black' },
			{ id: 'yushin-cavern-seohyeon-hand', role: 'father hand', angle: 'ECU', at: 'You are my son. You are Kim Yushin.' },
			{ id: 'yushin-cavern-muryuk-proud', role: 'grandfather', angle: 'OTS', at: 'I loved you before I knew you.' },
			{ id: 'bidam-yushin-duel-day10', role: 'day 10 clash', angle: "worm’s-eye", at: 'They meet again between the camps' }
		]
	},
	{
		id: 'gaya-fall-cinema',
		title: 'Muryuk — cone and surrender',
		entryTitles: ['Suro', 'Muryuk'],
		place: 'Gaya iron coast · Silla hall · night ridge',
		why: 'Harbour league, last cone fight, Muryuk’s surrender condition.',
		canon: 'Muryuk FACE from ch_kim_muryuk. Tall Gaya cone. Steel lamellar + purple #8B5CF6 peek. High contrast. One device.',
		shots: [
			{ id: 'gaya-iron-harbour-wide', role: 'iron harbours', angle: 'exposition', at: 'league of iron harbours' },
			{ id: 'gaya-cone-last-fight', role: 'last fight', angle: "worm’s-eye", at: 'The tall Gaya cone still fights' },
			{ id: 'gaya-muryuk-surrender-dutch', role: 'surrender', angle: 'dutch kneel', at: 'If I am to surrender, I have one condition' }
		]
	},
	{
		id: 'xue-longmen-field',
		title: 'Xue Rengui — Longmen field and hut',
		entryTitles: ['Four Dragons'],
		place: 'Jiangzhou Longmen — rammed-earth hut, millet/sorghum field (not Korean giwa)',
		why: 'The Xin Tangshu wife speech lives here: poverty, graves, yellow peasant cloth, then the ji. Needs a dedicated farm sequence, not a Stallion Mountain cameo.',
		canon: 'SAME hut and field every cut. Chinese ink/wash + Northern Song / Tang genre painting grammar: empty mist, one hut, tiny figures or poster-scale peasants. Xue FACE from ch_xue_rengui — NEVER the white armour; PLAIN YELLOW hemp peasant cloth (dye, not a yellow aura). Liu FACE and dusty hemp from ch_xue_liu. Hex #e8e3d5 / #c4a484 as real dawn bounce on earth, not a halo. High contrast. One device. No Korean hanbok. No photoreal. No glow.',
		shots: [
			{ id: 'xue-longmen-field-dawn', role: 'exposition', angle: 'bird’s-eye dawn mist', at: 'poor field of Longmen' },
			{ id: 'xue-longmen-hut-door', role: 'hut door', angle: 'worm’s-eye door stamp', at: 'hut door' },
			{ id: 'xue-longmen-yellow-hoe', role: 'yellow hoe', angle: 'dutch mid-stride hoe', at: 'The cloth on' },
			{ id: 'xue-longmen-wife-close', role: 'Liu', angle: 'intimate ECU', at: 'Mounds don’t wait' },
			{ id: 'xue-longmen-two-shot', role: 'threshold two-shot', angle: 'dutch OTS', at: 'I’ll shut the' },
			{ id: 'xue-longmen-graves', role: 'unfinished mounds', angle: 'wide lower-third', at: 'rebury his ancestors' },
			{ id: 'xue-longmen-leave', role: 'leaves with the ji', angle: 'dutch farewell', at: 'He goes' }
		]
	},
	{
		id: 'hwanung-ungnyeo',
		title: 'Hwanung & Ungnyeo — under the birch',
		entryTitles: ['Dangun & Old Joseon'],
		place: 'Divine birch on the snow peak (pl_baekdu) — the first romance',
		why: 'She stands on the path to the hall until he forgets the seal. First love in the chronicle, before every later courtship.',
		canon: 'SAME snow peak and birch every cut. Hwanung FACE and white fur-silk from ch_hwanung. Ungnyeo FACE, brown fur collar, rust sash from ch_ungnyeo, bear-head pin from bn_ungnyeo. #d4b86a and #c9b18f as real dusk or moon, not a glow. High contrast. One device: the birch. Night stills are intimate and skin-forward.',
		shots: [
			{ id: 'hwanung-ungnyeo-birch-wide', role: 'exposition', angle: 'wide dusk', at: 'stands under the sacred tree' },
			{ id: 'ungnyeo-dont-closer', role: 'she hedges', angle: '3:4 against bark', at: "don't come closer" },
			{ id: 'hwanung-seal-forgotten', role: 'he stops', angle: 'dutch', at: 'the seal in his hand' },
			{ id: 'ungnyeo-pass-again', role: 'she calls', angle: 'OTS dutch', at: "You're going to walk past again" },
			{ id: 'hwanung-garlic-far', role: 'he teases', angle: 'ECU', at: 'The garlic reached this far' },
			{ id: 'ungnyeo-hand-claim', role: 'hands', angle: 'intimate still-life', at: 'You already have the hand' },
			{ id: 'hwanung-come-down', role: 'come down', angle: "worm’s-eye", at: 'Then come down' },
			{ id: 'ungnyeo-tree-watch', role: 'the birch watches', angle: 'iconic wide', at: 'The tree can watch' },
			{ id: 'hwanung-ungnyeo-kiss', role: 'first kiss', angle: 'close', at: 'The kiss is clumsy' },
			{ id: 'hwanung-ungnyeo-sash-moss', role: 'sash in moss', angle: 'intimate dutch', at: 'rust-red sash is somewhere in the moss' },
			{ id: 'hwanung-ungnyeo-night', role: 'night', angle: 'intimate 16:9', at: 'pulls him down by the hair' },
			{ id: 'ungnyeo-seal-thief', role: 'she keeps the seal', angle: 'ECU seal', at: 'Under my head.' },
			{ id: 'ungnyeo-marry-morning', role: 'dawn ask', angle: 'dawn two-shot', at: 'Marry me in the morning' }
		]
	},
	{
		id: 'euija-coup',
		title: 'Euija’s Coup — martial law at Deer Rock',
		entryTitles: ['Coup'],
		place: 'Deer Rock / Rock of Politics (pl_rock_politics) — Sabi Ministers’ Assembly',
		why: 'Emergency martial law speech → Enabling Law → peace-or-war vote → forty-one sons → Chunbok Premier. Same rock every cut.',
		canon: 'LOCK pl_rock_politics every still. Euija FACE/garments ch_buyeo_euija, amber #e08a2e as real torch/silk bounce not a halo. Chunbok ch_satek_chunbok. Minister Satek ch_satek_minister. Chronology: wide aisle → dutch speech → trust ECU → wet ink → enabling scroll → peace-or-war → sons grid → Satek stare → Chunbok seal → empty benches. 2D cel. High contrast. One device. No readable text. No glow.',
		shots: [
			{ id: 'euija-coup-rock-wide', role: 'exposition', angle: 'wide lower-third', at: 'Ministers’ Assembly at Deer Rock' },
			{ id: 'euija-coup-speech-dutch', role: 'martial law', angle: 'dutch', at: 'I hereby declare emergency martial law' },
			{ id: 'euija-coup-trust-ecu', role: 'please trust me', angle: 'ECU', at: 'Please trust me.' },
			{ id: 'euija-coup-wet-ink', role: 'proclamation still wet', angle: 'intimate still life', at: 'The characters for “in one stroke” are still wet' },
			{ id: 'euija-coup-enabling-scroll', role: 'enabling law', angle: 'OTS scroll', at: 'Law to Remedy the Distress of the People and the Country' },
			{ id: 'euija-coup-peace-or-war', role: 'the choice', angle: "worm’s-eye", at: 'peace, or war' },
			{ id: 'euija-coup-sons-forty-one', role: 'forty-one sons', angle: "bird’s-eye stamp", at: 'of his own sons to the Assembly' },
			{ id: 'euija-coup-satek-stare', role: 'clan emptied', angle: 'OTS aisle', at: 'a law for emptying the Assembly' },
			{ id: 'euija-coup-chunbok-pm', role: 'Premier named', angle: 'intimate kneel', at: 'is named Premier (상좌평)' },
			{ id: 'euija-coup-empty-benches', role: 'aftermath', angle: 'iconic empty', at: 'The Enabling Law did not abolish the chair' }
		]
	},
	{
		id: 'seongchung-heungsu-rings',
		title: 'Seongchung & Heungsu — the ring and the passes',
		entryTitles: ['Descent', 'Heungsu'],
		place: 'Sabi hall and prison (pl_sabi_palace); Gomamiji posting; White River / Gibeolpo (pl_white_river); Tanhyeon switchback',
		why: 'The two jwapyeong who named Chimhyeon and Gibeolpo. Ring-pommels in the room: hall yank, prison post, posting door, mud, Yushin’s fish-ring on the pass they begged to hold.',
		canon: 'FACE ch_seongchung / ch_heungsu / ch_buyeo_euija / ch_gyebek / ch_kim_yushin. Baekje 환두대도 from sword_lotus; Yushin fish from sword_fish. Hex is REAL lamp/sun bounce on the hollow ring — #c9a24d, #b98f33, #d9b13a, #2A5FB8 — NOT a glow aura. Same Sabi timber; Gomamiji rammed earth; White River mud. Chronology: remonstrate → belt yanked → prison write → Gomamiji threshold → berth two-shot → courier → Euija yes → Tanhyeon already passed → Gibeolpo ring in mud → Yushin climb. 2D cel. High contrast. One device per still. No readable text.',
		shots: [
			{ id: 'seongchung-hall-remonstrate', role: 'remonstrance', angle: 'dutch mid-stride', at: 'Open court. Today.' },
			{ id: 'seongchung-ring-yank', role: 'belt taken', angle: 'ECU ring', at: 'the belt comes off in the aisle' },
			{ id: 'sungchung-prison', role: 'dying memorial', angle: 'dutch kneel', at: 'tries to stop him, but is thrown in prison' },
			{ id: 'heungsu-gomamiji-wide', role: 'exile posting', angle: 'wide threshold', at: 'Gomamiji is a posting, not a retirement' },
			{ id: 'heungsu-gyebek-listen', role: 'berth', angle: 'two-shot', at: 'Hold the White River mouth and the Tanhyeon pass' },
			{ id: 'heungsu-gyebek-rings', role: 'berth rings', angle: 'dutch two-shot', at: 'You… you truly mean to march?' },
			{ id: 'heungsu-messenger', role: 'courier', angle: 'OTS', at: 'The matter is urgent. What then.' },
			{ id: 'euija-yes-so', role: 'so it is', angle: "worm’s-eye empty", at: 'So it is.' },
			{ id: 'tanhyeon-already-passed', role: 'pass lost', angle: 'wide lower-third', at: 'already the White River and the Tanhyeon pass' },
			{ id: 'gibeolpo-ring-mud', role: 'river lost', angle: "bird’s-eye mud", at: 'Tang keels in the mud of Gibeolpo' },
			{ id: 'yushin-tanhyeon-fish-ring', role: 'Silla on the pass', angle: "worm’s-eye climb", at: 'Yushin is already on the switchback' }
		]
	},
	{
		id: 'heaven-earth-ink',
		title: 'Heaven–Earth King — ink',
		entryTitles: ['Heaven–Earth King'],
		place: 'Raw paper and black ink: the poor house, the scoundrel’s storehouse, the gourd vine, the edge of the sky.',
		why: 'The founding myth in full: two suns and two moons, the sand in the rice, the vine, the arrows, the riddles, the stolen flower, the scale that parts the living from the dead.',
		canon: 'STRIKING INK — saturated black masses against blinding bare paper, light is the unpainted paper, almost no mid-grey, one cinnabar or indigo wash at most. Faces from ch_heaven_earth_king, ch_big_star_young / ch_little_star_young (fifteen), ch_big_star / ch_little_star (grown). the Lady of Wisdom and Sumyung Jangja have no portrait: hands, backs, shadow. No text, no seal.',
		shots: [
			{ id: 'hek-ink-two-suns', role: 'two suns', angle: 'low wide', at: 'two suns and two moons. By day' },
			{ id: 'hek-ink-dream', role: 'the dream', angle: "worm’s-eye", at: 'one sun, one moon, swallowed whole' },
			{ id: 'hek-ink-jar', role: 'the empty jar', angle: 'foreground hands', at: 'a rice jar she does not open in front of guests' },
			{ id: 'hek-ink-measure', role: 'the scoundrel', angle: 'over-shoulder', at: 'He fills the measure himself' },
			{ id: 'hek-ink-sand', role: 'the sand', angle: 'ECU', at: 'Your rice has a bit of bite to it.' },
			{ id: 'hek-ink-fall', role: 'into hell', angle: "bird’s-eye", at: 'The floor of the ninth storehouse opens.' },
			{ id: 'hek-ink-comb', role: 'the tokens', angle: 'palm close', at: 'Two gourd seeds in her palm' },
			{ id: 'hek-ink-vine', role: 'the vine', angle: 'vertical', at: 'the vine has gone past the roof' },
			{ id: 'hek-ink-sun', role: 'the sun breaks', angle: "worm’s-eye full draw", at: 'breaks like a plate' },
			{ id: 'hek-ink-swap', role: 'the swap', angle: 'dutch night', at: 'counts his brother' },
			{ id: 'hek-ink-yield', role: 'he knows', angle: 'low two-shot', at: 'Your flower did well.' },
			{ id: 'hek-ink-scale', role: 'the weighing', angle: 'monumental', at: 'Then he hangs a scale from the sky.' },
			{ id: 'hek-ink-descent', role: 'down', angle: 'horizontal split', at: 'the light ones following him' }
		]
	},
	{
		id: 'kangrim-folk',
		title: 'Kangrim — folk painting',
		entryTitles: ['Kangrim'],
		place: 'Ochre paper. A round pond, a gate, a torn sheet, a slaughter-wall, a stream.',
		why: 'The real bonpuri in minhwa: a living man jumps, Death keeps the soul, a crow loses the order.',
		canon: 'KOREAN FOLK PAINTING (민화): flat, thick outline, mineral cinnabar, malachite, ochre, indigo. Not tenebrism, not webtoon. Faces from ch_kangrim, ch_yumla, ch_haewonmek. Unnamed people have no portrait faces. No text.',
		shots: [
			{ id: 'kr-folk-jump', role: 'the pond', angle: 'flat circle', at: 'he shut his eyes and jumped' },
			{ id: 'kr-folk-gate', role: 'the request', angle: 'frontal gate', at: 'stood up at the underworld gate' },
			{ id: 'kr-folk-split', role: 'body and soul', angle: 'torn sheet', at: 'So they split him.' },
			{ id: 'kr-folk-crow', role: 'the lost order', angle: 'margin story', at: 'trusted it to a crow' },
			{ id: 'kr-folk-charcoal', role: 'the seat', angle: 'stream band', at: 'washing charcoal' }
		]
	},
	{
		id: 'sulmun-heewon',
		title: 'Sulmun — the apron',
		entryTitles: ['Sulmun'],
		place: 'The sea before Tamla, then Halla and the oreum (pl_mount_halla).',
		why: 'She piles the island, spills the hills, slips into the cauldron, and stops one roll short of a bridge.',
		canon: 'HEEWON painterly. Enormous Sulmun from ch_sulmun — white jeogori, orange chima, cloud hair. Sea at her knee. #7f9c8b as real light on wet stone. No crowd of five hundred. No text.',
		shots: [
			{ id: 'sulmun-seq-scoop', role: 'Halla poured', angle: "worm’s-eye from the water", at: 'piles it in one place' },
			{ id: 'sulmun-seq-hills', role: 'the hole', angle: 'dutch stride', at: 'three hundred and sixty-eight' },
			{ id: 'sulmun-seq-cauldron', role: 'the slip', angle: 'low, the pot', at: 'slipped, and did not come out' },
			{ id: 'sulmun-seq-silk', role: 'ninety-nine', angle: 'lower third', at: 'The collar was never finished' }
		]
	},
	{
		id: 'princes-heewon',
		title: 'Three Princes — Samseonghyeol',
		entryTitles: ['Three Princes'],
		place: 'Three holes in Jeju basalt, Halla behind (pl_mount_halla), then the shore and a pond.',
		why: 'Go, Yang, and Bu rise, divide the island by arrow, and marry what the sea sends in a box.',
		canon: 'HEEWON painterly. Faces and garments from ch_yang_eulna, ch_go_eulna, ch_bu_eulna. Princesses seen from behind only — no invented faces. Same basalt ground every cut. No text.',
		shots: [
			{ id: 'princes-seq-rise', role: 'the hollow', angle: "worm’s-eye", at: 'three divine princes named' },
			{ id: 'princes-seq-arrows', role: 'the division', angle: "bird’s-eye", at: 'We divide the land. By arrow.' },
			{ id: 'princes-seq-box', role: 'the sea-box', angle: 'dutch shore', at: 'a messenger and three princesses' },
			{ id: 'princes-seq-pond', role: 'the marriages', angle: 'pond rim', at: 'They marry the three princesses at a pond.' }
		]
	},
	{
		id: 'sanbang-fresco',
		title: 'Sanbangduk — geometric vector',
		entryTitles: ['Stone Lady'],
		place: 'The cliff at Sanbang. One spring.',
		why: 'She comes out of the rock for a poor man, and the official sends her back into it. The retreat Gyebek is offered.',
		canon: 'GEOMETRIC VECTOR: flat hard-edged shapes, no gradients, no brush; the cliff is tessellated basalt hexagons; palette basalt black, deep sea-green, rust, cream, with her #8fb3a8 as the one accent. Face from ch_sanbangdeok, reduced to flat planes. The poor man and the official stay faceless shapes. No text.',
		shots: [
			{ id: 'sanbang-seq-out', role: 'she steps out', angle: 'relief in the cliff', at: 'who came down out of the rock' },
			{ id: 'sanbang-seq-hand', role: 'not stone', angle: 'hands', at: 'feel like stone' },
			{ id: 'sanbang-seq-return', role: 'she turns back', angle: 'mid-stride into rock', at: 'the official has the husband killed' },
			{ id: 'sanbang-seq-spring', role: 'only the spring', angle: 'empty cliff', at: 'The spring inside it has not stopped' }
		]
	},
	{
		id: 'balhae-winter',
		title: 'Balhae — the winter walk north',
		entryTitles: ['Balhae'],
		place: 'Manchurian mountains the winter after Pyongyang falls: snowfield, ridge, a crack-cave; memory cuts to a burned Mohe doorway and Pyongyang’s north wall.',
		why: 'The last story in the chronicle needs the cold to be the set: the walk, the cave, the gold, the memory of Yeon, then the boy says the words and the coal goes out.',
		canon: 'Snow outside in granulated watercolour, cave inside as a tenebrist old-master canvas lit by one small fire. Gulgul #8b3a3a, Joyoung #c45a4a, the crown-branch gold the one bright accent. Memory cuts colder and desaturated; Gesomun before 642 carries one sword. Exactly two people in every frame.',
		shots: [
			{ id: 'balhae-snow-ridge', role: 'exposition', angle: 'high wide', at: 'the mountains of Manchuria do not care who won' },
			{ id: 'balhae-snow-tracks', role: 'in his tracks', angle: 'worm’s-eye from the snow', at: 'His son walks in his tracks' },
			{ id: 'balhae-smoke-behind', role: 'looking back', angle: 'over-shoulder ridge', at: 'Behind them is the smoke' },
			{ id: 'balhae-feet', role: 'the drift', angle: 'dutch blizzard', at: 'I can’t feel my feet' },
			{ id: 'balhae-cave-mouth', role: 'shelter', angle: 'reverse from inside the cave', at: 'The cave is a crack in the mountain' },
			{ id: 'balhae-gold-seam', role: 'the shine', angle: 'low firelight three-quarter', at: 'small gold shine through a split seam' },
			{ id: 'balhae-crown-branch', role: 'the crown piece', angle: 'ECU palm', at: 'On his palm lies the gold branch' },
			{ id: 'balhae-fb-doorway', role: 'memory: the doorway', angle: 'low wide', at: 'A doorway with no house behind it' },
			{ id: 'balhae-fb-gloves', role: 'memory: the gloves', angle: 'low two-shot', at: 'pulls off his gloves' },
			{ id: 'balhae-fb-wall', role: 'memory: the catchphrase', angle: 'low behind on the wall', at: 'the river frozen white below' },
			{ id: 'balhae-coals-turn', role: 'back to the cave', angle: 'coal-light medium', at: 'The fire has sunk to coals' },
			{ id: 'balhae-joyoung-vow', role: 'the words', angle: 'worm’s-eye from the coals', at: 'Goguryeo never dies…!' },
			{ id: 'balhae-last-coal', role: 'cut to black', angle: 'near-black insert', at: 'The last coal goes out' }
		]
	}
];

export function sequenceOfSlot(slotId: string): MovieSequence | undefined {
	return MOVIE_SEQUENCES.find((s) => s.shots.some((sh) => sh.id === slotId));
}
