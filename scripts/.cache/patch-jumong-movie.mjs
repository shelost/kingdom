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

function slot(o) {
	return { ratio: 1.778, nsfw: false, ...o };
}

const jumong = findEntry('Jumong');
const blocks = jumong.blocks;

const geumwa = blocks.find((b) => text(b).includes('gold-frog king'));
if (geumwa && !text(geumwa).includes('The Buyeo yard is a timber country')) {
	geumwa.html = geumwa.html.replace(
		'weather still attached to the sky.',
		'weather still attached to the sky. <b>The Buyeo yard is a timber country.</b>'
	);
	geumwa.ko = geumwa.ko.replace('하늘에 아직 날씨가 붙어 있다.', '하늘에 아직 날씨가 붙어 있다. <b>부여 마당은 나무 나라다.</b>');
}

const forest = blocks.find((b) => text(b).includes('The forest is a closing net'));
if (forest && !text(forest).includes('The pines are a net from above')) {
	forest.html += ' <b>The pines are a net from above.</b>';
	forest.ko += ' <b>소나무는 위에서 그물이다.</b>';
}

const samjokoIdx = blocks.findIndex((b) => text(b).includes('samjoko'));
if (samjokoIdx >= 0 && !blocks.some((b) => text(b).includes('He prays at the Jumong cavern'))) {
	blocks.splice(samjokoIdx + 1, 0, {
		kind: 'p',
		html: 'Before the valley has a name for him he finds a mouth in the hill — stone, leaf-light, a country-shaped dark. <b>He prays at the Jumong cavern.</b> Not for a throne. For a roof that is his.',
		ko: '골짜기가 아직 그의 이름을 부르기 전에 산허리에 입이 있다 — 돌, 잎빛, 나라 모양의 어둠. <b>국동대혈에서 빈다.</b> 왕좌가 아니다. 자기 지붕을.'
	});
}

const jolbon = blocks.find((b) => text(b).includes('Jolbon valley'));
if (jolbon && !text(jolbon).includes('The Jolbon hall is a timber country')) {
	jolbon.html += ' <b>The Jolbon hall is a timber country.</b>';
	jolbon.ko += ' <b>졸본 대청은 나무 나라다.</b>';
}

const porch = blocks.find((b) => text(b).includes('already watching from the grain porch'));
if (porch && !text(porch).includes('She prices him, then forgets the count')) {
	porch.html += ' <b>She prices him, then forgets the count.</b>';
	porch.ko += ' <b>값을 매기다가 세던 것을 잊는다.</b>';
}

const back = blocks.find((b) => text(b).includes('stares at the line of his back'));
if (back && !text(back).includes('She blushes at his back')) {
	back.html =
		'She turns her face as if going back to the grain, proud — the chieftain’s daughter, a widow who will not be seen wanting. And still she stares at the line of his back. Heat climbs her throat. <b>She blushes at his back.</b> He is not looking. That is when the heat is worst. In her head the ledger is not grain. She hides it in the counting-voice, and the voice does not quite hold.';
	back.ko =
		'곡식을 세러 돌아가는 척 얼굴을 돌린다. 자존심이다 — 족장의 딸, 원하는 티를 내면 안 되는 과부. 그런데도 그의 등 선을 본다. 열이 목으로 오른다. <b>등 뒤에서 얼굴을 붉힌다.</b> 그는 안 본다. 그때가 제일 덥다. 머릿속 장부는 곡식이 아니다. 세는 목소리 안에 숨긴다. 목소리는 끝까지 버티지 못한다.';
}

const fatherDlg = blocks.findIndex(
	(b) => b.kind === 'dialogue' && b.person === 'sosuno' && (b.en ?? []).join(' ').includes('That man… his eyes are like the river')
);
if (fatherDlg >= 0 && !blocks.slice(fatherDlg, fatherDlg + 4).some((b) => text(b).includes('In her head the ledger is not grain'))) {
	blocks.splice(fatherDlg, 0, {
		kind: 'p',
		html: 'The counting-voice says one, two, three. The other voice — the one she keeps in books she should not have read — says his weight on her, his mouth at her neck, the hall empty except for that. <b>In her head the ledger is not grain.</b> Outside she is already turning away, as if the sacks mattered more.',
		ko: '세는 목소리는 하나, 둘, 셋. 다른 목소리 — 읽지 말았어야 할 책에 적어 둔 목소리 — 는 그의 무게, 목덜미의 입, 대청이 그것만 남는 일을 말한다. <b>머릿속 장부는 곡식이 아니다.</b> 겉으로는 이미 외면한다. 가마니가 더 중요해 보이게.'
	});
}

