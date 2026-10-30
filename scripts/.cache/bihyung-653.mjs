// Bihyung moves to 653: Yongsu and Chunmyung die together the year the Council names Chunchu heir.
// Adds the royal-line ladder to Bihyung and the True Bone ladder to Gi; takes Yongsu's 648 homecoming out of Huangdi.
// Usage: node scripts/.cache/bihyung-653.mjs   (idempotent)
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const entries = story.flatMap((c) => c.entries ?? []);
const find = (title) => entries.find((e) => e.title === title);
const plain = (b) => (b.html ?? (b.en ?? []).join(' / ') ?? b.label ?? '').replace(/<[^>]+>/g, '');
const idx = (e, frag, from = 0) => e.blocks.findIndex((b, i) => i >= from && (plain(b).includes(frag) || (b.label ?? '').includes(frag)));
const must = (i, what) => {
	if (i < 0) throw new Error(`not found: ${what}`);
	return i;
};

const p = (html, ko) => ({ kind: 'p', html, ko });
const say = (person, en, lines) => ({ kind: 'dialogue', ...(person ? { person } : {}), lines, en });

/* ——— Huangdi: no homecoming; Yongsu lives five more years ——— */
const huangdi = find('Huangdi (皇帝)');
const home = huangdi.blocks.findIndex((b) => b.kind === 'scene' && b.label === 'The House by the Stream');
if (home >= 0) {
	const goIn = must(idx(huangdi, 'I know. Go in.', home), 'Go in');
	huangdi.blocks.splice(home, goIn - home + 1);
}

