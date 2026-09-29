import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entry = story.flatMap((ch) => ch.entries ?? []).find((e) => e.title === 'Jumong');
if (!entry) throw new Error('missing Jumong');

function enJoin(b) {
	return (b.en ?? []).join(' ');
}

function setByEn(needle, patch) {
	const i = entry.blocks.findIndex((b) => enJoin(b).includes(needle));
	if (i < 0) {
		console.warn('miss', needle);
		return;
	}
	entry.blocks[i] = { ...entry.blocks[i], ...patch };
}

function setP(needle, html, ko) {
	const i = entry.blocks.findIndex((b) => typeof b.html === 'string' && b.html.includes(needle));
	if (i < 0) {
		console.warn('miss p', needle);
		return;
	}
	entry.blocks[i] = { ...entry.blocks[i], html, ko };
}

setByEn('Send that man down the road', {
	lines: ['아버지.', '저 사람 아직 있어요.', '집 구한 얼굴로 들어왔잖아요.', '전 곡식 세요. 보지 마세요.'],
	en: ['Father.', "He's still here.", 'Walked in like he already lives here.', "I'm counting. Don't watch me."]
});

setByEn('You counted that sack twice', {
	lines: ['가마니 두 번 셌다.', '그리고 얼굴이 빨개.', '과부 된 이유, 잊었냐.'],
	en: ['You counted that sack twice.', "And you're pink.", 'Have you forgotten why you are a widow.']
});

setByEn('That is why we leave ash as ash', {
	lines: ['안 잊었어요.', '재는 재로 두라고요.', '…얼굴 보지 마세요. 셈 틀어지니까.'],
	en: ["I haven't.", 'Leave ash as ash.', "…Don't look at my face. The count goes wrong."]
});

setByEn('May I ask your name', {
	lines: ['부인.', '이름… 여쭤도 되겠소.', '줄이 걸렸소. 잡아 드릴까.'],
	en: ['Lady…', 'May I ask your name.', "Rope's stuck. Want me to—"]
});

setByEn('Or to touch my hand', {
	lines: ['소서노요.', '말 시키지 마세요.', '물만 뜨세요.', '얼굴은… 보지 마세요. 곡식 셈이 틀어지니까.'],
	en: ['Sosuno.', "Don't talk.", 'Just draw the water.', "Don't look at my face. The count goes wrong."]
});

setByEn('I only meant to draw the water', {
	lines: ['우물만 보고 있었소.', '손은— 그 정도는 아니오.', '…재미있네.'],
	en: ['I was looking at the well.', 'A hand is not— whatever you think.', "…You're funny."]
});

setByEn('Who asked you to speak', {
	lines: ['누가 말하래요.', '뜨고 가세요.', '웃지 마세요.'],
	en: ['Who asked you to speak.', 'Draw it and go.', 'And stop smiling.']
});

setP(
	'He is confused. She is rude',
	'He keeps ending up thirsty at the same hour. She keeps being there, rude, pink at the ears. On the fourth morning he stops pretending he does not know. They are both on the packed earth, at the rim — not in the well, she would never forgive him that. <b>He kisses her at the well-beam.</b>',
	'같은 시각에 목이 마르고, 같은 우물에 그녀가 있다. 독하고, 귓불이 분홍이다. 나흘째 아침에 모르는 척을 그만둔다. 둘 다 다진 흙 위, 우물 가에 있다 — 안에 들어가면 평생 안 봐준다. <b>우물 들보에서 입을 맞춘다.</b>'
);

setByEn('How dare you', {
	lines: ['당신—', '어떻게 감히.', '지금— 우물에서—'],
	en: ['You—', 'How dare you.', 'Here. At the well.']
});

setByEn("I'll leave the village. Tonight", {
	lines: ['알아. 내가 먼저였소.', '원하시면… 오늘 밤 떠나겠소.', '쉬운 쪽으로.'],
	en: ['Yeah. That was me.', "I'll leave the village. Tonight.", 'If that is easier.']
});

