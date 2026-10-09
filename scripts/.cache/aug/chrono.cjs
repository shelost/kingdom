// Chronology fixes and the missing first-entrance cards.
// node scripts/.cache/aug/chrono.cjs [--dry]
const { ep, plain, at, log, insertBefore, remove, replace, finish } = require('./lib.cjs');

// ————————————————————————— Suro: no Gaya until the eggs hatch —————————————————————————
{
	const e = ep('Suro');
	const take = (re, kind) => {
		const i = at('Suro', re, kind);
		return e.blocks.splice(i, 1)[0];
	};
	const league = take(/league of iron harbours, six of them/);
	const diagram = take((b) => b.kind === 'diagram' && b.diagram === 'gaya-league');
	const map = take((b) => b.kind === 'map' && b.year === 42);
	const place = take((b) => b.kind === 'place' && b.place === 'geumgwan');
	e.blocks[at('Suro', /This is the story of the Gaya confederacy/)] = {
		kind: 'p',
		html: 'Before there is a Gaya, there is a ridge, and a sky god who looks at it too long.',
		ko: '가야가 있기 전에 능선이 있었다. 그리고 그 능선을 너무 오래 내려다본 하늘신이 있었다.'
	};
	const table = at('Suro', (b) => b.kind === 'table' && b.head[0] === 'Golden Gaya');
	e.blocks.splice(table, 1, league, diagram, map, place);
	log.push('~ Suro: league paragraph, diagram, map and Geumgwan card moved after the six eggs; the name table folded into the diagram');
}

// ————————————————————————— Gi: Bidam takes the first chair before the vote —————————————————————————
{
	const card = remove('Gi (起)', (b) => b.kind === 'card' && b.person === 'bidam');
	remove('Gi (起)', /Supum is thanked for his years/);
	remove('Gi (起)', (b) => b.kind === 'quote' && /made High Councillor/.test(b.html));
	replace('Gi (起)', /An old High Councillor still holds the first chair/, {
		kind: 'p',
		html: 'The first chair has a new occupant. Old Supum is thanked for his years and sent home, and the queen gives his seat to the one councillor who has never once told her what she wanted to hear.',
		ko: '첫 자리의 주인이 바뀌었다. 늙은 수품은 그간의 노고를 치하받고 물러났고, 여왕은 그 자리를 한 번도 듣기 좋은 말을 해 준 적 없는 화백에게 내준다.'
	});
	insertBefore('Gi (起)', /The technique has not changed since they crowned Dukman/, [
		card,
		{
			kind: 'quote',
			html: 'Winter, eleventh month: the ichan Bidam was made High Councillor.',
			ko: '겨울 11월, 이찬 비담을 상대등으로 삼았다.',
			hanja: '冬十一月，拜伊飡毗曇爲上大等。',
			source: 'Samguk Sagi (三國史記) bk. 5, Silla Annals — Queen Seondeok, yr. 14 (645)'
		},
		{
			kind: 'p',
			html: 'Under him sit the others, Yushin among them. They still decide only by unanimity. It’s the only way this council selects anything.',
			ko: '그 아래 나머지가 앉는다. 유신도 그중에 있다. 그들은 여전히 만장일치로만 정한다. 이 회의가 무엇을 고르는 방법은 그것뿐이다.'
		}
	]);
	const e = ep('Gi (起)');
	const supum = e.images.find((img) => img.at === 'An old High Councillor still');
	if (supum) supum.at = 'Old Supum is thanked for his years';
	const tech = e.blocks[at('Gi (起)', /The technique has not changed since they crowned Dukman/)];
	tech.html = 'The technique has not changed since they crowned Dukman: initial vote, deliberation, final vote. Nothing moves unless the circle closes.';
	tech.ko = '기법은 덕만을 세울 때부터 같다. 초투표, 숙고, 최종 투표. 원이 닫히지 않으면 아무것도 안 움직인다.';
	const laugh = e.blocks[at('Gi (起)', /the laugh you make when a junior spoils a dinner/)];
	laugh.html = laugh.html.replace('the laugh you make when a junior spoils a dinner', 'the laugh you make when the host spoils his own dinner');
	laugh.ko = laugh.ko.replace('후배가 저녁을 망쳤을 때 내는 웃음', '잔치 주인이 제 잔치를 망쳤을 때 내는 웃음');
	log.push('~ Gi: technique paragraph and the laugh now read with Bidam in the chair');
}