/* ——— Bihyung ——— */
const bi = find('Bihyung');
bi.year = '653';
if (!bi.blocks.some((b) => b.kind === 'card' && b.person === 'chunmyung' && b.tab === 'epitaph')) {
	const start = must(idx(bi, 'The House by the Stream · that winter'), 'frame scene');
	const end = must(bi.blocks.findIndex((b) => b.kind === 'card' && b.person === 'yongsu' && b.tab === 'epitaph'), 'yongsu card');
	const reveal = [
		must(idx(bi, 'The bridge. You paid for it.'), 'reveal 1'),
		must(idx(bi, 'Mad men don’t get voted on.'), 'reveal 2'),
		must(idx(bi, 'You could have told me.'), 'reveal 3'),
		must(idx(bi, 'That was the hardest part of the act.'), 'reveal 4')
	].map((i) => bi.blocks[i]);
	const talk = bi.blocks[must(idx(bi, 'The old man talks most of the night'), 'night talk')];
	const oh = bi.blocks[must(idx(bi, 'Seventy years I’ve been talking to you people.'), 'oh')];
	const question = bi.blocks[must(idx(bi, 'Were you a madman, or a father?'), 'question')];
	const answer = bi.blocks[must(idx(bi, '…In this city?'), 'answer')];
	const frame = [
		{ kind: 'scene', label: 'The House by the Stream · the year before the crown', ko: '개울가 집 · 즉위 전해' },
		p(
			'Kim Yongsu is seventy-eight. Princess Chunmyung is seventy-three. They have shared a bed for fifty-one years, and now they are dying in it, side by side, on the same night, which is very like them.',
			'김용수는 일흔여덟, 천명공주는 일흔셋이다. 둘은 쉰한 해를 한 이부자리에서 잤고, 이제 그 자리에서 나란히, 같은 밤에 죽어 가는 중이다. 참 그 둘다운 일이다.'
		),
		p(
			'Their son kneels at the foot of the bed. Chunchu is fifty. The Secretariat writes what he wants, the Council has learned to agree with it, and this afternoon six sleeves went up for the next king. His name was under every one.',
			'아들이 침상 발치에 무릎을 꿇는다. 춘추는 쉰이다. 집사부는 그가 원하는 대로 쓰고, 회의는 그걸 따르는 법을 익혔다. 오늘 오후, 다음 임금을 두고 소매 여섯이 올라갔다. 소매마다 그의 이름이 있었다.'
		),
		say('chunchu', ['Father. Mother.', 'The Council voted today. Six to none.'], ['아버지. 어머니.', '오늘 회의가 표결했습니다. 여섯 대 영입니다.']),
		say('chunmyung', ['We heard. The whole street heard.', 'Your father made the servants say it three times.'], ['들었다. 온 동네가 들었어.', '네 아버지가 하인들한테 세 번이나 다시 말하게 하더라.']),
		say('yongsu', ['My father fell off the side of the tree.', '…And you climbed back up to the trunk.', 'Our side line. The primary line, now. You did that.'], ['내 아버지는 나무 곁가지로 떨어졌지.', '…그런데 네가 줄기로 도로 기어올랐구나.', '곁가지였던 우리 줄이, 이제 직계다. 네가 한 거다.']),
		say('chunchu', ['You told me to stay out of that room.', 'I went in anyway. I’m sorry.'], ['그 방엔 들어가지 말라고 하셨지요.', '그래도 들어갔습니다. 죄송합니다.']),
		say('yongsu', ['Don’t be.', 'You didn’t amuse it. You bought it.'], ['미안해하지 마라.', '넌 그 방을 즐겁게 해 준 게 아니야. 그 방을 샀지.']),
		say('yongsu', ['Sit down. There’s something I should have told you about Gildal.'], ['앉아라. 길달 얘기를 진작 해 줬어야 했는데.']),
		{ kind: 'scene', label: 'The House by the Stream · before light', ko: '개울가 집 · 동트기 전' },
		talk,
		...reveal,
		p(
			'Then both of them look past their son to the corner of the room, and their faces change. Chunchu turns. There is nobody there. There is somebody there.',
			'그때 두 사람이 아들 너머 방구석을 보더니 얼굴빛이 바뀐다. 춘추가 돌아본다. 아무도 없다. 누군가 있다.'
		),
		p(
			'A man in a wide black gat stands by the brazier with a ledger under his arm. He reads two names, three times each. Yongsu. Yongsu. Yongsu. Chunmyung. Chunmyung. Chunmyung.',
			'챙 넓은 검은 갓을 쓴 사내가 장부를 옆구리에 끼고 화로 곁에 서 있다. 그는 이름 둘을 세 번씩 읽는다. 용수. 용수. 용수. 천명. 천명. 천명.'
		),
		oh,
		question,
		answer,
		say('kangrim', ['I’ll write both.', 'Princess. One question for you as well.', 'When you chose the madman, did you choose the man, or the act?'], ['둘 다 적겠소.', '공주께도 하나 묻겠소.', '그 미치광이를 고를 때, 사내를 고른 것이오, 연극을 고른 것이오?']),
		say('chunmyung', ['I chose the sums.', '…He was very good at sums.'], ['셈을 골랐지.', '…저 사람, 셈을 아주 잘했거든.']),
		say('kangrim', ['Then the ledger agrees with you.', 'Come, both of you. The stream is this way.'], ['그럼 장부도 공주 편이오.', '두 분 다 갑시다. 개울은 이쪽이오.']),
		p(
			'They turn on the pillow to face each other. Fifty-one years, and they still look at each other the way two people look at a bridge they built in the dark.',
			'두 사람이 베개 위에서 서로를 향해 돌아눕는다. 쉰한 해가 지났는데도, 어둠 속에서 함께 놓은 다리를 바라보듯 서로를 바라본다.'
		),
		p(
			'Chunchu does not see the man in the gat take them. He sees them stop on the same breath, still looking.',
			'춘추는 갓 쓴 사내가 둘을 데려가는 것을 보지 못한다. 그가 보는 건, 둘이 같은 숨에서 멈추는 모습이다. 여전히 서로를 보면서.'
		),
		{
			kind: 'verse',
			color: '#4a4a58',
			person: 'yongsu',
			title: 'The Goblin and the Princess',
			titleKo: '도깨비와 공주',
			lines: ['김용수와 천명공주, 개울가 두 사람', '밤마다 혼잣말, 공주님은 셈을 봤지', '어허 어허, 잘 가거라', '하룻밤에 돌다리, 품삯은 몰래', '“날 데려가요” 공주님이 골랐지', '어허 어허, 잘 가거라', '쉰한 해 한 베개, 같은 숨에 멈추고', '서로 보며 나란히 다리를 건너네', '어허 어허, 잘 가거라'],
			en: ['Kim Yongsu and Princess Chunmyung, two by the stream:', 'he talked all night, and she checked his sums.', 'Eo-heo, eo-heo, off you go', 'A bridge in a night, the masons paid in the dark —', '“Take me,” said the princess, and she chose the mark.', 'Eo-heo, eo-heo, off you go', 'Fifty-one years on one pillow, one breath at the end,', 'side by side they cross the bridge, still looking, friend to friend.', 'Eo-heo, eo-heo, off you go'],
			refrain: [2, 5, 8]
		},
		{
			kind: 'card',
			person: 'yongsu',
			tab: 'epitaph',
			caption: 'Kim Yongsu, son of a deposed king. He talked to the dark for forty years so nobody would count his house.',
			ko: '폐위된 임금의 아들 김용수. 집안이 셈에 오르지 않도록 사십 년을 어둠에 말을 걸었다.'
		},
		{
			kind: 'card',
			person: 'chunmyung',
			tab: 'epitaph',
			caption: 'Princess Chunmyung, the king’s elder daughter. She took a joke as a promise and married the madman by the stream.',
			ko: '임금의 맏딸 천명공주. 농담을 약속으로 듣고 개울가 미치광이에게 시집갔다.'
		}
	];
	bi.blocks.splice(start, end - start + 1, ...frame);
}

