#!/usr/bin/env node
/** Expand Euija–Gyogi tension, Satek scheming room, and the condolence-embassy exile gambit. */
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function find(title) {
	for (const ch of story) for (const e of ch.entries ?? []) if (e.title === title) return e;
	throw new Error(title);
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function dialogue(person, lines, en) {
	return { kind: 'dialogue', person, lines, en };
}
function section(label, ko) {
	return { kind: 'section', label, ko };
}
function scene(label, ko) {
	return { kind: 'scene', label, ko };
}

const pe = find('Prince Euija');
const start = pe.blocks.findIndex((b) => b.kind === 'section' && b.label === 'The Favourite');
const end = pe.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('In five days, Prince Euija becomes')
);
if (start < 0 || end < 0) throw new Error(`PE anchors ${start} ${end}`);

const rivalry = [
	section('The Favourite', '총아'),
	scene('The Ministers’ Hall', '조정'),
	p(
		'The eight houses do not argue about Euija in public. They argue about Gyogi in private, which is worse.',
		'여덟 집은 공개석상에선 의자 얘기를 안 한다. 사석에선 교기 얘기를 한다. 그게 더 나쁘다.'
	),
	p(
		'Gyogi is younger. His mother is Queen Satek — true Baekje sleeve, Deer Rock blood. Euija’s mother is a Silla princess the song still remembers. The houses have been doing that arithmetic since both boys could walk.',
		'교기가 어리다. 어머니는 사택왕후 — 진짜 백제 소매, 록암의 피. 의자의 어머니는 노래에 남는 신라 공주. 두 아이가 걷기 시작했을 때부터 집들은 그 셈을 해 왔다.'
	),
	p(
		'Euija has been waiting for a seal that should have come at twenty. He is forty now. He drinks through the wait. He tells himself he does not care who sits where.',
		'의자는 스물에 왔어야 할 인장을 기다려 왔다. 지금은 마흔이다. 기다림을 술로 넘긴다. 누가 어디에 앉든 관심 없다고 스스로에게 말한다.'
	),
	scene('Go Under the Eaves', '처마 밑 바둑'),
	p(
		'They play go in the shade of the west eaves. Gyogi never hurries a stone. Euija never looks at the board until the cup is empty.',
		'서쪽 처마 밑에서 바둑을 둔다. 교기는 돌을 서두르지 않는다. 의자는 잔이 빌 때까지 판을 보지 않는다.'
	),
	dialogue(
		'gyogi',
		['형님.', '오늘 조회에… 사택 좌평이 제 이름을 먼저 불렀습니다.', '실수였다고들 합니다.'],
		['Hyungnim.', 'At this morning’s assembly… the Satek jwapyŏng called my name first.', 'They say it was a mistake.']
	),
	dialogue(
		'euija',
		['실수겠지.', '우리 집은 실수가 잦아.', '그 돌 — 거긴 내 자리였는데.'],
		['A mistake, then.', 'Our house makes a lot of those.', 'That stone — that was my point.']
	),
	dialogue(
		'gyogi',
		['…보이셨습니까.', '죄송합니다.', '형님께선 나라 이야기를 잘 하십니다.', '집들은 피 이야기를 잘 하지요.', '둘 다 필요한 거 아니겠습니까.'],
		['…You saw it.', 'Forgive me.', 'Hyungnim talks well about the country.', 'The houses talk well about blood.', 'Don’t we need both?']
	),
	dialogue(
		'euija',
		['필요하면 너가 해.', '난 활이나 쏘마.', '한데 말야, 교기.', '네 이름 먼저 부를 때 — 누가 셈을 가르쳤는지, 기억해 둬라.', '하하.'],
		['If we need it, you do it.', 'I’ll stick to the bow.', 'But Gyogi.', 'When they call your name first — remember who taught the room to count.', 'Ha.']
	),
	p(
		'Gyogi smiles the smile that is not warm. He takes another of Euija’s groups without looking down. The game is already over. Neither of them says so.',
		'교기가 웃는다. 따뜻하지 않은 웃음. 판을 보지 않고도 의자의 대마 하나를 또 따낸다. 이미 끝난 판이다. 둘 다 말하지 않는다.'
	),
	dialogue(
		'gyogi',
		['형님은 피곤해 보이십니다.', '나라의 잔일은 제가 맡겠습니다.', '형님은… 이야기나 지어 주십시오.', '잘하시잖습니까.'],
		['Hyungnim looks tired.', 'I’ll take the dull work of the country.', 'You… keep making the stories.', 'You’re good at that.']
	),
	dialogue(
		'euija',
		['고마워.', '이야기엔 끝도 있지.', '누가 듣고 있느냐에 달렸고.'],
		['Thanks.', 'Stories end too.', 'Depends who’s listening.']
	),
	p(
		'He means the apathy, mostly. Wanting a chair somebody else’s mother already warmed is uglier than wine.',
		'거의 무관심으로 하는 말이다. 남의 어머니가 이미 데운 자리를 바라는 건, 술보다 더럽다.'
	),

	section('The Inner Room', '내실'),
	scene('Queen Satek’s Chamber', '사택왕후 처소'),
	p(
		'Night. One lamp. Black-pearl binyeo in the queen’s hair. Elder Satek counts berths on his fingers the way other men count prayer beads. Gyogi sits where the light is kind. Kimi stands where he can see the door.',
		'밤. 등 하나. 왕후 머리에 흑진주 비녀. 사택 대인은 염주 굴리듯 선창을 손가락으로 센다. 교기는 빛이 고운 쪽에 앉는다. 기미는 문이 보이는 쪽에 선다.'
	),
	dialogue(
		'queensatek',
		['인장은 아직이다.', '과인이 아니라 내가 막는다.', '신라 피가 태자 인을 먼저 받는 일은 — 이 나라에서 안 된다.'],
		['The seal is not yet.', 'Not His Majesty. Me.', 'Silla blood taking the crown-prince mark first — that does not happen in this country.']
	),
	dialogue(
		'eldersatek',
		['겨울 곡식이 아직 선창에 있습니다.', '임금께 아뢰면… 태자 일은 봄으로 미뤄질 겁니다.', '봄이 두 번이면 더 좋고요.'],
		['Winter grain is still in our berths.', 'If we mention that to His Majesty… the crown-prince business slips to spring.', 'Two springs would be better.']
	),
	dialogue(
		'kimi',
		['왕자마마.', '조회 자리는 이미 일곱이 이쪽입니다.', '여덟 번째도 곧 옵니다.', '의자는 술과 여자만 주시면 됩니다.', '믿는 사람은 표가 늦습니다.'],
		['Your Highness.', 'Assembly seating is already seven on our side.', 'The eighth is coming.', 'Euija only needs wine and women.', 'Believers are late to the vote.']
	),
	dialogue(
		'gyogi',
		['형은 불쌍해.', '나라 이야기를 진짜로 믿으니까.', '피를 흘리고 싶진 않습니다, 어머니.'],
		['I feel for him.', 'He actually believes the country talk.', 'I don’t want blood, Mother.']
	),
	dialogue(
		'queensatek',
		['피보다 자리가 먼저다.', '자리가 정해지면 피는 알아서 식어.'],
		['The chair comes before blood.', 'Once the chair is set, blood cools itself.']
	),
	dialogue(
		'kimi',
		['만약을 위해…', '사냥 사고 준비는 해 두겠습니다.', '활은 의자가 잘 쏘니, 반대로 — 말이 놀라게 하면 됩니다.', '흔적 없이.'],
		['For the unlikely case…', 'I’ll keep a hunting accident ready.', 'Euija shoots well, so the other way — startle the horse.', 'No marks.']
	),
	dialogue(
		'eldersatek',
		['선창은 날씨입니다.', '날씨는 기록을 남기지 않지요.'],
		['Berths are weather.', 'Weather leaves no minutes.']
	),
	dialogue(
		'gyogi',
		['…사고는 나중에.', '우선 인장만.', '형님은 이야기나 하게 두자.'],
		['…Accidents later.', 'The seal first.', 'Let Hyungnim keep his stories.']
	),
	p(
		'Kimi does not raise his voice. He never has to. White hair at Gyogi’s ear, red silk, a smile that rearranges chairs.',
		'기미는 목소리를 높이지 않는다. 높일 필요가 없다. 교기 귓가의 흰 머리, 붉은 비단, 자리를 다시 놓는 웃음.'
	),
	p(
		'Outside the lacquer, Euija has been leaning on the corridor rail long enough to hear the horse, the berths, and the smile. He laughs once — short — and goes back to the garden with a bow.',
		'옻칠 밖 복도 난간에, 의자는 말과 선창과 그 웃음을 듣기에  पर्याप्त 시간을 기대어 있었다. 짧게 한 번 웃고, 활을 들고 후원으로 돌아간다.'
	),
	dialogue(
		'euija',
		['가문 정치…', '도랑물 맛이네.', '난 둘 다 위에 있느니라.', '…라고 하자, 오늘은.'],
		['Clan politics…', 'Taste like ditch-water.', 'I’m above both.', '…Let’s say that. Today.']
	),

	section('The Quiet Count', '조용한 셈'),
	scene('A Yunbi Berth', '연비 선창'),
	p(
		'What the Satek room does not hear: Euija has started counting too. He does it badly on purpose in public. In private he drinks with the houses that hate sharing a harbour with Deer Rock.',
		'사택 내실이 못 듣는 것: 의자도 셈을 시작했다는 것. 공개석상에선 일부러 서툴게 센다. 사석에선 록암과 선창을 나눠 쓰기 싫은 집들과 술을 마신다.'
	),
	dialogue(
		'euija',
		['선창 셋.', '겨울에 비우지. 내 이름으로.', '대가로 원하는 게 뭐요.'],
		['Three berths.', 'Empty them in winter. In my name.', 'What do you want for that.']
	),
	dialogue(
		'euija',
		['표?', '아녀.', '표는 늦어.', '내가 원하는 건 — 누가 먼저 이름을 부르든, 그 다음 숨이오.', '숨만 참아 주시오.'],
		['A vote?', 'No.', 'Votes come late.', 'What I want is — whoever they call first, the breath after.', 'Just hold that breath.']
	),
	p(
		'He copies one page of Elder Satek’s harbour ledger through a clerk who likes silver more than weather. He does not use it. Not yet. A story needs the right hour.',
		'날씨보다 은을 좋아하는 서기 하나로 사택 대인의 선창 장부 한 장을 베낀다. 쓰진 않는다. 아직은. 이야기엔 시각이 필요하다.'
	),
	scene('King Mu’s Yard', '무왕의 마당'),
	p(
		'He asks his father for one privilege only. It sounds like theatre. It is.',
		'아버지에게 특권 하나만 청한다. 연극처럼 들린다. 연극이 맞다.'
	),
	dialogue(
		'euija',
		['아바마마.', '왕실에 초상이 나면 — 왜로 조문 사신을 보내지요.', '그 명단, 태자가 고르게 해 주십시오.', '효를 보여야 하니께.'],
		['Father.', 'When the house goes into mourning — we send a condolence mission to Yamato.', 'Let the crown prince choose that list.', 'We have to show filial duty.']
	),
	dialogue(
		'kingmu',
		['너는 술이나 마시더니 이제 명단이냐.', '그래. 줘.', '대신 활은 계속 쏴라. 나라 이야긴 내가 할게.'],
		['You drank and drank, and now you want a guest list.', 'Fine. Yours.', 'Keep shooting, though. I’ll handle the country talk.']
	),
	dialogue(
		'euija',
		['예.', '명단은… 미리 적어 두겠습니다.', '누가 가도 체면이 맞게.'],
		['Yes.', 'I’ll write the list… ahead of time.', 'Whoever goes, the dignity has to fit.']
	),
	p(
		'He writes Gyogi’s name first. Then Kimi. Then forty men who smile when Satek smiles. He folds the paper into the tiger-pommel’s wrapping and goes hunting as if nothing happened.',
		'교기 이름을 맨 위에 쓴다. 그다음 기미. 그다음 사택이 웃을 때 웃는 남자 마흔. 호랑이 환두 싸개 안에 접어 넣고, 아무 일 없다는 얼굴로 사냥에 나선다.'
	),
	p(
		'That is the boy who will meet a nameless fighter at the river in five days — and discover what resolve looks like when it is not wearing a sleeve. The list can wait. Resolve cannot.',
		'닷새 뒤 강가에서 이름 없는 무사를 만날 아이가 이 아이다. 소매를 안 걸친 결의가 어떤 얼굴인지, 거기서 처음으로 본다. 명단은 기다릴 수 있다. 결의는 못 기다린다.'
	)
];

