/** Muryuk: Prince / General / Father outline + Hwarang first day + family close. */
import { editStory } from './story-ops.mjs';

const HIDE = [
	'Golden Gaya · eight years later',
	'The road to Surabol',
	'Surabol, the Moon Palace',
	'Surabol, the Gaya house · the first winter',
	'The Gaya house gate · that spring',
	'The Harmony Council · some years on',
	'Surabol · the years after',
	'Surabol, the Gaya house · the next spring',
	'DAY 6'
];

const RENAME = [
	['Prince of Golden Gaya', { label: 'Prince', ko: '왕자' }],
	['The Golden Gaya palace', { label: 'Childhood', ko: '어린 시절' }],
	['The Battle of Golden Gaya', { label: 'Battle of Golden Gaya', ko: '금관가야 전투' }],
	['The pines above the ford', { label: 'Surrender', ko: '항복' }],
	['General of Silla', { label: 'General', ko: '장군' }],
	['The Night Road', { label: 'The Severing', ko: '단절' }],
	['Great Gaya · 562', { label: 'Battle of Great Gaya', ko: '대가야 전투' }],
	['The Cut Rope', { label: 'Sadaham', ko: '사다함' }],
	['Surabol, the Gaya house · eight years after Great Gaya', { label: 'Seohyun', ko: '서현' }]
];

const hwarang = [
	{
		kind: 'scene',
		label: 'Hwarang',
		ko: '화랑',
		year: 585,
		jump: { year: 585, en: 'Fifteen Years Later…', ko: '열다섯 해 뒤…' }
	},
	{
		kind: 'p',
		html: 'The yard is already loud when they arrive. Boys in new blue, a crescent of gold on every brow, and a master who does not wait for anyone’s father.',
		ko: '마당은 도착하기도 전에 시끄럽다. 새 푸른 옷, 미간에 금빛 초승달, 누구 아비도 기다려 주지 않는 스승.'
	},
	{
		kind: 'dialogue',
		person: 'seohyeon',
		en: ['Father. The knot. I— I can’t see it.'],
		lines: ['아버지. 매듭이. 저— 안 보입니다.']
	},
	{
		kind: 'p',
		html: 'Muryuk ties it. Once. The boy’s hands are shaking and his are not.',
		ko: '무력이 매듭을 맨다. 한 번. 아들의 손은 떨리고, 그의 손은 안 떤다.'
	},
	{
		kind: 'dialogue',
		person: 'muryuk',
		en: ['Look up.', 'They will shout. You will not.'],
		lines: ['고개 들어.', '소리 지를 기다. 니는 말고.']
	},
	{
		kind: 'dialogue',
		person: 'seohyeon',
		en: ['What if I do it wrong.'],
		lines: ['잘못하면요.']
	},
	{
		kind: 'dialogue',
		person: 'muryuk',
		en: ['Then do it again tomorrow.', 'A boy I knew was your age. He took a gate.'],
		lines: ['그라믄 내일 다시 해.', '니 나이 놈이 하나 있었다. 성문을 열었지.']
	},
	{
		kind: 'p',
		html: 'He does not say the name. The yard already has a song for that boy. Seohyun will learn it whether anyone wants him to or not.',
		ko: '이름은 대지 않는다. 마당엔 그 아이 노래가 이미 있다. 서현은 누가 바라든 말든 배우게 된다.'
	},
	{
		kind: 'p',
		html: 'At dusk the boy comes home with the headband crooked and a mouth full of other boys’ names. Class Twenty-Six, he says, and he said the number wrong, and his mother does not laugh.',
		ko: '해 질 녘, 아이는 머리띠를 삐뚤게 매고 남의 이름만 잔뜩 들고 온다. 이십육기랍니다, 하고, 숫자도 틀렸답니다. 어미는 웃지 않는다.'
	},
	{
		kind: 'dialogue',
		person: 'seohyeon',
		en: ['They made me Class Twenty-Six. I said the number wrong.'],
		lines: ['이십육기라 했습니다. 숫자도 틀렸습니다.']
	},
	{
		kind: 'dialogue',
		person: 'muryuk',
		en: ['Say it again tomorrow.'],
		lines: ['내일 다시 말해라.']
	},
	{
		kind: 'p',
		html: 'The helm sits on its stand by the door. He leaves it there.',
		ko: '투구는 문가 받침대에 있다. 그대로 둔다.'
	},
	{
		kind: 'p',
		html: 'His wife is in the door. His brothers are late, as usual. The wall is still a hand lower than the neighbour’s. The roof does not leak.',
		ko: '아내는 문간에 있다. 형들은 늘 그렇듯 늦다. 담은 이웃보다 한 뼘 낮다. 지붕은 안 샌다.'
	},
	{
		kind: 'p',
		html: 'He watches the three of them in the one room. The house Silla gave them. The son who came home.',
		ko: '한 방에 셋이 있는 걸 본다. 신라가 준 집. 돌아오는 아들.'
	},
	{
		kind: 'p',
		html: 'He is glad. He is allowed to be.',
		ko: '그는 좋다. 좋아도 된다.'
	}
];

const out = editStory((story) => {
	const chs = story.chapters ?? story;
	let e;
	for (const c of chs) {
		e = c.entries?.find((x) => x.title === 'Muryuk');
		if (e) break;
	}
	if (!e) throw new Error('Muryuk not found');
	const blocks = e.blocks;

	for (const [label, next] of RENAME) {
		const b = blocks.find((x) => (x.kind === 'story' || x.kind === 'scene') && x.label === label);
		if (!b) throw new Error(`missing plate: ${label}`);
		b.label = next.label;
		b.ko = next.ko;
	}

	for (const label of HIDE) {
		const b = blocks.find((x) => (x.kind === 'scene' || x.kind === 'day') && x.label === label);
		if (!b) throw new Error(`missing hide: ${label}`);
		b.outline = false;
	}

	const married = blocks.findIndex(
		(b) => b.kind === 'scene' && b.label === 'Surabol, the Gaya house · the next spring'
	);
	if (married < 0) throw new Error('marriage plate missing');
	if (!blocks.some((b) => b.kind === 'story' && b.label === 'Father')) {
		blocks.splice(married, 0, { kind: 'story', label: 'Father', ko: '아버지' });
	}

	if (!blocks.some((b) => b.kind === 'scene' && b.label === 'Hwarang')) {
		const day = blocks.findIndex((b) => b.kind === 'day' && b.label === 'DAY 6');
		if (day < 0) throw new Error('DAY 6 missing');
		blocks.splice(day, 0, ...hwarang);
	}

	return { stories: blocks.filter((b) => b.kind === 'story').map((b) => b.label) };
});

console.log(out);
