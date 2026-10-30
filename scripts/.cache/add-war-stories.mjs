/** Sona, Talgi, and Ondal — three war stories from the histories. */
import { editStory } from './story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const d = (person, en, lines, chip) => ({
	kind: 'dialogue',
	person,
	en,
	lines,
	...(chip ? { chip } : {})
});

const sona = {
	year: '675',
	sub: 'Spring',
	tone: 'grim war epic',
	subtitle: '소나',
	logline: {
		en: 'He had already chosen the death. The hemp chose the morning.',
		ko: '죽을 자리는 이미 정해 두었다. 아침을 고른 건 삼밭이다.'
	},
	badges: ['flag:silla'],
	title: 'Sona',
	images: [],
	kinds: ['battle'],
	cast: ['sona', 'hanseon', 'munmu'],
	blocks: [
		p(
			'Sona had already chosen his death. He was only waiting on a morning.',
			'소나는 죽을 자리를 이미 정해 두었다. 기다리는 건 아침뿐이었다.'
		),
		p(
			'Some men called him the gold river. He never corrected them. His father had soldiered on the same northern road, and the road had kept the son.',
			'어떤 이들은 그를 금내라 불렀다. 그는 고치지 않았다. 아비도 같은 북쪽 길의 군인이었고, 길이 아들을 붙잡았다.'
		),
		p(
			'After Baekje fell, the north got loud. The governor of that road asked the king for one man who would stay. The king sent Sona to a fort called Adal, and did not send an army with him.',
			'백제가 무너진 뒤 북쪽은 시끄러워졌다. 그 길의 도독이 임금에게 남을 사람 하나를 청했다. 임금은 소나를 아달성이라는 성에 보냈고, 군사는 같이 보내지 않았다.'
		),
		p(
			'He liked one sentence. A man dies in a fight. He does not die in a bed, with his family taking turns at his hands.',
			'그가 좋아하는 문장은 하나였다. 사내는 싸움에서 죽는다. 자리에 누워, 식구가 번갈아 손을 잡는 죽음은 싫다.'
		),
		p('The governor picked a day in spring.', '도독이 봄의 하루를 골랐다.'),
		d(
			'hanseon',
			[
				'Out. All of you. The hemp goes in today.',
				'Anyone still in the fort pays.'
			],
			['나갑니다. 전부. 오늘은 삼을 심는 날입니다.', '성에 남은 사람은 벌입니다.'],
			'#6fa8ff'
		),
		d('sona', ['The soldiers too?'], ['군사도 말입니까?'], '#c4a574'),
		d(
			'hanseon',
			['The soldiers first. The field is the order.'],
			['군사부터입니다. 밭이 명령입니다.'],
			'#6fa8ff'
		),
		d('sona', ['Then leave me the wall.'], ['그러면 성벽은 저에게 남겨 두십시오.'], '#c4a574'),
		p(
			'A man from the ridges was in the market with a sack. He heard the day. He left the sack.',
			'산등성이에서 온 사내가 자루를 들고 장에 있었다. 그 날을 들었다. 자루를 두고 갔다.'
		),
		p(
			'On the morning, the fort was in the fields. Seed in the hands, backs to the wall. The old and the children stayed inside. Sona stayed, because a wall with nobody on it is a rumour.',
			'그날 아침, 성은 밭에 가 있었다. 손에 씨앗, 등은 성 쪽. 노인과 아이들은 안에 남았다. 소나도 남았다. 사람이 없는 성벽은 소문이니까.'
		),
		p(
			'They came while the hemp was still seed. Riders, and bows, and no interest in a speech. They wanted what a fort keeps when its men are bent over a furrow.',
			'삼이 아직 씨앗일 때 그들이 왔다. 기병, 활, 연설에는 관심 없음. 사내들이 이랑에 허리를 굽힌 사이, 성이 지키는 것이 탐났다.'
		),
		p(
			'Sona went out of the gate alone. The riders would not come near him. They only shot.',
			'소나는 문 밖으로 혼자 나갔다. 기병들은 가까이 오지 않았다. 쏘기만 했다.'
		),
		p('He shot back.', '그도 쏘아 댔다.'),
		p(
			'The day went. The arrows went into him and stayed. By the end he looked like a hedgehog that had learned how to stand.',
			'하루가 갔다. 화살은 그에게 박힌 채로 남았다. 끝날 때 그는, 서는 법을 배운 고슴도치처럼 보였다.'
		),
		p('Then he did not stand.', '그러고는 서 있지 못했다.'),
		p(
			'The boys on the wall could finish his sentence without him.',
			'성벽 위의 아이들은 그 없이도 그의 문장을 끝낼 수 있었다.'
		),
		p(
			'The king heard it from a clerk who had not wanted the errand. He cried, which the clerks agreed not to see, and he gave the dead man a rank. A strange thing to send to a grave.',
			'임금은 심부름이 싫었던 서리에게서 그 소식을 들었다. 울었다. 서리들은 못 본 척하기로 했다. 그는 죽은 사람에게 벼슬을 내렸다. 무덤으로 보내기엔 이상한 물건이다.'
		),
		d('munmu', ['He asked for the wall. I gave him a title. Tell his house.'], ['성벽을 달라 했소. 나는 벼슬을 줬소. 집에 전하게.'], '#C41E3A'),
		p(
			'Kangrim reads the name three times on the grass. Sona. Sona. Sona.',
			'강림이 풀 위에서 이름을 세 번 읽는다. 소나. 소나. 소나.'
		),
		d(
			'kangrim',
			['Sona.', 'Question: were you keeping the sentence — or were you angry they came while the seed was still in the hand?'],
			['소나.', '질문: 그 문장을 지키려 한 겁니까 — 아니면 씨앗이 아직 손에 있는데 그들이 온 게 분했던 겁니까?'],
			'#5f5f6b'
		),
		d('sona', ['The sentence.', 'A bed was never on offer.'], ['문장이오.', '자리는 처음부터 없었소.'], '#c4a574'),
		p(
			'<b>Kim Punghun said he could wait for a ship. The ship is here…!</b>',
			'<b>김풍훈은 배만 있으면 기다릴 수 있다 했다. 배가 왔다…!</b>'
		)
	]
};

