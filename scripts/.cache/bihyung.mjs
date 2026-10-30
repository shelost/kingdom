// Yongsu's death after Huangdi, and the flashback episode "Bihyung" (the madman who wasn't).
// Usage: node scripts/.cache/bihyung.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const chapter = story.find((c) => (c.entries ?? []).some((e) => e.title === 'Huangdi (皇帝)'));
const at = chapter.entries.findIndex((e) => e.title === 'Huangdi (皇帝)');
const huangdi = chapter.entries[at];

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const card = (html, ko) => p(`<b>${html}</b>`, `<b>${ko}</b>`);

/* ——— Huangdi: home, and the father ——— */
const OLD_CARD = huangdi.blocks.at(-1);
if (!huangdi.blocks.some((b) => b.kind === 'scene' && b.label === 'The House by the Stream')) {
	huangdi.blocks.splice(
		huangdi.blocks.length - 1,
		1,
		scene('The House by the Stream', '개울가 집'),
		p(
			'Munhee meets him at the gate. She does not ask about the emperor. She asks if he has eaten, and then she tells him.',
			'문희가 대문에서 그를 맞는다. 황제 이야기는 묻지 않는다. 밥은 먹었느냐고 묻고, 그다음에 말해 준다.'
		),
		p(
			'His father has been dying since the second frost. The servants say he still goes down to the stream at night and talks to it, which is not news. The news is that this week he stopped.',
			'시아버지는 두 번째 서리가 내린 뒤로 죽어 가는 중이다. 하인들 말로는 아직도 밤이면 개울에 내려가 말을 건다고 한다. 그건 새 소식이 아니다. 새 소식은, 이번 주에 그걸 그만뒀다는 것이다.'
		),
		say('chunchu', ['…Is he awake?'], ['…깨어 계시오?']),
		say('munhee', ['He’s been asking for you. / And for somebody called Gildal.'].flatMap((l) => l.split(' / ')), ['당신을 찾으세요.', '그리고 길달이라는 사람도.']),
		say('chunchu', ['There is no Gildal.'], ['길달 같은 건 없소.']),
		say('munhee', ['I know. Go in.'], ['알아요. 들어가 봐요.']),
		card(
			'The whole city has called his father mad for fifty years. To find out why, we have to go back…!',
			'온 도성이 오십 년 동안 그의 아버지를 미쳤다고 했다. 그 까닭을 알려면 거슬러 올라가야 한다…!'
		)
	);
}

/* ——— Bihyung ——— */
const flash = (year, title, blocks) => ({ kind: 'flashback', year, title, blocks });

