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
	if (b.kind === 'scene' || b.kind === 'day') return `${b.label ?? ''} ${b.ko ?? ''}`;
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

function slot(o) {
	return {
		ratio: 1.778,
		nsfw: false,
		...o
	};
}

const death = findEntry('Death of the Second Emperor');
const i = death.blocks.findIndex((b) => text(b).includes('asks for a moment that is not on any schedule'));
if (i < 0) throw new Error('no hallway p');
if (!death.blocks.some((b) => b.label === 'HALLWAY')) {
	death.blocks.splice(i, 0, {
		kind: 'scene',
		label: 'HALLWAY',
		ko: '회랑'
	});
	death.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The colonnade is almost dark. Faint court-light at the far end, not a lamp in the frame. She is porcelain-pale. His magenta is the only warm plane left. <b>The hallway keeps them.</b>',
		ko: '회랑은 거의 어둡다. 먼 끝의 희미한 조정 빛. 등잔은 그림에 없다. 그녀는 백자처럼 창백하다. 남은 따뜻한 면은 그의 자홍뿐이다. <b>회랑이 둘을 붙든다.</b>'
	});
}

const wuSlots = [
	slot({
		id: 'wu-hall-01-keep',
		tone: '#e879a6',
		at: 'The hallway keeps them',
		alt: 'Dark Daming colonnade: pale Wu calling, magenta Chunchu turning — both in the hall',
		refs: ['/ch_wu_zetian.png', '/ch_chunchu.png', '/pl_daming_palace.png'],
		people: ['wuzetian', 'chunchu'],
		prompt: 'Movie 16:9. Dark Tang colonnade. Pale Wu, magenta Chunchu. No lamps. No halo. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-02-pale',
		tone: '#e879a6',
		at: 'you are the one from the country with the woman king',
		alt: 'Close: Wu porcelain-pale in faint light, asking; magenta sleeve at the edge',
		refs: ['/ch_wu_zetian.png', '/ch_chunchu.png'],
		people: ['wuzetian', 'chunchu'],
		prompt: 'Intimate movie close. Pale Wu. Magenta edge. Dark hall. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-03-yes',
		tone: '#D8258C',
		at: 'Yes, ma’am.',
		alt: 'Two-shot: Chunchu’s magenta yes; Wu pale and already measuring him',
		refs: ['/ch_chunchu.png', '/ch_wu_zetian.png'],
		people: ['chunchu', 'wuzetian'],
		prompt: 'Movie two-shot. Magenta vs pale. Dark colonnade. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-04-how',
		tone: '#e879a6',
		at: 'How is she doing?',
		alt: 'Close: Wu’s pale face, the real question in the eyes',
		refs: ['/ch_wu_zetian.png'],
		people: ['wuzetian'],
		prompt: 'Intimate close. Porcelain-pale Wu. Faint light. Dark. No text. No watermark.'
	}),
	slot({
		id: 'wu-hall-05-silence',
		tone: '#e879a6',
		at: 'silence is the true mark of power',
		alt: 'Close: Wu fierce and pale; Chunchu listening in magenta shadow',
		refs: ['/ch_wu_zetian.png', '/ch_chunchu.png'],
		people: ['wuzetian', 'chunchu'],
		prompt: 'Intimate close. Fierce pale Wu. Magenta listener. Dark hall. No text. No watermark.'
	})
];

const whisper = death.images.find((im) => im.id === 'wu-farewell-whisper');
if (whisper) {
	whisper.at = 'The hallway keeps them';
	whisper.alt =
		'Dark Daming colonnade: two figures in the hall, not specks; pale Wu, magenta Chunchu';
	whisper.prompt =
		'Movie 16:9. People in the colonnade. Pale vs magenta. No tiny silhouettes. No text. No watermark.';
}

const haveD = new Set(death.images.map((im) => im.id));
const afterW = death.images.findIndex((im) => im.id === 'wu-farewell-whisper');
death.images.splice(afterW + 1, 0, ...wuSlots.filter((s) => !haveD.has(s.id)));

const gaya = findEntry('Gaya, the Lost Nations');
const guard = gaya.blocks.find((b) => text(b).includes('She is guarding the mountain'));
if (guard && !text(guard).includes('Cloud comes down to the ridge')) {
	guard.html =
		'On her mountain the <b>Lady of the Right View</b> is on watch — jade-mist silk, one ridge, no court behind her. She is guarding the mountain as if it were a country. She does not look up. She does not need to. Then the sky occupies the path. <b>Cloud comes down to the ridge.</b>';
	guard.ko =
		'산 위에서 <b>정견모주</b>가 지킨다 — 옥안개 비단, 능선 하나, 뒤에 조정이 없다. 나라를 지키듯 산을 지킨다. 올려다보지 않는다. 그럴 필요가 없다. 그러다 하늘이 길을 차지한다. <b>구름이 능선으로 내려온다.</b>';
}

const ibigaSlot = slot({
	id: 'ibiga-seq-ridge',
	tone: '#1e4d9c',
	at: 'Cloud comes down to the ridge',
	alt: 'Movie: Ibiga occupying the Korean ridge; Right View turning — cobalt vs jade',
	refs: ['/ch_ibiga.png', '/ch_rightview.png'],
	people: ['ibiga', 'jeonggyeon'],
	prompt: 'Movie 16:9. Ibiga IS cloud on a real Korean ridge. She turns. No halo. No text. No watermark.'
});
if (!gaya.images.some((im) => im.id === ibigaSlot.id)) {
	const afterI = gaya.images.findIndex((im) => im.id === 'ibiga-lookdown-face');
	gaya.images.splice(afterI < 0 ? gaya.images.length : afterI + 1, 0, ibigaSlot);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('hallway + ibiga ridge slots');
