import { editStory, entryOf, find } from './story-ops.mjs';

editStory((story) => {
	const ulbul = entryOf(story, 'five-principles', 'Ulbul');
	if (!ulbul) throw new Error('missing Ulbul');

	const party = find(ulbul, 'the party is already a country.');
	if (party.length !== 1) throw new Error(`party p: ${party.length}`);
	party[0].b.html =
		'Outside the pools the party is already a country. On the bank the court is dressed: dotted ochre jackets, black-trimmed trousers, jougwan feathers ticking with the drum. In the water the silk comes off. Someone is laughing so hard he swallows steam.';
	party[0].b.ko =
		'탕 밖은 이미 나라다. 둑 위는 옷 입은 조정이다. 점무늬 황토 저고리, 검은 선 바지, 북에 맞춰 흔들리는 조우관 깃. 물속에서는 비단이 벗어진다. 누가 김을 삼킬 만큼 웃는다.';

	const afterParty = find(ulbul, 'the party is already a country.');
	const list = afterParty[0].list;
	const i = afterParty[0].i;
	if (list[i + 1]?.html?.includes('Court ladies take the bank')) {
		/* already patched */
	} else {
		list.splice(i + 1, 0, {
			kind: 'p',
			html: 'Court ladies take the bank the way a mural takes a wall. White jeogori. Striped chima. Rouge on the cheek. One of them has already hiked the skirt to dance.',
			ko: '궁녀들이 둑을 차지한다. 벽화가 벽을 차지하는 식으로. 흰 저고리. 색동 치마. 볼에 연지. 하나는 벌써 춤추려고 치마를 걷었다.'
		});
		list.splice(i + 2, 0, {
			kind: 'p',
			html: 'The long sleeves go first. Goguryeo dance is sleeves. They wrap a man, unwrap him, wrap him again. His feather-cap knocks her pin. Neither of them fixes it.',
			ko: '긴 소매가 먼저다. 고구려 춤은 소매다. 사내를 감싸고, 풀고, 다시 감싼다. 조우관 깃이 비녀를 친다. 둘 다 고치지 않는다.'
		});
		list.splice(i + 3, 0, {
			kind: 'dialogue',
			speaker: 'A court lady',
			gender: 'f',
			chip: '#c45a3a',
			lines: ['야. 깃 잡아당기지 마.', '그럼 따라와.'],
			en: ['Hey. Don’t pull the feather.', 'Then come.']
		});
		list.splice(i + 4, 0, {
			kind: 'dialogue',
			speaker: 'A hunter',
			gender: 'm',
			chip: '#8b5a3a',
			lines: ['물에서?'],
			en: ['In the water?']
		});
		list.splice(i + 5, 0, {
			kind: 'dialogue',
			speaker: 'A court lady',
			gender: 'f',
			chip: '#c45a3a',
			lines: ['여기서.', '깃이 젖어도 돼.'],
			en: ['Here.', 'The feather can get wet.']
		});
		list.splice(i + 6, 0, {
			kind: 'p',
			html: 'She kisses him the way the spring kisses: wet, laughing, not finished. A second pair has already found the steam’s edge. You can hear the song in their teeth.',
			ko: '그녀는 온탕이 키스하듯 한다. 젖고, 웃고, 안 끝났다. 다른 한 쌍은 벌써 김 가장자리를 찾았다. 이 사이로 노래가 들린다.'
		});
	}

	const ansi = entryOf(story, 'goguryeo-tang-war', 'Lord of Ansi');
	if (!ansi) throw new Error('missing Lord of Ansi');

	const fire = find(ansi, 'Tonight the fire is in the yard');
	if (fire.length !== 1) throw new Error(`fire p: ${fire.length}`);
	if (!fire[0].list[fire[0].i + 1]?.html?.includes('Dotted ochre. Striped skirts.')) {
		const fl = fire[0].list;
		const fi = fire[0].i;
		fl.splice(fi + 1, 0, {
			kind: 'p',
			html: 'Dotted ochre. Striped skirts. Black feather-caps bouncing. Rouge. Nobody brought a helmet. This is how a Goguryeo town goes to bed: it doesn’t.',
			ko: '점무늬 황토. 색동 치마. 튀는 검은 깃. 연지. 투구 가져온 사람 없다. 고구려 고을이 자는 법이다. 안 잔다.'
		});
		fl.splice(fi + 2, 0, {
			kind: 'p',
			html: 'The long sleeves take the ring. A woman wraps a mason, unwraps him, wraps him again. He is still holding his cup. She kisses the cup out of the way and then she kisses him.',
			ko: '긴 소매가 원을 돈다. 여자가 석수를 감싸고, 풀고, 다시 감싼다. 석은 아직 잔을 들고 있다. 여자는 잔을 밀어 키스하고, 그다음엔 그를 키스한다.'
		});
	}

	const asking = find(ansi, 'In Ansi the girls do the asking');
	if (asking.length !== 1) throw new Error(`asking p: ${asking.length}`);
	asking[0].b.html =
		'In Ansi the girls do the asking. Kkachi crosses the circle and takes a young archer by the dotted sleeve. He goes the colour of the fire. She does not wait for him to decide.';
	asking[0].b.ko =
		'안시에서는 처녀가 먼저 청한다. 까치가 춤판을 가로질러 젊은 궁수의 점무늬 소매를 잡는다. 궁수는 불빛처럼 빨개진다. 까치는 그가 정할 때까지 안 기다린다.';

	if (!asking[0].list[asking[0].i + 1]?.html?.includes('laugh into each other')) {
		const al = asking[0].list;
		const ai = asking[0].i;
		al.splice(ai + 1, 0, {
			kind: 'p',
			html: 'They laugh into each other’s mouths and do not stop. His jougwan knocks her pin. Somebody whoops. The dark just past the fire is already full of people who found each other.',
			ko: '서로 입에 웃음을 넣고, 멈추지 않는다. 조우관이 비녀를 친다. 누가 환호한다. 불 너머 어둠은 이미, 서로를 찾은 사람들로 차 있다.'
		});
		al.splice(ai + 2, 0, {
			kind: 'dialogue',
			speaker: 'The archer',
			gender: 'm',
			chip: '#9a5c55',
			lines: ['까치야—', '잠깐, 깃—'],
			en: ['Kkachi—', 'Wait, the feather—']
		});
		al.splice(ai + 3, 0, {
			kind: 'dialogue',
			speaker: 'Kkachi',
			gender: 'f',
			chip: '#c98a5c',
			lines: ['깃은 나중에.', '입은 지금.'],
			en: ['Feather later.', 'Mouth now.']
		});
	}

	const both = find(ansi, 'Both. Aye, always both.');
	if (both.length !== 1) throw new Error(`both: ${both.length}`);
	if (!both[0].list[both[0].i + 1]?.en?.includes?.('Then look at me when I do this.')) {
		const bl = both[0].list;
		const bi = both[0].i;
		bl.splice(bi + 1, 0, {
			kind: 'dialogue',
			speaker: 'Kkachi',
			gender: 'f',
			chip: '#c98a5c',
			lines: ['그럼 이렇게 할 때 나만 봐.'],
			en: ['Then look at me when I do this.']
		});
		bl.splice(bi + 2, 0, {
			kind: 'p',
			html: 'She pops up on her toes and kisses him. The wandering eye finds her anyway. The town makes a noise you only make for a man you would follow off a wall.',
			ko: '까치가 발끝으로 서서 그를 키스한다. 한눈은 그래도 그녀를 찾는다. 고을이 소리를 낸다. 성벽 아래로라도 따라 뛰어내릴 사내한테만 내는 소리다.'
		});
		bl.splice(bi + 3, 0, {
			kind: 'dialogue',
			person: 'yangmanchun',
			chip: '#e05a3c',
			lines: ['야.', '고을 앞에서.', '…됐다. 한 잔.'],
			en: ['Yah.', 'In front of the town.', '…Aye. Pour one.']
		});
	}

	const age = find(ansi, 'He is thirty-two.');
	if (age.length !== 1) throw new Error(`age: ${age.length}`);
	if (!age[0].list[age[0].i + 1]?.html?.includes('They feed him')) {
		age[0].list.splice(age[0].i + 1, 0, {
			kind: 'p',
			html: 'They feed him first. They save him the warm spot by the stones. They call him Lazy-eye the way you call a brother a bad name you like. If he ever left, the fire would still be lit. It would just be pointed at the gate.',
			ko: '밥은 그를 먼저 준다. 돌 옆 따뜻한 자리를 남겨 둔다. 짝눈이라 부른다. 좋아하는 형을 욕하듯. 그가 떠나면 불은 그래도 켤 것이다. 다만 성문을 향해.'
		});
	}

	return true;
});

console.log('patched Ulbul banquet + Ansi hearth');
