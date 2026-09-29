import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

let entry;
for (const ch of story) {
	const en = (ch.entries ?? []).find((e) => e.title === 'Daeya Fortress');
	if (en) {
		entry = en;
		break;
	}
}
if (!entry) throw new Error('missing Daeya Fortress');

const blocks = entry.blocks ?? [];
const lookIdx = blocks.findIndex(
	(b) => b.kind === 'dialogue' && (b.en ?? []).some((s) => s.includes('Which is why everyone looks'))
);
if (lookIdx < 0) throw new Error('missing looks dialogue');

const already = blocks.some(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('the packed-earth yard splits')
);
if (already) {
	console.log('cues already present');
} else {
	const insert = [
		{
			kind: 'p',
			html: 'By noon the packed-earth yard splits. Porters, smiths, the boys who haul grain cluster at the well-post as if the work had always been there. <b>Maehwa</b> crosses alone — teal-sage silk, one red sash, celebrity distance. They do not come closer. She does not invite them.',
			ko: '정오가 되면 다진 흙마당이 갈라진다. 짐꾼, 대장장이, 곡식을 나르는 애들 — 우물 기둥에 몰린다, 일이 원래 거기 있었던 것처럼. <b>매화</b>만 혼자 건넌다. 청록 비단, 붉은 허리끈 하나, 유명인의 거리. 그들은 다가오지 않는다. 그녀도 부르지 않는다.'
		},
		{
			kind: 'dialogue',
			chip: '#8a8a94',
			speaker: '🗣',
			lines: [
				'저 자락 봐…',
				'아니 허리. 허리라고.',
				'검일 마누라잖아.',
				'알아. 그래서… 그래서 더—'
			],
			en: [
				'Look at that hem…',
				'No — the waist. The waist.',
				"That's Gumil's wife.",
				"I know. That's why it's worse—"
			]
		},
		{
			kind: 'p',
			html: 'She hears every unfinished sentence. Bored chin, and the men keep looking anyway — dirt under the nails, the same sour drink on the breath. Lower class, all of them, and she is tired of being their festival. Tired, and still walking as if the yard were built around her.',
			ko: '끝나지 않은 문장을 다 듣는다. 턱은 올려 둔 채, 사내들은 그래도 본다 — 손톱 밑의 흙, 같은 신 술 냄새. 낮은 것들이다. 그들의 잔치가 되는 일에 지쳤다. 지쳤으면서도, 마당이 자기 때문에 생긴 것처럼 걷는다.'
		},
		{
			kind: 'dialogue',
			chip: '#c98fb0',
			person: 'gumilwife',
			lines: ['거기가 길이에요.', '막지는 마시고요.'],
			en: ['That is a road.', 'Do not stand in it.']
		},
		{
			kind: 'p',
			html: 'One of them forgets to close his mouth. She turns just enough. The hem stays a breath too long — teal silk telling on the hip, the wooden sprig pin catching the light — and she lets him have that second like a coin she can afford to drop. Then the silk falls back. She will not let him close.',
			ko: '한 놈이 입을 다물 것을 잊는다. 그녀는 조금만 돌아본다. 자락이 한 숨 더 머문다 — 청록 비단이 허리를 말하고, 나무 비녀가 빛을 받고 — 그 한 초를, 떨어뜨려도 되는 동전처럼 준다. 그리고 비단이 다시 내려온다. 가까이 오라고는 하지 않는다.'
		},
		{
			kind: 'dialogue',
			chip: '#8a8a94',
			speaker: '🗣',
			lines: ['방금—', '봤어. 나도.', '…말도 안 했는데.'],
			en: ['Just now—', 'I saw. I saw.', "…She didn't even say anything."]
		},
		{
			kind: 'p',
			html: 'She leaves them wrecked on the packed earth and almost smiles — a small, private thing, gone before the well-post. The yard is about the curve she takes with her.',
			ko: '그들을 다진 흙 위에 망가진 채로 두고 간다. 거의 웃는다 — 작은, 제 것만인 웃음. 우물 기둥 앞에서 사라진다. 마당의 일은 그녀가 가져가는 그 곡선이다.'
		}
	];
	blocks.splice(lookIdx + 1, 0, ...insert);
	entry.blocks = blocks;
	console.log(`inserted ${insert.length} blocks after looks beat`);
}

