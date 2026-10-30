// Splice Momal opening: childhood theft, streets, boot + princes split, interview.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));

const opening = [
	{
		kind: 'p',
		html: 'The Park house is True Bone. The boy is a problem.',
		ko: '박 집은 진골이다. 그 아이는 문제다.'
	},
	{ kind: 'section', label: 'Silla', ko: '신라' },
	{
		kind: 'scene',
		label: 'The Landing',
		ko: '나루',
		jump: { year: 394, en: 'Before the Horsemen…', ko: '기병 오기 전…' }
	},
	{
		kind: 'p',
		html: 'A neighbour’s landing on the south shore. Fresh caulk. A green boat that still smells of pine.',
		ko: '남쪽 나루, 이웃집 선착장. 갓 메운 틈. 솔 내 나는 초록 배.'
	},
	{
		kind: 'dialogue',
		speaker: 'A servant',
		gender: 'm',
		en: ['This is the Kim landing.', 'The Parks are two roofs over.'],
		lines: ['여기 김씨 나룹니다.', '박 집은 지붕 둘 너머예요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I know.', 'Uncle said the green one’s coming in.', 'Caulking.'],
		lines: ['알아.', '숙부님이 초록 배 끌어들이라셨어.', '손보러.']
	},
	{
		kind: 'dialogue',
		speaker: 'A servant',
		gender: 'm',
		en: ['Which uncle.'],
		lines: ['어느 숙부님이요.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['If I have to say which uncle, you shouldn’t be on this landing.'],
		lines: ['어느 숙부냐고 물어야 하면, 이 나루에 있으면 안 되지.']
	},
	{
		kind: 'p',
		html: 'The servant looks at the silk. True Bone silk. He lets go of the rope.',
		ko: '종이 비단을 본다. 진골 비단이다. 밧줄을 놓는다.'
	},
	{
		kind: 'p',
		html: 'Momal does not run. He rows like a boy who was asked. That is the trick.',
		ko: '모말은 뛰지 않는다. 심부름 온 아이처럼 젓는다. 그게 수법이다.'
	},
	{
		kind: 'card',
		person: 'jesang',
		caption: 'Park of the south shore. The hall will say Jesang. The boats are already Momal.',
		ko: '남쪽 나루의 박. 대청은 나중에 제상이라 한다. 배는 벌써 모말이다.',
		still: '/intro/jesang--park-jesang.jpg'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['That was someone’s boat.'],
		lines: ['누구 배였어.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['They left it untied.', 'That’s a gift.'],
		lines: ['묶어 놨어야지.', '그건 선물이야.']
	},
	{
		kind: 'p',
		html: 'A man comes out in his indoor socks. Looks at the empty water. Looks at the sky. Both fists.',
		ko: '남자가 버선 바람으로 나온다. 빈 물을 본다. 하늘을 본다. 주먹 둘.'
	},
	{
		kind: 'dialogue',
		speaker: 'A Kim lord',
		gender: 'm',
		en: ['MOMAL!!!!'],
		lines: ['모마아아알!!!!']
	},
	{
		kind: 'p',
		html: 'You’ve heard it. Last month a gate. The month before, a saddle. Always the sky. Always that name. As if heaven might toss the thing back.',
		ko: '들어 본 고함이다. 지난달엔 문. 그 전달엔 안장. 늘 하늘. 늘 그 이름. 하늘이 도로 던져 줄 것처럼.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['That’s a crime.'],
		lines: ['그건 죄야.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then don’t send me when you’re king.'],
		lines: ['그럼 왕 되면 나 보내지 마.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Momal.', 'If I ever have to send someone.'],
		lines: ['모말아.', '내가 언제 사람을 보내야 하면.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['Then send me.', 'Don’t send a speech.'],
		lines: ['그러면 나 보내.', '말만 말고.']
	},
	{
		kind: 'p',
		html: 'They do not shake on it. A shake would make it a vow. It is already worse than a vow.',
		ko: '악수하지 않는다. 악수하면 맹세가 된다. 이미 맹세보다 더한 것이다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Momal.', 'It can’t be anybody else.'],
		lines: ['모말아.', '다른 사람은 안 돼.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['You don’t have to ask.'],
		lines: ['안 시켜도 알아.']
	},
	{
		kind: 'p',
		html: 'His own roof is the sort that gets invited to sacrifices. A Park name older than the hall. The boy is what they apologize for at other people’s gates.',
		ko: '제 집은 제사에 불리는 지붕이다. 대청보다 오래된 박 씨. 그 아이는 남 대문에서 사과하는 이유다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A Park elder',
		gender: 'm',
		en: ['If this house hears that shout one more—'],
		lines: ['이 집에서 그 고함 한 번만 더—']
	},
	{
		kind: 'p',
		html: 'The chair is already empty. The green boat is already a dot.',
		ko: '의자는 이미 비었다. 초록 배는 이미 점이다.'
	},
	{
		kind: 'scene',
		label: 'The Streets',
		ko: '거리',
		jump: { year: 418, en: 'The Thin Years…', ko: '얇은 세월…' }
	},
	{
		kind: 'p',
		html: 'Seventeen winters after the horsemen came down like weather, Surabol still sings like a city that lost.',
		ko: '기병들이 날씨처럼 내려온 지 열일곱 겨울. 서라벌은 아직, 진 도시처럼 노래를 부른다.'
	},
	{
		kind: 'p',
		html: 'The red banners never quite went home. They saved the capital. Then they stayed. Then they took the king’s brothers and called it rent.',
		ko: '붉은 깃발은 끝내 다 돌아가지 않았다. 도성을 구했다. 그리고 남았다. 그리고 임금의 아우들을 데려가고, 그걸 세라 불렀다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A woman at the well',
		gender: 'f',
		en: ['It’s finished.', 'You hear me? The country’s finished.'],
		lines: ['끝났다 아이가.', '들리냐. 나라가 끝났어.']
	},
	{
		kind: 'dialogue',
		speaker: 'A boy',
		gender: 'm',
		en: [
			'Older brother went north—',
			'Younger went over the water—',
			'The king sits in a hall with nobody in it—'
		],
		lines: ['형은 북으로—', '아우는 바다로—', '임금은 빈 대청에 앉아—']
	},
	{
		kind: 'p',
		html: 'He is not making it up. It is a song. The market has three tunes for it, and they all rhyme, and none of them are kind.',
		ko: '지어내는 게 아니다. 노래다. 장터에 곡이 셋 있고, 다 운이 맞고, 하나도 곱지 않다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A drunk against the gate',
		gender: 'm',
		en: ['They came to save us.', 'They’re still here.', 'That’s not a country. That’s a stall.'],
		lines: ['구하러 왔지.', '아직 있어.', '그게 나라냐. 가게지.']
	},
	{
		kind: 'p',
		html: 'A stone hits the palace wall and does not mean to. A woman pulls her son back by the collar. Nobody picks the stone up.',
		ko: '돌 하나가 궁담에 맞는다. 뜻은 없었다. 여자가 아들 멱살을 잡아 끌어낸다. 돌을 줍는 사람은 없다.'
	},
	{
		kind: 'p',
		html: 'Further down, a stall has one fish and three buyers. The fish is yesterday. Nobody argues. Arguing costs breath.',
		ko: '더 내려가면 가게에 물고기 하나, 손 셋. 물고기는 어제의 것이다. 다투는 사람 없다. 숨이 아깝다.'
	},
	{
		kind: 'p',
		html: 'A peasant sits in the packed earth with his back to a post. White hemp. Bare feet. He is counting nothing. His mouth moves with the song anyway.',
		ko: '백성이 기둥에 등을 대고 다진 흙에 앉는다. 흰 베. 맨발. 세는 건 없다. 입은 그래도 노래를 따른다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A peasant',
		gender: 'm',
		en: ['Rice went north.', 'The brothers went north.', 'What’s left for a field.'],
		lines: ['쌀은 북으로 갔지.', '아우들도 북으로 갔지.', '밭에 뭐가 남나.']
	},
	{
		kind: 'dialogue',
		speaker: 'His wife',
		gender: 'f',
		en: ['Don’t.', 'The banner can hear you.'],
		lines: ['그만.', '깃발이 듣는다.']
	},
	{
		kind: 'p',
		html: 'The red banner over the lane is faded at the fold. It has been there long enough to learn the wind. It does not leave.',
		ko: '골목 위 붉은 깃발, 접힌 데가 바랬다. 바람을 배울 만큼 오래 있다. 안 떠난다.'
	},
	{
		kind: 'p',
		html: 'Nobody shouts Momal anymore. They have a worse name for the sky.',
		ko: '이제 모말 고함은 없다. 하늘에 대는 이름이 더 나쁘다.'
	},
	{
		kind: 'scene',
		label: 'The Boot',
		ko: '발',
		jump: { year: 400, en: 'Eighteen Winters Earlier…', ko: '십팔 년 전…' }
	},
	{
		kind: 'p',
		html: 'Silla asked. That is the part the songs skip. The horsemen came down like weather, and then they did not leave.',
		ko: '신라가 청했다. 노래가 빼는 대목이다. 기병들이 날씨처럼 내려왔고, 그다음엔 안 떠났다.'
	},
	{
		kind: 'p',
		html: 'The Silla king comes down from his own wall. He has already written the word. Now he has to wear it.',
		ko: '신라 임금이 제 성벽에서 내려온다. 글자는 이미 썼다. 이제 그걸 입어야 한다.'
	},
	{
		kind: 'p',
		html: 'He kneels in the packed earth of his own yard. The Great King does not get off the horse at first. Then he does. He puts his boot on the head.',
		ko: '제 마당 다진 흙에 무릎을 꿇는다. 태왕은 처음에 말에서 안 내린다. 그다음에 내린다. 그 머리에 발을 올린다.'
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['Great King.'],
		lines: ['태왕이시여.']
	},
	{
		kind: 'card',
		person: 'gwanggaeto',
		caption: 'The Great King. Does not get off a horse unless he means the boot.',
		ko: '태왕. 발을 올리려는 게 아니면 말에서 안 내린다.',
		still: '/intro/gwanggaeto--park-jesang.jpg'
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['You wrote it.'],
		lines: ['네가 썼지.']
	},
	{
		kind: 'dialogue',
		speaker: 'The Silla King',
		gender: 'm',
		en: ['…I wrote it.'],
		lines: ['……내가 썼소.']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['Then stay there.', 'Fifty thousand. You’ll remember the number.', 'You’ll remember this more.'],
		lines: ['그럼 그대로 있어.', '오만. 숫자는 기억할 거다.', '이건 더 기억할 거다.']
	},
	{
		kind: 'p',
		html: 'The yard is very quiet. A thin country learns, in the dirt, what asking costs.',
		ko: '마당이 아주 조용하다. 얇은 나라가, 흙 위에서, 청하는 값을 배운다.'
	},
	{ kind: 'scene', label: 'The Brothers', ko: '세 아우' },
	{
		kind: 'p',
		html: 'The king is still in the dirt. Three boys were made to watch. That was the lesson.',
		ko: '임금은 아직 흙에 있다. 아이 셋을 보게 했다. 그게 가르침이었다.'
	},
	{
		kind: 'p',
		html: 'The oldest has his fists in his sleeves. The middle one looks at the boot. The small one looks at his brothers.',
		ko: '맏이는 주먹을 소매에 넣고 있다. 가운데는 그 발을 본다. 막내는 형들을 본다.'
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['Three of them.'],
		lines: ['셋이군.']
	},
	{
		kind: 'p',
		html: 'He points with the same boot. Not at the oldest.',
		ko: '그 발로 가리킨다. 맏이는 아니다.'
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['Middle. North.'],
		lines: ['가운데. 북.']
	},
	{
		kind: 'dialogue',
		speaker: 'A Wa captain',
		gender: 'm',
		en: ['Great King—', 'We came to—'],
		lines: ['태왕이시여—', '저희는—']
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['You lost.', 'Take the small one.', 'Prize.'],
		lines: ['졌잖아.', '작은 놈 가져.', '전리품.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Wait.', 'Wait— that’s— that’s my—'],
		lines: ['잠깐.', '잠깐— 그건— 내—']
	},
	{
		kind: 'p',
		html: 'Nobody waits. Hands already on the middle boy’s arms. The small one is lifted. His feet leave the packed earth.',
		ko: '기다리는 사람 없다. 손은 이미 가운데 아이 팔에 있다. 막내는 들려 올라간다. 발이 흙을 떠난다.'
	},
	{
		kind: 'dialogue',
		person: 'bokho',
		en: ['Hyung.', 'Don’t— I can walk. I can—'],
		lines: ['형.', '하지 마— 걸어. 내가—']
	},
	{
		kind: 'dialogue',
		person: 'miseheun',
		en: ['Me too—', 'I’m staying—', 'Hyung—'],
		lines: ['나도—', '나 여기—', '형아—']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Bohae.', 'Mihae.', 'Look at me. Look—'],
		lines: ['보해야.', '미해야.', '나 봐. 봐—']
	},
	{
		kind: 'p',
		html: 'He gets one sleeve. Then he gets none. The oldest is left in the yard with a boot-print and two empty places.',
		ko: '소매 하나를 잡는다. 그다음엔 없다. 맏이만 마당에 남는다. 발자국, 빈 자리 둘.'
	},
	{
		kind: 'dialogue',
		person: 'gwanggaeto',
		en: ['You stay.', 'Someone has to remember the boot.'],
		lines: ['넌 남아.', '그 발은 누가 기억해야지.']
	},
	{
		kind: 'p',
		html: 'Surabol learns a new shout. It is not funny.',
		ko: '서라벌이 새 고함을 배운다. 웃기지 않다.'
	},
	{
		kind: 'scene',
		label: 'The Empty Hall',
		ko: '빈 대청',
		jump: { year: 418, en: 'Eighteen Winters Later…', ko: '십팔 년 뒤…' }
	},
	{
		kind: 'p',
		html: 'Nulji hears it from the window he is not supposed to open. He opens it anyway. He has been king long enough to know the songs get to the chair first.',
		ko: '눌지는 열면 안 되는 창으로 그 노래를 듣는다. 그래도 연다. 의자에 앉은 지 오래돼서 안다. 노래가 의자보다 먼저 온다는 것을.'
	},
	{
		kind: 'p',
		html: 'He has a list. He does not write it. Writing it would make it a country, and he is not sure he still has one.',
		ko: '목록이 있다. 안 적는다. 적으면 나라가 된다. 아직 있는지도 모른다.'
	},
	{
		kind: 'p',
		html: 'Bohae in the north. Mihae over the water. A hall that fills only when he asks who talks. A people who sing him empty. Goguryeo banners that learned the lanes. No army he can send without asking the man who put a boot on his father’s head.',
		ko: '보해는 북. 미해는 물 너머. 대청은 누가 말하냐고 물을 때만 찬다. 백성은 그를 비었다고 노래한다. 골목을 배운 고구려 깃발. 아비 머리에 발을 올린 자에게 안 묻고는 보낼 군대가 없다.'
	},
	{ kind: 'scene', label: 'The Tent', ko: '장막' },
	{
		kind: 'p',
		html: 'The Harmony Council meets in a tent because the good hall leaks, and the timber that would fix it went north as rent.',
		ko: '화백은 장막에서 모인다. 좋은 대청은 샌다. 고칠 나무는 세로 북에 갔다.'
	},
	{
		kind: 'p',
		html: 'Half the canvas is ripped. Wind comes through like a councillor who was not invited. Someone has tied the tear with a sash that used to be white.',
		ko: '천의 반이 찢겼다. 바람은 안 부른 의원처럼 들어온다. 찢긴 데를 옛날엔 희던 띠로 묶었다.'
	},
	{
		kind: 'dialogue',
		speaker: 'A councillor',
		gender: 'm',
		en: ['We should write again.', 'Ask them to send the brothers home.', 'Politely.'],
		lines: ['다시 글을 써야지요.', '아우들을 돌려 달라.', '공손히.']
	},
	{
		kind: 'dialogue',
		speaker: 'A second councillor',
		gender: 'm',
		en: ['We wrote.', 'They kept the paper.', 'They kept the boys.'],
		lines: ['썼소.', '종이는 가져갔소.', '아이도 가져갔소.']
	},
	{
		kind: 'dialogue',
		speaker: 'A third',
		gender: 'm',
		en: ['Then we wait.', 'Waiting is also a policy.'],
		lines: ['그럼 기다립시다.', '기다리는 것도 정사지요.']
	},
	{
		kind: 'p',
		html: 'Nulji sits on a low stool that is not a throne. The crown is on. It does not help. He looks at the rip. He looks at the men. He does not look like a king who has an answer.',
		ko: '눌지는 왕좌가 아닌 낮은 걸상에 앉는다. 관은 썼다. 소용없다. 찢긴 데를 본다. 사람들을 본다. 답이 있는 임금처럼 안 보인다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Who talks best.', 'Not here.', 'In a hall that can still say no to us.'],
		lines: ['누가 제일 잘 말해.', '여기 말고.', '아직 우리에게 아니 할 수 있는 대청에서.']
	},
	{
		kind: 'p',
		html: 'Nobody answers in the tent. They are used to not answering. He stands anyway. The sash on the rip comes loose and nobody ties it back.',
		ko: '장막에서는 답이 없다. 안 하는 데 익숙하다. 그래도 일어선다. 찢긴 데 띠가 풀린다. 다시 묶는 사람 없다.'
	},
	{ kind: 'scene', label: 'The Ask', ko: '청' },
	{
		kind: 'p',
		html: 'The hall is full. For once. He does not ask for an army. He asks for a mouth.',
		ko: '대청이 가득하다. 이번엔. 군대를 안 청한다. 입을 청한다.'
	},
	{
		kind: 'p',
		html: 'There was only one man the king could send. They had decided that as boys. The tent has not caught up.',
		ko: '임금이 보낼 수 있는 사람은 하나였다. 그 결정은 소년일 때 이미 나 있었다. 장막은 아직 모른다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Who talks best.'],
		lines: ['누가 제일 잘 말해.']
	},
	{
		kind: 'dialogue',
		speaker: 'A councillor',
		gender: 'm',
		en: ['At what, Majesty.'],
		lines: ['무엇을 말씀이십니까.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['At making a foreign hall say yes.'],
		lines: ['남의 대청이 예 하게 하는 거.']
	},
	{
		kind: 'dialogue',
		speaker: 'An officer',
		gender: 'm',
		en: ['Park Jesang.', 'The south-shore one.'],
		lines: ['박제상입니다.', '남쪽 나루 그이.']
	},
	{
		kind: 'dialogue',
		speaker: 'A second officer',
		gender: 'm',
		en: ['The tricks man.'],
		lines: ['장난하던 그이.']
	},
	{
		kind: 'dialogue',
		speaker: 'An officer',
		gender: 'm',
		en: ['He used to. As a boy.', 'Boats. Gates. Other people’s shoes.', 'He’s a lord now. High seat. He quit.'],
		lines: ['어릴 때요. 그랬습니다.', '배. 문. 남의 신.', '지금은 높은 자리입니다. 그만뒀습니다.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Send for him.'],
		lines: ['불러.']
	},
	{
		kind: 'p',
		html: 'They send. The streets still want a funeral. The hall wants a talker.',
		ko: '보낸다. 거리는 아직 장례를 원한다. 대청은 말하는 사람을 원한다.'
	},
	{ kind: 'scene', label: 'The Thin Hour', ko: '얇은 시각' },
	{
		kind: 'map',
		year: 418,
		places: ['surabol', 'gungnae', 'pyongyang', 'tsushima', 'asuka'],
		caption: 'One man north for the older brother. The younger one is still on an island.',
		ko: '형 데리러 북으로 가는 사람 하나. 아우는 아직 섬에 있다.',
		routes: ['jesang418-north', 'jesang418-home']
	},
	{
		kind: 'card',
		person: 'nulji',
		caption: 'The boy on the boat is kan now. He still has only one man.',
		ko: '배 위의 소년이 이제 간이다. 사람은 아직도 하나다.',
		still: '/intro/nulji--park-jesang.jpg'
	},
	{
		kind: 'p',
		html: 'They announce him. The hall uses the formal name.',
		ko: '이름을 부른다. 대청은 예스러운 쪽을 쓴다.'
	},
	{
		kind: 'p',
		html: 'The song followed him into the hall. He lets it. He has been walking since the lamps went.',
		ko: '노래가 대청까지 따라왔다. 그냥 둔다. 등불 꺼진 뒤부터 걸어왔다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Sit.', 'I need to know who I’m sending.'],
		lines: ['앉아.', '누구 보내는지 알아야겠어.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['You know.'],
		lines: ['알잖아.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['The hall says Park Jesang.', 'I want the rest.'],
		lines: ['대청은 박제상이라 해.', '나머지를 원해.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['The rest was Momal.'],
		lines: ['나머지는 모말이었어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['I remember Momal.', 'Whole roofs used to shout it at the sky.'],
		lines: ['모말 기억해.', '지붕들이 하늘을 보고 그 이름을 외쳤지.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I stopped giving them reasons.', 'I took a name they could write.', 'Jesang.', 'Same mouth. Different ink.'],
		lines: ['이유 주는 건 그만뒀어.', '적을 수 있는 이름을 받았지.', '제상.', '입은 같아. 먹만 달라.']
	},
	{
		kind: 'p',
		html: 'Momal is a Korean name. The hall needed characters. Jesang is what they put down.',
		ko: '모말은 우리 이름이다. 대청은 글자가 필요했다. 제상이 그 글자다.'
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Why’d you stop.'],
		lines: ['왜 그만뒀어.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I have a wife now.', 'Girls.', 'A roof that isn’t a joke.'],
		lines: ['이제 아내가 있어.', '딸들.', '농담이 아닌 지붕.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['And this country.'],
		lines: ['이 나라는.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: [
			'It breaks my heart.',
			'You heard the songs. People walking like the harvest already left.',
			'Watching—'
		],
		lines: ['가슴이 아파.', '노래 들었잖아. 추수가 이미 떠난 것처럼 걸어.', '그걸 보면—']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['I hear it from the window.'],
		lines: ['창으로 들려.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I want a country my girls can stay in.', 'That’s the list.'],
		lines: ['딸들이 남을 수 있는 나라를 원해.', '목록은 그거야.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['That’s why I sent for you.', 'I want mine back.'],
		lines: ['그래서 부른 거야.', '내 것도 찾고 싶어.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['The hall says Jesang.', 'The boats were Momal.', 'You remember the oar.'],
		lines: ['대청은 제상이라 하지.', '배는 모말이었어.', '노는 기억하지.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['…Momal.', 'I was going to say that.', 'I was.'],
		lines: ['……모말아.', '그거 말하려고 했어.', '하려고 했어.']
	},
	{
		kind: 'p',
		html: 'Only the house and this chair still use the old one. He took Jesang when the seat got high. The tricks stayed Momal.',
		ko: '옛 이름을 쓰는 건 집이랑 이 의자뿐이다. 자리 높아지며 제상을 받았다. 장난은 모말로 남았다.'
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I’m a lord now.', 'I quit the boats.'],
		lines: ['난 이제 벼슬이야.', '배는 그만뒀어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['I didn’t send for the lord.', 'I sent for the boy who stole them.'],
		lines: ['벼슬 부른 거 아니야.', '배 훔치던 애를 부른 거야.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['That boy got people in trouble.'],
		lines: ['그 애, 사람 곤란하게 했어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['They took my brothers.', 'Not asked. Took.', 'Robbing a thief is no thievery.'],
		lines: ['내 아우들을 가져갔어.', '청한 게 아니야. 가져간 거야.', '도둑을 터는 건 도둑질이 아니야.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['That’s a proverb.'],
		lines: ['그건 속담이야.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: [
			'That’s the job.',
			'This country is finished. You heard the songs.',
			'They need to see three of us.',
			'Then they start believing we can start.'
		],
		lines: [
			'그게 일이야.',
			'이 나라 끝났어. 노래 들었잖아.',
			'우리 셋을 봐야 해.',
			'그래야 다시 시작할 수 있다고 믿어.'
		]
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['If I go I might not come back.'],
		lines: ['가면 안 돌아올 수도 있어.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Then your name will.', 'I’ll see to it.'],
		lines: ['그럼 이름은 남아.', '내가 할게.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['I’ll go.'],
		lines: ['갈게.']
	},
	{
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
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Don’t bring me a reason.', 'Just the people.'],
		lines: ['이유는 가져오지 마.', '사람만.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['The north first.', 'The island after.'],
		lines: ['북쪽 먼저.', '그다음 섬.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['Don’t stop at your house between.', 'If you stop I might— I might keep you.'],
		lines: ['그 사이 집에 서지 마.', '서면 내가— 내가 붙잡을지도 몰라.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['If you don’t go, I will.'],
		lines: ['네가 안 가면, 내가 가.']
	},
	{
		kind: 'dialogue',
		person: 'jesang',
		en: ['You can’t.', 'If the chair is empty, the island knows.'],
		lines: ['안 돼.', '의자 비면 섬이 알아.']
	},
	{
		kind: 'dialogue',
		person: 'nulji',
		en: ['…Right.', 'Then it’s you.'],
		lines: ['……그래.', '그럼 너야.']
	}
];

let found = false;
for (const ch of story) {
	for (const e of ch.entries || []) {
		if (e.title !== 'Momal') continue;
		const n = e.blocks.length;
		e.blocks = opening.concat(e.blocks.slice(86));
		console.log(`Momal blocks ${n} → ${e.blocks.length} (opening ${opening.length} + tail ${n - 86})`);
		found = true;
	}
}
if (!found) throw new Error('Momal entry not found');
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('wrote story.json');
