// The High Councillors by the record (상대등): Geochilbu 576 → Noribu 579 → Suulbu 588 → Eulje 632 → Supum 636 →
// Bidam 645 → Alchun 647 → Geumgang 655 → Kim Yushin 660. Eulje is the boy with the brush at Jinji's councils;
// Sukhuljong is Suulbu; Yushin takes the first chair after the Yellow Mountain; Jukji is Jukjuk's younger brother.
// Usage: node scripts/.cache/councillors.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = story.flatMap((c) => c.entries ?? []);
const find = (t) => entries.find((e) => e.title === t);
const plain = (b) => (b.html ?? (b.en ?? []).join(' / ') ?? '').replace(/<[^>]+>/g, '');
const at = (e, frag) => e.blocks.findIndex((b) => plain(b).includes(frag));
const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });
const log = [];

/* ——— Eulje, the boy with the brush ——— */
const bi = find('Bihyung');
for (const b of bi.blocks) {
	if (b.person === 'supum') b.person = 'eulje';
	if (b.html?.includes('Supum is fifteen.')) {
		b.html = b.html.replace('Supum is fifteen.', 'Eulje is twenty-one.');
		b.ko = b.ko?.replace(/수품은 열다섯(이다|살이다)\./, '을제는 스물하나다.');
	}
	if (b.html?.includes('Supum writes the new king’s name')) {
		b.html =
			'The vote is unanimous. It always is, here. Eulje writes the new king’s name in the minutes, very neatly. Fifty-six years later he will sit at the head of this table, a very old man, and swear in a queen. Remember his face.';
		b.ko =
			'표결은 만장일치다. 여기선 늘 그렇다. 을제는 새 임금의 이름을 회의록에 아주 단정하게 적는다. 쉰여섯 해 뒤, 아주 늙은 그는 이 탁자 맨 윗자리에 앉아 여왕의 즉위를 맞는다. 이 얼굴을 기억해 두라.';
		log.push('Bihyung: Supum → Eulje');
	}
}

/* the 579 deposition flashback: Geochilbu in the first chair */
const hc = find('Harmony Council');
const walk = (bs, fn) => bs.forEach((b) => (b.kind === 'flashback' ? walk(b.blocks ?? [], fn) : fn(b)));
walk(hc.blocks, (b) => {
	if (b.kind === 'dialogue' && b.speaker === 'The High Councillor') {
		delete b.speaker;
		delete b.chip;
		delete b.gender;
		b.person = 'geochilbu';
		log.push('Harmony Council: 579 chair → Geochilbu');
	}
});
const unmade = at(hc, 'Six mats unmade a king in this room.');
if (unmade >= 0 && at(hc, 'Eulje is seventy-seven now.') < 0) {
	hc.blocks.splice(
		unmade + 1,
		0,
		p(
			'One of tonight’s six was in the room that night too, at the end of the table with a brush. Eulje is seventy-seven now. Nobody has to explain the rules to him.',
			'오늘 밤 여섯 가운데 하나는 그날 밤에도 이 방에 있었다. 탁자 끝에서 붓을 들고. 을제는 이제 일흔일곱이다. 그에게 규칙을 설명해 줄 사람은 없다.'
		)
	);
}