const slots = [
	{
		id: 'nsfw-maehwa-yard-stare',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'the packed-earth yard splits',
		alt: 'Daeya yard: Maehwa isolated in teal-sage silk; tiny working men clustered at the well-post',
		prompt:
			'Minimal iconic 16:9 poster. Maehwa, poorest woman of Daeya, a celebrity of the yard. ONE geometric device: a hard empty wedge of packed earth splitting the frame — she isolated on the right, a tiny cluster of working men frozen at a well-post on the left. Face matches the attached portrait (tiny at this scale: same messy bun, wooden sprig pin). Teal-sage #8AAFA0 as the single silk accent. Striking silky hanbok, few hues. Earth location: REAL Daeya fortress yard matching the attached place — same red two-tier giwa munru, weathered stone block walls, timber doors with iron bosses, packed earth. Natural cloudy sky. Tiny anonymous porters and smiths only, no readable faces, no named portraits. No army catalog. No palace clutter. No text. No watermark. Graphic color-blocking, anime-painterly, monumental. NOT photoreal. NOT cartoon.',
		refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png'],
		people: ['gumilwife']
	},
	{
		id: 'nsfw-maehwa-chin-up',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'Bored chin, and the men keep looking',
		alt: 'Close: Maehwa’s bored chin-up; her figure fills the frame while cropped working men stare from the edge',
		prompt:
			'Minimal iconic 16:9 still. Intimate / close. Maehwa, working-class celebrity. ONE geometric device: her body as a vertical silk column filling the frame; anonymous men’s faces cropped as a thin edge-strip along the left looking in. Faces fill the frame. Face matches the attached portrait: tan skin, haughty chin-up, bored side-eye, messy bun, wooden sprig pin. Teal-sage #8AAFA0 silk, red sash, skin-forward cleavage and hip weight. She is bored of them. Simple Daeya packed earth as a thin background, not a furniture dump. No army. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: ['/ch_gumil_wife.png'],
		people: ['gumilwife']
	},
	{
		id: 'nsfw-maehwa-tease',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The hem stays a breath too long',
		alt: 'Over-shoulder tease: Maehwa’s teal hem held a breath too long; one wrecked yard-man in the corner, not allowed close',
		prompt:
			'Minimal iconic 16:9 still. Intimate / close. Maehwa teases a yard man. ONE geometric device: her teal-sage #8AAFA0 hem as a curved ribbon held a breath too long, over-shoulder look. Face matches the attached portrait: tan skin, knowing smirk, wooden sprig pin, messy bun. Skin-forward, silk catching the hip. One anonymous working man wrecked in the lower corner, no named face, cannot come close. She enjoys the stare and will not let him near. Simple packed-earth sliver. No army. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: ['/ch_gumil_wife.png'],
		people: ['gumilwife']
	},
	{
		id: 'nsfw-maehwa-walk-on',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'She leaves them wrecked',
		alt: 'Maehwa walks on through the Daeya yard; working men stay wrecked in a low strip; she almost smiles',
		prompt:
			'Minimal iconic 16:9 still. Maehwa walks on. ONE geometric device: her back as a departing stamp in the upper right; a low strip of wrecked working men frozen at the bottom, unfinished. Face matches the attached portrait in a three-quarter over-shoulder sliver: almost-smile, tan skin, wooden sprig pin. Teal-sage #8AAFA0 silk the single accent. REAL Daeya yard — packed earth, stone wall, red giwa munru matching the attached place as a thin plane. Natural haze. No army catalog. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png'],
		people: ['gumilwife']
	},
	{
		id: 'nsfw-maehwa-figure-yard',
		ratio: 0.75,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'The yard is about the curve',
		alt: 'Close: Maehwa’s hip and teal-sage silk as the thing the Daeya yard is about',
		prompt:
			'Minimal iconic 3:4 still. Intimate / close. Maehwa’s figure is what the yard is about. ONE geometric device: her hip and teal-sage #8AAFA0 chima as a low horizontal plane filling two-thirds of the frame; a thin band of Daeya packed earth and red munru at the top. Face matches the attached portrait: tan skin, haughty almost-smile, messy bun, wooden sprig pin, looking down past the camera. Skin-forward, silk sheen, red sash knot. One accent. No porn catalog. No extra-men dump. No text. No watermark. Graphic color-blocking, anime-painterly. Adult/mature. NOT photoreal. NOT cartoon.',
		refs: ['/ch_gumil_wife.png', '/pl_daeya_fortress.png'],
		people: ['gumilwife']
	}
];

const images = entry.images ?? [];
const have = new Set(images.map((im) => im.id));
const wideIdx = images.findIndex((im) => im.id === 'daeya-wide');
const insertAt = wideIdx >= 0 ? wideIdx + 1 : images.length;
let added = 0;
for (const slot of [...slots].reverse()) {
	if (have.has(slot.id)) continue;
	images.splice(insertAt, 0, slot);
	added++;
}
entry.images = images;

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`added ${added} slots; images now ${images.length}`);
