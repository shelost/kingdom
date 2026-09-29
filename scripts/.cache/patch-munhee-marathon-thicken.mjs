/**
 * Thicken + reorder Munhee–Chunchu sex-marathon flashback so it is unmistakable
 * in the Gotaso’s Wedding script. Add window-shadow neighbor-POV anchors.
 * Does not touch First Kim / cavern entries.
 */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const chapter = story.find((c) => c.id === 'five-principles');
if (!chapter) throw new Error('five-principles missing');
const entry = chapter.entries.find((e) => e.title === 'Gotaso’s Wedding');
if (!entry) throw new Error('Gotaso’s Wedding missing');

const howIdx = entry.blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'how they met');
const birthIdx = entry.blocks.findIndex((b) => b.kind === 'flashback' && b.title === "Bupmin's birth");
const marriageIdx = entry.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('are married')
);
const closedIdx = entry.blocks.findIndex(
	(b) => b.kind === 'flashback' && b.title === 'the closed months'
);
if ([howIdx, birthIdx, marriageIdx, closedIdx].some((i) => i < 0)) {
	throw new Error(`index miss how=${howIdx} birth=${birthIdx} marriage=${marriageIdx} closed=${closedIdx}`);
}

const closedMonths = {
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
			html: '<b>They shut the door</b> on the yard and do not open it again for a long time. What follows is not one wedding night the minutes invent later. It is a sex marathon — weeks of it — that eats the calendar, the meals, and any plan either of them had for being useful to Surabol.',
			ko: '마당을 향해 <b>문을 닫고</b>, 한참을 다시 열지 않는다. 뒤따르는 것은 훗날 기록이 꾸며 낼 하룻밤이 아니다. 정사(情事)의 마라톤이다 — 몇 주 — 달력과 끼니와, 서라벌에 쓸모 있으려던 계획까지 집어삼킨다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'They take each other the way thirst takes a man who has been polite too long. On the bedding. Against the chest. On the floor when the bedding is too far. She pulls him back by the wrist when he reaches for water. He laughs into her throat and stays. Magenta silk and pink silk last half a night before they become one heap by the door.',
			ko: '너무 오래 예의를 지킨 사람이 갈증에 지듯, 서로를 취한다. 침상에서. 궤 옆에서. 침상이 멀면 바닥에서. 그가 물에 손을 뻗으면 그녀가 손목을 잡아 끌어당긴다. 그는 그녀의 목에서 웃고 그대로 남는다. 자홍 비단과 분홍 비단은 반나절도 못 가 문가의 한 더미가 된다.'
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#E07FA8',
			person: 'munhee',
			lines: ['또…?', '오늘은… 세지도 마세요.', '셈은 바깥에서 하세요.'],
			en: ['Again…?', 'Today… don’t even try to count.', 'Save counting for outside.']
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#D8258C',
			person: 'chunchu',
			lines: ['계산이… 안 됩니다.', '문희.', '나는… 이미 졌소.', '그리고… 또 지겠소.'],
			en: ['I… cannot count.', 'Munhee.', 'I have… already lost.', 'And… I will lose again.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>For weeks they do not leave the bedding</b> except to drink, to laugh, to start again. Skin finds skin until neither remembers which sleeve belonged to whom. Happy exhaustion. Bitten lips. The strategist who can forecast a betrayal a generation out cannot forecast when he will next need sleep, and does not care.',
			ko: '<b>몇 주 동안 침상을 떠나지 않는다</b>. 물을 마시고, 웃고, 다시 시작할 때만 잠깐. 피부가 피부를 찾아, 누구의 소매였는지조차 잊는다. 행복한 탈진. 깨문 입술. 한 세대 뒤의 배신을 내다보는 책사가, 다음 잠이 언제 필요할지조차 내다보지 못하고, 그것을 개의치 않는다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'The <b>neighbors on both walls</b> learn their names the wrong way — through plaster, through gasps, through a rhythm that does not stop when the lamp does. Servants stop knocking. Someone on the east side moves a sleeping mat farther from the shared timber and pretends it is the draft.',
			ko: '<b>양쪽 담장 너머 이웃</b>은 둘의 이름을 틀린 길로 배운다 — 회벽을 통해, 헐떡임을 통해, 등불이 꺼져도 멈추지 않는 박자를 통해. 하인들은 노크를 그만둔다. 동쪽 누군가 잠자리를 공용 들보에서 멀리 옮기고, 외풍 탓이라 둘러댄다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'At night the courtyard looks up and learns worse. <b>The paper window glows</b> — warm lamp inside, blue-black street outside — and on the 창호지 the shadows are unmistakable: one figure straddling the other; two bodies pressed to the lattice; upright, tangled, a lift that makes a silhouette into a confession. No faces needed. The pose is the gossip.',
			ko: '밤이면 마당이 위를 보고 더 심한 것을 배운다. <b>창호지에 불이 비친다</b> — 안은 따뜻한 등잔, 밖은 청흑의 골목 — 그 창호지 위 그림자는 틀림없다. 한쪽이 다른 쪽을 타고 앉은 꼴. 살창에 밀착된 두 몸. 세로로 엉킨 채, 그림자를 자백으로 만드는 들어올림. 얼굴은 필요 없다. 자세가 소문이다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'A neighbor freezes mid-step under the eaves and stares. <b>Shadow on the lattice</b> — straddling, then pressed flat, then one lifting the other as if the room had forgotten gravity. He looks away too late. By the third night half the lane has an opinion, and none of it is about politics.',
			ko: '처마 아래 이웃이 걸음을 멈추고 바라본다. <b>살창 위의 그림자</b> — 올라타고, 납작이 밀리고, 방이 중력을 잊은 듯 한쪽이 다른 쪽을 들어올린다. 눈을 돌리기엔 늦다. 사흘째가 되면 골목 절반이 의견을 갖고, 그중 정치 이야기는 하나도 없다.'
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#E07FA8',
			person: 'munhee',
			lines: ['담장 너머에서… 들었대요.', '창호지까지… 봤대요.', '우리 이름까지.'],
			en: ['They say… they heard us through the wall.', 'And saw… the paper window.', 'Even our names.']
		},
		{
			kind: 'dialogue',
			nsfw: true,
			chip: '#D8258C',
			person: 'chunchu',
			lines: ['담장은… 우리 편이오.', '창호지도.', '서라벌이 듣거든…', '듣게 두시오.'],
			en: ['Then the wall… is on our side.', 'And the paper window.', 'If Surabol hears…', 'let it.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: '<b>They fit.</b> Not the polite fit of a well-arranged marriage — the rare, ridiculous fit of bodies and tempers that keep finding the same joke. She wants; he wants; neither pretends otherwise. Love is the word the household uses later. Lust is the word the bed prefers now. Both are true, and both keep them inside for a season the city will remember as a rumour with a rhythm.',
			ko: '<b>둘이 맞는다.</b> 잘 짜인 혼사의 예의 바른 맞춤이 아니다 — 같은 농담을 자꾸 찾아내는, 드물고 우스운 몸과 기질의 맞춤이다. 그녀는 원하고, 그도 원하며, 어느 쪽도 아닌 척하지 않는다. 사랑은 훗날 집안이 쓰는 말이다. 욕망은 지금 침상이 더 좋아하는 말이다. 둘 다 참이고, 둘 다 그들을 철 하나 문 안에 붙들어 둔다. 도성은 그것을 박자 있는 소문으로 기억한다.'
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
			html: 'When they reappear, the marriage is already a fact the city has stopped gossiping about — replaced by the quieter envy of people who heard the walls, saw the glowing lattice, and wished their own houses were that lucky.',
			ko: '그들이 다시 모습을 드러냈을 때, 혼인은 이미 도성이 수군거리기를 그만둔 사실이 되어 있다 — 담장을 듣고, 빛나는 살창을 보고, 제 집도 그처럼 복되기를 바란 사람들의 더 조용한 선망으로 바뀌어.'
		}
	]
};

