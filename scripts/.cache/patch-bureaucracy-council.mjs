import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const STORY = 'src/lib/data/story.json';
const ASSETS = '/Users/heewon/.cursor/projects/Users-heewon-Documents-GitHub-kingdom/assets';
const TEMP = 'static/temp';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function sipsJpeg(srcId, destId = srcId) {
	const src = path.join(ASSETS, `${srcId}.png`);
	if (!fs.existsSync(src)) throw new Error(`missing ${src}`);
	const dest = path.join(TEMP, `${destId}.jpg`);
	execFileSync(
		'sips',
		['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', '-Z', '1200', src, '--out', dest],
		{ stdio: 'ignore' }
	);
	fs.rmSync(src);
	return `/temp/${destId}.jpg`;
}

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return '';
}

function insertAfter(entry, needle, blocks) {
	const mark = blocks.find((b) => b.html || b.title || b.kind === 'diagram');
	if (mark?.html && entry.blocks.some((x) => x.html === mark.html)) return;
	if (
		mark?.kind === 'diagram' &&
		entry.blocks.some((x) => x.kind === 'diagram' && x.title === mark.title && x.step === mark.step)
	)
		return;
	const i = entry.blocks.findIndex((b) => blockText(b).includes(needle));
	if (i < 0) throw new Error(`${entry.title}: missing needle «${needle}»`);
	entry.blocks.splice(i + 1, 0, ...blocks);
}

function upsertImage(entry, slot, afterId) {
	const i = entry.images.findIndex((im) => im.id === slot.id);
	if (i >= 0) {
		Object.assign(entry.images[i], slot);
		return;
	}
	const after = afterId ? entry.images.findIndex((im) => im.id === afterId) : -1;
	if (after >= 0) entry.images.splice(after + 1, 0, slot);
	else entry.images.push(slot);
}

const sunduk = findEntry('Queen Sunduk');
const clans = findEntry('The Eight Great Clans');
const summit = findEntry('The Summit');
const euija = findEntry('King Euija, the 31st Eraha');
const massacre = findEntry('Yeon’s Massacre');
const flower = findEntry('The Flower Youth');
const harmony = findEntry('The Harmony Council');
const gaya = findEntry('Gaya, the Lost Nations');
const alliance = findEntry('Silla-Tang Alliance');
const secretariat = findEntry('The Royal Secretariat');
const tamla = findEntry('Tamla, the Island of Oranges');
const joseon = findEntry('Dangun & Old Joseon');
const beasts = findEntry('The Four Beasts');
const bra = findEntry('Baekje Restoration Society');
const realms = findEntry('Annual Meeting of the Three Realms');
const taizong = findEntry('Li Shimin, the 2nd Huangdi');
const jinheung = findEntry('Jinheung, The Crescent Moon');

// ——— Queen Sunduk: bone rank + hung jury + 12 Angry Men deliberation ———
insertAfter(sunduk, 'Bone Rank System', [
	{
		kind: 'diagram',
		diagram: 'bone-rank',
		step: 'ranks',
		title: 'Bone Rank · 골품제',
		caption: 'Six ranks of bone under one unreachable throne. The robe is the census.',
		ko: '닿을 수 없는 왕좌 아래 여섯 뼈의 등급. 관복이 호적이다.'
	}
]);

insertAfter(sunduk, 'The Council decides by <b>unanimity</b>', [
	{
		kind: 'p',
		html: 'The <b>first count is three to three</b>. A hung jury in silk. Initial vote, then deliberation, then a final vote that cannot move until every sleeve agrees. That is the operational technique: not majority, not the Premier’s nod — one withheld hand is infinity.',
		ko: '<b>초투표는 셋 대 셋</b>이다. 비단 안의 미결 배심. 초투표, 숙고, 그리고 소매가 모두 맞을 때까지 못 움직이는 최종 투표. 그게 운영 기법이다. 다수도, 상대등의 끄덕임도 아니다 — 내린 손 하나가 무한대다.'
	},
	{
		kind: 'diagram',
		diagram: 'harmony-council',
		step: 'split',
		title: 'Initial vote · 초투표 3:3',
		caption: 'Three sleeves for Dukman, three against a woman on the throne. Deliberation is the only door.',
		ko: '덕만을 드는 소매 셋, 여왕을 막는 소매 셋. 숙고만이 문이다.'
	},
	{
		kind: 'dialogue',
		person: 'alchun',
		chip: '#8fb3e0',
		lines: ['초투표가 갈렸소.', '여주로는 나라를 못 다스린다는 쪽이, 아직 반이오.'],
		en: ['The first count is split.', 'Half this room still says a woman cannot rule.']
	}
]);

