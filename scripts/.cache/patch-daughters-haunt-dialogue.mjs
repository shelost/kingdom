/**
 * 1) Fix Jolbon-well dialogue (spoken young-women talk, not caption lines)
 * 2) Expand Sosuno loft masturbation: Jumong haunt flashes + angry self-scold after climax
 * 3) Add leaner flirty daughter slots + haunt/scold still slots
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const PEOPLE = path.join(ROOT, 'src/lib/data/image-people.json');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');
const SUFFIX = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'src/lib/data/image-prompt-house.json'), 'utf8')
).suffix;

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const jumong = story.find((c) => c.id === 'jumong')?.entries?.find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong entry missing');

const blocks = jumong.blocks;

// --- dialogue: find saffron "She hikes it like a dare" block and rewrite cluster ---
function rewriteWellDialogue() {
	const idx = blocks.findIndex(
		(b) =>
			b.kind === 'dialogue' &&
			Array.isArray(b.en) &&
			b.en.some((l) => String(l).includes('She hikes it like a dare'))
	);
	if (idx < 0) {
		console.warn('well dialogue cluster not found');
		return;
	}
	// teal before, saffron at idx, jumong, plum after
	const teal = blocks[idx - 1];
	const saffron = blocks[idx];
	const jm = blocks[idx + 1];
	const plum = blocks[idx + 2];

	if (teal?.kind === 'dialogue' && teal.chip === '#2aa89a') {
		teal.en = ['Hey~', 'Wait— sorry~ I didn’t mean to bump you~', 'You’re kinda— tall up close? Or am I just— mm~'];
		teal.lines = ['야~', '어— 미안~ 일부러 아니야~', '가까이 보니까… 커? 아니면 내가— 음~'];
	}
	if (saffron?.kind === 'dialogue') {
		saffron.en = [
			'Heyyy~ come to ours~',
			'Ours is nicer~ stay a bit~',
			'Wait— hey— your shoulder’s right there—'
		];
		saffron.lines = ['야~~ 우리 우물로 와~', '우리 게 더 예뻐~ 잠깐만 있어~', '야— 잠깐— 어깨 거기잖아—'];
	}
	if (jm?.kind === 'dialogue' && jm.person === 'jumong') {
		jm.en = ['Uh— hey.', 'I was— the rope. Just pulling the rope.', 'Haha— okay. You’re funny.'];
		jm.lines = ['어— 야.', '난— 줄. 줄만 당기는 중.', 'ㅋㅋ— 알겠어. 웃기네.'];
	}
	if (plum?.kind === 'dialogue' && plum.chip === '#c4a06a') {
		plum.en = [
			'Pfft— hey~ big boy~ the bucket’s jealous~',
			'Come fetch at ours~ please~?',
			'Don’t look at Sosuno~ look at me~ just a sec~ soft~'
		];
		plum.lines = [
			'푸핫— 야~ 큰 오빠~ 두레박이 질투해~',
			'우리 우물로 와~ 응~?',
			'소서노 보지 마~ 나 봐~ 잠깐만~ 살살~'
		];
	}

	// later teal "Oops— was that you?"
	const oops = blocks.findIndex(
		(b) => b.kind === 'dialogue' && Array.isArray(b.en) && b.en[0] === 'Oops— was that you?'
	);
	if (oops >= 0) {
		blocks[oops].en = ['Oops~ was that you~?', 'Stay~ your leg’s warm~', 'Hey. Look at me when I— mm~'];
		blocks[oops].lines = ['어라~ 너였어~?', '있어~ 다리 따뜻해~', '야. 나 볼 때— 음~'];
	}
}

rewriteWellDialogue();

// Keep narration phrase "She hikes it like a dare" for image ats — already in p block.

// --- loft masturbation expansion ---
function patchLoft() {
	const climaxIdx = blocks.findIndex(
		(b) =>
			b.kind === 'p' &&
			typeof b.html === 'string' &&
			b.html.includes('She comes on the timber with her teeth')
	);
	if (climaxIdx < 0) {
		console.warn('climax block missing');
		return;
	}

	// Insert haunt narration before "Dusty-rose hiked around the hips" if not present
	const hikeIdx = blocks.findIndex(
		(b) =>
			b.kind === 'p' &&
			typeof b.html === 'string' &&
			b.html.includes('Dusty-rose hiked around the hips')
	);
	if (hikeIdx >= 0 && !blocks.some((b) => b.html?.includes('His grin walks into the loft'))) {
		blocks.splice(hikeIdx, 0, {
			kind: 'p',
			nsfw: true,
			html: 'His grin walks into the loft without him. <b>His face first</b> — clean-shaven, too easy, the well-laugh she told him to stop. Then <b>his bare back</b> in the millet, red silk gone, the line of him she already counted once and pretended she hadn’t. Then the smile again, closer, like it knows she hiked the dusty-rose. She is angry before she is wet. That doesn’t stop the wet. <b>He haunts her into heat.</b>',
			ko: '그 웃음이 그 없이 다락으로 들어온다. <b>얼굴이 먼저다</b> — 수염 없고, 너무 쉬운, 우물에서 그만하라던 그 웃음. 그다음 <b>벗은 등</b>, 조밭에서 붉은 비단 없이, 한 번 세고 안 본 척한 그 선. 그다음 또 그 미소, 더 가까이, 회분홍을 걷은 걸 아는 것처럼. 젖기 전에 화가 난다. 젖는 건 안 멈춘다. <b>그가 열로 따라온다.</b>'
		});
	}

	// After climax p, before Tabal dialogue — insert scold
	const afterClimax = climaxIdx + 1;
	if (!blocks.some((b) => b.en?.[0]?.includes('Stupid—') && b.person === 'sosuno')) {
		blocks.splice(
			afterClimax,
			0,
			{
				kind: 'p',
				nsfw: true,
				html: 'Breath comes back ugly. Chin still down. The boards are wet under her. She looks at her own hand like it betrayed the ledger. <b>She scolds the heat that used his face.</b>',
				ko: '숨이 더럽게 돌아온다. 턱은 아직 내려가 있다. 마루가 젖어 있다. 제 손을 장부를 배신한 것처럼 본다. <b>그 얼굴로 열 낸 걸 꾸짖는다.</b>'
			},
			{
				kind: 'dialogue',
				person: 'sosuno',
				chip: '#e8a04a',
				nsfw: true,
				en: [
					'Stupid— 씨발— why did I—',
					'You. Down there. Getting wet for a grin.',
					'Feral little traitor— I said ditch. I meant ditch.',
					'Don’t you ever— ever— think his back again.',
					'His smile. His face. Shut up. Shut up—'
				],
				lines: [
					'바보야— 씨발— 내가 왜—',
					'너. 거기. 웃음에 젖고.',
					'미친 배신자야— 도랑이라며. 도랑이라니까.',
					'다시는— 다시는— 그 등 생각하지 마.',
					'그 미소. 그 얼굴. 닥쳐. 닥쳐—'
				]
			}
		);
	}
}

patchLoft();

const LEAN =
	'SLENDER athletic young adult woman: slim waist, lean hips, long legs, NOT plump, NOT thick, NOT chubby, NOT fat, NOT heavy thighs.';
const WELL =
	'SAME Jolbon well: round granite rim, timber T-beam, hemp rope, two buckets on packed earth, grey giwa hall in bokeh. Nobody in the shaft.';

const newSlots = [
	{
		id: 'nsfw-jumong-sosuno-haunt-face',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'His face first',
		alt: 'Loft thought: Jumong’s clean-shaven face fills Sosuno’s head — easy grin, red rim',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt: `Intimate cinematic 16:9. Manhwa panel, erotic comic framing. CINEMATOGRAPHY: ECU split — Sosuno’s flushed wanting face left; a thought-bubble RIGHT with ONE Jumong CLEAN-SHAVEN easy grin filling it, red #e8563f, FACE from attached — ignore portrait mustache. She is angry and wet. Dusty-rose collar, bird binyeo. Timber loft bokeh. ONE of each. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'nsfw-jumong-sosuno-haunt-back',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: true,
		at: 'his bare back',
		alt: 'Loft haunt: Jumong’s bare back as a red smear in Sosuno’s head; her bitten mouth in the foreground',
		people: ['sosuno', 'jumong'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/ch_jumong.png'],
		prompt: `Intimate cinematic 16:9. OTS Sosuno in loft — bitten mouth, heavy blush, bird binyeo, dusty-rose. Midground thought: ONE Jumong bare muscular BACK as a red #e8563f plane, clean-shaven head suggestion, millet-yard bokeh. She is haunted into heat. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'nsfw-jumong-sosuno-haunt-smile',
		ratio: 1.778,
		tone: '#e8563f',
		nsfw: true,
		at: 'He haunts her into heat.',
		alt: 'ECU Jumong well-smile haunting Sosuno — clean-shaven, too easy, red silk',
		people: ['jumong', 'sosuno'],
		refs: ['/ch_jumong.png', '/ch_sosuno.png'],
		prompt: `Intimate cinematic ECU 16:9. ONE Jumong CLEAN-SHAVEN well-grin filling the frame, red #e8563f silk, FACE from attached — ignore mustache. Soft loft/void bokeh as if inside her head. Easy sun-smile that makes her mad. Sosuno a dusty-rose #e8a04a smear at the edge only. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'nsfw-jumong-sosuno-scold-after',
		ratio: 1.778,
		tone: '#e8a04a',
		nsfw: true,
		at: 'She scolds the heat that used his face.',
		alt: 'Aftermath ECU: Sosuno spent then furious, hiked dusty-rose, scolding herself',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt: `Intimate cinematic ECU 16:9. ONE Sosuno after climax: spent then furious, messy hair, hiked dusty-rose, heavy blush, glare, bitten mouth, sweat — scolding herself, not serene. FACE from attached worker portrait, bird binyeo. Timber loft creamy bokeh. #e8a04a rim. Manhwa aftermath. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-daughter-teal-lean-hike',
		ratio: 1.778,
		tone: '#2aa89a',
		nsfw: true,
		at: 'Teal hikes at his well',
		alt: 'Lean teal daughter hikes chima at the well, look-back aegyo — slim waist',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt: `Intimate cinematic CLOSE 16:9. ${WELL} ONE anonymous adult teal-silk Jolbon daughter: ${LEAN} look-back aegyo, hiked chima showing lean hip and thigh, flush, wanting. Jumong CLEAN-SHAVEN red #e8563f grin at the rim if visible. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-daughter-saffron-lean-dare',
		ratio: 1.778,
		tone: '#d4a017',
		nsfw: true,
		at: 'She hikes it like a dare',
		alt: 'Lean saffron daughter OTS hike at the well — slim, look-back dare',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt: `Intimate cinematic CLOSE 16:9 OTS hike. ${WELL} ONE anonymous adult saffron/yellow-jeogori Jolbon daughter: ${LEAN} looking back, chima hiked like a dare, lean hips not plump. Jumong CLEAN-SHAVEN red grin at the well. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-daughter-plum-lean-invite',
		ratio: 1.778,
		tone: '#c4a06a',
		nsfw: true,
		at: 'Don’t look at Sosuno. Look at me.',
		alt: 'Lean plum daughter ECU invite at the well — soft mouth, slim shoulders',
		people: [],
		refs: ['/temp/jumong-set-well-day-empty.jpg'],
		prompt: `Intimate cinematic ECU 16:9. ${WELL} ONE anonymous adult plum-silk Jolbon daughter filling the frame: ${LEAN} soft invite mouth, flush, finger to cheek, wanting aegyo — not Sosuno, not plump. Adult only. No text. No watermark. ${SUFFIX}`
	},
	{
		id: 'jumong-daughter-teal-lean-ass',
		ratio: 1.778,
		tone: '#2aa89a',
		nsfw: true,
		at: 'Ass first onto him',
		alt: 'Lean teal backs onto Jumong’s thigh at the well — slim, look-back',
		people: ['jumong'],
		refs: ['/ch_jumong.png', '/temp/jumong-set-well-day-empty.jpg'],
		prompt: `Intimate cinematic CLOSE 16:9 two-shot. ${WELL} ONE anonymous adult teal daughter: ${LEAN} backs her lean hip onto his thigh, look-back aegyo, hiked teal silk. ONE Jumong CLEAN-SHAVEN easy grin, red #e8563f. Adult only. No plump. No text. No watermark. ${SUFFIX}`
	}
];

const have = new Set(jumong.images.map((i) => i.id));
const added = [];
for (const s of newSlots) {
	if (have.has(s.id)) continue;
	jumong.images.push(s);
	have.add(s.id);
	added.push(s.id);
}

// Remake prompts on fat-leaning existing daughter slots (install will overwrite art)
for (const id of [
	'jumong-daughter-teal-ass-back',
	'jumong-daughter-saffron-lookback-hike',
	'jumong-seq-daughters-hike',
	'jumong-daughter-saffron-ass-back',
	'jumong-daughter-plum-ass-back'
]) {
	const im = jumong.images.find((i) => i.id === id);
	if (!im) continue;
	im.prompt = `${im.prompt || ''} ${LEAN} Remake lean body.`.trim();
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

const people = JSON.parse(fs.readFileSync(PEOPLE, 'utf8'));
for (const s of newSlots) people[s.id] = s.people;
fs.writeFileSync(PEOPLE, JSON.stringify(people, null, '\t') + '\n');

let seq = fs.readFileSync(SEQ, 'utf8');
const inserts = [
	{
		after: "{ id: 'nsfw-jumong-sosuno-loft-idiot-ecu', role: 'idiot tsun ECU', angle: 'ECU glare', at: 'Idiot. Don’t grin in my head' }",
		lines: [
			"{ id: 'nsfw-jumong-sosuno-haunt-face', role: 'haunt face', angle: 'thought ECU', at: 'His face first' }",
			"{ id: 'nsfw-jumong-sosuno-haunt-back', role: 'haunt back', angle: 'OTS thought', at: 'his bare back' }",
			"{ id: 'nsfw-jumong-sosuno-haunt-smile', role: 'haunt smile', angle: 'ECU grin haunt', at: 'He haunts her into heat.' }"
		]
	},
	{
		after: "{ id: 'nsfw-jumong-sosuno-loft-want-climax', role: 'wanting climax', angle: 'ECU wrecked', at: 'She comes on the timber' }",
		lines: [
			"{ id: 'nsfw-jumong-sosuno-scold-after', role: 'scolds the heat', angle: 'ECU aftermath', at: 'She scolds the heat that used his face.' }"
		]
	},
	{
		after: "{ id: 'jumong-daughter-teal-aegyo-ecu', role: 'teal aegyo ECU', angle: 'ECU look-back', at: 'Aegyo look-back' }",
		lines: [
			"{ id: 'jumong-daughter-teal-lean-hike', role: 'lean teal hike', angle: 'intimate dutch', at: 'Teal hikes at his well' }",
			"{ id: 'jumong-daughter-saffron-lean-dare', role: 'lean saffron dare', angle: 'OTS hike', at: 'She hikes it like a dare' }",
			"{ id: 'jumong-daughter-plum-lean-invite', role: 'lean plum invite', angle: 'ECU', at: 'Don’t look at Sosuno. Look at me.' }",
			"{ id: 'jumong-daughter-teal-lean-ass', role: 'lean teal ass-back', angle: 'two-shot', at: 'Ass first onto him' }"
		]
	}
];

function insertAfter(src, after, lines) {
	if (src.includes(lines[0])) return src;
	if (!src.includes(after)) {
		console.warn('seq anchor missing', after.slice(0, 80));
		return src;
	}
	return src.split(after).join(`${after},\n\t\t\t${lines.join(',\n\t\t\t')}`);
}
for (const b of inserts) seq = insertAfter(seq, b.after, b.lines);
fs.writeFileSync(SEQ, seq);

const remakeIds = [
	'jumong-daughter-teal-ass-back',
	'jumong-daughter-saffron-lookback-hike',
	'jumong-seq-daughters-hike'
];
const manifest = [
	...newSlots.map(({ id, alt, prompt }) => ({ id, alt, prompt })),
	...remakeIds.map((id) => {
		const im = jumong.images.find((i) => i.id === id);
		return { id, alt: im.alt, prompt: im.prompt };
	})
];
fs.writeFileSync(
	path.join(ROOT, 'scripts/.cache/daughters-haunt-flirt-install.json'),
	JSON.stringify(manifest, null, '\t') + '\n'
);

console.log(JSON.stringify({ added, remake: remakeIds }, null, 2));