entry.blocks[marriageIdx] = {
	kind: 'p',
	html: 'Chunchu &amp; Munhee are married — the burnt-skirt rumour becomes a wedding, and the wedding becomes a household that is openly fond of itself.',
	ko: '춘추와 문희는 혼인한다 — 치마를 태웠다는 소문은 혼례가 되고, 혼례는 제 자신을 아끼는 살림이 된다.'
};

// Pull out the four pieces and rebuild order:
// how they met → married → closed months → Bupmin birth → (kids bridge) → hill...
const birth = entry.blocks[birthIdx];
const marriage = entry.blocks[marriageIdx];

// Remove closed, marriage, birth from current positions (highest index first)
const remove = [closedIdx, marriageIdx, birthIdx].sort((a, b) => b - a);
for (const i of remove) entry.blocks.splice(i, 1);

// Re-find how they met after removals
const howNow = entry.blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'how they met');
if (howNow < 0) throw new Error('how they met lost');

const kidsBridge = {
	kind: 'p',
	html: 'The household fills with <b>Bupmin</b>, who walks early, and <b>Gotaso</b>, who talks early and never stops.',
	ko: '그 살림은 걸음이 빨랐던 <b>법민</b>과, 말이 빨랐고 그 뒤로 멈춘 적 없는 <b>고타소</b>로 채워진다.'
};

