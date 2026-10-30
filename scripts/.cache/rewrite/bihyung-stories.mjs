/**
 * Bihyung: three stories (Jinji · Chunmyung · Chunchu), Yongsu born 575 (Jinji's son before the crown),
 * Chunchu's birth, and the Sunduk-era records (the 635 provincial tour, the 645 Hwangnyong pagoda).
 * Anchors are text fragments, so a concurrent edit elsewhere in the entry can't shift them.
 */
import { editStory, textOf } from '../story-ops.mjs';

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, lines, en) => ({ kind: 'dialogue', person, lines, en });
const scene = (label, ko, year, jen, jko) => ({ kind: 'scene', label, ko, jump: { year, en: jen, ko: jko } });
const story = (label, ko) => ({ kind: 'story', label, ko });

editStory((s) => {
	const e = s.flatMap((c) => c.entries).find((x) => x.title === 'Bihyung');
	if (!e) throw new Error('no Bihyung');
	const B = e.blocks;
	const at = (frag, kind) => {
		const hits = B.flatMap((b, i) => ((!kind || b.kind === kind) && textOf(b).includes(frag) ? [i] : []));
		if (hits.length !== 1) throw new Error(`anchor "${frag}" hits ${hits.length}`);
		return hits[0];
	};
	const set = (frag, html, ko) => Object.assign(B[at(frag, 'p')], { html, ko });

	if (B.some((b) => b.kind === 'story' && b.label === 'Jinji')) {
		console.log('already applied');
		return false;
	}

	// —— the old single story header goes; the deathbed frame stays as the cold open ——
	B.splice(at('The Ghost Bridge', 'story'), 1);

	set(
		'Kim Yongsu is seventy-two',
		'Kim Yongsu is seventy-eight. Princess Chunmyung is seventy-three. They have shared a bed for fifty-one years, and now they are dying in it, side by side, on the same night, which is very like them.',
		'김용수는 일흔여덟, 천명공주는 일흔셋이다. 둘은 쉰한 해를 한 이부자리에서 잤고, 이제 그 자리에서 나란히, 같은 밤에 죽어 가는 중이다. 참 그 둘다운 일이다.'
	);

	set(
		'That was the story the way the old man told it',
		'That was the story the way the old man told it: badly, and out of order. Somebody should tell it properly. It takes three people. A father he can’t remember, a wife who caught him doing sums, and a son who was ashamed of him for forty-one years.',
		'그게 노인이 들려준 방식이었다. 서툴고, 뒤죽박죽으로. 누군가는 제대로 들려줘야 한다. 세 사람이 필요하다. 기억도 안 나는 아버지, 그의 셈을 들춰낸 아내, 그리고 마흔한 해 동안 그를 부끄러워한 아들.'
	);

	// —— 1. Jinji ——
	B.splice(at('the Cloud King’s last night', 'scene'), 0, story('Jinji', '진지'));

	set(
		'So the son kneeling by the bed tonight',
		'His eldest son died four years ago. So the son kneeling by the bed tonight is the second one, Saryun, who smells of plum wine. His own boy is asleep at home, one year old. His name is Yongsu. He won’t remember tonight.',
		'맏아들은 네 해 전에 죽었다. 그래서 오늘 밤 침상 곁에 무릎 꿇은 아들은 둘째, 사륜이다. 매실주 냄새가 난다. 그의 아들은 집에서 자고 있다. 한 살배기, 이름은 용수다. 오늘 밤을 기억하지 못할 것이다.'
	);

	set(
		'His nephew, a boy of twelve',
		'His nephew, a boy of twelve, is crowned instead. Jinji is shut in a house with a very high wall, and three months later he dies in it. He leaves a son of four, whom the Council decides not to worry about. Not yet.',
		'대신 열두 살 조카가 왕관을 쓴다. 진지는 담이 아주 높은 집에 갇히고, 석 달 뒤 그 안에서 죽는다. 네 살배기 아들 하나를 남기는데, 회의는 그 아이를 걱정하지 않기로 한다. 아직은.'
	);

	set(
		'His house dropped a bone in one afternoon',
		'His house dropped a bone in one afternoon, from Sacred to True, and his little boy went down with it.',
		'그의 집은 하루 오후 만에 뼈 하나가 내려앉았다. 성골에서 진골로. 그의 어린 아들도 함께 내려앉았다.'
	);

	set(
		'She names him Yongsu',
		'The record says she called him Bihyung. Nobody in Saryang ward ever sees the child again, which, in this family, is not the same as being gone.',
		'기록에 따르면 그녀는 아이를 비형이라 불렀다. 사량부 사람 누구도 그 아이를 다시 보지 못한다. 이 집안에서 그건 사라졌다는 뜻과 같지 않다.'
	);

	Object.assign(B[at('The palace · the west wall at night', 'scene')], {
		jump: { year: 590, en: 'Nine Years Later…', ko: '아홉 해 뒤…' }
	});

	set(
		'King Jinpyung hears the story the way the whole city hears it',
		'King Jinpyung does what clever kings do with a deposed uncle’s son: he takes the boy into the palace, where he can see him. At fifteen Yongsu is made a clerk. He is good at it. He is also never in his bed.',
		'진평왕은 영리한 임금들이 폐위된 숙부의 아들에게 하는 일을 한다. 눈에 보이는 궁 안으로 데려온다. 열다섯에 용수는 집사가 된다. 일을 잘한다. 그런데 잠자리에 있는 적이 없다.'
	);

	set(
		'The things in the reeds have their own name for him',
		'The things in the reeds have their own name for him. They call him Bihyung, the name of the ghost’s child nobody saw again, and they will not say why. Yongsu points out that he was born six years before that child, in an ordinary bed, to an ordinary disgrace. The goblins don’t care. He starts answering to it. Then he starts signing it.',
		'갈대숲의 그것들은 그를 부르는 이름이 따로 있다. 비형. 아무도 다시 보지 못한 그 귀신의 아이 이름이다. 왜 그렇게 부르는지는 말해 주지 않는다. 용수는 자기가 그 아이보다 여섯 해 먼저, 평범한 잠자리에서, 평범한 망신 속에 태어났다고 일러 준다. 도깨비들은 신경도 안 쓴다. 그는 그 이름에 대답하기 시작한다. 그러다 그 이름으로 서명까지 하기 시작한다.'
	);

	set(
		'He is fifteen, and his cousin King Jinpyung',
		'He is fifteen, and his cousin King Jinpyung has one small daughter and no son, and the court is doing arithmetic. A deposed king’s son is a very interesting number. Men start visiting Yongsu with gifts. Men who visit with gifts are counting.',
		'그는 열다섯이다. 사촌 형 진평왕에게는 어린 딸 하나뿐이고 아들이 없다. 조정은 셈을 시작한다. 폐위된 임금의 아들은 아주 흥미로운 숫자다. 사내들이 선물을 들고 용수를 찾아오기 시작한다. 선물을 들고 오는 사내들은 세고 있는 것이다.'
	);

	// —— 2. Chunmyung ——
	const ditch = at('The Sinwon temple ditch', 'scene');
	Object.assign(B[ditch], { jump: { year: 602, en: 'Twelve Years Later…', ko: '열두 해 뒤…' } });
	B.splice(ditch, 0, story('Chunmyung', '천명'));

	// —— 3. Chunchu: his birth replaces the one-line mention ——
	B.splice(
		at('The next spring she gives him a son', 'p'),
		1,
		story('Chunchu', '춘추'),
		scene('The House by the Stream · spring', '개울가 집 · 봄', 603, 'The Next Spring…', '이듬해 봄…'),
		p(
			'Spring comes early that year. The plum by the stream opens a week before the palace trees, and Chunmyung labours all night in the house by the water.',
			'그해 봄은 일찍 온다. 개울가 매화가 궁 안 나무들보다 이레 먼저 피고, 천명은 물가 집에서 밤새 진통을 한다.'
		),
		p(
			'Her husband is not allowed in. He sits on the bank and talks to the stream for nine hours, loudly. The midwives agree it is the worst omen they have ever heard.',
			'남편은 들어오지 못한다. 그는 둑에 앉아 아홉 시간 동안 개울에 대고 떠든다. 큰 소리로. 산파들은 평생 들은 흉조 중에 이게 제일이라고 입을 모은다.'
		),
		p(
			'I was watching again. This time the ground doesn’t shake. The midwife stays, takes her fee, and counts it twice.',
			'나는 이번에도 지켜보고 있었다. 이번엔 땅이 흔들리지 않는다. 산파는 도망가지 않고, 품삯을 받고, 두 번 센다.'
		),
		say('chunmyung', ['들어와.', '안 물어. 아직은.'], ['Come in.', 'He doesn’t bite. Yet.']),
		p(
			'Yongsu holds his son the way you hold something borrowed from a temple.',
			'용수는 절에서 빌려 온 물건을 들듯 아들을 안는다.'
		),
		say('yongsu', ['…날 보네.'], ['…He’s looking at me.']),
		say('chunmyung', ['하루 된 애야. 아무것도 안 봐.'], ['He’s a day old. He isn’t looking at anything.']),
		say('yongsu', ['세고 있어.'], ['He’s counting.']),
		say('chunmyung', ['이름은?'], ['Name?']),
		say('yongsu', ['춘추.'], ['Chunchu.']),
		say('chunmyung', ['봄, 가을.', '…멀쩡한 이름이네.'], ['Spring and autumn.', '…That’s a perfectly sane name.']),
		say('yongsu', ['이 집에 한 사람쯤은 있어야지.'], ['Somebody in this house should have one.']),
		p(
			'Spring and autumn. In the old books it is also the word for a chronicle, the record of who won. Nobody in the room says so. The baby has time.',
			'봄과 가을. 옛 책에서는 연대기를 뜻하는 말이기도 하다. 누가 이겼는지 적어 두는 기록. 방 안의 누구도 그 말을 꺼내지 않는다. 아기에게는 시간이 많다.'
		)
	);

	// —— the queen's errands: the provinces, then the pagoda ——
	B.splice(
		at('The rumour outlives the need for it', 'p') + 1,
		0,
		scene('The provinces · the queen’s errand', '주현 · 여왕의 심부름', 635, 'Three Years Later…', '세 해 뒤…'),
		p(
			'Three winters into her reign, the queen wants somebody to ride out and look at the provinces: the granaries, the forts, the magistrates who write very beautiful reports. She sends two men. One is Supum, an old councillor everybody respects. The other is her brother-in-law.',
			'즉위하고 세 번째 겨울, 여왕은 누군가 말을 타고 나가 지방을 살펴 주기를 바란다. 곡창, 성채, 보고서를 아주 아름답게 쓰는 수령들. 그녀는 두 사람을 보낸다. 하나는 모두가 존경하는 늙은 대신 수품. 다른 하나는 형부다.'
		),
		{
			kind: 'quote',
			hanja: '冬十月 遣伊湌水品·龍樹[一云龍春] 巡撫州縣',
			html: 'Winter, the tenth month. She sent the ichan Supum and Yongsu (some say Yongchun) to tour the provinces and counties and comfort the people.',
			ko: '겨울 10월, 이찬 수품과 용수(용춘이라고도 한다)를 보내 주와 현을 두루 돌며 백성을 위무하게 하였다.',
			source: 'Samguk Sagi (三國史記), Annals of Silla, Queen Sunduk'
		},
		say('supum', ['전하께서 공이 쓸모 있을 거라 하셨소.', '어디에 쓸모 있는지는 말씀 안 하셨고.'], ['Her Majesty says you will be useful.', 'She did not say for what.']),
		say('yongsu', ['저도 못 들었습니다.'], ['She didn’t tell me either.']),
		p(
			'They are gone all winter. Supum inspects the walls. Yongsu reads granary ledgers by lamplight, finds a magistrate who has been counting the same rice twice, and never once mentions a goblin. Supum’s report to the queen is one line longer than usual. The line says the second envoy is not mad.',
			'둘은 겨울 내내 돌아오지 않는다. 수품은 성벽을 살핀다. 용수는 등잔 밑에서 곡창 장부를 읽다가 같은 쌀을 두 번 세어 온 수령 하나를 찾아내고, 도깨비 얘기는 한 번도 꺼내지 않는다. 여왕에게 올라간 수품의 보고서는 평소보다 한 줄 길다. 그 한 줄은, 두 번째 사신은 미치지 않았다는 말이다.'
		),
		scene('Hwangnyong Temple · the nine-storey pagoda', '황룡사 · 구층탑', 645, 'Ten Years Later…', '열 해 뒤…'),
		p(
			'Ten years later the queen wants a tower. Nine storeys of timber in the yard of Hwangnyong Temple, one for each neighbour that troubles Silla, tall enough that all nine can see it.',
			'열 해 뒤, 여왕은 탑을 원한다. 황룡사 마당에 나무로 아홉 층. 신라를 괴롭히는 이웃 하나에 한 층씩, 아홉 나라가 다 볼 수 있을 만큼 높게.'
		),
		p(
			'Nobody in Silla can build it. So she pays silk and treasure to Baekje, the enemy, for a master carpenter named Abiji. Somebody has to stand between one Baekje craftsman and two hundred Silla workmen who would rather not take his orders.',
			'신라에는 그걸 지을 사람이 없다. 그래서 여왕은 비단과 보물을 주고 적국 백제에서 아비지라는 장인을 데려온다. 백제 장인 하나와, 그의 말을 듣기 싫은 신라 일꾼 이백 사이에 누군가 서 있어야 한다.'
		),
		say('sunduk', ['언니가 그러던데요. 형부가 품삯 계산을 잘하신다고.'], ['My sister tells me you’re good with wages.']),
		say('yongsu', ['…아무한테도 말 안 하기로 했는데.'], ['…She promised she’d never tell anyone.']),
		say('sunduk', ['전 아무나가 아니잖아요. 여왕이죠.', '이백 명이에요. 이번엔 다리가 아니라 탑이고.'], ['I’m not anyone. I’m the queen.', 'Two hundred men. A tower this time, not a bridge.']),
		{
			kind: 'quote',
			hanja: '匠名阿非知 受命而來 經營木石 伊干龍春[一云龍樹]幹蠱 率小匠二百人',
			html: 'The craftsman, named Abiji, came at the command and worked the timber and stone. The igan Yongchun (some say Yongsu) oversaw the work, leading two hundred lesser craftsmen.',
			ko: '장인의 이름은 아비지였다. 명을 받고 와서 나무와 돌을 다스렸고, 이간 용춘(용수라고도 한다)이 일을 주관하여 소장 이백 명을 거느렸다.',
			source: 'Samguk Yusa (三國遺事), The Nine-Storey Pagoda of Hwangnyong Temple'
		},
		p(
			'On the day they raise the heart pillar, the Baekje man dreams of his own country burning and puts down his tools. The yard waits. Then, says the record, an old monk and a giant walk out of the Golden Hall, set the pillar up between them, and vanish. Yongsu, who has been accused of keeping that kind of company, says nothing at all.',
			'심주를 세우는 날, 백제 장인은 제 나라가 불타는 꿈을 꾸고 연장을 내려놓는다. 마당이 기다린다. 그러자, 기록에 따르면, 늙은 스님 하나와 장사 하나가 금당에서 걸어 나와 둘이서 기둥을 세우고 사라진다. 그런 무리와 어울린다는 소리를 평생 들어 온 용수는 아무 말도 하지 않는다.'
		),
		p(
			'The tower goes up within the year. From the top you can see the whole city: the palace, the river, and, if you know where to look, a small crooked bridge.',
			'탑은 그해 안에 올라간다. 꼭대기에 서면 도성이 다 보인다. 궁궐, 강, 그리고 어디를 봐야 하는지 안다면, 작고 삐뚤어진 다리 하나.'
		)
	);

	Object.assign(B[at('The Ghost Bridge · morning', 'scene')], {
		label: 'The Ghost Bridge · the morning after',
		ko: '귀교 · 이튿날 아침',
		jump: { year: 653, en: 'Eight Years Later…', ko: '여덟 해 뒤…' }
	});

	set(
		'The tale of the peach-blossom woman',
		'The tale of the peach-blossom woman, the ghost bridge and Gildal the fox is in the Samguk Yusa, which also remembers who stood over the pagoda’s two hundred workmen. The Samguk Sagi gives the Cloud King’s monk’s robe, Jinji’s war and his death, and the queen’s winter errand. The rest, as usual, is family gossip.',
		'복숭아꽃 여인과 귀신 다리, 여우 길달의 이야기는 삼국유사에 있다. 탑을 세운 일꾼 이백 명 위에 누가 서 있었는지도 삼국유사가 기억한다. 구름왕의 승복, 진지왕의 전쟁과 죽음, 여왕의 겨울 심부름은 삼국사기가 전한다. 나머지는 늘 그렇듯 집안 이야기다.'
	);

	console.log('stories:', B.filter((b) => b.kind === 'story').map((b) => b.label).join(' · '), '| blocks:', B.length);
});
