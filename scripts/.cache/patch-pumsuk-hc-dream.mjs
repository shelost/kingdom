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

function upsertAfter(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';
const lockRefs = ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'];
const hcPrompt =
	'Intimate cinematic 16:9. LOCKED Daeya feast-hall. CARAVAGGIO tenebrism, one gold oil-lamp, crushed blacks, silky hanbok. No text. No watermark.';
const dreamPrompt =
	'Intimate cinematic 16:9. Dark Daeya timber side-room. CARAVAGGIO lamp. Dream of Maehwa. No text. No watermark.';

const lampI = daeya.blocks.findIndex((b) =>
	blockText(b).includes('They do not stop until the lamp dies')
);
if (lampI < 0) throw new Error('missing lamp-dies beat');

if (!daeya.blocks.some((b) => blockText(b).includes('White milk on the dirtied green'))) {
	daeya.blocks.splice(lampI + 1, 0, {
		kind: 'p',
		nsfw: true,
		html: 'Afterwards she is <b>on the worn pine</b>. Jeogori open. Chima a wreck. He is still kneeling in that clean ice-blue, as if the silk never learned the night. <b>White milk on the dirtied green</b> — on the boards, on the cheap sash, on her, catching the dying lamp. She cannot sit up yet. She does not try.',
		ko: '끝나고 <b>낡은 마루 위에 있다</b>. 저고리는 열려 있다. 치마는 망가졌다. 그는 아직 그 깨끗한 얼음빛으로 무릎을 꿇고 있다. 비단이 밤을 배우지 않은 것처럼. <b>때 묻은 초록 위에 흰 젖</b> — 마루에, 싼 끈에, 그녀에, 죽어 가는 등잔에 잡힌다. 아직 일어나지 못한다. 하려고도 하지 않는다.'
	});
}

const throatI = daeya.blocks.findIndex((b) =>
	blockText(b).includes('After the feast his mouth is at her throat')
);
const fallI = daeya.blocks.findIndex((b) =>
	blockText(b).includes('loses the fortress the way vows are lost')
);
if (throatI < 0 || fallI < 0 || fallI <= throatI) {
	throw new Error(`bad dream insert throat=${throatI} fall=${fallI}`);
}

if (!daeya.blocks.some((b) => blockText(b).includes('He does not go back to the pink room'))) {
	const dreamBlocks = [
		{
			kind: 'p',
			html: '<b>He does not go back to the pink room.</b> He takes a pallet in the dark office so the green does not follow the vow. A pink ribbon on the post. That is as close as he will let the marriage come to this timber. He lies down in clean ice-blue and tells himself he will sleep.',
			ko: '<b>분홍 방으로는 돌아가지 않는다.</b> 초록이 맹세를 따라오지 못하게 어두운 집무 방에 요를 깐다. 기둥에 분홍 리본. 혼인을 이 나무까지 데려오는 한계가 그것이다. 깨끗한 얼음빛으로 누워, 잔다고 말한다.'
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'He does not sleep. <b>The lamp brings her anyway.</b> Maehwa in the gold — dirtied green, plum at the mouth, the look-back, the gestures she used on the tray. A wet dream with a fortress still standing. He is twenty-four and the training has nothing for this.',
			ko: '잠들지 못한다. <b>등잔이 그래도 그녀를 데려온다.</b> 금빛 안의 매화 — 때 묻은 초록, 입의 자두, 돌아보는 눈, 쟁반에서 쓰던 손짓. 성이 아직 서 있는 몽정. 스물넷. 훈련에 이런 항목은 없다.'
		},
		{
			kind: 'dialogue',
			chip: chipM,
			person: 'gumilwife',
			lines: ['자. 또.', '리본은 나중에.'],
			en: ['Come on. Again.', 'The ribbon can wait.']
		},
		{
			kind: 'p',
			nsfw: true,
			html: 'He sits up. Ice-blue pulled taut across the lap. His palm goes down first, as if a hand could keep a vow the mouth already broke. <b>He is already wet with the dream of her.</b> Shame. Want. The ribbon on the post does not move.',
			ko: '일어앉는다. 얼음빛이 무릎에서 팽팽하다. 손이 먼저 내려간다. 입이 이미 깬 맹세를 손이 지킬 수 있다는 듯이. <b>꿈만으로도 이미 젖어 있다.</b> 부끄러움. 욕. 기둥의 리본은 움직이지 않는다.'
		},
		{
			kind: 'dialogue',
			chip: chipP,
			person: 'pumsuk',
			lines: ['가지 마.', '아니 — 가. / 남아.'],
			en: ['Don’t go.', 'No — go. / Stay.']
		},
		{
			kind: 'p',
			html: 'He turns his face to the pink silk and will not look at the lamp. She stays in it anyway, smirking, fruit still in the mouth. <b>Loyalty is a posture he can hold until morning.</b> The body has already voted.',
			ko: '얼굴을 분홍 비단으로 돌리고 등잔은 보지 않는다. 그녀는 그래도 그 안에 남아, 웃고, 자두는 아직 입에. <b>충성은 아침까지 버틸 수 있는 자세다.</b> 몸은 이미 표를 던졌다.'
		}
	];
	daeya.blocks.splice(fallI, 0, ...dreamBlocks);
}

upsertAfter(
	daeya,
	{
		id: 'pumsuk-hc-13-milk',
		ratio: 1.778,
		tone: '#8AAFA0',
		nsfw: true,
		at: 'White milk on the dirtied green',
		alt: 'Aftermath on the worn pine — spilled white milk catching the dying lamp; dirtied green wrecked, his ice-blue still clean',
		refs: lockRefs,
		people: ['gumilwife', 'pumsuk'],
		prompt: hcPrompt
	},
	'pumsuk-hc-12-lose'
);

const dreams = [
	{
		id: 'pumsuk-dream-01-pallet',
		at: 'He does not go back to the pink room',
		alt: 'He tries to sleep on a dark timber pallet — clean ice-blue, eyes open, one dying lamp'
	},
	{
		id: 'pumsuk-dream-02-arrive',
		at: 'The lamp brings her anyway',
		alt: 'Dream: Maehwa arrives in the gold with a plum; he cannot close his eyes'
	},
	{
		id: 'pumsuk-dream-03-lookback',
		at: 'The lamp brings her anyway',
		alt: 'Dream: she looks back over the shoulder in dirtied green, same feast-hall lamp'
	},
	{
		id: 'pumsuk-dream-04-fruit',
		at: 'The lamp brings her anyway',
		alt: 'Dream: plum at her mouth, jeogori open; his ice-blue heart-pupils'
	},
	{
		id: 'pumsuk-dream-05-shame',
		at: 'He is already wet with the dream of her',
		alt: 'He sits up — palm down on taut ice-blue silk; she is only a green smear in the lamp'
	},
	{
		id: 'pumsuk-dream-06-token',
		at: 'Loyalty is a posture he can hold until morning',
		alt: 'He turns to the pink ribbon on the post; she stays in the lamp behind him'
	}
];

let after = 'pumsuk-hc-13-milk';
for (const d of dreams) {
	upsertAfter(
		daeya,
		{
			id: d.id,
			ratio: 1.778,
			tone: '#8AAFA0',
			nsfw: true,
			at: d.at,
			alt: d.alt,
			refs: lockRefs,
			people: ['gumilwife', 'pumsuk'],
			prompt: dreamPrompt
		},
		after
	);
	after = d.id;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched milk aftermath + dream beats');