pe.blocks.splice(start, end - start, ...rivalry);

// After Gyebek lock-in laugh — plant that the list wakes up
const laughIdx = pe.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('borrowed crown back on crooked')
);
if (laughIdx >= 0) {
	pe.blocks.splice(
		laughIdx + 1,
		0,
		p(
			'That night he unfolds the condolence list by one lamp. The names have not changed. He has.',
			'그날 밤 등잔 하나에 조문 명단을 펼친다. 이름은 그대로다. 그가 달라졌다.'
		),
		dialogue(
			'euija',
			['교기.', '기미.', '마흔.', '체면이라…', '하하. 이제야 쓸 만한 이야기다.'],
			['Gyogi.', 'Kimi.', 'Forty.', 'Dignity…', 'Ha. Now that is a story worth telling.']
		)
	);
}

// ─── King Euija: replace Islands with embassy gambit, ASAP after wonders ───
const ke = find('King Euija');
const isl = ke.blocks.findIndex((b) => b.kind === 'section' && b.label === 'The Islands');
const afterIsl = ke.blocks.findIndex(
	(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.startsWith('The white deer is the cheapest')
);
if (isl < 0 || afterIsl < 0) throw new Error(`KE anchors ${isl} ${afterIsl}`);

const exile = [
	section('The Islands', '섬'),
	scene('The Morning After the Dragon', '용 다음 아침'),
	p(
		'The reign is eight months old. The dragon still has people talking. Euija has been smiling the way a man smiles when the guest list is already in his sleeve.',
		'즉위한 지 여덟 달. 용 이야기는 아직 남는다. 의자는 웃는다. 소매 안에 이미 명단이 있는 사람의 웃음이다.'
	),
	p(
		'Then Queen Satek dies. The houses put on mourning the way they put on silk — carefully, and for an audience. Armed men do not gather in a mourning capital. That is the hour he wrote the list for.',
		'그리고 사택왕후가 죽는다. 집들은 비단 입듯 상복을 입는다 — 조심조심, 관객을 위해. 상중인 도읍에선 무장한 무리가 모이지 않는다. 명단을 적어 둔 시각이 바로 이것이다.'
	),
	scene('The Rock of Politics', '정치암'),
	p(
		'He calls the Assembly under white hemp. He does not say exile. Exile is a word for men who have already lost the room. He says dignity.',
		'흰 삼베 아래 조정을 부른다. 추방이라는 말은 안 한다. 추방은 이미 방을 잃은 사람의 말이다. 그는 체면이라 한다.'
	),
	dialogue(
		'euija',
		['왕후의 상이다.', '왜에 조문을 보내야 한다.', '으뜸 사신은 — 교기.', '내좌평 기미가 따른다.', '왕후 소매의 여인 넷, 이름 있는 신하 마흔.', '섬에서 먼저 재를 올린 뒤 건너가라.', '효다. 체면이다.'],
		[
			'The queen is in mourning.',
			'We send condolences to Yamato.',
			'Chief envoy — Gyogi.',
			'Naejwapyŏng Kimi goes with him.',
			'Four women of the queen’s sleeve, forty named ministers.',
			'Raise the rites on the islands first, then cross.',
			'Filial duty. Dignity.'
		]
	),
	dialogue(
		'eldersatek',
		['…폐하.', '섬은 조문이 아니옵고 —'],
		['…Your Majesty.', 'The islands are not a condolence —']
	),
	dialogue(
		'euija',
		['선창 장부 한 장 있네.', '겨울 곡식을 태자 인장을 미루는 데 쓰셨더군.', '날씨라 하셨지.', '날씨가 조문 사신을 고르진 않아.', '내 명단이 골라.'],
		[
			'I have one page of a harbour ledger.',
			'Winter grain used to delay a crown-prince seal.',
			'You called it weather.',
			'Weather does not choose envoys.',
			'My list does.'
		]
	),
	dialogue(
		'kimi',
		['폐하…', '표는 —'],
		['Your Majesty…', 'The count —']
	),
	dialogue(
		'euija',
		['표는 늦어.', '숨은?', '이미 참아 준 집이 있지.', '기미.', '흰머리로 의자를 옮겨 보셨으니 — 이젠 배를 옮겨 보시오.'],
		[
			'Votes come late.',
			'The breath?',
			'Some houses already held it for me.',
			'Kimi.',
			'You moved chairs with that white hair — now move a boat.'
		]
	),
	scene('The Harbour at Night', '밤의 항구'),
	p(
		'Silk banners. Mourning lamps. The Nihon Shoki will write island exile. Sabi’s diarist will write embassy. Both are true. Only one is useful.',
		'비단 기. 상등. 일본서기는 섬 추방이라 적을 것이다. 사비 일기는 사신이라 적을 것이다. 둘 다 맞다. 쓸모 있는 건 하나다.'
	),
	dialogue(
		'euija',
		['교기.', '기미.', '섬이 비었다.', '가서 채워라.', '체면을 지켜라.', '돌아오라는 명은 — 내가 적을 때까지 없다.'],
		['Gyogi.', 'Kimi.', 'The islands are empty.', 'Go fill them.', 'Keep your dignity.', 'The order to return — does not exist until I write it.']
	),
	dialogue(
		'gyogi',
		['…형님.', '피 이야긴 끝이군요.', '명단은… 언제부터였습니까.'],
		['…Hyungnim.', 'So the blood talk is over.', 'The list… how long have you had it.']
	),
	dialogue(
		'euija',
		['네가 내 돌을 따던 밤부터지.', '나는 이야기나 짓는 줄 알았잖아.', '배 타.'],
		['Since the night you took my stones.', 'You thought I only made stories.', 'Get on the boat.']
	),
	dialogue(
		'kimi',
		['왕자마마.', '표는… 이제 이쪽에 없습니다.', '가십시다.'],
		['Your Highness.', 'The count… is no longer ours.', 'We go.']
	),
	p(
		'Gyogi does not shout. Kimi’s white hair catches the one harbour lantern. Forty men follow because the alternative is a shorter night — and because the banners still say honour.',
		'교기는 소리치지 않는다. 기미의 흰 머리가 항구의 등불 하나에 걸린다. 마흔 명이 따른다. 다른 밤은 더 짧고, 깃발은 아직 체면이라 쓰여 있으니까.'
	),
	p(
		'By morning the Satek sleeve has no prince. Euija walks back up the hill and asks for wine. The reign can begin in earnest now.',
		'아침이 되면 사택 소매엔 왕자가 없다. 의자는 언덕을 다시 올라가 술을 청한다. 이제야 치세가 제대로 시작된다.'
	),
	dialogue(
		'euija',
		['용은 줄로 만들었지.', '이건 명단으로 만들었다.', '어느 쪽이 더 오래 가겠느냐.'],
		['The dragon was string.', 'This was a list.', 'Which one lasts longer.']
	)
];

ke.blocks.splice(isl, afterIsl - isl, ...exile);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('PE blocks', pe.blocks.length, 'KE blocks', ke.blocks.length);

// verify anchors for existing image slots still resolve
for (const [title, ats] of [
	['Prince Euija', ['Gyogi is younger. His mother is Queen Satek', 'Kimi does not raise his voice. He never has to.', 'The eight houses do not argue about Euija in public.']],
	['King Euija', ['By morning the Satek sleeve has no prince.']]
]) {
	const e = find(title);
	const blob = JSON.stringify(e.blocks);
	for (const at of ats) console.log(title, at.slice(0, 40), blob.includes(at));
}
