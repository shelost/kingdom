/**
 * Lift Jumong out of The Seventh Invasion / Ansi, give it its own founding
 * chapter, rewrite Tabal’s execution + first-task Jolbon talk, and add stills.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const TOC = path.join(ROOT, 'src/lib/tocTree.ts');
const SEQ = path.join(ROOT, 'src/lib/movieSequences.ts');

const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const inv = story.find((c) => c.id === 'seventh-invasion');
if (!inv) throw new Error('seventh-invasion missing');
const ji = inv.entries.findIndex((e) => e.title === 'Jumong');
if (ji < 0) throw new Error('Jumong entry not under seventh-invasion');
const jumong = inv.entries[ji];
inv.entries.splice(ji, 1);

/* Own story — not a Tang-war flashback. */
delete jumong.flash;
delete jumong.flashback;
delete jumong.flashTone;
jumong.year = '-37';
jumong.tone = 'founder fairy tale';
jumong.toneNote =
	'Amnok to Jolbon as its own chronicle: sun-road, egg, Buyeo yard, Tabal’s hall, first tasks, five tribes.';

if (!jumong.blocks.some((b) => b.kind === 'scene' && /Amnok|압록/.test(b.label))) {
	jumong.blocks.unshift({
		kind: 'scene',
		label: 'The Amnok',
		ko: '압록'
	});
}

function findBlock(pred, label) {
	const i = jumong.blocks.findIndex(pred);
	if (i < 0) throw new Error('block not found: ' + (label || 'anon'));
	return i;
}

function replaceRange(startPred, endPred, next, labels = {}) {
	const a = findBlock(startPred, labels.start);
	const b = findBlock(endPred, labels.end);
	if (b < a) throw new Error('bad range');
	jumong.blocks.splice(a, b - a + 1, ...next);
}

