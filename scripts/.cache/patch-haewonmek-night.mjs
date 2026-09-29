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

const jumong = findEntry('Jumong');
const fly = jumong.blocks.find((b) => text(b).includes('Haewonmek</b> is already in the air'));
if (fly && !text(fly).includes('Jumong does not see the reaper')) {
	fly.html =
		'<b>Haewonmek</b> is already in the air — flying the river’s face toward Jumong, black gat, dark silk, mouth bound by a black band, not a walk. Jumong does not see him. The boy looks at water and rain. <b>Jumong does not see the reaper.</b> Then the sun comes in as a body. A gold shaft slams the reaper mid-flight and knocks him off the line. He tumbles. Jumong is still on the near stones with the water at his back.';
	fly.ko =
		'<b>해원맥</b>은 이미 공중에 있다 — 강의 얼굴을 가로질러 주몽에게 날아온다. 검은 갓, 어두운 비단, 입을 가린 검은 띠. 걸음이 아니다. 주몽은 그를 보지 못한다. 물은 보고 비는 본다. <b>주몽은 차사를 보지 못한다.</b> 그러고 해가 몸으로 들어온다. 금빛 기둥이 날던 차사를 한가운데서 때리고, 길을 꺾는다. 그는 구른다. 주몽은 아직 가까운 쪽 돌 위에 있고, 등 뒤에 물이 있다.';
}

const flash = jumong.blocks.find((b) => text(b).includes('Then a flash, as if dawn had forgotten'));
if (flash && !text(flash).includes('Two 해 cut the rain-canopy')) {
	flash.html += ' <b>Two 해 cut the rain-canopy.</b>';
	flash.ko += ' <b>두 해가 빗속 수관을 가른다.</b>';
}

const extras = [
	slot({
		id: 'haewonmek-seq-unseen',
		tone: '#6b5b6e',
		at: 'Jumong does not see the reaper',
		alt: 'Worm’s-eye night rain: Jumong looks at the river; Haewonmek dives above him unseen, black band on the mouth',
		refs: ['/ch_jumong.png', '/ch_haewonmek.png'],
		people: ['jumong', 'haewonmek'],
		prompt: 'Night rain forest river. Jumong does not see the diving reaper. Worm’s-eye. Black mouth band. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-seq-aerial',
		tone: '#f0b429',
		at: 'Two 해 cut the rain-canopy',
		alt: 'Aerial night rain: Haemosu gold aura and Haewonmek dark aura cutting the pine canopy',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png'],
		people: ['haemosu', 'haewonmek'],
		prompt: 'Aerial night rain pines. Two flying gods, gold vs charcoal aura. No text. No watermark.'
	}),
	slot({
		id: 'haemosu-seq-wormglow',
		tone: '#f0b429',
		at: 'Do you really think the sun disappears at night',
		alt: 'Worm’s-eye: Haemosu towering in rain, gold light soaking wet pines; Haewonmek a dark banded silhouette',
		refs: ['/ch_haemosu.png', '/ch_haewonmek.png'],
		people: ['haemosu', 'haewonmek'],
		prompt: 'Worm’s-eye night rain. Bright Haemosu gold aura. Black-banded reaper. No text. No watermark.'
	})
];

const have = new Set(jumong.images.map((im) => im.id));
const after = jumong.images.findIndex((im) => im.id === 'haewonmek-sun-knock');
jumong.images.splice(after < 0 ? jumong.images.length : after + 1, 0, ...extras.filter((s) => !have.has(s.id)));

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('haewonmek night seq');
