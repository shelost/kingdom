// Spirits' bier songs (상엿소리) at the major deaths, each closed by an epitaph card.
// Usage: node scripts/.cache/dirges.mjs  (idempotent: skips deaths that already have their dirge)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const REFRAIN_KO = '어허 어허 어허넘차 어허';
const REFRAIN_EN = 'Eo-heo, eo-heo — ferry them home, eo-heo';
const KANGRIM = '#4a4a58';

/** Three couplets from the lead singer, the chorus after each. */
function song(couplets) {
	const lines = [];
	const en = [];
	const refrain = [];
	for (const [k1, k2, e1, e2] of couplets) {
		lines.push(k1, k2, REFRAIN_KO);
		en.push(e1, e2, REFRAIN_EN);
		refrain.push(lines.length - 1);
	}
	return { lines, en, refrain };
}

const DEATHS = [
	{
		person: 'gotaso',
		entry: 'Siege of Daeya',
		after: 'Honest. Rare.',
		replace: ['She goes with him surprised to the last'],
		caption: 'Lady Gotaso, daughter of Kim Chunchu, wife of Pumsuk. She asked him to look at her.',
		ko: '김춘추의 딸, 품석의 아내 고타소. 자기를 보라고 했다.',
		couplets: [
			['임금의 딸이 변방 성에 시집가서', '남편 소매 하나를 왕관처럼 썼다네', 'A great man’s daughter, sent off to a border town,', 'she married a purple sleeve and wore it like a crown.'],
			['잃어버린 새를 다시 접어 주며', '이번엔 날개를 더 크게 하겠다네', 'He lost the paper bird; she folded him one more,', 'and made the second wing much bigger than before.'],
			['성문이 팔리고 곳간이 타던 밤에', '“날 보세요” 한마디, 그게 끝이었다네', 'The night the gate was sold and the granary burned,', 'she told him, “Look at me” — and that was all he learned.']
		]
	},
	{
		person: 'pumsuk',
		entry: 'Siege of Daeya',
		color: '#6b5b6e',
		after: 'It’s all I have.',
		replace: ['Haewonmek writes it down anyway'],
		caption: 'Kim Pumsuk, True Bone, Guardian of Daeya. He walked behind her.',
		ko: '진골, 대야성 도독 김품석. 그녀 뒤를 따라 걸었다.',
		couplets: [
			['고운 웃음으로 장부마다 도장 찍고', '서기 이름 한 번을 묻지 않았다네', 'He sealed every tally with a kind and easy smile,', 'and never asked the clerk’s name in all that while.'],
			['수레바퀴 곁에서 앞서지 않던 사내', '오늘 밤엔 붉은 책 따라 뒤에 걷는다네', 'He rode beside her cart, at the wheel, never ahead;', 'tonight he walks behind her, where the red book led.'],
			['첫날밤 차갑던 그 손 이야기', '가진 게 그뿐이라 그것만 남겼다네', 'Her hands were cold, he says, the night that they were wed —', 'it’s all he had to give, so that is what he said.']
		]
	},
	{
		person: 'muryuk',
		entry: 'Seohyun',
		after: 'I’ll write both.',
		replace: ['He held my son for one breath'],
		caption: 'Kim Muryuk, the last prince of Gaya and the first grandfather of Silla.',
		ko: '가야의 마지막 왕자이자 신라의 첫 할아버지, 김무력.',
		couplets: [
			['돌처럼 가라앉은 나라의 왕자', '남쪽에 무릎 꿇고 제 땅 삼았다네', 'A prince of a kingdom that sank like a stone,', 'he knelt to the south and he made it his own.'],
			['왕의 핏줄 끊긴 들에 고깔 투구 쓰고', '닫힌 문 쪽만 자꾸 돌아보았다네', 'He wore the tall cone where a king’s line was cut,', 'and kept looking back at a door that was shut.'],
			['손자를 안은 것은 숨 한 번 동안', '그 밤에 센 것은 그것 하나였다네', 'He held his son’s son for the length of a breath —', 'the one thing his son ever counted, at his death.']
		]
	},
	{
		person: 'seohyeon',
		entry: 'Jeon (轉)',
		after: 'It’s a long road, sir.',
		replace: [],
		caption: 'Kim Seohyun, a Gaya boy on a Silla horse. Never any good at the short version.',
		ko: '신라 말을 탄 가야 소년, 김서현. 짧게 말하는 법은 끝내 몰랐다.',
		couplets: [
			['어둠 속 말 위에선 누구 아들인지 몰라', '가야 소년 그 맛에 평생 달렸다네', 'On a horse in the dark, no one asked whose son —', 'so the Gaya boy rode till the riding was done.'],
			['아비는 뒤를 보고 아들은 구름 보다', '임금 조카 손을 잡고 달아났다네', 'His father looked back while he looked at the sky,', 'and he ran with a king’s niece and never asked why.'],
			['짧게 말하는 법은 끝내 몰랐으니', '우리도 긴 길 따라 길게 부른다네', 'He never could manage the short version, they say —', 'so we sing him the long road, and walk all the way.']
		]
	},
	{
		person: 'bidam',
		entry: 'Gyul (結)',
		after: 'Tell the sacred country I loved it badly.',
		replace: ['The body finishes falling after the name does.'],
		caption: 'Bidam of the Son house, High Councillor of Silla. He loved the sacred country badly.',
		ko: '손씨 가문, 신라의 상대등 비담. 거룩한 나라를 서툴게 사랑했다.',
		couplets: [
			['장자의 장자, 손목엔 백팔 염주', '떨어지는 별을 하늘 뜻이라 읽었네', 'Eldest of eldest, the beads round his hand,', 'he read a falling star as a verdict on the land.'],
			['사랑한 나라를 서툴게도 사랑해', '검은 띠 두르고 성 아래 섰다네', 'He loved the sacred country, and loved it all wrong,', 'and tied on the black band, and stood there too long.'],
			['의로운 역적인가, 그른 임금인가', '그 물음 처음엔 아비가 던졌다네', 'A righteous traitor, or a king in the wrong?', 'His father asked first, at a gate, all along.']
		]
	},
	{
		person: 'sunduk',
		entry: 'Gyul (結)',
		after: 'buried her on the sunny slope of Mount Nang',
		replace: [],
		caption: 'Queen Sunduk, the first queen of Silla. A queen? Ridiculous.',
		ko: '신라의 첫 여왕, 선덕. 여왕이라니, 웃기지.',
		couplets: [
			['“여왕이라니, 웃기지” 대신들 다 웃었지만', '그 웃음보다, 그 사내들보다 오래 버텼다네', '“A queen? Ridiculous!” — the whole council agreed;', 'she outlasted the laughter and the men who decreed.'],
			['하늘 지켜보라 돌탑을 쌓아 올리고', '겨울 개구리 울음에 숨은 적을 알았다네', 'She built a stone tower to keep watch on the sky,', 'and heard frogs in the winter, and knew who was nigh.'],
			['낭산 남쪽 양지에 제 무덤 정해 두고', '말한 그날 그대로 눈을 감았다네', 'She named her own grave on Mount Nang’s sunny side,', 'and on the very day she had told them, she died.']
		]
	},
	{
		person: 'jinduk',
		entry: 'King Muyeol',
		after: 'Then the minutes are clean.',
		replace: [],
		caption: 'Queen Jinduk, the last of the Sacred Bone. She kept a seat from becoming a joke.',
		ko: '마지막 성골, 진덕여왕. 자리 하나가 웃음거리가 되지 않게 지켰다.',
		couplets: [
			['성골 마지막 사람, 등잔처럼 지켜져', '춥고 습한 세월 금자리를 지켰다네', 'The last of the Sacred Bone, kept like a lamp,', 'she held the gold seat through the cold and the damp.'],
			['서국 황제께 태평 노래 비단에 수놓고', '옛 피를 홀로라도 끝까지 지켰다네', 'She stitched the West’s emperor a peace-song in thread,', 'and kept the old blood, though alone, till she was dead.'],
			['거룩한 뼈는 그 숨결과 함께 꺼지고', '자리 하나 웃음거리 안 되게 지켰다네', 'The bone that was holy goes out with her breath;', 'she kept a chair honest right up to her death.']
		]
	},
	{
		person: 'talhae',
		entry: 'Alji',
		after: 'nobody on it owns a house',
		replace: [],
		caption: 'Suk Talhae, who came in a box on the sea and took a house with a whetstone.',
		ko: '상자를 타고 바다를 건너와 숫돌 하나로 집을 얻은 석탈해.',
		couplets: [
			['까치 울음 따라 상자 타고 온 아이', '왜 너머 용성국서 바다 건너왔다네', 'He came in a box with a magpie’s loud cry,', 'from a land beyond Wa where the dragon-ships ply.'],
			['숫돌 숯 몰래 묻고 내 집이라 우겨', '대장장이 꾀로 호공 집을 차지했네', 'He buried some charcoal and swore it was his,', 'and won a lord’s house with a smith’s little quiz.'],
			['먼 훗날 임금이 무덤 파 보니', '말하던 키 그대로 누워 있었다네', 'A king, ages later, will dig where he lies,', 'and find him as tall as he said, to the inch, to the size.']
		]
	},
	{
		person: 'seongchung',
		entry: 'Descent',
		after: 'I will keep the minutes. Walk.',
		replace: [],
		caption: 'Sunchung, councillor of Baekje. He chose the cell over silence.',
		ko: '백제의 좌평 성충. 침묵 대신 옥을 택했다.',
		couplets: [
			['술 취한 임금께 듣기 싫은 말 바쳐', '그 값으로 감옥 한 칸 얻었다네', 'He told a drunk king what a drunk king won’t hear,', 'and they paid him a cell for the rest of the year.'],
			['굶어 가는 어둠 속 붓 한 자루 쥐고', '탄현 막고 백강 지키라 적었다네', 'He starved in the dark with a brush in his hand,', 'and wrote: hold the pass, keep their ships off the strand.'],
			['임금은 한 줄 읽고 술독 밑에 두니', '바른말 하던 신하 그렇게 갔다네', 'The king read one line and set the jar on the rest —', 'the truest of servants, and the least of the blessed.']
		]
	},
	{
		person: 'gyebek',
		entry: 'Yellow Mountain',
		after: 'keeps better hours than Sabi ever did',
		replace: ['The man who counted everything finishes counting'],
		caption: 'Gyebek, general of Baekje. He gave his word once.',
		ko: '백제의 장군 계백. 약속은 한 번 했다.',
		couplets: [
			['새벽 오기 전 칼 들고 집에 가', '사랑하는 이 종 되지 않게 했다네', 'He went to his house before light with his sword,', 'so none that he loved would kneel to a lord.'],
			['황산벌 오천이 한마음으로 서서', '네 번 막고 다섯째에 무너졌다네', 'Five thousand stood up on the Yellow Mountain plain;', 'four times they held, and the fifth was in vain.'],
			['모든 걸 세던 사내 마지막을 세고', '한번 한 약속을 끝내 지켰다네', 'The man who counted everything counted his last;', 'he gave his word once, and he held it fast.']
		]
	},
	{
		person: 'euija',
		entry: 'Buyeo Euija†',
		after: 'Then you die richer than the record will admit.',
		replace: ['Euija dies, vengeful and emptied.', 'Thus was the end of Buyeo Euija.', 'A man the court once called the Zengzi of the East.'],
		caption: 'Buyeo Euija, the last king of Baekje. The Zengzi of the East.',
		ko: '백제의 마지막 왕 부여의자. 해동증자.',
		couplets: [
			['해동증자라 불린 효성 깊은 아들', '북처럼 웃으며 제멋대로 다스렸네', 'They called him the Zengzi, the son who was good;', 'he laughed like a drum and he ruled as he would.'],
			['사비 강 위에 용 한 마리 걸어 두고', '마흔 성 빼앗더니 꿈에서 깨었다네', 'He hung a great dragon over Sabi’s broad stream,', 'took forty-odd forts, and woke up from the dream.'],
			['고향 먼 서국의 잿빛 집에서', '원망하다 비우다 끝내 놓았다네', 'He died far from home in the West’s grey hall —', 'vengeful, then empty, then nothing at all.']
		]
	},
	{
		person: 'chunchu',
		entry: 'Kim Chunchu†',
		after: 'you will want to talk the whole way',
		replace: ['King Muyeol (58) dies.'],
		caption: 'Kim Chunchu, King Muyeol of Silla. He knelt to everyone but Baekje.',
		ko: '신라 무열왕 김춘추. 백제 말고는 누구에게나 무릎을 꿇었다.',
		couplets: [
			['연개소문에게, 서국 황제에게 무릎 꿇되', '백제에게만은 끝내 꿇지 않았다네', 'He knelt to the tyrant, he knelt to the throne', 'of the emperor West — but never to Baekje’s own.'],
			['대야성 불타던 밤 딸 하나 잃고', '그 영리함 다 바쳐 갚으려 했다네', 'He lost a daughter at Daeya one burning night,', 'and spent all his cleverness setting it right.'],
			['백제는 사라지고 고구려는 서 있으니', '반쯤에서 아들 손에 맡겼다네', 'Baekje is gone, and Goguryeo stands —', 'halfway, he leaves it in his son’s two hands.']
		]
	},
	{
		person: 'gesomun',
		entry: 'Yeon Gesomun†',
		color: '#7c3aed',
		after: 'Then he dies in his sleep, sitting up',
		replace: [],
		caption: 'Yeon Gesomun, Supreme Commander of Goguryeo. He died sitting up.',
		ko: '고구려의 대막리지 연개소문. 앉은 채로 죽었다.',
		couplets: [
			['잔칫날 조정을 통째로 베어 넘기고', '까마귀 칼 다섯을 짐승 이빨처럼 찼다네', 'He cut down a court on the day of a feast,', 'and wore five crow swords like the teeth of a beast.'],
			['황제가 둘이나 와 상처만 안고 가니', '거친 말로 욕하며 더 오라 했다네', 'Two emperors came, and both of them went home sore;', 'he cursed them in words we can’t sing, and asked for more.'],
			['자다가 앉은 채로 숨을 거두고', '아들 셋, 인장 하나, 숙제를 남겼다네', 'He died in his sleep, sitting up in his chair,', 'and left three sons and one seal and a dare.']
		]
	},
	{
		person: 'yushin',
		entry: 'Kim Yushin†',
		after: 'There is nobody left now who calls her little sister.',
		replace: [],
		caption: 'Kim Yushin, Marshal of Silla. Buried with a king’s honours and a subject’s rank.',
		ko: '신라의 대장군 김유신. 왕의 예로 묻히고 신하의 품계로 적혔다.',
		couplets: [
			['벗과 백여덟 번 겨뤄 비기고', '단 한 번 이긴 날 그 벗을 묻었다네', 'A hundred and eight draws with the friend he loved best;', 'the one time he won, he laid that friend to rest.'],
			['육십 년 쓸모 있던 푸른 옷 대장군', '가야 손자가 신라를 바로 세웠다네', 'Sixty years useful, the marshal in blue —', 'a grandson of Gaya who made Silla true.'],
			['임금처럼 묻었으되 신하로 적었으니', '동녘 하늘 그 별이 그 사람이라네', 'They buried him kingly but wrote him below,', 'and his star in the east is the one that you know.']
		]
	},
	{
		person: 'munmu',
		entry: 'The King for All',
		after: 'The sea is this way.',
		replace: [],
		caption: 'King Munmu of Silla, the King for All. His tomb has tides.',
		ko: '신라 문무왕, 만인의 왕. 그의 무덤에는 밀물이 든다.',
		couplets: [
			['십육 년 전쟁, 언덕 하나, 나루 하나', '서국을 칼끝으로 문밖에 내보냈네', 'Sixteen years of war, and a hill, and a ford;', 'he showed the West out at the edge of his sword.'],
			['마당 사람 불러 전각에 앉히고', '법민이라 불리던 아이 만인의 왕 되었네', 'He called the yard in to sit down in the hall,', 'and the boy they called Bupmin became king for all.'],
			['바닷가서 사르고 물속 바위에 묻으니', '바라던 대로 물결 속 용이 되었다네', 'They burned him on shore and they laid him at sea —', 'a dragon in the tide, as he asked it to be.']
		]
	}
];

