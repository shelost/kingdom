import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const HOUSE =
	'EVERY FRAME A PAINTING: compose as a master canvas — one geometry or one body owns the frame; light is the plot; negative space is ink; not coverage, not a tourist postcard, not a game-map. 2D animated cel-painterly cinema, not photoreal, not live-action, not 3D CGI. Same film stock: anamorphic movie frame, shallow DOF, creamy bokeh, rack-focus, film grain. A CAMERA in a real Korean place — NEVER a graphic poster, split-screen collage, 3D archviz, black-triangle overlay, spotlight cone deleting the landscape, or neon outline. NO halo, bloom, glow, rim-aura, or god-ray envelope around people — light is a plane or a hard key. FACE AND GARMENTS from the attached portrait — NEVER copy the portrait stance, clasped hands, 3/4 fashion lineup, or a standing clone. Invent a new DRAMATIC body every still (mid-stride, kneel, dutch, worm’s-eye, lower-third). CINEMATOGRAPHY: dutch, crane, worm’s-eye, over-shoulder, rack focus, shallow DOF / bokeh, chiaroscuro. HIGH CONTRAST: crushed blacks + one hard key + long shadows — not even daylight wash. ICONIC MINIMAL: ONE architectural device a lens can see; empty negative space; tiny figures or lower-third; the world stays in the shot. COLOR SYMBOLISM: hex is lighting / a plane / one accent — NEVER recolor portrait garments gold. Real Korean architecture: grey giwa, timber, packed earth. No army. No readable text. No watermark. Copy: movie frame in a real place, not a graphic poster; iconic one-device layout, empty frame, lower-third; high contrast chiaroscuro, not even wash; 2D animated cel-painterly, no photoreal; cinematography: dutch, wide, bokeh, mise-en-scène. Never: halo / bloom / glow around figures; graphic split-screen or black-triangle overlay; photoreal live-action or 3D archviz; busy extras crowding an iconic frame; copy-pasted reference as a fashion plate; flat even-daylight postcard wide.';

const SLOTS = [
	{
		id: 'yuhwa-amnok-dusk-expo',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Dusk on the Amnok is a low gold bar',
		alt: 'Wide dusk Amnok: three river-daughters in the shallows; Yuhwa looking up; gold chariot a tiny house',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'hwahye', 'wihye', 'haemosu']
	},
	{
		id: 'yuhwa-sisters-dive-wake',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Two wakes cut the shallows; Yuhwa stays',
		alt: 'Dutch Amnok: Hwahye and Wihye diving; Yuhwa standing looking up in wet ice-blue silk',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png'],
		people: ['yuhwa', 'hwahye', 'wihye']
	},
	{
		id: 'haemosu-lookdown-goldrail',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'He leans over the gold rail and drops the hour',
		alt: 'OTS from the gold chariot rail: Haemosu looking down at Yuhwa alone in the Amnok',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png'],
		people: ['haemosu', 'yuhwa']
	},
	{
		id: 'yuhwa-copper-room-rise',
		ratio: 1.778,
		tone: '#c47a3a',
		nsfw: false,
		at: 'The copper room rises on the bank like a kiln',
		alt: 'Iconic Amnok bank: copper hut as a kiln stamp; gold chariot still in the sky; tiny Yuhwa',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png'],
		people: ['haemosu', 'yuhwa']
	},
	{
		id: 'nsfw-yuhwa-copper-kiss',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She kisses him with river still on her mouth',
		alt: 'Intimate close: Yuhwa kissing Haemosu in the copper room, wet ice-blue silk, wanting faces',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'nsfw-yuhwa-copper-pinned',
		ratio: 0.75,
		tone: '#f0b429',
		nsfw: true,
		at: 'Pinned to the copper, she does not look away',
		alt: 'Intimate: Yuhwa pinned to hammered copper, hiked ice-blue silk, wanting, gold light-plane',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'nsfw-yuhwa-wet-silk-grind',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Wet silk hiked, gold light as a hard plane',
		alt: 'Intimate grind silhouette: wet ice-blue silk hiked against copper; gold as a hard light plane',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'nsfw-yuhwa-wanting-ecu',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Her face goes wanting against the wall-heat',
		alt: 'ECU: Yuhwa climax-adjacent wanting face, heavy blush, copper bokeh, Haemosu gold key',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'nsfw-yuhwa-ots-copper-back',
		ratio: 0.75,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'From his shoulder: her ice-blue back on copper',
		alt: 'OTS from Haemosu: Yuhwa’s wet ice-blue back against copper, looking over her shoulder',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'nsfw-yuhwa-dutch-two-shot',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: true,
		at: 'Dutch two-shot: sun and river sharing one mouth',
		alt: 'Dutch two-shot in the copper room: Haemosu and Yuhwa close, wanting, gold plane, ice-blue silk',
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_haemosu.png'],
		people: ['yuhwa', 'haemosu']
	},
	{
		id: 'habek-finds-copper-cast',
		ratio: 1.778,
		tone: '#2f8f7a',
		nsfw: false,
		at: 'Habek finds the kiln still warm and casts her out',
		alt: 'Iconic Amnok: Habek pointing the current as a border; Yuhwa ice-blue leaving; copper hut still warm',
		refs: ['/ch_habek.png', '/ch_yuhwa.png', '/bn_yuhwa.png'],
		people: ['habek', 'yuhwa']
	}
];

