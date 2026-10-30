// Death and birth stills: a body scene, a burial mound and the black reaper frame for each major death;
// a few visceral close-ups; a white frame for each birth. Writes the image slots into story.json and builds
// one reference sheet per still.
// Usage: node scripts/.cache/death-stills.mjs            → slots + sheets, prints ids
//        node scripts/.cache/death-stills.mjs --only <regex> → only the matching slots
//        node scripts/.cache/death-stills.mjs --prompt id → prints that still's GenerateImage description
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const HOUSE =
	'HEEWON STYLE: Korean webtoon figures with bold tapered ink contours and drawn faces, painted into a watercolor-and-oil world; old-master tenebrist canvas for night and interiors. Movie tenebrism: 75% of the frame in deep painted shadow, one hard practical key raking the subject, crushed blacks, long shadows, three depth planes with bokeh. FULL-BLEED 2:1 movie frame composed for a 2:1 letterbox crop, nothing important at the top or bottom edge. Not photoreal, not a 3D render. No text, no lettering, no watermark.';
const SWORD =
	'Any sword is the ancient straight Korean ring-pommel dao of the attached sw_bidam board: small iron ring pommel at the butt, short grip, thin metal band, NO hand guard of any kind, perfectly STRAIGHT narrow blade.';
const REAPERS =
	'long flowing silk ribbons in black, deep blue and vermilion, with thin white gat-string cords among them';
const SILLA_CROWN =
	'The Silla gold crown is the open museum crown: a narrow flat gold band, three flat sheet-gold tree uprights whose straight branches turn up at right angles in stacked tiers like 出 with bud tips, two shorter antler uprights at the back, hung with small round gold spangles and pale-green jade gogok, leaf-chain pendants; never a solid basket, a battlement or horns.';
const SAMSIN_SMOKE =
	'whimsical Korean folk-painting cloud smoke in Samsin pink #e8b4c8, with paler blush and a touch of soft gold: minhwa cloud scrolls with ruyi-headed curls, spiralling puffs and playful looping tails, like the clouds on an old Korean folk screen';

/** id → { entry, at, alt, refs, scene } */
const STILLS = [];
const add = (s) => STILLS.push(s);

