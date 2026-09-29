import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const slots = [
	{
		id: 'yuhwa-exile-pavilion-wide',
		ratio: 1.778,
		tone: '#2f8f7a',
		nsfw: false,
		at: 'Habek kicks Yuhwa out',
		alt: 'Wide: Habek’s dark giwa pavilion over the braided Amnok, tiny figures on the walkway as he drives Yuhwa out',
		people: ['habek', 'yuhwa'],
		refs: ['/pl_amnok_pavillion.png', '/ch_habek.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-habek-dutch',
		ratio: 1.778,
		tone: '#2f8f7a',
		nsfw: false,
		at: 'Habek kicks Yuhwa out',
		alt: 'Dutch: Habek lunges from the pavilion floor, sleeve a closed door, Yuhwa driven toward the walkway',
		people: ['habek', 'yuhwa'],
		refs: ['/pl_amnok_pavillion.png', '/ch_habek.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-walkway-stumble',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'The pavilion walkway does not catch her',
		alt: 'Yuhwa stumbles on the timber walkway, ice-blue silk, river far below',
		people: ['yuhwa', 'habek'],
		refs: ['/pl_amnok_pavillion.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/ch_habek.png']
	},
	{
		id: 'yuhwa-exile-dejected-sit',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'For a while nobody comes',
		alt: 'Abandoned: Yuhwa sits small on packed earth below the pavilion, mist gone, ice-blue dull with dust',
		people: ['yuhwa'],
		refs: ['/pl_amnok_pavillion.png', '/pl_amnok_river.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-dejected-ecu',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: false,
		at: 'For a while nobody comes',
		alt: 'ECU: Yuhwa’s dejected face, dust on ice-blue, she does not look up',
		people: ['yuhwa'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-sky-voice',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'The sky talks first',
		alt: 'Worm’s-eye: Yuhwa looks up; a gold light-plane in the cloud, no body',
		people: ['yuhwa', 'haemosu'],
		refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_amnok_river.png']
	},
	{
		id: 'yuhwa-exile-fox-appear',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'The fox is already on the packed earth',
		alt: 'The pale gold-white sun-fox stands on packed earth; Yuhwa seeing it',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_amnok_pavillion.png']
	},
	{
		id: 'yuhwa-exile-fox-lookback',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'The fox is already on the packed earth',
		alt: 'The sun-fox looks back once from the packed earth, Yuhwa still sitting',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-fox-follow-south',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'She follows behind',
		alt: 'OTS: Yuhwa follows the sun-fox south along the Amnok, bare feet, dusty ice-blue',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_amnok_river.png']
	},
	{
		id: 'yuhwa-exile-fox-pine',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'Pine shade, then a river-bend',
		alt: 'Pine shade: tiny Yuhwa following the pale fox, a river-bend that is not the Amnok',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-fox-pass',
		ratio: 1.778,
		tone: '#f0b429',
		nsfw: false,
		at: 'The fox is a pale stamp on the switchback',
		alt: 'Bird’s-eye: a pass of bare stone, Yuhwa smaller than the ridge, the fox a pale stamp on the switchback',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-fox-buyeo-see',
		ratio: 1.778,
		tone: '#a89a72',
		nsfw: false,
		at: 'The capital is a palisade from the river',
		alt: 'From a ridge: Northern Buyeo’s mountain city under a real sky; fox and Yuhwa tiny in the lower third',
		people: ['yuhwa', 'haemosu'],
		refs: ['/obj_haemosu_fox.png', '/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_northern_buyeo.png']
	},
	{
		id: 'yuhwa-exile-geumwa-path',
		ratio: 1.778,
		tone: '#a89a72',
		nsfw: false,
		at: 'Come in. I’ve got a room free.',
		alt: 'Palace path: Geumwa in red-burgundy court silk reaching toward dusty Yuhwa; the fox already gone',
		people: ['geumwa', 'yuhwa'],
		refs: ['/pl_buyeo_palace.png', '/ch_geumwa.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	},
	{
		id: 'yuhwa-exile-geumwa-come-in',
		ratio: 1.778,
		tone: '#a89a72',
		nsfw: false,
		at: 'Come in. I’ve got a room free.',
		alt: 'Dutch two-shot: Geumwa offers the room; Yuhwa still dusty, ice-blue, not kneeling as a plea',
		people: ['geumwa', 'yuhwa'],
		refs: ['/pl_buyeo_palace.png', '/ch_geumwa.png', '/ch_yuhwa.png', '/bn_yuhwa.png']
	}
];

const newBlocks = [
	{
		kind: 'p',
		html: 'The pavilion walkway does not catch her. Habek’s sleeve is already the closed door. She hits packed earth with ice-blue still wet from the copper.',
		ko: '누각 복도가 받아주지 않는다. 하백의 소매가 이미 닫힌 문이다. 구리가 덜 마른 얼음빛으로 다진 흙에 엎어진다.'
	},
	{
		kind: 'p',
		html: 'For a while nobody comes. The mist that used to be a bed is just weather. She sits where the river can see her and does not look up.',
		ko: '한동안 아무도 안 온다. 침대였던 안개가 그냥 날씨다. 강이 보이는 자리에 앉아서, 올려다보지 않는다.'
	},
	{
		kind: 'p',
		html: 'The sky talks first. Gold is a plane in the cloud, not a body. She hears him before she sees anything with paws.',
		ko: '하늘이 먼저 말한다. 금빛은 구름 안의 면이지 몸이 아니다. 발 달린 걸 보기 전에 그 목소리를 듣는다.'
	},
	{
		kind: 'dialogue',
		chip: '#f0b429',
		person: 'haemosu',
		en: ['Hey.', 'Wait. Don’t sit in the dust.', 'Follow the fox.'],
		lines: ['야.', '잠깐. 흙에 앉지 마.', '여우를 따라가.']
	},
	{
		kind: 'p',
		html: 'The fox is already on the packed earth. Pale gold-white fur, the heat that stopped the chariot, looking back once as if she might miss the joke.',
		ko: '여우가 이미 다진 흙 위에 있다. 창백한 금빛 흰 털, 수레를 세웠던 그 열. 한 번 돌아본다. 농담을 놓칠까 봐.'
	},
	{
		kind: 'p',
		html: 'Pine shade, then a river-bend that is not the Amnok. The fox does not explain the map.',
		ko: '소나무 그늘, 그다음엔 압록이 아닌 강굽이. 여우는 지도를 설명하지 않는다.'
	},
	{
		kind: 'p',
		html: 'A pass of bare stone. She is smaller than the ridge. The fox is a pale stamp on the switchback.',
		ko: '벗은 돌의 고개. 그녀는 능선보다 작다. 여우는 굽잇길 위의 창백한 도장이다.'
	}
];

let patched = false;
for (const ch of Object.values(story)) {
	for (const en of ch.entries ?? []) {
		if (en.title !== 'Jumong') continue;
		patched = true;
		const ids = new Set((en.images ?? []).map((im) => im.id));
		const after = (en.images ?? []).findIndex((im) => im.id === 'jumong-cine-geumwa-worm');
		const insertAt = after >= 0 ? after + 1 : (en.images ?? []).length;
		const fresh = slots.filter((s) => !ids.has(s.id));
		en.images.splice(insertAt, 0, ...fresh);

		const kiln = (en.blocks ?? []).findIndex(
			(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Habek finds the kiln still warm')
		);
		if (kiln < 0) throw new Error('kiln block not found');
		const already = (en.blocks ?? []).some(
			(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('The pavilion walkway does not catch her')
		);
		if (!already) {
			en.blocks.splice(kiln + 1, 0, ...newBlocks.slice(0, 5));
		}
		const road = (en.blocks ?? []).findIndex(
			(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('A fox-shaped quiet leaves pawprints')
		);
		if (road < 0) throw new Error('pawprints block not found');
		const pineAlready = (en.blocks ?? []).some(
			(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Pine shade, then a river-bend')
		);
		if (!pineAlready) {
			en.blocks.splice(road + 1, 0, ...newBlocks.slice(5));
		}
		console.log(`Jumong images +${fresh.length}; blocks walkway=${!already} pine=${!pineAlready}`);
	}
}
if (!patched) throw new Error('Jumong entry not found');
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wrote story.json');
