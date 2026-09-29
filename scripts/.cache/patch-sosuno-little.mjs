import { readFileSync, writeFileSync } from 'node:fs';

const path = 'src/lib/data/story.json';
const story = JSON.parse(readFileSync(path, 'utf8'));
const jumong = story.flatMap((c) => c.entries).find((e) => e.title === 'Jumong');
if (!jumong) throw new Error('Jumong missing');

const p = (html, ko, nsfw) => ({ kind: 'p', html, ko, ...(nsfw ? { nsfw: true } : {}) });
const d = (person, chip, en, lines, nsfw) => ({
	kind: 'dialogue',
	person,
	chip,
	en,
	lines,
	...(nsfw ? { nsfw: true } : {})
});
const scene = (label, ko) => ({ kind: 'scene', label, ko });

const J = '#e8563f';
const S = '#e8a04a';
const T = '#a97c4a';
const C = '#8d8d95';

function findHtml(sub) {
	const i = jumong.blocks.findIndex((b) => b.html?.includes(sub));
	if (i < 0) throw new Error(`html missing: ${sub}`);
	return i;
}
function findScene(label) {
	const i = jumong.blocks.findIndex((b) => b.kind === 'scene' && b.label === label);
	if (i < 0) throw new Error(`scene missing: ${label}`);
	return i;
}

// — lock leftover ats in existing mouths —
for (const b of jumong.blocks) {
	if (b.kind !== 'dialogue' || !b.en) continue;
	if (b.person === 'sosuno' && b.en[0] === 'Not your wife yet.') {
		b.en[0] = 'I am not your wife yet.';
		b.lines[0] = '아직 아내 아니거든.';
	}
	if (b.person === 'jumong' && b.en.includes('Mouth first.')) {
		b.en = b.en.map((x) => (x === 'Mouth first.' ? 'Give me your mouth… first.' : x));
		b.lines = b.lines.map((x) => (x === '입 먼저.' ? '입… 먼저 줘.' : x));
	}
}

// — upstairs after the yard blush, before The Well —
const iBlush = findHtml('He wrings the sleeve on the way to the shed');
const iWell = findScene('The Well');
if (iWell !== iBlush + 1) {
	console.warn('well not immediately after blush', iBlush, iWell);
}

const upstairs = [
	scene('Upstairs', '윗방'),
	p(
		'She does not stay in the yard. Chin still up, she takes the loft stairs two at a time like a woman with grain to count. The window faces the millet. He is already out there, shirt off, red silk knotted at the hip, Haemosu’s shoulders doing work that is not princely. <b>She ogles him from the loft.</b>',
		'마당에 안 남는다. 턱은 아직 올라가 있고, 곡식 세는 여자처럼 다락 계단을 두 칸씩 오른다. 창이 조밭을 본다. 그는 이미 나가 있다. 저고리 벗고, 붉은 비단을 허리에 묶고, 해모수 어깨로 왕자 일 아닌 일을 한다. <b>다락에서 그를 빤다.</b>',
		true
	),
	p(
		'Dusty-rose hiked. One hand over her mouth. The other talking to the part of her that does not do girl-boss. She has a name for it. She has had a name for it since she was old enough to be ashamed. <b>Little Sosuno.</b>',
		'회분홍이 걷힌다. 한 손은 입. 다른 손은, 맏딸 노릇을 안 하는 쪽에 말을 건다. 이름이 있다. 부끄러워할 나이부터 있었다. <b>작은 소서노.</b>',
		true
	),
	d(
		'sosuno',
		S,
		[
			'Look at that. Little Sosuno. Look.',
			'That’s a demigod. That’s— Haemosu’s kid. Of course the chest is like that.',
			'You want it. Don’t lie. You’re soaked. Listen to you.',
			'Shame. Shame. Do it anyway— ah—'
		],
		[
			'봐. 작은 소서노야. 봐봐.',
			'저거 반신이야. 해모수 아들이야. 가슴이 저렇게 생긴 게 당연하지.',
			'원하지. 거짓말하지 마. 젖었잖아. 네 소리 들려.',
			'창피해. 창피해. 그래도 해— 아—'
		],
		true
	),
	d(
		'sosuno',
		S,
		[
			'If he put that in you you’d scream. You would. Don’t shake your head.',
			'Those girls at the ditch can look. They don’t get this. This is— mine— mine—',
			'Little Sosuno— tighter— he’s not even here and you’re—'
		],
		[
			'저거 넣으면 소리 지르겠지. 지르잖아. 고개 젓지 마.',
			'도랑 쪽 계집들은 보기만 해. 이건 못 가져. 이건— 내 거야— 내 거—',
			'작은 소서노— 더 조여— 오지도 않았는데 네가—'
		],
		true
	),
	d(
		'yeontabal',
		T,
		['Sosuno!', 'West count. Now.', 'Don’t make me climb.'],
		['소서노!', '서쪽 셈. 지금.', '내가 올라가게 하지 마.']
	),
	p(
		'She freezes mid-breath. Dusty-rose yanked down. Hands wiped on the inside of the sleeve like they were doing accounts. The loft door, then the stairs, then the chin. By the time she hits the packed earth she is the chieftain’s eldest again — bored, exact, nobody’s fool. <b>She comes down a different woman.</b>',
		'숨이 중간에 멈춘다. 회분홍을 내린다. 장부 만진 손처럼 소매 안쪽에 닦는다. 다락 문, 계단, 턱. 다진 흙에 내려설 때면 다시 족장의 맏딸이다 — 심심하고, 정확하고, 바보 취급할 계집이 아니다. <b>다른 여자로 내려온다.</b>'
	),
	d('sosuno', S, ['West is short two.', 'I counted. Twice.', 'Don’t send the exile. He’ll get lost.'], [
		'서쪽 둘 모자라요.',
		'셌어요. 두 번이요.',
		'망명객 보내지 마세요. 길 잃어요.'
	]),
	d('yeontabal', T, ['He hit the boar.', 'You just don’t like his back.'], ['멧돼지는 맞혔다.', '등짝이 싫은 거지.']),
	d('sosuno', S, ['I don’t like his anything.', 'Can we do the millet.'], ['아무거나 싫어요.', '조나 세요.'])
];

