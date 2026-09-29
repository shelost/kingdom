import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';
const STATIC = 'static';

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function findChapter(title) {
	const ch = story.find((c) => c.title === title);
	if (!ch) throw new Error(`missing chapter ${title}`);
	return ch;
}

function sipsJpeg(id) {
	const src = path.join(ASSETS, `${id}.png`);
	if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
	const dest = path.join(TEMP, `${id}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', src, '--out', dest],
		{ stdio: 'ignore' }
	);
	fs.rmSync(src);
	return `/temp/${id}.jpg`;
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

function blockHas(b, needle) {
	if (typeof b.html === 'string' && b.html.includes(needle)) return true;
	if (Array.isArray(b.en) && b.en.some((x) => String(x).includes(needle))) return true;
	if (Array.isArray(b.lines) && b.lines.some((x) => String(x).includes(needle))) return true;
	return false;
}

function insertAfterHtml(entry, needle, blocks) {
	if (blocks.some((b) => b.html && entry.blocks.some((x) => x.html === b.html))) return;
	const i = entry.blocks.findIndex((b) => blockHas(b, needle));
	if (i < 0) throw new Error(`missing needle: ${needle}`);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

// Portraits stay as PNG in static/
for (const id of ['ch_hwahye', 'ch_wihye']) {
	const src = path.join(ASSETS, `${id}.png`);
	if (fs.existsSync(src)) {
		fs.copyFileSync(src, path.join(STATIC, `${id}.png`));
	}
}

const sunduk = findEntry('Queen Sunduk');
const daeya = findEntry('Daeya Fortress');
const jumong = findEntry('Jumong');
const gaya = findEntry('Gaya, the Lost Nations');
const descent = findEntry('Euija’s Descent');
const chunchuEra = findChapter('The Chunchu Era');

upsertImage(
	sunduk,
	{
		id: 'sunduk-yushin-back-blush',
		ratio: 1.778,
		tone: '#E8552B',
		at: 'She sees the width of his back',
		alt: 'Yushin’s muscular back as a Confucian-blue plane; Queen Sunduk blushing in a vermilion edge-gaze',
		refs: ['/ch_kim_yushin.png', '/ch_sunduk.png'],
		tempImage: sipsJpeg('sunduk-yushin-back-blush'),
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Marshal Yushin and Queen Sunduk. ONE geometric device: his muscular back as a vertical Confucian-blue #2A5FB8 plane; her flushed face as a vermilion #E8552B edge-gaze. Faces match the attached portraits. No text. No watermark.'
	},
	'sunduk-flirt-blush'
);

insertAfterHtml(sunduk, 'He looks only at the Queen', [
	{
		kind: 'p',
		html: 'Then the yard-coat is open down the spine, and <b>She sees the width of his back</b> — muscle the court is not supposed to want — and the Queen’s face goes vermilion before she can pretend it is the lamp.',
		ko: '그러다 연무장 도포가 등줄기를 따라 열리고, <b>그녀는 그 등의 너비를 본다</b> — 조정이 원해서는 안 되는 근육 — 여왕의 얼굴이, 등불 탓으로 돌리기도 전에 주홍으로 오른다.'
	}
]);

upsertImage(
	daeya,
	{
		id: 'nsfw-gumil-yehwa-night',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The night before the True Bone arrives',
		alt: 'Night lamp: Gumil and Yehwa close in a poor Daeya room — teal silk open at the shoulder',
		refs: ['/ch_gumil.png', '/ch_gumil_wife.png'],
		tempImage: sipsJpeg('nsfw-gumil-yehwa-night'),
		prompt:
			'Intimate cinematic NIGHT still, 16:9. Adult Gumil and adult Yehwa. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-pumsuk-yehwa-backpress'
);

upsertImage(
	daeya,
	{
		id: 'gumil-yehwa-confront',
		ratio: 1.778,
		tone: '#6b7f9e',
		at: 'They stand in the door-slit of dawn',
		alt: 'Solemn dawn: Gumil and Yehwa do not touch — a hard door-slit between them after the cheat',
		refs: ['/ch_gumil.png', '/ch_gumil_wife.png'],
		tempImage: sipsJpeg('gumil-yehwa-confront'),
		prompt:
			'Intimate cinematic still, 16:9. Solemn, not erotic. Adult Gumil and adult Yehwa after she cheated. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-gumil-yehwa-night'
);

upsertImage(
	daeya,
	{
		id: 'nsfw-pumsuk-yehwa-night2',
		ratio: 1.778,
		tone: '#7EB8F0',
		nsfw: true,
		at: 'His mouth is at her throat after the feast',
		alt: 'After the feast: Pumsuk’s mouth at Yehwa’s throat, ice-blue and teal silk open',
		refs: ['/ch_pumsuk.png', '/ch_gumil_wife.png'],
		tempImage: sipsJpeg('nsfw-pumsuk-yehwa-night2'),
		prompt:
			'Intimate cinematic NIGHT still, 16:9. Adult Pumsuk and adult Yehwa. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-pumsuk-yehwa-backpress'
);

upsertImage(
	daeya,
	{
		id: 'yunchung-daeya-assault',
		ratio: 1.778,
		tone: '#c9932a',
		at: 'Yunchung’s fire through the gate',
		alt: 'Night assault: a fire-wedge through Daeya’s gate, tiny figures, moon-haze',
		tempImage: sipsJpeg('yunchung-daeya-assault'),
		prompt:
			'Minimal iconic 16:9 poster. Night assault on Daeya Fortress. Fire-wedge through the gate. Tiny figures. No text. No watermark.'
	},
	'daeya_granary_gate'
);

upsertImage(
	daeya,
	{
		id: 'gumil-granary-burn',
		ratio: 1.778,
		tone: '#c9932a',
		at: 'Gumil puts the torch to the stores',
		alt: 'Gumil as a tiny yellow-sleeve figure torching the Daeya granary — a vertical fire-plane',
		refs: ['/ch_gumil.png'],
		tempImage: sipsJpeg('gumil-granary-burn'),
		prompt:
			'Minimal iconic 16:9 poster. Gumil burns the Daeya granary. Face suggestion of the attached portrait. No text. No watermark.'
	},
	'yunchung-daeya-assault'
);

upsertImage(
	daeya,
	{
		id: 'mochuk-open-gates',
		ratio: 1.778,
		tone: '#7d8a99',
		at: 'Mochuk lifts the bar',
		alt: 'Mochuk opens Daeya’s gates — one leaf swinging, a black void beyond',
		tempImage: sipsJpeg('mochuk-open-gates'),
		prompt: 'Minimal iconic 16:9 poster. Mochuk opens Daeya’s gates at night. No text. No watermark.'
	},
	'gumil-granary-burn'
);

insertAfterHtml(daeya, 'Which is why everyone looks', [
	{
		kind: 'p',
		html: '<b>The night before the True Bone arrives</b>, the room is only a lamp and the two of them. Yehwa’s teal silk opens at the shoulder. Gumil’s yellow sleeve comes off as if the month’s pay had never been the argument. They still know how to find each other. They will not know how tomorrow.',
		ko: '<b>진골이 도착하기 전날 밤</b>, 방에는 등 하나와 두 사람뿐이다. 예화의 청록 비단이 어깨에서 열린다. 검일의 노란 소매가, 월봉이 한 번도 다툼이 아니었던 것처럼 벗어진다. 아직 서로를 찾는 법을 안다. 내일은 모를 것이다.'
	},
	{
		kind: 'dialogue',
		chip: '#c98fb0',
		lines: ['내일 그 아이가 오면.', '오늘은… 오늘만은.', '제 허리에 손을 두세요.', '진골 손이 아니어도 됩니다.'],
		en: [
			'Tomorrow the boy arrives.',
			'Today… only today.',
			'Keep your hand on my waist.',
			'It does not have to be a True Bone hand.'
		],
		person: 'gumilwife'
	},
	{
		kind: 'dialogue',
		chip: '#6b7f9e',
		lines: ['알아.', '알고 있어.', '…내일 얘기는 내일 하자.'],
		en: ['I know.', 'I know.', '…Leave tomorrow for tomorrow.'],
		person: 'gumil'
	}
]);

insertAfterHtml(daeya, 'Her back finds his chest', [
	{
		kind: 'p',
		html: '<b>His mouth is at her throat after the feast</b>. Ice-blue silk open. Teal silk pulled from the shoulder. The manners he was trained in do not survive the second cup.',
		ko: '<b>잔치가 끝난 뒤 그의 입이 목덜미에 있다</b>. 얼음빛 비단이 열린다. 청록 비단이 어깨에서 당겨진다. 배운 예의는 두 잔째를 넘기지 못한다.'
	}
]);

insertAfterHtml(daeya, 'You are <b>trash</b> as well.', [
	{
		kind: 'p',
		html: '<b>They stand in the door-slit of dawn</b> and do not touch. The heat from the feast is gone. What is left is the count of what she said, and the count of what he heard, and a marriage that has already finished speaking.',
		ko: '<b>그들은 새벽 문틈에 서서</b> 서로 닿지 않는다. 잔치의 열기는 없다. 남은 것은 그녀가 한 말의 셈과, 그가 들은 말의 셈과, 이미 말하기를 끝낸 혼인이다.'
	}
]);

const lastThing = daeya.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('That is the last thing they ever say')
);
if (lastThing >= 0 && !daeya.blocks.some((b) => b.html?.includes('Yunchung’s fire through the gate'))) {
	daeya.blocks.splice(
		lastThing + 1,
		0,
		{
			kind: 'p',
			html: 'Three weeks later <b>Yunchung’s fire through the gate</b> is the first thing the inner court sees — ten thousand men, and the wall still theoretically Silla’s.',
			ko: '삼 주 뒤, 내성이 먼저 보는 것은 <b>문을 가르는 윤충의 불</b>이다 — 군사 만 명. 성벽은 이론상 아직 신라의 것이다.'
		},
		{
			kind: 'p',
			html: '<b>Mochuk lifts the bar</b>. The leaf swings. The approach road fills. He does not look at the men coming in. He looks at the man who asked him to.',
			ko: '<b>모척이 빗장을 든다</b>. 문이 열린다. 진입로가 찬다. 들어오는 사람들을 보지 않는다. 열어 달라 한 사람을 본다.'
		},
		{
			kind: 'p',
			html: 'Then <b>Gumil puts the torch to the stores</b> he counted, and opens the granary gate to Yunchung, and it is not for Baekje and it is not for money.',
			ko: '그리고 <b>검일은 제가 세던 군량에 횃불을 대고</b>, 윤충에게 곳간 문을 연다. 백제를 위해서가 아니고, 돈을 위해서도 아니다.'
		}
	);
}

upsertImage(
	jumong,
	{
		id: 'yuhwa-sisters-bath',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'Hwahye and Wihye leave their silk on the rocks',
		alt: 'Three river-daughters in the Amnok shallows — Hwahye, Wihye, and Yuhwa looking up',
		refs: ['/ch_yuhwa.png', '/ch_hwahye.png', '/ch_wihye.png'],
		people: ['yuhwa', 'hwahye', 'wihye'],
		tempImage: sipsJpeg('yuhwa-sisters-bath'),
		prompt:
			'Intimate cinematic 16:9 film still. Three adult river-daughters in the Amnok. Faces match the attached portraits. Silk still on. No genitals. No text. No watermark.'
	},
	'yuhwa-bath-tease'
);

upsertImage(
	jumong,
	{
		id: 'yuhwa-bath-tease-more',
		ratio: 1.778,
		tone: '#8fc4e0',
		nsfw: true,
		at: 'She draws the wet silk higher',
		alt: 'Yuhwa looking back over her shoulder in the Amnok, wet pale-blue silk hiked at the hip',
		refs: ['/ch_yuhwa.png'],
		people: ['yuhwa'],
		tempImage: sipsJpeg('yuhwa-bath-tease-more'),
		prompt:
			'Intimate cinematic 16:9 film still. Adult Lady Yuhwa in the Amnok. Face matches the attached portrait. Silk still on. No genitals. No text. No watermark.'
	},
	'yuhwa-sisters-bath'
);

const threeDaughters = jumong.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('Three daughters of <b>Habek</b>')
);
if (threeDaughters >= 0 && !jumong.blocks.some((b) => b.html?.includes('Hwahye and Wihye leave their silk'))) {
	jumong.blocks[threeDaughters].html =
		'A hot afternoon. Three daughters of <b>Habek</b> leave their clothes on the rocks. <b>Hwahye and Wihye leave their silk on the rocks</b> first — eldest, then second — and step into the Ubal laughing. Yuhwa steps into the shallows last — water at her thighs, wet hair down her back, nothing between her and the watching sun.';
	jumong.blocks[threeDaughters].ko =
		'더운 오후. 하백의 세 딸이 바위에 옷을 벗어 둔다. <b>화혜와 위혜가 먼저 바위에 비단을 둔다</b> — 맏이, 그다음 둘째 — 웃으며 우발수로 들어간다. 유화는 맨 마지막에 여울로 들어간다 — 허벅지까지 오는 물, 등으로 젖은 머리, 내려다보는 하늘과 사이에 아무것도 없이.';
}

insertAfterHtml(jumong, 'Shall I pretend to blush', [
	{
		kind: 'dialogue',
		chip: '#a8d4e8',
		lines: ['올려다보지 마.', '하늘은 일정이 있어.', '우리는 잠수한다.'],
		en: ['Do not look up.', 'Heaven has a schedule.', 'We are diving.'],
		person: 'hwahye'
	},
	{
		kind: 'dialogue',
		chip: '#7eb8c8',
		lines: ['올려다보면 늦는 거야.', '막내는 남겠지.', '늘 남잖아.'],
		en: ['If you look up, you are already late.', 'The youngest will stay.', 'She always stays.'],
		person: 'wihye'
	}
]);

insertAfterHtml(jumong, 'The older sisters dive', [
	{
		kind: 'p',
		html: '<b>She draws the wet silk higher</b> — one hip, then the other — and lets the sun finish looking. Hwahye is already under. Wihye’s laugh breaks the surface and is gone.',
		ko: '<b>그녀는 젖은 비단을 더 끌어올린다</b> — 한쪽 엉덩이, 그리고 다른 쪽 — 해가 보기를 끝내게 둔다. 화혜는 이미 물 아래다. 위혜의 웃음이 수면을 깨고 사라진다.'
	}
]);

upsertImage(
	gaya,
	{
		id: 'nsfw-suro-heo-hip',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'the curve of her hip catching lamp',
		alt: 'Heo looking back, violet silk off the shoulders; Suro close behind in the lamp-lit tent',
		refs: ['/ch_heo.png', '/ch_suro.png'],
		tempImage: sipsJpeg('nsfw-suro-heo-hip'),
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult King Suro and adult Queen Heo. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'suro-heo-tent'
);

upsertImage(
	gaya,
	{
		id: 'nsfw-suro-heo-mouth',
		ratio: 1.778,
		tone: '#7f1d1d',
		nsfw: true,
		at: 'kissing the throat he will marry',
		alt: 'Suro kissing Heo’s throat in the lamp-lit tent — gold crown, tiger hairpins, violet silk',
		refs: ['/ch_suro.png', '/ch_heo.png'],
		tempImage: sipsJpeg('nsfw-suro-heo-mouth'),
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult King Suro kissing adult Queen Heo’s throat. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-suro-heo-hip'
);

insertAfterHtml(gaya, 'Two nights in a tent', [
	{
		kind: 'p',
		html: 'She turns so he can see <b>the curve of her hip catching lamp</b>, and he is <b>kissing the throat he will marry</b> before he has permission to call it a country.',
		ko: '그녀는 돌아서, <b>등이 잡은 엉덩이 곡선</b>을 보이게 하고, 그는 그것을 나라라고 부를 허락이 생기기도 전에 <b>혼인할 목덜미에 입을 맞춘다</b>.'
	}
]);

upsertImage(
	descent,
	{
		id: 'nsfw-euija-night-less',
		ratio: 1.778,
		tone: '#0f172a',
		nsfw: true,
		at: 'She looks back, hip out',
		alt: 'Night Sabi: a twenty-year-old maid looks back, hip out, Euija close, robe open, no headband',
		refs: ['/ch_buyeo_euija.png', '/ch_maid_3.png'],
		tempImage: sipsJpeg('nsfw-euija-night-less'),
		prompt:
			'Cinematic live-action NIGHT movie still. Twenty-year-old adult Korean maid. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-euija-night-close'
);

upsertImage(
	descent,
	{
		id: 'nsfw-euija-night-hip',
		ratio: 1.778,
		tone: '#0f172a',
		nsfw: true,
		at: 'His hand finds the silk at her waist',
		alt: 'Night close: the curve of a maid’s hip under hiked mint silk, Euija’s hand at the waist',
		refs: ['/ch_buyeo_euija.png', '/ch_maid_2.png'],
		tempImage: sipsJpeg('nsfw-euija-night-hip'),
		prompt:
			'Intimate cinematic NIGHT still. Twenty-year-old adult Korean maid. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-euija-night-less'
);

upsertImage(
	descent,
	{
		id: 'nsfw-euija-night-curve',
		ratio: 1.778,
		tone: '#0f172a',
		nsfw: true,
		at: 'The S-curve of a twenty-year-old hip',
		alt: 'Night lamp-shaft: Euija undone, a twenty-year-old maid’s hiked mint silk, hip out',
		refs: ['/ch_buyeo_euija.png', '/ch_maid_1.png'],
		tempImage: sipsJpeg('nsfw-euija-night-curve'),
		prompt:
			'Cinematic live-action NIGHT movie still. Twenty-year-old adult Korean palace woman. Silk still on. No genitals. Faces match the attached portraits. No text. No watermark.'
	},
	'nsfw-euija-night-hip'
);

insertAfterHtml(descent, 'Rain on the night veranda', [
	{
		kind: 'p',
		html: 'The maids are twenty. Not girls. <b>She looks back, hip out</b>. <b>His hand finds the silk at her waist</b>. <b>The S-curve of a twenty-year-old hip</b> is the whole argument of the hall. Less clothes. More lamp. The robe hangs open. The jeogori does not stay on the shoulder.',
		ko: '궁녀들은 스물이다. 아이가 아니다. <b>그녀는 돌아보며 엉덩이를 내민다</b>. <b>그의 손이 허리의 비단을 찾는다</b>. <b>스무 살 엉덩이의 S자</b>가 전각의 전부다. 옷은 더 적다. 등은 더 많다. 도포가 열린다. 저고리는 어깨에 남아 있지 않는다.'
	}
]);

const harbour = {
	year: '644',
	title: 'Harbour Ledgers',
	tone: 'harbour romance (K-drama)',
	subtitle: '항구의 장부',
	badges: ['flag:silla', '🌙'],
	images: [
		{
			id: 'bupmin-jahee-rain',
			ratio: 1.778,
			tone: '#e8a0bf',
			at: 'a hard rain-curtain',
			alt: 'Bupmin and Jahee under a rain-eave at the quay — almost a kiss, a wet ledger in her hand',
			refs: ['/ch_kim_bupmin.png', '/ch_jayi.png'],
			tempImage: sipsJpeg('bupmin-jahee-rain'),
			prompt:
				'Intimate cinematic still, 16:9. Harbour romance. Young adult Bupmin and adult Jahee. Faces match the attached portraits. No text. No watermark.'
		},
		{
			id: 'bupmin-jahee-ledger',
			ratio: 1.778,
			tone: '#e8a0bf',
			at: 'She corrects the sum',
			alt: 'Warehouse lamp: Jahee corrects a tide ledger; Bupmin watches her mouth instead of the numbers',
			refs: ['/ch_kim_bupmin.png', '/ch_jayi.png'],
			tempImage: sipsJpeg('bupmin-jahee-ledger'),
			prompt:
				'Intimate cinematic still, 16:9. Warehouse lamp. Adult Jahee and young adult Bupmin. Faces match the attached portraits. No text. No watermark.'
		},
		{
			id: 'bupmin-jahee-almost',
			ratio: 1.778,
			tone: '#C41E3A',
			at: 'a stolen brush between their mouths',
			alt: 'Almost-kiss: a stolen brush as a thin diagonal between Bupmin and Jahee',
			refs: ['/ch_kim_bupmin.png', '/ch_jayi.png'],
			tempImage: sipsJpeg('bupmin-jahee-almost'),
			prompt:
				'Intimate cinematic CLOSE-UP still, 16:9. Young adult Bupmin and adult Jahee. Faces match the attached portraits. No text. No watermark.'
		}
	],
	blocks: [
		{
			kind: 'p',
			html: 'Yushin posts <b>Bupmin</b> as junior Pajinchan under Kim Seonpum — a countryside season with a tide book instead of a yard. The quay does not care that he is a prince. The quay cares whether the sums close.',
			ko: '유신은 <b>법민</b>을 김선품 아래 파진찬 견습으로 보낸다 — 연무장 대신 조수 장부가 있는 지방 한 철. 항구는 그가 왕자인 것을 상관하지 않는다. 항구는 셈이 맞는지 상관한다.'
		},
		{
			kind: 'p',
			html: 'Her name is <b>Jahee</b> — 자희. The court will later call her Queen Jayi. Tonight she is the daughter who keeps Seonpum’s inkstones, and she has already decided his arithmetic is sloppy.',
			ko: '그녀의 이름은 <b>자희</b>다. 조정은 나중에 그를 자의왕후라 부를 것이다. 오늘 밤 그는 선품의 벼루를 지키는 딸이고, 이미 그의 셈이 헐겁다고 정해 두었다.'
		},
		{
			kind: 'dialogue',
			chip: '#e8a0bf',
			lines: ['셈이 틀렸어요.', '조수는 왕자인 걸 상관하지 않아요.', '다시 세요.', '제가 보는 앞에서요.'],
			en: [
				'Your sums are wrong.',
				'The tide does not care that you are a prince.',
				'Count again.',
				'While I am watching.'
			],
			person: 'jayi'
		},
		{
			kind: 'dialogue',
			chip: '#C41E3A',
			lines: ['…어디가.', '아닙니다. / 어디가 틀렸는지 가르쳐 주십시오.', '아니 — / 가르쳐 주세요.'],
			en: ['…Where.', 'No. / Show me where I am wrong.', 'No — / Please show me.'],
			person: 'munmu'
		},
		{
			kind: 'p',
			html: '<b>She corrects the sum</b> with a brush he was not supposed to steal. Warehouse lamp. Salt on the page. He watches her mouth instead of the numbers, and she lets him, once, because the tide will not wait for dignity.',
			ko: '그가 훔치면 안 되는 붓으로 <b>그는 셈을 고친다</b>. 창고 등. 페이지 위의 소금. 그는 숫자 대신 입을 보고, 그는 한 번 허락한다. 조수는 체면을 기다려 주지 않으니까.'
		},
		{
			kind: 'p',
			html: 'Rain finds the eave. They stand inside <b>a hard rain-curtain</b> with a wet ledger between them, and almost do the stupid thing, and do not — until there is <b>a stolen brush between their mouths</b>, and then they do.',
			ko: '비가 처마를 찾는다. 그들은 젖은 장부를 사이에 두고 <b>단단한 빗줄기 커튼</b> 안에 서서, 바보 같은 일을 거의 하고, 하지 않는다 — <b>훔친 붓이 입 사이에 놓일 때</b>까지. 그리고 그때는 한다.'
		},
		{
			kind: 'dialogue',
			chip: '#e8a0bf',
			lines: ['아버님이 기침하세요.', '창고 그늘에서요.', '…그래서 지금이 아니면 안 돼요.', '조수가 들어오기 전에.'],
			en: [
				'Father is coughing.',
				'From the warehouse shadow.',
				'…Which is why it has to be now.',
				'Before the tide comes in.'
			],
			person: 'jayi'
		},
		{
			kind: 'dialogue',
			chip: '#C41E3A',
			lines: ['장부를 닫지 마세요.', '닫으면 제가…', '어디로 가야 할지 모릅니다.'],
			en: ['Do not close the book.', 'If you close it I…', 'will not know where to go.'],
			person: 'munmu'
		},
		{
			kind: 'p',
			html: 'Seonpum coughs once from the dark and pretends he did not see a prince learning the harbour by kissing the girl who can count. Years later the court will name her Jayi. The quay already had the true name.',
			ko: '선품이 어둠에서 한 번 기침하고, 셈할 줄 아는 소녀에게 입 맞추며 항구를 배우는 왕자를 보지 못한 척한다. 여러 해 뒤 조정은 그를 자의라 부를 것이다. 항구는 이미 진짜 이름을 가지고 있었다.'
		},
		{
			kind: 'moral',
			label: 'the harbour name',
			html: 'A queen-name is what the court files. The girl who corrects the tide is who you marry.',
			ko: '왕후 이름은 조정이 철하는 것이다. 조수를 고치는 소녀가, 혼인하는 사람이다.'
		}
	]
};

if (!chunchuEra.entries.some((e) => e.title === 'Harbour Ledgers')) {
	const i = chunchuEra.entries.findIndex((e) => e.title === 'The Flower Youth');
	if (i < 0) throw new Error('missing The Flower Youth');
	chunchuEra.entries.splice(i + 1, 0, harbour);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log('patched romance / invasion / harbour / sisters');
