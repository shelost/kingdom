// One pass over story.json: audit fixes, cards, terms, maps, quotes.
// Every edit locates its block by text, so the order of edits doesn't matter.
// node scripts/.cache/aug/augment.cjs [--dry]
const fs = require('fs');
const path = require('path');
const { story, entries, ep, plain, at, log, insertAfter, insertBefore, remove, replace, isQuote, isDiagram, isHanja, finish } = require('./lib.cjs');

// ————————————————————————— 1. Audit housekeeping —————————————————————————

// Munhee: the two visit paragraphs were pasted twice.
remove('Munhee', /needs mending with her mouth/);
remove('Munhee', /^On a later visit she stands behind him, needle forgotten, staring at the breadth of his shoulders as if the coat/);
// Gumil: a Munhee line pasted into the Daeya section.
remove('Gumil', /father of that child/, 'dialogue');
// Harmony Council: stray cite and the summary that retells the vote we just watched.
remove('Harmony Council', (b) => b.kind === 'cite' && /High Councillor/.test(b.html));
remove('Harmony Council', /They argue past midnight/);
// Gotaso is sixteen in 641 (born 625); two lines still said fifteen.
{
	const e = ep('Gotaso');
	for (const b of e.blocks) {
		if (b.kind !== 'dialogue') continue;
		b.en = b.en?.map((l) => l.replace(/^…Fifteen years old/, '…Sixteen years old').replace(/^Fifteen is exactly/, 'Sixteen is exactly'));
		b.lines = b.lines.map((l) => l.replace('열다섯짜리가', '열여섯짜리가').replace('열다섯이니까', '열여섯이니까'));
	}
	log.push('~ Gotaso: fifteen → sixteen');
}
// Heungsu: Gyebek was exiled in 655, so their last talk at the berth is 655.
{
	const b = ep('Heungsu').blocks[at('Heungsu', (x) => x.kind === 'flashback' && x.title === 'The berth')];
	b.year = '655';
	log.push('~ Heungsu: berth flashback 656 → 655');
}
// Gyebek: his farewell line started twice.
remove('Gyebek', (b) => b.kind === 'dialogue' && b.person === 'gyebek' && (b.en ?? []).join(' ') === '…My lord. I am a man with no name—');
// Yellow Mountain: Kangrim asked his question twice; he asks it once, at the death.
{
	remove('Yellow Mountain', (x) => x.kind === 'dialogue' && x.person === 'kangrim' && /so I will ask you alone/.test(plain(x)));
	remove('Yellow Mountain', (x) => x.kind === 'dialogue' && x.person === 'gyebek' && /Let them keep the prettier word/.test(plain(x)));
	const ask = ep('Yellow Mountain').blocks[at('Yellow Mountain', (x) => x.person === 'kangrim' && /I only ask what I asked/.test(plain(x)))];
	ask.en = ['General.', 'Your five thousand already waved. So I ask you alone.', 'When you killed your family to keep your oath: was that loyalty, or terror of becoming soft?'];
	ask.lines = ['장군.', '오천은 이미 손을 흔들었소. 그러니 당신에게만 묻겠소.', '약조를 지키려 집안을 베었을 때: 그것이 충성이었습니까, 아니면 무르게 될까 두려운 것이었습니까?'];
	const answer = ep('Yellow Mountain').blocks[at('Yellow Mountain', (x) => x.person === 'gyebek' && /Loyalty\. I said it/.test(plain(x)))];
	answer.en = ['…Loyalty.', 'If it was terror, do not tell them. Let them keep the prettier word.', ...answer.en.slice(1)];
	answer.lines = ['…충성이오.', '두려움이었다면 그들에게 말하지 마시오. 더 예쁜 말을 갖게 두시오.', ...answer.lines.slice(1)];
	log.push('~ Yellow Mountain: Kangrim asks once, at the death');
}
// Muryuk: Geumgwan surrendered in 532, to the king before the Cloud King, by Muryuk's father.
{
	const b = ep('Muryuk').blocks[at('Muryuk', /another Gaya prince had already handed his kingdom over/)];
	b.html = 'Thirty years earlier, the last lord of Geumgwan had already handed his kingdom over, to the king before this one. Three sons rode in the cart behind him. The youngest was Muryuk. His grandson will be Kim Yushin. But before the hall, the field. The tall Gaya cone still fights.';
	b.ko = '그보다 서른 해 전, 금관의 마지막 임금은 이미 나라를 넘겼다. 지금 임금의 앞 임금에게. 그의 수레 뒤에 아들 셋이 탔다. 막내가 무력이다. 무력의 손자가 김유신이 된다. 하지만 전각보다 먼저, 들판. 높은 가야 고깔은 아직 싸운다.';
	for (const d of ep('Muryuk').blocks) {
		if (d.kind === 'dialogue' && d.person === 'jinheung') d.person = 'beopheung';
		if (d.kind === 'dialogue' && d.person === 'muryuk' && /my sons live in Silla/.test(plain(d))) {
			d.en = ['If we are to surrender, I have one condition…', 'Let my father’s sons live in Silla without shame…'];
			d.lines = ['항복해야 한다면, 조건이 하나 있습니다…', '제 아버지의 아들들이 신라에서 부끄럽지 않게 살게 해 주십시오…'];
		}
	}
	log.push('~ Muryuk: the 532 surrender is his father’s, to Beopheung');
}
// Quotes: one per event, and only where the scene doesn't already say it.
for (const re of [/Kodo is a low slave/, /In the thirty-second year, autumn/, /Godo Dodo of Samnyeonsan/]) remove('The Severing', isQuote(re));
remove('Siege of Daeya', (b) => b.kind === 'dialogue' && b.person === 'jukjuk' && /when my father named me/.test(plain(b)));
for (const re of [/forty-sixth year of Geonbok/, /captain of the Middle Banner/, /when you shake the collar the coat hangs straight/, /five thousand heads/, /Twelfth year, autumn, the eighth month/]) remove('Nangbi', isQuote(re));
for (const re of [/twenty-eight generals/, /Garim is steep/, /hundred and seventy warships/, /thousand Wa ships/, /first of the Japanese fleet/, /without observing the signs of the weather/, /closed in on the ships from left and right/, /Yu Feng slipped free/, /false princes Buyeo Chungseung/]) remove('White River', isQuote(re));
remove('Colossal River', isQuote(/divine strategy has fathomed the heavens/));
// Sadaham is told as a memory.
ep('Sadaham').flash = true;
log.push('~ Sadaham: flash');

