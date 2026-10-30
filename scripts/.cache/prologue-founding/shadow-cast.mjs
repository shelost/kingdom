// Emotion-card stills (everything after "A new generation arises") recast with the
// real characters: canon faces, mostly swallowed by darkness, one hard key each.
// Usage: node scripts/.cache/prologue-founding/shadow-cast.mjs [id…]
//   builds one ref sheet per still (scripts/small-refs.mjs) and writes
//   shadow-manifest.json for scripts/install-temp-art.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildCanon } from '../../visual-canon.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, '../../..');
const SWORD = '/sw_bidam.png';

const DARK =
	'HEEWON STYLE, dark register: Korean webtoon figures with bold tapered ink line, painted into a sumukhwa ink-wash and oil-glaze world (splashed ink, dry-brush, hanji grain, umber-indigo glazes). DEEP TENEBRISM (Caravaggio, La Tour): at least 80% of the frame is pure ink-black. Each figure first reads as a dark mass merging into the black background; then ONE narrow hard key light from the side or below reveals only a sliver of the real face (one eye, the ridge of a cheekbone, the line of a jaw) plus a hand or the edge of a crown or blade. SPLIT LIGHTING on every face: one side lit, the other side pure black, the eyes on the dark side lost. Robes and armour are almost entirely lost in shadow, only a thin rim of their colour catching the key. The faces are the real characters of the attached sheet, not anonymous silhouettes. Never evenly lit, never a fully lit face or robe, never glowing eyes, never a glow aura or body halo; the scene colour lives only in that one real light. Painterly, cinematic, not photoreal. No text, no letters, no characters, no seal, no watermark. Composed for a 2:1 letterbox crop: every head, crown and helm sits well below the top edge, nothing important at the top or bottom edge.';

const POS = { 1: ['the attached sheet'], 2: ['LEFT', 'RIGHT'], 3: ['LEFT', 'MIDDLE', 'RIGHT'] };

