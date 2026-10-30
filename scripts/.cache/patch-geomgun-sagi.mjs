import { editStory, entryOf } from './story-ops.mjs';

const yushinLamp = {
	kind: 'dialogue',
	person: 'yushin',
	chip: '#4a8fe0',
	lines: [
		'첫째다. 사군이충.',
		'검군. 근랑.',
		'흉년이었네. 궁 사람들이 곡식을 나눠 가졌지. 검군만 거절했어. 더 주겠다는데, 웃더군.',
		'근랑한테 오늘로 끝이라 했어. 임금한테 고하든지, 뛰든지 하라 했지.',
		'둘 다 안 했네. 감사하다며 술을 따랐어. 알고 먹었네.'
	],
	en: [
		'First. Serve the sovereign.',
		'Geomgun. Geunrang.',
		'A famine year. The palace men took the grain. Geomgun said no. They offered more. He laughed.',
		'He told Geunrang he wouldn’t be back. Tell the king, Geunrang said. Or run.',
		'He did neither. They poured wine to thank him. He knew. He ate.'
	]
};

const yushinAfter = {
	kind: 'dialogue',
	person: 'yushin',
	chip: '#4a8fe0',
	lines: [
		'안 집어 가서 죽었네.',
		'돌아가서 받은 잔 때문에도.',
		'첫째 계율이 그거라네. 누구 곡식이냐.'
	],
	en: [
		'He died for not taking it.',
		'And for the cup they poured when he went back.',
		'That is the first precept. Whose grain it is.'
	]
};