const PROMPTS = {
	'yuhwa-amnok-dusk-expo':
		'Minimal iconic 16:9 still. Bird’s-eye dusk exposition. REAL Amnok shallows: wet stones, packed-earth bank, timber, natural dusk clouds — not a boat catalog. THREE adult river-daughters waist-deep, ONE of each: Yuhwa FACE AND GARMENTS from attached, ice-blue wet silk #8fc4e0, pearl-wave binyeo matching attached board, chin lifted looking STRAIGHT UP; Hwahye FACE from attached turning toward the current; Wihye FACE from attached. ONE device: dusk as a LOW GOLD BAR #f0b429 across the water-plane. Tiny gold wheeled sun-chariot high in sky — TWO spoked wheels, gold rail, floor, yoke, five living dragons gold/crimson/azure/jade/white (do not invent a new chariot). Lower-third / small figures, monumental emptiness. Wet silk clinging, skin-forward bathing, not a fashion lineup. Black Korean pupils, dark irises. Magical sun as a LIGHT PLANE on water, never a body-halo. High contrast chiaroscuro. Painterly 2D cel cinema, Greek-myth river bath. No army. No text. No watermark. ' +
		HOUSE,
	'yuhwa-sisters-dive-wake':
		'Minimal iconic 16:9 still. Dutch angle, same REAL Amnok shallows. Hwahye FACE from attached mid-dive into the current, spray; Wihye FACE from attached laughing mid-dive after her — they are leaving. Yuhwa FACE from attached standing waist-deep, looking STRAIGHT UP, ice-blue wet silk hiked at the hip, binyeo matching attached, she does not run. ONE of each sister. ONE device: two white WAKES as hard diagonals cutting the water. Gold chariot a tiny house in cloudy dusk. Ice-blue #8fc4e0 as water-plane accent. Black Korean pupils. Light as a gold plane on ripples, never a halo. High contrast. Dramatic bodies, not portrait clones. No text. No watermark. ' +
		HOUSE,
	'haemosu-lookdown-goldrail':
		'Minimal iconic 16:9 still. Over-shoulder from HIGH in the SAME gold wheeled sun-chariot. Foreground: gold RAIL and one large gold spoked WHEEL RIM, creamy bokeh. Haemosu FACE from attached, silver-white topknot, white silky hanbok, leaning over the rail looking DOWN — stunned appetite, not a standing portrait clone. Gold #f0b429 as the light-plane through the rail gap, never a body-halo, never recolor his white silk gold. Far below: real Amnok ribbon, tiny adult Yuhwa waist-deep looking up, ice-blue #8fc4e0. Same five living dragons gold/crimson/azure/jade/white. Natural dusk sky. Black Korean pupils. High contrast chiaroscuro. No pagoda, no gazebo, no copper disc replacing the chariot. No text. No watermark. ' +
		HOUSE,
	'yuhwa-copper-room-rise':
		'Minimal iconic 16:9 still. Worm’s-eye on the SAME Amnok bank. ONE device: a copper hut rising as a KILN STAMP — hammered copper walls, timber posts, small earth structure on packed earth, not a hovering disc, not a chariot. Tiny Haemosu FACE from attached in white silk at the doorway, mid-build. Tiny Yuhwa ice-blue in the river strip. SAME gold wheeled five-dragon chariot still in the cloudy sky (two wheels, gold rail). Copper warmth #c47a3a as the single accent plane; Haemosu gold #f0b429 as a slit of light in the doorway, not a halo. Natural Earth sky. Monumental emptiness. High contrast. No furniture dump. No text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-copper-kiss':
		'Intimate close 3:4 still. Same copper room on the Amnok bank: hammered copper wall as ONE warm plane, crushed blacks, one hard gold key as a LIGHT PLANE through a slit — never a body-halo. Adult Yuhwa FACE AND GARMENTS from attached, ice-blue wet silk #8fc4e0 off one shoulder, pearl-wave binyeo matching attached, kissing Haemosu with river still on her mouth. Haemosu FACE from attached, silver-white hair, white silk open, gold #f0b429 as the light not costume paint. Wanting faces: open mouth, heavy blush, sweat, black Korean pupils. Bodies close, skin-forward, history-painting heat (Titian river-god), 2D cel-painterly, not photoreal porn. Dramatic lean, not a fashion plate. No readable text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-copper-pinned':
		'Intimate close 3:4 still. Same copper room. Yuhwa PINNED to hammered copper, back to the wall, wet ice-blue silk hiked at the hips, thighs, wanting face looking at him — FACE from attached, binyeo matching attached, heavy blush, bitten mouth, black Korean pupils. Haemosu FACE from attached pressing her, white silk, silver-white hair, gold #f0b429 as a hard vertical LIGHT PLANE on copper, never a halo. Skin-forward grind silhouette, manhwa panel appetite, climax-adjacent, not a porn-act catalog. High contrast chiaroscuro. One of each. No text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-wet-silk-grind':
		'Intimate close 3:4 still. Same copper room. Wet ice-blue silk hiked, bodies grinding close against copper, skin-forward, not genitals-as-subject. Yuhwa FACE from attached over her shoulder, wanting, drool, sweat, black pupils, binyeo matching attached. Haemosu gold light as a HARD PLANE slicing the frame, white silk, FACE from attached. ONE device: gold light-plane vs copper wall. History-painting + 2D cel. No halo. No text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-wanting-ecu':
		'Intimate ECU 3:4 still. Yuhwa FACE from attached filling the frame, climax-adjacent wanting: open mouth, heavy blush, sweat drop, blown black Korean pupils, messy wet hair, binyeo matching attached. Haemosu mouth at her throat as a gold #f0b429 key, FACE from attached at the edge. Copper wall creamy bokeh. Manhwa panel, erotic comic framing, not photoreal porn. Light is a plane. No text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-ots-copper-back':
		'Intimate OTS 3:4 still. Camera over Haemosu’s white-silk shoulder. Midground: Yuhwa’s wet ice-blue back against hammered copper, looking over her shoulder, FACE from attached, binyeo matching attached, wanting. Haemosu FACE from attached in the near foreground edge. ONE device: her back as a pale-blue COLUMN on copper. Gold #f0b429 light-plane from a slit. Black pupils. Skin-forward. Same copper room. No text. No watermark. ' +
		HOUSE,
	'nsfw-yuhwa-dutch-two-shot':
		'Intimate 16:9 dutch two-shot. Same copper room. Yuhwa FACE from attached and Haemosu FACE from attached sharing one mouth-line, wet ice-blue silk and white silk, wanting, heavy blush, black Korean pupils. ONE of each. ONE device: dutch copper wall as a diagonal. Gold #f0b429 as a hard light-plane, ice-blue #8fc4e0 as her silk. Skin-forward history-painting cinema, 2D cel. No halo. No text. No watermark. ' +
		HOUSE,
	'habek-finds-copper-cast':
		'Minimal iconic 16:9 still. Dutch Amnok bank after. Habek FACE from attached, pale river-god silk, teal #2f8f7a rim only, pointing the current as a border — mid-gesture, not a pointing-portrait clone. Yuhwa FACE from attached, ice-blue silk, binyeo matching attached, mid-turn leaving. ONE device: the river as a hard diagonal border; copper hut a small warm stamp still behind them. Natural sky, wet stones, mist. Monumental emptiness. High contrast. Black Korean pupils. No army. No text. No watermark. ' +
		HOUSE
};

