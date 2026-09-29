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

function sipsJpeg(srcPng, destJpg) {
	if (!fs.existsSync(srcPng)) throw new Error(`missing ${srcPng}`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', srcPng, '--out', destJpg],
		{ stdio: 'ignore' }
	);
	fs.rmSync(srcPng);
}

const h = '/ch_haemosu.png';
const w = '/ch_haewonmek.png';
const j = '/ch_jumong.png';

const installs = [
	{
		id: 'haemosu-ambush-night',
		ratio: 1.778,
		tone: '#f0b429',
		at: 'ambushes him from the dark',
		alt: 'Night Amnok: jolly Haemosu grabs Haewonmek’s sword-wrist from behind as a gold wedge cuts the dark',
		refs: [h, w],
		people: ['haemosu', 'haewonmek']
	},
	{
		id: 'haemosu-whisper-ear',
		ratio: 1.778,
		tone: '#f0b429',
		at: 'Jumong cannot see him',
		alt: 'Night close: Haemosu whispers a gold breath into Jumong’s ear; Jumong looks at empty river',
		refs: [h, j],
		people: ['haemosu', 'jumong']
	},
	{
		id: 'jumong-turtle-night',
		ratio: 1.778,
		tone: '#e8563f',
		at: 'shell to shell in the dark',
		alt: 'Night Amnok: Jumong in red runs a narrow turtle-shell ribbon under the moon',
		refs: [j],
		people: ['jumong']
	},
	{
		id: 'gods-watch-run',
		ratio: 1.778,
		tone: '#f0b429',
		at: 'a red speck on the far dark',
		alt: 'Night bank: laughing Haemosu’s arm on exasperated Haewonmek; tiny red Jumong running away on turtles',
		refs: [h, w, j],
		people: ['haemosu', 'haewonmek', 'jumong']
	},
	{
		id: 'haemosu-jolly-haewonmek',
		ratio: 1.778,
		tone: '#6b5b6e',
		at: 'laughs like the job is done',
		alt: 'Night two-shot: Haemosu roaring with laughter; Haewonmek grimacing, gat askew',
		refs: [h, w],
		people: ['haemosu', 'haewonmek']
	}
];

const prompt =
	'Minimal iconic night still. REAL Amnok, moon-haze. Faces match attached portraits. Haemosu silver-white hair, white silk, gold #f0b429, jolly. Haewonmek black gat, cobalt sash, exasperated. Jumong red #e8563f. No army. No palace. No text. No watermark.';

const jumong = findEntry('Jumong');
const after = jumong.images.findIndex((im) => im.id === 'haemosu-blocks-haewonmek');
let insertAt = after >= 0 ? after + 1 : jumong.images.length;

for (const item of installs) {
	const src = path.join(ASSETS, `${item.id}.png`);
	const dest = path.join(TEMP, `${item.id}.jpg`);
	sipsJpeg(src, dest);
	const slot = {
		id: item.id,
		ratio: item.ratio,
		tone: item.tone,
		at: item.at,
		alt: item.alt,
		refs: item.refs,
		people: item.people,
		tempImage: `/temp/${item.id}.jpg`,
		prompt
	};
	const i = jumong.images.findIndex((im) => im.id === item.id);
	if (i >= 0) Object.assign(jumong.images[i], slot);
	else {
		jumong.images.splice(insertAt, 0, slot);
		insertAt += 1;
	}
}

const water = jumong.blocks.find((b) => b.html?.includes('They reach water'));
if (water && !water.html.includes('at night')) {
	water.html =
		'They reach water at night — a river with no ford, no boat, and a death already written for that day. Something flies at him from the far bank. Then a flash, as if dawn had forgotten the hour.';
	water.ko =
		'밤에 물에 닿는다 — 여울도 배도 없고, 오늘 죽기로 적힌 목숨. 저편에서 무언가가 날아온다. 그러고 섬광. 새벽이 시각을 잊은 듯.';
}

