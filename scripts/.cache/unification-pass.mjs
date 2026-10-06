#!/usr/bin/env node
/**
 * One-shot story pass from the Namu Wiki 삼국통일전쟁 comparison:
 * the Tang promise, the Red Fowl, the Bear Ford commandery, Mount Gain,
 * the Xue Rengui ↔ Munmu letters, traitor seeds, dead-speaker fixes.
 *
 * Blocks are found by text, never by index. Image anchors are snapshotted
 * (image → matched block object) before any edit and re-checked after.
 *
 *   node scripts/.cache/unification-pass.mjs          # apply
 *   node scripts/.cache/unification-pass.mjs --dry    # validate only
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const STORY = path.join(ROOT, 'src/lib/data/story.json');
const BACKUP = path.join(ROOT, 'scripts/.cache/prev-stills/story.pre-unification-pass.json');
const DRY = process.argv.includes('--dry');

const raw = fs.readFileSync(STORY, 'utf8');
const story = JSON.parse(raw);
if (raw.includes('"title": "Mount Gain"') || raw.includes('"title":"Mount Gain"')) {
	console.log('unification pass already applied');
	process.exit(0);
}

/* ---------------------------------------------------------------- helpers */

function textOf(b) {
	switch (b.kind) {
		case 'p':
		case 'cite':
		case 'moral':
		case 'monologue':
		case 'quote':
			return b.html + ' ' + (b.ko ?? '');
		case 'dialogue':
			return [...b.lines, ...(b.en ?? [])].join(' ');
		case 'verse':
			return b.lines.join(' ');
		case 'hanja':
			return b.chars.map((c) => c.char + c.gloss).join(' ') + ' ' + (b.after ?? '');
		case 'flashback':
			return (b.title ?? '') + ' ' + (b.year ?? '') + ' ' + b.blocks.map(textOf).join(' ');
		case 'table':
			return [...b.head, ...b.rows.flat()].join(' ');
		case 'diagram':
			return [b.title, b.caption, b.ko].filter(Boolean).join(' ');
		case 'day':
		case 'scene':
			return [b.label, b.ko].filter(Boolean).join(' ');
		case 'formation':
			return [b.title, b.note].filter(Boolean).join(' ');
		default:
			return '';
	}
}

const allEntries = () => story.flatMap((c) => c.entries);
const E = (title) => {
	const e = allEntries().find((x) => x.title === title);
	if (!e) throw new Error(`no entry “${title}”`);
	return e;
};
const chapterOf = (entry) => story.find((c) => c.entries.includes(entry));

function find(e, needle) {
	const hits = e.blocks.flatMap((b, i) => (textOf(b).includes(needle) ? [i] : []));
	if (!hits.length) throw new Error(`[${e.title}] block not found: ${needle}`);
	if (hits.length > 1) console.warn(`  ! [${e.title}] ${hits.length} blocks match “${needle}”, using first`);
	return hits[0];
}
const blk = (e, needle) => e.blocks[find(e, needle)];
const insertAfter = (e, needle, ...bs) => e.blocks.splice(find(e, needle) + 1, 0, ...bs);
const insertBefore = (e, needle, ...bs) => e.blocks.splice(find(e, needle), 0, ...bs);
const take = (e, needle) => e.blocks.splice(find(e, needle), 1)[0];

function swap(b, field, from, to) {
	if (typeof b[field] !== 'string' || !b[field].includes(from))
		throw new Error(`swap: “${from}” not in ${field} of ${textOf(b).slice(0, 60)}`);
	b[field] = b[field].replace(from, to);
}

function moveImages(from, to, ids) {
	for (const id of ids) {
		const i = from.images.findIndex((m) => m.id === id);
		if (i < 0) throw new Error(`[${from.title}] no image ${id}`);
		to.images.push(from.images.splice(i, 1)[0]);
	}
}
const img = (e, id) => {
	const m = e.images.find((x) => x.id === id);
	if (!m) throw new Error(`[${e.title}] no image ${id}`);
	return m;
};

/** Dominant chip per person already in the story, else the people.ts COLOR table. */
const CHIP = (() => {
	const tally = {};
	const walk = (bs) =>
		bs.forEach((b) => {
			if (b.kind === 'flashback') return walk(b.blocks);
			if (b.kind === 'dialogue' && b.person && b.chip) {
				tally[b.person] ??= {};
				tally[b.person][b.chip] = (tally[b.person][b.chip] ?? 0) + 1;
			}
		});
	allEntries().forEach((e) => walk(e.blocks));
	const out = {};
	for (const [id, t] of Object.entries(tally)) out[id] = Object.entries(t).sort((a, b) => b[1] - a[1])[0][0];
	const people = fs.readFileSync(path.join(ROOT, 'src/lib/people.ts'), 'utf8');
	const table = people.slice(people.indexOf('const COLOR: Record<string, string> = {'));
	for (const m of table.slice(0, table.indexOf('\n};')).matchAll(/^\t(\w+): '(#[0-9a-fA-F]{3,8})'/gm))
		out[m[1]] ??= m[2];
	Object.assign(out, { kotoku: '#e89ab0', daeto: '#8a8f9e', kimpunghun: '#7a8fb0' });
	return out;
})();
const chipOf = (person) => {
	if (!CHIP[person]) throw new Error(`no chip for ${person}`);
	return CHIP[person];
};

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const q = (hanja, html, ko, source) => ({ kind: 'quote', hanja, html, ko, source });
const d = (person, en, ko, extra = {}) => ({ kind: 'dialogue', chip: chipOf(person), person, lines: ko, en, ...extra });
const sp = (speaker, chip, en, ko, extra = {}) => ({ kind: 'dialogue', chip, speaker, lines: ko, en, ...extra });
const zh = (zhLines, zhLatn) => ({ zh: zhLines, zhLatn });
const ja = (jaLines, jaLatn) => ({ ja: jaLines, jaLatn });
const TANG = '#b45309';

/* ------------------------------------------------- anchor snapshot (before) */

function anchorMap() {
	const map = new Map();
	for (const e of allEntries())
		for (const im of e.images ?? []) {
			if (!im.at) continue;
			const needle = im.at.trim().toLowerCase();
			map.set(im, e.blocks.find((b) => textOf(b).toLowerCase().includes(needle)) ?? null);
		}
	return map;
}
const before = anchorMap();
const retargeted = new Set();
const setAt = (im, at) => {
	im.at = at;
	retargeted.add(im);
};

/* ============================================================ 643 · West */
{
	const e = E('Emperor of the West');
	e.blocks.push(
		scene('The Third Leg', '세 번째 다리'),
		p(
			'In the third month an envoy arrives from Pyongyang with a request nobody in the Ministry of Rites has seen before. The new master of Goguryeo would like some Daoists.',
			'삼월, 평양에서 사신이 온다. 예부의 누구도 본 적 없는 청을 들고. 고구려의 새 주인이 도사를 좀 보내 달라는 것이다.'
		),
		sp(
			'Goguryeo envoy',
			'#d0362f',
			[
				'The Mangniji says a cauldron stands on three legs.',
				'We have the Buddha. We have Confucius.',
				'He would like the third leg, if the Son of Heaven can spare one.'
			],
			['막리지께서 이르시길, 솥은 다리 셋으로 선다 하셨습니다.', '부처도 있고, 공자도 있습니다.', '천자께서 하나 내어 주실 수 있다면, 셋째 다리를 청하신답니다.'],
			zh(
				['莫離支言：三教譬如鼎足，闕一不可。', '今有佛，有儒。', '唯闕道教，乞天子賜之。'],
				['Mòlízhī yán: sān jiào pìrú dǐng zú, quē yī bù kě.', 'Jīn yǒu fó, yǒu rú.', 'Wéi quē dàojiào, qǐ tiānzǐ cì zhī.']
			)
		),
		d(
			'taizong',
			['He wants Laozi?', 'Give him Laozi. Our house descends from the old man anyway. Let Goguryeo bow to my ancestor and call it theology.'],
			['노자를 달라고?', '줘라. 어차피 우리 집안이 그 노인네 후손이다. 고구려가 짐의 조상한테 절하면서 그걸 도라고 부르게 두어라.'],
			zh(
				['他要老子？', '給他老子。朕家本是老君之後。讓高麗拜朕的祖宗，還叫它作道。'],
				['Tā yào Lǎozǐ?', 'Gěi tā Lǎozǐ. Zhèn jiā běn shì Lǎojūn zhī hòu. Ràng Gāolí bài zhèn de zǔzōng, hái jiào tā zuò dào.']
			)
		),
		p(
			'Eight Daoists go east with a copy of the <i>Daodejing</i>. In Pyongyang the Mangniji gives them lodgings, and the lodgings he gives them are temples. The monks are moved out the same week, with their bells.',
			'도사 여덟이 도덕경 한 질을 들고 동쪽으로 간다. 평양에서 막리지는 그들에게 숙소를 내주는데, 내준 숙소가 절이다. 같은 주에 승려들이 쫓겨난다. 종까지 들려서.'
		),
		p(
			'A young monk named <b>Shinsung</b> carries the smallest bell down the hill himself, to a lesser house that has no frame to hang it from, and sets it on the floor. He does not complain to anyone. The bell stays on the floor for twenty-five years.',
			'<b>신성</b>이라는 젊은 승려가 제일 작은 종을 손수 지고 언덕을 내려가, 종 걸 틀도 없는 작은 절에 바닥에 내려놓는다. 아무에게도 불평하지 않는다. 종은 이십오 년 동안 바닥에 놓여 있다.'
		),
		scene('Three Choices', '세 가지 안'),
		p(
			'In the ninth month an envoy comes from Silla, which is losing fortresses to Baekje faster than it can count them, and asks for an army. The Second Emperor offers him a choice of three.',
			'구월, 신라에서 사신이 온다. 백제에게 성을 세는 것보다 빨리 잃고 있는 나라다. 군대를 청한다. 황제는 세 가지 중에 고르라 한다.'
		),
		d(
			'taizong',
			[
				'One. I send the Khitan and the Mohe into Liaodong, and Goguryeo looks north for a year.',
				'Two. I give you a few thousand red coats and Tang banners. Stand them on your walls. Baekje will think I have come, and run.',
				'Three.'
			],
			['하나. 거란과 말갈을 요동에 풀어, 고구려가 한 해 동안 북쪽만 보게 하겠다.', '둘. 붉은 군복 몇천 벌과 당의 깃발을 주겠다. 성벽에 세워 두어라. 백제가 보면 짐이 온 줄 알고 달아날 게다.', '셋.'],
			zh(
				['其一，朕發契丹、靺鞨直入遼東，使高麗北顧一年。', '其二，朕給爾絳袍丹幟數千，立於城上，百濟見之，以為朕至，必走。', '其三。'],
				['Qí yī, zhèn fā Qìdān, Mòhé zhí rù Liáodōng, shǐ Gāolí běi gù yì nián.', 'Qí èr, zhèn gěi ěr jiàngpáo dānzhì shù qiān, lì yú chéng shàng, Bǎijì jiàn zhī, yǐwéi zhèn zhì, bì zǒu.', 'Qí sān.']
			)
		),
		d(
			'taizong',
			[
				'Your country is ruled by a woman, and your neighbours despise you for it. That is why they keep coming.',
				'I could send you one of my own clan to be your king, with a few soldiers to look after him. When the country is safe, you may have it back.'
			],
			['너희 나라는 여인이 다스린다. 이웃들이 업신여기는 게 그 때문이다. 그래서 자꾸 쳐들어오는 거고.', '짐의 종친 하나를 너희 왕으로 보내 주마. 지킬 병사 몇과 함께. 나라가 편안해지면, 그때 돌려받아라.'],
			zh(
				['爾國以婦人為主，為鄰國所輕，故寇不息。', '朕遣一宗支，與為爾國主，自將兵以衛之，待爾國安，任爾自守。'],
				['Ěr guó yǐ fùrén wéi zhǔ, wéi línguó suǒ qīng, gù kòu bù xī.', 'Zhèn qiǎn yì zōngzhī, yǔ wéi ěr guó zhǔ, zì jiāng bīng yǐ wèi zhī, dài ěr guó ān, rèn ěr zì shǒu.']
			)
		),
		p('The envoy says yes, and then no, and then nothing at all. The emperor watches him for a while.', '사신은 예, 했다가, 아니, 했다가, 끝내 아무 말도 못 한다. 황제는 한동안 그를 지켜본다.'),
		d(
			'taizong',
			['A mediocre man. Not the sort a country sends when it is drowning.'],
			['용렬한 자로구나. 물에 빠진 나라가 보낼 위인은 아니다.'],
			zh(['庸鄙之人，非乞師告急之才也。'], ['Yōngbǐ zhī rén, fēi qǐ shī gàojí zhī cái yě.'])
		),
		p(
			'The report reaches Surabol in the twelfth month. The Harmony Council has the third option read aloud twice. <b>Bidam</b> reads it once, and folds it small.',
			'보고는 섣달에 서라벌에 닿는다. 화백회의는 세 번째 안을 두 번 소리 내어 읽게 한다. <b>비담</b>은 한 번 읽고, 작게 접는다.'
		),
		d(
			'bidam',
			['He offers us a king the way a temple puts out rice for a stray.', '…And there are men in this hall who would bow for the bowl.'],
			['떠돌이 개한테 절밥 내놓듯이 왕을 내주겠다는군.', '…그런데 이 방엔 그 밥그릇에 절할 사람도 있지.']
		)
	);
}

/* ===================================================== 645 · Ansi / Jupil */
{
	const e = E('Eastern Fortress');
	const b = blk(e, 'the man who holds it, Yang Manchun');
	b.html =
		'Then the Second Emperor rides on to look at Ansi, and the man who holds it comes out onto the wall to look back. Nobody on the Tang side ever writes down his name.';
	b.ko = '그러고 나서 황제는 안시를 보러 말을 몬다. 안시를 지키는 사내가 성벽 위로 나와 그를 마주 본다. 당 쪽의 누구도 끝내 그의 이름을 적지 않는다.';
}
{
	const e = E('Stallion Mountain');
	insertAfter(
		e,
		'The white coat stays. So does the ji.',
		p(
			'When the dust settles, the two Goguryeo commanders, Go Yeonsu and Go Hyejin, walk into the Tang camp with thirty-six thousand men behind them and surrender. The officers are sent inland, to be Tang subjects somewhere far from any border. The common soldiers are sent home. The three thousand Mohe riders who came south with them are marched into a valley and buried alive.',
			'먼지가 가라앉자 고구려의 두 장수 고연수와 고혜진이 삼만 육천의 군사를 뒤에 달고 당의 진영으로 걸어 들어와 항복한다. 장교들은 내지로 보내져, 어느 국경에서도 먼 곳에서 당의 백성이 된다. 졸병들은 집으로 돌려보내진다. 그들과 함께 남하했던 말갈 기병 삼천은 골짜기로 끌려가 산 채로 묻힌다.'
		),
		p('Go Yeonsu does not live out the year. The records say he died of grief, which is the only cause of death the Tang ever let a surrendered general keep.', '고연수는 그해를 넘기지 못한다. 기록은 그가 울화로 죽었다고 적는다. 항복한 장수에게 당이 남겨 준 사인은 그것 하나뿐이다.')
	);
}