/* ——— Suulbu (the record’s Sukhuljong) ——— */
let renamed = 0;
for (const e of entries) {
	walk(e.blocks, (b) => {
		if (b.kind === 'quote') return;
		for (const k of ['html', 'ko', 'label', 'speaker', 'caption']) {
			if (typeof b[k] === 'string' && /Sukhuljong|숙흘종/.test(b[k])) {
				b[k] = b[k].replace(/Sukhuljong/g, 'Suulbu').replace(/숙흘종/g, '수을부');
				renamed++;
			}
		}
		for (const k of ['en', 'lines']) if (Array.isArray(b[k])) b[k] = b[k].map((l) => (/Sukhuljong|숙흘종/.test(l) ? (renamed++, l.replace(/Sukhuljong/g, 'Suulbu').replace(/숙흘종/g, '수을부')) : l));
	});
	for (const im of e.images ?? []) for (const k of ['alt', 'prompt', 'at']) if (typeof im[k] === 'string' && /Sukhuljong/.test(im[k])) im[k] = im[k].replace(/Sukhuljong/g, 'Suulbu');
}
log.push(`Suulbu: ${renamed} renames`);
const sh = find('Seohyun');
const stable = at(sh, 'The stable belongs to Prince Suulbu');
if (stable >= 0 && !sh.blocks[stable].html.includes('two names')) {
	sh.blocks[stable].html = sh.blocks[stable].html.replace('the Cloud King’s younger brother.', 'the Cloud King’s younger brother. The records give him two names; the street uses the shorter one.');
	sh.blocks[stable].ko = sh.blocks[stable].ko?.replace(/(진흥왕의 아우다\.|구름 임금의 아우다\.)/, '$1 기록에는 이름이 둘이다. 골목에선 짧은 쪽을 쓴다.');
}
const hall = at(sh, 'Prince Suulbu takes the news sitting down');
if (hall >= 0 && !sh.blocks[hall].html.includes('High Councillor')) {
	sh.blocks[hall].html += ' Since the winter before last he has also been High Councillor, which means the Harmony Council meets in his hall, and he chooses the tea.';
	sh.blocks[hall].ko = (sh.blocks[hall].ko ?? '') + ' 재작년 겨울부터는 상대등이기도 하다. 그러니 화백회의가 그의 대청에서 열리고, 차도 그가 고른다.';
}

/* ——— Kim Yushin takes the first chair, the night of the Yellow Mountain ——— */
const ym = find('Yellow Mountain');
if (!ym.blocks.some((b) => b.kind === 'scene' && b.label === 'Gumdol Fortress · that night')) {
	const teaser = ym.blocks.length - 1;
	ym.blocks.splice(
		teaser,
		0,
		{ kind: 'scene', label: 'Gumdol Fortress · that night', ko: '금돌성 · 그날 밤' },
		p(
			'King Muyeol has spent the battle forty li behind it, at Gumdol, being told things. Tonight he is told the best news a king of Silla has heard in a hundred years. Then he does something with it nobody in the tent expects.',
			'무열왕은 싸움 내내 사십 리 뒤 금돌성에서 소식을 들었다. 오늘 밤 그는 신라 임금이 백 년 만에 들어 보는 가장 좋은 소식을 듣는다. 그리고 그 소식으로, 막사 안 누구도 예상하지 못한 일을 한다.'
		),
		p(
			'The first chair of the Harmony Council has stood empty since old Geumgang died at New Year. Everyone in the tent has been counting who should have it. Most of them have been counting themselves.',
			'화백회의 맨 윗자리는 정월에 늙은 금강이 죽은 뒤로 비어 있다. 막사 안 사람들은 모두 그 자리가 누구 몫인지 세어 왔다. 대부분은 자기 자신을 세어 왔다.'
		),
		say('chunchu', ['The first chair.', 'Kim Yushin.'], ['상대등 자리.', '김유신.']),
		p(
			'The tent goes very quiet. A High Councillor comes from the table: he sits at it for years, waits, outlives better men. Yushin has never sat at it for a single vote. He is Gaya, the bottom rung of the True Bone. Nobody has ever gone from no seat to the first one in a night.',
			'막사가 쥐 죽은 듯 조용해진다. 상대등은 그 탁자에서 나온다. 몇 해를 앉아 기다리고, 더 나은 사람들보다 오래 산 끝에. 유신은 그 탁자에 앉아 표 한 번 던져 본 적이 없다. 그는 가야, 진골의 맨 아랫단이다. 의석 하나 없던 사람이 하룻밤 새 맨 윗자리에 오른 적은 한 번도 없다.'
		),
		say('murim', ['Majesty— with respect.', 'The first chair has always gone to a man who has sat at the table. He has never held a seat.'], ['전하— 황공하오나.', '상대등 자리는 언제나 그 탁자에 앉아 본 이에게 갔사옵니다. 저 사람은 의석을 가져 본 적이 없사옵니다.']),
		say(null, ['And the house, Majesty. The house is Gaya.'], ['그리고 그 집안이옵니다, 전하. 가야 집안이옵니다.']),
		say('chunchu', ['Yes.', 'Golden Gaya gave us its king. His grandson gave us Baekje this afternoon.', 'Is anyone here going to give me a reason?'], ['그렇소.', '금관가야는 우리에게 제 임금을 주었소. 그 손자는 오늘 오후 우리에게 백제를 주었고.', '여기 누가 내게 이유 하나라도 주겠소?']),
		p(
			'Nobody does. They have watched the Secretariat eat the Council’s seals one by one. They know which way a room votes when the king has already written the minutes.',
			'아무도 주지 않는다. 그들은 집사부가 회의의 인장을 하나씩 먹어 치우는 걸 지켜봤다. 임금이 이미 회의록을 써 둔 방이 어느 쪽으로 표를 던지는지 다들 안다.'
		),
		say('yushin', ['Chunchu.', '…Majesty. I don’t want a chair.'], ['춘추.', '…전하. 저는 자리 같은 건 원치 않습니다.']),
		say('chunchu', ['I know. That’s why it’s yours.', 'Sit down, Yushin. For once in your life, sit down.'], ['알아. 그래서 자네 거야.', '앉게, 유신. 평생 한 번은 좀 앉아.']),
		p(
			'Six sleeves go up. Two of them go up slowly. In the morning the clerks write a Gaya name at the head of the Council for the first time, and spell it very carefully.',
			'소매 여섯이 올라간다. 그중 둘은 천천히 올라간다. 이튿날 아침 서기들은 처음으로 가야 사람의 이름을 회의 맨 위에 적는다. 아주 조심스럽게, 한 획도 틀리지 않게.'
		)
	);
	log.push('Yellow Mountain: Yushin takes the first chair');
}