if (jumong.blocks[iWell].label !== 'The Well') throw new Error('well drift');
jumong.blocks.splice(iWell, 0, ...upstairs);

// — expand grain-room sex: visceral + little Sosuno + aftercare melt —
const iSexP = jumong.blocks.findIndex((b) => b.html?.includes('since the first time'));
const iSpent = jumong.blocks.findIndex((b) => b.html?.includes('He spends in her against the grain sacks'));
if (iSexP < 0 || iSpent < 0) throw new Error(`sex markers ${iSexP} ${iSpent}`);

const sex = [
	p(
		'Dusty-rose hiked, her back to him against the sacks. She pulls him in by the collar and tells him she hates him in the same breath. Then she feels the weight of him — demigod, Haemosu’s joke — and the hate gets specific. Love and spite in one grip. <b>since the first time</b>',
		'회분홍이 걷히고, 가마니에 등을 댄다. 깃을 잡고 끌어당기면서 미워한다고 한다. 그다음 무게를 느낀다 — 반신, 해모수의 장난 — 미움이 구체가 된다. 사랑과 미움이 한 손에. <b>처음 본 그날부터</b>',
		true
	),
	d('jumong', J, ['Hate me then.', 'Harder.', 'God you’re— look at you.'], ['그럼 미워해.', '더.', '진짜— 너 봐봐.'], true),
	d(
		'sosuno',
		S,
		[
			'I hate you— you’re huge— that’s not fair—',
			'Listen. Listen to that. Wet. That’s me. That’s little Sosuno, she—',
			'Don’t you dare stop— she’s trying to eat you—'
		],
		[
			'미워— 커— 반칙이야—',
			'들어. 그 소리. 젖은 거. 나야. 작은 소서노가—',
			'멈추지 마— 널 먹으려고 하잖아—'
		],
		true
	),
	d(
		'jumong',
		J,
		['Little— what?', 'Okay. Okay she’s cute.', 'I’ve got you.'],
		['작은— 뭐?', '알겠어. 귀엽네.', '잡고 있어.'],
		true
	),
	d(
		'sosuno',
		S,
		[
			'Don’t name her don’t— ah— she can hear you—',
			'Deeper. The sound when you— that slap— I want that—',
			'Those ditch girls would die. They don’t get this. Mine. Size like that is mine—'
		],
		[
			'이름 부르지 마— 아— 듣거든—',
			'더 깊이. 그 소리— 그 철썩— 그거 원해—',
			'도랑 계집들 죽겠지. 이건 못 가져. 내 거. 저런 크기는 내 거—'
		],
		true
	),
	d('jumong', J, ['You’re so sexy like this.', 'Beautiful. Even mad. Especially mad.'], ['이렇게 섹시해.', '예쁘다. 화내도. 화낼수록.'], true),
	d(
		'sosuno',
		S,
		[
			'Shut up shut up I hate you—',
			'Give me— all of it— don’t you dare pull out—',
			'AHH— DON’T STOP—',
			'DUMB BIG IDIOT—'
		],
		['닥쳐 닥쳐 미워—', '다 줘— 빼지 마—', '아아— 멈추지 마—', '이 멍청한 큰 바보야—'],
		true
	),
	d('jumong', J, ['That’s it—', 'I’ve got you.', 'Take it—'], ['그래—', '잡고 있어.', '받아—'], true)
];

