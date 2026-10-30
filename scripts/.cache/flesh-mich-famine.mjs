/** Famine, Sagi lines, Changjori kneel, reed coup, campaigns, 400-year soliloquy. */
import { editStory } from './story-ops.mjs';

function d(person, lines, en, extra = {}) {
	const out = { kind: 'dialogue', lines, en, person, ...extra };
	return out;
}
function p(html, ko) {
	return { kind: 'p', html, ko };
}
function scene(label, ko, extra = {}) {
	return { kind: 'scene', label, ko, ...extra };
}

editStory((story) => {
	const mich = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'King Micheon');
	if (!mich) throw new Error('King Micheon missing');

	const sits = mich.blocks.findIndex((b) => String(b.html ?? '').startsWith('The fortress sits over them'));
	if (sits >= 0) {
		mich.blocks[sits] = p(
			'The fortress is a red stamp on the far ridge. You have to stand on a bucket to see it. Down here the market is doing what markets do. Elbows. Fish. A child stealing a persimmon and getting his ear pulled. Salt is only one smell.',
			'성은 먼 능선의 붉은 도장이다. 올려다보려면 되를 딛고 서야 한다. 아래는 시장이 시장 일을 한다. 팔꿈치. 생선. 감을 훔치다 귀를 잡힌 아이. 소금은 냄새 하나일 뿐이다.'
		);
	}

	const three = mich.blocks.findIndex((b) => String(b.html ?? '').startsWith('The stall has three backs'));
	if (three >= 0 && !mich.blocks[three + 1]?.html?.includes('From above')) {
		mich.blocks.splice(
			three,
			0,
			p(
				'From above it is a living thing. Aisles like veins. White hemp. Rust vests. A hundred roofs of cloth, and far off, almost a rumour, the Chinese munru.',
				'위에서 보면 산 것이다. 핏줄 같은 골목. 흰 베. 녹슨 조끼. 천 지붕이 백은 되고, 멀리, 소문처럼, 중국 문루.'
			)
		);
	}

	const palace = mich.blocks.findIndex((b) => b.label === 'The palace · a hungry year');
	const closer = mich.blocks.findIndex((b) => String(b.html ?? '').includes('West of the river, a fortress'));
	if (palace < 0 || closer < 0) throw new Error(`splice missing palace=${palace} closer=${closer}`);

	const tail = [
		scene('The yards · a hungry year', '마당들 · 굶주린 해', { weather: 'dusk' }),
		p('Look down. That is how you see a famine.', '내려다봐라. 기근은 그렇게 보인다.'),
		p(
			'The roads are full of people who used to have a house. The ditches are full of people who used to have a road. A boy sits in the mud with his grandfather’s hand and does not let go, because letting go is how you lose the last warm thing.',
			'길에는 집이 있던 사람들이 가득하다. 구렁에는 길이 있던 사람들이 가득하다. 아이가 진흙에 앉아 할아버지 손을 놓지 않는다. 놓으면 마지막 따뜻한 것이 없어지니까.'
		),
		p(
			'The granary door stands open. You can see the floor. That is the whole report.',
			'곳간 문이 열려 있다. 바닥이 보인다. 보고는 그걸로 끝이다.'
		),
		scene('The scaffolds · the same week', '비계 · 같은 주', { weather: 'dusk' }),
		p(
			'Upriver they are building a roof. Every soul over fifteen. Men who have not eaten haul timber they cannot lift, because a king has decided that hunger is a kind of disloyalty.',
			'강 위에서는 지붕을 올리고 있다. 열다섯이 넘으면 다. 못 먹은 사내들이 들 수 없는 나무를 든다. 굶는 것이 불충이라고 임금이 정해서.'
		),
		d(
			'bongsang',
			['궁이 초라하면 백성이 불안해한다.', '지붕을 갈아라. 열다섯이 넘으면 다 나와.'],
			['A shabby palace makes the people nervous.', 'Replace the roof. Everyone over fifteen. Out.'],
			{ chip: '#6e2a2a' }
		),
		scene('The hall · that night', '전각 · 그날 밤', { weather: 'night' }),
		p(
			'Changjori has the numbers in his mouth and they will not stay there. He has counted the ditches. He has counted the scaffolds. He has counted the king’s cups.',
			'창조리는 숫자를 입에 물고 있고, 그게 가만히 있지 않는다. 구렁을 셌다. 비계를 셌다. 임금의 잔을 셌다.'
		),
		d(
			'changjori',
			[
				'전하. 하늘이 두 번 쳤습니다.',
				'장정은 길로 나갔습니다. 노인과 아이는 구렁에 있습니다.',
				'지금은 지붕을 올릴 해가 아닙니다.'
			],
			[
				'Majesty. Heaven has hit us twice.',
				'The young men walked. The old and the children are in the ditches.',
				'This is not a year for a roof.'
			],
			{ chip: '#8a7048' }
		),
		d(
			'bongsang',
			['임금은 백성이 우러러보는 자리다.', '궁이 장엄하지 않으면 볼 것이 없다.'],
			['A king is what the people look up at.', 'If the palace is not splendid, there is nothing to see.'],
			{ chip: '#6e2a2a' }
		),
		d(
			'changjori',
			['구렁에서 올려다보고 있습니다, 전하.', '이웃에 강한 적이 있습니다. 우리가 비면, 옵니다.', '사직은 지붕이 아닙니다.'],
			[
				'They are looking up from a ditch, Majesty.',
				'There is a strong neighbour. If we go empty, they come.',
				'The country is not a roof.'
			],
			{ chip: '#8a7048' }
		),
		d(
			'bongsang',
			['지금 국상은 과인을 비방해서 백성의 칭송을 구하는구나.'],
			['So the prime minister talks me down to collect their praise.'],
			{ chip: '#6e2a2a' }
		),
		d(
			'changjori',
			[
				'임금이 백성을 안 불쌍히 여기면, 그게 인이 아닙니다.',
				'신하가 간하지 않으면, 그게 충이 아닙니다.',
				'이 자리에 앉았으니 말하는 겁니다. 칭송은 안 바랍니다.'
			],
			[
				'If a king does not pity the people, that is not kindness.',
				'If a minister does not speak, that is not loyalty.',
				'I sit in this chair, so I say it. I am not asking them to like me.'
			],
			{ chip: '#8a7048' }
		),
		d(
			'bongsang',
			['국상은 백성을 위하여 죽고자 하는가.', '다시 말하지 마라.'],
			['Would the prime minister like to die for the people.', 'Do not say it again.'],
			{ chip: '#6e2a2a' }
		),
		p(
			'He laughs when he says it. Changjori bows. In the corridor his hands are not steady enough to be royal about.',
			'말할 때 웃는다. 창조리는 절한다. 복도에서 손이 점잖을 만큼 가만히 있지 않다.'
		),
		d(
			'changjori',
			['산과 들을 보시오.', '비류 쪽이다. 소금을 파는 애다.', '왕손이다. 죽지 않았으면.', '찾으면 나한테 오라 하시오. 내가 간다.'],
			[
				'Search the hills and the fields.',
				'On the Biryu. A boy selling salt.',
				'A king’s grandson. If he isn’t dead.',
				'When you find him, send for me. I will come.'
			],
			{ chip: '#8a7048' }
		),
		scene('The Biryu · the same week', '비류 · 같은 주', { weather: 'dusk' }),
		p(
			'Two men stand on the bank with court shoes in the mud. The man in the boat is older than the boy they were sent to find, and burned down to the wrists. He does not look up.',
			'두 사내가 진흙에 궁 신을 담근 채 둑에 선다. 배 안의 사내는, 찾으러 온 소년보다 늙었고, 손목까지 타 있다. 그는 고개를 들지 않는다.'
		),
		d('sou', ['을불 도련님.'], ['Master Eulbul.'], { chip: '#6a7868' }),
		d('micheon', ['소금값이면 말하시오.'], ['If it’s about the price of salt, say so.'], {
			chip: '#C30000',
			look: 'exile'
		}),
		d(
			'sou',
			['돌고의 아드님이십니다.', '궁에서 뵈었습니다. 그때는… 개구리보다 작으셨습니다.', '걸음은 그대로입니다.'],
			['Prince Dolgo’s son.', 'I saw you in the palace. You were… smaller than a frog.', 'The walk is the same.'],
			{ chip: '#6a7868' }
		),
		d(
			'micheon',
			['나는 야인이지 왕손이 아닙니다.', '다시 자세히 살펴보십시오.'],
			['I am a man of the fields, not a king’s grandson.', 'Look again, carefully.'],
			{ chip: '#C30000', look: 'exile' }
		),
		p(
			'That is the only sentence the book will ever let him have. He spends the rest of his life proving it wrong.',
			'책이 그의 입에 허락한 문장은 이게 전부다. 남은 삶은 그걸 틀리게 만드는 데 쓴다.'
		),
		d('jobul', ['다시 봤습니다.', '그래서 국상을 모셔 왔습니다.'], ['We looked again.', 'That’s why we brought the prime minister.'], {
			chip: '#7a7068'
		}),
		p(
			'Changjori comes down the bank the way a man comes down a ladder he is not sure will hold. Court silk in river mud. He does not ask again. He goes to his knees.',
			'창조리가 둑으로 내려온다. 버틸지 모르는 사다리를 내려가듯이. 궁 비단이 강 진흙에 간다. 다시 묻지 않는다. 무릎을 꿇는다.'
		),
		d(
			'changjori',
			['전하.', '아닙니다. 아직 아니지.', '을불.', '일어나 주십시오. 아니— 제가 이러고 있겠습니다.'],
			['Majesty.', 'No. Not yet.', 'Eulbul.', 'Please stand. No— I’ll stay like this.'],
			{ chip: '#8a7048' }
		),
		d(
			'micheon',
			['일어나지 마시오.', '진흙이오. 궁 비단이오.', '나는 야인이오.'],
			['Don’t get up.', 'That’s mud. That’s court silk.', 'I’m a man of the fields.'],
			{ chip: '#C30000', look: 'exile' }
		),
		d(
			'changjori',
			[
				'그래서 왔습니다.',
				'지금 임금이 지붕을 올리고, 나라는 구렁에 있습니다.',
				'왕손이면 오십시오. 사람이면 오십시오.',
				'반역자를 만들러 온 게 아닙니다. 왕을 찾으러 온 겁니다.',
				'제발.'
			],
			[
				'That’s why I came.',
				'The king is putting up a roof. The country is in a ditch.',
				'If you are the grandson, come. If you are a person, come.',
				'I didn’t come to make a traitor. I came to find a king.',
				'Please.'
			],
			{ chip: '#8a7048' }
		),
		p(
			'Eulbul looks at the sack. Then at the silk in the mud. Then at the old man who will not get up until he says yes.',
			'을불은 가마니를 본다. 그다음 진흙 위의 비단을. 그다음, 예라고 할 때까지 일어나지 않을 늙은이를.'
		),
		d(
			'micheon',
			['…신발값은 받으셨소.', '됐소.', '배는 두고 가겠소.', '재모한테는… 내일 오라 하거라. 내일은 진짜로.'],
			['…Did they get the price of the shoe.', 'Never mind.', 'I’ll leave the boat.', 'Tell Jaemo… come tomorrow. Tomorrow for real.'],
			{ chip: '#C30000', look: 'exile' }
		),
		p(
			'He hides in the prime minister’s house, south of the ridge, which is the first roof in seven years that is not a joke. Changjori pours wine and then does not drink it.',
			'그는 능선 남쪽, 국상의 집에 숨는다. 일곱 해 만에 농담이 아닌 지붕이다. 창조리가 술을 따르고, 마시지는 않는다.'
		),
		d(
			'changjori',
			['무서우면 말하시오.', '나도 무서우니까. 순서만 정합시다.'],
			['If you’re afraid, say so.', 'I am too. Let’s just decide the order.'],
			{ chip: '#8a7048' }
		),
		d('micheon', ['저는 지붕을 지을 줄 모릅니다.'], ['I don’t know how to build a roof.'], {
			chip: '#C30000',
			look: 'exile'
		}),
		d(
			'changjori',
			['그래서 모신 거요.', '지붕은 이미 너무 많습니다.'],
			['That’s why I sent for you.', 'We already have too much roof.'],
			{ chip: '#8a7048' }
		),
		{ kind: 'section', label: 'The Hunt', ko: '사냥' },
		scene('The north slope · that autumn', '후산 북쪽 · 그해 가을', { weather: 'dusk' }),
		p(
			'The king takes his ministers into the hills to kill something smaller than a famine. You have seen this kind of party. A gathering. A signal. A room that closes. Later a man in Pyongyang will throw a banquet and drop the screens. This one uses a hat.',
			'임금은 대신들을 언덕으로 데려가, 기근보다는 작은 것을 죽이러 간다. 이런 자리, 보신 적 있다. 모임. 신호. 닫히는 방. 나중에 평양의 사내가 잔치를 열고 병풍을 떨어뜨린다. 이건 모자를 쓴다.'
		),
		p(
			'Changjori waits until the beaters are far enough that a shout would sound like sport. Then he takes a reed leaf and puts it in his cap.',
			'창조리는 몰이꾼들이 멀어져, 고함이 사냥 소리처럼 들릴 때까지 기다린다. 그리고 갈댓잎을 관에 꽂는다.'
		),
		d(
			'changjori',
			['나와 마음을 같이 하는 자는.', '나를 따라 하라.'],
			['Whoever is of one mind with me.', 'Follow.'],
			{ chip: '#8a7048' }
		),
		p(
			'From above it is almost pretty. One green. Then another. Then the clearing is a field of foolish leaves, and it is not pretty anymore, and everyone understands it at the same time.',
			'위에서 보면 예쁘기까지 하다. 초록 하나. 그다음. 그리고 빈터가 우스운 잎으로 가득하고, 더 이상 예쁘지 않고, 모두가 동시에 알아차린다.'
		),
		d(
			'bongsang',
			['창조리.', '네 모자가 우습구나.'],
			['Changjori.', 'Your hat is ridiculous.'],
			{ chip: '#6e2a2a' }
		),
		d('changjori', ['다들 같은 농담을 했습니다, 전하.'], ['They all made the same joke, Majesty.'], {
			chip: '#8a7048'
		}),
		d(
			'bongsang',
			['내 아우에게 아들이 있었지.', '소금이나 팔라고 해 둬라.'],
			['My brother had a son.', 'Tell him to keep selling salt.'],
			{ chip: '#6e2a2a' }
		),
		d('changjori', ['그래서 모셨습니다.'], ['That’s why we sent for him.'], { chip: '#8a7048' }),
		p(
			'They do not draw. They walk him to a side room and put soldiers at the door. A banquet would have used blades. A hunt uses a latch.',
			'칼을 빼지 않는다. 별실로 걷게 하고 문에 병사를 세운다. 잔치라면 칼이었다. 사냥은 빗장이다.'
		),
		scene('The side room · that night', '별실 · 그날 밤', { weather: 'night' }),
		p(
			'He knows he will not walk out. His sons stay. In the morning the room is quiet, and Changjori does not let anyone write down how a man looks when he has used his own belt.',
			'나가지 못할 줄 안다. 아들들이 남는다. 아침이 되면 방은 조용하고, 창조리는 제 띠를 쓴 사내의 얼굴을 아무도 적지 못하게 한다.'
		),
		scene('The hall · the next morning', '전각 · 다음 아침', { weather: 'dusk' }),
		p(
			'They put the seal in the salt seller’s hands before the hats are thrown away. They call him Micheon. He still turns if you say the other name softly.',
			'모자를 버리기도 전에 소금장수 손에 옥새를 얹는다. 미천이라 부른다. 다른 이름을 낮추어 부르면 그는 아직 돌아본다.'
		),
		d(
			'changjori',
			['받으십시오.', '무겁습니다. 그게 맞습니다.'],
			['Take it.', 'It’s heavy. That’s the point.'],
			{ chip: '#8a7048' }
		),
		d(
			'micheon',
			['하나씩이오.', '급하면 손이 떨리니까.'],
			['One at a time.', 'If you hurry, the hand shakes.'],
			{ chip: '#C30000', look: 'king' }
		),
		p(
			'Jaemo is not in the hall. Halls, he has explained, are where shoes get stolen.',
			'재모는 전각에 없다. 전각은, 그의 설명으로는, 신이 훔쳐지는 곳이다.'
		),
		p(
			'Four hundred years. That is how long this house has been taking the Chinese cities apart, one seal at a time. He is the one who gets to finish the last of them. He does not know that yet.',
			'사백 년. 이 집안이 중국 성을 인장 하나씩 뜯어 온 시간이다. 마지막을 끝내는 사람이 그다. 아직은 모른다.'
		),
		scene('The northern seal · two years after the crown', '북쪽 인장 · 왕관 후 이 년', {
			weather: 'dusk',
			jump: { en: 'Two Years Later…', ko: '이 년 뒤…', year: 302 }
		}),
		p(
			'He rides north himself. A commandery on a road this house has wanted since the first king learned to hate a wall. He takes it the way he used to take a sack off a boat. Count. Lift. Do not drop it.',
			'북쪽은 직접 간다. 첫 임금이 담을 미워하기 시작한 뒤로 이 집이 탐내 온 길의 군현. 배에서 가마니를 내리듯 취한다. 세고. 들고. 떨어뜨리지 않고.'
		),
		p(
			'They bring back more captives than the stall ever held sacks. He counts them twice. The second time is right.',
			'좌판이 가마니를 두던 것보다 많은 사람을 데려온다. 두 번 센다. 두 번째가 맞다.'
		),
		d(
			'micheon',
			['하나씩이오.', '여기는 끝이 아니오. 길일 뿐이오.'],
			['One at a time.', 'This isn’t the end. It’s a road.'],
			{ chip: '#C30000', look: 'king' }
		),
		scene('The river road · nine years later', '강의 길 · 구 년 뒤', {
			weather: 'dusk',
			jump: { en: 'Nine Years Later…', ko: '구 년 뒤…', year: 311 }
		}),
		p(
			'The next one sits on the river where the letters go home. Cut that, and a Chinese city on a Goguryeo bank has to shout across water. He cuts it. The letters stop.',
			'다음은 편지가 본국으로 가는 강이다. 그걸 끊으면, 고구려 둑의 중국 성은 물 너머로 소리쳐야 한다. 끊는다. 편지가 끊긴다.'
		),
		p(
			'Four hundred years of paper. Then the paper has nowhere to go.',
			'사백 년의 종이. 그리고 종이가 갈 곳이 없어진다.'
		),
		scene('The western gate · thirteen years later', '서쪽 성문 · 십삼 년 뒤', {
			weather: 'dusk',
			jump: { en: 'Thirteen Years Later…', ko: '십삼 년 뒤…', year: 313 }
		}),
		p(
			'There is a city on that river that has been Chinese longer than anyone in his house has worn a crown. Seals. Granaries. A market that buys Goguryeo salt and taxes the wrist that weighed it. This is the one he looked at from under a satgat, from a stall so far down you needed a bucket to see the munru.',
			'그 강가에, 이 집안이 왕관을 쓰기 전부터 중국이었던 성이 있다. 인장. 곳간. 고구려 소금을 사면서 저울 든 손목에 세금을 매기는 시장. 삿갓 아래에서, 되를 딛고 서야 문루가 보이던 좌판에서, 올려다보던 그 성이다.'
		),
		p(
			'The city waits a winter. Then another. They fight a man named Zhang Tong until both sides are tired of being right. The emperor does not write. Nobody is coming from the other direction.',
			'성은 겨울을 기다린다. 한 번 더. 장통이라는 사내와, 둘 다 옳은 데 지칠 때까지 싸운다. 황제는 쓰지 않는다. 다른 쪽에서는 아무도 오지 않는다.'
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
			'Micheon looks at the gate, not at the seal. He has stood at gates where a man with a brush decided what his back was worth.',
			'미천은 인장이 아니라 성문을 본다. 붓을 든 사내가 그의 등의 값을 정하던 문 앞에 서 본 적이 있다.'
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
		p(
			'The sister city folds the next summer. The last Chinese seal on the peninsula goes into a box nobody opens.',
			'이듬해 여름, 형제뻘 되는 성이 접힌다. 반도의 마지막 중국 인장은 아무도 열지 않는 상자에 들어간다.'
		),
		scene('The market · under a far fortress', '시장 · 먼 성 아래', { weather: 'dusk' }),
		p(
			'From above, the same living thing. Aisles. Elbows. A child stealing a persimmon. The munru is his now, and it is still far, which is how a market likes a fortress.',
			'위에서 보면 같은 산 것. 골목. 팔꿈치. 감 훔치는 아이. 문루는 이제 그의 것이고, 아직 멀다. 시장이 성을 좋아하는 방식이다.'
		),
		p(
			'In the stall a man is shorting a measure, on purpose, with the concentration of a priest. He does not bow. He does not know which of the muddy officers used to tie his sacks.',
			'좌판에서 한 사내가 일부러 되를 덜 담고 있다. 사제처럼 집중해서. 그는 절하지 않는다. 진흙투성이 장교 중 누가 예전에 제 가마니를 묶었는지 모른다.'
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
		d('micheon', ['꽉 채워.', '값은 내가 낸다.'], ['Fill it.', 'I’ll pay.'], { chip: '#C30000', look: 'king' }),
		p(
			'He pays. Full measure. Then he walks to the edge of the stalls, where the ridge is a red line, and he talks to the river the way a man talks when nobody is owed an answer.',
			'값을 치른다. 가득 채워서. 그리고 좌판 끝, 능선이 붉은 선인 데로 가서, 강에게 말한다. 답을 받을 사람이 없을 때 하는 말.'
		),
		d(
			'micheon',
			[
				'사백 년.',
				'조선이 떨어지고, 그들이 이 강에 군현을 앉혔소.',
				'나는 마지막 성 아래에서 소금을 팔았소.',
				'오늘, 삼한 땅에 중국 성은 없소.',
				'……소금장수요.'
			],
			[
				'Four hundred years.',
				'Joseon fell, and they sat their commanderies on this river.',
				'I sold salt under the last one.',
				'Tonight there is not a Chinese city left in Samhan.',
				'……Just a salt merchant.'
			],
			{ chip: '#C30000', look: 'king' }
		),
		p('He looks up at the fortress. This time he smiles.', '성을 올려다본다. 이번엔 웃는다.'),
		p(
			'<b>In Silla, bone decides how high a man can climb. One of them is about to find out…!</b>',
			'<b>신라에서는 뼈가 사내가 오를 높이를 정한다. 그 중 하나가, 이제 알게 된다…!</b>'
		)
	];

	mich.blocks.splice(palace, closer - palace + 1, ...tail);
	return { blocks: mich.blocks.length, tail: tail.length };
});