/* ————— Tabal hall: guards close to kill; bow; slave under Sosuno ————— */
replaceRange(
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'yeontabal' &&
		(b.en || []).some((l) => l.includes("If you won't talk") || l.includes('If you won’t talk')),
	(b) =>
		b.kind === 'dialogue' &&
		b.person === 'jumong' &&
		(b.en || []).some((l) => l.startsWith('Shed.')),
	[
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: ['Alright.', "If you won't talk, we're just going to have to kill you.", 'Do it.'],
			lines: ['됐다.', '말 안 하면 죽인다.', '해.']
		},
		{
			kind: 'p',
			html: 'The two hall men do not wait for a second snap. Spear-points come in from both sides — close enough that Jumong can see the grain in the wood. Knees still in the packed earth. Wrists still behind. <b>The points close.</b>',
			ko: '두 번째 손가락은 기다리지 않는다. 창끝이 양쪽에서 들어온다 — 나무결이 보일 만큼. 무릎은 아직 다진 흙. 손목은 아직 뒤로. <b>창끝이 붙는다.</b>'
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: ['Wait— wait.', 'I can— I can talk. I—', 'Father…'],
			lines: ['잠깐— 잠깐요.', '말할게요. 말—', '아버지…']
		},
		{
			kind: 'p',
			html: 'One point finds the hollow of his throat. The other sits over the heart. He stops grinning. The hall watches the way a hall watches a pig. On the porch Sosuno’s chin does not drop — only the count-stick goes still. <b>So this is how I die.</b>',
			ko: '한쪽은 목 움푹한 데. 한쪽은 심장 위. 웃음이 멈춘다. 대청은 돼지를 볼 때처럼 본다. 누대에서 소서노의 턱은 안 내려간다 — 셈막대만 멈춘다. <b>이렇게 죽는구나.</b>'
		},
		{
			kind: 'dialogue',
			person: 'sosuno',
			chip: '#e8a04a',
			en: ['…Father.', 'You said talk first.'],
			lines: ['…아버지.', '말은 먼저 듣잔 거였잖아요.']
		},
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: ['He had his chance.', "Don't look if you don't like it."],
			lines: ['기회는 줬다.', '보기 싫으면 보지 마.']
		},
		{
			kind: 'p',
			html: 'Tabal is not even looking at the points. His eyes have gone to the bow they dumped by his foot — the one they took off the wet stranger. He picks it up the way a man picks up a tool he already knows. <b>He notices the bow.</b>',
			ko: '연타발은 창끝은 보지도 않는다. 눈이 발치 활로 간다 — 젖은 놈에게서 빼앗은 것. 이미 아는 연장을 집듯이 집는다. <b>활을 본다.</b>'
		},
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: ['Hold.', 'Not yet.', 'This first.'],
			lines: ['멈춰.', '아직.', '이거 먼저.']
		},
		{
			kind: 'p',
			html: 'He sets his feet. Both hands. Back into it the way he puts his back into a boar. The limb does not come. He tries again — shoulders, jaw, a sound that is not a word. <b>He cannot pull the string.</b> The wood stays as it was.',
			ko: '발을 딛는다. 두 손. 멧돼지 잡을 때처럼 허리를 넣는다. 활대가 안 온다. 다시 — 어깨, 턱, 말이 아닌 소리. <b>시위가 안 당겨진다.</b> 나무는 그대로다.'
		},
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: ['…What.', 'Come here. You. Pull it.', 'I said pull it.'],
			lines: ['…뭐야.', '와. 너. 당겨 봐.', '당기라니까.']
		},
		{
			kind: 'p',
			html: 'A hall man puts his whole weight on the same string. Nothing. Tabal takes it back, stares at the wet stranger as if the boy had hidden a trick in the wood. Suspicious now. A man who cannot name a sender and carries a bow the valley cannot bend. <b>This strong stranger.</b>',
			ko: '대청 사내가 같은 시위에 몸무게를 다 싣는다. 그대로다. 연타발이 다시 받아, 젖은 놈을 본다. 나무에 뭘 숨긴 것처럼. 이제 의심이다. 보낸 사람은 못 대고, 이 골짜기가 못 당기는 활을 들고 온 놈. <b>힘센 낯선 놈.</b>'
		},
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: ['Stop!', 'Points down. I said down.', '…Boy. Who did you say you were again.', 'That bow does not bend for me. Talk.'],
			lines: ['멈춰!', '창 내려. 내리라니까.', '…야. 네가 누구라고 했냐.', '이 활은 내가 못 당겨. 말해.']
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: ['I am Jumong.', 'Son of Haemosu — the sun god — and Yuhwa, daughter of the river god Habek.'],
			lines: ['주몽입니다.', '해모수의 아들 — 태양신 — 그리고 유화, 하백의 딸의 아들입니다.']
		},
		{
			kind: 'dialogue',
			person: 'yeontabal',
			chip: '#a97c4a',
			en: [
				'…So a delusional madman.',
				'Fine.',
				"You're not dying on my dirt tonight.",
				"You're a slave. My daughter's. She counts. You lift.",
				'Look at her wrong, I finish what they started.'
			],
			lines: [
				'…미친놈이로군.',
				'됐다.',
				'오늘 밤 내 흙에서 안 죽어.',
				'노예다. 내 딸 밑으로. 걔가 세고. 네가 들어.',
				'그 애 잘못 보면 아까 거 이어서 한다.'
			]
		},
		{
			kind: 'dialogue',
			person: 'jumong',
			chip: '#e8563f',
			en: ['Slave. Your daughter. I— okay.', "I wasn't going to look."],
			lines: ['노예. 따님. 알— 알겠어요.', '안 볼 거였어요.']
		}
	],
	{ start: 'tabal-kill', end: 'jumong-shed' }
);

/* ————— First morning: he keeps asking about Jolbon ————— */
const firstMorning = findBlock((b) => b.kind === 'scene' && b.label === 'First Morning');
const otherDaughters = findBlock((b) => b.kind === 'scene' && b.label === 'Other Daughters');
const morning = jumong.blocks.slice(firstMorning, otherDaughters);
const afterGrin = morning.findIndex(
	(b) => b.kind === 'p' && /dumps a bucket|Don't grin at the work|Don’t grin at the work/.test(b.html || '')
);

