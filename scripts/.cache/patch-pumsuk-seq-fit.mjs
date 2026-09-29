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
	blockText(b).includes('After the feast his mouth is at her throat') ||
	blockText(b).includes('잔치가 끝난 뒤 그의 입이 목덜미에')
);
if (start < 0 || end < 0 || end < start) {
	throw new Error(`bad range start=${start} end=${end}`);
}

const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const newBlocks = [
	{
		kind: 'p',
		html: 'At the feast the wine finds Pumsuk first. Clean ice-blue silk. Crescent band. A cup he is not tasting. Then <b>the lamp-line is hers</b> — Maehwa walking the cheap hanging lamps like she built them, dirtied green jeogori, ochre chima washed too many times, the red sash tied by habit. Poor cloth against a dark hall. His clothes stay clean. Hers do not.',
		ko: '연회에서 술이 품석을 먼저 찾는다. 깨끗한 얼음빛 비단. 초승달 띠. 맛보지 않는 잔. 그리고 <b>등잔 줄은 그녀 것이다</b> — 매화가 싼 등잔을 자기가 세워 둔 것처럼 걷는다. 때 묻은 초록 저고리, 너무 많이 빤 황토 치마, 습관으로 맨 붉은 끈. 어두운 전각에 가난한 옷. 그의 옷은 깨끗하다. 그녀의 옷은 아니다.'
	},
	{
		kind: 'p',
		html: 'He talks to the cup. It does not help. <b>The training is a joke tonight.</b> Heart-pupils. A thread of drool he will not wipe. She is only a green shape in the lamp behind him, and that is enough.',
		ko: '잔에 말한다. 안 된다. <b>오늘 밤 훈련은 농담이다.</b> 눈 안에 하트. 닦지 않는 침 한 줄. 등잔 뒤로는 초록 실루엣뿐인데, 그걸로 충분하다.'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['여기.', '앉아.', '바람 핑계는 됐어.'],
		en: ['Here.', 'Sit.', 'Don’t bother with the wind.']
	},
	{
		kind: 'p',
		html: 'She drops beside him before he has stood. <b>She sits like the chair was always hers.</b> Jeogori already a little open — not court, not accident. The smirk shows teeth. His mouth is already open and he has not used it yet.',
		ko: '그가 일어서기도 전에 옆에 앉는다. <b>자리는 원래 자기 것이었다는 듯이 앉는다.</b> 저고리가 이미 조금 열려 있다 — 궁도 아니고, 실수도 아니다. 이빨이 보이는 미소. 그의 입은 이미 열려 있고, 아직 말을 안 했다.'
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
		lines: ['창고. 새벽까지.', '손 내려.', '여기.', '매듭에.'],
		en: ['Stores. Till dawn.', 'Hand down.', 'Here.', 'On the knot.']
	},
	{
		kind: 'p',
		html: 'She puts his clean True Bone hand on the frayed red knot herself — not the waist, the chest, where the cheap sash is already tearing. <b>His palm finds the worn knot.</b> More skin than a minute ago. She does not look at the hand. She looks at his face, to see the exact second it stops being a general’s face.',
		ko: '진골의 깨끗한 손을 헐거운 붉은 매듭 위에 제 손으로 올려 둔다 — 허리가 아니라 가슴, 싼 끈이 이미 찢어지는 곳. <b>손바닥이 낡은 매듭을 찾는다.</b> 일 분 전보다 살이 더 보인다. 손은 안 본다. 얼굴을 본다. 장군 얼굴이 끝나는 그 초를 보려고.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…옮기겠소.', '다리가— / 다리가 거역합니다.'],
		en: ['…I should move.', 'My legs— / my legs will not obey.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['세고 있었지.', '입 보는 거.', '<b>열일곱.</b>'],
		en: ['You were counting.', 'My mouth.', '<b>Seventeen.</b>']
	},
	{
		kind: 'p',
		html: 'She says seventeen with her tongue still on her tooth. Jeogori looser. The dirtied green falls another finger-width. <b>She counts his looks out loud.</b> A True Bone lady would have looked down. Maehwa never learned that, and she is using the gap.',
		ko: '열일곱을 이빨에 혀를 붙인 채로 말한다. 저고리가 더 헐겁다. 때 묻은 초록이 손가락 하나만큼 더 내린다. <b>그가 본 횟수를 소리 내어 센다.</b> 진골 아씨라면 눈을 내렸을 것이다. 매화는 그걸 배운 적이 없고, 그 빈칸을 쓴다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['서라벌에선… 이렇게 안 숨 쉽니다.', '입술이 먼저요.'],
		en: ['In Surabol we do not… breathe like this.', 'The mouth is first.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['서라벌 얘기 그만.', '<b>숨이 목덜미에.</b>', '장군 목덜미. / 내 거야, 지금.'],
		en: ['Drop Surabol.', '<b>Breath on the throat.</b>', 'A general’s throat. / Mine, tonight.']
	},
	{
		kind: 'p',
		html: 'She leans him into the post. His ice-blue robe has come open at the chest — clean silk, still clean, stupidly clean next to her mended green. Her mouth finds the tendon. <b>Heart-pupils, if anyone looked that close.</b> Drool he cannot swallow. She does not move back.',
		ko: '그를 기둥에 기대게 한다. 얼음빛 도포가 가슴에서 열린다 — 깨끗한 비단, 여전히 깨끗하고, 기운 초록 옆에 바보같이 깨끗하다. 입이 힘줄을 찾는다. <b>가까이 보면 눈 안에 하트.</b> 삼키지 못하는 침. 그녀는 물러나지 않는다.'
	},
	{
		kind: 'p',
		html: '<b>The mouth goes first.</b> He holds her like he is afraid the hall will take her back — open, hungry, wine off her tongue — and the dirtied jeogori is still on, just enough off the shoulder that the figure starts to tell. The feast keeps talking on the other side of the cheap screen.',
		ko: '<b>입이 먼저다.</b> 전각이 도로 가져갈까 봐 안는다 — 벌리고, 배고프게, 혀에서 술맛을 찾으며. 때 묻은 저고리는 아직 있다. 어깨만 조금 내려가, 몸이 말하기 시작한다. 싼 병풍 너머로 잔치는 계속 말한다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['잠깐—', '소리 나요.'],
		en: ['Wait—', 'I’ll make a sound.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['안 기다려.', '소리는 내 입에 넣어.'],
		en: ['I’m not waiting.', 'Put the sound in my mouth.']
	},
	{
		kind: 'p',
		html: 'Then she does the modest thing she never uses. Jeogori closed. Back to him. One step toward the dark. <b>I should go, she says, like a joke that wants to be caught.</b> His hand is already in the air.',
		ko: '한 번도 안 쓰던 정숙함을 한다. 저고리를 여민다. 등을 보인다. 어둠 쪽으로 한 걸음. <b>이만 갈게, 라고 한다. 잡히고 싶은 농담처럼.</b> 그의 손은 이미 허공에 있다.'
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: ['이만 갈게.', '장군은 잔치에 남아.'],
		en: ['I’m going.', 'You stay with the feast.']
	},
	{
		kind: 'p',
		html: '<b>He is already on the floor.</b> She has sat back down as if the leaving were a game. Bare foot. Cheap hem hiked just enough. His clean blue sleeve on her ankle. He does not remember kneeling.',
		ko: '<b>이미 바닥에 있다.</b> 그녀는 가는 척이 장난이었다는 듯이 다시 앉는다. 맨발. 싼 자락이 조금 걷혀 있다. 깨끗한 푸른 소매가 발목에. 무릎 꿇은 줄은 모른다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['가지 마.', '남아. — 남아 줘.'],
		en: ['Don’t go.', 'Stay. — Stay.']
	},
	{
		kind: 'p',
		html: 'We see what he cannot quite: the look down, unrefined, a little pleased. She does not start with her hands. She starts with a plum from the tray. Jeogori open again, farther than before — the figure the yard has been staring at since spring. <b>She puts the plum in her mouth so he has to watch.</b> Pink in his eyes. Drool. Thirty-one. She has never rushed a man who was already lost.',
		ko: '그가 다 못 보는 것을 본다: 내려다보는 눈, 곱지 않고, 조금 기분 좋은. 손은 나중이다. 쟁반의 자두다. 저고리가 다시 열린다, 전보다 더 — 봄부터 마당이 보던 몸. <b>그가 보게 하려고 자두를 입에 넣는다.</b> 눈에 분홍. 침. 서른하나. 이미 끝난 사내를 재촉한 적은 없다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'What follows is not a kiss. It is a True Bone boy with the manners torn off. The chronicle used to look away here. It does not, tonight. Worn hanbok still on — just more of her, beat by beat. <b>She meant to lead.</b>',
		ko: '그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다. 낡은 한복은 아직 있다 — 다만 박자마다 그녀가 더 보인다. <b>이끌려고 했다.</b>'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['못 참아.', '안에 — 안에 둬. / 빼지 마.'],
		en: ['I can’t.', 'Inside — leave it. / Don’t pull away.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She is still standing when the sound leaves her. Jeogori open on the chest. Him behind her in that clean ice-blue, already not a guest. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. The feast pretends not to hear a poor woman making a True Bone’s name.',
		ko: '소리가 나올 때도 아직 서 있다. 저고리가 가슴에서 열려 있다. 깨끗한 얼음빛 안에서 그는 이미 손님이 아니다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 잔치는 가난한 여자가 진골 이름을 내는 것을 안 들은 척한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: ['잠깐—', '너무 — 깊어.', '빼지 마. / 그 안에. 다.'],
		en: ['Wait—', 'Too — deep.', 'Don’t pull out. / In me. All of it.']
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Then she is down against the wall and he is over her, and the dirtied green is open as far as it will go without coming off. The ochre chima is a wreck at the hip. His silk is still clean. That is the insult of it. He finishes inside her before the lamp has burned an inch, and it is not a polite amount. <b>She loses the room.</b> She came to take a half of a True Bone and she is the one shaking, asking for the next one before she has caught this one.',
		ko: '벽에 내려앉고 그가 위에 있다. 때 묻은 초록이, 벗지 않고 열릴 수 있는 데까지 열려 있다. 황토 치마는 허리에서 망가졌다. 그의 비단은 아직 깨끗하다. 그게 모욕이다. 등잔이 한 치도 안 줄어 그 안에 붓고, 예의를 지키는 양이 아니다. <b>방을 잃는다.</b> 진골의 반을 가지러 온 여자가, 떨며, 이번 것을 받기도 전에 다음을 청한다.'
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Twice more. Hanbok still on her — just less of it. Dawn is a grey slit under the door. She is hoarse. For the first time in this fortress she is not the one running the room.',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 두 번 더. 한복은 아직 있다 — 다만 덜 있다. 새벽은 문틈의 회색 줄. 목이 쉬었다. 이 성에서 처음으로 방을 운영하는 쪽이 아니다.'
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['…이러다 성을 잃어.', '이미… 잃은 것 같아.'],
		en: ['…At this rate I lose the fortress.', 'I think… I already have.']
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
		chip: chipM,
		person: 'gumilwife',
		lines: ['가시기 전에 하나만 두고 가.', '반은 당신인 거.'],
		en: ['Leave me one thing before you go.', 'Something that is half you.']
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['알아. 그래도 원해.', '지금. 여기서.'],
		en: ['I know. I still want it.', 'Now. Here.']
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
		html: 'She turns. Her back finds his chest. He does not let the space return. <b>After the feast his mouth is at her throat</b> — ice-blue still clean, dirtied green pulled from the shoulder. The manners he was trained in do not survive the second cup.',
		ko: '돈다. 등이 그의 가슴에 닿는다. 그는 그 사이를 다시 비우지 않는다. <b>잔치가 끝난 뒤 그의 입이 목덜미에 있다</b> — 얼음빛은 아직 깨끗하고, 때 묻은 초록이 어깨에서 당겨진다. 배운 예의는 두 잔째를 넘기지 못한다.'
	}
];

daeya.blocks.splice(start, end - start + 1, ...newBlocks);

const alts = {
	'pumsuk-seq-01-walk':
		'Wide: dirtied green hanbok on the lamp-line; Pumsuk’s clean ice-blue at the table, failing not to look',
	'pumsuk-seq-02-contain':
		'Close: Pumsuk’s ice-blue heart-pupils and drool; Maehwa a green blur in the lamp behind',
	'pumsuk-seq-03-sit':
		'She sits beside him — worn green jeogori already open, teeth in the smirk; his mouth empty',
	'pumsuk-seq-04-waist':
		'His clean hand on the torn red knot at her chest; more skin than a minute ago',
	'pumsuk-seq-05-count':
		'Maehwa close — tongue on tooth, counting seventeen, dirtied green fallen another width',
	'pumsuk-seq-06-throat':
		'Her mouth at his throat; his ice-blue robe open, heart-pupils, drool against the post',
	'pumsuk-seq-07-kiss':
		'He holds her in the dark hall — dirtied green on clean ice-blue, jeogori off the shoulder',
	'pumsuk-seq-08-leave':
		'Jeogori closed, one step into the dark; his hand already in the air',
	'pumsuk-seq-09-ankle':
		'She sits back down, bare foot; he kneels, clean blue sleeve locked on her ankle',
	'pumsuk-seq-10-fruit':
		'Plum at her mouth, jeogori open on the figure; he beside her with pink heart-pupils',
	'pumsuk-seq-11-scream':
		'Still standing — jeogori open, the sound leaving her; he behind in clean ice-blue',
	'pumsuk-seq-12-lose':
		'Down against the wall, dirtied green open as far as it will go; she has lost the room'
};

for (const im of daeya.images) {
	if (alts[im.id]) im.alt = alts[im.id];
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`rewrote ${end - start + 1} → ${newBlocks.length} blocks; alts updated`);