const BIHYUNG = {
	year: '648',
	tone: 'ghost story',
	subtitle: '비형',
	logline: {
		en: 'Every capital keeps one madman. Surabol’s was a prince, and he was very good at it.',
		ko: '도성마다 미치광이가 하나씩 있다. 서라벌의 미치광이는 왕손이었고, 그 일을 아주 잘했다.'
	},
	badges: ['flag:silla'],
	music: 'An Ending',
	title: 'Bihyung',
	place: 'surabol',
	images: [],
	blocks: [
		p('Every capital keeps one madman. It is good for the others.', '도성은 미치광이를 하나씩 둔다. 나머지 사람들 건강에 좋다.'),
		{ kind: 'story', label: 'The Ghost Bridge', ko: '귀교' },
		scene('The House by the Stream · that winter', '개울가 집 · 그해 겨울'),
		p(
			'Kim Yongsu is seventy-three, and he is dying the way he did everything: at night, by the water, talking to someone nobody else can see.',
			'김용수는 일흔셋이고, 평생 모든 일을 하던 방식대로 죽어 가는 중이다. 밤에, 물가에서, 아무도 못 보는 누군가에게 말을 걸면서.'
		),
		p(
			'His son kneels by the bed. Chunchu has talked his way out of a Goguryeo prison and into an emperor’s library. He has never once managed to finish a conversation with his father.',
			'아들이 침상 곁에 무릎을 꿇는다. 춘추는 말 한마디로 고구려 감옥을 빠져나왔고, 황제의 서고에도 들어갔다. 그런데 제 아버지와는 대화를 한 번도 끝까지 해 본 적이 없다.'
		),
		say('yongsu', ['You’re late.', '…Gildal said you’d be late. He’s never wrong about boats.'], ['늦었구나.', '…길달이가 늦을 거랬다. 배 일은 걔가 틀린 적이 없어.']),
		say('chunchu', ['Father. There is no Gildal.', 'There has never been a Gildal. I’m forty-five. I’m allowed to say it.'], ['아버지. 길달은 없습니다.', '길달은 한 번도 없었습니다. 제 나이 마흔다섯이니 이 말쯤은 해도 되겠지요.']),
		say('yongsu', ['Mm.', 'Sit down. I’ll tell you about him.'], ['음.', '앉아라. 걔 얘기 해 주마.']),
		p('The old man tells it badly. Somebody should tell it properly.', '노인은 이야기를 서툴게 한다. 누군가는 제대로 해 줘야 한다.'),

		flash('595', 'The Madman of Surabol', [
			scene('The house below the palace', '궁 아래 집'),
			p(
				'When Yongsu was four, the Harmony Council voted his father off the throne. Three counts, six sleeves, and a king became a man with a very large house and no reason to leave it.',
				'용수가 네 살 때, 화백회의가 그의 아버지를 왕좌에서 표결로 끌어내렸다. 세 번의 셈, 소매 여섯. 그렇게 임금은 아주 큰 집에 살면서 나갈 이유가 하나도 없는 사람이 되었다.'
			),
			p(
				'The house dropped a bone in one afternoon, from Sacred to True. The boy learned the word before he learned his letters.',
				'그 집은 하루 오후 만에 뼈 하나가 내려앉았다. 성골에서 진골로. 아이는 글자보다 그 말을 먼저 배웠다.'
			),
			{
				kind: 'diagram',
				diagram: 'silla-royal',
				step: 'bihyung',
				title: 'The royal house · 신라 왕실',
				caption: 'Jinhung’s grandsons part here. Jinpyung’s line keeps the Sacred Bone. The deposed Jinji’s son drops to True Bone, and so does everyone after him.',
				ko: '진흥왕의 손자들이 여기서 갈린다. 진평왕의 줄은 성골을 지키고, 폐위된 진지왕의 아들은 진골로 내려앉는다. 그 뒤로 이어지는 사람들도 모두.'
			},
			p(
				'Sixteen winters later his cousin King Jinpyung has two daughters and no son, and the court is doing arithmetic. A deposed king’s son is a very interesting number. Men start visiting Yongsu with gifts. Men who visit with gifts are counting.',
				'열여섯 해 뒤, 사촌 형 진평왕에게는 딸만 둘 있고 아들이 없다. 조정은 셈을 시작한다. 폐위된 임금의 아들은 아주 흥미로운 숫자다. 사내들이 선물을 들고 용수를 찾아오기 시작한다. 선물을 들고 오는 사내들은 세고 있는 것이다.'
			),
			say(null, ['Young lord. The Council asks after your health.', 'They wonder whether a man of your blood is… content.'], ['도련님. 회의에서 안부를 여쭙니다.', '도련님 같은 핏줄이 과연… 만족하고 계신지 궁금해들 하시지요.']),
			say('yongsu', ['Content?', 'Shh. Not now. The stream is talking.'], ['만족?', '쉿. 지금 말고. 개울이 말하는 중이야.']),
			p(
				'That night he walks down to the stream in his sleeping robe and talks to it until dawn. The night watch hears him laughing. By the market hour, so has everybody else.',
				'그날 밤 그는 잠옷 바람으로 개울에 내려가 새벽까지 말을 건다. 순라꾼들이 그가 웃는 소리를 듣는다. 장이 설 무렵엔 온 도성이 다 들었다.'
			),
			p(
				'By the end of the month the court has a name for him. There is an old story about a dead king’s ghost who fathered a son on a peach-blossom girl, and the son ran with goblins at night. They call Yongsu after him. Bihyung.',
				'달이 다 가기 전에 조정은 그에게 이름을 붙인다. 죽은 임금의 혼이 복숭아꽃 같은 여인에게서 아들을 얻었고, 그 아들이 밤마다 도깨비들과 어울렸다는 옛이야기가 있다. 사람들은 용수를 그 아들 이름으로 부른다. 비형.'
			),
			{
				kind: 'quote',
				hanja: '聖帝魂生子 鼻荊郞室亭 飛馳諸鬼衆 此處莫留停',
				html: 'A holy king’s soul begot a son: here is the house of Bihyung-rang. All you flying, racing ghosts, do not linger here.',
				ko: '성스러운 임금의 혼이 낳은 아들, 비형랑의 집이로다. 날고 뛰는 귀신 무리야, 이곳에 머물지 말라.',
				source: 'Samguk Yusa (三國遺事), Dohwanyeo and Bihyungrang'
			},
			p(
				'Housewives paste the charm over their doors to keep the goblins out. The men with gifts stop coming. Nobody counts a madman.',
				'아낙들은 도깨비를 막으려고 그 주문을 문 위에 붙인다. 선물 든 사내들은 발길을 끊는다. 미치광이는 아무도 세지 않는다.'
			)
		]),

		flash('602', 'The Ghost Bridge', [
			scene('The Mun stream · night', '문천 · 밤'),
			p(
				'King Jinpyung, who is bored and cleverer than his court, decides to see for himself.',
				'따분하고, 조정보다 영리한 진평왕이 직접 확인해 보기로 한다.'
			),
			say('jinpyung', ['They say you run with goblins, cousin.', 'Good. I need a bridge over the Mun stream, and my engineers want a year.', 'Your friends get one night.'], ['자네가 도깨비들하고 어울린다지, 아우.', '잘됐네. 문천에 다리가 하나 필요한데 장인들은 일 년을 달라는군.', '자네 친구들한테는 하룻밤 주지.']),
			say('yongsu', ['One night.', '…They’ll want rice cakes.'], ['하룻밤.', '…걔들 떡 달라고 할 텐데요.']),
			p(
				'In the morning there is a bridge. Flat stones, a little crooked, wet with dew, exactly where the king pointed. The court calls it the Ghost Bridge and walks the long way round.',
				'아침이 되자 다리가 하나 놓여 있다. 납작한 돌, 조금 삐뚤고, 이슬에 젖은 채로, 임금이 가리킨 바로 그 자리에. 조정은 그걸 귀교라 부르고 먼 길로 돌아간다.'
			),
			p(
				'Nobody asks why forty stonemasons in the eastern ward are drinking very well that week. Nobody asks where a True Bone with no office found the silver. One person notices.',
				'그 주에 동쪽 마을 석수 마흔 명이 왜 그렇게 술을 잘 마시는지 아무도 묻지 않는다. 벼슬도 없는 진골이 그 은을 어디서 구했는지도 아무도 묻지 않는다. 딱 한 사람이 알아챈다.'
			),
			scene('The Ghost Bridge · the next night', '귀교 · 이튿날 밤'),
			p(
				'Princess Chunmyung is twenty-two, the king’s elder daughter, and she has walked out alone to see the goblin bridge. She finds the goblin man sitting on it, doing sums on a wax tablet.',
				'천명공주는 스물둘, 임금의 맏딸이다. 도깨비 다리를 보러 혼자 나왔다가, 그 위에 앉아 밀랍판에 셈을 하고 있는 도깨비 사내를 본다.'
			),
			say('chunmyung', ['Forty men. Two nights’ wages, and the stone.', 'That’s very cheap, for goblins.'], ['마흔 명. 이틀 품삯에 돌값.', '도깨비치고는 꽤 싸게 먹혔네.']),
			say('yongsu', ['…The goblins drove a hard bargain.', 'You can’t tell anyone.'], ['…도깨비들이 값을 세게 불렀습니다.', '아무한테도 말씀하시면 안 됩니다.']),
			say('chunmyung', ['Why not?', 'Oh.', 'Because a sane man of your blood is a candidate. And a candidate is a corpse.'], ['왜?', '아.', '정신 멀쩡한 그 핏줄은 후보가 되니까. 후보는 송장이 되고.']),
			say('yongsu', ['Princess. Please go home.', 'The stream is very talkative tonight.'], ['공주님. 제발 돌아가십시오.', '오늘 밤엔 개울이 말이 많습니다.']),
			p(
				'She doesn’t go home. When she was small and cried at supper, her father used to threaten to marry her off to the madman by the stream. Every royal child in Surabol heard that threat. She is the only one who took it as a promise.',
				'그녀는 돌아가지 않는다. 어릴 적 저녁상에서 울면, 아버지는 개울가 미치광이한테 시집보내 버리겠다고 으르곤 했다. 서라벌의 왕실 아이라면 다 들어 본 으름장이다. 그걸 약속으로 들은 건 그녀 하나뿐이었다.'
			),
			scene('The palace · breakfast', '궁 · 아침상'),
			p('At breakfast she tells her father she has chosen a husband.', '아침상에서 그녀는 아버지에게 남편감을 골랐다고 말한다.'),
			say('jinpyung', ['…The goblin man.', 'Chunmyung. That was a joke. You were six.'], ['…그 도깨비 사내를.', '천명아. 그건 농담이었다. 네가 여섯 살이었고.']),
			say('chunmyung', ['You’re a king, Father. You should be careful what you promise.'], ['아버지는 임금이시잖아요. 약속은 조심해서 하셔야죠.']),
			say('sunduk', ['Unni— the one who talks to the stream?!', 'Is the stream coming to the wedding?'], ['언니— 개울이랑 얘기하는 그 사람?!', '그럼 개울도 혼례에 와?']),
			say('chunmyung', ['Eat your porridge, Dukman.'], ['죽 먹어, 덕만아.']),
			p(
				'The court is scandalised for a season. A Sacred Bone princess marrying down a bone, to a man who argues with water. Then it decides this is good news. A madman married into the king’s house is a madman nobody has to watch.',
				'조정은 한 철 내내 발칵 뒤집힌다. 성골 공주가 뼈 하나를 내려가 시집을 간다. 그것도 물하고 말다툼하는 사내한테. 그러다 조정은 이게 좋은 소식이라고 결론 내린다. 왕실에 장가든 미치광이는 아무도 지켜볼 필요가 없는 미치광이니까.'
			),
			p(
				'The next spring she gives him a son. They call him Chunchu, spring and autumn, which is a very sane name. His father chose it.',
				'이듬해 봄, 그녀는 아들을 낳는다. 이름은 춘추, 봄과 가을. 아주 멀쩡한 이름이다. 아버지가 지었다.'
			)
		]),

		flash('612', 'Stay Out of That Room', [
			scene('The palace stream · night', '궁 개울 · 밤'),
			p(
				'Chunchu is nine and mortified. The boys in the yard call him the goblin’s whelp, and he has started to believe them.',
				'춘추는 아홉 살이고, 창피해 죽을 지경이다. 마당 아이들은 그를 도깨비 새끼라고 부르고, 그도 슬슬 그 말을 믿기 시작했다.'
			),
			p(
				'Tonight his father is kneeling in the stream with his sleeves tied back, laying flat stones in a line and muttering to each one before he sets it down.',
				'오늘 밤 아버지는 소매를 걷어 묶고 개울에 무릎을 꿇은 채, 납작한 돌을 한 줄로 놓고 있다. 돌 하나 놓을 때마다 뭐라고 중얼거리면서.'
			),
			say('chunchu', ['Father. Everyone can see you.', 'The watchmen are laughing.'], ['아버지. 다 보여요.', '순라꾼들이 웃어요.']),
			say('yongsu', ['Good. Let them laugh. Laughing men aren’t counting.', 'Come here. Hold this one.'], ['잘됐다. 웃게 둬라. 웃는 사람은 셈을 안 해.', '이리 와. 이거 하나 들어 봐.']),
			say('chunchu', ['Who are you talking to?'], ['누구랑 얘기하는 거예요?']),
			say('yongsu', ['The stones.', '…You, mostly. You just don’t know it yet.', 'There’s a room in the palace with six chairs in it. That room eats the men who amuse it. Stay out of that room.'], ['돌들이랑.', '…대개는 너랑. 넌 아직 모를 뿐이지.', '궁에 의자 여섯 개 놓인 방이 있다. 그 방은 저를 즐겁게 해 주는 사내들을 잡아먹어. 그 방엔 들어가지 마라.']),
			p(
				'Chunchu decides his father is the strangest man in Silla. He will go on thinking so for thirty-six years. He will be wrong for all thirty-six.',
				'춘추는 아버지가 신라에서 제일 이상한 사람이라고 결론 내린다. 그 생각은 서른여섯 해 동안 이어진다. 서른여섯 해 내내 틀린 생각이다.'
			)
		]),

		flash('632', 'The Rumour', [
			scene('The palace · the year of the crown', '궁 · 즉위하던 해'),
			p(
				'The little girl who asked whether the stream was invited to the wedding grows up and becomes the first queen of Silla. One of her first acts is a small one. She brings her sister’s husband back into the palace, gives him rooms on the east side, and a title nobody can object to because it doesn’t mean anything.',
				'개울도 혼례에 오느냐고 묻던 그 꼬마는 자라서 신라 최초의 여왕이 된다. 즉위하고 처음 한 일 가운데 하나는 작은 일이다. 언니의 남편을 궁으로 다시 불러들여 동쪽에 거처를 내주고, 아무도 반대할 수 없는 벼슬 하나를 준다. 아무 뜻도 없는 벼슬이라 반대할 수가 없다.'
			),
			say('sunduk', ['Brother-in-law.', 'Is it true you can talk to spirits?'], ['형부.', '귀신이랑 얘기하신다는 거, 사실인가요?']),
			say('yongsu', ['Every night, Majesty.', 'They never answer. It’s very restful.'], ['매일 밤입니다, 전하.', '대답은 한 번도 없습니다. 아주 편안하지요.']),
			say('sunduk', ['…Keep it up, then.', 'I like having one man in this palace nobody bothers to count.'], ['…그럼 계속하세요.', '이 궁에 아무도 세지 않는 사람 하나쯤 있는 게 좋아요.']),
			p(
				'The rumour outlives the need for it, the way rumours do. Servants still cross the courtyard rather than pass his door after dark. Somebody still pastes the old charm on the eastern gate every New Year.',
				'소문은 쓸모가 다한 뒤에도 살아남는다. 소문은 원래 그렇다. 하인들은 해가 지면 그의 방문 앞을 지나는 대신 마당을 가로질러 돌아간다. 해마다 정월이면 누군가 동문에 그 옛 주문을 붙인다.'
			)
		]),

		scene('The House by the Stream · before light', '개울가 집 · 동트기 전'),
		p(
			'The old man finishes the story. It has taken most of the night. Chunchu has said nothing for an hour, which is a record.',
			'노인이 이야기를 마친다. 밤이 거의 다 갔다. 춘추는 한 시진 동안 한마디도 하지 않았다. 신기록이다.'
		),
		say('chunchu', ['The bridge. You paid for it.', 'The stream. The laughing. Forty years of it.', '…You were never mad.'], ['그 다리. 아버지가 돈을 내셨군요.', '개울도. 웃음도. 사십 년을.', '…한 번도 미치신 적이 없었군요.']),
		say('yongsu', ['Mad men don’t get voted on.', 'Their wives don’t get poisoned. Their boys grow up.', '…You grew up. Very loud. Very clever. You nearly frightened me to death twice.'], ['미친 사람은 표결에 안 올라.', '그 아내는 독을 안 먹고, 그 아들은 자라지.', '…넌 자랐다. 아주 시끄럽게. 아주 영리하게. 덕분에 두 번이나 놀라 죽을 뻔했다.']),
		say('chunchu', ['You could have told me.', '…I spent my whole childhood ashamed of you.'], ['말씀해 주실 수도 있었잖아요.', '…어린 시절 내내 아버지를 부끄러워했습니다.']),
		say('yongsu', ['I know.', 'That was the hardest part of the act. You were very good in it.'], ['안다.', '그게 이 연극에서 제일 어려운 대목이었지. 넌 그 역을 아주 잘했어.']),
		p(
			'Then the old man looks past his son to the corner of the room, and his face changes. Chunchu turns. There is nobody there. There is somebody there.',
			'그때 노인이 아들 너머 방구석을 보더니 얼굴빛이 바뀐다. 춘추가 돌아본다. 아무도 없다. 누군가 있다.'
		),
		p(
			'A man in a wide black gat stands by the brazier with a ledger under his arm. He reads the name three times. Yongsu. Yongsu. Yongsu.',
			'챙 넓은 검은 갓을 쓴 사내가 장부를 옆구리에 끼고 화로 곁에 서 있다. 그는 이름을 세 번 읽는다. 용수. 용수. 용수.'
		),
		say('yongsu', ['Oh.', 'Seventy years I’ve been talking to you people.', 'One of you finally answers.'], ['아.', '칠십 년을 너희한테 말을 걸었는데.', '이제야 하나가 대답을 하는구나.']),
		say('kangrim', ['We were listening, sir. The ledger is not permitted to reply.', 'One question, then we walk.', 'Were you a madman, or a father?'], ['듣고 있었소. 장부는 대답하는 것이 허락되지 않소.', '한 가지만 묻고 걷겠소.', '미치광이였소, 아비였소?']),
		say('yongsu', ['…In this city?', 'Same job.'], ['…이 도성에서?', '같은 일이지.']),
		say('kangrim', ['I’ll write both.', 'Come. The stream is this way.'], ['둘 다 적겠소.', '갑시다. 개울은 이쪽이오.']),
		{
			kind: 'verse',
			color: '#4a4a58',
			person: 'yongsu',
			title: 'Yongsu Who Talked to the Stream',
			titleKo: '개울과 얘기한 용수',
			lines: ['김용수, 개울가 도깨비', '밤마다 혼잣말, 다들 웃었지', '어허 어허, 잘 가거라', '하룻밤에 돌다리 놓고', '품삯은 몰래 제 주머니서 냈지', '어허 어허, 잘 가거라', '미친 척 사십 년, 식구 지키느라', '마지막 밤에야 귀신이 대답했네', '어허 어허, 잘 가거라'],
			en: ['Kim Yongsu, goblin by the stream,', 'talked all night like a man in a dream.', 'Eo-heo, eo-heo, off you go', 'Built a bridge in a single night,', 'paid the masons out of sight.', 'Eo-heo, eo-heo, off you go', 'Forty years mad to keep them all —', 'and a ghost answered his very last call.', 'Eo-heo, eo-heo, off you go'],
			refrain: [2, 5, 8]
		},
		{
			kind: 'card',
			person: 'yongsu',
			tab: 'epitaph',
			caption: 'Kim Yongsu, son of a deposed king. He talked to the dark for forty years so nobody would count his house.',
			ko: '폐위된 임금의 아들 김용수. 집안이 셈에 오르지 않도록 사십 년을 어둠에 말을 걸었다.'
		},
		p(
			'In the morning Chunchu walks down to the stream. The Ghost Bridge is still there, a little crooked. He stands on it for a long time.',
			'아침에 춘추는 개울로 내려간다. 귀교는 아직 거기 있다. 조금 삐뚤게. 그는 그 위에 한참을 서 있다.'
		),
		p('Then he says something to the water. Nobody hears what.', '그러다 물에 대고 뭐라고 말한다. 무슨 말인지는 아무도 듣지 못한다.'),
		OLD_CARD.kind === 'p' && /stone horses/.test(OLD_CARD.html)
			? OLD_CARD
			: card(
					'Back in Chang’an, the emperor is still coughing into his sleeve. Somebody should tell the six stone horses to get ready…!',
					'장안에서 황제는 아직도 소매에 대고 기침을 한다. 누가 돌말 여섯에게 채비하라고 일러 둬야 할 텐데…!'
				)
	]
};

if (!chapter.entries.some((e) => e.title === 'Bihyung')) chapter.entries.splice(at + 1, 0, BIHYUNG);
fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('Huangdi blocks', huangdi.blocks.length, '· Bihyung inserted after', huangdi.title, '· blocks', BIHYUNG.blocks.length);
