import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const SEQ = 'src/lib/movieSequences.ts';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const ch = story.find((c) => c.title === 'The Seventh Invasion');
if (!ch) throw new Error('chapter not found');
const en = ch.entries.find((e) => e.title === 'Jumong');
if (!en) throw new Error('Jumong entry not found');

const blocks = en.blocks;

function findBlock(pred) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + pred);
	return i;
}

// Hall arrival: already on his knees before Tabal speaks.
const arrival = findBlock(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('The hall is only torches')
);
if (!blocks[arrival].html.includes('on his knees before Tabal')) {
	blocks[arrival].html = blocks[arrival].html.replace(
		'They bring him in at dead of night, not as a guest.',
		'They bring him in at dead of night, not as a guest. They put him <b>on his knees before Tabal</b> opens his mouth. A woman is already in the door-dark, chin up, not invited to the questions.'
	);
	blocks[arrival].ko = blocks[arrival].ko.replace(
		'손님으로 데려오지 않는다. 한밤중이다.',
		'손님으로 데려오지 않는다. 한밤중이다. 연타발이 입을 열기 전에 <b>무릎을 꿇린다</b>. 문 어둠에 이미 여자가 있다. 턱. 질문에는 안 불렸다.'
	);
}

// Tabal Name: unique at for Jumong protest.
const nameI = findBlock(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'yeontabal' &&
		Array.isArray(b.en) &&
		b.en[0] === 'Name.' &&
		b.en.includes('…So who sent you.')
);
if (!blocks[nameI].en.includes('I asked for a name.')) {
	blocks[nameI].en = ['Name.', 'I asked for a name.', '…So who sent you.'];
	blocks[nameI].lines = ['이름.', '이름 물었다.', '…그래서. 누가 보냈냐.'];
}

// Pretty / reprimand: after clothes, before kill threat — still bound.
const clothesI = findBlock(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'yeontabal' &&
		Array.isArray(b.en) &&
		b.en.some((l) => l.includes('Your clothes don’t look like anything nearby') || l.includes("Your clothes don't look like anything nearby"))
);