// ————————————————————————— 2. Diagrams in the right place —————————————————————————

// The Tang machine is explained when Chunchu sees it (Huangdi), not at Taizong's first scene.
remove('Emperor', isDiagram('tang-departments'));
// The eight clans are families, not an organisation: they get house cards instead of a chart.
remove('Eight Great Clans', isDiagram('eight-clans'));
remove('Eight Great Clans', (b) => b.kind === 'table');
// The coup in one picture: every seat on the rock becomes a prince.
insertAfter('Coup', /names forty-one of his own sons to the Assembly/, [
	{
		kind: 'diagram',
		diagram: 'ministers-assembly',
		step: 'purged',
		title: 'Deer Rock, after · 정사암, 그 후',
		caption: 'The same benches. Every one of them a son.',
		ko: '같은 자리. 전부 아들이다.'
	}
]);

// ————————————————————————— 3. Cards: entrances, coronations, profiles —————————————————————————

insertAfter('Queen Sunduk', /^Munhee \(26\) is a young noblewoman/, [
	{ kind: 'card', person: 'munhee', caption: 'Twenty-six, sharp-tongued, and married to the wrong man on purpose.', ko: '스물여섯, 입이 매섭고, 일부러 엉뚱한 남자에게 시집간 여자.' }
]);
replace('Queen Sunduk', isHanja('春秋'), {
	kind: 'card',
	person: 'chunchu',
	look: 'prince',
	caption: 'Spring and autumn. Also the name of the oldest chronicle Confucius ever edited. He means to be in the next one.',
	ko: '봄과 가을. 공자가 엮은 가장 오래된 역사책의 이름이기도 하다. 그는 다음 역사책에 들어갈 작정이다.'
});
insertAfter('Queen Sunduk', /^And so she becomes the first Queen of Silla/, [
	{ kind: 'card', person: 'sunduk', from: 'princess', look: 'queen', write: '선덕왕', sub: '신라 제27대 임금' }
]);
insertAfter('Queen Sunduk', /^Munhee's big brother is Yushin/, [
	{ kind: 'card', person: 'yushin', look: 'marshal', caption: 'Thirty-seven. Gaya blood, Silla rank, and the yard is his.', ko: '서른일곱. 가야의 피, 신라의 품계, 그리고 마당은 그의 것.' }
]);
insertAfter('Harmony Council', /^The newest member of the Council/, [
	{ kind: 'card', person: 'bidam', look: 'young', caption: 'The youngest sleeve in the room. He has never once waited his turn.', ko: '방에서 가장 어린 소매. 한 번도 제 차례를 기다린 적이 없다.' }
]);
replace('Prince Euija', isHanja('義慈'), {
	kind: 'card',
	person: 'euija',
	look: 'prince',
	write: '義慈',
	caption: 'Righteous and merciful. His father chose it. The son will spend his life deciding which half to keep.',
	ko: '옳음과 자비. 아버지가 지어 준 이름이다. 아들은 평생 그중 어느 쪽을 남길지 고른다.'
});
// Gyebek's name is written the moment Euija gives it to him.
{
	const hanja = remove('King Euija', isHanja('階伯'));
	insertAfter('Prince Euija', /How about — “Gyebek”\?/, [hanja], 'dialogue');
}
insertAfter('Commander Yeon', /^He is taken to the outpost of Commander Yeon/, [
	{ kind: 'card', person: 'gesomun', caption: 'Twenty-nine. He holds the eastern border in his father’s name, and nobody here calls him a son.', ko: '스물아홉. 아버지의 이름으로 동쪽 국경을 쥐고 있고, 여기서 그를 아들이라 부르는 이는 없다.' }
]);
insertAfter('King Euija', /^Euija takes the throne at forty-one/, [
	{ kind: 'card', person: 'euija', from: 'prince', look: 'king', write: '의자왕', sub: '백제 제31대 임금' }
]);
insertAfter('Emperor', /^Far to the west, a man who owns half the world/, [
	{ kind: 'card', person: 'taizong', caption: 'The Second Emperor of Tang. He owns half the world, and he is curious about the other half.', ko: '당의 두 번째 황제. 세상의 절반을 가졌고, 나머지 절반이 궁금하다.' }
]);
insertAfter('Gi (起)', /makes High Councillor of the one man who told her council no/, [
	{ kind: 'card', person: 'bidam', look: 'elder', tab: 'profile', write: '上大等', sub: '비담', role: 'High Councillor of Silla', caption: 'First chair of the Harmony Council. Every vote now passes through his hands.', ko: '화백의 첫째 자리. 이제 모든 표가 그의 손을 지난다.' }
]);
insertAfter('Yeon’s Massacre', /creates a new position for himself, as the Supreme Commander/, [
	{ kind: 'card', person: 'gesomun', tab: 'profile', write: '大莫離支', sub: '연개소문', role: 'Supreme Commander of Goguryeo', caption: 'A chair he built himself, above every other chair in the room.', ko: '스스로 짠 자리. 방 안의 모든 자리 위에 있다.' }
]);
insertAfter('Coup', /^Satek Chunbok is named Premier/, [
	{ kind: 'card', person: 'chunbok', tab: 'profile', write: '上佐平', sub: '사택춘복', role: 'Premier of Baekje', caption: 'A Satek in the Satek chair, sitting for the king.', ko: '사택의 자리에 앉은 사택. 왕을 위해 앉았다.' }
]);
insertAfter('Queen Jinduk', /^Seungman is crowned Queen Jinduk/, [
	{ kind: 'card', person: 'jinduk', from: 'princess', look: 'queen', write: '진덕왕', sub: '신라 제28대 임금' }
]);
insertAfter('King Muyeol', /^The age of Kim Chunchu begins/, [
	{ kind: 'card', person: 'chunchu', from: 'prince', look: 'king', write: '金春秋', sub: '신라 제29대 임금' }
], 'dialogue');
insertAfter('Kim Chunchu†', /^Bupmin takes the throne/, [
	{ kind: 'card', person: 'munmu', from: 'hwarang', look: 'king', write: '문무왕', sub: '신라 제30대 임금' }
]);

