/**
 * Canon details: Yuhwa night yellow sun-ray; Lady Ye + Yuri; Sosuno first-look slots; natural daughter flirt.
 * node scripts/.cache/patch-canon-ye-sun-daughters.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const jumong = story[4].entries[5];

function findHtml(snippet) {
	return jumong.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(snippet));
}

// --- 1. Yellow sun-ray that follows Yuhwa at night in Buyeo ---
{
	const i = findHtml('A sun-shaft finds her');
	if (i < 0) throw new Error('sunshaft miss');
	jumong.blocks[i] = {
		kind: 'p',
		html: 'Before the egg, Geumwa’s timber room is only packed earth and a window-bar — night outside the palisade, court silk still on her. Then a <b>ray of yellow sunlight</b> cuts the dark like a hard gold plane, not a halo. She shifts. The beam follows. She turns her shoulder; <b>the yellow light finds her again</b>. Night, and the sun still hunting her the way it did on the Amnok. <b>A sun-shaft finds her</b> until the room has a guest that will not give a name.',
		ko: '알보다 먼저, 금와의 나무 방은 다진 흙과 창살뿐이다 — 성책 밖은 밤이고, 그녀는 아직 조정 비단이다. 그러다 <b>노란 햇살 한 줄기</b>가 어둠을 단단한 금빛 면처럼 가른다. 후광 아님. 몸을 옮긴다. 빛이 따라온다. 어깨를 돌려도 <b>노란 빛이 다시 찾는다</b>. 밤인데도 해가 압록에서처럼 그녀를 쫓는다. <b>햇기둥이 그녀를 찾는다</b>. 방에는 이름 안 대는 손님이 생긴다.'
	};
	// Extra beat after
	if (!jumong.blocks[i + 1]?.html?.includes?.('moves; the yellow follows')) {
		jumong.blocks.splice(i + 1, 0, {
			kind: 'p',
			html: 'She <b>moves; the yellow follows</b>. Geumwa’s men talk about luck. She knows better — Haemosu’s hour never learned to leave a body alone. Ice-blue in a gold cut. Night timber. One impossible noon.',
			ko: '그녀는 <b>움직이고, 노란 빛이 따른다</b>. 금와의 사람들은 재수라고 한다. 그녀는 안다 — 해모수의 시각은 몸을 혼자 두는 법을 배운 적이 없다. 금빛 자른 자리의 얼음빛. 밤의 나무. 불가능한 한낮 하나.'
		});
	}
}

// --- 2. Lady Ye arranged marriage + Yuri pregnancy ---
{
	const warn = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'Yuhwa’s Warning');
	if (warn < 0) throw new Error('warning scene miss');
	const already = jumong.blocks.some(
		(b) => typeof b.html === 'string' && b.html.includes('arranged marriage to Lady Ye')
	);
	if (!already) {
		jumong.blocks.splice(
			warn,
			0,
			{
				kind: 'scene',
				label: 'Lady Ye',
				ko: '예씨부인'
			},
			{
				kind: 'p',
				html: 'Before the knife, Buyeo still tries to make him ordinary. Geumwa arranges what courts arrange — a wife from a house that will hold. <b>Jumong’s arranged marriage to Lady Ye</b> is quiet timber, a lamp, no Amnok thunder. She does not ask for the sun’s story. He does not offer it.',
				ko: '칼보다 먼저, 부여는 그를 평범한 사람으로 만들려 한다. 금와가 조정이 하는 일을 한다 — 집을 붙잡아 줄 집안의 아내. <b>주몽의 예씨부인과의 정혼</b>은 조용한 나무와 등잔이지, 압록의 천둥이 아니다. 그녀는 해 이야기를 묻지 않는다. 그도 꺼내지 않는다.'
			},
			{
				kind: 'dialogue',
				person: 'ladyye',
				chip: '#d98fa8',
				en: [
					'You don’t have to explain the egg.',
					'I married the yard. Not the myth.',
					'Leave the door half if you go. I’ll know.'
				],
				lines: [
					'알 이야기 안 해도 돼요.',
					'신화랑 결혼한 게 아니에요. 이 마당이랑.',
					'가면 문 반만 열어 두세요. 알게요.'
				]
			},
			{
				kind: 'dialogue',
				person: 'jumong',
				chip: '#e8563f',
				en: [
					'Hey.',
					'I— yeah. The yard.',
					'If I leave something, you’ll dig?'
				],
				lines: [
					'야.',
					'난— 그래. 마당.',
					'뭐 남겨 두면, 파 줄 거야?'
				]
			},
			{
				kind: 'p',
				html: 'She is already with child when Daeso’s side room starts sharpening knives. <b>Lady Ye gets pregnant with their son Yuri</b> — quiet, Buyeo winter in her, half a future under the ribs. Jumong will leave a broken sword and a door. She will stay and raise the heir the court tried to erase.',
				ko: '대소의 곁방이 칼을 갈기 시작할 때, 그녀는 이미 아이를 배고 있다. <b>예씨부인이 아들 유리를 밴다</b> — 조용히, 갈비 아래 반쪽 미래, 부여의 겨울. 주몽은 부러진 칼과 문을 남긴다. 그녀는 남아서, 조정이 지우려던 후계를 키운다.'
			},
			{
				kind: 'dialogue',
				person: 'ladyye',
				chip: '#d98fa8',
				en: [
					'He’s in here.',
					'Yuri — if it’s a boy. If it isn’t, still ours.',
					'Go when your mother says. I’ll hold the half.'
				],
				lines: [
					'여기 있어요.',
					'유리다 — 사내면. 아니어도 우리 애야.',
					'어머니 말씀하시면 가세요. 반은 내가 쥘게요.'
				]
			}
		);
	}
}

// Soften the later whisper block so Ye pregnancy is already established
{
	const i = findHtml('whispers something to his wife');
	if (i >= 0) {
		jumong.blocks[i].html =
			'He whispers something to his wife, <b>Lady Ye</b> — already carrying <b>Yuri</b> — and goes, because Yuhwa already ordered the south, and the knife proved her right. A lamp. A half-sword left where a boy will later dig. She does not follow. She was never going to. <b>Night at the palisade</b> — gate, pines, hall as a dark bar, Jumong a tiny red stamp leaving the only room that still held him.';
		jumong.blocks[i].ko =
			'아내 <b>예씨부인</b>에게 — 이미 <b>유리</b>를 밴 — 뭔가 속삭이고 떠난다. 유화가 남쪽을 명했고, 칼이 그 말이 맞음을 증명했으니까. 등잔. 나중에 사내가 파 낼 자리에 남긴 반쪽 칼. 그녀는 따라가지 않는다. 갈 생각도 없었다. <b>성책의 밤</b> — 문, 소나무, 어두운 막대 같은 전각, 자기를 붙잡던 유일한 방을 떠나는 작은 붉은 도장 주몽.';
	}
}

// --- 3. Natural daughters flirting ---
{
	const hitch = findHtml('At the well three girls laugh too long');
	if (hitch < 0) throw new Error('hitch miss');
	// Replace fox dialogue cluster until sosuno flaw
	const flaw = jumong.blocks.findIndex(
		(b, idx) => idx > hitch && typeof b.html === 'string' && b.html.includes('They can do sexy')
	);
	if (flaw < 0) throw new Error('flaw miss');
	jumong.blocks[hitch] = {
		kind: 'p',
		html: 'At the well they don’t pose so much as linger. <b>At the well three girls laugh too long.</b> Teal tips her weight on the beam — <b>Hip first on the beam</b> — and grins like she meant to bump him. Saffron hikes the chima a finger because the water splashed, then leaves it — <b>She hikes it like a dare.</b> Plum laughs at a joke that was only half good. He grins easy — the sun-grin, not even trying. <b>He grins at the wrong well.</b> Sosuno arrives with an empty bucket she does not need. The laugh dies late. <b>They hitch at his well.</b>',
		ko: '우물에서 포즈라기보다 그냥 안 간다. <b>우물에서 세 여자가 너무 오래 웃는다.</b> 청록이 들보에 무게를 싣고 — <b>엉덩이부터</b> — 일부러 부딪친 것처럼 웃는다. 사프란은 물 튀었다고 치마를 한 손가락 걷고 그대로 둔다 — <b>내기처럼 걷는다.</b> 자두는 반만 웃긴 농담에 웃는다. 그는 쉽게 웃는다 — 해 웃음. <b>틀린 우물에 웃는다.</b> 소서노가 필요 없는 빈 두레박을 들고 온다. 웃음이 늦게 죽는다. <b>그의 우물에 엉덩이를 건다.</b>'
	};
	const natural = [
		{
			kind: 'dialogue',
			chip: '#2aa89a',
			en: [
				'Hey big boy~',
				'Hip first on the beam.',
				'You always this tall up close, or am I just— mm.'
			],
			lines: [
				'야 큰 오빠~',
				'들보에 엉덩이부터.',
				'가까이서 보니까 더 커? 아니면 내가— 음.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#d4a017',
			en: [
				'She hikes it like a dare.',
				'Come fetch at ours.',
				'Ours is nicer. Stay. Hey— your shoulder’s right there—'
			],
			lines: [
				'이렇게 걷으면— 내기지 뭐.',
				'우리 우물로 와.',
				'우리 게 더 예뻐. 있어. 야— 어깨 거기잖아—'
			]
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: [
				'Hi.',
				'I— rope. Just the rope.',
				'You’re— yeah. Funny. Too funny.'
			],
			lines: [
				'안녕.',
				'난— 줄. 줄만.',
				'웃기네. 너무 웃겨.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#c4a06a',
			en: [
				'Heh— hey big boy, the bucket’s jealous.',
				'Come fetch at ours.',
				'Don’t look at Sosuno. Look at me. Soft. Just for a second~'
			],
			lines: [
				'푸핫— 야 큰 오빠, 두레박이 질투해.',
				'우리 우물로 와.',
				'소서노 보지 마. 나 봐. 잠깐만~ 살살~'
			]
		},
		{
			kind: 'p',
			html: 'A hand finds his sleeve without announcing it. Someone laughs too close to his ear. Someone else says <i>hey big boy~</i> like it is weather. Natural. Annoying. Effective. <b>They hitch at his well.</b>',
			ko: '소매를 잡는 손이 미리 말하지 않는다. 누가 귀에 너무 가까이 웃는다. 누가 <i>야 큰 오빠~</i>를 날씨처럼 말한다. 자연스럽고. 짜증나고. 먹힌다. <b>그의 우물에 엉덩이를 건다.</b>'
		}
	];
	jumong.blocks.splice(hitch + 1, flaw - hitch - 1, ...natural);
}

// --- 4. Sosuno first-look still slots ---
const ensure = (slot) => {
	if (!jumong.images.some((i) => i.id === slot.id)) jumong.images.push(slot);
};

ensure({
	id: 'sosuno-seq-first-look-ots',
	ratio: 1.778,
	tone: '#e8a04a',
	at: 'The yard goes quiet.',
	alt: 'OTS Sosuno: wet Jumong red silk entering Jolbon yard; her dusty-rose shoulder',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
	people: ['sosuno', 'jumong'],
	prompt: ''
});
ensure({
	id: 'sosuno-seq-first-look-dutch',
	ratio: 1.778,
	tone: '#e8563f',
	at: 'Then the wet man is in the yard',
	alt: 'Dutch Jolbon yard: wet Jumong mid-stride red; Sosuno tiny dusty-rose at spear line',
	refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt: ''
});
ensure({
	id: 'sosuno-seq-first-blush-ecu',
	ratio: 0.75,
	tone: '#e8a04a',
	at: 'Something in her goes stupid',
	alt: 'ECU Sosuno first look: chin up, eyes wrecked, dusty-rose blush',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['sosuno'],
	prompt: ''
});
ensure({
	id: 'sosuno-seq-first-shoulder',
	ratio: 1.778,
	tone: '#e8563f',
	at: 'She prices him, then forgets the count',
	alt: 'Rack-focus: Jumong wet red shoulder sharp; Sosuno dusty-rose face soft behind',
	refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt: ''
});
ensure({
	id: 'yuhwa-sunshaft-night-follow',
	ratio: 1.778,
	tone: '#f0b429',
	at: 'moves; the yellow follows',
	alt: 'Night Buyeo timber: yellow sun-ray following Yuhwa as she turns; ice-blue silk',
	refs: ['/ch_yuhwa.png', '/bn_yuhwa.png', '/pl_buyeo_yard.png'],
	people: ['yuhwa'],
	prompt: ''
});
ensure({
	id: 'jumong-ye-arranged',
	ratio: 1.778,
	tone: '#d98fa8',
	at: 'Jumong’s arranged marriage to Lady Ye',
	alt: 'Intimate timber: Jumong and Lady Ye lamp wedding quiet, no myth thunder',
	refs: ['/ch_jumong.png', '/ch_lady_ye.png'],
	people: ['jumong', 'ladyye'],
	prompt: ''
});
ensure({
	id: 'lady-ye-yuri-pregnant',
	ratio: 0.75,
	tone: '#d98fa8',
	at: 'Lady Ye gets pregnant with their son Yuri',
	alt: 'Intimate: Lady Ye hand on belly, Buyeo night lamp; Jumong red sleeve edge',
	refs: ['/ch_lady_ye.png', '/ch_jumong.png'],
	people: ['ladyye', 'jumong'],
	prompt: ''
});

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
if (!seq.includes('yuhwa-sunshaft-night-follow')) {
	seq = seq.replace(
		`{ id: 'yuhwa-sunshaft-timber', role: 'light before the egg', angle: 'dutch shaft-plane', at: 'A sun-shaft finds her' },`,
		`{ id: 'yuhwa-sunshaft-timber', role: 'light before the egg', angle: 'dutch shaft-plane', at: 'A sun-shaft finds her' },
			{ id: 'yuhwa-sunshaft-night-follow', role: 'yellow follows', angle: 'dutch turn', at: 'moves; the yellow follows' },`
	);
}
if (!seq.includes('jumong-ye-arranged')) {
	seq = seq.replace(
		`{ id: 'jumong-ye-whisper', role: 'half a sword', angle: 'intimate ECU', at: 'whispers something to his wife' },`,
		`{ id: 'jumong-ye-arranged', role: 'arranged marriage', angle: 'lamp two-shot', at: 'Jumong’s arranged marriage to Lady Ye' },
			{ id: 'lady-ye-yuri-pregnant', role: 'Yuri under the ribs', angle: 'intimate ECU', at: 'Lady Ye gets pregnant with their son Yuri' },
			{ id: 'jumong-ye-whisper', role: 'half a sword', angle: 'intimate ECU', at: 'whispers something to his wife' },`
	);
}
if (!seq.includes('sosuno-seq-first-look-ots')) {
	seq = seq.replace(
		`{ id: 'sosuno-seq-silence-ecu', role: 'first look silence', angle: 'ECU eyes', at: 'The yard goes quiet' },`,
		`{ id: 'sosuno-seq-silence-ecu', role: 'first look silence', angle: 'ECU eyes', at: 'The yard goes quiet' },
			{ id: 'sosuno-seq-first-look-dutch', role: 'wet man enters', angle: 'dutch yard', at: 'Then the wet man is in the yard' },
			{ id: 'sosuno-seq-first-look-ots', role: 'her first look', angle: 'OTS Sosuno', at: 'The yard goes quiet.' },
			{ id: 'sosuno-seq-first-shoulder', role: 'prices the shoulder', angle: 'rack-focus', at: 'She prices him, then forgets the count' },
			{ id: 'sosuno-seq-first-blush-ecu', role: 'stupid blush ECU', angle: 'ECU', at: 'Something in her goes stupid' },`
	);
}
fs.writeFileSync(SEQ, seq);
console.log('patched canon ye/sun/daughters/first-look');
