// White River: Abe no Hirafu speaks the night-council line and turns the rear fleet home.
import fs from 'node:fs';

const STORY = 'src/lib/data/story.json';
const story = JSON.parse(fs.readFileSync(STORY, 'utf8'));
const en = story.flatMap((c) => c.entries ?? []).find((e) => e.title === 'White River');
const find = (needle) => {
	const i = en.blocks.findIndex((b) => JSON.stringify(b).includes(needle));
	if (i < 0) throw new Error(`missing block: ${needle}`);
	return i;
};

const council = en.blocks[find('hold council on a deck')];
council.html =
	'That night the Yamato captains and the king of Baekje hold council on a deck, and nobody looks at the sky. Abe no Hirafu does most of the talking. He is the rear general, a big man in a wolf-fur mantle who spent three summers chasing the Emishi along the cold northern coast, and he has the habit of men who have lived through bad water: he believes the sea gives way to whoever moves first.';
council.ko =
	'그날 밤 야마토의 장수들과 백제왕은 갑판 위에서 군의를 연다. 아무도 하늘을 보지 않는다. 말은 대부분 아베노 히라부가 한다. 후장군인 그는 늑대 털 망토를 두른 덩치 큰 사내로, 세 해 여름을 북쪽 찬 바다 해안에서 에미시를 쫓으며 보냈다. 험한 물에서 살아 돌아온 사람들의 버릇이 그에게도 있다. 바다는 먼저 움직이는 쪽에 길을 내준다고 믿는 것이다.';

const i = find('Yesterday was the vanguard');
const line = en.blocks[i];
delete line.speaker;
delete line.chip;
line.person = 'abe';
line.en = [
	'Yesterday was the vanguard. Today it’s all of us!',
	'Ha— we go first. Whoever hits first, the other side gives way. That’s the sea. Every sea.'
];
line.lines = ['어제 건 선봉이었소. 오늘은 전부 가는 거요!', '하— 우리가 먼저 치는 거요. 먼저 들이받는 쪽 앞에서 저쪽은 물러나게 돼 있소. 바다란 게 그렇소. 어느 바다든.'];
en.blocks[i] = Object.fromEntries(Object.entries(line).sort(([a], [b]) => ['kind', 'person', 'en', 'lines'].indexOf(a) - ['kind', 'person', 'en', 'lines'].indexOf(b)));

const TURN = 'He turns them for home';
if (!JSON.stringify(en.blocks).includes(TURN)) {
	const after = find('A river mouth is a judge');
	en.blocks.splice(after + 1, 0, {
		kind: 'p',
		html: 'At the back of the fleet Abe no Hirafu’s ships are still afloat. He has seen a lost tide before, on a colder sea. He turns them for home and hauls in every swimmer the hulls will carry, men in half their armour, men with no oars, and he does not laugh again until Tsukushi.',
		ko: '함대 맨 뒤에서 아베노 히라부의 배들은 아직 떠 있다. 진 물때는 전에도 본 적이 있다. 더 찬 바다에서. 그는 뱃머리를 고향으로 돌리고, 배가 버틸 수 있는 만큼 헤엄치는 자들을 끌어올린다. 갑옷을 반쯤 벗은 자, 노도 없는 자. 그리고 쓰쿠시에 닿을 때까지 다시는 웃지 않는다.'
	});
}

fs.writeFileSync(STORY, JSON.stringify(story, null, '\t') + '\n');
console.log('ok');
