import { editStory, entryOf, find, makeInserter } from './story-ops.mjs';

const CHIP = {
	micheon: '#C30000',
	dolgo: '#9a5348',
	changjori: '#8a7048'
};

function tree(step, title, caption, ko) {
	return { kind: 'diagram', diagram: 'goguryeo-house', step, title, caption, ko };
}

function d(person, en, lines, chip) {
	return { kind: 'dialogue', person, chip, en, lines };
}

editStory((story) => {
	const entry = entryOf(story, 'five-principles', 'Ulbul');
	if (!entry) throw new Error('Ulbul entry missing');
	const insert = makeInserter(entry);

	const open = insert('They invited him to supper.', [
		{
			kind: 'p',
			html: 'This is the house. Keep it. People will leave it.',
			ko: '이 집이다. 봐 둬라. 사람들이 빠져나갈 테니까.'
		},
		tree(
			'house',
			'The house · 고구려 왕실',
			'Suchun at the top. Five brothers under him. Dolgo’s boy at the end.',
			'맨 위가 서천. 아래 아들 다섯. 맨 끝이 돌고의 아이.'
		)
	]);
	if (open !== true) throw new Error(`open: ${open}`);

	const afterKnife = insert('Family is the first knife. A king who forgets that, dies at supper.', [
		tree(
			'banquet',
			'After supper · 잔치 다음',
			'Ilu and Sobal are gone. The boy behind the pillar is still in the room.',
			'일우와 소발이 빠졌다. 기둥 뒤 아이는 아직 방에 있다.'
		)
	]);
	if (afterKnife !== true) throw new Error(`afterKnife: ${afterKnife}`);

	const afterDalga = insert('That is the first year. A popular general, a closed door, a man in a corridor who will remember the staff.', [
		tree(
			'dalga',
			'The corridor · 복도',
			'Suchun is dead. Dalga is dead. The crown sits on the boy who watched.',
			'서천이 죽었다. 달가가 죽었다. 왕관은 지켜보던 아이 위에 있다.'
		)
	]);
	if (afterDalga !== true) throw new Error(`afterDalga: ${afterDalga}`);

	const afterLast = insert('That is the last of him. After that the boy does not look back again.', [
		{
			kind: 'p',
			html: 'The house sits down. The cup is back in his hand. The room goes white.',
			ko: '집안이 앉는다. 잔이 다시 그의 손에 있다. 방이 하얘진다.'
		},
		{
			kind: 'p',
			html: 'He drinks. He thinks of a back door, and a missed step, and a name he already said.',
			ko: '마신다. 뒷문. 헛디딘 걸음. 이미 불러 본 이름.'
		},
		tree(
			'dolgo',
			'The cup · 잔',
			'Dolgo is gone. The boy is a blank on the tree. He is running.',
			'돌고가 빠졌다. 아이는 빈칸이다. 뛰고 있다.'
		)
	]);
	if (afterLast !== true) throw new Error(`afterLast: ${afterLast}`);

	const afterBlood = insert('A prince of Goguryeo, blood in the packed earth, beaten by men who salt their pot with what they can take. That is as low as this one goes.', [
		{
			kind: 'p',
			html: 'The sticks stop. He is a dark mark in a hole they made of him. A hat. A shoe. Salt in the dirt.',
			ko: '몽둥이가 멈춘다. 그들이 만든 구덩이 안에 그는 검은 점이다. 모자. 신. 흙 위의 소금.'
		}
	]);
	if (afterBlood !== true) throw new Error(`afterBlood: ${afterBlood}`);

	const bank = find(entry, 'Changjori comes down the bank the way a man comes down a ladder he is not sure will hold.');
	if (bank.length !== 1) throw new Error(`bank hits: ${bank.length}`);
	Object.assign(bank[0].b, {
		html: 'Changjori comes down the bank. They look at each other. That is all it takes. Both of them know.',
		ko: '창조리가 언덕을 내려온다. 눈이 마주친다. 그걸로 충분하다. 둘 다 안다.'
	});

	const afterSee = insert('They look at each other. That is all it takes. Both of them know.', [
		{
			kind: 'p',
			html: 'Ulbul ties the sack. Walks past him. Does not stop.',
			ko: '을불이 자루를 묶는다. 그를 지나간다. 서지 않는다.'
		},
		d('changjori', ['Wait—', 'You— I know that walk.'], ['잠깐—', '그 걸음, 아오.'], CHIP.changjori),
		d('micheon', ['The salt’s that way.'], ['소금은 저쪽이오.'], CHIP.micheon),
		{
			kind: 'p',
			html: 'He keeps walking. Changjori has to go after him, into the mud, if he wants a second look.',
			ko: '그냥 간다. 창조리가 한 번 더 보려면, 진창까지 따라와야 한다.'
		}
	]);
	if (afterSee !== true) throw new Error(`afterSee: ${afterSee}`);

	const afterYes = insert('This time… yes.', [
		{
			kind: 'p',
			html: 'He stands. The satgat is still a hat. He puts it on like a man who has decided what the next sack is.',
			ko: '일어선다. 삿갓은 아직 모자다. 다음 자루가 뭔지 정한 사람처럼 쓴다.'
		}
	]);
	if (afterYes !== true) throw new Error(`afterYes: ${afterYes}`);

	const afterSeal = insert('They put the seal in the salt seller’s hands before the hats are thrown away. They call him Micheon. He still turns if you say the other name softly.', [
		tree(
			'hunt',
			'The hunt · 사냥',
			'Bongsang is gone. The blank is a king. They call him Micheon.',
			'봉상이 빠졌다. 빈칸이 임금이다. 미천이라 부른다.'
		)
	]);
	if (afterSeal !== true) throw new Error(`afterSeal: ${afterSeal}`);

	console.log('patched Ulbul scenes + house trees');
});