insertAfter(sunduk, 'If only three of the Sacred Bone remain', [
	{
		kind: 'dialogue',
		person: 'murim',
		chip: '#6b7280',
		lines: ['…총명하다는 걸로 왕을 고르면, 내일은 누구 말을 듣소.', '뼈가 기준이오. 뼈는 안 바뀌오.'],
		en: [
			'…If cleverness picks a king, whose cleverness do we hear tomorrow.',
			'Bone is the measure. Bone does not change.'
		]
	},
	{
		kind: 'dialogue',
		person: 'imjong',
		chip: '#78716c',
		lines: ['뼈가 바닥났소.', '바닥난 뼈로 나라를 버티는 게, 총명한 여왕보다 더 위험하지 않소.'],
		en: [
			'The bone has run out.',
			'Holding a country on empty bone is more dangerous than a clever woman.'
		]
	},
	{
		kind: 'dialogue',
		person: 'suljong',
		chip: '#57534e',
		lines: ['나는 아직… 손을 못 올리겠소.', '한 밤의 연설로 삼백 년을 뒤집기엔, 이 방이 너무 오래됐소.'],
		en: [
			'I still… cannot raise my hand.',
			'This room is too old to be turned by one night’s speech.'
		]
	},
	{
		kind: 'dialogue',
		person: 'yushin',
		chip: '#4a8fe0',
		lines: [
			'나는 그분에게 질문을 던져 봤소.',
			'답이 왔소. 이 방의 절반은 질문도 안 던져 보고 여자라는 단어만 반복했소.',
			'숙고가 그래서 있는 거요. 초투표를 뒤집으라고.'
		],
		en: [
			'I have put questions to her.',
			'They were answered. Half this room never asked — they only repeated the word woman.',
			'That is what deliberation is for. To overturn the first count.'
		]
	},
	{
		kind: 'dialogue',
		person: 'yumjang',
		chip: '#64748b',
		lines: ['…알천. 당신 손만 남았소.'],
		en: ['…Alchun. Only your hand is left.']
	},
	{
		kind: 'dialogue',
		person: 'alchun',
		chip: '#8fb3e0',
		lines: [
			'나는 호랑이를 잡아 본 사람이오.',
			'호랑이는 성별이 없소. 이빨이 있소.',
			'…올리겠소. 최종 투표.'
		],
		en: [
			'I have taken a tiger.',
			'A tiger has no sex. It has teeth.',
			'…I raise it. Final vote.'
		]
	},
	{
		kind: 'diagram',
		diagram: 'harmony-council',
		step: 'unanimous',
		title: 'Final vote · 최종 투표 6:0',
		caption: 'Deliberation turns the hung room. Six sleeves. The gate opens.',
		ko: '숙고가 미결을 뒤집는다. 소매 여섯. 문이 열린다.'
	}
]);

upsertImage(
	sunduk,
	{
		id: 'council-jury-lamp',
		ratio: 1.778,
		tone: '#1a1410',
		at: 'hung jury in silk',
		alt: 'Night Harmony Council: one lamp on a round table, six sleeves in smoke — a hung jury in silk',
		refs: ['/ch_bidam.png', '/ch_kim_yushin.png'],
		tempImage: sipsJpeg('council-jury-lamp'),
		prompt:
			'Intimate cinematic still. Harmony Council night. One oil-lamp disc on a round table, six officials, extreme chiaroscuro. Faces match attached portraits. No text. No watermark.'
	},
	'harmony-council'
);

upsertImage(
	sunduk,
	{
		id: 'council-split-light',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'The first count is three to three',
		alt: 'Council table split by a lamp-seam: three faces in gold, three in navy — 3:3',
		refs: ['/ch_bidam.png', '/ch_kim_yushin.png'],
		tempImage: sipsJpeg('council-split-light'),
		prompt:
			'Intimate cinematic still. Table split by one lamp-seam, hung 3:3. Faces match attached portraits. No text. No watermark.'
	},
	'council-jury-lamp'
);

upsertImage(
	sunduk,
	{
		id: 'council-bidam-rise',
		ratio: 0.5625,
		tone: '#141C2E',
		at: 'The newest member of the Council',
		alt: 'Bidam stands — the only man on his feet in the lamplit Harmony Council',
		refs: ['/ch_bidam.png'],
		tempImage: sipsJpeg('council-bidam-rise'),
		prompt:
			'Intimate cinematic close. Bidam standing in the council, lamp on his jaw. Face matches attached portrait. No text. No watermark.'
	},
	'council-split-light'
);