for (const s of SLOTS) s.prompt = PROMPTS[s.id];

function blob(b) {
	if (b.html) return b.html + ' ' + (b.ko ?? '');
	return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
}

function hasNeedle(blocks, needle) {
	return blocks.some((b) => blob(b).includes(needle));
}

function insertAfterNeedle(blocks, needle, items) {
	const keep = items.filter((b) => !hasNeedle(blocks, blob(b).slice(0, 48)));
	if (!keep.length) return;
	const i = blocks.findIndex((b) => blob(b).includes(needle));
	const at = i < 0 ? blocks.length : i + 1;
	blocks.splice(at, 0, ...keep);
}

let found = false;
for (const ch of story) {
	for (const en of ch.entries ?? []) {
		if (en.title !== 'Jumong') continue;
		found = true;
		en.images ??= [];
		const have = new Set(en.images.map((im) => im.id));
		for (const s of SLOTS) {
			if (have.has(s.id)) {
				const i = en.images.findIndex((im) => im.id === s.id);
				en.images[i] = { ...en.images[i], ...s };
			} else {
				en.images.push(s);
			}
		}

		const B = en.blocks;
		insertAfterNeedle(B, 'Then he looks down and the hour breaks', [
			{
				kind: 'p',
				html: '<b>Dusk on the Amnok is a low gold bar</b> — three daughters still in the water, Yuhwa’s chin already up.',
				ko: '<b>압록의 땅거미는 낮은 금빛 띠다</b> — 세 딸이 아직 물에 있고, 유화의 턱은 이미 올라가 있다.'
			}
		]);
		insertAfterNeedle(B, 'Yuhwa is the only one who does not dive away', [
			{
				kind: 'dialogue',
				chip: '#8fc4e0',
				person: 'yuhwa',
				lines: ['언니들— 잠깐. 나는… 남을게요.'],
				en: ['Sisters— wait. I… I’m staying.']
			},
			{
				kind: 'p',
				html: '<b>Two wakes cut the shallows; Yuhwa stays.</b> Hwahye first, then Wihye after her laugh. The youngest does not dive.',
				ko: '<b>여울을 두 줄기가 가른다. 유화는 남는다.</b> 화혜가 먼저, 위혜는 웃고 따라간다. 막내는 잠수하지 않는다.'
			}
		]);
		insertAfterNeedle(B, 'I’m coming down. Right now.', [
			{
				kind: 'p',
				html: '<b>He leans over the gold rail and drops the hour.</b> The five dragons keep pulling; he does not.',
				ko: '<b>그는 금 난간에 기대어 시각을 떨어뜨린다.</b> 다섯 용은 계속 끈다. 그만 안 끈다.'
			}
		]);
		insertAfterNeedle(B, 'He comes down. He builds a copper room', [
			{
				kind: 'p',
				html: '<b>The copper room rises on the bank like a kiln</b> — hammered walls, timber posts, an afternoon’s heat boxed in so the sky cannot watch the rest.',
				ko: '<b>구리 방이 강가에 가마처럼 올라선다</b> — 두드린 벽, 나무 기둥, 오후의 열을 상자 안에 넣어, 하늘이 나머지를 못 보게.'
			}
		]);
		insertAfterNeedle(B, 'If you press me to it', [
			{
				kind: 'p',
				nsfw: true,
				html: '<b>She kisses him with river still on her mouth.</b> The copper is already hot. He does not wait for it to cool.',
				ko: '<b>그녀는 강물이 아직 입술에 남은 채로 그를 입맞춘다.</b> 구리는 이미 뜨겁다. 그는 식을 때까지 기다리지 않는다.'
			},
			{
				kind: 'dialogue',
				nsfw: true,
				chip: '#8fc4e0',
				person: 'yuhwa',
				lines: ['구리에 밀려도 눈 안 돌릴게요. 보세요.'],
				en: ['Pinned to the copper, she does not look away. I mean— I won’t. Look at me.']
			},
			{
				kind: 'p',
				nsfw: true,
				html: '<b>Wet silk hiked, gold light as a hard plane</b> — not a halo, just the slit in the wall doing the work of a sun.',
				ko: '<b>젖은 비단이 걷히고, 금빛은 단단한 면이다</b> — 후광이 아니라, 벽의 틈이 해 일을 하는 것뿐.'
			},
			{
				kind: 'dialogue',
				nsfw: true,
				chip: '#8fc4e0',
				person: 'yuhwa',
				lines: ['얼굴이— 벽 열 때문에— 이상해져. 더—'],
				en: ['Her face goes wanting against the wall-heat. Don’t you dare stop.']
			},
			{
				kind: 'p',
				nsfw: true,
				html: '<b>From his shoulder: her ice-blue back on copper.</b> He looks past his own sleeve and she is still looking back.',
				ko: '<b>그의 어깨 너머: 구리 위의 얼음빛 등.</b> 제 소매 너머로 보면, 그녀는 아직 돌아보고 있다.'
			},
			{
				kind: 'p',
				nsfw: true,
				html: '<b>Dutch two-shot: sun and river sharing one mouth.</b> After that the hour is a rumor.',
				ko: '<b>더치 투샷: 해와 강이 입을 하나 나눈다.</b> 그다음 시각은 소문이다.'
			}
		]);
		insertAfterNeedle(B, 'The Amnok keeps its own court', [
			{
				kind: 'p',
				html: '<b>Habek finds the kiln still warm and casts her out.</b> Mist comes in like a door. The current is a border again.',
				ko: '<b>하백이 아직 따뜻한 가마를 보고 내쫓는다.</b> 안개가 문처럼 들어온다. 여울이 다시 국경이다.'
			}
		]);
		break;
	}
}

if (!found) {
	console.error('Jumong entry not found');
	process.exit(1);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched', SLOTS.map((s) => s.id).join(', '));
