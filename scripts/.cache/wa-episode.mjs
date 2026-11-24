/** One-shot insert payload for the Wa episode. Deleted after it lands in story.json. */
export const waEpisode = {
	year: '647',
	sub: 'Spring',
	tone: 'sea voyage',
	subtitle: '왜나라',
	logline: {
		en: 'The sea was in a good mood. It introduced him to people who had never heard of Silla.',
		ko: '바다는 기분이 좋았다. 신라를 모르는 사람들에게 그를 소개했다.'
	},
	badges: ['flag:silla', 'flag:wa', 'flag:baekje'],
	music: 'The Strait',
	title: 'Wa',
	place: 'asuka',
	cast: ['chunchu', 'hayato-spear', 'hayato-chief', 'kumaso-elder', 'abe', 'takutsu', 'pung', 'kotoku'],
	images: [],
	blocks: [
		{
			kind: 'p',
			html: 'Bidam is a month dead. The sea is in a good mood.',
			ko: '비담이 죽은 지 한 달이다. 바다는 기분이 좋다.'
		},
		{
			kind: 'p',
			html: 'Chunchu distrusts a good mood. The yard at home is still damp where they scrubbed it. Half the guards are counting the dead. The queen, who cannot tell him about the rain, has sent him west with one small ship and a speech she practiced.',
			ko: '춘추는 좋은 기분을 못 믿는다. 집의 마당은 닦아 낸 자리가 아직 축축하다. 호위 반은 죽은 사람을 세고 있다. 비 올 줄도 모르는 여왕이, 연습한 말과 작은 배 한 척을 들려 서쪽으로 보냈다.'
		},
		{
			kind: 'p',
			html: 'The crossing is gentle. The sailors sing. He lets them.',
			ko: '바다는 곱다. 뱃사람들이 노래한다. 그는 두어 둔다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['노래는 하게. 이 바다가 예의를 차리는 동안만.'],
			en: ['Sing. Only while this sea is minding its manners.']
		},
		{
			kind: 'p',
			html: 'He stands at the rail in magenta silk and counts islands the way other men count beads. The strait is a door. He has a speech for the other side of it. He has a second speech, in case the first one meets a man who has already heard it.',
			ko: '그는 자홍빛 비단을 입고 난간에 서서, 남들이 염주를 세듯 섬을 센다. 해협은 문이다. 문 저쪽에 쓸 말이 있다. 그 말을 이미 들어 본 사내를 만날 경우에 대비한 둘째 말도 있다.'
		},
		{
			kind: 'map',
			year: 647,
			places: ['tsushima', 'asuka'],
			caption: 'West, by way of the strait.',
			ko: '서쪽이다. 해협을 거쳐서.'
		},
		{
			kind: 'scene',
			label: 'Wood Island',
			ko: '목도',
			weather: 'clear'
		},
		{
			kind: 'place',
			place: 'tsushima',
			html: 'A mountain in the strait. Off it, a rock with one stake.',
			ko: '해협의 산. 그 옆, 말뚝 하나 박힌 바위.'
		},
		{
			kind: 'p',
			html: 'The song stops before anyone gives an order.',
			ko: '누가 명하기 전에 노래가 멈춘다.'
		},
		{
			kind: 'p',
			html: 'On the rock, a blue flame stands up like a post that forgot to fall. Two centuries of weather. The column is still the hottest color there is.',
			ko: '바위 위에 푸른 불이 기둥처럼 서 있다. 쓰러지라는 말을 못 들은 기둥. 이백 년의 날씨다. 기둥은 아직도 불에서 제일 뜨거운 색이다.'
		},
		{
			kind: 'p',
			html: 'The record is very proud of that detail. Jesang called himself a dog of Silla while the color climbed him. Chunchu read it as a boy and thought it was a line. From the rail it is a man who had a choice of fleets and took the one that burned him.',
			ko: '정사는 그 대목을 매우 자랑스러워한다. 제상은 색깔이 몸을 타고 오르는 동안 스스로를 신라의 개라 했다. 춘추는 어릴 때 읽고 문장인 줄 알았다. 난간에서 보니, 함대를 고를 수 있었던 사내가 제 몸을 태울 함대를 고른 일이다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['……오래 타는군.', '개가 되려면 글이 너무 많았지.'],
			en: ['…It has been burning a long time.', 'Too much reading in him, for a dog.']
		},
		{
			kind: 'p',
			html: 'He bows. It is a ridiculous thing to do to a fire. The fire has had enough bows. It does not flicker.',
			ko: '절한다. 불에게 할 짓은 아니다. 불은 절을 충분히 받았다. 흔들리지도 않는다.'
		},
		{
			kind: 'p',
			html: 'He is still bowed when the wind changes its mind.',
			ko: '아직 허리가 굽은 채인데, 바람이 마음을 바꾼다.',
			weather: 'storm'
		},
		{
			kind: 'scene',
			label: 'The south shore',
			ko: '남쪽 해안',
			weather: 'storm'
		},
		{
			kind: 'p',
			html: 'The mast goes first. Then the song, which had started again out of fear. Then the ship.',
			ko: '돛대가 먼저 간다. 그다음 노래. 무서워서 다시 시작한 노래다. 그다음 배.'
		},
		{
			kind: 'p',
			html: 'He holds the rail and thinks of a knot Yushin would have opinions about. The knot does not ask. The sea puts him on sand and keeps the sailors.',
			ko: '난간을 붙든 채, 유신이라면 뭐라 했을 매듭을 생각한다. 매듭은 묻지 않는다. 바다는 그를 모래에 두고 뱃사람들을 가져간다.'
		},
		{
			kind: 'p',
			html: 'The men who pull him out of the surf have falcons inked on their chests and a shield painted in a spiral. A bear-skin hangs in the same row of huts. The court up the island has been writing these houses down as finished. The beach has not heard.',
			ko: '파도에서 그를 끌어올리는 사내들 가슴에는 매가 새겨져 있다. 방패에는 소용돌이. 같은 집들 사이에 곰 가죽이 걸려 있다. 섬 위의 조정은 이 집들을 끝난 일로 적어 왔다. 해변은 그 글을 못 들었다.'
		},
		{
			kind: 'card',
			person: 'hayato-spear',
			caption: 'A falcon warrior. He has a word, and he is willing to repeat it.',
			ko: '매의 전사. 단어가 하나 있고, 반복할 마음이 있다.'
		},
		{
			kind: 'p',
			html: 'Chunchu stands up in wet magenta and gives them the greeting he practiced on eastern envoys. Name. Rank. He is not a raider. He would like a fire that is not a person.',
			ko: '춘추가 젖은 자홍빛 속에서 일어선다. 동쪽 사신들에게 연습한 인사를 한다. 이름. 자리. 노략질하러 온 게 아니다. 사람이 아닌 불을 원한다.'
		},
		{
			kind: 'dialogue',
			person: 'hayato-spear',
			lines: ['타우.'],
			en: ['Tau.']
		},
		{
			kind: 'p',
			html: 'He tries the word back, hopeful. The man points at Chunchu’s chest. Then at his own.',
			ko: '희망을 품고 그 말을 따라 한다. 사내가 춘추의 가슴을 가리킨다. 그다음 제 가슴.'
		},
		{
			kind: 'dialogue',
			person: 'hayato-spear',
			lines: ['타우.', '타우.'],
			en: ['Tau.', 'Tau.']
		},
		{
			kind: 'p',
			html: 'So he has been told that he is a person. It is less than he hoped from a sixth language.',
			ko: '사람인 줄은 전달된 셈이다. 여섯 번째 언어에 기대한 것보다는 적다.'
		},
		{
			kind: 'p',
			html: 'He tries Baekje. The faces do not move. He tries his own tongue, slower, as if speed had been the offense. A man in a falcon headdress steps out of the huts. The feathers are wet. The eyes are not.',
			ko: '백제어를 해 본다. 얼굴이 안 움직인다. 제 나라 말을 해 본다. 더 천천히. 잘못이 속도였다는 듯이. 매 머리쓰개를 쓴 사내가 집 사이에서 나온다. 깃은 젖었다. 눈은 아니다.'
		},
		{
			kind: 'card',
			person: 'hayato-chief',
			caption: 'The Falcon Chief. The capital’s language is weather to him.',
			ko: '매의 우두머리. 도성의 말은 그에게 날씨다.'
		},
		{
			kind: 'dialogue',
			person: 'hayato-chief',
			lines: ['아푸이.'],
			en: ['Apuy.']
		},
		{
			kind: 'p',
			html: 'A bear-elder behind him says the same word, and nods at a bare patch of ground. Chunchu, who hates to leave a syllable unused, answers in kind.',
			ko: '뒤의 곰 어른이 같은 말을 하고, 맨땅을 턱으로 가리킨다. 음절을 놀리는 걸 싫어하는 춘추가 그대로 받아 준다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['아푸이.'],
			en: ['Apuy.']
		},
		{
			kind: 'p',
			html: 'The chief looks pleased. That was a mistake.',
			ko: '우두머리가 흡족해한다. 실수였다.'
		},
		{
			kind: 'scene',
			label: 'Green wood',
			ko: '푸른 나무',
			weather: 'storm'
		},
		{
			kind: 'p',
			html: 'They walk him into the village. Someone puts a one-piece wooden clog on each wet foot. It clacks. He looks down as if the shoe had joined the conversation.',
			ko: '마을로 걸어 들어간다. 누가 젖은 발에 통나무 신 한 짝씩을 신긴다. 딱, 소리가 난다. 그는 신이 대화에 끼어든 사람처럼 아래를 본다.'
		},
		{
			kind: 'p',
			html: 'The ground they nodded at is a stake. The wood piled at it still has leaves. He understands the word then, which is late, which is his least favorite time to understand a thing.',
			ko: '그들이 가리킨 땅에는 말뚝이 있다. 쌓인 나무에는 아직 잎이 붙어 있다. 그제야 그 말의 뜻을 안다. 늦었다. 그가 제일 싫어하는 시각이다.'
		},
		{
			kind: 'dialogue',
			person: 'kumaso-elder',
			lines: ['아푸이.'],
			en: ['Apuy.']
		},
		{
			kind: 'p',
			html: 'They tie his wrists to the post with a cord that has done this before. The falcon chief touches the green wood with a coal. The leaves hiss. Smoke goes up in a thick polite column and declines to become fire.',
			ko: '이 일을 해 본 밧줄로 손목을 말뚝에 묶는다. 매의 우두머리가 숯을 푸른 나무에 댄다. 잎이 쉰다. 연기가 점잖은 기둥으로 올라가고, 불이 되기는 사양한다.'
		},
		{
			kind: 'p',
			html: 'A shy orange takes the hem of the magenta and dies when the next wet leaf gives up its water. Chunchu coughs a couplet. The couplet does not impress the wood.',
			ko: '수줍은 주황이 자홍빛 단을 물들이다가, 다음 젖은 잎이 물을 토하는 순간 죽는다. 춘추가 기침 사이로 대구를 읊는다. 나무는 감동하지 않는다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['마른 나무.', '마른 나무를 원하시는 거면, 말이라도—'],
			en: ['Dry wood.', 'If it’s dry wood you want, I could at least—']
		},
		{
			kind: 'p',
			html: 'The chief sends a boy for the dry pile behind the huts. The boy is quick. The red cloak is quicker.',
			ko: '우두머리가 집 뒤의 마른 나무를 가지러 아이를 보낸다. 아이는 빠르다. 붉은 망토가 더 빠르다.'
		},
		{
			kind: 'card',
			person: 'abe',
			caption: 'Abe no Hirafu. Loud, fur at the collar, and already laughing.',
			ko: '아베노 히라부. 목덜미에 털. 벌써 웃고 있다.'
		},
		{
			kind: 'card',
			person: 'takutsu',
			caption: 'Echi no Takutsu. Hair looped over each ear. He has not drawn yet.',
			ko: '에치노 다쿠쓰. 귀 위로 말아 올린 머리. 아직 칼을 안 뽑았다.'
		},
		{
			kind: 'dialogue',
			person: 'abe',
			chip: '#b42318',
			lines: [
				'야, 이게 불이오?',
				'잎이 아직 붙어 있잖소. 공자는 불보다 기침에 먼저 죽겠소.'
			],
			en: [
				'Hey. This is the fire?',
				'The leaves are still on it. The prince will cough himself dead before he burns.'
			]
		},
		{
			kind: 'dialogue',
			person: 'takutsu',
			chip: '#6b3a2a',
			lines: ['가만히 계시오.', '밧줄만 자르겠소.'],
			en: ['Hold still.', 'I’m only cutting the rope.']
		},
		{
			kind: 'p',
			html: 'The cord parts. The hem smokes and decides to stop. The falcon chief looks at the red cloak, at the spiral shields, and at the boy coming back with dry wood that no longer has a job.',
			ko: '밧줄이 끊긴다. 단의 연기가 그만두기로 한다. 매의 우두머리는 붉은 망토를 보고, 소용돌이 방패들을 보고, 더 이상 할 일이 없어진 마른 나무를 들고 오는 아이를 본다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['대화 중이었소.', '상대가 누구인지만 몰랐을 뿐.'],
			en: ['I was in the middle of a conversation.', 'I had only failed to learn who with.']
		},
		{
			kind: 'dialogue',
			person: 'abe',
			chip: '#b42318',
			lines: ['여섯 나라 말로 불이오, 공자?', '이쪽 말은 그 안에 없소. 걸으시오. 도성까지는 멀고, 신은 시끄럽소.'],
			en: [
				'Six languages, and you landed on fire?',
				'Theirs isn’t in the set. Walk. The capital is far, and your shoes are loud.'
			]
		},
		{
			kind: 'scene',
			label: 'A new fashion',
			ko: '새 유행',
			weather: 'clear'
		},
		{
			kind: 'p',
			html: 'They walk north. The wooden clogs clack the whole way. Echi’s hair is looped over each ear like two black shells under a white band, and the loops bounce when he turns his head, which he does whenever Chunchu starts a sentence and does not finish it.',
			ko: '북으로 걷는다. 통나무 신은 내내 딱딱거린다. 에치의 머리는 흰 띠 아래 귀 양옆에 검은 조개처럼 말려 있다. 춘추가 문장을 시작하다 말 때마다 그가 고개를 돌리고, 그때마다 조개가 튄다.'
		},
		{
			kind: 'place',
			place: 'asuka',
			html: 'The eastern court. The new halls are two years old and already proud of it.',
			ko: '동쪽의 조정. 새 전각은 지은 지 두 해째, 벌써 그 사실을 자랑스러워한다.'
		},
		{
			kind: 'p',
			html: 'At the gate, the king’s men wear stiff leather shoes with a point, cut from a western pattern. They walk as if the floor were a rumor they are trying to believe. Chunchu looks down at his own clogs and feels, for the first time since the beach, overdressed for the wrong century.',
			ko: '문에서 왕의 신하들은 서국 본을 뜬, 코가 뾰족한 뻣뻣한 가죽신을 신고 있다. 바닥이 소문이고 그 소문을 믿어 보려는 걸음이다. 춘추는 제 통나무 신을 내려다본다. 해변 이후 처음으로, 엉뚱한 세기에 차린 옷차림 같다.'
		},
		{
			kind: 'p',
			html: 'Echi kneels, takes the clogs off him, and sets them outside the threshold. He does it the way a man sets down a dog that followed him in.',
			ko: '에치가 무릎을 꿇고 신을 벗겨, 문지방 밖에 놓는다. 따라 들어온 개를 내려놓듯.'
		},
		{
			kind: 'dialogue',
			person: 'takutsu',
			chip: '#6b3a2a',
			lines: ['안에서는 이게 신발이오.', '밖에서는 그게 신발이오. 둘 다 익숙해지시오. 못 해도 되오.'],
			en: ['Indoors, these are shoes.', 'Outdoors, those are. Get used to both. Or don’t.']
		},
		{
			kind: 'p',
			html: 'A man at the post claps twice before he steps through. Chunchu claps once. Faces turn. He adds the second clap late, like a man joining a hymn on the last word.',
			ko: '기둥 옆의 사내가 문 안으로 들기 전에 손뼉을 두 번 친다. 춘추는 한 번 친다. 얼굴들이 돌아본다. 그는 늦게 두 번째를 보탠다. 찬송 마지막 단어에 끼어든 사람처럼.'
		},
		{
			kind: 'p',
			html: 'A woman of the court crosses the yard. Her brows are her own, dark and low. A comma of jade sits at her throat, cousin to the curved green stones at home, and her jacket is a Baekje cut that went out of fashion in his mother’s rooms. He bows to the jade. She laughs, because she thinks he bowed to her. He decides to let her keep the mistake. It is the first thing today that has gone well for anyone.',
			ko: '조정의 여인이 마당을 가로지른다. 눈썹은 제 것이다. 짙고 낮다. 목에는 굽은 옥 하나가 있다. 집의 푸른 곡옥과 사촌이다. 저고리는 어머니 방에서 유행이 지난 백제 본이다. 그는 옥에게 절한다. 그녀는 자신에게 절한 줄 알고 웃는다. 그는 그 오해를 두기로 한다. 오늘 누군가에게 잘된 첫 일이다.'
		},
		{
			kind: 'p',
			html: 'Inside, a clerk shaves a wooden slip with a small knife. The characters are Baekje. The teacher who carried the books over is dust. His students’ students are still copying his hand, and they cover the slip when they notice a foreigner reading it. Too late. Chunchu has already had the line. It is a drill. Even the drills here have better handwriting than his court on a good day.',
			ko: '안에서는 서기가 작은 칼로 나무 쪽을 깎고 있다. 글자는 백제 글자다. 책을 안고 건너온 스승은 흙이 되었다. 그 제자의 제자들이 아직도 그 손을 베끼고, 외국인이 읽는 걸 알아채고서야 쪽을 덮는다. 늦었다. 춘추는 이미 한 줄을 보았다. 습자다. 여기 습자만 해도, 잘되는 날의 자기 조정보다 글씨가 낫다.'
		},
		{
			kind: 'p',
			html: 'They feed him raw bream, cut so clean it looks offended. He eats it with the face he uses for bad wine at a good table. Abe laughs into his cup. Echi does not.',
			ko: '회를 낸다. 너무 깨끗하게 떠서, 생선이 기분 상한 얼굴이다. 그는 좋은 상에서 나쁜 술을 받을 때 쓰는 얼굴로 먹는다. 아베는 잔에 대고 웃는다. 에치는 안 웃는다.'
		},
		{
			kind: 'dialogue',
			person: 'abe',
			chip: '#b42318',
			lines: ['북해 물고기가 더 차갑소.', '이건 따뜻해서 거의 음식이오.'],
			en: ['The northern sea’s fish are colder.', 'This is so warm it’s almost food.']
		},
		{
			kind: 'scene',
			label: 'The red guest',
			ko: '붉은 손님'
		},
		{
			kind: 'p',
			html: 'The hall is new wood and old loyalties. A chair has been set for the visitor, a western idea with Silla legs that do not know where to stand. Across the room, on a floor cushion, in red and gold, a man is laughing at a song and wearing the pointed shoes as if he had been born in the rumor.',
			ko: '전각은 새 나무와 오래된 의리다. 손님용 의자가 놓여 있다. 서국 생각이고, 신라의 다리는 어디 둘지 모른다. 방 건너 방석 위, 붉은색과 금색 속에서, 한 사내가 노래에 웃고 있다. 뾰족한 신을, 그 소문 속에서 태어난 사람처럼 신고.'
		},
		{
			kind: 'card',
			person: 'pung',
			look: 'prince',
			caption: 'Prince Pung. Fifth son of Baekje. The most comfortable man in the room.',
			ko: '부여풍. 백제의 다섯째. 이 방에서 제일 편한 사람.'
		},
		{
			kind: 'p',
			html: 'He does not stand up quickly. That is the welcome, and the little cut inside it. Then he stands, because he is still a prince, and the standing is graceful and half a breath late.',
			ko: '빨리 일어서지 않는다. 환대다. 그 안의 작은 칼이기도 하다. 그다음 일어선다. 아직 왕자라서다. 일어서는 품이 좋고, 반 박자 늦다.'
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'김공. 도코— 아니.',
				'앉으시오. 바닥이 더 편하오. 의자는 보여 주려고 둔 거요.'
			],
			en: [
				'Lord Kim. Doko— no.',
				'Sit. The floor is kinder. The chair is here so someone can be seen sitting in it.'
			]
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: [
				'전하의 글씨가 마당의 나무 쪽에 있더이다.',
				'습자까지 이 나라 글씨보다 낫더이다.'
			],
			en: [
				'Your hand is on the wooden slips in the yard.',
				'Even the drills outwrite my court.'
			]
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'스승의 스승의 손이오. 나는 베끼기만 하오.',
				'여기선 베끼면 대접이오. 사비에서는 베끼면 다섯째였소.'
			],
			en: [
				'My teacher’s teacher’s hand. I only copy.',
				'Here, copying gets you a cushion. At home, copying got me fifth.'
			]
		},
		{
			kind: 'p',
			html: 'He says it lightly. The cup in his hand is full, and was full before Chunchu came in. Fifteen years of someone else’s capital have taught him the timing of a laugh. He uses it now, so the next thing can sound like a kindness.',
			ko: '가볍게 말한다. 손의 잔은 가득하고, 춘추가 들기 전부터 가득했다. 남의 도성에서 십오 년을 살면 웃음의 박자를 배운다. 지금 그 박자를 쓴다. 다음 말이 친절처럼 들리게.'
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'청은 하지 마시오, 김공.',
				'왕은 끝까지 들을 거요. 그게 이 집의 예절이오. 배는 안 나올 거요.'
			],
			en: [
				'Don’t ask, Lord Kim.',
				'The king will hear you out. That’s the manners here. The ships will not come out of it.'
			]
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['전하께서 대신 한 말씀만 해 주신다면.'],
			en: ['If Your Highness said one word in my place.']
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'그러면 나는 집으로 가는 거요.',
				'집은 아직 싫소. 술은 여기가 먼저 오니까.'
			],
			en: [
				'Then I go home.',
				'I’m not ready for home. The wine arrives here before I finish wanting it.'
			]
		},
		{
			kind: 'scene',
			label: 'The audience',
			ko: '알현'
		},
		{
			kind: 'card',
			person: 'kotoku',
			caption: 'King Kōtoku. He lets a man finish. Then he keeps the old promise.',
			ko: '고토쿠. 말을 끝까지 듣는다. 그리고 옛 약속을 지킨다.'
		},
		{
			kind: 'p',
			html: 'The king is courteous and unhurried. He asks after the new queen. He admires the padding in a crown he has never seen. He lets Chunchu get all the way to the army.',
			ko: '왕은 예의 바르고 서두르지 않는다. 새 여왕을 묻는다. 보지도 않은 왕관의 솜을 칭찬한다. 춘추가 군대까지 가게 둔다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: [
				'한쪽만 열리는 문은 예의를 갖춘 벽입니다.',
				'백제는 그 문으로 제 성을 태우러 들어옵니다. 전하의 배만 있으면 문이 문이 됩니다.'
			],
			en: [
				'A door that opens one way is a wall with manners.',
				'Baekje comes through it to burn my forts. Your ships would make it a door again.'
			]
		},
		{
			kind: 'p',
			html: 'Pung pours the king’s cup and does not translate. He does not have to. The king has understood every word, and the pouring is the answer standing in the room in red.',
			ko: '풍이 왕의 잔을 따른다. 통역은 안 한다. 안 해도 된다. 왕은 단어마다 알아들었고, 붉은 옷으로 잔을 따르는 일이 이미 답이다.'
		},
		{
			kind: 'dialogue',
			person: 'kotoku',
			chip: '#3d4f6f',
			lines: [
				'벽이라 해 두겠소.',
				'점잖은 벽이오. 오래되었소. 백제는 만족하는 듯하고.'
			],
			en: [
				'We’ll keep the wall, then.',
				'A polite wall. An old one. Baekje seems content with it.'
			]
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: [
				'만족은 저 방석 위의 일입니다.',
				'제 마당의 일은 재입니다.'
			],
			en: [
				'The contentment is on that cushion.',
				'The business in my yard is ash.'
			]
		},
		{
			kind: 'p',
			html: 'A minister starts the sentence about filling the strait with ships. The king thanks him before the verb arrives. He thanks Chunchu. He thanks the prince of Baekje for the wine. He decides nothing out loud, which is how this court refuses a man without making a face.',
			ko: '대신 하나가, 해협을 배로 채우자는 문장을 시작한다. 왕은 동사가 도착하기 전에 고맙다고 한다. 춘추에게도 고맙다고 한다. 술을 따른 백제의 왕자에게도. 아무것도 소리 내어 결정하지 않는다. 이 조정이 얼굴 안 붉히고 거절하는 방식이다.'
		},
		{
			kind: 'dialogue',
			person: 'kotoku',
			chip: '#3d4f6f',
			lines: [
				'바다는 넓소.',
				'우리 사이에 그대로 두시오. 글씨는 이미 건너왔소. 배로 충분하오.'
			],
			en: [
				'The sea is wide.',
				'Leave it between us. The handwriting already crossed. That was enough ships.'
			]
		},
		{
			kind: 'p',
			html: 'Chunchu bows the correct depth. His hands are steady. The chair, when he sits again, is just a chair. Pung, on the cushion, lifts his cup a finger, the way you salute a game you have already won.',
			ko: '춘추가 정확한 깊이로 절한다. 손은 안정되어 있다. 다시 앉은 의자는 그냥 의자다. 방석 위의 풍이 잔을 손가락만큼 든다. 이미 이긴 대국에 하는 인사다.'
		},
		{
			kind: 'scene',
			label: 'Before dawn',
			ko: '새벽 전',
			weather: 'clear'
		},
		{
			kind: 'p',
			html: 'Before the court is awake, Pung walks him down to a boat. The pointed shoes are quiet on the new planks. The wooden clogs have not been invited.',
			ko: '조정이 깨기 전에 풍이 그를 배까지 걸어 내려간다. 뾰족한 신은 새 널빤지 위에서 조용하다. 통나무 신은 초대를 못 받았다.'
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'서쪽은 저기요.',
				'그 사람은 인용을 좋아한대요. 공께는 맞겠소.'
			],
			en: [
				'West is that way.',
				'I’m told he likes a quotation. You’ll do.'
			]
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['안에서 한 말씀만 해 주셨어도 됐습니다.'],
			en: ['One word in that room would have done.']
		},
		{
			kind: 'dialogue',
			person: 'pung',
			chip: '#c9a227',
			lines: [
				'여러 말씀 했소. 술이 먼저 말했지.',
				'다시는 저 해변에서 죽지 마시오. 문서가 늘어나니까.'
			],
			en: [
				'I said several. The wine spoke first.',
				'Don’t die on that beach again. It makes paperwork.'
			]
		},
		{
			kind: 'p',
			html: 'He looks sorry for half a breath. Then the sorry leaves, and the cup is still in his other hand, and he is a man going back to a cushion that knows his shape.',
			ko: '반 호흡쯤 미안해한다. 그다음 미안함은 가고, 다른 손에는 아직 잔이 있고, 그는 제 모양을 아는 방석으로 돌아가는 사내다.'
		},
		{
			kind: 'dialogue',
			person: 'chunchu',
			chip: '#D8258C',
			lines: ['누리시오.', '누군가는 누려야지.'],
			en: ['Enjoy it.', 'Someone should.']
		},
		{
			kind: 'p',
			html: 'The boat takes the current. Behind him the new halls are a dark comb against a pale sky. Somewhere south, a boy is still explaining a pile of dry wood to a chief. Somewhere in the strait, a blue post is still standing its watch.',
			ko: '배가 물살을 탄다. 등 뒤의 새 전각은 옅은 하늘에 걸린 검은 빗이다. 남쪽 어딘가에서 아이가 아직도 마른 나무 더미를 우두머리에게 설명하고 있다. 해협 어딘가에서 푸른 기둥은 아직도 파수를 선다.'
		},
		{
			kind: 'p',
			html: '<b>Wa keeps its old friend. West of west, a man who hates to lose is still on his throne…!</b>',
			ko: '<b>왜는 옛 벗을 지킨다. 서쪽의 서쪽에, 지는 걸 싫어하는 사내가 아직 자리에 있다…!</b>'
		}
	]
};