upsertImage(
	sunduk,
	{
		id: 'council-across-stare',
		ratio: 1.778,
		tone: '#1a1410',
		at: 'catches the Second Blade',
		alt: 'Bidam and Yushin across the dark council table, one lamp between them',
		refs: ['/ch_bidam.png', '/ch_kim_yushin.png'],
		tempImage: sipsJpeg('council-across-stare'),
		prompt:
			'Intimate two-shot. Bidam and Yushin across a dark table, one lamp. Faces match attached portraits. No text. No watermark.'
	},
	'council-bidam-rise'
);

// ——— 645 Harmony Council: machine + veto jury ———
insertAfter(harmony, 'still decide only by unanimity', [
	{
		kind: 'p',
		html: 'The technique has not changed since they crowned Dukman: <b>initial vote, deliberation, final vote</b>. Six Councillors. One Premier. Nothing moves unless the circle closes.',
		ko: '기법은 덕만을 세울 때부터 같다. <b>초투표, 숙고, 최종 투표</b>. 대등 여섯. 상대등 하나. 원이 닫히지 않으면 아무것도 안 움직인다.'
	},
	{
		kind: 'diagram',
		diagram: 'harmony-council',
		step: 'unanimous',
		title: 'Session machine · 화백의 기법',
		caption: 'Initial vote → deliberation → final vote. Unanimity or the name dies in the room.',
		ko: '초투표 → 숙고 → 최종 투표. 만장일치가 아니면 그 이름은 방에서 죽는다.'
	}
]);

insertAfter(harmony, 'Only one hand stays down', [
	{
		kind: 'diagram',
		diagram: 'harmony-council',
		step: 'veto',
		title: 'Harmony Veto · 화백 거부',
		caption: 'Five assent, Bidam’s hand stays down. The sister’s name cannot pass.',
		ko: '다섯이 찬성하고 비담의 손이 내린다. 누이의 이름은 통과하지 못한다.'
	},
	{
		kind: 'dialogue',
		person: 'murim',
		chip: '#6b7280',
		lines: ['비담. 초투표요.', '다섯이 들었소. 숙고할 거리가 뭐요.'],
		en: ['Bidam. This is the initial vote.', 'Five are up. What is there to deliberate.']
	},
	{
		kind: 'dialogue',
		person: 'imjong',
		chip: '#78716c',
		lines: ['당신이 세운 여왕의 누이요.', '오늘은 나라 일이 아니라 집안일이오.'],
		en: ['The sister of the queen you raised.', 'Today this is not the country. It is the house.']
	},
	{
		kind: 'dialogue',
		person: 'suljong',
		chip: '#57534e',
		lines: ['손 하나만 내리면 이 방은 끝나요.', '그걸 알면서 내리는 거요?'],
		en: ['One hand down and this room is finished.', 'You know that, and you still put it down?']
	},
	{
		kind: 'dialogue',
		person: 'yumjang',
		chip: '#64748b',
		lines: ['최종 투표를 열 수조차 없소.', '당신이 문을 잠근 거요.'],
		en: ['We cannot even open the final vote.', 'You locked the door.']
	}
]);

upsertImage(
	harmony,
	{
		id: 'council-veto-fist',
		ratio: 1.778,
		tone: '#141C2E',
		at: 'Only one hand stays down',
		alt: 'Five sleeves raised; Bidam’s fist still on the lamplit table',
		refs: ['/ch_bidam.png', '/ch_alchun.png'],
		tempImage: sipsJpeg('council-veto-fist'),
		prompt:
			'Intimate cinematic still. Five hands up, one fist on the table. Bidam face matches attached portrait. No text. No watermark.'
	},
	'council_morning'
);

// ——— Nation machines ———
insertAfter(jinheung, 'formalises the <b>Hwarang</b>', [
	{
		kind: 'p',
		html: 'The yard is an officer factory: one class a year, six Hwarang under a Marshal, four disciples under each. The number is kept for life. Almost every later Harmony sleeve first slept in that hall.',
		ko: '연무장은 장교 공장이다. 해마다 한 기, 국선 아래 화랑 여섯, 각 화랑 아래 낭도 넷. 기수는 평생 간다. 나중에 화백에 앉는 소매의 거의가 먼저 그 방에서 잤다.'
	},
	{
		kind: 'diagram',
		diagram: 'hwarang',
		title: 'The Hwarang · 화랑',
		caption: 'Marshal at the apex — six Hwarang, four 낭도 beneath each. Class n = entry year − 559.',
		ko: '국선 아래 여섯 화랑, 각 화랑 아래 낭도 넷. 기수 = 입문 연도 − 559.'
	}
]);

