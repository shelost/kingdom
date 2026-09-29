import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function sipsJpeg(srcId, destId = srcId) {
	const src = path.join(ASSETS, `${srcId}.png`);
	if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
	const dest = path.join(TEMP, `${destId}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', src, '--out', dest],
		{ stdio: 'ignore' }
	);
	fs.rmSync(src);
	return `/temp/${destId}.jpg`;
}

function upsertImage(entry, slot, afterId, unshift = false) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	if (unshift) {
		entry.images.unshift(slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

function insertAfterHtml(entry, needle, blocks) {
	if (blocks.some((b) => b.html && entry.blocks.some((x) => x.html === b.html))) return;
	const i = entry.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(needle));
	if (i < 0) throw new Error(`missing needle: ${needle}`);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

function prependHtml(entry, block) {
	if (entry.blocks.some((x) => x.html === block.html)) return;
	entry.blocks.unshift(block);
}

const pyongyang = findEntry('Pyongyang Fortress');
const daeya = findEntry('Daeya Fortress');
const snake = findEntry('Snake River');
const bidam = findEntry('Bidam’s Rebellion');
const sunduk = findEntry('Queen Sunduk');
const sabi = findEntry('Sabi Palace');
const finalStand = findEntry('The Final Stand');

const pyPlace = '/pl_pyongyang_fortress.png';

upsertImage(
	pyongyang,
	{
		id: 'pyongyang-wide',
		ratio: 1.778,
		tone: '#C30000',
		at: 'Red Sun’s capital sits on the ridge',
		alt: 'Wide Pyongyang: the same red two-tier munru on the grey stone ridge, storm-cream clouds',
		refs: [pyPlace],
		tempImage: sipsJpeg('pyongyang-wide'),
		prompt:
			'Minimal iconic 16:9 poster. Wide cinematic EXPOSITION of Pyongyang Fortress. SAME architecture as the place: deep-red two-tier munru, dark giwa, light-grey rectangular stone ridge, watchtower right, huge painterly cream clouds. ONE device: the red munru as a stamp on the grey ridge. REAL Korean seongmun. No army. No text. No watermark.'
	},
	null,
	true
);

for (const item of [
	{
		id: 'pyongyang-walls',
		dest: 'pyongyang-walls-v2',
		at: 'The impenetrable walls of Pyongyang',
		alt: 'Winter siege of the same red Pyongyang munru on the grey ridge; tiny frozen specks at the wall',
		prompt:
			'Minimal iconic 16:9. SAME Pyongyang as the place ref: red two-tier munru, grey stone ridge, snow-strip. Not a black slab. No text. No watermark.'
	},
	{
		id: 'goguryeo-fortress-red-storm',
		dest: 'goguryeo-fortress-red-storm-v2',
		at: 'The impenetrable walls of Pyongyang',
		alt: 'Storm over the same red two-tier Pyongyang munru — grey stone, cream cloud, one red accent',
		prompt:
			'Minimal iconic 16:9. SAME Pyongyang munru as the place ref under storm. Not a red polygon. No text. No watermark.'
	},
	{
		id: 'goguryeo-mountain-keep',
		dest: 'goguryeo-mountain-keep-v2',
		at: 'Pyongyang does not fall',
		alt: 'Low-angle: the same red Pyongyang munru growing from the grey ridge, not a fantasy tower',
		prompt:
			'Minimal iconic 16:9. SAME Pyongyang as the place ref, low-angle ridge. Not a red keep on white void. No text. No watermark.'
	}
]) {
	const slot = pyongyang.images.find((im) => im.id === item.id);
	if (!slot) throw new Error(`missing ${item.id}`);
	const old = slot.tempImage;
	slot.tempImage = sipsJpeg(item.id, item.dest);
	slot.alt = item.alt;
	slot.at = item.at;
	slot.prompt = item.prompt;
	slot.refs = [pyPlace];
	if (old && old !== slot.tempImage) {
		const p = path.join('static', old.replace(/^\//, ''));
		if (fs.existsSync(p) && p.endsWith('.jpg')) fs.rmSync(p);
	}
}

const stormSrc = pyongyang.images.find((im) => im.id === 'goguryeo-fortress-storm');
if (stormSrc) {
	stormSrc.tempImage = '/temp/goguryeo-fortress-red-storm-v2.jpg';
	stormSrc.at = 'The impenetrable walls of Pyongyang';
	stormSrc.alt =
		'The same red two-tier Pyongyang munru on the ridge — storm-cream clouds, grey stone';
	stormSrc.refs = [pyPlace];
}

prependHtml(pyongyang, {
	kind: 'p',
	html: '<b>Red Sun’s capital sits on the ridge</b> — the red two-storey munru, the grey stone, the clouds that always look like weather about to choose a side. Every still of this city is that gate. There is no other capital.',
	ko: '<b>붉은 해의 서울이 능선에 앉는다</b> — 붉은 이층 문루, 회색 돌, 언제나 편을 고를 듯한 구름. 이 도시의 모든 장면은 그 문이다. 다른 서울은 없다.'
});

upsertImage(daeya, {
	id: 'daeya-wide',
	ratio: 1.778,
	tone: '#a16207',
	at: 'DAEYA FORTRESS',
	alt: 'Wide Daeya: tan central gate, giwa munru, grey flanking walls, trees framing the approach',
	refs: ['/pl_daeya_fortress.png'],
	tempImage: sipsJpeg('daeya-wide'),
	prompt:
		'Wide cinematic EXPOSITION still. SAME Daeya as the attached place: tan gate, giwa munru, grey walls, trees. Movie frame of THIS fortress. No text. No watermark.'
});
{
	const i = daeya.images.findIndex((im) => im.id === 'daeya-wide');
	const j = daeya.images.findIndex((im) => im.id === 'daeya_01');
	if (i >= 0 && j >= 0 && i !== j) {
		const [slot] = daeya.images.splice(i, 1);
		daeya.images.splice(j > i ? j - 1 : j, 0, slot);
	}
}

upsertImage(
	snake,
	{
		id: 'snake-river-wide',
		ratio: 1.778,
		tone: '#86efac',
		at: 'The White Tiger',
		alt: 'Wide Snake River in winter: the same willow bend, ice plane, no modern bridge',
		refs: ['/pl_snake_river.png'],
		tempImage: sipsJpeg('snake-river-wide'),
		prompt:
			'Wide cinematic EXPOSITION still. SAME river bend as the attached place, winter, willows, no modern bus. No text. No watermark.'
	},
	null,
	true
);

upsertImage(
	bidam,
	{
		id: 'bidam-sword-dark',
		ratio: 0.5625,
		tone: '#141C2E',
		at: 'He carries the heavenly-horse sword',
		alt: 'Dark navy: Bidam carrying the sword — only the blade and gold ring pommel hold the light',
		refs: ['/ch_bidam.png', '/sword_horse.png'],
		tempImage: sipsJpeg('bidam-sword-dark'),
		prompt:
			'Minimal iconic 9:16. Bidam carrying his sword. Navy void #141C2E. Only the blade and GOLDEN RING POMMEL gleam. Face matches the attached portrait. No text. No watermark.'
	},
	'bidam-defiance'
);

upsertImage(
	bidam,
	{
		id: 'bidam-sword-pommel',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'only the ring pommel holds the light',
		alt: 'Dark close: Bidam’s jaw and the glistening gold ring pommel — white horse inside the ring',
		refs: ['/ch_bidam.png', '/sword_horse.png'],
		tempImage: sipsJpeg('bidam-sword-pommel'),
		prompt:
			'Intimate cinematic CLOSE-UP. Dark navy. Bidam and the gold RING POMMEL at the end of the hilt. Face matches the attached portrait. No text. No watermark.'
	},
	'bidam-sword-dark'
);

upsertImage(
	bidam,
	{
		id: 'bidam-sword-carry',
		ratio: 0.5625,
		tone: '#141C2E',
		at: 'a gold circle at the end of old-hall steel',
		alt: 'Navy void: only the golden ring pommel of Bidam’s heavenly-horse sword holds the light',
		refs: ['/sword_horse.png'],
		tempImage: sipsJpeg('bidam-sword-carry'),
		prompt:
			'Minimal iconic 9:16. Navy void #141C2E. Only the GOLDEN RING POMMEL glistens — white horse inside the ring. No text. No watermark.'
	},
	'bidam-sword-pommel'
);

insertAfterHtml(bidam, 'High Councillor <b>Bidam (42)</b>', [
	{
		kind: 'p',
		html: '<b>He carries the heavenly-horse sword</b> in the dark. The robe eats the lamp. <b>Only the ring pommel holds the light</b> — <b>a gold circle at the end of old-hall steel</b>.',
		ko: '어둠 속에서 <b>그는 천마환도를 든다</b>. 도포가 등을 삼킨다. <b>고리 손잡이만 빛을 받는다</b> — 옛 전당의 강철 끝에 금빛 원.'
	}
]);

upsertImage(
	sunduk,
	{
		id: 'silla-rank-sleeves',
		ratio: 1.778,
		tone: '#8b5cf6',
		at: 'Colour is census, not fashion',
		alt: 'Surabol twilight pond: four officials on the terrace — purple, scarlet, blue, yellow sleeves in rank order',
		refs: ['/pl_eastern_palace.png'],
		tempImage: sipsJpeg('silla-rank-sleeves'),
		prompt:
			'Wide cinematic still. REAL Surabol palace as the attached place. Officials sorted by bone-rank sleeve color: purple, scarlet, blue, yellow. No text. No watermark.'
	},
	'seorabeol-panorama'
);

upsertImage(
	sunduk,
	{
		id: 'silla-rank-colonnade',
		ratio: 1.778,
		tone: '#8b5cf6',
		at: 'the room already knows the order',
		alt: 'Wolji colonnade: True Bone purple nearest, then scarlet, blue, yellow at the far post',
		refs: ['/pl_eastern_palace.png'],
		tempImage: sipsJpeg('silla-rank-colonnade'),
		prompt:
			'Intimate cinematic still. Silla hall by the pond. Officials in purple, scarlet, blue, yellow rank robes. No text. No watermark.'
	},
	'silla-rank-sleeves'
);

insertAfterHtml(sunduk, 'Bone Rank System', [
	{
		kind: 'p',
		html: '<b>Colour is census, not fashion.</b> True Bone wears purple 자색. Head Rank Six wears scarlet 비색. Five wears blue 청색. Four and below wear yellow 황색. In the hall you can read a man before he speaks — <b>the room already knows the order.</b>',
		ko: '<b>색깔은 유행이 아니라 호적이다.</b> 진골은 자색. 6두품은 비색. 5두품은 청색. 4두품 이하는 황색. 전각에서는 입을 열기 전에 사람을 읽는다 — <b>방은 이미 순서를 안다.</b>'
	}
]);

upsertImage(
	sabi,
	{
		id: 'sabi-wide',
		ratio: 1.778,
		tone: '#7f1d1d',
		alt: 'Wide Sabi: reddish munru on the long grey palace wall, green approach, misted mountains',
		refs: ['/pl_sabi_palace.png'],
		tempImage: sipsJpeg('sabi-wide'),
		prompt:
			'Wide cinematic EXPOSITION still. SAME Sabi Palace as the attached place: reddish munru, long giwa wall, green fields. No text. No watermark.'
	},
	null,
	true
);

{
	const slot = finalStand.images.find((im) => im.id === 'final-stand-wide');
	if (!slot) throw new Error('missing final-stand-wide');
	const old = slot.tempImage;
	slot.tempImage = sipsJpeg('final-stand-wide', 'final-stand-wide-v2');
	slot.alt =
		'Wide last siege: the same red two-tier Pyongyang munru on the grey ridge, autumn-gold haze';
	slot.refs = [pyPlace];
	slot.prompt =
		'Minimal iconic 16:9. SAME Pyongyang as the place ref, last siege. Red two-tier munru, grey ridge, cream clouds. Not a colored-speck road. No text. No watermark.';
	if (old && old !== slot.tempImage) {
		const p = path.join('static', old.replace(/^\//, ''));
		if (fs.existsSync(p) && p.endsWith('.jpg')) fs.rmSync(p);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log('patched place wides, bidam sword, rank sleeves');
