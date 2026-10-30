import { editStory, entryOf, find, makeInserter } from './story-ops.mjs';

const CHIP = {
	talhae: '#5a7fa8',
	suro: '#8B5CF6',
	heo: '#d98fa8',
	hogong: '#a8894a'
};

function d(person, en, lines, chip) {
	return { kind: 'dialogue', person, chip, en, lines };
}

editStory((story) => {
	const entry = entryOf(story, 'silla-tang-war', 'Talhae');
	if (!entry) throw new Error('Talhae entry missing');
	const insert = makeInserter(entry);

	const gayaOpen = find(entry, 'walks into King Suro’s hall');
	if (gayaOpen.length !== 1) throw new Error(`gaya open hits: ${gayaOpen.length}`);
	Object.assign(gayaOpen[0].b, {
		html: 'Gaya tells it differently, and with more nerve. In their chronicle he comes ashore a grown man. He does not go to the hall. Not the first week.',
		ko: '가야는 이 이야기를 다르게, 더 배짱 좋게 한다. 그들의 기록에서 그는 다 큰 사내로 뭍에 오른다. 전각에는 가지 않는다. 첫 주에는.'
	});

	const stay = insert('He does not go to the hall. Not the first week.', [
		{ kind: 'scene', label: 'Geumgwan · the yards', ko: '금관 · 쇠 마당' },
		{
			kind: 'p',
			html: 'The town smells of charcoal before it smells of the sea. Bars stacked like firewood. Boys on the bellows until their arms shake. A whetstone hung on every post.',
			ko: '고을은 바다보다 숯 냄새가 먼저다. 장작처럼 쌓인 쇳덩이. 팔이 떨릴 때까지 풀무질하는 아이들. 기둥마다 숫돌.'
		},
		{
			kind: 'p',
			html: 'He asks for work. They give him the bellows. Nobody wants the bellows.',
			ko: '일을 달라고 한다. 풀무를 준다. 풀무를 원하는 사람은 없다.'
		},
		d(
			null,
			['You’re not from here.', 'The eye?'],
			['넌 여기 사람 아니지.', '그 눈?'],
			'#8a8a94'
		),
		d( 'talhae', ['The hands.', 'Give me a week.'], ['손이오.', '일주일만 주시오.'], CHIP.talhae ),
		{
			kind: 'p',
			html: 'He stays a season. He learns how to bank a fire so it lives through the night. How to tell the iron that holds from the iron that cracks. How a whetstone sounds when the edge is done.',
			ko: '한 철을 머문다. 밤새 살아 있게 불을 묻는 법을 배운다. 버티는 쇠와 금 가는 쇠를 가리는 법. 날이 끝났을 때 숫돌이 내는 소리.'
		},
		{
			kind: 'p',
			html: 'The queen finds him there. She does not send a servant.',
			ko: '왕후가 거기서 그를 찾는다. 하인을 보내지 않는다.'
		},
		{
			kind: 'card',
			person: 'heohwangok',
			caption: 'Queen Heo. She already knows what he came for.',
			ko: '허황옥. 그가 뭘 하러 왔는지, 이미 안다.',
			still: '/intro/heohwangok--talhae.jpg'
		},
		d(
			'heohwangok',
			['You work like a man who is stealing something.', 'The fire, or the town?'],
			['훔치는 사람처럼 일을 하시네요.', '불을요, 아니면 이 고을을요?'],
			CHIP.heo
		),
		d( 'talhae', ['Both, if I can.', 'Majesty.'], ['둘 다요. 되면.', '마마.'], CHIP.talhae ),
		d(
			'heohwangok',
			['Don’t Majesty me at a forge.', 'I can see your hands.'],
			['대장간에서 마마는 집어치우세요.', '손이 보이는데요.'],
			CHIP.heo
		),
		{
			kind: 'p',
			html: 'She names it. She always does. Then she sends for her husband, who stands too close to the heat and forgets why he came.',
			ko: '그녀는 보이는 것을 부른다. 늘 그렇게 한다. 그리고 남편을 부른다. 남편은 불에 너무 가까이 서서, 왜 왔는지 잊는다.'
		},
		d(
			'suro',
			['I— I have seen you. The eye.', 'The queen said a man at the fire.'],
			['과인은— 그대를 본 적이… 그 눈.', '왕후가, 불 앞에 사내가 있다고.'],
			CHIP.suro
		),
		d( 'talhae', ['I’ve been here.', 'Your iron is better than your chairs.'], ['계속 여기 있었소.', '쇠가 의자보다 낫소.'], CHIP.talhae ),
		d(
			'heohwangok',
			['He’s been counting your bars since the third week.', 'Ask him what he wants before he takes it.'],
			['셋째 주부터 쇳덩이를 세고 있었어요.', '빼앗기 전에 뭘 원하는지 물어보세요.'],
			CHIP.heo
		),
		{
			kind: 'p',
			html: 'So he walks into the hall. By then he already has the part of the country that matters.',
			ko: '그래서 전각으로 걸어 들어간다. 그때쯤이면, 나라에서 중요한 쪽은 이미 손에 있다.'
		},
		{ kind: 'scene', label: 'Suro’s hall', ko: '수로의 전각' }
	]);
	if (stay !== true) throw new Error(`stay insert: ${stay}`);

	// nameless smith: dialogue helper left person null — story needs speaker
	const smithHits = find(entry, 'You’re not from here.');
	if (smithHits.length !== 1) throw new Error(`smith hits: ${smithHits.length}`);
	Object.assign(smithHits[0].b, {
		speaker: 'A smith',
		gender: 'm',
		person: undefined
	});
	delete smithHits[0].b.person;

	const afterChair = insert('They aren’t a chair.', [
		d(
			'heohwangok',
			['They aren’t.', 'The iron is.'],
			['백성은 아니지요.', '쇠는 그래요.'],
			CHIP.heo
		),
		d( 'suro', ['…The iron?'], ['…쇠?'], CHIP.suro ),
		d(
			'heohwangok',
			['He’s been in your yards all season.', 'You already know that.'],
			['한 철을 마당에서 보냈어요.', '아시잖아요.'],
			CHIP.heo
		)
	]);
	if (afterChair !== true) throw new Error(`afterChair: ${afterChair}`);

	const afterArts = insert('…Something else?', [
		d( 'heohwangok', ['Do it.', 'I want to see.'], ['하세요.', '보고 싶어요.'], CHIP.heo )
	]);
	if (afterArts !== true) throw new Error(`afterArts: ${afterArts}`);

	const afterBow = insert('He is breathing hard, and he bows.', [
		{
			kind: 'p',
			html: 'The queen has not moved from the pillar. Feathers on his shoulders. Charcoal still under his nails.',
			ko: '왕후는 기둥에서 한 발짝도 움직이지 않았다. 그의 어깨에는 깃털. 손톱 밑에는 아직 숯.'
		}
	]);
	if (afterBow !== true) throw new Error(`afterBow: ${afterBow}`);

	const afterSmaller = insert('I’ll find a country with a smaller king.', [
		d(
			'heohwangok',
			['You already took what this country is made of.', 'I watched you take it.'],
			['이 나라의 것은 이미 가져가셨잖아요.', '내가 봤어요.'],
			CHIP.heo
		),
		d(
			'heohwangok',
			['The chair stays.', 'The fire you can keep.'],
			['의자는 남아요.', '불은 가져가세요.'],
			CHIP.heo
		),
		d( 'talhae', ['Ha.', 'That’s the better prize.'], ['하.', '그게 더 나은 상이오.'], CHIP.talhae )
	]);
	if (afterSmaller !== true) throw new Error(`afterSmaller: ${afterSmaller}`);

	const ships = find(entry, 'sends five hundred ships after him');
	if (ships.length !== 1) throw new Error(`ships hits: ${ships.length}`);
	Object.assign(ships[0].b, {
		html: 'He walks straight out of the hall and down to the ferry. Suro, who has just spared him twice, looks at his wife. She does not look back. Five hundred ships go after him. Mercy is one thing. A man who can turn into a sparrow, and who now knows how you make the bars, is another.',
		ko: '그는 곧장 전각을 나와 나루로 내려간다. 방금 그를 두 번 살려 준 수로가 왕후를 본다. 왕후는 돌아보지 않는다. 배 오백 척이 그 뒤를 따른다. 자비는 자비고, 참새로 변하고, 이제 쇳덩이 굽는 법까지 아는 사내를 제 바닷가에 풀어 두는 건 또 다른 일이다.'
	});

	const afterProve = insert('Dig by the gate, if you don’t believe me.', [
		{
			kind: 'p',
			html: 'They dig. The whetstone and the charcoal come up black and convincing. Those are not props. Those are Gaya tools. He taught his hands in Suro’s town, and he brought the fire north.',
			ko: '파 본다. 숫돌과 숯이 시커멓고 그럴듯하게 나온다. 소품이 아니다. 가야의 연장이다. 손은 수로의 고을에서 배웠고, 그 불을 북으로 가져왔다.'
		}
	]);
	if (afterProve !== true) throw new Error(`afterProve: ${afterProve}`);

	// drop the old "They dig. The whetstone..." that now duplicates
	const oldDig = find(entry, 'The whetstone and the charcoal come up out of the ground');
	if (oldDig.length === 1) oldDig[0].list.splice(oldDig[0].i, 1);

	const afterMother = insert('She never said whose.', [
		{ kind: 'scene', label: 'The stolen yard', ko: '훔친 마당' },
		{
			kind: 'p',
			html: 'The first morning in the stolen house, he lights a forge in the yard. The crescent hill smells of charcoal. Boys come to watch. Hogong comes too.',
			ko: '훔친 집의 첫 아침, 마당에 불을 지핀다. 반달 언덕에서 숯 냄새가 난다. 아이들이 보러 온다. 호공도 온다.'
		},
		d( 'hogong', ['You really are a smith.'], ['진짜 대장장이였군.'], CHIP.hogong ),
		d( 'talhae', ['I said so.'], ['그랬다니까.'], CHIP.talhae )
	]);
	if (afterMother !== true) throw new Error(`afterMother: ${afterMother}`);

	const chosen = find(entry, 'a fisherman and a thief');
	if (chosen.length === 1) {
		chosen[0].b.en = ['Gentlemen. I’ve been a hawk, a sparrow, a smith and a thief.', 'Chosen is new.'];
		chosen[0].b.lines = [
			'어르신들. 나는 매도 되어 봤고, 참새도, 대장장이도, 도둑도 되어 봤소.',
			'뽑힌 건 처음이오.'
		];
	}

	const afterGround = insert('You know the best ground in the city. I could use a man like that.', [
		{
			kind: 'p',
			html: 'The other first thing he does is put forges in the yards. Surabol starts to smell the way Gaya smelled. Bars. Bellows. A whetstone on every post.',
			ko: '그가 맨 먼저 한 다른 일은, 마당마다 불을 들이는 것이다. 서라벌이 가야 냄새를 내기 시작한다. 쇳덩이. 풀무. 기둥마다 숫돌.'
		},
		d( 'hogong', ['That’s Gaya’s fire.'], ['가야 불이야.'], CHIP.hogong ),
		d( 'talhae', ['Was.', 'It’s ours now.'], ['이었지.', '이젠 우리 거요.'], CHIP.talhae )
	]);
	if (afterGround !== true) throw new Error(`afterGround: ${afterGround}`);

	console.log('patched Talhae Gaya / iron / Heo');
});