insertAfter(clans, 'They fight for power in the <b>Ministers’ Assembly', [
	{
		kind: 'diagram',
		diagram: 'eight-clans',
		step: 'court',
		title: 'Eight Great Clans · 대성팔족',
		caption: 'Buyeo at the helm; four houses each side of the aisle. Satek holds the king’s sleeve; Yunbi holds the coast road.',
		ko: '부여가 의장석, 통로 양쪽에 가문 넷. 사택은 왕의 소매, 연비는 해안 길.'
	},
	{
		kind: 'diagram',
		diagram: 'ministers-assembly',
		step: 'court',
		title: 'Ministers’ Assembly · 정사암회의',
		caption:
			'King at the helm, Premier on the aisle; eight 좌평 four-and-four, eight 달솔 on the outer benches. A plurality of houses is enough.',
		ko: '왕이 의장석, 상좌평이 통로. 좌평 여덟이 넷씩, 달솔 여덟이 벽쪽. 가문의 다수면 족하다.'
	}
]);

insertAfter(euija, 'The Prime Minister is chosen via the <b>Rock of Politics</b>', [
	{
		kind: 'diagram',
		diagram: 'ministers-assembly',
		step: 'clans',
		title: 'Rock of Politics · 정사암',
		caption: 'The eight senior benches are the eight houses. The rock sweats before a good decision — someone always salts it.',
		ko: '좌평 여덟 자리가 여덟 가문이다. 좋은 결정 전에 바위가 땀을 흘린다 — 늘 같은 사람이 소금을 바른다.'
	}
]);

insertAfter(summit, 'High Summit (제가회의)', [
	{
		kind: 'p',
		html: 'Goguryeo’s operational technique is consultation with a last word: five Commanderies argue as Commanders; the High Commander is first sword; the <b>king keeps the final vote</b>.',
		ko: '고구려의 기법은 마지막 말을 남긴 협의다. 오부가 대가로 다투고, 막리지가 첫 칼이며, <b>임금이 최종 투표를 쥔다</b>.'
	},
	{
		kind: 'diagram',
		diagram: 'high-summit',
		step: 'council',
		title: 'The High Summit · 제가회의',
		caption: 'King above a High Commander and five regional Commanders. The final vote stays on the dais.',
		ko: '왕 아래 막리지, 그 아래 오부 대가. 최종 투표는 어좌에 남는다.'
	}
]);

insertAfter(massacre, 'creates a new position for himself, as the <b>Supreme Commander</b>', [
	{
		kind: 'diagram',
		diagram: 'high-summit',
		step: 'supreme',
		title: 'Supreme Commander · 대막리지',
		caption: 'After the knives: the High Commander’s chair becomes Supreme; the king dims to a puppet note.',
		ko: '칼 다음. 막리지 자리가 대막리지가 되고, 임금은 꼭두각시 음이 된다.'
	}
]);

insertAfter(flower, 'His uncle keeps the yard', [
	{
		kind: 'diagram',
		diagram: 'hwarang',
		title: 'Yard as state · 화랑',
		caption: 'The Council is the yard with better chairs. Class 51 still sits together — Bidam, Yushin, Alchun.',
		ko: '화백은 의자만 나은 연무장이다. 51기는 아직도 같이 앉는다 — 비담, 유신, 알천.'
	}
]);

insertAfter(gaya, 'Gaya confederacy', [
	{
		kind: 'p',
		html: 'Gaya’s technique is not a crown. It is a <b>league of iron harbours</b> — six courts for the chronicle’s mnemonic; the ground is denser, and no single king can lock a vote the way Surabol can.',
		ko: '가야의 기법은 왕관이 아니다. <b>철과 항구의 연맹</b>이다. 여섯은 기억법이고 땅은 더 빽빽하며, 서라벌처럼 표결을 잠글 임금은 없다.'
	},
	{
		kind: 'diagram',
		diagram: 'gaya-league',
		title: 'Gaya Confederacy · 가야',
		caption: 'Not one crown — a league of iron harbours.',
		ko: '왕관 하나가 아니다 — 철과 항구의 연맹.'
	}
]);

