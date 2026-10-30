// Split the combined Harmony Council (636: yard → 632 council flashback → Jade Gate Valley → queen's door)
// into two episodes again: Harmony Council (632, the council night + the peonies) and
// Jade Gate Valley (636, the yard, the valley, the queen's door), placed after Gwanggeto.
// The combined version is archived whole in src/lib/data/archive/ so it can be restored later.
// Idempotent: skipped when a Jade Gate Valley entry already exists.
import fs from 'node:fs';
import path from 'node:path';

const FILE = 'src/lib/data/story.json';
const ARCHIVE = 'src/lib/data/archive/harmony-council-636-combined.json';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const raw = fs.readFileSync(FILE, 'utf8');
const chapters = JSON.parse(raw);
const samhan = chapters.find((c) => c.id === 'samhan');
const entryOf = (title) => {
	const e = samhan.entries.find((x) => x.title === title);
	if (!e) throw new Error(`samhan: no entry "${title}"`);
	return e;
};

if (samhan.entries.some((e) => e.title === 'Jade Gate Valley')) {
	console.log('already split');
	process.exit(0);
}

const council = entryOf('Harmony Council');
const queen = entryOf('Queen Sunduk');
const gwanggeto = entryOf('Gwanggeto, the Great King');

/* ————— archive the combined episode exactly as it stands ————— */
fs.mkdirSync(path.dirname(ARCHIVE), { recursive: true });
fs.writeFileSync(
	ARCHIVE,
	JSON.stringify(
		{
			note: 'Combined Harmony Council (636): Hwarang yard, the 632 council as a flashback, Jade Gate Valley, the queen’s door. Split into Harmony Council (632) and Jade Gate Valley (636). To restore: put `entry` back in chapter `samhan` after `after`, set Queen Sunduk’s last block to `queenSundukCard`, delete Jade Gate Valley and the split Harmony Council, and set Gwanggeto’s last block to `gwanggetoCard`.',
			archivedAt: new Date().toISOString().slice(0, 10),
			chapter: 'samhan',
			after: 'Queen Sunduk',
			queenSundukCard: queen.blocks.at(-1),
			gwanggetoCard: gwanggeto.blocks.at(-1),
			entry: council
		},
		null,
		'\t'
	) + '\n'
);

/* ————— cut the combined blocks into their sections ————— */
const blocks = council.blocks;
const at = (pred, what) => {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error(`Harmony Council: no ${what}`);
	return i;
};
const iNight = at((b) => b.kind === 'flashback' && b.title?.startsWith('The Harmony Council'), 'council flashback');
const iValley = at((b) => b.kind === 'scene' && b.label === 'Jade Gate Valley', 'valley scene');
const iPeonies = at((b) => b.kind === 'flashback' && b.title?.startsWith('The Peonies'), 'peonies flashback');
const card = blocks.at(-1);
if (!/^<b>/.test(card.html ?? '')) throw new Error('Harmony Council: last block is not the card');

const night = blocks[iNight].blocks.slice();
night[0] = p(
	'One night earlier. Six nobles, one brazier, and nobody stands up until they all agree.',
	'하룻밤 전. 귀족 여섯, 화로 하나. 뜻이 모두 같아질 때까지 아무도 일어서지 않는다.'
);
const peonies = [scene('The Peonies', '모란 그림'), ...blocks[iPeonies].blocks];

const yard = blocks.slice(0, iNight);
const valleyAndDoor = blocks.slice(iValley, -1).filter((_, k) => iValley + k !== iPeonies);

/* ————— images follow the text they are anchored to ————— */
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, '');
const textOf = (b) =>
	[strip(b.html), strip(b.label), ...(b.en ?? []), b.title ?? '', ...(b.blocks ?? []).map(textOf)].join(' ').toLowerCase();
const jadeText = [...yard, ...valleyAndDoor].map(textOf).join(' \n ');
const councilText = [...night, ...peonies].map(textOf).join(' \n ');
const goesToJade = (img) => {
	const a = img.at?.toLowerCase();
	return !!a && jadeText.includes(a) && !councilText.includes(a);
};

const jade = {
	year: '636',
	tone: 'winter raid (shonen)',
	subtitle: '옥문곡',
	logline: {
		en: 'Four winters into the queen’s reign, war drums send two old Hwarang west, to a valley with a polite name.',
		ko: '여왕 즉위 네 해째 겨울, 전고가 늙은 화랑 둘을 서쪽으로 내몬다. 이름만은 점잖은 골짜기로.'
	},
	badges: ['🗡️', 'flag:silla'],
	music: council.music,
	title: 'Jade Gate Valley',
	images: council.images.filter(goesToJade),
	blocks: [...yard, ...valleyAndDoor, gwanggeto.blocks.at(-1)],
	place: 'jade_gate_valley'
};

council.year = '632';
council.subtitle = '화백회의';
council.logline = {
	en: 'Six nobles. One brazier. Nobody stands up until they all agree.',
	ko: '귀족 여섯. 화로 하나. 모두 뜻이 같아질 때까지 아무도 일어서지 않는다.'
};
council.images = council.images.filter((img) => !goesToJade(img));
council.blocks = [...night, ...peonies, card];

/* ————— the cards on either side ————— */
queen.blocks[queen.blocks.length - 1] = p(
	'<b>While Chunchu searched the hills, six men around a brazier argued over a crown that wasn’t even in the room…!</b>',
	'<b>춘추가 산을 뒤지던 그 밤, 화로 앞의 사내 여섯은 방에 있지도 않은 왕관을 두고 다투고 있었다…!</b>'
);
gwanggeto.blocks[gwanggeto.blocks.length - 1] = p(
	'<b>Silla never forgets the winter a foreign army walked in through its walls. Two hundred years on, five hundred Baekje men try a valley nobody watches…!</b>',
	'<b>신라는 외국 군대가 성안까지 걸어 들어왔던 그 겨울을 잊지 않는다. 이백 년 뒤, 백제 사내 오백이 아무도 지키지 않는 골짜기로 숨어든다…!</b>'
);

samhan.entries.splice(samhan.entries.indexOf(gwanggeto) + 1, 0, jade);

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));
console.log(
	`Harmony Council (632): ${council.blocks.length} blocks, ${council.images.length} images · Jade Gate Valley (636): ${jade.blocks.length} blocks, ${jade.images.length} images · archived ${ARCHIVE}`
);
