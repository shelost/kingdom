import { editStory, entryOf, find, makeInserter } from './story-ops.mjs';

const CHIP = {
	talhae: '#5a7fa8',
	aejin: '#c4a07a',
	hogong: '#a8894a',
	namhae: '#7f9c8a',
	nuri: '#7aa6d6'
};

function renameNuri(s) {
	if (typeof s !== 'string') return s;
	return s
		.replace(/Prince Yuri/g, 'Prince Nuri')
		.replace(/Yuri had sons/g, 'Nuri had sons')
		.replace(/Yuri said no/g, 'Nuri said no')
		.replace(/Yuri looks/g, 'Nuri looks')
		.replace(/Yuri laughs/g, 'Nuri laughs')
		.replace(/Yuri turns/g, 'Nuri turns')
		.replace(/Yuri is dying/g, 'Nuri is dying')
		.replace(/son Yuri/g, 'son Nuri')
		.replace(/Yuri\./g, 'Nuri.')
		.replace(/유리 왕자/g, '누리 왕자')
		.replace(/유리 임금/g, '누리 임금')
		.replace(/아들 유리/g, '아들 누리')
		.replace(/유리는/g, '누리는')
		.replace(/유리가/g, '누리가')
		.replace(/유리를/g, '누리를');
}

function walkRename(b) {
	for (const k of ['html', 'ko', 'caption', 'label']) if (b[k]) b[k] = renameNuri(b[k]);
	if (b.lines) b.lines = b.lines.map(renameNuri);
	if (b.en) b.en = b.en.map(renameNuri);
}