insertAfter(alliance, 'offers an alliance, vowing revenge against Baekje', [
	{
		kind: 'p',
		html: 'In Chang’an he watches the machine that does not wait for uncles: <b>Zhongshu drafts, Menxia examines, Shangshu executes</b> through six boards. One seal. One speed.',
		ko: '장안에서 그는 삼촌을 기다리지 않는 기계를 본다. <b>중서가 기안하고 문하가 심사하며 상서가 육부로 집행한다</b>. 어보 하나. 속도 하나.'
	},
	{
		kind: 'diagram',
		diagram: 'tang-departments',
		step: 'flow',
		title: 'Three Departments · 三省六部',
		caption: 'Legislative → examination → executive. The petition has somewhere to land.',
		ko: '기안 → 심사 → 집행. 청원서가 내려앉을 곳이 있다.'
	}
]);

insertAfter(taizong, 'Chang’an', [
	{
		kind: 'diagram',
		diagram: 'tang-departments',
		step: 'machine',
		title: 'Tang court · 당 조정',
		caption: 'Emperor above the Three Departments and Six Ministries — the grammar Chunchu will copy and exceed.',
		ko: '황제 아래 삼성과 육부 — 춘추가 본따 더할 문법.'
	}
]);

insertAfter(secretariat, 'like a bird that cannot find a roof', [
	{
		kind: 'diagram',
		diagram: 'royal-secretariat',
		title: 'Royal Secretariat · 집사부',
		caption: 'Fourteen ministries under one 시중. Tang’s 三省六部 copied and exceeded. Never enough.',
		ko: '시중 아래 열네 부. 당의 삼성육부를 본따 더했다. 결코 충분하지 않다.'
	},
	{
		kind: 'diagram',
		diagram: 'harmony-council',
		step: 'ornamental',
		title: 'Council, ornamental · 화백의 빈 의자',
		caption: 'The chairs stay polished. Nothing of consequence waits for them anymore.',
		ko: '의자는 여전히 닦인다. 더 이상 중대한 일은 화백을 기다리지 않는다.'
	}
]);

insertAfter(tamla, 'kingdom of <b>Tamla</b>', [
	{
		kind: 'diagram',
		diagram: 'tamla-princes',
		title: 'Three Princes · 삼성혈',
		caption: 'Three divine princes rise from Samseonghyeol and divide the orange island.',
		ko: '삼성혈에서 세 신인이 나와 탐라를 나눈다.'
	}
]);

insertAfter(joseon, 'earthly steward of the heavenly mandate', [
	{
		kind: 'diagram',
		diagram: 'joseon-mandate',
		title: 'Old Joseon · 고조선',
		caption: 'Heaven’s mandate made into a capital: Hwanin → Hwanung → Dangun → Asadal.',
		ko: '하늘의 명을 수도로 만든 계보. 환인 → 환웅 → 단군 → 아사달.'
	}
]);

insertAfter(beasts, 'Eighth Invasion of Goguryeo', [
	{
		kind: 'diagram',
		diagram: 'four-beasts',
		title: 'Four Beasts · 사신',
		caption: 'Gaozong’s expeditionary colours: White Tiger, Red Fowl, Blue Dragon, Black Tortoise.',
		ko: '고종의 동정 색깔. 백호, 주작, 청룡, 현무.'
	},
	{
		kind: 'diagram',
		diagram: 'four-dragons',
		title: 'Four Dragons · 사룡',
		caption: 'Taizong’s older roster — the grammar the son inherited with the war.',
		ko: '태종의 옛 명부 — 아들이 전쟁과 함께 물려받은 문법.'
	}
]);

insertAfter(bra, 'restore Baekje and defeat the Tang–Silla alliance', [
	{
		kind: 'diagram',
		diagram: 'restoration-army',
		title: 'Restoration Army · 백제부흥군',
		caption: 'King at the apex and four founding generals beneath — five captains, one lost country.',
		ko: '왕 아래 네 장군 — 부흥군 오장, 나라 하나.'
	}
]);

insertAfter(realms, 'if nobody stretches', [
	{
		kind: 'diagram',
		diagram: 'pantheon',
		step: 'courts',
		title: 'The Three Realms · 삼계',
		caption: 'Hwanin above; Living, Dead, and Western Flower Field below. Heaven is not a fourth peer realm.',
		ko: '환인이 위에 있고, 이승·저승·서천꽃밭이 아래에 있다. 하늘나라는 네 번째 계가 아니다.'
	}
]);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
execFileSync(process.execPath, ['scripts/sync-temp-art-inventory.mjs'], { stdio: 'inherit' });
console.log('patched bureaucracy diagrams + council debate + stills');
