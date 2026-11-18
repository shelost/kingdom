import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function entryWith(pred) {
	for (const ch of story) {
		for (const entry of ch.entries ?? []) {
			if (pred(entry)) return entry;
		}
	}
	return null;
}

const revolt = entryWith((e) => e.title === 'The Revolt');
const muryuk = entryWith((e) => e.thumbnail === 'muryuk-seq-cone-fight');
const sunduk = entryWith((e) => (e.images ?? []).some((im) => im.id === 'sd-watch-munhee'));
const suro = entryWith((e) => e.thumbnail === 'innuendo-heo-red-sail-dawn');

if (!revolt || !muryuk || !sunduk || !suro) {
	throw new Error(
		JSON.stringify({
			revolt: !!revolt,
			muryuk: !!muryuk,
			sunduk: !!sunduk,
			suro: !!suro
		})
	);
}

if (!revolt.images.some((im) => im.id === 'yeon-massacre-hall')) {
	revolt.images.unshift({
		id: 'yeon-massacre-hall',
		src: '/in_yeon_massacre.png',
		ratio: 2,
		time: 'night',
		alt: 'Night in the hall. One man, swords on his back. The floor is red. The men still standing do not move.',
		people: ['gesomun']
	});
}
revolt.thumbnail = 'yeon-massacre-hall';

if (!muryuk.images.some((im) => im.id === 'muryuk-helm-stand')) {
	muryuk.images.push({
		id: 'muryuk-helm-stand',
		src: '/thumb_muryuk.png',
		ratio: 2,
		time: 'day',
		at: 'At dawn he takes the helm off.',
		alt: 'The Gaya helm on its stand. Purple plume. He has taken it off.',
		people: ['muryuk']
	});
}
muryuk.thumbnail = 'muryuk-helm-stand';

const helmBeat = 'At dawn he takes the helm off.';
if (!muryuk.blocks.some((b) => b.html?.includes(helmBeat))) {
	const i = muryuk.blocks.findIndex((b) => (b.en ?? []).some((line) => /Then there.s time/.test(line)));
	if (i < 0) throw new Error('muryuk birth beat not found');
	muryuk.blocks.splice(
		i + 1,
		0,
		{
			kind: 'p',
			html: 'At dawn he takes the helm off. He has worn it since he was a boy. The plume is the same purple. He sets it on the stand by the door.',
			ko: '새벽에 투구를 벗는다. 어릴 때부터 써 온 것이다. 깃은 여전히 자색이다. 문 옆 받침대 위에 올려 둔다.'
		},
		{
			kind: 'p',
			html: 'He does not put it back on. The boy in the next room will hear Silla first. The helm can stay where it is.',
			ko: '다시 쓰지 않는다. 옆방의 아이는 신라를 먼저 들을 것이다. 투구는 거기 있으면 된다.'
		}
	);
}

if (!sunduk.images.some((im) => im.id === 'sd-munhee-helm')) {
	sunduk.images.push({
		id: 'sd-munhee-helm',
		src: '/obj_muryuk_helmet.png',
		ratio: 1,
		time: 'night',
		at: 'By the inner door of her cousin’s house a steel helm sits on a stand.',
		alt: 'A steel helm on a stand inside the house. A long purple plume. Nobody is wearing it.',
		people: []
	});
}

const helmPlant = 'By the inner door of her cousin’s house a steel helm sits on a stand.';
if (!sunduk.blocks.some((b) => b.html?.includes(helmPlant))) {
	const i = sunduk.blocks.findIndex((b) => b.html?.includes('She watches other people love.'));
	if (i < 0) throw new Error('sunduk house beat not found');
	sunduk.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'By the inner door of her cousin’s house a steel helm sits on a stand. A long purple plume. Nobody in the room is wearing it. Sunduk sees it from the garden and does not ask.',
		ko: '사촌 집 안쪽 문 옆, 받침대 위에 쇠 투구가 있다. 긴 자색 깃. 방 안의 누구도 쓰고 있지 않다. 선덕은 뜰에서 그걸 보고, 묻지 않는다.'
	});
}

const tentEn = 'She takes him by the collar back down the path to the tent by the water. Before anyone may say marriage, the lamp in the tent burns late.';
const cabinEn =
	'She takes him by the collar, up the gangplank, into the cabin under the red sail. Before anyone may say marriage, the lamp in the cabin burns late.';
const tentKo = '그녀가 그의 옷깃을 잡고 물가 천막까지 길을 되짚어 데려간다. 혼인이라는 말이 나오기도 전에, 천막의 등잔은 늦도록 꺼지지 않는다.';
const cabinKo =
	'그녀가 그의 옷깃을 잡고 현판을 올라, 붉은 돛 아래 선실로 데려간다. 혼인이라는 말이 나오기도 전에, 선실의 등잔은 늦도록 꺼지지 않는다.';
for (const b of suro.blocks) {
	if (b.html === tentEn) b.html = cabinEn;
	if (b.ko === tentKo) b.ko = cabinKo;
}

const cabinBeat = 'The cabin is small.';
if (!suro.blocks.some((b) => b.html?.startsWith(cabinBeat))) {
	const i = suro.blocks.findIndex((b) => b.html === cabinEn);
	if (i < 0) throw new Error('suro cabin beat not found');
	suro.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The cabin is small. One lamp on the floorboards. The red sail is a dark curve over the hatch, and the hull answers the water. She shuts the hatch.',
		ko: '선실은 좁다. 등잔은 바닥에 하나. 붉은 돛이 해치 위로 어두운 곡선을 그리고, 선체는 물에 대답한다. 그녀가 해치를 닫는다.'
	});
}

for (const im of suro.images) {
	if (im.at === 'the lamp in the tent burns late') im.at = 'Before anyone may say marriage, the lamp in the cabin burns late.';
}

const cabinSlots = [
	{
		id: 'suro-cabin-lamp',
		ratio: 2,
		time: 'night',
		at: 'The cabin is small.',
		alt: 'Inside the red-sailed ship. One lamp on the floor. He is undone. She is not.',
		people: ['suro', 'heohwangok']
	},
	{
		id: 'suro-cabin-after',
		ratio: 2,
		time: 'night',
		at: 'Later she lies watching the width of his back while he trims the wick',
		alt: 'After. His bare back to the lamp. Her purple silk loosened at one shoulder. The red sail is dark outside.',
		people: ['suro', 'heohwangok']
	}
];
for (const slot of cabinSlots) {
	if (!suro.images.some((im) => im.id === slot.id)) suro.images.push(slot);
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log(
	JSON.stringify({
		revolt: revolt.thumbnail,
		muryuk: muryuk.thumbnail,
		sundukHelm: sunduk.images.some((im) => im.id === 'sd-munhee-helm'),
		cabin: suro.images.filter((im) => im.id.startsWith('suro-cabin')).map((im) => im.id)
	})
);