const jolbonTalk = [
	{
		kind: 'p',
		html: 'He cannot leave a question in his mouth. Between sacks he asks about the roofs. She is annoyed first — the stick ticks harder. Then, one thing at a time, she gives him the valley. <b>He keeps asking about Jolbon.</b>',
		ko: '질문은 입에 남겨 두지 못한다. 가마니 사이에 지붕을 묻는다. 처음엔 짜증이다 — 막대가 더 세게 틱. 그다음, 하나씩, 골짜기를 준다. <b>졸본을 자꾸 묻는다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['So this valley—', 'How many roofs. I counted four from the shed but—'],
		lines: ['이 골짜기—', '지붕이 몇 개야. 헛간에선 네 갠데—']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Five.', 'Work. Not a tour.', 'West line. I said west.'],
		lines: ['다섯.', '일. 관광 아니야.', '서쪽. 서쪽이라니까.']
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Five. Okay. Yours is the big one, right.', "Your father. He's— the hall."],
		lines: ['다섯. 알겠어. 큰 집이 너희 집이지.', '네 아버지. 그 대청.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['Crow.', 'Obviously.', 'Do the millet.'],
		lines: ['까마귀.', '당연한 거.', '기장이나 해.']
	},
	{
		kind: 'p',
		html: 'Crow. She says it like a count, not a lesson. He hauls. He asks again at the ditch, mud to the knee. <b>Tiger is on his side.</b>',
		ko: '까마귀. 수업이 아니라 셈처럼 말한다. 든다. 도랑에서 또 묻는다, 진흙이 무릎. <b>호랑이는 그 편이다.</b>'
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['Crow. And the others.', 'Do they just— sit there.', "Or is somebody with him."],
		lines: ['까마귀. 나머지는.', '그냥— 앉아 있어.', '아니면 누구 한 쪽이야.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: [
			'Tiger’s with him.',
			'That’s it.',
			'Bear, wolf, boar — they can’t agree.',
			'They cut each other over a ditch and then pretend it was the weather.',
			'That’s the whole country. Now lift.'
		],
		lines: [
			'호랑이는 우리 편.',
			'그거뿐이야.',
			'곰, 늑대, 멧돼지 — 합의를 못 해.',
			'도랑 가지고 서로 베고선 날씨 탓을 해.',
			'나라가 그거야. 들어.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jumong',
		chip: '#e8563f',
		en: ['…Huh.', 'So you just live like that.', 'I crossed a river on turtles. You fight over mud.'],
		lines: ['…허.', '그렇게 사는 거야.', '난 자라 타고 강을 건넜는데. 너희는 진흙 가지고 싸워.']
	},
	{
		kind: 'dialogue',
		person: 'sosuno',
		chip: '#e8a04a',
		en: ['I didn’t ask you to grade it.', 'Slave. Lift.', '…Don’t grin. I’m not explaining again.'],
		lines: ['채점하래? 안 했어.', '노예. 들어.', '…웃지 마. 다시 안 설명해.']
	}
];

if (afterGrin >= 0) {
	jumong.blocks.splice(firstMorning + afterGrin + 1, 0, ...jolbonTalk);
} else {
	jumong.blocks.splice(otherDaughters, 0, ...jolbonTalk);
}

/* ————— New stills ————— */
const houseLock =
	' LOCK: night Tabal hall = torch pools, crushed blacks, timber posts, packed earth, grey giwa. Jumong CLEAN-SHAVEN, red #e8563f, FACE ch_jumong. Tabal FACE ch_yeon_tabal. Sosuno dusty-rose #e8a04a FACE ch_sosuno + bn_sosuno. Guards anonymous — no invented celebrity faces. One of each named person.';

const newSlots = [
	{
		id: 'tabal-guards-close-wide',
		ratio: 1.778,
		tone: '#a97c4a',
		at: 'The points close.',
		alt: 'Bird’s-eye torch hall: two spear-guards closing on kneeling bound Jumong; Tabal a dark mass at the bow',
		refs: ['/ch_jumong.png', '/ch_yeon_tabal.png', '/pl_jolbon.png'],
		people: ['jumong', 'yeontabal']
	},
	{
		id: 'tabal-guards-spear-throat',
		ratio: 1.778,
		tone: '#e8563f',
		at: 'The points close.',
		alt: 'Dutch close: spear-point at Jumong’s throat, wrists bound, scared clean-shaven face',
		refs: ['/ch_jumong.png'],
		people: ['jumong']
	},
	{
		id: 'jumong-kill-react-ecu',
		ratio: 0.75,
		tone: '#e8563f',
		at: 'So this is how I die.',
		alt: 'ECU Jumong: grin gone, eyes wide, torch on a clean-shaven scared face',
		refs: ['/ch_jumong.png'],
		people: ['jumong']
	},
	{
		id: 'sosuno-porch-kill-ecu',
		ratio: 0.75,
		tone: '#e8a04a',
		at: 'You said talk first.',
		alt: 'ECU Sosuno on the porch: chin still up, count-stick frozen, eyes on the points',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		people: ['sosuno']
	},
	{
		id: 'tabal-bow-notice',
		ratio: 1.778,
		tone: '#a97c4a',
		at: 'He notices the bow.',
		alt: 'OTS Tabal: looking down at Jumong’s bow on packed earth, torch rim, points still at the boy',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'tabal-bow-all-strength',
		ratio: 1.778,
		tone: '#a97c4a',
		at: 'He cannot pull the string.',
		alt: 'Worm’s-eye: Tabal both hands on the bow, back and jaw straining, string unmoved',
		refs: ['/ch_yeon_tabal.png'],
		people: ['yeontabal']
	},
	{
		id: 'tabal-bow-fail-ecu',
		ratio: 0.75,
		tone: '#a97c4a',
		at: 'This strong stranger.',
		alt: 'ECU Tabal: suspicious, sweat, staring at the wet stranger past the unbent limb',
		refs: ['/ch_yeon_tabal.png'],
		people: ['yeontabal']
	},
	{
		id: 'tabal-stop-points-down',
		ratio: 1.778,
		tone: '#a97c4a',
		at: 'Points down. I said down.',
		alt: 'Dutch: Tabal’s hand cutting the air; two spear-points dropping; Jumong still on his knees',
		refs: ['/ch_yeon_tabal.png', '/ch_jumong.png'],
		people: ['yeontabal', 'jumong']
	},
	{
		id: 'tabal-slave-assign',
		ratio: 1.778,
		tone: '#e8a04a',
		at: "You're a slave. My daughter's.",
		alt: 'Dutch porch: Tabal pointing Sosuno; Jumong still bound on dirt; she does not look grateful',
		refs: ['/ch_yeon_tabal.png', '/ch_sosuno.png', '/ch_jumong.png', '/bn_sosuno.png'],
		people: ['yeontabal', 'sosuno', 'jumong']
	},
	{
		id: 'sosuno-not-a-tour',
		ratio: 1.778,
		tone: '#e8a04a',
		at: 'Work. Not a tour.',
		alt: 'Dutch grain porch: Sosuno chin down at the stick, Jumong mid-question with a sack',
		refs: ['/ch_sosuno.png', '/ch_jumong.png', '/bn_sosuno.png', '/pl_jolbon.png'],
		people: ['sosuno', 'jumong']
	},
	{
		id: 'sosuno-crow-obviously',
		ratio: 1.778,
		tone: '#e8a04a',
		at: 'Crow.',
		alt: 'OTS millet: Sosuno pointing west, not looking at him, dusty-rose sleeve',
		refs: ['/ch_sosuno.png', '/bn_sosuno.png', '/pl_jolbon.png'],
		people: ['sosuno']
	},
	{
		id: 'sosuno-tiger-side',
		ratio: 1.778,
		tone: '#e8a04a',
		at: "Tiger's with him.",
		alt: 'Worm’s-eye ditch: Sosuno explaining one thing, Jumong mud to the knee, listening',
		refs: ['/ch_sosuno.png', '/ch_jumong.png', '/bn_sosuno.png'],
		people: ['sosuno', 'jumong']
	},
	{
		id: 'sosuno-infight-lift',
		ratio: 1.778,
		tone: '#e8a04a',
		at: "That's the whole country. Now lift.",
		alt: 'Dutch two-shot: she cuts the lesson off with a finger at the sack; he almost grins',
		refs: ['/ch_sosuno.png', '/ch_jumong.png', '/bn_sosuno.png'],
		people: ['sosuno', 'jumong']
	}
];

const existing = new Set(jumong.images.map((im) => im.id));
for (const slot of newSlots) {
	if (existing.has(slot.id)) continue;
	jumong.images.push({
		...slot,
		prompt: `Minimal iconic ${slot.ratio > 1 ? '16:9' : '3:4'} still.${houseLock} ${slot.alt} HIGH CONTRAST torch chiaroscuro. No army catalog. No text. No watermark.`
	});
}

/* Yuhwa: Buyeo = yellow court hanbok (not river ice-blue silk). */
const buyeoYuhwa =
	/(buyeo|hatch|egg|yard|door|warning|mother|geumwa|brothers|mark|hunt)/i;
for (const im of jumong.images) {
	const blob = `${im.id} ${im.at || ''} ${im.alt || ''} ${im.prompt || ''}`;
	if (!/yuhwa/i.test(blob)) continue;
	if (/amnok|ubal|shallows|bath|copper|chariot|haemosu|habek|mist/i.test(blob) && !buyeoYuhwa.test(blob)) {
		continue;
	}
	if (!buyeoYuhwa.test(blob) && !/yuhwa-(sunshaft|leave|warning)/i.test(im.id)) continue;
	im.prompt = `${im.prompt || ''} BUYEO DRESS: Lady Yuhwa wears warm millet-yellow court hanbok (jeogori + chima), not the portrait’s ice-blue river silk. FACE and binyeo from attached refs. Ice-blue #8fc4e0 only as a thin rim, never the garment.`;
	if (im.alt && !/yellow/i.test(im.alt)) im.alt = im.alt.replace(/ice-blue|blue sleeve|blue silk/gi, 'yellow');
}

/* Haemosu: dragons PULL the chariot from the FRONT. */
for (const im of jumong.images) {
	const blob = `${im.id} ${im.at || ''} ${im.alt || ''} ${im.prompt || ''}`;
	if (!/haemosu|chariot/i.test(blob)) continue;
	if (!/chariot|sky-|five-dragon|rail|usual-run|lookdown/i.test(blob)) continue;
	im.prompt = `${im.prompt || ''} CHARIOT LOCK: five PLAYFUL dragons PULL the gold wheeled sun-chariot FROM THE FRONT — traces and yoke ahead of the rail, not coiled on the floor, not sitting on the wheels. Same two spoked wheels, open floor, curved rail.`;
}

/* New founding chapter at the front of the book. */
if (story.some((c) => c.id === 'jumong')) {
	throw new Error('jumong chapter already exists');
}
story.unshift({
	id: 'jumong',
	part: 'The Founding',
	partTitle: 'The Founding',
	partKorean: '건국',
	partHanja: '建國',
	title: 'Jumong',
	korean: '주몽',
	hanja: '朱蒙',
	range: '–37',
	tone: 'founder fairy tale',
	toneNote: 'The sun-road, the egg, Buyeo, the crossing, Tabal’s hall, Jolbon.',
	entries: [jumong]
});

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');

/* TOC: Jumong is no longer a child of Ansi. */
let toc = fs.readFileSync(TOC, 'utf8');
toc = toc.replace(
	`\t\t{\n\t\t\tparent: 'Ansi',\n\t\t\tchildren: [{ title: 'Jumong' }]\n\t\t}\n`,
	''
);
if (!toc.includes("'jumong':")) {
	toc = toc.replace(
		'export const CHAPTER_NESTS: Record<string, NestSpec[]> = {\n',
		`export const CHAPTER_NESTS: Record<string, NestSpec[]> = {\n\tjumong: [],\n`
	);
}
fs.writeFileSync(TOC, toc);

/* Sequences still key off the Jumong title. */
const seq = fs.readFileSync(SEQ, 'utf8');
if (!seq.includes("entryTitles: ['Jumong']") && !seq.includes('entryTitles: ["Jumong"]')) {
	/* already mixed; leave */
}
console.log(
	JSON.stringify(
		{
			chapter: 'jumong',
			blocks: jumong.blocks.length,
			images: jumong.images.length,
			newSlots: newSlots.map((s) => s.id),
			invasionLeft: inv.entries.map((e) => e.title)
		},
		null,
		2
	)
);
