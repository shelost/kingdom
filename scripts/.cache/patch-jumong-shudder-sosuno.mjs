/**
 * Jumong flirts at the well → cold shudder → turns into tsundere Sosuno.
 * node scripts/.cache/patch-jumong-shudder-sosuno.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const j = story[4].entries[5];
if (j.title !== 'Jumong') throw new Error(`expected Jumong, got ${j.title}`);

function ensureImage(slot) {
	const i = j.images.findIndex((im) => im.id === slot.id);
	if (i < 0) j.images.push(slot);
	else j.images[i] = { ...j.images[i], ...slot };
}

const hitch = j.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('He grins at the wrong well')
);
if (hitch < 0) throw new Error('hitch graf missing');

j.blocks[hitch] = {
	kind: 'p',
	html: 'At the well they don’t pose so much as linger. <b>At the well three girls laugh too long.</b> Teal tips her weight on the beam — <b>Hip first on the beam</b> — and grins like she meant to bump him. Saffron hikes the chima a finger because the water splashed, then leaves it — <b>She hikes it like a dare.</b> Plum laughs at a joke that was only half good. He grins easy — the sun-grin, not even trying. <b>He grins at the wrong well.</b> <b>They hitch at his well.</b>',
	ko: '우물에서 포즈라기보다 그냥 안 간다. <b>우물에서 세 여자가 너무 오래 웃는다.</b> 청록이 들보에 무게를 싣고 — <b>엉덩이부터</b> — 일부러 부딪친 것처럼 웃는다. 사프란은 물 튀었다고 치마를 한 손가락 걷고 그대로 둔다 — <b>내기처럼 걷는다.</b> 자두는 반만 웃긴 농담에 웃는다. 그는 쉽게 웃는다 — 해 웃음. <b>틀린 우물에 웃는다.</b> <b>그의 우물에 엉덩이를 건다.</b>'
};

const sleeve = j.blocks.findIndex(
	(b) => typeof b.html === 'string' && b.html.includes('A hand finds his sleeve')
);
if (sleeve < 0) throw new Error('sleeve graf missing');

if (!j.blocks[sleeve + 1]?.html?.includes?.('He flirts at the wrong well')) {
	j.blocks.splice(
		sleeve + 1,
		0,
		{
			kind: 'p',
			html: 'He leans into it. Not well. A wink at teal. A laugh that is not about the rope. <b>He flirts at the wrong well.</b>',
			ko: '그쪽에 몸을 싣는다. 잘하진 않는다. 청록에게 눈짓. 줄하고는 상관없는 웃음. <b>틀린 우물에 추근다.</b>'
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: ['Wait— that one was good.', 'Stay. Rope can wait.', 'Poor bucket.'],
			lines: ['잠깐— 그건 진짜 웃겼어.', '있어. 줄은 기다려.', '불쌍한 두레박.']
		},
		{
			kind: 'p',
			html: 'Then a cold line runs up his back — not wind, not the well. <b>A cold shudder up his back.</b> The grin dies mid-face. <b>He turns.</b>',
			ko: '그러다 등줄기를 차가운 선이 탄다 — 바람도 아니고 우물도 아니다. <b>등줄기가 서늘하다.</b> 웃음이 얼굴 한가운데서 죽는다. <b>돌아본다.</b>'
		},
		{
			kind: 'p',
			html: '<b>Sosuno is already there.</b> Empty bucket she does not need. Chin up. Blush she is pretending is weather. She does not speak yet. She does not have to.',
			ko: '<b>소서노는 이미 있다.</b> 필요 없는 빈 두레박. 턱. 날씨인 척하는 홍조. 아직 말은 안 한다. 안 해도 된다.'
		}
	);
}

ensureImage({
	id: 'jumong-flirt-daughters',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'He flirts at the wrong well',
	alt: 'Dutch OTS: Jumong leaning in, easy wink, anonymous teal/saffron at the well rim',
	refs: ['/ch_jumong.png'],
	people: ['jumong'],
	prompt: ''
});
ensureImage({
	id: 'jumong-cold-shudder',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'A cold shudder up his back',
	alt: 'OTS behind Jumong: cold seam up red silk, shoulders hitch, daughters going bokeh',
	refs: ['/ch_jumong.png'],
	people: ['jumong'],
	prompt: ''
});
ensureImage({
	id: 'jumong-turn-sosuno',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8a04a',
	at: 'He turns.',
	alt: 'Dutch: Jumong mid-turn at the well; Sosuno dusty-rose with empty bucket in midground',
	refs: ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['jumong', 'sosuno'],
	prompt: ''
});
ensureImage({
	id: 'sosuno-tsun-well-caught',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8a04a',
	at: 'Sosuno is already there',
	alt: 'ECU Sosuno tsundere at the well: chin up, scowl, heavy blush, empty bucket rim',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['sosuno'],
	prompt: ''
});

let seq = fs.readFileSync(SEQ, 'utf8');
const needle =
	"{ id: 'jumong-seq-daughters-grin', role: 'sun-grin', angle: 'dutch OTS grin', at: 'He grins at the wrong well' },";
const insert = `${needle}
			{ id: 'jumong-flirt-daughters', role: 'he flirts back', angle: 'dutch OTS wink', at: 'He flirts at the wrong well' },
			{ id: 'jumong-cold-shudder', role: 'cold shudder', angle: 'OTS back', at: 'A cold shudder up his back' },
			{ id: 'jumong-turn-sosuno', role: 'he turns', angle: 'dutch turn', at: 'He turns.' },
			{ id: 'sosuno-tsun-well-caught', role: 'tsundere caught', angle: 'ECU', at: 'Sosuno is already there' },`;
if (!seq.includes("id: 'jumong-cold-shudder'")) {
	if (!seq.includes(needle)) throw new Error('movieSequences needle missing');
	seq = seq.replace(needle, insert);
	fs.writeFileSync(SEQ, seq);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched flirt → shudder → tsundere turn');
