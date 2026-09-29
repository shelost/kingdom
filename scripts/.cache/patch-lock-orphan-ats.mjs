import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Jumong');
const onjo = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'Onjo');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});
const J = '#e8563f';
const S = '#e8a04a';

function atOf(id) {
	return jumong.images.find((i) => i.id === id)?.at;
}

const smileAt = atOf('sosuno-seq-jealous-ecu');
const jealous = jumong.blocks.find(
	(b) => b.person === 'sosuno' && (b.en || []).includes('This well’s ours.')
);
if (jealous && smileAt && !jealous.en.includes(smileAt)) {
	jealous.en.splice(1, 0, smileAt);
	jealous.lines.splice(1, 0, '그애들한테 웃지 마.');
}

const water = jumong.blocks.find(
	(b) => b.person === 'jumong' && (b.en || []).includes('I came for water.')
);
if (water && !(water.en || []).some((x) => /Rope/.test(x))) {
	const rope = atOf('jumong-seq-well-ecu-rope');
	const pink = atOf('jumong-seq-well-topdown');
	water.en = ['I came for water.', rope || "Rope’s being a villain.", pink || 'Your ears are pink.', 'You keep doing that.'];
	water.lines = ['물 뜨러 왔어.', '줄이 악당이야.', '귀 분홍이네.', '맨날 그래.'];
}

function bEn(b) {
	return (b.en || []).join('\n');
}

const iWalk = jumong.blocks.findIndex((b) => b.html?.includes('He takes the bucket. He actually walks'));
if (iWalk > 0 && !JSON.stringify(jumong.blocks).includes('He leaves the bow on packed earth')) {
	jumong.blocks.splice(
		iWalk,
		0,
		p(
			'He sets the bow down like a man who might not pick it up. Packed earth. Not the shaft. <b>He leaves the bow on packed earth.</b>',
			'활을 내려놓는다. 안 집을 사람처럼. 다진 흙. 우물 안이 아니다. <b>활을 다진 흙에 둔다.</b>'
		),
		p(
			'She does not call him back. She nocks. The beam takes it. <b>She puts an arrow in the beam.</b>',
			'부르지 않는다. 시위를 당긴다. 들보가 받는다. <b>들보에 화살을 박는다.</b>'
		)
	);
}

const iLedger = jumong.blocks.findIndex((b) => b.html?.includes('The ledger stays open longer than it needs to'));
if (iLedger > 0 && !JSON.stringify(jumong.blocks).includes('You hide these like a thief')) {
	jumong.blocks.splice(
		iLedger,
		0,
		d(
			'jumong',
			J,
			['You hide these like a thief.', 'Thread. Fletch. Rope.'],
			['도둑처럼 숨기네.', '실. 깃. 줄.']
		),
		d(
			'sosuno',
			S,
			['Those are… inventory.', 'Shut up. Don’t count them out loud.'],
			['그건… 재고야.', '닥쳐. 소리 내서 세지 마.']
		)
	);
}

const iFirst = jumong.blocks.findIndex((b) => b.html?.includes('The first time is the grain room'));
if (iFirst >= 0 && !jumong.blocks[iFirst].html.includes('the back is the picture')) {
	jumong.blocks[iFirst].html += ' She turns. The pose is late. <b>the back is the picture</b>';
	jumong.blocks[iFirst].ko += ' 등을 돌린다. 자세가 늦다. <b>등이 그림이다</b>';
}

const iSummit = jumong.blocks.findIndex((b) => b.html?.includes('the first summit of the five tribes'));
if (iSummit >= 0 && !jumong.blocks[iSummit].html.includes('Five fires. Five roofs')) {
	jumong.blocks[iSummit].html = jumong.blocks[iSummit].html.replace(
		'five fires, five roofs that hate sharing a yard',
		'<b>Five fires. Five roofs</b> that hate sharing a yard'
	);
}

const crown = jumong.images.find((i) => i.id === 'jumong-seq-summit-crown');
if (crown) crown.at = 'Tabal sets a vermilion cord';

const iCord = jumong.blocks.findIndex((b) => b.html?.includes('Tabal sets a vermilion cord'));
if (iCord >= 0 && !jumong.blocks[iCord].html.includes('vermilion cord on his son-in-law')) {
	jumong.blocks[iCord].html = jumong.blocks[iCord].html.replace(
		'<b>Tabal sets a vermilion cord</b> on his son-in-law’s brow',
		'<b>Tabal sets a vermilion cord</b> on his son-in-law’s brow'
	);
}

// Queen dual-voice: lock exact at
const slutAt = jumong.images.find((i) => i.id === 'nsfw-sosuno-queen-slut')?.at;
const dual = jumong.blocks.find((b) => (b.en || []).some((x) => x.includes('Queen out there')));
if (dual && slutAt && !dual.en.includes(slutAt)) {
	dual.en[dual.en.findIndex((x) => x.includes('Queen out there'))] = slutAt;
}

const screaming = onjo.blocks.find((b) => b.html?.includes('grain lamp last night'));
if (screaming && !JSON.stringify(onjo.blocks).includes('one last screaming night')) {
	screaming.html += ' This is <b>one last screaming night</b>.';
	screaming.ko += ' <b>마지막 비명 밤</b>이다.';
}
const milf = onjo.blocks.find((b) => b.person === 'sosuno' && (b.en || []).some((x) => x.includes('Heart in my stupid eye')));
if (milf && !(milf.en || []).some((x) => x.includes('raw milf hunger'))) {
	milf.en.push('raw milf hunger— don’t you dare laugh—');
	milf.lines.push('이 허기— 웃지 마—');
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('locked smiles', smileAt, 'rope', !!water);