/* ——— Jukji, Jukjuk’s younger brother ——— */
const daeya = find('Siege of Daeya');
const stand = [at(daeya, 'Jukjuk gathers the men who are left'), at(daeya, 'surrender while they’re still offering'), at(daeya, 'My father named me for the bamboo.'), at(daeya, 'They come up the hill from the north gate')];
const rs = find('Royal Secretariat');
const card = rs.blocks.findIndex((b) => b.kind === 'card' && b.person === 'jukji');
if (card >= 0 && !rs.blocks.some((b) => b.kind === 'flashback' && b.title === 'The Bamboo')) {
	if (stand.some((i) => i < 0)) throw new Error('Daeya last stand not found');
	rs.blocks.splice(
		card + 1,
		0,
		p(
			'Jukji had an elder brother. Same father, different mothers: one sleeve purple, one yellow. Nine years ago the yellow one held the inner gate at Daeya.',
			'죽지에게는 형이 있었다. 아버지는 같고 어머니는 달랐다. 소매 하나는 보라, 하나는 노랑. 아홉 해 전, 노란 소매가 대야성 안문을 지켰다.'
		),
		{ kind: 'flashback', year: '642', title: 'The Bamboo', blocks: stand.map((i) => structuredClone(daeya.blocks[i])) },
		p(
			'Jukji was not there. He was in Surabol, copying a tax roll. He still writes his brother’s name at the top of every new ledger, then crosses it out, then starts.',
			'죽지는 거기 없었다. 서라벌에서 세금 장부를 베끼고 있었다. 그는 지금도 새 장부를 펼 때마다 맨 위에 형의 이름을 쓰고, 지우고, 그다음에 시작한다.'
		)
	);
	log.push('Royal Secretariat: Jukjuk flashback');
}
const hd = find('Huangdi (皇帝)');
const tenth = at(hd, 'The tenth stroke is a young Hwarang called Jukji');
if (tenth >= 0 && !hd.blocks[tenth].html.includes('Daeya')) {
	hd.blocks[tenth].html = hd.blocks[tenth].html.replace('a young Hwarang called Jukji, who writes down everything.', 'a young Hwarang called Jukji, who writes down everything. His elder brother died on the inner gate at Daeya.');
	if (hd.blocks[tenth].ko) hd.blocks[tenth].ko = hd.blocks[tenth].ko.replace(/(죽지[^.]*\.)/, '$1 그의 형은 대야성 안문에서 죽었다.');
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(log.join('\n'));
