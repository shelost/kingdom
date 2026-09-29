import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function entries() {
	const out = [];
	for (const ch of story) for (const en of ch.entries ?? []) out.push(en);
	return out;
}

function findEntry(title) {
	const en = entries().find((e) => e.title === title);
	if (!en) throw new Error(`missing entry ${title}`);
	return en;
}

function insertAfterImage(images, afterId, slots) {
	const exist = new Set(images.map((im) => im.id));
	const fresh = slots.filter((s) => !exist.has(s.id));
	if (!fresh.length) return [];
	const i = images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing slot ${afterId}`);
	images.splice(i + 1, 0, ...fresh);
	return fresh.map((s) => s.id);
}

function insertBlocksBefore(blocks, htmlIncludes, newBlocks) {
	const already = newBlocks.every((nb) =>
		blocks.some((b) => b.kind === nb.kind && (b.html ?? b.en?.[0] ?? '') === (nb.html ?? nb.en?.[0] ?? ''))
	);
	if (already) return false;
	const i = blocks.findIndex((b) => (b.html ?? '').includes(htmlIncludes));
	if (i < 0) throw new Error(`missing block containing ${JSON.stringify(htmlIncludes)}`);
	blocks.splice(i, 0, ...newBlocks);
	return true;
}

function insertBlocksAfter(blocks, htmlIncludes, newBlocks) {
	const already = newBlocks.every((nb) =>
		blocks.some((b) => b.kind === nb.kind && (b.html ?? b.en?.[0] ?? '') === (nb.html ?? nb.en?.[0] ?? ''))
	);
	if (already) return false;
	const i = blocks.findIndex((b) => (b.html ?? '').includes(htmlIncludes));
	if (i < 0) throw new Error(`missing block containing ${JSON.stringify(htmlIncludes)}`);
	blocks.splice(i + 1, 0, ...newBlocks);
	return true;
}

const jumong = findEntry('Jumong');
const cues = [];
const added = [];

const P_GEUMWA = {
	kind: 'p',
	html: '<b>Habek</b> casts her out. King <b>Geumwa</b> of Buyeo takes her in — gold-frog king, a timber yard by a river-capital, weather still attached to the sky. The court wants a category. He sets a room instead.',
	ko: '<b>하백</b>이 딸을 내쫓는다. 부여의 <b>금와왕</b>이 그를 거둔다 — 금빛 개구리 임금, 강수도의 나무 마당, 하늘에는 아직 날씨가 붙어 있다. 조정은 분류를 원한다. 그는 방부터 내준다.'
};
const D_GEUMWA = {
	kind: 'dialogue',
	chip: '#a89a72',
	person: 'geumwa',
	lines: ['방이다. 마당은 비어 있다.'],
	en: ['A room. The yard has space.']
};
const P_YARD = {
	kind: 'p',
	html: 'The Buyeo yard keeps a mark-stake for princes. <b>Daeso</b> stands too close when Jumong’s arrow lands. He does not clap. <b>Galsa</b>’s smile shrinks on a delay — second-son arithmetic, not the heir’s shout.',
	ko: '부여 마당에는 왕자용 과녁 말뚝이 있다. 주몽의 화살이 꽂히면 <b>대소</b>는 너무 가까이 서 있다. 박수는 치지 않는다. <b>갈사</b>의 웃음은 한 박자 늦게 줄어든다 — 둘째의 셈이지, 태자의 고함이 아니다.'
};
const D_DAESO = {
	kind: 'dialogue',
	chip: '#9b8f6a',
	person: 'daeso',
	lines: ['먹여 주는 집보다 멀리 쏘지 마라.'],
	en: ['Do not outshoot the house that feeds you.']
};
const D_JUMONG = {
	kind: 'dialogue',
	chip: '#e8563f',
	person: 'jumong',
	lines: ['그럼 과녁을 더 멀리 두시오.'],
	en: ['Then put the mark farther.']
};
const D_GALSA = {
	kind: 'dialogue',
	chip: '#6b8f4a',
	person: 'galsa',
	lines: ['맞으면, 치려던 거다.'],
	en: ['If it lands, I meant to applaud.']
};
const P_GALSA_EAST = {
	kind: 'p',
	html: '<b>Galsa</b> will not stay to be the second smile in that hall. East of Buyeo he splits a smaller country and names it for himself — Galsa-Buyeo.',
	ko: '<b>갈사</b>는 그 대청의 두 번째 웃음으로 남지 않는다. 부여 동쪽에서 작은 나라를 가르고 자기 이름을 붙인다 — 갈사부여.'
};
const P_SUN_KNOCK = {
	kind: 'p',
	html: '<b>Haewonmek</b> is already in the air — flying the river’s face toward Jumong, black gat, dark silk, not a walk. Then the sun comes in as a body. A gold shaft slams the reaper mid-flight and knocks him off the line. He tumbles. Jumong is still on the near stones with the water at his back.',
	ko: '<b>해원맥</b>은 이미 공중에 있다 — 강의 얼굴을 가로질러 주몽에게 날아온다. 검은 갓, 어두운 비단, 걸음이 아니다. 그러고 해가 몸으로 들어온다. 금빛 기둥이 날던 차사를 한가운데서 때리고, 길을 꺾는다. 그는 구른다. 주몽은 아직 가까운 쪽 돌 위에 있고, 등 뒤에 물이 있다.'
};

if (insertBlocksBefore(jumong.blocks, 'In time Yuhwa lays a great egg', [P_GEUMWA, D_GEUMWA])) {
	cues.push('Geumwa takes Yuhwa in');
}
if (insertBlocksAfter(jumong.blocks, 'the smaller their smiles become', [P_YARD, D_DAESO, D_JUMONG, D_GALSA, P_GALSA_EAST])) {
	cues.push('Daeso / Galsa yard + Galsa-Buyeo');
}
if (insertBlocksAfter(jumong.blocks, 'Something flies at him from the far bank', [P_SUN_KNOCK])) {
	cues.push('Haewonmek sun-knock');
}

const courtSlots = [
	{
		id: 'geumwa-gold-yard',
		ratio: 1.778,
		tone: '#a89a72',
		at: 'gold-frog king',
		alt: 'King Geumwa on a gold-frog disc stamp in an empty Buyeo palace-yard, river-capital sky with clouds',
		prompt:
			'Minimal iconic 16:9 poster. King Geumwa, gold-frog king of Buyeo. ONE geometric device: a gold-frog disc as a LOW STAMP on wet packed-earth of a real Buyeo palace-yard; Geumwa stands on that disc in the lower third. Face matches the attached portrait: gold crown with red jewels, short beard, deep red-gold silky court hanbok. #a89a72 as the plane and the single gold-frog accent. Real river-capital: one timber hall as a simple bar behind him, a thin river at the far edge. Natural Earth sky: clouds, sun, haze. Striking silky court dress, few hues. Monumental emptiness. No army. No palace furniture dump. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy.',
		refs: ['/ch_geumwa.png'],
		people: ['geumwa']
	},
	{
		id: 'daeso-heir-stare',
		ratio: 0.75,
		tone: '#9b8f6a',
		at: 'Do not outshoot the house',
		alt: 'Daeso under a broken bow-arc, staring down at a tiny red arrow-pin in the Buyeo yard',
		prompt:
			'Minimal iconic 3:4 poster. Daeso, older Buyeo prince. ONE geometric device: a broken bow-arc as an incomplete curve cropped at the top edge; Daeso a poster-scale body in the lower third, staring down at a tiny red arrow-pin in packed earth. Face matches the attached portrait: blue headband with forehead medallion, short goatee, blue warrior silk, red sash. #9b8f6a as the dusty yard plane; one red-sash accent. Natural Earth sky with clouds in a thin strip. Striking silky court-military, few hues. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy.',
		refs: ['/ch_daeso.png'],
		people: ['daeso']
	},
	{
		id: 'jumong-daeso-bowline',
		ratio: 1.778,
		tone: '#e8563f',
		at: 'Then put the mark farther',
		alt: 'Jumong and Daeso on opposite sides of a taut bowstring-strip across an empty Buyeo yard',
		prompt:
			'Minimal iconic 16:9 poster. Jumong and Daeso, foundling versus heir. ONE geometric device: a taut HORIZONTAL bowstring as a thin low STRIP across a real dusty Buyeo yard. Jumong left in silky red #e8563f hanbok and red headband; Daeso right in blue warrior silk with red sash. Faces match the attached portraits. Hostility in the empty gap; a single mark-stake far back. Natural Earth sky: clouds, sun, haze. Striking silky period dress, few hues. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy.',
		refs: ['/ch_jumong.png', '/ch_daeso.png'],
		people: ['jumong', 'daeso']
	},
	{
		id: 'galsa-smaller-smile',
		ratio: 1.778,
		tone: '#6b8f4a',
		at: 'second-son arithmetic',
		alt: 'Galsa in a shrinking sage-green wedge at the right edge, watching a tiny red arrow-speck in the Buyeo yard',
		prompt:
			'Minimal iconic 16:9 poster. Galsa, second son of Buyeo. ONE geometric device: a shrinking sage-green #6b8f4a WEDGE at the right edge; Galsa a poster-scale body inside that wedge, green headband, sage silky hanbok, looking left at a tiny red arrow-speck in an empty dusty yard. Face matches the attached portrait. Natural Earth sky: clouds, sun, haze. Striking silky court-military, few hues. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy.',
		refs: ['/ch_galsa.png'],
		people: ['galsa']
	},
	{
		id: 'galsa-east-split',
		ratio: 1.778,
		tone: '#6b8f4a',
		at: 'Galsa-Buyeo',
		alt: 'A sage-green river-ribbon peeling east off a khaki Buyeo mainland; Galsa a tiny figure on the green ribbon only',
		prompt:
			'Minimal iconic 16:9 poster. Galsa, founder of Galsa-Buyeo. ONE geometric device: a sage-green #6b8f4a river-RIBBON peeling EAST off a khaki Buyeo mainland; Galsa a tiny silky hanbok figure on the green ribbon only. Face suggestion matches the attached portrait: green headband, sage robe. Real earth, water, thin timber. Natural Earth sky: clouds, sun, haze. Striking silky period dress, few hues. Monumental emptiness. No army. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT busy.',
		refs: ['/ch_galsa.png'],
		people: ['galsa']
	}
];

const escapeSlots = [
	{
		id: 'jumong-ye-whisper',
		ratio: 0.75,
		tone: '#d98fa8',
		at: 'whispers something to his wife',
		alt: 'Jumong whispering to Lady Ye — red headband and gold hair-ornament, faces filling the frame',
		prompt:
			'Intimate cinematic 3:4 film still, painterly anime-adjacent. Adult Jumong (red headband, red silky hanbok) whispering close to adult Lady Ye (gold dragon hair ornament, blue-red hanbok from the portrait). Faces fill the frame. ONE device: a thin breath-ribbon of cloth between mouths. Personal, night timber, one lamp. Faces match the attached portraits. #d98fa8 as a single dusty-rose accent on her sash. Few hues, silk sheen. No army. No palace clutter. No text. No watermark. NOT photoreal. NOT cartoon. Adult, not sexual.',
		refs: ['/ch_jumong.png', '/ch_lady_ye.png'],
		people: ['jumong', 'ladyye']
	},
	{
		id: 'haewonmek-sun-knock',
		ratio: 1.778,
		tone: '#6b5b6e',
		at: 'the sun comes in as a body',
		alt: 'Haewonmek flying at Jumong over a river; a gold sun-shaft slams him mid-flight and knocks him tumbling off course',
		prompt:
			'Minimal iconic 16:9 film still, dynamic. Haewonmek flying toward Jumong in front of a real river. ONE geometric device: a hard DIAGONAL — black-gat reaper in mid-air on one diagonal; a physical gold sun-SHAFT slamming into him from the opposite diagonal and knocking him off course, body tumbling, flare as a hit. River as a low foreground plane. Jumong in red #e8563f silk on the near stones, lower left, red headband, bow. Face of Jumong matches the attached portrait. Haewonmek matches the attached portrait: black gat, dark reaper robes, cobalt sash, terracotta hem, face shadowed under the brim. The sun LITERALLY hits him — not a metaphor. Natural Earth sky: clouds AND the sun entering the frame as a body of light. #6b5b6e reaper silk; gold shaft as the single accent. Simple layout, real river, monumental emptiness. No army. No chariot redesign. No palace. No text. No watermark. Graphic color-blocking, anime-painterly cinema. NOT photoreal. NOT busy.',
		refs: ['/ch_haewonmek.png', '/ch_jumong.png'],
		people: ['haewonmek', 'jumong']
	}
];

added.push(...insertAfterImage(jumong.images, 'jumong_03', courtSlots));
added.push(...insertAfterImage(jumong.images, 'jumong_04', escapeSlots));

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('cues:', cues.join(' | ') || '(already present)');
console.log('slots:', added.join(', ') || '(already present)');