// ————————————————————————— 4. Terms the narrator stops to explain —————————————————————————

const term = (o) => ({ kind: 'term', ...o });

insertAfter('Harmony Council', /^The Harmony Council meets to debate/, [
	term({
		hanja: '和白',
		reading: '화백',
		term: 'Harmony Council',
		html: 'Hwabaek. It means “speaking in harmony,” which is the polite way of saying nobody goes home. It is older than the bone ranks, older than the Buddha in Silla, and it still picks the kings.',
		ko: '화백. ‘어울려 말한다’는 뜻이다. 아무도 집에 못 간다는 말을 점잖게 한 것이다. 골품보다 오래됐고, 신라에 부처가 오기보다 오래됐고, 지금도 임금을 고른다.'
	})
]);
replace('Queen Sunduk', isDiagram('bone-rank'), term({
	hanja: '骨品',
	reading: '골품',
	term: 'Bone Rank',
	html: 'Bone, as in the bone you were born with. Sacred Bone may wear the crown. True Bone may run the country. Everyone else may count the robes.',
	ko: '뼈. 타고난 그 뼈다. 성골은 왕관을 쓸 수 있다. 진골은 나라를 굴릴 수 있다. 나머지는 옷 색깔을 셀 수 있다.',
	diagram: 'bone-rank',
	step: 'ranks'
}));
replace('Jinheung, the Cloud', isDiagram('hwarang'), term({
	hanja: '花郞',
	reading: '화랑',
	term: 'Hwarang',
	html: '“Flower youths.” Noble sons in powder and silk, taught to ride, to sing, and to die, in about that order. The name is a joke. The enemy stopped laughing at it in the second generation.',
	ko: '‘꽃 같은 사내’. 분 바르고 비단 입은 귀족 자제들이 말 타기, 노래, 죽는 법을 대략 그 순서로 배운다. 이름은 농담이다. 적들은 두 번째 기수쯤에서 웃기를 그만뒀다.',
	diagram: 'hwarang'
}));
insertAfter('Eight Great Clans', /^The Eight Great Clans run this country/, [
	term({
		hanja: '大姓八族',
		reading: '대성팔족',
		term: 'Eight Great Clans',
		html: 'The eight great surnames. Not a council and not a party. Eight families, each older than most kings, each with a seat on the rock, a berth on the river and a grudge against at least two of the others. The royal Buyeo house sits above them. Usually.',
		ko: '여덟 큰 성씨. 회의도 아니고 당파도 아니다. 집안 여덟, 하나하나가 웬만한 임금보다 오래됐고, 저마다 바위 위의 자리, 강가의 부두, 그리고 적어도 둘에 대한 원한을 하나씩 가졌다. 그 위에 왕실 부여씨가 앉는다. 대개는.'
	}),
	...[
		['沙宅', '사택', 'Satek', 'The king’s sleeve. A Satek queen, a Satek premier, and a Satek tutor behind the eldest prince’s chair.', '왕의 소매. 사택 왕비, 사택 상좌평, 그리고 맏왕자 의자 뒤에 선 사택 스승.', '/ch_satek_elder.png'],
		['燕比', '연비', 'Yunbi', 'The coast road, from Sabi to the salt. They rolled in from the north four hundred years ago, and the Satek have never let them forget it.', '사비에서 소금밭까지, 해안 길. 사백 년 전 북쪽에서 굴러 들어왔고, 사택은 그걸 한 번도 잊게 두지 않았다.', '/ch_yunbi_elder.png'],
		['眞牟', '진모', 'Jinmo', 'The prestige house. Old money and high swords: a Jinmo boy lifts his blade over his head and dares you.', '명문가. 오래된 돈, 높은 칼. 진모 소년은 칼을 머리 위로 들고 덤벼 보라 한다.'],
		['木刕', '목리', 'Mokli', 'Timber and the eastern berths. They look across the sea to Yamato more often than they look up at the throne.', '목재와 동쪽 부두. 왕좌를 올려다보는 것보다 바다 건너 왜를 바라보는 일이 더 잦다.'],
		['解', '해', 'Hae', 'Coast salt, and the oldest name on the rock. Hae boys wrestle low and hook a leg before you know you’ve lost.', '해안의 소금, 그리고 바위 위에서 가장 오래된 이름. 해씨 소년은 낮게 붙어, 진 줄 알기도 전에 다리를 건다.'],
		['苩', '백', 'Baek', 'A quiet house with a long memory. The last time a Baek lost patience with a king, the king did not survive it.', '조용한 집안, 긴 기억. 백씨가 마지막으로 임금에게 참을성을 잃었을 때, 그 임금은 살아남지 못했다.'],
		['國', '국', 'Guk', 'Their name means “country,” and they never let a meeting forget it. Guk boys win with the hip.', '이름이 ‘나라’라서, 어느 회의에서도 그걸 잊게 두지 않는다. 국씨 소년은 엉덩이로 이긴다.'],
		['安', '안', 'Ahn', 'The smallest seat on the rock, and the hardest to buy. Every close vote in Sabi ends up at an Ahn door, and leaves it unpaid.', '바위 위에서 가장 작은 자리, 그리고 가장 사기 어려운 자리. 사비의 아슬아슬한 표는 결국 안씨 집 문 앞에 닿고, 값을 못 치른 채 돌아간다.']
	].map(([hanja, reading, name, html, ko, image]) => term({ tab: 'clan', hanja, reading, term: name, html, ko, ...(image ? { image } : {}) }))
]);
replace('Eight Great Clans', isDiagram('ministers-assembly', 'court'), term({
	hanja: '政事巖',
	reading: '정사암',
	term: 'Ministers’ Assembly',
	html: 'The Rock of Government. Long ago Baekje’s lords chose their premier by sealing three names in a box and leaving it on this rock overnight. Whichever name the rock had marked by morning got the chair. The rock still sweats before a vote. The votes still go to whoever paid for them.',
	ko: '정사를 보는 바위. 옛날 백제의 귀족들은 이름 셋을 함에 봉해 이 바위 위에 하룻밤 두었다. 아침에 바위가 표시해 둔 이름이 재상 자리에 앉았다. 바위는 지금도 표결 전에 땀을 흘린다. 표는 지금도 값을 치른 쪽으로 간다.',
	diagram: 'ministers-assembly',
	step: 'court'
}));
replace('High Summit', isDiagram('high-summit', 'council'), term({
	hanja: '諸加會議',
	reading: '제가회의',
	term: 'High Summit',
	html: 'The meeting of the ka. A ka was a tribal chief, back when Goguryeo was five roofs in one valley. The roofs became commands, the chiefs became generals, and the meeting kept its old name, the way old men keep their nicknames.',
	ko: '가(加)들의 모임. 가는 고구려가 한 골짜기의 지붕 다섯이던 시절의 부족장이다. 지붕은 군단이 되고, 족장은 장군이 됐지만, 모임은 옛 이름을 그대로 썼다. 노인들이 어릴 적 별명을 버리지 않듯이.',
	diagram: 'high-summit',
	step: 'council'
}));
insertAfter('Jolbon', /^Jolbon is five roofs that will not share a yard/, [
	term({
		hanja: '五部',
		reading: '오부',
		term: 'The Five Tribes',
		html: 'Five roofs, five chiefs, five animals on five banners, and one valley too small for all of them. Remember the shape. Six hundred years from now they will be Goguryeo’s five commands, and they will still not share a yard.',
		ko: '지붕 다섯, 족장 다섯, 깃발마다 짐승 하나, 그리고 다 들어가기엔 좁은 골짜기 하나. 이 모양을 기억해 두라. 육백 년 뒤 이들은 고구려의 다섯 부가 되고, 그때도 마당을 나눠 쓰지 않는다.',
		diagram: 'five-tribes'
	})
]);
insertAfter('The Severing', /^Two kings take a river back together/, [
	term({
		hanja: '決裂',
		reading: '결렬',
		term: 'The Severing',
		html: 'For a hundred and twenty years Baekje and Silla kept one rule: when Goguryeo comes south, we stand together. Baekje calls the day that rule broke the Severing. Silla doesn’t call it anything. Winners rarely name things.',
		ko: '백이십 년 동안 백제와 신라에게는 규칙이 하나 있었다. 고구려가 내려오면 함께 막는다. 백제는 그 규칙이 깨진 날을 결렬이라 부른다. 신라는 아무 이름도 붙이지 않는다. 이긴 쪽은 좀처럼 이름을 붙이지 않는다.'
	}),
	{
		kind: 'map',
		from: 550,
		year: 554,
		places: ['wirye', 'gwansan', 'sabi', 'surabol'],
		caption: 'Two kings took the river together. One of them kept it.',
		ko: '두 임금이 강을 함께 되찾았다. 한 사람이 그것을 가졌다.'
	}
]);
insertAfter('Huangdi (皇帝)', /^Prince Chunchu \(45\) approaches the Second Emperor/, [
	term({
		hanja: '皇帝',
		reading: '황제',
		term: 'Huangdi · Emperor',
		html: 'Huang, the god-kings of the dawn of the world. Di, the lord of heaven. The first man to put the two words together burned the books. Every other ruler on earth is a king. This one is the Son of Heaven, and he would like it said in that order.',
		ko: '황(皇)은 세상이 처음 열릴 때의 신령한 임금들, 제(帝)는 하늘의 주인. 두 글자를 처음 붙여 쓴 사내는 책을 불살랐다. 땅 위의 다른 통치자는 모두 왕이다. 이 사람은 하늘의 아들이고, 그 순서대로 불리기를 원한다.'
	})
]);
insertAfter('Jiabeng (駕崩)', /^The emperor dies in the Cuiwei Palace/, [
	term({
		hanja: '駕崩',
		reading: '가붕',
		term: 'Jiabeng',
		html: '“The carriage collapses.” Nobody in Chang’an may say the emperor died. Kings die. The Son of Heaven’s carriage simply falls, and the whole empire is meant to hear it land.',
		ko: '‘수레가 무너진다’. 장안에서는 아무도 황제가 죽었다고 말하지 못한다. 왕은 죽는다. 하늘의 아들은 수레가 내려앉을 뿐이고, 온 제국이 그 소리를 들어야 한다.'
	})
]);
insertAfter('King Euija', (b) => b.kind === 'card' && b.person === 'euija', [
	term({
		hanja: '於羅瑕',
		reading: '어라하',
		term: 'Eraha',
		html: 'What Baekje’s lords call their king. The farmers have their own word for him. The king has heard it, and prefers this one.',
		ko: '백제의 귀족들이 임금을 부르는 말. 농사꾼들은 따로 부르는 말이 있다. 임금도 그 말을 들어 봤고, 이쪽을 더 좋아한다.'
	})
]);