/* the royal-line ladder, after the family tree */
if (!bi.blocks.some((b) => b.diagram === 'royal-lines')) {
	const tree = must(bi.blocks.findIndex((b) => b.diagram === 'silla-royal'), 'family tree');
	bi.blocks.splice(
		tree + 1,
		0,
		p(
			'Even inside the royal house, nobody is simply royal. There is the primary line: the reigning king, his children, the house that holds the crown. One branch off the trunk are the secondary lines, a king’s brothers, uncles and cousins. Two branches off are the tertiary lines. Past those are the peripheral lines, who keep the name and very little else. Where you stand depends on one thing: how far you are from whoever wears the crown this year.',
			'왕실 안에서도 그냥 왕족인 사람은 없다. 직계가 있다. 지금 임금과 그 자식들, 왕관을 쥔 집. 줄기에서 한 가지 갈라진 곳에 방계가 있다. 임금의 형제, 숙부, 사촌들. 두 가지 갈라지면 원방계다. 그 너머는 말계, 이름만 남고 남은 게 별로 없는 집들이다. 어디에 서는지는 딱 하나로 정해진다. 올해 왕관을 쓴 사람에게서 얼마나 멀리 있느냐.'
		),
		{
			kind: 'diagram',
			diagram: 'royal-lines',
			step: 'jinpyung',
			title: 'Royal lines · 직계와 방계',
			caption: 'Under King Jinpyung: his own house on the top rung, and the deposed Jinji’s son one branch down.',
			ko: '진평왕 시절. 맨 윗단엔 임금의 집, 폐위된 진지왕의 아들은 한 가지 아래.'
		},
		p(
			'Jinji’s fall moved his son off the trunk in a single afternoon. And a side branch with a better claim than the trunk is the most dangerous thing in any palace.',
			'진지왕이 쫓겨나던 그날 오후, 그 아들은 줄기에서 떨려 나갔다. 그리고 줄기보다 명분이 좋은 곁가지는, 어느 궁에서나 제일 위험한 물건이다.'
		)
	);
}
const thirty = idx(bi, 'He will go on thinking so for thirty-six years.');
if (thirty >= 0) {
	bi.blocks[thirty].html = bi.blocks[thirty].html.replace('thirty-six years. He will be wrong for all thirty-six', 'forty-one years. He will be wrong for all forty-one');
	bi.blocks[thirty].ko = bi.blocks[thirty].ko.replace('서른여섯 해 동안 이어진다. 서른여섯 해 내내', '마흔한 해 동안 이어진다. 마흔한 해 내내');
}
/* the ladder again at the end: his line on the top rung */
if (!bi.blocks.some((b) => b.diagram === 'royal-lines' && b.step === 'muyeol')) {
	const words = must(idx(bi, 'Then he says something to the water.'), 'water');
	bi.blocks.splice(
		words + 1,
		0,
		p(
			'In a few months the crown will sit on his head, and the tree will quietly redraw itself around him. The side branch his grandfather fell onto becomes the trunk. Everyone who looked down on it now has to look up.',
			'몇 달 뒤 왕관이 그의 머리에 얹히면, 나무는 그를 중심으로 조용히 다시 그려진다. 할아버지가 떨어진 곁가지가 줄기가 된다. 그 가지를 내려다보던 사람들은 이제 올려다봐야 한다.'
		),
		{
			kind: 'diagram',
			diagram: 'royal-lines',
			step: 'muyeol',
			title: 'Royal lines · 새 직계',
			caption: 'Under King Muyeol: Chunchu’s house on the top rung.',
			ko: '무열왕 시절. 맨 윗단엔 춘추의 집.'
		}
	);
}