jumong.blocks.splice(iSexP, iSpent - iSexP, ...sex);

// aftercare: find spent p and the door-blush, insert reassurance melt after spent
const iSpent2 = jumong.blocks.findIndex((b) => b.html?.includes('He spends in her against the grain sacks'));
const iDoor = jumong.blocks.findIndex((b) => b.html?.includes('The door shuts'));
if (iSpent2 < 0 || iDoor < 0) throw new Error(`after ${iSpent2} ${iDoor}`);

const after = [
	p(
		'He spends in her against the grain sacks. She bites his shoulder so she does not have to hear herself. Messy. Dusty-rose ruined at the hip. Love-hate, spent. Then the loft-voice is still in the room and she hears it.',
		'곡식 가마니에 대고 싼다. 제 목소리가 듣기 싫어서 그의 어깨를 문다. 지저분하다. 회분홍은 허리에서 망가졌다. 사랑이고 미움이고, 다 씀. 그런데 다락 목소리가 아직 방에 있어서 들린다.',
		true
	),
	d(
		'sosuno',
		S,
		['I didn’t— you didn’t hear that.', 'Little— I don’t have a—', 'Forget it. Get out.'],
		['그런 말— 안 했어. 못 들었잖아.', '작은— 그런 거 없어—', '잊어. 나가.'],
		true
	),
	d(
		'jumong',
		J,
		['I heard.', 'She’s cute.', 'You’re cute. Both of you. I’m keeping you.'],
		['들었어.', '귀엽더라.', '너도 귀여워. 둘 다. 둘 다 둘게.'],
		true
	),
	d(
		'sosuno',
		S,
		['Don’t— don’t be nice.', 'I’ll get stupid.', 'I am not— melting. I’m a chieftain’s daughter. I’m not— shy.', '…Stay. Not because you asked.'],
		['착하게 굴 생각하지 마.', '바보 돼.', '녹는 거 아니거든. 족장 딸이야. 수줍은 거 아니거든.', '…남아. 네가 청해서가 아니야.']
	),
	d('jumong', J, ['Hey.', 'You’re beautiful.', 'Water. You want?'], ['야.', '예쁘다.', '물. 줄까.']),
	d('sosuno', S, ['Get— no. Door. Close it if you go.', 'Don’t look at my back.'], ['나가— 아니. 문. 가면 닫아.', '등 보지 마.']),
	p(
		'He goes for water. The door shuts. She lasts three breaths. Then she slides down the sacks with both palms over her mouth, scarlet, furious at a word he already left in the room. Beautiful. Little Sosuno. She mouths idiot at the timber until it is safe to stand.',
		'물을 뜨러 간다. 문이 닫힌다. 숨 세 번. 그다음 가마니를 타고 주저앉아 두 손으로 입을 막는다. 새빨개지고, 방에 두고 간 그 단어들이 밉다. 예쁘다. 작은 소서노. 일어서도 될 때까지 들보를 향해 바보라고 입만 움직인다.'
	)
];

jumong.blocks.splice(iSpent2, iDoor - iSpent2 + 1, ...after);

// — mate-guard: after pine/marriage ledger, before Five Tribes —
const iFive = findScene('Five Tribes');
const iLedger = jumong.blocks.findIndex((b) => b.html?.includes('The ledger stays open longer than it needs to'));
if (iLedger < 0) throw new Error('ledger p missing');

const guard = [
	scene('Other Daughters', '다른 딸들'),
	p(
		'Word gets out that the exile hits what he aims at and looks like a sun when he works shirtless. Jolbon women find reasons to fetch water when he is in the yard. Other chieftains find reasons to mention daughters. Sosuno is suddenly everywhere those reasons are. <b>She finds a flaw every time.</b>',
		'망명객이 겨눈 걸 맞히고, 저고리 벗으면 해처럼 보인다는 소문이 난다. 졸본 여자들이 그가 마당에 있을 때 물을 뜨러 온다. 다른 족장들이 딸 이야기를 꺼낸다. 소서노는 그 이유들이 있는 곳에 갑자기 있다. <b>매번 흠을 찾는다.</b>'
	),
	d(
		undefined,
		C,
		['My girl can count.', 'Strong arms. Good hall.'],
		['우리 애도 셈해.', '팔 좋아. 대청에 어울려.']
	),
	d(
		'sosuno',
		S,
		['He walks into buckets.', 'Can’t wring a sleeve. Talks to millet.', 'You’d be bored in a week. Big idiot. Next.'],
		['두레박에 빠져요.', '소매도 못 짜요. 조한테 말 걸어요.', '일주일이면 질려요. 큰 바보예요. 다음.']
	),
	p(
		'At the well three girls laugh too long at something he did not say. Sosuno arrives with an empty bucket she does not need. Chin up. Eldest. The laugh dies.',
		'우물에서 계집 셋이, 그가 안 한 말에 너무 오래 웃는다. 소서노가 필요 없는 빈 두레박을 들고 온다. 턱. 맏딸. 웃음이 죽는다.'
	),
	d('sosuno', S, ['This well’s ours.', 'Ditch is that way.', 'He doesn’t need help. He needs to work.'], [
		'이 우물 우리 거야.',
		'도랑은 그쪽이고.',
		'도움 필요 없어. 일이나 해.'
	]),
	d('jumong', J, ['I was just—'], ['난 그냥—']),
	d('sosuno', S, ['You. Shed.', 'Don’t smile at them.', 'Don’t smile at me either.'], ['너는. 헛간.', '그애들한테 웃지 마.', '나한테도 웃지 마.']),
	p(
		'He goes. She stands until the girls are gone. Then the ears go pink and she hates that they do. Little Sosuno has opinions about the girls. She tells her to shut up all the way back to the porch.',
		'그는 간다. 계집들이 사라질 때까지 선다. 그제야 귓불이 분홍이고, 그런 자신이 싫다. 작은 소서노가 그애들에 대해 할 말이 있다. 누대까지 닥치라고 한다.'
	)
];

