import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const story = JSON.parse(readFileSync(path, 'utf8'));

function find(entries, title) {
	for (const e of entries || []) {
		if (e.title === title) return e;
		const hit = find(e.entries, title) || find(e.chapters, title);
		if (hit) return hit;
	}
}
function walkTop(obj, title) {
	if (Array.isArray(obj)) return find(obj, title);
	for (const k of Object.keys(obj)) {
		if (Array.isArray(obj[k])) {
			const h = find(obj[k], title);
			if (h) return h;
		}
	}
}

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, lines, en, extra = {}) => ({ kind: 'dialogue', person, lines, en, ...extra });

const SD = { chip: '#E8552B' };
const YU = { chip: '#4a8fe0' };
const GH = { chip: '#e0783a' };
const NR = { chip: '#5fad6e' };
const HY = { chip: '#6ec4c9' };
const BD = { chip: '#7b5cd6' };
const AL = { chip: '#c9a24a' };
const CM = { chip: '#8b6bb0' };
const JP = { chip: '#6b5a3e' };

const forty = walkTop(story, 'Forty Fortresses');
if (!forty) throw new Error('Forty Fortresses not found');

const harmony = walkTop(story, 'Harmony Council');
if (!harmony) throw new Error('Harmony Council not found');

// --- Harmony Council: after Alchun leaves the six pieces ---
if (!harmony.blocks.some((b) => b.html?.includes('She sets the six pieces in a line'))) {
	const peonies = harmony.blocks.findIndex((b) => b.label === 'The Peonies');
	if (peonies < 0) throw new Error('The Peonies not found');
	harmony.blocks.splice(
		peonies,
		0,
		p(
			'He leaves the pieces in her hand. Nobody told him there was a box, and he is not going back for one.',
			'그는 패를 그녀의 손에 맡기고 간다. 담는 함이 있다는 걸 아무도 안 일러 줬고, 그는 그걸 찾으러 돌아가지 않는다.'
		),
		p(
			'She sets the six pieces in a line on the floor. She does not try the chair.',
			'그녀는 여섯 개의 패를 바닥에 한 줄로 놓는다. 자리는 앉아 보지 않는다.'
		),
		p(
			'She doesn’t sleep. The lamp does.',
			'그녀는 자지 않는다. 등잔은 잔다.'
		)
	);
	console.log('Harmony Council: dawn continuation added.');
} else {
	console.log('Harmony Council: dawn continuation already present.');
}

