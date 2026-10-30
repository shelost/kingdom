import fs from 'fs';

const path = new URL('../../src/lib/data/story.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const swaps = [
	[
		'The minutes write him dead before the first frost. He leaves no son they will name. The Council decides not to worry about his line. Not yet. The physicians write a long word for what killed him. The servants have a short one. I was at that funeral. I will not tell you whether the box was heavy.',
		'He dies before the first frost. He leaves no son they will name. The Council decides not to worry about his line. Not yet. The physicians write a long word for what killed him. The servants have a short one.'
	],
	[
		'회의록은 첫서리가 내리기 전에 그를 죽은 것으로 적는다. 회의록에 적을 아들은 없다. 회의는 그 가계를 걱정하지 않기로 한다. 아직은. 의원들은 그를 죽인 것에 긴 이름을 붙인다. 하인들에겐 짧은 이름이 있다. 그 장례에 나도 있었다. 상자가 무거웠는지는 말하지 않겠다.',
		'첫서리가 내리기 전에 죽는다. 회의록에 적을 아들은 없다. 회의는 그 가계를 걱정하지 않기로 한다. 아직은. 의원들은 그를 죽인 것에 긴 이름을 붙인다. 하인들에겐 짧은 이름이 있다.'
	],
	[
		'His house dropped a bone in one afternoon, from Sacred to True. Whatever he left behind would go down with it. The house kept a lamp in it. Fifteen winters later a boy left that house in a younger brother’s arms. The minutes never named that boy either.',
		'His house dropped a bone in one afternoon, from Sacred to True. Whatever he left behind would go down with it.'
	],
	[
		'그의 집은 하루 오후 만에 뼈 하나가 내려앉았다. 성골에서 진골로. 그가 무엇을 남겼든, 그것도 함께 내려앉을 것이다. 그 집에는 등이 남아 있었다. 열다섯 겨울이 지난 뒤, 사내아이 하나가 아우의 품에 안겨 그 집을 떠난다. 회의록은 그 아이 이름도 적지 않는다.',
		'그의 집은 하루 오후 만에 뼈 하나가 내려앉았다. 성골에서 진골로. 그가 무엇을 남겼든, 그것도 함께 내려앉을 것이다.'
	],
	[
		'His mother comes once. The minutes write him dead before the first frost, and his house drops a bone, from Sacred to True.',
		'His mother comes once. He dies before the first frost, and his house drops a bone, from Sacred to True.'
	],
	[
		'어머니는 한 번 찾아온다. 회의록은 첫서리 전에 그를 죽은 것으로 적고, 그의 집은 뼈 하나가 내려앉는다. 성골에서 진골로.',
		'어머니는 한 번 찾아온다. 첫서리 전에 죽고, 그의 집은 뼈 하나가 내려앉는다. 성골에서 진골로.'
	],
	[
		'Jinhung’s grandsons part here. Jinpyung’s line keeps the Sacred Bone. The deposed Jinji’s sons drop to True Bone, and so does everyone after them.',
		'Jinhung’s grandsons part here. Jinpyung’s line keeps the Sacred Bone. Jinji’s boy and Biryun’s late son drop to True Bone, and so does everyone after them.'
	],
	[
		'진흥왕의 손자들이 여기서 갈린다. 진평왕의 줄은 성골을 지키고, 폐위된 진지왕의 아들들은 진골로 내려앉는다. 그 뒤로 이어지는 사람들도 모두.',
		'진흥왕의 손자들이 여기서 갈린다. 진평왕의 줄은 성골을 지키고, 진지왕의 아이와 비륜의 늦은 아들은 진골로 내려앉는다. 그 뒤로 이어지는 사람들도 모두.'
	],
	[
		'The king at the top, his daughters on the primary line, his brothers’ houses on the secondary. The deposed Jinji’s sons stand with them, a bone lower than everyone around them.',
		'The king at the top, his daughters on the primary line, his brothers’ houses on the secondary. Jinji’s boy and Biryun’s late son stand with them, a bone lower than everyone around them.'
	],
	[
		'맨 위엔 임금, 직계엔 그의 딸들, 방계엔 아우들의 집. 폐위된 진지왕의 아들들도 그 단에 선다. 둘레의 누구보다 뼈 하나 낮은 자리에.',
		'맨 위엔 임금, 직계엔 그의 딸들, 방계엔 아우들의 집. 진지왕의 아이와 비륜의 늦은 아들도 그 단에 선다. 둘레의 누구보다 뼈 하나 낮은 자리에.'
	],
	[
		'Class 51’s first morning. Packed earth still dark. Bidam is sixteen. His uncle walks him as far as the yard gate and no further. He has never been a man who hovers.',
		'Class 51’s first morning. Packed earth still dark. Bidam is sixteen. His father walks him as far as the yard gate and no further. He has never been a man who hovers.'
	],
	[
		'오십일기의 첫 아침. 다진 흙은 아직 어둡다. 비담은 열여섯. 숙부는 연무장 문까지만 걷는다. 원래 곁에 달라붙는 사람이 아니다.',
		'오십일기의 첫 아침. 다진 흙은 아직 어둡다. 비담은 열여섯. 아버지는 연무장 문까지만 걷는다. 원래 곁에 달라붙는 사람이 아니다.'
	],
	[
		'Bidam’s uncle. A man of few words, and he has saved them all for his brother’s son.',
		'Bidam’s father. A man of few words, and he has saved them all for this morning.'
	],
	[
		'비담의 숙부. 말수가 적은 사람인데, 그 말을 모두 형의 아들을 위해 아껴 두었다.',
		'비담의 아버지. 말수가 적은 사람인데, 그 말을 모두 이 아침을 위해 아껴 두었다.'
	],
	[
		'Before dawn in the open gate of the old house, Biryun ties a purple hwarang headband on his kneeling nephew, the pale road ahead',
		'Before dawn in the open gate of the old house, Biryun ties a purple hwarang headband on his kneeling son, the pale road ahead'
	],
	[
		'Dutch two-shot, timber gate-bar, Class 51 first morning, navy #141C2E, uncle Biryun, beads.',
		'Dutch two-shot, timber gate-bar, Class 51 first morning, navy #141C2E, father Biryun, beads.'
	]
];

