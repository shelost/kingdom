/** Frame King Micheon on a Pyongyang salt stall; add Yushin / Bidam / Gyebek thirst beats. */
import { editStory, find } from './story-ops.mjs';

const BUYER = {
	speaker: 'A man',
	gender: 'm',
	chip: '#7a6a58'
};

function d(person, lines, en, extra = {}) {
	return { kind: 'dialogue', person, lines, en, chip: extra.chip, look: extra.look, ...extra };
}

function p(html, ko) {
	return { kind: 'p', html, ko };
}

function scene(label, ko, extra = {}) {
	return { kind: 'scene', label, ko, ...extra };
}

editStory((story) => {
	const entries = story.flatMap((c) => c.entries ?? []);
	const mich = entries.find((e) => e.title === 'King Micheon');
	const yushinEp =
		entries.find((e) => find(e, 'He undresses the way a man does when he is only fetching water').length === 1) ??
		null;
	const jeon = entries.find((e) => e.title === 'Jeon');
	const euija = entries.find((e) => e.title === 'Prince Euija');
	if (!mich || !yushinEp || !jeon || !euija) {
		throw new Error(`missing entry mich=${!!mich} yushin=${yushinEp?.title} jeon=${!!jeon} euija=${!!euija}`);
	}

	mich.place = 'pyongyang';
	mich.toneNote =
		'A man buys salt under a Chinese fortress. Seven years of wood and salt later, the fortress is his. He still says he is just a merchant.';
	mich.logline = {
		en: 'A man buys salt under a Chinese fortress. The merchant looks up. Thirteen years later the fortress looks back.',
		ko: '중국 성 아래서 사내가 소금을 산다. 장수가 올려다본다. 십삼 년 뒤, 성이 그를 본다.'
	};

	const frogs = mich.blocks.findIndex((b) => b.html === 'The frogs were the problem.');
	const sand = mich.blocks.findIndex((b) =>
		String(b.html ?? '').startsWith('You would think seven years of that would sand')
	);
	if (frogs < 0 || sand < 0) throw new Error('micheon splice anchors missing');
	const exileBlocks = mich.blocks.slice(frogs, sand + 1);
	const afterExile = mich.blocks.slice(sand + 1);

	const palace = afterExile.find((b) => b.label === 'The palace · a hungry year');
	if (palace?.jump) delete palace.jump;
	const westI = afterExile.findIndex((b) => b.label === 'The western gate · thirteen years later');
	if (westI >= 0) {
		const n = afterExile[westI + 1]?.kind === 'map' ? 2 : 1;
		afterExile.splice(westI, n);
	}

	const opening = [
		p('A man walks to the market for salt.', '사내가 소금을 사러 시장에 간다.'),
		p(
			'That is all he came for. You know this kind of morning. A measure, a coin, a walk home before the heat.',
			'그것만 하러 왔다. 이런 아침은 아실 것이다. 되 하나, 동전 하나, 더워지기 전에 집.'
		),
		scene('The market · under the fortress', '시장 · 성 아래', { weather: 'dusk' }),
		{
			kind: 'map',
			year: 300,
			places: ['pyongyang', 'amnok', 'gungnae'],
			riverNames: true,
			caption: 'A Chinese city on a Goguryeo river. Salt goes in. Tax comes out.',
			ko: '고구려 강 위의 중국 성. 소금이 들어가고, 세금이 나온다.'
		},
		p(
			'The fortress sits over the stalls the way a landlord sits over a debt. Red munru. Grey stone. Chinese roofs on a river that has been fighting them for nearly four hundred years, one commandery at a time, and this one is still here.',
			'성은 빚 위에 앉은 주인처럼 좌판 위에 앉아 있다. 붉은 문루. 회색 돌. 거의 사백 년째 이 강이 치고 있는 중국 지붕이다. 군현을 하나씩. 이건 아직 남아 있다.'
		),
		p(
			'The merchant has his back to you. Straw satgat. White hemp. A sack that has been tied twice. He does not look up when the man clears his throat.',
			'장수의 등이 먼저다. 삿갓. 흰 베. 두 번 묶인 가마니. 사내가 목을 긁어도 고개를 들지 않는다.'
		),
		{
			kind: 'dialogue',
			...BUYER,
			lines: ['소금. 한 되.', '요즘 값이 왜 이래. 북쪽 임금이 지붕을 올린다며.'],
			en: ['Salt. One measure.', 'Why is it dear. They say the king up north is putting up a roof.']
		},
		d(
			'micheon',
			['지붕은 못 먹죠.', '된 만큼만 드립니다.'],
			['A roof cannot be eaten.', 'You get what fills the measure.'],
			{ chip: '#C30000', look: 'exile' }
		),
		{
			kind: 'dialogue',
			...BUYER,
			lines: [
				'여기 세금이 더 독해. 손목에 매긴다니까.',
				'사백 년째 이 성이 이 강을 먹고 있어.',
				'북쪽은  fort를— 아니. 북쪽은  fort가 아니라. 북쪽은  fort—',
				'북쪽은  fort를 하나씩 부순다며. 여기는 안 건드리고.'
			],
			en: [
				'Tax is worse here. They put it on the wrist.',
				'This fortress has been eating this river for four hundred years.',
				'They say the north knocks the commanderies down one at a time.',
				'Not this one. Not yet.'
			]
		}
	];

	// Fix the accidental English leak in Korean lines — rewrite buyer politics cleanly
	opening[opening.length - 1] = {
		kind: 'dialogue',
		...BUYER,
		lines: [
			'여기 세금이 더 독해. 손목에 매긴다니까.',
			'사백 년째 이 성이 이 강을 먹고 있어.',
			'북쪽은 군현을 하나씩 부순다며.',
			'여기는 안 건드리고.'
		],
		en: [
			'Tax is worse here. They put it on the wrist.',
			'This fortress has been eating this river for four hundred years.',
			'They say the north knocks the commanderies down one at a time.',
			'Not this one. Not yet.'
		]
	};

	opening.push(
		d(
			'micheon',
			['하나씩이 맞아요.', '급하면 손이 떨리거든요.'],
			['One at a time is right.', 'If you hurry, the hand shakes.'],
			{ chip: '#C30000', look: 'exile' }
		),
		p(
			'The satgat brim lifts. The face comes out slowly. Young. Burned down to the cheek. A sly tired look, the kind you get from counting the same sack twice and still not being sure.',
			'삿갓 챙이 올라간다. 얼굴이 천천히 나온다. 젊다. 볼까지 타 있다. 가마니를 두 번 세고도 아직 확신이 없는 사람의, 슬쩍 지친 표정.'
		),
		p(
			'He does not look at the buyer. He looks up. At the fortress. Red pavilion on grey stone. A mysterious look, if you want to call it that. The look of a man measuring a roof he has not been invited to climb.',
			'손님을 보지 않는다. 위를 본다. 성을. 회색 돌 위의 붉은 전각. 신비하다고 하면 신비한 눈이다. 초대받지 않은 지붕을 재는 눈.'
		),
		{
			kind: 'dialogue',
			...BUYER,
			lines: ['누구요.', '장수 얼굴이 아니네.'],
			en: ['Who are you.', 'That’s not a merchant’s face.']
		},
		p('The measure sits between them. A breath. Then another.', '되가 둘 사이에 앉아 있다. 숨. 그리고 한 숨 더.'),
		d('micheon', ['……소금장수요.'], ['……Just a salt merchant.'], {
			chip: '#C30000',
			look: 'exile'
		}),
		{
			kind: 'card',
			person: 'micheon',
			look: 'exile',
			caption: 'He has not used his name since the night his father told him to stop.',
			ko: '아버지가 그만두라 한 밤 이후로, 그는 제 이름을 쓰지 않는다.'
		},
		{
			kind: 'flashback',
			year: '293',
			title: 'The name he put down',
			blocks: exileBlocks
		},
		scene('The market · the same morning', '시장 · 그 아침', { weather: 'dusk' }),
		p(
			'The buyer is still holding the measure. He does not know what he just bought. The fortress has not moved.',
			'사내는 아직 되를 들고 있다. 방금 무엇을 샀는지 모른다. 성은 움직이지 않았다.'
		),
		{
			kind: 'dialogue',
			...BUYER,
			lines: ['성을 그렇게 보더니.', '빚이라도 있나.'],
			en: ['You looked at the fortress like that.', 'You owe it something?']
		},
		d(
			'micheon',
			['소금은 소금이오.', '성은 기다릴 수 있소.'],
			['Salt is salt.', 'The fortress can wait.'],
			{ chip: '#C30000', look: 'exile' }
		),
		p(
			'He ties the sack. He does not look up again. Not today. Upriver, that same week, a king is building a roof.',
			'가마니를 묶는다. 다시 올려다보지 않는다. 오늘은. 그 주, 강 위에서는 임금이 지붕을 올리고 있다.'
		)
	);

	mich.blocks = [...opening, ...afterExile];

	// After the crown, plant four hundred years; expand the commandery war; close on the smile.
	const crownHits = find(mich, 'They put the crown on the salt seller');
	if (crownHits.length !== 1) throw new Error(`crown plant ${crownHits.length}`);
	const { list: crownList, i: crownI } = crownHits[0];
	crownList.splice(crownI + 1, 0, {
		kind: 'p',
		html: 'Four hundred years. That is how long this house has been taking the Chinese cities apart, one seal at a time. He is the one who gets to finish the last of them. He does not know that yet. He still turns if you say the old name softly.',
		ko: '사백 년. 이 집안이 중국 성을 인장 하나씩 뜯어 온 시간이다. 마지막을 끝내는 사람이 그다. 아직은 모른다. 옛 이름을 낮추어 부르면 아직 돌아본다.'
	});

	const cityHits = find(mich, 'There is a city on that river that has been Chinese');
	const payHits = find(mich, 'He pays. Full measure.');
	if (cityHits.length !== 1 || payHits.length !== 1) throw new Error('conquest splice failed');
	if (cityHits[0].list !== payHits[0].list) throw new Error('conquest lists differ');
	const clist = cityHits[0].list;
	const from = cityHits[0].i;
	const thru = payHits[0].i;
	const keptTail = clist.slice(thru + 1);
	const conquest = [
		scene('The northern seal · two years after the crown', '북쪽 인장 · 왕관 후 이 년', {
			weather: 'dusk',
			jump: { en: 'Two Years Later…', ko: '이 년 뒤…', year: 302 }
		}),
		p(
			'The first one is in the north. A seal on a road Goguryeo has wanted since the first king learned to hate a wall. Micheon takes it the way he used to take a sack off a boat. Count. Lift. Do not drop it.',
			'첫 번째는 북쪽이다. 첫 임금이 담을 미워하기 시작한 뒤로 이 집이 탐내 온 길의 인장. 미천은 배에서 가마니를 내리듯 취한다. 세고. 들고. 떨어뜨리지 않고.'
		),
		d(
			'micheon',
			['하나씩이오.', '급하면 손이 떨리니까.'],
			['One at a time.', 'If you hurry, the hand shakes.'],
			{ chip: '#C30000', look: 'king' }
		),
		scene('The river road · nine years later', '강의 길 · 구 년 뒤', {
			weather: 'dusk',
			jump: { en: 'Nine Years Later…', ko: '구 년 뒤…', year: 311 }
		}),
		p(
			'The next one is the road under the river. Cut that, and the letters home have to swim. He cuts it. The letters stop. Four hundred years of paper, and then the paper has nowhere to go.',
			'다음은 강 밑의 길이다. 그걸 끊으면 본국으로 가는 편지가 헤엄쳐야 한다. 끊는다. 편지가 끊긴다. 사백 년의 종이. 그리고 종이가 갈 곳이 없어진다.'
		),
		scene('The western gate · thirteen years later', '서쪽 성문 · 십삼 년 뒤', {
			weather: 'dusk',
			jump: { en: 'Thirteen Years Later…', ko: '십삼 년 뒤…', year: 313 }
		}),
		p(
			'There is a city on that river that has been Chinese longer than anyone in his house has worn a crown. Seals. Granaries. A market that buys Goguryeo salt and taxes the wrist that weighed it. Four hundred years of that. One commandery at a time. This is the one he looked at from under a satgat.',
			'그 강가에, 이 집안이 왕관을 쓰기 전부터 중국이었던 성이 있다. 인장. 곳간. 고구려 소금을 사면서 저울 든 손목에 세금을 매기는 시장. 사백 년째다. 군현을 하나씩. 삿갓 아래에서 올려다보던 그 성이다.'
		),
		p(
			'The city waits a winter. Then another. The man who holds it for a court that no longer writes comes out to the gate, because nobody is coming from the other direction.',
			'성은 겨울을 기다린다. 한 번 더. 더 이상 편지를 쓰지 않는 조정을 대신해 성을 쥐고 있던 사내가 성문 밖으로 나온다. 다른 쪽에서는 아무도 오지 않으니까.'
		),
		d(
			'zhangtong',
			['이 인장은 진나라 황제의 것입니다.', '황제는 답을 하지 않습니다. 삼 년째입니다.'],
			['This seal belongs to the emperor of Jin.', 'The emperor does not answer. It has been three years.'],
			{ chip: '#8a9aaa' }
		),
		d(
			'micheon',
			['저도 답을 못 받아 봤소.', '더 짧았소.', '더 아팠소.'],
			['I’ve gone without an answer.', 'Mine was shorter.', 'It hurt more.'],
			{ chip: '#C30000', look: 'king' }
		),
		d(
			'zhangtong',
			[
				'성 안의 사람들은 제 백성입니다.',
				'걷게 해 주십시오. 서쪽 기마족이 받겠습니다.',
				'남는 사람은 가게를 지키게 해 주십시오. 저는 이 사람들을 불태우지 않겠습니다. 왕께서도 그러지 마십시오.'
			],
			[
				'The people in this city are mine.',
				'Let them walk. The horsemen in the west will take them.',
				'Let the ones who stay keep their shops. I will not burn them. Don’t you burn them either.'
			],
			{ chip: '#8a9aaa' }
		),
		p(
			'Micheon looks at the gate, not at the seal. He has stood at gates where a man with a brush decided what his back was worth. Four hundred years of that, on this river, and he is not in a hurry to be that man.',
			'미천은 인장이 아니라 성문을 본다. 붓을 든 사내가 그의 등의 값을 정하던 문 앞에 서 본 적이 있다. 이 강에서 사백 년째 그런 문이 있었다. 그 사내가 될 생각은 급하지 않다.'
		),
		d(
			'micheon',
			['걷는 사람은 걷게 하시오.', '남는 사람은 내 사람이오.', '세금은 내일이오. 소금값은 오늘이고.'],
			['Whoever wants to walk, walks.', 'Whoever stays is mine.', 'Tax is tomorrow. The price of salt is today.'],
			{ chip: '#C30000', look: 'king' }
		),
		p(
			'They walk. Not all of them. The ones who want the western road go with their governor. The ones who stay open the shops, because a shop that opens is a vote.',
			'그들은 걷는다. 전부가 아니다. 서쪽 길을 원하는 사람들은 총관과 함께 간다. 남는 사람들은 가게를 연다. 문을 여는 가게는 표다.'
		),
		scene('The market · under the fortress', '시장 · 성 아래', { weather: 'dusk' }),
		p(
			'In the market a man is shorting a measure, on purpose, with the concentration of a priest. He does not bow. He does not know which of the muddy officers used to tie his sacks.',
			'시장에서 한 사내가 일부러 되를 덜 담고 있다. 사제처럼 집중해서. 그는 절하지 않는다. 진흙투성이 장교 중 누가 예전에 제 가마니를 묶었는지 모른다.'
		),
		d(
			'jaemo',
			['도련님.', '아니. 이제 뭐라고 부르냐.', '신 도둑은 아니지. 그거 하나는 알지.'],
			['Young master.', 'No. What do I call you now.', 'Not a shoe thief. I know that much.'],
			{ chip: '#c4a574' }
		),
		d(
			'micheon',
			['그 말 하지 마.', '그 되. 아직도 덜 담지.'],
			['Don’t.', 'That measure. You still short it.'],
			{ chip: '#C30000', look: 'king' }
		),
		d(
			'jaemo',
			['덜 담아야 정확하지.', '왕한테는 특히.', '왕들은 가득 찬 되를 못 견뎌. 경험이 그래.'],
			['Short is how it stays honest.', 'Especially for a king.', 'Kings can’t bear a full measure. Experience.'],
			{ chip: '#c4a574' }
		),
		d('micheon', ['꽉 채워.', '값은 내가 낸다.'], ['Fill it.', 'I’ll pay.'], {
			chip: '#C30000',
			look: 'king'
		}),
		p(
			'He pays. Full measure. The sister city folds the next summer. The last Chinese seal on the peninsula goes into a box nobody opens. Four hundred years. Then it wasn’t.',
			'그는 값을 치른다. 가득 채워서. 이듬해 여름, 형제뻘 되는 성이 접힌다. 반도의 마지막 중국 인장은 아무도 열지 않는 상자에 들어간다. 사백 년. 그리고 아니었다.'
		),
		p(
			'He stands in the same market. The same red munru. The fortress is his now. A man at the next stall asks, the way men ask when they already know and want to hear it said.',
			'같은 시장에 선다. 같은 붉은 문루. 이제 그 성이다. 옆 좌판의 사내가 묻는다. 이미 알고, 듣기만 하려는 물음이다.'
		),
		{
			kind: 'dialogue',
			...BUYER,
			lines: ['이제 누구요.'],
			en: ['Who are you now.']
		},
		p('He looks up at the fortress. This time he smiles.', '성을 올려다본다. 이번엔 웃는다.'),
		d('micheon', ['……소금장수요.'], ['……Just a salt merchant.'], {
			chip: '#C30000',
			look: 'king'
		})
	];
	clist.splice(from, thru - from + 1, ...conquest);
	const card = keptTail.filter((b) => String(b.html ?? '').includes('<b>'));
	if (card.length !== 1) throw new Error(`expected one next-card, got ${card.length}`);

	// Yushin shirt-off in the cavern (The Cut)
	const dressHits = find(yushinEp, 'He undresses the way a man does when he is only fetching water');
	if (dressHits.length !== 1) throw new Error(`yushin dress ${dressHits.length}`);
	dressHits[0].list.splice(dressHits[0].i + 1, 0, ...[
		p(
			'The jeogori comes off first. Then the sash. Steam takes the rest. He is built the way the yard builds a man: shoulders, a chest that has carried armour, a stomach that has not been allowed to forget work.',
			'저고리가 먼저 벗어진다. 그다음 띠. 김이 나머지를 가져간다. 마당이 사람을 만드는 방식이다. 어깨. 갑옷을 메던 가슴. 일을 잊지 못하게 한 배.'
		),
		p(
			'He keeps his eyes on the water. Golhwa does not. Hyullé’s knees press together and then forget to. Narim looks at him the way a kind woman looks at a son who has grown without asking her.',
			'눈은 물에 둔다. 골화는 안 둔다. 혈레의 무릎이 붙었다가, 붙는 걸 잊는다. 나림은 허락 없이 커 버린 아들을 보는 착한 여인처럼 그를 본다.'
		),
		d(
			'golhwa',
			['야.', '천장 보지 마. 우리가 천장이야?', '그렇게 서 있으면 통이 아니라 네가 문제야.'],
			['Hey.', 'Stop looking at the ceiling. Are we the ceiling?', 'Stand like that and the bucket isn’t the problem. You are.'],
			{ chip: '#e0783a' }
		),
		d('yushin', ['통만 받겠소.'], ['Just the bucket.'], { chip: '#4a8fe0' }),
		d(
			'golhwa',
			['통.', '그 가슴으로 통.', '김씨는 다 그래. 예의를 물에 두고 와.'],
			['A bucket.', 'With that chest. A bucket.', 'Kims are all like this. Leave the manners in the water.'],
			{ chip: '#e0783a' }
		)
	]);

	// Bidam shirt-off in the Nakdong (Jeon, before the cavern)
	const bidamHits = find(jeon, 'riding the eastern hills');
	if (bidamHits.length !== 1) throw new Error(`bidam cavern ${bidamHits.length}`);
	bidamHits[0].list.splice(bidamHits[0].i, 0, ...[
		scene('The Nakdong · a night he still washes', '낙동강 · 아직 씻는 밤', { weather: 'night' }),
		p(
			'This is how he washes when the hill is not watching.',
			'언덕이 보지 않을 때, 그는 이렇게 씻는다.'
		),
		p(
			'Shirt off. Beads. The river. He wades to the ribs and recites until the count is honest. One hundred and eight. The Nakdong takes the heat out of a man if you let it. He lets it.',
			'저고리는 벗는다. 염주. 강. 갈비까지 걸어 들어가, 셈이 정직해질 때까지 왼다. 백팔. 낙동강은 사람을 식힌다. 맡기면. 그는 맡긴다.'
		),
		d(
			'bidam',
			[
				'색이 곧 공이요.',
				'공이 곧 색이다.',
				'백팔.',
				'…강아. 오늘은 네가 절이다.'
			],
			[
				'Form is emptiness.',
				'Emptiness is form.',
				'One hundred and eight.',
				'…River. Tonight you are the hall.'
			],
			{ chip: '#141C2E' }
		),
		p(
			'Nobody is on the bank. That is the point. A body built for a black robe, wet to the waist, mouth still shaping the sutra. He will try the same wash in a cave that does not want him. Not yet. Tonight the river wants him, and that is enough.',
			'둑에 아무도 없다. 그게 목적이다. 검은 도포를 위해 만들어진 몸, 허리까지 젖고, 입은 아직 경을 만든다. 같은 씻음을, 그를 원하지 않는 동굴에서 할 것이다. 아직은. 오늘 밤 강이 원하고, 그걸로 된다.'
		)
	]);

	// Gyebek training (Prince Euija, before the next-episode card)
	const lookHits = find(euija, 'Gyebek looks back, and up, at the royal seats.');
	if (lookHits.length !== 1) throw new Error(`gyebek look ${lookHits.length}`);
	lookHits[0].list.splice(lookHits[0].i + 1, 0, ...[
		{ kind: 'section', label: 'The Yard', ko: '마당' },
		scene('The Sabi yard · the years after the name', '사비 마당 · 이름 이후의 해', {
			weather: 'dusk',
			jump: { en: 'The Years After…', ko: '그 후의 해…', year: 636 }
		}),
		p('The eel boy is gone. What is left is counting.', '장어 소년은 없다. 남은 것은 셈이다.'),
		p(
			'He trains until the body is a number he can trust. Dawn. The post. The same cut, reverse, until the shoulder stops arguing. Euija comes some mornings and does not speak. That is a kindness. Words would be two orders at once.',
			'몸을 믿을 수 있는 숫자가 될 때까지 단련한다. 새벽. 말뚝. 같은 칼, 역수, 어깨가 토를 달지 않을 때까지. 의자는 어떤 아침엔 와서 말하지 않는다. 그게 친절이다. 말은 명령이 둘이 되니까.'
		),
		d('gyebek', ['하나 더.'], ['One more.'], { chip: '#d9b13a', look: 'training-early' }),
		p(
			'The first year he is still thin. You can see the river on him. The third year the river is gone. What stands on the packed earth is a chest, a waist, a back that will hold five thousand later and does not know it yet. He does not look at it. He looks at the count.',
			'첫해는 아직 야위다. 강이 보인다. 삼 년째엔 강이 없다. 다진 흙 위에 선 것은 가슴이고, 허리이고, 나중에 오천을 짊을 등이다. 아직은 모른다. 그는 그걸 보지 않는다. 셈을 본다.'
		),
		d(
			'euija',
			['그만해도 된다.', '몸이 이미 답을 했다.'],
			['You can stop.', 'The body already answered.'],
			{ chip: '#e08a2e' }
		),
		d('gyebek', ['아직입니다.', '숫자가 남았습니다.'], ['Not yet.', 'The number is still left.'], {
			chip: '#d9b13a',
			look: 'training'
		}),
		p(
			'Euija laughs once, into his fist, and leaves him the yard. A man is measured by his self-control. Gyebek is measured by the count. By the time the clans start calling him Turtle, the thin boy is a story, and the body is the one that will walk to the Yellow Mountain.',
			'의자가 주먹 안에서 한 번 웃고, 마당을 남겨 준다. 사내는 절제로 잰다. 계백은 셈으로 잰다. 가문들이 그를 자라 부르기 시작할 때, 야윈 아이는 이야기가 되고, 몸은 황산으로 걸어갈 그 몸이 된다.'
		)
	]);
});

console.log('patched King Micheon, The Cut, Jeon, Prince Euija');