/** The black frame (parallel "death-black"): every major death in one layout, the body alone on black, the reapers' ribbons circling in. */
function reaperFrame(person, entry, at, face, body, palette = REAPERS) {
	const sword = /sword|blade/.test(body);
	const crown = /Silla gold crown|crown on/.test(body) ? ` ${SILLA_CROWN}` : '';
	add({
		id: `${person}-reaper-black`,
		parallel: 'death-black',
		entry,
		at,
		alt: `${body.split(',')[0]} alone on black, the reapers’ ribbons circling in from the edges`,
		refs: [...(face ? [face] : []), ...(sword ? ['sw_bidam.png'] : []), ...(crown ? ['research/silla-cheonmachong-gold-crown.jpg'] : [])],
		scene: `FINAL FRAME, one of a universal set: every death in the chronicle is painted in this exact layout. A pure ALL-BLACK void: no floor, no room, no sky, no ground, no bier. Camera straight down from directly above. Dead centre, lying horizontally across the middle third of the frame, head to the LEFT and feet to the RIGHT: ${body}.${crown}${sword ? ' ' + SWORD : ''} ${face ? 'FACE from the attached portrait, ' : ''}eyes closed, still. One cold soft key from directly above lights only the body and falls off into black. The grim reapers’ RIBBONS: ${palette} stream in from all four edges of the frame and curl in loose spirals around the body like a slow whirlpool, their ends fluttering and dissolving into ink smoke, never touching the body. NO reaper figures, no gat hats, no hands, no faces, nobody but the dead. Most of the frame is pure black. Silent, monumental, funereal.`
	});
}
function tomb(person, entry, at, mound) {
	add({
		id: `${person}-tomb`,
		entry,
		at,
		alt: `The burial mound — ${mound.split('.')[0]}`,
		refs: [],
		scene: `A THREE KINGDOMS ERA BURIAL MOUND, dramatic and tenebrist, not a postcard. ${mound} No people except where stated. Romanticist layout: the tomb on the thirds, half the frame sky, one cloud-break or lamp as the only key, long raking shadow across the grass.`
	});
}
function body(person, entry, at, face, scene, sword = false) {
	add({ id: `${person}-death-body`, entry, at, alt: scene.split('.')[0], refs: sword ? [face, 'sw_bidam.png'] : [face], scene: `${scene}${sword ? ' ' + SWORD : ''}` });
}
function close(id, entry, at, refs, scene) {
	add({ id, entry, at, alt: scene.split('.')[0], refs, scene: `${scene} ${refs.includes('sw_bidam.png') ? SWORD : ''}` });
}
/** The white frame (parallel "birth-white"): every major birth in one layout, the baby alone on white, Samsin's smoke curling in. */
function birth(id, entry, at, scene) {
	add({
		id,
		parallel: 'birth-white',
		entry,
		at,
		alt: `${scene.split(',')[0]} alone on white, Samsin’s pink smoke curling in from the edges`,
		refs: [],
		scene: `BIRTH FRAME, one of a universal set: every birth in the chronicle is painted in this exact layout. A pure ALL-WHITE void of bare paper: no floor, no room, no bed, no mat. Camera straight down from directly above. Dead centre, small in the middle of the frame, head toward the TOP: ${scene}. Soft warm light, a faint cool-grey shadow under the baby only. SAMSIN’S SMOKE: ${SAMSIN_SMOKE}, drifts in from all four edges of the frame and curls around the baby in a loose ring, never touching it. No goddess, no hands, no mother, no people, nobody but the baby. Most of the frame is bare white paper. Tender, playful, monumental.`
	});
}

// ——— Gotaso and Pumsuk, Daeya ———
body('gotaso', 'Siege of Daeya', 'It doesn’t hurt the way she thought', 'ch_gotaso.png',
	'Gotaso lies on the dark floorboards of the Daeya residence room in her silk hanbok, one hand open toward the lattice, eyes half closed; a dark pool of blood spreading slowly out from under her ribs across the boards, the smoke hanging still. Low worm’s-eye from the floor, an oil saucer lamp in the foreground, her face large and pale in its raking light; behind her, out of focus, Pumsuk’s knees and the fox-ring parade sword hanging from his hand.', true);
close('gotaso-blood-close', 'Siege of Daeya', 'It is fast. It is the one thing he does well all night.', ['ch_gotaso.png', 'sw_bidam.png'],
	'EXTREME CLOSE-UP, dutch angle: Gotaso’s hands pressed over the wound under her ribs, bright red blood welling between her fingers and running down the silk of her jeogori; her face above, eyes wide on her husband, lips parted. The straight blade withdrawn at the edge of frame, red to the band. Lamp from below, everything else black.');
body('pumsuk', 'Siege of Daeya', 'For him it isn’t like missing a step', 'ch_pumsuk.png',
	'Pumsuk, the young True Bone lord in his purple sleeve, slumped dead on his knees on the same floorboards beside his wife’s body, forehead nearly touching the boards, the fox-ring blade fallen from his hand; his blood and hers running together into one dark pool that mirrors the lamp. Bird’s-eye, straight down: the two bodies and the one pool, the lamp in one corner.', true);