/* ============================================================ 647 · Yamato */
{
	const e = E('Chunchu Goes to the East');
	const k1 = blk(e, 'Land of the Heavenly Deer');
	k1.person = 'kotoku';
	k1.chip = chipOf('kotoku');
	const k2 = blk(e, 'speak our language remarkably well');
	k2.person = 'kotoku';
	k2.chip = chipOf('kotoku');
	const c = blk(e, 'Our sacred country has produced no end of talent');
	c.person = 'chunchu';
	c.chip = chipOf('chunchu');
}

/* ============================================= 648 · the promise, the gate */
const E648 = E('The Emperor');
const E649 = E('Death of the Second Emperor');
{
	const e = E648;
	insertAfter(
		e,
		'promise me this one thing',
		p('He sets the lamp down again at the foot of the purple horse.', '그는 등잔을 다시 보랏빛 말 발치에 내려놓는다.'),
		d(
			'taizong',
			[
				'I do not go to Liaodong for land. I have mountains and rivers enough to bore a man to death.',
				'When the two of them are settled, everything south of Pyongyang, and the whole of Baekje, is Silla’s. For your peace. Forever.'
			],
			['짐이 요동에 가는 건 땅 때문이 아닐세. 산이며 강이며, 지겹도록 가졌으니.', '두 나라를 평정하거든, 평양 이남과 백제 땅은 모두 신라 것일세. 그대들이 편히 살도록. 영원히.'],
			zh(
				['朕伐高麗，非為土地。山川土地，朕已厭之。', '平定兩國，平壤已南、百濟土地，並與爾新羅，永為安逸。'],
				['Zhèn fá Gāolí, fēi wèi tǔdì. Shānchuān tǔdì, zhèn yǐ yàn zhī.', 'Píngdìng liǎng guó, Píngrǎng yǐ nán, Bǎijì tǔdì, bìng yǔ ěr Xīnluó, yǒng wéi ānyì.']
			)
		),
		d('chunchu', ['…May I have that in writing, Majesty?'], ['…글로 받아 둘 수 있겠사옵니까, 폐하?']),
		d(
			'taizong',
			['(laughs) An emperor’s word is the writing, Spring-and-Autumn.', 'Every clerk in this city will remember it for you.'],
			['(웃으며) 천자의 말이 곧 문서일세, 춘추.', '이 도성의 서기들이 모두 자네 대신 기억해 줄 걸세.'],
			zh(['（笑）天子之言，即是文書，春秋。', '長安城裡的書吏，都替你記著。'], ['(Xiào) Tiānzǐ zhī yán, jí shì wénshū, Chūnqiū.', 'Cháng’ān chéng lǐ de shūlì, dōu tì nǐ jìzhe.'])
		),
		q(
			'朕今伐高麗 非有他故 憐你新羅 攝乎兩國 每被侵陵 靡有寧歲 山川土地 非我所貪 玉帛子女 是我所有 我平定兩國 平壤已南 百濟土地 並乞你新羅 永爲安逸',
			'I attack Goguryeo now for no other reason than pity for you, Silla, caught between two countries, invaded every year without a year’s peace. Mountains, rivers and land are not what I covet; jade, silk, sons and daughters I already have. When I have pacified the two countries, the land south of Pyongyang and the land of Baekje shall all be given to you, Silla, for your lasting peace.',
			'짐이 지금 고구려를 치는 것은 다른 까닭이 없다. 너희 신라가 두 나라 사이에 끼여 매번 침략을 당하여 편안한 해가 없음을 불쌍히 여겨서이다. 산천과 토지는 내가 탐하는 바가 아니며, 옥백과 자녀는 내가 가진 바이다. 내가 두 나라를 평정하면 평양 이남과 백제 땅은 모두 너희 신라에게 주어 길이 편안하게 하리라.',
			'Samguk Sagi (三國史記) bk. 7, Silla Annals — King Munmu, yr. 11 (671): Munmu’s reply to Xue Rengui, quoting the Second Emperor in the twenty-second year of Zhenguan (648)'
		)
	);

	insertAfter(
		e,
		'The rest he hears at the envoys’ lodging',
		p(
			'On the morning before he is to leave, a parcel comes to the lodging from the palace. Inside are rubbings of two steles in the emperor’s own hand, and a new history of the Jin dynasty, so fresh from the Historiography Office that the paste on the bindings is still soft.',
			'떠나기 전날 아침, 궁에서 객관으로 꾸러미 하나가 온다. 안에는 황제가 손수 쓴 비문 두 벌의 탁본과, 사관(史館)에서 막 나와 제본 풀이 아직 마르지 않은 새 진서(晉書)가 들어 있다.'
		),
		d('inmun', ['The paste is still wet, Father.', 'Is this one… harmonized?'], ['풀이 아직 안 말랐습니다, 아버님.', '이것도… 조화롭게 한 겁니까?']),
		d(
			'chunchu',
			['Fresh. Here they harmonize it before the paste dries.', 'Read it slowly anyway. We’ll want to know what the Jin are allowed to have done.'],
			['갓 한 거다. 여긴 풀이 마르기도 전에 조화롭게 하지.', '그래도 천천히 읽어라. 진나라가 무슨 일을 했던 걸로 되어 있는지 알아 둬야 하니까.']
		),
		p(
			'He asks for one more thing before he goes: Tang court dress, cut to Silla measure, so that his officials at home will look like the officials in this city. The emperor is delighted, and sends a chest of it.',
			'떠나기 전 그는 하나를 더 청한다. 당의 관복을, 신라 사람 몸에 맞게. 고국의 관리들도 이 도성의 관리들처럼 보이도록. 황제는 크게 기뻐하며 관복을 한 궤짝 보낸다.'
		)
	);

	const leave = E649;
	const kneel = take(leave, 'Across the hall Chunchu does not kneel like a foreign guest');
	const still = take(leave, 'You are still here.');
	const appt = take(leave, 'Inconvenient brothers keep their appointments.');
	const dust = take(leave, 'dust and horses');
	const won = take(leave, 'we have won this war');
	const prayer = blk(leave, 'Chunchu says it the way a man says a prayer he has been saving.');
	swap(prayer, 'html', 'Chunchu says it the way a man says a prayer he has been saving. ', '');
	swap(prayer, 'ko', '춘추는 아껴 두었던 기도를 꺼내듯 그렇게 말한다. ', '');

	kneel.html = 'At the gate Chunchu does not bow like a foreign guest. He bows like a man watching his younger brother try on a coat that will never come off.';
	kneel.ko = '성문 앞에서 춘추는 외국 손님처럼 절하지 않는다. 다시는 벗지 못할 겉옷을 입어 보는 동생을 보는 사람처럼 절한다.';
	still.lines = ['춘추.', '정말 가는군요.'];
	still.en = ['Spring and Autumn.', 'You really are going.'];
	still.zh = ['春秋。', '你真要走了。'];
	still.zhLatn = ['Chūnqiū.', 'Nǐ zhēn yào zǒu le.'];
	appt.lines = ['간다고 했지요.', '불편한 형제는 약속을 지킵니다.'];
	appt.en = ['I said I would.', 'Inconvenient brothers keep their appointments.'];

	const hallStart = find(leave, 'HALLWAY');
	const hallEnd = find(leave, 'You haven’t been scaring our guests away');
	const hallway = leave.blocks.splice(hallStart, hallEnd - hallStart + 1);
	const lady = hallway.find((b) => b.kind === 'p' && b.html.includes('a woman from the late emperor’s household'));
	swap(lady, 'html', 'a woman from the late emperor’s household', 'a woman from the emperor’s household');
	swap(lady, 'ko', '선제 후궁의 한 여인', '황제 후궁의 한 여인');
	const tailStart = find(leave, 'He leaves Chang’an with the alliance sealed');
	const tail = leave.blocks.splice(tailStart, leave.blocks.length - tailStart);

	e.blocks.push(
		...hallway,
		scene('The Mingde Gate', '명덕문'),
		p('On the last morning Li Zhi rides down to the Mingde Gate himself, which crown princes do not do.', '마지막 날 아침, 이치가 직접 명덕문까지 말을 타고 내려온다. 태자가 하는 일이 아니다.'),
		kneel,
		still,
		appt,
		dust,
		won,
		p('Chunchu says it the way a man says a prayer he has been saving.', '춘추는 아껴 두었던 기도를 꺼내듯 그렇게 말한다.'),
		...tail
	);
	setAt(img(e, 'alliance-hands-blue-gold'), 'alliance sealed');
	moveImages(leave, e, [
		'wu-farewell-whisper',
		'wu-hall-01-keep',
		'wu-hall-02-pale',
		'wu-hall-03-yes',
		'wu-hall-04-how',
		'wu-hall-05-silence',
		'wu-hall-call',
		'wu-hall-turn',
		'wu-hall-she',
		'wu-hall-oh',
		'wu-hall-message',
		'wu-hall-who',
		'wu-hall-stun',
		'wu-hall-wave',
		'ongunhae-high-cap',
		'ongunhae-sacrifice'
	]);
}

/* ======================================== 649 · the will, the nun, Surabol */
{
	const e = E649;
	const s0 = e.blocks[0];
	if (s0.kind !== 'scene' || s0.label !== 'Zhi & Chunchu') throw new Error('649 opening scene moved');
	s0.label = 'The Cuiwei Palace';
	s0.ko = '취미궁';

	const death = blk(e, 'The emperor dies in the Cuiwei Palace in the seventh month.');
	swap(death, 'html', 'in the seventh month', 'in the fifth month');
	swap(death, 'ko', '칠월,', '오월,');
	setAt(img(e, 'taizong-huanglong-death'), 'The emperor dies in the Cuiwei Palace in the fifth month.');

	insertAfter(
		e,
		'He does not say <i>I</i>.',
		p(
			'The will is long on mourning and short on everything else, except one line, which the new emperor reads twice. The war in Liaodong is to stop.',
			'유조는 상례에 대해서는 길고 나머지에 대해서는 짧다. 딱 한 줄만 빼고. 새 황제는 그 줄을 두 번 읽는다. 요동의 전쟁을 그만두라는 것이다.'
		)
	);

	insertAfter(
		e,
		'already knows what the silence means',
		p(
			'The news crosses the sea in the eighth month. In Surabol, Chunchu reads the will through to the line about Liaodong, and then reads that line again.',
			'소식은 팔월에 바다를 건넌다. 서라벌에서 춘추는 유조를 요동 대목까지 읽고, 그 줄을 다시 읽는다.'
		),
		d('chunchu', ['He made me promise to finish it.', 'And then he left orders to stop.', '…Very well. Then it is mine.'], ['나더러 끝내 달라고 약속하게 해 놓고.', '자기는 그만두라는 유언을 남겼군.', '…좋다. 그럼 이제 내 전쟁이다.'])
	);

	const lady = blk(e, 'you were of my father’s household');
	insertBefore(
		e,
		'you were of my father’s household',
		p(
			'The late emperor’s women who bore him no children are sent to the Ganye Temple, to shave their heads and pray for him for the rest of their lives. Wu goes with them.',
			'선제의 후궁 가운데 자식을 낳지 못한 여인들은 감업사로 보내져, 머리를 깎고 평생 그를 위해 기도하게 된다. 무도 그들과 함께 간다.'
		),
		p(
			'A year later, on the anniversary, the new emperor comes to the temple to burn incense for his father. A nun in grey looks up at him from the second row, and does not look down again.',
			'한 해 뒤 기일에, 새 황제가 아버지에게 향을 올리러 그 절에 온다. 둘째 줄의 잿빛 승복 하나가 그를 올려다보고, 다시는 눈을 내리깔지 않는다.'
		)
	);
	lady.en = ['Lady Wu.', '…They cut your hair.'];
	lady.lines = ['무 낭자.', '…머리를 깎았구나.'];
	lady.zh = ['武娘子。', '……他們剃了你的頭髮。'];
	lady.zhLatn = ['Wǔ niángzi.', '…Tāmen tì le nǐ de tóufa.'];
	const reply = blk(e, 'As Your Majesty commands.');
	reply.en = ['Hair grows back, Majesty.', '(and already the room tilts a degree toward her)'];
	reply.lines = ['머리는 다시 자라요, 폐하.', '(그리고 이미 방이 그녀 쪽으로 한 치 기운다)'];
	reply.zh = ['頭髮會長回來的，陛下。', '（而房間已向她偏過一寸）'];
	reply.zhLatn = ['Tóufa huì zhǎng huílái de, Bìxià.', '(Ér fángjiān yǐ xiàng tā piān guò yī cùn)'];
	setAt(img(e, 'wuzetian-screen'), 'Wu goes with them');
}

/* ========================================== 651 · Tang dress, Tsukushi */
{
	const e = E('The Royal Secretariat');
	e.blocks.push(
		scene('Tang Dress', '당의 옷'),
		p(
			'The chest of court robes that came home from Chang’an is opened in the first month of the next year. By spring every official in Surabol above a certain rank has been measured for one. The year after that Silla stops counting its own years and starts counting the emperor’s, and Bupmin sails west with Queen Jinduk’s <i>Ode to Great Peace</i> woven into a length of silk, which the Third Emperor admires extravagantly.',
			'장안에서 들고 온 관복 궤짝은 이듬해 정월에 열린다. 봄이 되자 서라벌에서 어느 품계 이상의 관리는 모두 치수를 잰다. 그다음 해 신라는 제 연호 세기를 그만두고 황제의 연호를 세기 시작하고, 법민은 진덕여왕의 태평송을 비단에 짜 넣어 서쪽으로 간다. 황제는 그것을 요란할 만큼 칭찬한다.'
		),
		d('munmu', ['Father. The collar itches.'], ['아버님. 깃이 가렵습니다.']),
		d('chunchu', ['Everything new itches.', 'Wear it to the Council, and watch which uncles scratch.'], ['새것은 다 가렵다.', '회의에 입고 가서, 어느 삼촌이 긁는지 봐라.']),
		scene('Tsukushi', '쓰쿠시'),
		p(
			'In the summer of 651 a Silla tribute ship puts in at Tsukushi with its envoys dressed in the new robes. The Yamato court takes one look at them and sends them home.',
			'651년 여름, 신라의 조공선이 새 관복을 입은 사신들을 싣고 쓰쿠시에 닿는다. 야마토 조정은 그들을 한 번 쳐다보고는 돌려보낸다.'
		),
		sp(
			'Kose no Ōmi',
			'#f2a0bb',
			[
				'If we do not strike Silla now, we will regret it later.',
				'Fill the sea from Naniwa to Tsukushi with ships, bow to stern, and call them to account. It would be easy.'
			],
			['지금 신라를 치지 않으면 뒷날 반드시 후회할 것입니다.', '나니와 나루에서 쓰쿠시 바다까지 배를 이물과 고물이 닿게 띄우고, 신라를 불러 그 죄를 물으면 쉬운 일입니다.'],
			ja(
				['今新羅を討たずば、後に必ず悔いあらん。', '難波の津より筑紫の海まで、艫舳を連ねて浮かべ、新羅を召してその罪を問わば、たやすく得べし。'],
				['Ima Shiragi o utazuba, nochi ni kanarazu kui aran.', 'Naniwa no tsu yori Tsukushi no umi made, tomo-he o tsuranete ukabe, Shiragi o meshite sono tsumi o towaba, tayasuku u-beshi.']
			)
		),
		p(
			'Emperor <b>Kōtoku</b> does not fill the sea. Twelve years later his successors try it at the White River with four hundred ships, and the sea fills them instead.',
			'<b>고토쿠</b> 천황은 바다를 메우지 않는다. 열두 해 뒤 그의 후계자들이 배 사백 척으로 백강에서 그것을 해 보고, 바다가 대신 그들을 메운다.'
		)
	);
}