const text = (b) => [b.html, b.ko, b.label, ...(b.en ?? []), ...(b.lines ?? [])].filter(Boolean).join(' ').replace(/<[^>]+>/g, '');
const entries = Object.values(story).flatMap((ch) => ch.entries ?? []);
const report = [];

for (const d of DEATHS) {
	const e = entries.find((x) => x.title === d.entry);
	if (!e) throw new Error(`no entry ${d.entry}`);
	if (e.blocks.some((b) => b.kind === 'verse' && b.person === d.person)) {
		report.push(`${d.person}: already sung`);
		continue;
	}
	const at = e.blocks.findIndex((b) => text(b).includes(d.after));
	if (at < 0) throw new Error(`${d.person}: anchor not found: ${d.after}`);
	const removed = [];
	for (const frag of d.replace) {
		const i = e.blocks.findIndex((b, k) => k > at && text(b).includes(frag));
		if (i < 0) throw new Error(`${d.person}: replace target not found: ${frag}`);
		removed.push(e.blocks.splice(i, 1)[0]);
	}
	const verse = { kind: 'verse', color: d.color ?? KANGRIM, person: d.person, ...song(d.couplets) };
	const card = { kind: 'card', person: d.person, tab: 'epitaph', caption: d.caption, ko: d.ko };
	e.blocks.splice(at + 1, 0, verse, card);
	report.push(`${d.person}: sung after #${at}, replaced ${removed.length}`);
	// Images anchored to a removed block move to the song.
	for (const im of e.images ?? []) {
		if (im.at && removed.some((b) => text(b).toLowerCase().includes(im.at.toLowerCase()))) {
			report.push(`  re-anchored ${im.id} → song`);
			im.at = d.couplets[0][2].slice(0, 30);
		}
	}
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(report.join('\n'));