const flashback = {
	kind: 'flashback',
	year: '628',
	title: 'the bowl',
	blocks: [
		{
			kind: 'p',
			html: 'Last autumn a frost came that didn’t know when to stop. The grain died in the ear.',
			ko: '지난가을, 그칠 줄 모르는 서리가 왔다. 곡식이 이삭에서 죽었다.'
		},
		{
			kind: 'p',
			html: 'The wells come up dry. The fields are dust. You can count the ribs on a dog in the lane.',
			ko: '우물이 마른다. 밭은 먼지다. 골목 개 갈비가 보인다.'
		},
		{
			kind: 'p',
			html: 'People sit with empty bowls at the storehouse door. They have been sitting since the last rain that wasn’t.',
			ko: '창고 문 앞에 빈 그릇을 든 사람들이 앉아 있다. 비가 아니었던 마지막 비 때부터다.'
		},
		{
			kind: 'p',
			html: 'At the well a woman is selling a child and calling it a loan.',
			ko: '우물가에서 여자가 아이를 팔면서, 빌려 준다고 한다.'
		},
		{ kind: 'scene', label: 'The Granary', ko: '창고' },
		{
			kind: 'p',
			html: 'Night, in the palace storehouse. The door is the only light. Four men at the bins who keep this palace when the king is not looking.',
			ko: '밤, 궁 창고. 문이 유일한 빛이다. 임금이 안 볼 때 이 궁을 지키는 남자 넷이 빈 앞에 있다.'
		},
		{
			kind: 'p',
			html: 'They fill two sleeves. They put a third sleeve in his hands. He holds it the way you hold a cup you did not ask for.',
			ko: '소매 둘을 채운다. 세 번째를 그의 손에 쥐여 준다. 청하지 않은 잔을 받듯 든다.'
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['Everyone took theirs.', 'Why not you.'],
			lines: ['다들 받았는데.', '자네만 왜.']
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['It’s the king’s grain.'],
			lines: ['임금의 곡식이오.']
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['If it’s small, say so.', 'We’ll add more. Sit down.'],
			lines: ['적어서 그래?', '더 주지. 앉아.']
		},
		{
			kind: 'p',
			html: 'He laughs. Once. You wouldn’t think he knew how.',
			ko: '웃는다. 한 번. 할 줄 아는 사람 같지 않다.'
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['I put my name on his yard.', 'If it isn’t right, I don’t take it.'],
			lines: ['근랑 낭도요.', '의 아니면 안 받소.']
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['A courtyard.', 'He’s going to quote a courtyard at a winter.'],
			lines: ['뜰.', '겨울에 뜰을 인용하네.']
		},
		{
			kind: 'p',
			html: 'He puts the sleeve back on the board. Grain runs over his wrist. He does not look at them.',
			ko: '소매를 셈판에 도로 놓는다. 쌀이 손목을 넘어 흐른다. 저들은 보지 않는다.'
		},
		{
			kind: 'p',
			html: 'He walks out. The storehouse door is the only light behind him.',
			ko: '걸어 나온다. 등 뒤로, 창고 문이 유일한 빛이다.'
		},
		{ kind: 'scene', label: 'The Plot', ko: '밀의' },
		{
			kind: 'p',
			html: 'The four of them sit down where he was standing. Somebody pours. Nobody drinks yet.',
			ko: '넷이, 그가 서 있던 자리에 앉는다. 누가 따른다. 아직 마시는 사람은 없다.'
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['If we leave him, it leaks.', 'You heard the courtyard.'],
			lines: ['저 놈 두면 새어.', '뜰 들었잖아.']
		},
		{
			kind: 'dialogue',
			speaker: 'Another palace man',
			gender: 'm',
			en: ['His Hwarang is two roofs over.', 'That’s where he’s walking.'],
			lines: ['화랑이 지붕 둘 너머야.', '그리로 가고 있어.']
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['Then we thank him.', 'Wine. Tonight. Before he talks.'],
			lines: ['그러면 감사하지.', '술. 오늘. 입 열기 전에.']
		},
		{
			kind: 'p',
			html: 'Somebody nods at the dark cup already warming on the board. That is a kindness, of a kind.',
			ko: '셈판 위에 이미 데워 둔 어두운 잔을, 누가 턱짓한다. 그런 종류의 친절이다.'
		},
		{ kind: 'scene', label: 'The Gate', ko: '문' },
		{
			kind: 'p',
			html: 'Geunrang’s gate. A lamp still lit, as if someone was expected. Geomgun stands in the packed earth and does not come in.',
			ko: '근랑의 문. 누가 올 것처럼 등불이 아직 켜져 있다. 검군이 흙바닥에 서서, 들어오지 않는다.'
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['After today I won’t see you.'],
			lines: ['오늘 이후론 못 뵙겠소.']
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Say that again.'],
			lines: ['다시 말하게.']
		},
		{
			kind: 'p',
			html: 'Geomgun doesn’t. The lamp makes a small sound. Geunrang comes down the step.',
			ko: '검군은 안 한다. 등불이 작게 운다. 근랑이 섬돌에서 내려온다.'
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Geomgun.'],
			lines: ['검군.']
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['They took the grain.', 'I didn’t.', 'They’re going to thank me.'],
			lines: ['곡식 가져갔소.', '난 안 받았소.', '감사하다며 부르오.']
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Then tell the hall.', 'Tell the king.'],
			lines: ['그러면 관에 고하게.', '임금한테.']
		},
		{
			kind: 'p',
			html: 'He looks at the step. You can watch him almost do it. You can watch him not.',
			ko: '섬돌을 본다. 할 뻔한 게 보인다. 안 하는 것도 보인다.'
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['I die, they hang.', 'I can’t do that because I’m scared.'],
			lines: ['내가 죽으면 저들이 매달리지.', '그게 무서워서 고하진… 못 하오.']
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['You’re allowed to be scared.', 'That’s not a reason to go back.'],
			lines: ['무서워도 돼.', '돌아가란 뜻은 아니네.']
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Then run.', 'I can have you at the river before they miss the cup.'],
			lines: ['그러면 뛰게.', '잔 찾기 전에 강까지 데려다 줄 수 있네.']
		},
		{
			kind: 'dialogue',
			person: 'geomgun',
			en: ['They’re wrong. I’m not.', 'And I run.', 'That’s not a man.'],
			lines: ['저들은 굽고 나는 곧소.', '내가 뛰면.', '그게 사내요.']
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Yes.', 'It is, tonight.'],
			lines: ['그래.', '오늘 밤은 그게 사내일세.']
		},
		{
			kind: 'p',
			html: 'He stands in the gate a long time. Geunrang waits. The horse is already saddled, and nobody asked for it.',
			ko: '문간에 오래 선다. 근랑이 기다린다. 말은 이미 안장을 얹혀 있다. 시킨 사람은 없다.'
		},
		{
			kind: 'dialogue',
			person: 'geunrang',
			en: ['Don’t.'],
			lines: ['가지 말게.']
		},
		{
			kind: 'p',
			html: 'He goes.',
			ko: '간다.'
		},
		{ kind: 'scene', label: 'The Wine', ko: '술' },
		{
			kind: 'p',
			html: 'They have set wine in the storehouse, as if to apologize. Four cups. A fifth, darker, already poured. Somebody has warmed it.',
			ko: '창고에 술을 차려 놨다. 사과하는 척. 잔이 넷. 다섯 번째는 더 어둡고, 이미 따라져 있다. 누군가 데워 놨다.'
		},
		{
			kind: 'dialogue',
			speaker: 'A palace man',
			gender: 'm',
			en: ['Sit.', 'We were wrong to press you.', 'Drink with us and it’s finished.'],
			lines: ['앉아.', '밀어붙인 건 우리가 잘못이야.', '한잔하고 끝이야.']
		},
		{
			kind: 'p',
			html: 'He sits. Cross-legged, the way a monk sits when the count is done. Both hands on the cup. Eyes open.',
			ko: '앉는다. 책상다리. 셈을 끝낸 스님이 앉듯. 두 손이 잔 위에 있다. 눈은 떠 있다.'
		},
		{
			kind: 'p',
			html: 'He knows. You can see him know. He drinks anyway.',
			ko: '안다. 아는 게 보인다. 그래도 마신다.'
		},
		{
			kind: 'p',
			html: 'It tastes like metal, then like nothing.',
			ko: '쇠 맛이다. 그다음엔 아무 맛도 없다.'
		},
		{
			kind: 'p',
			html: 'The storehouse goes. The clerks go. There is only the cup.',
			ko: '창고가 사라진다. 서기들이 사라진다. 잔만 남는다.'
		},
		{
			kind: 'p',
			html: 'The bowl stays in his lap. He does not fall. The breath just stops being a problem.',
			ko: '사발은 무릎 위에 있다. 쓰러지지 않는다. 숨이, 그냥, 문제가 아니게 된다.'
		},
		{
			kind: 'p',
			html: 'Two roofs over, Geunrang is still in the gate. He is still telling a man who has already gone not to go.',
			ko: '지붕 둘 너머, 근랑은 아직 문간에 있다. 이미 간 사람더러 가지 말라고, 아직 말하고 있다.'
		}
	]
};

