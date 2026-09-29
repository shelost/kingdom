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
	if (b.kind === 'monologue') return `${b.html ?? ''} ${b.ko ?? ''}`;
	return '';
}

const daeya = findEntry('Daeya Fortress');
const chipM = '#c98fb0';
const chipP = '#7aa8d8';

const start = daeya.blocks.findIndex((b) =>
	blockText(b).includes('바람 핑계는 됐어')
);
const end = daeya.blocks.findIndex((b) =>
	blockText(b).includes('White milk on the dirtied green')
);
if (start < 0 || end < 0 || end < start) {
	throw new Error(`bad range start=${start} end=${end}`);
}

const newBlocks = [
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'여기— 아, 바람 핑계는 됐어.',
			'앉아. 아니 거기 말고, 여기. 무릎 붙이게.'
		],
		en: [
			'Here— ah, don’t bother with the wind.',
			'Sit. Not there, here. Closer. Your knee can touch.'
		]
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
		lines: ['자네 남편은—', '잠깐. 입이 먼저 열렸소. 그건 안 하려고 했는데.'],
		en: ['Your husband—', 'Wait. My mouth opened first. I was not going to say that.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'창고야, 새벽까지. 그 사람은.',
			'손은— 내려. 아니, 내려서 여기. 매듭에.',
			'봐, 이미 찢어지잖아. 네가 찢은 거 아니야. 아직.'
		],
		en: [
			'Stores. Till dawn. That’s where he is.',
			'Hand— down. No, down and here. On the knot.',
			'Look, it’s already tearing. You didn’t do that. Not yet.'
		]
	},
	{
		kind: 'p',
		html: 'She puts his clean True Bone hand on the frayed red knot herself — not the waist, the chest, where the cheap sash is already tearing. <b>His palm finds the worn knot.</b> More skin than a minute ago. She does not look at the hand. She looks at his face, to see the exact second it stops being a general’s face.',
		ko: '진골의 깨끗한 손을 헐거운 붉은 매듭 위에 제 손으로 올려 둔다 — 허리가 아니라 가슴, 싼 끈이 이미 찢어지는 곳. <b>손바닥이 낡은 매듭을 찾는다.</b> 일 분 전보다 살이 더 보인다. 손은 안 본다. 얼굴을 본다. 장군 얼굴이 끝나는 그 초를 보려고.'
	},
	{
		kind: 'monologue',
		person: 'pumsuk',
		html: 'I should move. I am not moving. If I look down I am finished. I am already looking down.',
		ko: '옮겨야 한다. 안 옮긴다. 내려다보면 끝이다. 이미 내려다보고 있다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		chip: chipP,
		person: 'pumsuk',
		lines: ['옮기겠소—', '다리가. 다리가 거역합니다. 미안하오. 훈련이— 오늘 밤 훈련은 농담이오.'],
		en: [
			'I should move—',
			'My legs. My legs will not obey. Forgive me. The training is— the training is a joke tonight.'
		]
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'세고 있었지. 잔은 안 보고.',
			'입 보는 거. 열일곱. <b>열일곱</b>이야, 내가 세었어.',
			'진골 아씨면 눈 내렸을 텐데. 나는 그거 안 배웠거든.'
		],
		en: [
			'You were counting. Not the cup.',
			'My mouth. Seventeen. <b>Seventeen</b>, I counted.',
			'A True Bone lady would have looked down. I never learned that part.'
		]
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
		lines: [
			'서라벌에선 이렇게 안— 숨이.',
			'입술이 먼저요. 미안. 그 말은 궁에서 안 쓰는 말이오.'
		],
		en: [
			'In Surabol we do not— breathe. Like this.',
			'The mouth is first. Sorry. That is not a sentence they taught me.'
		]
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'서라벌 얘기 그만해. 숨이— 목덜미에 있잖아.',
			'장군 목덜미. 지금 내 거야. 미안, 내 거야.',
			'<b>숨이 목덜미에.</b> 기대. 기둥 있어.'
		],
		en: [
			'Drop Surabol. Your breath is— it’s on my throat already.',
			'A general’s throat. Mine tonight. Sorry. Mine.',
			'<b>Breath on the throat.</b> Lean. There’s a post.'
		]
	},
	{
		kind: 'p',
		html: 'She leans him into the post. His ice-blue robe has come open at the chest — clean silk, still clean, stupidly clean next to her mended green. Her mouth finds the tendon. <b>Heart-pupils, if anyone looked that close.</b> Drool he cannot swallow. She does not move back.',
		ko: '그를 기둥에 기대게 한다. 얼음빛 도포가 가슴에서 열린다 — 깨끗한 비단, 여전히 깨끗하고, 기운 초록 옆에 바보같이 깨끗하다. 입이 힘줄을 찾는다. <b>가까이 보면 눈 안에 하트.</b> 삼키지 못하는 침. 그녀는 물러나지 않는다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		html: 'Twenty-four and he is already dripping. If I say the stupid thing now he will not survive it. I am going to say the stupid thing.',
		ko: '스물넷인데 이미 침이 흘러. 지금 바보 같은 말 하면 이 아이 못 버틸 거야. 바보 같은 말 할 거야.',
		nsfw: true
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
		lines: ['잠깐— 소리 나요.', '안 내려고 했는데. 내고 있소.'],
		en: ['Wait— I’ll make a sound.', 'I was trying not to. I am.']
	},
	{
		kind: 'dialogue',
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'안 기다려. 미안, 안 기다려.',
			'소리는 내 입에 넣어. 병풍이 다 들을 필요는 없잖아. 아니, 들어도 돼. 나는 상관없어.'
		],
		en: [
			'I’m not waiting. Sorry. I’m not.',
			'Put the sound in my mouth. The screen doesn’t have to hear. Or it can. I don’t care.'
		]
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
		lines: [
			'이만 갈게— 아니 가라는 게 아니라.',
			'잡히면 남는 거고. 장군은 잔치에 남아. 남아도 되고.'
		],
		en: [
			'I’m going— I don’t mean go.',
			'If you catch me I stay. You stay with the feast. Or don’t.'
		]
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
		lines: ['가지 마.', '남아. — 남아 줘. 무릎이 먼저 왔소. 나는 아직—'],
		en: ['Don’t go.', 'Stay. — Stay. My knees got here first. I am still—']
	},
	{
		kind: 'p',
		html: 'We see what he cannot quite: the look down, unrefined, a little pleased. She does not start with her hands. She starts with a plum from the tray. Jeogori open again, farther than before — the figure the yard has been staring at since spring. <b>She puts the plum in her mouth so he has to watch.</b> Pink in his eyes. Drool. Thirty-one. She has never rushed a man who was already lost.',
		ko: '그가 다 못 보는 것을 본다: 내려다보는 눈, 곱지 않고, 조금 기분 좋은. 손은 나중이다. 쟁반의 자두다. 저고리가 다시 열린다, 전보다 더 — 봄부터 마당이 보던 몸. <b>그가 보게 하려고 자두를 입에 넣는다.</b> 눈에 분홍. 침. 서른하나. 이미 끝난 사내를 재촉한 적은 없다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		html: 'If I put the plum in first he has to watch the mouth. He is already watching the mouth. Good. I have not been looked at like this in ten years. I am going to ruin him a little.',
		ko: '자두를 먼저 넣으면 입을 볼 수밖에 없어. 이미 보고 있어. 좋아. 십 년 만에 이렇게 봐. 조금 망가뜨릴 거야.',
		nsfw: true
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'What follows is not a kiss. It is a True Bone boy with the manners torn off. The chronicle used to look away here. It does not, tonight. Worn hanbok still on — just more of her, beat by beat. <b>She meant to lead.</b> She lasts three thrusts and then she is the one making the sound.',
		ko: '그다음이 입맞춤이 아니다. 예절이 벗겨진 진골 소년이다. 이 기록은 여기서 눈을 돌리곤 했다. 오늘 밤은 돌리지 않는다. 낡은 한복은 아직 있다 — 다만 박자마다 그녀가 더 보인다. <b>이끌려고 했다.</b> 세 번을 버티고, 소리를 내는 쪽이 그녀가 된다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'봐. 이 몸— 십 년이야, 이런 거.',
			'검일은 문을 열듯 하거든. 너는 지금 방을 부수고 있어.',
			'미안, 그 말은— 아니, 그 말 맞는데. 더 세게.'
		],
		en: [
			'Look. This body— it’s been ten years since anything like this.',
			'Gumil opens a door. You’re taking the room apart.',
			'Sorry, that was— no. That’s right. Harder.'
		]
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: [
			'허리— 허리가 미쳤소.',
			'못 참아. 안에— 안에 둬. 빼라는 말 하지 마시오. 안 뺄 거요.'
		],
		en: [
			'The waist— your waist is insane.',
			'I can’t. Inside— leave it. Don’t tell me to pull out. I am not going to.'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He takes her standing first, from behind, the way a man takes something he has been staring at since the lamp-line. Ice-blue still on. Dirtied green hiked. Each thrust is a hit — hip to hip, the cheap post knocking, her chest thrown into the gold. She is thirty-one and wet like the first time. He is twenty-four and does not know how to be gentle.',
		ko: '먼저 서서, 뒤에서 가진다. 등잔 줄부터 보던 것을 가지는 방식이다. 얼음빛은 아직 있다. 때 묻은 초록은 걷혀 있다. 한 번이 한 대다 — 허리와 허리, 싼 기둥이 울리고, 가슴이 금빛으로 밀린다. 서른하나. 처음처럼 젖어 있다. 스물넷. 부드럽게 하는 법을 모른다.'
	},
	{
		kind: 'monologue',
		person: 'pumsuk',
		html: 'I should stop. I am not stopping. The silk is still clean. That is the stupidest thought I have ever had. Harder. She asked. I am going to.',
		ko: '멈춰야 한다. 안 멈춘다. 비단은 아직 깨끗하다. 평생 한 생각 중에 제일 바보 같은 생각이다. 더 세게. 그녀가 청했다. 할 것이다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'착하지— 아니, 착하다는 게 아니라. 그 허리.',
			'젊은 허리야. 내가 십 년 동안 기다린 거.',
			'씨발. 기다려. 아니 기다리지 마.'
		],
		en: [
			'Good boy— I don’t mean good. I mean that waist.',
			'A young waist. The one I’ve been waiting ten years for.',
			'Fuck. Wait. No. Don’t wait.'
		]
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: [
			'소리 나요— 안 돼. 더 깊이—',
			'이 가슴. 이 엉덩이. 미쳤소. 미안. 미쳤소.'
		],
		en: [
			'I’ll make a sound— no. Deeper—',
			'These breasts. This ass. You’re insane. Sorry. You’re insane.'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'She is still standing when the sound leaves her. Jeogori open on the chest. Him behind her in that clean ice-blue, already not a guest, pounding so the torn screen jumps. <b>The laugh becomes a scream.</b> The cheap screen does not hide it. The feast pretends not to hear a poor woman making a True Bone’s name — and then it cannot pretend, because she does not stop. She comes on the second scream, loud, messy, asking for the next thrust before she has finished the first.',
		ko: '소리가 나올 때도 아직 서 있다. 저고리가 가슴에서 열려 있다. 깨끗한 얼음빛 안에서 그는 이미 손님이 아니다. 병풍이 뛰도록 박는다. <b>웃음이 비명이 된다.</b> 싼 병풍이 가려 주지 않는다. 잔치는 가난한 여자가 진골 이름을 내는 것을 안 들은 척한다 — 그리고 못 한다. 멈추지 않으니까. 두 번째 비명에서 가고, 크고, 지저분하고, 이번 것이 끝나기 전에 다음 박기를 청한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'잠깐— 너무 깊어. 빼지 마. 그 안에. 다.',
			'착하지. 다 싸. 십 년 치. 내가 받을게, 이 몸이 받잖아—'
		],
		en: [
			'Wait— too deep. Don’t pull out. In me. All of it.',
			'Good boy. Spend it. Ten years’ worth. I’ll take it, this body can—'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'He does not last the courtesy of a first finish. He buries it — a stupid, young, endless amount — and keeps thrusting through it, wet now, louder, the milk already running down the inside of the ochre chima. She laughs into the scream. He has not gone soft. Twenty-four. That is the whole joke of the night.',
		ko: '첫 번의 예의를 지키지 못한다. 묻는다 — 바보같고, 젊고, 끝이 없는 양 — 그리고 그 위로 계속 박는다. 이제 젖어 있고, 더 크고, 흰 젖이 이미 황토 치마 안으로 흐른다. 비명 속에서 웃는다. 아직 안 죽었다. 스물넷. 오늘 밤의 농담이 그것이다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		html: 'He stayed. I screamed and he stayed inside. Again. He is still hard. I am going to ask. I am asking.',
		ko: '남았어. 소리쳤는데 안에 남았어. 또. 아직 서 있어. 청할 거야. 청한다.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['또— 또 나와.', '이 몸 때문에요. 이 여자 때문에. 미안. 안 미안하오.'],
		en: ['Again— it’s coming again.', 'Because of this body. Because of you. Sorry. I am not sorry.']
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'그래. 또. 우리 장군— 아니, 우리 아이가 아니지, 스물넷이잖아.',
			'허리를 그렇게 써. 내가 기다린 허리야. 알아? 알아, 알지.'
		],
		en: [
			'Yes. Again. Our general— no, not our boy, you’re twenty-four.',
			'Use that waist. The one I waited for. You know? You know. You know.'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Then she is down against the wall and he is over her, and the dirtied green is open as far as it will go without coming off. The ochre chima is a wreck at the hip. His silk is still clean. That is the insult of it. He folds her in half and drives — hard, arrhythmic, a boy who has discovered he can ruin a room with his hips. She is louder than the feast. He finishes inside her a second time before the lamp has burned an inch, and it is not a polite amount. <b>She loses the room.</b> She came to take a half of a True Bone and she is the one shaking, dripping, asking for the next one with her legs still open.',
		ko: '벽에 내려앉고 그가 위에 있다. 때 묻은 초록이, 벗지 않고 열릴 수 있는 데까지 열려 있다. 황토 치마는 허리에서 망가졌다. 그의 비단은 아직 깨끗하다. 그게 모욕이다. 반으로 접고 박는다 — 세게, 박자 없이, 허리로 방을 망가뜨릴 수 있다는 것을 방금 안 소년. 잔치보다 크다. 등잔이 한 치도 안 줄어 두 번째로 그 안에 붓고, 예의를 지키는 양이 아니다. <b>방을 잃는다.</b> 진골의 반을 가지러 온 여자가, 떨며, 흘리며, 다리가 아직 열린 채로 다음을 청한다.'
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'봐, 흘러. 다 내 거야. 미안, 자랑하는 건데.',
			'세 번째. 착하지— 그 말 또 했다. 더 줘. 이 몸이 받잖아.'
		],
		en: [
			'Look, it’s running out. It’s all mine. Sorry. I’m bragging.',
			'Third. Good boy— I said it again. Give more. This body can take it.'
		]
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipP,
		person: 'pumsuk',
		lines: ['받을 수 있소? 이 가슴— 이 허리—', '미쳐. 미쳐 버리겠소. 멈추라는 말 하지 마시오.'],
		en: [
			'You can take it? These breasts— this waist—',
			'I’m losing it. I’m gone. Don’t tell me to stop.'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: '<b>They do not stop until the lamp dies.</b> Load after load inside her — a third, a fourth, the last one leaking out as fast as he puts it in, white on the dirtied green, white on the worn pine, white on the frayed red sash. Hanbok still on — just less of it. The hall smells of sex. She is hoarse. He is shaking and still in her. For the first time in this fortress she is not the one running the room.',
		ko: '<b>등잔이 죽을 때까지 멈추지 않는다.</b> 그 안에, 한 번이 아니다 — 세 번, 네 번, 넣는 만큼 흘러나오고, 때 묻은 초록에 하얗고, 낡은 마루에 하얗고, 헐거운 붉은 끈에 하얗다. 한복은 아직 있다 — 다만 덜 있다. 전각에 그 냄새가 있다. 목이 쉬었다. 그는 떨면서 아직 그 안에 있다. 이 성에서 처음으로 방을 운영하는 쪽이 아니다.'
	},
	{
		kind: 'monologue',
		person: 'gumilwife',
		html: 'Grey silk and he is still in me. I screamed. He stayed. Again. He filled me. Mine tonight. I am going to thank him in a voice that is not court.',
		ko: '회색 등잔인데도 아직 안에 있어. 소리쳤어. 남았어. 또. 채워 줬어. 오늘 밤 내 거. 궁이 아닌 목소리로 고맙다고 할 거야.',
		nsfw: true
	},
	{
		kind: 'dialogue',
		nsfw: true,
		chip: chipM,
		person: 'gumilwife',
		lines: [
			'십 년. 이런 양, 이런 허리.',
			'또 오면… 또 해. 알았지. 착하지— 아, 그 말. 그냥. 남아 줘서.'
		],
		en: [
			'Ten years. This much. This waist.',
			'If you come again… do it again. You hear me. Good boy— ah. That. Just. For staying.'
		]
	},
	{
		kind: 'p',
		nsfw: true,
		html: 'Afterwards she is <b>on the worn pine</b>. Jeogori open. Chima a wreck. <b>White milk on the dirtied green</b> — on the boards, on the cheap sash, on her, still coming out of her when she tries to close her legs, catching the last of the lamp. She cannot sit up yet. She does not try. The feast on the other side of the screen has gone very quiet.',
		ko: '끝나고 <b>낡은 마루 위에 있다</b>. 저고리는 열려 있다. 치마는 망가졌다. <b>때 묻은 초록 위에 흰 젖</b> — 마루에, 싼 끈에, 그녀에, 다리를 모으려 해도 아직 나오고, 마지막 등잔에 잡힌다. 아직 일어나지 못한다. 하려고도 하지 않는다. 병풍 너머 잔치가 아주 조용해진다.'
	}
];

daeya.blocks.splice(start, end - start + 1, ...newBlocks);

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log(`rewrote ${end - start + 1} → ${newBlocks.length} night blocks (goddess-voice)`);
