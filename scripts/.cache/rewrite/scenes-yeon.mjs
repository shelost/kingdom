/**
 * Scenes pass (Yeon): the western levy soldier at the long wall (#7) paid off at Ansi (#37), Gulgul's Manchu-to-Korean arc
 * (#7, #15–17, #79, #85, #99), and scene/transition/variety fixes in #7, #8 and #37.
 * Idempotent: each episode skips itself when its marker is present. `DRY=1` prints instead of saving.
 */
import { editStory } from '../story-ops.mjs';
import { makeKit, get, after, before, set, flat } from './invasion-lib.mjs';

const DRY = !!process.env.DRY;
const txt = (b) => [b.html, b.label, b.caption, ...(b.en ?? []), ...(b.mnc ?? [])].filter(Boolean).join(' ');
const has = (e, frag) => flat(e.blocks).some((b) => txt(b).includes(frag));
const entry = (story, title) => {
	const hits = story.flatMap((c) => c.entries).filter((e) => e.title === title);
	if (hits.length !== 1) throw new Error(`${title}: ${hits.length} entries`);
	return hits[0];
};

editStory((story) => {
	const { P, S, D } = makeKit(story);
	const BOY = { person: 'gulgul', speaker: '🧒', chip: '#8fa87a' };
	const MAN = { person: 'gulgul', chip: '#8b3a3a' };
	/** Gulgul in Mohe: `lines` Korean, `en` English, `mnc` the Manchu. */
	const MOHE = (who, en, ko, mnc) => D({ ...who }, en, ko, { mnc });
	const WEST = { speaker: 'A young soldier from the west', gender: 'm' };
	const LEVY = { speaker: 'Western levy', gender: 'm' };
	const LEVY2 = { speaker: 'Another levy', gender: 'm' };
	const SERGEANT = { speaker: 'Western sergeant', gender: 'm' };
	const ARCHER = { speaker: 'Young archer', gender: 'm', chip: '#9a5c55' };
	const done = [];

	/* ───────────── #7 Commander Yeon ───────────── */
	const cy = entry(story, 'Commander Yeon');
	if (!has(cy, 'Ume jidere')) {
		const map = cy.blocks.find((b) => b.kind === 'map');
		after(cy, map, S('The Eastern Outpost', '동부 초소'));

		const silent = cy.blocks.filter((b) => b.kind === 'dialogue' && b.person === 'gulgul' && b.en?.[0] === '…');
		if (silent.length !== 2) throw new Error(`#7 silent Gulgul lines: ${silent.length}`);
		const [boy1, boy2] = silent;
		set(cy, boy1, { lines: ['오지 마!'], en: ['Don’t come any closer!'], mnc: ['Ume jidere!'] });
		set(cy, boy2, { lines: ['여긴 내 집이야. 너나 가.'], en: ['This is my house. You go.'], mnc: ['Ere mini boo. Si gene.'] });
		after(
			cy,
			boy2,
			P(
				'The boy is speaking Mohe. A grandchild of that tongue will one day be called Manchu, and an empire will stamp it on its coins. Today nobody in the yard knows a word of it, and Commander Yeon is not a man who lets that stop him.',
				'아이는 말갈 말을 하고 있다. 그 말의 손주뻘 되는 말이 훗날 만주어라 불리고, 한 제국의 동전에 새겨진다. 오늘 이 마당에선 아무도 그 말을 한마디도 모른다. 그리고 연 장군은 그런 걸로 멈출 사람이 아니다.'
			),
			D('gesomun', ['Aye, I ken. Your house. Fine house.', 'Bit short on roof.'], ['기래, 안다. 네 집이디. 좋은 집이다.', '지붕이 좀 모자라서 기렇디.']),
			MOHE(BOY, ['Go!'], ['가!'], ['Gene!']),
			D('gesomun', ['Gene. Grand. Gene yourself.'], ['게네. 기래. 너두 게네다.'])
		);
		const look = get(cy, 'Yeon looks at him for what his officers later agree');
		set(cy, look, {
			html: look.html.replace(/^He does not\. /, 'Nobody in that yard understands anybody. '),
			ko: look.ko.replace(/^알아듣지 못한다\. /, '그 마당에선 아무도 서로 알아듣지 못한다. ')
		});
		if (!look.html.startsWith('Nobody') || !look.ko.startsWith('그 마당')) throw new Error('#7 look p not rewritten');

		const naming = get(cy, 'He gives him the name');
		after(
			cy,
			naming,
			S('The Long Wall', '긴 성벽'),
			P(
				'Three weeks later the boy still has no Goguryeo, but he has a job. He carries the plumb bob, in both hands, a step behind Yeon, as if it might hatch.',
				'세 주 뒤, 아이는 아직 고구려 말을 한마디도 못 하지만 일거리는 생겼다. 다림추를 든다. 두 손으로, 연의 한 걸음 뒤에서, 무슨 알이라도 되는 것처럼 받쳐 든다.'
			),
			P(
				'Every command owes the wall a gang. This stretch has the West’s: farm boys from the Liao country, sunburnt in the middle of winter, a long way from home and making sure everyone knows it.',
				'군단마다 성벽에 일꾼 한 패씩을 바쳐야 한다. 이 구간은 서부 패다. 요하 쪽 농사꾼 아이들. 한겨울에 볕에 그을리고, 집에서 멀리 왔고, 그걸 모두가 알게 하는 데 열심이다.'
			),
			D(LEVY, ['That’s him. The East.', 'Don’t look. He kens when you look.'], ['데 사람이다. 동부.', '보디 말라우. 보는 걸 다 안대.']),
			D(LEVY2, ['What’s the wee Mohe carrying?'], ['데 말갈 꼬맹이는 뭘 들고 다니네?']),
			D(LEVY, ['His string. He hangs it off your stones, and then he kicks them.'], ['다림줄이다. 그걸 돌에 대 보구, 그다음에 걷어찬대.']),
			P(
				'Yeon stops. He holds out a hand without looking, and the boy puts the bob in it. The line drops against a stone in the third course and hangs clear of its face by a thumb.',
				'연이 멈춘다. 보지도 않고 손을 내밀자, 아이가 다림추를 올려놓는다. 줄이 셋째 단의 돌 하나에 드리워지고, 돌 면에서 엄지 한 마디만큼 떨어져 흔들린다.'
			),
			D('gesomun', ['Who laid this.'], ['이거 누가 쌓았네.']),
			D(WEST, ['Me, sir.'], ['내래 쌓았습네다.']),
			D('gesomun', ['It’s crooked. Take it out.'], ['삐뚤다. 빼라우.']),
			D(
				WEST,
				['It’s no crooked, sir. It’s leaning.', 'Into the hill. A stone wants to lie down, so you let it lean where it wants, and it holds. My da laid walls.'],
				['삐뚠 게 아닙네다. 기대 있는 겁네다.', '산 쪽으로요. 돌은 눕고 싶어 하니끼니, 눕고 싶은 쪽으로 기대 놓으면 버팁네다. 우리 아바지가 담 쌓던 사람입네다.']
			),
			D('gesomun', ['Your da’s not here. The string says crooked.'], ['너네 아바지 여기 없다. 줄이 삐뚤다는데.']),
			D(WEST, ['With respect, sir, the string’s never carried a stone in its life.'], ['외람되디만, 데 줄은 평생 돌 한 번 져 본 적이 없습네다.']),
			P(
				'Somebody in the West’s gang laughs. Then he notices nobody else is laughing, and turns it into a cough that fools no one.',
				'서부 패 누군가가 웃는다. 그러다 아무도 따라 웃지 않는 걸 알아채고, 아무도 안 속는 기침으로 바꾼다.'
			),
			P(
				'Yeon looks at the soldier. The soldier looks back with one eye. The other has wandered off down the valley on business of its own.',
				'연이 병사를 본다. 병사는 한쪽 눈으로 마주 본다. 다른 쪽 눈은 제 볼일 보러 골짜기 아래로 가 있다.'
			),
			D('gesomun', ['Which one of those is looking at me?'], ['어느 눈으로 날 보고 있네?']),
			D(WEST, ['Both, sir. Always both.'], ['둘 다입네다. 늘 둘 다요.']),
			P(
				'Yeon kicks the stone. He has kicked a good many stones out of this wall. This one stays where it is, and something in his boot makes a small sound that nobody is going to mention.',
				'연이 돌을 걷어찬다. 이 성벽에서 걷어차 빼낸 돌이 한둘이 아니다. 이놈은 꿈쩍도 않고, 그의 장화 속에서 뭔가 작은 소리가 난다. 그 얘기를 꺼낼 사람은 아무도 없다.'
			),
			D('gesomun', ['…Leave it.'], ['…놔둬라.']),
			MOHE(BOY, ['Stone.'], ['돌.'], ['Wehe.']),
			D('gesomun', ['Aye. Very good. Whatever that was.'], ['기래. 잘했다. 그게 뭔 말이든.']),
			D(WEST, ['What’s the wee one saying, sir?'], ['데 꼬마는 뭐라는 겁네까?']),
			D(
				'gesomun',
				['No idea. He’s been talking since the snow. I answer him anyway. We get on fine.', 'You. Name.'],
				['모른다. 눈밭에서부터 쭉 떠든다. 기래두 대꾸는 해 준다. 우린 잘 지낸다.', '너. 이름.']
			),
			D(WEST, ['It’s—'], ['내 이름은—']),
			D(SERGEANT, ['West! Shift’s done! Down off it, the lot of you!'], ['서부! 교대다! 다들 내려오라우!']),
			P(
				'The gang goes down the hill in a scramble of tools and complaints, and the soldier goes with it, looking back with whichever eye can be bothered. Yeon limps on along the wall. He never does get the name.',
				'일꾼 패가 연장과 투덜거림을 한데 엉켜 산을 내려가고, 병사도 그 틈에 섞여 간다. 돌아보는 건 그럴 마음이 있는 쪽 눈뿐이다. 연은 절룩이며 성벽을 따라 걷는다. 끝내 그 이름은 듣지 못한다.'
			)
		);

		const half = get(cy, 'Half, son. Half.');
		after(
			cy,
			half,
			P(
				'He leaves at first light. The boy is at the stable door before him, in gloves that still don’t fit, holding the red bay’s bridle as if somebody had asked him to.',
				'그는 첫새벽에 떠난다. 아이가 먼저 마구간 문 앞에 와 있다. 아직도 안 맞는 장갑을 끼고, 누가 시키기라도 한 것처럼 붉은 말의 고삐를 쥐고.'
			),
			D('gesomun', ['No. You stay. Dosuryu feeds you.', 'Don’t bite him.'], ['안 된다. 넌 남아. 도수류가 밥 멕여 줄 거다.', '물디는 말구.']),
			MOHE(BOY, ['I want to go.'], ['나도 갈래.'], ['Bi geneki.']),
			D('gesomun', ['Still no idea. Still no.'], ['여전히 뭔 소린지 모르갓다. 기래두 안 된다.']),
			P(
				'Every morning for a month Yeon has asked him the same question, the way you’d ask a horse, and never once waited for an answer.',
				'한 달 내내 아침마다 연은 아이에게 같은 걸 물었다. 말한테 묻듯이. 대답을 기다린 적은 한 번도 없다.'
			),
			D('gesomun', ['Cold?'], ['춥네?']),
			D({ ...BOY }, ['…Cold.'], ['…춥네.']),
			D('dosuryu', ['Was that a word? Did he just say a word?'], ['방금 그거 말이네? 말한 거 맞디?']),
			D('gesomun', ['He said cold.', '…Aye. Me too, wee man. Me too.'], ['춥대.', '…기래. 나두 춥다, 꼬맹아. 나두.']),
			P(
				'He rides out laughing. Dosuryu has to hold the boy back by the collar for the whole length of the road.',
				'연은 웃으면서 떠난다. 도수류는 길이 다 보이지 않을 때까지 아이의 뒷덜미를 붙잡고 있어야 한다.'
			)
		);
		done.push('#7');
	}

	/* ───────────── #8 High Summit ───────────── */
	const hs = entry(story, 'High Summit');
	if (!has(hs, 'He kicked my stone')) {
		const map = hs.blocks.find((b) => b.kind === 'map');
		after(hs, map, S('Pyongyang · the High Summit', '평양 · 제가회의'));
		const junior = get(hs, 'Is he mad?', (b) => b.kind === 'dialogue');
		set(hs, junior, {
			en: ['Sir. The one from the East…', 'He kicked my stone. On the long wall, this winter. It didn’t move.', 'Is he mad?'],
			lines: ['장군님. 그 동쪽 분 말입네다…', '이번 겨울에 긴 성벽에서 제 돌을 걷어찼습네다. 꿈쩍도 안 했디요.', '미친 겁네까?']
		});
		const yard = get(hs, 'In the yard the Eastern banners answer him anyway');
		after(
			hs,
			yard,
			D({ speaker: 'Man in the crowd', gender: 'm' }, ['That’s him! The one that walked out on them!'], ['데 사람이다! 회의 박차고 나온 사람!']),
			D({ speaker: 'Woman in the crowd', gender: 'f' }, ['Is he handsome close up?'], ['가까이서 보면 잘생겼네?']),
			D({ speaker: 'Man in the crowd', gender: 'm' }, ['Nobody’s ever been close enough to say.'], ['그만치 가까이 가 본 사람이 없디.'])
		);
		done.push('#8');
	}

	/* ───────────── #37 Ansi ───────────── */
	const ansi = entry(story, 'Ansi');
	if (!has(ansi, 'with a tilt you could see')) {
		const pass = get(ansi, 'Then it’s sixty nights for us. Pass the stone.');
		after(
			ansi,
			pass,
			P(
				'Somebody passes it. He sets it himself, on the inside face, with a tilt you could see from the emperor’s tent.',
				'누군가 건넨다. 그는 안쪽 면에 손수 그 돌을 앉힌다. 황제 천막에서도 보일 만큼 비스듬하게.'
			),
			D(ARCHER, ['Chief. That one’s crooked.'], ['성주님. 그거 삐뚤어요.']),
			D(
				'yangmanchun',
				['It’s leaning. Into the hill.', 'A stone wants to lie down. Let it lean where it wants and it holds.'],
				['기대 놓은 거다. 산 쪽으로.', '돌은 눕고 싶어 해. 눕고 싶은 쪽으로 기대 놓으면 버틴다.']
			),
			D(ARCHER, ['Says who?'], ['누가 그래요?']),
			D(
				'yangmanchun',
				['My da. I told a commander that once, on the long wall, the year I was your age.', 'He kicked it. It didnae move. He limped off before he ever got my name.'],
				['우리 아바지가. 너만 할 때 긴 성벽에서 어느 장군한테 그 말을 했디.', '걷어차더라. 꿈쩍도 안 했어. 내 이름 듣기도 전에 절룩거리며 가 버렸디.']
			),
			D(ARCHER, ['Which commander?'], ['어느 장군이요?']),
			P(
				'The chief doesn’t answer. He looks south-east, toward Pyongyang, with the eye that can be bothered. Then he holds out his hand for the next stone.',
				'성주는 대답하지 않는다. 남동쪽, 평양 쪽을 본다. 그럴 마음이 있는 쪽 눈으로. 그러고는 다음 돌을 달라고 손을 내민다.'
			)
		);
		const alive = get(ansi, 'so that man is still alive');
		after(ansi, alive, D('dosuryu', ['You know him?'], ['아는 놈이네?']), D('gesomun', ['Never got his name.'], ['이름은 못 들었다.'], { look: 'supreme' }));
		done.push('#37');
	}

	/* ───────────── #15 Academy ───────────── */
	const ac = entry(story, 'Academy');
	if (!has(ac, 'Sain morin')) {
		const fourth = get(ac, 'There is a fourth boy at that table');
		after(
			ac,
			fourth,
			P(
				'Seven years in the house, and he understands every word of Goguryeo now. He spends them like a miser: mostly nouns, with Yeon’s northern vowels on all of them.',
				'그 집에서 일곱 해. 이제 고구려 말은 한마디도 빠짐없이 알아듣는다. 다만 구두쇠처럼 아껴 쓴다. 거의 명사뿐이고, 그 명사마다 연의 북쪽 모음이 묻어 있다.'
			),
			D('namseng', ['Gulgul. How do you say “horse” in Mohe?', 'The master says a commander’s son should know the northern tongues.'], ['걸걸. 말갈 말로 “말”은 뭐라고 해?', '스승님이 장군 아들은 북쪽 말도 알아야 한대.']),
			D({ ...MAN }, ['…Eat.'], ['…먹어.']),
			D('namseng', ['That isn’t an answer—'], ['그건 대답이 아니잖아—']),
			D({ ...MAN }, ['Eat. Cold.'], ['먹어. 식어.']),
			P(
				'He says it later, in the stable, to the horse, where nobody is asking.',
				'그 말은 나중에 한다. 마구간에서, 말한테. 아무도 묻지 않는 데서.'
			),
			MOHE(MAN, ['Horse. Good horse.'], ['말. 좋은 말.'], ['Morin. Sain morin.'])
		);
		done.push('#15');
	}

	/* ───────────── #16 Stele ───────────── */
	const st = entry(story, 'Stele');
	if (!has(st, 'Ume tuhere')) {
		const under = get(st, 'Gulgul stands underneath with his arms half out.');
		under.ko = under.ko.replace('굴굴이', '걸걸이');
		after(st, under, MOHE(MAN, ['Don’t fall… don’t fall…'], ['떨어지지 마… 떨어지지 마…'], ['Ume tuhere… ume tuhere…']));
		done.push('#16');
	}

	/* ───────────── #17 Dosuryu ───────────── */
	const ds = entry(story, 'Dosuryu');
	if (!has(ds, 'Yes. Saddle. The bay.')) {
		after(ds, get(ds, 'Gulgul. Saddle the bay.'), D({ ...MAN }, ['Yes. Saddle. The bay.'], ['예. 안장. 밤색 말.']));
		done.push('#17');
	}

	/* ───────────── #79 Pyongyang I ───────────── */
	const p1 = entry(story, 'Pyongyang I');
	const count = get(p1, '…Yes, sir.', (b) => b.person === 'gulgul');
	if (count.en.length === 1) {
		set(p1, count, {
			en: ['…Yes, sir.', 'Fifty-one tonight. Seven fewer than last night. I counted the cook-smoke too.'],
			lines: ['…예.', '오늘 밤 쉰한 개. 어젯밤보다 일곱 개 적습네다. 밥 짓는 연기도 세 봤습네다.']
		});
		done.push('#79');
	}

	/* ───────────── #85 Yeon Gesomun† ───────────── */
	const yg = entry(story, 'Yeon Gesomun†');
	if (!has(yg, 'The border’s mine.')) {
		set(yg, get(yg, 'Enough, sir.'), { en: ['Five. …Enough, sir.'], lines: ['다섯 자루. …충분합네다.'] });
		before(
			yg,
			get(yg, 'Gulgul does not sit at all.'),
			D('namsan', ['Gulgul. Stay for the funeral, at least.'], ['걸걸. 장례는 보고 가.']),
			D({ ...MAN }, ['The funeral’s for his sons.', 'The border’s mine. He gave it me.'], ['장례는 아드님들 일이디요.', '국경은 내 일이고. 그분이 주셨습네다.'])
		);
		done.push('#85');
	}

	/* ───────────── #99 Balhae ───────────── */
	const bh = entry(story, 'Balhae');
	if (!has(bh, 'Ere musei boo')) {
		const fb = bh.blocks.find((b) => b.kind === 'flashback');
		const door = get(bh, 'A doorway with no house behind it.');
		if (!fb.blocks.includes(door)) throw new Error('#99 flashback changed shape');
		after(bh, door, MOHE(BOY, ['This is my house.'], ['여긴 내 집이야.'], ['Ere mini boo.']));
		const vow = get(bh, 'Goguryeo never dies…!', (b) => b.person === 'daejoyoung');
		after(
			bh,
			vow,
			P(
				'He says it twice more, quieter each time, and is asleep before the third is finished, the gold in both fists. Gulgul does not move for a long while. Then he bends to the top of the boy’s head and speaks in the tongue he had in the doorway. He has used it all his life on the border, for orders and for trade. He has never used it for this.',
				'아이는 두 번 더, 점점 작게 말하다가 세 번째를 다 맺기도 전에 잠든다. 금은 두 주먹에 쥔 채로. 걸걸은 한참을 꼼짝하지 않는다. 그러다 아이 정수리께로 몸을 굽혀, 그 문간에서 쓰던 말로 말한다. 국경에서 평생 그 말을 썼다. 명령할 때, 흥정할 때. 이런 데 써 본 적은 없다.'
			),
			MOHE(MAN, ['My boy. Sleep.', 'Your father’s here.'], ['내 새끼. 자라.', '아비 여기 있다.'], ['Mini jui. Amga.', 'Ama ubade bi.']),
			D('daejoyoung', ['…Mm? Father, what does that—'], ['…응? 아버지, 그게 무슨—']),
			D({ ...MAN }, ['Sleep.'], ['자.']),
			P(
				'The boy sleeps. Gulgul looks round at the crack in the mountain, the snow in its mouth, the fire the size of two hands.',
				'아이가 잠든다. 걸걸은 산의 갈라진 틈을, 그 입구를 메우는 눈을, 두 손바닥만 한 불을 둘러본다.'
			),
			MOHE(MAN, ['This is our house.'], ['여기가 우리 집이다.'], ['Ere musei boo.'])
		);
		done.push('#99');
	}

	if (DRY) {
		for (const e of [cy, hs, ansi, ac, st, ds, p1, yg, bh]) {
			console.log(`\n===== ${e.title} =====`);
			flat(e.blocks).forEach((b, i) => console.log(`[${i}] ${b.kind} ${b.person ?? b.speaker ?? ''}: ${(b.en ?? []).join(' / ') || txt(b)}${b.mnc ? '  {' + b.mnc.join(' / ') + '}' : ''}`.slice(0, 200)));
		}
		return false;
	}
	console.log(done.length ? `scenes-yeon: saved ${done.join(' ')}` : 'scenes-yeon: already applied');
	return done.length > 0;
});
