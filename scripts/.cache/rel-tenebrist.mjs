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

const OPEN = `HEEWON STYLE — a premium KOREAN WEBTOON / MANHWA splash illustration of a relationship, lit with cinematic tenebrism. A 2:1 movie frame composed for a 2:1 letterbox crop (nothing important at the top or bottom edge). MEDIUM CLOSE TWO-SHOT, waist-up, both faces large. DRAW IT EXACTLY IN THE STYLE OF THE ATTACHED CHARACTER SHEET: the same clean confident black ink linework, the same manhwa face design (eye shape, brows, nose, jaw, hairline and hair), cel-shaded skin and silk with soft airbrushed gradients and crisp drawn fold lines. Each face must be recognisably the character drawn on the sheet, wearing the same clothes. NOT realistic, NOT an oil painting, NOT photoreal, NOT painterly old-master faces, NOT 3D. ONLY THESE TWO PEOPLE in the frame.`;

const TAIL = `LIGHT AND BACKGROUND (dark manhwa tenebrism, like a dramatic manhwa splash page): a near-BLACK background of drifting smoke and haze faintly tinted with the characters' colours, no detailed set — at most one dim prop or architectural edge; ONE hard directional light from the side or below carves the faces and silk in high contrast, the far side of each figure falling off into black shadow, a thin edge of the same light along the silhouettes; deep inky blacks, crisp highlights, strong cast shadows across the faces. Each person's colour is the colour of the light and the shadow-tint on them and in the smoke behind them — never a glow aura or halo. BLOCKING, BODY LANGUAGE AND FACIAL EXPRESSIONS show the relationship at a glance. Faces and clothes from the sheet; new poses, never the sheet's stance. One of each person, never cloned. No text, no speech bubbles, no panel borders, no watermark.`;

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
	}
};

function boardPath(id) {
	return `/rel_${id.replace(/^rel-/, '').replaceAll('-', '_')}.jpg`;
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
		execFileSync('node', ['scripts/visual-canon.mjs', '--year', String(bond.year), ...bond.people], { encoding: 'utf8' })
	);
	const refs = (bond.refs ?? canon.refs).filter((r) => /^\/ch_/.test(r));
	const sheet = execFileSync('node', ['scripts/small-refs.mjs', '--bust', id, ...refs], { encoding: 'utf8' }).trim().split('\n').pop();

	const blocks = personBlocks(canon.text);
	const names = refs.map((r, i) => {
		const pos = refs.length === 2 ? ['LEFT', 'RIGHT'][i] : ['LEFT', 'MIDDLE', 'RIGHT'][i];
		return `${pos} of the sheet = ${blocks[i]?.split(' — ')[0].trim() ?? r}`;
	});
	const people = blocks.map(brief).join(' | ');
	const prompt = `${OPEN} ${bond.scene} CHARACTER SHEET (copy these faces, hair and clothes exactly): ${names.join('; ')}. ${people} ${TAIL}`;

	fs.mkdirSync(OUT, { recursive: true });
	fs.writeFileSync(`${OUT}/${id}.txt`, prompt);
	console.log(JSON.stringify({ id, sheet, board: boardPath(id), chars: prompt.length }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