const quote = {
	kind: 'quote',
	hanja: '劒君死非其所, 可謂輕泰山於鴻毛者也',
	ko: '검군은 죽을 곳이 아닌데 죽었다. 태산을 기러기 털보다 가볍게 여긴 자라 이를 만하다.',
	html: 'Geomgun died where he should not have died. You could say he treated a mountain as lighter than a goose feather.',
	source: 'Samguk Sagi (三國史記) bk. 48, Biographies — Geomgun'
};

editStory((story) => {
	const entry = entryOf(story, 'five-principles', 'Bupmin');
	if (!entry) throw new Error('Bupmin not found');
	const blocks = entry.blocks;
	const lamp = blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.person === 'yushin' && b.en?.includes('First. Serve the sovereign.')
	);
	if (lamp < 0) throw new Error('lamp speech missing');
	blocks[lamp] = yushinLamp;

	const after = blocks.findIndex(
		(b) => b.kind === 'dialogue' && b.person === 'yushin' && b.en?.includes('He died for not taking it.')
	);
	if (after < 0) throw new Error('after-boy speech missing');
	blocks[after] = yushinAfter;

	const fb = blocks.findIndex((b) => b.kind === 'flashback' && b.title === 'the bowl');
	if (fb < 0) throw new Error('bowl flashback missing');
	blocks[fb] = flashback;

	const lampBack = blocks.findIndex((b) => b.kind === 'p' && b.html?.startsWith('The lamp comes back.'));
	if (lampBack < 0) throw new Error('lamp comes back missing');
	if (!blocks[lampBack + 1] || blocks[lampBack + 1].source !== quote.source) {
		blocks.splice(lampBack + 1, 0, quote);
	}
});

console.log('patched Geomgun from Samguk Sagi');