entry.blocks.splice(howNow + 1, 0, marriage, closedMonths, birth, kidsBridge);

const windowSlots = [
	{
		id: 'nsfw-munhee-chunchu-window-straddle',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'The paper window glows',
		alt: 'Night courtyard: warm magenta lamp through 창호지; two silhouettes straddling in clear sex pose',
		prompt:
			'Wide cinematic night still, 16:9. ICONIC / MINIMAL EPIC from a dark Silla courtyard looking up at a glowing paper window lattice (창호지). Warm lamp light inside, blue-black exterior. ONE geometric device: the lit rectangular screen. On the paper: clear dark shadow silhouettes of two adult figures in a straddling embrace — readable sex pose body language, no faces, no detail skin. Optional single magenta #D8258C accent in the lamp glow. No text. No watermark. Graphic color-blocking, anime-painterly.',
		refs: [],
		people: ['chunchu', 'munhee']
	},
	{
		id: 'nsfw-munhee-chunchu-window-pressed',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'Shadow on the lattice',
		alt: 'Lit paper lattice at night: silhouettes pressed to the wall in upright tangled sex pose',
		prompt:
			'Intimate-from-outside cinematic still, 16:9. Night. Close on a glowing Korean paper window / lattice screen. Warm interior lamp, cold blue-black street. Dark shadow silhouette of two adult figures pressed to the wall — upright, tangled, one lifting the other — clear embracing sex-pose body language through the lit screen. Magenta #D8258C as faint lamp accent only. No faces. No text. No watermark. Painterly anime-adjacent.',
		refs: [],
		people: ['chunchu', 'munhee']
	},
	{
		id: 'nsfw-munhee-chunchu-window-lift',
		ratio: 0.75,
		tone: '#D8258C',
		nsfw: true,
		at: 'a lift that makes a silhouette into a confession',
		alt: 'Tall night lattice: silhouette pair, one lifting the other — sex pose as shadow confession',
		prompt:
			'Minimal iconic 9:16 night still. Tall glowing paper lattice filling the frame. Warm lamp behind, black courtyard void. Shadow silhouette of two adult figures: one lifting the other against the screen — unmistakable embracing sex pose, no faces. Single magenta #D8258C light seam at the sill. No text. No watermark. Graphic, anime-painterly.',
		refs: [],
		people: ['munhee', 'chunchu']
	},
	{
		id: 'nsfw-munhee-chunchu-window-neighbor-eye',
		ratio: 1.778,
		tone: '#D8258C',
		nsfw: true,
		at: 'A neighbor freezes mid-step under the eaves',
		alt: 'Neighbor under eaves: shocked eye-line toward glowing lattice where couple silhouettes embrace',
		prompt:
			'Wide cinematic night still, 16:9. Dark Silla eaves and courtyard. Foreground: a tiny neighbor silhouette mid-step, head tilted up in shock. Background: glowing paper window with two embracing shadow figures in a clear sex pose. Warm interior vs blue-black night. Magenta #D8258C lamp accent. No readable faces. No text. No watermark. Iconic minimal epic, anime-painterly.',
		refs: [],
		people: ['chunchu', 'munhee']
	}
];