const talgi = {
	year: '675',
	sub: 'Autumn',
	tone: 'grim war epic',
	subtitle: '탈기',
	logline: {
		en: 'The fort had no soldiers. It had a town.',
		ko: '성에는 군사가 없었다. 고을이 있었다.'
	},
	badges: ['flag:silla'],
	title: 'Talgi',
	images: [],
	kinds: ['siege'],
	cast: ['talgi', 'red-tree-gate'],
	blocks: [
		p('A town is a poor kind of fort. It has to be both.', '고을은 형편없는 성이다. 둘 다여야 하니까.'),
		p(
			'Red Tree sat on the northern road with a magistrate and no garrison. His name was Talgi. He knew the houses. That was the roll.',
			'적목은 북쪽 길에 있었다. 현령은 있고 수비대는 없었다. 이름은 탈기. 그는 집을 알았다. 그게 명부였다.'
		),
		p(
			'Maeso had been won, and the riders were still hungry. They came and sat down around Red Tree the way a dog sits down around a bowl.',
			'매소는 이겼고, 기병들은 여전히 배고팠다. 그들은 와서 적목 둘레에 앉았다. 개가 그릇 둘레에 앉듯.'
		),
		d(
			'red-tree-gate',
			['Open it.', 'The children are still in the furrows. If we—'],
			['엽시다.', '애들은 아직 이랑에 있어요. 우리만—'],
			'#8a8882'
		),
		d(
			'talgi',
			['The furrows are already theirs.', 'The gate is ours. It stays shut.'],
			['이랑은 이미 놈들 거야.', '문은 우리 거고. 안 연다.'],
			'#6fa8ff'
		),
		d('red-tree-gate', ['Ours. We don’t have soldiers.'], ['우리라뇨. 군사가 없는데요.'], '#8a8882'),
		d(
			'talgi',
			['No soldiers. People. Count the houses if you want a number.'],
			['군사는 없어. 사람은 있어. 숫자가 필요하면 집을 세.'],
			'#6fa8ff'
		),
		p(
			'They held. Then they did not. The clerk’s report is rude, and short. Strength failed. All of them.',
			'버텼다. 그러고는 못 버텼다. 서리의 보고는 무례하고 짧다. 힘이 다했다. 모두.'
		),
		p(
			'Talgi was still at the bar when the bar stopped being a gate.',
			'탈기는 빗장이 문이기를 그만둘 때까지 그 앞에 있었다.'
		),
		p('Kangrim reads the name three times in the wreck of the gate. Talgi. Talgi. Talgi.', '강림이 부서진 문에서 이름을 세 번 읽는다. 탈기. 탈기. 탈기.'),
		d(
			'kangrim',
			['Talgi.', 'Question: were you saving the town — or dying with it?'],
			['탈기.', '질문: 고을을 지키려 한 겁니까 — 고을과 죽으려 한 겁니까?'],
			'#5f5f6b'
		),
		d(
			'talgi',
			['The ones who opened a gate are already dead. They’re in the furrows.', 'I stayed with the houses.'],
			['문 연 사람들은 이미 죽었어요. 이랑에.', '나는 집들 옆에 남았습니다.'],
			'#6fa8ff'
		),
		p(
			'<b>One last river mouth. One captain who has never won a fight. Three tries to end a war…!</b>',
			'<b>마지막 강어귀. 한 번도 이겨 본 적 없는 선장 하나. 전쟁을 끝낼 기회는 세 번…!</b>'
		)
	]
};