// speaker-less dialogue needs speaker field for cinema - use a chieftain
guard[2] = {
	kind: 'dialogue',
	speaker: 'A chieftain',
	chip: C,
	en: ['My girl can count.', 'Strong arms. Good hall.'],
	lines: ['우리 애도 셈해.', '팔 좋아. 대청에 어울려.']
};

jumong.blocks.splice(iFive, 0, ...guard);

// — slots —
function upsert(slot) {
	const i = jumong.images.findIndex((im) => im.id === slot.id);
	const row = {
		id: slot.id,
		ratio: 1.778,
		tone: slot.tone ?? '#e8a04a',
		nsfw: !!slot.nsfw,
		at: slot.at,
		alt: slot.alt,
		refs: slot.refs,
		people: slot.people,
		prompt: slot.prompt
	};
	if (i >= 0) jumong.images[i] = { ...jumong.images[i], ...row };
	else jumong.images.push(row);
}

const chJ = '/ch_jumong.png';
const chS = '/ch_sosuno.png';
const bnS = '/bn_sosuno.png';

const imagine = jumong.images.find((im) => im.id === 'nsfw-sosuno-imagine');
if (imagine) {
	imagine.at = 'Little Sosuno.';
	imagine.alt = 'Loft window: Sosuno flushed, dusty-rose hiked, looking down at a shirtless red figure in millet';
}

upsert({
	id: 'nsfw-sosuno-loft-ogle',
	nsfw: true,
	at: 'She ogles him from the loft',
	alt: 'OTS loft window: Sosuno biting her lip, Jumong shirtless tiny in the millet',
	people: ['sosuno', 'jumong'],
	refs: [chS, bnS, chJ],
	prompt: 'Intimate 16:9. OTS from a timber loft window. Sosuno bitten lip, heavy blush, FACE from ch_sosuno, binyeo, dusty-rose. Jumong a small shirtless red figure in millet bokeh. ONE device: the window frame. Cel-painterly. No text.'
});
upsert({
	id: 'nsfw-sosuno-little',
	nsfw: true,
	at: 'Little Sosuno.',
	alt: 'ECU: Sosuno talking to herself, wrecked blush, dusty-rose off a shoulder, loft timber',
	people: ['sosuno'],
	refs: [chS, bnS],
	prompt: 'Intimate 16:9 ECU. Sosuno flushed, talking under her breath, FACE from ch_sosuno, binyeo, dusty-rose off one shoulder, loft timber bokeh. Manhwa blush. ONE device: her open mouth. No text.'
});
upsert({
	id: 'sosuno-seq-come-down',
	at: 'She comes down a different woman',
	alt: 'Low dutch: Sosuno chin-up on the stairs, girl-boss again, loft dark behind',
	people: ['sosuno'],
	refs: [chS, bnS],
	prompt: 'Minimal iconic 16:9. LOW DUTCH timber stairs. Sosuno mid-descent, chin up, dusty-rose from portrait NOT gold, binyeo. ONE device: the stair-beam vertical. High contrast. Cel-painterly. No text.'
});
upsert({
	id: 'sosuno-seq-mate-guard',
	at: 'She finds a flaw every time',
	alt: 'Dutch yard: Sosuno stepping between Jumong and three tiny well-girls',
	people: ['sosuno', 'jumong'],
	refs: [chS, bnS, chJ],
	prompt: 'Minimal iconic 16:9 DUTCH. Sosuno mid-stride between Jumong and three tiny women at a well-rim. Dusty-rose, chin up. SAME well: stone rim, timber beam. ONE device: her sleeve as a plane. Cel-painterly. No text.'
});

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('little Sosuno patched');
