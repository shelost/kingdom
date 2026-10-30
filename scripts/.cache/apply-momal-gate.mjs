import { editStory } from './story-ops.mjs';

editStory((story) => {
	const e = story.flatMap((c) => c.entries ?? []).find((x) => x.title === 'Momal');
	if (!e) throw new Error('Momal not found');
	const B = e.blocks;

	const find = (pred, label) => {
		const i = B.findIndex(pred);
		if (i < 0) throw new Error('missing ' + label);
		return i;
	};

	// Reattach chase stills onto the gate-fight lines (same words, new place).
	const reattach = {
		'momal-dodge': 'One rider does come down. Spear first',
		'momal-pommel': 'The ring-pommel comes out only long enough to knock the spear aside'
	};
	for (const im of e.images ?? []) {
		if (reattach[im.id]) im.at = reattach[im.id];
	}

	// 1. Court-record quote after the private "I'll go".
	const iGo = find((b) => b.kind === 'dialogue' && b.person === 'jesang' && b.en?.[0] === 'I’ll go.', 'go');
	B.splice(iGo + 1, 0, {
		kind: 'quote',
		html: 'Though I am foolish and of no account, how dare I not receive the command with care?',
		ko: '신이 비록 어리석고 못났으나 감히 명을 삼가 받들지 않을 수 있겠습니까?',
		hanja: '臣雖愚不肖，敢不惟命是從。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'jesang',
		event: 'jesang-accepts',
		stance: 'agree',
		claim: 'Park Jesang accepted the order to fetch the brothers.',
		claimKo: '박제상이 아우를 데려오라는 명을 받았다.'
	});

	// 2. After Jangsu grants, they meet Bohae and ride for the gate.
	const iGrant = find((b) => b.kind === 'dialogue' && b.person === 'jangsu' && b.en?.[0] === 'A well-made ask is still an ask.', 'grant');
	B.splice(iGrant + 1, 0, {
		kind: 'quote',
		html: 'The king said, “Good,” and permitted them to go home together.',
		ko: '왕이 말하기를, “좋다”라고 말하고, 함께 돌아가는 것을 허락하였다.',
		hanja: '王曰，善。許與同歸。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'jangsu',
		event: 'jangsu-grants',
		stance: 'agree',
		claim: 'Jangsu let Bohae leave as a guest.',
		claimKo: '장수가 보해를 손님으로 돌려보냈다.'
	});

	const iStairs = find((b) => b.kind === 'p' && b.html?.startsWith('They are already on the stairs'), 'stairs');
	B.splice(iStairs, 0, {
		kind: 'p',
		html: 'They go down the stairs before the hall can change its mind. Bohae is in a side court, already on a horse that is not his.',
		ko: '대청이 마음을 바꾸기 전에 계단을 내려간다. 보해는 곁마당에 있다. 제 것이 아닌 말 위에 이미 있다.'
	}, {
		kind: 'dialogue',
		person: 'bokho',
		en: ['You came.', 'They said I could leave.', 'I— I already saddled.'],
		lines: ['왔소.', '가도 된다 했소.', '나— 이미 안장을 얹었소.']
	}, {
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then ride.', 'Don’t thank the hall yet.'],
		lines: ['그럼 타시오.', '대청에 아직 감사하지 마시오.']
	});

	// 3. Gate-rush scene between two-fingers and East Ford.
	const iFord = find((b) => b.kind === 'scene' && b.label === 'The East Ford', 'east ford');
	B.splice(iFord, 0, {
		kind: 'scene',
		label: 'The Red Gate',
		ko: '붉은 문'
	}, {
		kind: 'p',
		html: 'The seongmun is still open. Two horses. Magenta and lilac. The packed earth of the yard is a short road if you do not stop.',
		ko: '성문은 아직 열려 있다. 말 둘. 자줏빛과 보라. 마당 다진 흙은, 서지 않으면, 짧은 길이다.'
	}, {
		kind: 'p',
		html: 'Then the timber leaves begin to move. Iron bosses catch the lamp. The gap is a mouth closing.',
		ko: '그때 나무 문짝이 움직이기 시작한다. 쇠 못이 등불을 받는다. 틈이 다무는 입이다.'
	}, {
		kind: 'dialogue',
		person: 'bokho',
		en: ['The gate—', 'They’re shutting it—'],
		lines: ['문—', '닫고 있소—']
	}, {
		kind: 'dialogue',
		person: 'jesang',
		en: ['I see it.', 'Go.'],
		lines: ['보이오.', '가오.']
	}, {
		kind: 'p',
		html: 'They put the horses at the gap. A guard steps into the road with a spear. Momal does not slow. The shoulder of the horse is the answer.',
		ko: '말을 그 틈으로 몬다. 창을 든 군사가 길에 선다. 모말은 안 늦춘다. 말 어깨가 답이다.'
	}, {
		kind: 'p',
		html: 'One rider does come down. Spear first. Momal turns the horse into the man’s shoulder and the grass takes him.',
		ko: '기병 하나가 내려온다. 창이 먼저다. 모말이 말을 그 어깨로 돌린다. 풀이 받는다.'
	}, {
		kind: 'p',
		html: 'A second tries the other flank. The ring-pommel comes out only long enough to knock the spear aside. He does not stay to finish.',
		ko: '둘째가 다른 옆을 노린다. 환두가 나와, 창을 밀어낼 만큼만 나온다. 끝내려고 서지 않는다.'
	}, {
		kind: 'p',
		html: 'Bohae’s horse hits a man who will not move. The man moves. The gap is a slit. They go through it the way a stolen boat goes through a rope.',
		ko: '보해의 말이, 안 비키는 사람을 받는다. 그 사람이 비킨다. 틈이 실밥이다. 훔친 배가 밧줄을 빠져나가듯, 그 사이로 나간다.'
	}, {
		kind: 'p',
		html: 'The leaves meet behind them. The sound is a hall changing its mind.',
		ko: '등 뒤에서 문짝이 맞닿는다. 대청이 마음을 바꾸는 소리다.'
	});

	// Drop the old ridge-fight copies (same two p blocks later in East Ford).
	const iFordNow = B.findIndex((b) => b.kind === 'scene' && b.label === 'The East Ford');
	const iOldDodge = B.findIndex(
		(b, i) => i > iFordNow && b.kind === 'p' && b.html?.startsWith('One rider does come down')
	);
	if (iOldDodge >= 0) {
		const next = B[iOldDodge + 1];
		const n = next?.kind === 'p' && next.html?.startsWith('A second tries the other flank') ? 2 : 1;
		B.splice(iOldDodge, n);
	}

	// 4. Moon Palace: celebration, then one-eye / one-arm, then words vs Wa.
	const iHold = find((b) => b.kind === 'p' && b.html?.startsWith('They stay like that longer than a court allows'), 'hold');
	const iOther = find((b) => b.kind === 'dialogue' && b.person === 'nulji' && b.en?.[0] === 'Well.', 'other');
	if (iOther !== iHold + 1) {
		// still splice after hold; then remove Well.
	}
	B.splice(iHold + 1, 0, {
		kind: 'p',
		html: 'Then the yard remembers it is allowed to be loud. A maid drops a cup and laughs at the mess. An officer shouts a name that used to be a hostage. Wine finds bowls that were empty last week.',
		ko: '그다음 마당이, 시끄러워도 된다고 기억한다. 계집종이 잔을 떨어뜨리고 그 난장에 웃는다. 장수가 볼모였던 이름을 부른다. 지난주엔 비어 있던 그릇에 술이 든다.'
	}, {
		kind: 'dialogue',
		speaker: 'A maid in the yard',
		gender: 'f',
		en: ['He’s back.', 'The purple one is back.', 'Look at the king— he’s— he’s smiling—'],
		lines: ['돌아왔어.', '보라 그이가 돌아왔어.', '임금 봐— 웃— 웃잖아—']
	}, {
		kind: 'dialogue',
		speaker: 'An officer',
		gender: 'm',
		en: ['Don’t stare.', 'Stare.', 'I haven’t seen that face in years.'],
		lines: ['보지 마.', '봐.', '그 얼굴, 몇 년 만이다.']
	}, {
		kind: 'p',
		html: 'Bohae laughs once, surprised at his own mouth. Nulji still has a hand on the back of his neck. For a whole cup, the hall is a country again.',
		ko: '보해가 한 번 웃는다. 제 입이 놀라서. 눌지 손이 아직 목덜미에 있다. 잔 하나만큼은, 대청이 다시 나라다.'
	}, {
		kind: 'dialogue',
		person: 'bokho',
		en: ['Hyung.', 'Your hall is still too small.', 'I don’t care.'],
		lines: ['형.', '대청은 아직도 작소.', '상관없소.']
	}, {
		kind: 'dialogue',
		person: 'nulji',
		en: ['Stay.', 'Eat.', 'Don’t— don’t go anywhere.'],
		lines: ['있어.', '먹어.', '아무 데도— 가지 마.']
	}, {
		kind: 'p',
		html: 'Then Nulji’s mouth finds a line the books already wrote. He says it like a man who has just understood what he is still missing.',
		ko: '그때 눌지 입이, 책이 이미 적어 둔 문장을 찾는다. 아직 없는 것을 이제야 안 사람처럼 말한다.'
	}, {
		kind: 'dialogue',
		person: 'nulji',
		en: ['I have one eye back.', 'I have one arm back.', 'That’s what this is.', 'What do I do with the other one still on an island.'],
		lines: ['눈 하나를 되찾았다.', '팔 하나를 되찾았다.', '이게 그거다.', '섬에 남은 하나는 어쩌냐.']
	}, {
		kind: 'quote',
		html: 'I think of my two brothers as my left and right arms. Now I have only one arm. What am I to do?',
		ko: '내 두 아우를 생각함이 좌우의 팔과 같은데, 이제 한 팔만 얻었으니 어찌하랴.',
		hanja: '我念二弟如左右臂，今只得一臂，奈何。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'nulji',
		event: 'nulji-one-arm',
		stance: 'agree',
		claim: 'Nulji said one returned brother was one arm recovered.',
		claimKo: '눌지는 아우 하나를 되찾은 것을 팔 하나를 되찾은 것이라 했다.'
	}, {
		kind: 'p',
		html: 'The cup in the maid’s hand stops. The officer looks at the south-shore man. Momal does not sit down.',
		ko: '계집종 손의 잔이 멈춘다. 장수가 남쪽 사람을 본다. 모말은 앉지 않는다.'
	}, {
		kind: 'dialogue',
		person: 'jesang',
		en: ['Goguryeo I can talk into a yes.', 'I just did.', 'Wa does not listen to a mouth.', 'Wa listens to a ruin it can see.'],
		lines: ['고구려는 말로 예 하게 할 수 있어.', '방금 했으니까.', '왜는 입을 안 들어.', '왜는, 눈에 보이는 망가짐을 들어.']
	}, {
		kind: 'quote',
		html: 'Goguryeo is a great country, and the king a wise ruler, so I could move him with one word. The Wa cannot be persuaded by tongue. We must use a ruse to bring the prince home.',
		ko: '고구려는 대국이고 왕 또한 어진 임금이라, 신은 말 한 마디로 깨우칠 수 있었다. 왜인은 혀로 타이르지 못한다. 속임수로 왕자를 돌아오게 해야 한다.',
		hanja: '髙句麗大國，王亦賢君。是故，臣得以一言悟之。若倭人不可以口舌諭。當以詐謀，可使王子歸來。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'jesang',
		event: 'jesang-wa-ruse',
		stance: 'agree',
		claim: 'Jesang said he could talk Goguryeo round, but not Wa.',
		claimKo: '제상은 고구려는 말로 설득할 수 있으나 왜는 안 된다고 했다.'
	}, {
		kind: 'dialogue',
		person: 'jesang',
		en: ['When I go there, name Park Jesang a traitor.', 'Let them hear it.', 'Then the second job will fit in their mouth.'],
		lines: ['내가 가면, 박제상을 반역이라 불러.', '저들이 듣게.', '그래야 두 번째 일이 저들 입에 맞아.']
	}, {
		kind: 'quote',
		html: 'When I go among them, charge me with turning against the country, and let them hear of it.',
		ko: '신이 저곳에 가거든, 나라를 배반하였다는 죄로 논하여 저들이 듣게 하소서.',
		hanja: '臣適彼，則請以背國論，使彼聞之。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'jesang',
		event: 'jesang-wa-ruse'
	});

	// Remove the old "Well. / The other one." — the new beat owns that turn.
	const iWell = B.findIndex((b) => b.kind === 'dialogue' && b.person === 'nulji' && b.en?.[0] === 'Well.' && b.en?.[1] === 'The other one.');
	if (iWell >= 0) B.splice(iWell, 1);

	// 5. Chisul’s recorded cry at the ridge.
	const iRidge = find((b) => b.kind === 'p' && b.html?.startsWith('The ridge keeps her'), 'ridge');
	B.splice(iRidge, 0, {
		kind: 'quote',
		html: 'Come home safely.',
		ko: '잘 돌아오너라.',
		hanja: '好歸來。',
		source: 'Samguk Sagi (三國史記) bk. 45, Park Jesang',
		person: 'chisul',
		event: 'chisul-shore',
		stance: 'agree',
		claim: 'Lady Chisul called after the boat.',
		claimKo: '치술부인이 배 뒤를 불렀다.'
	});

	// 6. The song Nulji wrote when the last brother came home.
	const iThree = find((b) => b.kind === 'p' && b.html?.startsWith('Three brothers stand'), 'three');
	B.splice(iThree + 1, 0, {
		kind: 'quote',
		html: 'He took him by the hand, poured wine, and composed the Song of Eased Sorrow to comfort him.',
		ko: '손을 잡고 술을 따르며, 우식곡을 지어 위로하였다.',
		hanja: '執手賜酒，作憂息曲以慰之。',
		source: 'Samguk Sagi (三國史記) Silla Annals, Nulji 2',
		person: 'nulji',
		event: 'usik-gok',
		stance: 'agree',
		claim: 'Nulji wrote a song when Mihae came home.',
		claimKo: '눌지는 미해가 돌아오자 우식곡을 지었다.'
	});

	console.log('blocks', B.length);
	return true;
});