if (forty.blocks.some((b) => b.label === 'The Bucket')) {
	console.log('Forty Fortresses bucket scene already present; skip story splice.');
} else {
	const after = forty.blocks.findIndex(
		(b) => b.html === 'What reached Sabi had started a week earlier, in Surabol.'
	);
	if (after < 0) throw new Error('Surabol hinge not found');

	const insert = [
		{ kind: 'scene', label: 'The Window', ko: '창' },
		{
			kind: 'place',
			place: 'moon_palace',
			html: 'The map is still on the floor. Daeya is a hole in it.',
			ko: '지도는 아직 바닥에 있다. 대야는 그 안의 구멍이다.'
		},
		p(
			'She hasn’t slept. You can tell by the lamp. It has been dying since yesterday and nobody has trimmed it, because trimming it would mean the night is still going and she would rather the night be over.',
			'그녀는 자지 않았다. 등잔을 보면 안다. 어제부터 죽어 가는데 아무도 심지를 깎지 않았다. 깎으면 밤이 아직 남았다는 뜻이니까. 밤은 끝났으면 한다.'
		),
		p(
			'She did not send for him. He is in the room anyway. That is an old habit of his. Of hers, too, if we are being honest.',
			'그를 부르지 않았다. 그래도 그는 방에 있다. 그의 오래된 버릇이다. 솔직히 하면, 그녀의 버릇이기도 하다.'
		),
		d('sunduk', ['자네는 가도 돼.'], ['You can go.'], SD),
		d('yushin', ['못 갑니다, 폐하.'], ['I can’t, Majesty.'], YU),
		d('sunduk', ['대야 이후로 물이 안 넘어가네.', '밥도.'], ['Since Daeya I can’t get water down.', 'Rice neither.'], SD),
		d('yushin', ['……'], ['……'], YU),
		p(
			'She looks at the window. He looks at the door. Neither of them says the number. The number is on the floor, in forty little ink marks she has not swept up.',
			'그녀는 창을 본다. 그는 문을 본다. 둘 다 그 숫자를 말하지 않는다. 숫자는 바닥에 있다. 쓸어내지 않은 먹 점 마흔.'
		),
		p(
			'He bows and goes. She did not ask him to bring anything back.',
			'그는 절하고 나간다. 그녀는 뭘 가져와 달라고 하지 않았다.'
		),

		{ kind: 'scene', label: 'The Spring', ko: '샘' },
		{
			kind: 'place',
			place: 'steam_cavern',
			html: 'He does not take an escort. The hill does not like a crowd.',
			ko: '호위는 데려가지 않는다. 언덕은 무리를 싫어한다.'
		},
		p(
			'He undresses the way a man does when he is only fetching water. Fast. Clean-shaven. He kneels at the lip and does not get in.',
			'그는 물만 뜨러 온 사람처럼 옷을 벗는다. 빠르다. 수염은 밀어 두었다. 물가에 무릎을 꿇고, 들어가지는 않는다.'
		),
		d(
			'golhwa',
			['또 전쟁이야?', '이번엔 발도 안 담그고. 예의가 없네.'],
			['War again?', 'You’re not even getting in. Rude.'],
			GH
		),
		d('yushin', ['물 한 통만 받겠소.'], ['Just a bucket of water.'], YU),
		d(
			'golhwa',
			['통?', '우리가 우물이냐?', '…웃기지 마. 진짜로 통 가지고 왔구나.'],
			['A bucket?', 'Are we a well?', '…Don’t joke. You actually brought a pail.'],
			GH
		),
		d('narim', ['누구 거예요.'], ['Who’s it for.'], NR),
		p(
			'He does not say. Hyullé is already filling the pail from the lip. She does that. She is always the one who has started before anyone has agreed.',
			'그는 말하지 않는다. 혈레는 이미 물가에서 통을 채우고 있다. 늘 그렇다. 누가 허락하기도 전에 먼저 손을 움직이는 쪽이다.'
		),
		d(
			'golhwa',
			['여왕이지.', '김 씨도 아닌데. 규칙 있잖아.'],
			['The woman king.', 'She’s not even a Kim. We have a rule.'],
			GH
		),
		d('narim', ['물은 성씨를 안 물어요.'], ['The water doesn’t ask for a surname.'], NR),
		d('hyulle', ['…가져가세요.', '식기 전에요.'], ['…Take it.', 'Before it cools.'], HY),
		d(
			'narim',
			[
				'나중에 강가 성 하나 고르면요.',
				'벼랑을 믿는 쪽. 물이 지키는 쪽으로는 아무도 안 올라요.'
			],
			[
				'When you pick a river fort later.',
				'The side that trusts its cliff. Nobody climbs the side the water guards.'
			],
			NR
		),
		d(
			'golhwa',
			['버선만 신고 가. 장화는 울려.', '…그건 언덕이야. 나는 통 얘기 중이었는데.'],
			['Socks. Boots ring.', '…That was the hill. I was talking about the pail.'],
			GH
		),
		p(
			'He dresses with his back to them and takes the pail. The steam follows him as far as the door and then thinks better of it.',
			'그는 등을 돌려 옷을 입고 통을 든다. 김이 문까지 따라오다가, 생각을 고쳐먹는다.'
		),
		d(
			'golhwa',
			['김 씨한테 주는 물은 처음 봐.', '…잘 가. 통은 다시 가져와. 우리 거야.'],
			['First time I’ve seen this water leave for someone who isn’t a Kim.', '…Go on. Bring the pail back. It’s ours.'],
			GH
		),

		{ kind: 'scene', label: 'The Bucket', ko: '물통' },
		{
			kind: 'place',
			place: 'moon_palace',
			html: 'He sets it down. His cuffs are still wet.',
			ko: '그는 통을 내려놓는다. 소매 끝이 아직 젖어 있다.'
		},
		d('sunduk', ['이게 뭔가.'], ['What is this.'], SD),
		d('yushin', ['물입니다, 폐하.'], ['Water, Majesty.'], YU),
		d('sunduk', ['어디서.'], ['From where.'], SD),
		d('yushin', ['언덕입니다.'], ['The hill.'], YU),
		p(
			'She looks at him. He looks at the door. She cups the water in both hands and drinks. It is colder than well water, and it does not taste like home.',
			'그녀는 그를 본다. 그는 문을 본다. 그녀는 두 손으로 물을 떠서 마신다. 우물물보다 차갑고, 집 맛은 아니다.'
		),
		p(
			'The lamp does something. The map on the floor is the same map, and then it is not.',
			'등잔이 뭔가를 한다. 바닥의 지도는 같은 지도다. 그러고는 아니다.'
		),

		{
			kind: 'flashback',
			year: '600',
			title: 'the river on the table',
			blocks: [
				p(
					'A low table. A map. She is five, and her father’s finger is on a river.',
					'낮은 상. 지도. 그녀는 다섯이고, 아버지의 손가락이 강 하나에 얹혀 있다.'
				),
				p(
					'You’ve already met a girl who goes and does. This one stays in the room and moves the river.',
					'가서 하는 아이는 이미 만나 보셨을 것이다. 이 아이는 방에 앉아 강을 옮긴다.'
				),
				p(
					'She pushes his finger one valley over.',
					'그녀는 그의 손가락을 골짜기 하나만큼 밀어 낸다.'
				),
				d('jinpyung', ['그건 네 증조부님이 가져가신 거다.'], ['Your great-grandfather took that.'], JP),
				d('sunduk', ['아버진요.'], ['And you?'], SD),
				d('jinpyung', ['난 지켰지.', '잃어버리면 안 된다.'], ['I kept it.', 'Don’t lose it.'], JP),
				p(
					'She does not say she won’t. She puts her finger back where she had it.',
					'안 잃겠다고 하지 않는다. 손가락을 제자리에 다시 올려 둘 뿐이다.'
				)
			]
		},

		{
			kind: 'flashback',
			year: '602',
			title: 'the cake on the stream',
			blocks: [
				p(
					'The wedding is small, at the house by the stream. Only one other royal child comes.',
					'혼례는 개울가 집에서 조촐하다. 다른 왕실 아이는 딱 하나 온다.'
				),
				p(
					'You will sit through a louder wedding later, in a hall with a pink ribbon, and watch a different girl pick a different man. This one is quieter. The girl watching is seven. The choosing is the same.',
					'나중에 분홍 리본 달린 마루에서, 더 시끄러운 혼례를 앉아 보게 될 것이다. 다른 아이가 다른 사내를 고르는 자리. 여기는 더 조용하다. 보는 아이는 일곱이다. 고르는 일은 같다.'
				),
				p(
					'Dukman has brought a rice cake for the stream. She sets it on the water very seriously, and then she does not look at the water again.',
					'덕만은 개울 몫으로 떡을 하나 가져왔다. 아주 진지하게 물 위에 띄우고는, 다시는 물을 보지 않는다.'
				),
				p(
					'She watches her sister all night, as if she were learning a trade. In the doorway a man is talking to the stream. Nobody tells him to stop.',
					'밤새 언니를 본다. 무슨 기술이라도 배우는 사람처럼. 문간에서는 사내 하나가 개울하고 얘기를 하고 있다. 그만두라는 사람은 없다.'
				),
				d('chunmyung', ['배우는 거야, 덕만아.', '아니면 쳐다만 보는 거야.'], ['Are you learning, Dukman.', 'Or just staring.'], CM),
				d('sunduk', ['언니가 골랐잖아.'], ['You picked.'], SD),
				d('chunmyung', ['내가 골랐어.'], ['I did.'], CM),
				d('sunduk', ['……나도 고를 수 있어?'], ['……Can I pick too?'], SD),
				d(
					'chunmyung',
					['너는 고르면 안 되는 자리가 될 거야.', '그러니까 지금 잘 봐.'],
					['You’re going to be in a place where you don’t get to.', 'So watch now.'],
					CM
				),
				p(
					'She watches. She does not eat her cake. In the morning the stream has taken it, which she takes as an answer.',
					'그녀는 본다. 떡은 먹지 않는다. 아침이 되면 개울이 가져가 있다. 그녀는 그걸 대답으로 안다.'
				)
			]
		},

		{
			kind: 'flashback',
			year: '610',
			title: 'the yard',
			blocks: [
				p(
					'Fifteen. The Hwarang yard. Three of them on the sand, the way they will still be standing thirty winters from now: beads, a lunch, a form done correctly.',
					'열다섯. 화랑 마당. 모래 위에 셋. 서른 겨울이 지나도 그 자리에 그렇게 서 있을 셋이다. 염주, 도시락, 바른 품새.'
				),
				p(
					'She was only meant to watch. Another girl, later, will say she is not looking at the club.',
					'보기만 하러 왔다. 나중에 다른 아이는, 채는 안 본다고 할 것이다.'
				),
				d('bidam', ['공주께서 보고 계시오.', '오늘은 백아홉을 먼저 가져가겠소.'], ['The princess is watching.', 'I’ll take the hundred-and-ninth first today.'], BD),
				d('alchun', ['니 보는 게 아이라.', '임마.'], ['She isn’t looking at you.', 'Yah.'], AL),
				d('bidam', ['그럼 누굴—'], ['Then who—'], BD),
				p(
					'Yushin is in the middle of a form. He does not look at the stands. Then he does, half a breath too long, and the form has to start again.',
					'유신은 품새 한가운데다. 관중석을 보지 않는다. 그러다 본다. 반 호흡만큼 너무 길게. 품새를 다시 시작해야 한다.'
				),
				d('sunduk', ['점수는 안 봐.', '사람만.'], ['I’m not looking at the score.', 'Only him.'], SD),
				d('chunmyung', ['야.', '그런 말 하지 마.'], ['Hey.', 'Don’t say that.'], CM),
				d('sunduk', ['말했잖아.'], ['I said it.'], SD),
				p(
					'Bidam hears enough to bow toward the wrong seat. Alchun laughs into his lunch. Yushin starts the form again, correctly, and does not look up a second time.',
					'비담은 틀린 자리를 향해 절할 만큼은 듣는다. 알천은 도시락에 대고 웃는다. 유신은 품새를 다시, 바르게 시작하고, 두 번은 올려다보지 않는다.'
				)
			]
		},

		{
			kind: 'flashback',
			year: '620',
			title: 'the years',
			blocks: [
				p(
					'A lantern he sets down outside her door. He does not knock. In the morning the oil is gone and the lantern is still there.',
					'그가 그녀 문 밖에 등잔을 내려놓는다. 노크는 하지 않는다. 아침이 되면 기름은 없고 등잔은 그대로다.'
				),
				p(
					'A cup she poured. He leaves it. She drinks it cold, later, and tells no one it was his.',
					'그녀가 따른 잔. 그는 두고 간다. 그녀는 나중에 식은 걸 마시고, 누구의 잔이었는지는 말하지 않는다.'
				),
				p(
					'After a yard day his collar is crooked. She sees it. She says nothing. She will say it one day, when saying it is safer than the other sentence.',
					'마당이 끝난 뒤 그의 깃이 삐뚤다. 그녀는 본다. 말은 안 한다. 다른 문장보다 그게 안전해지는 날에야 말할 것이다.'
				),
				p(
					'Neither of them is the girl at the match. Neither of them is the man with the club. They keep their hands. That is also a way of picking.',
					'둘 다 시합장의 그 아이가 아니다. 둘 다 채를 든 그 사내가 아니다. 손을 접어 둔다. 그것도 고르는 일이다.'
				)
			]
		},

		{
			kind: 'flashback',
			year: '632',
			title: 'the six pieces',
			blocks: [
				p(
					'The night they vote, she is already dressed. White silk, folded twice, unfolded, folded again. She sits on the empty mat to see how it feels. She hates that she sat.',
					'그들이 패를 놓던 밤, 그녀는 이미 옷을 입었다. 흰 비단. 두 번 접고, 펴고, 다시 접는다. 빈 자리에 앉아 본다. 어떤 자리인지. 앉은 게 싫다.'
				),
				p(
					'She hears the pieces before he knocks. Six of them, clicking in a fist. Nobody told him there was a box.',
					'노크보다 패 소리가 먼저다. 주먹 안에서 여섯이 부딪친다. 담는 함이 있다는 걸 아무도 안 일러 준 사람이다.'
				),
				p(
					'She opens before he knocks. You have already stood in this doorway, from the other side.',
					'노크보다 먼저 문을 연다. 이 문간에는, 반대편에서, 이미 서 보셨을 것이다.'
				),
				d('sunduk', ['여섯 다?'], ['All six?'], SD),
				d(
					'alchun',
					['여섯 다요, 공주님.', '불 꺼질 때까지 걸렸소.', '말이 많을 끼요.'],
					['All six, Princess.', 'Took till the fire went out.', 'There’ll be talk.'],
					AL
				),
				d(
					'sunduk',
					['증조부님 말이제. 즉위식마다 하는 소리다.', '……네 산에 비석 넷. 그리고 이제 나.'],
					['My great-grandfather. They say that at every crowning.', '……Four stones on four mountains. And now me.'],
					SD
				),
				p(
					'He leaves the pieces in her hand. She sets them in a line on the floor, the way a girl once lined up a rice cake on a stream. She does not try the chair.',
					'그는 패를 그녀의 손에 맡기고 간다. 그녀는 여섯을 바닥에 한 줄로 놓는다. 언젠가 개울 위에 떡을 놓던 그 손으로. 자리는 앉아 보지 않는다.'
				),
				p(
					'She doesn’t sleep. The lamp does. In the morning they will put a name on her that is not Dukman.',
					'그녀는 자지 않는다. 등잔은 잔다. 아침이 되면 덕만이 아닌 이름을 얹을 것이다.'
				)
			]
		},

		p(
			'The water is still cold. She sets the pail down. The map on the floor is the map again, and Daeya is still a hole in it.',
			'물은 아직 차다. 그녀는 통을 내려놓는다. 바닥의 지도는 다시 지도고, 대야는 여전히 구멍이다.'
		),
		p(
			'She looks at it the way a child looked at a river. Then she looks at him.',
			'아이가 강을 보던 눈으로 그걸 본다. 그리고 그를 본다.'
		)
	];

	forty.blocks.splice(after + 1, 0, ...insert);
	console.log(`Forty Fortresses: inserted ${insert.length} blocks after Surabol hinge.`);

	const hill = forty.blocks.findIndex((b) => b.label === 'The Hill');
	const river = forty.blocks.findIndex((b) => b.label === 'The River Fort');
	if (hill < 0 || river < 0 || river <= hill) throw new Error('Hill / River Fort splice failed');
	const removed = forty.blocks.splice(hill, river - hill);
	console.log(`Forty Fortresses: removed ${removed.length} Hill-cavern blocks.`);
}

const steam = (forty.images || []).find((i) => i.id === 'steam_05');
if (steam) {
	steam.at = 'He undresses the way a man does when he is only fetching water';
	console.log('Re-anchored steam_05.');
}

writeFileSync(path, JSON.stringify(story, null, '\t') + '\n');
console.log('Wrote story.json');