editStory((story) => {
	const entry = entryOf(story, 'silla-tang-war', 'Talhae');
	if (!entry) throw new Error('Talhae entry missing');

	for (const list of [entry.blocks, entry.images]) {
		for (const b of list ?? []) walkRename(b);
	}

	const aejinCard = find(entry, 'Her son fishes for the king');
	if (aejinCard.length === 1) {
		Object.assign(aejinCard[0].b, {
			caption: 'Grandma Ajin. Her son fishes for the king. Today she has caught something better.',
			ko: '아진의선. 아들은 임금의 고기를 잡는다. 오늘 그녀는 그보다 나은 것을 낚았다.',
			still: '/temp/talhae-card-ajin.jpg'
		});
	}

	const nuriCard = find(entry, 'The egg-king’s grandson');
	if (nuriCard.length === 1) {
		Object.assign(nuriCard[0].b, {
			caption: 'Nuri. The egg-king’s grandson. Kind, shy, and much harder to fool than he looks.',
			ko: '누리. 알에서 난 임금의 손자. 다정하고, 수줍고, 보기보다 훨씬 속이기 어렵다.',
			still: '/temp/talhae-card-nuri.jpg'
		});
	}

	const namhaeCard = find(entry, 'He reads an omen in every bird');
	if (namhaeCard.length === 1) namhaeCard[0].b.still = '/temp/talhae-card-namhae.jpg';

	const insert = makeInserter(entry);

	// 7 silent days + origin, after "Make it after supper."
	const silent = insert('…Make it after supper.', [
		{
			kind: 'p',
			html: 'She rows him home. Sets fish in front of him. He eats. He does not talk. Not the first night. Not the next.',
			ko: '노파가 그를 집으로 데려온다. 앞에 생선을 놓는다. 먹는다. 말은 안 한다. 첫날 밤에도. 그다음 날에도.'
		},
		{
			kind: 'p',
			html: 'Seven days of a boy who came in a box and will not say why.',
			ko: '궤짝에서 나온 아이가, 이레 동안 이유를 말하지 않는다.'
		},
		{
			kind: 'dialogue',
			person: 'aejin',
			chip: CHIP.aejin,
			en: ['You can eat.', 'You can also talk.'],
			lines: ['밥은 먹는구나.', '말은 해도 돼.']
		},
		{
			kind: 'p',
			html: 'He looks at her. Chews. Looks at the chest by the door.',
			ko: '아이는 노파를 본다. 씹는다. 문 옆 궤짝을 본다.'
		},
		{
			kind: 'p',
			html: 'On the seventh morning he puts the bone down.',
			ko: '이레째 아침, 아이가 가시를 내려놓는다.'
		},
		{
			kind: 'dialogue',
			person: 'talhae',
			chip: CHIP.talhae,
			en: ['Mother said go where I’m wanted.'],
			lines: ['어머니가, 반기는 데로 가라고 했어요.']
		},
		{
			kind: 'dialogue',
			person: 'aejin',
			chip: CHIP.aejin,
			en: ['…Did she.'],
			lines: ['…그랬냐.']
		},
		{
			kind: 'dialogue',
			person: 'talhae',
			chip: CHIP.talhae,
			en: [
				'There were dragons. A lot of them. Father was one.',
				'I was an egg first. That’s why it took so long.'
			],
			lines: ['용이 있었어요. 되게 많아요. 아버지도 용이었고요.', '처음엔 알이었어요. 그래서 오래 걸렸대요.']
		},
		{
			kind: 'dialogue',
			person: 'aejin',
			chip: CHIP.aejin,
			en: ['An egg.'],
			lines: ['알.']
		},
		{
			kind: 'dialogue',
			person: 'talhae',
			chip: CHIP.talhae,
			en: ['She put me in the box.', 'She said house first. Then a country.'],
			lines: ['상자에 넣었어요.', '집부터 이루고, 나라는 그다음에. 그렇게 말했어요.']
		},
		{
			kind: 'dialogue',
			person: 'aejin',
			chip: CHIP.aejin,
			en: ['…Eat.', 'Then we’ll see about a house.'],
			lines: ['…먹어.', '집은 그다음에 보자.']
		}
	]);
	if (silent !== true) throw new Error(`silent days insert: ${silent}`);

	// Hogong card after the Sagi quote
	const hogongCard = insert('hence he was called Hogong, Lord Gourd.', [
		{
			kind: 'card',
			person: 'hogong',
			caption: 'Hogong. He crossed the sea on a gourd, and still wears it. The house on the hill is his. For now.',
			ko: '호공. 박을 매달고 바다를 건넜고, 아직도 차고 다닌다. 언덕 위 집은 그의 것이다. 아직은.',
			still: '/temp/talhae-card-hogong.jpg'
		}
	]);
	if (hogongCard !== true) throw new Error(`hogong card insert: ${hogongCard}`);

	// Marriage scene after Namhae's decision
	const marriage = insert('I’d rather have that one inside the family than outside the gate.', [
		{
			kind: 'p',
			html: 'He sends for the boy that afternoon. His eldest is already in the hall. She has heard about the charcoal.',
			ko: '그날 오후, 임금이 그 젊은이를 부른다. 큰딸은 이미 전각에 있다. 숯 이야기는 들었다.'
		},
		{
			kind: 'dialogue',
			speaker: 'Ahyo',
			gender: 'f',
			chip: '#9a7a88',
			en: ['The one who stole the minister’s house.'],
			lines: ['대신 집 훔친 그 사람.']
		},
		{
			kind: 'dialogue',
			person: 'namhae',
			chip: CHIP.namhae,
			en: ['The one the magpie brought.', 'Inside the gate, Ahyo.'],
			lines: ['까치가 데려온 놈이다.', '문 안에 둬라, 아효야.']
		},
		{
			kind: 'p',
			html: 'Talhae bows too cheerfully. He has washed. The eyepatch is the same.',
			ko: '탈해가 너무 쾌활하게 절한다. 씻고 왔다. 안대는 그대로다.'
		},
		{
			kind: 'dialogue',
			person: 'talhae',
			chip: CHIP.talhae,
			en: ['I’ll be a very good son-in-law.'],
			lines: ['아주 좋은 사위가 되겠소.']
		},
		{
			kind: 'dialogue',
			speaker: 'Ahyo',
			gender: 'f',
			chip: '#9a7a88',
			en: ['Don’t steal my father’s hall.'],
			lines: ['아버지 전각은 훔치지 마시오.']
		},
		{
			kind: 'dialogue',
			person: 'talhae',
			chip: CHIP.talhae,
			en: ['I already have a house.'],
			lines: ['집은 이미 있소.']
		}
	]);
	if (marriage !== true) throw new Error(`marriage insert: ${marriage}`);

	// Replace the encyclopedia reign list with felt scenes
	const reignHits = find(entry, 'Nuri turns out to be a good king');
	if (reignHits.length !== 1) throw new Error(`reign start: ${reignHits.length}`);
	const { list, i } = reignHits[0];
	const cut = [];
	for (let k = 0; k < 6; k++) {
		const b = list[i + k];
		if (!b || b.kind !== 'p') throw new Error(`reign cut ${k} is ${b?.kind}`);
		cut.push(b.html.slice(0, 40));
	}
	list.splice(i, 6, ...[
		{
			kind: 'scene',
			label: 'The six valleys',
			ko: '여섯 골짜기'
		},
		{
			kind: 'p',
			html: 'Nuri turns out to be a good king. He does one thing nobody remembers and everybody uses.',
			ko: '누리는 좋은 임금이 된다. 그리고 아무도 기억하지 않지만 모두가 쓰는 일을 하나 한다.'
		},
		{
			kind: 'p',
			html: 'He sits the six old men at one table and gives their valleys surnames. The grandsons of the men who dug up the egg become Lees and Chois and four more.',
			ko: '늙은이 여섯을 한 상에 앉히고, 골짜기에 성을 내린다. 알을 파낸 사내들의 손자들이 이씨가 되고, 최씨가 되고, 넷이 더 된다.'
		},
		{
			kind: 'dialogue',
			person: 'yuri_isageum',
			chip: CHIP.nuri,
			en: ['If it has a name, it stays.', 'That’s all I meant.'],
			lines: ['이름 있으면 눌러앉지.', '그게 다요.']
		},
		{
			kind: 'p',
			html: 'Talhae is in the doorway, not sitting. He watches Nuri write the last name as if it were a trick he wishes he had thought of.',
			ko: '탈해는 문간에 서서 앉지 않는다. 누리가 마지막 성을 적는 걸, 자기가 먼저 생각했어야 할 수처럼 바라본다.'
		},
		{
			kind: 'scene',
			label: 'Eighth-month moon',
			ko: '여덟째 달 보름'
		},
		{
			kind: 'p',
			html: 'Then he invents a holiday, because the shy ones always do the lasting things. On the full moon of the eighth month he splits the women of the six houses into two weaving teams. The side with more cloth by moonrise wins. The losers feast the winners.',
			ko: '그리고 명절을 둔다. 수줍은 사람들이 늘 오래가는 일을 하니까. 여덟째 달 보름에 여섯 집안 여인들을 두 편으로 갈라 베를 짜게 한다. 달이 뜰 때까지 더 많이 짠 편이 이긴다. 진 편이 이긴 편에 잔치를 차린다.'
		},
		{
			kind: 'dialogue',
			person: 'yuri_isageum',
			chip: CHIP.nuri,
			en: ['Don’t look at me.', 'Look at the cloth.'],
			lines: ['나는 보지 마시오.', '베를 보시오.']
		},
		{
			kind: 'p',
			html: 'They call the wager Gabae. They still play it. You call it Chuseok.',
			ko: '그 내기의 이름은 가배다. 지금도 한다. 사람들은 추석이라 부른다.'
		}
	]);

	// Episode-story
	const meta = story
		.flatMap((c) => c.entries ?? [])
		.find((e) => e.title === 'Talhae');
	void meta;

	return true;
});

console.log('patched Talhae');
