/** Naturalistic mouths throughout King Micheon; keep the Sagi lines inside real talk. */
import { editStory, find, makeInserter } from './story-ops.mjs';

function d(person, lines, en, extra = {}) {
	return { kind: 'dialogue', person, lines, en, ...extra };
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function speaker(name, gender, chip, lines, en) {
	return { kind: 'dialogue', speaker: name, gender, chip, lines, en };
}

function setTalk(entry, fragment, lines, en, extra = {}) {
	const hits = find(entry, fragment, (b) => b.kind === 'dialogue' && (!extra.who || b.person === extra.who));
	if (hits.length !== 1) throw new Error(`talk ${fragment}: ${hits.length}`);
	const { who, ...rest } = extra;
	Object.assign(hits[0].b, { lines, en, ...rest });
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('missing');
	const ins = makeInserter(mich);

	/* Banquet — brothers overlapping, king dry */
	setTalk(mich, '형. 앉으시오.', ['형. 앉어.', '왜 그래, 문 쪽에. 앉아. 기다렸잖아.'], ['Hyung. Sit.', 'What, the door? Sit. We waited.']);
	setTalk(mich, '술은 좋은 거요.', ['술, 좋은 거야.', '아바지가 숨겨 둔 거. 형만 주려고.'], ['The wine’s the good stuff.', 'Father hid it. For you.']);
	setTalk(mich, '불렀으니, 왔소.', ['불렀길래 왔지.', '앉아, 그래. 먼저 한잔.'], ['You called, I came.', 'Sit, sit. You first.']);
	setTalk(
		mich,
		'오늘은… 형한테 할 말이 있어서.',
		['형.', '오늘은— 아니, 잔부터.', '할 말이… 있어. 형한테.'],
		['Hyung.', 'Today— no. Drink first.', 'I had something. For you.']
	);
	setTalk(mich, '하지 마.', ['하지 마.', '잔이나 들어.'], ['Don’t.', 'Just take the cup.'], { who: 'suchun' });
	setTalk(
		mich,
		'형, 이건— 우린 그냥—',
		['잠깐— 형.', '이건 오해야. 우린 그냥— 술, 술 마시자고—'],
		['Wait— hyung.', 'This is a mistake. We were just— wine, we said wine—']
	);
	setTalk(
		mich,
		'앉으라 한 자리에 앉지 않는다.',
		['불렀으니까 온 거야.', '앉으라 해서 앉진 않아.', '끌어내. 둘 다.'],
		['You invited me. That’s on you.', 'I don’t sit where I’m told.', 'Take them. Both.']
	);

	/* Market buyer — grocer, not a historian */
	setTalk(
		mich,
		'여기 세금이 더 독해.',
		['여기 세금이 더 독해. 손목에 매긴다니까.', '북쪽은 지붕 올린다며. 여기는 성만 먹고.', '한 되요. 덜 주지 말고.'],
		['Tax is worse here. They put it on the wrist.', 'They say the north is putting up a roof. Down here the fortress just eats.', 'One measure. Don’t short me.']
	);
	ins(
		'소금이나 받아.',
		[
			speaker(
				'A woman at the next stall',
				'f',
				'#8a7060',
				['야, 감. 그 아이 놔 줘.', '한 입 베었잖아, 그걸로  suff— 됐어. 줘.'],
				['Hey. The persimmon. Let him go.', 'He took a bite. That’s— fine. Give it.']
			)
		]
	);
	const persim = find(mich, '그걸로  suff', (b) => b.kind === 'dialogue');
	if (persim.length === 1) {
		persim[0].b.lines = ['야, 감. 그 아이 놔 줘.', '한 입 베었잖아. 됐어. 줘.'];
		persim[0].b.en = ['Hey. The persimmon. Let him go.', 'He took a bite. Fine. Give it.'];
	}

	/* Dalga — not a thesis */
	setTalk(
		mich,
		'백성이 숙부 이름을 먼저 부른다며.',
		['숙부.', '마당에서 듣는데. 사람들, 숙부 이름을 먼저 부르더라고.', '내 이름은 나중에.'],
		['Uncle.', 'I was in the yard. They say your name first.', 'Mine comes after.']
	);
	setTalk(
		mich,
		'이름은 벽에 남는 겁니다.',
		['전하. 숙신 막은 건 제가 한 일이죠.', '이름은… 벽에 남는 겁니다. 그게 다예요. 신경 쓰지 마십시오.'],
		['Majesty. I held the Suksin, that’s all.', 'A name stays on a wall. That’s all it does. Don’t mind it.']
	);
	setTalk(
		mich,
		'벽에 남는 이름이 문제야.',
		['벽에 남는 게 문제야.', '내일 복도. 짧게 하자. 사람들 앞에서 말고.'],
		['The wall is the problem.', 'Corridor tomorrow. Keep it short. Not in front of them.']
	);
	ins('…예.', [
		d(
			'dalga',
			['전하. 내일은— 병부터 보고 와도 됩니까.', '북쪽 담이 또 기울어서.'],
			['Majesty. Tomorrow, can I check the wall first.', 'The north stretch is leaning again.'],
			{ chip: '#7a2e2e' }
		),
		d('bongsang', ['복도.', '병 이야기는 하지 마.'], ['The corridor.', 'Don’t talk to me about walls.'], {
			chip: '#6e2a2a'
		})
	]);

	/* Wine room — a minister at the door, not a caption */
	setTalk(
		mich,
		'간할 거면 내일.',
		['문 열지 마.', '누구야. 창조리면 내일.', '내일은 없다. 알아들었어?'],
		['Don’t open it.', 'Who is that. If it’s Changjori, tomorrow.', 'There is no tomorrow. You hear me?']
	);

	/* Remonstrance — interrupt, then the Sagi laugh */
	setTalk(
		mich,
		'하늘이 두 번 쳤습니다.',
		['전하. 오늘 구렁에서 아이를 봤습니다.', '할아버지 손을 잡고 있더군요. 놓으면 안 된다고.', '곳간은— 바닥입니다. 제가 봤습니다.'],
		['Majesty. I saw a child in a ditch today.', 'Holding his grandfather’s hand. Wouldn’t let go.', 'The granary— I looked. It’s the floor.']
	);
	setTalk(
		mich,
		'임금은 백성이 우러러보는 자리다.',
		['그래서? 내가 구렁에 내려가?', '임금은 올려다보는 자리다. 궁이 초라하면 뭘 봐.'],
		['So I should climb into the ditch.', 'A king is what they look up at. If the palace is shabby, they look at what.']
	);
	setTalk(
		mich,
		'구렁에서 올려다보고 있습니다',
		['구렁에서 올려다보고 있습니다.', '열다섯 넘는 놈들 다 비계에 올려 놓으셨잖아요.', '이웃이 옵니다. 비면 와요. 전하—'],
		['They’re looking up from a ditch.', 'You put everyone over fifteen on those scaffolds.', 'The neighbour will come. If we’re empty, they come. Majesty—']
	);
	setTalk(
		mich,
		'과인을 비방해서',
		['그만.', '국상은 지금 나 욕해서 백성 칭찬 받으려는 거지.'],
		['Stop.', 'You’re talking me down so they’ll like you.']
	);
	setTalk(
		mich,
		'그게 인이 아닙니다.',
		['아니— 잠깐. 듣습니까.', '백성을 안 불쌍히 여기면 인이 아니고요. 내가  reciting— 아닙니다.', '이 자리에 앉았으니까 말하는 겁니다. 칭찬은 됐어요.'],
		['No— wait. Are you listening.', 'If you don’t pity them that isn’t kindness. I’m not— reciting.', 'I sit in this chair, so I have to say it. I don’t want their praise.']
	);
	const reciting = find(mich, '내가  reciting', (b) => b.kind === 'dialogue');
	if (reciting.length === 1) {
		reciting[0].b.lines = [
			'아니— 잠깐. 듣습니까.',
			'백성을 안 불쌍히 여기면 인이 아닙니다. 신하가 입 다물면 충이 아니고요.',
			'이 자리에 앉았으니까 말하는 겁니다. 칭찬은 됐어요.'
		];
		reciting[0].b.en = [
			'No— wait. Are you listening.',
			'If you don’t pity them that isn’t kindness. If I shut up that isn’t loyalty.',
			'I sit in this chair, so I have to say it. I don’t want their praise.'
		];
	}
	setTalk(
		mich,
		'백성을 위하여 죽고자 하는가.',
		['하.', '국상은 백성 때문에 죽고 싶어?', '다시 말하지 마. 웃기니까.'],
		['Ha.', 'Would the prime minister like to die for the people?', 'Don’t say it again. It’s funny.']
	);

	/* Send the scouts — a conversation */
	setTalk(
		mich,
		'산과 들을 보시오.',
		['조불. 소우.', '비류 쪽이오. 소금 파는 애.', '돌고 아들. 살아 있으면.', '찾으면 나한테 오라 하시오. 내가 내려가오.'],
		['Jobul. Sou.', 'Biryu side. A boy selling salt.', 'Dolgo’s son. If he’s alive.', 'You find him, you send for me. I come down.']
	);
	ins('내가 내려가오.', [
		d('jobul', ['국상께서… 직접 가십니까.', '진흙인데.'], ['You’re going yourself.', 'It’s mud.'], { chip: '#7a7068' }),
		d(
			'changjori',
			['내가  Kneel— 내가 갈 거요.', '짧게 하지 마시오. 짧은 말은 못 참겠소.'],
			['I’ll— I’m going.', 'Don’t make it short. I can’t bear a short version.'],
			{ chip: '#8a7048' }
		)
	]);
	const kneeltypo = find(mich, 'Kneel—', (b) => b.kind === 'dialogue');
	if (kneeltypo.length === 1) {
		kneeltypo[0].b.lines = ['내가 갈 거요.', '짧게 하지 마시오. 짧은 말은 못 참겠소.'];
		kneeltypo[0].b.en = ['I’m going.', 'Don’t make it short. I can’t bear a short version.'];
	}

	/* Riverbank — keep Ulbul’s Sagi line; loosen the rest */
	setTalk(mich, '을불 도련님.', ['을불… 도련님?', '저입니다. 소우. 기억— 나실라.'], ['Eulbul… master?', 'It’s me. Sou. You won’t— it’s all right.']);
	setTalk(
		mich,
		'소금값이면 말하시오.',
		['소금값이면 말하시오.', '도련님은 죽었소. 그 이름, 강에서 팔지 않소.'],
		['If it’s the price of salt, say so.', 'That boy’s dead. I don’t sell that name on this river.']
	);
	setTalk(
		mich,
		'개구리보다 작으셨습니다.',
		['돌고 아드님 맞습니다. 궁에서 봤어요.', '그때 개구리보다 작으셨죠. 미안합니다. 그 말.', '걸음은 그대로예요. 손도.'],
		['You’re Dolgo’s son. I saw you in the palace.', 'You were smaller than a frog. Sorry. That.', 'The walk is the same. The hands too.']
	);
	/* KEEP Sagi line exactly */
	setTalk(
		mich,
		'나는 야인이지 왕손이 아닙니다.',
		['나는 야인이지 왕손이 아닙니다.', '다시 자세히 살펴보십시오.'],
		['I am a man of the fields, not a king’s grandson.', 'Look again, carefully.']
	);
	setTalk(
		mich,
		'그래서 국상을 모셔 왔습니다.',
		['다시 봤습니다.', '그래서… 국상을 모셔 왔습니다. 저기, 둑 위.'],
		['We looked again.', 'That’s why we brought him. Up there. On the bank.']
	);
	setTalk(
		mich,
		'일어나 주십시오.',
		['전하.', '아닙니다. 그 말은 이릅니다.', '을불.', '일어나— 아니. 제가 이러고 있을게요. 진흙 괜찮습니다.'],
		['Majesty.', 'No. Too early for that word.', 'Eulbul.', 'Stand— no. I’ll stay. The mud’s fine.']
	);
	setTalk(
		mich,
		'진흙이오. 궁 비단이오.',
		['일어나지 마시오.', '그 비단, 버리는 거요. 진흙이오.', '나는 야인이오. 방금 말했소.'],
		['Don’t get up.', 'That silk’s ruined. That’s mud.', 'I’m a man of the fields. I just said.']
	);
	setTalk(
		mich,
		'왕손이면 오십시오.',
		[
			'그래서 왔습니다.',
			'임금은 지붕을 올려요. 나라는 구렁에 있고.',
			'왕손이면 오세요. 아니면— 사람이면 오세요.',
			'반역자 만들러 온 거 아닙니다. 왕 찾으러 온 겁니다.',
			'제발. 무릎 아프니까. 농담이 아니라.'
		],
		[
			'That’s why I came.',
			'The king is putting up a roof. The country’s in a ditch.',
			'If you’re the grandson, come. If you’re just a person, come anyway.',
			'I didn’t come to make a traitor. I came to find a king.',
			'Please. My knees hurt. That’s not a joke.'
		]
	);
	setTalk(
		mich,
		'신발값은 받으셨소.',
		['…신발값은 받으셨소.', '아니. 됐어.', '배, 두고 가겠소.', '재모한테는… 내일 오라 하거라. 이번엔 진짜로.'],
		['…Did they get the price of the shoe.', 'No. Never mind.', 'I’ll leave the boat.', 'Tell Jaemo… come tomorrow. Tomorrow for real.']
	);

	ins('나도 무서우니까.', [
		d(
			'micheon',
			['국상.', '무릎, 아직 괜찮소.', '나는— 지붕은 못 지어요. 그거 아시오.'],
			['Prime minister.', 'Your knees. Still all right.', 'I— I can’t build a roof. You know that.'],
			{ chip: '#C30000', look: 'exile' }
		)
	]);
	setTalk(mich, '저는 지붕을 지을 줄 모릅니다.', ['지붕은 못 지어요.', '소금은 돼요.'], ['I can’t build a roof.', 'Salt I can do.']);
	setTalk(
		mich,
		'지붕은 이미 너무 많습니다.',
		['그래서 모신 거요.', '지붕은 이미 많아요.', '당신은 세는 사람 아니오. 두 번 세잖아요.'],
		['That’s why I sent for you.', 'We already have too much roof.', 'You’re a man who counts. You count twice.']
	);

	/* Hunt — Sagi signal stays; add mutter around it */
	ins('나를 따라 하라.', [
		speaker('A minister', 'm', '#7a6a58', ['국상. 그거… 갈대요?', '지금요?'], ['Prime minister. That’s… a reed?', 'Now?']),
		d('changjori', ['지금이오.', '꽂으시오. 아니면 내려가시오.'], ['Now.', 'Put it in. Or walk down.'], { chip: '#8a7048' })
	]);
	setTalk(mich, '네 모자가 우습구나.', ['창조리.', '그 모자. 우습구나.', '다 우습네. 왜 그래.'], [
		'Changjori.',
		'That hat. It’s ridiculous.',
		'You’re all ridiculous. What is this.'
	]);
	setTalk(mich, '다들 같은 농담을 했습니다', ['다들 같은 농담을 했습니다.', '전하. 내려가시죠. 별실이 따뜻합니다.'], [
		'They all made the same joke.',
		'Majesty. Come down. The side room is warm.'
	]);
	setTalk(
		mich,
		'소금이나 팔라고 해 둬라.',
		['내 아우, 아들 있었지.', '그 애한테 소금이나 팔라 그래.', '왕 노릇은… 지붕 볼 줄 아는 사람이 하는 거야.'],
		['My brother had a son.', 'Tell him to keep selling salt.', 'Kingship is… for a man who knows how to look at a roof.']
	);
	ins('그래서 모셨습니다.', [
		d('bongsang', ['…아들.', '따라와. 문 앞에서 서 있어.'], ['…Boys.', 'Come with me. Stand by the door.'], {
			chip: '#6e2a2a'
		}),
		p(
			'He laughs once, the way he laughed at Changjori, and it does not come out right. The soldiers do not draw. They just walk.',
			'창조리에게 웃던 대로 한 번 웃는데, 제대로 안 나온다. 병사들은 칼을 빼지 않는다. 걷기만 한다.'
		)
	]);

	/* Side room talk */
	ins('제 띠를 쓴 사내의 얼굴을', [
		d(
			'bongsang',
			['문 열지 마.', '너희는 앉아.', '나는— 잠깐만. 잠깐.'],
			['Don’t open the door.', 'You two sit.', 'I— just a minute. A minute.'],
			{ chip: '#6e2a2a' }
		)
	]);

	/* Crown */
	setTalk(mich, '받으십시오.', ['받으십시오.', '무겁죠. 무거워야죠.', '두 번 세십시오. 습관대로.'], [
		'Take it.',
		'It’s heavy. It should be.',
		'Count it twice. Like you do.'
	]);
	setTalk(mich, '급하면 손이 떨리니까.', ['하나씩이오.', '급하면… 손이 떨리니까.', '국상. 일어나요. 또 무릎이오.'], [
		'One at a time.',
		'If you hurry… the hand shakes.',
		'Prime minister. Up. Your knees again.'
	]);

	/* Campaigns — add talk */
	ins('두 번째가 맞다.', [
		d(
			'changjori',
			['전하. 여덟…  cop— 많이 잡아 왔습니다.', '세지 말고 먼저 드시죠.'],
			['Majesty. We brought a lot back.', 'Don’t count. Eat first.'],
			{ chip: '#8a7048' }
		),
		d(
			'micheon',
			['세야죠.', '가마니도 셌소. 이건 가마니가 아니오.', '여기는 끝이 아니오. 길이오.'],
			['I count.', 'I counted sacks. These aren’t sacks.', 'This isn’t the end. It’s a road.'],
			{ chip: '#C30000', look: 'king' }
		)
	]);
	const cop = find(mich, '여덟…  cop', (b) => b.kind === 'dialogue');
	if (cop.length === 1) {
		cop[0].b.lines = ['전하. 많이 잡아 왔습니다.', '세지 말고 먼저 드시죠.'];
		cop[0].b.en = ['Majesty. We brought a lot back.', 'Don’t count. Eat first.'];
	}

	ins('종이가 갈 곳이 없어진다.', [
		d(
			'micheon',
			['편지, 이제 헤엄쳐야 해요.', '헤엄 못 하면 그만이고.'],
			['The letters have to swim now.', 'If they can’t swim, that’s that.'],
			{ chip: '#C30000', look: 'king' }
		),
		d('changjori', ['전하. 남쪽이 남았습니다.', '그 성. 삿갓으로 보시던.'], ['Majesty. The south is still there.', 'That fortress. The one you looked at from under the hat.'], {
			chip: '#8a7048'
		}),
		d('micheon', ['알아요.', '급하지 않아요.', '손이 떨리거든요.'], ['I know.', 'I’m not in a hurry.', 'The hand shakes.'], {
			chip: '#C30000',
			look: 'king'
		})
	]);

	/* Zhang Tong — more human */
	setTalk(
		mich,
		'황제는 답을 하지 않습니다.',
		['이 인장, 진 황제 겁니다.', '황제는… 답을 안 합니다. 삼 년째요.', '왕도 아시죠. 안 오는 답.'],
		['This seal is the Jin emperor’s.', 'He doesn’t answer. Three years.', 'You know that kind of silence.']
	);
	setTalk(
		mich,
		'더 아팠소.',
		['저도 답 못 받아 봤소.', '제 건 더 짧았소.', '더 아팠고.'],
		['I’ve gone without an answer.', 'Mine was shorter.', 'Hurt more, too.']
	);
	setTalk(
		mich,
		'성 안의 사람들은 제 백성입니다.',
		['성 안 사람들, 제 백성입니다.', '걷게 해 주시오. 서쪽 기마가 받아요.', '남는 사람은 가게 지키게. 안 태울 거요. 왕도 그러지 마시오. 부탁이오.'],
		['The people in this city are mine.', 'Let them walk. The horsemen west will take them.', 'Let the ones who stay keep their shops. I won’t burn them. Don’t you either. Please.']
	);
	setTalk(
		mich,
		'소금값은 오늘이고.',
		['걷는 사람은 걷소.', '남는 사람은 내 사람이오.', '세금은 내일. 소금값은 오늘. 오늘은 그걸로 합시다.'],
		['Whoever wants to walk, walks.', 'Whoever stays is mine.', 'Tax tomorrow. Salt today. That’s enough for today.']
	);

	/* Closing — soliloquy becomes talk with Jaemo, then a quieter last line */
	setTalk(
		mich,
		'조선이 떨어지고',
		['사백 년.', '조선이 떨어지고 그들이 이 강에 앉았지.', '나는 마지막 성 밑에서 소금 팔았고.', '오늘… 삼한에 그 성 없어.', '……소금장수요.'],
		['Four hundred years.', 'Joseon fell, and they sat on this river.', 'I sold salt under the last one.', 'Tonight… there isn’t a Chinese city left in Samhan.', '……Just a salt merchant.']
	);
	ins('꽉 채워.', [
		d(
			'jaemo',
			['야. 어디 가.', '되 놓고 가네.', '혼잣말이야, 또.'],
			['Hey. Where are you going.', 'You left the measure.', 'Talking to yourself again.'],
			{ chip: '#c4a574' }
		),
		d('micheon', ['강.', '잠깐.'], ['The river.', 'A minute.'], { chip: '#C30000', look: 'king' })
	]);
	ins('성을 올려다본다. 이번엔 웃는다.', [
		d('jaemo', ['들었어.', '소금장수.', '그거, 내일도 해도 돼.'], ['I heard that.', 'Salt merchant.', 'You can say that tomorrow too.'], {
			chip: '#c4a574'
		}),
		d('micheon', ['내일.', '세 번 세면 돼.'], ['Tomorrow.', 'I’ll count three times.'], { chip: '#C30000', look: 'king' })
	]);

	/* Famine scaffolds — workers */
	ins('지붕을 갈아라. 열다섯이 넘으면 다 나와.', [
		speaker('A man on the scaffold', 'm', '#6b5344', ['형. 손 놔. 나무 떨어져.', '밥, 언제 와. 밥이 와야 지붕이지.'], [
			'Hyung. Let go. The beam’s going.',
			'When’s the rice. You need rice to put up a roof.'
		]),
		speaker('Another', 'm', '#7a6550', ['오지 않아.', '우러러보라잖아. 올려다보면 배 안 고프대.'], [
			'It isn’t coming.',
			'They said look up. Looking up fills you, apparently.'
		])
	]);

	return { ok: true };
});