setP(
	'She does not say stay',
	'She does not say stay. She goes at the rope, the weather, his boots, anything that is not his name. <b>The second bucket isn’t full.</b>',
	'남으라는 말은 안 한다. 줄, 날씨, 신발, 이름만 빼고 다 말한다. <b>둘째 두레박이 안 찼다.</b>'
);

setByEn("The second bucket isn't full. Father hasn't", {
	lines: ['둘째 두레박이… 안 찼어요.', '줄 밟지 마세요.', '가라는 말은 안 했거든요.', '그냥— 두레박요.'],
	en: [
		"The second bucket isn't full.",
		"You're on the rope.",
		"I didn't say leave.",
		'I said the bucket.'
	]
});

setByEn('Then I will wait for the second bucket', {
	lines: ['그럼 기다리겠소.', '두레박.', '재밌소, 부인.', '화내지 마시오. 웃는 거요.'],
	en: ['Then I will wait for the second bucket.', 'Just the bucket.', 'This is fun, you know.', "Don't scowl. I'm smiling."]
});

setP(
	'He has been collecting her collecting',
	'He has been collecting her collecting. From the grain-porch post, a cloth: thread off his sleeve, a fletch he dropped, well-rope, a scrap of headband. He holds it up like a joke that might not be one. <b>You hide these like a thief.</b>',
	'소서노가 모아 온 것을 주몽이 모아 왔다. 곡식 누대 기둥의 보자기 — 소매 실, 떨어뜨린 깃, 우물 새끼, 머리띠 조각. 농담인 척 들어 올린다. <b>도둑처럼 숨겼구나.</b>'
);

setByEn('You hide these like a thief', {
	lines: ['내 머리띤데.', '흙 묻었소, 라고 말하려던 참이오?', '네 개요. 도둑처럼 숨겼소.'],
	en: ["That's my headband.", 'You were going to say it was dirty.', 'Four of them. You hide these like a thief.']
});

setP(
	'She blushes so hard',
	'She goes so red the dusty-rose looks pale. She snatches at the cloth and misses. <b>Those are… inventory.</b>',
	'얼굴이 너무 달아 먼지로즈가 창백해 보인다. 보자기를 뺏으려다 놓친다. <b>재고예요….</b>'
);

setByEn("Those are… inventory", {
	lines: ['재고예요.', '곡식 재고.', '쓰레기. 태울 거예요.', '얼굴 치우세요.'],
	en: ["Those are… inventory.", 'Grain inventory.', "Trash. I'll burn them.", 'Get your face off it.']
});

setP(
	'He turns his back so she will not',
	'He turns so she does not have to look at him wanting. Easy about it, which is worse. <b>I’ll leave, and save you the heartache.</b>',
	'그녀가 원하는 얼굴을 보지 않게 등을 돌린다. 너무 쉽게 돌려서 더 나쁘다. <b>떠나서, 그 마음을 아끼겠소.</b>'
);

setByEn('Then I will go', {
	lines: ['그럼 가겠소.', '숫자나 세요.', '바보 같은 말, 안 해도 되고.'],
	en: ['Then I will go.', 'You keep your numbers.', 'Nobody has to say anything stupid.']
});

setP(
	'She runs. Packed earth',
	'She runs. Packed earth. Grey giwa. Catches the red sleeve the way she did not at the well, and kisses him like she has been waiting to be caught. <b>Stay. I wanted you.</b>',
	'달린다. 다진 흙. 회색 기와. 우물에서 안 잡은 붉은 소매를 잡고, 잡히려고 기다린 것처럼 입을 맞춘다. <b>남아요. 원했어요.</b>'
);

setByEn('Stay. I wanted you. From the first count', {
	lines: ['기다려요— 바보야— 남아요.', '처음부터 원했어요. 첫날 아침부터.', '착하게 구지 마세요. 남아요.'],
	en: ['Wait— you idiot— stay.', 'I wanted you. From the first morning.', "Don't you dare be noble about it. Stay."]
});

