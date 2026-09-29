import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const entry = story
	.flatMap((ch) => ch.entries ?? [])
	.find((e) => e.title === 'Jumong');
if (!entry) throw new Error('missing Jumong');

function enJoin(b) {
	return (b.en ?? []).join(' ');
}

const wellRefs = ['/ch_jumong.png', '/ch_sosuno.png', '/bn_sosuno.png'];
const tabalRefs = ['/ch_yeon_tabal.png', '/ch_jumong.png', '/ch_sosuno.png'];
const grounded =
	'Grounded Jolbon movie 16:9. SAME place as the well-yard: stone well-circle, timber well-house, grey giwa, packed earth, timber hall. HIGH CONTRAST chiaroscuro, not even daylight postcard. FACE AND GARMENTS from attached: Jumong red #e8563f silk and red headband; Sosuno dusty-rose hanbok (NOT gold), bird binyeo from attached. New dramatic bodies, not portrait clones. Painterly anime-adjacent cinema. No army. No readable text. No watermark.';

function slot(o) {
	return {
		ratio: 1.778,
		nsfw: false,
		tone: '#e8a04a',
		people: ['jumong', 'sosuno'],
		refs: wellRefs,
		...o
	};
}

const extras = [
	slot({
		id: 'jumong-seq-well-kiss',
		at: 'He kisses her at the well-beam',
		alt: 'Well two-shot: Jumong kissing Sosuno over the stone circle; dusty-rose and red silk',
		prompt: `${grounded} CINEMATOGRAPHY: dutch two-shot, shallow DOF. ONE device: the well-circle as a stamp. Jumong mid-lean kissing her; she not pulling away yet. Wanting heat under a tsundere freeze.`
	}),
	slot({
		id: 'sosuno-seq-how-dare',
		at: 'How dare you.',
		alt: 'ECU: Sosuno shocked-angry at the well, heavy blush, dusty-rose silk',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt: `${grounded} CINEMATOGRAPHY: ECU, dutch, rack-focus. ONE device: the well-rope as a dark vertical. Sosuno “how dare you” — shocked mouth, ears red, tsundere. FACE from attached.`
	}),
	slot({
		id: 'jumong-seq-leave-bow',
		at: 'I’ll leave the village. Tonight.',
		alt: 'Worm’s-eye: Jumong with bow, turning from the well; Sosuno a dusty-rose sliver',
		prompt: `${grounded} CINEMATOGRAPHY: worm’s-eye, Jumong mid-turn, bow on the back. ONE device: his red #e8563f back as a plane. He admits fault. Sosuno small behind him.`
	}),
	slot({
		id: 'sosuno-seq-stay-awkward',
		at: 'The second bucket isn’t full',
		alt: 'OTS: Sosuno blocking the packed-earth path with a bucket, not meeting his eyes',
		prompt: `${grounded} CINEMATOGRAPHY: over-shoulder, dutch. ONE device: the wooden bucket as a round stamp in the lower third. Sosuno awkwardly in his way, looking at the dirt, blushing. Jumong amused, red silk.`
	}),
	slot({
		id: 'jumong-seq-stash',
		at: 'You hide these like a thief',
		alt: 'ECU: Jumong’s hands opening a cloth stash — red thread, fletch, rope-fiber — Sosuno’s blush in bokeh',
		prompt: `${grounded} CINEMATOGRAPHY: ECU still-life, shallow DOF. ONE device: an open cloth square. Red thread, a fletch, well-rope fiber — no readable labels. Jumong’s red sleeve. Sosuno’s dusty-rose and hard blush in the bokeh.`
	}),
	slot({
		id: 'sosuno-seq-stash-blush',
		at: 'Those are… inventory',
		alt: 'ECU: Sosuno blushing so hard the dusty-rose looks pale; hands at her mouth',
		people: ['sosuno'],
		refs: ['/ch_sosuno.png', '/bn_sosuno.png'],
		prompt: `${grounded} CINEMATOGRAPHY: ECU, shallow DOF, chiaroscuro. ONE device: her hands as a bar over the mouth. Heavy blush, ears red, heart-flush, tsundere caught. FACE from attached. Dusty-rose #e8a04a rim only.`
	}),
	slot({
		id: 'jumong-seq-turn-leave',
		at: 'save you the heartache',
		alt: 'From behind: Jumong walking away down the packed-earth yard, red plane; Sosuno starting to run',
		prompt: `${grounded} CINEMATOGRAPHY: over-shoulder from Sosuno, dutch. ONE device: Jumong’s red back as a receding plane toward the grey-giwa gate. She has begun to run. High contrast long shadows.`
	}),
	slot({
		id: 'sosuno-seq-run-kiss',
		at: 'Stay. I wanted you.',
		alt: 'Dutch: Sosuno catching Jumong’s sleeve and kissing him in the Jolbon yard',
		prompt: `${grounded} CINEMATOGRAPHY: dutch, mid-stride catch, motion in the dusty-rose sleeve. ONE device: the caught red sleeve as a hard diagonal. She kisses him. Wanting face, not polite. Packed earth, grey giwa behind.`
	}),
	slot({
		id: 'tabal-seq-grumpy',
		at: 'I am not pleased. I am also not blind.',
		alt: 'Porch OTS: Tabal in tiger-pelt, arms folded, watching the yard; reluctant',
		tone: '#a97c4a',
		people: ['yeontabal', 'jumong', 'sosuno'],
		refs: tabalRefs,
		prompt: `${grounded} CINEMATOGRAPHY: over-shoulder from the timber porch, looking down into the yard. ONE device: the porch-beam as a dark bar. Tabal in tiger-pelt from attached, arms folded, grumpy. Tiny red and dusty-rose pair in the yard below. FACE from attached. Not a standing clone.`
	})
];

