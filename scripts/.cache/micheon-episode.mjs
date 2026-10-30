/** Hide Boiling River and put King Micheon in its place in the reading order. */
import { editStory } from './story-ops.mjs';

const entry = {
	year: '300',
	flash: true,
	flashback: true,
	tone: 'exile and return',
	toneNote: 'A prince who learns the ground by sleeping on it, and a city that has been waiting four hundred years for someone who has.',
	subtitle: '미천왕',
	logline: {
		en: 'A boy throws stones at frogs so a stranger can sleep. They find him seven years later, selling salt.',
		ko: '소년은 남이 자게 하려고 개구리에게 돌을 던진다. 일곱 해 뒤, 사람들은 소금을 팔고 있는 그를 찾는다.'
	},
	badges: ['flag:goguryeo'],
	music: 'The Salt Boat',
	title: 'King Micheon',
	place: 'amnok',
	kinds: ['coup'],
	cast: ['micheon', 'jaemo', 'changjori', 'bongsang', 'zhangtong', 'dolgo'],
	images: [],
	blocks: [
		{
			kind: 'p',
			html: 'The frogs were the problem.',
			ko: '문제는 개구리였다.'
		},
		{
			kind: 'p',
			html: 'Not the king. The frogs. A boy stands in a pond to his knees and throws stones at the dark, because a man he has never met wants to sleep.',
			ko: '임금이 아니었다. 개구리였다. 소년은 연못에 무릎까지 잠긴 채 어둠을 향해 돌을 던진다. 한 번도 본 적 없는 사내가 자고 싶어 해서.'
		},
		{
			kind: 'card',
			person: 'micheon',
			look: 'exile',
			caption: 'He has not used his name since the night his father told him to stop.',
			ko: '아버지가 그만두라 한 밤 이후로, 그는 제 이름을 쓰지 않는다.'
		},
		{
			kind: 'dialogue',
			speaker: 'Eummo',
			gender: 'm',
			chip: '#6b5a48',
			lines: ['아직 운다.', '돌. 더 가져와.'],
			en: ['They’re still at it.', 'Stones. Fetch more.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['주무시고 계시면, 원래 안 들리실 텐데요.'],
			en: ['If you were asleep, you wouldn’t hear them.']
		},
		{
			kind: 'dialogue',
			speaker: 'Eummo',
			gender: 'm',
			chip: '#6b5a48',
			lines: ['다시 해 봐.', '방금 거, 재미있더라.'],
			en: ['Say that again.', 'That was funny.']
		},
		{
			kind: 'p',
			html: 'He does not say it again. He throws until his shoulder shakes. In the morning the man who owns the pond sends him for wood, and does not ask his name. It is the only kindness in the house, and it is an accident.',
			ko: '그는 다시 말하지 않는다. 어깨가 떨릴 때까지 던진다. 아침이 되면 연못의 주인은 나무를 해 오라 하고, 이름은 묻지 않는다. 그 집의 유일한 친절이고, 실수다.'
		},
		{
			kind: 'flashback',
			year: '293',
			title: 'The night he was told to lie',
			blocks: [
				{
					kind: 'p',
					html: 'His name is Eulbul. He has not used it since the night his father stood in a doorway and would not come in.',
					ko: '이름은 을불이다. 아버지가 문간에 선 채 들어오지 않던 밤 이후로, 그는 그 이름을 쓰지 않는다.'
				},
				{
					kind: 'dialogue',
					person: 'dolgo',
					chip: '#9a5348',
					lines: ['이름 꺼내지 마.', '두 번 물으면, 더 잘 둘러대.', '강으로 가. 소금 있는 데로.'],
					en: ['Don’t use your name.', 'If they ask twice, lie better.', 'Go to the river. Where the salt is.']
				},
				{
					kind: 'dialogue',
					person: 'micheon',
					look: 'exile',
					chip: '#C30000',
					lines: ['아버지—'],
					en: ['Father—']
				},
				{
					kind: 'dialogue',
					person: 'dolgo',
					chip: '#9a5348',
					lines: ['가.'],
					en: ['Go.']
				}
			]
		},
		{
			kind: 'p',
			html: 'That is the last of him. The uncle wears the crown. He had the boy’s father killed because rooms went quiet when the father walked in, and stayed noisy for the king.',
			ko: '그게 아버지의 마지막이다. 왕관은 큰아버지가 쓰고 있다. 아버지가 들어서면 방이 조용해지고, 임금에게는 조용해지지 않아서, 그는 아버지를 죽였다.'
		},
		{
			kind: 'p',
			html: 'Eulbul stays a year. Wood in the day. Stones at night. He gets good at missing the frogs and still keeping them down, which is a skill no one will ever thank him for.',
			ko: '을불은 일 년을 있는다. 낮에는 나무. 밤에는 돌. 개구리는 맞히지 않으면서도 잠잠하게 하는 재주가 는다. 아무도 고마워하지 않을 재주다.'
		},
		{
			kind: 'scene',
			label: 'The gate · a year on',
			ko: '사립 · 일 년 뒤',
			weather: 'dusk'
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['나무, 그만할 겁니다.', '배 있습니까.'],
			en: ['I’m done with the wood.', 'Do you have a boat.']
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['배는 있어.', '너는 뭐냐. 팔 봐. 가마니보다 가벼워 보이는데.'],
			en: ['I’ve got a boat.', 'What are you. Look at those arms. Lighter than a sack.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['개구리보다는 무거울 겁니다.'],
			en: ['Heavier than a frog. Probably.']
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['말투는 가볍네.', '타. 이름은 나중에. 소금은 정직해. 사람은 아니야.'],
			en: ['The mouth isn’t.', 'Get in. Name later. Salt is honest. People aren’t.']
		},
		{
			kind: 'scene',
			label: 'The salt boat · the Amnok',
			ko: '소금배 · 압록',
			weather: 'day',
			year: 294
		},
		{
			kind: 'p',
			html: 'They sell down the river. Jaemo talks. Eulbul ties the sacks the way he was shown, and counts them twice, and lets the villages think he is nobody’s son. For a while it works. Salt is a good place to hide. Everybody wants some, and nobody wants to know you.',
			ko: '그들은 강을 따라 판다. 재모가 떠든다. 을불은 배운 대로 가마니를 묶고, 두 번 세고, 마을이 그를 누구의 아들도 아니라고 믿게 둔다. 한동안은 된다. 소금은 숨기 좋은 자리다. 누구나 찾고, 아무도 너를 알고 싶어 하지 않는다.'
		},
		{
			kind: 'dialogue',
			speaker: 'The old woman',
			gender: 'f',
			chip: '#8a7a68',
			lines: ['한 말만 더 줘.', '네가 가면 나는 뭘로 간을 맞추니.'],
			en: ['One more sack.', 'When you go, what am I supposed to salt the pot with.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['한 되는 드렸습니다.', '한 말은 옆집 몫입니다.'],
			en: ['I gave you a bowl.', 'A sack belongs to the next house.']
		},
		{
			kind: 'p',
			html: 'She smiles with her mouth only. In the morning his sack is heavier by one shoe.',
			ko: '그녀는 입으로만 웃는다. 아침에 그의 가마니는 신 한 짝만큼 무거워져 있다.'
		},
		{
			kind: 'dialogue',
			speaker: 'The old woman',
			gender: 'f',
			chip: '#8a7a68',
			lines: ['도둑놈.', '내 신 내놔.'],
			en: ['Thief.', 'Give me my shoe.']
		},
		{
			kind: 'dialogue',
			speaker: 'The magistrate',
			gender: 'm',
			chip: '#5c564c',
			lines: ['풀어.', '신값이다. 소금으로 쳐. 맞고 가.'],
			en: ['Open it.', 'That’s the price of a shoe. We’ll take it in salt. Then you take the sticks, and you go.']
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['그 신, 우리 배에 없었어.', '내가 묶었어. 내가 알아.'],
			en: ['That shoe was never in our boat.', 'I tied the sack. I know.']
		},
		{
			kind: 'dialogue',
			speaker: 'The magistrate',
			gender: 'm',
			chip: '#5c564c',
			lines: ['네가 알았으면 네가 맞아.', '줄 서.'],
			en: ['If you knew, then you take them.', 'Get in line.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['제가 맞겠습니다.', '소금은, 있는 만큼만요.'],
			en: ['I’ll take them.', 'The salt— only what’s left.']
		},
		{
			kind: 'p',
			html: 'They take the salt. They take the afternoon out of his back. Jaemo swears for the whole walk to the boat. Eulbul counts what is left, and says they can still eat.',
			ko: '그들은 소금을 가져간다. 그의 등에서 오후를 가져간다. 재모는 배까지 가는 내내 욕을 한다. 을불은 남은 것을 세고, 아직 먹을 수 있다고 말한다.'
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['왜 말을 안 해.', '네가 안 훔쳤어. 내가 봤어.'],
			en: ['Why didn’t you say it.', 'You didn’t steal it. I saw.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['봐도 안 되더군요.', '아버지는 두 번 물으면 더 잘 둘러대라 했습니다.', '세 번째는 안 가르치셨습니다.'],
			en: ['Seeing it didn’t help.', 'My father said if they ask twice, lie better.', 'He never got to the third time.']
		},
		{
			kind: 'p',
			html: 'After that the villages know his face. Not as a prince. As the boy who stole a shoe. He gets thin. The sun takes the rest. People who had bowed to his father walk past him on the bank and do not slow down.',
			ko: '그 뒤로 마을은 그의 얼굴을 안다. 왕손으로가 아니다. 신을 훔친 애로. 그는 야윈다. 해가 나머지를 가져간다. 그의 아버지에게 절하던 사람들이 둑 위로 지나가며 발걸음을 늦추지 않는다.'
		},
		{
			kind: 'p',
			html: 'You would think seven years of that would sand a person down to nothing. It sands the name off. The person stays, and learns the price of everything, which is a kind of education kings do not get in halls.',
			ko: '일곱 해면 사람이 닳아 없어질 줄 안다. 닳아 없어지는 것은 이름이다. 사람은 남는다. 그리고 모든 것의 값을 배운다. 전각에서는 왕이 받지 못하는 교육이다.'
		},
		{
			kind: 'scene',
			label: 'The palace · a hungry year',
			ko: '궁 · 굶주린 해',
			weather: 'night',
			jump: { en: 'Seven Years Later…', ko: '칠 년 뒤…', year: 300 }
		},
		{
			kind: 'p',
			html: 'The king is building a roof. The country is not eating. He has called every soul over fifteen to make the palace beautiful, because a beautiful king, he says, steadies the stomach.',
			ko: '임금이 지붕을 올리고 있다. 나라는 먹지 못하고 있다. 그는 열다섯이 넘은 모든 사람을 불러 궁을 아름답게 하라 한다. 아름다운 임금을 보면, 배가 덜 고프다고 한다.'
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['궁이 초라하면 백성이 불안해한다.', '지붕을 갈아라. 열다섯이 넘으면 다 나와.'],
			en: ['A shabby palace makes the people nervous.', 'Replace the roof. Everyone over fifteen. Out.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: [
				'전하. 올해 지붕은 못 먹습니다.',
				'곳간이 바닥입니다. 사람은 있고, 밥이 없습니다.'
			],
			en: ['Majesty. A roof cannot be eaten this year.', 'The granary is down to the floor. We have the people. We don’t have the rice.']
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['밥은 네가 해라.', '나는 우러러볼 것을 만든다.', '아름다운 임금을 본 백성은 덜 배고프다.'],
			en: ['The rice is your job.', 'I make the thing they look up at.', 'A people who can see their king are less hungry.']
		},
		{
			kind: 'p',
			html: 'Changjori bows. In the corridor he stops the clerk’s brush.',
			ko: '창조리는 절한다. 복도에서 그는 서기의 붓을 멈춘다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['그 문장, 적지 말게.'],
			en: ['That sentence. Don’t write it down.']
		},
		{
			kind: 'dialogue',
			speaker: 'The clerk',
			gender: 'm',
			chip: '#7a7068',
			lines: ['이미 적었습니다.'],
			en: ['I already did.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['…그럼 작게 적게.', '그리고 배를 한 척 찾아. 비류 쪽이다. 소금을 파는 애다.', '왕손이다. 죽지 않았으면.'],
			en: ['…Then write it small.', 'And find a boat. On the Biryu. A boy selling salt.', 'A king’s grandson. If he isn’t dead.']
		},
		{
			kind: 'scene',
			label: 'The Biryu · the same week',
			ko: '비류 · 같은 주',
			weather: 'dusk'
		},
		{
			kind: 'p',
			html: 'The clerk stands on the bank with court shoes in the mud. The man in the boat is older than the boy he was sent to find, and burned down to the wrists. He does not look up.',
			ko: '서기는 진흙에 궁 신을 담근 채 둑에 선다. 배 안의 사내는, 찾으러 온 소년보다 늙었고, 손목까지 타 있다. 그는 고개를 들지 않는다.'
		},
		{
			kind: 'dialogue',
			speaker: 'The clerk',
			gender: 'm',
			chip: '#7a7068',
			lines: ['을불 도련님.'],
			en: ['Master Eulbul.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['소금값이시면 말씀하십시오.'],
			en: ['If it’s about the price of salt, say so.']
		},
		{
			kind: 'dialogue',
			speaker: 'The clerk',
			gender: 'm',
			chip: '#7a7068',
			lines: ['돌고의 아드님.', '궁에서 봤습니다. 그때는… 개구리보다 작았습니다.'],
			en: ['Prince Dolgo’s son.', 'I saw you in the palace. You were… smaller than a frog.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['돌고는 죽었습니다.', '그 아들도 죽었습니다.'],
			en: ['Dolgo is dead.', 'So is his son.']
		},
		{
			kind: 'dialogue',
			speaker: 'The clerk',
			gender: 'm',
			chip: '#7a7068',
			lines: [
				'국상께서 전하라 했습니다.',
				'임금이 임금답지 못하다. 왕손이면 오라. 사람답고, 사람을 아끼면 오라.',
				'더 짧게 하라 했는데, 안 잘랐습니다.'
			],
			en: [
				'The prime minister told me to say this.',
				'The king is not being a king. If you are the grandson, come. If you are a person, and you spare people, come.',
				'I asked to make it shorter. He wouldn’t cut it.'
			]
		},
		{
			kind: 'p',
			html: 'The river hits the boat. Eulbul watches the sack at his feet, the way you watch a thing that has already betrayed you once.',
			ko: '강물이 배를 친다. 을불은 발치의 가마니를 본다. 한 번 배신한 물건을 보듯이.'
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['…신발값은 받으셨답니까.'],
			en: ['…Did they get the price of the shoe.']
		},
		{
			kind: 'dialogue',
			speaker: 'The clerk',
			gender: 'm',
			chip: '#7a7068',
			lines: ['예?'],
			en: ['Sorry?']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['됐습니다.', '배는 두고 가지요.'],
			en: ['Never mind.', 'I’ll leave the boat.']
		},
		{
			kind: 'p',
			html: 'He hides in the prime minister’s house, which is the first roof in seven years that is not a joke. Changjori pours wine and then does not drink it. His hands are not steady enough to be royal about.',
			ko: '그는 국상의 집에 숨는다. 일곱 해 만에 농담이 아닌 지붕이다. 창조리가 술을 따르고, 마시지는 않는다. 손이 점잖을 만큼 가만히 있지 않다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['무서우면 말하오.', '나도 무서우니까. 순서만 정합시다.'],
			en: ['If you’re afraid, say so.', 'I am too. Let’s just decide the order.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			look: 'exile',
			chip: '#C30000',
			lines: ['저는 지붕을 지을 줄 모릅니다.'],
			en: ['I don’t know how to build a roof.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['그래서 모신 거요.', '지붕은 이미 너무 많습니다.'],
			en: ['That’s why I sent for you.', 'We already have too much roof.']
		},
		{
			kind: 'scene',
			label: 'The hunt · that autumn',
			ko: '사냥 · 그해 가을',
			weather: 'day'
		},
		{
			kind: 'p',
			html: 'The king takes his ministers into the hills to kill something smaller than a famine. Changjori waits until the beaters are far enough that a shout would sound like sport. Then he puts a reed in his hat.',
			ko: '임금은 대신들을 언덕으로 데려가, 기근보다는 작은 것을 죽이러 간다. 창조리는 몰이꾼들이 멀어져, 고함이 사냥 소리처럼 들릴 때까지 기다린다. 그리고 모자 위에 갈대를 꽂는다.'
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['나만큼 지친 사람은.', '이렇게 하게.'],
			en: ['Anyone as tired as I am.', 'Do this.']
		},
		{
			kind: 'p',
			html: 'One hat. Then the next. Then the clearing is full of foolish green, and it is not funny anymore, and everyone understands it at the same time.',
			ko: '모자 하나. 그다음. 그리고 빈터는 우스운 초록으로 가득하고, 더 이상 우습지 않고, 모두가 동시에 알아차린다.'
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['창조리.', '네 모자가 우습구나.'],
			en: ['Changjori.', 'Your hat is ridiculous.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['다들 같은 농담을 했습니다, 전하.'],
			en: ['They all made the same joke, Majesty.']
		},
		{
			kind: 'dialogue',
			person: 'bongsang',
			chip: '#6e2a2a',
			lines: ['내 아우에게 아들이 있었지.', '소금이나 팔라고 해 둬라.', '왕 노릇은 지붕을 볼 줄 아는 사람이 한다.'],
			en: ['My brother had a son.', 'Tell him to keep selling salt.', 'Kingship is for a man who knows how to look at a roof.']
		},
		{
			kind: 'dialogue',
			person: 'changjori',
			chip: '#8a7048',
			lines: ['그래서 모셨습니다.'],
			en: ['That’s why we sent for him.']
		},
		{
			kind: 'p',
			html: 'The king looks at the reeds, and then at the sky, as if the sky had also agreed without telling him. He does not ride back. His sons stay with him. By morning the lodge is a quiet room, and Changjori does not let anyone write down what the room looked like.',
			ko: '임금은 갈대를 보고, 하늘을 본다. 하늘도 자기 몰래 동의한 것처럼. 그는 말을 돌려 내려가지 않는다. 아들들도 그와 함께 있는다. 아침이 되면 산막은 조용한 방이고, 창조리는 그 방이 어땠는지 아무도 적지 못하게 한다.'
		},
		{
			kind: 'p',
			html: 'They put the crown on the salt seller before the hats are thrown away. They call him Micheon. He still turns if you say the other name softly. Jaemo always says it softly, and Jaemo is not in the hall. Halls, he has explained, are where shoes get stolen.',
			ko: '그들은 모자를 버리기도 전에 소금장수에게 왕관을 씌운다. 미천이라 부른다. 다른 이름을 낮추어 부르면 그는 아직 돌아본다. 재모는 언제나 낮추어 부르고, 재모는 전각에 없다. 전각은, 그의 설명으로는, 신이 훔쳐지는 곳이다.'
		},
		{
			kind: 'scene',
			label: 'The western gate · thirteen years later',
			ko: '서쪽 성문 · 십삼 년 뒤',
			weather: 'dusk',
			jump: { en: 'Thirteen Years Later…', ko: '십삼 년 뒤…', year: 313 }
		},
		{
			kind: 'map',
			year: 313,
			from: 300,
			places: ['gungnae', 'amnok', 'pyongyang'],
			riverNames: true,
			caption: 'The river he sold salt on, and the city that taxed the hand that sold it.',
			ko: '그가 소금을 팔던 강, 그리고 그 손을 세금 매기던 성.'
		},
		{
			kind: 'p',
			html: 'There is a city on that river that has been Chinese since before this family’s first king. Seals. Granaries. A market that buys Goguryeo salt and taxes the wrist that weighed it. The letters home ride through a harbor. Micheon takes the harbor, and the letters stop.',
			ko: '그 강가에, 이 집안의 첫 임금보다 오래 중국이었던 성이 있다. 인장. 곳간. 고구려 소금을 사면서, 저울 든 손목에 세금을 매기는 시장. 본국으로 가는 편지는 포구를 지난다. 미천이 포구를 취하자, 편지가 끊긴다.'
		},
		{
			kind: 'p',
			html: 'The city waits a winter. Then another. The man who holds it for a court that no longer writes comes out to the gate, because nobody is coming from the other direction.',
			ko: '성은 겨울을 기다린다. 한 번 더. 더 이상 편지를 쓰지 않는 조정을 대신해 성을 쥐고 있던 사내가 성문 밖으로 나온다. 다른 쪽에서는 아무도 오지 않으니까.'
		},
		{
			kind: 'dialogue',
			person: 'zhangtong',
			chip: '#8a9aaa',
			lines: [
				'이 인장은 진나라 황제의 것입니다.',
				'황제는 답을 하지 않습니다. 삼 년째입니다.'
			],
			en: ['This seal belongs to the emperor of Jin.', 'The emperor does not answer. It has been three years.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			lines: ['저도 답을 못 받아 봤습니다.', '더 짧았습니다.', '더 아팠습니다.'],
			en: ['I’ve gone without an answer.', 'Mine was shorter.', 'It hurt more.']
		},
		{
			kind: 'dialogue',
			person: 'zhangtong',
			chip: '#8a9aaa',
			lines: [
				'성 안의 사람들은 제 백성입니다.',
				'걷게 해 주십시오. 서쪽 기마족이 받겠습니다.',
				'남는 사람은 가게를 지키게 해 주십시오. 저는 이 사람들을 불태우지 않겠습니다. 왕께서도 그러지 마십시오.'
			],
			en: [
				'The people in this city are mine.',
				'Let them walk. The horsemen in the west will take them.',
				'Let the ones who stay keep their shops. I will not burn them. Don’t you burn them either.'
			]
		},
		{
			kind: 'p',
			html: 'Micheon looks at the gate, not at the seal. He has stood at gates where a man with a brush decided what his back was worth. He is not in a hurry to be that man.',
			ko: '미천은 인장이 아니라 성문을 본다. 그는 붓을 든 사내가 그의 등의 값을 정하던 문 앞에 서 본 적이 있다. 그 사내가 될 생각은 급하지 않다.'
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			lines: [
				'걷는 사람은 걷게 하시오.',
				'남는 사람은 내 사람이오.',
				'세금은 내일이오. 소금값은 오늘이고.'
			],
			en: ['Whoever wants to walk, walks.', 'Whoever stays is mine.', 'Tax is tomorrow. The price of salt is today.']
		},
		{
			kind: 'p',
			html: 'They walk. Not all of them. The ones who want the western road go with their governor and are received by horsemen who are glad of a city they did not have to fight. The ones who stay open the shops, because a shop that opens is a vote.',
			ko: '그들은 걷는다. 전부가 아니다. 서쪽 길을 원하는 사람들은 총관과 함께 가고, 싸우지 않고 성을 얻은 기마족의 환대를 받는다. 남는 사람들은 가게를 연다. 문을 여는 가게는 표다.'
		},
		{
			kind: 'p',
			html: 'In the market a man is shorting a measure, on purpose, with the concentration of a priest. He does not bow. He does not know which of the muddy officers used to tie his sacks.',
			ko: '시장에서 한 사내가 일부러 되를 덜 담고 있다. 사제처럼 집중해서. 그는 절하지 않는다. 진흙투성이 장교 중 누가 예전에 제 가마니를 묶었는지 모른다.'
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['도련님.', '아니. 이제 뭐라고 부르냐.', '신 도둑은 아니지. 그거 하나는 알지.'],
			en: ['Young master.', 'No. What do I call you now.', 'Not a shoe thief. I know that much.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			lines: ['그 말 하지 마.', '그 되. 아직도 덜 담지.'],
			en: ['Don’t.', 'That measure. You still short it.']
		},
		{
			kind: 'dialogue',
			person: 'jaemo',
			chip: '#c4a574',
			lines: ['덜 담아야 정확하지.', '왕한테는 특히.', '왕들은 가득 찬 되를 못 견뎌. 경험이 그래.'],
			en: ['Short is how it stays honest.', 'Especially for a king.', 'Kings can’t bear a full measure. Experience.']
		},
		{
			kind: 'dialogue',
			person: 'micheon',
			chip: '#C30000',
			lines: ['꽉 채워.', '값은 내가 낸다.'],
			en: ['Fill it.', 'I’ll pay.']
		},
		{
			kind: 'p',
			html: 'He pays. Full measure. The sister city folds the next summer, and the last Chinese seal on the peninsula goes into a box nobody opens. He will die a king. The boy in the pond does not die at all. That one is still counting sacks, and he is better at it than the men who were born under a roof.',
			ko: '그는 값을 치른다. 가득 채워서. 이듬해 여름, 형제뻘 되는 성이 접히고, 반도의 마지막 중국 인장은 아무도 열지 않는 상자에 들어간다. 그는 왕으로 죽을 것이다. 연못의 소년은 죽지 않는다. 그 아이는 아직 가마니를 세고 있고, 지붕 아래에서 태어난 자들보다 그걸 잘한다.'
		},
		{
			kind: 'p',
			html: '<b>A farmer in a white coat walks onto an open field. On the hill above it, an emperor is watching…!</b>',
			ko: '<b>흰 옷을 입은 농부 하나가 탁 트인 들판으로 걸어 들어간다. 그 위 언덕에서, 황제가 지켜보고 있다…!</b>'
		}
	]
};

editStory((story) => {
	const ch = story.find((c) => c.id === 'seventh-invasion');
	const boil = ch.entries.findIndex((e) => e.title === 'Boiling River');
	if (boil < 0) throw new Error('Boiling River missing');
	if (ch.entries.some((e) => e.title === 'King Micheon')) throw new Error('King Micheon already inserted');
	ch.entries[boil].hidden = true;
	ch.entries.splice(boil, 0, entry);

	const yodong = ch.entries.find((e) => e.title === 'Yodong');
	const last = yodong.blocks[yodong.blocks.length - 1];
	if (!last.html.includes('On the road to Ansi')) throw new Error('Yodong closer moved: ' + last.html.slice(0, 80));
	last.html = '<b>Sixty years after a capital burned, a boy is still throwing stones at frogs…!</b>';
	last.ko = '<b>도성이 불타고 예순 해. 아직 개구리에게 돌을 던지는 아이가 있다…!</b>';
	return true;
});

console.log('inserted King Micheon, hid Boiling River');