const well = blocks.find((b) => text(b).includes('They meet at the well the next morning'));
if (well && !text(well).includes('The well is an accident she timed')) {
	well.html =
		'They meet at the well the next morning, entirely by accident — an accident she has arranged by timing the water, and he by timing his thirst. <b>The well is an accident she timed.</b> She looks at the buckets first. At him second. As if the buckets were the point.';
	well.ko =
		'이튿날 아침, 둘은 우물에서 순전히 우연으로 만난다 — 소서노가 물 뜨는 시각을 맞춰 두고, 주몽이 목마름을 맞춰 둔, 그런 우연으로. <b>우물은 그녀가 맞춘 우연이다.</b> 먼저 두레박을 본다. 그다음 그를 본다. 두레박이 목적인 것처럼.';
}

const sosunoName = blocks.find(
	(b) => b.kind === 'dialogue' && b.person === 'sosuno' && (b.en ?? []).join(' ').includes('are you offering to draw the water')
);
if (sosunoName && !(sosunoName.en ?? []).some((l) => l.includes('Don’t look at my face'))) {
	sosunoName.lines = [
		'소서노요.',
		'왕자님은… 물을 떠 주시려는 겁니까.',
		'아니면 제 손을 만지려는 겁니까.',
		'얼굴은… 보지 마세요. 곡식 셈이 틀어지니까.'
	];
	sosunoName.en = [
		'Sosuno.',
		'Prince… are you offering to draw the water.',
		'Or to touch my hand.',
		'Don’t look at my face. The count goes wrong.'
	];
}

const contest = blocks.find((b) => text(b).includes('The mark is that pine'));
if (contest && !(contest.en ?? []).some((l) => String(l).includes('The pine is a hundred paces'))) {
	/* dialogue — add bold on html via a p insert after */
}
const pineIdx = blocks.findIndex((b) => text(b).includes('The mark is that pine'));
if (pineIdx >= 0 && !blocks.some((b) => text(b).includes('The pine is a hundred paces'))) {
	blocks.splice(pineIdx + 1, 0, {
		kind: 'p',
		html: '<b>The pine is a hundred paces.</b> Packed earth. One tree. The hall behind them, giwa catching late light. Sosuno on the porch rail, knuckles already white, pretending she is only here for the count.',
		ko: '<b>소나무는 백 보다.</b> 다진 흙. 나무 하나. 등 뒤의 대청, 늦은 빛을 받는 기와. 소서노는 누대 난간에 있다. 손마디가 이미 하얗다. 셈하러 온 척한다.'
	});
}

const split = blocks.find((b) => text(b).includes('splits Tabal’s arrow'));
if (split && !text(split).includes('The hall hears the wood cry')) {
	split.html += ' <b>The hall hears the wood cry.</b>';
	split.ko += ' <b>대청이 나무 우는 소리를 듣는다.</b>';
}

const nights = blocks.find((b) => text(b).includes('nights belong to something else'));
if (nights && !text(nights).includes('The ledger stays open longer')) {
	nights.html =
		'After that the war-talk still happens, but nights belong to something else. He watches her count grain. She lets him — and looks at the numbers when he looks at her, and at his mouth when he looks at the lamp. <b>The ledger stays open longer than it needs to.</b>';
	nights.ko =
		'그 다음에도 전쟁 이야기는 한다. 밤은 다른 것에 속한다. 그가 곡식 세는 것을 본다. 그녀는 보게 둔다 — 그가 자신을 보면 숫자를 보고, 그가 등잔을 보면 그의 입을 본다. <b>장부는 필요 이상으로 오래 열려 있다.</b>';
}

const hunger = blocks.find((b) => text(b).includes('The marriage is real hunger first'));
if (hunger && !text(hunger).includes('She still pretends the count')) {
	hunger.html +=
		' She still pretends the count is what she came for. Then the silk is hiked and she is not pretending. <b>She wants him from behind, and she will not say it first.</b>';
	hunger.ko +=
		' 아직도 셈하러 온 척한다. 그러다 비단이 걷히면 척이 끝난다. <b>뒤에서 그를 원하고, 먼저 말은 안 한다.</b>';
}