// ————————————————————————— Haemosu: Yuhwa is the youngest, and her sisters get cards —————————————————————————
{
	const e = ep('Haemosu');
	const yuhwa = e.blocks.find((b) => b.kind === 'card' && b.person === 'yuhwa');
	yuhwa.caption = 'The river’s youngest daughter, a nymph of the Amnok. Heaven is about to ruin her afternoon, or make it.';
	yuhwa.ko = '강의 막내딸, 압록의 물의 요정. 하늘이 그녀의 오후를 망치려 한다. 아니면 만들어 주거나.';
	const i = e.blocks.indexOf(yuhwa);
	e.blocks.splice(
		i + 1,
		0,
		{ kind: 'card', person: 'hwahye', caption: 'The eldest river-daughter. First into the water, every time.', ko: '강의 맏딸. 물에 들어가는 건 언제나 그녀가 먼저다.' },
		{ kind: 'card', person: 'wihye', caption: 'The middle sister. She laughs first and dives second.', ko: '둘째. 먼저 웃고, 그다음에 뛰어든다.' }
	);
	log.push('+ Haemosu: Hwahye and Wihye cards after Yuhwa’s');
}

// ————————————————————————— First entrances: a card just before each one's first line —————————————————————————
/** person id → [caption, Korean caption, look?] */
const INTROS = {
	habek: ['The Amnok’s river god. He keeps his borders the way kings do, and his daughters the same way.', '압록의 강신. 국경을 지키듯 딸들도 지킨다.'],
	sosuno: ['A merchant’s daughter who reads a valley like a ledger. She has already priced you.', '골짜기를 장부처럼 읽는 상인의 딸. 당신 값은 이미 매겨 두었다.'],
	songyang: ['King of the Pine Kingdom. Old roof, old name, and a very good memory for who arrived first.', '소나무 나라의 왕. 오래된 지붕, 오래된 이름, 그리고 누가 먼저 왔는지는 아주 잘 기억한다.'],
	biryu: ['Sosuno’s elder boy. He likes the sea more than anyone sensible should.', '소서노의 큰아들. 분별 있는 사람치고는 바다를 너무 좋아한다.'],
	daeso: ['Buyeo’s crown prince. Good with a bow, until someone is better.', '부여의 태자. 활을 잘 쏜다. 누가 더 잘 쏘기 전까지는.'],
	galsa: ['Geumwa’s younger son. He smiles at everything, for now.', '금와의 둘째 아들. 아직은 무엇에든 웃는다.'],
	ladyye: ['A Buyeo girl with a steady hand and a long memory.', '손이 야무지고 기억이 긴 부여의 처녀.'],
	chunmyung: ['The old king’s eldest daughter. Everyone assumes she wants the crown. Everyone.', '선왕의 맏딸. 모두가 그녀가 왕관을 원한다고 생각한다. 모두가.'],
	mugwan: ['Sadaham’s best friend in the First Class. The two of them made a promise boys should not make.', '제일기에서 사다함의 단짝. 둘은 사내아이들이 해서는 안 되는 약속을 했다.'],
	chunbok: ['A young Satek with good manners and an inconvenient conscience.', '예의 바르고, 양심이 거추장스러운 젊은 사택.'],
	dodo: ['A slave in the Silla camp. Remember the name; the annals almost didn’t.', '신라 진영의 노비. 이름을 기억해 두라. 사서는 하마터면 잊을 뻔했다.'],
	shinsung: ['A monk of Pyongyang. Very quiet, and very well connected.', '평양의 승려. 아주 조용하고, 아는 사람이 아주 많다.'],
	weizheng: ['The emperor’s minister. His job is to say no, and he is very good at his job.', '황제의 대신. 그의 일은 ‘아니 되옵니다’라고 말하는 것이고, 그는 일을 아주 잘한다.'],
	xueliu: ['A farmer’s wife. The farmer has no idea what she has planned for him.', '농부의 아내. 농부는 아내가 자기를 두고 무슨 계획을 세웠는지 전혀 모른다.'],
	sukwon: ['Bidam’s father. A man of few words, and he has saved them all for his son.', '비담의 아버지. 말수가 적은 사람인데, 그 말을 모두 아들을 위해 아껴 두었다.'],
	jinduk: ['The queen’s sister, and the last of the Sacred Bone.', '여왕의 누이이자 마지막 성골.', 'princess'],
	yumjong: ['A quiet True Bone who drinks his tea slowly and listens fast.', '차는 천천히 마시고 듣는 건 빠른, 조용한 진골.'],
	ongunhae: ['Chunchu’s attendant. The same height as his master, which will matter.', '춘추의 수행원. 주인과 키가 같다. 그게 중요해질 것이다.'],
	jukji: ['A Hwarang of Pumsuk’s class. Quiet, exact, and always holding the right paper.', '품석과 같은 기수의 화랑. 조용하고 정확하며, 늘 맞는 문서를 들고 있다.'],
	jayi: ['A harbour girl who counts faster than the customs men.', '세관 관리보다 셈이 빠른 항구의 처녀.'],
	sumyeongjangja: ['The richest man under two suns. He lends one measure and collects two.', '두 해 아래 가장 부자. 한 되를 꾸어 주고 두 되를 받는다.'],
	baekjuto: ['A farming goddess who crossed the sea to find a husband. She is about to find one.', '남편을 찾아 바다를 건너온 농사의 여신. 곧 찾게 된다.'],
	socheonguk: ['The hunt god. A big appetite. Bigger than you’re thinking.', '사냥의 신. 먹성이 좋다. 생각하는 것보다 더.'],
	sanbangdeok: ['A goddess who stepped out of the Sanbang cliff to see the world. The world noticed.', '세상 구경을 하러 산방 절벽에서 나온 여신. 세상이 알아챘다.'],
	mundoryeong: ['A boy from the sky, sent down to study. Very good at books, very bad at noticing things.', '공부하러 내려온 하늘의 도령. 책은 아주 잘 보고, 눈치는 아주 없다.'],
	heungsu: ['A Baekje minister sent far from court for saying what the king didn’t want to hear.', '왕이 듣기 싫어하는 말을 해서 조정에서 멀리 보내진 백제의 대신.'],
	bangul: ['Yushin’s nephew. Young, brave, and in a hurry.', '유신의 조카. 젊고, 용감하고, 급하다.'],
	pumil: ['A Silla general with a son in the ranks. He knows exactly where the boy is standing.', '아들을 군중에 둔 신라 장군. 아이가 어디 서 있는지 정확히 안다.'],
	abe: ['Yamato’s admiral of the cold north. He has fought on ice. He has not fought on this river.', '북쪽 찬 바다의 야마토 제독. 얼음 위에서는 싸워 봤다. 이 강에서는 아니다.'],
	takutsu: ['A Yamato captain. Loud, loyal, and fond of a country that isn’t his.', '야마토의 장수. 시끄럽고, 충성스럽고, 제 나라도 아닌 나라를 아낀다.'],
	sateksangya: ['A Satek with harbour money and a general’s patience.', '항구의 돈과 장군의 인내를 가진 사택.'],
	pangxiaotai: ['The White Tiger. A Tang general who brought all his sons to war, to show them how it’s done.', '백호. 싸움을 가르치겠다고 아들들을 모두 데려온 당의 장군.'],
	yung: ['Euija’s eldest son. Born to be crown prince. Born is not the same as stays.', '의자의 맏아들. 태자로 태어났다. 태어난 것과 남는 것은 다르다.'],
	namsan: ['Gesomun’s youngest son, and the one who listens at doors.', '연개소문의 막내아들. 문 앞에서 엿듣는 쪽이다.'],
	gulgul: ['A Mohe boy Yeon pulled out of the snow. He has followed him ever since.', '연이 눈 속에서 끌어낸 말갈 소년. 그 뒤로 줄곧 그를 따른다.']
};

const carded = new Set();
const pending = new Map(Object.entries(INTROS));
const visit = (title, blocks) => {
	for (let i = 0; i < blocks.length; i++) {
		const b = blocks[i];
		if (b.kind === 'card') carded.add(b.person);
		if (b.kind === 'dialogue' && pending.has(b.person) && !carded.has(b.person)) {
			const [caption, ko, look] = pending.get(b.person);
			blocks.splice(i, 0, { kind: 'card', person: b.person, ...(look ? { look } : {}), caption, ko });
			carded.add(b.person);
			pending.delete(b.person);
			log.push(`+ ${title}: ${b.person} card before “${plain(b).slice(0, 40)}”`);
			i++;
		}
		if (b.blocks) visit(title, b.blocks);
	}
};
for (const e of require('./lib.cjs').entries) visit(e.title, e.blocks);
if (pending.size) log.push(`! no first line found for: ${[...pending.keys()].join(', ')}`);

finish();