reaperFrame('gotaso', 'Siege of Daeya', 'Lady Gotaso, daughter of Kim Chunchu', 'ch_gotaso.png', 'Gotaso laid on her back in her silk hanbok, hands folded over the dark stain under her ribs');
reaperFrame('pumsuk', 'Siege of Daeya', 'Kim Pumsuk, True Bone, Guardian', 'ch_pumsuk.png', 'Pumsuk laid on his back in his purple court robe, the fox-ring blade on his chest');
tomb('gotaso', 'Siege of Daeya', 'and made the second wing much bigger', 'Two small earthen mounds side by side under a broken wall at Daeya fortress, raw new turf, a single small folded paper bird left on the nearer mound. Night after the fall: the fortress gate behind still smouldering red, black smoke across a moonless sky, ember light raking the two mounds.');
tomb('pumsuk', 'Siege of Daeya', 'tonight he walks behind her', 'The same two mounds at Daeya seen from behind the second, lower one, Pumsuk’s, set a step behind hers, a purple silk cord tied to a stake at its foot; pre-dawn, ash falling like snow, one grey cloud-break.');

// ——— Muryuk and Seohyun ———
body('muryuk', 'Seohyun', 'Nobody has called him Highness in sixty years', 'ch_kim_muryuk.png',
	'Old Muryuk dead on a low bed in a Silla county house, his tall Gaya conical helm set on the floor beside the bed, one gnarled hand still curled as if around a baby’s finger. Low three-quarter angle from the floor, one lamp by the helm raking across his white beard and the helm’s rivets; his son’s shoulder dark in the foreground.');
reaperFrame('muryuk', 'Seohyun', 'Kim Muryuk, the last prince of Gaya', 'ch_kim_muryuk.png', 'old Muryuk laid on his back, his tall conical Gaya helm resting on his chest');
tomb('muryuk', 'Seohyun', 'and kept looking back at a door that was shut', 'GAYA TUMULI: a long ridge crest lined with a row of great round earthen mounds, Gaya-style, the newest and smallest at the end of the line, facing back toward the lost south. Dusk storm, one low gold shaft through the clouds lighting only the newest mound.');
body('seohyeon', 'Jeon (轉)', 'Seohyun looks at his son, still bent over the bed', 'ch_kim_seohyun.png',
	'Old Seohyun dead on his bed in the dark, mouth slightly open, a riding whip on the blanket by his hand; his son Yushin, a big bearded marshal, bent over him with his ear at the still mouth, face hidden. Worm’s-eye from the floor beside the bed, a lamp on the floor raking both, their shadows climbing the wall.');
reaperFrame('seohyeon', 'Jeon (轉)', 'Kim Seohyun, a Gaya boy on a Silla horse', 'ch_kim_seohyun.png', 'old Seohyun laid on his back, a riding whip across his chest');
tomb('seohyeon', 'Jeon (轉)', 'and he ran with a king’s niece and never asked why', 'A great round Silla earthen tumulus on a grassy plain near Surabol; a single saddled riderless horse grazing at its foot. Night, clouds racing across a full moon, moonlight raking the grass in silver waves.');

// ——— Bidam and Sunduk ———
body('bidam', 'Gyul (結)', 'Kangrim reads his name three times where the body', 'ch_bidam.png',
	'Bidam, clean-shaven, fallen on his back in the trampled mud between the camps, 108 dark prayer beads scattered from his broken wrist cord, blood soaking his navy robe from a deep cut across the chest; his black-maned horse standing over him, head low. Worm’s-eye from the mud, torches as bokeh, one torch raking his face.', true);
close('bidam-blood-close', 'Gyul (結)', 'Bisamun comes through the lines without a rider', ['ch_bidam.png'],
	'CLOSE-UP from ground level: Bidam’s outflung hand in the mud, the snapped bead cord, dark beads rolling into a rivulet of blood; behind, out of focus, his face turned toward the lens, eyes open and empty. Navy specular on the wet beads, one torch.');
reaperFrame('bidam', 'Gyul (結)', 'Bidam of the Son house, High Councillor', 'ch_bidam.png', 'Bidam laid on his back in his navy robe, prayer beads loosely in his folded hands');
tomb('bidam', 'Gyul (結)', 'and tied on the black band, and stood there too long', 'A small unmarked earthen mound outside a fortress wall, no stone, a black headband tied to a bare tree beside it, the horse’s hoofprints leading away north. Storm dusk, a falling star streaking across the sky as the one bright mark.');
body('sunduk', 'Gyul (結)', 'Kangrim reads her name three times — Dukman', 'ch_sunduk_old.png',
	'Queen Sunduk dead on her bed under silk hangings, the gold crown removed and set beside her pillow, her face serene, hands folded. Low angle from the floor beside one tall candle, the crown’s gold jade pendants catching it, the hangings falling into black.');