entry.images = entry.images ?? [];
const byId = new Map(entry.images.map((im, i) => [im.id, i]));
for (const slot of windowSlots) {
	if (byId.has(slot.id)) entry.images[byId.get(slot.id)] = { ...entry.images[byId.get(slot.id)], ...slot };
	else entry.images.push(slot);
}

// Refresh at phrases on older marathon slots that still match
const ensureAts = [
	['nsfw-munhee-chunchu-door-shut', 'They shut the door'],
	['nsfw-munhee-chunchu-tangled-silk', 'For weeks they do not leave the bedding'],
	['nsfw-munhee-chunchu-neighbors-wall', 'neighbors on both walls'],
	['nsfw-munhee-chunchu-they-fit', 'They fit.'],
	['nsfw-munhee-chunchu-lattice-morning', 'Morning finds them still tangled'],
	['nsfw-munhee-chunchu-months-door', 'Months pass before either of them remembers the yard']
];
for (const [id, at] of ensureAts) {
	const im = entry.images.find((x) => x.id === id);
	if (im) im.at = at;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const manifest = windowSlots.map(({ id, alt, prompt }) => ({ id, alt, prompt }));
fs.mkdirSync('scripts/.cache', { recursive: true });
fs.writeFileSync(
	'scripts/.cache/munhee-chunchu-window-shadow-manifest.json',
	JSON.stringify(manifest, null, '\t') + '\n'
);

// verify
const fb = entry.blocks.find((b) => b.kind === 'flashback' && b.title === 'the closed months');
const order = entry.blocks
	.map((b, i) => `${i}:${b.kind}:${b.title || (b.html || '').slice(0, 40)}`)
	.filter((_, i) => {
		const b = entry.blocks[i];
		return (
			(b.kind === 'flashback' && ['how they met', "Bupmin's birth", 'the closed months'].includes(b.title)) ||
			(b.kind === 'p' && ((b.html || '').includes('married') || (b.html || '').includes('Bupmin') || (b.html || '').includes('stopped going')))
		);
	});
console.log('order around marathon:');
for (const line of order) console.log(' ', line);
console.log(
	'closed months blocks',
	fb.blocks.length,
	'clean',
	fb.blocks.filter((b) => !b.nsfw).length,
	'nsfw',
	fb.blocks.filter((b) => b.nsfw).length
);

function textOf(b) {
	if (b.kind === 'flashback') return `${b.title} ${b.blocks.map(textOf).join(' ')}`;
	if (b.kind === 'p') return `${b.html || ''} ${b.ko || ''}`;
	if (b.kind === 'dialogue') return [...(b.lines || []), ...(b.en || [])].join(' ');
	return '';
}
const blob = entry.blocks.map(textOf).join(' ');
for (const slot of [...ensureAts.map(([id, at]) => ({ id, at })), ...windowSlots]) {
	const ok = blob.includes(slot.at);
	console.log(ok ? 'OK' : 'MISSING', slot.id || slot[0], slot.at);
}