/* ——— Gi: the rungs inside the True Bone ——— */
const gi = find('Gi (起)');
if (!gi.blocks.some((b) => b.diagram === 'true-bone-tiers')) {
	const gaya = must(idx(gi, 'A word you shout at a man’s gate comes back to your own.'), 'Gaya line');
	gi.blocks.splice(
		gaya + 1,
		0,
		p(
			'Everyone in that tent is True Bone, and none of them is equal. At the top are the direct lines of the six founding elders, eldest son of eldest son: Bidam’s house. Below them, the same six surnames down a younger son’s road. Then old Saro blood, houses that sat in council when the Parks were kings. Then new Silla blood, risen under the Seok and Kim kings. And at the bottom, the assimilants: royalty from somewhere Silla swallowed. The Gaya Kims, for instance.',
			'그 막사 안 사람은 모두 진골이다. 그리고 아무도 같지 않다. 맨 위는 여섯 촌장의 직계, 장자의 장자로 이어진 집. 비담의 집이다. 그 아래는 같은 여섯 성씨의 작은아들 줄. 그다음은 사로의 옛 피, 박씨가 임금이던 시절 회의에 앉던 집들. 그다음은 신라의 새 피, 석씨와 김씨 임금 밑에서 올라온 집들. 그리고 맨 아래가 귀부 가문이다. 신라가 삼킨 어딘가의 왕족. 이를테면 가야 김씨.'
		),
		{
			kind: 'diagram',
			diagram: 'true-bone-tiers',
			step: 'full',
			title: 'Inside the True Bone · 진골 안의 서열',
			caption: 'Five rungs on one rank. Bidam stands on the first. Yushin, the Sword of Silla, stands on the last.',
			ko: '한 품계 안의 다섯 단. 비담은 첫 단에, 신라의 칼 유신은 마지막 단에 선다.'
		},
		p(
			'Yumjong knows all this. So does every man in the outer works. That is why the word works.',
			'염종도 다 안다. 외성의 사내들도 다 안다. 그래서 그 말이 먹히는 것이다.'
		)
	);
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('Huangdi', huangdi.blocks.length, '· Bihyung', bi.year, bi.blocks.length, '· Gi', gi.blocks.length);