const extras = [
	slot({
		id: 'jumong-seq-buyeo-wide',
		tone: '#c9a227',
		at: 'The Buyeo yard is a timber country',
		alt: 'Wide: Buyeo timber capital yard by a river, giwa roofs, packed earth — Geumwa a small gold-frog king in his own court',
		refs: ['/ch_geumwa.png'],
		people: ['geumwa'],
		prompt: 'Wide 16:9. Real Buyeo timber yard, giwa, river. Natural sky. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-forest-wide',
		tone: '#e8563f',
		at: 'The pines are a net from above',
		alt: 'Aerial night: Korean pines closing like a net; tiny red Jumong running a dirt path',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: 'Aerial night pine net. Tiny red Jumong. No army catalog. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-cave-wide',
		tone: '#3d6b4a',
		at: 'He prays at the Jumong cavern',
		alt: 'Wide: the Jumong cavern mouth — stone arch, leaf-light, one small red figure praying',
		refs: ['/ch_jumong.png', '/pl_jumong_cave.png'],
		people: ['jumong'],
		prompt: 'Wide of the attached cavern. Real stone, leaves. Jumong tiny. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-jolbon-wide',
		tone: '#a97c4a',
		at: 'The Jolbon hall is a timber country',
		alt: 'Wide: Jolbon timber hall, giwa, grain porch, packed-earth yard — Tabal’s country from the hill',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong'],
		prompt: 'Wide Jolbon timber hall, grain porch, packed earth. Natural sky. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-tabal-weigh',
		tone: '#a97c4a',
		at: 'I do not want ash tracked into my hall',
		alt: 'Hall two-shot: Tabal in tiger-pelt weighing Jumong in red; same timber hall',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong'],
		prompt: 'Same Jolbon hall. Tabal weighs Jumong. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-porch-watch',
		tone: '#e8a04a',
		at: 'She prices him, then forgets the count',
		alt: 'From the grain porch: Sosuno mid-count, looking down at Jumong in the yard; tsundere, not smiling',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Grain porch over Jolbon yard. Sosuno counting, ogle hidden. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-back-blush',
		tone: '#e8a04a',
		at: 'She blushes at his back',
		alt: 'His red back walking the packed yard; her face on the porch, fierce then blushing because he is not looking',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Jumong’s back in the yard. Sosuno blushing on the porch. He does not look. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-sosuno-imagine',
		nsfw: true,
		tone: '#e8a04a',
		at: 'In her head the ledger is not grain',
		alt: 'Sosuno counting on the porch; a mosaic-censored thought of Jumong taking her hard from behind',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		people: ['sosuno', 'jumong'],
		prompt: 'Intimate. Thought-bubble mosaic-censored. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-well-wide',
		tone: '#e8a04a',
		at: 'The well is an accident she timed',
		alt: 'Wide morning: Jolbon well in packed earth, timber storehouses, two small figures with buckets',
		refs: ['/ch_jumong.png', '/ch_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Wide Jolbon well yard, same timber country. Morning. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-well-name',
		tone: '#e8563f',
		at: 'May I ask your name',
		alt: 'Mid: Jumong asking her name over the well-beam; Sosuno looking at the bucket, not his mouth',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Same well. He asks her name. She looks at the bucket. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-well-tsun',
		tone: '#e8a04a',
		at: 'Don’t look at my face',
		alt: 'Close: Sosuno tsundere at the well — proud mouth, ears red, binyeo catching morning',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno'],
		prompt: 'Close well. Tsundere Sosuno. Don’t look at my face. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-pine-wide',
		tone: '#e8563f',
		at: 'The pine is a hundred paces',
		alt: 'Wide: packed-earth archery yard, one pine at a hundred paces, hall and porch behind',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png', '/ch_sosuno.png'],
		people: ['yeontabal', 'jumong', 'sosuno'],
		prompt: 'Wide archery yard, one pine, Jolbon hall behind. No army. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-split',
		tone: '#e8563f',
		at: 'The hall hears the wood cry',
		alt: 'Low angle: Jumong’s bow at full draw; Tabal’s arrow already splitting on the pine',
		refs: ['/ch_jumong.png'],
		people: ['jumong'],
		prompt: 'Low angle split arrow. Same pine yard. No text. No watermark.'
	}),
	slot({
		id: 'jumong-seq-ledger',
		tone: '#e8a04a',
		at: 'The ledger stays open longer than it needs to',
		alt: 'Night grain-room: lamp, open ledger; she counts; he watches her throat',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Night locked grain room. Ledger lamp. No glass lantern. No text. No watermark.'
	}),
	slot({
		id: 'nsfw-sosuno-backshot',
		nsfw: true,
		tone: '#e8563f',
		at: 'She wants him from behind, and she will not say it first',
		alt: 'Night grain-room: Jumong taking Sosuno from behind; her tsundere face breaking',
		refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['jumong', 'sosuno'],
		prompt: 'Intimate explicit backshot. Locked grain room. No text. No watermark.'
	})
];

const have = new Set(jumong.images.map((im) => im.id));
const after = jumong.images.findIndex((im) => im.id === 'sosuno-grain-porch');
const insertAt = after < 0 ? jumong.images.length : after;
jumong.images.splice(insertAt, 0, ...extras.filter((s) => !have.has(s.id)));

const king = jumong.images.find((im) => im.id === 'jumong-seq-king');
if (king) {
	king.alt = 'Wide then close: Jumong as first king in a real Jolbon packed-earth courtyard, giwa hall behind';
	king.prompt = 'Real Korean timber hall, giwa, packed earth courtyard — not a red color-plane floor. Jumong. No text. No watermark.';
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(
	'jumong movie slots',
	extras.filter((s) => !have.has(s.id)).map((s) => s.id).join(', ')
);