/* ======================================================= 654 · Muyeol */
{
	const e = E('King Muyeol');
	const b = blk(e, 'the first True Bone king in a hundred and twenty years');
	swap(b, 'html', 'the first True Bone king in a hundred and twenty years', 'the first True Bone king Silla has ever crowned');
	swap(b, 'ko', '백이십 년 만의 진골 임금이', '신라 최초의 진골 임금이');
	const a = blk(e, 'First in a hundred and twenty years.');
	a.en = ['A True Bone on the throne. First since there was a throne.', '…Somebody had probably better write that down.'];
	a.lines = ['진골이 왕이 되는 건 나라가 선 이래 처음이오.', '…그건 누가 좀 적어 둬야 하지 않겠소.'];
}

/* ===================================================== 655–660 · Baekje */
{
	const e = E('Euija’s Coup');
	for (const b of e.blocks)
		if (b.kind === 'dialogue' && b.person === 'taizong') {
			b.person = 'gaozong';
			b.chip = chipOf('gaozong');
		}
	insertAfter(
		e,
		'of his own sons to the Assembly, firing every single existing member',
		p(
			'Forty-one sons need forty-one seats. None of them goes to the Ye family, which has held Bear Fortress on the Geum for four generations and has never once been asked to court. <b>Ye Sikjin</b> reads the list at home, twice, and puts it in a drawer.',
			'아들 마흔하나에게는 자리 마흔하나가 필요하다. 그 가운데 예씨 집안 몫은 없다. 네 대째 금강가 웅진성을 지켜 왔으면서 조정에 한 번도 불려 가 본 적 없는 집안이다. <b>예식진</b>은 집에서 그 명단을 두 번 읽고, 서랍에 넣는다.'
		)
	);
}
{
	const e = E('The Three Loyalists');
	insertAfter(
		e,
		'Who is the Eraha of this country?!',
		p(
			'At the back of the hall the lord of Bear Fortress has said nothing at all. <b>Ye Sikjin</b> is doing the arithmetic every provincial lord in the room is doing: how many days the Tang need from the river mouth to Sabi, and how many from Sabi to Bear Fortress.',
			'전각 뒤쪽에서 웅진성주는 아무 말도 하지 않았다. <b>예식진</b>은 방 안의 모든 지방 성주가 하고 있는 셈을 하고 있다. 당군이 강어귀에서 사비까지 며칠, 사비에서 웅진까지 며칠.'
		)
	);
}

/* ============================================= 660 · new entry: The Red Fowl */
const RED_FOWL = {
	year: '660',
	sub: 'July',
	accent: '#b91c1c',
	title: 'The Red Fowl',
	tone: 'war chronicle interlude',
	subtitle: '주작',
	badges: ['🐦', 'flag:tang', 'flag:silla'],
	music: 'Seven Invasions',
	images: [],
	blocks: [
		scene('Snow on the Steppe', '초원의 눈'),
		p(
			'Three years before he ever sees Samhan, <b>Su Dingfang</b> wins a war in a blizzard. He is sixty-five, and the qaghan of the Western Turks has camped for the winter on the reasonable assumption that nobody fights in snow two feet deep. Su marches through the night, attacks at dawn, and takes the whole camp before anyone in it has found his boots.',
			'삼한을 보기 세 해 전, <b>소정방</b>은 눈보라 속에서 전쟁 하나를 이긴다. 그는 예순다섯이고, 서돌궐의 가한은 두 자 깊이 눈 속에서 싸우는 자는 없다는 그럴듯한 가정 아래 겨울 진을 쳤다. 소정방은 밤새 행군해 새벽에 들이치고, 진 안의 누구도 신발을 찾기 전에 진영 전체를 손에 넣는다.'
		),
		d(
			'sudingfang',
			['Snow is just cold sand.', 'Nobody expects you in it. That’s the only good thing about it.'],
			['눈은 그냥 차가운 모래다.', '그 속에선 아무도 너를 기다리지 않는다. 눈이 좋은 건 그거 하나다.'],
			zh(['雪不過是冷沙。', '沒人料到你會在雪裡來。雪就這點好。'], ['Xuě búguò shì lěng shā.', 'Méi rén liàodào nǐ huì zài xuě lǐ lái. Xuě jiù zhè diǎn hǎo.'])
		),
		p(
			'He comes home with the qaghan in a cart and a red banner over his own tent, a bird with its wings spread, painted by a regiment that had decided he needed one. Chang’an is calling him the <b>Red Fowl</b> long before anyone official does.',
			'그는 가한을 수레에 싣고 돌아온다. 그의 군막 위에는 붉은 깃발이 걸려 있다. 날개를 편 새 한 마리. 그에게 하나쯤 있어야 한다고 마음먹은 어느 부대가 그려 준 것이다. 장안은 관에서 그렇게 부르기 한참 전부터 그를 <b>주작</b>이라 부른다.'
		),
		scene('Deokmul Island', '덕물도'),
		p(
			'In the sixth month of 660 he sails from Shandong with a hundred and thirty thousand men and drops anchor off Deokmul Island. A Silla fleet of a hundred ships comes out to meet him. At its head is the crown prince, <b>Bupmin</b>, thirty-four years old and trying not to stare at the size of the Tang flagship.',
			'660년 유월, 그는 군사 십삼만을 싣고 산동을 떠나 덕물도 앞바다에 닻을 내린다. 신라의 배 백 척이 그를 맞으러 나온다. 맨 앞에 태자 <b>법민</b>이 있다. 서른넷이고, 당나라 기함의 크기를 빤히 쳐다보지 않으려 애쓰는 중이다.'
		),
		d('sudingfang', ['You’re the son?'], ['네가 아들이냐?'], zh(['你是兒子？'], ['Nǐ shì érzi?'])),
		d('munmu', ['Kim Bupmin, General. My father the king sends his—'], ['김법민입니다, 장군. 부왕께서—']),
		d(
			'sudingfang',
			['Tenth day of the seventh month. South of Sabi. Your army and mine, on the same field, on the same morning.', 'Tell your father. Tell him twice.'],
			['칠월 열흘. 사비 남쪽. 너희 군대와 내 군대가 같은 들판에, 같은 아침에.', '아버지한테 전해라. 두 번 전해라.'],
			zh(['七月十日，泗沘之南。你軍我軍，同一片地，同一個早晨。', '告訴你父親。說兩遍。'], ['Qīyuè shí rì, Sìbì zhī nán. Nǐ jūn wǒ jūn, tóng yí piàn dì, tóng yí ge zǎochén.', 'Gàosu nǐ fùqīn. Shuō liǎng biàn.'])
		),
		d('munmu', ['We will be there, General.'], ['가겠습니다, 장군.']),
		p('Bupmin is rowed back to his own ship. Behind him the Red Fowl says something to his staff that makes them laugh.', '법민은 노를 저어 제 배로 돌아간다. 그 뒤에서 주작이 참모들에게 뭐라 하자 그들이 웃는다.'),
		d(
			'sudingfang',
			['They’ll be late. Small countries always are. They have to ask too many uncles.'],
			['늦을 거다. 작은 나라는 늘 늦어. 물어볼 삼촌이 너무 많거든.'],
			zh(['他們會遲到。小國總是遲。要問的叔伯太多。'], ['Tāmen huì chídào. Xiǎo guó zǒngshì chí. Yào wèn de shūbó tài duō.'])
		),
		scene('Geumdol Fortress', '금돌성'),
		p(
			'King Muyeol comes as far as Geumdol Fortress and no farther: the field belongs to his son and to Yushin. He sends fifty thousand men west under <b>Kim Yushin</b> with a date in their heads. Between them and the date is the pass at Tanhyeon, and beyond the pass, a man called Gyebek.',
			'무열왕은 금돌성까지만 오고 더는 오지 않는다. 들판은 아들과 유신의 몫이다. 그는 오만 군사를 <b>김유신</b>에게 맡겨 서쪽으로 보낸다. 다들 머릿속에 날짜 하나를 넣고 간다. 그들과 그 날짜 사이에는 탄현 고개가 있고, 고개 너머에는 계백이라는 사내가 있다.'
		),
		d('chunchu', ['The tenth day, then.', '…Yushin. Don’t let the Tang get there first. They’ll write it down that way for a thousand years.'], ['열흘이라.', '…유신. 당이 먼저 도착하게 하지 마라. 저들은 천 년 동안 그렇게 적을 거다.']),
		scene('Gibeolpo', '기벌포'),
		p(
			'On the ninth day of the seventh month the Tang fleet comes into the mouth of the White River at Gibeolpo, where the shore is not a shore at all but a mile of grey mud. Baekje’s soldiers wait on the higher ground and watch the first Tang companies wade in up to the thigh.',
			'칠월 아흐렛날, 당의 함대가 기벌포의 백강 어귀로 들어온다. 그곳의 물가는 물가가 아니라 십 리에 걸친 잿빛 진흙이다. 백제 군사들은 높은 땅에서 기다리며, 당의 첫 부대가 허벅지까지 빠지며 걸어 들어오는 것을 지켜본다.'
		),
		d(
			'sudingfang',
			['Mud is just wet road.', 'Give it something to hold.'],
			['진흙은 그냥 젖은 길이다.', '붙잡을 걸 깔아 줘라.'],
			zh(['泥不過是濕路。', '給它墊點東西。'], ['Ní búguò shì shī lù.', 'Gěi tā diàn diǎn dōngxi.'])
		),
		p(
			'His men lay willow mats on the mud, one after another, a road made of baskets, and the army walks across it dry-shod. By evening the Baekje line is broken and the river is open to Sabi.',
			'그의 병사들이 진흙 위에 버들 거적을 한 장 한 장 깐다. 광주리로 만든 길이다. 군대는 발을 적시지 않고 그 위를 건넌다. 저녁이 되자 백제의 진은 무너지고, 사비로 가는 강이 열린다.'
		),
		p(
			'The same morning, forty miles east, the Silla army comes down out of the hills onto the Yellow Mountain Fields, and finds five thousand men already standing in its way.',
			'같은 날 아침, 동쪽으로 백 리 떨어진 곳에서 신라군이 산을 내려와 황산벌로 들어선다. 오천 명이 이미 길을 막고 서 있다.'
		)
	]
};
{
	const hw = E('Yellow Mountain Fields');
	const ch = chapterOf(hw);
	ch.entries.splice(ch.entries.indexOf(hw), 0, RED_FOWL);
	const last = hw.blocks[hw.blocks.length - 1];
	if (last.kind === 'dialogue' && last.person === 'taizong') {
		last.person = 'gaozong';
		last.chip = chipOf('gaozong');
	}
}