const ondal = {
	year: '590',
	tone: 'war legend',
	subtitle: '온달',
	logline: {
		en: 'A king made a joke. His daughter went and collected it.',
		ko: '임금이 농담을 했다. 딸이 가서 그 농담을 데려왔다.'
	},
	badges: ['flag:goguryeo'],
	title: 'Ondal',
	images: [],
	kinds: ['battle', 'love'],
	cast: ['ondal', 'pyeonggang', 'ondal-mother'],
	blocks: [
		p(
			'There was a fool in Goguryeo, and for once the fool agreed.',
			'고구려에 바보가 하나 있었다. 드물게도, 바보 자신이 동의했다.'
		),
		p(
			'Ondal begged, and lived with his blind mother, and owned a face people laughed at before he spoke. When the king’s daughter cried, which was often, the tired king said he would marry her to Ondal. The court laughed. The girl kept it.',
			'온달은 구걸했고, 눈먼 어미와 살았고, 말보다 먼저 웃음이 나오는 얼굴을 가졌다. 임금의 딸이 울면, 자주는 울었는데, 지친 임금은 그 애를 온달에게 주겠다고 했다. 조정이 웃었다. 아이는 그 말을 보관했다.'
		),
		p(
			'She grew up. She went to the hut with a horse, a bow, and a face that had finished deciding.',
			'그녀는 자랐다. 말 한 필, 활 하나, 그리고 결정을 끝낸 얼굴을 들고 오두막으로 갔다.'
		),
		d('ondal', ['You’ve got the wrong door.', 'The joke was— I’m the joke.'], ['문 잘못 찾았어.', '농담이었잖아— 내가 농담이고.'], '#c45a3a'),
		d(
			'ondal-mother',
			['Fool.', 'A princess walked all this way, and you are doubting her on the step.'],
			['바보야.', '공주가 여기까지 걸어왔는데, 문지방에서 의심을 해?'],
			'#8a7048'
		),
		d(
			'pyeonggang',
			['It was a joke. I didn’t laugh.', 'So now it’s true. Open the door.'],
			['농담이었지. 나는 안 웃었고.', '그래서 이제 진담이야. 문 열어.'],
			'#e8a04a'
		),
		d('ondal', ['I can’t even stay on a horse.'], ['나 말에 붙어 있지도 못해.'], '#c45a3a'),
		d('pyeonggang', ['Then you’ll learn. I brought the bow.'], ['그러면 배우면 돼. 활은 내가 가져왔다.'], '#e8a04a'),
		p(
			'She was not kind about the learning. He fell. She put him back on. The horse got tired of both of them before either one quit.',
			'가르치는 태도는 친절하지 않았다. 그는 떨어졌다. 그녀는 다시 태웠다. 둘 중 누가 그만두기 전에 말이 먼저 둘 다에게 질렸다.'
		),
		p(
			'At the royal hunt he came back with the boar, and with mud, and with the laugh still on the court’s mouth and nowhere to put it. A fool is funny until he wins. Then he is a problem.',
			'임금의 사냥에서 그는 멧돼지를 가지고 돌아왔고, 진흙도 가지고 돌아왔다. 웃음은 아직 조정의 입에 있었는데, 둘 곳이 없어졌다. 바보는 이길 때까지 우습다. 이기면 문제가 된다.'
		),
		p(
			'Years on, a new king wanted a river fort the southerners were sitting in. He sent Ondal, because Ondal had gotten good, and because the court still owed itself a laugh.',
			'몇 해가 지나, 새 임금은 남쪽 사람들이 눌러 앉은 강의 성을 원했다. 온달을 보냈다. 온달이 잘하게 되어서, 그리고 조정이 아직 자기에게 웃음을 빚지고 있어서.'
		),
		p('An arrow found him under the wall. He had time to look surprised, which was his old face.', '화살 하나가 성 아래에서 그를 찾았다. 놀랄 시간은 있었다. 그 얼굴은 옛 얼굴이었다.'),
		p(
			'Kangrim reads the name three times in the ditch. Ondal. Ondal. Ondal.',
			'강림이 도랑에서 이름을 세 번 읽는다. 온달. 온달. 온달.'
		),
		d(
			'kangrim',
			['Ondal.', 'Question: were you the fool — or the man she refused to leave a fool?'],
			['온달.', '질문: 바보였습니까 — 아니면 그녀가 바보로 두지 않은 사람입니까?'],
			'#5f5f6b'
		),
		d('ondal', ['I was the fool.', 'She wouldn’t allow it.'], ['나는 바보였소.', '그 여자가 허락을 안 했소.'], '#c45a3a'),
		p(
			'They put him in a box. The box would not move. Horses, ropes, curses, a priest. It sat in the road like a man who has not finished a conversation.',
			'그를 궤에 넣었다. 궤가 움직이지 않았다. 말, 밧줄, 욕, 무당. 대화를 끝내지 않은 사람처럼 길 한가운데 앉아 있었다.'
		),
		p('She came down the road. She put a hand on the lid.', '그녀가 길을 따라 내려왔다. 뚜껑에 손을 얹었다.'),
		d('pyeonggang', ['It’s decided.', 'You can go.'], ['결정난 일이야.', '가.'], '#e8a04a'),
		p('The box went.', '궤가 갔다.'),
		p(
			'<b>The prince who will beg has a son. Bupmin is fifteen now, and his uncle has one question: which rule will you break first…?</b>',
			'<b>언젠가 빌러 갈 그 왕자에게는 아들이 있다. 법민이 열다섯이 되었고, 외숙에게는 질문이 하나 있다. 어느 계율을 제일 먼저 어기겠느냐…?</b>'
		)
	]
};