setP(
	'Tabal has been on the porch',
	'Tabal has been on the porch the whole time, looking like a man who bit a persimmon too early. <b>I am not pleased. I am also not blind.</b>',
	'연타발은 처음부터 누대에 있었다. 감이 너무 일찍 온 얼굴. <b>안 기쁘다. 눈은 있다.</b>'
);

setByEn('Hit it and he eats. Miss and I hurry the road', {
	lines: ['…소나무다.', '백 보. 지금.', '맞히면 밥. 빗나가면 내가 직접 내보낸다.', '안 기쁘다. 눈은 있다. 이 누대에 눈 없는 사람 없으니까.'],
	en: [
		'…The pine.',
		'A hundred paces. Now.',
		'Hit it, he eats. Miss, I throw him out myself.',
		"I am not pleased. I am also not blind. Nobody on this porch is."
	]
});

setByEn('I already said. The pine', {
	lines: ['말했잖소. 소나무.', '백 보.', '다들 보게. 숨어서 볼 생각 말고.'],
	en: ['I already said. The pine.', 'A hundred paces.', 'Everybody watches. No peeking from the rail.']
});

setByEn('Ash does not look like this', {
	lines: ['…재는 이렇게 안 생겼소.', '봐. 아직 웃고 있잖소.'],
	en: ['…Ash does not look like this.', "See? I'm still smiling."]
});

setByEn('That was… the bow is the bow', {
	lines: ['활은 활이고요.', '그렇게 보지 마세요.', '전 그냥— 셈이 틀린 거예요.', '웃지 마요.'],
	en: ['The bow is the bow.', "Don't look at me like that.", 'I only— lost the count.', 'Stop smiling.']
});

setByEn('Instead my daughter ran after the river', {
	lines: [
		'…하.',
		'강물이 데려가는 줄 알았더니 딸이 쫓아가네.',
		'소서노. 네 입으로 골랐으면 네가 지켜. 축하하는 거 아니다.',
		'주몽. 내 딸 재로 만들면 활로도 못 막아.',
		'먹어. 남아. 이 대청에서 우리처럼 투덜거려.'
	],
	en: [
		'…Ha.',
		'I thought the river would take him. Instead my daughter ran after it.',
		"Sosuno. You chose him with your mouth. You keep him. I'm not throwing a feast.",
		'Jumong. Ash of my daughter and no bow will stop me.',
		'Eat. Stay. Grumble in my hall like the rest of us.'
	]
});

setByEn('Your throat… is brighter than the lamp', {
	lines: ['부인.', '장부 덮으시오.', '숫자 안 보이오.', '목 때문에. 촛불보다 밝아서.'],
	en: ['Wife.', 'Close the ledger.', "I can't see the numbers.", 'Your throat. Brighter than the lamp. Sorry.']
});

setByEn('I am not your wife yet', {
	lines: ['아직 아내 아닌데요.', '그렇게 부르지 마요. 손 떨리잖아요.', '세는 손이 필요해요, 아니면 나예요.', '답 알고 묻지 마요.'],
	en: [
		'I am not your wife yet.',
		"Don't call me that. My hands shake.",
		'Do you need the counting hand, or me.',
		"Don't ask if you know."
	]
});

const stay = entry.blocks.findIndex((b) => enJoin(b).includes("Don't you dare be noble about it"));
const tabalPine = entry.blocks.findIndex((b) => enJoin(b).includes('A hundred paces. Now.'));
if (stay >= 0 && tabalPine > stay && !entry.blocks.some((b) => enJoin(b).includes("Don't smirk"))) {
	entry.blocks.splice(stay + 1, 0, {
		kind: 'dialogue',
		chip: '#e8563f',
		person: 'jumong',
		lines: ['알겠어, 알겠어.', '안 가요.', '웃지 말라고 하기 전에— 벌써 웃고 있소.'],
		en: ["Alright, alright.", "I'm not going.", "Before you say don't smirk — too late."]
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('rewrote jumong/sosuno talk');