/** Canon person blocks only, with ref paths rewritten to positions on the one sheet. */
function canonText(people, year, sheet, opts) {
	const { text } = buildCanon(people, { year, hat: false, ...opts });
	const labels = POS[sheet.length];
	const where = (ref) => {
		const i = sheet.indexOf(ref);
		if (i < 0) return 'the canon description';
		return sheet.length === 1 ? 'the attached sheet' : `the ${labels[i]} panel of the attached sheet`;
	};
	return text
		.replace(/^CANON — /, '')
		.split(' | ')
		.filter((s) => !/^(HEADWEAR|COSTUME)/.test(s))
		.map((s) => s.replace(/attached (\/[\w\-./]+\.(?:png|jpe?g))/g, (_, ref) => where(ref)))
		.map((s) => s.replace(/SIGNATURE MOVE.*?(?=#[0-9a-f]{6} as the hard key)/i, ''))
		.map((s) => s.replace(/stepped like the character 出/g, 'stepped in three tiers'))
		.join(' | ');
}

/** `people` drive the canon; `sheet` is what goes on the one reference image (faces first). */
export const SHADOW = [
	{
		id: 'prologue-love',
		people: ['sunduk', 'yushin'],
		year: 645,
		sheet: ['/ch_sunduk_old.png', '/ch_kim_yushin.png'],
		alt: 'Night at the star tower: Queen Sunduk reaches for a falling star, its red light on her face; far below in the dark, Yushin looks up at her and not at the sky',
		scene:
			'Love. Night, almost black. Over-the-shoulder shot: in the lower-left foreground, out of focus and nearly all black, the shoulder and bearded jaw of Kim Yushin (RIGHT face) looking up; only the line of his jaw catches faint red, his eyes ordinary and in shadow, NOT glowing. In the midground right, sharp, Queen Sunduk (LEFT face) leans on the stone parapet of the granite star tower (Cheomseongdae) in close-medium profile, her eyes at the vertical centre of the frame and her Silla crown well below the top edge, one hand lifted toward a single falling star streaking vermilion #E8552B across the upper-left sky. The star is the only key: SPLIT LIGHTING, it lights the near half of her face (cheekbone, lashes, parted lips), her fingertips and a few gold spangles of the crown; the far half of her face, her robe and the tower are pure black. Longing, distance.'
	},
	{
		id: 'prologue-gal-love',
		people: ['sunduk', 'yushin'],
		year: 645,
		sheet: ['/ch_sunduk_old.png', '/ch_kim_yushin.png'],
		alt: 'Queen Sunduk and Yushin pass in a dark palace corridor, each turning away, one band of red dusk light across both faces',
		scene:
			'Love that cannot be said. A long dark palace corridor of timber pillars, almost black; one narrow horizontal band of vermilion #E8552B dusk light slices between two pillars. Queen Sunduk (LEFT face, Silla gold crown) and Kim Yushin (RIGHT face, black beard, dark blue po, jougwan with two feathers, ring-pommel sword at the hip) pass shoulder to shoulder in the middle, close two-shot, each turning the head AWAY from the other. The vermilion band is the only light: it crosses ONLY their eyes like a blindfold of light (her near eye and cheekbone, his near eye and brow); below and above that strip their faces, her crown, his beard and both robes are pure black. A small gap of light between their shoulders.'
	},
	{
		id: 'prologue-revenge',
		people: ['chunchu'],
		year: 642,
		sheet: ['/ch_chunchu.png'],
		alt: 'Kim Chunchu stands still on a black ridge, a burning fortress on the horizon lighting half his face',
		scene:
			'Revenge. A black ridge in the foreground; Kim Chunchu (face from the sheet, jougwan with two feathers) stands perfectly still in a low three-quarter close-medium shot, fists closed at his sides, magenta #D8258C silk barely visible in the dark. Far on the horizon a fortress burns; its fire is the only key and it lights HALF his face from the side: one dry unblinking eye, a locked jaw; the other half is black. Embers drift past. Huge smoke column against a magenta dusk. Cold, patient, terrible.'
	},
	{
		id: 'prologue-gal-revenge',
		people: ['chunchu'],
		year: 648,
		sheet: ['/ch_chunchu.png'],
		alt: 'Chunchu stands in a small boat on a black sea, moonlight on the water lighting his face from below as he looks west',
		scene:
			'The long road of revenge. A vast black sea at night. Close-medium shot of Kim Chunchu (face from the sheet) at the bow of a small boat, gripping the bow post, looking west past the camera toward a faint far shore of palace roofs on the horizon; on his head only a SMALL black jougwan cap with two upright pheasant feathers, never a wide-brimmed hat. A long magenta #D8258C streak of moonlight on the water reflects UP onto him from below: SPLIT LIGHTING, the underside of his jaw, his lips and one eye lit, the other half of his face, his hair and his robe pure black. The square sail behind him is a black shape. Lonely and determined.'
	},
	{
		id: 'prologue-betrayal',
		people: ['gumil'],
		year: 642,
		sheet: ['/ch_gumil.png'],
		alt: 'Inside a fortress at night, Gumil lifts the gate bar and looks back over his shoulder as enemy torchlight floods through the gap onto half his face',
		scene:
			'Betrayal. Seen from INSIDE a fortress at night: two heavy timber gate leaves with iron bosses swung open in black. Between them the clerk Gumil (face from the sheet, his orange-red head-wrap) still holds the heavy gate bar he has just lifted, and turns his head back over his shoulder toward us. Through the gap a river of enemy torches pours a hard orange #e8742a seam of light across the dark yard and onto half his face: one wide guilty eye, a cheek, the corner of a mouth. The rest is black. Behind him a granary roof burns small. Slate-blue night #6b7f9e.'
	},
	{
		id: 'prologue-gal-betrayal',
		people: ['gumil', 'gumilwife'],
		year: 642,
		sheet: ['/ch_gumil_wife.png', '/ch_gumil.png'],
		alt: "Maehwa walks away along the fortress wall at dawn, a gold butterfly in her hand; Gumil watches from a black doorway, only his eyes lit",
		scene:
			"Before the betrayal. Night before dawn, almost black, one thin grey-blue #6b7f9e line of sky over a long fortress wall. Maehwa, Gumil's wife (LEFT face, hair up with a wooden sprig pin), walks away along the wall top in medium-far shot, turning her face slightly back; in her hand the small gold butterfly pendant on its pink cord catches the only warm light, which touches only the edge of her cheek; the rest of her is a dark shape against the sky line. In the near right foreground, close and huge, Gumil (RIGHT face, his orange-red head-wrap) stands inside a pitch-black doorway: SPLIT LIGHTING, only one eye and the ridge of his nose catch a cold grey-blue sliver; the rest of his face, head-wrap and body are pure black."
	},
	{
		id: 'prologue-greed',
		people: ['euija'],
		year: 655,
		sheet: ['/ch_king_euija.png'],
		alt: 'King Euija sprawls laughing on a heap of wine jars and gold, amber lamplight from below on his face and cup, the hall black around him',
		scene:
			'Greed. A black hall; King Euija (face from the sheet, big, bearded, Baekje king crown of black silk with twin gold flame ornaments) sprawls laughing on a throne set on a mountain of wine jars, coins and cups, head thrown back, one arm raising an overflowing cup. Low worm\'s-eye angle. One amber #e08a2e oil lamp on the heap below is the key: it lights his open laughing mouth, his beard, the cup and the coins spilling down; his robe and the hall dissolve into wine-dark black. At the dark edges, only the hands and wide silk sleeves of Baekje court women pour from jars (period hanbok sleeves, no caps, no aprons). Gluttony, joy, ruin coming.'
	},
	{
		id: 'prologue-gal-greed',
		people: ['euija'],
		year: 655,
		sheet: ['/ch_king_euija.png'],
		alt: 'King Euija stands on top of a teetering tower of wine jars, reaching for a huge amber moon that lights his greedy face',
		scene:
			'Greed. A tall teetering tower of stacked wine jars and treasure chests rising out of a dark river bluff; on the very top King Euija (face from the sheet, Baekje king crown with gold flame ornaments) stands on tiptoe, arm stretched up to grab a huge amber #e08a2e moon. The moon is the key: it rakes his upturned greedy grinning face and outstretched hand; his body and the tower below are black. Tiny shadow figures at the base strain to hold the tower up. Comic and doomed.'
	},
	{
		id: 'prologue-loyalty',
		people: ['gyebek'],
		year: 660,
		sheet: ['/ch_gyebek.png', SWORD],
		opts: { sword: true },
		alt: 'Gyebek on a black horse waits in the gap of a palisade under a gold storm-break, his sword laid back along his forearm, only his eyes under the helm lit',
		scene:
			'Loyalty. A vast storm sky with one yellow-gold #d9b13a cloud-break over a low black field; a broken timber palisade across the lower third with one gap. In the gap, in close-medium low angle, General Gyebek (LEFT face of the sheet; ignore the sword drawn on his portrait) sits on a black horse in steel lamellar and a tall plumed Baekje helm. He holds the ring-pommel sword of the RIGHT board in an ICE-PICK REVERSE GRIP: his right fist raised at his chest, the small ring pommel sticking UP out of the top of his fist beside his thumb, and the straight blade running DOWN and BACK from the bottom of his fist along the outside of his forearm past his elbow, edge out. The gold break is the key, from the side: SPLIT LIGHTING, it catches the rim of his helm, one eye and one cheekbone under it, his knuckles and the edge of the blade; the other half of his face, his body and the horse are black. A few spear tips behind him. Unmoving. He will not leave.'
	},
	{
		id: 'prologue-gal-loyalty',
		people: ['gyebek'],
		year: 660,
		sheet: ['/ch_gyebek.png', SWORD],
		opts: { sword: true },
		alt: 'Gyebek stands in the doorway of his dark house, head bowed, sword lowered, lit from below by a guttering lamp',
		scene:
			'The price of loyalty. Night; the open doorway of a small tiled house. General Gyebek (LEFT face of the sheet; ignore the sword drawn on his portrait) in steel lamellar, no helm, stands in the doorway with his head bowed, the straight ring-pommel sword of the RIGHT board lowered at his side, point down. Inside on the floor ONE oil lamp is guttering out; its last yellow #d9b13a light rises onto his lowered face from below (wet eyes, set mouth) and the blade; everything else is black. A black horse waits by the gate behind. Silent, grieving, resolved.'
	},
	{
		id: 'prologue-pride',
		people: ['gesomun'],
		year: 645,
		sheet: ['/ch_yeon_gesomun.png', SWORD],
		opts: { sword: true },
		alt: 'Yeon Gesomun stands on a gate-tower ridge before a red sun, swords fanned on his back, a three-legged crow landing on his arm, a crimson edge along his snarl',
		scene:
			'Pride. A huge low red sun #d0362f behind a two-tier Goguryeo gate tower in black. On its roof ridge Yeon Gesomun (LEFT face of the sheet) stands legs apart in a low worm\'s-eye medium shot, FOUR straight ring-pommel swords (RIGHT board) fanned on his back like wings and one in his hand; a three-legged black crow lands on his raised forearm, wings spread. Contre-jour: the sun lays a hard crimson edge along his brow, nose, beard and snarling grin and the fanned blades; the rest of him is ink-black. Arrogant, magnificent, alone.'
	},
	{
		id: 'prologue-gal-pride',
		people: ['gesomun'],
		year: 645,
		sheet: ['/ch_yeon_gesomun.png', SWORD],
		opts: { sword: true },
		alt: 'Yeon Gesomun stands in a cracking frozen river with a sword in each hand, a low crimson sun lighting one side of his face as an enemy host sinks behind him',
		scene:
			'Pride. A vast pale frozen river at dusk under a low crimson #d0362f sun. Yeon Gesomun (LEFT face of the sheet) stands knee-deep in cracked ice in the foreground, medium shot, a straight ring-pommel sword (RIGHT board) in EACH hand held low and wide, more blades fanned on his back. The sun is the key: one side of his face, a grinning eye and both blades catch crimson; the rest of him is black against the ice. Behind him, small and far, an enemy host with white banners breaks through the ice and sinks.'
	},
	{
		id: 'prologue-rage',
		people: ['bidam'],
		year: 647,
		sheet: ['/ch_bidam_old.png', SWORD],
		opts: { sword: true },
		alt: 'Bidam roars on a fortress rampart under a falling star, its white-gold light on his face and the prayer beads swinging from his sword wrist',
		scene:
			'Rage. Pitch-dark navy night #141C2E on a stone fortress rampart. Low dutch CLOSE shot of Bidam (LEFT face of the sheet) mid-roar, his face filling the right half of the frame, the ring-pommel sword of the RIGHT board raised high in the upper left with a string of 108 prayer beads swinging from his sword wrist. A falling star tears a thin white-gold streak down the far left sky and is the only light: SPLIT LIGHTING, it lights the left half of his roaring face (one wild eye, bared teeth, cheekbone), his knuckles, the beads and the blade edge; the right half of his face, his hair and his white robe are swallowed in navy-black, only the edge of one horse-embroidered sleeve catching a glint. Far below, a ring of tiny enemy campfires.'
	},
	{
		id: 'prologue-gal-rage',
		people: ['bidam', 'yushin'],
		year: 647,
		sheet: ['/ch_bidam_old.png', '/ch_kim_yushin.png', SWORD],
		opts: { sword: true },
		alt: 'Bidam and Yushin clash in the mud at dawn, swords crossed, a cold blue break lighting a slice of each face as gold prayer beads scatter',
		scene:
			'Rage. A muddy field before dawn, almost black. Close two-shot in profile: Bidam (LEFT face) and Kim Yushin (MIDDLE face; ignore the sword drawn on his portrait) face each other inches apart, each gripping ONE straight ring-pommel sword (RIGHT board) in one hand, the blades crossed in an X between their faces; Bidam\'s string of prayer beads snaps and scatters a few beads into the air; Yushin in steel lamellar and a tall pointed Silla helm. A thin vertical cold blue #2A5FB8 dawn break in the sky directly between them is the only light: SPLIT LIGHTING, it lights only the inner edge of each face (Bidam\'s bared teeth and one eye, Yushin\'s one level eye under the helm) and the crossed steel; the outer halves of both faces, the white robe, the armour and the field are navy-black. Mud spray.'
	}
];

const only = new Set(process.argv.slice(2));
const items = SHADOW.filter((s) => !only.size || only.has(s.id));
const manifest = [];
for (const s of items) {
	const sheet = execFileSync('node', ['scripts/small-refs.mjs', '--bust', `shadow-${s.id}`, ...s.sheet], { cwd: ROOT, encoding: 'utf8' })
		.trim()
		.split('\n')
		.pop();
	const prompt = `${s.scene} CANON: ${canonText(s.people, s.year, s.sheet, s.opts)} ${DARK}`;
	manifest.push({ id: s.id, alt: s.alt, prompt, sheet });
}
const out = path.join(HERE, 'shadow-manifest.json');
fs.writeFileSync(out, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`${manifest.length} stills → ${out}`);
for (const m of manifest) console.log(m.id, m.sheet, `${m.prompt.length} chars`);
