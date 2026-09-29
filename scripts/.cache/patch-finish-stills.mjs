import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

function slot(o) {
	return { ratio: 1.778, nsfw: false, ...o };
}

const gaya = findEntry('Gaya, the Lost Nations');
const guard = gaya.blocks.find((b) => text(b).includes('She is guarding the mountain'));
if (guard) {
	guard.html =
		'On her mountain the <b>Lady of the Right View</b> is on watch. At first she is the ridge — jade stone, mist, a woman’s shape the mountain has not admitted yet. <b>The mountain is a woman before it has a face.</b> Then a face comes out of the stone. She is guarding the mountain as if it were a country. She does not look up. She does not need to. Then the sky occupies the path. <b>Cloud comes down to the ridge.</b>';
	guard.ko =
		'산 위에서 <b>정견모주</b>가 지킨다. 처음엔 능선이다 — 옥빛 돌, 안개, 산이 아직 인정하지 않은 여자의 형. <b>산이 얼굴보다 먼저 여자다.</b> 그러다 돌에서 얼굴이 나온다. 나라를 지키듯 산을 지킨다. 올려다보지 않는다. 그럴 필요가 없다. 그러다 하늘이 길을 차지한다. <b>구름이 능선으로 내려온다.</b>';
}

const love = gaya.blocks.find((b) => text(b).includes('Love arrives as weather'));
if (love && !text(love).includes('He falls before he lands')) {
	love.html =
		'Love arrives as weather — sudden, unasked. He cannot keep the hour. <b>He falls before he lands.</b> The sky comes down to touch the mountain, and does not leave.';
	love.ko =
		'사랑은 날씨처럼 온다. 허락을 묻지 않는다. 시각을 지키지 못한다. <b>닿기 전에 먼저 떨어진다.</b> 하늘이 산에 닿으러 내려오고, 떠나지 않는다.';
}

const gayaSlots = [
	slot({
		id: 'rightview-seq-mountain',
		tone: '#c084fc',
		at: 'The mountain is a woman before it has a face',
		alt: 'Korean ridge as a woman’s shape in jade stone and mist — not yet a lady',
		refs: ['/ch_rightview.png'],
		people: ['jeonggyeon'],
		prompt: 'Iconic 16:9. Mountain IS her. Korean ridge. No text. No watermark.'
	}),
	slot({
		id: 'rightview-seq-face',
		tone: '#c084fc',
		at: 'Then a face comes out of the stone',
		alt: 'Close: Right View’s face emerging from jade-mist rock, becoming a lady',
		refs: ['/ch_rightview.png'],
		people: ['jeonggyeon'],
		prompt: 'Close 16:9. Face from stone. Portrait match. No text. No watermark.'
	}),
	slot({
		id: 'ibiga-seq-fall',
		tone: '#1e4d9c',
		at: 'He falls before he lands',
		alt: 'Ibiga falling through his own cloud, struck, looking down',
		refs: ['/ch_ibiga.png'],
		people: ['ibiga'],
		prompt: 'Dynamic 16:9. Ibiga falling in cloud. No text. No watermark.'
	}),
	slot({
		id: 'rightview-seq-close',
		tone: '#c084fc',
		at: 'That woman.',
		alt: 'Close: Right View’s face, the look that stops the sky',
		refs: ['/ch_rightview.png'],
		people: ['jeonggyeon'],
		prompt: 'Intimate close. Beautiful face. No text. No watermark.'
	})
];

const haveG = new Set(gaya.images.map((im) => im.id));
const afterG = gaya.images.findIndex((im) => im.id === 'ibiga-seq-ridge');
gaya.images.splice(afterG < 0 ? gaya.images.length : afterG + 1, 0, ...gayaSlots.filter((s) => !haveG.has(s.id)));

const jumong = findEntry('Jumong');
const slip = jumong.blocks.find((b) => text(b).includes('One night Jumong slips an assassination'));
if (slip && !text(slip).includes('The forest is a closing net')) {
	slip.html += ' <b>The forest is a closing net.</b>';
	slip.ko += ' <b>숲이 그물이다.</b>';
}

const jumongSlots = [
	slot({
		id: 'jumong-seq-forest',
		tone: '#e8563f',
		at: 'The forest is a closing net',
		alt: 'Dark forest chase: Jumong in red running; the net is trees and riders behind',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: 'Animated iconic 16:9. Dark forest chase. High contrast red. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-king',
		tone: '#e8563f',
		at: 'rest of his life driving the western commanderies',
		alt: 'Jumong as first king of Goguryeo — red plane, Jolbon, dynamic face',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: 'Iconic 16:9. First king. Red #e8563f. Animated. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-haemosu-yuhwa-copper',
		tone: '#f0b429',
		nsfw: true,
		at: 'He comes down. He builds a copper room',
		alt: 'Intimate: Haemosu and Yuhwa in the copper room, skin-forward, wanting faces',
		refs: ['/ch_haemosu.png', '/ch_yuhwa.png'],
		people: ['haemosu', 'yuhwa'],
		prompt: 'Intimate close. Copper room. Wanting faces. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-jumong-sosuno-hunger',
		tone: '#e8a04a',
		nsfw: true,
		at: 'The marriage is real hunger first',
		alt: 'Intimate: Jumong and Sosuno, wanting faces, silk open',
		refs: ['/ch_jumong.png', '/ch_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Intimate close. Hunger. Wanting faces. No text. No watermark.'
	})
];

const haveJ = new Set(jumong.images.map((im) => im.id));
const afterJ = jumong.images.findIndex((im) => im.id === 'jumong-turtle-night');
jumong.images.splice(afterJ < 0 ? jumong.images.length : afterJ + 1, 0, ...jumongSlots.filter((s) => !haveJ.has(s.id)));

const tang = findEntry('Silla-Tang Alliance');
const tangSlots = [
	slot({
		id: 'taizong-seq-imposing',
		tone: '#c97a2e',
		at: 'I prefer allies who can count',
		alt: 'Worm’s-eye: Taizong imposing, gold robe with raised blue dragons; Chunchu a white-hanbok sliver',
		refs: ['/ch_taizong.png', '/ch_chunchu.png'],
		people: ['taizong', 'chunchu'],
		prompt: 'Low-angle 16:9. Imposing Taizong, blue dragons. White hanbok Chunchu. No text. No watermark.'
	}),
	slot({
		id: 'taizong-seq-fit',
		tone: '#c97a2e',
		at: 'Yes — there is something between us that fits',
		alt: 'High contrast: gold emperor with blue dragons facing white-and-magenta Chunchu',
		refs: ['/ch_taizong.png', '/ch_chunchu.png'],
		people: ['taizong', 'chunchu'],
		prompt: 'High contrast two-shot. Gold vs white-magenta. Blue dragons. No text. No watermark.'
	})
];

const haveT = new Set(tang.images.map((im) => im.id));
const afterT = tang.images.findIndex((im) => im.id === 'taizong-chunchu-alone');
tang.images.splice(afterT < 0 ? tang.images.length : afterT + 1, 0, ...tangSlots.filter((s) => !haveT.has(s.id)));

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('finish-stills slots');