/* ========================================================== 660 · Sabi */
{
	const e = E('Sabi Palace');
	take(e, 'Long ago your father had my younger sister killed');
	take(e, 'And what is this supposed to mean');

	insertAfter(
		e,
		'The court hears about the Yellow Mountain Fields',
		p(
			'Euija’s first move is to send the Tang camp a feast: oxen, wine, three cartloads of rice cakes. The court is told this is diplomacy.',
			'의자의 첫 수는 당의 진영에 잔칫상을 보내는 것이다. 소, 술, 떡 세 수레. 조정에는 이것이 외교라고 알린다.'
		),
		d('euija', ['Nobody burns a city on a full stomach.', 'Feed them. Then we’ll talk about what they want.'], ['배부른 놈은 성을 안 태운다.', '먹여라. 원하는 건 그다음에 얘기하자.']),
		p('The oxen come back that afternoon, untouched, with the drovers walking behind them.', '황소들은 그날 오후, 손도 안 댄 채, 몰이꾼들을 뒤에 달고 되돌아온다.'),
		scene('The Red Fowl’s Tent', '주작의 군막'),
		p(
			'Outside Sabi, on the twelfth day of the seventh month, the Silla army reaches the Tang camp two days after the date it was given. The Red Fowl has the Silla commissary officer, Kim Munyeong, brought to the gate of his tent and his collar opened for the sword.',
			'칠월 열이틀, 사비 밖에서 신라군이 약속한 날보다 이틀 늦게 당의 진영에 닿는다. 주작은 신라의 독군 김문영을 군막 문 앞에 끌어내 칼 받을 목깃을 풀게 한다.'
		),
		d(
			'sudingfang',
			['The tenth day. South of Sabi. I said it twice.', 'Take his head. Then we can start.'],
			['열흘. 사비 남쪽. 두 번 말했다.', '목을 쳐라. 그럼 시작하지.'],
			zh(['七月十日，泗沘之南。我說了兩遍。', '斬了。然後開始。'], ['Qīyuè shí rì, Sìbì zhī nán. Wǒ shuō le liǎng biàn.', 'Zhǎn le. Ránhòu kāishǐ.'])
		),
		p('<b>Kim Yushin</b> walks into the tent with a battle-axe in his hand.', '<b>김유신</b>이 손에 큰 도끼를 들고 군막 안으로 걸어 들어온다.'),
		d(
			'yushin',
			['The general did not see the Yellow Mountain Fields.', 'If you mean to punish us for being late, I will not be shamed for a crime I did not commit. I will fight the Tang first, and Baekje after.'],
			['장군께서는 황산의 싸움을 보지 못하셨소.', '늦었다는 걸 죄로 삼겠다면, 죄 없이 욕을 받을 수는 없소. 당군과 먼저 결판을 내고, 백제는 그다음에 치겠소.']
		),
		q(
			'乃杖鉞軍門 怒髮如植 其腰間寶劍自躍出鞘',
			'Then he stood at the camp gate leaning on his axe; his angry hair stood up like planted stakes, and the precious sword at his waist leapt of itself from its scabbard.',
			'이에 도끼를 짚고 군문에 서니, 성난 머리털이 꽂아 세운 듯하고, 허리에 찬 보검이 저절로 칼집에서 뛰쳐나왔다.',
			'Samguk Sagi (三國史記) bk. 5, Silla Annals — King Muyeol, yr. 7 (660), seventh month'
		),
		p('The Red Fowl’s right-hand general, Dong Baoliang, steps on his commander’s foot.', '주작의 우장 동보량이 제 상관의 발을 밟는다.'),
		sp(
			'Dong Baoliang',
			TANG,
			['(low) The Silla army is about to turn on us, General.'],
			['(낮게) 신라 군사가 들고일어나려 합니다, 장군.'],
			zh(['（低聲）新羅兵將有變也。'], ['(Dīshēng) Xīnluó bīng jiāng yǒu biàn yě.'])
		),
		p('Kim Munyeong’s collar is closed again. Nobody in the tent mentions the date for the rest of the war.', '김문영의 목깃이 다시 여며진다. 그 전쟁이 끝날 때까지 군막 안의 누구도 날짜 이야기를 꺼내지 않는다.')
	);

	insertAfter(
		e,
		'I regret that I did not use Seongchung’s words',
		p(
			'His second son <b>Tae</b>, left behind in the capital, declares himself king the next morning. Yung’s son <b>Munsa</b> looks at the size of the Tang camp, says that a king who runs leaves behind an uncle who will kill whoever opened the gate, and climbs down the wall on a rope with his household. Half the city follows him down it.',
			'도성에 남은 둘째 <b>태</b>가 이튿날 아침 스스로 왕이 된다. 융의 아들 <b>문사</b>는 당의 진영이 얼마나 큰지 보고는, 달아난 왕 뒤에 남은 숙부는 성문 연 자를 다 죽일 거라 말하고, 식솔을 데리고 밧줄을 타고 성벽을 내려간다. 성의 절반이 그 밧줄을 따라 내려간다.'
		),
		p(
			'Crown Prince <b>Yung</b> comes out of the gate with the Great Minister <b>Satek Chunbok</b> a careful pace behind him. <b>Bupmin</b> has him knelt in the dirt in front of his horse, and spits in his face.',
			'태자 <b>융</b>이 성문을 나온다. 대좌평 <b>사택천복</b>이 조심스러운 한 걸음 뒤에서 따른다. <b>법민</b>은 그를 제 말 앞 흙바닥에 꿇리고, 그 얼굴에 침을 뱉는다.'
		),
		d(
			'munmu',
			['Long ago your father had my younger sister killed unjustly and buried in a prison. That deed left my heart sore and my head aching for twenty years — and today your life is in my hands!'],
			['예전에 너의 아비가 나의 여동생을 억울하게 죽여 옥중에 묻은 적이 있다. (그 일은) 나로 하여금 20년 동안 마음이 아프고 골치를 앓게 하였는데, 오늘날 너의 목숨이 내 손 안에 있구나!']
		),
		p('Yung lies flat on the ground and says nothing.', '융은 땅에 엎드려 아무 말도 하지 않는다.'),
		d(
			'chunbok',
			['As the generals will surely appreciate, the gate was opened for the sake of the people, and in full accordance with—'],
			['장군들께서도 헤아리시겠지만, 성문은 백성을 위하여, 그리고 전적으로 그 뜻에 따라—']
		)
	);

	insertBefore(
		e,
		'the guardian of Bear Fortress, captures Euija',
		scene('Bear Fortress', '웅진성'),
		p(
			'Bear Fortress belongs to the king the way a borrowed house belongs to a guest. The Ye family has held it for four generations. <b>Ye Sikjin</b> gives the king his own rooms, and goes up on the wall every morning to count the Tang sails on the river.',
			'웅진성이 왕의 것인 건 빌린 집이 손님의 것인 것과 같다. 예씨 집안이 네 대째 지켜 온 성이다. <b>예식진</b>은 왕에게 제 방을 내주고, 아침마다 성벽에 올라 강 위의 당나라 돛을 센다.'
		),
		d(
			'euija',
			['Sikjin! Good man. Your grandfather held this rock for my grandfather, eh?', 'We’ll hold it again. The Red Fowl can’t sit in the mud forever.'],
			['식진아! 좋은 놈. 네 할아비가 내 할아비 위해 이 바위를 지켰지?', '다시 지키는 거다. 주작이 언제까지 진흙탕에 앉아 있겠냐.']
		),
		d('yesikjin', ['My grandfather held it, Majesty.', '…For whoever was king.'], ['할아버지께서 지키셨지요, 폐하.', '…누가 왕이든.']),
		p('On the fifth night he comes into the king’s rooms with his brother and twenty men, and the king understands before anyone speaks.', '닷새째 밤, 그는 아우와 장정 스물을 데리고 왕의 방으로 들어온다. 왕은 누가 입을 열기도 전에 알아차린다.')
	);
	const ye = blk(e, 'the guardian of Bear Fortress, captures Euija');
	swap(ye, 'html', 'surrenders to the Third Emperor', 'surrenders to the Red Fowl');
	swap(ye, 'ko', '황제에게 바친다', '주작에게 바친다');
	insertAfter(
		e,
		'surrenders to the Red Fowl',
		q(
			'其大將禰植又將義慈來降',
			'Its great general Ye Sik also brought Uija and came to surrender.',
			'그 대장 예식이 또 의자를 데리고 와서 항복하였다.',
			'Jiu Tangshu (舊唐書) bk. 83, Biography of Su Dingfang'
		)
	);

	const wine = blk(e, 'finally arrives at the scene. He makes Euija pour');
	wine.html =
		'<b>King Muyeol</b> finally arrives at the scene. He makes Euija pour his wineglass, and the Red Fowl’s beside it, and executes the traitors <b>Gumil</b> and <b>Mochuk</b>.';
	wine.ko = '마침내 <b>무열왕</b>이 당도한다. 그는 의자에게 자기 잔과 그 옆 주작의 잔에 술을 따르게 하고, 배신자 <b>검일</b>과 <b>모척</b>을 처형한다.';

	e.blocks.push(
		scene('The Pagoda', '정림사 탑'),
		p(
			'On the fifteenth day of the eighth month the Tang carve their victory into the five-storey stone pagoda at Jeongnim Temple, on the first storey, where anyone walking round it has to read it. The inscription calls the conquest a deliverance, and says of Baekje’s king:',
			'팔월 보름, 당은 정림사 오층석탑 첫 층에 그들의 승리를 새긴다. 탑을 도는 사람이면 누구나 읽을 수밖에 없는 자리다. 비문은 정복을 구원이라 부르고, 백제의 임금을 두고 이렇게 적는다.'
		),
		q(
			'外棄直臣 內信妖婦',
			'Abroad he cast off his upright ministers; at home he trusted a bewitching woman.',
			'밖으로는 곧은 신하를 버리고, 안으로는 요사한 여인을 믿었다.',
			'Datang ping Baekje guo beiming (大唐平百濟國碑銘), carved on the five-storey stone pagoda of Jeongnimsa, Buyeo (660)'
		),
		d('chunchu', ['Harmonized.'], ['조화롭게 했군.']),
		p(
			'Then the Tang divide Baekje into five commanderies, with a Tang governor over each and Baekje men under them. Nothing in the arrangement is labelled Silla.',
			'그러고 나서 당은 백제를 다섯 도독부로 나누고, 저마다 당의 도독을, 그 아래에 백제 사람들을 앉힌다. 그 배치 어디에도 신라라는 이름표는 없다.'
		),
		d('munmu', ['Father. Everything south of Pyongyang and the whole of Baekje. He said it in front of the horses. You told me.'], ['아버님. 평양 이남과 백제 땅 전부. 그 말들 앞에서 그렇게 말했다고, 아버님이 그러셨잖습니까.']),
		d('chunchu', ['I did.', 'He also said an emperor’s word was the writing. I should have brought a brush.'], ['그랬지.', '천자의 말이 곧 문서라고도 했다. 붓을 챙겨 갈 걸 그랬어.']),
		p(
			'In the Tang lines the Red Fowl’s staff officers are seen pacing out the distance to the Silla camp, which is not a thing allies measure. In the Silla council a man proposes that their soldiers put on Baekje clothes and fall on the Tang by night.',
			'당의 진에서 주작의 참모들이 신라 진영까지의 거리를 걸음으로 재는 것이 보인다. 동맹끼리 잴 거리는 아니다. 신라의 군의에서 누군가가, 우리 군사에게 백제 옷을 입혀 밤에 당을 치자고 한다.'
		),
		d('yushin', ['A dog fears its master, Majesty.', 'But step on its foot and it bites. Even a dog knows that much.'], ['개는 주인을 두려워합니다, 전하.', '그러나 주인이 발을 밟으면 뭅니다. 개도 그쯤은 압니다.']),
		p('Word of the conversation reaches the Red Fowl’s tent, as it was meant to.', '그 대화는 의도한 대로 주작의 군막에 전해진다.'),
		p(
			'On the third day of the ninth month the Red Fowl sails for home with Euija, his sons, and twelve thousand captives, leaving Liu Renyuan with ten thousand men to hold Sabi beside a Silla army that has stopped smiling at him.',
			'구월 사흗날, 주작은 의자와 그 아들들과 포로 만 이천을 싣고 귀국길에 오른다. 사비에는 유인원과 군사 만 명을 남긴다. 그 옆에는 더 이상 그에게 웃어 주지 않는 신라군이 있다.'
		)
	);
}

/* ========================================= 660 · the death of Buyeo Euija */
{
	const e = E('The Death of Buyeo Euija');
	const open = blk(e, 'Euija is brought forth before the Third Emperor.');
	open.html = 'In Luoyang, before the Zetian Gate, Euija is brought forth before the Third Emperor.';
	open.ko = '낙양 측천문 앞에서 의자가 황제 앞에 끌려 나온다.';
	insertAfter(
		e,
		'He signs in a hand so large',
		p('Afterwards the emperor asks his general a question in front of the whole court.', '그 뒤 황제가 온 조정 앞에서 장군에게 묻는다.'),
		d(
			'gaozong',
			['You were there with an army. Why didn’t you take Silla while you were at it?'],
			['경이 군대를 끌고 거기 있었는데, 어째서 내친김에 신라까지 치지 않았소?'],
			zh(['卿既在彼，何不因而伐新羅？'], ['Qīng jì zài bǐ, hé bù yīn ér fá Xīnluó?'])
		),
		d(
			'sudingfang',
			['Their king is kind and loves his people. His ministers serve the country loyally. Below, they serve those above like fathers and elder brothers.', 'It is a small country, Majesty. But it cannot be schemed against.'],
			['그 임금은 어질어 백성을 아끼고, 신하들은 충성으로 나라를 섬기며, 아랫사람은 윗사람을 아비와 형처럼 섬깁니다.', '작은 나라이나, 꾀로 도모할 수는 없습니다.'],
			zh(['新羅其君仁而愛民，其臣忠以事國，下之人事其上如父兄。', '雖小，不可謀也。'], ['Xīnluó qí jūn rén ér ài mín, qí chén zhōng yǐ shì guó, xià zhī rén shì qí shàng rú fù xiōng.', 'Suī xiǎo, bù kě móu yě.'])
		)
	);
	const shout = e.blocks.findIndex((b) => b.kind === 'dialogue' && b.person === 'euija' && b.lines.join('') === '김춘추...<b>김춘추!!!</b>');
	if (shout < 0) throw new Error('Euija shout not found');
	e.blocks.splice(shout + 1, 0, p('Across the sea, in Surabol, King Muyeol is eating his supper.', '바다 건너 서라벌에서, 무열왕이 저녁을 들고 있다.'));
}

/* ===================================================== 661 · Muyeol dies */
{
	const e = E('The Death of Kim Chunchu');
	const b = blk(e, 'He is given the temple name <b>Muyeol</b>.');
	b.html =
		'He is given the posthumous name <b>Muyeol</b>, and the temple name <b>Taejong</b>, the same two characters as the Second Emperor’s. He is the first True Bone king Silla ever crowned, and the last man anyone will ever call a diplomat.';
	b.ko = '그에게 <b>무열</b>이라는 시호와 <b>태종</b>이라는 묘호가 올려진다. 당의 선제와 똑같은 두 글자다. 그는 신라가 처음으로 왕관을 씌운 진골이자, 누구도 다시는 외교가라 부르지 않을 마지막 사내다.';
}

/* ================================================ 661 · Restoration Society */
{
	const e = E('Baekje Restoration Society');
	const b0 = blk(e, 'Prince Pung sends a message to Yamato the East');
	b0.html =
		'<b>Gwishil Boksin</b> sends to Yamato the East with a hundred Tang prisoners as a present, and asks for two things: an army, and Prince Pung, who has lived there for twenty years.';
	b0.ko = '<b>귀실복신</b>이 당나라 포로 백여 명을 선물로 딸려 왜국에 사람을 보내 두 가지를 청한다. 원병, 그리고 스무 해를 그곳에서 산 부여풍.';

	insertAfter(
		e,
		'begins to resent the king he crowned',
		scene('The Black Tortoise', '현무'),
		p(
			'The Tang garrison at Sabi is relieved that spring by a man nobody in Chang’an expected to see in uniform again. <b>Liu Rengui</b> is sixty, was stripped of office the year before for losing a grain fleet in a storm, and has been sent east as a commoner in white to redeem himself. In his baggage he has packed the Tang calendar and the list of imperial ancestors’ names that may not be written.',
			'그해 봄, 사비의 당군을 구하러 온 사람은 장안의 누구도 다시 군복 입을 줄 몰랐던 사내다. <b>유인궤</b>는 예순이고, 지난해 풍랑에 군량선을 잃은 죄로 관직을 빼앗겼으며, 백의종군으로 죄를 씻으라는 명을 받고 동쪽으로 보내졌다. 짐 속에는 당의 역서와, 써서는 안 될 황실 조상들의 휘(諱) 목록을 챙겨 왔다.'
		),
		d(
			'liurengui',
			['Heaven means to make an old man rich, it seems.', 'Send me the calendar for this country, and the list of names one must not write. If we are going to sweep the east clean, the east should at least know what year it is.'],
			['하늘이 이 늙은이를 부귀하게 하시려나 보오.', '이 나라에 쓸 역서를 보내 주시오. 써서는 안 될 이름 목록도. 동쪽을 쓸어 평정할 거라면, 동쪽도 적어도 지금이 몇 년인지는 알아야지.'],
			zh(['天將富貴此翁耳。', '請頒曆及宗廟諱。吾欲掃平東夷，頒大唐正朔於海表。'], ['Tiān jiāng fùguì cǐ wēng ěr.', 'Qǐng bān lì jí zōngmiào huì. Wú yù sǎopíng dōngyí, bān Dà Táng zhēngshuò yú hǎibiǎo.'])
		),
		p('Boksin sends a messenger to the Tang walls with a question.', '복신이 당의 성벽으로 사자를 보내 묻는다.'),
		d('boksin', ['When are you gentlemen going home, Ambassador?', 'Name the day. We’d like to see you off properly.'], ['대사 나리들은 언제 서쪽으로 돌아가시오?', '날만 말씀하시오. 제대로 배웅해 드리고 싶으니.']),
		d(
			'liurengui',
			['Tell him we are guests.', 'Guests leave when the host can keep his own house. This host has two kings, one army and no roof. We’ll stay for dinner.'],
			['손님이라고 전하시오.', '손님은 주인이 제 집을 건사할 수 있을 때 떠나는 법이오. 이 집 주인은 왕이 둘에 군대가 하나, 지붕은 없소. 저녁은 먹고 가겠소.'],
			zh(['告訴他，我們是客。', '主人能守其家，客乃去。此家二主一軍，無屋可遮。我們留下吃晚飯。'], ['Gàosu tā, wǒmen shì kè.', 'Zhǔrén néng shǒu qí jiā, kè nǎi qù. Cǐ jiā èr zhǔ yì jūn, wú wū kě zhē. Wǒmen liúxià chī wǎnfàn.'])
		)
	);

	insertAfter(
		e,
		'Rotten dog, idiot slave!',
		p(
			'Two generals stand at the back while the head is salted. <b>Heukchi Sangji</b>, who took two hundred fortresses back for Boksin in a single season, watches the king’s hands. <b>Satek Sangya</b> watches the jar.',
			'머리를 소금에 절이는 동안 두 장수가 뒤쪽에 서 있다. 한 철에 복신에게 이백 성을 되찾아 준 <b>흑치상지</b>는 임금의 손을 본다. <b>사택상여</b>는 항아리를 본다.'
		),
		d('sangji', ['The man who crowned him. In a jar.', '…What do you think he does with the ones who didn’t?'], ['자기를 왕으로 세운 사람이다. 항아리에.', '…세워 주지도 않은 우리는 어떻게 할 것 같나.']),
		d('sateksangya', ['Same thing. Less salt.'], ['똑같이. 소금만 덜 치고.'])
	);
}
{
	const e = E('White River');
	const b = blk(e, 'Sacha Sangyeo');
	swap(b, 'html', 'Sacha Sangyeo', 'Satek Sangya');
}

