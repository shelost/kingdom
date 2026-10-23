// Wiki relationship boards: one dark manhwa two-shot per bond (the bidam-defiance look), written to static/rel_*.jpg.
//   node scripts/.cache/rel-tenebrist.mjs <rel-id>      → bust refs sheet + prompt file for GenerateImage
//   node scripts/.cache/rel-tenebrist.mjs --list        → every id and its board path (kept boards marked)
//   node scripts/.cache/rel-tenebrist.mjs --install ids → assets/rel_*.jpg → centre-cropped 2:1 static/rel_*.jpg
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { HOUSE_RATIO, cropArgs, imageSize } from '../crop-ratio.mjs';

const OUT = 'scripts/.cache/rel-tenebrist';
export const ASSETS = `${process.env.HOME}/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets`;

const COUNT = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

function open(n, shot) {
	return `HEEWON STYLE — a premium KOREAN WEBTOON / MANHWA splash illustration of a ${n > 2 ? 'group' : 'relationship'}, lit with cinematic tenebrism. A 2:1 movie frame composed for a 2:1 letterbox crop (nothing important at the top or bottom edge). ${shot ?? 'MEDIUM CLOSE TWO-SHOT, waist-up, both faces large.'} DRAW IT EXACTLY IN THE STYLE OF THE ATTACHED CHARACTER SHEET: the same clean confident black ink linework, the same manhwa face design (eye shape, brows, nose, jaw, hairline and hair). It must read as an INKED DRAWING: visible line strokes everywhere \u2014 bold tapered contour lines around every figure, drawn fold lines in the silk and armour, hair drawn as inked strands, a little cross-hatching and line shading in the shadows \u2014 then flat cel-shading in two or three tones per colour, no airbrushed gradients. Each face must be recognisably the character drawn on the sheet, wearing the same clothes. NOT realistic, NOT an oil painting, NOT photoreal, NOT painterly, NOT a 3D render, no skin pores or photographic texture. ONLY THESE ${COUNT[n] ?? n} PEOPLE in the frame.`;
}

const TAIL = `LIGHT AND BACKGROUND (dark manhwa tenebrism, like a dramatic manhwa splash page): a MINIMAL MONOTONE background \u2014 one flat dark field in a single hue (the characters' colour deepened almost to black), at most a few soft wisps of smoke in that same hue; no set, no architecture, no landscape, no furniture, no props beyond what the characters hold or sit on; ONE hard directional light from the side or below carves the faces and silk in high contrast, the far side of each figure falling off into black shadow, a thin edge of the same light along the silhouettes; deep inky blacks, crisp highlights, strong cast shadows across the faces. Each person's colour is the colour of the light and the shadow-tint on them \u2014 never a glow aura or halo. BLOCKING, BODY LANGUAGE AND FACIAL EXPRESSIONS show the relationship at a glance. Faces and clothes from the sheet; new poses, never the sheet's stance. One of each person, never cloned. No text, no lettering, no speech bubbles, no panel borders, no watermark.`;

/** Groups sit deeper in the dark than pairs: most of the frame is black, each figure carved out only by a narrow key in their own colour. */
const GROUP_TAIL = `LIGHT AND BACKGROUND (deep manhwa tenebrism, darker than a normal splash page): about TWO-THIRDS OF THE FRAME IS PURE INK-BLACK. No set, no architecture or floor beyond what the scene names, no props beyond what the characters hold. Each figure is pulled out of the black by ONE hard, narrow key light from the side or from below in THAT PERSON'S OWN COLOUR, catching only a cheekbone, an eye, the bridge of the nose, the edge of a sleeve, a plate of armour or a hand; the rest of each figure falls off into solid black shadow and merges with the background, so neighbouring figures are separated only by their coloured edge light. MOSTLY IN DARKNESS: each figure is about TWO-THIRDS BLACK SILHOUETTE; only the side of the face, shoulder, hands and robe edge turned toward that person's own light show colour and detail, the rest merges into the black. SPLIT LIGHTING ON EVERY FIGURE: the lit side of each face and body in that person's colour, the other half PURE BLACK; no even front light, no fill light, no evenly lit robes — even white silk falls to black on its shadow side. Faces readable but half in shadow, eyes catching the light (ordinary eyes — no light streaks or glow across the eyes). At most a few thin wisps of smoke tinted by those coloured lights. Deep inky blacks, crisp highlights, hard cast shadows. Each person's colour is the colour of the light on them \u2014 never a glow aura, halo or outline glow. BLOCKING, BODY LANGUAGE AND FACIAL EXPRESSIONS show who they are to each other at a glance. Faces and clothes from the sheet; new poses, never the sheet's stance. One of each person, never cloned. No text, no lettering, no speech bubbles, no panel borders, no watermark.`;

/** The guardian squads: silhouettes, with only their colour on the rims. */
const ENCASED = `ALMOST ENTIRELY ENCASED IN DARKNESS: every guardian is a BLACK SILHOUETTE with NO fill light at all; the only visible parts are a hard rim of light in his own colour along his helmet or hair, one cheekbone, the shoulder plates and the weapon, and his eyes. Those accent colours are the ONLY colour in the frame; everything else is black.`;

export const RING_SWORD = `Any sword is the ancient straight Korean ring-pommel dao: a small iron ring pommel, a short wrapped grip, a thin metal band and NO hand guard, a perfectly straight blade — never a katana, never a tsuba.`;

/**
 * people: canon ids in sheet order (LEFT → RIGHT); refs: portrait override (ch_* only reach the sheet);
 * keep: the board is final, never regenerated.
 */
