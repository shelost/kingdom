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

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return '';
}

function insertAfter(entry, needle, blocks) {
	const mark = blocks.find((b) => b.html);
	if (mark?.html && entry.blocks.some((x) => x.html === mark.html)) return;
	const i = entry.blocks.findIndex((b) => blockText(b).includes(needle));
	if (i < 0) throw new Error(`${entry.title}: missing needle «${needle}»`);
	entry.blocks.splice(i + 1, 0, ...blocks);
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

const LOCK =
	'SAME locked pavilion: timber posts, giwa eaves, octagonal low table, personal mats, tea cups, wooden vote-pieces, small three-legged brazier. Correct adult proportions. Magenta inner, white dragon overcoat.';

const sunduk = findEntry('Queen Sunduk');
const harmony = findEntry('The Harmony Council');

insertAfter(sunduk, 'debate who the next king should be', [
	{
		kind: 'p',
		html: 'Night in a small pavilion off the pond. Someone lights the small brazier. <b>The flame is red first.</b>',
		ko: '연못가 작은 정자다. 누가 화로에 불을 붙인다. <b>불꽃은 먼저 붉다.</b>'
	},
	{
		kind: 'p',
		html: 'It runs hotter. <b>The flame turns blue.</b> Only then may the session start.',
		ko: '불이 더 뜨거워진다. <b>불꽃이 푸르게 바뀐다.</b> 그제야 회의가 시작된다.'
	},
	{
		kind: 'p',
		html: 'Each sleeve has a cup of tea and a wooden piece on a personal mat. They vote by setting the piece on either side of the cup.',
		ko: '소매마다 차 한 잔과 개인 자리보 위의 나무패가 있다. 잔의 좌우에 패를 놓는 것이 표다.'
	}
]);

insertAfter(sunduk, 'A hung jury in silk', [
	{
		kind: 'p',
		html: '<b>Three pieces go to the yes side of the cup. Three go to the no side.</b>',
		ko: '<b>패 셋은 잔의 찬성 쪽, 셋은 반대 쪽.</b>'
	}
]);

insertAfter(sunduk, 'I raise it. Final vote.', [
	{
		kind: 'p',
		html: 'Alchun moves his piece. <b>All six sit on the yes side.</b>',
		ko: '알천이 패를 옮긴다. <b>여섯이 모두 찬성 쪽에 앉는다.</b>'
	}
]);

insertAfter(harmony, 'Only one hand stays down', [
	{
		kind: 'p',
		html: '<b>Five pieces go to the yes side of the cup. Bidam’s piece stays on the no side.</b>',
		ko: '<b>패 다섯은 잔의 찬성 쪽. 비담의 패만 반대 쪽에 남는다.</b>'
	}
]);

const seq = [
	[
		sunduk,
		{
			id: 'council-seq-light',
			ratio: 1.778,
			tone: '#C94040',
			at: 'The flame is red first',
			alt: 'Hands light the small brazier — the flame is red first',
			refs: ['/ch_bidam.png'],
			prompt: `Intimate cinematic 16:9 close. Lighting the brazier, red flame. ${LOCK} No text. No watermark.`
		},
		'council-tea-yushin'
	],
	[
		sunduk,
		{
			id: 'council-seq-red-wide',
			ratio: 1.778,
			tone: '#C94040',
			at: 'Someone lights the small brazier',
			alt: 'Locked pavilion: six men, mats, tea, wooden pieces, red brazier',
			refs: ['/ch_bidam.png', '/ch_eulje.png', '/ch_alchun.png'],
			prompt: `Intimate cinematic 16:9 wide. Red flame. ${LOCK} No text. No watermark.`
		},
		'council-seq-light'
	],
	[
		sunduk,
		{
			id: 'council-seq-blue-birth',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'The flame turns blue',
			alt: 'Brazier close: red coals, piercing blue tongue, tea and a wooden piece at the rim',
			refs: [],
			prompt: `Intimate cinematic 16:9 close. Flame turns blue. ${LOCK} No text. No watermark.`
		},
		'council-seq-red-wide'
	],
	[
		sunduk,
		{
			id: 'council-seq-session',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'Only then may the session start',
			alt: 'Same pavilion, same seats: piercing blue flame, session begins, pieces not yet voted',
			refs: ['/ch_bidam.png', '/ch_eulje.png', '/ch_alchun.png'],
			prompt: `Intimate cinematic 16:9. Same camera as the red wide, blue flame. ${LOCK} No text. No watermark.`
		},
		'council-seq-blue-birth'
	],
	[
		sunduk,
		{
			id: 'council-seq-overhead',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'wooden piece on a personal mat',
			alt: 'Top-down: octagonal table, six mats, tea, unused wooden pieces, blue flame',
			refs: [],
			prompt: `Intimate cinematic 16:9 top-down. ${LOCK} No text. No watermark.`
		},
		'council-seq-session'
	],
	[
		sunduk,
		{
			id: 'council-seq-worm',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'either side of the cup',
			alt: 'Worm’s-eye: piercing blue shaft, same table, same cups and pieces',
			refs: ['/ch_bidam.png'],
			prompt: `Intimate cinematic 16:9 worm’s-eye. ${LOCK} No text. No watermark.`
		},
		'council-seq-overhead'
	],
	[
		sunduk,
		{
			id: 'council-seq-split',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'Three go to the no side',
			alt: 'Hung 3:3 — three wooden pieces yes of the cup, three no, same seats',
			refs: ['/ch_bidam.png', '/ch_alchun.png'],
			prompt: `Intimate cinematic 16:9. First count 3:3 pieces. ${LOCK} No text. No watermark.`
		},
		'council-seq-worm'
	],
	[
		sunduk,
		{
			id: 'council-seq-bidam',
			ratio: 0.5625,
			tone: '#141C2E',
			at: 'Not one of you has ever put a question',
			alt: 'Bidam close in piercing blue light — tea, wooden piece on the yes side',
			refs: ['/ch_bidam.png'],
			prompt: `Intimate cinematic 9:16. Bidam speaking. ${LOCK} No text. No watermark.`
		},
		'council-seq-split'
	],
	[
		sunduk,
		{
			id: 'council-seq-across',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'the hundred-and-ninth is mine',
			alt: 'Bidam and Yushin across the same table, tea and pieces, piercing blue',
			refs: ['/ch_bidam.png', '/ch_kim_yushin.png'],
			prompt: `Intimate cinematic 16:9 two-shot. ${LOCK} No text. No watermark.`
		},
		'council-seq-bidam'
	],
	[
		sunduk,
		{
			id: 'council-seq-alchun',
			ratio: 1.778,
			tone: '#8fb3e0',
			at: 'I raise it. Final vote',
			alt: 'Alchun moves his wooden piece from no to yes beside his cup',
			refs: ['/ch_alchun.png'],
			prompt: `Intimate cinematic 16:9. Alchun flips his piece. ${LOCK} No text. No watermark.`
		},
		'council-seq-across'
	],
	[
		sunduk,
		{
			id: 'council-seq-unanimous',
			ratio: 1.778,
			tone: '#3E79E4',
			at: 'All six sit on the yes side',
			alt: 'Same pavilion, same seats: every wooden piece on the yes side of the cup',
			refs: ['/ch_bidam.png', '/ch_alchun.png'],
			prompt: `Intimate cinematic 16:9. Final vote unanimous. ${LOCK} No text. No watermark.`
		},
		'council-seq-alchun'
	],
	[
		harmony,
		{
			id: 'council-seq-veto',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'Five pieces go to the yes side of the cup',
			alt: 'Same pavilion: five pieces yes, Bidam’s piece alone on the no side',
			refs: ['/ch_bidam.png', '/ch_supum.png'],
			prompt: `Intimate cinematic 16:9. 645 veto pieces. ${LOCK} No text. No watermark.`
		},
		'council-tea-veto'
	],
	[
		harmony,
		{
			id: 'council-seq-veto-close',
			ratio: 1.778,
			tone: '#141C2E',
			at: 'Bidam’s piece stays on the no side',
			alt: 'Bidam’s cup and wooden piece on the no side, piercing blue flame',
			refs: ['/ch_bidam.png'],
			prompt: `Intimate cinematic 16:9 close. Bidam’s no-side piece. ${LOCK} No text. No watermark.`
		},
		'council-seq-veto'
	]
];

for (const [entry, slot, afterId] of seq) upsertImage(entry, slot, afterId);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`patched ${seq.length} seq slots`);
