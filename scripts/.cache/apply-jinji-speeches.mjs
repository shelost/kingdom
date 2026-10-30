import { readFileSync, writeFileSync } from 'fs';

const story = JSON.parse(readFileSync('src/lib/data/story.json', 'utf8'));

function entry(title) {
	for (const ch of story) {
		const e = ch.entries.find((x) => x.title === title);
		if (e) return e;
	}
	throw new Error('missing entry ' + title);
}

function idx(blocks, pred, label) {
	const i = blocks.findIndex(pred);
	if (i < 0) throw new Error('not found: ' + label);
	return i;
}

function insertAfter(blocks, pred, label, news) {
	const i = idx(blocks, pred, label);
	blocks.splice(i + 1, 0, ...news);
	return i;
}

function htmlIs(s) {
	return (b) => b.kind === 'p' && b.html === s;
}
function en0(s) {
	return (b) => b.kind === 'dialogue' && b.en?.[0] === s;
}

const yongsu = entry('Yongsu');
const seohyun = entry('Seohyun');
const bupmin = entry('Bupmin');
const bihyung = entry('Bihyung');
const gi = entry('Gi (起)');

// ————————————————————————— Yongsu: Jinji before the fall —————————————————————————

insertAfter(
	yongsu.blocks,
	htmlIs('He is a bad king and a generous drunk, and a city can love both. Saryang ward loves him. Saryang ward also writes the songs.'),
	'wine years close',
	[
		{
			kind: 'scene',
			label: 'The Moon Palace · a feast that does not end',
			ko: '월성 · 끝나지 않는 잔치',
			year: 578
		},
		{
			kind: 'p',
			html: 'The lanterns are still up at noon. A councillor’s wife is asleep across two cushions. Dice click in a crown that is not supposed to leave the hall. The king is on the floor, sleeves rolled, teaching a stable boy a song the stable boy already knows.',
			ko: '정오인데도 등불은 아직 켜져 있다. 대등의 아내가 방석 두 개에 걸쳐 잠들어 있다. 전각을 나가면 안 되는 왕관 안에서 주사위가 굴러간다. 임금은 바닥에 앉아 소매를 걷고, 마부가 이미 아는 노래를 마부에게 가르치고 있다.'
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: ['Again. From the bit about the pig.', 'No, louder. The Council’s asleep. We can be honest.'],
			lines: ['다시. 돼지 나오는 데부터.', '아니, 더 크게. 화백 어르신들 주무셔. 솔직해져도 돼.']
		},
		{
			kind: 'p',
			html: 'His brother has been standing in the doorway long enough for the wine to go flat. The king sees him. Waves. Pours.',
			ko: '아우는 문이 열린 채로 꽤 오래 서 있었다. 술이 김이 빠질 만큼. 임금이 그를 본다. 손을 흔든다. 따른다.'
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: ['Biryun. Sit. You look like Father.', 'Father’s dead. Sit anyway.'],
			lines: ['비륜아. 앉아. 아버지 닮았다.', '아버지는 돌아가셨잖아. 그래도 앉아.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['The northern fort sent three letters.', 'You answered none of them.', 'Saryun. Please.'],
			lines: ['북쪽 성에서 편지 세 장이 왔소.', '한 장도 안 보셨소.', '사륜이형. 제발.']
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: ['I answered.', 'I sent them a pig.', 'You’re hovering. Hovering is for uncles. Sit or go shout at a wall, I don’t mind which.'],
			lines: ['답은 했어.', '돼지 한 마리 보냈지.', '또 서서 잔소리야. 그건 숙부들이나 하는 거야. 앉든가, 벽에다 대고 소릴 지르든가. 난 상관없어.']
		},
		{
			kind: 'p',
			html: 'Biryun does not sit. The king goes back to the song. The doorway stays empty a long time after the brother has gone.',
			ko: '비륜은 앉지 않는다. 임금은 노래로 돌아간다. 아우는 이미 갔는데, 문간은 한참을 비어 있다.'
		},
		{
			kind: 'scene',
			label: 'Saryang ward · the morning after',
			ko: '사량부 · 그 다음 날 아침'
		},
		{
			kind: 'p',
			html: 'He comes down without the crown. Barefoot. A gate-guard who drank the king’s wine all night will not make it home, so the king puts the man over his shoulder and walks him there, arguing with the man’s wife about porridge.',
			ko: '왕관은 두고 내려온다. 맨발이다. 밤새 임금 술을 먹은 문지기가 집을 못 찾아가자, 임금이 그 사내를 어깨에 업고 데려다 준다. 문지기 아내와 죽 타령을 하며.'
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: ['He ate. I watched.', 'If he throws it up that’s his talent, not mine.', 'Have you got another bowl? I’m starving. Don’t look at me like that, I paid for the rice.'],
			lines: ['먹었어. 내가 봤어.', '토하면 그 사람 재주지, 내 재주 아니고.', '그릇 하나 더 있냐? 나 배고파. 그런 눈으로 보지 마, 쌀값은 내가 냈어.']
		},
		{
			kind: 'p',
			html: 'He sits on the well-rim with the charcoal men and eats out of the same pot. A child climbs into his lap because the lap is there. He lets her steal the last of the rice. This is the king Saryang ward will write songs about. The other one, the one on the floor with the dice, they leave out of the verses, mostly.',
			ko: '숯장수들과 우물턱에 앉아 같은 솥에서 먹는다. 아이가 무릎이 있길래 올라온다. 마지막 밥을 훔쳐 가도 그냥 둔다. 사량부가 노래로 남길 임금은 이 사람이다. 바닥에 앉아 주사위를 굴리던 다른 임금은, 가사에서 대체로 빼 버린다.'
		},
		{
			kind: 'scene',
			label: 'The Harmony Council · a match',
			ko: '화백회의 · 혼담'
		},
		{
			kind: 'p',
			html: 'The room tries kindness, which in this room means a marriage. Queen Sado has had the brazier turned. Geochilbu has a name ready. The name has been in the Cloud King’s rooms, and in this king’s, and the room would like that made official before the songs get worse.',
			ko: '이 방이 친절을 베풀 때는, 혼인을 시킨다. 사도왕후가 화로를 돌려 놓았다. 거칠부는 이름을 준비해 두었다. 그 이름은 구름왕의 방에도 있었고, 이 임금의 방에도 있었다. 노래가 더 나빠지기 전에, 방은 그걸 정식으로 만들고 싶어 한다.'
		},
		{
			kind: 'dialogue',
			person: 'geochilbu',
			en: ['Majesty. The house is unsettled.', 'Lady Mishil has kept three kings’ rooms in order. Take her to wife. The city will read it as a grown man sitting down.'],
			lines: ['전하. 집안이 아직 안 가라앉았습니다.', '미실 마님은 임금 세 분의 방을 지켜 온 분이옵니다. 아내로 들이십시오. 도성은 그걸, 어른이 앉은 걸로 읽을 것입니다.']
		},
		{
			kind: 'p',
			html: 'Mishil is already in the hall. She has been in halls like this longer than the king has been king. She does not look at him. She looks at the brazier, which is doing its job.',
			ko: '미실은 이미 그 자리에 있다. 이 임금이 임금이 되기 전부터, 이런 방에 더 오래 앉아 온 사람이다. 그를 보지 않는다. 제 할 일을 하는 화로를 본다.'
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: ['Ah.', 'She’s not my type.'],
			lines: ['아.', '나랑 안 맞는데.']
		},
		{
			kind: 'p',
			html: 'Somebody’s cup hits a saucer. The king laughs, because he always does, and then he has to fill the laugh with something.',
			ko: '누군가의 잔이 받침에 부딪힌다. 임금은 웃는다. 늘 웃으니까. 그리고 그 웃음을 무언가로 메워야 한다.'
		},
		{
			kind: 'dialogue',
			person: 'jinji',
			chip: '#3d5fa8',
			en: [
				'No, truly. Look at her. She doesn’t spill.',
				'I like people who spill. I like a room that makes a mess and then sings about it.',
				'She’s… very tidy. Mother’s type. Father’s type. Not mine.',
				'Somebody pour her wine anyway. She’s been in here longer than I have.'
			],
			lines: [
				'진짜야. 저분 봐. 안 흘리잖아.',
				'난 흘리는 사람이 좋아. 난장 피우고 그걸로 노래하는 방이 좋고.',
				'저분은… 너무 반듯해. 어머니 취향이지. 아버지 취향이고. 내 취향은 아니고.',
				'그래도 술 따라 드려. 나보다 이 방에 오래 계셨으니까.'
			]
		},
		{
			kind: 'dialogue',
			person: 'mishil',
			chip: '#9a4a6e',
			en: ['I don’t drink in the morning, Majesty.', 'You may keep the joke. I’ve heard worse from kinder men.'],
			lines: ['아침엔 안 마십니다, 전하.', '농담은 가지고 계십시오. 더 착한 입에서도 더 심한 걸 들어 봤습니다.']
		},
		{
			kind: 'p',
			html: 'He salutes her with the cup, delighted, and the match dies in the minutes. The room will remember the word type. She will remember that he said it in front of the brazier, where everyone could see her face.',
			ko: '그는 잔으로 그녀에게 경례를 한다. 즐거워하며. 혼담은 의사록 안에서 죽는다. 방은 ‘취향’이라는 단어를 기억할 것이다. 그녀는, 화로 앞에서, 다들 자기 얼굴을 볼 수 있는 곳에서 그 말을 했다는 걸 기억할 것이다.'
		},
		{
			kind: 'scene',
			label: 'The palace outskirts · the side well',
			ko: '궁 가장자리 · 곁우물'
		},
		{
			kind: 'p',
			html: 'The well at the side gate is for servants. After the hall, two people who are not servants sit on the stone anyway. She has her hands in her sleeves. He has a sutra he is not reading.',
			ko: '곁문 우물은 하인용이다. 전각이 파한 뒤, 하인이 아닌 두 사람이 그래도 그 돌에 앉는다. 그녀는 손을 소매 안에 넣고 있다. 그는 읽지 않는 경전을 들고 있다.'
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['He didn’t hear you either.'],
			lines: ['형님은 당신 말도 안 들었어요.']
		},
		{
			kind: 'dialogue',
			person: 'mishil',
			chip: '#9a4a6e',
			en: ['He heard.', 'He thought it was a joke.', 'That’s worse.'],
			lines: ['들었어.', '농담인 줄 알았지.', '그게 더 나빠.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['I keep telling him about the forts.', 'He sends them a pig and calls it an answer.'],
			lines: ['나는 성 얘기를 자꾸 하지요.', '형님은 돼지 한 마리 보내고 답이라 하시고.']
		},
		{
			kind: 'dialogue',
			person: 'mishil',
			chip: '#9a4a6e',
			en: ['I keep being in the room.', 'Same pig.'],
			lines: ['나는 그 방에 계속 있고.', '같은 돼지야.']
		},
		{
			kind: 'p',
			html: 'A maid comes for water, sees them, and goes the long way round. The well is very loud, suddenly, just water on stone.',
			ko: '시녀 하나가 물을 길러 왔다가 둘을 보고, 먼 길로 돌아간다. 우물이 갑자기 아주 시끄러워진다. 돌에 부딪히는 물소리만.'
		},
		{
			kind: 'dialogue',
			person: 'mishil',
			chip: '#9a4a6e',
			en: ['You’re the only one who looks tired about it.'],
			lines: ['그걸로 지쳐 보이는 사람은, 당신뿐이야.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['You’re the only one who isn’t pretending it worked.', '…May I sit here tomorrow.'],
			lines: ['된 척하지 않는 사람은, 당신뿐이고.', '…내일도 여기 앉아도 되겠소.']
		},
		{
			kind: 'dialogue',
			person: 'mishil',
			chip: '#9a4a6e',
			en: ['The well doesn’t charge rent.', 'Bring a better book. That one isn’t fooling anyone.'],
			lines: ['우물은 세를 안 받아.', '책은 제대로 들고 와. 그거, 누구 눈도 안 속여.']
		},
		{
			kind: 'p',
			html: 'They sit until the shadow of the wall reaches their feet. They will sit like this again, years later, in a hall that has waited too long for a child. Not yet. Today it is only two people the king will not hear.',
			ko: '담 그림자가 발끝까지 닿을 때까지 앉아 있다. 몇 해 뒤, 아이를 너무 오래 기다린 전각에서, 둘은 다시 이렇게 앉게 된다. 아직은 아니다. 오늘은, 임금이 듣지 않는 사람 둘일 뿐이다.'
		}
	]
);

// Biryun recognises the clerk
insertAfter(
	yongsu.blocks,
	htmlIs('A palace servant who talks to the air is the lowest thing in the palace. They salt his shoes and leave his bowl by the kitchen door like a dog’s, and the maids who won’t sleep near him still walk past his door.'),
	'servants yard',
	[
		{
			kind: 'scene',
			label: 'The servants’ yard · a prince in the shade',
			ko: '하인 마당 · 그늘의 왕자'
		},
		{
			kind: 'p',
			html: 'Biryun does not come down into the yard. He watches from the corridor, where a prince can still pretend he was going somewhere else. The boy is talking to a post. Then he laughs, a beat late, the way a man laughs when he has decided the room can hear it.',
			ko: '비륜은 마당으로 내려가지 않는다. 회랑에서 본다. 왕자라면 아직, 다른 데로 가던 길이라고 둘러댈 수 있는 곳. 아이는 기둥에 대고 말하고 있다. 그리고 한 박자 늦게 웃는다. 방이 들을 수 있게 하기로 한 사람의 웃음이다.'
		},
		{
			kind: 'p',
			html: 'The laugh is his brother’s. The nose is his brother’s. The boy looks up, and Biryun is already turning away.',
			ko: '그 웃음은 형의 것이다. 코도 형의 것이다. 아이가 고개를 든다. 비륜은 이미 돌아선다.'
		},
		{
			kind: 'p',
			html: 'That night a second pair of shoes appears by the kitchen door, unsalted. The boy never learns whose. He talks to those too, to be safe.',
			ko: '그날 밤 부엌문 앞에 신발 한 켤레가 더 놓인다. 소금은 안 뿌려진 것. 아이는 누구 것인지 끝내 모른다. 이것들한테도 말을 건넨다. 안전을 위해.'
		}
	]
);

// Biryun vouches when the court starts counting
insertAfter(
	yongsu.blocks,
	htmlIs('He is seventeen, and his cousin King Jinpyung has two small daughters and no son, and the court is doing arithmetic. Even a ghost’s son, if the ghost was a king, is a very interesting number. Men start visiting Yongsu with gifts. Men who visit with gifts are counting.'),
	'court arithmetic',
	[
		{
			kind: 'scene',
			label: 'The Harmony Council · a number',
			ko: '화백회의 · 숫자 하나'
		},
		{
			kind: 'p',
			html: 'The room would like the ghost boy written down. Biryun has not spoken in this chamber since they took his brother’s crown. He speaks now.',
			ko: '방은 귀신 아이를 적고 싶어 한다. 비륜은 형의 왕관을 빼앗긴 뒤로 이 방에서 입을 연 적이 없다. 지금 연다.'
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: [
				'He’s a servant.',
				'He talks to posts. The king likes him. Leave him off the list.',
				'If you put Jinji’s face on a tally, you will have to finish what you started with Jinji. I would rather you didn’t.'
			],
			lines: [
				'하인입니다.',
				'기둥에 대고 말하오. 임금께서 그 아이를 좋아하시오. 명단에 올리지 마시오.',
				'진지의 얼굴을 숫자로 적으면, 진지로 시작한 일을 끝마쳐야 할 거요. 그건 안 하는 편이 낫소.'
			]
		},
		{
			kind: 'dialogue',
			person: 'noribu',
			en: ['And if he isn’t a servant, my lord.'],
			lines: ['하인이 아니라면요, 나리.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['Then the room already took his house.', 'Don’t take the joke too. He lives on it.'],
			lines: ['그러면 방은 이미 그 집을 빼앗았소.', '농담까지 빼앗지 마시오. 그 아이는 그걸로 사니까.']
		},
		{
			kind: 'p',
			html: 'The minutes do not take the name. The gifts still come, which is how you know the minutes were never the whole room. Biryun does not go to the boy. That is the point of a covert kindness. The boy has to keep being strange, or the kindness was for nothing.',
			ko: '의사록은 그 이름을 적지 않는다. 선물은 그래도 온다. 의사록이 방 전체가 아니었다는 증거다. 비륜은 아이에게 가지 않는다. 숨은 친절이란 그런 것이다. 아이가 계속 이상해야, 그 친절이 헛되지 않는다.'
		}
	]
);

// Biryun vouches again when Suulbu wants him sent away
insertAfter(
	yongsu.blocks,
	en0('He talks to walls, uncle. You talk to the Council.'),
	'provinces refusal',
	[
		{
			kind: 'scene',
			label: 'The east corridor · after the High Councillor',
			ko: '동쪽 회랑 · 상대등이 돌아간 뒤'
		},
		{
			kind: 'p',
			html: 'Biryun is waiting in the corridor, which he never does. The king almost walks past him.',
			ko: '비륜이 회랑에서 기다리고 있다. 원래 기다리는 사람이 아닌데. 임금이 하마터면 지나칠 뻔한다.'
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['Keep him.'],
			lines: ['그 아이, 두시오.']
		},
		{
			kind: 'dialogue',
			person: 'jinpyung',
			en: ['Uncle.'],
			lines: ['숙부.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['I know that face.', 'Don’t send it to a province where nobody is watching.', 'I didn’t say it in the room. I’m saying it to you. That’s the difference.'],
			lines: ['그 얼굴, 압니다.', '아무도 안 보는 지방으로 보내지 마시오.', '방 안에서는 안 했소. 조카한테 하는 거요. 그게 다른 점이오.']
		},
		{
			kind: 'dialogue',
			person: 'jinpyung',
			en: ['…You saw him in the yard.', 'Years ago.'],
			lines: ['…마당에서 보셨군요.', '몇 해 전에.']
		},
		{
			kind: 'dialogue',
			person: 'sukwon',
			chip: '#3d4654',
			en: ['I saw my brother.', 'Then I left extra shoes.', 'Do not make me explain the shoes, nephew. Just keep the boy.'],
			lines: ['형을 봤소.', '그리고 신발을 더 놔 뒀소.', '신발 설명은 시키지 마시오, 조카. 아이만 두시오.']
		},
		{
			kind: 'p',
			html: 'Jinpyung nods, once, the way he nods at a stone he has decided not to move. Biryun goes home by the side gate, past the well, and does not mention the conversation even to the woman who sits there.',
			ko: '진평은 고개를 한 번 끄덕인다. 옮기지 않기로 한 돌을 보듯. 비륜은 곁문으로 돌아간다. 우물을 지나며. 거기 앉는 여자에게도 이 얘기는 하지 않는다.'
		}
	]
);

// Madman: Yongsu to Chunchu, Class 59
insertAfter(
	yongsu.blocks,
	htmlIs('He hated his father that winter more than he hated the five.'),
	'age eleven close',
	[
		{
			kind: 'story',
			label: 'Madman',
			ko: '광인'
		},
		{
			kind: 'scene',
			label: 'The Hwarang yard gate · Class 59’s first morning',
			ko: '화랑 연무장 문 · 오십구기의 첫 아침',
			jump: { year: 618, en: 'Six Years Later…', ko: '여섯 해 뒤…' }
		},
		{
			kind: 'place',
			place: 'hwarang_gate',
			html: 'The gate lets them in. Fathers stop here.',
			ko: '그 문이 들여보낸다. 아비들은 여기까지다.'
		},
		{
			kind: 'p',
			html: 'At fifteen the goblin’s whelp goes into the Hwarang yard. His father walks him to the gate, though he has been asked three times not to. He has been practising on the stream all week. The boy looks at the yard, not at him.',
			ko: '열다섯에 도깨비 새끼는 화랑 마당에 든다. 아버지는 세 번이나 오지 말라는 부탁을 듣고도 문까지 따라온다. 한 주 내내 개울에 대고 연습한 말이 있다. 아이는 아버지가 아니라 마당을 본다.'
		},
		{
			kind: 'dialogue',
			person: 'yongsu',
			chip: '#6a7cb0',
			en: ['The post is listening. You don’t have to.', 'That’s fine. I can do both of you at once.'],
			lines: ['기둥은 듣고 있어. 너는 안 해도 되고.', '괜찮아. 너희 둘 한 번에 해도 돼.']
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			en: ['Father. They’re staring.'],
			lines: ['아버지. 다들 봐요.']
		},
		{
			kind: 'dialogue',
			person: 'yongsu',
			chip: '#6a7cb0',
			en: [
				'Good. Let them.',
				'Listen. You will want a thing the whole city thinks is stupid. A cause. A name. A pile of stones in a stream, I don’t know. They will call you a madman for it.',
				'Let them. Laughing men aren’t counting.',
				'I have been a madman on purpose since before you could walk. It is the only honest job in this palace.',
				'You fight for it anyway. Even when the room is sure you have lost your mind. Especially then.',
				'If they ever stop laughing, start worrying. That’s when they write you down.'
			],
			lines: [
				'좋아. 보게 둬.',
				'들어. 너는 온 도성이 바보 같다고 할 일을 원하게 될 거야. 명분. 이름. 개울에 쌓은 돌무더기, 뭐가 됐든. 그걸로 널 미치광이라 부를 거야.',
				'부르게 둬. 웃는 사람들은 안 세거든.',
				'나는 네가 걷기 전부터 일부러 미치광이였어. 이 궁에서 정직한 일은 그거 하나야.',
				'그래도 싸워. 방이 네가 미쳤다고 확신할 때도. 그럴 때일수록.',
				'웃음을 멈추면, 그때 걱정해. 그때가 너를 적는 때니까.'
			]
		},
		{
			kind: 'p',
			html: 'Chunchu watches a boy in a blue headband cross the yard and does not answer. Halfway through the rest of it — there is a rest of it, the stream heard the long version — he turns to the forty new boys and tells them the man at the gate is the family steward. He gets confused, poor thing.',
			ko: '춘추는 푸른 머리띠를 맨 아이 하나가 마당을 가로지르는 걸 보고, 대답하지 않는다. 나머지 말 — 나머지가 있다, 개울은 긴 버전을 들었다 — 중간쯤에서, 그는 새로 온 마흔 명에게 돌아서서 말한다. 문 앞의 저 사람은 집 청지기라고요. 가끔 정신이 오락가락하는 불쌍한 양반이라고.'
		},
		{
			kind: 'p',
			html: 'The steward walks home grinning the whole way. Chunmyung wants to know what’s funny.',
			ko: '청지기는 집까지 내내 싱글거리며 걸어간다. 천명이 뭐가 그렇게 웃기냐고 묻는다.'
		},
		{
			kind: 'dialogue',
			person: 'yongsu',
			chip: '#6a7cb0',
			en: ['He disowned me in front of the whole yard.', 'First morning! Took me thirty years to learn that.', 'He heard it, though. Boys hear what they pretend not to. That’s why you say it at a gate.'],
			lines: ['온 마당 앞에서 날 내쳤어.', '첫날 아침에! 난 그거 배우는 데 서른 해 걸렸는데.', '그래도 들었어. 못 들은 척하는 것들이 제일 잘 듣거든. 그래서 문 앞에서 하는 거야.']
		},
		{
			kind: 'dialogue',
			person: 'chunmyung',
			en: ['…You’re proud of him.'],
			lines: ['…자랑스럽구나, 그 애가.']
		},
		{
			kind: 'dialogue',
			person: 'yongsu',
			chip: '#6a7cb0',
			en: ['I’m going to have the steward’s coat made in better silk.'],
			lines: ['청지기 옷을 더 좋은 비단으로 맞춰야겠어.']
		}
	]
);

// ————————————————————————— Seohyun: Assimilation —————————————————————————

{
	const i = idx(seohyun.blocks, en0('Not the riding.'), 'muryuk riding');
	// This block is "Not the riding. / Next spring you go to the yard..."
	// Insert story label before it, then replace the dialogue with a longer Assimilation.
	seohyun.blocks.splice(i, 1, {
		kind: 'story',
		label: 'Assimilation',
		ko: '동화'
	}, {
		kind: 'dialogue',
		chip: '#8B5CF6',
		person: 'muryuk',
		en: [
			'Not the riding.',
			'Next spring you go to the yard. Hwarang. I’ve asked.'
		],
		lines: [
			'말 타는 거 말고.',
			'내년 봄에 니 마당 간다. 화랑. 내가 부탁해 놨다.'
		]
	});
}

// The True Bone / down you get block stays. Add one beat after True Bone line by expanding that block.
{
	const i = idx(seohyun.blocks, en0('They take True Bone. That’s what you are. It’s written down.'), 'true bone');
	seohyun.blocks[i] = {
		kind: 'dialogue',
		chip: '#8B5CF6',
		person: 'muryuk',
		en: [
			'They take True Bone. That’s what you are. It’s written down.',
			'In there you talk like them. Not like me. You don’t yet. I hear it when you’re tired.',
			'Make a man of yourself. This country doesn’t keep boys who remember another harbour.',
			'Helm stays here. You go in Silla.',
			'Don’t make me say it twice. I don’t talk so you won’t pick it up.',
			'…Down you get. You’ll wake your mother.'
		],
		lines: [
			'진골은 받는다. 니가 진골이다. 적혀 있다.',
			'거기선 그들처럼 말해. 나처럼 말고. 아직은 아니다. 피곤할 때 들린다.',
			'사내 돼라. 이 나라는 다른 포구를 기억하는 아이를 안 둔다.',
			'투구는 여기 두고. 너는 신라로 들어가.',
			'두 번은 안 한다. 내가 말 안 하는 건, 니가 내 말투 배워 갈까 봐다.',
			'…내려가라. 어매 깬다.'
		]
	};
}

// ————————————————————————— Seohyun: Just One Person —————————————————————————

insertAfter(
	seohyun.blocks,
	htmlIs('Seohyun rides with him as far as the city, then as far as the yard, then as far as the yard gate and no further. Fathers are not allowed further.'),
	'seohyun to the gate',
	[
		{
			kind: 'story',
			label: 'Just One Person',
			ko: '단 한 사람'
		}
	]
);

insertAfter(
	seohyun.blocks,
	en0('…Loyalty is soil. You plant it where you’re standing, and you keep planting.'),
	'loyalty is soil',
	[
		{
			kind: 'dialogue',
			person: 'seohyeon',
			chip: '#3E8EF0',
			en: [
				'I learned that as a husband before I learned it as an officer.',
				'Your mother’s father still won’t say my name. The street learned it from him. That’s a room, Yushin. A whole palace of rooms like that.',
				'You will not win that room. You find one person in it. Just one. Who looks at you when the rest look at the gate.',
				'That’s enough. That’s… that’s the whole job, actually.'
			],
			lines: [
				'그건 무관으로 알기 전에, 남편으로 알았다.',
				'네 외할아버지는 아직 내 이름을 안 부르신다. 거리도 그분한테 배웠고. 그게 방이다, 유신아. 그런 방이 궁 하나에 가득해.',
				'그 방을 이기진 못한다. 그 안에서 한 사람만 찾아라. 단 한 사람. 나머지는 문을 볼 때, 너를 보는 사람.',
				'그면 된다. 그게… 그게 사실 일의 전부다.'
			]
		},
		{
			kind: 'dialogue',
			person: 'yushin',
			chip: '#4a8fe0',
			en: ['Who was yours.'],
			lines: ['아버님 것은 누구였습니까.']
		},
		{
			kind: 'dialogue',
			person: 'seohyeon',
			chip: '#3E8EF0',
			en: ['Your mother.', 'Then you.'],
			lines: ['네 어머니다.', '그다음엔 너고.']
		}
	]
);

// ————————————————————————— Bupmin: A Boy's Dream —————————————————————————

insertAfter(
	bupmin.blocks,
	htmlIs('The Hwarang train under the Marshal: horse, bow, verse, and above all gyuku, a horse-ball game a lazier age will call polo.'),
	'hwarang train under marshal',
	[
		{
			kind: 'story',
			label: 'A Boy’s Dream',
			ko: '소년의 꿈'
		},
		{
			kind: 'scene',
			label: 'The Hwarang yard gate · Class 82’s first morning',
			ko: '화랑 연무장 문 · 팔십이기의 첫 아침',
			year: 641
		},
		{
			kind: 'place',
			place: 'hwarang_gate',
			html: 'The gate lets them in. Fathers stop here.',
			ko: '그 문이 들여보낸다. 아비들은 여기까지다.'
		},
		{
			kind: 'p',
			html: 'Chunchu walks him as far as the gate and no further. He has a verse for this. He always has a verse. The boy has heard most of them at supper.',
			ko: '춘추는 문까지만 데려다 주고, 더는 안 간다. 이 아침용 시가 있다. 늘 시가 있다. 아이는 저녁상에서 대부분 들어 본 것들이다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			en: [
				'Keep a dream.',
				'The ugly kind. The kind a room laughs at. If you put it down to be polite, you will spend the rest of your life being polite, and you will still be empty.'
			],
			lines: [
				'꿈은 쥐고 가거라.',
				'못생긴 쪽으로. 방이 웃는 쪽으로. 예의 지키느라 내려놓으면, 평생 예의만 지키다가 속이 빈 채로 끝나게 된다.'
			]
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#3fa9c9',
			look: 'hwarang',
			en: ['Father. You used to say—', 'About a king for all.'],
			lines: ['아버지. 예전에 말씀하시길—', '모두를 위한 왕이요.']
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			en: ['I used to say a lot of things.', 'That one was a boy’s dream.'],
			lines: ['예전에 내가 한 말이 많지.', '그건 소년의 꿈이었고.']
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#3fa9c9',
			look: 'hwarang',
			en: ['You just told me not to give those up.'],
			lines: ['지금 그걸 놓지 말라고 하셨잖아요.']
		},
		{
			kind: 'p',
			html: 'Chunchu looks at the yard, then at the boy, then at the gate-bar, which is easier.',
			ko: '춘추는 마당을 보고, 아이를 보고, 그다음엔 문빗장을 본다. 그게 더 쉽다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			en: [
				'I didn’t give it up.',
				'I gave it to you. Look. It’s walking into a yard in a headband.',
				'Mine is smaller now. Stay alive until supper. Make your sister laugh. Be the father I did not always manage to be.',
				'That’s the dream I get to keep. The best one I have left. For you. For Gotaso.',
				'Don’t you dare be reasonable about it.'
			],
			lines: [
				'놓은 게 아니다.',
				'너한테 준 거지. 봐라. 머리띠 매고 마당으로 걸어 들어가고 있잖아.',
				'내 것은 이제 더 작다. 저녁까지 살아 있어라. 동생을 웃겨라. 내가 늘 되진 못한 아버지가 되어라.',
				'그게 내가 쥐고 있는 꿈이다. 나한테 남은 제일 좋은 것. 너한테. 고타소한테.',
				'그걸로 점잖게 나오지 마라.'
			]
		},
		{
			kind: 'dialogue',
			person: 'munmu',
			chip: '#3fa9c9',
			look: 'hwarang',
			en: ['…Yes, Father.'],
			lines: ['…예, 아버지.']
		},
		{
			kind: 'p',
			html: 'He ties the headband once, straight, and lets the gate take him. Then he goes to collect votes, because the room still thinks that is the larger dream.',
			ko: '머리띠를 한 번, 반듯하게 매 주고, 문에 맡긴다. 그리고 표를 모으러 간다. 방은 아직도 그게 더 큰 꿈이라고 생각하니까.'
		}
	]
);

{
	const i = idx(
		bupmin.blocks,
		htmlIs('His father is in the Council chamber, collecting votes. His uncle keeps the yard, and the yard is where Bupmin lives now.'),
		'father in council'
	);
	bupmin.blocks[i] = {
		kind: 'p',
		html: 'His uncle keeps the yard, and the yard is where Bupmin lives now.',
		ko: '연무장은 외숙이 지킨다. 법민은 이제 그 연무장에서 산다.'
	};
}

// ————————————————————————— Gi: The Higher Teaching (Biryun is the father) —————————————————————————

function walkFlash(blocks, fn) {
	for (const b of blocks) {
		if (b.kind === 'flashback' && /higher teaching/i.test(b.title || '')) fn(b);
		if (b.blocks) walkFlash(b.blocks, fn);
	}
}

let taught = 0;
walkFlash(gi.blocks, (fb) => {
	taught++;
	fb.title = 'The Higher Teaching · 아비달마';
	const inner = fb.blocks;
	const nameI = idx(inner, en0('Bidam…'), 'bidam name');
	inner[nameI + 1] = {
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		look: 'hwarang',
		en: ['Yes, Father…', 'I was named after the Abhidharma, the higher teaching. It—'],
		lines: ['예, 아버지…', '아비달마, 더 높은 가르침에서 따온 이름입니다. 그건—']
	};
	inner.splice(nameI + 2, 1, {
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		en: [
			'Yes… the higher teaching.',
			'I watched my brother keep a city and lose a room.',
			'He was kind in the street. He sent pigs to forts. He thought being loved was the same as being true.',
			'When they took the crown he still thought it was a joke. I was in the doorway. He poured me wine and went back to the song.'
		],
		lines: [
			'그래… 더 높은 가르침.',
			'나는 형이 도성은 지키고 방은 잃는 걸 봤어.',
			'거리에선 착했지. 성에 돼지를 보냈고. 사랑받는 거랑 바른 거랑 같은 줄 알았어.',
			'왕관을 빼앗길 때도 농담인 줄 알았고. 나는 문간에 있었어. 형은 술을 따라 주고 노래로 돌아갔지.'
		]
	}, {
		kind: 'dialogue',
		chip: '#7b5cd6',
		person: 'bidam',
		look: 'hwarang',
		en: ['Father. I know the saying. Upon victory, a king—'],
		lines: ['아버지. 그 말씀, 압니다. 이기면 임금—']
	}, {
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		en: [
			'Then you know it is a trap.',
			'As a Hwarang your duty is to walk toward the truth anyway. Even if no one agrees. Even if they mock you. In isolation if you must. There is no other way.',
			'Son… I need you to be a man who would rather be a <b>righteous traitor</b> than an unrighteous king.',
			'I learned that watching him. Do not make me watch it twice.',
			'Bidam… I love you…!',
			'Go make us proud, son…!'
		],
		lines: [
			'그러면 덫인 줄 아는 거다.',
			'화랑으로서 네 일은, 그래도 진실을 향해 걷는 것이다. 아무도 동의하지 않아도. 비웃어도. 혼자라도. 다른 길은 없다.',
			'아들아… 나는 네가 불의한 임금보다, <b>의로운 역적</b>이 되기를 바란다.',
			'형님을 보면서 배운 거다. 두 번은 보지 않게 해 다오.',
			'비담아… 내가 너를 사랑한다…!',
			'가서, 우리를 자랑스럽게 해다오, 아들아…!'
		]
	});
	const alchunI = idx(inner, en0('Oi, Bidam. Your uncle walk you to the gate?'), 'alchun uncle');
	inner[alchunI] = {
		kind: 'dialogue',
		person: 'alchun',
		chip: '#c9a24a',
		en: ['Oi, Bidam. Your old man walk you to the gate?', 'Mine sent a servant and a lunch. Want half?'],
		lines: ['어이, 비담아. 너거 아부지가 대문까지 데려다주더나?', '우리 아부지는 종 하나랑 도시락 보냈다. 반 무끼가?']
	};
});
if (taught !== 1) throw new Error('higher teaching count ' + taught);

// Bihyung (song): a taste of Madman before the steward joke
insertAfter(
	bihyung.blocks,
	htmlIs('At fifteen the goblin’s whelp goes into the Hwarang yard. His father walks him to the gate, though he has been asked three times not to, and delivers a speech he has been practising on the stream all week.'),
	'bihyung gate walk',
	[
		{
			kind: 'story',
			label: 'Madman',
			ko: '광인'
		},
		{
			kind: 'dialogue',
			person: 'yongsu',
			chip: '#6a7cb0',
			en: ['You. Post. Listen.', 'A cause. Even when they laugh. Especially when they laugh.', 'Chunchu. You’re included. Don’t look at the yard while I’m being wise.'],
			lines: ['야. 기둥아. 들어.', '명분. 웃을 때도. 웃을 때일수록.', '춘추야. 너도 포함이다. 내가 현명한 척하는 동안 마당 보지 마.']
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			en: ['…Father. The yard is that way.'],
			lines: ['…아버지. 마당은 저쪽이에요.']
		}
	]
);

writeFileSync('src/lib/data/story.json', JSON.stringify(story, null, '\t') + '\n');
console.log('ok', {
	yongsu: yongsu.blocks.length,
	seohyun: seohyun.blocks.length,
	bupmin: bupmin.blocks.length,
	bihyung: bihyung.blocks.length
});
