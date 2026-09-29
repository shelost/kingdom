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

function text(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return `${b.html ?? ''} ${b.ko ?? ''}`;
}

const daeya = findEntry('Daeya Fortress');
const byId = new Map(daeya.images.map((im) => [im.id, im]));

function take(id) {
	const im = byId.get(id);
	if (!im) throw new Error(`missing image ${id}`);
	daeya.images = daeya.images.filter((x) => x.id !== id);
	return im;
}

function insertAfter(afterId, items) {
	const i = daeya.images.findIndex((im) => im.id === afterId);
	if (i < 0) throw new Error(`missing ${afterId}`);
	daeya.images.splice(i + 1, 0, ...items);
}

const moves = [
	{
		after: 'pumsuk-more-01-look',
		at: 'He looks at her and is hard again',
		ids: [
			'nsfw-yehwa-fruit-lookback',
			'nsfw-yehwa-shadow-body',
			'nsfw-pumsuk-gumilwife-allure'
		]
	},
	{
		after: 'pumsuk-more-02-already',
		at: 'Already?',
		ids: ['nsfw-yehwa-fruit-lounge', 'nsfw-yehwa-sash-hip']
	},
	{
		after: 'pumsuk-seq-11-scream',
		at: 'The laugh becomes a scream',
		ids: [
			'nsfw-pumsuk-gumilwife-hands',
			'nsfw-pumsuk-yehwa-backpress',
			'nsfw-pumsuk-yehwa-press'
		]
	},
	{
		after: 'pumsuk-more-04-third',
		at: 'the look is the whole third round',
		ids: [
			'nsfw-yehwa-fruit-low',
			'nsfw-yehwa-lamp-split',
			'nsfw-pumsuk-gumilwife-pressed'
		]
	},
	{
		after: 'pumsuk-more-06-owned',
		at: 'she is not running the room anymore',
		ids: ['nsfw-pumsuk-gumilwife-overwhelm', 'nsfw-yehwa-fruit-lips']
	}
];

for (const m of moves) {
	const items = m.ids.map((id) => {
		const im = take(id);
		im.at = m.at;
		im.nsfw = true;
		return im;
	});
	insertAfter(m.after, items);
}

const look = daeya.blocks.find((b) => text(b).includes('He looks at her and is hard again'));
if (!look) throw new Error('missing look graf');
look.html =
	'He does not go soft. He looks — <b>the jeogori has fallen off the shoulders like a veil</b>, bare back, the hip the ochre cannot keep, milk already on the cheap sash — and the look is worse than the thrust. <b>He looks at her and is hard again.</b> Instant. A boy staring at a used body and wanting it more than the unused one. Thirty-one did that. She sees it. She has never been looked at like that after.';
look.ko =
	'안 죽는다. 본다 — <b>저고리가 어깨에서 너울처럼 내려가 있다</b>, 벗은 등, 황토가 못 가리는 엉덩이, 싼 끈에 이미 흰 젖 — 그 눈이 박기보다 나쁘다. <b>보고, 다시 선다.</b> 즉시. 쓰인 몸을 보고 안 쓰인 몸보다 더 원하는 소년. 서른하나가 한 것이다. 그녀가 본다. 그 다음에는 그렇게 보인 적이 없다.';

const third = daeya.blocks.find((b) => text(b).includes('the look is the whole third round'));
if (!third) throw new Error('missing third graf');
third.html =
	'Second finish. She thinks that is the night. She is shaking. She tries to close the jeogori over the chest with a hand that does not work — it is only a veil now, the back still bare, the hip still out. He looks at the wreck of the ochre and the open green and the milk on the pine and the waist he already spent in, and <b>the look is the whole third round.</b>';
third.ko =
	'두 번째. 이번이 밤인 줄 안다. 떤다. 안 되는 손으로 가슴 위 저고리를 여미려 한다 — 이제는 너울일 뿐이고, 등은 아직 벗었고, 엉덩이는 아직 나와 있다. 망가진 황토와 열린 초록과 마루의 흰 젖과 이미 싼 허리를 보고, <b>그 눈이 세 번째 전부다.</b>';

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('moved body stills onto sex ats');