const counts = new Map(swaps.map(([old]) => [old, 0]));

function swapString(s) {
	if (typeof s !== 'string') return s;
	for (const [old, neu] of swaps) {
		if (s === old) {
			counts.set(old, counts.get(old) + 1);
			return neu;
		}
	}
	return s;
}

function walk(node) {
	if (Array.isArray(node)) {
		for (let i = 0; i < node.length; i++) node[i] = walk(node[i]);
		return node;
	}
	if (node && typeof node === 'object') {
		for (const k of Object.keys(node)) node[k] = walk(node[k]);
		return node;
	}
	return swapString(node);
}

walk(data);

const epilogue = [
	{
		kind: 'p',
		html: 'You’ve closed both books. One more page. It isn’t his.',
		ko: '두 장부를 덮었다. 페이지가 하나 더 있다. 그의 것은 아니다.'
	},
	{
		kind: 'scene',
		label: 'Prince Biryun’s hall · a winter lamp',
		ko: '비륜 왕자의 전각 · 겨울 등',
		jump: { year: 595, en: 'Fifty-Eight Years Earlier…', ko: '오십팔 년 전…' },
		year: 595
	},
	{
		kind: 'p',
		html: 'The hall waited years. Then a child, at last. The woman who had three kings is holding him. The unlisted brother is already reciting.',
		ko: '그 전각은 몇 해를 기다렸다. 그러다 아이가 왔다. 임금 셋을 거친 여자가 안고 있다. 회의록에 없던 아우는 이미 경전을 읽고 있다.'
	},
	{
		kind: 'card',
		person: 'mishil',
		caption: 'Mishil. Park clan. Three kings’ rooms, and now this hall.',
		ko: '미실. 박씨. 임금 셋의 방, 그리고 이제 이 전각.'
	},
	{
		kind: 'card',
		person: 'sukwon',
		caption: 'Biryun. Jinji’s younger brother. The minutes never listed him.',
		ko: '비륜. 진지왕의 아우. 회의록은 그를 적지 않았다.'
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['있다.', '몇 겨울을 기다렸는데.'],
		en: ['He’s here.', 'After how many winters.']
	},
	{
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		lines: ['세지 마.'],
		en: ['Don’t count them.']
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['난 다 셌어.', '경건한 척하지 마.'],
		en: ['I counted every one.', 'Don’t you dare look pious about it.']
	},
	{
		kind: 'p',
		html: 'He has the house sutra open at the lamp. The next name. He will not take another.',
		ko: '등 곁에 집 경전이 펼쳐져 있다. 다음 이름. 다른 건 쓰지 않을 사람이다.'
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['용수.', '다음이 그거지.', '신라의 거야.'],
		en: ['Yongsu.', 'That’s the next one.', 'It belongs to Silla.']
	},
	{
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		lines: ['이미 있다.'],
		en: ['Taken.']
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['있다?', '누가 경전 이름을 가져가.'],
		en: ['Taken.', 'Who takes a sutra name.']
	},
	{
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		lines: ['서기 하나.', '궁에선 비형이라 부른다.', '이름은 이미 줬다.'],
		en: ['A clerk.', 'The palace calls him Bihyung.', 'The name was already given.']
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['그럼 진지한테 아들이 있었다는 거네.'],
		en: ['That would mean Jinji had a son.']
	},
	{
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		lines: ['그래.'],
		en: ['Yes.']
	},
	{
		kind: 'dialogue',
		chip: '#9a4a6e',
		person: 'mishil',
		lines: ['…그럼 다음.'],
		en: ['…Then the next.']
	},
	{
		kind: 'dialogue',
		chip: '#3d4654',
		person: 'sukwon',
		lines: ['비담.'],
		en: ['Bidam.']
	}
];

let spliced = 0;
for (const ch of data) {
	for (const entry of ch.entries ?? []) {
		if (entry.title !== 'Yongsu') continue;
		const blocks = entry.blocks;
		const i = blocks.findIndex(
			(b) => b.kind === 'p' && typeof b.html === 'string' && b.html.includes('Up in the Moon Palace')
		);
		if (i < 0) throw new Error('Yongsu closer not found');
		blocks.splice(i, 0, ...epilogue);
		spliced++;
	}
}

const missed = [...counts.entries()].filter(([, n]) => n === 0);
if (missed.length) {
	console.error('UNMATCHED:', missed.map(([s]) => s.slice(0, 60)));
	process.exit(1);
}
if (spliced !== 1) {
	console.error('splice count', spliced);
	process.exit(1);
}

fs.writeFileSync(path, JSON.stringify(data, null, '\t') + '\n');
console.log('swaps', Object.fromEntries([...counts.entries()].map(([k, n]) => [k.slice(0, 48), n])));
console.log('spliced', spliced);