/* ================================================ 661 · Pyongyang, winter */
{
	const e = E('Pyongyang');
	insertAfter(
		e,
		'Pyongyang does not fall.',
		p(
			'In Luoyang the Third Emperor announces that he will lead the next army himself. The Empress sends up a memorial the same night.',
			'낙양에서 황제가 다음 원정은 친히 이끌겠다고 선포한다. 황후는 그날 밤 상소를 올린다.'
		),
		d(
			'wuzetian',
			['Your father went in person, Majesty.', 'Ask the six horses at Zhaoling how that went.'],
			['선제께서도 친정하셨지요, 폐하.', '소릉의 여섯 마리 말한테 어떻게 됐는지 물어보세요.'],
			zh(['先帝亦曾親征，陛下。', '陛下去問昭陵那六匹馬，結果如何。'], ['Xiāndì yì céng qīnzhēng, Bìxià.', 'Bìxià qù wèn Zhāolíng nà liù pǐ mǎ, jiéguǒ rúhé.'])
		),
		d('gaozong', ['…We will send someone.'], ['…다른 사람을 보내지.'], zh(['……朕遣人去。'], ['…Zhèn qiǎn rén qù.'])),
		p(
			'The someone is the Red Fowl. He comes up the Taedong in the eighth month, takes the river forts one by one, and sits down in front of Pyongyang to wait for winter to soften it. Winter has never been on anybody’s side but Goguryeo’s.',
			'그 다른 사람이 주작이다. 그는 팔월에 대동강을 거슬러 올라와 강가의 성들을 하나씩 떨구고, 평양 앞에 앉아 겨울이 성을 무르게 해 주기를 기다린다. 겨울은 고구려 말고는 누구 편도 든 적이 없다.'
		),
		p(
			'In the ninth month <b>Yeon Namseng</b> holds the Yalu with several tens of thousands. The river freezes overnight. Qibi Heli, the White Dragon of the old war, walks his army across the ice at dawn with the drums going, and kills thirty thousand men who had been guarding a river that was no longer there.',
			'구월, <b>연남생</b>이 수만 군사로 압록을 지킨다. 강이 하룻밤 새 언다. 옛 전쟁의 백룡 계필하력이 새벽에 북을 울리며 얼음 위로 군대를 걸려 건너와, 이제 거기 없는 강을 지키던 삼만을 벤다.'
		),
		d('gesomun', ['One river, Namseng. I gave you one river.', 'Don’t tell me you didn’t know it would freeze. It freezes every year.'], ['강 하나다, 남생아. 강 하나를 맡겼다.', '얼 줄 몰랐다는 소리는 하지 마라. 거긴 해마다 언다.'])
	);
	const freeze = blk(e, 'The relief army freezes in the snow outside the walls');
	freeze.html = 'The Red Fowl’s army freezes in the snow outside the walls, eats its horses, and waits for rice.';
	freeze.ko = '주작의 군대는 성 밖 눈밭에서 얼어붙은 채, 제 말을 잡아먹으며 군량을 기다린다.';
	setAt(img(e, 'two-dragons'), 'freezes in the snow outside the walls');
	setAt(img(e, 'red-sigil'), 'freezes in the snow outside the walls');
	e.blocks.push(
		p(
			'In the twelfth month a letter reaches Surabol from the Tang camp. The Red Fowl is out of rice. King Munmu reads it out to his generals, and nobody offers, because everyone in the room knows what the road north looks like in the twelfth month. <b>Kim Yushin</b>, who is sixty-six, offers.',
			'섣달, 당의 진영에서 서라벌로 편지가 온다. 주작의 군량이 떨어졌다. 문무왕이 장수들 앞에서 읽는다. 아무도 나서지 않는다. 섣달의 북쪽 길이 어떤지 방 안의 모두가 안다. 예순여섯의 <b>김유신</b>이 나선다.'
		),
		d('munmu', ['Uncle. Not you. Send someone younger.'], ['외숙. 외숙은 안 되오. 젊은 사람을 보내시오.']),
		d('yushin', ['The younger ones don’t know the road, Majesty. Hanseul and I do.', 'Load the carts.'], ['젊은 사람들은 길을 모릅니다, 전하. 한슬이와 저는 압니다.', '수레에 실으십시오.'])
	);
}

/* ====================================================== 662 · Snake River */
{
	const e = E('Snake River');
	const t = blk(e, 'is given the dead man’s title');
	t.html =
		'The courier carrying the news finds <b>Xue Rengui</b> a thousand miles the other way, under the Tianshan, where he has just ended a war against the Tiele with three arrows and his soldiers are already singing about it. He is given the dead man’s title — <b>White Tiger II</b> — and the job of settling the account.';
	t.ko =
		'그 소식을 든 파발은 천 리 반대편, 천산 아래에서 <b>설인귀</b>를 찾아낸다. 그는 화살 세 대로 철륵과의 전쟁을 막 끝냈고, 병사들은 벌써 그 노래를 부르고 있다. 그는 죽은 자의 이름을 물려받는다. <b>백호 2세</b>. 그리고 그 셈을 치를 임무도 함께.';
	const fail = blk(e, 'They fail, together, at the Snake River.');
	swap(fail, 'ko', '살수에서, 둘이 함께, 실패한다.', '사수에서, 둘이 함께, 실패한다.');

	e.blocks.push(
		scene('The Rice Road', '군량길'),
		p(
			'In the second month a train of carts comes up out of the south through snow to the axles. <b>Kim Yushin</b> is sixty-seven, and he has walked half the road beside his white horse so that Hanseul can carry a sack of rice instead of him.',
			'이월, 바퀴 축까지 차는 눈을 뚫고 남쪽에서 수레 행렬이 올라온다. <b>김유신</b>은 예순일곱이고, 한슬이가 자기 대신 쌀 한 섬을 질 수 있도록 길의 절반을 흰 말 곁에서 걸어왔다.'
		),
		p(
			'The Tang camp outside Pyongyang has been eating its horses. Men sit hugging their knees in the snow and look at the carts as if they might be another rumour.',
			'평양 밖 당의 진영은 제 말을 잡아먹고 있었다. 병사들은 눈 속에 무릎을 끌어안고 앉아, 수레를 또 하나의 헛소문인 양 바라본다.'
		),
		d(
			'sudingfang',
			['Silla is late.', '…Unload it. All of it. Then we go home.'],
			['신라는 늦는군.', '…내려라. 전부. 그리고 집에 간다.'],
			zh(['新羅來遲了。', '……卸下。全卸。然後回家。'], ['Xīnluó lái chí le.', '…Xièxià. Quán xiè. Ránhòu huí jiā.'])
		),
		d('yushin', ['We came through snow to the horse’s chest, General.', 'You may eat it slowly.'], ['말 가슴까지 차는 눈을 뚫고 왔습니다, 장군.', '천천히 드셔도 됩니다.']),
		p(
			'The Red Fowl takes the rice, breaks camp within the week, and sails. The road back is Yushin’s problem. Goguryeo’s horsemen follow the empty carts all the way to the Imjin, and the white horse carries him across it.',
			'주작은 쌀을 받고, 그 주 안에 진을 걷고, 배를 탄다. 돌아가는 길은 유신의 몫이다. 고구려 기병이 빈 수레를 임진강까지 쫓아오고, 흰 말이 그를 태우고 강을 건넌다.'
		)
	);
}

/* ============================== 664 · new entry: The Bear Ford Commandery */
const BEAR_FORD = {
	year: '664',
	sub: 'February',
	accent: '#b91c1c',
	title: 'The Bear Ford Commandery',
	tone: 'occupation chronicle',
	subtitle: '웅진도독부',
	badges: ['🐻', 'flag:tang', 'flag:baekje'],
	music: 'The Long War',
	images: [],
	blocks: [
		scene('Five Commanderies', '다섯 도독부'),
		p(
			'When Sabi fell the Tang drew five commanderies over Baekje like a net over a pond, and put the largest of them at Bear Ford on the Geum, where Euija had been handed over. For three years the net caught mostly rebels.',
			'사비가 떨어졌을 때 당은 연못에 그물을 치듯 백제 위에 다섯 도독부를 그었고, 그중 가장 큰 것을 의자가 넘겨진 금강가 웅진에 두었다. 세 해 동안 그 그물에 걸린 것은 대부분 반란군이었다.'
		),
		p(
			'Now the rebels are gone, into the White River or onto Yamato ships, and the Black Tortoise has time for what he actually came for, which is paperwork. He counts the households of Baekje village by village and writes them down as numbers. He mends dykes and bridges. He posts the Tang calendar at every crossroads, with the list of names that may not be written, so that the people of Baekje will know which characters to leave out of their letters home.',
			'이제 반란군은 백강 물속으로, 아니면 야마토의 배 위로 사라졌고, 현무에게는 그가 정말로 하러 온 일, 곧 서류를 할 시간이 생겼다. 그는 백제의 호구를 마을마다 세어 숫자로 적는다. 둑과 다리를 고친다. 네거리마다 당의 역서를 붙이고, 써서는 안 될 이름 목록도 함께 붙인다. 백제 사람들이 고향에 보내는 편지에서 어느 글자를 빼야 하는지 알도록.'
		),
		d(
			'liurengui',
			['A village that knows what year it is pays its tax on time.', 'Put one up at the ferry as well. People read while they wait for the boat.'],
			['올해가 몇 년인지 아는 마을은 세금을 제때 내오.', '나루에도 하나 붙이시오. 사람은 배를 기다리면서 읽으니까.'],
			zh(['知年歲之村，納稅不誤。', '渡口也貼一張。人等船時會讀。'], ['Zhī niánsuì zhī cūn, nàshuì bú wù.', 'Dùkǒu yě tiē yì zhāng. Rén děng chuán shí huì dú.'])
		),
		scene('Gyerim', '계림'),
		p(
			'The year before, an edict had come to Surabol naming King Munmu Grand Commander of the Gyerim Prefecture. Gyerim is the old name of Silla, the wood where the first Kim was found in a golden box under a crowing white rooster. In the edict it is a prefecture of the empire, and the king of Silla is its governor.',
			'그 전해, 문무왕을 계림주 대도독으로 삼는다는 칙서가 서라벌에 왔다. 계림은 신라의 옛 이름이다. 흰 닭이 우는 숲, 첫 김씨가 금궤 속에서 발견된 곳. 칙서 안에서 그곳은 제국의 한 주(州)이고, 신라의 왕은 그 고을 원이다.'
		),
		d('munmu', ['A prefecture, Uncle. They have made my father’s country into a prefecture, and me its clerk.'], ['주라 하오, 외숙. 아버님의 나라를 주로 만들고, 나를 그 고을 원으로 삼았소.']),
		d('yushin', ['Then sign as its clerk, Majesty.', 'And keep a copy.'], ['그럼 고을 원으로 서명하십시오, 전하.', '그리고 사본을 남겨 두십시오.']),
		p(
			'The court is angrier than the king. Men in the Council hall who have not agreed on anything since the old queen died agree that a prefecture is an insult, and say so loudly, in rooms where no Tang officer is present.',
			'조정은 왕보다 더 화가 났다. 옛 여왕이 죽은 뒤로 무엇 하나 합의해 본 적 없는 회의장의 사내들이, 주라니 모욕이라는 데에는 뜻을 모은다. 그리고 당의 관리가 없는 방에서 큰 소리로 그렇게 말한다.'
		),
		d(
			'daeto',
			['They’re not wrong about everything, you know.', 'Have you seen their calendar? Every day accounted for. Our almanac can’t even agree with itself about the solstice.'],
			['저쪽이 다 틀린 건 아니잖습니까.', '그쪽 역법 보셨어요? 하루하루가 딱딱 맞아떨어집니다. 우리 책력은 동지가 언제인지도 저 혼자 우기는데.']
		),
		p('Nobody answers him. A few men remember afterwards that he said it.', '아무도 대꾸하지 않는다. 몇몇은 뒷날 그가 그 말을 했다는 것을 기억해 낸다.'),
		scene('Bear Ford', '웅진'),
		p(
			'In the second month of 664 the Tang name a Commander of the Bear Ford Commandery: <b>Buyeo Yung</b>, Euija’s crown prince, who knelt in front of Bupmin’s horse at Sabi and was spat on, and then went to Chang’an and came back in Tang robes. He is to govern what is left of Baekje on the emperor’s behalf, from the fortress where his father was arrested.',
			'664년 이월, 당은 웅진도독을 임명한다. <b>부여융</b>. 의자의 태자로, 사비에서 법민의 말 앞에 꿇어앉아 침을 맞았고, 장안에 갔다가 당의 관복을 입고 돌아온 사람이다. 그는 아버지가 붙잡힌 바로 그 성에서, 황제를 대신해 남은 백제를 다스리게 된다.'
		),
		p(
			'The Silla court hears the name and goes very quiet. Silla men died at the Yellow Mountain Fields for this ground. The Second Emperor promised it to Chunchu by lamplight. Now it has a Baekje prince on it again, holding a Tang seal.',
			'신라 조정은 그 이름을 듣고 아주 조용해진다. 신라 사람들이 황산벌에서 이 땅을 위해 죽었다. 선제는 등잔 불빛 아래 이 땅을 춘추에게 약속했다. 그런데 이제 그 땅 위에 다시 백제 왕자가, 당의 도장을 쥐고 앉아 있다.'
		),
		d('munmu', ['Everything south of Pyongyang, and the whole of Baekje.', 'My father made me learn it by heart.'], ['평양 이남과 백제 땅 전부.', '아버님이 그걸 외우게 하셨소.']),
		p(
			'Yung moves into the commandery offices in the spring. The rooms his father was taken from have been whitewashed. Liu Rengui shows him the registers, and the calendar, and the list of names he may not write.',
			'융은 봄에 도독부 관아로 들어간다. 아버지가 끌려 나간 방들은 하얗게 회칠이 되어 있다. 유인궤가 그에게 호적과 역서와, 써서는 안 될 이름 목록을 보여 준다.'
		),
		d(
			'liurengui',
			['Your households, Commander. Every one of them a number now. It makes them much easier to look after.'],
			['도독의 백성이오. 이제 모두 숫자요. 돌보기가 훨씬 쉬워지지.'],
			zh(['都督之戶口，今皆為數。易於撫養。'], ['Dūdū zhī hùkǒu, jīn jiē wéi shù. Yì yú fǔyǎng.'])
		),
		d('yung', ['…My father counted them by name.', 'He was wrong about most things. Not that.'], ['…아버님은 이름으로 세셨소.', '대부분은 틀리셨지만. 그건 아니었소.'])
	]
};

