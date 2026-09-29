/**
 * Munhee–Chunchu post-wedding sex-marathon flashback + NSFW cue slots.
 * Entry: Gotaso’s Wedding (five-principles). Does not touch First Kim / cavern.
 */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const chapter = story.find((c) => c.id === 'five-principles');
if (!chapter) throw new Error('five-principles chapter missing');
const entry = chapter.entries.find((e) => e.title === 'Gotaso’s Wedding');
if (!entry) throw new Error('Gotaso’s Wedding entry missing');

const marriageIdx = entry.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('are married')
);
if (marriageIdx < 0) throw new Error('marriage paragraph missing');

entry.blocks[marriageIdx] = {
	kind: 'p',
	html: 'Chunchu &amp; Munhee are married — the burnt-skirt rumour becomes a wedding, the wedding becomes a household that is openly fond of itself, and the household fills with <b>Bupmin</b>, who walks early, and <b>Gotaso</b>, who talks early and never stops.',
	ko: '춘추와 문희는 혼인한다 — 치마를 태웠다는 소문은 혼례가 되고, 혼례는 제 자신을 아끼는 살림이 되고, 그 살림은 걸음이 빨랐던 <b>법민</b>과, 말이 빨랐고 그 뒤로 멈춘 적 없는 <b>고타소</b>로 채워진다.'
};