const have = new Set((entry.images ?? []).map((im) => im.id));
const fresh = extras.filter((s) => !have.has(s.id));
const after = entry.images.findIndex((im) => im.id === 'jumong-seq-well-tsun');
if (after < 0) throw new Error('missing jumong-seq-well-tsun');
entry.images.splice(after + 1, 0, ...fresh);

const b = entry.blocks;

const iRiver = b.findIndex((x) => x.person === 'sosuno' && enJoin(x).includes('his eyes are like the river'));
if (iRiver >= 0) {
	b[iRiver] = {
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: [
			'아버지.',
			'저 사내… 길을 재촉하세요.',
			'대청을 제 집인 양 봐요.',
			'전… 곡식이나 세요. 보지 마세요.'
		],
		en: [
			'Father.',
			'Send that man down the road.',
			'He looks at the hall as if he already lives here.',
			'I am… counting. Don’t watch me.'
		]
	};
}

const iWidow = b.findIndex((x) => x.person === 'yeontabal' && enJoin(x).includes('Have you forgotten why you are a widow'));
if (iWidow >= 0) {
	b[iWidow] = {
		kind: 'dialogue',
		chip: '#a97c4a',
		person: 'yeontabal',
		lines: [
			'가마니를 두 번 셌구나.',
			'과부가 된 이유를 잊었느냐.',
			'강물은 사람을 데려가기도 하오.'
		],
		en: [
			'You counted that sack twice.',
			'Have you forgotten why you are a widow.',
			'Rivers also take people away.'
		]
	};
}

const iSee = b.findIndex((x) => x.person === 'sosuno' && enJoin(x).includes('That is why… I see more clearly'));
if (iSee >= 0) {
	b[iSee] = {
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: [
			'잊은 적 없습니다.',
			'그래서 재는 재로 두자는 거예요.',
			'…얼굴은 보지 마세요. 셈이 틀어지니까.'
		],
		en: [
			'I have never forgotten.',
			'That is why we leave ash as ash.',
			'…Don’t look at my face. The count goes wrong.'
		]
	};
}