reaperFrame('sunduk', 'Gyul (結)', 'Queen Sunduk, the first queen of Silla', 'ch_sunduk_old.png', 'Queen Sunduk laid in state in her royal robes, the Silla gold crown resting on her breast');
tomb('sunduk', 'Gyul (結)', 'and heard frogs in the winter, and knew who was nigh', 'Queen Sunduk’s tomb: a round earthen mound ringed by low stones on the sunny southern slope of Mount Nang among dark pines. Pre-dawn, the stars still out over the hill, one pale shaft of first light on the mound.');

// ——— Jinduk, Talhae ———
body('jinduk', 'King Muyeol', 'Sacred Bone ends on your breath', 'ch_jinduk.png',
	'Queen Jinduk dead upright on a lacquered chair in an empty audience hall, crown on, hands on the arms of the chair, eyes closed; a half-finished embroidery frame on the floor at her feet. Long low shot down the dark hall axis, one lamp beside the chair.');
reaperFrame('jinduk', 'King Muyeol', 'Queen Jinduk, the last of the Sacred Bone', 'ch_jinduk.png', 'Queen Jinduk laid in state, an embroidered silk scroll folded on her breast');
tomb('jinduk', 'King Muyeol', 'and kept the old blood, though alone', 'A round Silla royal tumulus ringed with carved stone panels, alone on a dark plain, the last of a line of older mounds receding behind it into fog. Night, a single cloud-break of moonlight on the newest mound.');
add({ id: 'talhae-death-body', entry: 'Alji', at: 'He came in a box with a magpie’s loud cry', alt: 'Talhae’s huge bones laid out in an opened grave', refs: [], style: 'ink', scene: 'JOSEON SUMI INK myth frame: a giant old king’s skeleton laid out in an opened earth grave, far taller than the two tiny diggers measuring it with a rope; huge black ink masses against bare paper, a single magpie on the grave’s rim, one translucent gold wash on the measuring rope. FULL-BLEED, no paper margin.' });
reaperFrame('talhae', 'Alji', 'Suk Talhae, who came in a box', null, 'a huge broad-faced old king in a fisherman’s plain robe laid on his back, a magpie feather on his chest');
tomb('talhae', 'Alji', 'and won a lord’s house with a smith’s little quiz', 'King Talhae’s tomb: a round earthen mound at the foot of Mount Toham among old pines, a smith’s whetstone and lumps of charcoal at its foot. Night sea-fog rolling in from the east, a magpie on a branch against a moon in haze.');

// ——— Sunchung, Gyebek ———
body('seongchung', 'Descent', 'You chose the cell over silence', 'ch_seongchung.png',
	'Sunchung dead in a stone prison cell, gaunt, slumped against the wall, a brush still in his fingers and a folded letter on the straw beside an empty rice bowl. A single shaft of moonlight from a barred slit window lands on the letter and his hollow face; the rest black.');
reaperFrame('seongchung', 'Descent', 'Sunchung, councillor of Baekje', 'ch_seongchung.png', 'gaunt Sunchung laid on his back in a plain prisoner’s robe, a brush in his folded hands');
tomb('seongchung', 'Descent', 'and wrote: hold the pass, keep their ships off the strand', 'A small low Baekje earthen mound on a hillside above a river bend, a plain stone in front; below, the river glints toward the sea. Storm dusk, rain sweeping across, one gold break on the river mouth.');
body('gyebek', 'Yellow Mountain', 'Gyebek turns his head toward the river road', 'ch_gyebek.png',
	'Gyebek, clean-shaven, in grey steel lamellar with yellow cloth at the collar, dead on his back on the trampled dust of the Yellow Mountain field, three arrows in his chest, blood darkening the yellow cloth and the dust, his sword still in a reverse grip in his hand; his black horse standing over him, head lowered to his face. Worm’s-eye from the dust beside his head, a storm sky with one golden shaft, broken banners in haze.', true);
