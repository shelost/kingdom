/**
 * Confession aftermath: stunned ECUs + comic silence inserts.
 * node scripts/.cache/patch-confess-stunned.mjs
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

const confess = j.blocks.findIndex(
	(b) =>
		b.kind === 'dialogue' &&
		Array.isArray(b.en) &&
		b.en.some((l) => String(l).includes('I wanted you. From the first look.'))
);
if (confess < 0) throw new Error('confession dialogue missing');

const already = j.blocks[confess + 1]?.html?.includes?.('Jumong’s grin dies');
if (!already) {
	j.blocks.splice(confess + 1, 0, {
		kind: 'p',
		html: '<b>The yard does not move.</b> <b>Jumong’s grin dies in his mouth.</b> He is still facing the pine and he is not walking. <b>Sosuno hears herself and cannot take it back.</b> Packed earth. Grey giwa. <b>The well-rope hangs.</b> Two people stunned on their own porch — no bucket, no count, no joke left to hide behind.',
		ko: '<b>마당이 안 움직인다.</b> <b>주몽의 웃음이 입 안에서 죽는다.</b> 아직 소나무를 보고 있고, 걷지는 않는다. <b>소서노는 제 입을 듣고 주워 담지 못한다.</b> 다진 흙. 회색 기와. <b>우물줄이 늘어져 있다.</b> 둘 다 제 누대에서 멍하다 — 두레박도 점고도, 숨을 농담도 없다.'
	});
}

const refs = ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'];

ensureImage({
	id: 'confess-silence-gap',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8a04a',
	at: 'The yard does not move',
	alt: 'Dutch two-shot: packed-earth gap between frozen Jumong and Sosuno; Jolbon well-yard',
	refs,
	people: ['jumong', 'sosuno'],
	prompt: ''
});
ensureImage({
	id: 'jumong-stunned-ecu',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'Jumong’s grin dies in his mouth',
	alt: 'ECU Jumong stunned: grin dead, mouth open, blown pupils, red headband',
	refs: ['/ch_jumong.png'],
	people: ['jumong'],
	prompt: ''
});
ensureImage({
	id: 'sosuno-stunned-ecu',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8a04a',
	at: 'Sosuno hears herself and cannot take it back',
	alt: 'ECU Sosuno stunned at herself: mouth still open, ears red, dusty-rose, bird binyeo',
	refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
	people: ['sosuno'],
	prompt: ''
});
ensureImage({
	id: 'confess-insert-rope',
	ratio: 1.778,
	nsfw: false,
	tone: '#6b5a3e',
	at: 'The well-rope hangs',
	alt: 'Insert: hemp well-rope as a vertical; granite rim; empty packed earth',
	refs: [],
	prompt: ''
});
ensureImage({
	id: 'jumong-here-soft',
	ratio: 1.778,
	nsfw: false,
	tone: '#e8563f',
	at: 'Okay. I’m here.',
	alt: 'ECU Jumong soft after the stun: not grinning, still here, red silk',
	refs: ['/ch_jumong.png'],
	people: ['jumong'],
	prompt: ''
});

let seq = fs.readFileSync(SEQ, 'utf8');
const needle =
	"{ id: 'sosuno-pov-listen', role: 'her view he listens', angle: 'OTS Sosuno', at: 'I wanted you. From the first look.' },";
const insert = `${needle}
			{ id: 'confess-silence-gap', role: 'silence two-shot', angle: 'dutch gap', at: 'The yard does not move' },
			{ id: 'jumong-stunned-ecu', role: 'he is stunned', angle: 'ECU Jumong', at: 'Jumong’s grin dies in his mouth' },
			{ id: 'sosuno-stunned-ecu', role: 'she is stunned', angle: 'ECU Sosuno', at: 'Sosuno hears herself and cannot take it back' },
			{ id: 'confess-insert-rope', role: 'rope hangs', angle: 'insert still-life', at: 'The well-rope hangs' },
			{ id: 'jumong-here-soft', role: 'I’m here', angle: 'ECU soft', at: 'Okay. I’m here.' },`;
if (!seq.includes("id: 'jumong-stunned-ecu'")) {
	if (!seq.includes(needle)) throw new Error('movieSequences needle missing');
	seq = seq.replace(needle, insert);
	fs.writeFileSync(SEQ, seq);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('patched confession stunned beats + 5 slots');