const iBoth = b.findIndex((x) => x.person === 'jumong' && enJoin(x).includes('I want both.'));
const iFire = b.findIndex((x) => x.person === 'sosuno' && enJoin(x).includes('Then show him fire.'));
if (iBoth >= 0 && iFire >= 0 && !b.some((x) => enJoin(x).includes('How dare you.'))) {
	const insert = [
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['물만 뜨려 했소.', '손이… 그 정도는 아니오.'],
			en: ['I only meant to draw the water.', 'A hand is not… whatever you think.']
		},
		{
			kind: 'dialogue',
			chip: '#e8a04a',
			person: 'sosuno',
			lines: ['누가 말하라 했나요.', '뜨고 가세요.'],
			en: ['Who asked you to speak.', 'Draw it and go.']
		},
		{
			kind: 'p',
			html: 'He is confused. She is rude. She is also always at the well when he is thirsty. Days of this. Then he understands the heat under the insult. <b>He kisses her at the well-beam.</b>',
			ko: '주몽은 헷갈린다. 소서노는 독하다. 그런데도 그가 목마를 때마다 우물에 있다. 며칠이 그렇게 간다. 그제야 욕설 밑의 열을 안다. <b>우물 들보에서 입을 맞춘다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8a04a',
			person: 'sosuno',
			lines: ['…어떻게 감히.'],
			en: ['How dare you.']
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['내가 잘못했소.', '마을을 떠나겠소. 오늘 밤.'],
			en: ['I was wrong.', 'I’ll leave the village. Tonight.']
		},
		{
			kind: 'p',
			html: 'She does not say stay. She says everything except stay. <b>The second bucket isn’t full.</b>',
			ko: '남으라는 말은 안 한다. 남는 말만 한다. <b>둘째 두레박이 안 찼다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8a04a',
			person: 'sosuno',
			lines: [
				'둘째 두레박이… 안 찼어요.',
				'아버지가… 곡식은…',
				'비도… 길은…',
				'가라는 말은… 안 했는데요.'
			],
			en: [
				'The second bucket isn’t full.',
				'Father hasn’t… the grain…',
				'The rain… the road…',
				'I didn’t say leave.'
			]
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['그럼 둘째 두레박을 기다리겠소.', '재미있군. 부인.'],
			en: ['Then I will wait for the second bucket.', 'This is fun, lady.']
		},
		{
			kind: 'p',
			html: 'He has been collecting her collecting. From the grain-porch post he takes a cloth: a red thread from his sleeve, a fletch he dropped, a fiber of well-rope, a scrap of headband. <b>You hide these like a thief.</b>',
			ko: '소서노가 모아 온 것을 주몽이 모아 왔다. 곡식 누대 기둥에서 보자기 하나 — 소매의 붉은 실, 떨어뜨린 깃, 우물 새끼, 머리띠 조각. <b>도둑처럼 숨겼구나.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['이걸 나한테서 숨겼소.', '만남마다 훔친 것들이오.'],
			en: ['You hide these like a thief. From me.', 'Taken from every time we met.']
		},
		{
			kind: 'p',
			html: 'She blushes so hard the dusty-rose looks pale. <b>Those are… inventory.</b>',
			ko: '얼굴이 너무 달아 먼지로즈가 창백해 보인다. <b>재고예요….</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8a04a',
			person: 'sosuno',
			lines: ['그건… 재고예요.', '쓰레기.', '태울 거예요.'],
			en: ['Those are… inventory.', 'Waste.', 'I’ll burn them.']
		},
		{
			kind: 'p',
			html: 'He turns his back so she will not have to look at him wanting. <b>I’ll leave, and save you the heartache.</b>',
			ko: '그녀가 원하는 얼굴을 보지 않게, 등을 돌린다. <b>떠나서, 그 마음을 아끼겠소.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8563f',
			person: 'jumong',
			lines: ['그럼 가겠소.', '이름도 못 붙이는 사내를 원하는 마음… 아껴 드리리다.'],
			en: ['Then I will go.', 'And save you the heartache of wanting a man you will not name.']
		},
		{
			kind: 'p',
			html: 'She runs. Packed earth. Grey giwa. She catches the red sleeve and kisses him the way she pretended not to at the well. <b>Stay. I wanted you.</b>',
			ko: '달린다. 다진 흙. 회색 기와. 붉은 소매를 붙잡고, 우물에서 안 한 척한 입을 이제 한다. <b>남아요. 원했어요.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#e8a04a',
			person: 'sosuno',
			lines: ['남아요.', '처음부터 원했어요.', '구해주지 마세요. 셈이 틀린 채로요.'],
			en: ['Stay.', 'I wanted you. From the first count.', 'Don’t you dare save me. Leave the count wrong.']
		},
		{
			kind: 'p',
			html: 'Tabal has been on the porch the whole time. He looks like a man who has swallowed a sour persimmon. <b>I am not pleased. I am also not blind.</b>',
			ko: '연타발은 처음부터 누대에 있었다. 신 감을 삼킨 얼굴이다. <b>안 기쁘다. 눈은 있다.</b>'
		},
		{
			kind: 'dialogue',
			chip: '#a97c4a',
			person: 'yeontabal',
			lines: [
				'…소나무다.',
				'백 보.',
				'맞히면 밥이다. 빗나가면 길을 재촉한다.',
				'안 기쁘다. 눈은 있다.'
			],
			en: [
				'…The pine.',
				'A hundred paces.',
				'Hit it and he eats. Miss and I hurry the road.',
				'I am not pleased. I am also not blind.'
			]
		}
	];
	b.splice(iBoth, iFire - iBoth + 1, ...insert);
}

