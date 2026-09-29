import { readFileSync, writeFileSync } from 'node:fs';

const STORY = 'src/lib/data/story.json';
const SEQ = 'src/lib/movieSequences.ts';
const HOUSE = 'src/lib/data/image-prompt-house.json';

const story = JSON.parse(readFileSync(STORY, 'utf8'));
const { suffix } = JSON.parse(readFileSync(HOUSE, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const ids = new Set(jumong.images.map((im) => im.id));
const add = (slot) => {
	if (ids.has(slot.id)) throw new Error(`dup slot ${slot.id}`);
	ids.add(slot.id);
	jumong.images.push(slot);
};

const SFX = ` ${suffix}`;

const slots = [
	{
		id: 'daughter-teal-ass-back',
		ratio: 1.778,
		tone: '#2aa89a',
		nsfw: true,
		at: 'Ass first onto him',
		alt: 'Intimate two-shot: anonymous teal daughter backs her hips onto Jumong’s thigh at the granite well, aegyo look-back',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 two-shot. SAME Jolbon well: round granite rim, timber T-beam, hemp rope, two buckets on packed earth, grey giwa hall — architecture from the attached empty-well still, not a new courtyard. ONE anonymous adult teal-silk Jolbon daughter (not Sosuno, not Yuhwa) backing her plump hips onto Jumong’s thigh at the rim, hiked teal chima, aegyo look-back over her shoulder, wanting playful face, heavy blush, bitten mouth, not serene. ONE Jumong: CLEAN-SHAVEN (ignore mustache on the portrait), easy sun-grin, red silk #e8563f as the single accent plane, FACE from attached Jumong portrait, mid-stumble not a standing clone. ONE of each. Nobody in the well shaft. High contrast chiaroscuro. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'daughter-saffron-ass-back',
		ratio: 1.778,
		tone: '#d4a017',
		nsfw: true,
		at: 'She backs it onto his thigh',
		alt: 'OTS well: anonymous saffron daughter backs her ass onto Jumong’s hip, hike, laugh in his ear',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 OTS. SAME Jolbon well: granite rim, timber T-beam, two buckets, packed earth — architecture from attached empty well. ONE anonymous adult saffron-silk daughter hitching her plump ass back onto Jumong’s hip at the rim, chima hiked, look-back laugh, wanting aegyo, not a polite smile. ONE Jumong CLEAN-SHAVEN easy grin, red #e8563f silk, FACE from attached, mid-turn. ONE of each. No Sosuno. No named faces invented. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'daughter-plum-ass-back',
		ratio: 1.778,
		tone: '#c4a06a',
		nsfw: true,
		at: 'Plum laughs and backs it',
		alt: 'Dutch well: anonymous plum daughter backs onto Jumong’s thigh, aegyo, two buckets',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 DUTCH. SAME Jolbon well lock. ONE anonymous adult dusty-plum silk daughter backing her hips onto Jumong’s thigh, aegyo look-back, hiked chima, wanting face. ONE Jumong CLEAN-SHAVEN sun-grin, red #e8563f, FACE from attached. ONE device: the timber T-beam as a hard horizontal. Packed earth, two buckets. No Sosuno clone. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'jumong-seq-daughters-ass-two',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: true,
		at: 'He grins at the wrong well',
		alt: 'Two-shot: Jumong’s clean-shaven red grin; teal daughter’s hiked hip in the sharp foreground',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 two-shot. Foreground: one anonymous teal daughter’s hiked hip and look-back cheek as a sharp silk bar. Midground: ONE Jumong CLEAN-SHAVEN easy grin, red silk #e8563f plane, FACE from attached — ignore portrait mustache, not a standing clone. SAME granite well, T-beam melting to creamy bokeh. ONE of each. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'daughter-teal-aegyo-ecu',
		ratio: 1.778,
		tone: '#2aa89a',
		nsfw: true,
		at: 'Aegyo look-back',
		alt: 'ECU: anonymous teal daughter look-back aegyo at the well-beam, flush, wanting',
		people: [],
		refs: ['/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic ECU 16:9. ONE anonymous adult teal-silk Jolbon daughter filling the frame, look-back over her shoulder, aegyo, heavy blush, bitten mouth, wanting — not serene, not Sosuno. Timber well-beam as a dark bar. SAME granite rim in creamy bokeh. No named face invented. No Jumong clone. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'daughter-saffron-lookback-hike',
		ratio: 1.778,
		tone: '#d4a017',
		nsfw: true,
		at: 'She hikes it like a dare',
		alt: 'OTS hike: anonymous saffron daughter looks back, chima hiked at the well rim',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 OTS hike. ONE anonymous adult saffron daughter looking back, chima hiked like a dare, plump hip, wanting aegyo. Jumong a CLEAN-SHAVEN red #e8563f sliver grinning at the rim, FACE from attached if visible. SAME well: granite, T-beam, two buckets. ONE of each. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-wide-lock',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'The loft is the whole room first',
		alt: 'Dutch wide: SAME grain loft — timber posts, millet sacks, paper window; Sosuno a dusty-rose lower-third',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic 16:9 DUTCH wide-enough to lock the room. SAME Jolbon grain loft as the attached loft still — architecture ONLY: dark timber posts, millet sacks, paper window rectangle, loft boards, stairs in bokeh. Do NOT copy the attached modest seated pose. ONE Sosuno lower-third on the boards, dusty-rose worker hanbok NOT gold, hiked, legs starting to open, FACE and garments from attached worker portrait, bird binyeo from attached. Wanting flush, bitten mouth — not serene. #e8a04a rim only. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-legs-wide',
		ratio: 0.75,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Legs wide on the timber.',
		alt: 'Loft 3:4: Sosuno on timber, legs spread wide open, hiked dusty-rose, wanting flush',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic CLOSE 3:4. SAME grain loft architecture from attached still — timber, sacks, window — NOT her old seated-modest pose. ONE adult Sosuno sitting on loft boards, legs spread wide open, dusty-rose chima hiked around hips, silk bunched, wanting face, heavy flush, bitten mouth, blown pupils, manhwa panel, erotic comic framing, sweat. FACE and dusty-rose garments from attached worker portrait. Hair ornament matches attached bird binyeo. ONE device: the paper window as a pale rectangle. #e8a04a rim only. Adult only. Skin-forward movie still. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-dutch-spread',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Timber under the knees',
		alt: 'Dutch loft: Sosuno leaning, legs open, hiked dusty-rose, tsundere glare at the door',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 DUTCH. SAME loft. ONE Sosuno leaning on loft boards, knees wide, dusty-rose hiked, hand under the chima implied as a silk hitch, tsundere glare at the dark door-void — mad he is in her head — wanting flush, bitten mouth, not a cold girl-boss statue. FACE and garments from attached worker portrait, bird binyeo. ONE device: the tilted timber post. #e8a04a rim. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-worm-open',
		ratio: 0.5625,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Little Sosuno.',
		alt: 'Worm’s-eye from loft boards: Sosuno above, legs open, hiked dusty-rose, wrecked wanting',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic CLOSE 9:16 WORM’S-EYE from loft floorboards looking UP. SAME grain loft. ONE Sosuno above the camera, legs spread, hiked dusty-rose, wanting climax-adjacent face, heavy blush, open or bitten mouth, not serene. FACE and garments from attached worker portrait, bird binyeo. ONE device: floorboards racing to her. #e8a04a rim. Adult only. Skin-forward. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-ots-hips',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Silk hitch',
		alt: 'OTS hips: hiked dusty-rose, Sosuno’s wanting look-back across loft timber',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 OTS from behind her hips. SAME loft. ONE Sosuno, plump hips in hiked dusty-rose silk, look-back over the shoulder, wanting flush, bitten mouth, bird binyeo. FACE from attached worker portrait. Hand under the chima as a silk hitch, not an anatomy catalog. ONE device: her hip-curve as an S against crushed timber. #e8a04a rim only. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-idiot-ecu',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Idiot. Don’t grin in my head',
		alt: 'ECU: Sosuno loft face, tsundere glare, flush, bitten mouth — mad he is grinning in her head',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate cinematic ECU 16:9. FACE FILL ONE Sosuno, worker dusty-rose at the collar, bird binyeo. Tsundere: glare, heavy flush, bitten mouth, blown pupils, sweat — she is calling him idiot in her head, mean then wanting, not serene beauty. Timber loft melts to creamy bokeh. FACE from attached worker portrait. #e8a04a rim only. Manhwa panel, erotic comic framing. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-tsun-glare',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'This is your fault, big idiot',
		alt: 'Dutch ECU: Sosuno glares at the loft door-void, hiked dusty-rose, wanting and furious',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-sosuno-loft-spread.jpg'],
		prompt:
			'Intimate cinematic CLOSE 16:9 DUTCH. ONE Sosuno on loft boards, hiked dusty-rose, legs open, glaring at the dark door as if Jumong could walk in — tsundere covering, furious blush, wanting. FACE and garments from attached worker portrait, bird binyeo. SAME loft architecture. ONE device: the door as a black rectangle. #e8a04a rim. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-loft-want-climax',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'She comes on the timber',
		alt: 'ECU wrecked: Sosuno climax expression on loft timber, hiked dusty-rose, teeth in wrist',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt:
			'Intimate cinematic ECU 16:9. ONE Sosuno climax expression, ahegao-adjacent, teeth in her wrist, heavy blush, sweat, hiked dusty-rose at the edge of frame, manhwa panel. FACE from attached worker portrait, bird binyeo. Timber loft creamy bokeh. Wanting wrecked — not a polite smile. #e8a04a rim. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-queen-ass-dutch',
		ratio: 0.75,
		tone: '#e8a04a',
		nsfw: true,
		at: 'her royal ass is the picture.',
		alt: 'Dutch behind: Queen Sosuno plump silk ass fills the frame, look-back, grain lamp',
		people: ['sosuno'],
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/temp/nsfw-royal-queen-ass.jpg'],
		prompt:
			'Intimate cinematic CLOSE 3:4 DUTCH. Camera BEHIND adult Queen Sosuno: plump ass in silky royal chima/jeogori fills the frame, three-quarter rear, looking over her shoulder, wanting flush, bitten mouth — not the serene face on the silk-lock still. FACE from attached queen portrait. Hair ornament matches attached bird binyeo. The attached queen-ass still is SILK/BODY LANGUAGE ONLY — plump rear, silky drape, look-back — NOT a face ref, do not copy that face. Royal burgundy garments from the queen portrait, NOT gold-wash, NOT dusty-rose worker. #e8a04a lamp-rim only. Grain-room timber, millet sacks, lamp chiaroscuro. ONE Sosuno. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-queen-ass-majesty',
		ratio: 0.75,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Only you can have this queen’s ass, your majesty',
		alt: 'Three-quarter rear: Queen Sosuno plump silk hips, look-back blush, millet sacks',
		people: ['sosuno'],
		refs: ['/ch_sosuno_queen.png', '/bn_sosuno.png', '/temp/nsfw-royal-queen-ass.jpg'],
		prompt:
			'Intimate cinematic CLOSE 3:4 three-quarter rear. Adult Queen Sosuno on millet sacks, plump ass in silky royal robe, looking back over her shoulder with a wanting blush and bitten mouth, bird gache binyeo. FACE from attached queen portrait. Attached queen-ass still is garment/pose lock only — plump silk rear — NEVER copy that face. ONE device: her back as a monumental column. #e8a04a rim only. Adult only. No text. No watermark.' +
			SFX
	},
	{
		id: 'nsfw-sosuno-worker-ass-silk',
		ratio: 0.75,
		tone: '#e8a04a',
		nsfw: true,
		at: 'Worker silk, same grammar',
		alt: 'From behind: worker Sosuno plump dusty-rose ass, look-back, same silk grammar as the queen plate',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/temp/nsfw-royal-queen-ass.jpg'],
		prompt:
			'Intimate cinematic CLOSE 3:4. Camera BEHIND adult worker Sosuno: plump ass in silky dusty-rose chima and white jeogori fills the frame, three-quarter rear, looking over her shoulder, wanting flush, bitten mouth. FACE and dusty-rose garments from attached WORKER portrait — NOT the queen burgundy dragon robe. Hair ornament matches attached simple bird binyeo. The attached queen-ass still is SILK/BODY LANGUAGE ONLY (plump rear, silky drape, look-back) — NOT a face ref, do not copy that face or that red dragon cloth. #e8a04a rim only. Grain loft or well-beam timber, lamp chiaroscuro. ONE Sosuno. Adult only. No text. No watermark.' +
			SFX
	}
];

for (const s of slots) add(s);

const insertAfter = (pred, blocks) => {
	const i = jumong.blocks.findIndex(pred);
	if (i < 0) throw new Error('insert marker missing');
	jumong.blocks.splice(i + 1, 0, ...blocks);
};

insertAfter(
	(b) => b.kind === 'p' && b.html?.includes('He flirts at the wrong well.'),
	[
		{
			kind: 'p',
			nsfw: true,
			html: 'Teal does not ask. She steps back until her hip finds his thigh and stays there, like the beam made her do it. Look-back. Soft mouth. The laugh is for him. <b>Ass first onto him.</b> <b>Aegyo look-back.</b>',
			ko: '청록은 안 묻는다. 뒤로 가서 엉덩이가 그의 허벅지에 닿을 때까지 가고, 그대로 있는다. 들보 탓인 척. 넘겨본다. 입 부드럽게. 웃음은 그 놈용. <b>엉덩이부터 그에게.</b> <b>애교로 넘겨본다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#2aa89a',
			en: [
				'Oops— was that you?',
				'Stay. Your leg’s warm.',
				'Hey. Look at me when I— mm.'
			],
			lines: [
				'앗— 오빠야?',
				'있어. 다리 따뜻해.',
				'야. 나 볼 때— 음.'
			]
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'Saffron takes the other hip like she paid for it. Chima already hiked. She backs it on and laughs into his sleeve. <b>She backs it onto his thigh.</b>',
			ko: '사프란이 반대쪽 엉덩이를 산 사람처럼 가져간다. 치마는 이미 걷혀 있다. 뒤로 밀어 붙이고 소매에 웃는다. <b>허벅지에 엉덩이를 얹는다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#d4a017',
			en: [
				'You can fetch later.',
				'This well’s nicer if you stay right— there. Yeah.',
				'Don’t tell Sosuno I said stay.'
			],
			lines: [
				'두레박은 나중에.',
				'이렇게 붙어 있으면 우물이 더 예뻐. 거기. 응.',
				'소서노한테 있지 말랬다고 하지 마.'
			]
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'Plum waits half a breath so it looks like her idea. Then she does the same thing worse — laugh first, ass second. <b>Plum laughs and backs it.</b>',
			ko: '자두는 반 박자 기다려 자기 생각인 척한다. 그다음 더 심하다 — 웃음 먼저, 엉덩이 다음. <b>자두가 웃고 뒤로 붙인다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#c4a06a',
			en: [
				'Heh— your turn to move, big boy.',
				'I’m just— water. Obviously.',
				'…You’re still grinning. Good.'
			],
			lines: [
				'푸핫— 이번엔 오빠가 움직여.',
				'난 그냥— 물. 진짜야.',
				'…아직 웃네. 좋아.'
			]
		}
	]
);

// typo fix if I left Prim - wait I did leave a typo "반 박자  Prim" - fix it
const plum = jumong.blocks.find((b) => b.html?.includes('Plum waits half a breath'));
if (plum) {
	plum.ko = '자두는 반 박자 기다려 자기 생각인 척한다. 그다음 더 심하다 — 웃음 먼저, 엉덩이 다음. <b>자두가 웃고 뒤로 붙인다.</b>';
}

insertAfter(
	(b) => b.kind === 'p' && b.html?.includes('She ogles him from the loft.'),
	[
		{
			kind: 'p',
			nsfw: true,
			html: 'First the room: posts, sacks, the paper window, timber under the knees. Then she sits in it. <b>The loft is the whole room first</b>',
			ko: '먼저 방이다. 기둥, 가마니, 창호, 무릎 아래 나무. 그다음 앉는다. <b>다락이 먼저 방 전체다</b>'
		}
	]
);

insertAfter(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'sosuno' &&
		b.en?.includes('Mine to count. That’s all. That’s—'),
	[
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			nsfw: true,
			en: [
				'Idiot. Don’t— don’t grin in my head.',
				'I didn’t invite you up here. This is— 하— your fault.',
				'Big idiot. Stop looking like that when you’re not even—',
				'Why are you even— 이 바보야— I said the ditch—'
			],
			lines: [
				'바보야. 머리속에서 웃지 마.',
				'여기 올라오라 한 적 없어. 이건— 하— 네 탓이야.',
				'큰 바보. 여기 있지도 않으면서 그 얼굴 하지 마—',
				'왜 또— 이 바보야— 도랑이라며—'
			]
		}
	]
);

const loftHungry = jumong.blocks.find(
	(b) => b.kind === 'dialogue' && b.en?.includes('Little Sosuno… you’re hungry today aren’t you…')
);
if (!loftHungry) throw new Error('loft hungry dialogue missing');
loftHungry.en.splice(3, 0, 'This is your fault, big idiot— ah—', 'Don’t you dare come up. Don’t you dare stop—');
loftHungry.lines.splice(3, 0, '다 네 탓이야 큰 바보— 아—', '올라오지 마. 그런데 멈추지 마—');

const loftWet = jumong.blocks.find(
	(b) => b.kind === 'dialogue' && b.en?.includes('질척— don’t— 안 돼—')
);
if (!loftWet) throw new Error('loft wet dialogue missing');
loftWet.en.splice(1, 0, 'Idiot. You’re not even here and I’m— 하아—');
loftWet.lines.splice(1, 0, '바보야. 여기 있지도 않은데 내가— 하아—');

const stick = jumong.blocks.find((b) => b.html?.includes('She sticks it out anyway'));
if (!stick) throw new Error('stick-out p missing');
stick.html =
	'She tries what the well girls do. Turns her back. Sticks that tight little ass out like a hunt stance. It isn’t. Her shoulders are still a muster. The dusty-rose hitch is a beat late. She hates the delay. <b>She sticks it out anyway</b> Same plump silk, same look-back — worker dusty-rose, not a queen robe. <b>Worker silk, same grammar</b>';
stick.ko =
	'우물 애들이 하던 걸 해 본다. 등을 돌린다. 그 작고 팽팽한 엉덩이를 사냥 자세처럼 내민다. 사냥이 아니다. 어깨는 아직 소집이다. 회분홍이 한 박자 늦다. 그 늦음이 싫다. <b>그래도 내민다</b> 같은 비단 엉덩이, 같은 넘겨봄 — 일꾼 회분홍이지 왕비 도포가 아니다. <b>일꾼 비단, 같은 문법</b>';

writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = readFileSync(SEQ, 'utf8');
const daughterNeedle = `\t\t\t{ id: 'jumong-flirt-daughters', role: 'he flirts back', angle: 'dutch OTS wink', at: 'He flirts at the wrong well' },`;
const daughterInsert = `${daughterNeedle}
			{ id: 'daughter-teal-ass-back', role: 'teal ass-back aegyo', angle: 'intimate two-shot', at: 'Ass first onto him' },
			{ id: 'daughter-saffron-ass-back', role: 'saffron ass-back', angle: 'intimate OTS', at: 'She backs it onto his thigh' },
			{ id: 'daughter-plum-ass-back', role: 'plum ass-back', angle: 'dutch well', at: 'Plum laughs and backs it' },
			{ id: 'jumong-seq-daughters-ass-two', role: 'grin + hip', angle: 'two-shot', at: 'He grins at the wrong well' },
			{ id: 'daughter-teal-aegyo-ecu', role: 'teal aegyo ECU', angle: 'ECU look-back', at: 'Aegyo look-back' },
			{ id: 'daughter-saffron-lookback-hike', role: 'saffron hike look-back', angle: 'OTS hike', at: 'She hikes it like a dare' },`;
if (!seq.includes(daughterNeedle)) throw new Error('daughter needle missing');
if (!seq.includes("id: 'daughter-teal-ass-back'")) seq = seq.replace(daughterNeedle, daughterInsert);

const loftNeedle = `\t\t\t{ id: 'sosuno-seq-loft-climax', role: 'wrist bite peak', angle: 'ECU wrecked', at: 'She comes on the timber' },`;
const loftInsert = `${loftNeedle}
			{ id: 'nsfw-sosuno-loft-wide-lock', role: 'loft room lock', angle: 'dutch wide loft', at: 'The loft is the whole room first' },
			{ id: 'nsfw-sosuno-loft-legs-wide', role: 'legs spread timber', angle: 'intimate 3:4', at: 'Legs wide on the timber.' },
			{ id: 'nsfw-sosuno-loft-dutch-spread', role: 'dutch legs open', angle: 'dutch loft', at: 'Timber under the knees' },
			{ id: 'nsfw-sosuno-loft-worm-open', role: 'worm’s-eye open', angle: 'worm’s-eye floor', at: 'Little Sosuno.' },
			{ id: 'nsfw-sosuno-loft-ots-hips', role: 'OTS hips', angle: 'OTS hips', at: 'Silk hitch' },
			{ id: 'nsfw-sosuno-loft-idiot-ecu', role: 'idiot tsun ECU', angle: 'ECU glare', at: 'Idiot. Don’t grin in my head' },
			{ id: 'nsfw-sosuno-loft-tsun-glare', role: 'mad he’s in her head', angle: 'dutch glare', at: 'This is your fault, big idiot' },
			{ id: 'nsfw-sosuno-loft-want-climax', role: 'wanting climax', angle: 'ECU wrecked', at: 'She comes on the timber' },`;
if (!seq.includes(loftNeedle)) throw new Error('loft needle missing');
if (!seq.includes("id: 'nsfw-sosuno-loft-wide-lock'")) seq = seq.replace(loftNeedle, loftInsert);

const queenNeedle = `\t\t\t{ id: 'nsfw-sosuno-queen-ass-majesty', role: 'queen’s ass majesty', angle: 'OTS blush', at: 'Only you can have this queen’s ass, your majesty' },`;
const queenInsert = `${queenNeedle}
			{ id: 'nsfw-sosuno-worker-ass-silk', role: 'worker plump silk rear', angle: 'three-quarter rear', at: 'Worker silk, same grammar' },`;
if (!seq.includes(queenNeedle)) throw new Error('queen needle missing');
if (!seq.includes("id: 'nsfw-sosuno-worker-ass-silk'")) seq = seq.replace(queenNeedle, queenInsert);

writeFileSync(SEQ, seq);

writeFileSync(
	'scripts/.cache/jumong-tsun-pack-manifest.json',
	JSON.stringify(
		slots.map(({ id, alt, prompt }) => ({ id, alt, prompt })),
		null,
		'\t'
	) + '\n'
);

console.log(`added ${slots.length} slots + dialogue + sequence + manifest`);
