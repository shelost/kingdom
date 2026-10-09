/**
 * Ansi flesh-out: the town before the siege (fire dance, the banquet news, Yeon's messenger, the small army),
 * Lazy-eye's intro card moved here from Yodong, the statue ending, and a junior-warrior cameo in High Summit.
 * Idempotent: each episode skips itself when its marker is present. `DRY=1` prints instead of saving.
 */
import { editStory } from '../story-ops.mjs';
import { makeKit, get, flat } from './invasion-lib.mjs';

const DRY = !!process.env.DRY;
const TOWN = '#9a5c55';

const entry = (story, chapter, title) => {
	const e = story.find((c) => c.id === chapter)?.entries.find((x) => x.title === title);
	if (!e) throw new Error(`missing ${chapter} › ${title}`);
	return e;
};
const must = (x, what) => {
	if (x == null || x === -1) throw new Error(`not found: ${what}`);
	return x;
};
const txt = (b) => [b.html, b.label, b.caption, ...(b.en ?? [])].filter(Boolean).join(' ');

editStory((story) => {
	const { P, S, D } = makeKit(story);
	const who = (speaker, gender, chip = TOWN) => ({ speaker, gender, chip });
	const KKACHI = who('Kkachi', 'f', '#c98a5c');
	const GRANNY = who('Granny', 'f');
	const MASON = who('The mason', 'm');
	const ARCHER = who('Young archer', 'm');
	const WEAVER = who('Weaver', 'f');
	let changed = false;

	/* ───────────── Ansi ───────────── */
	const ansi = entry(story, 'seventh-invasion', 'Ansi');
	if (!flat(ansi.blocks).some((b) => txt(b).includes('Lazy-eye'))) {
		const old = ansi.blocks;
		const at = (pred, what) => must(old.findIndex(pred), what);

		const place = must(old.find((b) => b.kind === 'place'), 'place');
		const empMap = get(ansi, 'The emperor wants Pyongyang.');
		const nameP = get(ansi, 'Nobody writes his name down.');
		const fb = must(old.find((b) => b.kind === 'flashback'), 'flashback');
		const gesStillAlive = get(ansi, 'so that man is still alive');
		const trueMan = get(ansi, 'I have heard that a true man needs only');
		const madman = get(ansi, 'Madman…');
		const yodongScene = must(old.find((b) => b.kind === 'scene' && b.label === 'Yodong'), 'Yodong scene');
		const yodongP = get(ansi, 'He rides home by way of Yodong.');
		const fullMap = must(old.find((b) => b.kind === 'battle' && b.full), 'full battle map');
		const card = old.at(-1);
		if (!/^<b>/.test(card.html ?? '')) throw new Error('Ansi card not last');

		const siege = old.slice(
			at((b) => b.kind === 'scene' && b.label === 'The Earthen Mountain', 'siege start'),
			at((b) => b.kind === 'map' && b.title === 'The Seventh Invasion, start to finish', 'campaign map') + 1
		);
		const bride = old.slice(
			at((b) => b === get(ansi, 'Under the chain mail sits a girl'), 'bride p'),
			at((b) => b.kind === 'dialogue' && b.en?.[0] === 'Nobody told you.', 'bride end') + 1
		);
		if (!fb.blocks.includes(gesStillAlive) || !fb.blocks.includes(trueMan)) throw new Error('flashback changed shape');

		/* Siege inserts: the door callback and the loom, the borrowed bow, the eye. */
		const lintel = siege.indexOf(get(ansi, 'pass their own lintels up the ladder'));
		siege.splice(
			lintel + 1,
			0,
			D(GRANNY, ['See? Give him a door to carry and he dances fine.'], ['봐라. 문짝을 지워 놓으니까 춤이 되네.']),
			D(WEAVER, ['That’s my loom beam. Put it somewhere it’ll do some good.'], ['그거 내 베틀 들보야. 쓸모 있는 데 박아.']),
			D('yangmanchun', ['Top course. Best seat on the wall.'], ['맨 윗단에. 성벽에서 제일 좋은 자리다.'])
		);
		const bow = get(ansi, 'He takes the bow from the archer beside him.');
		bow.html = bow.html.replace('He takes the bow from the archer beside him.', 'He takes the bow out of the young archer’s hands.');
		bow.ko = bow.ko.replace('성주는 옆의 궁수에게서 활을 받아 든다.', '성주는 옆에 선 젊은 궁수의 손에서 활을 빼앗아 든다.');
		if (!bow.html.includes('young archer') || !bow.ko.includes('젊은 궁수')) throw new Error('bow p not rewritten');
		const surgeons = siege.indexOf(get(ansi, 'The surgeons say it is nothing'));
		siege.splice(
			surgeons + 1,
			0,
			D(ARCHER, ['You were aiming for his head.'], ['머리 노리신 거죠.']),
			D('yangmanchun', ['I was aiming for the parasol. The eye did the rest.'], ['일산 노렸어. 나머진 눈이 알아서 했지.'])
		);

		nameP.html = 'Nobody writes his name down. To the people inside the walls he is just Lazy-eye, and that turns out to be enough.';
		nameP.ko = '누구도 그의 이름을 적어 두지 않았다. 성 안 사람들에게 그는 그저 짝눈이였고, 결국 그것으로 충분했다.';

		yodongP.html =
			'The Tang marched Yodong’s people west when they left, seventy thousand of them, roped in lines. What is left is ash, and a stone shrine on the hill with its door open. Inside stands the oldest statue in Goguryeo, black with smoke.';
		yodongP.ko =
			'당군은 물러가며 요동 사람들을 서쪽으로 끌고 갔다. 칠만 명을 줄줄이 엮어서. 남은 건 재와, 언덕 위 문 열린 돌 사당 하나다. 그 안에 고구려에서 제일 오래된 석상이 그을린 채 서 있다.';

		ansi.blocks = [
			P(
				'Every town has one man it would follow off a wall. Ansi’s can’t look at you straight.',
				'어느 고을에나 성벽 아래로라도 따라 뛰어내릴 사내가 하나쯤 있다. 안시의 그 사내는 사람을 똑바로 못 본다.'
			),
			S('Ansi · autumn 642', '안시 · 642년 가을'),
			place,
			P(
				'Ansi is a hill town inside a ring of stone, a day’s ride from the Liao. It grows millet, breeds horses, and goes to bed far too late.',
				'안시는 돌 성벽 안에 들어앉은 산 고을이다. 요하에서 말 타고 하루 거리. 조를 기르고, 말을 치고, 밤에는 너무 늦게 잔다.'
			),
			P(
				'Travellers from the West noticed this a long time ago. They wrote it down, a little scandalised.',
				'서쪽에서 온 길손들은 오래전에 이걸 보았다. 그리고 얼굴을 조금 붉히며 적어 두었다.'
			),
			{
				kind: 'quote',
				hanja: '其民喜歌舞，國中邑落，暮夜男女群聚，相就歌戲。',
				html: 'Its people love to sing and dance. In the towns and villages all over the country, when night falls, men and women gather in crowds and pair off to sing and play.',
				ko: '그 백성은 노래와 춤을 즐긴다. 나라 안 고을과 마을마다 밤이 되면 남녀가 무리 지어 모여 서로 짝을 지어 노래하며 논다.',
				source: 'Records of the Three Kingdoms (三國志), Wei 30, Eastern Barbarians: Goguryeo'
			},
			P(
				'Tonight the fire is in the yard under the east gate. Somebody has brought out a drum. The chief is dancing, which is the worst thing that happens to that drum all year.',
				'오늘 밤 불은 동문 아래 마당에 피었다. 누가 북을 들고 나왔다. 성주가 춤을 추고 있다. 그 북한테는 일 년 중 제일 험한 밤이다.'
			),
			P(
				'He is thirty-two. One of his eyes looks where he looks. The other wanders off on business of its own, and the town has never once let him forget it.',
				'그는 서른둘이다. 한쪽 눈은 그가 보는 데를 본다. 다른 쪽 눈은 제 볼일을 보러 딴 데로 간다. 고을 사람들은 그걸 한 번도 잊게 놔둔 적이 없다.'
			),
			{
				kind: 'card',
				person: 'yangmanchun',
				caption: 'His town calls him Lazy-eye, and he answers to it. The rest of the world never gets his name.',
				ko: '제 고을에선 짝눈이라 불리고, 그렇게 불러도 대답한다. 바깥세상은 끝내 그의 이름을 얻지 못한다.',
				still: '/intro/yangmanchun--yodong.jpg'
			},
			D(KKACHI, ['Lazy-eye! Which one of us are you looking at?'], ['짝눈이 아저씨! 지금 우리 중에 누구 봐?']),
			D('yangmanchun', ['Both. Always both.'], ['둘 다. 늘 둘 다지.']),
			D(GRANNY, ['That’s three times you’ve stepped on my foot.'], ['내 발을 세 번이나 밟았다, 너.']),
			D('yangmanchun', ['Your foot keeps getting in the way, Granny.'], ['할매 발이 자꾸 길을 막잖아요.']),
			D(GRANNY, ['Everything gets in your way. You dance like a man carrying a door.'], ['네 앞엔 뭐든 길을 막지. 문짝 지고 가는 놈처럼 추는구나.']),
			P(
				'In Ansi the girls do the asking. A weaver crosses the circle and takes a young archer by the sleeve. He goes the colour of the fire, and goes.',
				'안시에서는 처녀가 먼저 청한다. 베 짜는 처녀 하나가 춤판을 가로질러 젊은 궁수의 소매를 잡는다. 궁수는 불빛처럼 빨개져서, 따라간다.'
			),
			P(
				'At the edge of the light the mason sits on a block with a cup, squinting at the chief’s face like it owes him money.',
				'불빛 가장자리에 석수가 돌덩이에 걸터앉아 잔을 들고, 빚쟁이 보듯 성주의 얼굴을 노려본다.'
			),
			D(MASON, ['Hold still a minute.'], ['잠깐 가만있어 봐.']),
			D('yangmanchun', ['I’m dancing.'], ['춤추는 중이잖아.']),
			D(MASON, ['Then dance slower. I’m learning your face. One day this town’ll want it in stone.'], ['그럼 천천히 춰. 얼굴 익히는 중이야. 언젠가 이 고을이 그 얼굴을 돌에 새기자고 할 거다.']),
			D('yangmanchun', ['Stone’s for kings and dead men.'], ['돌은 임금이랑 죽은 놈들 거야.']),
			D(MASON, ['Then hurry up and be one or the other.'], ['그럼 둘 중 하나라도 얼른 돼 봐.']),
			P(
				'The drum stops before the rider is through the gate. He has come from Pyongyang without changing horses, and it shows on both of them.',
				'기수가 성문을 다 지나기도 전에 북이 멎는다. 평양에서 말을 갈아타지도 않고 달려왔다. 사람도 말도 그 꼴이다.'
			),
			D(
				who('Rider from Pyongyang', 'm'),
				['Chief— the banquet. In Pyongyang. Yeon shut the doors.', 'The king. The commanders. Every one.'],
				['성주님— 연회가요. 평양에서. 연이 문을 닫았답니다.', '임금님이랑. 대가들이랑. 하나도 안 남기고요.']
			),
			D('yangmanchun', ['…The West too?'], ['…서부도?']),
			D(who('Rider from Pyongyang', 'm'), ['He took their swords. He wears them on his back now.'], ['칼을 거둬 갔답니다. 이제 그걸 등에 메고 다닌대요.']),
			P(
				'Nobody picks the drum back up. The chief turns his back to the fire so the town can’t see his face. It doesn’t help. They can see his shoulders.',
				'아무도 북을 다시 들지 않는다. 성주는 고을 사람들이 얼굴을 못 보게 불을 등지고 선다. 소용없다. 어깨가 다 보인다.'
			),
			{
				kind: 'flashback',
				year: '634',
				title: 'The West Road · 서쪽 길',
				blocks: [
					P(
						'Eight years ago, outside the Summit in Pyongyang, he held his commander’s horse and watched a young man from the East walk out early and look at nobody.',
						'여덟 해 전, 평양 제가회의 바깥에서 그는 제 장군의 말고삐를 잡고 있었다. 동쪽에서 온 젊은 사내 하나가 일찍 나와, 아무도 보지 않고 지나가는 것을 보았다.'
					),
					D('westcmd', ['Depends on the age he’s born into.'], ['어느 시절에 났느냐에 달렸소.'])
				]
			},
			D('yangmanchun', ['…Well.', 'Now we know what age it is.'], ['…그래.', '이제 어느 시절인지 알겠네.']),
			D(KKACHI, ['Lazy-eye? Is there going to be a war?'], ['짝눈이 아저씨? 전쟁 나?']),
			D(GRANNY, ['Somebody pick up the drum. If the world’s ending, it can end on the beat.'], ['누가 북 좀 들어. 세상이 망해도 장단은 맞춰서 망해야지.']),

			S('Ansi · that winter', '안시 · 그해 겨울'),
			P(
				'A few months later, Yeon’s messenger rides the line of the western forts with a red seal and the same short speech for each. Every gate opens. Every lord kneels to the seal.',
				'몇 달 뒤, 연의 사자가 붉은 인장을 들고 서쪽 성들을 차례로 돈다. 성마다 같은 짧은 말을 한다. 성문마다 열린다. 성주마다 인장에 무릎을 꿇는다.'
			),
			P('Then Ansi. The messenger is young, and he has had a very good month.', '그리고 안시. 사자는 젊고, 이번 달 내내 일이 아주 잘 풀렸다.'),
			D(
				who('Yeon’s messenger', 'm', '#d0362f'),
				['The Supreme Commander requires the oath of Ansi. Every fortress on the Liao has given it. Every one.', 'Kneel to the seal, Chief, and we can all go home.'],
				['대막리지께서 안시의 맹세를 받아 오라 하셨소. 요하의 성이란 성은 다 바쳤소. 하나도 빠짐없이.', '인장에 무릎 꿇으시오, 성주. 그럼 다들 집에 갈 수 있소.']
			),
			trueMan,
			D(who('Yeon’s messenger', 'm', '#d0362f'), ['…And whom do you serve?'], ['…그래서, 누굴 섬긴다는 거요?']),
			D('yangmanchun', ['Ask your master. He was at the same dinner.'], ['네 주인한테 물어봐. 그 잔치에 같이 있었으니까.']),
			D('yangmanchun', ['Do you know what happens to traitors, young man...?'], ['반역자가 어떻게 되는지 아느냐, 젊은이…?']),
			D(who('Yeon’s messenger', 'm', '#d0362f'), ['I carry the Supreme Commander’s seal—'], ['나는 대막리지의 인장을—']),
			D('yangmanchun', ['Then he’ll want it back. Send it with the head.'], ['그럼 돌려받고 싶겠지. 머리랑 같이 보내.']),
			P(
				'It is done in the yard, quickly, the way a certain young commander once did it in the snow. Nobody looks away. In Ansi that isn’t fear. They want to see if he flinches. He doesn’t, until he is alone on the wall.',
				'마당에서, 빨리 끝난다. 어느 젊은 장군이 예전에 눈밭에서 하던 식으로. 아무도 눈을 돌리지 않는다. 안시에서 그건 두려움이 아니다. 성주가 움찔하는지 보고 싶은 거다. 그는 움찔하지 않는다. 성벽 위에 혼자 남을 때까지는.'
			),

			S('Ansi · the thaw', '안시 · 얼음 풀릴 무렵'),
			P(
				'Yeon does not come himself. He sends three thousand men. That is an army for a town, not a wall. They come up the valley in the thaw, under red banners. The wall flies the same red.',
				'연은 직접 오지 않는다. 삼천을 보낸다. 고을 하나 치는 군대지, 성벽 치는 군대가 아니다. 그들은 얼음 풀린 골짜기를 붉은 깃발 아래 올라온다. 성벽에도 같은 붉은 깃발이 걸려 있다.'
			),
			D(ARCHER, ['Chief, those are our colours. Who do I shoot?'], ['성주님, 저거 우리 깃발인데요. 누굴 쏴요?']),
			D('yangmanchun', ['The ones walking uphill.'], ['오르막 올라오는 놈들.']),
			P(
				'The whole town is on the wall. The weaver hauls stone. Kkachi runs arrows along the parapet in a basket bigger than she is. The mason heaves over a millstone he spent a year cutting, and watches it go with real grief.',
				'온 고을이 성벽 위에 있다. 베 짜는 처녀는 돌을 나른다. 까치는 제 몸보다 큰 바구니에 화살을 담아 성가퀴를 따라 뛴다. 석수는 일 년 걸려 깎은 맷돌을 밀어 떨어뜨리고, 진심으로 서운한 얼굴로 그게 굴러가는 걸 본다.'
			),
			D(GRANNY, ['Who’s paying for that millstone?'], ['저 맷돌 값은 누가 내냐?']),
			D(MASON, ['Pyongyang. I’ll send somebody to collect.'], ['평양이 내야지. 값 받으러 사람 보낼 거다.']),
			P(
				'At dusk the chief opens the gate, which nobody expects, least of all the men outside it. Half the garrison comes out behind him, and most of the town’s butchers. By dark the valley is quiet. The red banners lie in the mud with their poles snapped.',
				'해 질 녘, 성주가 성문을 연다. 아무도 예상 못 한 일이다. 성 밖의 사내들은 더더욱. 수비병 절반이 그 뒤를 따라 나가고, 고을 백정들도 거의 다 따라 나간다. 어두워질 무렵 골짜기는 조용하다. 붉은 깃발들이 깃대가 부러진 채 진흙에 누워 있다.'
			),
			D(KKACHI, ['Lazy-eye! Your eye was looking the wrong way the whole time!'], ['짝눈이 아저씨! 눈이 내내 딴 데 보고 있었잖아!']),
			D('yangmanchun', ['That’s how I saw them coming.'], ['그래서 오는 게 보였지.']),

			S('Pyongyang', '평양'),
			P(
				'The news reaches Pyongyang with the survivors, who are fewer than the men who left, and much quieter.',
				'소식은 살아 돌아온 자들과 함께 평양에 닿는다. 떠난 자들보다 수가 적고, 훨씬 조용하다.'
			),
			gesStillAlive,
			D('dosuryu', ['Want me to send ten thousand this time?'], ['이번엔 만 명 보낼까?']),
			P('Yeon laughs, once, like a slap.', '연이 한 번, 따귀 같은 웃음을 터뜨린다.'),
			D(
				'gesomun',
				[
					'With farmers. He beat my men with farmers and a drum.',
					'…No. The Tang is counting horses at the Liao. I need every spear facing west, not up some hill.',
					'One wall. Let him keep it. If he’s that good at keeping it, he can keep it from the emperor.'
				],
				[
					'농사꾼들 데리고. 농사꾼이랑 북 하나로 내 군사를 깼다고.',
					'…됐어. 당이 요하에서 말을 세고 있어. 창이란 창은 전부 서쪽을 봐야지, 산꼭대기 볼 때가 아니야.',
					'성 하나다. 가지라고 해. 그렇게 잘 지키면, 황제한테서도 지켜 보라지.'
				],
				{ look: 'supreme' }
			),
			P(
				'So Ansi answers to no one. It keeps the old king’s colours on the wall, and nobody in Pyongyang mentions it at dinner.',
				'그렇게 안시는 누구의 명도 받지 않는다. 성벽에는 옛 왕의 깃발을 그대로 걸어 두고, 평양에서는 아무도 밥상머리에서 그 얘기를 꺼내지 않는다.'
			),

			S('Ansi · summer 645', '안시 · 645년 여름'),
			empMap,
			P(
				'Two summers later the emperor comes. Yodong burns. The forts that knelt to Yeon’s seal fall one after another, and the road to Pyongyang runs right under Ansi’s wall.',
				'두 해 여름이 지나 황제가 온다. 요동이 불탄다. 연의 인장에 무릎 꿇었던 성들이 하나씩 떨어지고, 평양 가는 길은 안시 성벽 바로 아래로 지나간다.'
			),
			nameP,
			...siege,

			S('Ansi · that winter', '안시 · 그해 겨울'),
			P(
				'That winter the mason gets his way. The chief sits for his statue on an upturned basket in the yard, under protest, and the whole town comes to supervise.',
				'그해 겨울, 석수는 결국 뜻을 이룬다. 성주는 마당에 엎어 놓은 광주리에 앉아, 투덜대며, 석상의 본이 된다. 온 고을이 감독하러 나온다.'
			),
			D(MASON, ['Hold still.'], ['가만있어.']),
			D('yangmanchun', ['I am holding still.'], ['가만있잖아.']),
			D(MASON, ['Your eye isn’t.'], ['눈은 안 가만있어.']),
			D(KKACHI, ['Do the eye! Carve the lazy eye!'], ['눈도 해! 짝눈도 새겨!']),
			D('yangmanchun', ['Don’t you dare do the eye.'], ['눈은 하기만 해 봐.']),
			D(MASON, ['I’m doing the eye.'], ['눈 하는 중이야.']),
			D(KKACHI, ['Who got the very first statue? Ever?'], ['맨 처음 석상은 누구 거였어? 제일 처음.']),
			D(MASON, ['The Holy King. In the shrine at Yodong. Older than this wall.'], ['성왕님. 요동 사당에 있지. 이 성벽보다 오래됐어.']),
			D(KKACHI, ['Who was he?'], ['그게 누군데?']),
			D(MASON, ['Everybody knows who he was.'], ['그분이 누군지는 다들 알지.']),
			D(KKACHI, ['So who?'], ['그러니까 누구?']),
			P(
				'The chisel stops. The mason looks at Granny. Granny looks at the fire. It turns out everybody knows, and nobody can tell it.',
				'끌이 멈춘다. 석수가 할매를 본다. 할매는 불을 본다. 알고 보니 다들 알고는 있는데, 아무도 얘기할 줄은 모른다.'
			),
			D('yangmanchun', ['Don’t look at me. I only know the part with the bow.'], ['나 보지 마. 난 활 나오는 대목밖에 몰라.']),
			P(
				'Nobody writes down what became of him after that winter. The statue kept the eye.',
				'그 겨울 뒤로 그가 어떻게 되었는지는 아무도 적어 두지 않았다. 석상은 그 눈을 간직했다.'
			),

			yodongScene,
			P(
				'A day’s ride from Ansi, a rider in red comes up the empty road from Pyongyang, alone, and stops at Yodong. He goes no farther. Nobody on that wall has asked him to.',
				'안시에서 말로 하루 거리. 붉은 옷의 기수 하나가 평양에서 텅 빈 길을 홀로 올라와 요동에서 멈춘다. 더는 가지 않는다. 그 성벽 위의 누구도 오라고 한 적이 없다.'
			),
			madman,
			yodongP,
			...bride,
			fullMap,
			card
		];

		ansi.logline = {
			en: 'Ansi dances all night, follows a man with a lazy eye, and answers to no one. Now the emperor is at the gate.',
			ko: '안시는 밤새 춤추고, 짝눈이 사내를 따르고, 누구의 명도 받지 않는다. 이제 황제가 성문 앞에 있다.'
		};
		const reanchor = { 'stone-heroes-2': 'That winter the mason gets his way', 'yangmanchun-wall-close': 'until he is alone on the wall' };
		for (const im of ansi.images ?? []) if (reanchor[im.id]) im.at = reanchor[im.id];
		changed = true;
	}

	/* ───────────── Yodong: the Guardian's card now lives in Ansi ───────────── */
	const yodong = entry(story, 'seventh-invasion', 'Yodong');
	const yc = yodong.blocks.findIndex((b) => b.kind === 'card' && b.person === 'yangmanchun');
	if (yc >= 0) {
		yodong.blocks.splice(yc, 1);
		changed = true;
	}

	/* ───────────── High Summit: the junior warrior on the West Road ───────────── */
	const summit = entry(story, 'samhan', 'High Summit');
	if (!summit.blocks.some((b) => b.kind === 'scene' && b.label === 'The West Road')) {
		const late = summit.blocks.findIndex((b) => b.kind === 'dialogue' && b.en?.[0] === 'Then we’re two hundred years late. Get the horses.');
		must(late, 'High Summit horses line');
		const tent = get(summit, 'That night, in the tent, a rider finds him.');
		tent.html = tent.html.replace('That night, in the tent, a rider finds him.', 'That night, in Yeon’s tent, a rider finds him.');
		tent.ko = tent.ko.replace('그날 밤, 천막에서 전령이 그를 찾는다.', '그날 밤, 연의 천막에서 전령이 그를 찾는다.');
		if (!tent.ko.includes('연의 천막')) throw new Error('tent ko not rewritten');
		const JUNIOR = { speaker: 'Junior warrior', gender: 'm' };
		summit.blocks.splice(
			late + 1,
			0,
			S('The West Road', '서쪽 길'),
			P(
				'The Summit ends at dusk, without him. The commanders ride home the way they came in, by rank. The West goes last. The West always has the farthest to go.',
				'제가회의는 해 질 녘에, 그 없이 끝난다. 대가들은 들어올 때처럼 서열대로 돌아간다. 서부가 맨 끝이다. 서부는 언제나 갈 길이 제일 멀다.'
			),
			P(
				'At the Western Commander’s stirrup rides a junior warrior of twenty-four, with one eye that wanders. He held the horses by the gate all afternoon. He saw the man from the East come out early, take his sword off the rack and look at nobody.',
				'서부 대가의 등자 곁에 스물네 살 먹은 말단 무사 하나가 따른다. 한쪽 눈이 제멋대로 돈다. 그는 오후 내내 대문 곁에서 말을 붙들고 있었다. 동쪽에서 온 사내가 일찍 나와 시렁에서 제 칼을 집어 들고, 아무도 보지 않고 가는 것도 보았다.'
			),
			D(JUNIOR, ['Sir. The one from the East…', 'Is he mad?'], ['장군님. 그 동쪽 분 말입니다…', '미친 겁니까?']),
			D('westcmd', ['No.', 'He is a man who finishes the job in front of him. Whatever it costs. Whoever pays.'], ['아니오.', '제 앞에 놓인 일은 기어이 끝내고 마는 사람이오. 값이 얼마든. 누가 치르든.']),
			D(JUNIOR, ['Isn’t that good? In a soldier?'], ['그럼 좋은 것 아닙니까? 군인한테는.']),
			D(
				'westcmd',
				[
					'Depends on the age he’s born into.',
					'In a quiet one, a man like that burns the house down. In a bad one…',
					'…And stop looking at me with that eye. I can never tell which half of you is listening.'
				],
				['어느 시절에 났느냐에 달렸소.', '태평한 때라면 그런 사람은 집을 태워 먹지. 험한 때라면…', '…그리고 그 눈으로 날 보지 마시오. 어느 쪽이 듣고 있는지 통 모르겠으니.']
			),
			D(JUNIOR, ['Both, sir.'], ['둘 다입니다, 장군님.']),
			P(
				'The commander never finishes the other half of his sentence. It is a long way to the Liao. The road is quiet, and he would like it to stay that way for whatever time he has left.',
				'대가는 끝내 그 말의 나머지 반을 하지 않는다. 요하까지는 먼 길이다. 길은 조용하고, 그는 남은 날 동안 길이 그렇게 조용하기를 바란다.'
			)
		);
		changed = true;
	}

	if (DRY) {
		for (const e of [ansi, summit]) {
			console.log(`\n===== ${e.title} =====`);
			flat(e.blocks).forEach((b, i) => console.log(`[${i}] ${b.kind} ${b.person ?? b.speaker ?? ''}: ${(b.en ?? []).join(' / ') || txt(b)}`.slice(0, 220)));
		}
		return false;
	}
	console.log(changed ? 'ansi: saved' : 'ansi: already applied');
	return changed;
});
