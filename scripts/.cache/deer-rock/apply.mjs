// Deer Rock (632): the old Premier dies, King Mu revives the sealed-box rite on the Rock of Politics
// (Samguk Yusa bk. 2), and Satek Jijuk takes the chair with a jar of brine and a seal that had time to dry.
// Inserted after Eight Great Clans; the Gunchogo lead-in card moves from Eight Great Clans to here.
// Idempotent: skipped when the Deer Rock entry already exists.
import fs from 'node:fs';

const FILE = 'src/lib/data/story.json';

const p = (html, ko) => ({ kind: 'p', html, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const d = (person, en, lines) => ({ kind: 'dialogue', person, en, lines });
const extra = (speaker, chip, gender, en, lines) => ({ kind: 'dialogue', chip, speaker, gender, en, lines });

const MU = (en, ko) => d('kingmu', en, ko);
const EUIJA = (en, ko) => d('euija', en, ko);
const JIJUK = (en, ko) => d('ministersatek', en, ko);
const SATEK = (en, ko) => d('eldersatek', en, ko);
const YUNBI = (en, ko) => d('elderyunbi', en, ko);
const GYEBEK = (en, ko) => d('gyebek', en, ko);

const BLOCKS = [
	p(
		'Every house in Sabi agrees that heaven chooses the Premier. They only disagree about which house heaven owes money.',
		'사비의 모든 가문이 동의한다. 상좌평은 하늘이 고른다고. 다만 하늘이 어느 집에 빚을 졌는지를 두고 다툴 뿐이다.'
	),
	scene('The Empty Chair', '빈 의자'),
	p(
		'The old Premier dies at the end of summer, in his own bed, which in Sabi counts as a surprise. His chair is still warm when the bidding starts.',
		'늙은 상좌평이 여름 끝에 제 침상에서 죽는다. 사비에서는 그것도 놀랄 일이다. 의자가 식기도 전에 값 매기기가 시작된다.'
	),
	p(
		'By the third day, Elder Yunbi has bought four of the eight houses. On the rock, four is enough. Everyone in Sabi knows the price, down to the fishwives.',
		'사흘째, 연비 원로는 여덟 가문 중 넷을 샀다. 바위 위에서는 넷이면 된다. 값이 얼마였는지는 사비 사람이면 생선 장수 아낙까지 안다.'
	),
	p(
		'King Mu hears the price over breakfast and laughs so hard he has to put the bowl down.',
		'무왕은 아침상 앞에서 그 값을 듣고, 그릇을 내려놓아야 할 만큼 웃는다.'
	),
	MU(
		['Four houses. For one chair.', 'Yunbi’s paid for a Premier. Fine. Let’s see if he’s paid the rock.'],
		['가문 넷. 의자 하나에.', '연비가 상좌평 값을 치렀다. 좋지. 바위 값도 치렀나 보자.']
	),
	EUIJA(
		['The rock, Father? Nobody’s asked the rock anything since Great-grandfather’s day.', 'Ha! You want a stone to pick who runs Baekje?'],
		['바위 말입니까, 아바마마? 증조부 때 이후로 그 바위한테 뭘 물어본 사람이 없습니다.', '하! 백제를 누가 맡을지 돌한테 고르라 하시겠다고요?']
	),
	MU(['Stones don’t take money.', '…Well. Not directly. That’s the fun of it.'], ['돌은 돈을 안 받지.', '…뭐. 대놓고는 안 받지. 그게 재밌는 거다.']),
	p(
		'Here is how the rock works, according to a monk who wrote it down six hundred years later and was not there either.',
		'바위가 어떻게 돌아가는지는 육백 년 뒤에 이걸 적어 둔 스님의 말을 빌리자. 그 스님도 거기 있지는 않았다.'
	),
	{
		kind: 'quote',
		html: 'At Hoam Temple there is a Rock of Government. When the country was to choose a chief minister, they wrote the names of the candidates, three or four of them, sealed them in a box and set it on the rock. After a little while they took it down and looked. The man whose name bore the mark of a seal became minister. That is how the rock got its name.',
		ko: '또 호암사에 정사암이 있다. 나라에서 재상을 뽑으려 할 때, 뽑힐 만한 사람의 이름을 서넛 써서 함에 넣어 봉하고 바위 위에 두었다. 얼마 뒤 가져다 보아, 이름 위에 도장 자국이 있는 사람을 재상으로 삼았다. 그래서 그렇게 이름 붙였다.',
		hanja: '又虎嵓寺有政事嵓。國家將議宰相，則書當選者名，或三四，函封置嵓上，須臾取看，名上有印跡者爲相，故名之。',
		source: 'Samguk Yusa (三國遺事) bk. 2, Nambuyeo · Jeon-Baekje'
	},
	p(
		'“A little while,” the monk says. In Sabi a little while is exactly one night, which is long enough for every house on the rock to help heaven make up its mind.',
		'“얼마 뒤”라고 스님은 적었다. 사비에서 ‘얼마 뒤’는 딱 하룻밤이다. 바위 위의 모든 가문이 하늘의 결심을 거들기에 넉넉한 시간이다.'
	),
	MU(
		['Three names. In the box, on the rock, under my seal.', 'Whoever heaven marks by morning gets the chair. Whoever squeals about it can take it up with heaven.'],
		['이름 셋. 함에 넣어, 바위 위에, 내 도장으로 봉한다.', '아침까지 하늘이 찍어 준 놈이 의자를 갖는다. 거기 대고 꽥꽥대는 놈은 하늘한테 가서 따지라 해.']
	),
	EUIJA(['And when one of them helps heaven along?'], ['그중 하나가 하늘을 거들면요?']),
	MU(
		['Then I’ll know which one’s cleverest. That’s the one I want in the chair.', 'Rich I can buy, boy. Clever I have to find.'],
		['그럼 누가 제일 영리한지 알게 되겠지. 의자엔 그런 놈이 앉아야 한다.', '부자는 사면 된다, 이놈아. 영리한 놈은 찾아야 하고.']
	),
	scene('Three Names', '이름 셋'),
	{
		kind: 'place',
		place: 'deer_rock',
		html: 'A long grey rock above the river, with a temple tucked under it like a servant. Eight benches face it. Nobody has sat on the rock itself in a hundred years.',
		ko: '강 위로 길게 누운 회색 바위. 그 아래 절 하나가 하인처럼 웅크리고 있다. 여덟 걸상이 바위를 마주한다. 바위 위에 직접 앉은 사람은 백 년 동안 없었다.'
	},
	p(
		'Three names go in at sunset. Elder Yunbi, who has paid for four houses. Lord Jinmo, who has paid for one and is praying. And a Satek nobody expected.',
		'해 질 녘에 이름 셋이 들어간다. 가문 넷 값을 치른 연비 원로. 하나 값을 치르고 기도 중인 진모 공. 그리고 아무도 예상하지 못한 사택 하나.'
	),
	p(
		'Elder Satek has not put in his own name. He has put in his kinsman’s. Satek Jijuk is thirty-five. He has never bought anything bigger than a boat, and he talks in sentences so short that nobody has ever managed to quote him.',
		'사택 원로는 제 이름을 넣지 않았다. 일가붙이의 이름을 넣었다. 사택지적, 서른다섯. 배보다 큰 걸 사 본 적이 없고, 말이 하도 짧아서 아무도 그의 말을 옮겨 적지 못했다.'
	),
	YUNBI(['You’ve sent a boy, Satek.', 'Short of money, or short of nerve?'], ['애를 보냈구려, 사택.', '돈이 모자라오, 간이 모자라오?']),
	SATEK(
		['Short of nothing. The tide’s coming in, Yunbi.', 'I sent the man who reads tides.'],
		['모자란 건 없소. 물이 들어오고 있소, 연비.', '물때 읽는 사람을 보냈을 뿐이오.']
	),
	p(
		'By custom each man writes his own name on his own slip and folds it himself. A Premier should at least be able to spell his ambition.',
		'관례상 각자 제 쪽지에 제 이름을 쓰고 제 손으로 접는다. 상좌평이 되려면 적어도 제 욕심 정도는 제 손으로 쓸 줄 알아야 하니까.'
	),
	p(
		'Jijuk writes slowly. He folds his slip three times, small and tight, the way a harbour clerk folds a bill he fully expects to be paid.',
		'지적은 천천히 쓴다. 쪽지를 세 번, 작고 단단하게 접는다. 항구 서기가 꼭 받아 낼 어음을 접듯이.'
	),
	p(
		'Then he does the one strange thing anybody notices. He has a servant carry up a jar from the river mouth, and he pours it over the rock, slowly, end to end.',
		'그러고는 누구나 눈치챌 만한 이상한 짓을 하나 한다. 하인을 시켜 강어귀에서 단지 하나를 지고 올라오게 하더니, 그걸 바위에 천천히, 끝에서 끝까지 붓는다.'
	),
	YUNBI(['What is that.'], ['그게 뭐요.']),
	JIJUK(['Sea water. My house blesses things with the sea.', 'It’s an old custom.'], ['바닷물이오. 우리 집은 바다로 축원하오.', '오래된 법이오.']),
	YUNBI(['How old.'], ['얼마나 오래됐소.']),
	JIJUK(['Since this afternoon.'], ['오늘 오후부터.']),
	p(
		'Elder Yunbi laughs. Satek theatre. He has seen worse, and he has paid for better.',
		'연비 원로가 웃는다. 사택네 연극이다. 더 한심한 것도 봤고, 더 비싼 것도 샀다.'
	),
	p(
		'King Mu seals the box with his own hand, and it goes up on the wet rock as the sun goes down. A monk from the temple below sits beside it to keep the night. The monk has been paid, by more than one house. Monks are generous with their time.',
		'무왕이 제 손으로 함을 봉하고, 해가 지는 동안 젖은 바위 위에 올린다. 아래 절의 스님 하나가 그 곁에 앉아 밤을 지킨다. 스님은 돈을 받았다. 한 집에서만 받은 게 아니다. 스님들은 시간을 아끼지 않는다.'
	),
	scene('The Night', '밤'),
	p(
		'Every house posts a man at the foot of the rock. Every house sends a second man to watch the first.',
		'가문마다 바위 밑에 사람 하나를 세운다. 그리고 그 사람을 지켜볼 사람을 하나씩 더 보낸다.'
	),
	p(
		'The crown prince comes too, which is not allowed, with a jug, which is also not allowed, and his new man from the sand, who does not drink.',
		'왕세자도 온다. 그건 안 되는 일이다. 술병을 들고 온다. 그것도 안 된다. 모래판의 새 사람도 데리고 온다. 그는 술을 마시지 않는다.'
	),
	EUIJA(
		['Watch the rock, Gyebek. Tell me everything that moves.', 'I’ve a bet on with my father. Loser feeds the winner’s horses for a month.'],
		['바위를 보거라, 계백. 움직이는 건 다 말해라.', '아바마마와 내기를 했다. 진 쪽이 한 달 동안 이긴 쪽 말을 먹인다.']
	),
	GYEBEK(['Yes.'], ['예.']),
	p(
		'Midnight. Somebody goes over the temple wall, badly. Roof-tiles slide. In the guesthouse a Yunbi girl of fifteen sits straight up out of sleep and names the climber before the tiles stop falling. One day she will sit in the Premier’s chair herself, and she will still know that cousin by his footsteps.',
		'자정. 누군가 절 담을 넘는다. 서툴게. 기와가 미끄러진다. 객사에서 자던 열다섯 살 연비 집 딸아이가 벌떡 일어나, 기와가 다 떨어지기도 전에 넘어온 사람 이름을 댄다. 그 아이는 언젠가 저 상좌평 의자에 직접 앉는다. 그때도 그 사촌의 발소리는 알아들을 것이다.'
	),
	extra('A Yunbi Girl', '#8fa6b8', 'f', ['Sondung. It’s always Sondung.'], ['손등이네. 맨날 손등이야.']),
	p(
		'Two Yunbi men drag Satek Sondung off the wall by the ankles. His sleeves are empty. He says he came to pray. Nobody believes him, and every guard at the foot of the rock runs over to not believe him in person.',
		'연비 집 사내 둘이 사택손등의 발목을 잡아 담에서 끌어 내린다. 소매는 비었다. 기도하러 왔다고 한다. 아무도 믿지 않는다. 그래서 바위 밑의 보초들이 죄다 몰려가 직접 안 믿어 준다.'
	),
	d('sateksondung', ['I came to pray! Can’t a man pray in his own city?'], ['기도하러 왔소! 제 도성에서 기도도 못 하오?']),
	p('On the rock, the monk’s lamp moves. Then it stops moving.', '바위 위에서 스님의 등불이 움직인다. 그러다 멈춘다.'),
	GYEBEK(['Highness. The monk opened the box.'], ['저하. 스님이 함을 열었습니다.']),
	EUIJA(['Did he now. For which house?'], ['오호, 그래? 어느 집 일이냐?']),
	GYEBEK(['He has a seal. He used it once. He closed the box.'], ['도장이 있습니다. 한 번 찍었습니다. 함을 닫았습니다.']),
	EUIJA(['Ha! Once. An honest thief.', 'Will you tell the lords?'], ['하! 한 번이라. 정직한 도둑이구나.', '어르신들께 말할 테냐?']),
	GYEBEK(['Nobody asked me.'], ['아무도 묻지 않았습니다.']),
	EUIJA(['…Ha. No. Nobody ever does.'], ['…하. 그렇지. 묻는 놈이 없지.']),
	p(
		'At the far end of the rock, Satek Jijuk has not moved all night. He sits on the bottom step with his hands in his sleeves, where every guard in Sabi can see him, doing nothing as hard as he can.',
		'바위 저쪽 끝에서 사택지적은 밤새 꼼짝도 하지 않았다. 맨 아랫단에 소매에 손을 넣고 앉아 있다. 사비의 보초란 보초가 다 볼 수 있는 자리에서, 있는 힘껏 아무것도 하지 않고 있다.'
	),
	p(
		'Toward dawn the river mist climbs the hill. The salt in the stone drinks it. By first light the whole rock is beaded and running, as if it had been working hard all night.',
		'새벽녘 강 안개가 언덕을 오른다. 돌에 밴 소금이 그것을 빨아들인다. 첫 햇살이 들 무렵, 바위 전체가 송골송골 젖어 흘러내린다. 밤새 일이라도 한 것처럼.'
	),
	scene('Dawn', '새벽'),
	extra('On the stair', '#8a8a94', 'm', ['The rock’s sweating. Look— the rock’s sweating!', 'It ain’t never done that.', 'Then heaven’s been at it all night.'], [
		'바위가 땀을 흘린다. 봐— 바위가 땀을 흘려!',
		'저런 적이 읎었는디.',
		'그럼 하늘이 밤새 일허셨구먼.'
	]),
	p(
		'King Mu climbs the rock himself, which a king his age should not, and breaks his own seal. The box is damp right through. He takes the slips out one at a time and opens them on his knee.',
		'무왕이 몸소 바위를 오른다. 그 나이의 왕이 할 일은 아니다. 제 봉인을 뜯는다. 함은 속까지 축축하다. 쪽지를 하나씩 꺼내 무릎 위에서 편다.'
	),
	p('Lord Jinmo: a name, and nothing else. Lord Jinmo sits down.', '진모 공: 이름 하나, 그뿐이다. 진모 공이 주저앉는다.'),
	p(
		'Elder Yunbi: a seal, fresh and red, and the damp has got into it. It has bled across the paper like a nosebleed. You cannot tell whose seal it was. You can barely tell whose name.',
		'연비 원로: 도장 하나. 갓 찍은 붉은 도장인데 습기가 스며들었다. 코피처럼 종이 위로 번졌다. 누구 도장인지 알 수가 없다. 누구 이름인지도 겨우 알아본다.'
	),
	p(
		'Satek Jijuk: folded three times, small and tight. Inside, over the name, sits a seal mark, crisp and dry, as if it had been there for days. Nobody on the benches knows the seal. Heaven, apparently, has its own.',
		'사택지적: 세 번, 작고 단단하게 접혀 있다. 펼치니 이름 위에 도장 자국이 하나 앉아 있다. 또렷하고 말라 있다. 며칠은 거기 있었던 것처럼. 걸상 위의 누구도 그 도장을 알아보지 못한다. 하늘에게도 제 도장이 있나 보다.'
	),
	MU(['Well, well. Heaven’s marked two.', 'One of them it didn’t like much.'], ['허허. 하늘이 둘을 찍으셨네.', '하나는 영 마음에 안 드셨나 보다.']),
	YUNBI(['Majesty, that slip has been tampered—'], ['전하, 저 쪽지는 누가 손을—']),
	MU(['Which one?'], ['어느 거?']),
	p(
		'Elder Yunbi opens his mouth and shuts it again. To say which slip was tampered with, he would have to say how he knows. Four houses’ worth of money is standing behind him, and not one of them wants to hear that sentence.',
		'연비 원로가 입을 열었다 도로 닫는다. 어느 쪽지에 손을 댔는지 말하려면, 자기가 그걸 어떻게 아는지도 말해야 한다. 그의 뒤엔 가문 넷의 돈이 서 있다. 그 말을 듣고 싶어 하는 집은 하나도 없다.'
	),
	YUNBI(['…Neither, Majesty.', 'Heaven has terrible handwriting.'], ['…아무것도 아닙니다, 전하.', '하늘께서 글씨가 고약하시군요.']),
	p(
		'Satek Jijuk climbs to the chair in damp sleeves. Behind him the benches make the noise a room makes when it has been robbed and cannot report it.',
		'사택지적이 젖은 소매로 의자까지 오른다. 그 뒤에서 걸상들이 소리를 낸다. 도둑을 맞고도 신고를 못 하는 방이 내는 소리다.'
	),
	scene('The Bottom Step', '맨 아랫단'),
	p(
		'Afterwards Elder Yunbi finds him alone on the bottom step, wringing out a sleeve.',
		'나중에 연비 원로는 맨 아랫단에 혼자 앉아 소매를 짜고 있는 그를 찾아낸다.'
	),
	YUNBI(['The sea water.'], ['그 바닷물.']),
	JIJUK(
		['Salt drinks mist. Stone sweats. Fresh seal paste runs.', 'Mine was stamped three days ago, with a seal nobody owns. It’s in the river now. It had time to dry.'],
		['소금은 안개를 먹소. 돌은 땀을 흘리고. 갓 찍은 인주는 번지지.', '내 건 사흘 전에 찍었소. 주인 없는 도장으로. 그 도장은 지금 강바닥에 있소. 마를 시간이 있었지.']
	),
	YUNBI(['You knew I’d pay the monk.'], ['내가 중한테 돈 줄 걸 알았구려.']),
	JIJUK(['Everyone paid the monk. I paid him least.', 'I only asked him to do exactly what you paid for.'], ['다들 중한테 돈을 줬소. 나는 제일 적게 줬고.', '당신이 돈 낸 그대로 하라고만 했소.']),
	YUNBI(['And your cousin on the wall?'], ['담 위의 그 사촌은?']),
	JIJUK(['He thinks he went over it for the house. Let him.'], ['제 딴엔 집안 위해 넘은 줄 알 거요. 그렇게 두시오.']),
	YUNBI(['We don’t hold the sleeve, Satek. We hold the arm.', 'Remember that, Premier.'], ['우리는 소매를 쥐지 않소, 사택. 팔을 쥐지.', '기억해 두시오, 상좌평.']),
	JIJUK(['Noted.'], ['적어 두겠소.']),
	p(
		'From that morning the Satek bring brine to every vote, and the rock sweats for them for twenty-five years. Nobody ever writes down why. Nobody has to.',
		'그날 아침부터 사택 집은 표결 때마다 소금물을 들고 오고, 바위는 스물다섯 해 동안 그들을 위해 땀을 흘린다. 아무도 그 이유를 적지 않는다. 적을 필요가 없다.'
	),
	scene('The Bet', '내기'),
	MU(['Well? Who won?'], ['그래, 누가 이겼냐?']),
	EUIJA(['You did, Father. The Satek.', '…How did you know?'], ['아바마마께서요. 사택이 됐습니다.', '…어떻게 아셨습니까?']),
	MU(
		['I didn’t. I knew Yunbi would pay. A man who’s paid stops watching the weather.', 'Go feed my horses. And keep an eye on the one with wet sleeves. He’ll serve you well, right up until he doesn’t.'],
		['몰랐지. 연비가 돈 쓸 건 알았다. 돈 낸 놈은 날씨를 안 봐.', '가서 내 말 먹여라. 그리고 소매 젖은 저놈 잘 봐 둬라. 잘 섬길 거다. 안 섬길 때까지는.']
	),
	EUIJA(['Ha!', 'Gyebek. You saw the monk. Did you see the salt?'], ['하!', '계백. 넌 중을 봤지. 소금도 봤느냐?']),
	GYEBEK(['Yes. At sunset.', 'I did not know it was a weapon.'], ['예. 해 질 녘에.', '그게 무기인 줄은 몰랐습니다.']),
	EUIJA(['Neither did Yunbi. That’s what made it one.'], ['연비도 몰랐지. 그래서 무기가 된 거다.']),
	p(
		'Down the hill the crowd has heard. Somebody starts the old chant, because a Satek has won and the Satek like to think they wrote it. <i>Restore the reign of the thirteenth Eraha!</i> By noon the Yunbi are chanting it too.',
		'언덕 아래 사람들도 소식을 들었다. 누군가 그 옛 구호를 시작한다. 사택이 이겼고, 사택은 그 구호를 자기네가 지었다고 믿고 싶어 하니까. <i>열세 번째 어라하의 시대를 다시!</i> 한낮이 되자 연비 사람들도 따라 외친다.'
	),
	p(
		'<b>Eight houses had to cheat a rock to agree on one Premier. They agree on that dead king for free. Why? To find out, we go back three hundred years…!</b>',
		'<b>여덟 가문은 상좌평 하나에 뜻을 모으려고 바위까지 속여야 했다. 그 죽은 임금에게는 공짜로 뜻을 모은다. 왜일까? 알려면 삼백 년을 거슬러 가야 한다…!</b>'
	)
];

const raw = fs.readFileSync(FILE, 'utf8');
const chapters = JSON.parse(raw);
const samhan = chapters.find((c) => c.id === 'samhan');

if (samhan.entries.some((e) => e.title === 'Deer Rock')) {
	console.log('already applied');
	process.exit(0);
}

const clans = samhan.entries.find((e) => e.title === 'Eight Great Clans');
if (!clans) throw new Error('samhan: no Eight Great Clans');

/* The rite is a story the elders tell until this episode revives it. */
const term = clans.blocks.find((b) => b.kind === 'term' && b.reading === '정사암');
if (!term) throw new Error('Eight Great Clans: no Rock of Politics term');
term.html =
	'The Rock of Government. Long ago Baekje’s lords chose their premier by sealing three names in a box and leaving it on this rock overnight. Whichever name the rock had marked by morning got the chair. Nobody has tried it in living memory. These days the chair goes to whoever paid for it.';
term.ko =
	'정사를 보는 바위. 옛날 백제의 귀족들은 이름 셋을 함에 봉해 이 바위 위에 하룻밤 두었다. 아침에 바위가 표시해 둔 이름이 재상 자리에 앉았다. 살아 있는 사람 중에 그걸 해 본 이는 없다. 요즘 그 자리는 값을 치른 쪽으로 간다.';

const card = clans.blocks.at(-1);
if (!/three hundred years/.test(card.html ?? '')) throw new Error('Eight Great Clans: unexpected closing card');
clans.blocks[clans.blocks.length - 1] = p(
	'<b>The old Premier is dying, and eight houses want his chair. The king has a very old idea. It involves a rock…!</b>',
	'<b>늙은 상좌평이 죽어 간다. 여덟 가문이 그 자리를 노린다. 왕에게는 아주 오래된 생각이 하나 있다. 바위가 하나 끼어 있다…!</b>'
);

samhan.entries.splice(samhan.entries.indexOf(clans) + 1, 0, {
	year: '632',
	tone: 'heist on a holy rock',
	subtitle: '정사암',
	logline: {
		en: 'Three names in a sealed box, one night on the rock, and eight houses who all intend to help heaven decide.',
		ko: '봉한 함 속의 이름 셋, 바위 위의 하룻밤. 그리고 하늘의 결정을 거들 작정인 여덟 가문.'
	},
	badges: ['🎲', 'flag:baekje'],
	music: clans.music,
	title: 'Deer Rock',
	images: [],
	blocks: BLOCKS,
	place: 'deer_rock'
});

fs.writeFileSync(FILE, JSON.stringify(chapters, null, '\t') + (raw.endsWith('\n') ? '\n' : ''));
console.log(`Deer Rock: ${BLOCKS.length} blocks after Eight Great Clans`);
