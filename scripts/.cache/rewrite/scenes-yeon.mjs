/**
 * Scenes pass (Yeon): the High Summit arrivals and the western soldier's stone at the Pyongyang horse wall (#8, moved out of
 * #7's long wall) paid off at Ansi (#37), Gulgul's Manchu-to-Korean arc
 * (#7, #15–17, #79, #85, #99), and scene/transition/variety fixes in #7, #8 and #37.
 * Idempotent: each episode skips itself when its marker is present. `DRY=1` prints instead of saving.
 */
import { editStory } from '../story-ops.mjs';
import { makeKit, get, after, before, set, del, flat } from './invasion-lib.mjs';

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
	const WEST = { speaker: 'Junior warrior', gender: 'm' };
	const LEVY = { speaker: 'Levy', gender: 'm' };
	const LEVY2 = { speaker: 'Another levy', gender: 'm' };
	const GUARD = { speaker: 'Gate guard', gender: 'm' };
	const OLDGUARD = { speaker: 'Old gate guard', gender: 'm' };
	const MAID = { speaker: 'Kitchen maid', gender: 'f' };
	const CARRIER = { speaker: 'Water carrier', gender: 'm' };
	const STEWARD = { speaker: 'Palace steward', gender: 'm' };
	const ARCHER = { speaker: 'Young archer', gender: 'm', chip: '#9a5c55' };
	const done = [];
	const reanchor = (e, id, at) => {
		const im = (e.images ?? []).find((x) => x.id === id);
		if (im && im.at !== at) im.at = at;
	};

	/** #7's long wall: Yeon, the boy and a levy gang. The western soldier's stone lives in #8. */
	const wall = () => [
		P('The levy gangs on this stretch watch him come the way you’d watch weather.', '이 구간의 일꾼 패들은 그가 오는 걸 날씨 보듯 본다.'),
		D(LEVY, ['That’s him. The East.', 'Don’t look. He kens when you look.'], ['데 사람이다. 동부.', '보디 말라우. 보는 걸 다 안대.']),
		D(LEVY2, ['What’s the wee Mohe carrying?'], ['데 말갈 꼬맹이는 뭘 들고 다니네?']),
		D(LEVY, ['His string. He hangs it off your stones, and then he kicks them.'], ['다림줄이다. 그걸 돌에 대 보구, 그다음에 걷어찬대.']),
		P(
			'Yeon stops. He holds out a hand without looking, and the boy puts the bob in it. The line drops against a stone in the third course and hangs clear of its face by a thumb. Yeon kicks the stone out of the wall. It is the fourth this morning.',
			'연이 멈춘다. 보지도 않고 손을 내밀자, 아이가 다림추를 올려놓는다. 줄이 셋째 단의 돌 하나에 드리워지고, 돌 면에서 엄지 한 마디만큼 떨어져 흔들린다. 연이 그 돌을 걷어차 빼낸다. 오늘 아침에만 네 번째다.'
		),
		MOHE(BOY, ['Stone.'], ['돌.'], ['Wehe.']),
		D('gesomun', ['Aye. Very good. Whatever that was.'], ['기래. 잘했다. 그게 뭔 말이든.']),
		D(LEVY2, ['What’s the wee one saying, sir?'], ['데 꼬마는 뭐라는 겁네까?']),
		D(
			'gesomun',
			['No idea. He’s been talking since the snow. I answer him anyway. We get on fine.', 'Put that back. Straight.'],
			['모른다. 눈밭에서부터 쭉 떠든다. 기래두 대꾸는 해 준다. 우린 잘 지낸다.', '데거 도로 넣으라우. 똑바로.']
		),
		P(
			'The gang groans and goes after the stone. Yeon walks on along the wall, the boy a step behind him with the bob back in both hands.',
			'일꾼 패가 끙 소리를 내며 돌을 주우러 간다. 연은 성벽을 따라 계속 걷고, 아이는 다림추를 다시 두 손에 받쳐 들고 한 걸음 뒤를 따른다.'
		)
	];

	/* ───────────── #7 Commander Yeon ───────────── */
	const cy = entry(story, 'Commander Yeon');
	if (has(cy, 'Every command owes the wall a gang')) {
		const i = cy.blocks.indexOf(get(cy, 'Every command owes the wall a gang'));
		const j = cy.blocks.indexOf(get(cy, 'He never does get the name.'));
		if (i < 0 || j < i) throw new Error('#7 western-soldier range not found at top level');
		cy.blocks.splice(i, j - i + 1, ...wall());
		cy.images = (cy.images ?? []).filter((im) => !['scenes-yeon-plumb-stone', 'scenes-yeon-kick'].includes(im.id));
		done.push('#7 (western soldier moved to #8)');
	}
	reanchor(cy, 'scenes-yeon-long-wall', 'He carries the plumb bob');
	const taejo = get(cy, 'I sat in it for twelve years.', (b) => b.person === 'yeontaejo');
	if (taejo.en[1].includes('Your uncle')) {
		set(cy, taejo, {
			en: ['I know. I sat in it for twelve years.', 'Gusesa chairs it now. A cousin of ours, far off, and the king’s man. He’ll call you nephew and be kind to you. That’s worse.', 'Half, son. Half.'],
			lines: ['안다. 내가 열두 해를 앉아 있었다.', '지금은 구세사가 그 자리에 있다. 우리 집안 먼 친척인데, 왕의 사람이다. 너를 조카라 부르구 다정하게 굴 거다. 기게 더 나쁘다.', '반만이다, 개소문아. 반만.']
		});
		done.push('#7 (Gusesa)');
	}
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
			...wall()
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
	const junior = get(hs, 'Is he mad?', (b) => b.kind === 'dialogue');
	if (!junior.en.join(' ').includes('this morning')) {
		set(hs, junior, {
			en: ['Sir. The one from the East…', 'He kicked my stone this morning. By the horses. It didn’t move.', 'Is he mad?'],
			lines: ['장군님. 그 동쪽 분 말입네다…', '오늘 아침 말 매는 데서 제 돌을 걷어찼습네다. 꿈쩍도 안 했디요.', '미친 겁네까?']
		});
		done.push('#8 (stone callback)');
	}
	if (!hs.blocks.some((b) => b.kind === 'scene' && b.label === 'Pyongyang · the High Summit')) {
		after(hs, hs.blocks.find((b) => b.kind === 'map'), S('Pyongyang · the High Summit', '평양 · 제가회의'));
	}
	if (!has(hs, 'count my horses going in')) {
		const ride = get(hs, 'He rides in at the red two-tier gate');
		set(hs, ride, {
			html: 'Five commands ride in at the red two-tier gate that week. Pyongyang has heard stories about every one of them, and puts on its good clothes to check.',
			ko: '그 주에 다섯 군단이 붉은 이중 문루로 들어온다. 평양은 그들 모두에 관한 얘기를 들어 왔고, 확인하러 좋은 옷을 꺼내 입는다.'
		});
		const term = hs.blocks.find((b) => b.kind === 'term');
		const gusCard = hs.blocks.find((b) => b.kind === 'card' && b.person === 'gusesa');
		del(hs, gusCard);
		after(
			hs,
			term,
			S('The Gate', '대문'),
			P(
				'Before the principals sit, the gate gets its look. The commanders arrive by rank, each by his own road, and half of Pyongyang finds an errand that runs past it.',
				'주인들이 자리에 앉기 전에, 대문이 먼저 구경을 한다. 대가들은 서열대로, 저마다 제 길로 들어오고, 평양 사람 절반은 그 길을 지나는 심부름거리를 찾아낸다.'
			),
			P('The North comes first, on a Khitan horse. He took it off a Khitan, and he will tell you so.', '북부가 먼저 온다. 거란 말을 타고. 거란 놈한테서 뺏은 말이고, 묻지 않아도 그렇게 말해 준다.'),
			D(GUARD, ['Is that him? The one that eats Khitans?'], ['데 사람이네? 거란 놈들 잡아먹는다는?']),
			D(OLDGUARD, ['Only their horses. He keeps the Khitans for trade.', 'Twenty winters up there and he’s still got both ears. Count them when he passes.'], ['말만 먹디. 거란 놈들은 장사할 때 쓰구.', '거기서 스무 해 겨울을 나고도 귀가 둘 다 붙어 있다. 지나갈 때 세 보라우.']),
			{ kind: 'card', person: 'northcmd', caption: 'The Northern Commander. He holds the steppe edge against the Khitans and wants horses, not poems.', ko: '북부 대가. 초원 끝에서 거란을 막는다. 시 말고 말을 원한다.' },
			D('northcmd', ['Somebody count my horses going in.', 'I want the same number coming out.'], ['들어갈 때 내 말 세 두라우.', '나올 때 같은 숫자 볼 거다.']),
			P('The West comes second, grey with the dust of the longest road in the kingdom.', '서부가 두 번째로 온다. 나라에서 제일 긴 길의 먼지를 뒤집어써 잿빛이다.'),
			D(MAID, ['Which one’s that?'], ['데 분은 누구네?']),
			D(CARRIER, ['The West. He sits on the Liao and watches the Han.', 'Whatever they’re calling their dynasty this week.'], ['서부 대가. 요하에 앉아서 한족을 지킨다.', '데 사람들이 이번 주엔 왕조를 뭐라 부르는디 몰라두.']),
			D(MAID, ['They say he’s never lost a fort.'], ['성을 하나두 안 잃었대.']),
			D(CARRIER, ['He’s never left one, either.'], ['성 밖에 나와 본 적두 없디.']),
			{ kind: 'card', person: 'westcmd', caption: 'The Western Commander. He has held the Liao against the Han his whole life, mostly by not starting anything.', ko: '서부 대가. 평생 요하에서 한족을 막았다. 주로 아무 일도 벌이지 않는 방식으로.' },
			P(
				'At his stirrup walks a junior warrior of twenty-four, with one eye that wanders. Somebody has to hold the horses. In the West it is always him.',
				'그의 등자 곁에 스물네 살 먹은 말단 무사 하나가 걷는다. 한쪽 눈이 제멋대로 돈다. 누군가는 말을 붙들어야 하고, 서부에선 늘 그다.'
			),
			P(
				'The South comes third, to drums. The king has sent his own chamberlain down to the gate to meet him. Nobody else got a chamberlain.',
				'남부는 세 번째로, 북소리와 함께 온다. 왕이 시종장을 대문까지 내려보내 그를 맞는다. 다른 누구도 시종장은 못 받았다.'
			),
			D(GUARD, ['Look at that. A chamberlain. For the South.'], ['데거 보라우. 시종장이다. 남부한테.']),
			D(OLDGUARD, ['The South fights Baekje with one hand and Silla with the other.', 'His Majesty wants both. So the South gets a chamberlain.'], ['남부는 한 손으루 백제, 한 손으루 신라를 친다.', '전하께서 둘 다 갖고 싶으시디. 기러니끼니 남부는 시종장을 받는 거다.']),
			D(MAID, ['Is it true he’s crossed swords with Kim Yushin?'], ['김유신이랑 칼을 맞대 봤다는 거 참말이네?']),
			D(OLDGUARD, ['Crossed. Not finished.'], ['맞대 봤디. 끝장을 못 봤을 뿐이디.']),
			{ kind: 'card', person: 'southcmd', caption: 'The Southern Commander. Baekje on one side, Silla on the other, and the king’s whole heart riding in his saddlebags.', ko: '남부 대가. 한쪽엔 백제, 한쪽엔 신라. 왕의 마음은 통째로 그의 안장 주머니에 실려 온다.' },
			D('southcmd', ['His Majesty is well? Good.', 'Tell him I brought a map, not a speech.'], ['전하께선 강녕하시오? 됐소.', '연설 말고 지도를 가져왔다고 아뢰시오.']),
			P(
				'Yeon comes last, in his father’s place, with Dosuryu and six riders. It is his first time through this gate with a seal in his saddlebag. Nobody here has seen his face since it grew a beard.',
				'연은 맨 끝에, 아버지 대신, 도수류와 기병 여섯을 데리고 온다. 안장 주머니에 인장을 넣고 이 문을 지나는 건 처음이다. 수염이 난 뒤로 그의 얼굴을 본 사람은 여기 아무도 없다.'
			),
			D(GUARD, ['Eastern banner. Old Yeon’s seal.', 'That’s never old Yeon.'], ['동부 깃발이다. 늙은 연 대가 인장.', '데게 늙은 연은 아니디.']),
			D(OLDGUARD, ['His boy. The one that kills Mohe.', 'He’s smaller than the stories.'], ['아들이다. 말갈 잡는 그 아들.', '얘기보다 작구만.']),
			D(GUARD, ['Everybody’s smaller than the stories.'], ['얘기보다 큰 사람이 어드메 있네.']),
			D(OLDGUARD, ['I held this gate for his grandfather. Now there was a High Commander.', 'Never said a word. Just looked at you till you agreed.'], ['내래 저 집 할아버지 때부터 이 문을 지켰다. 기게 막리지였디.', '말 한마디 없이 쳐다만 봐. 네가 수긍할 때까지.']),
			D(GUARD, ['This one’s looking at us.'], ['이 사람두 쳐다보는데.']),
			D(OLDGUARD, ['Aye. But this one’s going to talk.'], ['기래. 근데 이 사람은 말을 할 거다.']),
			D(STEWARD, ['Aides wait in the yard. Your commander may go through.'], ['수행원은 마당에서 기다리시오. 대가께서는 들어가셔도 되오.']),
			D('gesomun', ['My commander’s at home with his knees.', 'I’m what he sent.'], ['우리 대가는 집에서 무릎을 앓고 계시다.', '보낸 게 나다.']),
			D(STEWARD, ['…Of course. Forgive me.', 'The East sits at the foot of the table. Your sword stays at the gate, and you wait to be called.'], ['…아, 예. 송구하오.', '동부는 상 말석이오. 칼은 대문에 두시고, 부를 때까지 기다리시오.']),
			D('dosuryu', ['The foot of the table. Your grandfather would’ve—'], ['말석이라. 네 할아버님이셨으면—']),
			D('gesomun', ['Fine. I’ll sit where I’m put.', 'For now.'], ['됐다. 앉히는 데 앉갓다.', '지금은.']),

			S('The Horse Wall', '말 매는 담'),
			P(
				'So Yeon waits in the yard with the horses. A low dry-stone wall runs along it for tying reins to. A southern horse has kicked the top course loose, and somebody has already put it back.',
				'그래서 연은 마당에서 말들과 함께 기다린다. 마당을 따라 고삐 매는 낮은 돌담이 있다. 남부 말 한 마리가 윗단을 걷어차 빠뜨렸는데, 누가 벌써 도로 앉혀 놓았다.'
			),
			P(
				'Yeon has brought a plumb line to Pyongyang. Of course he has. He drops it against the stone, and it hangs clear of the face by a thumb.',
				'연은 평양까지 다림줄을 챙겨 왔다. 당연하다. 그 돌에 줄을 드리우자, 돌 면에서 엄지 한 마디만큼 떨어져 흔들린다.'
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
				'One of the southern grooms laughs. Then he notices nobody else is laughing, and turns it into a cough that fools no one.',
				'남부 마부 하나가 웃는다. 그러다 아무도 따라 웃지 않는 걸 알아채고, 아무도 안 속는 기침으로 바꾼다.'
			),
			P(
				'Yeon looks at the soldier. The soldier looks back with one eye. The other has wandered off toward the palace on business of its own.',
				'연이 병사를 본다. 병사는 한쪽 눈으로 마주 본다. 다른 쪽 눈은 제 볼일 보러 궁 쪽으로 가 있다.'
			),
			D('gesomun', ['Which one of those is looking at me?'], ['어느 눈으로 날 보고 있네?']),
			D(WEST, ['Both, sir. Always both.'], ['둘 다입네다. 늘 둘 다요.']),
			P(
				'Yeon kicks the stone. On the long wall at home he has kicked a good many stones out. This one stays where it is, and something in his boot makes a small sound that nobody is going to mention.',
				'연이 돌을 걷어찬다. 집 쪽 긴 성벽에서는 걷어차 빼낸 돌이 한둘이 아니다. 이놈은 꿈쩍도 않고, 그의 장화 속에서 뭔가 작은 소리가 난다. 그 얘기를 꺼낼 사람은 아무도 없다.'
			),
			D('gesomun', ['…Leave it.', 'You. Name.'], ['…놔둬라.', '너. 이름.']),
			D(WEST, ['It’s—'], ['내 이름은—']),
			D(STEWARD, ['Eastern Command! The antechamber!'], ['동부! 대기실로 드시오!']),
			P(
				'Yeon goes in limping slightly, with a face that dares anyone to ask. The soldier goes back to the horses. Yeon never forgets an insult. He won’t think to ask that name again for eleven years.',
				'연은 아무도 묻지 못하게 하는 얼굴로, 살짝 절며 들어간다. 병사는 말들에게 돌아간다. 연은 모욕이라면 하나도 잊지 않는 사람이다. 그런데 그 이름은, 열한 해 동안 다시 물을 생각을 못 한다.'
			),

			S('The Antechamber', '대기실'),
			P(
				'The commanders wait in the antechamber while the king is dressed. The first pot of tea goes round by rank. It runs dry one cup before the foot of the table, so the foot of the table pours his own.',
				'대가들은 왕이 의관을 갖추는 동안 대기실에서 기다린다. 첫 주전자가 서열대로 돈다. 말석 한 잔 앞에서 바닥이 나서, 말석은 제 차를 제가 따른다.'
			),
			D('northcmd', ['Four hundred head the Khitans want to sell me back. My own horses.', 'For salt. I said I’d give them salt. In the wounds.'], ['거란 놈들이 사백 마리를 되팔겠단다. 내 말을.', '소금 받고. 소금 주마 했디. 상처에다.']),
			D('westcmd', ['Give them the salt. A Khitan who is trading is not raiding.', 'That is a quiet winter for the price of a cart.'], ['소금을 주시오. 장사하는 거란은 약탈하지 않소.', '수레 한 대 값에 조용한 겨울이오.']),
			D('southcmd', ['Quiet winters. You two grow quiet winters like turnips.'], ['조용한 겨울이라. 두 분은 조용한 겨울을 무 키우듯 키우시는구려.']),
			D('northcmd', ['And what do you grow, Son? Speeches about Silla?'], ['손 대가는 뭘 키우는데? 신라 연설?']),
			D('southcmd', ['Silla. Once I’m given the men.', 'Then I’ll stop talking.'], ['신라를 키우오. 사람만 주면.', '그럼 말도 그만하지.']),
			D('westcmd', ['And the East? What do you pay the Mohe for a quiet winter?'], ['동부는 어떻소? 조용한 겨울 값으로 말갈한테 얼마를 치르오?']),
			D('gesomun', ['Nothing.', 'I don’t buy winters off the Mohe. I make them Goguryeo.'], ['한 푼두 안 낸다.', '말갈한테 겨울을 사디 않아. 고구려로 만들디.']),
			P('There is the pause a table takes when a guest says grace in a house where nobody prays.', '아무도 기도하지 않는 집에서 손님이 식전 기도를 올렸을 때, 밥상이 갖는 그런 침묵이 흐른다.'),
			D('northcmd', ['Make them Goguryeo. How’s that go, then? You teach them the songs?'], ['고구려로 만든다. 기거 어케 하는 건데? 노래를 가르치네?']),
			D('gesomun', ['I took one home. Wee thing. The morning I rode out, he said “cold.” In our tongue.'], ['하나 데려왔다. 꼬맹이. 내 떠나던 날 아침에 “춥네” 하더라. 우리 말로.']),
			D('southcmd', ['Heaven help us. The East is raising Mohe for the choir.'], ['하늘이시여. 동부가 말갈을 데려다 노래패를 키우는구려.']),
			D(
				'gesomun',
				['Laugh. Every man at this table had a grandfather some southerner called a barbarian.', 'The Holy King never asked anybody for a pedigree. Goguryeo isn’t a border, it’s a—'],
				['웃으라우. 이 상에 앉은 놈 치고 할애비가 오랑캐 소리 안 들은 놈 있네?', '성왕께서는 누구한테두 족보를 묻디 않으셨다. 고구려는 국경이 아니라—']
			),
			D('westcmd', ['The tea has gone cold.'], ['차가 식었소.']),
			P(
				'It hasn’t. He pours anyway, for everyone, and this time the foot of the table gets a cup. The North looks at Yeon the way you’d look at a young dog that has brought you a live bird: impressed, embarrassed, and checking the floor.',
				'식지 않았다. 그래도 그는 모두에게 따르고, 이번엔 말석에도 한 잔이 돌아간다. 북부는 산 새를 물어 온 어린 개를 보듯 연을 본다. 감탄스럽고, 민망하고, 바닥은 괜찮은지 살피면서.'
			),
			D('southcmd', ['Your grandfather talked like that.'], ['자네 할아버지가 꼭 그렇게 말했소.']),
			D('gesomun', ['And?'], ['기래서?']),
			D('southcmd', ['And he was High Commander a long while. Then he wasn’t.'], ['그래서 오래 막리지를 지냈지. 그러다 그만뒀고.']),
			P(
				'The High Commander comes in by the inner door, the one the king uses. He has not come through the gate with the commands for years.',
				'막리지는 안쪽 문으로 들어온다. 왕이 쓰는 문이다. 대가들과 함께 대문으로 들어온 지 여러 해다.'
			),
			gusCard,
			D('gusesa', ['Nephew. You have your grandfather’s chin. He used to bring it into this room like a ram against a gate.'], ['조카. 자넨 할아버님 턱을 닮았네. 그 어른은 그 턱을 공성추처럼 앞세우고 이 방에 드셨지.']),
			D('gesomun', ['Nephew. Is that what we are?'], ['조카라. 우리가 기런 사이요?']),
			D('gusesa', ['Third cousins, if anybody counts. In Pyongyang nobody counts. It keeps the house warm.'], ['셈하자면 팔촌쯤 되나. 평양에선 아무도 셈하지 않네. 그래야 집안이 따뜻하거든.']),
			D('gesomun', ['The clan eats at the old house tonight. You’ll come.'], ['오늘 밤 옛집에서 일가가 밥을 먹소. 오실 거디요.']),
			D('gusesa', ['The palace eats at the same hour. Give the clan my regards.'], ['궁도 같은 시각에 먹는다네. 일가에 안부 전해 주게.']),
			D('gesomun', ['Where do you sit, then? Uncle.'], ['기럼 어디 앉으시오? 숙부.']),
			D('gusesa', ['Wherever His Majesty can see me.', 'And you at the foot, nephew. Everybody sits there the first time. I did.'], ['전하께서 보시는 자리 어디든.', '자넨 말석일세, 조카. 처음엔 누구나 거기 앉지. 나도 그랬네.']),
			P(
				'They share a surname and stand an arm’s length apart, like two men who have been told they’re related and are each waiting for the other to prove it.',
				'둘은 성이 같고, 팔 하나 거리를 두고 선다. 친척이라는 말을 듣고서, 서로 상대가 증명해 보이기를 기다리는 두 사내처럼.'
			),
			P('The inner door opens again. The second pot of tea comes in with the king.', '안쪽 문이 다시 열린다. 두 번째 주전자가 왕과 함께 들어온다.'),
			S('The Chamber', '회의실')
		);

		set(hs, get(hs, 'The chamber is already loud when Yeon arrives'), {
			html: 'The chamber is loud before the king has sat down — not with strategy, with arithmetic. Every banner wants a larger share of the same winter grain.',
			ko: '왕이 앉기도 전에 전각은 시끄럽다 — 전략이 아니라 셈으로. 깃발마다 같은 겨울 군량의 더 큰 몫을 원한다.'
		});
		const swords = get(hs, 'Five swords sit at this table');
		set(hs, swords, {
			html: swords.html.replace('nicked from the Mohe frost', 'nicked on Khitan bridles'),
			ko: swords.ko.replace('말갈 서리에 이 빠진 자국', '거란 굴레에 이 빠진 자국')
		});
		after(
			hs,
			get(hs, 'The clerk who only keeps the minutes'),
			P('The king asks the South first. He always does. The North has to clear his throat twice to get the royal eye, and the West doesn’t bother.', '왕은 남부에게 먼저 묻는다. 늘 그렇다. 북부는 헛기침을 두 번 해야 왕의 눈길을 받고, 서부는 애쓰지도 않는다.'),
			D('yeongnyu', ['Commander Son. Before the granary. How are my passes?'], ['손 대가. 곳간 얘기 전에. 짐의 고개들은 어떠한가?']),
			D('southcmd', ['Open, Majesty. Both ways, for now.', 'Give me the levy, and they’ll only open one way.'], ['열려 있사옵니다, 전하. 아직은 양쪽으로.', '징병을 내려 주시면 한쪽으로만 열리게 하겠사옵니다.']),
			D('yeongnyu', ['Good. Good. That is what we like to hear.'], ['좋구나. 좋아. 짐이 듣고 싶던 말이로다.']),
			D('northcmd', ['Majesty, the Khitans took four hundred head off us at the—'], ['전하, 거란 놈들이 사백 마리를—']),
			D('yeongnyu', ['Yes. Horses. After.'], ['그래. 말. 나중에.']),
			P('Nobody asks the foot of the table anything. Yeon drinks his second cup and counts how long that takes. Then the granary comes back, the way granaries do.', '말석에는 아무도 묻지 않는다. 연은 두 번째 잔을 마시며 그게 얼마나 걸리는지 센다. 그러고는 곳간 얘기가 돌아온다. 곳간 얘기는 늘 돌아온다.')
		);
		set(hs, get(hs, 'At the Western Commander’s stirrup rides a junior warrior'), {
			html: 'The junior warrior with the wandering eye rides at the Western Commander’s stirrup. He held the horses by the gate all afternoon. He saw the man from the East come out early, take his sword off the rack and look at nobody.',
			ko: '한쪽 눈이 제멋대로 도는 그 말단 무사가 서부 대가의 등자 곁에 따른다. 그는 오후 내내 대문 곁에서 말을 붙들고 있었다. 동쪽에서 온 사내가 일찍 나와 시렁에서 제 칼을 집어 들고, 아무도 보지 않고 가는 것도 보았다.'
		});
		reanchor(hs, 'gesomun-seq-pyongyang-wide', 'Five commands ride in at the red two-tier gate');
		reanchor(hs, 'gesomun-seq-pyongyang-gate', 'Yeon comes last, in his father’s place');
		reanchor(hs, 'daeka-yeon-plunges', 'The chamber is loud before the king has sat down');
		done.push('#8 (arrivals)');
	}
	if (!has(hs, 'Nobody’s ever been close enough to say')) {
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
	const DA = {
		en: ['My da. I told a commander that once, at a horse wall in Pyongyang, the year I was your age.', 'He kicked it. It didnae move. He limped off before he ever got my name.'],
		lines: ['우리 아바지가. 너만 할 때 평양 말 매는 담에서 어느 장군한테 그 말을 했디.', '걷어차더라. 꿈쩍도 안 했어. 내 이름 듣기도 전에 절룩거리며 가 버렸디.']
	};
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
			D('yangmanchun', DA.en, DA.lines),
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
	const da = get(ansi, 'My da. I told a commander', (b) => b.person === 'yangmanchun');
	if (da.en[0] !== DA.en[0]) {
		set(ansi, da, { en: [...DA.en], lines: [...DA.lines] });
		done.push('#37 (Pyongyang callback)');
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