/* ============================================= 665 · new entry: Mount Gain */
const MOUNT_GAIN = {
	year: '665',
	sub: 'August',
	accent: '#b91c1c',
	title: 'Mount Gain',
	tone: 'oath and grief',
	subtitle: '취리산 회맹',
	badges: ['🐎', 'flag:tang', 'flag:silla', 'flag:baekje'],
	music: 'The Great River',
	images: [],
	blocks: [
		scene('The Altar', '제단'),
		p(
			'In the eighth month of 665, on a hill outside Bear Ford that the Tang clerks write as Chwirisan, the Mountain Where One Goes for Gain, the empire makes the two men who rule the south swear to be brothers.',
			'665년 팔월, 웅진 밖의 한 산에서 제국은 남쪽을 다스리는 두 사내에게 형제가 되겠다고 맹세하게 한다. 당의 서기들은 그 산을 취리산(就利山), 이(利)를 좇아가는 산이라 적는다.'
		),
		p(
			'The imperial envoy Liu Renyuan presides. The Black Tortoise has written the oath. On one side of the altar stands <b>King Munmu</b> of Silla. On the other stands <b>Buyeo Yung</b>, Commander of Bear Ford, whose face Munmu last saw at the height of his horse’s knees.',
			'칙사 유인원이 주관하고, 맹세문은 현무가 지었다. 제단 한쪽에 신라의 <b>문무왕</b>이 선다. 다른 쪽에는 웅진도독 <b>부여융</b>이 선다. 문무가 마지막으로 그 얼굴을 본 것은 제 말의 무릎 높이에서였다.'
		),
		q(
			'王與勅使劉仁願 熊津都督扶餘隆 盟于熊津就利山',
			'The king, with the imperial envoy Liu Renyuan and Buyeo Yung, Commander-in-chief of Ungjin, swore a covenant on Mount Chwiri at Ungjin.',
			'왕이 칙사 유인원, 웅진도독 부여융과 더불어 웅진 취리산에서 맹약하였다.',
			'Samguk Sagi (三國史記) bk. 6, Silla Annals — King Munmu, yr. 5 (665), eighth month'
		),
		scene('The White Horse', '백마'),
		p(
			'An oath of this weight needs a white horse. The Tang adjutant has been walking the Silla lines all morning looking for one, and stops in front of the only white horse in the camp.',
			'이만한 맹세에는 흰 말이 있어야 한다. 당의 부관이 아침 내내 신라의 진을 돌며 흰 말을 찾다가, 진영에 단 한 마리뿐인 흰 말 앞에서 멈춘다.'
		),
		sp('Tang adjutant', TANG, ['That one. Whose is he?'], ['저 말. 누구 것이오?'], zh(['那匹。誰的？'], ['Nà pǐ. Shéi de?'])),
		p(
			'<b>Hanseul</b> is past twenty. He has carried Kim Yushin across the Yellow Mountain Fields, through the snow to Pyongyang, and back over the Imjin with Goguryeo’s horsemen behind them. His muzzle has gone grey, which on a white horse nobody notices except the man who feeds him.',
			'<b>한슬</b>은 스무 살이 넘었다. 김유신을 태우고 황산벌을 건넜고, 눈을 헤치고 평양까지 갔으며, 고구려 기병을 등 뒤에 달고 임진강을 건너 돌아왔다. 주둥이가 하얗게 셌다. 흰 말이라 먹이 주는 사람 말고는 아무도 모른다.'
		),
		d('munmu', ['No. Find another. That is my uncle’s—'], ['안 되오. 다른 말을 찾으시오. 저건 외숙의—']),
		d('yushin', ['Let them have him, Majesty.'], ['내주십시오, 전하.']),
		d('munmu', ['Uncle.'], ['외숙.']),
		d('yushin', ['A white horse is what they asked for. It would be a poor oath on a brown one.', '…I’ll walk him up myself.'], ['흰 말을 달라 했습니다. 갈색 말로 하면 맹세가 초라하지요.', '…제가 끌고 올라가겠습니다.']),
		p(
			'He leads Hanseul up the hill by the halter, the way he led Hangyul across the Wolseong yard eighteen years before, talking to him in the low voice he keeps for horses and uses on no one else. At the altar he holds the head himself.',
			'그는 고삐를 잡고 한슬이를 언덕 위로 끈다. 열여덟 해 전 월성 마당에서 한결이를 끌던 그대로, 말에게만 쓰고 사람에게는 한 번도 쓰지 않는 낮은 목소리로 말을 건네면서. 제단 앞에서 그는 말머리를 손수 잡는다.'
		),
		p(
			'The knife is Tang. The blood goes into a bowl, and both men touch it to their lips. Yung does it without looking at anyone. Munmu does it looking at his uncle’s hands.',
			'칼은 당의 것이다. 피가 사발에 담기고, 두 사내가 그것을 입술에 댄다. 융은 아무도 보지 않고 한다. 문무는 외숙의 손을 보면서 한다.'
		),
		d(
			'liurengui',
			[
				'…Let them be as brothers, sharing disaster and pitying each other’s sorrows, forever as one.',
				'Whoever breaks this covenant, may the gods see it; may a hundred calamities fall on him, may his sons not grow, and may no one remain to keep his altars.'
			],
			['…형제처럼 지내며 재앙을 나누고 근심을 서로 보살펴, 길이 하나가 될지어다.', '이 맹약을 어기는 자는 신명이 굽어보시어 온갖 재앙이 내리고, 자손이 자라지 못하며, 그 사직을 지킬 자가 남지 않으리라.'],
			zh(['……結為兄弟，分災恤患，永以為好。', '有背此盟者，明神鑒之，百殃是降，子孫不育，社稷無守。'], ['…Jié wéi xiōngdì, fēn zāi xù huàn, yǒng yǐ wéi hǎo.', 'Yǒu bèi cǐ méng zhě, míngshén jiàn zhī, bǎi yāng shì jiàng, zǐsūn bú yù, shèjì wú shǒu.'])
		),
		p(
			'The covenant is written out three times. One copy is buried at the altar with the horse. One goes to Chang’an. The third is carried to Surabol and laid up in Silla’s ancestral temple, where the kings of Silla will have to walk past it every time they visit their fathers.',
			'맹세문은 세 벌 쓰인다. 한 벌은 말과 함께 제단에 묻힌다. 한 벌은 장안으로 간다. 나머지 한 벌은 서라벌로 옮겨져 신라의 종묘에 모셔진다. 신라의 왕들이 선왕을 뵈러 갈 때마다 그 앞을 지나가야 하는 자리다.'
		),
		scene('Surabol', '서라벌'),
		p('On the road home nobody in the Silla column says anything about the horse.', '돌아오는 길에 신라의 행렬 누구도 그 말 이야기를 꺼내지 않는다.'),
		p(
			'In Surabol the anger is louder. Silla men bled at the Yellow Mountain Fields, at Sabi and in the snow outside Pyongyang for land the emperor promised them, and now they have sworn on a dead horse never to take it. The young officers say the word betrayal in the barracks. The older ones say nothing, and start counting Tang garrisons.',
			'서라벌에서는 분노가 더 크다. 신라 사람들은 황제가 약속한 땅을 위해 황산벌에서, 사비에서, 평양 밖 눈 속에서 피를 흘렸는데, 이제 죽은 말 위에서 그 땅을 갖지 않겠다고 맹세했다. 젊은 장교들은 병영에서 배신이라는 말을 입에 올린다. 나이 든 장교들은 아무 말도 하지 않고, 당의 주둔지를 세기 시작한다.'
		),
		p('That night the king finds his uncle in the stable, cleaning a stall that is empty.', '그날 밤 왕은 마구간에서 외숙을 찾아낸다. 빈 마구간을 치우고 있다.'),
		d('munmu', ['I’ll find you another white horse, Uncle.'], ['흰 말은 내가 다시 구해 드리겠소, 외숙.']),
		d(
			'yushin',
			['I’m seventy, Majesty. I’ve buried three.', 'Find me a war instead. I’d like to go to one more before they make me swear to something else.'],
			['일흔입니다, 전하. 셋을 묻었습니다.', '말 대신 전쟁을 하나 찾아 주십시오. 또 무슨 맹세를 시키기 전에, 한 번만 더 가 보고 싶습니다.']
		)
	]
};
{
	const tamla = E('The Surrender of Tamla');
	const ch = chapterOf(tamla);
	ch.entries.splice(ch.entries.indexOf(tamla) + 1, 0, BEAR_FORD, MOUNT_GAIN);
}

/* ========================================== 665 · the death of Gesomun */
const COUP = E('The Brothers’ Coup');
{
	const e = E('The Death of Yeon Gesomun');
	const son = blk(e, 'You did not leave any brothers of your own.');
	son.en = ['Father.', 'You never kept a brother close.', 'One you sent to the far end of the southern border. The rest you cut down.'];
	son.lines = ['아버지.', '아버지는 형제를 곁에 두신 적이 없습니다.', '하나는 남쪽 국경 끝으로 보내셨고, 나머지는 다 베어 버리셨죠.'];
	insertAfter(
		e,
		'That is precisely why I am telling you.',
		q(
			'汝等兄弟 和如魚水 勿爭爵位 若不如是 必爲隣咲',
			'You brothers, be as close as fish and water. Do not quarrel over rank. If you do not heed this, you will surely be the laughingstock of your neighbours.',
			'너희 형제는 물고기와 물처럼 화목하고, 벼슬을 두고 다투지 마라. 그렇지 않으면 반드시 이웃의 웃음거리가 될 것이다.',
			'Nihon Shoki (日本書紀) bk. 27, Emperor Tenji, yr. 3 (664) — the dying words of the Goguryeo minister 蓋金'
		)
	);
	const reaper = blk(e, 'Which of you failed me at Salsu?');
	reaper.en = ['…Which of you failed me at the Snake River?', 'Come on. Ask. I am ready to say no again.'];
	reaper.lines = ['…사수에서 실패한 게 누구냐.', '자. 물어라. 이번에도 아니라고 할 준비는 됐다.'];
	const yumla = blk(e, 'My two best men could not bring you at the Snake River.');
	yumla.lines = yumla.lines.map((l) => l.replace('살수에서', '사수에서'));

	insertAfter(
		e,
		'takes on the title of Supreme Commander',
		p(
			'<b>Yeon Jungto</b>, who raised the two younger boys at his own table, is at the southern border when the news comes. He writes to Namgun that night. The answer, when it comes, is in a secretary’s hand.',
			'두 어린 조카를 제 밥상에서 키운 <b>연정토</b>는 그 소식이 왔을 때 남쪽 국경에 있다. 그는 그날 밤 남건에게 편지를 쓴다. 답장은, 오기는 오는데, 서기의 글씨다.'
		)
	);

	const sketch = img(e, 'three-brothers-sketch');
	const drop = ['Insolent— no. Then what would you have me do?', 'Traitor.', 'Traitor…?', 'They say the taller a man stands, the longer his shadow.'];
	for (const needle of drop) {
		const i = e.blocks.findIndex((b) => b.kind === 'dialogue' && (b.en ?? []).some((l) => l === needle || l.startsWith(needle)));
		if (i < 0) throw new Error(`Gesomun duplicate not found: ${needle}`);
		e.blocks.splice(i, 1);
	}
	moveImages(e, COUP, [sketch.id]);
	setAt(sketch, 'Traitor…?');

	const shoulders = blk(e, 'He broke the Sui memory at the Salsu');
	swap(shoulders, 'html', 'He broke the Sui memory at the Salsu and the Tang at Ansi and the White Tiger at the Snake River with his own hands', 'He outlasted the Second Emperor’s war and broke the White Tiger at the Snake River with his own hands');
	swap(shoulders, 'ko', '그는 살수의 기억과 안시의 당군과 사수의 백호를 제 손으로 부수었고', '그는 황제의 전쟁을 버텨 냈고 사수의 백호를 제 손으로 부수었으며');
	const last = blk(e, 'His last words were: do not fight one another.');
	last.html =
		'<i>His last words were: do not fight one another. His eldest son answered that he had never kept a brother close: one sent to the border, the rest cut down. Both of them were telling the truth, and neither of them could hear it.</i>';
	last.ko =
		'<i>그의 마지막 말은 이러했다. 서로 싸우지 말아라. 맏아들은 아버지께서는 형제를 곁에 두신 적이 없노라고, 하나는 국경으로 보내고 나머지는 다 베어 버리셨노라고 대답했다. 둘 다 진실을 말하고 있었고, 둘 다 그것을 듣지 못했다.</i>';
}