// ————————————————————————— 5. Maps where the talk is geography —————————————————————————

insertAfter('Yunchung', /The thirteenth\. He led armies into the heart of Pyongyang/, [
	{ kind: 'map', from: 371, year: 641, places: ['wirye', 'pyongyang', 'sabi'], caption: 'The thirteenth’s Baekje, and what is left of it.', ko: '열세 번째 어라하의 백제, 그리고 남은 것.' }
], 'dialogue');
insertAfter('Yunchung', /^We take back the Silla frontier/, [
	{ kind: 'map', year: 641, places: ['sabi', 'daeya', 'surabol'], caption: 'Daeya. The last wall between Baekje and the Silla capital.', ko: '대야성. 백제와 신라 도성 사이의 마지막 성벽.' }
], 'dialogue');
insertAfter('Euija & Yeon', /^Look at this map/, [
	{ kind: 'map', year: 642, places: ['danghang', 'sabi', 'pyongyang', 'surabol'], caption: 'One harbour. Silla’s only door to the Tang.', ko: '항구 하나. 신라가 당으로 나가는 단 하나의 문.' }
], 'dialogue');
insertAfter('Forty Fortresses', /^Over the next few years Yushin takes more than forty fortresses/, [
	{ kind: 'map', year: 644, places: ['daeya', 'sabi', 'surabol', 'gwansan'], caption: 'Forty fortresses, along a border nobody could draw the same way twice.', ko: '두 번 같게 그릴 수 없는 국경을 따라, 마흔 개의 성.' }
]);