const BONDS = {
	'rel-yushin-sunduk': {
		year: 641,
		people: ['yushin', 'sunduk'],
		scene: `A LOVE THAT CANNOT BE. Queen Sunduk, crowned in Silla gold, faces the camera, composed and regal, chin level, eyes forward and quietly sad. Yushin stands just behind her shoulder, a head taller, half in shadow, NOT facing the camera: he looks down at her with open, aching longing. His raised hand hovers in the air beside her shoulder and DOES NOT TOUCH HER — a clear gap of black air between his fingers and her robe. Her face is fully lit from her side; he is lit only along his cheekbone. Ordinary dark eyes, nothing glowing, no light streaks on the face. No sword in frame.`
	},
	'rel-chunchu-munhee': {
		year: 625,
		people: ['chunchu', 'munhee'],
		keep: true,
		scene: ''
	},
	'rel-gotaso-pumsuk': {
		year: 641,
		people: ['gotaso', 'pumsuk'],
		scene: `YOUNG NEWLYWEDS, COMPLETELY IN LOVE. Gotaso hugs Pumsuk's arm with both arms, cheek against his shoulder, beaming at the camera, utterly happy. Pumsuk, a handsome young hwarang, looks down at her with a shy smitten smile, ears red, his free hand covering both of hers. A warm lantern key from below; pink and sky-blue tint in the smoke.`
	},
	'rel-munmu-jayi': {
		year: 644,
		people: ['munmu', 'jayi'],
		scene: `THE HAPPY, EQUAL ROMANCE. Side by side at a low desk over an open ledger. Jahee, sharp and elegant, taps a figure with her brush, one eyebrow raised, glancing sideways at him. Bupmin leans his chin on his fist and grins at her instead of the ledger, helplessly delighted. A lamp on the desk lights both faces from below. No legible writing.`
	},
	'rel-pumsuk-gumilwife': {
		year: 642,
		people: ['pumsuk', 'gumilwife'],
		scene: `THE OLDER WOMAN WHO KNOWS WHAT HE WANTS. Maehwa, older, unhurried, sultry, leans in close and pours wine into Pumsuk's cup, holding his eyes, a slow knowing half-smile. Pumsuk sits frozen with the cup held out, flushed, eyes wide, unable to look away. The wine is spilling over the rim and neither looks down. One low lamp.`
	},
	'rel-jumong-sosuno': {
		year: -38,
		people: ['jumong', 'sosuno'],
		scene: `THE LAID-BACK CHARMER AND THE HOT-BLOODED TSUNDERE. Sosuno stands with her arms crossed, scowling sideways at him, blushing to the ears. Jumong, CLEAN-SHAVEN (no moustache, no beard), leans lazily on her shoulder with his elbow, an easy grin, winking at the camera. Hearth light from below.`
	},
	'rel-xue-liu': {
		year: 644,
		people: ['xuerengui', 'xueliu'],
		scene: `THE WIFE WHO SENT HIM TO GREATNESS. Lady Liu, small and fierce, straightens the collar of Xue Rengui's white war-coat with both hands, looking up at him with a proud, firm face. Xue, huge, bends down to let her, gazing at her with soft devoted eyes. Tang dress, not hanbok. A lamp at the side.`
	},
	'rel-chunchu-euija': {
		year: 655,
		people: ['chunchu', 'euija'],
		scene: `TWO KINGS, SWORN ENEMIES. They stand BACK TO BACK, shoulders almost touching, both facing outward toward the camera. Chunchu, crowned in Silla gold, cold, half-lidded, a thin calculating smile. Euija, bearded, in the Baekje king's black cap with twin gold flame ornaments, smirking, eyes sliding sideways toward the man behind him. A magenta key from the left on Chunchu, an amber key from the right on Euija; the seam between their backs is black.`
	},
	'rel-gesomun-chunchu': {
		year: 642,
		people: ['gesomun', 'chunchu'],
		scene: `MENACING HOSPITALITY. Yeon Gesomun, massive and bearded, throws one heavy arm over Chunchu's shoulders and laughs loudly, his face looming close, a host who could crush his guest. Chunchu, slim and elegant, stands straight under the arm with a calm, polite diplomat's smile, eyes calculating, utterly unbothered. Red torchlight on Yeon, magenta on Chunchu. ${RING_SWORD}`
	},
	'rel-yushin-bidam': {
		year: 630,
		people: ['yushin', 'bidam'],
		refs: ['/ch_kim_yushin_hwarang.png', '/ch_bidam_hwarang.png'],
		scene: `ETERNAL FRIENDS AND RIVALS. Two young beardless hwarang stand back to back, plain wooden practice swords resting on their shoulders, both grinning at the camera — Yushin with a stern, tight-jawed grin, Bidam laughing openly with a string of dark prayer beads round his wrist. Blue light on Yushin, violet and navy shadow on Bidam.`
	},
	'rel-sunduk-bidam': {
		year: 647,
		people: ['sunduk', 'bidam'],
		scene: `THE QUEEN AND THE MINISTER WHO WANTS HER THRONE. Queen Sunduk, older, sits on her throne facing the camera, composed, eyes forward, a faint knowing smile. Bidam stands at her shoulder, CLEAN-SHAVEN, leaning down to murmur in her ear, prayer beads in his fingers, smiling, eyes cold and ambitious. She knows; he knows she knows. Warm lamp on her, navy shadow on him.`
	},
	'rel-yushin-gyebek': {
		year: 660,
		people: ['yushin', 'gyebek'],
		refs: ['/ch_kim_yushin.png', '/ch_gyebek.png'],
		scene: `ENEMY GENERALS WHO RESPECT EACH OTHER. They face each other in profile across the frame, faces a stride apart, locked in a long silent stare of total respect, arms at their sides. Yushin on the left, Gyebek on the right, CLEAN-SHAVEN. Cool blue light from the left side rakes across Yushin's face; warm gold light from the right side rakes across Gyebek's face; a dark seam of drifting smoke between them. No props, no objects floating in the air, no weapons in frame.`
	},
	'rel-chunchu-yushin': {
		year: 659,
		people: ['chunchu', 'yushin'],
		scene: `THE KING AND HIS MARSHAL — politics and the sword, one direction. King Chunchu sits facing the camera, crowned in Silla gold, fingers steepled, a sly strategist's half-smile. Yushin, the marshal, bearded, in blue silk, stands right behind his shoulder with one big hand resting on the king's shoulder, grave and certain, also facing the camera.`
	},
	'rel-euija-gyebek': {
		year: 655,
		people: ['euija', 'gyebek'],
		scene: `THE KING AND HIS LOYAL GUARD. King Euija sits on his throne facing the camera, broad and bearded, in the Baekje king's black cap with twin gold flame ornaments and a crimson robe, sprawled royally, a wine cup in one hand, a big confident grin. Gyebek stands just beside and slightly behind the throne, also facing the camera, CLEAN-SHAVEN, stern and still, one hand resting on the ring-pommel hilt of his sheathed sword — the loyal guard. Brazier light from below. ${RING_SWORD}`
	},
	'rel-taizong-xuerengui': {
		year: 645,
		people: ['taizong', 'xuerengui'],
		scene: `THE EMPEROR AND HIS CHAMPION. Emperor Taizong sits in imperial yellow facing the camera, a proud predator's smile, one hand resting on the shoulder of Xue Rengui, who stands at his side in gleaming white armour and a white war-coat, a halberd upright in his fist, chest out, eager loyal pride, also facing the camera. Torchlight from the side.`
	},
	'rel-gesomun-bojang': {
		year: 642,
		people: ['gesomun', 'bojang'],
		scene: `PUPPET KING, REAL POWER. King Bojang, a grown man with a thin moustache and small goatee, sits on the throne facing the camera, rigid, hands gripping his knees, a frozen polite smile, eyes darting sideways. Yeon Gesomun looms behind the throne, much bigger, one heavy hand on the king's shoulder, grinning down at the camera; sword hilts fanned over his own shoulders. Brazier light from below. ${RING_SWORD}`
	},
	'rel-taizong-gaozong': {
		year: 649,
		people: ['taizong', 'gaozong'],
		scene: `THE STERN, WORRIED FATHER AND THE SON TRYING TO FILL HIS SHOES. Emperor Taizong sits on the throne in imperial yellow facing the camera, stern, a worried furrow, not looking at his son. His son Li Zhi stands a step behind the throne, shoulders slightly hunched, hands clasped nervously, eyebrows raised and anxious, glancing sideways at his father, hoping for approval. Lamp light from below.`
	},
	'rel-kingmu-euija': {
		year: 632,
		people: ['kingmu', 'euija'],
		refs: ['/ch_mu.png', '/ch_euija_young.png'],
		scene: `THE AGEING FATHER AND THE CYNICAL SON. ONE continuous image, not a split panel. Old King Mu sits on his single throne, turned toward his son, lecturing earnestly, one finger raised. Prince Euija stands right beside the throne, leaning his elbow on its armrest, NOT looking at his father: he looks at the camera and rolls his eyes, a crooked, bored half-smile. Brazier light from below.`
	},
	'rel-chunchu-gotaso': {
		year: 641,
		people: ['chunchu', 'gotaso'],
		scene: `A FATHER'S LOVE. Gotaso, his young daughter, smiles brightly at the camera. Chunchu stands at her side, one hand resting gently on her head, looking down at her with soft, loving, fatherly eyes and a warm, tender smile. A warm lamp lights both faces; magenta and pink tint in the smoke.`
	},
	'rel-sunduk-chunmyung': {
		year: 632,
		people: ['sunduk', 'chunmyung'],
		refs: ['/ch_sunduk.png', '/ch_chunmyung.png'],
		scene: `ONE SISTER TOOK THE THRONE, THE OTHER TOOK LOVE. Sunduk, crowned in Silla gold, faces the camera, composed and solemn. Her elder sister Chunmyung embraces her from behind with her cheek against Sunduk's hair, a warm protective smile with a flicker of sadness. Lamp light from below.`
	},
	'rel-ibiga-jeonggyeon': {
		year: 1,
		people: ['ibiga', 'jeonggyeon'],
		keep: true,
		scene: ''
	},
	'rel-suro-heo': {
		year: 48,
		people: ['suro', 'heohwangok'],
		scene: `THE KING WHO CANNOT LOOK POLITELY. Queen Heo, newly arrived from across the sea, faces the camera, serene, luminous and foreign, chin lifted, a small amused knowing smile, red sail-cloth falling behind her shoulder. King Suro stands close at her side, turned toward her, NOT looking at the camera: he stares at her completely smitten, lips parted, flushed, one hand half-raised and stopped in mid-air as if he does not dare touch her. Warm torchlight from below on her; red tint from the sails in the smoke.`
	},
	'rel-seohyeon-yushin': {
		year: 629,
		people: ['seohyeon', 'yushin'],
		refs: ['/ch_kim_seohyun.png', '/ch_kim_yushin_hwarang.png'],
		scene: `THE FATHER WHO NEVER PRAISES. General Seohyun stands facing the camera, arms folded, stern, eyes fixed ahead, ignoring his son. Young Yushin, a head shorter, stands at his shoulder a step behind, his face turned up toward his father's, eyes wide and hopeful, waiting for one word of praise. No drawn swords. Torchlight from the side, rain streaks in the dark.`
	},
	'rel-haemosu-yuhwa': {
		year: -59,
		people: ['haemosu', 'yuhwa'],
		scene: `THE SUN WHO STOPPED ONCE \u2014 heat, by charge not exposure. Yuhwa leans back against Haemosu's bare chest, her white silk jeogori slipping off both shoulders, wet loose hair, head tipped back onto his shoulder, heavy-lidded inviting half-smile at the camera, flushed. Haemosu's gold-trimmed robe hangs open; his arms wrap her waist from behind, his face close to her neck, eyes on her, hungry, a god undone. Warm gold key on him, pale river-blue on her; the field behind is deep blue-black.`
	},
	'rel-gesomun-gulgul': {
		year: 650,
		people: ['gesomun', 'gulgul'],
		scene: `THE FOSTER FATHER AND THE MOHE BOY HE KEPT. Yeon, massive and bearded, grips the back of Gulgul's neck with one big hand and pulls their foreheads almost together, a gruff, rare softness on his face. Gulgul, quiet and steady, a bow case on his back, head lowered, eyes lifted to Yeon, loyal. Red light on Yeon, cold snow-blue on Gulgul, a few snowflakes in the dark. Only the ring-pommel hilts of Yeon's swords show over his shoulder. ${RING_SWORD}`
	},
	'rel-hwanung-ungnyeo': {
		year: -2333,
		people: ['hwanung', 'ungnyeo'],
		scene: `SHE MOVES FIRST. Ungnyeo, wild loose hair, a dark bear-fur mantle slipping off one bare shoulder, grabs the front of Hwanung's robe in both fists and pulls him down toward her, fierce and certain, lips parted. Hwanung, the son of heaven, caught bending toward her, his serene face cracking into surprise and want. Pale moonlight from above; the field behind is deep forest green-black.`
	},
	'rel-jumong-yuhwa': {
		year: -40,
		people: ['jumong', 'yuhwa'],
		scene: `MOTHER AND SON \u2014 a blessing, not a romance. Jumong, CLEAN-SHAVEN (no moustache, no beard), kneels on one knee, head bowed. His mother Yuhwa, a mature motherly woman, her robe closed and modest with both shoulders covered, stands over him with one hand resting on the crown of his head in blessing and the other pressing a small cloth bundle of grain seeds to his chest, eyes closed, proud and grieving. He looks up under her hand with a brave crooked grin and wet eyes. Red lamp light on him, pale river-blue on her.`
	},
	'rel-onjo-sosuno': {
		year: -20,
		people: ['sosuno', 'onjo'],
		scene: `THE MOTHER WHO WALKED SOUTH. Sosuno, regal and fierce, flings one arm out pointing past the camera to the south, chin up, commanding. Her son Onjo, a young man not yet a king (no crown, a plain topknot), stands at her shoulder and turns to look where she points, jaw set, half believing her, one hand on the strap of his bow. Low dusty-gold light raking across both faces; the field behind is deep umber.`
	},
	'rel-chunchu-munmu': {
		year: 650,
		people: ['chunchu', 'munmu'],
		scene: `A LOVING FATHER AND HIS OPTIMISTIC, HEROIC SON. Chunchu stands behind his son with one arm around his shoulders, his other hand pointing ahead past the camera at a future only he can see; he watches the boy, not the horizon, fond and a little sad. Bupmin, a young hwarang exactly as on the sheet (red headband, beardless, no crown, not yet king), leans forward grinning at what his father shows him, fist clenched, sure it already belongs to him. Magenta light on Chunchu, crimson on Bupmin.`
	},
	'rel-yushin-munmu': {
		year: 642,
		people: ['yushin', 'munmu'],
		refs: ['/ch_kim_yushin.png', '/ch_bupmin_hwarang.png'],
		scene: `THE STRICT UNCLE AND HIS APPRENTICE NEPHEW. Bupmin, a beardless teenage hwarang exactly as on the sheet (red headband, no crown, not yet king), is at full draw with a Korean horn bow, arm trembling, teeth gritted, sweat on his brow. Yushin stands right behind him, pushing the boy's bow elbow up with two fingers, the other hand firm on his shoulder, stern, eyes on the unseen target. Blue light on Yushin, crimson on Bupmin. His sword stays sheathed at his hip. ${RING_SWORD}`
	},
	'rel-gesomun-yeongnyu': {
		year: 642,
		people: ['gesomun', 'yeongnyu'],
		scene: `THE KING AND THE NEPHEW WHO WILL KILL HIM. King Youngryu sits rigid on his throne facing the camera, gripping the armrests, pale but defiant, refusing to look away. Yeon leans down close beside him, one hand on the back of the throne, a cold smile at his ear; in his other hand a drawn sword rests flat across the king's knees. No blood. Brazier-red light from below on both faces. ${RING_SWORD}`
	},
	'rel-daebyeol-sobyeol': {
		year: -3000,
		people: ['daebyeol', 'sobyeol'],
		scene: `TWIN BROTHERS AND THE FLOWER WAGER. Big Star dozes sitting cross-legged, arms folded, head nodding, a clay pot with a tall silver-white flower in full bloom before his knees. Little Star crouches at his side mid-swap: one hand lifting the blooming pot away, the other sliding his own pot with a withered drooping flower into its place, a finger to his lips, grinning slyly at the camera. Cool blue light on Big Star, warm red on Little Star.`
	},
	'rel-seohyeon-manmyung': {
		year: 594,
		people: ['seohyeon', 'manmyung'],
		scene: `THE ROYAL GIRL WHO DECIDED FIRST. Manmyung strides toward the camera through the rain, unhurried, chin up, a small satisfied smile, towing Seohyun behind her by the hand. Seohyun, young and CLEAN-SHAVEN, soaked, flustered, mouth open, completely outmatched. Orange firelight from behind them (a burning gate, off-frame) and white rain streaks; lilac on her, blue on him.`
	},
	'rel-sunduk-jinduk': {
		year: 645,
		people: ['sunduk', 'jinduk'],
		scene: `TWO QUEENS, ONE HOUSE. Queen Sunduk, crowned, exhausted after a day of war councils, leans her head on Sungman's shoulder, eyes closed, a tired private smile. Sungman sits bolt upright, stern, staring straight ahead, but her hand is folded tight over her sister's. A low lamp from below; vermilion on Sunduk, violet on Sungman.`
	},
	'grp-brafounders': {
		year: 660,
		people: ['boksin', 'dochim', 'sangji', 'sateksangya', 'pung'],
		shot: 'FULL-FIGURE GROUP SHOT, all five full-length, every face readable, low worm\u2019s-eye angle.',
		scene: `THE BAEKJE RESTORATION ARMY'S FIVE CAPTAINS STRIKE A FLAMBOYANT, SYNCHRONISED TEAM POSE like a vintage anime special-forces squad roll call \u2014 each a different eccentric, theatrical, self-important pose, all showing off to the camera, staggered in a V. Boksin centre, one fist thrust at the lens, roaring; Dochim crouched on one knee, staff planted, one palm raised in a mudra, serene smile; Sangji half-turned, glaring over his shoulder, spear angled across; Sangya leaning back on one leg with both arms flung wide like wings; Prince Pung highest at the back, hand on hip, pointing at the sky, a little too eager, holding the pole of a torn plain yellow banner with NO writing. Comic pride. No swords drawn. Field behind: deep yellow-umber.`
	},
	'grp-fourdragons': {
		year: 645,
		people: ['taizong', 'lishiji'],
		cast: 5,
		shot: 'GROUP SHOT of five from a low three-quarter angle, a compass layout, the emperor high at the centre.',
		scene: `THE FOUR DRAGONS: THE SECOND EMPEROR'S FOUR GENERALS AS GUARDIANS OF THE FOUR CARDINAL DIRECTIONS. ALL FIVE ARE HUMAN MEN: the dragon names are nicknames, NOT animals, no beast heads, no fur faces; all five must be visible. Emperor Taizong stands high at the exact centre on a stepped dais that is invisible in the black; only his face, his crown and a few folds of his imperial yellow robe catch one thin overhead shaft of gold light; the rest of his robe falls into black. A proud predator's stare. Around him at the four compass points, each kneeling on one knee and facing outward like a guardian: NORTH (standing directly behind the emperor's shoulder, his face visible beside the emperor's, clearly a FIFTH figure, so the frame holds the emperor plus FOUR generals) the BLACK DRAGON, a lean scholar-minister with a long face and thin beard in black court robes, lit ONLY by a cold silver-grey rim along his face and shoulders; SOUTH (nearest the camera) the RED DRAGON, a Turkic prince with braided hair and a fur-trimmed cloak over steel lamellar, lit ONLY by a hard crimson rim; EAST (right) the BLUE DRAGON Li Shiji from the sheet, lit ONLY by a hard cobalt-blue rim; WEST (left) the WHITE DRAGON, a human Tiele steppe chieftain, broad-faced, a man with braided black hair and a white felt cloak, lit ONLY by a hard bone-white rim. ${ENCASED} Swords sheathed. ${RING_SWORD}`
	},
	'grp-fourbeasts': {
		year: 661,
		people: ['gaozong', 'xuerengui', 'sudingfang', 'lishiji', 'liurengui'],
		shot: 'GROUP SHOT of five from a low three-quarter angle, a compass layout, the emperor high at the centre.',
		scene: `THE FOUR BEASTS: THE THIRD EMPEROR'S FOUR GENERALS AS GUARDIANS OF THE FOUR CARDINAL DIRECTIONS. Emperor Gaozong stands high at the exact centre on a round stepped dais that is invisible in the black, one hand half-raised, gentle and a little uneasy; only his face and the folds of his imperial yellow robe are lit, by one thin overhead shaft of pale gold light. Around him at the four compass points, each standing in a guardian pose facing outward: WEST (left) the WHITE TIGER Xue Rengui, a fangtian ji halberd upright (NOT a sword), lit ONLY by a hard bone-white rim; SOUTH (nearest the camera) the RED FOWL Su Dingfang, old and white-bearded, lit ONLY by a hard vermilion rim; EAST (right) the BLUE DRAGON Li Shiji, lit ONLY by a hard cobalt-blue rim; NORTH (behind and above the dais) the BLACK TORTOISE Liu Rengui, a calm scholar-general, lit ONLY by a cold ink-teal rim. ${ENCASED} Swords sheathed. ${RING_SWORD}`
	},
	'grp-caverngoddesses': {
		year: 629,
		people: ['narim', 'golhwa', 'hyulle'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE THREE GODDESS SISTERS OF THE STEAM CAVERN, waist-deep in black water, in their house silk (white jeogori, chima in each one's colour), wet hair, their hair ornaments as on the sheet. Narim, the eldest, centre and a step back, composed and watchful, lit from below by green leaf-light (#3d9e52); Golhwa, the youngest, on the left, leaning forward toward the camera with a wicked, confident grin, a hard ember-orange key (#e86820) raking her face; Hyullé, the quiet one, on the right, half turned away, eyes lowered, knees together, a shy small smile, cyan water-light (#2eb8c4) rippling across her cheek. Steam drifting through the black, a few ember motes and floating leaves. Ordinary living eyes, nothing glowing.`
	},
	'grp-eternalhwarang': {
		year: 645,
		people: ['yushin', 'alchun', 'bidam'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THREE OLD CLASSMATES, HWARANG CLASS 51, now middle-aged. Yushin in the centre, stern, arms folded, a hard blue key (#2A5FB8) from the left; Alchun on the left, broad and amused, a cup in his hand, warm amber light from below; Bidam on the right, CLEAN-SHAVEN, prayer beads looped on his sword wrist, a sharp sideways smile, cold violet edge light with a navy (#141C2E) specular on the beads. Shoulder to shoulder, but Bidam stands half a step apart, a black seam between him and the other two: the rift already there. Swords sheathed. ${RING_SWORD}`
	},
	'grp-gayakims': {
		year: 629,
		people: ['muryuk', 'seohyeon', 'yushin'],
		shot: 'THREE FIGURES STACKED IN DEPTH, each waist-up, the nearest largest.',
		scene: `THREE GENERATIONS OF THE GAYA LINE, one behind the other. Furthest back, the grandfather Muryuk, old, in a tall Gaya conical helm, almost lost in the dark, a faint purple edge light (#8B5CF6) on the helm and one cheek, gazing at his son's back. In the middle, the father Seohyun, grey-streaked, stern but quietly proud, a plum key on his face, gazing at his own son's back. In front, the son Yushin, a young beardless hwarang with his crescent-moon headband, facing the camera, jaw set, a hard blue key (#2A5FB8) from the side. Each looks only at the one ahead of him; none look at each other. ${RING_SWORD}`
	},
	'grp-sacredbones': {
		year: 632,
		people: ['sunduk', 'jinduk', 'chunmyung'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE LAST THREE SACRED BONE WOMEN. Dukman in the centre, newly crowned in Silla gold, chin up, eyes lifted as if counting stars; Sungman on the left, arms folded, stern; Chunmyung on the right, the elder sister, gentle, one hand on Dukman's shoulder, a warm sad smile. One candle low in front lights all three from below; vermilion on Dukman, violet on Sungman, soft rose on Chunmyung, black above their heads.`
	},
	'grp-realmgods': {
		year: 1,
		people: ['daebyeol', 'sara', 'sobyeol'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE THREE REALM GODS, keepers of the dead, the western flower field and the living. Big Star on the left, sober and stern, a cool blue key (#3B6FBF); Little Star on the right, a sly crooked grin, a warm red key (#C94040); between them and a step back, Hallakgungi, the gardener god, holding a small pot with one pale flower in full bloom, the soft green light (#8FBF8A) of the flower lighting his face from below. Otherworld: a flat black void, a few pale petals drifting.`
	},
	'grp-grimreapers': {
		year: 647,
		people: ['kangrim', 'haewonmek'],
		shot: 'WAIST-UP TWO-SHOT, both faces large, under their hat brims.',
		scene: `THE TWO GRIM REAPERS OF THE LIVING WORLD. Kangrim holds an open ledger, reading a name, calm and courteous, almost kind; Haewonmek beside him, impatient, arms folded, glancing at the camera as if it is your turn. Cold pale moonlight from above; their faces mostly shadowed under the brims, only their eyes and the ledger page catching the light. No legible writing.`
	},
	'grp-fiveprinces': {
		year: 655,
		people: ['yung', 'tae', 'hyo', 'yun', 'pung'],
		shot: 'WAIST-UP GROUP SHOT of five in a staggered row, faces readable.',
		scene: `THE FIVE PRINCES OF BAEKJE, a family that cannot stand itself, each in his own pool of amber-gold light with black between them, five islands of light. Yung, the demoted eldest, bitter, eyes down; Tae, self-crowned, smug, chin up, a hand on his sword hilt; Hyo, the chosen crown prince, nervous, glancing sideways at Tae; Yun, the quiet fourth, half lost in the dark, watching all of them; Pung, the youngest, at the edge, already half turned away toward a distant ship's lantern. Swords sheathed. ${RING_SWORD}`
	},
	'grp-fivecommanders': {
		year: 641,
		people: ['gesomun', 'westcmd', 'southcmd', 'northcmd', 'gusesa'],
		shot: 'LOW ANGLE across a dark table, five men waist-up around it.',
		scene: `THE FIVE COMMANDERS OF GOGURYEO AT THE HIGH SUMMIT. The High Commander Gusesa sits at the far centre, mild, fingers steepled, his sword lying flat beside his teacup; the West, South and North commanders flank him, each with a ring-pommel sword at his hip, arguing; Yeon Gesomun sits at the near edge with his back half to the camera, one sword only, silent, looking at their swords with a cold smile. One low brazier on the table lights every face from below in red (#C30000); deep black above. ${RING_SWORD}`
	},
	'grp-threefounders': {
		year: -20,
		people: ['hyukgose', 'jumong', 'onjo'],
		shot: 'THREE FIGURES, each waist-up in his own shaft of light, standing apart.',
		scene: `THE THREE FOUNDERS, kings of three kingdoms who never stood together, each in his own vertical shaft of light with black between them, looking in three different directions. Hyukgose of Silla on the left, serene, a white-gold light from above; Jumong of Goguryeo in the centre, a horn bow in his hand, an easy grin, a red key (#e8563f); Onjo of Baekje on the right, young and determined, a dusty-gold light.`
	},
	'grp-greatwomen': {
		year: 1,
		people: ['alyoung', 'sosuno', 'heohwangok'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE THREE WOMEN AT THE ROOT OF THREE KINGDOMS, shoulder to shoulder, each lit from her own side. Alyoung of Silla on the left, calm and wise, a pale dawn light; Sosuno in the centre, fierce, arms folded, a dusty-gold key (#e8a04a); Queen Heo of Gaya on the right, serene and foreign, red sail-cloth over one shoulder, a red key.`
	},
	'grp-traitors': {
		year: 657,
		people: ['gumil', 'chunbok', 'namseng', 'shinsung', 'sateksangya'],
		shot: 'WAIST-UP GROUP SHOT of five, staggered in depth before a gate.',
		scene: `THE TRAITORS: EVERY KINGDOM FELL THROUGH A DOOR OPENED FROM INSIDE. A tall heavy timber gate seen from INSIDE, its bar lifted, one sliver of cold light through the gap between the leaves cutting a vertical seam down the black. Five men stand in the dark before it, each half-lit by that seam and nothing else, none looking at another: the grain clerk Gumil with a torch lowered; Satek Chunbok bowing with a fawning smile, a letter half hidden in his sleeve; Yeon Namseng in Goguryeo armour, face turned away in shame; the monk Shinsung, palms pressed together, eyes open and calculating; Satek Sangya with his empty hands held open.`
	},
	'grp-defectors': {
		year: 668,
		people: ['muryuk', 'namsan'],
		cast: 5,
		shot: 'WAIST-UP GROUP SHOT of five, two in front, three behind.',
		scene: `THE DEFECTORS: MEN WHO LAID DOWN THEIR ARMS AND TOOK THE OTHER COUNTRY'S RANK. In front, each offering his sword hilt-first toward the camera: the Gaya prince Muryuk, head bowed, his conical helm under his other arm; and Yeon Namsan, a Goguryeo noble, kneeling, eyes lifted. Behind them, three more men in pure black silhouette, only their outstretched sword hilts catching the light. One cold light from above. ${RING_SWORD}`
	},
	'rel-gesomun-namseng': {
		year: 650,
		people: ['gesomun', 'namseng'],
		scene: `THE STRICT FATHER AND THE HEIR. Yeon sits, massive and bearded, a sheathed sword across his knees, staring past his son at the brazier, giving nothing. Namseng, sixteen, kneels formally before him, back rigid, reciting, his eyes lifted to his father's face hoping for one word of approval. Red brazier light on Yeon from below; a colder edge light on Namseng. ${RING_SWORD}`
	},
	'rel-namseng-namgun': {
		year: 652,
		people: ['namseng', 'namgun'],
		scene: `BROTHERS: LOYALTY AND RIVALRY. Namgun, the younger, fierce and grinning, hooks his arm round Namseng's neck in a headlock and pulls him down; Namseng, the composed elder heir, a scroll still in his hand, half-annoyed and half-smiling despite himself. One lamp low between them; red on Namgun, a cooler red-grey on Namseng. No weapons drawn.`
	},
	'rel-euija-gesomun': {
		year: 642,
		people: ['euija', 'gesomun'],
		scene: `TWO HUGE PERSONALITIES SIZING EACH OTHER UP. King Euija, bearded, in the Baekje king's black cap with twin gold flame ornaments, raises a wine cup with a broad grin; Yeon, massive, leans across the low table toward him with a loud laugh and a predator's eyes, his own cup held back. Two hard keys: amber on Euija, red on Yeon; a black seam between them.`
	},
	'rel-yushin-munhee': {
		year: 632,
		people: ['yushin', 'munhee'],
		scene: `THE SISTER WHO IS NOT AFRAID OF THE MARSHAL. Munhee, sharp and lovely, jabs one finger into her big brother's chest, scolding him, eyebrows raised; Yushin, the bearded marshal everyone fears, takes it with a sheepish half-smile, eyes sliding away. Warm lamp light; blue on Yushin, rose on Munhee.`
	},
	'rel-euija-ungo': {
		year: 657,
		people: ['euija', 'ungo'],
		scene: `THE KING AND THE QUEEN WHO RULES BEHIND THE SCREEN. King Euija sprawls on his throne, flushed with wine, cup tipping in his hand, eyes half-closed. Queen Ungo stands just behind him, composed and cold, one hand resting on his shoulder, looking straight at the camera. Amber lamp on him; a thin cold violet edge on her.`
	},
	'rel-gesomun-yangmanchun': {
		year: 645,
		people: ['gesomun', 'yangmanchun'],
		scene: `THE TYRANT AND THE TOWN CHIEF WHO WILL NOT BOW. Yeon looms face to face with the Guardian of Ansi, glaring down, his hand on a sword hilt. The Guardian, smaller, a weathered town chief exactly as on the sheet, does not flinch; a small dry smile. Red torchlight on Yeon, dusty gold on the Guardian. ${RING_SWORD}`
	},
	'rel-heungsu-gyebek': {
		year: 659,
		people: ['heungsu', 'gyebek'],
		scene: `THE OLD EXILE AND THE GENERAL. Heungsu, an old councillor in plain exile robes, crouches drawing a map in the dirt with a stick, talking quietly; Gyebek, CLEAN-SHAVEN, crouches beside him, studying the lines, stern and silent. A single lantern on the ground between them lights both faces from below. ${RING_SWORD}`
	},
	'rel-sunduk-chunchu': {
		year: 640,
		people: ['sunduk', 'chunchu'],
		scene: `THE QUEEN AND HER CLEVEREST NEPHEW. Queen Sunduk sits crowned in Silla gold, amused, eyes forward; Chunchu kneels at her shoulder and murmurs a plan into her ear behind his sleeve, a sly smile. She already knows. Vermilion lamp light on her, magenta on him.`
	},
	'cln-yeon': {
		year: 650,
		people: ['gesomun', 'gusesa', 'namseng'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE YEON HOUSE OF GOGURYEO: salt, iron and crow-stamped blades. Yeon in the centre, massive, standing; the old High Commander Gusesa on the left, mild and watchful, a hand in his sleeve; young Namseng on the right, the heir, straight-backed. Behind them on the black wall, ring-pommel swords hang in a row, each ring stamped with a three-legged crow. Red brazier light from below on all three. ${RING_SWORD}`
	},
	'cln-gyeongju-kim': {
		year: 650,
		people: ['chunchu', 'sunduk', 'munmu'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE KIM HOUSE OF SURABOL, THE CAPITAL CLAN THAT WEARS PURPLE. Queen Sunduk in the centre, crowned in Silla gold, serene; Chunchu on the left in purple silk, sly half-smile; young Bupmin on the right, a hwarang, eager. A single candle-lit purple glow; deep black around them.`
	},
	'cln-surabol-choi': {
		year: 645,
		people: ['alchun'],
		cast: 3,
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE CHOI HOUSE OF SURABOL, the old courtesy. Alchun in the centre, broad and amused, holding a cup; two old elders of his house beside him in pure silhouette, only their beards and sleeves edged in warm amber lamplight.`
	},
	'cln-surabol-son': {
		year: 647,
		people: ['bidam', 'sukwon'],
		shot: 'WAIST-UP TWO-SHOT, both faces large.',
		scene: `THE SON HOUSE OF SURABOL, the oldest pride. Bidam, CLEAN-SHAVEN, prayer beads on his wrist, a cold smile; beside him Sukwon, exactly as on the sheet. Behind them a black hall with one hanging lantern; navy (#141C2E) specular on the beads and silk.`
	},
	'cln-geumgwan-kim': {
		year: 629,
		people: ['suro', 'muryuk', 'yushin'],
		shot: 'THREE FIGURES STACKED IN DEPTH, each waist-up, the nearest largest.',
		scene: `THE GAYA KIM HOUSE: the last princely blood of Gaya inside Silla. Furthest back, faint as a memory, the founder King Suro in his crown; in the middle, Muryuk in his tall Gaya conical helm; in front, young Yushin, jaw set. Purple (#8B5CF6) edge light on the ancestors, blue (#2A5FB8) on Yushin. ${RING_SWORD}`
	},
	'cln-buyeo': {
		year: 641,
		people: ['kingmu', 'euija', 'onjo'],
		shot: 'THREE FIGURES STACKED IN DEPTH, each waist-up, the nearest largest.',
		scene: `THE BUYEO HOUSE, BAEKJE'S ROYAL SURNAME. Furthest back, faint as a memory, the founder Onjo; in the middle, old King Mu; in front, Euija, broad and bearded, grinning at the camera with a wine cup. Amber-gold light falling from above, each generation dimmer than the one before.`
	},
	'cln-satek': {
		year: 650,
		people: ['queensatek', 'eldersatek', 'chunbok'],
		shot: 'WAIST-UP GROUP SHOT of three, faces large, staggered in depth.',
		scene: `THE SATEK HOUSE OF BAEKJE: the Queen's sleeve and the Prime Minister's chair. The Satek queen in the centre, composed and calculating; the old Satek elder on the left, leaning on a staff; Satek Chunbok on the right, bowing slightly with a fawning smile, a letter half hidden in his sleeve. Cold gold lamplight from one side; black hall behind.`
	},
	'cln-yunbi': {
		year: 632,
		people: ['elderyunbi', 'yunbihana'],
		shot: 'WAIST-UP TWO-SHOT, both faces large.',
		scene: `THE YUNBI HOUSE OF BAEKJE: harbour arithmetic. The old Yunbi elder, shrewd, a counting rod in his fingers; beside him Yunbi Hana, exactly as on the sheet. Behind them the black night of a harbour, a single ship's lantern reflected in water, sea-blue light on both faces.`
	},
	'cln-gwishil': {
		year: 660,
		people: ['boksin'],
		cast: 4,
		shot: 'WAIST-UP GROUP SHOT, one man in front, three silhouettes behind.',
		scene: `THE GWISHIL HOUSE: not court furniture but the muscle of the restoration. Gwishil Boksin in front, armoured, roaring defiance; behind him three soldiers in pure black silhouette holding a torn plain yellow banner with no writing. Torchlight from below, smoke. ${RING_SWORD}`
	},
	'cln-go': {
		year: 642,
		people: ['jumong', 'yeongnyu', 'bojang'],
		shot: 'THREE FIGURES STACKED IN DEPTH, each waist-up, the nearest largest.',
		scene: `THE GO HOUSE, GOGURYEO'S ROYAL SURNAME. Furthest back, faint as a memory, the archer-founder Jumong with his bow; in the middle, King Youngryu in his crown, tired; in front, King Bojang, a puppet king with a frozen polite smile. Red light growing fainter with each generation.`
	},
	'grp-sillaroyal': {
		year: 630,
		people: ['sunduk', 'jinduk', 'chunmyung', 'chunchu', 'munhee', 'munmu'],
		cast: 9,
		shot: 'FORMAL FAMILY PORTRAIT, everyone facing the camera, faces readable, eye-level.',
		scene: `THE SILLA ROYAL FAMILY \u2014 A BIG FAMILY PHOTO. In the centre, seated: OLD KING JINPYUNG (not on the sheet: a tired old man with a long white beard, kind heavy-lidded eyes, the tall Silla gold crown with tree-and-antler uprights and jade pendants, crimson robe). Around him, from the sheet: Princess Dukman standing at his right shoulder, chin up, eyes drifting upward as if counting stars; Princess Sungman at his left shoulder, arms folded, stern; Princess Chunmyung seated on the step beside him, gentle, with her husband KIM YONGSU (not on the sheet: a middle-aged noble with a thin moustache, purple robe, small black feather cap) standing behind her with a hand on her shoulder; their son Chunchu at the right edge, one eyebrow raised, sly half-smile; his young wife Munhee beside him holding a three-year-old girl, Gotaso, who waves at the camera; and the little boy Bupmin in front, fidgeting and tugging the king's sleeve. A warm family charge: a stifled laugh, a rolled eye, a proud grandfather. Field behind: flat deep red-black.`
	}
};

function boardPath(id) {
	const [, kind, rest] = id.match(/^(rel|grp|cln)-(.*)$/);
	return `/${kind}_${rest.replaceAll('-', '_')}.jpg`;
}

const POSITIONS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
function sheetPosition(i, n) {
	if (n === 2) return ['LEFT', 'RIGHT'][i];
	if (n === 3) return ['LEFT', 'MIDDLE', 'RIGHT'][i];
	return `${POSITIONS[i]} face from the LEFT`;
}

/** GenerateImage output (assets/rel_*.jpg) → centre-cropped 2:1 board in static/. */
function install(id) {
	if (BONDS[id]?.keep) return console.log(id, 'kept');
	const name = boardPath(id).slice(1);
	const src = `${ASSETS}/${name}`;
	const dest = `static/${name}`;
	execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '85', ...cropArgs(src, HOUSE_RATIO), src, '--out', dest]);
	console.log(id, '→', dest, imageSize(dest));
}

/** Look / Dress / Crown / Now from each canon block, plus its hex — the portrait carries the rest. */
const FIELDS = /\b(Look|Dress|Crown|Now): (.*?)(?=\s(?:Look|Dress|Headwear|Now|Demeanor|Crown|Armor|Battle armor|Sword|Carry|Fighting|Presence|Never|Hair ornament|SIGNATURE MOVE): |\s#[0-9a-fA-F]{6} as |$)/g;
export function brief(block) {
	const name = block.split(' — ')[0].trim();
	const hex = block.match(/#[0-9a-fA-F]{6}/)?.[0];
	const fields = [...block.matchAll(FIELDS)].map((m) => `${m[1]}: ${m[2].trim()}`);
	return `${name}${fields.length ? ` — ${fields.join(' ')}` : ''}${hex ? ` Colour ${hex}.` : ''}`;
}

/** The per-person blocks of a visual-canon text, with the crown-board pointers the sheet doesn't carry. */
export function personBlocks(text) {
	return text
		.split(' | ')
		.filter((b) => /FACE/.test(b))
		.map((b) =>
			b
				.replace(/^CANON — /, '')
				.replace(/, as the attached crown(?: \([^)]*\))?:/g, ':')
				.replace(/; the king’s red robe[^.]*on the costume chart/g, '')
				.replace(/ ref_muyeol shows [^.]*\./g, '')
		);
}

function main(args) {
	if (args[0] === '--list') {
		for (const [id, bond] of Object.entries(BONDS)) console.log(id, '→', boardPath(id), bond.keep ? '(kept)' : '');
		return;
	}
	if (args[0] === '--install') {
		for (const id of args.slice(1)) install(id);
		return;
	}

	const id = args[0];
	const bond = BONDS[id];
	if (!bond) throw new Error(`unknown bond ${id}`);
	if (bond.keep) {
		console.log(JSON.stringify({ id, kept: boardPath(id) }));
		return;
	}

	const canon = JSON.parse(
		execFileSync(
			process.execPath,
			['--experimental-strip-types', '--no-warnings', 'scripts/visual-canon.mjs', '--year', String(bond.year), ...bond.people],
			{ encoding: 'utf8' }
		)
	);
	const refs = (bond.refs ?? canon.refs).filter((r) => /^\/ch_/.test(r));
	const sheet = execFileSync('node', ['scripts/small-refs.mjs', '--bust', id, ...refs], { encoding: 'utf8' }).trim().split('\n').pop();

	const blocks = personBlocks(canon.text);
	const names = refs.map((r, i) => `${sheetPosition(i, refs.length)} of the sheet = ${blocks[i]?.split(' — ')[0].trim() ?? r}`);
	const people = blocks.map(brief).join(' | ');
	const tail = /^(grp|cln)-/.test(id) ? GROUP_TAIL : TAIL;
	const prompt = `${open(bond.cast ?? refs.length, bond.shot)} ${bond.scene} CHARACTER SHEET (copy these faces, hair and clothes exactly): ${names.join('; ')}. ${people} ${tail}`;

	fs.mkdirSync(OUT, { recursive: true });
	fs.writeFileSync(`${OUT}/${id}.txt`, prompt);
	console.log(JSON.stringify({ id, sheet, board: boardPath(id), chars: prompt.length }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
