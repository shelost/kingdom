import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

function findEntry(title) {
	for (const ch of story) {
		const en = (ch.entries ?? []).find((e) => e.title === title);
		if (en) return en;
	}
	throw new Error(`missing ${title}`);
}

function blockText(b) {
	if (!b) return '';
	if (typeof b.html === 'string') return b.html;
	if (b.kind === 'dialogue') return [...(b.lines ?? []), ...(b.en ?? [])].join(' ');
	return '';
}

const daeya = findEntry('Daeya Fortress');

const start = daeya.blocks.findIndex((b) =>
	blockText(b).includes('At the feast the wine finds Pumsuk first')
);
const end = daeya.blocks.findIndex((b) =>
	blockText(b).includes('His mouth is at her throat after the feast')
);
if (start < 0 || end < 0 || end < start) {
	throw new Error(`bad range start=${start} end=${end}`);
}

const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const newBlocks = [
	{
		kind: 'p',
		html: 'At the feast the wine finds Pumsuk first. He is twenty-four and has been handed everything he owns. Then <b>the lamp-line is hers</b> — Maehwa walking the cheap lamps like she built them, worn green jeogori, ochre chima that has been washed too many times, the red sash tied by habit not ceremony. Poor cloth. A body the cloth cannot make modest.',
		ko: '연회에서 술이 품석을 먼저 찾는다. 스물넷, 가진 것을 모두 받아만 온 사내다. 그리고 <b>등잔 줄은 그녀 것이다</b> — 매화가 싼 등잔을 자기가 세워 둔 것처럼 걷는다. 낡은 초록 저고리, 너무 많이 빤 황토 치마, 예식이 아니라 습관으로 맨 붉은 끈. 가난한 옷. 그 옷이 가릴 수 없는 몸.'
	},
	{
		kind: 'p',
		html: 'He talks to the cup. To the beams. To the idea of a fortress. <b>The training is a joke tonight.</b> His jaw is already failing. The wine has nothing to do with it.',
		ko: '잔에 말한다. 들보에 말한다. 요새라는 생각에 말한다. <b>오늘 밤 훈련은 농담이다.</b> 턱이 이미 지고 있다. 술 탓이 아니다.'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['여기.', '앉아.', '바람? / 바람 핑계는 됐어.'],
		en: ['Here.', 'Sit.', 'Wind? / Don’t bother with the wind.']
	},
	{
		kind: 'p',
		html: 'She drops beside him before he has stood. Knee already on his. <b>She sits like the chair was always hers.</b> The smirk is not court. It is a woman who has watched men lose their manners in worse rooms than this.',
		ko: '그가 일어서기도 전에 옆에 앉는다. 무릎이 이미 그의 무릎 위에. <b>자리는 원래 자기 것이었다는 듯이 앉는다.</b> 미소는 궁이 아니다. 이보다 험한 방에서 사내 예의가 무너지는 걸 본 여자의 것이다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…자네 남편은—', '잠깐. 입이… 먼저 열렸소.'],
		en: ['…Your husband—', 'Wait. My mouth… opened first.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['창고. 새벽까지.', '손 내려.', '여기.', '<b>허리에.</b>'],
		en: ['Stores. Till dawn.', 'Hand down.', 'Here.', '<b>On the waist.</b>']
	},
	{
		kind: 'p',
		html: 'She puts his polite True Bone hand on the frayed red sash herself. <b>His palm finds the worn knot.</b> She does not look at the hand. She looks at his face, to see the exact second it stops being a general’s face.',
		ko: '진골의 예의 바른 손을 헐거운 붉은 끈 위에 제 손으로 올려 둔다. <b>손바닥이 낡은 매듭을 찾는다.</b> 손은 안 본다. 얼굴을 본다. 장군 얼굴이 끝나는 그 초를 보려고.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…옮기겠소.', '세 번째요.', '다리가— / 다리가 거역합니다.'],
		en: ['…I should move.', 'Third time.', 'My legs— / my legs will not obey.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['세고 있었지.', '입 보는 거.', '<b>열일곱.</b>', '이빨 보이게 웃지 마. / 더 할 테니까.'],
		en: ['You were counting.', 'My mouth.', '<b>Seventeen.</b>', 'Don’t grin with your teeth. / I’ll give you more.']
	},
	{
		kind: 'p',
		html: 'She says seventeen with her tongue still on her tooth. Unrefined. Pleased. <b>She counts his looks out loud.</b> A True Bone lady would have looked down. Maehwa never learned that, and she is using the gap.',
		ko: '열일곱을 이빨에 혀를 붙인 채로 말한다. 곱지 않다. 기분 좋다. <b>그가 본 횟수를 소리 내어 센다.</b> 진골 아씨라면 눈을 내렸을 것이다. 매화는 그걸 배운 적이 없고, 그 빈칸을 쓴다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['서라벌에선… 이렇게 안 숨 쉽니다.', '이렇게 안—', '입술이 먼저요.'],
		en: ['In Surabol we do not… breathe like this.', 'We do not—', 'The mouth is first.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['서라벌 얘기 그만.', '여기야.', '<b>숨이 목덜미에.</b>', '장군 목덜미. / 내 거야, 지금.'],
		en: ['Drop Surabol.', 'You’re here.', '<b>Breath on the throat.</b>', 'A general’s throat. / Mine, tonight.']
	},
	{
		kind: 'p',
		html: 'She leans in without asking. Mouth almost on the tendon. He makes a sound that is not a word. <b>Heart-pupils, if anyone looked that close.</b> Drool he tries to swallow. She does not move back.',
		ko: '묻지 않고 기댄다. 입이 힘줄에 닿을 듯. 그는 단어가 아닌 소리를 낸다. <b>가까이 보면 눈 안에 하트.</b> 삼키려다 남는 침. 그녀는 물러나지 않는다.'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['진골 아씨들은 이렇게 안 앉지.', '난 못 배워서.', '다리도. 눈도.', '허벅지에 손 가도 되는지— / 가도 돼.'],
		en: ['True Bone girls don’t sit like this.', 'I never learned.', 'Not the legs. Not the eyes.', 'Whether a hand may go to the thigh— / it may.']
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['배우지 마.', '그대로.', '눈 안 떨어져.', '손도— / 거두지 마.'],
		en: ['Don’t learn it.', 'Stay.', 'I cannot look away.', 'And the hand— / don’t take it away.']
	},
	{
		kind: 'p',
		html: '<b>The mouth goes first.</b> He kisses her the way a boy kisses when he has decided, all at once, to stop being careful — open, hungry, wine off her tongue — and she takes his head in both hands so he cannot make it small. When he pulls back for air she follows him into it. The feast keeps talking on the other side of the cheap screen.',
		ko: '<b>입이 먼저다.</b> 조심하기를 한꺼번에 그만두기로 한 소년처럼 맞춘다 — 벌리고, 배고프게, 혀에서 술맛을 찾으며. 매화가 두 손으로 머리를 붙들어 다시 작게 못 만들게 한다. 숨 쉬려 물러나면 따라와 다시 넣는다. 싼 병풍 너머로 잔치는 계속 말한다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['잠깐—', '소리 나요.', '내가—'],
		en: ['Wait—', 'I’ll make a sound.', 'I—']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['안 기다려.', '소리는 내 입에 넣어.', '아무도 모르게.'],
		en: ['I’m not waiting.', 'Put the sound in my mouth.', 'Where nobody hears.']
	},
	{
		kind: 'p',
		html: 'Then she does the modest thing she never uses. Jeogori closed at the throat. One step toward the dark. <b>I should go, she says, like a joke that wants to be caught.</b>',
		ko: '한 번도 안 쓰던 정숙함을 한다. 저고리를 목에서 여민다. 어둠 쪽으로 한 걸음. <b>이만 갈게, 라고 한다. 잡히고 싶은 농담처럼.</b>'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['이만 갈게.', '장군은 잔치에 남아.', '…안 남아도, 난 알아.'],
		en: ['I’m going.', 'You stay with the feast.', '…Even if you don’t. I know.']
	},
	{
		kind: 'p',
		html: '<b>He is already on the floor.</b> Forehead almost to the boards. Hand locked on her ankle — the cheap hem, the dirt-dark instep, the woman who was leaving. He does not remember kneeling.',
		ko: '<b>이미 바닥에 있다.</b> 이마가 마루에 닿을 듯. 손이 발목을 붙든다 — 싼 자락, 흙 묻은 발등, 가려던 여자. 무릎 꿇은 줄은 모른다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['가지 마.', '가지 마.', '남아. — 남아 줘.'],
		en: ['Don’t.', 'Don’t go.', 'Stay. — Stay.']
	},
	{
		kind: 'p',
		html: 'We see what he cannot: the smirk, unrefined, a little cruel. Then she turns, and the jeogori opens where she closed it. She does not start with her hands. She starts with a plum from the tray, as if she were still at the table. <b>She puts the plum in her mouth so he has to watch.</b> Juice on a poor woman’s lip. Thirty-one. She has never rushed a man who was already lost.',
		ko: '그가 보면 안 되는 것을 본다: 곱지 않고, 조금 잔인한 미소. 돌아서며 여몄던 저고리가 다시 열린다. 손은 나중이다. 쟁반의 자두다. 아직 상에 있는 척. <b>그가 보게 하려고 자두를 입에 넣는다.</b> 가난한 여자 입술에 즙. 서른하나. 이미 끝난 사내를 재촉한 적은 없다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'What follows is not a kiss. It is a True Bone boy with the manners torn off. The chronicle used to look away here. It does not, tonight. One lamp. Worn hanbok still on — shoulder, then the knot, then the chima hiked because she likes watching him break in pieces. <b>She meant to lead.</b> She has led every man in this fortress who was allowed to look.',
		ko: '그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다. 등 하나. 낡은 한복은 아직 있다 — 어깨, 매듭, 그리고 그가 조각으로 무너지는 걸 보려고 걷은 치마. <b>이끌려고 했다.</b> 봐도 되는 사내들은 다 이끌어 봤다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['못 참아.', '못 참겠어.', '안에 — 안에 둬. / 빼지 마.'],
		en: ['I can’t.', 'I cannot wait.', 'Inside — leave it. / Don’t pull away.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He fucks like politeness was a lid. She starts on top, still in the ochre chima, laughing with her teeth — and the laugh turns into a sound she did not budget for. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. The feast pretends not to hear a poor woman screaming a True Bone’s name.',
		ko: '예의가 뚜껑이었다는 걸 방금 안 것처럼 박는다. 그녀가 위에 올라, 황토 치마를 입은 채로, 이빨을 보이게 웃다 — 웃음이 예산에 없던 소리가 된다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 잔치는 가난한 여자가 진골 이름을 지르는 것을 안 들은 척한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['잠깐—', '너무 — 깊어.', '나… 나 먼저…', '빼지 마. / 그 안에. 다.'],
		en: ['Wait—', 'Too — deep.', 'I… I’m first…', 'Don’t pull out. / In me. All of it.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He finishes inside her before the lamp has burned an inch, and it is not a polite amount. She feels it go — hot, stupid, endless — and her mouth opens on a sound that is no longer a strategy. He does not stop. <b>She loses the room.</b> She came to take a half of a True Bone and she is the one shaking on the boards, asking for the next one before she has caught this one.',
		ko: '등잔이 한 치도 안 줄어 그 안에 붓고, 예의를 지키는 양이 아니다. 뜨겁고, 바보같고, 끝이 없다. 입이 열리며 나는 소리는 이제 작전이 아니다. 멈추지 않는다. <b>방을 잃는다.</b> 진골의 반을 가지러 온 여자가, 마루 위에서 떨며, 이번 것을 받기도 전에 다음을 청한다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Twice more. Hanbok still somewhere on her — sash gone, jeogori open, chima a wreck at the hip. Dawn is a grey slit under the door and he is still in her. She is hoarse. Wet to the thigh. For the first time in this fortress she is not the one running the room.',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 두 번 더. 한복은 아직 어딘가에 있다 — 끈은 없고, 저고리는 열렸고, 치마는 허리에서 망가졌다. 새벽은 문틈의 회색 줄이고 그는 아직 그 안에 있다. 목이 쉬었다. 허벅지까지 젖었다. 이 성에서 처음으로 방을 운영하는 쪽이 아니다.'
	},
	{
		kind: 'p',
		html: 'The next kiss is not careful, and this time it is his. He takes her mouth the way he took the sash — open, hungry — and she bites his lip and laughs into it, wrecked, still poorer than him, still the one who started it.',
		ko: '다음 입맞춤은 조심스럽지 않고, 이번엔 그가 시작한다. 끈을 벗긴 그 손으로 입을 가져간다 — 벌리고, 배고프게 — 그녀가 입술을 물고 그 안에서 웃는다. 망가졌고, 여전히 그보다 가난하고, 그래도 먼저 시작한 쪽이다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…이러다 성을 잃어.', '아니—', '이미… 잃은 것 같아.'],
		en: ['…At this rate I lose the fortress.', 'No—', 'I think… I already have.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['지금 성 얘기야?', '손은… 다른 데 있는데.'],
		en: ['You talking about the fortress?', 'Your hands… are somewhere else.']
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['아니.', '당신.', '목. 숨. 당신…'],
		en: ['No.', 'You.', 'Throat. Breath. You…']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['가시기 전에 하나만 두고 가.', '밤에… 나를 채운 거.', '반은 당신인 거.'],
		en: ['Leave me one thing before you go.', 'What filled me tonight.', 'Something that is half you.']
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…그런 아이 이름 알지.', '알아. 그래도 원해.', '지금. 여기서. 입술이 아직… 닿은 채로.'],
		en: ['…You know what they call a child like that.', 'I know. I still want it.', 'Now. Here. While your mouth… is still on mine.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['알지.', '그래도 내 아이보다는 <b>반쪽</b>이 나아.'],
		en: ['I know.', 'A <b>half</b> is still more than mine would ever be.']
	},
	{
		kind: 'p',
		html: 'She turns. Her back finds his chest. He does not let the space return. <b>After the feast his mouth is at her throat</b> — ice-blue silk open, worn green jeogori pulled from the shoulder. The manners he was trained in do not survive the second cup.',
		ko: '돈다. 등이 그의 가슴에 닿는다. 그는 그 사이를 다시 비우지 않는다. <b>잔치가 끝난 뒤 그의 입이 목덜미에 있다</b> — 얼음빛 비단이 열리고, 낡은 초록 저고리가 어깨에서 당겨진다. 배운 예의는 두 잔째를 넘기지 못한다.'
	}
];

daeya.blocks.splice(start, end - start + 1, ...newBlocks);

const retire =
	/^(nsfw-pumsuk|pumsuk-feast|maehwa-feast|nsfw-yehwa-fruit|nsfw-yehwa-shadow|nsfw-yehwa-sash-hip|nsfw-yehwa-lamp-split|nsfw-pumsuk-heart|nsfw-pumsuk-lookdown|pumsuk-lust|pumsuk-half-share|pumsuk-yehwa-notice|pumsuk-yehwa-indifferent|nsfw-pumsuk-gumilwife)/;

for (const im of daeya.images) {
	if (retire.test(im.id)) im.at = '__retired_pumsuk_seq__';
}

const lockRefs = ['/ch_gumil_wife.png', '/bn_gumil_wife.png', '/ch_pumsuk.png'];
const lockPrompt =
	'Intimate cinematic 16:9 movie still. LOCKED SET: same Daeya feast-hall night, rough timber posts, worn pine floor, cheap hanging oil-lamps, torn paper screen. Maehwa in WORN poor hanbok matching attached portrait (faded green jeogori, ochre chima, frayed red sash, messy bun, wood-sprig binyeo). Pumsuk ice-blue #7EB8F0 crescent band matching attached portrait. Dramatic chiaroscuro. No text. No watermark.';

const seq = [
	{
		id: 'pumsuk-seq-01-walk',
		at: 'the lamp-line is hers',
		alt: 'Wide: Maehwa walks the cheap lamp-line in worn green hanbok; Pumsuk at the table failing not to look'
	},
	{
		id: 'pumsuk-seq-02-contain',
		at: 'The training is a joke tonight',
		alt: 'Close: Pumsuk’s jaw failing — ice-blue silk, crescent band, blown eyes, knuckles white on the cup'
	},
	{
		id: 'pumsuk-seq-03-sit',
		at: 'She sits like the chair was always hers',
		alt: 'Two-shot: Maehwa drops beside him, worn hanbok, knee on his, unrefined smirk'
	},
	{
		id: 'pumsuk-seq-04-waist',
		at: 'His palm finds the worn knot',
		alt: 'His True Bone hand on her frayed red sash — she watches his face break'
	},
	{
		id: 'pumsuk-seq-05-count',
		at: 'She counts his looks out loud',
		alt: 'Maehwa close — tongue on tooth, counting seventeen, worn green jeogori, lamp-cut'
	},
	{
		id: 'pumsuk-seq-06-throat',
		at: 'Heart-pupils, if anyone looked that close',
		alt: 'Her mouth at his throat; his ice-blue heart-pupils and a thread of drool'
	},
	{
		id: 'pumsuk-seq-07-kiss',
		at: 'The mouth goes first',
		alt: 'Open hungry kiss — worn green and ice-blue, feast lamps through the torn screen'
	},
	{
		id: 'pumsuk-seq-08-leave',
		at: 'I should go, she says, like a joke that wants to be caught',
		alt: 'Maehwa closes the jeogori and takes one step; Pumsuk already reaching'
	},
	{
		id: 'pumsuk-seq-09-ankle',
		at: 'He is already on the floor',
		alt: 'Pumsuk knelt on worn boards, hand locked on her ankle; we see her smirk'
	},
	{
		id: 'pumsuk-seq-10-fruit',
		at: 'She puts the plum in her mouth so he has to watch',
		alt: 'Maehwa sucks a plum, jeogori open, worn ochre chima; he kneels in the lamp'
	},
	{
		id: 'pumsuk-seq-11-scream',
		at: 'The laugh becomes a scream',
		alt: 'She is on him in hiked worn hanbok — laugh turning to a scream, same hall, same lamp'
	},
	{
		id: 'pumsuk-seq-12-lose',
		at: 'She loses the room',
		alt: 'Overwhelmed Maehwa, wrecked worn hanbok still on; Pumsuk feral in ice-blue, lamp dying'
	}
];

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

let after = 'daeya_03';
for (const s of seq) {
	upsertImage(
		daeya,
		{
			id: s.id,
			ratio: 1.778,
			tone: '#8AAFA0',
			nsfw: true,
			at: s.at,
			alt: s.alt,
			refs: lockRefs,
			people: ['gumilwife', 'pumsuk'],
			prompt: lockPrompt
		},
		after
	);
	after = s.id;
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`replaced ${end - start + 1} blocks with ${newBlocks.length}; ${seq.length} seq slots`);
