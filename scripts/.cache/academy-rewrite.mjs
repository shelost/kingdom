// Academy (641): the Yeon boys' first year at the Tehak, Yeon's quiet takeover of the school in the background.
import fs from 'node:fs';
const F = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(F, 'utf8'));
const entry = story.flatMap((p) => p.entries).find((e) => e.title === 'Academy');
if (!entry) throw new Error('Academy missing');
const old = entry.blocks;

/** Speaker chips as the book already colours them. */
const chips = {};
for (const p of story) for (const e of p.entries) for (const b of e.blocks) if (b.kind === 'dialogue' && b.person && b.chip) chips[b.person] ??= b.chip;
const d = (person, en, lines) => ({ kind: 'dialogue', person, ...(chips[person] ? { chip: chips[person] } : {}), lines, en });
const sp = (speaker, chip, en, lines) => ({ kind: 'dialogue', speaker, chip, lines, en });
const p = (html, ko) => ({ kind: 'p', html, ko });
const day = (label, ko) => ({ kind: 'day', label, ko });
const scene = (label, ko) => ({ kind: 'scene', label, ko });
const MASTER = '#8aafa0';

const keep = (i) => {
	if (!old[i]) throw new Error('missing block ' + i);
	return old[i];
};

const supper = { ...keep(35) };
supper.html = 'The complaint reaches the High Commander’s table before the year is out. It is written in a monk’s neat hand. Gusesa reads it at supper, between courses.';
supper.ko = '고발장은 해가 가기 전에 막리지의 상에 오른다. 승려의 단정한 글씨다. 구세사는 저녁을 들다가, 국과 국 사이에 그것을 읽는다.';