// ————————————————————————— 6. Short lines from the record —————————————————————————

{
	const zengzi = remove('Buyeo Euija†', isQuote(/Zengzi of the East of the Sea/));
	insertAfter('Prince Euija', (b) => b.kind === 'card' && b.person === 'euija', [zengzi]);
}
insertAfter('Gyebek', /^Before he marches he goes home/, [
	{
		kind: 'quote',
		hanja: '恐吾妻孥 沒爲奴婢 與其生辱 不如死快 遂盡殺之',
		html: 'I fear my wife and children will be taken and made slaves. Better a quick death than a life of shame. And so he killed them all.',
		ko: '내 처자가 붙잡혀 노비가 될까 두렵다. 살아서 욕을 보느니 차라리 죽는 것이 낫다. 마침내 모두 죽였다.',
		source: 'Samguk Sagi (三國史記), Biographies, Gyebaek'
	}
]);

// ————————————————————————— 7. A map at the head of every episode that moves —————————————————————————

/** Sites inside a capital count as the capital; places off the sheet or out of this world get no map. */
const CITY = { radiance: 'surabol', cheomseongdae: 'surabol', moon_palace: 'surabol', sabi_tourney: 'sabi', deer_rock: 'sabi' };
const OFF = new Set(['changan', 'asuka', 'realms_pavilion', 'underworld', 'heaven', 'living_world', 'western_flower_field', 'flower_cliff', 'steam_cavern']);
const placesSrc = fs.readFileSync(path.resolve(__dirname, '../../../src/lib/places.ts'), 'utf8');
const XY = {};
for (const m of placesSrc.matchAll(/\n\t([a-z_]+): \{\n\t\tid: '[a-z_]+',[\s\S]*?\n\t\tx: (-?[\d.]+),\n\t\ty: (-?[\d.]+),/g)) XY[m[1]] = [+m[2], +m[3]];
const mapPlace = (id) => {
	const p = CITY[id] ?? id;
	return p && !OFF.has(p) && XY[p] ? p : null;
};
/** Openers written by hand: the places and the sweep that tell this episode's story. */
const OPENERS = {
	'Queen Sunduk': { places: ['surabol', 'sabi', 'pyongyang'], caption: 'Three kingdoms, one peninsula, and nobody happy with the lines.', ko: '세 나라, 한 반도, 그리고 그 선에 만족하는 이는 아무도 없다.' },
	'Jinheung, the Cloud': { from: 540, year: 562, places: ['wirye', 'gwansan', 'daegaya', 'surabol'], caption: 'The Cloud King’s shade, and where it fell.', ko: '구름왕의 그늘, 그리고 그 그늘이 드리운 곳.' },
	'Gunchogo, the 13th': { from: 346, year: 371, places: ['wirye', 'pyongyang'], caption: 'Baekje at its height.', ko: '백제의 전성기.' },
	'Gwanggaeto, the Great King': null,
	Nangbi: { from: 628, year: 629, places: ['nangbi', 'surabol', 'pyongyang'] },
	'Boiling River': { places: ['gungnae', 'hwando', 'liao'] },
	'Colossal River': { places: ['salsu', 'pyongyang', 'liao'] },
	Haemosu: { places: ['buyeo_north', 'jolbon', 'amnok'] },
	Suro: { places: ['geumgwan', 'surabol'] },
	Muryuk: { from: 530, year: 562, places: ['geumgwan', 'daegaya', 'surabol'], caption: 'Five hundred years of iron, gone in thirty.', ko: '오백 년의 쇠, 서른 해 만에 사라지다.' },
	Seohyun: { places: ['daeya', 'geumgwan', 'surabol'] },
	Onjo: { places: ['michuhol', 'wirye', 'jolbon'] },
	Balhae: { from: 676, year: 720, places: ['jolbon', 'pyongyang'], caption: 'The north, after Goguryeo.', ko: '고구려가 사라진 뒤의 북쪽.' }
};
const yearOf = (y) => {
	const m = String(y).match(/-?\d+/);
	return m ? +m[0] : null;
};
let prev = null;
for (const e of entries) {
	const here = mapPlace(e.place);
	const spec = e.title in OPENERS ? OPENERS[e.title] : undefined;
	const year = yearOf(e.year);
	const hasMap = e.blocks.slice(0, 6).some((b) => b.kind === 'map');
	/** A memory episode is another era: it gets its own map, and it doesn't move the present. */
	const memory = !!(e.flash || e.flashback);
	if (spec !== null && !hasMap && year !== null && year >= -200 && (spec || (here && here !== prev))) {
		let places = spec?.places;
		if (!places) {
			places = [here];
			if (!memory && prev && XY[prev]) {
				const [ax, ay] = XY[here];
				const [bx, by] = XY[prev];
				if (Math.hypot(ax - bx, ay - by) < 260) places.push(prev);
			}
		}
		const block = { kind: 'map', year: spec?.year ?? year, places };
		if (spec?.from !== undefined) block.from = spec.from;
		if (spec?.caption) Object.assign(block, { caption: spec.caption, ko: spec.ko });
		// After the opening line, never in front of it; after a scene plate, past its first line.
		let i = e.blocks.findIndex((b) => b.kind === 'p');
		if (i < 0) i = 0;
		e.blocks.splice(i + 1, 0, block);
		log.push(`+ ${e.title} opener map ${block.from ?? ''}→${block.year} [${places.join(', ')}]`);
	}
	if (here && !memory) prev = here;
}

// ————————————————————————— re-anchor stills whose text moved —————————————————————————

const reanchor = (title, id, to) => {
	const img = (ep(title).images ?? []).find((i) => i.id === id);
	if (!img) throw new Error(`[${title}] no image ${id}`);
	img.at = to;
	log.push(`~ ${title} image ${id} → “${to}”`);
};
reanchor('Harmony Council', 'parody-coronation-dukman', 'All six sit on the yes side');
reanchor('Munhee', 'scene-chunchu-munhee-moonlight-3', 'and again the day after that');
reanchor('Siege of Daeya', 'ink-wind-bamboo-jukjuk', 'might be broken but never bent');
reanchor('Nangbi', 'scene-yushin-sword-60', 'He brings the weight on his saddle back');
reanchor('Colossal River', 'scene-salsu-gesomun-4', 'Your godlike strategy');
reanchor('Colossal River', 'scene-salsu-gesomun-33', 'Your godlike strategy');
reanchor('Muryuk', 'gaya-muryuk-surrender-dutch', 'If we are to surrender, I have one condition');

// ————————————————————————— report —————————————————————————

finish();