/* ========================================================= 666 · the coup */
{
	const e = COUP;
	const b = (needle) => blk(e, needle);
	const launch = b('This one has a guide.');
	const decree = b('I have already destroyed Baekje');
	const messenger = b('All of a sudden, a messenger come with an urgent message.');
	const samhan = b('Your Majesty will never conquer Samhan alone.');
	const insolent = b('Insolent— no.');
	const traitor = e.blocks.find((x) => x.kind === 'dialogue' && x.en?.[0] === 'Traitor.');
	const traitorQ = b('Traitor…?');
	const joseon = b('How did Joseon fall?');
	const defection = b('Defection of Yeon Namseng');
	const rides = b('Namseng rides west, across the river');
	const swindlers = b('Goryeo is nothing but swindlers and thieves');
	const face = b('I have seen that face somewhere.');
	const liao = b('when you crossed the Liao');
	const house = b('second time in his life he has been offered a house in Chang’an');
	const banzai = b('ten thousand years…!');
	const title = b('Namseng is given a Tang title');
	const jungto = b('takes twelve cities over to Silla');

	messenger.html = 'A messenger comes to the provincial camp with an urgent message. Namseng meets him in his quarters.';
	messenger.ko = '전령이 급보를 들고 순시 중인 진영으로 온다. 남생이 처소에서 그를 맞는다.';
	face.person = 'gaozong';
	face.chip = chipOf('gaozong');
	face.lines = ['…아버님께서 요하에서 만난 아이 이야기를 하신 적이 있소.', '무릎을 꿇지 않았다던.'];
	face.en = ['…My father spoke of a boy he met at the Liao.', 'One who would not kneel.'];
	face.zh = ['……先帝說過，在遼水遇見一個孩子。', '不肯下跪的。'];
	face.zhLatn = ['…Xiāndì shuō guò, zài Liáoshuǐ yùjiàn yí ge háizi.', 'Bù kěn xiàguì de.'];
	liao.en = ['Twenty years ago, Majesty. Your father and I, when he crossed the Liao.', 'I did not kneel then.'];
	liao.lines = ['스무 해 전입니다, 폐하. 선제와 저. 선제께서 요수를 건너오셨을 때.', '그때는 무릎을 꿇지 않았지요.'];
	jungto.html =
		'In the south their uncle <b>Yeon Jungto</b>, who raised two of them, waits to hear which nephew will send for him. Neither does. He takes twelve cities over to Silla, and the family is finished in three directions at once.';
	jungto.ko = '남쪽에서는 그 둘을 키운 숙부 <b>연정토</b>가 어느 조카가 자기를 부르러 올지 기다린다. 아무도 오지 않는다. 그는 열두 성을 들고 신라로 넘어가고, 그 집안은 한꺼번에 세 방향에서 끝난다.';

	e.blocks = [
		launch,
		decree,
		scene('The Provinces', '지방 순시'),
		p(
			'In the spring Namseng goes out to inspect the provinces, as a new Supreme Commander should, and leaves his two younger brothers to keep the capital.',
			'봄, 남생은 새 대막리지답게 지방 순시에 나서고, 두 아우에게 도성을 맡긴다.'
		),
		p(
			'Within a month there are men whispering in both directions. To Namgun and Namsan: your brother means to be rid of you when he comes back. To Namseng, at every post station: your brothers do not mean to let you back in.',
			'한 달이 못 되어 양쪽으로 귓속말하는 자들이 생긴다. 남건과 남산에게는, 형님이 돌아오면 너희를 치울 생각이라고. 역참마다 남생에게는, 아우들이 형님을 들이지 않을 생각이라고.'
		),
		d('namseng', ['Nonsense. They are my brothers.', '…Send someone back anyway. Quietly. I want to know what they say at supper.'], ['헛소리다. 내 아우들이다.', '…그래도 한 사람 돌려보내라. 조용히. 저녁 자리에서 무슨 말들을 하는지 알고 싶다.']),
		p(
			'The man he sends is caught at the Pyongyang gate within the week. Namgun reads the orders found on him twice, and the second time he reads them as a confession.',
			'그가 보낸 자는 한 주 만에 평양 성문에서 붙잡힌다. 남건은 그 몸에서 나온 지시를 두 번 읽고, 두 번째에는 자백으로 읽는다.'
		),
		d('namgun', ['He sends spies. To his own brothers.', 'Shut the gates! Tell the king the Supreme Commander has rebelled!'], ['첩자를 보내? 친아우들한테?', '성문 닫아라! 폐하께 아뢰어라, 대막리지가 반역했다고!']),
		messenger,
		p('He rides back to his own capital and finds the gate shut. His brother comes up onto the wall.', '그는 제 도성으로 말을 몰아 돌아오고, 성문이 닫혀 있는 것을 본다. 아우가 성벽 위로 올라온다.'),
		d('namseng', ['Open the gate, Namgun.', 'You are speaking to the Supreme Commander.'], ['문 열어라, 남건아.', '대막리지에게 하는 말이다.']),
		insolent,
		traitor,
		traitorQ,
		joseon,
		p(
			'Namseng goes north to the old capital at Gungnae, and sends his son to Chang’an to ask the Third Emperor for an army.',
			'남생은 북쪽 옛 도읍 국내성으로 가서, 아들을 장안에 보내 황제에게 군대를 청한다.'
		),
		defection,
		rides,
		swindlers,
		face,
		liao,
		house,
		samhan,
		banzai,
		title,
		jungto
	];
	setAt(img(e, 'namseng-betrayal'), 'Open the gate, Namgun');
}

/* =================================================== 668 · Pyongyang, A */
{
	const e = E('Pyongyang, A');
	insertBefore(
		e,
		'The monk aristocracy Yeon tried to starve',
		p(
			'When the Tang ring closes, Namgun gives the defence of the city to the one man in Pyongyang every faction still trusts: the monk <b>Shinsung</b>, abbot for twenty-five years of the lesser house at the bottom of the hill, who has never asked anyone for anything.',
			'당의 포위가 조여 오자, 남건은 성의 방어를 평양에서 모든 파벌이 아직 믿는 단 한 사람에게 맡긴다. 언덕 아래 작은 절을 이십오 년째 지켜 온, 누구에게도 무엇 하나 청해 본 적 없는 승려 <b>신성</b>이다.'
		),
		d(
			'namgun',
			['You have no clan, no faction, no sons.', 'You’re the only man in this city I can’t imagine selling it.'],
			['스님은 가문도 없고, 파벌도 없고, 자식도 없소.', '이 성에서 성을 팔아넘기는 게 상상이 안 되는 사람은 스님뿐이오.']
		),
		d('shinsung', ['Then I shall try to be worthy of your imagination, Mangniji.'], ['그럼 대막리지의 상상에 걸맞도록 애써 보겠습니다.']),
		p(
			'For five days a novice walks out of the lesser house before dawn with an alms bowl and comes back with it empty, and nobody thinks to ask why a monk’s bowl should come back empty from the direction of the Tang lines. On the fifth night the bell that has sat on the floor of the lesser house since the year the Daoists came is struck once.',
			'닷새 동안 한 사미승이 새벽마다 바리때를 들고 작은 절을 나섰다가 빈 바리때로 돌아온다. 스님의 바리때가 왜 당의 진 쪽에서 비어서 돌아오는지 아무도 묻지 않는다. 닷새째 밤, 도사들이 오던 해부터 작은 절 바닥에 놓여 있던 종이 한 번 울린다.'
		)
	);
	const lastCry = e.blocks.map((x, i) => [x, i]).filter(([x]) => x.kind === 'dialogue' && x.person === 'namgun' && x.en?.[0] === 'Goguryeo… never dies….!').pop();
	if (!lastCry) throw new Error('Namgun last cry not found');
	e.blocks.splice(
		lastCry[1] + 1,
		0,
		p(
			'When the gate towers burn, Namgun stabs himself in his own hall. He does it badly, the first thing he has done badly in the whole war, and the Tang surgeons save him so that he can be sent alive to the farthest edge of the empire.',
			'문루가 불타자 남건은 제 전각에서 스스로를 찌른다. 서툴게 찌른다. 그 전쟁 내내 그가 처음으로 서툴게 한 일이다. 당의 의원들이 그를 살려 내고, 그는 산 채로 제국의 가장 먼 끝으로 보내진다.'
		)
	);
	insertAfter(
		e,
		'King Bojang of Goguryeo surrendered.',
		p(
			'Before the captives are shown to the living emperor, the Blue Dragon takes them up the mountain to show them to the dead one. The king of Goguryeo is made to bow at Zhaoling, in front of the door the Second Emperor said his horses would guard. The six stone horses stand in their row. The purple one is nearest the door.',
			'포로들을 산 황제에게 보이기 전에, 청룡은 그들을 산 위로 데려가 죽은 황제에게 먼저 보인다. 고구려의 왕은 소릉에서, 선제가 제 말들이 지키리라 했던 그 문 앞에 절하게 된다. 여섯 돌말이 줄지어 서 있다. 자줏빛 말이 문에 가장 가깝다.'
		)
	);
}

/* =========================================== 671 · new entry: the letters */
const LETTERS = {
	year: '671',
	sub: 'July',
	accent: '#b91c1c',
	title: 'Your Humble Servant',
	tone: 'epistolary duel',
	subtitle: '답설인귀서',
	badges: ['✉️', 'flag:tang', 'flag:silla'],
	music: 'The Long War',
	images: [],
	blocks: [
		scene('The First Letter', '첫 번째 편지'),
		p(
			'In the seventh month of 671 a Tang monk named Imyun is rowed ashore under a white flag with a letter from the fleet. The fleet belongs to <b>Xue Rengui</b>, White Tiger II, who has been sitting off the coast all summer and would prefer, if it can be managed, to win this war by post.',
			'671년 칠월, 임윤이라는 당나라 승려가 흰 깃발을 단 배를 타고 뭍에 오른다. 함대에서 온 편지를 들고서. 함대의 주인은 백호 2세 <b>설인귀</b>다. 여름 내내 해안 밖에 떠 있던 그는, 될 수만 있다면 이 전쟁을 편지로 이기고 싶어 한다.'
		),
		sp(
			'Imyun',
			'#8f7b70',
			['The Commander sends his respects, Majesty. He asks that it be read aloud.', 'He says it reads better aloud.'],
			['대총관께서 문안을 여쭙니다, 전하. 소리 내어 읽어 주십사 하셨습니다.', '소리 내어 읽어야 더 좋다고요.'],
			zh(['大總管問候大王。請高聲宣讀。', '他說讀出來更好。'], ['Dà zǒngguǎn wènhòu dàwáng. Qǐng gāoshēng xuāndú.', 'Tā shuō dú chūlái gèng hǎo.'])
		),
		d(
			'xuerengui',
			[
				'To the King of Silla, from Xue Rengui, Commander of the Eastern Fleet, greetings.',
				'A clear wind blows ten thousand li from the capital to your coast, and the sea between is three thousand. I have come all of it to say one thing.',
				'Your father knelt before the Second Emperor and was raised up. He was given robes, and a brother, and an army. You were given his crown.',
				'And now you take the land the emperor’s soldiers bled for, and you shelter his rebels, and your own brother waits in Chang’an, ashamed to be asked about you.',
				'Turn back while there is still a road to turn on.',
				'I have the honour to remain, in all things but this, Your Majesty’s servant —',
				'Xue Rengui.'
			],
			[
				'신라 왕께, 동방 행군대총관 설인귀가 문안드립니다.',
				'맑은 바람은 도성에서 그대 해안까지 만 리를 불고, 그 사이 바다는 삼천 리입니다. 그 길을 다 건너와 드릴 말씀은 하나뿐입니다.',
				'그대의 아버님은 선제 앞에 무릎을 꿇었고, 일으켜 세워졌습니다. 관복을 받고, 형제를 얻고, 군대를 얻었지요. 그대는 그분의 왕관을 받았고요.',
				'그런데 이제 그대는 황제의 병사들이 피 흘린 땅을 차지하고, 황제의 반역자들을 감싸 주고 있습니다. 그대의 아우는 장안에서, 형님 소식을 물을까 봐 고개를 들지 못합니다.',
				'돌아설 길이 남아 있을 때 돌아서십시오.',
				'이 일 하나만 빼고 모든 일에서, 전하의 종으로 남기를 영광으로 여기며 —',
				'설인귀.'
			],
			zh(
				[
					'新羅王足下：東方行軍大總管薛仁貴致意。',
					'清風萬里，大海三千。仁貴遠來，只為一言。',
					'先王跪於先帝之前，蒙恩而起；賜之冠服，結為兄弟，假以兵馬。王受其冠。',
					'今王據天兵流血之地，庇朝廷之叛臣；令弟在長安，人問及王，羞不能答。',
					'及路未絕，回頭可也。',
					'仁貴除此一事之外，萬事皆為大王之僕——',
					'薛仁貴。'
				],
				[
					'Xīnluó wáng zúxià: Dōngfāng xíngjūn dà zǒngguǎn Xuē Rénguì zhìyì.',
					'Qīngfēng wàn lǐ, dàhǎi sān qiān. Rénguì yuǎn lái, zhǐ wèi yì yán.',
					'Xiānwáng guì yú xiāndì zhī qián, méng ēn ér qǐ; cì zhī guānfú, jié wéi xiōngdì, jiǎ yǐ bīngmǎ. Wáng shòu qí guān.',
					'Jīn wáng jù tiānbīng liúxuè zhī dì, bì cháotíng zhī pànchén; lìngdì zài Cháng’ān, rén wèn jí wáng, xiū bù néng dá.',
					'Jí lù wèi jué, huítóu kě yě.',
					'Rénguì chú cǐ yí shì zhī wài, wànshì jiē wéi dàwáng zhī pú——',
					'Xuē Rénguì.'
				]
			)
		),
		p('The monk is given a bed, a meal, and as long as it takes. The king does not go to bed at all.', '승려에게는 잠자리와 끼니와, 필요한 만큼의 시간이 주어진다. 왕은 아예 잠자리에 들지 않는다.'),
		scene('The Writing Room', '글방'),
		p(
			'By the second night the king’s writing room is full of men with opinions. One of them, an official named <b>Daeto</b>, has more than most.',
			'이틀째 밤, 왕의 글방은 할 말 있는 사내들로 가득하다. 그중 <b>대토</b>라는 관리는 남들보다 할 말이 많다.'
		),
		d(
			'daeto',
			['Majesty, a softer word here and there costs nothing.', 'They have a fleet off Bear Ford. They have Prince Inmun. Could we not say we were mistaken about the border? Everyone is mistaken about borders.'],
			['전하, 여기저기 말 한두 마디 누그러뜨린다고 손해 볼 건 없습니다.', '저들은 웅진 앞바다에 함대가 있고, 인문 공도 데리고 있습니다. 국경을 잘못 알았다고 하면 안 되겠습니까? 국경이야 다들 잘못 아는 거잖습니까.']
		),
		d('munmu', ['We were not mistaken.', 'Write it the way I say it.'], ['잘못 알지 않았소.', '내가 말하는 대로 쓰시오.']),
		p(
			'There is another reason the room is careful. Not long ago the king put one of his own great nobles, Kim Jinju, to death with his household, for pleading sickness while the country was at war. Jinju’s son <b>Kim Punghun</b> was not in the household. He is in Chang’an, in the emperor’s guard, where the sons of vassal houses are kept, and somebody there will already have told him.',
			'방 안이 조심스러운 까닭이 하나 더 있다. 얼마 전 왕은 나라가 전쟁 중인데 병을 핑계 댔다는 죄로 대아찬 김진주를 그 집안과 함께 죽였다. 진주의 아들 <b>김풍훈</b>은 그 집안에 없었다. 그는 장안에서, 번국의 아들들을 두는 황제의 숙위로 있고, 그곳의 누군가가 이미 그에게 말했을 것이다.'
		),
		scene('The Reply', '답서'),
		d(
			'munmu',
			['To the Commander of the Eastern Fleet, from the King of Silla.', 'Your letter came by a monk, and was read aloud as you asked. It does read better aloud. So will this.'],
			['동방 행군대총관께, 신라 왕이 보내오.', '그대의 편지는 승려 편에 왔고, 청한 대로 소리 내어 읽었소. 과연 소리 내어 읽으니 낫더이다. 이 편지도 그럴 것이오.']
		),
		p('He dictates the rest standing up, and does not stop for most of the night.', '그는 나머지를 선 채로 받아쓰게 하고, 밤새 거의 멈추지 않는다.'),
		d(
			'munmu',
			[
				'In the twenty-second year of Zhenguan my father went to Chang’an. The Second Emperor took him into a gallery of stone horses and said: everything south of Pyongyang, and the whole of Baekje, shall be Silla’s, forever.',
				'My father made me learn those words when I was twenty-two. I have them still. I expect the emperor’s clerks have them too.'
			],
			[
				'정관 이십이 년에 내 아버님이 장안에 가셨소. 선제께서는 아버님을 돌말들이 늘어선 회랑으로 데려가 말씀하셨지. 평양 이남과 백제 땅은 모두 신라의 것이다, 영원히.',
				'아버님은 내가 스물둘일 때 그 말을 외우게 하셨소. 나는 지금도 외우오. 황제의 서기들도 외우고 있으리라 믿소.'
			]
		),
		d(
			'munmu',
			[
				'When your Red Fowl sat outside Pyongyang eating his horses, my uncle was sixty-seven. He walked beside his own white horse through snow to its chest so the horse could carry rice instead of him. Your soldiers wept when they saw the carts. Your general took the rice and sailed home the same week.',
				'We were late, he said. We are always late. We came anyway.'
			],
			[
				'그대의 주작이 평양 밖에 앉아 제 말을 잡아먹고 있을 때, 내 외숙은 예순일곱이었소. 가슴까지 차는 눈 속을, 제 흰 말이 자기 대신 쌀을 지도록 그 곁에서 걸어갔소. 그대의 병사들은 수레를 보고 울었소. 그대의 장군은 쌀을 받고 그 주에 배를 타고 돌아갔고.',
				'늦었다 하더이다. 우리는 늘 늦소. 그래도 갔소.'
			]
		),
		d(
			'munmu',
			[
				'Then you gave Baekje back to a Baekje prince, with a Tang seal, at Bear Ford. Then you took us up a hill called Gain and made us swear to be his brother over a dead horse.',
				'The horse was my uncle’s. He walked it up himself. I watched his hands.'
			],
			[
				'그러고 나서 그대들은 백제를 백제 왕자에게 돌려주었소. 당의 도장을 찍어서, 웅진에. 그러고는 우리를 취리산이라는 산으로 데려가, 죽은 말 위에서 그자의 형제가 되겠다고 맹세하게 했지.',
				'그 말은 내 외숙의 말이었소. 외숙이 손수 끌고 올라갔소. 나는 그 손을 보았소.'
			]
		),
		d(
			'munmu',
			[
				'At Pyongyang our men went through the gate first. Then your Protectorate came and wrote our share down as nothing.',
				'You say I shelter rebels. I shelter the people your officials could not be bothered to count.'
			],
			['평양에서는 우리 군사가 먼저 성문을 넘었소. 그러자 그대들의 도호부가 와서 우리 몫을 없음이라 적었지.', '그대는 내가 반역자를 감싼다 하오. 나는 그대의 관리들이 세어 볼 생각도 하지 않은 백성을 감싸는 것이오.']
		),
		d(
			'munmu',
			['My brother is in Chang’an. Tell him I am well. Tell him I said his name.', 'I have the honour to remain the king of the country you came to save —', 'Bupmin.'],
			['내 아우는 장안에 있소. 잘 있다고 전해 주시오. 내가 그 이름을 불렀다고도.', '그대들이 구하러 왔다던 그 나라의 왕으로 남기를 영광으로 여기며 —', '법민.']
		),
		p(
			'Daeto copies it out fair. His hand is very steady. Later that night he writes a second letter, a short one, to a different address, and puts it in his sleeve, and does not send it yet.',
			'대토가 그것을 정서한다. 손이 아주 차분하다. 그날 밤 늦게 그는 두 번째 편지를 쓴다. 짧은 편지다. 받는 곳이 다르다. 그는 그것을 소매에 넣고, 아직은 보내지 않는다.'
		),
		scene('The Second Letter', '두 번째 편지'),
		d(
			'xuerengui',
			['Your Majesty’s letter has been received, and read aloud. It took most of an afternoon.', 'Nowhere in it is the word “sorry.”', 'I have the honour to remain your servant, in fewer things than before —', 'Xue.'],
			['전하의 편지를 받아, 소리 내어 읽었습니다. 오후 한나절이 걸리더군요.', '그 어디에도 ‘송구하다’는 말은 없었습니다.', '전보다는 적은 일에서, 전하의 종으로 남기를 영광으로 여기며 —', '설.'],
			zh(['大王來書已收，高聲讀畢，費去大半個下午。', '通篇不見一個「罪」字。', '仁貴於更少之事上，仍為大王之僕——', '薛。'], ['Dàwáng láishū yǐ shōu, gāoshēng dú bì, fèi qù dà bàn ge xiàwǔ.', 'Tōngpiān bú jiàn yí ge “zuì” zì.', 'Rénguì yú gèng shǎo zhī shì shàng, réng wéi dàwáng zhī pú——', 'Xuē.'])
		),
		d(
			'munmu',
			['The Commander’s letter has been received. It took no time at all.', 'Nowhere in it is the word “rice.”', 'I have the honour to remain the king —', 'B.'],
			['대총관의 편지를 받았소. 읽는 데 시간이 하나도 안 걸렸소.', '그 어디에도 ‘쌀’이라는 말은 없더이다.', '왕으로 남기를 영광으로 여기며 —', '법.']
		),
		d(
			'xuerengui',
			['Then I will come and fetch the apology myself.', '— X.'],
			['그럼 사과는 제가 직접 받으러 가겠습니다.', '— 설.'],
			zh(['那麼，這一聲歉，仁貴親自來取。', '——薛。'], ['Nàme, zhè yì shēng qiàn, Rénguì qīnzì lái qǔ.', '——Xuē.'])
		),
		d('munmu', ['Come, then.', '— B.'], ['오시오.', '— 법.']),
		scene('Seventy Ships', '일흔 척'),
		p(
			'He comes. In the tenth month, off the western coast, a Silla squadron finds seventy Tang transports riding low with grain for the garrison at Bear Ford, and takes them: hulls, crews, one Tang colonel, and all of the rice.',
			'그는 온다. 시월, 서해안 앞바다에서 신라 선단이 웅진 주둔군에게 갈 곡식을 싣고 무겁게 떠가는 당의 수송선 일흔 척을 찾아내 사로잡는다. 배와 사공과 당나라 낭장 하나, 그리고 쌀 전부를.'
		),
		d('munmu', ['Send word to the White Tiger that his rice has arrived.', 'Late. As usual.'], ['백호에게 기별하시오. 그의 쌀이 도착했다고.', '늦게. 늘 그렇듯이.'])
	]
};
{
	const stone = E('Stone Gate');
	const ch = chapterOf(stone);
	ch.entries.splice(ch.entries.indexOf(stone), 0, LETTERS);
}

