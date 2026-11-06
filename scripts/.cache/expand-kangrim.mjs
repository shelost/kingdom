#!/usr/bin/env node
/**
 * Surgical story.json edits: Kangrim's flower field and ssireum,
 * Samjogo and the red book, the second sun and the second moon,
 * and Samjogo in place of the sun-fox on Yuhwa's road.
 * Does not JSON.stringify the whole file.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const STORY = 'src/lib/data/story.json';
let s = readFileSync(STORY, 'utf8');

function objectBounds(src, needle) {
	const at = src.indexOf(needle);
	if (at < 0) throw new Error('missing: ' + needle.slice(0, 80));
	if (src.indexOf(needle, at + needle.length) >= 0) throw new Error('dup: ' + needle.slice(0, 80));
	const start = src.lastIndexOf('{', at);
	let depth = 0;
	let inStr = false;
	let esc = false;
	let end = -1;
	for (let j = start; j < src.length; j++) {
		const c = src[j];
		if (inStr) {
			if (esc) {
				esc = false;
				continue;
			}
			if (c === '\\') {
				esc = true;
				continue;
			}
			if (c === '"') inStr = false;
			continue;
		}
		if (c === '"') {
			inStr = true;
			continue;
		}
		if (c === '{') depth++;
		else if (c === '}') {
			depth--;
			if (depth === 0) {
				end = j;
				break;
			}
		}
	}
	if (end < 0) throw new Error('unclosed: ' + needle.slice(0, 80));
	return { start, end };
}

function deleteById(src, id) {
	const needle = `"id": "${id}"`;
	const b = objectBounds(src, needle);
	let from = b.start;
	let to = b.end + 1;
	if (src[to] === ',') to++;
	else {
		let k = from - 1;
		while (k >= 0 && (src[k] === '\n' || src[k] === '\t' || src[k] === ' ')) k--;
		if (src[k] === ',') from = k;
	}
	if (src[to] === '\n') to++;
	return src.slice(0, from) + src.slice(to);
}

function insertAfterNeedle(src, needle, insertion) {
	const b = objectBounds(src, needle);
	let to = b.end + 1;
	if (src[to] === ',') to++;
	if (src[to] === '\n') to++;
	return src.slice(0, to) + insertion + ',\n' + src.slice(to);
}

function sourceOf(items) {
	return items
		.map((item) =>
			JSON.stringify(item, null, '\t')
				.split('\n')
				.map((line) => '\t\t\t\t\t' + line)
				.join('\n')
		)
		.join(',\n');
}

function once(src, from, to, label) {
	const n = src.split(from).length - 1;
	if (n !== 1) throw new Error(`${label}: expected 1, found ${n}`);
	return src.replace(from, to);
}

const CROP =
	'Composed for a 2:1 letterbox crop; nothing important at the top or bottom edge. No text. No watermark. No halo, no glow aura.';

const still = (id, at, alt, people, refs, tone, time, prompt) => ({
	id,
	ratio: 2,
	time,
	tone,
	at,
	alt,
	people,
	refs,
	prompt: `HEEWON STYLE. Minimal iconic 2:1 still. ${prompt} ${CROP}`,
	tempImage: `/temp/${id}.jpg`
});

// --- Grim Reaper: living face on the road, before the split ---
{
	const start = s.indexOf('"title": "Grim Reaper"');
	const end = s.indexOf('"title": "Goddess Supreme"');
	if (start < 0 || end < 0 || end < start) throw new Error('grim reaper bounds');
	let slice = s.slice(start, end);
	const splitAt = slice.indexOf('So they split him.');
	if (splitAt < 0) throw new Error('split sentence');
	const head = slice.slice(0, splitAt).replace(
		/([ \t]*)"person": "kangrim",/g,
		'$1"person": "kangrim",\n$1"look": "mortal",'
	);
	slice = head + slice.slice(splitAt);
	s = s.slice(0, start) + slice + s.slice(end);
}

s = once(
	s,
	'He shuts his eyes and jumps. He stands up at a gate that does not have a sun.',
	'He shuts his eyes and jumps.',
	'jump en'
);
s = once(
	s,
	'눈을 감고 뛰어든다. 해 없는 문간에 서서 일어난다.',
	'눈을 감고 뛰어든다.',
	'jump ko'
);

const flowerBlocks = [
	{ kind: 'scene', label: 'The Flower Field', ko: '꽃밭' },
	{
		kind: 'p',
		html: 'The fall does not end at a gate. It ends in flowers.',
		ko: '추락은 문에서 끝나지 않는다. 꽃에서 끝난다.'
	},
	{
		kind: 'p',
		html: 'The road west is a flower field. It runs until the colour runs out.',
		ko: '서쪽 길은 꽃밭이다. 색이 다할 때까지 간다.'
	},
	{
		kind: 'p',
		html: 'A young man is already in the rows. He has a hoe. He does not give a name.',
		ko: '젊은 사내가 이미 이랑에 있다. 호미를 들었다. 이름은 안 댄다.'
	},
	{
		kind: 'dialogue',
		en: [
			"Don't ask my name.",
			"Three. Don't mix them up.",
			'This one holds a belt.',
			'This one keeps a judge from saying your name today.',
			"This one you don't spend. It's the way back."
		],
		lines: [
			'이름 묻지 마.',
			'셋이야. 섞지 마.',
			'이건 띠를 붙잡아.',
			'이건 판관이 오늘 네 이름을 못 부르게 해.',
			'이건 쓰지 마. 돌아가는 길이야.'
		],
		person: 'sara',
		look: 'field',
		chip: '#8FBF8A'
	},
	{
		kind: 'dialogue',
		en: ["I'm going down. Not back."],
		lines: ['내려가는 길이오. 돌아가는 길이 아니오.'],
		person: 'kangrim',
		look: 'mortal',
		chip: '#4a4a58'
	},
	{
		kind: 'dialogue',
		en: ['Everyone says that in this field.'],
		lines: ['이 밭에선 다 그렇게 말해.'],
		person: 'sara',
		look: 'field',
		chip: '#8FBF8A'
	},
	{
		kind: 'p',
		html: 'He puts the three in his sash.',
		ko: '셋은 띠 속에 넣는다.'
	},
	{ kind: 'scene', label: 'The Belt', ko: '씨름' },
	{
		kind: 'p',
		html: 'He stands up at a gate that does not have a sun.',
		ko: '해 없는 문간에 서서 일어난다.'
	}
];

s = insertAfterNeedle(
	s,
	'The gate-god and the kitchen-god put him on the road, because his wife had kept them fed.',
	sourceOf(flowerBlocks)
);

s = once(
	s,
	'Someone is already walking that road. Younger. Night-road. He does not offer his name. He points.',
	'Someone is already walking that road. Younger. Night-road. He does not offer his name. He takes the belt.',
	'someone en'
);
s = once(
	s,
	'그 길을 이미 걷는 자가 있다. 더 젊고, 밤길이다. 이름은 안 댄다. 가리키기만 한다.',
	'그 길을 이미 걷는 자가 있다. 더 젊고, 밤길이다. 이름은 안 댄다. 허리띠를 잡는다.',
	'someone ko'
);

const beltBlocks = [
	{
		kind: 'dialogue',
		en: ['One fall.'],
		lines: ['한 판.'],
		person: 'haewonmek',
		chip: '#6b5b6e'
	},
	{
		kind: 'dialogue',
		en: ['The belt.'],
		lines: ['허리띠.'],
		person: 'kangrim',
		look: 'mortal',
		chip: '#4a4a58'
	},
	{
		kind: 'p',
		html: 'They take the satba. One fall. The flower is in the sash, and the sash does not slip.',
		ko: '샅바를 잡는다. 한 판이다. 꽃은 띠 안에 있고, 띠는 미끄러지지 않는다.'
	},
	{
		kind: 'p',
		html: 'Haewonmek hits the packed earth and stays there.',
		ko: '해원맥이 다진 땅에 꽂히고, 그대로 있다.'
	},
	{
		kind: 'p',
		html: 'A judge has been standing in the dark the whole time. He looks almost pleased.',
		ko: '판관이 처음부터 어둠 속에 서 있었다. 거의 기뻐 보인다.'
	}
];

s = insertAfterNeedle(s, 'He takes the belt.', sourceOf(beltBlocks));

s = once(
	s,
	'"Go home.",\n\t\t\t\t\t\t\t"I will come at the hour I name."',
	'"You threw him.",\n\t\t\t\t\t\t\t"Go home.",\n\t\t\t\t\t\t\t"I will come at the hour I name."',
	'yumla en'
);
s = once(
	s,
	'"돌아가거라.",\n\t\t\t\t\t\t\t"내가 정한 시에 가리라."',
	'"넘겼구나.",\n\t\t\t\t\t\t\t"돌아가거라.",\n\t\t\t\t\t\t\t"내가 정한 시에 가리라."',
	'yumla ko'
);

s = once(
	s,
	'So they split him. The magistrate kept the half he could see.',
	'So they split him. The flower he would not spend holds the half the magistrate can see.',
	'split en'
);
s = once(
	s,
	'그래서 그를 쪼갠다. 원님은 보이는 반을 가졌다.',
	'그래서 그를 쪼갠다. 쓰지 말라던 꽃이, 원님이 볼 수 있는 반을 붙든다.',
	'split ko'
);

s = once(
	s,
	'Yumla put a ledger in his hands. Eighty years, in order, the old before the young. On the way down Kangrim trusted it to a crow. The crow lost it at a slaughter-field. A snake ate the writing.',
	'Yumla put a ledger in his hands. Eighty years, in order, the old before the young. On the way down, Samjogo took it. Three legs, and a red sun on the wing. The book came apart in the beak. A snake ate the scraps. The torn pages swapped the hours. When it is the old one\'s turn, the child comes. When it is the child\'s, the old one comes.',
	'book en'
);
s = once(
	s,
	'염라가 장부를 쥐여 준다. 여든, 순서대로, 늙은 이 먼저. 내려가는 길에 강림은 그걸 까마귀에게 맡긴다. 까마귀는 도살장에서 잃는다. 뱀이 글을 먹는다.',
	'염라가 장부를 쥐여 준다. 여든, 순서대로, 늙은 이 먼저. 내려가는 길에 삼족오가 가져간다. 다리가 셋이고, 날개에 붉은 해. 책이 부리에서 찢어진다. 뱀이 조각을 먹는다. 찢긴 쪽이 시를 바꾼다. 늙은 이 차례면 아이가 오고, 아이 차례면 늙은 이가 온다.',
	'book ko'
);

s = deleteById(s, 'kr-folk-crow');
// The Crow's speech is a dialogue, not an image. Delete by speaker needle, scoped.
{
	const needle = '"speaker": "The Crow"';
	const n = s.split(needle).length - 1;
	if (n !== 1) throw new Error('The Crow count ' + n);
	const b = objectBounds(s, needle);
	let from = b.start;
	let to = b.end + 1;
	if (s[to] === ',') to++;
	else {
		let k = from - 1;
		while (k >= 0 && (s[k] === '\n' || s[k] === '\t' || s[k] === ' ')) k--;
		if (s[k] === ',') from = k;
	}
	if (s[to] === '\n') to++;
	s = s.slice(0, from) + s.slice(to);
}

const krStills = [
	still(
		'kr-flower-road',
		'The road west is a flower field.',
		'Kangrim, still a living man, crosses the western flower field at dusk',
		['kangrim'],
		['/ch_kangrim_mortal.png', '/sw_bidam.png', '/pl_western_flower_field.png'],
		'#c4511a',
		'night',
		'Far wide, dusk. LEFT of the sheet is Kangrim\'s living face and orange-red po: one LEFT eye showing, RIGHT eye bound in a red silk wrap, white cloth headband, short black goatee, black topknot. Do not use the black gat or the reaper robe. He is small in the lower third, mid-stride through flowers, one hand on the hip where a ring-pommel sword hangs. CENTER of the sheet is that sword if it shows: small ring at the heel of the fist, short grip, thin collar, straight blade down. RIGHT of the sheet is the western flower field itself — the same cliff of blooms, the same ground, not a different meadow. One low sun shaft. Crushed shadow on the near flowers. #c4511a as the sun on the orange silk, not a glow.'
	),
	still(
		'kr-gardener-gift',
		"Don't ask my name.",
		'The gardener puts three flowers into the living Kangrim\'s hands',
		['kangrim', 'sara'],
		['/ch_kangrim_mortal.png', '/ch_gardener.png', '/pl_western_flower_field.png'],
		'#8FBF8A',
		'night',
		'Two-shot, low, dusk. LEFT of the sheet is Kangrim, living: red eye-wrap, white headband, orange-red po, huge white sleeves, kneeling to take the flowers. CENTER is the gardener from his portrait: young, hoe set down, pressing three small blooms into Kangrim\'s hands. He is not named. RIGHT is the same western flower field. #8FBF8A lives in the leaves the lamp of the low sun hits. No sword in frame. Faces match the sheet. New bodies, not the portrait stance.'
	),
	still(
		'kr-ssireum-throw',
		'Haewonmek hits the packed earth',
		'Kangrim throws Haewonmek in a one-fall ssireum; Yumla watches',
		['kangrim', 'haewonmek', 'yumla'],
		['/ch_kangrim_mortal.png', '/ch_haewonmek.png', '/ch_yumla.png'],
		'#4a4a58',
		'night',
		'Worm\'s-eye from the dirt under the throw. Ssireum, one fall, mid-throw: Kangrim has Haewonmek over his hip and Haewonmek\'s feet come at the lens. LEFT of the sheet is Kangrim\'s living face — red eye-wrap, white headband, goatee, one eye — on a bare chest and a satba belt, the orange po off, a flower tucked at the sash. Do not wear the portrait robe. Do not wear a gat. CENTER is Haewonmek: keep the wide black gat so the eyes stay hidden, mouth and jaw only, black robe hiked, satba over it, losing. RIGHT is Yumla, small, back in the dark, grey beard, watching, almost pleased. A single lamp on the ground rakes them. No sword in frame. No second Kangrim.'
	),
	still(
		'kr-yumla-threw',
		'You threw him.',
		'Yumla, almost pleased, looks down at the man who won the fall',
		['yumla', 'kangrim', 'haewonmek'],
		['/ch_yumla.png', '/ch_kangrim_mortal.png', '/ch_haewonmek.png'],
		'#7c3aed',
		'night',
		'Close on Yumla. LEFT of the sheet is his face, large, grey beard, one brow up, almost a smile, black robe and orange-red sleeves. CENTER, soft behind him, is Kangrim still standing in the satba, living face, red eye-wrap. RIGHT, on the ground, is Haewonmek under the gat, down. #7c3aed is the lamp on Yumla\'s sleeve, not a glow. No sword. No text.'
	),
	still(
		'kr-samjogo-book',
		'The book came apart in the beak.',
		'Samjogo, three legs and a red sun on the wing, rips Kangrim\'s red book',
		['kangrim'],
		['/ch_kangrim.png', '/obj_samjogo.png'],
		'#C30000',
		'night',
		'The crow is the subject. RIGHT of the sheet is Samjogo: a black crow with exactly THREE legs, a red sun on the wing, beak tearing a red book. The pages are blank. No letters, no numbers, no hanja. LEFT is Kangrim the reaper, small, reaching too late: wide black gat, only the mouth showing, black robe. Not the living orange po. Not a two-legged crow. Not a fox. #C30000 is the sun-mark and the book, real pigment, not a glow.'
	)
];

s = insertAfterNeedle(s, '"id": "kr-folk-split"', sourceOf(krStills));

// --- Heaven–Earth King: the shot, with the sun\'s face ---
const hekBlocks = [
	{
		kind: 'p',
		html: "The second sun is a man with his brother's face and short silver hair. Big Star's arrow is in his chest.",
		ko: '두 번째 해는 형의 얼굴에 짧은 은발인 사내다. 대별의 화살이 그 가슴에 박혀 있다.'
	},
	{
		kind: 'p',
		html: "Little Star's arrow takes the second moon clean out of the sky.",
		ko: '소별의 화살이 두 번째 달을 하늘에서 떨어뜨린다.'
	}
];
s = insertAfterNeedle(s, 'the second sun breaks like a plate.', sourceOf(hekBlocks));

const hekStills = [
	still(
		'hek-sun-brothers',
		"a man with his brother's face and short silver hair",
		'Two suns: Haemosu with long hair, and Haewonmek, the second son, with short silver hair',
		['haewonmek', 'haemosu', 'daebyeol'],
		['/ch_haewonmek_sun.png', '/ch_haemosu.png', '/ch_big_star_young.png'],
		'#f0b429',
		'day',
		'High-key day. Paper-white sky, two suns, nothing else. LEFT of the sheet is the second sun: Haewonmek\'s sun face, SHORT silver-white hair in a tight bun, no long tail, white open po, eyes and mouth visible, a brother\'s bones. CENTER is Haemosu, the sun that stays: the same face with LONG silver hair down the back, white po, still whole, smaller, in the other disc. RIGHT, tiny at the bottom, is young Big Star with a longbow, not yet loosed. The arrow is not in anyone yet. No gat. No reaper robe. No text. #f0b429 is real sun on the white silk.'
	),
	still(
		'hek-arrow-sun',
		"Big Star's arrow is in his chest.",
		'Big Star\'s arrow takes the second sun, Haewonmek, in the chest',
		['daebyeol', 'haewonmek', 'haemosu'],
		['/ch_big_star_young.png', '/ch_haewonmek_sun.png', '/ch_haemosu.png'],
		'#3B6FBF',
		'day',
		'The arrow is the device: one straight black shaft from the bow into the chest, impossible to miss. Worm\'s-eye. LEFT of the sheet is young Big Star at full draw, longbow, the string still at his cheek, face matching the portrait. CENTER is the second sun falling: Haewonmek\'s sun face, SHORT silver hair, white po, the arrow buried in the chest, eyes open, no gat, no black robe. RIGHT, far and still whole, is Haemosu\'s long-haired sun. Paper-white sky. The second sun is the only gold. #3B6FBF is the cloth at Big Star\'s collar, not a glow. No letters.'
	),
	still(
		'hek-arrow-moon',
		"Little Star's arrow takes the second moon",
		'Little Star\'s arrow takes the second moon out of the sky',
		['sobyeol'],
		['/ch_little_star_young.png'],
		'#C94040',
		'night',
		'Night. One pale moon disc, no face on it, no person drawn in the moon. Young Little Star, face matching the attached portrait, at full draw, low in the frame. The arrow is a bright shaft from his bow into the disc, and the disc is cracking along that line. #C94040 is the moonlight on his sleeve, not a glow. Crushed black sky. No second archer. No text. No sun in this frame.'
	)
];
s = insertAfterNeedle(s, '"id": "hek-ink-moon"', sourceOf(hekStills));

// --- Haemosu: the crow walks her south ---
s = once(s, 'Follow the fox.', 'Follow the crow.', 'follow en');
s = once(s, '여우를 따라가.', '까마귀를 따라가.', 'follow ko');
s = once(
	s,
	'The fox is already on the packed earth, pale gold-white, looking back once as if she might miss the joke. Yuhwa follows it south, barefoot, the ice-blue gone dull with dust: pine shade, a river-bend that is not the Amnok, a pass of bare stone where she is smaller than the ridge. The fox does not explain the map.',
	'Samjogo is already on the packed earth, black, three legs, a red sun on the wing, looking back once as if she might miss the joke. Yuhwa follows him south, barefoot, the ice-blue gone dull with dust: pine shade, a river-bend that is not the Amnok, a pass of bare stone where she is smaller than the ridge. The crow does not explain the map.',
	'fox en'
);
s = once(
	s,
	'여우가 이미 다진 흙 위에 있다. 창백한 금빛 흰 털, 농담을 놓칠까 봐 한 번 돌아본다. 유화는 맨발로, 먼지에 탁해진 얼음빛으로 그 뒤를 따라 남쪽으로 간다. 소나무 그늘, 압록이 아닌 강굽이, 능선보다 그녀가 작아지는 벗은 돌 고개. 여우는 지도를 설명하지 않는다.',
	'삼족오가 이미 다진 흙 위에 있다. 검고, 다리가 셋, 날개에 붉은 해. 농담을 놓칠까 봐 한 번 돌아본다. 유화는 맨발로, 먼지에 탁해진 얼음빛으로 그 뒤를 따라 남쪽으로 간다. 소나무 그늘, 압록이 아닌 강굽이, 능선보다 그녀가 작아지는 벗은 돌 고개. 까마귀는 지도를 설명하지 않는다.',
	'fox ko'
);

const foxIds = [
	'jumong-cine-fox-behind',
	'jumong-cine-fox-palace',
	'jumong-cine-fox-prints',
	'yuhwa-exile-fox-appear',
	'yuhwa-exile-fox-lookback',
	'yuhwa-exile-fox-follow-south',
	'yuhwa-exile-fox-pine',
	'yuhwa-exile-fox-pass',
	'yuhwa-exile-fox-buyeo-see',
	'yuhwa-exile-geumwa-path',
	'jumong-yuhwa-wc-fox-lead',
	'jumong-yuhwa-wc-fox-lookback',
	'jumong-yuhwa-ink-fox-lead',
	'jumong-buyeo-wc-fox-arrive-geumwa',
	'jumong-yuhwa-wc-fox-pawprints',
	'jumong-yuhwa-wc-fox-follow-behind',
	'jumong-buyeo-wc-fox-pawprints-gate'
];
for (const id of foxIds) s = deleteById(s, id);

const yhStills = [
	still(
		'yh-samjogo-earth',
		'Samjogo is already on the packed earth',
		'Samjogo, three legs, looks back once on the packed earth; Yuhwa has not sat down',
		['yuhwa'],
		['/ch_yuhwa.png', '/obj_samjogo.png'],
		'#C30000',
		'night',
		'Dusk, packed earth, pine shade. LEFT of the sheet is Yuhwa, barefoot, garments and face matching her portrait, dust on the hem, caught mid-step, not sitting. RIGHT is Samjogo: black crow, exactly THREE legs, red sun on the wing, looking back at her. Not a fox. Not two legs. #C30000 is the sun-mark, real pigment. One low shaft. No chariot in frame.'
	),
	still(
		'yh-samjogo-south',
		'Yuhwa follows him south',
		'Yuhwa follows the three-legged crow south, small on a long road',
		['yuhwa'],
		['/ch_yuhwa.png', '/obj_samjogo.png'],
		'#e8a04a',
		'day',
		'High-key day. Paper-white sky, one dirt road as the device, half the frame empty. Yuhwa is small, lower third, walking away-and-back so her face from the LEFT of the sheet still reads, dusty hanbok matching the portrait. Ahead of her, low, Samjogo flies with exactly THREE legs and a red sun on the wing. A river-bend that is not a great border river. No fox. No second Yuhwa. #e8a04a is dust-light on the road, not a glow.'
	),
	still(
		'yh-samjogo-pass',
		'a pass of bare stone',
		'On a bare-stone pass Yuhwa is smaller than the ridge, and the three-legged crow does not explain',
		['yuhwa'],
		['/ch_yuhwa.png', '/obj_samjogo.png'],
		'#C30000',
		'night',
		'Storm dusk. A bare stone pass, one ridge diagonal. Yuhwa is tiny against the ridge, face still the LEFT portrait, barefoot. Samjogo sits on a stone ahead, exactly THREE legs, red sun on the wing, not looking at her now. No fox. No map. No text. Crushed cloud, one break of light on the stone.'
	)
];
s = insertAfterNeedle(s, '"id": "yuhwa-exile-pavilion-wide"', sourceOf(yhStills));

JSON.parse(s);

const data = JSON.parse(s);
function entry(title) {
	return Object.values(data)
		.flatMap((ch) => ch.entries ?? [])
		.find((e) => e.title === title);
}
function assertAt(en, at) {
	const blob = en.blocks
		.map((b) => JSON.stringify(b))
		.join('\n')
		.toLowerCase();
	if (!blob.includes(at.toLowerCase())) throw new Error(en.title + ' lost at: ' + at);
}
const gr = entry('Grim Reaper');
const hek = entry('Heaven–Earth King');
const hm = entry('Haemosu');
const fresh = new Set([
	'kr-flower-road',
	'kr-gardener-gift',
	'kr-ssireum-throw',
	'kr-yumla-threw',
	'kr-samjogo-book',
	'hek-sun-brothers',
	'hek-arrow-sun',
	'hek-arrow-moon',
	'yh-samjogo-earth',
	'yh-samjogo-south',
	'yh-samjogo-pass'
]);
for (const en of [gr, hek, hm]) {
	for (const im of en.images) {
		if (fresh.has(im.id)) assertAt(en, im.at);
	}
}
const must = [
	[gr, 'He shuts his eyes and jumps.'],
	[gr, 'The road west is a flower field.'],
	[gr, "Don't ask my name."],
	[gr, 'Haewonmek hits the packed earth'],
	[gr, 'You threw him.'],
	[gr, 'So they split him.'],
	[gr, 'The book came apart in the beak.'],
	[gr, 'Death has its man.'],
	[hek, 'breaks like a plate'],
	[hek, 'At midnight Little Star draws'],
	[hek, "Big Star's arrow is in his chest."],
	[hek, "Little Star's arrow takes the second moon"],
	[hm, 'Follow the crow.'],
	[hm, 'Samjogo is already on the packed earth'],
	[hm, 'Come in. I\u2019ve got a room free.']
];
for (const [en, at] of must) assertAt(en, at);
if (JSON.stringify(gr).includes('Hallakgungi') || JSON.stringify(gr).includes('할락궁이')) {
	throw new Error('gardener named in Grim Reaper');
}
if (JSON.stringify(gr.blocks).includes('trusted it to a crow')) throw new Error('crow trust remains');
if (JSON.stringify(hm.blocks).toLowerCase().includes('fox')) throw new Error('fox remains in Haemosu blocks');
const foxLeft = hm.images.filter((im) => /fox/i.test(im.id));
if (foxLeft.length) throw new Error('fox slots remain ' + foxLeft.map((i) => i.id).join(','));

writeFileSync(STORY, s);
console.log('wrote', s.length);
console.log('grim blocks', gr.blocks.length, 'images', gr.images.length);
console.log('scenes', gr.blocks.filter((b) => b.kind === 'scene').map((b) => b.label).join(' | '));