close('gyebek-blood-close', 'Yellow Mountain', 'Kangrim, who has been hanging in the day like unfinished weather', ['ch_gyebek.png', 'sw_bidam.png'],
	'EXTREME CLOSE-UP, hard dutch angle: Gyebek’s clean-shaven face in the dust, blood running from the corner of his mouth and from a cut at the temple, eyes still open and steady; his gauntleted hand beside it still clenching the ring-pommel sword reverse-grip, the blade back along the forearm, red to the band. Dust motes in one gold shaft.');
reaperFrame('gyebek', 'Yellow Mountain', 'Gyebek, general of Baekje', 'ch_gyebek.png', 'Gyebek laid on his back in grey steel lamellar with yellow cloth at the collar, his ring-pommel sword laid along his body');
tomb('gyebek', 'Yellow Mountain', 'four times they held, and the fifth was in vain', 'Gyebek’s tomb: a modest round Baekje earthen mound on a low hill above the wide Yellow Mountain plain, a plain yellow banner rag tied to a spear stuck at its foot. Storm dusk, a black horse silhouetted on the ridge beyond, one golden cloud-break raking the plain.');

// ——— Euija, Chunchu, Gesomun ———
body('euija', 'Buyeo Euija†', 'They called you the Zengzi of the East', 'ch_buyeo_euija.png',
	'King Euija dead in a bare grey room in Chang’an, a captive, lying on a thin mat in a plain white robe, no crown, beard grown wild, one hand stretched toward the east. Low angle from the floor beside one guttering lamp, a Tang lattice window throwing cold blue moonlight bars across him.');
reaperFrame('euija', 'Buyeo Euija†', 'Buyeo Euija, the last king of Baekje', 'ch_buyeo_euija.png', 'King Euija laid on his back in a plain white captive’s robe, no crown');
tomb('euija', 'Buyeo Euija†', 'took forty-odd forts, and woke up from the dream', 'A lonely foreign earthen mound on the bare Beimang hills far west of home, among rows of Chinese mounds, the only one turned east. Winter dusk, grey snow blowing, one low cold sun breaking under the clouds on the east side of the mound.');
body('chunchu', 'Kim Chunchu†', 'This is a fever. Heaven does not make house calls', 'ch_muyeol.png',
	'King Muyeol (Chunchu) dead in his royal bed, the gold crown on a stand beside him, magenta silk coverlet, his face drawn by fever; his old wife’s hand resting on his. Worm’s-eye from the floor beside a brazier, its red light raking his face and the crown.');
reaperFrame('chunchu', 'Kim Chunchu†', 'Kim Chunchu, King Muyeol of Silla', 'ch_muyeol.png', 'King Muyeol laid in state in his royal robe, the Silla gold crown on his breast');
tomb('chunchu', 'Kim Chunchu†', 'and spent all his cleverness setting it right', 'King Muyeol’s tomb: a great round Silla earthen tumulus, and before it a huge stone turtle bearing a carved stele (no legible writing), the turtle’s head raised. Night storm, lightning-edged clouds, one lamp of moonlight on the turtle’s head.');
body('gesomun', 'Yeon Gesomun†', 'Then he dies in his sleep, sitting up', 'ch_yeon_gesomun.png',
	'Yeon Gesomun dead sitting up in his great chair, massive, arms on the armrests, chin on his chest, five crow-ring swords leaning against the wall behind him; a cup tipped over at his boot. Low three-quarter angle from the floor beside a brazier, red light up his beard, his shadow huge on the wall.');
