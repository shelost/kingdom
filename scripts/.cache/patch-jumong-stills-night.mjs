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

const jumong = findEntry('Jumong');
const t = '/ch_yeon_tabal.png';
const j = '/ch_jumong.png';
const s = '/ch_sosuno.png';
const bn = '/bn_sosuno.png';
const y = '/ch_yuhwa.png';
const g = '/ch_geumwa.png';
const pl = '/pl_buyeo_yard.png';

const slots = [
	{
		id: 'jumong-seq-tabal-night-wide',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'The hall is only torches',
		alt: 'Bird’s-eye dead of night: Jolbon timber hall, grey giwa as a dark bar, tiny figures in torch pools',
		refs: [t, j],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'jumong-seq-tabal-torch-ots',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'So who sent you',
		alt: 'OTS Tabal in tiger-pelt: Jumong kneeling wet in torchlight, interrogation',
		refs: [t, j],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'jumong-pov-tabal-kill',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'So this is how I die',
		alt: 'Jumong’s POV: spear-butts and rope, Tabal not looking, torch as the only key',
		refs: [t, j],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'tabal-pov-bow',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'the wood stays as it was',
		alt: 'Tabal’s POV looking down: unbent bow, kneeling wet Jumong in torchlight',
		refs: [t, j],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'jumong-seq-tabal-stop',
		ratio: 1.778,
		nsfw: false,
		tone: '#a97c4a',
		at: 'Stop!',
		alt: 'Dutch ECU: Tabal’s stop-hand, torch flare, sparks, crushed black hall',
		refs: [t],
		people: ['yeontabal']
	},
	{
		id: 'jumong-seq-tabal-lineage',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Son of Haemosu',
		alt: 'Worm’s-eye: wet Jumong claiming lineage under Tabal and torch',
		refs: [j, t],
		people: ['jumong', 'yeontabal']
	},
	{
		id: 'jumong-seq-shed-night',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'Shed. You hunt, you eat.',
		alt: 'Dutch torch: Jumong mid-stride into a timber shed, Tabal a tiger-pelt stamp on the porch',
		refs: [j, t],
		people: ['jumong', 'yeontabal']
	},
	{
		id: 'jumong-buyeo-hatch-worm',
		ratio: 0.75,
		nsfw: false,
		tone: '#e8563f',
		at: 'He looks up from the shell',
		alt: 'Worm’s-eye from inside the split egg: a boy looking up, one red #e8563f seam',
		refs: [j, y],
		people: ['jumong', 'yuhwa']
	},
	{
		id: 'jumong-seq-buyeo-roof',
		ratio: 1.778,
		nsfw: false,
		tone: '#a89a72',
		at: 'From the roof the yard is a packed-earth square',
		alt: 'Bird’s-eye dusk: Northern Buyeo packed-earth square, grey-giwa hall as a dark bar, tiny Geumwa',
		refs: [pl, g],
		people: ['geumwa']
	},
	{
		id: 'jumong-seq-pine-net-crane',
		ratio: 1.778,
		nsfw: false,
		tone: '#e8563f',
		at: 'The forest is a closing net',
		alt: 'Aerial crane: pine canopy as a net, tiny red Jumong running the dark floor',
		refs: [j],
		people: ['jumong']
	}
];

const after = jumong.images.findIndex((im) => im.id === 'jumong-seq-tabal-bow');
let insertAt = after >= 0 ? after + 1 : jumong.images.length;

for (const item of slots) {
	const i = jumong.images.findIndex((im) => im.id === item.id);
	if (i >= 0) {
		Object.assign(jumong.images[i], item);
		continue;
	}
	jumong.images.splice(insertAt, 0, item);
	insertAt += 1;
}

const arrival = jumong.blocks.find((b) => b.html?.includes('The Jolbon hall is a timber country'));
if (arrival) {
	arrival.html =
		'They bring him in at dead of night, not as a guest. One scout keeps looking back like the pines might grow more men. The valley opens under grey giwa. Moon-haze, no daylight. Tabal is on the porch with a cup he is not drinking. <b>The Jolbon hall is a timber country.</b> <b>The hall is only torches.</b>';
	arrival.ko =
		'손님으로 데려오지 않는다. 한밤중이다. 척후 하나가 자꾸 뒤를 본다. 소나무에서 사람이 더 나올까 봐. 회색 기와 아래 골짜기가 열린다. 달 안개. 낮빛은 없다. 연타발은 누대에 있다. 잔은 들었는데 안 마신다. <b>졸본 대청은 나무 나라다.</b> <b>대청은 횃불뿐이다.</b>';
}

const intro = jumong.blocks.find((b) => b.html?.includes('Jumong is still wet'));
if (intro) {
	intro.html =
		'<b>Yeon Tabal</b> is the man the scouts meant. Crow-clan chieftain, largest roof in a valley of five that will not share a yard. Jumong is still wet. The bow they took off him is on the packed earth by Tabal’s foot. Torch-pools, crushed black, sparks. Tabal has not offered a mat.';
	intro.ko =
		'<b>연타발</b>이 그 사람이다. 까마귀 족장. 마당을 안 나누는 지붕 다섯 중 제일 큰 집. 주몽은 아직 젖어 있다. 빼앗긴 활이 연타발 발치 다진 흙 위에 있다. 횃불 웅덩이, 짓눌린 검은색, 불티. 자리는 안 줬다.';
}

const hatch = jumong.blocks.find((b) => b.html?.includes('Out of the egg comes a boy'));
if (hatch && !hatch.html.includes('He looks up from the shell')) {
	hatch.html =
		'Then the shell goes. <b>Out of the egg comes a boy</b>. <b>He looks up from the shell</b>. They name him <b>Jumong</b> — the good shot — because in those days people were named for what heaven had plainly already decided.';
	hatch.ko =
		'그리고 껍질이 간다. <b>알에서 사내아이가 나온다</b>. <b>껍질에서 위를 본다</b>. 사람들은 아이를 <b>주몽</b> — 활 잘 쏘는 이 — 이라 이름 짓는다. 그 시절에는 하늘이 이미 정해 둔 것을 따라 이름을 지었기 때문이다.';
}

const yard = jumong.blocks.find((b) => b.html?.includes('The Buyeo yard is a timber country'));
if (yard && !yard.html.includes('From the roof the yard is a packed-earth square')) {
	yard.html = yard.html.replace(
		'<b>The Buyeo yard is a timber country.</b>',
		'<b>The Buyeo yard is a timber country.</b> <b>From the roof the yard is a packed-earth square.</b>'
	);
	if (!yard.ko.includes('지붕에서 보면')) {
		yard.ko = yard.ko.replace(
			'하늘에는 아직 날씨가 붙어 있다.',
			'하늘에는 아직 날씨가 붙어 있다. <b>지붕에서 보면 마당은 다진 흙 네모다.</b>'
		);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`patched ${slots.length} slots; night script locked`);