function words(entry) {
	const bits = [];
	for (const b of entry.blocks) {
		if (b.html) bits.push(b.html.replace(/<[^>]+>/g, ''));
		if (b.en) bits.push(b.en.join(' '));
	}
	return bits.join(' ').split(/\s+/).filter(Boolean).length;
}

const out = editStory((story) => {
	const chs = story.chapters;
	const sam = chs.find((c) => c.id === 'samhan');
	const war = chs.find((c) => c.id === 'silla-tang-war');
	if (sam.entries.some((e) => e.title === 'Ondal')) return false;
	const g = sam.entries.findIndex((e) => e.title === 'Gwanggaeto, the Great King');
	const last = sam.entries[g].blocks.filter((b) => b.kind === 'p').at(-1);
	last.html =
		'<b>A Goguryeo king once promised his crying daughter to a fool. She went and collected him…!</b>';
	last.ko = '<b>고구려 임금이 우는 딸을 바보에게 주겠다고 한 적이 있다. 딸은 가서 그 바보를 데려온다…!</b>';
	sam.entries.splice(g + 1, 0, ondal);

	const guest = war.entries.find((e) => e.title === "The Wanggeom's Guest");
	const gLast = guest.blocks.filter((b) => b.kind === 'p').at(-1);
	gLast.html = '<b>Before the ship, the north plants hemp. A man there has already chosen his death…!</b>';
	gLast.ko = '<b>배가 오기 전에, 북쪽은 삼을 심는다. 그곳의 사내는 죽을 자리를 이미 정해 두었다…!</b>';

	const maeso = war.entries.findIndex((e) => e.title === 'Maeso');
	const mLast = war.entries[maeso].blocks.filter((b) => b.kind === 'p').at(-1);
	mLast.html = '<b>Maeso is won. A town with no soldiers is still on the map…!</b>';
	mLast.ko = '<b>매소는 이겼다. 군사가 없는 고을이 아직 지도 위에 있다…!</b>';
	war.entries.splice(maeso, 0, sona);
	const after = war.entries.findIndex((e) => e.title === 'Maeso');
	war.entries.splice(after + 1, 0, talgi);
	return { sona: words(sona), talgi: words(talgi), ondal: words(ondal) };
});

console.log(out);