reaperFrame('gesomun', 'Yeon Gesomun†', 'Yeon Gesomun, Supreme Commander', 'ch_yeon_gesomun.png', 'Yeon Gesomun laid on his back in charcoal and red armour, arms folded over five crow-ring swords',
	'long flowing silk ribbons in King Yumla’s deep violet #7c3aed and black, with the reapers’ black, deep blue and vermilion ribbons and thin white gat-string cords among them');
tomb('gesomun', 'Yeon Gesomun†', 'he cursed them in words we can’t sing', 'A GOGURYEO STEPPED STONE TOMB: a squat pyramid of huge cut granite blocks in seven steps, a dark doorway near the top, on a plain near Pyongyang. Night, red clouds lit from below by distant fires, one crow on the top step.');

// ——— Yushin, Munmu ———
body('yushin', 'Kim Yushin†', 'One hundred and eight draws, one win that ended a friend', 'ch_kim_yushin_old.png',
	'Old Kim Yushin dead on his bed, white-bearded, his marshal’s blue robe, a sheathed ring-pommel sword laid beside him; through the open door behind, a woman standing by a well under a single bright star in the east. Low angle from the floor beside a lamp.', true);
reaperFrame('yushin', 'Kim Yushin†', 'Kim Yushin, Marshal of Silla', 'ch_kim_yushin_old.png', 'old Kim Yushin laid on his back in his blue marshal’s robe, his ring-pommel sword along his body');
tomb('yushin', 'Kim Yushin†', 'a grandson of Gaya who made Silla true', 'Kim Yushin’s tomb: a round Silla earthen mound on a hill among pines, its base ringed with carved stone panels of the twelve zodiac guardians and a low stone railing. Night, one bright star in the east the only light besides a cold moon shaft on the zodiac stones.');
body('munmu', 'The King for All', 'Sixteen years of war, one hill', 'ch_munmu.png',
	'King Munmu dead in state on a bier on the shore at dawn, in royal robes, crown on, attendants’ torches around him dissolving into bokeh; the grey sea behind. Low angle from the wet sand.');
reaperFrame('munmu', 'The King for All', 'King Munmu of Silla, the King for All', 'ch_munmu.png', 'King Munmu laid on his back in his crimson royal robe, hands folded over the Silla gold crown on his breast, drops of sea-water beading on the silk like dragon scales');
tomb('munmu', 'The King for All', 'a dragon in the tide, as he asked it to be', 'KING MUNMU’S UNDERWATER TOMB (Daewangam): a cluster of black sea rocks a hundred paces off a beach, the tide surging white through a cross-shaped channel to a flat stone at the centre. Storm pre-dawn, one gold break on the horizon behind the rocks, the faint shape of a sea-dragon in the foam.');

// ——— Yongsu and Chunmyung ———
reaperFrame('yongsu', 'Royal Secretariat', '…Who is Bihyung?', 'ch_yongsu.png', 'old Kim Yongsu laid on his back in his plain court silk, his long loose grey hair spread out, a lotus cup in his folded hands');
reaperFrame('chunmyung', 'Royal Secretariat', 'Don’t you dare go on ahead of me.', 'ch_chunmyung.png', 'old Princess Chunmyung laid on her back in her court hanbok, one hand open at her side as if reaching for another hand');