/* ======================================================= 673 · Yushin, Daeto */
{
	const e = E('The Death of Kim Yushin');
	insertAfter(
		e,
		'He is buried at Geumsan with the honours of a king',
		p(
			'The same month, an official named <b>Daeto</b> is found to have been writing to the Tang, promising them a door, the way a man at Daeya once promised Baekje a granary. He is executed, his wife and children are made slaves, and nobody mentions it at the funeral.',
			'같은 달, <b>대토</b>라는 관리가 당에 편지를 써 왔다는 것이 드러난다. 언젠가 대야성의 한 사내가 백제에 곳간을 약속했듯, 그는 당에 문 하나를 약속했다. 그는 처형되고, 처자는 노비가 되며, 장례 자리에서 그 이야기를 꺼내는 사람은 아무도 없다.'
		)
	);
}

/* ============================================================ 675 · Maeso */
{
	const e = E('Maeso Fortress');
	e.blocks.unshift(
		scene('The Other King', '또 하나의 임금'),
		p(
			'In 674 the Third Emperor strips King Munmu of every Tang title and names a new king of Silla: <b>Kim Inmun</b>, Munmu’s younger brother, who has lived in Chang’an since he was nineteen and has to be told by an official that he is going home with an army.',
			'674년, 황제는 문무왕에게서 당의 관작을 모두 거두고 새 신라 왕을 세운다. 열아홉에 장안에 와서 줄곧 그곳에 살아 온 문무의 아우 <b>김인문</b>이다. 그는 군대를 데리고 고국에 가게 되었다는 말을 관리에게서 들어야 한다.'
		),
		d(
			'inmun',
			['Majesty, he is my brother.', '…Yes. I understand. I will go.'],
			['폐하, 그는 신의 형입니다.', '…예. 알겠습니다. 가겠습니다.'],
			zh(['陛下，他是臣的兄長。', '……是。臣明白。臣去。'], ['Bìxià, tā shì chén de xiōngzhǎng.', '…Shì. Chén míngbai. Chén qù.'])
		),
		p(
			'He goes as far as the coast. The next spring Munmu sends tribute and an apology worded so beautifully that the emperor restores his titles, and Inmun is quietly sent back to Chang’an, a king of nowhere, to live there for the rest of his life.',
			'그는 바닷가까지 간다. 이듬해 봄, 문무가 공물과 함께 더없이 아름다운 말로 쓴 사죄문을 보내자 황제는 그의 관작을 되돌려 주고, 인문은 조용히 장안으로 돌려보내진다. 어디의 왕도 아닌 채로, 그곳에서 남은 생을 산다.'
		)
	);
	const pilot = blk(e, 'the son of a hostage, showing the Tang fleet the way into his own coast');
	swap(pilot, 'html', 'the son of a hostage, showing the Tang fleet the way into his own coast', 'the son of a man Munmu executed, showing the Tang fleet the way into his own coast');
	swap(pilot, 'ko', '볼모의 아들이', '문무가 죽인 사람의 아들이');

	const form = e.blocks.find((x) => x.kind === 'formation');
	const xueUnit = form.sides[0].units.find((u) => u.label.startsWith('Xue Rengui'));
	xueUnit.label = 'Li Jinxing · Mohe and Tang';
	xueUnit.sub = 'a Mohe chief’s son in Tang service — the Samguk Sagi says 200,000';

	const herd = blk(e, 'The army at Maeso is mostly Mohe');
	swap(herd, 'html', 'The army at Maeso is mostly Mohe', 'The army at Maeso is <b>Li Jinxing</b>’s, and it is mostly Mohe');
	swap(herd, 'ko', '매소성의 군대는 대부분 말갈이고', '매소성의 군대는 <b>이근행</b>의 것이고, 대부분 말갈이며');
	insertBefore(
		e,
		'So the horses are gone.',
		p('Out at sea off Cheonseong, Xue hears it from a courier: the army at Maeso has lost its horses.', '천성 앞바다에서 설인귀는 파발에게서 그 소식을 듣는다. 매소성의 군대가 말을 잃었다.')
	);
}

/* ======================================================= 692 · Taejong */
{
	const e = E('The King for All');
	e.blocks.push(
		scene('692', '692년'),
		p(
			'Eleven years after the tide closes over him, an envoy comes from the Empress’s court with a complaint that is thirty years late. King Muyeol’s tablet in Silla’s ancestral temple says Taejong, and Taejong is the Second Emperor’s temple name, and a vassal may not share a name with the Son of Heaven.',
			'밀물이 그를 덮은 지 열한 해 뒤, 여제의 조정에서 사신이 온다. 삼십 년 늦은 항의를 들고. 신라 종묘의 무열왕 위패에 태종이라 적혀 있는데, 태종은 선제의 묘호이고, 번국은 천자와 이름을 나눌 수 없다는 것이다.'
		),
		sp(
			'Tang envoy',
			TANG,
			['Your late king has borrowed a name that belongs to the Second Emperor.', 'Change it.'],
			['그대들의 선왕이 선제의 묘호를 빌려 쓰고 있소.', '고치시오.'],
			zh(['爾先王竊用先帝廟號。', '速改之。'], ['Ěr xiānwáng qiè yòng xiāndì miàohào.', 'Sù gǎi zhī.'])
		),
		p('Munmu’s son answers in writing.', '문무의 아들이 글로 답한다.'),
		sp(
			'Silla reply',
			chipOf('munmu'),
			[
				'Our late king had a great deal of virtue. While he lived he had a good minister, Kim Yushin, and the two of them were of one mind, and they made the three Han one.',
				'We thought that was worth a name. We did not know it was already taken.'
			],
			['선왕께서는 덕이 자못 높으셨고, 살아 계실 때 김유신이라는 어진 신하를 얻어 한마음으로 다스려 삼한을 하나로 만드셨습니다.', '그만하면 이름 하나 값은 된다고 여겼습니다. 이미 임자가 있는 줄은 몰랐습니다.']
		),
		p(
			'The court reads the name Kim Yushin, and somebody there remembers a story about him, and the complaint is dropped. The tablet still says Taejong.',
			'조정은 김유신이라는 이름을 읽고, 그곳의 누군가가 그에 얽힌 이야기 하나를 떠올리고, 항의는 거두어진다. 위패에는 지금도 태종이라 적혀 있다.'
		)
	);
}

/* ======================================== the Guardian of Ansi, unnamed */
let guardian = 0;
for (const e of allEntries())
	for (const im of e.images ?? [])
		for (const k of Object.keys(im))
			if (typeof im[k] === 'string' && im[k].includes('Yang Manchun')) {
				im[k] = im[k].replace(/Yang Manchun’s/g, 'the Guardian of Ansi’s').replace(/Yang Manchun/g, 'the Guardian of Ansi');
				guardian++;
			}

/* ============================================================== validate */
const after = anchorMap();
const problems = [];
for (const [im, was] of before) {
	if (retargeted.has(im)) continue;
	const now = after.get(im);
	if (now !== was) problems.push(`${im.id}: “${im.at}” moved ${was ? textOf(was).slice(0, 50) : '∅'} → ${now ? textOf(now).slice(0, 50) : '∅ (opening)'}`);
}
for (const im of retargeted) if (!after.get(im)) problems.push(`${im.id}: retargeted “${im.at}” matches nothing`);

const leftovers = JSON.stringify(story).match(/Yang Manchun|양만춘/g) ?? [];
console.log(`Guardian of Ansi: ${guardian} image fields renamed, ${leftovers.length} name mentions left`);

if (problems.length) {
	console.log(`\n${problems.length} anchor problem(s):`);
	problems.forEach((x) => console.log('  - ' + x));
	process.exit(1);
}
console.log('anchors: all stable');

if (DRY) {
	console.log('dry run, nothing written');
	process.exit(0);
}
fs.mkdirSync(path.dirname(BACKUP), { recursive: true });
if (!fs.existsSync(BACKUP)) fs.writeFileSync(BACKUP, raw);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('story.json written; backup at', path.relative(ROOT, BACKUP));