const flashback = {
	kind: 'flashback',
	year: '625',
	title: 'the closed months',
	blocks: [
		{
			kind: 'p',
			html: 'The wedding itself is quiet. Magenta silk and pink silk share a cup. What the court will later call a clever match is, in the room, simply two adults who have already learned each other’s breath.',
			ko: '혼례 자체는 조용하다. 자홍 비단과 분홍 비단이 잔을 나눈다. 조정이 나중에 영리한 혼사라고 부를 것은, 그 방 안에서는 서로의 숨을 이미 배운 두 어른일 뿐이다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>They shut the door</b> on the yard and do not open it again for a long time. Weeks of it — not one wedding night the minutes invent later, but a sex marathon that eats the calendar. Sheets tangle. Mouths learn. The strategist who can forecast a betrayal a generation out cannot forecast when he will next need water, and does not care.',
			ko: '마당을 향해 <b>문을 닫고</b>, 한참을 다시 열지 않는다. 몇 주 — 훗날 기록이 꾸며 낼 하룻밤이 아니라, 달력을 집어삼키는 정사(情事)의 마라톤이다. 이불이 엉킨다. 입이 배운다. 한 세대 뒤의 배신을 내다보는 책사가, 다음 물이 언제 필요할지조차 내다보지 못하고, 그것을 개의치 않는다.'
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#E07FA8',
			person: 'munhee',
			lines: ['또…?', '오늘은… 세지도 마세요.'],
			en: ['Again…?', 'Today… don’t even try to count.']
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#D8258C',
			person: 'chunchu',
			lines: ['계산이… 안 됩니다.', '문희.', '나는… 이미 졌소.'],
			en: ['I… cannot count.', 'Munhee.', 'I have… already lost.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>For weeks they do not leave the bedding</b> except to drink, to laugh, to start again. Pink silk and magenta silk become one heap on the floor. Skin finds skin until neither of them remembers which sleeve belonged to whom. Happy exhaustion. Bitten lips. The kind of wanting that keeps arriving after it should have stopped.',
			ko: '<b>몇 주 동안 침상을 떠나지 않는다</b>. 물을 마시고, 웃고, 다시 시작할 때만 잠깐. 분홍 비단과 자홍 비단은 바닥에서 한 더미가 된다. 피부가 피부를 찾아, 누구의 소매였는지조차 잊는다. 행복한 탈진. 깨문 입술. 멈춰야 할 뒤에도 계속 도착하는 갈망.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'The <b>neighbors on both walls</b> learn their names the wrong way — through plaster, through gasps, through a rhythm that does not stop when the lamp does. Servants stop knocking. Someone on the east side moves a sleeping mat farther from the shared timber and pretends it is the draft.',
			ko: '<b>양쪽 담장 너머 이웃</b>은 둘의 이름을 틀린 길로 배운다 — 회벽을 통해, 헐떡임을 통해, 등불이 꺼져도 멈추지 않는 박자를 통해. 하인들은 노크를 그만둔다. 동쪽 누군가 잠자리를 공용 들보에서 멀리 옮기고, 외풍 탓이라 둘러댄다.'
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#E07FA8',
			person: 'munhee',
			lines: ['담장 너머에서… 들었대요.', '우리 이름까지.'],
			en: ['They say… they heard us through the wall.', 'Even our names.']
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#D8258C',
			person: 'chunchu',
			lines: ['담장은… 우리 편이오.', '서라벌이 듣거든…', '듣게 두시오.'],
			en: ['Then the wall… is on our side.', 'If Surabol hears…', 'let it.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>They fit.</b> Not the polite fit of a well-arranged marriage — the rare, ridiculous fit of bodies and tempers that keep finding the same joke. She wants; he wants; neither pretends otherwise. Love is the word the household uses later. Lust is the word the bed prefers now. Both are true, and both keep them inside.',
			ko: '<b>둘이 맞는다.</b> 잘 짜인 혼사의 예의 바른 맞춤이 아니다 — 같은 농담을 자꾸 찾아내는, 드물고 우스운 몸과 기질의 맞춤이다. 그녀는 원하고, 그도 원하며, 어느 쪽도 아닌 척하지 않는다. 사랑은 훗날 집안이 쓰는 말이다. 욕망은 지금 침상이 더 좋아하는 말이다. 둘 다 참이고, 둘 다 그들을 문 안에 붙들어 둔다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>Morning finds them still tangled</b> — lattice light on flushed faces, pressed close under silk, exhausted and happy, already reaching again. He kisses the place above her pulse the way she once kissed his. She laughs into his mouth. The strategist’s cleverness has nowhere to go except toward her.',
			ko: '<b>아침이 와도 아직 엉켜 있다</b> — 살창 빛이 상기된 얼굴 위에, 비단 아래 바짝 붙어, 지치고도 행복해서, 벌써 다시 손을 뻗는다. 그가 예전에 그녀가 그의 맥 위에 입을 대듯, 그녀의 맥 위에 입을 맞춘다. 그녀는 그의 입안으로 웃는다. 책사의 총명은 그녀 쪽으로밖에 갈 곳이 없다.'
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#E07FA8',
			person: 'munhee',
			lines: ['여보.', '바깥은… 나중에.', '지금은 나만 계산하세요.'],
			en: ['Dear.', 'Outside… later.', 'For now, count only me.']
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#D8258C',
			person: 'chunchu',
			lines: ['그거야…', '내가 제일 잘하는 일이오.'],
			en: ['That…', 'is the one sum I am good at.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>Months pass before either of them remembers the yard</b>. When they finally open the door, Surabol has kept going without them, and they look at each other like people who have won a private war — still in love, still hungry, and finally willing to put clothes back on for an afternoon.',
			ko: '<b>둘 중 누구든 마당을 다시 떠올리기까지 몇 달이 걸린다</b>. 마침내 문을 열었을 때, 서라벌은 그들 없이도 돌아가 있었고, 둘은 사사로운 전쟁에서 이긴 사람처럼 서로를 본다 — 여전히 사랑하고, 여전히 배고프며, 겨우 오후 한나절 정도는 옷을 다시 입을 마음이 생긴 채로.'
		},
		{
			kind: 'p',
			html: 'When they reappear, the marriage is already a fact the city has stopped gossiping about — replaced by the quieter envy of people who heard the walls and wished their own houses were that lucky.',
			ko: '그들이 다시 모습을 드러냈을 때, 혼인은 이미 도성이 수군거리기를 그만둔 사실이 되어 있다 — 담장을 듣고, 제 집도 그처럼 복되기를 바란 사람들의 더 조용한 선망으로 바뀌어.'
		}
	]
};

entry.blocks.splice(marriageIdx + 1, 0, flashback);

const imageSlots = [
	{
		id: 'nsfw-munhee-chunchu-door-shut',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'They shut the door',
		alt: 'Adult Chunchu and Munhee pressed close as the chamber door shuts — flushed faces, silk falling, first marathon night',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Kim Chunchu and adult Kim Munhee, married couple, faces fill the frame. ONE geometric device: a dark timber door-edge as a hard vertical strip on the right; their embrace fills the rest. Faces match the attached portraits. Magenta #D8258C and soft pink #E07FA8 silk slipping from shoulders. Flushed cheeks, bitten lips, happy hunger, skin-forward. Dim Silla chamber lamp. Painterly anime-adjacent, not photoreal, not cartoon. No army. No palace clutter. No text. No watermark.',
		refs: ['/ch_chunchu.png', '/ch_munhee.png', '/bn_munhee.png'],
		people: ['chunchu', 'munhee']
	},
	{
		id: 'nsfw-munhee-chunchu-tangled-silk',
		ratio: 1.778,
		tone: '#E07FA8',
		nsfw: true,
		at: 'For weeks they do not leave the bedding',
		alt: 'Tangled sheets and silk heap — Chunchu and Munhee limbs intertwined, exhausted happy faces, weeks indoors',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult married couple tangled in bedding. ONE geometric device: a pink #E07FA8 silk ribbon snaking through crumpled sheets as the single accent. Faces fill the frame — flushed, soft smiles, out-of-breath joy. Faces match the attached portraits. Magenta #D8258C cloth in the heap. Bare shoulders, tangled limbs under silk, skin-forward embrace. Morning-after soft lamp. Painterly anime-adjacent. No genitals. No text. No watermark.',
		refs: ['/ch_munhee.png', '/ch_chunchu.png', '/bn_munhee.png'],
		people: ['munhee', 'chunchu']
	},
	{
		id: 'nsfw-munhee-chunchu-neighbors-wall',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'neighbors on both walls',
		alt: 'Comic wide: shared timber wall; tiny neighbor ear implied; magenta seam of the closed couple’s chamber',
		prompt:
			'Wide cinematic EXPOSITION still, 16:9. ICONIC / MINIMAL EPIC. REAL Silla timber house row — shared plaster wall, lattice, packed-earth alley. Tiny distant figures only. ONE geometric device: a hard magenta #D8258C light-seam leaking under a closed door on the left third. Right side: a tiny neighbor silhouette leaning toward the wall as if hearing. Natural dusk sky. Monochrome plus that one accent. No readable faces. No army. No clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental.',
		refs: ['/ch_chunchu.png', '/ch_munhee.png'],
		people: ['chunchu', 'munhee']
	},
	{
		id: 'nsfw-munhee-chunchu-they-fit',
		ratio: 0.75,
		tone: '#E07FA8',
		nsfw: true,
		at: 'They fit.',
		alt: 'Close 9:16: Munhee and Chunchu forehead to forehead, pressed together, flushed and in love',
		prompt:
			'Intimate cinematic CLOSE-UP still, 9:16. Adult Munhee and adult Chunchu forehead to forehead, pressed together, faces filling the frame. ONE geometric device: a soft pink #E07FA8 vertical wash behind them. Faces match the attached portraits. Magenta #D8258C rim-light on his cheek. Flushed, parted lips, loving hunger, bare collarbones under slipped silky hanbok. Skin-forward. Painterly anime-adjacent. No text. No watermark.',
		refs: ['/ch_munhee.png', '/ch_chunchu.png', '/bn_munhee.png'],
		people: ['munhee', 'chunchu']
	},
	{
		id: 'nsfw-munhee-chunchu-lattice-morning',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'Morning finds them still tangled',
		alt: 'Lattice morning light across tangled couple — flushed faces, silk sheets, still reaching',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult couple in bed at morning. ONE geometric device: lattice shadows as hard diagonal stripes of light across their faces and bare shoulders. Faces match the attached portraits. Soft pink #E07FA8 sheets, magenta #D8258C accent sleeve in the heap. Flushed happy exhausted faces, bitten lips, pressed close, skin-forward. Painterly anime-adjacent cinema. No text. No watermark.',
		refs: ['/ch_chunchu.png', '/ch_munhee.png', '/bn_munhee.png'],
		people: ['chunchu', 'munhee']
	},
	{
		id: 'nsfw-munhee-chunchu-months-door',
		ratio: 1.778,
		tone: '#E07FA8',
		nsfw: true,
		at: 'Months pass before either of them remembers the yard',
		alt: 'Exhausted happy close: Munhee laughing into Chunchu’s mouth after months indoors — love and lust',
		prompt:
			'Intimate cinematic CLOSE-UP still, 16:9. Adult Munhee laughing into adult Chunchu’s mouth, faces fill the frame, exhausted and happy after a long private season. ONE geometric device: a soft door-slit of yard light as a thin bright wedge on the far left. Faces match the attached portraits. Pink #E07FA8 and magenta #D8258C silk half-on. Flushed, loving, skin-forward embrace. Painterly anime-adjacent. No text. No watermark.',
		refs: ['/ch_munhee.png', '/ch_chunchu.png', '/bn_munhee.png'],
		people: ['munhee', 'chunchu']
	}
];

const existingIds = new Set((entry.images ?? []).map((im) => im.id));
entry.images = entry.images ?? [];
for (const slot of imageSlots) {
	if (existingIds.has(slot.id)) {
		const i = entry.images.findIndex((im) => im.id === slot.id);
		entry.images[i] = { ...entry.images[i], ...slot };
	} else {
		entry.images.push(slot);
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const manifest = imageSlots.map(({ id, alt, prompt }) => ({ id, alt, prompt }));
fs.mkdirSync('scripts/.cache', { recursive: true });
fs.writeFileSync(
	'scripts/.cache/munhee-chunchu-marathon-manifest.json',
	JSON.stringify(manifest, null, '\t') + '\n'
);

console.log('patched flashback +', imageSlots.length, 'slots');
console.log(imageSlots.map((s) => `${s.id} @ ${s.at}`).join('\n'));