const iLost = b.findIndex((x) => x.person === 'sosuno' && enJoin(x).includes('Father, you have already lost.'));
if (iLost >= 0) {
	b[iLost] = {
		kind: 'dialogue',
		chip: '#e8a04a',
		person: 'sosuno',
		lines: ['그건… 활은 활이고요.', '그렇게 보지 마세요.', '전… 그냥 셈이 틀린 거예요.'],
		en: ['That was… the bow is the bow.', 'Don’t look at me like that.', 'I… only lost the count.']
	};
}

const iHa = b.findIndex((x) => x.person === 'yeontabal' && enJoin(x).includes('I thought the river would take him away.'));
if (iHa >= 0) {
	b[iHa] = {
		kind: 'dialogue',
		chip: '#a97c4a',
		person: 'yeontabal',
		lines: [
			'…하.',
			'강물이 데려가는 줄 알았더니,',
			'딸이 강을 쫓아가는구나.',
			'소서노. 입이 골랐으면… 손으로 지켜라. 축하하는 건 아니다.',
			'주몽. 내 딸을 재로 만들면 — 그때는 활로도 못 막소.',
			'먹어라. 남아라. 우리처럼 이 대청에서 투덜거려라.'
		],
		en: [
			'…Ha.',
			'I thought the river would take him away.',
			'Instead my daughter ran after the river.',
			'Sosuno. If your mouth chose him… your hands keep him. I am not celebrating.',
			'Jumong. If you make ash of my daughter — no bow will stop me.',
			'Eat. Stay. Grumble in my hall like the rest of us.'
		]
	};
}

const iContest = b.findIndex(
	(x) => typeof x.html === 'string' && x.html.includes('Tabal sets a contest the way merchants set scales')
);
if (iContest >= 0) {
	b[iContest] = {
		kind: 'p',
		html: 'He had already named the pine from the porch. Now he makes them do it in front of the hall — publicly, so no one can claim the weight was wrong. Three flights. His best men first. Then himself. Then the exile, if the exile still has the nerve after being kissed in the yard.',
		ko: '소나무는 이미 누대에서 짚었다. 이제 대청 앞에서 시킨다 — 공개적으로, 무게가 틀렸다고 말할 수 없게. 세 순. 먼저 제 장수들. 그다음 자신. 그다음 망명객, 마당에서 입 맞춘 뒤에도 배가 남아 있다면.'
	};
}

const iMark = b.findIndex((x) => x.person === 'yeontabal' && enJoin(x).includes('The mark is that pine.'));
if (iMark >= 0) {
	b[iMark] = {
		kind: 'dialogue',
		chip: '#a97c4a',
		person: 'yeontabal',
		lines: ['말했잖소. 소나무.', '백 보.', '이번에는 다들 보게.'],
		en: ['I already said. The pine.', 'A hundred paces.', 'This time everyone watches.']
	};
}

const porch = b.find((x) => typeof x.html === 'string' && x.html.includes('She prices him, then forgets the count'));
if (porch && !porch.html.includes('hostile')) {
	porch.html =
		'His daughter <b>Sosuno</b> is already watching from the grain porch — a widow with two sons and a gaze that has priced every man who entered that hall. This one she prices as danger, out loud. Under the counting-voice she is already too warm. <b>She prices him, then forgets the count.</b>';
	porch.ko =
		'딸 <b>소서노</b>는 이미 곡식 누대에서 보고 있다 — 아들 둘을 둔 과부, 그 대청에 들어온 사내마다 값을 매겨 온 눈. 이번엔 위험으로 값을 매긴다, 소리 내어. 세는 목소리 아래는 이미 덥다. <b>값을 매기다가 세던 것을 잊는다.</b>';
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('inserted stills', fresh.map((s) => s.id).join(', ') || '(none)');
console.log('blocks', iRiver, iBoth, iFire, iLost, iHa);