// ——— Births ———
birth('chunchu-birth-white', 'Yongsu', 'Spring comes early. Chunmyung labours all', 'a newborn baby boy swaddled in white with a fold of magenta #D8258C silk at his chin, eyes already open and watching');
birth('bupmin-birth-white', 'Munhee', 'Samsin comes the way she always comes', 'a newborn baby boy swaddled in white with a crimson #C41E3A cord at the wrist, fists clenched, kicking free of the cloth');
birth('gotaso-birth-white', 'Pumsuk', 'the girl-child arriving, pink silk', 'a newborn baby girl swaddled in pink silk, mouth open mid-babble, one tiny hand reaching up');
birth('gudung-birth-white', 'Suro', 'the lamp is still lit when the boy arrives', 'a newborn baby boy swaddled in white with a fold of royal purple #8B5CF6 silk, a small clay lamp still burning beside him');
birth('seohyeon-birth-white', 'Muryuk', 'The birth takes all night', 'a newborn baby boy swaddled in plain undyed white cloth, tiny fists out, crying, lying on a soldier’s folded lamellar coat');
birth('yushin-birth-white', 'Seohyun', 'The boy is born in the county house at Manno', 'a newborn baby boy on white swaddling cloth, turned on his side, seven small dark birthmarks in the shape of the Big Dipper on his back');
birth('namseng-birth-white', 'High Summit', 'So the first heir arrives under Samsin', 'a newborn baby boy swaddled in white with a thin red cord at the wrist, mouth open in his first cry');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = Object.values(story).flatMap((ch) => ch.entries ?? []);
const WHITE_HOUSE =
	'Korean webtoon figure with clean ink line and a drawn face, soft watercolor washes on bare white paper. High-key: the whole frame white paper, crisp cool-grey shadows only. FULL-BLEED 2:1 movie frame composed for a 2:1 letterbox crop. Not photoreal. No text, no lettering, no watermark.';
const BLACK_HOUSE =
	'Korean webtoon figure with bold tapered ink contours and a drawn face, painted in watercolor-and-oil, old-master tenebrist canvas. FULL-BLEED 2:1 movie frame composed for a 2:1 letterbox crop, nothing important at the top or bottom edge. Not photoreal, not a 3D render. No text, no lettering, no watermark.';
const house = (s) =>
	s.style === 'ink'
		? ''
		: s.id.endsWith('-white')
			? WHITE_HOUSE + ' '
			: s.parallel === 'death-black'
				? BLACK_HOUSE + ' '
				: HOUSE.slice(HOUSE.indexOf('.') + 2) + ' ';
const describe = (s) =>
	`HEEWON STYLE (the art style name only; never write it in the picture): ${house(s)}${s.scene}${s.refs.some((r) => r.startsWith('ch_')) ? ' FACE and garments from the attached sheet.' : ''}`;

if (process.argv[2] === '--prompt') {
	const s = STILLS.find((x) => x.id === process.argv[3]);
	console.log(describe(s));
	process.exit(0);
}

const norm = (t) => t.replace(/<[^>]+>/g, '').toLowerCase();
const blockText = (b) =>
	norm([b.html, b.ko, b.caption, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ')) + ' ' + (b.blocks ?? []).map(blockText).join(' ');
const out = [];
const only = process.argv[2] === '--only' ? new RegExp(process.argv[3]) : null;
for (const s of STILLS.filter((x) => !only || only.test(x.id))) {
	const e = entries.find((x) => x.title === s.entry);
	if (!e) throw new Error(`no entry ${s.entry}`);
	if (!e.blocks.some((b) => blockText(b).includes(s.at.toLowerCase()))) throw new Error(`${s.id}: anchor not found: ${s.at}`);
	e.images ??= [];
	const slot = { id: s.id, ratio: 2, at: s.at, alt: s.alt, prompt: describe(s), refs: s.refs.map((r) => `/${r}`) };
	if (s.style) slot.style = s.style;
	if (s.parallel) slot.parallel = s.parallel;
	const i = e.images.findIndex((im) => im.id === s.id);
	if (i >= 0) e.images[i] = { ...e.images[i], ...slot };
	else e.images.push(slot);
	if (s.parallel === 'birth-white') delete e.images[i >= 0 ? i : e.images.length - 1].people;
	if (s.refs.length) execFileSync('node', ['scripts/small-refs.mjs', s.id, ...s.refs.map((r) => `static/${r}`)], { stdio: 'ignore' });
	out.push(`${s.id}${s.refs.length ? ' [sheet]' : ''}`);
}
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(out.length, 'slots\n' + out.join('\n'));