const alreadyPretty = blocks.some(
	(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en.includes('Pretty. Just—')
);

const prettyBlocks = [
	{
		kind: 'p',
		html: 'His mouth is still answering the valley when his eyes quit. Past the spear. Past Tabal’s shoulder. The porch has her on it. Chin up. Dusty-rose in the door-dark. <b>He looks past the spear.</b>',
		ko: '입은 아직 골짜기에 답하는데 눈이 먼저 간다. 창 너머. 연타발 어깨 너머. 누대에 그녀가 있다. 턱. 문 어둠의 회분홍. <b>창 너머를 본다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Wait—', 'You. On the—', 'Pretty. Just—'],
		lines: ['잠깐—', '거기. 누대—', '예쁘다. 그냥—']
	},
	{
		kind: 'dialogue',
		person: 'yeontabal',
		chip: '#a97c4a',
		en: ['Eyes. Front.', 'That’s my hall.'],
		lines: ['눈. 앞.', '내 대청이야.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['…Who asked you.', 'Count the dirt.'],
		lines: ['…누가 물었어.', '흙이나 세.']
	},
	{
		kind: 'p',
		html: 'A spear-butt finds his shoulder. He stays on his knees. Wrists still behind. <b>The hall shoves him quiet.</b>',
		ko: '창 자루가 어깨를 찾는다. 무릎은 그대로다. 손목은 아직 뒤. <b>대청이 밀어 입을 닫힌다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['I— sorry. Not—', 'Ow— I said it.'],
		lines: ['저— 미안. 아닌—', '아야— 말했잖아요.']
	}
];

if (!alreadyPretty) {
	blocks.splice(clothesI + 1, 0, ...prettyBlocks);
}

const SUFFIX =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: dutch, crane, worm’s-eye, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro. HIGH CONTRAST: crushed blacks + one hard key + long shadows — not even daylight wash. ICONIC MINIMAL: ONE architectural device a lens can see; empty negative space; tiny figures or lower-third; the world stays in the shot. COLOR SYMBOLISM: hex is lighting / a plane / one accent — NEVER recolor portrait garments gold. Real Korean architecture: grey giwa, timber, packed earth. No army. No readable text. No watermark. Copy: movie frame in a real place, not a graphic poster; iconic one-device layout, empty frame, lower-third; high contrast chiaroscuro, not even wash; 2D animated cel-painterly, no photoreal; cinematography: dutch, wide, bokeh, mise-en-scène. Never: halo / bloom / glow around figures; graphic split-screen or black-triangle overlay; photoreal live-action or 3D archviz; busy extras crowding an iconic frame; copy-pasted reference as a fashion plate; flat even-daylight postcard wide.';

const SETTING_REFS = ['/temp/jumong-seq-tabal-night-wide.jpg', '/temp/jumong-seq-shed-night.jpg'];

const slots = [
	{
		id: 'jumong-tabal-rope-wide',
		at: 'on his knees before Tabal',
		alt: 'Bird’s-eye torch yard: tiny red Jumong kneeling, wrists bound, two anonymous spear-guards',
		people: ['jumong', 'yeontabal'],
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: bird’s-eye dead of night. LENS: shallow DOF, long-shadow torch key. Mise-en-scène: SAME Tabal night hall as attached setting stills — grey giwa munru, timber posts, packed earth, torch pools ONLY, crushed blacks. ONE device: two torch circles as hard gold coins on dirt. ONE Jumong kneeling lower-third, red silk #e8563f as the only warm plane, CLEAN-SHAVEN no mustache no goatee (ignore facial hair on portrait), wrists bound BEHIND his back with hemp rope, not standing. TWO anonymous spear-guards left and right — no named faces, do not clone Jumong or Tabal. Tabal a tiny tiger-pelt stamp on the porch, navy #141C2E rim. FACE AND GARMENTS from attached portraits. No daylight. No text. No watermark. ' +
			SUFFIX
	},
	{
		id: 'jumong-tabal-rope-dutch',
		at: 'Jumong’s knees in the packed earth',
		alt: 'Dutch three-body: Jumong kneeling bound, anonymous spears left and right',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch low three-shot. LENS: sharp spear-shafts in foreground, creamy torch bokeh. Mise-en-scène: Tabal night hall, packed earth, timber post as a hard vertical. ONE device: two spear lines making a V over a kneeling man. ONE Jumong mid-frame on his knees, red silk, CLEAN-SHAVEN no mustache no goatee, wrists hemp-bound behind the back, expressive protest-wince not a founder statue. TWO anonymous hall guards only — leather, spears, faces in shadow, never Jumong’s face, never Tabal. #e8563f as rim on his cheek. FACE from attached. No clones. No daylight. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-name-protest-ecu',
		at: 'I asked for a name.',
		alt: 'ECU Jumong kneeling: protest mouth, expressive, ropes behind',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: dutch ECU. LENS: shallow DOF, torch chiaroscuro, crushed black. Mise-en-scène: Tabal night hall dirt behind as bokeh. ONE Jumong filling the frame, KNEELING, shoulders twisted because wrists are bound behind his back with hemp rope. FACE ONLY from attached portrait: CLEAN-SHAVEN, no mustache, no goatee. Expressive protest: open mouth mid-word, brows up, scared-stupid then not, leftover wink dying. Red silk #e8563f as the plane. Wet. Not a grim founder statue. Not a standing clone. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-nobody-sent-ecu',
		at: 'Nobody sent me',
		alt: 'ECU Jumong scared-stupid grin, kneeling, wrists bound',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU slightly below. LENS: rack-focus, torch key, creamy black bokeh. ONE Jumong kneeling, hemp rope on wrists behind, red silk. FACE from attached: CLEAN-SHAVEN. Expression: scared-stupid grin that is trying to be easy and failing — swallow, half-laugh, eyes too wide. #e8563f rim. Tabal night hall timber melting into bokeh. No mustache. No goatee. No standing portrait. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-looks-up-easy',
		at: 'So who sent you',
		alt: 'Dutch: Jumong looking up too easy then not, kneeling bound under Tabal',
		people: ['jumong', 'yeontabal'],
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch worm’s-eye from packed earth. LENS: Jumong sharp, Tabal a dark tiger-pelt mass above. ONE Jumong kneeling looking UP, wrists bound behind, CLEAN-SHAVEN, grin too easy then collapsing. ONE Tabal only — tiger-pelt from attached, navy #141C2E as the upper plane, sour. Two anonymous spear-butts at frame edges, no named faces. Torch pools, crushed blacks. FACE from attached. No clones. No daylight. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-clothes-swallow',
		at: 'Your clothes don’t look like anything nearby',
		alt: 'ECU Jumong swallows / half-laughs, still kneeling bound',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU dutch. LENS: shallow DOF, torch sweat sheen. ONE Jumong kneeling, red silk wet, wrists bound behind. FACE from attached: CLEAN-SHAVEN. Expression: swallow, half-laugh, throat working, eyes flicking — not serene. #e8563f as cheek-plane. Night timber bokeh. No mustache. No founder statue. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-sees-her-ots',
		at: 'He looks past the spear.',
		alt: 'OTS past a spear: Sosuno chin-up on the porch; Jumong kneeling bound in dirt',
		people: ['jumong', 'sosuno'],
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png', ...SETTING_REFS],
		tone: '#e8a04a',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: over-shoulder past an anonymous spear-shaft. LENS: sharp FG spear, rack-focus to the porch. Mise-en-scène: SAME Tabal night hall. ONE Jumong kneeling in packed earth, red silk, CLEAN-SHAVEN, wrists hemp-bound behind, looking PAST the guard. ONE Sosuno on the timber porch, chin UP, not blushing yet, dusty-rose hanbok from attached, bird binyeo matching attached pin, #e8a04a as the porch-plane. TWO people only plus anonymous spear — do not clone faces. Torch pools, crushed blacks. FACE AND GARMENTS from attached. No daylight. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-sees-her-ecu',
		at: 'He looks past the spear.',
		alt: 'ECU Jumong face lighting up — grin, dumbstruck, too easy',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU eyes-and-mouth. LENS: shallow DOF, torch key from the side. ONE Jumong kneeling, wrists bound behind (shoulders pulled). FACE from attached: CLEAN-SHAVEN. Expression LIGHTING UP: dumbstruck grin, too easy, pupils wide, leftover wink, almost stupid-happy in a kill hall. #e8563f as the only accent. Dusty-rose #e8a04a bokeh far behind — not a second face clone. No mustache. No grim statue. No text. ' +
			SUFFIX
	},
	{
		id: 'sosuno-hall-chin',
		at: 'Who asked you.',
		alt: 'Dutch porch: Sosuno chin up, not blushing, dusty-rose in torch door-dark',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', ...SETTING_REFS],
		tone: '#e8a04a',
		prompt:
			'Intimate cinematic 16:9. CINEMATOGRAPHY: dutch low from the yard looking up the porch. LENS: shallow DOF, torch rim. ONE Sosuno, chin UP, cold, NOT blushing yet, covering. FACE AND GARMENTS from attached dusty-rose hanbok, white jeogori, black sash. Hair ornament matches attached bird binyeo. #e8a04a as the plane. Tabal night timber, grey giwa bokeh. Not a standing fashion plate — she is mid-turn, one hand on a post. Tiny red kneel in lower-third dirt, out of focus, no second Sosuno. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-pretty-threeshot',
		at: 'Pretty. Just—',
		alt: 'Worm’s-eye: bound Jumong on earth, Tabal between, Sosuno on the porch',
		people: ['jumong', 'yeontabal', 'sosuno'],
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png', '/ch_sosuno.png', '/bn_sosuno.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: worm’s-eye from packed earth. LENS: Jumong huge in lower third, others receding. ONE Jumong kneeling, wrists bound behind, red silk, CLEAN-SHAVEN, mouth mid-word. ONE Tabal in tiger-pelt midground, navy #141C2E wedge between them. ONE Sosuno on the porch above, dusty-rose, bird binyeo, chin up, #e8a04a stamp. ONE of each — never clone. Two anonymous spear-tips at the edges only. Torch chiaroscuro, crushed blacks, grey giwa. FACE AND GARMENTS from attached. No daylight. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-pretty-says',
		at: 'Pretty. Just—',
		alt: 'Intimate ECU Jumong mouth mid-word Pretty, kneeling, wrists behind',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU mouth and eyes, slight dutch. LENS: torch sweat, creamy bokeh. ONE Jumong kneeling, hemp rope visible on a pulled-back shoulder. FACE from attached: CLEAN-SHAVEN. Mouth MID-WORD, expressive, grin-stupid, too easy, saying pretty in a hall that will hit him. #e8563f plane. Not serene. Not a founder statue. No mustache. No text. ' +
			SUFFIX
	},
	{
		id: 'tabal-pretty-glare',
		at: 'Eyes. Front.',
		alt: 'OTS/ECU Tabal glare, navy rim, torch — reprimand',
		people: ['yeontabal'],
		refs: ['/ch_yeon_tabal.png', ...SETTING_REFS],
		tone: '#141C2E',
		prompt:
			'Intimate cinematic 16:9. CINEMATOGRAPHY: dutch ECU lean-in. LENS: hard torch key, half-face shadow. ONE Tabal, FACE AND tiger-pelt GARMENTS from attached, sour glare, mouth mid-order. Navy #141C2E as the crushed plane. Night timber. Tiny out-of-focus red kneel in lower corner, not a face clone. No second Tabal. No daylight. No text. ' +
			SUFFIX
	},
	{
		id: 'sosuno-pretty-cold',
		at: 'Count the dirt.',
		alt: 'ECU Sosuno cold chin, dusty-rose, not blushing — reprimand',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', ...SETTING_REFS],
		tone: '#e8a04a',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU chin and eyes, dutch. LENS: shallow DOF, torch rim. ONE Sosuno, FACE from attached, dusty-rose hanbok, bird binyeo matching attached. Expression: cold, covering, NOT blushing, a little mean. #e8a04a as the only accent. Door-dark timber. Not a smile. Not a fashion plate. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-pretty-oh',
		at: 'Ow— I said it.',
		alt: 'ECU Jumong oh / half-laugh / swallow after the shove, still kneeling bound',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU after a shove, dutch. LENS: motion in torch sparks, shallow DOF. ONE Jumong still KNEELING, wrists bound behind, red silk, CLEAN-SHAVEN. Face going OH: half-laugh, swallow, wince, leftover stupid grin dying. Shoulder hitch from a spear-butt. #e8563f rim. Not a grim statue. No mustache. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-how-i-die-ecu',
		at: 'So this is how I die',
		alt: 'ECU Jumong scared-stupid wince, bound, torch — how I die',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU looking up. LENS: crushed black, one torch. ONE Jumong kneeling, wrists bound behind, CLEAN-SHAVEN. Expression: scared, a little stupid, swallow, whisper-mouth, not noble. Red silk #e8563f. Tabal night hall. FACE from attached. No founder statue. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-stop-relief-ecu',
		at: 'Stop!',
		alt: 'ECU Jumong mid-relief leftover wink, still kneeling as Tabal shouts Stop',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU dutch. LENS: torch flare, rack-focus. ONE Jumong kneeling, hemp rope still on wrists behind, CLEAN-SHAVEN. Face mid-relief: wince opening into a leftover wink, breath, not a statue. #e8563f. Night timber bokeh. FACE from attached. No mustache. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-haemosu-grin-ecu',
		at: 'Son of Haemosu',
		alt: 'ECU Jumong grin flickers — Son of Haemosu — still on his knees',
		people: ['jumong'],
		refs: ['/ch_jumong.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Intimate cinematic ECU 16:9. CINEMATOGRAPHY: ECU from below. LENS: torch column bokeh. ONE Jumong kneeling, wrists just-bound or slack hemp behind, CLEAN-SHAVEN. Grin FLICKERS — scared then easy then not, claiming a sun-god like an idiot. Red silk #e8563f plane. FACE from attached. No mustache. No standing clone. No text. ' +
			SUFFIX
	},
	{
		id: 'jumong-pretty-tiny',
		at: 'He looks past the spear.',
		alt: 'Dutch hall: tiny red kneel in the yard, Sosuno a dusty-rose stamp on the porch',
		people: ['jumong', 'sosuno'],
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png', ...SETTING_REFS],
		tone: '#e8563f',
		prompt:
			'Minimal iconic 16:9 still. CINEMATOGRAPHY: dutch wide night hall. LENS: long shadows, one torch key. Mise-en-scène: SAME attached Tabal yard — grey giwa, timber, packed earth. ONE device: porch as a dark bar. Tiny red Jumong kneeling lower-third, wrists bound, CLEAN-SHAVEN silhouette. Tiny Sosuno dusty-rose #e8a04a on the porch, chin up, bird binyeo. Anonymous spears as thin black lines. Monumental emptiness. FACE suggestion from attached, not a fashion lineup. No army. No daylight. No text. ' +
			SUFFIX
	}
];

const existing = new Set((en.images ?? []).map((im) => im.id));
const afterId = 'jumong-seq-tabal-torch-ots';
let insertAt = en.images.findIndex((im) => im.id === afterId);
if (insertAt < 0) insertAt = en.images.length;
else insertAt += 1;

let added = 0;
for (const s of slots) {
	if (existing.has(s.id)) continue;
	en.images.splice(insertAt, 0, {
		id: s.id,
		ratio: 1.778,
		nsfw: false,
		tone: s.tone,
		at: s.at,
		alt: s.alt,
		refs: s.refs,
		people: s.people,
		prompt: s.prompt
	});
	insertAt += 1;
	added += 1;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const marker = "\t\t\t{ id: 'tabal-name-ecu', role: 'Name', angle: 'ECU torch', at: 'Name.' },";
const inject = [
	"\t\t\t{ id: 'jumong-tabal-rope-wide', role: 'dumped on knees', angle: 'bird’s-eye torch', at: 'on his knees before Tabal' },",
	"\t\t\t{ id: 'jumong-tabal-rope-dutch', role: 'rope two spears', angle: 'dutch three-body', at: 'Jumong’s knees in the packed earth' },",
	"\t\t\t{ id: 'tabal-name-ecu', role: 'Name', angle: 'ECU torch', at: 'Name.' },",
	"\t\t\t{ id: 'jumong-name-protest-ecu', role: 'name protest', angle: 'ECU', at: 'I asked for a name.' },",
	"\t\t\t{ id: 'jumong-seq-tabal-torch-ots', role: 'interrogation', angle: 'OTS torch', at: 'So who sent you' },",
	"\t\t\t{ id: 'tabal-who-sent-ecu', role: 'who sent you', angle: 'ECU', at: 'So who sent you' },",
	"\t\t\t{ id: 'jumong-nobody-sent-ecu', role: 'nobody sent me', angle: 'ECU grin', at: 'Nobody sent me' },",
	"\t\t\t{ id: 'jumong-looks-up-easy', role: 'looks up too easy', angle: 'worm’s-eye', at: 'So who sent you' },",
	"\t\t\t{ id: 'jumong-clothes-swallow', role: 'clothes swallow', angle: 'ECU', at: 'Your clothes don’t look like anything nearby' },",
	"\t\t\t{ id: 'jumong-pretty-tiny', role: 'tiny red sees her', angle: 'dutch wide', at: 'He looks past the spear.' },",
	"\t\t\t{ id: 'jumong-sees-her-ots', role: 'looks past the spear', angle: 'OTS spear', at: 'He looks past the spear.' },",
	"\t\t\t{ id: 'jumong-sees-her-ecu', role: 'face lights up', angle: 'ECU', at: 'He looks past the spear.' },",
	"\t\t\t{ id: 'sosuno-hall-chin', role: 'her chin up', angle: 'dutch porch', at: 'Who asked you.' },",
	"\t\t\t{ id: 'jumong-pretty-threeshot', role: 'bound / Tabal / porch', angle: 'worm’s-eye', at: 'Pretty. Just—' },",
	"\t\t\t{ id: 'jumong-pretty-says', role: 'he says pretty', angle: 'ECU mouth', at: 'Pretty. Just—' },",
	"\t\t\t{ id: 'tabal-pretty-glare', role: 'Tabal reprimand', angle: 'ECU glare', at: 'Eyes. Front.' },",
	"\t\t\t{ id: 'sosuno-pretty-cold', role: 'Sosuno reprimand', angle: 'ECU chin', at: 'Count the dirt.' },",
	"\t\t\t{ id: 'jumong-pretty-oh', role: 'shove oh', angle: 'ECU', at: 'Ow— I said it.' },",
	"\t\t\t{ id: 'jumong-how-i-die-ecu', role: 'how I die face', angle: 'ECU', at: 'So this is how I die' },"
].join('\n');

if (!seq.includes("id: 'jumong-tabal-rope-wide'")) {
	if (!seq.includes(marker)) throw new Error('sequence marker missing');
	// Remove the old torch-ots / who-sent lines that immediately follow Name so we do not duplicate.
	seq = seq.replace(
		"\t\t\t{ id: 'tabal-name-ecu', role: 'Name', angle: 'ECU torch', at: 'Name.' },\n\t\t\t{ id: 'jumong-seq-tabal-torch-ots', role: 'interrogation', angle: 'OTS torch', at: 'So who sent you' },\n\t\t\t{ id: 'tabal-who-sent-ecu', role: 'who sent you', angle: 'ECU', at: 'So who sent you' },\n\t\t\t{ id: 'jumong-pov-tabal-kill', role: 'how I die', angle: 'Jumong POV', at: 'So this is how I die' },",
		inject + "\n\t\t\t{ id: 'jumong-pov-tabal-kill', role: 'how I die', angle: 'Jumong POV', at: 'So this is how I die' },"
	);
	seq = seq.replace(
		"\t\t\t{ id: 'jumong-seq-tabal-stop', role: 'Stop', angle: 'hand ECU torch', at: 'Stop!' },\n\t\t\t{ id: 'jumong-seq-tabal-lineage', role: 'names Haemosu', angle: 'worm’s-eye', at: 'Son of Haemosu' },",
		"\t\t\t{ id: 'jumong-seq-tabal-stop', role: 'Stop', angle: 'hand ECU torch', at: 'Stop!' },\n\t\t\t{ id: 'jumong-stop-relief-ecu', role: 'his relief', angle: 'ECU', at: 'Stop!' },\n\t\t\t{ id: 'jumong-seq-tabal-lineage', role: 'names Haemosu', angle: 'worm’s-eye', at: 'Son of Haemosu' },\n\t\t\t{ id: 'jumong-haemosu-grin-ecu', role: 'grin flickers', angle: 'ECU', at: 'Son of Haemosu' },"
	);
	fs.writeFileSync(SEQ, seq);
}

fs.writeFileSync(
	'scripts/.cache/tabal-capture-pretty-manifest.json',
	JSON.stringify(
		slots.map(({ id, alt, prompt }) => ({ id, alt, prompt })),
		null,
		'\t'
	) + '\n'
);

console.log(`Jumong images now ${en.images.length}; added ${added}; pretty inserted=${!alreadyPretty}`);