const hood = jumong.blocks.find((b) => b.html?.includes('sun god is only a silhouette'));
if (hood && !jumong.blocks.some((b) => b.html?.includes('ambushes him from the dark'))) {
	const i = jumong.blocks.indexOf(hood);
	jumong.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'He ambushes him from the dark — a laugh first, then the wrist. The night is Haewonmek’s road. The joke is Haemosu’s.',
		ko: '어둠에서 덮친다 — 웃음이 먼저고, 그다음이 손목이다. 밤은 해원맥의 길이다. 농담은 해모수의 것이다.'
	});
}

const whisper = jumong.blocks.find((b) => b.html?.includes('closer than an ear'));
if (whisper) {
	whisper.html =
		'He puts <b>Haewonmek</b> aside the way an elder puts aside a younger who has grabbed the wrong sleeve. Then he ambushes the boy the other way — not a grab, a whisper. He leans to Jumong’s ear. Jumong cannot see him. Only the night, the river, a warmth that should not be there. The idea arrives as breath.';
	whisper.ko =
		'<b>해원맥</b>을 밀어낸다. 맏이가 아우의 소매를 걷어내듯. 그러고 아이를 다른 방식으로 덮친다 — 붙잡는 게 아니라, 속삭임. 주몽의 귀에 입을 댄다. 주몽은 그를 보지 못한다. 밤과 강과, 거기 있어서는 안 될 온기뿐. 생각은 숨결로 온다.';
}

const turtles = jumong.blocks.find((b) => b.html?.includes('Tortoises rise and lock shell'));
if (turtles) {
	turtles.html =
		'The river answers. Tortoises rise and lock shell to shell in the dark. Jumong runs the wet backs as if they had always been a road.';
	turtles.ko =
		'강이 응답한다. 자라들이 떠올라 어둠 속에서 등딱지를 잇는다. 주몽이 젖은 등 위를 달린다 — 원래부터 길이었던 것처럼.';
}

if (!jumong.blocks.some((b) => b.html?.includes('a red speck on the far dark'))) {
	const i = jumong.blocks.findIndex((b) => b.html?.includes('shell to shell in the dark'));
	if (i < 0) throw new Error('missing turtle night paragraph');
	jumong.blocks.splice(i + 1, 0, {
		kind: 'p',
		html: 'The two 해 stay on the near stones. Jumong is already a red speck on the far dark. Haemosu throws an arm across Haewonmek’s shoulder and laughs like the job is done. Haewonmek’s gat is still askew — the look of a clerk whose ledger just walked off.',
		ko: '두 해는 가까운 쪽 돌에 남는다. 주몽은 이미 먼 어둠의 붉은 점이다. 해모수가 해원맥의 어깨에 팔을 걸치고, 일이 끝난 듯이 웃는다. 해원맥의 갓은 아직 비뚤다 — 명부가 제 발로 걸어 나간 서기의 얼굴.'
	});
}

if (!jumong.blocks.some((b) => b.en?.includes("Look at him go. That's my boy."))) {
	const i = jumong.blocks.findIndex((b) => b.en?.some((l) => l.includes('let you take him')));
	if (i >= 0) {
		jumong.blocks.splice(
			i + 1,
			0,
			{
				kind: 'dialogue',
				chip: '#f0b429',
				person: 'haemosu',
				lines: ['봐. 저거.', '내 아이다.'],
				en: ['Look at him go.', "That's my boy."]
			},
			{
				kind: 'dialogue',
				chip: '#6b5b6e',
				person: 'haewonmek',
				lines: ['명부를 훔쳤다.'],
				en: ['You just robbed a ledger.']
			},
			{
				kind: 'dialogue',
				chip: '#f0b429',
				person: 'haemosu',
				lines: ['하루를 빌렸다.', '돌려줄 테다.'],
				en: ['I borrowed a day.', "I'll give it back."]
			}
		);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log(`installed ${installs.length} night-encounter slots`);
