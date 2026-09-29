/**
 * Haemosu–Yuhwa sequential romance (sun-stare banter + landing + SFW/NSFW parallels).
 * Run: node scripts/.cache/patch-haemosu-yuhwa-romance.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const PEOPLE = path.join(ROOT, 'src/lib/data/image-people.json');

const SUFFIX =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: dutch, crane, worm’s-eye, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro. HIGH CONTRAST: crushed blacks + one hard key + long shadows — not even daylight wash. ICONIC MINIMAL: ONE architectural device a lens can see; empty negative space; tiny figures or lower-third; the world stays in the shot. COLOR SYMBOLISM: hex is lighting / a plane / one accent — NEVER recolor portrait garments gold. Real Korean architecture: grey giwa, timber, packed earth. No army. No readable text. No watermark. Copy: movie frame in a real place, not a graphic poster; iconic one-device layout, empty frame, lower-third; high contrast chiaroscuro, not even wash; 2D animated cel-painterly, no photoreal; cinematography: dutch, wide, bokeh, mise-en-scène. Never: halo / bloom / glow around figures; graphic split-screen or black-triangle overlay; photoreal live-action or 3D archviz; busy extras crowding an iconic frame; copy-pasted reference as a fashion plate; flat even-daylight postcard wide.';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const imagePeople = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));
const jumong = story[4].entries[5];
if (jumong?.title !== 'Jumong') throw new Error(`expected Jumong, got ${jumong?.title}`);

const PLACE = '/pl_white_river.png';
const CHARIOT = ['/obj_haemosu_chariot.png', '/obj_haemosu_chariot_2.png'];
const SET_AMNOK = ['/temp/jumong-set-amnok-day-empty.jpg', '/temp/jumong-set-amnok-shallows-stones.jpg'];
const SET_COPPER = ['/temp/jumong-set-copper-empty-wide.jpg', '/temp/jumong-set-copper-door-empty.jpg'];

function slot({
	id,
	at,
	alt,
	prompt,
	refs,
	people,
	nsfw = false,
	ratio = 1.778,
	tone
}) {
	return {
		id,
		ratio,
		tone,
		at,
		alt,
		prompt: `${prompt} ${SUFFIX}`,
		refs,
		people,
		nsfw
	};
}

const NEW = [
	slot({
		id: 'haemosu-tiny-obj-lookdown',
		tone: '#f0b429',
		at: 'A tiny gold chariot cuts the noon',
		alt: 'Iconic bird’s-eye: a tiny locked five-dragon gold two-wheel sun-chariot stamps the vast Amnok noon',
		refs: [...CHARIOT, '/ch_haemosu.png', PLACE, ...SET_AMNOK],
		people: ['haemosu'],
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: bird’s-eye crane over a real Amnok. LENS: shallow DOF, long-shadow noon key, creamy river bokeh. Mise-en-scène: SAME locked Ubal bank — gold-flat water, dark timber, wet stones, reeds, natural cloudy sky. ONE device: a TINY gold two-wheel sun-chariot as a comma-stamp in the upper third, five living dragons gold/crimson/azure/jade/white pulling. SAME chariot as the attached object refs: two gold spoked wheels, open floor, curved rail, yoke — NOT a pagoda, NOT a gazebo, NOT a copper disc. Haemosu a tiny silver-white topknot in white silk, FACE suggestion only from attached portrait. Gold #f0b429 as the water-light plane, never a body-halo. Lower-third emptiness. No boats crowding. No army. No text. No watermark. Painterly anime-adjacent, monumental.'
	}),
	slot({
		id: 'haemosu-two-wake-from-rail',
		tone: '#f0b429',
		at: 'Two wakes cut the shallows; Yuhwa stays',
		alt: 'OTS from the gold chariot rail: two wakes cut the Amnok; one wet figure stays',
		refs: [...CHARIOT, '/ch_haemosu.png', PLACE, ...SET_AMNOK],
		people: ['haemosu'],
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: over-shoulder from the gold chariot rail. LENS: rack-focus, sharp rail in foreground, river midground, creamy sky bokeh. Mise-en-scène: SAME locked Amnok shallows. ONE device: the gold METAL RAIL as a hard horizontal bar; two white wakes cut the water; one small wet figure stays, two already gone. Haemosu leaning, silver-white topknot, white silky hanbok open at the chest as in the portrait, FACE from attached. Do not invent sister faces. Gold #f0b429 as a hard light-plane on the water, never a body-halo. Natural Earth sky. No army. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-love-stunned-ecu',
		tone: '#f0b429',
		at: 'He forgets the hour on her face',
		alt: 'ECU Haemosu at the gold rail: stunned falling-in-love, mouth open, gold light-plane',
		refs: ['/ch_haemosu.png', ...CHARIOT],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: dutch ECU at the gold rail. LENS: shallow DOF, wind-tear bokeh, chiaroscuro. Mise-en-scène: SAME gold chariot rail as a hard bar across the lower third. Haemosu leaning, silver-white hair tearing, white silky hanbok, FACE from attached portrait — falling in love, stunned, pupils blown, mouth open, not a grim statue, not a standing clone. ONE device: gold #f0b429 as a hard light-plane cutting half his face — never a body-halo. Wanting easy sun-god. No text. No watermark. Painterly anime-adjacent cinema.'
	}),
	slot({
		id: 'haemosu-gulp-hour-ecu',
		tone: '#f0b429',
		at: 'He forgets how to swallow',
		alt: 'ECU Haemosu gulp at the rail: throat working, eyes down at the Amnok',
		refs: ['/ch_haemosu.png', ...CHARIOT],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: tight ECU on mouth and throat. LENS: shallow DOF, rack to the gulp. Mise-en-scène: gold rail edge only. Haemosu swallows hard — gulp, Adam’s apple, eyes down, greedy and a little stupid. FACE from attached. Silver-white hair, white silk collar. ONE device: gold #f0b429 as a slit-plane across the throat, never a halo. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-grin-comes-down',
		tone: '#f0b429',
		at: 'He grins and leaves the rail',
		alt: 'ECU Haemosu easy greedy grin as one hand lifts off the gold rail',
		refs: ['/ch_haemosu.png', ...CHARIOT],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: dutch ECU, mid-turn. LENS: shallow DOF. Haemosu, easy feral grin, one hand lifting off the gold rail, coming down the hour. FACE from attached — fun, greedy, not a founder statue. Silver-white topknot loosening. White silky hanbok. ONE device: the rail as a falling diagonal; gold #f0b429 light-plane, never a halo. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-descent-dutch',
		tone: '#f0b429',
		at: 'He leaves the rail and the hour',
		alt: 'Dutch: Haemosu mid-stride stepping off the locked gold chariot toward the Amnok',
		refs: ['/ch_haemosu.png', ...CHARIOT, PLACE, ...SET_AMNOK],
		people: ['haemosu'],
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch mid-stride descent. LENS: long-shadow key, crushed blacks. Mise-en-scène: SAME locked two-wheel gold chariot high as a wedge; REAL Amnok below. Haemosu stepping off the floor toward water, white silk billowing, silver-white hair, FACE from attached, verb pose: leaving. ONE of him. ONE device: a falling gold #f0b429 light-STRIP as the hour, never a body-halo. Same five dragons in the sky. Natural clouds. No army. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-first-step-water',
		tone: '#f0b429',
		at: 'He wades close. She does not run.',
		alt: 'Worm’s-eye wet stones: Haemosu’s first step into the Amnok shallows',
		refs: ['/ch_haemosu.png', PLACE, ...SET_AMNOK],
		people: ['haemosu'],
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye from wet stones. LENS: sharp foreground stones, rack to his stepping foot. Mise-en-scène: SAME Amnok shallows — packed wet earth, river stones, gold-flat water. Haemosu first-step into the water, white silky hanbok hem dark with river, silver-white topknot, FACE from attached looking down-off. ONE device: the stepping foot as a dark stamp on a gold #f0b429 water-plane. No halo. No army. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-wades-close-her',
		tone: '#8fc4e0',
		at: 'He wades close. She does not run.',
		alt: 'Two-shot shallows: Haemosu wades close; Yuhwa stays, wet ice-blue at the hips',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['haemosu', 'yuhwa'],
		prompt:
			'Intimate cinematic 16:9 two-shot. CINEMATOGRAPHY: dutch two-shot in the shallows. LENS: shallow DOF, wet bokeh. Mise-en-scène: SAME Amnok bank, water to the thighs. ONE Haemosu, ONE Yuhwa — never clone. He wades close in wet white silk, silver-white hair, FACE from attached, greedy easy want. She does not step back: wet dark hair, ice-blue #8fc4e0 silk at the hips, naked wet back and shoulders from the portrait language, hair ornament matches attached wave binyeo. FACES from attached portraits. ONE device: a hard gold #f0b429 sun-bar on the water between them — light-plane, never body-halo. Natural sky. No army. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-naked-back-stay',
		tone: '#8fc4e0',
		at: 'She does not run.',
		alt: 'Behind Yuhwa in the Amnok: naked wet back, ice-blue silk at the hips, look-back',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: over-shoulder from behind. LENS: shallow DOF, wet-skin key. Mise-en-scène: SAME Amnok shallows. ONE Yuhwa. Naked wet back fills the frame, ice-blue silk bunched at the hips, wet braid, looking over her shoulder — flirty, brave, not running. FACE and pale-blue garment language from attached portrait. Hair ornament matches attached teal-wave binyeo. ONE device: her back as a pale vertical against crushed-dark water; ice-blue #8fc4e0 as the plane. Gold sun only as a far slit, never a halo. No text. No watermark. Painterly anime-adjacent, skin-forward, not photoreal.'
	}),
	slot({
		id: 'haemosu-why-not-run',
		tone: '#f0b429',
		at: "Why didn't you run away",
		alt: 'Two-shot: Haemosu leans in asking why she stayed; Yuhwa chin-up in the shallows',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['haemosu', 'yuhwa'],
		prompt:
			'Intimate cinematic 16:9 two-shot. CINEMATOGRAPHY: dutch two-shot, he leans asking. LENS: shallow DOF. SAME Amnok shallows. ONE each. Haemosu mid-lean, easy 반말 mouth, silver-white hair wet at the tips, white silk, FACE from attached. Yuhwa chin lifted, wet ice-blue silk, FACE from attached, binyeo matches attached wave pin. ONE device: his leaning shoulder as a gold #f0b429-keyed wedge; her ice-blue #8fc4e0 as the answering plane. No halo. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-no-reason',
		tone: '#8fc4e0',
		at: "didn't see any reason",
		alt: 'ECU Yuhwa: hedge then brave, wet lashes, looking at the sun-god',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: ECU slightly from below. LENS: creamy bokeh, wet-lash key. ONE Yuhwa. FACE from attached — youngest, flirty/brave, a hedge then a dare in the eyes, mouth slightly open. Wet dark hair, ice-blue #8fc4e0 silk at the collarbone, binyeo matches attached teal-wave pin. ONE device: ice-blue as a soft plane behind her cheek. No halo. No text. No watermark. Painterly anime-adjacent.'
	}),
	slot({
		id: 'haemosu-looking-at-sun',
		tone: '#f0b429',
		at: 'looking directly at the sun',
		alt: 'Two-shot: Haemosu teases that she is staring at the sun; Yuhwa still looking at him',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['haemosu', 'yuhwa'],
		prompt:
			'Intimate cinematic 16:9 two-shot. CINEMATOGRAPHY: over-shoulder from her, he is the sun she is staring at. LENS: contre-jour hard key, crushed shadow. SAME shallows. ONE each. Haemosu FACE from attached, easy grin, pointing or nodding up. Yuhwa FACE from attached, still staring at HIM not the sky. ONE device: a hard gold #f0b429 vertical SLIT of sun behind him as a light-plane — never a body-halo, never a disk-aura. Ice-blue #8fc4e0 wet silk on her. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-why-not-sun',
		tone: '#8fc4e0',
		at: 'oh, is that so',
		alt: 'ECU Yuhwa flirty: oh is that so, why not, wet mouth almost smiling',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: dutch ECU. LENS: shallow DOF. ONE Yuhwa. FACE from attached — flirty 해요체 face, almost a smile, then a dare, wet mouth, flush. Hair ornament matches attached wave binyeo. Ice-blue #8fc4e0 as a cheek-plane. Wanting, not serene. No halo. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-burn-eyes',
		tone: '#f0b429',
		at: 'burn your eyes out',
		alt: 'ECU Haemosu: warning she might burn her eyes, still greedy, gold plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: ECU, slightly dutch. LENS: chiaroscuro. ONE Haemosu. FACE from attached — warning and want in the same mouth, easy sun-god, not lecturing. Silver-white hair, white silk. ONE device: gold #f0b429 as a hard plane across the eyes, never a halo. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-like-what-i-see',
		tone: '#8fc4e0',
		at: 'like what I see',
		alt: 'Close: Yuhwa staring into him, flush, I like what I see, wet ice-blue slipping',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 close. CINEMATOGRAPHY: ECU two-thirds face, chin up. LENS: shallow DOF, wet-skin key. ONE Yuhwa. FACE from attached — sexually forward, bitten mouth, flush, blown pupils, staring into the sun-god. Wet ice-blue silk slipping off one shoulder, naked wet collarbone and back-edge. Binyeo matches attached wave pin. Ice-blue #8fc4e0 as the plane. No halo. No text. No watermark. Skin-forward cinema, not photoreal porn.'
	}),
	slot({
		id: 'yuhwa-like-see-wet-back',
		tone: '#8fc4e0',
		at: 'like what I see',
		alt: 'SFW parallel: Yuhwa naked wet back in the shallows, look-back, silk at the hips',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: dutch from behind. LENS: wet-back key, creamy water bokeh. ONE Yuhwa. Naked wet back is the picture, ice-blue silk at the hips only, looking over her shoulder with a wanting flush. FACE from attached. Binyeo matches attached. ONE device: the wet spine as a pale vertical; #8fc4e0 water-plane. Gold sun as a far slit only, never a halo. No hike. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-yuhwa-sun-likes-hike',
		tone: '#8fc4e0',
		nsfw: true,
		at: 'does the sun like what it sees',
		alt: 'NSFW: Yuhwa look-back hike — ice-blue hiked, ass and chest, wanting face in the Amnok',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_AMNOK],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: dutch from behind, look-back. LENS: shallow DOF, lamp-hard sun key as a plane. SAME Amnok shallows. ONE Yuhwa. Skin-forward: ice-blue silk hiked, naked wet back, hiked ass silhouette, chest as she twists to look back, wanting face, bitten mouth, flush. FACE from attached portrait. Binyeo matches attached wave pin. ONE device: hiked ice-blue as a #8fc4e0 ribbon; gold #f0b429 as a hard light-plane on wet skin, never a body-halo. Adult, artistic, manhwa-panel energy, not photoreal. No penetration. No genital-as-subject. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-gulp-her-ahead',
		tone: '#f0b429',
		at: 'He swallows.',
		alt: 'ECU Haemosu gulp: she got ahead of him, eyes wide, gold plane',
		refs: ['/ch_haemosu.png'],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: ECU gulp. LENS: rack to the throat. ONE Haemosu. FACE from attached — gulp, eyes wide, greedy sun-god suddenly behind her dare, mouth working, not serene. Silver-white hair. ONE device: gold #f0b429 as a hard plane on the cheek, never a halo. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-leads-copper-back',
		tone: '#8fc4e0',
		at: 'This way. The bank.',
		alt: 'Yuhwa leads toward the copper kiln: naked wet back, look-back, silk at the hips',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_COPPER, ...SET_AMNOK],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: over-shoulder she walks, look-back. LENS: rack-focus — sharp wet back, copper kiln melting to bokeh. Mise-en-scène: SAME Amnok bank, SAME round hammered-copper kiln with conical timber roof and dark door. ONE Yuhwa mid-stride out of the shallows, naked wet back, ice-blue silk at the hips, looking back inviting. FACE from attached. Binyeo matches attached. ONE device: the copper kiln as a warm disc in the upper third; #8fc4e0 her plane. No halo. No army. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-follows-shallows',
		tone: '#f0b429',
		at: 'This way. The bank.',
		alt: 'Haemosu follows through the shallows, greedy grin, copper kiln ahead',
		refs: ['/ch_haemosu.png', PLACE, ...SET_COPPER, ...SET_AMNOK],
		people: ['haemosu'],
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch mid-stride follow. LENS: long-shadow key. SAME Amnok shallows, SAME copper kiln as a stamp ahead. ONE Haemosu wading after her, wet white silk, silver-white hair, easy greedy grin, FACE from attached, verb: following. ONE device: gold #f0b429 as a path-plane on the water toward the kiln, never a halo. No army. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-yuhwa-lead-hike',
		tone: '#8fc4e0',
		nsfw: true,
		at: 'This way. The bank.',
		alt: 'NSFW parallel: Yuhwa leads with a hike look-back, chest and ass, copper kiln ahead',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', PLACE, ...SET_COPPER, ...SET_AMNOK],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: dutch look-back mid-stride. SAME bank, SAME copper kiln in bokeh. ONE Yuhwa. Skin-forward hike: ice-blue hiked, wet ass silhouette, chest as she twists, wanting face, leading him. FACE from attached. Binyeo matches attached. #8fc4e0 ribbon; gold light-plane only. No halo. No penetration. No text. No watermark. Painterly anime-adjacent.'
	}),
	slot({
		id: 'yuhwa-copper-kiss-sfw',
		tone: '#8fc4e0',
		at: 'She kisses him with river still on her mouth',
		alt: 'SFW copper kiss: Yuhwa naked wet back, off-shoulder ice-blue, mouths close at the kiln wall',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png', ...SET_COPPER],
		people: ['yuhwa', 'haemosu'],
		prompt:
			'Intimate cinematic 16:9 two-shot. CINEMATOGRAPHY: close two-shot kiss, her back to us. LENS: shallow DOF, copper bounce. Mise-en-scène: SAME hammered-copper kiln interior — warm metal wall, one slit of sun. ONE each. She kisses him, river still on her mouth; naked wet back, ice-blue silk off one shoulder at the hips. He in wet white silk, silver-white hair. FACES from attached portraits. Binyeo matches attached. ONE device: copper wall as a warm plane; gold #f0b429 as a hard slit-plane through the door, never a body-halo. Wanting mouths. No army. No furniture dump. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-copper-want-ecu',
		tone: '#f0b429',
		at: 'She kisses him with river still on her mouth',
		alt: 'ECU Haemosu in the copper kiln: wanting after the kiss, gold as a slit-plane',
		refs: ['/ch_haemosu.png', ...SET_COPPER],
		people: ['haemosu'],
		prompt:
			'Intimate cinematic 16:9 ECU. CINEMATOGRAPHY: ECU after the kiss. LENS: copper-bounce bokeh. ONE Haemosu. FACE from attached — wanting, open mouth, flush, greedy and a little wrecked, falling in love finished. Silver-white hair damp. White silk. ONE device: gold #f0b429 as a slit-plane reflected on copper, never a halo. No text. No watermark.'
	}),
	slot({
		id: 'yuhwa-copper-aftermath-back',
		tone: '#8fc4e0',
		at: 'The copper keeps the afternoon',
		alt: 'Aftermath: Yuhwa naked wet back against the copper kiln, ice-blue at the hips, spent-soft look-back',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', ...SET_COPPER],
		people: ['yuhwa'],
		prompt:
			'Intimate cinematic 16:9 still. CINEMATOGRAPHY: OTS her back against copper. LENS: warm copper key, crushed dark door. SAME kiln wall. ONE Yuhwa. Naked wet back is the picture, ice-blue silk at the hips, wet hair, binyeo matches attached, soft spent look-back — not porn-dump, not serene beauty. FACE from attached. ONE device: hammered copper as the plane; #8fc4e0 her accent. Gold slit only. No halo. No text. No watermark. Thin aftermath.'
	})
];

const exist = new Set(jumong.images.map((im) => im.id));
const fresh = NEW.filter((s) => !exist.has(s.id));
if (!fresh.length) {
	console.log('all romance slots already present');
} else {
	const after = jumong.images.findIndex((im) => im.id === 'yuhwa-copper-lookback-want');
	const at = after >= 0 ? after + 1 : jumong.images.length;
	jumong.images.splice(at, 0, ...fresh);
	console.log(`inserted ${fresh.length} slots after yuhwa-copper-lookback-want`);
}

for (const s of NEW) {
	imagePeople[s.id] = s.people;
}

// Bury tiny-chariot at in the usual-run paragraph
const usual = jumong.blocks.find(
	(b) => typeof b.html === 'string' && b.html.includes('Usual run: five dragons across the noon sky')
);
if (usual && !usual.html.includes('A tiny gold chariot cuts the noon')) {
	usual.html = usual.html.replace(
		'<b>The sky is empty first.</b>',
		'<b>A tiny gold chariot cuts the noon.</b> <b>The sky is empty first.</b>'
	);
	usual.ko = usual.ko.replace(
		'<b>하늘이 먼저 비어 있다.</b>',
		'<b>작은 금 수레가 한낮을 가른다.</b> <b>하늘이 먼저 비어 있다.</b>'
	);
}

// Falling-in-love ats in the look-down paragraph
const lookdown = jumong.blocks.find(
	(b) => typeof b.html === 'string' && b.html.includes('Then the Amnok flashes under the wheel')
);
if (lookdown && !lookdown.html.includes('He forgets the hour on her face')) {
	lookdown.html += ' <b>He forgets the hour on her face.</b> <b>He forgets how to swallow.</b>';
	lookdown.ko += ' <b>얼굴에서 시각을 잊는다.</b> <b>삼키는 법도 잊는다.</b>';
}

// SFW kiss: same plot for both filters
const kissP = jumong.blocks.find(
	(b) => typeof b.html === 'string' && b.html.includes('She kisses him with river still on her mouth')
);
if (kissP?.nsfw) delete kissP.nsfw;

const already = jumong.blocks.some(
	(b) =>
		(typeof b.html === 'string' && b.html.includes('He wades close. She does not run.')) ||
		(Array.isArray(b.en) && b.en.some((l) => String(l).includes("Why didn't you run away")))
);

if (!already) {
	const i = jumong.blocks.findIndex(
		(b) => typeof b.html === 'string' && b.html.includes('He comes down. He builds a copper room')
	);
	if (i < 0) throw new Error('copper come-down paragraph missing');

	const insert = [
		{
			kind: 'p',
			html: '<b>He grins and leaves the rail.</b> The five dragons keep the joke without him. <b>He leaves the rail and the hour</b> the way a man leaves a door he has already decided to open.',
			ko: '<b>웃고 난간을 놓는다.</b> 다섯 용은 그 없이 농담을 이어 간다. <b>난간과 시각을 두고</b> 이미 열기로 한 문을 나서듯 내려온다.'
		},
		{
			kind: 'p',
			html: 'Water to the thigh. He is suddenly a height she can answer. <b>He wades close. She does not run.</b> Gold sits on the wet as a plane, not a crown. The stupid question is the only one left.',
			ko: '물이 허벅지까지. 이제 그녀가 대답할 수 있는 높이다. <b>그는 가까이 걸어 들어온다. 그녀는 달아나지 않는다.</b> 금빛은 관이 아니라 면으로 젖은 물 위에 앉는다. 남은 건 바보 같은 질문뿐이다.'
		},
		{
			kind: 'dialogue',
			chip: '#7fc4e8',
			person: 'haemosu',
			lines: ['야.', '왜 안 도망갔어.'],
			en: ['Hey.', "Why didn't you run away."]
		},
		{
			kind: 'dialogue',
			chip: '#8fc4e0',
			person: 'yuhwa',
			lines: ['…도망갈 이유를 못 봤어요.'],
			en: ["...I didn't see any reason to."]
		},
		{
			kind: 'dialogue',
			chip: '#7fc4e8',
			person: 'haemosu',
			lines: ['해를 똑바로 보고 있잖아…', '그러면 안 되는 거 몰라?'],
			en: [
				"You're looking directly at the sun...",
				"Don't you know you're not supposed to do that?"
			]
		},
		{
			kind: 'dialogue',
			chip: '#8fc4e0',
			person: 'yuhwa',
			lines: ['…아, 그래요?', '왜요?'],
			en: ['...Oh, is that so?', 'Why not?']
		},
		{
			kind: 'dialogue',
			chip: '#7fc4e8',
			person: 'haemosu',
			lines: ['눈 버릴 수도 있거든.'],
			en: ['Because you might burn your eyes out.']
		},
		{
			kind: 'dialogue',
			chip: '#8fc4e0',
			person: 'yuhwa',
			lines: ['아, 지금 바로 들여다보고 있는데요…', '보이는 게, 꽤 좋아요…'],
			en: [
				"Oh, I'm staring right into it right now...",
				'I think I actually kind of like what I see...'
			]
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#8fc4e0',
			person: 'yuhwa',
			lines: ['그래서요…', '해도 지금 보이는 게 좋아요…?'],
			en: ['So tell me...', 'Does the sun like what it sees...?']
		},
		{
			kind: 'p',
			html: '<b>He swallows.</b>',
			ko: '<b>그는 침을 삼킨다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#7fc4e8',
			person: 'haemosu',
			lines: ['……'],
			en: ['……']
		},
		{
			kind: 'p',
			html: 'She turns first. Wet back, ice-blue still at the hips, and the look over her shoulder is already the hour. <b>This way. The bank.</b> He follows like the sky can wait.',
			ko: '그녀가 먼저 돌아선다. 젖은 등, 허리에 남은 얼음빛, 어깨 너머가 이미 시각이다. <b>이쪽으로. 강가로.</b> 하늘은 기다려도 된다고 여기는 사람처럼 그는 따라간다.'
		}
	];

	jumong.blocks.splice(i, 0, ...insert);
	console.log(`inserted ${insert.length} romance blocks before copper come-down`);
} else {
	console.log('romance blocks already present');
}

// Thin SFW aftermath line after copper rise / kiss geography
const aftermathAt = jumong.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('The copper room rises on the bank like a kiln')
);
if (aftermathAt >= 0) {
	const next = jumong.blocks[aftermathAt + 1];
	if (!(typeof next?.html === 'string' && next.html.includes('The copper keeps the afternoon'))) {
		jumong.blocks.splice(aftermathAt + 1, 0, {
			kind: 'p',
			html: '<b>The copper keeps the afternoon.</b> After the mouths, the wall is still warm and she does not cover the back he already learned.',
			ko: '<b>구리가 오후를 붙든다.</b> 입이 끝난 뒤에도 벽은 따뜻하고, 그는 이미 배운 등을 그녀는 가리지 않는다.'
		});
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
fs.writeFileSync(PEOPLE, JSON.stringify(imagePeople, null, '\t') + '\n');
console.log('wrote story + image-people');
console.log(NEW.map((s) => `${s.nsfw ? 'NSFW' : 'SFW '} ${s.id}  @ ${s.at}`).join('\n'));