entry.place = 'taehak';
entry.blocks = [
	keep(0), keep(1), keep(2), keep(3), keep(4), keep(5), keep(6), keep(7), keep(8),
	keep(9), keep(10), keep(11), keep(12), keep(13), keep(14),

	day('SPRING', '봄'),
	keep(15), keep(16), keep(17), keep(18), keep(19), keep(20), keep(21), keep(22), keep(23),
	keep(24), keep(25), keep(26), keep(27), keep(28), keep(29), keep(30), keep(31), keep(32), keep(33),

	p('That is the first day. The rest of the term goes the way first terms go.', '그게 첫날이다. 나머지 학기는 첫 학기가 늘 그렇듯 흘러간다.'),
	p(
		'Namseng is good at the Analects the way some boys are good at being tall. He recites, the masters nod, and the older boys stop calling him the Commander’s pup. Now they call him the Commander’s parrot.',
		'남생은 논어를 잘한다. 어떤 아이들이 키가 큰 것처럼 그냥 잘한다. 외우면 스승들이 고개를 끄덕이고, 큰 아이들은 그를 대가 집 강아지라 부르던 것을 그만둔다. 이제는 대가 집 앵무새라 부른다.'
	),
	p(
		'Namgun is not enrolled. Namgun is four. He comes anyway, every day, on the back of whatever horse is leaving the house, and sits under the archery range eating dried persimmons.',
		'남건은 입학하지 않았다. 남건은 네 살이다. 그래도 매일 온다. 집을 나서는 아무 말 뒤에 올라타고 와서, 활터 아래에 앉아 곶감을 먹는다.'
	),
	sp('An older boy', '#8a8a94', ['Your father kicks monks.', 'Does he kick you too, parrot?'], ['너희 아버지 스님 걷어찬다며.', '너도 차이냐, 앵무새야?']),
	d('namseng', ['My father keeps the east.', 'Yours keeps a stable.'], ['우리 아버지는 동쪽을 지켜.', '너희 아버지는 마구간을 지키고.']),
	p('Before that can turn into a fight, Namgun has already bitten someone.', '그게 싸움이 되기도 전에, 남건이 벌써 누군가를 물었다.'),
	d('namgun', ['Say sorry to my brother!', '…Say sorry or I bite the other hand.'], ['우리 형한테 사과해!', '…안 하면 다른 손도 문다.']),
	d('namseng', ['Namgun. You do not bite the sons of commanders.', '…Which hand?'], ['남건아. 대가 집 아들은 무는 거 아니야.', '…어느 손 물었어?']),
	p(
		'The masters punish Namseng, because he is old enough to be responsible and Namgun is not old enough to be enrolled. Namseng copies the chapter on filial piety forty times. Namgun sits beside him and fills the margins with horses.',
		'스승들은 남생을 벌한다. 남생은 책임질 나이고, 남건은 입학할 나이도 안 됐으니까. 남생은 효에 관한 장을 마흔 번 베껴 쓴다. 남건은 그 옆에 앉아 여백마다 말을 그려 넣는다.'
	),

	day('SUMMER', '여름'),
	p('Summer is when the money arrives.', '여름에는 돈이 온다.'),
	p(
		'The Tehak owes rice. It has owed it for thirty years to the monasteries that feed its students, at a rate the monasteries call charity and the bursar calls interest. In the fourth month the debt is paid off in full, in Eastern rice, on Eastern carts. Nobody asks whose. Everybody knows.',
		'태학은 쌀을 빚지고 있다. 학생들을 먹이는 절에 삼십 년째 빚을 졌는데, 절에서는 그 이자를 자비라 부르고 서기는 이자라 부른다. 사월에 그 빚이 한꺼번에 갚아진다. 동부의 쌀이 동부의 수레에 실려 온다. 누구 것이냐고 묻는 사람은 없다. 다들 안다.'
	),
	sp('Tehak Master', MASTER, ['Commander. The Academy is… grateful.', 'May I ask what the Academy owes you now?'], ['대가. 태학이… 감사하고 있습니다.', '이제 태학이 대가께 무엇을 빚졌는지 여쭤도 되겠습니까?']),
	d('gesomun', ['A chair.', 'One empty chair in the main hall, and a man of my choosing in it.'], ['의자 하나.', '본당에 빈 의자 하나. 거기 내가 고른 사람이 앉는다.']),
	p(
		'The man he chooses is old, and has been in Pyongyang longer than Yeon has been alive. He came with an embassy from the West seventeen winters ago to read the Way of Laozi to the late king, and was forgotten when the king stopped listening. Since then he has lived on a temple’s leftovers. Yeon finds him there, gives him a stipend and a new robe, and moves him into the Tehak.',
		'그가 고른 사람은 늙었고, 연이 태어나기도 전부터 평양에 있었다. 열일곱 해 전 겨울 서국 사신단을 따라와 선왕에게 노자의 도를 읽어 주었고, 왕이 귀를 닫자 잊혔다. 그 뒤로 절에서 남긴 밥으로 살았다. 연은 거기서 그를 찾아내 녹봉과 새 옷을 주고 태학으로 옮긴다.'
	),
	sp('The Daoist Reader', '#9aa58a', ['Commander, I teach the Way. The Way says the best ruler is one the people barely know is there.'], ['대가, 나는 도를 가르치오. 도에 이르기를, 가장 좋은 임금은 백성이 있는 줄도 잘 모르는 임금이라 했소.']),
	d('gesomun', ['Then you’ll like me. I’m hardly ever home.'], ['그럼 나 좋아하겠네. 난 집에 붙어 있질 않으니까.']),
	p(
		'The sutra class is not abolished. That would be loud. It is moved: from the main hall to the east room, then from the morning to the afternoon, then to the afternoon of archery day, when no boy with a bow in his hand will sit for the Lotus Sutra. By midsummer Boduk teaches four students. By autumn, one.',
		'불경 수업은 없애지 않는다. 없애면 시끄러우니까. 옮길 뿐이다. 본당에서 동쪽 방으로, 아침에서 오후로, 다시 활 쏘는 날 오후로. 활을 쥔 아이가 법화경을 들으러 앉을 리 없다. 한여름이 되자 보덕의 학생은 넷이다. 가을이 되자 하나다.'
	),

	day('AUTUMN', '가을'),
	p('The one is Namseng.', '그 하나가 남생이다.'),
	p(
		'He goes in secret, which for a seven-year-old means he tells exactly one person. Namgun keeps the secret for most of a day.',
		'그는 몰래 다닌다. 일곱 살에게 몰래란 딱 한 사람에게만 말한다는 뜻이다. 남건은 그 비밀을 거의 하루 종일 지킨다.'
	),
	d('namgun', ['Father! Brother’s going to the monk!', '…I didn’t tell. I said it loud. That’s different.'], ['아버지! 형이 스님한테 가요!', '…말한 거 아니에요. 크게 말한 거지.']),
	p(
		'Yeon does not shout. That is worse. He puts Namseng up on his saddle and rides him to the Tehak’s east room, where Boduk is teaching nobody.',
		'연은 소리치지 않는다. 그게 더 무섭다. 그는 남생을 안장 앞에 태우고 태학의 동쪽 방으로 간다. 보덕이 아무도 없는 방에서 가르치고 있다.'
	),
	d('gesomun', ['Well? What’s he teach you, then?'], ['그래. 저 중이 뭘 가르치더냐?']),
	d('namseng', ['Forbearance, Father.', 'He says the strongest thing in the world is the one that does not hit back.'], ['인욕입니다, 아버지.', '세상에서 가장 센 것은 되받아치지 않는 것이라 하셨습니다.']),
	d('gesomun', ['Aye? Then he’s the strongest man in Pyongyang. I’ve been hitting him all year.', 'Go on. Finish the lesson. Then come home and tell your brother something he can’t shout.'], ['그래? 그럼 저 중이 평양에서 제일 센 놈이구나. 내가 일 년 내내 때렸는데.', '가라. 마저 배워. 그리고 집에 와서 네 동생이 떠들 수 없는 걸 말해 줘라.']),
	p(
		'Boduk teaches the lesson to the end, to one boy, in an empty room. He has a talent for empty rooms. One day, the storytellers say, he will pick up his whole hall and carry it south, roof and all, to a country that still wants it.',
		'보덕은 빈 방에서 아이 하나를 앞에 두고 수업을 끝까지 한다. 그는 빈 방에 재주가 있다. 이야기꾼들 말로는, 언젠가 그가 법당을 통째로 들어 지붕째 남쪽으로 날려 보낸다고 한다. 아직 그것을 원하는 나라로.'
	),

	day('WINTER', '겨울'),
	keep(34), supper, keep(36), keep(37), keep(38), keep(39), keep(40),
	p(
		'By the new year three county schools in the east have the same empty chair, and the same old man’s pupils in it. That is how Yeon does everything: one room, then the room next door. In a few years every school in the country will teach what this one teaches, and the men who used to teach it will be sweeping other people’s yards.',
		'새해가 되자 동부의 고을 학교 세 곳에 같은 빈 의자가 생기고, 그 노인의 제자들이 앉는다. 연은 무엇이든 이렇게 한다. 방 하나, 그다음은 옆방. 몇 해 지나면 이 나라의 모든 학교가 이 학교에서 가르치는 것을 가르치게 되고, 원래 가르치던 사람들은 남의 마당을 쓸게 된다.'
	),

	scene('The Boys’ Room', '아이들 방'),
	p(
		'The boys share a room, because it is a commander’s house and not a palace. Namsan sleeps between his brothers like a sack of rice nobody wants to carry.',
		'아이들은 한 방을 쓴다. 대가의 집이지 궁궐이 아니니까. 남산은 아무도 들고 싶어 하지 않는 쌀자루처럼 두 형 사이에서 잔다.'
	),
	d('namgun', ['Brother. When Father dies, who gets the seal?'], ['형. 아버지 돌아가시면 인장은 누가 가져?']),
	d('namseng', ['The eldest.', 'That’s me.'], ['맏아들.', '나야.']),
	d('namgun', ['Then I’ll win all the fights for you.', '…And if you lose it, I’ll take it back.'], ['그럼 싸움은 내가 다 이겨 줄게.', '…형이 잃어버리면 내가 도로 가져오고.']),
	d('namseng', ['I won’t lose it.'], ['안 잃어버려.']),
	d('namsan', ['…Brother.'], ['…형.']),
	p(
		'Namsan, two, says the only word he has and reaches across Namseng for the other brother. Nobody notices. Gulgul, at the door with his back to the wall, notices everything.',
		'두 살 남산이 가진 말 하나를 하고는, 남생을 넘어 다른 형 쪽으로 손을 뻗는다. 아무도 눈치채지 못한다. 등을 벽에 대고 문가에 선 걸걸만 모든 걸 본다.'
	),
	p(
		'On the days the Daoist reader is ill, Namseng reads his father’s copy of the Daodejing, which has never been opened past the first page.',
		'도사가 앓아눕는 날이면 남생은 아버지의 도덕경을 읽는다. 첫 장 너머로는 한 번도 펼쳐진 적 없는 책이다.'
	),
	keep(42)
];
fs.writeFileSync(F, JSON.stringify(story, null, '\t') + '\n');
console.log('Academy blocks:', entry.blocks.length);
